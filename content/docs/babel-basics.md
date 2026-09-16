---
title: Babel 转译基础与构建集成
description: Babel 7 的 CLI、preset、plugin、目标环境以及 Gulp、Webpack 和 JSX 转译配置摘录。
date: 2026-09-09
category: toolchain
tags: [javascript, es6, webpack, notes]
source: 尚学堂 ES6 课程 002_es6 至 007_webpack 的 Babel 相关笔记与配置
---

# Babel 转译基础

课程使用 Babel 7（原依赖约 7.10）。这里记录命令和配置片段，不附带 Node 工程。片段按 Babel 7 解释，不自动套用到其他大版本。

## Babel 做什么

Babel 按配置把 JavaScript 语法转换为目标环境可理解的形式。它与打包器职责不同：转译处理语法，打包组织模块依赖与输出资源。

| 包                    | 作用                         |
| --------------------- | ---------------------------- |
| `@babel/core`         | 转译核心                     |
| `@babel/cli`          | 命令行入口                   |
| `@babel/preset-env`   | 按目标环境选择语法转换等配置 |
| `@babel/preset-react` | JSX 等 React 相关语法转换    |
| 单独 plugin           | 处理某种具体语法或转换任务   |

仅转换语法不一定补齐运行时 API，例如目标环境缺少 Promise 时，还需要相应 polyfill。targets 和 polyfill 应按目标环境确定。[Babel 使用指南](https://babeljs.io/docs/usage)。

## 安装与 CLI

以下是已有独立练习目录中的命令示例，不需要放进博客项目执行：

```sh
npm init -y
npm install --save-dev @babel/core@7 @babel/cli@7 @babel/preset-env@7
npx babel es6/01_useBabel.js
npx babel es6/01_useBabel.js --out-file dist/build.js
npx babel es6 --out-dir dist
```

`-o` 是 `--out-file`，`-d` 是 `--out-dir`。课程 README 中斜杠分隔的写法表示多个用法，不能把整行连在一起当命令执行。

`npm -D` 是 `--save-dev`，写入 `devDependencies`；`-S` 是 `--save`，通常写入 `dependencies`。原 Less 笔记将两者全称写反，已统一纠正。

## 配置 preset

`.babelrc` 片段：

```json
{
  "presets": [
    ["@babel/preset-env", { "targets": { "ie": "11" } }]
  ]
}
```

IE 11 仅用来演示旧环境转译效果，不代表项目需要支持它。课程写的 `@babel/env` 是 preset 名称的简写，这里统一使用完整包名。

源代码 `es6/01_useBabel.js` 的核心示例：

```js
const sum = (a, b) => a + b;
class Person {
  constructor(name) { this.name = name; }
  say() { return `hello, my name is ${this.name}`; }
}
console.log(sum(1, 2), new Person('kevin').say()); // 3 hello, my name is kevin
```

针对旧环境时，箭头函数、Class 等会转换为对应辅助代码。不要把输出简单理解成逐字替换，实际输出取决于 Babel 版本、targets 和启用的转换。

## 类字段与 JSX

课程的箭头函数类字段由当时的 `@babel/plugin-proposal-class-properties` 处理，历史配置如下：

```json
{
  "presets": ["@babel/preset-env"],
  "plugins": ["@babel/plugin-proposal-class-properties"]
}
```

这个名称来自原 Babel 7 课程环境。类字段现已进入标准，阅读旧配置时应区分提案阶段插件和所用版本的正式转换支持，不要据此给当前博客添加旧插件。

React 配置的核心是再加 JSX preset：

```json
{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```

转译 JSX 不等于提供 React 运行时。原 `react-env/src/main.js` 为空，因此这里只记录配置，没有可迁移的完整 React 应用。

## 与构建工具集成

Webpack 通过 `babel-loader` 处理匹配文件，配置片段放在 `module.rules` 中：

```js
const babelRule = {
  test: /\.js$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
    options: { presets: ['@babel/preset-env'] }
  }
};
```

Gulp 通过 `gulp-babel` 对文件流转译；通常应先转译到旧压缩器能理解的语法，再做压缩。完整的流水线代码见 [Gulp](/docs/gulp-basics)，loader 和其他资源处理见 [Webpack](/docs/webpack-basics)。

## 来源记录

- `002_es6/code/.babelrc`、`es6/01_useBabel.js`、README 与 package 信息：安装、CLI、转译输入。
- `003_es6/code/readme.md` Babel 复习：合并。
- `006_webpack/code/01_gulp/.babelrc`、`gulpfile.js`：Babel 与类字段插件。
- `006_webpack/code/02_webpack/webpack.config.js`、`007_webpack/react-env/webpack.config.js`：loader 与 JSX preset。
- 各 package 文件仅用于确认原依赖版本，未作为完整工程迁入。
