---
title: Promise、Generator 与 async/await
description: 从回调到 Promise 链、组合方法、Generator 执行与 async 错误处理的课程示例整理。
date: 2026-09-09
category: fundamentals
tags: [javascript, es6, notes]
source: 尚学堂 ES6 课程 003_es6、004_es6 学习笔记与代码
---

# JavaScript 异步编程

课程用 jQuery 请求外部接口说明异步流程。这里保留成功、失败、链式依赖和并发的教学目的，改用本地数据与短定时器，各示例独立运行。

Promise、Generator 属于 ES2015，async/await 属于 ES2017，`finally` 属于 ES2018，`allSettled` 属于 ES2020。

## 创建 Promise

Promise 描述一个最终可能成功或失败的结果。执行器同步执行；注册在 `then` 上的回调异步执行，不会在当前同步调用栈中立即运行。

```js
const events = [];
const promise = new Promise(resolve => {
  events.push('executor');
  resolve(123);
});
promise.then(value => {
  events.push(value);
  console.log(events); // ['executor', 'sync', 123]
});
events.push('sync');
```

| 状态 | 含义 |
| --- | --- |
| `pending` | 尚未兑现或拒绝 |
| `fulfilled` | 已兑现，有结果值 |
| `rejected` | 已拒绝，有原因 |

从 pending 进入 fulfilled 或 rejected 后，状态不能再改变。`resolved` 不是第四种状态，也不总等于 fulfilled：调用 `resolve(另一个 Promise)` 会跟随它，仍可能暂时 pending 或最终 rejected。[ECMAScript Promise 规范](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-promise-objects)。

### 封装回调式异步任务

```js
function requestMock(shouldFail = false) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) reject(new Error('模拟请求失败'));
      else resolve({ id: 1, title: '课程示例' });
    }, 10);
  });
}

requestMock().then(data => console.log(data.title)).catch(console.error); // 课程示例
requestMock(true).catch(error => console.log(error.message)); // 模拟请求失败
```

原 jQuery `$.ajax` 的映射是 `success → resolve`、`error → reject`。Promise 不限于网络请求，也可以封装文件、图片或其他回调；执行器中的异步回调若自行抛错，不会被构造器自动捕获，应显式捕获并调用 reject。

## then 返回新的 Promise

`then(onFulfilled, onRejected)` 返回新的 Promise。回调返回普通值，则下游得到该值；没有 return 得到 `undefined`；返回 Promise 或 thenable 则跟随其结果；抛异常则下游拒绝。

```js
const original = Promise.resolve(10);
const next = original.then(value => value * 2);
console.log(original === next); // false
next
  .then(value => Promise.resolve(value + 3))
  .then(value => console.log(value)) // 23
  .then(value => console.log(value === undefined)); // true
```

有依赖的异步操作应返回下一个 Promise，避免出现“启动了任务却没有让链等待”的情况。

```js
function getUser() { return Promise.resolve({ id: 1 }); }
function getArticles(userId) { return Promise.resolve([`article-${userId}`]); }

getUser()
  .then(user => getArticles(user.id))
  .then(articles => console.log(articles)) // ['article-1']
  .catch(console.error);
```

## catch 与 finally

`catch(onRejected)` 等价于 `then(undefined, onRejected)`，处理传到当前链位置的拒绝；不会捕获不属于这条链的所有异常。`then(success, failure)` 中的 failure 也不会捕获同一个 success 回调抛出的错误，需要后续 catch。

```js
Promise.reject(new Error('第一次失败'))
  .catch(error => {
    console.log(error.message); // 第一次失败
    return 88; // 恢复为成功结果
  })
  .then(value => {
    console.log(value); // 88
    throw new Error('第二次失败');
  })
  .catch(error => {
    console.log(error.message); // 第二次失败
    return 99;
  })
  .finally(() => console.log('收尾'))
  .then(value => console.log(value)); // 99
```

`finally` 在上游落定后执行，不接收结果参数，适合收尾。正常返回不会替换原结果；但它若抛错或返回拒绝的 Promise，会使下游拒绝。若上游一直 pending，finally 也不会凭空执行。

## Promise 组合方法

| 方法 | 行为 |
| --- | --- |
| `Promise.all(items)` | 全部成功后按输入顺序返回值数组；任一拒绝则整体拒绝 |
| `Promise.race(items)` | 跟随最先落定的结果，可能成功也可能失败 |
| `Promise.allSettled(items)` | 等待全部落定，按输入顺序返回各自状态和值或原因 |
| `Promise.resolve(value)` | 得到采用 value 结果的 Promise，包括吸收 thenable |
| `Promise.reject(reason)` | 得到以 reason 拒绝的 Promise |

