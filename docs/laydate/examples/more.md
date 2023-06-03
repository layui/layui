<div class="layui-form">
  <div class="layui-form-item">
    <div class="layui-inline">
      <label class="layui-form-label">初始赋值</label>
      <div class="layui-input-inline">
        <input type="text" class="layui-input" id="ID-laydate-more-value" placeholder="yyyy-MM-dd">
      </div>
    </div>
    <div class="layui-inline">
      <label class="layui-form-label">选中后的回调</label>
      <div class="layui-input-inline">
        <input type="text" class="layui-input" id="ID-laydate-more-done" placeholder="yyyy-MM-dd">
      </div>
    </div>
    <div class="layui-inline">
      <label class="layui-form-label">日期切换的回调</label>
      <div class="layui-input-inline">
        <input type="text" class="layui-input" id="ID-laydate-more-change" placeholder="yyyy-MM-dd">
      </div>
    </div>
    <div class="layui-inline">
      <label class="layui-form-label">不出现底部栏</label>
      <div class="layui-input-inline">
        <input type="text" class="layui-input" id="ID-laydate-more-bottom" placeholder="yyyy-MM-dd">
      </div>
    </div>
    <div class="layui-inline">
      <label class="layui-form-label">只出现确定按钮</label>
      <div class="layui-input-inline">
        <input type="text" class="layui-input" id="ID-laydate-more-btns" placeholder="yyyy-MM-dd">
      </div>
    </div>
    <div class="layui-inline">
      <label class="layui-form-label">自定义事件</label>
      <div class="layui-input-inline">
        <input type="text" class="layui-input" id="ID-laydate-more-trigger" placeholder="yyyy-MM-dd">
      </div>
    </div>
    <div class="layui-inline">
      <label class="layui-form-label" id="ID-laydate-more-event-1">点我触发</label>
      <div class="layui-input-inline">
        <input type="text" class="layui-input" id="ID-laydate-more-event" placeholder="yyyy-MM-dd">
      </div>
    </div>
    <div class="layui-inline">
      <label class="layui-form-label" id="ID-laydate-more-dblclick">双击我触发</label>
      <div class="layui-input-inline">
        <input type="text" class="layui-input" id="ID-laydate-more-dblclick-input" placeholder="yyyy-MM-dd">
      </div>
    </div>
    <div class="layui-inline">
      <label class="layui-form-label">日期只读</label>
      <div class="layui-input-inline">
        <input type="text" class="layui-input" id="ID-laydate-more-readonly" readonly placeholder="yyyy-MM-dd">
      </div>
    </div>
    <div class="layui-inline">
      <label class="layui-form-label">非 input 元素</label>
      <div class="layui-input-inline">
        <div id="ID-laydate-more-div" style="height: 38px; line-height: 38px; cursor: pointer; border-bottom: 1px solid #e2e2e2;"></div>
      </div>
    </div>
    <div class="layui-inline">
      <label class="layui-form-label">开启遮罩</label>
      <div class="layui-input-inline">
        <input type="text" class="layui-input" id="ID-laydate-more-shade" readonly placeholder="yyyy-MM-dd">
      </div>
      <div class="layui-form-mid layui-text-em">
        <sup>2.8+</sup>
      </div>
    </div>
  </div>
</div>
<h5 style="margin-bottom: 15px; font-weight: 700;">
  覆盖实例与解除实例 <sup>2.8+</sup> : 
</h5>
<div class="layui-form">
  <div class="layui-form-item">
    <div class="layui-inline">
      <div class="layui-form-label" style="padding: 0; text-align: left;">
        <select lay-filter="filter-demo-laydate-reset">
          <option value="year">年份</option>
          <option value="month">月份</option>
          <option value="date" selected>日期</option>
          <option value="time">时间</option>
          <option value="other">解除</option>
        </select>
      </div>
      <div class="layui-input-inline">
        <input type="text" class="layui-input" id="ID-laydate-more-reset" autocomplete="off">
      </div>
    </div>
  </div>
</div>

<!-- import layui --> 
<script>
layui.use(function(){
  var laydate = layui.laydate;
  var form = layui.form;

  // 初始赋值
  laydate.render({
    elem: '#ID-laydate-more-value',
    value: '2016-10-14',
    isInitValue: true
  });
  
  // 选中后的回调
  laydate.render({
    elem: '#ID-laydate-more-done',
    done: function(value, date){
      layer.alert('你选择的日期是：' + value + '<br>获得的对象是' + JSON.stringify(date));
    }
  });
  
  // 日期切换的回调
  laydate.render({
    elem: '#ID-laydate-more-change',
    change: function(value, date){
      layer.msg('你选择的日期是：' + value + '<br><br>获得的对象是' + JSON.stringify(date));
    }
  });

  // 不出现底部栏
  laydate.render({
    elem: '#ID-laydate-more-bottom',
    showBottom: false
  });
  
  // 只出现确定按钮
  laydate.render({
    elem: '#ID-laydate-more-btns',
    btns: ['confirm']
  });
  
  // 自定义事件
  laydate.render({
    elem: '#ID-laydate-more-trigger',
    trigger: 'mousedown'
  });
  
  // 点我触发
  laydate.render({
    elem: '#ID-laydate-more-event',
    eventElem: '#ID-laydate-more-event-1',
    trigger: 'click'
  });
  
  // 双击我触发
  lay('#ID-laydate-more-dblclick').on('dblclick', function(){
    laydate.render({
      elem: '#ID-laydate-more-dblclick-input',
      show: true,
      closeStop: '#ID-laydate-more-dblclick',
    });
  });
  
  // 日期只读
  laydate.render({
    elem: '#ID-laydate-more-readonly',
    trigger: 'click',
  });
  
  // 非 input 元素
  laydate.render({
    elem: '#ID-laydate-more-div'
  });

  // 开启遮罩
  laydate.render({
    elem: '#ID-laydate-more-shade',
    triggdestroyer: 'click',
    shade: 0.8 // 遮罩透明度 --- 2.8+
  });

  // 覆盖实例与销毁实例
  var inst = laydate.render({
    elem: '#ID-laydate-more-reset'
  });
  form.on("select(filter-demo-laydate-reset)", function (obj) {
    var value = obj.value;
    var options = inst.config;
    var elem = options.elem[0];

    if (value === "other") {
      laydate.unbind(options.id); // 解绑实例 --- 2.8+
      elem.focus();
    } else {
      // 覆盖渲染
      laydate.render({
        elem: elem,
        type: value,
        show: true // 渲染即显示
      });
    }
  });
});
</script>