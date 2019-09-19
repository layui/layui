/**

 @Name：layui.util 工具集
 @Author：贤心
 @License：MIT
    
*/

layui.define('jquery', function(exports){
  "use strict";
  
  var $ = layui.$
  
  //外部接口
  ,util = {
    //固定块
    fixbar: function(options){
      var ELEM = 'layui-fixbar', TOP_BAR = 'layui-fixbar-top'
      ,dom = $(document), body = $('body')
      ,is, timer;

      options = $.extend({
        showHeight: 200 //出现TOP的滚动条高度临界值
      }, options);
      
      options.bar1 = options.bar1 === true ? '&#xe606;' : options.bar1;
      options.bar2 = options.bar2 === true ? '&#xe607;' : options.bar2;
      options.bgcolor = options.bgcolor ? ('background-color:' + options.bgcolor) : '';
      
      var icon = [options.bar1, options.bar2, '&#xe604;'] //图标：信息、问号、TOP
      ,elem = $(['<ul class="'+ ELEM +'">'
        ,options.bar1 ? '<li class="layui-icon" lay-type="bar1" style="'+ options.bgcolor +'">'+ icon[0] +'</li>' : ''
        ,options.bar2 ? '<li class="layui-icon" lay-type="bar2" style="'+ options.bgcolor +'">'+ icon[1] +'</li>' : ''
        ,'<li class="layui-icon '+ TOP_BAR +'" lay-type="top" style="'+ options.bgcolor +'">'+ icon[2] +'</li>'
      ,'</ul>'].join(''))
      ,topBar = elem.find('.'+TOP_BAR)
      ,scroll = function(){
        var stop = dom.scrollTop();
        if(stop >= (options.showHeight)){
          is || (topBar.show(), is = 1);
        } else {
          is && (topBar.hide(), is = 0);
        }
      };
      if($('.'+ ELEM)[0]) return;
      
      typeof options.css === 'object' && elem.css(options.css);
      body.append(elem), scroll();
      
      //bar点击事件
      elem.find('li').on('click', function(){
        var othis = $(this), type = othis.attr('lay-type');
        if(type === 'top'){
          $('html,body').animate({
            scrollTop : 0
          }, 200);
        }
        options.click && options.click.call(this, type);
      });
      
      //Top显示控制
      dom.on('scroll', function(){
        clearTimeout(timer);
        timer = setTimeout(function(){
          scroll();
        }, 100);
      }); 
    }
    
    //倒计时
    ,countdown: function(endTime, serverTime, callback){
      var that = this
      ,type = typeof serverTime === 'function'
      ,end = new Date(endTime).getTime()
      ,now = new Date((!serverTime || type) ? new Date().getTime() : serverTime).getTime()
      ,count = end - now
      ,time = [
        Math.floor(count/(1000*60*60*24)) //天
        ,Math.floor(count/(1000*60*60)) % 24 //时
        ,Math.floor(count/(1000*60)) % 60 //分
        ,Math.floor(count/1000) % 60 //秒
      ];
      
      if(type) callback = serverTime;
       
      var timer = setTimeout(function(){
        that.countdown(endTime, now + 1000, callback);
      }, 1000);
      
      callback && callback(count > 0 ? time : [0,0,0,0], serverTime, timer);
      
      if(count <= 0) clearTimeout(timer);
      return timer;
    }
    
    //某个时间在当前时间的多久前
    ,timeAgo: function(time, onlyDate){
      var that = this
      ,arr = [[], []]
      ,stamp = new Date().getTime() - new Date(time).getTime();
      
      //返回具体日期
      if(stamp > 1000*60*60*24*8){
        stamp =  new Date(time);
        arr[0][0] = that.digit(stamp.getFullYear(), 4);
        arr[0][1] = that.digit(stamp.getMonth() + 1);
        arr[0][2] = that.digit(stamp.getDate());
        
        //是否输出时间
        if(!onlyDate){
          arr[1][0] = that.digit(stamp.getHours());
          arr[1][1] = that.digit(stamp.getMinutes());
          arr[1][2] = that.digit(stamp.getSeconds());
        }
        return arr[0].join('-') + ' ' + arr[1].join(':');
      }
      
      //30天以内，返回“多久前”
      if(stamp >= 1000*60*60*24){
        return ((stamp/1000/60/60/24)|0) + '天前';
      } else if(stamp >= 1000*60*60){
        return ((stamp/1000/60/60)|0) + '小时前';
      } else if(stamp >= 1000*60*2){ //2分钟以内为：刚刚
        return ((stamp/1000/60)|0) + '分钟前';
      } else if(stamp < 0){
        return '未来';
      } else {
        return '刚刚';
      }
    }
    
    //数字前置补零
    ,digit: function(num, length){
      var str = '';
      num = String(num);
      length = length || 2;
      for(var i = num.length; i < length; i++){
        str += '0';
      }
      return num < Math.pow(10, length) ? str + (num|0) : num;
    }
    
    //转化为日期格式字符
    ,toDateString: function(time, format){
      var that = this
      ,date = new Date(time || new Date())
      ,ymd = [
        that.digit(date.getFullYear(), 4)
        ,that.digit(date.getMonth() + 1)
        ,that.digit(date.getDate())
      ]
      ,hms = [
        that.digit(date.getHours())
        ,that.digit(date.getMinutes())
        ,that.digit(date.getSeconds())
      ];

      format = format || 'yyyy-MM-dd HH:mm:ss';

      return format.replace(/yyyy/g, ymd[0])
      .replace(/MM/g, ymd[1])
      .replace(/dd/g, ymd[2])
      .replace(/HH/g, hms[0])
      .replace(/mm/g, hms[1])
      .replace(/ss/g, hms[2]);
    }
    
    //防 xss 攻击
    ,escape: function(html){
      return String(html || '').replace(/&(?!#?[a-zA-Z0-9]+;)/g, '&amp;')
      .replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/'/g, '&#39;').replace(/"/g, '&quot;');
    }
    
    //批量事件
    ,event: function(attr, obj, eventType){
      obj = util.event[attr] = $.extend(true, util.event[attr], obj) || {};
      $('body').on(eventType || 'click', '*['+ attr +']', function(){
        var othis = $(this)
        ,key = othis.attr(attr);
        obj[key] && obj[key].call(this, othis);
      });
    }
  };
  
  //监听 DOM 尺寸变化，该创意来自：http://benalman.com/projects/jquery-resize-plugin/
  !function(a,b,c){"$:nomunge";function l(){f=b[g](function(){d.each(function(){var b=a(this),c=b.width(),d=b.height(),e=a.data(this,i);(c!==e.w||d!==e.h)&&b.trigger(h,[e.w=c,e.h=d])}),l()},e[j])}var f,d=a([]),e=a.resize=a.extend(a.resize,{}),g="setTimeout",h="resize",i=h+"-special-event",j="delay",k="throttleWindow";e[j]=250,e[k]=!0,a.event.special[h]={setup:function(){if(!e[k]&&this[g])return!1;var b=a(this);d=d.add(b),a.data(this,i,{w:b.width(),h:b.height()}),1===d.length&&l()},teardown:function(){if(!e[k]&&this[g])return!1;var b=a(this);d=d.not(b),b.removeData(i),d.length||clearTimeout(f)},add:function(b){function f(b,e,f){var g=a(this),h=a.data(this,i)||{};h.w=e!==c?e:g.width(),h.h=f!==c?f:g.height(),d.apply(this,arguments)}if(!e[k]&&this[g])return!1;var d;return a.isFunction(b)?(d=b,f):(d=b.handler,b.handler=f,void 0)}}}($,window);
  
  //暴露接口
  exports('util', util);
});