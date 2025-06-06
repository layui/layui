/**
 * carousel 轮播模块
 * MIT Licensed
 */

layui.define(['jquery', 'lay'], function(exports) {
  "use strict";

  var $ = layui.$;
  var lay = layui.lay;

  var hint = layui.hint();
  var device = layui.device();

  // 外部接口
  var carousel = {
    config: {}, // 全局配置项

    // 设置全局项
    set: function(options) {
      var that = this;
      that.config = $.extend({}, that.config, options);
      return that;
    },

    // 事件
    on: function(events, callback) {
      return layui.onevent.call(this, MOD_NAME, events, callback);
    }
  };

  // 字符常量
  var MOD_NAME = 'carousel';
  var ELEM = '.layui-carousel';
  var THIS = 'layui-this';
  var SHOW = 'layui-show';
  var HIDE = 'layui-hide';
  var DISABLED = 'layui-disabled'

  var ELEM_ITEM = '>*[carousel-item]>*';
  var ELEM_LEFT = 'layui-carousel-left';
  var ELEM_RIGHT = 'layui-carousel-right';
  var ELEM_PREV = 'layui-carousel-prev';
  var ELEM_NEXT = 'layui-carousel-next';
  var ELEM_ARROW = 'layui-carousel-arrow';
  var ELEM_IND = 'layui-carousel-ind';

  // 构造器
  var Class = function(options) {
    var that = this;
    that.config = $.extend({}, that.config, carousel.config, options);
    that.render();
  };

  // 默认配置
  Class.prototype.config = {
    width: '600px',
    height: '280px',
    full: false, // 是否全屏
    arrow: 'hover', // 切换箭头默认显示状态：hover/always/none
    indicator: 'inside', // 指示器位置：inside/outside/none
    autoplay: true, // 是否自动切换
    interval: 3000, // 自动切换的时间间隔，不能低于800ms
    anim: '', // 动画类型：default/updown/fade
    trigger: 'click', // 指示器的触发方式：click/hover
    index: 0 // 初始开始的索引
  };

  // 轮播渲染
  Class.prototype.render = function(){
    var that = this;
    var options = that.config;

    // 若 elem 非唯一，则拆分为多个实例
    var elem = $(options.elem);
    if(elem.length > 1){
      layui.each(elem, function(){
        carousel.render($.extend({}, options, {
          elem: this
        }));
      });
      return that;
    }

    // 合并 lay-options 属性上的配置信息
    $.extend(options, lay.options(elem[0]));

    options.elem = $(options.elem);
    if(!options.elem[0]) return;
    that.elemItem = options.elem.find(ELEM_ITEM);

    if(options.index < 0) options.index = 0;
    if(options.index >= that.elemItem.length) options.index = that.elemItem.length - 1;
    if(options.interval < 800) options.interval = 800;

    // 是否全屏模式
    if(options.full){
      options.elem.css({
        position: 'fixed',
        width: '100%',
        height: '100%',
        zIndex: 9999
      });
    } else {
      options.elem.css({
        width: options.width,
        height: options.height
      });
    }

    options.elem.attr('lay-anim', options.anim);

    // 初始焦点状态
    that.elemItem.eq(options.index).addClass(THIS);

    // 指示器、箭头等动作
    that.indicator();
    that.arrow();
    that.autoplay();

    if (that.elemItem.length > 1) {
      that.events();
    }
  };

  // 重置轮播
  Class.prototype.reload = function(options){
    var that = this;
    clearInterval(that.timer);
    that.config = $.extend({}, that.config, options);
    that.render();
  };

  // 获取上一个等待条目的索引
  Class.prototype.prevIndex = function(){
    var that = this;
    var options = that.config;
    var prevIndex = options.index - 1;

    if(prevIndex < 0){
      prevIndex = that.elemItem.length - 1;
    }

    return prevIndex;
  };

  // 获取下一个等待条目的索引
  Class.prototype.nextIndex = function(){
    var that = this;
    var options = that.config;
    var nextIndex = options.index + 1;

    if(nextIndex >= that.elemItem.length){
      nextIndex = 0;
    }

    return nextIndex;
  };

  // 索引递增
  Class.prototype.addIndex = function(num){
    var that = this;
    var options = that.config;

    num = num || 1;
    options.index = options.index + num;

    // index 不能超过轮播总数量
    if(options.index >= that.elemItem.length){
      options.index = 0;
    }
  };

  // 索引递减
  Class.prototype.subIndex = function(num){
    var that = this;
    var options = that.config;

    num = num || 1;
    options.index = options.index - num;

    // index 不能超过轮播总数量
    if(options.index < 0){
      options.index = that.elemItem.length - 1;
    }
  };

  // 自动轮播
  Class.prototype.autoplay = function(){
    var that = this;
    var options = that.config;
    var itemsCount = that.elemItem.length;

    if(!options.autoplay) return;
    clearInterval(that.timer);

    if (itemsCount > 1) {
      that.timer = setInterval(function(){
        that.slide();
      }, options.interval);
    }
  };

  // 箭头
  Class.prototype.arrow = function(){
    var that = this;
    var options = that.config;
    var itemsCount = that.elemItem.length;

    // 模板
    var tplArrow = $([
      '<button type="button" class="layui-icon '+ (options.anim === 'updown' ? 'layui-icon-up' : 'layui-icon-left') + ' ' + ELEM_ARROW +'" lay-type="sub"></button>',
      '<button type="button" class="layui-icon '+ (options.anim === 'updown' ? 'layui-icon-down' : 'layui-icon-right') + ' ' + ELEM_ARROW +'" lay-type="add"></button>'
    ].join(''));

    // 预设基础属性
    options.elem.attr('lay-arrow', options.arrow);

    // 避免重复插入
    if(options.elem.find('.'+ELEM_ARROW)[0]){
      options.elem.find('.'+ELEM_ARROW).remove();
    }
    itemsCount > 1 ? options.elem.append(tplArrow) : tplArrow.remove();

    // 事件
    tplArrow.on('click', function(){
      var othis = $(this);
      var type = othis.attr('lay-type')
      that.slide(type);
    });
  };

  // 跳转到特定下标
  Class.prototype.goto = function(index){
    var that = this;
    var options = that.config;

    if(index > options.index){
      that.slide('add', index - options.index);
    } else if(index < options.index){
      that.slide('sub', options.index - index);
    }
  }

  // 指示器
  Class.prototype.indicator = function(){
    var that = this;
    var options = that.config;
    var itemsCount = that.elemItem.length;

    // 模板
    var tplInd = that.elemInd = $(['<div class="'+ ELEM_IND +'"><ul>',
      function(){
        var li = [];
        layui.each(that.elemItem, function(index){
          li.push('<li'+ (options.index === index ? ' class="layui-this"' : '') +'></li>');
        });
        return li.join('');
      }(),
    '</ul></div>'].join(''));

    // 预设基础属性
    options.elem.attr('lay-indicator', options.indicator);

    // 避免重复插入
    if(options.elem.find('.'+ELEM_IND)[0]){
      options.elem.find('.'+ELEM_IND).remove();
    }

    itemsCount > 1 ? options.elem.append(tplInd) : tplInd.remove();

    if(options.anim === 'updown'){
      tplInd.css('margin-top', -(tplInd.height()/2));
    }

    // 事件
    tplInd.find('li').on(options.trigger === 'hover' ? 'mouseover' : options.trigger, function(){
      that.goto($(this).index());
    });
  };

  // 滑动切换
  Class.prototype.slide = function(type, num){
    var that = this;
    var elemItem = that.elemItem;
    var itemsCount = elemItem.length;
    var options = that.config;
    var thisIndex = options.index;
    var filter = options.elem.attr('lay-filter');

    if (that.haveSlide || itemsCount <= 1) return;

    // 滑动方向
    if(type === 'sub'){
      that.subIndex(num);
      elemItem.eq(options.index).addClass(ELEM_PREV);
      setTimeout(function(){
        elemItem.eq(thisIndex).addClass(ELEM_RIGHT);
        elemItem.eq(options.index).addClass(ELEM_RIGHT);
      }, 50);
    } else { // 默认递增滑
      that.addIndex(num);
      elemItem.eq(options.index).addClass(ELEM_NEXT);
      setTimeout(function(){
        elemItem.eq(thisIndex).addClass(ELEM_LEFT);
        elemItem.eq(options.index).addClass(ELEM_LEFT);
      }, 50);
    }

    // 移除过渡类
    setTimeout(function(){
      elemItem.removeClass(THIS + ' ' + ELEM_PREV + ' ' + ELEM_NEXT + ' ' + ELEM_LEFT + ' ' + ELEM_RIGHT);
      elemItem.eq(options.index).addClass(THIS);
      that.haveSlide = false; // 解锁
    }, 350);

    // 指示器焦点
    that.elemInd.find('li').eq(options.index).addClass(THIS)
    .siblings().removeClass(THIS);

    that.haveSlide = true;

    // 回调返回的参数
    var params = {
      index: options.index,
      prevIndex: thisIndex,
      item: elemItem.eq(options.index)
    };

    typeof options.change === 'function' && options.change(params);
    layui.event.call(this, MOD_NAME, 'change('+ filter +')', params);
  };

  // 事件处理
  Class.prototype.events = function(){
    var that = this;
    var options = that.config;

    if(options.elem.data('haveEvents')) return;


    // 移入移出容器
    options.elem.on('mouseenter touchstart', function(){
      if (that.config.autoplay === 'always') return;
      clearInterval(that.timer);
    }).on('mouseleave touchend', function(){
      if (that.config.autoplay === 'always') return;
      that.autoplay();
    });

    var touchEl = options.elem;
    var isVertical = options.anim === 'updown';
    lay.touchSwipe(touchEl, {
      onTouchEnd: function(e, state){
        var duration = Date.now() - state.timeStart;
        var distance = isVertical ? state.distanceY : state.distanceX;
        var speed = distance / duration;
        var shouldSwipe = Math.abs(speed) > 0.25 || Math.abs(distance) > touchEl[isVertical ? 'height' : 'width']() / 3;
        if(shouldSwipe){
          that.slide(distance > 0 ? '' : 'sub');
        }
      }
    })

    options.elem.data('haveEvents', true);
  };

  // 核心入口
  carousel.render = function(options){
    return new Class(options);
  };

  exports(MOD_NAME, carousel);
});


