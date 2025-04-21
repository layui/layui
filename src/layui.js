/**
 * Layui
 * Classic modular front-end UI library
 * MIT Licensed
 */

(function(window) {
  'use strict';

  // 便于打包时的字符压缩
  var document = window.document;
  var location = window.location;

  // 基础配置
  var config = {
    timeout: 10, // 符合规范的模块请求最长等待秒数
    debug: false, // 是否开启调试模式
    version: false // 是否在模块请求时加入版本号参数（以更新模块缓存）
  };

  // 模块加载缓存信息
  var cache = {
    modules: {}, // 模块物理路径
    status: {}, // 模块加载就绪状态
    event: {}, // 模块自定义事件
    callback: {} // 模块的回调
  };

  // constructor
  var Class = function() {
    this.v = '2.11.0'; // 版本号
  };

  // 识别预先可能定义的指定全局对象
  var GLOBAL = window.LAYUI_GLOBAL || {};

  // 获取 layui 所在目录
  var getPath = function() {
    var jsPath = (document.currentScript && document.currentScript.tagName.toUpperCase() === 'SCRIPT') ? document.currentScript.src : function(){
      var js = document.getElementsByTagName('script');
      var last = js.length - 1;
      var src;
      for(var i = last; i > 0; i--){
        if(js[i].readyState === 'interactive'){
          src = js[i].src;
          break;
        }
      }
      return src || js[last].src;
    }();

    return config.dir = GLOBAL.dir || jsPath.substring(0, jsPath.lastIndexOf('/') + 1);
  }();

  // 异常提示
  var error = function(msg, type) {
    type = type || 'log';
    window.console && console[type] && console[type]('layui error hint: ' + msg);
  };

  // 内置模块
  var builtinModules = config.builtin = {
    lay: 'lay', // 基础 DOM 操作
    layer: 'layer', // 弹层
    laydate: 'laydate', // 日期
    laypage: 'laypage', // 分页
    laytpl: 'laytpl', // 模板引擎
    form: 'form', // 表单集
    upload: 'upload', // 上传
    dropdown: 'dropdown', // 下拉菜单
    transfer: 'transfer', // 穿梭框
    tree: 'tree', // 树结构
    table: 'table', // 表格
    treeTable: 'treeTable', // 树表
    tabs: 'tabs', // 标签页
    element: 'element', // 常用元素操作
    rate: 'rate',  // 评分组件
    colorpicker: 'colorpicker', // 颜色选择器
    slider: 'slider', // 滑块
    carousel: 'carousel', // 轮播
    flow: 'flow', // 流加载
    util: 'util', // 工具块
    code: 'code', // 代码修饰器
    jquery: 'jquery', // DOM 库（第三方）
    component: 'component', // 组件构建器

    all: 'all',
    'layui.all': 'layui.all' // 聚合标识（功能性的，非真实模块）
  };

  /**
   * 低版本浏览器适配
   * @see polyfill
   */

  // Object.assign
  if (typeof Object.assign !== 'function') {
    Object.assign = function(target) {
      var to = Object(target);
      if (arguments.length < 2) return to;

      var sourcesIndex = 1;
      for (; sourcesIndex < arguments.length; sourcesIndex++) {
        var nextSource = arguments[sourcesIndex];
        if (!(nextSource === undefined || nextSource === null)) {
          for (var nextKey in nextSource) {
            // 确保属性是源对象自身的（而非来自继承）
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    };
  }

  /**
   * 节点加载事件
   * @param {HTMLElement} node - script 或 link 节点
   * @param {Function} done
   * @param {Function} error
   */
  var onNodeLoad = function(node, done, error) {
    // 资源加载完毕
    var onCompleted = function (e) {
      var readyRegExp = /^(complete|loaded)$/;
      if (e.type === 'load' || (readyRegExp.test((e.currentTarget || e.srcElement).readyState))) {
        removeListener();
        typeof done === 'function' && done(e);
      }
    };
    // 资源加载失败
    var onError = function (e) {
      removeListener();
      typeof error === 'function' && error(e);
    };

    // 移除事件
    var removeListener = function() {
      if (node.detachEvent) {
        node.detachEvent('onreadystatechange', onCompleted);
      } else {
        node.removeEventListener('load', onCompleted, false);
        node.removeEventListener('error', onError, false);
      }
    };

    // 添加事件
    if(node.attachEvent && !(node.attachEvent.toString && node.attachEvent.toString().indexOf('[native code') < 0)){
      // 此处考虑到 IE9+ load 的稳定性，固仍然采用 onreadystatechange
      node.attachEvent('onreadystatechange', onCompleted);
    } else {
      node.addEventListener('load', onCompleted, false);
      node.addEventListener('error', onError, false);
    }
  };

  // 获取配置及临时缓存信息
  Class.prototype.cache = Object.assign(config, cache);

  /**
   * 全局配置
   * @param {Object} options
   */
  Class.prototype.config = function(options) {
    Object.assign(config, options);
    return this;
  };

  /**
   * 定义模块
   * @param {(string|string[])} deps - 依赖的模块列表
   * @param {Function} callback - 模块的回调
   */
  Class.prototype.define = function(deps, callback) {
    var that = this;
    var useCallback = function() {
      var setModule = function(mod, exports) {
        layui[mod] = exports; // 将模块接口赋值在 layui 对象中
        cache.status[mod] = true; // 标记模块注册完成
      };
      // 执行模块的回调
      typeof callback === 'function' && callback(function(mod, exports) {
        setModule(mod, exports);
        // 记录模块回调，以便需要时再执行
        cache.callback[mod] = function() {
          callback(setModule);
        }
      });
      return this;
    };

    // 若未依赖模块
    if (typeof deps === 'function') {
      callback = deps;
      deps = [];
    }

    that.use(deps, useCallback, null, 'define');
    return that;
  };

  /**
   * 使用模块
   * @param {(string|string[])} mods - 模块列表
   * @param {Function} callback - 回调
   */
  Class.prototype.use = function(mods, callback, exports, from) {
    var that = this;
    var dir = config.dir = config.dir ? config.dir : getPath;

    // 整理模块队列
    mods = (function() {
      if (typeof mods === 'string') {
        return [mods];
      }
      // 若第一个参数为 function ，则自动加载所有内置模块，且执行的回调即为该 function 参数；
      else if(typeof mods === 'function') {
        callback = mods;
        return ['all'];
      }
      return mods;
    })();

    // 获取 layui 静态资源所在 host
    if (!config.host) {
      config.host = (dir.match(/\/\/([\s\S]+?)\//)||['//'+ location.host +'/'])[0];
    }

    // 若参数异常
    if (!mods) return that;

    // 若页面已经存在 jQuery 且所定义的模块依赖 jQuery，则不加载内部 jquery 模块
    if (window.jQuery && jQuery.fn.on) {
      that.each(mods, function(index, item) {
        if (item === 'jquery') {
          mods.splice(index, 1);
        }
      });
      layui.jquery = layui.$ = window.jQuery;
    }

    // 将模块的接口作为回调的参数传递
    exports = exports || [];

    // 加载当前队列的第一个模块
    var item = mods[0];
    var modInfo = that.modules[item]; // 当前模块信息
    // 是否为外部模块，即无需遵循 layui 轻量级模块规范的任意第三方组件。
    var isExternalModule = typeof modInfo === 'object';

    // 回调触发
    var onCallback = function () {
      exports.push(layui[item]);
      mods.length > 1
        ? that.use(mods.slice(1), callback, exports, from)
      : (typeof callback === 'function' && function() {
        // 保证文档加载完毕再执行回调
        if(layui.jquery && typeof layui.jquery === 'function' && from !== 'define'){
          return layui.jquery(function(){
            callback.apply(layui, exports);
          });
        }
        callback.apply(layui, exports);
      }() );
    };

    // 回调轮询
    var pollCallback = function () {
      var timeout = 0; // 超时计数器（秒）
      var delay = 5; // 轮询等待毫秒数

      // 轮询模块加载完毕状态
      (function poll() {
        if (++timeout > config.timeout * 1000 / delay) {
          return error(item + ' is not a valid module', 'error');
        };

        // 根据模块加载完毕的标志来完成轮询
        // 若为任意外部模块，则标志为该模块接口是否存在；
        // 若为遵循 layui 规范的模块，则标志为模块的 status 状态值
        (isExternalModule ? layui[item] = window[modInfo.api] : cache.status[item])
          ? onCallback()
        : setTimeout(poll, delay);
      })();
    };

    // 若为发行版，则内置模块不必异步加载
    if (mods.length === 0 || (layui['layui.all'] && builtinModules[item])) {
      return onCallback(), that;
    }

    // 当前模块所在路径
    var modSrc = isExternalModule ? modInfo.src : modInfo;

    // 基础路径
    var basePath = builtinModules[item]
      ? (dir + 'modules/')  // 若为内置模块，则按照默认 dir 参数拼接模块 URL
      : (modSrc ? '' : config.base); // 若为扩展模块，且模块路径已设置，则不必再重复拼接基础路径

    // 若从 layui.modules 为获取到模块路径, 则将传入的模块名视为路径名
    if (!modSrc) modSrc = item;

    // 过滤空格符和 .js 后缀
    modSrc = modSrc.replace(/\s/g, '').replace(/\.js[^\/\.]*$/, '');

    // 拼接最终模块 URL
    var url = basePath + modSrc + '.js';

    // 若扩展模块对象已经存在，则不必再重复加载
    if(!cache.modules[item] && layui[item]){
      cache.modules[item] = url; // 并记录起该扩展模块的 url
    }

    // 首次加载模块
    if (!cache.modules[item]) {
      var head = document.getElementsByTagName('head')[0];
      var node = document.createElement('script');

      node.async = true;
      node.charset = 'utf-8'; // 避免 IE9 的编码问题
      node.src = url + function() {
        var version = config.version === true
          ? (config.v || (new Date()).getTime())
          : (config.version || '');
        return version ? ('?v=' + version) : '';
      }();

      head.appendChild(node);

      // 节点加载事件
      onNodeLoad(node, function() {
        head.removeChild(node);
        pollCallback();
      }, function() {
        head.removeChild(node);
      });

      // 模块已首次加载的标记
      cache.modules[item] = url;
    } else { // 再次 use 模块
      pollCallback();
    }

    return that;
  };

  // 记录全部模块
  Class.prototype.modules = Object.assign({}, builtinModules);

  /**
   * 拓展模块
   * @param {Object} settings - 拓展模块的配置
   */
  Class.prototype.extend = function(settings) {
    var that = this;
    var base = config.base || '';
    var firstSymbolEXP = /^\{\/\}/; // 模块单独路径首字符表达式

    settings = settings || {};

    // 遍历拓展模块
    for (var modName in settings) {
      if (that[modName] || that.modules[modName]) { // 验证模块是否被占用
        error('the '+ modName + ' module already exists, extend failure');
      } else {
        var modInfo = settings[modName];
        // 若直接传入模块路径字符
        if (typeof modInfo === 'string') {
          // 判断传入的模块路径是否特定首字符
          // 若存在特定首字符，则模块 URL 即为该首字符后面紧跟的字符
          // 否则，则按照 config.base 路径进行拼接
          if (firstSymbolEXP.test(modInfo))  base = '';
          modInfo = (base + modInfo).replace(firstSymbolEXP, '');
        }
        that.modules[modName] = modInfo;
      }
    }

    return that;
  };

  /**
   * 弃用指定的模块，以便重新扩展新的同名模块。
   * @param {(string|string[])} mods - 模块列表
   */
  Class.prototype.disuse = function(mods) {
    var that = this;
    mods = that.isArray(mods) ? mods : [mods];
    that.each(mods, function (index, item) {
      delete that[item];
      delete builtinModules[item];
      delete that.modules[item];
      delete cache.status[item];
      delete cache.modules[item];
    });
    return that;
  };

  /**
   * 获取节点的 style 属性值
   * currentStyle.getAttribute 参数为 camelCase 形式的字符串
   * @param {HTMLElement} node - 节点
   * @param {string} name - 属性名
   * @returns 属性值
   */
  Class.prototype.getStyle = function(node, name) {
    var style = node.currentStyle ? node.currentStyle : window.getComputedStyle(node, null);
    return style.getPropertyValue
      ? style.getPropertyValue(name)
      : style.getAttribute(name.replace(/-(\w)/g, function(_, c){ return c ? c.toUpperCase() : '';}));
  };

  /**
   * CSS 外部加载器
   * @param {string} href - 外部 CSS 文件路径
   * @param {Function} callback - 回调函数
   * @param {string} id - 定义 link 标签的 id
   */
  Class.prototype.link = function(href, callback, id) {
    var that = this;
    var head = document.getElementsByTagName('head')[0];
    var hasCallback = typeof callback === 'function';

    // 若第二个参数为 string 类型，则该参数为 id
    if (typeof callback === 'string') {
      id = callback;
    }

    // 若加载多个
    if (typeof href === 'object') {
      var isArr = that.type(id) === 'array';
      return that.each(href, function(index, value){
        that.link(
          value,
          index === href.length - 1 && callback,
          isArr && id[index]
        );
      });
    }

    // 若未传入 id ，则取路径 `//` 后面的字符拼接为 id，不含.与参数
    id = id || href.replace(/^(#|(http(s?)):\/\/|\/\/)|\.|\/|\?.+/g, '');
    id = 'layuicss-'+ id;

    var link = document.getElementById(id);

    // 初始创建节点
    if (!link) {
      link = document.createElement('link');
      link.href = href + (config.debug ? '?v='+new Date().getTime() : '');
      link.rel = 'stylesheet';
      link.id = id;
      head.appendChild(link);
    }

    // 若加载已完成，则直接执行回调函数
    if (link.__lay_readyState__ === 'complete') {
      hasCallback && callback(link);
      return that;
    }

    // 初始加载
    onNodeLoad(link, function() {
      link.__lay_readyState__ = 'complete';
      hasCallback && callback(link);
    }, function() {
      error(href + ' load error', 'error');
      head.removeChild(link); // 移除节点
    });

    return that;
  };

  /**
   * CSS 内部加载器
   * @param {string} modName - 模块名
   */
  Class.prototype.addcss = function(modName, callback, id) {
    return layui.link(config.dir + 'css/' + modName, callback, id);
  };

  /**
   * 获取执行定义模块时的回调函数，factory 为向下兼容
   * @param {string} modName - 模块名
   * @returns {Function}
   */
  Class.prototype.factory = function(modName) {
    if (layui[modName]) {
      return typeof config.callback[modName] === 'function'
        ? config.callback[modName]
      : null;
    }
  };

  /**
   * 图片预加载
   * @param {string} url - 图片路径
   * @param {Function} callback - 成功回调
   * @param {Function} error - 错误回调
   */
  Class.prototype.img = function(url, callback, error) {
    var img = new Image();
    img.src = url;
    if (img.complete) {
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

  /**
   * location.hash 路由解析
   * @param {string} hash 值
   * @returns {Object}
   */
  Class.prototype.router = Class.prototype.hash = function(hash) {
    var that = this;
    var hash = hash || location.hash;
    var data = {
      path: [],
      pathname: [],
      search: {},
      hash: (hash.match(/[^#](#.*$)/) || [])[1] || '',
      href: ''
    };

    // 禁止非 hash 路由规范
    if (!/^#/.test(hash)) {
      return data;
    }

    hash = hash.replace(/^#/, '');
    data.href = hash;
    hash = hash.replace(/([^#])(#.*$)/, '$1').split('/') || [];

    // 提取 Hash 结构
    that.each(hash, function(index, item) {
      /^\w+=/.test(item) ? function(){
        item = item.split('=');
        data.search[item[0]] = item[1];
      }() : data.path.push(item);
    });

    data.pathname = data.path; // path → pathname, 与 layui.url 一致
    return data;
  };

  /**
   * URL 解析
   * @param {string} href - url 路径
   * @returns {Object}
   */
  Class.prototype.url = function(href) {
    var that = this;
    var data = {
      // 提取 url 路径
      pathname: function() {
        var pathname = href
          ? function(){
            var str = (href.match(/\.[^.]+?\/.+/) || [])[0] || '';
            return str.replace(/^[^\/]+/, '').replace(/\?.+/, '');
          }()
        : location.pathname;
        return pathname.replace(/^\//, '').split('/');
      }(),

      // 提取 url 参数
      search: function(){
        var obj = {};
        var search = (href
          ? function(){
            var str = (href.match(/\?.+/) || [])[0] || '';
            return str.replace(/\#.+/, '');
          }()
          : location.search
        ).replace(/^\?+/, '').split('&'); // 去除 ?，按 & 分割参数

        // 遍历分割后的参数
        that.each(search, function(index, item) {
          var _index = item.indexOf('=');
          var key = function() { // 提取 key
            if (_index < 0) {
              return item.substr(0, item.length);
            } else if(_index === 0) {
              return false;
            } else {
              return item.substr(0, _index);
            }
          }();
          // 提取 value
          if (key) {
            obj[key] = _index > 0 ? item.substr(_index + 1) : null;
          }
        });

        return obj;
      }(),

      // 提取 Hash
      hash: that.router(function() {
        return href
          ? ((href.match(/#.+/) || [])[0] || '/')
        : location.hash;
      }())
    };

    return data;
  };

  /**
   * 本地持久存储
   * @param {string} table - 表名
   * @param {Object} settings - 设置项
   * @param {Storage} storage - 存储对象，localStorage 或 sessionStorage
   * @returns {Object}
   */
  Class.prototype.data = function(table, settings, storage) {
    table = table || 'layui';
    storage = storage || localStorage;

    // 如果 settings 为 null，则删除表
    if (settings === null) {
      return delete storage[table];
    }

    settings = typeof settings === 'object'
      ? settings
    : {key: settings};

    try {
      var data = JSON.parse(storage[table]);
    } catch(e) {
      var data = {};
    }

    if ('value' in settings) data[settings.key] = settings.value;
    if (settings.remove) delete data[settings.key];
    storage[table] = JSON.stringify(data);

    return settings.key ? data[settings.key] : data;
  };

  /**
   * 本地临时存储
   * @param {string} table - 表名
   * @param {Object} settings - 设置项
   * @returns {Object}
   */
  Class.prototype.sessionData = function(table, settings) {
    return this.data(table, settings, sessionStorage);
  }

  /**
   * 设备信息
   * @param {string} key - 任意 key
   * @returns {Object}
   */
  Class.prototype.device = function(key) {
    var agent = navigator.userAgent.toLowerCase();

    // 获取版本号
    var getVersion = function(label) {
      var exp = new RegExp(label + '/([^\\s\\_\\-]+)');
      label = (agent.match(exp)||[])[1];
      return label || false;
    };

    // 返回结果集
    var result = {
      os: function() { // 底层操作系统
        if (/windows/.test(agent)) {
          return 'windows';
        } else if(/linux/.test(agent)) {
          return 'linux';
        } else if(/iphone|ipod|ipad|ios/.test(agent)) {
          return 'ios';
        } else if(/mac/.test(agent)) {
          return 'mac';
        }
      }(),
      ie: function() { // ie 版本
        return (!!window.ActiveXObject || "ActiveXObject" in window) ? (
          (agent.match(/msie\s(\d+)/) || [])[1] || '11' // 由于 ie11 并没有 msie 的标识
        ) : false;
      }(),
      weixin: getVersion('micromessenger')  // 是否微信
    };

    // 任意的 key
    if (key && !result[key]) {
      result[key] = getVersion(key);
    }

    // 移动设备
    result.android = /android/.test(agent);
    result.ios = result.os === 'ios';
    result.mobile = (result.android || result.ios);

    return result;
  };

  // 提示
  Class.prototype.hint = function() {
    return {
      error: error
    };
  };

  /**
   * typeof 类型细分 -> string/number/boolean/undefined/null、object/array/function/…
   * @param {*} operand - 任意值
   * @returns {string}
   */
  Class.prototype._typeof = Class.prototype.type = function(operand) {
    if(operand === null) return String(operand);

    // 细分引用类型
    return (typeof operand === 'object' || typeof operand === 'function') ? function() {
      var type = Object.prototype.toString.call(operand).match(/\s(.+)\]$/) || []; // 匹配类型字符
      var classType = 'Function|Array|Date|RegExp|Object|Error|Symbol'; // 常见类型字符

      type = type[1] || 'Object';

      // 除匹配到的类型外，其他对象均返回 object
      return new RegExp('\\b('+ classType + ')\\b').test(type)
        ? type.toLowerCase()
      : 'object';
    }() : typeof operand;
  };

  /**
   * 对象是否具备数组结构（此处为兼容 jQuery 对象）
   * @param {Object} obj - 任意对象
   * @returns {boolean}
   */
  Class.prototype._isArray = Class.prototype.isArray = function(obj) {
    var that = this;
    var len;
    var type = that.type(obj);

    if (!obj || (typeof obj !== 'object') || obj === window) return false;

    len = 'length' in obj && obj.length; // 兼容 ie
    return type === 'array' || len === 0 || (
      typeof len === 'number' && len > 0 && (len - 1) in obj // 兼容 jQuery 对象
    );
  };

  /**
   * 遍历
   * @param {Object} obj - 任意对象
   * @param {Function} fn - 遍历回调
   */
  Class.prototype.each = function(obj, fn) {
    var key;
    var that = this;
    var callback = function(key, obj) {
      return fn.call(obj[key], key, obj[key]);
    };

    if (typeof fn !== 'function') {
      return that;
    }

    obj = obj || [];

    // 优先处理数组结构
    if (that.isArray(obj)) {
      for (key = 0; key < obj.length; key++) {
        if(callback(key, obj)) break;
      }
    } else {
      for (key in obj) {
        if(callback(key, obj)) break;
      }
    }

    return that;
  };

  /**
   * 将数组中的成员对象按照某个 key 的 value 值进行排序
   * @param {Object[]} arr - 任意数组
   * @param {string} key - 任意 key
   * @param {boolean} desc - 是否降序
   * @param {boolean} notClone - 是否不对 arr 进行克隆
   * @returns {Object[]}
   */
  Class.prototype.sort = function(arr, key, desc, notClone) {
    var that = this;
    var clone = notClone ? (arr || []) : JSON.parse(
      JSON.stringify(arr || [])
    );

    // 若未传入 key，则直接返回原对象
    if (that.type(arr) === 'object' && !key) {
      return clone;
    } else if(typeof arr !== 'object') { // 若 arr 非对象
      return [clone];
    }

    // 开始排序
    clone.sort(function(o1, o2) {
      var v1 = o1[key];
      var v2 = o2[key];

      /*
       * 特殊数据
       * 若比较的成员均非对象
       */

      // 若比较的成员均为数字
      if (!isNaN(o1) && !isNaN(o2)) return o1 - o2;

      // 若比较的成员只存在某一个非对象
      if (!isNaN(o1) && isNaN(o2)) {
        if(key && typeof o2 === 'object'){
          v1 = o1;
        } else {
          return -1;
        }
      } else if (isNaN(o1) && !isNaN(o2)) {
        if (key && typeof o1 === 'object') {
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
      if (isNum[0] && isNum[1]) {
        if(v1 && (!v2 && v2 !== 0)) { // 数字 vs 空
          return 1;
        } else if((!v1 && v1 !== 0) && v2) { // 空 vs 数字
          return -1;
        } else { // 数字 vs 数字
          return v1 - v2;
        }
      }

      /**
       * 字典序排序
       */

      // 若为非数字比较
      if (!isNum[0] && !isNum[1]) {
        // 字典序比较
        if (v1 > v2) {
          return 1;
        } else if (v1 < v2) {
          return -1;
        } else {
          return 0;
        }
      }

      // 若为混合比较
      if (isNum[0] || !isNum[1]) { // 数字 vs 非数字
        return -1;
      } else if(!isNum[0] || isNum[1]) { // 非数字 vs 数字
        return 1;
      }

    });

    desc && clone.reverse(); // 倒序
    return clone;
  };

  /**
   * 阻止事件冒泡
   * @param {Event} thisEvent - 事件对象
   */
  Class.prototype.stope = function(thisEvent) {
    try {
      thisEvent.stopPropagation();
    } catch(e) {
      thisEvent.cancelBubble = true;
    }
  };

  // 字符常理
  var EV_REMOVE = 'LAYUI-EVENT-REMOVE';

  /**
   * 自定义模块事件
   * @param {string} modName - 模块名
   * @param {string} events - 事件名
   * @param {Function} callback - 回调
   * @returns {Object}
   */
  Class.prototype.onevent = function(modName, events, callback) {
    if (typeof modName !== 'string' || typeof callback !== 'function') {
      return this;
    }
    return Class.event(modName, events, null, callback);
  };

  /**
   * 执行自定义模块事件
   * @param {string} modName - 模块名
   * @param {string} events - 事件名
   * @param {Object} params - 参数
   * @param {Function} fn - 回调
   */
  Class.prototype.event = Class.event = function(modName, events, params, fn) {
    var that = this;
    var result = null;
    var filter = (events || '').match(/\((.*)\)$/)||[]; // 提取事件过滤器字符结构，如：select(xxx)
    var eventName = (modName + '.'+ events).replace(filter[0], ''); // 获取事件名称，如：form.select
    var filterName = filter[1] || ''; // 获取过滤器名称, 如：xxx
    var callback = function(_, item) {
      var res = item && item.call(that, params);
      res === false && result === null && (result = false);
    };

    // 如果参数传入特定字符，则执行移除事件
    if (params === EV_REMOVE) {
      delete (that.cache.event[eventName] || {})[filterName];
      return that;
    }

    // 添加事件
    if (fn) {
      cache.event[eventName] = cache.event[eventName] || {};

      if (filterName) {
        // 带 filter 不支持重复事件
        cache.event[eventName][filterName] = [fn];
      } else {
        // 不带 filter 处理的是所有的同类事件，应该支持重复事件
        cache.event[eventName][filterName] = cache.event[eventName][filterName] || [];
        cache.event[eventName][filterName].push(fn);
      }
      return this;
    }

    // 执行事件回调
    layui.each(cache.event[eventName], function(key, item) {
      // 执行当前模块的全部事件
      if (filterName === '{*}') {
        layui.each(item, callback);
        return;
      }

      // 执行指定事件
      key === '' && layui.each(item, callback);
      (filterName && key === filterName) && layui.each(item, callback);
    });

    return result;
  };

  /**
   * 新增模块事件
   * @param {string} events - 事件名
   * @param {string} modName - 模块名
   * @param {Function} callback - 回调
   * @returns {Object}
   */
  Class.prototype.on = function(events, modName, callback) {
    var that = this;
    return that.onevent.call(that, modName, events, callback);
  }

  /**
   * 移除模块事件
   * @param {string} events - 事件名
   * @param {string} modName - 模块名
   * @returns {Object}
   */
  Class.prototype.off = function(events, modName) {
    var that = this;
    return that.event.call(that, modName, events, EV_REMOVE);
  };

  /**
   * 防抖
   * @param {Function} func - 回调
   * @param {number} wait - 延时执行的毫秒数
   * @returns {Function}
   */
  Class.prototype.debounce = function (func, wait) {
    var timeout;
    return function () {
      var context = this;
      var args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        func.apply(context, args);
      }, wait);
    }
  };

  /**
   * 节流
   * @param {Function} func - 回调
   * @param {number} wait - 不重复执行的毫秒数
   */
  Class.prototype.throttle = function (func, wait) {
    var cooldown = false;
    return function () {
      var context = this;
      var args = arguments;
      if (!cooldown) {
        func.apply(context, args);
        cooldown = true;
        setTimeout(function () {
          cooldown = false;
        }, wait);
      }
    }
  };

  // export layui
  window.layui = new Class();
})(window);
