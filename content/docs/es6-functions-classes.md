---
title: ES6 函数与 Class
description: 默认参数、rest、箭头函数的 this、Class 方法、访问器、静态成员与继承。
date: 2023-04-26
category: fundamentals
tags: [javascript, es6, notes]
source: 尚学堂 ES6 课程 004_es6、006_webpack 学习笔记与代码
---

# 函数与 Class

示例按主题拆分，独立运行。函数参数解构的基础见 [ES6 基础](/docs/es6-basics)。

## 默认参数和 rest

默认参数只对缺省值或 `undefined` 生效，`0`、`false`、`null` 都会被保留。用 `a || 默认值` 会错误覆盖合法的假值。

```js
function sum(a = 1, b = 5) { return a + b; }
console.log(sum(), sum(2), sum(2, 0)); // 6 7 2

function legacySum(a, b) {
  a = a === undefined ? 3 : a;
  b = b === undefined ? 2 : b;
  return a + b;
}
console.log(legacySum(1, 0)); // 1，原例结果正确，错误的是课堂注释

function options({ a = 3, b = 8 } = {}) { return a + b; }
console.log(options({ num1: 3, num2: 10 })); // 11：属性名不匹配，使用默认值

function collect(first, second, ...rest) { return rest; }
console.log(collect(1, 2, 3, 4, 5)); // [3, 4, 5]
```

rest 必须是最后一个形参，得到的值是真正的数组。

### 严格模式与 name

参数列表包含默认值、解构或 rest 时，不能在函数体中再写独立的 `'use strict'` 指令。可以在外层脚本启用严格模式，ES Module 则默认严格。

```js
'use strict';
function sum(a = 1, b = 2) { return a + b; }
console.log(sum.name, sum()); // sum 3
```

`name` 可辅助调试，但不宜作为业务标识：它可能被推断、绑定或构建压缩改变。

## 箭头函数

```js
const double = value => value * 2;
const add = (a, b) => a + b;
const user = name => ({ name });
console.log(double(3), add(1, 2), user('kevin').name); // 6 3 kevin
```

表达式体隐式返回；语句块体需要显式 `return`。返回对象字面量时加括号，避免被解析为语句块。

### this 来自外层作用域

箭头函数没有自己的 `this`，`call`、`apply`、`bind` 不能替换它捕获的外层 `this`。

```js
function makeReader() {
  return () => this.name;
}
const read = makeReader.call({ name: 'kevin' });
console.log(read()); // kevin
console.log(read.call({ name: 'lily' })); // kevin
```

普通对象方法的 `this` 取决于调用方式。把它取出来单独调用，接收者会丢失；在严格模式下通常表现为 `this === undefined`。

箭头函数不能通过 `new` 构造，没有自己的 `arguments`，也不能声明为 Generator。需要任意数量的参数时用 rest；箭头函数中访问到的 `arguments` 若存在，来自外层普通函数。

## Class 与原型方法

Class 基于 JavaScript 原型机制，提供更清晰的构造、方法与继承语法，同时有严格模式、必须用 `new` 等规则。

```js
class Person {
  constructor(name) { this.name = name; }
  say() { return `我叫${this.name}`; }
  get uname() { return this.name; }
  set uname(value) { this.name = value; }
  static kind() { return 'Person'; }
}
const person = new Person('小明');
person.uname = 'xiaoming';
console.log(person.say(), person.uname); // 我叫xiaoming xiaoming
console.log(Person.kind()); // Person
console.log(Object.keys(Person.prototype)); // []
console.log(Object.getOwnPropertyNames(Person.prototype)); // ['constructor', 'say', 'uname']
```

`say()` 和访问器定义在原型上，且不可枚举。静态方法定义在类本身，实例不能直接调用；通过类调用静态方法时，`this` 指向调用它的类。

### 保留方法接收者

可以在构造器中绑定方法，也可以使用箭头函数实例字段。

```js
class BoundPerson {
  constructor(name) {
    this.name = name;
    this.say = this.say.bind(this);
  }
  say() { return this.name; }
}
const { say } = new BoundPerson('小明');
console.log(say()); // 小明
```

```js
class FieldPerson {
  constructor(name) { this.name = name; }
  say = () => this.name;
}
const person = new FieldPerson('lily');
const { say } = person;
console.log(say()); // lily
console.log(Object.keys(person)); // ['say', 'name']
console.log(Object.prototype.hasOwnProperty.call(person, 'say')); // true
```

类字段属于 ES2022。箭头函数字段是每个实例自己的可枚举属性，并不是原型上的共享方法。因此原笔记“类中所有方法都不可枚举”只适合描述方法定义，不能套用到函数字段。

## extends 与 super

```js
class Bird {
  constructor(wings, legs) {
    this.wings = wings;
    this.legs = legs;
  }
  fly() { return '会飞'; }
}
class Sparrow extends Bird {
  constructor(name) {
    super(2, 2);
    this.name = name;
  }
  jump() { return `${this.legs}条腿会跳`; }
}
const lily = new Sparrow('lily');
console.log(lily.fly(), lily.jump()); // 会飞 2条腿会跳
console.log(lily instanceof Bird); // true
```

通常在派生构造器中先调用 `super()`，再访问 `this`；未显式写派生构造器时，默认构造器会转发参数。类方法中可用 `super.method()` 调用父类方法。

## Function 构造器与字符串

`006_webpack/code/01_gulp/es6/06_newFunction.js` 尝试把 `<div>容器</div>` 直接传给 `new Function`，它不是 JavaScript 函数体，会产生语法错误。若只是想返回 HTML 字符串，普通函数或模板字符串即可。

```js
const makeMarkup = () => '<div>容器</div>';
console.log(makeMarkup()); // <div>容器</div>

const add = new Function('a', 'b', 'return a + b;');
console.log(add(1, 2)); // 3
```

后一个例子仅说明构造器接受合法 JavaScript 文本；不要把用户输入传给它。它不捕获当前局部词法作用域，通常也不需要用来生成页面内容。

## 来源记录

- `004_es6/code/02_function.js`、`03_function.js`、`04_class.js`、`05_class.js` 及 README 对应章节。
- `006_webpack/code/01_gulp/es6/02_function.js`、`03_function.js`、`05_class.js`：同内容合并。
- `006_webpack/code/01_gulp/es6/06_newFunction.js`：保留错误原因和修正示例。
- `002_es6/code/es6/01_useBabel.js`、`007_webpack/code/src/main.js` 中的 Class 示例：归并；后者 `say()` 中的 `name` 修正为 `this.name`。
