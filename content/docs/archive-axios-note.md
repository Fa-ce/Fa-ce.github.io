---
title: axios-note
description: 归档内容，二手课程笔记，不对外展示。
date: 2024-11-03
category: toolchain
tags: [notes]
draft: true
---

Axios 是一个基于 Promise 的 HTTP 库，可以在浏览器和 node.js 中使用。

**axios** 功能强大的网络请求库： *Axios是一个基于Promise的HTTP库，可以用于浏览器和 Node.js* 特性: **支持promise API，自动转换JSON 数据，转换请求数据和响应数据，能拦截请求和响应** Axios 非常适合前后端数据交互，同时支持浏览器和Node 端使用

## 前置知识

Promise    Ajax

项目中下载 Axios：    `$ npm install axios`    or    `$ yarn add axios`

```javascript
Using jsDelivr CDN:
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
Using unpkg CDN:
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
```

# 基本使用

**axios API**： axios(config)    

```javascript
// Send a POST request
axios({
  method: 'post',
  url: '/user/12345',
  data: {
    firstName: 'Fred',
    lastName: 'Flintstone'
  }
})

// 获取远端图片
axios({
  method: 'get',
  url: 'http://bit.ly/2mTM3nY',
  responseType: 'stream'
}).then(function (response) {
  response.data.pipe(fs.createWriteStream('ada_lovelace.jpg')
})
```

**axios(url[, config])**

```javascript
// 发送 GET 请求 (默认)
axios('/user/12345');
```

**API**:    请求方法的别名

```javascript
axios.request(config)
axios.get(url[, config])
axios.delete(url[, config])
axios.head(url[, config])
axios.options(url[, config])
axios.post(url[, data[, config]])
axios.put(url[, data[, config]])
axios.patch(url[, data[, config]])

在使用别名方法时，URL、method、data 这些属性都不必在配置中指定
```

# Request Config    请求配置

