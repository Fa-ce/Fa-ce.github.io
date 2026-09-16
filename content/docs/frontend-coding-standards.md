---
title: 前端团队编码规范
description: HTML / CSS / JavaScript 三端统一的团队编码约定，含缩进、命名、语法与禁用项，可直接作为 Code Review 依据。
date: 2025-12-17
category: standards
tags: [html, css, javascript, es6, best-practice, guide]
---

> 本规范由团队原有的 HTML / CSS / JavaScript 三份规范整合而成，消解了原文中若干互相矛盾与前后颠倒之处（详见文末「整合修订说明」）。
>
> **约束力**：本文所有条目均为团队约定，Code Review 以此为依据。标注「强制」的条目不允许例外，标注「推荐」的可在有充分理由时偏离，但需在 PR 中说明。

## 〇、通用约定

这三条跨越所有文件类型，优先级最高。

| 项目     | 约定                           | 强制 |
| -------- | ------------------------------ | :--: |
| 缩进     | **统一 2 个空格**，禁用 Tab    | 强制 |
| 文件编码 | **UTF-8 无 BOM**               | 强制 |
| 换行符   | LF (`\n`)                      | 强制 |
| 空行     | 连续空行不超过 1 行            | 推荐 |
| 大小写   | 标签名、选择器、属性名一律小写 | 强制 |

> 缩进统一为 2 空格是本次整合的**重要修订**。原 CSS 规范文字写「四个空格」但其全部示例代码实为 2 空格，与 HTML、JS 规范冲突。以 2 空格为准。

---

## 一、HTML 规范

### 1.1 文档声明

必须使用 HTML5 文档声明，置于文件首行。

```html
<!DOCTYPE html>
```

### 1.2 页面语言

使用 `zh-CN`。虽然 BCP 47 推荐 `cmn-Hans-CN`（普通话，简体，中国大陆），但考虑浏览器与操作系统兼容性，团队统一用前者。

```html
<html lang="zh-CN">
```

**已废弃写法，禁止使用**（2009 年起 `cmn`/`wuu`/`yue`/`gan` 已由 extlang 升级为 language）：

```
zh-cmn, zh-cmn-Hans, zh-cmn-Hant, zh-wuu, zh-yue, zh-gan
zh-Hans-CN, zh-Hant-TW  等 zh-Hans* / zh-Hant* 系列
```

### 1.3 字符编码

统一 `UTF-8`，且**必须写成大写连字符形式**。

```html
<meta charset="UTF-8">
```

