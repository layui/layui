<table class="layui-hide" id="ID-table-demo-editable"></table>

<!-- import layui -->
<script>
layui.use(function(){
  var table = layui.table;
  var util = layui.util;

  // 根据返回数据中某个字段来判断开启该行的编辑
  var editable = function(d){
    if(d.editable) return 'text'; // 这里假设以 editable 字段为判断依据
  };

  // 创建表格实例
  table.render({
    elem: '#ID-table-demo-editable',
    url: '/static/2.8/json/table/edit.json', // 此处为静态模拟数据，实际使用时需换成真实接口
    page: true,
    //,editTrigger: 'dblclick' // 触发编辑的事件类型（默认 click ）。 v2.7.0 新增，之前版本固定为单击触发
    css: [
      // 对开启了编辑的单元格追加样式
      '.layui-table-view td[data-edit]{color: #16B777;}'
    ].join(''),
    cols: [[
      {checkbox: true, fixed: true},
      {field:'id', title: 'ID', width:80, sort: true, fixed: true},
      {field:'username', title: '用户名', width:80, edit: editable},
      {field:'sex', title: '性别', width:80, sort: true, edit: editable},
      {field:'city', title: '城市', width:80, edit: editable},
      {field:'sign', title: '签名', edit: editable},
      {field:'experience', title: '积分', sort: true, width:80, edit: editable}
    ]],
    height: 310
  });

  // 单元格编辑后的事件
  table.on('edit(ID-table-demo-editable)', function(obj){
    var field = obj.field; // 得到修改的字段
    var value = obj.value // 得到修改后的值
    var oldValue = obj.oldValue // 得到修改前的值 -- v2.8.0 新增
    var data = obj.data // 得到所在行所有键值
    var col = obj.getCol(); // 得到当前列的表头配置属性 -- v2.8.0 新增
    
    // 值的校验
    if(value.replace(/\s/g, '') === ''){
      layer.tips('值不能为空', this, {tips: 1});
      return obj.reedit(); // 重新编辑 -- v2.8.0 新增
    }

    // 编辑后续操作，如提交更新请求，以完成真实的数据更新
    // …
    
    // 显示 - 仅用于演示
    layer.msg('[ID: '+ data.id +'] ' + field + ' 字段更改值为：'+ util.escape(value));
  });

});
</script>