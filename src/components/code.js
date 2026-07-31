/**
 * code
 * Code 预览组件
 */

import { lay } from '../core/lay.js';
import { i18n } from '../core/i18n.js';
import { $ } from 'jquery';
import { Component } from '../core/component.js';
import { openWindow } from '../utils/index.js';
import { initializer } from './initializer.js';
import { layer } from './layer.js';
import { tabs } from './tabs.js';

// 去除尾部空格
const trimEnd = function (str) {
  return String(str).replace(/\s+$/, '');
};

// 保留首行缩进
const trim = function (str) {
  return trimEnd(str).replace(/^\n|\n$/, '');
};

// '1,3-5,8' -> [1,3,4,5,8]
const parseHighlightedLines = function (rangeStr) {
  if (typeof rangeStr !== 'string') return [];

  return rangeStr.split(',').flatMap((item) => {
    const range = item.split('-');
    const start = parseInt(range[0], 10);
    const end = parseInt(range[1], 10);

    if (!start || start < 1) return [];
    if (!end) return [start];

    const length = end - start + 1;
    if (length <= 0) return [];

    return Array.from({ length }, (_, index) => start + index);
  });
};

// 引用自 https://github.com/innocenzi/shiki-processor/blob/efa20624be415c866cc8e350d1ada886b6b5cd52/src/utils/create-range-processor.ts#L7
// 添加了 HTML 注释支持，用来处理预览场景
const highlightLineRegex =
  /(?:\/\/|\/\*{1,2}|<!--|&lt;!--) *\[!code ([\w+-]+)(?::(\d+))?] *(?:\*{1,2}\/|-->|--&gt;)?/;

const preprocessHighlightLine = function (highlightLineOptions, codeLines) {
  highlightLineOptions = highlightLineOptions || {};

  const lineClassMap = Object.create(null);
  const preClassMap = Object.create(null);
  let hasHighlightLine = false;
  let needParseComment = false;

  const updateLineClassMap = function (lineNumber, className) {
    if (!lineClassMap[lineNumber]) {
      lineClassMap[lineNumber] = [CONST.ELEM_LINE];
    }
    if (className && lineClassMap[lineNumber].indexOf(className) === -1) {
      lineClassMap[lineNumber].push(className);
    }
  };

  const appendPreClass = function (opts) {
    if (opts.classActivePre) {
      preClassMap[opts.classActivePre] = true;
    }
  };

  Object.entries(highlightLineOptions).forEach(([, opts]) => {
    opts = opts || {};

    if (opts.range) {
      const highlightLines = parseHighlightedLines(opts.range);
      if (highlightLines.length > 0) {
        hasHighlightLine = true;
        appendPreClass(opts);
        highlightLines.forEach((lineNumber) => {
          updateLineClassMap(lineNumber, opts.classActiveLine);
        });
      }
    }

    if (opts.comment) {
      needParseComment = true;
    }
  });

  if (needParseComment) {
    codeLines.forEach((line, i) => {
      const match = line.match(highlightLineRegex);
      if (!match || !match[1] || !lay.hasOwn(highlightLineOptions, match[1])) {
        return;
      }

      const opts = highlightLineOptions[match[1]];
      if (!opts.comment) return;

      hasHighlightLine = true;
      appendPreClass(opts);

      const lines = parseInt(match[2], 10);
      const range =
        match[2] && lines && lines > 1
          ? `${i + 1}-${i + lines}`
          : String(i + 1);

      parseHighlightedLines(range).forEach((lineNumber) => {
        updateLineClassMap(lineNumber, opts.classActiveLine);
      });
    });
  }

  return {
    needParseComment,
    hasHighlightLine,
    preClass: Object.keys(preClassMap).join(' '),
    lineClassMap,
  };
};

export class Code extends Component {
  static componentName = 'code';

  // 默认参数项
  static options = {
    elem: '.lay-code', // 元素选择器
    about: '', // 代码栏右上角信息
    ln: true, // 代码区域是否显示行号
    header: false, // 是否显示代码栏头部区域
    encode: true, // 是否对 code 进行编码（若开启预览，则强制开启）
    copy: true, // 是否开启代码区域复制功能图标
    text: {
      code: lay.escape('</>'),
      preview: 'Preview',
    },
    wordWrap: true, // 是否自动换行
    lang: 'text', // 指定语言类型
    highlighter: false, // 是否开启语法高亮，可选值: hljs | prism | shiki
    langMarker: false, // 代码区域是否显示语言类型标记
    highlightLine: {
      focus: {
        range: '',
        comment: false,
        classActiveLine: 'lay-code-line-has-focus',
        classActivePre: 'lay-code-has-focused-lines',
      },
      hl: {
        comment: false,
        classActiveLine: 'lay-code-line-highlighted',
      },
      '++': {
        comment: false,
        classActiveLine: 'lay-code-line-diff-add',
      },
      '--': {
        comment: false,
        classActiveLine: 'lay-code-line-diff-remove',
      },
    },
  };

