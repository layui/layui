/**
 * element
 * 常用元素操作组件
 */
 
layui.define('jquery', function(exports){
  'use strict';
  
  var $ = layui.$;
  var hint = layui.hint();
  var device = layui.device();
  
  var MOD_NAME = 'element';
  var THIS = 'layui-this';
  var SHOW = 'layui-show';
  var TITLE = '.layui-tab-title';
  
  var Element = function(){
    this.config = {};
  };
  
  // 全局设置
  Element.prototype.set = function(options){
    var that = this;
    $.extend(true, that.config, options);
    return that;
  };
  
  // 表单事件
  Element.prototype.on = function(events, callback){
    return layui.onevent.call(this, MOD_NAME, events, callback);
  };
  
  // 外部 Tab 新增
  Element.prototype.tabAdd = function(filter, options){
    var tabElem = $('.layui-tab[lay-filter='+ filter +']');
    var titElem = tabElem.children(TITLE);
    var barElem = titElem.children('.layui-tab-bar');
    var contElem = tabElem.children('.layui-tab-content');
    var li = '<li'+ function(){
      var layAttr = [];
      layui.each(options, function(key, value){
        if(/^(title|content)$/.test(key)) return;
        layAttr.push('lay-'+ key +'="'+ value +'"');
      });
      if(layAttr.length > 0) layAttr.unshift(''); //向前插，预留空格
      return layAttr.join(' ');
    }() +'>'+ (options.title || 'unnaming') +'</li>';
    
    barElem[0] ? barElem.before(li) : titElem.append(li);
    contElem.append('<div class="layui-tab-item">'+ (options.content || '') +'</div>');
    // call.hideTabMore(true);
    // 是否添加即切换
    options.change && this.tabChange(filter, options.id);
    titElem.data('LAY_TAB_CHANGE', options.change);
    call.tabAuto(options.change ? 'change' : null);
    return this;
  };
  
  // 外部 Tab 删除
  Element.prototype.tabDelete = function(filter, layid){
    var tabElem = $('.layui-tab[lay-filter='+ filter +']');
    var titElem = tabElem.children(TITLE);
    var liElem = titElem.find('>li[lay-id="'+ layid +'"]');
    call.tabDelete(null, liElem);
    return this;
  };
  
  // 外部 Tab 切换
  Element.prototype.tabChange = function(filter, layid){
    var tabElem = $('.layui-tab[lay-filter='+ filter +']');
    var titElem = tabElem.children(TITLE);
    var liElem = titElem.find('>li[lay-id="'+ layid +'"]');

    call.tabClick.call(liElem[0], {
      liElem: liElem
    });
    return this;
  };
  
  // 自定义 Tab 选项卡
  Element.prototype.tab = function(options){
    options = options || {};
    dom.on('click', options.headerElem, function(e){
      var index = $(this).index();
      call.tabClick.call(this, {
        index: index,
        options: options
      });
    });
  };
  
  
  // 动态改变进度条
  Element.prototype.progress = function(filter, percent){
    var ELEM = 'layui-progress';
    var elem = $('.'+ ELEM +'[lay-filter='+ filter +']');
    var elemBar = elem.find('.'+ ELEM +'-bar');
    var text = elemBar.find('.'+ ELEM +'-text');

    elemBar.css('width', function(){
      return /^.+\/.+$/.test(percent) 
        ? (new Function('return '+ percent)() * 100) + '%'
     : percent;
    }).attr('lay-percent', percent);
    text.text(percent);
    return this;
  };
  
  var NAV_ELEM = '.layui-nav';
  var NAV_ITEM = 'layui-nav-item';
  var NAV_BAR = 'layui-nav-bar';
  var NAV_TREE = 'layui-nav-tree';
  var NAV_CHILD = 'layui-nav-child';
  var NAV_CHILD_C = 'layui-nav-child-c';
  var NAV_MORE = 'layui-nav-more';
  var NAV_DOWN = 'layui-icon-down';
  var NAV_ANIM = 'layui-anim layui-anim-upbit';
  
  // 基础事件体
  var call = {
    // Tab 点击
    tabClick: function(obj){
      obj = obj || {};
      var options = obj.options || {};
      var othis = obj.liElem || $(this);
      var parents = options.headerElem 
        ? othis.parent() 
      : othis.parents('.layui-tab').eq(0);
      var item = options.bodyElem 
        ? $(options.bodyElem) 
      : parents.children('.layui-tab-content').children('.layui-tab-item');
      var elemA = othis.find('a');
      var isJump = elemA.attr('href') !== 'javascript:;' && elemA.attr('target') === '_blank'; // 是否存在跳转
      var unselect = typeof othis.attr('lay-unselect') === 'string'; // 是否禁用选中
      var filter = parents.attr('lay-filter');

      // 下标
      var index = 'index' in obj 
        ? obj.index 
      : othis.parent().children('li').index(othis);
      
      // 执行切换
      if(!(isJump || unselect)){
        othis.addClass(THIS).siblings().removeClass(THIS);
        item.eq(index).addClass(SHOW).siblings().removeClass(SHOW);
      }
      
      layui.event.call(this, MOD_NAME, 'tab('+ filter +')', {
        elem: parents,
        index: index
      });
    }
    
    // Tab 删除
    ,tabDelete: function(e, othis){
      var li = othis || $(this).parent();
      var index = li.parent().children('li').index(li);
      var tabElem = li.closest('.layui-tab');
      var item = tabElem.children('.layui-tab-content').children('.layui-tab-item');
      var filter = tabElem.attr('lay-filter');
      
      if(li.hasClass(THIS)){
        if (li.next()[0] && li.next().is('li')){
          call.tabClick.call(li.next()[0], {
            index: index + 1
          });
        } else if (li.prev()[0] && li.prev().is('li')){
          call.tabClick.call(li.prev()[0], null, index - 1);
        }
      }
      
      li.remove();
      item.eq(index).remove();
      setTimeout(function(){
        call.tabAuto();
      }, 50);
      
      layui.event.call(this, MOD_NAME, 'tabDelete('+ filter +')', {
        elem: tabElem,
        index: index
      });
    }
    
    // Tab 自适应
    ,tabAuto: function(spread){
      var SCROLL = 'layui-tab-scroll';
      var MORE = 'layui-tab-more';
      var BAR = 'layui-tab-bar';
      var CLOSE = 'layui-tab-close';
      var that = this;
      
      $('.layui-tab').each(function(){
        var othis = $(this);
        var title = othis.children('.layui-tab-title');
        var item = othis.children('.layui-tab-content').children('.layui-tab-item');
        var STOPE = 'lay-stope="tabmore"';
        var span = $('<span class="layui-unselect layui-tab-bar" '+ STOPE +'><i '+ STOPE +' class="layui-icon">&#xe61a;</i></span>');

        if(that === window && device.ie != 8){
          // call.hideTabMore(true)
        }
        
        // 开启关闭图标
        if(othis.attr('lay-allowclose')){
          title.find('li').each(function(){
            var li = $(this);
            if(!li.find('.'+CLOSE)[0]){
              var close = $('<i class="layui-icon layui-icon-close layui-unselect '+ CLOSE +'"></i>');
              close.on('click', call.tabDelete);
              li.append(close);
            }
          });
        }
        
        if(typeof othis.attr('lay-unauto') === 'string') return;
        
        // 响应式
        if(
          title.prop('scrollWidth') > title.outerWidth() + 1 || (
            title.find('li').length && title.height() > function(height){
              return height + height/2;
            }(title.find('li').eq(0).height())
          )
        ){
          // 若执行是来自于切换，则自动展开
          (
            spread === 'change' && title.data('LAY_TAB_CHANGE')
          ) && title.addClass(MORE);
          
          if(title.find('.'+BAR)[0]) return;
          title.append(span);
          othis.attr('overflow', '');

          // 展开图标事件
          span.on('click', function(e){
            var isSpread = title.hasClass(MORE);
            title[isSpread ? 'removeClass' : 'addClass'](MORE);
          });
        } else {
          title.find('.'+ BAR).remove();
          othis.removeAttr('overflow');
        }
      });
    }
    // 隐藏更多 Tab
    ,hideTabMore: function(e){
      var tsbTitle = $('.layui-tab-title');
      if(e === true || $(e.target).attr('lay-stope') !== 'tabmore'){
        tsbTitle.removeClass('layui-tab-more');
        tsbTitle.find('.layui-tab-bar').attr('title','');
      }
    }
    
    //点击一级菜单
    /*
    ,clickThis: function(){
      var othis = $(this), parents = othis.parents(NAV_ELEM)
      ,filter = parents.attr('lay-filter')
      ,elemA = othis.find('a')
      ,unselect = typeof othis.attr('lay-unselect') === 'string';

      if(othis.find('.'+NAV_CHILD)[0]) return;
      
      if(!(elemA.attr('href') !== 'javascript:;' && elemA.attr('target') === '_blank') && !unselect){
        parents.find('.'+THIS).removeClass(THIS);
        othis.addClass(THIS);
      }
      
      layui.event.call(this, MOD_NAME, 'nav('+ filter +')', othis);
    }
    )
    */
    
    //点击菜单 - a标签触发
    ,clickThis: function(){
      var othis = $(this)
      ,parents = othis.parents(NAV_ELEM)
      ,filter = parents.attr('lay-filter')
      ,parent = othis.parent() 
      ,child = othis.siblings('.'+NAV_CHILD)
      ,unselect = typeof parent.attr('lay-unselect') === 'string'; //是否禁用选中
      
      if(!(othis.attr('href') !== 'javascript:;' && othis.attr('target') === '_blank') && !unselect){
        if(!child[0]){
          parents.find('.'+THIS).removeClass(THIS);
          parent.addClass(THIS);
        }
      }
      
      //如果是垂直菜单
      if(parents.hasClass(NAV_TREE)){
        child.removeClass(NAV_ANIM);
        
        //如果有子菜单，则展开
        if(child[0]){
          parent[child.css('display') === 'none' ? 'addClass': 'removeClass'](NAV_ITEM+'ed');
          if(parents.attr('lay-shrink') === 'all'){
            parent.siblings().removeClass(NAV_ITEM + 'ed');
          }
        }
      }
      
      layui.event.call(this, MOD_NAME, 'nav('+ filter +')', othis);
    }
    
    //点击子菜单选中
    /*
    ,clickChild: function(){
      var othis = $(this), parents = othis.parents(NAV_ELEM)
      ,filter = parents.attr('lay-filter');
      parents.find('.'+THIS).removeClass(THIS);
      othis.addClass(THIS);
      layui.event.call(this, MOD_NAME, 'nav('+ filter +')', othis);
    }
    */
    
    //折叠面板
    ,collapse: function(){
      var othis = $(this), icon = othis.find('.layui-colla-icon')
      ,elemCont = othis.siblings('.layui-colla-content')
      ,parents = othis.parents('.layui-collapse').eq(0)
      ,filter = parents.attr('lay-filter')
      ,isNone = elemCont.css('display') === 'none';
      
      //是否手风琴
      if(typeof parents.attr('lay-accordion') === 'string'){
        var show = parents.children('.layui-colla-item').children('.'+SHOW);
        show.siblings('.layui-colla-title').children('.layui-colla-icon').html('&#xe602;');
        show.removeClass(SHOW);
      }
      
      elemCont[isNone ? 'addClass' : 'removeClass'](SHOW);
      icon.html(isNone ? '&#xe61a;' : '&#xe602;');
      
      layui.event.call(this, MOD_NAME, 'collapse('+ filter +')', {
        title: othis
        ,content: elemCont
        ,show: isNone
      });
    }
  };
  
  // 初始化元素操作
  Element.prototype.init = function(type, filter){
    var that = this, elemFilter = function(){
      return filter ? ('[lay-filter="' + filter +'"]') : '';
    }(), items = {
      
      // Tab 选项卡
      tab: function(){
        call.tabAuto.call({});
      }
      
      //导航菜单
      ,nav: function(){
        var TIME = 200, timer = {}, timerMore = {}, timeEnd = {}, NAV_TITLE = 'layui-nav-title'
        
        //滑块跟随
        ,follow = function(bar, nav, index){
          var othis = $(this), child = othis.find('.'+NAV_CHILD);
          if(nav.hasClass(NAV_TREE)){
            //无子菜单时跟随
            if(!child[0]){
              var thisA = othis.children('.'+ NAV_TITLE);
              bar.css({
                top: othis.offset().top - nav.offset().top
                ,height: (thisA[0] ? thisA : othis).outerHeight()
                ,opacity: 1
              });
            }
          } else {
            child.addClass(NAV_ANIM);
            
            //若居中对齐
            if(child.hasClass(NAV_CHILD_C)) child.css({
              left: -(child.outerWidth() - othis.width())/2
            });
            
            //滑块定位
            if(child[0]){ //若有子菜单，则滑块消失
              bar.css({
                left: bar.position().left + bar.width()/2
                ,width: 0
                ,opacity: 0
              });
            } else { //bar 跟随
              bar.css({
                left: othis.position().left + parseFloat(othis.css('marginLeft'))
                ,top: othis.position().top + othis.height() - bar.height()
              });
            }
            
            //渐显滑块并适配宽度
            timer[index] = setTimeout(function(){
              bar.css({
                width: child[0] ? 0 : othis.width()
                ,opacity: child[0] ? 0 : 1
              });
            }, device.ie && device.ie < 10 ? 0 : TIME);
            
            //显示子菜单
            clearTimeout(timeEnd[index]);
            if(child.css('display') === 'block'){
              clearTimeout(timerMore[index]);
            }
            timerMore[index] = setTimeout(function(){
              child.addClass(SHOW);
              othis.find('.'+NAV_MORE).addClass(NAV_MORE+'d');
            }, 300);
          }
        };
        
        //遍历导航
        $(NAV_ELEM + elemFilter).each(function(index){
          var othis = $(this)
          ,bar = $('<span class="'+ NAV_BAR +'"></span>')
          ,itemElem = othis.find('.'+NAV_ITEM);
          
          //hover 滑动效果
          if(!othis.find('.'+NAV_BAR)[0]){
            othis.append(bar);
            (othis.hasClass(NAV_TREE) 
              ? itemElem.find('dd,>.'+ NAV_TITLE) 
            : itemElem).on('mouseenter', function(){
              follow.call(this, bar, othis, index);
            }).on('mouseleave', function(){ //鼠标移出
              //是否为垂直导航
              if(othis.hasClass(NAV_TREE)){
                bar.css({
                  height: 0
                  ,opacity: 0
                });
              } else {
                //隐藏子菜单
                clearTimeout(timerMore[index]);
                timerMore[index] = setTimeout(function(){
                  othis.find('.'+NAV_CHILD).removeClass(SHOW);
                  othis.find('.'+NAV_MORE).removeClass(NAV_MORE+'d');
                }, 300);
              }
            });
            othis.on('mouseleave', function(){
              clearTimeout(timer[index])
              timeEnd[index] = setTimeout(function(){
                if(!othis.hasClass(NAV_TREE)){
                  bar.css({
                    width: 0
                    ,left: bar.position().left + bar.width()/2
                    ,opacity: 0
                  });
                }
              }, TIME);
            });
          }
          
          //展开子菜单
          itemElem.find('a').each(function(){
            var thisA = $(this)
            ,parent = thisA.parent()
            ,child = thisA.siblings('.'+NAV_CHILD);
            
            //输出小箭头
            if(child[0] && !thisA.children('.'+NAV_MORE)[0]){
              thisA.append('<i class="layui-icon '+ NAV_DOWN +' '+ NAV_MORE +'"></i>');
            }
            
            thisA.off('click', call.clickThis).on('click', call.clickThis); //点击菜单
          });
        });
      }
      
      //面包屑
      ,breadcrumb: function(){
        var ELEM = '.layui-breadcrumb';
        
        $(ELEM + elemFilter).each(function(){
          var othis = $(this)
          ,ATTE_SPR = 'lay-separator'
          ,separator = othis.attr(ATTE_SPR) || '/'
          ,aNode = othis.find('a');
          if(aNode.next('span['+ ATTE_SPR +']')[0]) return;
          aNode.each(function(index){
            if(index === aNode.length - 1) return;
            $(this).after('<span '+ ATTE_SPR +'>'+ separator +'</span>');
          });
          othis.css('visibility', 'visible');
        });
      }
      
      //进度条
      ,progress: function(){
        var ELEM = 'layui-progress';
        $('.' + ELEM + elemFilter).each(function(){
          var othis = $(this)
          ,elemBar = othis.find('.layui-progress-bar')
          ,percent = elemBar.attr('lay-percent');

          elemBar.css('width', function(){
            return /^.+\/.+$/.test(percent) 
              ? (new Function('return '+ percent)() * 100) + '%'
           : percent;
          });
          
          if(othis.attr('lay-showpercent')){
            setTimeout(function(){
              elemBar.html('<span class="'+ ELEM +'-text">'+ percent +'</span>');
            },350);
          }
        });
      }
      
      //折叠面板
      ,collapse: function(){
        var ELEM = 'layui-collapse';
        
        $('.' + ELEM + elemFilter).each(function(){
          var elemItem = $(this).find('.layui-colla-item')
          elemItem.each(function(){
            var othis = $(this)
            ,elemTitle = othis.find('.layui-colla-title')
            ,elemCont = othis.find('.layui-colla-content')
            ,isNone = elemCont.css('display') === 'none';
            
            //初始状态
            elemTitle.find('.layui-colla-icon').remove();
            elemTitle.append('<i class="layui-icon layui-colla-icon">'+ (isNone ? '&#xe602;' : '&#xe61a;') +'</i>');

            //点击标题
            elemTitle.off('click', call.collapse).on('click', call.collapse);
          });     
         
        });
      }
    };

    return items[type] ? items[type]() : layui.each(items, function(index, item){
      item();
    });
  };
  
  Element.prototype.render = Element.prototype.init;

  var element = new Element();
  var dom = $(document);
  
  $(function(){
    element.render();
  });

  dom.on('click', '.layui-tab-title li', call.tabClick); // Tab 切换
  // dom.on('click', call.hideTabMore); // 隐藏展开的 Tab
  $(window).on('resize', call.tabAuto); // 自适应
  
  exports(MOD_NAME, element);
});

