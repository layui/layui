---
title: 复选框
toc: true
---
 
# 复选框

> 复选框组件是对 `<input type="checkbox">` 元素的美化替代，在原有的特性基础上，对 UI 进行了加强。


<h2 id="default" lay-toc="{}">默认风格</h2>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full'], done: function(obj){
  obj.render();
}}">
  <textarea>
<div class="layui-form">
  <input type="checkbox" name="AAA" title="默认">
  <input type="checkbox" name="BBB" lay-text="选中" checked> 
  <input type="checkbox" name="CCC" title="禁用" disabled> 
  <input type="checkbox" name="DDD" title="半选" id="ID-checkbox-ind"> 
</div>

<!-- import layui -->
<script>
layui.use(function(){
  var form = layui.form;
  var $ = layui.$;

  // 初始设置半选
  $('#ID-checkbox-ind').prop('indeterminate', true); // 半选属性只能动态设置
  form.render('checkbox');
});
</script>
  </textarea>
</pre>

- 属性 `title` 可设置复选框标题
- 属性 `checked` 可设置默认选中
- 属性 `disabled` 可设置禁用状态
- 属性 `value` 可设置值，否则选中时返回的默认值为 `on`（浏览器默认机制）
- 属性 `lay-skin` 可设置复选框风格，可选值：`tag`<sup>2.8+</sup>,`switch`，默认风格可不填

特别地，当表单提交时，只有选中状态的复选框才能获取到 `value`，这点和浏览器原有的复选框机制相同。 

注 <sup>2.8+</sup>： `lay-skin` 属性在之前版本默认为标签风格，新版本调整为默认原始风格（`lay-skin="primary"`）。

<h2 id="tag" lay-toc="{}">标签风格</h2>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full'], done: function(obj){
  obj.render();
}}">
  <textarea>
<div class="layui-form">
  <input type="checkbox" name="AAA" title="默认" lay-skin="tag">
  <input type="checkbox" name="BBB" title="选中" lay-skin="tag" checked> 
  <input type="checkbox" name="CCC" title="禁用" lay-skin="tag" disabled>
</div>

<!-- import layui -->
  </textarea>
</pre>


<h2 id="switch" lay-toc="{}">开关风格</h2>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full'], done: function(obj){
  obj.render();
}}">
  <textarea>
<div class="layui-form">
  <input type="checkbox" name="AAA" lay-skin="switch">
  <br>
  <input type="checkbox" name="BBB" title="ON|OFF" lay-skin="switch" checked> 
  <br>
  <input type="checkbox" name="CCC" title="开启|关闭" lay-skin="switch">
  <br>
  <input type="checkbox" name="DDD" lay-skin="switch" disabled>
</div>

<!-- import layui -->
  </textarea>
</pre>

在 `title` 属性中通过 `|` 分隔符可设置两种状态下的不同标题


<h2 id="title" lay-toc="{hot: true}">标题模板 <sup>2.8.3+</sup></h2>

在 `checkbox` 元素后的相邻元素设置特定属性 `lay-checkbox`，可以与 `checkbox` 标题进行绑定。

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full'], done: function(obj){
  obj.render();
}}">
  <textarea>
<div class="layui-form">
  <div class="layui-form-item">
    <input type="checkbox" name="AAA" value="0">
    <div lay-checkbox>
      自定义<a href="#target-url"><ins>标题模板</ins></a>
    </div>
  </div>
  <div class="layui-form-item">
    <input type="checkbox" name="BBB" value="1" lay-skin="tag">
    <div lay-checkbox>
      <i class="layui-icon layui-icon-heart" style="position: relative; top: 1px; line-height: normal;"></i> 标题模板
    </div>
  </div>
  <div class="layui-form-item">
    <input type="checkbox" name="CCC" value="2" lay-skin="switch">
    <div lay-checkbox>
      <i class="layui-icon layui-icon-moon"></i> | 
      <i class="layui-icon layui-icon-light"></i>
    </div>
  </div>
</div>

<!-- import layui -->
  </textarea>
</pre>


<h2 id="on" lay-toc="{hot: true}">复选框事件</h2>

| 风格 | 事件 |
| --- | --- |
| 默认风格 / 标签风格 | `form.on('checkbox(filter)', callback);` |
| 开关风格 | `form.on('switch(filter)', callback);` |

- `checkbox` 和 `switch` 为复选框事件固定名称
- `filter` 为复选框元素对应的 `lay-filter` 属性值

该事件在复选框选中或取消选中时触发。

<pre class="layui-code" lay-options="{preview: true, layout: ['code', 'preview'], tools: ['full'], done: function(obj){
  obj.render();
}}">
  <textarea>
<div class="layui-form">
  <div class="layui-form-item">
    <input type="checkbox" name="agreement" value="1" title="是否同意" lay-filter="demo-checkbox-filter">
  </div>
  <div class="layui-form-item">
    <button class="layui-btn" lay-submit lay-filter="demo-checkbox-submit">确认</button>
  </div>
</div>

<!-- import layui --> 
<script>
layui.use(function(){
  var form = layui.form;
  var layer = layui.layer;

  // checkbox 事件
  form.on('checkbox(demo-checkbox-filter)', function(data){
    var elem = data.elem; // 获得 checkbox 原始 DOM 对象
    var checked = elem.checked; // 获得 checkbox 选中状态
    var value = elem.value; // 获得 checkbox 值
    var othis = data.othis; // 获得 checkbox 元素被替换后的 jQuery 对象
    
    layer.msg('checked 状态: '+ elem.checked);
  });

  // 通过表单提交事件，演示 checkbox 不同状态下的字段结果
  form.on('submit(demo-checkbox-submit)', function(data){
    var field = data.field; // 获取表单字段值
    // 显示填写结果，仅作演示用
    layer.alert(JSON.stringify(field), {
      title: '当前填写的字段值'
    });
    // 此处可执行 Ajax 等操作
    // …
    return false; // 阻止默认 form 跳转
  });
});
</script>
  </textarea>
</pre>