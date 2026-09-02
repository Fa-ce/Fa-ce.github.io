---
title: JavaScript 异步编程
description: 归档内容，Generator/Promise/async 专题笔记，不对外展示。
date: 2024-10-18
category: fundamentals
tags: [javascript, es6, notes]
draft: true
---

# 异步



### Generator

generator是**异步任务的容器**（**交出函数的执行权**（即暂停执行）），需要用.next()方法启动。可以分阶段运行。

yield命令是异步不同阶段的分界线，定义不同的状态

每次调用一个函数执行一次yield ：返回一个对象（value 和done 俩个参数）value表示yield或者return里面的值，done（Boolean）表示函数是否执行完

yield可以用来加强控制（懒汉式加载 调用函数指针和调用生成器是两码事）

```js
// 函数yield外部的变量或者输出在后面用迭代器.next()调用，第一次调用会开辟空间，将这些数据放在内存中，在迭代器没有结束前都不会释放空间；
// generator迭代器.next()方法可以传递参数；参数可以覆盖前面yield返回的值
// 不过给第一个 next启动器传递值没有意义：因为next刚启动时候前面没有yield返回的值可以覆盖，给第一个next传递参数没有
        function* fn() {
            var _n = 12;
            var _v = yield _n + 12; // _v -> yield命令返回值通过后续的next参数决定(没有则为undefined)
            console.log('第二个next后执行')
            yield _v;
        }
        var a = fn();
        console.log(a.next()); //{value: 24, done: false} 
        console.log(a.next()); //第二个next后执行 {value: undefined, done: false}

		var b = fn();
        console.log(b.next()); //{value: 24, done: false} 
        console.log(b.next('abc')); //第二个next后执行 {value: 'abc', done: false}
```



### promise

**Promise（承诺） 是异步编程的一种解决方案**，在没有Promise的时候，异步编程是通过**回调函数**来解决的，将函数作为参数用来获取异步操作得到的数据，但是嵌套多层callback函数的时候就会造成回调地狱，使代码可读性和可维护性降低。

Promise有三种状态，分别是pending（等待），fulfilled（成功）和rejected（失败）

当我们`new`一个`promise`，此时我们需要传递一个回调函数，这个函数为立即执行的，称之为（executor）

这个回调函数，我们需要传入两个参数回调函数，`reslove`,`reject`(函数可以进行传参)

- 当执行了`reslove`函数，会回调promise对象的.then函数
- 当执行了`reject`函数，会回调promise对象的.catch函数

then、catch方法的作用是为Promise对象添加状态改变时的回调函数（放入微队列中等待执行），因为这些方法返回的也是Promise实例，所以可以链式调用

```js
// 只有运行过resolve或reject，也就是Promise状态改变了才能执行then，return的值作为res
new Promise(resolve => {
    resolve(1)
})
.then(res=>res)
.then(res=>console.log(res))


const promise = new Promise((resolve, reject) => {
    console.log('1')
    resolve('3')
})
const promise2 = promise.then(res => {
    console.log(res)
    return new Promise((resolve, reject) => resolve('4'))
})
console.log('2')
console.log(promise2)
console.log(promise2.then(res => console.log(res)))
// 1
// 2
// Promise { <pending> }
// Promise { <pending> }
// 3
// 4
```



### Promise A+规范



- promise应该有三个状态：

  + pending（初始状态可变）、
  + fulfilled（最终态不可变、一个promise被resolve后变成该状态、必须拥有一个value值）、
  + rejected（最终态不可变、一个promise被reject后变成该状态（不是throw Error：直接报错）、必须拥有reason值）

- promise应该有个then方法，用来访问最终结果（value or reason）

  ```js
  Promise.then(onFulfilled, onRejected) // 参数若不是函数则被忽略
  ```

  

- onFulfilled和onRejected应该是微任务

+ 在执行上下文堆栈仅包含平台代码之前，不得调onFulfilled 或 onRejected函数，onFulfilled 和 onRejected 必须被作为普通函数调用（即非实例化调用，这样函数内部 this 非严格模式下指向 window），使用queueMicrotask或者setTimeout来实现微任务的调用

- then可被调用多次
- then返回一个promise对象

##### 如何中断promise请求？

