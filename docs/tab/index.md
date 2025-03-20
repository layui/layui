---
title: 选项卡组件 tab
toc: true
---

# ~~选项卡组件~~

> 📣 <span style="color: #ff5722;">升级提示：我们在 2.10 版本中新增了全新的 tabs 标签页组件，用于替代原 `element` 模块中的 `tab` 组件，建议过渡到全新的 tabs 组件，旧的 ~~tab~~ 组件将在后续合适的版本中移除。</span> [前往全新 tabs 组件](../tabs/)

> 选项卡组件 `tab` 是指可进行标签页切换的一段容器，常广泛应用于 Web 页面。由于为了向下兼容等诸多历史原因，在 2.x 版本中，`tab` 组件属于 `element` 模块的子集。


<h2 id="examples" lay-toc="{hot: true}" style="margin-bottom: 0;">示例</h2>

<div class="ws-detail">
{{- d.include("/tab/detail/demo.md") }}
</div>

<h2 id="skin" lay-toc="{hot: true}">风格</h2>

tab 组件提供了三种 UI 风格，分别为：

| 风格 | className |
| --- | --- |
| [默认风格](#default) | `class="layui-tab"` |
| [简约风格](#brief) | `class="layui-tab layui-tab-brief"` |
| [卡片风格](#card) | `class="layui-tab layui-tab-card"` |

<h3 id="default" class="ws-anchor ws-bold">默认风格</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full'], done: function(obj){
  obj.render();
}}">
  <textarea>
<div class="layui-tab">
  <ul class="layui-tab-title">
    <li class="layui-this">标签1</li>
    <li>标签2</li>
    <li>标签3</li>
    <li>标签4</li>
    <li>标签5</li>
  </ul>
  <div class="layui-tab-content">
    <div class="layui-tab-item layui-show">内容-1</div>
    <div class="layui-tab-item">内容-2</div>
    <div class="layui-tab-item">内容-3</div>
    <div class="layui-tab-item">内容-4</div>
    <div class="layui-tab-item">内容-5</div>
  </div>
</div>
<!-- import layui -->
  </textarea>
</pre>

<h3 id="brief" class="ws-anchor ws-bold">简约风格</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full'], done: function(obj){
  obj.render();
}}">
  <textarea>
<div class="layui-tab layui-tab-brief">
  <ul class="layui-tab-title">
    <li class="layui-this">标签1</li>
    <li>标签2</li>
    <li>标签3</li>
    <li>标签4</li>
    <li>标签5</li>
  </ul>
  <div class="layui-tab-content">
    <div class="layui-tab-item layui-show">内容-1</div>
    <div class="layui-tab-item">内容-2</div>
    <div class="layui-tab-item">内容-3</div>
    <div class="layui-tab-item">内容-4</div>
    <div class="layui-tab-item">内容-5</div>
  </div>
</div>
<!-- import layui -->
  </textarea>
</pre>

<h3 id="card" class="ws-anchor ws-bold">卡片风格</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full'], done: function(obj){
  obj.render();
}}">
  <textarea>
<div class="layui-tab layui-tab-card">
  <ul class="layui-tab-title">
    <li class="layui-this">标签1</li>
    <li>标签2</li>
    <li>标签3</li>
    <li>标签4</li>
    <li>标签5</li>
  </ul>
  <div class="layui-tab-content">
    <div class="layui-tab-item layui-show">内容-1</div>
    <div class="layui-tab-item">内容-2</div>
    <div class="layui-tab-item">内容-3</div>
    <div class="layui-tab-item">内容-4</div>
    <div class="layui-tab-item">内容-5</div>
  </div>
</div>
<!-- import layui -->
  </textarea>
</pre>


<h2 id="api" lay-toc="{}">API</h2>

