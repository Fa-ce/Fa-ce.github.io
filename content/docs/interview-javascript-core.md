---
title: JavaScript 核心考点
description: 数据类型、this 绑定、闭包、原型链、异步与数组方法，前端面试中 JS 部分的高频考点与代码示例。
date: 2024-11-03
category: interview
tags: [javascript, es6, notes]
---

## 数据类型

基本数据类型有 `undefined`、`null`、`number`、`string`、`boolean`，ES6 新增 `Symbol`。引用类型统一归为 `Object`，包括 `Object`、`Array`、`Function`。

`Symbol` 的特点是即使传入相同的值创建出的对象也互不相等，因此常用来解决属性名冲突，作为唯一标记使用。

`Object.is()` 在以下情况返回 `true`：两值都是 `undefined`；都是 `null`；都是 `NaN`；都是 `true` 或都是 `false`；是相同顺序相同字符组成的字符串；指向同一个对象；都是 `+0`、都是 `-0`，或是除零和 `NaN` 外的同一个数字。

## this 绑定：call、apply、bind

三者都用于改变 `this` 指向，区别在于传参形式和执行时机。

```js
fn.call(thisArg, arg1, arg2)      // 逐个传参，立即执行
fn.apply(thisArg, [arg1, arg2])   // 数组传参，立即执行
fn.bind(thisArg, arg1, arg2)      // 逐个传参，返回新函数不执行
```

非严格模式下，第一个参数传 `null`、`undefined` 或不传，`this` 指向 `window`；严格模式下传什么就是什么，不传则为 `undefined`。

`bind` 的典型用途是事件绑定。下面两行的差别很关键：

```js
document.onclick = fn.call(obj, 1, 2)   // fn 立即执行，绑定的是它的返回值
document.onclick = fn.bind(obj, 1, 2)   // fn 不执行，点击时才执行
```

## 闭包

**闭包是能够读取其他函数内部变量的函数**，通常表现为定义在函数内部的函数。

JS 的作用域是链式的：子函数可以访问父函数的所有变量，反之不行。把内部函数作为返回值抛出，就能在外部读取到函数内部的变量。

```js
function f1 () {
  var n = 999
  nAdd = function () { n += 1 }
  function f2 () { alert(n) }
  return f2
}

var result = f1()
result()   // 999
nAdd()
result()   // 1000
```

这段代码证明了 `f1` 的局部变量 `n` 一直保存在内存中，没有在调用结束后被回收。原因是 `f2` 被赋给了全局变量始终存在于内存，而 `f2` 依赖 `f1`，导致 `f1` 也无法被垃圾回收。

注意 `nAdd` 前面没有 `var`，它是个全局变量，且其值是一个匿名函数——这个匿名函数本身也是闭包，相当于一个 setter，可以在外部修改函数内部的局部变量。

闭包的两个主要用途是读取函数内部变量，以及让这些变量常驻内存。但也正因如此需要注意：**闭包会使变量无法被回收，滥用会造成性能问题**，退出函数前应删除不再使用的局部变量。另外闭包能在外部改变父函数的内部变量，如果把父函数当对象、闭包当公开方法、内部变量当私有属性来用，务必谨慎。

## 箭头函数与普通函数的区别

普通函数的 `this` 是动态的，取决于调用方式；箭头函数没有自己的执行上下文，`this` 取自父级作用域。

普通函数可以作为构造函数，箭头函数不行。普通函数内部有 `arguments` 类数组对象，箭头函数没有。箭头函数单条语句时可以省略 `return` 实现隐式返回。在类中用箭头函数定义方法，`this` 会绑定到类的实例。

## 原型与原型链

所有函数都有 `prototype` 属性指向原型对象（实例没有），原型对象中的 `constructor` 指回构造函数，实例的 `__proto__` 指向原型。

**原型链的原理**：访问实例的属性或方法时，如果实例本身没有就往原型上找，还找不到就继续向上一级原型查找，直到 `Object`（原型链顶端）。原型中的方法可以被所有实例共享，这也是继承的实现基础。

`instanceof` 用于判断实例属于哪个构造函数。

