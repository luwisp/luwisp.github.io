import { navigate } from "astro:transitions/client";
import { getAppOrder, readerApp } from "../config/apps";
import { uiConfig } from "../config/site";

const themeStorageKey = "luorong.notes.theme";
const readerStorageKey = "luorong.notes.open-reader";
const readerClosingKey = "luorong.notes.reader-closing";

interface ThemePreference {
  mode?: "light" | "dark";
  light?: string;
  dark?: string;
}

interface OpenReader {
  href: string;
  title: string;
  scrollTop?: number;
}

interface AstroBeforePreparationEvent extends Event {
  from: URL;
  to: URL;
  direction: string;
}

interface AstroBeforeSwapEvent extends Event {
  newDocument: Document;
}

function readJson<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(localStorage.getItem(key) || "") as T;
  } catch {
    return fallback;
  }
}

function getThemePreference() {
  return readJson<ThemePreference>(themeStorageKey, {});
}

function saveThemePreference(preference: ThemePreference) {
  localStorage.setItem(themeStorageKey, JSON.stringify(preference));
}

function getThemeButton(id: string | undefined) {
  if (!id) return null;
  return document.querySelector<HTMLElement>(`[data-theme-option][data-theme-id="${CSS.escape(id)}"]`);
}

function applyTheme(id: string, mode: "light" | "dark", persist = true) {
  const button = getThemeButton(id);
  if (!button) return;

  const tokens = JSON.parse(button.dataset.themeTokens || "{}") as Record<string, string>;
  const swatches = JSON.parse(button.dataset.themeSwatches || "[]") as string[];
  for (const [name, value] of Object.entries(tokens)) {
    if (name === "colorScheme") document.documentElement.style.colorScheme = value;
    else document.documentElement.style.setProperty(name, value);
  }

  document.documentElement.dataset.theme = id;
  document.documentElement.dataset.themeMode = mode;
  document.querySelector<HTMLMetaElement>("meta[name='theme-color']")?.setAttribute("content", tokens["--panel"] || "#272e33");
  document.querySelectorAll<HTMLElement>("[data-current-swatch]").forEach((swatch) => {
    swatch.style.setProperty("background", swatches[1] || tokens["--accent"] || "currentColor");
  });
  document.querySelectorAll<HTMLElement>("[data-theme-option]").forEach((item) => {
    const selected = item.dataset.themeId === id;
    item.classList.toggle("is-selected", selected);
    item.setAttribute("aria-pressed", String(selected));
  });
  document.querySelectorAll<HTMLButtonElement>("[data-theme-toggle]").forEach((toggle) => {
    const darkMode = mode === "dark";
    toggle.setAttribute("aria-pressed", String(darkMode));
    toggle.setAttribute(
      "aria-label",
      darkMode ? "当前为深色模式，切换为浅色模式" : "当前为浅色模式，切换为深色模式"
    );
  });

  if (persist) {
    const preference = getThemePreference();
    preference.mode = mode;
    preference[mode] = id;
    saveThemePreference(preference);
  }
}

function initializeThemeControls() {
  const dialog = document.querySelector<HTMLDialogElement>("[data-theme-dialog]");
  if (!dialog) return;

  const preference = getThemePreference();
  const currentMode = document.documentElement.dataset.themeMode === "light" ? "light" : "dark";
  const defaultId = currentMode === "dark" ? dialog.dataset.defaultDark : dialog.dataset.defaultLight;
  applyTheme(preference[currentMode] || defaultId || "", currentMode, false);

  document.querySelectorAll<HTMLElement>("[data-theme-option]").forEach((button) => {
    button.addEventListener("click", () => {
      const nextMode = button.dataset.themeMode as "light" | "dark";
      applyTheme(button.dataset.themeId || "", nextMode);
    });
  });

  document.querySelectorAll<HTMLButtonElement>("[data-theme-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const current = document.documentElement.dataset.themeMode === "dark" ? "dark" : "light";
      const next = current === "dark" ? "light" : "dark";
      const latest = getThemePreference();
      const nextId = latest[next] || (next === "dark" ? dialog.dataset.defaultDark : dialog.dataset.defaultLight);
      if (nextId) applyTheme(nextId, next);
    });
  });

  document.querySelectorAll<HTMLButtonElement>("[data-theme-dialog-open]").forEach((button) => {
    button.addEventListener("click", () => dialog.showModal());
  });
  document.querySelector("[data-theme-dialog-close]")?.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
}

function getStoredReader() {
  try {
    return JSON.parse(sessionStorage.getItem(readerStorageKey) || "null") as OpenReader | null;
  } catch {
    return null;
  }
}

