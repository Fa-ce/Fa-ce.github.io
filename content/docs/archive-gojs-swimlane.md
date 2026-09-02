---
title: GoJS 泳道图实现
description: 归档内容，GoJS 泳道图项目源码存档，不对外展示。
date: 2024-10-18
category: visualization
tags: [gojs, notes]
draft: true
---

原始文件 `node-GoJS-save-copy.html` 实为 Vue 单文件组件的 `<script>` 块，被误存为 `.html`。内含 GoJS 泳道图（Pool/Lane）完整实现：`relayoutLanes`、`computeMinPoolSize`、自定义 `LaneResizingTool` 与 `PoolLayout`、跨泳道连线维护 `updateCrossLaneLinks`。依赖 webpack 构建上下文，脱离原项目无法直接运行，仅作代码存档。

```html
<script>
	var vm;
	// These parameters need to be set before defining the templates.
	var MINLENGTH = 200; // this controls the minimum length of any swimlane
	var MINBREADTH = 20; // this controls the minimum breadth of any non-collapsed swimlane
	// some shared functions
	// this may be called to force the lanes to be laid out again
	function relayoutLanes() {
		vm.myDiagram.nodes.each(function (lane) {
			if (!(lane instanceof go.Group)) return;
			if (lane.category === 'Pool') return;
			lane.layout.isValidLayout = false; // force it to be invalid
		});
		vm.myDiagram.layoutDiagram();
	}
	// this is called after nodes have been moved or lanes resized, to layout all of the Pool Groups again
	function relayoutDiagram() {
		vm.myDiagram.layout.invalidateLayout();
		vm.myDiagram.findTopLevelGroups().each(function (g) {
			if (g.category === 'Pool') g.layout.invalidateLayout();
		});
		vm.myDiagram.layoutDiagram();
	}
	// compute the minimum size of a Pool Group needed to hold all of the Lane Groups
	function computeMinPoolSize(pool) {
		// assert(pool instanceof go.Group && pool.category === "Pool");
		var len = MINLENGTH;
		pool.memberParts.each(function (lane) {
			// pools ought to only contain lanes, not plain Nodes
			if (!(lane instanceof go.Group)) return;
			var holder = lane.placeholder;
			if (holder !== null) {
				var sz = holder.actualBounds;
				len = Math.max(len, sz.height);
			}
		});
		return new go.Size(NaN, len);
	}
	// compute the minimum size for a particular Lane Group
	function computeLaneSize(lane) {
		// assert(lane instanceof go.Group && lane.category !== "Pool");
		var sz = computeMinLaneSize(lane);
		if (lane.isSubGraphExpanded) {
			var holder = lane.placeholder;
			if (holder !== null) {
				var hsz = holder.actualBounds;
				sz.width = Math.max(sz.width, hsz.width);
			}
		}
		// minimum breadth needs to be big enough to hold the header
		var hdr = lane.findObject('HEADER');
		if (hdr !== null) sz.width = Math.max(sz.width, hdr.actualBounds.width);
		return sz;
	}
	// determine the minimum size of a Lane Group, even if collapsed
	function computeMinLaneSize(lane) {
		if (!lane.isSubGraphExpanded) return new go.Size(1, MINLENGTH);
		return new go.Size(MINBREADTH, MINLENGTH);
	}
	// define a custom ResizingTool to limit how far one can shrink a lane Group
	function LaneResizingTool() {
		go.ResizingTool.call(this);
	}
	go.Diagram.inherit(LaneResizingTool, go.ResizingTool);
	LaneResizingTool.prototype.isLengthening = function () {
		return this.handle.alignment === go.Spot.Bottom;
	};
	LaneResizingTool.prototype.computeMinPoolSize = function () {
		var lane = this.adornedObject.part;
		// assert(lane instanceof go.Group && lane.category !== "Pool");
		var msz = computeMinLaneSize(lane); // get the absolute minimum size
		if (this.isLengthening()) {
			// compute the minimum length of all lanes
			var sz = computeMinPoolSize(lane.containingGroup);
			msz.height = Math.max(msz.height, sz.height);
		} else {
			// find the minimum size of this single lane
			var sz = computeLaneSize(lane);
			msz.width = Math.max(msz.width, sz.width);
			msz.height = Math.max(msz.height, sz.height);
		}
		return msz;
	};
	LaneResizingTool.prototype.resize = function (newr) {
		var lane = this.adornedObject.part;
		if (this.isLengthening()) {
			// changing the length of all of the lanes
			lane.containingGroup.memberParts.each(function (lane) {
				if (!(lane instanceof go.Group)) return;
				var shape = lane.resizeObject;
				if (shape !== null) {
					// set its desiredSize length, but leave each breadth alone
					shape.height = newr.height;
				}
			});
		} else {
			// changing the breadth of a single lane
			go.ResizingTool.prototype.resize.call(this, newr);
		}
		relayoutDiagram(); // now that the lane has changed size, layout the pool again
	};
	// end LaneResizingTool class
	// define a custom grid layout that makes sure the length of each lane is the same
	// and that each lane is broad enough to hold its subgraph
	function PoolLayout() {
		go.GridLayout.call(this);
		this.cellSize = new go.Size(1, 1);
		this.wrappingColumn = Infinity;
		this.wrappingWidth = Infinity;
		this.isRealtime = false; // don't continuously layout while dragging
		this.alignment = go.GridLayout.Position;
		// This sorts based on the location of each Group.
		// This is useful when Groups can be moved up and down in order to change their order.
		this.comparer = function (a, b) {
			var ax = a.location.x;
			var bx = b.location.x;
			if (isNaN(ax) || isNaN(bx)) return 0;
			if (ax < bx) return -1;
			if (ax > bx) return 1;
			return 0;
		};
	}
	go.Diagram.inherit(PoolLayout, go.GridLayout);
	PoolLayout.prototype.doLayout = function (coll) {
		var diagram = this.diagram;
		if (diagram === null) return;
		diagram.startTransaction('PoolLayout');
		var pool = this.group;
		if (pool !== null && pool.category === 'Pool') {
			// make sure all of the Group Shapes are big enough
			var minsize = computeMinPoolSize(pool);
			pool.memberParts.each(function (lane) {
				if (!(lane instanceof go.Group)) return;
				if (lane.category !== 'Pool') {
					var shape = lane.resizeObject;
					if (shape !== null) {
						// change the desiredSize to be big enough in both directions
						var sz = computeLaneSize(lane);
						shape.width = !isNaN(shape.width) ? Math.max(shape.width, sz.width) : sz.width;
						shape.height = isNaN(shape.height) ? minsize.height : Math.max(shape.height, minsize.height);
						var cell = lane.resizeCellSize;
						if (!isNaN(shape.width) && !isNaN(cell.width) && cell.width > 0) shape.width = Math.ceil(shape.width / cell.width) * cell.width;
						if (!isNaN(shape.height) && !isNaN(cell.height) && cell.height > 0) shape.height = Math.ceil(shape.height / cell.height) * cell.height;
					}
				}
			});
		}
		// now do all of the usual stuff, according to whatever properties have been set on this GridLayout
		go.GridLayout.prototype.doLayout.call(this, coll);
		diagram.commitTransaction('PoolLayout');
	};
	// end PoolLayout class

	export default {
		props: {
			ids: {
				type: String,
				required: true,
			},
			titles: {
				type: String,
				required: true,
			},
			connectLineData: Object,
		},
		components: {
			draggable,
		},
		methods: {
			// 渲染gojs
			initgojs() {
				let that = this;
				if (window.goSamples) goSamples(); // init for these samples -- you don't need to call this
				var GO = go.GraphObject.make;
				this.myDiagram = GO(go.Diagram, that.ids, {
					resizingTool: new LaneResizingTool(),
					layout: GO(PoolLayout),
					// layout: GO(
					//   go.TreeLayout, // the layout for the entire diagram
					//   {
					//     angle: 90,
					//     arrangement: go.TreeLayout.ArrangementHorizontal,
					//     isRealtime: false,
					//   }
					// ),
					mouseDragOver: function (e) {
						if (
							!e.diagram.selection.all(function (n) {
								return n instanceof go.Group;
							})
						) {
							e.diagram.currentCursor = 'not-allowed';
						}
					},
					mouseDrop: function (e) {
						if (
							!e.diagram.selection.all(function (n) {
								return n instanceof go.Group;
							})
						) {
							e.diagram.currentTool.doCancel();
						}
					},
					'commandHandler.copiesGroupKey': true,
					'animationManager.isEnabled': false,
					'linkingTool.isEnabled': false,
					// enable undo & redo
					'undoManager.isEnabled': true,
					SelectionMoved: relayoutDiagram, // this DiagramEvent listener is
					SelectionCopied: relayoutDiagram, // defined above
					draggingTool: new GuidedDraggingTool(), // 使用拓展辅助线
					'draggingTool.horizontalGuidelineColor': 'blue',
					'draggingTool.verticalGuidelineColor': 'blue',
					'draggingTool.centerGuidelineColor': 'green',
					'draggingTool.guidelineWidth': 2,
				});
				this.myOverview = GO(go.Overview, 'myInspector', {
					observed: this.myDiagram,
				});
				function stayInGroup(part, pt, gridpt) {
					// don't constrain top-level nodes
					var grp = part.containingGroup;
					if (grp === null) return pt;
					// try to stay within the background Shape of the Group
					var back = grp.resizeObject;
					if (back === null) return pt;
					// allow dragging a Node out of a Group if the Shift key is down
					if (part.diagram.lastInput.shift) return pt;
					var p1 = back.getDocumentPoint(go.Spot.TopLeft);
					var p2 = back.getDocumentPoint(go.Spot.BottomRight);
					var b = part.actualBounds;
					var loc = part.location;
					// find the padding inside the group's placeholder that is around the member parts
					var m = grp.placeholder.padding;
					// now limit the location appropriately
					var x = Math.max(p1.x + m.left, Math.min(pt.x, p2.x - m.right - b.width - 1)) + (loc.x - b.x);
					var y = Math.max(p1.y + m.top, Math.min(pt.y, p2.y - m.bottom - b.height - 1)) + (loc.y - b.y);
					return new go.Point(x, y);
				}
				const setFontStyle = function (val) {
					if (typeof val === 'string') return val;
					let font = val.fontFamily || 'Segoe UI,sans-serif';
					if (val.fontSize) font = val.fontSize + 'pt ' + font;
					if (val.bold) font = val.bold + ' ' + font;
					if (val.italic) font = val.italic + ' ' + font;
					return font;
				};
				that.myDiagram.nodeTemplate = GO(
					go.Node,
					'Auto',
					new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
					GO(
						go.Shape,
						'Rectangle',
						{
							fill: 'white',
							portId: '',
							cursor: 'pointer',
							fromLinkable: true,
							toLinkable: true,
							stroke: 'blue',
						},
						new go.Binding('figure', 'fig'),
						new go.Binding('stroke', 'color2')
					),
					{ dragComputation: stayInGroup } // limit dragging of Nodes to stay within the containing Group, defined above
				);

				function groupStyle() {
					return [
						{
							layerName: 'Background', // all pools and lanes are always behind all nodes and links
							background: 'transparent', // can grab anywhere in bounds
							movable: true, // allows users to re-order by dragging
							copyable: false, // can't copy lanes or pools
							avoidable: false, // don't impede AvoidsNodes routed Links
							minLocation: new go.Point(-Infinity, NaN), // only allow horizontal movement
							maxLocation: new go.Point(Infinity, NaN),
						},
						new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
					];
				}
				function updateCrossLaneLinks(group) {
					group.findExternalLinksConnected().each(function (l) {
						l.visible = l.fromNode.isVisible() && l.toNode.isVisible();
					});
				}
				that.myDiagram.groupTemplate = GO(
					go.Group,
					'Vertical',
					// "Auto",
					groupStyle(),
					{
						selectionObjectName: 'SHAPE', // selecting a lane causes the body of the lane to be highlit, not the label
						resizable: true,
						resizeObjectName: 'SHAPE', // the custom resizeAdornmentTemplate only permits two kinds of resizing
						layout: GO(
							go.LayeredDigraphLayout, // automatically lay out the lane's subgraph
							{
								isInitial: false, // don't even do initial layout
								isOngoing: false, // don't invalidate layout when nodes or links are added or removed
								direction: 90,
								columnSpacing: 10,
								layeringOption: go.LayeredDigraphLayout.LayerLongestPathSource,
							}
						),
						computesBoundsAfterDrag: true, // needed to prevent recomputing Group.placeholder bounds too soon
						computesBoundsIncludingLinks: false, // to reduce occurrences of links going briefly outside the lane
						computesBoundsIncludingLocation: true, // to support empty space at top-left corner of lane
						handlesDragDropForMembers: true, // don't need to define handlers on member Nodes and Links
						mouseDrop: function (e, grp) {
							// dropping a copy of some Nodes and Links onto this Group adds them to this Group
							if (!e.shift) return; // cannot change groups with an unmodified drag-and-drop
							// don't allow drag-and-dropping a mix of regular Nodes and Groups
							if (
								!e.diagram.selection.any(function (n) {
									return n instanceof go.Group;
								})
							) {
								var ok = grp.addMembers(grp.diagram.selection, true);
								if (ok) {
									updateCrossLaneLinks(grp);
								} else {
									grp.diagram.currentTool.doCancel();
								}
							} else {
								e.diagram.currentTool.doCancel();
							}
						},
						subGraphExpandedChanged: function (grp) {
							var shp = grp.resizeObject;
							if (grp.diagram.undoManager.isUndoingRedoing) return;
							if (grp.isSubGraphExpanded) {
								shp.width = grp._savedBreadth;
							} else {
								grp._savedBreadth = shp.width;
								shp.width = NaN;
							}
							updateCrossLaneLinks(grp);
						},
					},
					// the lane header consisting of a Shape and a TextBlock
					GO(
						go.Panel,
						'Horizontal',
						{
							name: 'HEADER',
							angle: 0, // maybe rotate the header to read sideways going up
							alignment: go.Spot.Center,
						},
						GO(
							go.Panel,
							'Horizontal', // this is hidden when the swimlane is collapsed
							new go.Binding('visible', 'isSubGraphExpanded').ofObject(),
							GO(go.Shape, 'Diamond', { width: 8, height: 8, fill: 'white' }, new go.Binding('fill', 'color'))
							// GO(
							//   go.TextBlock, // the lane label
							//   {
							//     font: "bold 13pt sans-serif",
							//     editable: true,
							//     margin: new go.Margin(2, 0, 0, 0),
							//   },
							//   new go.Binding("text", "name").makeTwoWay()
							// )
						)
						// GO("SubGraphExpanderButton", { margin: 5 }) // but this remains always visible!
					), // end Horizontal Panel

					GO(
						go.Panel,
						'Auto', // the lane consisting of a background Shape and a Placeholder representing the subgraph
						GO(
							go.Shape,
							'Rectangle', // this is the resized object
							{ name: 'SHAPE', fill: 'white' },
							new go.Binding('fill', 'color'),
							new go.Binding('desiredSize', 'size', go.Size.parse).makeTwoWay(go.Size.stringify)
						),
						GO(go.Placeholder, { padding: 12, alignment: go.Spot.TopLeft }),
						GO(
							go.TextBlock, // this TextBlock is only seen when the swimlane is collapsed
							{
								name: 'LABEL',
								font: 'bold 13pt sans-serif',
								editable: true,
								angle: 90,
								alignment: go.Spot.TopLeft,
								margin: new go.Margin(4, 0, 0, 2),
							},
							new go.Binding('visible', 'isSubGraphExpanded', function (e) {
								return !e;
							}).ofObject(),
							new go.Binding('text', 'name').makeTwoWay()
						)
					), // end Auto Panel
					{
						click: that.NodeClick, // 单击事件
					}
				); // end Group

				that.myDiagram.groupTemplate.resizeAdornmentTemplate = GO(
					go.Adornment,
					'Spot',
					GO(go.Placeholder),
					GO(
						go.Shape, // for changing the length of a lane
						{
							alignment: go.Spot.Bottom,
							desiredSize: new go.Size(50, 7),
							fill: 'lightblue',
							stroke: 'dodgerblue',
							cursor: 'row-resize',
						},
						new go.Binding('visible', '', function (ad) {
							if (ad.adornedPart === null) return false;
							return ad.adornedPart.isSubGraphExpanded;
						}).ofObject()
					),
					GO(
						go.Shape, // for changing the breadth of a lane
						{
							alignment: go.Spot.Right,
							desiredSize: new go.Size(7, 50),
							fill: 'lightblue',
							stroke: 'dodgerblue',
							cursor: 'col-resize',
						},
						new go.Binding('visible', '', function (ad) {
							if (ad.adornedPart === null) return false;
							return ad.adornedPart.isSubGraphExpanded;
						}).ofObject()
					)
				);

				// that.myDiagram.groupTemplate.resizeAdornmentTemplate = GO(
				//   go.Adornment,
				//   "Spot",
				//   GO(go.Placeholder),
				//   GO(
				//     go.Shape, // for changing the length of a lane
				//     {
				//       alignment: go.Spot.Bottom,
				//       desiredSize: new go.Size(50, 7),
				//       fill: "lightblue",
				//       stroke: "dodgerblue",
				//       cursor: "row-resize",
				//     },
				//     new go.Binding("visible", "", function (ad) {
				//       if (ad.adornedPart === null) return false;
				//       return ad.adornedPart.isSubGraphExpanded;
				//     }).ofObject()
				//   ),
				//   GO(
				//     go.Shape, // for changing the breadth of a lane
				//     {
				//       alignment: go.Spot.Right,
				//       desiredSize: new go.Size(7, 50),
				//       fill: "lightblue",
				//       stroke: "dodgerblue",
				//       cursor: "col-resize",
				//     },
				//     new go.Binding("visible", "", function (ad) {
				//       if (ad.adornedPart === null) return false;
				//       return ad.adornedPart.isSubGraphExpanded;
				//     }).ofObject()
				//   )
				// );

				that.myDiagram.groupTemplateMap.add(
					'Pool',
					GO(
						go.Group,
						'Auto',
						groupStyle(),
						{
							layout: GO(PoolLayout, { spacing: new go.Size(0, 0) }),
						},
						GO(go.Shape, { fill: 'white' }, new go.Binding('fill', 'color')),
						GO(
							go.Panel,
							'Table',
							{ defaultColumnSeparatorStroke: 'black' },
							GO(
								go.Panel,
								'Horizontal',
								{ row: 0, angle: 0 },
								GO(
									go.TextBlock,
									{
										font: 'bold 16pt sans-serif',
										editable: false,
										margin: new go.Margin(2, 0, 0, 0),
									},
									new go.Binding('text', 'name') /* 泳道名 */,
									new go.Binding('font', 'font', (font) => {
										return setFontStyle(font);
									})
								)
							),
							// GO(go.Placeholder, { row: 0, padding: 5 }),
							// { defaultRowSeparatorStroke: "black", defaultColumnSeparatorStroke: "black" },
							GO(go.Placeholder, {
								row: 1,
								column: 0,
								stretch: go.GraphObject.Fill,
							}),
							GO(go.Placeholder, {
								row: 1,
								column: 0,
								stretch: go.GraphObject.Fill,
							})
						)
					)
				);
				that.myDiagram.linkTemplate = GO(go.Link, { routing: go.Link.AvoidsNodes, corner: 5 }, { relinkableFrom: true, relinkableTo: true }, GO(go.Shape), GO(go.Shape, { toArrow: 'Standard' }));
				that.myDiagram.nodeTemplateMap.add(
					'OperationalActivity',
					GO(
						go.Node,
						'Spot',
						that.commonNodeStyle(),
						new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
						GO(
							go.Panel,
							'Auto',
							GO(
								go.Shape,
								{
									fill: 'whitesmoke',
									portId: '',
									fromLinkable: true,
									toLinkable: true,
									fromLinkableDuplicates: true,
									toSpot: go.Spot.AllSides,
									fromSpot: go.Spot.AllSides,
									toLinkableDuplicates: true,
									cursor: 'pointer',
									stroke: '#ffff00',
									strokeWidth: 1,
								},
								'RoundedRectangle',
								new go.Binding('fill', 'color'),
								new go.Binding('stroke', 'color2'),
								new go.Binding('strokeWidth', 'strokeWidth')
							),
							GO(
								go.Panel,
								'Vertical',
								GO(
									go.Panel,
									'Table',
									{
										minSize: new go.Size(180, NaN),
										maxSize: new go.Size(250, NaN),
										margin: new go.Margin(6, 10, 0, 6),
									},
									GO(go.RowColumnDefinition, { column: 2, width: 4 }),
									GO(go.Picture, {
										source: require('../../../assets/images/huodong.png'), // 替换为您的图片路径
										width: 20, // 图片的宽度
										height: 20, // 图片的高度
										row: 1,
										margin: 0,
										column: 1,
										alignment: go.Spot.TopRight, // 图片位于节点的右上角
									}),
									GO(
										go.TextBlock,
										{
											row: 1,
											margin: 5,
											column: 1,
											columnSpan: 5,
											font: '10pt Segoe UI,sans-serif',
											isMultiline: false,
											minSize: new go.Size(50, 16),
											stroke: '#000',
										},
										new go.Binding('text', 'title').makeTwoWay(),
										// new go.Binding("font", "font", (font) => {
										//   return setFontStyle(font);
										// }),
										new go.Binding('stroke', 'fontColor').makeTwoWay()
									),
									GO(
										go.TextBlock,
										{
											row: 2,
											margin: 5,
											column: 0,
											columnSpan: 5,
											font: '12pt Segoe UI,sans-serif',
											editable: true,
											isMultiline: false,
											minSize: new go.Size(50, 16),
											stroke: '#000',
										},
										new go.Binding('text', 'name').makeTwoWay(),
										new go.Binding('font', 'font', (font) => {
											return setFontStyle(font);
										}),
										new go.Binding('stroke', 'fontColor').makeTwoWay()
									)
								)
							),
							{
								click: that.NodeClick, // 单击事件
							}
						)
					)
				);
				that.myDiagram.nodeTemplateMap.add(
					'StartingPoint',
					GO(
						go.Node,
						'Spot',
						that.commonNodeStyle(),
						{ locationSpot: go.Spot.Center },
						new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
						GO(
							go.Shape,
							'Circle',
							{
								fill: '#666',
								stroke: 'gray',
								strokeWidth: 2,
								desiredSize: new go.Size(20, 20),
								portId: '', // so that links connect to the Shape, not to the whole Node
								fromSpot: go.Spot.BottomSide,
								toSpot: go.Spot.TopSide,
								alignment: go.Spot.Center,
								fromLinkable: true,
								toLinkable: true,
								fromLinkableDuplicates: true,
								toSpot: go.Spot.AllSides,
								fromSpot: go.Spot.AllSides,
								toLinkableDuplicates: true,
								cursor: 'pointer',
							},
							new go.Binding('fill', 'color'),
							new go.Binding('stroke', 'color2'),
							new go.Binding('strokeWidth', 'strokeWidth')
						),
						{
							click: that.NodeClick, // 单击事件
						}
					)
				);
				that.myDiagram.nodeTemplateMap.add(
					'EndPoint',
					GO(
						go.Node,
						'Spot',
						that.commonNodeStyle(),
						{ locationSpot: go.Spot.Center },
						new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
						GO(
							go.Shape,
							'Circle',
							{
								fill: 'black',
								stroke: '#666',
								strokeWidth: 5,
								desiredSize: new go.Size(17, 17),
								portId: '', // so that links connect to the Shape, not to the whole Node
								fromSpot: go.Spot.BottomSide,
								toSpot: go.Spot.TopSide,
								alignment: go.Spot.Center,
								fromLinkable: true,
								toLinkable: true,
								fromLinkableDuplicates: true,
								toSpot: go.Spot.AllSides,
								fromSpot: go.Spot.AllSides,
								toLinkableDuplicates: true,
								cursor: 'pointer',
							},
							new go.Binding('fill', 'color')
						),
						{
							click: that.NodeClick, // 单击事件
						}
					)
				);
				that.myDiagram.nodeTemplateMap.add(
					'DecisionMaking',
					GO(
						go.Node,
						'Spot',
						that.commonNodeStyle(),
						{ locationSpot: go.Spot.Center },
						new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
						GO(
							go.Shape,
							'Diamond',
							{
								fill: 'whitesmoke',
								stroke: 'gray',
								strokeWidth: 2,
								desiredSize: new go.Size(120, 60),
								portId: '', // so that links connect to the Shape, not to the whole Node
								fromSpot: go.Spot.BottomSide,
								toSpot: go.Spot.TopSide,
								alignment: go.Spot.Center,
								fromLinkable: true,
								toLinkable: true,
								fromLinkableDuplicates: true,
								toSpot: go.Spot.AllSides,
								fromSpot: go.Spot.AllSides,
								toLinkableDuplicates: true,
								cursor: 'pointer',
							},
							new go.Binding('fill', 'color'),
							new go.Binding('stroke', 'color2'),
							new go.Binding('strokeWidth', 'strokeWidth')
						),
						{
							click: that.NodeClick, // 单击事件
						}
					)
				);
				that.myDiagram.nodeTemplateMap.add(
					'Receive',
					GO(
						go.Node,
						that.commonNodeStyle(),
						{ locationSpot: go.Spot.Center },
						new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
						GO(
							go.Shape,
							'Rectangle',
							{
								fill: 'whitesmoke',
								stroke: '#000',
								fromSpot: go.Spot.BottomCenter,
								toSpot: go.Spot.TopCenter,
								desiredSize: new go.Size(200, 6),
								portId: '',
								fromSpot: go.Spot.BottomSide,
								toSpot: go.Spot.TopSide,
								fromLinkable: true,
								toLinkable: true,
								fromLinkableDuplicates: true,
								toSpot: go.Spot.AllSides,
								fromSpot: go.Spot.AllSides,
								toLinkableDuplicates: true,
								cursor: 'pointer',
							},
							new go.Binding('fill', 'color'),
							new go.Binding('stroke', 'color2'),
							new go.Binding('strokeWidth', 'strokeWidth')
						),
						{
							click: that.NodeClick, // 单击事件
						}
					)
				);
				const ConcrolFlow = GO(
					go.Link,
					{ routing: go.Link.AvoidsNodes, corner: 5 },
					{ relinkableFrom: true, relinkableTo: true },
					{
						click: that.linkClick, // 单击事件
					},
					GO(
						go.Shape,
						{
							stroke: '#000',
							strokeWidth: 1,
						},
						new go.Binding('stroke', 'color'),
						new go.Binding('strokeWidth', 'width')
					),
					GO(go.Shape, { toArrow: 'Standard' }),
					new go.Binding('routing', 'routing', go.Binding.parseEnum(go.Link, go.Link.AvoidsNodes))
				);
				const ConcrolFlow2 = GO(
					go.Link,
					{ routing: go.Link.AvoidsNodes, corner: 5 },
					{ relinkableFrom: true, relinkableTo: true },
					{
						click: that.linkClick, // 单击事件
					},
					GO(go.Shape, new go.Binding('stroke', 'color')),
					GO(go.Shape, { toArrow: 'Standard', segmentIndex: -Infinity }),
					new go.Binding('routing', 'routing', go.Binding.parseEnum(go.Link, go.Link.AvoidsNodes)),
					GO(
						go.TextBlock,
						{
							textAlign: 'center',
							margin: 5,
						},
						new go.Binding('text', 'operationalInformationName')
					)
				);
				const templmap = new go.Map();
				templmap.add('ConcrolFlow', ConcrolFlow);
				templmap.add('ConcrolFlow2', ConcrolFlow2);
				this.myDiagram.linkTemplateMap = templmap;
				that.myDiagram.model = new go.GraphLinksModel(that.content, that.association);
				this.myDiagram.addDiagramListener('LayoutCompleted', function (e) {
					console.log(e);
					that.addgojs();

					// 这里可以添加你希望在布局完成时执行的代码
				});

				// 监听连线事件
				that.myDiagram.addDiagramListener('LinkDrawn', function (e) {
					// console.log("有新得连线 —————————————————————— 添加连线", e);
					e.click = that.linkClick;
					if (e.subject.data) {
						// let fromLink = that.myDiagram.findLinksByExample({
						//   from: e.subject.from,
						// });
						// let toLink = that.myDiagram.findLinksByExample({
						//   to: e.subject.from,
						// });
						// console.log("连线数量", fromLink, toLink);

						const filterLinks = function (allLinks, linkType, linkPort) {
							let hasLinks = [];
							allLinks.forEach((item) => {
								if (item.category) {
									if (item[linkType] === linkPort) {
										hasLinks.push(item);
									}
								}
							});
							return hasLinks;
						};
						let from = e.subject.data.from;
						let to = e.subject.data.to;
						let fromOut = [],
							fromEnter = [],
							toOut = [],
							toEnter = [];
						if (that.association && that.association.length) {
							fromOut = filterLinks(that.association, 'from', from);
							fromEnter = filterLinks(that.association, 'to', from);
							toOut = filterLinks(that.association, 'from', to);
							toEnter = filterLinks(that.association, 'to', to);
						}
						if (fromOut.length && fromEnter.length && fromOut.length < fromEnter.length) {
							that.myDiagram.model.removeLinkData(e.subject.data);
							that.$message.warning('该节点不允许再创建出的连线');
						}
						if (toOut.length && toEnter.length && toEnter.length < toOut.length) {
							that.myDiagram.model.removeLinkData(e.subject.data);
							that.$message.warning('指向节点不允许再创建进入的连线');
						}
					}
					/* let fromLink = { from };
          let toLink = { to };
          let fromLinks = that.myDiagram.findLinksByExample(fromLink);
          let toLinks = that.myDiagram.findLinksByExample(toLink);
          console.log("fromLinks:", fromLinks);
          console.log("toLinks:", toLinks);
          while (fromLinks.next()) {
            console.warn("fromLinks:", fromLinks.value.data);
          }
          while (toLinks.next()) {
            console.warn("toLinks:", toLinks.value.data);
          } */
					that.association.forEach((item, index) => {
						if (!item.category) {
							// that.myDiagram.model.removeLinkData(item);
							// console.log(that.optionsValue);

							/* that.myDiagram.model.addLinkData({
              from: item.from,
              to: item.to,
              category: that.optionsValue,
              text: "",
              id: uuidv4(),
            }); */
							that.myDiagram.model.setDataProperty(item, 'category', that.optionsValue);
							that.myDiagram.model.setDataProperty(item, 'id', uuidv4());
						}
					});
					that.$nextTick(() => {
						// that.myDiagram.model = new go.GraphLinksModel(
						//   that.content,
						//   that.association
						// );
						// gojs更新画布
						// that.myDiagram.updateAllTargetBindings();
						that.addgojs();
					});
				});
				this.myDiagram.commandHandler.doKeyDown = function () {
					var e = this.diagram.lastInput;
					// Meta（Command）键代替Mac命令的“控制”
					var control = e.control || e.meta;
					var key = e.key;
					let contents = [];
					let associations = [];
					if (control && key === 'V') {
						// contents = JSON.parse(JSON.stringify(that.content));
						// associations = JSON.parse(JSON.stringify(that.association));
						return;
					} else {
						go.CommandHandler.prototype.doKeyDown.call(this);
						if (['Del', 'Backspace'].includes(key)) {
							that.addgojs();
						}
					}
					//退出任何撤销/重做组合键，具体键值根据需求而定
					// if(control &&(key === 'Z' || key === 'Y'))return ;
					//调用没有参数的基础方法（默认功能）
				};
				// 监听选中项
				that.myDiagram.addDiagramListener('ChangedSelection', function (e, i) {
					// console.log("重新选择了", e.myDiagram.lastInput.viewPoint);
					// console.log("重新选择了", e.Lr.ea);
					that.selectNode = [];
					that.selectLink = [];
					that.myDiagram.selection.each(function (part) {
						if (part instanceof go.Node) {
							that.selectNode.push(part.data);
						} else if (part instanceof go.Link) {
							that.selectLink.push(part.data);
						}
					});
					if (e.Lr.ea) {
						console.log(e.Lr.ea.key.data);
						if (e.Lr.ea.key.key) {
							that.xuanzhongxiang = e.Lr.ea.key.key;
						} else that.xuanzhongxiang = '';
					} else that.xuanzhongxiang = '';
					// 连线添加作战信息库
					if (e.Lr.ea) {
						if (e.Lr.ea.key) {
							if (e.Lr.ea.key.data) {
								if (e.Lr.ea.key.data.category == 'ConcrolFlow' || e.Lr.ea.key.data.category == 'ConcrolFlow2') {
									let linkData = e.Lr.ea.key.data;
									if (that.xuanzhongzuozhanid) {
										that.myDiagram.model.setDataProperty(linkData, 'name', that.xuanzhongzuozhanidname);
										that.myDiagram.model.setDataProperty(linkData, 'operationalInformationId', that.xuanzhongzuozhanid);
										that.myDiagram.model.setDataProperty(linkData, 'operationalInformationName', that.xuanzhongzuozhanidname);
										that.myDiagram.model.setDataProperty(linkData, 'category', 'ConcrolFlow2');
										that.myDiagram.model.setDataProperty(linkData, 'id', uuidv4());
										that.$nextTick(() => {
											// that.myDiagram.model = new go.GraphLinksModel(
											//   that.content,
											//   that.association
											// );
											// this.myDiagram.updateAllTargetBindings();
											that.addgojs();
										});
									}
								} else {
									that.xuanzhongzuozhanid = '';
								}
							}
						}
					} else {
						that.xuanzhongxiang = '';
						that.changeMenuIcon('clear');
					}

					that.zhanshi = '';
					if (that.xuanzhongxiaoguo.length != 0) {
						if (e.Lr.ea) {
							that.newLoc = e.diagram.lastInput.viewPoint;
							if (e.Lr.ea.key.data.type == 'Lane' || e.Lr.ea.key.data.type == 'StartingPoint' || e.Lr.ea.key.data.type == 'OperationalActivity' || e.Lr.ea.key.data.type == 'DecisionMaking' || e.Lr.ea.key.data.type == 'Receive' || e.Lr.ea.key.data.type == 'EndPoint') {
								if (e.Lr.ea.key.data.type == 'Lane') {
									console.log('e.Lr.ea.key.data', e.Lr.ea.key.data);
									that.form20.text = e.Lr.ea.key.data.id;
									console.log(that.form20.text);
									that.tianjiamokuai(that.xuanzhongxiaoguo);
								} else {
									console.log('e.Lr.ea.key.data', e.Lr.ea.key.data);
									that.form20.text = e.Lr.ea.key.data.group;
									that.tianjiamokuai(that.xuanzhongxiaoguo);
								}
							} else {
								that.xuanzhongxiaoguo = '';
								that.newLoc = {};
							}
						} else {
							that.xuanzhongxiaoguo = '';
							that.newLoc = {};
						}
					} else {
						that.newLoc = {};
					}
				});

				// 监听拖动
				this.myDiagram.addDiagramListener('SelectionMoved', function (e, i) {
					console.log('拖动触发', that.content, e, i);
					that.addgojs();
				});

				// 背景单击
				this.myDiagram.addDiagramListener('BackgroundSingleClicked', function (e, i) {
					console.log('背景单击');
					if (that.xuanzhongxiaoguo == 'Pool') {
						this.form.name = '';
						this.multipleSelection = [];
						this.options2text = '添加作战节点';
						this.getoptions2('OperationalNodes');
					} else {
						that.xuanzhongxiaoguo = '';
						that.newLoc = {};
					}
				});

				// force all lanes' layouts to be performed
				relayoutLanes(that.myDiagram);

				// const $gojsDiagramDiv = $(this.$refs.gojsDiagramDiv);
				// const myDiagram = $(go.Diagram, $gojsDiagramDiv[0]);

				// 初始化图表...
				// 这里省略了具体的GoJS配置代码

				// // 监听拖拽事件
				// that.$nextTick(() => {
				//   $("#OperationalActivity").draggable({
				//   helper: "clone",
				//   stop: function (event, ui) {
				//     console.log(123)
				//     // 当拖拽停止时，检查拖拽的位置是否在GoJS图表范围内
				//     // const gojsPosition = that.myDiagram.offset();
				//     // const draggablePosition = { x: event.clientX, y: event.clientY };
				//     // if (
				//     //   gojsPosition.left < draggablePosition.x &&
				//     //   gojsPosition.top < draggablePosition.y &&
				//     //   draggablePosition.x < gojsPosition.left + that.myDiagram.width() &&
				//     //   draggablePosition.y < gojsPosition.top + that.myDiagram.height()
				//     // ) {
				//     //   console.log(123)
				//     //   // 如果在范围内，可以触发GoJS的事件，例如点击事件
				//     //   // const point = myDiagram.transformViewToModel(
				//     //   //   new go.Point(event.clientX, event.clientY)
				//     //   // );
				//     //   // const mouseEvent = new go.MouseEvent();
				//     //   // mouseEvent.diagram = myDiagram;
				//     //   // mouseEvent.viewPoint = point;
				//     //   // myDiagram.dispatchModelEvent("ObjectSingleClick", mouseEvent);
				//     // }
				//   },
				// });
				// })

				this.myDiagram.addDiagramListener('ObjectSingleClicked', function (e) {
					var part = e.subject.part;
					if (!(part instanceof go.Link))
						// showMessage("Clicked on " + part.data.key);
						console.log('part - 画布点击事件', part);
				});
			},

			/* 顶栏菜单 */
			clickMenu(clickName) {
				if (clickName == 'order') {
					var GO = go.GraphObject.make;
					this.stbj = true;
					let maxnum = 0;
					let maxnum2 = 0;
					// 为每个组（泳道）应用LayeredDigraphLayout
					this.myDiagram.nodes.each(function (node) {
						if (node instanceof go.Group) {
							if (node.data.type == 'Lane') {
								console.log(node);
								let arr = node.data.size.split(' ');
								if (arr[1] > maxnum) {
									maxnum = arr[1];
								}
								if (arr[0] > maxnum2) {
									maxnum2 = arr[0];
								}
							}
							node.layout = GO(go.LayeredDigraphLayout, {
								direction: 90, // 垂直向下布局
								columnSpacing: 10,
								layeringOption: go.LayeredDigraphLayout.LayerOptimalLinkLength,
							});
						}
					});

					// 整体布局为GridLayout，水平排列泳道
					// this.myDiagram.layout = GO(go.GridLayout, {
					//   wrappingColumn: Infinity, // 水平排列
					//   alignment: go.GridLayout.Position,
					//   cellSize: new go.Size(1, 1),
					//   spacing: new go.Size(10, 10),
					// });

					//     this.myDiagram.nodes.each(function(node) {
					//   if (node instanceof go.Group) {
					//     console.log(node)
					//     var group = node;
					//     var contentBounds = group.actualBounds; // 使用 actualBounds
					//     var margin = 20; // 添加一些边距
					//     var newWidth = contentBounds.width + margin;
					//     var newHeight = contentBounds.height + margin; // 调整高度

					//     // 设置新的宽度和高度
					//     group.width = newWidth;
					//     group.height = newHeight;

					//     // 更新布局以确保更改生效
					//     group.invalidateLayout();
					//   }
					// });
					// this.myDiagram.layout.SwimLaneLayout();
					this.content.forEach((item, index) => {
						this.myDiagram.model.nodeDataArray.forEach((item2, index2) => {
							if (item.id == item2.id) {
								item.loc = item2.loc;
								item.location = item2.location;
							}
						});
						if (item.type == 'Lane') {
							let arr2 = item.size.split(' ');
							item.size = maxnum2 + ' ' + maxnum;
						}
					});
				}
				// if (clickName == "width") {
				//   var GO = go.GraphObject.make;
				//   this.stbj = true;
				//   let maxnum = 0
				//   // 为每个组（泳道）应用LayeredDigraphLayout
				//   this.myDiagram.nodes.each(function (node) {
				//     if (node instanceof go.Group) {
				//       if(node.data.type == 'Lane') {
				//         let arr = node.data.size.split(" ")
				//         if(arr[1] > maxnum) maxnum = arr[1]
				//       }
				//     }
				//   });
				//   this.content.forEach((item, index) => {
				//     if(item.type == 'Lane') {
				//       let arr2 = item.size.split(" ")
				//       item.size = arr2[0] + ' ' + maxnum
				//     }
				//   });
				// }
				// if (clickName == "heigth") {

				// }
			},
		},
	};
</script>

```
