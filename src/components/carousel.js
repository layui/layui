/**
 * carousel
 * 轮播
 */

import { lay } from '../core/lay.js';
import { $ } from 'jquery';
import { Component } from '../core/component.js';

export class Carousel extends Component {
  static componentName = 'carousel';

  // 默认配置项
  static options = {
    width: '600px',
    height: '280px',
    full: false, // 是否全屏
    arrow: 'hover', // 切换箭头默认显示状态。可选值: hover|always|none
    indicator: 'inside', // 指示器位置。可选值: inside|outside|none
    autoplay: true, // 是否自动切换。可选值: true|false|always
    interval: 3000, // 自动切换的时间间隔，不能低于 800
    anim: '', // 动画类型。可选值: default|updown|fade
    trigger: 'click', // 指示器的触发方式。可选值: click|hover
    index: 0, // 初始开始的索引
  };

  static get CONST() {
    return {
      ...super.CONST,
      ELEM: 'lay-carousel',
      ELEM_ITEM: '>*[carousel-item]>*',
      ELEM_LEFT: 'lay-carousel-left',
      ELEM_RIGHT: 'lay-carousel-right',
      ELEM_PREV: 'lay-carousel-prev',
      ELEM_NEXT: 'lay-carousel-next',
      ELEM_ARROW: 'lay-carousel-arrow',
      ELEM_IND: 'lay-carousel-ind',
    };
  }

  // 实例方法静态委托
  static {
    this.delegateInstanceMethods(['goto', 'prevIndex', 'nextIndex']);
  }

  // 渲染
  render() {
    const options = this.options;
    const $elem = options.$elem;

    this.$itemElem = $elem.find(CONST.ELEM_ITEM);

    if (options.index < 0) {
      options.index = 0;
    }
    if (options.index >= this.$itemElem.length) {
      options.index = this.$itemElem.length - 1;
    }
    if (options.interval < 800) {
      options.interval = 800;
    }

    // 是否全屏模式
    if (options.full) {
      $elem.css({
        position: 'fixed',
        width: '100%',
        height: '100%',
        zIndex: 9999,
      });
    } else {
      $elem.css({
        width: options.width,
        height: options.height,
      });
    }

    $elem.attr('lay-anim', options.anim);

    // 初始焦点状态
    this.$itemElem
      .eq(options.index)
      .addClass(CONST.CLASS_THIS)
      .siblings()
      .removeClass(CONST.CLASS_THIS);

    // 指示器、箭头等动作
    this.#indicator();
    this.#arrow();
    this.#autoplay();

    this.#events();
  }

  /**
   * 跳转到特定下标
   * @param {number} index - 目标下标
   */
  goto(index) {
    const options = this.options;

    if (index > options.index) {
      this.#slide('add', index - options.index);
    } else if (index < options.index) {
      this.#slide('sub', options.index - index);
    }
  }

  // 获取上一个等待条目的索引
  prevIndex() {
    const options = this.options;
    let prevIndex = options.index - 1;

    if (prevIndex < 0) {
      prevIndex = this.$itemElem.length - 1;
    }

    return prevIndex;
  }

  // 获取下一个等待条目的索引
  nextIndex() {
    const options = this.options;
    let nextIndex = options.index + 1;

    if (nextIndex >= this.$itemElem.length) {
      nextIndex = 0;
    }

    return nextIndex;
  }

  // 索引递增
  #addIndex(num) {
    const options = this.options;

    num = num || 1;
    options.index = options.index + num;