不要写成 `utf-8`、`utf8` 或 `UTF8`。依据 [RFC 3629](http://www.ietf.org/rfc/rfc3629)，标准写法是 `UTF-8`；`UTF8` 只是某些编程系统的标识符（如 .NET 的 `System.Text.Encoding.UTF8`），不是编码名。

### 1.4 标签闭合

HTML 元素分五类：空元素（`area`/`base`/`br`/`col`/`embed`/`hr`/`img`/`input`/`link`/`meta`/`param`/`source`/`track`/`wbr`）、原始文本元素（`script`/`style`）、RCDATA 元素（`textarea`/`title`）、外来元素（MathML / SVG 命名空间）、常规元素。

团队约定：

- 所有有起止标签的元素**都要写全**，即使规范允许省略
- 空元素标签**不加**结尾斜杠

```html
<!-- 推荐 -->
<div>
  <h1>标题</h1>
  <p>有始有终的段落</p>
</div>
<br>

<!-- 不推荐 -->
<div>
  <h1>标题</h1>
  <p>有始无终的段落
</div>
<br/>
```

### 1.5 类型属性

HTML5 中 CSS 与 JS 的类型属性已有默认值，**应当省略**。

```html
<!-- 推荐 -->
<link rel="stylesheet" href="">
<script src=""></script>

<!-- 不推荐 -->
<link rel="stylesheet" type="text/css" href="">
<script type="text/javascript" src=""></script>
```

> **注**：原规范此节的推荐 / 不推荐示例标反了。此处已修正为符合其文字表述（「不需要为 CSS、JS 指定类型属性」）的版本。

### 1.6 元素属性

- 属性值统一使用**双引号**
- 布尔属性可写全值以求明确

```html
<!-- 推荐 -->
<input type="text">
<input type="radio" name="name" checked="checked">

<!-- 不推荐 -->
<input type=text>
<input type='text'>
```

### 1.7 特殊字符转义

`<` 与 `>` 在文本中必须用字符实体，否则浏览器会当作标签解析。`href` 不允许为空字符串。

```html
<!-- 推荐 -->
<a href="#">more&gt;&gt;</a>
<a href="javascript:;">more&gt;&gt;</a>

<!-- 不推荐 -->
<a href="#">more>></a>
<a href="">more>></a>
```

### 1.8 嵌套规则

块级元素独占一行，内联元素可同行。段落与标题元素**只能嵌套内联元素**。

```html
<!-- 推荐 -->
<div>
  <h1></h1>
  <p></p>
</div>
<p><span></span><span></span></p>

<!-- 不推荐：块级元素嵌进了 h1 / p -->
<h1><div></div></h1>
<p><div></div></p>
```

### 1.9 数字输入框

移动端纯数字输入使用 `type="tel"` 而非 `type="number"`，避免 `number` 类型在各浏览器下的步进器与格式化差异。

```html
<input type="tel">
```

---

## 二、CSS 规范

### 2.1 @charset 规则

样式文件**必须**写 `@charset`，且必须在**文件第一行第一个字符**开始，否则可能被 BOM 覆盖。

```css
/* 推荐 */
@charset "UTF-8";

.jdc { }
```

```css
/* 不推荐：前面有注释，规则未在首行首字符 */
/**
 * @desc File Info
 */
@charset "UTF-8";

/* 不推荐：大写 */
@CHARSET "UTF-8";

/* 不推荐：完全缺失 */
.jdc { }
```

`@charset "";` 十个字符须全小写、不含转义符，编码名允许大小写混写。**坚决不使用 BOM**。

### 2.2 代码格式

统一使用**展开格式**（Expanded），禁用紧凑格式（Compact）。

```css
/* 推荐 */
.jdc {
  display: block;
  width: 50px;
}

/* 不推荐 */
.jdc { display: block;width: 50px;}
```

### 2.3 选择器

- 尽量少用通用选择器 `*`
- **不使用 ID 选择器**
- 不使用无语义的标签选择器
- 命名使用**中划线**分隔

```css
/* 推荐 */
.jdc {}
.jdc .test {}

/* 不推荐 */
* {}
#jdc {}
.jdc div {}
```

### 2.4 可读性细节

每条声明末尾**必须**加分号。以下空格规则均为强制：

```css
/* 左括号前一个空格，冒号后一个空格 */
.jdc {
  width: 100%;
}

/* 逗号后一个空格 */
.jdc {
  box-shadow: 1px 1px 1px #333, 2px 2px 2px #ccc;
}

/* 颜色函数括号内不留空格 */
.jdc {
  color: rgba(255, 255, 255, 0.5);
}
```

多个选择器各占一行，新声明块另起一行：

```css
/* 推荐 */
.jdc,
.jdc_logo,
.jdc_hd {
  color: #ff0;
}
.nav {
  color: #fff;
}

/* 不推荐 */
.jdc,jdc_logo,.jdc_hd {
  color: #ff0;
}.nav {
  color: #fff;
}
```

### 2.5 取值简写

十六进制颜色能简写则简写；`0` 值**不带单位**。

```css
/* 推荐 */
.jdc {
  color: #fff;
  margin: 0 10px;
}

/* 不推荐 */
.jdc {
  color: #ffffff;
  margin: 0px 10px;
}
```

### 2.6 属性值引号

CSS 中需要引号时统一用**单引号**（注意：与 HTML 属性用双引号的规则相反，勿混淆）。

```css
/* 推荐 */
.jdc {
  font-family: 'Hiragino Sans GB';
}
```

### 2.7 私有前缀

浏览器私有前缀在前，标准属性在后，确保标准实现最终生效。

```css
.jdc {
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  -ms-border-radius: 10px;
  border-radius: 10px;
}
```

> 现代项目建议交由 Autoprefixer 处理，不手写前缀。手写仅用于工具链不可用的场景。

---

## 三、JavaScript 规范

### 3.1 变量声明

**一律使用 `const`，需要重新赋值时才用 `let`，禁用 `var`。** 未加关键字的赋值会污染全局作用域，绝对禁止。

```js
// bad
var a = 1;
demo = new Demo();

// good
const a = 1;
let count = 1;
const demo = new Demo();
```

`const` 与 `let` 分组声明：

```js
// bad
let a;
const b;
let c;

// good
const b;
let a;
let c;
```

### 3.2 对象与数组

一律使用字面量创建，禁用构造函数形式。

```js
// bad
const a = new Object();
const items = new Array();

// good
const a = {};
const items = [];
```

添加数组元素用 `push`，不要用索引赋值：

```js
// bad
items[items.length] = 'test';

// good
items.push('test');
```

使用属性与方法简写，且简写属性**集中放在前面**：

```js
const job = 'FrontEnd';
const department = 'JDC';

// good
const item = {
  job,
  department,
  sex: 'male',
  age: 25,

  addValue(val) {
    return item.value + val;
  }
};
```

不要用保留字作为键名（`default`、`class`、`new` 等）。

### 3.3 解构赋值

取对象多个属性、数组多个值时使用解构。**函数返回多值时用对象解构而非数组解构**——数组解构强迫调用方记住顺序。

```js
// good
function getFullName ({ firstName, lastName }) {
  return `${firstName} ${lastName}`;
}

// good：调用方无需关心顺序
function doSomething () {
  return { top, right, bottom, left };
}
const { top, left } = doSomething();
```

### 3.4 字符串

统一**单引号**。拼接用模板字符串，长字符串换行用 `+` 且运算符置于行尾，禁用续行符 `\`。

```js
// good
const department = 'JDC';
const str = `ab${test}`;

const long = '凹凸实验室 凹凸实验室' +
  '凹凸实验室 凹凸实验室';
```

### 3.5 函数

- 优先使用**函数声明**而非函数表达式（声明会被完整提升，利于组织代码）
- 参数不超过 5 个
- 不在非函数代码块（`if`/`for`）内声明函数
- 用默认参数替代对参数重新赋值
- 用剩余参数 `...args` 替代 `arguments`（前者是真数组）

```js
// bad
const foo = function () {};
function test (opts) {
  opts = opts || {};
}
function test () {
  const args = Array.prototype.slice.call(arguments);
}

// good
function foo () {}
function test (opts = {}) {}
function test (...args) {
  return args.join('');
}

// bad：块内声明函数
if (isUse) {
  function test () {}
}

// good
let test;
if (isUse) {
  test = () => {};
}
```

### 3.6 类与原型

使用 `class` 语法，避免直接操作 `prototype`。**派生类**的 constructor 中必须调用 `super()`。

```js
// good
class Queue {
  constructor (contents = []) {
    this._queue = [...contents];
  }

  pop () {
    const value = this._queue[0];
    this._queue.splice(0, 1);
    return value;
  }
}

// 派生类才需要 super()
class PriorityQueue extends Queue {
  constructor (contents = []) {
    super(contents);
  }
}
```

> **修订说明**：原规范写「constructor 必须加 `super()`」并在一个**非派生类**示例中调用 `super()`。这是错误的——基类 constructor 中调用 `super()` 会抛 `SyntaxError`。`super()` 仅在 `extends` 派生类中必需且必须在使用 `this` 之前调用。

### 3.7 模块

使用 ES6 `import` / `export`，不使用 `require`。避免通配符导入。

```js
// bad
const util = require('./util');
import * as Util from './util';

// good
import Util from './util';
import { Util } from './util';
```

### 3.8 迭代与属性访问

优先使用数组高阶方法（`forEach`/`map`/`reduce`）而非 `for...of`。访问对象属性用点号，仅在键名为变量时用方括号。

```js
const numbers = [1, 2, 3, 4, 5];

// good
const sum = numbers.reduce((total, num) => total + num, 0);

// bad
const name = joke['name'];

// good
const name = joke.name;
```

`map`/`reduce`/`filter` 回调必须有 `return`（单表达式箭头函数的隐式返回除外）。

### 3.9 分号

**强制使用分号**，遵循 Standard 规范。

```js
// good
const test = 'good';
(function () {
  const str = 'hahaha';
})();
```

### 3.10 禁用项

以下一律禁止，无例外：

| 禁用             | 原因                                             |
| ---------------- | ------------------------------------------------ |
| `eval()`         | 任意代码执行，安全风险与性能损耗                 |
| `with () {}`     | 产生不可预测的作用域链                           |
| 修改内置对象原型 | 污染 `Object` / `Array` 等全局原型，破坏第三方库 |

### 3.11 for-in 检查

对对象使用 `for...in` 时必须配合 `hasOwnProperty` 检查，团队已启用 ESLint 的 `guard-for-in` 规则强制此项。注意对数组做 `for...in` 时**遍历顺序不保证**，应改用索引循环或数组方法。

### 3.12 标准特性

优先使用标准方法以保证可移植性，例如 `string.charAt(3)` 优于 `string[3]`。

---

## 整合修订说明

本文由 `rules/html.md`、`rules/css.md`、`rules/js.md` 三份原始规范整合。**逐条核对原文后，做了以下修订**，均为原文自身矛盾或技术错误：

**修订一 · 缩进统一为 2 空格。** 原 CSS 规范文字写「统一使用四个空格」，但该节及全文所有示例代码实际均为 2 空格，且 HTML、JS 两份规范都明确要求 2 空格。判定为文字笔误，统一为 2 空格。

**修订二 · HTML「类型属性」示例颠倒。** 原文文字说「不需要为 CSS、JS 指定类型属性」，但标注为「推荐」的示例恰恰写了 `type="text/css"`，「不推荐」的示例反而是省略版本。已按文字表述对调。

**修订三 · `super()` 适用范围。** 原文写「constructor 必须加 `super()`」并在非派生类 `class Queue` 中调用。此为技术错误：基类中调用 `super()` 会抛 `SyntaxError`，仅 `extends` 派生类需要。已修正表述并补充正确示例。

**修订四 · 补充双引号 / 单引号的适用边界。** HTML 属性用双引号、CSS 属性值用单引号、JS 字符串用单引号——三条规则分散在三份文档中容易混淆，已在 CSS 一节加注提示。

**保留但标注的内容：** CSS 私有前缀手写规则予以保留，但补充说明现代项目应交由 Autoprefixer 处理。原文中被 HTML 注释掉的段落（数组展开运算符、分号可选性讨论）未纳入，因其已被后续条目取代。
