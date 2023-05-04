<div class="layui-form">
  <div class="layui-form-item">
    <div class="layui-inline">
      <label class="layui-form-label">限定可选日期</label>
      <div class="layui-input-inline">
        <input type="text" class="layui-input" id="ID-laydate-limit-1" placeholder="yyyy-MM-dd">
      </div>
    </div>
    <div class="layui-inline">
      <label class="layui-form-label">前后若干天可选</label>
      <div class="layui-input-inline">
        <input type="text" class="layui-input" id="ID-laydate-limit-2" placeholder="yyyy-MM-dd">
      </div>
    </div>
    <div class="layui-inline">
      <label class="layui-form-label">限定可选时间</label>
      <div class="layui-input-inline">
        <input type="text" class="layui-input" id="ID-laydate-limit-3" placeholder="HH:mm:ss">
      </div>
      <div class="layui-form-mid layui-word-aux">
        这里以控制在 9:30-17:30 为例
      </div>
    </div>
  </div>
</div>

<!-- import layui --> 
<script>
layui.use(function(){
  var laydate = layui.laydate;

  // 限定可选日期
  var ins22 = laydate.render({
    elem: '#ID-laydate-limit-1',
    min: '2016-10-14',
    max: '2080-10-14',
    ready: function(){
      ins22.hint('日期可选值设定在 <br> 2016-10-14 到 2080-10-14');
    }
  });
  
  // 前后若干天可选，这里以前后 7 天为例
  laydate.render({
    elem: '#ID-laydate-limit-2',
    min: -7,
    max: 7
  });
  
  // 限定可选时间
  laydate.render({
    elem: '#ID-laydate-limit-3',
    type: 'time',
    min: '09:30:00',
    max: '17:30:00',
    btns: ['clear', 'confirm']
  });
});
</script>