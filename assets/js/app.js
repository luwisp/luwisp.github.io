const storageKey = "luorong.notes.theme";

const icons = {
  archive:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M3 7h18"/><path d="M5 7v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7"/><path d="M7 3h10l2 4H5l2-4Z"/><path d="M10 12h4"/></svg>',
  calendar:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M8 2v4"/><path d="M16 2v4"/><path d="M3 10h18"/><rect x="3" y="4" width="18" height="18" rx="2"/></svg>',
  clock:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  external:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/></svg>',
  folder:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M3 6a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/></svg>',
  github:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M15 22v-4a4 4 0 0 0-1-3c3 0 6-2 6-6 .1-1.5-.4-2.9-1.4-4.1.1-.4.5-1.9-.2-3.9 0 0-1.1-.3-3.4 1.3a11.7 11.7 0 0 0-6 0C6.7.7 5.6 1 5.6 1c-.7 2-.3 3.5-.2 3.9A5.6 5.6 0 0 0 4 9c0 4 3 6 6 6-.4.4-.7.9-.8 1.6-.7.3-2.5.8-3.6-1-.5-.8-1.1-1-1.1-1-.9-.6.1-.6.1-.6 1 0 1.5 1 1.5 1 .9 1.5 2.3 1.1 3 .9V22"/></svg>',
  home:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>',
  mail:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
  menu:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/></svg>',
  moon:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M20 14.7A8.5 8.5 0 1 1 9.3 4a7 7 0 0 0 10.7 10.7Z"/></svg>',
  palette:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><circle cx="13.5" cy="6.5" r=".8" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".8" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".8" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".8" fill="currentColor"/><path d="M12 3a9 9 0 0 0 0 18h1.5a2.5 2.5 0 0 0 1.8-4.2 1.5 1.5 0 0 1 1.1-2.6H18a3 3 0 0 0 3-3A8.2 8.2 0 0 0 12 3Z"/></svg>',
  search:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 4 4"/></svg>',
  shuffle:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M16 3h5v5"/><path d="M4 20 21 3"/><path d="M21 16v5h-5"/><path d="m15 15 6 6"/><path d="m4 4 5 5"/></svg>',
  sun:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.9 4.9 1.4 1.4"/><path d="m17.7 17.7 1.4 1.4"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.3 17.7-1.4 1.4"/><path d="m19.1 4.9-1.4 1.4"/></svg>',
  "sun-moon":
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.9 4.9 1.4 1.4"/><path d="M2 12h2"/><path d="m6.3 17.7-1.4 1.4"/><path d="M14 12a4 4 0 1 1-4-4"/><path d="M20 14.7A6.5 6.5 0 0 1 12.3 7 5.5 5.5 0 1 0 20 14.7Z"/></svg>',
  user:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
  x:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>'
};

const fallbackSite = {
  site: {
    title: "Luorong Notes",
    subtitle: "personal desktop blog",
    domain: "luorong.blog",
    wallpaper: "./public/background/145464450_p000_5760x3240.png"
  },
  profile: {
    name: "Luorong",
    displayName: "Luorong Notes",
    avatarText: "L",
    tagline: "A personal desktop blog.",
    bio: "Frontend notes and small personal systems.",
    location: "Asia/Shanghai",
    githubUser: "luorong",
    links: []
  }
};


const fallbackThemeIndex = {
  defaultLight: "solarized-light",
  defaultDark: "everforest-dark",
  files: ["./themes/everforest-dark.json", "./themes/solarized-light.json"]
};

