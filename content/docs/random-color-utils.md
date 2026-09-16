---
title: JS 随机颜色生成方法
description: 几种生成随机 RGB / HEX 颜色的实现方式与各自适用场景。
date: 2024-12-11
category: toolchain
tags: [javascript, cheatsheet]
---

<!--
 * @Author: 一笑
 * @Date: 2024-12-10 16:16
 * @LastEditors: Fa-ce 3051810772@qq.com
 * @LastEditTime: 2024-12-10 19:16
 * 浮生千场醉
-->

# 随机色

## 设置颜色方法

1. 颜色名称：`dodgerBlue`、`deepPink`

2. 十六进制：取值范围 0x000000 ~ 0xffffff，前面加 `#`转换为字符串表示颜色，`#ffffff 白色`、`#000000 黑色`

3. `rgb`，`rgba` 颜色：`rgba(255,255,255,0.65) 白色，透明度0.65`, `rgba(R,G,B,A)`

   - R：红色值，0~255 正整数

   - G：绿色值，0~255 正整数

   - B：蓝色值，0~255 正整数

   - A：Alpha 透明度，0~1 之间的小数值

4. `hsl`,`hsla` 颜色：类似 rgb，`hsla(360,50%,50%,0.5) 半透明红色`，`hsla(H,S,L,A)`

   - H：`Hue`色调。取值 0 ~ 360，0、360 表示红色，120 表示绿色，240 表示蓝色。

   - S：`Saturation`饱和度：取值 0.0% ~ 100.0%

   - L：`Lightness`亮度：取值 0.0% ~ 100.0%

   - A：`Alpha`透明度：取值 0 ~ 1

## 随机 RGB 颜色

随机 0 ~ 255 之间的整数，分别代表红、绿、蓝三种颜色。

```js
function randomRGBColor() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);

    return `rgb(${r},${g},${b})`;
}
```

## 随机 RGBA 颜色

随机 rgb 色值之后，再随机一个 0 ~ 1 之间的数，表示透明度。

```js
function randomRGBAColor() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    const a = Math.random();

    return `rgba(${r},${g},${b},${a})`;
}

function getRandomRGBColor() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return "rgba(" + r + "," + g + "," + b + ",0.8)";
}
```

## 随机十六进制 Hex 颜色

1. 随机生成 0 ~ 255 之间的整数，分别代表红、绿、蓝三种颜色，再分别将它们转为十六进制，并拼接在一起。

```js
function randomHexColor() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);

    return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
}
```

2. 随机生成 6 个字符串，再串到一起

```js
function randomHexColor0() {
    const color = (colorStr = "") => {
        const str = "0123456789abcdef";
        colorStr += str[Math.floor(Math.random() * 16)];
        if (colorStr.length === 6) {
            return "#" + colorStr;
        }
        return color(colorStr);
    };
    return color();
}

const randomHexColor1 = () => {
    return (
        "#" +
        (function (color) {
            return (color += "0123456789abcdef"[Math.floor(Math.random() * 16)]) &&
                color.length === 6
                ? color
                : arguments.callee(color);
        })("")
    );
};

function randomHexColor2() {
    const str = "0123456789abcdef";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += str[Math.floor(Math.random() * 16)];
    }
    return color;
}

const randomHexColor3 = () => {
    // 传入 Math 对象，用 Hex 的长度来递归调用自身
    return (function (m, s, c) {
        return (
            (c ? arguments.callee(m, s, c - 1) : "#") + s[m.floor(m.random() * 16)]
        );
    })(Math, "0123456789abcdef", 5);
};

function randomHexColor4() {
    // 转为 16 进制小数字符串， slice(2, 8) 截取小数点后 6 位
    return "#" + Math.random().toString(16).slice(2, 8).padStart(6, "0");
}

// Hex 颜色取值范围是 0 ~ 0xffffff，即 0x000000 ~ 0xffffff，表示 24 位颜色值

// 随机生成 0 ~ 0xffffff 之间的整数
function randomHexColor5() {
    // 将 0xffffff 转为 10 进制，进行random取值后，再转为字符串
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

function randomHexColor6() {
    // 转为 16 进制，不足 6 位前面补 0
    return (
        "#" +
        Math.floor(Math.random() * 0xffffff)
            .toString(16)
            .padStart(6, "0")
    );
}
function randomHexColor7() {
    //  << 0 获取随机数后左移 0 位，相当于取整，替代 Math.floor
    return "#" + Math.floor((Math.random() * 0xffffff) << 0).toString(16);
}
// toString(16) 存在 bug，当随机数是 0 时，返回的是空字符串,无法生成纯白色。
// 还存在 Hex颜色 位数不足bug。
// 修改：
function randomHexColor8() {
    return (
        "#" +
        ((color) => {
            return new Array(7 - color.length).join("0") + color; // 不足 6 位前面补 0
        })((Math.random() * 0x1000000) << 0).toString(16)
        // 0x1000000 相当于 0xffffff + 1,确保可以取到 0xffffff
    );
}
```

## 随机 HSL 颜色

随机 0 ~ 360 之间的整数，表示色相，随机 0.0% ~ 100.0% 之间的数，表示饱和度和亮度，再随机一个 0 ~ 1 之间的数，表示透明度。

```js
function randomHslColor() {
    return (
        "hsl(" +
        Math.random() * 360 +
        "," +
        Math.random() * 100 +
        "%" +
        "," +
        Math.random() * 100 +
        "%)"
    );
}
```

## 随机 HSLA 颜色

随机 hsl 颜色后，再随机一个 0 ~ 1 之间的数，表示透明度。拼装颜色值字符串即可

```js
function randomHslaColor() {
    return (
        "hsla(" +
        Math.random() * 360 +
        "," +
        Math.random() * 100 +
        "%" +
        "," +
        Math.random() * 100 +
        "%" +
        "," +
        Math.random()
    );
}
```

# 批量重命名图片

一次性对某一文件夹下多个图片文件进行名称的修改与调整，不用逐一手动重命名图片，快速更新文件名，执行脚本自动修改图片名

自动`“9a9f0a7f89a7.jpg”`，之类的图片名为`002.jpg`

我这里将设置文件重命名为从`0 ~ 999`，可以根据要命名的图片数量自定义设置。

代码如下：

```js
const fs = require("fs");
const path = require("path");
const folderPath = "./testPicture";
const imgType = ["jpg", "png", "jpeg", "gif", "bmp", "tiff", "ico", "webp"];

let count = 0;
function pad(num, size) {
    let s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}

fs.readdir(folderPath, (err, files) => {
    try {
        if (err) {
            console.error("读取文件出错", err);
            return;
        }
        files.forEach((file, index) => {
            // 如果用 path.extname() 获取扩展名，注意名称为空的额外处理
            const ext = file.split(".").at(-1).toLowerCase();
            debugger;
            if (imgType.includes(ext)) {
                const oldFilePath = path.join(folderPath, file);
                const newFileName = pad(index, 3) + "." + ext;
                const newFilePath = path.join(folderPath, newFileName);
                fs.rename(oldFilePath, newFilePath, (err) => {
                    debugger;
                    if (err) console.error("重命名文件出错", err);
                });
                count++;
            }
        });
    } catch (error) {
        throw new Error(error);
    }
});
```

写的比较草率，欢迎指正代码中bug，以及更优写法
