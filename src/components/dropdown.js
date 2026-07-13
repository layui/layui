/**
 * dropdown
 * 下拉菜单
 */

import { i18n } from '../core/i18n.js';
import { $ } from 'jquery';
import { Popup, popupHooks, clickOrMousedown, floating } from './popup.js';
import { menu } from './menu.js';

export class Dropdown extends Popup {
  static componentName = 'dropdown';

  // 默认配置项
  static options = {
    ...super.options, // 继承 popup 默认配置项

    // 弹出方位。可选值见 Popup.options.placement
    placement: 'bottom-start',

    // 是否自适应高度。开启后，将限制下拉菜单高度不超出可视区域，并自动出现纵向滚动条
    autoFitHeight: false,

    data: [], // 菜单数据结构
    expanded: false, // 是否初始展开所有子菜单

    // menu 组件相关选项
    submenuMode: 'inline', // 子菜单的展示方式。可选值见 Menu.options.submenuMode
    size: 'md', // 菜单尺寸。可选值见 Menu.options.size

    // data 必选字段名映射
    fieldNames: {
      title: 'title',
      children: 'children',
    },
  };

  static get CONST() {
    return {
      ...super.CONST,
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

    // 空数据处理
    if (!$menu) {
      $menu = $('<div>');
      $menu.addClass(CONST.CLASS_IS_EMPTY).text(i18n.$t('dropdown.empty'));
    }

    // 面板内容
    options.content = $menu;

    // 添加组件专属 className
    $rootElem.addClass(CONST.ELEM);

    // 阻止全局事件
    $rootElem.on(clickOrMousedown, `.${menu.CONST.ELEM}`, (e) => {
      e.stopPropagation();
    });

    // 点击菜单项
    $rootElem.on('click', `.${menu.CONST.ELEM_ITEM}`, (e) => {
      const $this = $(e.currentTarget);
      const data = $this.data('item') || {};

      if (data.disabled) return;

      // 触发 onClick 回调
      const clickResult = options.onClick?.({ data, e });

      // 若返回 false 则阻止后续操作
      if (clickResult === false) return;

      // 关闭下拉菜单
      this.close();
    });
  }

  // 打开后的内部钩子
  [popupHooks.kAfterOpen]() {
    const options = this.options;

    // 渲染 menu 组件
    menu.render({
      ...options,
      elem: this.$rootElem.find(`.${menu.CONST.ELEM}`),
      mode: 'vertical',
      submenuMode: options.submenuMode,
      size: options.size,
      accordion: options.accordion,
    });
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
