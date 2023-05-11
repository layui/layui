<h3 id="examples" lay-toc="{level: 2, hot: true, id: 'examples'}" class="layui-hide">综合演示</h3>

<pre class="layui-code" lay-options="{preview: true, codeStyle: 'height: 535px;', text: {preview: '综合演示'}, layout: ['preview', 'code'], tools: ['full'], done: function(obj){
  layui.table.resize('ID-treeTable-demo');
}, toolsEvent: function(oi, type){
  if(type === 'full'){
    layui.table.resize('ID-treeTable-demo');
  }
}}">
  <textarea>
{{- d.include("/treeTable/examples/demo.md") }}
  </textarea>
</pre>




