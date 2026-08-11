/**
 * breadcrumb
 * 面包屑
 */

import { $ } from 'jquery';
import { Component } from '../core/component.js';

export class Breadcrumb extends Component {
  static componentName = 'breadcrumb';

  // 默认配置项
  static options = {
    elem: '.lay-breadcrumb',

    // 分隔符
    separator: '/',
  };

  static get CONST() {
    return {
      ...super.CONST,
      ELEM_SEPARATOR: 'lay-breadcrumb-separator',
    };
  }

  // 渲染
  render() {
    const options = this.options;
    const $elem = options.$elem;
    const $aElem = $elem.children('a');

    $aElem.each((index, elem) => {
      if (index === $aElem.length - 1) return;
      const $this = $(elem);
      const $separator = $(`<span class="${CONST.ELEM_SEPARATOR}"></span>`);

      $separator[0].innerHTML = options.separator;
      $this.next(`span.${CONST.ELEM_SEPARATOR}`).remove();
      $this.after($separator);
    });

    $elem.css('visibility', 'visible');
  }
}

const CONST = Breadcrumb.CONST;

export { Breadcrumb as breadcrumb };
