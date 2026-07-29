/**
 * menu
 * 导航菜单
 */

import { lay } from '../core/lay.js';
import { $ } from 'jquery';
import { Component } from '../core/component.js';
import { popup } from './popup.js';

export class Menu extends Component {
  static componentName = 'menu';

  /**
   * 默认配置项
   * 同时支持 {@link Menu.generate} 的 options
   */
  static options = {
    // 菜单模式。可选值: vertical|horizontal
    mode: 'vertical',

    // 子菜单的展示方式
    // mode 为 vertical 时的可选值:  inline|popup;
    // mode 为 horizontal 时固定为 popup 值
    submenuMode: 'inline',

    // 是否采用「手风琴模式」展开内嵌(inline)子菜单
    accordion: false,

    // popup 子菜单延时打开和关闭的毫秒数
    submenuOpenDelay: 200,
    submenuCloseDelay: 300,

    // 根级 popup 子菜单的偏移量，单位 px
    popupOffset: 5,

    // 是否收起状态
    collapsed: false,

    // 默认图标元素。当收起模式时，若菜单项未指定图标，则使用该默认图标
    defaultIcon: '<i class="lay-icon lay-icon-file"></i>',

    // 菜单尺寸。可选值：sm|md|lg
    size: 'md',

    // 菜单主题。可选值: light|dark
    theme: 'light',

    // 子菜单主题。可选值: auto(自动跟随父菜单)|light|dark|
    submenuTheme: 'auto',

    // 数据渲染的核心选项
    // target: null, // 插入的目标容器
    // data: null, // 菜单数据结构
  };

  static get CONST() {
    return {
      ...super.CONST,
      ATTR_ITEM_INDEX: '__menu-popup-item-index',

      ELEM: 'lay-menu',
      ELEM_GROUP: 'lay-menu-group',
      ELEM_SUBMENU: 'lay-menu-submenu',
      ELEM_TITLE: 'lay-menu-title',
      ELEM_TITLE_ICON: 'lay-menu-title-icon',
      ELEM_TITLE_TEXT: 'lay-menu-title-text',
      ELEM_TITLE_ARROW: 'lay-menu-title-arrow',
      ELEM_SUB: 'lay-menu-sub',
      ELEM_ITEM: 'lay-menu-item',

      ELEM_CONTAINER: 'lay-menu-container',
      ELEM_POPUP: 'lay-menu-popup',
    };
  }

  // 实例方法静态委托
  static {
    this.delegateInstanceMethods([
      'refresh',
      'expand',
      'collapse',
      'expandSubmenus',
      'collapseSubmenus',
      'select',
    ]);
  }

