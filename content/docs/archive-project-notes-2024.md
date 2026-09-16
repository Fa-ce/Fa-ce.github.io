---
title: 项目踩坑记录-2024
description: 归档内容，2024 年 Vue 项目踩坑实录，不对外展示。
date: 2024-08-22
category: toolchain
tags: [vue, echarts, troubleshooting, notes]
draft: true
---

el-table 渲染问题，点击排序出现数据

```js
let idArr = [];
_this.temEnergyCountData.forEach((item) => idArr.push(item.id));
let res = await computedEnergy({ nodeIds: idArr });
if (res.code === 200) {
  if (res.data && res.data.length) {
    let countArr = res.data;
    let p1 = _this.energyTabData[0].weight;
    let p2 = _this.energyTabData[1].weight;
    let p3 = _this.energyTabData[2].weight;
    _this.temEnergyCountData.forEach((item) => {
      countArr.forEach((cItem) => {
        if (item.id === cItem.nodeId) {
          item.p1 = cItem.p1;
          item.p2 = cItem.p2;
          item.p3 = cItem.p3;
          item.ce =
            parseFloat(cItem.p1 * p1) +
            parseFloat(cItem.p2 * p2) +
            parseFloat(cItem.p3 * p3);
        }
      });
    });
    _this.$nextTick(() => {
      _this.energyCountData = JSON.parse(
        JSON.stringify(_this.temEnergyCountData)
      );
      _this.$refs.energyCountTab.clearSort();
      _this.$refs.energyCountTab.doLayout();
    });
  }
}
```

将数组重新深拷贝一份解决

    "element-ui": "2.15.14"

# el-table

**el-table**在搜索、过滤等动态更新数据之后，仍然保持已有的选中状态

- 设置`row-key`和`reserve-selection`

- `row-key`是一个函数。如果在`table`上写`:row-key="getRowKey"`，在`methods`要绑定方法`getRowKey(row){ return row.id}`。或者写成`:row-key="(row) => row.id"`

- `reserve-selection`要在选择框的列设置，在`type="selection" `那一列标签上写 `:reserve-selection="true"`

- 如下：

```html
 <el-table
    ref="multipleTable"
    :data="options2"
    style="width: 100%"
    max-height="400"
    @selection-change="handleSelectionChange"
    :row-key="(row) => row.id"
  >
    <el-table-column
      type="selection"
      width="55"
      :reserve-selection="true"
    >
    </el-table-column>
    <el-table-column prop="name" label="节点名称"> </el-table-column>
    <el-table-column prop="equipName" label="装备名称">
    </el-table-column>
    <el-table-column
      prop="diagramName"
      label="视图名称"
      show-overflow-tooltip
    >
    </el-table-column>
  </el-table>
```

# Echarts

**Echarts**图例过多，翻页展示

显示翻页，需要 在`legend `加上 `type:‘scroll’` 属性。图例多到超出的时候，就会自动出现翻页

```js
// 图例的data数据
 nodeParams: [
        "OperationalNodes",
        "OperationalActivity",
        "StartingPoint",
        "EndPoint",
        "State",
        "CommunicationNodes",
        "FightConcept",
        "Capability",
        "System",
        "SystemFunction",
      ]
```

`option`配置中修改图例`legend`设置

```js
        legend: {
          orient: "vertical",
          left: "65%", //图例距离左的距离
          y: "center", //图例上下居中
          type: "scroll", /* 图例自动翻页 */
          textStyle: {
            padding: [0, 10, 0, 10],
            fontSize: 12,
            color: "#40C5F1",
          },
        },
```

我这里是环形图，这是原本没有设置 `type：“scroll”`的显示样式

![](/images/c-notes/2024-07-23-19-09-04-image.png)

加上设置之后，可以翻页看到所有的图例：

![](/images/c-notes/2024-07-23-19-17-25-image.png)

我这里是环形图，完整代码参考：

```js
 let option = {
        tooltip: {
          trigger: "item",
          show: true,
        },
        legend: {
          orient: "vertical",
          left: "65%",
          y: "center",
          type: "scroll",
          pageIconColor: "#6495ed", //翻页下一页的三角按钮颜色
          pageIconInactiveColor: "#aaa", //翻页（即翻页到头时）
          textStyle: {
            padding: [0, 10, 0, 10],
            fontSize: 12,
            color: "#40C5F1",
          },
        },
        graphic: [
          {
            type: "text", //控制内容为文本文字
            left: "center",
            top: "40%", //调整距离盒子高处的位置
            left: "30%",
            style: {
              fill: "#F3DF04", //控制字体颜色
              text: "评估数量", //控制第一行字显示内容
              fontSize: "20px",
            },
          },
          {
            type: "text",
            left: "center",
            top: "53%",
            left: "33%",
            z: 10,
            style: {
              text: "2680",
              font: "Microsoft YaHei",
              fontSize: "24px",
              lineHeight: 15,
              fill: "#FFFFFF",
            },
          },
        ],
        series: [
          {
            name: ' ',
            type: "pie",
            radius: ["70%", "85%"], // 环图的大小
            avoidLabelOverlap: false,
            padAngle: 5,
            itemStyle: {
              borderRadius: 2,
            },
            label: {
              show: false,
              position: "left",
              itemStyle: {
                color: "#fff",
              },
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 40,
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            center: ["40%", "50%"], //控制圆位置
            avoidLabelOverlap: false,
            legendHoverLink: false,
            // silent: false, //取消了silent
            emphasis: {
              //使用emphasis
              // disabled: false,
              scale: false, //不缩放
              scaleSize: 0, //为了防止失效直接设置未0
            },
            data: [ ], // data数据在下面
          },
        ],
      };

      let apiData = [];
      // viewData 是我的视图数据，这里 key 是图例的名称，value 是值
      for (const key in this.viewData) {
        apiData.push({
          name: key,
          value: this.viewData[key],
        });
      }
      option.series[0].data = apiData;
      window.addEventListener("resize", () => {
        myChart.resize({ animation: { duration: 1000 } });
      });
      myChart.setOption(option);
```

