<table class="layui-hide" id="ID-table-onrowContextmenu"></table>

<!-- import layui -->
<script>
layui.use(['table', 'dropdown', 'util'], function(){
  var table = layui.table;
  var dropdown = layui.dropdown;
  var util = layui.util;
   
  // 渲染
  table.render({
    elem: '#ID-table-onrowContextmenu',
    defaultContextmenu: false, // 是否在 table 行中允许默认的右键菜单
    url: '/static/2.8/json/table/user.json', // 此处为静态模拟数据，实际使用时需换成真实接口
    page: true,
    cols: [[
      {field:'id', title:'ID', width:80, fixed: 'left', unresize: true},
      {field:'username', title:'用户', width:120},
      {field:'sex', title:'性别', width:80},
      {field:'city', title:'城市', width:100},
      {field:'sign', title:'签名'},
      {field:'experience', title:'积分', width:80, sort: true}
    ]],
  });
   
  // 行单击事件
  table.on('rowContextmenu(ID-table-onrowContextmenu)', function(obj){
    var data = obj.data; // 得到当前行数据
    var index = obj.index; // 得到当前行索引
    var tr = obj.tr; // 得到当前行 <tr> 元素的 jQuery 对象
    var options = obj.config; // 获取当前表格基础属性配置项
    // console.log(obj); // 查看对象所有成员
    
    // 右键操作
    dropdown.render({
      trigger: 'contextmenu',
      show: true,
      data: [
        {title: 'Menu item 1', id: 'AAA'},
        {title: 'Menu item 2', id: 'BBB'}
      ],
      click: function(menuData, othis) {
        // 显示选中的相关数据 - 仅用于演示
        layer.alert(util.escape(JSON.stringify({
          dropdown: menuData,
          table: obj.data
        })));
      }
    });
    
    // obj.del() // 删除当前行
    // obj.update(fields, related);  // 修改行数据
    obj.setRowChecked({selectedStyle: true}); // 标注行选中状态样式
  });
});
</script>