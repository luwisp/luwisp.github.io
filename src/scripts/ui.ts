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

function initializeFileManager() {
  const root = document.querySelector<HTMLElement>("[data-file-manager]");
  if (!root || root.dataset.initialized === "true") return;
  root.dataset.initialized = "true";

  const entryContainer = root.querySelector<HTMLElement>("[data-file-entries]");
  const entries = [...root.querySelectorAll<HTMLButtonElement>("[data-file-entry]")];
  const breadcrumbs = root.querySelector<HTMLElement>("[data-file-breadcrumbs]");
  const homeCrumb = breadcrumbs?.querySelector<HTMLButtonElement>("[data-file-path]")?.cloneNode(true) as HTMLButtonElement | undefined;
  const searchInput = root.querySelector<HTMLInputElement>("[data-file-search]");
  const sortSelect = root.querySelector<HTMLSelectElement>("[data-file-sort]");
  const sortDirection = root.querySelector<HTMLButtonElement>("[data-file-sort-direction]");
  const backButton = root.querySelector<HTMLButtonElement>("[data-file-back]");
  const forwardButton = root.querySelector<HTMLButtonElement>("[data-file-forward]");
  const upButton = root.querySelector<HTMLButtonElement>("[data-file-up]");
  const emptyState = root.querySelector<HTMLElement>("[data-file-empty]");
  const status = root.querySelector<HTMLElement>("[data-file-status]");
  const selectionStatus = root.querySelector<HTMLElement>("[data-file-selection]");
  const details = root.querySelector<HTMLElement>("[data-file-details]");
  const detailsToggle = root.querySelector<HTMLButtonElement>("[data-file-details-toggle]");
  if (!entryContainer || !breadcrumbs || !homeCrumb || !searchInput || !sortSelect || !details) return;

  if (matchMedia("(max-width: 820px)").matches) {
    root.classList.add("is-details-hidden");
    detailsToggle?.classList.remove("is-active");
    detailsToggle?.setAttribute("aria-pressed", "false");
  }

  let currentPath = "";
  let history = [""];
  let historyIndex = 0;
  let descending = false;
  let selected: HTMLButtonElement | null = null;

  const byPath = new Map(entries.map((entry) => [entry.dataset.entryPath || "", entry]));
  const formatDate = (value: string | undefined) => value
    ? new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(value))
    : "--";
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(bytes < 10 * 1024 ? 1 : 0)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };
  const setText = (selector: string, value: string) => {
    const target = details.querySelector<HTMLElement>(selector);
    if (target) target.textContent = value;
  };
  const clearSelection = () => {
    entries.forEach((entry) => {
      entry.classList.remove("is-selected");
      entry.setAttribute("aria-selected", "false");
      entry.tabIndex = -1;
    });
    selected = null;
    if (selectionStatus) selectionStatus.textContent = "未选择项目";
  };
  const updateDetails = (entry: HTMLButtonElement | null) => {
    const detailsIcon = details.querySelector<HTMLElement>("[data-file-details-icon]");
    const dateRow = details.querySelector<HTMLElement>("[data-file-details-date-row]");
    const readRow = details.querySelector<HTMLElement>("[data-file-details-read-row]");
    const tags = details.querySelector<HTMLElement>("[data-file-details-tags]");
    const open = details.querySelector<HTMLAnchorElement>("[data-file-details-open]");
    const postsValue = details.querySelector<HTMLElement>("[data-file-details-posts]");
    const postsLabel = postsValue?.previousElementSibling;

    if (!entry) {
      const folder = currentPath ? byPath.get(currentPath) : null;
      const pathPrefix = currentPath ? `${currentPath}/` : "";
      const directCount = entries.filter((item) => item.dataset.entryParent === currentPath).length;
      const postCount = entries.filter((item) => item.dataset.entryType === "file" && item.dataset.entryPath?.startsWith(pathPrefix)).length;
      const totalSize = entries
        .filter((item) => item.dataset.entryType === "file" && item.dataset.entryPath?.startsWith(pathPrefix))
        .reduce((total, item) => total + Number(item.dataset.entrySize || 0), 0);
      const icon = (folder ?? homeCrumb).querySelector("svg")?.cloneNode(true);
      if (detailsIcon && icon) detailsIcon.replaceChildren(icon);
      setText("[data-file-details-title]", folder?.dataset.entryDisplayName || "文章");
      setText("[data-file-details-name]", currentPath || "content/articles");
      setText("[data-file-details-description]", folder?.dataset.entryDescription || "本地文章目录，文件夹结构会直接映射到这里。");
      setText("[data-file-details-type]", "内容目录");
      setText("[data-file-details-location]", `content/articles${currentPath ? `/${currentPath}` : ""}`);
      setText("[data-file-details-count]", `${directCount} 个项目`);
      if (postsLabel) postsLabel.textContent = "文章";
      if (postsValue) postsValue.textContent = `${postCount} 篇`;
      setText("[data-file-details-size]", formatSize(totalSize));
      if (dateRow) dateRow.hidden = true;
      if (readRow) readRow.hidden = true;
      if (tags) tags.hidden = true;
      if (open) open.hidden = true;
      return;
    }

    const isFolder = entry.dataset.entryType === "folder";
    const icon = entry.querySelector("svg")?.cloneNode(true);
    if (detailsIcon && icon) detailsIcon.replaceChildren(icon);
    setText("[data-file-details-title]", entry.dataset.entryDisplayName || entry.dataset.entryName || "未命名");
    setText("[data-file-details-name]", entry.dataset.entryName || "");
    setText("[data-file-details-description]", entry.dataset.entryDescription || "暂无说明。");
    setText("[data-file-details-type]", isFolder ? "文件夹" : "Markdown 文档");
    setText("[data-file-details-location]", `content/articles/${entry.dataset.entryPath}${isFolder ? "" : ".md"}`);
    setText("[data-file-details-count]", isFolder ? `${entry.dataset.entryCount || 0} 个项目` : entry.dataset.entryName || "--");
    if (postsLabel) postsLabel.textContent = isFolder ? "文章" : "分类";
    if (postsValue) {
      const prefix = `${entry.dataset.entryPath}/`;
      const descendantCount = entries.filter((item) => item.dataset.entryType === "file" && item.dataset.entryPath?.startsWith(prefix)).length;
      postsValue.textContent = isFolder ? `${descendantCount} 篇` : entry.dataset.entryCategory || "未分类";
    }
    setText("[data-file-details-size]", formatSize(Number(entry.dataset.entrySize || 0)));
    setText("[data-file-details-date]", formatDate(entry.dataset.entryModified));
    if (dateRow) dateRow.hidden = !entry.dataset.entryModified;
    setText("[data-file-details-read]", `${entry.dataset.entryMinutes || "--"} 分钟`);
    if (readRow) readRow.hidden = isFolder || !entry.dataset.entryMinutes;

    const entryTags = (entry.dataset.entryTags || "").split(",").filter(Boolean);
    if (tags) {
      tags.replaceChildren(...entryTags.map((tag) => {
        const span = document.createElement("span");
        span.textContent = tag;
        return span;
      }));
      tags.hidden = entryTags.length === 0;
    }
    if (open) {
      open.hidden = isFolder || !entry.dataset.entryHref;
      if (entry.dataset.entryHref) open.href = entry.dataset.entryHref;
    }
  };
  const selectEntry = (entry: HTMLButtonElement, focus = false) => {
    clearSelection();
    selected = entry;
    entry.classList.add("is-selected");
    entry.setAttribute("aria-selected", "true");
    entry.tabIndex = 0;
    if (focus) entry.focus();
    if (selectionStatus) selectionStatus.textContent = `已选择 ${entry.dataset.entryDisplayName || entry.dataset.entryName}`;
    updateDetails(entry);
  };
  const renderBreadcrumbs = () => {
    const fragments: Node[] = [homeCrumb.cloneNode(true)];
    let path = "";
    currentPath.split("/").filter(Boolean).forEach((segment) => {
      path = path ? `${path}/${segment}` : segment;
      const separator = document.createElement("span");
      separator.className = "file-manager__breadcrumb-separator";
      separator.textContent = "/";
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.filePath = path;
      button.textContent = byPath.get(path)?.dataset.entryDisplayName || segment;
      fragments.push(separator, button);
    });
    breadcrumbs.replaceChildren(...fragments);
    breadcrumbs.querySelectorAll("button").forEach((button, index, buttons) => {
      if (index === buttons.length - 1) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });
  };
  const compareEntries = (left: HTMLButtonElement, right: HTMLButtonElement) => {
    const leftFolder = left.dataset.entryType === "folder";
    const rightFolder = right.dataset.entryType === "folder";
    if (leftFolder !== rightFolder) return leftFolder ? -1 : 1;
    let value = 0;
    if (sortSelect.value === "date") value = Number(left.dataset.entryTime || 0) - Number(right.dataset.entryTime || 0);
    else if (sortSelect.value === "size") value = Number(left.dataset.entrySize || 0) - Number(right.dataset.entrySize || 0);
    else if (sortSelect.value === "type") value = (left.dataset.entryName?.split(".").at(-1) || "").localeCompare(right.dataset.entryName?.split(".").at(-1) || "", "zh-CN");
    else value = (left.dataset.entryDisplayName || "").localeCompare(right.dataset.entryDisplayName || "", "zh-CN");
    if (value === 0) value = (left.dataset.entryDisplayName || "").localeCompare(right.dataset.entryDisplayName || "", "zh-CN");
    return descending ? -value : value;
  };
  const render = () => {
    const query = searchInput.value.trim().toLocaleLowerCase("zh-CN");
    root.classList.toggle("is-searching", Boolean(query));
    clearSelection();
    entries.forEach((entry) => { entry.hidden = true; });
    const visible = entries
      .filter((entry) => query
        ? (entry.dataset.entrySearch || "").includes(query)
        : entry.dataset.entryParent === currentPath)
      .sort(compareEntries);
    visible.forEach((entry) => {
      entry.hidden = false;
      entryContainer.append(entry);
    });
    if (emptyState) emptyState.hidden = visible.length > 0;
    if (status) status.textContent = query ? `${visible.length} 个搜索结果` : `${visible.length} 个项目`;
    backButton && (backButton.disabled = historyIndex <= 0);
    forwardButton && (forwardButton.disabled = historyIndex >= history.length - 1);
    upButton && (upButton.disabled = !currentPath || Boolean(query));
    updateDetails(null);
  };
  const visit = (path: string, push = true) => {
    if (path === currentPath && !searchInput.value) return;
    currentPath = path;
    searchInput.value = "";
    if (push) {
      history = [...history.slice(0, historyIndex + 1), path];
      historyIndex = history.length - 1;
    }
    renderBreadcrumbs();
    render();
  };
  const activate = (entry: HTMLButtonElement) => {
    if (entry.dataset.entryType === "folder") visit(entry.dataset.entryPath || "");
    else if (entry.dataset.entryHref) {
      if (uiConfig.pageTransition.enabled) void navigate(entry.dataset.entryHref, { sourceElement: entry });
      else location.href = entry.dataset.entryHref;
    }
  };

  entryContainer.addEventListener("click", (event) => {
    const entry = event.target instanceof Element ? event.target.closest<HTMLButtonElement>("[data-file-entry]") : null;
    if (!entry || entry.hidden) return;
    if (entry.dataset.entryType === "folder" && matchMedia("(pointer: coarse)").matches) activate(entry);
    else selectEntry(entry);
  });
  entryContainer.addEventListener("dblclick", (event) => {
    const entry = event.target instanceof Element ? event.target.closest<HTMLButtonElement>("[data-file-entry]") : null;
    if (entry && !entry.hidden) activate(entry);
  });
  entryContainer.addEventListener("keydown", (event) => {
    const visible = entries.filter((entry) => !entry.hidden);
    const currentIndex = selected ? visible.indexOf(selected) : -1;
    if (event.key === "Enter" && selected) {
      event.preventDefault();
      activate(selected);
    } else if (["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"].includes(event.key) && visible.length) {
      event.preventDefault();
      const backwards = event.key === "ArrowUp" || event.key === "ArrowLeft";
      const nextIndex = currentIndex < 0 ? 0 : Math.max(0, Math.min(visible.length - 1, currentIndex + (backwards ? -1 : 1)));
      selectEntry(visible[nextIndex], true);
    } else if (event.key === "Backspace" && currentPath) {
      event.preventDefault();
      visit(currentPath.split("/").slice(0, -1).join("/"));
    }
  });
  breadcrumbs.addEventListener("click", (event) => {
    const button = event.target instanceof Element ? event.target.closest<HTMLButtonElement>("[data-file-path]") : null;
    if (button) visit(button.dataset.filePath || "");
  });
  searchInput.addEventListener("input", render);
  sortSelect.addEventListener("change", render);
  sortDirection?.addEventListener("click", () => {
    descending = !descending;
    sortDirection.classList.toggle("is-descending", descending);
    sortDirection.setAttribute("aria-pressed", String(descending));
    sortDirection.setAttribute("aria-label", descending ? "当前降序，切换为升序" : "当前升序，切换为降序");
    render();
  });
  backButton?.addEventListener("click", () => {
    if (historyIndex <= 0) return;
    historyIndex -= 1;
    currentPath = history[historyIndex];
    searchInput.value = "";
    renderBreadcrumbs();
    render();
  });
  forwardButton?.addEventListener("click", () => {
    if (historyIndex >= history.length - 1) return;
    historyIndex += 1;
    currentPath = history[historyIndex];
    searchInput.value = "";
    renderBreadcrumbs();
    render();
  });
  upButton?.addEventListener("click", () => visit(currentPath.split("/").slice(0, -1).join("/")));
  root.querySelector("[data-file-refresh]")?.addEventListener("click", render);
  root.querySelectorAll<HTMLButtonElement>("[data-file-view]").forEach((button) => {
    button.addEventListener("click", () => {
      const listView = button.dataset.fileView === "list";
      root.classList.toggle("is-list-view", listView);
      root.querySelectorAll<HTMLButtonElement>("[data-file-view]").forEach((viewButton) => {
        const active = viewButton === button;
        viewButton.classList.toggle("is-active", active);
        viewButton.setAttribute("aria-pressed", String(active));
      });
    });
  });
  detailsToggle?.addEventListener("click", (event) => {
    const button = event.currentTarget as HTMLButtonElement;
    const visible = root.classList.toggle("is-details-hidden");
    button.classList.toggle("is-active", !visible);
    button.setAttribute("aria-pressed", String(!visible));
  });

  render();
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
  initializeFileManager();
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
  document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLocaleLowerCase() === "k") {
      const input = document.querySelector<HTMLInputElement>("[data-file-search]");
      if (!input) return;
      event.preventDefault();
      input.focus();
      input.select();
    }
  });
  document.addEventListener("astro:page-load", initializePage);
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initializePage, { once: true });
else initializePage();
