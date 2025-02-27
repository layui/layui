<pre class="layui-code" lay-options="{preview: true, text: {preview: '动态操作'}, layout: ['preview', 'code'], tools: ['full'], done: function(obj){
  obj.render();
}}">
  <textarea>
{{- d.include("/tabs/examples/demo.md") }}
  </textarea>
</pre>

<h3 id="demo-method" class="ws-anchor ws-bold">方法渲染</h3>

即通过方法设置 tabs 标签，而非默认的自动渲染页面中的 `class="layui-tabs"` 的容器模板。

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
{{- d.include("/tabs/examples/method.md") }}
  </textarea>
</pre>

<h3 id="demo-card" class="ws-anchor ws-bold">卡片风格</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
{{- d.include("/tabs/examples/card.md") }}
  </textarea>
</pre>

<h3 id="demo-hash" class="ws-anchor ws-bold">HASH 状态匹配</h3>

切换 tabs 标签项后，地址栏同步 `hash` 值，当页面刷新时，tabs 仍保持对应的切换状态。

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
{{- d.include("/tabs/examples/hash.md") }}
  </textarea>
</pre>

<h3 id="demo-nest" class="ws-anchor ws-bold">标签嵌套</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
{{- d.include("/tabs/examples/nest.md") }}
  </textarea>
</pre>

<h3 id="demo-custom" class="ws-anchor ws-bold">给任意元素添加 Tab 功能</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
{{- d.include("/tabs/examples/custom.md") }}
  </textarea>
</pre>
