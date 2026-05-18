---
title: 公共类 class
toc: true
---
 
# 公共类

> 公共类是 `layui.css` 中并不以组件形式存在的公共 `class` 选择器，而又能用于任何地方。

<h2 id="base" lay-toc="{}" style="margin-bottom: 0;">普通类</h2>

| className | 描述 |
| --- | --- |
| lay-main | 设置一个固定宽度为 `1160px` 的水平居中块 |
| lay-border-box | 设置元素及其所有子元素均为 `box-sizing: border-box` 模型的容器 |
| lay-clear | 清除前面的同级元素产生的浮动 |
| lay-clear-space <sup>2.8+</sup> | 清除容器内的空白符 |
| lay-inline | 设置元素为内联块状结构 |
| lay-ellip | 设置单行文本溢出并显示省略号 |
| lay-unselect | 屏蔽选中 |
| lay-disabled | 设置元素为不可点击状态 |
| lay-circle | 设置元素为圆形。需确保 `width` 和 `height` 相同 |

<h2 id="display" lay-toc="{hot: true}">显示隐藏</h2>

| className | 描述 |
| --- | --- |
| lay-show | 设置元素为 `display: block` 可见状态 |
| lay-hide | 设置元素为 `display: none` 隐藏状态，且不占用空间 |
| lay-show-v | 设置元素为 `visibility: visible` 可见状态 |
| lay-hide-v | 设置元素为 `visibility: hidden` 不可见状态，且依旧占用空间 |


<h2 id="triangle" lay-toc="{}">三角实体</h2>

| className | 描述 |
| --- | --- |
| lay-edge | 定义一个三角形基础类 |
| lay-edge-top | 设置向上三角 |
| lay-edge-right | 设置向右三角 |
| lay-edge-bottom | 设置向下三角 |
| lay-edge-left | 设置向左三角 |

示例

<pre class="lay-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
向上三角： 
<i class="lay-edge lay-edge-top"></i> 
<i class="lay-edge lay-edge-top" style="border-bottom-color: black;"></i>

<hr>
向右三角： 
<i class="lay-edge lay-edge-right"></i>
<i class="lay-edge lay-edge-right" style="border-left-color: black;"></i>

<hr>
向下三角： 
<i class="lay-edge lay-edge-bottom"></i>
<i class="lay-edge lay-edge-bottom" style="border-top-color: black;"></i>

<hr>
向左三角： 
<i class="lay-edge lay-edge-left"></i>
<i class="lay-edge lay-edge-left" style="border-right-color: black;"></i>
  </textarea>
</pre>

<h2 id="edge-distance" lay-toc="{}">内外边距</h2>

| className | 描述 |
| --- | --- |
| lay-padding-1 | 4px 内边距 |
| lay-padding-2 | 8px 内边距 |
| lay-padding-3 | 16px 内边距 |
| lay-padding-4 | 32px 内边距 |
| lay-padding-5 | 48px 内边距 |
| lay-margin-1 | 4px 外边距 |
| lay-margin-2 | 8px 外边距 |
| lay-margin-3 | 16px 外边距 |
| lay-margin-4 | 32px 外边距 |
| lay-margin-5 | 48px 外边距 |


<h2 id="bg" lay-toc="{hot: true}">背景颜色</h2>

| className | 背景色 | 预览 |
| --- | --- | --- |
| lay-bg-red | 红 | <div class="lay-bg-red">&nbsp;</div> |
| lay-bg-orange | 橙 | <div class="lay-bg-orange">&nbsp;</div> |
| lay-bg-green |  绿 | <div class="lay-bg-green">&nbsp;</div> |
| lay-bg-blue |  蓝 | <div class="lay-bg-blue">&nbsp;</div> |
| lay-bg-purple <sup>2.8+</sup> | 紫 | <div class="lay-bg-purple">&nbsp;</div> |
| lay-bg-black | 深 | <div class="lay-bg-black">&nbsp;</div> |
| lay-bg-gray |  浅 | <div class="lay-bg-gray">&nbsp;</div> |

<h2 id="font-size" lay-toc="{}">文字大小</h2>

| className | 文字大小和预览 |
| --- | --- |
| lay-font-12 | <span class="lay-font-12">12px</span> |
| lay-font-13 <sup>2.8+</sup> | <span class="lay-font-13">13px</span> |
| lay-font-14 | <span class="lay-font-14">14px</span> |
| lay-font-16 | <span class="lay-font-16">16px</span> |
| lay-font-18 | <span class="lay-font-18">18px</span> |
| lay-font-20 | <span class="lay-font-20">20px</span> |
| lay-font-22 <sup>2.8+</sup> | <span class="lay-font-22">22px</span> |
| lay-font-24 <sup>2.8+</sup> | <span class="lay-font-24">24px</span> |
| lay-font-26 <sup>2.8+</sup> | <span class="lay-font-26">26px</span> |
| lay-font-28 <sup>2.8+</sup> | <span class="lay-font-28">28px</span> |
| lay-font-30 <sup>2.8+</sup> | <span class="lay-font-30">30px</span> |
| lay-font-32 <sup>2.8+</sup> | <span class="lay-font-32">32px</span> |

