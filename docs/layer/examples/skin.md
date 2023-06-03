<div class="layui-btn-container">
  <button type="button" class="layui-btn layui-btn-primary" lay-on="test-skin-alert">
    墨绿与深蓝主题
  </button>
  <button type="button" class="layui-btn layui-btn-primary" lay-on="test-skin-win10">
    Windows 10 风格信息框 <span class="layui-badge-dot"></span>
  </button>
  <button type="button" class="layui-btn layui-btn-primary" lay-on="test-skin-win10-page">
    Win10 风格页面层 <span class="layui-badge-dot"></span>
  </button>
  <button type="button" class="layui-btn layui-btn-primary" lay-on="test-skin-custom">自定义任意主题</button>
</div>

<style>
/* 自定义其他任意主题  */
.class-layer-demo-custom .layui-layer-title{background-color: #EDEFF2;}
.class-layer-demo-custom .layui-layer-btn{padding: 5px 10px 10px;}
.class-layer-demo-custom .layui-layer-btn a{background: #fff; border-color: #E9E7E7; color: #333;}
.class-layer-demo-custom .layui-layer-btn .layui-layer-btn0{border-color: #FA584D; background-color: #FA584D; color: #fff;}
</style>

<!-- import layui --> 
<script>
layui.use(function(){
  var layer = layui.layer;
  var util = layui.util;

  // 事件
  util.on('lay-on', {
    'test-skin-alert': function(){
      layer.alert('墨绿风格，点击继续确认看深蓝', {
        skin: 'layui-layer-molv' // 样式类名
      }, function(){
        layer.alert('深蓝', {
          skin: 'layui-layer-lan'
        });
      });
    },
    'test-skin-win10': function(){
      layer.alert('Windows 10 风格主题', {
        skin: 'layui-layer-win10', // 2.8+
        shade: 0.01,
        btn: ['确定', '取消']
      })
    },
    'test-skin-win10-page': function(){
      // 此处以一个简单的 Win10 风格记事本为例
      layer.open({
        type: 1, // 页面层类型
        skin: 'layui-layer-win10', // 2.8+
        shade: 0.01,
        area: ['50%', '60%'],
        maxmin: true,
        title: '*无标题 - 记事本',
        content: [
          '<div style="padding: 0 8px; height: 20px; line-height: 20px; border-bottom: 1px solid #F0F0F0; box-sizing: border-box; font-size: 12px;">',
            // 自定义菜单，此处仅作样式演示，具体功能可自主实现
            [
              '<a href="javascript:;">文件(F)</a>',
              '<a href="javascript:;" >编辑(E)</a> ',
              '<a href="javascript:;" >格式(O)</a> ',
              '<a href="javascript:;" >查看(V)</a> ',
              '<a href="javascript:;" >帮助(H)</a> ',
            ].join('&nbsp;&nbsp;&nbsp;'),
          '</div>',
          '&lt;textarea style="position: absolute; top: 20px; width: 100%; height: calc(100% - 20px); padding: 6px; border: none; resize: none; overflow-y: scroll; box-sizing: border-box;">&lt;/textarea>'
        ].join('')
      });
    },
    'test-skin-custom': function(){
      layer.alert('自定义其他任意主题', {
        skin: 'class-layer-demo-custom'
      })
    }
  })
});
</script>