/**
 * code 
 * 代码块简易修饰
 */
 
layui.define(['lay', 'util'], function(exports){
  "use strict";
  
  var $ = layui.$;
  var util = layui.util;

  var ELEM_TITLE = 'layui-code-title';

  // 默认参数项
  var config = {
    elem: '.layui-code', // 元素选择器
    title: '&lt;/&gt;', // 标题
    about: '', // 右上角信息
    ln: true // 是否显示行号
  };

  var trim = function(str){
    return $.trim(str).replace(/^\n|\n$/, '');
  };
  
  // export api
  exports('code', function(options){
    var opts = options = $.extend({}, config, options);

    // 目标元素是否存在
    options.elem = $(options.elem);
    if(!options.elem[0]) return;

    // 从内至外渲染
    layui.each(options.elem.get().reverse(), function(index, item){
      var othis = $(item);
      var html = trim(othis.html());

      // 合并属性上的参数，并兼容旧版本属性写法 lay-*
      var options = $.extend({}, opts, lay.options(item), function(obj){
        var attrs = ['title', 'height', 'encode', 'skin', 'about'];
        layui.each(attrs, function(i, attr){
          var value = othis.attr('lay-'+ attr);
          if(typeof value === 'string'){
            obj[attr] = value;
          }  
        })
        return obj;
      }({}));

      // 有序或无序列表
      var listTag = options.ln ? 'ol' : 'ul';
      var listElem = $('<'+ listTag +' class="layui-code-'+ listTag +'">');

      // header
      var headerElem = $('<div class="'+ ELEM_TITLE +'">');

      // 添加组件 clasName
      othis.addClass('layui-code-view layui-box');

      // 自定义风格
      if(options.skin){
        if(options.skin === 'notepad') options.skin = 'dark';
        othis.addClass('layui-code-'+ options.skin);
      } 

      // 转义 HTML 标签
      if(options.encode) html = util.escape(html);
      html = html.replace(/[\r\t\n]+/g, '</li><li>'); // 转义换行符
      
      // 生成列表
      othis.html(listElem.html('<li>' + html + '</li>'));
      
      // 创建 header
      if(!othis.children('.'+ ELEM_TITLE)[0]){
        headerElem.html(options.title + (
          options.about 
            ? '<div class="layui-code-about">' + options.about + '</div>'
          : ''
        ));
        othis.prepend(headerElem);
      }

      // 按行数适配左边距
      (function(autoIncNums){
        if(autoIncNums > 0){
          listElem.css('margin-left', autoIncNums + 'px');
        }
      })(Math.floor(listElem.find('li').length/100));

      // 限制最大高度
      if(options.height){
        listElem.css('max-height', options.height);
      }

    });
    
  });
});

// 若为源码版，则自动加载该组件依赖的 css 文件
if(!layui['layui.all']){
  layui.addcss('modules/code.css?v=3', 'skincodecss');
}