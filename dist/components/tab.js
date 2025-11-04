import { layui } from '../core/layui.js';
import $ from 'jquery';
import { component as component$1 } from '../core/component.js';

/**
 * tab
 * 选项卡组件（已被 tabs 平替，仅为兼容保留）
 */

var SUPER_MOD_NAME = 'element'; // 所属的超级模块名，确保向下兼容

// 创建组件
var component = component$1({
  name: 'tab',
  // 组件名

  // 默认配置
  config: {
    elem: '.layui-tab'
  },
  CONST: {
    ELEM: 'layui-tab',
    HEADER: 'layui-tab-title',
    CLOSE: 'layui-tab-close',
    MORE: 'layui-tab-more',
    BAR: 'layui-tab-bar'
  },
  // 渲染
  render: function () {
    var that = this;
    var options = that.config;
    events.tabAuto(null, options.elem);
  }
});
var CONST = component.CONST;
var $win = $(window);
var $doc = $(document);

// 基础事件
var events = {
  // Tab 点击
  tabClick: function (obj) {
    obj = obj || {};
    var options = obj.options || {};
    var othis = obj.liElem || $(this);
    var parents = options.headerElem ? othis.parent() : othis.parents('.layui-tab').eq(0);
    var item = options.bodyElem ? $(options.bodyElem) : parents.children('.layui-tab-content').children('.layui-tab-item');
    var elemA = othis.find('a');
    var isJump = elemA.attr('href') !== 'javascript:;' && elemA.attr('target') === '_blank'; // 是否存在跳转
    var unselect = typeof othis.attr('lay-unselect') === 'string'; // 是否禁用选中
    var filter = parents.attr('lay-filter');
    var hasId = othis.attr('lay-id');

    // 下标
    var index = 'index' in obj ? obj.index : othis.parent().children('li').index(othis);

    // 若非强制切换，则根据 tabBeforeChange 事件的返回结果决定是否切换
    if (!obj.force) {
      var liThis = othis.siblings('.' + CONST.CLASS_THIS);
      var shouldChange = layui.event.call(this, SUPER_MOD_NAME, 'tabBeforeChange(' + filter + ')', {
        elem: parents,
        from: {
          index: othis.parent().children('li').index(liThis),
          id: liThis.attr('lay-id')
        },
        to: {
          index: index,
          id: hasId
        }
      });
      if (shouldChange === false) return;
    }

    // 执行切换
    if (!(isJump || unselect)) {
      othis.addClass(CONST.CLASS_THIS).siblings().removeClass(CONST.CLASS_THIS);
      if (hasId) {
        var contentElem = item.filter('[lay-id="' + hasId + '"]');
        contentElem = contentElem.length ? contentElem : item.eq(index);
        contentElem.addClass(CONST.CLASS_SHOW).siblings().removeClass(CONST.CLASS_SHOW);
      } else {
        item.eq(index).addClass(CONST.CLASS_SHOW).siblings().removeClass(CONST.CLASS_SHOW);
      }
    }
    layui.event.call(this, SUPER_MOD_NAME, 'tab(' + filter + ')', {
      elem: parents,
      index: index,
      id: hasId
    });
  },
  // Tab 删除
  tabDelete: function (obj) {
    obj = obj || {};
    var li = obj.liElem || $(this).parent();
    var index = li.parent().children('li').index(li);
    var tabElem = li.closest('.layui-tab');
    var item = tabElem.children('.layui-tab-content').children('.layui-tab-item');
    var filter = tabElem.attr('lay-filter');
    var hasId = li.attr('lay-id');

    // 若非强制删除，则根据 tabBeforeDelete 事件的返回结果决定是否删除
    if (!obj.force) {
      var shouldClose = layui.event.call(li[0], SUPER_MOD_NAME, 'tabBeforeDelete(' + filter + ')', {
        elem: tabElem,
        index: index,
        id: hasId
      });
      if (shouldClose === false) return;
    }
    if (li.hasClass(CONST.CLASS_THIS)) {
      if (li.next()[0] && li.next().is('li')) {
        events.tabClick.call(li.next()[0], {
          index: index + 1
        });
      } else if (li.prev()[0] && li.prev().is('li')) {
        events.tabClick.call(li.prev()[0], null, index - 1);
      }
    }
    li.remove();
    if (hasId) {
      var contentElem = item.filter('[lay-id="' + hasId + '"]');
      contentElem = contentElem.length ? contentElem : item.eq(index);
      contentElem.remove();
    } else {
      item.eq(index).remove();
    }
    setTimeout(function () {
      events.tabAuto(null, tabElem);
    }, 50);
    layui.event.call(this, SUPER_MOD_NAME, 'tabDelete(' + filter + ')', {
      elem: tabElem,
      index: index,
      id: hasId
    });
  },
  // Tab 自适应
  tabAuto: function (spread, elem) {
    var targetElem = elem || $('.layui-tab');
    targetElem.each(function () {
      var othis = $(this);
      var title = othis.children('.' + CONST.HEADER);
      var STOPE = 'lay-stope="tabmore"';
      var span = $('<span class="layui-unselect ' + CONST.BAR + '" ' + STOPE + '><i ' + STOPE + ' class="layui-icon">&#xe61a;</i></span>');

      // 开启关闭图标
      var allowclose = othis.attr('lay-allowclose');
      if (allowclose && allowclose !== 'false') {
        title.find('li').each(function () {
          var li = $(this);
          if (!li.find('.' + CONST.CLOSE)[0] && li.attr('lay-allowclose') !== 'false') {
            var close = $('<i class="layui-icon layui-icon-close layui-unselect ' + CONST.CLOSE + '"></i>');
            close.on('click', function (e) {
              events.tabDelete.call(this, {
                e: e
              });
            });
            li.append(close);
          }
        });
      }
      if (typeof othis.attr('lay-unauto') === 'string') return;

      // 响应式
      if (title.prop('scrollWidth') > title.outerWidth() + 1 || title.find('li').length && title.height() > function (height) {
        return height + height / 2;
      }(title.find('li').eq(0).height())) {
        // 若执行是来自于切换，则自动展开
        if (spread === 'change' && title.data('LAY_TAB_CHANGE')) {
          title.addClass(CONST.MORE);
        }
        if (title.find('.' + CONST.BAR)[0]) return;
        title.append(span);
        othis.attr('overflow', '');

        // 展开图标事件
        span.on('click', function () {
          var isSpread = title.hasClass(CONST.MORE);
          title[isSpread ? 'removeClass' : 'addClass'](CONST.MORE);
        });
      } else {
        title.find('.' + CONST.BAR).remove();
        othis.removeAttr('overflow');
      }
    });
  },
  // 隐藏更多 Tab
  hideTabMore: function (e) {
    var tsbTitle = $('.' + CONST.HEADER);
    if (e === true || $(e.target).attr('lay-stope') !== 'tabmore') {
      tsbTitle.removeClass(CONST.MORE);
      tsbTitle.find('.' + CONST.BAR).attr('title', '');
    }
  }
};

