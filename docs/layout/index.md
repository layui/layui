---
title: Admin UI 框体布局
toc: true
---
 
# 框体布局

> Layui 的主要应用场景是面向中后台的界面搭建，因此也提供了大框体布局方案。

<h2 id="examples" lay-toc="">示例</h2>

<pre class="layui-code" lay-options="{preview: 'iframe',style: 'height: 450px;', layout: ['preview', 'code'], tools: ['full','window']}">
  <textarea>
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>layout 管理界面大布局示例 - Layui</title>
  <meta name="renderer" content="webkit">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="{{= d.layui.cdn.css }}" rel="stylesheet">
</head>
<body>
<div class="layui-layout layui-layout-admin">
  <div class="layui-header">
    <div class="layui-logo layui-hide-xs layui-bg-black">layout demo</div>
    <!-- 头部区域（可配合layui 已有的水平导航） -->
    <ul class="layui-nav layui-layout-left">
      <!-- 移动端显示 -->
      <li class="layui-nav-item layui-show-xs-inline-block layui-hide-sm" lay-header-event="menuLeft">
        <i class="layui-icon layui-icon-spread-left"></i>
      </li>
      <li class="layui-nav-item layui-hide-xs"><a href="javascript:;">nav 1</a></li>
      <li class="layui-nav-item layui-hide-xs"><a href="javascript:;">nav 2</a></li>
      <li class="layui-nav-item layui-hide-xs"><a href="javascript:;">nav 3</a></li>
      <li class="layui-nav-item">
        <a href="javascript:;">nav groups</a>
        <dl class="layui-nav-child">
          <dd><a href="javascript:;">menu 11</a></dd>
          <dd><a href="javascript:;">menu 22</a></dd>
          <dd><a href="javascript:;">menu 33</a></dd>
        </dl>
      </li>
    </ul>
    <ul class="layui-nav layui-layout-right">
      <li class="layui-nav-item layui-hide layui-show-sm-inline-block">
        <a href="javascript:;">
          <img src="//unpkg.com/outeres@0.0.10/img/layui/icon-v2.png" class="layui-nav-img">
          tester
        </a>
        <dl class="layui-nav-child">
          <dd><a href="javascript:;">Your Profile</a></dd>
          <dd><a href="javascript:;">Settings</a></dd>
          <dd><a href="javascript:;">Sign out</a></dd>
        </dl>
      </li>
      <li class="layui-nav-item" lay-header-event="menuRight" lay-unselect>
        <a href="javascript:;">
          <i class="layui-icon layui-icon-more-vertical"></i>
        </a>
      </li>
    </ul>
  </div>
  <div class="layui-side layui-bg-black">
    <div class="layui-side-scroll">
      <!-- 左侧导航区域（可配合layui已有的垂直导航） -->
      <ul class="layui-nav layui-nav-tree" lay-filter="test">
        <li class="layui-nav-item layui-nav-itemed">
          <a class="" href="javascript:;">menu group 1</a>
          <dl class="layui-nav-child">
            <dd><a href="javascript:;">menu 1</a></dd>
            <dd><a href="javascript:;">menu 2</a></dd>
            <dd><a href="javascript:;">menu 3</a></dd>
            <dd><a href="javascript:;">the links</a></dd>
          </dl>
        </li>
        <li class="layui-nav-item">
          <a href="javascript:;">menu group 2</a>
          <dl class="layui-nav-child">
            <dd><a href="javascript:;">list 1</a></dd>
            <dd><a href="javascript:;">list 2</a></dd>
            <dd><a href="javascript:;">超链接</a></dd>
          </dl>
        </li>
        <li class="layui-nav-item"><a href="javascript:;">click menu item</a></li>
        <li class="layui-nav-item"><a href="javascript:;">the links</a></li>
      </ul>
    </div>
  </div>
  <div class="layui-body">
    <!-- 内容主体区域 -->
    <div style="padding: 15px;">
      <blockquote class="layui-elem-quote layui-text">
        Layui 框体布局内容主体区域
      </blockquote>
      <div class="layui-card layui-panel">
        <div class="layui-card-header">
          下面是充数内容，为的是出现滚动条
        </div>
        <div class="layui-card-body">
        充数内容<br>充数内容<br>充数内容<br>充数内容<br>充数内容<br>充数内容<br>充数内容<br>充数内容<br>充数内容<br>充数内容<br>充数内容<br>充数内容<br>充数内容<br>充数内容<br>充数内容<br>充数内容<br>充数内容<br>充数内容<br>充数内容<br>充数内容<br>充数内容<br>充数内容<br>充数内容<br>充数内容<br>充数内容<br>充数内容<br>充数内容<br>充数内容<br>充数内容<br>充数内容<br>充数内容<br>充数内容<br>充数内容<br>充数内容<br>充数内容<br>充数内容<br>充数内容<br>充数内容<br>充数内容<br>充数内容<br>充数内容<br>充数内容<br>充数内容<br>充数内容<br>充数内容<br>充数内容<br>充数内容<br>充数内容<br>充数内容<br>充数内容<br>你还真滑到了底部呀
        </div>
      </div>
      <br><br>
    </div>
  </div>
  <div class="layui-footer">
    <!-- 底部固定区域 -->
    底部固定区域
  </div>
</div>
 
<script src="{{= d.layui.cdn.js }}"></script>
<script>
//JS 
layui.use(['element', 'layer', 'util'], function(){
  var element = layui.element;
  var layer = layui.layer;
  var util = layui.util;
  var $ = layui.$;
  
  //头部事件
  util.event('lay-header-event', {
    menuLeft: function(othis){ // 左侧菜单事件
      layer.msg('展开左侧菜单的操作', {icon: 0});
    },
    menuRight: function(){  // 右侧菜单事件
      layer.open({
        type: 1,
        title: '更多',
        content: '<div style="padding: 15px;">处理右侧面板的操作</div>',
        area: ['260px', '100%'],
        offset: 'rt', // 右上角
        anim: 'slideLeft', // 从右侧抽屉滑出
        shadeClose: true,
        scrollbar: false
      });
    }
  });
});
</script>
</body>
</html>
  </textarea>
</pre>

<br>

> 小贴士：以上是一个基础的框体布局方案，若要实现诸如 `iframe` 跳转、侧边菜单收缩等功能，还需按照实际的业务需求自主实现。当然，也可以采用社区已有的 AdminUI 主题方案，如：layuiAdmin 等。

<h2 id="adminui" lay-toc="{}">Admin UI</h2>

<a href="https://dev.layuion.com/themes/layuiadmin/" target="_blank">layuiAdmin</a> 是一套用于开发通用型管理系统的纯静态的 `HTML` 网页界面主题，基于开源的 Layui Web 组件库制作而成，没有任何后端程序及数据库存储等服务端代码。开发者使用该网页模板，可省去前端的大量工作，从而更高效地开发 Web 应用系统。
