---
title: Windows mklink 符号链接用法
description: mklink 各参数区别与实用场景：目录联接、符号链接与硬链接的选择。
date: 2024-12-18
category: toolchain
tags: [windows, cheatsheet]
---

# mklink

- `/J` 建立目录的 JUNCTION； `/D` 建立目录的符号链接。
- JUNCTION 必须是本机的目录；符号链接可以链接网络上的资源。
- JUNCTION 建立时可以用相对路径，但记录的是绝对路径；符号链接建立时可以用相对路径，记录的也是相对路径。
- 移动、更名、删除 target 目录时，JUNCTION 失效；符号链接也失效。
- 移动、更名 target 的上 n 级目录时，JUNCTION 失效；符号链接视情况可能失效（相对路径情况可能不失效）。
- 权限方面，JUNCTION 的权限和 target 相同；符号链接的权限可以单独设置。
- 删除 JUNCTION，target 不受影响；删除符号链接，target 也不受影响。

C:\Users\SnowStorm>mklink
创建符号链接。

MKLINK [[/D] | [/H] | [/J]] Link Target

        /D      创建目录符号链接。默认为文件
                符号链接。
        /H      创建硬链接而非符号链接。
        /J      创建目录联接。
        Link    指定新的符号链接名称。
        Target  指定新链接引用的路径
                (相对或绝对)。


