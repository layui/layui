---
title: 按钮
toc: true
---
 
# 按钮

> 向任意 `HTML` 标签设定`class="layui-btn"` 建立一个基础按钮。通过追加格式为`layui-btn-{type}`的 `class`  来定义其它按钮风格。内置的按钮  `class` 可以进行任意组合，从而形成更多种按钮风格。

<h2 id="theme" lay-toc="">按钮主题</h2>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code']}">
  <textarea>
<div class="layui-btn-container">
  <button type="button" class="layui-btn">默认按钮</button>
  <button type="button" class="layui-btn layui-bg-blue">蓝色按钮</button>
  <button type="button" class="layui-btn layui-bg-orange">橙色按钮</button>
  <button type="button" class="layui-btn layui-bg-red">红色按钮</button>
  <button type="button" class="layui-btn layui-bg-purple">紫色按钮</button>
  <button type="button" class="layui-btn layui-btn-disabled">禁用按钮</button>
</div>
 
<div class="layui-btn-container">
  <button class="layui-btn layui-btn-primary layui-border-green">主色按钮</button>
  <button class="layui-btn layui-btn-primary layui-border-blue">蓝色按钮</button>
  <button class="layui-btn layui-btn-primary layui-border-orange">橙色按钮</button>
  <button class="layui-btn layui-btn-primary layui-border-red">红色按钮</button>
  <button class="layui-btn layui-btn-primary layui-border-purple">紫色按钮</button>
  <button class="layui-btn layui-btn-primary layui-border">普通按钮</button>
</div>
  </textarea>
</pre>

<h2 id="size" lay-toc="">按钮尺寸</h2>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code']}">
  <textarea>
<div class="layui-btn-container">  
  <button type="button" class="layui-btn layui-btn-lg">大型按钮</button>
  <button type="button" class="layui-btn">默认按钮</button>
  <button type="button" class="layui-btn layui-btn-sm">小型按钮</button>
  <button type="button" class="layui-btn layui-btn-xs">迷你按钮</button>
</div> 
 
<div class="layui-btn-container">
  <button type="button" class="layui-btn layui-btn-lg layui-btn-normal">大型按钮</button>
  <button type="button" class="layui-btn layui-btn-normal">默认按钮</button>
  <button type="button" class="layui-btn layui-btn-sm layui-btn-normal">小型按钮</button>
  <button type="button" class="layui-btn layui-btn-xs layui-btn-normal">迷你按钮</button>
</div>
 
<div class="layui-btn-container">
  <button type="button" class="layui-btn layui-btn-primary layui-btn-lg">大型按钮</button>
  <button type="button" class="layui-btn layui-btn-primary">默认按钮</button>
  <button type="button" class="layui-btn layui-btn-primary layui-btn-sm">小型按钮</button>
  <button type="button" class="layui-btn layui-btn-primary layui-btn-xs">迷你按钮</button>
</div>
 
<div style="width: 380px;">
  <button type="button" class="layui-btn layui-btn-fluid">流体按钮（宽度自适应）</button>
</div>
  </textarea>
</pre>

<h2 id="radius" lay-toc="">按钮圆角</h2>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code']}">
  <textarea>
<div class="layui-btn-container">
  <button type="button" class="layui-btn layui-btn-primary layui-btn-radius">原始按钮</button>
  <button type="button" class="layui-btn layui-btn-radius">默认按钮</button>
  <button type="button" class="layui-btn layui-btn-normal layui-btn-radius">百搭按钮</button>
  <button type="button" class="layui-btn layui-btn-warm layui-btn-radius">暖色按钮</button>
  <button type="button" class="layui-btn layui-btn-danger layui-btn-radius">警告按钮</button>
  <button type="button" class="layui-btn layui-btn-disabled layui-btn-radius">禁用按钮</button>
</div>
  </textarea>
</pre>

<h2 id="icon" lay-toc="">按钮图标</h2>

<pre class="layui-code" lay-options="{preview: true, codeStyle: 'max-height: 350px;', layout: ['preview', 'code']}">
  <textarea>
<div class="layui-btn-container">
  <button type="button" class="layui-btn">
    按钮 <i class="layui-icon layui-icon-down layui-font-12"></i>
  </button>
  <button type="button" class="layui-btn">
    <i class="layui-icon layui-icon-left"></i>
  </button>
  <button type="button" class="layui-btn">
    <i class="layui-icon layui-icon-right"></i>
  </button>
  <button type="button" class="layui-btn">
    <i class="layui-icon layui-icon-edit"></i>
  </button>
  <button type="button" class="layui-btn">
    <i class="layui-icon layui-icon-share"></i>
  </button>
