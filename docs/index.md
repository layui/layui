---
title: 开始使用
toc: true
---
 
<h1 id="introduce" lay-toc="{title: '简介'}">开始使用</h1>

> Layui 是一套免费的开源 Web UI 组件库，采用自身轻量级模块化规范，遵循原生态的 HTML/CSS/JavaScript 开发模式，极易上手，拿来即用。其风格简约轻盈，而内在雅致丰盈，甚至包括文档在内的每一处细节都经过精心雕琢，非常适合网页界面的快速构建。Layui 区别于一众主流的前端框架，却并非逆道而行，而是信奉返璞归真之道。确切地说，它更多是面向于追求简单的务实主义者，即无需涉足各类构建工具，只需面向浏览器本身，便可将页面所需呈现的元素与交互信手拈来。

<p style="font-size: 68px; text-align: center; color: #16baaa;">
  Layui
</p>

<table class="layui-table">
  <tbody>
    <tr>
      <td>谐音：类 UI</td>
      <td>用途：用于更简单快速地构建网页界面</td>
    </tr>
    <tr>
      <td>环境：全部主流 Web 浏览器（IE8 以下除外）</td>
      <td>特性：原生态开发 / 轻量级模块化 / 外简内丰 / 开箱即用</td>
    </tr>
  </tbody>
</table>

<h2 id="install" lay-toc="">下载引用</h2>

您可以通过以下任意一种方式获得 Layui :

### 🌕 官网下载

您可以在 [官网首页](/) 或 [更新日志](./versions.html) 页面下载到 Layui，它经过了自动化构建，更适合用于生产环境。目录结构如下：

```
layui/
  ├─css
  │  └─layui.css   # 核心样式库
  └─layui.js       # 核心模块库
```

### 🌕 Git 下载

> 您也可以通过 [GitHub](https://github.com/layui/layui/releases) 或 [Gitee](https://gitee.com/layui/layui/releases) 的 releases 列表下载，或直接下载整个仓库。

<p>
  <iframe src="//ghbtns.com/github-btn.html?user=layui&amp;repo=layui&amp;type=watch&amp;count=true&amp;size=large" allowtransparency="true" frameborder="0" scrolling="0" width="156px" height="30px"></iframe>
  <iframe src="//ghbtns.com/github-btn.html?user=layui&amp;repo=layui&amp;type=fork&amp;count=true&amp;size=large" allowtransparency="true" frameborder="0" scrolling="0" width="156px" height="30px"></iframe>
</p>
<div class="layui-btn-container">
  <a class="layui-btn layui-btn-normal" href="https://github.com/layui/layui/" target="_blank" rel="nofollow" style="background-color: #24292E; color: #fff;">GitHub</a>
  <a class="layui-btn layui-btn-normal" href="https://gitee.com/layui/layui/" target="_blank" rel="nofollow" style="background-color: #C71D23; color: #fff;">Gitee</a>
</div>

### 🌕 npm 下载

```
npm i layui
```

### 🌕 第三方 CDN 方式引入：

> UNPKG 和 CDNJS 均为第三方免费 CDN，资源通过 NPM/GitHub 进行同步。另外还可以采用国内的 [Staticfile CDN](https://www.staticfile.org/)。

<div class="layui-btn-container">
  <a class="layui-btn layui-btn-primary layui-border-black" href="https://unpkg.com/browse/layui/dist/" target="_blank" rel="nofollow">UNPKG</a>
  <a class="layui-btn layui-btn-primary" style="border-color: #E64E3D; color: #E64E3D;" href="https://cdnjs.com/libraries/layui" target="_blank" rel="nofollow">CDNJS</a>   
</div>


```
<!-- 引入 layui.css -->
<link href="//unpkg.com/layui@{{= d.layui.v }}/dist/css/layui.css" rel="stylesheet">
```
```
<!-- 引入 layui.js -->
<script src="//unpkg.com/layui@{{= d.layui.v }}/dist/layui.js">
```

<h2 id="quickstart" lay-toc="{}">快速上手</h2>

现在，让我们以一个最简单的示例开始入门：

<pre class="layui-code" lay-options="{preview: 'iframe', previewStyle: 'height: 210px;', copy: true, tools: []}">
  <textarea>
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Quick Start - Layui</title>
  <link href="{{= d.layui.cdn.css }}" rel="stylesheet">
</head>
<body>
  <!-- HTML Content -->
  <script src="{{= d.layui.cdn.js }}"></script>
  <script>
  // Usage
  layui.use(function(){
    var layer = layui.layer;
    // Welcome
    layer.msg('Hello World', {icon: 6});
  });
  </script> 
</body>
</html>
  </textarea>
</pre>

点击上方 `Preview` 标签可进行效果预览。

<h2 id="help">其他帮助</h2>

- <a href="https://codepen.io/layui/pen/bGxZXrd" target="_blank" rel="nofollow">在线测试</a>
- <a href="https://github.com/Sight-wcg/layui-theme-dark" target="_blank">深色主题</a> (社区贡献)


## 初识寄语

> 愿 Layui 从此成为您得心应手的 Web 界面解决方案，化作您方寸屏幕前的亿万字节！