---
title: 单选框
toc: true
---
 
# 单选框

> 单选框组件是对 `<input type="radio">` 元素的美化替代。

<h2 id="normal" lay-toc="{}">普通单选框</h2>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full'], done: function(obj){
  obj.render();
}}">
  <textarea>
<div class="layui-form">
  <input type="radio" name="AAA" value="1" title="默认">
  <input type="radio" name="AAA" value="2" title="选中" checked> 
  <input type="radio" name="AAA" value="3" title="禁用" disabled> 
</div>

<!-- import layui -->
  </textarea>
</pre>

- 属性 `title` 可设置单选框标题
- 属性 `checked` 可设置默认选中
- 属性 `disabled` 可设置禁用状态
- 属性 `value` 可设置值，否则选中时返回的默认值为 `on`（浏览器默认机制）。同组单选框一般设置相同值。

<h2 id="title" lay-toc="{}">自定义标题模板</h2>

在 `radio` 元素后的相邻元素设置特定属性 `lay-radio`，可以与 `radio` 标题进行绑定。

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full'], done: function(obj){
  obj.render();
}}">
  <textarea>
<div class="layui-form">
  <input type="radio" name="AAA" value="0" title="默认">
  <div lay-radio>
    <span style="color: blue;">自定义模板 ♂</span>
  </div>
  <input type="radio" name="AAA" value="1" title="默认">
  <div lay-radio>
    <span style="color: pink;">自定义模板 ♀</span>
  </div>
</div>

<!-- import layui -->
  </textarea>
</pre>

<h2 id="on" lay-toc="{hot: true}">单选框事件</h2>

`form.on('radio(filter)', callback);`

- `radio` 为单选框事件固定名称
- `filter` 为单选框元素对应的 `lay-filter` 属性值

该事件在单选框被点击或选中时触发。

<pre class="layui-code" lay-options="{preview: true, layout: ['code', 'preview'], tools: ['full'], done: function(obj){
  obj.render();
}}">
  <textarea>
<div class="layui-form">
  <div class="layui-form-item">
    <input type="radio" name="AAA" value="1" title="选项1" lay-filter="demo-radio-filter" checked>
    <input type="radio" name="AAA" value="2" lay-filter="demo-radio-filter" title="选项2"> 
    <input type="radio" name="AAA" value="3" lay-filter="demo-radio-filter" title="选项3"> 
  </div>
  <div class="layui-form-item">
    <button class="layui-btn" lay-submit lay-filter="demo-radio-submit">确认</button>
  </div>
</div>

<!-- import layui --> 
<script>
layui.use(function(){
  var form = layui.form;
  var layer = layui.layer;

  // radio 事件
  form.on('radio(demo-radio-filter)', function(data){
    var elem = data.elem; // 获得 radio 原始 DOM 对象
    var checked = elem.checked; // 获得 radio 选中状态
    var value = elem.value; // 获得 radio 值
    var othis = data.othis; // 获得 radio 元素被替换后的 jQuery 对象
    
    layer.msg(['value: '+ value, 'checked: '+ checked].join('<br>'));
  });

  // 通过表单提交事件，演示 radio 不同状态下的字段结果
  form.on('submit(demo-radio-submit)', function(data){
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

