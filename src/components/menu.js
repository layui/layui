/**
 * menu
 * 基础菜单
 */

import { lay } from '../core/lay.js';
import { $ } from 'jquery';
import { Component } from '../core/component.js';
// import { popup, popupHooks } from './popup.js';

class Menu extends Component {
  static componentName = 'menu';

  // 默认配置项
  static options = {
    elem: '.lay-menu',
    size: 'md', // 菜单尺寸。可选值：sm|md|lg
    mode: 'vertical', // 菜单模式。可选值：vertical|horizontal(待补充，以平替 nav)
    submenuMode: 'inline', // 子菜单的展示方式。可选值：inline|popup
    accordion: false, // 是否采用「手风琴模式」展开子菜单
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
    this.delegateInstanceMethods(['expandAll', 'collapseAll']);
  }

  /**
   * 动态生成菜单
   * @param {Object} options - 组件配置项
   * @param {Array} options.data - 菜单数据结构
   * @param {Object} options.fieldNames - 字段名映射
   * @param {Function} [options.template] - 菜单标题模板函数
   * @param {boolean} [options.expanded] - 是否默认展开子菜单
   * @param {string} [options.size] - 菜单尺寸。可选值：sm|md|lg
   * @returns {jQuery|undefined} 返回菜单 jQuery 对象 或 undefined
   */
  static generateMenu(options) {
    const $menu = $('<ul class="lay-menu"></ul>');

    // 字段名映射
    const fieldNames = options.fieldNames || {
      id: 'id',
      title: 'title',
      children: 'children',
    };

    // 根据 data 递归生成菜单结构
    const buildMenuItems = ($menu, data) => {
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
          // 横线
          if (item.type === '-') {
            $li.addClass('lay-menu-hr');
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
            $li.append(buildMenuItems($sub, item[fieldNames.children]));
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

    // 添加尺寸属性
    if (['sm', 'md', 'lg'].includes(options.size)) {
      $menu.attr('data-size', options.size);
    }

    // data 存在时，生成菜单结构
    if (options.data?.length) {
      return buildMenuItems($menu, options.data);
    } else {
      return;
    }
  }

  // 渲染
  render() {
    const options = this.options;
    const $elem = options.$elem;

    // 添加「菜单模式」属性
    if (['vertical', 'horizontal'].includes(options.mode)) {
      $elem.attr('data-mode', options.mode);
    }

    // 添加「子菜单展示方式」属性
    if (['inline', 'popup'].includes(options.submenuMode)) {
      $elem.attr('data-submenu-mode', options.submenuMode);
    }

    // 添加尺寸属性
    if (['sm', 'md', 'lg'].includes(options.size)) {
      $elem.attr('data-size', options.size);
    }

    // 初始化状态
    $elem.find(`.${CONST.ELEM_SUBMENU}`).each((_, submenu) => {
      const $submenu = $(submenu);
      const $title = $submenu.children(`.${CONST.ELEM_TITLE}`);
      const $children = $submenu.children(`.${CONST.ELEM_SUB}`);

      // 清空旧状态
      $title.children(`.${CONST.ELEM_TITLE_ARROW}`).remove();

      // 添加箭头
      if ($children.length) {
        const $arrow = $(`<div class="${CONST.ELEM_TITLE_ARROW}"></div>`);
        $arrow.append(`<i class="lay-icon lay-icon-down"></i>`);
        $title.append($arrow);
      }
    });

    this.#events();
  }

  /**
   * 全部展开
   * @returns {void}
   */
  expandAll() {
    const options = this.options;
    const $elem = options.$elem;
    $elem.find(`.${CONST.ELEM_SUBMENU}`).addClass(CONST.CLASS_IS_EXPANDED);
  }

  /**
   * 全部折叠
   * @returns {void}
   */
  collapseAll() {
    const options = this.options;
    const $elem = options.$elem;
    $elem.find(`.${CONST.ELEM_SUBMENU}`).removeClass(CONST.CLASS_IS_EXPANDED);
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

  // 事件
  #events() {
    const options = this.options;
    const $elem = options.$elem;

    // 事件命名空间
    const eventNamespace = CONST.EVENT_NAMESPACE;

    // 避免重复绑定事件
    $elem.off(eventNamespace);

    // 点击子菜单
    if (options.submenuMode === 'inline') {
      $elem.on(
        `click${eventNamespace}`,
        `.${CONST.ELEM_SUBMENU} > .${CONST.ELEM_TITLE}`,
        (e) => {
          this.#toggleInlineSubmenu(e.currentTarget);
        },
      );
    }

    // 点击菜单项
    $elem.on(
      `click${eventNamespace}`,
      `.${CONST.ELEM_ITEM} > .${CONST.ELEM_TITLE}`,
      (e) => {
        const $currentTarget = $(e.currentTarget);
        const $item = $currentTarget.parent(`.${CONST.ELEM_ITEM}`);

        // 标注选中状态
        $elem
          .find(`.${CONST.CLASS_IS_ACTIVE}`)
          .removeClass(CONST.CLASS_IS_ACTIVE);
        $item.addClass(CONST.CLASS_IS_ACTIVE);
      },
    );
  }
}

const CONST = Menu.CONST;

export { Menu as menu };
