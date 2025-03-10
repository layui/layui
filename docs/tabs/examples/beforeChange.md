<div class="layui-tabs layui-hide-v" id="demoTabsBeforeChange">
  <ul class="layui-tabs-header">
    <li lay-id="aaa">Tab1</li>
    <li lay-id="bbb">Tab2</li>
    <li lay-id="ccc">Tab3</li>
    <li lay-id="ddd">Tab4</li>
    <li lay-id="eee">Tab5</li>
    <li lay-id="fff">Tab6</li>
  </ul>
  <div class="layui-tabs-body">
    <div class="layui-tabs-item">Tab Content-1</div>
    <div class="layui-tabs-item">Tab Content-2</div>
    <div class="layui-tabs-item">Tab Content-3</div>
    <div class="layui-tabs-item">Tab Content-4</div>
    <div class="layui-tabs-item">Tab Content-5</div>
    <div class="layui-tabs-item">Tab Content-6</div>
  </div>
</div>

本示例演示：切换标签时，弹出确认提示。

<!-- import layui -->
<script>
layui.use(function() {
  var tabs = layui.tabs;

  // 标签实例 ID
  var DEMO_TABS_ID = 'demoTabsBeforeChange';

  // tabs 切换前的事件
  tabs.on(`beforeChange(${DEMO_TABS_ID})`, function(data) {
    console.log('beforeChange', data);

    // 切换确认提示
    layer.confirm(`确定从「当前标签」切换到标签「${this.innerText}」吗？`, function(i) {
      tabs.change(DEMO_TABS_ID, data.to.index, true); // 强制切换
      layer.close(i); // 关闭确认框
    });

    // 阻止标签默认关闭
    return false;
  });
});
</script>
