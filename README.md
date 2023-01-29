<p align="center">
  <a href="https://layui.github.io/">
    <img src="https://unpkg.com/outeres@0.0.6/img/layui/icon-1.png" width="81" alt="Layui">
  </a>
</p>
<h1 align="center">Layui</h1>
<p align="center">
  Classic modular front-end UI library
</p>

<p align="center">  
  <a href="https://www.npmjs.com/package/layui">
    <img src="https://img.shields.io/npm/v/layui" alt="Version">
  </a>
  <a href="https://www.npmjs.com/package/layui">
    <img src="https://img.shields.io/github/license/layui/layui" alt="License">
  </a>
  <a href="https://github.com/layui/layui/blob/master/dist/css/layui.css">
    <img src="https://img.badgesize.io/layui/layui/master/dist/css/layui.css?compression=brotli&label=CSS%20Brotli%20size" alt="CSS Brotli size">
  </a>
  <a href="https://github.com/layui/layui/blob/master/dist/layui.js">
    <img src="https://img.badgesize.io/layui/layui/master/dist/layui.js?compression=brotli&label=JS%20Brotli%20size" alt="JS Brotli size">
  </a>
</p>

---

Layui 是一套开源的 Web UI 组件库，采用自身轻量级模块化规范，遵循原生态的 HTML/CSS/JavaScript 开发模式，极易上手，拿来即用。其风格简约轻盈，而内在雅致丰盈，甚至包括文档在内的每一处细节都经过精心雕琢，非常适合网页界面的快速构建。Layui 区别于一众主流的前端框架，却并非逆道而行，而是信奉返璞归真之道。确切地说，它更多是面向于追求简单的务实主义者，即无需涉足各类构建工具，只需面向浏览器本身，便可将页面所需呈现的元素与交互信手拈来。


## 快速上手

使用 Layui 只需在页面中引入核心文件即可：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>开始使用 Layui</title>
    <link href="./layui/css/layui.css" rel="stylesheet">
  </head>
  <body>
    <!-- HTML -->
     
    <script src="./layui/layui.js"></script>
    <script>
    // 使用组件
    layui.use(['layer', 'form'], function(){
      var layer = layui.layer;
      var form = layui.form;
      
      // 欢迎语
      layer.msg('Hello World');
    });
    </script> 
  </body>
</html>
```

## 使用文档
[**最新文档**](https://layui.github.io)

## 项目参与
[项目参与者](https://github.com/layui/layui/graphs/contributors) 

## 在 Cloud IDE 中预览
[https://idegithub.com/layui/layui](https://idegithub.com/layui/layui)

## 破旧立新 🌱
Layui 原官网已于2021年10月13日下线。详见：
> 1. <a href="https://unpkg.com/outeres@0.0.7/img/layui/notice-2021.png"  target="_blank">Layui 原官网下线公告</a>  2. <a href="https://www.zhihu.com/question/488668647/answer/2159962082"  target="_blank">Layui 原官网为什么要下线？</a>

---

鉴于 Layui 相对庞大的受众群体，从此 Github 和 Gitee 平台将支撑起 Layui 的后续。<br>
**Layui 将继续陪伴着所有为之热爱的人们，共同去探索和论证「Layui 开发模式的可行性」**