    // index 不能超过轮播总数量
    if (options.index >= this.$itemElem.length) {
      options.index = 0;
    }
  }

  // 索引递减
  #subIndex(num) {
    const options = this.options;

    num = num || 1;
    options.index = options.index - num;

    // index 不能超过轮播总数量
    if (options.index < 0) {
      options.index = this.$itemElem.length - 1;
    }
  }

  // 自动轮播
  #autoplay() {
    const options = this.options;
    const itemsCount = this.$itemElem.length;

    if (!options.autoplay) return;
    clearInterval(this.timer);

    if (itemsCount > 1) {
      this.timer = setInterval(() => {
        this.#slide();
      }, options.interval);
    }
  }

  // 箭头
  #arrow() {
    const options = this.options;
    const itemsCount = this.$itemElem.length;
    const $elem = options.$elem;

    // 模板
    const tplArrow = $(
      [
        `<button type="button" class="lay-icon ${
          options.anim === 'updown' ? 'lay-icon-up' : 'lay-icon-left'
        } ${CONST.ELEM_ARROW}" lay-type="sub"></button>`,
        `<button type="button" class="lay-icon ${
          options.anim === 'updown' ? 'lay-icon-down' : 'lay-icon-right'
        } ${CONST.ELEM_ARROW}" lay-type="add"></button>`,
      ].join(''),
    );

    // 预设基础属性
    $elem.attr('lay-arrow', options.arrow);

    // 避免重复插入
    if ($elem.find(`.${CONST.ELEM_ARROW}`)[0]) {
      $elem.find(`.${CONST.ELEM_ARROW}`).remove();
    }
    itemsCount > 1 ? $elem.append(tplArrow) : tplArrow.remove();

    // 事件
    tplArrow.on('click', (event) => {
      const target = $(event.currentTarget);
      const type = target.attr('lay-type');
      this.#slide(type);
    });
  }

  // 指示器
  #indicator() {
    const options = this.options;
    const itemsCount = this.$itemElem.length;
    const $elem = options.$elem;

    // 模板
    const tplInd = (this.$indElem = $(
      [
        `<div class="${CONST.ELEM_IND}"><ul>`,
        (() => {
          const li = [];
          this.$itemElem.each(function (index) {
            li.push(
              `<li${options.index === index ? ' class="lay-this"' : ''}></li>`,
            );
          });
          return li.join('');
        })(),
        '</ul></div>',
      ].join(''),
    ));

    // 预设基础属性
    $elem.attr('lay-indicator', options.indicator);

    // 避免重复插入
    if ($elem.find(`.${CONST.ELEM_IND}`)[0]) {
      $elem.find(`.${CONST.ELEM_IND}`).remove();
    }

    itemsCount > 1 ? $elem.append(tplInd) : tplInd.remove();

    if (options.anim === 'updown') {
      tplInd.css('margin-top', -(tplInd.height() / 2));
    }

    // 事件
    tplInd
      .find('li')
      .on(
        options.trigger === 'hover' ? 'mouseover' : options.trigger,
        (event) => {
          this.goto($(event.currentTarget).index());
        },
      );
  }

  // 滑动切换
  #slide(type, num) {
    const elemItem = this.$itemElem;
    const itemsCount = elemItem.length;
    const options = this.options;
    const thisIndex = options.index;

    if (this.haveSlide || itemsCount <= 1) return;

    // 滑动方向
    if (type === 'sub') {
      this.#subIndex(num);
      elemItem.eq(options.index).addClass(CONST.ELEM_PREV);
      setTimeout(() => {
        elemItem.eq(thisIndex).addClass(CONST.ELEM_RIGHT);
        elemItem.eq(options.index).addClass(CONST.ELEM_RIGHT);
      }, 50);
    } else {
      // 默认递增滑
      this.#addIndex(num);
      elemItem.eq(options.index).addClass(CONST.ELEM_NEXT);
      setTimeout(() => {
        elemItem.eq(thisIndex).addClass(CONST.ELEM_LEFT);
        elemItem.eq(options.index).addClass(CONST.ELEM_LEFT);
      }, 50);
    }

    // 移除过渡类
    setTimeout(() => {
      elemItem.removeClass(
        `${CONST.CLASS_THIS} ${CONST.ELEM_PREV} ${CONST.ELEM_NEXT} ${CONST.ELEM_LEFT} ${CONST.ELEM_RIGHT}`,
      );
      elemItem.eq(options.index).addClass(CONST.CLASS_THIS);
      this.haveSlide = false; // 解锁
    }, 350);

    // 指示器焦点
    this.$indElem
      .find('li')
      .eq(options.index)
      .addClass(CONST.CLASS_THIS)
      .siblings()
      .removeClass(CONST.CLASS_THIS);

    this.haveSlide = true;

    // 回调返回的参数
    const params = {
      index: options.index,
      prevIndex: thisIndex,
      item: elemItem.eq(options.index),
    };

    options.change?.(params);
  }

  // 事件处理
  #events() {
    const options = this.options;
    const $elem = options.$elem;

    // 事件命名空间
    const eventNamespace = CONST.EVENT_NAMESPACE;

    // 解绑事件，避免重复绑定
    $elem.off(eventNamespace);

    // 移入移出容器
    $elem
      .on(`mouseenter${eventNamespace} touchstart${eventNamespace}`, () => {
        if (this.options.autoplay === 'always') return;
        clearInterval(this.timer);
      })
      .on(`mouseleave${eventNamespace} touchend${eventNamespace}`, () => {
        if (this.options.autoplay === 'always') return;
        this.#autoplay();
      });

    const touchEl = $elem;
    const isVertical = options.anim === 'updown';

    lay.touchSwipe(touchEl, {
      onTouchEnd: function (e, state) {
        const duration = Date.now() - state.timeStart;
        const distance = isVertical ? state.distanceY : state.distanceX;
        const speed = distance / duration;
        const shouldSwipe =
          Math.abs(speed) > 0.25 ||
          Math.abs(distance) > touchEl[isVertical ? 'height' : 'width']() / 3;
        if (shouldSwipe) {
          this.#slide(distance > 0 ? '' : 'sub');
        }
      }.bind(this),
    });
  }
}

const CONST = Carousel.CONST;

export { Carousel as carousel };
