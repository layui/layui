<div class="lay-form">
  <div class="lay-form-item">
    <div class="lay-inline">
      <input type="text" class="lay-input demo-laydate-item" lay-options="{}" placeholder="yyyy-MM-dd">
    </div>
    <div class="lay-inline">
      <input type="text" class="lay-input demo-laydate-item" lay-options="{}" placeholder="yyyy-MM-dd">
    </div>
    <div class="lay-inline">
      <input type="text" class="lay-input demo-laydate-item" lay-options="{}" placeholder="yyyy-MM-dd">
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
