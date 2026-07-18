/**
 * menu
 * 基础菜单
 */

import { lay } from '../core/lay.js';
import { $ } from 'jquery';
import { Component } from '../core/component.js';
import { popup } from './popup.js';

export class Menu extends Component {
  static componentName = 'menu';

  /**
   * 默认配置项
   * 同时支持 {@link Menu.generateMenu} 的 options
   */
  static options = {
    elem: '.lay-menu',
    size: 'md', // 菜单尺寸。可选值：sm|md|lg

    // 菜单模式。可选值: vertical|horizontal
    mode: 'vertical',

    // 子菜单的展示方式
    // mode 为 vertical 时的可选值:  inline|popup;
    // mode 为 horizontal 时固定为 popup 值
    submenuMode: 'inline',

    // 是否采用「手风琴模式」展开内联(inline)子菜单
    accordion: false,

    // 主题。可选值: light|dark
    theme: 'light',

    // 数据渲染的核心选项
    // target: null, // 插入的目标容器
    // data: null, // 菜单数据结构
  };

  static get CONST() {
    return {
      ...super.CONST,
      ELEM: 'lay-menu',
      ELEM_GROUP: 'lay-menu-group',
      ELEM_SUBMENU: 'lay-menu-submenu',
      ELEM_TITLE: 'lay-menu-title',
      ELEM_TITLE_TEXT: 'lay-menu-title-text',
      ELEM_TITLE_ARROW: 'lay-menu-title-arrow',
      ELEM_SUB: 'lay-menu-sub',
      ELEM_ITEM: 'lay-menu-item',
    };
  }

  // 实例方法静态委托
  static {
    this.delegateInstanceMethods([
      'expand',
      'collapse',
      'expandSubmenus',
      'collapseSubmenus',
    ]);
  }

  /**
   * 动态生成菜单
   * @param {Object} options - 组件配置项
   * @param {Array} options.data - 菜单数据结构
   * @param {Object} options.fieldNames - 字段名映射
   * @param {boolean} [options.expanded] - 是否默认展开内联子菜单 (仅垂直菜单有效)
   * @param {string} [options.size] - 菜单尺寸。可选值：sm|md|lg
   * @param {Function} [options.template] - 菜单标题模板函数
   * @param {Function} [options.beforeTitleRender] - 标题元素渲染前的钩子函数
   * @returns {jQuery|undefined} 返回菜单 jQuery 对象 或 undefined
   */
  static generateMenu(options) {
    const $menu = $('<ul class="lay-menu"></ul>');

    // 字段名映射
    const fieldNames = options.fieldNames || {
      title: 'title',
      children: 'children',
    };

    // 根据 data 递归生成菜单结构
    const buildMenuItems = ($menu, data, parentItem) => {
      data.forEach((item) => {
        const hasChildren = item[fieldNames.children]?.length;
        const template = item.template || options.template;

        // 是否展开
        const expanded = lay.hasOwn(item, 'expanded')
          ? item.expanded
          : options.expanded;

        // 菜单标题
        const title =
          typeof template === 'function'
            ? template.call(item, item)
            : lay.escape(item[fieldNames.title]);

        // 若无标题且无子级，则跳过该项
        if (!item.type && !title && !hasChildren) return;

        // 列表元素
        const $li = $('<li></li>');

        // 特殊类型项
        if (['-'].includes(item.type)) {
          // 分割线
          if (item.type === '-') {
            $li.addClass('lay-menu-divider');
          }
        } else {
          // 普通菜单项
          let $title = $(`<div></div>`);

          // 若为链接项
          if (lay.hasOwn(item, 'href')) {
            $title = $('<a></a>');
            $title.attr({
              href: item.href,
              target: item.target || '_self',
            });
          }

          // 标题元素渲染前的钩子
          $title =
            options.beforeTitleRender?.({
              $title,
              item,
              parentItem,
              hasChildren,
            }) || $title;

          // 菜单标题文本元素
          const $titleText = $(`<div class="${CONST.ELEM_TITLE_TEXT}"></div>`);

          // 禁用项
          if (item.disabled) {
            $li.addClass(CONST.CLASS_IS_DISABLED);
          }

          // 生成菜单标题元素
          $titleText.html(title);
          $title.addClass(CONST.ELEM_TITLE).append($titleText);
          $li.data('item', item).append($title);

          // 子菜单
          if (hasChildren) {
            const $sub = $(`<ul class="${CONST.ELEM_SUB}"></ul>`);

            $li.addClass(CONST.ELEM_SUBMENU);

            // 展开状态
            if (expanded) {
              $li.addClass(CONST.CLASS_IS_EXPANDED);
            }

            // 生成子菜单
            const $subMenu = buildMenuItems(
              $sub,
              item[fieldNames.children],
              item,
            );
            $li.append($subMenu);
          } else {
            // 菜单项
            $li.addClass(CONST.ELEM_ITEM);
          }
        }

        // 插入列表
        $menu.append($li);
      });

      // 返回当前菜单列表容器
      return $menu;
    };

    // data 存在时，生成菜单结构
    if (options.data?.length) {
      this.#applyDataAttrs($menu, options);
      return buildMenuItems($menu, options.data);
    } else {
      return '';
    }
  }

