---
title: vue-课程笔记
description: 归档内容，二手课程笔记，不对外展示。
date: 2024-11-03
category: toolchain
tags: [notes]
draft: true
---

```

```

# Vue入门

## 认识vue.js

##### 为什么学习vue.js

1原有项目使用vue进行重构

2常用的vue技术栈(储备)

3招聘中的需求

##### 简单认识一个vuejs

1读音

2vue是一个渐进式的框架，什么是渐进式框架呢？

​ 渐进式以为着你可以将vue作为应用的一部分嵌入使用，带来交互体验（想用啥用啥，不用全都用，渐进式框架）

​ vue的核心库以及生态系统 （我们有很多NB的东西，非常的丰富）

​ core-vue-router-vuex vue全家桶

3vue具有很多高级功能

​ 解耦视图和数据

​ 可复用的组件

​ 前端路由技术

​ 状态管理

​ 虚拟DOM

## vuejs安装方式

##### CDN引入

​ 类似jquery的引入方式叫做CDN引入

##### 下载和引入

​ 下载后加入项目中，然后引用

##### NPM安装管理

​ npm install vue

## vuejs初体验

##### hello vuejs

​ 声明式编程

​ 命令式编程

​ vue是一个响应式框架，即数据发生改变时，界面会自动改变。

##### vue列表展示

##### 案例：计数器

## vue实例传入的options

目前需要掌握这些选项

​ el：

​ 类型：string|HTMLElement

​ 作用：决定之后Vue实例会管理哪一个DOM

​ data:

​ 类型：Object|Function(函数)

​ 作用：Vue实例对应的数据对象

​ methods:

​ 类型：[key:string]:Function

​ 作用：定义属于Vue的方法，可以在其他地方进行调用，也可以在指令中使用。

---

# MVVM

## 什么是MVVM

**MVVM**是一种软件架构。

