# Theme files

`index.json` 决定默认亮色和暗色主题，并列出需要加载的主题文件。

每个主题文件包含：

- `id`：唯一标识。
- `type`：`light` 或 `dark`。
- `source`：主题维护者的官方调色板或主题文件，必须是可核对的 URL。
- `swatches`：主题库中显示的色块。
- `tokens`：写入 CSS 变量的值。

新增主题时，把 JSON 文件放到此目录，并把路径加入 `index.json` 的 `files` 数组。

## 来源约束

- 不凭感觉创建新的调色板；颜色必须来自 `source` 指向的上游主题。
- 允许把上游的编辑器、侧栏、按钮等颜色映射到本站 token。
- `--wallpaper-dim` 与 `--shadow` 可以在上游底色上调整透明度，以适配壁纸和阴影。
- Catppuccin 的强调色也只能从同一 flavor 的官方命名色中选择。
