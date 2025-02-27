<div class="layui-tabs layui-hide-v" id="demoTabs1" lay-options="{closable: true, headerMode:'scroll'}">
  <ul class="layui-tabs-header">
    <li lay-id="aaa" lay-unclosed="true" class="layui-this">Tab1</li>
    <li lay-id="bbb">Tab2</li>
    <li lay-id="ccc">Tab3</li>
    <li lay-id="ddd">Tab4</li>
    <li lay-id="eee">Tab5</li>
    <li lay-id="fff">Tab6</li>
  </ul>
  <div class="layui-tabs-body">
    <div class="layui-tabs-item layui-show">Tab Content-1</div>
    <div class="layui-tabs-item">Tab Content-2</div>
    <div class="layui-tabs-item">Tab Content-3</div>
    <div class="layui-tabs-item">Tab Content-4</div>
    <div class="layui-tabs-item">Tab Content-5</div>
    <div class="layui-tabs-item">Tab Content-6</div>
  </div>
</div>

<div class="layui-btn-container">
  <button class="layui-btn" onclick="layui.tabs.change('demoTabs1', 'ccc')">切换到：Tab3</button>
  <button class="layui-btn" onclick="layui.tabs.change('demoTabs1', 1)">切换到：第 2 项</button>
  <button class="layui-btn" onclick="layui.tabs.close('demoTabs1', 'ddd')">关闭：Tab4</button>
  <button class="layui-btn" onclick="layui.tabs.close('demoTabs1', 1)">关闭：第 2 项</button>
  <button class="layui-btn" lay-on="add">添加 Tab</button>
</div>

<!-- import layui -->
<script>
layui.use(function(){
  var tabs = layui.tabs;
  var util = layui.util;

  // 事件
  util.on({
    add: function(){
      var n = Math.random()*1000 | 0; // 演示标记
      //添加标签
      tabs.add('demoTabs1', {
        title: 'New Tab '+ n, // 此处加 n 仅为演示区分，实际应用不需要
        content: 'New Tab Content '+ n,
        id: 'new-'+ n,
        aaa: 'attr-'+ n, // 自定义属性，其中 aaa 可任意命名
        // mode: 'curr',
        done: function(params) {
          console.log(params);
        }
      });
    }
  });
});