// 扩展组件接口
$.extend(component, {
  // 新增 tab
  tabAdd: function (filter, options) {
    var tabElem = $('.layui-tab[lay-filter=' + filter + ']');
    var titElem = tabElem.children('.' + CONST.HEADER);
    var barElem = titElem.children('.' + CONST.BAR);
    var contElem = tabElem.children('.layui-tab-content');
    var li = '<li' + function () {
      var layAttr = [];
      layui.each(options, function (key, value) {
        if (/^(title|content)$/.test(key)) return;
        layAttr.push('lay-' + key + '="' + value + '"');
      });
      if (layAttr.length > 0) layAttr.unshift(''); //向前插，预留空格
      return layAttr.join(' ');
    }() + '>' + (options.title || 'unnaming') + '</li>';
    barElem[0] ? barElem.before(li) : titElem.append(li);
    contElem.append('<div class="layui-tab-item" ' + (options.id ? 'lay-id="' + options.id + '"' : '') + '>' + (options.content || '') + '</div>');
    // events.hideTabMore(true);
    // 是否添加即切换
    options.change && this.tabChange(filter, options.id);
    titElem.data('LAY_TAB_CHANGE', options.change);
    events.tabAuto(options.change ? 'change' : null, tabElem);
    return this;
  },
  /**
   * 外部 Tab 删除
   * @param {string} filter - 标签主容器 lay-filter 值
   * @param {string} layid - 标签头 lay-id 值
   * @param {boolean} force - 是否强制删除
   * @returns {this}
   */
  tabDelete: function (filter, layid, force) {
    var tabElem = $('.layui-tab[lay-filter=' + filter + ']');
    var titElem = tabElem.children('.' + CONST.HEADER);
    var liElem = titElem.find('>li[lay-id="' + layid + '"]');
    events.tabDelete.call(liElem[0], {
      liElem: liElem,
      force: force
    });
    return this;
  },
  /**
   * 外部 Tab 切换
   * @param {string} filter - 标签主容器 lay-filter 值
   * @param {string} layid - 标签头 lay-id 值
   * @param {boolean} force - 是否强制切换
   * @returns {this}
   */
  tabChange: function (filter, layid, force) {
    var tabElem = $('.layui-tab[lay-filter=' + filter + ']');
    var titElem = tabElem.children('.' + CONST.HEADER);
    var liElem = titElem.find('>li[lay-id="' + layid + '"]');
    events.tabClick.call(liElem[0], {
      liElem: liElem,
      force: force
    });
    return this;
  },
  // 自定义 Tab 选项卡
  tab: function (options) {
    options = options || {};
    $doc.on('click', options.headerElem, function () {
      var index = $(options.headerElem).index($(this));
      events.tabClick.call(this, {
        index: index,
        options: options
      });
    });
  }
});
$doc.on('click', '.' + CONST.HEADER + ' li', events.tabClick); // tab 头部项点击
$win.on('resize.lay_tab_auto_resize', events.tabAuto); // 自适应尺寸

export { component as tab };
