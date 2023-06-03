<h3 lay-toc="{level: 2, id: 'examples', hot: true}" class="layui-hide">图片上传</h3>

<pre class="layui-code" lay-options="{preview: true, codeStyle: 'height: 535px;', text: {preview: '图片上传'}, layout: ['preview', 'code'], tools: ['full'], done: function(obj){
  obj.render();
}}">
  <textarea>
{{- d.include("/upload/examples/image.md") }}
</script>
  </textarea>
</pre>

<h3 id="demo-files-table" lay-toc="{level: 2}">制作多文件上传表格</h3>

<pre class="layui-code" lay-options="{preview: true, codeStyle: 'height: 535px;', layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
{{- d.include("/upload/examples/files.table.md") }}
  </textarea>
</pre>


<h3 id="demo-accept" lay-toc="{level: 2}">过滤文件类型</h3>

<pre class="layui-code" lay-options="{preview: true, codeStyle: 'height: 535px;', layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
{{- d.include("/upload/examples/accept.md") }}
  </textarea>
</pre>


<h3 id="demo-size" lay-toc="{level: 2}">限制文件大小</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
{{- d.include("/upload/examples/size.md") }}
  </textarea>
</pre>

<h3 id="demo-auto" lay-toc="{level: 2}">选择后手动上传</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
{{- d.include("/upload/examples/auto.md") }}
  </textarea>
</pre>


<h3 id="demo-drag" lay-toc="{level: 2}">拖拽上传</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
{{- d.include("/upload/examples/drag.md") }}
  </textarea>
</pre>


<h3 id="demo-form-file" lay-toc="{level: 2}">绑定原始文件域</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
{{- d.include("/upload/examples/form.file.md") }}
  </textarea>
</pre>