layui.define(['jquery'], function(exports){
  "use strict";

  var $ = layui.$;

  // 外部接口
  var sidebar = {
    config: {}, // 全局配置项

    // 设置全局项
    set: function(options){
      var that = this;
      that.config = $.extend({}, that.config, options);
      return that;
    },
  };
  
  // 字符常量
  var MOD_NAME = 'sidebar';
  var ELEM = '.layui-sidebar';
  var ELEM_ITEM = '[sidebar-item] > *';
  var ELEM_CONTENT = '[sidebar-content] > *';
  
  // 构造器
  var Class = function(options){
    var that = this;
    that.config = $.extend({}, that.config, sidebar.config, options);
    that.render();
  };
  
  // 默认配置
  Class.prototype.config = {
    offset: 0, // 滚动位置偏移量
    trigger: 'click', // 触发方式：click
    scrollDuration: 500, // 滚动动画时间
    active: 'layui-sidebar-active' // 高亮样式
  };
  
  // 渲染
  Class.prototype.render = function(){
    var that = this;
    var options = that.config;

    var elem = $(options.elem);
    if(elem.length > 1){
      layui.each(elem, function(){
        sidebar.render($.extend({}, options, {
          elem: this
        }));
      });
      return that;
    }

    options.elem = $(options.elem);
    if(!options.elem[0]) return;
    
    // 获取导航项和内容区域
    that.elemItems = options.elem.find(ELEM_ITEM);
    that.elemContents = options.elem.find(ELEM_CONTENT);

    // 初始设置
    that.highlightActiveItem();
    
    // 绑定滚动事件
    var ticking = false;
    $(window).on('scroll', function(){
      if (!that.isClick) {
        if (!ticking) {
          requestAnimationFrame(function() {
            that.highlightActiveItem();
            ticking = false;
          });
          ticking = true;
        }
      }
    });

    // 绑定点击事件
    options.elem.on(options.trigger, ELEM_ITEM, function(event){
      event.preventDefault();
      var index = $(this).index();
      var targetContent = that.elemContents.eq(index);
      $('html, body').animate({
        scrollTop: targetContent.offset().top - options.offset
      }, options.scrollDuration, function() { // 使用配置中的滚动时间
        // 滚动动画完成后处理
        that.highlightActiveItemOnClick(index);
        // 关闭点击状态
        that.isClick = false;
      });
      that.isClick = true; // 设置点击状态
    });
  };

  // 高亮当前视图区域中的导航项
  Class.prototype.highlightActiveItem = function(){
    var that = this;
    var scrollTop = $(window).scrollTop();
    var windowHeight = $(window).height();
    
    var activeIndex;
    that.elemContents.each(function(index){
      var $content = $(this);
      var contentTop = $content.offset().top;
      var contentBottom = contentTop + $content.outerHeight();
      var contentVisibleHeight = Math.min(contentBottom, scrollTop + windowHeight) - Math.max(contentTop, scrollTop);

      // 判断内容区域是否在视图中大半部分可见
      if (contentVisibleHeight / $content.outerHeight() > 0.5) {
        activeIndex = index;
        return false; // 退出循环
      }
    });

    if (typeof activeIndex !== 'undefined') {
      that.elemItems.removeClass(that.config.active);
      that.elemItems.eq(activeIndex).addClass(that.config.active);
    }
  };

  // 点击时高亮导航项
  Class.prototype.highlightActiveItemOnClick = function(index){
    var that = this;
    that.elemItems.removeClass(that.config.active);
    that.elemItems.eq(index).addClass(that.config.active);
  };

  // 核心入口
  sidebar.render = function(options){
    return new Class(options);
  };

  exports(MOD_NAME, sidebar);
});
