---
title: 导航菜单 nav
toc: true
---
 
# 导航菜单

> 导航菜单包含水平导航和垂直导航， 在 `2.x` 版本中，`nav` 组件属于 `element` 模块的子集。

<h2 id="align" lay-toc="{}" style="margin-bottom: 0;">水平导航</h2>

一般用于页面头部菜单。样式规则如下：

- 通过 `class="layui-nav"` 设置导航容器
- 通过 `class="layui-nav-item"` 设置导航菜单项
  - 追加 `className` 为 `layui-this` 可设置菜单选中项
- 通过 `class="layui-nav-child"` 设置导航子菜单项
  - 追加 `className` 为 `layui-nav-child-c` 和 `layui-nav-child-r` 可设置子菜单居中和向右对齐


<h3 id="align-normal" lay-toc="{level: 2}" class="ws-bold">常规用法</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full'], done: function(obj){
  obj.render();
}}">
  <textarea>
<ul class="layui-nav">
  <li class="layui-nav-item layui-this"><a href="">选中</a></li>
  <li class="layui-nav-item">
    <a href="javascript:;">常规</a>
  </li>
  <li class="layui-nav-item"><a href="">导航</a></li>
  <li class="layui-nav-item">
    <a href="javascript:;">子级</a>
    <dl class="layui-nav-child">
      <dd><a href="">菜单1</a></dd>
      <dd><a href="">菜单2</a></dd>
      <dd><a href="">菜单3</a></dd>
    </dl>
  </li>
  <li class="layui-nav-item">
    <a href="javascript:;">选项</a>
    <dl class="layui-nav-child">
      <dd><a href="">选项1</a></dd>
      <dd class="layui-this"><a href="">选项2</a></dd>
      <dd><a href="">选项3</a></dd>
    </dl>
  </li>
  <li class="layui-nav-item"><a href="">演示</a></li>
</ul>

<!-- import layui -->
  </textarea>
</pre>

备注：滑块效果仅跟随不存在子菜单的菜单项。

<h3 id="align-badge" lay-toc="{level: 2}" class="ws-bold">加入徽章等元素</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full'], done: function(obj){
  obj.render();
}}">
  <textarea>
<ul class="layui-nav">
  <li class="layui-nav-item">
    <a href="">带徽章<span class="layui-badge">9</span></a>
  </li>
  <li class="layui-nav-item">
    <a href="">小圆点<span class="layui-badge-dot"></span></a>
  </li>
  <li class="layui-nav-item" lay-unselect>
    <a href="javascript:;">
      <img src="https://unpkg.com/outeres@0.0.10/demo/avatar/1.jpg" class="layui-nav-img">
    </a>
    <dl class="layui-nav-child">
      <dd><a href="javascript:;">子级菜单</a></dd>
      <dd><a href="javascript:;">横线隔断</a></dd>
      <hr>
      <dd style="text-align: center;"><a href="">退出</a></dd>
    </dl>
  </li>
</ul>

<!-- import layui -->
  </textarea>
</pre>

<h3 id="align-theme" lay-toc="{level: 2}" class="ws-bold">导航主题</h3>

给导航容器追加任意背景色 `class`，内置背景色参考：[#背景色公共类](../class/#bg)

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full'], done: function(obj){
  obj.render();
}}">
  <textarea>
<ul class="layui-nav layui-bg-gray">
  <li class="layui-nav-item"><a href="">浅色导航</a></li>
  <li class="layui-nav-item"><a href="">菜单1</a></li>
  <li class="layui-nav-item"><a href="">菜单2</a></li>
  <li class="layui-nav-item">
    <a href="javascript:;">更多</a>
    <dl class="layui-nav-child">
      <dd><a href="">选项1</a></dd>
      <dd><a href="">选项2</a></dd>
      <dd><a href="">选项3</a></dd>
    </dl>
  </li>
  <li class="layui-nav-item"><a href="">菜单3</a></li>
</ul>
 
<br>
 