继承的实现方式有三种：借用构造函数、原型链继承，以及组合两者的构造函数加原型链继承。

## for...in 与 for...of

`for...in` 遍历的是键名（索引），`for...of` 遍历的是元素值。

用 `for...in` 遍历数组有三个缺点：索引是字符串型数字不能直接参与运算；遍历顺序不保证与数组实际顺序一致；会遍历所有可枚举属性，**包括原型上的**。

```js
var arr = [1, 2, 3]
arr.name = '数组'
Array.prototype.method = function () {}

for (var index in arr) {
  console.log(arr[index])   // 会输出 name 和 method
}
```

因此 `for...in` 更适合遍历对象，而 `for...of` 遍历普通对象会报错。只要部署了 `Symbol.iterator` 属性的数据结构就能用 `for...of`，包括数组、Map、Set、String、`arguments` 对象和 NodeList。这些结构同样支持扩展运算符和解构赋值。

## for 循环与 forEach

长度固定或无需计算长度时 `for` 效率更高；不确定长度或计算长度有性能损耗时用 `forEach` 更方便。

`forEach` 适合单纯遍历，复杂循环用 `for` 效率更高。需要修改集合中的值时必须用 `for`——`forEach` 内部基于 iterator 但无法人为控制。`forEach` 的优势在于处理稀疏数组时会跳过空位。

**关键差异**：`forEach` 中 `break` 无法中断循环，`return` 也无法返回到外层函数，而 `for` 可以中断。

## 数组去重

```js
// 1. Set（最简洁，ES6 首选）
const unique = arr => Array.from(new Set(arr))
// 或 [...new Set(arr)]

// 2. filter + indexOf
const unique = arr => arr.filter((item, index) => arr.indexOf(item) === index)

// 3. includes
function unique (arr) {
  const res = []
  for (const item of arr) {
    if (!res.includes(item)) res.push(item)
  }
  return res
}

// 4. 双重循环 + splice（ES5 常用）
function unique (arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) {
        arr.splice(j, 1)
        j--
      }
    }
  }
  return arr
}
```

需要注意 `indexOf` 方案无法处理 `NaN` 和空对象，`Set` 方案能去掉 `NaN` 但去不掉不同引用的空对象。

## 二维数组转一维

```js
// flat，可指定深度，默认 1
[1, 2, [3, 4, [5, 6]]].flat(2)   // [1, 2, 3, 4, 5, 6]
[1, 2, [3, 4, [5, 6]]].flat()    // [1, 2, 3, 4, [5, 6]]
```

`flat()` 会移除数组中的空项，但 `undefined` 和 `null` 会保留。

## Object 静态方法

`Object.keys()` 返回自身可枚举属性名组成的数组（不含继承的）。`Object.values()` 返回属性值数组，顺序与 `for...in` 一致。

`Object.assign(target, ...sources)` 用于合并对象，将源对象的可枚举属性合并到目标对象，**执行的是浅拷贝**。

`Object.create(proto, propertiesObject)` 以指定原型创建新对象。`Object.freeze()` 冻结对象。

## Promise.all 与 Promise.race

两者都将多个 Promise 实例包装成一个新实例，区别在于状态决议规则。

`Promise.all([p1, p2, p3])` 需要全部 fulfilled 才 fulfilled，返回值组成数组传给回调；只要有一个 rejected 就立即 rejected，第一个被 reject 的返回值传给回调。

`Promise.race([p1, p2, p3])` 只要有一个实例率先改变状态，新实例就跟着改变。注意它**不是只执行一个 Promise**，而是只返回最快那个的结果，其余仍在执行。

## async / await

`async` 修饰函数声明，使其变成异步函数。`await` 修饰函数调用，被修饰的函数必须返回 Promise 对象，加上 `await` 后会将异步操作转换为同步写法。

## 函数柯里化

将一个接受多个参数的函数，转化为一系列只接受一个参数的函数。

## 防抖与节流

两者都用于限制函数执行次数。**防抖**通过 `setTimeout`，在一定时间间隔内将多次触发合并为一次触发；**节流**则是减少一段时间内的触发频率。
