# Note-仁 迁移覆盖清单

整理日期：2026-09-16。来源目录 `F:/仁谷/Note-仁`，共 7 个文件。原目录保持不变。

文档日期沿用来源文件的修改日期。

| 来源                                 | 处理 | 去向 / 理由                                                              |
| ------------------------------------ | ---- | ------------------------------------------------------------------------ |
| GOJS网格.md                          | 整理 | [gojs-grid-panel](../../content/docs/gojs-grid-panel.md)                 |
| Note.md                              | 整理 | [yarn-npm-install-errors](../../content/docs/yarn-npm-install-errors.md) |
| assets/2024-08-06-19-58-21-image.png | 素材 | `public/images/d-note-ren/`                                              |
| assets/2024-08-06-20-06-28-image.png | 素材 | `public/images/d-note-ren/`                                              |
| assets/2024-08-06-19-58-19-image.png | 排除 | 与 19-58-21 内容相同（md5 一致），且未被引用                             |
| GuidedDraggingTool.js                | 排除 | GoJS 官方扩展的原样拷贝，Northwoods 版权，不是笔记                       |
| ignoreGoJS.js                        | 排除 | 去除 GoJS 商业授权水印的脚本，不适合放在公开站点                         |

## 整理取舍

- GOJS网格.md 是 evget 对官方 Grid Patterns 页的中译。代码里的全角标点、「新 go.Size」等机翻痕迹已修正，BarH 示例末尾被截断的两行已补全。6 张外链图下载到本地，避免外站失效；`source` 指向官方页面。
- Note.md 的三条排查各成一节，截图改为本地绝对路径引用。