# KoroFileHeader插件

**函数注释快捷键失效**

快捷键使用
文件头部注释
快捷键：`crtl+alt+i（window）`,`ctrl+cmd+t (mac)`

函数注释
快捷键：`ctrl+alt+t (window)`, `ctrl+alt+t(mac)`

- 快捷键失效问题解决

在  `"fileheader.configObj"`设置里面将 `“openFunctionParamsCheck”`设置为`true`

- "openFunctionParamsCheck": true // 默认开启

如果还不生效，有可能是快捷键冲突，键盘快捷键命令中查找`cursorTop`命令

文件→首选项→键盘快捷方式
输入cursorTip代表函数头部注释，fileheader代表文件头注释。绑定新的快捷键即可

![](/images/c-notes/2024-07-28-16-06-44-image.png)

更多配置参考[官方文档](https://github.com/OBKoro1/koro1FileHeader/wiki/%E5%AE%89%E8%A3%85%E5%92%8C%E5%BF%AB%E9%80%9F%E4%B8%8A%E6%89%8B)

# 随机色

- **hsla颜色值**， 如 hsla(360, 50%, 50%, .5) 半透明红色 ， 此方式ie8及以下不兼容
  HSLA(H,S,L,A)
  H：Hue(色调)。0(或360)表示红色，120表示绿色，240表示蓝色，也可取其他数值来指定颜色。取值为：0 - 360
  S：Saturation(饱和度)。取值为：0.0% - 100.0%
  L：Lightness(亮度)。取值为：0.0% - 100.0%
  A：Alpha透明度。取值0~1之间。

```js
function rdmRgbColor() {
        // 色相（Hue）范围从大约180（青色）到255（蓝色，但HSL实际上在0-360之间循环，所以也可以使用0附近的色相表示紫色，但这里我们专注于蓝色和青色）
        // 为了保持冷色调，我们限制色相在180到255之间
        let h = Math.floor(Math.random() * (256 - 180 + 1)) + 180;
        // 如果想要包含紫色，可以调整范围为 240 到 300，并加上循环处理
        // let h = (Math.random() * 60 + 240) % 360;

        // 饱和度（Saturation）和亮度（Lightness）可以根据需要调整
        // 较低的饱和度会生成更柔和的颜色，较低的亮度会生成更暗的颜色
        let s = Math.floor(Math.random() * (100 - 50 + 1)) + 50; // 饱和度范围从50%到100%
        let v = Math.floor(Math.random() * (90 - 30 + 1)) + 30; // 亮度范围从30%到70%，较低的亮度可能更适合冷色调
        // 使用HSL格式返回颜色字符串
        let color = `hsl(${h}, ${s}%, ${v}%)`;
        return color;
      }
```

# Echarts 报错

`echarts`绘制为空，并且出现`Render`报错解决方法

- **报错**：

<i style="color:red"> Error: Renderer 'undefined' is not imported. Please import it first. </i>
at new ZRender (zrender.js:61:1)
at Module.init (zrender.js:234:1)
at new ECharts (echarts.js:254:1)
at Module.init (echarts.js:2291:1)
at VueComponent.initPie (VM1254 index.vue:465:72)
at VueComponent.drawMain (VM1254 index.vue:317:14)
at VueComponent.handleNodeClick (VM1254 index.vue:295:16)
at async VueComponent.mounted (VM1254 index.vue:261:5)

- **报错**：

<i style="color:red"> [Vue warn]: Error in mounted hook (Promise/async): "Error: Renderer 'undefined' is not imported. Please import it first."</i>

---> <DashboardPage> at src/plugin-weight-ahp/views/dashboard/index.vue
<App> at src/plugin-weight-ahp/App.vue
<Root>

- 原因分析：

`Echarts` **按需引入**报错。原本的引入，没有引入绘制方式(`CanvasRender` || `SVGRenderer`)

```js
    // 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
    import * as echarts from 'echarts/core'
    // 引入柱状图图表，图表后缀都为 Chart
    import { BarChart, PieChart } from 'echarts/charts'
    // 引入标题，提示框，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
    import {
        TitleComponent,
        TooltipComponent,
        GridComponent,
        DatasetComponent,
        TransformComponent,
        LegendComponent,
    } from 'echarts/components'
    // 标签自动布局、全局过渡动画等特性
    import { LabelLayout, UniversalTransition } from 'echarts/harts/renderers'
    // 注册必须的组件
    echarts.use([
        TitleComponent,
        TooltipComponent,
        GridComponent,
        DatasetComponent,
        TransformComponent,
        LegendComponent,
        BarChart,
        PieChart,
        LabelLayout,
        UniversalTransition,
    ])
```

需要引入并注册渲染器：

```js
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers'
    // 注册必须的组件添加 canvas 渲染器
    echarts.use([
        CanvasRenderer,
    ])
```

添加渲染器之后，页面绘制完成

![](/images/c-notes/2024-08-19-15-28-24-image.png)

# VS code打开项目代码飘红

关闭 `JavaScript`语法检查，打开 vscode 的设置，找到validate，把javascript前面的勾选去掉即可。

![](/images/c-notes/2024-08-22-13-32-37-image.png)
