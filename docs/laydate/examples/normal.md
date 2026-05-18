<div class="lay-form">
  <div class="lay-form-item">
    <div class="lay-inline">
      <label class="lay-form-label">中文版</label>
      <div class="lay-input-inline">
        <input type="text" class="lay-input" id="ID-laydate-demo" placeholder="yyyy-MM-dd">
      </div>
    </div>
    <div class="lay-inline">
      <label class="lay-form-label">国际版</label>
      <div class="lay-input-inline">
        <input type="text" class="lay-input" id="ID-laydate-demo-en" placeholder="yyyy-MM-dd">
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