```javascript
 {
   // `url` 是用于请求的服务器 URL
  url: '/user',

  // `method` 是创建请求时使用的方法
  method: 'get', // default

  // `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
  // 它可以通过设置一个 `baseURL` 便于为 axios 实例的方法传递相对 URL
  baseURL: 'https://some-domain.com/api/',

  // `transformRequest` 允许在向服务器发送前，修改请求数据
  // 只能用在 'PUT', 'POST' 和 'PATCH' 这几个请求方法
  // 后面数组中的函数必须返回一个字符串，或 ArrayBuffer，或 Stream
  transformRequest: [function (data, headers) {
    // 对 data 进行任意转换处理
    return data;
  }],

  // `transformResponse` 在传递给 then/catch 前，允许修改响应数据
  transformResponse: [function (data) {
    // 对 data 进行任意转换处理
    return data;
  }],

  // `headers` 是即将被发送的自定义请求头
  headers: {'X-Requested-With': 'XMLHttpRequest'},

  // `params` 是即将与请求一起发送的 URL 参数
  // 必须是一个无格式对象(plain object)或 URLSearchParams 对象
  params: {
    ID: 12345
  },

   // `paramsSerializer` 是一个负责 `params` 序列化的函数
  // (e.g. https://www.npmjs.com/package/qs, http://api.jquery.com/jquery.param/)
  paramsSerializer: function(params) {
    return Qs.stringify(params, {arrayFormat: 'brackets'})
  },

  // `data` 是作为请求主体被发送的数据
  // 只适用于这些请求方法 'PUT', 'POST', 和 'PATCH'
  // 在没有设置 `transformRequest` 时，必须是以下类型之一：
  // - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
  // - 浏览器专属：FormData, File, Blob
  // - Node 专属： Stream
  data: {
    firstName: 'Fred'
  },

  // `timeout` 指定请求超时的毫秒数(0 表示无超时时间)
  // 如果请求话费了超过 `timeout` 的时间，请求将被中断
  timeout: 1000,

   // `withCredentials` 表示跨域请求时是否需要使用凭证
  withCredentials: false, // default

  // `adapter` 允许自定义处理请求，以使测试更轻松
  // 返回一个 promise 并应用一个有效的响应 (查阅 [response docs](#response-api)).
  adapter: function (config) {
    /* ... */
  },

 // `auth` 表示应该使用 HTTP 基础验证，并提供凭据
  // 这将设置一个 `Authorization` 头，覆写掉现有的任意使用 `headers` 设置的自定义 `Authorization`头
  auth: {
    username: 'janedoe',
    password: 's00pers3cret'
  },

   // `responseType` 表示服务器响应的数据类型，可以是 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
  responseType: 'json', // default

  // `responseEncoding` indicates encoding to use for decoding responses
  // Note: Ignored for `responseType` of 'stream' or client-side requests
  responseEncoding: 'utf8', // default

   // `xsrfCookieName` 是用作 xsrf token 的值的cookie的名称
  xsrfCookieName: 'XSRF-TOKEN', // default

  // `xsrfHeaderName` is the name of the http header that carries the xsrf token value
  xsrfHeaderName: 'X-XSRF-TOKEN', // default

   // `onUploadProgress` 允许为上传处理进度事件
  onUploadProgress: function (progressEvent) {
    // Do whatever you want with the native progress event
  },

  // `onDownloadProgress` 允许为下载处理进度事件
  onDownloadProgress: function (progressEvent) {
    // 对原生进度事件的处理
  },

   // `maxContentLength` 定义允许的响应内容的最大尺寸
  maxContentLength: 2000,

  // `validateStatus` 定义对于给定的HTTP 响应状态码是 resolve 或 reject  promise 。如果 `validateStatus` 返回 `true` (或者设置为 `null` 或 `undefined`)，promise 将被 resolve; 否则，promise 将被 rejecte
  validateStatus: function (status) {
    return status >= 200 && status < 300; // default
  },

  // `maxRedirects` 定义在 node.js 中 follow 的最大重定向数目
  // 如果设置为0，将不会 follow 任何重定向
  maxRedirects: 5, // default

  // `socketPath` defines a UNIX Socket to be used in node.js.
  // e.g. '/var/run/docker.sock' to send requests to the docker daemon.
  // Only either `socketPath` or `proxy` can be specified.
  // If both are specified, `socketPath` is used.
  socketPath: null, // default

  // `httpAgent` 和 `httpsAgent` 分别在 node.js 中用于定义在执行 http 和 https 时使用的自定义代理。允许像这样配置选项：
  // `keepAlive` 默认没有启用
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),

  // 'proxy' 定义代理服务器的主机名称和端口
  // `auth` 表示 HTTP 基础验证应当用于连接代理，并提供凭据
  // 这将会设置一个 `Proxy-Authorization` 头，覆写掉已有的通过使用 `header` 设置的自定义 `Proxy-Authorization` 头。
  proxy: {
    host: '127.0.0.1',
    port: 9000,
    auth: {
      username: 'mikeymike',
      password: 'rapunz3l'
    }
  },

  // `cancelToken` 指定用于取消请求的 cancel token
  // （查看后面的 Cancellation 这节了解更多）
  cancelToken: new CancelToken(function (cancel) {
  })
}
```

## Response Schema 响应结构

某个请求的响应包含以下信息

```javascript
{
  // `data` 由服务器提供的响应
  data: {},

  // `status` 来自服务器响应的 HTTP 状态码
  status: 200,

  // `statusText` 来自服务器响应的 HTTP 状态信息
  statusText: 'OK',

  // `headers` 服务器响应的头
  headers: {},

   // `config` 是为请求提供的配置信息
  config: {},
 // 'request'
  // `request` is the request that generated this response
  // It is the last ClientRequest instance in node.js (in redirects)
  // and an XMLHttpRequest instance the browser
  request: {}
}
```

使用 `then` 时,接收以下响应

```javascript
axios.get('/user/12345')
  .then(function(response) {
    console.log(response.data);
    console.log(response.status);
    console.log(response.statusText);
    console.log(response.headers);
    console.log(response.config);
  })
```

在使用 `catch` 时，或传递 `reject callback` 作为 `then` 的第二个参数时，响应可以通过 `error` 对象可被使用

# Axios 默认配置

全局 axios 默认值

```javascript
axios.defaults.method = 'get'; // 设置默认请求方法为 GET
axios.defaults.baseURL = 'http://localhost:3000';  // 设置基础 URL
axios.defaults.params = { id: 3 };  // 设置参数
axios.defaults.timeout = 3000;  // 设置超时
```

自定义实例默认值

```javascript
// Set config defaults when creating the instance
const instance = axios.create({
  baseURL: 'https://api.apiopen.top',
  timeout: 2000,
  headers: 'hearders'
});

// Alter defaults after instance has been created
instance.defaults.headers.common['Authorization'] = AUTH_TOKEN
```

配置的优先顺序：    配置会以一个优先顺序进行合并。这个顺序是：在 `lib/defaults.js` 找到的库的默认值，然后是实例的 `defaults` 属性，最后是请求的 `config` 参数。后者将优先于前者。这里是一个例子：

```javascript
// 使用由库提供的配置的默认值来创建实例
// 此时超时配置的默认值是 `0`
var instance = axios.create();

// 覆写库的超时默认值
// 现在，在超时前，所有请求都会等待 2.5 秒
instance.defaults.timeout = 2500;

// 为已知需要花费很长时间的请求覆写超时设置
instance.get('/longRequest', {
  timeout: 5000
})
```

## 拦截器

在请求或响应被`then`或`catch`处理前拦截它们

```javascript
// Promise
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response;
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  })


// 发送请求
        axios({
            method: 'get',
            url: 'http://localhost:3000/comments',
            data: {
                id: 1
            }
        }).then(v => {
            console.log("自定义回调处理成功的结果：", v)
        }).catch(reason => {
            console.log("自定义失败的回调：", reason)
        })
