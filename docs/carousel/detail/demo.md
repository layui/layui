<h3 lay-toc="{level: 2, id: 'examples'}" class="lay-hide">常规用法</h3>

<pre class="lay-code" lay-options="{preview: true, codeStyle: 'height: 515px;', text: {preview: '常规用法'}, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<div class="lay-carousel" id="ID-carousel-demo-1">
  <div carousel-item>
    <div>条目1</div>
    <div>条目2</div>
    <div>条目3</div>
    <div>条目4</div>
    <div>条目5</div>
  </div>
</div> 
 
<hr class="ws-space-16">
 
<div class="lay-carousel" id="ID-carousel-demo-2">
  <div carousel-item>
    <div>条目1</div>
    <div>条目2</div>
  </div>
</div>

<!-- import layui --> 
<script>
layui.use(function(){
  var carousel = layui.carousel;

  // 渲染 - 常规轮播
  carousel.render({
    elem: '#ID-carousel-demo-1',
    width: 'auto'
  });
  
  // 渲染 - 设置时间间隔、动画类型、宽高度等属性
  carousel.render({
    elem: '#ID-carousel-demo-2',
    interval: 1800,
    anim: 'fade',
    width: 'auto',
    height: '120px'
  });
});
</script>
  </textarea>
</pre>

- 在元素外层设置 `class="lay-carousel"` 来定义一个轮播容器
- 在元素内层设置属性 `carousel-item` 用来定义条目容器

<h3 id="demo-config" lay-toc="{level: 2, hot: true}">可选项预览</h3>

<pre class="lay-code" lay-options="{preview: true, codeStyle: 'height: 515px;', layout: ['preview', 'code'], tools: ['full'], done: function(obj){
  obj.render();
}}">
  <textarea>
<div class="lay-form">
  <div class="lay-form-item">
    <div class="lay-inline">
      <label class="lay-form-label">宽高</label>
      <div class="lay-input-inline" style="width: 98px;">
        <input type="tel" name="width" value="600" autocomplete="off" placeholder="width" class="lay-input carousel-demo-set">
      </div>
      <div class="lay-input-inline" style="width: 98px;">
        <input type="tel" name="height" value="280" autocomplete="off" placeholder="height" class="lay-input carousel-demo-set">
      </div>
    </div>
  </div>
  <div class="lay-form-item">
    <label class="lay-form-label">动画类型</label>
    <div class="lay-input-block">
      <div class="lay-btn-group" style="margin-top: 5px;">
        <button class="lay-btn lay-btn-sm" style="background-color: #16b777;" lay-on="carousel-set" data-key="anim" data-value="default">左右切换</button>
        <button class="lay-btn lay-btn-sm" lay-on="carousel-set" data-key="anim" data-value="updown">上下切换</button>
        <button class="lay-btn lay-btn-sm" lay-on="carousel-set" data-key="anim" data-value="fade">渐隐渐显</button>
      </div> 
    </div>
  </div>
  <div class="lay-form-item">
    <label class="lay-form-label">箭头状态</label>
    <div class="lay-input-block">
      <div class="lay-btn-group" style="margin-top: 5px;">
        <button class="lay-btn lay-btn-sm" style="background-color: #16b777;" lay-on="carousel-set" data-key="arrow" data-value="hover">悬停显示</button>
        <button class="lay-btn lay-btn-sm" lay-on="carousel-set" data-key="arrow" data-value="always">始终显示</button>
        <button class="lay-btn lay-btn-sm" lay-on="carousel-set" data-key="arrow" data-value="none">不显示</button>
      </div> 
    </div>
  </div>
  <div class="lay-form-item">
    <label class="lay-form-label">指示器位置</label>
    <div class="lay-input-block">
      <div class="lay-btn-group" style="margin-top: 5px;">
        <button class="lay-btn lay-btn-sm" style="background-color: #16b777;" data-key="indicator" lay-on="carousel-set" data-value="inside">容器内部</button>
        <button class="lay-btn lay-btn-sm" lay-on="carousel-set" data-key="indicator" data-value="outside">容器外部</button>
        <button class="lay-btn lay-btn-sm" lay-on="carousel-set" data-key="indicator" data-value="none">不显示</button>
      </div> 
    </div>
  </div>
  <div class="lay-form-item">
    <div class="lay-inline">
      <label class="lay-form-label">自动切换</label>
      <div class="lay-input-block">
        <!--<input type="checkbox" name="switch" lay-skin="switch" checked lay-text="ON|OFF" lay-filter="autoplay">-->
        <select lay-filter="autoplay">
          <option value="1">开启</option>
          <option value="0">关闭</option>
          <option value="always">always</option>
        </select>
      </div>
    </div>
    <div class="lay-inline">
      <label class="lay-form-label" style="width: auto;">时间间隔</label>
      <div class="lay-input-inline" style="width: 120px;">
        <input type="tel" name="interval" value="3000" autocomplete="off" placeholder="毫秒" class="lay-input carousel-demo-set">
      </div>
    </div>
  </div>
