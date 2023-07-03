<pre class="layui-code" lay-options="{preview: true, codeStyle: 'height: 535px;', layout: ['preview', 'code'], allowParse: true, tools: ['full']}">
  <textarea>
<h3 class="ws-anchor ws-bold">倒计时</h3>

请选择要计算的日期：
<div class="layui-inline">
  <input type="text" readonly class="layui-input" id="test1" value="2099-12-31 00:00:00">
</div>
<span class="layui-word-aux layui-font-green" id="test2"></span>

<h3 class="ws-anchor ws-bold">某个时间在多久前</h3>

请选择要计算的日期：
<div class="layui-inline">
  <input type="text" readonly class="layui-input" id="test3">
</div>
<span class="layui-word-aux" id="test4"></span>
  
<h3 class="ws-anchor ws-bold">转换日期格式</h3>

请编辑格式：
<div class="layui-inline">
  <input type="text" value="yyyy-MM-dd HH:mm:ss" class="layui-input" id="test5">
</div>
<span class="layui-word-aux" id="test6"></span>
  
<h3 class="ws-anchor ws-bold">转义 HTML</h3>

<div class="layui-form">
  &lt;textarea class="layui-textarea" id="test7"&gt;
<h3>HTML Title</h3>
&lt;script&gt;
  alert(0);
&lt;/script&gt;
  &lt;/textarea&gt;
</div>
<div class="layui-btn-container" style="margin-top: 10px;">
  <button class="layui-btn" lay-on="escape">转义</button>
  <button class="layui-btn" lay-on="unescape">还原</button>
</div>

<!-- import layui --> 
<script>
layui.use(function(){
  var util = layui.util;
  var laydate = layui.laydate;
  var layer = layui.layer;
  var $ = layui.$;

  // 倒计时
  var countdown = util.countdown({
    date: '2099-12-31 00:00:00', // 目标时间值
    now: new Date(), // 当前时间，一般为服务器时间，此处以本地时间为例
    ready: function(){ // 初始操作
      clearTimeout(util.countdown.timer); // 清除旧定时器，防止多次渲染时重复执行。实际使用时不常用
    },
    clock: function(obj, inst){  // 计时中
      var str = [obj.d,'天',obj.h,'时',obj.m,'分',obj.s,'秒'].join(' ');
      lay('#test2').html(str);
      util.countdown.timer = inst.timer; // 记录当前定时器，以便在重复渲染时清除。实际使用时不常用
    },
    done: function(obj, inst){ // 计时完成
      layer.msg('Time is up');
    }
  });
  // 重置倒计时
  laydate.render({
    elem: '#test1',
    type: 'datetime',
    done: function(value){
      countdown.reload({
        date: value
      });
    }
  });
  
  
  // 某个时间在多久前
  var setTimeAgo = function(y, M, d, H, m, s){
    var str = util.timeAgo(new Date(y, M||0, d||1, H||0, m||0, s||0));
    lay('#test4').html(str);
  };
  laydate.render({
    elem: '#test3',
    type: 'datetime',
    done: function(value, date){
      setTimeAgo(
        date.year, 
        date.month - 1, 
        date.date, 
        date.hours, 
        date.minutes, 
        date.seconds
      );
    }
  });
  
  // 转换日期格式
  var toDateString = function(format){
    var dateString = util.toDateString(new Date(), format); // 执行转换日期格式的方法
    $('#test6').html(dateString);
  };
  toDateString($('#test5').val());
  // 输入框事件
  $('#test5').on('input propertychange', function(){
    toDateString(this.value);
  });
  
  // HTML 转义
  util.event('lay-on', {
    escape: function(){ // 转义
      var textarea = $('#test7');
      var value = textarea.val();
      var str = util.escape(value); // 执行转义方法
      textarea.val(str);
    },
    unescape: function(){
      var textarea = $('#test7');
      var value = textarea.val();
      var str = util.unescape(value); // 执行转义方法
      textarea.val(str);
    }
  });
  
});
</script>
  </textarea>
</pre>
