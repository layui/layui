/**
 * flow
 * 流加载组件
 */

import { loader } from '../core/loader.js';
import { i18n } from '../core/i18n.js';
import { $ } from 'jquery';
import { Component } from '../core/component.js';

export class Flow extends Component {
  static componentName = 'flow';

  static get CONST() {
    return {
      ...super.CONST,
      ELEM_LOAD:
        '<i class="lay-anim lay-anim-rotate lay-anim-loop lay-icon lay-icon-loading-1"></i>',
      ELEM_MORE: 'lay-flow-more',
    };
  }

  // 渲染
  render() {
    const options = this.options;
    const Constructor = this.constructor;

    let page = 0;
    let locked;
    let finished;

    const $elem = options.$elem;
    if (!$elem[0]) return;

    const scrollElem = $(options.scrollElem || document); // 滚动条所在元素
    const threshold = 'mb' in options ? options.mb : 50; // 临界距离
    const isAuto = 'isAuto' in options ? options.isAuto : true; // 否自动滚动加载
    const moreText = options.moreText || i18n.$t('flow.loadMore'); // 手动加载时，加载更多按钮文案
    const endText = options.end || i18n.$t('flow.noMore'); // “末页”显示文案
    const direction = options.direction || 'bottom';
    const isTop = direction === 'top';

    // 滚动条所在元素是否为 document
    const notDocument = options.scrollElem && options.scrollElem !== document;

    // 加载更多
    const ELEM_TEXT = `<cite>${moreText}</cite>`;
    const $more = $(
      `<div class="${CONST.ELEM_MORE}"><a href="javascript:;">${ELEM_TEXT}</a></div>`,
    );

    $elem.find('.' + CONST.ELEM_MORE).remove(); // 清除旧的「加载更多」元素
    $elem[isTop ? 'prepend' : 'append']($more);

    // 加载下一个元素
    const next = function (content, status) {
      const scrollHeightStart = notDocument
        ? scrollElem.prop('scrollHeight')
        : document.documentElement.scrollHeight;
      const scrollTopStart = scrollElem.scrollTop();

      $more[isTop ? 'after' : 'before'](content);
      status = status == 0 ? true : null;
      status ? $more.html(endText) : $moreBtn.html(ELEM_TEXT);
      finished = status;
      locked = null;

      // 如果允许图片懒加载
      if (options.isLazyimg) {
        Constructor.lazyimg({
          elem: $elem.find('img[lay-src]'),
          scrollElem: options.scrollElem,
          direction: options.direction,
          id: options.id,
        });
      }

      if (isTop) {
        const scrollHeightEnd = notDocument
          ? scrollElem.prop('scrollHeight')
          : document.documentElement.scrollHeight;
        if (page === 1) {
          // 首次渲染后滑动到底部
          scrollElem.scrollTop(scrollHeightEnd);
        } else if (page > 1) {
          const nextElementHeight = scrollHeightEnd - scrollHeightStart;
          scrollElem.scrollTop(scrollTopStart + nextElementHeight);
        }
      }
    };
    const $moreBtn = $more.find('a');

    // 触发请求
    const done = (function fn() {
      locked = true;
      $moreBtn.html(CONST.ELEM_LOAD);
      typeof options.done === 'function' && options.done(++page, next);
      return fn;
    })();

    // 不自动滚动加载
    $moreBtn.on('click', function () {
      if (finished) return;
      locked || done();
    });

    if (!isAuto) return this;

    // 实例级事件命名空间
    const scopedNamespace = `${CONST.EVENT_NAMESPACE}_${options.id}`;

    // 滚动条滚动事件
    let timer;
    const scrollEventName = `scroll${scopedNamespace}`;
    scrollElem.off(scrollEventName).on(scrollEventName, function () {
      const $this = $(this);
      const top = $this.scrollTop();

      if (timer) clearTimeout(timer);

      // 如果已经结束，或者元素处于隐藏状态，则不执行滚动加载
      if (finished || !$elem.width()) return;

      timer = setTimeout(function () {
        // 计算滚动所在容器的可视高度
        const height = notDocument ? $this.height() : $(window).height();

        // 计算滚动所在容器的实际高度
        const scrollHeight = notDocument
          ? $this.prop('scrollHeight')
          : document.documentElement.scrollHeight;

        // 临界点
        if (
          !isTop ? scrollHeight - top - height <= threshold : top <= threshold
        ) {
          locked || done();
        }
      }, 100);
    });
  }

  // 图片懒加载
  static lazyimg(options) {
    options = options || {};

    const scrollElem = $(options.scrollElem || document); // 滚动条所在元素
    const elem = options.elem || 'img';
    const direction = options.direction || 'bottom';
    const isTop = direction === 'top';
    let index = 0;

    // 滚动条所在元素是否为 document
    const notDocument = options.scrollElem && options.scrollElem !== document;

    // 显示图片
    const render = (function fn(othis) {
      const $elem = $(elem);

      // 计算滚动所在容器的可视高度
      const height = notDocument ? scrollElem.height() : $(window).height();
      const start = scrollElem.scrollTop();
      const end = start + height;

      const show = function (item) {
        const elemTop = notDocument
          ? (function () {
              return item.offset().top - scrollElem.offset().top + start;
            })()
          : item.offset().top;

        /* 始终只加载在当前屏范围内的图片 */
        if (
          (isTop ? elemTop + item.height() : elemTop) >= start &&
          elemTop <= end
        ) {
          if (item.attr('lay-src')) {
            const src = item.attr('lay-src');
            loader.image(src, {
              success() {
                const next = $elem.eq(index);
                item.attr('src', src).removeAttr('lay-src');

                /* 当前图片加载就绪后，检测下一个图片是否在当前屏 */
                next[0] && fn(next);
                index++;
              },
              error() {
                item.removeAttr('lay-src');
              },
            });
          }
        }
      };

      if (othis) {
        show(othis);
      } else {
        // 计算未加载过的图片
        for (let i = 0; i < $elem.length; i++) {
          const item = $elem.eq(i);
          const elemTop = notDocument
            ? (function () {
                return item.offset().top - scrollElem.offset().top + start;
              })()
            : item.offset().top;

          show(item);
          index = i;

          // 如果图片的 top 坐标，超出了当前屏，则终止后续图片的遍历
          if (elemTop > end) break;
        }
      }

      return fn;
    })();

    // 滚动事件
    let timer;
    const id = options.id || '';
    const scopedNamespace = `${CONST.EVENT_NAMESPACE}_lazyimg_${id}`;
    const scrollEventName = `scroll${scopedNamespace}`;

    scrollElem.off(scrollEventName).on(scrollEventName, function () {
      if (timer) clearTimeout(timer);
      timer = setTimeout(function () {
        render();
      }, 50);
    });

    return render;
  }
}

const CONST = Flow.CONST;

export { Flow as flow };
