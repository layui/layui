---
title: 流加载 flow
toc: true
---
 
# 流加载

> 流加载 `flow` 是用于在*信息流*和*图片列表*场景中的滚动按需加载，对前后端的体验和性能优化具有一定帮助。

<h2 id="examples" lay-toc="{anchor: null}" style="margin-bottom: 0;">示例</h2>

<style>
.flow-demo{height: 400px; overflow: auto; font-size: 0;}
.flow-demo li{display: inline-block; margin: 0 5px; font-size: 14px; width: 48%;  margin-bottom: 10px; height: 100px; line-height: 100px; text-align: center; background-color: #eee;}
.flow-demo img{width: 100%; height: 100%;}
.flow-demo-lazyimg{height: 300px; overflow: auto; text-align: center;}
.flow-demo-lazyimg img{width: 40%; height: 200px; margin: 0 3px 5px 0; border: none;}
</style>

<div>
{{- d.include("/flow/detail/demo.md") }}
</div>

<h2 id="api" lay-toc="{}">API</h2>

| API | 描述 |
| --- | --- |
| var flow = layui.flow | 获得 `flow` 模块。 |
| [flow.load(options)](#load) | 信息流加载，核心方法。 |
| [flow.lazyimg(options)](#lazyimg) | 图片懒加载。 |

<h2 id="load" lay-toc="{level: 2}">信息流</h2>

`flow.load(options);`

- 参数 `options` : 基础属性配置项。[#详见属性](#options)

信息流是分页的另一种表现形式，新加载的内容不替换原有的内容，而是随着滚动条滚动而追加显示。[#详见示例](#examples)

<h2 id="options" lay-toc="{level: 2, hot: true}">属性</h2>

<div>
{{- d.include("/flow/detail/options.md") }}
</div>

<h2 id="lazyimg" lay-toc="{level: 2}">图片懒加载</h2>

`flow.lazyimg(options);`

- 参数 `options` : 属性配置项。可选项见下表。

| 属性名 | 描述 |
| --- | --- |
| elem | 绑定容器中需进行懒加载的图片元素选择器 |
| scrollElem | 滚动条所在元素选择器，默认 `document` 。 |

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<div class="flow-demo-lazyimg" id="ID-flow-demo-lazyimg">
  <!-- <img src="占位图地址" lay-src="图片实际地址"> -->
  <img lay-src="https://unpkg.com/outeres@0.0.11/demo/wallpaper.jpg">
  <img lay-src="https://unpkg.com/outeres@0.0.11/demo/wallpaper.jpg">
  <img lay-src="https://unpkg.com/outeres@0.0.11/demo/wallpaper.jpg">
  <img lay-src="https://unpkg.com/outeres@0.0.11/demo/wallpaper.jpg">
  <img lay-src="https://unpkg.com/outeres@0.0.11/demo/wallpaper.jpg">
  <img lay-src="https://unpkg.com/outeres@0.0.11/demo/wallpaper.jpg">
  <img lay-src="https://unpkg.com/outeres@0.0.11/demo/wallpaper.jpg">
  <img lay-src="https://unpkg.com/outeres@0.0.11/demo/wallpaper.jpg">
  <img lay-src="https://unpkg.com/outeres@0.0.11/demo/wallpaper.jpg">
  <img lay-src="https://unpkg.com/outeres@0.0.11/demo/wallpaper.jpg">
  <img lay-src="https://unpkg.com/outeres@0.0.11/demo/wallpaper.jpg">
  <img lay-src="https://unpkg.com/outeres@0.0.11/demo/wallpaper.jpg">
  <img lay-src="https://unpkg.com/outeres@0.0.11/demo/wallpaper.jpg">
  <img lay-src="https://unpkg.com/outeres@0.0.11/demo/wallpaper.jpg">
</div>

<!-- import layui --> 
<script>
layui.use('flow', function(){
  var flow = layui.flow;
  // 图片懒加载
  flow.lazyimg({
    elem: '#ID-flow-demo-lazyimg img',
    scrollElem: '#ID-flow-demo-lazyimg' // 一般不用设置，此处只是演示需要。
  });
});
</script>
  </textarea>
</pre>

无论滚动条上滑还是下滑，都会始终加载当前屏的图片。

