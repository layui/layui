<button class="layui-btn" id="ID-dropdown-demo-reload">
  <span>下拉菜单</span>
  <i class="layui-icon layui-icon-down layui-font-12"></i>
</button>

<!-- import layui --> 
<script>
layui.use(function(){
  var dropdown = layui.dropdown;

  // 渲染
  dropdown.render({
    elem: '#ID-dropdown-demo-reload',
    data: [{
      title: 'menu item 1',
      id: 100
    }, {
      title: '重载该面板',
      id: 101
    }],
    click: function(data){
      if(data.id === 101){ // 菜单项对应设置的 id 值
        // 重载方法
        dropdown.reload('ID-dropdown-demo-reload', {
          data: [{ // 重新赋值 data
            title: '新选项 1',
            id: 111
          }, {
            title: '新选项 2',
            id: 222
          }], 
          show: true // 重载即显示组件面板
        });

        return false; // 点击该选项，阻止面板关闭
      }
    }
  });
});
</script>