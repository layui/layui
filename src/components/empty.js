/**
 * empty
 * 空状态组件
 */

import { $ } from 'jquery';
import { Component } from '../core/component.js';

export class Empty extends Component {
  static componentName = 'empty';

  // 默认配置项
  static options = {
    elem: '',

    // 自定义图标内容（HTML 字符串）；
    // 值为 false 则不渲染图标容器（纯文字空态），为空字符串时将显示默认内置图标
    icon: '',
    text: '', // 主文案
    description: '', // 描述文案
    action: '', // 操作区内容（HTML 字符串）
  };

  static get CONST() {
    return {
      ...super.CONST,
      ELEM: 'lay-empty',
      ELEM_ICON: 'lay-empty-icon',
      ELEM_TEXT: 'lay-empty-text',
      ELEM_DESCRIPTION: 'lay-empty-description',
      ELEM_ACTION: 'lay-empty-action',
    };
  }

  /**
   * 构建并返回空状态的 DOM 结构，不插入到目标容器
   * @param {Object} options - 组件配置项，详见 {@link Empty.options}
   * @returns {jQuery} 空状态 jQuery 对象
   */
  static build(options) {
    options = { ...this.options, ...options };

    const $empty = $('<div>').addClass(CONST.ELEM);

    // 图标。options.icon 为 false 时不渲染图标容器（纯文字空态）；
    // 否则渲染图标容器，为空时由 CSS 的 :empty::before 自动显示默认图标
    if (options.icon !== false) {
      const $icon = $('<div>').addClass(CONST.ELEM_ICON);
      if (options.icon) {
        $icon.html(options.icon);
      }
      $empty.append($icon);
    }

    // 主文案
    if (options.text) {
      $empty.append($('<p>').addClass(CONST.ELEM_TEXT).text(options.text));
    }

    // 描述文案
    if (options.description) {
      $empty.append(
        $('<p>').addClass(CONST.ELEM_DESCRIPTION).text(options.description),
      );
    }

    // 操作区
    if (options.action) {
      $empty.append(
        $('<div>').addClass(CONST.ELEM_ACTION).html(options.action),
      );
    }

    return $empty;
  }

  // 渲染空状态到目标元素
  render() {
    const options = this.options;
    const $elem = options.$elem;

    // 目标元素不存在时提示并直接返回
    if (!$elem[0]) {
      console.warn(`[empty] 未找到目标元素：${options.elem}`);
      return this;
    }

    $elem.empty().append(this.constructor.build(options));

    return this;
  }
}

const CONST = Empty.CONST;

// export
export { Empty as empty };