  /**
   * 应用菜单 data-* 属性
   * @param {JQuery} $elem - 菜单元素
   * @param {Object} options - 菜单配置项
   * @returns {void}
   */
  static #applyDataAttrs($elem, options) {
    // 设置「菜单模式」属性
    if (['vertical', 'horizontal'].includes(options.mode)) {
      $elem.attr('data-mode', options.mode);
    }

    // 设置「子菜单展示方式」属性
    if (['inline', 'popup'].includes(options.submenuMode)) {
      $elem.attr('data-submenu-mode', options.submenuMode);
    }

    // 设置尺寸属性
    if (['sm', 'md', 'lg'].includes(options.size)) {
      $elem.attr('data-size', options.size);
    }

    // 设置主题属性
    if (['light', 'dark'].includes(options.theme)) {
      $elem.attr('data-theme', options.theme);
    }
  }

  // 构造函数
  constructor(options) {
    super(options);

    // 若指定了 target，则视为数据渲染，需置空 elem 默认配置
    if (this.options.target) {
      Object.assign(this.options, {
        $target: $(this.options.target),
        elem: null,
      });
    }
  }

  /**
   * 渲染
   */
  render() {
    const options = this.options;

    // 规范化选项
    if (options.mode === 'horizontal') {
      // 水平菜单模式，子菜单展示方式固定为 popup 模式
      options.submenuMode = 'popup';
    }

    // 销毁旧的 Popup 实例链
    this.#destroyPopupChain();

    // 初始化 Popup 实例链所有权
    this.#ownsPopupChain =
      options.submenuMode === 'popup' && !options._popupContext;

    // 初始化 Popup 子菜单上下文
    this.#popupContext =
      options.submenuMode === 'popup'
        ? options._popupContext || {
            controller: createPopupChainController(),
            depth: 0,
          }
        : null;

    // 是否为数据渲染（WIP）
    if (options.data?.length) {
      const $menu = Menu.generateMenu(options);

      $menu.attr(CONST.ATTR_ID, options.id); // 添加已渲染的标记
      options.elem = options.$elem = $menu;
      options.$target?.html($menu);
    }

    this.#initView();
    this.#events();
  }

  /**
   * 展开菜单（待实现）
   * @returns {void}
   */
  expand() {}

  /**
   * 收起菜单（待实现）
   * @returns {void}
   */
  collapse() {}

  /**
   * 展开所有内联子菜单
   * @returns {void}
   */
  expandSubmenus() {
    this.options.$elem
      .find(`.${CONST.ELEM_SUBMENU}`)
      .addClass(CONST.CLASS_IS_EXPANDED);
  }

  /**
   * 折叠所有内联子菜单
   * @returns {void}
   */
  collapseSubmenus() {
    this.options.$elem
      .find(`.${CONST.ELEM_SUBMENU}`)
      .removeClass(CONST.CLASS_IS_EXPANDED);
  }

  /**
   * 重写 destroy 方法
   * @returns {void}
   */
  destroy() {
    this.#destroyPopupChain();
    super.destroy();
  }

  /**
   * 初始化菜单视图
   * @returns {void}
   */
  #initView() {
    const options = this.options;
    this.constructor.#applyDataAttrs(options.$elem, options);
    this.#initSubmenus();
  }

  /**
   * 初始化子菜单
   * @returns {void}
   */
  #initSubmenus() {
    const options = this.options;
    const $elem = options.$elem;

    $elem.find(`.${CONST.ELEM_SUBMENU}`).each((_, submenu) => {
      const $submenu = $(submenu);
      const $title = $submenu.children(`.${CONST.ELEM_TITLE}`);
      const $sub = $submenu.children(`.${CONST.ELEM_SUB}`);

      // 清空旧箭头
      $title.children(`.${CONST.ELEM_TITLE_ARROW}`).remove();

      // 若存在子菜单
      if ($sub.length && $sub.children().length) {
        // 添加箭头
        const $arrow = $(`<div class="${CONST.ELEM_TITLE_ARROW}"></div>`);
        $arrow.append(`<i class="lay-icon lay-icon-down"></i>`);
        $title.append($arrow);

        // 若子菜单展示方式为 popup
        if (options.submenuMode === 'popup' && this.#popupContext.depth === 0) {
          // 仅对「根级子菜单」预创建 Popup 子菜单
          const isRootSubmenu =
            $title.closest(`.${CONST.ELEM_SUB}`).length === 0;

          if (isRootSubmenu) {
            this.#createPopupSubmenu({
              $submenu,
              $title,
              $sub,
              isRootPopup: true,
            });
          }
        }
      }
    });
  }

  /**
   * 展开或折叠内联子菜单
   * @param {Element} currentTarget - 当前点击的菜单标题元素
   * @returns {void}
   */
  #toggleInlineSubmenu(currentTarget) {
    const options = this.options;
    const accordion = options.accordion;
    const $title = $(currentTarget);
    const $this = $title.parent(`.${CONST.ELEM_SUBMENU}`);
    const $children = $this.children(`.${CONST.ELEM_SUB}`);
    const ANIM_MS = 200;

    if (!$children.length) return;
    if (options.submenuMode !== 'inline') return;

    // 动画执行完成后的操作
    const animComplete = () => {
      // 清空临时 style，以适配外部样式的状态重置
      $children.css({ display: '' });
    };

    // 动画是否正在执行
    if ($children.is(':animated')) return;

    // 是否已展开
    const isExpanded = $this.hasClass(CONST.CLASS_IS_EXPANDED);

    // 切换展开状态类
    $this.toggleClass(CONST.CLASS_IS_EXPANDED, !isExpanded);

    // 折叠
    if (isExpanded) {
      $children.show().stop().slideUp(ANIM_MS, animComplete);
    } else {
      // 展开
      $children.hide().stop().slideDown(ANIM_MS, animComplete);
    }

    // 手风琴模式 --- 折叠兄弟展开项
    if (accordion && !isExpanded) {
      const $siblings = $this.siblings(`.${CONST.CLASS_IS_EXPANDED}`);
      $siblings.removeClass(CONST.CLASS_IS_EXPANDED);
      $siblings
        .children(`.${CONST.ELEM_SUB}`)
        .show()
        .stop()
        .slideUp(ANIM_MS, animComplete);
    }
  }

  // Popup 子菜单上下文
  #popupContext = null;

  // 根级 Popup 子菜单实例集合
  #rootPopupInstances = new Set();

  // 当前 Menu 实例是否拥有 Popup 实例链的所有权
  #ownsPopupChain = false;

  /**
   * 获取 Popup 子菜单的配置项
   * @param {jQuery} $content - Popup 子菜单的内容元素
   * @param {number} depth - 当前子菜单的深度
   * @returns {Object} - 返回子菜单的 options 对象
   */
  #getPopupChildMenuOptions(depth) {
    const options = this.options;

    // 构建子级菜单的基础配置
    const childOptions = {
      data: null,
      mode: 'vertical', // Popup 子菜单固定为垂直模式
      _popupContext: {
        // 复用 Popup 子菜单控制器
        controller: this.#popupContext.controller,
        depth: depth + 1, // 子菜单深度 +1
      },
    };

    // Popup 子菜单可从父菜单继承的配置项名称
    const POPUP_MENU_OPTION_KEYS = [
      'size',
      'submenuMode',
      'fieldNames',
      'template',
      'onClick',
      'beforeTitleRender',
    ];

    // 仅继承父级菜单显式声明的配置项
    POPUP_MENU_OPTION_KEYS.forEach((key) => {
      if (lay.hasOwn(options, key)) {
        childOptions[key] = options[key];
      }
    });

    return childOptions;
  }

  /**
   * 创建 Popup 子菜单
   * @param {Object} params - 参数对象
   * @param {JQuery} params.$submenu - 子菜单容器元素
   * @param {JQuery} params.$title - 子菜单标题元素
   * @param {JQuery} params.$sub - 子菜单列表容器元素
   * @param {boolean} [params.isRootPopup=false] - 是否为根级 Popup
   * @param {boolean} [params.defaultOpen=false] - 是否默认打开
   * @returns {Object} - 返回 Popup 实例
   */
  #createPopupSubmenu({
    $submenu,
    $title,
    $sub,
    isRootPopup = false,
    defaultOpen = false,
  }) {
    const options = this.options;
    const { controller, depth } = this.#popupContext;

    // 根据菜单模式设定弹出方位
    const placement =
      options.mode === 'horizontal' ? 'bottom-start' : 'right-start';

    // 克隆子菜单元素
    const $content = $sub.clone().attr('class', CONST.ELEM);

    // 创建子菜单 Popup 实例
    const popupInstance = popup.render({
      elem: $title,
      content: $content.prop('outerHTML'),
      trigger: 'mouseenter',
      placement,
      className: 'lay-menu-popup',
      onClickOutside: (e) => {
        // 点击 Popup 内部时，阻止其父级 Popup 触发「外部点击」引起的关闭
        return controller.containsPopup(e.target) ? false : undefined;
      },
      afterOpen: () => {
        // 给「子菜单容器」添加打开状态类
        $submenu.addClass(CONST.CLASS_IS_OPEN);

        // 将当前 Popup 实例注册到控制器
        controller.register(depth, popupInstance);

        // 渲染子菜单实例
        popupInstance.menuInstance = Menu.render({
          elem: popupInstance.$rootElem.find(`.${CONST.ELEM}`),
          ...this.#getPopupChildMenuOptions(depth),
        });

        // Popup 根元素鼠标移入移出
        popupInstance.$rootElem
          .on('mouseenter', () => {
            controller.onPopupEnter({ depth });
          })
          .on('mouseleave', () => {
            // 清除 Popup 默认的定时器
            clearTimeout(popupInstance.timer);

            controller.onPopupLeave({
              depth,
              delay: popupInstance.normalizedDelay().hide,
            });
          });
      },
      afterClose: () => {
        // 给「子菜单容器」移除打开状态类
        $submenu.removeClass(CONST.CLASS_IS_OPEN);

        // 销毁弹出的子级菜单实例
        popupInstance.menuInstance?.destroy();
        popupInstance.menuInstance = null;

        // 从控制器中注销当前深度的实例
        controller.unregister(depth, popupInstance);

        // 关闭非「根级 Popup」后，即销毁实例
        if (!isRootPopup) {
          popupInstance.destroy();
        }
      },
    });

    // 添加「根级 Popup」的实例集合
    if (isRootPopup) {
      this.#rootPopupInstances.add(popupInstance);
    }

    // 若 Popup 默认打开，则通过其 open 方法打开
    // 确保 `afterOpen` 中能正确读取 popupInstance
    if (defaultOpen) {
      popupInstance.open();
    }

    return popupInstance;
  }

  /**
   * 销毁根级 Menu 实例对应的 Popup 实例链
   * @returns {void}
   */
  #destroyPopupChain() {
    if (!this.#ownsPopupChain) return;

    const { controller } = this.#popupContext || {};
    const rootPopupInstances = this.#rootPopupInstances;

    controller.closeAll();

    rootPopupInstances.forEach((popupInstance) => {
      popupInstance.destroy();
    });

    rootPopupInstances.clear();
    this.#popupContext = null;
    this.#ownsPopupChain = false;
  }

  /**
   * 事件处理
   * @returns {void}
   */
  #events() {
    const options = this.options;
    const $elem = options.$elem;

    // 事件命名空间
    const eventNamespace = CONST.EVENT_NAMESPACE;
    const { controller, depth } = this.#popupContext || {};
    const SUBMENU_TITLE_SELECTOR = `.${CONST.ELEM_SUBMENU} > .${CONST.ELEM_TITLE}`;
    const ITEM_TITLE_SELECTOR = `.${CONST.ELEM_ITEM} > .${CONST.ELEM_TITLE}`;

    // 避免重复绑定事件
    $elem.off(eventNamespace);

    // 子菜单 inline 模式，点击标题切换展开状态
    if (options.submenuMode === 'inline') {
      $elem.on(`click${eventNamespace}`, SUBMENU_TITLE_SELECTOR, (e) => {
        this.#toggleInlineSubmenu(e.currentTarget);
      });
    }

    // 子菜单 popup 模式: 深层子菜单通过事件委托按需创建 Popup 实例
    if (options.submenuMode === 'popup' && depth > 0) {
      $elem.on(`mouseenter${eventNamespace}`, SUBMENU_TITLE_SELECTOR, (e) => {
        const $title = $(e.currentTarget);
        const $submenu = $title.parent(`.${CONST.ELEM_SUBMENU}`);
        const $sub = $submenu.children(`.${CONST.ELEM_SUB}`);
        const currentPopupInstance = controller.getInstance(depth);

        // 重新进入当前 Popup 分支，取消可能存在的延时关闭
        controller.onPopupEnter({ depth });

        // 当前标题对应的 Popup 已打开，无需创建
        if (currentPopupInstance?.options.$elem?.[0] === $title[0]) {
          return;
        }

        // 切换同级子菜单：关闭当前 depth 及其后代
        controller.closeFromDepth(depth);

        if (!$sub.length || !$sub.children().length) return;

        this.#createPopupSubmenu({
          $submenu,
          $title,
          $sub,
          defaultOpen: true,
        });
      });
    }

    // 菜单项点击选中
    $elem.on(`click${eventNamespace}`, ITEM_TITLE_SELECTOR, (e) => {
      const $currentTarget = $(e.currentTarget);
      const $item = $currentTarget.parent(`.${CONST.ELEM_ITEM}`);

      // 标注选中状态
      $elem
        .find(`.${CONST.CLASS_IS_ACTIVE}`)
        .removeClass(CONST.CLASS_IS_ACTIVE);
      $item.addClass(CONST.CLASS_IS_ACTIVE);

      // 触发 onClick 回调
      options.onClick?.({ $item, e });
    });
  }
}

