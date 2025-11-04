import { layui } from '../core/layui.js';
import $ from 'jquery';
import { component as component$1 } from '../core/component.js';
import { tab as component$3 } from './tab.js';
import { nav as component$6 } from './nav.js';
import { breadcrumb as component$5 } from './breadcrumb.js';
import { progress as component$2 } from './progress.js';
import { collapse as component$4 } from './collapse.js';

/**
 * element
 * 常用元素操作
 */

const elements = {
  tab: component$3,
  nav: component$6,
  breadcrumb: component$5,
  progress: component$2,
  collapse: component$4
};

// 创建组件
const component = component$1({
  name: 'element',
  // 模块名

  CONST: {
    MOD_NAME: 'element'
  }
});

// const CONST = component.CONST;

// 保留原接口，确保向下兼容
$.extend(component, {
  render(type, filter) {
    const elemFilter = function () {
      if (typeof filter === 'string' && filter) {
        return '[lay-filter="' + filter + '"]';
      }
      return '';
    }();
    const components = {
      tab: '.layui-tab' + elemFilter,
      nav: '.layui-nav' + elemFilter,
      breadcrumb: '.layui-breadcrumb' + elemFilter,
      progress: '.layui-progress' + elemFilter,
      collapse: '.layui-collapse' + elemFilter
    };

    // 仅允许渲染指定组件
    if (type && !components[type]) return;

    // 若 filter 为 jQuery 对象
    if (type && typeof filter === 'object' && filter instanceof $) {
      return elements[type].render({
        elem: filter
      });
    }
    return components[type] ? elements[type].render({
      elem: components[type]
    }) : layui.each(components, function (componentName) {
      elements[componentName].render({
        elem: components[componentName]
      });
    });
  },
  tabAdd: component$3.tabAdd,
  tabDelete: component$3.tabDelete,
  tabChange: component$3.tabChange,
  tab: component$3.tab,
  progress: component$2.setValue
});
component.init = component.render;

// 自动渲染
$(() => {
  component.render();
});

export { component as element };
