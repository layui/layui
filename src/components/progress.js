/**
 * progress
 * 进度条组件
 */

import { $ } from 'jquery';
import { Component } from '../core/component.js';

export class Progress extends Component {
  // 默认配置
  static options = {
    elem: '.lay-progress',
  };

  static get CONST() {
    return {
      ...super.CONST,
      ELEM: 'lay-progress',
    };
  }

  render() {
    const options = this.options;
    const $elem = options.$elem;
    const elemBar = $elem.find('.lay-progress-bar');
    const percent = elemBar.attr('lay-percent');

    elemBar.css('width', function () {
      return /^.+\/.+$/.test(percent)
        ? `${new Function(`return ${percent}`)() * 100}%`
        : percent;
    });

    if ($elem.attr('lay-showpercent')) {
      setTimeout(() => {
        elemBar.html(`<span class="${CONST.ELEM}-text">${percent}</span>`);
      }, 350);
    }
  }

  // 动态改变进度条
  static setValue(filter, percent) {
    const $elem = $(`.${CONST.ELEM}[lay-filter=${filter}]`);
    const $elemBar = $elem.find(`.${CONST.ELEM}-bar`);
    const $text = $elemBar.find(`.${CONST.ELEM}-text`);

    $elemBar
      .css('width', function () {
        return /^.+\/.+$/.test(percent)
          ? `${new Function(`return ${percent}`)() * 100}%`
          : percent;
      })
      .attr('lay-percent', percent);
    $text.text(percent);
    return this;
  }
}

const CONST = Progress.CONST;

// export
export { Progress as progress };
