/**
 * tabs
 * 标签页组件
 */

import { lay } from '../core/lay.js';
import { $ } from 'jquery';
import { Component } from '../core/component.js';

export class Tabs extends Component {
  static componentName = 'tabs';

  // 默认配置
  static options = {
    elem: '.lay-tabs',
    trigger: 'click', // 标签切换的触发事件
    headerMode: 'auto', // 标签头部的显示模式 auto | scroll | normal
  };

  static get CONST() {
    return {
      ...super.CONST,
      ELEM: 'lay-tabs',
      HEADER: 'lay-tabs-header',
      CLOSE: 'lay-tabs-close',
      BODY: 'lay-tabs-body',
      ITEM: 'lay-tabs-item',
      CARD: 'lay-tabs-card',
    };
  }

  // 实例方法静态委托
  static {
    this.delegateInstanceMethods([
      'add',
      'close',
      'closeMult',
      'change',
      'getHeaderItem',
      'getBodyItem',
    ]);
  }

  /**
   * 获取标签信息
   * @param {string} id - 渲染时的实例 ID
   * @return {Object} 标签相关信息
   */
  static data(id) {
    const inst = this.getInstance(id);
    return inst ? inst.data() : {};
  }

  /**
   * 刷新标签视图结构
   * @param {string} id - 渲染时的实例 ID
   */
  static refresh(id) {
    const inst = this.getInstance(id);
    if (!inst) return;
    inst.roll('auto');
  }

  // 渲染
  render() {
    const options = this.options;
    const Constructor = this.constructor;

    // 标签页元素项
    this.headerElem = [`.${CONST.HEADER}:eq(0)`, '>li'];
    this.bodyElem = [`.${CONST.BODY}:eq(0)`, `>.${CONST.ITEM}`];

    // 获取标签容器中的 header body 相关元素
    this.getContainer = () => {
      const $elem = this.documentElem || options.$elem;
      return {
        header: {
          elem: $elem.find(this.headerElem[0]),
          items: $elem.find(this.headerElem.join('')),
        },
        body: {
          elem: $elem.find(this.bodyElem[0]),
          items: $elem.find(this.bodyElem.join('')),
        },
      };
    };

    // 若 header 选项类型为数组
    if (lay.type(options.header) === 'array') {
      // if (options.header.length === 0) return;

      // 给任意元素绑定 tabs 切换功能
      if (typeof options.header[0] === 'string') {
        this.headerElem = options.header.concat();
        this.documentElem = $(document);
      } else {
        // 方法传值渲染
        this.$rootElem = $('<div class="lay-tabs"></div>');

        if (options.className) {
          this.$rootElem.addClass(options.className);
        }

        const headerElem = $('<ul class="lay-tabs-header"></ul>');
        const bodyElem = $('<div class="lay-tabs-body"></div>');

        // 生成标签项
        options.header.forEach((item) => {
          const elemHeaderItem = this.#renderHeaderItem(item);
          headerElem.append(elemHeaderItem);
        });
        options.body.forEach((item) => {
          const elemBodyItem = this.#renderBodyItem(item);
          bodyElem.append(elemBodyItem);
        });

        this.$rootElem.append(headerElem).append(bodyElem);
        options.$elem.html(this.$rootElem);
      }
    } else {
      this.#renderClose(); // 初始化标签关闭结构
    }

    // 若 body 选项类型为数组
    if (lay.type(options.body) === 'array') {
      if (typeof options.body[0] === 'string') {
        this.documentElem = $(document);
        this.bodyElem = options.body.concat();
      }
    }

    // 初始选中项
    const data = this.data();
    if ('index' in options && data.index != options.index) {
      this.change(options.index, true);
    } else if (data.index === -1) {
      // 初始选中项为空时，默认选中第一个
      this.change(0, true);
    }

    // 初始化滚动结构
    this.roll('auto');

    // 清除隐藏占位
    if (options.$elem.hasClass(CONST.CLASS_HIDEV)) {
      options.$elem.removeClass(CONST.CLASS_HIDEV);
    }

    // 渲染成功后的回调
    options.afterRender?.(data);

    this.#events();

    // 渲染成功后的事件
    lay.event.call(
      options.$elem[0],
      Constructor.componentName,
      `afterRender(${options.id})`,
      data,
    );
  }

