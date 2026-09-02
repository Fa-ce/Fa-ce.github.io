---
title: CSS 与布局考点
description: em 与 rem 的区别、移动端三种适配方案对比、viewport 标准设置与 REM 布局的媒体查询实现。
date: 2024-11-03
category: interview
tags: [css, html, best-practice, notes]
---

## em 与 rem

`em` 相对于**父元素**的字体大小，`rem` 相对于**根元素**（`html`）的字体大小。

三种单位的取舍：`px` 是精确单位但不利于响应式布局；`em` 以父节点 `font-size` 为参考点，多层嵌套时标准不统一容易造成混乱；`rem` 只需在根元素上确定一个参考值，是移动端适配的主流选择。

## 移动端适配方案

主要有三种，各有适用场景。

### 流式布局

CSS2 时代就有的方案，主要靠百分比排版，页面主要区域的尺寸使用百分数，搭配 `min-width`、`max-width` 使用。

**缺点很明显**：宽度用百分比定义，但高度和文字大小大多仍用 `px` 固定，因此在大屏手机下会出现页面元素宽度被拉得很长、而高度和文字大小保持不变的割裂感。

### 响应式布局

关键技术是 CSS3 的媒体查询，监测屏幕尺寸后有针对性地更改布局。特点是每个分辨率下都有一套布局样式，元素位置和大小都会变。

优点是能同时适配 PC 和移动端，做得足够细致效果很完美。缺点是媒体查询的断点是有限且需要枚举的，只能覆盖主流尺寸，工作量大且设计需要出多个版本。

### REM 布局

在根元素上按屏幕宽度设定 `font-size`，页面内所有尺寸用 `rem` 表达，从而实现盒子宽高的自适应。

```css
@media screen and (min-width: 640px) {
  html { font-size: 100px; }
}

@media screen and (max-width: 639px) and (min-width: 480px) {
  html { font-size: 75px; }
}

@media screen and (max-width: 479px) and (min-width: 414px) {
  html { font-size: 64.6875px; }
}

@media screen and (max-width: 413px) and (min-width: 375px) {
  html { font-size: 58.59px; }
}

@media screen and (max-width: 374px) and (min-width: 360px) {
  html { font-size: 56.25px; }
}

@media screen and (max-width: 359px) {
  html { font-size: 50px; }
}
```

## viewport 标准设置

最标准的 viewport 配置需要满足五点：视口宽度与设备保持一致、默认缩放比例 1.0、不允许用户自行缩放、最大与最小缩放比例均为 1.0。

```html
<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
```

## HTML5 与 CSS3 考察范围

HTML5 部分常考语义化标签、音视频处理、Canvas 与 WebGL、History API、`requestAnimationFrame`、地理位置、WebSocket。

CSS3 部分常考常规属性、动画、盒子模型、响应式布局。
