/**
 * steps
 * 步骤条组件
 */

import { lay } from '../core/lay.js';
import { $ } from 'jquery';
import { Component } from '../core/component.js';
import { log } from '../core/logger.js';

export class Steps extends Component {
  static componentName = 'steps';

  // 默认配置项
  static options = {
    // 渲染目标：支持 CSS 选择器、DOM 元素或 jQuery 集合
    // 默认匹配页面全部 .lay-steps
    elem: '.lay-steps',
    current: 1, // 当前步骤（从 1 开始），之前的步骤显示为已完成，默认 1
    layout: 'horizontal', // 布局：horizontal 水平 / vertical 垂直，默认 horizontal
    size: '', // 尺寸：xs / sm / lg，为空时为默认尺寸
    clickable: false, // 是否可点击切换步骤（渲染点击交互），默认 false
    layFilter: '', // lay-filter 属性，用于区分事件来源，为空时不设置
    status: '', // 当前步骤状态：success / error / warning，为空时使用默认主题色
    data: [], // 步骤数据项数组（字符串或对象），generate 使用
  };

  static get CONST() {
    return {
      ...super.CONST,
      ELEM: 'lay-steps',
      ELEM_ITEM: 'lay-steps-item', // 步骤项
      ELEM_ICON: 'lay-steps-icon', // 图标容器
      ELEM_CONTENT: 'lay-steps-content', // 内容容器
      ELEM_TITLE: 'lay-steps-title', // 标题
      ELEM_DESC: 'lay-steps-desc', // 描述
      CLASS_IS_DONE: 'lay-is-done', // 已完成状态
      ICON: 'lay-icon', // 图标字体基类
      ICON_OK: 'lay-icon-ok', // 完成勾选图标
    };
  }

  /**
   * 构建并返回单个步骤项的 DOM 结构，不插入到目标容器
   * 图标默认显示数字序号（text），可传 icon 自定义 HTML
   * @param {Object} options - 组件配置项，详见 {@link Steps.options}
   * @param {string} [options.title] - 步骤标题
   * @param {string} [options.description] - 步骤描述
   * @param {string} [options.icon] - 自定义图标 HTML，优先于数字序号
   * @param {number} [options.text] - 图标数字序号（无 icon 时显示）
   * @param {string} [options.state] - 步骤状态：done / active / waiting
   * @param {boolean} [options.disabled] - 是否禁用，默认 false
   * @returns {jQuery} 步骤项 jQuery 对象
   */
  static build(options) {
    options = { ...this.options, ...options };

    const $item = $('<div>').addClass(CONST.ELEM_ITEM);

    // 禁用。复用基类状态类（禁用步骤不参与完成/当前状态计算）
    if (options.disabled) {
      $item.addClass(CONST.CLASS_IS_DISABLED);
    } else if (options.state === 'done') {
      $item.addClass(CONST.CLASS_IS_DONE);
    } else if (options.state === 'active') {
      $item.addClass(CONST.CLASS_IS_ACTIVE);
    }

    // 图标：自定义图标优先，其次完成步显示勾选图标，否则显示数字序号
    const $icon = $('<div>').addClass(CONST.ELEM_ICON);
    if (options.icon) {
      $icon.html(options.icon);
    } else if (!options.disabled && options.state === 'done') {
      $icon.append(createOkIcon());
    } else {
      $icon.text(options.text);
    }
    $item.append($icon);

    // 内容：标题 + 描述
    const $content = $('<div>').addClass(CONST.ELEM_CONTENT);
    if (options.title) {
      $content.append(
        $('<div>').addClass(CONST.ELEM_TITLE).text(options.title),
      );
    }
    if (options.description) {
      $content.append(
        $('<div>').addClass(CONST.ELEM_DESC).text(options.description),
      );
    }
    $item.append($content);

    return $item;
  }

