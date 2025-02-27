---
title: 标签页组件 tabs
toc: true
---

# 标签页组件 <sup>2.10+</sup>

> `tabs` 是 2.10 版本新增的加强型组件，用于替代原 `element` 模块中的 `tab` 组件。tabs 广泛应用于 Web 页面。

<h2 id="examples" lay-toc="{hot: true}" style="margin-bottom: 0;">示例</h2>

<div>
{{- d.include("/tabs/detail/demo.md") }}
</div>

<h2 id="api" lay-toc="{}">API</h2>

该组件继承 `component` 提供的[基础接口](../component/#inherit)，并在此基础上为组件专门扩展了以下接口：

| API | 描述 |
| --- | --- |
| var tabs = layui.tabs | 获得 `tabs` 模块。|
| [tabs.render(options)](#render) | tabs 组件渲染，核心方法。|
| [tabs.add(id, options)](#add) | 新增一个标签项。|
| [tabs.close(id, index)](#close) | 关闭指定的标签项。|
| [tabs.closeMore(id, type, index)](#closeMore) | 批量关闭标签项。|
| [tabs.change(id, index)](#change) | 切换到指定的标签项。|
| [tabs.data(id)](#data) | 获取当前标签页信息。|
| [tabs.headerItem(id, index)](#headerItem) | 获取指定的标签头部项。|
| [tabs.bodyItem(id, index)](#bodyItem) | 获取指定的标签内容项。|
| [tabs.setView(id)](#setView) | 重新调整标签视图结构。|

<h3 id="render" lay-toc="{level: 2}">渲染</h3>

`tabs.render(options);`

- 参数 `options` : 基础属性配置项。[#详见属性](#options)

tabs 组件会在元素加载完毕后，默认自动对 `class="layui-tabs"` 目标元素完成一次渲染，如果无法找到默认的目标元素，可使用该方法完成标签的初始化渲染。

<h3 id="options" lay-toc="{level: 2, hot: true}">属性</h3>

<div>
{{- d.include("/tabs/detail/options.md") }}
</div>

<h3 id="add" lay-toc="{level: 2}">新增标签</h3>

`tabs.add(id, options);`

- 参数 `id` : tabs 容器的唯一 id 标识
- 参数 `options` : 标签配置项
  ```js
  {
    title: '标题', // 标签标题
    content: '内容', // 标签内容
    id: 'xxx', // 标签的 lay-id 属性值
    mode: 'append', // 插入模式。可选值: append/prepend/curr
    unclosed: true, // 是否禁止关闭。默认 false
    done: function(obj){} // 标签添加完毕的回调
  }
  ```

<h3 id="close" lay-toc="{level: 2}">关闭标签</h3>

`tabs.close(id, index);`

- 参数 `id` : tabs 容器的唯一 id 标识
- 参数 `index` : 标签项的索引或 lay-id 属性值

<h3 id="closeMore" lay-toc="{level: 2}">批量关闭标签</h3>

`tabs.closeMore(id, type, index);`

- 参数 `id` : tabs 容器的唯一 id 标识
- 参数 `type` : 关闭类型。可选值：
  - `'all'` : 关闭所有标签
  - `'other'` : 关闭其他标签
  - `'left'` : 关闭左侧标签
  - `'right'` : 关闭右侧标签
- 参数 `index` : 标签项的索引或 lay-id 属性值，用于定位基准点

<h3 id="change" lay-toc="{level: 2}">切换标签</h3>

`tabs.change(id, index);`

- 参数 `id` : tabs 容器的唯一 id 标识
- 参数 `index` : 标签项的索引或 lay-id 属性值

<h3 id="data" lay-toc="{level: 2}">获取标签信息</h3>

`tabs.data(id);`

- 参数 `id` : tabs 容器的唯一 id 标识
- 返回值：包含当前标签页信息的对象
  ```js
  {
    index: 0, // 当前标签项的索引
    prevIndex: -1, // 上一个标签项的索引
    headerElem: {}, // 当前标签头部元素
    bodyElem: {} // 当前标签内容元素
  }
  ```

<h3 id="headerItem" lay-toc="{level: 2}">获取标签头部项</h3>

`tabs.headerItem(id, index);`

- 参数 `id` : tabs 容器的唯一 id 标识
- 参数 `index` : 标签项的索引或 lay-id 属性值
- 返回值：标签头部项的 DOM 元素

<h3 id="bodyItem" lay-toc="{level: 2}">获取标签内容项</h3>

`tabs.bodyItem(id, index);`

- 参数 `id` : tabs 容器的唯一 id 标识
- 参数 `index` : 标签项的索引或 lay-id 属性值
- 返回值：标签内容项的 DOM 元素

<h3 id="setView" lay-toc="{level: 2}">重新调整视图</h3>

`tabs.setView(id);`

- 参数 `id` : tabs 容器的唯一 id 标识
- 描述：用于重新调整标签视图结构，如在容器尺寸变化时调用

