---
title: 面板 panel,card,collapse
toc: true
---

# 面板

> 面板是一个包含普通面板（panel）、卡片面板（card）、折叠面板（collapse）的集合

<h2 id="panel" lay-toc="{}" style="margin-bottom: 0;">常规面板</h2>

常规面板通常作为包裹其他元素的形式存在，如与基础菜单 `menu` 经常搭配使用。

<pre class="lay-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<div class="lay-panel">
  <div style="padding: 32px;">面板任意内容</div>
</div>
  </textarea>
</pre>

<h2 id="card" lay-toc="{}">卡片面板</h2>

<pre class="lay-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<div class="lay-bg-gray" style="padding: 16px;">
  <div class="lay-row lay-col-space15">
    <div class="lay-col-md6">
      <div class="lay-card">
        <div class="lay-card-header">卡片面板</div>
        <div class="lay-card-body">
          卡片式面板面板通常用于非白色背景色的主体内<br>
          从而映衬出边框投影
        </div>
      </div>
    </div>
    <div class="lay-col-md6">
      <div class="lay-card">
        <div class="lay-card-header">卡片面板</div>
        <div class="lay-card-body">
          结合 layui 的栅格系统<br>
          轻松实现响应式布局
        </div>
      </div>
    </div>
  </div>
</div>
  </textarea>
</pre>

<h2 id="collapse" lay-toc="{hot: true}">折叠面板</h2>

<pre class="lay-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full'], done: function(obj){
  obj.render();
}}">
  <textarea>
<div class="lay-collapse">
  <div class="lay-collapse-item">
    <div class="lay-collapse-title">Collapse Title 1</div>
    <div class="lay-collapse-content lay-show">
      <p>Content 1 （添加 lay-show 类设置初始展开）</p>
    </div>
  </div>
  <div class="lay-collapse-item">
    <div class="lay-collapse-title">Collapse Title 2</div>
    <div class="lay-collapse-content">
      <p>Content 2</p>
    </div>
  </div>
  <div class="lay-collapse-item">
    <div class="lay-collapse-title">Collapse Title 3</div>
    <div class="lay-collapse-content">
      <ul>
        <li>Content list</li>
        <li>Content list</li>
      </ul>
    </div>
  </div>
  <div class="lay-collapse-item">
    <div class="lay-collapse-title">折叠面板的标题</div>
    <div class="lay-collapse-content">
      <p>折叠面板的内容</p>
    </div>
  </div>
</div>

<!-- import layui -->
  </textarea>
</pre>


<h3 id="accordion" lay-toc="{level: 2}">开启手风琴</h3>

在折叠面板容器上追加 `lay-accordion` 属性，开启手风琴效果，即点击展开当前面板的同时，折叠其他面板。

<pre class="lay-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full'], done: function(obj){
  obj.render();
}}">
  <textarea>
<div class="lay-collapse" lay-accordion>
  <div class="lay-collapse-item">
    <div class="lay-collapse-title">layui 主要面向哪些用户群体？</div>
    <div class="lay-collapse-content lay-show">
      Layui 作为一个前端界面组件库，但面向的却主要是后端开发者。
      <br>即无需涉足各类构建工具，只需面向浏览器本身，便可将页面所需呈现的元素与交互信手拈来。
    </div>
  </div>
  <div class="lay-collapse-item">
    <div class="lay-collapse-title">为什么我的眼里常含泪水？</div>
    <div class="lay-collapse-content">
      <p>因为我对这片土地爱的深沉。</p>
    </div>
  </div>
  <div class="lay-collapse-item">
    <div class="lay-collapse-title">Why are my eyes always brimming with tears?</div>
    <div class="lay-collapse-content">
      <p>Because I love this land so deeply…</p>
    </div>
  </div>
  <div class="lay-collapse-item">
    <div class="lay-collapse-title">一个折叠面板的标题？</div>
    <div class="lay-collapse-content">
      <p>一个折叠面板的内容。</p>
    </div>
  </div>
</div>

<!-- import layui -->
  </textarea>
</pre>

<h3 id="collapse-tree" lay-toc="{level: 2}">折叠面板嵌套</h3>

折叠面板内部支持无限嵌套，即折叠面板中再放置无限层级的折叠面板，以实现树形折叠结构。如：

<pre class="lay-code" lay-options="{preview: true, codeStyle: 'height:535px;', layout: ['preview', 'code'], tools: ['full'], done: function(obj){
  obj.render();
}}">
  <textarea>