  /**
   * 动态生成菜单
   * @param {Object} options - 组件配置项; 详见：{@link Menu.options}
   * @param {Array} options.data - 菜单数据结构
   * @param {Object} options.fieldNames - 字段名映射
   * @param {boolean} [options.submenuExpanded] - 是否默认展开内嵌子菜单 (仅垂直菜单有效)
   * @param {Function} [options.template] - 菜单标题模板函数
   * @param {Function} [options.beforeTitleRender] - 标题元素渲染前的钩子函数
   * @returns {jQuery|string} 返回菜单 jQuery 对象或空字符串
   */
  static generate(options) {
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

        // 子菜单是否默认展开
        const expanded = lay.hasOwn(item, 'expanded')
          ? item.expanded
          : options.submenuExpanded;

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
          if (lay.hasOwn(item, 'href') && !item.disabled) {
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

            // 添加展开状态类
            if (expanded && !item.disabled) {
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
    // 根据条件设置或移除属性
    const toggleDataAttr = (name, condition) => {
      if (condition) {
        $elem.attr(name, true);
      } else {
        $elem.removeAttr(name);
      }
    };

    // 设置「菜单模式」属性
    if (['vertical', 'horizontal'].includes(options.mode)) {
      $elem.attr('data-mode', options.mode);
    }

    // 设置「子菜单展示方式」属性
    if (['inline', 'popup'].includes(options.submenuMode)) {
      $elem.attr('data-submenu-mode', options.submenuMode);
    }

    // 设置「收起状态」属性
    toggleDataAttr('data-collapsed', options.collapsed);

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

    // 若指定了 target，则视为「数据渲染」意图，需先置空 elem
    if (this.options.target) {
      Object.assign(this.options, {
        $target: $(this.options.target),
        elem: null,
      });
    }
  }

  /**
   * 渲染
   * @returns {void}
   */
  render() {
    const options = this.options;

    this.#normalizeOptions();

    // 是否为数据渲染（WIP）
    if (options.data?.length) {
      const $menu = Menu.generate(options);

      $menu.attr(CONST.ATTR_ID, options.id); // 添加已渲染的标记
      options.elem = options.$elem = $menu;
      options.$target?.html($menu);
    }

    this.#initView();
  }

  /**
   * 刷新菜单视图
   * @returns {void}
   */
  refresh() {
    this.#normalizeOptions();
    this.#initView();
  }

  /**
   * 展开菜单
   * @returns {void}
   */
  expand() {
    const options = this.options;
    if (!options.collapsed) return;

    options.collapsed = false;
    this.#normalizeOptions();
    this.#initView({ initSubmenus: false });
  }

  /**
   * 收起菜单
   * @returns {void}
   */
  collapse() {
    const options = this.options;
    if (options.collapsed) return;

    options.collapsed = true;
    this.#normalizeOptions();
    this.#initView({ initSubmenus: false });
  }

  /**
   * 展开所有内嵌子菜单
   * @returns {void}
   */
  expandSubmenus() {
    this.options.$elem
      .find(`.${CONST.ELEM_SUBMENU}`)
      .addClass(CONST.CLASS_IS_EXPANDED);
  }

  /**
   * 折叠所有内嵌子菜单
   * @returns {void}
   */
  collapseSubmenus() {
    this.options.$elem
      .find(`.${CONST.ELEM_SUBMENU}`)
      .removeClass(CONST.CLASS_IS_EXPANDED);
  }

  /**
   * 根据条件选中首个匹配的菜单项
   * @param {Function} filter - 过滤函数，返回 true 的菜单项将被选中
   * @returns {boolean} 返回是否选中成功
   */
  select(filter) {
    let selected = false;

    if (typeof filter !== 'function') {
      return selected;
    }

    this.$menuItems.each((index, item) => {
      const $item = $(item);
      if (filter($item, index)) {
        const disabled = $item.hasClass(CONST.CLASS_IS_DISABLED);
        if (!disabled) {
          activateMenuItem(this.options.$elem, $item);
          selected = true;
          return false; // 终止遍历
        }
      }
    });

    return selected;
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
   * 规范化选项
   * @returns {void}
   */
  #normalizeOptions() {
    const options = this.options;
    const originalOptions = this.#originalOptions;

    // 水平菜单模式，子菜单展示方式固定为 popup 模式
    if (options.mode === 'horizontal') {
      options.submenuMode = 'popup';
    } else {
      // 垂直菜单模式
      if (options.collapsed) {
        // 菜单收起，首次记录原始的 submenuMode 选项值，以便收起时恢复
        if (!lay.hasOwn(originalOptions, 'submenuMode')) {
          originalOptions.submenuMode = options.submenuMode;
        }
        // 再将 submenuMode 固定为 popup
        options.submenuMode = 'popup';
      } else {
        // 菜单展开，若 submenuMode 原始值存在，则恢复其原始值
        if (originalOptions.submenuMode) {
          options.submenuMode = originalOptions.submenuMode;
          delete originalOptions.submenuMode;
        }
      }
    }
  }

  // 用于记录部分原始选项，便于某些场景中恢复
  #originalOptions = {};

  /**
   * 初始化 Popup 实例链
   * @returns {void}
   */
  #initPopupChain() {
    const options = this.options;

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
            rootMenuInstance: this,
          }
        : null;
  }

  /**
   * 初始化菜单视图
   * @returns {void}
   */
  #initView({ initSubmenus = true } = {}) {
    const options = this.options;
    const $elem = options.$elem;

    this.#initPopupChain();

    Menu.#applyDataAttrs($elem, options);
    this.#initTitles();
    if (initSubmenus) {
      this.#initSubmenus();
    }

