/**
 * date
 * 日期时间工具
 */

import { lay } from '../core/lay.js';
import { i18n } from '../core/i18n.js';
import { log } from '../core/logger.js';
import { $ } from 'jquery';

// 正则引用自 dayjs
// https://github.com/iamkun/dayjs/blob/v1.11.9/src/constant.js#L30
const REGEX_FORMAT =
  /\[([^\]]+)]|y{1,4}|M{1,2}|d{1,2}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|SSS/g;
const REGEX_PARSE =
  /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[T\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/i;

/**
 * 转化为指定格式的日期字符串
 * @param {number|string|Date} time - 毫秒级时间戳或日期对象
 * @param {string} format - 日期格式
 * @param {Object} options - 选项
 * @param {Function} options.customMeridiem - 自定义 meridiem 格式
 * @returns {string}
 */
export function toDateString(time, format, options) {
  // 若 null 或空字符，则返回空字符
  if (time === null || time === '') {
    return '';
  }

  // 标准化 time 参数值
  var normalizeDate = function (date) {
    if (typeof date === 'undefined') {
      return new Date();
    }
    if (!isNaN(date)) {
      return new Date(typeof date === 'string' ? parseInt(date) : date);
    }
    if (typeof date === 'string' && !/Z$/i.test(date)) {
      var d = date.match(REGEX_PARSE);
      if (d) {
        var m = d[2] - 1 || 0;
        var ms = (d[7] || '0').substring(0, 3);
        return new Date(
          d[1],
          m,
          d[3] || 1,
          d[4] || 0,
          d[5] || 0,
          d[6] || 0,
          ms,
        );
      }
    }

    return new Date(date);
  };
  var date = normalizeDate(time);

  if (!date.getDate()) {
    return (
      log('Invalid millisecond for "utils.toDateString(millisecond)"'),
      ''
    );
  }

  var years = date.getFullYear();
  var month = date.getMonth();
  var days = date.getDate();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();
  var milliseconds = date.getMilliseconds();

  var defaultMeridiem = i18n.$t('utils.toDateString.meridiem');

  var meridiem = (options && options.customMeridiem) || defaultMeridiem;

  var matches = {
    yy: function () {
      return String(years).slice(-2);
    },
    yyyy: function () {
      return lay.digit(years, 4);
    },
    M: function () {
      return String(month + 1);
    },
    MM: function () {
      return lay.digit(month + 1);
    },
    d: function () {
      return String(days);
    },
    dd: function () {
      return lay.digit(days);
    },
    H: function () {
      return String(hours);
    },
    HH: function () {
      return lay.digit(hours);
    },
    h: function () {
      return String(hours % 12 || 12);
    },
    hh: function () {
      return lay.digit(hours % 12 || 12);
    },
    A: function () {
      return meridiem(hours, minutes);
    },
    m: function () {
      return String(minutes);
    },
    mm: function () {
      return lay.digit(minutes);
    },
    s: function () {
      return String(seconds);
    },
    ss: function () {
      return lay.digit(seconds);
    },
    SSS: function () {
      return lay.digit(milliseconds, 3);
    },
  };

  format = format || 'yyyy-MM-dd HH:mm:ss';

  return format.replace(REGEX_FORMAT, function (match, $1) {
    return $1 || (matches[match] && matches[match]()) || match;
  });
}

/**
 * 倒计时
 * @param {Object} options
 * @param {number|string|Date} options.date - 目标时间值
 * @param {number|string|Date} options.now - 当前时间值,一般取当前服务器时间
 * @param {Function} [options.ready] - 倒计时准备就绪的回调函数
 * @param {Function} options.clock - 计时中的回调函数
 * @param {Function} [options.done] - 计时完成后的回调函数
 * @returns {Object} inst - 倒计时实例对象
 * @returns {Function} inst.clear - 清除计时器
 * @returns {Function} inst.reload - 重置倒计时
 */
export function countdown(options) {
  // 默认可选项
  options = $.extend(
    true,
    {
      date: new Date(),
      now: new Date(),
    },
    options,
  );

  // 实例对象
  var inst = {
    options: options,
    // 清除计时器
    clear: function () {
      clearTimeout(inst.timer);
    },
    // 重置倒计时
    reload: function (opts) {
      this.clear();
      $.extend(
        true,
        this.options,
        {
          now: new Date(),
        },
        opts,
      );
      count();
    },
  };

  typeof options.ready === 'function' && options.ready();

  // 计算倒计时
  var count = (function fn() {
    var date = new Date(options.date);
    var now = new Date(options.now);
    var countTime = (function (time) {
      return time > 0 ? time : 0;
    })(date.getTime() - now.getTime());
    var result = {
      d: Math.floor(countTime / (1000 * 60 * 60 * 24)), // 天
      h: Math.floor(countTime / (1000 * 60 * 60)) % 24, // 时
      m: Math.floor(countTime / (1000 * 60)) % 60, // 分
      s: Math.floor(countTime / 1000) % 60, // 秒
    };
    var next = function () {
      now.setTime(now.getTime() + 1000);
      options.now = now;
      count();
    };

    // 计时 - 以秒间隔
    inst.timer = setTimeout(next, 1000);
    typeof options.clock === 'function' && options.clock(result, inst);

    // 计时完成
    if (countTime <= 0) {
      clearTimeout(inst.timer);
      typeof options.done === 'function' && options.done(result, inst);
    }

    return fn;
  })();

  return inst;
}

/**
 * 某个时间在多久前
 * @param {number|string|Date} time - 某个时间的毫秒数或日期对象
 * @param {boolean} onlyDate - 是否在超过 30 天后，只返回日期字符串
 * @returns {string} 返回时间描述字符串
 */
export function timeAgo(time, onlyDate) {
  var arr = [[], []];
  var stamp = new Date().getTime() - new Date(time).getTime();

  // 返回具体日期
  if (stamp > 1000 * 60 * 60 * 24 * 31) {
    stamp = new Date(time);
    arr[0][0] = lay.digit(stamp.getFullYear(), 4);
    arr[0][1] = lay.digit(stamp.getMonth() + 1);
    arr[0][2] = lay.digit(stamp.getDate());

    // 是否输出时间
    if (!onlyDate) {
      arr[1][0] = lay.digit(stamp.getHours());
      arr[1][1] = lay.digit(stamp.getMinutes());
      arr[1][2] = lay.digit(stamp.getSeconds());
    }

    return arr[0].join('-') + (arr[1].length ? ` ${arr[1].join(':')}` : '');
  }

  // 30 天以内，返回「多久前」
  if (stamp >= 1000 * 60 * 60 * 24) {
    return i18n.$t('utils.timeAgo.days', {
      days: (stamp / 1000 / 60 / 60 / 24) | 0,
    });
  } else if (stamp >= 1000 * 60 * 60) {
    return i18n.$t('utils.timeAgo.hours', {
      hours: (stamp / 1000 / 60 / 60) | 0,
    });
  } else if (stamp >= 1000 * 60 * 3) {
    // 3 分钟以内为：刚刚
    return i18n.$t('utils.timeAgo.minutes', {
      minutes: (stamp / 1000 / 60) | 0,
    });
  } else if (stamp < 0) {
    return i18n.$t('utils.timeAgo.future');
  } else {
    return i18n.$t('utils.timeAgo.justNow');
  }
}
