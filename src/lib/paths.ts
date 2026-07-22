export function withBase(path: string) {
  const base = import.meta.env.BASE_URL;
  const cleanPath = path.replace(/^\.\//, "").replace(/^\//, "");
  return `${base}${cleanPath}`.replace(/\/{2,}/g, "/");
}

export function publicAsset(path: string) {
  return withBase(path.replace(/^\.\/?public\//, ""));
}
