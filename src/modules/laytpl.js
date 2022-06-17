/**
 * laytpl 模板引擎
 */

layui.define(function(exports){
  "use strict";

  var config = {
    open: '{{',
    close: '}}'
  };

  var tool = {
    exp: function(str){
      return new RegExp(str, 'g');
    },
    //匹配满足规则内容
    query: function(type, _, __){
      var types = [
        '#([\\s\\S])+?',   //js语句
        '([^{#}])*?' //普通字段
      ][type || 0];
      return exp((_||'') + config.open + types + config.close + (__||''));
    },   
    escape: function(html){
      var exp = /[<"'>]|&(?=#[a-zA-Z0-9]+)/g;
      if(html === undefined || html === null) return '';
      
      html += '';
      if(!exp.test(html)) return html;

      return html.replace(/&(?!#?[a-zA-Z0-9]+;)/g, '&amp;')
      .replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/'/g, '&#39;').replace(/"/g, '&quot;');
    },
    error: function(e, tplog){
      var error = 'Laytpl Error: ';
      typeof console === 'object' && console.error(error + e + '\n'+ (tplog || ''));
      return error + e;
    }
  };

  var exp = tool.exp, Tpl = function(tpl){
    this.tpl = tpl;
  };

  Tpl.pt = Tpl.prototype;

  window.errors = 0;

  //编译模版
  Tpl.pt.parse = function(tpl, data){
    var that = this, tplog = tpl;
    var jss = exp('^'+config.open+'#', ''), jsse = exp(config.close+'$', '');
    
    tpl = tpl.replace(/\s+|\r|\t|\n/g, ' ')
    .replace(exp(config.open+'#'), config.open+'# ')
    .replace(exp(config.close+'}'), '} '+config.close).replace(/\\/g, '\\\\')
    
    //不匹配指定区域的内容
    .replace(exp(config.open + '!(.+?)!' + config.close), function(str){
      str = str.replace(exp('^'+ config.open + '!'), '')
      .replace(exp('!'+ config.close), '')
      .replace(exp(config.open + '|' + config.close), function(tag){
        return tag.replace(/(.)/g, '\\$1')
      });
      return str
    })
    
    //匹配 JS 语法
    .replace(/(?="|')/g, '\\').replace(tool.query(), function(str){
      str = str.replace(jss, '').replace(jsse, '');
      return '";' + str.replace(/\\(.)/g, '$1') + ';view+="';
    })
    
    //匹配普通输出语句
    .replace(tool.query(1), function(str){
      var start = '"+laytpl.escape(';
      if(str.replace(/\s/g, '') === config.open+config.close){
        return '';
      }
      str = str.replace(exp(config.open+'|'+config.close), '');
      if(/^=/.test(str)){
        str = str.replace(/^=/, '');
      } else if(/^-/.test(str)){
        str = str.replace(/^-/, '');
        start = '"+(';
      }
      return start + str.replace(/\\(.)/g, '$1') + ')+"';
    });
    
    tpl = '"use strict";var view = "' + tpl + '";return view;';

    try{
      that.cache = tpl = new Function('d, laytpl', tpl);
      return tpl(data, tool);
    } catch(e){
      delete that.cache;
      return tool.error(e, tplog);
    }
  };

  Tpl.pt.render = function(data, callback){
    var that = this, tpl;
    if(!data) return tool.error('no data');
    tpl = that.cache ? that.cache(data, tool) : that.parse(that.tpl, data);
    if(!callback) return tpl;
    callback(tpl);
  };

  var laytpl = function(tpl){
    if(typeof tpl !== 'string') return tool.error('Template not found');
    return new Tpl(tpl);
  };

  laytpl.config = function(options){
    options = options || {};
    for(var i in options){
      config[i] = options[i];
    }
  };

  laytpl.v = '1.2.0';
  
  exports('laytpl', laytpl);

});