/**
 * i18n
 * 国际化
 */

layui.define('lay', function(exports) {
  'use strict';

  var lay = layui.lay;
  var hint  = layui.hint();

  var MOD_NAME = 'i18n';

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
    layer: {
      confirm: '确定',
      cancel: '取消',
      defaultTitle: '信息',
      prompt: {
        InputLengthPrompt: '最多输入 {length} 个字符'
      },
      photos: {
        noData: '没有图片',
        tools:{
          rotate: '旋转',
          scaleX: '水平变换',
          zoomIn: '放大',
          zoomOut: '缩小',
          reset: '还原',
          close: '关闭'
        },
        viewPicture: '查看原图',
        urlError: {
          prompt: '当前图片地址异常，<br>是否继续查看下一张？',
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
      noData: '无数据',
      tools:{
        filter: {
          title: '筛选列'
        },
        export: {
          title: '导出',
          noDataPrompt: '当前表格无数据',
          compatPrompt: '导出功能不支持 IE，请用 Chrome 等高级浏览器导出',
          csvText : '导出 CSV 文件'
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
      noData: '无数据',
      noMatch: '无匹配数据',
      title: ['列表一', '列表二'],
      searchPlaceholder: '关键词搜索'
    },
    tree: {
      defaultNodeName: '未命名',
      noData: '无数据',
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
        currentFilesLength: '您当前已经选择了: {length} 个文件',
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
        meridiem: function(hours, minutes){
          var hm = hours * 100 + minutes;
          if (hm < 600) {
            return '凌晨';
          } else if (hm < 900) {
            return '早上';
          } else if (hm < 1100) {
            return '上午';
          } else if (hm < 1300) {
            return '中午';
          } else if (hm < 1800) {
            return '下午';
          }
          return '晚上';
        }
      }
    }
  };

  // 默认配置
  var config = lay.extend({
    locale: 'zh-CN', // 全局内置语言
    messages: { // 全局国际化消息对象
      'zh-CN': zhCN
    }
  }, GLOBAL.i18n); // 读取全局预设配置，确保打包后的版本初始调用时机

  var OBJECT_REPLACE_REGEX = /\{(\w+)\}/g;
  var INDEX_REPLACE_REGEX = /\{(\d+)\}/g;

  /**
   * 获取对象中的值，lodash _.get 简易版
   * @param {Record<string, any>} obj
   * @param {string} path
   * @param {any} defaultValue
   */
  function get(obj, path, defaultValue) {
    // 'a[0].b.c' ==> ['a', '0', 'b', 'c']
    var casePath = path.replace(/\[(\d+)\]/g, '.$1').split('.');
    var result = obj;

    for(var i = 0; i < casePath.length; i++) {
      result = result && result[casePath[i]];
      if(result === null || result === undefined){
        return defaultValue;
      }
    }

    return result;
  }

  var i18n = {
    config: config,
    set: function(options) {
      lay.extend(config, options);
    }
  };

  /**
   * 根据给定的键从国际化消息中获取翻译后的内容
   * 未文档化的私有方法，仅限内部使用
   *
   * @internal
   * @param {string} key 要翻译的键
   * @param {Record<string, any> | any[] | ...any} [args] 可选的占位符替换参数：
   * - 对象形式：用于替换 `{key}` 形式的占位符；
   * - 数组形式：用于替换 `{0}`, `{1}` 等占位符；
   * - 可变参数：用于替换 `{0}`, `{1}` 等占位符。
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
   *
   * @example 使用变长参数替换索引占位符
   * message: {
   *   hello: '{0} world'
   * }
   * i18n.$t('message.hello', 'Hello')
   */
  i18n.translation = function(key) {
    var options = config;
    var args = arguments;
    var i18nMessage = options.messages[options.locale];

    if (!i18nMessage) {
      hint.error('Locale "' + options.locale + '" not found. Please add i18n messages for this locale first.', 'warn');
      return key;
    }

    var result = get(i18nMessage, key, key);

    // 替换占位符
    if (typeof result === 'string' && args.length > 1) {
      var opts = args[1];
      // 第二个参数为对象或数组，替换占位符 {key} 或 {0}, {1}...
      if (opts !== null && typeof opts === 'object') {
        return result.replace(OBJECT_REPLACE_REGEX, function(match, key) {
          return opts[key] !== undefined ? opts[key] : match;
        });
      }

      // 处理可变参数，替换占位符 {0}, {1}...
      return result.replace(INDEX_REPLACE_REGEX, function(match, index) {
        var arg = args[index + 1];
        return arg !== undefined ? arg : match;
      });
    }

    return result;
  };

  /**
   * i18n.translation 的别名，用于简化代码书写，未文档化仅限内部使用
   */
  i18n.$t = i18n.translation;

  exports(MOD_NAME, i18n);
});
