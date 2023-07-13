---
title: 输入框 / 文本域
toc: true
---
 
# 输入框

> 输入框组件是对文本框`<input type="text">`和多行文本框`<textarea>`元素的扩展


<h2 id="text" lay-toc="">普通输入框</h2>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full'], done: function(obj){
  obj.render();
}}">
  <textarea>
<div class="layui-form">
  <input type="text" name="" placeholder="文本框" class="layui-input">
  <hr class="ws-space-16">
  &lt;textarea name="" placeholder="多行文本框" class="layui-textarea"&gt;&lt;/textarea&gt;
</div>
  </textarea>
</pre>


<h2 id="wrap" lay-toc="{hot: true}">输入框点缀 <sup>2.8+</sup></h2>

输入框点缀是指给普通输入框附加其他元素来进行动静态修饰，其结构包含：*容器、前缀、输入框、后缀*。

```
<div class="layui-input-{容器类}">
  <div class="layui-input-{前缀类}"></div>
  <input class="layui-input" placeholder="输入框">
  <div class="layui-input-{后缀类}"></div>
</div>
```

- 容器类：
  - 前置和后置结构：`class="layui-input-group"`
  - 前缀和后缀结构：`class="layui-input-wrap"`
- 前缀类：`class="layui-input-prefix"`
- 后缀类：`class="layui-input-suffix"`
- 前缀显示分隔框：`class="layui-input-prefix layui-input-split"`
- 后缀显示分隔框：`class="layui-input-suffix layui-input-split"`

通过在不同层级中设置规定的 CSS 类来实现点缀布局，再按照不同需求，在前缀和后缀中放置图标等任意内容。


<h3 id="group" lay-toc="{level: 2}" class="ws-bold">前置和后置</h3>

前置和后置结构是*输入框的自适应结构*，可以很灵活地控制前后置内容与输入框的宽度比例。

- 结构：

```
<div class="layui-input-group">
  <div class="layui-input-prefix">前置内容</div>
  <input type="text" class="layui-input">
  <div class="layui-input-suffix">后缀内容</div>
</div>
```

- 示例：

<pre class="layui-code" lay-options="{preview: true, codeStyle: 'height: 508px;', layout: ['preview', 'code'], tools: ['full'], done: function(obj){
  obj.render();
}}">
  <textarea>
{{- d.include("/form/examples/input.group.md") }} 
  </textarea>
</pre>


<h3 id="pre-suf" lay-toc="{level: 2}" class="ws-bold">前缀和后缀</h3>

输入框前缀和后缀是*输入框的纯修饰结构*，前缀和后缀宽度固定且其元素不可触及，即只能触及输入框本身。 

- 结构：

```
<div class="layui-input-wrap">
  <div class="layui-input-prefix">前缀图标</div>
  <input type="text" class="layui-input">
  <div class="layui-input-suffix">后缀图标</div>
</div>
```

- 示例：

<pre class="layui-code" lay-options="{preview: true, codeStyle: 'height: 508px;',layout: ['preview', 'code'], tools: ['full'], done: function(obj){
  obj.render();
}}">
  <textarea>
{{- d.include("/form/examples/input.pre.suf.md") }} 
  </textarea>
</pre>

注意「前置和后置」与「前缀和后缀」 二者使用时切勿混淆。


<h2 id="affix" lay-toc="{hot: true}">动态点缀 <sup>2.8+</sup></h2>

该功能允许对输入框内容进行相关动态操作。通过对输入框元素设置 `lay-affix` 属性来开启动态点缀。

