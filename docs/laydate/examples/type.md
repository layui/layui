<div class="lay-form">
  <div class="lay-form-item">
    <div class="lay-inline">
      <label class="lay-form-label">年选择器</label>
      <div class="lay-input-inline">
        <input type="text" class="lay-input" id="ID-laydate-type-year" placeholder="yyyy">
      </div>
    </div>
    <div class="lay-inline">
      <label class="lay-form-label">年月选择器</label>
      <div class="lay-input-inline">
        <input type="text" class="lay-input" id="ID-laydate-type-month" placeholder="yyyy-MM">
      </div>
    </div>
    <div class="lay-inline">
      <label class="lay-form-label">时间选择器</label>
      <div class="lay-input-inline">
        <input type="text" class="lay-input" id="ID-laydate-type-time" placeholder="HH:mm:ss">
      </div>
    </div>
    <div class="lay-inline">
      <label class="lay-form-label">日期时间选择器</label>
      <div class="lay-input-inline">
        <input type="text" class="lay-input" id="ID-laydate-type-datetime" placeholder="yyyy-MM-dd HH:mm:ss">
      </div>
    </div>
  </div>
  <hr>
  <h5 style="margin-bottom: 16px;">
    同时显示日期和时间选择器（全面板） <sup>2.8+</sup> :
  </h5>
  <div class="lay-form-item">
    <div class="lay-inline">
      <label class="lay-form-label">日期时间选择器</label>
      <div class="lay-input-inline">
        <input type="text" class="lay-input" id="ID-laydate-type-datetime-1" placeholder="yyyy-MM-dd HH:mm:ss">
      </div>
    </div>
  </div>
</div>

<!-- import layui --> 
<script>
layui.use(function(){
  var laydate = layui.laydate;

  // 年选择器
  laydate.render({
    elem: '#ID-laydate-type-year',
    type: 'year'
  });
  
  // 年月选择器
  laydate.render({
    elem: '#ID-laydate-type-month',
    type: 'month'
  });
  
  // 时间选择器
  laydate.render({
    elem: '#ID-laydate-type-time',
    type: 'time'
  });
  
  // 日期时间选择器
  laydate.render({
    elem: '#ID-laydate-type-datetime',
    type: 'datetime'
  });

  // 日期时间选择器 - 日期和时间选择器同时显示（全面板）
  laydate.render({
    elem: '#ID-laydate-type-datetime-1',
    type: 'datetime',
    fullPanel: true // 2.8+
  });
});
</script>
