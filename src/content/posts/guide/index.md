---
title: JieGerBlog 简单使用指南
published: 2025-01-01
description: 如何使用 JieGerBlog 博客模板。
image: ./cover.avif
tags:
  - JieGerBlog
  - 博客
  - Markdown
  - 指南
category: 技术
draft: false
comment: true
pinned: true
---
# JieGerBlog 主题文章编写完整指南（适配 blog.mamkj.top 站点）
> 本主题基于 Astro 框架开发，若本指南未覆盖到的功能，可查阅官方 [Astro文档](https://docs.astro.build/) 获取完整开发信息。

## 文章的 Front‑matter
> 每篇 Markdown 文章头部，被 `---` 包裹的元数据块就是 Front‑matter，用来控制文章标题、时间、封面、置顶、加密、评论、SEO、分享卡片等全部表现行为。

| 属性 | 描述 |
|------|------|
| `title` | 文章标题。首页列表、文章页面、浏览器标签页、社交分享卡片均会读取该值，建议简短清晰。 |
| `published` | 文章发布日期。格式推荐 `YYYY‑MM‑DD`，用于归档排序、页面时间展示，写正式文章建议必填。 |
| `updated` | 文章更新日期。修改旧文章后填写，页面会显示更新时间；如果未设置，将默认使用发布日期。 |
| `pinned` | 是否将此文章置顶在文章列表顶部。设置 `pinned: true` 生效，普通文章无需填写该字段。 |
| `description` | 文章的简短描述。**首页摘要、SEO、社交OG分享卡片都会读取此字段**，建议写1‑3句话概括文章内容，有利于站点SEO。 |
| `image` | 文章封面图片路径。<br/>1. 以 `http://` 或 `https://` 开头：使用网络图片<br/>2. 以 `/` 开头：`public` 目录中的图片<br/>3. 不带任何前缀：相对于 markdown 文件的路径<br/>> 💡实际使用建议：推荐将封面图和md文件放在同一个子目录，方便统一管理配图资源。 |
| `tags` | 文章标签，数组格式，示例：`tags: ["运维","Astro","博客"]`，会渲染到文章页与标签归档页。 |
| `category` | 文章分类，单字符串，示例：`category: "技术笔记"`，用于分类归档页面。 |
| `lang` | 文章语言代码（如 `zh‑CN`）。仅当文章语言与站点默认语言不同时设置，中文博客绝大多数场景不需要配置。 |
| `licenseName` | 文章内容的许可证名称，单篇文章自定义版权，会展示在文章底部。 |
| `licenseUrl` | 文章内容的许可证链接，需要配合 `licenseName` 一起使用。 |
| `author` | 文章作者。不填写会继承站点全局配置的作者信息。 |
| `sourceLink` | 文章内容的来源链接或参考资料链接，会展示在文章末尾。 |
| `draft` | 如果这篇文章仍是草稿，设置 `draft: true`；构建发布后不会对外显示，本地预览可以看到，适合写未完成稿件。 |
| `comment` | 是否启用此文章的评论功能。默认为 `true`；设置 `comment: false` 关闭本篇评论。 |
| `slug` | 自定义文章 URL 路径。如果不设置，将使用文件名作为 URL，直接影响SEO，下面有详细使用说明。 |
| `password` | 文章密码。设置后文章内容将被 AES‑256‑GCM 加密，访客需输入密码才能查看正文，适合私密笔记。 |
| `passwordHint`| 密码提示。显示在密码输入框上方，帮助访客回忆密码，不需要可以省略不写。 |

## 文章文件的放置位置
您的文章文件应放置在 `src`/content/posts`/` 目录中。您也可以创建子目录来更好地组织您的文章和配套配图资源。

