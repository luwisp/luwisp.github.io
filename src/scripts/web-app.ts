import { webApp } from "../config/apps";

const webOpenKey = "luorong.notes.open-web";
const webHrefKey = "luorong.notes.web-href";
const webViewKey = "luorong.notes.web-view";

type WebView = "home" | "bookmarks" | "error";

interface StoredWebView {
  href: string;
  view: WebView;
  address?: string;
}

function readStoredView() {
  try {
    return JSON.parse(sessionStorage.getItem(webViewKey) || "null") as StoredWebView | null;
  } catch {
    return null;
  }
}

function writeStoredView(value: StoredWebView) {
  try {
    sessionStorage.setItem(webViewKey, JSON.stringify(value));
  } catch {
    // The browser app still works without session persistence.
  }
}

function currentHref() {
  return `${location.pathname}${location.search}${location.hash}`;
}

function storedWebHref() {
  try {
    return sessionStorage.getItem(webHrefKey) || webApp.href;
  } catch {
    return webApp.href;
  }
}

export function isWebOpen() {
  try {
    return sessionStorage.getItem(webOpenKey) === "1";
  } catch {
    return false;
  }
}

export function syncDynamicTaskSeparator(root: ParentNode = document) {
  const hasDynamicApp = [...root.querySelectorAll<HTMLElement>("[data-dynamic-task-app]")]
    .some((app) => !app.hidden);
  root.querySelectorAll<HTMLElement>("[data-dynamic-separator]").forEach((separator) => {
    separator.hidden = !hasDynamicApp;
  });
}

export function syncWebDock(
  open: boolean,
  root: ParentNode = document,
  active = document.body.dataset.activeApp === "web"
) {
  root.querySelectorAll<HTMLAnchorElement>("[data-web-app]").forEach((anchor) => {
    anchor.hidden = !open;
    anchor.href = storedWebHref();
    anchor.classList.toggle("is-active", open && active);
    if (open && active) anchor.setAttribute("aria-current", "page");
    else anchor.removeAttribute("aria-current");
  });
  syncDynamicTaskSeparator(root);
}

export function initializeDynamicWeb() {
  const active = document.body.dataset.activeApp === "web";
  if (active) {
    try {
      sessionStorage.setItem(webOpenKey, "1");
      sessionStorage.setItem(webHrefKey, currentHref());
    } catch {
      // The active page remains usable when storage is unavailable.
    }
  }
  syncWebDock(active || isWebOpen());
}

export function clearWebState() {
  try {
    sessionStorage.removeItem(webOpenKey);
    sessionStorage.removeItem(webHrefKey);
    sessionStorage.removeItem(webViewKey);
  } catch {
    // Closing still works in privacy-restricted contexts.
  }
  syncWebDock(false, document, false);
}

function looksLikeUrl(value: string) {
  return /^(?:https?:\/\/|localhost(?::\d+)?(?:\/|$)|(?:[\p{L}\p{N}-]+\.)+[\p{L}\p{N}-]+(?::\d+)?(?:\/|$))/iu.test(value);
}

function normalizeAddress(value: string) {
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
}

function openBing(query: string) {
  const url = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
  const opened = window.open(url, "_blank", "noopener,noreferrer");
  if (opened) opened.opener = null;
}

export function initializeWebBrowser() {
  const root = document.querySelector<HTMLElement>("[data-web-browser]");
  if (!root) return;

  const defaultView = (root.dataset.webDefaultView === "bookmarks" ? "bookmarks" : "home") as WebView;
  const views = [...root.querySelectorAll<HTMLElement>("[data-web-view]")];
  const address = root.querySelector<HTMLInputElement>("[data-web-address]");
  const errorUrl = root.querySelector<HTMLElement>("[data-web-error-url]");
  const href = currentHref();
  let currentView: WebView = defaultView;

  const setView = (view: WebView, requestedAddress = "", persist = true) => {
    currentView = view;
    views.forEach((panel) => {
      panel.hidden = panel.dataset.webView !== view;
    });
    if (address) address.value = view === "error" ? requestedAddress : "";
    if (errorUrl) errorUrl.textContent = requestedAddress;
    if (persist) writeStoredView({ href, view, address: requestedAddress || undefined });
  };

  const stored = readStoredView();
  if (stored?.href === href && stored.view === "error") {
    setView("error", stored.address || "", false);
  } else {
    setView(defaultView, "", false);
    writeStoredView({ href, view: defaultView });
  }

  root.querySelector<HTMLFormElement>("[data-web-search-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const input = form.elements.namedItem("q") as HTMLInputElement | null;
    const query = input?.value.trim() || "";
    if (query) openBing(query);
  });

  root.querySelector<HTMLFormElement>("[data-web-address-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = address?.value.trim() || "";
    if (!value) return;
    if (!looksLikeUrl(value)) {
      openBing(value);
      return;
    }
    setView("error", normalizeAddress(value));
  });

  root.querySelector("[data-web-history-back]")?.addEventListener("click", () => {
    if (currentView === "error") {
      setView(defaultView);
      return;
    }
    history.back();
  });

  root.querySelector("[data-web-history-forward]")?.addEventListener("click", () => history.forward());
  root.querySelector("[data-web-refresh]")?.addEventListener("click", () => location.reload());

  root.querySelectorAll<HTMLAnchorElement>("[data-web-home]").forEach((home) => {
    home.addEventListener("click", (event) => {
      if (location.pathname !== "/web/" || currentView === "home") return;
      event.preventDefault();
      setView("home");
      history.replaceState(history.state, "", "/web/");
      try {
        sessionStorage.setItem(webHrefKey, "/web/");
      } catch {}
    });
  });
}
