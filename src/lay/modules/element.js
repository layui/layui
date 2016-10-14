/**

 @Name：layui.element 常用元素操作
 @Author：贤心
 @License：LGPL
    
 */
 
layui.define('jquery', function(exports){
  "use strict";
  
  var $ = layui.jquery
  ,hint = layui.hint()
  ,device = layui.device()
  
  ,MOD_NAME = 'element', THIS = 'layui-this', SHOW = 'layui-show'
  
  ,Element = function(){
    this.config = {};
  };
  
  //全局设置
  Element.prototype.set = function(options){
    var that = this;
    $.extend(true, that.config, options);
    return that;
  };
  
  //表单事件监听
  Element.prototype.on = function(events, callback){
    return layui.onevent(MOD_NAME, events, callback);
  };
  
  //初始化元素操作
  Element.prototype.init = function(type){
    var that = this, call = {
      //Tab点击
      tabClick: function(e, index){
        var othis = $(this)
        ,index = index || othis.index()
        ,parents = othis.parents('.layui-tab')
        ,item = parents.find('.layui-tab-content .layui-tab-item')
        ,filter = parents.attr('lay-filter');
        
        othis.addClass(THIS).siblings().removeClass(THIS);
        item.eq(index).addClass(SHOW).siblings().removeClass(SHOW);
        
        layui.event.call(this, MOD_NAME, 'tab('+ filter +')', {
          elem: parents
          ,index: index
        });
      }
      //Tab自适应
      ,tabAuto: function(){
        var SCROLL = 'layui-tab-scroll', MORE = 'layui-tab-more', BAR = 'layui-tab-bar'
        , CLOSE = 'layui-tab-close', that = this;
        
        $('.layui-tab').each(function(){
          var othis = $(this)
          ,title = othis.find('.layui-tab-title')
          ,item = othis.find('.layui-tab-item')
          ,STOPE = 'lay-stope="tabmore"'
          ,span = $('<span class="layui-unselect layui-tab-bar" '+ STOPE +'><i '+ STOPE +' class="layui-icon">&#xe61a;</i></span>');
          
          if(that === window && device.ie != 8){
            call.hideTabMore(true)
          }
          
          //允许关闭
          if(othis.attr('lay-allowClose')){
            if(!title.find('li').find('.'+CLOSE)[0]){
              var close = $('<i class="layui-icon layui-unselect '+ CLOSE +'">&#x1006;</i>');
              close.on('click', function(){
                var li = $(this).parent(), index = li.index();
                var parents = li.parents('.layui-tab');
                var item = parents.find('.layui-tab-content .layui-tab-item');
                
                if(li.hasClass(THIS)){
                  if(li.next()[0]){
                    call.tabClick.call(li.next()[0], {}, index + 1);
                  } else if(li.prev()[0]){
                    call.tabClick.call(li.prev()[0], {}, index - 1);
                  }
                }
                
                li.remove();
                item.eq(index).remove();
              });
              title.find('li').append(close);
            }
          }
          if(title.prop('scrollWidth') > title.outerWidth()+1){
            if(title.find('.'+BAR)[0]) return;
            title.append(span);
            span.on('click', function(e){
              title[this.title ? 'removeClass' : 'addClass'](MORE);
              this.title = this.title ? '' : '收缩';
            });
          } else {
            title.find('.'+BAR).remove();
          }
        });
      }
      //隐藏更多Tab
      ,hideTabMore: function(e){
        var tsbTitle = $('.layui-tab-title');
        if(e === true || e.target.getAttribute('lay-stope') !== 'tabmore'){
          tsbTitle.removeClass('layui-tab-more');
          tsbTitle.find('.layui-tab-bar').attr('title','');
        }
      }
    }
    ,items = {
      //Tab选项卡
      tab: function(){
        var TITLE = '.layui-tab-title li';

        call.tabAuto.call({});
        
        //Tab切换
        body.off('click', TITLE, call.tabClick)
        .on('click', TITLE, call.tabClick); 
        
        //自适应
        $(window).off('resize', call.tabAuto)
        .on('resize', call.tabAuto); 
        
        //隐藏展开的Tab
        $(document).off('click', call.hideTabMore)
        .on('click', call.hideTabMore); 
      }
      //导航菜单
      ,nav: function(){
        var ELEM = '.layui-nav', ITEM = 'layui-nav-item', BAR = 'layui-nav-bar'
        ,TREE = 'layui-nav-tree', TIME = 200, timer
        ,follow = function(bar, nav){
          var othis = $(this);
          if(nav.hasClass(TREE)){
            bar.css({
              top: othis.position().top
              ,height: othis.height()
              ,opacity: 1
            });
          } else {
            bar.css({
              left: othis.position().left + parseFloat(othis.css('marginLeft'))
              ,top: othis.position().top + othis.height() - 5
            });
            timer = setTimeout(function(){
              bar.css({
                width: othis.width()
                ,opacity: 1
              });
            }, TIME);
          }
        }
        
        $(ELEM).each(function(){
          var othis = $(this)
          ,bar = $('<span class="'+ BAR +'"></span>');
          if(!othis.find('.'+BAR)[0] && !(device.ie && device.ie < 10)){
            othis.append(bar);
            othis.find('.'+ITEM).on('mouseenter', function(){
              follow.call(this, bar, othis);
            });
            othis.on('mouseleave', function(){
              clearTimeout(timer)
              setTimeout(function(){
                if(othis.hasClass(TREE)){
                  bar.css({
                    height: 0
                    ,top: bar.position().top + bar.height()/2
                    ,opacity: 0
                  });
                } else {
                  bar.css({
                    width: 0
                    ,left: bar.position().left + bar.width()/2
                    ,opacity: 0
                  });
                }
              }, TIME);
            });
          }
        });
      }
      //面包屑
      ,breadcrumb: function(){
        var ELEM = '.layui-breadcrumb'
        
        $(ELEM).each(function(){
          var othis = $(this)
          ,separator = othis.attr('lay-separator') || '>'
          ,aNode = othis.find('a');
          aNode.each(function(index){
            if(index === aNode.length - 1) return;
            $(this).append('<span>'+ separator +'</span>');
          });
          othis.css('visibility', 'visible');
        });
      }
    };

    return layui.each(items, function(index, item){
      item();
    });
  };


  var element = new Element(), body = $('body');
  element.init();
  
  exports(MOD_NAME, function(options){
    return element.set(options);
  });
});

