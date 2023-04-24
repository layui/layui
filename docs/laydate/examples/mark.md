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
      '0-10-14': '生日'
      ,'0-12-31': '跨年' //每年的日期
      ,'0-0-10': '工资' //每月某天
      ,'0-0-15': '月中'
      ,'2017-8-15': '' //如果为空字符，则默认显示数字+徽章
      ,'2099-10-14': '呵呵'
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
    value: '2022-5-21',
    holidays: [ // v2.7.3 新增
      // 2022 年的节假日，可参见国家每年公布的法定节假日安排
      ['2022-1-1', '2022-1-2', '2022-1-3', '2022-1-31', '2022-2-1', '2022-2-2', '2022-2-3', '2022-2-4', '2022-2-5', '2022-2-6', '2022-4-3', '2022-4-4', '2022-4-5', '2022-4-30', '2022-5-1', '2022-5-2', '2022-5-3', '2022-5-4', '2022-6-3', '2022-6-4', '2022-6-5', '2022-9-10', '2022-9-11', '2022-9-12', '2022-10-1', '2022-10-2', '2022-10-3', '2022-10-4', '2022-10-5', '2022-10-6', '2022-10-7'],
      // 2022 年的补班日
      ['2022-1-29', '2022-1-30', '2022-4-2', '2022-4-24', '2022-5-7',  '2022-10-8', '2022-10-9']
    ]
  });
});
</script>