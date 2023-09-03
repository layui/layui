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
    ELEM_LINE_NUMBERS_MODE: 'layui-code-line-numbers-mode',
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
  };

  var trimEnd = function(str){
      return String(str).replace(/\s+$/, '');
  }
  // 保留首行缩进
  var trim = function(str){
    return trimEnd(str).replace(/^\n|\n$/, '');
  };

  // export api
  exports('code', function(options){
    var opts = options = $.extend(true, {}, config, options);

    // 目标元素是否存在
    options.elem = $(options.elem);
    if(!options.elem[0]) return;

    // 从内至外渲染
    layui.each(options.elem.get().reverse(), function(index, item){
      var othis = $(item);

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
        });
      }

      var listElem = $('<code class="'+ CONST.ELEM_LINES +'"></code>'); // 此处的闭合标签是为了兼容 IE8

      // header
      var headerElem = $('<div class="'+ CONST.ELEM_TITLE +'">');

      // 添加组件 className
      othis.addClass('layui-code-view layui-box');

      // 自定义风格
      if(options.skin){
        if(options.skin === 'notepad') options.skin = 'dark';
        othis.removeClass('layui-code-dark layui-code-light');
        othis.addClass('layui-code-'+ options.skin);
      }

      // 高亮
      if(options.highlighter) othis.addClass(options.highlighter + ' language-' + options.lang);

      // 转义 HTML 标签
      if(options.encode) html = util.escape(html); // 编码

      // code 转 html
      if(typeof options.codeRender === 'function') html = options.codeRender(html, options);
      var lines = html.split(/\r?\n/g);
      html = (options.codeRender && !options.highlighter)
        ? html
        : $.map(lines, function(line){
          return ['<div class="', CONST.ELEM_LINE, '">', (line || ' '), '</div>'].join(''); // 空行填充空格，以保证换行效果
        }).join('')

      // 生成列表
      othis.html(listElem.html(html));

      // 创建行号
      if(options.ln) {
        var lineNumbersCode = ['<div class="layui-code-line-numbers">']
        layui.each(lines, function(index){
          lineNumbersCode.push('<span class="layui-code-line-number">' + util.digit(index + 1) +'.</span>')
        });
        lineNumbersCode.push('</div>');
        othis.addClass(CONST.ELEM_LINE_NUMBERS_MODE);
        othis.append(lineNumbersCode.join(''));
        othis.children('.layui-code-line-numbers').css({
          height: listElem.height(),
        })
      }

      // 创建 header
      if(options.header && !othis.children('.'+ CONST.ELEM_TITLE)[0]){
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

      // 按行数适配左边距
      (function(autoIncNums){
        if(autoIncNums > 0){
          othis.css('margin-left', autoIncNums + 'px');
        }
      })(Math.floor(listElem.find('.' + CONST.ELEM_LINE).length/100));

      // 限制 Code 最大高度
      if(options.height){ // 兼容旧版本
        othis.css('max-height', options.height);
      }
      // Code 内容区域样式
      if(options.codeStyle){
        othis.attr('style', function(_, origVal){
          return (origVal || '') + options.codeStyle;
        });
      }

      // 是否开启代码复制
      if(options.copy && !options.preview){
        var elemCopy = $(['<span class="'+ CONST.ELEM_COPY +'">',
          '<i class="layui-icon layui-icon-file-b" title="复制"></i>',
        '</span>'].join(''));
        var elemCopyHas = othis.children('.'+ CONST.ELEM_COPY);
        var isHeight = othis[0].style.height || othis[0].style.maxHeight;

        if(isHeight) elemCopy.addClass(CONST.ELEM_COPY + '-offset'); // 偏移
        if(elemCopyHas[0]) elemCopyHas.remove(); // 移除旧的复制元素
        othis.append(elemCopy);

        // 点击复制
        elemCopy.on('click', function(){
          tools.copy.event();
        });
      }

      // language marker
      if(options.langMarker){
        var elemMarker = $('<span class="layui-code-lang-marker">' + options.lang + '</span>')
        var isHeight = othis[0].style.height || othis[0].style.maxHeight;
        var elemMarkerHas = othis.children("." + CONST.ELEM_MARKER);
        if(isHeight) elemMarker.css('margin-right', '17px')
        if(elemMarkerHas) elemMarkerHas.remove();
        othis.append(elemMarker);
      }

    });

  });
});

// 若为源码版，则自动加载该组件依赖的 css 文件
if(!layui['layui.all']){
  layui.addcss('modules/code.css?v=3', 'skincodecss');
}