  static get CONST() {
    return {
      ...super.CONST,
      ELEM_VIEW: 'lay-code-view',
      ELEM_TABS: 'lay-tabs',
      ELEM_HEADER: 'lay-code-header',
      ELEM_FULL: 'lay-code-full',
      ELEM_PREVIEW: 'lay-code-preview',
      ELEM_ITEM: 'lay-code-item',
      ELEM_SHOW: 'lay-show',
      ELEM_LINE: 'lay-code-line',
      ELEM_LINE_NUM: 'lay-code-line-number',
      ELEM_LN_MODE: 'lay-code-ln-mode',
      CODE_DATA_CLASS: 'LayuiCodeDataClass',
      LINE_RAW_WIDTH: 45, // 行号初始宽度，需与 css 保持一致
    };
  }

  // 实例方法静态委托
  static {
    this.delegateInstanceMethods([
      'copy',
      'focusLine',
      'getCode',
      'getFinalCode',
      'highlightLines',
    ]);
  }

  /**
   * 组件渲染
   * @param {Object} options - 配置项
   * @returns {Code|Code[]}
   */
  static render(options = {}) {
    const elem = options.elem || this.options.elem;
    const $elem = $(elem);

    if ($elem.length > 1) {
      const batchOptions = { ...options };
      const elems = options.obverse ? $elem.get() : $elem.get().reverse();
      delete batchOptions.id;

      const result = elems.map((elem) =>
        super.render({
          ...batchOptions,
          elem,
        }),
      );

      options.allDone?.(result);
      return result;
    }

    const result = super.render(options);
    if (Array.isArray(result)) {
      options.allDone?.(result);
    }
    return result;
  }

  constructor(options) {
    super(options);
    this.overrideArrayOptions(options);
  }

  // 渲染
  render() {
    const options = this.options;
    const $elem = options.$elem;

    if (!$elem?.[0]) return;

    this.#normalizeOptions();
    this.#setCode();
    this.#resetView();
    this.#initToolkit();

    if (options.preview) {
      this.#renderPreview();
    }

    this.#renderCodeView();
    this.#renderHeader();
    this.#renderFixbar();
    this.#events();

    setTimeout(() => {
      if (options.preview) return;
      options.done?.({});
    }, 3);

    lay.event.call(
      $elem[0],
      this.constructor.componentName,
      `afterRender(${options.id})`,
      this,
    );
  }

  /**
   * 获取原始 code
   * @returns {string}
   */
  getCode() {
    return this.rawCode || '';
  }

  /**
   * 获取经过 codeParse 处理后的 code
   * @returns {string}
   */
  getFinalCode() {
    return String(this.#parseCode(this.getCode()));
  }

  /**
   * 复制当前 code
   * @returns {void}
   */
  copy() {
    const options = this.options;
    const code = lay.unescape(this.getFinalCode());
    const hasOnCopy = typeof options.onCopy === 'function';

    lay.clipboard.writeText({
      text: code,
      done: () => {
        if (hasOnCopy) {
          const ret = options.onCopy(code, true);
          if (ret === false) return;
        }

        layer.msg(i18n.$t('code.copied'), { icon: 1 });
      },
      error: () => {
        if (hasOnCopy) {
          const ret = options.onCopy(code, false);
          if (ret === false) return;
        }
        layer.msg(i18n.$t('code.copyError'), { icon: 2 });
      },
    });
  }

  /**
   * 聚焦指定行
   * @param {string} range - 行范围，如 '1,3-5,8'
   * @returns {Code}
   */
  focusLine(range) {
    return this.highlightLines('focus', range);
  }

  /**
   * 设置指定类型的行高亮
   * @param {string} type - highlightLine 类型
   * @param {string} range - 行范围
   * @returns {Code}
   */
  highlightLines(type, range) {
    const options = this.options;
    const highlightLine = (options.highlightLine = options.highlightLine || {});
    highlightLine[type] = highlightLine[type] || {};
    highlightLine[type].range = range;
    this.render();
    return this;
  }

  #normalizeOptions() {
    const options = this.options;
    const defaultOptions = this.constructor.options;

    // codeRender 需要关闭编码；未使用 codeRender 时若开启预览，则强制开启编码
    options.encode = (options.encode || options.preview) && !options.codeRender;

    options.text = $.extend(
      true,
      {},
      defaultOptions.text,
      lay.isPlainObject(options.text) ? options.text : {},
    );

    if (lay.isPlainObject(options.highlightLine)) {
      options.highlightLine = $.extend(
        true,
        {},
        defaultOptions.highlightLine,
        options.highlightLine,
      );
    }

    if (!Array.isArray(options.layout)) {
      options.layout = ['code', 'preview'];
    }

    options.tools = Array.isArray(options.tools) ? options.tools.concat() : [];

    if (
      options.copy &&
      options.preview &&
      options.tools.indexOf('copy') === -1
    ) {
      options.tools.unshift('copy');
    }

    if (options.appendTools) {
      options.tools = options.tools.concat(options.appendTools);
    }

    options.tools = Array.from(new Set(options.tools));
  }

