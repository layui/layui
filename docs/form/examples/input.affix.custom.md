<div class="layui-form">
  <div class="layui-input-wrap">
    <input type="text" lay-affix="location" lay-filter="location" placeholder="位置" class="layui-input">
  </div>
  <hr class="ws-space-16">
  <div class="layui-input-wrap">
    <input type="text" lay-affix="search" lay-filter="search" lay-options="{split: true}" placeholder="搜索…" class="layui-input">
  </div>
</div>

<!-- import layui --> 
<script>
layui.use(function(){
  var form = layui.form;

  // 输入框点缀事件 - 位置示例
  form.on('input-affix(location)', function(data){
    var elem = data.elem; // 输入框

    // do something
    layer.msg('模拟获取位置中…', {icon: 16, time: 1.5*1000}, function(){
      elem.value = '浙江杭州'; // 向输入框赋值
    })
  });

  // 输入框点缀事件 - 搜索示例
  form.on('input-affix(search)', function(data){
    var elem = data.elem; // 输入框
    var value = elem.value; // 输入框的值

    if(!value){
      layer.msg('请输入搜索内容');
      return elem.focus()
    };

    // 模拟搜索跳转
    location.href = '?keywords='+ value + '&_'+ new Date().getTime() +'#affix-custom';
  });
});
</script>