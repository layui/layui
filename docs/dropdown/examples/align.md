<div class="lay-btn-container">
  <button class="lay-btn lay-btn-primary demo-dropdown-align" lay-options="{}">
    左对齐
    <i class="lay-icon lay-icon-down lay-font-12"></i>
  </button>
  <button class="lay-btn lay-btn-primary demo-dropdown-align" lay-options="{align: 'center'}">
    居中对齐
    <i class="lay-icon lay-icon-down lay-font-12"></i>
  </button>
  <button class="lay-btn lay-btn-primary demo-dropdown-align" lay-options="{align: 'right'}">
    右对齐
    <i class="lay-icon lay-icon-down lay-font-12"></i>
  </button>
</div>

<!-- import layui --> 
<script>
layui.use(function(){
  var dropdown = layui.dropdown;

  // 水平对齐方式
  dropdown.render({
    elem: '.demo-dropdown-align',
    // align: 'center' // align 已配置在元素 `lay-options` 属性上
    data: [{
      title: 'menu item test 111',
      id: 100
    },{
      title: 'menu item test 222',
      id: 101
    },{
      title: 'menu item test 333',
      id: 102
    }]
  });
  
});
</script>