  /**
   * 增加标签
   * @param {Object} opts
   * @param {string} opts.title - 标签标题
   * @param {string} opts.content - 标签内容
   * @param {string} opts.id - 标签的 lay-id 属性值
   * @param {string} [opts.index] - 活动标签索引，默认取当前选中标签的索引
   * @param {('append'|'prepend'|'after'|'before')} [opts.mode='append'] - 标签插入方式
   * @param {boolean} [opts.active] - 是否将新增项设置为活动标签
   * @param {boolean} [opts.closable] - 标签是否可关闭。初始值取决于 options.closable
   * @param {string} [opts.headerItem] - 自定义标签头部元素
   * @param {string} [opts.bodyItem] - 自定义标签内容元素
   * @param {Function} [opts.done] - 标签添加成功后执行的回调函数
   */
  add(opts) {
    const container = this.getContainer();
    const newHeaderItem = this.#renderHeaderItem(opts);
    const newBodyItem = this.#renderBodyItem(opts);
    const data = this.data();

    // 选项默认值
    opts = $.extend(
      {
        active: true,
      },
      opts,
    );

    // 插入方式
    if (/(before|after)/.test(opts.mode)) {
      // 在活动标签前后插入
      const hasOwnIndex = Object.prototype.hasOwnProperty.call(opts, 'index');
      const headerItem = hasOwnIndex
        ? this.getHeaderItem(opts.index)
        : data.thisHeaderItem;
      const bodyItem = hasOwnIndex
        ? this.getBodyItem(opts.index)
        : data.thisBodyItem;
      headerItem[opts.mode](newHeaderItem);
      bodyItem[opts.mode](newBodyItem);
    } else {
      // 在标签最前后插入
      const mode =
        {
          prepend: 'prepend', // 插入标签到最前
          append: 'append', // 插入标签到最后
        }[opts.mode || 'append'] || 'append';
      container.header.elem[mode](newHeaderItem);
      container.body.elem[mode](newBodyItem);
    }

    // 是否将新增项设置为活动标签
    if (opts.active) {
      this.change(newHeaderItem.index(), true);
    } else {
      this.roll('auto');
    }

    // 回调
    typeof opts.done === 'function' &&
      opts.done(
        $.extend(data, {
          headerItem: newHeaderItem,
          bodyItem: newBodyItem,
        }),
      );
  }

  /**
   * 关闭指定标签
   * @param {number|string} index - 标签索引或 lay-id 值
   * @param {boolean} force - 是否强制删除
   */
  close(index, force) {
    let data = this.data();

    // index 若不传，则表示关闭当前标签
    if (index === undefined) {
      index = data.index;
    }

    const thisHeaderItem = this.getHeaderItem(index);
    if (!thisHeaderItem || !thisHeaderItem[0]) return;

    const options = this.options;
    const layid = thisHeaderItem.attr('lay-id');
    const itemIndex = thisHeaderItem.index();
    const Constructor = this.constructor;

    // 标签是否不可关闭
    if (thisHeaderItem.attr('lay-closable') === 'false') {
      return;
    }

    // 标签关闭前的事件。若非强制关闭，可则根据事件的返回结果决定是否关闭
    if (!force) {
      const closable = lay.event.call(
        thisHeaderItem[0],
        Constructor.componentName,
        `beforeClose(${options.id})`,
        $.extend(data, {
          index: itemIndex,
        }),
      );

      // 是否阻止关闭
      if (closable === false) {
        return;
      }
    }

    // 如果关闭的是当前标签，则更换当前标签索引
    if (thisHeaderItem.hasClass(CONST.CLASS_THIS)) {
      if (thisHeaderItem.next()[0]) {
        this.change(itemIndex + 1, true);
      } else if (thisHeaderItem.prev()[0]) {
        this.change(itemIndex - 1, true);
      }
    }

    // 移除元素
    this.getBodyItem(layid || index).remove();
    thisHeaderItem.remove();

    this.roll('auto', itemIndex);

    // 获取当前标签相关数据
    data = this.data();

    // 标签关闭后的事件
    lay.event.call(
      data.thisHeaderItem[0],
      Constructor.componentName,
      `afterClose(${options.id})`,
      data,
    );
  }

