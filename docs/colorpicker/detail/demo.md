<pre class="layui-code" lay-options="{preview: true, text: {preview: '常规使用'}, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<div id="ID-colorpicker-demo-1"></div>
<div id="ID-colorpicker-demo-2" style="margin-left: 16px;"></div>

<!-- import layui --> 
<script>
layui.use(function(){
  var colorpicker = layui.colorpicker;
  var layer = layui.layer;

  // 渲染
  colorpicker.render({ // eg1
    elem: '#ID-colorpicker-demo-1', // 绑定元素
    change: function(color){ // 颜色改变的回调
      layer.tips('选择了：'+ color, this.elem, {
        tips: 1
      });
    }
  });
  colorpicker.render({ // eg2
    elem: '#ID-colorpicker-demo-2',
    color: '#2ec770', // 设置默认色
    done: function(color){ // 选择完毕的回调
      layer.tips('选择了：'+ color, this.elem);
    }
  });
});
</script>
  </textarea>
</pre>

<h3 id="demo-form" class="ws-anchor ws-bold">将颜色值赋给表单</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<form class="layui-form" action="">
  <div class="layui-form-item">
    <div class="layui-input-inline" style="width: 120px;">
      <input type="text" name="color" value="" placeholder="请选择颜色" class="layui-input" id="ID-colorpicker-demo-form-color">
    </div>
    <div class="layui-inline" style="left: -11px;">
      <div id="ID-colorpicker-demo-form"></div>
    </div>
  </div>
</form>

<!-- import layui --> 
<script>
layui.use(function(){
  var colorpicker = layui.colorpicker;
  var $ = layui.$;

  // 渲染
  colorpicker.render({
    elem: '#ID-colorpicker-demo-form',
    color: '#1c97f5',
    done: function(color){
      $('#ID-colorpicker-demo-form-color').val(color);
    }
  });
});
</script>
  </textarea>
</pre>

<h3 id="demo-rgba" class="ws-anchor ws-bold">设置 RGB / RGBA</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<div id="ID-colorpicker-demo-rgb"></div>
<div id="ID-colorpicker-demo-rgba" style="margin-left: 16px;"></div>

<!-- import layui --> 
<script>
layui.use(function(){
  var colorpicker = layui.colorpicker;

  // 渲染
  colorpicker.render({ // eg1
    elem: '#ID-colorpicker-demo-rgb',
    color: 'rgb(68,66,66)',
    format: 'rgb' // 默认为 hex
  }); 
  colorpicker.render({ // eg2
    elem: '#ID-colorpicker-demo-rgba',
    color: 'rgba(68,66,66,0.5)',
    format: 'rgb',
    alpha: true // 开启透明度滑块
  });
});
</script>
  </textarea>
</pre>

<h3 id="demo-alpha" class="ws-anchor ws-bold">开启透明度</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<div id="ID-colorpicker-demo-alpha-1"></div>
<div id="ID-colorpicker-demo-alpha-2" style="margin-left: 16px;"></div>
<div id="ID-colorpicker-demo-alpha-3" style="margin-left: 16px;"></div>

<!-- import layui --> 
<script>
layui.use(function(){
  var colorpicker = layui.colorpicker;

  // 渲染
  colorpicker.render({ // eg1
    elem: '#ID-colorpicker-demo-alpha-1',
    color: '#16baaa', // hex
    alpha: true, // 开启透明度
    format: 'rgb'
  });
  colorpicker.render({ // eg2
    elem: '#ID-colorpicker-demo-alpha-2',
    color: 'rgb(0,150,136,0.6)', // rgba
    alpha: true,
    format: 'rgb'
  });
  colorpicker.render({ // eg3
    elem: '#ID-colorpicker-demo-alpha-3',
    alpha: true,
    format: 'rgb'
  });
});
</script>
  </textarea>
</pre>

<h3 id="demo-predefine" class="ws-anchor ws-bold">预定义颜色项</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<div id="ID-colorpicker-demo-predefine-1"></div>
<div id="ID-colorpicker-demo-predefine-2" style="margin-left: 16px;"></div>

<!-- import layui --> 
<script>
layui.use(function(){
  var colorpicker = layui.colorpicker;

  // 渲染
  colorpicker.render({ // eg1
    elem: '#ID-colorpicker-demo-predefine-1',
    color: '#c71585',
    predefine: true // 开启预定义颜色
  });
  colorpicker.render({ // eg2
    elem: '#ID-colorpicker-demo-predefine-2',
    color: '#9d8a0e',
    predefine: true, // 开启预定义颜色
    colors: ['#ff8c00','#00ced1','#9d8a0e'] //自定义预定义颜色项
  });
});
</script>
  </textarea>
</pre>

<h3 id="demo-all" class="ws-anchor ws-bold">全功能和回调的使用</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<button class="layui-btn" id="ID-colorpicker-demo-all-btn">主题按钮</button>
<hr>
<div id="ID-colorpicker-demo-all"></div> 
<span style="padding-left: 6px;">演示：选择颜色并确定，改变上方按钮背景色</span>

<!-- import layui --> 
<script>
layui.use(function(){
  var colorpicker = layui.colorpicker;
  var layer = layui.layer;
  var $ = layui.$;

  // 渲染
  colorpicker.render({
    elem: '#ID-colorpicker-demo-all',
    color: '#16baaa',
    predefine: true,
    alpha: true,
    done: function(color){
      layer.msg('选择的值：'+ color); // 选择完毕的颜色值
      
      // 清空或取消选择时也执行 change
      color || this.change(color); 
    },
    change: function(color){
      // 给当前页面头部和左侧设置主题色
      $('#ID-colorpicker-demo-all-btn').css('background-color', color);
    },
    cancel: function(color){ // 取消颜色选择的回调 --- 2.8+
      this.change(color);
    }
  });
});
</script>
  </textarea>
</pre>

<h3 id="demo-size" class="ws-anchor ws-bold">颜色框尺寸</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<div id="ID-colorpicker-demo-size-lg"></div>
<div id="ID-colorpicker-demo-size-sm" style="margin-left: 16px;"></div>
<div id="ID-colorpicker-demo-size-xs" style="margin-left: 16px;"></div>

<!-- import layui --> 
<script>
layui.use(function(){
  var colorpicker = layui.colorpicker;

  // 渲染
  colorpicker.render({
    elem: '#ID-colorpicker-demo-size-lg',
    size: 'lg' // 大号下拉框
  });
  colorpicker.render({
    elem: '#ID-colorpicker-demo-size-sm'
    //,size: 'sm' // 默认 sm
  });
  colorpicker.render({
    elem: '#ID-colorpicker-demo-size-xs',
    size: 'xs' // mini 下拉框
  });  
});
</script>
  </textarea>
</pre>

<h3 id="demo-class" class="ws-anchor ws-bold">同时绑定多个元素</h3>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<div class="demo-class-colorpicker" lay-options="{color: '#FF0000'}"></div>
<div class="demo-class-colorpicker" lay-options="{color: '#008000'}"></div>
<div class="demo-class-colorpicker" lay-options="{color: '#0000FF'}"></div>

<!-- import layui --> 
<script>
layui.use(function(){
  var colorpicker = layui.colorpicker;

  // 渲染
  colorpicker.render({
    elem: '.demo-class-colorpicker',
    done: function(color){
      console.log(this.elem, color);
    }
  });
});
</script>
  </textarea>
</pre>