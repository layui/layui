/**
 * progress
 * 进度条
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

    // 进度值
    percent: 0,

    // 是否显示进度值
    showPercent: false,

    // 进度条颜色
    // color: '',

    // 轨道颜色
    // railColor: '',

    // 尺寸；可选值: xs|sm|md(默认)|lg|xl
    // size: ''
  };

  static get CONST() {
    return {
      ...super.CONST,
      ELEM: 'lay-progress',
    };
  }

  // 实例方法静态委托
  static {
    this.delegateInstanceMethods(['setValue']);
  }

  /**
   * 渲染
   * @returns {void}
   */
  render() {
    const options = this.options;
    const $elem = options.$elem;
    const percent = normalizePercent(options.percent);
    const $progressRail = (this.$progressRail = $('<div>').addClass(
      `${CONST.ELEM}-rail`,
    ));
    const $progressBar = (this.$progressBar = $('<div>').addClass(
      `${CONST.ELEM}-bar`,
    ));

    // 设置 size 属性
    if (['xs', 'sm', 'md', 'lg', 'xl'].includes(options.size)) {
      $elem.attr('data-lay-size', options.size);
    }

    // 设置轨道和进度条样式
    $progressRail.css({
      'background-color': options.railColor || '',
    });
    $progressBar.css({
      width: `${percent}%`,
      'background-color': options.color || '',
    });

    // 插入进度条结构
    $elem.empty().append($progressRail.append($progressBar));

    // 是否显示进度值
    if (options.showPercent) {
      const $progressInfo = (this.$progressInfo = $('<div>')
        .addClass(`${CONST.ELEM}-info`)
        .text(`${percent}%`));
      $elem.append($progressInfo);
    }
  }

  /**
   * 动态改变进度条
   * @param {string|number} value - 进度值
   * @returns {void}
   */
  setValue(value) {
    const options = this.options;
    const $progressBar = this.$progressBar;
    const $progressInfo = this.$progressInfo;
    const percent = normalizePercent(value);

    options.percent = percent;
    options.$elem.attr('data-lay-percent', percent);
    $progressBar?.css('width', `${percent}%`);
    $progressInfo?.text(`${percent}%`);
  }
}

const CONST = Progress.CONST;

// export
export { Progress as progress };
