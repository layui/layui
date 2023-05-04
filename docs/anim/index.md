---
title: 动画
toc: true
---

<style>
.ws-docs-anim > div{padding: 16px; transition: all .3s;}
.ws-docs-anim > div:hover{background-color: #f2f2f2; color: #000;}
.ws-docs-anim > div .layui-anim{width: 125px; height: 125px; line-height: 125px; margin: 0 auto 10px; text-align: center; background-color: #16baaa; cursor: pointer; color: #fff; border-radius: 50%; user-select: none;}
.ws-docs-anim > div > div{text-align: center; white-space: nowrap;}
</style>
 
# 动画

> Layui 内置了几种常见的 `CSS3` 动画。

<h2 id="usage" lay-toc="">示例</h2>

<pre class="layui-code" lay-options="{preview: true, layout: ['preview', 'code'], codeStyle: 'height: 535px;'}">
  <textarea>
<div class="layui-anim" id="example-anim-element" style="padding: 16px 0;">
  目标元素
</div>
<button class="layui-btn layui-btn-primary" id="example-anim-usage">点击触发动画</button>
<p>旋转动画加自动循环：</p>
<button class="layui-btn">
  <i class="layui-icon layui-icon-loading layui-anim layui-anim-rotate layui-anim-loop"></i>
</button>

<!-- import layui -->
<script>
layui.use(function(){
  var $ = layui.$;
  var elem = $('#example-anim-element');
  var animName = 'layui-anim-down'; // 动画类名
  
  // 通过事件简单演示动画过程
  $('#example-anim-usage').on('click', function(){
    elem.removeClass(animName);
    setTimeout(function(){
      elem.addClass(animName); // 给目标元素追加「往下滑入」的动画
    }); 
  });
});
</script>
  </textarea>
</pre>

对需要动画的标签添加 `class="layui-anim"` 基础类，再追加其他不同的动画类，即可让元素产生动画。

<h2 id="list" lay-toc="">动画列表</h2>

点击下述绿色圆体，即可预览不同类名的动画效果。

<pre class="layui-code" lay-options="{preview: true, layout: ['preview'], tools: ['full']}">
  <textarea>
<div class="layui-row ws-docs-anim">
  <div class="layui-col-sm3">
    <div class="layui-anim" data-anim="layui-anim-down">顶部往下滑入</div>
    <div>layui-anim-down</div>
  </div>
  <div class="layui-col-sm3">
    <div class="layui-anim" data-anim="layui-anim-up">底部往上滑入</div>
    <div>layui-anim-up</div>
  </div>
  <div class="layui-col-sm3">
    <div class="layui-anim" data-anim="layui-anim-downbit">微微往下滑入</div>
    <div>layui-anim-downbit</div>
  </div>
  <div class="layui-col-sm3">
    <div class="layui-anim" data-anim="layui-anim-upbit">微微往上滑入</div>
    <div>layui-anim-upbit</div>
  </div>
  <div class="layui-col-sm3">
    <div class="layui-anim" data-anim="layui-anim-scale">平滑放大</div>
    <div>layui-anim-scale</div>
  </div>
  <div class="layui-col-sm3">
    <div class="layui-anim" data-anim="layui-anim-scaleSpring">弹簧式放大</div>
    <div>layui-anim-scaleSpring</div>
  </div>
  <div class="layui-col-sm3">
    <div class="layui-anim" data-anim="layui-anim-scalesmall">平滑放小</div>
    <div>layui-anim-scalesmall</div>
  </div>
  <div class="layui-col-sm3">
    <div class="layui-anim" data-anim="layui-anim-scalesmall-spring">弹簧式放小</div>
    <div>layui-anim-scalesmall-spring</div>
  </div>
  <div class="layui-col-sm3">
    <div class="layui-anim" data-anim="layui-anim-fadein">渐现</div>
    <div>layui-anim-fadein</div>
  </div>
  <div class="layui-col-sm3">
    <div class="layui-anim" data-anim="layui-anim-fadeout">渐隐</div>
    <div>layui-anim-fadeout</div>
  </div>
  <div class="layui-col-sm3">
    <div class="layui-anim" data-anim="layui-anim-rotate">360 度旋转</div>
    <div>layui-anim-rotate</div>
  </div>
  <div class="layui-col-sm3">
    <div class="layui-anim" data-anim="layui-anim-rotate layui-anim-loop">循环动画</div>
    <div>追加：layui-anim-loop</div>
  </div>
</div>

<script>
layui.use(function(){
  var $ = layui.$;
  
  //演示动画
  $('.ws-docs-anim .layui-anim').on('click', function(){
    var othis = $(this), anim = othis.data('anim');
 
    //停止循环
    if(othis.hasClass('layui-anim-loop')){
      return othis.removeClass(anim);
    }
    
    othis.removeClass(anim);
    
    setTimeout(function(){
      othis.addClass(anim);
    });
    //恢复渐隐
    if(anim === 'layui-anim-fadeout'){
      setTimeout(function(){
        othis.removeClass(anim);
      }, 1300);
    }
  });
});
</script>
  </textarea>
</pre>


