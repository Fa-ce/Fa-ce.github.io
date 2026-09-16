---
title: CSS 多行文本截断与展开按钮
description: 归档内容，多行截断加「更多」按钮的两种 CSS 实现 demo，不对外展示。
date: 2024-10-18
category: fundamentals
tags: [css, notes]
draft: true
---

原始文件 `index.html`，独立可运行的 demo。对比两种「多行文本截断 + 右下角『...更多』按钮」的实现：方案一用 `-webkit-line-clamp` 配绝对定位浮层（带彩色调试块标出定位区域）；方案二用 `float` 配 `::before`/`::after` 与 `calc(100% - 18px)` 撑高，实现文字环绕按钮。

```html
<!DOCTYPE html><html><body>
    <style>@-webkit-keyframes width-change {0%,100%{width: 320px} 50%{width:260px}}/*测试*/
    </style>
    <div style="position: relative;line-height:18px;-webkit-animation: width-change 8s ease infinite;max-height: 108px;">
        <div style="font-size: 36px;letter-spacing: 28px;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 6;color: transparent;line-height: 18px;position: relative;">
            <div style="font-size:12px;color: #000;display: inline;vertical-align: top;letter-spacing: 0;">
            腾讯成立于1998年11月，是目前中国领先的互联网增值服务提供商之一。成立10多年来，腾讯一直秉承“一切以用户价值为依归”的经营理念，为亿级海量用户提供稳定优质的各类服务，始终处于稳健发展状态。2004年6月16日，腾讯控股有限公司在香港联交所主板公开上市(股票代号700)。
            </div>
            <div style="position:absolute;top: 0;left: 50%;width: 100%;height: 100%;letter-spacing: 0;color: #000;font-size: 12px;background: rgba(173, 216, 230, 0.5);">
                <div style="float: right;width: 50%;height: 100%;background: rgba(255, 192, 203, 0.5);"></div>
                <div style="float: right;width: 50%;height: 108px;background: hsla(223, 100%, 50%, 0.19);"></div>
                <div style="float: right;width: 50px;height: 18px;position: relative;background: rgba(255, 165, 0, 0.5);" class="">... 更多</div>
            </div>
        </div>
    </div>
    <h2>我也会</h2>
    <style>
        .container {
            max-width: 300px;
            max-height: 54px;
            border: 1px red solid;
        }

        .content-wrapper {
            display: flex;
            position: relative;
            overflow: hidden;
        }

        .content {
            font-size: 14px;
            line-height: 18px;
            word-break: break-all;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
        }

        .content::before {
            content: '';
            display: block;
            float: right;
            width: 0px;
            height: calc(100% - 18px);
        }

        .content::after {
            position: absolute;
            content: '';
            display: inline-block;
            width: 100%;
            height: 100%;
            background: #e20404;
        }

        .cc {
            height: 16px;
            width: 82px;
            margin-left: 8px;
            float: right;
            clear: both;
            display: block;
        }
    </style>
    <div class="container">
        <div class="content-wrapper">
            <div class="content">
                <a href='https://www.baidu.com'class="cc">不会就百度</a>
                <span>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Facilis, excepturi molestiae aperiam dolores a voluptatum animi dolorem deserunt quam, blanditiis adipisci aspernatur vero necessitatibus dolorum repellendus, doloremque quae culpa reiciendis! 测试内容测试内容测试内容测试内容测试容内容测试内容测试内容测试内容测内容测试内容测试内容测试内容测内容测试内容测试内容测试内容测
                </span>
            </div>
        </div>
    </div>
    </body>
    </html>
```
