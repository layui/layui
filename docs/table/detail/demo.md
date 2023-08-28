<h3 lay-toc="{level: 2, id: 'examples'}" class="layui-hide">综合演示 🔥</h3>

<pre class="layui-code" lay-options="{preview: 'iframe', id: 'table-demo-1', text: {preview: '综合演示 🔥'}, style: 'height: 506px;', layout: ['preview', 'code'], tools: ['full','window'], done: function(obj){
  setTimeout(function(){
    layer.tipsIndex = layer.tips(
      '点击该图标可最大化查看效果', 
      layui.$('#table-demo-1 .layui-icon-screen-full'), {
      tips: 4,
      time: 30*1000
    })
  });
}, toolsEvent: function(oi, type){
  if(type === 'full'){
    layer.close(layer.tipsIndex);
  }
}}">
  <textarea>
{{- d.include("/table/examples/demo.md") }}
  </textarea>
</pre>

<h3 id="demo-static" lay-toc="{level: 2}" class="ws-bold">静态表格</h3>

静态表格是指内容已经存在于页面中的 `<table class="layui-table">` 元素，且可通过一些*特定属性*设定不同风格。

<pre class="layui-code" lay-options="{preview: true, style: 'height: 335px; overflow: auto;', layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
{{- d.include("/table/examples/static.md") }}
  </textarea>
</pre>

<h3 id="demo-auto-render" lay-toc="{level: 2}" class="ws-bold">模板配置渲染</h3>

在上文「[综合演示](#examples)」中，是通过组件核心方法完成的渲染。除此，还可以在模板上直接配置相关属性，让其自动完成渲染。

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full'], done: function(obj){
  layui.table.init(obj.container.children('table'));
}, toolsEvent: function(oi, type){
  if(type === 'full'){
    layui.table.resize('ID-table-demo-init');
  }
}}">
  <textarea>
{{- d.include("/table/examples/autoRender.md") }}
  </textarea>
</pre>

<h3 id="demo-init" lay-toc="{level: 2}" class="ws-bold">静态表格转换</h3>

<pre class="layui-code" lay-options="{preview: true, codeStyle: 'height: 508px;', layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
{{- d.include("/table/examples/init.md") }}
  </textarea>
</pre>

<h3 id="demo-data" lay-toc="{level: 2}" class="ws-bold">已知数据渲染</h3>

<pre class="layui-code" lay-options="{preview: true, codeStyle: 'height: 508px;', layout: ['preview', 'code'], ID: 'ID-table-demo-data', tools: ['full'], done: function(obj){
  layui.table.resize(this.ID);
}, toolsEvent: function(oi, type){
  if(type === 'full'){
    layui.table.resize(this.ID);
  }
}}">
  <textarea>
{{- d.include("/table/examples/data.md") }}
  </textarea>
</pre>

<h3 id="demo-templet" lay-toc="{level: 2, hot: true}" class="ws-bold">自定义模板</h3>

<pre class="layui-code" lay-options="{preview: true, codeStyle: 'height: 508px;', layout: ['preview', 'code'], tools: ['full'], ID: 'ID-table-demo-templet', done: function(obj){
  layui.table.resize(this.ID);
}, toolsEvent: function(oi, type){
  if(type === 'full'){
    layui.table.resize(this.ID);
  }
}}">
  <textarea>
{{- d.include("/table/examples/templet.md") }}
  </textarea>
</pre>

<h3 id="demo-css" lay-toc="{level: 2, hot: true}" class="ws-bold">自定义样式 <sup>2.7+</sup></h3>

<pre class="layui-code" lay-options="{preview: 'iframe', style: 'height: 538px;', layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
{{- d.include("/table/examples/css.md") }}
  </textarea>
</pre>

<h3 id="demo-page" lay-toc="{level: 2}" class="ws-bold">自定义分页</h3>

<pre class="layui-code" lay-options="{preview: true, codeStyle: 'height: 508px;', layout: ['preview', 'code'], tools: ['full'], ID: 'ID-table-demo-page', done: function(obj){
  layui.table.resize(this.ID);
}, toolsEvent: function(oi, type){
  if(type === 'full'){
    layui.table.resize(this.ID);
  }
}}">
  <textarea>
{{- d.include("/table/examples/page.md") }}
  </textarea>
