---
title: 固定条组件 fixbar
toc: true
---
 
# 固定条组件

> 固定条组件 `fixbar` 是指当滚动条滑动时，始终固定在页面一侧的工具条元素，除了内置的 `TOP` 条功能外，还可以灵活地扩展任意自定义的工具条。在 `2.x` 版本中，`fixbar` 属于 `util` 模块的子集。

<h2 id="examples" lay-toc="{hot: true}" style="margin-bottom: 0;">示例</h2>

<div>
{{- d.include("/fixbar/detail/demo.md") }}
</div>

<h2 id="api" lay-toc="{}">API</h2>

| API | 描述 |
| --- | --- |
| var util = layui.util | 获得 `util` 模块。 |
| [util.fixbar(options)](#fixbar) | fixbar 组件渲染，核心方法。 |

<h2 id="fixbar" lay-toc="{level: 2}">渲染</h2>

`util.fixbar(options);`

- 参数 `options` : 基础属性配置项。[#详见属性](#options)

<h2 id="options" lay-toc="{level: 2, hot: true}">属性</h2>

<div>
{{- d.include("/fixbar/detail/options.md") }}
</div>