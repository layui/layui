---
title: 栅格布局
toc: true
---
 
# 栅格布局

> Layui 栅格系统是一套具备响应式能力的布局方案，采用业界比较常用的容器横向 `12` 等分规则，预设了 `5*12` 种 CSS 排列类，内置多种大小尺寸的多终端适配，能很好地实现响应式布局，这意味着一套系统，能同时适配于电脑的不同大小屏幕和手机、平板等移动屏幕，使得网页布局变得更加灵活，同时也极大地降低了 `HTML/CSS` 代码的耦合。

<h2 id="examples" lay-toc="{hot: true}">示例</h2>

> 贴士：以下示例中的*背景色*仅仅只是为了让布局效果显得更加直观，实际使用时并不需要背景色。

<style>
.layui-code-item-preview .layui-row{margin-bottom: 11px;}
.layui-code-item-preview .layui-row:last-child{margin-bottom: 0;}
</style>

- 始终等比例水平排列：

<pre class="layui-code" lay-options="{preview: true, codeStyle: 'max-height: 450px;', layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<div class="layui-row">
  <div class="layui-col-xs6">
    <div class="grid-demo grid-demo-bg1">6/12</div>
  </div>
  <div class="layui-col-xs6">
    <div class="grid-demo">6/12</div>
  </div>
</div>
<div class="layui-row">
  <div class="layui-col-xs3">
    <div class="grid-demo grid-demo-bg1">3/12</div>
  </div>
  <div class="layui-col-xs3">
    <div class="grid-demo">3/12</div>
  </div>
  <div class="layui-col-xs3">
    <div class="grid-demo grid-demo-bg1">3/12</div>
  </div>
  <div class="layui-col-xs3">
    <div class="grid-demo">3/12</div>
  </div>
</div>
  </textarea>
</pre>

- 移动设备、桌面端的组合响应式展现：

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<div class="layui-row">
  <div class="layui-col-xs12 layui-col-md8">
    <div class="grid-demo grid-demo-bg1">xs:12/12 | md:8/12</div>
  </div>
  <div class="layui-col-xs6 layui-col-md4">
    <div class="grid-demo">xs:6/12 | md:4/12</div>
  </div>
  <div class="layui-col-xs6 layui-col-md12">
    <div class="grid-demo grid-demo-bg2">xs:6/12 | md:12/12</div>
  </div>
</div>
  </textarea>
</pre>

- 移动设备、平板、桌面端的复杂组合响应式展现：

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<div class="layui-row">
  <div class="layui-col-xs6 layui-col-sm6 layui-col-md4">
    <div class="grid-demo grid-demo-bg1">xs:6/12 | sm:6/12 | md:4/12</div>
  </div>
  <div class="layui-col-xs6 layui-col-sm6 layui-col-md4">
    <div class="grid-demo layui-bg-red">xs:6/12 | sm:6/12 | md:4/12</div>
  </div>
  <div class="layui-col-xs4 layui-col-sm12 layui-col-md4">
    <div class="grid-demo layui-bg-blue">xs:4/12 | sm:12/12 | md:4/12</div>
  </div>
  <div class="layui-col-xs4 layui-col-sm7 layui-col-md8">
    <div class="grid-demo layui-bg-green">xs:4/12 | sm:7/12 | md:8/12</div>
  </div>
  <div class="layui-col-xs4 layui-col-sm5 layui-col-md4">
    <div class="grid-demo layui-bg-black">xs:4/12 | sm:5/12 | md:4/12</div>
  </div>
</div>
  </textarea>
</pre>

- 常规布局：从小屏幕堆叠到桌面水平排列：

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<div class="layui-row">
  <div class="layui-col-md1">
    <div class="grid-demo grid-demo-bg1">1/12</div>
  </div>
  <div class="layui-col-md1">
    <div class="grid-demo">1/12</div>
  </div>
  <div class="layui-col-md1">
    <div class="grid-demo grid-demo-bg1">1/12</div>
  </div>
  <div class="layui-col-md1">
    <div class="grid-demo">1/12</div>
  </div>
  <div class="layui-col-md1">
    <div class="grid-demo grid-demo-bg1">1/12</div>
  </div>
  <div class="layui-col-md1">
    <div class="grid-demo">1/12</div>
  </div>
  <div class="layui-col-md1">
    <div class="grid-demo grid-demo-bg1">1/12</div>
  </div>
  <div class="layui-col-md1">
    <div class="grid-demo">1/12</div>
  </div>
  <div class="layui-col-md1">
    <div class="grid-demo grid-demo-bg1">1/12</div>
  </div>
  <div class="layui-col-md1">
    <div class="grid-demo">1/12</div>
  </div>
  <div class="layui-col-md1">
    <div class="grid-demo grid-demo-bg1">1/12</div>
  </div>
  <div class="layui-col-md1">
    <div class="grid-demo">1/12</div>
  </div>
