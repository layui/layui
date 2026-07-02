/**
 * laypage
 * 分页组件
 */

import { lay } from '../core/lay.js';
import { i18n } from '../core/i18n.js';
import { $ } from 'jquery';
import { Component } from '../core/component.js';

export class Laypage extends Component {
  static componentName = 'laypage';

  // 默认配置项
  static options = {
    count: 0, // 数据总数
    current: 1, // 当前页
    limit: 10, // 每页条数
    limits: [10, 20, 30, 40, 50], // 每页条数选择项
    pageCount: 5, // 连续页码数
    prev: '<i class="lay-icon lay-icon-left"></i>', // 上一页文本
    next: '<i class="lay-icon lay-icon-right"></i>', // 下一页文本
    // 组件布局。可选值：count|prev|page|simplePage|next|limits|refresh|jump
    // 亦可通过 templates 配置项自定义组件模板
    layout: ['prev', 'page', 'next'],
    // align: 'start', // 对齐方式；可选值：start|end|center
    // className: '', // 根容器的额外类名
    // css: '', // 自定义 CSS 样式
    // disabled: false, // 是否禁用分页组件
    // size: '', // 组件尺寸 可选值：sm|md|lg
    // theme: '', // 内置主题风格 可选值：border|background
    hideOnSinglePage: false, // 只有一页时是否隐藏分页组件
  };

  static get CONST() {
    return {
      ...super.CONST,
      CLASS_ITEM: 'lay-pagination-item',
      CLASS_LINK: 'lay-pagination-link',
      CLASS_ELLIPSIS: 'lay-pagination-ellipsis',
      CLASS_LIMITS: 'lay-pagination-limits',
      CLASS_JUMP: 'lay-pagination-jump',
    };
  }

  // 实例方法静态委托
  static {
    this.delegateInstanceMethods(['jump']);
  }

  // 构造函数
  constructor(options) {
    super(options);

    this.overrideArrayOptions(options);
  }

  // 渲染
  render() {
    const options = this.options;
    const $elem = options.$elem;

    if (!$elem.length) return;

    $elem.html(this.#buildPaginationHtml());
    this.#events();
    options.afterRender?.(options); // 渲染完成后的回调
  }

  /**
   * 跳页
   * @param {number} page - 目标页码
   */
  jump(page) {
    const options = this.options;
    const pageNum = Number(page);

    // 重置页码
    if (Number.isFinite(pageNum) && pageNum > 0) {
      options.current = pageNum;
    }

    this.render();
    options?.onChange?.(options); // 页码或 limit 改变时的回调
  }

  // 规范化配置项
  #normalizeOptions({ totalPages }) {
    const options = this.options;
    options.current = Number(options.current);

    // 若页码不合法，则重置为 1
    if (options.current < 1 || !Number.isFinite(options.current)) {
      options.current = 1;
    } else if (options.current > totalPages) {
      // 当前页不能超过总页数
      options.current = totalPages;
    }

    // 若当前页码 * 条数超过总数，则将当前页码重置为最后一页
    if (options.current * options.limit > options.count) {
      options.current = totalPages;
    }

    // 连续页码数的规范化处理
    if (options.pageCount < 1) {
      options.pageCount = 1;
    } else if (options.pageCount > totalPages) {
      options.pageCount = totalPages;
    }
  }

  // 生成分页 HTML
  #buildPaginationHtml() {
    const options = this.options;

    // 计算总页数
    const totalPages = Math.ceil(options.count / options.limit) || 1;

    this.#normalizeOptions({ totalPages });

    const { current, pageCount } = options;
    const ELLIPSIS = '···';

    // 只有一页时根据配置决定是否输出分页结构
    if (totalPages === 1 && options.hideOnSinglePage) {
      return '';
    }

    // 根容器
    const $rootElem = (this.$rootElem = $(
      '<ul class="lay-pagination lay-border-box lay-unselect">',
    ));

    this.#applyRootElemStyles();

