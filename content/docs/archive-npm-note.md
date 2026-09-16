---
title: npm-note
description: 归档内容，二手课程笔记，不对外展示。
date: 2024-11-03
category: toolchain
tags: [notes]
draft: true
---

# npm

node package manager node包管理器
作用：
1、快速构件 nodejs 工具

```json
 - npm init //初始化。 初始化之后得到一个 package.json 文件
    {
      "name": "npmpro", //工程名
      "version": "1.0.0", //版本
      "description": "我是一个node工程", //描述
      "main": "index.js", //入口js
      "scripts": { //运行脚本
        "test": "echo \"Error: no test specified\" && exit 1"
      },
      "author": "Rhz", //开发者
      "license": "ISC" //授权协议
    }
```

2、快速安装和依赖第三方模块。例：instal vue-router等

```JavaScript
1、安装第三方模块
    npm install xxx   或者   npm i xxx模块名
2、安装模块放在
    node_modules 文件夹中
3、安装的模块如何使用        - require
4、运行：            node xxx.js     运行过程中可以省略 ,js
5、模块和package.js 的关系：
    通过 npm i xxx 模块会记录在 package.json 文件中。
  记录作用：复用。 通过 npm i 可以直接把 package.json 所有依赖的模块全部自动下载下来
6、配置 cnpm
    npm install cnpm -g --registry=https://registry.npmmirror.com
7、下载指定版本
    npm install    xxx@版本号        (具体版本号查看官方网址)
```

3、卸载 npm uninstall xxx

## npm和node-sass版本

![](assets/2023-03-06-15-45-10-image.png)

# Babel

Babel 是一个工具链，主要用于将采用 ECMAScript 2015+ 语法编写的代码转换为向后兼容的 JavaScript 语法，以便能够运行在当前和旧版本的浏览器或其他环境中

# 模块化

## Common JS 模块化

CommonJS模块化开发，必须导出来才能使用。Exports导出，require导入

## ES6 模块化

# Webpack

静态模块打包工具 (模块打包器)

1、创建一个 nodejs 项目

2、创建一个 src 目录

3、在 src 存放两个需要合并的 js文件

4、准备一个入口文件 main.js

JS打包：

5、在根目录下定义个 webpack.config.js文件，配置打包规则

6、执行 webpack 查看效果

```JavaScript
// 导入 path 模块   nodejs内置模块
const path = require("path")
// 定义 JS 打包的规则
module.exports = {
    // 入口函数从哪里开始编译打包
    entry: "./src/main.js",
    // 编译成功后，内存输出到哪
    output: {
        // 定义输出到指定的目录 _dirname当前目录、生成一个 dist 文件夹
        path: path.resolve(__dirname, './dist'),
        // 合并的js文件存储名称、位置
        filename: 'bundle.js'
    },
    module: {
        rules: [{
            // test: /\.'css$/, //打包项目中以 .css 结尾的文件
            // uss: ["style-l'oader", "css-loader"]
            test: /\.css$/i,
            use: ["style-loader", "css-loader"],
        }]
    },
    mode: 'development'
}
```

# Git

![](assets/2023-03-19-22-33-37-image.png)

`git branch 新建分支名称`：新建分支

`git branch -r`：查看远程分支
