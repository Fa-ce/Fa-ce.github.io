---
title: JavaScript 模块化方案
description: 梳理 CommonJS、AMD、ES Module 等模块化方案的差异与使用方式。
date: 2024-11-03
category: fundamentals
tags: [javascript, module-system, es6, notes]
---

# 模块化

模块化进化史：

最早写代码，全局Global变量容易被污染，很容易命名冲突。

简单封装Namespace模式：减少Global上的变量数目；本质是对象，不安全。

匿名闭包，IIFE模式：函数是JavaScript唯一的Local Scope。

再增强一点，引入依赖：模块模式，现代模块实现的基石。

## 为什么要模块化

避免命名冲突(减少命名空间污染)

更好的分离，按需加载。

提高复用性。

高可维护性。

## ES6模块规范

依赖模块需要编译打包处理。

导出模块：export        引入模块：import

实现(浏览器端)： 

## ES6_Babel_Browserify使用

1、定义package.json文件

2、安装babel-cli，babel-preset-es2015和browserify

3、定义.babelrc文件

4、编码
