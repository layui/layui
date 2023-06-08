<pre class="layui-code" lay-options="{preview: true, text: {preview: '动态操作'}, codeStyle: 'height: 535px', layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<div class="layui-tab" lay-filter="test-handle" lay-allowclose="true">
  <ul class="layui-tab-title">
    <li class="layui-this" lay-id="11">标签1</li>
    <li lay-id="22">标签2</li>
    <li lay-id="33">标签3</li>
    <li lay-id="44">标签4</li>
    <li lay-id="55">标签5</li>
  </ul>
  <div class="layui-tab-content">
    <div class="layui-tab-item layui-show">内容-1</div>
    <div class="layui-tab-item">内容-2</div>
    <div class="layui-tab-item">内容-3</div>
    <div class="layui-tab-item">内容-4</div>
    <div class="layui-tab-item">内容-5</div>
  </div>
</div>
 
<div class="layui-btn-container">
  <button class="layui-btn" lay-on="tabAdd">新增 tab 项</button>
  <button class="layui-btn" lay-on="tabDelete">删除「标签4」</button>
  <button class="layui-btn" lay-on="tabChange">切换到「标签3」</button>
</div>

<!-- import layui -->
<script>
layui.use(function(){
  var element = layui.element;
  var util = layui.util;

  // 普通事件
  util.on('lay-on', {
    tabAdd: function(){
      // 新增一个 tab 项
      var label = (Math.random()*1000|0); // 标记 - 用于演示
      element.tabAdd('test-handle', {
        title: '新选项'+ label,
        content: '内容-'+ label,
        id: new Date().getTime(), // 实际使用一般是规定好的id，这里以毫秒数模拟
        change: true // 是否添加完毕后即自动切换
      })
    },
    tabDelete: function(othis){
      // 删除指定 tab 项
      element.tabDelete('test-handle', '44'); // 删除：“商品管理”
      othis.addClass('layui-btn-disabled');
    },
    tabChange: function(){
      // 切换到指定 tab 项
      element.tabChange('test-handle', '33'); // 切换到：标签3
    }
  });
});
</script>
  </textarea>
</pre>

<h3 id="hash-match" class="ws-anchor ws-bold">hash 状态匹配</h3>

切换 tab 标签项后，地址栏同步 `hash` 值，当页面刷新时，tab 仍保持对应的切换状态。

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], codeStyle: 'height: 535px', tools: ['full']}">
  <textarea>
<div class="layui-tab" lay-filter="test-hash">
  <ul class="layui-tab-title">
    <li class="layui-this" lay-id="11">标签1</li>
    <li lay-id="22">标签2</li>
    <li lay-id="33">标签3</li>
    <li lay-id="44">标签4</li>
    <li lay-id="55">标签5</li>
  </ul>
  <div class="layui-tab-content">
    <div class="layui-tab-item layui-show">内容-1</div>
    <div class="layui-tab-item">内容-2</div>
    <div class="layui-tab-item">内容-3</div>
    <div class="layui-tab-item">内容-4</div>
    <div class="layui-tab-item">内容-5</div>
  </div>
</div>

<!-- import layui -->
<script>
layui.use(function(){
  var element = layui.element;
  
  // hash 地址定位
  var hashName = 'tabid'; // hash 名称
  var layid = location.hash.replace(new RegExp('^#'+ hashName + '='), ''); // 获取 lay-id 值
    
  // 初始切换
  element.tabChange('test-hash', layid);
  // 切换事件
  element.on('tab(test-hash)', function(obj){
    location.hash = hashName +'='+ this.getAttribute('lay-id');
  });
});
</script>
  </textarea>
</pre>