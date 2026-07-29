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
  kAfterCreate: Symbol('Popup.afterCreate'), // 根元素首次创建后
  kOnRender: Symbol('Popup.onRender'), // 组件渲染时
  kBeforeOpen: Symbol('Popup.beforeOpen'), // 层打开前
  kAfterOpen: Symbol('Popup.afterOpen'), // 层打开后
  kAfterClose: Symbol('Popup.afterClose'), // 层关闭后
  kMiddlewares: Symbol('Popup.middlewares'), // Floating 中间件配置
  kOnClickOutside: Symbol('Popup.onClickOutside'), // 点击层外部时
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

    // 弹出层与目标元素的偏移量，单位 px
    // 同时作用于翻转和位移时的边界间距
    offset: 5,

    // 打开层后，再次点击目标元素时是否关闭层。
    // 行为取决于所使用的触发事件类型
    closeOnClick: true,

    // 层弹出时的动画。支持 anim.css 中的所有动画类
    anim: 'fadein',

    // 延时打开和关闭层毫秒数，仅当 `trigger` 为 `hover/mouseenter` 时生效
    openDelay: 200,
    closeDelay: 300,

    // defaultOpen: false, // 是否初始默认打开层
    // theme: 'light', // 主题。可选值: light|dark
    // className: '', // 自定义样式类名
    // style: '', // 设置最外层 style 属性
    // backdrop: 0, // 遮罩

    // afterOpen: null, // 层打开后的回调函数
    // afterClose: null, // 层关闭后的回调函数
    // onClickOutside: null, // 点击层外部时的事件处理；返回 false 时阻止关闭层
  };

  static get CONST() {
    return {
      ...super.CONST,
      ELEM_ROOT: 'lay-popup',
      ELEM_ARROW: 'lay-popup-arrow',
      ELEM_CONTENT: 'lay-popup-content',
      ELEM_BACKDROP: 'lay-popup-backdrop',

      // 根元素基础类名（须与 ELEM_ROOT 保持一致）
      ROOT_BASE_CLASS: `lay-popup lay-panel`,
    };
  }

  // 实例方法静态委托
  static {
    this.delegateInstanceMethods([
      'open',
      'close',
      'updateContent',
      'isRootElemMounted',
      'delayClose',
    ]);
  }

  /**
   * Tooltip 定制弹出
   * 该方法与 `popup.render()` 的区别在于：
   * 它并不与 `elem` 进行持久事件绑定，而是直接在目标元素中打开一个临时的 Tooltip 弹出层
   * @param {Object} options - 配置项；同 {@link Popup.options}，
   * 其中 `trigger, showArrow` 不可重置
   * @returns {Popup} 返回 Popup 实例
   */
  static tooltip(options) {
    const popupInstance = this.render({
      closeDelay: 150,
      ...options,

      // 不可修改的默认配置
      trigger: 'mouseenter',
      showArrow: true,
      afterOpen: ({ instance, ...rest }) => {
        // 添加专属 className
        instance.$rootElem.addClass(`${CONST.ELEM_ROOT}-tooltip`);
        options.afterOpen?.({ instance, ...rest });
      },
      afterClose: ({ instance, ...rest }) => {
        // 关闭即销毁 Popup 实例
        instance.destroy();
        options.afterClose?.({ instance, ...rest });
      },
    });

    popupInstance.open();
    return popupInstance;
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

  /**
   * 渲染
   * @returns {void}
   */
  render() {
    const options = this.options;

    this.#normalizeOptions();

    // 首次渲染时，创建根元素
    if (!this.$rootElem) {
      this.#createRootElem();

      // 执行根元素首次创建后的内部钩子
      this[popupHooks.kAfterCreate]?.();
    }

    // 执行组件渲染时的内部钩子
    this[popupHooks.kOnRender]?.();

    this.#renderRootElem();
    this.#events();

    // 初始打开层的条件
    if (options.defaultOpen || this.isRootElemMounted()) {
      this.open();
    }
  }

  /**
   * 打开层
   * @returns {void}
   */
  open() {
    const { options, $rootElem, $contentElem } = this;

    // 执行层打开前的内部钩子
    this[popupHooks.kBeforeOpen]?.();

    // 是否仅更新内容
    if (options._renderMode === 'updateContent' && this.isRootElemMounted()) {
      this.updateContent(options.content);
      delete options._renderMode;
    } else {
      // 填充内容
      $contentElem.html(options.content);

      this.close(); // 关闭旧层
      options.$target.append($rootElem); // 添加新层

      // 如果是鼠标移入事件，则鼠标移出时自动关闭
      if (options.trigger === 'mouseenter') {
        $rootElem
          .on('mouseenter', () => {
            clearTimeout(this.timer);
          })
          .on('mouseleave', () => {
            this.delayClose();
          });
      }

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
    }

    this.#onClickOutside();
    this.#startAutoUpdatePosition();

    // 层打开后的回调
    options.afterOpen?.({ instance: this, options });

    // 执行层打开后的内部钩子
    this[popupHooks.kAfterOpen]?.();
  }

  /**
   * 关闭层
   * @returns {void}
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

      // 层关闭后的回调
      options.afterClose?.({ instance: this, options });

      // 层关闭后的内部钩子
      this[popupHooks.kAfterClose]?.();
    }

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
   * 延迟关闭层
   * @returns {void}
   */
  delayClose() {
    const options = this.options;

    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.close();
    }, options.closeDelay);
  }

  /**
   * 重写 destroy 方法
   * @returns {void}
   */
  destroy() {
    clearTimeout(this.timer);
    this.timer = null;
    this.close();

    super.destroy();
  }

  /**
   * 规范化选项
   * @returns {void}
   */
  #normalizeOptions() {
    const options = this.options;

    // 若传入 hover，则规范化为 mouseenter
    if (options.trigger === 'hover') {
      options.trigger = 'mouseenter';
    }

    // 确保 offset 为有效数字
    options.offset = Number(options.offset);
    if (Number.isNaN(options.offset)) {
      options.offset = Popup.options.offset;
    }
  }

  /**
   * 创建根元素
   * @returns {void}
   */
  #createRootElem() {
    const $rootElem = (this.$rootElem = $(
      `<div class="${CONST.ROOT_BASE_CLASS}"></div>`,
    ));
    const $contentElem = (this.$contentElem = $(
      `<div class="${CONST.ELEM_CONTENT}"></div>`,
    ));

    // 添加内容元素
    $rootElem.append($contentElem);
  }

  /**
   * 渲染根元素
   * @returns {void}
   */
  #renderRootElem() {
    const { options, $rootElem } = this;

    this.#applyRootElemAttrs();

    // 添加或移除箭头元素
    if (options.showArrow) {
      const $arrowElem = $(`<div class="${CONST.ELEM_ARROW}"></div>`);
      $rootElem.append($arrowElem);
    } else {
      $rootElem.children(`.${CONST.ELEM_ARROW}`).remove();
    }
  }

  // 记录已应用的根元素属性
  #appliedRootAttrs = {};

  /**
   * 应用根元素属性
   * @returns {void}
   */
  #applyRootElemAttrs() {
    const { options, $rootElem } = this;
    const applied = this.#appliedRootAttrs;

    // 排除根元素基础类名
    const className = options.className
      ?.split(/\s+/)
      .filter((cls) => cls && !ROOT_BASE_CLASS_SET.has(cls))
      .join(' ');

    // 清理旧的属性
    $rootElem.removeClass(applied.anim).removeClass(applied.className);

    // 添加弹出动画
    if (options.anim) {
      $rootElem.addClass((applied.anim = `lay-anim lay-anim-${options.anim}`));
    } else {
      applied.anim = null;
    }

    // 添加自定义类名
    if (className) {
      $rootElem.addClass((applied.className = className));
    } else {
      applied.className = null;
    }

    // 设置 style 属性
    $rootElem.attr('style', options.style);

    // 设置主题
    $rootElem.attr('data-theme', options.theme);
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

  /**
   * 获取中间件配置
   * @returns {Array} - 返回中间件配置数组
   */
  #getMiddleware() {
    const options = this.options;
    const floatingEl = this.$rootElem[0];
    const arrowEl = floatingEl.querySelector(`.${CONST.ELEM_ARROW}`);
    const showArrow = options.showArrow && arrowEl;
    let offset = options.offset;

    // 若开启箭头，则增加箭头的偏移量
    if (showArrow) {
      offset += arrowEl.offsetWidth / 2;
    }

    // 默认中间件配置
    const defaultMiddleware = [
      floating.offset(offset),
      floating.flip({ padding: offset }),
      floating.shift({ padding: offset }),
    ];

    // 执行中间件配置钩子
    const middlewareFromHook = this[popupHooks.kMiddlewares]?.({
      defaultMiddleware,
      offset,
    });

    let middleware = [...defaultMiddleware];

    // 若 middleware 选项值为数组，则替换默认中间件配置
    if (Array.isArray(middlewareFromHook)) {
      middleware = middlewareFromHook;
    }

    // 若开启箭头，且未包含 arrow 中间件，则自动追加
    if (showArrow) {
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

  /**
   * 事件处理
   */
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
          }, options.openDelay);
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
        this.delayClose();
      });
    }
  }

  /**
   * 点击层外部时的事件
   * @returns {void}
   */
  #onClickOutside() {
    const options = this.options;
    const isCtxMenu = options.trigger === 'contextmenu';
    const isTopElem = lay.isTopElem(options.$elem[0]);

    this.stopClickOutsideEvent();

    const stop = lay.onClickOutside(
      this.$rootElem[0],
      (e) => {
        const params = { e };

        // 执行内部 onClickOutside 钩子；返回 false 则阻止关闭
        const hookResult = this[popupHooks.kOnClickOutside]?.(params);

        if (hookResult === false) return;

        // 执行传入的 onClickOutside 回调；返回 false 则阻止关闭
        const callbackResult = options.onClickOutside?.({
          ...params,
          instance: this,
          options,
        });

        if (callbackResult === false) return;

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

// 根元素基础类名集合
const ROOT_BASE_CLASS_SET = new Set(CONST.ROOT_BASE_CLASS.split(/\s+/));

export { Popup as popup };
