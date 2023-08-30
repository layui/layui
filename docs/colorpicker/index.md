---
title: 颜色选择器 colorpicker
toc: true
---
 
# 颜色选择器

> 颜色选择器 `colorpicker` 用于对颜色的快捷选择，支持 `hex,rgb,rgba` 三种颜色类型。

<h2 id="examples" lay-toc="{hot: true}" style="margin-bottom: 0;">示例</h2>

<div>
{{- d.include("/colorpicker/detail/demo.md") }}
</div>

<p></p>

<h2 id="api" lay-toc="{}">API</h2>

| API | 描述 |
| --- | --- |
| var colorpicker = layui.colorpicker | 获得 `colorpicker` 模块。 |
| [colorpicker.render(options)](#render) | colorpicker 组件渲染，核心方法。 |


<h2 id="render" lay-toc="{level: 2}">渲染</h2>

`colorpicker.render(options);`

- 参数 `options` : 基础属性配置项。[#详见属性](#options)
  <br>注 <sup>2.7+</sup> : 除 `elem` 属性外，其他基础属性也可以直接写在元素的 `lay-options="{}"` 属性中。

```
<div id="ID-test-colorpicker"></div>
<div class="class-test-colorpicker" lay-options="{color: '#333'}"></div>
<div class="class-test-colorpicker" lay-options="{color: '#777'}"></div>

<!-- import layui --> 
<script>
layui.use(function(){
  var colorpicker = layui.colorpicker;
  // 单个渲染
  colorpicker.render({
    elem: '#ID-test-colorpicker'
  });
  // 批量渲染
  colorpicker.render({
    elem: '.class-test-colorpicker'
  });
});
</script>
```

<h2 id="options" lay-toc="{level: 2, hot: true}">属性</h2>

<div>
{{- d.include("/colorpicker/detail/options.md") }}
</div>

## 兼容性

> colorpicker 组件支持 `Chrome,Edge,Firefox` 等所有高级浏览器，不支持 IE10 低版本浏览器。
