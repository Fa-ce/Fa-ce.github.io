---
title: nvm 版本管理与 pnpm 对比笔记
description: 解决 nvm list available 返回空的镜像配置问题，并对比 pnpm 与 npm 在依赖存储与安装速度上的差异。
date: 2024-07-13
category: devops
tags: [nvm, npm, pnpm, nodejs, troubleshooting]
---

# nvm 版本管理

## `nvm list available` 查看版本为空

解决办法：

- 查看配置的镜像地址

```shell
$    npm config get registry
https://registry.npmmirror.com/
// 已经配置了镜像地址
```

- ![](/images/b-tools/2024-07-13-20-40-29-image.png)

- `npm config list`，查看目录

- ![](/images/b-tools/71251598d3d915ad7536f8aaf185f23cf56cdeeb.png)

- 找到`.npmrc`文件，并进入修改

```shell
输入：
home=https://npmmirror.com
registry=https://registry.npmmirror.com/
```

- ![](/images/b-tools/09aa738b0f5bc60195246f96e9cd73210d821e9c.png)

- 再次查看，修改成功

- ![](/images/b-tools/ad01032e5165f07bb427ef759734f8001a6d0c59.png)

- 找到`nvm`安装路径，打开 `setting.txt` 文件。没有则创建一下![](/images/b-tools/af215104aa59abc8f572f51a48398cfe23fac0d3.png)

- 修改完`setting.txt`文件的镜像配置即可，设置 `node_mirror` 和 `npm_mirror`为：
  
  ```js
  node_mirror: https://npmmirror.com/mirrors/node/
  npm_mirror: https://npmmirror.com/mirrors/npm/
  ```

![](/images/b-tools/efcf2e0efee939e38357c0d94230b0d417b0a874.png)

**查看可安装的 `node` 版本** ，`nvm list available` 即可看到可安装版本信息

![](/images/b-tools/ad88662d80955421b8e77de696c5a9033250273c.png)

安装使用 14版本的node成功

![](/images/b-tools/2024-07-13-20-57-59-image.png)

# pnpm vs npm

## npm 的平铺目录结构

- 从 npm v3 开始，npm 使用*平铺的依赖结构*。 这可以减少磁盘空间占用， 但却导致 `node_modules` 目录的混乱。

- pnpm 通过使用硬链接和符号链接到全局磁盘内容可寻址存储来管理 `node_modules`。 带来减少磁盘空间使用的好处，同时还保持您的 `node_modules` 是干净的。

pnpm 正确的 `node_modules` 结构的好处在于，它*有助于避免愚蠢的错误*，因为它让你无法使用不是 `package.json` 中指定的模块。

## 安装

pnpm 不允许安装 `package.json` 中没有包含的包。 如果没有参数传递给 `pnpm add`，包将保存为常规依赖项。 与 npm 一样， `--save-dev` 和 `--save-optional` 可以是用于安装包作为开发或可选的依赖。

