---
title: 表单组件 form
toc: true
---
 
# 表单组件 🔥

> 表单组件`form`是包含输入框、选择框、复选框、开关、单选框等表单项组件的集合，主要用于对表单域进行各类动态化渲染和相关的交互操作。`form`是 Layui 最常用的组件之一。

<h2 id="examples" lay-toc="{anchor: null}" style="margin-bottom: 0;">示例</h2>

<h3 lay-toc="{level: 2, id: 'examples', hot: true}" class="layui-hide">综合演示</h3>

<pre class="layui-code" lay-options="{preview: true, text: {preview: '综合演示'}, codeStyle: 'height: 508px;', layout: ['preview', 'code'], tools: ['full'], done: function(obj){
  obj.render()
}}">
  <textarea>
{{- d.include("/form/examples/form.demo.md") }}
  </textarea>
</pre>

<h3 id="pane" lay-toc="{level: 2}">方框风格</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], codeStyle: 'height: 508px;', tools: ['full'], done: function(obj){
  obj.render()
}}">
  <textarea>
{{- d.include("/form/examples/form.pane.md") }}
  </textarea>
</pre>

<h3 id="login" lay-toc="{level: 2}">登录模板 <sup>2.8+</sup></h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], codeStyle: 'height: 508px;', tools: ['full'], done: function(obj){
  obj.render()
}}">
  <textarea>
{{- d.include("/form/examples/form.login.md") }}
  </textarea>
</pre>

<h3 id="reg" lay-toc="{level: 2}">注册模板 <sup>2.8+</sup></h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], codeStyle: 'height: 508px;', tools: ['full'], done: function(obj){
  obj.render()
}}">
  <textarea>
{{- d.include("/form/examples/form.reg.md") }}
  </textarea>
</pre>

更多其他表单模板均可自由布局实现，为了避免影响文档其他重要版面的阅读，我们就不做过多演示了。


<h2 id="layout" lay-toc="{title: '布局'}">表单布局</h2>

### 🌕 普通布局

在上文的「[综合演示](#examples)」示例中，我们用的是 form 组件自身的普通布局。其要点为：

- 通过 `class="layui-form"` 定义一个表单域，通常设置在`<form>`标签上， 或普通`<div>` 标签亦可。
- 通过 `class="layui-form-item"` 定义一个块级元素的表单项容器
- 通过 `class="layui-form-label"` 定义标签
- 通过 `class="layui-input-block"` 定义表单项父容器为块级元素
- 通过 `class="layui-input-inline"` 或 `class="layui-inline"` 定义表单项父容器为行内块元素

即必须按照规定的层级定义相应的 `class`。

### 🌕 栅格布局

form 还可以借助*栅格*实现更灵活的响应式布局。

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], codeStyle: 'height: 500px;', done: function(obj){
  obj.render()
}}">
  <textarea>
{{- d.include("/form/examples/form.grid.md") }}
  </textarea>
</pre>

<h2 id="api" lay-toc="{hot: 1}">API</h2>

