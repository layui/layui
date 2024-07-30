/**
 * dropdown 
 * 下拉菜单组件
 */

layui.define(['jquery', 'laytpl', 'lay', 'util'], function(exports){
  "use strict";
  
  var $ = layui.$;
  var laytpl = layui.laytpl;
  var util = layui.util;
  var lay = layui.lay;
  var hint = layui.hint();
  var device = layui.device();
  var clickOrMousedown = (device.mobile ? 'touchstart' : 'mousedown');
  
  // 模块名
  var MOD_NAME = 'dropdown';
  var MOD_INDEX = 'layui_'+ MOD_NAME +'_index'; // 模块索引名
  var MOD_ID = 'lay-' + MOD_NAME + '-id';
  var EVENT_NAMESPACE = '.lay_dropdown';
  var DESTROY_EVENT = '_lay-dropdown-destroy';

  // 外部接口
  var dropdown = {
    config: {
      customName: { // 自定义 data 字段名
        id: 'id',
        title: 'title',
        children: 'child'
      }
    },
    index: layui[MOD_NAME] ? (layui[MOD_NAME].index + 10000) : 0,

    // 设置全局项
    set: function(options){
      var that = this;
      that.config = $.extend({}, that.config, options);
      return that;
    },
    
    // 事件
    on: function(events, callback){
      return layui.onevent.call(this, MOD_NAME, events, callback);
    }
  };

  // 操作当前实例
  var thisModule = function(){
    var that = this;
    var options = that.config;
    var id = options.id;

    thisModule.that[id] = that; // 记录当前实例对象

    return {
      config: options,
      // 重置实例
      reload: function(options){
        that.reload.call(that, options);
      },
      reloadData: function(options){
        dropdown.reloadData(id, options);
      },
      close: function () {
        that.close()
      },
      open: function () {
        that.open()
      }
    }
  };

  // 字符常量
  var STR_ELEM = 'layui-dropdown';
  var STR_HIDE = 'layui-hide';
  var STR_DISABLED = 'layui-disabled';
  var STR_NONE = 'layui-none';
  var STR_ITEM_UP = 'layui-menu-item-up';
  var STR_ITEM_DOWN = 'layui-menu-item-down';
  var STR_MENU_TITLE = 'layui-menu-body-title';
  var STR_ITEM_GROUP = 'layui-menu-item-group';
  var STR_ITEM_PARENT = 'layui-menu-item-parent';
  var STR_ITEM_DIV = 'layui-menu-item-divider';
  var STR_ITEM_CHECKED = 'layui-menu-item-checked';
  var STR_ITEM_CHECKED2 = 'layui-menu-item-checked2';
  var STR_MENU_PANEL = 'layui-menu-body-panel';
  var STR_MENU_PANEL_L = 'layui-menu-body-panel-left';
  var STR_ELEM_SHADE = 'layui-dropdown-shade';
  
  var STR_GROUP_TITLE = '.'+ STR_ITEM_GROUP + '>.'+ STR_MENU_TITLE;

  // 构造器
  var Class = function(options){
    var that = this;
    that.index = ++dropdown.index;
    that.config = $.extend({}, that.config, dropdown.config, options);
    that.childrenIds = {};
    that.init();
  };

  // 默认配置
  Class.prototype.config = {
    trigger: 'click', // 事件类型
    content: '', // 自定义菜单内容
    className: '', // 自定义样式类名
    style: '', // 设置面板 style 属性
    show: false, // 是否初始即显示菜单面板
    isAllowSpread: true, // 是否允许菜单组展开收缩
    isSpreadItem: true, // 是否初始展开子菜单
    data: [], // 菜单数据结构
    delay: [200, 300], // 延时显示或隐藏的毫秒数，若为 number 类型，则表示显示和隐藏的延迟时间相同，trigger 为 hover 时才生效
    shade: 0, // 遮罩
    accordion: false, // 手风琴效果，仅菜单组生效。基础菜单需要在容器上追加 'lay-accordion' 属性。
    closeOnClickOutside: true, // 点击面板外部时是否关闭
    closeOnClickTrigger: false, // 点击触发元素时是否关闭
    hideOnClose: false // 关闭时隐藏面板
  };
  
  /**
   * 重载实例
   * @param {object} options - 配置项 
   * @param {'reload' | 'reloadData'} [type="reload"] - 重载类型 
   */
  Class.prototype.reload = function(options, type){
    var that = this;
    // 绑定元素改变时，清理旧事件
    if(options.elem && options.elem !== that.config.elem){
      that.config.elem.off(EVENT_NAMESPACE);
    }
    that.config = $.extend({}, that.config, options);
    that.init(true, type || 'reload');
  };

  /**
   * 初始化准备
   * @param {boolean} [rerender] - 是否是重复渲染
   * @param {'reload' | 'reloadData' | undefined} [type] - 渲染类型 
   */
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
    if(!rerender && elem[0] && elem.attr(MOD_ID)){
      var newThat = thisModule.getThis(elem.attr(MOD_ID));
      if(!newThat) return;

      return newThat.reload(options, type);
    }

    options.elem = $(options.elem);
    
    // 初始化 id 属性 - 优先取 options > 元素 id > 自增索引
    options.id = 'id' in options ? options.id : (
      elem.attr('id') || that.index
    );

    elem.attr(MOD_ID, options.id);

    // 初始化自定义字段名
    options.customName = $.extend({}, dropdown.config.customName, options.customName);

    // 初始即显示或者面板弹出之后执行了刷新数据
    var isOpened = options.elem.data(MOD_INDEX +'_opened');
    if(options.show || (type === 'reloadData' && isOpened)){
      that.open(rerender, type);
    }
    that.events(); // 事件
    // 初始化完毕事件
    options.elem.trigger('_lay-dropdown-inited', {id: options.id});
  };

  /**
   * 创建默认菜单内容
   * @returns {JQuery}
   */
  Class.prototype.createDefaultView = function(){
    var that = this;
    var options = that.config;

    var elemUl = $('<ul class="layui-menu layui-dropdown-menu"></ul>');
    if(options.data.length > 0 ){
      that.createMenuItemView(elemUl, options.data)
    } else {
      elemUl.html('<li class="layui-menu-item-none">暂无数据</li>');
    }
    return elemUl;
  }

  /**
   * 创建菜单项
   * @param {JQuery} views - 菜单视图元素 
   * @param {object} data - 菜单数据结构
   * @returns {JQuery} 
   */
  Class.prototype.createMenuItemView = function(views, data){
    var that = this;
    var options = that.config;
    var customName = options.customName;

    layui.each(data, function(index, item){
      // 是否存在子级
      var isChild = item[customName.children] && item[customName.children].length > 0;
      var isSpreadItem = ('isSpreadItem' in item) ? item.isSpreadItem : options.isSpreadItem
      var title = function(title){
        var templet = item.templet || options.templet;
        if(templet){
          title = typeof templet === 'function' 
            ? templet(item)
          : laytpl(templet).render(item);
        }
        return title;
      }(util.escape(item[customName.title]));
      
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

      if(type !== '-' && (!item[customName.title] && !item[customName.id] && !isChild)) return;
      
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
        var elemPanel = $('<div class="layui-panel layui-menu-body-panel"></div>');
        var elemUl = $('<ul></ul>');

        if(type === 'parent'){
          elemPanel.append(that.createMenuItemView(elemUl, item[customName.children]));
          viewLi.append(elemPanel);
        } else {
          viewLi.append(that.createMenuItemView(elemUl, item[customName.children]));
        }
      }

      views.append(viewLi);
    });
    return views;
  }
  
  /**
   * 渲染面板内容
   * @param {boolean | undefined} rerender - 重新渲染面板内容
   * @param {'reload' | 'reloadData' | undefined} type - 渲染类型
   */
  Class.prototype.render = function(rerender, type){
    var that = this;
    var options = that.config;
    var customName = options.customName;
    var elemBody = $('body');
    var isCtxMenu = options.trigger === 'contextmenu';
    var isTopElem = lay.isTopElem(options.elem[0]);
    
    // 主模板
    var TPL_MAIN = [
      '<div ', 
        'class="layui-dropdown layui-border-box layui-panel layui-anim layui-anim-downbit" ',
        MOD_ID + '="' + options.id + '" ',
      '>',
      '</div>'
    ].join('');
    
    // 如果是右键事件，则每次触发事件时，将允许重新渲染
    if(isCtxMenu || isTopElem) rerender = true;
    
    // 判断是否已经打开了下拉菜单面板
    if(!rerender && options.elem.data(MOD_INDEX +'_opened')) return;

    // 记录模板对象
    that.elemView = $('.' + STR_ELEM + '[' + MOD_ID + '="' + options.id + '"]');
    if (type === 'reloadData' && that.elemView.length) {
      that.elemView.empty().append(options.content || that.createDefaultView());
    } else {
      if(type === 'reload'){
        // 因为需要移除旧事件，所以不用 that.remove
        that.close(true);
      }
      that.elemView = $(TPL_MAIN);
      that.elemView.append(options.content || that.createDefaultView());

      // 初始化某些属性
      if(options.className) that.elemView.addClass(options.className);
      if(options.style) that.elemView.attr('style', options.style);

      // 插入视图
      elemBody.append(that.elemView);

      // 遮罩
      var shadeTpl = options.shade
        ? ['<div',
            ' lay-dropdown-shade-id="' + options.id + '"',
            ' class="'+ STR_ELEM_SHADE +'"', 
            ' style="'+ [
                'z-index:'+ (that.elemView.css('z-index')-1),
                'background-color:' + (options.shade[1] || '#000'),
                'opacity:' + (options.shade[0] || options.shade)
              ].join(';') +'"',
           '></div>'
          ].join('')
        : '';
      that.shadeElem = $(shadeTpl);
      that.elemView.before(that.shadeElem);
      // 事件绑定
      that.viewEvents();
    }

    // 坐标定位
    that.position();
    
    // 阻止全局事件
    that.elemView.find('.layui-menu').on(clickOrMousedown, function(e){
      layui.stope(e);
    });

    // 触发菜单列表事件
    that.elemView.find('.layui-menu li').on('click', function(e){
      var othis = $(this);
      var data = othis.data('item') || {};
      var isChild = data[customName.children] && data[customName.children].length > 0;
      var isClickAllScope = options.clickScope === 'all'; // 是否所有父子菜单均触发点击事件

      if(data.disabled) return; // 菜单项禁用状态
      
      // 普通菜单项点击后的回调及关闭面板
      if((!isChild || isClickAllScope) && data.type !== '-'){
        var ret = typeof options.click === 'function' 
          ? options.click(data, othis) 
        : null;
        
        ret === false || (isChild || that.close());
        layui.stope(e);
      }
    });
    
    // 触发菜单组展开收缩
    that.elemView.find(STR_GROUP_TITLE).on('click', function(e){
      var othis = $(this);
      var elemGroup = othis.parent();
      var data = elemGroup.data('item') || {};
      
      if(data.type === 'group' && options.isAllowSpread){
        thisModule.spread(elemGroup, options.accordion);
      }
    });

    // 组件面板渲染完毕的事件
    typeof options.ready === "function" && options.ready(
      that.elemView,
      options.elem
    );
  };
  
  /**
   * 位置定位
   */
  Class.prototype.position = function(){
    var that = this;
    var options = that.config;
    
    lay.position(options.elem[0], that.elemView[0], {
      position: options.position,
      e: that.e,
      clickType: options.trigger === 'contextmenu' ? 'right' : null,
      align: options.align || null
    });
  };
  
  /**
   * 删除视图
   */
  Class.prototype.remove = function(){
    var that = this;
    var options = that.config;
    var contentElem = that.elemView;
    var shadeElem = that.shadeElem;

    // 受限于自动销毁实例的实现机制，需要最后清理外层元素
    contentElem  && contentElem.empty().remove();
    shadeElem && shadeElem.empty().remove();
  };

  /**
   * 规范化 delay 参数
   * @returns {{show:number, hide:number}}
   */
  Class.prototype.normalizedDelay = function(){
    var that = this;
    var options = that.config;
    var delay = [].concat(options.delay);
    
    return {
      show: delay[0],
      hide: delay[1] !== undefined ? delay[1] : delay[0]  
    }
  }
  
  /**
   * 延迟删除视图
   */
  Class.prototype.delayClose = function(){
    var that = this;
    var options = that.config;
    clearTimeout(that.timer);

    that.timer = setTimeout(function(){
      that.close();
    }, that.normalizedDelay().hide);
  };
  
  /**
   * 初始化触发元素事件
   */
  Class.prototype.events = function(){
    var that = this;
    var options = that.config;
    
    // 若传入 hover，则解析为 mouseenter
    if(options.trigger === 'hover') options.trigger = 'mouseenter';

    // 解除上一个事件
    options.elem.off(EVENT_NAMESPACE);

    // 是否鼠标移入时触发
    var isMouseEnter = options.trigger === 'mouseenter';
    var isCtxMenu = options.trigger === 'contextmenu';
    
    var triggerCallback = function(e){
      clearTimeout(that.timer);
      that.e = e;

      // 若为鼠标移入事件，则延迟触发
      if(isMouseEnter){
        that.timer = setTimeout(function(){
          that.open();
        }, that.normalizedDelay().show)
      }else{
        if(options.elem.data(MOD_INDEX +'_opened')){
          if(options.closeOnClickTrigger || isCtxMenu) that.close();
          if(isCtxMenu) that.open();
        }else{
          that.open();
        }
      }
      
      e.preventDefault();
    };

    // 触发元素事件
    options.elem.on(options.trigger + EVENT_NAMESPACE, triggerCallback);
    
    // 如果是鼠标移入事件
    if (isMouseEnter) {
      // 执行鼠标移出事件
      options.elem.on('mouseleave' + EVENT_NAMESPACE, function(e){
        that.delayClose();
      });
    }

    // 移除触发元素时，自动销毁实例
    if(!options.elem.data(DESTROY_EVENT)){
      options.elem.on(DESTROY_EVENT, function(e){
        that.dispose();
      })
    }
  };

  /**
   * 初始化视图元素事件
   */
  Class.prototype.viewEvents = function(){
    var that = this;
    var options = that.config;

  // 如果是鼠标移入事件，则鼠标移出时自动关闭
    if(options.trigger === 'mouseenter'){
      that.elemView.on('mouseenter', function(){
        clearTimeout(that.timer);
      }).on('mouseleave', function(e){
        options.elem.trigger('_lay-dropdown-context-hide', e.toElement);
        if(that.isNestedContains(e.toElement))return;
        
        that.delayClose();
      });
    }
    // 监听子组件初始化完毕事件
    // 收集子组件 id，并继续向父组件传播事件
    that.elemView.on('_lay-dropdown-inited' + EVENT_NAMESPACE, function(e, data){
      that.addChildrenIds(data.id);
      options.elem.trigger('_lay-dropdown-inited', data);
    })

    // 监听子组件销毁前的事件
    // 移除子组件 id，并继续向父组件传播事件
    that.elemView.on('_lay-dropdown-dispose' + EVENT_NAMESPACE, function(e, data){
      that.removeChildrenIds(data.id);
      options.elem.trigger('_lay-dropdown-dispose', data);
    })

    // 监听子组件关闭事件
    that.elemView.on('_lay-dropdown-context-hide' + EVENT_NAMESPACE, function(e, el){
      options.elem.trigger('_lay-dropdown-context-hide', el);
      if(that.isNestedContains(el))return;
      that.delayClose();
    })
  }

  /**
   * 是否嵌套包含指定元素
   * @param {HTMLElement} targetEl - 目标元素
   * @returns {boolean | undefined}
   */
  Class.prototype.isNestedContains = function (targetEl) {
    var that = this;

    if(!targetEl) return;

    for (var id in that.childrenIds) {
      if (!that.childrenIds.hasOwnProperty(id)) continue;
      var childInst = thisModule.getThis(id);
      if (childInst && childInst.elemView && childInst.elemView[0]) {
        var childPanelViewElem = childInst.elemView;
        var isCtxContains = childPanelViewElem[0] === targetEl || $.contains(childPanelViewElem[0], targetEl);
        if (isCtxContains) return true;
      }
    }
  };

  /**
   * 点击面板外部时的事件
   * @returns {(() => void) | null} 返回一个函数，用于取消事件
   */
  Class.prototype.onClickOutside = function () {
    var that = this;
    var options = that.config;
    var isCtxMenu = options.trigger === 'contextmenu';
    var isTopElem = lay.isTopElem(options.elem[0]);
    
    return lay.onClickOutside(
      that.elemView[0],
      function (e) {
        if (!options.closeOnClickOutside) return;
        // 点击面板外部时的事件，一般用于适配第三方组件
        if(typeof options.onClickOutside === 'function'){
          var shouldClose = options.onClickOutside(e);
          if(shouldClose === false) return;
        }

        // 组件嵌套支持
        if(that.isNestedContains(e.target)) return;

        that.close();
      },
      {
        ignore: (isCtxMenu || isTopElem) ? null : [options.elem[0]],
      }
    );
  };

  /**
   * 窗口大小变化时自动更新位置
   * @returns {(() => void) | null} 返回一个函数，用于取消事件
   */
  Class.prototype.autoUpdatePosition = function(){
    var that = this;
    var options = that.config;

    var handleResize = function(){
      if(options.trigger === 'contextmenu'){
        that.close();
      } else {
        that.position();
      }
    }
    $(window).on('resize' + EVENT_NAMESPACE, handleResize)

    return function(){
      $(window).off('resize' + EVENT_NAMESPACE, handleResize)
    }
  }

  /**
   * 打开面板
   * @param {boolean | undefined} rerender - 重新渲染面板内容
   * @param {'reload' | 'reloadData' | undefined} type - 渲染类型
   */
  Class.prototype.open = function(rerender, type){
    var that = this;
    var options = that.config;
    var openedWithHideOnClose = options.hideOnClose && that.elemView && that.elemView[0];
    var needRenderPanel = !openedWithHideOnClose || type === 'reload' || type === 'reloadData';

    if(needRenderPanel){
      typeof that.removeResizeEvent === 'function' && that.removeResizeEvent();
      typeof that.removeOutsideEvent === 'function' && that.removeOutsideEvent();
      that.render(rerender, type);
    }else{
      var shadeElem = that.shadeElem;
      that.elemView.removeClass(STR_HIDE);
      shadeElem && shadeElem.removeClass(STR_HIDE);
      that.position();
    }
    options.elem.data(MOD_INDEX +'_opened', true);

    that.removeOutsideEvent = that.onClickOutside();
    that.removeResizeEvent = that.autoUpdatePosition();
    // 组件打开完毕的事件
    typeof options.open === "function" && options.open(
      that.elemView,
      options.elem
    );
  }

  /**
   * 关闭面板
   * @param {boolean | undefined} [focusRemove] - 是否移除面板
   */
  Class.prototype.close = function(focusRemove){
    var that = this;
    var options = that.config;
    var triggerElem = options.elem;
    var contentElem = that.elemView;
    var shadeElem = that.shadeElem;

    if(options.hideOnClose && !focusRemove){
      contentElem && contentElem.addClass(STR_HIDE);
      shadeElem && shadeElem.addClass(STR_HIDE);
    }else{
      that.remove();
    }

    triggerElem.data(MOD_INDEX + '_opened', false);
    
    // 关闭后移除事件
    if(typeof that.removeResizeEvent === 'function'){
      that.removeResizeEvent();
      that.removeResizeEvent = null;
    }
    if(typeof that.removeOutsideEvent === 'function'){
      that.removeOutsideEvent();
      that.removeOutsideEvent = null;
    }
    // 组件关闭完毕的事件
    typeof options.close === 'function' &&  options.close(triggerElem);
  }

  /**
   * 销毁实例
   */
  Class.prototype.dispose = function(){
    var that = this;
    var options = that.config;

    options.elem.trigger('_lay-dropdown-dispose', {id: options.id});

    that.remove();
    options.elem.removeData(MOD_INDEX + '_opened');
    options.elem.removeAttr(MOD_ID);
    options.elem.off(EVENT_NAMESPACE);
    options.elem.off(DESTROY_EVENT);
    typeof that.removeResizeEvent === 'function' && that.removeResizeEvent();
    typeof that.removeOutsideEvent === 'function' && that.removeOutsideEvent();

    for(var propName in that){
      if(that.hasOwnProperty(propName) && propName !== 'config'){
        that[propName] = null;
      }
    }

    thisModule.that[options.id] = null;
    delete thisModule.that[options.id];
  }

  /**
   * 添加子组件 id
   * @param {string} id 
   */
  Class.prototype.addChildrenIds = function(id){
    var that = this;
    var options = that.config;
    var childrenIds = that.childrenIds;

    childrenIds[id] = true;
  }

  /**
   * 移除子组件 id
   * @param {string} id 
   */
  Class.prototype.removeChildrenIds = function(id){
    var that = this;
    var options = that.config;
    var childrenIds = that.childrenIds;

    delete childrenIds[id];
  }
  
  // 记录所有实例
  thisModule.that = {}; // 记录所有实例对象
  
  // 获取当前实例对象
  thisModule.getThis = function(id){
    var that = thisModule.that[id];
    if(!that) hint.error(id ? (MOD_NAME +' instance with ID \''+ id +'\' not found') : 'ID argument required');
    return that;
  };
  
  // 设置菜单组展开和收缩状态
  thisModule.spread = function(othis, isAccordion){
    var contentElem = othis.children('ul');
    var needSpread = othis.hasClass(STR_ITEM_UP);
    var ANIM_MS = 200;

    // 动画执行完成后的操作
    var complete = function() {
      $(this).css({'display': ''}); // 剔除临时 style，以适配外部样式的状态重置;
    };

    // 动画是否正在执行
    if (contentElem.is(':animated')) return;

    // 展开
    if (needSpread) {
      othis.removeClass(STR_ITEM_UP).addClass(STR_ITEM_DOWN);
      contentElem.hide().stop().slideDown(ANIM_MS, complete);
    } else { // 收缩
      contentElem.stop().slideUp(ANIM_MS, complete);
      othis.removeClass(STR_ITEM_DOWN).addClass(STR_ITEM_UP);
    }

    // 手风琴
    if (needSpread && isAccordion) {
      var groupSibs = othis.siblings('.' + STR_ITEM_DOWN);
      groupSibs.children('ul').stop().slideUp(ANIM_MS, complete);
      groupSibs.removeClass(STR_ITEM_DOWN).addClass(STR_ITEM_UP);
    }
  };
  
  // 全局事件
  (function(){
    var _WIN = $(window);
    var _DOC = $(document);
    
    // 基础菜单的静态元素事件
    var ELEM_LI = '.layui-menu:not(.layui-dropdown-menu) li';
    _DOC.on('click', ELEM_LI, function(e){
      var othis = $(this);
      var parent = othis.parents('.layui-menu').eq(0);
      var isChild = othis.hasClass(STR_ITEM_GROUP) || othis.hasClass(STR_ITEM_PARENT);
      var filter = parent.attr('lay-filter') || parent.attr('id');
      var options = lay.options(this);
      
      // 非触发元素
      if(othis.hasClass(STR_ITEM_DIV)) return;

      // 非菜单组
      if(!isChild){
        // 选中
        parent.find('.'+ STR_ITEM_CHECKED).removeClass(STR_ITEM_CHECKED); // 清除选中样式
        parent.find('.'+ STR_ITEM_CHECKED2).removeClass(STR_ITEM_CHECKED2); // 清除父级菜单选中样式
        othis.addClass(STR_ITEM_CHECKED); //添加选中样式
        othis.parents('.'+ STR_ITEM_PARENT).addClass(STR_ITEM_CHECKED2); // 添加父级菜单选中样式

        options.title = options.title || $.trim(othis.children('.'+ STR_MENU_TITLE).text());
        
        // 触发事件
        layui.event.call(this, MOD_NAME, 'click('+ filter +')', options);
      }
    });
    
    // 基础菜单的展开收缩事件
    _DOC.on('click', (ELEM_LI + STR_GROUP_TITLE), function(e){
      var othis = $(this);
      var elemGroup = othis.parents('.'+ STR_ITEM_GROUP +':eq(0)');
      var options = lay.options(elemGroup[0]);
      var isAccordion = typeof othis.parents('.layui-menu').eq(0).attr('lay-accordion') === 'string';

      if(('isAllowSpread' in options) ? options.isAllowSpread : true){
        thisModule.spread(elemGroup, isAccordion);
      }
    });
    
    // 判断子级菜单是否超出屏幕
    var ELEM_LI_PAR = '.layui-menu .'+ STR_ITEM_PARENT
    _DOC.on('mouseenter', ELEM_LI_PAR, function(e){
      var othis = $(this);
      var elemPanel = othis.find('.'+ STR_MENU_PANEL);

      if(!elemPanel[0]) return;
      var rect = elemPanel[0].getBoundingClientRect();
      
      // 是否超出右侧屏幕
      if(rect.right > _WIN.width()){
        elemPanel.addClass(STR_MENU_PANEL_L);
        // 不允许超出左侧屏幕
        rect = elemPanel[0].getBoundingClientRect();
        if(rect.left < 0){
          elemPanel.removeClass(STR_MENU_PANEL_L);
        }
      }
      
      // 是否超出底部屏幕
      if(rect.bottom > _WIN.height()){
        elemPanel.eq(0).css('margin-top', -(rect.bottom - _WIN.height() + 5));
      }
    }).on('mouseleave', ELEM_LI_PAR, function(e){
      var othis = $(this)
      var elemPanel = othis.children('.'+ STR_MENU_PANEL);
      
      elemPanel.removeClass(STR_MENU_PANEL_L);
      elemPanel.css('margin-top', 0);
    });

    // 自定义销毁事件
    $.event.special[DESTROY_EVENT] = {
      setup: function(){
        var elem = $(this);
        elem.data(DESTROY_EVENT, true);
      },
      remove: function(handleObj) {
        var elem = $(this);
        handleObj.handler();
        elem.removeData(DESTROY_EVENT);
      }
    };
  })();

  // 更新位置
  dropdown.updatePosition = function(id){
    var that = thisModule.getThis(id);
    if(!that) return this;
  
    that.position();
    return thisModule.call(that);
  }

  // 关闭面板
  dropdown.close = function(id){
    var that = thisModule.getThis(id);
    if(!that) return this;
    
    that.close();
    return thisModule.call(that);
  };

  // 打开面板
  dropdown.open = function(id){
    var that = thisModule.getThis(id);
    if(!that) return this;
    
    that.open();
    return thisModule.call(that);
  }
  
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

  // 销毁实例
  dropdown.destroy = function(id){
    var that = thisModule.getThis(id);
    if(!that) return this;

    that.dispose();
  }

  // 核心入口
  dropdown.render = function(options){
    var inst = new Class(options);
    return thisModule.call(inst);
  };

  exports(MOD_NAME, dropdown);
});
