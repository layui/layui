<div class="ws-demo-static">
  <div class="layui-inline" id="ID-laydate-static-1"></div>
  <div class="layui-inline" id="ID-laydate-static-2"></div>
  <div class="layui-inline" id="ID-laydate-static-3"></div>
  <div class="layui-inline" id="ID-laydate-static-4"></div>
</div>

<!-- import layui --> 
<script>
layui.use(function(){
  var laydate = layui.laydate;

  // 直接嵌套显示
  laydate.render({
    elem: '#ID-laydate-static-1',
    position: 'static'
  });
  laydate.render({
    elem: '#ID-laydate-static-2',
    position: 'static',
    lang: 'en'
  });
  laydate.render({
    elem: '#ID-laydate-static-3',
    type: 'month',
    position: 'static'
  });
  laydate.render({
    elem: '#ID-laydate-static-4',
    type: 'time',
    position: 'static'
  });
});
</script>