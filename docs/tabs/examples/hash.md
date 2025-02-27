<div class="layui-tabs layui-hide-v" id="demoTabs-hash">
  <ul class="layui-tabs-header">
    <li lay-id="A1" class="layui-this"><a href="#A1">标题题题题题题1</a></li>
    <li lay-id="A2"><a href="#A2">标题题题2</a></li>
    <li lay-id="A3"><a href="#A3">标题3</a></li>
    <li lay-id="A4"><a href="#A4">标题题题题题题题4</a></li>
    <li lay-id="A5"><a href="#A5">标题5</a></li>
    <li lay-id="A6"><a href="#A6">标题6</a></li>
    <li lay-id="A7"><a href="#A7">标题7</a></li>
    <li lay-id="A8"><a href="#A8">标题题题题题题题8</a></li>
  </ul>
</div>

<!-- import layui -->
<script>
layui.use(function(){
  var tabs = layui.tabs;

  // HASH 初始定位
  var hash = layui.hash();
  tabs.change('demoTabs-hash', hash.href);
});
</script>