const fallbackThemes = [
  {
    id: "everforest-dark",
    name: "Everforest Dark",
    family: "Everforest",
    type: "dark",
    swatches: ["#272e33", "#a7c080", "#7fbbb3", "#d699b6"],
    tokens: {
      colorScheme: "dark",
      "--wallpaper-dim": "rgba(30, 35, 38, 0.32)",
      "--panel": "#272e33",
      "--panel-strong": "#1e2326",
      "--panel-soft": "#374145",
      "--surface": "#2e383c",
      "--surface-raised": "#374145",
      "--surface-muted": "#1e2326",
      "--text": "#d3c6aa",
      "--muted": "#bdc3af",
      "--subtle": "#859289",
      "--border": "rgba(211, 198, 170, 0.16)",
      "--accent": "#a7c080",
      "--accent-2": "#7fbbb3",
      "--accent-text": "#1e2326",
      "--good": "#83c092",
      "--warning": "#dbbc7f",
      "--danger": "#e67e80",
      "--shadow": "rgba(10, 13, 14, 0.5)"
    }
  },
  {
    id: "solarized-light",
    name: "Solarized Light",
    family: "Solarized",
    type: "light",
    swatches: ["#fdf6e3", "#b58900", "#268bd2", "#859900"],
    tokens: {
      colorScheme: "light",
      "--wallpaper-dim": "rgba(253, 246, 227, 0.26)",
      "--panel": "#eee8d5",
      "--panel-strong": "#fdf6e3",
      "--panel-soft": "#e3dcc8",
      "--surface": "#fdf6e3",
      "--surface-raised": "#eee8d5",
      "--surface-muted": "#e3dcc8",
      "--text": "#586e75",
      "--muted": "#657b83",
      "--subtle": "#839496",
      "--border": "rgba(88, 110, 117, 0.2)",
      "--accent": "#b58900",
      "--accent-2": "#268bd2",
      "--accent-text": "#fdf6e3",
      "--good": "#859900",
      "--warning": "#cb4b16",
      "--danger": "#dc322f",
      "--shadow": "rgba(0, 43, 54, 0.18)"
    }
  }
];