    // 组件模板
    const templates = {
      // 自定义模板。放在最前，避免覆盖内置模板
      ...options.templates,

      // 总数
      count() {
        const $li = $(`<li class="lay-pagination-count">`);
        $li.text(i18n.$t('laypage.total', { total: options.count }));
        return $li;
      },

      // 上一页
      prev() {
        const $li = $(`<li class="lay-pagination-prev">`);
        const $a = $(`<a>`).appendTo($li);
        if (current === 1) {
          $a.addClass(CONST.CLASS_DISABLED);
        } else {
          $a.addClass(CONST.CLASS_LINK);
        }
        $a.data('page', current - 1).html(options.prev);
        return $li;
      },
      // 页码
      page() {
        const elems = [];

        // 初始连续页码范围
        let startPage = 1;
        let endPage = totalPages;

        // 总页数超过连续页码数时，分段计算连续页码范围
        if (totalPages > pageCount) {
          // 连续页码数等分
          const halfVisiblePages = Math.floor((pageCount - 1) / 2);
          // 末段页码的起始页
          const lastStartPage = totalPages - pageCount + 1;

          // 首段页码范围
          if (current < pageCount) {
            startPage = 1;
            endPage = pageCount;
          } else if (current > lastStartPage) {
            // 末段页码范围
            startPage = lastStartPage;
            endPage = totalPages;
          } else {
            // 中间段页码范围
            startPage = current - halfVisiblePages;
            endPage = startPage + pageCount - 1;
          }
        }

        // 显示「首页」的条件
        const showFirstPage = options.first !== false && startPage > 1;
        // 显示「左侧省略号」的条件
        const showLeftEllipsis = options.first !== false && startPage > 2;
        // 显示「右侧省略号」的条件
        const showRightEllipsis =
          options.last !== false && endPage < totalPages - 1;
        // 显示「末页」的条件
        const showLastPage = options.last !== false && endPage < totalPages;

        // 生成首页
        if (showFirstPage) {
          const $li = $(`<li class="${CONST.CLASS_ITEM}">`);
          const $a = $(`<a class="${CONST.CLASS_LINK}">`);
          $a.data('page', 1).html(1);
          $li.append($a);
          elems.push($li);
        }

        // 生成左侧省略号
        if (showLeftEllipsis) {
          elems.push(
            `<li class="${CONST.CLASS_ELLIPSIS}"><span>${ELLIPSIS}</span></li>`,
          );
        }

        // 生成连续页码
        for (let page = startPage; page <= endPage; page++) {
          const $li = $(`<li class="${CONST.CLASS_ITEM}">`);
          const $a = $(`<a>`).appendTo($li);
          if (page === current) {
            $li.addClass(`${CONST.CLASS_ITEM}-active`);
          } else {
            $a.addClass(CONST.CLASS_LINK);
          }
          $a.data('page', page).html(page);
          elems.push($li);
        }

        // 生成右侧省略号
        if (showRightEllipsis) {
          elems.push(
            `<li class="${CONST.CLASS_ELLIPSIS}"><span>${ELLIPSIS}</span></li>`,
          );
        }

        // 生成末页
        if (showLastPage) {
          const $li = $(`<li class="${CONST.CLASS_ITEM}">`);
          const $a = $(`<a class="${CONST.CLASS_LINK}">`).appendTo($li);
          $a.data('page', totalPages).html(totalPages);
          elems.push($li);
        }

        return elems;
      },

      // 简约页码
      simplePage() {
        const $li = $(`<li class="lay-pagination-simple-page">`);
        $li.text(`${current} / ${totalPages}`);
        return $li;
      },

      // 下一页
      next() {
        const $li = $(`<li class="lay-pagination-next">`);
        const $a = $(`<a>`).appendTo($li);
        if (current === totalPages) {
          $a.addClass(CONST.CLASS_DISABLED);
        } else {
          $a.addClass(CONST.CLASS_LINK);
        }
        $a.data('page', current + 1).html(options.next);
        return $li;
      },

      // 选择条数
      limits() {
        const $li = $(`<li class="${CONST.CLASS_LIMITS}">`);
        const $select = $(`<select lay-ignore></select>`).appendTo($li);

        options.limits.forEach((item) => {
          const $option = $(`<option>`);
          const optionText = `${item} ${i18n.$t('laypage.pagesize')}`;

          $option.val(item).text(optionText);
          if (item === options.limit) {
            $option.prop('selected', true);
          }

          $option.appendTo($select);
        });

        return $li;
      },

      // 刷新当前页
      refresh() {
        const $li = $(`<li class="lay-pagination-refresh">`);
        const $a = $(
          `<a class="${CONST.CLASS_LINK}"><i class="lay-icon lay-icon-refresh"></i></a>`,
        ).appendTo($li);
        $a.data('page', current);
        return $li;
      },

      // 跳页区域
      jump() {
        const $li = $(`<li class="${CONST.CLASS_JUMP}">`);
        const jumpText = [
          i18n.$t('laypage.goto'),
          i18n.$t('laypage.page'),
          i18n.$t('laypage.confirm'),
        ];

        $li.append(`<span>${jumpText[0]}</span>`);

        const $input = $(
          `<input type="text" min="1" class="lay-input">`,
        ).appendTo($li);
        $li.append(`<span>${jumpText[1]}</span>`);
        const $button = $(`<button type="button">`).appendTo($li);

        $input.val(current);
        $button.text(jumpText[2]);
        return $li;
      },
    };

