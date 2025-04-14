/**
 * dropdown
 * 下拉菜单组件
 */

layui.define(['jquery', 'laytpl', 'lay', 'util'], function(exports) {
  "use strict";

  var $ = layui.$;
  var laytpl = layui.laytpl;
  var util = layui.util;
  var hint = layui.hint();
  var device = layui.device();
  var clickOrMousedown = (device.mobile ? 'touchstart' : 'mousedown');

  // 模块名
  var MOD_NAME = 'dropdown';
  var MOD_INDEX = 'layui_'+ MOD_NAME +'_index'; // 模块索引名
  var MOD_INDEX_OPENED = MOD_INDEX + '_opened';
  var MOD_ID = 'lay-' + MOD_NAME + '-id';

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
        that.remove()
      },
      open: function () {
        that.render()
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
    closeOnClick: true // 面板打开后，再次点击目标元素时是否关闭面板。行为取决于所使用的触发事件类型
  };

  // 重载实例
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
    if(!rerender && elem.attr(MOD_ID)){
      var newThat = thisModule.getThis(elem.attr(MOD_ID));
      if(!newThat) return;
      return newThat.reload(options, type);
    }

    options.elem = $(options.elem);
    options.target = $('body'); // 后续考虑开放 target 元素

    // 初始化 id 属性 - 优先取 options > 元素 id > 自增索引
    options.id = 'id' in options ? options.id : (
      elem.attr('id') || that.index
    );

    thisModule.that[options.id] = that; // 记录当前实例对象
    elem.attr(MOD_ID, options.id); // 目标元素已渲染过的标记

    // 初始化自定义字段名
    options.customName = $.extend({}, dropdown.config.customName, options.customName);

    // 若传入 hover，则解析为 mouseenter
    if (options.trigger === 'hover') {
      options.trigger = 'mouseenter';
    }

    // 初始即显示或者面板弹出之后执行了刷新数据
    if(options.show || (type === 'reloadData' && that.mainElem && options.target.find(that.mainElem.get(0)).length)) that.render(type);

    // 事件
    that.events();
  };

  // 渲染
  Class.prototype.render = function(type) {
    var that = this;
    var options = that.config;
    var customName = options.customName;

    // 默认菜单内容
    var getDefaultView = function(){
      var elemUl = $('<ul class="layui-menu layui-dropdown-menu"></ul>');
      if(options.data.length > 0 ){
        eachItemView(elemUl, options.data)
      } else {
        elemUl.html('<li class="layui-menu-item-none">暂无数据</li>');
      }
      return elemUl;
    };

    // 遍历菜单项
    var eachItemView = function(views, data){
      // var views = [];

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
            elemPanel.append(eachItemView(elemUl, item[customName.children]));
            viewLi.append(elemPanel);
          } else {
            viewLi.append(eachItemView(elemUl, item[customName.children]));
          }
        }

        views.append(viewLi);
      });
      return views;
    };

    // 主模板
    var TPL_MAIN = [
      '<div class="layui-dropdown layui-border-box layui-panel layui-anim layui-anim-downbit" ' + MOD_ID + '="' + options.id + '">',
      '</div>'
    ].join('');

    // 重载或插入面板内容
    var content = options.content || getDefaultView();
    var mainElemExisted = thisModule.findMainElem(options.id);
    if (type === 'reloadData' && mainElemExisted.length) { // 是否仅重载数据
      var mainElem = that.mainElem = mainElemExisted;
      mainElemExisted.html(content);
    } else { // 常规渲染
      var mainElem = that.mainElem = $(TPL_MAIN);
      mainElem.append(content);

      // 初始化某些属性
      mainElem.addClass(options.className);
      mainElem.attr('style', options.style);

      // 辞旧迎新
      that.remove(dropdown.thisId);
      options.target.append(mainElem);
      options.elem.data(MOD_INDEX_OPENED, true); // 面板已打开的标记

      // 遮罩
      var shade = options.shade ? ('<div class="'+ STR_ELEM_SHADE +'" style="'+ ('z-index:'+ (mainElem.css('z-index')-1) +'; background-color: ' + (options.shade[1] || '#000') + '; opacity: ' + (options.shade[0] || options.shade)) +'"></div>') : '';
      mainElem.before(shade);

      // 如果是鼠标移入事件，则鼠标移出时自动关闭
      if(options.trigger === 'mouseenter'){
        mainElem.on('mouseenter', function(){
          clearTimeout(thisModule.timer);
        }).on('mouseleave', function(){
          that.delayRemove();
        });
      }
    }

    that.position(); // 定位坐标
    dropdown.thisId = options.id; // 当前打开的面板 id

    // 阻止全局事件
    mainElem.find('.layui-menu').on(clickOrMousedown, function(e){
      layui.stope(e);
    });

    // 触发菜单列表事件
    mainElem.find('.layui-menu li').on('click', function(e){
      var othis = $(this);
      var data = othis.data('item') || {};
      var isChild = data[customName.children] && data[customName.children].length > 0;
      var isClickAllScope = options.clickScope === 'all'; // 是否所有父子菜单均触发点击事件

      if(data.disabled) return; // 菜单项禁用状态

      // 普通菜单项点击后的回调及关闭面板
      if((!isChild || isClickAllScope) && data.type !== '-'){
        var ret = typeof options.click === 'function'
          ? options.click(data, othis, e)
        : null;

        ret === false || (isChild || that.remove());
        layui.stope(e);
      }
    });

    // 触发菜单组展开收缩
    mainElem.find(STR_GROUP_TITLE).on('click', function(e){
      var othis = $(this);
      var elemGroup = othis.parent();
      var data = elemGroup.data('item') || {};

      if(data.type === 'group' && options.isAllowSpread){
        thisModule.spread(elemGroup, options.accordion);
      }
    });

    // 组件打开完毕的事件
    typeof options.ready === 'function' && options.ready(mainElem, options.elem);
  };

  // 位置定位
  Class.prototype.position = function(obj){
    var that = this;
    var options = that.config;

    lay.position(options.elem[0], that.mainElem[0], {
      position: options.position,
      e: that.e,
      clickType: options.trigger === 'contextmenu' ? 'right' : null,
      align: options.align || null
    });
  };

  // 移除面板
  Class.prototype.remove = function(id) {
    id = id || this.config.id;
    var that = thisModule.getThis(id); // 根据 id 查找对应的实例
    if (!that) return;

    var options = that.config;
    var mainElem = thisModule.findMainElem(id);

    // 若存在已打开的面板元素，则移除
    if (mainElem[0]) {
      mainElem.prev('.' + STR_ELEM_SHADE).remove(); // 先移除遮罩
      mainElem.remove();
      options.elem.removeData(MOD_INDEX_OPENED);
      delete dropdown.thisId;
      typeof options.close === 'function' && options.close(options.elem);
    }
  };

  Class.prototype.normalizedDelay = function(){
    var that = this;
    var options = that.config;
    var delay = [].concat(options.delay);

    return {
      show: delay[0],
      hide: delay[1] !== undefined ? delay[1] : delay[0]
    }
  }

  // 延迟移除面板
  Class.prototype.delayRemove = function(){
    var that = this;
    var options = that.config;
    clearTimeout(thisModule.timer);

    thisModule.timer = setTimeout(function(){
      that.remove();
    }, that.normalizedDelay().hide);
  };

  // 事件
  Class.prototype.events = function(){
    var that = this;
    var options = that.config;

    // 是否鼠标移入时触发
    var isMouseEnter = options.trigger === 'mouseenter';
    var trigger = options.trigger + '.lay_dropdown_render';

    // 始终先解除上一个触发元素的事件（如重载时改变 elem 的情况）
    if (that.thisEventElem) that.thisEventElem.off(trigger);
    that.thisEventElem = options.elem;

    // 触发元素事件
    options.elem.off(trigger).on(trigger, function(e) {
      clearTimeout(thisModule.timer);
      that.e = e;

      // 主面板是否已打开
      var opened = options.elem.data(MOD_INDEX_OPENED);

      // 若为鼠标移入事件，则延迟触发
      if (isMouseEnter) {
        if (!opened) {
          thisModule.timer = setTimeout(function(){
            that.render();
          }, that.normalizedDelay().show);
        }
      } else {
        // 若为 click 事件，则根据主面板状态，自动切换打开与关闭
        if (options.closeOnClick && opened && options.trigger === 'click') {
          that.remove();
        } else {
          that.render();
        }
      }

      e.preventDefault();
    });

    // 如果是鼠标移入事件
    if (isMouseEnter) {
      // 执行鼠标移出事件
      options.elem.on('mouseleave', function(){
        that.delayRemove();
      });
    }
  };

  // 记录所有实例
  thisModule.that = {}; // 记录所有实例对象

  // 获取当前实例对象
  thisModule.getThis = function(id) {
    if (id === undefined) {
      throw new Error('ID argument required');
    }
    return thisModule.that[id];
  };

  // 根据 id 从页面查找组件主面板元素
  thisModule.findMainElem = function(id) {
    return $('.' + STR_ELEM + '[' + MOD_ID + '="' + id + '"]');
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

    // 自适应定位
    _WIN.on('resize', function(){
      if(!dropdown.thisId) return;
      var that = thisModule.getThis(dropdown.thisId);
      if(!that) return;

      if((that.mainElem && !that.mainElem[0]) || !$('.'+ STR_ELEM)[0]){
        return false;
      }

      var options = that.config;

      if(options.trigger === 'contextmenu'){
        that.remove();
      } else {
        that.position();
      }
    });



    // 点击任意处关闭
    lay(_DOC).on(clickOrMousedown, function(e){
      if(!dropdown.thisId) return;
      var that = thisModule.getThis(dropdown.thisId)
      if(!that) return;

      var options = that.config;
      var isTopElem = lay.isTopElem(options.elem[0]);
      var isCtxMenu = options.trigger === 'contextmenu';

      // 若触发的是绑定的元素，或者属于绑定元素的子元素，则不关闭
      // 满足条件：当前绑定的元素是 body document，或者是鼠标右键事件时，忽略绑定元素
      var isTriggerTarget = !(isTopElem || isCtxMenu) && (options.elem[0] === e.target || options.elem.find(e.target)[0]);
      var isPanelTarget = that.mainElem && (e.target === that.mainElem[0] || that.mainElem.find(e.target)[0]);
      if(isTriggerTarget || isPanelTarget) return;
      // 处理移动端点击穿透问题
      if(e.type === 'touchstart' && options.elem.data(MOD_INDEX_OPENED)){
        $(e.target).hasClass(STR_ELEM_SHADE) && e.preventDefault();
      }

      // 点击 dropdown 外部时的回调
      if(typeof options.onClickOutside === 'function'){
        var shouldClose = options.onClickOutside(e);
        if(shouldClose === false) return;
      }

      that.remove();
    }, lay.passiveSupported ? { passive: false} : false);

    // onClickOutside 检测 iframe 
    _WIN.on('blur', function(e){
      if(!dropdown.thisId) return;
      var that = thisModule.getThis(dropdown.thisId)
      if(!that) return;
      if(!that.config.elem.data(MOD_INDEX_OPENED)) return;

      setTimeout(function(){
        if(document.activeElement && document.activeElement.tagName === 'IFRAME'
          && that.mainElem && that.mainElem[0]
          && that.mainElem[0].contains && !that.mainElem[0].contains(document.activeElement)
        ){
          // 点击 dropdown 外部时的回调
          if(typeof that.config.onClickOutside === 'function'){
            var shouldClose = that.config.onClickOutside(e.originalEvent);
            if(shouldClose === false) return;
          }
          that.remove();
        }
      }, 0);
    })

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

  })();

  // 关闭面板
  dropdown.close = function(id){
    var that = thisModule.getThis(id);
    if(!that) return this;

    that.remove();
    return thisModule.call(that);
  };

  // 打开面板
  dropdown.open = function(id){
    var that = thisModule.getThis(id);
    if(!that) return this;

    that.render();
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

  // 核心入口
  dropdown.render = function(options){
    var inst = new Class(options);
    return thisModule.call(inst);
  };

  exports(MOD_NAME, dropdown);
});
