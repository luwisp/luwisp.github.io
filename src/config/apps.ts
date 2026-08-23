export type AppId = "home" | "archive" | "categories" | "reader";

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
  { id: "categories", label: "文章分类", shortLabel: "分类", href: "/categories/", icon: "folder", order: 2 }
];

export const readerApp: AppDefinition = {
  id: "reader",
  label: "文章阅读器",
  shortLabel: "阅读",
  href: "/archive/",
  icon: "book-open",
  order: 3,
  dynamic: true
};

export function getAppOrder(pathname: string) {
  if (pathname.startsWith("/posts/")) return readerApp.order;
  return fixedApps.find((app) => app.href === pathname)?.order ?? readerApp.order + 1;
}