const state = {
  site: fallbackSite,
  posts: [],
  themes: fallbackThemes,
  themeIndex: fallbackThemeIndex,
  mode: "dark",
  themeByMode: {
    light: "catppuccin-latte",
    dark: "everforest-dark"
  },
  currentThemeId: "everforest-dark",
  view: "home",
  postId: "",
  category: "全部",
  search: "",
  articleCache: new Map(),
  renderSerial: 0
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

document.addEventListener("DOMContentLoaded", boot);

async function boot() {
  renderIcons(document);
  bindEvents();

  const [site, posts, themeIndex] = await Promise.all([
    loadJson("./content/site.json", fallbackSite),
    loadJson("./content/posts.json", []),
    loadJson("./themes/index.json", fallbackThemeIndex)
  ]);

  state.site = site;
  state.posts = normalizePosts(posts);
  state.themeIndex = themeIndex;
  state.themes = await loadThemes(themeIndex);

  restoreThemePreference();
  hydrateStaticChrome();
  renderThemeLibrary();
  applyCurrentTheme();
  startClock();
  $("#MathJax-script")?.addEventListener("load", () => renderMath(document.body));

  window.addEventListener("hashchange", handleRoute);
  handleRoute();
}

async function loadJson(url, fallback) {
  try {
    const response = await fetch(url, { cache: "no-cache" });
    if (!response.ok) {
      throw new Error(`${response.status} ${url}`);
    }
    return response.json();
  } catch (error) {
    console.warn(`Using fallback for ${url}`, error);
    return fallback;
  }
}

async function loadThemes(themeIndex) {
  const loaded = await Promise.all(
    (themeIndex.files || []).map((file) => loadJson(file, null))
  );
  const validThemes = loaded.filter(Boolean);
  return validThemes.length ? validThemes : fallbackThemes;
}

function normalizePosts(posts) {
  return [...posts].sort((a, b) => toDate(b.date) - toDate(a.date));
}

function bindEvents() {
  document.addEventListener("click", (event) => {
    const navLink = event.target.closest(".nav-link");
    if (navLink) {
      closeMobileMenu();
    }

    const actionElement = event.target.closest("[data-action]");
    if (!actionElement) {
      return;
    }

    const { action } = actionElement.dataset;
    if (action === "toggle-menu") {
      toggleMobileMenu();
    }

    if (action === "toggle-theme-mode") {
      toggleThemeMode();
    }

    if (action === "set-mode") {
      setMode(actionElement.dataset.mode);
    }

    if (action === "toggle-theme-library") {
      $("#sidebar")?.classList.toggle("theme-open");
    }

    if (action === "random-theme") {
      applyRandomTheme();
    }

    if (action === "assign-theme") {
      assignTheme(actionElement.dataset.themeId, actionElement.dataset.mode);
    }

    if (action === "select-category") {
      state.category = actionElement.dataset.category || "全部";
      renderView();
    }

    if (action === "clear-search") {
      state.search = "";
      const searchInput = $("#searchInput");
      if (searchInput) {
        searchInput.value = "";
      }
      renderView();
    }

    if (action === "scroll-heading") {
      const target = document.getElementById(actionElement.dataset.target || "");
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  });

  $("#searchInput")?.addEventListener("input", (event) => {
    state.search = event.target.value.trim();
    renderView();
  });
}

function handleRoute() {
  const route = location.hash.replace(/^#\/?/, "") || "home";
  const [view, postId] = route.split("/");
  const allowedViews = ["home", "archive", "categories", "post"];

  state.view = allowedViews.includes(view) ? view : "home";
  state.postId = state.view === "post" ? postId || "" : "";
  renderView();
  closeMobileMenu();
}

function hydrateStaticChrome() {
  const site = state.site.site || fallbackSite.site;
  const profile = state.site.profile || fallbackSite.profile;

  document.title = site.title || profile.displayName || "Personal Blog";
  const wallpaperUrl = new URL(
    site.wallpaper || fallbackSite.site.wallpaper,
    window.location.href
  ).href;
  document.documentElement.style.setProperty(
    "--wallpaper-image",
    `url("${wallpaperUrl}")`
  );

  $("#topbarTitle").textContent = site.domain || site.title || "Luorong Notes";
  $("#homeCount").textContent = String(Math.min(state.posts.length, 99)).padStart(2, "0");
  $("#archiveCount").textContent = String(state.posts.length).padStart(2, "0");
  $("#categoryCount").textContent = String(getCategories().length).padStart(2, "0");
}

function restoreThemePreference() {
  let saved = {};
  try {
    saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
  } catch {
    saved = {};
  }

  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  state.mode = saved.mode || (prefersDark ? "dark" : "light");
  state.themeByMode = {
    light: pickValidTheme(saved.light, "light") || pickValidTheme(state.themeIndex.defaultLight, "light"),
    dark: pickValidTheme(saved.dark, "dark") || pickValidTheme(state.themeIndex.defaultDark, "dark")
  };

  if (!state.themeByMode.light) {
    state.themeByMode.light = getThemeByType("light")?.id || state.themes[0]?.id;
  }

  if (!state.themeByMode.dark) {
    state.themeByMode.dark = getThemeByType("dark")?.id || state.themes[0]?.id;
  }
}

function pickValidTheme(id, type) {
  const theme = getTheme(id);
  return theme && theme.type === type ? theme.id : "";
}

function saveThemePreference() {
  localStorage.setItem(
    storageKey,
    JSON.stringify({
      mode: state.mode,
      light: state.themeByMode.light,
      dark: state.themeByMode.dark
    })
  );
}

function applyCurrentTheme() {
  const theme =
    getTheme(state.themeByMode[state.mode]) || getThemeByType(state.mode) || state.themes[0];
  if (!theme) {
    return;
  }

  state.currentThemeId = theme.id;
  const root = document.documentElement;
  Object.entries(theme.tokens || {}).forEach(([name, value]) => {
    if (name === "colorScheme") {
      root.style.colorScheme = value;
    } else {
      root.style.setProperty(name, value);
    }
  });

  document.body.dataset.themeMode = state.mode;
  document.body.dataset.theme = theme.id;
  updateThemeControls();
}

function updateThemeControls() {
  const theme = getTheme(state.currentThemeId) || state.themes[0];
  const modeButton = $(".theme-mode-button");
  if (modeButton) {
    modeButton.title = state.mode === "dark" ? "切换到亮色" : "切换到暗色";
    modeButton.setAttribute("aria-label", modeButton.title);
  }
  const swatch = $("#currentSwatch");
  if (swatch && theme) {
    swatch.style.background = swatchColor(theme);
  }

  renderThemeLibrary();
  renderIcons(document);
}

function toggleThemeMode() {
  setMode(state.mode === "dark" ? "light" : "dark");
}

function setMode(mode) {
  if (!["light", "dark"].includes(mode)) {
    return;
  }
  state.mode = mode;
  saveThemePreference();
  applyCurrentTheme();
  renderView();
}

function assignTheme(themeId, mode) {
  const theme = getTheme(themeId);
  if (!theme || theme.type !== mode) {
    return;
  }

  state.themeByMode[mode] = theme.id;
  state.mode = mode;
  saveThemePreference();
  applyCurrentTheme();
  renderView();
}

function applyRandomTheme() {
  if (!state.themes.length) {
    return;
  }
  const currentIndex = state.themes.findIndex((theme) => theme.id === state.currentThemeId);
  const offset = Math.floor(Math.random() * Math.max(1, state.themes.length - 1)) + 1;
  const theme = state.themes[(currentIndex + offset) % state.themes.length];
  state.themeByMode[theme.type] = theme.id;
  state.mode = theme.type;
  saveThemePreference();
  applyCurrentTheme();
  renderView();
}

function getTheme(id) {
  return state.themes.find((theme) => theme.id === id);
}

function getThemeByType(type) {
  return state.themes.find((theme) => theme.type === type);
}

function renderThemeLibrary() {
  const library = $("#themeLibrary");
  if (!library) {
    return;
  }

  library.innerHTML = ["light", "dark"]
    .map((mode) => {
      const themes = state.themes.filter((theme) => theme.type === mode);
      return `
        <section class="theme-choice-group">
          <h3>${mode === "light" ? "亮色主题" : "暗色主题"}</h3>
          <div class="theme-choice-list">
            ${themes
              .map((theme) => {
                const active = state.themeByMode[mode] === theme.id;
                return `
                  <button
                    class="theme-choice ${active ? "active" : ""}"
                    type="button"
                    data-action="assign-theme"
                    data-theme-id="${escapeAttr(theme.id)}"
                    data-mode="${mode}"
                  >
                    <span class="theme-swatch" style="background: ${escapeAttr(swatchColor(theme))}"></span>
                    <span>
                      <strong>${escapeHtml(theme.name)}</strong>
                      <small>${escapeHtml(theme.family || theme.type)}</small>
                    </span>
                  </button>
                `;
              })
              .join("")}
          </div>
        </section>
      `;
    })
    .join("");
}

async function renderView() {
  const renderSerial = (state.renderSerial += 1);
  document.body.dataset.activePage = state.view;
  updateHeader();
  updateNav();

  const content = $("#appContent");
  if (!content) {
    return;
  }

  if (state.view === "post") {
    content.innerHTML = renderArticleLoading();
    const html = await renderPostView();
    if (renderSerial !== state.renderSerial) {
      return;
    }
    content.innerHTML = html;
  } else if (state.view === "archive") {
    content.innerHTML = renderArchiveView();
  } else if (state.view === "categories") {
    content.innerHTML = renderCategoriesView();
  } else {
    content.innerHTML = renderHomeView();
  }

  renderIcons(content);
  renderMath(content);
  updateClock();
}

function updateHeader() {
  const post = state.view === "post" ? getPost(state.postId) : null;
  const map = {
    home: ["Dashboard", "主页"],
    archive: ["Archive", "文章归档"],
    categories: ["Categories", "分类"],
    post: ["Article", post?.title || "文章"]
  };
  const [kicker, title] = map[state.view] || map.home;
  $("#pageKicker").textContent = kicker;
  $("#pageTitle").textContent = title;
}

function updateNav() {
  $$(".nav-link").forEach((link) => {
    const route = link.dataset.route;
    const isActive = route === state.view || (route === "archive" && state.view === "post");
    link.classList.toggle("active", Boolean(isActive));
  });
}

function renderHomeView() {
  const profile = state.site.profile || fallbackSite.profile;
  const posts = getFilteredPosts();
  const recentPosts = posts.slice(0, 6);
  const currentTheme = getTheme(state.currentThemeId) || state.themes[0];

  return `
    <div class="home-grid">
      <article class="widget profile-widget">
        <div class="profile-avatar">${escapeHtml(profile.avatarText || profile.name?.slice(0, 1) || "L")}</div>
        <div>
          <p class="page-kicker">${escapeHtml(profile.name || "Profile")}</p>
          <h2>${escapeHtml(profile.displayName || "Personal Blog")}</h2>
          <p class="tagline">${escapeHtml(profile.tagline || "")}</p>
          <p class="bio">${escapeHtml(profile.bio || "")}</p>
          <div class="link-row">
            ${renderProfileLinks(profile.links || [])}
          </div>
        </div>
      </article>

      <section class="widget clock-widget">
        <div class="widget-header">
          <div>
            <p class="page-kicker">Local Time</p>
            <h2>时间</h2>
          </div>
          <span data-icon="clock"></span>
        </div>
        <div class="clock-face">
          <span class="clock-time" id="clockTime">--:--</span>
          <span class="clock-date" id="clockDate">Loading</span>
        </div>
        <div class="mini-stats">
          <div class="mini-stat"><strong>${state.posts.length}</strong><span>文章</span></div>
          <div class="mini-stat"><strong>${getCategories().length}</strong><span>分类</span></div>
          <div class="mini-stat"><strong>${state.themes.length}</strong><span>主题</span></div>
        </div>
      </section>

      <section class="widget contribution-widget">
        <div class="widget-header">
          <div>
            <p class="page-kicker">GitHub</p>
            <h2>提交热力图</h2>
          </div>
          <small>@${escapeHtml(profile.githubUser || profile.name || "github")}</small>
        </div>
        <div class="contribution-grid" aria-label="最近 14 周提交热力图">
          ${renderContributionCells(profile.githubUser || profile.name || "blog")}
        </div>
        <p>最近写作、提交和整理节奏会汇成这组绿色刻度。</p>
      </section>

      <section class="widget theme-widget">
        <div class="widget-header">
          <div>
            <p class="page-kicker">Theme Dice</p>
            <h2>随机主题</h2>
          </div>
          <span data-icon="palette"></span>
        </div>
        <div class="theme-widget-body">
          <div class="theme-widget-card">
            <span class="theme-current-swatch" style="background: ${escapeAttr(swatchColor(currentTheme))}"></span>
            <div>
              <strong>${escapeHtml(currentTheme?.name || "Theme")}</strong>
              <span>${state.mode === "dark" ? "当前暗色主题" : "当前亮色主题"}</span>
            </div>
          </div>
          <button class="primary-button" type="button" data-action="random-theme">
            <span data-icon="shuffle"></span>
            <span>换一个主题</span>
          </button>
        </div>
      </section>

      <section class="recent-section">
        <div class="section-head">
          <h2 class="section-title">${state.search ? "搜索结果" : "最近文章"}</h2>
          ${state.search ? '<button class="ghost-button" type="button" data-action="clear-search">清除搜索</button>' : '<a class="ghost-button" href="#/archive">查看归档</a>'}
        </div>
        ${renderPostList(recentPosts)}
      </section>
    </div>
  `;
}

function renderProfileLinks(links) {
  if (!links.length) {
    return "";
  }

  return links
    .map(
      (link) => `
        <a class="social-link" href="${escapeAttr(link.url)}" target="_blank" rel="noreferrer" aria-label="${escapeAttr(link.label)}" title="${escapeAttr(link.label)}">
          <span data-icon="${escapeAttr(link.icon || "external")}"></span>
        </a>
      `
    )
    .join("");
}

function renderContributionCells(seedText) {
  const cells = [];
  const today = new Date();
  const seed = hashString(seedText);
  for (let index = 97; index >= 0; index -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - index);
    const value = (hashString(`${seed}-${date.toDateString()}`) + date.getDay()) % 5;
    const level = value === 0 && date.getDay() % 2 === 0 ? 1 : value;
    cells.push(
      `<span class="heat-cell" data-level="${level}" title="${escapeAttr(formatDate(date.toISOString()))}"></span>`
    );
  }
  return cells.join("");
}

function renderPostList(posts) {
  if (!posts.length) {
    return `<div class="empty-state"><p>没有找到匹配的文章。</p></div>`;
  }

  return `
    <div class="post-list">
      ${posts
        .map(
          (post) => `
            <a class="post-card" href="#/post/${escapeAttr(post.id)}">
              <div class="post-meta">
                <span>${escapeHtml(post.category)}</span>
                <span>${escapeHtml(formatDate(post.date))} · ${post.minutes || 4} min</span>
              </div>
              <h3>${escapeHtml(post.title)}</h3>
              <p>${escapeHtml(post.summary)}</p>
              <div class="tag-row">
                ${(post.tags || [])
                  .slice(0, 3)
                  .map((tag) => `<span class="post-tag">${escapeHtml(tag)}</span>`)
                  .join("")}
              </div>
            </a>
          `
        )
        .join("")}
    </div>
  `;
}

function renderArchiveView() {
  const posts = getFilteredPosts();
  if (!posts.length) {
    return `<div class="empty-state"><p>归档里没有匹配的文章。</p></div>`;
  }

  const groups = groupBy(posts, (post) => toDate(post.date).getFullYear());
  return `
    <div class="archive-layout">
      ${Object.entries(groups)
        .sort(([a], [b]) => Number(b) - Number(a))
        .map(
          ([year, yearPosts]) => `
            <section class="archive-year">
              <h2>${year}</h2>
              <div class="archive-stack">
                ${yearPosts
                  .map(
                    (post) => `
                      <a class="archive-entry" href="#/post/${escapeAttr(post.id)}">
                        <div>
                          <h3>${escapeHtml(post.title)}</h3>
                          <p>${escapeHtml(post.summary)}</p>
                        </div>
                        <div class="archive-meta">
                          <span>${escapeHtml(post.category)}</span>
                          <span>${escapeHtml(formatDate(post.date))}</span>
                        </div>
                      </a>
                    `
                  )
                  .join("")}
              </div>
            </section>
          `
        )
        .join("")}
    </div>
  `;
}

function renderCategoriesView() {
  const categories = ["全部", ...getCategories()];
  if (!categories.includes(state.category)) {
    state.category = "全部";
  }

  const posts = getFilteredPosts().filter(
    (post) => state.category === "全部" || post.category === state.category
  );

  return `
    <div class="category-layout">
      <div class="category-bar" role="list">
        ${categories
          .map((category) => {
            const count =
              category === "全部"
                ? state.posts.length
                : state.posts.filter((post) => post.category === category).length;
            return `
              <button
                class="category-chip ${category === state.category ? "active" : ""}"
                type="button"
                data-action="select-category"
                data-category="${escapeAttr(category)}"
              >${escapeHtml(category)} · ${count}</button>
            `;
          })
          .join("")}
      </div>
      <div class="category-posts">
        ${posts.length
          ? posts
              .map(
                (post) => `
                  <a class="post-card" href="#/post/${escapeAttr(post.id)}">
                    <div class="post-meta">
                      <span>${escapeHtml(post.category)}</span>
                      <span>${escapeHtml(formatDate(post.date))}</span>
                    </div>
                    <h3>${escapeHtml(post.title)}</h3>
                    <p>${escapeHtml(post.summary)}</p>
                    <div class="tag-row">
                      ${(post.tags || [])
                        .map((tag) => `<span class="post-tag">${escapeHtml(tag)}</span>`)
                        .join("")}
                    </div>
                  </a>
                `
              )
              .join("")
          : '<div class="empty-state"><p>这个分类下暂时没有匹配文章。</p></div>'}
      </div>
    </div>
  `;
}

function renderArticleLoading() {
  return `
    <div class="loading-state">
      <span class="loader"></span>
      <span>正在读取 Markdown...</span>
    </div>
  `;
}

async function renderPostView() {
  const post = getPost(state.postId);
  if (!post) {
    return `
      <div class="empty-state">
        <p>这篇文章不存在或已经移动。</p>
        <a class="ghost-button" href="#/archive">返回归档</a>
      </div>
    `;
  }

  let markdown = "";
  try {
    markdown = await loadMarkdown(post);
  } catch (error) {
    console.warn("Markdown load failed", error);
    return `
      <div class="empty-state">
        <p>Markdown 正文读取失败。</p>
        <a class="ghost-button" href="#/archive">返回归档</a>
      </div>
    `;
  }

  const article = renderMarkdown(markdown);

  return `
    <div class="article-layout">
      <article class="article-view markdown-article">
        <div class="article-topline">
          <a class="ghost-button" href="#/archive">返回归档</a>
          <span class="post-dot" aria-hidden="true"></span>
        </div>
        <p class="page-kicker">${escapeHtml(post.category)}</p>
        <h2>${escapeHtml(post.title)}</h2>
        <div class="article-meta">
          <span>${escapeHtml(formatDate(post.date))}</span>
          <span>${post.minutes || estimateReadMinutes(markdown)} min read</span>
          ${(post.tags || []).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
        </div>
        <div class="article-body markdown-body">
          ${article.html}
        </div>
      </article>
      ${renderToc(article.toc)}
    </div>
  `;
}

async function loadMarkdown(post) {
  const markdownPath = post.markdown || `./content/articles/${post.id}.md`;
  if (state.articleCache.has(markdownPath)) {
    return state.articleCache.get(markdownPath);
  }

  const response = await fetch(markdownPath, { cache: "no-cache" });
  if (!response.ok) {
    throw new Error(`${response.status} ${markdownPath}`);
  }

  const markdown = await response.text();
  state.articleCache.set(markdownPath, markdown);
  return markdown;
}

function renderToc(toc) {
  if (!toc.length) {
    return "";
  }

  return `
    <aside class="toc-widget" aria-label="文章大纲">
      <h2>大纲</h2>
      <nav>
        ${toc
          .map(
            (item) => `
              <button
                class="toc-link level-${item.level}"
                type="button"
                data-action="scroll-heading"
                data-target="${escapeAttr(item.id)}"
              >${escapeHtml(item.text)}</button>
            `
          )
          .join("")}
      </nav>
    </aside>
  `;
}

function renderMarkdown(markdown) {
  const source = stripFrontMatter(markdown).replace(/\r\n?/g, "\n");
  const lines = source.split("\n");
  const toc = [];
  const slugCounts = new Map();
  const html = [];
  let paragraph = [];
  let list = null;
  let code = null;
  let math = null;

  const flushParagraph = () => {
    if (!paragraph.length) {
      return;
    }
    html.push(`<p>${renderInlineMarkdown(paragraph.join(" "))}</p>`);
    paragraph = [];
  };

  const flushList = () => {
    if (!list) {
      return;
    }
    html.push(
      `<${list.type}>${list.items.map((item) => `<li>${renderInlineMarkdown(item)}</li>`).join("")}</${list.type}>`
    );
    list = null;
  };

  lines.forEach((line) => {
    if (code) {
      if (/^```/.test(line.trim())) {
        html.push(
          `<pre><code class="language-${escapeAttr(code.lang)}">${escapeHtml(code.lines.join("\n"))}</code></pre>`
        );
        code = null;
      } else {
        code.lines.push(line);
      }
      return;
    }

    if (math) {
      if (line.trim() === "$$") {
        html.push(`<div class="math-block">$$\n${escapeHtml(math.lines.join("\n"))}\n$$</div>`);
        math = null;
      } else {
        math.lines.push(line);
      }
      return;
    }

    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      flushList();
      return;
    }

    const fence = trimmed.match(/^```([A-Za-z0-9_-]+)?/);
    if (fence) {
      flushParagraph();
      flushList();
      code = { lang: fence[1] || "", lines: [] };
      return;
    }

    if (trimmed === "$$") {
      flushParagraph();
      flushList();
      math = { lines: [] };
      return;
    }

    const heading = trimmed.match(/^(#{1,5})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      flushList();
      const level = Math.min(6, heading[1].length + 1);
      const text = stripMarkdown(heading[2]);
      const id = uniqueSlug(text, slugCounts);
      toc.push({ id, text, level });
      html.push(`<h${level} id="${escapeAttr(id)}">${renderInlineMarkdown(heading[2])}</h${level}>`);
      return;
    }

    const unordered = trimmed.match(/^[-*]\s+(.+)$/);
    const ordered = trimmed.match(/^\d+\.\s+(.+)$/);
    if (unordered || ordered) {
      flushParagraph();
      const type = ordered ? "ol" : "ul";
      if (!list || list.type !== type) {
        flushList();
        list = { type, items: [] };
      }
      list.items.push((unordered || ordered)[1]);
      return;
    }

    const quote = trimmed.match(/^>\s+(.+)$/);
    if (quote) {
      flushParagraph();
      flushList();
      html.push(`<blockquote>${renderInlineMarkdown(quote[1])}</blockquote>`);
      return;
    }

    paragraph.push(trimmed);
  });

  flushParagraph();
  flushList();

  if (code) {
    html.push(`<pre><code class="language-${escapeAttr(code.lang)}">${escapeHtml(code.lines.join("\n"))}</code></pre>`);
  }

  if (math) {
    html.push(`<div class="math-block">$$\n${escapeHtml(math.lines.join("\n"))}\n$$</div>`);
  }

  return { html: html.join(""), toc };
}

function stripFrontMatter(markdown) {
  return markdown.replace(/^---\n[\s\S]*?\n---\n?/, "");
}

function renderInlineMarkdown(text) {
  const segments = String(text).split(/(\\\(.+?\\\)|\\\[.+?\\\]|\$[^$\n]+\$)/g);
  return segments
    .map((segment) => {
      if (!segment) {
        return "";
      }
      if (/^(\\\(.+\\\)|\\\[.+\\\]|\$[^$\n]+\$)$/.test(segment)) {
        return escapeHtml(segment);
      }

      return escapeHtml(segment)
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label, url) => {
          const safeUrl = String(url).trim();
          if (/^\s*javascript:/i.test(safeUrl)) {
            return label;
          }
          return `<a href="${escapeAttr(safeUrl)}" target="_blank" rel="noreferrer">${label}</a>`;
        })
        .replace(/`([^`]+)`/g, "<code>$1</code>")
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
        .replace(/(^|[^\*])\*([^*]+)\*/g, "$1<em>$2</em>");
    })
    .join("");
}

function stripMarkdown(text) {
  return String(text)
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/[*_#>]/g, "")
    .trim();
}

function uniqueSlug(text, counts) {
  const base =
    stripMarkdown(text)
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-+|-+$/g, "") || "section";
  const count = counts.get(base) || 0;
  counts.set(base, count + 1);
  return count ? `${base}-${count + 1}` : base;
}

function estimateReadMinutes(markdown) {
  const text = stripFrontMatter(markdown)
    .replace(/```[\s\S]*?```/g, "")
    .replace(/\$\$[\s\S]*?\$\$/g, "")
    .trim();
  return Math.max(1, Math.ceil(text.length / 500));
}

function getFilteredPosts() {
  const query = state.search.toLowerCase();
  if (!query) {
    return state.posts;
  }

  return state.posts.filter((post) => {
    return [post.title, post.summary, post.category, ...(post.tags || []), post.markdown || ""]
      .join(" ")
      .toLowerCase()
      .includes(query);
  });
}

function getPost(id) {
  return state.posts.find((post) => post.id === id);
}

function getCategories() {
  return Array.from(new Set(state.posts.map((post) => post.category).filter(Boolean))).sort(
    (a, b) => a.localeCompare(b, "zh-CN")
  );
}

function groupBy(items, keyFn) {
  return items.reduce((groups, item) => {
    const key = keyFn(item);
    groups[key] = groups[key] || [];
    groups[key].push(item);
    return groups;
  }, {});
}

function startClock() {
  updateClock();
  window.setInterval(updateClock, 1000);
}

function updateClock() {
  const profile = state.site.profile || fallbackSite.profile;
  const timeZone = profile.location?.includes("/") ? profile.location : undefined;
  const now = new Date();
  const topbarClock = $("#topbarClock");
  if (topbarClock) {
    topbarClock.dateTime = now.toISOString();
    topbarClock.textContent = new Intl.DateTimeFormat("zh-CN", {
      timeZone,
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit"
    }).format(now);
  }

  const clockTime = $("#clockTime");
  const clockDate = $("#clockDate");
  if (clockTime) {
    clockTime.textContent = new Intl.DateTimeFormat("zh-CN", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    }).format(now);
  }
  if (clockDate) {
    clockDate.textContent = new Intl.DateTimeFormat("zh-CN", {
      timeZone,
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long"
    }).format(now);
  }
}

function toggleMobileMenu() {
  const isOpen = document.body.classList.toggle("menu-open");
  $(".menu-button")?.setAttribute("aria-expanded", String(isOpen));
}

function closeMobileMenu() {
  document.body.classList.remove("menu-open");
  $(".menu-button")?.setAttribute("aria-expanded", "false");
}

function renderIcons(root) {
  $$("[data-icon]", root).forEach((node) => {
    const icon = icons[node.dataset.icon];
    if (icon) {
      node.innerHTML = icon;
    }
  });
}

function renderMath(root, retries = 0) {
  if (window.MathJax?.typesetPromise) {
    window.MathJax.typesetPromise([root]).catch((error) => {
      console.warn("MathJax render failed", error);
    });
    return;
  }

  if (retries < 8) {
    window.setTimeout(() => renderMath(root, retries + 1), 300);
  }
}

function swatchColor(theme) {
  const swatches = theme?.swatches?.length ? theme.swatches : ["var(--accent)", "var(--accent-2)"];
  return swatches[1] || swatches[0];
}

function formatDate(value) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(toDate(value));
}

function toDate(value) {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
  }
  return new Date(value);
}

function hashString(value) {
  return String(value)
    .split("")
    .reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) >>> 0, 7);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll("`", "&#096;");
}
