<h3 lay-toc="{level: 2, id: 'examples', hot: true}" class="layui-hide">动态操作</h3>

<pre class="layui-code" lay-options="{preview: true, text: {preview: '动态操作'}, layout: ['preview', 'code'], codeStyle: 'max-height: 520px;', tools: ['full'], done: function(obj){
  obj.render();
}}">
  <textarea>
{{- d.include("/tabs/examples/demo.md") }}
  </textarea>
</pre>

<h3 id="demo-method" lay-toc="{level: 2}">方法渲染</h3>

即通过方法设置 tabs 标签，而非默认的自动渲染页面中的 `class="layui-tabs"` 的容器模板。

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full'], codeStyle: 'max-height: 520px;'}">
  <textarea>
{{- d.include("/tabs/examples/method.md") }}
  </textarea>
</pre>

<h3 id="demo-card" lay-toc="{level: 2}">卡片风格</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], codeStyle: 'max-height: 520px;', tools: ['full'], done: function(obj){
  obj.render();
}}">
  <textarea>
{{- d.include("/tabs/examples/card.md") }}
  </textarea>
</pre>

<h3 id="demo-trigger" lay-toc="{level: 2}">自定义事件</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], codeStyle: 'max-height: 520px;', tools: ['full'], done: function(obj){
  obj.render();
}}">
  <textarea>
{{- d.include("/tabs/examples/trigger.md") }}
  </textarea>
</pre>

<h3 id="demo-shuffle" lay-toc="{level: 2}">打乱标签顺序</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], codeStyle: 'max-height: 520px;', tools: ['full'], done: function(obj){
  obj.render();
}}">
  <textarea>
{{- d.include("/tabs/examples/shuffle.md") }}
  </textarea>
</pre>

<h3 id="demo-hash" lay-toc="{level: 2, title: 'HASH 匹配'}">通过 HASH 匹配选中标签</h3>

切换 tabs 标签项后，地址栏同步 `hash` 值，当页面刷新时，tabs 仍保持对应的切换状态。

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], codeStyle: 'max-height: 520px;', tools: ['full'], done: function(obj){
  obj.render();
}}">
  <textarea>
{{- d.include("/tabs/examples/hash.md") }}
  </textarea>
</pre>

<h3 id="demo-nest" lay-toc="{level: 2}">标签嵌套</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], codeStyle: 'max-height: 520px;', tools: ['full'], done: function(obj){
  obj.render();
}}">
  <textarea>
{{- d.include("/tabs/examples/nest.md") }}
  </textarea>
</pre>

<h3 id="demo-custom" lay-toc="{level: 2, title: '自定义标签'}">给任意元素绑定 tabs 切换功能</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], codeStyle: 'max-height: 520px;', tools: ['full']}">
  <textarea>
{{- d.include("/tabs/examples/custom.md") }}
  </textarea>
</pre>