<ul class="layui-nav layui-bg-cyan">
  <li class="layui-nav-item"><a href="">藏青导航</a></li>
  <li class="layui-nav-item"><a href="">菜单1</a></li>
  <li class="layui-nav-item"><a href="">菜单2</a></li>
  <li class="layui-nav-item">
    <a href="javascript:;">更多</a>
    <dl class="layui-nav-child">
      <dd><a href="">选项1</a></dd>
      <dd><a href="">选项2</a></dd>
      <dd><a href="">选项3</a></dd>
    </dl>
  </li>
  <li class="layui-nav-item"><a href="">菜单3</a></li>
</ul>

<br>
 
<ul class="layui-nav layui-bg-green" lay-bar="disabled">
  <li class="layui-nav-item"><a href="">墨绿导航</a></li>
  <li class="layui-nav-item"><a href="">菜单1</a></li>
  <li class="layui-nav-item"><a href="">菜单2</a></li>
  <li class="layui-nav-item">
    <a href="javascript:;">更多</a>
    <dl class="layui-nav-child">
      <dd><a href="">选项1</a></dd>
      <dd><a href="">选项2</a></dd>
      <dd><a href="">选项3</a></dd>
    </dl>
  </li>
  <li class="layui-nav-item"><a href="">菜单3</a></li>
</ul>

<br>
 
<ul class="layui-nav layui-bg-blue" lay-bar="disabled">
  <li class="layui-nav-item"><a href="">蓝色导航</a></li>
  <li class="layui-nav-item"><a href="">菜单1</a></li>
  <li class="layui-nav-item"><a href="">菜单2</a></li>
  <li class="layui-nav-item">
    <a href="javascript:;">更多</a>
    <dl class="layui-nav-child">
      <dd><a href="">选项1</a></dd>
      <dd><a href="">选项2</a></dd>
      <dd><a href="">选项3</a></dd>
    </dl>
  </li>
  <li class="layui-nav-item"><a href="">菜单3</a></li>
</ul>

<!-- import layui -->
  </textarea>
</pre>


<h2 id="vertical" lay-toc="{}">垂直导航</h2>

一般用于左侧侧边菜单。样式规则如下：

- 在水平导航的 `class` 规则上，通过设置 `class="layui-nav layui-nav-tree"` 定义垂直导航容器。
- 通过 `class="layui-nav-itemed"` 设置父菜单项为展开状态
- 通过给导航容器追加 `class="layui-nav-side"` 可设置侧边垂直导航
- 其余结构及填充内容与水平导航完全相同

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full'], done: function(obj){
  obj.render();
}}">
  <textarea>
<ul class="layui-nav layui-nav-tree">
  <li class="layui-nav-item layui-nav-itemed">
    <a href="javascript:;">默认展开</a>
    <dl class="layui-nav-child">
      <dd><a href="javascript:;">选项1</a></dd>
      <dd><a href="javascript:;">选项2</a></dd>
      <dd><a href="javascript:;">选项3</a></dd>
    </dl>
  </li>
  <li class="layui-nav-item">
    <a href="javascript:;">默认收缩</a>
    <dl class="layui-nav-child">
      <dd><a href="javascript:;">选项1</a></dd>
      <dd><a href="javascript:;">选项2</a></dd>
      <dd><a href="javascript:;">选项3</a></dd>
    </dl>
  </li>
  <li class="layui-nav-item"><a href="javascript:;">菜单1</a></li>
  <li class="layui-nav-item"><a href="javascript:;">菜单2</a></li>
  <li class="layui-nav-item"><a href="javascript:;">菜单3</a></li>
</ul>

<!-- import layui -->
  </textarea>
</pre>

<h3 id="vertical" class="ws-anchor ws-bold">侧边垂直导航</h3>

<pre class="layui-code" lay-options="{preview: 'iframe', style: 'height: 525px;', layout: ['code', 'preview'], tools: ['full', 'window']}">
  <textarea>
{{- d.include("/nav/examples/side.md") }}
  </textarea>
</pre>

<h2 id="api" lay-toc="{}">API</h2>

