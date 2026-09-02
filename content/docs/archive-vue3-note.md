---
title: vue3-note
description: 归档内容，二手课程笔记，不对外展示。
date: 2024-11-03
category: toolchain
tags: [notes]
draft: true
---

# Vue3

**基于标准 HTML、CSS 和 JavaScript 构建，并提供了一套声明式的、组件化的编程模型**

    声明式 <=> 命令式

框架作用：替换DOM操作，解决操作DOM麻烦的问题

**1、性能提升**

- 打包大小减少41%

- 初次渲染快55%，更新渲染快133%

- 内存减少45%

- ……

**2、源码的升级**

* 使用 Proxy 代替 defineProperty 实现响应式

* 重写虚拟 DOM 的实现和 Tree-Shaking (Tree-Shaking ： webpack支持)

* ……

**3、支持 Typescript**

- Vue3 可以更好的支持typescript

- ……

**4、新的特性**

1. Composition API (组合API)
   
   + setup配置
   
   + ref reactive
   
   + watch与watchEffect
   
   + provide与inject
   
   + ……

2. 新的内置组件
   
   - Fragment
   
   - Teleport
   
   - Suspense
   
   - ……

3. 其他改变
   
   - 新的生命周期钩子
   
   - data 选项应始终被声明为一个函数
   
   - 移除keyCode支持作为 v-on 的修饰符
   
   - ……

# 壹、创建Vue3.0工程

## 1. 使用 Vue cli创建

```v
vue crete vue3_test

启动：npm run 
```

## 2. 使用 vite 创建

