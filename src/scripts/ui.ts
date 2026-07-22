const storageKey = "luorong.notes.theme";
const navigationRestoreKey = "luorong.notes.navigation-expanded";

interface ThemePreference {
  mode?: "light" | "dark";
  light?: string;
  dark?: string;
}

function getPreference(): ThemePreference {
  try {
    return JSON.parse(localStorage.getItem(storageKey) || "{}");
  } catch {
    return {};
  }
}

function savePreference(preference: ThemePreference) {
  localStorage.setItem(storageKey, JSON.stringify(preference));
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
  document.querySelector<HTMLElement>("meta[name='theme-color']")?.setAttribute("content", tokens["--panel-strong"] || "#1e2326");
  document.querySelector<HTMLElement>("[data-current-swatch]")?.style.setProperty("background", swatches[1] || tokens["--accent"] || "currentColor");
  document.querySelectorAll("[data-theme-option]").forEach((item) => {
    item.classList.toggle("is-selected", (item as HTMLElement).dataset.themeId === id);
  });

  if (persist) {
    const preference = getPreference();
    preference.mode = mode;
    preference[mode] = id;
    savePreference(preference);
  }
}

function initializeThemeControls() {
  const sidebar = document.querySelector<HTMLElement>("[data-sidebar]");
  if (!sidebar) return;
  const preference = getPreference();
  const mode = preference.mode || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  const defaultId = mode === "dark" ? sidebar.dataset.defaultDark : sidebar.dataset.defaultLight;
  applyTheme(preference[mode] || defaultId || "", mode, false);

  document.querySelectorAll<HTMLElement>("[data-theme-option]").forEach((button) => {
    button.addEventListener("click", () => {
      const nextMode = button.dataset.themeMode as "light" | "dark";
      applyTheme(button.dataset.themeId || "", nextMode);
    });
  });

  document.querySelector("[data-theme-toggle]")?.addEventListener("click", () => {
    const current = document.documentElement.dataset.themeMode === "dark" ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";
    const latest = getPreference();
    const nextId = latest[next] || (next === "dark" ? sidebar.dataset.defaultDark : sidebar.dataset.defaultLight);
    if (nextId) applyTheme(nextId, next);
  });

  document.querySelectorAll("[data-theme-library-toggle]").forEach((button) => {
    button.addEventListener("click", () => sidebar.classList.toggle("theme-library-open"));
  });
}

function initializeMenu() {
  const button = document.querySelector<HTMLButtonElement>("[data-menu-toggle]");
  if (!button) return;
  const syncButton = (open: boolean) => {
    button.ariaExpanded = String(open);
    button.ariaLabel = open ? "收起导航" : "展开导航";
  };
  syncButton(document.body.classList.contains("menu-open"));
  button.addEventListener("click", () => {
    const open = document.body.classList.toggle("menu-open");
    syncButton(open);
  });
}

function initializeExpandedSidebar() {
  const sidebar = document.querySelector<HTMLElement>("[data-sidebar]");
  if (!sidebar) return;
  if (document.documentElement.classList.contains("navigation-restore")) {
    sidebar.classList.add("navigation-expanded");
    document.documentElement.classList.remove("navigation-restore");
  }
  if (!sidebar.classList.contains("navigation-expanded")) return;
  const releaseWhenPointerLeaves = (event: PointerEvent) => {
    if (event.target instanceof Node && sidebar.contains(event.target)) return;
    sidebar.classList.remove("navigation-expanded");
    document.removeEventListener("pointermove", releaseWhenPointerLeaves);
  };
  document.addEventListener("pointermove", releaseWhenPointerLeaves);
}

function initializeStaticNavigation() {
  const sidebar = document.querySelector<HTMLElement>("[data-sidebar]");
  if (!sidebar) return;
  sidebar.querySelectorAll<HTMLAnchorElement>("a[href]").forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = new URL(anchor.href, location.href);
      const current = new URL(location.href);
      if (target.pathname === current.pathname && target.search === current.search && target.hash === current.hash) {
        event.preventDefault();
        return;
      }
      if (innerWidth > 820) sessionStorage.setItem(navigationRestoreKey, "1");
    });
  });
}

