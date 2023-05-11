---
title: 某某组件 MOD_NAME
toc: true
---
 
# 某某组件

> 某某组件 `MOD_NAME` 

<h2 id="examples" lay-toc="{hot: true}" style="margin-bottom: 0;">示例</h2>

<div>
{{- d.include("/MOD_NAME/detail/demo.md") }}
</div>

<h2 id="api" lay-toc="{}">API</h2>

| API | 描述 |
| --- | --- |
| var MOD_NAME = layui.MOD_NAME | 获得 `MOD_NAME` 模块。 |
| [MOD_NAME.render(options)](#render) | MOD_NAME 组件渲染，核心方法。 |
| …… | …… |

<h3 id="render" lay-toc="{level: 2}">渲染</h3>

`MOD_NAME.render(options);`

- 参数 `options` : 基础属性配置项。[#详见属性](#options)

<h2 id="options" lay-toc="{level: 2, hot: true}">属性</h2>

<div>
{{- d.include("/MOD_NAME/detail/options.md") }}
</div>