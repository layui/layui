/**

 @Name：layui.carousel 轮播模块
 @Author：贤心
 @License：MIT
    
 */
 
layui.define('jquery', function(exports){
  "use strict";
  
  var $ = layui.$
  ,hint = layui.hint()
  ,device = layui.device()

  //外部接口
  ,carousel = {
    config: {} //全局配置项

    //设置全局项
    ,set: function(options){
      var that = this;
      that.config = $.extend({}, that.config, options);
      return that;
    }
    
    //事件监听
    ,on: function(events, callback){
      return layui.onevent.call(this, MOD_NAME, events, callback);
    }
  }
  
  //字符常量
  ,MOD_NAME = 'carousel', ELEM = '.layui-carousel', THIS = 'layui-this', SHOW = 'layui-show', HIDE = 'layui-hide', DISABLED = 'layui-disabled'
  
  ,ELEM_ITEM = '>*[carousel-item]>*', ELEM_LEFT = 'layui-carousel-left', ELEM_RIGHT = 'layui-carousel-right', ELEM_PREV = 'layui-carousel-prev', ELEM_NEXT = 'layui-carousel-next', ELEM_ARROW = 'layui-carousel-arrow', ELEM_IND = 'layui-carousel-ind'
  
  //构造器
  ,Class = function(options){
    var that = this;
    that.config = $.extend({}, that.config, carousel.config, options);
    that.render();
  };
  
  //默认配置
  Class.prototype.config = {
    width: '600px'
    ,height: '280px'
    ,full: false //是否全屏
    ,arrow: 'hover' //切换箭头默认显示状态：hover/always/none
    ,indicator: 'inside' //指示器位置：inside/outside/none
    ,autoplay: true //是否自动切换
    ,interval: 3000 //自动切换的时间间隔，不能低于800ms
    ,anim: '' //动画类型：default/updown/fade
    ,trigger: 'click' //指示器的触发方式：click/hover
    ,index: 0 //初始开始的索引
  };
  
  //轮播渲染
  Class.prototype.render = function(){
    var that = this
    ,options = that.config;

    options.elem = $(options.elem);
    if(!options.elem[0]) return;
    that.elemItem = options.elem.find(ELEM_ITEM);
    
    if(options.index < 0) options.index = 0;
    if(options.index >= that.elemItem.length) options.index = that.elemItem.length - 1;
    if(options.interval < 800) options.interval = 800;

    //是否全屏模式
    if(options.full){
      options.elem.css({
        position: 'fixed'
        ,width: '100%'
        ,height: '100%'
        ,zIndex: 9999
      });
    } else {
      options.elem.css({
        width: options.width
        ,height: options.height
      });
    }
    
    options.elem.attr('lay-anim', options.anim);
    
    //初始焦点状态
    that.elemItem.eq(options.index).addClass(THIS);

    //指示器等动作
    if(that.elemItem.length <= 1) return;
    that.indicator();
    that.arrow();
    that.autoplay();
    that.events();
  };
  
  //重置轮播
  Class.prototype.reload = function(options){
    var that = this;
    clearInterval(that.timer);
    that.config = $.extend({}, that.config, options);
    that.render();
  };
  
  //获取上一个等待条目的索引
  Class.prototype.prevIndex = function(){
    var that = this
    ,options = that.config;
    
    var prevIndex = options.index - 1;
    if(prevIndex < 0){
      prevIndex = that.elemItem.length - 1;
    }
    return prevIndex;
  };
  
  //获取下一个等待条目的索引
  Class.prototype.nextIndex = function(){
    var that = this
    ,options = that.config;
    
    var nextIndex = options.index + 1;
    if(nextIndex >= that.elemItem.length){
      nextIndex = 0;
    }
    return nextIndex;
  };
  
  //索引递增
  Class.prototype.addIndex = function(num){
    var that = this
    ,options = that.config;
    
    num = num || 1;
    options.index = options.index + num;
      
    //index不能超过轮播总数量
    if(options.index >= that.elemItem.length){
      options.index = 0;
    }
  };
  
  //索引递减
  Class.prototype.subIndex = function(num){
    var that = this
    ,options = that.config;
    
    num = num || 1;
    options.index = options.index - num;
      
    //index不能超过轮播总数量
    if(options.index < 0){
      options.index = that.elemItem.length - 1;
    }
  };
  
  //自动轮播
  Class.prototype.autoplay = function(){
    var that = this
    ,options = that.config;
    
    if(!options.autoplay) return;
    
    that.timer = setInterval(function(){
      that.slide();
    }, options.interval);
  };
  
  //箭头
  Class.prototype.arrow = function(){
    var that = this
    ,options = that.config;
    
    //模板
    var tplArrow = $([
      '<button class="layui-icon '+ ELEM_ARROW +'" lay-type="sub">'+ (options.anim === 'updown' ? '&#xe619;' : '&#xe603;') +'</button>'
      ,'<button class="layui-icon '+ ELEM_ARROW +'" lay-type="add">'+ (options.anim === 'updown' ? '&#xe61a;' : '&#xe602;') +'</button>'
    ].join(''));
    
    //预设基础属性
    options.elem.attr('lay-arrow', options.arrow);
    
    //避免重复插入
    if(options.elem.find('.'+ELEM_ARROW)[0]){
      options.elem.find('.'+ELEM_ARROW).remove();
    };
    options.elem.append(tplArrow);
    
    //事件
    tplArrow.on('click', function(){
      var othis = $(this)
      ,type = othis.attr('lay-type')
      that.slide(type);
    });
  };
  
  //指示器
  Class.prototype.indicator = function(){
    var that = this
    ,options = that.config;
    
    //模板
    var tplInd = that.elemInd = $(['<div class="'+ ELEM_IND +'"><ul>'
      ,function(){
        var li = [];
        layui.each(that.elemItem, function(index){
          li.push('<li'+ (options.index === index ? ' class="layui-this"' : '') +'></li>');
        });
        return li.join('');
      }()
    ,'</ul></div>'].join(''));
    
    //预设基础属性
    options.elem.attr('lay-indicator', options.indicator);
    
    //避免重复插入
    if(options.elem.find('.'+ELEM_IND)[0]){
      options.elem.find('.'+ELEM_IND).remove();
    };
    options.elem.append(tplInd);
    
    if(options.anim === 'updown'){
      tplInd.css('margin-top', -(tplInd.height()/2));
    }
    
    //事件
    tplInd.find('li').on(options.trigger === 'hover' ? 'mouseover' : options.trigger, function(){
      var othis = $(this)
      ,index = othis.index();
      if(index > options.index){
        that.slide('add', index - options.index);
      } else if(index < options.index){
        that.slide('sub', options.index - index);
      }
    });
  };
  
  //滑动切换
  Class.prototype.slide = function(type, num){
    var that = this
    ,elemItem = that.elemItem
    ,options = that.config
    ,thisIndex = options.index
    ,filter = options.elem.attr('lay-filter');
    
    if(that.haveSlide) return;
    
    //滑动方向
    if(type === 'sub'){
      that.subIndex(num);
      elemItem.eq(options.index).addClass(ELEM_PREV);
      setTimeout(function(){
        elemItem.eq(thisIndex).addClass(ELEM_RIGHT);
        elemItem.eq(options.index).addClass(ELEM_RIGHT);
      }, 50);
    } else { //默认递增滑
      that.addIndex(num);
      elemItem.eq(options.index).addClass(ELEM_NEXT);
      setTimeout(function(){
        elemItem.eq(thisIndex).addClass(ELEM_LEFT);
        elemItem.eq(options.index).addClass(ELEM_LEFT);
      }, 50);  
    };
    
    //移除过度类
    setTimeout(function(){
      elemItem.removeClass(THIS + ' ' + ELEM_PREV + ' ' + ELEM_NEXT + ' ' + ELEM_LEFT + ' ' + ELEM_RIGHT);
      elemItem.eq(options.index).addClass(THIS);
      that.haveSlide = false; //解锁
    }, 300);
    
    //指示器焦点
    that.elemInd.find('li').eq(options.index).addClass(THIS)
    .siblings().removeClass(THIS);
    
    that.haveSlide = true;
    
    layui.event.call(this, MOD_NAME, 'change('+ filter +')', {
      index: options.index
      ,prevIndex: thisIndex
      ,item: elemItem.eq(options.index)
    });
  };
  
  //事件处理
  Class.prototype.events = function(){
    var that = this
    ,options = that.config;
    
    if(options.elem.data('haveEvents')) return;
    
    //移入移出容器
    options.elem.on('mouseenter', function(){
      clearInterval(that.timer);
    }).on('mouseleave', function(){
      that.autoplay();
    });
    
    options.elem.data('haveEvents', true);
  };
  
  //核心入口
  carousel.render = function(options){
    var inst = new Class(options);
    return inst;
  };
  
  exports(MOD_NAME, carousel);
});

 