<div class="lay-collapse" lay-accordion>
  <div class="lay-collapse-item">
    <div class="lay-collapse-title">文学家</div>
    <div class="lay-collapse-content lay-show">

      <div class="lay-collapse" lay-accordion>
        <div class="lay-collapse-item">
          <div class="lay-collapse-title">唐代</div>
          <div class="lay-collapse-content lay-show">

            <div class="lay-collapse" lay-accordion>
              <div class="lay-collapse-item">
                <div class="lay-collapse-title">杜甫</div>
                <div class="lay-collapse-content lay-show">
                  唐代著名诗人，与李白齐名
                </div>
              </div>
              <div class="lay-collapse-item">
                <div class="lay-collapse-title">李白</div>
                <div class="lay-collapse-content">
                  <p>唐代著名诗人，与杜甫齐名</p>
                </div>
              </div>
              <div class="lay-collapse-item">
                <div class="lay-collapse-title">王勃</div>
                <div class="lay-collapse-content">
                  <p>著有千古名篇《滕王阁序》</p>
                </div>
              </div>
            </div>

          </div>
        </div>
        <div class="lay-collapse-item">
          <div class="lay-collapse-title">宋代</div>
          <div class="lay-collapse-content">
            <p>一个属于文人的时代</p>
          </div>
        </div>
        <div class="lay-collapse-item">
          <div class="lay-collapse-title">现代</div>
          <div class="lay-collapse-content">
            <p>文学大师纷纷登场</p>
          </div>
        </div>
        <div class="lay-collapse-item">
          <div class="lay-collapse-title">当代</div>
          <div class="lay-collapse-content">
            <p>文人、作家</p>
          </div>
        </div>
      </div>

    </div>
  </div>
  <div class="lay-collapse-item">
    <div class="lay-collapse-title">科学家</div>
    <div class="lay-collapse-content">
      <p>伟大的科学家</p>
    </div>
  </div>
  <div class="lay-collapse-item">
    <div class="lay-collapse-title">艺术家</div>
    <div class="lay-collapse-content">
      <p>浑身散发着艺术细胞</p>
    </div>
  </div>
</div>

<!-- import layui -->
  </textarea>
</pre>


<h3 id="collapse-render" lay-toc="{level: 2}">折叠面板渲染</h3>


`element.render('collapse', filter);`

- 参数 `'collapse'` : 渲染折叠面板的固定值
- 参数 `filter` : 对应折叠面板容器 `lay-filter` 的属性值或<sup>2.9.15+</sup>指定元素的 jQuery 对象

在元素加载完毕后，`element` 模块会自动对元素进行一次渲染。而当元素为动态插入时，需通过该方法完成初始化渲染。


<h3 id="on-collapse" lay-toc="{level: 2}">折叠面板事件</h3>

`element.on('collapse(filter)', callback)`

- 参数 `collapse(filter)` 是一个特定结构。
  - `collapse` 为折叠面板点击事件固定值；
  - `filter` 为导航容器属性 `lay-filter` 对应的值。
- 参数 `callback` 为事件执行时的回调函数，并返回一个 `object` 类型的参数。

<pre class="lay-code" lay-options="{preview: true, codeStyle: 'height:535px;', layout: ['code', 'preview'], tools: ['full'], done: function(obj){
  obj.render();
}}">
  <textarea>
<div class="lay-collapse" lay-filter="filter-collapse">
  <div class="lay-collapse-item">
    <div class="lay-collapse-title">Collapse Title 1</div>
    <div class="lay-collapse-content">
      <p>Content 1</p>
    </div>
  </div>
  <div class="lay-collapse-item">
    <div class="lay-collapse-title">Collapse Title 2</div>
    <div class="lay-collapse-content">
      <p>Content 2</p>
    </div>
  </div>
  <div class="lay-collapse-item">
    <div class="lay-collapse-title">Collapse Title 3</div>
    <div class="lay-collapse-content">
      <ul>
        <li>Content list</li>
        <li>Content list</li>
      </ul>
    </div>
  </div>
  <div class="lay-collapse-item">
    <div class="lay-collapse-title">折叠面板的标题</div>
    <div class="lay-collapse-content">
      <p>折叠面板的内容</p>
    </div>
  </div>
</div>

<!-- import layui -->
<script>
layui.use(function(){
  var element = layui.element;
  var layer = layui.layer;

  // 折叠面板点击事件
  element.on('collapse(filter-collapse)', function(data){
    console.log(data.show); // 得到当前面板的展开状态，true or false
    console.log(data.title); // 得到当前点击面板的标题区域对象
    console.log(data.content); // 得到当前点击面板的内容区域对象

    // 显示状态，仅用于演示
    layer.msg('展开状态：'+ data.show);
  });
});
</script>
  </textarea>
</pre>



