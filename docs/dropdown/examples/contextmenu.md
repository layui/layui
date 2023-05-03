<div class="layui-bg-gray" style="height: 260px; text-align: center;" id="ID-dropdown-demo-contextmenu">
  <span class="layui-font-gray" style="position: relative; top:50%;">在此区域单击鼠标右键</span>
</div>

<button class="layui-btn" style="margin-top: 15px;" lay-on="contextmenu">
  开启全局右键菜单
</button>

<!-- import layui --> 
<script>
layui.use(function(){
  var dropdown = layui.dropdown;
  var util = layui.util;

  // 右键菜单
  dropdown.render({
    elem: '#ID-dropdown-demo-contextmenu', // 也可绑定到 document，从而重置整个右键
    trigger: 'contextmenu', // contextmenu
    isAllowSpread: false, // 禁止菜单组展开收缩
    style: 'width: 200px', // 定义宽度，默认自适应
    data: [{
      title: 'menu item 1',
      id: 'test'
    }, {
      title: 'Printing',
      id: 'print'
    },{
      title: 'Reload',
      id: 'reload'
    },{type:'-'},{
      title: 'menu item 3',
      id: '#3',
      child: [{
        title: 'menu item 3-1',
        id: '#1'
      },{
        title: 'menu item 3-2',
        id: '#2'
      },{
        title: 'menu item 3-3',
        id: '#3'
      }]
    },
    {type: '-'},
    {
      title: 'menu item 4',
      id: ''
    },{
      title: 'menu item 5',
      id: '#1'
    },{
      title: 'menu item 6',
      id: '#1'
    }],
    click: function(obj, othis){
      if(obj.id === 'test'){
        layer.msg('click');
      } else if(obj.id === 'print'){
        window.print();
      } else if(obj.id === 'reload'){
        location.reload();
      }
    }
  });

  // 其他操作
  util.event('lay-on', {
    // 全局右键菜单
    contextmenu: function(othis){
      var ID = 'ID-dropdown-demo-contextmenu';
      if(!othis.data('open')){
        dropdown.reload(ID, {
          elem: document // 将事件直接绑定到 document
        });
        layer.msg('已开启全局右键菜单，请尝试在页面任意处单击右键。')
        othis.html('取消全局右键菜单');
        othis.data('open', true);
      } else {
        dropdown.reload(ID, {
          elem: '#'+ ID // 重新绑定到指定元素上
        });
        layer.msg('已取消全局右键菜单，恢复默认右键菜单')
        othis.html('开启全局右键菜单');
        othis.data('open', false);
      }
    }
  });
});
</script>