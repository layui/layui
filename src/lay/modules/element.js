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
  
  //外部Tab新增
  Element.prototype.tabAdd = function(filter, options){
    var tabElem = $('.layui-tab[lay-filter='+ filter +']')
    ,titElem = tabElem.children('.layui-tab-title')
    ,contElem = tabElem.children('.layui-tab-content');
    titElem.append('<li>'+ (options.title||'unnaming') +'</li>');
    contElem.append('<div class="layui-tab-item">'+ (options.content||'') +'</div>');
    return call.tabAuto(), this;
  };
  
  //外部Tab删除
  Element.prototype.tabDelete = function(filter, index){
    var tabElem = $('.layui-tab[lay-filter='+ filter +']')
    ,liElem = tabElem.children('.layui-tab-title').find('>li').eq(index);
    call.tabDelete(null, liElem);
    return this;
  };
  
  //外部Tab切换
  Element.prototype.tabChange = function(filter, index){
    var tabElem = $('.layui-tab[lay-filter='+ filter +']')
    ,liElem = tabElem.children('.layui-tab-title').find('>li').eq(index);
    call.tabClick(null, index, liElem);
    return this;
  };
  
  //动态改变进度条
  Element.prototype.progress = function(filter, percent){
    var ELEM = 'layui-progress'
    ,elem = $('.'+ ELEM +'[lay-filter='+ filter +']')
    ,elemBar = elem.find('.'+ ELEM +'-bar')
    ,text = elemBar.find('.'+ ELEM +'-text');
    elemBar.css('width', percent);
    text.text(percent);
    return this;
  };
  
  var NAV_ELEM = '.layui-nav', NAV_ITEM = 'layui-nav-item', NAV_BAR = 'layui-nav-bar'
  ,NAV_TREE = 'layui-nav-tree', NAV_CHILD = 'layui-nav-child', NAV_MORE = 'layui-nav-more'
  ,NAV_ANIM = 'layui-anim layui-anim-upbit'
  
  //基础事件体
  ,call = {
    //Tab点击
    tabClick: function(e, index, liElem){
      var othis = liElem || $(this)
      ,index = index || othis.index()
      ,parents = othis.parents('.layui-tab')
      ,item = parents.children('.layui-tab-content').children('.layui-tab-item')
      ,filter = parents.attr('lay-filter');
      
      othis.addClass(THIS).siblings().removeClass(THIS);
      item.eq(index).addClass(SHOW).siblings().removeClass(SHOW);
      
      layui.event.call(this, MOD_NAME, 'tab('+ filter +')', {
        elem: parents
        ,index: index
      });
    }
    
    //Tab删除
    ,tabDelete: function(e, othis){
      var li = othis || $(this).parent(), index = li.index();
      var parents = li.parents('.layui-tab');
      var item = parents.children('.layui-tab-content').children('.layui-tab-item')
      
      if(li.hasClass(THIS)){
        if(li.next()[0]){
          call.tabClick.call(li.next()[0], null, index + 1);
        } else if(li.prev()[0]){
          call.tabClick.call(li.prev()[0], null, index - 1);
        }
      }
      
      li.remove();
      item.eq(index).remove();
    }
    
    //Tab自适应
    ,tabAuto: function(){
      var SCROLL = 'layui-tab-scroll', MORE = 'layui-tab-more', BAR = 'layui-tab-bar'
      , CLOSE = 'layui-tab-close', that = this;
      
      $('.layui-tab').each(function(){
        var othis = $(this)
        ,title = othis.children('.layui-tab-title')
        ,item = othis.children('.layui-tab-content').children('.layui-tab-item')
        ,STOPE = 'lay-stope="tabmore"'
        ,span = $('<span class="layui-unselect layui-tab-bar" '+ STOPE +'><i '+ STOPE +' class="layui-icon">&#xe61a;</i></span>');
        
        if(that === window && device.ie != 8){
          call.hideTabMore(true)
        }
        
        //允许关闭
        if(othis.attr('lay-allowClose')){
          title.find('li').each(function(){
            var li = $(this);
            if(!li.find('.'+CLOSE)[0]){
              var close = $('<i class="layui-icon layui-unselect '+ CLOSE +'">&#x1006;</i>');
              close.on('click', call.tabDelete);
              li.append(close);
            }
          });
        }
        
        //响应式
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
      if(e === true || $(e.target).attr('lay-stope') !== 'tabmore'){
        tsbTitle.removeClass('layui-tab-more');
        tsbTitle.find('.layui-tab-bar').attr('title','');
      }
    }
    //点击选中
    ,clickThis: function(){
      var othis = $(this), parents = othis.parents(NAV_ELEM)
      ,filter = parents.attr('lay-filter');
      
      if(othis.find('.'+NAV_CHILD)[0]) return;
      parents.find('.'+THIS).removeClass(THIS);
      othis.addClass(THIS);
      layui.event.call(this, MOD_NAME, 'nav('+ filter +')', othis);
    }
    //点击子菜单选中
    ,clickChild: function(){
      var othis = $(this), parents = othis.parents(NAV_ELEM)
      ,filter = parents.attr('lay-filter');
      parents.find('.'+THIS).removeClass(THIS);
      othis.addClass(THIS);
      layui.event.call(this, MOD_NAME, 'nav('+ filter +')', othis);
    }
    //展开二级菜单
    ,showChild: function(){
      var othis = $(this), parents = othis.parents(NAV_ELEM);
      var parent = othis.parent(), child = othis.siblings('.'+NAV_CHILD);
      if(parents.hasClass(NAV_TREE)){
        child.removeClass(NAV_ANIM);
        parent[child.css('display') === 'none' ? 'addClass': 'removeClass'](NAV_ITEM+'ed');
      }
    }
  };
  
  //初始化元素操作
  Element.prototype.init = function(type){
    var that = this, items = {
      
      //Tab选项卡
      tab: function(){
        call.tabAuto.call({});
      }
      
      //导航菜单
      ,nav: function(){
        var TIME = 200, timer, timerMore, timeEnd, follow = function(bar, nav){
          var othis = $(this), child = othis.find('.'+NAV_CHILD);
          
          if(nav.hasClass(NAV_TREE)){
            bar.css({
              top: othis.position().top
              ,height: othis.children('a').height()
              ,opacity: 1
            });
          } else {
            child.addClass(NAV_ANIM);
            bar.css({
              left: othis.position().left + parseFloat(othis.css('marginLeft'))
              ,top: othis.position().top + othis.height() - 5
            });
            
            timer = setTimeout(function(){
              bar.css({
                width: othis.width()
                ,opacity: 1
              });
            }, device.ie && device.ie < 10 ? 0 : TIME);
            
            clearTimeout(timeEnd);
            if(child.css('display') === 'block'){
              clearTimeout(timerMore);
            }
            timerMore = setTimeout(function(){
              child.addClass(SHOW)
              othis.find('.'+NAV_MORE).addClass(NAV_MORE+'d');
            }, 300);
          }
        }
        
        $(NAV_ELEM).each(function(){
          var othis = $(this)
          ,bar = $('<span class="'+ NAV_BAR +'"></span>')
          ,itemElem = othis.find('.'+NAV_ITEM);
          
          //Hover滑动效果
          if(!othis.find('.'+NAV_BAR)[0]){
            othis.append(bar);
            itemElem.on('mouseenter', function(){
              follow.call(this, bar, othis);
            }).on('mouseleave', function(){
              if(!othis.hasClass(NAV_TREE)){
                clearTimeout(timerMore);
                timerMore = setTimeout(function(){
                  othis.find('.'+NAV_CHILD).removeClass(SHOW);
                  othis.find('.'+NAV_MORE).removeClass(NAV_MORE+'d');
                }, 300);
              }
            });
            othis.on('mouseleave', function(){
              clearTimeout(timer)
              timeEnd = setTimeout(function(){
                if(othis.hasClass(NAV_TREE)){
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
          
          itemElem.each(function(){
            var oitem = $(this), child = oitem.find('.'+NAV_CHILD);
            
            //二级菜单
            if(child[0] && !oitem.find('.'+NAV_MORE)[0]){
              var one = oitem.children('a');
              one.append('<span class="'+ NAV_MORE +'"></span>');
            }
            
            oitem.off('click', call.clickThis).on('click', call.clickThis); //点击选中
            oitem.children('a').off('click', call.showChild).on('click', call.showChild); //展开二级菜单
            child.children('dd').off('click', call.clickChild).on('click', call.clickChild); //点击子菜单选中
          });
        });
      }
      
      //面包屑
      ,breadcrumb: function(){
        var ELEM = '.layui-breadcrumb';
        
        $(ELEM).each(function(){
          var othis = $(this)
          ,separator = othis.attr('lay-separator') || '>'
          ,aNode = othis.find('a');
          if(aNode.find('.layui-box')[0]) return;
          aNode.each(function(index){
            if(index === aNode.length - 1) return;
            $(this).append('<span class="layui-box">'+ separator +'</span>');
          });
          othis.css('visibility', 'visible');
        });
      }
      
      //进度条
      ,progress: function(){
        var ELEM = 'layui-progress';
        
        $('.'+ELEM).each(function(){
          var othis = $(this)
          ,elemBar = othis.find('.layui-progress-bar')
          ,width = elemBar.attr('lay-percent');
          elemBar.css('width', width);
          if(othis.attr('lay-showPercent')){
            setTimeout(function(){
              elemBar.html('<span class="'+ ELEM +'-text">'+ Math.round(elemBar.width()/othis.width()*100) +'%</span>');
            },350);
          }
        });
      }
    };

    return layui.each(items, function(index, item){
      item();
    });
  };

  var element = new Element(), dom = $(document);
  element.init();
  
  var TITLE = '.layui-tab-title li';
  dom.on('click', TITLE, call.tabClick); //Tab切换
  dom.on('click', call.hideTabMore); //隐藏展开的Tab
  $(window).on('resize', call.tabAuto); //自适应
  
  exports(MOD_NAME, function(options){
    return element.set(options);
  });
});

