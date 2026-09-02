---
title: 浏览器与网络考点
description: 从输入 URL 到页面呈现的完整链路，涵盖渲染流程、回流重绘、HTTP 报文与状态码、跨域同源策略与常见攻击方式。
date: 2024-11-03
category: interview
tags: [browser, http, network, performance, notes]
---

## 输入 URL 到页面加载的全过程

这是面试最高频的一道题，完整链路如下。

浏览器先通过 DNS 解析把域名转换为 IP 地址，然后与服务器进行三次握手建立 TCP 连接。连接建立后发送 HTTP 请求，服务器处理请求并返回响应（其间可能有永久重定向，浏览器需跟踪重定向地址）。浏览器拿到响应后解析 HTML、CSS、JS 并渲染页面，最后四次挥手断开连接。

**三次握手**的过程：客户端主动发起请求，发送 SYN 并将自身状态置为 SYN-SENT，携带 `seq=x`；服务端收到后返回 `seq=y`，状态变为 SYN-RCVD；客户端收到返回值后进入 ESTABLISHED 状态，连接完成。

## 浏览器渲染流程

浏览器渲染页面时依次做这几件事：加载 HTML 和 CSS 源码，把 HTML 转换为 DOM、CSS 转换为 CSSOM，将两者构建成渲染树，对渲染树执行回流计算元素位置，最后绘制页面。

**渲染树**从根元素开始检查哪些元素可见及其样式，会忽略 `display: none` 的不可见元素。

## 回流与重绘

**回流**（reflow，也叫重排）是指页面结构或元素尺寸发生变化时，浏览器需要重新计算元素的大小和位置并重新渲染。**重绘**（repaint）是指元素外观（如字体颜色、背景色）改变时浏览器重新绘制。

**回流一定会引起重绘，重绘不一定引起回流。** 回流是非常昂贵的操作，次数过多会显著拖慢页面性能。

### 哪些操作会触发

任何改变渲染树构建信息的操作都会导致回流或重绘：添加、删除、更新 DOM 节点；用 `display: none` 隐藏节点会同时触发回流和重绘；用 `visibility: hidden` 隐藏只触发重绘，因为没有几何变化；移动元素或添加动画；添加样式表、调整样式属性；用户行为如调整窗口大小、改变字号、滚动页面。

### 如何避免

集中修改样式，不要一条一条地改 DOM 样式，可以通过切换 `class` 或使用 `style.cssText` 批量操作。不要把 DOM 节点的属性值放在循环里当变量。为动画元素使用 `position: fixed` 或 `absolute`，修改它们的 CSS 不会引起整体回流。不使用 table 布局，因为很小的改动就可能造成整个 table 重新布局。

动画开启 GPU 加速，`transform` 使用 3D 变化。将元素提升为合成层——合成层的位图交由 GPU 合成比 CPU 快，需要 repaint 时只影响自身不波及其他层，且 `transform` 和 `opacity` 效果不会触发 layout 和 paint。提升合成层的最佳方式是 `will-change`：

```css
#target {
  will-change: transform;
}
```

另外可以缓存 DOM 查询结果，减少 DOM 深度和数量，批量操作时先拼接字符串再用 `innerHTML` 一次性更新，配合防抖节流限制高频触发，并及时清理定时器与事件监听。

> 在 Vue、React 这类现代框架中，这些优化大多已由框架处理，开发时唯一需要注意的是尽量减少直接操作 DOM。

## HTTP 协议

### 主要特点

简单快捷、灵活、**无连接**（连接一次就断开，不保持连接）、**无状态**（第一次请求结束后断开，第二次请求时服务端不记得之前的状态）。

### 报文结构

请求报文由请求行、请求头、空行、请求体四部分组成。请求行包括请求方法、URL、HTTP 协议及版本；请求头是一堆键值对；**空行**的作用是告诉服务器后面的内容是请求体；请求体是数据部分。

响应报文由状态行、响应头、空行、响应体组成。状态行包括 HTTP 协议及版本、状态码及状态描述。

### 请求方法

HTTP 1.0 定义了 GET、POST、HEAD 三种方法，HTTP 1.1 新增了 OPTIONS、PUT、PATCH、DELETE、TRACE、CONNECT 六种。

常用方法的语义：GET 获取资源，POST 传输资源，PUT 更新资源，DELETE 删除资源，HEAD 获取报文首部。

### GET 与 POST 的区别

GET 把参数拼在 URL 中传递，数据量小且不安全，参数会保留在浏览器历史记录中，会被浏览器主动缓存，浏览器回退时不会重新请求。

POST 把参数放在请求体中，携带数据量大，相对安全，不会被主动缓存，回退时会重新请求。