  /**
   * 批量关闭标签
   * @see Tabs.close()
   */
  closeMult(mode, index) {
    const options = this.options;
    const Constructor = this.constructor;
    const container = this.getContainer();
    let data = this.data();
    const headers = container.header.items;
    // const bodys = container.body.items;
    const DISABLED_CLOSE_SELECTOR = '[lay-closable="false"]'; // 不可关闭标签选择器
    // const FILTER = `:not(${DISABLED_CLOSE_SELECTOR})`; // 不可关闭标签过滤器

    index = index === undefined ? data.index : index;

    const headerItem = this.getHeaderItem(index);
    // const bodyItem = this.getBodyItem(index);
    const itemIndex = headerItem.index();

    // 若当前选中标签也允许关闭，则尝试寻找不可关闭的标签并将其选中
    if (data.thisHeaderItem.attr('lay-closable') !== 'false') {
      if (mode === 'all' || !mode) {
        const nextHeader = headers
          .filter(`:gt(${data.index})${DISABLED_CLOSE_SELECTOR}`)
          .eq(0);
        const prevHeader = $(
          headers
            .filter(`:lt(${data.index})${DISABLED_CLOSE_SELECTOR}`)
            .get()
            .reverse(),
        ).eq(0);
        if (nextHeader[0]) {
          this.change(nextHeader.index(), true);
        } else if (prevHeader[0]) {
          this.change(prevHeader.index(), true);
        }
      } else if (index !== data.index) {
        // 自动切换到活动标签
        this.change(index, true);
      }
    }

    // 执行批量关闭标签
    headers.each((i, item) => {
      const $this = $(item);
      const layid = $this.attr('lay-id');
      const bodyItem = this.getBodyItem(layid || i);

      // 标签是否不可关闭
      if ($this.attr('lay-closable') === 'false') {
        return;
      }

      // 批量关闭方式
      const isCloseOther = mode === 'other' && i !== itemIndex; // 关闭其他标签
      const isCloseRight = mode === 'right' && i > itemIndex; // 关闭右侧标签
      const isCloseLeft = mode === 'left' && i < itemIndex; // 关闭左侧标签（不推荐）
      const isCloseAll = mode === 'all'; // 关闭所有标签

      if (isCloseOther || isCloseRight || isCloseLeft || isCloseAll) {
        $this.remove();
        bodyItem.remove();
      }
    });

    this.roll('auto');

    // 回调
    data = this.data();

    // 标签关闭后的事件
    lay.event.call(
      data.thisHeaderItem[0],
      Constructor.componentName,
      `afterClose(${options.id})`,
      data,
    );
  }

