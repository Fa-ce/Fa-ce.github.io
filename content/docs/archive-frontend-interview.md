---
title: 前端面试题合集
description: 归档内容，网络转载的面试题合集，不对外展示。
date: 2024-10-18
category: interview
tags: [javascript, css, notes]
draft: true
source: "未知来源的网络转载合集，仅作个人备份"
---

## css

## calc, support, media各自的含义及用法？

@support主要是用于检测浏览器是否支持CSS的某个属性，其实就是条件判断，如果支持某个属性，你可以写一套样式，如果不支持某个属性，你也可以提供另外一套样式作为替补。

calc() 函数用于动态计算长度值。 calc()函数支持 "+", "-", "*", "/" 运算；

@media 查询，你可以针对不同的媒体类型定义不同的样式。

## css水平、垂直居中的写法，请至少写出4种？

> 这题考查的是css的基础知识是否全面，所以平时一定要注意多积累

*水平居中*

- 行内元素: `text-align: center`
- 块级元素: `margin: 0 auto`
- position:absolute +left:50%+ transform:translateX(-50%)
- `display:flex + justify-content: center`

*垂直居中*

- 设置line-height 等于height
- position：absolute +top:50%+ transform:translateY(-50%)
- `display:flex + align-items: center`
- display:table+display:table-cell + vertical-align: middle;

## 1rem、1em、1vh、1px各自代表的含义？

> rem

rem是全部的长度都相对于根元素<html>元素。通常做法是给html元素设置一个字体大小，然后其他元素的长度单位就为rem。

> em

- 子元素字体大小的em是相对于父元素字体大小
- 元素的width/height/padding/margin用em的话是相对于该元素的font-size

> vw/vh

全称是 Viewport Width 和 Viewport Height，视窗的宽度和高度，相当于 屏幕宽度和高度的 1%，不过，处理宽度的时候%单位更合适，处理高度的 话 vh 单位更好。

> px

px像素（Pixel）。相对长度单位。像素px是相对于显示器屏幕分辨率而言的。

一般电脑的分辨率有{1920*1024}等不同的分辨率

1920*1024 前者是屏幕宽度总共有1920个像素,后者则是高度为1024个像素

## 画一条0.5px的直线？

> 考查的是css3的transform

```text
height: 1px;
transform: scale(0.5);
```

## 说一下盒模型？

> 盒模型是css中重要的基础知识，也是必考的基础知识

盒模型的组成，由里向外content,padding,border,margin.

在IE盒子模型中，width表示content+padding+border这三个部分的宽度

在标准的盒子模型中，width指content部分的宽度

box-sizing的使用

```text
  box-sizing: content-box 是W3C盒子模型
  box-sizing: border-box 是IE盒子模型
```

box-sizing的默认属性是content-box

## 画一个三角形？

> 这属于简单的css考查，平时在用组件库的同时，也别忘了原生的css

```text
 .a{
            width: 0;
            height: 0;
            border-width: 100px;
            border-style: solid;
            border-color: transparent #0099CC transparent transparent;
            transform: rotate(90deg); /*顺时针旋转90°*/
 }

<div class="a"></div>
```

## 清除浮动的几种方式，及原理？

> 清除浮动简单，但这题要引出的是BFC，BFC也是必考的基础知识点

- `::after / <br> / clear: both`
- 创建父级 `BFC`(overflow:hidden)
- 父级设置高度

> *BFC （*块级格式化上下文*）*，是一个独立的渲染区域，让处于 `BFC` 内部的元素与外部的元素相互隔离，使内外元素的定位不会相互影响。

*触发条件:*

- 根元素
- `position: absolute/fixed`
- `display: inline-block / table`
- `float` 元素
- `ovevflow !== visible`

*规则:*

- 属于同一个 `BFC` 的两个相邻 `Box` 垂直排列
- 属于同一个 `BFC` 的两个相邻 `Box` 的 `margin` 会发生重叠
- `BFC` 的区域不会与 `float` 的元素区域重叠
- 计算 `BFC` 的高度时，浮动子元素也参与计算
- 文字层不会被浮动层覆盖，环绕于周围

## html

## 说一下<label>标签的用法

label标签主要是方便鼠标点击使用，扩大可点击的范围，增强用户操作体验

## 遍历A节点的父节点下的所有子节点

> 这题考查原生的js操作dom,属于非常简单的基础题，但长时间使用mvvm框架，可能会忘记

```text
<script>
    var b=document.getElementById("a").parentNode.children;
    console.log(b)
</script>
```

## js

## 用js递归的方式写1到100求和？

> 递归我们经常用到，vue在实现双向绑定进行数据检验的时候用的也是递归，但要我们面试的时候手写一个递归，如果对递归的概念理解不透彻，可能还是会有一些问题。

```text
function add(num1,num2){
	var num = num1+num2;
        if(num2+1>100){
	 return num;
	}else{
	  return add(num,num2+1)
        }
 }
var sum =add(1,2);                 
```

## 页面渲染html的过程？

> 不需要死记硬背，理解整个过程即可

浏览器渲染页面的一般过程：

1.浏览器解析html源码，然后创建一个 DOM树。并行请求 css/image/js在DOM树中，每一个HTML标签都有一个对应的节点，并且每一个文本也都会有一个对应的文本节点。DOM树的根节点就是 documentElement，对应的是html标签。

2.浏览器解析CSS代码，计算出最终的样式数据。构建CSSOM树。对CSS代码中非法的语法它会直接忽略掉。解析CSS的时候会按照如下顺序来定义优先级：浏览器默认设置 < 用户设置 < 外链样式 < 内联样式 < html中的style。

3.DOM Tree + CSSOM --> 渲染树（rendering tree）。渲染树和DOM树有点像，但是是有区别的。

DOM树完全和html标签一一对应，但是渲染树会忽略掉不需要渲染的元素，比如head、display:none的元素等。而且一大段文本中的每一个行在渲染树中都是独立的一个节点。渲染树中的每一个节点都存储有对应的css属性。

4.一旦渲染树创建好了，浏览器就可以根据渲染树直接把页面绘制到屏幕上。

以上四个步骤并不是一次性顺序完成的。如果DOM或者CSSOM被修改，以上过程会被重复执行。实际上，CSS和JavaScript往往会多次修改DOM或者CSSOM。

## 说一下CORS？

CORS是一种新标准，支持同源通信，也支持跨域通信。fetch是实现CORS通信的

## 如何中断ajax请求？

一种是设置超时时间让ajax自动断开，另一种是手动停止ajax请求，其核心是调用XML对象的abort方法，ajax.abort()

## 说一下事件代理？

事件委托是指将事件绑定到目标元素的父元素上，利用冒泡机制触发该事件

```text
ulEl.addEventListener('click', function(e){
    var target = event.target || event.srcElement;
    if(!!target && target.nodeName.toUpperCase() === "LI"){
        console.log(target.innerHTML);
    }
}, false);
```

## target、currentTarget的区别？

currentTarget当前所绑定事件的元素

target当前被点击的元素

## 说一下宏任务和微任务？

1. 宏任务：当前调用栈中执行的任务称为宏任务。（主代码快，定时器等等）。
2. 微任务： 当前（此次事件循环中）宏任务执行完，在下一个宏任务开始之前需要执行的任务为微任务。（可以理解为回调事件，promise.then，proness.nextTick等等）。
3. 宏任务中的事件放在callback queue中，由事件触发线程维护；微任务的事件放在微任务队列中，由js引擎线程维护。

## 说一下继承的几种方式及优缺点？

> 说比较经典的几种继承方式并比较优缺点就可以了

1. 借用构造函数继承，使用call或apply方法，将父对象的构造函数绑定在子对象上
2. 原型继承，将子对象的prototype指向父对象的一个实例
3. 组合继承

原型链继承的缺点

- 字面量重写原型会中断关系，使用引用类型的原型，并且子类型还无法给超类型传递参数。

借用构造函数（类式继承）

- 借用构造函数虽然解决了刚才两种问题，但没有原型，则复用无从谈起。

组合式继承

- 组合式继承是比较常用的一种继承方法，其背后的思路是使用原型链实现对原型属性和方法的继承，而通过借用构造函数来实现对实例属性的继承。这样，既通过在原型上定义方法实现了函数复用，又保证每个实例都有它自己的属性。

## 说一下闭包？

闭包的实质是因为函数嵌套而形成的作用域链

闭包的定义即：函数 `A` 内部有一个函数 `B`，函数 `B` 可以访问到函数 `A` 中的变量，那么函数 `B` 就是闭包

## export和export default的区别？

使用上的不同

```text
export default  xxx
import xxx from './'

export xxx
import {xxx} from './'
```

## 说一下自己常用的es6的功能？

> 此题是一道开放题，可以自由回答。但要注意像let这种简单的用法就别说了，说一些经常用到并有一定高度的新功能

像module、class、promise等，尽量讲的详细一点。

## 什么是会话cookie,什么是持久cookie?

cookie是服务器返回的，指定了expire time（有效期）的是持久cookie,没有指定的是会话cookie

## 数组去重？

> 此题看着简单，但要想面试官给你高分还是有难度的。至少也要写出几种方法

js

```text
var arr=['12','32','89','12','12','78','12','32'];
    // 最简单数组去重法
    function unique1(array){
        var n = []; //一个新的临时数组
        for(var i = 0; i < array.length; i++){ //遍历当前数组
            if (n.indexOf(array[i]) == -1)
                n.push(array[i]);
        }
        return n;
    }
    arr=unique1(arr);
    // 速度最快， 占空间最多（空间换时间）
    function unique2(array){
        var n = {}, r = [], type;
        for (var i = 0; i < array.length; i++) {
            type = typeof array[i];
            if (!n[array[i]]) {
                n[array[i]] = [type];
                r.push(array[i]);
            } else if (n[array[i]].indexOf(type) < 0) {
                n[array[i]].push(type);
                r.push(array[i]);
            }
        }
        return r;
    }
    //数组下标判断法
    function unique3(array){
        var n = [array[0]]; //结果数组
        for(var i = 1; i < array.length; i++) { //从第二项开始遍历
            if (array.indexOf(array[i]) == i) 
                n.push(array[i]);
        }
        return n;
    }
```

es6

```text
es6方法数组去重
arr=[...new Set(arr)];
es6方法数组去重，第二种方法
function dedupe(array) {
  return Array.from(new Set(array));       //Array.from()能把set结构转换为数组
}
```

## get、post的区别

> 此题比较简单，但一定要回答的全面

1.get传参方式是通过地址栏URL传递，是可以直接看到get传递的参数，post传参方式参数URL不可见，get把请求的数据在URL后通过？连接，通过&进行参数分割。psot将参数存放在HTTP的包体内

2.get传递数据是通过URL进行传递，对传递的数据长度是受到URL大小的限制，URL最大长度是2048个字符。post没有长度限制

3.get后退不会有影响，post后退会重新进行提交

4.get请求可以被缓存，post不可以被缓存

5.get请求只URL编码，post支持多种编码方式

6.get请求的记录会留在历史记录中，post请求不会留在历史记录

7.get只支持ASCII字符，post没有字符类型限制

## 你所知道的http的响应码及含义？

> 此题有过开发经验的都知道几个，但还是那句话，一定要回答的详细且全面。

