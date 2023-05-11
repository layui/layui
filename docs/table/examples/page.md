<table class="layui-hide" id="ID-table-demo-page"></table>
<script type="text/html" id="ID-table-demo-page-pagebar">
  <div class="layui-btn-container">
    <button class="layui-btn layui-btn-sm" lay-event="footerDemoBtn1">底部按钮1</button>
    <button class="layui-btn layui-btn-sm" lay-event="footerDemoBtn2">底部按钮2</button>
  </div>
</script>

<!-- import layui -->
<script>
layui.use('table', function(){
  var table = layui.table;
  
  // 创建渲染实例
  table.render({
    elem: '#ID-table-demo-page',
    url:'/static/2.8/json/table/user.json', // 此处为静态模拟数据，实际使用时需换成真实接口
    page: { // 支持传入 laypage 组件的所有参数（某些参数除外，如：jump/elem） - 详见文档
      layout: ['limit', 'count', 'prev', 'page', 'next', 'skip'], //自定义分页布局
      //curr: 5, //设定初始在第 5 页
      groups: 1, //只显示 1 个连续页码
      first: false, //不显示首页
      last: false //不显示尾页
    },
    pagebar: '#ID-table-demo-page-pagebar', // 分页栏模板
    cols: [[
      {field:'id', width:80, title: 'ID', sort: true},
      {field:'username', width:80, title: '用户名'},
      {field:'sex', width:80, title: '性别', sort: true},
      {field:'city', width:80, title: '城市'},
      {field:'sign', title: '签名', minWidth: 150},
      {field:'experience', width:80, title: '积分', sort: true}
    ]]
  });

  // 底部分页栏事件
  table.on('pagebar(ID-table-demo-page)', function(obj){
    var eventValue = obj.event; // 获得按钮 lay-event 值
    layer.msg(eventValue);
  });
});
</script>