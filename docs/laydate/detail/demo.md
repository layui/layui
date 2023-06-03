<h3 lay-toc="{level: 2, id: 'examples'}" class="layui-hide">常规用法</h3>

<pre class="layui-code" lay-options="{preview: true, codeStyle: 'height: 535px;', text: {preview: '常规用法'}, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
{{- d.include("/laydate/examples/normal.md") }}
  </textarea>
</pre>

<h3 id="demo-type" lay-toc="{level: 2, hot: true}">多类型选择器</h3>

默认为日期选择器，即上文「常规用法」示例中的效果。以下主要呈现其他类型选择器：

<pre class="layui-code" lay-options="{preview: true, codeStyle: 'height: 535px;', layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
{{- d.include("/laydate/examples/type.md") }}
  </textarea>
</pre>

<h3 id="demo-range" lay-toc="{level: 2, hot: true}">范围选择</h3>

<pre class="layui-code" lay-options="{preview: true, codeStyle: 'height: 535px;', layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
{{- d.include("/laydate/examples/range.md") }}
  </textarea>
</pre>

<h3 id="demo-shortcut" lay-toc="{level: 2, hot: true}">配置快捷选项 <sup>2.8+</sup></h3>

<pre class="layui-code" lay-options="{preview: true, codeStyle: 'height: 535px;', layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
{{- d.include("/laydate/examples/shortcut.md") }}
  </textarea>
</pre>


<h3 id="demo-format" lay-toc="{level: 2}">自定义格式</h3>

<pre class="layui-code" lay-options="{preview: true, codeStyle: 'height: 535px;', layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
{{- d.include("/laydate/examples/format.md") }}
  </textarea>
</pre>


<h3 id="demo-mark" lay-toc="{level: 2}">节日及标注</h3>

<pre class="layui-code" lay-options="{preview: true, codeStyle: 'height: 535px;', layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
{{- d.include("/laydate/examples/mark.md") }}
  </textarea>
</pre>


<h3 id="demo-limit" lay-toc="{level: 2, hot: true}">限制可选日期</h3>

<pre class="layui-code" lay-options="{preview: true, codeStyle: 'height: 535px;', layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
{{- d.include("/laydate/examples/limit.md") }}
  </textarea>
</pre>


<h3 id="demo-elem" lay-toc="{level: 2}">批量绑定元素</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
{{- d.include("/laydate/examples/elem.md") }}
  </textarea>
</pre>


<h3 id="demo-more" lay-toc="{level: 2, hot: true}">更多功能示例</h3>

<pre class="layui-code" lay-options="{preview: true, codeStyle: 'height: 535px;', layout: ['preview', 'code'], tools: ['full'], done: function(obj){
  obj.render();
}}">
  <textarea>
{{- d.include("/laydate/examples/more.md") }}
  </textarea>
</pre>


<h3 id="demo-theme" lay-toc="{level: 2, hot: true}">自定义主题</h3>

<pre class="layui-code" lay-options="{preview: true, codeStyle: 'height: 535px;', layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
{{- d.include("/laydate/examples/theme.md") }}
  </textarea>
</pre>

<h3 id="demo-static" lay-toc="{level: 2}">直接静态显示</h3>

<pre class="layui-code" lay-options="{preview: true, codeStyle: 'height: 535px;', layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
{{- d.include("/laydate/examples/static.md") }}
  </textarea>
</pre>