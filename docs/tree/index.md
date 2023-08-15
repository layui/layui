---
title: 树组件 tree
toc: true
---
 
# 树组件

> 树组件 `tree` 是以树形为结构的菜单伸缩型组件，*当前版本中，`tree`主要用于树菜单展示，交互性相对较弱。*

<h2 id="examples" lay-toc="{anchor: null}" style="margin-bottom: 0;">示例</h2>

<div>
{{- d.include("/tree/detail/demo.md") }}
</div>

<h2 id="api" lay-toc="{hot: true}">API</h2>

| API | 描述 |
| --- | --- |
| var tree = layui.tree | 获得 `tree` 模块。 |
| [tree.render(options)](#render) | tree 组件渲染，核心方法。 |
| [tree.getChecked(id)](#getChecked) | 获取选中的节点数据 |
| [tree.setChecked(id, idArr)](#setChecked) | 设置对应 id 的节点选中 |
| [tree.reload(id, options)](#reload) | tree 实例重载 |

<h3 id="render" lay-toc="{level: 2}">渲染</h3>

`tree.render(options);`

- 参数 `options` : 基础属性配置项。[#详见属性](#options)

<h3 id="options" lay-toc="{level: 2, hot: true}">属性</h3>

<div>
{{- d.include("/tree/detail/options.md") }}
</div>

<h3 id="options.data" lay-toc="{level: 3, hot: true}">data 格式</h3>

<div>
{{- d.include("/tree/detail/options.data.md") }}
</div>

<div id="options.customName" class="ws-anchor">

您可以对上述 `data` 中常用的字段进行自定义名称 <sup>2.8.14+</sup> :

</div>

```
var tree = layui.tree;
// 渲染
tree.render({
  elem: '', // 绑定元素选择器
  id: 'test', // 自定义 id 索引
  data: [], // 数据源
  customName: { // 自定义 data 字段名 --- 2.8.14+
    id: 'id',
    title: 'title',
    children: 'children'
  },
  // 其他属性 …
});
```

<h3 id="getChecked" lay-pid="api" class="ws-anchor">获取选中的节点数据</h3>

`tree.getChecked(id);`

- 参数 `id` : 对应 tree 渲染时定义的 id 属性值

```
var tree = layui.tree;

// 渲染
tree.render({
  elem: '', // 绑定元素选择器
  id: 'test', // 自定义 id 索引
  // 其他属性 …
});

// 获取选中的节点数据
var checkData = tree.getChecked('test');
```

<h3 id="setChecked" lay-pid="api" class="ws-anchor">设置对应 id 的节点选中</h3>

`tree.setChecked(id, idArr);`

- 参数 `id` : 对应 tree 渲染时定义的 id 属性值
- 参数 `idArr` : 对应 tree 渲染时的 data 中的 id 属性值。数组格式，可设置多个。

```
var tree = layui.tree;

// 渲染
tree.render({
  elem: '', // 绑定元素选择器
  id: 'test', // 自定义 id 索引
  // 其他属性 …
});

// 设置对应 id 的节点选中
tree.setChecked('test', [1, 3]); // 批量勾选 id 为 1,3 的节点
```

<h3 id="reload" lay-toc="{level: 2}">重载</h3>

`tree.reload(id, idArr);`

- 参数 `id` : 对应 tree 渲染时定义的 id 属性值
- 参数 `options` : 基础属性配置项。[#详见属性](#options)

```
var tree = layui.tree;

// 渲染
tree.render({
  elem: '', // 绑定元素选择器
  id: 'test', // 自定义 id 索引
  // 其他属性 …
});

// 重载
tree.reload('test', { // options
  data: []
});
```