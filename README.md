<div align="center">

<a href="https://layui.dev">
  <img src="https://unpkg.com/outeres@0.1.0/img/layui/logo-icon.png" width="81" alt="Layui">
</a>

</div>

# Layui

中文 · [English](./README.en-US.md)

原生态极简模块化 Web UI 组件库

<p>
  <a href="https://github.com/layui/layui/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/layui/layui" alt="License">
  </a>
  <a href="https://github.com/layui/layui/releases">
    <img src="https://badgen.net/github/release/layui/layui" alt="Version">
  </a>
  <a href="https://www.npmjs.com/package/layui">
    <img src="https://img.shields.io/badge/npm-package-red" alt="NPM">
  </a>
</p>

> Layui 是一套开源免费的 Web UI 组件库，采用自身轻量级模块化规范，遵循原生态的 `HTML/CSS/JavaScript` 开发模式，极易上手，拿来即用。其风格简约轻盈，而内在雅致丰盈，甚至包括文档在内的每一处细节都经过精心雕琢，非常适合网页界面的快速构建。Layui 区别于一众主流的前端框架，却并非逆道而行，而是信奉返璞归真之道。确切地说，它更多是面向于追求简单的务实主义者，即无需涉足各类构建工具，只需面向浏览器本身，便可将页面所需呈现的元素与交互信手拈来。

## 快速上手

使用 Layui 只需在页面中引入核心文件即可：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Quick Start - Layui</title>
    <link href="./layui/css/layui.css" rel="stylesheet" />
  </head>
  <body>
    <!-- HTML Content -->
    <script src="./layui/layui.js"></script>
    <script>
      // Usage
      layui.use(function () {
        var layer = layui.layer;
        // Welcome
        layer.msg("Hello World", { icon: 6 });
      });
    </script>
  </body>
</html>
```

## 使用文档

[**当前版本文档**](https://layui.dev/docs/2/)

## 项目参与

[项目参与者](https://github.com/layui/layui/graphs/contributors)

## 破旧立新 🌱

2016 年 10 月 14 日，Layui 发布了 `1.0.0` 首版，此后多年被广泛应用于众多 Web 平台。

2021 年 10 月 13 日，Layui 发布了原官网下线的公告（<a href="https://unpkg.com/outeres@0.0.7/img/layui/notice-2021.png"  target="_blank">导读</a>），并将文档站点切换到了 Gitee Pages，社区及日常维护亦全面转移到了 Gitee 和 Github 平台，以此呼吁大家拥抱其他更好的主流框架，导致大家误以为 Layui 停更了。事实上，自那以后，Layui 仍然在 Github 和 Gitee 保持活跃，并不存在所谓的停止更新，从当时的 `2.6.8` 一直连续迭代到如今的最新版本。

2023 年 4 月 24 日，Layui 发布了 `2.8.0` 正式版，并上线了[新的文档站点](https://layui.dev)，这是一次朴实的回归，更是情怀的延续。 但我们仍然坚持两年前那则公告中的观点， _即仍然推荐大家去拥抱主流，始终保持对前沿技术的无限热爱，是开发者们都应具备的思维属性_。 **而 Layui 所做的，是为填补主流之外的那些略显狭小的空隙**。Layui 虽不是前端主流，但也早已不是作者个人的 Layui，而是所有仍在坚持使用它的人的 Layui，它仍然支撑着许多项目，也代表着许多人的工作。作为开源创作者，应该要为这些坚持者而守望。

未来，Layui 会持续陪伴着所有为之热爱的人们，共同去论证 Layui 开发模式的可行性。

## 开源许可

Layui 采用 [MIT](https://opensource.org/licenses/MIT) 许可发布。其他相关协议亦可参考《[免责声明](https://gitee.com/layui/layui/blob/main/DISCLAIMER.md)》。
