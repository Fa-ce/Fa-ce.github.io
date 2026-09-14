---
title: ES6 基础：作用域、解构与模板字符串
description: 从课程示例整理 let、const、暂时性死区、全局对象、数组与对象解构及模板字符串。
date: 2026-09-09
category: fundamentals
tags: [javascript, es6, notes]
source: 尚学堂 ES6 课程 002_es6、003_es6 学习笔记与代码
---

# ES6 基础

ES6 即 ES2015。本系列也收录课程中讲到的后续标准特性，并在对应位置标明。各代码块是独立示例，运行时不要把同名变量的片段直接拼在一起。

学习顺序：[基础](/docs/es6-basics) → [数组与对象](/docs/es6-arrays-objects) → [函数与类](/docs/es6-functions-classes) → [异步编程](/docs/js-promise-async) → [Proxy 与 Reflect](/docs/js-proxy-reflect) → [模块化](/docs/js-module-systems)。转译工具另见 [Babel](/docs/babel-basics)。

## let 与块级作用域

`let` 声明的变量受所在词法作用域约束。块语句、循环等可以引入块级作用域；对象字面量中的 `{}` 不是块语句，不能简单理解为“出现大括号就有新作用域”。

```js
let outer = 12;
{
  let inner = 13;
  console.log(outer + inner); // 25
}
console.log(typeof inner); // undefined：块外没有这个绑定
```

### 循环中的闭包

`var` 循环复用同一个变量；`let` 循环会为每次迭代建立相应绑定。原课程用 IIFE 保存 `var` 的当前值，ES6 可以直接用 `let`。

```js
const shared = [];
for (var i = 1; i <= 3; i++) {
  shared.push(() => i);
}
console.log(shared.map(fn => fn())); // [4, 4, 4]

const separate = [];
for (let k = 1; k <= 3; k++) {
  separate.push(() => k);
}
console.log(separate.map(fn => fn())); // [1, 2, 3]
```

### 暂时性死区与重复声明

`let` 绑定在进入作用域时已经存在，但执行到声明之前尚未初始化，这一段称为暂时性死区（TDZ）。访问它会抛出 `ReferenceError`，包括对该绑定使用 `typeof`。课程中“不存在变量提升”的说法，实际强调的是不能像 `var` 那样在声明前读到 `undefined`。

```js
let count = 1;
try {
  console.log(count); // 访问的是下面的局部绑定，不是外层 count
  let count = 3;
} catch (error) {
  console.log(error.name); // ReferenceError
}
console.log(count); // 1
```

同一作用域中重复声明同名 `let` 会产生语法错误；内层作用域可以声明同名变量。下面是故意报错的反例，不能作为正常脚本运行：

```text
let value = 1;
let value = 2; // SyntaxError
```

## const 固定绑定

`const` 具备块级作用域、TDZ 和不能重复声明的特点，普通声明时必须初始化。它禁止重新赋值，但不会冻结对象内部数据。

```js
const user = { name: 'kevin' };
user.name = 'lily';
user.age = 12;
console.log(user); // { name: 'lily', age: 12 }

try {
  user = { name: 'lucy' };
} catch (error) {
  console.log(error.name); // TypeError
}
```

## 全局对象与 this

| 环境 | 顶层绑定与 this |
| --- | --- |
| 浏览器经典 `<script>` | 顶层 `var`、函数声明通常关联 `window` 属性；`let`、`const`、`class` 不会以此方式创建属性 |
| 浏览器或 Node 的 ES Module | 顶层声明属于模块作用域，顶层 `this` 是 `undefined` |
| Node CommonJS 模块 | 顶层变量属于模块；顶层 `this` 初始为 `module.exports` |

`globalThis` 提供跨环境访问全局对象的名称，属于 ES2020。普通函数直接调用时，非严格模式的 `this` 通常为全局对象，严格模式为 `undefined`；对象方法调用、显式绑定和箭头函数另有规则，见 [函数与类](/docs/es6-functions-classes)。

浏览器经典脚本示例（不要改为 `type="module"` 后仍期待相同结果）：