**提交敏感数据（如登录密码）或上传文件时必须用 POST。**

### 状态码

按首位数字分五类：1xx 表示服务器已收到请求需要请求者继续操作；2xx 成功；3xx 重定向，需要进一步操作；4xx 客户端错误；5xx 服务器错误。

常见的具体状态码：200 请求成功，301 页面已永久转移到新 URL，400 客户端请求语法错误，401 请求未经授权，403 页面访问被禁止，404 资源不存在，500 服务器错误，503 服务器宕机请求未完成。

### 持久连接

HTTP 1.0 时代靠**轮询**——客户端每隔很短时间就发起请求查看是否有新消息，对服务器和客户端都造成大量性能浪费。

HTTP 1.1 通过 `Connection: keep-alive` 实现**长连接**，客户端只请求一次，服务器保持连接。默认仍是请求一次响应一次，开启管线化后可以把请求打包一次性发送、一次性响应。

## 同源策略与跨域

**同源**要求协议、域名、端口号完全相同，任何一部分不同就是跨域。

同源策略限制一个源的文档操作另一个源的资源，具体体现在：无法获取对方的 Cookie、LocalStorage 和 IndexedDB；无法获取和操作 DOM；不能发送 Ajax 请求。

前后端通信的三种方式中，Ajax 不支持跨域，WebSocket 不受同源策略限制天然支持跨域，CORS 则同时支持同源和跨域 Ajax。

### 发送 Ajax 请求的步骤

创建 `XMLHttpRequest` 对象，用 `open(method, url, async)` 设置请求参数，发送请求，注册 `onreadystatechange` 事件，最后获取返回数据。

## DOM 事件

### 事件流三阶段

事件传递依次经过捕获阶段（从 `window` 向目标元素传递）、目标阶段、冒泡阶段（从目标元素向 `window` 传递）。

捕获的流程是 `window → document → html → body → 目标元素`。获取 body 节点用 `document.body`，获取 html 节点用 `document.documentElement`。

### 事件绑定写法

```js
element.onclick = function () {}                              // DOM0
element.addEventListener('click', function () {}, false)      // DOM2
```

第三个参数 `true` 表示在捕获阶段触发，`false` 表示在冒泡阶段触发，默认 `false`。

### 事件控制

阻止默认行为用 `event.preventDefault()`，阻止冒泡用 `event.stopPropagation()`，阻止同元素上其他监听器执行用 `event.stopImmediatePropagation()`。

**事件委托**中要区分两个属性：`event.currentTarget` 是当前绑定事件的元素（父元素），`event.target` 是实际被点击的元素（子元素）。

## 浏览器内核

IE 用 Trident 内核（三叉戟），Chrome 现在用 Blink（早期是 Webkit），Firefox 用 Gecko（壁虎），Safari 用 Webkit，Opera 最初是自研的 Presto，后改用 Webkit，现在也是 Blink。

内核分渲染引擎和 JS 引擎两部分。Webkit 是苹果公司的，Blink 是 Webkit 的分支。

## BOM 对象

`window` 是 JS 最顶层对象，其他 BOM 对象都是它的属性。`document` 是文档对象，`location` 保存当前 URL 信息，`navigator` 是浏览器本身信息，`screen` 是客户端屏幕信息，`history` 是访问历史。

## 客户端存储对比

`cookie`、`sessionStorage`、`localStorage` 的差异主要在四个维度。

**是否随请求发送**：cookie 始终在同源 HTTP 请求中携带（即使不需要），在浏览器和服务器间来回传递；webStorage 不会。

**存储大小**：cookie 不超过 4KB，因此只适合存会话标识这类很小的数据；webStorage 可达 5MB 或更大。

**有效期**：`sessionStorage` 仅在当前浏览器窗口关闭前有效；`localStorage` 始终有效，窗口或浏览器关闭也保留，适合持久数据；cookie 在设置的过期时间之前有效，与窗口关闭无关。

**作用域**：`sessionStorage` 不在不同窗口间共享，即使是同一个页面；`localStorage` 和 cookie 在所有同源窗口中共享。

另外 cookie 与 session 的区别在于：cookie 保存在浏览器端，session 保存在服务器端；cookie 单个不超过 4KB，session 大小无限制；cookie 只能保存字符串，session 可以保存任意类型对象；**session 的安全性高于 cookie**。

## 网站攻击方式

常见的有 XSS（跨站脚本攻击）和 CSRF（跨站请求伪造）。

### CSRF 原理

攻击者诱导受害者进入第三方网站，在该网站中向被攻击网站发送跨站请求，利用受害者已获取的登录凭证绕过后台验证，冒充用户执行操作。