</pre>

<h3 id="demo-search" lay-toc="{level: 2, hot: true}" class="ws-bold">外部搜索</h3>

<pre class="layui-code" lay-options="{preview: true, codeStyle: 'height: 508px;', layout: ['preview', 'code'], tools: ['full'], ID: 'ID-table-demo-search', done: function(obj){
  obj.render();
  layui.table.resize(this.ID);
}, toolsEvent: function(oi, type){
  if(type === 'full'){
    layui.table.resize(this.ID);
  }
}}">
  <textarea>
{{- d.include("/table/examples/search.md") }}
  </textarea>
</pre>

<h3 id="demo-editable" lay-toc="{level: 2, hot: true}" class="ws-bold">编辑的权限控制 <sup>2.7+</sup></h3>

以下演示一个根据返回数据中某个字段来判断是否开启该行的编辑，*单击对应行*可进入单元格编辑。

<pre class="layui-code" lay-options="{preview: true, codeStyle: 'height: 508px;', layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
{{- d.include("/table/examples/editable.md") }}
  </textarea>
</pre>

<h3 id="demo-editmodes" lay-toc="{level: 2, hot: true}" class="ws-bold">实现多样化编辑</h3>

<pre class="layui-code" lay-options="{preview: true, codeStyle: 'height: 508px;', layout: ['preview', 'code'], tools: ['full'], toolsEvent: function(oi, type){
  if(type === 'full'){
    layui.table.resize('ID-table-demo-editmodes');
  }
}}">
  <textarea>
{{- d.include("/table/examples/editModes.md") }}
  </textarea>
</pre>

<h3 id="demo-parse" lay-toc="{level: 2, hot: true}" class="ws-bold">转换数据格式</h3>

<pre class="layui-code" lay-options="{preview: true, codeStyle: 'height: 508px;', layout: ['preview', 'code'], tools: ['full'], toolsEvent: function(oi, type){
  if(type === 'full'){
    layui.table.resize('ID-table-demo-parse');
  }
}}">
  <textarea>
{{- d.include("/table/examples/parse.md") }}
  </textarea>
</pre>

<h3 id="demo-filter" lay-toc="{level: 2}" class="ws-bold">筛选列记忆功能</h3>

即点击当前表格右上角筛选图标后，对表头进行显示隐藏勾选，再刷新页面依然保留当前筛选状态。

<pre class="layui-code" lay-options="{preview: true, codeStyle: 'height: 508px;', layout: ['preview', 'code'], tools: ['full'], toolsEvent: function(oi, type){
  if(type === 'full'){
    layui.table.resize('ID-table-demo-filter');
  }
}}">
  <textarea>
{{- d.include("/table/examples/filter.md") }}
  </textarea>
</pre>

<h3 id="demo-setRowChecked" lay-toc="{level: 2, hot: true}" class="ws-bold">选中行操作</h3>

点击行任意处，通过行事件中执行相关选中方法，实现对整行的状态选中。*如下以「单选」行为例：*

<pre class="layui-code" lay-options="{preview: true, codeStyle: 'height: 508px;', layout: ['preview', 'code'], tools: ['full'], toolsEvent: function(oi, type){
  if(type === 'full'){
    layui.table.resize('ID-table-demo-setRowChecked');
  }
}}">
  <textarea>
{{- d.include("/table/examples/setRowChecked.md") }}
  </textarea>
</pre>

<h3 id="demo-theads" lay-toc="{level: 2}" class="ws-bold">多级表头</h3>

<pre class="layui-code" lay-options="{preview: true, codeStyle: 'height: 508px;', layout: ['preview', 'code'], tools: ['full'], done: function(obj){
  layui.table.init(obj.container.children('table'));
}, toolsEvent: function(oi, type){
  if(type === 'full'){
    layui.table.resize('ID-table-demo-theads-1');
    layui.table.resize('ID-table-demo-theads-2');
  }
}}">
  <textarea>
{{- d.include("/table/examples/theads.md") }}
  </textarea>
</pre>


<h3 id="more-examples" class="ws-anchor ws-bold">更多示例</h3>

> - 🎉 不定期分享在 [Gitee Issues](https://gitee.com/layui/layui/issues)
