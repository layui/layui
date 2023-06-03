---
title: 分页组件 laypage
toc: true
---
 
# 分页组件

> 分页组件 `laypage` 提供了前端的分页逻辑，使得我们可以很灵活处理不同量级的数据，从而提升渲染效率。

<h2 id="examples" lay-toc="{hot: true}" style="margin-bottom: 0;">示例</h2>

<div class="ws-detail">
{{- d.include("/laypage/detail/demo.md") }}
</div>

<h2 id="api" lay-toc="{}">API</h2>

| API | 描述 |
| --- | --- |
| var laypage = layui.laypage | 获得 `laypage` 模块。 |
| [laypage.render(options)](#render) | laypage 组件渲染，核心方法。 |

<h2 id="render" lay-toc="{level: 2}">渲染</h2>

`laypage.render(options);`

- 参数 `options` : 基础属性配置项。[#详见属性](#options)

<h2 id="options" lay-toc="{level: 2, hot: true}">属性</h2>

<div>
{{- d.include("/laypage/detail/options.md") }}
</div>

## 小贴士

laypage 组件只负责分页本身的逻辑，具体的数据请求及对应的视图渲染需要另外去完成。laypage 不仅能应用在一般的异步分页上，还可直接对一段已知数据进行分页展现，如 table 组件的分页就是采用的 laypage。