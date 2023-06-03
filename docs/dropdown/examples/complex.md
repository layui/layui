<button class="layui-btn" id="ID-dropdown-demo-complex">
  无限层级 + 跳转 + 事件 + 自定义模板
</button>

<!-- import layui --> 
<script>
layui.use(function(){
  var dropdown = layui.dropdown;
  var util = layui.util;

  // 高级演示 - 复杂结构
  dropdown.render({
    elem: '#ID-dropdown-demo-complex',
    data: [{
      title: 'menu item 1',
      templet: '{{!<i class="layui-icon layui-icon-picture"></i> {{= d.title }} <span class="layui-badge-dot"></span>!}}',
      id: 100,
      href: '#'
    },{
      title: 'menu item 2',
      templet: '{{!<img src="https://unpkg.com/outeres@0.0.11/demo/avatar/0.png" style="width: 16px;"> {{= d.title }} !}}',
      id: 101,
      href: '/',
      target: '_blank'
    },
    {type: '-'}, // 分割线
    {
      title: 'menu item 3',
      id: 102,
      type: 'group',
      child: [{
        title: 'menu item 3-1',
        id: 103
      },{
        title: 'menu item 3-2',
        id: 104,
        child: [{
          title: 'menu item 3-2-1',
          id: 105
        },{
          title: 'menu item 3-2-2',
          id: 11,
          type: 'group',
          child: [{
            title: 'menu item 3-2-2-1',
            id: 111
          },{
            title: 'menu item 3-2-2-2',
            id: 1111
          }]
        },{
          title: 'menu item 3-2-3',
          id: 11111
        }]
      },{
        title: 'menu item 3-3',
        id: 111111,
        type: 'group',
        child: [{
          title: 'menu item 3-3-1',
          id: 22
        },{
          title: 'menu item 3-3-2',
          id: 222,
          child: [{
            title: 'menu item 3-3-2-1',
            id: 2222
          },{
            title: 'menu item 3-3-2-2',
            id: 22222
          },{
            title: 'menu item 3-3-2-3',
            id: 2222222
          }]
        },{
          title: 'menu item 3-3-3',
          id: 333
        }]
      }]
    },
    {type: '-'},
    {
      title: 'menu item 4',
      id: 4
    },{
      title: 'menu item 5',
      id: 5,
      child: [{
        title: 'menu item 5-1',
        id: 55,
        child: [{
          title: 'menu item 5-1-1',
          id: 5555
        },{
          title: 'menu item 5-1-2',
          id: 55555
        },{
          title: 'menu item 5-1-3',
          id: 555555
        }]
      },{
        title: 'menu item 5-2',
        id: 52
      },{
        title: 'menu item 5-3',
        id: 53
      }]
    },{type:'-'},{
      title: 'menu item 6',
      id: 66,
      type: 'group',
      isSpreadItem: false,
      child: [{
        title: 'menu item 6-1',
        id: 777
      },{
        title: 'menu item 6-2',
        id: 7777
      },{
        title: 'menu item 6-3',
        id: 77777
      }]
    }],
    click: function(item){
      layer.msg(util.escape(JSON.stringify(item)));
    }
  });
});
</script>