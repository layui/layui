<div class="lay-btn-container">
  <button class="lay-btn lay-btn-primary demo-dropdown-on" lay-options="{trigger: 'hover'}">
    hover
    <i class="lay-icon lay-icon-more-vertical lay-font-12"></i>
  </button>
  <button class="lay-btn lay-btn-primary demo-dropdown-on" lay-options="{trigger: 'mousedown'}">
    mousedown
    <i class="lay-icon lay-icon-down lay-font-12"></i>
  </button>
  <button class="lay-btn lay-btn-primary demo-dropdown-on" lay-options="{trigger: 'dblclick'}">
    dblclick - 双击
    <i class="lay-icon lay-icon-circle lay-font-12"></i>
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
