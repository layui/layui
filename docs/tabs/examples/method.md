<div id="demoTabs2"></div>

<!-- import layui -->
<script>
layui.use(function(){
  var tabs = layui.tabs;

  // 方法渲染
  tabs.render({
    elem: '#demoTabs2',
    header: [
      { title: 'Tab1' },
      { title: 'Tab2' },
      { title: 'Tab3' }
    ],
    body: [
      { content: 'Tab content 1' },
      { content: 'Tab content 2' },
      { content: 'Tab content 3' }
    ],
    // index: 1, // 初始选中项
    // className: 'layui-tabs-card',
    // closable: true
  });
});
</script>
