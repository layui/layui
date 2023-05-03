<pre class="layui-code" lay-options="{preview: true, text: {preview: '普通用法'}, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<div id="demo-laypage-normal-1"></div>
<div id="demo-laypage-normal-2"></div>

<!-- import layui -->
<script>
layui.use(function(){
  var laypage = layui.laypage;

  // 普通用法
  laypage.render({
    elem: 'demo-laypage-normal-1',
    count: 50 // 数据总数
  });
  laypage.render({
    elem: 'demo-laypage-normal-2',
    count: 100 // 数据总数
  });
});
</script>
  </textarea>
</pre>

<h3 id="demo-theme" class="ws-anchor ws-bold">自定义主题</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<div id="demo-laypage-theme-1"></div>
<div id="demo-laypage-theme-2"></div>
<div id="demo-laypage-theme-3"></div>

<!-- import layui -->
<script>
layui.use(function(){
  var laypage = layui.laypage;

  // 自定义主题
  laypage.render({
    elem: 'demo-laypage-theme-1',
    count: 100,
    theme: '#1E9FFF'
  });
  laypage.render({
    elem: 'demo-laypage-theme-2',
    count: 100,
    theme: '#FF5722'
  });
  laypage.render({
    elem: 'demo-laypage-theme-3',
    count: 100,
    theme: '#FFB800'
  });
});
</script>
  </textarea>
</pre>

<h3 id="demo-text" class="ws-anchor ws-bold">自定义文本</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<div id="demo-laypage-text"></div>

<!-- import layui -->
<script>
layui.use(function(){
  var laypage = layui.laypage;

  // 自定义文本
  laypage.render({
    elem: 'demo-laypage-text',
    count: 100,
    first: '首页',
    last: '尾页',
    prev: '<em>←</em>',
    next: '<em>→</em>'
  });
});
</script>
  </textarea>
</pre>

<h3 id="demo-pn-hide" class="ws-anchor ws-bold">不显示上一页、下一页</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<div id="demo-laypage-pn-hide"></div>

<!-- import layui -->
<script>
layui.use(function(){
  var laypage = layui.laypage;

  // 不显示上一页、下一页
  laypage.render({
    elem: 'demo-laypage-pn-hide',
    count: 100,
    prev: false,
    next: false
  });
});
</script>
  </textarea>
</pre>

<h3 id="demo-pn-show" class="ws-anchor ws-bold">只显示上一页、下一页、当前页</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<div id="demo-laypage-pn-show"></div>

<!-- import layui -->
<script>
layui.use(function(){
  var laypage = layui.laypage;
  var layer = layui.layer;

  // 只显示上一页、下一页、当前页
  laypage.render({
    elem: 'demo-laypage-pn-show',
    count: 50,
    groups: 1,
    first: false,
    last: false,
    layout: ['prev', 'page','next'],
    jump: function(obj, first){
      // 首次不执行
      if(!first){
        layer.msg('第 '+ obj.curr +' 页');
      }
    }
  });
});
</script>
  </textarea>
</pre>

<h3 id="demo-layout" class="ws-anchor ws-bold">自定义排版</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<div id="demo-laypage-layout-1"></div>
<div id="demo-laypage-layout-2"></div>
<div id="demo-laypage-layout-3"></div>

<!-- import layui -->
<script>
layui.use(function(){
  var laypage = layui.laypage;

  // 自定义排版
  laypage.render({
    elem: 'demo-laypage-layout-1',
    count: 1000,
    layout: ['limit', 'prev', 'page', 'next']
  });
  laypage.render({
    elem: 'demo-laypage-layout-2',
    count: 1000,
    layout: ['prev', 'next', 'page']
  });
  laypage.render({
    elem: 'demo-laypage-layout-3',
    count: 1000,
    layout: ['page', 'count']
  });
});
</script>
  </textarea>
</pre>

<h3 id="demo-limits" class="ws-anchor ws-bold">自定义每页条数的选择项</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<div id="demo-laypage-limits"></div>

<!-- import layui -->
<script>
layui.use(function(){
  var laypage = layui.laypage;

  // 自定义每页条数的选择项
  laypage.render({
    elem: 'demo-laypage-limits',
    count: 1000,
    limit: 100,
    limits: [100, 300, 500],
    layout: ['prev', 'page', 'next', 'limit']
  });
});
</script>
  </textarea>
</pre>

<h3 id="demo-all" class="ws-anchor ws-bold">完整显示</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<div id="demo-laypage-all"></div>

<!-- import layui -->
<script>
layui.use(function(){
  var laypage = layui.laypage;

  // 完整显示
  laypage.render({
    elem: 'demo-laypage-all', // 元素 id
    count: 100, // 数据总数
    layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'], // 功能布局
    jump: function(obj){
      console.log(obj);
    }
  });
});
</script>
  </textarea>
</pre>

<h3 id="demo-hash" class="ws-anchor ws-bold">高级 - 开启 HASH</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<div id="demo-laypage-hash"></div>

<!-- import layui -->
<script>
layui.use(function(){
  var laypage = layui.laypage;

  // 开启 HASH
  laypage.render({
    elem: 'demo-laypage-hash',
    count: 500,
    curr: location.hash.replace('#!curr=', ''), // 初始获取 hash 值为 curr 的当前页
    hash: 'curr' // 自定义 hash 名称
  });
});
</script>
  </textarea>
</pre>

<h3 id="demo-data" class="ws-anchor ws-bold">高级 - 将一段已知数组分页展示</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<div id="demo-laypage-data"></div>
<div id="demo-laypage-data-view"></div> 

<!-- import layui -->
<script>
layui.use(function(){
  var laypage = layui.laypage;

  // 将一段已知数组分页展示
  var data = ["北京","上海","广州","深圳","杭州","长沙","合肥","宁夏","成都","西安","南昌","上饶","沈阳","济南","厦门","福州","九江","宜春","赣州","宁波","绍兴","无锡","苏州","徐州","东莞","佛山","中山","成都","武汉","青岛","天津","重庆","南京","九江","香港","澳门","台北"]; // 测试数据

  laypage.render({
    elem: 'demo-laypage-data',
    count: data.length,
    jump: function(obj){
      // 模拟渲染
      document.getElementById('demo-laypage-data-view').innerHTML = function(){
        var arr = [];
        var thisData = data.concat().splice(obj.curr*obj.limit - obj.limit, obj.limit);
        layui.each(thisData, function(index, item){
          arr.push(item);
        });
        return arr.join('，');
      }();
    }
  });
});
</script>
  </textarea>
</pre>