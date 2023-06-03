<pre class="layui-code" lay-options="{preview: true, text: {preview: '基础用法'}, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<div id="ID-rate-demo"></div>

<!-- import layui -->
<script>
layui.use(function(){
  var rate = layui.rate;

  // 渲染
  rate.render({
    elem: '#ID-rate-demo'
  });
});
</script>
  </textarea>
</pre>

<h3 id="demo-text" class="ws-anchor ws-bold">显示文字</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<div id="ID-rate-demo-text"></div>

<!-- import layui -->
<script>
layui.use(function(){
  var rate = layui.rate;

  // 渲染
  rate.render({
    elem: '#ID-rate-demo-text',
    value: 2, // 初始值
    text: true // 开启文本
  });
});
</script>
  </textarea>
</pre>

<h3 id="demo-half" class="ws-anchor ws-bold">半星效果</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<div id="ID-rate-demo-half-1"></div>
<hr>
<div id="ID-rate-demo-half-2"></div>

<!-- import layui -->
<script>
layui.use(function(){
  var rate = layui.rate;

  // 渲染
  rate.render({ // eg1
    elem: '#ID-rate-demo-half-1',
    value: 2.5, // 初始值
    half: true // 开启半星
  });
  rate.render({ // eg2
    elem: '#ID-rate-demo-half-2',
    value: 3.5,
    half: true,
    text: true
  });
});
</script>
  </textarea>
</pre>

<h3 id="demo-setText" class="ws-anchor ws-bold">自定义文本</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<div id="ID-rate-demo-setText-1"></div>
<hr>
<div id="ID-rate-demo-setText-2"></div>

<!-- import layui -->
<script>
layui.use(function(){
  var rate = layui.rate;

  // 渲染
  rate.render({ // eg1
    elem: '#ID-rate-demo-setText-1',
    value: 3,
    text: true,
    setText: function(value){ // 自定义文本的初始回调
      var arrs = {
        '1': '非常不满意',
        '2': '不满意',
        '3': '一般',
        '4': '满意',
        '5': '非常满意',
      };
      this.span.text(arrs[value] || ( value + "星"));
    }
  });
  rate.render({ // eg2
    elem: '#ID-rate-demo-setText-2',
    value: 1.5,
    half: true,
    text: true,
    setText: function(value){
      this.span.text(value);
    }
  });
});
</script>
  </textarea>
</pre>

<h3 id="demo-length" class="ws-anchor ws-bold">自定义长度</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<div id="ID-rate-demo-length-1"></div>
<hr>
<div id="ID-rate-demo-length-2"></div>

<!-- import layui -->
<script>
layui.use(function(){
  var rate = layui.rate;

  // 渲染
  rate.render({
    elem: '#ID-rate-demo-length-1',
    length: 3
  });
  rate.render({
    elem: '#ID-rate-demo-length-2',
    length: 10,
    value: 8 // 初始值
  });
});
</script>
  </textarea>
</pre>

<h3 id="demo-readonly" class="ws-anchor ws-bold">只读</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<div id="ID-rate-demo-readonly"></div>

<!-- import layui -->
<script>
layui.use(function(){
  var rate = layui.rate;

  // 渲染
  rate.render({
    elem: '#ID-rate-demo-readonly',
    value: 4,
    readonly: true
  });
});
</script>
  </textarea>
</pre>

<h3 id="demo-theme" class="ws-anchor ws-bold">自定义主题色</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<div class="class-rate-demo-theme" lay-options="{value: 3, theme: '#FF8000'}"></div>
<hr>
<div class="class-rate-demo-theme" lay-options="{value: 3, theme: '#FE0000'}"></div>
<hr>
<div class="class-rate-demo-theme" lay-options="{value: 2.5, theme: '#1E9FFF', half: true}"></div>

<!-- import layui -->
<script>
layui.use(function(){
  var rate = layui.rate;

  // 批量渲染
  rate.render({
    elem: '.class-rate-demo-theme',
    // theme: '#FF8000' // 自定义主题色
  });
});
</script>
  </textarea>
</pre>