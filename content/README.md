# Content files

展示端读取这些 JSON 文件：

- `site.json`：站点标题、个人资料、壁纸路径、社交链接。
- `posts.json`：文章索引。新增文章时添加一个对象，`id` 用于生成 `#/post/{id}` 路由，`markdown` 指向正文文件。
- `articles/*.md`：文章正文。详情页会按需读取 Markdown，并生成右侧大纲。

Markdown 支持常见标题、段落、列表、引用、代码块、链接和 LaTeX 公式。公式使用 MathJax 渲染，例如 `$x^2$` 或 `$$E = mc^2$$`。
