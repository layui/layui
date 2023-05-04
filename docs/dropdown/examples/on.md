<div class="layui-btn-container">
  <button class="layui-btn layui-btn-primary demo-dropdown-on" lay-options="{trigger: 'hover'}">
    hover
    <i class="layui-icon layui-icon-more-vertical layui-font-12"></i>
  </button>
  <button class="layui-btn layui-btn-primary demo-dropdown-on" lay-options="{trigger: 'mousedown'}">
    mousedown
    <i class="layui-icon layui-icon-down layui-font-12"></i>
  </button>
  <button class="layui-btn layui-btn-primary demo-dropdown-on" lay-options="{trigger: 'dblclick'}">
    dblclick - 双击
    <i class="layui-icon layui-icon-circle layui-font-12"></i>
  </button>
</div>

<!-- import layui --> 
<script>
layui.use(function(){
  var dropdown = layui.dropdown;
  
  // 自定义事件
  dropdown.render({
    elem: '.demo-dropdown-on',
    // trigger: 'click' // trigger 已配置在元素 `lay-options` 属性上
    data: [{
      title: 'menu item 1',
      id: 100
    },{
      title: 'menu item 2',
      id: 101
    },{
      title: 'menu item 3',
      id: 102
    }]
  });
  
});
</script>