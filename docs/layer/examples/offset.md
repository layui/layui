<div class="layui-btn-container">
  <button type="button" class="layui-btn layui-btn-primary" lay-on="test-offset" data-offset="t">上</button>
  <button type="button" class="layui-btn layui-btn-primary" lay-on="test-offset" data-offset="r">右</button>
  <button type="button" class="layui-btn layui-btn-primary" lay-on="test-offset" data-offset="b">下</button>
  <button type="button" class="layui-btn layui-btn-primary" lay-on="test-offset" data-offset="l">左</button>
  <button type="button" class="layui-btn layui-btn-primary" lay-on="test-offset" data-offset="rt">右上</button>
  <button type="button" class="layui-btn layui-btn-primary" lay-on="test-offset" data-offset="rb">右下</button>
  <button type="button" class="layui-btn layui-btn-primary" lay-on="test-offset" data-offset="lb">左下</button>
  <button type="button" class="layui-btn layui-btn-primary" lay-on="test-offset" data-offset="lt">左上</button>
  <button type="button" class="layui-btn layui-btn-primary" lay-on="test-offset" data-offset="auto">正中</button>
  <button type="button" class="layui-btn layui-btn-primary" lay-on="test-offset" data-offset="">任意</button>
</div>

<!-- import layui --> 
<script>
layui.use(function(){
  var layer = layui.layer;
  var util = layui.util;
  var $ = layui.$;

  // 事件
  util.on('lay-on', {
    'test-offset': function(){
      var othis = $(this);
      var offset = othis.data('offset');
      // 弹出位置
      layer.open({
        type: 1,
        offset: offset || ['200px', '280px'], // 详细可参考 offset 属性
        id: 'ID-demo-layer-offset-'+ offset, // 防止重复弹出
        content: '<div style="padding: 16px;">'+ othis.text() +'</div>',
        area: '240px',
        btn: '关闭全部',
        btnAlign: 'c', // 按钮居中
        shade: 0, // 不显示遮罩
        yes: function(){
          layer.closeAll();
        }
      });
    }
  });
});
</script>