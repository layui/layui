<h3 id="examples" lay-toc="{level: 2, hot: true, id: 'examples'}" class="lay-hide">综合演示</h3>

<pre class="lay-code" lay-options="{preview: true, codeStyle: 'height: 535px;', text: {preview: '综合演示'}, layout: ['preview', 'code'], tools: ['full'], done: function(obj){
  layui.table.resize('ID-treeTable-demo');
}, toolsEvent: function(obj){
  if(obj.type === 'full'){
    layui.table.resize('ID-treeTable-demo');
  }
}}">
  <textarea>
{{- d.include("/treeTable/examples/demo.md") }}
  </textarea>
</pre>





