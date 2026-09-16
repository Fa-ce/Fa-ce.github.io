---
title: JavaScript 模块化方案
description: 梳理 CommonJS、AMD、ES Module 等模块化方案的差异与使用方式。
date: 2024-11-03
category: fundamentals
tags: [javascript, module-system, es6, notes]
source: 原有模块化笔记；尚学堂 ES6 课程 004_es6、006_webpack 学习笔记与代码
---

# 模块化

模块化进化史：

最早写代码，全局Global变量容易被污染，很容易命名冲突。

简单封装Namespace模式：减少Global上的变量数目；本质是对象，不安全。

匿名闭包，IIFE 模式：通过函数作用域隔离变量。ES6 还提供块级作用域，函数并不是唯一的局部作用域。

再增强一点，引入依赖：模块模式，现代模块实现的基石。

## 为什么要模块化

避免命名冲突(减少命名空间污染)

更好的分离，按需加载。

提高复用性。

高可维护性。

## 常见模块方案

| 方案      | 导入／导出方式              | 说明                                          |
| --------- | --------------------------- | --------------------------------------------- |
| CommonJS  | `require`、`module.exports` | Node 传统模块规范，浏览器经典脚本不能直接使用 |
| AMD       | `define`、`require`         | 借助加载器组织异步模块加载                    |
| ES Module | `import`、`export`          | 语言标准模块，浏览器和 Node 均可原生支持      |

模块化、转译和打包是不同工作。浏览器原生 ES Module 不要求先打包；兼容旧环境、处理依赖及资源时才按需要引入 Babel 或 Webpack。

## ES Module 导出与导入

课程 `06_module/a.js` 导出变量、函数、类和默认值，`b.js` 消费这些导出。下面是整理后的双文件示例。

`a.js`：

```js
export const num = 12;
export let count = 10;
export function increase() { count += 1; }
export function demo() { return 'demo'; }
export class Person {
  constructor(name) { this.name = name; }
}
export const jt = () => '箭头函数';
const num1 = 1;
const num2 = 2;
export { num1, num2 as second };
export default '课程示例';
```

`b.js`：

```js
import title, { num, count, increase, demo, Person, jt, num1, second as num2 } from './a.js';
console.log(title, num, demo()); // 课程示例 12 demo
console.log(new Person('小明').name, jt()); // 小明 箭头函数
console.log(num1, num2); // 1 2
increase();
console.log(count); // 11：导入的是与原绑定关联的只读视图
```

- 命名导入按导出名称匹配，可以用 `as` 改本地名称。
- 默认导出每个模块至多一个，导入时可以自行命名。
- `import * as moduleInfo from './a.js'` 获取模块命名空间，其中 `moduleInfo.default` 对应默认导出。
- 导入方不能直接给 `count` 重新赋值，但导出模块可以通过自己的函数更新它。

## 浏览器入口

将上面两个文件放在同一目录，HTML 仅加载消费模块的入口：

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head><meta charset="UTF-8"><title>ES Module 示例</title></head>
  <body>
    <script type="module" src="./b.js"></script>
  </body>
</html>
```

通过本地 HTTP 静态服务访问。`file://` 会受到浏览器模块安全限制；普通 `<script>` 也不能直接解析静态 import/export。原入口分别加载 `a.js`、`b.js` 且没有 `type="module"`，已在此纠正。

模块默认严格模式，顶层 `this` 是 `undefined`，顶层变量不会自动成为 `window` 属性。

## CommonJS 示例

课程 `006_webpack/code/02_webpack/src/js/a.js` 使用 CommonJS，下面用 `.cjs` 明确 Node 的模块格式。

`a.cjs`：

```js
function demoA() { return '我是 demoA'; }
module.exports = demoA;
```

`main.cjs`：

```js
const demoA = require('./a.cjs');
console.log(demoA()); // 我是 demoA
```

课程的 Webpack 入口同时使用 require 和 import，属于打包工具支持的场景，不代表可以任意混写浏览器原生模块。Node 中 `.mjs` 明确表示 ES Module，`.js` 的含义还受包的 `type` 等条件影响。

## 转译与打包记录

原笔记的 `babel-cli`、`babel-preset-es2015`、Browserify 属于旧方案：先转译并输出可供 CommonJS 工具消费的代码，再由 Browserify 打包。这里保留其历史用途，Babel 7 的配置见 [Babel 基础](/docs/babel-basics)，课程 Webpack 4 示例见 [Webpack 基础](/docs/webpack-basics)。

## 来源记录

- 原有模块化演进、用途和 Babel/Browserify 笔记：保留并补充适用范围。
- `004_es6/code/06_module/a.js`、`b.js`、`index.html` 与 README 模块章节：合并为命名／默认导出和浏览器入口示例。
- `004_es6/code/webpack.config.js`：拆入 Webpack 专题。
- `006_webpack/code/02_webpack/src/js/a.js`、`b.js`、`src/main.js`：CommonJS 与 ES Module 混合打包，图片导入归 Webpack。
