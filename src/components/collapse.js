/**
 * collapse
 * 折叠面板组件
 */

import { lay } from '../core/lay.js';
import { $ } from 'jquery';
import { Component } from '../core/component.js';

export class Collapse extends Component {
  static componentName = 'collapse';

  // 默认配置
  static options = {
    elem: '.lay-collapse',
  };

  // 渲染
  render() {
    const options = this.options;
    const $items = options.$elem.find('.lay-collapse-item');
    const eventNamespace = CONST.EVENT_NAMESPACE;

    $items.each(function () {
      const $this = $(this);
      const $title = $this.find('.lay-collapse-title');
      const $content = $this.find('.lay-collapse-content');
      const isNone = $content.css('display') === 'none';
      const clickEventName = `click${eventNamespace}`;

      // 初始状态
      $title.find('.lay-collapse-icon').remove();
      $title.append(
        '<i class="lay-icon lay-icon-right lay-collapse-icon"></i>',
      );
      $this[isNone ? 'removeClass' : 'addClass'](CONST.CLASS_SHOW);

      // 点击标题
      $title.off(clickEventName).on(clickEventName, events.titleClick);
    });
  }
}

// 基础事件体
const events = {
  // 点击面板标题项
  titleClick() {
    const $this = $(this);
    const wrapper = $this.closest('.lay-collapse');
    const filter = wrapper.attr('lay-filter');

    const ANIM_MS = 200; // 动画过渡毫秒数
    const CLASS_ITEM = '.lay-collapse-item';
    const CLASS_CONTENT = '.lay-collapse-content';

    const thisItemElem = $this.parent(CLASS_ITEM);
    const thisContentElem = $this.siblings(CLASS_CONTENT);
    const isNone = thisContentElem.css('display') === 'none';
    const isAccordion = typeof wrapper.attr('lay-accordion') === 'string';

    // 动画执行完成后的操作
    const complete = function () {
      $(this).css('display', ''); // 剔除动画生成的 style display，以适配外部样式的状态重置
    };

    // 是否正处于动画中的状态
    if (thisContentElem.is(':animated')) return;

    // 展开或收缩
    if (isNone) {
      // 先执行 slideDown 动画，再标注展开状态样式，避免元素 `block` 状态导致动画无效
      thisContentElem.slideDown(ANIM_MS, complete);
      thisItemElem.addClass(CONST.CLASS_SHOW);
    } else {
      // 先取消展开状态样式，再将元素临时显示，避免 `none` 状态导致 slideUp 动画无效
      thisItemElem.removeClass(CONST.CLASS_SHOW);
      thisContentElem.show().slideUp(ANIM_MS, complete);
    }

    // 是否开启手风琴
    if (isAccordion) {
      const itemSiblings = thisItemElem.siblings(`.${CONST.CLASS_SHOW}`);
      itemSiblings.removeClass(CONST.CLASS_SHOW);
      itemSiblings.children(CLASS_CONTENT).show().slideUp(ANIM_MS, complete);
    }

    // 事件
    lay.event.call(this, Collapse.componentName, `click(${filter})`, {
      title: $this,
      content: thisContentElem,
      show: isNone,
    });
  },
};

const CONST = Collapse.CONST;

// export
export { Collapse as collapse };
