---
title: 进度条 progress
toc: true
---
 
# 进度条

> 进度条 `progress` 可应用于许多业务场景，如任务完成进度、loading 等等。

<h2 id="examples" lay-toc="{hot: true}" style="margin-bottom: 0;">示例</h2>

<pre class="layui-code" lay-options="{preview: true, text: {preview: '常规用法'}, layout: ['preview', 'code'], tools: ['full'], done: function(obj){
  obj.render();
}}">
  <textarea>
<div class="layui-progress">
  <div class="layui-progress-bar" lay-percent="30%"></div>
</div>
 
<hr class="ws-space-16">
 
<div style="width:300px">
  <div class="layui-progress">
    <div class="layui-progress-bar" lay-percent="50%"></div>
  </div>
</div>

<!-- import layui -->
  </textarea>
</pre>

进度条宽度是 100% 适配于它的父级元素，如上面的进度条是在一个 300px 的父容器中。


<h3 id="color" lay-toc="{level: 2}">进度条主题</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full'], done: function(obj){
  obj.render();
}}">
  <textarea>
<div class="layui-progress">
  <div class="layui-progress-bar layui-bg-red" lay-percent="10%"></div>
</div>
 
<hr class="ws-space-16">
 
<div class="layui-progress">
  <div class="layui-progress-bar layui-bg-orange" lay-percent="30%"></div>
</div>
 
<hr class="ws-space-16">
 
<div class="layui-progress">
  <div class="layui-progress-bar layui-bg-primary" lay-percent="50%"></div>
</div>
 
<hr class="ws-space-16">
 
<div class="layui-progress">
  <div class="layui-progress-bar layui-bg-blue" lay-percent="60%"></div>
</div>
 
<hr class="ws-space-16">
 
<div class="layui-progress">
  <div class="layui-progress-bar" lay-percent="70%"></div>
</div>

<!-- import layui -->
  </textarea>
</pre>


<h3 id="size" lay-toc="{level: 2}">大号进度条</h3>

通过对进度条容器追加 `className` 为 `layui-progress-big` 可设置大尺寸风格的进度条。

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full'], done: function(obj){
  obj.render();
}}">
  <textarea>
<div class="layui-progress layui-progress-big">
  <div class="layui-progress-bar" lay-percent="15%"></div>
</div>
 
<hr class="ws-space-16">
 
<div class="layui-progress layui-progress-big">
  <div class="layui-progress-bar layui-bg-orange" lay-percent="35%"></div>
</div>
 
<hr class="ws-space-16">
 
<div class="layui-progress layui-progress-big">
  <div class="layui-progress-bar layui-bg-blue" lay-percent="75%"></div>
</div>

<!-- import layui -->
  </textarea>
</pre>


<h3 id="percent" lay-toc="{level: 2}">显示进度值</h3>

<pre class="layui-code" lay-options="{preview: true, previewStyle: 'padding-top: 24px;', layout: ['preview', 'code'], tools: ['full'], done: function(obj){
  obj.render();
}}">
  <textarea>
<div class="layui-progress" lay-showpercent="true">
  <div class="layui-progress-bar" lay-percent="30%"></div>
</div>
 
<hr class="ws-space-16">
 
<div class="layui-progress" lay-showpercent="true">
  <div class="layui-progress-bar" lay-percent="5 / 10"></div>
</div>
 
<hr class="ws-space-16">
 
<div class="layui-progress layui-progress-big" lay-showpercent="true">
  <div class="layui-progress-bar" lay-percent="70%"></div>
</div>

<!-- import layui -->
  </textarea>
</pre>


<h2 id="api" lay-toc="{}">API</h2>

| API | 描述 |
| --- | --- |
| var element = layui.element | 获得 `element` 模块。 |
| [element.render(\'progress\', filter)](#render) | 进度条 `progress` 组件渲染。 |
| [element.progress(filter, percent)](#progress) | 设置进度值 |

<h3 id="render" lay-toc="{level: 2}">渲染</h3>

`element.render('progress', filter);`

- 参数 `'progress'` : 渲染进度条的固定值
- 参数 `filter` : 对应进度条容器 `lay-filter` 的属性值

在元素加载完毕后，element 模块会自动对元素进行一次渲染。而当元素为动态插入时，需通过该方法完成初始化渲染。

```
<div id="test"></div>

<!-- import layui -->
<script>
layui.use(function(){
  var element = layui.element;
  var $ = layui.$;
  // 动态插入进度条元素
  $('#test').html(`
    <div class="layui-progress" lay-filter="demo-filter-progress">
      <div class="layui-progress-bar" lay-percent="30%"></div>
    </div>
  `);
  // 渲染进度条组件
  element.render('progress', 'demo-filter-progress');
});
</script>
```


<h3 id="attr" lay-toc="{level: 2}">属性</h3>

| 属性 | 描述 |
| --- | --- |
| lay-percent | 用于设置进度条的值，进度条内层容器属性。支持 *百分比* 和 *分数* 形式。用法详见：[#示例](#examples) |
| lay-showpercent | 是否显示进度值，进度条外层容器属性，默认不显示。用法详见：[#示例](#showpercent) |


<h3 id="progress" lay-toc="{level: 2, hot: true}">设置进度值</h3>

`element.progress(filter, percent);`

- 参数 `filter` : 对应进度条容器 `lay-filter` 的属性值
- 参数 `'percent'` : 进度条的值

该方法用于动态改变进度条的值。示例：

<pre class="layui-code" lay-options="{preview: true, previewStyle: 'padding-top: 24px;', layout: ['preview', 'code'], tools: ['full'], done: function(obj){
  obj.render();
}}">
  <textarea>
<div class="layui-progress layui-progress-big" lay-showPercent="true" lay-filter="demo-filter-progress">
  <div class="layui-progress-bar" lay-percent="0%"></div>
</div>
 
<hr class="ws-space-16">
 
<div class="layui-btn-container">
  <button class="layui-btn" lay-on="setPercent">设置 50%</button>
  <button class="layui-btn" lay-on="loading">模拟 loading</button>
</div>

<!-- import layui -->
<script>
layui.use(function(){
  var element = layui.element;
  var util = layui.util;
  
  // 普通事件
  util.on('lay-on', {
    // 设置进度值
    setPercent: function(){
      element.progress('demo-filter-progress', '50%'); // 设置 50% 的进度
    },
    // 模拟 loading
    loading: function(othis){
      var DISABLED = 'layui-btn-disabled';
      if(othis.hasClass(DISABLED)) return;

      var n = 0;
      var timer = setInterval(function(){
        n = n + Math.random()*10|0;  
        if(n>100){
          n = 100;
          clearInterval(timer);
          othis.removeClass(DISABLED);
        }
        element.progress('demo-filter-progress', n+'%');
      }, 300+Math.random()*1000);
      
      othis.addClass(DISABLED);
    }
  });
});
</script>
  </textarea>
</pre>