</div>

<div class="layui-btn-container">
  <button type="button" class="layui-btn layui-btn-sm layui-btn-primary">
    <i class="layui-icon layui-icon-left"></i>
  </button>
  <button type="button" class="layui-btn layui-btn-sm layui-btn-primary">
    <i class="layui-icon layui-icon-right"></i>
  </button>
  <button type="button" class="layui-btn layui-btn-sm layui-btn-primary">
    <i class="layui-icon layui-icon-edit"></i>
  </button>
  <button type="button" class="layui-btn layui-btn-sm layui-btn-primary">
    <i class="layui-icon layui-icon-delete"></i>
  </button>
  <button type="button" class="layui-btn layui-btn-sm layui-btn-primary">
    <i class="layui-icon layui-icon-share"></i>
  </button>
  <button type="button" class="layui-btn layui-btn-sm layui-btn-disabled">
    <i class="layui-icon layui-icon-delete"></i>
  </button>
  
  <button type="button" class="layui-btn layui-btn-sm layui-btn-normal">
    <i class="layui-icon layui-icon-left"></i>
  </button>
  <button type="button" class="layui-btn layui-btn-sm layui-btn-warm">
    <i class="layui-icon layui-icon-right"></i>
  </button>
  <button type="button" class="layui-btn layui-btn-sm layui-btn-danger">
    <i class="layui-icon layui-icon-edit"></i>
  </button>
</div>
  </textarea>
</pre>

<h2 id="mashup" lay-toc="">按钮混搭</h2>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code']}">
  <textarea>
<div class="layui-btn-container">
  <button type="button" class="layui-btn layui-btn-lg layui-btn-primary layui-btn-radius">大型加圆角</button>
  <a href="/" class="layui-btn" target="_blank">跳转的按钮</a>
  <button type="button" class="layui-btn layui-btn-sm layui-btn-normal">
    <i class="layui-icon layui-icon-delete"></i> 删除
  </button>
  <button type="button" class="layui-btn layui-btn-xs layui-btn-disabled">
    <i class="layui-icon layui-icon-share"></i> 分享
  </button>
</div> 
  </textarea>
</pre>

<h2 id="group" lay-toc="">按钮组合</h2>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], codeStyle: 'max-height: 350px;'}">
  <textarea>
<div class="layui-btn-group">
  <button type="button" class="layui-btn">增加</button>
  <button type="button" class="layui-btn ">编辑</button>
  <button type="button" class="layui-btn">删除</button>
</div>
 
<div class="layui-btn-group">
  <button type="button" class="layui-btn layui-btn-sm">
    <i class="layui-icon layui-icon-add-1"></i>
  </button>
  <button type="button" class="layui-btn layui-btn-sm">
    <i class="layui-icon layui-icon-edit"></i>
  </button>
  <button type="button" class="layui-btn layui-btn-sm">
    <i class="layui-icon layui-icon-delete"></i>
  </button>
  <button type="button" class="layui-btn layui-btn-sm">
    <i class="layui-icon layui-icon-right"></i>
  </button>
</div>
 
<div class="layui-btn-group">
  <button type="button" class="layui-btn layui-btn-primary layui-btn-sm">文字</button>
  <button type="button" class="layui-btn layui-btn-primary layui-btn-sm">
    <i class="layui-icon layui-icon-add-1"></i>
  </button>
  <button type="button" class="layui-btn layui-btn-primary layui-btn-sm">
    <i class="layui-icon layui-icon-edit"></i>
  </button>
  <button type="button" class="layui-btn layui-btn-primary layui-btn-sm">
    <i class="layui-icon layui-icon-delete"></i>
  </button>
</div>
  </textarea>
</pre>

<h2 id="container" lay-toc="">按钮容器</h2>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code']}">
  <textarea>
<div class="layui-btn-container">
  <button type="button" class="layui-btn">按钮一</button> 
  <button type="button" class="layui-btn">按钮二</button> 
  <button type="button" class="layui-btn">按钮三</button> 
</div>
<div class="layui-btn-container">
  <button type="button" class="layui-btn">按钮一</button> 
  <button type="button" class="layui-btn">按钮二</button> 
  <button type="button" class="layui-btn">按钮三</button> 
</div>
  </textarea>
</pre>

<br>

## 小贴士

> 按钮的主题、尺寸、图标、圆角的交叉组合，可以形成丰富多样的按钮种类。其中颜色也可以根据使用场景自主更改。