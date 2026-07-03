/**
 * dropdown
 * 下拉菜单组件
 */

import { lay } from '../core/lay.js';
import { i18n } from '../core/i18n.js';
import { $ } from 'jquery';
import { Component } from '../core/component.js';

const device = lay.device();
const clickOrMousedown = device.mobile ? 'touchstart' : 'mousedown';

export class Dropdown extends Component {
  static componentName = 'dropdown';

  // 默认配置项
  static options = {
    trigger: 'click', // 事件类型
    data: [], // 菜单数据结构
    expanded: true, // 是否初始展开子菜单
    allowExpand: true, // 是否允许菜单组展开收缩
    closeOnClick: true, // 面板打开后，再次点击目标元素时是否关闭面板。行为取决于所使用的触发事件类型
    delay: [200, 300], // 延时显示或隐藏的毫秒数，若为 number 类型，则表示显示和隐藏的延迟时间相同，trigger 为 hover 时才生效
    // content: '', // 自定义菜单内容
    // className: '', // 自定义样式类名
    // style: '', // 设置面板 style 属性
    // defaultOpen: false, // 是否初始默认打开菜单面板
    // accordion: false, // 是否开启菜单展开收缩的手风琴效果，仅菜单组生效。基础菜单需在容器上追加 `lay-accordion` 属性。
    // shade: 0, // 遮罩

    // 自定义 data 字段名
    customName: {
      id: 'id',
      title: 'title',
      children: 'children',
    },
  };

  static get CONST() {
    const consts = {
      ...super.CONST,
      ELEM: 'lay-dropdown',
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
      ELEM_ELEM_SHADE: 'lay-dropdown-shade',
    };

    consts.ELEM_GROUP_TITLE = `.${consts.ELEM_ITEM_GROUP}>.${consts.ELEM_MENU_TITLE}`;

    return consts;
  }

  // 实例方法静态委托
  static {
    this.delegateInstanceMethods(['close', 'open']);
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

    Object.assign(opts, { _renderMode: 'reloadData' });
    return this.reload(id, opts, ...args);
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

    // 若传入 hover，则解析为 mouseenter
    if (options.trigger === 'hover') {
      options.trigger = 'mouseenter';
    }

    this.#events(); // 事件

    // 初始打开面板的条件
    if (options.defaultOpen || this.#isRootElemMounted()) {
      this.open();
    }
  }

  /**
   * 打开下拉菜单
   */
  open() {
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

    // 主模板
    let $rootElem = $(
      `<div class="lay-dropdown lay-border-box lay-panel lay-anim lay-anim-downbit"></div>`,
    );

    // 面板内容
    const content = options.content || getDefaultView();

    // 是否仅重载数据
    if (options._renderMode === 'reloadData' && this.#isRootElemMounted()) {
      $rootElem = this.$rootElem;
      this.$rootElem.html(content);
      delete options._renderMode;
    } else {
      // 常规渲染
      $rootElem.append(content); // 填充内容

      // 初始化某些属性
      $rootElem.addClass(options.className).attr('style', options.style);

      // 生成面板
      this.close(); // 关闭旧面板
      options.$target.append($rootElem); // 插入新面板
      this.$rootElem = $rootElem;

      // 若开启遮罩
      if (options.shade) {
        const shade = Array.isArray(options.shade)
          ? options.shade
          : [options.shade, '#000'];
        const $shadeElem = $(`<div class="${CONST.ELEM_ELEM_SHADE}"></div>`);

        $shadeElem.css({
          'z-index': $rootElem.css('z-index') - 1,
          'background-color': shade[1],
          opacity: shade[0],
        });

        // 处理移动端点击穿透问题
        if (clickOrMousedown === 'touchstart') {
          $shadeElem.on(clickOrMousedown, (e) => {
            e.preventDefault();
          });
        }

        $rootElem.before($shadeElem);
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

    // 阻止全局事件
    $rootElem.find('.lay-menu').on(clickOrMousedown, (e) => {
      e.stopPropagation();
    });

    // 触发菜单列表事件
    $rootElem.find('.lay-menu li').on('click', (e) => {
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
    $rootElem.find(CONST.ELEM_GROUP_TITLE).on('click', (e) => {
      const $this = $(e.currentTarget);
      const $groupElem = $this.parent();
      const data = $groupElem.data('item') || {};

      if (data.type === 'group' && options.allowExpand) {
        toggleMenuGroup($groupElem, options.accordion);
      }
    });

    this.#onClickOutside();
    this.#autoUpdatePosition();

    // 组件打开完毕的事件
    options.ready?.(options, $rootElem);
  }

  /**
   * 关闭面板
   */
  close() {
    const options = this.options;
    const $rootElem = this.$rootElem;

    this.stopClickOutsideEvent();
    this.stopResizeEvent();

    // 若存在已打开的面板元素，则移除
    if (this.#isRootElemMounted()) {
      $rootElem.prev(`.${CONST.ELEM_ELEM_SHADE}`).remove(); // 先移除遮罩
      $rootElem.remove(); // 再移除面板

      // 组件关闭完毕的回调
      options.close?.(options);
    }

    delete this.$rootElem; // 移除面板根节点的引用
    delete options._renderMode; // 移除私有选项
  }

  // 面板元素是否已存在于目标元素中
  #isRootElemMounted() {
    const options = this.options;
    const $rootElem = this.$rootElem;

    return $rootElem && options.$target[0]?.contains($rootElem[0]);
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

  #normalizedDelay() {
    const options = this.options;
    const delay = [].concat(options.delay);

    return {
      show: delay[0],
      hide: delay[1] !== undefined ? delay[1] : delay[0],
    };
  }

  // 延迟关闭面板
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
    const eventNamespace = CONST.EVENT_NAMESPACE;
    const trigger = `${options.trigger}${eventNamespace}`;

    // 始终先解除上一个触发元素的事件（如重载时改变 elem 的情况）
    this.$activeElem?.off(eventNamespace);
    $elem.off(eventNamespace);
    this.$activeElem = $elem;

    // 触发元素事件
    $elem.on(trigger, (e) => {
      clearTimeout(this.timer);
      this.e = e;

      // 主面板是否已打开
      const opened = this.#isRootElemMounted();

      // 若为鼠标移入事件，则延迟触发
      if (isMouseEnter) {
        if (!opened) {
          this.timer = setTimeout(() => {
            this.open();
          }, this.#normalizedDelay().show);
        }
      } else {
        // 若为 click 事件，则根据主面板状态，自动切换打开与关闭
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
   * 点击面板外部时的事件
   */
  #onClickOutside() {
    const options = this.options;
    const isCtxMenu = options.trigger === 'contextmenu';
    const isTopElem = lay.isTopElem(options.$elem[0]);

    this.stopClickOutsideEvent();

    const stop = lay.onClickOutside(
      this.$rootElem[0],
      (e) => {
        // 点击面板外部时的事件
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
    const eventNamespace = CONST.EVENT_NAMESPACE;

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

const CONST = Dropdown.CONST;
const resizeObserver = lay.createSharedResizeObserver(Dropdown.componentName);

/**
 * 设置菜单组展开和收缩状态
 * @param {JQuery} $groupElem - 菜单组标题元素的 jQuery 对象
 * @param {boolean} accordion - 是否为手风琴模式
 * @returns
 */
const toggleMenuGroup = ($groupElem, accordion) => {
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
(function () {
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

export { Dropdown as dropdown };
