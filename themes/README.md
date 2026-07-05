# Theme files

`index.json` 决定默认亮色和暗色主题，并列出需要加载的主题文件。

每个主题文件包含：

- `id`：唯一标识。
- `type`：`light` 或 `dark`。
- `swatches`：主题库中显示的色块。
- `tokens`：写入 CSS 变量的值。

新增主题时，把 JSON 文件放到此目录，并把路径加入 `index.json` 的 `files` 数组。
