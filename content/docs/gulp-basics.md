---
title: Gulp 4 任务与文件流
description: Gulp 任务完成信号、串并行组合、文件流、资源处理、分阶段输出和文件监听。
date: 2023-04-26
category: toolchain
tags: [javascript, nodejs, notes]
source: 尚学堂 ES6 课程 005_less_gulp、006_webpack、007_webpack 学习笔记与代码
---

# Gulp 4 任务与文件流

课程使用 Gulp 4.0.2。以下是独立工具环境中的 CommonJS 配置片段，用于记录任务和流的处理方式；不附带 Node 工程。插件名称保留课程版本语境，未声明为当前版本兼容组合。

## 安装与任务入口

```sh
npm install --save-dev gulp@4 gulp-cli
npx gulp
npx gulp copyScripts
```

原课使用全局 `gulp-cli`；局部安装后也可以通过 npx 调用。默认读取 `gulpfile.js`，默认任务名为 `default`。

```js
const { src, dest, series, parallel } = require('gulp');

function ready(done) {
  console.log('任务开始');
  done();
}
function copyScripts() {
  return src('js/**/*.js').pipe(dest('dist/js'));
}
function copyStyles() {
  return src('css/**/*.css').pipe(dest('dist/css'));
}
exports.copyScripts = copyScripts;
exports.default = series(ready, parallel(copyScripts, copyStyles));
```

任务必须让 Gulp 知道何时结束，例如返回 stream、Promise，或调用完成回调。流任务要 return；否则后续组合与监听可能无法正确等待。

- `series(a, b)`：a 完成后再运行 b。
- `parallel(a, b)`：并发运行；任务间不能有未表达的数据依赖。
- 失败通过返回流的 error 或 Promise 拒绝等方式上报，不要吞掉错误后假装完成。

## src、pipe、dest

`src(glob)` 读取匹配文件为文件对象流，`.pipe(transform)` 连接处理步骤，`.pipe(dest(directory))` 写入目录并继续输出文件流。

| glob | 含义 |
| --- | --- |
| `a.js` | 单文件 |
| `js/*.js` | 当前目录下的 JS |
| `js/**/*.js` | 目录及子目录中的 JS |
| `['a.js', 'b.js']` | 多个匹配模式 |
| `['js/**/*.js', '!js/build.js']` | 包含匹配并排除一个文件 |

## 压缩与重命名

源课以 jQuery、Bootstrap 作为压缩输入，整理后使用通用的自有文件名，第三方库源码不随文档复制。下面涉及的包需在独立练习环境已有对应依赖。

```js
const { src, dest, series, parallel } = require('gulp');
const uglify = require('gulp-uglify');
const minifyCss = require('gulp-minify-css');
const rename = require('gulp-rename');

function scripts() {
  return src('js/app.js')
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest('dist/js'));
}
function styles() {
  return src('css/app.css')
    .pipe(minifyCss())
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest('dist/css'));
}
exports.serial = series(scripts, styles);
exports.concurrent = parallel(scripts, styles);
```

原依赖包含 `gulp-uglify@3`、`gulp-minify-css@1`、`gulp-rename@2`。这些是旧课插件记录，不建议据此直接给现有项目安装一组无版本约束的插件。

## 转译、合并与资源处理

保留课程的 JS、CSS、HTML、图片四条任务链。图片任务在原 `allTask` 中未被包含，以下将它一并纳入，避免示例 HTML 中的图片输出遗漏。

```js
const { src, dest, parallel } = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const less = require('gulp-less');
const minifyCss = require('gulp-minify-css');
const minifyHtml = require('gulp-minify-html');
const imagemin = require('gulp-imagemin');

function scripts() {
  return src('es6/*.js')
    .pipe(babel())
    .pipe(src('js/*.js'))
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest('dist/src/js'));
}
function styles() {
  return src('index.less')
    .pipe(less())
    .pipe(minifyCss())
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest('dist/src/css'));
}
function images() {
  return src('images/*').pipe(imagemin()).pipe(dest('dist/src/images'));
}
function html() {
  return src('index.html').pipe(minifyHtml()).pipe(dest('dist/src'));
}
exports.allTask = parallel(scripts, styles, images, html);
```

原配置对应 `gulp-babel@8`、`gulp-concat@2`、`gulp-less@4`、`gulp-imagemin@7`、`gulp-minify-html@1`。Babel 规则来自同目录 `.babelrc`，见 [Babel](/docs/babel-basics)。图片插件可能包含原生或平台相关依赖，本次只保留代码，不安装它们。

HTML 输入的引用要与输出布局一致，例如：

```html
<link rel="stylesheet" href="css/index.min.css">
<ul><li><img src="images/1.jpg" alt="示例图片"><p>标题1</p></li></ul>
<script src="js/app.min.js"></script>
```

这段只说明输出相对路径，`1.jpg` 代表独立练习者提供的素材。原重复列表页面合并为一项；任务不负责自动改写所有 HTML 引用。

`concat` 是文件拼接，不会像模块打包器那样解析依赖图。原练习把多个同名声明的课堂文件混在一起，实际组合时需避免全局冲突；带 import/export 的应用应交给模块打包器处理。

## 向流中添加文件与分阶段输出

```js
const { src, dest } = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

function stages() {
  return src('es6/*.js')
    .pipe(babel())
    .pipe(dest('dist/es5'))
    .pipe(src('js/*.js'))
    .pipe(uglify())
    .pipe(dest('dist/min'));
}
exports.stages = stages;
```

中途 `src()` 加入的文件只经过后续步骤；原流文件也继续流动。`dest()` 写文件后继续传递，不会清空原流。同名文件汇入相同目录可能覆盖，输入模式重叠还可能重复处理。[Gulp 文件流文档](https://gulpjs.com/docs/en/getting-started/working-with-files/)。

## 文件监听

```js
const { src, dest, watch } = require('gulp');

function copy() {
  return src('js/**/*.js').pipe(dest('dist/js'));
}
function dev() {
  return watch('js/**/*.js', {
    ignoreInitial: false,
    events: ['add', 'change', 'unlink'],
    delay: 500
  }, copy);
}
exports.dev = dev;
```

`ignoreInitial: false` 初次就运行任务；`delay` 是事件后的等待时间。默认监听 add/change/unlink，其他可选事件包括 addDir、unlinkDir、ready、error、all；all 不包括 ready 和 error。任务必须报告完成，监听器才能按规则安排后续运行。[Gulp 文件监听文档](https://gulpjs.com/docs/en/getting-started/watching-files/)。

监听删除事件不等于自动删除输出文件；上面的复制任务仅更新仍匹配的文件。

## 来源记录

- `005_less_gulp/code/03_gulp/gulpfile.js` 与 README：默认任务、JS/CSS 压缩、串并行。
- `006_webpack/code/01_gulp/gulpfile.js` 与 README：Babel、拼接、Less、HTML、图片、分阶段输出、监听。
- `006_webpack/code/01_gulp/index.html`：合并重复列表，保留资源路径关系。
- `007_webpack/code/readme.md` Gulp 复习：并入对应章节。
- 原第三方库、图片素材、构建结果和包锁不迁入；完整工程依赖仅用于确认片段所处版本。
