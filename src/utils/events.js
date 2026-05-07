/**
 * events utils
 */

import { $ } from 'jquery';

/**
 * 批量绑定事件
 * @param {string} [attr="lay-on"] - 触发事件的元素属性名
 * @param {Object.<string, Function>} events - 事件集合
 * @param {Object} [options] - 参数的更多选项
 * @param {(string|HTMLElement|JQuery)} [options.elem="body"] - 触发事件的委托元素
 * @param {string} [options.trigger="click"] - 事件触发的方式
 * @returns {Object} 返回当前 events 参数设置的事件集合
 */
export function on(attr, events, options) {
  // 若参数一为 object 类型，则为事件集，且省略 attr
  if (typeof attr === 'object') {
    options = events || {};
    events = attr;
    attr = options.attr || 'lay-on'; // 默认属性名
  }

  // 更多选项
  options = $.extend(
    {
      elem: 'body',
      trigger: 'click',
    },
    typeof options === 'object'
      ? options
      : {
          trigger: options, // 兼容旧版
        },
  );

  var elem = (options.elem = $(options.elem));
  var attrSelector = '[' + attr + ']';
  var DATANAME = 'UTIL_ON_DATA'; // 缓存在委托元素上的 data-* 属性名

  if (!elem[0]) return; // 若委托元素不存在

  // 初始化 data 默认值，以委托元素为存储单元
  if (!elem.data(DATANAME)) {
    elem.data(DATANAME, {
      events: {},
    });
  }

  // 读取 data 缓存
  var dataCache = elem.data(DATANAME);

  // 根据 attr 和 trigger 的组合作为 key
  var key = attr + '_' + options.trigger;

  // 根据 key 记录事件集合
  events = dataCache.events[key] = $.extend(
    true,
    dataCache.events[key],
    events,
  );

  // 清除事件委托，避免重复绑定
  var trigger = options.trigger + '.lay_util_on';
  elem.off(trigger, attrSelector);

  // 绑定事件委托
  elem.on(trigger, attrSelector, function (e) {
    var othis = $(this);
    var attrValue = othis.attr(attr);
    typeof events[attrValue] === 'function' &&
      events[attrValue].call(this, othis, e);
  });

  return events;
}