1xx(临时响应)

100: 请求者应当继续提出请求。

101(切换协议) 请求者已要求服务器切换协议，服务器已确认并准备进行切换。

2xx(成功)

200：正确的请求返回正确的结果

201：表示资源被正确的创建。比如说，我们 POST 用户名、密码正确创建了一个用户就可以返回 201。

202：请求是正确的，但是结果正在处理中，这时候客户端可以通过轮询等机制继续请求。

3xx(已重定向)

300：请求成功，但结果有多种选择。

301：请求成功，但是资源被永久转移。

303：使用 GET 来访问新的地址来获取资源。

304：请求的资源并没有被修改过

4xx(请求错误)

400：请求出现错误，比如请求头不对等。

401：没有提供认证信息。请求的时候没有带上 Token 等。

402：为以后需要所保留的状态码。

403：请求的资源不允许访问。就是说没有权限。

404：请求的内容不存在。

5xx(服务器错误)

500：服务器错误。

501：请求还没有被实现。



## 原型链的解释

饿了么面试的时候问到了，用友也问到了。没答好，GG.
![这里写图片描述](https://img-blog.csdnimg.cn/img_convert/ea9c1abcded46dd4f765dfbb54f41200.png)

## 基本的数据类型

5个简单数据类型（基本数据类型）+ 1个复杂数据类型
undefiend, number string null boolean + object
ES6 新增Symbol

## 对前端路由的理解？前后端路由的区别？

前端的路由和后端的路由在实现技术上不一样，但是原理都是一样的。在 HTML5 的 history API 出现之前，前端的路由都是通过 hash 来实现的，hash 能兼容低版本的浏览器。

```php
http://10.0.0.1/
http://10.0.0.1/#/about
http://10.0.0.1/#/concat
123
```

**服务端路由**：每跳转到不同的URL，都是重新访问服务端，然后服务端返回页面，页面也可以是服务端获取数据，然后和模板组合，返回HTML，也可以是直接返回模板HTML，然后由前端JS再去请求数据，使用前端模板和数据进行组合，生成想要的HTML。

**前端路由**：每跳转到不同的URL都是使用前端的锚点路由，实际上只是JS根据URL来操作DOM元素，根据每个页面需要的去服务端请求数据，返回数据后和模板进行组合，当然模板有可能是请求服务端返回的，这就是 SPA 单页程序。



### 什么是SPA



### 介绍下WebPakc



### Promise



## 解释一下call函数和apply函数的作用，以及用法

改变this的指向。
this的指向问题，在你不知道的js这本书中（神书）做了四点归纳：
1.默认绑定 （指 直接调用 foo(), this指向window）
2.隐式绑定（obj.foo(), this指向obj 这里会出现很多坑，下面的问题应该会有解答）
3.显示绑定（利用call、apply、bind改变this）
4.new（var cat = new Animal() , this指向cat对象）





### 

# 前端面试题300道

1、手写jsonp的实现

> 参考自： http://www.qdfuns.com/notes/16738/1b6ad6125747d28592a53a960b44c6f4.html

先说说JSONP是怎么产生的：

其实网上关于JSONP的讲解有很多，但却千篇一律，而且云里雾里，对于很多刚接触的人来讲理解起来有些困难，着用自己的方式来阐释一下这个问题，看看是否有帮助。

1、一个众所周知的问题，Ajax直接请求普通文件存在跨域无权限访问的问题，甭管你是静态页面、动态网页、web服务、WCF，只要是跨域请求，一律不准。

2、不过我们又发现，Web页面上调用js文件时则不受是否跨域的影响（不仅如此，我们还发现凡是拥有"src"这个属性的标签都拥有跨域的能力，比如script、img、iframe）。

3、于是可以判断，当前阶段如果想通过纯web端（ActiveX控件、服务端代理、属于未来的HTML5之Websocket等方式不算）跨域访问数据就只有一种可能，那就是在远程服务器上设法把数据装进js格式的文件里，供客户端调用和进一步处理。

4、恰巧我们已经知道有一种叫做JSON的纯字符数据格式可以简洁的描述复杂数据，更妙的是JSON还被js原生支持，所以在客户端几乎可以随心所欲的处理这种格式的数据。

5、这样子解决方案就呼之欲出了，web客户端通过与调用脚本一模一样的方式，来调用跨域服务器上动态生成的js格式文件（一般以JSON为后缀），显而易见，服务器之所以要动态生成JSON文件，目的就在于把客户端需要的数据装入进去。

6、客户端在对JSON文件调用成功之后，也就获得了自己所需的数据，剩下的就是按照自己需求进行处理和展现了，这种获取远程数据的方式看起来非常像AJAX，但其实并不一样。

7、为了便于客户端使用数据，逐渐形成了一种非正式传输协议，人们把它称作JSONP，该协议的一个要点就是允许用户传递一个callback参数给服务端，然后服务端返回数据时会将这个callback参数作为函数名来包裹住JSON数据，这样客户端就可以随意定制自己的函数来自动处理返回数据了。

**JSONP的客户端具体实现：**
1、我们知道，哪怕跨域js文件中的代码（当然指符合web脚本安全策略的），web页面也是可以无条件执行的。
远程服务器remoteserver.com根目录下有个remote.js文件代码如下：

```html
alert('我是远程文件');
1
```

本地服务器localserver.com下有个jsonp.html页面代码如下：

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title></title>
    <script type="text/javascript" src="http://remoteserver.com/remote.js"></script>
</head>
<body>

</body>
</html>
12345678910
```

毫无疑问，页面将会弹出一个提示窗体，显示跨域调用成功。

2、现在我们在jsonp.html页面定义一个函数，然后在远程remote.js中传入数据进行调用。

jsonp.html页面代码如下：

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title></title>
    <script type="text/javascript">
    var localHandler = function(data){
        alert('我是本地函数，可以被跨域的remote.js文件调用，远程js带来的数据是：' + data.result);
    };
    </script>
    <script type="text/javascript" src="http://remoteserver.com/remote.js"></script>
</head>
<body>

</body>
</html>
123456789101112131415
```

remote.js文件代码如下：

```javascript
localHandler({"result":"我是远程js带来的数据"});
1
```

运行之后查看结果，页面成功弹出提示窗口，显示本地函数被跨域的远程js调用成功，并且还接收到了远程js带来的数据。
很欣喜，跨域远程获取数据的目的基本实现了，但是又一个问题出现了，我怎么让远程js知道它应该调用的本地函数叫什么名字呢？毕竟是jsonp的服务者都要面对很多服务对象，而这些服务对象各自的本地函数都不相同啊？我们接着往下看。

3、聪明的开发者很容易想到，只要服务端提供的js脚本是动态生成的就行了呗，这样调用者可以传一个参数过去告诉服务端 “我想要一段调用XXX函数的js代码，请你返回给我”，于是服务器就可以按照客户端的需求来生成js脚本并响应了。

看jsonp.html页面的代码：

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title></title>
    <script type="text/javascript">
    // 得到航班信息查询结果后的回调函数
    var flightHandler = function(data){
        alert('你查询的航班结果是：票价 ' + data.price + ' 元，' + '余票 ' + data.tickets + ' 张。');
    };
    // 提供jsonp服务的url地址（不管是什么类型的地址，最终生成的返回值都是一段javascript代码）
    var url = "http://flightQuery.com/jsonp/flightResult.aspx?code=CA1998&callback=flightHandler";
    // 创建script标签，设置其属性
    var script = document.createElement('script');
    script.setAttribute('src', url);
    // 把script标签加入head，此时调用开始
    document.getElementsByTagName('head')[0].appendChild(script); 
    </script>
</head>
<body>
</body>
</html>
123456789101112131415161718192021
```

这次的代码变化比较大，不再直接把远程js文件写死，而是编码实现动态查询，而这也正是jsonp客户端实现的核心部分，本例中的重点也就在于如何完成jsonp调用的全过程。
我们看到调用的url中传递了一个code参数，告诉服务器我要查的是CA1998次航班的信息，而callback参数则告诉服务器，我的本地回调函数叫做flightHandler，所以请把查询结果传入这个函数中进行调用。
OK，服务器很聪明，这个叫做flightResult.aspx的页面生成了一段这样的代码提供给jsonp.html

（服务端的实现这里就不演示了，与你选用的语言无关，说到底就是拼接字符串）：
HTML 代码

```html
flightHandler({
    "code": "CA1998",
    "price": 1780,
    "tickets": 5
});
12345
```

我们看到，传递给flightHandler函数的是一个json，它描述了航班的基本信息。运行一下页面，成功弹出提示窗口，jsonp的执行全过程顺利完成！

4、到这里为止的话，相信你已经能够理解jsonp的客户端实现原理了吧？剩下的就是如何把代码封装一下，以便于与用户界面交互，从而实现多次和重复调用。

**jQuery如何实现jsonp调用？**

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
     <title>Untitled Page</title>
      <script type="text/javascript" src=jquery.min.js"></script>
      <script type="text/javascript">
     jQuery(document).ready(function(){ 
        $.ajax({
             type: "get",
             async: false,
             url: "http://flightQuery.com/jsonp/flightResult.aspx?code=CA1998",
             dataType: "jsonp",
             jsonp: "callback",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
             jsonpCallback:"flightHandler",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
             success: function(json){
                 alert('您查询到航班信息：票价： ' + json.price + ' 元，余票： ' + json.tickets + ' 张。');
             },
             error: function(){
                 alert('fail');
             }
         });
     });
     </script>
     </head>
  <body>
  </body>
</html>
123456789101112131415161718192021222324252627
```

**这里针对ajax与jsonp的异同再做一些补充说明：**

1、ajax和jsonp这两种技术在调用方式上"看起来"很像，目的也一样，都是请求一个url，然后把服务器返回的数据进行处理，因此jquery和ext等框架都把jsonp作为ajax的一种形式进行了封装。

2、但ajax和jsonp其实本质上是不同的东西。ajax的核心是通过XmlHttpRequest获取非本页内容，而jsonp的核心则是动态添加script标签来调用服务器提供的js脚本。

3、所以说，其实ajax与jsonp的区别不在于是否跨域，ajax通过服务端代理一样可以实现跨域，jsonp本身也不排斥同域的数据的获取。

4、还有就是，jsonp是一种方式或者说非强制性协议，如同ajax一样，它也不一定非要用json格式来传递数据，如果你愿意，字符串都行，只不过这样不利于用jsonp提供公开服务。

总而言之，jsonp不是ajax的一个特例，哪怕jquery等巨头把jsonp封装进了ajax，也不能改变这一点！

2、手写单链表查找倒数第k个节点

1、为了找出倒数第k个元素，最容易想到的办法是首先遍历一遍单链表，求出整个单链表的长度n，然后将倒数第k个，转换为正数第n-k个，接下来遍历一次就可以得到结果。但是该方法存在一个问题，即需要对链表进行两次遍历，第一次遍历用于求解单链表的长度，第二次遍历用于查找正数第n-k个元素。
这种思路的时间复杂度是O(n)，但需要遍历链表两次。

2、如果我们在遍历时维持两个指针，第一个指针从链表的头指针开始遍历，在第k-1步之前，第二个指针保持不动；在第k-1步开始，第二个指针也开始从链表的头指针开始遍历。由于两个指针的距离保持在k-1，当第一个（走在前面的）指针到达链表的尾结点时，第二个指针（走在后面的）指针正好是倒数第k个结点。这种思路只需要遍历链表一次。对于很长的链表，只需要把每个结点从硬盘导入到内存一次。因此这一方法的时间效率前面的方法要高。

```java
class Node{
	Node next=null;
	int data;
	public Node(int data){
		this.data=data;
	}
}
public class MyLinkedList {

	Node head=null;//链表头的引用
	public Node findElem(Node head,int k){
		if(k<1||k>this.length()){
			return null;
		}
		Node p1=head;
		Node p2=head;
		for(int i=0;i<k;i++)
			p1=p1.next;
		while(p1!=null){
			p1=p1.next;
			p2=p2.next;
		}
		return p2;
	}
	public static void main(String[] args) {
		
		MyLinkedList list=new MyLinkedList();
		list.addNode(1);
		list.addNode(2);
		list.addNode(3);
		list.addNode(4);
		list.addNode(5);
		MyLinkedList p=new MyLinkedList();
		p.head=list.findElem(list.head, 3);
		p.printList();
		
	}

}
123456789101112131415161718192021222324252627282930313233343536373839
```

3、http请求头，请求体，cookie在哪个里面？url在哪里面？

参考菜鸟教程HTTP专栏：http://www.runoob.com/http/http-tutorial.html
人人三面的时候问我http请求头都有哪些值，答不上来。。GG
**客户端请求消息**
![这里写图片描述](https://img-blog.csdnimg.cn/img_convert/63dca58672cbe4e19aed36f4050d359a.png)
**服务器响应消息**
HTTP响应也由四个部分组成，分别是：状态行、消息报头、空行和响应正文。
![这里写图片描述](https://img-blog.csdnimg.cn/img_convert/8587230d66bfd9cca10a2f7bdc3568eb.png)

实例
下面实例是一点典型的使用GET来传递数据的实例：
客户端请求：

```c
GET /hello.txt HTTP/1.1
User-Agent: curl/7.16.3 libcurl/7.16.3 OpenSSL/0.9.7l zlib/1.2.3
Host: www.example.com
Accept-Language: en, mi
1234
```

服务端响应:

```java
HTTP/1.1 200 OK
Date: Mon, 27 Jul 2009 12:28:53 GMT
Server: Apache
Last-Modified: Wed, 22 Jul 2009 19:15:56 GMT
ETag: "34aa387-d-1568eb00"
Accept-Ranges: bytes
Content-Length: 51
Vary: Accept-Encoding
Content-Type: text/plain
123456789
```

输出结果：

```java
Hello World! My payload includes a trailing CRLF.
1
```

4、原型链的解释

饿了么面试的时候问到了，用友也问到了。没答好，GG.
![这里写图片描述](https://img-blog.csdnimg.cn/img_convert/ea9c1abcded46dd4f765dfbb54f41200.png)

5、对闭包的理解，实现一个暴露内部变量，而且外部可以访问修改的函数

闭包的作用：
匿名自执行函数、缓存、实现封装（主要作用）、实现面向对象中的对象

```php
var person = function(){    
    //变量作用域为函数内部，外部无法访问    
    var name = "default";       
    return {    
       getName : function(){    
           return name;    
       },    
       setName : function(newName){    
           name = newName;    
       }    
    }    
}();    
print(person.name);//直接访问，结果为undefined    
print(person.getName());    
person.setName("a");    
print(person.getName());    
//得到结果如下：  
undefined  
default  
a
1234567891011121314151617181920
```

6、基本的数据类型

5个简单数据类型（基本数据类型）+ 1个复杂数据类型
undefiend, number string null boolean + object
ES6 新增Symbol

7、基本的两列自适应布局

左定右适应：

```php
#div1{
	width: 100px;
	display: inline-block;
	background-color: black;
}
#div2{
	display: inline-block;
	position: absolute;
	left: 100px;
	right: 0px;
	background-color: red;
}
123456789101112
```

8、unix中常用的命令行

虽然上过linux课，但是命令忘得差不多了 尴尬。。。

9、OSI模型，HTTP,TCP,UDP分别在哪些层

这个可以参考我另一个博客：
http://blog.csdn.net/qq_22944825/article/details/78160659
OSI：物理层-数据链路层-网络层-传输层-会话层-表现层-应用层
![这里写图片描述](https://img-blog.csdnimg.cn/img_convert/23beadd5dd3f48a1a64da9c9ccffd082.bmp)

10、解释平衡二叉树，以及在数据结构中的应用（红黑树）

11、快排的时间复杂度和空间复杂度

一个特别好的总结的博客：

12、手写一个jQuery插件

1、$.extend(src)
　　该方法就是将src合并到jquery的全局对象中去，如：

```php
 $.extend({
	  hello:function(){alert('hello');}
	  });
123
```

2、$.fn.extend(src)
　　该方法将src合并到jquery的实例对象中去，如:

```java
 $.fn.extend({
  hello:function(){alert('hello');}
 });
123
```

13、在jquery方法和原型上面添加方法的区别和实现，以及jquery对象的实现

参考上一个问题答案~

使用jquery的第一件事就是要使用jquery对象，jquery对象和javascript中的DOM对象是不同的。

什么是jquery对象？jquery将一个DOM对象转化为jquery对象后就可以使用jquery类库提供的各种函数。可以将jquery对象理解为一个类，并且封装了很多的方法，而且可以动态的通过加载插件扩展这个类，类似于C#中的分布类partial class。

除了jQuery工具函数，jQuery的操作都是从jQuery对象开始。比如：

```php
	attr(key,value)
	
	<img id="myphoto" alt="my photo" src=""/>
	
	$("#myphoto").attr("src","/pic/1.jpg");
12345
```

jQuery对象是一个特殊的集合对象。即使只有一个元素，jQuery对象仍然是一个集合。说其特殊是因为实际上jQuery对象是包含一个集合对象和各种函数的类。

14、手写一个递归函数

```php
 function fact(num) {
	if (num <= 1) {
		return 1;             
	} else {
		return num * fact(num - 1);            
	}
} 
1234567
```

以下代码可导致出错：

```java
var anotherFact = fact; 
 fact = null; 
 alert(antherFact(4)); //出错 
123
```

由于fact已经不是函数了，所以出错。
用arguments.callee可解决问题，这是一个指向正在执行的函数的指针,**arguments.callee**返回正在被执行的对现象。
新的函数为：

```php
function fact(num) {
            if (num <= 1) {
                return 1;
            } else {
                return num * arguments.callee(num - 1); //此处更改了。 
            }
}
var anotherFact = fact;
fact = null;
alert(antherFact(4)); //结果为24.
12345678910
```

15、对前端路由的理解？前后端路由的区别？

前端的路由和后端的路由在实现技术上不一样，但是原理都是一样的。在 HTML5 的 history API 出现之前，前端的路由都是通过 hash 来实现的，hash 能兼容低版本的浏览器。

```php
http://10.0.0.1/
http://10.0.0.1/#/about
http://10.0.0.1/#/concat
123
```

**服务端路由**：每跳转到不同的URL，都是重新访问服务端，然后服务端返回页面，页面也可以是服务端获取数据，然后和模板组合，返回HTML，也可以是直接返回模板HTML，然后由前端JS再去请求数据，使用前端模板和数据进行组合，生成想要的HTML。

**前端路由**：每跳转到不同的URL都是使用前端的锚点路由，实际上只是JS根据URL来操作DOM元素，根据每个页面需要的去服务端请求数据，返回数据后和模板进行组合，当然模板有可能是请求服务端返回的，这就是 SPA 单页程序。

在js可以通过window.location.hash读取到路径加以解析之后就可以响应不同路径的逻辑处理。

history 是 HTML5 才有的新 API，可以用来操作浏览器的 session history (会话历史)。基于 history 来实现的路由可以和最初的例子中提到的路径规则一样。

H5还新增了一个hashchange事件，也是很有用途的一个新事件：

当页面hash(#)变化时，即会触发hashchange。锚点Hash起到引导浏览器将这次记录推入历史记录栈顶的作用，window.location对象处理“#”的改变并不会重新加载页面，而是将之当成新页面，放入历史栈里。并且，当前进或者后退或者触发hashchange事件时，我们可以在对应的事件处理函数中注册ajax等操作！
但是hashchange这个事件不是每个浏览器都有，低级浏览器需要用轮询检测URL是否在变化，来检测锚点的变化。当锚点内容(location.hash)被操作时，如果锚点内容发生改变浏览器才会将其放入历史栈中，如果锚点内容没发生变化，历史栈并不会增加，并且也不会触发hashchange事件。

16、介绍一下webpack和gulp，以及项目中具体的使用

17、你对es6的了解

参见阮大大的博客
http://es6.ruanyifeng.com/

18、解释一下vue和react，以及异同点

异同点：vue官网给过答案
https://cn.vuejs.org/v2/guide/comparison.html

只简单的用过vue，用vue写了一个日程表，请赐教哦~

https://yyywwwqqq.coding.me/schedule/dist/

源码地址：
https://coding.net/u/yyywwwqqq/p/schedule/git

19、关于平衡二叉树

平衡二叉搜索树（Self-balancing binary search tree）又被称为AVL树（有别于AVL算法），且具有以下性质：它是一 棵空树或它的左右两个子树的高度差的绝对值不超过1，并且左右两个子树都是一棵平衡二叉树，同时，平衡二叉树必定是二叉搜索树，反之则不一定。平衡二叉树的常用实现方法有红黑树、AVL、替罪羊树、Treap、伸展树等。 最小二叉平衡树的节点的公式如下 F(n)=F(n-1)+F(n-2)+1 这个类似于一个递归的数列，可以参考Fibonacci(斐波那契)数列，1是根节点，F(n-1)是左子树的节点数量，F(n-2)是右子树的节点数量。

20、前后端分离的意义以及对前端工程化的理解

21、使用css实现一个三角形

利用border去画~
先看一下border的布局，如图：
![这里写图片描述](https://img-blog.csdnimg.cn/img_convert/cd2552f83b513e0c8545da0254f61e92.png)
所以三角形：
1.设置宽度、高度为0
![这里写图片描述](https://img-blog.csdnimg.cn/img_convert/dd3582ca0859fb5ad686d5ab3820356c.png)
2.不设置border-top
![这里写图片描述](https://img-blog.csdnimg.cn/img_convert/4b1100a1157e21ee75151bc5b573675b.png)
3.设置左右border颜色为transparent–透明
![这里写图片描述](https://img-blog.csdnimg.cn/img_convert/5325faa8744c3b2f4f99c00ec5398cd3.png)

22、用promise手写ajax

```php
function getJson(url){
    return new Promise((resolve, reject) =>{
        var xhr = new XMLHttpRequest();
        xhr.open('open', url, true);
        xhr.onreadystatechange = function(){
            if(this.readyState == 4){
                if(this.status = 200){
                    resolve(this.responseText, this)
                }else{
                    var resJson = { code: this.status, response: this.response }
                    reject(resJson, this)    
                }
            }
        }
        xhr.send()
    })
}

function postJSON(url, data) {
    return new Promise( (resolve, reject) => {
        var xhr = new XMLHttpRequest()
        xhr.open("POST", url, true)
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        xhr.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    resolve(JSON.parse(this.responseText), this)
                } else {
                    var resJson = { code: this.status, response: this.response }
                    reject(resJson, this)
                }
            }
        }

        xhr.send(JSON.stringify(data))
    })
}

getJSON('/api/v1/xxx')    // => 这里面是就try
.catch( error => {
  // dosomething          // => 这里就是catch到了error，如果处理error以及返还合适的值
})
.then( value => {
  // dosomething          // 这里就是final
})
12345678910111213141516171819202122232425262728293031323334353637383940414243444546
```

23、手写一个类的继承，并解释一下

继承的形式有很多中，js高程里面归纳了其中，我简单说一下前三种。
1.原型继承

```php
function Parent(){
	this.name = "parent";
}
Parent.prototype.getName = function(){
	return this.name;
}

function Child(){
	this.name = "child";
}

//继承parent
Child.prototype = new Parent();
12345678910111213
```

2.构造函数继承

```java
function Animal(name){
	this.name = name;
	this.eat = function(){
		consoel.log(this.name + "吃饭");
    }
}
var cat = new Animal("maomi");
cat.name;
cat.eat();
123456789
```

缺点是：
3.组合继承

24、解释一下call函数和apply函数的作用，以及用法

改变this的指向。
this的指向问题，在你不知道的js这本书中（神书）做了四点归纳：
1.默认绑定 （指 直接调用 foo(), this指向window）
2.隐式绑定（obj.foo(), this指向obj 这里会出现很多坑，下面的问题应该会有解答）
3.显示绑定（利用call、apply、bind改变this）
4.new（var cat = new Animal() , this指向cat对象）

25、你说自己抗压能力强，具体表现在哪里？

26、对前端前景的展望，以后前端会怎么发展

27、手写第一次面试没有写出来的链表问题，要求用es6写

28、平时是怎么学技术的？

29、平时大学里面时间是怎么规划的？

30、接下来有什么计划？这个学期和下个学期的计划是？

31、项目中遇到的难点，或者你学习路上的难点

32、你是通过什么方法和途径来学习前端的

33、手写一个简单遍历算法

34、解释一下react和vue，以及区别

35、你在团队中更倾向于什么角色？

36、对java的理解

37、介绍node.js，并且介绍你用它做的项目

38、手写一个js的深克隆

```php
function deepCopy(obj){
	//判断是否是简单数据类型，
	if(typeof obj == "object"){
		//复杂数据类型
		var result = obj.constructor == Array ? [] : {};
		for(let i in obj){
			result[i] = typeof obj[i] == "object" ? deepCopy(obj[i]) : obj[i];
		}
	}else {
		//简单数据类型 直接 == 赋值
		var result = obj;
	}
	return result;
}
1234567891011121314
```

39、for函数里面setTimeout异步问题

40、手写归并排序

<1>.长度为n(n>1),把该输入序列分成两个长度为n/2的子序列；
<2>.对这两个子序列分别采用归并排序，直到长度n小于2；
<3>.将两个排序好的子序列合并成一个最终的排序序列。

```php
function mergeSort(arr) { 
	var len = arr.length;
	if(len < 2) {
		return arr;
	} else {
		middle = Math.floor(len / 2);
		var left = arr.slice(0, middle);
		var right = arr.splice(middle);
		return merge(mergeSort(left), mergeSort(right));
	}

}

function merge(left, right) {
	var result = [];
	while(left.length && right.length) {
		left[0] > right[0] ? result.push(right.shift()): result.push(left.shift());
	}
	if(left.length) {
		result = result.concat(left);
	}
	if(right.length) {
		result = result.concat(right);
	}
	return result;
}
1234567891011121314151617181920212223242526
```

41、介绍自己的项目

略

42、实现两个排序数组的合并

参考42题中的merge函数。

43、手写一个原生ajax

ajax：一种请求数据的方式，不需要刷新整个页面；
ajax的技术核心是 XMLHttpRequest 对象；
ajax 请求过程：创建 XMLHttpRequest 对象、连接服务器、发送请求、接收响应数据；

一个在stackoverflow的高分回答结合上面的代码，给出get和post的两种不同请求方法：

```php
var ajax = {};
ajax.x = function () {
	if (typeof XMLHttpRequest !== 'undefined') {
		return new XMLHttpRequest();
	}
	var versions = [
	"MSXML2.XmlHttp.6.0",
	"MSXML2.XmlHttp.5.0",
	"MSXML2.XmlHttp.4.0",
	"MSXML2.XmlHttp.3.0",
	"MSXML2.XmlHttp.2.0",
	"Microsoft.XmlHttp"
	];

	var xhr;
	for (var i = 0; i < versions.length; i++) {
		try {
			xhr = new ActiveXObject(versions[i]);
			break;
		} catch (e) {
		}
	}
	return xhr;
};

ajax.send = function (url, method, data, success,fail,async) {
	if (async === undefined) {
		async = true;
	}
	var x = ajax.x();
	x.open(method, url, async);
	x.onreadystatechange = function () {
		if (x.readyState == 4) {
			var status = x.status;
			if (status >= 200 && status < 300) {
				success && success(x.responseText,x.responseXML)
			} else {
				fail && fail(status);
			}
			
		}
	};
	if (method == 'POST') {
		x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	}
	x.send(data)
};

ajax.get = function (url, data, callback, fail, async) {
	var query = [];
	for (var key in data) {
		query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
	}
	ajax.send(url + (query.length ? '?' + query.join('&') : ''), 'GET', null, success, fail, async)
};

ajax.post = function (url, data, callback, fail, async) {
	var query = [];
	for (var key in data) {
		query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
	}
	ajax.send(url,'POST', query.join('&'), success, fail, async)
};
123456789101112131415161718192021222324252627282930313233343536373839404142434445464748495051525354555657585960616263
```

使用方法：GET

```php
ajax.get('/test.php', {foo: 'bar'}, function(response,xml) {
	//success
},
function(status){
	//fail
});
123456
```

POST

```php
ajax.post('/test.php', {foo: 'bar'}, function(response,xml) {
	//succcess

},function(status){
	//fail
	
});
1234567
```

44、手写一个promise版的ajax

45、手写实现一个promise

46、手写实现requireJS模块实现

47、手写实现jquery里面的insertAfter

48、react和vue的介绍以及异同

49、AMD和CMD，commonJS的区别

50、介绍一下backbone

51、了解过SEO吗？

52、低版本浏览器不支持HTML5标签怎么解决？

53、用js使低版本浏览器支持HTML5标签 底层是怎么实现的？

54、实现一个布局：左边固定宽度为200，右边自适应，而且滚动条要自动选择只出现最高的那个

55、画出盒子模型，要使谷歌浏览器的盒子模型显示得跟IE浏览器一致（让谷歌跟ie一致，不是ie跟谷歌一致），该怎么做？

56、手写JS实现类继承，讲原型链原理，并解释new一个对象的过程都发生了什么

57、Array对象自带的方法，一一列举

58、若干个数字，怎么选出最大的五个

59、Array对象自带的排序函数底层是怎么实现的？

60、常用的排序算法有哪些，介绍一下选择排序

61、了解navigator对象吗？

62、手写一个正则表达式，验证邮箱

63、link和@import引入CSS的区别？

64、刚才说有些浏览器不兼容@import，具体指哪些浏览器？

65、介绍一下cookie,localstorage,sessionstorage,session

66、jquery绑定click的方法有几种

67、你的优点/竞争力

68、移动端适配问题

69、react的难点在哪里

70、做过css动画吗

71、如何优化网站

72、以后的规划

73、你做过最困难的事情是啥？

74、css3 html5新特性

75、闭包，ES6，跨域

76、问做过啥项目，用到什么技术，遇到什么困难

77、兼容性

78、盒子模型

79、Array的unshift() method的作用是什么？如何连接两个Array？如何在Array里移除一个元素？

80、用纸笔写一个Closure，任意形式和内容

81、知不知道Array-like Object？

82、如何用Native JavaScript来读写Cookie？

83、知不知道CSS Box-model？

84、如何做一个AJAX Request？

85、Cross-domain access有没有了解？

86、前端安全方面有没有了解？XSS和CSRF如何攻防？

87、HTTP Response的Header里面都有些啥？

88、知不知道HTTP2？

89、输入URL后发生了什么？

90、new operator实际上做了什么？

91、面向对象的属性有哪些？

92、做一个两栏布局，左边fixed width，右边responsive，用纸笔手写

93、讲一下AJAX Request

94、讲一下Cross-domain access

95、介绍一下做过的项目

96、问到了多个服务器怎么弄，架构之类的

97、angular的渲染流程

98、脏检查

99、nodejs的架构、优缺点、回调

100、css 盒模型

101、css 布局，左边定宽右边自适应

102、冒泡和捕获，事件流哪三个阶段？

103、实现事件代理

104、原型链

105、继承的两种方法

106、ajax，原生ajax的四个过程

107、闭包，简单说一个闭包的应用，然后闭包的主要作用是什么

108、css:两个块状元素上下的margin-top和margin-bottom会重叠。啥原因？怎么解决？

109、js：写一个递归。就是每隔5秒调用一个自身，一共100次

110、cookie和session有什么区别

111、网络分层结构

112、你的不足是什么？

113、做了那么多项目，有没有自己的归纳总结

114、工程怎么进行文件管理

115、less和sass掌握程度

116、Cookie 是否会被覆盖，localStorage是否会被覆盖

117、事件代理js实现

118、Css实现动画效果

119、Animation还有哪些其他属性

120、Css实现三列布局

121、Css实现保持长宽比1:1

122、Css实现两个自适应等宽元素中间空10个像素

123、requireJS的原理是什么

124、如何保持登录状态

125、浮动的原理以及如何清除浮动

126、Html的语义化

127、原生js添加class怎么添加，如果本身已经有class了，会不会覆盖，怎么保留？

128、Jsonp的原理。怎么去读取一个script里面的数据？

129、如果页面初始载入的时候把ajax请求返回的数据存在localStorage里面，然后每次调用的时候去localStorage里面取数，是否可行。

130、304是什么意思？有没有方法不请求不经过服务器直接使用缓存

131、http请求头有哪些字段

132、数组去除一个函数。用arr.splice。又问splice返回了什么？应该返回的是去除的元素。

133、js异步的方法（promise，generator，async）

134、Cookie跨域请求能不能带上

135、最近看什么开源项目？

136、commonJS和AMD

137、平时是怎么学习的？

138、为什么要用translate3d？

139、对象中key-value的value怎么再放一个对象？

140、Get和post的区别？

145、Post一个file的时候file放在哪的？

146、说说你对组件的理解

147、组件的html怎么进行管理

148、js的异步加载，promise的三种状态，ES7中的async用过么

149、静态属性怎么继承

150、js原型链的继承

151、jquery和zepto有什么区别

152、angular的双向绑定原理

153、angular和react的认识

154、MVVM是什么

155、移动端是指手机浏览器，还是native，还是hybrid

156、你用了移动端的什么库类和框架？

157、移动端要注意哪些？

158、适配有去考虑么，retina屏幕啊？

159、rem是什么？em是什么？如果上一层就是根root了，em和rem等价么？

160、怎么测试的？会自动化测试么？

161、你觉得你什么技术最擅长？

162、你平时有没有什么技术的沉淀？

163、单向链表怎么查找有没有环？

164、怎么得到一个页面的a标签？

165、怎么在页面里放置一个很简单的图标，不能用img和background-img？

166、正则表达式判断url

167、怎么去除字符串前后的空格

168、实现页面的局部刷新

169、绝对定位与相对定位的区别

170、js轮播实现思路

171、使用js画一个抛物线，抛物线上有个小球随着抛物线运动，有两个按钮能使小球继续运动停止运动

172、java五子棋，说下实现思路

173、如何让各种情况下的div居中(绝对定位的div,垂直居中,水平居中)？

174、display有哪些值？说明他们的作用

175、css定义的权重

176、requirejs实现原理

177、requirejs怎么防止重复加载

178、ES6里头的箭头函数的this对象与其他的有啥区别

179、tcp/udp区别

180、tcp三次握手过程

181、xss与csrf的原理与怎么防范

182、mysql与 MongoDB的区别

183、w3c事件与IE事件的区别

184、有没有上传过些什么npm模块

185、IE与W3C怎么阻止事件的冒泡

186、gulp底层实现原理

187、webpack底层实现原理

188、gulp与webpack区别

189、vuejs与angularjs的区别

190、vuex是用来做什么的

191、说下你知道的响应状态码

192、ajax的过程以及 readyState几个状态的含义

193、你除了前端之外还会些什么？

194、cookie与session的区别

195、一些关于php与java的问题

196、你觉得你哪个项目是你做的最好的

197、说说你在项目中遇到了哪些困难,是怎么解决的

198、前端优化你知道哪些

199、webpack是用来干嘛的

200、webpack与gulp的区别

201、es6与es7了解多少

202、说下你知道的响应状态码

203、看过哪些框架的源码

204、遇到过哪些浏览器兼容性问题

205、清除浮动有哪几种方式,分别说说

206、你知道有哪些跨域方式,分别说说

207、JavaScript有哪几种类型的值

208、使用 new操作符时具体是干了些什么

209、学习前端的方法以及途径

210、怎么实现两个大整数的相乘，说下思路

211、你学过数据结构没,说说你都了解些什么

212、你学过计算机操作系统没,说说你都了解些什么

213、你学过计算机组成原理没,说说你都了解些什么

214、你学过算法没,说说你都了解些什么

215、说下选择排序,冒泡排序的实现思路

216、用过哪些框架

217、让你设计一个前端css框架你怎么做

218、了解哪些设计模式说说看

219、说下你所了解的设计模式的优点

220、vue源码结构

221、状态码

222、浏览器缓存的区别

223、304与200读取缓存的区别

224、http请求头有哪些,说说看你了解哪些

225、js中this的作用

226、js中上下文是什么

227、js有哪些函数能改变上下文

228、你所了解的跨域的方法都说说看你了解的？

229、要是让你自己写一个js框架你会用到哪些设计模式

230、平常在项目中用到过哪些设计模式,说说看

231、一来给了张纸要求写js自定义事件

232、前端跨域的方法

233、call与apply的区别

234、h5有个api能定位你知道是哪个吗？

235、vue与angularjs中双向数据绑定是怎样实现的？

236、webpack怎样配置？

237、nodejs中的文件怎么读写？

238、link和@import有什么区别？

239、cookies，sessionStorage 和 localStorage 的区别

240、看过哪些前端的书？平时是怎么学习的

241、说下你所理解的mvc与mvvc

242、position有哪些值,说下各自的作用

243、写个从几个li中取下标的闭包代码

244、你的职业规划是怎么样的？

245、移动端性能优化

246、lazyload如何实现

247、点透问题

248、前端安全

249、原生js模板引擎

250、repaint和reflow区别

251、requirejs如何避免循环依赖？

252、实现布局：左边一张图片，右边一段文字（不是环绕）

253、window.onload和$(document).ready()的区别，浏览器加载转圈结束时哪个时间点？

254、form表单当前页面无刷新提交 target iframe

255、setTimeout和setInterval区别，如何互相实现？

256、如何避免多重回调—promise，promise简单描述一下，如何在外部进行resolve()

257、margin坍塌？水平方向会不会坍塌？

258、伪类和伪元素区别

259、vue如何实现父子组件通信，以及非父子组件通信

260、数组去重

261、使用flex布局实现三等分，左右两个元素分别贴到左边和右边，垂直居中

262、平时如何学前端的，看了哪些书，关注了哪些公众号

263、实现bind函数

264、数组和链表区别，分别适合什么数据结构

265、对mvc的理解

266、描述一个印象最深的项目，在其中担任的角色，解决什么问题

267、http状态码。。。401和403区别？

268、描述下二分查找

269、为什么选择前端，如何学习的，看了哪些书，《js高级程序设计》和《你不知道的js》有什么区别，看书，看博客，看公众号三者的时间是如何分配的？

270、如何评价BAT？

271、描述下在实习中做过的一个项目，解决了什么问题，在其中担任了什么角色？这个过程存在什么问题，有什么值得改进的地方？

272、如何看待加班，如果有个项目需要连续一个月加班，你怎么看？

273、遇到的压力最大的一件事是什么？如何解决的？

274、平时有什么爱好

275、自身有待改进的地方

276、n长的数组放入n+1个数，不能重复，找出那个缺失的数

277、手里有什么offer

278、你对于第一份工作最看重的三个方面是什么？

279、如何评价现在的前端？

280、用原生js实现复选框选择以及全选非全选功能

281、用4个颜色给一个六面体上色有多少种情况

282、amd和cmd区别

283、为什么选择前端，移动端性能优化

284、vue的特点？双向数据绑定是如何实现的

285、Object.defineProperty

286、算法题：数组去重，去除重复两次以上的元素，代码题：嵌套的ul-li结构，根据input中输入的内容，去除相应的li节点，且如果某个嵌套的ul下面的li都被移除，则该ul的父li节点也要被移除

287、页面加载过程

288、浏览器如何实现图片缓存



# Vue常见面试题-1

## 一、对于MVVM的理解？

MVVM 是 Model-View-ViewModel 的缩写。
**Model**代表数据模型，也可以在Model中定义数据修改和操作的业务逻辑。
**View** 代表UI 组件，它负责将数据模型转化成UI 展现出来。
**ViewModel** 监听模型数据的改变和控制视图行为、处理用户交互，简单理解就是一个同步View 和 Model的对象，连接Model和View。
在MVVM架构下，View 和 Model 之间并没有直接的联系，而是通过ViewModel进行交互，Model 和 ViewModel 之间的交互是双向的， 因此View 数据的变化会同步到Model中，而Model 数据的变化也会立即反应到View 上。
**ViewModel** 通过双向数据绑定把 View 层和 Model 层连接了起来，而View 和 Model 之间的同步工作完全是自动的，无需人为干涉，因此开发者只需关注业务逻辑，不需要手动操作DOM, 不需要关注数据状态的同步问题，复杂的数据状态维护完全由 MVVM 来统一管理。
![bg2015020110.png](https://segmentfault.com/img/bVCU4O)

## 二、Vue的生命周期

**beforeCreate**（创建前） 在数据观测和初始化事件还未开始
**created**（创建后） 完成数据观测，属性和方法的运算，初始化事件，$el属性还没有显示出来
**beforeMount**（载入前） 在挂载开始之前被调用，相关的render函数首次被调用。实例已完成以下的配置：编译模板，把data里面的数据和模板生成html。注意此时还没有挂载html到页面上。
**mounted**（载入后） 在el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用。实例已完成以下的配置：用上面编译好的html内容替换el属性指向的DOM对象。完成模板中的html渲染到html页面中。此过程中进行ajax交互。
**beforeUpdate**（更新前） 在数据更新之前调用，发生在虚拟DOM重新渲染和打补丁之前。可以在该钩子中进一步地更改状态，不会触发附加的重渲染过程。
**updated**（更新后） 在由于数据更改导致的虚拟DOM重新渲染和打补丁之后调用。调用时，组件DOM已经更新，所以可以执行依赖于DOM的操作。然而在大多数情况下，应该避免在此期间更改状态，因为这可能会导致更新无限循环。该钩子在服务器端渲染期间不被调用。
**beforeDestroy**（销毁前） 在实例销毁之前调用。实例仍然完全可用。
**destroyed**（销毁后） 在实例销毁之后调用。调用后，所有的事件监听器会被移除，所有的子实例也会被销毁。该钩子在服务器端渲染期间不被调用。
1.什么是vue生命周期？
答： Vue 实例从创建到销毁的过程，就是生命周期。从开始创建、初始化数据、编译模板、挂载Dom→渲染、更新→渲染、销毁等一系列过程，称之为 Vue 的生命周期。

2.vue生命周期的作用是什么？
答：它的生命周期中有多个事件钩子，让我们在控制整个Vue实例的过程时更容易形成好的逻辑。

3.vue生命周期总共有几个阶段？
答：它可以总共分为8个阶段：创建前/后, 载入前/后,更新前/后,销毁前/销毁后。

4.第一次页面加载会触发哪几个钩子？
答：会触发 下面这几个beforeCreate, created, beforeMount, mounted 。

5.DOM 渲染在 哪个周期中就已经完成？
答：DOM 渲染在 mounted 中就已经完成了。

## 三、 Vue实现数据双向绑定的原理：Object.defineProperty（）

vue实现数据双向绑定主要是：采**用数据劫持结合发布者-订阅者模式**的方式，通过**Object.defineProperty（）**来劫持各个属性的setter，getter，在数据变动时发布消息给订阅者，触发相应监听回调。当把一个普通 Javascript 对象传给 Vue 实例来作为它的 data 选项时，Vue 将遍历它的属性，用 Object.defineProperty 将它们转为 getter/setter。用户看不到 getter/setter，但是在内部它们让 Vue 追踪依赖，在属性被访问和修改时通知变化。

vue的数据双向绑定 将MVVM作为数据绑定的入口，整合Observer，Compile和Watcher三者，通过Observer来监听自己的model的数据变化，通过Compile来解析编译模板指令（vue中是用来解析 {{}}），最终利用watcher搭起observer和Compile之间的通信桥梁，达到数据变化 —>视图更新；视图交互变化（input）—>数据model变更双向绑定效果。

**js实现简单的双向绑定**

```
<body>
    <div id="app">
    <input type="text" id="txt">
    <p id="show"></p>
</div>
</body>
<script type="text/javascript">
    var obj = {}
    Object.defineProperty(obj, 'txt', {
        get: function () {
            return obj
        },
        set: function (newValue) {
            document.getElementById('txt').value = newValue
            document.getElementById('show').innerHTML = newValue
        }
    })
    document.addEventListener('keyup', function (e) {
        obj.txt = e.target.value
    })
</script>
```

## 四、Vue组件间的参数传递

**1.父组件与子组件传值**
父组件传给子组件：子组件通过props方法接受数据;
子组件传给父组件：$emit方法传递参数
**2.非父子组件间的数据传递，兄弟组件传值**
eventBus，就是创建一个事件中心，相当于中转站，可以用它来传递事件和接收事件。项目比较小时，用这个比较合适。（虽然也有不少人推荐直接用VUEX，具体来说看需求咯。技术只是手段，目的达到才是王道。）

## 五、Vue的路由实现：hash模式 和 history模式

**hash模式：**在浏览器中符号“#”，#以及#后面的字符称之为hash，用window.location.hash读取；
特点：hash虽然在URL中，但不被包括在HTTP请求中；用来指导浏览器动作，对服务端安全无用，hash不会重加载页面。
hash 模式下，仅 hash 符号之前的内容会被包含在请求中，如 [http://www.xxx.com](http://www.xxx.com/)，因此对于后端来说，即使没有做到对路由的全覆盖，也不会返回 404 错误。

**history模式：**history采用HTML5的新特性；且提供了两个新方法：pushState（），replaceState（）可以对浏览器历史记录栈进行修改，以及popState事件的监听到状态变更。
history 模式下，前端的 URL 必须和实际向后端发起请求的 URL 一致，如 http://www.xxx.com/items/id。后端如果缺少对 /items/id 的路由处理，将返回 404 错误。**Vue-Router 官网里如此描述：**“不过这种模式要玩好，还需要后台配置支持……所以呢，你要在服务端增加一个覆盖所有情况的候选资源：如果 URL 匹配不到任何静态资源，则应该返回同一个 index.html 页面，这个页面就是你 app 依赖的页面。”

## 六、Vue与Angular以及React的区别？

（版本在不断更新，以下的区别有可能不是很正确。我工作中只用到vue，对angular和react不怎么熟）
**1.与AngularJS的区别**
相同点：
都支持指令：内置指令和自定义指令；都支持过滤器：内置过滤器和自定义过滤器；都支持双向数据绑定；都不支持低端浏览器。

不同点：
AngularJS的学习成本高，比如增加了Dependency Injection特性，而Vue.js本身提供的API都比较简单、直观；在性能上，AngularJS依赖对数据做脏检查，所以Watcher越多越慢；Vue.js使用基于依赖追踪的观察并且使用异步队列更新，所有的数据都是独立触发的。

**2.与React的区别**
相同点：
React采用特殊的JSX语法，Vue.js在组件开发中也推崇编写.vue特殊文件格式，对文件内容都有一些约定，两者都需要编译后使用；中心思想相同：一切都是组件，组件实例之间可以嵌套；都提供合理的钩子函数，可以让开发者定制化地去处理需求；都不内置列数AJAX，Route等功能到核心包，而是以插件的方式加载；在组件开发中都支持mixins的特性。
不同点：
React采用的Virtual DOM会对渲染出来的结果做脏检查；Vue.js在模板中提供了指令，过滤器等，可以非常方便，快捷地操作Virtual DOM。

## 七、vue路由的钩子函数

首页可以控制导航跳转，beforeEach，afterEach等，一般用于页面title的修改。一些需要登录才能调整页面的重定向功能。

**beforeEach**主要有3个参数to，from，next：

**to**：route即将进入的目标路由对象，

**from**：route当前导航正要离开的路由

**next**：function一定要调用该方法resolve这个钩子。执行效果依赖next方法的调用参数。可以控制网页的跳转。

## 八、vuex是什么？怎么使用？哪种功能场景使用它？

只用来读取的状态集中放在store中； 改变状态的方式是提交mutations，这是个同步的事物； 异步逻辑应该封装在action中。
在main.js引入store，注入。新建了一个目录store，….. export 。
场景有：单页应用中，组件之间的状态、音乐播放、登录状态、加入购物车
![图片描述](https://segmentfault.com/img/bVOAAF)

**state**
Vuex 使用单一状态树,即每个应用将仅仅包含一个store 实例，但单一状态树和模块化并不冲突。存放的数据状态，不可以直接修改里面的数据。
**mutations**
mutations定义的方法动态修改Vuex 的 store 中的状态或数据。
**getters**
类似vue的计算属性，主要用来过滤一些数据。
**action**
actions可以理解为通过将mutations里面处里数据的方法变成可异步的处理数据的方法，简单的说就是异步操作数据。view 层通过 store.dispath 来分发 action。

```
const store = new Vuex.Store({ //store实例
      state: {
         count: 0
             },
      mutations: {                
         increment (state) {
          state.count++
         }
          },
      actions: { 
         increment (context) {
          context.commit('increment')
   }
 }
})
```

**modules**
项目特别复杂的时候，可以让每一个模块拥有自己的state、mutation、action、getters,使得结构非常清晰，方便管理。

```
const moduleA = {
  state: { ... },
  mutations: { ... },
  actions: { ... },
  getters: { ... }
 }
const moduleB = {
  state: { ... },
  mutations: { ... },
  actions: { ... }
 }

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
})
```

## 九、vue-cli如何新增自定义指令？

1.创建局部指令

```
var app = new Vue({
    el: '#app',
    data: {    
    },
    // 创建指令(可以多个)
    directives: {
        // 指令名称
        dir1: {
            inserted(el) {
                // 指令中第一个参数是当前使用指令的DOM
                console.log(el);
                console.log(arguments);
                // 对DOM进行操作
                el.style.width = '200px';
                el.style.height = '200px';
                el.style.background = '#000';
            }
        }
    }
})
```

2.全局指令

```
Vue.directive('dir2', {
    inserted(el) {
        console.log(el);
    }
})
```

3.指令的使用

```
<div id="app">
    <div v-dir1></div>
    <div v-dir2></div>
</div>
```

## 十、vue如何自定义一个过滤器？

html代码：

```
<div id="app">
     <input type="text" v-model="msg" />
     {{msg| capitalize }}
</div>
```

JS代码：

```
var vm=new Vue({
    el:"#app",
    data:{
        msg:''
    },
    filters: {
      capitalize: function (value) {
        if (!value) return ''
        value = value.toString()
        return value.charAt(0).toUpperCase() + value.slice(1)
      }
    }
})
```

全局定义过滤器

```
Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})
```

过滤器接收表达式的值 (msg) 作为第一个参数。capitalize 过滤器将会收到 msg的值作为第一个参数。

## 十一、对keep-alive 的了解？

**keep-alive**是 Vue 内置的一个组件，可以使被包含的组件保留状态，或避免重新渲染。
在vue 2.1.0 版本之后，keep-alive新加入了两个属性: include(包含的组件缓存) 与 exclude(排除的组件不缓存，优先级大于include) 。

使用方法

```
<keep-alive include='include_components' exclude='exclude_components'>
  <component>
    <!-- 该组件是否缓存取决于include和exclude属性 -->
  </component>
</keep-alive>
```

参数解释
include - 字符串或正则表达式，只有名称匹配的组件会被缓存
exclude - 字符串或正则表达式，任何名称匹配的组件都不会被缓存
include 和 exclude 的属性允许组件有条件地缓存。二者都可以用“，”分隔字符串、正则表达式、数组。当使用正则或者是数组时，要记得使用v-bind 。

使用示例

```
<!-- 逗号分隔字符串，只有组件a与b被缓存。 -->
<keep-alive include="a,b">
  <component></component>
</keep-alive>

<!-- 正则表达式 (需要使用 v-bind，符合匹配规则的都会被缓存) -->
<keep-alive :include="/a|b/">
  <component></component>
</keep-alive>

<!-- Array (需要使用 v-bind，被包含的都会被缓存) -->
<keep-alive :include="['a', 'b']">
  <component></component>
</keep-alive>
```

## 十二、一句话就能回答的面试题

**1.css只在当前组件起作用**
答：在style标签中写入**scoped**即可 例如：<style scoped></style>

**2.v-if 和 v-show 区别**
答：v-if按照条件是否渲染，v-show是display的block或none；

**3.`$route`和`$router`的区别**
答：`$route`是“路由信息对象”，包括path，params，hash，query，fullPath，matched，name等路由信息参数。而`$router`是“路由实例”对象包括了路由的跳转方法，钩子函数等。

**4.vue.js的两个核心是什么？**
答：数据驱动、组件系统

**5.vue几种常用的指令**
答：v-for 、 v-if 、v-bind、v-on、v-show、v-else

**6.vue常用的修饰符？**
答：.prevent: 提交事件不再重载页面；.stop: 阻止单击事件冒泡；.self: 当事件发生在该元素本身而不是子元素的时候会触发；.capture: 事件侦听，事件发生的时候会调用

**7.v-on 可以绑定多个方法吗？**
答：可以

**8.vue中 key 值的作用？**
答：当 Vue.js 用 v-for 正在更新已渲染过的元素列表时，它默认用“就地复用”策略。如果数据项的顺序被改变，Vue 将不会移动 DOM 元素来匹配数据项的顺序， 而是简单复用此处每个元素，并且确保它在特定索引下显示已被渲染过的每个元素。key的作用主要是为了高效的更新虚拟DOM。

**9.什么是vue的计算属性？**
答：在模板中放入太多的逻辑会让模板过重且难以维护，在需要对数据进行复杂处理，且可能多次使用的情况下，尽量采取计算属性的方式。好处：①使得数据处理结构清晰；②依赖于数据，数据更新，处理结果自动更新；③计算属性内部this指向vm实例；④在template调用时，直接写计算属性名即可；⑤常用的是getter方法，获取数据，也可以使用set方法改变数据；⑥相较于methods，不管依赖的数据变不变，methods都会重新计算，但是依赖数据不变的时候computed从缓存中获取，不会重新计算。

**10.vue等单页面应用及其优缺点**
答：优点：Vue 的目标是通过尽可能简单的 API 实现响应的数据绑定和组合的视图组件，核心是一个响应的数据绑定系统。MVVM、数据驱动、组件化、轻量、简洁、高效、快速、模块友好。
缺点：不支持低版本的浏览器，最低只支持到IE9；不利于SEO的优化（如果要支持SEO，建议通过服务端来进行渲染组件）；第一次加载首页耗时相对长一些；不可以使用浏览器的导航按钮需要自行实现前进、后退。

**11.怎么定义 vue-router 的动态路由? 怎么获取传过来的值**
答：在 router 目录下的 index.js 文件中，对 path 属性加上 /:id，使用 router 对象的 params.id 获取。



# Vue面试题-2

## 1.什么是vue的生命周期？

> Vue实例从创建到销毁的过程，就是生命周期。也就是从开始创建、初始化数据、编译模板、挂载DOM->渲染、更新->渲染、卸载等一系列过程，我们称这是Vue的生命周期。

## 2.vue生命周期的作用是什么？

> 它的生命周期中有多个事件钩子，让我们在控制整个vue实例的过程时更容易形成好的逻辑。

## 3.Vue生命周期总共有几个阶段？

> 它可以总共分为8个阶段：创建前/后,载入前/后，更新前/后，销毁前/销毁后

## 4.第一次页面加载会触发那几个钩子？

> 第一次页面加载时会触发beforeCreate,created,beforeMount,mounted

## 5.DOM渲染在哪个周期中就已经完成？

> DOM渲染在mounted中就已经完成了

## 6.生命周期钩子的一些使用方法：

```js
1.beforecreate:可以在加个loading事件，在加载实例是触发
2.created:初始化完成时的事件写在这里，如在这结束loading事件，异步请求也适宜在这里调用
3.mounted:挂载元素，获取到dom节点
4.updated:如果对数据统一处理，在这里写上相应函数
5.beforeDestroy:可以一个确认停止事件的确认框
6.nextTick:更新数据后立即操作dom
```

## **7.v-show与v-if的区别**

> v-show是css切换，v-if是完整的销毁和重新创建
> 使用频繁切换时用v-show,运行时较少改变时用v-if
> V-if=’false’v-if是条件渲染，当false的时候不会渲染
> 使用v-if的时候，如果值为false，那么页面将不会有这个html标签生成
> v-show则是不管值是为true还是false，html元素都会存在，只是css中的display显示或隐藏
> v-show 仅仅控制元素的显示方式，将 display 属性在 block 和 none 来回切换；而v-if会控制这个 DOM 节点的存在与否。当我们需要经常切换某个元素的显示/隐藏时，使用v-show会更加节省性能上的开销；当只需要一次显示或隐藏时，使用v-if更加合理。

## **8.开发中常用的指令有哪些?**

> v-model:一般用在表达输入，很轻松的实现表单控件和数据的双向绑定
> v-html：更新元素的innerHTML
> v-show与v-if：条件渲染，注意二者区别
> v-on:click:可以简写为@click,@绑定一个事件。如果事件触发了，就可以指定事件的处理函数
> v-for：基于源数据多次渲染元素或模板
> v-bind:当表达式的值改变时，将其产生的连带影响，响应式地作用于DOM语法
> v-bind:title=”msg”简写：title="msg"

## **9.绑定class的数组用法**

```js
1.对象方法v-bind:class="{'orange':isRipe, 'green':isNotRipe}”
2.数组方法v-bind:class="[class1,class2]"
3.行内v-bind:style="{color:color,fontSize:fontSize+'px'}”
```

## **10.路由跳转方式**

> 1.router-link标签会渲染为标签，咋填template中的跳转都是这种；
> 2.另一种是编辑是导航，也就是通过js跳转比如router.push('/home')

## **11.MVVM**

> M-model，model代表数据模型，也可以在model中定义数据修改和操作的业务逻辑
>
> V-view,view代表UI组件，它负责将数据模型转化为UI展现出来
>
> VM-viewmodel,viewmodel监听模型数据的改变和控制视图行为、处理用户交互，简单理解就是一个同步view和model的对象，连接model和view

## 12.**computed和watch有什么区别**

**computed**

> computed是计算属性，也就是计算值，它更多用于计算值的场景
> computed具有缓存性，computed的值在getter执行后是会缓存的，只有在它依赖的属性值改变之后，下一次获取computed的值时重新调用对应的getter来计算
> computed适用于计算比较消耗性能的计算场景

**watch**

> watch更多的是[观察]的作用，类似于某些数据的监听回调，用于观察props $emit或者本组件的值，当数据变化时来执行回调进行后续操作
> 无缓存性，页面重新渲染时值不变化也会执行

**小结**

> 当我们要进行数值计算，而且依赖于其他数据，那么把这个数据设计为computed
> 如果你需要在某个数据变化时做一些事情，使用watch来观察这个数据变化。

## 13.**vue组件的scoped属性的作用**

> 在style标签上添加scoped属性，以表示它的样式作用于当下的模块，很好的实现了样式私有化的目的；
> 但是也得慎用：样式不易（可）修改，而很多时候，我们是需要对公共组件的样式做微调的；

**解决办法：**

> ①：使用混合型的css样式：（混合使用全局跟本地的样式） <style> /* 全局样式 */ </style><style scoped> /* 本地样式 */ </style>
> ②：深度作用选择器（>>>）如果你希望 scoped 样式中的一个选择器能够作用得“更深”，例如影响子组件，你可以使用 >>> 操作符：<style scoped> .a >>> .b { /* ... */ } </style>

## 14.**vue是渐进式的框架的理解：(**主张最少,没有多做职责之外的事**)**

> Vue的核心的功能，是一个视图模板引擎，但这不是说Vue就不能成为一个框架。如下图所示，这里包含了Vue的所有部件，在声明式渲染（视图模板引擎）的基础上，我们可以通过添加组件系统、客户端路由、大规模状态管理来构建一个完整的框架。更重要的是，这些功能相互独立，你可以在核心功能的基础上任意选用其他的部件，不一定要全部整合在一起。可以看到，所说的“渐进式”，其实就是Vue的使用方式，同时也体现了Vue的设计的理念
> 在我看来，渐进式代表的含义是：主张最少。视图模板引擎
> 每个框架都不可避免会有自己的一些特点，从而会对使用者有一定的要求，这些要求就是主张，主张有强有弱，它的强势程度会影响在业务开发中的使用方式。
> 比如说，Angular，它两个版本都是强主张的，如果你用它，必须接受以下东西：
> 必须使用它的模块机制- 必须使用它的依赖注入- 必须使用它的特殊形式定义组件（这一点每个视图框架都有，难以避免）
> 所以Angular是带有比较强的排它性的，如果你的应用不是从头开始，而是要不断考虑是否跟其他东西集成，这些主张会带来一些困扰。
> Vue可能有些方面是不如React，不如Angular，但它是渐进的，没有强主张，你可以在原有大系统的上面，把一两个组件改用它实现，当jQuery用；也可以整个用它全家桶开发，当Angular用；还可以用它的视图，搭配你自己设计的整个下层用。也可以函数式，都可以，它只是个轻量视图而已，只做了自己该做的事，没有做不该做的事，仅此而已。
> **渐进式的含义，我的理解是：没有多做职责之外的事。**

## **15.vue.js的两个核心是什么(数据驱动、组件系统。)**

> 数据驱动:Object.defineProperty和存储器属性: getter和setter（所以只兼容IE9及以上版本），可称为基于依赖收集的观测机制,核心是VM，即ViewModel，保证数据和视图的一致性。
> 组件系统:[点此查看](https://link.zhihu.com/?target=https%3A//blog.csdn.net/tangxiujiang/article/details/79620542%23commentBox)

## 16.vue常用修饰符

> **修饰符分为：一般修饰符，事件修身符，按键、系统**
> ①一般修饰符：
> .lazy：v-model 在每次 input 事件触发后将输入框的值与数据进行同步 。你可以添加 lazy 修饰符，从而转变为使用 change 事件进行同步

```js
<input v-model.lazy="msg" >  
```

**.number**

```js
<input v-model.number="age" type="number">
```

**.trim**

```js
1.如果要自动过滤用户输入的首尾空白字符 <input v-model.trim='trim'>
```

> **② 事件修饰符**

```js
<a v-on:click.stop="doThis"></a><!-- 阻止单击事件继续传播 -->

<form v-on:submit.prevent="onSubmit"></form> <!-- 提交事件不再重载页面 -->

<a v-on:click.stop.prevent="doThat"></a> <!-- 修饰符可以串联 -->

<form v-on:submit.prevent></form>   <!-- 只有修饰符 -->

<div v-on:click.capture="doThis">...</div>   <!-- 添加事件监听器时使用事件捕获模式 --> <!-- 即元素自身触发的事件先在此处处理，然后才交由内部元素进行处理 -->

<div v-on:click.self="doThat">...</div>  <!-- 只当在 event.target 是当前元素自身时触发处理函数 --> <!-- 即事件不是从内部元素触发的 -->

<a v-on:click.once="doThis"></a> <!-- 点击事件将只会触发一次 -->
```

> **③按键修饰符**
> 全部的按键别名:

```js
.enter
.tab
.delete (捕获“删除”和“退格”键)
.esc
.space
.up
.down
.left
.right
.ctrl
.alt
.shift
.meta
```



```js
<input v-on:keyup.enter="submit"> 或者 <input @keyup.enter="submit">
```

> **④系统修饰键 （可以用如下修饰符来实现仅在按下相应按键时才触发鼠标或键盘事件的监听器。）**

```js
.ctrl
.alt
.shift
.meta
```



```js
<input @keyup.alt.67="clear"> 或者 <div @click.ctrl="doSomething">Do something</div><!-- Ctrl + Click -->
```

## 17.**v-on可以监听多个方法吗？（可以的）**

> 一个元素绑定多个事件的两种写法，一个事件绑定多个函数的两种写法，修饰符的使用。

```js
<a style="cursor:default" v-on='{click:DoSomething,mouseleave:MouseLeave}'>doSomething</a>
```

> 在method方法里面分别写两个时事件；

```js
<button @click="a(),b()">点我ab</button>
```

## 18.**vue事件中如何使用event对象**

```js
<button @click="Event($event)">事件对象</button>
```

## 19.**比如你想让一个dom元素显示**，然后下一步去获取这个元素的offsetWidth，最后你获取到的会是0。

> 因为你改变数据把show变成true,元素并不会立即显示，理所当然也不会获取到动态宽度。
> 正确的做法是先把元素show出来，在$nextTick去执行获取宽度的操作，不知道这样说会不会好理解一点。

```js
openSubmenu() {
this.show = true //获取不到宽度
this.$nextTick(() => //这里才可以 let w = this.$refs.submenu.offsetWidth;
})
}
```

## 20.**Vue 组件中 data 为什么必须是函数**

> vue组件中data值不能为对象，因为对象是引用类型，组件可能会被多个实例同时引用。
> 如果data值为对象，将导致多个实例共享一个对象，其中一个组件改变data属性值，其它实例也会受到影响。

## 21.**vue中子组件调用父组件的方法**

> 第一种方法是直接在子组件中通过this.$parent.event来调用父组件的方法
> 第二种方法是在子组件里用$emit向父组件触发一个事件，父组件监听这个事件就行了。
> 第三种都可以实现子组件调用父组件的方法，

```js
<template>
  <div>
    <button @click="childMethod()">点击</button>
  </div>
</template>
<script>
  export default {
    props: {
      fatherMethod: {
        type: Function,
        default: null
      }
    },
    methods: {
      childMethod() {
        if (this.fatherMethod) {
          this.fatherMethod();
        }
      }
    }
  };
</script>
```

## 22.**vue中 keep-alive 组件的作用**

> keep-alive 是 Vue 内置的一个组件，可以使被包含的组件保留状态，或避免重新渲染。

```js
<keep-alive>
  <component>
    <!-- 该组件将被缓存！ -->
  </component>
</keep-alive>
如果只想 router-view 里面某个组件被缓存


export default [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      keepAlive: true // 需要被缓存
    }
  }, {
    path: '/:id',
    name: 'edit',
    component: Edit,
    meta: {
      keepAlive: false // 不需要被缓存
    }
  }
]
<keep-alive>
    <router-view v-if="$route.meta.keepAlive">
        <!-- 这里是会被缓存的视图组件，比如 Home！ -->
    </router-view>
</keep-alive>
 
<router-view v-if="!$route.meta.keepAlive">
    <!-- 这里是不被缓存的视图组件，比如 Edit！ -->
</router-view>
```

## 23.**vue中如何编写可复用的组件？**

[去这里看一下blog.csdn.net](https://link.zhihu.com/?target=https%3A//blog.csdn.net/qq_38563845/article/details/77524934)

> ①创建组件页面eg Toast.vue；
> ②用Vue.extend()扩展一个组件构造器,再通过实例化组件构造器,就可创造出可复用的组件
> ③将toast组件挂载到新创建的div上；
> ④把toast组件的dom添加到body里；
> ⑤修改优化达到动态控制页面显示文字跟显示时间；

```js
import Vue from 'vue'; 
import Toast from '@/components/Toast';     //引入组件
let ToastConstructor  = Vue.extend(Toast) // 返回一个“扩展实例构造器”
 
let myToast = (text,duration)=>{
    let toastDom = new ToastConstructor({
        el:document.createElement('div')    //将toast组件挂载到新创建的div上
    })
    document.body.appendChild( toastDom.$el )   //把toast组件的dom添加到body里
    
    toastDom.text = text;
    toastDom.duration = duration;
 
    // 在指定 duration 之后让 toast消失
    setTimeout(()=>{
        toastDom.isShow = false;  
    }, toastDom.duration);
}
export default myToast;
```

## 24.**什么是vue生命周期和生命周期钩子函数？**

> **beforecreated**：在实例初始化之后，el 和 data 并未初始化（这个时期，this变量还不能使用，在data下的数据，和methods下的方法，watcher中的事件都不能获得到；）
> **created**:完成了 data 数据的初始化，el没有（这个时候可以操作vue实例中的数据和各种方法，但是还不能对"dom"节点进行操作；）
> **beforeMount**：完成了 el 和 data 初始化 //这里的el是虚拟的dom；
> **mounted** ：完成挂载，在这发起后端请求，拿回数据，配合路由钩子做一些事情（挂载完毕，这时dom节点被渲染到文档内，一些需要dom的操作在此时才能正常进行）
> **beforeUpdate**：是指view层数据变化前，不是data中的数据改变前触发；
> **update**：是指view层的数据变化之后，
> **beforeDestory**： 你确认删除XX吗？
> **destoryed** ：当前组件已被删除，清空相关内容
> **A、什么是vue生命周期？**
> Vue 实例从创建到销毁的过程，就是生命周期。也就是从开始创建、初始化数据、编译模板、挂载Dom→渲染、更新→渲染、卸载等一系列过程，我们称这是 Vue 的生命周期。
> **B、vue生命周期的作用是什么？**
> 它的生命周期有多个事件钩子,让我们在控制整个Vue实例的过程时更容易形成好的逻辑。
> **C、vue生命周期总共有几个阶段？**
> 它可以总共分为8个阶段：创建前/后, 载入前/后,更新前/后,销毁前/销毁后
> **D、第一次页面加载会触发哪几个钩子？**
> 第一次页面加载时会触发 beforeCreate, created, beforeMount, mounted 这几个钩子
> **E、DOM 渲染在 哪个周期中就已经完成？**
> DOM 渲染在 mounted 中就已经完成了。
> **F、简单描述每个周期具体适合哪些场景？**
> 生命周期钩子的一些使用方法： beforecreate : 可以在这加个loading事件，在加载实例时触发 created : 初始化完成时的事件写在这里，如在这结束loading事件，异步请求也适宜在这里调用 mounted : 挂载元素，获取到DOM节点 updated : 如果对数据统一处理，在这里写上相应函数 beforeDestroy : 可以做一个确认停止事件的确认框 nextTick : 更新数据后立即操作dom;

## 25.**vue更新数组时触发视图更新的方法**

```js
Vue.set    ==========Vue.set(target,key,value)这个方法主要是用于避开vue不能检测属性被添加的限制
Vue.set(array, indexOfItem, newValue)//indexOfItem指的索引
this.array.$set(indexOfItem, newValue)
Vue.set(obj, keyOfItem, newValue)
this.obj.$set(keyOfItem, newValue)
Vue.delete   这个方法主要用于避开vue不能检测到属性被删除；

Vue.delete(array, indexOfItem)
this.array.$delete(indexOfItem)
Vue.delete(obj, keyOfItem)
this.obj.$delete(keyOfItem)
```

## 26.**webpack的编译原理**

[webpack面试题汇总www.jianshu.com![图标](https://pic3.zhimg.com/v2-98336c96095bbf88645f2a5de3ff9872_ipico.jpg)](https://link.zhihu.com/?target=https%3A//www.jianshu.com/p/bb1e76edc71e)

**webpack的作用**

> ①、依赖管理：方便引用第三方模块、让模块更容易复用，避免全局注入导致的冲突、避免重复加载或者加载不需要的模块。会一层一层的读取依赖的模块，添加不同的入口；同时，不会重复打包依赖的模块。
> ②、合并代码：把各个分散的模块集中打包成大文件，减少HTTP的请求链接数，配合UglifyJS（压缩代码）可以减少、优化代码的体积。
> ③、各路插件：统一处理引入的插件，babel编译ES6文件，TypeScript,eslint 可以检查编译期的错误。
> **一句话总结：**webpack 的作用就是处理依赖，模块化，打包压缩文件，管理插件。
> 一切皆为模块，由于webpack只支持js文件，所以需要用loader 转换为webpack支持的模块，其中plugin 用于扩张webpack 的功能，在webpack构建生命周期的过程中，在合适的时机做了合适的事情。

**webpack怎么工作的过程**

> ①解析配置参数，合并从shell(npm install 类似的命令)和webpack.config.js文件的配置信息，输出最终的配置信息；
> ②注册配置中的插件,让插件监听webpack构建生命周期中的事件节点，做出对应的反应；
> ③解析配置文件中的entry入口文件，并找出每个文件依赖的文件，递归下去；
> ④在递归每个文件的过程中，根据文件类型和配置文件中的loader找出对应的loader对文件进行转换；
> ⑤递归结束后得到每个文件最终的结果，根据entry 配置生成代码chunk(打包之后的名字)；
> ⑥输出所以chunk 到文件系统。

## 27.**vue等单页面应用及其优缺点**

**缺点：**

> 不支持低版本的浏览器，最低只支持到IE9；
> 不利于SEO的优化（如果要支持SEO，建议通过服务端来进行渲染组件）；
> 第一次加载首页耗时相对长一些；
> 不可以使用浏览器的导航按钮需要自行实现前进、后退。

**优点：**

> 无刷新体验,提升了用户体验；
> 前端开发不再以页面为单位，更多地采用组件化的思想，代码结构和组织方式更加规范化，便于修改和调整；
> API 共享，同一套后端程序代码不用修改就可以用于Web界面、手机、平板等多种客户端
> 用户体验好、快，内容的改变不需要重新加载整个页面。

## 28.**什么是vue的计算属性computed**

**计算属性是需要复杂的逻辑，可以用方法method代替**

```js
computed:{
    totalPrice(){
      return (this.good.price*this.good.count)*this.discount+this.deliver;
    }
  }
```

## **29.vue-cli提供的几种脚手架模板**

> vue-cli 的脚手架项目模板有browserify 和 webpack；

## 30.**组件中传递数据？**

```js
props：export default {
props: {

message: String //定义传值的类型<br>

},


//或者props:["message"]

data: {}

父组件调用子组件的方法：父组件   this.$refs.yeluosen.childMethod()


子组件向父组件传值并调用方法 $emit


组件之间：bus==$emit+$on
```

## 31.**vue-router实现路由懒加载（ 动态加载路由 ）**

![img](https://pic4.zhimg.com/80/v2-db295f51af4f814acd70dafe137b66f3_720w.jpg)

## 32.**vue-router 的导航钩子,主要用来作用是拦截导航,让他完成跳转或取消。**

> **全局的:**前置守卫、后置钩子（beforeEach，afterEach）beforeResolve
> **单个路由独享的:**beforeEnter
> **组件级的:** beforeRouteEnter（不能获取组件实例 this）、beforeRouteUpdate、beforeRouteLeave
> 这是因为在执行路由钩子函数beforRouteEnter时候，组件还没有被创建出来；
> 先执行beforRouteEnter，再执行组件周期钩子函数beforeCreate，可以通过 next 获取组件的实例对象，如：next( (vm)=>{} )，参数vm就是组件的实例化对象。

## 33.**完整的 vue-router 导航解析流程**

> 1.导航被触发；
> 2.在失活的组件里调用beforeRouteLeave守卫；
> 3.调用全局beforeEach守卫；
> 4.在复用组件里调用beforeRouteUpdate守卫；
> 5.调用路由配置里的beforeEnter守卫；
> 6.解析异步路由组件；
> 7.在被激活的组件里调用beforeRouteEnter守卫；
> 8.调用全局beforeResolve守卫；
> 9.导航被确认；
> 10..调用全局的afterEach钩子；
> 11.DOM更新；
> 12.用创建好的实例调用beforeRouteEnter守卫中传给next的回调函数。

## 34.**vue-router如何响应 路由参数 的变化？**

**原来的组件实例会被复用。这也意味着组件的生命周期钩子不会再被调用。你可以简单地 watch (监测变化) $route 对象：**

```js
const User = {
  template: '...',
  watch: {
    '$route' (to, from) {
      // 对路由变化作出响应...
    }
  }
}


const User = {
  template: '...',
  watch: {
    '$route' (to, from) {
      // 对路由变化作出响应...
    }
  }
}
```

35.**vue-router的几种实例方法以及参数传递**

> name传递
> to来传递
> 采用url传参

## 36.**is的用法（用于动态组件且基于 DOM 内模板的限制来工作。）**

**is用来动态切换组件，DOM模板解析**

```js
<table> <tr is="my-row"></tr> </table>
```

## 37.**vuex是什么？怎么使用？哪种功能场景使用它？**

> 是什么：vue框架中状态管理:有五种，分别是 State、 Getter、Mutation 、Action、 Module
> 使用：新建一个目录store，
> 场景：单页应用中，组件之间的状态。音乐播放、登录状态、加入购物车

```js
vuex的State特性
A、Vuex就是一个仓库，仓库里面放了很多对象。其中state就是数据源存放地，对应于一般Vue对象里面的data
B、state里面存放的数据是响应式的，Vue组件从store中读取数据，若是store中的数据发生改变，依赖这个数据的组件也会发生更新
C、它通过mapState把全局的 state 和 getters 映射到当前组件的 computed 计算属性中

vuex的Getter特性
A、getters 可以对State进行计算操作，它就是Store的计算属性
B、 虽然在组件内也可以做计算属性，但是getters 可以在多组件之间复用
C、 如果一个状态只在一个组件内使用，是可以不用getters

vuex的Mutation特性
改变store中state状态的唯一方法就是提交mutation，就很类似事件。
每个mutation都有一个字符串类型的事件类型和一个回调函数，我们需要改变state的值就要在回调函数中改变。
我们要执行这个回调函数，那么我们需要执行一个相应的调用方法：store.commit。

Action 类似于 mutation，不同在于：Action 提交的是 mutation，而不是直接变更状态；
Action 可以包含任意异步操作，Action 函数接受一个与 store 实例具有相同方法和属性的 context 对象，
因此你可以调用 context.commit 提交一个 mutation，
或者通过 context.state 和 context.getters 来获取 state 和 getters。
Action 通过 store.dispatch 方法触发：eg。
store.dispatch('increment')

vuex的module特性
Module其实只是解决了当state中很复杂臃肿的时候，module可以将store分割成模块，
每个模块中拥有自己的state、mutation、action和getter
```