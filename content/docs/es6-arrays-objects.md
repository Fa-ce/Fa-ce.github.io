---
title: ES6 数组与对象扩展
description: 展开运算符、Array.from、Object.assign、属性描述符与图片预加载示例。
date: 2026-09-09
category: fundamentals
tags: [javascript, es6, notes]
source: 尚学堂 ES6 课程 002_es6、003_es6、004_es6 学习笔记与代码
---

# 数组与对象扩展

本篇承接 [解构赋值](/docs/es6-basics)，各代码块独立运行。对象 rest/spread 属于 ES2018，`Object.values()`、`Object.entries()` 属于 ES2017。

## 展开与剩余参数

展开将集合中的值放入调用参数、数组或对象；剩余语法收集未匹配的值。应按语法位置区分，不应以“在等号左边还是右边”作唯一判断。

```js
function sum(a, b, c) {
  return a + b + c;
}
console.log(sum(...[1, 2, 3])); // 6，可替代此处的 apply
console.log([...['a', 'b'], ...['c']]); // ['a', 'b', 'c']

function collect(first, ...rest) {
  return [first, rest];
}
console.log(collect(1, 2, 3)); // [1, [2, 3]]
```

数组和调用参数中的展开要求值可迭代。Array、String、Map、Set、TypedArray、`arguments`、NodeList 及 Generator 对象等可用；普通对象只有 `length` 并不足够。对象字面量中的展开则复制自身可枚举属性，不要求迭代器。

```js
console.log([...new Set([1, 1, 2])]); // [1, 2]
console.log([...new Map([['a', 1]])]); // [['a', 1]]
console.log([...'abc']); // ['a', 'b', 'c']
```

## 复制与合并是浅拷贝

```js
const original = [{ name: 'kevin' }, 1];
const copy = [...original];
original[0].name = 'lily';
original[1] = 2;
console.log(copy[0].name, copy[1]); // lily 1

const merged = { ...{ a: 1, c: 3 }, ...{ d: 4, c: 5 } };
console.log(merged); // { a: 1, c: 5, d: 4 }，后面的同名属性覆盖前面的
```

新容器与旧容器不同，但嵌套对象仍共享引用。

## Array.from、Array.of 与 fill

| API | 用途 | 注意 |
| --- | --- | --- |
| `Array.from(value)` | 将类数组或可迭代对象转为数组 | 可接收第二个映射函数参数 |
| `Array.of(...items)` | 将参数逐项放入数组 | `Array.of(3)` 是 `[3]`，不是三个空位 |
| `array.fill(value)` | 用一个值填充数组 | 原地修改；对象值会重复引用同一个对象 |

```js
const arrayLike = { 0: 'a', 1: 'b', 2: 'hello', length: 3 };
console.log(Array.from(arrayLike)); // ['a', 'b', 'hello']
console.log(Array.from({ length: 3 }, (_, index) => index + 1)); // [1, 2, 3]
console.log(Array.of(3), new Array(3).length); // [3] 3
console.log(new Array(5).fill(3)); // [3, 3, 3, 3, 3]

function toArray() {
  return [...arguments];
}
console.log(toArray(1, 2, 3)); // [1, 2, 3]
```

## 对象字面量扩展

属性值是同名变量时可简写，方法可省略 `function`，计算属性名写在方括号中。

```js
const x = 20;
const key = 'uname';
const obj = {
  x,
  [key]: 'kevin',
  ['a' + 'ge']: 12,
  sum(a, b) { return a + b; }
};
console.log(obj.x, obj.uname, obj.age, obj.sum(1, 2)); // 20 kevin 12 3
```

## Object.is

和 `===` 的主要差异：`Object.is(NaN, NaN)` 为真，`Object.is(+0, -0)` 为假。对象仍按身份比较，不比较内容。

```js
console.log(Object.is(NaN, NaN)); // true
console.log(Object.is(+0, -0)); // false
console.log(+0 === -0); // true
console.log(Object.is({}, {})); // false
```

## Object.assign 与属性描述符

`Object.assign(target, ...sources)` 把源对象自身可枚举属性的值赋给目标，返回目标对象；后来的同名属性覆盖前面的。它是浅拷贝，不会复制完整属性描述符，读取源属性时也可能触发 getter。

```js
const source = { visible: 6 };
Object.defineProperty(source, 'hidden', {
  value: 7,
  writable: false,
  enumerable: false,
  configurable: false
});
const target = {};
const result = Object.assign(target, { a: 1 }, source);
console.log(result === target); // true
console.log(Object.keys(result)); // ['a', 'visible']
console.log(Object.getOwnPropertyDescriptor(source, 'hidden').enumerable); // false
```

数据属性描述符中，`value` 是值，`writable` 控制可否赋值，`enumerable` 控制能否参与常见枚举，`configurable` 控制删除及重新配置。通过 `defineProperty` 新建属性时，省略的这三个布尔选项默认都是 `false`。

## keys、values、entries

这三个方法分别取得自身可枚举的字符串键、对应值、键值对；不包含继承属性或 Symbol 键。

```js
const images = { head: '1.jpg', role: '2.jpg' };
console.log(Object.keys(images)); // ['head', 'role']
console.log(Object.values(images)); // ['1.jpg', '2.jpg']
console.log(Object.entries(images)); // [['head', '1.jpg'], ['role', '2.jpg']]
```

### 浏览器图片预加载

课程 `01_object.js` 用计数器判断四张图片是否全部加载。下面保留“按名称建立图片映射”的用途，改为 Promise 聚合，并补上错误与超时处理。示例使用内嵌 SVG 作为测试图片，不依赖原目录图片。

```html
<script>
  function loadImage(url, timeoutMs = 5000) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      const timer = setTimeout(() => finish(new Error('图片加载超时')), timeoutMs);
      function finish(error) {
        clearTimeout(timer);
        image.onload = null;
        image.onerror = null;
        if (error) reject(error);
        else resolve(image);
      }
      image.onload = () => finish();
      image.onerror = () => finish(new Error('图片加载失败'));
      image.src = url;
    });
  }

  const square = color => 'data:image/svg+xml,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" fill="${color}"/></svg>`
  );
  const paths = { head: square('red'), role: square('blue') };

  async function preload() {
    const pairs = await Promise.all(Object.entries(paths).map(async ([name, url]) => {
      return [name, await loadImage(url)];
    }));
    const loaded = Object.fromEntries(pairs);
    loaded.head.alt = '预加载的红色方块';
    document.body.append(loaded.head);
    console.log(Object.keys(loaded)); // ['head', 'role']
  }
  preload().catch(error => console.error(error.message));
</script>
```

将脚本放在 HTML 的 `body` 末尾运行。这里用于还原映射的 `Object.fromEntries()` 属于 ES2019，是整理时补充的 API。Promise 用法见 [异步编程](/docs/js-promise-async)。

## 来源记录

- `002_es6/code/es6/08_array.js` 与对应 README：展开、浅拷贝、类数组和数组方法。
- `003_es6/code/01_object.js`、README 新知识点第 1 节：对象扩展、描述符、图片预加载。
- `003_es6/code/index.html`、`images/1.jpg` 至 `4.jpg`：原浏览器演示入口及素材；整理版改用内嵌测试图片。
- `004_es6/code/readme.md` 对象复习部分：合并去重。
