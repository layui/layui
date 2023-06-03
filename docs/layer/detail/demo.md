<h2 lay-toc="{id: 'examples', level: 2, hot: true}" class="layui-hide">在线测试</h2>

<pre class="layui-code" lay-options="{preview: true, text: {preview: '在线测试'}, layout: ['preview']}">
  <textarea>
{{- d.include("/layer/detail/run.md") }}
  </textarea>
</pre>

<h3 id="type" lay-toc="{level: 2, hot: true}">弹层类型</h3>

<pre class="layui-code" lay-options="{preview: true, codeStyle: 'height: 535px;', text: {preview: '弹层类型'}, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
{{- d.include("/layer/examples/type.md") }}
  </textarea>
</pre>

<h3 id="demo-alert" lay-toc="{level: 3}">信息框</h3>

信息框即 `dialog` 类型层，对应默认的 `type: 0`，该类型的弹层同时只能存在一个。更多说明详见：[#type](#options)

<pre class="layui-code" lay-options="{preview: true, codeStyle: 'height: 535px;', layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
{{- d.include("/layer/examples/alert.md") }}
  </textarea>
</pre>

<h3 id="demo-page" lay-toc="{level: 3}">页面层</h3>

<pre class="layui-code" lay-options="{preview: true, codeStyle: 'height: 535px;', layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
{{- d.include("/layer/examples/page.md") }}
  </textarea>
</pre>

<h3 id="demo-iframe" lay-toc="{level: 3}">iframe 层</h3>

<pre class="layui-code" lay-options="{preview: true, codeStyle: 'height: 535px;', layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
{{- d.include("/layer/examples/iframe.md") }}
  </textarea>
</pre>

<h3 id="demo-load" lay-toc="{level: 3}">加载层</h3>

为了不影响继续体验，以下每个 loading 示例均会在 3 秒后自动模拟关闭

<pre class="layui-code" lay-options="{preview: true, codeStyle: 'height: 535px;', layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
{{- d.include("/layer/examples/load.md") }}
  </textarea>
</pre>

<h3 id="demo-tips" lay-toc="{level: 3}">Tips 层</h3>

<pre class="layui-code" lay-options="{preview: true, codeStyle: 'height: 535px;', layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
{{- d.include("/layer/examples/tips.md") }}
  </textarea>
</pre>

<h3 id="demo-other" lay-toc="{level: 3}">其他层</h3>

<pre class="layui-code" lay-options="{preview: true, codeStyle: 'height: 535px;', layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
{{- d.include("/layer/examples/other.md") }}
  </textarea>
</pre>

<h3 id="demo-more" lay-toc="{level: 2, hot: true}">更多演示</h3>

<pre class="layui-code" lay-options="{preview: true, text: {preview: '弹出位置'}, codeStyle: 'height: 535px;', layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
{{- d.include("/layer/examples/offset.md") }}
  </textarea>
</pre>

<pre class="layui-code" lay-options="{preview: true, text: {preview: '弹出方向 <sup>2.8+</sup>'}, codeStyle: 'height: 535px;', layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
{{- d.include("/layer/examples/direction.md") }}
  </textarea>
</pre>

<pre class="layui-code" lay-options="{preview: true, text: {preview: '其他演示'}, codeStyle: 'height: 535px;', layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
{{- d.include("/layer/examples/more.md") }}
  </textarea>
</pre>


<h3 id="demo-skin" lay-toc="{level: 2, hot: true}">主题风格</h3>

<pre class="layui-code" lay-options="{preview: true, codeStyle: 'height: 535px;', layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
{{- d.include("/layer/examples/skin.md") }}
</script>
  </textarea>
</pre>

### 小贴士

> 事实上 layer 丰富的基础属性，可足够让您的弹出层变得千变万化，为了避免占用太多篇幅，就不做过多演示了。