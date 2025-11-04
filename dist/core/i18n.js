import { layui } from './layui.js';
import { lay } from './lay.js';

/**
 * i18n
 * 国际化
 */

var hint = layui.hint();
// var MOD_NAME = 'i18n';

// 识别预先可能定义的指定全局对象
var GLOBAL = window.LAYUI_GLOBAL || {};

// 简体中文
var zhCN = {
  code: {
    copy: '复制代码',
    copied: '已复制',
    copyError: '复制失败',
    maximize: '最大化显示',
    restore: '还原显示',
    preview: '在新窗口预览'
  },
  colorpicker: {
    clear: '清除',
    confirm: '确定'
  },
  dropdown: {
    noData: '暂无数据'
  },
  flow: {
    loadMore: '加载更多',
    noMore: '没有更多了'
  },
  form: {
    select: {
      noData: '暂无数据',
      noMatch: '无匹配数据',
      placeholder: '请选择'
    },
    validateMessages: {
      required: '必填项不能为空',
      phone: '手机号格式不正确',
      email: '邮箱格式不正确',
      url: '链接格式不正确',
      number: '只能填写数字',
      date: '日期格式不正确',
      identity: '身份证号格式不正确'
    },
    verifyErrorPromptTitle: '提示'
  },
  laydate: {
    months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    weeks: ['日', '一', '二', '三', '四', '五', '六'],
    time: ['时', '分', '秒'],
    literal: {
      year: '年'
    },
    selectDate: '选择日期',
    selectTime: '选择时间',
    startTime: '开始时间',
    endTime: '结束时间',
    tools: {
      confirm: '确定',
      clear: '清空',
      now: '现在',
      reset: '重置'
    },
    rangeOrderPrompt: '结束时间不能早于开始时间\n请重新选择',
    invalidDatePrompt: '不在有效日期或时间范围内\n',
    formatErrorPrompt: '日期格式不合法\n必须遵循：\n{format}\n',
    autoResetPrompt: '已自动重置',
    preview: '当前选中的结果'
  },
  layer: {
    confirm: '确定',
    cancel: '取消',
    defaultTitle: '信息',
    prompt: {
      InputLengthPrompt: '最多输入 {length} 个字符'
    },
    photos: {
      noData: '没有图片',
      tools: {
        rotate: '旋转',
        scaleX: '水平变换',
        zoomIn: '放大',
        zoomOut: '缩小',
        reset: '还原',
        close: '关闭'
      },
      viewPicture: '查看原图',
      urlError: {
        prompt: '当前图片地址异常，\n是否继续查看下一张？',
        confirm: '下一张',
        cancel: '不看了'
      }
    }
  },
  laypage: {
    prev: '上一页',
    next: '下一页',
    first: '首页',
    last: '尾页',
    total: '共 {total} 条',
    pagesize: '条/页',
    goto: '到第',
    page: '页',
    confirm: '确定'
  },
  table: {
    sort: {
      asc: '升序',
      desc: '降序'
    },
    noData: '暂无数据',
    tools: {
      filter: {
        title: '筛选列'
      },
      export: {
        title: '导出',
        noDataPrompt: '当前表格无数据',
        compatPrompt: '导出功能不支持 IE，请用 Chrome 等高级浏览器导出',
        csvText: '导出 CSV 文件'
      },
      print: {
        title: '打印',
        noDataPrompt: '当前表格无数据'
      }
    },
    dataFormatError: '返回的数据不符合规范，正确的成功状态码应为："{statusName}": {statusCode}',
    xhrError: '请求异常，错误提示：{msg}'
  },
  transfer: {
    noData: '暂无数据',
    noMatch: '无匹配数据',
    title: ['列表一', '列表二'],
    searchPlaceholder: '关键词搜索'
  },
  tree: {
    defaultNodeName: '未命名',
    noData: '暂无数据',
    deleteNodePrompt: '确认删除"{name}"节点吗？'
  },
  upload: {
    fileType: {
      file: '文件',
      image: '图片',
      video: '视频',
      audio: '音频'
    },
    validateMessages: {
      fileExtensionError: '选择的{fileType}中包含不支持的格式',
      filesOverLengthLimit: '同时最多只能上传: {length} 个文件',
      currentFilesLength: '当前已经选择了: {length} 个文件',
      fileOverSizeLimit: '文件大小不能超过 {size}'
    },
    chooseText: '{length} 个文件'
  },
  util: {
    timeAgo: {
      days: '{days} 天前',
      hours: '{hours} 小时前',
      minutes: '{minutes} 分钟前',
      future: '未来',
      justNow: '刚刚'
    },
    toDateString: {
      // https://www.unicode.org/cldr/charts/47/supplemental/day_periods.html
      meridiem: function (hours, minutes) {
        var hm = hours * 100 + minutes;
        if (hm < 500) {
          return '凌晨';
        } else if (hm < 800) {
          return '早上';
        } else if (hm < 1200) {
          return '上午';
        } else if (hm < 1300) {
          return '中午';
        } else if (hm < 1900) {
          return '下午';
        }
        return '晚上';
      }
    }
  }
};

