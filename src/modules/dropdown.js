/**
 * dropdown 
 * 下拉菜单组件
 */

layui.define(['jquery', 'laytpl', 'lay'], function(exports){
  "use strict";
  
  var $ = layui.$
  ,laytpl = layui.laytpl
  ,hint = layui.hint()
  ,device = layui.device()
  ,clickOrMousedown = (device.mobile ? 'touchstart' : 'mousedown')
  
  //模块名
  ,MOD_NAME = 'dropdown'
  ,MOD_INDEX = 'layui_'+ MOD_NAME +'_index' //模块索引名

  //外部接口
  ,dropdown = {
    config: {}
    ,index: layui[MOD_NAME] ? (layui[MOD_NAME].index + 10000) : 0

    //设置全局项
    ,set: function(options){
      var that = this;
      that.config = $.extend({}, that.config, options);
      return that;
    }
    
    //事件
    ,on: function(events, callback){
      return layui.onevent.call(this, MOD_NAME, events, callback);
    }
  }

  //操作当前实例
  ,thisModule = function(){
    var that = this;
    var options = that.config;
    var id = options.id;

    thisModule.that[id] = that; //记录当前实例对象

    return {
      config: options
      //重置实例
      ,reload: function(options){
        that.reload.call(that, options);
      }
      ,reloadData: function(options){
        dropdown.reloadData(id, options);
      }
      ,close: function () {
        that.remove()
      }
    }
  }

  //字符常量
  ,STR_ELEM = 'layui-dropdown', STR_HIDE = 'layui-hide', STR_DISABLED = 'layui-disabled', STR_NONE = 'layui-none'
  ,STR_ITEM_UP = 'layui-menu-item-up', STR_ITEM_DOWN = 'layui-menu-item-down', STR_MENU_TITLE = 'layui-menu-body-title', STR_ITEM_GROUP = 'layui-menu-item-group', STR_ITEM_PARENT = 'layui-menu-item-parent', STR_ITEM_DIV = 'layui-menu-item-divider', STR_ITEM_CHECKED = 'layui-menu-item-checked', STR_ITEM_CHECKED2 = 'layui-menu-item-checked2', STR_MENU_PANEL = 'layui-menu-body-panel', STR_MENU_PANEL_L = 'layui-menu-body-panel-left', STR_ELEM_SHADE = 'layui-dropdown-shade'
  
  ,STR_GROUP_TITLE = '.'+ STR_ITEM_GROUP + '>.'+ STR_MENU_TITLE

  //构造器
  ,Class = function(options){
    var that = this;
    that.index = ++dropdown.index;
    that.config = $.extend({}, that.config, dropdown.config, options);
    that.init();
  };

  //默认配置
  Class.prototype.config = {
    trigger: 'click' //事件类型
    ,content: '' //自定义菜单内容
    ,className: '' //自定义样式类名
    ,style: '' //设置面板 style 属性
    ,show: false //是否初始即显示菜单面板
    ,isAllowSpread: true //是否允许菜单组展开收缩
    ,isSpreadItem: true //是否初始展开子菜单
    ,data: [] //菜单数据结构
    ,delay: 300 //延迟关闭的毫秒数，若 trigger 为 hover 时才生效
    ,shade: 0 // 遮罩
  };
  
  //重载实例
  Class.prototype.reload = function(options, type){
    var that = this;
    that.config = $.extend({}, that.config, options);
    that.init(true, type);
  };

  // 初始化准备
  Class.prototype.init = function(rerender, type){
    var that = this;
    var options = that.config;
    
    // 若 elem 非唯一
    var elem = $(options.elem);
    if(elem.length > 1){
      layui.each(elem, function(){
        dropdown.render($.extend({}, options, {
          elem: this
        }));
      });
      return that;
    }

    // 合并 lay-options 属性上的配置信息
    $.extend(options, lay.options(elem[0]));

    // 若重复执行 render，则视为 reload 处理
    if(!rerender && elem[0] && elem.data(MOD_INDEX)){
      var newThat = thisModule.getThis(elem.data(MOD_INDEX));
      if(!newThat) return;

      return newThat.reload(options, type);
    }

    options.elem = $(options.elem);
    
    // 初始化 id 属性 - 优先取 options > 元素 id > 自增索引
    options.id = 'id' in options ? options.id : (
      elem.attr('id') || that.index
    );

    if(options.show || (type === 'reloadData' && that.elemView && $('body').find(that.elemView.get(0)).length)) that.render(rerender, type); //初始即显示或者面板弹出之后执行了刷新数据
    that.events(); // 事件
  };
  
  // 渲染
  Class.prototype.render = function(rerender, type){
    var that = this;
    var options = that.config;
    var elemBody = $('body');
    
    // 默认菜单内容
    var getDefaultView = function(){
      var elemUl = $('<ul class="layui-menu layui-dropdown-menu"></ul>');
      if(options.data.length > 0 ){
        eachItemView(elemUl, options.data)
      } else {
        elemUl.html('<li class="layui-menu-item-none">No data</li>');
      }
      return elemUl;
    };
    
    // 遍历菜单项
    var eachItemView = function(views, data){
      // var views = [];
      layui.each(data, function(index, item){
        // 是否存在子级
        var isChild = item.child && item.child.length > 0;
        var isSpreadItem = ('isSpreadItem' in item) ? item.isSpreadItem : options.isSpreadItem
        var title = function(title){
          var templet = item.templet || options.templet;
          if(templet){
            title = typeof templet === 'function' 
              ? templet(item)
            : laytpl(templet).render(item);
          }
          return title;
        }(item.title);
        
        // 初始类型
        var type = function(){
          if(isChild){
            item.type = item.type || 'parent';
          }
          if(item.type){
            return ({
              group: 'group'
              ,parent: 'parent'
              ,'-': '-'
            })[item.type] || 'parent';
          }
          return '';
        }();

        if(type !== '-' && (!item.title && !item.id && !isChild)) return;
        
        //列表元素
        var viewLi = $(['<li'+ function(){
          var className = {
            group: 'layui-menu-item-group'+ (
              options.isAllowSpread ? (
                isSpreadItem ? ' layui-menu-item-down' : ' layui-menu-item-up'
              ) : ''
            )
            ,parent: STR_ITEM_PARENT
            ,'-': 'layui-menu-item-divider'
          };
          if(isChild || type){
            return ' class="'+ className[type] +'"';
          }
          return item.disabled ? ' class="'+ STR_DISABLED +'"' : '';
        }() +'>'
        
          //标题区
          ,function(){
            //是否超文本
            var viewText = ('href' in item) ? (
              '<a href="'+ item.href +'" target="'+ (item.target || '_self') +'">'+ title +'</a>'
            ) : title;
            
            //是否存在子级
            if(isChild){
              return '<div class="'+ STR_MENU_TITLE +'">'+ viewText + function(){
                if(type === 'parent'){
                  return '<i class="layui-icon layui-icon-right"></i>';
                } else if(type === 'group' && options.isAllowSpread){
                  return '<i class="layui-icon layui-icon-'+ (isSpreadItem ? 'up' : 'down') +'"></i>';
                } else {
                  return '';
                }
              }() +'</div>'
              
            }
            return '<div class="'+ STR_MENU_TITLE +'">'+ viewText +'</div>';
          }()
        ,'</li>'].join(''));
        
        viewLi.data('item', item);
        
        //子级区
        if(isChild){
          var elemPanel = $('<div class="layui-panel layui-menu-body-panel"></div>')
          ,elemUl = $('<ul></ul>');

          if(type === 'parent'){
            elemPanel.append(eachItemView(elemUl, item.child));
            viewLi.append(elemPanel);
          } else {
            viewLi.append(eachItemView(elemUl, item.child));
          }
        }

        views.append(viewLi);
      });
      return views;
    }
    
    //主模板
    ,TPL_MAIN = ['<div class="layui-dropdown layui-border-box layui-panel layui-anim layui-anim-downbit" lay-id="' + options.id + '">'
    ,'</div>'].join('');
    
    //如果是右键事件，则每次触发事件时，将允许重新渲染
    if(options.trigger === 'contextmenu' || lay.isTopElem(options.elem[0])) rerender = true;
    
    //判断是否已经打开了下拉菜单面板
    if(!rerender && options.elem.data(MOD_INDEX +'_opened')) return;

    //记录模板对象
    that.elemView = $('.' + STR_ELEM + '[lay-id="' + options.id + '"]');
    if (type === 'reloadData' && that.elemView.length) {
      that.elemView.html(options.content || getDefaultView());
    } else {
      that.elemView = $(TPL_MAIN);
      that.elemView.append(options.content || getDefaultView());

      //初始化某些属性
      if(options.className) that.elemView.addClass(options.className);
      if(options.style) that.elemView.attr('style', options.style);

      //记录当前执行的实例索引
      dropdown.thisId = options.id;

      //插入视图
      that.remove(); //移除非当前绑定元素的面板
      elemBody.append(that.elemView);
      options.elem.data(MOD_INDEX +'_opened', true);

      //遮罩
      var shade = options.shade ? ('<div class="'+ STR_ELEM_SHADE +'" style="'+ ('z-index:'+ (that.elemView.css('z-index')-1) +'; background-color: ' + (options.shade[1] || '#000') + '; opacity: ' + (options.shade[0] || options.shade)) +'"></div>') : '';
      that.elemView.before(shade);

      //如果是鼠标移入事件，则鼠标移出时自动关闭
      if(options.trigger === 'mouseenter'){
        that.elemView.on('mouseenter', function(){
          clearTimeout(thisModule.timer);
        }).on('mouseleave', function(){
          that.delayRemove();
        });
      }
    }

    //坐标定位
    that.position();
    thisModule.prevElem = that.elemView; //记录当前打开的元素，以便在下次关闭
    thisModule.prevElem.data('prevElem', options.elem); //将当前绑定的元素，记录在打开元素的 data 对象中
    
    //阻止全局事件
    that.elemView.find('.layui-menu').on(clickOrMousedown, function(e){
      layui.stope(e);
    });

    //触发菜单列表事件
    that.elemView.find('.layui-menu li').on('click', function(e){
      var othis = $(this);
      var data = othis.data('item') || {};
      var isChild = data.child && data.child.length > 0;
      var isClickAllScope = options.clickScope === 'all'; // 是否所有父子菜单均触发点击事件

      if(data.disabled) return; // 菜单项禁用状态
      
      // 普通菜单项点击后的回调及关闭面板
      if((!isChild || isClickAllScope) && data.type !== '-'){
        var ret = typeof options.click === 'function' 
          ? options.click(data, othis) 
        : null;
        
        ret === false || (isChild || that.remove());
        layui.stope(e);
      }
    });
    
    //触发菜单组展开收缩
    that.elemView.find(STR_GROUP_TITLE).on('click', function(e){
      var othis = $(this)
      ,elemGroup = othis.parent()
      ,data = elemGroup.data('item') || {}
      
      if(data.type === 'group' && options.isAllowSpread){
        thisModule.spread(elemGroup);
      }
    });

    // 组件打开完毕的事件
    typeof options.ready === 'function' && options.ready(
      that.elemView, 
      options.elem
    );
  };
  
  //位置定位
  Class.prototype.position = function(obj){
    var that = this
    ,options = that.config;
    
    lay.position(options.elem[0], that.elemView[0], {
      position: options.position
      ,e: that.e
      ,clickType: options.trigger === 'contextmenu' ? 'right' : null
      ,align: options.align || null
    });
  };
  
  //删除视图
  Class.prototype.remove = function(){
    var that = this
    ,options = that.config
    ,elemPrev = thisModule.prevElem;
    
    //若存在已打开的面板元素，则移除
    if(elemPrev){
      elemPrev.data('prevElem') && (
        elemPrev.data('prevElem').data(MOD_INDEX +'_opened', false)
      );
      elemPrev.remove();
    }
    lay('.' + STR_ELEM_SHADE).remove();
  };
  
  //延迟删除视图
  Class.prototype.delayRemove = function(){
    var that = this
    ,options = that.config;
    clearTimeout(thisModule.timer);

    thisModule.timer = setTimeout(function(){
      that.remove();
    }, options.delay);
  };
  
  //事件
  Class.prototype.events = function(){
    var that = this
    ,options = that.config;
    
    //如果传入 hover，则解析为 mouseenter
    if(options.trigger === 'hover') options.trigger = 'mouseenter';

    //解除上一个事件
    if(that.prevElem) that.prevElem.off(options.trigger, that.prevElemCallback);
    
    //记录被绑定的元素及回调
    that.prevElem = options.elem;
    that.prevElemCallback = function(e){
      clearTimeout(thisModule.timer);
      that.e = e;
      that.render();
      e.preventDefault();
    };

    //触发元素事件
    options.elem.on(options.trigger, that.prevElemCallback);
    
    //如果是鼠标移入事件
    if(options.trigger === 'mouseenter'){
      //直行鼠标移出事件
      options.elem.on('mouseleave', function(){
        that.delayRemove();
      });
    }
  };
  
  //记录所有实例
  thisModule.that = {}; //记录所有实例对象
  
  //获取当前实例对象
  thisModule.getThis = function(id){
    var that = thisModule.that[id];
    if(!that) hint.error(id ? (MOD_NAME +' instance with ID \''+ id +'\' not found') : 'ID argument required');
    return that;
  };
  
  //设置菜单组展开和收缩状态
  thisModule.spread = function(othis){
    //菜单组展开和收缩
    var elemIcon = othis.children('.'+ STR_MENU_TITLE).find('.layui-icon');
    if(othis.hasClass(STR_ITEM_UP)){
      othis.removeClass(STR_ITEM_UP).addClass(STR_ITEM_DOWN);
      elemIcon.removeClass('layui-icon-down').addClass('layui-icon-up');
    } else {
      othis.removeClass(STR_ITEM_DOWN).addClass(STR_ITEM_UP);
      elemIcon.removeClass('layui-icon-up').addClass('layui-icon-down')
    }
  };
  
  //全局事件
  ;!function(){
    var _WIN = $(window)
    ,_DOC = $(document);
    
    //自适应定位
    _WIN.on('resize', function(){
      if(!dropdown.thisId) return;
      var that = thisModule.getThis(dropdown.thisId);
      if(!that) return;
      
      if(!that.elemView[0] || !$('.'+ STR_ELEM)[0]){
        return false;
      }
      
      var options = that.config;
      
      if(options.trigger === 'contextmenu'){
        that.remove();
      } else {
        that.position();
      }
    });
    
    
      
    //点击任意处关闭
    _DOC.on(clickOrMousedown, function(e){
      if(!dropdown.thisId) return;
      var that = thisModule.getThis(dropdown.thisId)
      if(!that) return;
      
      var options = that.config;
      
      //如果触发的是绑定的元素，或者属于绑定元素的子元素，则不关闭
      //满足条件：当前绑定的元素不是 body document，或者不是鼠标右键事件
      if(!(lay.isTopElem(options.elem[0]) || options.trigger === 'contextmenu')){
        if(
          e.target === options.elem[0] || 
          options.elem.find(e.target)[0] ||
          (that.elemView && e.target === that.elemView[0]) ||
          (that.elemView && that.elemView.find(e.target)[0])
        ) return;
      }
      
      that.remove();
    });
    
    //基础菜单的静态元素事件
    var ELEM_LI = '.layui-menu:not(.layui-dropdown-menu) li';
    _DOC.on('click', ELEM_LI, function(e){
      var othis = $(this)
      ,parent = othis.parents('.layui-menu').eq(0)
      ,isChild = othis.hasClass(STR_ITEM_GROUP) || othis.hasClass(STR_ITEM_PARENT)
      ,filter = parent.attr('lay-filter') || parent.attr('id')
      ,options = lay.options(this);
      
      //非触发元素
      if(othis.hasClass(STR_ITEM_DIV)) return;

      //非菜单组
      if(!isChild){
        //选中
        parent.find('.'+ STR_ITEM_CHECKED).removeClass(STR_ITEM_CHECKED); //清除选中样式
        parent.find('.'+ STR_ITEM_CHECKED2).removeClass(STR_ITEM_CHECKED2); //清除父级菜单选中样式
        othis.addClass(STR_ITEM_CHECKED); //添加选中样式
        othis.parents('.'+ STR_ITEM_PARENT).addClass(STR_ITEM_CHECKED2); //添加父级菜单选中样式

        options.title = options.title || $.trim(othis.children('.'+ STR_MENU_TITLE).text());
        
        //触发事件
        layui.event.call(this, MOD_NAME, 'click('+ filter +')', options);
      }
    });
    
    //基础菜单的展开收缩事件
    _DOC.on('click', (ELEM_LI + STR_GROUP_TITLE), function(e){
      var othis = $(this)
      ,elemGroup = othis.parents('.'+ STR_ITEM_GROUP +':eq(0)')
      ,options = lay.options(elemGroup[0]);

      if(('isAllowSpread' in options) ? options.isAllowSpread : true){
        thisModule.spread(elemGroup);
      }
    });
    
    //判断子级菜单是否超出屏幕
    var ELEM_LI_PAR = '.layui-menu .'+ STR_ITEM_PARENT
    _DOC.on('mouseenter', ELEM_LI_PAR, function(e){
      var othis = $(this)
      ,elemPanel = othis.find('.'+ STR_MENU_PANEL);

      if(!elemPanel[0]) return;
      var rect = elemPanel[0].getBoundingClientRect();
      
      //是否超出右侧屏幕
      if(rect.right > _WIN.width()){
        elemPanel.addClass(STR_MENU_PANEL_L);
        //不允许超出左侧屏幕
        rect = elemPanel[0].getBoundingClientRect();
        if(rect.left < 0){
          elemPanel.removeClass(STR_MENU_PANEL_L);
        }
      }
      
      //是否超出底部屏幕
      if(rect.bottom > _WIN.height()){
        elemPanel.eq(0).css('margin-top', -(rect.bottom - _WIN.height() + 5));
      }
    }).on('mouseleave', ELEM_LI_PAR, function(e){
      var othis = $(this)
      ,elemPanel = othis.children('.'+ STR_MENU_PANEL);
      
      elemPanel.removeClass(STR_MENU_PANEL_L);
      elemPanel.css('margin-top', 0);
    });
    
  }();

  // 关闭面板
  dropdown.close = function(id){
    var that = thisModule.getThis(id);
    if(!that) return this;
    
    that.remove();
    return thisModule.call(that);
  };
  
  // 重载实例
  dropdown.reload = function(id, options, type){
    var that = thisModule.getThis(id);
    if(!that) return this;

    that.reload(options, type);
    return thisModule.call(that);
  };

  // 仅重载数据
  dropdown.reloadData = function(){
    var args = $.extend([], arguments);
    args[2] = 'reloadData';

    // 重载时，与数据相关的参数
    var dataParams = new RegExp('^('+ [
      'data', 'templet', 'content'
    ].join('|') + ')$');

    // 过滤与数据无关的参数
    layui.each(args[1], function (key, value) {
      if(!dataParams.test(key)){
        delete args[1][key];
      }
    });

    return dropdown.reload.apply(null, args);
  };

  // 核心入口
  dropdown.render = function(options){
    var inst = new Class(options);
    return thisModule.call(inst);
  };

  exports(MOD_NAME, dropdown);
});
