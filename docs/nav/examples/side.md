<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>侧边垂直导航 - Layui</title>
  <meta name="renderer" content="webkit">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="{{= d.layui.cdn.css }}" rel="stylesheet">
</head>
<body>
<ul class="layui-nav layui-nav-tree layui-nav-side">
  <li class="layui-nav-item layui-nav-itemed">
    <a href="javascript:;">默认展开</a>
    <dl class="layui-nav-child">
      <dd><a href="javascript:;">选项1</a></dd>
      <dd><a href="javascript:;">选项2</a></dd>
      <dd><a href="javascript:;">选项3</a></dd>
    </dl>
  </li>
  <li class="layui-nav-item">
    <a href="javascript:;">默认收缩</a>
    <dl class="layui-nav-child">
      <dd><a href="javascript:;">选项1</a></dd>
      <dd><a href="javascript:;">选项2</a></dd>
      <dd><a href="javascript:;">选项3</a></dd>
    </dl>
  </li>
  <li class="layui-nav-item"><a href="javascript:;">菜单1</a></li>
  <li class="layui-nav-item"><a href="javascript:;">菜单2</a></li>
  <li class="layui-nav-item"><a href="javascript:;">菜单3</a></li>
</ul>

<script src="{{= d.layui.cdn.js }}"></script>
<script>
layui.use(function(){
  var element = layui.element;
  element.render('nav');
});
</script>
</body>
</html>