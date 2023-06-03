<pre class="layui-code" lay-options="{preview: true, text: {preview: '基础用法'}, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<div id="ID-slider-demo"></div>

<!-- import layui -->
<script>
layui.use(function(){
  var slider = layui.slider;

  // 渲染
  slider.render({
    elem: '#ID-slider-demo'
  });
});
</script>
  </textarea>
</pre>

<h3 id="demo-value" class="ws-anchor ws-bold">定义初始值</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<div id="ID-slider-demo-value"></div>

<!-- import layui -->
<script>
layui.use(function(){
  var slider = layui.slider;

  // 渲染
  slider.render({
    elem: '#ID-slider-demo-value',
    value: 20 //初始值
  });
});
</script>
  </textarea>
</pre>

<h3 id="demo-maxmin" class="ws-anchor ws-bold">设置最大和最小值</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<div id="ID-slider-demo-maxmin"></div>

<!-- import layui -->
<script>
layui.use(function(){
  var slider = layui.slider;

  // 渲染
  slider.render({
    elem: '#ID-slider-demo-maxmin',
    min: 20, // 最小值
    max: 50 // 最大值
  });
});
</script>
  </textarea>
</pre>

<h3 id="demo-step" class="ws-anchor ws-bold">设置步长</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<div id="ID-slider-demo-step-1"></div>
<hr class="ws-space-16">
<div id="ID-slider-demo-step-2"></div>

<!-- import layui -->
<script>
layui.use(function(){
  var slider = layui.slider;

  // 渲染
  slider.render({
    elem: '#ID-slider-demo-step-1',
    step: 10 // 步长
  });
  
  slider.render({
    elem: '#ID-slider-demo-step-2',
    step: 10, // 步长
    showstep: true // 开启间隔点
  });
});
</script>
  </textarea>
</pre>

<h3 id="demo-setTips" class="ws-anchor ws-bold">设置提示文本</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<div id="ID-slider-demo-setTips-1"></div>
<hr class="ws-space-16">
<div id="ID-slider-demo-setTips-2"></div>
<div id="ID-slider-demo-setTips-result"></div>

<!-- import layui -->
<script>
layui.use(function(){
  var slider = layui.slider;
  var $ = layui.$;

  // 渲染
  slider.render({
    elem: '#ID-slider-demo-setTips-1',
    min: 20,
    max: 1000,
    setTips: function(value){ // 自定义提示文本
     return value + 'GB';
    }
  });
  slider.render({
    elem: '#ID-slider-demo-setTips-2',
    tips: false, // 关闭默认提示层
    change: function(value){
      $('#ID-slider-demo-setTips-result').html('当前数值：'+ value);
    }
  });
});
</script>
  </textarea>
</pre>

<h3 id="demo-input" class="ws-anchor ws-bold">开启输入框</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<div id="ID-slider-demo-input"></div>

<!-- import layui -->
<script>
layui.use(function(){
  var slider = layui.slider;

  // 渲染
  slider.render({
    elem: '#ID-slider-demo-input',
    input: true //输入框
  });
});
</script>
  </textarea>
</pre>

<h3 id="demo-range" class="ws-anchor ws-bold">开启范围选择</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<div id="ID-slider-demo-range-1"></div>
<hr class="ws-space-16">
<div id="ID-slider-demo-range-2"></div>

<!-- import layui -->
<script>
layui.use(function(){
  var slider = layui.slider;
  var layer = layui.layer;

  // 渲染
  slider.render({
    elem: '#ID-slider-demo-range-1',
    value: 40, // 初始值
    range: true, // 范围选择
    done: function(vals){
      layer.msg('开始值：'+ vals[0] + '、结尾值：'+ vals[1]);
    }
  });
  slider.render({
    elem: '#ID-slider-demo-range-2',
    value: [30, 60], // 初始值
    range: true // 范围选择
  });
});
</script>
  </textarea>
</pre>

<h3 id="demo-vertical" class="ws-anchor ws-bold">垂直滑块</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<br><br>    
<div class="layui-inline" style="margin-right: 32px;" id="ID-slider-demo-vertical-1"></div>
<div class="layui-inline" style="margin-right: 32px;" id="ID-slider-demo-vertical-2"></div>
<div class="layui-inline" style="margin-right: 32px;" id="ID-slider-demo-vertical-3"></div>
<div class="layui-inline" id="ID-slider-demo-vertical-4"></div>

<!-- import layui -->
<script>
layui.use(function(){
  var slider = layui.slider;

  // 渲染
  slider.render({
    elem: '#ID-slider-demo-vertical-1',
    type: 'vertical' // 垂直滑块
  });
  slider.render({
    elem: '#ID-slider-demo-vertical-2',
    value: 30,
    type: 'vertical' // 垂直滑块
  });
  slider.render({
    elem: '#ID-slider-demo-vertical-3',
    value: 50,
    range: true, // 范围选择
    type: 'vertical' // 垂直滑块
  });
  slider.render({
    elem: '#ID-slider-demo-vertical-4',
    value: 80,
    input: true, // 输入框
    type: 'vertical' // 垂直滑块
  });
});
</script>
  </textarea>
</pre>

<h3 id="demo-theme" class="ws-anchor ws-bold">自定义主题色</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<div id="ID-slider-demo-theme-1"></div>
<hr class="ws-space-16">
<div id="ID-slider-demo-theme-2"></div>
<hr class="ws-space-16">
<div id="ID-slider-demo-theme-3"></div>

<!-- import layui -->
<script>
layui.use(function(){
  var slider = layui.slider;

  // 渲染
  slider.render({
    elem: '#ID-slider-demo-theme-1',
    theme: '#1E9FFF' // 主题色
  });
  slider.render({
    elem: '#ID-slider-demo-theme-2',
    value: 50,
    theme: '#16b777' // 主题色
  });
  slider.render({
    elem: '#ID-slider-demo-theme-3',
    value: [30, 70],
    range: true,
    theme: '#FF5722' // 主题色
  });
});
</script>
  </textarea>
</pre>

<h3 id="demo-disabled" class="ws-anchor ws-bold">禁用滑块</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<div id="ID-slider-demo-disabled"></div>

<!-- import layui -->
<script>
layui.use(function(){
  var slider = layui.slider;

  // 渲染
  slider.render({
    elem: '#ID-slider-demo-disabled',
    value: 35,
    disabled: true // 禁用滑块
  });
});
</script>
  </textarea>
</pre>