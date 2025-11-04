import { layui } from '../core/layui.js';
import $ from 'jquery';
import { component as component$1 } from '../core/component.js';

/**
 * nav
 * 导航菜单组件
 */

var device = layui.device();
var SUPER_MOD_NAME = 'element'; // 所属的超级模块名，确保向下兼容

// 创建组件
var component = component$1({
  name: 'nav',
  // 组件名

  // 默认配置
  config: {
    elem: '.layui-nav'
  },
  CONST: {
    NAV_ELEM: '.layui-nav',
    NAV_ITEM: 'layui-nav-item',
    NAV_BAR: 'layui-nav-bar',
    NAV_TREE: 'layui-nav-tree',
    NAV_CHILD: 'layui-nav-child',
    NAV_CHILD_C: 'layui-nav-child-c',
    NAV_MORE: 'layui-nav-more',
    NAV_DOWN: 'layui-icon-down',
    NAV_ANIM: 'layui-anim layui-anim-upbit'
  },
  // 渲染
  render: function () {
    var that = this;
    var options = that.config;
    var TIME = 200;
    var timer = {};
    var timerMore = {};
    var timeEnd = {};
    var NAV_TITLE = 'layui-nav-title';

    // 滑块跟随
    var follow = function (bar, nav, index) {
      var othis = $(this);
      var child = othis.find('.' + CONST.NAV_CHILD);

      // 是否垂直导航菜单
      if (nav.hasClass(CONST.NAV_TREE)) {
        // 无子菜单时跟随
        if (!child[0]) {
          var thisA = othis.children('.' + NAV_TITLE);
          bar.css({
            top: othis.offset().top - nav.offset().top + nav.scrollTop(),
            height: (thisA[0] ? thisA : othis).outerHeight(),
            opacity: 1
          });
        }
      } else {
        child.addClass(CONST.NAV_ANIM);

        // 若居中对齐
        if (child.hasClass(CONST.NAV_CHILD_C)) {
          child.css({
            left: -(child.outerWidth() - othis.width()) / 2
          });
        }

        // 滑块定位
        if (child[0]) {
          // 若有子菜单，则滑块消失
          bar.css({
            left: bar.position().left + bar.width() / 2,
            width: 0,
            opacity: 0
          });
        } else {
          // bar 跟随
          bar.css({
            left: othis.position().left + parseFloat(othis.css('marginLeft')),
            top: othis.position().top + othis.height() - bar.height()
          });
        }

        // 渐显滑块并适配宽度
        timer[index] = setTimeout(function () {
          bar.css({
            width: child[0] ? 0 : othis.width(),
            opacity: child[0] ? 0 : 1
          });
        }, device.ie && device.ie < 10 ? 0 : TIME);

        // 显示子菜单
        clearTimeout(timeEnd[index]);
        if (child.css('display') === 'block') {
          clearTimeout(timerMore[index]);
        }
        timerMore[index] = setTimeout(function () {
          child.addClass(CONST.CLASS_SHOW);
          othis.find('.' + CONST.NAV_MORE).addClass(CONST.NAV_MORE + 'd');
        }, 300);
      }
    };

    // 遍历导航
    options.elem.each(function (index) {
      var othis = $(this);
      var bar = $('<span class="' + CONST.NAV_BAR + '"></span>');
      var itemElem = othis.find('.' + CONST.NAV_ITEM);

      // hover 滑动效果
      var hasBarElem = othis.find('.' + CONST.NAV_BAR);
      if (hasBarElem[0]) hasBarElem.remove();
      othis.append(bar);
      (othis.hasClass(CONST.NAV_TREE) ? itemElem.find('dd,>.' + CONST.NAV_TITLE) : itemElem).off('mouseenter.lay_nav').on('mouseenter.lay_nav', function () {
        follow.call(this, bar, othis, index);
      }).off('mouseleave.lay_nav').on('mouseleave.lay_nav', function () {
        // 鼠标移出
        // 是否为垂直导航
        if (othis.hasClass(CONST.NAV_TREE)) {
          bar.css({
            height: 0,
            opacity: 0
          });
        } else {
          // 隐藏子菜单
          clearTimeout(timerMore[index]);
          timerMore[index] = setTimeout(function () {
            othis.find('.' + CONST.NAV_CHILD).removeClass(CONST.CLASS_SHOW);
            othis.find('.' + CONST.NAV_MORE).removeClass(CONST.NAV_MORE + 'd');
          }, 300);
        }
      });

      // 鼠标离开当前菜单时
      othis.off('mouseleave.lay_nav').on('mouseleave.lay_nav', function () {
        clearTimeout(timer[index]);
        timeEnd[index] = setTimeout(function () {
          if (!othis.hasClass(CONST.NAV_TREE)) {
            bar.css({
              width: 0,
              left: bar.position().left + bar.width() / 2,
              opacity: 0
            });
          }
        }, TIME);
      });

      // 展开子菜单
      itemElem.find('a').each(function () {
        var thisA = $(this);
        var child = thisA.siblings('.' + CONST.NAV_CHILD);
        var clickEventName = 'click.lay_nav_click';

        // 输出小箭头
        if (child[0] && !thisA.children('.' + CONST.NAV_MORE)[0]) {
          thisA.append('<i class="layui-icon ' + CONST.NAV_DOWN + ' ' + CONST.NAV_MORE + '"></i>');
        }

        // 点击菜单
        thisA.off(clickEventName, events.clickThis).on(clickEventName, events.clickThis);
      });
    });
  }
});
var events = {
  // 点击当前菜单 - a 标签触发
  clickThis: function () {
    var othis = $(this);
    var parents = othis.closest(CONST.NAV_ELEM);
    var filter = parents.attr('lay-filter');
    var parent = othis.parent();
    var child = othis.siblings('.' + CONST.NAV_CHILD);
    var unselect = typeof parent.attr('lay-unselect') === 'string'; // 是否禁用选中

    // 满足点击选中的条件
    if (!(othis.attr('href') !== 'javascript:;' && othis.attr('target') === '_blank') && !unselect) {
      if (!child[0]) {
        parents.find('.' + CONST.CLASS_THIS).removeClass(CONST.CLASS_THIS);
        parent.addClass(CONST.CLASS_THIS);
      }
    }

    // 若为垂直菜单
    if (parents.hasClass(CONST.NAV_TREE)) {
      var NAV_ITEMED = CONST.NAV_ITEM + 'ed'; // 用于标注展开状态
      var needExpand = !parent.hasClass(NAV_ITEMED); // 是否执行展开
      var ANIM_MS = 200; // 动画过渡毫秒数

      // 动画执行完成后的操作
      var complete = function () {
        $(this).css({
          display: '' // 剔除动画生成的 style display，以适配外部样式的状态重置
        });
        // 避免导航滑块错位
        parents.children('.' + CONST.NAV_BAR).css({
          opacity: 0
        });
      };

      // 是否正处于动画中的状态
      if (child.is(':animated')) return;

      // 剔除可能存在的 CSS3 动画类
      child.removeClass(CONST.NAV_ANIM);

      // 若有子菜单，则对其执行展开或收缩
      if (child[0]) {
        if (needExpand) {
          // 先执行 slideDown 动画，再标注展开状态样式，避免元素 `block` 状态导致动画无效
          child.slideDown(ANIM_MS, complete);
          parent.addClass(NAV_ITEMED);
        } else {
          // 先取消展开状态样式，再将元素临时显示，避免 `none` 状态导致 slideUp 动画无效
          parent.removeClass(NAV_ITEMED);
          child.show().slideUp(ANIM_MS, complete);
        }

        // 手风琴 --- 收缩兄弟展开项
        if (typeof parents.attr('lay-accordion') === 'string' || parents.attr('lay-shrink') === 'all') {
          var parentSibs = parent.siblings('.' + NAV_ITEMED);
          parentSibs.removeClass(NAV_ITEMED);
          parentSibs.children('.' + CONST.NAV_CHILD).show().stop().slideUp(ANIM_MS, complete);
        }
      }
    }
    layui.event.call(this, SUPER_MOD_NAME, 'nav(' + filter + ')', othis);
  }
};
var CONST = component.CONST;

export { component as nav };
