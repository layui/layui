<table class="layui-hide" id="ID-table-demo-filter"></table>

<!-- import layui -->
<script>
layui.use(function(){
  var $ = layui.$;
  var table = layui.table;

  // 渲染
  table.render({
    elem: '#ID-table-demo-filter',
    url:'/static/2.8/json/table/user.json', // 此处为静态模拟数据，实际使用时需换成真实接口
    toolbar: 'default',
    height: 315,
    cols: [function(){
      var arr = [
        {field:'id', title:'ID', width:80, fixed: 'left'},
        {field:'username', title:'用户', width:120},
        {field:'sex', title:'性别'},
        {field:'city', title:'城市'},
        {field:'sign', title:'签名'},
        {field:'classify', title:'职业'}
      ];
      
      // 初始化筛选状态
      var local = layui.data('table-filter-test'); // 获取对应的本地记录
      layui.each(arr, function(index, item){
        if(item.field in local){
          item.hide = local[item.field];
        }
      });
      return arr;
    }() ],  
    done: function(){
      // 记录筛选状态
      var that = this;
      that.elem.next().on('mousedown', 'input[lay-filter="LAY_TABLE_TOOL_COLS"]+', function(){
        var input = $(this).prev()[0];
        // 此处表名可任意定义
        layui.data('table-filter-test', {
          key: input.name
          ,value: input.checked
        })
      });
    }
  });
});
</script>