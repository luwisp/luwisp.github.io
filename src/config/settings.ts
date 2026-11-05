export type ThemeModeDefault = "system" | "light" | "dark";
export type FrostedDockDefault = boolean | "theme";

export const settingsDefaults = {
  // "system" follows the OS; you can also force "light" or "dark".
  themeMode: "system" as ThemeModeDefault,
  themes: {
    light: "frosted-glass",
    dark: "everforest-dark"
  },
  interface: {
    // true/false forces a default; "theme" enables it only for the themes listed below.
    frostedDock: "theme" as FrostedDockDefault,
    frostedDockThemes: ["frosted-glass"] as const
  }
} as const;

export function resolveDefaultThemeMode(prefersDark: boolean): "light" | "dark" {
  return settingsDefaults.themeMode === "system"
    ? prefersDark ? "dark" : "light"
    : settingsDefaults.themeMode;
}

export function resolveDefaultFrostedDock(themeId: string): boolean {
  const defaultValue = settingsDefaults.interface.frostedDock;
  return defaultValue === "theme"
    ? settingsDefaults.interface.frostedDockThemes.some((id) => id === themeId)
    : defaultValue;
}
