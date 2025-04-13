---
title: 评分组件 rate
toc: true
---

# 评分组件

> 评分组件 `rate` 一般用于等级展示或评价类操作。

<h2 id="examples" lay-toc="{hot: true}" style="margin-bottom: 0;">示例</h2>

<div>
{{- d.include("/rate/detail/demo.md") }}
</div>

<p></p>

<h2 id="api" lay-toc="{}">API</h2>

| API | 描述 |
| --- | --- |
| var rate = layui.rate | 获得 `rate` 模块。 |
| [基础接口](../component/#export) <sup>2.11+</sup> | 该组件由 `component` 构建，因此继承其提供的基础接口。|
| [rate.render(options)](#render) | rate 组件渲染，核心方法。 |

<h2 id="render" lay-toc="{level: 2}">渲染</h2>

`rate.render(options);`

- 参数 `options` : 基础属性选项。[#详见属性](#options)
  <br>注 <sup>2.8+</sup> : 除 `elem` 属性外，其他基础属性也可以直接写在元素的 `lay-options="{}"` 属性中。

```
<div id="ID-test-rate"></div>
<div class="class-test-rate" lay-options="{value: 3}"></div>
<div class="class-test-rate" lay-options="{value: 5}"></div>

<!-- import layui -->
<script>
layui.use(function(){
  var rate = layui.rate;
  // 单个渲染
  rate.render({
    elem: '#ID-test-rate'
  });
  // 批量渲染
  rate.render({
    elem: '.class-test-rate'
  });
});
</script>
```

<h2 id="options" lay-toc="{level: 2, hot: true}">属性</h2>

<div>
{{- d.include("/rate/detail/options.md") }}
</div>