  /**
   * 切换标签
   * @param {number|string} index - 标签索引或 lay-id 值
   * @param {boolean} [force=false] - 是否强制切换
   * @returns
   */
  change(index, force) {
    const thisHeaderItem = this.getHeaderItem(index);
    if (!thisHeaderItem || !thisHeaderItem[0]) return;

    const options = this.options;
    const Constructor = this.constructor;
    const layid = thisHeaderItem.attr('lay-id');
    const itemIndex = thisHeaderItem.index();
    const thatA = thisHeaderItem.find('a');
    // 是否存在跳转链接
    const isLink =
      typeof thatA.attr('href') === 'string' &&
      thatA.attr('target') === '_blank';
    // 是否不允许选中
    const unselect = typeof thisHeaderItem.attr('lay-unselect') === 'string';

    // 不满足切换的条件
    if (isLink || unselect) {
      return;
    }

    // 当前标签相关数据
    let data = this.data();

    // 标签关闭前的事件。若非强制关闭，可则根据事件的返回结果决定是否关闭
    if (!force) {
      const enable = lay.event.call(
        thisHeaderItem[0],
        Constructor.componentName,
        `beforeChange(${options.id})`,
        $.extend(data, {
          from: {
            index: data.index,
            headerItem: data.thisHeaderItem,
          },
          to: {
            index: itemIndex,
            headerItem: thisHeaderItem,
          },
        }),
      );

      // 是否阻止切换
      if (enable === false) {
        return;
      }
    }

    // 执行标签头部切换
    thisHeaderItem
      .addClass(CONST.CLASS_THIS)
      .siblings()
      .removeClass(CONST.CLASS_THIS);

    // 执行标签内容切换
    this.getBodyItem(layid || index)
      .addClass(CONST.CLASS_SHOW)
      .siblings()
      .removeClass(CONST.CLASS_SHOW);

    this.roll('auto', itemIndex);

    // 重新获取标签相关数据
    data = this.data();

    // 标签切换后的事件
    lay.event.call(
      data.thisHeaderItem[0],
      Constructor.componentName,
      `afterChange(${options.id})`,
      data,
    );
  }