```html
<script>
  var courseGlobalA = 1;
  let courseGlobalB = 2;
  console.log(window.courseGlobalA); // 1
  console.log(window.courseGlobalB); // undefined
  console.log(courseGlobalB); // 2
</script>
```

## 数组解构

数组解构按迭代顺序取值，可以跳过元素、匹配嵌套数组、设置默认值和收集剩余项。

```js
const [first, , third] = [1, 2, 3];
console.log(first, third); // 1 3

const [, [, value3, [, value5, , [, , value9, [value10]]]]] =
  [1, [2, 3, [4, 5, 6, [7, 8, 9, [10]]]]];
console.log(value3, value5, value9, value10); // 3 5 9 10

const [head, ...tail] = [1, 2, 3, 4];
console.log(head, tail); // 1 [2, 3, 4]

const [fallback = 2, explicitNull = 9] = [undefined, null];
console.log(fallback, explicitNull); // 2 null
```

默认值只在值为 `undefined` 时生效，`null`、`0`、`false` 不会触发默认值。过深的嵌套适合练习匹配规则，实际代码可分步取值以便阅读。

## 对象解构

对象解构按属性名匹配，与属性顺序无关；冒号既能引入新变量名，也能继续描述嵌套结构。

```js
const user = {
  uname: 'kevin',
  friends: { 1: { uname: 'lily' }, 2: { uname: 'lucy' } }
};
const {
  uname: owner,
  friends: { 1: { uname: firstFriend }, 2: { uname: secondFriend } },
  age = 12
} = user;
console.log(owner, firstFriend, secondFriend, age); // kevin lily lucy 12
```

这里的 `friends` 是匹配路径，不会自动创建同名变量；若同时需要整个对象，再写一项 `friends`。

```js
const source = { info: { tel: '123', address: '上海' } };
const { info, info: { tel: phone, address } } = source;
console.log(info.tel === phone, address); // true 上海

const { a = 2, ...rest } = { a: 1, b: 2, c: 3 };
console.log(a, rest); // 1 { b: 2, c: 3 }
```

对象剩余属性 `...rest` 属于 ES2018，它收集未匹配的自身可枚举属性。对 `null` 或 `undefined` 直接做对象解构会抛错；外层默认值只能处理 `undefined`。

课程中的电脑部件练习，归纳为相同属性名在不同层级的重命名：

```js
const computer = {
  name: '电脑',
  main: [{ name: '电源' }, { name: 'CPU' }],
  accessories: [{ name: '键盘' }, { name: '鼠标' }]
};
const {
  name: device,
  main: [{ name: power }, { name: cpu }],
  accessories: [{ name: keyboard }, { name: mouse }]
} = computer;
console.log(device, power, cpu, keyboard, mouse); // 电脑 电源 CPU 键盘 鼠标
```

## 函数参数解构

形参解构用于提取传入数组或对象的数据，参数整体的默认值用于允许省略参数。

```js
function sum([a = 1, b = 2] = []) {
  return a + b;
}
function describe({ title = '未命名', author = '未知' } = {}) {
  return `${title} - ${author}`;
}
console.log(sum(), sum([5])); // 3 7
console.log(describe({ title: '歌曲', author: '歌手' })); // 歌曲 - 歌手
console.log(describe()); // 未命名 - 未知
```

把对象先解构为变量，再作为实参传入，也是同一套赋值规则，并非另一种“实参解构”语法。

## 模板字符串

反引号支持多行文本，`${表达式}` 插入计算结果。缩进和换行也会成为字符串内容。

```js
const poem = { line: '举头望明月' };
const lastLine = '低头思故乡';
const text = `床前明月光，
疑是地上霜。
${poem.line}，
${lastLine}。`;
console.log(text);
```

## 来源记录

- `002_es6/code/readme.md`：let、const、解构、模板字符串；Babel 和数组部分分入对应专题。
- `002_es6/code/es6/02_let.js` 至 `07_string.js`：作用域、嵌套解构、参数与字符串示例。
- `002_es6/code/index.html`：作为浏览器脚本运行方式的参考。
- `003_es6/code/readme.md` 的复习部分：合并重复内容。
