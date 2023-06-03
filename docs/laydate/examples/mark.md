<div class="layui-form">
  <div class="layui-form-item">
    <div class="layui-inline">
      <label class="layui-form-label">开启公历节日</label>
      <div class="layui-input-inline">
        <input type="text" class="layui-input" id="ID-laydate-calendar" placeholder="yyyy-MM-dd">
      </div>
    </div>
    <div class="layui-inline">
      <label class="layui-form-label">自定义日子</label>
      <div class="layui-input-inline">
        <input type="text" class="layui-input" id="ID-laydate-mark" placeholder="yyyy-MM-dd">
      </div>
    </div>
    <div class="layui-inline">
      <label class="layui-form-label">节假日标注</label>
      <div class="layui-input-inline">
        <input type="text" class="layui-input" id="ID-laydate-holidays" placeholder="yyyy-MM-dd">
      </div>
    </div>
  </div>
</div>

<!-- import layui --> 
<script>
layui.use(function(){
  var laydate = layui.laydate;

  // 渲染
  //开启公历节日
  laydate.render({
    elem: '#ID-laydate-calendar',
    calendar: true
  });
  
  //自定义重要日子
  laydate.render({
    elem: '#ID-laydate-mark',
    mark: {
      '0-10-14': '生日',
      '0-12-31': '跨年', //每年的日期
      '0-0-10': '工资', //每月某天
      '0-0-15': '月中',
      '2017-8-15': '', //如果为空字符，则默认显示数字+徽章
      '2099-10-14': '呵呵'
    },
    done: function(value, date){
      // 点击每年的 10月14日，弹出提示语
      if(date.month === 10 && date.date === 14){ 
        layer.msg('这一天是：Layui 的生日');
      }
    }
  });
 
  // 节假日和补班日标注
  laydate.render({
    elem: '#ID-laydate-holidays',
    value: '2023-05-08',
    holidays: [ // v2.7.3 新增
      ['2022-12-31', '2023-1-1', '2023-1-2', '2023-1-21', '2023-1-22', '2023-1-23', '2023-1-24', '2023-1-25', '2023-1-26', '2023-1-27', '2023-4-5', '2023-4-29', '2023-4-30', '2023-5-1', '2023-5-2', '2023-5-3', '2023-6-22', '2023-6-23', '2023-6-24', '2023-9-29', '2023-9-30', '2023-10-1', '2023-10-2', '2023-10-3', '2023-10-4', '2023-10-5', '2023-10-6'],
      // 2023 年的补班日
      ['2023-1-28', '2023-1-29', '2023-4-23', '2023-5-6', '2023-6-25', '2023-10-7', '2023-10-8']
    ]
  });
});
</script>