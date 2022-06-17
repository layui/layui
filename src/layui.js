/**
 * Layui
 * Classic modular front-end UI library
 * MIT Licensed
 */
 
;!function(win){
  "use strict";

  var doc = win.document, config = {
    modules: {} //记录模块物理路径
    ,status: {} //记录模块加载状态
    ,timeout: 10 //符合规范的模块请求最长等待秒数
    ,event: {} //记录模块自定义事件
  }

  ,Layui = function(){
    this.v = '2.6.13'; // layui 版本号
  }
  
  //识别预先可能定义的指定全局对象
  ,GLOBAL = win.LAYUI_GLOBAL || {}

  //获取 layui 所在目录
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
    
    return config.dir = GLOBAL.dir || jsPath.substring(0, jsPath.lastIndexOf('/') + 1);
  }()

  //异常提示
  ,error = function(msg, type){
    type = type || 'log';
    win.console && console[type] && console[type]('layui error hint: ' + msg);
  }

  ,isOpera = typeof opera !== 'undefined' && opera.toString() === '[object Opera]'

  //内置模块
  ,modules = config.builtin = {
    lay: 'lay' //基础 DOM 操作
    ,layer: 'layer' //弹层
    ,laydate: 'laydate' //日期
    ,laypage: 'laypage' //分页
    ,laytpl: 'laytpl' //模板引擎
    ,layedit: 'layedit' //富文本编辑器
    ,form: 'form' //表单集
    ,upload: 'upload' //上传
    ,dropdown: 'dropdown' //下拉菜单
    ,transfer: 'transfer' //穿梭框
    ,tree: 'tree' //树结构
    ,table: 'table' //表格
    ,element: 'element' //常用元素操作
    ,rate: 'rate'  //评分组件
    ,colorpicker: 'colorpicker' //颜色选择器
    ,slider: 'slider' //滑块
    ,carousel: 'carousel' //轮播
    ,flow: 'flow' //流加载
    ,util: 'util' //工具块
    ,code: 'code' //代码修饰器
    ,jquery: 'jquery' //DOM 库（第三方）
    
    ,all: 'all'
    ,'layui.all': 'layui.all' //聚合标识（功能性的，非真实模块）
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
    
    that.use(deps, callback, null, 'define');
    return that;
  };

  //使用特定模块
  Layui.prototype.use = function(apps, callback, exports, from){
    var that = this
    ,dir = config.dir = config.dir ? config.dir : getPath
    ,head = doc.getElementsByTagName('head')[0];

    apps = function(){
      if(typeof apps === 'string'){
        return [apps];
      } 
      //当第一个参数为 function 时，则自动加载所有内置模块，且执行的回调即为该 function 参数；
      else if(typeof apps === 'function'){
        callback = apps;
        return ['all'];
      }      
      return apps;
    }();
    
    //如果页面已经存在 jQuery 1.7+ 库且所定义的模块依赖 jQuery，则不加载内部 jquery 模块
    if(win.jQuery && jQuery.fn.on){
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
            return error(item + ' is not a valid module', 'error');
          };
          config.status[item] ? onCallback() : setTimeout(poll, 4);
        }());
      }
    }
  
    //回调
    function onCallback(){
      exports.push(layui[item]);
      apps.length > 1 ?
        that.use(apps.slice(1), callback, exports, from)
      : ( typeof callback === 'function' && function(){
        //保证文档加载完毕再执行回调
        if(layui.jquery && typeof layui.jquery === 'function' && from !== 'define'){
          return layui.jquery(function(){
            callback.apply(layui, exports);
          });
        }
        callback.apply(layui, exports);
      }() );
    }
    
    //如果引入了聚合板，内置的模块则不必重复加载
    if( apps.length === 0 || (layui['layui.all'] && modules[item]) ){
      return onCallback(), that;
    }
    
    //获取加载的模块 URL
    //如果是内置模块，则按照 dir 参数拼接模块路径
    //如果是扩展模块，则判断模块路径值是否为 {/} 开头，
    //如果路径值是 {/} 开头，则模块路径即为后面紧跟的字符。
    //否则，则按照 base 参数拼接模块路径
    
    var url = ( modules[item] ? (dir + 'modules/') 
      : (/^\{\/\}/.test(that.modules[item]) ? '' : (config.base || ''))
    ) + (that.modules[item] || item) + '.js';
    url = url.replace(/^\{\/\}/, '');
    
    //如果扩展模块（即：非内置模块）对象已经存在，则不必再加载
    if(!config.modules[item] && layui[item]){
      config.modules[item] = url; //并记录起该扩展模块的 url
    }

    //首次加载模块
    if(!config.modules[item]){
      var node = doc.createElement('script');
      
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
          return error(item + ' is not a valid module', 'error');
        };
        (typeof config.modules[item] === 'string' && config.status[item]) 
        ? onCallback() 
        : setTimeout(poll, 4);
      }());
    }
    
    return that;
  };

  //获取节点的 style 属性值
  Layui.prototype.getStyle = function(node, name){
    var style = node.currentStyle ? node.currentStyle : win.getComputedStyle(node, null);
    return style[style.getPropertyValue ? 'getPropertyValue' : 'getAttribute'](name);
  };

  //css外部加载器
  Layui.prototype.link = function(href, fn, cssname){
    var that = this
    ,head = doc.getElementsByTagName('head')[0]
    ,link = doc.createElement('link');
    
    if(typeof fn === 'string') cssname = fn;
    
    var app = (cssname || href).replace(/\.|\//g, '')
    ,id = link.id = 'layuicss-'+ app
    ,STAUTS_NAME = 'creating'
    ,timeout = 0;
    
    link.rel = 'stylesheet';
    link.href = href + (config.debug ? '?v='+new Date().getTime() : '');
    link.media = 'all';
    
    if(!doc.getElementById(id)){
      head.appendChild(link);
    }
    
    if(typeof fn !== 'function') return that;
    
    //轮询 css 是否加载完毕
    (function poll(status) {
      var delay = 100
      ,getLinkElem = doc.getElementById(id); //获取动态插入的 link 元素
      
      //如果轮询超过指定秒数，则视为请求文件失败或 css 文件不符合规范
      if(++timeout > config.timeout * 1000 / delay){
        return error(href + ' timeout');
      };
      
      //css 加载就绪
      if(parseInt(that.getStyle(getLinkElem, 'width')) === 1989){
        //如果参数来自于初始轮询（即未加载就绪时的），则移除 link 标签状态
        if(status === STAUTS_NAME) getLinkElem.removeAttribute('lay-status');
        //如果 link 标签的状态仍为「创建中」，则继续进入轮询，直到状态改变，则执行回调
        getLinkElem.getAttribute('lay-status') === STAUTS_NAME ? setTimeout(poll, delay) : fn();
      } else {
        getLinkElem.setAttribute('lay-status', STAUTS_NAME);
        setTimeout(function(){
          poll(STAUTS_NAME);
        }, delay);
      }
    }());
    
    //轮询css是否加载完毕
    /*
    (function poll() {
      if(++timeout > config.timeout * 1000 / 100){
        return error(href + ' timeout');
      };
      parseInt(that.getStyle(doc.getElementById(id), 'width')) === 1989 ? function(){
        fn();
      }() : setTimeout(poll, 100);
    }());
    */
    
    return that;
  };
  
  //css 内部加载器
  Layui.prototype.addcss = function(firename, fn, cssname){
    return layui.link(config.dir + 'css/' + firename, fn, cssname);
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

  //图片预加载
  Layui.prototype.img = function(url, callback, error) {   
    var img = new Image();
    img.src = url; 
    if(img.complete){
      return callback(img);
    }
    img.onload = function(){
      img.onload = null;
      typeof callback === 'function' && callback(img);
    };
    img.onerror = function(e){
      img.onerror = null;
      typeof error === 'function' && error(e);
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
        error(o+ ' Module already exists', 'error');
      } else {
        that.modules[o] = options[o];
      }
    }

    return that;
  };

  // location.hash 路由解析
  Layui.prototype.router = Layui.prototype.hash = function(hash){
    var that = this
    ,hash = hash || location.hash
    ,data = {
      path: []
      ,search: {}
      ,hash: (hash.match(/[^#](#.*$)/) || [])[1] || ''
    };
    
    if(!/^#\//.test(hash)) return data; //禁止非路由规范
    hash = hash.replace(/^#\//, '');
    data.href = '/' + hash;
    hash = hash.replace(/([^#])(#.*$)/, '$1').split('/') || [];
    
    //提取 Hash 结构
    that.each(hash, function(index, item){
      /^\w+=/.test(item) ? function(){
        item = item.split('=');
        data.search[item[0]] = item[1];
      }() : data.path.push(item);
    });
    
    return data;
  };
  
  //URL 解析
  Layui.prototype.url = function(href){
    var that = this
    ,data = {
      //提取 url 路径
      pathname: function(){
        var pathname = href
          ? function(){
            var str = (href.match(/\.[^.]+?\/.+/) || [])[0] || '';
            return str.replace(/^[^\/]+/, '').replace(/\?.+/, '');
          }()
        : location.pathname;
        return pathname.replace(/^\//, '').split('/');
      }()
      
      //提取 url 参数
      ,search: function(){
        var obj = {}
        ,search = (href 
          ? function(){
            var str = (href.match(/\?.+/) || [])[0] || '';
            return str.replace(/\#.+/, '');
          }()
          : location.search
        ).replace(/^\?+/, '').split('&'); //去除 ?，按 & 分割参数
        
        //遍历分割后的参数
        that.each(search, function(index, item){
          var _index = item.indexOf('=')
          ,key = function(){ //提取 key
            if(_index < 0){
              return item.substr(0, item.length);
            } else if(_index === 0){
              return false;
            } else {
              return item.substr(0, _index);
            }
          }(); 
          //提取 value
          if(key){
            obj[key] = _index > 0 ? item.substr(_index + 1) : null;
          }
        });
        
        return obj;
      }()
      
      //提取 Hash
      ,hash: that.router(function(){
        return href 
          ? ((href.match(/#.+/) || [])[0] || '/')
        : location.hash;
      }())
    };
    
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
    result.mobile = (result.android || result.ios) ? true : false;
    
    return result;
  };

  //提示
  Layui.prototype.hint = function(){
    return {
      error: error
    };
  };
  
  //typeof 类型细分 -> string/number/boolean/undefined/null、object/array/function/…
  Layui.prototype._typeof = Layui.prototype.type = function(operand){
    if(operand === null) return String(operand);
    
    //细分引用类型
    return (typeof operand === 'object' || typeof operand === 'function') ? function(){
      var type = Object.prototype.toString.call(operand).match(/\s(.+)\]$/) || [] //匹配类型字符
      ,classType = 'Function|Array|Date|RegExp|Object|Error|Symbol'; //常见类型字符
      
      type = type[1] || 'Object';
      
      //除匹配到的类型外，其他对象均返回 object
      return new RegExp('\\b('+ classType + ')\\b').test(type) 
        ? type.toLowerCase() 
      : 'object';
    }() : typeof operand;
  };
  
  //对象是否具备数组结构（此处为兼容 jQuery 对象）
  Layui.prototype._isArray = Layui.prototype.isArray = function(obj){
    var that = this
    ,len
    ,type = that.type(obj);
    
    if(!obj || (typeof obj !== 'object') || obj === win) return false;
    
    len = 'length' in obj && obj.length; //兼容 ie
    return type === 'array' || len === 0 || (
      typeof len === 'number' && len > 0 && (len - 1) in obj //兼容 jQuery 对象
    );
  };

  //遍历
  Layui.prototype.each = function(obj, fn){
    var key
    ,that = this
    ,callFn = function(key, obj){ //回调
      return fn.call(obj[key], key, obj[key])
    };
    
    if(typeof fn !== 'function') return that;
    obj = obj || [];
    
    //优先处理数组结构
    if(that.isArray(obj)){
      for(key = 0; key < obj.length; key++){
        if(callFn(key, obj)) break;
      }
    } else {
      for(key in obj){
        if(callFn(key, obj)) break;
      }
    }
    
    return that;
  };

  // 将数组中的成员对象按照某个 key 的 value 值进行排序
  Layui.prototype.sort = function(arr, key, desc){
    var that = this
    ,clone = JSON.parse(
      JSON.stringify(arr || [])
    );
    
    // 若未传入 key，则直接返回原对象
    if(that.type(arr) === 'object' && !key){
      return clone;
    } else if(typeof arr !== 'object'){ //若 arr 非对象
      return [clone];
    }
    
    // 开始排序
    clone.sort(function(o1, o2){
      var v1 = o1[key]
      ,v2 = o2[key];
      
      /*
       * 特殊数据
       * 若比较的成员均非对象
       */

      // 若比较的成员均为数字
      if(!isNaN(o1) && !isNaN(o2)) return o1 - o2;
      // 若比较的成员只存在某一个非对象
      if(!isNaN(o1) && isNaN(o2)){
        if(key && typeof o2 === 'object'){
          v1 = o1;
        } else {
          return -1;
        }
      } else if (isNaN(o1) && !isNaN(o2)){
        if(key && typeof o1 === 'object'){
          v2 = o2;
        } else {
          return 1;
        }
      }

      /*
       * 正常数据
       * 即成员均为对象，也传入了对比依据： key
       * 若 value 为数字，按「大小」排序；若 value 非数字，则按「字典序」排序
       */

      // value 是否为数字
      var isNum = [!isNaN(v1), !isNaN(v2)];

      // 若为数字比较
      if(isNum[0] && isNum[1]){
        if(v1 && (!v2 && v2 !== 0)){ //数字 vs 空
          return 1;
        } else if((!v1 && v1 !== 0) && v2){ //空 vs 数字
          return -1;
        } else { //数字 vs 数字
          return v1 - v2;
        }
      };
      
      /**
       * 字典序排序
       */
       
      // 若为非数字比较
      if(!isNum[0] && !isNum[1]){
        // 字典序比较
        if(v1 > v2){
          return 1;
        } else if (v1 < v2) {
          return -1;
        } else {
          return 0;
        }
      }
      
      // 若为混合比较
      if(isNum[0] || !isNum[1]){ //数字 vs 非数字
        return -1;
      } else if(!isNum[0] || isNum[1]) { //非数字 vs 数字
        return 1;
      }

    });

    desc && clone.reverse(); // 倒序
    return clone;
  };

  //阻止事件冒泡
  Layui.prototype.stope = function(thisEvent){
    thisEvent = thisEvent || win.event;
    try { thisEvent.stopPropagation() } catch(e){
      thisEvent.cancelBubble = true;
    }
  };
  
  //字符常理
  var EV_REMOVE = 'LAYUI-EVENT-REMOVE';

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
    ,filter = (events || '').match(/\((.*)\)$/)||[] //提取事件过滤器字符结构，如：select(xxx)
    ,eventName = (modName + '.'+ events).replace(filter[0], '') //获取事件名称，如：form.select
    ,filterName = filter[1] || '' //获取过滤器名称,，如：xxx
    ,callback = function(_, item){
      var res = item && item.call(that, params);
      res === false && result === null && (result = false);
    };
    
    //如果参数传入特定字符，则执行移除事件
    if(params === EV_REMOVE){
      delete (that.cache.event[eventName] || {})[filterName];
      return that;
    }
    
    //添加事件
    if(fn){
      config.event[eventName] = config.event[eventName] || {};

      //这里不再对重复事件做支持
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
      (filterName && key === filterName) && layui.each(item, callback);
    });
    
    return result;
  };
  
  //新增模块事件
  Layui.prototype.on = function(events, modName, callback){
    var that = this;
    return that.onevent.call(that, modName, events, callback);
  }
  
  //移除模块事件
  Layui.prototype.off = function(events, modName){
    var that = this;
    return that.event.call(that, modName, events, EV_REMOVE);
  };
  
  //exports layui
  win.layui = new Layui();
  
}(window); //gulp build: layui-footer

