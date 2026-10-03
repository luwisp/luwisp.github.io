# Theme files

`index.json` 决定默认亮色和暗色主题，并列出需要加载的主题文件。

每个主题文件包含：

- `id`：唯一标识。
- `type`：`light` 或 `dark`。
- `source`：第三方主题填写可核对的上游 URL；本站原创主题填写 `original`。
- `swatches`：主题库中显示的色块。
- `tokens`：写入 CSS 变量的值。
- `appearance`（可选）：`texture` 指定表面材质，`stroke` 指定线条风格；未提供时使用常规外观。

新增主题时，把 JSON 文件放到此目录，并把路径加入 `index.json` 的 `files` 数组。

目前 `appearance.texture` 支持 `colored-pencil`（纹理文件在 `public/textures/`），`appearance.stroke` 支持 `heavy`。新材质或线条风格可在 `global.css` 中按对应的 `data-theme-texture` / `data-theme-stroke` 扩展，不需要改动颜色 token 的契约。

## 来源约束

- 第三方主题不凭感觉创建新的调色板；颜色必须来自 `source` 指向的上游主题。
- 本站原创主题可将 `source` 设为 `original`，并在主题文件中同时声明自己的配色与外观。
- 允许把上游的编辑器、侧栏、按钮等颜色映射到本站 token。
- `--wallpaper-dim` 与 `--shadow` 可以在上游底色上调整透明度，以适配壁纸和阴影。
- Catppuccin 的强调色也只能从同一 flavor 的官方命名色中选择。
