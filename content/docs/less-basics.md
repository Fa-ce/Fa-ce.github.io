---
title: Less 语法与编译笔记
description: 变量、嵌套、混合、extend、导入、内置函数和递归生成列的课程示例。
date: 2023-04-26
category: toolchain
tags: [css, notes, cheatsheet]
source: 尚学堂 ES6 课程 005_less_gulp、006_webpack 的 Less 笔记与示例
---

# Less 语法与编译

Less 是 CSS 预处理语言，提供变量、混合和运算等能力。浏览器最终使用编译后的 CSS；课程还提到 Sass/SCSS、Stylus，同属预处理工具范畴。

## 编译与页面引用

独立练习目录中的命令示例：

```sh
npm install --save-dev less
npx lessc my.less my.css
```

课程也使用全局安装 `npm install -g less` 后运行 `lessc`，或通过 Gulp、Webpack、桌面编译工具处理。本篇保留语言与编译片段，不附带这些工程。

```html
<link rel="stylesheet" href="my.css">
<div id="box">
  <p class="p1"><i class="font">图标</i></p>
  <span class="sp1">文字</span>
</div>
<div class="c1">固定圆角</div>
<div class="c2">指定圆角</div>
<div class="c3">默认圆角</div>
<div id="box2"><p class="p1"><i class="font">复用样式</i></p></div>
```

## 变量、嵌套与父选择器

```less
@danger: red;
@warning: yellow;
@success: green;
@primary: blue;
@baseWidth: 20px;
@baseHeight: 10px;

#box {
  min-height: (@baseHeight * 20);
  background: @warning;
  color: @danger;
  .p1 {
    border: 2px solid @success;
    padding: (3 * 23px);
    .font {
      color: #ccc;
      font-size: 20px;
      &:hover { color: darken(@danger, 20%); }
    }
  }
  .sp1 {
    color: @primary;
    font-size: ceil((200px / 34));
  }
}
```

嵌套生成 `#box .p1 .font` 等选择器；`&` 代表完整的父选择器，因此 `&:hover` 生成父选择器的悬停状态。

运算加括号可以让意图明确，尤其除法受 Less 版本和 math 选项影响。原例 `ceil(200/34px)` 改为 `ceil((200px / 34))`，表达“200px 除以 34，再向上取整”。[Less 运算说明](https://lesscss.org/#operations)。

## 混合与参数

普通 class 可以作为声明集合混入；带空括号的 mixin 定义自身不会生成同名 CSS 规则。

```less
@baseWidth: 20px;
.margin20 { margin: @baseWidth; }
.radius() { border-radius: 4px; }
.radius2(@width) { border-radius: @width; }
.radius3(@width: 5px) { border-radius: @width; }

.c1 { .margin20(); .radius(); }
.c2 { .margin20(); .radius2(8px); }
.c3 { .margin20(); .radius3(); }
```

编译后 `.c1`、`.c2`、`.c3` 都有 `margin: 20px`，圆角分别为 4px、8px、5px。传入 `.radius3(10px)` 可覆盖默认值。

## extend

```less
#box { color: red; }
#box .font { font-size: 20px; }
#box2 { &:extend(#box all); }
```

输出含义：

```css
#box, #box2 { color: red; }
#box .font, #box2 .font { font-size: 20px; }
```

`extend` 合并选择器，mixin 则把声明放入调用位置。`all` 允许在复合选择器中匹配并替换目标部分，不是运行时 DOM 继承。[Less extend 文档](https://lesscss.org/features/#extend-feature)。

## 导入

```less
@import 'test.less';
@import 'test2.css';
```

默认情况下 `.less` 导入由编译器处理；`.css` 导入通常保留为 CSS `@import`，浏览器仍需能访问对应 CSS。需要不同处理方式时使用显式导入选项，不能认为所有 import 都会内联。

课程 `test.less` 是重置样式，`test2.css` 给 `em`、`i` 设置字体和颜色；可作为独立被导入文件：

```less
// test.less
* { margin: 0; padding: 0; }
a { text-decoration: none; color: #000; }
ul { list-style: none; }
```

```css
/* test2.css */
em, i {
  font-size: 16px;
  font-style: normal;
  color: red;
}
```

## 内置函数与递归循环

课程实际使用 `darken` 调暗颜色、`ceil` 向上取整，并介绍类型判断函数这一类别。下面保留带守卫的递归混合，生成十列宽度：

```less
@primary: blue;
.generate-columns(@count, @index: 1) when (@index =< @count) {
  .column-@{index} {
    width: (@index * 100% / @count);
    height: 10px;
    background: darken(@primary, (@index * 5%));
  }
  .generate-columns(@count, (@index + 1));
}
.generate-columns(10);
```

插值 `@{index}` 生成 `.column-1` 至 `.column-10`，宽度从 10% 到 100%。守卫条件是递归终止条件；传入的列数应为正整数。

## 来源记录

- `005_less_gulp/code/readme.md` Less 章节、`02_less/my.less`、`test.less`、`test2.css`、`index.html`。
- `006_webpack/code/readme.md` Less 复习、`01_gulp/index.less`：与前一课重叠的内容合并。
- `my.css` 属于编译输出，整理为关键输出示意；锁文件只用来核对依赖，不迁入。
- Gulp 编译 Less 的示例见 [Gulp](/docs/gulp-basics)，Webpack loader 链见 [Webpack](/docs/webpack-basics)。
