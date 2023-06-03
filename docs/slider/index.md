---
title: 滑块组件 slider
toc: true
---
 
# 滑块组件

> 滑块组件 `slider` 是一个拖拽选值的交互性组件，常与 `form` 元素结合使用。

<h2 id="examples" lay-toc="{hot: true}" style="margin-bottom: 0;">示例</h2>

<style>
.demo-slider-container .layui-code-item-preview{padding: 32px;}
.demo-slider-container .layui-code-item-preview > div{margin: 24px 0;}
</style>
<div class="demo-slider-container">
{{- d.include("/slider/detail/demo.md") }}
</div>

<h2 id="api" lay-toc="{}">API</h2>

| API | 描述 |
| --- | --- |
| var slider = layui.slider | 获得 `slider` 模块。 |
| [var inst = slider.render(options)](#render) | slider 组件渲染，核心方法。 |
| [inst.setValue(value)](#setValue) | 设置滑块值 |
| inst.config | 获得当前实例的属性配置项 |

<h2 id="render" lay-toc="{level: 2}">渲染</h2>

`slider.render(options);`

- 参数 `options` : 基础属性配置项。[#详见属性](#options)
  <br>注 <sup>2.8+</sup> : 除 `elem` 属性外，其他基础属性也可以直接写在元素的 `lay-options="{}"` 属性中。

```
<div id="ID-test-slider"></div>
<div class="class-test-slider" lay-options="{value: 50}"></div>
<div class="class-test-slider" lay-options="{value: 80}"></div>
 
<!-- import layui -->
<script>
layui.use(function(){
  var slider = layui.slider;
  // 单个渲染
  slider.render({
    elem: '#ID-test-slider'
  });
  // 批量渲染
  slider.render({
    elem: '.class-test-slider'
  });
});
</script>
```


该方法返回一个实例对象，包含操作当前实例的相关方法成员。

```
var inst = slider.render(options);
console.log(inst); // 得到当前实例对象
```

<h3 id="setValue" class="ws-anchor ws-bold">设置滑块值</h3>

`inst.setValue(value, index)`

- 参数 `value` : 要设置的滑块数值
- 参数 `index` : 滑块所在的区间开始值或结尾值的索引，开始值：`0` ; 结尾值：`1`

```
var slider = layui.slider;
 
// 渲染
var inst = slider.render({
  elem: '#id'
  // …
});      
 
// 设置滑块值
inst.setValue(20);
 
// 若滑块开启了范围，即： `range: true`
ins1.setValue(20, 0) // 设置开始值
ins1.setValue(60, 1) // 设置结尾值
```

<h2 id="options" lay-toc="{level: 2, hot: true}">属性</h2>

<div>
{{- d.include("/slider/detail/options.md") }}
</div>