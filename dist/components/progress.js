import $ from 'jquery';
import { component as component$1 } from '../core/component.js';

/**
 * progress
 * 进度条组件
 */


// 创建组件
var component = component$1({
  name: 'progress',
  // 组件名

  // 默认配置
  config: {
    elem: '.layui-progress'
  },
  CONST: {
    ELEM: 'layui-progress'
  },
  render: function () {
    var that = this;
    var options = that.config;
    options.elem.each(function () {
      var othis = $(this);
      var elemBar = othis.find('.layui-progress-bar');
      var percent = elemBar.attr('lay-percent');
      elemBar.css('width', function () {
        return /^.+\/.+$/.test(percent) ? new Function('return ' + percent)() * 100 + '%' : percent;
      });
      if (othis.attr('lay-showpercent')) {
        setTimeout(function () {
          elemBar.html('<span class="' + CONST.ELEM + '-text">' + percent + '</span>');
        }, 350);
      }
    });
  }
});
var CONST = component.CONST;

// 扩展组件接口
$.extend(component, {
  // 动态改变进度条
  setValue: function (filter, percent) {
    var ELEM = 'layui-progress';
    var elem = $('.' + ELEM + '[lay-filter=' + filter + ']');
    var elemBar = elem.find('.' + ELEM + '-bar');
    var text = elemBar.find('.' + ELEM + '-text');
    elemBar.css('width', function () {
      return /^.+\/.+$/.test(percent) ? new Function('return ' + percent)() * 100 + '%' : percent;
    }).attr('lay-percent', percent);
    text.text(percent);
    return this;
  }
});

export { component as progress };