function syncReaderDock(
  reader: OpenReader | null,
  root: ParentNode = document,
  readerActive = document.body.dataset.activeApp === "reader"
) {
  root.querySelectorAll<HTMLAnchorElement>("[data-dynamic-app]").forEach((anchor) => {
    anchor.hidden = !reader;
    const active = Boolean(reader && readerActive);
    anchor.classList.toggle("is-active", active);
    if (active) anchor.setAttribute("aria-current", "page");
    else anchor.removeAttribute("aria-current");
    if (reader) {
      anchor.href = reader.href;
      anchor.dataset.readerTitle = reader.title;
      anchor.dataset.readerHref = reader.href;
      anchor.setAttribute("aria-label", `阅读器 · ${reader.title}`);
    } else {
      anchor.href = readerApp.href;
      delete anchor.dataset.readerTitle;
      delete anchor.dataset.readerHref;
      anchor.setAttribute("aria-label", readerApp.label);
    }
  });
  root.querySelectorAll<HTMLElement>("[data-reader-separator]").forEach((separator) => {
    separator.hidden = !reader;
  });
}

function clearReaderState() {
  sessionStorage.setItem(readerClosingKey, "1");
  sessionStorage.removeItem(readerStorageKey);
  sessionStorage.removeItem("luorong.notes.restore-reader-scroll");
  syncReaderDock(null);
}

function initializeDynamicReader() {
  const currentTitle = document.body.dataset.readerTitle;
  const currentHref = document.body.dataset.readerHref;
  const current = currentTitle && currentHref ? { title: currentTitle, href: currentHref } : null;
  if (current) {
    const previous = getStoredReader();
    sessionStorage.setItem(readerStorageKey, JSON.stringify({
      ...current,
      scrollTop: previous?.href === current.href ? previous.scrollTop : 0
    }));
  }
  const reader = current ?? getStoredReader();

  syncReaderDock(reader);
}

let clockTimer = 0;

function initializeClocks() {
  window.clearInterval(clockTimer);
  const clocks = [...document.querySelectorAll<HTMLTimeElement>("[data-clock]")];
  if (!clocks.length) return;
  const timeZone = document.body.dataset.clockZone || "Asia/Shanghai";
  const update = () => {
    const now = new Date();
    for (const clock of clocks) {
      const short =
        clock.dataset.clockFormat === "short" ||
        (clock.dataset.clockFormat === "adaptive" && matchMedia("(max-width: 820px)").matches);
      clock.dateTime = now.toISOString();
      clock.textContent = new Intl.DateTimeFormat("zh-CN", {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        second: short ? undefined : "2-digit",
        hour12: false
      }).format(now);
    }
    document.querySelectorAll<HTMLElement>("[data-clock-date]").forEach((target) => {
      target.textContent = new Intl.DateTimeFormat("zh-CN", {
        timeZone,
        month: "long",
        day: "numeric",
        weekday: "long"
      }).format(now);
    });
  };
  update();
  clockTimer = window.setInterval(update, 1000);
}

function initializeArchivePagination() {
  const archive = document.querySelector<HTMLElement>("[data-archive]");
  if (!archive) return;
  const size = Number(archive.dataset.pageSize || "12");
  const entries = [...archive.querySelectorAll<HTMLElement>("[data-archive-entry]")];
  const buttons = [...document.querySelectorAll<HTMLButtonElement>("[data-archive-page]")];
  const renderPage = (page: number) => {
    entries.forEach((entry, index) => {
      entry.hidden = Math.floor(index / size) + 1 !== page;
    });
    buttons.forEach((button) => {
      const active = Number(button.dataset.archivePage) === page;
      button.classList.toggle("is-active", active);
      button.ariaCurrent = active ? "page" : null;
    });
    document.querySelector<HTMLElement>("[data-app-content]")?.scrollTo({ top: 0, behavior: "smooth" });
  };
  buttons.forEach((button) => button.addEventListener("click", () => renderPage(Number(button.dataset.archivePage))));
  if (buttons.length) renderPage(1);
}

function initializeHomePager() {
  const pager = document.querySelector<HTMLElement>("[data-home-pager]");
  if (!pager) return;
  const pages = [...pager.querySelectorAll<HTMLElement>("[data-home-page]")];
  const buttons = [...document.querySelectorAll<HTMLButtonElement>("[data-home-page-target]")];
  if (pages.length < 2 || buttons.length < 2) return;

  const setActive = (index: number) => {
    buttons.forEach((button, buttonIndex) => {
      const active = buttonIndex === index;
      button.classList.toggle("is-active", active);
      if (active) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.homePageTarget || "0");
      pages[index]?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
      setActive(index);
    });
  });

  let frame = 0;
  pager.addEventListener("scroll", () => {
    window.cancelAnimationFrame(frame);
    frame = window.requestAnimationFrame(() => {
      const width = Math.max(1, pager.clientWidth);
      const index = Math.max(0, Math.min(pages.length - 1, Math.round(pager.scrollLeft / width)));
      setActive(index);
    });
  }, { passive: true });
}

