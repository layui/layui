<form class="layui-form layui-row layui-col-space16">
  <div class="layui-col-md4">
    <div class="layui-input-wrap">
      <div class="layui-input-prefix">
        <i class="layui-icon layui-icon-username"></i>
      </div>
      <input type="text" name="A" value="" placeholder="Field A" class="layui-input" lay-affix="clear">
    </div>
  </div>
  <div class="layui-col-md4">
    <div class="layui-input-wrap">
      <input type="text" name="B" placeholder="Field B" lay-affix="clear" class="layui-input">
    </div>
  </div>
  <div class="layui-col-md4">
    <div class="layui-input-wrap">
      <div class="layui-input-prefix">
        <i class="layui-icon layui-icon-date"></i>
      </div>
      <input type="text" name="C" readonly placeholder="Field C" class="layui-input demo-table-search-date">
    </div>
  </div>  
  <div class="layui-btn-container layui-col-xs12">
    <button class="layui-btn" lay-submit lay-filter="demo-table-search">Search</button>
    <button type="reset" class="layui-btn layui-btn-primary">Clear</button>
  </div>
</form>

<table class="layui-hide" id="ID-table-demo-search"></table>
 
<script>
layui.use(function(){
  var table = layui.table;
  var form = layui.form;
  var laydate = layui.laydate;

  // 创建表格实例
  table.render({
    elem: '#ID-table-demo-search'
    ,url: '{{d.root}}/static/json/table/user.json' // 此处为静态模拟数据，实际使用时需换成真实接口
    ,cols: [[
      {checkbox: true, fixed: true}
      ,{field:'id', title: 'ID', width:80, sort: true, fixed: true}
      ,{field:'username', title: '用户名', width:80}
      ,{field:'sex', title: '性别', width:80, sort: true}
      ,{field:'city', title: '城市', width:80}
      ,{field:'sign', title: '签名'}
      ,{field:'experience', title: '积分', sort: true, width:80}
    ]]
    ,page: true
    ,height: 310
  });

  // 日期
  laydate.render({
    elem: '.demo-table-search-date'
  });

  // 搜索提交
  form.on('submit(demo-table-search)', function(data){
    var field = data.field; // 获得表单字段

    // 执行搜索重载
    table.reload('ID-table-demo-search', {
      page: {
        curr: 1 // 重新从第 1 页开始
      }
      ,where: field // 搜索的字段
    });

    layer.msg('搜索成功<br>此处为静态模拟数据，实际使用时换成真实接口即可');

    return false; // 阻止默认 form 跳转
  });
});
</script>