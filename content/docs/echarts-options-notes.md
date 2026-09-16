---
title: ECharts 配置项速查
description: 整理 ECharts 常用 option 配置：数据格式、坐标轴、图例与交互项的实际用法。
date: 2024-08-09
category: visualization
tags: [echarts, javascript, cheatsheet]
---

# Echarts

`echarts`配置项属性

## Option

- `title`： 标题组件，包含主标题、副标题

- `grid`：直角坐标系内绘图网格，单个 grid内最多放置上下两个 x轴，左右两个 y轴。可以在网格上绘制：折线图、柱状图、散点图…… 属性：`top、right、bottom、left`：grid 组件

- `legend`：图例组件。展现了不同系列的标记(symbol)，颜色和名字。可以通过点击图例控制哪些系列不显示。

  - 属性：`type`，图例的类型，可选值。`plain`：普通图例；`scroll`：可翻页图例，图例数量较多是出现翻页。 `icon`：ECharts 提供的标记类型包括

    `'circle'`, `'rect'`, `'roundRect'`, `'triangle'`, `'diamond'`, `'pin'`, `'arrow'`, `'none'`

- `tooltip`：提示框组件。可以设置在多种地方，全局设置：`tooltip`；坐标系设置：`grid.tooltip`、`polar.tooltip`、`single.tooltip`；系列设置：`series.tooltip`；设置在系列的每个数据项：`series.data.tooltip`

- `xAxis`: 直角坐标系 gird 中的 x轴，一般情况下单个 grid 组件最多只能放上下两个 x 轴，多于两个 x 轴需要通过配置 `offset`属性防止同个位置多个 x 轴的重叠。

- `yAxis`：直角坐标系 grid 中的 y轴。与x轴类似

### data

`data`：数据内容数组。

通常来说，数据用一个二维数组表示。如下，每一列被称为一个『维度』。

```js
series: [{
    data: [
        // 维度X   维度Y   其他维度 ...
        [  3.4,    4.5,   15,   43],
        [  4.2,    2.3,   20,   91],
        [  10.8,   9.5,   30,   18],
        [  7.2,    8.8,   18,   57]
    ]
}]
```

- 在 [直角坐标系 (grid)](https://echarts.apache.org/zh/option.html#grid) 中『维度X』和『维度Y』会默认对应于 [xAxis](https://echarts.apache.org/zh/option.html#xAxis) 和 [yAxis](https://echarts.apache.org/zh/option.html#yAxis)。
- 在 [极坐标系 (polar)](https://echarts.apache.org/zh/option.html#polar) 中『维度X』和『维度Y』会默认对应于 [radiusAxis](https://echarts.apache.org/zh/option.html#radiusAxis) 和 [angleAxis](https://echarts.apache.org/zh/option.html#angleAxis)。

当只有一个轴为类目轴(`axis.type`为`category`)的时候，数据可以简化为一个一维数组：

```js
xAxis: {
    data: ['a', 'b', 'm', 'n']
},
series: [{
    // 与 xAxis.data 一一对应。
    data: [23,  44,  55,  19]
    // 它其实是下面这种形式的简化：
    // data: [[0, 23], [1, 44], [2, 55], [3, 19]]
}]
```
