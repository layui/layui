<button class="layui-btn" id="ID-dropdown-demo-content">
  自定义内容
  <i class="layui-icon layui-icon-list layui-font-14"></i>
</button>
 
<style>
.demo-dropdown-tabs{padding: 0 16px;}
</style>

<!-- import layui -->  
<script>
layui.use(function(){
  var dropdown = layui.dropdown;

  // 自定义内容
  dropdown.render({
    elem: '#ID-dropdown-demo-content',
    content: ['<div class="layui-tab layui-tab-brief">',
      '<ul class="layui-tab-title">',
        '<li class="layui-this">Tab header 1</li>',
        '<li>Tab header 2</li>',
        '<li>Tab header 3</li>',
      '</ul>',
      '<div class="layui-tab-content">',
        '<div class="layui-tab-item layui-text layui-show"><p style="padding-bottom: 10px;">在 content 属性中传入任意的 html 内容，可替代默认的下拉菜单结构，从而实现更多有趣的弹出内容。</p><p> 是否发现，dropdown 组件不仅仅只是一个下拉菜单或者右键菜单，它能被赋予许多的想象可能。</p></div>',
        '<div class="layui-tab-item">Tab body 2</div>',
        '<div class="layui-tab-item">Tab body 3</div>',
      '</div>',
    '</div>'].join(''),
    className: 'demo-dropdown-tabs',
    style: 'width: 370px; height: 200px; box-shadow: 1px 1px 30px rgb(0 0 0 / 12%);',
    // shade: 0.3, // 弹出时开启遮罩 --- 2.8+
    ready: function(){
      layui.use('element', function(element){
        element.render('tab');
      });
    }
  });
});
</script>