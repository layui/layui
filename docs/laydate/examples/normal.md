<div class="layui-form">
  <div class="layui-form-item">
    <div class="layui-inline">
      <label class="layui-form-label">中文版</label>
      <div class="layui-input-inline">
        <input type="text" class="layui-input" id="ID-laydate-demo" placeholder="yyyy-MM-dd">
      </div>
    </div>
    <div class="layui-inline">
      <label class="layui-form-label">国际版</label>
      <div class="layui-input-inline">
        <input type="text" class="layui-input" id="ID-laydate-demo-en" placeholder="yyyy-MM-dd">
      </div>
    </div>
  </div>
</div>

<!-- import layui --> 
<script>
layui.use(function(){
  var laydate = layui.laydate;

  // 渲染
  laydate.render({
    elem: '#ID-laydate-demo'
  });
  // 英文版
  laydate.render({
    elem: '#ID-laydate-demo-en',
    lang: 'en'
  });
});
</script>