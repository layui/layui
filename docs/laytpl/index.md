---
title: 模板引擎 laytpl
toc: true
---

# 模板引擎

> `laytpl` 是 Layui 内置的 JavaScript 模板引擎，采用原生控制流，在模板解析上有着比较出色的表现。

<h2 id="test" lay-toc="{hot: true}" style="margin-bottom: 0;">在线测试</h2>

对文本框中的*模板*或*数据*进行编辑，下方将呈现对应的*渲染结果*。

<div>
{{- d.include("/laytpl/detail/demo.md") }}
</div>

<h2 id="api" lay-toc="{}">API</h2>

| API | 描述 |
| --- | --- |
| var laytpl = layui.laytpl | 获得 `laytpl` 模块。 |
| [var templateInst = laytpl(template, options)](#laytpl) | 创建模板实例。 |
| [laytpl.config(options)](#config) | 设置基础选项默认值 |
| [laytpl.extendVars(variables)](#variables) <sup>2.11+</sup> | 扩展模板内部变量 |

<h3 id="laytpl" lay-toc="{level: 2, hot: true}">创建模板实例</h3>

`var templateInst = laytpl(template, options)`

- 参数 `template` : 原始模板字符
- 参数 `options` <sup>2.8+</sup> : 当前模板实例的选项。详见下述：[#基础选项](#options)

该方法返回一个模板编译器实例，用于对模板进行数据渲染等操作，实例对象的成员有：

| 实例成员 | 描述 |
| --- | --- |
| templateInst.render(data, callback) | 给模板实例进行数据渲染，返回渲染后的 HTML 字符 |
| templateInst.compile(template) <sup>2.11+</sup> | 编译新的模板，会强制清除旧模板缓存 |
| templateInst.config  <sup>2.11+</sup> | 获取当前模板实例的配置选项 |

通过将模板编译与渲染两个环节分开，我们可以在模板仅编译一次的情况下，对其渲染不同的数据，如：

{{!
```js
var laytpl = layui.laytpl;

// 创建模板实例
var templateInst = laytpl('{{= d.name }}是一名{{= d.role }}');

// 数据渲染 1
templateInst.render({
  name: '张三',
  role: '全栈开发者'
}, function(html) {
  console.log(html); // 张三是一名全栈开发者
});

// 数据渲染 2
var html = templateInst.render({
  name: '王五',
  role: '架构师'
});
```
!}}

若每次需要对不同的模板进行编译和数据渲染，你也可以使用链式写法，如：

{{!
```js
laytpl('{{= d.name }}是一名{{= d.role }}').render({
  name: '张三',
  role: '全栈开发者'
}, function(html) {
  console.log(html); // 张三是一名全栈开发者
});
```
!}}

若模板字符较大，你可以将模板存放在页面某个标签中，如：

{{!
```js
<script id="ID-demo-tpl" type="text/html">
  <h3>{{= d.name }}</h3>
  <p>角色：{{= d.role }}</p>
</script>

<div id="ID-demo-view"></div>

<!-- import layui -->
<script>
layui.use(function(){
  var laytpl = layui.laytpl;

  var template = document.getElementById('ID-demo-tpl').innerHTML; // 获取模板字符
  var target = document.getElementById('ID-demo-view'); // 输出结果的目标元素
  var data = { // 数据
    "name": "张三",
    "role": "全栈开发者"
  };
  // 渲染并输出结果
  laytpl(template).render(data, function(html) {
    target.innerHTML = html;
  });
});
</script>
```
!}}

实际使用时，若模板通用，而数据不同，为了避免对模板进行不必要的重复编译，推荐将创建模板实例与数据渲染分开书写。

<h3 id="options" lay-toc="{level: 2, hot: true}">基础选项</h3>

创建模板实例时，你还可以对其设置一些选项，如：

{{!
```js
// 创建模板实例
var templateInst = laytpl(`
  {{ let role = d.role || '全栈开发者'; }}
  {{= d.name }}是一名{{= role }}
`);
var html = templateInst.render({ name: '张三' });
```
!}}

支持设置的完整选项如下：

<div>
{{- d.include("/laytpl/detail/options.md") }}
</div>

<h3 id="tags" lay-toc="{level: 2, hot: true}">标签规则</h3>

<div>
{{- d.include("/laytpl/detail/tags.md") }}
</div>

#### ⚡ 请注意：
> *开发者在使用模板标签时，需确保模板中待输出的内容在开发者自身的可控范围内，尤其对于用户输入的字符要做好 XSS 防护，否则请避免使用该模板引擎，以免产生 XSS 安全隐患*。

<h3 id="include" lay-toc="{level: 2, hot: true}">导入子模板 <sup>2.11+</sup></h3>

{{!
laytpl 支持在模板中通过添加 `{{- include(id, data) }}` 语句引入子模板。`include` 语句参数解释：

- `id` : 子模板 ID
- `data` : 向子模版传入的数据

为了引入的子模板不被转义，因此这里应该使用 `{{- }}`，即对子模板进行原文输出。示例：

<pre class="layui-code" lay-options="{preview: true, layout: ['code', 'preview'], codeStyle: 'max-height: 520px;', tools: ['full']}">
  <textarea>
<script id="ID-demo-tpl-header" type="text/html">
  <div>头部公共模板</div>
</script>
<script id="ID-demo-tpl-list" type="text/html">
  <ul>
    {{ d.items.forEach(function(item, index) { }}
      <li>
        <span>{{= item.title }}</span>
        {{ if(item.children) { }}
          {{- include('ID-demo-tpl-list', { items: item.children }) }}
        {{ } }}
      </li>
    {{ }); }}
  </ul>
</script>
<script id="ID-demo-tpl-main" type="text/html">
  {{- include('ID-demo-tpl-header') }}
  <h3>循环输出：</h3>
  {{- include('ID-demo-tpl-list', { items: d.items }) }}
</script>
<div id="ID-demo-view"></div>

<!-- import layui -->
<script>
layui.use(function() {
  var laytpl = layui.laytpl;

  var template = document.getElementById('ID-demo-tpl-main').innerHTML; // 获取模板字符
  var target = document.getElementById('ID-demo-view'); // 输出结果的目标元素
  var data = {
    items: [{"title": "list 1", "children": [{"title": "list 1-1", "children": [{"title": "list 1-1-1"}]}, {"title": "list 1-2"}]},{"title": "list 2", "children": [{"title": "list 2-1"}]},{"title": "list 3"}]
  };

  // 创建模板实例
  var templateInst = laytpl(template);

  // 渲染并输出结果
  templateInst.render(data, function(html) {
    target.innerHTML = html;
  });
});
</script>
  </textarea>
</pre>

!}}

若在 Node.js 环境，可通过 `laytpl.extendVars()` 方法重置 `include` 语句实现模板文件的导入。

<h3 id="config" lay-toc="{level: 2}">设置选项默认值</h3>

`laytpl.config(options);`

- 参数 `options`: 基础选项

你可以设置任意选项的默认值，如：

{{!
```js
laytpl.config({
  open: '<%', // 自定义起始界定符
  close: '%>', // 自定义起始界定符
});

// 创建模板实例
var templateInst = laytpl(`
  <% var roles = ["前端工程师","全栈工程师","架构师"]; %>
  <%= d.name %>是一名<%= roles[d.role] %>
`);
// 渲染
templateInst.render({
  name: '张三',
  role: 1
}, function(string){
  console.log(string); // 张三是一名全栈工程师
});
```
!}}

<h3 id="variables" lay-toc="{level: 2}">扩展模板内变量</h3>

`laytpl.extendVars(variables)`

- 参数 `variables` : 扩展的变量列表，变量值通常是一个函数

事实上 laytpl 内置了一些模板内部方法，如 `_escape, include`。你可以对它们进行重构，或扩展更多内部变量，如：

{{!
```js
// 扩展模板内部变量
laytpl.extendVars({
  // 重构 include 方法，实现引入模板文件
  include: function(filename, data) {
    // …
  },
  // 添加 toDataString 方法
  toDataString: function(date) {
    date = date || new Date();
    return new Date(date).toLocaleDateString();
  }
});

// 在模板中使用扩展的变量
var templateInst = laytpl('日期：{{= toDataString(d.time) }}');
templateInst.render({ time: 1742745600000 }, function(html) {
  console.log(html);
});
```
!}}

## 💖 心语

我们在 `2.11` 版本对 laytpl 完成了重要重构，使其能够具备应对更多复杂模板结构的解析能力。同时，为了与业界常用的 JavaScript 模板引擎 ejs 对齐，我们新增了与 ejs 相同的标签规则，这意味着同一套模板可以在 laytpl 和 ejs 中任意切换。

作为 Layui 为数不多的一个纯功能型的模块，laytpl 承载了一些重要组件的功能支撑，如 table, dropdown 等，使得它们也能够自定义动态模板，增强了组件的可定制化。当然，laytpl 也可以作为前端单页面应用及 Express 等 Web 框架的视图引擎。