| 点缀 | 属性值 |
| --- | --- |
| [数字输入框](#affix-number) <sup>2.8.9+</sup> | `lay-affix="number"` |
| [密码框显隐](#affix-eye) | `lay-affix="eye"` |
| [内容清除](#affix-clear) | `lay-affix="clear"` |
| [自定义动态点缀](#affix-custom) | `lay-affix="customName"` |


<h3 id="affix-number" lay-toc="{level: 2, hot: true}" class="ws-bold">
  数字输入框 <sup>2.8.9+</sup>
</h3>

一般搭配 `<input type="number">` 使用，用于替代原生数字输入框，可继承 `step,min,max` 等原生属性。

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], done: function(obj){
  obj.render();
}}">
  <textarea>
<div class="layui-form">
  <input type="number" lay-affix="number" placeholder="" value="0" class="layui-input">
  <hr class="ws-space-16">
  <div class="layui-row layui-col-space16">
    <div class="layui-col-xs6">
      <input type="number" lay-affix="number" placeholder="设置 step 为 0.01" step="0.01" class="layui-input">
    </div>
    <div class="layui-col-xs6">
      <input type="number" lay-affix="number" placeholder="设置 step,min,max" step="10" min="0" max="100" class="layui-input">
    </div>
    <div class="layui-col-xs6">
      <input type="number" lay-affix="number" readonly placeholder="不允许输入状态" class="layui-input">
    </div>
    <div class="layui-col-xs6">
      <input type="number" lay-affix="number" disabled placeholder="禁用状态" class="layui-input">
    </div>
  </div>
</div> 

<!-- import layui -->
  </textarea>
</pre>


<h3 id="affix-eye" lay-toc="{level: 2}" class="ws-bold">密码显隐</h3>

一般搭配 `<input type="password">` 使用，用于控制输入框内容的显示和隐藏。

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], done: function(obj){
  obj.render();
}}">
  <textarea>
<div class="layui-form">
  <div class="layui-input-wrap">
    <input type="password" lay-affix="eye" placeholder="请输入" class="layui-input">
  </div>
</div> 

<!-- import layui -->
  </textarea>
</pre>

<h3 id="affix-clear" lay-toc="{level: 2}" class="ws-bold">内容清除</h3>

一般搭配 `<input type="text">` 使用，用于清除输入框的内容。

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], done: function(obj){
  obj.render();
}}">
  <textarea>
<div class="layui-form">
  <div class="layui-input-wrap">
    <input type="text" lay-affix="clear" placeholder="请输入" class="layui-input">
  </div>
  <hr class="ws-space-16">
  <div class="layui-input-wrap">
    <input type="text" value="默认有值状态" lay-affix="clear" class="layui-input">
  </div>
  <hr class="ws-space-16">
  <div class="layui-input-wrap">
    <input type="text" value="禁用状态时" lay-affix="clear" disabled class="layui-input">
  </div>
  <hr class="ws-space-16">
  <div class="layui-input-wrap">
    <input type="text" value="只读状态时" lay-affix="clear" readonly class="layui-input">
  </div>
</div>

<!-- import layui -->
  </textarea>
</pre>

<h3 id="affix-custom" lay-toc="{level: 2}" class="ws-bold">自定义动态点缀</h3>

我们还可以对 `lay-affix` 属性设置任意图标值，从而实现自定义动态点缀功能。 其中 `lay-affix="customName"` 值对应图标类`layui-icon-`后面的名称（[#详见图标列表](../icon/#list)）。且可通过「[点缀事件](#affix-event)」完成自定义操作。

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], done: function(obj){
  obj.render();
}}">
  <textarea>
{{- d.include("/form/examples/input.affix.custom.md") }} 
  </textarea>
</pre>

输入框的自定义动态点缀功能，让原本单一的输入框有了更多的想象空间。


<h3 id="on" lay-toc="{level: 2}" class="ws-bold">点缀事件</h3>

`form.on('input-affix(filter)', callback);`

- `input-affix` 为输入框动态点缀事件固定名称
- `filter` 为输入框对应的 `lay-filter` 属性值

该事件在点击输入框的点缀图标时触发，通过该事件可以完成一些自定义操作。

```
form.on('input-affix(filter)', function(data){
  var elem = data.elem; // 获取输入框 DOM 对象
  var affix = data.affix; // 获取输入框 lay-affix 属性值
  console.log(this); // 当前触发点缀事件的图标元素
});
```




