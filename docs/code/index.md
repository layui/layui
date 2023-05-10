---
title: Code 预览组件 code
toc: true
---
 
# Code 预览组件

> 代码预览组件 `code` 主要用于对代码区块的修饰和对应的效果预览，如 Layui 各组件文档中的示例演示。


<h2 id="api" lay-toc="{}">方法</h2>

`layui.code(options);`

- 参数 `options` : 基础属性配置项。[#详见属性](#options)。

属性除了在该方法中传递，也可以直接写在元素的 `lay-options` 属性上，如：

<pre class="layui-code" lay-options="{preview: true, layout: ['code', 'preview']}">
  <textarea>
<pre class="layui-code code-demo" lay-options="{}">
// 在里面放置任意的 code
test
test
</pre>

<!-- import layui -->  
<script>
layui.use(function(){
  // code
  layui.code({
    elem: '.code-demo'
  });
})
</script>
  </textarea>
</pre>

<h2 id="options" lay-toc="{hot: true}">属性</h2>

<div>
{{- d.include("/code/detail/options.md") }}
</div>