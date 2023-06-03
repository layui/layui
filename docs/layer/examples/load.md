<div class="layui-btn-container">
  <button type="button" class="layui-btn layui-btn-primary" lay-on="test-load-1">风格1</button>
  <button type="button" class="layui-btn layui-btn-primary" lay-on="test-load-2">风格2</button>
  <button type="button" class="layui-btn layui-btn-primary" lay-on="test-load-3">风格3</button>
  <button type="button" class="layui-btn layui-btn-primary" lay-on="test-load-4">风格4</button>
</div>

<!-- import layui --> 
<script>
layui.use(function(){
  var layer = layui.layer;
  var util = layui.util;

  // 事件
  util.on('lay-on', {
    'test-load-1': function(){
      var loadIndex = layer.load(0);
      // 模拟关闭
      setTimeout(function(){
        layer.close(loadIndex)
      }, 3000);
    },
    'test-load-2': function(){
      var loadIndex = layer.load(1);
      // 模拟关闭
      setTimeout(function(){
        layer.close(loadIndex)
      }, 3000);
    },
    'test-load-3': function(){
      var loadIndex = layer.load(2);
      // 模拟关闭
      setTimeout(function(){
        layer.close(loadIndex)
      }, 3000);
    },
    'test-load-4': function(){
      var loadIndex = layer.msg('加载中', {
        icon: 16,
        shade: 0.01
      });;
      // 模拟关闭
      setTimeout(function(){
        layer.close(loadIndex)
      }, 3000);
    }
  })
});
</script>