---
title: 选择框
toc: true
---
 
# 选择框

> 选择框组件是对 `<select>` 元素的美化替代，延续了原有的特性，且加入了搜索等扩展。


<h2 id="normal" lay-toc="{}">普通选择框</h2>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full'], done: function(obj){
  obj.render();
}}">
  <textarea>
<div class="layui-form layui-row layui-col-space16">
  <div class="layui-col-md6">
    <select>
      <option value="">请选择</option>
      <option value="AAA">选项 A</option>
      <option value="BBB">选项 B</option>
      <option value="CCC">选项 C</option>
    </select>
  </div>
  <div class="layui-col-md6">
    <select>
      <option value="">请选择</option>
      <option value="AAA">选项 A</option>
      <option value="BBB">选项 B</option>
      <option value="CCC" selected>选项 C</option>
    </select>
  </div>
  <div class="layui-col-md6">
    <select disabled>
      <option value="">禁用选择框</option>
      <option value="AAA">选项 A</option>
      <option value="BBB">选项 B</option>
      <option value="CCC">选项 C</option>
    </select>
  </div>
  <div class="layui-col-md6">
    <select>
      <option value="">请选择</option>
      <option value="AAA">选项 A</option>
      <option value="BBB" disabled>选项 B（禁用选项）</option>
      <option value="CCC">选项 C</option>
    </select>
  </div>
</div>

<!-- import layui -->
  </textarea>
</pre>

- 若第一项 `value` 为空，通常只作为选择框提示性引导；若第一项 `value` 不为空，则作为默认选中项。
- 通过给选项添加 `selected` 属性优先设置默认选中项。
- 通过给 `<select>` 或 `<option>` 标签设置 `disabled` 可禁用整个选择框或某个选项。

在 `<select>` 标签上同样支持设置表单的其他公共属性（[#详见](./#attr)）。

<h2 id="group" lay-toc="{}">分组选择框</h2>

通过 `<optgroup>` 标签给选择框分组

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full'], done: function(obj){
  obj.render();
}}">
  <textarea>
<div class="layui-form">
  <select>
    <option value="">请选择</option>
    <optgroup label="分组 A">
      <option value="A-1">选项 A-1</option>
      <option value="A-2">选项 A-2</option>
      <option value="A-3">选项 A-3</option>
    </optgroup>
    <optgroup label="分组 B">
      <option value="B-1">选项 B-1</option>
      <option value="B-2">选项 B-2</option>
    </optgroup>
  </select>
</div>

<!-- import layui -->
  </textarea>
</pre>


<h2 id="search" lay-toc="{hot: true}">搜索选择框</h2>

在 `<select>` 元素上设置 `lay-search` 可开启选择框的搜索功能

<pre class="layui-code" lay-options="{preview: true, codeStyle: 'height: 508px;', layout: ['preview', 'code'], tools: ['full'], done: function(obj){
  obj.render();
}}">
  <textarea>
<div class="layui-form layui-row layui-col-space16">
  <div class="layui-col-md6">
    <select lay-search="">
      <option value="">请选择或搜索（默认不区分大小写）</option>
      <option value="1">AAA</option>
      <option value="2">aaa</option>
      <option value="3">BBB</option>
      <option value="4">bbb</option>
      <option value="5">ABC</option>
      <option value="6">abc</option>
      <option value="7">AbC</option>
    </select>
  </div>
  <div class="layui-col-md6">
    <select lay-search="cs">
      <option value="">请选择或搜索（设置区分大小写）</option>
      <option value="1">AAA</option>
      <option value="2">aaa</option>
      <option value="3">BBB</option>
      <option value="4">bbb</option>
      <option value="5">ABC</option>
      <option value="6">abc</option>
      <option value="7">AbC</option>
    </select>
  </div>
  <div class="layui-col-md6">
    <select lay-search="">
      <option value="">请搜索</option>
      <optgroup label="分组a">
        <option value="a1">a1</option>
        <option value="a2">a2</option>
      </optgroup>
      <optgroup label="分组aa">
        <option value="aa1">aA1</option>
        <option value="aa2">aA2</option>
      </optgroup>
      <optgroup label="分组b">
        <option value="b1">b1</option>
        <option value="b2">b2</option>
      </optgroup>
      <optgroup label="分组bb">
        <option value="bb1">bb1</option>
        <option value="bb2">bb2</option>
      </optgroup>
      <optgroup label="分组bbb">
        <option value="bbb1">bBb1</option>
        <option value="bbb2">bBB2</option>
      </optgroup>
      <optgroup label="分组c">
        <option value="c1">c1</option>
        <option value="c2">c2</option>
      </optgroup>
      <optgroup label="分组cc">
        <option value="cc1">cc1</option>
        <option value="cc2">cc2</option>
      </optgroup>
      <optgroup label="分组ccc">
        <option value="ccc1">ccc1</option>
        <option value="ccc2">ccc2</option>
      </optgroup>
      <optgroup label="分组cccc">
        <option value="cccc1">cccc1</option>
        <option value="cccc2">cccc2</option>
      </optgroup>
    </select>
  </div>
</div>

<!-- import layui -->
  </textarea>
</pre>


<h2 id="on" lay-toc="{hot: true}">选择框事件</h2>

`form.on('select(filter)', callback);`

- `select` 为选择框事件固定名称
- `filter` 为选择框元素对应的 `lay-filter` 属性值

该事件在选择框选项选中后触发。

<pre class="layui-code" lay-options="{preview: true, layout: ['code', 'preview'], tools: ['full'], done: function(obj){
  obj.render();
}}">
  <textarea>
<div class="layui-form">
  <select lay-filter="demo-select-filter">
    <option value="">请选择</option>
    <option value="AAA">选项 A</option>
    <option value="BBB">选项 B</option>
    <option value="CCC">选项 C</option>
  </select>
</div>

<!-- import layui --> 
<script>
layui.use(function(){
  var form = layui.form;
  var layer = layui.layer;

  // select 事件
  form.on('select(demo-select-filter)', function(data){
    var elem = data.elem; // 获得 select 原始 DOM 对象
    var value = data.value; // 获得被选中的值
    var othis = data.othis; // 获得 select 元素被替换后的 jQuery 对象
    
    layer.msg(this.innerHTML + ' 的 value: '+ value); // this 为当前选中 <option> 元素对象
  });
});
</script>
  </textarea>
</pre>
