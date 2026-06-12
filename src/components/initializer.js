/**
 * initializer
 * 初始化渲染器
 */

import { lay } from '../core/lay.js';
import { $ } from 'jquery';
import { nav } from './nav.js';
import { breadcrumb } from './breadcrumb.js';
import { collapse } from './collapse.js';
import { progress } from './progress.js';
import { form } from './form.js';
import { tabs } from './tabs.js';

const components = {
  nav,
  breadcrumb,
  collapse,
  progress,
  form,
  tabs,
};

export class Initializer {
  /**
   * 初始化需自动渲染的组件。
   * @param {Object} [options] - 初始化配置
   * @param {string|Element|JQuery} [options.elem] - 渲染作用域容器
   * @returns {typeof Initializer}
   */
  static render(options = {}) {
    const $container = options.elem ? $(options.elem) : null;

    for (const [componentName, component] of Object.entries(components)) {
      const CLASS_ELEM = `.lay-${componentName}`;
      const elem = $container
        ? $container.find(CLASS_ELEM).addBack(CLASS_ELEM)
        : component?.options?.elem || CLASS_ELEM;
      const $elem = $(elem);

      // 仅当元素存在时渲染组件
      if (!$elem.length) continue;

      if (componentName === 'form') {
        component.render($elem);
        continue;
      }

      component.render({ elem });
    }

    return this;
  }
}

lay.use(function () {
  Initializer.render();
});

export { Initializer as initializer };
