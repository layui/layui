/**
 * element
 * 常用元素操作
 */

import { layui } from '../core/layui.js';
import $ from 'jquery';
import { componentBuilder } from '../core/component.js';
import { tab } from './tab.js';
import { nav } from './nav.js';
import { breadcrumb } from './breadcrumb.js';
import { progress } from './progress.js';
import { collapse } from './collapse.js';

const elements = { tab, nav, breadcrumb, progress, collapse };

// 创建组件
const component = componentBuilder({
  name: 'element', // 模块名

  CONST: {
    MOD_NAME: 'element',
  },
});

// const CONST = component.CONST;

// 保留原接口，确保向下兼容
$.extend(component, {
  render(type, filter) {
    const elemFilter = (function () {
      if (typeof filter === 'string' && filter) {
        return '[lay-filter="' + filter + '"]';
      }
      return '';
    })();
    const components = {
      tab: '.layui-tab' + elemFilter,
      nav: '.layui-nav' + elemFilter,
      breadcrumb: '.layui-breadcrumb' + elemFilter,
      progress: '.layui-progress' + elemFilter,
      collapse: '.layui-collapse' + elemFilter,
    };

    // 仅允许渲染指定组件
    if (type && !components[type]) return;

    // 若 filter 为 jQuery 对象
    if (type && typeof filter === 'object' && filter instanceof $) {
      return elements[type].render({
        elem: filter,
      });
    }

    return components[type]
      ? elements[type].render({
          elem: components[type],
        })
      : layui.each(components, function (componentName) {
          elements[componentName].render({
            elem: components[componentName],
          });
        });
  },

  tabAdd: tab.tabAdd,
  tabDelete: tab.tabDelete,
  tabChange: tab.tabChange,
  tab: tab.tab,

  progress: progress.setValue,
});

component.init = component.render;

// 自动渲染
$(() => {
  component.render();
});

export { component as element };
