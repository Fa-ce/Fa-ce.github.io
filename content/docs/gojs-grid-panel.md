---
title: GoJS 网格面板用法
description: Diagram.grid 默认网格与网格捕捉、单元格尺寸定制，用 LineH/LineV/BarH/BarV 自定义网格样式，以及把 Grid 面板当作节点元素使用。
date: 2024-07-01
category: visualization
tags: [gojs, javascript, notes]
source: https://gojs.net/latest/learn/grids
---

# GoJS 网格面板

网格由 `Panel.Grid` 类型的面板实现。和其他面板一样，网格面板可以放在 Node 或任何 Part 里；但当它被用作 `Diagram.grid` 时，范围实际上是无限的。

与其他面板不同，网格面板的元素必须是 `Shape`，且只用来控制网格线或网格条怎么画。

## 默认网格

要在图的背景显示网格，把 `Diagram.grid` 设为可见即可：

```js
diagram.grid.visible = true;
diagram.nodeTemplate =
  $(go.Node, "Auto",
    $(go.Shape, "Rectangle", { fill: "lightgray" }),
    $(go.TextBlock, { margin: 5 },
      new go.Binding("text", "key"))
  );
var nodeDataArray = [
  { key: "Alpha" }, { key: "Beta" }, { key: "Gamma" }
];
diagram.model = new go.GraphLinksModel(nodeDataArray);
```

![](/images/d-note-ren/gojs-grid-01-default.png)

## 网格捕捉

把 `DraggingTool.isGridSnapEnabled` 和/或 `ResizingTool.isGridSnapEnabled` 设为 `true`，拖动与调整大小就会按背景网格对齐。

`DraggingTool.isGridSnapEnabled` 不影响未连接的链接；如果在链接模板上自定义了 `Part.dragComputation`，可以自行处理。

```js
diagram.grid.visible = true;
diagram.toolManager.draggingTool.isGridSnapEnabled = true;
diagram.toolManager.resizingTool.isGridSnapEnabled = true;
diagram.nodeTemplate =
  $(go.Node, "Auto",
    { resizable: true },
    $(go.Shape, "Rectangle", { fill: "lightgray" }),
    $(go.TextBlock, { margin: 5 },
      new go.Binding("text", "key"))
  );
var nodeDataArray = [
  { key: "Alpha" }, { key: "Beta" }, { key: "Gamma" }
];
diagram.model = new go.GraphLinksModel(nodeDataArray);
```

## 简单的网格定制

通过 `Panel.gridCellSize` 修改网格单元格大小：

```js
diagram.grid.visible = true;
diagram.grid.gridCellSize = new go.Size(30, 20);
diagram.toolManager.draggingTool.isGridSnapEnabled = true;
diagram.toolManager.resizingTool.isGridSnapEnabled = true;
diagram.nodeTemplate =
  $(go.Node, "Auto",
    { resizable: true },
    $(go.Shape, "Rectangle", { fill: "lightgray" }),
    $(go.TextBlock, { margin: 5 },
      new go.Binding("text", "key"))
  );
var nodeDataArray = [
  { key: "Alpha" }, { key: "Beta" }, { key: "Gamma" }
];
diagram.model = new go.GraphLinksModel(nodeDataArray);
```

拖动时用于捕捉的单元格大小不必与背景网格一致：`DraggingTool.gridSnapCellSize` 优先于 `Panel.gridCellSize`。若设置了 `DraggingTool.gridSnapCellSize` 而未设置 `ResizingTool.cellSize`，调整大小时也会沿用前者。

```js
diagram.grid.visible = true;
diagram.toolManager.draggingTool.isGridSnapEnabled = true;
diagram.toolManager.resizingTool.isGridSnapEnabled = true;
// 每隔一个点捕捉（默认背景网格是 10×10）
diagram.toolManager.draggingTool.gridSnapCellSize = new go.Size(20, 20);
diagram.nodeTemplate =
  $(go.Node, "Auto",
    { resizable: true },
    $(go.Shape, "Rectangle", { fill: "lightgray" }),
    $(go.TextBlock, { margin: 5 },
      new go.Binding("text", "key"))
  );
var nodeDataArray = [
  { key: "Alpha" }, { key: "Beta" }, { key: "Gamma" }
];
diagram.model = new go.GraphLinksModel(nodeDataArray);
```

## 自定义网格

`Panel.type` 为 `Panel.Grid` 时，网格图案由 Panel 类绘制。网格面板的元素必须是 `Shape`，且 `Shape.figure` 只能取四种：`LineH`、`LineV`、`BarH`、`BarV`。两种 Line 画的是分隔单元格的描边线，两种 Bar 画的是填充单元格的矩形。

蓝色水平线加绿色垂直线的简单网格：

```js
diagram.grid =
  $(go.Panel, go.Panel.Grid,  // or "Grid"
    { gridCellSize: new go.Size(25, 25) },
    $(go.Shape, "LineH", { stroke: "blue" }),
    $(go.Shape, "LineV", { stroke: "green" })
  );
```

![](/images/d-note-ren/gojs-grid-02-lines.png)

`Shape.interval` 决定这条线每隔多少个单元格画一次，取正整数。例如每五格画一条深色线：

