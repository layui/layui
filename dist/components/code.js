import { layui } from '../core/layui.js';
import { lay } from '../core/lay.js';
import { i18n } from '../core/i18n.js';
import $ from 'jquery';
import { util } from './util.js';
import { element as component } from './element.js';
import { layer } from './layer.js';
import { form } from './form.js';
import { tabs as component$1 } from './tabs.js';

/**
 * code
 * Code 预览组件
 */


// 常量
var CONST = {
  ELEM_TAB: 'layui-tab',
  ELEM_HEADER: 'layui-code-header',
  ELEM_FULL: 'layui-code-full',
  ELEM_PREVIEW: 'layui-code-preview',
  ELEM_ITEM: 'layui-code-item',
  ELEM_SHOW: 'layui-show',
  ELEM_LINE: 'layui-code-line',
  ELEM_LINE_NUM: 'layui-code-line-number',
  ELEM_LN_MODE: 'layui-code-ln-mode',
  CDDE_DATA_CLASS: 'LayuiCodeDataClass',
  LINE_RAW_WIDTH: 45 // 行号初始宽度，需与 css 保持一致
};

// 默认参数项
var config = {
  elem: '',
  // 元素选择器
  about: '',
  // 代码栏右上角信息
  ln: true,
  // 代码区域是否显示行号
  header: false,
  // 是否显示代码栏头部区域
  encode: true,
  // 是否对 code 进行编码（若开启预览，则强制开启）
  copy: true,
  // 是否开启代码区域复制功能图标
  // 默认文本
  text: {
    code: util.escape('</>'),
    preview: 'Preview'
  },
  wordWrap: true,
  // 是否自动换行
  lang: 'text',
  // 指定语言类型
  highlighter: false,
  // 是否开启语法高亮，'hljs','prism','shiki'
  langMarker: false,
  // 代码区域是否显示语言类型标记
  // 行高亮
  highlightLine: {
    // 聚焦
    focus: {
      range: '',
      // 高亮范围，不可全局设置值 '1,3-5,8'
      comment: false,
      // 是否解析注释，性能敏感不可全局开启  [!code type:<lines>]
      classActiveLine: 'layui-code-line-has-focus',
      // 添加到高亮行上的类
      classActivePre: 'layui-code-has-focused-lines' // 有高亮行时向根元素添加的类
    },
    // 高亮
    hl: {
      comment: false,
      classActiveLine: 'layui-code-line-highlighted'
    },
    // diff++
    '++': {
      comment: false,
      classActiveLine: 'layui-code-line-diff-add'
    },
    // diff--
    '--': {
      comment: false,
      classActiveLine: 'layui-code-line-diff-remove'
    }
  }
};

// 去除尾部空格
var trimEnd = function (str) {
  return String(str).replace(/\s+$/, '');
};
// 保留首行缩进
var trim = function (str) {
  return trimEnd(str).replace(/^\n|\n$/, '');
};

// '1,3-5,8' -> [1,3,4,5,8]
var parseHighlightedLines = function (rangeStr) {
  if (typeof rangeStr !== 'string') return [];
  var lines = $.map(rangeStr.split(','), function (v) {
    var range = v.split('-');
    var start = parseInt(range[0], 10);
    var end = parseInt(range[1], 10);
    return start && end ? $.map(new Array(end - start + 1), function (_, index) {
      return start + index;
    }) : start ? start : undefined;
  });
  return lines;
};

