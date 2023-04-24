<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>基础菜单 - Layui</title>
  <meta name="renderer" content="webkit">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="{{= d.layui.cdn.css }}" rel="stylesheet">
</head>
<body class="layui-bg-gray">
<div class="layui-panel" style="width: 260px; margin: 16px;">
  <ul class="layui-menu" id="demo-menu">
    <li lay-options="{id: 100}">
      <div class="layui-menu-body-title"><a href="javascript:;">menu item 1</a></div>
    </li>
    <li lay-options="{id: 101}">
      <div class="layui-menu-body-title">
        <a href="javascript:;">menu item 2 <span class="layui-badge-dot"></span></a>
      </div>
    </li>
    <li class="layui-menu-item-divider"></li>
    <li class="layui-menu-item-group layui-menu-item-down" lay-options="{type: 'group'}">
      <div class="layui-menu-body-title">
        menu group <i class="layui-icon layui-icon-up"></i>
      </div>
      <ul>
        <li lay-options="{id: 103}">
          <div class="layui-menu-body-title">menu item 3-1</div>
        </li>
        <li class="layui-menu-item-group" lay-options="{type: 'group', isAllowSpread: false}">
          <div class="layui-menu-body-title">menu group 2</div>
          <ul>
            <li class="layui-menu-item-checked">
              <div class="layui-menu-body-title">menu item 3-2-1</div>
            </li>
            <li><div class="layui-menu-body-title">menu item 3-2-2</div></li>
          </ul>
        </li>
        <li><div class="layui-menu-body-title">menu item 3-3</div></li>
      </ul>
    </li>
    <li class="layui-menu-item-divider"></li>
    <li><div class="layui-menu-body-title">menu item 4 <span class="layui-badge">1</span></div></li>
    <li><div class="layui-menu-body-title">menu item 5</div></li>
    <li><div class="layui-menu-body-title">menu item 6</div></li>
    <li class="layui-menu-item-parent" lay-options="{type: 'parent'}">
      <div class="layui-menu-body-title">
        menu item 7 Children
        <i class="layui-icon layui-icon-right"></i>
      </div>
      <div class="layui-panel layui-menu-body-panel">
        <ul>
          <li class="layui-menu-item-parent" lay-options="{type: 'parent'}">
            <div class="layui-menu-body-title">
              menu item 7-1
              <i class="layui-icon layui-icon-right"></i>
            </div>
            <div class="layui-panel layui-menu-body-panel">
              <ul>
                <li><div class="layui-menu-body-title">menu item 7-2-1</div></li>
                <li><div class="layui-menu-body-title">menu item 7-2-2</div></li>
                <li><div class="layui-menu-body-title">menu item 7-2-3</div></li>
                <li><div class="layui-menu-body-title">menu item 7-2-4</div></li>
              </ul>
            </div>
          </li>
          <li><div class="layui-menu-body-title">menu item 7-2</div></li>
          <li><div class="layui-menu-body-title">menu item 7-3</div></li>
        </ul>
      </div>
    </li>
    <li>menu item 8</li>
    <li class="layui-menu-item-divider"></li>
    <li class="layui-menu-item-group" lay-options="{type: 'group', isAllowSpread: false}">
      <div class="layui-menu-body-title">menu group 9</div>
      <ul>
        <li><div class="layui-menu-body-title">menu item 9-1</div></li>
        <li class="layui-menu-item-parent" lay-options="{type: 'parent'}">
          <div class="layui-menu-body-title">
            menu item 9-2
            <i class="layui-icon layui-icon-right"></i>
          </div>
          <div class="layui-panel layui-menu-body-panel">
            <ul>
              <li><div class="layui-menu-body-title">menu item 9-2-1</div></li>
              <li><div class="layui-menu-body-title">menu item 9-2-2</div></li>
              <li><div class="layui-menu-body-title">menu item 9-2-3</div></li>
            </ul>
          </div>
        </li>
        <li><div class="layui-menu-body-title">menu item 9-31</div></li>
      </ul>
    </li>
    <li class="layui-menu-item-divider"></li>
    <li><div class="layui-menu-body-title">menu item 10</div></li>
  </ul>
</div>

<script src="{{= d.layui.cdn.js }}"></script>
<script>
layui.use(function(){
  var dropdown = layui.dropdown;
  var layer = layui.layer;
  var util = layui.util;

  // 菜单点击事件
  dropdown.on('click(demo-menu)', function(options){
    console.log(this, options);
    
    // 显示 - 仅用于演示
    layer.msg(util.escape(JSON.stringify(options)));
  });
});
</script>
</body>
</html>