  #setCode() {
    const options = this.options;
    const $elem = options.$elem;

    if (lay.hasOwn(options, 'code')) {
      options.code = String(options.code);
      this.rawCode = options.code;
      return;
    }

    const textarea = $elem.children('textarea');
    const code = [];

    textarea.each(function () {
      code.push(trim(this.value));
    });

    if (code.length === 0) {
      code.push(trim($elem.html()));
    }

    options.code = code.join('');
    this.rawCode = options.code;
  }

  #resetView() {
    const options = this.options;
    const $elem = options.$elem;
    const dataClassKey = CONST.CODE_DATA_CLASS;
    const hasDataClass = dataClassKey in $elem.data();

    if (hasDataClass) {
      $elem.attr('class', $elem.data(dataClassKey) || '');
    } else {
      $elem.data(dataClassKey, $elem.attr('class'));
    }

    $elem
      .removeClass(
        [
          CONST.ELEM_VIEW,
          CONST.ELEM_LN_MODE,
          'lay-border-box',
          'lay-code-nowrap',
          'lay-code-theme-dark',
          'lay-code-theme-light',
          'lay-code-hl',
          'hljs',
          'prism',
          'shiki',
          `language-${options.lang}`,
          'lay-code-has-focused-lines',
        ].join(' '),
      )
      .removeAttr('lay-code-index')
      .css('--lay-code-side-width', '');

    const $preview = $elem.parent(`.${CONST.ELEM_PREVIEW}`);
    const $tabsElem = $preview.children(`.${CONST.ELEM_TABS}`);
    const $previewItem = $preview.children(`.${CONST.ELEM_ITEM}-preview`);

    $tabsElem.remove();
    $previewItem.remove();

    if ($preview[0]) {
      $elem.unwrap();
    }

    if (this.tabsId) {
      tabs.removeInstance(this.tabsId);
    }

    $('html,body').removeClass('lay-scrollbar-hide');
  }

  #initToolkit() {
    this.toolkit = {
      copy: {
        title: [i18n.$t('code.copy')],
        iconName: 'file-b',
        onClick: () => {
          this.copy();
        },
      },
    };
  }

  #extendPreviewToolkit() {
    $.extend(this.toolkit, {
      full: {
        title: [i18n.$t('code.maximize'), i18n.$t('code.restore')],
        iconName: 'screen-full',
        onClick(obj) {
          const elem = obj.elem;
          const elemView = elem.closest(`.${CONST.ELEM_PREVIEW}`);
          const classNameFull = `lay-icon-${this.iconName}`;
          const classNameRestore = 'lay-icon-screen-restore';
          const title = this.title;
          const htmlElem = $('html,body');
          const ELEM_SCROLLBAR_HIDE = 'lay-scrollbar-hide';

          if (elem.hasClass(classNameFull)) {
            elemView.addClass(CONST.ELEM_FULL);
            elem.removeClass(classNameFull).addClass(classNameRestore);
            elem.attr('title', title[1]);
            htmlElem.addClass(ELEM_SCROLLBAR_HIDE);
          } else {
            elemView.removeClass(CONST.ELEM_FULL);
            elem.removeClass(classNameRestore).addClass(classNameFull);
            elem.attr('title', title[0]);
            htmlElem.removeClass(ELEM_SCROLLBAR_HIDE);
          }
        },
      },
      window: {
        title: [i18n.$t('code.preview')],
        iconName: 'release',
        onClick: () => {
          openWindow({
            content: this.getFinalCode(),
          });
        },
      },
    });

    $.extend(this.toolkit, this.options.extendToolkit);
  }

  #renderPreview() {
    const options = this.options;
    const $elem = options.$elem;
    const isIframePreview = options.preview === 'iframe';
    const elemView = $(`<div class="${CONST.ELEM_PREVIEW}">`);
    const elemTabsView = $(`<div class="${CONST.ELEM_TABS}">`);
    const elemHeaderView = $('<div class="lay-tabs-header">');
    const elemPreviewView = $(
      `<div class="${CONST.ELEM_ITEM} ${CONST.ELEM_ITEM}-preview lay-border">`,
    );
    const elemToolbar = $('<div class="lay-code-tools"></div>');

    this.tabsId = `LAY-CODE-TABS-${options.id}`;
    this.#extendPreviewToolkit();

    if (options.id) elemView.attr('id', options.id);
    elemView.addClass(options.className);

    options.layout.forEach(function (value, i) {
      const li = $(`<li lay-id="${value}">`);
      if (i === 0) li.addClass(CONST.CLASS_THIS);
      li.html(options.text[value]);
      elemHeaderView.append(li);
    });

    elemToolbar.on('click', '>i', (event) => {
      const elem = $(event.currentTarget);
      const name = elem.data('name');
      const parameters = this.#getToolParameters(elem, name);

      this.toolkit[name]?.onClick?.(parameters);
      options.onToolClick?.(parameters);
    });

    options.tools.forEach((name) => {
      const tool = this.toolkit[name];
      if (!tool) return;

      elemToolbar.append(
        `<i class="lay-icon lay-icon-${tool.iconName}" data-name="${name}" title="${tool.title[0]}"></i>`,
      );
    });

    $elem.addClass(CONST.ELEM_ITEM).wrap(elemView);
    elemTabsView.append(elemHeaderView);
    options.tools.length && elemTabsView.append(elemToolbar);
    $elem.before(elemTabsView);

    if (isIframePreview) {
      elemPreviewView.html(
        '<iframe allowtransparency="true" frameborder="0"></iframe>',
      );
    }

    if (options.layout[0] === 'preview') {
      elemPreviewView.addClass(CONST.ELEM_SHOW);
      $elem.before(elemPreviewView);
      this.#runPreview(elemPreviewView);
    } else {
      $elem.addClass(CONST.ELEM_SHOW).after(elemPreviewView);
    }

    options.previewStyle = [options.style, options.previewStyle].join('');
    elemPreviewView.attr('style', options.previewStyle);

    tabs.render({
      elem: elemTabsView,
      id: this.tabsId,
    });

    tabs.on(`afterChange(${this.tabsId})`, (data) => {
      const { thisHeaderItem } = data;
      const thisElem = thisHeaderItem.closest(`.${CONST.ELEM_PREVIEW}`);
      const elemItemBody = thisElem.find(`.${CONST.ELEM_ITEM}`);
      const thisItemBody = elemItemBody.eq(data.index);

      elemItemBody.removeClass(CONST.ELEM_SHOW);
      thisItemBody.addClass(CONST.ELEM_SHOW);

      if (thisHeaderItem.attr('lay-id') === 'preview') {
        this.#runPreview(thisItemBody);
      }

      this.#setCodeLayout();
    });
  }

  #renderCodeView() {
    const options = this.options;
    const $elem = options.$elem;
    const codeElem = (this.$codeElem = $(
      '<code class="lay-code-wrap"></code>',
    ));
    const classNames = [CONST.ELEM_VIEW, 'lay-border-box'];
    const theme = options.theme || options.skin;

    if (!options.wordWrap) {
      classNames.push('lay-code-nowrap');
    }

    $elem.addClass(classNames.join(' ')).attr('lay-code-index', this.index);

    if (theme) {
      $elem.removeClass('lay-code-theme-dark lay-code-theme-light');
      $elem.addClass(`lay-code-theme-${theme}`);
    }

    if (options.highlighter) {
      $elem.addClass(`${options.highlighter} lay-code-hl`);
      if (options.highlighter === 'prism') {
        $elem.addClass(`language-${options.lang}`);
      }
    }

    const createCodeResult = this.#createCode(
      options.encode ? lay.escape(this.getFinalCode()) : this.getCode(),
    );

    this.lines = createCodeResult.lines;
    $elem.html(codeElem.html(createCodeResult.html));

    if (createCodeResult.preClass) {
      $elem.addClass(createCodeResult.preClass);
    }

    if (options.ln) {
      $elem.append('<div class="lay-code-ln-side"></div>');
    }

    if (options.height) {
      codeElem.css('max-height', options.height);
    }

    options.codeStyle = [options.style, options.codeStyle].join('');
    if (options.codeStyle) {
      codeElem.attr('style', function (i, val) {
        return (val || '') + options.codeStyle;
      });
    }

    this.#setCodeLayout();
  }

  #renderHeader() {
    const options = this.options;

    if (!options.header) return;

    const headerElem = $(`<div class="${CONST.ELEM_HEADER}"></div>`);
    headerElem.html(options.title || options.text.code);
    options.$elem.prepend(headerElem);
  }

  #renderFixbar() {
    const options = this.options;
    const elemFixbar = $('<div class="lay-code-fixbar"></div>');

    if (options.copy && !options.preview) {
      const copyElem = $(
        [
          '<span class="lay-code-copy">',
          `<i class="lay-icon lay-icon-file-b" title="${i18n.$t(
            'code.copy',
          )}"></i>`,
          '</span>',
        ].join(''),
      );

      copyElem.on('click', () => {
        this.copy();
      });

      elemFixbar.append(copyElem);
    }

    if (options.langMarker) {
      elemFixbar.append(
        `<span class="lay-code-lang-marker">${options.lang}</span>`,
      );
    }

    if (options.about) {
      elemFixbar.append(options.about);
    }

    options.$elem.append(elemFixbar);
  }

  #events() {
    const options = this.options;
    const eventNamespace = CONST.EVENT_NAMESPACE;

    options.$elem.off(eventNamespace);
  }

  #createCode(code) {
    const options = this.options;
    const sourceLines = String(code).split(/\r?\n/g);
    const highlightLineInfo = preprocessHighlightLine(
      options.highlightLine,
      sourceLines,
    );
    const strippedLines = highlightLineInfo.needParseComment
      ? sourceLines.map((line) => line.replace(highlightLineRegex, ''))
      : sourceLines;
    let html = strippedLines.join('\n');

    if (typeof options.codeRender === 'function') {
      html = options.codeRender(String(html), options);
    }

    const renderedLines = String(html).split(/\r?\n/g);
    const lineHtml = renderedLines
      .map((line, num) => {
        const lineClass =
          highlightLineInfo.hasHighlightLine &&
          highlightLineInfo.lineClassMap[num + 1]
            ? highlightLineInfo.lineClassMap[num + 1].join(' ')
            : CONST.ELEM_LINE;

        return [
          `<div class="${lineClass}">`,
          options.ln
            ? [
                `<div class="${CONST.ELEM_LINE_NUM}">`,
                `${lay.digit(num + 1)}.`,
                '</div>',
              ].join('')
            : '',
          '<div class="lay-code-line-content">',
          line || ' ',
          '</div>',
          '</div>',
        ].join('');
      })
      .join('');

    return {
      lines: renderedLines,
      html: lineHtml,
      preClass: highlightLineInfo.preClass,
    };
  }

  #setCodeLayout() {
    const options = this.options;
    const $elem = options.$elem;
    const lineElem = this.$codeElem?.children(`.${CONST.ELEM_LINE}`);

    if (!options.ln || !lineElem?.length) return;

    const width = lineElem
      .last()
      .children(`.${CONST.ELEM_LINE_NUM}`)
      .outerWidth();

    $elem.addClass(CONST.ELEM_LN_MODE);

    if (this.lines.length >= 100 && width > CONST.LINE_RAW_WIDTH) {
      $elem.css('--lay-code-side-width', `${width}px`);
    }
  }

  #runPreview(thisItemBody) {
    const options = this.options;
    const iframe = thisItemBody.children('iframe')[0];

    if (options.preview === 'iframe' && iframe) {
      iframe.srcdoc = this.getFinalCode();
    } else {
      thisItemBody.html(this.getFinalCode());
    }

    setTimeout(() => {
      options.done?.({
        container: thisItemBody,
        options,
        instance: this,
        render() {
          initializer.render({
            elem: thisItemBody,
          });
        },
      });
    }, 3);
  }

  #parseCode(code) {
    const options = this.options;
    return typeof options.codeParse === 'function'
      ? options.codeParse(code, options)
      : code;
  }

  #getToolParameters(elem, name) {
    const options = this.options;

    return {
      elem,
      name,
      options,
      instance: this,
      rawCode: this.getCode(),
      finalCode: lay.unescape(this.getFinalCode()),
    };
  }
}

const CONST = Code.CONST;

export { Code as code };