// 引用自 https://github.com/innocenzi/shiki-processor/blob/efa20624be415c866cc8e350d1ada886b6b5cd52/src/utils/create-range-processor.ts#L7
// 添加了 HTML 注释支持，用来处理预览场景
var highlightLineRegex = /(?:\/\/|\/\*{1,2}|<!--|&lt;!--) *\[!code ([\w+-]+)(?::(\d+))?] *(?:\*{1,2}\/|-->|--&gt;)?/;
var preprocessHighlightLine = function (highlightLineOptions, codeLines) {
  var hasHighlightLine = false;
  var needParseComment = false;
  var lineClassMap = Object.create(null);
  var preClassMap = Object.create(null);
  var updateLineClassMap = function (lineNumber, className) {
    if (!lineClassMap[lineNumber]) {
      lineClassMap[lineNumber] = [CONST.ELEM_LINE];
    }
    lineClassMap[lineNumber].push(className);
  };

  // 收集高亮行 className
  $.each(highlightLineOptions, function (type, opts) {
    if (opts.range) {
      var highlightLines = parseHighlightedLines(opts.range);
      if (highlightLines.length > 0) {
        hasHighlightLine = true;
        if (opts.classActivePre) {
          preClassMap[opts.classActivePre] = true;
        }
        $.each(highlightLines, function (i, lineNumber) {
          updateLineClassMap(lineNumber, opts.classActiveLine);
        });
      }
    }
    if (opts.comment) {
      needParseComment = true;
    }
  });

  // 解析行高亮注释并收集 className
  if (needParseComment) {
    $.each(codeLines, function (i, line) {
      var match = line.match(highlightLineRegex);
      if (match && match[1] && lay.hasOwn(highlightLineOptions, match[1])) {
        var opts = highlightLineOptions[match[1]];
        hasHighlightLine = true;
        if (opts.classActivePre) {
          preClassMap[opts.classActivePre] = true;
        }
        // 高亮的行数
        var lines = parseInt(match[2], 10);
        if (match[2] && lines && lines > 1) {
          var startLine = i + 1;
          var endLine = startLine + lines - 1;
          var highlightLines = parseHighlightedLines(startLine + '-' + endLine);
          if (highlightLines.length > 0) {
            $.each(highlightLines, function (i, lineNumber) {
              updateLineClassMap(lineNumber, opts.classActiveLine);
            });
          }
        } else {
          updateLineClassMap(i + 1, opts.classActiveLine);
        }
      }
    });
  }
  return {
    needParseComment: needParseComment,
    hasHighlightLine: hasHighlightLine,
    preClass: Object.keys(preClassMap).join(' '),
    lineClassMap: lineClassMap
  };
};

