/**
 * dropdown
 * 下拉菜单
 */

import { lay } from '../core/lay.js';
import { i18n } from '../core/i18n.js';
import { $ } from 'jquery';
import { Popup, popupHooks, clickOrMousedown } from './popup.js';
import { menuConst, toggleMenuGroup } from './menu.js';

export class Dropdown extends Popup {
  static componentName = 'dropdown';

  // 默认配置项
  static options = {
    ...super.options, // 继承 popup 默认配置项

    data: [], // 菜单数据结构
    expanded: true, // 是否初始展开子菜单
    allowExpand: true, // 是否允许菜单组展开收缩

    // 是否开启菜单展开收缩的手风琴效果，仅菜单组生效
    // 基础菜单需在容器上追加 `lay-accordion` 属性
    // accordion: false,

    // 自定义 data 字段名
    customName: {
      id: 'id',
      title: 'title',
      children: 'children',
    },
  };

  static get CONST() {
    return {
      ...super.CONST,
      ELEM: 'lay-dropdown',
      ...menuConst,
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
    const customName = options.customName;

    // 默认菜单内容
    const getDefaultView = () => {
      const $elemUl = $('<ul class="lay-menu lay-dropdown-menu"></ul>');
      if (options.data?.length > 0) {
        eachItemView($elemUl, options.data);
      } else {
        $elemUl.html(
          `<li class="lay-menu-item-none">${i18n.$t('dropdown.noData')}</li>`,
        );
      }
      return $elemUl;
    };

    // 遍历菜单项
    const eachItemView = ($views, data) => {
      data.forEach((item) => {
        // 是否存在子级
        const isChild =
          item[customName.children] && item[customName.children].length > 0;
        const expanded = 'expanded' in item ? item.expanded : options.expanded;
        const title = ((titleValue) => {
          const template = item.template || options.template;
          if (typeof template === 'function') {
            titleValue = template.call(item, item);
          }
          return titleValue;
        })(lay.escape(item[customName.title]));

        // 初始类型
        const type = (() => {
          if (isChild) {
            item.type = item.type || 'parent';
          }
          if (item.type) {
            return (
              {
                group: 'group',
                parent: 'parent',
                '-': '-',
              }[item.type] || 'parent'
            );
          }
          return '';
        })();

        if (
          type !== '-' &&
          !item[customName.title] &&
          !item[customName.id] &&
          !isChild
        )
          return;

        // 列表元素
        const className = {
          group: `lay-menu-item-group${
            options.allowExpand
              ? expanded
                ? ' lay-menu-item-down'
                : ' lay-menu-item-up'
              : ''
          }`,
          parent: CONST.ELEM_ITEM_PARENT,
          '-': 'lay-menu-item-divider',
        };
        const liClass =
          isChild || type
            ? className[type]
            : item.disabled
              ? CONST.CLASS_DISABLED
              : '';
        const viewText = (() => {
          if (!('href' in item)) {
            return title;
          }

          const target = item.target || '_self';
          const $link = $('<a></a>')
            .attr({
              href: item.href,
              target,
            })
            .html(title);

          return $link.prop('outerHTML');
        })();
        const suffixIcon = (() => {
          if (type === 'parent') {
            return '<i class="lay-icon lay-icon-right"></i>';
          }

          if (type === 'group' && options.allowExpand) {
            return `<i class="lay-icon lay-icon-${expanded ? 'up' : 'down'}"></i>`;
          }

          return '';
        })();
        const titleHtml = `<div class="${CONST.ELEM_MENU_TITLE}">${viewText}${
          isChild ? suffixIcon : ''
        }</div>`;
        const $viewLi = $(`
          <li${liClass ? ` class="${liClass}"` : ''}>
            ${titleHtml}
          </li>
        `);

        $viewLi.data('item', item);

        // 子级区
        if (isChild) {
          const $elemPanel = $(
            '<div class="lay-panel lay-menu-body-panel"></div>',
          );
          const $elemUl = $('<ul></ul>');

          if (type === 'parent') {
            $elemPanel.append(eachItemView($elemUl, item[customName.children]));
            $viewLi.append($elemPanel);
          } else {
            $viewLi.append(eachItemView($elemUl, item[customName.children]));
          }
        }

        $views.append($viewLi);
      });
      return $views;
    };

    // 面板内容
    options.content = getDefaultView();

    // 添加组件专属 className
    $rootElem.addClass(CONST.ELEM);

    // 阻止全局事件
    $rootElem.on(clickOrMousedown, '.lay-menu', (e) => {
      e.stopPropagation();
    });

    // 触发菜单列表事件
    $rootElem.on('click', '.lay-menu li', (e) => {
      const $this = $(e.currentTarget);
      const data = $this.data('item') || {};
      const isChild =
        data[customName.children] && data[customName.children].length > 0;
      const isClickAllScope = options.clickScope === 'all'; // 是否所有父子菜单均触发点击事件

      if (data.disabled) return; // 菜单项禁用状态

      // 普通菜单项点击后的回调及关闭面板
      if ((!isChild || isClickAllScope) && data.type !== '-') {
        const ret =
          typeof options.click === 'function'
            ? options.click(data, $this, e)
            : null;

        ret === false || isChild || this.close();
        e.stopPropagation();
      }
    });

    // 触发菜单组展开收缩
    $rootElem.on('click', CONST.ELEM_GROUP_TITLE, (e) => {
      const $this = $(e.currentTarget);
      const $groupElem = $this.parent();
      const data = $groupElem.data('item') || {};

      if (data.type === 'group' && options.allowExpand) {
        toggleMenuGroup($groupElem, options.accordion);
      }
    });
  }
}

const CONST = Dropdown.CONST;

export { Dropdown as dropdown };