  /**
   * 标签头滚动
   * @param {('auto'|'prev'|'next'|'init')} [mode='next'] - 滚动方式
   * @param {number} index - 标签索引。默认取当前选中标签的索引值
   * @returns
   */
  roll(mode, index) {
    const options = this.options;
    const container = this.getContainer();
    const headerElem = container.header.elem;
    const headerItems = container.header.items;
    let scrollWidth = headerElem.prop('scrollWidth'); // 实际总长度
    let outerWidth = Math.ceil(headerElem.outerWidth()); // 可视区域的长度
    let tabsLeft = headerElem.data('left') || 0;
    const scrollMode = options.headerMode === 'scroll'; // 标签头部是否始终保持滚动模式

    // 让选中标签始终保持在可视区域
    const rollToVisibleArea = () => {
      index = isNaN(index) ? this.data().index : index;

      const thisItemElem = headerItems.eq(index);
      if (!thisItemElem[0]) return;

      // 当前标签的相对水平坐标值
      const thisLeft = Math.ceil(thisItemElem.position().left);
      const padding = 1; // 让边界额外保持一定间距

      // 当选中标签溢出在可视区域「左侧」时
      let countWidth = thisLeft - (thisItemElem.prev().outerWidth() || 0); // 始终空出上一个标签
      if (countWidth > 0) countWidth = countWidth - padding;

      // 左侧临界值
      if (tabsLeft + countWidth < 0) {
        tabsLeft = countWidth >= 0 ? countWidth : 0; // 标签的复原位移不能超出 0
        return headerElem.css('left', -tabsLeft).data('left', -tabsLeft);
      }

      // 当选中标签溢出在可视区域「右侧」时，
      countWidth =
        thisLeft +
        thisItemElem.outerWidth() +
        (thisItemElem.next().outerWidth() || 0) +
        padding; // 始终空出下一个标签

      // 右侧临界值
      if (tabsLeft + countWidth - outerWidth > 0) {
        tabsLeft = countWidth - outerWidth;
        headerElem.css('left', -tabsLeft).data('left', -tabsLeft);
      }
    };

    // css 类名
    const CLASS_SCROLL = 'lay-tabs-scroll';
    const CLASS_BAR = 'lay-tabs-bar';
    const CLASS_BAR_ICON = ['lay-icon-prev', 'lay-icon-next'];

    // 滚动结构
    const rollElem = {
      elem: $(
        `<div class="${CLASS_SCROLL} lay-border-box lay-unselect"></div>`,
      ),
      bar: $(
        [
          `<div class="${CLASS_BAR}">`,
          `<i class="lay-icon ${CLASS_BAR_ICON[0]}" lay-mode="prev"></i>`,
          `<i class="lay-icon ${CLASS_BAR_ICON[1]}" lay-mode="next"></i>`,
          '</div>',
        ].join(''),
      ),
    };

    // 不渲染头部滚动结构
    if (options.headerMode === 'normal') return;

    // 是否渲染滚动结构
    let elemScroll = headerElem.parent(`.${CLASS_SCROLL}`);
    if (scrollMode || (!scrollMode && scrollWidth > outerWidth)) {
      if (!elemScroll[0]) {
        if (options.$elem.hasClass(CONST.CARD)) {
          rollElem.elem.addClass(CONST.CARD);
        }
        headerElem.wrap(rollElem.elem);
        headerElem.after(rollElem.bar);

        // 点击左右箭头
        rollElem.bar.children().on('click', (event) => {
          const $this = $(event.currentTarget);
          const currentMode = $this.attr('lay-mode');
          if ($this.hasClass(CONST.CLASS_DISABLED)) return;
          currentMode && this.roll(currentMode);
        });
      }
    } else if (!scrollMode) {
      if (elemScroll[0]) {
        elemScroll.find(`.${CLASS_BAR}`).remove();
        headerElem.unwrap().css('left', 0).data('left', 0);
      } else {
        return;
      }
    }

    // 初始化滚动模式
    if (mode === 'init') return;

    // 重新获取
    scrollWidth = headerElem.prop('scrollWidth'); // 实际总长度
    outerWidth = headerElem.outerWidth(); // 可视区域的长度
    elemScroll = headerElem.parent(`.${CLASS_SCROLL}`);

    // 左箭头（往右滚动）
    if (mode === 'prev') {
      // 当前的 left 减去可视宽度，用于与上一轮的页签比较
      let prevLeft = -tabsLeft - outerWidth;
      if (prevLeft < 0) prevLeft = 0;
      headerItems.each((_, item) => {
        const li = $(item);
        const left = Math.ceil(li.position().left);

        if (left >= prevLeft) {
          headerElem.css('left', -left).data('left', -left);
          return false;
        }
      });
    } else if (mode === 'auto') {
      // 自动识别滚动
      rollToVisibleArea();
    } else {
      // 右箭头（往左滚动） 默认 next
      headerItems.each((_, item) => {
        const li = $(item);
        const left = Math.ceil(li.position().left);

        if (left + li.outerWidth() >= outerWidth - tabsLeft) {
          headerElem.css('left', -left).data('left', -left);
          return false;
        }
      });
    }

    // 同步箭头状态
    tabsLeft = headerElem.data('left') || 0;

    // 左
    elemScroll
      .find(`.${CLASS_BAR_ICON[0]}`)
      [tabsLeft < 0 ? 'removeClass' : 'addClass'](CONST.CLASS_DISABLED);
    // 右
    elemScroll
      .find(`.${CLASS_BAR_ICON[1]}`)
      [
        parseFloat(tabsLeft + scrollWidth) - outerWidth > 0
          ? 'removeClass'
          : 'addClass'
      ](CONST.CLASS_DISABLED);
  }

  /**
   * 获取标签头部项
   * @param {number|string} index - 标签索引或 lay-id
   */
  getHeaderItem(index) {
    const container = this.getContainer();
    const headerItems = container.header.items;

    // 根据 lay-id 匹配
    if (typeof index === 'string') {
      return headerItems.filter(`[lay-id="${index}"]`);
    }

    return headerItems.eq(index);
  }

  /**
   * 获取标签内容项
   * @param {number|string} index - 标签索引或 lay-id
   */
  getBodyItem(index) {
    const container = this.getContainer();
    const bodyItems = container.body.items;

    // 根据 lay-id 匹配
    if (typeof index === 'string') {
      const bodyItem = bodyItems.filter(`[lay-id="${index}"]`);
      return bodyItem[0]
        ? bodyItem
        : (function () {
            // 若未匹配到 lay-id 对应内容项，则通过对应头部项的索引匹配内容项
            const headerItems = container.header.items;
            const headerItemIndex = headerItems
              .filter(`[lay-id="${index}"]`)
              .index();

            return headerItemIndex !== -1
              ? bodyItems.eq(headerItemIndex)
              : bodyItem;
          })();
    }

    return bodyItems.eq(index);
  }

