/**
 * popup
 * 附着弹出层
 */

import { lay } from '../core/lay.js';
import { $ } from 'jquery';
import * as floating from '@floating-ui/dom';
import { Component } from '../core/component.js';

const device = lay.device();
export const clickOrMousedown = device.mobile ? 'touchstart' : 'mousedown';
export { floating };

// 组件钩子符号集
export const popupHooks = Object.freeze({
  kBeforeRender: Symbol('Popup.beforeRender'), // 组件渲染前
  kBeforeOpen: Symbol('Popup.beforeOpen'), // 层打开前
  kAfterOpen: Symbol('Popup.afterOpen'), // 层打开后
  kAfterClose: Symbol('Popup.afterClose'), // 层关闭后
  kMiddlewares: Symbol('Popup.middlewares'), // Floating 中间件配置
});

export class Popup extends Component {
  static componentName = 'popup';

  // 默认配置项
  static options = {
    content: '', // 层内容
    trigger: 'click', // 事件类型

    // 弹出方位。可选值：top|right|bottom|left|top-start|top-end|right-start|right-end|bottom-start|bottom-end|left-start|left-end
    placement: 'top',

    // 是否显示箭头
    showArrow: false,

    // 打开层后，再次点击目标元素时是否关闭层。
    // 行为取决于所使用的触发事件类型
    closeOnClick: true,

    // 层打开时的动画。支持 anim.css 中的所有动画类
    anim: 'downbit',

    // 延时显示或隐藏的毫秒数，若为 number 类型，则表示显示和隐藏的延迟时间相同。
    // 仅当 `trigger` 为 `hover / mouseenter` 时生效
    delay: [200, 300],

    // defaultOpen: false, // 是否初始默认打开层
    // className: '', // 自定义样式类名
    // style: '', // 设置最外层 style 属性
    // backdrop: 0, // 遮罩
  };

  static get CONST() {
    return {
      ...super.CONST,
      ELEM_ROOT: 'lay-popup',
      ELEM_ARROW: 'lay-popup-arrow',
      ELEM_CONTENT: 'lay-popup-content',
      ELEM_BACKDROP: 'lay-popup-backdrop',

      // 弹出层的安全间距，同时用于层偏移、翻转和位移时的边界间距
      POSITION_SPACING: 5,
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

    this.overrideArrayOptions(options);
    this.stopClickOutsideEvent = $.noop;
    this.stopAutoUpdatePosition = $.noop;
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

      // 生成内容
      $contentElem.html(options.content);
      $rootElem.append($contentElem);

      // 生成箭头
      if (options.showArrow) {
        const $arrowElem = $(`<div class="${CONST.ELEM_ARROW}"></div>`);
        $rootElem.append($arrowElem);
      }

      // 生成层
      this.close(); // 关闭旧层
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

    this.#onClickOutside();
    this.#startAutoUpdatePosition();

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
    this.stopAutoUpdatePosition();

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

  /**
   * 获取参考元素
   * @returns {Element|Object} - 返回参考元素或自定义对象
   */
  #getReference() {
    const options = this.options;

    // 如果是右键菜单，则返回虚拟元素，模拟鼠标位置
    if (options.trigger === 'contextmenu' && this.e) {
      const { clientX, clientY } = this.e;
      return {
        getBoundingClientRect() {
          return {
            width: 0,
            height: 0,
            x: clientX,
            y: clientY,
            top: clientY,
            left: clientX,
            right: clientX,
            bottom: clientY,
          };
        },
        contextElement:
          options.$elem[0] instanceof Element ? options.$elem[0] : undefined,
      };
    }

    return options.$elem[0];
  }

  // 获取中间件配置
  #getMiddleware() {
    const options = this.options;
    const floatingEl = this.$rootElem[0];
    const arrowEl = floatingEl.querySelector(`.${CONST.ELEM_ARROW}`);
    const showArrow = options.showArrow && arrowEl;
    let padding = CONST.POSITION_SPACING;

    // 若开启箭头，则增加箭头的偏移量
    if (showArrow) {
      padding += arrowEl.offsetWidth / 2;
    }

    // 默认中间件配置
    const defaultMiddleware = [
      floating.offset(padding),
      floating.flip({ padding }),
      floating.shift({ padding }),
    ];

    // 执行中间件配置钩子
    const middlewareFromHook = this[popupHooks.kMiddlewares]?.({
      defaultMiddleware,
      padding,
    });

    let middleware = [...defaultMiddleware];

    // 若 middleware 选项值为数组，则替换默认中间件配置
    if (Array.isArray(middlewareFromHook)) {
      middleware = middlewareFromHook;
    }

    // 若开启箭头，且未包含 arrow 中间件，则自动追加
    if (options.showArrow && arrowEl) {
      if (!middleware.some((m) => m?.name === 'arrow')) {
        middleware.push(floating.arrow({ element: arrowEl }));
      }
    }

    return middleware;
  }

  /**
   * 更新层位置
   * 采用 Floating UI 计算位置
   * @需求背景 https://github.com/layui/layui/pull/3088#issuecomment-4884766973
   * @returns {Promise<void>}
   */
  #updatePosition() {
    const options = this.options;
    const referenceEl = this.#getReference();
    const floatingEl = this.$rootElem[0];
    const arrowEl = floatingEl.querySelector(`.${CONST.ELEM_ARROW}`);

    // 计算位置
    return floating
      .computePosition(referenceEl, floatingEl, {
        placement: options.placement,
        middleware: this.middleware,
      })
      .then(({ x, y, placement, middlewareData }) => {
        // 更新层位置
        Object.assign(floatingEl.style, {
          left: `${x}px`,
          top: `${y}px`,
        });

        floatingEl.dataset.placement = placement;

        // 更新箭头位置
        if (arrowEl && middlewareData.arrow) {
          const { x: arrowX, y: arrowY } = middlewareData.arrow;
          Object.assign(arrowEl.style, {
            left: arrowX != null ? `${arrowX}px` : '',
            top: arrowY != null ? `${arrowY}px` : '',
            right: '',
            bottom: '',
          });
        }
      });
  }

  /**
   * 开启自动更新位置
   */
  #startAutoUpdatePosition() {
    const referenceEl = this.#getReference();
    const floatingEl = this.$rootElem[0];

    this.stopAutoUpdatePosition(); // 停止上一次的自动更新位置
    this.middleware = this.#getMiddleware(); // 获取中间件配置

    // 执行自动更新位置
    const cleanup = floating.autoUpdate(
      referenceEl,
      floatingEl,
      this.#updatePosition.bind(this),
    );

    // 停止自动更新位置
    this.stopAutoUpdatePosition = () => {
      cleanup();
      this.stopAutoUpdatePosition = $.noop;
    };
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
}

const CONST = Popup.CONST;

export { Popup as popup };
