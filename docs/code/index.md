---
title: Code 预览组件 code
toc: true
---
 
# Code 预览组件

> 代码预览组件 `code` 主要用于对代码区块的修饰和对应的效果预览，如 Layui 各组件文档中的示例演示。


<h2 id="api" lay-toc="{}">方法</h2>

`var codeInst = layui.code(options);`

- 参数 `options` : 基础属性配置项。[#详见属性](#options)。

其中 `codeInst` <sup>2.8.17+</sup> 即实例返回的对象，包含对当前实例进行重载等方法成员，如：

```
var codeInst = layui.code(options);
console.log(codeInst); // 查看所有成员
codeInst.config; // 当前实例配置项
codeInst.reload(options); // 重载
codeInst.reloadCode(options); // 仅重载 code
```


另外，属性除了在该方法中传递，也可以直接写在元素的 `lay-options` 属性上，如：

<pre class="layui-code" lay-options="{preview: true, codeStyle: 'height: 315px;', layout: ['code', 'preview']}">
  <textarea>
<pre class="layui-code code-demo" lay-options="{}">
light theme
light theme
light theme
</pre>

<hr>

<pre class="layui-code code-demo" lay-options="{theme: 'dark'}">
dark theme
dark theme
dark theme
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

<h2>小贴士</h2>

> code 组件可广泛应用于技术类文档、博客等页面，可轻松适配第三方主流语法高亮器。
