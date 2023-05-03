<div class="layui-form">
  <div class="layui-form-item">
    <div class="layui-inline">
      <label class="layui-form-label">请选择日期</label>
      <div class="layui-input-inline">
        <input type="text" class="layui-input" id="ID-laydate-format-1" placeholder="yyyy年MM月dd日">
      </div>
    </div>
    <div class="layui-inline">
      <label class="layui-form-label">请选择日期</label>
      <div class="layui-input-inline">
        <input type="text" class="layui-input" id="ID-laydate-format-2" placeholder="dd/MM/yyyy">
      </div>
    </div>
    <div class="layui-inline">
      <label class="layui-form-label">请选择月份</label>
      <div class="layui-input-inline">
        <input type="text" class="layui-input" id="ID-laydate-format-3" placeholder="yyyyMMdd">
      </div>
    </div>
    <div class="layui-inline">
      <label class="layui-form-label">请选择时间</label>
      <div class="layui-input-inline">
        <input type="text" class="layui-input" id="ID-laydate-format-4" placeholder="H点m分">
      </div>
    </div>
    <div class="layui-inline">
      <label class="layui-form-label">请选择范围</label>
      <div class="layui-input-inline">
        <input type="text" class="layui-input" id="ID-laydate-format-5" placeholder=" ~ ">
      </div>
    </div>
    <div class="layui-inline">
      <label class="layui-form-label">请选择范围</label>
      <div class="layui-input-inline">
        <input type="text" class="layui-input" id="ID-laydate-format-6" placeholder="开始 到 结束">
      </div>
    </div>
  </div>
</div>

<!-- import layui --> 
<script>
layui.use(function(){
  var laydate = layui.laydate;

  // 自定义格式
  laydate.render({
    elem: '#ID-laydate-format-1',
    format: 'yyyy年MM月dd日'
  });
  laydate.render({
    elem: '#ID-laydate-format-2',
    format: 'dd/MM/yyyy'
  });
  laydate.render({
    elem: '#ID-laydate-format-3',
    format: 'yyyyMMdd'
  });
  laydate.render({
    elem: '#ID-laydate-format-4',
    type: 'time',
    format: 'H点m分'
  });
  laydate.render({
    elem: '#ID-laydate-format-5',
    type: 'month',
    range: '~',
    format: 'yyyy-MM'
  });
  laydate.render({
    elem: '#ID-laydate-format-6',
    type: 'datetime',
    range: '到',
    format: 'yyyy年M月d日H时m分s秒'
  });
});
</script>