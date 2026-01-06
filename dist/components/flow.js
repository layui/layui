import { layui } from '../core/layui.js';
import { i18n } from '../core/i18n.js';
import $ from 'jquery';
import { component as component$1 } from '../core/component.js';

/**
 * flow
 * 流加载组件
 */


// 创建组件
var component = component$1({
  name: 'flow',
  CONST: {
    ELEM_LOAD: '<i class="layui-anim layui-anim-rotate layui-anim-loop layui-icon layui-icon-loading-1"></i>',
    ELEM_MORE: 'layui-flow-more',
    FLOW_SCROLL_EVENTS: 'scroll.lay_flow_scroll',
    LAZYIMG_SCROLL_EVENTS: 'scroll.lay_flow_lazyimg_scroll'
  },
  // 渲染
  render: function () {
    var that = this;
    var options = that.config;
    var page = 0;
    var locked;
    var finished;
    var elem = options.elem;
    if (!elem[0]) return;
    var scrollElem = $(options.scrollElem || document); // 滚动条所在元素
    var threshold = 'mb' in options ? options.mb : 50; // 临界距离
    var isAuto = 'isAuto' in options ? options.isAuto : true; // 否自动滚动加载
    var moreText = options.moreText || i18n.$t('flow.loadMore'); // 手动加载时，加载更多按钮文案
    var endText = options.end || i18n.$t('flow.noMore'); // “末页”显示文案
    var direction = options.direction || 'bottom';
    var isTop = direction === 'top';

    // 滚动条所在元素是否为 document
    var notDocument = options.scrollElem && options.scrollElem !== document;

    // 加载更多
    var ELEM_TEXT = '<cite>' + moreText + '</cite>';
    var $more = $('<div class="' + CONST.ELEM_MORE + '"><a href="javascript:;">' + ELEM_TEXT + '</a></div>');
    elem.find('.' + CONST.ELEM_MORE).remove(); // 清除旧的「加载更多」元素
    elem[isTop ? 'prepend' : 'append']($more);

    // 加载下一个元素
    var next = function (content, status) {
      var scrollHeightStart = notDocument ? scrollElem.prop('scrollHeight') : document.documentElement.scrollHeight;
      var scrollTopStart = scrollElem.scrollTop();
      $more[isTop ? 'after' : 'before'](content);
      status = status == 0 ? true : null;
      status ? $more.html(endText) : $moreBtn.html(ELEM_TEXT);
      finished = status;
      locked = null;

      // 如果允许图片懒加载
      if (options.isLazyimg) {
        component.lazyimg({
          elem: options.elem.find('img[lay-src]'),
          scrollElem: options.scrollElem,
          direction: options.direction,
          id: options.id
        });
      }
      if (isTop) {
        var scrollHeightEnd = notDocument ? scrollElem.prop('scrollHeight') : document.documentElement.scrollHeight;
        if (page === 1) {
          // 首次渲染后滑动到底部
          scrollElem.scrollTop(scrollHeightEnd);
        } else if (page > 1) {
          var nextElementHeight = scrollHeightEnd - scrollHeightStart;
          scrollElem.scrollTop(scrollTopStart + nextElementHeight);
        }
      }
    };
    var $moreBtn = $more.find('a');

    // 触发请求
    var done = function fn() {
      locked = true;
      $moreBtn.html(CONST.ELEM_LOAD);
      typeof options.done === 'function' && options.done(++page, next);
      return fn;
    }();

    // 不自动滚动加载
    $moreBtn.on('click', function () {
      if (finished) return;
      locked || done();
    });
    if (!isAuto) return that;

    // 滚动条滚动事件
    var timer;
    var FLOW_SCROLL_EVENTS = CONST.FLOW_SCROLL_EVENTS + '_' + options.id;
    scrollElem.off(FLOW_SCROLL_EVENTS).on(FLOW_SCROLL_EVENTS, function () {
      var othis = $(this),
        top = othis.scrollTop();
      if (timer) clearTimeout(timer);

      // 如果已经结束，或者元素处于隐藏状态，则不执行滚动加载
      if (finished || !elem.width()) return;
      timer = setTimeout(function () {
        // 计算滚动所在容器的可视高度
        var height = notDocument ? othis.height() : $(window).height();

        // 计算滚动所在容器的实际高度
        var scrollHeight = notDocument ? othis.prop('scrollHeight') : document.documentElement.scrollHeight;

        // 临界点
        if (!isTop ? scrollHeight - top - height <= threshold : top <= threshold) {
          locked || done();
        }
      }, 100);
    });
  }
});
var CONST = component.CONST;

/**
 * 扩展组件原型方法
 */

// 保留原接口，确保向下兼容
$.extend(component, {
  load: function (options) {
    return component.render(options);
  },
  // 图片懒加载
  lazyimg: function (options) {
    options = options || {};
    var scrollElem = $(options.scrollElem || document); // 滚动条所在元素
    var elem = options.elem || 'img';
    var direction = options.direction || 'bottom';
    var isTop = direction === 'top';
    var index = 0;

    // 滚动条所在元素是否为 document
    var notDocument = options.scrollElem && options.scrollElem !== document;

    // 显示图片
    var render = function fn(othis) {
      var $elem = $(elem);

      // 计算滚动所在容器的可视高度
      var height = notDocument ? scrollElem.height() : $(window).height();
      var start = scrollElem.scrollTop();
      var end = start + height;
      var show = function (item) {
        var elemTop = notDocument ? function () {
          return item.offset().top - scrollElem.offset().top + start;
        }() : item.offset().top;

        /* 始终只加载在当前屏范围内的图片 */
        if ((isTop ? elemTop + item.height() : elemTop) >= start && elemTop <= end) {
          if (item.attr('lay-src')) {
            var src = item.attr('lay-src');
            layui.img(src, function () {
              var next = $elem.eq(index);
              item.attr('src', src).removeAttr('lay-src');

              /* 当前图片加载就绪后，检测下一个图片是否在当前屏 */
              next[0] && fn(next);
              index++;
            }, function () {
              item.removeAttr('lay-src');
            });
          }
        }
      };
      if (othis) {
        show(othis);
      } else {
        // 计算未加载过的图片
        for (var i = 0; i < $elem.length; i++) {
          var item = $elem.eq(i),
            elemTop = notDocument ? function () {
              return item.offset().top - scrollElem.offset().top + start;
            }() : item.offset().top;
          show(item);
          index = i;

          // 如果图片的 top 坐标，超出了当前屏，则终止后续图片的遍历
          if (elemTop > end) break;
        }
      }
      return fn;
    }();

    // 滚动事件
    var timer;
    var id = options.id || '';
    var LAZYIMG_SCROLL_EVENTS = CONST.LAZYIMG_SCROLL_EVENTS + '_' + id;
    scrollElem.off(LAZYIMG_SCROLL_EVENTS).on(LAZYIMG_SCROLL_EVENTS, function () {
      if (timer) clearTimeout(timer);
      timer = setTimeout(function () {
        render();
      }, 50);
    });
    return render;
  }
});

export { component as flow };