</div>
 
<div class="layui-row">
  <div class="layui-col-md9">
    <div class="grid-demo grid-demo-bg1">75%</div>
  </div>
  <div class="layui-col-md3">
    <div class="grid-demo">25%</div>
  </div>
</div>
 
<div class="layui-row">
  <div class="layui-col-md4">
    <div class="grid-demo grid-demo-bg1">33.33%</div>
  </div>
  <div class="layui-col-md4">
    <div class="grid-demo">33.33%</div>
  </div>
  <div class="layui-col-md4">
    <div class="grid-demo grid-demo-bg1">33.33%</div>
  </div>
</div>
   
<div class="layui-row">
  <div class="layui-col-md6">
    <div class="grid-demo grid-demo-bg1">50%</div>
  </div>
  <div class="layui-col-md6">
    <div class="grid-demo">50%</div>
  </div>
</div>
  </textarea>
</pre>

- 列间隔：

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<div class="layui-row layui-col-space1">
  <div class="layui-col-md3">
    <div class="grid-demo grid-demo-bg1">1/4</div>
  </div>
  <div class="layui-col-md3">
    <div class="grid-demo">1/4</div>
  </div>
  <div class="layui-col-md3">
    <div class="grid-demo grid-demo-bg1">1/4</div>
  </div>
  <div class="layui-col-md3">
    <div class="grid-demo">1/4</div>
  </div>
</div>
 
<div class="layui-row layui-col-space5">
  <div class="layui-col-md4">
    <div class="grid-demo grid-demo-bg1">1/3</div>
  </div>
  <div class="layui-col-md4">
    <div class="grid-demo">1/3</div>
  </div>
  <div class="layui-col-md4">
    <div class="grid-demo grid-demo-bg1">1/3</div>
  </div>
</div>
 
<div class="layui-row layui-col-space10">
  <div class="layui-col-md9">
    <div class="grid-demo grid-demo-bg1">9/12</div>
  </div>
  <div class="layui-col-md3">
    <div class="grid-demo">3/12</div>
  </div>
</div>
 
<div class="layui-row layui-col-space15">
  <div class="layui-col-md7">
    <div class="grid-demo grid-demo-bg1">7/12</div>
  </div>
  <div class="layui-col-md5">
    <div class="grid-demo">5/12</div>
  </div>
</div>
 
<div class="layui-row layui-col-space30">
  <div class="layui-col-md7">
    <div class="grid-demo grid-demo-bg1">7/12</div>
  </div>
  <div class="layui-col-md5">
    <div class="grid-demo">5/12</div>
  </div>
</div>
  </textarea>
</pre>

- 列偏移

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<div class="layui-row">
  <div class="layui-col-md4">
    <div class="grid-demo grid-demo-bg1">4/12</div>
  </div>
  <div class="layui-col-md4 layui-col-md-offset4">
    <div class="grid-demo">偏移4列</div>
  </div>
</div>
 
<div class="layui-row">
  <div class="layui-col-md3 layui-col-md-offset3">
    <div class="grid-demo grid-demo-bg1">偏移3列</div>
  </div>
  <div class="layui-col-md3">
    <div class="grid-demo">不偏移</div>
  </div>
</div>
  </textarea>
</pre>

- 栅格嵌套：

> 理论上，你可以对栅格进行无穷层次的嵌套，这更加增强了栅格的表现能力

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<div class="layui-row">
  <div class="layui-col-md5">
    <div class="layui-row grid-demo">
      <div class="layui-col-md3">
        <div class="grid-demo grid-demo-bg1">内部列</div>
      </div>
      <div class="layui-col-md9">
        <div class="grid-demo grid-demo-bg2">内部列</div>
      </div>
      <div class="layui-col-md12">
        <div class="grid-demo grid-demo-bg3">内部列</div>
      </div>
    </div>
  </div>
  <div class="layui-col-md7">
    <div class="layui-row grid-demo grid-demo-bg1">
      <div class="layui-col-md12">
        <div class="grid-demo">内部列</div>
      </div>
      <div class="layui-col-md9">
        <div class="grid-demo grid-demo-bg2">内部列</div>
      </div>
      <div class="layui-col-md3">
        <div class="grid-demo grid-demo-bg3">内部列</div>
      </div>
    </div>
  </div>
