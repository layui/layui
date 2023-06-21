<table class="layui-hide" id="ID-table-demo-setRowChecked"></table>
<script type="text/html" id="demo-toolbar-setRowChecked">
  <div class="layui-btn-container">
    <button class="layui-btn layui-btn-sm" lay-event="getCheckData">获取选中行数据</button>
  </div>
</script>

<!-- import layui -->
<script>
layui.use('table', function(){
  var table = layui.table;
  
  // 渲染
  table.render({
    elem: '#ID-table-demo-setRowChecked',
    url: '/static/2.8/json/table/user.json', // 此处为静态模拟数据，实际使用时需换成真实接口
    page: true,
    cols: [[
      // {type: 'radio', fixed: 'left'},
      {field:'id', title:'ID', width:80, fixed: 'left', unresize: true},
      {field:'username', title:'用户', width:120},
      {field:'sex', title:'性别', width:80},
      {field:'city', title:'城市', width:100},
      {field:'sign', title:'签名'},
      {field:'experience', title:'积分', width:80, sort: true}
    ]],
    toolbar: '#demo-toolbar-setRowChecked',
    initSort: { // 设置初始排序
      field: 'experience', // 字段名
      type: 'desc' // 倒序
    },
    height: 366
  });
  
  // 行单击事件( 双击事件为: rowDouble )
  table.on('row(ID-table-demo-setRowChecked)', function(obj){
    var data = obj.data; // 获取当前行数据
    
    // 显示 - 仅用于演示
    layer.msg('当前行数据：<br>'+ JSON.stringify(data), {
      offset: '65px'
    });

    // 标注当前点击行的选中状态
    obj.setRowChecked({
      type: 'radio' // radio 单选模式；checkbox 复选模式
    });
  });

  // 头工具栏事件
  table.on('toolbar(ID-table-demo-setRowChecked)', function(obj){
    var checkStatus = table.checkStatus(obj.config.id); //获取选中行状态
    switch(obj.event){
      case 'getCheckData':
        var data = checkStatus.data;  // 获取选中行数据
        layer.alert(JSON.stringify(data));  // 显示 - 仅用于演示
      break;
    };
  });
});
</script>