组合方法不负责“启动”已有 Promise，也不会自动取消其他任务。

```js
async function compare() {
  const slow = new Promise(resolve => setTimeout(() => resolve('slow'), 20));
  const fast = new Promise(resolve => setTimeout(() => resolve('fast'), 5));
  const first = Promise.race([slow, fast]);
  console.log(await first); // fast
  console.log(await Promise.all([slow, fast])); // ['slow', 'fast']

  const outcomes = await Promise.allSettled([
    Promise.resolve(1),
    Promise.reject(new Error('失败'))
  ]);
  console.log(outcomes.map(item => item.status)); // ['fulfilled', 'rejected']
  console.log(outcomes[1].reason.message); // 失败
}
compare().catch(console.error);
```

空集合的边界：`all([])`、`allSettled([])` 兑现为空数组，`race([])` 一直 pending。输入为空时也需要按业务意图选择。

## Generator：暂停与恢复

调用 `function*` 得到迭代器，并不立即执行函数体。`next()` 推进到下一次 yield，返回 `{ value, done }`；后续 `next(value)` 的参数成为上一次 yield 表达式的值。

```js
function* steps() {
  const input = yield 123;
  yield input * 3;
  return '结束';
}
const iterator = steps();
console.log(iterator.next()); // { value: 123, done: false }
console.log(iterator.next(10)); // { value: 30, done: false }
console.log(iterator.next()); // { value: '结束', done: true }
```

第一次 next 没有可接收参数的前一个 yield，所以传参没有这一作用。Generator 是通用的可暂停控制流程工具，并不局限于异步。

### yield Promise 不会自动等待

需要调用方或执行器等待 Promise，再把结果传回迭代器。

```js
function* steps() {
  const a = yield Promise.resolve(123);
  const b = yield Promise.resolve(a * 3);
  return b;
}
async function runTwoSteps() {
  const iterator = steps();
  const first = iterator.next();
  const second = iterator.next(await first.value);
  const last = iterator.next(await second.value);
  console.log(last.value, last.done); // 369 true
}
runTwoSteps().catch(console.error);
```

这只是两步示例，不是通用执行器。课程中 `co` 库处理执行器工作，其原调用方式作为 Node 代码片段保留，需已有 `co` 依赖：

```js
const co = require('co');
function* task() {
  const a = yield Promise.resolve(123);
  const b = yield Promise.resolve(a * 3);
  return b;
}
co(task()).then(value => console.log(value)).catch(console.error); // 369
```

README 提到 redux-saga，只作为 Generator 应用方向记录；课程没有提供 saga 实现。

## async/await

async 函数总返回 Promise。return 的值成为兑现结果，未捕获异常成为拒绝；await 暂停当前 async 函数的后续执行，不阻塞整个 JavaScript 线程。

```js
async function calculate() {
  const a = await new Promise(resolve => setTimeout(() => resolve(123), 10));
  const b = await Promise.resolve(a * 10);
  return b;
}
calculate().then(value => console.log(value)).catch(console.error); // 1230
```

await 也接受普通值或 thenable，普通值相当于经过 Promise 解析再继续。课程所说“Generator + co”可帮助理解自动执行流程，但 async 函数不是 Generator，不能对它的返回值调用 next。

### 拒绝与错误处理

```js
async function recover() {
  try {
    await Promise.reject(new Error('模拟失败'));
    return '不会执行';
  } catch (error) {
    return `已处理：${error.message}`;
  }
}
recover().then(value => console.log(value)); // 已处理：模拟失败
```

await 的拒绝若没有在函数内部捕获，会中断后续执行并让整个 async 函数拒绝；被 catch 处理后则可继续。彼此独立的任务可以先启动再 `await Promise.all(...)`，有数据依赖的任务按顺序 await。

## 网络请求工具

课程列出 jQuery Ajax、Fetch 和 Axios。Fetch 是宿主环境提供的 Web API，不是 ES6 语言内置特性；Axios、jQuery 是第三方库。真实请求需要处理失败、超时和响应状态，代理场景见 [Webpack 开发服务器](/docs/webpack-basics)。

## 来源记录

- `003_es6/code/02_promise.js`、`03_promise.js`、`04_promise.js`：回调封装、Promise 链和组合方法，替换原外部接口。
- `003_es6/code/05_generator.js`、`06_async.js`：迭代器、co 与自动执行流程。
- `004_es6/code/01_async.js`、`006_webpack/code/01_gulp/es6/01_async.js`：等待结果与错误传播，同内容合并。
- `003_es6/code/readme.md`、`004_es6/code/readme.md` 的异步章节：去重复习，保留独有知识点。
