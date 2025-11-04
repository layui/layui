import $ from 'jquery';
import { component as component$1 } from '../core/component.js';

/**
 * breadcrumb
 * 面包屑导航组件
 */


// 创建组件
var component = component$1({
  name: 'breadcrumb',
  // 组件名

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

export { component as breadcrumb };
