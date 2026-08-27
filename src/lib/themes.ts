import themeIndex from "../../themes/index.json";

export interface ThemeDefinition {
  id: string;
  name: string;
  family: string;
  type: "light" | "dark";
  source: string;
  swatches: string[];
  tokens: Record<string, string>;
}

const themeModules = import.meta.glob("../../themes/*.json", {
  eager: true,
  import: "default"
}) as Record<string, ThemeDefinition | typeof themeIndex>;

export const themes = Object.values(themeModules).filter(
  (theme): theme is ThemeDefinition => "id" in theme && "tokens" in theme
);

export const themeDefaults = {
  light: themeIndex.defaultLight,
  dark: themeIndex.defaultDark
};
