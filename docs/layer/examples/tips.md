<div class="layui-btn-container">
  <button type="button" class="layui-btn layui-btn-primary" lay-on="test-tips-top">显示在上</button>
  <button type="button" class="layui-btn layui-btn-primary" lay-on="test-tips-right">显示在右</button>
  <button type="button" class="layui-btn layui-btn-primary" lay-on="test-tips-bottom">显示在下</button>
  <button type="button" class="layui-btn layui-btn-primary" lay-on="test-tips-left">显示在左</button>
  <button type="button" class="layui-btn layui-btn-primary" lay-on="test-tips-color">自定义背景色</button>
  <button type="button" class="layui-btn layui-btn-primary" lay-on="test-tips-more">允许多个 tips</button>
</div>

<!-- import layui --> 
<script>
layui.use(function(){
  var layer = layui.layer;
  var util = layui.util;

  // 事件
  util.on('lay-on', {
    'test-tips-top': function(){
      layer.tips('向上', this, {
        tips: 1
      });
    },
    'test-tips-right': function(){
      layer.tips('默认向右', this);
    },
    'test-tips-bottom': function(){
      layer.tips('向下', this, {
        tips: 3
      });
    },
    'test-tips-left': function(){
      layer.tips('向左', this, {
        tips: 4
      });
    },
    'test-tips-color': function(){
      layer.tips('可自定义任意主题色', this, {
        tips: [1, '#16b777']
      });
    },
    'test-tips-more': function(){
      layer.tips('不会关闭之前的 tips', this, {
        tipsMore: true
      });
    }
  })
});
</script>