<table class="layui-hide" id="ID-dropdown-demo-table"></table>

<script type="text/html" id="ID-dropdown-demo-table-tool">
  <a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="edit">编辑</a>
  <a class="layui-btn layui-btn-xs" lay-event="more">更多 <i class="layui-icon layui-icon-down"></i></a>
</script>

<!-- import layui --> 
<script>
layui.use(function(){
  var table = layui.table;
  var dropdown = layui.dropdown;
  
  // dropdown 在表格中的应用
  table.render({
    elem: '#ID-dropdown-demo-table',
    url: '/static/2.8/json/table/demo5.json',
    title: '用户数据表',
    cols: [[
      {type: 'checkbox', fixed: 'left'},
      {field:'id', title:'ID', width:80, fixed: 'left', unresize: true, sort: true},
      {field:'username', title:'用户名', width:120, edit: 'text'},
      {field:'email', title:'邮箱', minWidth:150},
      {fixed: 'right', title:'操作', toolbar: '#ID-dropdown-demo-table-tool', width:150}
    ]],
    limits: [3],
    page: true
  });

  // 行工具事件
  table.on('tool(ID-dropdown-demo-table)', function(obj){
    var that = this;
    var data = obj.data;
      
    if(obj.event === 'edit'){
      layer.prompt({
        formType: 2,
        value: data.email
      }, function(value, index){
        obj.update({
          email: value
        });
        layer.close(index);
      });
    } else if(obj.event === 'more'){
      // 更多下拉菜单
      dropdown.render({
        elem: that,
        show: true, // 外部事件触发即显示
        data: [{
          title: 'item 1',
          id: 'aaa'
        }, {
          title: 'item 2',
          id: 'bbb'
        }, {
          title: '删除',
          id: 'del'
        }],
        click: function(data, othis){
          //根据 id 做出不同操作
          if(data.id === 'del'){
            layer.confirm('真的删除行么', function(index){
              obj.del();
              layer.close(index);
            });
          } else {
            layer.msg('得到表格下拉菜单 id：'+ data.id);
          }
        },
        align: 'right', // 右对齐弹出
        style: 'box-shadow: 1px 1px 10px rgb(0 0 0 / 12%);' //设置额外样式
      }) 
    }
  });
});
</script>