    // 根据 layout 数组顺序生成分页器结构
    options.layout.forEach((item) => {
      if (templates[item]) {
        const templateResult = templates[item]({ ...options, totalPages });
        if (Array.isArray(templateResult)) {
          templateResult.forEach(($elem) => $rootElem.append($elem));
        } else {
          $rootElem.append(templateResult);
        }
      }
    });

    return $rootElem;
  }

  // 为根容器应用额外的类名和样式
  #applyRootElemStyles() {
    const options = this.options;
    const $rootElem = this.$rootElem;

    // 对齐方式
    if (['start', 'center', 'end'].includes(options.align)) {
      $rootElem.addClass(`lay-pagination-align-${options.align}`);
    }

    // 组件尺寸
    if (['sm', 'md', 'lg'].includes(options.size)) {
      $rootElem.addClass(`lay-size-${options.size}`);
    }

    // 内置主题风格
    if (['border', 'background'].includes(options.theme)) {
      $rootElem.addClass(`lay-pagination-theme-${options.theme}`);
    }

    // 是否禁用
    if (options.disabled) {
      $rootElem.addClass(CONST.CLASS_DISABLED);
    }

    // 自定义类名
    $rootElem.addClass(options.className);

    // 自定义样式
    if (options.css) {
      lay.style({
        target: $rootElem[0],
        text: `[lay-laypage-id="${options.id}"] { ${options.css} }`,
      });
    }
  }

  // 事件
  #events() {
    const options = this.options;
    const $elem = options.$elem;

    // 根据输入的页码进行跳转
    const submitJumpPage = () => {
      const $jumper = $elem.find(`.${CONST.CLASS_JUMP}`);
      const $jumperInput = $jumper.find('input');
      const current = Number($jumperInput.val().replace(/\s|\D/g, ''));

      if (current) {
        this.jump(current);
      }
    };

    // 事件命名空间
    const eventNamespace = CONST.EVENT_NAMESPACE;

    // 避免重复绑定事件
    $elem.off(eventNamespace);

    // 分页是否禁用
    if (options.disabled) return;

    // 点击页码
    $elem.on(`click${eventNamespace}`, `.${CONST.CLASS_LINK}`, (e) => {
      const $this = $(e.currentTarget);
      const current = $this.data('page');
      this.jump(current);
    });

    // 选择条数
    $elem.on(
      `change${eventNamespace}`,
      `.${CONST.CLASS_LIMITS} > select`,
      (e) => {
        options.limit = Number(e.currentTarget.value);
        this.jump();
        options?.onLimitChange?.(options); // 条数改变时的回调
      },
    );

    // 跳转输入框键盘事件
    $elem.on(`keyup${eventNamespace}`, `.${CONST.CLASS_JUMP} > input`, (e) => {
      const value = e.currentTarget.value;
      const keyCode = e.keyCode;

      // 方向键不做处理
      if (/^(37|38|39|40)$/.test(keyCode)) return;

      // 限制仅允许输入数字
      if (/\D/.test(value)) {
        e.currentTarget.value = value.replace(/\D/g, '');
      }

      // 回车触发跳转
      if (keyCode === 13) {
        submitJumpPage();
      }
    });

    // 跳转确定按钮事件
    $elem.on(`click${eventNamespace}`, `.${CONST.CLASS_JUMP} > button`, () => {
      submitJumpPage();
    });
  }
}

const CONST = Laypage.CONST;

export { Laypage as laypage };
