<div class="layui-form">
  <div class="layui-form-item">
    <div class="layui-inline">
      <input type="text" class="layui-input demo-laydate-item" lay-options="{}" placeholder="yyyy-MM-dd">
    </div>
    <div class="layui-inline">
      <input type="text" class="layui-input demo-laydate-item" lay-options="{}" placeholder="yyyy-MM-dd">
    </div>
    <div class="layui-inline">
      <input type="text" class="layui-input demo-laydate-item" lay-options="{}" placeholder="yyyy-MM-dd">
    </div>
  </div>
</div>

<!-- import layui --> 
<script>
layui.use(function(){
  var laydate = layui.laydate;

  // 渲染
  laydate.render({
    elem: '.demo-laydate-item'
  });
});
</script>