  /**
   * 根据数据项生成一组步骤，不插入到目标容器
   * 数据项支持两种形态：
   * - 字符串：步骤标题，使用公共属性（如 layout / size / clickable）
   * - 对象：`{ title, description, icon, disabled, ... }` 个性属性，覆盖公共属性
   * 空数据项（空字符串 / 无任何内容的对象）会被过滤；空 data 返回空步骤条
   * 生成后可通过 {@link Steps.render} 绑定交互
   * @param {Object} options - 组件配置项 + data 数组
   * @param {Array} [options.data] - 步骤数据项数组（字符串或对象）
   * @returns {jQuery} 步骤条 jQuery 对象
   */
  static generate(options) {
    options = { ...this.options, ...options };

    const { data = [], ...common } = options;

    // 过滤空数据项
    const items = data.filter((item) => {
      if (typeof item === 'string') return item !== '';
      return item && (item.title || item.description || item.icon);
    });

    // 当前步骤钳制在有效步骤范围内
    const current = clampCurrent(
      normalizeCurrent(common.current),
      items.length,
    );

    const $steps = $('<div>').addClass(CONST.ELEM);
    $steps.attr('data-lay-current', current);

    // 配置维度通过 data-lay-* 属性承载（对齐 menu/parseDataset 模式），CSS 用属性选择器驱动
    // 布局。默认 horizontal 不写属性
    if (common.layout && common.layout !== 'horizontal') {
      $steps.attr('data-lay-layout', common.layout);
    }
    if (common.size) {
      $steps.attr('data-lay-size', common.size);
    }
    if (common.clickable) {
      $steps.attr('data-lay-clickable', true);
    }
    if (common.layFilter) {
      $steps.attr('lay-filter', common.layFilter);
    }
    if (common.status) {
      $steps.attr('data-lay-status', common.status);
    }

    items.forEach((item, index) => {
      const itemOptions =
        typeof item === 'string'
          ? { ...common, title: item }
          : { ...common, ...item };
      const $item = this.build({
        ...itemOptions,
        text: index + 1,
        state: getStepStatus(index + 1, current),
      });
      $steps.append($item);
    });

    return $steps;
  }

  /**
   * 渲染：依据 data-lay-current 计算各步骤状态，可点击时绑定切换交互
   * 步骤 DOM 多来自静态标记（initializer 自动渲染），或由 generate() 生成后插入
   * @returns {this}
   */
  render() {
    const options = this.options;
    const $elem = options.$elem;

    // 目标元素不存在时提示并直接返回
    if (!$elem[0]) {
      log(`[steps] target element not found: ${options.elem}`);
      return this;
    }

    // 依据 data-lay-current 重算各步骤状态
    applyStatus($elem);

    // 可点击：绑定步骤点击/键盘切换
    if ($elem.is('[data-lay-clickable]')) {
      const eventNamespace = CONST.EVENT_NAMESPACE;
      const clickEventName = `click${eventNamespace}`;
      const keydownEventName = `keydown${eventNamespace}`;

      $elem
        .off(`${clickEventName} ${keydownEventName}`)
        .on(clickEventName, `.${CONST.ELEM_ITEM}`, events.click)
        .on(keydownEventName, `.${CONST.ELEM_ITEM}`, events.clickByKey);

      // 无障碍：可点击步骤声明交互角色（可访问名称取自步骤内容）
      $elem.children(`.${CONST.ELEM_ITEM}`).attr({
        role: 'button',
        tabindex: '0',
      });
    }

    return this;
  }

  /**
   * 动态设置当前步骤
   * @param {number} index - 当前步骤（从 1 开始）
   * @returns {this}
   */
  setCurrent(index) {
    const $elem = this.options.$elem;

    // 目标元素不存在时提示并直接返回
    if (!$elem[0]) {
      log(`[steps] target element not found: ${this.options.elem}`);
      return this;
    }

    const from = readCurrent($elem);
    const total = $elem.children(`.${CONST.ELEM_ITEM}`).length;
    const to = clampCurrent(normalizeCurrent(parseInt(index, 10)), total);

    // 目标步骤无变化时不触发 change
    if (from === to) return this;

    $elem.attr('data-lay-current', to);
    applyStatus($elem);
    triggerChange($elem, from, to);
    return this;
  }

  // 实例方法静态委托
  static {
    this.delegateInstanceMethods(['setCurrent']);
  }
}

