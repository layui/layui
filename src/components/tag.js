/**
 * tag
 * 标签组件
 */

import { lay } from '../core/lay.js';
import { i18n } from '../core/i18n.js';
import { $ } from 'jquery';
import { Component } from '../core/component.js';

export class Tag extends Component {
  static componentName = 'tag';

  // 默认配置项
  static options = {
    elem: '.lay-tag',
    text: '', // 标签文案
    type: '', // 状态色：normal / success / warning / danger / info，为空时使用默认主题色
    size: '', // 尺寸：xs / sm / lg，为空时为默认尺寸（md）
    effect: 'solid', // 主题：solid 实心 / light 浅色 / plain 朴素
    closable: false, // 是否可关闭（渲染关闭按钮）
    layFilter: '', // lay-filter 属性，用于区分 close 事件
    round: false, // 是否胶囊圆角
    disabled: false, // 是否禁用（禁用时不可关闭）
  };

  static get CONST() {
    return {
      ...super.CONST,
      ELEM: 'lay-tag',
      ELEM_CLOSE: 'lay-tag-close', // 关闭按钮类
      ICON: 'lay-icon', // 图标字体基类
      ICON_CLOSE: 'lay-icon-close', // 关闭图标
    };
  }

  // 创建关闭按钮
  static #createCloseButton() {
    return $('<i>')
      .addClass(`${CONST.ICON} ${CONST.ICON_CLOSE} ${CONST.ELEM_CLOSE}`)
      .attr({
        role: 'button',
        tabindex: '0',
        'aria-label': i18n.$t('tag.close'),
      });
  }

  /**
   * 构建并返回标签的 DOM 结构，不插入到目标容器
   * 可供其他组件（如表单校验、表格列）内部复用统一的标签结构
   * @param {Object} options - 组件配置项，详见 {@link Tag.options}
   * @returns {jQuery} 标签 jQuery 对象
   */
  static build(options) {
    options = { ...this.options, ...options };

    const $tag = $('<span>').addClass(CONST.ELEM);

    // 配置维度通过 data-lay-* 属性承载（对齐 menu/parseDataset 模式），CSS 用属性选择器驱动
    if (options.type) {
      $tag.attr('data-lay-type', options.type);
    }
    if (options.size) {
      $tag.attr('data-lay-size', options.size);
    }
    // 主题。默认 solid 不写属性
    if (options.effect && options.effect !== 'solid') {
      $tag.attr('data-lay-effect', options.effect);
    }
    if (options.round) {
      $tag.attr('data-lay-round', true);
    }

    // 禁用。复用基类状态类；禁用时不可关闭，不声明 data-lay-closable
    if (options.disabled) {
      $tag.addClass(CONST.CLASS_IS_DISABLED);
    } else if (options.closable) {
      // 可关闭：声明 data-lay-closable 属性
      $tag.attr('data-lay-closable', true);
    }

    // lay-filter 事件标识（沿用 layui 事件分发约定，非 data-lay-* 配置属性）
    if (options.layFilter) {
      $tag.attr('lay-filter', options.layFilter);
    }

    // 文案（先设文本，避免 text() 覆盖后续追加的关闭按钮）
    if (options.text) {
      $tag.text(options.text);
    }

    // 关闭按钮（后追加，禁用时不渲染）
    if (!options.disabled && options.closable) {
      $tag.append(Tag.#createCloseButton());
    }

    return $tag;
  }

  /**
   * 根据数据项生成一组标签，不插入到目标容器
   * 数据项支持两种形态：
   * - 字符串：使用公共属性（如 type / effect / size 等）作为标签配置
   * - 对象：`{ text, type, ... }` 个性属性，覆盖公共属性
   * 无文案的数据项（空字符串 / 无 text 的对象）会被过滤；空 data 返回空集合
   * 生成后可通过 {@link Tag.render} 一次性绑定交互
   * @param {Object} options - 组件配置项 + data 数组
   * @param {Array} [options.data] - 标签数据项数组（字符串或对象）
   * @returns {jQuery} 标签集合 jQuery 对象
   */
  static generate(options) {
    options = { ...this.options, ...options };

    const { data = [], ...common } = options;

    return $(
      data
        .filter((item) => {
          if (typeof item === 'string') return item !== '';
          return item && item.text;
        })
        .map((item) => {
          // 字符串项 → 文本；对象项 → 个性属性覆盖公共属性
          const itemOptions =
            typeof item === 'string'
              ? { ...common, text: item }
              : { ...common, ...item };
          return this.build(itemOptions)[0];
        }),
    );
  }

  /**
   * 渲染：为标签绑定关闭交互，不重写标签内容
   * 标签 DOM 多来自静态标记（initializer 自动渲染），或由 build() 生成后插入
   * @returns {this}
   */
  render() {
    const options = this.options;
    const $elem = options.$elem;

    // 目标元素不存在时提示并直接返回
    if (!$elem[0]) {
      console.warn(`[tag] 未找到目标元素：${options.elem}`);
      return this;
    }

    // 静态 HTML 声明 data-lay-closable 属性时自动注入关闭按钮（禁用标签不注入，免去手动编写关闭节点）
    if (
      $elem.is('[data-lay-closable]') &&
      !$elem.hasClass(CONST.CLASS_IS_DISABLED) &&
      !$elem.find(`.${CONST.ELEM_CLOSE}`).length
    ) {
      $elem.append(Tag.#createCloseButton());
    }

    const eventNamespace = CONST.EVENT_NAMESPACE;
    const clickEventName = `click${eventNamespace}`;
    const keydownEventName = `keydown${eventNamespace}`;

    // 为含关闭按钮的标签绑定关闭行为（事件委托到标签本身，便于统一清理）
    $elem
      .off(`${clickEventName} ${keydownEventName}`)
      .on(clickEventName, `.${CONST.ELEM_CLOSE}`, events.close)
      .on(keydownEventName, `.${CONST.ELEM_CLOSE}`, events.closeByKey);

    return this;
  }
}

// 基础事件体
const events = {
  // 点击关闭按钮
  close() {
    const $this = $(this);
    const $tag = $this.closest(`.${CONST.ELEM}`);

    // 禁用标签不可关闭。build 生成的禁用标签无关闭按钮，此处主要兜底静态 HTML 场景的键盘路径
    if ($tag.hasClass(CONST.CLASS_IS_DISABLED)) return;

    const filter = $tag.attr('lay-filter') || '';

    // 触发 close 事件；回调返回 false 可阻断关闭
    const enable = lay.event.call(this, Tag.componentName, `close(${filter})`, {
      elem: $tag[0],
      tag: $tag,
    });
    if (enable === false) return;

    $tag.remove();
  },

  // 键盘关闭（Enter / 空格）
  closeByKey(event) {
    if (event.code === 'Enter' || event.code === 'Space') {
      event.preventDefault();
      events.close.call(this);
    }
  },
};

const CONST = Tag.CONST;

export { Tag as tag };