    this.$menuItems = $elem.find(`.${CONST.ELEM_ITEM}`);
    this.#events();
  }

  /**
   * 初始化菜单标题装饰型元素
   * @returns {void}
   */
  #initTitles() {
    const options = this.options;
    const $elem = options.$elem;

    // 初始化默认标题图标
    const initDefaultTitleIcons = ($title) => {
      const $titleIcon = $title.children(`.${CONST.ELEM_TITLE_ICON}`);

      // 若图标不存在，则初始化默认图标
      if (!$titleIcon.length) {
        const $defaultTitleIcon = $(
          `<div class="${CONST.ELEM_TITLE_ICON}" data-default></div>`,
        );
        const $defaultIcon = $(options.defaultIcon);
        $defaultTitleIcon.append($defaultIcon);
        $title.prepend($defaultTitleIcon);
      }
    };

    // 收起模式
    if (options.collapsed) {
      $elem.find(`.${CONST.ELEM_TITLE}`).each((_, title) => {
        const $title = $(title);
        initDefaultTitleIcons($title);
      });
    } else {
      // 展开模式
      // 清除收起模式下的默认图标
      $elem.find(`.${CONST.ELEM_TITLE_ICON}[data-default]`).remove();
    }
  }

  /**
   * 初始化子菜单装饰型元素
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
      }
    });
  }

  /**
   * 获取子菜单元素
   * @param {jQuery} $title - 子菜单标题元素
   * @returns {Object} - 返回包含子菜单元素的对象
   */
  #getSubmenu($title) {
    const $submenu = $title.parent(`.${CONST.ELEM_SUBMENU}`);
    const $sub = $submenu.children(`.${CONST.ELEM_SUB}`);
    return { $submenu, $sub };
  }

  /**
   * 展开或折叠内嵌子菜单
   * @param {Element} currentTarget - 当前点击的菜单标题元素
   * @returns {void}
   */
  #toggleInlineSubmenu(currentTarget) {
    const options = this.options;
    const accordion = options.accordion;
    const $title = $(currentTarget);
    const { $submenu, $sub } = this.#getSubmenu($title);
    const ANIM_MS = 200;

    if (
      !$sub.length ||
      options.submenuMode !== 'inline' ||
      $submenu.hasClass(CONST.CLASS_IS_DISABLED)
    )
      return;

    // 动画执行完成后的操作
    const animComplete = function () {
      // 清空临时 style，以适配外部样式的状态重置
      $(this).css({ display: '' });
    };

    // 动画是否正在执行
    if ($sub.is(':animated')) return;

    // 是否已展开
    const isExpanded = $submenu.hasClass(CONST.CLASS_IS_EXPANDED);

    // 切换展开状态类
    $submenu.toggleClass(CONST.CLASS_IS_EXPANDED, !isExpanded);

    // 折叠
    if (isExpanded) {
      $sub.show().stop().slideUp(ANIM_MS, animComplete);
    } else {
      // 展开
      $sub.hide().stop().slideDown(ANIM_MS, animComplete);
    }

    // 手风琴模式 --- 折叠兄弟展开项
    if (accordion && !isExpanded) {
      const $siblings = $submenu.siblings(`.${CONST.CLASS_IS_EXPANDED}`);
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

  // 当前 Menu 实例是否拥有 Popup 实例链的所有权
  #ownsPopupChain = false;

  // 当前由 Menu 根级菜单触发的 Popup 实例
  #currentRootPopupInstance = null;

  /**
   * 获取 Popup 子菜单的配置项
   * @param {number} depth - 当前子菜单的深度
   * @returns {Object} 返回子菜单的 options 对象
   */
  #getPopupChildMenuOptions(depth) {
    const options = this.options;

    // 构建子级菜单的基础配置
    const childOptions = {
      data: null,
      mode: 'vertical', // Popup 子菜单固定为垂直模式
      theme: options.submenuTheme,
      _popupContext: {
        ...this.#popupContext, // 继承父级 Popup 上下文
        depth: depth + 1, // 子菜单深度 +1
      },
    };

    // 若子菜单主题为 auto 模式
    if (options.submenuTheme === 'auto') {
      childOptions.theme = options.theme; // 继承父级菜单主题
    }

    // Popup 子菜单可从父菜单继承的配置项名称
    const POPUP_MENU_OPTION_KEYS = [
      'submenuMode',
      'submenuTheme',
      'submenuOpenDelay',
      'submenuCloseDelay',
      'size',
      'fieldNames',
      'template',
      'beforeTitleRender',
      'onClick',
      'beforeSubmenuOpen',
      'afterSubmenuOpen',
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
   * @returns {Object} - 返回 Popup 实例
   */
  #createPopupSubmenu({ $submenu, $title, $sub }) {
    const options = this.options;
    const { controller, depth, rootMenuInstance } = this.#popupContext;

    // 根据菜单模式设定弹出方位
    const placement =
      options.mode === 'horizontal' ? 'bottom-start' : 'right-start';

    // 克隆子菜单元素
    const $subClone = $sub.clone(true).attr('class', CONST.ELEM);

    // 非默认尺寸，预设 data-size 属性
    if (options.size !== 'md') {
      $subClone.attr('data-size', options.size);
    }

    // 菜单容器
    const $content = $(`<div class="${CONST.ELEM_CONTAINER}"></div>`);
    $content.append($subClone);

    // 创建子菜单 Popup 实例
    const popupInstance = popup.render({
      elem: $title,
      content: $content,
      trigger: 'mouseenter',
      placement,
      offset: options.popupOffset,
      className: CONST.ELEM_POPUP,
      onClickOutside: ({ e }) => {
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
            controller.onPopupLeave({
              depth: 0, // 所有 Popup 都进入待关闭状态
              closeDelay: options.submenuCloseDelay,
            });
          });

        // 子菜单打开后的钩子
        options.afterSubmenuOpen?.(params);
      },
      afterClose: () => {
        // 给「子菜单容器」移除打开状态类
        $submenu.removeClass(CONST.CLASS_IS_OPEN);

        // 移除根级菜单项临时索引
        if (depth === 0) {
          $sub.find(`.${CONST.ELEM_ITEM}`).removeAttr(CONST.ATTR_ITEM_INDEX);
          this.#currentRootPopupInstance = null;
        }

        // 销毁弹出的子级菜单实例
        popupInstance.menuInstance?.destroy();
        popupInstance.menuInstance = null;

        // 从控制器中注销当前深度的实例
        controller.unregister(depth, popupInstance);

        // 销毁 Popup 实例
        popupInstance.destroy();
      },
    });

    // 根级子菜单
    if (depth === 0) {
      this.#currentRootPopupInstance?.close();
      this.#currentRootPopupInstance = popupInstance;
    }

    // 钩子函数返回的参数
    const params = {
      $submenu,
      $title,
      $sub,
      popupInstance,
      options: rootMenuInstance.options,
    };

    // 子菜单打开前的钩子
    options.beforeSubmenuOpen?.(params);

    // 通过方法打开，确保 `afterOpen` 中能正确读取 popupInstance
    popupInstance.open();

    return popupInstance;
  }

  /**
   * 销毁 Popup 实例链
   * @returns {void}
   */
  #destroyPopupChain() {
    this.#clearOpenPopupTimer();
    this.#currentRootPopupInstance?.close();
    this.#currentRootPopupInstance = null;

    // 当前实例是否具有销毁 Popup 实例链权限
    if (!this.#ownsPopupChain) return;

    this.#popupContext?.controller?.closeAll();
    this.#popupContext = null;
    this.#ownsPopupChain = false;
  }

  /**
   * 清除延时打开 Popup 的定时器
   * @returns {void}
   */
  #clearOpenPopupTimer() {
    clearTimeout(this.openPopupTimer);
    this.openPopupTimer = null;
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
    const SUBMENU_TITLE_SELECTOR = `.${CONST.ELEM_SUBMENU} > .${CONST.ELEM_TITLE}`;
    const ITEM_TITLE_SELECTOR = `.${CONST.ELEM_ITEM} > .${CONST.ELEM_TITLE}`;
    const { controller, depth, rootMenuInstance } = this.#popupContext || {};

    // 避免重复绑定事件
    $elem.off(eventNamespace);

    // 子菜单 inline 模式
    if (options.submenuMode === 'inline') {
      // 点击标题切换展开状态
      $elem.on(`click${eventNamespace}`, SUBMENU_TITLE_SELECTOR, (e) => {
        this.#toggleInlineSubmenu(e.currentTarget);
      });
    }

    // 子菜单 popup 模式
    if (options.submenuMode === 'popup') {
      // 子菜单通过 mouseenter 事件委托按需创建 Popup 实例
      $elem
        .on(`mouseenter${eventNamespace}`, SUBMENU_TITLE_SELECTOR, (e) => {
          const $title = $(e.currentTarget);
          const { $submenu, $sub } = this.#getSubmenu($title);

          // 若子菜单被禁用，则不进行任何操作
          if ($submenu.hasClass(CONST.CLASS_IS_DISABLED)) {
            return;
          }

          // 获取当前深度的 Popup 实例
          const currentPopupInstance = controller.getInstance(depth);

          controller.onPopupEnter({ depth });
          e.stopPropagation(); // 阻止事件向 Popup 根元素冒泡

          // 若「当前子菜单已打开」或「不存在子菜单」，则无需创建
          if (
            currentPopupInstance?.options.$elem?.[0] === $title[0] ||
            !($sub.length && $sub.children().length)
          ) {
            return;
          }

          // 延时创建 Popup 子菜单，避免频繁触发
          this.#clearOpenPopupTimer();
          this.openPopupTimer = setTimeout(() => {
            // 根级子菜单
            if (depth === 0) {
              // 创建菜单项临时索引，便于匹配
              $sub.find(`.${CONST.ELEM_ITEM}`).each((index, item) => {
                const $item = $(item);
                $item.attr(CONST.ATTR_ITEM_INDEX, index);
              });
            }

            // 创建 Popup 子菜单
            this.#createPopupSubmenu({ $submenu, $title, $sub });
          }, options.submenuOpenDelay);
        })
        .on(`mouseleave${eventNamespace}`, SUBMENU_TITLE_SELECTOR, () => {
          this.#clearOpenPopupTimer();

          controller.onPopupLeave({
            depth, // 当前深度及其后代 Popup 进入待关闭状态
            closeDelay: options.submenuCloseDelay,
          });
        });

      // 收起模式，鼠标移入菜单标题，显示 Tooltip
      if (options.collapsed) {
        $elem.on(
          `mouseenter${eventNamespace}`,
          `${ITEM_TITLE_SELECTOR}, .${CONST.ELEM_GROUP} > .${CONST.ELEM_TITLE}`,
          (e) => {
            const $title = $(e.currentTarget);
            const $titleText = $title.children(`.${CONST.ELEM_TITLE_TEXT}`);

            this.#currentRootPopupInstance?.close();
            this.#currentRootPopupInstance = popup.tooltip({
              elem: $title,
              content: $titleText.text(),
              placement: 'right',
              theme: options.theme,
              defaultOpen: true,
              afterClose: ({ instance }) => {
                // 关闭后销毁 Tooltip 层实例
                instance.destroy();
                this.#currentRootPopupInstance = null;
              },
            });
          },
        );
      }
    }

    // 菜单项点击选中
    $elem.on(`click${eventNamespace}`, ITEM_TITLE_SELECTOR, (e) => {
      const $title = $(e.currentTarget);
      const $item = $title.parent(`.${CONST.ELEM_ITEM}`);

      if ($item.hasClass(CONST.CLASS_IS_DISABLED)) return;

      // 标注选中状态
      activateMenuItem($elem, $item);

      // 触发 onClick 回调
      const clickResult = options.onClick?.({
        instance: this,
        options: rootMenuInstance ? rootMenuInstance.options : options,
        $item,
        e,
      });

      // 若为深层 Popup 菜单
      if (depth > 0) {
        const rootPopupInstance = controller.getInstance(0);
        const itemIndex = $item.attr(CONST.ATTR_ITEM_INDEX);

        if (rootPopupInstance) {
          const $rootTitle = rootPopupInstance.options.$elem;
          const { $sub: $rootSub } = this.#getSubmenu($rootTitle);

          // 同步根级菜单的选中状态
          activateMenuItem(
            rootMenuInstance.options.$elem,
            $rootSub.find(
              `.${CONST.ELEM_ITEM}[${CONST.ATTR_ITEM_INDEX}='${itemIndex}']`,
            ),
          );
        }

        // 点击后关闭所有 Popup
        if (clickResult !== false) {
          controller.closeAll();
        }
      }
    });
  }
}

