<div class="layui-btn-container">
  <button type="button" class="layui-btn layui-btn-primary" lay-on="test-iframe-handle">
    iframe 的父子操作
    <span id="ID-test-iframe-mark"></span>
  </button>
  <button type="button" class="layui-btn layui-btn-primary" lay-on="test-iframe-video">弹出多媒体</button>
  <button type="button" class="layui-btn layui-btn-primary" lay-on="test-iframe-overflow">禁止 iframe 滚动条</button>
  <button type="button" class="layui-btn layui-btn-primary" lay-on="test-iframe-curl">弹出任意 URL 页面</button>
</div>

<!-- import layui --> 
<script>
layui.use(function(){
  var $ = layui.$;
  var layer = layui.layer;
  var util = layui.util;

  // 事件
  util.on('lay-on', {
    'test-iframe-handle': function(){
      layer.open({
        type: 2,
        area: ['680px', '520px'],
        content: '/layer/test/iframe.html',
        fixed: false, // 不固定
        maxmin: true,
        shadeClose: true,
        btn: ['获取表单值', '取消'],
        btnAlign: 'c',
        yes: function(index, layero){
          // 获取 iframe 的窗口对象
          var iframeWin =  window[layero.find('iframe')[0]['name']];
          var elemMark = iframeWin.$('#mark'); // 获得 iframe 中某个输入框元素
          var value = elemMark.val();
          
          if($.trim(value) === '') return elemMark.focus();

          // 显示获得的值
          layer.msg('获得 iframe 中的输入框标记值：'+ value);
        }
      });
    },
    'test-iframe-video': function(){
      layer.open({
        type: 2,
        title: false,
        area: ['630px', '360px'],
        shade: 0.8,
        closeBtn: 0,
        shadeClose: true,
        content: '//player.youku.com/embed/XMzI1NjQyMzkwNA==' // video 地址
      });
      layer.msg('点击遮罩区域可关闭');
    },
    'test-iframe-overflow': function(){
      layer.open({
        type: 2,
        area: ['360px', '500px'],
        skin: 'layui-layer-rim', // 加上边框
        content: ['/layer/test/1.html', 'no'] // 数组第二个成员设为 no 即屏蔽 iframe 滚动条
      });
    },
    'test-iframe-curl': function(){
      layer.open({
        type: 2,
        title: 'iframe 任意 URL',
        shadeClose: true,
        maxmin: true, //开启最大化最小化按钮
        area: ['900px', '600px'],
        content: 'https://cn.bing.com/'
      });
    }
  })
});
</script>