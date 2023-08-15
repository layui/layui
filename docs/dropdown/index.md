---
title: 下拉菜单 dropdown
toc: true
---
 
# 下拉菜单 <sup title="指在该版本新增的组件">2.6+</sup>

> 下拉菜单 `dropdown` 是基于基础菜单结构衍生的多功能通用下拉菜单组件，它将原本静态呈现的菜单，通过各种事件的形式触发，从而以独立面板的形式弹出。不仅可用作常见的*下拉菜单*，更可用于*右键菜单*来实现更多的交互可能。

<h2 id="examples" lay-toc="{anchor: null}" style="margin-bottom: 0;">示例</h2>

<div>
{{- d.include("/dropdown/detail/demo.md") }}
</div>

在 `content` 属性中传入任意的 html 内容，可替代默认的下拉菜单结构，从而实现更丰富的弹出内容。

<h2 id="api" lay-toc="{hot: true}">API</h2>

| API | 描述 |
| --- | --- |
| var dropdown = layui.dropdown | 获得 `dropdown` 模块。 |
| [dropdown.render(options)](#render) | dropdown 组件渲染，核心方法。 |
| [dropdown.reload(id, options)](#reload) | 完整重载 |
| [dropdown.reloadData(id, options)](#reload) <sup>2.8+</sup> | 仅重载数据或内容 |
| [dropdown.close(id)](#close) | 关闭对应的组件面板 |

<h3 id="render" lay-toc="{level: 2}">渲染</h3>

`dropdown.render(options);`

- 参数 `options` : 基础属性配置项。[#详见属性](#options)
  <br>注 <sup>2.8+</sup> : 除 `elem` 属性外，其他基础属性也可以直接写在元素的 `lay-options="{}"` 属性中。

```
<button class="layui-btn" id="ID-test-dropdown">下拉菜单</button>
<button class="layui-btn class-test-dropdown" lay-options="{
  data: [{title: 'item 1', id: 1}, {title: 'item 2', id: 2}]
}">下拉菜单</button>
<button class="layui-btn class-test-dropdown" lay-options="{
  data: [{title: 'item A', id: 'a'}, {title: 'item B', id: 'b'}]
}">下拉菜单</button>
  
<!-- import layui -->  
<script>
layui.use(function(){
  var dropdown = layui.dropdown;
  // 单个渲染
  dropdown.render({
    elem: '#ID-test-dropdown',
    // …
  });
  // 批量渲染
  dropdown.render({
    elem: '.class-test-dropdown',
    // …
  });
});
</script>
```

<h3 id="options" lay-toc="{level: 2, hot: true}">属性</h3>

<div>
{{- d.include("/dropdown/detail/options.md") }}
</div>

<h3 id="options.data" lay-toc="{level: 3, hot: true}">data 格式</h3>

<div>
{{- d.include("/dropdown/detail/options.data.md") }}
</div>

<div id="options.customName" class="ws-anchor">

您可以对上述 `data` 中常用的字段进行自定义名称 <sup>2.8.14+</sup> :

</div>

```
var dropdown = layui.dropdown;
// 渲染
dropdown.render({
  elem: '', // 绑定元素选择器
  data: [], // 数据源
  customName: { // 自定义 data 字段名 --- 2.8.14+
    id: 'id',
    title: 'title',
    children: 'child'
  },
  // 其他属性 …
});
```


<h3 id="reload" lay-toc="{level: 2, hot: true}">重载</h3>

即对一段已经渲染好的下拉菜单重新设置相关属性并渲染，可分为以下几种重载方式：

| 重载方式 | API |
| --- | --- |
| [完整重载](#dropdown.reload) | [dropdown.reload(id, options, deep)](#dropdown.reload) |
| [仅数据或内容重载](#dropdown.reloadData) <sup>2.8+</sup> | [dropdown.reloadData(id, options, deep)](#dropdown.reloadData) |


两者重载的使用方式完全相同，区别只是在于参与重载时的属性差异及其对应的效果差异。一般按照实际需求选择使用。

<h4 id="dropdown.reload" lay-pid="reload" class="ws-anchor ws-bold">完整重载</h4>

`dropdown.reload(id, options);`

- 参数 `id` : 组件渲染时定义的 `id` 属性值
- 参数 `options` : 基础属性配置项。[#详见属性](#options)

该方法用于对下拉菜单进行完整重载，所有属性均可参与到重载中。

<pre class="layui-code" lay-options="{preview: true, codeStyle: 'height: 535px;', layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
{{- d.include("/dropdown/examples/reload.md") }}
  </textarea>
</pre>

<h4 id="dropdown.reloadData" lay-pid="reload" class="ws-anchor ws-bold">仅数据或内容重载 <sup>2.8+</sup></h4>

`dropdown.reloadData(id, options);`

- 参数同 `dropdown.reload(id, options)` 参数

使用该方法时，与数据无关的属性不会参与到重载中。因此若只是更新数据或内容，该方法可大幅提升体验。

<pre class="layui-code" lay-options="{preview: true, codeStyle: 'height: 535px;', layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
{{- d.include("/dropdown/examples/reloadData.md") }}
  </textarea>
</pre>


<h3 id="close" lay-pid="api" class="ws-anchor ws-bold">关闭面板 <sup>2.8+</sup></h3>

`dropdown.close(id);`

- 参数 `id` : 组件渲染时定义的 `id` 属性值

该方法用于关闭对应的 `dropdown` 组件面板。

```
var dropdown = layui.dropdown;

// 渲染
dropdown.render({
  elem: '', // 绑定元素选择器
  id: 'test', // 自定义 id 
  // 其他属性 …
});
// 关闭对应的组件面板
dropdown.close('test');
```