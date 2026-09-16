---
title: 前端面试知识体系大纲
description: 归档内容，前端面试知识点清单草稿，不对外展示。
date: 2024-10-18
category: interview
tags: [cheatsheet, notes]
draft: true
---

# 面试题笔记

## 1.HTML5

- 语义化标签类
- 音视频处理
- canvas / webGL
- historyAPI
- requestAnimationFrame
- 地理位置
- web scoket
- ......

## 2.CSS3

- 常规
- 动画
- 盒子模型
- 响应式布局
- .....

## 3.Javascript

- ECMAScript 3/5/6/7/8/9
- DOM
- BOM
- 设计模式
- 底层原理
  - 堆栈内存
  - 闭包作用域AO/VO/GO/EC/ECSTACK
  - 面向对象OOP
  - THIS
  - EventLoop
  - 浏览器渲染原理
  - 回流重绘

## 4.网络通信层

- AJAX / Fetch / axios
- HTTP1.0/2.0
- TCP
- 跨域处理方案
- 性能优化

### 5.Hybrid或者APP或者小程序

- hybird
- uni-app
- RN
- Flutter
- 小程序 MPVUE
- Weex
- PWA

### 6.工程化方面

- webpack
- git
- linux/nginx

### 7.全栈方面

- node
- express
- koa2
- mongodb
- nuxt.js/next.js

### 8.框架方面

- Vue

  - 基础知识
  - 核心原理
  - vue-router
  - vue-cli
  - vuex
  - element ui
  - vant
  - cube
  - SSR
  - 优化

- React

  - 基础知识
  - 核心原理
  - react-router-dom
  - redux
  - react-redux
  - dva
  - umi
  - mobix
  - antd
  - antd pro
  - SSR
  - 优化

- 什么是标签语义化？： 合理的标签，干合适的事

- 都有哪些标签，都是啥意思？：块级标签，行内标签，行内块标签，

  - 块级标签 ：div p h1-h6 ul ol li dl dd dt header footer nav ariticle section aside audio video table form hr
  - 行内标签：a i span input select textarea lable
  - 行内块标签：img input 内联框架 iframe

- 块级标签和行内标签的区别?：

  - 块级标签：①宽度100%，高度自适应(内容撑开)，②独立成行，③可以设置margin，padding，border，④可以设置宽高
  - 行内标签：①宽度高度自适应(内容撑开)，默认水平排列，②可以设置水平方向margin padding，③不可以设置宽高
  - 行内块标签：结合行内和块级标签的特点，不仅可以对宽高属性值生效，还可以多个标签存在一行显示

- 三类标签如何转化？：

  - 块级标签转行内标签：display:inline
  - 行内标签转块级标签：display:block
  - 转行内块标签：display:inline-block

- display的值有哪些？:flex ,table ,none,等等

- display:none

  - 让元素隐藏，可以怎样做？
    - display:none真正意义的隐藏，页面源码都不显示隐藏的页面源码，隐藏元素不占任何空间，但是可以通过Dom操作访问到
    - opacity:0 opacity属性是设置元素的透明度，会影响页面布局，但只是不可见，会影响页面的交互操作
    - visibility:hidden 也只是显示不可见, 元素位置处显示一块空白，影响布局，但是不影响交互
    - position:absoute,为了不影响页面布局又想交互，position属性将元素移出原来的页面显示，并可以与之交互
    - 总结：opacity和visibility会影响布局,display不影响布局但是无法直接交互
  - display:none和visibility:hidden的区别？
    - display:none真正意义的隐藏，页面源码都不显示隐藏的页面源码，隐藏元素不占任何空间，但是可以通过Dom操作访问到
    - visibility:hidden 也只是显示不可见, 元素位置处显示一块空白，影响布局，但是不影响交互
  - opacity的兼容处理
    - 在IE下, filter:alpha(opacity:30)
    - 老版的其他浏览器-moz-opacity:0.5;(老版火狐) -khtml-opacity:0.5;(老版的Safari)
  - filter(滤镜)还能做哪些？
    - 灰度设置
    - 反色
    - 饱和度设置
    - 透明度设置
    - 模糊，阴影

- 多种方法使用css让一个div消失在视野中？ 1.opacity:0, 2.height:0, 3.设置z-index的值, 4.display:none, 5.visibility:hidden;

- display:flex

  - 项目中什么时候用到flex？

    - 常用的有flex：1 1 auto(用来补全剩余空间),flex有三个参数，第一个是项目放大比例默认是0，第二个是缩小比例，默认是1，第三个是项目占据主轴空间
    - 用来进行等比分配空间
    - flex:0 0 auto 用来保持元素本身的大小，不扩大也不缩小

  - 除了这种方式能居中还有哪些？

    - text-align:center方式(这种方式可以水平居中块级元素中的行内元素，如inline，inline-bolck)，如果用来居中块级元素中的块级元素，如div中的div，一旦内层的div有自己的宽度，这种方法就会失效，只能让div中的文字等内容居中，而div仍然左对齐
    - margin:0 auto 这种对齐方式要求内部元素，(.content_text)是块级元素，并且不能脱离文档流，否则无效
    - 脱离标准文档流，这种通常应用在自定义弹框当中，把背景层设置成透明灰色，内容居中显示在最前面
    - display:table-cell 配合width，text-align:center, vertical-align:middle,(这个方式是对单元格td来说的，让大小不固定元素垂直居中，float，absolute,等属性都会影响它的实现)
    - 垂直居中：行内元素的垂直居中把height和line-height的值设置成一样即可
    - css3的translate水平垂直居中元素,这种方式将脱离文档流元素，设置top：50%，left:50%,然后使用transform来向左上偏移半个内元素的宽和高
    - 使用css3计算的方式居中元素calc，这种方式同样将脱离文档流的元素，然后使用计算的方式来设置top和left

  - 响应式布局还可以怎样做？

    - Bootstrap

  - 都有哪些盒子模型？盒子模型分为两种，

    - 第一种是W3C标准的盒模型(标准盒模型)：width，height指的是内容区域content的宽度,高度
    - 第二种是IE标准的盒子模型(怪异盒模型):width指的是内容，边框，内边距总的宽度(content+border+padding),height指的是内容，边框，内边距总的高度

### 前端经典面试题：

- 掌握盒子水平垂直居中的五大方案:
  - 定位:三种,margin:auto , transform:translate
  - dsiplay:flex
  - JavaScript
  - display:table-cell

# 面试题

## Vue

1. `Vue3`使用`Proxy`：Vue2通过给每个对象设置`getter 和 setter`属性修改对象，实现数据检测，`Proxy`只代理最外层对象，性能更好，添加数组索引修改监听，对象的属性增加和删除；可以提高初始化启动速度，优化数据响应式系统，将全部监听改为惰性监听
2. 数组中`key`的作用：diff算法进行新旧虚拟DOM对比，然后异步渲染到页面，当出现大量相同标签时，首先判断key 和标签名是否一直，使用key可以提升diff算法的判断速度，加快页面渲染
3. `v-show`：设置元素的`display：none`样式；`v-if`：当条件为 true 时，才会进行编译渲染，切换一个较大的 v-if块时，性能消耗比较大
4. `computed`原理：`computed`是基于`watcher`对象的