| API | 描述 |
| --- | --- |
| var element = layui.element | 获得 `element` 模块。 |
| [element.render(\'tab\', filter)](#element.render) | 渲染 tab 组件 |
| [element.tabAdd(filter, options)](#element.tabAdd) | 添加 tab 选项 |
| [element.tabDelete(filter, layid, force)](#element.tabDelete) | 删除 tab 选项 |
| [element.tabChange(filter, layid, force)](#element.tabChange) | 切换 tab 选项 |
| [element.tab(options)](#element.tab) | 绑定自定义 tab 元素 |

<h3 id="options" lay-toc="{level: 2}" class="ws-bold">元素属性</h3>

| 属性 | 描述 |
| --- | --- |
| lay-allowclose | 是否开启删除图标。设置在 tab 容器 `<ul class="layui-tab">` 上。 <br><sup>2.9.11+</sup>: 若需要单独关闭某一个选项卡的删除图标，可在选项卡标题元素 `<li>` 上设置 `lay-allowclose="false"`|
| lay-id | tab 选项唯一 ID，一般用于外部对 tab 的删除和切换等操作。设置在 tab 中的 `<li>` 元素上。在外部附加选项卡拖拽排序时，`layui-tab-item` 元素也要设置 ID |

<h3 id="allowclose" lay-toc="{level: 2}" class="ws-bold">开启删除</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full'], done: function(obj){
  obj.render();
}}">
  <textarea>
<div class="layui-tab" lay-allowclose="true">
  <ul class="layui-tab-title">
    <li class="layui-this" lay-allowclose="false">标签1</li>
    <li>标签2</li>
    <li>标签3</li>
    <li>标签4</li>
    <li>标签5</li>
  </ul>
  <div class="layui-tab-content">
    <div class="layui-tab-item layui-show">单独设置「标签1」不允许删除 <sup>2.9.11+</sup></div>
    <div class="layui-tab-item">内容-2</div>
    <div class="layui-tab-item">内容-3</div>
    <div class="layui-tab-item">内容-4</div>
    <div class="layui-tab-item">内容-5</div>
  </div>
</div>

<!-- import layui -->
  </textarea>
</pre>

<h3 id="element.render" lay-toc="{level: 2}" class="ws-bold">渲染 tab</h3>

`element.render('tab', filter);`

- 参数 `'tab'` 是渲染 tab 的固定值。
- 参数 `filter` : 对应 tab 容器 `lay-filter` 的属性值或<sup>2.9.15+</sup>指定元素的 jQuery 对象。

tab 组件会在元素加载完毕后，自动对 tab 元素完成一次渲染，因此该方法主要用于对动态插入的 tab 元素的初始化渲染。

```
<div id="test"></div>

<!-- import layui -->
<script>
layui.use(function(){
  var element = layui.element;
  var $ = layui.$;
  // 动态插入 tab 元素
  $('#test').html(`
    <div class="layui-tab" lay-filter="demo-filter-tab">
      <!-- … -->
    </div>
  `);
  // 渲染 tab 组件
  element.render('tab', 'demo-filter-tab');
});
</script>
```


<h3 id="element.tabAdd" lay-toc="{level: 2}" class="ws-bold">添加 tab</h3>

`element.tabAdd(filter, options);`

- 参数 `filter` : tab 容器（`class="layui-tab"`）的 `lay-filter` 属性值
- 参数 `options` : 添加 tab 时的属性选项，见下表：

| options | 描述 | 类型 | 默认 |
| --- | --- | --- | --- |
| title | 选项卡的标题 | string | - |
| content | 选项卡的内容，支持传入 `html` | string | - |
| id | 选项卡标题元素的 `lay-id` 属性值 | string | - |
| change | 是否添加 tab 完毕后即自动切换 | boolean | `false` |
| allowClose <sup>2.9.11+</sup>| 是否开启删除图标 | boolean | `false` |

该方法用于添加 tab 选项。用法详见 : [#示例](#examples)

<h3 id="element.tabDelete" lay-toc="{level: 2}" class="ws-bold">删除 tab</h3>

`element.tabDelete(filter, layid, force);`

- 参数 `filter` : tab 容器（`class="layui-tab"`）的 `lay-filter` 属性值
- 参数 `layid` : 选项卡标题元素的 `lay-id` 属性值
- 参数 `force` <sup>2.9.21+</sup>
: 是否强制删除 tab。若设置 `true` 将忽略 `tabBeforeDelete` 事件行为。默认 `false`

该方法用于删除 tab 选项。用法详见 : [#示例](#examples)


<h3 id="element.tabChange" lay-toc="{level: 2}" class="ws-bold">切换 tab</h3>

`element.tabChange(filter, layid, force);`

- 参数 `filter` : tab 容器（`class="layui-tab"`）的 `lay-filter` 属性值
- 参数 `layid` : 选项卡标题元素的 `lay-id` 属性值
- 参数 `force` <sup>2.9.15+</sup>
: 是否强制执行 tab 切换。设置 `true` 将忽略 `tabBeforeChange` 事件行为。默认 `false`

该方法用于切换到对应的 tab 选项。用法详见 : [#示例](#examples)


<h3 id="element.tab" lay-toc="{level: 2}" class="ws-bold">自定义 tab</h3>

`element.tab(options);`

- 参数 `options` : 属性选项，见下表：

| options | 描述 | 类型 |
| --- | --- | --- |
| headerElem | 指定自定义的 tab 头元素项选择器 | string / DOM |
| bodyElem | 指定自定义的 tab 主题内容元素项选择器 | string / DOM |


该方法用于绑定自定义 tab 元素（即非 `class="layui-tab` 定义的结构）。示例如下：

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full'], done: function(obj){
  obj.render();
}}">
  <textarea>
<style>
.demo-tab-header .layui-btn.layui-this{border-color: #1E9FFF; color: #1E9FFF;}
.demo-tab-body>div{display: none;}
</style>
<!-- 任意自定义的 tab 元素 -->
<div class="demo-tab-header layui-btn-container" id="tabHeader">
  <button class="layui-btn layui-btn-primary layui-this">标签1</button>
  <button class="layui-btn layui-btn-primary">标签2</button>
  <button class="layui-btn layui-btn-primary">标签3</button>
</div>
<div class="demo-tab-body" id="tabBody">
  <div class="layui-show">内容-1</div>
  <div>内容-2</div>
  <div>内容-3</div>
</div>

<!-- import layui -->
<script>
layui.use(function(){
  var element = layui.element;

  // 绑定自定义的 tab 元素
  element.tab({
    headerElem: '#tabHeader>.layui-btn',
    bodyElem: '#tabBody>div'
  });
});
</script>
  </textarea>
</pre>

<h2 id="on" lay-toc="{anchor: null}">事件</h2>


<h3 id="on-tab" lay-toc="{level: 2}" class="ws-bold">tab 切换事件</h3>

`element.on('tab(filter)', callback);`

- 参数 `tab(filter)` 是一个特定结构。
  - `tab` 为 tab 切换事件固定值；
  - `filter` 为 tab 容器属性 `lay-filter` 对应的值。
- 参数 `callback` 为事件执行时的回调函数，并返回一个 `object` 类型的参数。

点击 tab 选项切换时触发。[#参考示例](#hash-match)

```
var element = layui.element;

// tab 切换事件
element.on('tab(filter)', function(data){
  console.log(this); // 当前 tab 标题所在的原始 DOM 元素
  console.log(data.index); // 得到当前 tab 项的所在下标
  console.log(data.elem); // 得到当前的 tab 容器
  console.log(data.id); // 得到当前的 tab ID(2.9.11+)
});
```

<h3 id="on-tabBeforeChange" lay-toc="{level: 2}" class="ws-bold">tab 切换前的事件 <sup>2.9.15+</sup></h3>

`element.on('tabBeforeChange(filter)', callback);`

- 参数 `tabBeforeChange(filter)` 是一个特定结构。
  - `tabBeforeChange` 为 tab 切换前事件固定值；
  - `filter` 为 tab 容器属性 `lay-filter` 对应的值。
- 参数 `callback` 为事件执行时的回调函数，并返回一个 `object` 类型的参数。

点击 tab 选项切换前触发。

```
var element = layui.element;

// tab 切换前的事件
element.on('tabBeforeChange(filter)', function(data){
  console.log(data.elem); // 得到当前的 tab 容器
  console.log(data.from.index); // 得到切换前的 tab 项所在下标
  console.log(data.from.id); // 得到切换前的 tab 项所在ID
  console.log(data.to.index); // 得到切换后的 tab 项所在下标
  console.log(data.to.id); // 得到切换后的 tab 项所在ID

  if(data.to.id === 'home') return false; // 返回 false 时阻止切换到对应的选项卡
});
```

<h3 id="on-tabDelete" lay-toc="{level: 2}" class="ws-bold">tab 删除事件</h3>

`element.on('tabDelete(filter)', callback);`

- 参数 `tabDelete(filter)` 是一个特定结构。
  - `tabDelete` 为 tab 删除事件固定值；
  - `filter` 为 tab 容器属性 `lay-filter` 对应的值。
- 参数 `callback` 为事件执行时的回调函数，并返回一个 `object` 类型的参数。

点击 tab 选项删除时触发。

```
var element = layui.element;

// tab 删除事件
element.on('tabDelete(filter)', function(data){
  console.log(data.index); // 得到被删除的 tab 项的所在下标
  console.log(data.elem); // 得到当前的 tab 容器
  console.log(data.id); // 得到被删除的 tab 项的 ID(2.9.11+)
});
```

<h3 id="on-tabBeforeDelete" lay-toc="{level: 2}" class="ws-bold">tab 删除前的事件 <sup>2.9.11+</sup></h3>

`element.on('tabBeforeDelete(filter)', callback);`

- 参数 `tabBeforeDelete(filter)` 是一个特定结构。
  - `tabBeforeDelete` 为 tab 删除前事件固定值；
  - `filter` 为 tab 容器属性 `lay-filter` 对应的值。
- 参数 `callback` 为事件执行时的回调函数，并返回一个 `object` 类型的参数。

点击 tab 选项删除前触发。 示例：

<pre class="layui-code" lay-options="{preview: true, layout: ['code', 'preview'], tools: ['full'], done: function(obj){
  obj.render();
}}">
  <textarea>
<div class="layui-tab" lay-allowclose="true" lay-filter="test-tabs">
  <ul class="layui-tab-title">
    <li lay-id="1" class="layui-this">标签1</li>
    <li lay-id="2">标签2</li>
    <li lay-id="3">标签3</li>
    <li lay-id="4">标签4</li>
    <li lay-id="5">标签5</li>
  </ul>
  <div class="layui-tab-content">
    <div class="layui-tab-item layui-show">删除标签，弹出确认提示框</div>
    <div class="layui-tab-item">内容-2</div>
    <div class="layui-tab-item">内容-3</div>
    <div class="layui-tab-item">内容-4</div>
    <div class="layui-tab-item">内容-5</div>
  </div>
</div>

<!-- import layui -->
<script>
layui.use(function(){
  var layer = layui.layer;
  var element = layui.element;

  // tab 删除前的事件
  element.on('tabBeforeDelete(test-tabs)', function(data){
    console.log(data.index); // 得到被删除的 tab 项的所在下标
    console.log(data.elem); // 得到当前的 tab 容器
    console.log(data.id); // 得到被删除的 tab 项的 ID(2.9.11+)

    // 确认删除
    layer.confirm(`确认删除【${this.innerText}】吗？`, function (index) {
      element.tabDelete('test-tabs', data.id, true); // 确认后强制删除 - 2.9.21+
      layer.close(index);
    });

    return false; // 返回 false 时阻止默认删除选项卡行为
  });
});
</script>
  </textarea>
</pre>