// 默认配置
var config = lay.extend({
  locale: 'zh-CN',
  // 全局内置语言
  messages: {
    // 全局国际化消息对象
    'zh-CN': zhCN
  }
}, GLOBAL.i18n); // 读取全局预设配置，确保打包后的版本初始调用时机

var OBJECT_REPLACE_REGEX = /\{(\w+)\}/g;

/**
 * 获取对象中指定路径的值，类似于 lodash 的 _.get 方法（简易版）
 * @param {Record<string, any>} obj - 要查找的对象
 * @param {string} path - 要查找的路径，支持类似 'a[0].b.c' 的格式
 * @param {any} defaultValue - 若未找到对应值时返回的默认值
 * @returns {any} - 找到的值或默认值
 */
function get(obj, path, defaultValue) {
  // 'a[0].b.c' ==> ['a', '0', 'b', 'c']
  var casePath = path.replace(/\[(\d+)\]/g, '.$1').split('.');
  var result = obj;
  for (var i = 0; i < casePath.length; i++) {
    result = result && result[casePath[i]];
    if (result === null || result === undefined) {
      return defaultValue;
    }
  }
  return result;
}

/**
 * 为纯函数创建具有缓存功能的版本，类似于 lodash 的 _.memoize 方法（简易版）
 * @template T
 * @param {(key: string, ...args) => T} fn - 需要缓存的函数，第一个参数为键
 * @returns {{(key: string, ...args): T, cleanup: () => void}} - 带有缓存的函数
 */
function memoize(fn) {
  /** @type Record<string, T> */
  var cache = Object.create(null);
  function cachedFn(key) {
    var hit = cache[key];
    return hit || (cache[key] = fn.apply(cache, arguments));
  }
  cachedFn.cleanup = function () {
    cache = Object.create(null);
  };
  return cachedFn;
}

/**
 * 对传入的值进行转义处理
 * 若值为字符串，直接进行转义；若为函数，对函数返回的字符串进行转义；若为数组，对数组中的字符串元素进行转义
 * @param {any} value - 需要进行转义处理的值
 * @returns {any} - 转义后的结果
 */
function escape(value) {
  if (typeof value === 'string') {
    value = lay.escape(value);
  } else if (typeof value === 'function') {
    var origFn = value;
    value = function () {
      var val = origFn.apply(this, arguments);
      return typeof val === 'string' ? lay.escape(val) : val;
    };
  } else if (layui.type(value) === 'array') {
    value = value.map(function (v) {
      return typeof v === 'string' ? lay.escape(v) : v;
    });
  }
  return value;
}
function isDef(value) {
  return value !== null && value !== undefined;
}
var resolveValue = memoize(function (path, obj, defaultValue) {
  var pathParts = path.split(':');
  var locale = pathParts[0];
  path = pathParts[1];
  var value = get(obj, path, defaultValue);
  if (layui.cache.debug) {
    var isFallback = defaultValue === value || value === path;
    var isNotFound = !isDef(value) || isFallback;
    if (isNotFound) {
      hint.errorOnce("Not found '" + path + "' key in '" + locale + "' locale messages.", 'warn');
    }
    if (isFallback) {
      hint.errorOnce("Fallback to default message for key: '" + path + "'", 'warn');
    }
  }
  return isDef(value) ? value : path;
});
var i18n = {
  config: config,
  set: function (options) {
    lay.extend(config, options);
    resolveValue.cleanup();
  }
};

/**
 * 根据给定的键从国际化消息中获取翻译后的内容
 * 未文档化的私有方法，仅限内部使用
 *
 * @internal
 * @param {string} keypath 要翻译的键路径
 * @param {Record<string, any> | any[]} [parameters] 可选的占位符替换参数：
 * - 对象形式：用于替换 `{key}` 形式的占位符；
 * - 数组形式：用于替换 `{0}`, `{1}` 等占位符；
 * @param {{locale: string, default: string}} [options] 翻译选项
 * @returns {string} 翻译后的文本
 *
 * @example 使用对象替换命名占位符
 * message: {
 *   hello: '{msg} world'
 * }
 * i18n.$t('message.hello', { msg: 'Hello' })
 *
 * @example 使用数组替换索引占位符
 * message: {
 *   hello: '{0} world'
 * }
 * i18n.$t('message.hello', ['Hello'])
 */
i18n.translation = function (keypath, parameters, options) {
  var locale = options && options.locale || config.locale;
  var i18nMessages = config.messages[locale];
  var namespace = locale + ':';
  var hasDefault = options && lay.hasOwn(options, 'default');
  var fallbackMessage = hasDefault ? options.default : undefined;
  if (!i18nMessages && !hasDefault) {
    hint.errorOnce("Locale '" + locale + "' not found. Please add i18n messages for this locale first.", 'warn');
  }
  var result = resolveValue(namespace + keypath, i18nMessages, fallbackMessage);

  // 替换占位符
  if (typeof result === 'string' && parameters) {
    // 第二个参数为对象或数组，替换占位符 {key} 或 {0}, {1}...
    result = result.replace(OBJECT_REPLACE_REGEX, function (match, key) {
      return parameters[key] !== undefined ? parameters[key] : match;
    });
  }
  return escape(result);
};

/**
 * i18n.translation 的别名，用于简化代码书写，未文档化仅限内部使用
 */
i18n.$t = i18n.translation;

export { i18n };