  /**
   * 返回给回调的公共信息
   * @returns
   */
  data() {
    const options = this.options;
    const container = this.getContainer();
    const thisHeaderItem = container.header.items.filter(
      `.${CONST.CLASS_THIS}`,
    );
    const index = thisHeaderItem.index();
    const layid = thisHeaderItem.attr('lay-id');

    return {
      options: options, // 标签配置信息
      container: container, // 标签容器的相关元素
      thisHeaderItem: thisHeaderItem, // 当前活动标签头部项
      thisBodyItem: this.getBodyItem(layid || index), // 当前活动标签内容项
      index: index, // 当前活动标签索引
      length: container.header.items.length, // 标签数量
    };
  }

  /**
   * 渲染标签头部项
   * @param {Object} opts - 标签项配置信息
   */
  #renderHeaderItem(opts) {
    const options = this.options;
    const headerItem = $(opts.headerItem || options.headerItem || '<li></li>');

    headerItem.html(opts.title || 'New Tab').attr('lay-id', opts.id);
    this.#appendClose(headerItem, opts); // 追加标签关闭元素
    return headerItem;
  }

  /**
   * 渲染标签内容项
   * @param {Object} opts - 标签项配置信息
   */
  #renderBodyItem(opts) {
    const options = this.options;
    const bodyItem = $(
      opts.bodyItem || options.bodyItem || `<div class="${CONST.ITEM}"></div>`,
    );

    bodyItem.html(opts.content || '').attr('lay-id', opts.id);
    return bodyItem;
  }

  /**
   * 给某一个标签项追加可关闭元素
   * @param {Object} headerItem - 标签项元素
   * @param {Object} opts - 标签项配置信息
   */
  #appendClose(headerItem, opts) {
    const options = this.options;

    if (!options.closable) return;

    opts = opts || {};

    // 不可关闭项
    if (opts.closable == false) {
      headerItem.attr('lay-closable', 'false');
    }

    if (headerItem.attr('lay-closable') === 'false') {
      return;
    }

    // 可关闭项追加关闭按钮
    if (!headerItem.find(`.${CONST.CLOSE}`)[0]) {
      const close = $(
        `<i class="lay-icon lay-icon-close lay-unselect ${CONST.CLOSE}"></i>`,
      );
      close.on('click', () => {
        this.close(headerItem.index());
        return false;
      });
      headerItem.append(close);
    }
  }

  /**
   * 渲染标签可关闭元素
   */
  #renderClose() {
    const options = this.options;
    const container = this.getContainer();

    container.header.items.each((_, item) => {
      const $this = $(item);
      // 是否开启关闭
      if (options.closable) {
        this.#appendClose($this);
      } else {
        $this.find(`.${CONST.CLOSE}`).remove();
      }
    });
  }

  // 事件
  #events() {
    const options = this.options;
    const container = this.getContainer();
    const delegatedElement = this.documentElem
      ? container.header.elem
      : options.$elem;

    // 事件命名空间
    const eventNamespace = CONST.EVENT_NAMESPACE;

    // 避免重复绑定事件
    delegatedElement.off(eventNamespace);

    // 标签头部事件
    const trigger = `${options.trigger}${eventNamespace}`;
    const elemHeaderItem = this.documentElem
      ? this.headerElem[1]
      : this.headerElem.join('');

    delegatedElement.on(trigger, elemHeaderItem, (e) => {
      this.change($(e.currentTarget).index());
    });
  }
}

const CONST = Tabs.CONST;

// 窗口 resize 事件
(() => {
  let timer;
  $(window).on('resize', function () {
    clearTimeout(timer);
    timer = setTimeout(() => {
      const tabsInstances = Tabs.getInstances();
      for (const inst of Object.values(tabsInstances)) {
        if (inst) {
          inst.roll('init');
        }
      }
    }, 50);
  });
})();

export { Tabs as tabs };
