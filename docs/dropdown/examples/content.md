<button class="layui-btn" id="ID-dropdown-demo-content">
  自定义内容
  <i class="layui-icon layui-icon-list layui-font-14"></i>
</button>

<style>
.demo-dropdown-tabs{padding: 11px 16px 0;}
</style>

<!-- import layui -->
<script>
layui.use(function() {
  var dropdown = layui.dropdown;
  var tabs = layui.tabs;

  // 自定义内容
  dropdown.render({
    elem: '#ID-dropdown-demo-content',
    content: ['<div class="layui-tabs">',
      '<ul class="layui-tabs-header">',
        '<li class="layui-this">Tab Header1</li>',
        '<li>Tab Header2</li>',
        '<li>Tab Header3</li>',
      '</ul>',
      '<div class="layui-tabs-body">',
        '<div class="layui-tabs-item layui-text layui-show"><p style="padding-bottom: 10px;">在 content 属性中传入任意的 html 内容，可替代默认的下拉菜单结构，从而实现更多有趣的弹出内容。</p><p> 是否发现，dropdown 组件不仅仅只是一个下拉菜单或者右键菜单，它能被赋予许多的想象可能。</p></div>',
        '<div class="layui-tabs-item">Tab Content2</div>',
        '<div class="layui-tabs-item">Tab Content3</div>',
      '</div>',
    '</div>'].join(''),
    className: 'demo-dropdown-tabs',
    style: 'width: 390px; box-shadow: 1px 1px 30px rgb(0 0 0 / 12%);',
    // shade: 0.3, // 弹出时开启遮罩 --- 2.8+
    ready: function(elem) {
      tabs.render({
        elem: elem.find('.layui-tabs')
      });
    }
  });
});
</script>
