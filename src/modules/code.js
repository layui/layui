/**
 * code 
 * 代码区简易修饰
 */
 
layui.define(['util'], function(exports){
  "use strict";
  
  var $ = layui.$;
  var util = layui.util;
  
  exports('code', function(options){
    var elems = [];
    var trim = function(str){
      return $.trim(str).replace(/^\n|\n$/, '');
    }

    options = options || {};
    options.elem = $(options.elem||'.layui-code');

    options.elem.each(function(){
      elems.push(this);
    });
    
    layui.each(elems.reverse(), function(index, item){
      var othis = $(item);
      var html = trim(othis.html());
      var about = othis.attr('lay-about') || options.about || othis.attr('lay-lang') || options.lang || '';

      //是否显示行号
      var lineNo;
      if(othis.attr('lay-line-no'))
      {
        lineNo = othis.attr('lay-line-no').toLowerCase() === 'true';
      }
      lineNo = options.lineNo === undefined ? lineNo === undefined ? false : lineNo : options.lineNo;

      // 转义 HTML 标签
      if(othis.attr('lay-encode') || options.encode){
        html = util.escape(html);
      }
      
      var list = lineNo ? 'ol' : 'ul';
      othis.html('<' + list + ' class="layui-code-' + list + '"><li>' + html.replace(/[\r\t\n]+/g, '</li><li>') + '</li></' + list + '>');
      
      if(!othis.find('>.layui-code-title')[0]){
        var aboutWrapper = about === '' ? '' : '<div class="layui-code-about">' + about + '</div>';
        othis.prepend('<div class="layui-code-title">' + (othis.attr('lay-title') || options.title || '&lt;/&gt;') + aboutWrapper + '</div>');
      }
      
      var ol = othis.find('>.layui-code-' + list);
      othis.addClass('layui-box layui-code-view');
      
      //识别皮肤
      if(othis.attr('lay-skin') || options.skin){
        othis.addClass('layui-code-' +(othis.attr('lay-skin') || options.skin));
      }
      
      //按行数适配左边距
      if((ol.find('li').length/100|0) > 0){
        ol.css('margin-left', (ol.find('li').length/100|0) + 'px');
      }
      
      //设置最大高度
      if(othis.attr('lay-height') || options.height){
        ol.css('max-height', othis.attr('lay-height') || options.height);
      }

    });
    
  });
}).addcss('modules/code.css?v=2', 'skincodecss');

