从页面四个边缘弹出（抽屉效果）：

<div class="layui-btn-container">
  <button type="button" class="layui-btn layui-btn-primary" lay-on="test-offset-t">从上往下</button>
  <button type="button" class="layui-btn layui-btn-primary" lay-on="test-offset-r">从右往左</button>
  <button type="button" class="layui-btn layui-btn-primary" lay-on="test-offset-b">从下往上</button>
  <button type="button" class="layui-btn layui-btn-primary" lay-on="test-offset-l">从左往右</button>
</div>

<!-- import layui --> 
<script>
layui.use(function(){
  var layer = layui.layer;
  var util = layui.util;
  var $ = layui.$;

  // 事件
  util.on('lay-on', {
    'test-offset-t': function(){
      layer.open({
        type: 1,
        offset: 't',
        anim: 'slideDown', // 从上往下
        area: ['100%', '160px'],
        shade: 0.1,
        shadeClose: true,
        id: 'ID-demo-layer-direction-t',
        content: '<div style="padding: 16px;">任意 HTML 内容</div>'
      });
    },
    'test-offset-r': function(){
      layer.open({
        type: 1,
        offset: 'r',
        anim: 'slideLeft', // 从右往左
        area: ['320px', '100%'],
        shade: 0.1,
        shadeClose: true,
        id: 'ID-demo-layer-direction-r',
        content: '<div style="padding: 16px;">任意 HTML 内容</div>'
      });
    },
    'test-offset-b': function(){
      layer.open({
        type: 1,
        offset: 'b',
        anim: 'slideUp', // 从下往上
        area: ['100%', '160px'],
        shade: 0.1,
        shadeClose: true,
        id: 'ID-demo-layer-direction-b',
        content: '<div style="padding: 16px;">任意 HTML 内容</div>'
      });
    },
    'test-offset-l': function(){
      layer.open({
        type: 1,
        offset: 'l',
        anim: 'slideRight', // 从左往右
        area: ['320px', '100%'],
        shade: 0.1,
        shadeClose: true,
        id: 'ID-demo-layer-direction-l',
        content: '<div style="padding: 16px;">任意 HTML 内容</div>'
      });
    }
  });
});
</script>