| API | 描述 |
| --- | --- |
| var element = layui.element | 获得 `element` 模块。 |
| [element.render(\'nav\', \'filter\')](#render) | 导航菜单 `nav` 组件渲染。 |

<h3 id="render" lay-toc="{level: 2}" class="ws-bold">渲染</h3>

`element.render('nav', filter);`

- 参数 `'nav'` 是渲染导航的固定值
- 参数 `filter` : 对应导航容器 `lay-filter` 的属性值

`nav` 组件会在元素加载完毕后，自动对导航完成一次渲染，因此该方法主要用于对动态插入的导航元素的初始化渲染。

```
<div id="test"></div>

<!-- import layui -->
<script>
layui.use(function(){
  var element = layui.element;
  var $ = layui.$;

  // 动态插入导航元素
  $('#test').html(`
    <div class="layui-nav" lay-filter="demo-filter-nav">
      <li class="layui-nav-item layui-this"><a href="">选中</a></li>
      <li class="layui-nav-item"><a href="">菜单</a></li>
      <!-- … -->
    </div>
  `);

  // 渲染导航组件
  element.render('nav', 'demo-filter-nav');
});
</script>
```

<h3 id="attr" lay-toc="{level: 2, hot: true}" class="ws-bold">属性</h3>

| 属性 | 描述 |
| --- | --- |
| lay-shrink | 导航容器属性。展开子菜单时，是否收缩兄弟节点已展开的子菜单。可选值：<ul><li>`lay-shrink=""` 不收缩兄弟菜单子菜单，默认; </li><li>`lay-shrink="all"` 收缩全部兄弟菜单子菜单</li></ul> |
| lay-bar | 导航容器属性。用于禁用滑块跟随功能。如：<br>`<div class="layui-nav" lay-bar="disabled">…</div>` |
| lay-unselect | 导航菜单项属性。 设置后，点击对应菜单项时，不会出现选中效果。 |


<h3 id="on" lay-toc="{level: 2, hot: true}" class="ws-bold">事件</h3>

`element.on('nav(filter)', callback)`

- 参数 `nav(filter)` 是一个特定结构。
  - `nav` 为导航事件固定值； 
  - `filter` 为导航容器属性 `lay-filter` 对应的值。
- 参数 `callback` 为事件执行时的回调函数，并返回一个 `object` 类型的参数。

当点击导航父级菜单和二级菜单时触发。示例：

<pre class="layui-code" lay-options="{preview: true, layout: ['code', 'preview'], tools: ['full'], done: function(obj){
  obj.render();
}}">
  <textarea>
<div class="layui-nav" lay-filter="demo-filter-nav">
  <li class="layui-nav-item"><a href="javascript:;">菜单1</a></li>
  <li class="layui-nav-item"><a href="javascript:;">菜单2</a></li>
</div>

<!-- import layui -->
<script>
layui.use(function(){
  var element = layui.element;
  var layer = layui.layer;
  
  // 导航点击事件
  element.on('nav(demo-filter-nav)', function(elem){
    console.log(elem); // 得到当前点击的元素 jQuery 对象
    layer.msg(elem.text());
  });
});
</script>
  </textarea>
</pre>

<h2 id="separator" lay-toc="{}">面包屑导航</h2>

面包屑导航主要用于指示当前页面所处的位置，并能返回到上级页面。

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full'], done: function(obj){
  obj.render();
}}">
  <textarea>
<h3>默认面包屑</h3>

<span class="layui-breadcrumb">
  <a href="">首页</a>
  <a href="">演示</a>
  <a><cite>导航元素</cite></a>
</span>

<h3>自定义分隔符</h3>

<span class="layui-breadcrumb" lay-separator=">">
  <a href="">首页</a>
  <a href="">国际新闻</a>
  <a href="">亚太地区</a>
  <a><cite>正文</cite></a>
</span>

<h3>门户频道</h3>

<span class="layui-breadcrumb" lay-separator="|">
  <a href="">娱乐</a>
  <a href="">八卦</a>
  <a href="">体育</a>
  <a href="">搞笑</a>
  <a href="">视频</a>
  <a href="">游戏</a>
  <a href="">综艺</a>
</span>

<!-- import layui -->
  </textarea>
</pre>

### **面包屑导航渲染**

`element.render('breadcrumb', filter);`

- 参数 `'breadcrumb'` 是渲染面包屑导航的固定值
- 参数 `filter` : 对应面包屑导航容器 `lay-filter` 的属性值

该方法主要用于对动态插入的面包屑导航的初始化渲染，用法同上述导航菜单。