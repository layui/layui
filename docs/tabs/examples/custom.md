<div id="demoTabs3">
  <style>
    #demoTabsHeader .lay-btn.lay-this{border-color: #eee; color: unset; background: none;}
    #demoTabsBody .test-item{display: none;}
  </style>
  <div class="lay-btn-container" id="demoTabsHeader">
    <button class="lay-btn lay-this">标题 1</button>
    <button class="lay-btn">标题 2</button>
    <button class="lay-btn">标题 3</button>
  </div>
  <div class="lay-panel lay-padding-3" id="demoTabsBody">
    <div class="test-item lay-show">内容 111</div>
    <div class="test-item">内容 222</div>
    <div class="test-item">内容 333</div>
  </div>
</div>

<!-- import layui -->
<script>
layui.use(function(){
  var tabs = layui.tabs;

  // 给任意元素绑定 Tab 功能
  tabs.render({
    elem: '#demoTabs3',
    header: ['#demoTabsHeader', '>button'],
    body: ['#demoTabsBody', '>.test-item']
  });
});
</script>

