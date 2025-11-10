/**
 * breadcrumb
 * 面包屑导航组件
 */

layui.define('component', function (exports) {
  'use strict';

  var $ = layui.$;

  // 创建组件
  var component = layui.component({
    name: 'breadcrumb', // 组件名

    // 默认配置
    config: {
      elem: '.layui-breadcrumb'
    },

    render: function () {
      var that = this;
      var options = that.config;

      options.elem.each(function () {
        var othis = $(this);
        var ATTE_SPR = 'lay-separator';
        var separator = othis.attr(ATTE_SPR) || '/';
        var aNode = othis.find('a');
        if (aNode.next('span[' + ATTE_SPR + ']')[0]) return;
        aNode.each(function (index) {
          if (index === aNode.length - 1) return;
          $(this).after('<span ' + ATTE_SPR + '>' + separator + '</span>');
        });
        othis.css('visibility', 'visible');
      });
    }
  });

  var CONST = component.CONST;

  // export
  exports(CONST.MOD_NAME, component);
});