MVVM有助于将[图形用户界面](https://wiki.hk.wjbk.site/baike-图形用户界面)的开发与[业务逻辑](https://wiki.hk.wjbk.site/w/index.php?title=业务逻辑&action=edit&redlink=1)或[后端](https://wiki.hk.wjbk.site/baike-前端和后端)逻辑（_数据模型_）的开发[分离](https://wiki.hk.wjbk.site/baike-关注点分离)开来，这是通过[置标语言](https://wiki.hk.wjbk.site/baike-置标语言)或GUI代码实现的。MVVM的*视图模型*是一个值转换器，[[1\]](https://wiki.hk.wjbk.site/wiki/MVVM#cite_note-MVVM-eliminates-valueconverters-1) 这意味着视图模型负责从模型中暴露（转换）[数据对象](<https://wiki.hk.wjbk.site/baike-对象_(计算机科学)>)，以便轻松管理和呈现对象。在这方面，视图模型比视图做得更多，并且处理大部分视图的显示逻辑。[[1\]](https://wiki.hk.wjbk.site/wiki/MVVM#cite_note-MVVM-eliminates-valueconverters-1) 视图模型可以实现[中介者模式](https://wiki.hk.wjbk.site/baike-中介者模式)，组织对视图所支持的[用例](https://wiki.hk.wjbk.site/baike-用例)集的后端逻辑的访问。

### View层

视图层

在前端开发中，通常就是DOM层

主要的作用是给用户展示各种信息

### Model

数据层

数据可能是我们固定的死数据，更多的是来自我们服务器（远程接口），从网络上请求来的数据

### ViewModel

视图模型层

视图模型层是View和Model的桥梁。

一方面它实现了DataBinding，将Model的改变实时反映到View中。

另一方面他实现了DOM对象的监听，当DOM发生一些事件（点击、滚动等）,可以监听到，并在需要的情况下改变相应的Data。

# Vue的生命周期

一个vue程序从开始到消亡的过程。

当一个new Vue()的时候，就表示vue的生命周期开始了，然后伴随着程序不断的进行，最终走向消亡。

主要的生命周期函数分类：

​ **创建生命周期函数:**

​ beforeCreate:实例刚在内存中被创建出来，此刻还没有初始化好data和methods属性

​ created:实例已经在内存中创建OK，此时data和methods已经创建OK，此时还没有开始编译模板。

​ beforeMount:此时已经完成模板的编译，但是还没有挂载到页面中

​ mounted:此时已经将编译好的模板挂载到页面指定的容器中显示。

​ **运行期间的生命周期函数:**

​ beforeUpdate:状态更新之前执行此函数，此时data中的状态值是最新的，但是界面上的数据还是旧的，因为此时还没有重新渲染DOM。

​ updated：示例更新完毕调用次函数，此时data和界面都已经渲染。

​ **销毁期间的生命周期函数**

​ beforeDestroy:实例销毁之前调用，在这一步，实例仍然可用。

​ Destroy:销毁，所有事件监听会被移出，子实例也会被销毁。

##### 组件在keep-alived情况的两个钩子函数

activated:表示组件当前为活跃状态。

deactivated表示组件为非活跃状态。

此时无论是不是活跃状态 他都是没有销毁的状态。

![Vue 实例生命周期](/images/remote/0ba95bbaba36a870.png)

---

适用场景：

```
beforecreate : 可以在这加个loading事件
created ：在这结束loading，还做一些初始化，实现函数自执行
mounted ： 在这发起axios请求，拿回数据，配合路由钩子做一些事情，处理数据
beforeDestory： destoryed ：当前组件已被删除，清空相关内容
```

# 指令

##### Mustache语法

使用双大括号进行变量值的绑定

我们可以在vue中像下面这样来使用，并且数据是响应式的

##### v-once:变量绑定一次

```javascript
<h2 v-once>你好</h2>
```

##### v-html:使字符串以html进行解析 <a></a>

##### v-text:使字符串以文本形式解析（因为mustanche更加灵活 所以在开发中我们基本不适用v-text）

##### v-cloak:当网络较慢，网页还在加载 Vue.js ，而导致 Vue 来不及渲染，这时页面就会显示出 Vue 源代码。

```
<div id="app" v-cloak>{{message}}</div>
<style>
[v-cloak]{
display:none;
}</style>
```

---

## 补充：

# ES6

## ECMAScript和JavaScript的关系

一个常见的问题是，ECMAScript和JavaScript到底是什么关系？

要讲清楚这个问题，需要回顾历史。1996年11月，JavaScript的创造者Netscape公司，决定将JavaScript提交给国际标准化组织ECMA，希望这种语言能够成为国际标准。次年，ECMA发布262号标准文件（ECMA-262）的第一版，规定了浏览器脚本语言的标准，并将这种语言称为ECMAScript，这个版本就是1.0版。

该标准从一开始就是针对JavaScript语言制定的，但是之所以不叫JavaScript，有两个原因。一是商标，Java是Sun公司的商标，根据授权协议，只有Netscape公司可以合法地使用JavaScript这个名字，且JavaScript本身也已经被Netscape公司注册为商标。二是想体现这门语言的制定者是ECMA，不是Netscape，这样有利于保证这门语言的开放性和中立性。

因此，ECMAScript和JavaScript的关系是，前者是后者的规格，后者是前者的一种实现（另外的ECMAScript方言还有Jscript和ActionScript）。日常场合，这两个词是可以互换的。

## ES6与ECMAScript 2015的关系

媒体里面经常可以看到”ECMAScript 2015“这个词，它与ES6是什么关系呢？

2011年，ECMAScript 5.1版发布后，就开始制定6.0版了。因此，”ES6”这个词的原意，就是指JavaScript语言的下一个版本。

但是，因为这个版本引入的语法功能太多，而且制定过程当中，还有很多组织和个人不断提交新功能。事情很快就变得清楚了，不可能在一个版本里面包括所有将要引入的功能。常规的做法是先发布6.0版，过一段时间再发6.1版，然后是6.2版、6.3版等等。

但是，标准的制定者不想这样做。他们想让标准的升级成为常规流程：任何人在任何时候，都可以向标准委员会提交新语法的提案，然后标准委员会每个月开一次会，评估这些提案是否可以接受，需要哪些改进。如果经过多次会议以后，一个提案足够成熟了，就可以正式进入标准了。这就是说，标准的版本升级成为了一个不断滚动的流程，每个月都会有变动。

标准委员会最终决定，标准在每年的6月份正式发布一次，作为当年的正式版本。接下来的时间，就在这个版本的基础上做改动，直到下一年的6月份，草案就自然变成了新一年的版本。这样一来，就不需要以前的版本号了，只要用年份标记就可以了。

ES6的第一个版本，就这样在2015年6月发布了，正式名称就是《ECMAScript 2015标准》（简称ES2015）。2016年6月，小幅修订的《ECMAScript 2016标准》（简称ES2016）如期发布，这个版本可以看作是ES6.1版，因为两者的差异非常小（只新增了数组实例的`includes`方法和指数运算符），基本上是同一个标准。根据计划，2017年6月将发布ES2017标准。

因此，ES6既是一个历史名词，也是一个泛指，含义是5.1版以后的JavaScript的下一代标准，涵盖了ES2015、ES2016、ES2017等等，而ES2015则是正式名称，特指该年发布的正式版本的语言标准。本书中提到“ES6”的地方，一般是指ES2015标准，但有时也是泛指“下一代JavaScript语言”。

总结：ES6相对于ES5的一些缺陷和功能，进行了修复和扩展。

问题：兼容性问题，IE毒瘤不支持ES6语法。 前端包ES6->ES5

ES6新增语法功能

# 常用的ES6语法

### var/let

块级作用域

js中使用var来声明一个变量时，变量的作用域主要是和函数的定义有关

针对于其他块定义来说没有作用域的，比如if/for等，这些会导致开发中引发一些问题

总结：什么时候用var什么实用用let?

**永远都用let不用var了！**

### const

常量修饰符：当我们不希望某一个变量值第二次被赋值时，可以用const常量修饰符保证他的安全性。

建议：在ES6开发中，优先使用const,只有需要改变某一个标识符的时候才使用let

### const注意

注意一：

```
const a=20;

a=30;//错误：不可以修改
```

注意二：

```
const name;//错误：const修饰的标识符必须赋值
```

### ES6对象字面量增强写法

var obj=new Object()

var obj={}

##### 1.属性的增强写法

```

        const name="张三";
        const age=18;
        //现在我们需要一个对象，将上放值放入对象中
        //es5
        const obj={
            name:name,
            age:age
        }
        //es6
        const obj1={
            name,
            age
        }
```

##### 2.函数增强写法

```
//2函数的增强写法
        //ES5
        const method={
            run:function(){

            },
            eat:function(){

            }
        }

        //es6
        const method1={
            run(){

            },
            eat(){

            }
        }
```

---

# bind指令

作用：动态绑定属性

指令：v-bind

缩写：:

参数：attrOrProp

```
//基本用法
<img v-bind:src="url">
//对象语法
<h2 :class="{active:true,line:false}">{{message}}</h2>
//函数语法
<h2 :class="getClasses()">{{message}}</h2>
methods:{
getClasses:function(){
   return {active:this.isActive,line:this.isLine}
	}
}
//数组语法（不常用）
<h2 :class="[active,line]">{{message}}</h2>

```

###

### 计算属性

一般情况下，在模板中可以直接通过插值显示一些data数据。

当我们对变量需要进行计算的时候需要将计算写在计算属性中：

```
<h3>{{方法名}}</h3>


computed:{//计算属性
	方法名(){
		return this.n+this.m;
	}
}
```

### 侦听器watch

```vue
<div id="app">
        <input type="text" v-model="user_info.name">
    </div>
    <script>
        const app=new Vue({
            el:"#app",
            data:{
                message:"",
                user_info:{
                    name:'blue',
                    age:18
                }
            },
            watch:{
                'user_info.name':function(){
                    console.log('name变了');
                }
            }
        })
```

计算属性和侦听器的区别是：

1计算支持缓存 不支持异步

2不支持缓存 支持异步

当需要的数据变化时执行异步或开销较大的操作时，该方式比较有用。

### 计算属性的setter和getter

```
computed：{
    fullName:{
        //计算属性一般只有get没有set
        //如果要实现set是一定有参数的
        set:function(){},
        get：function{
         return
        }
    }
}
```

# 事件监听

在前端开发中，我们经常需要进行交互，比如我们需要监听用户的点击、拖拽、键盘事件等。

**在Vue中我们使用v-on指令进行监听。**

**v-on介绍**

**作用：绑定事件监听器**

**缩写：@**

**参数：Event**

**语法糖：@事件名**

事件使用注意：

1.事件监听时，该方法没有参数，那么可以省略括号。

```
<button @click="clickFunction()">测试</button>
<button @click="clickFunction">测试</button>
```

2.事件监听时，方法如果有参数。

1）那么括号中需要写参数

**2）但是如果省略括号，那么此时会默认接收一个事件参数event(重要！)**

```
//调用没有传入参数
<button @click="method2">测试</button>
//方法有参数
method2(x){
     console.log(x);
 }
 //结果：
MouseEvent{isTrusted......}
```

那么 这个事件参数有什么用呢？

1..可以通过$event进行对dom元素的获取

```
//通过srcElement获取元素
e.srcElement
```

2..除此之外我们还可以对标签自身的属性进行修改，比如说改变button按钮的文字值

```
 e.srcElement.style.display="none";
```

3..我们也可以通过$event获取标签自定义的属性值

```
   e.srcElement.textContent="HelloWorld!";
```

总结：

1mouseEvent事件对象非常的重要，他可以让我们捕捉到我们点击的元素。

2vue中所有的方法都会内置一个事件对象，参数名$event。

---

# 条件判断

vue中的流程控制提供了v-if、v-else-if、v-else

这三个指令与javascript条件语句类似

vue的条件指令可以根据表达式的值在DOM中渲染或销毁元素或组件

简单演示：

总结：

v-if:适合一种特殊的判断

```
let type=0;
if(type==1)
{
	//颜色变成红色
}
```

v-if+v-else:双选一的情况

```
let gendar=1;
if(gendar==0)
{
	//男
}
else
{
	//女
}

```

v-if + v-else if +v-else:情况比较多的条件判断

```
let week=3;
if(week==1){星期一}
else if(week==2){星期二}
...
else{星期天}


//该语法效率很低
if(week==1){星期一}
if(week==2){星期二}
if(week==3){星期三}
if(week==4){星期四}
...
if(week==7){星期天}


```

v-show用来控制元素进行显示

语法：

```
<h2 v-if="false">{{message}}</h2>
<h2 v-show="false">{{message}}</h2>
```

v-show和v-if的区别是什么呢

v-if和v-show对比

```
v-if当条件为false时，vue不会有对应的元素在DOM中

v-show当条件为false时，仅仅是将元素的display属性设置为none
```

**开发中使用选择：**

**当需要在显示和隐藏之间切片频繁的时候，使用v-show**

**当只用一次切换时，使用v-if**

---

# v-for

1.遍历数组

```
//简单的数组遍历
v-for="item in list"
//带索引的数组遍历
v-for="(item,index) in list"
```

2.遍历对象

遍历对象就相当于将对象中的所有属性的值输出出来

```
//简单对象遍历
v-for="item in list"
//带key值的遍历
v-for="(value,key) in list"
```

### 组件的key属性

**官方推荐我们再使用v-for时，给对应的元素或组件添加上一个:key属性**。

为什么需要这个key属性呢？

diff算法：

**key的作用主要是为了高效的更新虚拟DOM**

### ES6for of和for in

for in返回的值是数据结构的**键名**。

for of循环的是键值中的**值**,且需要具有iterator接口。

具有iterrator的数据类型:Array Map Set String arguments NodeList

```
可以使用Object.keys()或者Object.values()给对象部署iterator属性
```

```javascript
const obj = {
	a: 1,
	b: 2,
	c: 3,
};
for (let i of Object.values(obj)) {
	console.log(i);
}
for (let i of Object.keys(obj)) {
	console.log(i);
}
```

---

# 数组中的常用方法

1.push方法 响应式

2.通过索引值修改数组中的元素 非响应式

3.pop()将最后一个元素删掉 响应式

4.shift()删除数组中第一个元素 响应式

5.unhift()在数组最前面添加元素 响应式 和push相反

6.splice(para1,para2,para3) 响应式

para1：起始位置

para2：要删除的元素长度

para3：要添加的元素

删除元素：第二个参数表示你准备删除几个元素 this.letters.splice(1,1)从第一个位置删除一个元素。

替换元素：this.letters.splice(1,3,'m','n','f');

插入元素：this.letter.splice(1,0,'x','y','z');

7.sort()排序

8.reverse()翻转

注意：sort和reverse他是根据ASCII码排的 所以可能会出现X字母在a字母前出现

9.concat() 将两个数组合并成一个数组

# 过滤器Filter

```
//vue
filters: {
    showPrice(price)
    {
        return price.toFixed(2)
    }
}
//html
{{item.price | showPrice }}
```

# javascript高阶函数

**fliter函数：方法创建一个新的数组，新数组中的元素是通过检查指定数组中符合条件的所有元素。**

注意：fliter的调用方法中，返回的是一个布尔类型值，即当为true的时候，将符合条件的元素返回，而不是将true返回。

```
let newNums=nums.filter(function(n){
            return n<100;
})
```

**map函数：返回一个新数组，数组中的元素为原始数组元素调用函数处理后的值。**

```
newNums.map(function(n){
            return n*2;
})
```

**reduce函数：接收一个函数作为累加器，数组中的每个值（从左到右）开始相加，最终计算为一个值。**

```
 let total = newNums.reduce(function (prevValue, n) {
            return prevValue + n
        }, 0);

```

javascript偏向风格：语法偏向简洁化，阅读性也能够得到保障。

# v-model

#文本框
text v-model="myname" 直接实现双向绑定
<input type="text" v-bind:value="myname" v-on:input="chg_myname">
v-bind:value  
v-on:chg_myname
chg_myname:function(event){
this.myname=event.target.value;
}

##单选
type="radio" name相同会互斥 v-model也会互斥
<input type="radio" value="男" v-model="sex">男
<input type="radio" value="女" v-model="sex">女
<input type="radio" value="保密" v-model="sex">保密

#多选 #第一种单选 v-model绑定的是一个boolean值
<input type="checkbox" v-model="boolean">

#第二种多选 v-model绑定的是数组
<input type="checkbox" v-model="array">篮球
<input type="checkbox" v-model="array">足球
<input type="checkbox" v-model="array">网球
<input type="checkbox" v-model="array">台球

#select #第一种单选 v-model 绑定的是一个变量(字符串类)

<select name="" id="mysex" v-model="sex">
	<option value="1">男</option>
	<option value="2">女</option>
	<option value="3">保密</option>
</select>

#第二种多选 v-model 绑定的是一个数组 select 多选要加个属性 multiple
<select name="" id="" multiple v-model="ilike">

<option value="唱歌">唱歌</option>
<option value="跳舞">跳舞</option>
<option value="朗诵">朗诵</option>
<option value="跳绳">跳绳</option>
</select> #第十二节 修饰符
#v-model
lazy 失去焦点/回车时执行
number 自动转化为数字类型
trim 过滤空格
#v-on
stop 阻止冒泡
prevent 阻止默认事件
enter|13键盘
once 监听一次

<div @click="myclick">
	今天天气不太好
	<button @click.stop="youclick">你点我呀</button>
</div> -->
<form action="ui5.html" @submit.prevent>
	<input type="text">
</form> -->
<form action="ui5.html">
	<input type="submit" value="提交" @click.prevent="myclick">
</form>
<input type="text" @keyup.enter="youclick">
<input type="text" @keyup.13="youclick">
<button @click.once="myclick">你来点我呀</button>

# 组件化思想

### 组件化

人在面对复杂问题的处理方式：
任何一个人处理信息的逻辑能力都是有限的
面对非常复杂的问题时,我们不可能一次性搞定一大堆的内容
人天生有种能力,就是将问题进行拆解
如果将一个复杂的问题,拆分成很多个可以处理的小问题,再将其放到整体中,我们会发现大的问题慢慢就被解决掉了
组件化也是这类思想
如果我们将一个页面的逻辑全部都放到一起,处理起来非常复杂,而且不利于二次开发以及管理 如果我们将页面拆分成一个个小的功能模块,每个功能模块完成属于自己的独立部分的功能,那么之后的整个页面的管理和维护就会非常容易了
vue中的组件化思想
组件化非常重要
它提供了一种抽象,让我们可以开发出一个个独立可复用的模块来构造我们的应用
组件化思想的应用
有了组件化思想,我们在之后的开发中要充分利用它
尽可能的将页面拆分成一个个小的、可复用的组件
这样我们的代码更加方便管理和组织、并且扩展性也更强

### 注册组建的步骤

1创建组件的构造器 通过Vue.extend()方法创建组件构造器（可以省略）
2注册组件 调用Vue.component()
3使用组件 在Vue案例的作用范围内使用组件

下面是一个基本组件。

```javascript
Vue.component("button-counter", {
	data: function () {
		return {
			count: 0,
		};
	},
	template:
		'<button v-on:click="count++">You clicked me {{ count }} times.</button>',
});
```

### 组件的类型

1全局组件：直接在Vue中使用Vue.component声明的组件就是全局组件

2局部组件：在vue实例中创建的组件叫做局部组件。

```javascript
//局部组件
const app = new Vue({
	el: "#app",
	data: {
		message: "你好",
		num1: 1,
		num2: 2,
	},
	components: {
		test: {
			template: ` <div><p>我是局部组件的<a href='#'>段落</a></p><p>{{childName}}</p></div>`,
			data() {
				return { childName: "子组件" };
			},
		},
	},
});
```

3父子组件：

```javascript
const cpn = Vue.component("button-counter", {
	data: function () {
		return {
			count: 0,
		};
	},
	template:
		'<button v-on:click="count++">You clicked me {{ count }} times.</button>',
});
const app = new Vue({
	el: "#app",
	data: {
		message: "你好",
		num1: 1,
		num2: 2,
	},
	components: {
		cpn,
	},
});
```

### 模板的抽离

方式一：<script type="text/x-template" id="注册的组件对应的id"></script>

<script type="text/x-template" id="yourapp">
	<div>
		<div>
			<p>我是一个兵</p>
			<p>来自老百姓</p>
		</div>
	</div>
</script>

方式二：<template id="注册的组件对应的id"></template>

<template id="yourapp">
	<div>
		<p>我是一个兵</p>
		<p>来自老百姓</p>
		<p>我是一个兵</p>
		<p>来自老百姓</p>
	</div>
</template>
Vue.component('num1',{
		template:'#yourapp'
})

### 组件中的data必须是个函数

思考下列两个图示代码输出结果：

在javascript中，当函数运行时，会在内存中有一个新的空间，空间内的属性值是独立的。

以对象方式创建时，每个对象获取到的是一个内存的地址0x23，所以当地址中的值改变，所有对象都会跟着发生改变。

注意：

**1.组件内部是不能访问vue实例里边的数据的，组件是一个单独独立功能模块的封装，有自己的html模板 也应该有自己的data。**

**2.组件的data必须是一个函数为了区分开组件之间的区别,需要使用函数来返回不同的对象。**

---

# 父子组件的通讯

在开发中，往往一些数据需要从上层传递到下层：

比如在一个页面中，我们从服务器请求到了很多数据。

其中一部分数据，并非是我们整个页面的大组件来展示的，而是需要下面的子组件进行展示。

这个时候，并不会让子组件发次发送一个网络请求，而是直接让**大组件（父组件）将数据传递给小组件（子组件）**。

如何进行父子组件的通信呢？
1通过props向子组件传递数据 父传子
2通过事件emit向父组件发送消息 子传父

### 父组件向子组件传值方法props:

语法：

```
//1子组件中使用props获取
 const cpn = {
            template: '#cpn',
            props: {
                cmessage:String
            }
        }
//2向子组件传入父组件的值
<cpn :cmessage="message"></cpn>

//3template渲染
<template id="cpn">
        <div>
            <h2>{{cmessage}}</h2>
            <p>组件内容</p>
        </div>
</template>
```

### props驼峰命名问题

javascript代码规范是严格按照驼峰命名方式来命名的。

介绍：首单词首个字母小写，其他单词的所有首字母都大写

例如：name studentName className

props中，由于vue对驼峰命名书写出现了问题，所以在template中不要使用驼峰命名调用，

需要使用"-"对单词进行连接。

当我们使用脚手架的时候，不存在这个问题,vue-cli。

### props数据验证

当我们需要对props进行类型验证时，需要编写对象写法

验证支持如下类型：String Number Boolean Array Object Date Function Symbol

```
Vue.component('my-component',{
//基础的类型检查('null' 匹配任何类型)
propA:Number
//多个可能的类型
propB:[String,Number],
//必填的字符串
propC:{
type:String,
required:true
},
//带有默认值的数字
propD:{
type:Number,
default:100
},
//带有默认值的对象
propE:{
type:Object,
default(){
 	return {message:'hello'}
}
},
//自定义的验证函数
propF:{
validator(value)
    {
    return ['success','warning','danger'].indexOf(value)!=-1
    }
    }
})
```

### 子级向父级传递

子传父需要使用自定义事件完成.

方法：

1.在子组件中，通过$emit()来触发事件。

```
//子组件中
 methods: {
                btnClick(item){
                        console.log(item);
                        //发射一个事件  叫child-click
                        //$emit中的两个参数1事件名称 2传递的数据
                        return this.$emit('child-click',item)
                }

            }
```

2.在父组件中，通过v-on来监听子组件事件。

```
<!--父组件监听子组件事件  当子组件发射事件时，监听响应调用相关事件-->
<cpn @child-click='cpnClick'></cpn>
cpnClick(item){
                    console.log(item);
                }
```

### 作业：实现类似京东分栏效果

```
list: [{
            categoryName: '热门推荐',
            goodsList: [{
                goodsName: '手机'
              },
              {
                goodsName: '全面屏手机'
              },
              {
                goodsName: '游戏手机'
              },
              {
                goodsName: '充电宝'
              }
            ]
          },
          {
            categoryName: '手机数码',
            goodsList: [{
                goodsName: '小米'
              },
              {
                goodsName: '华为'
              },
              {
                goodsName: '荣耀'
              }
            ]
          },
          {
            categoryName: '电脑办公',
            goodsList: [{
                goodsName: '轻薄本'
              },
              {
                goodsName: '游戏本'
              },
              {
                goodsName: '机械键盘'
              }
            ]
          },
        ]

```

### 父子组件访问方式:$children

有时候我们需要父组件直接访问子组件，可以通过相关语法访问子组件的成员

$children

```
this.$children是一个数组类型，他包含了所有子组件对象。
```

用法：

```
//1使用$children获取子组件的方法
 this.$children[0].btnClick();
//2使用$children获取子组件的data
this.$children[0].name
```

一般在实际的项目开发中，我们很少去用$children去获取子组件成员,因为子组件使用的地方比较多，

例如:我们要获取子组件的最后一个元素的方法，但是中途被插入了新的子组件，所以会导致索引位置出现改变。

此时我们需要使用refs进行获取。

$refs

```
<cpn></cpn>
<cpn></cpn>
<cpn ref="aaa"></cpn>
//使用$refs获取，相当于通过名称进行获取特定的元素
this.$refs.aaa
```

用法：

**我们通常会通过这种方式来进行子组件中某一个DOM元素的操作**。

组件通讯的图示：

# slot插槽

组件的插槽：

组件的插槽是为了让我们封装的组件更加具有扩展性。

让使用者可以决定组件内部的一些内容到底展示什么。

例子：移动网站中的导航栏

思考：一个京东的移动端网站，顶部菜单可以做成一个组件么？

语法：

```
<template id="cpn">
    <div>
      <slot></slot>
      <h3>子组件</h3>
      <p>我是一个子组件 哈哈哈</p>
      <slot><button>默认值</button></slot>
    </div>
</template>
```

### 具名插槽

具名插槽就是待有名字的插槽

语法如下:

```
//template部分
  <template id="cpn">
    <div>
      <slot name="left"><span>左边</span></slot>
      <slot name="center"><span>中间</span></slot>
      <slot name="right"><span>右边</span></slot>
    </div>
  </template>

//html调用
<div id="app">
    <cpn><span slot="center">购物车</span></cpn>
</div>

```

### 作用域插槽：

一句话总结：父组件替换插槽的标签，但是内容由子组件来提供。

即数据是由子组件提供的，但是现实方式由父组件来决定。

我们思考一个问题：

子组件包括一组数据，比如:pLanguages:['js','C#','C++','java']

需要在多个界面进行展示：

1某些页面是以水平方式展示的

2某些页面是以列表方式展示的

3某些页面是以"-"相连的

数据在子组件中，希望父组件告诉我们如何展示，怎么办？

**此时需要使用slot作用域插槽**

使用步骤：

```
//1在子组件的template中编写插槽
//注意此处slot中的:data是随便声明的，相当于将pLanguage的数据放入到data属性中
<template id='cpn'>
    <div>
      <slot :data="pLanguage">
        <ul>
          <li v-for="item in pLanguage">{{item}}</li>
        </ul>
      </slot>
    </div>
  </template>


 //2父组件进行插槽的重写
 <template v-slot="slot">
        <span>{{slot.data.join('-')}}</span>
 </template>
```

---

# v-bind

基本使用

```
<img v-bind:src="变量">
```

语法糖

```
<img :src="变量">
```

绑定class

```
<h3 :class="变量里的样式名"></h3>
```

class对象的用法

```
<h3 :class="{key:value}"></h3>
```

style的用法

```
<h3 :style="{css属性名:变量}"></h3>
<h3 :style="{css属性名:'值'}"></h3>
```

# 计算属性

基本使用

```
compute:{
	method()
	{

	}
}
```

set和get 进行设置值和获取值

```
compute:{
	method：
	{
		set：function){

		}
        get:function(){

        }
	}
}

```

# 前端模块化

前端项目越来越复杂，在开发中经常会导致变量的污染。

思考：

一个公司有项目经理王经理，程序员小明，小红。

现在3人开始共同写一个项目，会导致什么问题？

### 匿名函数解决方案

1使用立即执行函数解决

将所有变量放入到一个立即执行函数中

```
;(function(){
	var name="小红";
	var flag="false";
	console.log(name);
})()

```

但是如果需要使用某一个匿名函数中的方法，此时将无法处理，代码就没有了复用性。

ES5解决方案：

### 使用模块作为出口

将需要复用的东西放入一个对象中

```javascript
var moduleA = (function () {
	//定义一个对象
	var obj = {};
	obj.flag = true;
	obj.myFunc = function (info) {
		console.log(info);
	};
	return obj;
})();

//使用moduleA.flag
//moduleA.myFunc()
```

这就是最基础的封装，也是模块的原始雏形。

目前前端模块化开发已经有了很多既有的规范，以及对应的实现方案

### 常见的模块化规范：

commonjs、AMD(异步模块定义)、CMD(通用模块定义)、以及ES6的Modules

**1）AMD-异步模块定义**

**AMD是RequireJS**在推广过程中**对模块定义的规范化**产出，它是一个概念，RequireJS是对这个概念的实现，就好比JavaScript语言是对ECMAScript规范的实现。AMD是一个组织，RequireJS是在这个组织下自定义的一套脚本语言

![img](/images/remote/4914f53d4abd0458.png)

**RequireJS**：**是一个AMD框架**，可以异步加载JS文件，按照模块加载方法，通过define()函数定义，第一个参数是一个数组，里面定义一些需要依赖的包，第二个参数是一个回调函数，通过变量来引用模块里面的方法，最后通过return来输出。

是一个**依赖前置、异步定义**的AMD框架（在参数里面引入js文件），在定义的同时如果需要用到别的模块，在最前面定义好即在参数数组里面进行引入，在回调里面加载

**2）CMD---**是**SeaJS**在推广过程中对模块定义的规范化产出，是一个同步模块定义，是SeaJS的一个标准，SeaJS是CMD概念的一个实现，SeaJS是淘宝团队提供的一个模块开发的js框架.

![img](/images/remote/961c2b7394ef4e03.png)

通过define()定义，没有依赖前置，通过require加载jQuery插件，CMD是依赖就近，在什么地方使用到插件就在什么地方require该插件，即用即返，这是一个同步的概念

**3）CommonJS规范--**-是通过**module.exports定**义的，在前端浏览器里面并不支持module.exports,通过node.js后端使用的。Nodejs端是使用CommonJS规范的，前端浏览器一般使用AMD、CMD、ES6等定义模块化开发的

![img](/images/remote/ce85c4ef17fd5ac6.png)

输出方式有2种：默认输出---module export 和带有名字的输出---exports.area

**4）ES6特性，模块化**---**export/import对模块进行导出导入的**

![img](/images/remote/dda4e833a355cc1c.png)

# CommonJS

模块化有两个核心：导出和导入

### Commonjs的导出:

```
module.exports={
    flag:true,
    test(a,b)
    {
        return a+b;
    },
    demo(a,b)
    {
        return a*b;
    }
}
```

commonjs的导入：

```
var {flag} =require('./aaa.js')

```

# ES6的模块化

### export导出

```
//1.导出方式一
export{name,age,height}
//2导出方式二：
export var num1=10;
//3.导出函数/类
export function mul(n1,n2){
	return num1+num2;
}
export class Person{
	run(){
		console.log('123')
	}
}
```

### import导入

```
//1.导入{}中的变量
import {name,age} from './aaa.js'
//2.导入export的变量
import {num1} from './aaa.js'
//3.导人function
import {mul，Person} from './aaa.js'
const p=new Person()
```

某些情况下 一个模块中包含某个功能，我们不希望给这个功能起名字，而且导入者可以自己来命名，这时候就使用export default

```
5.export default
const name='张三'
export default address

//导入   此时addr是随便起的名字
import addr from './aaa.js'
```

注意：export default在同一个模块中不允许出现多个。

# webpack

模块化有很多规范 commonJS AMD CMD ES6 我们目前浏览器只能使用ES6  
在ES6之前,我们要进行模块化开发,必须借助其他工具,让我们可以进行模块化开发
通过模块化开发后,还需要处理模块间的各种依赖
使用webpack后 做很多底层处理
关系网很复杂,webpack能够帮我们处理
模块化不仅仅在js我们的图片css都能用作模块化

### 打包

​ 将webpack中的各种资源模块进行打包合并成一个或者多个包
​ 打包过程中能够对资源进行处理,压缩图片,将scss转化成css ES6语法转化成ES5语法,将TypeScript转化成javascript

### webpack安装

1需要node环境依赖

```
node -v
```

2全局安装webpack3.6,vue-cli2依赖版本

```
npm install webpack@3.6.0 -g
```

```
通常我们的项目中会以下列名称进行命名
//打包文件夹
dist
//源文件夹
src
```

### 打包

进入到终端输入打包命令

```
webpack ./main.js ../dist/bundle.js
```

注意：前面没有npm

### 创建webpack配置文件

webpack.config.js

```
const path=require('path')


module.exports={
    entry:'./src/main.js',
    output:{
        path:path.resolve(__dirname,'dist'),
        filename:'bundle.js'
    }
}
```

node.js环境依赖

```
npm init

npm install
```

配置完成后，执行webpack进行打包

```
//不常用
webpack
//项目常用此命令
npm run build
```

使用npm run build需要进行package.json配置

```javascript
{
  "name": "webpack",
  "version": "1.0.0",
  "description": "",
  "main": "webpack.config.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build":"webpack"
  },
  "author": "",
  "license": "ISC"
}

```

开发时依赖

```
--save-dev
```

运行时依赖

```
--dev
```

### NPM淘宝镜像

npm install -g cnpm --registry=https://registry.npm.taobao.org
输入cnpm -v输入是否正常，这里肯定会出错。

因为cnpm会被安装到D:\Program Files\nodejs\node_global下，而系统变量path并未包含该路径。在系统变量path下添加该路径即可正常使用cnpm

# loader

loader是webpack中一个核心概念

loader可以将我们的css、图片、es6、typescript转化为js 将scss、less转成css，以及将.vue文件转成js文件等等。对于webpack本身来说，这些转化是不支持的。

### loader使用过程：

步骤1：通过npm安装需要使用的loader。

步骤2：在webpack.config.js中的modules关键词下进行配置。

### css-loader

### style-loader

# less

知识点回顾

如何创建一个本地webpack运行环境步骤：

```
//1创建入口文件
main.js
const {sum} =require('./js/mathUtils.js')
require('./css/special.less')

//2创建打包文件
bundle.js
//3创建webpack配置文件
const path=require('path')
module.exports={
    entry:'./src/main.js',
    output:{
        path:path.resolve(__dirname,'dist'),
        filename:'bundle.js'
    },
}
//4安装node依赖
npm init

//5本地webpack
 npm install webpack@3.6.0 --save-dev

 //6修改package.json的webpack节点值为build
 "build": "webpack"

 //7webpack完成打包

```

### 什么是less

Less （Leaner Style Sheets 的缩写） 是一门向后兼容的 CSS 扩展语言。这里呈现的是 Less 的官方文档（中文版），包含了 Less 语言以及利用 JavaScript 开发的用于将 Less 样式转换成 CSS 样式的 Less.js 工具。

例子：

```
@width: 10px;
@height: @width + 10px;

#header {
  width: @width;
  height: @height;
}
```

输出：

```
#header {
  width: 10px;
  height: 20px;
}
```

#### 插件推荐：

easy-less可以自动将less文件翻译成css文件

### webpack配置less文件

```
//1编写less文件
@width:300px;
@height:@width+100px;



div{
    width: @width;
    height: @height;
    background: orange;
}
//2在入口文件main.js中进行引用
require('./css/special.less')

//3webpack中进行less文件的loader安装  注意：因为一般正常情况下没有less所以需要额外安装less
代码参考官方文档

//4在webpack.config.js文件中进行rules节点配置
代码参考官方文档

//5webpack编译
npm run build

```

### url-loader

当图片大小小于8KB时，图片以base64输出

### file-loader

当图片大小大于8KB,

```
//webpack.config.js
module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath:'dist/'//涉及URL的地址都在这里配置
    }
}
```

我们可以使用name属性进行名称的配置

```
 {
                test: /\.(png|jpg|gif)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name:'img/[name].[hash:8].[ext]'//名称配置
                    }
                }]
            }
```

# webpack图片文件配置

前端项目中需要对CSS的图片部分进行打开，我们会使用file-loader或url-loader进行图片打包。

### url-loader 路径文件配置

该配置主要是负责css中图片的显示功能

```
//1终端安装url-loader
npm install --save-dev url-loader
//2webpack.config文件中进行节点配置   注意：8bit=1字节  1024字节=1K
参考官网
//3npm run build
```

### file-loader文件配置

```
//1终端安装file-loader
npm install --save-dev file-loader

//2webpack.config文件继续配置节点

//3npm run build
```

注意：在file-loader中 如果文件超过大小 那么将会以图片路径方式显示图片，但是图片会放入到dist中，所以需要配置webpack.config文件的节点，看下图

```
 output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath:'dist/'//设置路径
    },
```

任务：

1写一个less文件，理解下什么是less。less目的为了提高CSS的代码维护性。

2上机操作以下

less-loader打包less文件

url-loader打包图片 8k以下的图片

file-loaer打包图片 8K以上的图片

以上的打包方法和配置css是一样的。

# babel

前面我们介绍过，现在多数浏览器都是支持ES6语法的，但是有个别浏览器只支持ES5，那么我们使用webpack编写的代码如何实现多浏览器的兼容呢？

我们可以在webpack中使用babel对应的loader实现es6转es5。

使用步骤如下：

```
//1终端输入安装命令
//npm install babel-loader@8.0.0-beta.0 @babel/core @babel/preset-env
//2webpack.config中配置节点信息
module: {
  rules: [
    {
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    }
  ]
}
//3终端编译
npm run build
```

# webpack配置vue

使用模块化思想进行vue的开发。

```
//安装vue
npm install vue --save
注意此处必须是--save 运行时依赖
不能使用--save--dev 开发时依赖
```

运行异常

vue设计时有两种模式：

1.runtime-only 代码中不可以有template

2.runtime-compiler 代码中可以有template

```
//这就是template
<div id="app">
        {{message}}
</div>
```

如何解决：

1在webpack中进行配置

```
resolve:{
	alias:{
		'vue$':'vue/dist/vue.esm.js'
	}
}
```

上述节点配置内容我们不需要掌握，只需要知道该配置是强制使用runtime--compiler模式，并且还能让template正常使用的。

相当于将所有页面都看成是组件，替换跟组件中的<app>。

```
//main.js
import App from '.App.vue'
new Vue({
   el:
   template:'<App/>',
   components:{
   	App
   }
})
```

安装vue的loader

```
npm install --save-dev vue-loader@13.0.0 vue-template-compiler
```

配置

```
{
	test:/\.vue$/,
	use:['vue-loader']
}
```

终极方案

```
//main
import Vue from 'vue'
import App from './App.vue'

new Vue({
    el:"#app",
    template:'<App></App>',
    components:{
        App
    }
})

```

# Webpack-CLI

自动配置webpack环境

发布

热加载：每次代码修改保存后，不需要进行npm run build，他会自动帮你进行打包更新。

# Vue-CLI3

Command-Line Interface 俗称：脚手架

通俗的将，他就是帮助我们安装配置了一些项目中经常需要用的包，用户就无须进行配置。

脚手架比较适合大型项目中使用。

小的应用不需要使用脚手架。

vue-cli3是基于webpack4打造，vue-cli2还是webpack3

vue-cli3的设计原则是0配置,移除的配置文件根目录下的build和config等目录，更简单。

vue-cli3提供了vue ui命令，提供了可视化配置，更加人性化

移除了static文件夹，新增了public文件夹，并且index.html移动到public中

使用vue-cli3创建项目步骤：

一、安装vue-cli3脚手架

```
npm install -g @vue/cli@3.X.1  (3.2.1   3.12.1)

查看已安装版本
vue --version或者 vue -V
```

二、终端输入vue create 项目名

```
vue create 项目名
let a ='1';
```

目录结构介绍

node_modules

public发布文件

src源文件

.browserslistrc linux配置相关文件

.gitignore git上传配置文件

babel：babel配置文件

readme.md：markdown开源描述文件

三、项目运行

```
npm run serve
```

### vue-cli的配置去哪了？

vue-cli3中所有的项目配置都放到了一个可视化的终端中。

在终端输入命令，启动可视化终端。

```
vue ui
```

# 箭头函数

箭头函数：ES6中的一种新语法，一种定义函数的方式。

=> goes to

无参数

```
const method1=()=>{

}

```

有多参数

```
const method2=(x,y)=>{
	return x+y;
}
```

有一个参数

```
const power=num=>{
	return num*num;
}
```

函数中只有一行代码括号可以省略

const method3=(x，y)=>x+y;

### 箭头函数中this的使用

**何时使用箭头函数的适用场景：**

在需要向一个方法中传入另一个方法中使用。

例如：

设置一个倒计时函数

```
setTimeout(function () {
      console.log(123);
}, 1000)
```

箭头函数有一个this作用域问题

结论：

**箭头函数的this是在定义函数时绑定的，不是在执行过程中绑定的。简单的说，函数在定义时，this就继承了定义函数的对象。**

**箭头函数中所使用的this都是来自函数作用域链，它的取值遵循和普通变量一样的规则，在函数作用域链中一层一层往上找**

```
例子一：
 $(function () {
            $("#content").click(function () {
                console.log(this); //此时是#content
                $(".li").each(()=>{
                    console.log(this)
                })
            })
  })
  例子二：
    var object={
           name:'123',
           getNameFun:()=>{
               console.log(this);
           }

       }
       console.log(object.getNameFun());

 例子三：
 var obj={
         func:function(){
             console.log(this);

         },
         say:function(){
             setTimeout(function(){
                 console.log(this)
             }, 1000);
         }
     }
     obj.func();
     obj.say();

```

箭头函数能解决什么问题：

1setTimeout和setInterval中this是window问题

2不考虑this的问题时

# 路由

路由是一个网络工程中的术语。

路由(routing)就是通过互联的网络把信息从源地址传输到目的地址的活动。

# vue-router

**前后端分离阶段：**

随着ajax的出现 有了前后端分离的开发模式

后端只提供API来返回数据，前端通过Ajax获取数据，并且可以通过javascript将数据渲染到页面上

这样做的最大优点就是前后端责任的清晰，后端专注于数据，前端专注于交互和可视化。

并且当移动端出现后，后端不需要进行任何处理，依然使用之前的一套API即可

**单页面富应用：**

其实SPA（Single Page Application）最主要的特点就是在前后端分离的基础上加了一层前端路由。

也就是前端来维护一套路由规则。

SPA页面：整个网页只有一个html页面.

优点：

页面切换比较平滑，非常接近原生的APP效果

缺点：对搜索引擎的收录是有大问题

哪些项目应该使用SPA

适合：App,OA,MES.CMS

不适合：博客，论坛，电商，门户网站，新闻资讯。

### 安装和使用vue-router

一、框架搭建阶段

步骤一：安装vue-router

```
npm install vue-router --save
```

步骤二：在模块化工程中使用

1.在src目录中创建一个router文件夹

2.router文件夹中创建一个index.js文件

3.在index.js中引入VueRouter

```
import VueRouter from 'vue-router'
```

4.通过Vue.use()进行插件安装

```
import Vue from 'vue'

//1.通过vue.use(插件),安装插件
Vue.use(VueRouter)
```

5创建VueRouter对象

```
const router=new VueRouter({
    //配置路由和组件之间的对应关系
    routes:[

    ]
})
```

6将router对象传入到vue实例中

```
export default router
```

7在入口文件中导入

```
import router from './router'
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

```

二、使用阶段：

第一步：创建路由组件

```
about.vue
home.vue
```

第二步：配置路由映射：组件和路径映射关系

```
 //router>index.js文件
import home from '../components/home'
import about from '../components/about'

 routes: [{
            path: '/home',
            component: home
        },
        {
            path: '/about',
            component: about
        }

    ]
```

第三步：使用路由：通过<router-link>和<router-view>

```
//在app.vue中引入router-link标签
<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <router-link to="/home">首页</router-link>
    <router-link to="/about">关于</router-link>
    <router-view></router-view>
  </div>
</template>
```

注意：

router-link是vue-router中预定义的一个特殊的标签，用来代替跳转标签 <a>

router-view是一个预定义标签，表示渲染的占位符,渲染不同的组件内容。

### 路由的默认值设置

有时我们希望网页打开后直接默认显示某一个页面，此时可以对路由进行默认值设置

```
path:'',
redirect:'/home'
```

### 更改网站的hash属性修改为history

```
http://localhost:8080/#/about
如何变为
http://localhost:8080/about
```

在router\index.js中进行设置

```
const router = new VueRouter({
    //配置路由和组件之间的对应关系
    routes: [{
            path: '/home',
            component: home
        },
        {
            path: '/about',
            component: about
        }

    ],
    mode:'history'
})
```

### router-link补充

在前面的我们介绍了一个属性to:用于指定跳转的路径

router-link中还有一些其他属性

tag:可以指定router-link渲染成什么组建，例如：

```
<router-link to='/home' tag='li'>
<router-link to='/home' tag='button'>
```

replace:阻止浏览器前进后退功能,不会留下history记录

```
<router-link to='/home' tag='li' replace>
```

active-class:当router-link对应的路由匹配成功是，会自动给元素设置一个router-link-active的class,设置active-class可以修改默认名称

active-class：active

### 代码实现路由跳转

```
 this.$router.push('/home')
 this.$router.replace('/home')
```

小BUG，当在某一个组建渲染时如果再次跳转到该组件会导致vue出错，原因是组件重复渲染了.

解决方案：

```
 this.$router.push('/home').catch(err=>{err})
```

### 动态路由

在某些情况下，一个页面的path的路由可能是不确定的，比如我们进入用户界面时，希望是这样的路径：

/user/1或者 /user/zhangsan

除了有前面的/user外，后面还跟上了用户的ID https://www.douban.com/people/208204383/

这种path和Component的匹配关系，我们称之为动态路由（也是路由传递数据的一种方式）

```
//路由配置代码
{
            path:'/user/:userid',
            component:user
}
```

那么当我们的userid是动态的变量时 应该如何使用呢？

使用v-bind可以实现变量的动态绑定

```
 <router-link :to="'/user/'+userid" tag="button" active-class='active'>用户</router-link>
```

那么当组件加载时，如何拿到传过来的信息呢？

在子组件中使用$route.params.对象名来获取传过来的信息

```
 <p>当前登录用户是：{{$route.params.userid}}</p>
```

### 路由的懒加载（了解）

当打包构建应用时，javascript包会变得非常的大，影响页面的加载速度。

如果我们能把不同路由对应的组件分割成不同的代码块，然后当路由被访问的时候才加载对应组件，就可以提高效率了。

这就是路由的懒加载。

路由懒加载做了什么？

路由的懒加载的主要作用就是将路由对应的组件打包成一个一个的js代码块。

只有在路由被访问的时候，才加载对应的组件。

懒加载实现

```
 const home =()=>import('../components/home')

 routes: [{
            path: '/home',
            component:home//懒加载
        },
        {
            path: '/about',
            component: about //非懒加载
        },
        {
            path:'/user/:userid',
            component:user
        }

    ],
    mode:'history'
})
```

### 嵌套路由

https://movie.douban.com/subject/30310218/

https://www.douban.com/movie/subject/30310218/

嵌套路由是一个很常见的功能

比如在home页面中，我们希望通过/home/news和/home/message访问一些内容

一个路由映射一个组件，访问这两个路由也会分别渲染两个组件

实现嵌套路由有两个步骤：

1创建对应的子组件，并在路由映射中配置对应的子路由

```
const router = new VueRouter({
    //配置路由和组件之间的对应关系
    routes: [{
            path: '/home',
            component:home,
            children:[
                {
                    path:'news',
                    component:homenews
                },
                {
                    path:'message',
                    component:homemessage
                }
            ]
        },
        {
            path: '/about',
            component: about
        },
        {
            path:'/user/:userid',
            component: user
        }

    ],
    mode:'history'
})
```

2在组件内部使用<router-view>标签

```
//在home.vue进行子路由渲染
<div>
    <h3>首页</h3>
    <p>我是首页</p>
    <router-link to="/home/news">新闻</router-link>
    <router-link to='/home/message'>消息</router-link>
    <router-view></router-view>
</div>
```

# 路由传参的两种方式

动态路由配置: /newsdetail/1

query形式：/newsdetail?id=1

```
//取值
$route.query.id
```

# keep-alive

保持组件不会被销毁

一、如果大部分组件都不需要保持该状态，只有某一个需要保持不销毁状态 可以使用include

二、如果大部分都需要保保持，而某一个不需要保持的时候，使用**`exclude`**

# 导航守卫

### 全局导航守卫

### 路由导航守卫

### 组件导航守卫

参考vue-router文档

作业需求：

1实现底部tarbar工具条样式效果，布局采用flex，高度49px,点击的时候图片是两张一张是非点击状态的，第二章是点击状态的。

2把这tarbar做成一个组件,无论是4栏，还是3栏 你这个组件都应该可以使用。

3按照4栏的话，创建4个.vue页面,点击后，路由切换到响应的页面中。

# 同步和异步

同步：指代码按照步骤一步一步进行，上一步不执行完，下一步就一直等待。

例子：

8点起床

1分钟穿衣服 2分钟刷牙 10分钟WC+扣手机 烧壶水5分钟 2分钟泡面

=>1+2+10+5+2==20分钟

异步：指代码自己执行，不会去等待其他人是否执行完。

哪些函数是异步的：

setInterval()计时器 每过多久就做一次事

setTimeout()定时器 过多久做一件事，只做一次

ajax异步请求 $.ajax() $.get() $.post() $

网络请求

# ajax的复习

$.get()

$.post()

请问get和post请求有什么区别？

**get**请求的数据量少，参数不会进行加密

**post**请求的数据量多与get,参数会进行加密

一般来说：我们提交的行为都用post,我们获取的行为都用get

总结：异步程序在业务功能非常复杂的情况下，为了保障程序的执行顺序，我们难免会进行回调的嵌套。

会产生地狱回调，造成代码的维护性非常的差，阅读性也非常的差。

原始的异步程序急需优化。

# JSON

JSON是一种数据**格式**。

{"name":"张三","age":"18"}

{"studentlist":[{"name":"张三"},{"name":"李四"}]}

[{"name":"张三"},{"name":"张三"},{"name":"张三"}]

# 序列化和反序列化

使用的格式有2种，JSON、XML

JSON优势：简单灵活 不严谨

XML：schme

将数据格式转化为对象。

# Promise

### promise是什么？

Promise是异步编程的一种解决方案。

1、主要用于异步计算
2、可以将异步操作队列化，按照期望的顺序执行，返回符合预期的结果
3、可以在对象之间传递和操作promise，帮助我们处理队列

### 为什么会有promise？

**为了避免界面冻结（任务）**

- 同步：假设你去了一家饭店，找个位置，叫来服务员，这个时候服务员对你说，对不起我是“同步”服务员，我要服务完这张桌子才能招呼你。那桌客人明明已经吃上了，你只是想要个菜单，这么小的动作，服务员却要你等到别人的一个大动作完成之后，才能再来招呼你，这个便是同步的问题：也就是“顺序交付的工作1234，必须按照1234的顺序完成”。
- 异步：则是将耗时很长的A交付的工作交给系统之后，就去继续做B交付的工作，。等到系统完成了前面的工作之后，再通过回调或者事件，继续做A剩下的工作。
  AB工作的完成顺序，和交付他们的时间顺序无关，所以叫“异步”。

#### 地狱回调

假设我们需要通过一个url从服务器加载一个数据data1,data1中包含下一个请求的url2

我们需要通过data1取出url2。。。

如何解决上述代码的问题？

Promise可以以一种非常优雅的方式来解决这个问题。

#### 定时器的异步事件

通过这个案例来看看Promise最基本的语法。

这里，我们同一个定时器来模拟异步事件：

假设下面的data是从网络上1秒后请求的数据

console.log()就是我们的处理方式。

```javascript
setTimeout(function () {
	let data = "helloworld";
	console.log(content);
}, 1000);
```

基本语法

```javascript
new Promise((resolve, reject) => {
	setTimeout(function () {
		resolve("helloworld");
		reject("error data");
	}, 1000);
})
	.then((data) => {
		console.log(data);
	})
	.catch((error) => {
		console.log(error);
	});
```

讲解：

Promise中需要传入一个方法

newPromise(()=>{})

//resolve,reject本身他们又是两个函数

什么情况下会使用到Promise?

一般是在做异步操作的时候没使用promise对这个异步操作进行封装

**成功的时候用resolve**

resolve就是将异步回调回来的数据交给then()中

**失败的时候用reject**

reject当网络请求出现错误的时候，会执行catch()

# Promise三种状态

异步操作有三种状态

pending:等待状态，比如正在进行网络请求，或者定时器没有到时间。

fulfill:满足状态，当我们主动回调了resolve时，就处于该状态，并且会回调.then()

reject:拒绝状态，当我们主动回调了reject时，就处于该状态，并且会回调.catch()

# Promise链式调用

promise链式调用的简写一：

```
return Promise.resolve(data+'BBB');

```

promise链式调用的简写一：

```
 return data+'BBB';
```

# Promise中all的用法

当我们同时发送了N个异步请求后，我们并不能准确的知道哪一个请求先完成，哪一个是后完成的。

此时我们可以使用promise中的all方法，all方法会等到所有的异步函数都执行成功后，给你进行回调。

语法：

```
Promise.all([
new Promise(()=>{
      异步函数()
}),
new Promise(()=>{
      异步函数()
})
]).then(result=>{

})
```

# 单界面状态管理

State:就是我们的状态（你可以姑且当做是data中的属性）

View:视图层，可以针对State的变化，显示不同的信息

Actions:这里的是用户的各种操作：点击、输入等 会引起状态的改变

什么使用使用vuex

当你使用简单的单界面的时候，由于变量非常的少，组件也很少，此时不需要使用vuex状态管理。

当你的项目非常复杂的时候，组件又非常的多，组件之间的通讯会变得非常的复杂，那么使用vuex状态管理来简化你的组件通讯。

Vuex状态管理：

就是提供一个独立的空间，进行数据的存储，可以供所有的组件随时使用，而不用去知道组件与组件是什么关系。

原则上：

共用的值存到vuex中。

使用步骤：

Vuex是一个插件所以使用是我们需要进行安装

```
npm install vuex --save
```

创建一个store（这里约定俗成开发中，我们都起名叫做仓库）

```
//store
--//index.js    vuex配置文件
```

在index.js中进行vuex插件注册

```
import Vue from 'vue'
import Vuex from 'vuex'

//1安装插件
Vue.use(Vuex)


//2创建对象
const store=new Vuex.Store({
state:{
	count:10
},
mutations:{

},
actions:{

},
getters:{

},
modules:{

}


})
//3导出对象
export  default store
```

在main.js进行使用

```
import Vue from 'vue'
import App from './App.vue'
import store from './store'
Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')

```

在相应的组件中进行值的获取

```
{{$store.state.count}}
```

注意：使用vuex是进行变量值的获取与修改需要按照其**规定**的方式进行。

获取:$store.state.XX

那么如果需要修改一个状态管理中的值如何进行呢？请看官方给出的图示

<img src="C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20200824154345500.png" alt="image-20200824154345500" style="zoom:80%;" />

# vuex-devtools

浏览器插件安装步骤

**该插件安装需要访问谷歌商店（翻墙），我们需要先安装一个谷歌访问助手**

请参考google访问助手安装方式

https://www.jianshu.com/p/47aeb966623e

**在google商店中安装vue.js-devtools**

# vuex Mutations属性

vue官方推荐我们在修改store中的值的时候不要直接修改，而是通过mutations属性进行修改

##### Vuex的store状态的更新唯一方式：提交mutation

##### Mutation主要包括两部分：

​ 字符串的事件类型(**type**)

一个回调函数,该函数的第一个参数就是state

**Mutations中定义方式**

```
//store//index.js
state:{
    count:10
},
mutations:{
    increment(state){
        state.count++
    },
    decrement(state)
    {
        state.count--
    }
}


```

##### 更新方式一：

```
this.$store.commit("increment")
```

##### 更新方式二：

```
this.$store.commit({
	type:'increment'
})
```

**Mutation带参数传递的写法**

当mutation中方法带参数时 可以再调用的地方进行参数传递

**参数既可以是普通的值 也可以是对象。**

```
//调用页面
this.$store.commit("incrementNum",num)
//store  index.js
incrementNum(state,number)
{
   state.count+=number;
}
```

##### 更新方式一：

```
this.$store.commit("incrementNum",num)
```

##### 更新方式二:

```
this.$store.commit({
	type:'incrementNum',
	num:num
}})
```

# Getters

只要是对state中的值进行处理的，都需要写在getters中

getters的作用主要是让我们的页面对数据进行筛选，将筛选后的结果进行返回显示。

虽然每个vue中具有computed属性可以进行数据的计算，但是当使用较多的情况下，维护性就会比较差。

##### getters定义方式

```
//store  index.js
getters:{
    method1(state){

    }
}
```

##### 页面的调用方式

通过插件下的getters.方法名的方式进行调用

```
$store.getters.getStudentByAge
```

注意：getters中有2个默认参数

参数一：state指的是vuex中的状态

```
getStudentByAge(state)
    {
            return state.student.filter(r=>r.age>18);
    },
```

参数二：getter指getters中的其他所有getters方法

```
	getStudentByAgeLength(state,getters)
    {
        return getters.getStudentByAge.length;
 }
```

思考：如果我们在调用getters时需要传递参数怎么办？

由于getters中只有两个参数，所以在外部调用需要向getters中传递值时，需要对getters中的函数进行**闭包**处理

```
getStudentById(state)
    {
        return function(id){
           return  state.student.filter(r=>r.id==id);
        }
    }

```

**注意：getters中的对象是以属性方式调用，所以外部没有办法传递参数进来。**

如果确实需要传递参数，需要搞点手段，将getters中的属性做成一个闭包函数。

# Actions

mutation中调用的是同步函数

通常情况下,vuex要求我们mutation中的方法必须是同步方法。

主要原因是当我们使用devtools时，可以帮助我们捕捉到mutation的快照

但是如果是异步操作，那么devtools将不能很好的追踪到这个操作。

**Action类似于Mutation,但是他是用来代替Mutation进行异步操作的**

Action的基本使用示例：

context表示上下文，代表的是store，这里只是一个形参名，叫什么都可以

```
actions: {
        aUpdateInfo(context) {
            setTimeout(() => {
                context.commit('changeloginname')
            }, 3000);
        }
 },
```

调用示例

```
this.$store.dispatch('action名称')
```

Actions中也可以传递参数

方法类似mutations

```
this.$store.dispatch('action名称','参数')
```

如果我们希望异步执行完告知我们，也就是需要有回调函数怎么办？

**异步回调如何进行**

```
  aUpdateInfo(context) {
            return new Promise(resolve=>{
                setTimeout(() => {
                    context.commit('changeloginname');
                    resolve('异步已经执行完了')
                }, 3000);
            })
        }
```

调用

```
this.$store.dispatch('action名称').then(res=>console.log(res))
```

# Modules

以模块形式进行划分

```
const modulesA={
state:{},
mutations:{},
actions:{},
getters:{}
}


const store=new Vuex.Store({
modules:{
	a:ModulesA
}
})
```

注意：在模块化下，mutation和getter都是共享的，不会分模块；

在模块化下，getterr会有一个额外参数,rootState;

在模块化下，action中commit只能使用当前作用域下的mutations。

# Vuex核心概念

#### State

state中存入的是变量，数据.

#### Mutation

vue官方不建议我们直接对state中的值进行修改，所以我们需要在mutation中编写方法进行修改。

mutation

#### Getters

getters的作用主要是让我们的页面对数据进行筛选，将筛选后的结果进行返回显示。

#### **Actions**

执行的是异步方法

#### **Module**

将vuex模块化

# 项目中的Vuex结构

```
Store
	--index.js组装模块并导入store的地方
	--action.js根级别的action
	--mutations.js根级别的mutation
	--modules
		--cart.js购物车模块
		--products.js产品模块

```

# axios

#### 安装axios

```undefined
npm install axios --save
```

###### ES6 import引用

因为axios不是vue的插件，所以不能直接用use方法，需要将其加载到原型上。

```csharp
import axios from 'axios'
axios.get();
```

## 使用

---

#### 发送一个最简单的请求

这里我们发送一个带参数的get请求，params参数放在get方法的第二个参数中，如果没有参数get方法里可以只写路径。如果请求失败捕获一下异常。

```jsx
axios
	.get("http://rap2api.taobao.org/app/mock/23080/resources/search", {
		params: {
			id: 5,
		},
	})
	.then((res) => {
		console.log("数据是:", res);
	})
	.catch((e) => {
		console.log("获取数据失败");
	});
```

当然，我们也可以发送一个POST请求，post方法的第二个参数为请求参数对象。

```jsx
this.$axios
	.post("http://rap2api.taobao.org/app/mock/121145/post", {
		name: "小月",
	})
	.then(function (res) {
		console.log(res);
	})
	.catch(function (err) {
		console.log(err);
	});
```

#### 一次合并发送多个请求

分别写两个请求函数，利用axios的all方法接收一个由每个请求函数组成的数组，可以一次性发送多个请求，如果全部请求成功，在`axios.spread`方法接收一个回调函数，该函数的参数就是每个请求返回的结果。

```jsx
function getUserAccount() {
	return axios.get("/user/12345");
}
function getUserPermissions() {
	return axios.get("/user/12345/permissions");
}
this.$axios.all([getUserAccount(), getUserPermissions()]).then(
	axios.spread(function (res1, res2) {
		//当这两个请求都完成的时候会触发这个函数，两个参数分别代表返回的结果
	}),
);
```

#### axios的API

以上通过axios直接调用发放来发起对应的请求其实是axios为了方便起见给不同的请求提供的别名方法。我们完全可以通过调用axios的API，传递一个配置对象来发起请求。

发送post请求，参数写在data属性中

```jsx
axios({
	url: "http://rap2api.taobao.org/app/mock/121145/post",
	method: "post",
	data: {
		name: "小月",
	},
}).then((res) => {
	console.log("请求结果：", res);
});
```

发送get请求，默认就是get请求，直接第一个参数写路径，第二个参数写配置对象，参数通过params属性设置。

```jsx
axios("http://rap2api.taobao.org/app/mock/121145/get", {
	params: {
		name: "小月",
	},
}).then((res) => {
	console.log("请求结果：", res);
});
```

#### axios配置默认值

1、可以通过axios.defaults设置全局默认值，在所有请求中都生效。

```rust
axios.defaults.headers.common["token"] = ""
axios.defaults.headers.post["Content-type"] = "application/json"
axios.defaults.baseURL = 'https://service.xxx.com; //设置统一路径前缀
```

2、也可以自定义实例的默认值，以及修改实例的配置

```csharp
// 创建时自定义默认配置，超时设置为全局默认值0秒
let ax = axios.create({
  baseURL: 'http://rap2api.taobao.org',
  params: { name: '小月' }
});
// 修改配置后，超时设置为4秒
ax.defaults.timeout = 4000;
```

3、也可以像前面那样，在每个请求中设置相关的配置。

```csharp
axios('/app/mock/121145/get', {
  params: {
    name: 'xiaoxiao'
  },
  baseURL: 'http://rap2api.taobao.org'
})
```

### axios项目中的封装

```
import axios from 'axios'
export function request(config){
	return new Promise(resolve,reject)=>{
		const instance=axios.create({
		baseURL:'',
		timeout:5000
	})
	instance(config)
	.then(res=>{resolve(res)})
	.catch(err=>{reject(err);})

	}
}

//注意:instance()即时axios的实例，本身axios就是使用promise封装的
所以此处代码可以简写为
export function request(config){
		const instance=axios.create({
		baseURL:'',
		timeout:5000
	})
	return instance(config)




}
```

### axios拦截器

//请求发送拦截器
instance.interceptors.request.use(config=>{
//请求成功拦截器
return config;//此处必须将config返回
},err=>{
//失败
})

//相应拦截
instance.interceptors.response.use(res=>{
//响应成功
return res//将结果返回
},err=>{
//响应失败
})

# 项目实施

#### 创建项目

#### 目录架构

#### CSS的引入

#### vue.config配置

路径配置

```
//创建vue.config.js文件
module.exports={
    //配置
     configuraWebpack:{
        resolve:{
            alias:{
               'assets':'@/assets',
               'common':'@/common',
               'components':'@/components',
               'network':'@/network',
            }
        }
     }

}
```

#### 封装axios

```
import axios from 'axios'
export function request(config){

    return new Promise((resolve,reject)=>{
        const instance=axios.create({
            baseURL:'https://localhost:44336/',
            timeout:5000
        })

        instance(config).then(res=>{
            resolve(res)
        }).catch(err=>{
            reject(err)
        })

    })
}

```

#### 将axios设置全局配置

```
//main.js
axios.defaults.baseURL='https://localhost:44336/'
axios.defaults.timmeout=5000
```

#### 数据字典

banner wl_shop_ads
图片地址 wl_upload_img
商品分类 wl_shop_cate
商品列表 wl_shop_goods

#### 接口说明

http://39.97.117.62:8080/

banner数据接口

read

参数：limit 条数

/banner/read

goods数据接口

readbypager

参数：pagesize页面的数据条数 pageindex页数

/goods/readbypager

getGoods

通过商品主键获取商品详细信息

参数：gid 商品的ID

/goods/getGodds

重要字段：

id主键 name产品名称 pic价格 oprice原价 summary描述 num1113504 ImageUrl

#### better-scroll使用

better-scroll是一个移动端滚动插件,让浏览器的滚动条滑动更加平顺；

同时可以设置滚动区域。

使用步骤：

一、npm进行安装

```
npm install better-scroll
```

二、创建一个类对象

```
 this.scroll=new BScroll('.wrapper',{
          probeType:3,
          pullUpLoad:true
      })
```

#### 项目细节补充

##### fastclick解决移动端延迟问题

##### 0.3S

说明：一般情况下 手机端会默认存在300ms的延迟，主要是因为部分手机厂商在用户点击后，预留有300ms的延迟，来判断是否为双击。

```
安装
npm install faskclick --save
```

```
main.js中导入
import FaskClick from 'fastclick


//解决移动端300ms延迟
FastClick.attach(document.body)
```

##### 图片懒加载vue-lazyload框架

什么是图片懒加载？

图片需要显示在屏幕上时，再加载这张图片

使用步骤

```
npm install vue-lazyload --save
```

```
main.js中导入
import VueLazyLoad from 'vue-lazyload'
Vue.use(VueLazyLoad,{
	loading:''//可以设置加载时的默认图片   引用图片资源时，需要使用require('文件路径')
})
```

```
template中的src属性不能使用了，需要使用
 <img v-lazy="'http://api.example.com'+item.ImageUrl">
```

px像素转vw插件postcss-px-to-viewport

使用步骤

```
npm install postcss-px-to-viewport --save-dev
```

创建一个postcss.config.js

网站：

1手机网站、APP(Hybird,webapp) 原生APP（IOS、安卓程序员 程序后端 nativeAPP）

2PC网站 企业站、商城、MES、OA

3小程序

问题:

需要一种组件框架，帮助我们少些点代码。

前端框架：

1UI类型框架 bootstrap

2组件类型框架 layui easyui kendoui iview e2e vantui webui mintui.... （PC，移动端）

3纯框架 jquery vue react angular

项目：前后端分离

php+vue+ele

为什么要用组件框架：

1节约代码

2有现成的组件，所以开发周期就会非常的短

3提供设计样式 CSS

# elementUI

if(this.date1 != '' && (this.date2 == '' || this.date2 == null))

if( （a==1||a==2) && b==1)