**官方文档 ：**  [快速上手 | Vue.js](https://cn.vuejs.org/guide/quick-start.html)        [https://cn.vitejs.dev/]()

**vite官网：** https://vitejs.cn

+ **优势 ：**
  
  + 开发环境中，无需打包操作，可以快速冷启动
  
  + 轻量快速的热重载 (HMR)
  
  + 真正的按需编译，不再等待整个应用编译完成

+ 传统创建与 vite 构建对比

![](assets/2022-11-28-17-09-46-image.png)

Vite 动态引入

![](assets/2022-11-28-17-10-01-image.png)

```v
用 vite 创建项目
 npm init vite-app vue3_test_vite
进入项目
 cd vue3_test_vite
下载依赖
 npm install (or `yarn`)
```

**关闭语法检查**

```javascript
module.exports = {
  // 关闭语法检查
  lintOnSave: false,
}
```

```js
// 挂载 ——>  mount
app.mount('#app');
// 卸载 ——>  unmount
setTimeout(() => {
  // alert('即将卸载 app')
  if (confirm('卸载app')) {
    app.unmount('#app')
  }
}, 3000);
```

# 贰、常用的 Composition API

## 1、setup

1. 理解：Vue3.0 中一个新的配置项，值为一个函数

2. setup 是所有 Composition API (组合API) ”**表演的舞台**“

3. 组件中所用到的：数据、方法等，均要配置在 setup 中

4. setup 函数的两种返回值：
   
   - 若返回一个对像，则对象中的属性、方法，在模板中均可以**直接使用**
   
   - *若返回一个渲染函数：则可以自定义渲染内容*
   
   - <text style="color:red"> **!** `setup`中定义的数据一定要返回，不然页面无法获取到数据 **!** </text>

5. 注意点：
   
   1. 尽量不要与 Vue2.X 配置混用
      
      - Vue2.x配置 (data、methods、computed……) 中**可以访问到**setup中属性、方法
      
      - 但在setup中**不能访问**Vue2.x配置 （data、methods、computed……）
      
      - 如果有重名，setup优先
   
   2. setup 不能是一个 async 函数，因为返回值不再是return的对象，模版看不到return对象中的属性。**(后期也可以返回一个`Promise`实例，但需要`Suspense`和异步组件的配合)**

## 2、ref函数

- 作用：定义一个响应式数据

- 语法：`let XXX = ref(initValue)`
  
  - 创建一个包含响应式数据的**引用对象(reference 对象，简称 ref 对象)**
  
  - JS中操作数据：`XXX.value`
  
  - 模版中读取数据：不需要value，直接`<div>{{XXX}}</div>`

- 备注：
  
  - 接收的数据可以是：基本类型，也可以是对象类型
  
  - 基本类型数据：响应式依然是靠`Object.defineProperty()`的`get`与`set` 完成的
  
  - 对象类型的数据：内部**求组**了Vue3中的新函数——`reactive`函数

## 3、reactive函数

- 作用：定义一个**对象类型**的响应式数据 (基本类型使用`ref`函数)
  
  - 语法：`(const 代理对象 = reactive(源对象)`接收一个对象(或数组)，返回一个**代理对象 (`proxy` 对象)**
  
  - `reactive`定义的响应式数据是 *深层次的*
  
  - 内部基于`ES6`的`proxy`实现，通过代理对象操作源对象内部数据进行操作 

## 4、Vue3中的响应式原理

### 1. Vue2的响应式

实现原理：

- **对象类型：** 通过`Object.defineProperty()`对属性的读取、修改进行拦截 (数据劫持)

- **数组类型：** 通过重写更新数组的一系列方法来实现拦截。（对数组的变更方法进行了包裹）

- ```js
  Object.defineProperty(data, 'count',{
    get(){},
    set(){}
  })
  ```

存在问题：

- 新增属性、删除属性，界面不会更新

- 直接通过下标修改数组，界面不会自动更新

### 2. Vue3的响应式

实现原理：

- 通过`Proxy(代理)`：拦截对象中任意属性的变化，包括：属性值的读写、属性的添加、属性的删除等

- 通过`Reflect(反射)`：对被代理源对象的属性进行操作

- MDN 文档中描述的`Proxy`与`Reflect`
  
  - `Proxy`：[Proxy - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
  - `Reflect`： [Reflect - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect)
  - ```js
      const proxy = new Proxy(person, {
        // 拦截读取属性值 读取 
        get(target, propName) {
          // console.log('有人读去了proxy属性', target, b)
          console.log(`有人读取了proxy的 ${propName} 属性`)
          return Reflect.get(target, propName)
          // return target[propName]
        },
        // 拦截设置属性或添加新属性 增改
        set(target, propName, value) {
          console.log(`有人修改了 proxy 的 ${propName} 属性为 ${value}`)
          target[propName] = value
          Reflect.set(target, propName, value)
          // return target[propName]
        },
        // 拦截删除属性 删除
        deleteProperty(target, propName) {
          console.log(`删除了p的${propName}属性`)
          return Reflect.defineProperty(target, propName)
          // return delete target[propName]
        }
      })
    ```

## 5、reactive 对比 ref

- 从定义数据角度对比：
  
  - `ref`用来定义：<text style='color: red'>基本数据类型</text>
  
  - `reactive`用来定义：<text style='color: red'>对象 (或数组) 类型数据</text>
  
  - 备注：`ref`也可以用来定义*对象(或数组)类型数据*，它内部会自动通过`reactive`转为**代理对象**

- 从原理角度对比
  
  - `ref`通过`Object.defineProperty()`的`get`和`set`来实现响应式(数据劫持)
  
  - `reactive`通过`proxy`来实现响应式（数据劫持），并通过`Reflect`操作**源对象**内部数据

- 从使用角度对比：
  
  - `ref`定义的数据：操作数据需要`.value`，读取数据模板中可直接读取
  
  - `reactive`定义的数据：操作数据与读取数据，均不需要`.value`

## 6、setup的两个注意点

- `setup`执行的时机
  
  - 在`beforeCreate`之前执行，`this`是**undefined**

- `setup`的参数
  
  - `props`：值为对象，包含：组件外包传递过来，且组件内部声明了的属性
  
  - `context`：上下午对象
    
    - `attrs`：值为对象，包含：组件外部传递过来，但没有在`props`配置中声明的属性，相当于`this.$attrs`
    
    - `slots`：收到的插槽内容，相当于`this.$slots`
    
    - `emit`：分发自定义事件的函数，相当于`this.$emit`

## 7、计算属性与监视

### 1. computed函数

- 与Vue2中`computed`配置功能一致

- 写法

```js
import { reactive, computed } from 'vue'

export default {
 ...
    // 计算属性 —— 简写(不考虑计算属性被修改的情况)
    obj.fullName = computed(() => {
      return obj.firstName + '-' + obj.lastName
    })

    // 计算属性 —— 完整写法(考虑 读和写)
    obj.fullName = computed({
      get() {
        return obj.firstName + '-' + obj.lastName
      },
      set(value) {
        const nameArr = value.split('-')
        obj.firstName = nameArr[0]
        obj.lastName = nameArr[1]
      }
    })
}
```

### 2. watch函数

- 与Vue2.x中的watch配置功能一致

- 两个注意点：
  
  - 监视`reactive`定义的响应式数据时：`oldValue`无法正确获取，强制开启了深度监视(`deep`配置失效)
  
  - 监视`reactive`定义的响应式数据中某个属性时：deep配置有效

```js
setup() {
    // 数据
    let sum = ref(0)
    let msg = ref('你好啊')
    let person = reactive({
      firstName: 'three',
      lastName: 'wang',
      job: {
        j1: {
          salary: 20
        }
      }
    })
    console.log('输出person', person)

    // 情景一：监视 ref 所定义的一个响应式数据
    // watch(sum, (newValue, oldValue) => {
    //   console.log('sum改变了', newValue, oldValue)
    // })

    // 情景二：监视 ref 所定义的多个响应式数据

    // watch([sum, msg], (newValue, oldValue) => {
    //   console.log('sum或者msg改变了', newValue, oldValue)
    // }, { immediate: true, deep: true })

    // 情景三：监视 reactive 所定义的一个响应式数据
    // 1、无法正确获取 oldValue
    // 2、强制开启了深度监视(deep 配置无效 (deep:false 不生效))
    // watch(person, (newValue, oldValue) => {
    //   console.log('person改变了', newValue, oldValue)
    // }, { deep: false })

    // 情景四：监视reactive 所定义的一个响应式数据中的某个属性
    // watch(() => person.firstName, (newValue, oldValue) => {
    //   console.log('person的firstName变化了', newValue, oldValue)
    // })

    // 情景五：监视reactive所定义的一个响应式数据中的某些属性
    watch([() => person.firstName, () => person.lastName], (newValue, oldValue) => {
      console.log('person的firstName或lastName变化了', newValue, oldValue)
    })

    // 特殊情况
    watch(() => person.job, (newValue, oldValue) => {
      console.log('person的Job变化了', newValue, oldValue);
    }, { deep: true })
    // 此处由于监视的是reactive所定义的对象中的某个属性，所以deep配置有效

    // return 返回对象
    return {
      sum,
      msg,
      person
    }
  }
```

### 3. watchEffect函数

- `watch`：既要指明监视的属性，也要指明监视的回调

- `watchEffect`：不用指明监视哪个属性，监视的回调中用到哪个属性，就监视哪个属性

- watchEffect有点像computed：
  
  - 但`computed`注重的计算出来的值(回调函数的返回值)，所以**必须写返回值**
  
  - `watchEffect`更注重的是过程(回调函数的函数体)，所以**不用写返回值**

```javascript
    // watchEffect所指定的回调中用到的数据只要发生变化，则直接重新执行回调
    watchEffect(() => {
      const x1 = sum.value
      const x2 = person.job.j1.salary
      console.log('watchEffect所指定的回调执行了')
    })
```

## 8、生命周期

**Vue3声明周期**

<img title="" src="/images/remote/436c302b1139ccf9.png" alt="组件生命周期图示" data-align="inline">

生命周期图片地址： /images/remote/436c302b1139ccf9.png

- Vue3 中可以继续使用 Vue2.x 中的生命周期钩子，但有两个被更名：
  
  - `beforeDestroy`改名为`beforeUnmount`
  
  - `destroyed`改名为`unmounted`

- Vue3 也提供了 Composition API 形式的生命周期钩子，与Vue2.x中钩子对应关系如下：
  
  - `beforeCreate` ======> `setup()`
  
  - `created` ===========> `setup()`
  
  - `beforeMount` =======> `onBeforMount`
  
  - `mounted` ===========> `onMounted`
  
  - `beforeUpdate` ======> `onBeforUpdate`
  
  - `update` ============> `onUpdate`
  
  - `beforeUnmont` ======> `onBeforeUnmount`
  
  - `unmonted` ==========> `onUnmounted`

## 9、自定义hook函数

- 什么是hook？ —— 本质是一个函数，把 setup 函数中使用 Composition API进行了封装

- 类似于 Vue2 中的`Mixin`

- 自定义 hook 的优势：复用代码，让 setup 中的逻辑更清楚易懂

## 10、toRef和toRefs

- 作用：创建一个 ref 对象，其 value 值指向另一个对象中的某个属性值

- 语法：`const name = toRef(person, 'name')`

- 应用：要将响应式对象中的某个属性单独提供给外部使用时

- 扩展：`toRefs`与`toRef`功能一直，但可以批量创建多个ref对象，语法：`toRefs(person)`

# 叁、其他Composition API

## 1、shallowReactive 与 shallowRef

- `shallowReactive`：只处理对象最外层的响应式(浅响应式)

- `shallowRef`：只处理基本数据类型的响应式，不进行对象的响应式处理

- 什么时候使用：
  
  - 如果有一个对象数据，结构比较深，但变化时只是外层属性变化 ===> `shallowReactive`
  
  - 如果有一个对象数据，后续功能不会修改该对象中的属性，而是生成新的对象来替换 ===> `shallowRef`

## 2、 readonly与 shallowReadonly

- `readonly`：让一个响应式数据变为只读的（深只读）

- `shallowReadonly`：让一个响应式数据变为只读的（浅只读）

- 应用场景：不希望数据被修改时

## 3、toRaw 与 markRaw

- toRaw：
  
  - 作用：将一个由`reactive`生成的**响应式对象**转为**普通对象**
  
  - 使用场景：用于读取响应式对象对应的普通对象，对这个普通对象的所有操作，不会引起页面更新

- markRaw：
  
  - 作用：标记一个对象，使其永远不会称为响应式对象
  
  - 应用场景：
    
    1. 有些值不应该被设置为响应式的，例如复杂的第三方类库等
    
    2. 当渲染具有不可改变数据源的大列表时，跳过响应式转换可以提高性能

## 4、customRef

- 作用：创建一个自定义的`ref`，并对其依赖项跟踪和更新触发进行显式控制

- 实现防抖效果：
  
  ```js
  <template>
    <input type="text" v-model="keyWord">
    <h3>{{ keyWord }}</h3>
  </template>
  
  <script>
  import { clear } from "console";
  import { ref, customRef } from "vue";
  export default {
    nam: "App",
    setup() {
      // 自定义一个ref ———— 名为：myRef
      function myRef(value) {
        let timer
        console.log('--myRef--:', value)
        // const x = customRef()
        // return x
        return customRef((track, trigger) => {
          return {
            get() {
              console.log(`有人从myRef这个容器中读取数据了|，我把${value}给他了`)
              track() // 通知Vue追踪Value的变化 (提前和get商量一下，让他认为这个value是有用的)
              return value
            },
            set(newValue) {
              console.log(`有人从myRef这个容器中数据修改为:${newValue}了`)
              clearTimeout(timer)
              timer = setTimeout(() => {
                value = newValue
                trigger() // 通知Vue去重新解析模版
                return newValue, value
              }, 500);
            }
          }
        })
      }
  
      // let keyWord = ref("hello") // 使用Vue提供的 ref
      let keyWord = myRef("hello") // 使用程序员自定义的 ref
  
      return {
        keyWord,
      };
    },
  };
  </script>
  ```

## 5、provide与inject

- 作用：实现<text style="color:red ">祖与后代组件组件间</text>通信(跨级组件)

- 套路：父组件有一个`provide`选项来提供数据，子组件有一个`inject`选项来开始使用这些数据

- 具体写法
  
  1. 祖组件中：
     
     ```js
       import { provide } from 'vue'
       setup() {
         const car = reactive({ name: 'Car', price: '40W' })
         provide('car', car) // 给自己的后代组件传递数据
     
         return {
           ...toRefs(car)
         }
       }
     ```
  
  2. 孙组件中：
     
     ```js
     import { inject } from 'vue'
     setup() {
         const car = inject('car') // inject 接收
         console.log('打印car', car)
     
         return {
           car
         }
       }
     ```

## 响应式数据的判断

- `isRef`：检查一个值是否为一个`ref`对象

- `isReactive`：检查一个对象是否由`reactive`创建的响应式代理

- `isReadonly`：检查一个对象是否由`readonly`创建的只读代理

- `isProxy`：检查一个对象是否由`reactive`或者`readonly`方法创建的代理

# 肆、Composition API的优势

## 1、Option Api存在的问题

使用传统`Options API`中，新增或者修改一个需求，需要分别在`data、methods、computed`里修改

## 2、Composition API的优势

我们可以更加优雅的组织我们的代码、函数，让相关功能的代码更加有序的组织在一起。

# 伍、新的组件

## 1、Fragment

- 在Vue2 中，组件必须有一个根标签

- 在Vue3中，组件可以没有根标签，内部会将多个标签包含在一个`Fragment`虚拟元素中

- 好处：减少标签层级，减小内存占用

## 2、Telport

- 什么是`Telport`？ —— `Telport`是一种能够将我们的<span style="color:red">组件HTML结构</span>移动到指定位置的技术
  
  ```html
    <teleport to='body'>
      <!-- <teleport to='#atgui'> 展示在atgui标签 -->
      <div class="mask" v-show="isShow">
        <div class="dialog">
          <h2>我是一个弹窗</h2>
          <h4>something</h4>
          <h4>something</h4>
          <h4>something</h4>
          <h4>something</h4>
          <input type="button" value="关闭弹窗" @click="isShow = false"
            style="margin-left:100px;border:5px solid skyblue;padding: 5px;">
        </div>
      </div>
    </teleport>
  ```

## 2、Suspense

- 等待异步组件时渲染一些后备内容，获得更好的用户体验

- 使用步骤：
  
  - 异步引入组件
    
    ```js
    import { defineAsyncComponent } from 'vue'
    // import Child from './components/Child.vue' // 静态引入
    const Child = defineAsyncComponent(() => import('./components/Child.vue')) // 异步引入
    ```
  
  - 使用`Suspense`包裹组件，并配置好`default`和`fallback`
    
    ```html
    <template>
      <div class="app">
        <h3>我是App组件 (祖). {{ name }} -- {{ price }}</h3>
        <Suspense>
          <template v-slot:default>
            <Child />
          </template>
          <template v-slot:fallback>
            <h3>稍等，正在加载……</h3>
          </template>
        </Suspense>
      </div>
    </template>
    ```

# 陆、其他

## 1、全局API的转移

- Vue2 有许多全局 API 和配置
  
  - 例如：注册全局组件、注册全局指令等
    
    ```js
    // 注册全局组件
    Vue.component('MyButton', {
      data: () => ({
        count: 0
      }),
      template: `<button @click="count++">Clicked {{ count }} times. </button>`
    })
    // 注册全局指令
    Vue.directive('focus', {
      inserted: el => el.focus()
    })
    ```

- Vue3中对这些API做出了调整
  
  - 将全局的 API，即：`Vue.xxx`调整到应用实例 (`app`) 上
  
  | -- 2.x全局 API (Vue) --    | -- 3.x实例 API (app) --              |
  | ------------------------ | ---------------------------------- |
  | Vue.config.xxx           | app.config.xxx                     |
  | Vue.config.productionTip | 移除 (生产版本提示)                        |
  | Vue.component            | app.component                      |
  | Vue.directive            | app.directive                      |
  | Vue.mixin                | app.mixin                          |
  | Vue.use                  | app.use                            |
  | Vue.prototype            | app.config.globalProperties (全局属性) |
  |                          |                                    |

## 2、其他改变

- data 选项应始终被声明为一个函数

- 过度类名的更改
  
  - Vue2写法
    
    ```css
    .v-enter，
    .v-leave-to{
        opacity:0
    }
    .v-leave，
    .v-enter-to{
        opacity:1
    }
    ```
  
  - Vue3写法
    
    ```css
    .v-enter-from,
    .v-leave-to{
        opacity:0
    }
    .v-leave,
    .v-enter-to{
        opacity:1
    }
    ```
  
  - <span style="color:red">移除</span>`keyCode`作为`v-on`的修饰符，同时也不再支持`config.keyCodes`
  
  - <span style="color:red">移除</span>`v-on.native`修饰符
    
    - 父组件中绑定事件
    - ```v
      <my-component 
          v-on:close="handleComponentEvent"
          v-on:click="handleNativeClickEvent"
      />
      ```
    - 子组件中声明自定义事件
    - ```v
       <script>
         export default{
           emits:['close']
         }
       </script>
      ```
    - <text style="color:red">移除</text>过滤器 (filter)  (可以用方法调用或者计算属性去替换过滤器)
    - ……

# 报错

1. <text style="color:red"> **!** `setup`中定义的数据一定要返回，不然页面无法获取到数据 **!** </text>

2. **Vue报错：** `Can't resolve XXX`  vue配置路由如果出现can not resolve“@src/test/demo”,那极有可能是路径写错了，或者路径和上面的写重复了，检查路径   也可能引入了模块路径不对……

3. WebSocketClient.js?5586:16 WebSocket connection to  链接报错
   
   ```js
   // 修改 vue.config.js 文件中的 devServer配置，主要是 client 配置项
   // webSocketURL和端口号设置一致
   
   const { defineConfig } = require('@vue/cli-service')
   module.exports = defineConfig({
     devServer: {
         host: '0.0.0.0',
       // https:true,
         port: 6103,
         client: {
           webSocketURL: 'ws://0.0.0.0:6103/ws',
         },
         headers: {
           'Access-Control-Allow-Origin': '*',
         }
     },
     transpileDependencies: true
   })
   ```

4. **Vue3中console报错**： 修改package.json中的`eslintConfig:{}`中的`“rules:{}”`,增加一行代码："no-console":"off"
   
   ```json
    "eslintConfig": {
      "rules": {
        "no-console": "off"
      }
    },
   ```

5. 

# vite

# 面试

1. `vue-loader`：`vue-loader`本质是一个 webpack 的 `Loader`，它可以解析和转换`.vue`文件，提取其中的`script style template`，再将他们交给对应的 `loader`去处理。

2. `loader`：**loader 对于模块的源码进行转化，它可以在你 import 或“加载”时，预处理文件**

3. `vue-loader`用途：降级：js可以写ES6；style样式可以写scss或者less；template可以加jade等

4. `vue-loader`实现原理：将 sfc 中的内容拆分为`template script style`三个虚拟模块，然后分别匹配 webpack 配置中对应的 rules

5. `SFC`：单文件组件`Single-File Component`，使我们能够将一个Vue组件的模版、样式与逻辑封装在单个文件中，使用SFC必须使用构建工具。

6. Vue实现一个message API：先写好一个render函数，将某一 HTML 片段挂载到 #root 下 / 从 #root 删除该片段。然后写一个Vue插件，就是一个暴露了包含 install 方法的模块，最后使用 Vue.use 全局注册这个插件即可

7. `SSR`：服务端渲染：是在服务器端渲染网页内容，并且将渲染后的HTML 发送给浏览器，而不是在浏览器进行渲染。更快的首屏加载速度，提高用户体验。  缺点：增加服务器的负载、更高的开发复杂度。

8. 使用 SSR 在 `created \ componentWillMount`中，代码仍在服务器中执行，没有浏览器环境，还未挂载，此时不能访问`localStorage`

9. 在 `react / Vue`中数组不能以在数组中的次序为 `key`，`key`值应为唯一标识，在数组变更后，`index`下标无法确保始终指向对应的序列。

10. Vue3中，不需要额外监听数组变化，`Proxy`代理后的数据，是可以监听到数组的修改。

11. `nextTick`实现原理：定义了一个异步方法，如果多次调用 `nextTick`，就会将方法存入队列中，通过这个异步方法来清空当前队列。

12. 框架优势：一套代码可以维护 Android、iOS两个平台，减少开发成本；相同功能可以使用组件复用；两个平台可以同时更新，原生代码更新时需要审核

13. `router`的实现原理：前端路由本质是监听URL变化，Hash模式和History模式，无需刷新就能加载响应的页面。`Hash`模式当 # 后面的哈希值发生变化时，通过`hashchange`事件监听，然后页面跳转；`History`模式通过：`history.pushState`和`history.replaceState`改变 URL。
    
    Vue3引入路由模式：
    
    ```js
    // history模式，需要后台配置做重定向，否则会出现404的
    import { createWebHistory } from 'vue-router'
    // hash模式
    import { createWebHashHistory } from 'vue-router'
    
    const router = createRouter({
      history: createWebHistory(process.env.BASE_URL),
      routes
    })
    ```
    
     两种模式的区别：
    
    - hash 只能改变 # 后的值，而 history 模式可以随意设置同源 URL
    
    - hash模式原理：a标签的锚点链接
