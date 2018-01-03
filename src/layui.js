/*!

 @Title: Layui
 @Description：经典模块化前端框架
 @Site: www.layui.com
 @Author: 贤心
 @License：MIT

 */
 
;!function(win){
  "use strict";

  var doc = document, config = {
    modules: {} //记录模块物理路径
    ,status: {} //记录模块加载状态
    ,timeout: 10 //符合规范的模块请求最长等待秒数
    ,event: {} //记录模块自定义事件
  }

  ,Layui = function(){
    this.v = '2.2.5'; //版本号
  }

  //获取layui所在目录
  ,getPath = function(){
    var jsPath = doc.currentScript ? doc.currentScript.src : function(){
      var js = doc.scripts
      ,last = js.length - 1
      ,src;
      for(var i = last; i > 0; i--){
        if(js[i].readyState === 'interactive'){
          src = js[i].src;
          break;
        }
      }
      return src || js[last].src;
    }();
    return jsPath.substring(0, jsPath.lastIndexOf('/') + 1);
  }()

  //异常提示
  ,error = function(msg){
    win.console && console.error && console.error('Layui hint: ' + msg);
  }

  ,isOpera = typeof opera !== 'undefined' && opera.toString() === '[object Opera]'

  //内置模块
  ,modules = {
    layer: 'modules/layer' //弹层
    ,laydate: 'modules/laydate' //日期
    ,laypage: 'modules/laypage' //分页
    ,laytpl: 'modules/laytpl' //模板引擎
    ,layim: 'modules/layim' //web通讯
    ,layedit: 'modules/layedit' //富文本编辑器
    ,form: 'modules/form' //表单集
    ,upload: 'modules/upload' //上传
    ,tree: 'modules/tree' //树结构
    ,table: 'modules/table' //表格
    ,element: 'modules/element' //常用元素操作
    ,util: 'modules/util' //工具块
    ,flow: 'modules/flow' //流加载
    ,carousel: 'modules/carousel' //轮播
    ,code: 'modules/code' //代码修饰器
    ,jquery: 'modules/jquery' //DOM库（第三方）
    
    ,mobile: 'modules/mobile' //移动大模块 | 若当前为开发目录，则为移动模块入口，否则为移动模块集合
    ,'layui.all': '../layui.all' //PC模块合并版
  };

  //记录基础数据
  Layui.prototype.cache = config;

  //定义模块
  Layui.prototype.define = function(deps, factory){
    var that = this
    ,type = typeof deps === 'function'
    ,callback = function(){
      var setApp = function(app, exports){
        layui[app] = exports;
        config.status[app] = true;
      };
      typeof factory === 'function' && factory(function(app, exports){
        setApp(app, exports);
        config.callback[app] = function(){
          factory(setApp);
        }
      });
      return this;
    };
    
    type && (
      factory = deps,
      deps = []
    );
    
    if(layui['layui.all'] || (!layui['layui.all'] && layui['layui.mobile'])){
      return callback.call(that);
    }

    that.use(deps, callback);
    return that;
  };

  //使用特定模块
  Layui.prototype.use = function(apps, callback, exports){
    var that = this
    ,dir = config.dir = config.dir ? config.dir : getPath
    ,head = doc.getElementsByTagName('head')[0];

    apps = typeof apps === 'string' ? [apps] : apps;
    
    //如果页面已经存在jQuery1.7+库且所定义的模块依赖jQuery，则不加载内部jquery模块
    if(window.jQuery && jQuery.fn.on){
      that.each(apps, function(index, item){
        if(item === 'jquery'){
          apps.splice(index, 1);
        }
      });
      layui.jquery = layui.$ = jQuery;
    }
    
    var item = apps[0]
    ,timeout = 0;
    exports = exports || [];

    //静态资源host
    config.host = config.host || (dir.match(/\/\/([\s\S]+?)\//)||['//'+ location.host +'/'])[0];
    
    //加载完毕
    function onScriptLoad(e, url){
      var readyRegExp = navigator.platform === 'PLaySTATION 3' ? /^complete$/ : /^(complete|loaded)$/
      if (e.type === 'load' || (readyRegExp.test((e.currentTarget || e.srcElement).readyState))) {
        config.modules[item] = url;
        head.removeChild(node);
        (function poll() {
          if(++timeout > config.timeout * 1000 / 4){
            return error(item + ' is not a valid module');
          };
          config.status[item] ? onCallback() : setTimeout(poll, 4);
        }());
      }
    }
    
    //回调
    function onCallback(){
      exports.push(layui[item]);
      apps.length > 1 ?
        that.use(apps.slice(1), callback, exports)
      : ( typeof callback === 'function' && callback.apply(layui, exports) );
    }
    
    //如果使用了 layui.all.js
    if(apps.length === 0 
    || (layui['layui.all'] && modules[item]) 
    || (!layui['layui.all'] && layui['layui.mobile'] && modules[item])
    ){
      return onCallback(), that;
    }

    //首次加载模块
    if(!config.modules[item]){
      var node = doc.createElement('script')
      
      //如果是内置模块，则按照 dir 参数拼接模块路径
      //如果是扩展模块，则判断模块路径值是否为 {/} 开头，
      //如果路径值是 {/} 开头，则模块路径即为后面紧跟的字符。
      //否则，则按照 base 参数拼接模块路径
      ,url = ( modules[item] ? (dir + 'lay/') 
        : (/^\{\/\}/.test(that.modules[item]) ? '' : (config.base || ''))
      ) + (that.modules[item] || item) + '.js';
      
      url = url.replace(/^\{\/\}/, '');
      
      node.async = true;
      node.charset = 'utf-8';
      node.src = url + function(){
        var version = config.version === true 
        ? (config.v || (new Date()).getTime())
        : (config.version||'');
        return version ? ('?v=' + version) : '';
      }();
      
      head.appendChild(node);
      
      if(node.attachEvent && !(node.attachEvent.toString && node.attachEvent.toString().indexOf('[native code') < 0) && !isOpera){
        node.attachEvent('onreadystatechange', function(e){
          onScriptLoad(e, url);
        });
      } else {
        node.addEventListener('load', function(e){
          onScriptLoad(e, url);
        }, false);
      }
      
      config.modules[item] = url;
    } else { //缓存
      (function poll() {
        if(++timeout > config.timeout * 1000 / 4){
          return error(item + ' is not a valid module');
        };
        (typeof config.modules[item] === 'string' && config.status[item]) 
        ? onCallback() 
        : setTimeout(poll, 4);
      }());
    }
    
    return that;
  };

  //获取节点的style属性值
  Layui.prototype.getStyle = function(node, name){
    var style = node.currentStyle ? node.currentStyle : win.getComputedStyle(node, null);
    return style[style.getPropertyValue ? 'getPropertyValue' : 'getAttribute'](name);
  };

  //css外部加载器
  Layui.prototype.link = function(href, fn, cssname){
    var that = this
    ,link = doc.createElement('link')
    ,head = doc.getElementsByTagName('head')[0];
    
    if(typeof fn === 'string') cssname = fn;
    
    var app = (cssname || href).replace(/\.|\//g, '')
    ,id = link.id = 'layuicss-'+app
    ,timeout = 0;
    
    link.rel = 'stylesheet';
    link.href = href + (config.debug ? '?v='+new Date().getTime() : '');
    link.media = 'all';
    
    if(!doc.getElementById(id)){
      head.appendChild(link);
    }

    if(typeof fn !== 'function') return that;
    
    //轮询css是否加载完毕
    (function poll() {
      if(++timeout > config.timeout * 1000 / 100){
        return error(href + ' timeout');
      };
      parseInt(that.getStyle(doc.getElementById(id), 'width')) === 1989 ? function(){
        fn();
      }() : setTimeout(poll, 100);
    }());
    
    return that;
  };
  
  //存储模块的回调
  config.callback = {};
  
  //重新执行模块的工厂函数
  Layui.prototype.factory = function(modName){
    if(layui[modName]){
      return typeof config.callback[modName] === 'function' 
        ? config.callback[modName]
      : null;
    }
  };

  //css内部加载器
  Layui.prototype.addcss = function(firename, fn, cssname){
    return layui.link(config.dir + 'css/' + firename, fn, cssname);
  };

  //图片预加载
  Layui.prototype.img = function(url, callback, error) {   
    var img = new Image();
    img.src = url; 
    if(img.complete){
      return callback(img);
    }
    img.onload = function(){
      img.onload = null;
      callback(img);
    };
    img.onerror = function(e){
      img.onerror = null;
      error(e);
    };  
  };

  //全局配置
  Layui.prototype.config = function(options){
    options = options || {};
    for(var key in options){
      config[key] = options[key];
    }
    return this;
  };

  //记录全部模块
  Layui.prototype.modules = function(){
    var clone = {};
    for(var o in modules){
      clone[o] = modules[o];
    }
    return clone;
  }();

  //拓展模块
  Layui.prototype.extend = function(options){
    var that = this;

    //验证模块是否被占用
    options = options || {};
    for(var o in options){
      if(that[o] || that.modules[o]){
        error('\u6A21\u5757\u540D '+ o +' \u5DF2\u88AB\u5360\u7528');
      } else {
        that.modules[o] = options[o];
      }
    }

    return that;
  };

  //路由解析
  Layui.prototype.router = function(hash){
    var that = this
    ,hash = hash || location.hash
    ,data = {
      path: []
      ,search: {}
      ,hash: (hash.match(/[^#](#.*$)/) || [])[1] || ''
    };
    
    if(!/^#\//.test(hash)) return data; //禁止非路由规范
    data.href = hash = hash.replace(/^#\//, '');
    hash = hash.replace(/([^#])(#.*$)/, '$1').split('/') || [];
    
    //提取Hash结构
    that.each(hash, function(index, item){
      /^\w+=/.test(item) ? function(){
        item = item.split('=');
        data.search[item[0]] = item[1];
      }() : data.path.push(item);
    });
    
    return data;
  };

  //本地持久性存储
  Layui.prototype.data = function(table, settings, storage){
    table = table || 'layui';
    storage = storage || localStorage;
    
    if(!win.JSON || !win.JSON.parse) return;
    
    //如果settings为null，则删除表
    if(settings === null){
      return delete storage[table];
    }
    
    settings = typeof settings === 'object' 
      ? settings 
    : {key: settings};
    
    try{
      var data = JSON.parse(storage[table]);
    } catch(e){
      var data = {};
    }
    
    if('value' in settings) data[settings.key] = settings.value;
    if(settings.remove) delete data[settings.key];
    storage[table] = JSON.stringify(data);
    
    return settings.key ? data[settings.key] : data;
  };
  
  //本地会话性存储
  Layui.prototype.sessionData = function(table, settings){
    return this.data(table, settings, sessionStorage);
  }

  //设备信息
  Layui.prototype.device = function(key){
    var agent = navigator.userAgent.toLowerCase()

    //获取版本号
    ,getVersion = function(label){
      var exp = new RegExp(label + '/([^\\s\\_\\-]+)');
      label = (agent.match(exp)||[])[1];
      return label || false;
    }
    
    //返回结果集
    ,result = {
      os: function(){ //底层操作系统
        if(/windows/.test(agent)){
          return 'windows';
        } else if(/linux/.test(agent)){
          return 'linux';
        } else if(/iphone|ipod|ipad|ios/.test(agent)){
          return 'ios';
        } else if(/mac/.test(agent)){
          return 'mac';
        } 
      }()
      ,ie: function(){ //ie版本
        return (!!win.ActiveXObject || "ActiveXObject" in win) ? (
          (agent.match(/msie\s(\d+)/) || [])[1] || '11' //由于ie11并没有msie的标识
        ) : false;
      }()
      ,weixin: getVersion('micromessenger')  //是否微信
    };
    
    //任意的key
    if(key && !result[key]){
      result[key] = getVersion(key);
    }
    
    //移动设备
    result.android = /android/.test(agent);
    result.ios = result.os === 'ios';
    
    return result;
  };

  //提示
  Layui.prototype.hint = function(){
    return {
      error: error
    }
  };

  //遍历
  Layui.prototype.each = function(obj, fn){
    var key
    ,that = this;
    if(typeof fn !== 'function') return that;
    obj = obj || [];
    if(obj.constructor === Object){
      for(key in obj){
        if(fn.call(obj[key], key, obj[key])) break;
      }
    } else {
      for(key = 0; key < obj.length; key++){
        if(fn.call(obj[key], key, obj[key])) break;
      }
    }
    return that;
  };

  //将数组中的对象按其某个成员排序
  Layui.prototype.sort = function(obj, key, desc){
    var clone = JSON.parse(
      JSON.stringify(obj || [])
    );
    
    if(!key) return clone;
    
    //如果是数字，按大小排序，如果是非数字，按字典序排序
    clone.sort(function(o1, o2){
      var isNum = /^-?\d+$/
      ,v1 = o1[key]
      ,v2 = o2[key];
      
      if(isNum.test(v1)) v1 = parseFloat(v1);
      if(isNum.test(v2)) v2 = parseFloat(v2);
      
      if(v1 && !v2){
        return 1;
      } else if(!v1 && v2){
        return -1;
      }
        
      if(v1 > v2){
        return 1;
      } else if (v1 < v2) {
        return -1;
      } else {
        return 0;
      }
    });

    desc && clone.reverse(); //倒序
    return clone;
  };

  //阻止事件冒泡
  Layui.prototype.stope = function(thisEvent){
    thisEvent = thisEvent || win.event;
    try { thisEvent.stopPropagation() } catch(e){
      thisEvent.cancelBubble = true;
    }
  };

  //自定义模块事件
  Layui.prototype.onevent = function(modName, events, callback){
    if(typeof modName !== 'string' 
    || typeof callback !== 'function') return this;

    return Layui.event(modName, events, null, callback);
  };

  //执行自定义模块事件
  Layui.prototype.event = Layui.event = function(modName, events, params, fn){
    var that = this
    ,result = null
    ,filter = events.match(/\((.*)\)$/)||[] //提取事件过滤器字符结构，如：select(xxx)
    ,eventName = (modName + '.'+ events).replace(filter[0], '') //获取事件名称，如：form.select
    ,filterName = filter[1] || '' //获取过滤器名称,，如：xxx
    ,callback = function(_, item){
      var res = item && item.call(that, params);
      res === false && result === null && (result = false);
    };
    
    //添加事件
    if(fn){
      config.event[eventName] = config.event[eventName] || {};

      //这里不再对多次事件监听做支持，避免更多麻烦
      //config.event[eventName][filterName] ? config.event[eventName][filterName].push(fn) : 
      config.event[eventName][filterName] = [fn];
      return this;
    }
    
    //执行事件回调
    layui.each(config.event[eventName], function(key, item){
      //执行当前模块的全部事件
      if(filterName === '{*}'){
        layui.each(item, callback);
        return;
      }
      
      //执行指定事件
      key === '' && layui.each(item, callback);
      key === filterName && layui.each(item, callback);
    });
    
    return result;
  };

  win.layui = new Layui();
  
}(window);