| API | 描述 |
| --- | --- |
| var form = layui.form | 获得 `form` 模块。 |
| [form.render(type, filter)](#render) | 表单域组件渲染，核心方法。[#用法](#render) |
| [form.verify(obj)](#verify) | 自定义表单验证的规则。[#用法](#verify) |
| [form.validate(elem)](#validate) <sup>2.7+</sup> | 主动触发执行验证。[#用法](#validate) |
| [form.val(filter, obj)](#val) | 表单赋值或取值。 [#用法](#val) |
| [form.submit(filter, callback)](#submit) <sup>2.7+</sup> | 用于主动执行指定表单的提交。[#用法](#submit) |
| [form.on(\'event(filter)\', callback)](#on) | 事件。[#用法](#on) |
| [form.set(options)](#set) | 设置 form 组件全局配置项。 |
| form.config | 获取 form 组件全局配置项。 |

<h2 id="attr" lay-toc="{level: 2}">属性</h2>

在表单域中，有时还需要定义一些特定属性来配合组件的使用，它们一般以 `lay-*` 为命名格式，如：

```
<form class="layui-form" lay-filter="form-1">
  <input type="text" class="layui-input" lay-verify="email">
  <input type="checkbox" lay-skin="switch" lay-filter="agree" title="同意">
  <button class="layui-btn" lay-submit>提交</button>
</form>

```

以下为 `form` 组件的特定属性列表：

| 属性 | 值 | 描述 |
| --- | --- | --- |
| title | 自定义 | 设置表单元素标题，一般用于 `checkbox,radio` 元素 |
| lay-filter | 自定义 | 设置表单元素的过滤器，以便用于执行相关方法时的参数匹配 |
| lay-verify | `required`必填项 <br>`phone`手机号 <br>`email`邮箱 <br>`url`网址<br>`number`数字<br>`date`日期<br>`identity`身份证<hr>`自定义规则值` | 设置表单项的验证规则，支持单条或多条规则（多条用`\|`分隔），如：<br>`lay-verify="required"` <br>`lay-verify="required\|email"`<br>`lay-verify="其他自定义规则值"` <hr>自定义规则的用法：[#详见](#verify) |
| lay-vertype | `tips`吸附层<br>`alert` 对话框<br>`msg` 默认 | 设置验证异常时的提示层模式 |
| lay-reqtext | 自定义 | 设置*必填项*（`lay-verify="required"`）的默认提示文本 |
| lay-affix | [#详见](input.html#affix) | 输入框动态点缀，`<input type="text">`元素 **私有属性** |
| lay-skin | [#详见](checkbox.html#default) | 设置 UI 风格。 `<input type="checkbox">` 元素 **私有属性** |
| lay-search | 默认不区分大小写;<br>设置`cs`区分大小写 | 给 `select` 组件开启搜索功能。`<select>` 元素 **私有属性** |
| lay-submit | 无需值 | 设置元素（一般为`<button>` 标签）触发 `submit` 提交事件 |
| lay-ignore | 无需值 | 设置表单元素忽略渲染，即让元素保留系统原始 UI 风格 |


<h2 id="render" lay-toc="{hot: true, level: 2}">渲染</h2>

`form.render(type, filter);`

- 参数 `type` 可选，对应表单组件类型，支持：`input,select,checkbox,radio`；若不填，则指向所有类型。
- 参数 `filter` 可选，对应 `class="layui-form"` 所在元素的 `lay-filter` 属性值，用于指定需渲染的表单区域。

### **常规渲染**

`form` 组件会在元素加载完毕后，自动对所有表单区域完成一次渲染，因此该方法主要用于对*动态插入*的表单元素的渲染。

```
<form class="layui-form" lay-filter="test">
  动态插入的表单域
</form>
  
<!-- import layui --> 
<script>
layui.use(function(){
  var form = layui.form;
  
  // 当表单元素被插入插入时，需进行组件渲染才能显示
  form.render(); // 渲染全部表单
  form.render('select'); // 仅渲染 select 元素
  form.render(null, 'test'); // 仅渲染 lay-filter="test" 的容器内的全部表单
  form.render('checkbox', 'test'); // 仅渲染  lay-filter="test" 的容器内的 checkbox 元素
})
</script>
```

### **定向渲染** <sup>2.7+</sup>

该方法还允许指定表单元素的 jQuery 对象，从而完成定向渲染。且支持两种方式的指向：

- 若 jQuery 对象指向表单域容器（`class="layui-form"`），则渲染该表单域中的所有表单项；<sup>2.8+</sup>
- 若 jQuery 对象指向的不是表单域容器，则只对该对象进行渲染

定向渲染在页面出现大量表单时，可以极大地减少表单组件渲染时的性能开销，建议灵活运用。

```
<div class="layui-form" id="form-id">
  <select id="select-id">
    <option value="a">A</option>
  </select>
  <!-- 其他表单元素 -->
</div>
 
<!-- import layui --> 
<script> 
layui.use('form', function(){
  var $ = layui.$;
  var form = layui.form;
  
  // 定向渲染（一般当表单存在动态生成时，进行渲染）
  // 传入需要渲染的相应表单元素的 jQuery 对象 
  form.render($('#form-id')); // 渲染 id="form-id" 的表单域中的所有表单项
  form.render($('#select-id')); // 仅渲染 id="select-id" 的表单项
});
</script>
```

### **忽略渲染**

若表单域中的部分表单不需要 Layui 来渲染，那么可通过 `lay-ignore` 属性让其保留系统原始 UI 风格。

<pre class="layui-code" lay-options="{preview: true, done: function(obj){
  obj.render()
}}">
  <textarea>
<div class="layui-form">
  <select>
    <option value="a">正常渲染的 select</option>
  </select>
  <input type="checkbox" lay-skin="primary" title="正常渲染的 checkbox">
  <hr>
  <select lay-ignore>
    <option value="">忽略渲染的 select</option>
  </select>
  <input type="checkbox" lay-ignore> 忽略渲染的 checkbox
</div>
  </textarea>
</pre>


<h2 id="lay-verify" lay-toc="{hot: true, level: 2}">验证</h2>

Layui 对表单做了相对巧妙的支持，只需在表单元素上设置 `lay-verify=""` 属性值即可指定验证规则，如：

```
<div class="layui-form">
  <input type="text" lay-verify="required">
  <input type="text" lay-verify="email">
  <input type="text" lay-verify="required|phone|number">
  <button class="layui-btn" lay-submit>提交</button>
</div>
```

其中，`lay-verify` 属性的内置规则值可参考上文的：[#属性介绍](#attr)。 当表单提交时，会自动触发验证。

<h3 id="verify" lay-toc="{level: 3, title: '定义验证规则'}" class="ws-bold">自定义验证规则</h3>

`form.verify(obj);`

- 参数 `obj` 是一个对象，用于定义验证规则的集合。

当内置的验证规则无法满足业务需求时，我们可以通过该方法自定义验证规则。如：

<pre class="layui-code" lay-options="{preview: true, codeStyle: 'height: 508px;', done: function(obj){
  obj.render()
}}">
  <textarea>
{{- d.include("/form/examples/form.verify.md") }}  
  </textarea>
</pre>

更多「自定义验证规则」示例参考：

> - <a href="https://gitee.com/layui/layui/issues/I5HC2L#note_11673264_link" target="_blank">将 form 提示语显示在表单项旁边，并在提交时批量触发验证</a>
> - <a href="https://gitee.com/layui/layui/issues/I42C7I#note_12020414_link" target="_blank">重置 form 内置验证规则，让其：当非空值才进行验证；加了 required 时才验证非空</a>


<h3 id="validate" lay-toc="{level: 3}" class="ws-bold">主动触发验证  <sup>2.7+</sup></h3>

`form.validate(elem);`

- 参数 `elem` 为元素选择器或 jQuery 对象； 若验证通过，该方法将返回 true，否则返回 false

<pre class="layui-code" lay-options="{preview: true, codeStyle: 'height: 508px;', done: function(obj){
  obj.render()
}}">
  <textarea>
{{- d.include("/form/examples/form.validate.md") }}  
  </textarea>
</pre>


<h2 id="val" lay-toc="{level: 2}">赋值/取值</h2>

`form.val(filter, obj);`

- 参数 `filter` 为表单域容器（`class="layui-form"`）的 `lay-filter` 属性值
- 参数 `obj` 可选。若参数存在，则对表单域进行赋值；若参数不存在，则为对表单域进行取值。

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], codeStyle: 'height: 508px;', tools: ['full'], done: function(obj){
  obj.render()
}}">
  <textarea>
{{- d.include("/form/examples/form.val.md") }}
  </textarea>
</pre>


<h2 id="submit" lay-toc="{hot: true, level: 2}">提交</h2>

表单的提交可以通过事件触发或方法触发

### **提交事件**

在表单域中，对指定按钮设置 `lay-submit` 属性，即意味着点击该按钮时，将触发提交事件。如：

<pre class="layui-code" lay-options="{preview: true, codeStyle: 'height: 508px;', done: function(obj){
  obj.render()
}}">
  <textarea>
<form class="layui-form">  
  <input type="text" name="nickname" lay-verify="required" class="layui-input">
  <hr>
  <button class="layui-btn" lay-submit lay-filter="demo-submit">提交按钮</button>
  <button class="layui-btn" id="test-btn-other">普通按钮</button>
</form>

<!-- import layui --> 
<script>
layui.use(function(){
  var $ = layui.$;
  var form = layui.form;
  var layer = layui.layer;

  // 提交事件
  form.on('submit(demo-submit)', function(data){
    var field = data.field; // 获取表单全部字段值
    var elem = data.elem; // 获取当前触发事件的元素 DOM 对象，一般为 button 标签
    var elemForm = data.form; // 获取当前表单域的 form 元素对象，若容器为 form 标签才会返回。

    // 显示填写结果，仅作演示用
    layer.alert(JSON.stringify(field), {
      title: '当前填写的字段值'
    });
    // 此处可执行 Ajax 等操作
    // …
    return false; // 阻止默认 form 跳转
  });
  // 普通按钮
  $('#test-btn-other').on('click', function(){
    layer.msg('点击未设置特定属性的按钮不会触发组件的提交事件');
    return false;
  });
});
</script>
  </textarea>
</pre>

### **提交方法** <sup>2.7+</sup>

`form.submit(filter, callback);` 

- 参数 `filter` 为表单域容器的 `lay-filter` 属性值
- 参数 `callback` 为执行提交事件后的回调函数

使用该方法可以实现在任意位置对指定表单的主动提交，相比上述的提交事件更加灵活。

<pre class="layui-code" lay-options="{preview: true, codeStyle: 'height: 508px;', done: function(obj){
  obj.render()
}}">
  <textarea>
