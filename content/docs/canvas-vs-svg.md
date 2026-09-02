---
title: Canvas 与 SVG 绘图方案选型
description: 对比 Canvas 与 SVG 两种绘图方案的优缺点与适用场景，给出选型判断依据。
date: 2024-12-09
category: visualization
tags: [canvas, svg, performance, best-practice]
---

# 绘制

| 方案     | 优点                                                                                           | 缺点                                                                                       |
| ------ | -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| 纯 HTML | 简单，通过CSS即可绘制                                                                                 | 难以绘制复杂图形                                                                                 |
| Canvas | 1. 基于像素，内存占用恒定<br/>2. 一张图只存在一个 HTML 元素<br/>3. 大规模数据下，性能表现比svg 好                              | 1. 事件交互基于整张画布，根据坐标计算出节点，编程方式繁琐<br/>2. 不支持插入 HTML 元素，不支持 CSS 修改样式<br/>3. 因为基于像素，大屏幕下渲染时间长 |
| Svg    | 1. 基于矢量，缩放不会失真<br/>2. 基于 DOM，学习、编程成本低，事件交互都是基于 DOM，并且支持 CSS，使用方便<br/>3. 适合静态图像，基于 Svg 也可以做转换 | 因为基于 DOM，当图的元素数量较多的时候，渲染性能比较低                                                            |

 流程图场景下，不需要渲染大量的节点，对动画的要求也不高，可以使用`Svg + HTML` 实现。

## Canvas

`Canvas` 适合绘制**图形密集且需要频繁更新**的场景。

`Canvas`是`HTML5`提供的绘图 api，允许在网页上进行即时的图形绘制。通常用于游戏开发、可视化、图像处理等场景。

- 绘制一个`canvas `图片

```html
<body>
    <h1>绘制canvas</h1>
    <canvas id="canvas" width="200" height="200"></canvas>
    <button id="btn">绘制</button>
    <canvas id="canvas2" width="200" height="200"></canvas>
    <script>
        const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "dodgerblue";
        ctx.fillRect(10, 10, 180, 180);
        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.fillText("Fa-ce", 10, 30);        
        ctx.strokeStyle = "deeppink";

        const btn = document.getElementById("btn");
        btn.addEventListener("click", () => {
            const canvas2 = document.getElementById("canvas2");
            const ctx2 = canvas2.getContext("2d");
            ctx2.beginPath();
            ctx2.moveTo(75, 50);
            ctx2.lineTo(100, 75);
            ctx2.lineTo(100, 25);
            ctx2.fill();
        });
    </script>
</body>
```

## Svg

`SVG` 适合**静态图形**和需要**高精度**的场景。

`Svg`是一种基于`XML`的矢量图格式(Scalable Vector Graphics)。在网页中通常通过嵌入`XML`或者使用`js、css`进行样式、动态操作。适用于矢量图标、地图、数据可视化场景。

- 绘制`Svg`图片

```html
<head>
    <style>
        svg {
            border: 1px solid #000;
        }
    </style>
    <script>
        function svgClick(msg) {
            debugger;
            // alert(msg);
            // 点击事件
        }
    </script>
</head>    
<body>
    <h1>绘制SVG</h1>
    <svg width="200" height="200" style="border: 1px solid #000">
        <rect
            width="100"
            height="100"
            style="fill: rgb(0, 0, 255); stroke-width: 10; stroke: rgb(0, 0, 0)"
            onclick="svgClick('First Svg')"
        />
    </svg>
    <svg width="200" height="200" style="border: 1px solid #000">
        <circle
            cx="100"
            cy="100"
            r="50"
            fill="red"
            onclick="svgClick('Second Svg')"
        />
    </svg>
</body>
```

## CSS

`CSS`可以绘制简单的几何图形，如矩形、圆形、多边形。在**样式控制、动画**方面有独特的优势

```html
<style>
    .circle {
        width: 100px;
        height: 100px;
        background-color: red;
        border-radius: 50%;
    }
    .rect {
        width: 100px;
        height: 100px;
        background-color: blue;
    }
    .ellipse {
        width: 100px;
        height: 50px;
        background-color: green;
        border-radius: 50%;
    }
    .triangle {
        width: 0;
        height: 0;
        border-left: 50px solid transparent;
        border-right: 50px solid transparent;
        border-bottom: 100px solid red;
    }
    .polygon {
        width: 100px;
        height: 100px;
        background-color: yellow;
        clip-path: polygon(0% 0%, 50% 0%, 50% 80%, 80% 100%, 0% 100%);
    }
</style>

<body>
    <h1>CSS</h1>
    <!-- 圆形 -->
    <div class="circle"></div>
    <!-- 矩形 -->
    <div class="rect"></div>
    <!-- 椭圆 -->
    <div class="ellipse"></div>
    <!-- 三角形 -->
    <div class="triangle"></div>
    <!-- 多边形 -->
    <div class="polygon"></div>
</body>
```

# 框架

## GoJS

- 不开源

- 模型分离，双向绑定。`Model`描述数据模型，`Diagram`描述 UI 。
  
  数据/视图的更新引入了事务性机制，可以原子化提交，按事务回滚/撤销。

- 可以局部更新数据