<h2 id="font-color" lay-toc="{}">文字颜色</h2>

| className | 文字颜色和预览 |
| --- | --- |
| lay-font-red | <span class="lay-font-red">红</span> |
| lay-font-orange | <span class="lay-font-orange">橙</span> |
| lay-font-green | <span class="lay-font-green">绿</span> |
| lay-font-blue | <span class="lay-font-blue">蓝</span> |
| lay-font-purple <sup>2.8+</sup> | <span class="lay-font-purple">紫</span> |
| lay-font-black | <span class="lay-font-black">深</span> |
| lay-font-gray | <span class="lay-font-gray">浅</span> |

<h2 id="text" lay-toc="{hot: true}">文本容器</h2>

通过设置 `class="lay-text"` 定义一段包含标题、段落、列表等组合的文本区域，通常用于 Markdown 文档。

<pre class="lay-code" lay-options="{preview: 'iframe', style: 'height: 535px;', layout: ['preview', 'code'], tools: ['full','window']}">
  <textarea>
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>文本区域演示 - Layui</title>
  <meta name="renderer" content="webkit">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="{{= d.layui[2].cdn.css }}" rel="stylesheet">
</head>
<body class="lay-padding-3">
  <div class="lay-text">
    <h1>标题1</h1>
    <p>段落1段落1段落1段落1段落1段落1段落1段落1段落1 <sup class="footnote-ref"><a href="javascript:;">[1]</a></sup></p>
    <h2>标题2</h2>
    <p>段落2段落2 <strong>加粗</strong> <em>强调</em>  段落2段落2段落2段落2段落2段落2段落2段落2段落2段落2段落2段落2段落2</p>
    <p>段落2-1 <code>inline code</code> 段落2-1段落2-1段落2-1段落2-1段落2-1段落2-1段落2-1段落2-1段落2-1段落2-1段落2-1段落2-1段落2-1段落2-1段落2-1段落2-1段落2-1段落2-1段落2-1段落2-1段落2-1段落2-1段落2-1段落2-1段落2-1</p>
    <h3>标题3</h3>
    <p>段落3段落3段落3段落3段落3段落3段落3段落3段落3段落3段落3段落3段落3段落3段落3段落3 <a href="javascript:;">链接</a></p>
    <h4>标题4</h4>
    <h5>标题5</h5>
    <h6>标题6</h6>
    <p>段落6段落6段落6段落6段落6段落6段落6段落6段落6</p>

    <h3>无序列表</h3>
    <ul>
      <li>列表1</li>
      <li>
        列表2
        <ul>
          <li>
            列表2-1
            <ul>
              <li>列表2-1-1</li>
            </ul>
          </li>
          <li>列表2-2</li>
        </ul>
      </li>
      <li>列表3</li>
    </ul>

    <h3>有序列表</h3>
    <ol>
      <li>列表1</li>
      <li>列表2</li>
      <li>列表3</li>
    </ol>

    <h3>混合列表</h3>
    <ol>
      <li>
        <p>有序列表1</p>
        <ul>
          <li>无序列表1-1</li>
          <li>无序列表1-2</li>
          <li>无序列表1-3</li>
        </ul>
      </li>
      <li>
        <p>有序列表2</p>
        <ul>
          <li>
            <p>无序列表2-1</p>
            <ol>
              <li>有序列表2-1-1</li>
              <li>有序列表2-1-2</li>
            </ol>
          </li>
          <li>
            <p>无序列表2-2</p>
            <ol>
              <li>有序列表2-2-1</li>
            </ol>
          </li>
        </ul>
      </li>
      <li>有序列表3</li>
    </ol>

    <h3>Blockquote</h3>
    <blockquote>
      <p>引用</p>
      <blockquote>内嵌引用<blockquote>内嵌引用</blockquote></blockquote>
    </blockquote>

    <h3>Code</h3>
&lt;pre&gt;<code>var cp = function(){
  return gulp.src('./dist/**/*')
  .pipe(gulp.dest(dest));
};
</code>&lt;/pre&gt;
    <hr>
    <p id="ref-1">Footer</p>
  </div>
</body>
</html>
  </textarea>
</pre>