interface AstroBeforeSwapEvent extends Event {
  newDocument: Document;
  sourceElement: Element | null;
}

function preserveNavigationState(event: Event) {
  const { newDocument: nextDocument, sourceElement } = event as AstroBeforeSwapEvent;
  if (!nextDocument) return;
  sessionStorage.removeItem(navigationRestoreKey);

  const currentRoot = document.documentElement;
  const nextRoot = nextDocument.documentElement;
  nextRoot.style.cssText = currentRoot.style.cssText;
  nextRoot.dataset.theme = currentRoot.dataset.theme || "";
  nextRoot.dataset.themeMode = currentRoot.dataset.themeMode || "";
  const currentThemeColor = document.querySelector<HTMLMetaElement>("meta[name='theme-color']")?.content;
  const nextThemeColor = nextDocument.querySelector<HTMLMetaElement>("meta[name='theme-color']");
  if (currentThemeColor && nextThemeColor) nextThemeColor.content = currentThemeColor;

  const menuOpen = document.body.classList.contains("menu-open");
  nextDocument.body.classList.toggle("menu-open", menuOpen);
  const nextMenuButton = nextDocument.querySelector<HTMLButtonElement>("[data-menu-toggle]");
  if (nextMenuButton) {
    nextMenuButton.ariaExpanded = String(menuOpen);
    nextMenuButton.ariaLabel = menuOpen ? "收起导航" : "展开导航";
  }

  const currentSidebar = document.querySelector<HTMLElement>("[data-sidebar]");
  const nextSidebar = nextDocument.querySelector<HTMLElement>("[data-sidebar]");
  if (!currentSidebar || !nextSidebar) return;

  nextSidebar.classList.toggle("theme-library-open", currentSidebar.classList.contains("theme-library-open"));
  const navigationStartedInSidebar = sourceElement instanceof Node && currentSidebar.contains(sourceElement);
  const desktopExpanded =
    innerWidth > 820 &&
    (navigationStartedInSidebar || currentSidebar.matches(":hover") || currentSidebar.classList.contains("navigation-expanded"));
  nextSidebar.classList.toggle("navigation-expanded", desktopExpanded);
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
      const short = clock.dataset.clockFormat === "short";
      clock.dateTime = now.toISOString();
      clock.textContent = new Intl.DateTimeFormat("zh-CN", {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        second: short ? undefined : "2-digit",
        hour12: false
      }).format(now);
    }
    const dateTarget = document.querySelector<HTMLElement>("[data-clock-date]");
    if (dateTarget) {
      dateTarget.textContent = new Intl.DateTimeFormat("zh-CN", {
        timeZone,
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long"
      }).format(now);
    }
  };
  update();
  clockTimer = window.setInterval(update, 1000);
}

function initializeQuote() {
  const target = document.querySelector<HTMLElement>("[data-random-quote]");
  if (!target) return;
  try {
    const quotes = JSON.parse(target.dataset.quotes || "[]") as string[];
    if (quotes.length) target.textContent = quotes[Math.floor(Math.random() * quotes.length)];
  } catch {}
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
    archive.scrollIntoView({ block: "start" });
  };
  buttons.forEach((button) => button.addEventListener("click", () => renderPage(Number(button.dataset.archivePage))));
  if (buttons.length) renderPage(1);
}

function initializeBackButtons() {
  document.querySelectorAll("[data-history-back]").forEach((button) => {
    button.addEventListener("click", () => {
      if (history.length > 1) history.back();
      else location.href = "/archive/";
    });
  });
}

function initializePage() {
  if (document.body.dataset.uiInitialized === "true") return;
  document.body.dataset.uiInitialized = "true";
  initializeThemeControls();
  initializeMenu();
  initializeExpandedSidebar();
  initializeStaticNavigation();
  initializeClocks();
  initializeQuote();
  initializeArchivePagination();
  initializeBackButtons();
}

document.addEventListener("astro:before-swap", preserveNavigationState);
document.addEventListener("astro:page-load", initializePage);
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initializePage, { once: true });
else initializePage();