</div>
 
<div class="lay-carousel" id="ID-carousel-demo-set" lay-filter="filter-demo-carousel-set">
  <div carousel-item>
    <div>条目1</div>
    <div>条目2</div>
    <div>条目3</div>
    <div>条目4</div>
    <div>条目5</div>
  </div>
</div> 

<!-- import layui -->
<script>
layui.use(function(){
  var carousel = layui.carousel;
  var form = layui.form;
  var util = layui.util;
  var $ = layui.$;

  // 渲染
  var carInst = carousel.render({
    elem: '#ID-carousel-demo-set'
  });

  // 开关事件
  form.on('switch(autoplay)', function(){
    // 重载轮播
    carInst.reload({
      autoplay: this.checked
    });
  });

  // 自动播放控制
  form.on('select(autoplay)', function (obj) {
    // debugger;
    var autoplayValue = parseInt(obj.value);
    // 重载轮播
    carInst.reload({
      autoplay: isNaN(autoplayValue) ? obj.value : autoplayValue
    });
  });

  // 输入框事件
  $('.carousel-demo-set').on('input propertychange', function(){
    var value = this.value;
    var options = {};

    //if(!/^\d+$/.test(value)) return;
    
    options[this.name] = value;
    carInst.reload(options); // 重载轮播
  });

  // 普通事件
  util.on('lay-on', {
    "carousel-set": function(othis){
      var THIS = 'lay-bg-normal';
      var key = othis.data('key');
      var options = {};
      
      othis.css('background-color', '#16b777').siblings().removeAttr('style'); 
      options[key] = othis.data('value');
      carInst.reload(options); // 重载轮播
    }
  });
});
</script>
  </textarea>
</pre>

<h3 id="demo-image" lay-toc="{level: 2}">填充图片轮播</h3>

<pre class="lay-code" lay-options="{preview: true, layout: ['preview', 'code'], tools: ['full']}">
  <textarea>
<div class="lay-carousel" id="ID-carousel-demo-image">
  <div carousel-item>
    <div><img src="https://unpkg.com/outeres/demo/carousel/720x360-1.jpg"></div>
    <div><img src="https://unpkg.com/outeres/demo/carousel/720x360-2.jpg"></div>
    <div><img src="https://unpkg.com/outeres/demo/carousel/720x360-3.jpg"></div>
    <div><img src="https://unpkg.com/outeres/demo/carousel/720x360-4.jpg"></div>
    <div><img src="https://unpkg.com/outeres/demo/carousel/720x360-5.jpg"></div>
  </div>
</div>

<!-- import layui -->
<script>
layui.use(function(){
  var carousel = layui.carousel;

  // 渲染 - 图片轮播
  carousel.render({
    elem: '#ID-carousel-demo-image',
    width: '720px',
    height: '360px',
    interval: 3000
  });
});
</script>
  </textarea>
</pre>

