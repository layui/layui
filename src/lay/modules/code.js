/**

 @Name：layui.code 代码修饰器
 @Author：贤心
 @License：MIT
    
 */
 
layui.define('jquery', function(exports){
  "use strict";
  
  var $ = layui.jquery;
  var about = 'http://www.layui.com/doc/modules/code.html'; //关于信息
  
  exports('code', function(options){
    var elems = [];
    options = options || {};
    options.elem = $(options.elem||'.layui-code');
    options.about = 'about' in options ? options.about : true;
    
    options.elem.each(function(){
      elems.push(this);
    });
    
    layui.each(elems.reverse(), function(index, item){
      var othis = $(item), html = othis.html();
      
      //转义HTML标签
      if(othis.attr('lay-encode') || options.encode){
        html = html.replace(/&(?!#?[a-zA-Z0-9]+;)/g, '&amp;')
        .replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;').replace(/"/g, '&quot;')
      }
      
      othis.html('<ol class="layui-code-ol"><li>' + html.replace(/[\r\t\n]+/g, '</li><li>') + '</li></ol>')
      
      if(!othis.find('>.layui-code-h3')[0]){
        othis.prepend('<h3 class="layui-code-h3">'+ (othis.attr('lay-title')||options.title||'code') + (options.about ? '<a href="'+ about +'" target="_blank">layui.code</a>' : '') + '</h3>');
      }
      
      var ol = othis.find('>.layui-code-ol');
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
}).addcss('modules/code.css', 'skincodecss');