</div>
  </textarea>
</pre>

- 流体容器（宽度自适应，不固定）：

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<div class="layui-row">
  <div class="layui-col-sm3">
    <div class="grid-demo grid-demo-bg1">25%</div>
  </div>
  <div class="layui-col-sm3">
    <div class="grid-demo">25%</div>
  </div>
  <div class="layui-col-sm3">
    <div class="grid-demo grid-demo-bg1">25%</div>
  </div>
  <div class="layui-col-sm3">
    <div class="grid-demo">25%</div>
  </div>
</div>
  </textarea>
</pre>

<br>

<h2 id="rule" lay-toc="">栅格布局规则</h2>

<table class="layui-table">
  <colgroup>
    <col width="50">
    <col>
  </colgroup>
  <tbody>
    <tr>
      <td>1.</td>
      <td>采用 <em>layui-row</em> 来定义行，如：<em>&lt;div class="layui-row">&lt;/div></em> </td>
    </tr>
    <tr>
      <td>2.</td>
      <td>
        采用类似 <em>layui-col-md*</em> 这样的预设类来定义一组列（column），且放在行（row）内。其中：
        <div class="layui-text">
          <ul>
            <li>变量<em>md</em> 代表的是不同屏幕下的标记（可选值见下文）</li>
            <li>变量<em>*</em> 代表的是该列所占用的 12 等分数（如 6/12），可选值为 1 - 12</li>
            <li>如果多个列的“等分数值”总和等于 12，则刚好满行排列。如果大于12，多余的列将自动另起一行。</li>
          </ul>
        </div>
      </td>
    </tr>
    <tr>
      <td>3.</td>
      <td>列可以同时出现最多 5 种不同的组合，分别是：xs / sm / md / lg / xl <sup>2.8+</sup>，以在不同尺寸屏幕下进行自动适配。</td>
    </tr>
    <tr>
      <td>4.</td>
      <td>可对列追加类似 <em>layui-col-space5</em>、 <em>layui-col-md-offset3</em> 这样的预设类来定义列的间距和偏移。</td>
    </tr>
    <tr>
      <td>5.</td>
      <td>最后，在列（column）元素中放入你自己的任意元素填充内容，完成布局！</td>
    </tr>
  </tbody>
</table>

<h2 id="resp" lay-toc="">响应式规则</h2>

栅格的响应式能力，得益于 `CSS3` 媒体查询（`Media Queries`），针对不同尺寸的屏幕进行相应的适配处理。

<table class="layui-table">
  <colgroup>
    <col width="160">
  </colgroup>
  <thead>
    <th></th>
    <th>超小屏幕<br>(手机<768px)</th>
    <th>小屏幕<br>(平板≥768px)</th>
    <th>中等屏幕<br>(桌面≥992px)</th>
    <th>大型屏幕<br>(桌面≥1200px)</th>
    <th>超大屏幕<br>(桌面≥1400px)</th>
  </thead>
  <tbody>
    <tr>
      <td><em>layui-container</em></td>
      <td>auto</td>
      <td>750px</td>
      <td>970px</td>
      <td>1170px</td>
      <td>1330px</td>
    </tr>
    <tr>
      <td>标记</td>
      <td>xs</td>
      <td>sm</td>
      <td>md</td>
      <td>lg</td>
      <td>xl <sup>2.8+</sup></td>
    </tr>
    <tr>
      <td>列对应类</td>
      <td>layui-col-xs*</td>
      <td>layui-col-sm*</td>
      <td>layui-col-md*</td>
      <td>layui-col-lg*</td>
      <td>layui-col-xl*</td>
    </tr>
    <tr>
      <td>总列数</td>
      <td colspan="5">12</td>
    </tr>
    <tr>
      <td>响应行为</td>
      <td>始终按比例水平排列</td>
      <td colspan="4">在当前屏幕下水平排列，如果屏幕大小低于临界值则堆叠排列</td>
    </tr>
  </tbody>
</table>

