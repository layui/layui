---
title: 组件中文名 组件名
toc: true
---

# 组件中文名

> 组件介绍

<h2 id="examples" lay-toc="{hot: true}" style="margin-bottom: 0;">示例</h2>

<div>
{{- d.include("/组件名/detail/demo.md") }}
</div>

<h2 id="api" lay-toc="{}">API</h2>

| API | 描述 |
| --- | --- |
| const { 组件名 } = layui | 获得 `组件名` 模块。 |
| [组件名.render(options)](#render) | 组件名 组件渲染，核心方法。 |
| …… | …… |

<h3 id="render" lay-toc="{level: 2}">渲染</h3>

`组件名.render(options);`

- 参数 `options` : 基础选项。[#详见选项](#options)

<h3 id="options" lay-toc="{level: 2, hot: true}">选项</h3>

<div>
{{- d.include("/组件名/detail/options.md") }}
</div>

_更多方法的详细介绍_

方法传入的参数（`opts`）是一个 `Object` 类型的选项，需按照表格的方式展示，如：

```markdown
| 选项 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| 选项名 | 该选项的详细介绍 | 该选项支持的数据类型 | 该选项的默认值，若无则填写 `-` |
```

## 事件

_若有的话_

| 事件名 | 描述 |
| --- | --- |
| eventName | 描述 |

<h3 id="event" lay-toc="{level: 2}">事件名</h3>

触发时机的描述，若事件支持阻断机制（`return false`），必须在文档中明确说明。

```js
// 示例代码
```

## 💖 心语

通常是开发者开发该组件时的内心独白，通过带有感性化的文字与受众建立奇妙的意识沟通。