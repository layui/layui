/**
 * element
 * 常用元素操作
 */

layui.define(
  ['component', 'tab', 'nav', 'breadcrumb', 'progress', 'collapse'],
  function (exports) {
    'use strict';

    var $ = layui.$;
    var tab = layui.tab;
    var progress = layui.progress;

    // 创建组件
    var component = layui.component({
      name: 'element', // 模块名

      CONST: {
        MOD_NAME: 'element'
      }
    });

    var CONST = component.CONST;

    // 保留原接口，确保向下兼容
    $.extend(component, {
      render: function (type, filter) {
        var elemFilter = (function () {
          if (typeof filter === 'string' && filter) {
            return '[lay-filter="' + filter + '"]';
          }
          return '';
        })();
        var components = {
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
          return layui[type].render({
            elem: filter
          });
        }

        return components[type]
          ? layui[type].render({
              elem: components[type]
            })
          : layui.each(components, function (componentName) {
              layui[componentName].render({
                elem: components[componentName]
              });
            });
      },

      tabAdd: tab.tabAdd,
      tabDelete: tab.tabDelete,
      tabChange: tab.tabChange,
      tab: tab.tab,

      progress: progress.setValue
    });

    component.init = component.render;

    // 自动渲染
    $(function () {
      component.render();
    });

    exports(CONST.MOD_NAME, component);
  }
);
