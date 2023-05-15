---
title: 轮播组件 carousel
toc: true
---
 
# 轮播组件

> 轮播组件 `carousel` 主要适用于跑马灯/轮播等交互场景。它并非单纯地为焦点图而生，准确地说，它可以满足任何内容的轮播式切换操作，亦可胜任 `fullpage`（全屏上下轮播）的需求。

<h2 id="examples" lay-toc="{anchor: null}" style="margin-bottom: 0;">示例</h2>

<style>
/* 为了区分效果 */
div[carousel-item]>*{text-align: center; line-height: 280px; color: #fff;}
div[carousel-item]>*:nth-child(2n){background-color: #16b777;}
div[carousel-item]>*:nth-child(2n+1){background-color: #16baaa;}
</style>

<div>
{{- d.include("/carousel/detail/demo.md") }}
</div>

<h2 id="api" lay-toc="{}">API</h2>

| API | 描述 |
| --- | --- |
| var carousel = layui.carousel | 获得 `carousel` 模块。 |
| [var inst = carousel.render(options)](#render) | carousel 组件渲染，核心方法。 |
| [inst.reload(options)](#reload) | 轮播实例重载 |
| [inst.goto(index)](#goto) <sup>2.8+</sup> | 轮播切换到特定下标 |

<h2 id="render" lay-toc="{level: 2}">渲染</h2>

`carousel.render(options);`

- 参数 `options` : 基础属性配置项。[#详见属性](#options)

该方法返回一个实例对象，包含操作当前实例的相关方法成员。

```
var inst = carousel.render(options);
console.log(inst); // 得到当前实例对象
```

<h3 id="reload" lay-toc="{level: 2}">重载</h3>

`inst.reload(options);`

- 参数 `options` : 基础属性配置项。[#详见属性](#options)

通过渲染返回的实例对象，可获得重载方法，用于实现对实例的属性重载。

```
var inst = carousel.render(options); // 轮播初始渲染
inst.reload(options); // 轮播重载
```

详细用法可参考：[#示例](#demo)

<h2 id="options" lay-toc="{level: 2, hot: true}">属性</h2>

<div>
{{- d.include("/carousel/detail/options.md") }}
</div>


<h3 id="goto" lay-toc="{level: 2}">切换 <sup>2.8+</sup></h3>

`inst.goto(index);`

- 参数 `index` : 轮播下标，从 `0` 开始计算

通过渲染返回的实例对象，可获得切换方法，用于实现对轮播的手动定向切换。

```
var inst = carousel.render(options); // 轮播初始渲染
inst.goto(0); // 轮播切换到第一项
inst.goto(1); // 轮播切换到第二项
```
