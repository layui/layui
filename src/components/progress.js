/**
 * progress
 * 进度条组件
 */

import { $ } from 'jquery';
import { Component } from '../core/component.js';

/**
 * 标准化百分值
 * @param {number|string} value - 进度值字符串或数字
 * @returns {number}
 */
const normalizePercent = (value) => {
  value = Number.isFinite(value) ? value : Number(value);
  if (value < 0) return 0;
  if (value > 100) return 100;
  return value || 0;
};

export class Progress extends Component {
  static componentName = 'progress';

  // 默认配置
  static options = {
    elem: '.lay-progress',
  };

  static get CONST() {
    return {
      ...super.CONST,
      ELEM: 'lay-progress',
      ATTR_PERCENT: 'lay-percent',
    };
  }

  render() {
    const options = this.options;
    const $elem = options.$elem;
    const value = $elem.attr(CONST.ATTR_PERCENT);
    const percent = normalizePercent(value);
    const progressColor = $elem.attr(`${CONST.ELEM}-color`);
    const progressRailColor = $elem.attr(`${CONST.ELEM}-rail-color`);
    const $progressRail = (this.$progressRail = $('<div>').addClass(
      `${CONST.ELEM}-rail`,
    ));
    const $progressBar = (this.$progressBar = $('<div>').addClass(
      `${CONST.ELEM}-bar`,
    ));

    // 设置轨道和进度条样式
    $progressRail.css({
      'background-color': progressRailColor || '',
    });
    $progressBar.css({
      width: `${percent}%`,
      'background-color': progressColor || '',
    });

    // 插入进度条结构
    $elem.empty().append($progressRail.append($progressBar));

    // 是否显示进度值
    if ($elem.is('[lay-show-percent]')) {
      const $progressInfo = (this.$progressInfo = $('<div>')
        .addClass(`${CONST.ELEM}-info`)
        .text(`${percent}%`));
      $elem.append($progressInfo);
    }
  }

  /**
   * 动态改变进度条
   * @param {string} id - 组件实例 id
   * @param {string|number} value - 进度值
   * @returns {typeof Progress}
   */
  static setValue(id, value) {
    const inst = this.getInstance(id);
    if (!inst) return;

    const options = inst.options;
    const $elem = options.$elem;
    const $progressBar = inst.$progressBar;
    const $progressInfo = inst.$progressInfo;
    const percent = normalizePercent(value);

    $elem.attr(CONST.ATTR_PERCENT, percent);
    $progressBar.css('width', `${percent}%`);
    $progressInfo?.text(`${percent}%`);
  }
}

const CONST = Progress.CONST;

// export
export { Progress as progress };