由于此限制，项目在使用 pnpm 时不会有任何无关的包，除非它们删除依赖项并将其保留为孤立的。 这就是为什么 pnpm 的实现的 [prune command](https://www.bookstack.cn/read/pnpm-8-zh/b9d1169af3b94232.md) 不允许你指定包来修剪 - 它总是去除所有多余的和孤儿包。

**安装 pnpm**

```shell
npm install -g pnpm
或者
npm install -g @pnpm/exe
```

| Node.js  | pnpm5 | pnpm6 | pnpm7 | pnpm8 |
| -------- | ----- | ----- | ----- | ----- |
| node V12 | √     | √     | ×     | ×     |
| node V14 | √     | √     | √     | ×     |
| node V16 | 未知    | √     | √     | √     |
| node V18 | 未知    | √     | √     | √     |

**查看安装位置**

```shell
使用 Git Bash 查看
 $ which pnpm
```

## 目录依赖

目录依赖以 `file:` 前缀开始，指向文件系统的目录。 与 npm 一样，pnpm 符号链接这些依赖项。 与 npm 不同的是，pnpm 不执行这些文件依赖项的安装。

这意味着如果您有一个名为 `foo` (`<root>/foo`) 的包，它有 `bar@file:../bar` 作为依赖项，则当你在 `foo` 上执行 `pnpm install` 时， pnpm 将不会为 `<root>/bar` 安装。

# PNPM的局限

1. `npm-shrinkwrap.json` 和 `package-lock.json` 被忽略。 与 pnpm 不同，npm可以多次安装相同的 `name@version` ，并且具有不同的依赖项组合。 npm 的锁文件旨在反映平铺的 `node_modules` 布局，但是，由于 pnpm 默认创建隔离布局，它无法由 npm 的锁文件格式反映出来。
2. Binstubs（在 `node_modules/.bin`中的文件）总是 shell 文件，而不是指向 JS 文件的符号链接。 创建 shell 文件是为了帮助支持插件的 CLI 的程序在特殊的 `node_modules` 结构中能够正确地找到它们的插件。 这是很少有的问题，如果您希望文件是 JS 文件，请直接引用原始文件

# pnpm add 和 install

`pnpm add `和` pnpm install `命令的本质是相同的，都可以用来安装依赖包。它们的区别在于用法和语法。

- `pnpm add`会将安装的*包名*和*版本号*添加到`package.json`文件的`dependencies`或`devDenpendencies`中，`pnpm install`不会

- `pnpm add`支持一次性安装多个包。eg:`pnpm add package0 package1 package……`

- `install` 用来安装项目的全部依赖

## pnpm add

安装软件包以及其依赖的任何软件包。 默认情况下，任何新添加的软件包都将作为生产依赖项。

| 命令                 | 用法                      |
|:------------------:|:-----------------------:|
| pnpm add sax       | 保存到dependencies         |
| pnpm add -D sax    | 保存到devDependencies      |
| pnpm add -O sax    | 保存到optionalDependencies |
| pnpm add -g sax    | 安装到全局                   |
| pnpm add sax@next  | 安装标记为 next 的版本          |
| pnpm add sax@3.1.0 | 安装指定版本 3.1.0            |

`add`命令的来源：

- npm 源

- workspace内

- 本地文件

- 从远端tar包安装

- 从git安装

`add`命令支持的参数：

- `–save-prod`, `-P`：安装到dependencies

- `–save-dev`, `-D`：安装到devDependencies

- `–save-optional`, `-O`：安装到optionalDependencies

- `–save-exact`, `-E`：保存的版本号会是一个具体的值，相当于锁死版本

- `–save-peer`：安装到peerDependencies和devDependencies中

- `–ignore-workspace-root-check`：允许在项目根目录添加依赖包

- `–global`，`-g`：安装到全局

- `–workspace`：仅添加在 workspace 内找到的依赖项

## pnpm install

`install` 用来安装项目的全部依赖

| Command 命令                 | Meaning 意义                      |
| -------------------------- | ------------------------------- |
| `pnpm i --offline`         | 使用本地缓存离线安装                      |
| `pnpm i --frozen-lockfile` | `pnpm-lock.yaml` is not updated |
| `pnpm i --lockfile-only`   | 只更新`pnpm-lock.yaml`             |

`install`支持的参数：

- `–force`：强制重新安装依赖。

- `–offline`： 默认值：`false`。如果设置了`--offline`参数，pnpm会只使用本地缓存的包，如果本地没有找到某个包，最终安装就会失败。可以理解为离线模式。

- `–prefer-offline`：默认值：false。如果设置了`--prefer-offline`参数，本地没有的包会从远端安装，其他会优先使用本地缓存的包。

- `–prod`,`-P`：如果环境变量中`NODE_ENV`被设置为`production`，那么pnpm不会安装任何属于`devDependencies`的包，如果有相关的包已经被安装了，则会*清除*这些包。**使用这个指令pnpm会忽略`NODE_ENV`，强制pnpm以production的方式执行install命令。**

- `–dev`,`-D`：仅安装`devDependencies`并*删除已安装的dependencies。*

- `–no-optional`：不安装optionalDependencies依赖。

- `–lockfile-only`：使用时，只更新 pnpm-lock.yaml 和 package.json。 不写入 node_modules 目录。

- `–fix-lockfile`：自动修复损坏的lock文件入口。

- `–frozen-lockfile`：默认值：非 CI: false。CI: true, 如果存在 lock 文件
  
  - 如果设置 true， pnpm 不会生成 lockfile，而且如果 lockfile是偏旧或不存在lockfile则会安装失败.

- `–reporter=name`：默认值：`TTY stdout: default`，`非 TTY stdout: append-only` 允许您选择将调试信息记录到终端, 以了解安装进度.
  
  - `silent `- 控制台不展示任何信息
  
  - `default ` - **TTY**的默认输出
  
  - `append-only` - 始终向末尾追加输出
  
  - `ndjson `- 打印所有ndjson格式日志，最详细的版本
  
  - `–use-store-server`：通过本地的store服务安装，安装完成后store服务不会自动关闭，*需要使用`pnpm server stop`停止*。

- `–shamefully-hoist`：创建一个扁平化node_modules目录结构, 类似于npm 或 yarn。不推荐使用，可能会导致未知问题。

- `–ignore-scripts`：不执行任何项目中package.json以及依赖内定义的任何脚本。
