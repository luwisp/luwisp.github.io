# Content files

站点内容以本地文件为唯一来源：

- `site.json`：站点标题、个人资料、壁纸和外部链接。
- `quotes.json`：主页随机标语。
- `folders.json`：目录的显示名称和说明。
- `web.json`：`网页` 应用的书签文件夹、独立书签和友情链接。
- `articles/**/*.md`：文章正文和 frontmatter。

文章目录会直接映射到分类文件管理器和 URL。例如：

```text
articles/linux/waydroid/waydroid-install.md
-> /posts/linux/waydroid/waydroid-install/
```

每篇文章至少需要以下 frontmatter：

```yaml
---
title: 文章标题
date: 2026-08-25
summary: 一句话摘要。
---
```

`category`、`tags`、`minutes`、`featured` 和 `cover` 均为可选字段。未填写 `category` 时使用顶层目录在 `folders.json` 中的名称，避免为每篇文章重复维护分类。

Markdown 支持标题、列表、引用、表格、代码高亮和 LaTeX 公式。图片可以放在文章旁边的子目录中并使用相对路径引用，Astro 会在构建时处理这些资源。

## 网页书签

`web.json` 中：

- `bookmarks.folders` 保存分类文件夹，每个文件夹包含 `id`、`name` 和 `items`；
- `bookmarks.items` 保存未分类书签，在全部书签页归入“其他”；
- `friends` 保存友情链接；
- 每个链接至少需要 `label` 和 `url`，可选 `description` 与 `icon`。未提供 `icon` 时使用站内统一的网页图标，不会主动请求外站 favicon。