function setTransitionDirection(event: Event) {
  const transition = event as AstroBeforePreparationEvent;
  const reader = getStoredReader();
  const readerClosing = sessionStorage.getItem(readerClosingKey) === "1";
  if (!readerClosing && document.body.dataset.activeApp === "reader" && reader) {
    const scrollTop = document.querySelector<HTMLElement>("[data-app-content]")?.scrollTop ?? 0;
    sessionStorage.setItem(readerStorageKey, JSON.stringify({ ...reader, scrollTop }));
  }
  const returningToReader =
    document.body.dataset.activeApp !== "reader" &&
    reader?.href === transition.to.pathname;
  sessionStorage.setItem("luorong.notes.restore-reader-scroll", returningToReader ? "1" : "0");
  const fromOrder = getAppOrder(transition.from.pathname);
  const toOrder = getAppOrder(transition.to.pathname);
  const direction = toOrder > fromOrder ? "down" : toOrder < fromOrder ? "up" : "same";
  transition.direction = direction;
  document.documentElement.dataset.appDirection = direction;
}

function preserveDocumentState(event: Event) {
  const nextDocument = (event as AstroBeforeSwapEvent).newDocument;
  if (!nextDocument) return;
  const currentRoot = document.documentElement;
  const nextRoot = nextDocument.documentElement;
  nextRoot.style.cssText = currentRoot.style.cssText;
  nextRoot.dataset.theme = currentRoot.dataset.theme || "";
  nextRoot.dataset.themeMode = currentRoot.dataset.themeMode || "";
  nextRoot.dataset.appDirection = currentRoot.dataset.appDirection || "same";
  const currentThemeColor = document.querySelector<HTMLMetaElement>("meta[name='theme-color']")?.content;
  const nextThemeColor = nextDocument.querySelector<HTMLMetaElement>("meta[name='theme-color']");
  if (currentThemeColor && nextThemeColor) nextThemeColor.content = currentThemeColor;

  const nextActiveApp = nextDocument.body.dataset.activeApp;
  const nextReaderTitle = nextDocument.body.dataset.readerTitle;
  const nextReaderHref = nextDocument.body.dataset.readerHref;
  const readerClosing = sessionStorage.getItem(readerClosingKey) === "1";
  const previousReader = readerClosing ? null : getStoredReader();
  const nextReader = !readerClosing && nextReaderTitle && nextReaderHref
    ? {
        title: nextReaderTitle,
        href: nextReaderHref,
        scrollTop: previousReader?.href === nextReaderHref ? previousReader.scrollTop : 0
      }
    : previousReader;
  if (nextReader) {
    sessionStorage.setItem(readerStorageKey, JSON.stringify(nextReader));
  } else {
    sessionStorage.removeItem(readerStorageKey);
  }

  const dock = document.querySelector<HTMLElement>("[data-app-dock]");
  dock?.querySelectorAll<HTMLAnchorElement>("[data-app-id]").forEach((anchor) => {
    const active = anchor.dataset.appId === nextActiveApp;
    anchor.classList.toggle("is-active", active);
    if (active) anchor.setAttribute("aria-current", "page");
    else anchor.removeAttribute("aria-current");
  });
  if (dock) syncReaderDock(nextReader, dock, nextActiveApp === "reader");
  document.querySelector<HTMLDialogElement>("[data-theme-dialog]")?.close();
}

function initializePage() {
  if (document.body.dataset.uiInitialized === "true") return;
  document.body.dataset.uiInitialized = "true";
  initializeThemeControls();
  initializeDynamicReader();
  initializeClocks();
  initializeArchivePagination();
  initializeHomePager();
  if (
    document.body.dataset.activeApp === "reader" &&
    sessionStorage.getItem("luorong.notes.restore-reader-scroll") === "1"
  ) {
    const reader = getStoredReader();
    window.requestAnimationFrame(() => {
      document.querySelector<HTMLElement>("[data-app-content]")?.scrollTo({
        top: reader?.scrollTop ?? 0,
        behavior: "instant"
      });
    });
  }
  sessionStorage.removeItem("luorong.notes.restore-reader-scroll");
  sessionStorage.removeItem(readerClosingKey);
}

const runtimeWindow = window as Window & { __luorongSystemEvents?: boolean };
if (!runtimeWindow.__luorongSystemEvents) {
  runtimeWindow.__luorongSystemEvents = true;
  document.addEventListener("astro:before-preparation", setTransitionDirection);
  document.addEventListener("astro:before-swap", preserveDocumentState);
  document.addEventListener("click", (event) => {
    if (!(event instanceof MouseEvent) || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const readerClose = event.target instanceof Element
      ? event.target.closest<HTMLAnchorElement>("a[data-reader-close]")
      : null;
    if (readerClose) {
      event.preventDefault();
      clearReaderState();
      const restoreReader = () => {
        sessionStorage.removeItem(readerClosingKey);
        initializeDynamicReader();
      };
      if (uiConfig.pageTransition.enabled) {
        void navigate(readerClose.href, { history: "replace", sourceElement: readerClose }).catch(restoreReader);
      } else {
        location.replace(readerClose.href);
      }
      return;
    }
    const target = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[data-internal-link]") : null;
    if (!target) return;
    const destination = new URL(target.href, location.href);
    if (
      destination.pathname === location.pathname &&
      destination.search === location.search &&
      destination.hash === location.hash
    ) event.preventDefault();
  });
  document.addEventListener("astro:page-load", initializePage);
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initializePage, { once: true });
else initializePage();