```js
diagram.grid =
  $(go.Panel, "Grid",
    { gridCellSize: new go.Size(10, 10) },
    $(go.Shape, "LineH", { stroke: "lightblue" }),
    $(go.Shape, "LineV", { stroke: "lightgreen" }),
    $(go.Shape, "LineH", { stroke: "blue", interval: 5 }),
    $(go.Shape, "LineV", { stroke: "green", interval: 5 })
  );
diagram.nodeTemplate =
  $(go.Node, "Auto",
    { resizable: true },
    $(go.Shape, "Rectangle", { fill: "lightgray" }),
    $(go.TextBlock, { margin: 5 },
      new go.Binding("text", "key"))
  );
var nodeDataArray = [
  { key: "Alpha" }
];
diagram.model = new go.GraphLinksModel(nodeDataArray);
```

![](/images/d-note-ren/gojs-grid-03-interval.png)

形状按在面板中出现的顺序绘制，所以深蓝水平线压在浅绿垂直线之上，深绿垂直线又压在深蓝水平线之上。

预定义的 `Diagram.grid` 就是这样定义的：

```js
diagram.grid =
  $(go.Panel, "Grid",
    {
      name: "GRID",
      visible: false,
      gridCellSize: new go.Size(10, 10),
      gridOrigin: new go.Point(0, 0)
    },
    $(go.Shape, "LineH", { stroke: "lightgray", strokeWidth: 0.5, interval: 1 }),
    $(go.Shape, "LineH", { stroke: "gray", strokeWidth: 0.5, interval: 5 }),
    $(go.Shape, "LineH", { stroke: "gray", strokeWidth: 1.0, interval: 10 }),
    $(go.Shape, "LineV", { stroke: "lightgray", strokeWidth: 0.5, interval: 1 }),
    $(go.Shape, "LineV", { stroke: "gray", strokeWidth: 0.5, interval: 5 }),
    $(go.Shape, "LineV", { stroke: "gray", strokeWidth: 1.0, interval: 10 })
  );
diagram.grid.visible = true;  // so that this example shows the standard grid
diagram.div.style.background = "white";
```

用 `BarH` 可以得到横向条纹。注意用的是 `Shape.fill` 而不是 `Shape.stroke`，并显式设置 `GraphObject.height`：

```js
diagram.grid =
  $(go.Panel, "Grid",
    { gridCellSize: new go.Size(50, 50) },
    $(go.Shape, "BarH", { fill: "lightgreen", interval: 2, height: 50 })
  );
diagram.nodeTemplate =
  $(go.Node, "Auto",
    {
      dragComputation: function(node, pt, gridpt) {
        pt.y = Math.round(pt.y / 100) * 100;
        return pt;
      }
    },
    $(go.Shape, "Rectangle", { fill: "lightgray" }),
    $(go.TextBlock, { margin: 5 },
      new go.Binding("text", "key"))
  );
var nodeDataArray = [
  { key: "Alpha" }
];
diagram.model = new go.GraphLinksModel(nodeDataArray);
```

![](/images/d-note-ren/gojs-grid-04-barh.png)

这个例子同时演示了用 `Part.dragComputation` 限制节点可拖到的位置：`Part.location.y` 被限制为 100 的倍数，正好对应绿色条填充的那些行。

同时使用半透明的垂直条和水平条，可以得到桌布效果：

```js
diagram.grid =
  $(go.Panel, "Grid",
    { gridCellSize: new go.Size(100, 100) },
    $(go.Shape, "BarV", { fill: "rgba(255,0,0,0.1)", width: 50 }),
    $(go.Shape, "BarH", { fill: "rgba(255,0,0,0.1)", height: 50 })
  );
diagram.toolManager.draggingTool.isGridSnapEnabled = true;
diagram.nodeTemplate =
  $(go.Node, "Auto",
    { width: 50, height: 50 },
    $(go.Shape, "Rectangle", { fill: "lightgray" }),
    $(go.TextBlock, { margin: 5 },
      new go.Binding("text", "key"))
  );
var nodeDataArray = [
  { key: "Alpha" }
];
diagram.model = new go.GraphLinksModel(nodeDataArray);
```

![](/images/d-note-ren/gojs-grid-05-tablecloth.png)

这里通过 `DraggingTool.isGridSnapEnabled = true` 限制了所有节点的拖动位置。

## 在节点中使用 Grid 面板

把 Grid 面板当作 Node 里的普通数据绑定元素：

```js
diagram.nodeTemplate =
  $(go.Node, "Auto",
    { resizable: true, resizeObjectName: "GRID" },
    $(go.Shape, "Rectangle", { fill: "transparent" }),
    $(go.Panel, "Grid",
      { name: "GRID", desiredSize: new go.Size(100, 100), gridCellSize: new go.Size(20, 20) },
      new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
      new go.Binding("gridCellSize", "cell", go.Size.parse).makeTwoWay(go.Size.stringify),
      $(go.Shape, "LineV",
        new go.Binding("stroke")),
      $(go.Shape, "LineH",
        new go.Binding("stroke"))
    ));
diagram.model = new go.GraphLinksModel([
  { key: "Alpha", cell: "25 25", stroke: "lightgreen" },
  { key: "Beta", size: "150 75", cell: "15 30" }
]);
```

![](/images/d-note-ren/gojs-grid-06-node-panel.png)

## 其他注意事项

- 如果需要让网格面板可被选中，`background` 应为非空。
- 不能设置或绑定网格面板的 `Panel.itemArray`。
- 网格面板中形状上的事件会被忽略，形状也不能缩放或旋转。
