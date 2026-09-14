---
title: Webpack 4 配置与开发服务器笔记
description: 课程中的入口出口、loader、plugin、source map、开发代理以及 React 环境配置片段。
date: 2023-04-26
category: toolchain
tags: [webpack, javascript, nodejs, notes]
source: 尚学堂 ES6 课程 004_es6、006_webpack、007_webpack 学习笔记与代码
---

# Webpack 4 配置笔记

本篇对应原课程 Webpack 4.43、webpack-cli 3.3、webpack-dev-server 3.11。代码均为文档示例，不包含完整 Node 工程。`contentBase`、`before` 等按旧版本记录，不可直接照搬到其他大版本。

## 模块打包与工具分工

Webpack 从入口建立模块依赖图，按配置转换和输出资源；开发服务器可以提供静态资源、监听与重新编译。

| 工具 | 本课程中的定位 |
| --- | --- |
| npm scripts | 用命令串联工具 |
| Gulp | 显式配置文件处理任务和流 |
| Webpack | 根据模块依赖组织构建 |
| Rollup | 另一种模块打包工具，常见于库构建 |
| FIS3 | 课程提到的历史工具名称，本目录没有相关实现 |

工具各有场景，原文“某工具只适合上线前”“某工具只能打包 JS”过于绝对。Webpack 可解析 JavaScript 和 JSON，其他资源可经 loader 接入。

## 命令与基本配置

独立课程环境的安装与调用示意：

```sh
npm install --save-dev webpack@4 webpack-cli@3 webpack-dev-server@3
npx webpack --mode development
npx webpack-dev-server
```

CommonJS `webpack.config.js`：

```js
const path = require('path');
module.exports = {
  mode: 'development',
  entry: './src/main.js',
  output: {
    filename: 'build.js',
    path: path.resolve(__dirname, 'dist')
  }
};
```

`output.path` 是绝对文件系统路径。`development` 便于开发调试，`production` 启用生产优化；Webpack 4 还支持 `none`，并非只有课程讲的两个取值。

### 单入口与多入口

| entry 写法 | 说明 |
| --- | --- |
| `'./src/main.js'` | 单个入口模块 |
| `['./src/a.js', './src/main.js']` | 同一入口中包含多个模块 |
| `{ app: './src/app.js', main: './src/main.js' }` | 多个命名入口 |

多入口应使用区分名称的输出，如 `filename: '[name]_[chunkhash:8].js'`。实际输出还可能包括异步 chunk、资源等，不能把“单入口”理解为永远只有一个文件。

## loader 与 plugin

loader 转换匹配模块，plugin 参与更广的构建流程。以下根据 006 课配置整理，依赖原课的 babel-loader 8、file-loader 6、html-webpack-plugin 4、clean-webpack-plugin 3 及 Babel 7。

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/main.js',
  output: {
    filename: 'out.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: { presets: ['@babel/preset-env'] }
        }
      },
      { test: /\.(png|jpe?g|gif|svg)$/i, use: 'file-loader' }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({ template: './index.html', filename: 'home.html' })
  ]
};
```

`test` 匹配文件，`include`／`exclude` 控制范围，`use` 可写字符串、对象或数组。loader 数组的普通转换阶段从右向左执行。[Webpack 4 loader 文档](https://v4.webpack.js.org/concepts/loaders/)。

HTML 模板只需页面结构；由 HtmlWebpackPlugin 注入产物脚本时，应移除原模板手写的 `dist/build.js`，否则容易重复或引用旧产物。

### 图片模块与路径

原代码跨目录引用 `../../01_gulp/images/2.jpg`，再手动拼接 `dist/`。整理为同一示例目录中的资源路径；文件名代表使用者提供的图片，不随博客迁入。

```js
import imageUrl from './images/2.jpg';