```

## 错误处理

```javascript
axios.get('/user/12345')
  .catch(function (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
    console.log(error.config);
  })
```

## 取消请求

使用 `canceltoken`取消请求，可以使用一个 cancelToken 取消多个

```javascript
// 通过传递一个函数到 cancelToken 的构造函数来创建 cancel token：
const CancelToken = axios.CancelToken;
let cancel = null;

axios.get('/user/12345', {
  cancelToken: new CancelToken(function executor(c) {
    cancel = c;
    // executor 函数接收一个 cancel 函数作为参数

    /**  executor() 函数  
             * 引用 CancelToken 源码如下：
             * executor(function cancel(message) {
             *    if (token.reason) {
             *   // Cancellation has already been requested
             *  return;
                }
             *  token.reason = new Cancel(message);
             *  resolvePromise(token.reason);   
             */
  })
});

// cancel the request    执行 cancel() 取消请求
cancel();
```

axios 依赖原生的 ES6 Promise 实现

# 源码分析

```javascript
//结构

├─CHANGELOG.md
├─index.d.ts
├─index.js
├─LICENSE
├─package.json
├─README.md
├─SECURITY.md
├─tsconfig.json
├─tslint.json
├─UPGRADE_GUIDE.md
├─lib
|  ├─axios.js
|  ├─utils.js
|  ├─helpers
|  |    ├─bind.js
|  |    ├─buildURL.js
|  |    ├─combineURLs.js
|  |    ├─cookies.js
|  |    ├─deprecatedMethod.js
|  |    ├─isAbsoluteURL.js
|  |    ├─isAxiosError.js
|  |    ├─isURLSameOrigin.js
|  |    ├─normalizeHeaderName.js
|  |    ├─parseHeaders.js
|  |    ├─README.md
|  |    ├─spread.js
|  |    ├─toFormData.js
|  |    └validator.js
|  ├─env
|  |  ├─data.js
|  |  └README.md
|  ├─defaults
|  |    ├─index.js
|  |    └transitional.js
|  ├─core
|  |  ├─Axios.js
|  |  ├─buildFullPath.js
|  |  ├─createError.js
|  |  ├─dispatchRequest.js
|  |  ├─enhanceError.js
|  |  ├─InterceptorManager.js
|  |  ├─mergeConfig.js
|  |  ├─README.md
|  |  ├─settle.js
|  |  └transformData.js
|  ├─cancel
|  |   ├─Cancel.js
|  |   ├─CancelToken.js
|  |   └isCancel.js
|  ├─adapters
|  |    ├─http.js
|  |    ├─README.md
|  |    └xhr.js
├─dist
|  ├─axios.js
|  ├─axios.map
|  ├─axios.min.js
|  └axios.min.map
```

`axios`与`Axios`的关系：1、从语法上来说：axios 不是 Axios 的实例            2、从功能上来说：axios 是 Axios  的实例

**axios 发送请求** ： axios     Axios.prototype.request (axios 是由Axios通过bind创建而来)

# Vue-axios

基于 `Vue.js` 的轻度封装

安装：    `npm install --save axios vue-axios`

将以下代码加入入口文件：

```javascript
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)
```

按照这个顺序分别引入文件：   `Vue`、 `axios`、 `Vue-axios`

**使用**： This wrapper bind `axios` to `Vue` or `this` if you’re using single file component.

```javascript
Vue.axios.get(api).then((response) => {
  console.log(response.data)
})

this.axios.get(api).then((response) => {
  console.log(response.data)
})

this.$http.get(api).then((response) => {
  console.log(response.data)
})
```

## Vue-axios-plugin

**npm 模块引入**：    `npm install --save vue-axios-plugin`

**入口文件配置：**

```javascript
import Vue from 'Vue'
import VueAxiosPlugin from 'vue-axios-plugin'

Vue.use(VueAxiosPlugin, {
  // 请求拦截处理
  reqHandleFunc: config => config,
  reqErrorFunc: error => Promise.reject(error),
  // 响应拦截处理
  resHandleFunc: response => response,
  resErrorFunc: error => Promise.reject(error)
})
```

**配置参数：** 除了 `axios` 提供的默认 `请求配置`， `vue-axios-plugin` 也提供了 `request / response` 拦截器配置：

 **示例**

在 Vue 组件上添加了 `$http` 属性, 它默认提供 `get` 和 `post` 方法，使用如下:

```javascript
this.$http.get(url, data, options).then((response) => {  
  console.log(response)  
})  
this.$http.post(url, data, options).then((response) => {  
  console.log(response)  
})  
```

你也可以通过 `this.$axios` 来使用 `axios` 所有的 api 方法，如下：

```javascript
this.$axios.get(url, data, options).then((response) => {  
  console.log(response)  
})  

this.$axios.post(url, data, options).then((response) => {  
  console.log(response)  
})
```
