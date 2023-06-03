---
title: 公共类 class
toc: true
---
 
# 公共类

> 公共类是 `layui.css` 中并不以组件形式存在的公共 `class` 选择器，而又能用于任何地方。

<h2 id="base" lay-toc="{}" style="margin-bottom: 0;">普通类</h2>

| className | 描述 |
| --- | --- |
| layui-main | 设置一个固定宽度为 `1160px` 的水平居中块 |
| layui-border-box | 设置元素及其所有子元素均为 `box-sizing: content-box` 模型的容器 |
| layui-clear | 清除前面的同级元素产生的浮动 |
| layui-clear-space <sup>2.8+</sup> | 清除容器内的空白符 |
| layui-inline | 设置元素为内联块状结构 |
| layui-elip | 设置单行文本溢出并显示省略号 |
| layui-unselect | 屏蔽选中 |
| layui-disabled | 设置元素为不可点击状态 |
| layui-circle | 设置元素为圆形。需确保 `width` 和 `height` 相同 |

<h2 id="display" lay-toc="{hot: true}">显示隐藏</h2>

| className | 描述 |
| --- | --- |
| layui-show | 设置元素为 `display: block` 可见状态 |
| layui-hide | 设置元素为 `display: none` 隐藏状态，且不占用空间 |
| layui-show-v | 设置元素为 `visibility: visible` 可见状态 |
| layui-hide-v | 设置元素为 `visibility: hidden` 不可见状态，且依旧占用空间 |


<h2 id="edge" lay-toc="{}">三角实体</h2>

| className | 描述 |
| --- | --- |
| layui-edge | 定义一个三角形基础类 |
| layui-edge-top | 设置向上三角 |
| layui-edge-right | 设置向右三角 |
| layui-edge-bottom | 设置向下三角 |
| layui-edge-left | 设置向左三角 |

示例

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
向上三角： 
<i class="layui-edge layui-edge-top"></i> 
<i class="layui-edge layui-edge-top" style="border-bottom-color: black;"></i>

<hr>
向右三角： 
<i class="layui-edge layui-edge-right"></i>
<i class="layui-edge layui-edge-right" style="border-left-color: black;"></i>

<hr>
向下三角： 
<i class="layui-edge layui-edge-bottom"></i>
<i class="layui-edge layui-edge-bottom" style="border-top-color: black;"></i>

<hr>
向左三角： 
<i class="layui-edge layui-edge-left"></i>
<i class="layui-edge layui-edge-left" style="border-right-color: black;"></i>
  </textarea>
</pre>


<h2 id="bg" lay-toc="{hot: true}">背景颜色</h2>

| className | 背景色 | 预览 |
| --- | --- | --- |
| layui-bg-red | 红 | <div class="layui-bg-red">&nbsp;</div> |
| layui-bg-orange | 橙 | <div class="layui-bg-orange">&nbsp;</div> |
| layui-bg-green |  绿 | <div class="layui-bg-green">&nbsp;</div> |
| layui-bg-blue |  蓝 | <div class="layui-bg-blue">&nbsp;</div> |
| layui-bg-purple <sup>2.8+</sup> | 紫 | <div class="layui-bg-purple">&nbsp;</div> |
| layui-bg-black | 深 | <div class="layui-bg-black">&nbsp;</div> |
| layui-bg-gray |  浅 | <div class="layui-bg-gray">&nbsp;</div> |

<h2 id="font-size" lay-toc="{}">文字大小</h2>

| className | 文字大小和预览 |
| --- | --- |
| layui-font-12 | <span class="layui-font-12">12px</span> |
| layui-font-13 <sup>2.8+</sup> | <span class="layui-font-13">13px</span> |
| layui-font-14 | <span class="layui-font-14">14px</span> |
| layui-font-16 | <span class="layui-font-16">16px</span> |
| layui-font-18 | <span class="layui-font-18">18px</span> |
| layui-font-20 | <span class="layui-font-20">20px</span> |
| layui-font-22 <sup>2.8+</sup> | <span class="layui-font-22">22px</span> |
| layui-font-24 <sup>2.8+</sup> | <span class="layui-font-24">24px</span> |
| layui-font-26 <sup>2.8+</sup> | <span class="layui-font-26">26px</span> |
| layui-font-28 <sup>2.8+</sup> | <span class="layui-font-28">28px</span> |
| layui-font-30 <sup>2.8+</sup> | <span class="layui-font-30">30px</span> |
| layui-font-32 <sup>2.8+</sup> | <span class="layui-font-32">32px</span> |

<h2 id="font-color" lay-toc="{}">文字颜色</h2>

| className | 文字颜色和预览 |
| --- | --- |
| layui-font-red | <span class="layui-font-red">红</span> |
| layui-font-orange | <span class="layui-font-orange">橙</span> |
| layui-font-green | <span class="layui-font-green">绿</span> |
| layui-font-blue | <span class="layui-font-blue">蓝</span> |
| layui-font-purple <sup>2.8+</sup> | <span class="layui-font-purple">紫</span> |
| layui-font-black | <span class="layui-font-black">深</span> |
| layui-font-gray | <span class="layui-font-gray">浅</span> |

<h2 id="text" lay-toc="{hot: true}">文档容器</h2>

通过设置 `class="layui-text"` 定义一段包含标题、段落、列表、链接等组合的文档区域。

<pre class="layui-code" lay-options="{preview: 'iframe', style: 'height: 535px;', layout: ['preview', 'code'], tools: ['full','window']}">
  <textarea>
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>文本区域演示 - Layui</title>
  <meta name="renderer" content="webkit">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="{{= d.layui.cdn.css }}" rel="stylesheet">
</head>
<body>
  <div class="layui-text" style="padding: 16px;">
    <h1>标题1</h1>
    <h2>标题2</h2>
    <h3>标题3</h3>
    <h4>标题4</h4>
    <h5>标题5</h5>
    <h6>标题6</h6>
    
    <hr>

    <ul>
      <li>列表1</li>
      <li>
        列表2
        <ul>
          <li>列表2-1</li>
          <li>列表2-2</li>
          <li>列表2-3</li>
        </ul>
      </li>
      <li>列表3</li>
    </ul>

    <hr>

    <ol>
      <li>列表1</li>
      <li>列表2</li>
      <li>列表3</li>
    </ol>

    <hr>

    <h2>标题2</h2>
    <p>段落1段落1段落1段落1段落1段落1段落1段落1段落1段落1段落1段落1段落1段落1段落1段落1段落1段落1段落1段落1段落1段落1段落1段落1段落1段落1段落1段落1段落1段落1段落1段落1段落1段落1</p>
    <p>段落2段落2段落2段落2段落2段落2段落2段落2段落2段落2段落2段落2段落2段落2段落2段落2段落2段落2段落2段落2段落2段落2段落2段落2段落2段落2段落2段落2段落2段落2段落2段落2段落2段落2</p>
    <blockquote>引用</blockquote>
    <p>这是一个包含<a href="javascript:;">超文本</a>和<strong>加粗文本</strong>的段落</p>
  </div>
</body>
</html>
  </textarea>
</pre>