<h3 lay-toc="{id: 'examples', level: 2}" class="layui-hide">滚动加载</h3>

<pre class="layui-code" lay-options="{preview: true, text: {preview: '滚动加载'}, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<div class="flow-demo" id="ID-flow-demo"></div>

<!-- import layui --> 
<script>
layui.use(function(){
  var flow = layui.flow;

  // 流加载实例
  flow.load({
    elem: '#ID-flow-demo', // 流加载容器
    scrollElem: '#ID-flow-demo', // 滚动条所在元素，一般不用填，此处只是演示需要。
    done: function(page, next){ // 执行下一页的回调
      // 模拟数据插入
      setTimeout(function(){
        var lis = [];
        for(var i = 0; i < 8; i++){
          lis.push('<li>'+ ( (page-1)*8 + i + 1 ) +'</li>')
        }
        
        // 执行下一页渲染，第二参数为：满足“加载更多”的条件，即后面仍有分页
        // pages 为 Ajax返回的总页数，只有当前页小于总页数的情况下，才会继续出现加载更多
        next(lis.join(''), page < 10); // 此处假设总页数为 10
      }, 520);
    }
  });
});
</script>
  </textarea>
</pre>

<h3 id="demo-manual-load" lay-toc="{level: 2}">手动加载</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<div class="flow-demo" id="ID-flow-demo-manual"></div>

<!-- import layui --> 
<script>
layui.use(function(){
  var flow = layui.flow;
  // 流加载实例
  flow.load({
    elem: '#ID-flow-demo-manual', // 流加载容器
    scrollElem: '#ID-flow-demo-manual', // 滚动条所在元素，一般不用填，此处只是演示需要。
    isAuto: false,
    isLazyimg: true,
    done: function(page, next){ // 加载下一页
      // 模拟插入
      setTimeout(function(){
        var lis = [];
        for(var i = 0; i < 6; i++){
          lis.push('<li><img lay-src="https://unpkg.com/outeres@0.0.11/demo/wallpaper.jpg?v='+ ( (page-1)*6 + i + 1 ) +'"></li>')
        }
        next(lis.join(''), page < 6); // 假设总页数为 6
      }, 520);
    }
  });
});
</script>
  </textarea>
</pre>