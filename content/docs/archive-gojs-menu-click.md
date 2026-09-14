---
title: GoJS 右键菜单定位探索
description: 归档内容，GoJS 选中与右键事件监听、自定义菜单坐标换算的探索代码，不对外展示。
date: 2024-10-18
category: visualization
tags: [gojs, notes]
draft: true
---

原始文件 `GoJS_Menu_Click.js`，桌面上的一段调试草稿，不是可运行模块（依赖外部已初始化的 `myDiagram`）。65 行里 62 行是注释掉的探索过程，实际生效的只有两个 `addDiagramListener` 中的 `console.log`。

保留价值在注释部分记录的思路：想在右键点击节点时弹出一个绝对定位的 HTML 菜单 `div`，需要把节点的**局部坐标**换算成**页面全局坐标**——用 `part.position` 乘以 `myDiagram.scale`，再加上 `myDiagram.div.getBoundingClientRect()` 的偏移。原注释里自己批注了「这只是一个非常简化的例子」「可能并不准确，特别是如果图表有复杂的平移或变换」，**未经验证，不要直接照抄**。

另外这里有个命名与实际不符的地方：监听的是 `ObjectContextClicked`（右键上下文点击）事件，但日志文案写的是「左键点击在」。

```javascript
myDiagram.addDiagramListener('ChangedSelection', function (e, i) {
	// console.log("重新选择了", e.diagram.lastInput.viewPoint);
	console.log('重新选择了', e);
});
// 监听MouseDown事件以区分左键和右键点击
myDiagram.addDiagramListener('ObjectContextClicked', function (e) {
	// var button = e.inputEvent.button;
	// e.inputEvent.preventDefault();
	//
	console.log('左键点击在:', e);
	console.log('左键点击在:', e.inputEvent);
	// if (button === 0) {
	// 	// 左键点击
	// 	console.log("左键点击在:", e.diagramPoint.toString());
	// } else if (button === 2) {
	// 	// 右键点击
	// 	console.log("右键点击在:", e.diagramPoint.toString());
	// 	// 这里可以添加你的右键菜单逻辑
	// }
	//
	myDiagram.selection.each(function (part) {
		// if (part instanceof go.Node) {
		// 	console.warn("被点击的节点-part",part)
		// 	var position = part.position; // 获取节点的局部坐标
		// 	if (!isNaN(position.x) && !isNaN(position.y)) {
		// 		console.log("节点局部坐标:", position.x, position.y);
		// 		// 这里可以添加代码来计算全局坐标，但通常这会更复杂
		// 		// 你需要知道图表的缩放级别（myDiagram.scale）、可能的平移（虽然这通常不影响节点局部坐标到全局坐标的转换），
		// 		// 以及图表元素在页面上的位置和尺寸（通过myDiagram.div.getBoundingClientRect()获取）
		// 		// 假设的全局坐标计算（需要根据你的具体需求进行调整）
		// 		// 注意：这只是一个非常简化的例子，并没有考虑所有可能的因素
		// 		var diagramRect = myDiagram.div.getBoundingClientRect();
		// 		var globalX = diagramRect.left + (position.x * myDiagram.scale); // 简化计算，未考虑平移
		// 		var globalY = diagramRect.top + (position.y * myDiagram.scale);
		// 		// 注意：上面的计算可能并不准确，特别是如果图表有复杂的平移或变换
		// 		console.log("假设的全局坐标:", globalX, globalY);
		// 	} else {
		// 		console.error("节点的position属性为NaN");
		// 	}
		// }
		// var position = part.position.copy(); // 复制节点的局部坐标
		// // 考虑图表的缩放（假设没有平移，因为节点的position是相对于图表的）
		// var scaledX = position.x * myDiagram.scale;
		// var scaledY = position.y * myDiagram.scale;
		// // 获取图表元素在页面上的位置和尺寸
		// var diagramRect = myDiagram.div.getBoundingClientRect();
		// // 计算全局坐标（注意：这里我们假设菜单应该显示在节点的正下方）
		// var menuX = diagramRect.left + scaledX; // 或者根据需要调整偏移量
		// var menuY = diagramRect.top + scaledY + part.actualBounds.height; // 确保菜单在节点下方
		// // 显示右键菜单（这里需要你自己实现菜单的HTML和显示逻辑）
		// // 例如，你可以创建一个div元素，设置其样式和位置，然后添加到DOM中
		// // 注意：这里只是一个示例，并没有实际的菜单HTML和样式
		// var menuDiv = document.createElement('div');
		// menuDiv.style.position = 'absolute';
		// menuDiv.style.left = menuX + 'px';
		// menuDiv.style.top = menuY + 'px';
		// menuDiv.innerHTML = '<ul><li>菜单项1</li><li>菜单项2</li></ul>';
		// document.body.appendChild(menuDiv);
		// 你可能还需要添加代码来处理菜单项的点击事件，并在适当的时候移除菜单div
		// 阻止默认的右键菜单
		// e.inputEvent.preventDefault();
	});
	// 阻止默认的右键菜单
	// e.inputEvent.preventDefault();
});
```
