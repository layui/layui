---
title: 按钮
toc: true
---
 
# 按钮

> 向任意 `HTML` 标签设定`class="lay-btn"` 建立一个基础按钮。通过追加格式为`lay-btn-{type}`的 `class`  来定义其它按钮风格。内置的按钮  `class` 可以进行任意组合，从而形成更多种按钮风格。

<h2 id="theme" lay-toc="">按钮主题</h2>

<pre class="lay-code" lay-options="{preview: true, layout: ['preview', 'code']}">
  <textarea>
<div class="lay-btn-container">
  <button type="button" class="lay-btn">默认按钮</button>
  <button type="button" class="lay-btn lay-bg-blue">蓝色按钮</button>
  <button type="button" class="lay-btn lay-bg-orange">橙色按钮</button>
  <button type="button" class="lay-btn lay-bg-red">红色按钮</button>
  <button type="button" class="lay-btn lay-bg-purple">紫色按钮</button>
  <button type="button" class="lay-btn lay-btn-disabled">禁用按钮</button>
</div>
 
<div class="lay-btn-container">
  <button class="lay-btn lay-btn-primary lay-border-green">主色按钮</button>
  <button class="lay-btn lay-btn-primary lay-border-blue">蓝色按钮</button>
  <button class="lay-btn lay-btn-primary lay-border-orange">橙色按钮</button>
  <button class="lay-btn lay-btn-primary lay-border-red">红色按钮</button>
  <button class="lay-btn lay-btn-primary lay-border-purple">紫色按钮</button>
  <button class="lay-btn lay-btn-primary lay-border">普通按钮</button>
</div>
  </textarea>
</pre>

<h2 id="size" lay-toc="">按钮尺寸</h2>

<pre class="lay-code" lay-options="{preview: true, layout: ['preview', 'code']}">
  <textarea>
<div class="lay-btn-container">  
  <button type="button" class="lay-btn lay-btn-lg">大型按钮</button>
  <button type="button" class="lay-btn">默认按钮</button>
  <button type="button" class="lay-btn lay-btn-sm">小型按钮</button>
  <button type="button" class="lay-btn lay-btn-xs">迷你按钮</button>
</div> 
 
<div class="lay-btn-container">
  <button type="button" class="lay-btn lay-btn-lg lay-btn-normal">大型按钮</button>
  <button type="button" class="lay-btn lay-btn-normal">默认按钮</button>
  <button type="button" class="lay-btn lay-btn-sm lay-btn-normal">小型按钮</button>
  <button type="button" class="lay-btn lay-btn-xs lay-btn-normal">迷你按钮</button>
</div>
 
<div class="lay-btn-container">
  <button type="button" class="lay-btn lay-btn-primary lay-btn-lg">大型按钮</button>
  <button type="button" class="lay-btn lay-btn-primary">默认按钮</button>
  <button type="button" class="lay-btn lay-btn-primary lay-btn-sm">小型按钮</button>
  <button type="button" class="lay-btn lay-btn-primary lay-btn-xs">迷你按钮</button>
</div>
 
<div style="width: 380px;">
  <button type="button" class="lay-btn lay-btn-fluid">流体按钮（宽度自适应）</button>
</div>
  </textarea>
</pre>

<h2 id="radius" lay-toc="">按钮圆角</h2>

<pre class="lay-code" lay-options="{preview: true, layout: ['preview', 'code']}">
  <textarea>
<div class="lay-btn-container">
  <button type="button" class="lay-btn lay-btn-primary lay-btn-radius">原始按钮</button>
  <button type="button" class="lay-btn lay-btn-radius">默认按钮</button>
  <button type="button" class="lay-btn lay-btn-normal lay-btn-radius">百搭按钮</button>
  <button type="button" class="lay-btn lay-btn-warm lay-btn-radius">暖色按钮</button>
  <button type="button" class="lay-btn lay-btn-danger lay-btn-radius">警告按钮</button>
  <button type="button" class="lay-btn lay-btn-disabled lay-btn-radius">禁用按钮</button>
</div>
  </textarea>
</pre>

<h2 id="icon" lay-toc="">按钮图标</h2>

<pre class="lay-code" lay-options="{preview: true, codeStyle: 'max-height: 350px;', layout: ['preview', 'code']}">
  <textarea>
<div class="lay-btn-container">
  <button type="button" class="lay-btn">
    按钮 <i class="lay-icon lay-icon-down lay-font-12"></i>
  </button>
  <button type="button" class="lay-btn">
    <i class="lay-icon lay-icon-left"></i>
  </button>
  <button type="button" class="lay-btn">
    <i class="lay-icon lay-icon-right"></i>
  </button>
  <button type="button" class="lay-btn">
    <i class="lay-icon lay-icon-edit"></i>
  </button>
  <button type="button" class="lay-btn">
    <i class="lay-icon lay-icon-share"></i>
  </button>
