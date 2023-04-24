<div class="layui-form">
  <div class="layui-form-item">
    &lt;textarea class="layui-textarea ws-demo-editor" id="ID-demo-editor" &gt;
// 在此处输入 layer 的任意代码
layer.open({
  type: 1, // page 层类型
  area: ['500px', '300px'],
  title: 'Hello layer',
  shade: 0.6, // 遮罩透明度
  shadeClose: true, // 点击遮罩区域，关闭弹层
  maxmin: true, // 允许全屏最小化
  anim: 0, // 0-6 的动画形式，-1 不开启
  content: '<div style="padding: 32px;">一个普通的页面层，传入了自定义的 HTML</div>'
});&lt;/textarea&gt;
  </div>
  <div>
    <button type="button" class="layui-btn" id="ID-demo-run">运行效果</button>
  </div>
</div>

<script>
layui.use(function(){
  var $ = layui.$;
  var layer = layui.layer;

  $('#ID-demo-run').on('click', function(){
    var code = $('#ID-demo-editor').val();
    try {
      new Function(code)();
    } catch(e) {
      layer.alert('语句异常：'+ e.message, {icon: 2})
    }
  });
});
</script>