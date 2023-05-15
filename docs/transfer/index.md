---
title: 穿梭框组件 transfer
toc: true
---
 
# 穿梭框组件

> 穿梭框组件 `transfer` 以左右栏 `checkbox` 列表为表现形式，可对列表进行选择并移动到另一栏。

<h2 id="examples" lay-toc="{hot: true}" style="margin-bottom: 0;">示例</h2>

<div>
{{- d.include("/transfer/detail/demo.md") }}
</div>

<h2 id="api" lay-toc="{hot: true}">API</h2>

| API | 描述 |
| --- | --- |
| var transfer = layui.transfer | 获得 `transfer` 模块。 |
| [transfer.render(options)](#render) | transfer 组件渲染，核心方法。 |
| [transfer.reload(id, options)](#reload) | 重载实例 |
| [transfer.getData(id)](#getData) | 获得右侧数据 |
| [transfer.set(options)](#set) | 设定全局默认属性 |

<h3 id="render" lay-toc="{level: 2}">渲染</h3>

`transfer.render(options);`

- 参数 `options` : 基础属性配置项。[#详见属性](#options)

<h3 id="options" lay-toc="{level: 2, hot: true}">属性</h3>

<div>
{{- d.include("/transfer/detail/options.md") }}
</div>

<h3 id="options.data" lay-toc="{level: 3, hot: true}">data 格式</h3>

<div>
{{- d.include("/transfer/detail/options.data.md") }}
</div>

<h3 id="reload" lay-toc="{level: 2}">重载</h3>

`transfer.reload(id, options);`

- 参数 `id` : 对应渲染时定义的 `id` 属性值
- 参数 `options` : 基础属性配置项。[#详见属性](#options)

```
var transfer = layui.transfer;

// 渲染
transfer.render({
  elem: '', // 绑定元素选择器
  id: 'test', // 自定义 id 索引
  // 其他属性 …
});
// 重载
transfer.reload('test', { // options
  title: ['title 1', 'title 2']
});
```

<h3 id="getData" lay-pid="api" class="ws-anchor ws-bold">获得右侧数据</h3>

`transfer.getData(id);`

- 参数 `id` : 对应渲染时定义的 `id` 属性值

穿梭框的右侧数据通常被认为是选中数据，因此你需要得到它，并进行提交等操作。

```
var transfer = layui.transfer;

// 渲染
transfer.render({
  elem: '', // 绑定元素选择器
  id: 'test', // 自定义 id 索引
  // 其他属性 …
});
// 获得右侧数据
var getData = transfer.getData('test');
```


<h3 id="set" lay-pid="api" class="ws-anchor ws-bold">设置全局默认属性</h3>

`transfer.set(options);`

- 参数 `options` : 基础属性配置项。[#详见属性](#options)

该方法对所有的 `transfer` 实例有效，设置的属性优先级低于 `transfer.render(options)`

```
// 设置 transfer 全局默认属性
transfer.set({
  height: 'auto', // 所有穿梭框默认高度为自动
  // …
});
```