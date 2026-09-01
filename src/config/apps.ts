export type AppId = "home" | "archive" | "categories" | "web" | "reader";

export interface AppDefinition {
  id: AppId;
  label: string;
  shortLabel: string;
  href: string;
  icon: string;
  order: number;
  dynamic?: boolean;
}

export const fixedApps: AppDefinition[] = [
  { id: "home", label: "桌面主页", shortLabel: "主页", href: "/", icon: "home", order: 0 },
  { id: "archive", label: "文章归档", shortLabel: "归档", href: "/archive/", icon: "archive", order: 1 },
  { id: "categories", label: "文章文件", shortLabel: "文件", href: "/categories/", icon: "folder", order: 2 }
];

export const webApp: AppDefinition = {
  id: "web",
  label: "网页",
  shortLabel: "网页",
  href: "/web/",
  icon: "globe",
  order: 3,
  dynamic: true
};

export const readerApp: AppDefinition = {
  id: "reader",
  label: "文章阅读器",
  shortLabel: "阅读",
  href: "/archive/",
  icon: "book-open",
  order: 4,
  dynamic: true
};

export function getAppOrder(pathname: string) {
  if (pathname.startsWith("/web/")) return webApp.order;
  if (pathname.startsWith("/posts/")) return readerApp.order;
  return fixedApps.find((app) => app.href === pathname)?.order ?? readerApp.order + 1;
}