// 基础事件体
const events = {
  // 点击步骤
  click() {
    const $item = $(this);

    // 禁用步骤不可点击
    if ($item.hasClass(CONST.CLASS_IS_DISABLED)) return;

    const $steps = $item.closest(`.${CONST.ELEM}`);
    const from = readCurrent($steps);
    const to = $steps.children(`.${CONST.ELEM_ITEM}`).index($item) + 1;

    // 点击当前步骤无操作
    if (from === to) return;

    // 触发 click 事件（切换前）；回调返回 false 可阻断切换
    const filter = $steps.attr('lay-filter') || '';
    const clickEventName = filter ? `click(${filter})` : 'click';
    const enable = lay.event.call(this, Steps.componentName, clickEventName, {
      elem: $steps[0],
      from,
      to,
      item: $item[0],
    });
    if (enable === false) return;

    // 默认行为：切换到该步骤（复用实例 setCurrent，内部触发 change 事件）
    const inst = Steps.getInstance($steps.attr(CONST.ATTR_ID));
    if (inst) {
      inst.setCurrent(to);
    } else {
      $steps.attr('data-lay-current', to);
      applyStatus($steps);
      triggerChange($steps, from, to);
    }
  },

  // 键盘切换（Enter / 空格）
  clickByKey(event) {
    if (event.code === 'Enter' || event.code === 'Space') {
      event.preventDefault();
      events.click.call(this);
    }
  },
};

// 创建完成勾选图标
const createOkIcon = () => $('<i>').addClass(`${CONST.ICON} ${CONST.ICON_OK}`);

// 计算步骤状态：step 为第几步（从 1 起），current 为当前步（从 1 起）
const getStepStatus = (step, current) =>
  step < current ? 'done' : step === current ? 'active' : 'waiting';

// 规范化当前步：非正整数视作第 1 步
const normalizeCurrent = (current) =>
  Number.isInteger(current) && current >= 1 ? current : 1;

// 钳制当前步在有效范围 [1, total] 内
const clampCurrent = (current, total) =>
  Math.min(Math.max(current, 1), Math.max(total, 1));

// 依据 data-lay-current 重算各步骤状态（render 与点击切换共用）
const applyStatus = ($elem) => {
  const current = readCurrent($elem);

  $elem.children(`.${CONST.ELEM_ITEM}`).each((stepIndex, item) => {
    const $item = $(item);

    // 禁用步骤保持禁用状态，不参与状态计算
    if ($item.hasClass(CONST.CLASS_IS_DISABLED)) return;

    const status = getStepStatus(stepIndex + 1, current);

    $item.removeClass(CONST.CLASS_IS_DONE).removeClass(CONST.CLASS_IS_ACTIVE);
    if (status === 'done') {
      $item.addClass(CONST.CLASS_IS_DONE);
    } else if (status === 'active') {
      $item.addClass(CONST.CLASS_IS_ACTIVE);
    }

    // 图标：完成步打勾，其余为数字序号；自定义图标保持不变
    $item.children(`.${CONST.ELEM_ICON}`).each((_, iconEl) => {
      const $icon = $(iconEl);
      if (status === 'done') {
        // 纯数字序号替换为勾选图标
        if (/^\d+$/.test($icon.text().trim())) {
          $icon.html(createOkIcon());
        }
      } else if ($icon.find(`.${CONST.ICON_OK}`).length) {
        // 非完成步：勾选图标还原为数字序号
        $icon.text(stepIndex + 1);
      }
    });
  });
};

// 读取当前步骤（从 1 起，非正整数兜底为 1）
const readCurrent = ($elem) =>
  normalizeCurrent(parseInt($elem.attr('data-lay-current'), 10));

// 触发 change 事件（切换成功后）
const triggerChange = ($elem, from, to) => {
  const filter = $elem.attr('lay-filter') || '';
  const changeEventName = filter ? `change(${filter})` : 'change';
  lay.event.call($elem[0], Steps.componentName, changeEventName, {
    elem: $elem[0],
    from,
    to,
    item: $elem.children(`.${CONST.ELEM_ITEM}`)[to - 1],
  });
};

const CONST = Steps.CONST;

export { Steps as steps };
