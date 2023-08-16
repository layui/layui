<table class="layui-hide" id="ID-table-demo-editmodes"></table>
{{!<!-- 原生 select 模板（推荐） -->
<script type="text/html" id="TPL-select-primary">
  {{# var cityList = d.cityList || ["北京","上海","广州","城市-1"]; }}
  <select name="city" class="layui-border select-demo-primary" lay-ignore>
    <option value="">原生 select</option>
    {{# layui.each(cityList, function(i, v){ }}
    <option value="{{= v }}" {{= v === d.city ? 'selected' : '' }}>{{= v }}</option>
    {{# }); }}
  </select> 
</script>
<!-- layui select 在 table 中使用（不推荐。因为当 select 出现在 table 底部时，可能会撑起多余高度） -->
<script type="text/html" id="TPL-select-city">
  {{# var cityList = d.cityList || ["北京","上海","广州","城市-1"]; }}
  <select name="city" lay-filter="select-demo">
    <option value="">select 方式</option>
    {{# layui.each(cityList, function(i, v){ }}
    <option value="{{= v }}" {{= v === d.city ? 'selected' : '' }}>{{= v }}</option>
    {{# }); }}
  </select> 
</script>
<!-- 推荐 -->
<script type="text/html" id="TPL-dropdpwn-demo">
  <button class="layui-btn layui-btn-primary dropdpwn-demo">
    <span>{{= d.sex || '保密' }}</span>
    <i class="layui-icon layui-icon-down layui-font-12"></i>
  </button>
</script>
<!-- laydate -->
<script type="text/html" id="TPL-laydate-demo">
  <input class="layui-input laydate-demo" placeholder="选择日期" value="{{= d.fieldname3 || '' }}">
</script>
<!-- colorpicker -->
<script type="text/html" id="TPL-colorpicker-demo">
  {{# var color = d.color || ['#16baaa','#16b777','#1E9FFF','#FF5722','#FFB800','#393D49'][Math.round(Math.random()*5)]; }}
  <div class="colorpicker-demo" lay-options="{color: '{{= color }}'}"></div>
</script>!}}

<!-- import layui -->
<script>
layui.use(function(){
  var $ = layui.$;
  var table = layui.table;
  var form = layui.form;
  var dropdown = layui.dropdown;
  var laydate = layui.laydate;
  var colorpicker = layui.colorpicker;
  
  // 渲染
  table.render({
    elem: '#ID-table-demo-editmodes',
    url: '/static/2.8/json/table/user.json', // 此处为静态模拟数据，实际使用时需换成真实接口
    page: true,
    css: [ // 设置单元格样式
      // 取消默认的溢出隐藏，并设置适当高度
      '.layui-table-cell{height: 50px; line-height: 40px;}',
      '.layui-table-cell .layui-colorpicker{width: 38px; height: 38px;}',
      '.layui-table-cell select{height: 36px; padding: 0 5px;}'
    ].join(''),
    cols: [[ // 表头
      {field: 'id', title: 'ID', width:80, align: 'center', fixed: 'left'},
      {field: 'city', title: '原生 select', width:135, unresize: true, templet: '#TPL-select-primary'}, 
      //{field: 'city', title: 'layui select', width:150, templet: '#TPL-select-city'}, 
      {field: 'sex', title: 'dropdown', width:115, unresize: true, align: 'center', templet: '#TPL-dropdpwn-demo'}, 
      {field: 'date', title: 'laydate', width:150, templet: '#TPL-laydate-demo'}, 
      {field: 'color', title: 'color', width:80, unresize: true, align: 'center', templet: '#TPL-colorpicker-demo'},
      {field: 'sign', title: '文本', edit: 'textarea'}
    ]],
    done: function(res, curr, count){
      var options = this;
      
      // 获取当前行数据
      table.getRowData = function(elem){
        var index = $(elem).closest('tr').data('index');
        return table.cache[options.id][index] || {};
      };
      
      // 原生 select 事件
      $('.select-demo-primary').on('change', function(){
        var value = this.value; // 获取选中项 value
        var data = table.getRowData(this); // 获取当前行数据(如 id 等字段，以作为数据修改的索引)

        // 更新数据中对应的字段
        data.city = value;

        // 显示 - 仅用于演示
        layer.msg('选中值: '+ value +'<br>当前行数据：'+ JSON.stringify(data));
      });
      
      // layui form select 事件
      form.on('select(select-demo)', function(obj){
        console.log(obj); // 获取选中项数据
        
        // 获取当前行数据(如 id 等字段，以作为数据修改的索引)
        var data = table.getRowData(obj.elem);

        // 更新数据中对应的字段
        data.city = value;
        console.log(data);
      });
      
      // dropdown 方式的下拉选择
      dropdown.render({
        elem: '.dropdpwn-demo',
        // trigger: 'hover',
        // 此处的 data 值，可根据 done 返回的 res 遍历来赋值
        data: [{
          title: '男',
          id: 100
        },{
          title: '女',
          id: 101
        },{
          title: '保密',
          id: 102
        }],
        click: function(obj){
          var data = table.getRowData(this.elem); // 获取当前行数据(如 id 等字段，以作为数据修改的索引)
          
          this.elem.find('span').html(obj.title);

          // 更新数据中对应的字段
          data.sex = obj.title;

          // 显示 - 仅用于演示
          layer.msg('选中值: '+ obj.title +'<br>当前行数据：'+ JSON.stringify(data));
        }
      });
      
      // laydate
      laydate.render({
        elem: '.laydate-demo',
        done: function(value, date, endDate){
          var data = table.getRowData(this.elem); // 获取当前行数据(如 id 等字段，以作为数据修改的索引)

          // 更新数据中对应的字段
          data.date = value;
          
          // 显示 - 仅用于演示
          layer.msg('选中值: '+ value +'<br>当前行数据：'+ JSON.stringify(data));
        }
      });
      
      // colorpicker
      colorpicker.render({
        elem: '.colorpicker-demo',
        done: function(value){
          var data = table.getRowData(this.elem); // 获取当前行数据(如 id 等字段，以作为数据修改的索引)

          // 更新数据中对应的字段
          data.color = value;
          
          // 显示 - 仅用于演示
          layer.msg('选中值: '+ value +'<br>当前行数据：'+ JSON.stringify(data));
        }
      });
      
      // 单元格普通编辑事件
      table.on('edit(ID-table-demo-editmodes)', function(obj){
        var value = obj.value // 得到修改后的值
        var data = obj.data // 得到所在行所有键值
        var field = obj.field; // 得到字段
        
        // 更新数据中对应的字段
        var update = {};
        update[field] = value;
        obj.update(update);
        
        // 编辑后续操作，如提交更新请求，以完成真实的数据更新
        // …
        
        // 显示 - 仅用于演示
        layer.msg('编辑值: '+ value +'<br>当前行数据：'+ JSON.stringify(data));
      });
      
      // 更多编辑方式……
    }
  });

});
</script>