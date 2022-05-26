<p align="center">
  <a href="http://www.layui.com">
    <img src="https://unpkg.com/outeres/img/layui/logo-1.png" alt="layui" width="360">
  </a>
</p>
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
    <img src="https://img.badgesize.io/layui/layui/master/dist/css/layui.css?compression=brotli&label=CSS Brotli size" alt="CSS Brotli size">
  </a>
  <a href="https://github.com/layui/layui/blob/master/dist/layui.js">
    <img src="https://img.badgesize.io/layui/layui/master/dist/layui.js?compression=brotli&label=JS Brotli size" alt="JS Brotli size">
  </a>
</p>

---

layui 是一套开源的 Web UI 组件库，采用自身经典的模块化规范，并遵循原生 HTML/CSS/JS 的开发方式，极易上手，拿来即用。其风格简约轻盈，而组件优雅丰盈，从源代码到使用方法的每一处细节都经过精心雕琢，非常适合网页界面的快速开发。layui 区别于那些基于 MVVM 底层的前端框架，却并非逆道而行，而是信奉返璞归真之道。准确地说，它更多是面向后端开发者，你无需涉足前端的各种工具，只需面对浏览器本身，让一切你所需要的元素与交互，从这里信手拈来。


## 快速上手

获得 layui 后，将其完整地部署到你的静态资源项目目录，你只需要引入下述两个文件：

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>开始使用 layui</title>
  <link rel="stylesheet" href="./layui/css/layui.css">
</head>
<body>
 
<!-- 你的 HTML 代码 -->
 
<script src="./layui/layui.js"></script>
<script>
//一般直接写在一个 js 文件中
layui.use(['layer', 'form'], function(){
  var layer = layui.layer
  ,form = layui.form;
  
  //欢迎语
  layer.msg('Hello World');
});
</script> 
</body>
</html>
```

## 阅读文档
[**最新文档**](https://layui.github.io/)
 
愿 layui 能成为你得心应手的 Web 界面解决方案，化作你方寸屏幕前的亿万字节！

## 贡献者
[贡献者列表](https://github.com/layui/layui/graphs/contributors)

> 大概是因为 layui 让开发者变得更懒，所以贡献者才如此之少。  

## 相关
> layui 源官网已于2021年10月13日下线。

目前包括版本更新、文档等在内的所有日常维护，都以 Github 或 Gitee 项目主页为准。
