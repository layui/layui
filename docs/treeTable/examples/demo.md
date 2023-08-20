<table class="layui-hide" id="ID-treeTable-demo"></table>

<script type="text/html" id="TPL-treeTable-demo">
  <div class="layui-btn-container">
    <button class="layui-btn layui-btn-sm" lay-event="getChecked">获取选中数据</button>
  </div>
</script>

<script type="text/html" id="TPL-treeTable-demo-tools">
  <div class="layui-btn-container">
    <a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="detail">查看</a>
    <a class="layui-btn layui-btn-warm layui-btn-xs" lay-event="addChild">新增</a>
    <a class="layui-btn layui-btn-xs" lay-event="more">更多 <i class="layui-icon layui-icon-down"></i></a>
  </div>
</script>

<!-- import layui -->
<script>
layui.use(function(){
  var treeTable = layui.treeTable;
  var layer = layui.layer;
  var dropdown = layui.dropdown;

  // 渲染
  var inst = treeTable.render({
    elem: '#ID-treeTable-demo',
    url: '/static/2.8/json/treeTable/demo-1.json', // 此处为静态模拟数据，实际使用时需换成真实接口
    tree: {
      /*
      // 异步加载子节点
      async: {
        enable: true,
        url: '/static/2.8/json/treeTable/demo-async.json', // 此处为静态模拟数据，实际使用时需换成真实接口
        autoParam: ["parentId=id"]
      }
      */
    },
    maxHeight: '501px',
    toolbar: '#TPL-treeTable-demo',
    cols: [[
      {type: 'checkbox', fixed: 'left'},
      {field: 'id', title: 'ID', width: 80, sort: true, fixed: 'left'},
      {field: 'name', title: '用户名', width: 180, fixed: 'left'},
      {field: 'sex', title: '性别', width: 80, sort: true},
      {field: 'experience', title: '积分', width: 90, sort: true},
      {field: 'city', title: '城市', width: 100},
      { fixed: "right", title: "操作", width: 190, align: "center", toolbar: "#TPL-treeTable-demo-tools"} 
    ]],
    page: true
  });

  // 表头工具栏工具事件
  treeTable.on("toolbar(ID-treeTable-demo)", function (obj) {
    var config = obj.config;
    var tableId = config.id;
    var status = treeTable.checkStatus(tableId);

    // 获取选中行
    if (obj.event === "getChecked") {
      if(!status.data.length) return layer.msg('无选中数据');
      console.log(status);
      layer.alert("当前数据选中已经输出到控制台，<br>您可按 F12 从控制台中查看结果。");
    }
  });

  // 单元格工具事件
  treeTable.on('tool('+ inst.config.id +')', function (obj) {
    var layEvent = obj.event; // 获得 lay-event 对应的值
    var trElem = obj.tr;
    var trData = obj.data;
    var tableId = obj.config.id;

    if (layEvent === "detail") {
      layer.msg("查看操作：" + trData.name);
    } else if (layEvent === "addChild") {
      var data = { id: Date.now(), name: "新节点" };
      var newNode2 = treeTable.addNodes(tableId, {
        parentIndex: trData["LAY_DATA_INDEX"], 
        index: -1, 
        data: data
      });
    } else if (layEvent === "more") {
      // 下拉菜单
      dropdown.render({
        elem: this, // 触发事件的 DOM 对象
        show: true, // 外部事件触发即显示
        align: "right", // 右对齐弹出
        data: [
          {
            title: "修改积分",
            id: "edit"
          },
          {
            title: "删除",
            id: "del"
          }
        ],
        click: function (menudata) {
          if (menudata.id === "del") {
            layer.confirm("真的删除行么", function (index) {
              obj.del(); // 等效如下
              // treeTable.removeNode(tableId, trElem.attr('data-index'))
              layer.close(index);
            });
          } else if (menudata.id === "edit") {
            layer.prompt({
                value: trData.experience,
                title: "输入新的积分"
            }, function (value, index) {
              obj.update({ experience: value }); // 等效如下
              // treeTable.updateNode(tableId, trElem.attr('data-index'), {experience: value});
              layer.close(index);
            });
          }
        }
      });
    }
  });
});
</script>