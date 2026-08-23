export type WidgetId =
  | "clock"
  | "avatar"
  | "user"
  | "theme"
  | "appearance"
  | "recent"
  | "contributions"
  | "stats"
  | "github"
  | "email";

interface WidgetPlacement {
  column: number;
  row: number;
  width: number;
  height: number;
}

interface WidgetDefinition {
  id: WidgetId;
  mobilePage: number;
  desktop: WidgetPlacement;
  tablet: WidgetPlacement;
  mobile: WidgetPlacement;
}

export const homeWidgets: WidgetDefinition[] = [
  { id: "clock", mobilePage: 0, desktop: { column: 1, row: 1, width: 2, height: 1 }, tablet: { column: 1, row: 1, width: 2, height: 1 }, mobile: { column: 1, row: 1, width: 3, height: 1 } },
  { id: "user", mobilePage: 0, desktop: { column: 3, row: 1, width: 2, height: 1 }, tablet: { column: 1, row: 2, width: 2, height: 1 }, mobile: { column: 1, row: 2, width: 2, height: 1 } },
  { id: "avatar", mobilePage: 0, desktop: { column: 5, row: 1, width: 1, height: 1 }, tablet: { column: 3, row: 1, width: 1, height: 1 }, mobile: { column: 4, row: 1, width: 1, height: 1 } },
  { id: "theme", mobilePage: 0, desktop: { column: 7, row: 1, width: 1, height: 1 }, tablet: { column: 4, row: 1, width: 1, height: 1 }, mobile: { column: 3, row: 2, width: 1, height: 1 } },
  { id: "appearance", mobilePage: 0, desktop: { column: 8, row: 1, width: 1, height: 1 }, tablet: { column: 3, row: 2, width: 1, height: 1 }, mobile: { column: 4, row: 2, width: 1, height: 1 } },
  { id: "recent", mobilePage: 0, desktop: { column: 1, row: 2, width: 4, height: 2 }, tablet: { column: 1, row: 3, width: 2, height: 2 }, mobile: { column: 1, row: 3, width: 4, height: 3 } },
  { id: "contributions", mobilePage: 1, desktop: { column: 5, row: 2, width: 4, height: 1 }, tablet: { column: 3, row: 3, width: 2, height: 1 }, mobile: { column: 1, row: 1, width: 4, height: 2 } },
  { id: "stats", mobilePage: 1, desktop: { column: 5, row: 3, width: 2, height: 1 }, tablet: { column: 3, row: 4, width: 2, height: 1 }, mobile: { column: 1, row: 3, width: 4, height: 2 } },
  { id: "github", mobilePage: 1, desktop: { column: 7, row: 3, width: 1, height: 1 }, tablet: { column: 1, row: 5, width: 1, height: 1 }, mobile: { column: 1, row: 5, width: 1, height: 1 } },
  { id: "email", mobilePage: 1, desktop: { column: 8, row: 3, width: 1, height: 1 }, tablet: { column: 2, row: 5, width: 1, height: 1 }, mobile: { column: 2, row: 5, width: 1, height: 1 } }
];

export function widgetPlacementStyle(id: WidgetId) {
  const widget = homeWidgets.find((item) => item.id === id);
  if (!widget) return "";
  const variables = (["desktop", "tablet", "mobile"] as const).flatMap((viewport) => {
    const placement = widget[viewport];
    return [
      `--${viewport}-column:${placement.column}`,
      `--${viewport}-row:${placement.row}`,
      `--${viewport}-width:${placement.width}`,
      `--${viewport}-height:${placement.height}`
    ];
  });
  return variables.join(";");
}