// export api
function code(options, mode) {
  options = $.extend(true, {}, config, options);

  // 返回对象
  var ret = {
    config: options,
    reload: function (opts) {
      // 重载
      layui.code(this.updateOptions(opts));
    },
    updateOptions: function (opts) {
      // 更新属性（选项）
      opts = opts || {};
      delete opts.elem;
      return $.extend(true, options, opts);
    },
    reloadCode: function (opts) {
      // 仅重载 code
      layui.code(this.updateOptions(opts), 'reloadCode');
    }
  };

  // 若 elem 非唯一
  var elem = $(options.elem);
  if (elem.length > 1) {
    // 是否正向渲染
    layui.each(options.obverse ? elem : elem.get().reverse(), function () {
      layui.code($.extend({}, options, {
        elem: this
      }), mode);
    });
    return ret;
  }

  // 目标元素是否存在
  var othis = options.elem = $(options.elem);
  if (!othis[0]) return ret;

  // 合并属性上的参数，并兼容旧版本属性写法 lay-*
  $.extend(true, options, lay.options(othis[0]), function (obj) {
    var attrs = ['title', 'height', 'encode', 'skin', 'about'];
    layui.each(attrs, function (i, attr) {
      var value = othis.attr('lay-' + attr);
      if (typeof value === 'string') {
        obj[attr] = value;
      }
    });
    return obj;
  }({}));

  // codeRender 需要关闭编码
  // 未使用 codeRender 时若开启了预览，则强制开启编码
  options.encode = (options.encode || options.preview) && !options.codeRender;

  // 获得初始 code
  options.code = options.code || function () {
    var arr = [];
    var textarea = othis.children('textarea');

    // 若内容放置在 textarea 中
    textarea.each(function () {
      arr.push(trim(this.value));
    });

    // 内容直接放置在元素外层
    if (arr.length === 0) {
      arr.push(trim(othis.html()));
    }
    return arr.join('');
  }();

  // 创建 code 行结构
  var createCode = function (html) {
    // codeRender
    if (typeof options.codeRender === 'function') {
      html = options.codeRender(String(html), options);
    }

    // code 行
    var lines = String(html).split(/\r?\n/g);

    // 预处理行高亮
    var highlightLineInfo = preprocessHighlightLine(options.highlightLine, lines);

    // 包裹 code 行结构
    html = $.map(lines, function (line, num) {
      var lineClass = highlightLineInfo.hasHighlightLine && highlightLineInfo.lineClassMap[num + 1] ? highlightLineInfo.lineClassMap[num + 1].join(' ') : CONST.ELEM_LINE;
      return ['<div class="' + lineClass + '">', options.ln ? ['<div class="' + CONST.ELEM_LINE_NUM + '">', util.digit(num + 1) + '.', '</div>'].join('') : '', '<div class="layui-code-line-content">', (highlightLineInfo.needParseComment ? line.replace(highlightLineRegex, '') : line) || ' ', '</div>', '</div>'].join('');
    });
    if (highlightLineInfo.preClass) {
      othis.addClass(highlightLineInfo.preClass);
    }
    return {
      lines: lines,
      html: html
    };
  };

  // 原始 code
  var rawCode = options.code;

  // 最终 code
  var finalCode = function (code) {
    return typeof options.codeParse === 'function' ? options.codeParse(code, options) : code;
  };

  // 仅重载 code
  if (mode === 'reloadCode') {
    return othis.children('.layui-code-wrap').html(createCode(finalCode(rawCode)).html), ret;
  }

  // 自增索引
  var index = lay.autoIncrementer('code');
  othis.attr('lay-code-index', index);

  // 初始化 className
  var hasDataClass = CONST.CDDE_DATA_CLASS in othis.data();
  if (hasDataClass) {
    othis.attr('class', othis.data(CONST.CDDE_DATA_CLASS) || '');
  }

  // 记录初始 className
  if (!hasDataClass) {
    othis.data(CONST.CDDE_DATA_CLASS, othis.attr('class'));
  }

  // 工具栏
  var tools = {
    copy: {
      className: 'file-b',
      title: [i18n.$t('code.copy')],
      event: function () {
        var code = util.unescape(finalCode(options.code));
        var hasOnCopy = typeof options.onCopy === 'function';

        // 写入剪切板
        lay.clipboard.writeText({
          text: code,
          done: function () {
            if (hasOnCopy) {
              var ret = options.onCopy(code, true);
              if (ret === false) return;
            }
            layer.msg(i18n.$t('code.copied'), {
              icon: 1
            });
          },
          error: function () {
            if (hasOnCopy) {
              var ret = options.onCopy(code, false);
              if (ret === false) return;
            }
            layer.msg(i18n.$t('code.copyError'), {
              icon: 2
            });
          }
        });
      }
    }
  };

  // 移除包裹结构
  (function fn() {
    var elemViewHas = othis.parent('.' + CONST.ELEM_PREVIEW);
    var elemTabHas = elemViewHas.children('.' + CONST.ELEM_TAB);
    var elemPreviewViewHas = elemViewHas.children('.' + CONST.ELEM_ITEM + '-preview');

    // 移除旧结构
    elemTabHas.remove(); // 移除 tab
    elemPreviewViewHas.remove(); // 移除预览区域
    if (elemViewHas[0]) othis.unwrap(); // 移除外层容器

    return fn;
  })();

  // 是否开启预览
  if (options.preview) {
    var FILTER_VALUE = 'LAY-CODE-DF-' + index;
    var layout = options.layout || ['code', 'preview'];
    var isIframePreview = options.preview === 'iframe';

    // 追加 Tab 组件
    var elemView = $('<div class="' + CONST.ELEM_PREVIEW + '">');
    var elemTabView = $('<div class="layui-tab layui-tab-brief">');
    var elemHeaderView = $('<div class="layui-tab-title">');
    var elemPreviewView = $('<div class="' + [CONST.ELEM_ITEM, CONST.ELEM_ITEM + '-preview', 'layui-border'].join(' ') + '">');
    var elemToolbar = $('<div class="layui-code-tools"></div>');
    if (options.id) elemView.attr('id', options.id);
    elemView.addClass(options.className);
    elemTabView.attr('lay-filter', FILTER_VALUE);

    // 标签头
    layui.each(layout, function (i, v) {
      var li = $('<li lay-id="' + v + '">');
      if (i === 0) li.addClass('layui-this');
      li.html(options.text[v]);
      elemHeaderView.append(li);
    });

    // 工具栏
    $.extend(tools, {
      full: {
        className: 'screen-full',
        title: [i18n.$t('code.maximize'), i18n.$t('code.restore')],
        event: function (obj) {
          var el = obj.elem;
          var elemView = el.closest('.' + CONST.ELEM_PREVIEW);
          var classNameFull = 'layui-icon-' + this.className;
          var classNameRestore = 'layui-icon-screen-restore';
          var title = this.title;
          var htmlElem = $('html,body');
          var ELEM_SCROLLBAR_HIDE = 'layui-scrollbar-hide';
          if (el.hasClass(classNameFull)) {
            elemView.addClass(CONST.ELEM_FULL);
            el.removeClass(classNameFull).addClass(classNameRestore);
            el.attr('title', title[1]);
            htmlElem.addClass(ELEM_SCROLLBAR_HIDE);
          } else {
            elemView.removeClass(CONST.ELEM_FULL);
            el.removeClass(classNameRestore).addClass(classNameFull);
            el.attr('title', title[0]);
            htmlElem.removeClass(ELEM_SCROLLBAR_HIDE);
          }
        }
      },
      window: {
        className: 'release',
        title: [i18n.$t('code.preview')],
        event: function () {
          util.openWin({
            content: finalCode(options.code)
          });
        }
      }
    });

    // copy
    if (options.copy) {
      if (layui.type(options.tools) === 'array') {
        // 若 copy 未存在于 tools 中，则追加到最前
        if (options.tools.indexOf('copy') === -1) {
          options.tools.unshift('copy');
        }
      } else {
        options.tools = ['copy'];
      }
    }

    // 工具栏事件
    elemToolbar.on('click', '>i', function () {
      var oi = $(this);
      var type = oi.data('type');
      var parameters = {
        elem: oi,
        type: type,
        options: options,
        // 当前属性选项
        rawCode: options.code,
        // 原始 code
        finalCode: util.unescape(finalCode(options.code)) // 最终 code
      };

      // 内部 tools event
      tools[type] && typeof tools[type].event === 'function' && tools[type].event(parameters);

      // 外部 tools event
      typeof options.toolsEvent === 'function' && options.toolsEvent(parameters);
    });

    // 增加工具栏
    if (options.addTools && options.tools) {
      options.tools = [].concat(options.tools, options.addTools);
    }

    // 渲染工具栏
    layui.each(options.tools, function (i, v) {
      var viso = typeof v === 'object'; // 若为 object 值，则可自定义更多属性
      var tool = viso ? v : tools[v] || {
        className: v,
        title: [v]
      };
      var className = tool.className || tool.type;
      var title = tool.title || [''];
      var type = viso ? tool.type || className : v;
      if (!type) return;

      // 若非内置 tool，则合并到 tools 中
      if (!tools[type]) {
        var obj = {};
        obj[type] = tool;
        $.extend(tools, obj);
      }
      elemToolbar.append('<i class="layui-icon layui-icon-' + className + '" data-type="' + type + '" title="' + title[0] + '"></i>');
    });
    othis.addClass(CONST.ELEM_ITEM).wrap(elemView); // 包裹外层容器
    elemTabView.append(elemHeaderView); // 追加标签头
    options.tools && elemTabView.append(elemToolbar); // 追加工具栏
    othis.before(elemTabView); // 追加标签结构

    // 追加预览
    if (isIframePreview) {
      elemPreviewView.html('<iframe allowtransparency="true" frameborder="0"></iframe>');
    }

    // 执行预览
    var runPreview = function (thisItemBody) {
      var iframe = thisItemBody.children('iframe')[0];

      // 是否 iframe 方式预览
      if (isIframePreview && iframe) {
        iframe.srcdoc = finalCode(options.code);
      } else {
        thisItemBody.html(options.code);
      }

      // 当前实例预览完毕后的回调
      setTimeout(function () {
        typeof options.done === 'function' && options.done({
          container: thisItemBody,
          options: options,
          render: function () {
            form.render(thisItemBody.find('.layui-form'));
            component.render();
            component$1.render({
              elem: ['.' + CONST.ELEM_PREVIEW, '.layui-tabs'].join(' ')
            });
          }
        });
      }, 3);
    };
    if (layout[0] === 'preview') {
      elemPreviewView.addClass(CONST.ELEM_SHOW);
      othis.before(elemPreviewView);
      runPreview(elemPreviewView);
    } else {
      othis.addClass(CONST.ELEM_SHOW).after(elemPreviewView);
    }

    // 内容项初始化样式
    options.previewStyle = [options.style, options.previewStyle].join('');
    elemPreviewView.attr('style', options.previewStyle);

    // tab change
    component.on('tab(' + FILTER_VALUE + ')', function (data) {
      var $this = $(this);
      var thisElem = $(data.elem).closest('.' + CONST.ELEM_PREVIEW);
      var elemItemBody = thisElem.find('.' + CONST.ELEM_ITEM);
      var thisItemBody = elemItemBody.eq(data.index);
      elemItemBody.removeClass(CONST.ELEM_SHOW);
      thisItemBody.addClass(CONST.ELEM_SHOW);
      if ($this.attr('lay-id') === 'preview') {
        runPreview(thisItemBody);
      }
      setCodeLayout();
    });
  }

  // 创建 code 容器
  var codeElem = $('<code class="layui-code-wrap"></code>'); // 此处的闭合标签是为了兼容 IE8

  // 添加主容器 className
  othis.addClass(function (arr) {
    if (!options.wordWrap) arr.push('layui-code-nowrap');
    return arr.join(' ');
  }(['layui-code-view layui-border-box']));

  // code 主题风格
  var theme = options.theme || options.skin;
  if (theme) {
    othis.removeClass('layui-code-theme-dark layui-code-theme-light');
    othis.addClass('layui-code-theme-' + theme);
  }

  // 添加高亮必要的 className
  if (options.highlighter) {
    othis.addClass([options.highlighter, 'language-' + options.lang, 'layui-code-hl'].join(' '));
  }

  // 获取 code 行结构
  var createCodeRst = createCode(options.encode ? util.escape(finalCode(rawCode)) : rawCode // 是否编码
  );
  var lines = createCodeRst.lines;

  // 插入 code
  othis.html(codeElem.html(createCodeRst.html));

  // 插入行号边栏
  if (options.ln) {
    othis.append('<div class="layui-code-ln-side"></div>');
  }

  // 兼容旧版本 height 属性
  if (options.height) {
    codeElem.css('max-height', options.height);
  }

  // code 区域样式
  options.codeStyle = [options.style, options.codeStyle].join('');
  if (options.codeStyle) {
    codeElem.attr('style', function (i, val) {
      return (val || '') + options.codeStyle;
    });
  }

  // 动态设置样式
  var cssRules = [{
    selector: '>.layui-code-wrap>.layui-code-line{}',
    setValue: function (item, value) {
      item.style['padding-left'] = value + 'px';
    }
  }, {
    selector: '>.layui-code-wrap>.layui-code-line>.layui-code-line-number{}',
    setValue: function (item, value) {
      item.style.width = value + 'px';
    }
  }, {
    selector: '>.layui-code-ln-side{}',
    setValue: function (item, value) {
      item.style.width = value + 'px';
    }
  }];

  // 生成初始 style 元素
  var styleElem = lay.style({
    target: othis[0],
    id: 'DF-code-' + index,
    text: $.map($.map(cssRules, function (val) {
      return val.selector;
    }), function (val) {
      return ['.layui-code-view[lay-code-index="' + index + '"]', val].join(' ');
    }).join('')
  });

  // 动态设置 code 布局
  var setCodeLayout = function fn() {
    if (options.ln) {
      var multiLine = Math.floor(lines.length / 100);
      var lineElem = codeElem.children('.' + CONST.ELEM_LINE);
      var width = lineElem.last().children('.' + CONST.ELEM_LINE_NUM).outerWidth();
      othis.addClass(CONST.ELEM_LN_MODE);

      // 若超出 100 行
      if (multiLine && width > CONST.LINE_RAW_WIDTH) {
        lay.getStyleRules(styleElem, function (item, i) {
          try {
            cssRules[i].setValue(item, width);
          } catch {
            // ignore
          }
        });
      }
    }
    return fn;
  }();

  // 创建 code header
  if (options.header) {
    var headerElem = $('<div class="' + CONST.ELEM_HEADER + '"></div>');
    headerElem.html(options.title || options.text.code);
    othis.prepend(headerElem);
  }

  // 创建 code 区域固定条
  var elemFixbar = $('<div class="layui-code-fixbar"></div>');

  // 若开启复制，且未开启预览，则单独生成复制图标
  if (options.copy && !options.preview) {
    var copyElem = $(['<span class="layui-code-copy">', '<i class="layui-icon layui-icon-file-b" title="' + i18n.$t('code.copy') + '"></i>', '</span>'].join(''));

    // 点击复制
    copyElem.on('click', function () {
      tools.copy.event();
    });
    elemFixbar.append(copyElem);
  }

  // 创建 language marker
  if (options.langMarker) {
    elemFixbar.append('<span class="layui-code-lang-marker">' + options.lang + '</span>');
  }

  // 创建 about 自定义内容
  if (options.about) {
    elemFixbar.append(options.about);
  }

  // 生成 code fixbar
  othis.append(elemFixbar);

  // code 渲染完毕后的回调
  if (!options.preview) {
    setTimeout(function () {
      typeof options.done === 'function' && options.done({});
    }, 3);
  }

  // 所有实例渲染完毕后的回调
  if (options.elem.length === index + 1) {
    typeof options.allDone === 'function' && options.allDone();
  }
  return ret;
}

export { code };
