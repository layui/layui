/**
 * code
 * Code 预览组件
 */

layui.define(['lay', 'util', 'element', 'form'], function(exports){
  "use strict";

  var $ = layui.$;
  var util = layui.util;
  var element = layui.element;
  var form = layui.form;
  var layer = layui.layer;
  var lay = layui.lay;

  // 常量
  var CONST = {
    ELEM_VIEW: 'layui-code-view',
    ELEM_COPY: 'layui-code-copy',
    ELEM_TAB: 'layui-tab',
    ELEM_TITLE: 'layui-code-title',
    ELEM_FULL: 'layui-code-full',
    ELEM_PREVIEW: 'layui-code-preview',
    ELEM_ITEM: 'layui-code-item',
    ELEM_SHOW: 'layui-show',
    ELEM_LINE: 'layui-code-line',
    ELEM_LINES: 'layui-code-lines',
    ELEM_LINE_NUMS: 'layui-code-line-numbers',
    ELEM_LINE_NUMBERS_MODE: 'layui-code-line-numbers-mode',
    ELEM_MARKER: 'layui-code-lang-marker'
  };

  // 默认参数项
  var config = {
    elem: '.layui-code', // 元素选择器
    about: '', // 代码栏右上角信息
    ln: true, // 代码区域是否显示行号
    header: false, // 是否显示代码栏头部区域
    encode: true, // 是否对 code 进行编码（若开启预览，则强制开启）
    copy: true, // 是否开启代码区域复制功能图标
    // 默认文本
    text: {
      code: util.escape('</>'),
      preview: 'Preview',
    },
    lang: 'text', // 指定语言类型
    highlighter: false, // 是否开启语法高亮，'prism','hljs','shiki'
    langMarker: false, // 代码区域是否显示语言类型标记
    wrapLines: false, // 是否开启换行
  };

  // 初始索引
  var codeIndex = layui.code ? (layui.code.index + 10000) : 0;

  // 去除尾部空格
  var trimEnd = function(str){
    return String(str).replace(/\s+$/, '');
  }
  // 保留首行缩进
  var trim = function(str){
    return trimEnd(str).replace(/^\n|\n$/, '');
  };

  var resizeLineNumbers = function(elem){
    var elems = $(elem).filter(function(){
      var whiteSpace = layui.getStyle(this, 'white-space')
      return (whiteSpace === 'pre-wrap' || whiteSpace === 'pre-line') && $(this).hasClass(CONST.ELEM_LINE_NUMBERS_MODE);
    })

    if(elems.length === 0) return;

    layui.each(elems, function(_, el){
      var othis = $(el);
      var lineNumbersElem = othis.children('.' + CONST.ELEM_LINE_NUMS);
      var linesElem = othis.children('.' + CONST.ELEM_LINES);

      layui.each(linesElem.children(), function(index, line){
        var rect = line.getBoundingClientRect()
        lineNumbersElem[0].children[index].style.height = (rect.height || rect.bottom - rect.top) + 'px';
      })

      lineNumbersElem.height(linesElem.height());
    })
  }

  // export api
  exports('code', function(options){
    var opts = options = $.extend(true, {}, config, options);

    // 实例对象
    var inst = {
      reload: function(sets) { // 重载
        sets = sets || {};
        delete sets.elem;
        sets = $.extend(true, options, sets);
        layui.code(sets);
      }
    };

    // 若 elem 非唯一
    var elem = $(options.elem);
    if(elem.length > 1){
      // 是否正向渲染
      layui.each(options.obverse ? elem : elem.get().reverse(), function(){
        layui.code($.extend({}, options, {
          elem: this
        }));
      });
      return inst;
    }

    // 目标元素是否存在
    var othis = options.elem = $(options.elem);
    var item = othis[0];
    if(!othis[0]) return inst;

    // 合并属性上的参数，并兼容旧版本属性写法 lay-*
    var options = $.extend(true, {}, opts, lay.options(item), function(obj){
      var attrs = ['title', 'height', 'encode', 'skin', 'about'];
      layui.each(attrs, function(i, attr){
        var value = othis.attr('lay-'+ attr);
        if(typeof value === 'string'){
          obj[attr] = value;
        }
      })
      return obj;
    }({}));

    var index = layui.code.index = ++codeIndex;

    // codeRender 需要关闭编码
    // 未使用 codeRender 时若开启了预览，则强制开启编码
    options.encode = (options.encode || options.preview) && !options.codeRender;

    // 最终显示的代码
    var finalCode;

    // 获得初始代码
    var rawCode = othis.data('code') || function(){
      var arr = [];
      var textarea = othis.children('textarea');

      // 若内容放置在 textarea 中
      textarea.each(function(){
        arr.push(trim(this.value));
      });

      // 内容直接放置在元素外层
      if(arr.length === 0){
        arr.push(trim(othis.html()));
      }

      return arr;
    }();

    othis.data('code', rawCode);

    // code
    var html = finalCode = rawCode.join('');

    // 外部重新解析 code
    if(typeof options.codeParse === 'function'){
      html = finalCode = options.codeParse(html);
    }

    // 工具栏
    var tools = {
      copy: {
        className: 'file-b',
        title: ['复制代码'],
        event: function(el, type){
          var code = util.unescape(finalCode);

          // 写入剪切板
          lay.clipboard.writeText({
            text: code,
            done: function() {
              layer.msg('已复制', {icon: 1});
            },
            error: function() {
              layer.msg('复制失败', {icon: 2});
            }
          });

          typeof options.onCopy === 'function' && options.onCopy(code);
        }
      }
    };

    // 是否开启预览
    if(options.preview){
      var FILTER_VALUE = 'LAY-CODE-DF-'+ index;
      var layout = options.layout || ['code', 'preview'];
      var isIframePreview = options.preview === 'iframe';

      // 追加 Tab 组件
      var elemView = $('<div class="'+ CONST.ELEM_PREVIEW +'">');
      var elemTabView = $('<div class="layui-tab layui-tab-brief">');
      var elemHeaderView = $('<div class="layui-tab-title">');
      var elemPreviewView = $('<div class="'+ [
        CONST.ELEM_ITEM,
        CONST.ELEM_ITEM +'-preview',
        'layui-border'
      ].join(' ') +'">');
      var elemToolbar = $('<div class="layui-code-tools"></div>');
      var elemViewHas = othis.parent('.' + CONST.ELEM_PREVIEW);
      var elemTabHas = othis.prev('.'+ CONST.ELEM_TAB);
      var elemPreviewViewHas = othis.next('.' + CONST.ELEM_ITEM +'-preview');

      if(options.id) elemView.attr('id', options.id);
      elemView.addClass(options.className);
      elemTabView.attr('lay-filter', FILTER_VALUE);

      // 标签头
      layui.each(layout, function(i, v){
        var li = $('<li lay-id="'+ v +'">');
        if(i === 0) li.addClass('layui-this');
        li.html(options.text[v]);
        elemHeaderView.append(li);
      });

      // 工具栏
      $.extend(tools, {
        'full': {
          className: 'screen-full',
          title: ['最大化显示', '还原显示'],
          event: function(el, type){
            var elemView = el.closest('.'+ CONST.ELEM_PREVIEW);
            var classNameFull = 'layui-icon-'+ this.className;
            var classNameRestore = 'layui-icon-screen-restore';
            var title = this.title;
            var html = $('html,body');
            var ELEM_SCROLLBAR_HIDE = 'layui-scrollbar-hide';

            if(el.hasClass(classNameFull)){
              elemView.addClass(CONST.ELEM_FULL);
              el.removeClass(classNameFull).addClass(classNameRestore);
              el.attr('title', title[1]);
              html.addClass(ELEM_SCROLLBAR_HIDE);
            } else {
              elemView.removeClass(CONST.ELEM_FULL);
              el.removeClass(classNameRestore).addClass(classNameFull);
              el.attr('title', title[0]);
              html.removeClass(ELEM_SCROLLBAR_HIDE);
            }
          }
        },
        'window': {
          className: 'release',
          title: ['在新窗口预览'],
          event: function(el, type){
            util.openWin({
              content: finalCode
            });
          }
        }
      });

      // copy
      if(options.copy){
        if(layui.type(options.tools) === 'array'){
          // 若 copy 未存在于 tools 中，则追加到最前
          if(options.tools.indexOf('copy') === -1){
            options.tools.unshift('copy');
          }
        } else {
          options.tools = ['copy'];
        }
      }

      // 工具栏事件
      elemToolbar.on('click', '>i', function(){
        var oi = $(this);
        var type = oi.data('type');

        // 内部 tools event
        tools[type] && typeof tools[type].event === 'function' && tools[type].event(oi, type);

        // 外部 tools event
        typeof options.toolsEvent === 'function' && options.toolsEvent({
          elem: oi,
          type: type,
          rawCode: rawCode.join(''), // 原始 code
          finalCode: util.unescape(finalCode) // 最终 code
        });
      });

      // 渲染工具栏
      layui.each(options.tools, function(i, v){
        var viso = typeof v === 'object'; // 若为 object 值，则可自定义更多属性
        var tool = viso ? v : (
          tools[v] || {
            className: v,
            title: [v]
          }
        );

        var className = tool.className || tool.type;
        var title = tool.title || [''];
        var type = viso ? ( tool.type || className ) : v;

        if (!type) return;

        elemToolbar.append(
          '<i class="layui-icon layui-icon-'+ className +'" data-type="'+ type +'" title="'+ title[0] +'"></i>'
        );
      });

      // 移除旧结构
      if(elemTabHas[0]) elemTabHas.remove(); // 移除 tab
      if(elemPreviewViewHas[0]) elemPreviewViewHas.remove(); // 移除预览区域
      if(elemViewHas[0]) othis.unwrap(); // 移除外层容器

      elemTabView.append(elemHeaderView); // 追加标签头
      options.tools && elemTabView.append(elemToolbar); // 追加工具栏
      othis.wrap(elemView).addClass(CONST.ELEM_ITEM).before(elemTabView); // 追加标签结构


      // 追加预览
      if(isIframePreview){
        elemPreviewView.html('<iframe allowtransparency="true" frameborder="0"></iframe>');
      }

      // 执行预览
      var run = function(thisItemBody){
        var iframe = thisItemBody.children('iframe')[0];
        if(isIframePreview && iframe){
          iframe.srcdoc = finalCode;
        } else {
          thisItemBody.html(rawCode.join(''));
        }
        // 回调的返回参数
        var params = {
          container: thisItemBody,
          render: function(){
            form.render(thisItemBody.find('.layui-form'));
            element.render();
          }
        };

        // 当前实例预览完毕后的回调
        setTimeout(function(){
          typeof options.done === 'function' && options.done(params);
        },3);
      };

      if(layout[0] === 'preview'){
        elemPreviewView.addClass(CONST.ELEM_SHOW);
        othis.before(elemPreviewView);
        run(elemPreviewView);
      } else {
        othis.addClass(CONST.ELEM_SHOW).after(elemPreviewView);
      }

      // 内容项初始化样式
      options.codeStyle = [options.style, options.codeStyle].join('');
      options.previewStyle = [options.style, options.previewStyle].join('');
      // othis.attr('style', options.codeStyle);
      elemPreviewView.attr('style', options.previewStyle);

      // tab change
      element.on('tab('+ FILTER_VALUE +')', function(data){
        var $this = $(this);
        var thisElem = $(data.elem).closest('.'+ CONST.ELEM_PREVIEW);
        var elemItemBody = thisElem.find('.'+ CONST.ELEM_ITEM);
        var thisItemBody = elemItemBody.eq(data.index);

        elemItemBody.removeClass(CONST.ELEM_SHOW);
        thisItemBody.addClass(CONST.ELEM_SHOW);

        if($this.attr('lay-id') === 'preview'){
          run(thisItemBody);
        }

        setCodeLayout();
      });
    }

    // 创建 code 容器
    var codeElem = $('<code class="'+ CONST.ELEM_LINES +'"></code>'); // 此处的闭合标签是为了兼容 IE8

    // 添加主容器 className
    othis.addClass('layui-code-view layui-border-box');

    // code 主题风格
    var theme = options.theme || options.skin;
    if (theme) {
      othis.removeClass('layui-code-theme-dark layui-code-theme-light');
      othis.addClass('layui-code-theme-'+ theme);
    }

    // 添加高亮必要的 className
    if (options.highlighter) {
      othis.addClass([
        options.highlighter,
        'language-' + options.lang,
        'layui-code-hl'
      ].join(' '));
    }

    // 换行模式
    if(options.wrapLines) othis.addClass('layui-code-wrap-lines-mode');

    // 转义 HTML 标签
    if(options.encode) html = util.escape(html); // 编码

    // codeRender
    if(typeof options.codeRender === 'function') html = options.codeRender(html, options);

    // code 行
    var lines = String(html).split(/\r?\n/g);

    // 包裹 code 行元素
    html = (options.codeRender && !options.highlighter)
      ? html
      : $.map(lines, function(line){
          return ['<div class="' + CONST.ELEM_LINE + '">', (line || ' '), '</div>'].join(''); // 空行填充空格，以保证换行效果
        }).join('')

    // 插入 code
    othis.html(codeElem.html(html));

    // code 区域样式
    if (options.codeStyle) {
      othis.attr('style', function(i, val) {
        return (val || '') + options.codeStyle;
      });
    }

    // 兼容旧版本 height 属性
    if (options.height) othis.css('max-height', options.height);

    // 创建行号
    var lineNumsElem = function() {
      if (options.ln) {
        var lineNumbersCode = ['<div class="'+ CONST.ELEM_LINE_NUMS +'">']
        layui.each(lines, function(index){
          lineNumbersCode.push('<span class="layui-code-line-number">' + util.digit(index + 1) +'.</span>')
        });
        lineNumbersCode.push('</div>');
        othis.addClass(CONST.ELEM_LINE_NUMBERS_MODE);
        othis.prepend(lineNumbersCode.join(''));
      }
      return othis.children('.'+ CONST.ELEM_LINE_NUMS);
    }()

    // 设置 code 布局
    var setCodeLayout = (function fn() {
      lineNumsElem.css({
        height: othis.prop('scrollHeight') // 与外容器高度保持一致
      });

      // 根据行号容器宽度，适配 code 容器左内边距
      othis.css('padding-left', function(multiLine) {
        var width = lineNumsElem.outerWidth();
        return multiLine && width > 45 ? width : null;
      }(Math.floor(lines.length / 100) && options.ln));

      return fn;
    })();

    // 创建 header --- 后续版本将废弃该属性
    if(options.header && !othis.children('.'+ CONST.ELEM_TITLE)[0]){
      var headerElem = $('<div class="'+ CONST.ELEM_TITLE +'">');
      headerElem.html((options.title || options.text.code) + (
        options.about
          ? '<div class="layui-code-about">' + options.about + '</div>'
        : ''
      ));
      othis.prepend(headerElem);
    }

    // 所有实例渲染完毕后的回调
    if(options.elem.length === index + 1){
      typeof options.allDone === 'function' && options.allDone();
    }

    // 若开启复制，且未开启预览时，单独生成复制图标
    if(options.copy && !options.preview){
      var elemCopy = $(['<span class="'+ CONST.ELEM_COPY +'">',
        '<i class="layui-icon layui-icon-file-b" title="复制"></i>',
      '</span>'].join(''));
      var elemCopyHas = othis.children('.'+ CONST.ELEM_COPY);

      if(elemCopyHas[0]) elemCopyHas.remove(); // 移除旧的复制元素
      othis.append(elemCopy);

      // 点击复制
      elemCopy.on('click', function(){
        tools.copy.event();
      });
    }

    // language marker
    if(options.langMarker){
      var elemMarker = $(['<span class="'+ CONST.ELEM_MARKER +'">', options.lang, '</span>'].join('') )
      var elemMarkerHas = othis.children("." + CONST.ELEM_MARKER);
      if(elemMarkerHas[0]) elemMarkerHas.remove();
      othis.append(elemMarker);
    }

    // code 渲染完毕后的回调
    if (!options.preview) {
      setTimeout(function(){
        typeof options.done === 'function' && options.done({});
      },3);
    }

    return inst;
  });
});

// 若为源码版，则自动加载该组件依赖的 css 文件
if(!layui['layui.all']){
  layui.addcss('modules/code.css?v=3', 'skincodecss');
}
