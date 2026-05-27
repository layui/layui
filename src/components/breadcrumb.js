/**
 * breadcrumb
 * 面包屑
 */

import { $ } from 'jquery';
import { Component } from '../core/component.js';

export class Breadcrumb extends Component {
  // 默认配置项
  static options = {
    elem: '.lay-breadcrumb',
  };

  static get CONST() {
    return {
      ...super.CONST,
      ATTR_SEPARATOR: 'lay-separator',
    };
  }

  // 渲染
  render() {
    const options = this.options;
    const $elem = options.$elem;

    const ATTR_SEPARATOR = CONST.ATTR_SEPARATOR;
    const separator = $elem.attr(ATTR_SEPARATOR) || '/';
    const $aElem = $elem.children('a');

    if ($aElem.next('span[' + ATTR_SEPARATOR + ']')[0]) return;

    $aElem.each(function (index) {
      if (index === $aElem.length - 1) return;
      $(this).after(`<span ${ATTR_SEPARATOR}>${separator}</span>`);
    });

    $elem.css('visibility', 'visible');
  }
}

const CONST = Breadcrumb.CONST;

export { Breadcrumb as breadcrumb };
