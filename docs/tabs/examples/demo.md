<div class="layui-tabs layui-hide-v" id="demoTabs1" lay-options="{closable: true, headerMode:'scroll'}">
  <ul class="layui-tabs-header">
    <li lay-id="aaa" lay-closable="false">Tab1</li>
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

🔔 操作提示：在「标签头部」点击鼠标右键，可开启标签操作的更多实用演示

<div class="layui-btn-container">
  <button class="layui-btn" onclick="layui.tabs.change('demoTabs1', 'ccc')">切换到：Tab3</button>
  <button class="layui-btn" onclick="layui.tabs.change('demoTabs1', 1)">切换到：第 2 项</button>
  <button class="layui-btn" onclick="layui.tabs.close('demoTabs1', 'ddd')">关闭：Tab4</button>
  <button class="layui-btn" onclick="layui.tabs.close('demoTabs1', 1)">关闭：第 2 项</button>
  <button class="layui-btn" lay-on="add">添加 Tab</button>
</div>

<!-- import layui -->
<script>
layui.use(function() {
  var $ = layui.$;
  var tabs = layui.tabs;
  var util = layui.util;
  var dropdown = layui.dropdown;

  // 为标签头添加上下文菜单
  var dropdownInst = dropdown.render({
    elem: '#demoTabs1 .layui-tabs-header>li',
    trigger: 'contextmenu',
    data: [{
      title: '在右侧新增标签页',
      action: 'add',
      mode: 'after'
    }, {
      type: '-'
    }, {
      title: '关闭',
      action: 'close',
      mode: 'this',
    }, {
      title: '关闭其他标签页',
      action: 'close',
      mode: 'other'
    }, {
      title: '关闭右侧标签页',
      action: 'close',
      mode: 'right'
    }, {
      title: '关闭所有标签页',
      action: 'close',
      mode: 'all'
    }],
    click: function(data, othis, event) {
      var index = this.elem.index(); // 获取活动标签索引

      // 新增标签操作
      if (data.action === 'add') {
        // 在当前活动标签右侧新增标签页
        addTabs({
          mode: data.mode,
          index: index
        });
      } else if(data.action === 'close') { // 关闭标签操作
        if (data.mode === 'this') {
          tabs.close('demoTabs1', index); // 关闭当前标签
        } else {
          tabs.closeMult('demoTabs1', data.mode, index); // 批量关闭标签
        }
      }
    }
  });

  // 新增随机标签
  var addTabs = function(opts) {
    var n = Math.random()*1000 | 0; // 演示标记
    opts = $.extend({
      title: 'New Tab '+ n, // 此处加 n 仅为演示区分，实际应用不需要
      content: 'New Tab Content '+ n,
      id: 'new-'+ n,
      done: function(data) {
        console.log(data); // 查看返回的参数

        // 给新标签头添加上下文菜单
        dropdown.render($.extend({}, dropdownInst.config, {
          elem: data.headerItem // 新标签头元素 --- headerItem 为 2.11.2 新增
        }));
      }
    }, opts);
    // 添加标签到最后
    tabs.add('demoTabs1', opts);
  }


  // 自定义事件
  util.on({
    add: function(){
      addTabs();
    }
  });
});
</script>
