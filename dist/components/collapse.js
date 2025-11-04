import { layui } from '../core/layui.js';
import $ from 'jquery';
import { component as component$1 } from '../core/component.js';

/**
 * collapse
 * 折叠面板组件
 */

var SUPER_MOD_NAME = 'element'; // 所属的超级模块名，确保向下兼容

// 创建组件
var component = component$1({
  name: 'collapse',
  // 组件名

  // 默认配置
  config: {
    elem: '.layui-collapse'
  },
  render: function () {
    var that = this;
    var options = that.config;
    options.elem.each(function () {
      var elemItem = $(this).find('.layui-colla-item');
      elemItem.each(function () {
        var othis = $(this);
        var elemTitle = othis.find('.layui-colla-title');
        var elemCont = othis.find('.layui-colla-content');
        var isNone = elemCont.css('display') === 'none';
        var clickEventName = 'click.lay_collapse_click';

        // 初始状态
        elemTitle.find('.layui-colla-icon').remove();
        elemTitle.append('<i class="layui-icon layui-icon-right layui-colla-icon"></i>');
        othis[isNone ? 'removeClass' : 'addClass'](CONST.CLASS_SHOW);

        // 兼容旧版（ < 2.11.3）
        if (elemCont.hasClass(CONST.CLASS_SHOW)) {
          elemCont.removeClass(CONST.CLASS_SHOW);
        }

        // 点击标题
        elemTitle.off(clickEventName, event.titleClick).on(clickEventName, event.titleClick);
      });
    });
  }
});

// 基础事件体
var event = {
  // 点击面板标题项
  titleClick: function () {
    var othis = $(this);
    var wrapper = othis.closest('.layui-collapse');
    var filter = wrapper.attr('lay-filter');
    var ANIM_MS = 200; // 动画过渡毫秒数
    var CLASS_ITEM = '.layui-colla-item';
    var CLASS_CONTENT = '.layui-colla-content';
    var thisItemElem = othis.parent(CLASS_ITEM);
    var thisContentElem = othis.siblings(CLASS_CONTENT);
    var isNone = thisContentElem.css('display') === 'none';
    var isAccordion = typeof wrapper.attr('lay-accordion') === 'string';

    // 动画执行完成后的操作
    var complete = function () {
      $(this).css('display', ''); // 剔除动画生成的 style display，以适配外部样式的状态重置
    };

    // 是否正处于动画中的状态
    if (thisContentElem.is(':animated')) return;

    // 展开或收缩
    if (isNone) {
      // 先执行 slideDown 动画，再标注展开状态样式，避免元素 `block` 状态导致动画无效
      thisContentElem.slideDown(ANIM_MS, complete);
      thisItemElem.addClass(CONST.CLASS_SHOW);
    } else {
      // 先取消展开状态样式，再将元素临时显示，避免 `none` 状态导致 slideUp 动画无效
      thisItemElem.removeClass(CONST.CLASS_SHOW);
      thisContentElem.show().slideUp(ANIM_MS, complete);
    }

    // 是否开启手风琴
    if (isAccordion) {
      var itemSiblings = thisItemElem.siblings('.' + CONST.CLASS_SHOW);
      itemSiblings.removeClass(CONST.CLASS_SHOW);
      itemSiblings.children(CLASS_CONTENT).show().slideUp(ANIM_MS, complete);
    }

    // 事件
    layui.event.call(this, SUPER_MOD_NAME, 'collapse(' + filter + ')', {
      title: othis,
      content: thisContentElem,
      show: isNone
    });
  }
};
var CONST = component.CONST;

export { component as collapse };
