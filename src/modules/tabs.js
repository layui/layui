/**
 * tabs
 * 标签页组件
 */

layui.define('component', function(exports) {
  'use strict';

  var $ = layui.$;

  // 创建组件
  var component = layui.component({
    name: 'tabs', // 组件名

    // 默认配置
    config: {
      elem: '.layui-tabs',
      trigger: 'click', // 触发事件
      headerMode: 'auto' // 标签头部的显示模式
    },

    CONST: {
      ELEM: 'layui-tabs',
      HEADER: 'layui-tabs-header',
      CLOSE: 'layui-tabs-close',
      BODY: 'layui-tabs-body',
      ITEM: 'layui-tabs-item',
      CARD: 'layui-tabs-card',
      TRIGGER_NAME: 'LAY_TABS_ELEM_callback'
    },

    isRenderOnEvent: false,

    // 渲染
    render: function() {
      var that = this;
      var options = that.config;

      // 标签页元素项
      that.elemHeader = ['.'+ component.CONST.HEADER + ':eq(0)', '>li'];
      that.elemBody = ['.'+ component.CONST.BODY + ':eq(0)', '>.'+ component.CONST.ITEM];

      // 获取头部和内容元素
      that.elemItem = function(){
        var thisElem = that.thisElem || options.elem;
        return {
          header: {
            elem: thisElem.find(that.elemHeader[0]),
            items: thisElem.find(that.elemHeader.join(''))
          },
          body: {
            elem: thisElem.find(that.elemBody[0]),
            items: thisElem.find(that.elemBody.join(''))
          }
        };
      };

      // 如果传入 header 参数
      if (layui.type(options.header) === 'array') {
        if (options.header.length === 0) return;

        // 是否为元素绑定
        if (typeof options.header[0] === 'string') {
          that.elemHeader = options.header.concat();
          that.thisElem = $('body');
        } else { // 方法传值渲染
          that.elemView = $('<div class="layui-tabs"></div>');
          if (options.className) that.elemView.addClass(options.className);

          var elemHeader = $('<ul class="layui-tabs-header"></ul>');
          var elemBody = $('<div class="layui-tabs-body"></div>');

          // 生成标签项
          layui.each(options.header, function(i, item){
            var elemHeaderItem = that.renderHeaderItem(item);
            elemHeader.append(elemHeaderItem);
          });
          layui.each(options.body, function(i, item){
            var elemBodyItem = that.renderBodyItem(item);
            elemBody.append(elemBodyItem);
          });

          that.elemView.append(elemHeader).append(elemBody);
          options.elem.html(that.elemView);
        }
      } else {
        that.renderClose(); // 初始化标签关闭结构
      }

      // 如果传入 body 参数
      if (layui.type(options.body) === 'array') {
        if (typeof options.body[0] === 'string') {
          that.thisElem = $('body');
          that.elemBody = options.body.concat();
        }
      }

      // 初始选中项
      var data = that.data();
      if ('index' in options && data.index != options.index) {
        that.change(that.findHeaderItem(options.index));
      } else if (data.index === -1) {
        that.change(that.findHeaderItem(0));
      }

      // 初始化滚动结构
      that.roll('auto');

      // 清除隐藏占位
      if (options.elem.hasClass(component.CONST.CLASS_HIDEV)) {
        options.elem.removeClass(component.CONST.CLASS_HIDEV);
      }

      // 回调
      typeof options.ready === 'function' && options.ready(data);
      layui.event.call(options.elem[0], component.CONST.MOD_NAME, 'ready('+ options.id +')', data); // 事件
    },

    // 事件
    events: function() {
      var that = this;
      var options = that.config;
      var elemItem = that.elemItem();
      var TRIGGER_NAME = component.CONST.TRIGGER_NAME;
      var thisElem = that.thisElem ? elemItem.header.elem : options.elem;

      // 移除重复事件
      if (thisElem.data(TRIGGER_NAME)) {
        thisElem.off(options.trigger, thisElem.data(TRIGGER_NAME));
      }

      // 点击标签头部
      var elemHeaderItem = that.thisElem ? that.elemHeader[1] : that.elemHeader.join('');
      thisElem.data(TRIGGER_NAME, function(){
        that.change($(this));
      }).on(options.trigger, elemHeaderItem, thisElem.data(TRIGGER_NAME));

      // resize 事件
      if (!inner.onresize) {
        var timer;
        $(window).on('resize', function(){
          clearTimeout(timer);
          timer = setTimeout(function(){
            layui.each(component.cache.id, function(key){
              var that = component.getThis(key);
              if(!that) return;
              that.roll('init');
            });
          },50);
        });
        inner.onresize = true;
      }
    }
  });

  // 内部变量集
  var inner = {};

  /**
   * 扩展组件原型方法
   */

  var Class = component.Class;

  /**
   * 增加标签
   * @param {*} obj
   */
  Class.prototype.add = function(obj){
    var that = this;
    var options = that.config;
    var elemItem = that.elemItem();
    var newHeaderItem = that.renderHeaderItem(obj);
    var newBodyItem = that.renderBodyItem(obj);

    // 插入方式
    if (obj.mode === 'curr') { // 在当前标签后插入
      var data = that.data();
      data.thisHeader.after(newHeaderItem);
      data.thisBody.after(newBodyItem);
    } else {
      var mode = ({
        prepend: 'prepend'
        ,append: 'append'
      })[obj.mode || 'append'] || 'append';
      elemItem.header.elem[mode](newHeaderItem);
      elemItem.body.elem[mode](newBodyItem);
    }

    // 将插入项切换为当前标签
    that.change(newHeaderItem);

    // 回调
    var params = that.data();
    typeof obj.done === 'function' && obj.done(params);
    typeof options.add === 'function' && options.add(params);
    layui.event.call(newHeaderItem[0], component.CONST.MOD_NAME, 'add('+ options.id +')', params); // 事件
  };

  // 关闭指定标签
  Class.prototype.close = function(thisHeader) {
    if(!thisHeader || !thisHeader[0]) return;

    var that = this;
    var options = that.config;
    var index = thisHeader.index();

    if (!thisHeader[0]) return;

    // 不可关闭项
    if (thisHeader.attr('lay-unclosed')) return;

    // 如果关闭的是当前标签，则更换当前标签下标
    if (thisHeader.hasClass(component.CONST.CLASS_THIS)) {
      if (thisHeader.next()[0]) {
        that.change(thisHeader.next());
      } else if(thisHeader.prev()[0]) {
        that.change(thisHeader.prev());
      }
    }

    // 移除元素
    thisHeader.remove();
    that.findBodyItem(index).remove();

    that.roll('auto', index);

    // 回调
    var params = that.data();
    typeof options.close === 'function' && options.close(params);
    layui.event.call(params.thisHeader[0], component.CONST.MOD_NAME, 'close('+ options.id +')', params); // 事件
  };

  // 批量关闭标签
  Class.prototype.closeMore = function(type, index) {
    var that = this;
    var options = that.config;
    var elemItem = that.elemItem();
    var data = that.data();
    var headers = elemItem.header.items;
    var bodys = elemItem.body.items;
    var FILTER = ':not([lay-unclosed])';

    index = index === undefined ? data.index : index;

    // 遍历
    headers.each(function(i){
      var othis = $(this);
      var unclosed = othis.attr('lay-unclosed');

      // 标注不可关闭项
      if (unclosed) {
        bodys.eq(i).attr('lay-unclosed', unclosed);
      }
    });

    // 移交当前标签项
    if (!data.thisHeader.attr('lay-unclosed')) {
      if(type === 'all' || !type){
        var nextHeader = headers.filter(':gt('+ data.index +')[lay-unclosed]').eq(0);
        var prevHeader = $(headers.filter(':lt('+ data.index +')[lay-unclosed]').get().reverse()).eq(0);
        if (nextHeader[0]) {
          that.change(nextHeader);
        } else if(prevHeader[0]) {
          that.change(prevHeader);
        }
      } else if(index !== data.index) {
        that.change(that.findHeaderItem(index));
      }
    }

    // 执行批量关闭标签
    if (type === 'other') { // 关闭其他标签
      headers.eq(index).siblings(FILTER).remove();
      bodys.eq(index).siblings(FILTER).remove();
    } else if(type === 'right') { // 关闭右侧标签
      headers.filter(':gt('+ index +')'+ FILTER).remove();
      bodys.filter(':gt('+ index +')'+ FILTER).remove();
    } else { // 关闭所有标签
      headers.filter(FILTER).remove();
      bodys.filter(FILTER).remove();
    }

    // 回调
    var params = that.data();
    typeof options.close === 'function' && options.close(params);
    layui.event.call(params.thisHeader[0], component.CONST.MOD_NAME, 'close('+ options.id +')', params); // 事件
  };

  // 切换标签
  Class.prototype.change = function(thisHeader) {
    if (!thisHeader || !thisHeader[0]) return;

    var that = this;
    var options = that.config;
    var index = thisHeader.index();
    var thatA = thisHeader.find('a');
    var isLink = typeof thatA.attr('href') === 'string' && thatA.attr('target') === '_blank'; // 是否存在跳转链接
    var unselect = typeof thisHeader.attr('lay-unselect') === 'string'; // 是否禁用选中

    // 执行切换
    if (!(isLink || unselect)) {
      // 头部
      thisHeader.addClass(component.CONST.CLASS_THIS).siblings()
      .removeClass(component.CONST.CLASS_THIS);
      // 内容
      that.findBodyItem(index).addClass(component.CONST.CLASS_SHOW)
      .siblings().removeClass(component.CONST.CLASS_SHOW);
    }

    that.roll('auto', index);

    // 回调
    var params = that.data();
    typeof options.change === 'function' && options.change(params);
    layui.event.call(thisHeader[0], component.CONST.MOD_NAME, 'change('+ options.id +')', params); // 事件
  };

  // 渲染标签头部项
  Class.prototype.renderHeaderItem = function(obj){
    var that = this;
    var options = that.config;
    var elemItem = $(obj.headerItem || options.headerItem || '<li></li>');

    elemItem.html(obj.title || 'New Tab');

    // 追加属性
    layui.each(obj, function(key, value){
      if(/^(title|content|mode|done)$/.test(key)) return;
      elemItem.attr('lay-'+ key, value);
    });

    // 追加标签关闭元素
    that.appendClose(elemItem, obj);

    return elemItem;
  };

  // 渲染标签内容项
  Class.prototype.renderBodyItem = function(obj) {
    var that = this
    var options = that.config
    var elemItem = $(obj.bodyItem || options.bodyItem || '<div class="'+ component.CONST.ITEM +'"></div>');

    elemItem.html(obj.content || '');
    return elemItem;
  };

  // 给某一个标签项追加可关闭元素
  Class.prototype.appendClose = function(othis, obj) {
    var that = this
    var options = that.config;

    if(!options.closable) return;

    obj = obj || {};
    if (obj.unclosed || othis.attr('lay-unclosed')) return; // 不可关闭项

    if (!othis.find('.'+ component.CONST.CLOSE)[0]) {
      var close = $('<i class="layui-icon layui-icon-close layui-unselect '+ component.CONST.CLOSE +'"></i>');
      close.on('click', function(){
        that.close($(this).parent());
        return false;
      });
      othis.append(close);
    }
  };

  // 渲染标签可关闭元素
  Class.prototype.renderClose = function(othis) {
    var that = this;
    var options = that.config;
    var elemItem = that.elemItem();
    var hasDel = that.cache('close');

    // 是否开启关闭
    if (options.closable) {
      if (!hasDel) {
        elemItem.header.items.each(function(){
          that.appendClose($(this));
        });
        that.cache('close', true);
      }
    } else if(hasDel) {
      elemItem.header.items.each(function() {
        $(this).find('.'+ component.CONST.CLOSE).remove();
      });
    }
  };

  // 滚动标签
  Class.prototype.roll = function(type, index) {
    var that = this;
    var options = that.config;
    var elemItem = that.elemItem();
    var headerElem = elemItem.header.elem;
    var headerItems = elemItem.header.items;
    var scrollWidth = headerElem.prop('scrollWidth'); // 实际总长度
    var outerWidth = Math.ceil(headerElem.outerWidth()); // 可视区域的长度
    var tabsLeft = headerElem.data('left') || 0;
    var scrollMode = options.headerMode === 'scroll'; // 标签头部是否始终保持滚动模式

    // 让选中标签始终保持在可视区域
    var rollToVisibleArea = function() {
      index = isNaN(index) ? that.data().index : index;

      var thisItemElem = headerItems.eq(index);
      if (!thisItemElem[0]) return;

      // 当前标签的相对水平坐标值
      var thisLeft = Math.ceil(thisItemElem.position().left);
      var padding = 1; // 让边界额外保持一定间距

      // 当选中标签溢出在可视区域「左侧」时
      var countWidth = thisLeft - (thisItemElem.prev().outerWidth() || 0);  // 始终空出上一个标签
      if (countWidth > 0) countWidth = countWidth - padding;

      // 左侧临界值
      if (tabsLeft + countWidth < 0) {
        tabsLeft = countWidth >= 0 ? countWidth : 0; // 标签的复原位移不能超出 0
        return headerElem.css('left', -tabsLeft).data('left', -tabsLeft);;
      }

      // 当选中标签溢出在可视区域「右侧」时，
      var countWidth = thisLeft + thisItemElem.outerWidth()
      + (thisItemElem.next().outerWidth() || 0) + padding; // 始终空出下一个标签

      // 右侧临界值
      if (tabsLeft + countWidth - outerWidth > 0) {
        tabsLeft = countWidth - outerWidth;
        headerElem.css('left', -tabsLeft).data('left', -tabsLeft);
      }
    };

    // css 类名
    var CLASS_SCROLL = 'layui-tabs-scroll';
    var CLASS_BAR = 'layui-tabs-bar';
    var CLASS_BAR_ICON = ['layui-icon-prev', 'layui-icon-next'];

    // 滚动结构
    var rollElem = {
      elem: $('<div class="'+ CLASS_SCROLL +' layui-unselect"></div>'),
      bar: $([
        '<div class="'+ CLASS_BAR +'">',
          '<i class="layui-icon '+ CLASS_BAR_ICON[0] +'" lay-mode="prev"></i>',
          '<i class="layui-icon '+ CLASS_BAR_ICON[1] +'" lay-mode="next"></i>',
        '</div>'
      ].join(''))
    };

    // 不渲染头部滚动结构
    if (options.headerMode === 'normal') return;

    // 是否渲染滚动结构
    var elemScroll = headerElem.parent('.'+ CLASS_SCROLL);
    if (scrollMode || (!scrollMode && scrollWidth > outerWidth)) {
      if (!elemScroll[0]) {
        if (options.elem.hasClass(component.CONST.CARD)) {
          rollElem.elem.addClass(component.CONST.CARD);
        }
        headerElem.wrap(rollElem.elem);
        headerElem.after(rollElem.bar);

        // 点击左右箭头
        rollElem.bar.children().on('click', function(){
          var othis = $(this);
          var mode = othis.attr('lay-mode');
          if ($(this).hasClass(component.CONST.CLASS_DISABLED)) return;
          mode && that.roll(mode);
        });
      }
    } else if(!scrollMode) {
      if (elemScroll[0]) {
        elemScroll.find('.'+ CLASS_BAR).remove();
        headerElem.unwrap().css('left', 0).data('left', 0);
      } else {
        return;
      }
    }

    if (type === 'init') return;

    // 重新获取
    scrollWidth = headerElem.prop('scrollWidth') // 实际总长度
    outerWidth = headerElem.outerWidth() // 可视区域的长度
    elemScroll = headerElem.parent('.'+ CLASS_SCROLL);

    // 左箭头（往右滚动）
    if (type === 'prev') {
      // 当前的 left 减去可视宽度，用于与上一轮的页签比较
      var  prevLeft = -tabsLeft - outerWidth;
      if(prevLeft < 0) prevLeft = 0;
      headerItems.each(function(i, item){
        var li = $(item);
        var left = Math.ceil(li.position().left);

        if (left >= prevLeft) {
          headerElem.css('left', -left).data('left', -left);
          return false;
        }
      });
    } else if(type === 'auto') { // 自动识别滚动
      rollToVisibleArea();
    } else { // 右箭头（往左滚动）
      headerItems.each(function(i, item){
        var li = $(item);
        var left = Math.ceil(li.position().left);

        if (left + li.outerWidth() >= outerWidth - tabsLeft) {
          headerElem.css('left', -left).data('left', -left);
          return false;
        }
      });
    }

    // 同步箭头状态
    tabsLeft = headerElem.data('left') || 0;

     // 左
    elemScroll.find('.'+ CLASS_BAR_ICON[0])[
      tabsLeft < 0 ? 'removeClass' : 'addClass'
    ](component.CONST.CLASS_DISABLED);
     // 右
    elemScroll.find('.'+ CLASS_BAR_ICON[1])[
      parseFloat(tabsLeft + scrollWidth) - outerWidth > 0
        ? 'removeClass'
      : 'addClass'
    ](component.CONST.CLASS_DISABLED);
  };

  // 根据 id 或 index 获取相关标签头部项
  Class.prototype.findHeaderItem = function(index) {
    if(!(
      typeof index === 'number'
      || (typeof index === 'string' && index)
    )) return;
    var headerItems = this.elemItem().header.items;
    var item = headerItems.filter('[lay-id="'+ index +'"]');
    return item[0] ? item : headerItems.eq(index);
  };

  // 根据 index 获取相关标签内容项
  Class.prototype.findBodyItem = function(index) {
    return this.elemItem().body.items.eq(index);
  };

  // 返回给回调的公共信息
  Class.prototype.data = function() {
    var that = this;
    var options = that.config;
    var elemItem = that.elemItem();
    var thisHeader = elemItem.header.items.filter('.'+ component.CONST.CLASS_THIS);
    var index = thisHeader.index();

    return {
      options: options, // 标签配置信息
      elemItem: elemItem,
      thisHeader: thisHeader, // 当前标签头部项
      thisBody: that.findBodyItem(index), // 当前标签内容项
      index: index, // 当前标签下标
      length: elemItem.header.items.length // 当前标签数
    }
  };

  // 扩展组件接口
  $.extend(component, {
    /**
     * 增加标签
     * @param {string} id - 标签 ID
     * @param {object} obj - 标签配置信息
     * @returns
     */
    add: function(id, obj) {
      var that = component.getThis(id);
      if(!that) return this;
      that.add(obj);
    },

    /**
     * 关闭标签
     * @param {string} id - 标签 ID
     * @param {number} index - 标签下标
     * @returns
     */
    close: function(id, index) {
      var that = component.getThis(id);
      if(!that) return this;
      if(index === undefined) index = that.data().index; // index 若不传，则表示关闭当前标签
      that.close(that.findHeaderItem(index));
    },

    /**
     * 关闭多个标签
     * @param {string} id - 标签 ID
     * @param {string} type - 关闭类型，可选值：left、right、other、all
     * @param {number} index - 标签下标。若传入，则按 index 所在标签为事件执行关闭操作
     * @returns
     */
    closeMore: function(id, type, index) {
      var that = component.getThis(id);
      if(!that) return this;
      that.closeMore(type, index);
    },

    /**
     * 切换标签
     * @param {string} id - 标签 ID
     * @param {number} index - 标签下标
     * @returns
     */
    change: function(id, index) {
      var that = component.getThis(id);
      if(!that) return this;
      that.change(that.findHeaderItem(index));
    },

    /**
     * 获取标签信息
     * @param {string} id - 标签 ID
     * @returns
     */
    data: function(id) {
      var that = component.getThis(id);
      return that ? that.data() : {};
    },

    /**
     * 获取标签指定头部项
     * @param {string} id - 标签 ID
     * @param {number} index - 标签下标
     * @returns
     */
    headerItem: function(id, index) {
      var that = component.getThis(id);
      return that ? that.findHeaderItem(index) : this;
    },

    /**
     * 获取标签指定内容项
     * @param {string} id - 标签 ID
     * @param {number} index - 标签下标
     * @returns
     */
    bodyItem: function(id, index) {
      var that = component.getThis(id);
      return that ? that.findBodyItem(index) : this;
    },

    /**
     * 调整视图结构
     * @param {string} id - 标签 ID
     * @returns
     */
    setView: function(id) {
      var that = component.getThis(id);
      if (!that) return this;
      that.roll('auto');
    }
  });

  // 初始化渲染
  $(function() {
    component.render();
  });

  exports(component.CONST.MOD_NAME, component);
});
