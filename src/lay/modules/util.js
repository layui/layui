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
      var stamp = new Date().getTime() - new Date(time).getTime();
      
      //超过30天，返回具体日期
      if(stamp > 1000*60*60*24*30){
        stamp =  new Date(time).toLocaleString();
        onlyDate && (stamp = stamp.replace(/\s[\S]+$/g, ''));
        return stamp;
      }
      
      //30天以内，返回“多久前”
      if(stamp >= 1000*60*60*24){
        return ((stamp/1000/60/60/24)|0) + '天前';
      } else if(stamp >= 1000*60*60){
        return ((stamp/1000/60/60)|0) + '小时前';
      } else if(stamp >= 1000*60*3){ //3分钟以内为：刚刚
        return ((stamp/1000/60)|0) + '分钟前';
      } else if(stamp < 0){
        return '未来';
      } else {
        return '刚刚';
      }
    }
  };
  
  exports('util', util);
});