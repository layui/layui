常用两级表头：
 
<table class="layui-table" lay-data="{url:'/static/2.8/json/table/demo2.json?v=2', page: true, limit: 6, limits:[6]}" id="ID-table-demo-theads-1">
  <thead>
    <tr>
      <th lay-data="{checkbox:true}" rowspan="2"></th>
      <th lay-data="{field:'username', width:80}" rowspan="2">联系人</th>
      <th lay-data="{align:'center'}" colspan="3">地址</th>
      <th lay-data="{field:'amount'}" rowspan="2">数量</th>
      <th lay-data="{fixed: 'right', width: 160, align: 'center', toolbar: '#templet-demo-theads-tool'}" rowspan="2">操作</th>
    </tr>
    <tr>
      <th lay-data="{field:'province', width:100}">省</th>
      <th lay-data="{field:'city', width:100}">市</th>
      <th lay-data="{field:'zone', width:100}">区</th>
    </tr>
  </thead>
</table>

更多级表头（支持无限极）：

<table class="layui-table" lay-data="{url:'/static/2.8/json/table/demo2.json?v=3', cellMinWidth: 80, page: true}" id="ID-table-demo-theads-2">
  <thead>
    <tr>
      <th lay-data="{field:'username', fixed:'left', width:80}" rowspan="3">联系人</th>
      <th lay-data="{field:'amount'}" rowspan="3">数量</th>
      <th lay-data="{align:'center'}" colspan="5">地址1</th>
      <th lay-data="{align:'center'}" colspan="2">地址2</th>
      <th lay-data="{fixed: 'right', width: 160, align: 'center', toolbar: '#templet-demo-theads-tool'}" rowspan="3">操作</th>
    </tr>
    <tr>
      <th lay-data="{field:'province'}" rowspan="2">省</th>
      <th lay-data="{field:'city'}" rowspan="2">市</th>
      <th lay-data="{align:'center'}" colspan="3">详细</th>
      <th lay-data="{field:'province'}" rowspan="2">省</th>
      <th lay-data="{field:'city'}" rowspan="2">市</th>
    </tr>
    <tr>
      <th lay-data="{field:'street'}" rowspan="2">街道</th>
      <th lay-data="{field:'address'}">小区</th>
      <th lay-data="{field:'house'}">单元</th>
    </tr>
  </thead>
</table>
 
<script type="text/html" id="templet-demo-theads-tool">
  <div class="layui-clear-space">
    <a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="detail">按钮1</a>
    <a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="edit">按钮2</a>
  </div>
</script>

<!-- import layui -->