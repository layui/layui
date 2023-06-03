/**
 * laytpl 轻量模板引擎
 */

layui.define(function(exports){
  "use strict";

  // 默认属性
  var config = {
    open: '{{', // 标签符前缀
    close: '}}' // 标签符后缀
  };

  // 模板工具
  var tool = {  
    escape: function(html){
      var exp = /[<"'>]|&(?=#[a-zA-Z0-9]+)/g;
      if(html === undefined || html === null) return '';
      
      html += '';
      if(!exp.test(html)) return html;

      return html.replace(/&(?!#?[a-zA-Z0-9]+;)/g, '&amp;')
      .replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/'/g, '&#39;').replace(/"/g, '&quot;');
    }
  };

  // 内部方法
  var inner = {
    exp: function(str){
      return new RegExp(str, 'g');
    },
    // 错误提示
    error: function(e, source){
      var error = 'Laytpl Error: ';
      typeof console === 'object' && console.error(error + e + '\n'+ (source || ''));
      return error + e;
    }
  };

  // constructor
  var Class = function(template, options){
    var that = this;
    that.config = that.config || {};
    that.template = template;

    // 简单属性合并
    var extend = function(obj){
      for(var i in obj){
        that.config[i] = obj[i];
      }
    };

    extend(config);
    extend(options);
  };

  // 标签正则
  Class.prototype.tagExp = function(type, _, __){
    var options = this.config;
    var types = [
      '#([\\s\\S])+?',   // js 语句
      '([^{#}])*?' // 普通字段
    ][type || 0];

    return inner.exp((_||'') + options.open + types + options.close + (__||''));
  };

  // 模版解析
  Class.prototype.parse = function(template, data){
    var that = this;
    var options = that.config;
    var source = template;
    var jss = inner.exp('^'+ options.open +'#', '');
    var jsse = inner.exp(options.close +'$', '');

    // 模板必须为 string 类型
    if(typeof template !== 'string') return template;
    
    // 正则解析
    template = template.replace(/\s+|\r|\t|\n/g, ' ')
    .replace(inner.exp(options.open +'#'), options.open +'# ')
    .replace(inner.exp(options.close +'}'), '} '+ options.close).replace(/\\/g, '\\\\')
    
    // 不匹配指定区域的内容
    .replace(inner.exp(options.open + '!(.+?)!' + options.close), function(str){
      str = str.replace(inner.exp('^'+ options.open + '!'), '')
      .replace(inner.exp('!'+ options.close), '')
      .replace(inner.exp(options.open + '|' + options.close), function(tag){
        return tag.replace(/(.)/g, '\\$1')
      });
      return str
    })
    
    // 匹配 JS 语法
    .replace(/(?="|')/g, '\\').replace(that.tagExp(), function(str){
      str = str.replace(jss, '').replace(jsse, '');
      return '";' + str.replace(/\\(.)/g, '$1') + ';view+="';
    })
    
    // 匹配普通输出语句
    .replace(that.tagExp(1), function(str){
      var start = '"+laytpl.escape(';
      if(str.replace(/\s/g, '') === options.open + options.close){
        return '';
      }
      str = str.replace(inner.exp(options.open + '|' + options.close), '');
      if(/^=/.test(str)){
        str = str.replace(/^=/, '');
      } else if(/^-/.test(str)){
        str = str.replace(/^-/, '');
        start = '"+(';
      }
      return start + str.replace(/\\(.)/g, '$1') + ')+"';
    });
    
    template = '"use strict";var view = "' + template + '";return view;';

    try {
      that.cache = template = new Function('d, laytpl', template);
      return template(data, tool);
    } catch(e) {
      delete that.cache;
      return inner.error(e, source);
    }
  };

  // 数据渲染
  Class.prototype.render = function(data, callback){
    data = data || {};

    var that = this;
    var result = that.cache ? that.cache(data, tool) : that.parse(that.template, data);
    
    // 返回渲染结果
    typeof callback === 'function' && callback(result);
    return result;
  };

  // 创建实例
  var laytpl = function(template, options){
    return new Class(template, options);
  };

  // 配置全局属性
  laytpl.config = function(options){
    options = options || {};
    for(var i in options){
      config[i] = options[i];
    }
  };

  laytpl.v = '2.0.0';
  
  // export
  exports('laytpl', laytpl);
});