</div>

<div class="lay-btn-container">
  <button type="button" class="lay-btn lay-btn-sm lay-btn-primary">
    <i class="lay-icon lay-icon-left"></i>
  </button>
  <button type="button" class="lay-btn lay-btn-sm lay-btn-primary">
    <i class="lay-icon lay-icon-right"></i>
  </button>
  <button type="button" class="lay-btn lay-btn-sm lay-btn-primary">
    <i class="lay-icon lay-icon-edit"></i>
  </button>
  <button type="button" class="lay-btn lay-btn-sm lay-btn-primary">
    <i class="lay-icon lay-icon-delete"></i>
  </button>
  <button type="button" class="lay-btn lay-btn-sm lay-btn-primary">
    <i class="lay-icon lay-icon-share"></i>
  </button>
  <button type="button" class="lay-btn lay-btn-sm lay-btn-disabled">
    <i class="lay-icon lay-icon-delete"></i>
  </button>
  
  <button type="button" class="lay-btn lay-btn-sm lay-btn-normal">
    <i class="lay-icon lay-icon-left"></i>
  </button>
  <button type="button" class="lay-btn lay-btn-sm lay-btn-warm">
    <i class="lay-icon lay-icon-right"></i>
  </button>
  <button type="button" class="lay-btn lay-btn-sm lay-btn-danger">
    <i class="lay-icon lay-icon-edit"></i>
  </button>
</div>
  </textarea>
</pre>

<h2 id="mashup" lay-toc="">按钮混搭</h2>

<pre class="lay-code" lay-options="{preview: true, layout: ['preview', 'code']}">
  <textarea>
<div class="lay-btn-container">
  <button type="button" class="lay-btn lay-btn-lg lay-btn-primary lay-btn-radius">大型加圆角</button>
  <a href="/" class="lay-btn" target="_blank">跳转的按钮</a>
  <button type="button" class="lay-btn lay-btn-sm lay-btn-normal">
    <i class="lay-icon lay-icon-delete"></i> 删除
  </button>
  <button type="button" class="lay-btn lay-btn-xs lay-btn-disabled">
    <i class="lay-icon lay-icon-share"></i> 分享
  </button>
</div> 
  </textarea>
</pre>

<h2 id="group" lay-toc="">按钮组合</h2>

<pre class="lay-code" lay-options="{preview: true, layout: ['preview', 'code'], codeStyle: 'max-height: 350px;'}">
  <textarea>
<div class="lay-btn-group">
  <button type="button" class="lay-btn">增加</button>
  <button type="button" class="lay-btn ">编辑</button>
  <button type="button" class="lay-btn">删除</button>
</div>
 
<div class="lay-btn-group">
  <button type="button" class="lay-btn lay-btn-sm">
    <i class="lay-icon lay-icon-add-1"></i>
  </button>
  <button type="button" class="lay-btn lay-btn-sm">
    <i class="lay-icon lay-icon-edit"></i>
  </button>
  <button type="button" class="lay-btn lay-btn-sm">
    <i class="lay-icon lay-icon-delete"></i>
  </button>
  <button type="button" class="lay-btn lay-btn-sm">
    <i class="lay-icon lay-icon-right"></i>
  </button>
</div>
 
<div class="lay-btn-group">
  <button type="button" class="lay-btn lay-btn-primary lay-btn-sm">文字</button>
  <button type="button" class="lay-btn lay-btn-primary lay-btn-sm">
    <i class="lay-icon lay-icon-add-1"></i>
  </button>
  <button type="button" class="lay-btn lay-btn-primary lay-btn-sm">
    <i class="lay-icon lay-icon-edit"></i>
  </button>
  <button type="button" class="lay-btn lay-btn-primary lay-btn-sm">
    <i class="lay-icon lay-icon-delete"></i>
  </button>
</div>
  </textarea>
</pre>

<h2 id="container" lay-toc="">按钮容器</h2>

<pre class="lay-code" lay-options="{preview: true, layout: ['preview', 'code']}">
  <textarea>
<div class="lay-btn-container">
  <button type="button" class="lay-btn">按钮一</button> 
  <button type="button" class="lay-btn">按钮二</button> 
  <button type="button" class="lay-btn">按钮三</button> 
</div>
<div class="lay-btn-container">
  <button type="button" class="lay-btn">按钮一</button> 
  <button type="button" class="lay-btn">按钮二</button> 
  <button type="button" class="lay-btn">按钮三</button> 
</div>
  </textarea>
</pre>

<br>

## 小贴士

> 按钮的主题、尺寸、图标、圆角的交叉组合，可以形成丰富多样的按钮种类。其中颜色也可以根据使用场景自主更改。