{

}

UI=>平面设计 设计，html,css,js

程序 CSS PS HTML js 2月 2月 4月 2w

前端工程师 css ps html js 5000 PC APP 小程序

### 项目

办公自动化（Office Automation，简称OA）：这种系统，主要是处理一个企业内部数据流程。

例如：保险公司，保险进行录入，业务，员工

​ 车管所驾驶员管理系统 电子档案 体检

​ 青果系统 排课 成绩录入 教工评教

MES系统

MES系统是一套面向制造企业车间执行层的生产信息化管理系统。

例如：纺织生产线系统

CMS是Content Management System的缩写，意为"内容管理系统"

例如: 论坛

[ERP：企业资源](https://baike.baidu.com/item/企业资源)计划即 ERP (**E**nterprise **R**esource **P**lanning)

又N多个OA MES CMS.......组成出来的一个庞大的系统

https://learnku.com/laravel/t/6773/a-clean-and-elegant-element-ui-admin-template

错误：部门添加报错

​ 签到过期是如何判定的。

​ 员工信息修改报错。

#### 项目需求：

登录需求：用户登录成功后，需要查看该用户是什么组的，什么组的决定他能看到哪些页面。

员工管理：以table形式显示所有的员工信息，数据要有分页，操作有查看员工，编辑，删除，添加。

密码修改：提供对登录人员的密码修改功能。

部门/职位管理：以表格形式进行职位和部门的绑定，修改，删除功能，添加。

个人资料：查看当前登录人的所有信息，提供个人信息的修改。

用户信息：以表格形式将客户信息进行展示，提供客户信息的查看和修改功能。

请假外出申请：查看个人的请假信息，然后可以提交请假的申请。

审批：显示所有的请假信息，对审批信息进行审核（通过和拒绝）。审批提供了编辑和删除功能。

签到：员工登录后，需要进行签到，签到一天分为4次签到，上午上班签到 上午下班签到，下午上班签到 下午下班签到。

个人考勤记录页面：显示登录人员的签到信息。

考勤记录：所有员工的签到信息

用户组：以列表形式查看每个组的权限，用户组的添加

用户组添加：以树形组件形式显示所有的页面，然后对页面进行勾选，点击添加后创建用户组。

公海池：每个员工录入一个客户的时候，客户的信息就会出现在公海池中。

申领：当登录人点击申领，那么这个客户就属于这个申领人。

业务池：显示当前登录人领取的客户,放弃（客户重新回到公海池中）,客户信息的修改，查看客户信息。

提供跟踪进程和成交产品功能

提供跟踪：可以进行跟踪信息的添加。

成交产品：进行产品购买的信息添加。[](<>)
