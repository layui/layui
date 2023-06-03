> 假设这是一段数据源：<a href="/static/2.8/json/table/demo3.json" target="_blank">/static/2.8/json/table/demo3.json</a><br>
  尽管它并不符合 table 组件默认规定的数据格式（[#详见](#options-async-data)），但可以通过 parseData 回调将其进行转换。

<table class="layui-hide" id="ID-table-demo-parse"></table>

<!-- import layui -->
<script>
layui.use('table', function(){
  var table = layui.table;
  
  // 渲染
  table.render({
    elem: '#ID-table-demo-parse',
    url:'/static/2.8/json/table/demo3.json',
    page: true,
    response: {
      statusCode: 200 // 重新规定成功的状态码为 200，table 组件默认为 0
    },
    // 将原始数据解析成 table 组件所规定的数据格式
    parseData: function(res){
      return {
        "code": res.status, //解析接口状态
        "msg": res.message, //解析提示文本
        "count": res.total, //解析数据长度
        "data": res.rows.item //解析数据列表
      };
    },
    cols: [[
      {field:'id', title:'ID', width:80, fixed: 'left', unresize: true, sort: true},
      {field:'username', title:'用户名', width:120},
      {field:'email', title:'邮箱', width:150},
      {field:'experience', title:'积分', width:100, sort: true},
      {field:'sex', title:'性别', width:80, sort: true},
      {field:'sign', title:'签名'},
      {field:'joinTime', title:'加入时间', width:120}
    ]],
    height: 315
  });
});
</script>