<h2 id="class" lay-toc="">响应式公共类</h2>

<table class="layui-table">
  <colgroup>
    <col width="150">
    <col>
  </colgroup>
  <thead>
    <tr>
      <th>类名（class）</th>
      <th>说明</th>
    </tr> 
  </thead>
  <tbody>
    <tr>
      <td>layui-show-*-block</td>
      <td class="layui-text">定义不同设备下的 display: block; * 可选值有：xs、sm、md、lg、xl</td>
    </tr>
    <tr>
      <td>layui-show-*-inline</td>
      <td>定义不同设备下的 display: inline; * 可选值同上</td>
    </tr>
    <tr>
      <td>layui-show-*-inline-block</td>
      <td>定义不同设备下的 display: inline-block; * 可选值同上</td>
    </tr>
    <tr>
      <td>layui-hide-*</td>
      <td>定义不同设备下的隐藏类，即： display: none; * 可选值同上</td>
    </tr>
  </tbody>
</table>

<h2 id="container" lay-toc="">布局容器</h2>

将栅格放入一个带有 `class="layui-container"` 的特定容器中，以便在小屏幕以上的设备中固定宽度，让列可控。

```
<div class="layui-container">
  <div class="layui-row">
    ……
  </div>
</div>
```

当然，你还可以不固定容器宽度。将栅格或其它元素放入一个带有 `class="layui-fluid"`的容器中，那么宽度将不会固定，而是 100% 适应

```
<div class="layui-fluid">
  ……
</div>  
```

<h2 id="space" lay-toc="">列间距</h2>

<table class="layui-table">
  <colgroup>
    <col width="200">
    <col>
  </colgroup>
  <tbody>
    <tr>
      <td colspan="2">通过“列间距”的预设类，来设定列之间的间距。且一行中最左的列不会出现左边距，最右的列不会出现右边距。列间距在保证排版美观的同时，还可以进一步保证分列的宽度精细程度。我们结合网页常用的边距，预设了 12 种不同尺寸的边距，分别是：</td>
    </tr>
    <tr>
      <td>
        <pre class="layui-code">
layui-col-space1
layui-col-space2
layui-col-space4
layui-col-space5
layui-col-space6
layui-col-space8
layui-col-space10
layui-col-space12
layui-col-space14
layui-col-space15
layui-col-space16
layui-col-space18
layui-col-space20
layui-col-space22
layui-col-space24
layui-col-space25
layui-col-space26
layui-col-space28
layui-col-space30
layui-col-space32

即：支持列之间为 1px-32px 区间的所有双数间隔，以及 1px、5px、15px、25px 的单数间隔</pre>
      </td>
    </tr>
  </tbody>
</table>

下面是一个简单的例子，列间距为 `16px`：

```
<div class="layui-row layui-col-space16">
  <div class="layui-col-md4">
    1/3
  </div>
  <div class="layui-col-md4">
    1/3
  </div>
  <div class="layui-col-md4">
    1/3
  </div>
</div>
```

<h2 id="offset" lay-toc="">列偏移</h2>

对列追加类似 `layui-col-md-offset*` 的预设类，从而让列向右偏移。如：`layui-col-md-offset3`，即代表在“中型桌面屏幕”下，让该列向右偏移 3 个列宽度。下面是一个采用「列偏移」机制让两个列左右对齐的实例

```
div class="layui-row">
  <div class="layui-col-md4">
    4/12
  </div>
  <div class="layui-col-md4 layui-col-md-offset4">
    偏移4列，从而在最右
  </div>
</div>
```

> 请注意，列偏移可针对不同屏幕的标准进行设定，比如上述的例子，只会在桌面屏幕下有效，当低于桌面屏幕的规定的临界值，就会堆叠排列。

<h2 id="iepatch" lay-toc="">IE8/9 兼容方案</h2>

事实上 `IE8/IE9` 并不支持 `Media Queries`，但你可以使用下面的补丁进行兼容（补丁来自于开源社区）：

```
<!-- 让 IE8/9 支持媒体查询，从而兼容栅格 -->
<!--[if lt IE 9]>
  <script src="https://cdn.staticfile.org/html5shiv/r29/html5.min.js"></script>
  <script src="https://cdn.staticfile.org/respond.js/1.4.2/respond.min.js"></script>
<![endif]-->
```

将上述代码放入你页面 `<body>` 标签内的任意位置即可。