```js
// 根据promise a+ 规范来说
        // then()接受两个参数 如果参数是不是函数将被忽略
        // onFulfilled 将在promise fulfilled 后调用并接受一个参数
        // onRejected 将在promise rejected 后调用 并接受一个参数
        // 另外 then  一定返回的是promise
        // 若两参数是函数，当函数返回的是一个新的promise对象时
        //原promise 跟新promise 状态保持一致
        // 如果返回的promise 是个pending 状态 将保留直到转换为fulfilled / rejected
        //    

        // promise中断请求  不就是在then的时候将返回值新promise保持状态为pending
        // 那么这个promise 的链也将会中止（等待）

Promise.resolve().then(()=>{
    // pending
    console.log(1)
    return new Promise(()=>{})
    // 后面的then 将不会调用
}).then(()=>{
    console.log(2)
})
```









### async/await

async 函数（async 是“异步”的简写，而 await 可以认为是 async wait 的简写）是使用`async`关键字声明的函数。async 函数是 [`AsyncFunction`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/AsyncFunction) 构造函数的实例，

async声明的函数返回的是一个promise实例。

await如果等待的是一个promise函数，则会阻塞后续的代码，等promise状态改变后执行。

```js
// await 的使用需要在async函数内部

async function fn() { // [AsyncFunction: fn]
    return '123'
}
console.log(fn()) // Promise{ '123' }
```



### Promise回调地狱

```js
function requestData(url) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (url.includes('hy')) {
        resolve(url)
      } else {
        reject('请求错误')
      }
    }, 1000);
  })
}


requestData('hy.io').then(res => {
  requestData(`hy.org ${res}`).then(res => {
    requestData(`hy.com ${res}`).then(res => {
      console.log(res)
    })
  })
})

//hy.com hy.org hy.io
```

**promise+生成器解决**

```js
function* getData() {
  const res1 = yield requestData('hy.io')
  const res2 = yield requestData(`hy.org ${res1}`)
  const res3 = yield requestData(`hy.com ${res2}`)
  console.log(res3)
}

//自动化执行 async await相当于自动帮我们执行.next
function asyncAutomation(genFn) {
  const generator = genFn()

  const _automation = (result) => {
    let nextData = generator.next(result)
    if(nextData.done) return

    nextData.value.then(res => {
      _automation(res)
    })
  }

  _automation()
}

asyncAutomation(getData)

//iceweb.com iceweb.org iceweb.io
```



**async，await解决**

```js
async function fn() {
    let res = await requestData('hy.io')
    res = await requestData(`hy.org ${res}`)
    res = await requestData(`hy.com ${res}`)
    console.log(res)
}

fn()
```





### 总结

##### 对promise理解？

Promise 表示一个异步操作的最终结果，与之进行交互的方式主要是 `then` 方法，该方法注册了两个回调函数，用于接收 promise 的终值或本 promise 不能执行的原因。

**Promise（承诺） 是异步编程的一种解决方案**，在没有Promise的时候，异步编程是通过**回调函数**来解决的，将函数作为参数用来获取异步操作得到的数据，但是嵌套多层callback函数的时候就会造成回调地狱，使代码可读性和可维护性降低。

Promise有三种状态，分别是pending（等待），fulfilled（成功）和rejected（失败）

当我们`new`一个`promise`，此时我们需要传递一个回调函数，这个函数为立即执行的，称之为（executor）

这个回调函数，我们需要传入两个参数回调函数，`reslove`,`reject`(函数可以进行传参)

- 当执行了`reslove`函数，会回调promise对象的.then函数
- 当执行了`reject`函数，会回调promise对象的.catch函数

then、catch方法的作用是为Promise对象添加状态改变时的回调函数（放入微队列中等待执行），因为这些方法返回的也是Promise实例，所以可以链式调用



##### Promise的catch和then

catch只是一个语法糖而己 还是通过then 来处理的：

```js
Promise.prototype.catch = function(fn){
    return this.then(null,fn);
}
```

then的第二个参数和catch捕获错误信息的时候会就近原则，如果是promise内部报错，reject抛出错误后，then的第二个参数和catch方法都存在的情况下，只有then的第二个参数能捕获到，如果then的第二个参数不存在，则catch方法会捕获到。

```js
const promise = new Promise((resolve, rejected) => {
    throw new Error('test');
});

//此时只有then的第二个参数可以捕获到错误信息
promise.then(res => {
    throw Error('test')
}, err => {
    console.log(err);
}).catch(err1 => {
    console.log(err1);
});

//用catch写法更优，可以捕获前面then方法执行中的错误，也更接近同步的写法（try/catch）。
```



