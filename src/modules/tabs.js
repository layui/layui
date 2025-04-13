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
      trigger: 'click', // 标签切换的触发事件
      headerMode: 'auto' // 标签头部的显示模式 auto | scroll | normal
    },

    CONST: {
      ELEM: 'layui-tabs',
      HEADER: 'layui-tabs-header',
      CLOSE: 'layui-tabs-close',
      BODY: 'layui-tabs-body',
      ITEM: 'layui-tabs-item',
      CARD: 'layui-tabs-card'
    },

    // 渲染
    render: function() {
      var that = this;
      var options = that.config;

      // 标签页元素项
      that.headerElem = ['.'+ component.CONST.HEADER + ':eq(0)', '>li'];
      that.bodyElem = ['.'+ component.CONST.BODY + ':eq(0)', '>.'+ component.CONST.ITEM];

      // 获取标签容器中的 header body 相关元素
      that.getContainer = function() {
        var elem = that.documentElem || options.elem;
        return {
          header: {
            elem: elem.find(that.headerElem[0]),
            items: elem.find(that.headerElem.join(''))
          },
          body: {
            elem: elem.find(that.bodyElem[0]),
            items: elem.find(that.bodyElem.join(''))
          }
        };
      };

      // 若 header 选项类型为数组
      if (layui.type(options.header) === 'array') {
        if (options.header.length === 0) return;

        // 给任意元素绑定 tabs 切换功能
        if (typeof options.header[0] === 'string') {
          that.headerElem = options.header.concat();
          that.documentElem = $(document);
        } else { // 方法传值渲染
          that.elemView = $('<div class="layui-tabs"></div>');
          if (options.className) that.elemView.addClass(options.className);

          var headerElem = $('<ul class="layui-tabs-header"></ul>');
          var bodyElem = $('<div class="layui-tabs-body"></div>');

          // 生成标签项
          layui.each(options.header, function(i, item){
            var elemHeaderItem = that.renderHeaderItem(item);
            headerElem.append(elemHeaderItem);
          });
          layui.each(options.body, function(i, item){
            var elemBodyItem = that.renderBodyItem(item);
            bodyElem.append(elemBodyItem);
          });

          that.elemView.append(headerElem).append(bodyElem);
          options.elem.html(that.elemView);
        }
      } else {
        that.renderClose(); // 初始化标签关闭结构
      }

      // 若 body 选项类型为数组
      if (layui.type(options.body) === 'array') {
        if (typeof options.body[0] === 'string') {
          that.documentElem = $(document);
          that.bodyElem = options.body.concat();
        }
      }

      // 初始选中项
      var data = that.data();
      if ('index' in options && data.index != options.index) {
        that.change(that.findHeaderItem(options.index), true);
      } else if (data.index === -1) { // 初始选中项为空时，默认选中第一个
        that.change(that.findHeaderItem(0), true);
      }

      // 初始化滚动结构
      that.roll('auto');

      // 清除隐藏占位
      if (options.elem.hasClass(component.CONST.CLASS_HIDEV)) {
        options.elem.removeClass(component.CONST.CLASS_HIDEV);
      }

      // 回调
      typeof options.afterRender === 'function' && options.afterRender(data);

      // 渲染成功后的事件
      layui.event.call(
        options.elem[0],
        component.CONST.MOD_NAME,
        'afterRender('+ options.id +')',
        data
      );
    },

    // 事件
    events: function() {
      var that = this;
      var options = that.config;
      var container = that.getContainer();
      var MOD_NAME = component.CONST.MOD_NAME;
      var TRIGGER_NAMESPACE = '.lay_'+ MOD_NAME + '_trigger';
      var delegatedElement = that.documentElem ? container.header.elem : options.elem;

      // 标签头部事件
      var trigger = options.trigger + TRIGGER_NAMESPACE;
      var elemHeaderItem = that.documentElem ? that.headerElem[1] : that.headerElem.join('');
      delegatedElement.off(trigger).on(trigger, elemHeaderItem, function() {
        that.change($(this));
      });

      // 窗口 resize 事件
      if (!inner.onresize) {
        var timer;
        $(window).on('resize', function() {
          clearTimeout(timer);
          timer = setTimeout(function(){
            layui.each(component.cache.id, function(key) {
              var that = component.getInst(key);
              if(!that) return;
              that.roll('init');
            });
          }, 50);
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
   * @param {Object} opts
   * @param {string} opts.title - 标签标题
   * @param {string} opts.content - 标签内容
   * @param {string} opts.id - 标签的 lay-id 属性值
   * @param {string} [opts.index] - 活动标签索引，默认取当前选中标签的索引
   * @param {('append'|'prepend'|'after'|'before')} [opts.mode='append'] - 标签插入方式
   * @param {boolean} [opts.active] - 是否将新增项设置为活动标签
   * @param {boolean} [opts.closable] - 标签是否可关闭。初始值取决于 options.closable
   * @param {string} [opts.headerItem] - 自定义标签头部元素
   * @param {string} [opts.bodyItem] - 自定义标签内容元素
   * @param {Function} [opts.done] - 标签添加成功后执行的回调函数
   */
  Class.prototype.add = function(opts) {
    var that = this;
    var options = that.config;
    var container = that.getContainer();
    var newHeaderItem = that.renderHeaderItem(opts);
    var newBodyItem = that.renderBodyItem(opts);

    // 选项默认值
    opts = $.extend({
      active: true
    }, opts);

    // 插入方式
    if (/(before|after)/.test(opts.mode)) { // 在活动标签前后插入
      var data = that.data();
      var hasOwnIndex = opts.hasOwnProperty('index');
      var headerItem = hasOwnIndex ? that.findHeaderItem(opts.index) : data.thisHeaderItem;
      var bodyItem = hasOwnIndex ? that.findBodyItem(opts.index) : data.thisHeaderItem;
      headerItem[opts.mode](newHeaderItem);
      bodyItem[opts.mode](newBodyItem);
    } else { // 在标签最前后插入
      var mode = ({
        prepend: 'prepend', // 插入标签到最前
        append: 'append' // 插入标签到最后
      })[opts.mode || 'append'] || 'append';
      container.header.elem[mode](newHeaderItem);
      container.body.elem[mode](newBodyItem);
    }

    // 是否将新增项设置为活动标签
    if (opts.active) {
      that.change(newHeaderItem, true);
    } else {
      that.roll('auto');
    }

    // 回调
    var params = that.data();
    typeof opts.done === 'function' && opts.done(params);
  };

  /**
   * 关闭指定标签
   * @param {Object} thisHeaderItem - 当前标签头部项元素
   * @param {boolean} force - 是否强制删除
   */
  Class.prototype.close = function(thisHeaderItem, force) {
    if(!thisHeaderItem || !thisHeaderItem[0]) return;

    var that = this;
    var options = that.config;
    var index = thisHeaderItem.index();

    if (!thisHeaderItem[0]) return;

    // 标签是否不可关闭
    if (thisHeaderItem.attr('lay-closable') === 'false') {
      return;
    }

     // 当前标签相关数据
     var params = that.data();

    // 标签关闭前的事件。若非强制关闭，可则根据事件的返回结果决定是否关闭
    if (!force) {
      var closable = layui.event.call(
        thisHeaderItem[0],
        component.CONST.MOD_NAME,
        'beforeClose('+ options.id +')',
        $.extend(params, {
          index: thisHeaderItem.index()
        })
      );

      // 是否阻止关闭
      if (closable === false) {
        return;
      }
    }

    // 如果关闭的是当前标签，则更换当前标签索引
    if (thisHeaderItem.hasClass(component.CONST.CLASS_THIS)) {
      if (thisHeaderItem.next()[0]) {
        that.change(thisHeaderItem.next(), true);
      } else if(thisHeaderItem.prev()[0]) {
        that.change(thisHeaderItem.prev(), true);
      }
    }

    // 移除元素
    thisHeaderItem.remove();
    that.findBodyItem(index).remove();

    that.roll('auto', index);

    // 获取当前标签相关数据
    var params = that.data();

    // 标签关闭后的事件
    layui.event.call(
      params.thisHeaderItem[0],
      component.CONST.MOD_NAME,
      'afterClose('+ options.id +')',
      params
    );
  };

  /**
   * 批量关闭标签
   * @see tabs.close
   */
  Class.prototype.closeMult = function(mode, index) {
    var that = this;
    var options = that.config;
    var container = that.getContainer();
    var data = that.data();
    var headers = container.header.items;
    var bodys = container.body.items;
    var DISABLED_CLOSE_SELECTOR = '[lay-closable="false"]'; // 不可关闭标签选择器
    var FILTER = ':not('+ DISABLED_CLOSE_SELECTOR +')'; // 不可关闭标签过滤器

    index = index === undefined ? data.index : index;

    // 将标签头 lay-closable 属性值同步到 body 项
    headers.each(function(i) {
      var othis = $(this);
      var closableAttr = othis.attr('lay-closable');
      if (closableAttr) {
        bodys.eq(i).attr('lay-closable', closableAttr);
      }
    });

    // 若当前选中标签也允许关闭，则尝试寻找不可关闭的标签并将其选中
    if (data.thisHeaderItem.attr('lay-closable') !== 'false') {
      if(mode === 'all' || !mode){
        var nextHeader = headers.filter(':gt('+ data.index +')'+ DISABLED_CLOSE_SELECTOR).eq(0);
        var prevHeader = $(headers.filter(':lt('+ data.index +')'+ DISABLED_CLOSE_SELECTOR).get().reverse()).eq(0);
        if (nextHeader[0]) {
          that.change(nextHeader, true);
        } else if(prevHeader[0]) {
          that.change(prevHeader, true);
        }
      } else if(index !== data.index) { // 自动切换到活动标签（功能可取消）
        that.change(that.findHeaderItem(index), true);
      }
    }

    // 执行批量关闭标签
    if (mode === 'other') { // 关闭其他标签
      headers.eq(index).siblings(FILTER).remove();
      bodys.eq(index).siblings(FILTER).remove();
    } else if(mode === 'right') { // 关闭右侧标签
      headers.filter(':gt('+ index +')'+ FILTER).remove();
      bodys.filter(':gt('+ index +')'+ FILTER).remove();
    } else { // 关闭所有标签
      headers.filter(FILTER).remove();
      bodys.filter(FILTER).remove();
    }

    that.roll('auto');

    // 回调
    var params = that.data();

    // 标签关闭后的事件
    layui.event.call(
      params.thisHeaderItem[0],
      component.CONST.MOD_NAME,
      'afterClose('+ options.id +')',
      params
    );
  };

  /**
   * 切换标签
   * @param {Object} thisHeaderItem - 当前标签头部项元素
   * @param {boolean} [force=false] - 是否强制切换
   * @returns
   */
  Class.prototype.change = function(thisHeaderItem, force) {
    if (!thisHeaderItem || !thisHeaderItem[0]) return;

    var that = this;
    var options = that.config;
    var index = thisHeaderItem.index();
    var thatA = thisHeaderItem.find('a');
    // 是否存在跳转链接
    var isLink = typeof thatA.attr('href') === 'string' && thatA.attr('target') === '_blank';
    // 是否不允许选中
    var unselect = typeof thisHeaderItem.attr('lay-unselect') === 'string';

    // 不满足切换的条件
    if (isLink || unselect) {
      return;
    }

    // 当前标签相关数据
    var params = that.data();

    // 标签关闭前的事件。若非强制关闭，可则根据事件的返回结果决定是否关闭
    if (!force) {
      var enable = layui.event.call(
        thisHeaderItem[0],
        component.CONST.MOD_NAME,
        'beforeChange('+ options.id +')',
        $.extend(params, {
          from: {
            index: params.index,
            headerItem: params.thisHeaderItem
          },
          to: {
            index: thisHeaderItem.index(),
            headerItem: thisHeaderItem
          }
        })
      );

      // 是否阻止切换
      if (enable === false) {
        return;
      }
    }

    // 执行标签头部切换
    thisHeaderItem.addClass(component.CONST.CLASS_THIS).siblings()
    .removeClass(component.CONST.CLASS_THIS);

    // 执行标签内容切换
    that.findBodyItem(index).addClass(component.CONST.CLASS_SHOW)
    .siblings().removeClass(component.CONST.CLASS_SHOW);

    that.roll('auto', index);

    // 重新获取标签相关数据
    var params = that.data();

    // 标签切换后的事件
    layui.event.call(
      params.thisHeaderItem[0],
      component.CONST.MOD_NAME,
      'afterChange('+ options.id +')',
      params
    );
  };

  /**
   * 渲染标签头部项
   * @param {Object} opts - 标签项配置信息
   */
  Class.prototype.renderHeaderItem = function(opts) {
    var that = this;
    var options = that.config;
    var headerItem = $(opts.headerItem || options.headerItem || '<li></li>');

    headerItem.html(opts.title || 'New Tab');

    // 追加属性
    layui.each(opts, function(key, value){
      if(/^(title|content|mode|done)$/.test(key)) return;
      headerItem.attr('lay-'+ key, value);
    });

    // 追加标签关闭元素
    that.appendClose(headerItem, opts);

    return headerItem;
  };

  /**
   * 渲染标签内容项
   * @param {Object} opts - 标签项配置信息
   */
  Class.prototype.renderBodyItem = function(opts) {
    var that = this
    var options = that.config
    var bodyItem = $(opts.bodyItem || options.bodyItem || '<div class="'+ component.CONST.ITEM +'"></div>');

    bodyItem.html(opts.content || '');
    return bodyItem;
  };

  /**
   * 给某一个标签项追加可关闭元素
   * @param {Object} headerItem - 标签项元素
   * @param {Object} opts - 标签项配置信息
   */
  Class.prototype.appendClose = function(headerItem, opts) {
    var that = this
    var options = that.config;

    if (!options.closable) return;

    opts = opts || {};

    // 不可关闭项
    if (opts.closable === 'false' || headerItem.attr('lay-closable') === 'false') {
      return;
    }

    // 可关闭项追加关闭按钮
    if (!headerItem.find('.'+ component.CONST.CLOSE)[0]) {
      var close = $('<i class="layui-icon layui-icon-close layui-unselect '+ component.CONST.CLOSE +'"></i>');
      close.on('click', function(){
        that.close($(this).parent());
        return false;
      });
      headerItem.append(close);
    }
  };

  // 渲染标签可关闭元素
  Class.prototype.renderClose = function() {
    var that = this;
    var options = that.config;
    var container = that.getContainer();

    // 是否开启关闭
    if (options.closable) {
      container.header.items.each(function() {
        that.appendClose($(this));
      });
    } else  {
      container.header.items.each(function() {
        $(this).find('.'+ component.CONST.CLOSE).remove();
      });
    }
  };

  /**
   * 标签头滚动
   * @param {('auto'|'prev'|'next'|'init')} [mode='next'] - 滚动方式
   * @param {number} index - 标签索引。默认取当前选中标签的索引值
   * @returns
   */
  Class.prototype.roll = function(mode, index) {
    var that = this;
    var options = that.config;
    var container = that.getContainer();
    var headerElem = container.header.elem;
    var headerItems = container.header.items;
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
        return headerElem.css('left', -tabsLeft).data('left', -tabsLeft);
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
      elem: $('<div class="'+ CLASS_SCROLL +' layui-border-box layui-unselect"></div>'),
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

    // 初始化滚动模式
    if (mode === 'init') return;

    // 重新获取
    scrollWidth = headerElem.prop('scrollWidth') // 实际总长度
    outerWidth = headerElem.outerWidth() // 可视区域的长度
    elemScroll = headerElem.parent('.'+ CLASS_SCROLL);

    // 左箭头（往右滚动）
    if (mode === 'prev') {
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
    } else if(mode === 'auto') { // 自动识别滚动
      rollToVisibleArea();
    } else { // 右箭头（往左滚动） 默认 next
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

  /**
   * 根据 id 或 index 获取相关标签头部项
   * @param {number|string} index - 标签索引或 id
   */
  Class.prototype.findHeaderItem = function(index) {
    if(!(
      typeof index === 'number'
      || (typeof index === 'string' && index)
    )) return;
    var headerItems = this.getContainer().header.items;
    var item = headerItems.filter('[lay-id="'+ index +'"]');
    return item[0] ? item : headerItems.eq(index);
  };

  /**
   * 根据 index 获取相关标签内容项
   * @param {number} index - 标签索引
   */
  Class.prototype.findBodyItem = function(index) {
    return this.getContainer().body.items.eq(index);
  };

  /**
   * 返回给回调的公共信息
   * @returns
   */
  Class.prototype.data = function() {
    var that = this;
    var options = that.config;
    var container = that.getContainer();
    var thisHeaderItem = container.header.items.filter('.'+ component.CONST.CLASS_THIS);
    var index = thisHeaderItem.index();

    return {
      options: options, // 标签配置信息
      container: container, // 标签容器的相关元素
      thisHeaderItem: thisHeaderItem, // 当前标签头部项
      thisBodyItem: that.findBodyItem(index), // 当前标签内容项
      index: index, // 当前标签索引
      length: container.header.items.length // 当前标签数
    }
  };

  // 扩展组件接口
  $.extend(component, {
    /**
     * 添加标签
     * @param {string} id - 渲染时的实例 ID
     * @param {Object} opts - 添加标签的配置项，详见 Class.prototype.add
     */
    add: function(id, opts) {
      var that = component.getInst(id);
      if(!that) return;
      that.add(opts);
    },

    /**
     * 关闭标签
     * @param {string} id - 渲染时的实例 ID
     * @param {number} index - 标签索引
     * @param {boolean} [force=false] - 是否强制关闭
     */
    close: function(id, index, force) {
      var that = component.getInst(id);
      if(!that) return;
      if(index === undefined) index = that.data().index; // index 若不传，则表示关闭当前标签
      that.close(that.findHeaderItem(index), force);
    },

    /**
     * 关闭多个标签
     * @param {string} id - 渲染时的实例 ID
     * @param {('other'|'right'|'all')} [mode="all"] - 关闭方式
     * @param {number} index - 活动标签的索引，默认取当前选中标签的索引。一般用于标签右键事件
     */
    closeMult: function(id, mode, index, force) {
      var that = component.getInst(id);
      if(!that) return;
      that.closeMult(mode, index, force);
    },

    /**
     * 切换标签
     * @param {string} id - 渲染时的实例 ID
     * @param {number} index - 标签索引
     */
    change: function(id, index, force) {
      var that = component.getInst(id);
      if(!that) return;
      that.change(that.findHeaderItem(index), force);
    },

    /**
     * 获取标签信息
     * @param {string} id - 渲染时的实例 ID
     */
    data: function(id) {
      var that = component.getInst(id);
      return that ? that.data() : {};
    },

    /**
     * 获取标签指定头部项
     * @param {string} id - 渲染时的实例 ID
     * @param {number} index - 标签索引
     * @returns
     */
    getHeaderItem: function(id, index) {
      var that = component.getInst(id);
      if(!that) return;
      return that.findHeaderItem(index);
    },

    /**
     * 获取标签指定内容项
     * @param {string} id - 渲染时的实例 ID
     * @param {number} index - 标签索引
     * @returns
     */
    getBodyItem: function(id, index) {
      var that = component.getInst(id);
      if(!that) return;
      return that.findBodyItem(index);
    },

    /**
     * 刷新标签视图结构
     * @param {string} id - 渲染时的实例 ID
     */
    refresh: function(id) {
      var that = component.getInst(id);
      if (!that) return;
      that.roll('auto');
    }
  });

  // 初始化渲染
  $(function() {
    component.render();
  });

  exports(component.CONST.MOD_NAME, component);
});
