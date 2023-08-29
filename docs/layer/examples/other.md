<div class="layui-btn-container">
  <button type="button" class="layui-btn layui-btn-primary" lay-on="test-tips-tab">tab 层</button>
  <button type="button" class="layui-btn layui-btn-primary" lay-on="test-tips-prompt-0">prompt - 单行文本框层</button>
  <button type="button" class="layui-btn layui-btn-primary" lay-on="test-tips-prompt-1">prompt - 密令输入框层</button>
  <button type="button" class="layui-btn layui-btn-primary" lay-on="test-tips-prompt-2">prompt - 多行文本框层</button>
  <button type="button" class="layui-btn layui-btn-primary" lay-on="test-tips-photos-one">photos - 单张图片层</button>
  <button type="button" class="layui-btn layui-btn-primary" lay-on="test-tips-photos">photos - 多张相册层</button>
</div>

<!-- import layui --> 
<script>
layui.use(function(){
  var layer = layui.layer;
  var util = layui.util;

  // 事件
  util.on('lay-on', {
    'test-tips-tab': function(){
      layer.tab({
        area: ['600px', '300px'],
        tab: [{
          title: 'Title 1', 
          content: '<div style="padding: 16px;">tabs content 111</div>'
        }, {
          title: 'Title 2', 
          content: '<div style="padding: 16px;">tabs content 222</div>'
        }, {
          title: 'Title 3', 
          content: '<div style="padding: 16px;">tabs content 333</div>'
        }],
        shadeClose: true
      });
    },
    'test-tips-prompt-0': function(){
      layer.prompt({title: '请输入文本'}, function(value, index, elem){
        if(value === '') return elem.focus();
        layer.msg('获得：'+ util.escape(value)); // 显示 value
        // 关闭 prompt
        layer.close(index);
      });
    },
    'test-tips-prompt-1': function(){
      layer.prompt({title: '请输入密令', formType: 1}, function(value, index, elem){
        if(value === '') return elem.focus();
        layer.msg('获得：'+ util.escape(value)); // 显示 value
        // 关闭 prompt
        layer.close(index);
      });
    },
    'test-tips-prompt-2': function(){
      layer.prompt({title: '请输入文本', formType: 2}, function(value, index, elem){
        if(value === '') return elem.focus();
        layer.msg('获得：'+ util.escape(value)); // 显示 value
        // 关闭 prompt
        layer.close(index);
      });
    },
    'test-tips-photos-one': function(){
      layer.photos({
        photos: {
          "title": "Photos Demo",
          "start": 0,
          "data": [
            {
              "alt": "浩瀚宇宙",
              "pid": 5,
              "src": "https://unpkg.com/outeres/demo/outer-space.jpg",
            }
          ]
        },
        footer: false // 是否显示底部栏 --- 2.8.16+
      });
    },
    'test-tips-photos': function(){
      layer.photos({
        photos: {
          "title": "Photos Demo",
          "start": 0,
          "data": [
            {
              "alt": "layer",
              "pid": 1,
              "src": "https://unpkg.com/outeres/demo/layer.png",
            },
            {
              "alt": "壁纸",
              "pid": 3,
              "src": "https://unpkg.com/outeres/demo/000.jpg",
            },
            {
              "alt": "浩瀚宇宙",
              "pid": 5,
              "src": "https://unpkg.com/outeres/demo/outer-space.jpg",
            }
          ]
        }
      });
    }
  })
});
</script>