const image = new Image();
const timer = setTimeout(() => finish(new Error('图片加载超时')), 5000);
function finish(error) {
  clearTimeout(timer);
  image.onload = null;
  image.onerror = null;
  if (error) console.error(error.message);
  else document.body.append(image);
}
image.alt = '课程示例图片';
image.onload = () => finish();
image.onerror = () => finish(new Error('图片加载失败'));
image.src = imageUrl;
```

file-loader 导入值用于浏览器访问资源，部署子路径时由 `output.publicPath` 等配置配合，避免在业务代码里硬编码构建目录前缀。CommonJS 和 ES Module 的源模块示例见 [模块化](/docs/js-module-systems)。

## source map

`devtool` 决定 source map 生成方式，影响构建速度、调试映射质量和产物大小。

| 课程配置 | 调试信息 |
| --- | --- |
| `eval` | 便于定位生成后的模块代码 |
| `cheap-eval-source-map` | 行级映射，通常不追溯 loader 原始源码 |
| `cheap-module-eval-source-map` | 行级映射并利用 loader 的映射信息 |
| `source-map` | 单独输出较完整的 source map 文件 |

以上拼写按 Webpack 4。生成代码、转换后的代码和原始代码不是同一层级，映射到原始代码还需要 loader 提供相应信息。

## 开发服务器、Mock 与代理

下面是放入配置的 `devServer` 片段，针对 webpack-dev-server 3：

```js
const path = require('path');
const devServer = {
  contentBase: path.resolve(__dirname, 'dist'),
  host: 'localhost',
  port: 4000,
  compress: true,
  open: false,
  before(app) {
    app.get('/user', (req, res) => {
      res.json({ uname: 'kevin', age: 12 });
    });
  },
  proxy: {
    '/owner': {
      target: 'http://localhost:5000',
      changeOrigin: true,
      pathRewrite: { '^/owner': '' },
      proxyTimeout: 5000,
      timeout: 5000
    }
  }
};
```

`contentBase` 提供静态文件；构建产物通常由开发中间件在内存中提供，不代表磁盘一定出现新的 dist。源文件变化会触发重新构建；`before` 可增加开发阶段的模拟接口。`open` 控制是否启动浏览器，这里设为 false。

请求关系：

| 浏览器请求 | 开发服务器处理 |
| --- | --- |
| `http://localhost:4000/user` | 由 before 注册的模拟接口响应 |
| `http://localhost:4000/owner/getdata` | 去掉前缀后代理至 `http://localhost:5000/getdata` |
| `http://localhost:5000/getdata` | 绕过代理直接访问另一来源，需要后端满足浏览器跨源要求 |

`changeOrigin` 改写发送给目标服务的 Host 信息，不是“关闭浏览器同源策略”。`pathRewrite` 使用开头锚点，仅移除前缀。[Webpack 4 开发服务器文档](https://v4.webpack.js.org/configuration/dev-server/)。

### 后端代码片段

原 `server/server.js` 使用 Express，但对应 package 未显式列出 Express。这里只保存接口示例，不启动服务；运行片段需要独立环境具备 Express。

```js
const express = require('express');
const app = express();
app.get('/getdata', (req, res) => {
  res.json({
    msg: '成功',
    code: 23,
    list: [
      { id: 1, title: 'title1', desc: '简介1' },
      { id: 2, title: 'title2', desc: '简介2' }
    ]
  });
});
const server = app.listen(5000, '127.0.0.1');
server.on('error', error => console.error('服务启动失败：', error.message));
```

前端 Axios 请求片段，放在开发服务器提供的页面中，并由打包环境解析依赖：

```js
const axios = require('axios');
async function load() {
  try {
    const user = await axios.get('/user', { timeout: 5000 });
    const data = await axios.get('/owner/getdata', { timeout: 5000 });
    console.log(user.data, data.data);
  } catch (error) {
    console.error('请求失败：', error.message);
  }
}
load();
```

原例访问外部课程接口的请求用本地 Mock 替代，不依赖第三方站点可用性。

## React、CSS、Less 配置摘录

原目录使用 React 16.13.1，`src/main.js` 为空，HTML 也没有应用内容。能收录的是 Babel preset 与资源 loader 配置；不据此补造 React 应用。

以下数组放到前面配置的 `module.rules`，并配合已有 HtmlWebpackPlugin、CleanWebpackPlugin：

```js
const rules = [
  {
    test: /\.jsx?$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: { presets: ['@babel/preset-env', '@babel/preset-react'] }
    }
  },
  { test: /\.css$/, use: ['style-loader', 'css-loader'] },
  { test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader'] },
  {
    test: /\.(png|jpe?g|gif|svg)$/i,
    use: { loader: 'url-loader', options: { limit: 8192 } }
  }
];
```

CSS 先经 css-loader 解析，再由 style-loader 插入页面；Less 在此前先编译为 CSS。url-loader 按大小阈值决定是否内联，超过阈值的回退处理还需要相应 file-loader 依赖。原依赖里有 less-loader，但未直接列出 Less 编译器，也需在独立环境中配齐。

课程列出的依赖按职责理解即可：webpack/cli/dev-server 提供构建与服务，Babel core/env/react 提供转译，各 loader 处理资源，React/ReactDOM 提供应用运行时。现代项目不能只复制这份历史版本配置就假设兼容。

## 来源记录

- `004_es6/code/webpack.config.js`：模块入口、输出、静态目录和 9000 端口示例，合并至基本配置与 devServer。
- `006_webpack/code/02_webpack/webpack.config.js`、`index.html`、`src/main.js`、`src/js/a.js`、`b.js`：模块、图片、Babel、插件和输出模板。
- `007_webpack/code/webpack.config.js`、`src/main.js`、`src/js/a.js`、`server/server.js`：开发模式、source map、Mock 与代理。
- `007_webpack/react-env/webpack.config.js`、`public/index.html`、空的 `src/main.js`：仅保留有内容的构建配置。
- `006_webpack/code/readme.md`、`007_webpack/code/readme.md`：去重复习后归入对应章节；包配置和锁文件只用于版本判断。
