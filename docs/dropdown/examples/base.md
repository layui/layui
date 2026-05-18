<div class="lay-btn-container">
  <button class="lay-btn demo-dropdown-base">
    <span>下拉菜单</span>
    <i class="lay-icon lay-icon-down lay-font-12"></i>
  </button>
  <button class="lay-btn lay-btn-primary demo-dropdown-base">
    <span>下拉菜单</span>
    <i class="lay-icon lay-icon-down lay-font-12"></i>
  </button>
</div>
 
<div class="lay-inline" style="width: 235px;">
  <input name="" placeholder="在输入框提供一些常用的选项" class="lay-input" id="ID-dropdown-demo-base-input">
</div>
<div class="lay-inline lay-word-aux lay-font-gray">
  可以绑定任意元素，
  <a href="javascript:;" class="lay-font-blue" id="ID-dropdown-demo-base-text">
    比如这段文字 
    <i class="lay-icon lay-font-12 lay-icon-down"></i>
  </a>
</div>

<!-- import layui --> 
<script>
layui.use(function(){
  var dropdown = layui.dropdown;

  // 渲染
  dropdown.render({
    elem: '.demo-dropdown-base', // 绑定元素选择器，此处指向 class 可同时绑定多个元素
    data: [{
      title: 'menu item 1',
      id: 100
    },{
      title: 'menu item 2',
      id: 101
    },{
      title: 'menu item 3',
      id: 102
    }],
    click: function(obj){
      this.elem.find('span').text(obj.title);
    }
  });

  // 绑定输入框
  dropdown.render({
    elem: '#ID-dropdown-demo-base-input',
    closeOnClick: false, // 不开启“打开与关闭的自动切换”，即点击输入框时始终为打开状态
    data: [{
      title: 'menu item 1',
      id: 101
    },{
      title: 'menu item 2',
      id: 102
    },{
      title: 'menu item 3',
      id: 103
    },{
      title: 'menu item 4',
      id: 104
    },{
      title: 'menu item 5',
      id: 105
    },{
      title: 'menu item 6',
      id: 106
    }],
    click: function(obj){
      this.elem.val(obj.title);
    },
    style: 'min-width: 235px;'
  });

  // 绑定文字
  dropdown.render({
    elem: '#ID-dropdown-demo-base-text',
    data: [{
      title: 'menu item 1',
      id: 100
    },{
      title: 'menu item 2',
      id: 101,
      child: [{  // 横向子菜单
        title: 'menu item 2-1',
        id: 1011
      },{
        title: 'menu item 2-2',
        id: 1012
      }]
    },{
      title: 'menu item 3',
      id: 102
    },{
      type: '-' // 分割线
    },{
      title: 'menu group',
      id: 103,
      type: 'group', // 纵向菜单组
      child: [{
        title: 'menu item 4-1',
        id: 1031
      },{
        title: 'menu item 4-2',
        id: 1032
      }]
    },{
      type: '-' // 分割线
    },{
      title: 'menu item 5',
      id: 104
    },{
      title: 'menu item 5',
      id: 104
    }],
    click: function(obj){
      this.elem.val(obj.title);
    }
  });

});
</script>

