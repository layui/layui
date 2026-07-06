/**
 * menu
 * 基础菜单
 */

import { lay } from '../core/lay.js';
import { $ } from 'jquery';

const CONST = {
  ELEM_ITEM_UP: 'lay-menu-item-up',
  ELEM_ITEM_DOWN: 'lay-menu-item-down',
  ELEM_MENU_TITLE: 'lay-menu-body-title',
  ELEM_ITEM_GROUP: 'lay-menu-item-group',
  ELEM_ITEM_PARENT: 'lay-menu-item-parent',
  ELEM_ITEM_DIV: 'lay-menu-item-divider',
  ELEM_ITEM_CHECKED: 'lay-menu-item-checked',
  ELEM_ITEM_CHECKED2: 'lay-menu-item-checked2',
  ELEM_MENU_PANEL: 'lay-menu-body-panel',
  ELEM_MENU_PANEL_L: 'lay-menu-body-panel-left',
  get ELEM_GROUP_TITLE() {
    return `.${this.ELEM_ITEM_GROUP}>.${this.ELEM_MENU_TITLE}`;
  },
};

export { CONST as menuConst };

/**
 * 设置菜单组展开和收缩状态
 * @param {JQuery} $groupElem - 菜单组标题元素的 jQuery 对象
 * @param {boolean} accordion - 是否为手风琴模式
 * @returns {void}
 */
export const toggleMenuGroup = ($groupElem, accordion) => {
  const $contentElem = $groupElem.children('ul');
  const needSpread = $groupElem.hasClass(CONST.ELEM_ITEM_UP);
  const ANIM_MS = 200;

  // 动画执行完成后的操作
  const complete = function () {
    $(this).css({ display: '' }); // 剔除临时 style，以适配外部样式的状态重置;
  };

  // 动画是否正在执行
  if ($contentElem.is(':animated')) return;

  // 展开
  if (needSpread) {
    $groupElem.removeClass(CONST.ELEM_ITEM_UP).addClass(CONST.ELEM_ITEM_DOWN);
    $contentElem.hide().stop().slideDown(ANIM_MS, complete);
  } else {
    // 收缩
    $contentElem.stop().slideUp(ANIM_MS, complete);
    $groupElem.removeClass(CONST.ELEM_ITEM_DOWN).addClass(CONST.ELEM_ITEM_UP);
  }

  // 手风琴
  if (needSpread && accordion) {
    const $groupSibs = $groupElem.siblings(`.${CONST.ELEM_ITEM_DOWN}`);
    $groupSibs.children('ul').stop().slideUp(ANIM_MS, complete);
    $groupSibs.removeClass(CONST.ELEM_ITEM_DOWN).addClass(CONST.ELEM_ITEM_UP);
  }
};

// 全局事件
(() => {
  const $win = $(window);
  const $doc = $(document);

  // 基础菜单的静态元素事件
  const ELEM_LI = '.lay-menu:not(.lay-dropdown-menu) li';
  $doc.on('click', ELEM_LI, function () {
    const $this = $(this);
    const $parent = $this.parents('.lay-menu').eq(0);
    const isChild =
      $this.hasClass(CONST.ELEM_ITEM_GROUP) ||
      $this.hasClass(CONST.ELEM_ITEM_PARENT);
    const filter = $parent.attr('lay-filter') || $parent.attr('id');
    const options = lay.options(this);

    // 非触发元素
    if ($this.hasClass(CONST.ELEM_ITEM_DIV)) return;

    // 非菜单组
    if (!isChild) {
      // 选中
      $parent
        .find(`.${CONST.ELEM_ITEM_CHECKED}`)
        .removeClass(CONST.ELEM_ITEM_CHECKED); // 清除选中样式
      $parent
        .find(`.${CONST.ELEM_ITEM_CHECKED2}`)
        .removeClass(CONST.ELEM_ITEM_CHECKED2); // 清除父级菜单选中样式
      $this.addClass(CONST.ELEM_ITEM_CHECKED); // 添加选中样式
      $this
        .parents(`.${CONST.ELEM_ITEM_PARENT}`)
        .addClass(CONST.ELEM_ITEM_CHECKED2); // 添加父级菜单选中样式

      options.title =
        options.title ||
        $this.children(`.${CONST.ELEM_MENU_TITLE}`).text().trim();

      // 触发事件
      lay.event.call(this, 'menu', `click(${filter})`, options);
    }
  });

  // 基础菜单的展开收缩事件
  $doc.on('click', `${ELEM_LI}${CONST.ELEM_GROUP_TITLE}`, function () {
    const $this = $(this);
    const $elemGroup = $this.parents(`.${CONST.ELEM_ITEM_GROUP}:eq(0)`);
    const options = lay.options($elemGroup[0]);
    const accordion =
      typeof $this.parents('.lay-menu').eq(0).attr('lay-accordion') ===
      'string';

    if ('allowExpand' in options ? options.allowExpand : true) {
      toggleMenuGroup($elemGroup, accordion);
    }
  });

  // 判断子级菜单是否超出屏幕
  const ELEM_LI_PAR = `.lay-menu .${CONST.ELEM_ITEM_PARENT}`;
  $doc
    .on('mouseenter', ELEM_LI_PAR, function () {
      const $this = $(this);
      const $elemPanel = $this.find(`.${CONST.ELEM_MENU_PANEL}`);

      if (!$elemPanel[0]) return;
      let rect = $elemPanel[0].getBoundingClientRect();

      // 是否超出右侧屏幕
      if (rect.right > $win.width()) {
        $elemPanel.addClass(CONST.ELEM_MENU_PANEL_L);
        // 不允许超出左侧屏幕
        rect = $elemPanel[0].getBoundingClientRect();
        if (rect.left < 0) {
          $elemPanel.removeClass(CONST.ELEM_MENU_PANEL_L);
        }
      }

      // 是否超出底部屏幕
      if (rect.bottom > $win.height()) {
        $elemPanel.eq(0).css('margin-top', -(rect.bottom - $win.height() + 5));
      }
    })
    .on('mouseleave', ELEM_LI_PAR, function () {
      const $this = $(this);
      const $elemPanel = $this.children(`.${CONST.ELEM_MENU_PANEL}`);

      $elemPanel.removeClass(CONST.ELEM_MENU_PANEL_L);
      $elemPanel.css('margin-top', 0);
    });
})();
