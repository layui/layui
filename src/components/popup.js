/**
 * popup
 * 附着弹出层
 */

import { lay } from '../core/lay.js';
import { $ } from 'jquery';
import { Component } from '../core/component.js';

const device = lay.device();
export const clickOrMousedown = device.mobile ? 'touchstart' : 'mousedown';

// 组件钩子符号集
export const popupHooks = Object.freeze({
  kBeforeRender: Symbol('Popup.beforeRender'), // 组件渲染前
  kBeforeOpen: Symbol('Popup.beforeOpen'), // 层打开前
  kAfterOpen: Symbol('Popup.afterOpen'), // 层打开后
  kAfterClose: Symbol('Popup.afterClose'), // 层关闭后
});

export class Popup extends Component {
  static componentName = 'popup';

  // 默认配置项
  static options = {
    content: '', // 层内容
    trigger: 'click', // 事件类型
    anim: 'downbit', // 打开动画。支持 anim.css 中的所有动画类

    // 打开层后，再次点击目标元素时是否关闭层。
    // 行为取决于所使用的触发事件类型
    closeOnClick: true,

    // 延时显示或隐藏的毫秒数，若为 number 类型，则表示显示和隐藏的延迟时间相同。
    // trigger 为 hover/mouseenter 时生效
    delay: [200, 300],

    // defaultOpen: false, // 是否初始默认打开层

    // 定位方式。同 CSS position 属性。
    // 一般无需设置，除非当目标元素处于 fixed 容器，可设置 fixed 值
    // position: 'absolute',

    // align: 'left', // 层对齐方式，可选值：left|center|right
    // className: '', // 自定义样式类名
    // style: '', // 设置最外层 style 属性
    // backdrop: 0, // 遮罩
  };

  static get CONST() {
    return {
      ...super.CONST,
      ELEM_ROOT: 'lay-popup',
      ELEM_CONTENT: 'lay-popup-content',
      ELEM_BACKDROP: 'lay-popup-backdrop',
    };
  }

  // 实例方法静态委托
  static {
    this.delegateInstanceMethods(['open', 'close', 'updateContent']);
  }

  // 构造函数
  constructor(options) {
    super({
      target: 'body', // 目标对象。非文档化选项
      ...options,
    });

    Object.assign(this.options, {
      $target: $(this.options.target),
    });

    this.stopClickOutsideEvent = $.noop;
    this.stopResizeEvent = $.noop;
  }

  // 渲染
  render() {
    const options = this.options;

    // 若传入 hover，则规范化为 mouseenter
    if (options.trigger === 'hover') {
      options.trigger = 'mouseenter';
    }

    // 渲染前的内部钩子
    this[popupHooks.kBeforeRender]?.();
    this.#events(); // 事件

    // 初始打开层的条件
    if (options.defaultOpen || this.isRootElemMounted()) {
      this.open();
    }
  }

  /**
   * 打开层
   */
  open() {
    const options = this.options;

    // 根元素
    let $rootElem = $(`<div class="${CONST.ELEM_ROOT} lay-panel"></div>`);
    const $contentElem = $(`<div class="${CONST.ELEM_CONTENT}"></div>`);

    // 层打开前的内部钩子
    this[popupHooks.kBeforeOpen]?.({ $rootElem, $contentElem });

    // 是否仅更新内容
    if (options._renderMode === 'updateContent' && this.isRootElemMounted()) {
      $rootElem = this.$rootElem;
      this.updateContent(options.content);
      delete options._renderMode;
    } else {
      // 打开动画
      if (options.anim) {
        $rootElem.addClass(`lay-anim lay-anim-${options.anim}`);
      }

      // 初始化自定义样式
      $rootElem.addClass(options.className).attr('style', options.style);

      // 生成层
      this.close(); // 关闭旧层
      $contentElem.html(options.content); // 填充内容
      $rootElem.append($contentElem); // 插入内容元素
      options.$target.append($rootElem); // 插入新层
      this.$rootElem = $rootElem;

      // 若开启遮罩
      if (options.backdrop) {
        const $backdropElem = $(`<div class="${CONST.ELEM_BACKDROP}"></div>`);

        $backdropElem.css({
          'z-index': $rootElem.css('z-index') - 1,
          opacity: options.backdrop,
        });

        // 处理移动端点击穿透问题
        if (clickOrMousedown === 'touchstart') {
          $backdropElem.on(clickOrMousedown, (e) => {
            e.preventDefault();
          });
        }

        $rootElem.before($backdropElem);
      }

      // 如果是鼠标移入事件，则鼠标移出时自动关闭
      if (options.trigger === 'mouseenter') {
        $rootElem
          .on('mouseenter', () => {
            clearTimeout(this.timer);
          })
          .on('mouseleave', () => {
            this.#delayClose();
          });
      }
    }

    this.#position(); // 定位坐标
    this.#onClickOutside();
    this.#autoUpdatePosition();

    options.afterOpen?.(options, $rootElem); // 层打开后的回调
    this[popupHooks.kAfterOpen]?.(); // 层打开后的内部钩子
  }