<fieldset class="layui-elem-field">
  <legend>表单内部</legend>
  <div class="layui-field-box">
    <form class="layui-form" lay-filter="form-demo-submit">  
      <input type="text" name="nickname" lay-verify="required" class="layui-input">
    </form>
  </div>
</fieldset>

<button class="layui-btn" id="test-btn-submit">任意位置按钮</button>

<!-- import layui --> 
<script>
layui.use(function(){
  var $ = layui.$;
  var form = layui.form;
  var layer = layui.layer;

  // 任意位置按钮触发提交
  $('#test-btn-submit').on('click', function(){
    form.submit('form-demo-submit', function(data){
      var field = data.field; // 获取表单全部字段值
      console.log(data); // 回调函数返回的 data 参数和提交事件中返回的一致

      // 执行提交
      layer.confirm('确定提交吗？', function(index){
        layer.close(index); // 关闭确认提示框

        // 显示填写结果，仅作演示用
        layer.alert(JSON.stringify(field), {
          title: '当前填写的字段值'
        });
        // 此处可执行 Ajax 等操作
        // …
      });
    });
    return false;
  });
});
</script>
  </textarea>
</pre>

<h2 id="on" lay-toc="{}">事件</h2>

`form.on('event(filter)', callback);`

- 参数 `event(filter)` 是一个特定结构。`event` 为事件名，支持：`select,checkbox,switch,radio,submit`；`filter` 为元素属性 `lay-filter` 对应的值，若不填，则指向所有同类组件的事件。
- 参数 `callback` 为事件执行时的回调函数，并返回一个包含各种值的 `object` 类型的参数。

如下以 `select` 事件为例：
```
// 指向所有 select 组件的选择事件
form.on('select', function(data){
  console.log(data);
});
 
// 指向元素为 `<select lay-filter="test"></select>` 的选择事件
form.on('select(test)', function(data){
  console.log(data);
});
```

<h2 id="set" class="ws-anchor">全局设置</h2>

`form.set(options);`

- 参数 `options` : 全局属性配置项。详见下表：

| 属性名 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| autocomplete | 设置 input 框的 `autocomplete` 属性初始值 | string | - |
| verIncludeRequired <sup>2.8.4+</sup> | 验证规则中是否同时包含必填。 form 组件在 `2.8.3` 版本中调整了内置校验规则，即：仅当非空时进行校验，避免强制携带必填的校验规则。如需保留之前的验证规则（即同时校验必填）,可将该属性设置为 `true`。但一般还是建议将必填项放置在 `lay-verify` 属性上，如： `lay-verify="required\|number"` | boolean | `false` |

该方法用于对 form 组件进行全局设置。

```
form.set({
  autocomplete: 'off' // 阻止 input 框默认的自动输入完成功能
});
```
