---
title: 框架与工程化考点
description: React diff 与 setState 机制、Redux 核心组成、Vue 常考清单，以及 Webpack、Vite、Git 的面试要点。
date: 2024-11-03
category: interview
tags: [vue, javascript, webpack, vite, notes]
---

## React

### diff 算法

把树形结构按层级分解，**只比较同级元素**。给列表结构的每个单元添加唯一 `key` 方便比较。React 只匹配相同 class（组件名）的 component。

调用 `setState` 时 React 将组件标记为 dirty，到每个事件循环结束时检查所有 dirty 组件并重新绘制，实现合并操作。此外支持选择性子树渲染，开发者可以重写 `shouldComponentUpdate` 来提高 diff 性能。

### setState 的同步与异步

这里的"异步"不是指异步代码实现，而是 React 会先收集变更再统一更新。

**在原生事件和 `setTimeout` 中是同步的，在合成事件和钩子函数中是异步的。**

内部通过 `isBatchingUpdates` 判断是直接更新还是稍后更新，默认值为 `false`。React 调用事件处理函数前会先调用 `batchedUpdates` 把它设为 `true`，因此由 React 控制的事件处理过程就变成了批量更新。

### 高阶组件 HOC

**高阶组件接收 React 组件作为参数并返回一个新组件，它本身是一个函数而不是组件**，是重用组件逻辑的高级方法。Redux 提供的 `connect` 就是典型的高阶组件。

### 性能优化生命周期

`shouldComponentUpdate` 用来判断是否需要调用 `render` 重新描绘 DOM。DOM 描绘非常消耗性能，在这个方法中写出更优的判断逻辑可以极大提升性能。

### 操作 DOM

在需要操作的标签上设置 `ref` 属性（保证值不重复），后续通过 `this.refs.属性名` 获取对应的虚拟 DOM 对象。

### JSX 中的平行标签

用 `<>...</>` 或 `<React.Fragment>...</React.Fragment>` 包裹，两种方式本质相同，底层都是通过 `document.createDocumentFragment()` 创建虚拟 DOM 标签。

## Redux

Redux 是状态管理工具，不仅可用于 React，也可在其他框架中使用，甚至能脱离框架独立使用。

三个核心组成部分：`store` 是存储数据的对象，必须通过 `createStore` 创建；`action` 是更新数据的规则，必须有一个 `type` 属性且值为字符串；`reducer` 是更新数据的函数，接收 `state` 和 `action` 两个参数。

在 React 中通常配合 `react-redux` 简化使用步骤。

## Vue

### MVVM 与设计思想

Vue 负责 VM（视图模型）的工作，将视图和模型相关联——模型变化时视图自动更新，也可以通过视图操作模型。核心思想是组件化开发和声明式编程。

### 常考清单

双向绑定原理、组件通信方式、生命周期、`created` 与 `mounted` 的区别、`computed` 与 `watch` 的区别、路由原理、`keep-alive` 的作用、常用指令与修饰符、路由传参方式、Vuex 的理解与使用场景及优缺点。

## SSR 服务端渲染

SSR 全称 Server Side Rendering，让页面渲染在服务端完成。生产环境必须部署 Node.js 环境，因为服务端渲染需要借助 Node 完成。Vue 生态中可以使用 Nuxt 框架实现。

## 构建工具

### 为什么需要构建工具

习惯了在 Node 中编写代码后，回到前端会遇到两个问题：浏览器兼容性导致不能放心使用模块化规范；即使能用模块化，模块过多时也会面临加载性能问题。

构建工具将使用 ESM 规范编写的代码转换为旧的 JS 语法并打包成单个文件，同时解决了兼容性和模块过多的问题。

### Webpack

基本使用步骤是初始化项目、安装 `webpack` 和 `webpack-cli`、创建 `src` 目录编写代码、执行打包命令。

```js
const path = require('path')

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {},
  module: {
    rules: [
      { test: /\.css$/i, use: ['style-loader', 'css-loader'] }
    ]
  }
}
```

**Babel 集成**用于把新 JS 语法转换为旧语法提高兼容性。安装 `babel-loader @babel/core @babel/preset-env` 后配置：

```js
module: {
  rules: [
    {
      test: /\.m?js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: { presets: ['@babel/preset-env'] }
      }
    }
  ]
}
```

同时在 `package.json` 中设置 `browserslist` 兼容列表。

**插件**用于扩展 webpack 功能，`html-webpack-plugin` 可以在打包后自动生成 HTML 页面。**开发服务器**用 `webpack-dev-server`，`devtool: "inline-source-map"` 配置源码映射。

### Vite

Vite 与 webpack 的运行方式根本不同：**开发时不打包，直接以 ESM 方式运行项目；只在部署时才打包。** 这是它启动速度快的根本原因。

```js
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: []
})
```

开发命令 `vite` 启动服务器，`vite build` 打包，`vite preview` 预览打包结果。Vite 的源码目录就是项目根目录。

### Webpack 与 Gulp 的区别

在代码合并这件事上，**webpack 基于 CommonJS 模块化规范进行合并，而 gulp 只是简单的文件拼接**。常见的前端构建工具还有 grunt。

## Git

### 常用命令

```bash
git init                      # 初始化仓库
git add <file>                # 添加到暂存区
git commit -m "message"       # 提交到本地仓库
git push <remote> <branch>    # 推送到远程仓库
git pull                      # 拉取并自动合并
git clone <url>               # 克隆仓库

git branch                    # 查看分支
git branch <name>             # 创建分支
git switch <name>             # 切换分支
git switch -c <name>          # 创建并切换
git merge <name>              # 合并分支

git log --oneline             # 查看简洁日志
git reflog                    # 查看所有日志
git reset --hard <commit-id>  # 版本回退
```

### merge 与 rebase

两者最终结果一样，但 rebase 会让提交记录更整洁清晰。

变基的原理是：找到两条分支最近的共同祖先，对比当前分支相对于祖先的历史提交并提取到临时文件，将当前分支指向目标基底，最后以新基底为起点重新执行历史操作。

**重要约束**：大部分情况下 merge 和 rebase 可以互换，但**如果分支已经推送到远程仓库，就不要再变基**。

### fetch 与 pull

`git fetch` 从远程下载所有代码但**不会自动合并**，需要手动合并；`git pull` 拉取并自动合并。本地版本低于远程时 push 会被拒绝，必须先确保版本一致。

### Git 与 SVN 的区别

Git 是分布式仓库管理系统，每个人本地都有完整仓库；SVN 是集中式，仓库只有一个。SVN 一般需要服务端为每人分配账号密码，Git 使用 SSH 公钥/私钥对区分不同开发者。

### GitHub Pages 部署要求

静态页面的分支必须叫 `gh-pages`。如果希望通过 `xxx.github.io` 访问，需要将仓库名配置为 `xxx.github.io`。

## 小程序

`onLoad` 和 `onShow` 的区别在于触发时机。首次加载时 `onLoad` 在页面加载时调用，可通过 `options` 获取参数；`onShow` 在页面显示时调用。

**从其他页面返回时，`onShow` 会重新调用，`onLoad` 不会。** 因此有内容需要及时更新时应把逻辑放在 `onShow`，但要注意每次返回都执行会带来性能开销。