  /**
   * 关闭层
   */
  close() {
    const options = this.options;
    const $rootElem = this.$rootElem;

    this.stopClickOutsideEvent();
    this.stopResizeEvent();

    // 若存在已打开的层元素，则移除
    if (this.isRootElemMounted()) {
      $rootElem.prev(`.${CONST.ELEM_BACKDROP}`).remove(); // 先移除遮罩
      $rootElem.remove(); // 再移除层

      options.afterClose?.(options); // 层关闭后的回调
      this[popupHooks.kAfterClose]?.(); // 层关闭后的内部钩子
    }

    delete this.$rootElem; // 移除层根节点的引用
    delete options._renderMode; // 移除私有选项
  }

  /**
   * 更新层内容
   * @param {string} content - 新内容
   */
  updateContent(content = '') {
    if (this.isRootElemMounted()) {
      this.options.content = content;
      this.$rootElem.children(`.${CONST.ELEM_CONTENT}`).html(content);
    }
  }

  /**
   * 层元素是否已存在于目标元素中
   * @returns {boolean} - 若存在，则返回 true
   */
  isRootElemMounted() {
    const $rootElem = this.$rootElem;
    return $rootElem && this.options.$target[0]?.contains($rootElem[0]);
  }

  // 位置定位
  #position() {
    const options = this.options;

    lay.position(options.$elem[0], this.$rootElem[0], {
      position: options.position,
      e: this.e,
      clickType: options.trigger === 'contextmenu' ? 'right' : null,
      align: options.align || null,
    });
  }

  // 规范化延迟时间
  #normalizedDelay() {
    const options = this.options;
    const delay = [].concat(options.delay);

    return {
      show: delay[0],
      hide: delay[1] !== undefined ? delay[1] : delay[0],
    };
  }

  // 延迟关闭层
  #delayClose() {
    clearTimeout(this.timer);

    this.timer = setTimeout(() => {
      this.close();
    }, this.#normalizedDelay().hide);
  }

  // 事件
  #events() {
    const options = this.options;
    const $elem = options.$elem;

    // 是否鼠标移入时触发
    const isMouseEnter = options.trigger === 'mouseenter';
    const eventNamespace = this.constructor.CONST.EVENT_NAMESPACE;
    const trigger = `${options.trigger}${eventNamespace}`;

    // 始终先解除上一个触发元素的事件（如重载时改变 elem 的情况）
    this.$activeElem?.off(eventNamespace);
    $elem.off(eventNamespace);
    this.$activeElem = $elem;

    // 触发元素事件
    $elem.on(trigger, (e) => {
      clearTimeout(this.timer);
      this.e = e;

      // 层是否已打开
      const opened = this.isRootElemMounted();

      // 若为鼠标移入事件，则延迟触发
      if (isMouseEnter) {
        if (!opened) {
          this.timer = setTimeout(() => {
            this.open();
          }, this.#normalizedDelay().show);
        }
      } else {
        // 若为 click 事件，则根据层状态，自动切换打开与关闭
        if (options.closeOnClick && opened && options.trigger === 'click') {
          this.close();
        } else {
          this.open();
        }
      }

      e.preventDefault();
    });

    // 如果是鼠标移入事件
    if (isMouseEnter) {
      // 执行鼠标移出事件
      $elem.on(`mouseleave${eventNamespace}`, () => {
        this.#delayClose();
      });
    }
  }

  /**
   * 点击层外部时的事件
   */
  #onClickOutside() {
    const options = this.options;
    const isCtxMenu = options.trigger === 'contextmenu';
    const isTopElem = lay.isTopElem(options.$elem[0]);

    this.stopClickOutsideEvent();

    const stop = lay.onClickOutside(
      this.$rootElem[0],
      (e) => {
        // 点击层外部时的事件
        if (typeof options.onClickOutside === 'function') {
          const shouldClose = options.onClickOutside(e);
          if (shouldClose === false) return;
        }

        this.close();
      },
      {
        ignore: isCtxMenu || isTopElem ? null : [options.$elem[0]],
        event: clickOrMousedown,
        capture: false,
        detectIframe: true,
      },
    );

    this.stopClickOutsideEvent = () => {
      stop();
      this.stopClickOutsideEvent = $.noop;
    };
  }

  /**
   * 窗口大小变化时自动更新位置
   */
  #autoUpdatePosition() {
    const options = this.options;
    const eventNamespace = this.constructor.CONST.EVENT_NAMESPACE;

    this.stopResizeEvent();

    const windowResizeHandler = () => {
      if (
        this.$rootElem &&
        (!this.$rootElem[0] || !this.$rootElem.is(':visible'))
      )
        return;
      if (options.trigger === 'contextmenu') {
        this.close();
      } else {
        this.#position();
      }
    };
    $(window).on(`resize${eventNamespace}`, windowResizeHandler);

    const shouldObserveResize =
      resizeObserver && options.trigger !== 'contextmenu';
    const triggerEl = options.$elem[0];
    const contentEl = this.$rootElem[0];
    const positionHandler = () => this.#position();

    if (shouldObserveResize) {
      resizeObserver.observe(triggerEl, positionHandler);
      resizeObserver.observe(contentEl, positionHandler);
    }

    this.stopResizeEvent = () => {
      $(window).off(`resize${eventNamespace}`, windowResizeHandler);
      if (shouldObserveResize) {
        resizeObserver.unobserve(triggerEl);
        resizeObserver.unobserve(contentEl);
      }

      this.stopResizeEvent = $.noop;
    };
  }
}

const CONST = Popup.CONST;
const resizeObserver = lay.createSharedResizeObserver(Popup.componentName);

export { Popup as popup };