自动发起 GET 请求的形式，把支付接口藏在 `img` 标签里，浏览器加载图片时自动发起带登录信息的跨域请求：

```html
<img src="http://xxx.com/pay?amount=100000&for=hacker">
```

自动发起 POST 请求的形式，用表单自动提交模拟用户操作：

```html
<form action="http://a.com/pay" method="POST">
  <input type="hidden" name="amount" value="10000" />
  <input type="hidden" name="for" value="hacker" />
</form>
<script>document.forms[0].submit()</script>
```

**CSRF 成立需要三个条件同时满足**：目标站点存在 CSRF 漏洞；用户登录过目标站点且浏览器保持登录状态；用户打开了第三方站点。

### CSRF 防护

**利用同源策略**直接禁止外域请求。HTTP 异步请求会携带两个标记来源的 Header：`Referer` 记录来源地址（含 URL 路径），`Origin` 记录域名信息（不含路径）。服务器先判断 `Origin`，若请求头中没有则根据实际情况判断是否使用 `Referer`。

**Token 验证**。用户登录后服务器生成 Token 返回，浏览器发起请求时带上，服务端校验。

**利用 Cookie 的 SameSite 属性**。`Strict` 完全禁止第三方拿到 Cookie；`Lax` 相对宽松，跨站点时第三方链接打开或 GET 表单提交会携带 Cookie，但 POST 请求、`img`、`iframe` 加载的 URL 不会；`None` 任何情况下都发送。

## BFC

BFC 是 Block Formatting Context（块级格式化上下文），它决定了元素如何对其内容定位，是一个完全独立的布局空间，内部子元素不会影响外部布局。

触发 BFC 的 CSS 属性：

```css
overflow: hidden;
display: inline-block;
display: flex;
display: table-cell;
position: absolute;
position: fixed;
```

BFC 的规则是块级元素在垂直方向依次排列；容器内的元素不影响外部；垂直距离由 `margin` 决定，同一 BFC 内相邻元素的外边距会重叠；计算 BFC 高度时浮动元素也参与计算。

**BFC 主要解决两个问题**：`float` 脱离文档流导致的高度塌陷，以及 `margin` 边距重叠。

## Viewport 视口

PC 端的 viewport 就等于浏览器窗口，通过 `document.documentElement.clientWidth` 获取。

移动端要区分三种视口。**布局视口**远大于设备屏幕（为了让 PC 端设计的网站能完整显示），因此会出现滚动条，用 `document.documentElement.clientWidth` 获取。**视觉视口**指浏览器可视区域的宽度。**理想视口**是布局视口的理想尺寸，只有当布局视口等于设备屏幕尺寸时才是理想视口，用 `window.screen.width` 获取。

## 性能优化

### 减少请求数量

文件合并、公共库合并、不同页面单独合并；用字体图标代替图片，小图以 Base64 内嵌到 HTML，优先用 SVG；减少重定向；使用缓存；不使用 `CSS @import`。

避免空的 `src` 和 `href`——`a` 标签设置空 `href` 会重定向到当前页面地址，`form` 设置空 `action` 会提交表单到当前页面。

### 减小资源体积

HTML 压缩去掉空格制表符换行符；CSS 压缩删除无效代码并做语义合并；JS 压缩混淆，删除无效字符和注释、缩减代码语义，同时降低可读性起到代码保护作用。

安卓下可用 WebP 格式图片，压缩算法更优体积更小。开启 gzip 编码可显著改善传输性能。

### 优化网络连接

使用 CDN 就近获取资源。使用 DNS 预解析提前解析后续可能用到的域名，把结果缓存到系统缓存中：

```html
<link rel="dns-prefetch" href="https://www.google.com">
```

用 `keep-alive` 建立持久连接；HTTP 2 中开启管道化连接，每条连接并发传输多个资源。

### 优化资源加载

CSS 文件放在 `head` 中，先外链后本页；JS 文件放在 `body` 底部；处理页面布局的 JS（如 `flexible.js`）放在 `head` 中；`body` 中间尽量不写 `style` 和 `script` 标签。

`defer` 异步加载并在 HTML 解析完成后执行，`async` 异步加载且加载完立即执行。`preload` 让浏览器提前加载指定资源加速本页面，`prefetch` 加载下一页面可能用到的资源加速后续导航。

配合资源懒加载（满足条件时才加载）和预加载（提前加载用户所需资源）平衡首屏速度与体验。

> Cookie 会随每个同域请求发送到服务器，影响加载速度，应尽量减少不必要的 Cookie。

## CDN

构建在现有网络基础之上的智能虚拟网络，依靠部署在各地的服务器**使用户就近获取所需内容**，降低网络拥塞，提高访问速度和命中率。
