<div class="layui-form">
  <h5 style="margin-bottom: 16px;">
    左右面板<strong class="layui-font-red">独立</strong>选择模式（默认） :
  </h5>
  <div class="layui-form-item">
    <div class="layui-inline">
      <label class="layui-form-label">日期范围</label>
      <div class="layui-inline" id="ID-laydate-range">
        <div class="layui-input-inline">
          <input type="text" autocomplete="off" id="ID-laydate-start-date" class="layui-input" placeholder="开始日期">
        </div>
        <div class="layui-form-mid">-</div>
        <div class="layui-input-inline">
          <input type="text" autocomplete="off" id="ID-laydate-end-date" class="layui-input" placeholder="结束日期">
        </div>
      </div>
    </div>
  </div>
  <h5 style="margin-bottom: 16px;">
    左右面板<strong class="layui-font-red">联动</strong>选择模式 <sup>2.8+</sup> :
  </h5>
  <div class="layui-form-item">
    <div class="layui-inline">
      <label class="layui-form-label">日期范围</label>
      <div class="layui-inline" id="ID-laydate-rangeLinked">
        <div class="layui-input-inline">
          <input type="text" autocomplete="off" id="ID-laydate-start-date-1" class="layui-input" placeholder="开始日期">
        </div>
        <div class="layui-form-mid">-</div>
        <div class="layui-input-inline">
          <input type="text" autocomplete="off" id="ID-laydate-end-date-1" class="layui-input" placeholder="结束日期">
        </div>
      </div>
    </div>
  </div>
  <h5 style="margin-bottom: 16px;">其他类型的范围选择 :</h5>
  <div class="layui-form-item">
    <div class="layui-inline">
      <label class="layui-form-label">年范围</label>
      <div class="layui-input-inline">
        <input type="text" class="layui-input" id="ID-laydate-range-year" placeholder=" - ">
      </div>
    </div>
    <div class="layui-inline">
      <label class="layui-form-label">年月范围</label>
      <div class="layui-input-inline">
        <input type="text" class="layui-input" id="ID-laydate-range-month" placeholder=" - ">
      </div>
    </div>
    <div class="layui-inline">
      <label class="layui-form-label">时间范围</label>
      <div class="layui-input-inline">
        <input type="text" class="layui-input" id="ID-laydate-range-time" placeholder=" - ">
      </div>
    </div>
    <div class="layui-inline">
      <label class="layui-form-label">日期时间范围</label>
      <div class="layui-input-inline">
        <input type="text" class="layui-input" id="ID-laydate-range-datetime" placeholder=" - ">
      </div>
    </div>
  </div>
</div>

<!-- import layui --> 
<script>
layui.use(function(){
  var laydate = layui.laydate;

  // 日期范围 - 左右面板独立选择模式
  laydate.render({
    elem: '#ID-laydate-range',
    range: ['#ID-laydate-start-date', '#ID-laydate-end-date']
  });

  // 日期范围 - 左右面板联动选择模式
  laydate.render({
    elem: '#ID-laydate-rangeLinked',
    range: ['#ID-laydate-start-date-1', '#ID-laydate-end-date-1'],
    rangeLinked: true // 开启日期范围选择时的区间联动标注模式 ---  2.8+ 新增
  });
  
  // 年范围
  laydate.render({
    elem: '#ID-laydate-range-year',
    type: 'year',
    range: true
  });
  
  // 年月范围
  laydate.render({
    elem: '#ID-laydate-range-month',
    type: 'month',
    range: true
  });
  
  // 时间范围
  laydate.render({
    elem: '#ID-laydate-range-time',
    type: 'time',
    range: true
  });
  
  // 日期时间范围
  laydate.render({
    elem: '#ID-laydate-range-datetime',
    type: 'datetime',
    range: true
  });
});
</script>