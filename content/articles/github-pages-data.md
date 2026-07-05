# GitHub Pages 上的轻量内容层

对个人博客来说，很多时候不需要数据库。文章列表、站点设置和主题配置都可以是静态文件，提交到仓库后由 GitHub Pages 直接托管。

## 文件就是接口

当前展示端读取三类文件：

- `content/site.json`
- `content/posts.json`
- `themes/index.json`

文章正文则由 `posts.json` 指向 Markdown 文件。

## 为什么保留索引

浏览器不能直接枚举仓库目录，因此仍然需要一个索引文件告诉展示端有哪些文章。

## 部署模型

```text
Markdown + JSON -> GitHub Pages -> Browser
```

这个模型简单、可迁移，也适合之后接入桌面管理端。
