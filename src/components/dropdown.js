/**
 * dropdown
 * 下拉菜单
 */

import { i18n } from '../core/i18n.js';
import { $ } from 'jquery';
import { Popup, popupHooks, floating } from './popup.js';
import { menu } from './menu.js';

export class Dropdown extends Popup {
  static componentName = 'dropdown';

  /**
   * 默认配置项
   * 可继承 {@link Popup.options} / {@link menu.options}
   */
  static options = {
    ...super.options,

    // popup 组件相关选项
    placement: 'bottom-start', // 弹出方位
    anim: 'downbit', // 弹出动画

    // menu 组件相关选项
    submenuMode: 'popup', // 子菜单的展示方式
    size: 'md', // 菜单尺寸

    // 是否自适应高度。开启后，将限制下拉菜单高度不超出可视区域，并自动出现纵向滚动条
    autoFitHeight: false,

    data: [], // 菜单数据结构
    expanded: false, // 是否初始展开所有子菜单
  };

  static get CONST() {
    return {
      ...super.CONST,
      DATA_DROPDOWN_ID: 'data-dropdown-id',
      ELEM: 'lay-dropdown',
    };
  }

  /**
   * 仅重载数据
   * @param {string|number} id - 实例 id
   * @param {Object} options - 配置项；仅允许重载与数据相关的选项，如:
   * `data、template、content`，其他选项将被忽略
   * @param  {...any} args - 保留参数，为了同 {@link Component.reload} 的参数一致
   * @returns {*} 返回值同 {@link Component.reload}
   */
  static reloadData(id, options, ...args) {
    const opts = { ...options };
    const allowedReloadKeys = new Set(['data', 'template', 'content']);

    Object.keys(opts).forEach((key) => {
      if (!allowedReloadKeys.has(key)) {
        delete opts[key];
      }
    });

    Object.assign(opts, { _renderMode: 'updateContent' });
    return this.reload(id, opts, ...args);
  }

  // 打开前的内部钩子
  [popupHooks.kBeforeOpen]({ $rootElem }) {
    const options = this.options;

    // 获取菜单结构
    let $menu = menu.generateMenu({
      ...options,
      mode: 'vertical', // 固定为垂直菜单
    });

    // 空状态
    if (!$menu) {
      $menu = $('<div>');
      $menu.addClass(CONST.CLASS_IS_EMPTY).text(i18n.$t('dropdown.empty'));
    }

    // 面板内容
    options.content = $menu;

    // 点击 Popup 子菜单时，阻止其父级 Popup 触发「外部点击」引起的关闭
    options.onClickOutside = (e) => {
      const MENU_POPUP_SELECTOR = `.lay-menu-popup[${CONST.DATA_DROPDOWN_ID}="${options.id}"]`;
      return $(e.target).closest(MENU_POPUP_SELECTOR).length
        ? false
        : undefined;
    };

    // 添加组件专属 className
    $rootElem.addClass(`${menu.CONST.ELEM_VERTICAL} ${CONST.ELEM}`);
  }

  // 打开后的内部钩子
  [popupHooks.kAfterOpen]() {
    const options = this.options;

    // 静态渲染 menu 组件
    this.menuInstance = menu.render({
      elem: this.$rootElem.find(`.${menu.CONST.ELEM}`),
      mode: 'vertical', // 固定为垂直菜单
      submenuMode: options.submenuMode,
      size: options.size,
      accordion: options.accordion,
      afterSubmenuOpen({ popupInstance }) {
        popupInstance.$rootElem.attr(CONST.DATA_DROPDOWN_ID, options.id);
      },
      onClick: ({ $item, e }) => {
        const data = $item.data('item') || {};

        if (data.disabled) return;

        // 触发 onClick 回调
        const clickResult = options.onClick?.({ data, e, $item, options });

        // 若返回 false 则阻止后续操作
        if (clickResult === false) return;

        // 关闭下拉菜单
        this.close();
      },
    });
  }

  // 关闭后的内部钩子
  [popupHooks.kAfterClose]() {
    // 销毁 menu 组件实例
    this.menuInstance?.destroy();
    this.menuInstance = null;
  }

  // Floating 中间件钩子
  [popupHooks.kMiddlewares]({ defaultMiddleware, padding }) {
    const options = this.options;

    // 若开启自适应高度，则启用 size 中间件
    if (options.autoFitHeight) {
      defaultMiddleware.push(
        floating.size({
          padding,
          apply({ availableHeight, elements }) {
            const { floating: floatingEl } = elements;

            // 当下拉菜单高度超出可视区域时，将高度限制在可视区域内，并出现纵向滚动条
            Object.assign(floatingEl.style, {
              maxHeight:
                availableHeight >= floatingEl.scrollHeight
                  ? ''
                  : `${Math.max(0, availableHeight)}px`,
              overflowY: 'auto',
            });
          },
        }),
      );
    } else {
      // 未开启 autoFitHeight，清除相关状态
      const floatingEl = this.$rootElem?.[0];
      if (floatingEl) {
        Object.assign(floatingEl.style, {
          maxHeight: '',
          overflowY: '',
        });
      }
    }
  }
}

const CONST = Dropdown.CONST;

export { Dropdown as dropdown };
