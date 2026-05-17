---
title: 标签页组件 tabs
toc: true
---

# 标签页组件 <sup>2.10+</sup>

> `tabs` 是 2.10 版本新增的加强型组件，可替代原 `element` 模块中的 `tab` 组件。tabs 广泛应用于 Web 页面。

<h2 id="examples" lay-toc="{anchor: null}" style="margin-bottom: 0;">示例</h2>

<div class="ws-docs-showcase"></div>

<div>
{{- d.include("/tabs/detail/demo.md") }}
</div>

<h2 id="api" lay-toc="{hot: true}">API</h2>

| API | 描述 |
| --- | --- |
| var tabs = layui.tabs | 获得 `tabs` 模块。|
| [基础接口](../component/#export) | 该组件由 `component` 构建，因此继承其提供的基础接口。|
| [tabs.render(options)](#render) | tabs 组件渲染，核心方法。|
| [tabs.add(id, opts)](#add) | 新增一个标签项。|
| [tabs.close(id, index, force)](#close) | 关闭指定的标签项。|
| [tabs.closeMult(id, mode, index)](#closeMult) | 批量关闭标签项。|
| [tabs.change(id, index, force)](#change) | 切换到指定的标签项。|
| [tabs.data(id)](#data) | 获取当前标签页相关数据。|
| [tabs.getHeaderItem(id, index)](#getHeaderItem) | 获取指定的标签头部项。|
| [tabs.getBodyItem(id, index)](#getBodyItem) | 获取指定的标签内容项。|
| [tabs.refresh(id)](#refresh) | 刷新标签视图。 |

<h3 id="render" lay-toc="{level: 2}">渲染</h3>

`tabs.render(options)`

- 参数 `options` : 基础属性选项。[#详见属性](#options)

组件支持以下三种渲染方式：

#### 1. 自动渲染

tabs 组件会在元素加载完毕后，自动对 `class="lay-tabs"` 目标元素完成一次渲染，若无法找到默认的目标元素（如：动态插入的标签元素的场景），则可通过该方法完成对标签页的初始化渲染。

```js
// 对 class="lay-tabs" 所在标签进行初始化渲染
tabs.render();
```

#### 2. 方法渲染

通过方法动态渲染一个 tabs 组件，无需在 HTML 中书写标签页的 HTML 结构。

```js
<div id="test"></div>
<!-- import layui -->
<script>
layui.use(function(){
  var tabs = layui.tabs;
  tabs.render({
    elem: '#test',
    header: [
      { title: 'Tab1' },
      { title: 'Tab2' }
    ],
    body: [
      { content: 'Tab content 1' },
      { content: 'Tab content 2' }
    ],
    index: 0, // 初始选中标签索引
  })
});
</script>
```

#### 3. 为任意元素渲染 tabs 功能

当 `header` 和 `body` 参数传入元素选择器时，可为任意元素绑定标签切换功能。

```js
// 给任意元素绑定 Tab 功能
tabs.render({
  elem: '#demoTabs3', // 目标主容器选择器
  header: ['#demoTabsHeader', '>button'], // 标签头部主元素选择器、标签头部列表选择器
  body: ['#demoTabsBody', '>.test-item'] // 标签内容主元素选择器、标签内容列表选择器
});
```

具体用法可直接参考上述示例：[给任意元素绑定 tabs 切换功能](#demo-custom)


<h3 id="options" lay-toc="{level: 2}">属性</h3>

<div>
{{- d.include("/tabs/detail/options.md") }}
</div>

<h3 id="add" class="ws-anchor ws-bold">新增标签</h3>

`tabs.add(id, opts)`

- 参数 `id` :  组件的实例 ID
- 参数 `opts` : 标签配置项。可选项详见下表

| opts | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 标签标题。必填项 | string | - |
| content | 标签内容。必填项 | string | - |
| id | 标签的 `lay-id` 属性值 | string | - |
| index | 活动标签的索引或 `lay-id` 属性值，默认取当前选中标签的索引 | number | - |
| mode | 标签的插入方式。支持以下可选值：<ul><li>`append` 插入标签到最后</li> <li>`prepend` 插入标签到最前</li> <li>`before` 在活动标签前插入</li> <li>`after` 在活动标签后插入</li></ul> | string | `append` |
| active | 是否将新增项设置为活动标签 | boolean | `true` |
| closable | 标签是否可关闭。初始值取决于 `options.closable` | boolean | `false` |
| headerItem | 自定义标签头部元素，如 `headerItem: '<li></li>'` | string | - |
| bodyItem | 自定义标签内容元素，如 `bodyItem: '<div></div>'` | string | - |
| done | 标签添加成功后执行的回调函数 | Function | - |

该方法用于给对应的 tabs 实例新增一个标签

```js
tabs.add('test', {
  title: 'New Tab 1',
  content: 'New Tab Content 1',
  done: function(data) {
    console.log(data); // 标签相关数据

    // 为新标签头添加任意属性
    data.headerItem.attr('lay-tips', '111');
  }
});
```

<h3 id="close" class="ws-anchor ws-bold">关闭标签</h3>

`tabs.close(id, index, force)`

- 参数 `id` : 组件的实例 ID
- 参数 `index` : 若传入 number 类型，则为标签索引；若传入 string 类型，则为标签的 `lay-id` 属性值
- 参数 `force` : 是否强制关闭。若设置 `true` 将忽略 `beforeClose` 事件行为。默认 `false`

该方法用于关闭指定的标签项。

```js
tabs.close('test', 3); // 关闭索引为 3 的标签
tabs.close('test', 3, true); // 强制关闭索引为 3 的标签
tabs.close('test', 'abc'); // 关闭 lay-id="abc" 的标签
```

<h3 id="closeMult" class="ws-anchor ws-bold">批量关闭标签</h3>

`tabs.closeMult(id, mode, index)`

- 参数 `id` : 组件的实例 ID
- 参数 `mode` : 关闭方式。支持以下可选值：

| mode | 描述 |
| --- | --- |
| other | 关闭除当前标签外的其他标签 |
| right | 关闭当前标签的右侧所有标签 |
| all | 关闭所有标签 |

- 参数 `index` : 活动标签的索引或 `lay-id` 属性值，默认取当前选中标签的索引。一般用于标签右键事件。

该方法用于批量关闭标签，若标签项已设置不允许关闭（`lay-closable="false"`），则操作将被忽略。

```js
tabs.closeMult(id, 'other'); // 关闭除当前活动标签外的其他标签
tabs.closeMult(id, 'other', 3); // 关闭除索引为 3 的标签外的其他标签
tabs.closeMult(id, 'other', 'ccc'); // 关闭除 lay-id="ccc" 的标签外的其他标签

tabs.closeMult(id, 'right'); // 关闭当前活动标签的右侧所有标签
tabs.closeMult(id, 'right', 3); // 关闭索引为 3 的标签的右侧所有标签
tabs.closeMult(id, 'right', 'ccc'); // 关闭 lay-id="ccc" 的标签的右侧所有标签

tabs.closeMult(id, 'all'); // 关闭所有标签
```

<h3 id="change" class="ws-anchor ws-bold">切换标签</h3>

`tabs.change(id, index, force)`

- 参数 `id` : 组件的实例 ID
- 参数 `index` : 标签索引或标签的 `lay-id` 属性值
- 参数 `force` : 是否强制切换。若设置 `true` 将忽略 `beforeChange` 事件行为。默认 false

该方法用于切换到指定的标签项。

```js
tabs.change('test', 3); // 切换到索引为 3 的标签
tabs.change('test', 3, true); // 强制切换到索引为 3 的标签
tabs.change('test', 'abc'); // 切换到 lay-id="abc" 的标签
tabs.change('test', 'abc', true); // 强制切换到 lay-id="abc" 的标签
```

<h3 id="data" class="ws-anchor ws-bold">获取标签相关数据</h3>

`tabs.data(id)`

- 参数 `id` : 组件的实例 ID

该方法用于获取标签相关数据。

```js
var data = tabs.data('test');
console.log(data);
```

返回的 `data` 包含以下字段：

```js
{
  options, // 标签配置信息
  container, // 标签容器的相关元素
  thisHeaderItem, // 当前活动标签头部项
  thisBodyItem, // 当前活动标签内容项
  index, // 当前活动标签索引
  length, // 标签数量
}
```

<h3 id="getHeaderItem" class="ws-anchor ws-bold">获取标签头部项</h3>

`tabs.getHeaderItem(id, index)`

- 参数 `id` : 组件的实例 ID
- 参数 `index` : 若传入 number 类型，则为标签索引；若传入 string 类型，则为标签的 `lay-id` 属性值

该方法用于获取标签头部项元素。

```js
var headerItem = tabs.getHeaderItem('test', 3); // 获取索引为 3 的标签头部项元素
var headerItem = tabs.getHeaderItem('test', 'abc'); // 获取 lay-id="abc" 的标签头部项元素
```

<h3 id="getBodyItem" class="ws-anchor ws-bold">获取标签内容项</h3>

`tabs.getBodyItem(id, index)`

- 参数 `id` : 组件的实例 ID
- 参数 `index` : 若传入 number 类型，则为标签索引；若传入 string 类型，则为标签的 `lay-id` 属性值 <sup>2.11.2+</sup>

该方法用于获取标签内容项元素。

```js
var bodyItem = tabs.getBodyItem('test', 3); // 获取索引为 3 的标签内容项元素
var bodyItem = tabs.getBodyItem('test', 'abc'); // 获取 lay-id="abc" 的标签内容项元素
```

<h3 id="refresh" class="ws-anchor ws-bold">刷新标签视图</h3>

`tabs.refresh(id)`

- 参数 `id` : 组件的实例 ID

该方法用于刷新标签视图，如标签头部的滚动结构等，一般通过非 API 方式对标签进行修改的场景中使用。

```js
tabs.refresh('test'); // 刷新标签视图
```


<h2 id="on" lay-toc="{hot: true}">事件</h2>

`tabs.on('event(id)', callback)`

- 参数介绍详见 `component` 组件的[事件定义](../component/#on)。以下是组件提供的 `event` 事件列表

| event | 描述 |
| --- | --- |
| [afterRender](#on-afterRender) | 标签渲染后的事件 |
| [beforeChange](#on-beforeChange) | 标签切换前的事件 |
| [afterChange](#on-afterChange) | 标签切换后的事件 |
| [beforeClose](#on-beforeClose) | 标签关闭前的事件 |
| [afterClose](#on-afterClose) | 标签关闭后的事件 |


<h3 id="on-afterRender" class="ws-anchor ws-bold">标签渲染后的事件</h3>

`tabs.on('afterRender(id)', callback)`

标签渲染成功后触发。

```js
tabs.on('afterRender(testID)', function(data){
  console.log(data); // 标签相关数据
});
```

<h3 id="on-beforeChange" class="ws-anchor ws-bold">标签切换前的事件</h3>

`tabs.on('beforeChange(id)', callback)`

标签在切换前触发，通过在事件中 `return false` 可阻止默认标签切换行为。通常和 `tabs.change()` 方法搭配使用。

```js
// tabs 切换前的事件
tabs.on(`beforeChange(testID)`, function(data) {
  console.log(data); // 标签相关数据
  console.log(data.from.index); // 切换前的选中标签索引
  console.log(data.from.headerItem); // 切换前的选中标签头部项
  console.log(data.to.index); // 切换后的选中标签索引
  console.log(data.to.headerItem); // 切换后的选中标签头部项

  // 阻止标签默认关闭
  return false;
});
```

示例演示：

<pre class="lay-code" lay-options="{preview: true, layout: ['preview', 'code'], codeStyle: 'max-height: 520px;', tools: ['full'], done: function(obj){
  obj.render();
}}">
  <textarea>
{{- d.include("/tabs/examples/beforeChange.md") }}
  </textarea>
</pre>

<h3 id="on-afterChange" class="ws-anchor ws-bold">标签切换后的事件</h3>

`tabs.on('afterChange(id)', callback)`

标签成功切换后触发。

```js
// tabs 切换后的事件
tabs.on('afterChange(testID)', function(data) {
  console.log(data);
});
```

<h3 id="on-beforeClose" class="ws-anchor ws-bold">标签关闭前的事件</h3>

`tabs.on('beforeClose(id)', callback)`

标签在切换前触发，通过在事件中 `return false` 可阻止默认标签切换行为。通常和 `tabs.close()` 方法搭配使用。

<pre class="lay-code" lay-options="{preview: true, layout: ['preview', 'code'], codeStyle: 'max-height: 520px;', tools: ['full'], done: function(obj){
  obj.render();
}}">
  <textarea>
{{- d.include("/tabs/examples/beforeClose.md") }}
  </textarea>
</pre>

<h3 id="on-afterClose" class="ws-anchor ws-bold">标签关闭后的事件</h3>

`tabs.on('afterClose(id)', callback)`

标签被成功关闭后触发。

```js
// tabs 关闭后的事件
tabs.on('afterClose(testID)', function(data) {
  console.log(data);
});
```

## 💖 心语

tabs 是通过 component 重构的首个组件，它来自于最早试图发布的 Layui 3.0（后因为 3.0 技术路线的变化，而整理放至 2.10+ 版本中），目的是将 element 模块中的 tab 组件进行解耦，增强其可扩展性。为了给开发者必要的时间缓冲，我们会将旧 tab 组件仍然保留在后续的若干版本中，但会在合适的时机对旧 tab 组件进行剔除，建议开发者尽量提前过渡到当前新的 tabs 组件。


