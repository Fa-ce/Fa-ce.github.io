---
title: Proxy 与 Reflect 入门
description: 通过属性读取和赋值示例理解 Proxy、Reflect、receiver 与拦截限制。
date: 2023-04-26
category: fundamentals
tags: [javascript, es6, notes]
source: 尚学堂 ES6 课程 005_less_gulp/code/01_proxy.js 与 readme.md
---

# Proxy 与 Reflect

`new Proxy(target, handler)` 为目标建立代理，通过 handler 中的 trap 拦截操作。目标对象本身仍可被直接访问，只有经由代理发生的操作才经过相应拦截。

## 读取与赋值

课程给读取结果加上前缀，并通过 Reflect 完成实际读写。下面保留这个例子：

```js
const target = { uname: 'kevin', age: 12 };
const proxy = new Proxy(target, {
  get(target, key, receiver) {
    return '哈哈哈' + Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    return Reflect.set(target, key, value, receiver);
  }
});
console.log(proxy.uname); // 哈哈哈kevin
console.log(proxy.age); // 哈哈哈12
proxy.uname = 'lily';
console.log(proxy.uname, target.uname); // 哈哈哈lily lily
```

这个前缀用于演示，实际会把数字也变成字符串，不适合透明代理。`set` trap 应返回布尔结果；返回假值时严格模式赋值会抛错。使用 `Reflect.set()` 可以把底层操作的成功状态传回去。

## receiver 的作用

`Reflect.get(target, key, receiver)` 的第三个参数影响 getter 内的 `this`。直接用 `target[key]` 会把 getter 的接收者固定为 target，可能绕开代理上的其他读取。

```js
const target = {
  name: 'kevin',
  get greeting() { return `hello ${this.name}`; }
};
const proxy = new Proxy(target, {
  get(target, key, receiver) {
    if (key === 'name') return 'lily';
    return Reflect.get(target, key, receiver);
  }
});
console.log(proxy.greeting); // hello lily
console.log(target.greeting); // hello kevin
```

## 可拦截的操作

| 操作                         | trap                                                    |
| ---------------------------- | ------------------------------------------------------- |
| 读取、赋值、`in`、删除       | `get`、`set`、`has`、`deleteProperty`                   |
| 自身属性键、描述符、定义属性 | `ownKeys`、`getOwnPropertyDescriptor`、`defineProperty` |
| 原型读写                     | `getPrototypeOf`、`setPrototypeOf`                      |
| 扩展性读写                   | `isExtensible`、`preventExtensions`                     |
| 函数调用、构造               | `apply`、`construct`                                    |

共 13 种；函数调用和构造要求目标具备相应能力，普通对象不会因为设置 trap 就变成函数。

Reflect 提供对应的底层操作方法，便于在拦截中继续执行默认行为。Proxy 仍受对象不变量约束，例如不可配置且不可写的数据属性，`get` 不能返回与真实值不同的结果。因此前缀例子也不能无条件套用到冻结对象。[ECMAScript Reflect 规范](https://tc39.es/ecma262/multipage/reflection.html)、[Proxy 内部方法约束](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-proxy-object-internal-methods-and-internal-slots)。

## 来源记录

- `005_less_gulp/code/readme.md` 第 1 节：Proxy、Reflect 和 13 种操作。
- `005_less_gulp/code/01_proxy.js`：读取前缀与赋值转发。
- receiver 的 getter 示例与对象不变量说明为整理补充，用于解释原代码为何传递第三个参数。
