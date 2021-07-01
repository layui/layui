
<p align="center">
  <a href="http://www.layui.com">
    <img src="https://sentsin.gitee.io/res/images/layui/layui.png" alt="layui" width="360">
  </a>
</p>
<p align="center">
  Classic modular front-end UI framework
</p>

<p align="center">  
  <a href="https://www.npmjs.com/package/layui"><img src="https://img.shields.io/npm/v/layui.svg?sanitize=true" alt="Version"></a>
  <a href="https://www.npmjs.com/package/layui"><img src="https://img.shields.io/npm/l/layui.svg?sanitize=true" alt="License"></a>
  <a href="https://travis-ci.org/sentsin/layui"><img alt="Build Status" src="https://img.shields.io/travis/sentsin/layui/master.svg"></a>
  <a href="https://coveralls.io/r/sentsin/layui?branch=master"><img alt="Test Coverage" src="https://img.shields.io/coveralls/sentsin/layui/master.svg"></a>
  <!--<a href="https://saucelabs.com/beta/builds/7e6196205e4f492496203388fc003b65"><img src="https://saucelabs.com/buildstatus/layui" alt="Build Status"></a>-->
</p>

<!--
<p align="center">
  <a href="https://saucelabs.com/beta/builds/7e6196205e4f492496203388fc003b65"><img src="https://saucelabs.com/browser-matrix/layui.svg" alt="Browser Matrix"></a>
</p>
-->

---

layui 是一款采用自身模块规范编写的前端 UI 框架，遵循原生 HTML/CSS/JS 的开发方式，极易上手，拿来即用。其风格简约轻盈，而组件优雅丰盈，从源代码到使用方法的每一处细节都经过精心雕琢，非常适合网页界面的快速开发。layui 区别于那些基于 MVVM 底层的前端框架，却并非逆道而行，而是信奉返璞归真之道。准确地说，它更多是面向后端开发者，你无需涉足前端各种工具，只需面对浏览器本身，让一切你所需要的元素与交互，从这里信手拈来。

## 返璞归真

layui 定义为“经典模块化”，并非是自吹她自身有多优秀，而是有意避开当下 JS 社区的主流方案，试图以最简单的方式去诠释高效！<em>她的所谓经典，是在于对返璞归真的执念</em>，她以当前浏览器普通认可的方式去组织模块！我们认为，这恰是符合当下国内绝大多数程序员从旧时代过渡到未来新标准的最佳指引。所以 layui 本身也并不是完全遵循于 AMD 时代，准确地说，她试图建立自己的模式，所以你会看到：

```js
//layui模块的定义
layui.define([mods], function(exports){
  
  //……
  
  exports('mod', api);
});  
 
//layui模块的使用
layui.use(['mod1', 'mod2'], function(args){
  var mod = layui.mod1;
  
  //……
  
});    
```
没错，她具备 AMD 的影子，又并非受限于 CommonJS 的那些条条框框，layui 认为这种轻量的组织方式，比 WebPack 更符合绝大多数场景。所以她坚持采用经典模块化，也正是能让人避开工具的复杂配置，回归简单，安静高效地撸一会原生态的HTML、CSS、JavaScript。

但是 layui 又并非是 Requirejs 那样的模块加载器，而是一款 UI 解决方案，她与 Bootstrap 最大的不同恰恰在于她糅合了自身对经典模块化的理解。


## 快速上手

获得 layui 后，将其完整地部署到你的静态资源项目目录，你只需要引入下述两个文件：

```
./layui/css/layui.css
./layui/layui.js
```

这是一个基本的入门页面：

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
  <title>开始使用 layui</title>
  <link rel="stylesheet" href="../layui/css/layui.css">
</head>
<body>
 
<!-- 你的HTML代码 -->
 
<script src="../layui/layui.js"></script>
<script>
//一般直接写在一个js文件中
layui.use(['layer', 'form'], function(){
  var layer = layui.layer
  ,form = layui.form;
  
  layer.msg('Hello World');
});
</script> 
</body>
</html>
```

## [阅读文档](http://www.layui.com/)
从现在开始，尽情地拥抱 layui 吧！但愿她能成为你长远的开发伴侣，化作你方寸屏幕前的亿万字节！

## 贡献者
> 大概是因为 layui 让开发者变得更懒，所以贡献者才这么少？   
> 好的，姑且就这样认为吧。
 
[![Giteye chart](https://chart.giteye.net/gitee/sentsin/layui/PMFQFJCX.png)](https://giteye.net/chart/PMFQFJCX)

## 相关
[官网](http://www.layui.com/)、[更新日志](http://www.layui.com/doc/base/changelog.html)