const CONST = Menu.CONST;

/**
 * 给指定菜单项添加激活（选中）状态类
 * @param {JQuery} $elem - 目标菜单元素
 * @param {JQuery} $item - 待激活的菜单项元素
 * @returns {void}
 */
const activateMenuItem = ($elem, $item) => {
  const { CLASS_IS_ACTIVE } = CONST;
  $elem.find(`.${CLASS_IS_ACTIVE}`).removeClass(CLASS_IS_ACTIVE);
  $item.addClass(CLASS_IS_ACTIVE);
};

/**
 * 创建 Popup 实例链控制器
 * 通过弹出的深度索引(depth)管理级联 Popup 的打开与关闭
 * @returns {Object} - 返回控制器对象
 */
const createPopupChainController = () => {
  const instances = [];
  let closePopupTimer = null;

  // 控制器
  const controller = {
    /**
     * 清除 Popup 内置的定时器
     * @returns {void}
     */
    clearDefaultPopupTimers() {
      instances.forEach((popupInstance) => {
        clearTimeout(popupInstance?.timer);
      });
    },

    /**
     * 清除 Popup 实例链的延时关闭
     * @returns {void}
     */
    clearClosePopupTimer() {
      clearTimeout(closePopupTimer);
      closePopupTimer = null;
    },

    /**
     * 注册 Popup 实例
     * @param {number} depth - Popup 深度
     * @param {Object} popupInstance - Popup 实例
     * @returns {void}
     */
    register(depth, popupInstance) {
      controller.clearDefaultPopupTimers();
      controller.clearClosePopupTimer();

      const currentPopupInstance = instances[depth];

      // 重复注册同一深度的 Popup 实例时，关闭其可能存在的后代
      if (currentPopupInstance === popupInstance) {
        controller.closeFromDepth(depth + 1);
        return;
      }

      // 添加新实例前，关闭可能存在的旧实例及其后代
      controller.closeFromDepth(depth);
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
      controller.clearDefaultPopupTimers();
      controller.clearClosePopupTimer();

      // 关闭当前 depth 可能存在的后代
      controller.closeFromDepth(depth + 1);
    },

    /**
     * 处理 Popup 根元素的鼠标移出事件
     * @param {Object} params - 参数对象
     * @param {number} params.depth - Popup 深度
     * @param {number} params.closeDelay - 延迟关闭毫秒数
     * @returns {void}
     */
    onPopupLeave({ depth, closeDelay }) {
      controller.clearDefaultPopupTimers();
      controller.delayCloseFromDepth(depth, closeDelay);
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
     * 获取指定深度的 Popup 实例
     * @param {number} depth - Popup 深度
     * @returns {Object|undefined}
     */
    getInstance(depth) {
      return instances[depth];
    },

    /**
     * 从指定深度开始关闭 Popup
     * @param {number} depth - 起始 Popup 深度
     * @returns {void}
     */
    closeFromDepth(depth = 0) {
      // 获取对应深度及更深的实例
      const closingInstances = instances.slice(depth).filter(Boolean).reverse();

      // 清理待关闭的实例槽位
      instances.length = depth;

      // 从最深层开始逐个关闭
      closingInstances.forEach((popupInstance) => {
        popupInstance.close();
      });
    },

    /**
     * 立即关闭所有 Popup
     * @returns {void}
     */
    closeAll() {
      controller.clearClosePopupTimer();
      controller.closeFromDepth(0);
    },

    /**
     * 从指定深度开始延时关闭 Popup
     * @param {number} depth - Popup 深度
     * @param {number} closeDelay - 延迟关闭毫秒数
     * @returns {void}
     */
    delayCloseFromDepth(depth, closeDelay) {
      controller.clearClosePopupTimer();

      closePopupTimer = setTimeout(() => {
        controller.closeFromDepth(depth);
      }, closeDelay);
    },
  };

  return controller;
};

export { Menu as menu };
