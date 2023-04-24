<pre class="layui-code" lay-options="{preview: 'iframe', style: 'height: 315px;', layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>自定义固定条示例 - Layui</title>
  <meta name="renderer" content="webkit">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="{{= d.layui.cdn.css }}" rel="stylesheet">
</head>
<body>
<div id="target-test" style="position: relative; padding: 16px;">
  页<br>面<br>内<br>容<br>。<br>。<br>。<br>。<br>。<br>。<br>。<br>。<br>。<br>。<br>。<br>。<br>。<br>。<br>。<br>。<br>。<br>。<br>。<br>。<br>。<br>。<br>。<br>。<br>。<br>。<br>。<br>。<br>。<br>。<br>。<br>。<br>。<br>。<br>。<br>。<br>。<br>。<br>。<br>。<br>。<br>。<br>。<br>。
</div>

<script src="{{= d.layui.cdn.js }}"></script>
<script>
layui.use(function(){
  var util = layui.util;

  // 自定义固定条
  util.fixbar({
    bars: [{ // 定义可显示的 bar 列表信息 -- v2.8.0 新增
      type: 'share',
      icon: 'layui-icon-share'
    }, {
      type: 'help',
      icon: 'layui-icon-help'
    }, { 
      type: 'cart',
      icon: 'layui-icon-cart',
      style: 'background-color: #FF5722;'
    }, {
      type: 'groups',
      content: '群',
      style: 'font-size: 21px;'
    }],
    // bar1: true,
    // bar2: true,
    // default: false, // 是否显示默认的 bar 列表 --  v2.8.0 新增
    // bgcolor: '#393D52', // bar 的默认背景色
    // css: {right: 100, bottom: 100},
    // target: '#target-test', // 插入 fixbar 节点的目标元素选择器
    // duration: 300, // top bar 等动画时长（毫秒）
    on: { // 任意事件 --  v2.8.0 新增
      mouseenter: function(type){
        layer.tips(type, this, {
          tips: 4, 
          fixed: true
        });
      },
      mouseleave: function(type){
        layer.closeAll('tips');
      }
    },
    // 点击事件
    click: function(type){
      console.log(this, type);
      // layer.msg(type);
    }
  });
});
</script>
</body>
</html>
  </textarea>
</pre>