<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>侧边垂直导航 - Layui</title>
  <meta name="renderer" content="webkit">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="{{= d.layui[2].cdn.css }}" rel="stylesheet">
</head>
<body>
<ul class="lay-nav lay-nav-tree lay-nav-side">
  <li class="lay-nav-item lay-nav-itemed">
    <a href="javascript:;">默认展开</a>
    <dl class="lay-nav-child">
      <dd><a href="javascript:;">选项1</a></dd>
      <dd><a href="javascript:;">选项2</a></dd>
      <dd><a href="javascript:;">选项3</a></dd>
    </dl>
  </li>
  <li class="lay-nav-item">
    <a href="javascript:;">默认收缩</a>
    <dl class="lay-nav-child">
      <dd><a href="javascript:;">选项1</a></dd>
      <dd><a href="javascript:;">选项2</a></dd>
      <dd><a href="javascript:;">选项3</a></dd>
    </dl>
  </li>
  <li class="lay-nav-item"><a href="javascript:;">菜单1</a></li>
  <li class="lay-nav-item"><a href="javascript:;">菜单2</a></li>
  <li class="lay-nav-item"><a href="javascript:;">菜单3</a></li>
</ul>

<script src="{{= d.layui[2].cdn.js }}"></script>
<script>
layui.use(function(){
  var element = layui.element;
  element.render('nav');
});
</script>
</body>
</html>