const CONST = Menu.CONST;

/**
 * 创建 Popup 实例链控制器
 * 通过弹出的深度索引(depth)管理级联 Popup 的打开与关闭
 * @returns {Object} - 返回控制器对象
 */
const createPopupChainController = () => {
  const instances = [];
  let closeAllTimer = null;
  let closeDepthTimer = null;
  let pendingCloseDepth = null; // 待关闭的深度索引

  // 清理「从指定深度关闭」的定时任务
  const clearCloseFromDepth = () => {
    clearTimeout(closeDepthTimer);
    closeDepthTimer = null;
    pendingCloseDepth = null;
  };

  // 控制器
  const controller = {
    /**
     * 注册 Popup 实例
     * @param {number} depth - Popup 深度
     * @param {Object} popupInstance - Popup 实例
     * @returns {void}
     */
    register(depth, popupInstance) {
      controller.cancelCloseAll();

      // depth 对应的新实例注册后，关闭其可能存在的旧实例的后代 Popup
      controller.closeFromDepth(depth + 1);

      // 若已存在该深度的不同实例，则关闭它
      const current = instances[depth];
      if (current && current !== popupInstance) {
        current.close();
      }

      instances[depth] = popupInstance;
    },

    /**
     * 注销指定深度的 popup 实例
     * @param {number} depth -  Popup 深度
     * @param {Object} popupInstance - popup 实例
     * @returns {void}
     */
    unregister(depth, popupInstance) {
      if (instances[depth] === popupInstance) {
        instances[depth] = null;
      }

      // 清理实例链末尾连续的空位
      while (instances.length && !instances[instances.length - 1]) {
        instances.pop();
      }
    },

    /**
     * 处理 Popup 根元素的鼠标移入事件
     * @param {Object} params - 参数对象
     * @param {number} params.depth - Popup 深度
     * @returns {void}
     */
    onPopupEnter({ depth }) {
      controller.cancelCloseAll();
      controller.cancelCloseFromDepth(depth);
    },

    /**
     * 处理 Popup 根元素的鼠标移出事件
     * @param {Object} params - 参数对象
     * @param {number} params.depth - Popup 深度
     * @param {number} params.delay - 延迟关闭毫秒数
     * @returns {void}
     */
    onPopupLeave({ depth, delay }) {
      controller.delayCloseAll(delay);
      controller.delayCloseFromDepth(depth, delay);
    },

    /**
     * 判断目标元素是否位于当前 Popup 根元素链内
     * @param {Node|null} target - 目标元素
     * @returns {boolean}
     */
    containsPopup(target) {
      return instances.some((popupInstance) => {
        return popupInstance?.$rootElem?.[0]?.contains(target);
      });
    },

    /**
     * 获取目标元素所在的 Popup 深度
     * @param {Node|null} target - 目标元素
     * @returns {number} -  返回 Popup 深度；未命中则返回 -1
     */
    getPopupDepth(target) {
      return instances.findIndex((popupInstance) => {
        return popupInstance?.$rootElem?.[0]?.contains(target);
      });
    },

    /**
     * 获取指定深度的 Popup 实例
     * @param {number} depth - Popup 深度
     * @returns {Object|undefined}
     */
    getInstance(depth) {
      return instances[depth];
    },

    /**
     * 延时关闭所有 Popup 链
     * @param {number} delay - 延时毫秒数
     * @returns {void}
     */
    delayCloseAll(delay) {
      controller.cancelCloseAll();

      closeAllTimer = setTimeout(() => {
        controller.closeFromDepth(0);
      }, delay);
    },

    /**
     *  从指定深度开始延时关闭 Popup
     * @param {number} depth - 起始 Popup 深度
     * @param {number} delay - 延时毫秒数
     * @returns {void}
     */
    delayCloseFromDepth(depth, delay) {
      clearTimeout(closeDepthTimer);
      pendingCloseDepth = depth;

      closeDepthTimer = setTimeout(() => {
        controller.closeFromDepth(depth);
      }, delay);
    },

    /**
     * 从指定深度开始关闭 Popup
     * @param {number} depth - 起始 Popup 深度
     * @returns {void}
     */
    closeFromDepth(depth = 0) {
      clearCloseFromDepth();

      // 获取对应深度及更深的实例
      const closingInstances = instances.slice(depth).filter(Boolean).reverse();

      // 清理待关闭的实例槽位
      instances.length = depth;

      // 从最深层开始逐个关闭
      closingInstances.forEach((instance) => {
        instance.close();
      });
    },

    /**
     * 取消指定深度的 Popup 的延时关闭
     * @param {number} depth - Popup 深度
     * @returns {void}
     */
    cancelCloseFromDepth(depth) {
      // 只有在「当前深度」大于等于「待关闭的深度索引」时，才取消延时关闭
      // 如: 待关闭深度 `1+`，移入深度为 `1` 或更深的 Popup，应取消关闭
      const shouldCancel =
        pendingCloseDepth !== null && depth >= pendingCloseDepth;

      if (shouldCancel) {
        clearCloseFromDepth();
      }
    },

    /**
     * 立即关闭所有 Popup
     * @returns {void}
     */
    closeAll() {
      controller.cancelCloseAll();
      controller.closeFromDepth(0);
    },

    /**
     * 取消所有 Popup 链的延时关闭
     * @returns {void}
     */
    cancelCloseAll() {
      clearTimeout(closeAllTimer);
      closeAllTimer = null;
    },
  };

  return controller;
};

export { Menu as menu };
