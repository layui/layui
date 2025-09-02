/**
 * Layui
 * Classic modular front-end UI library
 * MIT Licensed
 */

  // 便于打包时的字符压缩
  var document$2 = window.document;
  var location$1 = window.location;

  // 基础配置
  var config$2 = {
    timeout: 10, // 符合规范的模块请求最长等待秒数
    debug: false, // 是否开启调试模式
    version: false // 是否在模块请求时加入版本号参数（以更新模块缓存）
  };

  // 模块加载缓存信息
  var cache$1 = {
    modules: {}, // 模块物理路径
    status: {}, // 模块加载就绪状态
    event: {}, // 模块自定义事件
    callback: {} // 模块的回调
  };

  // constructor
  var Class$g = function() {
    this.v = '2.11.6'; // 版本号
  };

  // 识别预先可能定义的指定全局对象
  var GLOBAL$1 = window.LAYUI_GLOBAL || {};

  // 获取 layui 所在目录
  var getPath = function() {
    var jsPath = (document$2.currentScript && document$2.currentScript.tagName.toUpperCase() === 'SCRIPT') ? document$2.currentScript.src : function(){
      var js = document$2.getElementsByTagName('script');
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

    return config$2.dir = GLOBAL$1.dir || jsPath.substring(0, jsPath.lastIndexOf('/') + 1);
  }();

  // 异常提示
  var error = function(msg, type) {
    type = type || 'log';
    window.console && console[type] && console[type]('layui error hint: ' + msg);
  };

  // 内置模块
  var builtinModules = config$2.builtin = {
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
  Class$g.prototype.cache = Object.assign(config$2, cache$1);

  /**
   * 全局配置
   * @param {Object} options
   */
  Class$g.prototype.config = function(options) {
    Object.assign(config$2, options);
    return this;
  };

  /**
   * 定义模块
   * @param {(string|string[])} deps - 依赖的模块列表
   * @param {Function} callback - 模块的回调
   */
  Class$g.prototype.define = function(deps, callback) {
    var that = this;
    var useCallback = function() {
      var setModule = function(mod, exports) {
        layui[mod] = exports; // 将模块接口赋值在 layui 对象中
        cache$1.status[mod] = true; // 标记模块注册完成
      };
      // 执行模块的回调
      typeof callback === 'function' && callback(function(mod, exports) {
        setModule(mod, exports);
        // 记录模块回调，以便需要时再执行
        cache$1.callback[mod] = function() {
          callback(setModule);
        };
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
  Class$g.prototype.use = function(mods, callback, exports, from) {
    var that = this;
    var dir = config$2.dir = config$2.dir ? config$2.dir : getPath;

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
    if (!config$2.host) {
      config$2.host = (dir.match(/\/\/([\s\S]+?)\//)||['//'+ location$1.host +'/'])[0];
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
        if (++timeout > config$2.timeout * 1000 / delay) {
          return error(item + ' is not a valid module', 'error');
        }
        // 根据模块加载完毕的标志来完成轮询
        // 若为任意外部模块，则标志为该模块接口是否存在；
        // 若为遵循 layui 规范的模块，则标志为模块的 status 状态值
        (isExternalModule ? layui[item] = window[modInfo.api] : cache$1.status[item])
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
      : (modSrc ? '' : config$2.base); // 若为扩展模块，且模块路径已设置，则不必再重复拼接基础路径

    // 若从 layui.modules 为获取到模块路径, 则将传入的模块名视为路径名
    if (!modSrc) modSrc = item;

    // 过滤空格符和 .js 后缀
    modSrc = modSrc.replace(/\s/g, '').replace(/\.js[^\/\.]*$/, '');

    // 拼接最终模块 URL
    var url = basePath + modSrc + '.js';

    // 若扩展模块对象已经存在，则不必再重复加载
    if(!cache$1.modules[item] && layui[item]){
      cache$1.modules[item] = url; // 并记录起该扩展模块的 url
    }

    // 首次加载模块
    if (!cache$1.modules[item]) {
      var head = document$2.getElementsByTagName('head')[0];
      var node = document$2.createElement('script');

      node.async = true;
      node.charset = 'utf-8'; // 避免 IE9 的编码问题
      node.src = url + function() {
        var version = config$2.version === true
          ? (config$2.v || (new Date()).getTime())
          : (config$2.version || '');
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
      cache$1.modules[item] = url;
    } else { // 再次 use 模块
      pollCallback();
    }

    return that;
  };

  // 记录全部模块
  Class$g.prototype.modules = Object.assign({}, builtinModules);

  /**
   * 拓展模块
   * @param {Object} settings - 拓展模块的配置
   */
  Class$g.prototype.extend = function(settings) {
    var that = this;
    var base = config$2.base || '';
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
  Class$g.prototype.disuse = function(mods) {
    var that = this;
    mods = that.isArray(mods) ? mods : [mods];
    that.each(mods, function (index, item) {
      delete that[item];
      delete builtinModules[item];
      delete that.modules[item];
      delete cache$1.status[item];
      delete cache$1.modules[item];
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
  Class$g.prototype.getStyle = function(node, name) {
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
  Class$g.prototype.link = function(href, callback, id) {
    var that = this;
    var head = document$2.getElementsByTagName('head')[0];
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

    var link = document$2.getElementById(id);

    // 初始创建节点
    if (!link) {
      link = document$2.createElement('link');
      link.href = href + (config$2.debug ? '?v='+new Date().getTime() : '');
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
  Class$g.prototype.addcss = function(modName, callback, id) {
    return layui.link(config$2.dir + 'css/' + modName, callback, id);
  };

  /**
   * 获取执行定义模块时的回调函数，factory 为向下兼容
   * @param {string} modName - 模块名
   * @returns {Function}
   */
  Class$g.prototype.factory = function(modName) {
    if (layui[modName]) {
      return typeof config$2.callback[modName] === 'function'
        ? config$2.callback[modName]
      : null;
    }
  };

  /**
   * 图片预加载
   * @param {string} url - 图片路径
   * @param {Function} callback - 成功回调
   * @param {Function} error - 错误回调
   */
  Class$g.prototype.img = function(url, callback, error) {
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
  Class$g.prototype.router = Class$g.prototype.hash = function(hash) {
    var that = this;
    var hash = hash || location$1.hash;
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
  Class$g.prototype.url = function(href) {
    var that = this;
    var data = {
      // 提取 url 路径
      pathname: function() {
        var pathname = href
          ? function(){
            var str = (href.match(/\.[^.]+?\/.+/) || [])[0] || '';
            return str.replace(/^[^\/]+/, '').replace(/\?.+/, '');
          }()
        : location$1.pathname;
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
          : location$1.search
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
        : location$1.hash;
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
  Class$g.prototype.data = function(table, settings, storage) {
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
  Class$g.prototype.sessionData = function(table, settings) {
    return this.data(table, settings, sessionStorage);
  };

  /**
   * 设备信息
   * @param {string} key - 任意 key
   * @returns {Object}
   */
  Class$g.prototype.device = function(key) {
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
  Class$g.prototype.hint = function() {
    return {
      error: error
    };
  };

  /**
   * typeof 类型细分 -> string/number/boolean/undefined/null、object/array/function/…
   * @param {*} operand - 任意值
   * @returns {string}
   */
  Class$g.prototype._typeof = Class$g.prototype.type = function(operand) {
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
  Class$g.prototype._isArray = Class$g.prototype.isArray = function(obj) {
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
  Class$g.prototype.each = function(obj, fn) {
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
  Class$g.prototype.sort = function(arr, key, desc, notClone) {
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
  Class$g.prototype.stope = function(thisEvent) {
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
  Class$g.prototype.onevent = function(modName, events, callback) {
    if (typeof modName !== 'string' || typeof callback !== 'function') {
      return this;
    }
    return Class$g.event(modName, events, null, callback);
  };

  /**
   * 执行自定义模块事件
   * @param {string} modName - 模块名
   * @param {string} events - 事件名
   * @param {Object} params - 参数
   * @param {Function} fn - 回调
   */
  Class$g.prototype.event = Class$g.event = function(modName, events, params, fn) {
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
      cache$1.event[eventName] = cache$1.event[eventName] || {};

      if (filterName) {
        // 带 filter 不支持重复事件
        cache$1.event[eventName][filterName] = [fn];
      } else {
        // 不带 filter 处理的是所有的同类事件，应该支持重复事件
        cache$1.event[eventName][filterName] = cache$1.event[eventName][filterName] || [];
        cache$1.event[eventName][filterName].push(fn);
      }
      return this;
    }

    // 执行事件回调
    layui.each(cache$1.event[eventName], function(key, item) {
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
  Class$g.prototype.on = function(events, modName, callback) {
    var that = this;
    return that.onevent.call(that, modName, events, callback);
  };

  /**
   * 移除模块事件
   * @param {string} events - 事件名
   * @param {string} modName - 模块名
   * @returns {Object}
   */
  Class$g.prototype.off = function(events, modName) {
    var that = this;
    return that.event.call(that, modName, events, EV_REMOVE);
  };

  /**
   * 防抖
   * @param {Function} func - 回调
   * @param {number} wait - 延时执行的毫秒数
   * @returns {Function}
   */
  Class$g.prototype.debounce = function (func, wait) {
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
  Class$g.prototype.throttle = function (func, wait) {
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

  // 创建全局实例以保持兼容性  
  const layui = new Class$g();

var document$1 = window.document;

  /**
   * 元素查找
   * @param {string | HTMLElement | JQuery} selector
   */
  var lay = function(selector){
    return new Class$f(selector);
  };

  // 构造器
  var Class$f = function(selector){
    var that = this;
    var elem = typeof selector === 'object' ? function(){
      // 仅适配简单元素对象
      return layui.isArray(selector) ? selector : [selector];
    }() : (
      this.selector = selector,
      document$1.querySelectorAll(selector || null)
    );

    lay.each(elem, function(index, item){
      that.push(elem[index]);
    });
  };

  /*
   * API 兼容
   */
  Array.prototype.indexOf = Array.prototype.indexOf || function(searchElement, fromIndex) {
    var rst = -1;
    fromIndex = fromIndex || 0;
    layui.each(this, function(index, val){
      if (searchElement === val && index >= fromIndex) {
        rst = index;
        return true;
      }
    });
    return rst;
  };

  /*
    lay 对象操作
  */

  Class$f.fn = Class$f.prototype = [];
  Class$f.fn.constructor = Class$f;

  /**
   * 将两个或多个对象的内容深度合并到第一个对象中
   * @callback ExtendFunc
   * @param {*} target - 一个对象
   * @param {...*} objectN - 包含额外的属性合并到第一个参数
   * @returns {*} 返回合并后的对象
   */
  /** @type ExtendFunc*/
  lay.extend = function(){
    var ai = 1;
    var length;
    var args = arguments;
    var clone = function(target, obj){
      target = target || (layui.type(obj) === 'array' ? [] : {}); // 目标对象
      for(var i in obj){
        // 若值为普通对象，则进入递归，继续深度合并
        target[i] = (obj[i] && obj[i].constructor === Object)
          ? clone(target[i], obj[i])
        : obj[i];
      }
      return target;
    };

    args[0] = typeof args[0] === 'object' ? args[0] : {};
    length = args.length;

    for(; ai < length; ai++){
      if(typeof args[ai] === 'object'){
        clone(args[0], args[ai]);
      }
    }
    return args[0];
  };

  /**
   * IE 版本
   * @type {string | boolean} - 如果是 IE 返回版本字符串，否则返回 false
   */
  lay.ie = function(){
    var agent = navigator.userAgent.toLowerCase();
    return (!!window.ActiveXObject || "ActiveXObject" in window) ? (
      (agent.match(/msie\s(\d+)/) || [])[1] || '11' // 由于 ie11 并没有 msie 的标识
    ) : false;
  }();


  /**
   * 获取 layui 常见方法，以便用于组件单独版
   */

  lay.layui = layui || {};
  lay.getPath = layui.cache.dir; // 获取当前 JS 所在目录
  lay.stope = layui.stope; // 中止冒泡
  lay.each = function(){ // 遍历
    layui.each.apply(layui, arguments);
    return this;
  };


  /**
   * 数字前置补零
   * @param {number | string} num - 原始数字
   * @param {number} [length=2] - 数字长度，如果原始数字长度小于 length，则前面补零
   * @returns {string} 返回补 0 后的数字
   * @example
   * ```js
   * lay.digit(6, 2); // "06"
   * lay.digit('7', 3); // "007"
   * ```
   */
  lay.digit = function(num, length){
    if(!(typeof num === 'string' || typeof num === 'number')) return '';

    var str = '';
    num = String(num);
    length = length || 2;
    for(var i = num.length; i < length; i++){
      str += '0';
    }
    return num < Math.pow(10, length) ? str + num : num;
  };

  /**
   * 创建元素
   * @param {string} elemName - 元素的标签名
   * @param {Object.<string, string>} [attr] - 添加到元素上的属性
   * @returns {HTMLElement} 返回创建的 HTML 元素
   * @example
   * ```js
   * lay.elem('div', {id: 'test'}) // <div id="test"></div>
   * ```
   */
  lay.elem = function(elemName, attr){
    var elem = document$1.createElement(elemName);
    lay.each(attr || {}, function(key, value){
      elem.setAttribute(key, value);
    });
    return elem;
  };

  /**
   * 当前页面是否存在滚动条
   * @returns {boolean} 是否存在滚动条
   * @example
   * ```
   * lay.hasScrollbar() // true 或 false
   * ```
   */
  lay.hasScrollbar = function(){
    return document$1.body.scrollHeight > (window.innerHeight || document$1.documentElement.clientHeight);
  };

  /**
   * 获取 style rules
   * @param {HTMLStyleElement} style - HTMLStyle 元素
   * @param {(ruleItem: CSSStyleRule, index: number) => boolean} [callback] - 用来返回 style 元素中的每个 `style rule` 的函数，返回 true 终止遍历
   * @returns {CSSRuleList } 返回 `style rules`
   * @example
   * ```
   * <style id="test">
   *   .lay-card{
   *     color: #000;
   *   }
   *   .lay-btn-success{
   *     color: green;
   *   }
   * </style>
   *
   * lay.getStyleRules($('#test')[0], function(rule, index){
   *   if(rule.selectorText === '.lay-card'){
   *     console.log(index, rule.cssText) // 0 '.lay-card{color: #000}'
   *     rule.style.color = '#EEE';
   *     return true; // 终止遍历
   *   }
   * }) // RuleList
   * ```
   */
  lay.getStyleRules = function(style, callback) {
    if (!style) return;

    var sheet = style.sheet || style.styleSheet || {};
    var rules = sheet.cssRules || sheet.rules;

    if (typeof callback === 'function') {
      layui.each(rules, function(i, item){
        if (callback(item, i)) return true;
      });
    }

    return rules;
  };

  /**
   * 创建 style 样式
   * @param {Object} options - 可配置的选项
   * @param {string | HTMLElement | JQuery} [options.target] - 目标容器，指定后会将样式追加到目标容器
   * @param {string} [options.id] - 样式元素的 id，默认自增
   * @param {string} options.text - 样式内容
   * @returns {HTMLStyleElement} 返回创建的样式元素
   * @example
   * ```html
   * <div id="targetEl">
   *   <!-- 样式追加到目标容器 -->
   *   <style id="LAY-STYLE-DF-0">.card{color: #000}</style>
   * </div>
   *
   * lay.style({
   *   target: '#targetEl',
   *   text: '.card{color: #000}'
   * }) // <style id="LAY-STYLE-DF-0">.card{color: #000}</style>
   * ```
   */
  lay.style = function(options){
    options = options || {};

    var style = lay.elem('style');
    var styleText = options.text || '';
    var target = options.target;

    if (!styleText) return;

    // 添加样式
    if ('styleSheet' in style) {
      style.setAttribute('type', 'text/css');
      style.styleSheet.cssText = styleText;
    } else {
      style.innerHTML = styleText;
    }

    // ID
    style.id = 'LAY-STYLE-'+ (options.id || function(index) {
      lay.style.index++;
      return 'DF-'+ index;
    }(lay.style.index || 0));

    // 是否向目标容器中追加 style 元素
    if (target) {
      var styleElem = lay(target).find('#'+ style.id);
      styleElem[0] && styleElem.remove();
      lay(target).append(style);
    }

    return style;
  };

  /**
   * 将元素定位到指定目标元素附近
   * @param {HTMLElement} target - 目标元素
   * @param {HTMLElement} elem - 定位元素
   * @param {Object} [opts] - 可配置的选项
   * @param {'absolute' | 'fixed'} [opts.position] - 元素的定位类型
   * @param {'left' | 'right'} [opts.clickType="left"] - 点击类型，默认为 'left'，如果 {@link target} 是 document 或 body 元素，则为 'right'
   * @param {'left' | 'right' | 'center'} [opts.align="left"] - 对齐方式
   * @param {boolean} [opts.allowBottomOut=false] - 顶部没有足够区域显示时，是否允许底部溢出
   * @param {string | number} [opts.margin=5] - 边距
   * @param {Event} [opts.e] - 事件对象，仅右键生效
   * @param {boolean} [opts.SYSTEM_RELOAD] - 是否重载，用于出现滚动条时重新计算位置
   * @param {[offsetX:number, offsetY:number]} [opts.offset] - 相对于触发元素的额外偏移量[x,y]
   * @example
   * ```js
   * <button id="targetEl">dropdown</button>
   * <ul id="contentEl" class="dropdown-menu">
   *   <li>菜单1</li>
   *   <li>菜单2</li>
   * </ul>
   *
   * // 下拉菜单将被定位到按钮附近
   * lay.position(
   *   $('#targetEl')[0],
   *   $('#contentEl')[0],
   *   {
   *     position: 'fixed',
   *     align: 'center'
   *   }
   * )
   * ```
   */
  lay.position = function(target, elem, opts){
    if(!elem) return;
    opts = opts || {};

    // 如果绑定的是 document 或 body 元素，则直接获取鼠标坐标
    if(target === document$1 || target === lay('body')[0]){
      opts.clickType = 'right';
    }

    // 绑定绑定元素的坐标
    var rect = opts.clickType === 'right' ? function(){
      var e = opts.e || window.event || {};
      return {
        left: e.clientX,
        top: e.clientY,
        right: e.clientX,
        bottom: e.clientY
      }
    }() : target.getBoundingClientRect();
    var elemWidth = elem.offsetWidth; // 控件的宽度
    var elemHeight = elem.offsetHeight; // 控件的高度

    // 滚动条高度
    var scrollArea = function(type){
      type = type ? 'scrollLeft' : 'scrollTop';
      return document$1.body[type] | document$1.documentElement[type];
    };

    // 窗口宽高
    var winArea = function(type){
      return document$1.documentElement[type ? 'clientWidth' : 'clientHeight']
    };
    var margin = 'margin' in opts ? opts.margin : 5;
    var left = rect.left;
    var top = rect.bottom;

    // 相对元素居中
    if(opts.align === 'center'){
      left = left - (elemWidth - target.offsetWidth) / 2;
    } else if(opts.align === 'right'){
      left = left - elemWidth + target.offsetWidth;
    }

    // 判断右侧是否超出边界
    if(left + elemWidth + margin > winArea('width')){
      left = winArea('width') - elemWidth - margin; // 如果超出右侧，则将面板向右靠齐
    }
    // 左侧是否超出边界
    if(left < margin) left = margin;


    // 判断底部和顶部是否超出边界
    if(rect.bottom + elemHeight + margin > winArea()){ // 底部超出边界
      // 优先判断顶部是否有足够区域显示完全，且底部不能超出边界
      if(rect.top > elemHeight + margin && rect.top <= winArea() ){
        top = rect.top - elemHeight - margin*2; // 顶部有足够的区域显示
      } else if(!opts.allowBottomOut){ // 顶部没有足够区域显示时，是否允许底部溢出
        top = winArea() - elemHeight - margin*2; // 面板向底部靠齐
        if(top < 0) top = 0; // 如果面板底部靠齐时，又溢出窗口顶部，则只能将顶部靠齐
      }
    }
    /*
    if(top + elemHeight + margin > winArea()){
      // 优先顶部是否有足够区域显示完全
      if(rect.top > elemHeight + margin){
        top = rect.top - elemHeight - margin*2; // 顶部有足够的区域显示
      } else {
        // 如果面板是鼠标右键弹出，且顶部没有足够区域显示，则将面板向底部靠齐
        if(obj.clickType === 'right'){
          top = winArea() - elemHeight - margin*2;
          if(top < 0) top = 0; // 不能溢出窗口顶部
        } else {
          top = margin; // 位置计算逻辑完备性处理
        }
      }
    }
    */

    // 定位类型
    var position = opts.position;
    if(position) elem.style.position = position;
    var offsetX = opts.offset ? opts.offset[0] : 0;
    var offsetY = opts.offset ? opts.offset[1] : 0;

    // 设置坐标
    elem.style.left = left + (position === 'fixed' ? 0 : scrollArea(1)) + offsetX + 'px';
    elem.style.top = top + (position === 'fixed' ? 0 : scrollArea()) + offsetY + 'px';

    // 防止页面无滚动条时，又因为弹出面板而出现滚动条导致的坐标计算偏差
    if(!lay.hasScrollbar()){
      var rect1 = elem.getBoundingClientRect();
      // 如果弹出面板的溢出窗口底部，则表示将出现滚动条，此时需要重新计算坐标
      if(!opts.SYSTEM_RELOAD && (rect1.bottom + margin) > winArea()){
        opts.SYSTEM_RELOAD = true;
        setTimeout(function(){
          lay.position(target, elem, opts);
        }, 50);
      }
    }
  };

  /**
   * 获取元素上的属性配置项
   * @param {string | HTMLElement | JQuery} elem - HTML 元素
   * @param {{attr: string} | string} [opts="lay-options"] - 可配置的选项，string 类型指定属性名
   * @returns {Object.<string, any>} 返回元素上的属性配置项
   * @example
   * ```js
   * <div id="testEl" lay-options="{color:red}" lay-toc="{hot: true}"></div>
   *
   * var elem = $('#testEl')
   * lay.options(elem) // {color:red}
   * lay.options(elem[0]) // {color:red}
   * lay.options('#testEl') // {color:red}
   * lay.options('#testEl', {attr: 'lay-toc'}) // {hot: true}
   * lay.options('#testEl', 'lay-toc') // {hot: true}
   *
   * $('#testEl').attr('lay-toc') // '{hot: true}'
   * ```
   */
  lay.options = function(elem, opts){
    opts = typeof opts === 'object' ? opts : {attr: opts};

    if(elem === document$1) return {};

    var othis = lay(elem);
    var attrName = opts.attr || 'lay-options';
    var attrValue = othis.attr(attrName);

    try {
      /**
       * 请注意: 开发者在使用 lay-options="{}" 配置组件选项时，需确保属性值不来自于网页用户,
       * 即属性值必须在网页开发者自身的可控范围内，否则请勿在 HTML 标签属性中获取组件选项。
       */
      return new Function('return '+ (attrValue || '{}'))();
    } catch(ev) {
      layui.hint().error(opts.errorText || [
        attrName + '="'+ attrValue + '"',
        '\n parseerror: '+ ev
      ].join('\n'), 'error');
      return {};
    }
  };


  /**
   * 元素是否属于顶级元素（document 或 body）
   * @param {HTMLElement} elem - HTML 元素
   * @returns {boolean} 是否属于顶级元素
   * @example
   * ```js
   * lay.isTopElem(document) // true
   * ```
   */
  lay.isTopElem = function(elem){
    var topElems = [document$1, lay('body')[0]]
    ,matched = false;
    lay.each(topElems, function(index, item){
      if(item === elem){
        return matched = true
      }
    });
    return matched;
  };

  // 剪切板
  lay.clipboard = {
    /**
     * 写入文本
     * @param {Object} options - 可配置的选项
     * @param {string} options.text - 写入剪贴板的文本
     * @param {() => void} [options.done] - 写入成功/完成回调
     * @param {(err?: any) => void} [options.error] - 写入失败回调
     * @example
     * ```js
     * lay.clipboard.writeText({
     *   text: '测试文本',
     *   done: function(){ layer.msg('copied')},
     *   error: function(){ layer.msg('error')}
     * })
     * ```
     */
    writeText: function(options) {
      var text = String(options.text);

      if(navigator && 'clipboard' in navigator){
        navigator.clipboard.writeText(text)
          .then(options.done, function(){
            legacyCopy();
        });
      }else {
        legacyCopy();
      }

      function legacyCopy(){
        var elem = document$1.createElement('textarea');

        elem.value = text;
        elem.style.position = 'fixed';
        elem.style.opacity = '0';
        elem.style.top = '0px';
        elem.style.left = '0px';

        document$1.body.appendChild(elem);
        elem.select();

        try {
          document$1.execCommand('copy');
          typeof options.done === 'function' && options.done();
        } catch(err) {
          typeof options.error === 'function' && options.error(err);
        } finally {
          elem.remove ? elem.remove() : document$1.body.removeChild(elem);
        }
      }
    }
  };

  /**
   * 检测是否支持 Passive Event Listeners
   * 引用自 https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
   * @type {boolean}
   */
  lay.passiveSupported = function(){
    var passiveSupported = false;
    try {
      var opts = Object.defineProperty({}, 'passive', {
        get: function() {
          passiveSupported = true;
        }
      });
      window.addEventListener('test', null, opts);
      window.removeEventListener('test', null, opts);
    } catch (err) {}
    return passiveSupported;
  }();

  /**
   * 是否支持 touch 事件
   */
  lay.touchEventsSupported = function(){
    return 'ontouchstart' in window;
  };

  /**
   * @typedef touchSwipeState
   * @prop {{x: number,y: number}} pointerStart - 初始坐标
   * @prop {{x: number,y: number}} pointerEnd - 结束坐标
   * @prop {number} distanceX - X 轴移动距离
   * @prop {number} distanceY - Y 轴移动距离
   * @prop {'none'|'right'|'left'|'up'|'down'} direction - 滑动方向
   * @prop {Date} timeStart 开始时间
   */
  /**
   * @callback touchSwipeCallback
   * @param {TouchEvent} e 滑动事件
   * @param {touchSwipeState} state 滑动相关的状态
   */
  /**
   * 基于 touch 事件的触摸滑动
   * @param {string | HTMLElement | JQuery} elem - HTML 元素
   * @param {{onTouchStart?: touchSwipeCallback; onTouchMove?: touchSwipeCallback; onTouchEnd?: touchSwipeCallback; preventDefault?: boolean}} opts - 配置项
   */
  lay.touchSwipe = function(elem, opts){
    var options = opts;
    var targetElem = lay(elem)[0];
    var preventDefault = 'preventDefault' in options ? options.preventDefault : true;

    if(!targetElem || !lay.touchEventsSupported()) return;

    var state = {
      pointerStart: {x:0, y:0},
      pointerEnd: {x:0, y:0},
      distanceX: 0,
      distanceY: 0,
      direction:'none', // 'up','down','left','right','none
      timeStart: null
    };

    var onStart = function(e){
      if(e.touches.length !== 1) return;
      bindEvents();
      // 重置状态
      state.timeStart = Date.now();
      state.pointerStart.x = state.pointerEnd.x = e.touches[0].clientX;
      state.pointerStart.y = state.pointerEnd.y = e.touches[0].clientY;
      state.distanceX = state.distanceY = 0;
      state.direction = 'none';

      options.onTouchStart && options.onTouchStart(e, state);
    };

    var onMove = function(e){
      if(preventDefault){
        e.preventDefault();
      }
      state.pointerEnd.x = e.touches[0].clientX;
      state.pointerEnd.y = e.touches[0].clientY;
      state.distanceX = state.pointerStart.x - state.pointerEnd.x;
      state.distanceY = state.pointerStart.y - state.pointerEnd.y;
      if(Math.abs(state.distanceX) > Math.abs(state.distanceY)){
        state.direction = state.distanceX > 0 ? 'left' : 'right';
      }else {
        state.direction = state.distanceY > 0 ? 'up' : 'down';
      }
      options.onTouchMove && options.onTouchMove(e, state);
    };

    var onEnd = function(e){
      options.onTouchEnd && options.onTouchEnd(e, state);
      unbindEvents();
    };

    var bindEvents = function(){
      targetElem.addEventListener('touchmove', onMove, lay.passiveSupported ? { passive: false} : false);
      targetElem.addEventListener('touchend', onEnd);
      targetElem.addEventListener('touchcancel', onEnd);
    };

    var unbindEvents = function(){
      targetElem.removeEventListener('touchmove', onMove);
      targetElem.removeEventListener('touchend', onEnd, lay.passiveSupported ? { passive: false} : false);
      targetElem.removeEventListener('touchcancel', onEnd);
    };

    // 防止事件重复绑定
    if(targetElem.__lay_touchswipe_cb_){
      targetElem.removeEventListener('touchstart', targetElem.__lay_touchswipe_cb_);
    }
    targetElem.__lay_touchswipe_cb_ = onStart;
    targetElem.addEventListener('touchstart', onStart);
  };

  /** @type {(elem: Element|Document|Window,eventName: string,fn:EventListenerOrEventListenerObject,options: boolean | AddEventListenerOptions) => any}*/
  lay.addEvent = function(){
    if(document$1.addEventListener){
      return function(elem, eventName, fn, options){
        elem.addEventListener(eventName, fn, options);
      }
    }else {
      return function(elem, eventName, fn){
        var prefix = '_lay_on_';
        var eventsCacheName = prefix + eventName;
        var listener = function(e){
          e.target = e.srcElement;
          fn.call(elem, e);
        };
        listener._rawFn = fn;
        if(!elem[eventsCacheName]){
          elem[eventsCacheName] = [];
        }
        var include = false;
        lay.each(elem[eventsCacheName], function(_, listener){
          if(listener._rawFn === fn){
            include = true;
            return true;
          }
        });
        if(!include){
          elem[eventsCacheName].push(listener);
          elem.attachEvent('on' + eventName, listener);
        }
      }
    }
  }();

 /** @type {(elem: Element|Document|Window,eventName: string,fn:EventListenerOrEventListenerObject,options: boolean | EventListenerOptions) => any}*/
  lay.removeEvent = function(){
    if(document$1.removeEventListener){
      return function(elem, eventName, fn, options){
        elem.removeEventListener(eventName, fn, options);
      }
    }else {
      return function(elem, eventName, fn){
        var prefix = '_lay_on_';
        var eventsCacheName = prefix + eventName;
        var events = elem[eventsCacheName];
        if(layui.isArray(events)){
          var newEvents = [];
          lay.each(events, function(_, listener){
            if(listener._rawFn === fn){
              elem.detachEvent('on'+ eventName, listener);
            }else {
              newEvents.push(listener);
            }
          });
          elem[eventsCacheName] = newEvents;
        }
      }
    }
  }();

  /**
   * 绑定指定元素外部的点击事件
   * @param {HTMLElement} target - 响应事件的元素
   * @param {(e: Event) => void} handler - 事件触发时执行的函数
   * @param {object} [options] - 选项
   * @param {string} [options.event="pointerdown"] - 事件类型
   * @param {HTMLElement | Window} [options.scope=document] - 事件范围
   * @param {Array<HTMLElement | string>} [options.ignore] - 忽略触发事件的元素或选择器字符串
   * @param {boolean} [options.capture=true] - 对内部事件 listener 使用捕获阶段
   * @param {boolean} [options.detectIframe] - 是否检测 iframe
   * @returns {() => void} - 返回一个停止事件响应的函数
   */
  lay.onClickOutside = function(target, handler, options){
    options = options || {};
    var eventType = options.event || ('onpointerdown' in window ? 'pointerdown' : 'mousedown');
    var scopeTarget = options.scope || document$1;
    var ignore = options.ignore || [];
    var useCapture = 'capture' in options ? options.capture : true;
    var detectIframe = options.detectIframe;

    var listener = function(event){
      var el = target;
      var eventTarget = event.target || event.srcElement;
      var eventPath = getEventPath(event);

      if (!el || el === eventTarget || eventPath.indexOf(el) !== -1){
        return;
      }
      if(shouldIgnore(event, eventPath)){
        return;
      }

      handler(event);
    };

    function shouldIgnore(event, eventPath){
      var eventTarget = event.target || event.srcElement;
      for(var i = 0; i < ignore.length; i++){
        var target = ignore[i];
        if(typeof target === 'string'){
          var targetElements = document$1.querySelectorAll(target);
          for(var j = 0; j < targetElements.length; j++){
            var targetEl = targetElements[i];
            if(targetEl === eventTarget || eventPath.indexOf(targetEl) !== -1){
              return true;
            }
          }
        }else {
          if(target && (target === eventTarget || eventPath.indexOf(target) !== -1)){
            return true;
          }
        }
      }
    }

    function getEventPath(event){
      var path = (event.composedPath && event.composedPath()) || event.path;
      var eventTarget = event.target || event.srcElement;

      if (path !== null && path !== undefined){
        return path;
      }

      function getParents(node, memo){
        memo = memo || [];
        var parentNode = node.parentNode;

        return parentNode
          ? getParents(parentNode, memo.concat([parentNode]))
          : memo;
      }

      return [eventTarget].concat(getParents(eventTarget));
    }

    function bindEventListener(elem, eventName, handler, opts){
      elem.addEventListener
        ? elem.addEventListener(eventName, handler, opts)
        : elem.attachEvent('on' + eventName, handler);

      return function(){
        elem.removeEventListener
          ? elem.removeEventListener(eventName, handler, opts)
          : elem.detachEvent('on' + eventName, handler);
      }
    }

    var cleanup = [
      bindEventListener(
        scopeTarget, 
        eventType, 
        listener, 
        lay.passiveSupported ? { passive: true, capture: useCapture } : useCapture
      ),
      detectIframe && bindEventListener(window, 'blur', function(event){
        setTimeout(function(){
          if(document$1.activeElement && document$1.activeElement.tagName === 'IFRAME' 
            && target.contains && !target.contains(document$1.activeElement)
          ){
            handler(event);
          }
        }, 0);
      })
    ];

    return function(){
      for(var i=0; i < cleanup.length; i++){
        cleanup[i] && cleanup[i]();
      }
      cleanup = null;
    }
  };

  var hasOwnProperty = Object.prototype.hasOwnProperty;
  lay.hasOwn = function(obj, prop){
    return hasOwnProperty.call(obj, prop);
  };


  /*
   * lay 元素操作
   */


  // 追加字符
  Class$f.addStr = function(str, new_str){
    str = str.replace(/\s+/, ' ');
    new_str = new_str.replace(/\s+/, ' ').split(' ');
    lay.each(new_str, function(ii, item){
      if(!new RegExp('\\b'+ item + '\\b').test(str)){
        str = str + ' ' + item;
      }
    });
    return str.replace(/^\s|\s$/, '');
  };

  // 移除值
  Class$f.removeStr = function(str, new_str){
    str = str.replace(/\s+/, ' ');
    new_str = new_str.replace(/\s+/, ' ').split(' ');
    lay.each(new_str, function(ii, item){
      var exp = new RegExp('\\b'+ item + '\\b');
      if(exp.test(str)){
        str = str.replace(exp, '');
      }
    });
    return str.replace(/\s+/, ' ').replace(/^\s|\s$/, '');
  };

  // 查找子元素
  Class$f.fn.find = function(selector){
    var elem = [];
    var isObject = typeof selector === 'object';

    this.each(function(i, item){
      var children = isObject && item.contains(selector)
        ? selector
      : item.querySelectorAll(selector || null);

      lay.each(children, function(index, child){
        elem.push(child);
      });
    });

    return lay(elem);
  };

  // 元素遍历
  Class$f.fn.each = function(fn){
    return lay.each.call(this, this, fn);
  };

  // 添加 className
  Class$f.fn.addClass = function(className, type){
    return this.each(function(index, item){
      item.className = Class$f[type ? 'removeStr' : 'addStr'](item.className, className);
    });
  };

  // 移除 className
  Class$f.fn.removeClass = function(className){
    return this.addClass(className, true);
  };

  // 是否包含 css 类
  Class$f.fn.hasClass = function(className){
    var has = false;
    this.each(function(index, item){
      if(new RegExp('\\b'+ className +'\\b').test(item.className)){
        has = true;
      }
    });
    return has;
  };

  // 添加或获取 css style
  Class$f.fn.css = function(key, value){
    var that = this;
    var parseValue = function(v){
      return isNaN(v) ? v : (v +'px');
    };
    return (typeof key === 'string' && value === undefined) ? function(){
      if(that.length > 0) return that[0].style[key];
    }() : that.each(function(index, item){
      typeof key === 'object' ? lay.each(key, function(thisKey, thisValue){
        item.style[thisKey] = parseValue(thisValue);
      }) : item.style[key] = parseValue(value);
    });
  };

  // 添加或获取宽度
  Class$f.fn.width = function(value){
    var that = this;
    return value === undefined ? function(){
      if(that.length > 0) return that[0].offsetWidth; // 此处还需做兼容
    }() : that.each(function(index, item){
      that.css('width', value);
    });
  };

  // 添加或获取高度
  Class$f.fn.height = function(value){
    var that = this;
    return value === undefined ? function(){
      if(that.length > 0) return that[0].offsetHeight; // 此处还需做兼容
    }() : that.each(function(index, item){
      that.css('height', value);
    });
  };

  // 添加或获取属性
  Class$f.fn.attr = function(key, value){
    var that = this;
    return value === undefined ? function(){
      if(that.length > 0) return that[0].getAttribute(key);
    }() : that.each(function(index, item){
      item.setAttribute(key, value);
    });
  };

  // 移除属性
  Class$f.fn.removeAttr = function(key){
    return this.each(function(index, item){
      item.removeAttribute(key);
    });
  };

  // 设置或获取 HTML 内容
  Class$f.fn.html = function(html){
    var that = this;
    return html === undefined ? function(){
      if(that.length > 0) return that[0].innerHTML;
    }() : this.each(function(index, item){
      item.innerHTML = html;
    });
  };

  // 设置或获取值
  Class$f.fn.val = function(value){
    var that = this;
    return value === undefined ? function(){
      if(that.length > 0) return that[0].value;
    }() : this.each(function(index, item){
        item.value = value;
    });
  };

  // 追加内容
  Class$f.fn.append = function(elem){
    return this.each(function(index, item){
      typeof elem === 'object'
        ? item.appendChild(elem)
      :  item.innerHTML = item.innerHTML + elem;
    });
  };

  // 移除内容
  Class$f.fn.remove = function(elem){
    return this.each(function(index, item){
      elem ? item.removeChild(elem) : item.parentNode.removeChild(item);
    });
  };

  // 事件绑定
  Class$f.fn.on = function(eventName, fn, options){
    return this.each(function(index, item){
      lay.addEvent(item, eventName, fn, options);
    });
  };

  // 解除事件
  Class$f.fn.off = function(eventName, fn, options){
    return this.each(function(index, item){
      lay.removeEvent(item, eventName, fn, options);
    });
  };

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var jquery$1 = {exports: {}};

/*!
 * jQuery JavaScript Library v3.7.1
 * https://jquery.com/
 *
 * Copyright OpenJS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2023-08-28T13:37Z
 */

(function (module) {
	( function( global, factory ) {

		{

			// For CommonJS and CommonJS-like environments where a proper `window`
			// is present, execute the factory and get jQuery.
			// For environments that do not have a `window` with a `document`
			// (such as Node.js), expose a factory as module.exports.
			// This accentuates the need for the creation of a real `window`.
			// e.g. var jQuery = require("jquery")(window);
			// See ticket trac-14549 for more info.
			module.exports = global.document ?
				factory( global, true ) :
				function( w ) {
					if ( !w.document ) {
						throw new Error( "jQuery requires a window with a document" );
					}
					return factory( w );
				};
		}

	// Pass this if window is not defined yet
	} )( typeof window !== "undefined" ? window : commonjsGlobal, function( window, noGlobal ) {

	var arr = [];

	var getProto = Object.getPrototypeOf;

	var slice = arr.slice;

	var flat = arr.flat ? function( array ) {
		return arr.flat.call( array );
	} : function( array ) {
		return arr.concat.apply( [], array );
	};


	var push = arr.push;

	var indexOf = arr.indexOf;

	var class2type = {};

	var toString = class2type.toString;

	var hasOwn = class2type.hasOwnProperty;

	var fnToString = hasOwn.toString;

	var ObjectFunctionString = fnToString.call( Object );

	var support = {};

	var isFunction = function isFunction( obj ) {

			// Support: Chrome <=57, Firefox <=52
			// In some browsers, typeof returns "function" for HTML <object> elements
			// (i.e., `typeof document.createElement( "object" ) === "function"`).
			// We don't want to classify *any* DOM node as a function.
			// Support: QtWeb <=3.8.5, WebKit <=534.34, wkhtmltopdf tool <=0.12.5
			// Plus for old WebKit, typeof returns "function" for HTML collections
			// (e.g., `typeof document.getElementsByTagName("div") === "function"`). (gh-4756)
			return typeof obj === "function" && typeof obj.nodeType !== "number" &&
				typeof obj.item !== "function";
		};


	var isWindow = function isWindow( obj ) {
			return obj != null && obj === obj.window;
		};


	var document = window.document;



		var preservedScriptAttributes = {
			type: true,
			src: true,
			nonce: true,
			noModule: true
		};

		function DOMEval( code, node, doc ) {
			doc = doc || document;

			var i, val,
				script = doc.createElement( "script" );

			script.text = code;
			if ( node ) {
				for ( i in preservedScriptAttributes ) {

					// Support: Firefox 64+, Edge 18+
					// Some browsers don't support the "nonce" property on scripts.
					// On the other hand, just using `getAttribute` is not enough as
					// the `nonce` attribute is reset to an empty string whenever it
					// becomes browsing-context connected.
					// See https://github.com/whatwg/html/issues/2369
					// See https://html.spec.whatwg.org/#nonce-attributes
					// The `node.getAttribute` check was added for the sake of
					// `jQuery.globalEval` so that it can fake a nonce-containing node
					// via an object.
					val = node[ i ] || node.getAttribute && node.getAttribute( i );
					if ( val ) {
						script.setAttribute( i, val );
					}
				}
			}
			doc.head.appendChild( script ).parentNode.removeChild( script );
		}


	function toType( obj ) {
		if ( obj == null ) {
			return obj + "";
		}

		// Support: Android <=2.3 only (functionish RegExp)
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ toString.call( obj ) ] || "object" :
			typeof obj;
	}
	/* global Symbol */
	// Defining this global in .eslintrc.json would create a danger of using the global
	// unguarded in another place, it seems safer to define global only for this module



	var version = "3.7.1",

		rhtmlSuffix = /HTML$/i,

		// Define a local copy of jQuery
		jQuery = function( selector, context ) {

			// The jQuery object is actually just the init constructor 'enhanced'
			// Need init if jQuery is called (just allow error to be thrown if not included)
			return new jQuery.fn.init( selector, context );
		};

	jQuery.fn = jQuery.prototype = {

		// The current version of jQuery being used
		jquery: version,

		constructor: jQuery,

		// The default length of a jQuery object is 0
		length: 0,

		toArray: function() {
			return slice.call( this );
		},

		// Get the Nth element in the matched element set OR
		// Get the whole matched element set as a clean array
		get: function( num ) {

			// Return all the elements in a clean array
			if ( num == null ) {
				return slice.call( this );
			}

			// Return just the one element from the set
			return num < 0 ? this[ num + this.length ] : this[ num ];
		},

		// Take an array of elements and push it onto the stack
		// (returning the new matched element set)
		pushStack: function( elems ) {

			// Build a new jQuery matched element set
			var ret = jQuery.merge( this.constructor(), elems );

			// Add the old object onto the stack (as a reference)
			ret.prevObject = this;

			// Return the newly-formed element set
			return ret;
		},

		// Execute a callback for every element in the matched set.
		each: function( callback ) {
			return jQuery.each( this, callback );
		},

		map: function( callback ) {
			return this.pushStack( jQuery.map( this, function( elem, i ) {
				return callback.call( elem, i, elem );
			} ) );
		},

		slice: function() {
			return this.pushStack( slice.apply( this, arguments ) );
		},

		first: function() {
			return this.eq( 0 );
		},

		last: function() {
			return this.eq( -1 );
		},

		even: function() {
			return this.pushStack( jQuery.grep( this, function( _elem, i ) {
				return ( i + 1 ) % 2;
			} ) );
		},

		odd: function() {
			return this.pushStack( jQuery.grep( this, function( _elem, i ) {
				return i % 2;
			} ) );
		},

		eq: function( i ) {
			var len = this.length,
				j = +i + ( i < 0 ? len : 0 );
			return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
		},

		end: function() {
			return this.prevObject || this.constructor();
		},

		// For internal use only.
		// Behaves like an Array's method, not like a jQuery method.
		push: push,
		sort: arr.sort,
		splice: arr.splice
	};

	jQuery.extend = jQuery.fn.extend = function() {
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[ 0 ] || {},
			i = 1,
			length = arguments.length,
			deep = false;

		// Handle a deep copy situation
		if ( typeof target === "boolean" ) {
			deep = target;

			// Skip the boolean and the target
			target = arguments[ i ] || {};
			i++;
		}

		// Handle case when target is a string or something (possible in deep copy)
		if ( typeof target !== "object" && !isFunction( target ) ) {
			target = {};
		}

		// Extend jQuery itself if only one argument is passed
		if ( i === length ) {
			target = this;
			i--;
		}

		for ( ; i < length; i++ ) {

			// Only deal with non-null/undefined values
			if ( ( options = arguments[ i ] ) != null ) {

				// Extend the base object
				for ( name in options ) {
					copy = options[ name ];

					// Prevent Object.prototype pollution
					// Prevent never-ending loop
					if ( name === "__proto__" || target === copy ) {
						continue;
					}

					// Recurse if we're merging plain objects or arrays
					if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
						( copyIsArray = Array.isArray( copy ) ) ) ) {
						src = target[ name ];

						// Ensure proper type for the source value
						if ( copyIsArray && !Array.isArray( src ) ) {
							clone = [];
						} else if ( !copyIsArray && !jQuery.isPlainObject( src ) ) {
							clone = {};
						} else {
							clone = src;
						}
						copyIsArray = false;

						// Never move original objects, clone them
						target[ name ] = jQuery.extend( deep, clone, copy );

					// Don't bring in undefined values
					} else if ( copy !== undefined ) {
						target[ name ] = copy;
					}
				}
			}
		}

		// Return the modified object
		return target;
	};

	jQuery.extend( {

		// Unique for each copy of jQuery on the page
		expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

		// Assume jQuery is ready without the ready module
		isReady: true,

		error: function( msg ) {
			throw new Error( msg );
		},

		noop: function() {},

		isPlainObject: function( obj ) {
			var proto, Ctor;

			// Detect obvious negatives
			// Use toString instead of jQuery.type to catch host objects
			if ( !obj || toString.call( obj ) !== "[object Object]" ) {
				return false;
			}

			proto = getProto( obj );

			// Objects with no prototype (e.g., `Object.create( null )`) are plain
			if ( !proto ) {
				return true;
			}

			// Objects with prototype are plain iff they were constructed by a global Object function
			Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
			return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
		},

		isEmptyObject: function( obj ) {
			var name;

			for ( name in obj ) {
				return false;
			}
			return true;
		},

		// Evaluates a script in a provided context; falls back to the global one
		// if not specified.
		globalEval: function( code, options, doc ) {
			DOMEval( code, { nonce: options && options.nonce }, doc );
		},

		each: function( obj, callback ) {
			var length, i = 0;

			if ( isArrayLike( obj ) ) {
				length = obj.length;
				for ( ; i < length; i++ ) {
					if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
						break;
					}
				}
			}

			return obj;
		},


		// Retrieve the text value of an array of DOM nodes
		text: function( elem ) {
			var node,
				ret = "",
				i = 0,
				nodeType = elem.nodeType;

			if ( !nodeType ) {

				// If no nodeType, this is expected to be an array
				while ( ( node = elem[ i++ ] ) ) {

					// Do not traverse comment nodes
					ret += jQuery.text( node );
				}
			}
			if ( nodeType === 1 || nodeType === 11 ) {
				return elem.textContent;
			}
			if ( nodeType === 9 ) {
				return elem.documentElement.textContent;
			}
			if ( nodeType === 3 || nodeType === 4 ) {
				return elem.nodeValue;
			}

			// Do not include comment or processing instruction nodes

			return ret;
		},

		// results is for internal usage only
		makeArray: function( arr, results ) {
			var ret = results || [];

			if ( arr != null ) {
				if ( isArrayLike( Object( arr ) ) ) {
					jQuery.merge( ret,
						typeof arr === "string" ?
							[ arr ] : arr
					);
				} else {
					push.call( ret, arr );
				}
			}

			return ret;
		},

		inArray: function( elem, arr, i ) {
			return arr == null ? -1 : indexOf.call( arr, elem, i );
		},

		isXMLDoc: function( elem ) {
			var namespace = elem && elem.namespaceURI,
				docElem = elem && ( elem.ownerDocument || elem ).documentElement;

			// Assume HTML when documentElement doesn't yet exist, such as inside
			// document fragments.
			return !rhtmlSuffix.test( namespace || docElem && docElem.nodeName || "HTML" );
		},

		// Support: Android <=4.0 only, PhantomJS 1 only
		// push.apply(_, arraylike) throws on ancient WebKit
		merge: function( first, second ) {
			var len = +second.length,
				j = 0,
				i = first.length;

			for ( ; j < len; j++ ) {
				first[ i++ ] = second[ j ];
			}

			first.length = i;

			return first;
		},

		grep: function( elems, callback, invert ) {
			var callbackInverse,
				matches = [],
				i = 0,
				length = elems.length,
				callbackExpect = !invert;

			// Go through the array, only saving the items
			// that pass the validator function
			for ( ; i < length; i++ ) {
				callbackInverse = !callback( elems[ i ], i );
				if ( callbackInverse !== callbackExpect ) {
					matches.push( elems[ i ] );
				}
			}

			return matches;
		},

		// arg is for internal usage only
		map: function( elems, callback, arg ) {
			var length, value,
				i = 0,
				ret = [];

			// Go through the array, translating each of the items to their new values
			if ( isArrayLike( elems ) ) {
				length = elems.length;
				for ( ; i < length; i++ ) {
					value = callback( elems[ i ], i, arg );

					if ( value != null ) {
						ret.push( value );
					}
				}

			// Go through every key on the object,
			} else {
				for ( i in elems ) {
					value = callback( elems[ i ], i, arg );

					if ( value != null ) {
						ret.push( value );
					}
				}
			}

			// Flatten any nested arrays
			return flat( ret );
		},

		// A global GUID counter for objects
		guid: 1,

		// jQuery.support is not used in Core but other projects attach their
		// properties to it so it needs to exist.
		support: support
	} );

	if ( typeof Symbol === "function" ) {
		jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
	}

	// Populate the class2type map
	jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
		function( _i, name ) {
			class2type[ "[object " + name + "]" ] = name.toLowerCase();
		} );

	function isArrayLike( obj ) {

		// Support: real iOS 8.2 only (not reproducible in simulator)
		// `in` check used to prevent JIT error (gh-2145)
		// hasOwn isn't used here due to false negatives
		// regarding Nodelist length in IE
		var length = !!obj && "length" in obj && obj.length,
			type = toType( obj );

		if ( isFunction( obj ) || isWindow( obj ) ) {
			return false;
		}

		return type === "array" || length === 0 ||
			typeof length === "number" && length > 0 && ( length - 1 ) in obj;
	}


	function nodeName( elem, name ) {

		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();

	}
	var pop = arr.pop;


	var sort = arr.sort;


	var splice = arr.splice;


	var whitespace = "[\\x20\\t\\r\\n\\f]";


	var rtrimCSS = new RegExp(
		"^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$",
		"g"
	);




	// Note: an element does not contain itself
	jQuery.contains = function( a, b ) {
		var bup = b && b.parentNode;

		return a === bup || !!( bup && bup.nodeType === 1 && (

			// Support: IE 9 - 11+
			// IE doesn't have `contains` on SVG.
			a.contains ?
				a.contains( bup ) :
				a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
		) );
	};




	// CSS string/identifier serialization
	// https://drafts.csswg.org/cssom/#common-serializing-idioms
	var rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g;

	function fcssescape( ch, asCodePoint ) {
		if ( asCodePoint ) {

			// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
			if ( ch === "\0" ) {
				return "\uFFFD";
			}

			// Control characters and (dependent upon position) numbers get escaped as code points
			return ch.slice( 0, -1 ) + "\\" + ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
		}

		// Other potentially-special ASCII characters get backslash-escaped
		return "\\" + ch;
	}

	jQuery.escapeSelector = function( sel ) {
		return ( sel + "" ).replace( rcssescape, fcssescape );
	};




	var preferredDoc = document,
		pushNative = push;

	( function() {

	var i,
		Expr,
		outermostContext,
		sortInput,
		hasDuplicate,
		push = pushNative,

		// Local document vars
		document,
		documentElement,
		documentIsHTML,
		rbuggyQSA,
		matches,

		// Instance-specific data
		expando = jQuery.expando,
		dirruns = 0,
		done = 0,
		classCache = createCache(),
		tokenCache = createCache(),
		compilerCache = createCache(),
		nonnativeSelectorCache = createCache(),
		sortOrder = function( a, b ) {
			if ( a === b ) {
				hasDuplicate = true;
			}
			return 0;
		},

		booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|" +
			"loop|multiple|open|readonly|required|scoped",

		// Regular expressions

		// https://www.w3.org/TR/css-syntax-3/#ident-token-diagram
		identifier = "(?:\\\\[\\da-fA-F]{1,6}" + whitespace +
			"?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+",

		// Attribute selectors: https://www.w3.org/TR/selectors/#attribute-selectors
		attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +

			// Operator (capture 2)
			"*([*^$|!~]?=)" + whitespace +

			// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
			"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" +
			whitespace + "*\\]",

		pseudos = ":(" + identifier + ")(?:\\((" +

			// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
			// 1. quoted (capture 3; capture 4 or capture 5)
			"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +

			// 2. simple (capture 6)
			"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +

			// 3. anything else (capture 2)
			".*" +
			")\\)|)",

		// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
		rwhitespace = new RegExp( whitespace + "+", "g" ),

		rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
		rleadingCombinator = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" +
			whitespace + "*" ),
		rdescend = new RegExp( whitespace + "|>" ),

		rpseudo = new RegExp( pseudos ),
		ridentifier = new RegExp( "^" + identifier + "$" ),

		matchExpr = {
			ID: new RegExp( "^#(" + identifier + ")" ),
			CLASS: new RegExp( "^\\.(" + identifier + ")" ),
			TAG: new RegExp( "^(" + identifier + "|[*])" ),
			ATTR: new RegExp( "^" + attributes ),
			PSEUDO: new RegExp( "^" + pseudos ),
			CHILD: new RegExp(
				"^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" +
					whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" +
					whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
			bool: new RegExp( "^(?:" + booleans + ")$", "i" ),

			// For use in libraries implementing .is()
			// We use this for POS matching in `select`
			needsContext: new RegExp( "^" + whitespace +
				"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace +
				"*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
		},

		rinputs = /^(?:input|select|textarea|button)$/i,
		rheader = /^h\d$/i,

		// Easily-parseable/retrievable ID or TAG or CLASS selectors
		rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

		rsibling = /[+~]/,

		// CSS escapes
		// https://www.w3.org/TR/CSS21/syndata.html#escaped-characters
		runescape = new RegExp( "\\\\[\\da-fA-F]{1,6}" + whitespace +
			"?|\\\\([^\\r\\n\\f])", "g" ),
		funescape = function( escape, nonHex ) {
			var high = "0x" + escape.slice( 1 ) - 0x10000;

			if ( nonHex ) {

				// Strip the backslash prefix from a non-hex escape sequence
				return nonHex;
			}

			// Replace a hexadecimal escape sequence with the encoded Unicode code point
			// Support: IE <=11+
			// For values outside the Basic Multilingual Plane (BMP), manually construct a
			// surrogate pair
			return high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
		},

		// Used for iframes; see `setDocument`.
		// Support: IE 9 - 11+, Edge 12 - 18+
		// Removing the function wrapper causes a "Permission Denied"
		// error in IE/Edge.
		unloadHandler = function() {
			setDocument();
		},

		inDisabledFieldset = addCombinator(
			function( elem ) {
				return elem.disabled === true && nodeName( elem, "fieldset" );
			},
			{ dir: "parentNode", next: "legend" }
		);

	// Support: IE <=9 only
	// Accessing document.activeElement can throw unexpectedly
	// https://bugs.jquery.com/ticket/13393
	function safeActiveElement() {
		try {
			return document.activeElement;
		} catch ( err ) { }
	}

	// Optimize for push.apply( _, NodeList )
	try {
		push.apply(
			( arr = slice.call( preferredDoc.childNodes ) ),
			preferredDoc.childNodes
		);

		// Support: Android <=4.0
		// Detect silently failing push.apply
		// eslint-disable-next-line no-unused-expressions
		arr[ preferredDoc.childNodes.length ].nodeType;
	} catch ( e ) {
		push = {
			apply: function( target, els ) {
				pushNative.apply( target, slice.call( els ) );
			},
			call: function( target ) {
				pushNative.apply( target, slice.call( arguments, 1 ) );
			}
		};
	}

	function find( selector, context, results, seed ) {
		var m, i, elem, nid, match, groups, newSelector,
			newContext = context && context.ownerDocument,

			// nodeType defaults to 9, since context defaults to document
			nodeType = context ? context.nodeType : 9;

		results = results || [];

		// Return early from calls with invalid selector or context
		if ( typeof selector !== "string" || !selector ||
			nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

			return results;
		}

		// Try to shortcut find operations (as opposed to filters) in HTML documents
		if ( !seed ) {
			setDocument( context );
			context = context || document;

			if ( documentIsHTML ) {

				// If the selector is sufficiently simple, try using a "get*By*" DOM method
				// (excepting DocumentFragment context, where the methods don't exist)
				if ( nodeType !== 11 && ( match = rquickExpr.exec( selector ) ) ) {

					// ID selector
					if ( ( m = match[ 1 ] ) ) {

						// Document context
						if ( nodeType === 9 ) {
							if ( ( elem = context.getElementById( m ) ) ) {

								// Support: IE 9 only
								// getElementById can match elements by name instead of ID
								if ( elem.id === m ) {
									push.call( results, elem );
									return results;
								}
							} else {
								return results;
							}

						// Element context
						} else {

							// Support: IE 9 only
							// getElementById can match elements by name instead of ID
							if ( newContext && ( elem = newContext.getElementById( m ) ) &&
								find.contains( context, elem ) &&
								elem.id === m ) {

								push.call( results, elem );
								return results;
							}
						}

					// Type selector
					} else if ( match[ 2 ] ) {
						push.apply( results, context.getElementsByTagName( selector ) );
						return results;

					// Class selector
					} else if ( ( m = match[ 3 ] ) && context.getElementsByClassName ) {
						push.apply( results, context.getElementsByClassName( m ) );
						return results;
					}
				}

				// Take advantage of querySelectorAll
				if ( !nonnativeSelectorCache[ selector + " " ] &&
					( !rbuggyQSA || !rbuggyQSA.test( selector ) ) ) {

					newSelector = selector;
					newContext = context;

					// qSA considers elements outside a scoping root when evaluating child or
					// descendant combinators, which is not what we want.
					// In such cases, we work around the behavior by prefixing every selector in the
					// list with an ID selector referencing the scope context.
					// The technique has to be used as well when a leading combinator is used
					// as such selectors are not recognized by querySelectorAll.
					// Thanks to Andrew Dupont for this technique.
					if ( nodeType === 1 &&
						( rdescend.test( selector ) || rleadingCombinator.test( selector ) ) ) {

						// Expand context for sibling selectors
						newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
							context;

						// We can use :scope instead of the ID hack if the browser
						// supports it & if we're not changing the context.
						// Support: IE 11+, Edge 17 - 18+
						// IE/Edge sometimes throw a "Permission denied" error when
						// strict-comparing two documents; shallow comparisons work.
						// eslint-disable-next-line eqeqeq
						if ( newContext != context || !support.scope ) {

							// Capture the context ID, setting it first if necessary
							if ( ( nid = context.getAttribute( "id" ) ) ) {
								nid = jQuery.escapeSelector( nid );
							} else {
								context.setAttribute( "id", ( nid = expando ) );
							}
						}

						// Prefix every selector in the list
						groups = tokenize( selector );
						i = groups.length;
						while ( i-- ) {
							groups[ i ] = ( nid ? "#" + nid : ":scope" ) + " " +
								toSelector( groups[ i ] );
						}
						newSelector = groups.join( "," );
					}

					try {
						push.apply( results,
							newContext.querySelectorAll( newSelector )
						);
						return results;
					} catch ( qsaError ) {
						nonnativeSelectorCache( selector, true );
					} finally {
						if ( nid === expando ) {
							context.removeAttribute( "id" );
						}
					}
				}
			}
		}

		// All others
		return select( selector.replace( rtrimCSS, "$1" ), context, results, seed );
	}

	/**
	 * Create key-value caches of limited size
	 * @returns {function(string, object)} Returns the Object data after storing it on itself with
	 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
	 *	deleting the oldest entry
	 */
	function createCache() {
		var keys = [];

		function cache( key, value ) {

			// Use (key + " ") to avoid collision with native prototype properties
			// (see https://github.com/jquery/sizzle/issues/157)
			if ( keys.push( key + " " ) > Expr.cacheLength ) {

				// Only keep the most recent entries
				delete cache[ keys.shift() ];
			}
			return ( cache[ key + " " ] = value );
		}
		return cache;
	}

	/**
	 * Mark a function for special use by jQuery selector module
	 * @param {Function} fn The function to mark
	 */
	function markFunction( fn ) {
		fn[ expando ] = true;
		return fn;
	}

	/**
	 * Support testing using an element
	 * @param {Function} fn Passed the created element and returns a boolean result
	 */
	function assert( fn ) {
		var el = document.createElement( "fieldset" );

		try {
			return !!fn( el );
		} catch ( e ) {
			return false;
		} finally {

			// Remove from its parent by default
			if ( el.parentNode ) {
				el.parentNode.removeChild( el );
			}

			// release memory in IE
			el = null;
		}
	}

	/**
	 * Returns a function to use in pseudos for input types
	 * @param {String} type
	 */
	function createInputPseudo( type ) {
		return function( elem ) {
			return nodeName( elem, "input" ) && elem.type === type;
		};
	}

	/**
	 * Returns a function to use in pseudos for buttons
	 * @param {String} type
	 */
	function createButtonPseudo( type ) {
		return function( elem ) {
			return ( nodeName( elem, "input" ) || nodeName( elem, "button" ) ) &&
				elem.type === type;
		};
	}

	/**
	 * Returns a function to use in pseudos for :enabled/:disabled
	 * @param {Boolean} disabled true for :disabled; false for :enabled
	 */
	function createDisabledPseudo( disabled ) {

		// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
		return function( elem ) {

			// Only certain elements can match :enabled or :disabled
			// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
			// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
			if ( "form" in elem ) {

				// Check for inherited disabledness on relevant non-disabled elements:
				// * listed form-associated elements in a disabled fieldset
				//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
				//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
				// * option elements in a disabled optgroup
				//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
				// All such elements have a "form" property.
				if ( elem.parentNode && elem.disabled === false ) {

					// Option elements defer to a parent optgroup if present
					if ( "label" in elem ) {
						if ( "label" in elem.parentNode ) {
							return elem.parentNode.disabled === disabled;
						} else {
							return elem.disabled === disabled;
						}
					}

					// Support: IE 6 - 11+
					// Use the isDisabled shortcut property to check for disabled fieldset ancestors
					return elem.isDisabled === disabled ||

						// Where there is no isDisabled, check manually
						elem.isDisabled !== !disabled &&
							inDisabledFieldset( elem ) === disabled;
				}

				return elem.disabled === disabled;

			// Try to winnow out elements that can't be disabled before trusting the disabled property.
			// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
			// even exist on them, let alone have a boolean value.
			} else if ( "label" in elem ) {
				return elem.disabled === disabled;
			}

			// Remaining elements are neither :enabled nor :disabled
			return false;
		};
	}

	/**
	 * Returns a function to use in pseudos for positionals
	 * @param {Function} fn
	 */
	function createPositionalPseudo( fn ) {
		return markFunction( function( argument ) {
			argument = +argument;
			return markFunction( function( seed, matches ) {
				var j,
					matchIndexes = fn( [], seed.length, argument ),
					i = matchIndexes.length;

				// Match elements found at the specified indexes
				while ( i-- ) {
					if ( seed[ ( j = matchIndexes[ i ] ) ] ) {
						seed[ j ] = !( matches[ j ] = seed[ j ] );
					}
				}
			} );
		} );
	}

	/**
	 * Checks a node for validity as a jQuery selector context
	 * @param {Element|Object=} context
	 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
	 */
	function testContext( context ) {
		return context && typeof context.getElementsByTagName !== "undefined" && context;
	}

	/**
	 * Sets document-related variables once based on the current document
	 * @param {Element|Object} [node] An element or document object to use to set the document
	 * @returns {Object} Returns the current document
	 */
	function setDocument( node ) {
		var subWindow,
			doc = node ? node.ownerDocument || node : preferredDoc;

		// Return early if doc is invalid or already selected
		// Support: IE 11+, Edge 17 - 18+
		// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
		// two documents; shallow comparisons work.
		// eslint-disable-next-line eqeqeq
		if ( doc == document || doc.nodeType !== 9 || !doc.documentElement ) {
			return document;
		}

		// Update global variables
		document = doc;
		documentElement = document.documentElement;
		documentIsHTML = !jQuery.isXMLDoc( document );

		// Support: iOS 7 only, IE 9 - 11+
		// Older browsers didn't support unprefixed `matches`.
		matches = documentElement.matches ||
			documentElement.webkitMatchesSelector ||
			documentElement.msMatchesSelector;

		// Support: IE 9 - 11+, Edge 12 - 18+
		// Accessing iframe documents after unload throws "permission denied" errors
		// (see trac-13936).
		// Limit the fix to IE & Edge Legacy; despite Edge 15+ implementing `matches`,
		// all IE 9+ and Edge Legacy versions implement `msMatchesSelector` as well.
		if ( documentElement.msMatchesSelector &&

			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			// eslint-disable-next-line eqeqeq
			preferredDoc != document &&
			( subWindow = document.defaultView ) && subWindow.top !== subWindow ) {

			// Support: IE 9 - 11+, Edge 12 - 18+
			subWindow.addEventListener( "unload", unloadHandler );
		}

		// Support: IE <10
		// Check if getElementById returns elements by name
		// The broken getElementById methods don't pick up programmatically-set names,
		// so use a roundabout getElementsByName test
		support.getById = assert( function( el ) {
			documentElement.appendChild( el ).id = jQuery.expando;
			return !document.getElementsByName ||
				!document.getElementsByName( jQuery.expando ).length;
		} );

		// Support: IE 9 only
		// Check to see if it's possible to do matchesSelector
		// on a disconnected node.
		support.disconnectedMatch = assert( function( el ) {
			return matches.call( el, "*" );
		} );

		// Support: IE 9 - 11+, Edge 12 - 18+
		// IE/Edge don't support the :scope pseudo-class.
		support.scope = assert( function() {
			return document.querySelectorAll( ":scope" );
		} );

		// Support: Chrome 105 - 111 only, Safari 15.4 - 16.3 only
		// Make sure the `:has()` argument is parsed unforgivingly.
		// We include `*` in the test to detect buggy implementations that are
		// _selectively_ forgiving (specifically when the list includes at least
		// one valid selector).
		// Note that we treat complete lack of support for `:has()` as if it were
		// spec-compliant support, which is fine because use of `:has()` in such
		// environments will fail in the qSA path and fall back to jQuery traversal
		// anyway.
		support.cssHas = assert( function() {
			try {
				document.querySelector( ":has(*,:jqfake)" );
				return false;
			} catch ( e ) {
				return true;
			}
		} );

		// ID filter and find
		if ( support.getById ) {
			Expr.filter.ID = function( id ) {
				var attrId = id.replace( runescape, funescape );
				return function( elem ) {
					return elem.getAttribute( "id" ) === attrId;
				};
			};
			Expr.find.ID = function( id, context ) {
				if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
					var elem = context.getElementById( id );
					return elem ? [ elem ] : [];
				}
			};
		} else {
			Expr.filter.ID =  function( id ) {
				var attrId = id.replace( runescape, funescape );
				return function( elem ) {
					var node = typeof elem.getAttributeNode !== "undefined" &&
						elem.getAttributeNode( "id" );
					return node && node.value === attrId;
				};
			};

			// Support: IE 6 - 7 only
			// getElementById is not reliable as a find shortcut
			Expr.find.ID = function( id, context ) {
				if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
					var node, i, elems,
						elem = context.getElementById( id );

					if ( elem ) {

						// Verify the id attribute
						node = elem.getAttributeNode( "id" );
						if ( node && node.value === id ) {
							return [ elem ];
						}

						// Fall back on getElementsByName
						elems = context.getElementsByName( id );
						i = 0;
						while ( ( elem = elems[ i++ ] ) ) {
							node = elem.getAttributeNode( "id" );
							if ( node && node.value === id ) {
								return [ elem ];
							}
						}
					}

					return [];
				}
			};
		}

		// Tag
		Expr.find.TAG = function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else {
				return context.querySelectorAll( tag );
			}
		};

		// Class
		Expr.find.CLASS = function( className, context ) {
			if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
				return context.getElementsByClassName( className );
			}
		};

		/* QSA/matchesSelector
		---------------------------------------------------------------------- */

		// QSA and matchesSelector support

		rbuggyQSA = [];

		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert( function( el ) {

			var input;

			documentElement.appendChild( el ).innerHTML =
				"<a id='" + expando + "' href='' disabled='disabled'></a>" +
				"<select id='" + expando + "-\r\\' disabled='disabled'>" +
				"<option selected=''></option></select>";

			// Support: iOS <=7 - 8 only
			// Boolean attributes and "value" are not treated correctly in some XML documents
			if ( !el.querySelectorAll( "[selected]" ).length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: iOS <=7 - 8 only
			if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push( "~=" );
			}

			// Support: iOS 8 only
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibling-combinator selector` fails
			if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push( ".#.+[+~]" );
			}

			// Support: Chrome <=105+, Firefox <=104+, Safari <=15.4+
			// In some of the document kinds, these selectors wouldn't work natively.
			// This is probably OK but for backwards compatibility we want to maintain
			// handling them through jQuery traversal in jQuery 3.x.
			if ( !el.querySelectorAll( ":checked" ).length ) {
				rbuggyQSA.push( ":checked" );
			}

			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			input = document.createElement( "input" );
			input.setAttribute( "type", "hidden" );
			el.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE 9 - 11+
			// IE's :disabled selector does not pick up the children of disabled fieldsets
			// Support: Chrome <=105+, Firefox <=104+, Safari <=15.4+
			// In some of the document kinds, these selectors wouldn't work natively.
			// This is probably OK but for backwards compatibility we want to maintain
			// handling them through jQuery traversal in jQuery 3.x.
			documentElement.appendChild( el ).disabled = true;
			if ( el.querySelectorAll( ":disabled" ).length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: IE 11+, Edge 15 - 18+
			// IE 11/Edge don't find elements on a `[name='']` query in some cases.
			// Adding a temporary attribute to the document before the selection works
			// around the issue.
			// Interestingly, IE 10 & older don't seem to have the issue.
			input = document.createElement( "input" );
			input.setAttribute( "name", "" );
			el.appendChild( input );
			if ( !el.querySelectorAll( "[name='']" ).length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*name" + whitespace + "*=" +
					whitespace + "*(?:''|\"\")" );
			}
		} );

		if ( !support.cssHas ) {

			// Support: Chrome 105 - 110+, Safari 15.4 - 16.3+
			// Our regular `try-catch` mechanism fails to detect natively-unsupported
			// pseudo-classes inside `:has()` (such as `:has(:contains("Foo"))`)
			// in browsers that parse the `:has()` argument as a forgiving selector list.
			// https://drafts.csswg.org/selectors/#relational now requires the argument
			// to be parsed unforgivingly, but browsers have not yet fully adjusted.
			rbuggyQSA.push( ":has" );
		}

		rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join( "|" ) );

		/* Sorting
		---------------------------------------------------------------------- */

		// Document order sorting
		sortOrder = function( a, b ) {

			// Flag for duplicate removal
			if ( a === b ) {
				hasDuplicate = true;
				return 0;
			}

			// Sort on method existence if only one input has compareDocumentPosition
			var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
			if ( compare ) {
				return compare;
			}

			// Calculate position if both inputs belong to the same document
			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			// eslint-disable-next-line eqeqeq
			compare = ( a.ownerDocument || a ) == ( b.ownerDocument || b ) ?
				a.compareDocumentPosition( b ) :

				// Otherwise we know they are disconnected
				1;

			// Disconnected nodes
			if ( compare & 1 ||
				( !support.sortDetached && b.compareDocumentPosition( a ) === compare ) ) {

				// Choose the first element that is related to our preferred document
				// Support: IE 11+, Edge 17 - 18+
				// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
				// two documents; shallow comparisons work.
				// eslint-disable-next-line eqeqeq
				if ( a === document || a.ownerDocument == preferredDoc &&
					find.contains( preferredDoc, a ) ) {
					return -1;
				}

				// Support: IE 11+, Edge 17 - 18+
				// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
				// two documents; shallow comparisons work.
				// eslint-disable-next-line eqeqeq
				if ( b === document || b.ownerDocument == preferredDoc &&
					find.contains( preferredDoc, b ) ) {
					return 1;
				}

				// Maintain original order
				return sortInput ?
					( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
					0;
			}

			return compare & 4 ? -1 : 1;
		};

		return document;
	}

	find.matches = function( expr, elements ) {
		return find( expr, null, null, elements );
	};

	find.matchesSelector = function( elem, expr ) {
		setDocument( elem );

		if ( documentIsHTML &&
			!nonnativeSelectorCache[ expr + " " ] &&
			( !rbuggyQSA || !rbuggyQSA.test( expr ) ) ) {

			try {
				var ret = matches.call( elem, expr );

				// IE 9's matchesSelector returns false on disconnected nodes
				if ( ret || support.disconnectedMatch ||

						// As well, disconnected nodes are said to be in a document
						// fragment in IE 9
						elem.document && elem.document.nodeType !== 11 ) {
					return ret;
				}
			} catch ( e ) {
				nonnativeSelectorCache( expr, true );
			}
		}

		return find( expr, document, null, [ elem ] ).length > 0;
	};

	find.contains = function( context, elem ) {

		// Set document vars if needed
		// Support: IE 11+, Edge 17 - 18+
		// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
		// two documents; shallow comparisons work.
		// eslint-disable-next-line eqeqeq
		if ( ( context.ownerDocument || context ) != document ) {
			setDocument( context );
		}
		return jQuery.contains( context, elem );
	};


	find.attr = function( elem, name ) {

		// Set document vars if needed
		// Support: IE 11+, Edge 17 - 18+
		// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
		// two documents; shallow comparisons work.
		// eslint-disable-next-line eqeqeq
		if ( ( elem.ownerDocument || elem ) != document ) {
			setDocument( elem );
		}

		var fn = Expr.attrHandle[ name.toLowerCase() ],

			// Don't get fooled by Object.prototype properties (see trac-13807)
			val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
				fn( elem, name, !documentIsHTML ) :
				undefined;

		if ( val !== undefined ) {
			return val;
		}

		return elem.getAttribute( name );
	};

	find.error = function( msg ) {
		throw new Error( "Syntax error, unrecognized expression: " + msg );
	};

	/**
	 * Document sorting and removing duplicates
	 * @param {ArrayLike} results
	 */
	jQuery.uniqueSort = function( results ) {
		var elem,
			duplicates = [],
			j = 0,
			i = 0;

		// Unless we *know* we can detect duplicates, assume their presence
		//
		// Support: Android <=4.0+
		// Testing for detecting duplicates is unpredictable so instead assume we can't
		// depend on duplicate detection in all browsers without a stable sort.
		hasDuplicate = !support.sortStable;
		sortInput = !support.sortStable && slice.call( results, 0 );
		sort.call( results, sortOrder );

		if ( hasDuplicate ) {
			while ( ( elem = results[ i++ ] ) ) {
				if ( elem === results[ i ] ) {
					j = duplicates.push( i );
				}
			}
			while ( j-- ) {
				splice.call( results, duplicates[ j ], 1 );
			}
		}

		// Clear input after sorting to release objects
		// See https://github.com/jquery/sizzle/pull/225
		sortInput = null;

		return results;
	};

	jQuery.fn.uniqueSort = function() {
		return this.pushStack( jQuery.uniqueSort( slice.apply( this ) ) );
	};

	Expr = jQuery.expr = {

		// Can be adjusted by the user
		cacheLength: 50,

		createPseudo: markFunction,

		match: matchExpr,

		attrHandle: {},

		find: {},

		relative: {
			">": { dir: "parentNode", first: true },
			" ": { dir: "parentNode" },
			"+": { dir: "previousSibling", first: true },
			"~": { dir: "previousSibling" }
		},

		preFilter: {
			ATTR: function( match ) {
				match[ 1 ] = match[ 1 ].replace( runescape, funescape );

				// Move the given value to match[3] whether quoted or unquoted
				match[ 3 ] = ( match[ 3 ] || match[ 4 ] || match[ 5 ] || "" )
					.replace( runescape, funescape );

				if ( match[ 2 ] === "~=" ) {
					match[ 3 ] = " " + match[ 3 ] + " ";
				}

				return match.slice( 0, 4 );
			},

			CHILD: function( match ) {

				/* matches from matchExpr["CHILD"]
					1 type (only|nth|...)
					2 what (child|of-type)
					3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
					4 xn-component of xn+y argument ([+-]?\d*n|)
					5 sign of xn-component
					6 x of xn-component
					7 sign of y-component
					8 y of y-component
				*/
				match[ 1 ] = match[ 1 ].toLowerCase();

				if ( match[ 1 ].slice( 0, 3 ) === "nth" ) {

					// nth-* requires argument
					if ( !match[ 3 ] ) {
						find.error( match[ 0 ] );
					}

					// numeric x and y parameters for Expr.filter.CHILD
					// remember that false/true cast respectively to 0/1
					match[ 4 ] = +( match[ 4 ] ?
						match[ 5 ] + ( match[ 6 ] || 1 ) :
						2 * ( match[ 3 ] === "even" || match[ 3 ] === "odd" )
					);
					match[ 5 ] = +( ( match[ 7 ] + match[ 8 ] ) || match[ 3 ] === "odd" );

				// other types prohibit arguments
				} else if ( match[ 3 ] ) {
					find.error( match[ 0 ] );
				}

				return match;
			},

			PSEUDO: function( match ) {
				var excess,
					unquoted = !match[ 6 ] && match[ 2 ];

				if ( matchExpr.CHILD.test( match[ 0 ] ) ) {
					return null;
				}

				// Accept quoted arguments as-is
				if ( match[ 3 ] ) {
					match[ 2 ] = match[ 4 ] || match[ 5 ] || "";

				// Strip excess characters from unquoted arguments
				} else if ( unquoted && rpseudo.test( unquoted ) &&

					// Get excess from tokenize (recursively)
					( excess = tokenize( unquoted, true ) ) &&

					// advance to the next closing parenthesis
					( excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length ) ) {

					// excess is a negative index
					match[ 0 ] = match[ 0 ].slice( 0, excess );
					match[ 2 ] = unquoted.slice( 0, excess );
				}

				// Return only captures needed by the pseudo filter method (type and argument)
				return match.slice( 0, 3 );
			}
		},

		filter: {

			TAG: function( nodeNameSelector ) {
				var expectedNodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
				return nodeNameSelector === "*" ?
					function() {
						return true;
					} :
					function( elem ) {
						return nodeName( elem, expectedNodeName );
					};
			},

			CLASS: function( className ) {
				var pattern = classCache[ className + " " ];

				return pattern ||
					( pattern = new RegExp( "(^|" + whitespace + ")" + className +
						"(" + whitespace + "|$)" ) ) &&
					classCache( className, function( elem ) {
						return pattern.test(
							typeof elem.className === "string" && elem.className ||
								typeof elem.getAttribute !== "undefined" &&
									elem.getAttribute( "class" ) ||
								""
						);
					} );
			},

			ATTR: function( name, operator, check ) {
				return function( elem ) {
					var result = find.attr( elem, name );

					if ( result == null ) {
						return operator === "!=";
					}
					if ( !operator ) {
						return true;
					}

					result += "";

					if ( operator === "=" ) {
						return result === check;
					}
					if ( operator === "!=" ) {
						return result !== check;
					}
					if ( operator === "^=" ) {
						return check && result.indexOf( check ) === 0;
					}
					if ( operator === "*=" ) {
						return check && result.indexOf( check ) > -1;
					}
					if ( operator === "$=" ) {
						return check && result.slice( -check.length ) === check;
					}
					if ( operator === "~=" ) {
						return ( " " + result.replace( rwhitespace, " " ) + " " )
							.indexOf( check ) > -1;
					}
					if ( operator === "|=" ) {
						return result === check || result.slice( 0, check.length + 1 ) === check + "-";
					}

					return false;
				};
			},

			CHILD: function( type, what, _argument, first, last ) {
				var simple = type.slice( 0, 3 ) !== "nth",
					forward = type.slice( -4 ) !== "last",
					ofType = what === "of-type";

				return first === 1 && last === 0 ?

					// Shortcut for :nth-*(n)
					function( elem ) {
						return !!elem.parentNode;
					} :

					function( elem, _context, xml ) {
						var cache, outerCache, node, nodeIndex, start,
							dir = simple !== forward ? "nextSibling" : "previousSibling",
							parent = elem.parentNode,
							name = ofType && elem.nodeName.toLowerCase(),
							useCache = !xml && !ofType,
							diff = false;

						if ( parent ) {

							// :(first|last|only)-(child|of-type)
							if ( simple ) {
								while ( dir ) {
									node = elem;
									while ( ( node = node[ dir ] ) ) {
										if ( ofType ?
											nodeName( node, name ) :
											node.nodeType === 1 ) {

											return false;
										}
									}

									// Reverse direction for :only-* (if we haven't yet done so)
									start = dir = type === "only" && !start && "nextSibling";
								}
								return true;
							}

							start = [ forward ? parent.firstChild : parent.lastChild ];

							// non-xml :nth-child(...) stores cache data on `parent`
							if ( forward && useCache ) {

								// Seek `elem` from a previously-cached index
								outerCache = parent[ expando ] || ( parent[ expando ] = {} );
								cache = outerCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex && cache[ 2 ];
								node = nodeIndex && parent.childNodes[ nodeIndex ];

								while ( ( node = ++nodeIndex && node && node[ dir ] ||

									// Fallback to seeking `elem` from the start
									( diff = nodeIndex = 0 ) || start.pop() ) ) {

									// When found, cache indexes on `parent` and break
									if ( node.nodeType === 1 && ++diff && node === elem ) {
										outerCache[ type ] = [ dirruns, nodeIndex, diff ];
										break;
									}
								}

							} else {

								// Use previously-cached element index if available
								if ( useCache ) {
									outerCache = elem[ expando ] || ( elem[ expando ] = {} );
									cache = outerCache[ type ] || [];
									nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
									diff = nodeIndex;
								}

								// xml :nth-child(...)
								// or :nth-last-child(...) or :nth(-last)?-of-type(...)
								if ( diff === false ) {

									// Use the same loop as above to seek `elem` from the start
									while ( ( node = ++nodeIndex && node && node[ dir ] ||
										( diff = nodeIndex = 0 ) || start.pop() ) ) {

										if ( ( ofType ?
											nodeName( node, name ) :
											node.nodeType === 1 ) &&
											++diff ) {

											// Cache the index of each encountered element
											if ( useCache ) {
												outerCache = node[ expando ] ||
													( node[ expando ] = {} );
												outerCache[ type ] = [ dirruns, diff ];
											}

											if ( node === elem ) {
												break;
											}
										}
									}
								}
							}

							// Incorporate the offset, then check against cycle size
							diff -= last;
							return diff === first || ( diff % first === 0 && diff / first >= 0 );
						}
					};
			},

			PSEUDO: function( pseudo, argument ) {

				// pseudo-class names are case-insensitive
				// https://www.w3.org/TR/selectors/#pseudo-classes
				// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
				// Remember that setFilters inherits from pseudos
				var args,
					fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
						find.error( "unsupported pseudo: " + pseudo );

				// The user may use createPseudo to indicate that
				// arguments are needed to create the filter function
				// just as jQuery does
				if ( fn[ expando ] ) {
					return fn( argument );
				}

				// But maintain support for old signatures
				if ( fn.length > 1 ) {
					args = [ pseudo, pseudo, "", argument ];
					return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
						markFunction( function( seed, matches ) {
							var idx,
								matched = fn( seed, argument ),
								i = matched.length;
							while ( i-- ) {
								idx = indexOf.call( seed, matched[ i ] );
								seed[ idx ] = !( matches[ idx ] = matched[ i ] );
							}
						} ) :
						function( elem ) {
							return fn( elem, 0, args );
						};
				}

				return fn;
			}
		},

		pseudos: {

			// Potentially complex pseudos
			not: markFunction( function( selector ) {

				// Trim the selector passed to compile
				// to avoid treating leading and trailing
				// spaces as combinators
				var input = [],
					results = [],
					matcher = compile( selector.replace( rtrimCSS, "$1" ) );

				return matcher[ expando ] ?
					markFunction( function( seed, matches, _context, xml ) {
						var elem,
							unmatched = matcher( seed, null, xml, [] ),
							i = seed.length;

						// Match elements unmatched by `matcher`
						while ( i-- ) {
							if ( ( elem = unmatched[ i ] ) ) {
								seed[ i ] = !( matches[ i ] = elem );
							}
						}
					} ) :
					function( elem, _context, xml ) {
						input[ 0 ] = elem;
						matcher( input, null, xml, results );

						// Don't keep the element
						// (see https://github.com/jquery/sizzle/issues/299)
						input[ 0 ] = null;
						return !results.pop();
					};
			} ),

			has: markFunction( function( selector ) {
				return function( elem ) {
					return find( selector, elem ).length > 0;
				};
			} ),

			contains: markFunction( function( text ) {
				text = text.replace( runescape, funescape );
				return function( elem ) {
					return ( elem.textContent || jQuery.text( elem ) ).indexOf( text ) > -1;
				};
			} ),

			// "Whether an element is represented by a :lang() selector
			// is based solely on the element's language value
			// being equal to the identifier C,
			// or beginning with the identifier C immediately followed by "-".
			// The matching of C against the element's language value is performed case-insensitively.
			// The identifier C does not have to be a valid language name."
			// https://www.w3.org/TR/selectors/#lang-pseudo
			lang: markFunction( function( lang ) {

				// lang value must be a valid identifier
				if ( !ridentifier.test( lang || "" ) ) {
					find.error( "unsupported lang: " + lang );
				}
				lang = lang.replace( runescape, funescape ).toLowerCase();
				return function( elem ) {
					var elemLang;
					do {
						if ( ( elemLang = documentIsHTML ?
							elem.lang :
							elem.getAttribute( "xml:lang" ) || elem.getAttribute( "lang" ) ) ) {

							elemLang = elemLang.toLowerCase();
							return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
						}
					} while ( ( elem = elem.parentNode ) && elem.nodeType === 1 );
					return false;
				};
			} ),

			// Miscellaneous
			target: function( elem ) {
				var hash = window.location && window.location.hash;
				return hash && hash.slice( 1 ) === elem.id;
			},

			root: function( elem ) {
				return elem === documentElement;
			},

			focus: function( elem ) {
				return elem === safeActiveElement() &&
					document.hasFocus() &&
					!!( elem.type || elem.href || ~elem.tabIndex );
			},

			// Boolean properties
			enabled: createDisabledPseudo( false ),
			disabled: createDisabledPseudo( true ),

			checked: function( elem ) {

				// In CSS3, :checked should return both checked and selected elements
				// https://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
				return ( nodeName( elem, "input" ) && !!elem.checked ) ||
					( nodeName( elem, "option" ) && !!elem.selected );
			},

			selected: function( elem ) {

				// Support: IE <=11+
				// Accessing the selectedIndex property
				// forces the browser to treat the default option as
				// selected when in an optgroup.
				if ( elem.parentNode ) {
					// eslint-disable-next-line no-unused-expressions
					elem.parentNode.selectedIndex;
				}

				return elem.selected === true;
			},

			// Contents
			empty: function( elem ) {

				// https://www.w3.org/TR/selectors/#empty-pseudo
				// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
				//   but not by others (comment: 8; processing instruction: 7; etc.)
				// nodeType < 6 works because attributes (2) do not appear as children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
					if ( elem.nodeType < 6 ) {
						return false;
					}
				}
				return true;
			},

			parent: function( elem ) {
				return !Expr.pseudos.empty( elem );
			},

			// Element/input types
			header: function( elem ) {
				return rheader.test( elem.nodeName );
			},

			input: function( elem ) {
				return rinputs.test( elem.nodeName );
			},

			button: function( elem ) {
				return nodeName( elem, "input" ) && elem.type === "button" ||
					nodeName( elem, "button" );
			},

			text: function( elem ) {
				var attr;
				return nodeName( elem, "input" ) && elem.type === "text" &&

					// Support: IE <10 only
					// New HTML5 attribute values (e.g., "search") appear
					// with elem.type === "text"
					( ( attr = elem.getAttribute( "type" ) ) == null ||
						attr.toLowerCase() === "text" );
			},

			// Position-in-collection
			first: createPositionalPseudo( function() {
				return [ 0 ];
			} ),

			last: createPositionalPseudo( function( _matchIndexes, length ) {
				return [ length - 1 ];
			} ),

			eq: createPositionalPseudo( function( _matchIndexes, length, argument ) {
				return [ argument < 0 ? argument + length : argument ];
			} ),

			even: createPositionalPseudo( function( matchIndexes, length ) {
				var i = 0;
				for ( ; i < length; i += 2 ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			} ),

			odd: createPositionalPseudo( function( matchIndexes, length ) {
				var i = 1;
				for ( ; i < length; i += 2 ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			} ),

			lt: createPositionalPseudo( function( matchIndexes, length, argument ) {
				var i;

				if ( argument < 0 ) {
					i = argument + length;
				} else if ( argument > length ) {
					i = length;
				} else {
					i = argument;
				}

				for ( ; --i >= 0; ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			} ),

			gt: createPositionalPseudo( function( matchIndexes, length, argument ) {
				var i = argument < 0 ? argument + length : argument;
				for ( ; ++i < length; ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			} )
		}
	};

	Expr.pseudos.nth = Expr.pseudos.eq;

	// Add button/input type pseudos
	for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
		Expr.pseudos[ i ] = createInputPseudo( i );
	}
	for ( i in { submit: true, reset: true } ) {
		Expr.pseudos[ i ] = createButtonPseudo( i );
	}

	// Easy API for creating new setFilters
	function setFilters() {}
	setFilters.prototype = Expr.filters = Expr.pseudos;
	Expr.setFilters = new setFilters();

	function tokenize( selector, parseOnly ) {
		var matched, match, tokens, type,
			soFar, groups, preFilters,
			cached = tokenCache[ selector + " " ];

		if ( cached ) {
			return parseOnly ? 0 : cached.slice( 0 );
		}

		soFar = selector;
		groups = [];
		preFilters = Expr.preFilter;

		while ( soFar ) {

			// Comma and first run
			if ( !matched || ( match = rcomma.exec( soFar ) ) ) {
				if ( match ) {

					// Don't consume trailing commas as valid
					soFar = soFar.slice( match[ 0 ].length ) || soFar;
				}
				groups.push( ( tokens = [] ) );
			}

			matched = false;

			// Combinators
			if ( ( match = rleadingCombinator.exec( soFar ) ) ) {
				matched = match.shift();
				tokens.push( {
					value: matched,

					// Cast descendant combinators to space
					type: match[ 0 ].replace( rtrimCSS, " " )
				} );
				soFar = soFar.slice( matched.length );
			}

			// Filters
			for ( type in Expr.filter ) {
				if ( ( match = matchExpr[ type ].exec( soFar ) ) && ( !preFilters[ type ] ||
					( match = preFilters[ type ]( match ) ) ) ) {
					matched = match.shift();
					tokens.push( {
						value: matched,
						type: type,
						matches: match
					} );
					soFar = soFar.slice( matched.length );
				}
			}

			if ( !matched ) {
				break;
			}
		}

		// Return the length of the invalid excess
		// if we're just parsing
		// Otherwise, throw an error or return tokens
		if ( parseOnly ) {
			return soFar.length;
		}

		return soFar ?
			find.error( selector ) :

			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
	}

	function toSelector( tokens ) {
		var i = 0,
			len = tokens.length,
			selector = "";
		for ( ; i < len; i++ ) {
			selector += tokens[ i ].value;
		}
		return selector;
	}

	function addCombinator( matcher, combinator, base ) {
		var dir = combinator.dir,
			skip = combinator.next,
			key = skip || dir,
			checkNonElements = base && key === "parentNode",
			doneName = done++;

		return combinator.first ?

			// Check against closest ancestor/preceding element
			function( elem, context, xml ) {
				while ( ( elem = elem[ dir ] ) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						return matcher( elem, context, xml );
					}
				}
				return false;
			} :

			// Check against all ancestor/preceding elements
			function( elem, context, xml ) {
				var oldCache, outerCache,
					newCache = [ dirruns, doneName ];

				// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
				if ( xml ) {
					while ( ( elem = elem[ dir ] ) ) {
						if ( elem.nodeType === 1 || checkNonElements ) {
							if ( matcher( elem, context, xml ) ) {
								return true;
							}
						}
					}
				} else {
					while ( ( elem = elem[ dir ] ) ) {
						if ( elem.nodeType === 1 || checkNonElements ) {
							outerCache = elem[ expando ] || ( elem[ expando ] = {} );

							if ( skip && nodeName( elem, skip ) ) {
								elem = elem[ dir ] || elem;
							} else if ( ( oldCache = outerCache[ key ] ) &&
								oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

								// Assign to newCache so results back-propagate to previous elements
								return ( newCache[ 2 ] = oldCache[ 2 ] );
							} else {

								// Reuse newcache so results back-propagate to previous elements
								outerCache[ key ] = newCache;

								// A match means we're done; a fail means we have to keep checking
								if ( ( newCache[ 2 ] = matcher( elem, context, xml ) ) ) {
									return true;
								}
							}
						}
					}
				}
				return false;
			};
	}

	function elementMatcher( matchers ) {
		return matchers.length > 1 ?
			function( elem, context, xml ) {
				var i = matchers.length;
				while ( i-- ) {
					if ( !matchers[ i ]( elem, context, xml ) ) {
						return false;
					}
				}
				return true;
			} :
			matchers[ 0 ];
	}

	function multipleContexts( selector, contexts, results ) {
		var i = 0,
			len = contexts.length;
		for ( ; i < len; i++ ) {
			find( selector, contexts[ i ], results );
		}
		return results;
	}

	function condense( unmatched, map, filter, context, xml ) {
		var elem,
			newUnmatched = [],
			i = 0,
			len = unmatched.length,
			mapped = map != null;

		for ( ; i < len; i++ ) {
			if ( ( elem = unmatched[ i ] ) ) {
				if ( !filter || filter( elem, context, xml ) ) {
					newUnmatched.push( elem );
					if ( mapped ) {
						map.push( i );
					}
				}
			}
		}

		return newUnmatched;
	}

	function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
		if ( postFilter && !postFilter[ expando ] ) {
			postFilter = setMatcher( postFilter );
		}
		if ( postFinder && !postFinder[ expando ] ) {
			postFinder = setMatcher( postFinder, postSelector );
		}
		return markFunction( function( seed, results, context, xml ) {
			var temp, i, elem, matcherOut,
				preMap = [],
				postMap = [],
				preexisting = results.length,

				// Get initial elements from seed or context
				elems = seed ||
					multipleContexts( selector || "*",
						context.nodeType ? [ context ] : context, [] ),

				// Prefilter to get matcher input, preserving a map for seed-results synchronization
				matcherIn = preFilter && ( seed || !selector ) ?
					condense( elems, preMap, preFilter, context, xml ) :
					elems;

			if ( matcher ) {

				// If we have a postFinder, or filtered seed, or non-seed postFilter
				// or preexisting results,
				matcherOut = postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results;

				// Find primary matches
				matcher( matcherIn, matcherOut, context, xml );
			} else {
				matcherOut = matcherIn;
			}

			// Apply postFilter
			if ( postFilter ) {
				temp = condense( matcherOut, postMap );
				postFilter( temp, [], context, xml );

				// Un-match failing elements by moving them back to matcherIn
				i = temp.length;
				while ( i-- ) {
					if ( ( elem = temp[ i ] ) ) {
						matcherOut[ postMap[ i ] ] = !( matcherIn[ postMap[ i ] ] = elem );
					}
				}
			}

			if ( seed ) {
				if ( postFinder || preFilter ) {
					if ( postFinder ) {

						// Get the final matcherOut by condensing this intermediate into postFinder contexts
						temp = [];
						i = matcherOut.length;
						while ( i-- ) {
							if ( ( elem = matcherOut[ i ] ) ) {

								// Restore matcherIn since elem is not yet a final match
								temp.push( ( matcherIn[ i ] = elem ) );
							}
						}
						postFinder( null, ( matcherOut = [] ), temp, xml );
					}

					// Move matched elements from seed to results to keep them synchronized
					i = matcherOut.length;
					while ( i-- ) {
						if ( ( elem = matcherOut[ i ] ) &&
							( temp = postFinder ? indexOf.call( seed, elem ) : preMap[ i ] ) > -1 ) {

							seed[ temp ] = !( results[ temp ] = elem );
						}
					}
				}

			// Add elements to results, through postFinder if defined
			} else {
				matcherOut = condense(
					matcherOut === results ?
						matcherOut.splice( preexisting, matcherOut.length ) :
						matcherOut
				);
				if ( postFinder ) {
					postFinder( null, results, matcherOut, xml );
				} else {
					push.apply( results, matcherOut );
				}
			}
		} );
	}

	function matcherFromTokens( tokens ) {
		var checkContext, matcher, j,
			len = tokens.length,
			leadingRelative = Expr.relative[ tokens[ 0 ].type ],
			implicitRelative = leadingRelative || Expr.relative[ " " ],
			i = leadingRelative ? 1 : 0,

			// The foundational matcher ensures that elements are reachable from top-level context(s)
			matchContext = addCombinator( function( elem ) {
				return elem === checkContext;
			}, implicitRelative, true ),
			matchAnyContext = addCombinator( function( elem ) {
				return indexOf.call( checkContext, elem ) > -1;
			}, implicitRelative, true ),
			matchers = [ function( elem, context, xml ) {

				// Support: IE 11+, Edge 17 - 18+
				// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
				// two documents; shallow comparisons work.
				// eslint-disable-next-line eqeqeq
				var ret = ( !leadingRelative && ( xml || context != outermostContext ) ) || (
					( checkContext = context ).nodeType ?
						matchContext( elem, context, xml ) :
						matchAnyContext( elem, context, xml ) );

				// Avoid hanging onto element
				// (see https://github.com/jquery/sizzle/issues/299)
				checkContext = null;
				return ret;
			} ];

		for ( ; i < len; i++ ) {
			if ( ( matcher = Expr.relative[ tokens[ i ].type ] ) ) {
				matchers = [ addCombinator( elementMatcher( matchers ), matcher ) ];
			} else {
				matcher = Expr.filter[ tokens[ i ].type ].apply( null, tokens[ i ].matches );

				// Return special upon seeing a positional matcher
				if ( matcher[ expando ] ) {

					// Find the next relative operator (if any) for proper handling
					j = ++i;
					for ( ; j < len; j++ ) {
						if ( Expr.relative[ tokens[ j ].type ] ) {
							break;
						}
					}
					return setMatcher(
						i > 1 && elementMatcher( matchers ),
						i > 1 && toSelector(

							// If the preceding token was a descendant combinator, insert an implicit any-element `*`
							tokens.slice( 0, i - 1 )
								.concat( { value: tokens[ i - 2 ].type === " " ? "*" : "" } )
						).replace( rtrimCSS, "$1" ),
						matcher,
						i < j && matcherFromTokens( tokens.slice( i, j ) ),
						j < len && matcherFromTokens( ( tokens = tokens.slice( j ) ) ),
						j < len && toSelector( tokens )
					);
				}
				matchers.push( matcher );
			}
		}

		return elementMatcher( matchers );
	}

	function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
		var bySet = setMatchers.length > 0,
			byElement = elementMatchers.length > 0,
			superMatcher = function( seed, context, xml, results, outermost ) {
				var elem, j, matcher,
					matchedCount = 0,
					i = "0",
					unmatched = seed && [],
					setMatched = [],
					contextBackup = outermostContext,

					// We must always have either seed elements or outermost context
					elems = seed || byElement && Expr.find.TAG( "*", outermost ),

					// Use integer dirruns iff this is the outermost matcher
					dirrunsUnique = ( dirruns += contextBackup == null ? 1 : Math.random() || 0.1 ),
					len = elems.length;

				if ( outermost ) {

					// Support: IE 11+, Edge 17 - 18+
					// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
					// two documents; shallow comparisons work.
					// eslint-disable-next-line eqeqeq
					outermostContext = context == document || context || outermost;
				}

				// Add elements passing elementMatchers directly to results
				// Support: iOS <=7 - 9 only
				// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching
				// elements by id. (see trac-14142)
				for ( ; i !== len && ( elem = elems[ i ] ) != null; i++ ) {
					if ( byElement && elem ) {
						j = 0;

						// Support: IE 11+, Edge 17 - 18+
						// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
						// two documents; shallow comparisons work.
						// eslint-disable-next-line eqeqeq
						if ( !context && elem.ownerDocument != document ) {
							setDocument( elem );
							xml = !documentIsHTML;
						}
						while ( ( matcher = elementMatchers[ j++ ] ) ) {
							if ( matcher( elem, context || document, xml ) ) {
								push.call( results, elem );
								break;
							}
						}
						if ( outermost ) {
							dirruns = dirrunsUnique;
						}
					}

					// Track unmatched elements for set filters
					if ( bySet ) {

						// They will have gone through all possible matchers
						if ( ( elem = !matcher && elem ) ) {
							matchedCount--;
						}

						// Lengthen the array for every element, matched or not
						if ( seed ) {
							unmatched.push( elem );
						}
					}
				}

				// `i` is now the count of elements visited above, and adding it to `matchedCount`
				// makes the latter nonnegative.
				matchedCount += i;

				// Apply set filters to unmatched elements
				// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
				// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
				// no element matchers and no seed.
				// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
				// case, which will result in a "00" `matchedCount` that differs from `i` but is also
				// numerically zero.
				if ( bySet && i !== matchedCount ) {
					j = 0;
					while ( ( matcher = setMatchers[ j++ ] ) ) {
						matcher( unmatched, setMatched, context, xml );
					}

					if ( seed ) {

						// Reintegrate element matches to eliminate the need for sorting
						if ( matchedCount > 0 ) {
							while ( i-- ) {
								if ( !( unmatched[ i ] || setMatched[ i ] ) ) {
									setMatched[ i ] = pop.call( results );
								}
							}
						}

						// Discard index placeholder values to get only actual matches
						setMatched = condense( setMatched );
					}

					// Add matches to results
					push.apply( results, setMatched );

					// Seedless set matches succeeding multiple successful matchers stipulate sorting
					if ( outermost && !seed && setMatched.length > 0 &&
						( matchedCount + setMatchers.length ) > 1 ) {

						jQuery.uniqueSort( results );
					}
				}

				// Override manipulation of globals by nested matchers
				if ( outermost ) {
					dirruns = dirrunsUnique;
					outermostContext = contextBackup;
				}

				return unmatched;
			};

		return bySet ?
			markFunction( superMatcher ) :
			superMatcher;
	}

	function compile( selector, match /* Internal Use Only */ ) {
		var i,
			setMatchers = [],
			elementMatchers = [],
			cached = compilerCache[ selector + " " ];

		if ( !cached ) {

			// Generate a function of recursive functions that can be used to check each element
			if ( !match ) {
				match = tokenize( selector );
			}
			i = match.length;
			while ( i-- ) {
				cached = matcherFromTokens( match[ i ] );
				if ( cached[ expando ] ) {
					setMatchers.push( cached );
				} else {
					elementMatchers.push( cached );
				}
			}

			// Cache the compiled function
			cached = compilerCache( selector,
				matcherFromGroupMatchers( elementMatchers, setMatchers ) );

			// Save selector and tokenization
			cached.selector = selector;
		}
		return cached;
	}

	/**
	 * A low-level selection function that works with jQuery's compiled
	 *  selector functions
	 * @param {String|Function} selector A selector or a pre-compiled
	 *  selector function built with jQuery selector compile
	 * @param {Element} context
	 * @param {Array} [results]
	 * @param {Array} [seed] A set of elements to match against
	 */
	function select( selector, context, results, seed ) {
		var i, tokens, token, type, find,
			compiled = typeof selector === "function" && selector,
			match = !seed && tokenize( ( selector = compiled.selector || selector ) );

		results = results || [];

		// Try to minimize operations if there is only one selector in the list and no seed
		// (the latter of which guarantees us context)
		if ( match.length === 1 ) {

			// Reduce context if the leading compound selector is an ID
			tokens = match[ 0 ] = match[ 0 ].slice( 0 );
			if ( tokens.length > 2 && ( token = tokens[ 0 ] ).type === "ID" &&
					context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[ 1 ].type ] ) {

				context = ( Expr.find.ID(
					token.matches[ 0 ].replace( runescape, funescape ),
					context
				) || [] )[ 0 ];
				if ( !context ) {
					return results;

				// Precompiled matchers will still verify ancestry, so step up a level
				} else if ( compiled ) {
					context = context.parentNode;
				}

				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr.needsContext.test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[ i ];

				// Abort if we hit a combinator
				if ( Expr.relative[ ( type = token.type ) ] ) {
					break;
				}
				if ( ( find = Expr.find[ type ] ) ) {

					// Search, expanding context for leading sibling combinators
					if ( ( seed = find(
						token.matches[ 0 ].replace( runescape, funescape ),
						rsibling.test( tokens[ 0 ].type ) &&
							testContext( context.parentNode ) || context
					) ) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}

						break;
					}
				}
			}
		}

		// Compile and execute a filtering function if one is not provided
		// Provide `match` to avoid retokenization if we modified the selector above
		( compiled || compile( selector, match ) )(
			seed,
			context,
			!documentIsHTML,
			results,
			!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
		);
		return results;
	}

	// One-time assignments

	// Support: Android <=4.0 - 4.1+
	// Sort stability
	support.sortStable = expando.split( "" ).sort( sortOrder ).join( "" ) === expando;

	// Initialize against the default document
	setDocument();

	// Support: Android <=4.0 - 4.1+
	// Detached nodes confoundingly follow *each other*
	support.sortDetached = assert( function( el ) {

		// Should return 1, but returns 4 (following)
		return el.compareDocumentPosition( document.createElement( "fieldset" ) ) & 1;
	} );

	jQuery.find = find;

	// Deprecated
	jQuery.expr[ ":" ] = jQuery.expr.pseudos;
	jQuery.unique = jQuery.uniqueSort;

	// These have always been private, but they used to be documented as part of
	// Sizzle so let's maintain them for now for backwards compatibility purposes.
	find.compile = compile;
	find.select = select;
	find.setDocument = setDocument;
	find.tokenize = tokenize;

	find.escape = jQuery.escapeSelector;
	find.getText = jQuery.text;
	find.isXML = jQuery.isXMLDoc;
	find.selectors = jQuery.expr;
	find.support = jQuery.support;
	find.uniqueSort = jQuery.uniqueSort;

		/* eslint-enable */

	} )();


	var dir = function( elem, dir, until ) {
		var matched = [],
			truncate = until !== undefined;

		while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
			if ( elem.nodeType === 1 ) {
				if ( truncate && jQuery( elem ).is( until ) ) {
					break;
				}
				matched.push( elem );
			}
		}
		return matched;
	};


	var siblings = function( n, elem ) {
		var matched = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				matched.push( n );
			}
		}

		return matched;
	};


	var rneedsContext = jQuery.expr.match.needsContext;

	var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );



	// Implement the identical functionality for filter and not
	function winnow( elements, qualifier, not ) {
		if ( isFunction( qualifier ) ) {
			return jQuery.grep( elements, function( elem, i ) {
				return !!qualifier.call( elem, i, elem ) !== not;
			} );
		}

		// Single element
		if ( qualifier.nodeType ) {
			return jQuery.grep( elements, function( elem ) {
				return ( elem === qualifier ) !== not;
			} );
		}

		// Arraylike of elements (jQuery, arguments, Array)
		if ( typeof qualifier !== "string" ) {
			return jQuery.grep( elements, function( elem ) {
				return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
			} );
		}

		// Filtered directly for both simple and complex selectors
		return jQuery.filter( qualifier, elements, not );
	}

	jQuery.filter = function( expr, elems, not ) {
		var elem = elems[ 0 ];

		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		if ( elems.length === 1 && elem.nodeType === 1 ) {
			return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
		}

		return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
			return elem.nodeType === 1;
		} ) );
	};

	jQuery.fn.extend( {
		find: function( selector ) {
			var i, ret,
				len = this.length,
				self = this;

			if ( typeof selector !== "string" ) {
				return this.pushStack( jQuery( selector ).filter( function() {
					for ( i = 0; i < len; i++ ) {
						if ( jQuery.contains( self[ i ], this ) ) {
							return true;
						}
					}
				} ) );
			}

			ret = this.pushStack( [] );

			for ( i = 0; i < len; i++ ) {
				jQuery.find( selector, self[ i ], ret );
			}

			return len > 1 ? jQuery.uniqueSort( ret ) : ret;
		},
		filter: function( selector ) {
			return this.pushStack( winnow( this, selector || [], false ) );
		},
		not: function( selector ) {
			return this.pushStack( winnow( this, selector || [], true ) );
		},
		is: function( selector ) {
			return !!winnow(
				this,

				// If this is a positional/relative selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				typeof selector === "string" && rneedsContext.test( selector ) ?
					jQuery( selector ) :
					selector || [],
				false
			).length;
		}
	} );


	// Initialize a jQuery object


	// A central reference to the root jQuery(document)
	var rootjQuery,

		// A simple way to check for HTML strings
		// Prioritize #id over <tag> to avoid XSS via location.hash (trac-9521)
		// Strict HTML recognition (trac-11290: must start with <)
		// Shortcut simple #id case for speed
		rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

		init = jQuery.fn.init = function( selector, context, root ) {
			var match, elem;

			// HANDLE: $(""), $(null), $(undefined), $(false)
			if ( !selector ) {
				return this;
			}

			// Method init() accepts an alternate rootjQuery
			// so migrate can support jQuery.sub (gh-2101)
			root = root || rootjQuery;

			// Handle HTML strings
			if ( typeof selector === "string" ) {
				if ( selector[ 0 ] === "<" &&
					selector[ selector.length - 1 ] === ">" &&
					selector.length >= 3 ) {

					// Assume that strings that start and end with <> are HTML and skip the regex check
					match = [ null, selector, null ];

				} else {
					match = rquickExpr.exec( selector );
				}

				// Match html or make sure no context is specified for #id
				if ( match && ( match[ 1 ] || !context ) ) {

					// HANDLE: $(html) -> $(array)
					if ( match[ 1 ] ) {
						context = context instanceof jQuery ? context[ 0 ] : context;

						// Option to run scripts is true for back-compat
						// Intentionally let the error be thrown if parseHTML is not present
						jQuery.merge( this, jQuery.parseHTML(
							match[ 1 ],
							context && context.nodeType ? context.ownerDocument || context : document,
							true
						) );

						// HANDLE: $(html, props)
						if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
							for ( match in context ) {

								// Properties of context are called as methods if possible
								if ( isFunction( this[ match ] ) ) {
									this[ match ]( context[ match ] );

								// ...and otherwise set as attributes
								} else {
									this.attr( match, context[ match ] );
								}
							}
						}

						return this;

					// HANDLE: $(#id)
					} else {
						elem = document.getElementById( match[ 2 ] );

						if ( elem ) {

							// Inject the element directly into the jQuery object
							this[ 0 ] = elem;
							this.length = 1;
						}
						return this;
					}

				// HANDLE: $(expr, $(...))
				} else if ( !context || context.jquery ) {
					return ( context || root ).find( selector );

				// HANDLE: $(expr, context)
				// (which is just equivalent to: $(context).find(expr)
				} else {
					return this.constructor( context ).find( selector );
				}

			// HANDLE: $(DOMElement)
			} else if ( selector.nodeType ) {
				this[ 0 ] = selector;
				this.length = 1;
				return this;

			// HANDLE: $(function)
			// Shortcut for document ready
			} else if ( isFunction( selector ) ) {
				return root.ready !== undefined ?
					root.ready( selector ) :

					// Execute immediately if ready is not present
					selector( jQuery );
			}

			return jQuery.makeArray( selector, this );
		};

	// Give the init function the jQuery prototype for later instantiation
	init.prototype = jQuery.fn;

	// Initialize central reference
	rootjQuery = jQuery( document );


	var rparentsprev = /^(?:parents|prev(?:Until|All))/,

		// Methods guaranteed to produce a unique set when starting from a unique set
		guaranteedUnique = {
			children: true,
			contents: true,
			next: true,
			prev: true
		};

	jQuery.fn.extend( {
		has: function( target ) {
			var targets = jQuery( target, this ),
				l = targets.length;

			return this.filter( function() {
				var i = 0;
				for ( ; i < l; i++ ) {
					if ( jQuery.contains( this, targets[ i ] ) ) {
						return true;
					}
				}
			} );
		},

		closest: function( selectors, context ) {
			var cur,
				i = 0,
				l = this.length,
				matched = [],
				targets = typeof selectors !== "string" && jQuery( selectors );

			// Positional selectors never match, since there's no _selection_ context
			if ( !rneedsContext.test( selectors ) ) {
				for ( ; i < l; i++ ) {
					for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

						// Always skip document fragments
						if ( cur.nodeType < 11 && ( targets ?
							targets.index( cur ) > -1 :

							// Don't pass non-elements to jQuery#find
							cur.nodeType === 1 &&
								jQuery.find.matchesSelector( cur, selectors ) ) ) {

							matched.push( cur );
							break;
						}
					}
				}
			}

			return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
		},

		// Determine the position of an element within the set
		index: function( elem ) {

			// No argument, return index in parent
			if ( !elem ) {
				return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
			}

			// Index in selector
			if ( typeof elem === "string" ) {
				return indexOf.call( jQuery( elem ), this[ 0 ] );
			}

			// Locate the position of the desired element
			return indexOf.call( this,

				// If it receives a jQuery object, the first element is used
				elem.jquery ? elem[ 0 ] : elem
			);
		},

		add: function( selector, context ) {
			return this.pushStack(
				jQuery.uniqueSort(
					jQuery.merge( this.get(), jQuery( selector, context ) )
				)
			);
		},

		addBack: function( selector ) {
			return this.add( selector == null ?
				this.prevObject : this.prevObject.filter( selector )
			);
		}
	} );

	function sibling( cur, dir ) {
		while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
		return cur;
	}

	jQuery.each( {
		parent: function( elem ) {
			var parent = elem.parentNode;
			return parent && parent.nodeType !== 11 ? parent : null;
		},
		parents: function( elem ) {
			return dir( elem, "parentNode" );
		},
		parentsUntil: function( elem, _i, until ) {
			return dir( elem, "parentNode", until );
		},
		next: function( elem ) {
			return sibling( elem, "nextSibling" );
		},
		prev: function( elem ) {
			return sibling( elem, "previousSibling" );
		},
		nextAll: function( elem ) {
			return dir( elem, "nextSibling" );
		},
		prevAll: function( elem ) {
			return dir( elem, "previousSibling" );
		},
		nextUntil: function( elem, _i, until ) {
			return dir( elem, "nextSibling", until );
		},
		prevUntil: function( elem, _i, until ) {
			return dir( elem, "previousSibling", until );
		},
		siblings: function( elem ) {
			return siblings( ( elem.parentNode || {} ).firstChild, elem );
		},
		children: function( elem ) {
			return siblings( elem.firstChild );
		},
		contents: function( elem ) {
			if ( elem.contentDocument != null &&

				// Support: IE 11+
				// <object> elements with no `data` attribute has an object
				// `contentDocument` with a `null` prototype.
				getProto( elem.contentDocument ) ) {

				return elem.contentDocument;
			}

			// Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
			// Treat the template element as a regular one in browsers that
			// don't support it.
			if ( nodeName( elem, "template" ) ) {
				elem = elem.content || elem;
			}

			return jQuery.merge( [], elem.childNodes );
		}
	}, function( name, fn ) {
		jQuery.fn[ name ] = function( until, selector ) {
			var matched = jQuery.map( this, fn, until );

			if ( name.slice( -5 ) !== "Until" ) {
				selector = until;
			}

			if ( selector && typeof selector === "string" ) {
				matched = jQuery.filter( selector, matched );
			}

			if ( this.length > 1 ) {

				// Remove duplicates
				if ( !guaranteedUnique[ name ] ) {
					jQuery.uniqueSort( matched );
				}

				// Reverse order for parents* and prev-derivatives
				if ( rparentsprev.test( name ) ) {
					matched.reverse();
				}
			}

			return this.pushStack( matched );
		};
	} );
	var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );



	// Convert String-formatted options into Object-formatted ones
	function createOptions( options ) {
		var object = {};
		jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
			object[ flag ] = true;
		} );
		return object;
	}

	/*
	 * Create a callback list using the following parameters:
	 *
	 *	options: an optional list of space-separated options that will change how
	 *			the callback list behaves or a more traditional option object
	 *
	 * By default a callback list will act like an event callback list and can be
	 * "fired" multiple times.
	 *
	 * Possible options:
	 *
	 *	once:			will ensure the callback list can only be fired once (like a Deferred)
	 *
	 *	memory:			will keep track of previous values and will call any callback added
	 *					after the list has been fired right away with the latest "memorized"
	 *					values (like a Deferred)
	 *
	 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
	 *
	 *	stopOnFalse:	interrupt callings when a callback returns false
	 *
	 */
	jQuery.Callbacks = function( options ) {

		// Convert options from String-formatted to Object-formatted if needed
		// (we check in cache first)
		options = typeof options === "string" ?
			createOptions( options ) :
			jQuery.extend( {}, options );

		var // Flag to know if list is currently firing
			firing,

			// Last fire value for non-forgettable lists
			memory,

			// Flag to know if list was already fired
			fired,

			// Flag to prevent firing
			locked,

			// Actual callback list
			list = [],

			// Queue of execution data for repeatable lists
			queue = [],

			// Index of currently firing callback (modified by add/remove as needed)
			firingIndex = -1,

			// Fire callbacks
			fire = function() {

				// Enforce single-firing
				locked = locked || options.once;

				// Execute callbacks for all pending executions,
				// respecting firingIndex overrides and runtime changes
				fired = firing = true;
				for ( ; queue.length; firingIndex = -1 ) {
					memory = queue.shift();
					while ( ++firingIndex < list.length ) {

						// Run callback and check for early termination
						if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
							options.stopOnFalse ) {

							// Jump to end and forget the data so .add doesn't re-fire
							firingIndex = list.length;
							memory = false;
						}
					}
				}

				// Forget the data if we're done with it
				if ( !options.memory ) {
					memory = false;
				}

				firing = false;

				// Clean up if we're done firing for good
				if ( locked ) {

					// Keep an empty list if we have data for future add calls
					if ( memory ) {
						list = [];

					// Otherwise, this object is spent
					} else {
						list = "";
					}
				}
			},

			// Actual Callbacks object
			self = {

				// Add a callback or a collection of callbacks to the list
				add: function() {
					if ( list ) {

						// If we have memory from a past run, we should fire after adding
						if ( memory && !firing ) {
							firingIndex = list.length - 1;
							queue.push( memory );
						}

						( function add( args ) {
							jQuery.each( args, function( _, arg ) {
								if ( isFunction( arg ) ) {
									if ( !options.unique || !self.has( arg ) ) {
										list.push( arg );
									}
								} else if ( arg && arg.length && toType( arg ) !== "string" ) {

									// Inspect recursively
									add( arg );
								}
							} );
						} )( arguments );

						if ( memory && !firing ) {
							fire();
						}
					}
					return this;
				},

				// Remove a callback from the list
				remove: function() {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );

							// Handle firing indexes
							if ( index <= firingIndex ) {
								firingIndex--;
							}
						}
					} );
					return this;
				},

				// Check if a given callback is in the list.
				// If no argument is given, return whether or not list has callbacks attached.
				has: function( fn ) {
					return fn ?
						jQuery.inArray( fn, list ) > -1 :
						list.length > 0;
				},

				// Remove all callbacks from the list
				empty: function() {
					if ( list ) {
						list = [];
					}
					return this;
				},

				// Disable .fire and .add
				// Abort any current/pending executions
				// Clear all callbacks and values
				disable: function() {
					locked = queue = [];
					list = memory = "";
					return this;
				},
				disabled: function() {
					return !list;
				},

				// Disable .fire
				// Also disable .add unless we have memory (since it would have no effect)
				// Abort any pending executions
				lock: function() {
					locked = queue = [];
					if ( !memory && !firing ) {
						list = memory = "";
					}
					return this;
				},
				locked: function() {
					return !!locked;
				},

				// Call all callbacks with the given context and arguments
				fireWith: function( context, args ) {
					if ( !locked ) {
						args = args || [];
						args = [ context, args.slice ? args.slice() : args ];
						queue.push( args );
						if ( !firing ) {
							fire();
						}
					}
					return this;
				},

				// Call all the callbacks with the given arguments
				fire: function() {
					self.fireWith( this, arguments );
					return this;
				},

				// To know if the callbacks have already been called at least once
				fired: function() {
					return !!fired;
				}
			};

		return self;
	};


	function Identity( v ) {
		return v;
	}
	function Thrower( ex ) {
		throw ex;
	}

	function adoptValue( value, resolve, reject, noValue ) {
		var method;

		try {

			// Check for promise aspect first to privilege synchronous behavior
			if ( value && isFunction( ( method = value.promise ) ) ) {
				method.call( value ).done( resolve ).fail( reject );

			// Other thenables
			} else if ( value && isFunction( ( method = value.then ) ) ) {
				method.call( value, resolve, reject );

			// Other non-thenables
			} else {

				// Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
				// * false: [ value ].slice( 0 ) => resolve( value )
				// * true: [ value ].slice( 1 ) => resolve()
				resolve.apply( undefined, [ value ].slice( noValue ) );
			}

		// For Promises/A+, convert exceptions into rejections
		// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
		// Deferred#then to conditionally suppress rejection.
		} catch ( value ) {

			// Support: Android 4.0 only
			// Strict mode functions invoked without .call/.apply get global-object context
			reject.apply( undefined, [ value ] );
		}
	}

	jQuery.extend( {

		Deferred: function( func ) {
			var tuples = [

					// action, add listener, callbacks,
					// ... .then handlers, argument index, [final state]
					[ "notify", "progress", jQuery.Callbacks( "memory" ),
						jQuery.Callbacks( "memory" ), 2 ],
					[ "resolve", "done", jQuery.Callbacks( "once memory" ),
						jQuery.Callbacks( "once memory" ), 0, "resolved" ],
					[ "reject", "fail", jQuery.Callbacks( "once memory" ),
						jQuery.Callbacks( "once memory" ), 1, "rejected" ]
				],
				state = "pending",
				promise = {
					state: function() {
						return state;
					},
					always: function() {
						deferred.done( arguments ).fail( arguments );
						return this;
					},
					"catch": function( fn ) {
						return promise.then( null, fn );
					},

					// Keep pipe for back-compat
					pipe: function( /* fnDone, fnFail, fnProgress */ ) {
						var fns = arguments;

						return jQuery.Deferred( function( newDefer ) {
							jQuery.each( tuples, function( _i, tuple ) {

								// Map tuples (progress, done, fail) to arguments (done, fail, progress)
								var fn = isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

								// deferred.progress(function() { bind to newDefer or newDefer.notify })
								// deferred.done(function() { bind to newDefer or newDefer.resolve })
								// deferred.fail(function() { bind to newDefer or newDefer.reject })
								deferred[ tuple[ 1 ] ]( function() {
									var returned = fn && fn.apply( this, arguments );
									if ( returned && isFunction( returned.promise ) ) {
										returned.promise()
											.progress( newDefer.notify )
											.done( newDefer.resolve )
											.fail( newDefer.reject );
									} else {
										newDefer[ tuple[ 0 ] + "With" ](
											this,
											fn ? [ returned ] : arguments
										);
									}
								} );
							} );
							fns = null;
						} ).promise();
					},
					then: function( onFulfilled, onRejected, onProgress ) {
						var maxDepth = 0;
						function resolve( depth, deferred, handler, special ) {
							return function() {
								var that = this,
									args = arguments,
									mightThrow = function() {
										var returned, then;

										// Support: Promises/A+ section 2.3.3.3.3
										// https://promisesaplus.com/#point-59
										// Ignore double-resolution attempts
										if ( depth < maxDepth ) {
											return;
										}

										returned = handler.apply( that, args );

										// Support: Promises/A+ section 2.3.1
										// https://promisesaplus.com/#point-48
										if ( returned === deferred.promise() ) {
											throw new TypeError( "Thenable self-resolution" );
										}

										// Support: Promises/A+ sections 2.3.3.1, 3.5
										// https://promisesaplus.com/#point-54
										// https://promisesaplus.com/#point-75
										// Retrieve `then` only once
										then = returned &&

											// Support: Promises/A+ section 2.3.4
											// https://promisesaplus.com/#point-64
											// Only check objects and functions for thenability
											( typeof returned === "object" ||
												typeof returned === "function" ) &&
											returned.then;

										// Handle a returned thenable
										if ( isFunction( then ) ) {

											// Special processors (notify) just wait for resolution
											if ( special ) {
												then.call(
													returned,
													resolve( maxDepth, deferred, Identity, special ),
													resolve( maxDepth, deferred, Thrower, special )
												);

											// Normal processors (resolve) also hook into progress
											} else {

												// ...and disregard older resolution values
												maxDepth++;

												then.call(
													returned,
													resolve( maxDepth, deferred, Identity, special ),
													resolve( maxDepth, deferred, Thrower, special ),
													resolve( maxDepth, deferred, Identity,
														deferred.notifyWith )
												);
											}

										// Handle all other returned values
										} else {

											// Only substitute handlers pass on context
											// and multiple values (non-spec behavior)
											if ( handler !== Identity ) {
												that = undefined;
												args = [ returned ];
											}

											// Process the value(s)
											// Default process is resolve
											( special || deferred.resolveWith )( that, args );
										}
									},

									// Only normal processors (resolve) catch and reject exceptions
									process = special ?
										mightThrow :
										function() {
											try {
												mightThrow();
											} catch ( e ) {

												if ( jQuery.Deferred.exceptionHook ) {
													jQuery.Deferred.exceptionHook( e,
														process.error );
												}

												// Support: Promises/A+ section 2.3.3.3.4.1
												// https://promisesaplus.com/#point-61
												// Ignore post-resolution exceptions
												if ( depth + 1 >= maxDepth ) {

													// Only substitute handlers pass on context
													// and multiple values (non-spec behavior)
													if ( handler !== Thrower ) {
														that = undefined;
														args = [ e ];
													}

													deferred.rejectWith( that, args );
												}
											}
										};

								// Support: Promises/A+ section 2.3.3.3.1
								// https://promisesaplus.com/#point-57
								// Re-resolve promises immediately to dodge false rejection from
								// subsequent errors
								if ( depth ) {
									process();
								} else {

									// Call an optional hook to record the error, in case of exception
									// since it's otherwise lost when execution goes async
									if ( jQuery.Deferred.getErrorHook ) {
										process.error = jQuery.Deferred.getErrorHook();

									// The deprecated alias of the above. While the name suggests
									// returning the stack, not an error instance, jQuery just passes
									// it directly to `console.warn` so both will work; an instance
									// just better cooperates with source maps.
									} else if ( jQuery.Deferred.getStackHook ) {
										process.error = jQuery.Deferred.getStackHook();
									}
									window.setTimeout( process );
								}
							};
						}

						return jQuery.Deferred( function( newDefer ) {

							// progress_handlers.add( ... )
							tuples[ 0 ][ 3 ].add(
								resolve(
									0,
									newDefer,
									isFunction( onProgress ) ?
										onProgress :
										Identity,
									newDefer.notifyWith
								)
							);

							// fulfilled_handlers.add( ... )
							tuples[ 1 ][ 3 ].add(
								resolve(
									0,
									newDefer,
									isFunction( onFulfilled ) ?
										onFulfilled :
										Identity
								)
							);

							// rejected_handlers.add( ... )
							tuples[ 2 ][ 3 ].add(
								resolve(
									0,
									newDefer,
									isFunction( onRejected ) ?
										onRejected :
										Thrower
								)
							);
						} ).promise();
					},

					// Get a promise for this deferred
					// If obj is provided, the promise aspect is added to the object
					promise: function( obj ) {
						return obj != null ? jQuery.extend( obj, promise ) : promise;
					}
				},
				deferred = {};

			// Add list-specific methods
			jQuery.each( tuples, function( i, tuple ) {
				var list = tuple[ 2 ],
					stateString = tuple[ 5 ];

				// promise.progress = list.add
				// promise.done = list.add
				// promise.fail = list.add
				promise[ tuple[ 1 ] ] = list.add;

				// Handle state
				if ( stateString ) {
					list.add(
						function() {

							// state = "resolved" (i.e., fulfilled)
							// state = "rejected"
							state = stateString;
						},

						// rejected_callbacks.disable
						// fulfilled_callbacks.disable
						tuples[ 3 - i ][ 2 ].disable,

						// rejected_handlers.disable
						// fulfilled_handlers.disable
						tuples[ 3 - i ][ 3 ].disable,

						// progress_callbacks.lock
						tuples[ 0 ][ 2 ].lock,

						// progress_handlers.lock
						tuples[ 0 ][ 3 ].lock
					);
				}

				// progress_handlers.fire
				// fulfilled_handlers.fire
				// rejected_handlers.fire
				list.add( tuple[ 3 ].fire );

				// deferred.notify = function() { deferred.notifyWith(...) }
				// deferred.resolve = function() { deferred.resolveWith(...) }
				// deferred.reject = function() { deferred.rejectWith(...) }
				deferred[ tuple[ 0 ] ] = function() {
					deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
					return this;
				};

				// deferred.notifyWith = list.fireWith
				// deferred.resolveWith = list.fireWith
				// deferred.rejectWith = list.fireWith
				deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
			} );

			// Make the deferred a promise
			promise.promise( deferred );

			// Call given func if any
			if ( func ) {
				func.call( deferred, deferred );
			}

			// All done!
			return deferred;
		},

		// Deferred helper
		when: function( singleValue ) {
			var

				// count of uncompleted subordinates
				remaining = arguments.length,

				// count of unprocessed arguments
				i = remaining,

				// subordinate fulfillment data
				resolveContexts = Array( i ),
				resolveValues = slice.call( arguments ),

				// the primary Deferred
				primary = jQuery.Deferred(),

				// subordinate callback factory
				updateFunc = function( i ) {
					return function( value ) {
						resolveContexts[ i ] = this;
						resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
						if ( !( --remaining ) ) {
							primary.resolveWith( resolveContexts, resolveValues );
						}
					};
				};

			// Single- and empty arguments are adopted like Promise.resolve
			if ( remaining <= 1 ) {
				adoptValue( singleValue, primary.done( updateFunc( i ) ).resolve, primary.reject,
					!remaining );

				// Use .then() to unwrap secondary thenables (cf. gh-3000)
				if ( primary.state() === "pending" ||
					isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {

					return primary.then();
				}
			}

			// Multiple arguments are aggregated like Promise.all array elements
			while ( i-- ) {
				adoptValue( resolveValues[ i ], updateFunc( i ), primary.reject );
			}

			return primary.promise();
		}
	} );


	// These usually indicate a programmer mistake during development,
	// warn about them ASAP rather than swallowing them by default.
	var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

	// If `jQuery.Deferred.getErrorHook` is defined, `asyncError` is an error
	// captured before the async barrier to get the original error cause
	// which may otherwise be hidden.
	jQuery.Deferred.exceptionHook = function( error, asyncError ) {

		// Support: IE 8 - 9 only
		// Console exists when dev tools are open, which can happen at any time
		if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
			window.console.warn( "jQuery.Deferred exception: " + error.message,
				error.stack, asyncError );
		}
	};




	jQuery.readyException = function( error ) {
		window.setTimeout( function() {
			throw error;
		} );
	};




	// The deferred used on DOM ready
	var readyList = jQuery.Deferred();

	jQuery.fn.ready = function( fn ) {

		readyList
			.then( fn )

			// Wrap jQuery.readyException in a function so that the lookup
			// happens at the time of error handling instead of callback
			// registration.
			.catch( function( error ) {
				jQuery.readyException( error );
			} );

		return this;
	};

	jQuery.extend( {

		// Is the DOM ready to be used? Set to true once it occurs.
		isReady: false,

		// A counter to track how many items to wait for before
		// the ready event fires. See trac-6781
		readyWait: 1,

		// Handle when the DOM is ready
		ready: function( wait ) {

			// Abort if there are pending holds or we're already ready
			if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
				return;
			}

			// Remember that the DOM is ready
			jQuery.isReady = true;

			// If a normal DOM Ready event fired, decrement, and wait if need be
			if ( wait !== true && --jQuery.readyWait > 0 ) {
				return;
			}

			// If there are functions bound, to execute
			readyList.resolveWith( document, [ jQuery ] );
		}
	} );

	jQuery.ready.then = readyList.then;

	// The ready event handler and self cleanup method
	function completed() {
		document.removeEventListener( "DOMContentLoaded", completed );
		window.removeEventListener( "load", completed );
		jQuery.ready();
	}

	// Catch cases where $(document).ready() is called
	// after the browser event has already occurred.
	// Support: IE <=9 - 10 only
	// Older IE sometimes signals "interactive" too soon
	if ( document.readyState === "complete" ||
		( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

		// Handle it asynchronously to allow scripts the opportunity to delay ready
		window.setTimeout( jQuery.ready );

	} else {

		// Use the handy event callback
		document.addEventListener( "DOMContentLoaded", completed );

		// A fallback to window.onload, that will always work
		window.addEventListener( "load", completed );
	}




	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			len = elems.length,
			bulk = key == null;

		// Sets many values
		if ( toType( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				access( elems, fn, i, key[ i ], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {

				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, _key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < len; i++ ) {
					fn(
						elems[ i ], key, raw ?
							value :
							value.call( elems[ i ], i, fn( elems[ i ], key ) )
					);
				}
			}
		}

		if ( chainable ) {
			return elems;
		}

		// Gets
		if ( bulk ) {
			return fn.call( elems );
		}

		return len ? fn( elems[ 0 ], key ) : emptyGet;
	};


	// Matches dashed string for camelizing
	var rmsPrefix = /^-ms-/,
		rdashAlpha = /-([a-z])/g;

	// Used by camelCase as callback to replace()
	function fcamelCase( _all, letter ) {
		return letter.toUpperCase();
	}

	// Convert dashed to camelCase; used by the css and data modules
	// Support: IE <=9 - 11, Edge 12 - 15
	// Microsoft forgot to hump their vendor prefix (trac-9572)
	function camelCase( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	}
	var acceptData = function( owner ) {

		// Accepts only:
		//  - Node
		//    - Node.ELEMENT_NODE
		//    - Node.DOCUMENT_NODE
		//  - Object
		//    - Any
		return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
	};




	function Data() {
		this.expando = jQuery.expando + Data.uid++;
	}

	Data.uid = 1;

	Data.prototype = {

		cache: function( owner ) {

			// Check if the owner object already has a cache
			var value = owner[ this.expando ];

			// If not, create one
			if ( !value ) {
				value = {};

				// We can accept data for non-element nodes in modern browsers,
				// but we should not, see trac-8335.
				// Always return an empty object.
				if ( acceptData( owner ) ) {

					// If it is a node unlikely to be stringify-ed or looped over
					// use plain assignment
					if ( owner.nodeType ) {
						owner[ this.expando ] = value;

					// Otherwise secure it in a non-enumerable property
					// configurable must be true to allow the property to be
					// deleted when data is removed
					} else {
						Object.defineProperty( owner, this.expando, {
							value: value,
							configurable: true
						} );
					}
				}
			}

			return value;
		},
		set: function( owner, data, value ) {
			var prop,
				cache = this.cache( owner );

			// Handle: [ owner, key, value ] args
			// Always use camelCase key (gh-2257)
			if ( typeof data === "string" ) {
				cache[ camelCase( data ) ] = value;

			// Handle: [ owner, { properties } ] args
			} else {

				// Copy the properties one-by-one to the cache object
				for ( prop in data ) {
					cache[ camelCase( prop ) ] = data[ prop ];
				}
			}
			return cache;
		},
		get: function( owner, key ) {
			return key === undefined ?
				this.cache( owner ) :

				// Always use camelCase key (gh-2257)
				owner[ this.expando ] && owner[ this.expando ][ camelCase( key ) ];
		},
		access: function( owner, key, value ) {

			// In cases where either:
			//
			//   1. No key was specified
			//   2. A string key was specified, but no value provided
			//
			// Take the "read" path and allow the get method to determine
			// which value to return, respectively either:
			//
			//   1. The entire cache object
			//   2. The data stored at the key
			//
			if ( key === undefined ||
					( ( key && typeof key === "string" ) && value === undefined ) ) {

				return this.get( owner, key );
			}

			// When the key is not a string, or both a key and value
			// are specified, set or extend (existing objects) with either:
			//
			//   1. An object of properties
			//   2. A key and value
			//
			this.set( owner, key, value );

			// Since the "set" path can have two possible entry points
			// return the expected data based on which path was taken[*]
			return value !== undefined ? value : key;
		},
		remove: function( owner, key ) {
			var i,
				cache = owner[ this.expando ];

			if ( cache === undefined ) {
				return;
			}

			if ( key !== undefined ) {

				// Support array or space separated string of keys
				if ( Array.isArray( key ) ) {

					// If key is an array of keys...
					// We always set camelCase keys, so remove that.
					key = key.map( camelCase );
				} else {
					key = camelCase( key );

					// If a key with the spaces exists, use it.
					// Otherwise, create an array by matching non-whitespace
					key = key in cache ?
						[ key ] :
						( key.match( rnothtmlwhite ) || [] );
				}

				i = key.length;

				while ( i-- ) {
					delete cache[ key[ i ] ];
				}
			}

			// Remove the expando if there's no more data
			if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

				// Support: Chrome <=35 - 45
				// Webkit & Blink performance suffers when deleting properties
				// from DOM nodes, so set to undefined instead
				// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
				if ( owner.nodeType ) {
					owner[ this.expando ] = undefined;
				} else {
					delete owner[ this.expando ];
				}
			}
		},
		hasData: function( owner ) {
			var cache = owner[ this.expando ];
			return cache !== undefined && !jQuery.isEmptyObject( cache );
		}
	};
	var dataPriv = new Data();

	var dataUser = new Data();



	//	Implementation Summary
	//
	//	1. Enforce API surface and semantic compatibility with 1.9.x branch
	//	2. Improve the module's maintainability by reducing the storage
	//		paths to a single mechanism.
	//	3. Use the same single mechanism to support "private" and "user" data.
	//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
	//	5. Avoid exposing implementation details on user objects (eg. expando properties)
	//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

	var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
		rmultiDash = /[A-Z]/g;

	function getData( data ) {
		if ( data === "true" ) {
			return true;
		}

		if ( data === "false" ) {
			return false;
		}

		if ( data === "null" ) {
			return null;
		}

		// Only convert to a number if it doesn't change the string
		if ( data === +data + "" ) {
			return +data;
		}

		if ( rbrace.test( data ) ) {
			return JSON.parse( data );
		}

		return data;
	}

	function dataAttr( elem, key, data ) {
		var name;

		// If nothing was found internally, try to fetch any
		// data from the HTML5 data-* attribute
		if ( data === undefined && elem.nodeType === 1 ) {
			name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
			data = elem.getAttribute( name );

			if ( typeof data === "string" ) {
				try {
					data = getData( data );
				} catch ( e ) {}

				// Make sure we set the data so it isn't changed later
				dataUser.set( elem, key, data );
			} else {
				data = undefined;
			}
		}
		return data;
	}

	jQuery.extend( {
		hasData: function( elem ) {
			return dataUser.hasData( elem ) || dataPriv.hasData( elem );
		},

		data: function( elem, name, data ) {
			return dataUser.access( elem, name, data );
		},

		removeData: function( elem, name ) {
			dataUser.remove( elem, name );
		},

		// TODO: Now that all calls to _data and _removeData have been replaced
		// with direct calls to dataPriv methods, these can be deprecated.
		_data: function( elem, name, data ) {
			return dataPriv.access( elem, name, data );
		},

		_removeData: function( elem, name ) {
			dataPriv.remove( elem, name );
		}
	} );

	jQuery.fn.extend( {
		data: function( key, value ) {
			var i, name, data,
				elem = this[ 0 ],
				attrs = elem && elem.attributes;

			// Gets all values
			if ( key === undefined ) {
				if ( this.length ) {
					data = dataUser.get( elem );

					if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
						i = attrs.length;
						while ( i-- ) {

							// Support: IE 11 only
							// The attrs elements can be null (trac-14894)
							if ( attrs[ i ] ) {
								name = attrs[ i ].name;
								if ( name.indexOf( "data-" ) === 0 ) {
									name = camelCase( name.slice( 5 ) );
									dataAttr( elem, name, data[ name ] );
								}
							}
						}
						dataPriv.set( elem, "hasDataAttrs", true );
					}
				}

				return data;
			}

			// Sets multiple values
			if ( typeof key === "object" ) {
				return this.each( function() {
					dataUser.set( this, key );
				} );
			}

			return access( this, function( value ) {
				var data;

				// The calling jQuery object (element matches) is not empty
				// (and therefore has an element appears at this[ 0 ]) and the
				// `value` parameter was not undefined. An empty jQuery object
				// will result in `undefined` for elem = this[ 0 ] which will
				// throw an exception if an attempt to read a data cache is made.
				if ( elem && value === undefined ) {

					// Attempt to get data from the cache
					// The key will always be camelCased in Data
					data = dataUser.get( elem, key );
					if ( data !== undefined ) {
						return data;
					}

					// Attempt to "discover" the data in
					// HTML5 custom data-* attrs
					data = dataAttr( elem, key );
					if ( data !== undefined ) {
						return data;
					}

					// We tried really hard, but the data doesn't exist.
					return;
				}

				// Set the data...
				this.each( function() {

					// We always store the camelCased key
					dataUser.set( this, key, value );
				} );
			}, null, value, arguments.length > 1, null, true );
		},

		removeData: function( key ) {
			return this.each( function() {
				dataUser.remove( this, key );
			} );
		}
	} );


	jQuery.extend( {
		queue: function( elem, type, data ) {
			var queue;

			if ( elem ) {
				type = ( type || "fx" ) + "queue";
				queue = dataPriv.get( elem, type );

				// Speed up dequeue by getting out quickly if this is just a lookup
				if ( data ) {
					if ( !queue || Array.isArray( data ) ) {
						queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
					} else {
						queue.push( data );
					}
				}
				return queue || [];
			}
		},

		dequeue: function( elem, type ) {
			type = type || "fx";

			var queue = jQuery.queue( elem, type ),
				startLength = queue.length,
				fn = queue.shift(),
				hooks = jQuery._queueHooks( elem, type ),
				next = function() {
					jQuery.dequeue( elem, type );
				};

			// If the fx queue is dequeued, always remove the progress sentinel
			if ( fn === "inprogress" ) {
				fn = queue.shift();
				startLength--;
			}

			if ( fn ) {

				// Add a progress sentinel to prevent the fx queue from being
				// automatically dequeued
				if ( type === "fx" ) {
					queue.unshift( "inprogress" );
				}

				// Clear up the last queue stop function
				delete hooks.stop;
				fn.call( elem, next, hooks );
			}

			if ( !startLength && hooks ) {
				hooks.empty.fire();
			}
		},

		// Not public - generate a queueHooks object, or return the current one
		_queueHooks: function( elem, type ) {
			var key = type + "queueHooks";
			return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
				empty: jQuery.Callbacks( "once memory" ).add( function() {
					dataPriv.remove( elem, [ type + "queue", key ] );
				} )
			} );
		}
	} );

	jQuery.fn.extend( {
		queue: function( type, data ) {
			var setter = 2;

			if ( typeof type !== "string" ) {
				data = type;
				type = "fx";
				setter--;
			}

			if ( arguments.length < setter ) {
				return jQuery.queue( this[ 0 ], type );
			}

			return data === undefined ?
				this :
				this.each( function() {
					var queue = jQuery.queue( this, type, data );

					// Ensure a hooks for this queue
					jQuery._queueHooks( this, type );

					if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
						jQuery.dequeue( this, type );
					}
				} );
		},
		dequeue: function( type ) {
			return this.each( function() {
				jQuery.dequeue( this, type );
			} );
		},
		clearQueue: function( type ) {
			return this.queue( type || "fx", [] );
		},

		// Get a promise resolved when queues of a certain type
		// are emptied (fx is the type by default)
		promise: function( type, obj ) {
			var tmp,
				count = 1,
				defer = jQuery.Deferred(),
				elements = this,
				i = this.length,
				resolve = function() {
					if ( !( --count ) ) {
						defer.resolveWith( elements, [ elements ] );
					}
				};

			if ( typeof type !== "string" ) {
				obj = type;
				type = undefined;
			}
			type = type || "fx";

			while ( i-- ) {
				tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
				if ( tmp && tmp.empty ) {
					count++;
					tmp.empty.add( resolve );
				}
			}
			resolve();
			return defer.promise( obj );
		}
	} );
	var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

	var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


	var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

	var documentElement = document.documentElement;



		var isAttached = function( elem ) {
				return jQuery.contains( elem.ownerDocument, elem );
			},
			composed = { composed: true };

		// Support: IE 9 - 11+, Edge 12 - 18+, iOS 10.0 - 10.2 only
		// Check attachment across shadow DOM boundaries when possible (gh-3504)
		// Support: iOS 10.0-10.2 only
		// Early iOS 10 versions support `attachShadow` but not `getRootNode`,
		// leading to errors. We need to check for `getRootNode`.
		if ( documentElement.getRootNode ) {
			isAttached = function( elem ) {
				return jQuery.contains( elem.ownerDocument, elem ) ||
					elem.getRootNode( composed ) === elem.ownerDocument;
			};
		}
	var isHiddenWithinTree = function( elem, el ) {

			// isHiddenWithinTree might be called from jQuery#filter function;
			// in that case, element will be second argument
			elem = el || elem;

			// Inline style trumps all
			return elem.style.display === "none" ||
				elem.style.display === "" &&

				// Otherwise, check computed style
				// Support: Firefox <=43 - 45
				// Disconnected elements can have computed display: none, so first confirm that elem is
				// in the document.
				isAttached( elem ) &&

				jQuery.css( elem, "display" ) === "none";
		};



	function adjustCSS( elem, prop, valueParts, tween ) {
		var adjusted, scale,
			maxIterations = 20,
			currentValue = tween ?
				function() {
					return tween.cur();
				} :
				function() {
					return jQuery.css( elem, prop, "" );
				},
			initial = currentValue(),
			unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

			// Starting value computation is required for potential unit mismatches
			initialInUnit = elem.nodeType &&
				( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
				rcssNum.exec( jQuery.css( elem, prop ) );

		if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

			// Support: Firefox <=54
			// Halve the iteration target value to prevent interference from CSS upper bounds (gh-2144)
			initial = initial / 2;

			// Trust units reported by jQuery.css
			unit = unit || initialInUnit[ 3 ];

			// Iteratively approximate from a nonzero starting point
			initialInUnit = +initial || 1;

			while ( maxIterations-- ) {

				// Evaluate and update our best guess (doubling guesses that zero out).
				// Finish if the scale equals or crosses 1 (making the old*new product non-positive).
				jQuery.style( elem, prop, initialInUnit + unit );
				if ( ( 1 - scale ) * ( 1 - ( scale = currentValue() / initial || 0.5 ) ) <= 0 ) {
					maxIterations = 0;
				}
				initialInUnit = initialInUnit / scale;

			}

			initialInUnit = initialInUnit * 2;
			jQuery.style( elem, prop, initialInUnit + unit );

			// Make sure we update the tween properties later on
			valueParts = valueParts || [];
		}

		if ( valueParts ) {
			initialInUnit = +initialInUnit || +initial || 0;

			// Apply relative offset (+=/-=) if specified
			adjusted = valueParts[ 1 ] ?
				initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
				+valueParts[ 2 ];
			if ( tween ) {
				tween.unit = unit;
				tween.start = initialInUnit;
				tween.end = adjusted;
			}
		}
		return adjusted;
	}


	var defaultDisplayMap = {};

	function getDefaultDisplay( elem ) {
		var temp,
			doc = elem.ownerDocument,
			nodeName = elem.nodeName,
			display = defaultDisplayMap[ nodeName ];

		if ( display ) {
			return display;
		}

		temp = doc.body.appendChild( doc.createElement( nodeName ) );
		display = jQuery.css( temp, "display" );

		temp.parentNode.removeChild( temp );

		if ( display === "none" ) {
			display = "block";
		}
		defaultDisplayMap[ nodeName ] = display;

		return display;
	}

	function showHide( elements, show ) {
		var display, elem,
			values = [],
			index = 0,
			length = elements.length;

		// Determine new display value for elements that need to change
		for ( ; index < length; index++ ) {
			elem = elements[ index ];
			if ( !elem.style ) {
				continue;
			}

			display = elem.style.display;
			if ( show ) {

				// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
				// check is required in this first loop unless we have a nonempty display value (either
				// inline or about-to-be-restored)
				if ( display === "none" ) {
					values[ index ] = dataPriv.get( elem, "display" ) || null;
					if ( !values[ index ] ) {
						elem.style.display = "";
					}
				}
				if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
					values[ index ] = getDefaultDisplay( elem );
				}
			} else {
				if ( display !== "none" ) {
					values[ index ] = "none";

					// Remember what we're overwriting
					dataPriv.set( elem, "display", display );
				}
			}
		}

		// Set the display of the elements in a second loop to avoid constant reflow
		for ( index = 0; index < length; index++ ) {
			if ( values[ index ] != null ) {
				elements[ index ].style.display = values[ index ];
			}
		}

		return elements;
	}

	jQuery.fn.extend( {
		show: function() {
			return showHide( this, true );
		},
		hide: function() {
			return showHide( this );
		},
		toggle: function( state ) {
			if ( typeof state === "boolean" ) {
				return state ? this.show() : this.hide();
			}

			return this.each( function() {
				if ( isHiddenWithinTree( this ) ) {
					jQuery( this ).show();
				} else {
					jQuery( this ).hide();
				}
			} );
		}
	} );
	var rcheckableType = ( /^(?:checkbox|radio)$/i );

	var rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]*)/i );

	var rscriptType = ( /^$|^module$|\/(?:java|ecma)script/i );



	( function() {
		var fragment = document.createDocumentFragment(),
			div = fragment.appendChild( document.createElement( "div" ) ),
			input = document.createElement( "input" );

		// Support: Android 4.0 - 4.3 only
		// Check state lost if the name is set (trac-11217)
		// Support: Windows Web Apps (WWA)
		// `name` and `type` must use .setAttribute for WWA (trac-14901)
		input.setAttribute( "type", "radio" );
		input.setAttribute( "checked", "checked" );
		input.setAttribute( "name", "t" );

		div.appendChild( input );

		// Support: Android <=4.1 only
		// Older WebKit doesn't clone checked state correctly in fragments
		support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

		// Support: IE <=11 only
		// Make sure textarea (and checkbox) defaultValue is properly cloned
		div.innerHTML = "<textarea>x</textarea>";
		support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;

		// Support: IE <=9 only
		// IE <=9 replaces <option> tags with their contents when inserted outside of
		// the select element.
		div.innerHTML = "<option></option>";
		support.option = !!div.lastChild;
	} )();


	// We have to close these tags to support XHTML (trac-13200)
	var wrapMap = {

		// XHTML parsers do not magically insert elements in the
		// same way that tag soup parsers do. So we cannot shorten
		// this by omitting <tbody> or other required elements.
		thead: [ 1, "<table>", "</table>" ],
		col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		_default: [ 0, "", "" ]
	};

	wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
	wrapMap.th = wrapMap.td;

	// Support: IE <=9 only
	if ( !support.option ) {
		wrapMap.optgroup = wrapMap.option = [ 1, "<select multiple='multiple'>", "</select>" ];
	}


	function getAll( context, tag ) {

		// Support: IE <=9 - 11 only
		// Use typeof to avoid zero-argument method invocation on host objects (trac-15151)
		var ret;

		if ( typeof context.getElementsByTagName !== "undefined" ) {
			ret = context.getElementsByTagName( tag || "*" );

		} else if ( typeof context.querySelectorAll !== "undefined" ) {
			ret = context.querySelectorAll( tag || "*" );

		} else {
			ret = [];
		}

		if ( tag === undefined || tag && nodeName( context, tag ) ) {
			return jQuery.merge( [ context ], ret );
		}

		return ret;
	}


	// Mark scripts as having already been evaluated
	function setGlobalEval( elems, refElements ) {
		var i = 0,
			l = elems.length;

		for ( ; i < l; i++ ) {
			dataPriv.set(
				elems[ i ],
				"globalEval",
				!refElements || dataPriv.get( refElements[ i ], "globalEval" )
			);
		}
	}


	var rhtml = /<|&#?\w+;/;

	function buildFragment( elems, context, scripts, selection, ignored ) {
		var elem, tmp, tag, wrap, attached, j,
			fragment = context.createDocumentFragment(),
			nodes = [],
			i = 0,
			l = elems.length;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( toType( elem ) === "object" ) {

					// Support: Android <=4.0 only, PhantomJS 1 only
					// push.apply(_, arraylike) throws on ancient WebKit
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;
					tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

					// Descend through wrappers to the right content
					j = wrap[ 0 ];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Support: Android <=4.0 only, PhantomJS 1 only
					// push.apply(_, arraylike) throws on ancient WebKit
					jQuery.merge( nodes, tmp.childNodes );

					// Remember the top-level container
					tmp = fragment.firstChild;

					// Ensure the created nodes are orphaned (trac-12392)
					tmp.textContent = "";
				}
			}
		}

		// Remove wrapper from fragment
		fragment.textContent = "";

		i = 0;
		while ( ( elem = nodes[ i++ ] ) ) {

			// Skip elements already in the context collection (trac-4087)
			if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
				if ( ignored ) {
					ignored.push( elem );
				}
				continue;
			}

			attached = isAttached( elem );

			// Append to fragment
			tmp = getAll( fragment.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( attached ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( ( elem = tmp[ j++ ] ) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		return fragment;
	}


	var rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

	function returnTrue() {
		return true;
	}

	function returnFalse() {
		return false;
	}

	function on( elem, types, selector, data, fn, one ) {
		var origFn, type;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {

			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {

				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				on( elem, type, selector, data, types[ type ], one );
			}
			return elem;
		}

		if ( data == null && fn == null ) {

			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {

				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {

				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return elem;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {

				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};

			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return elem.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		} );
	}

	/*
	 * Helper functions for managing events -- not part of the public interface.
	 * Props to Dean Edwards' addEvent library for many of the ideas.
	 */
	jQuery.event = {

		global: {},

		add: function( elem, types, handler, data, selector ) {

			var handleObjIn, eventHandle, tmp,
				events, t, handleObj,
				special, handlers, type, namespaces, origType,
				elemData = dataPriv.get( elem );

			// Only attach events to objects that accept data
			if ( !acceptData( elem ) ) {
				return;
			}

			// Caller can pass in an object of custom data in lieu of the handler
			if ( handler.handler ) {
				handleObjIn = handler;
				handler = handleObjIn.handler;
				selector = handleObjIn.selector;
			}

			// Ensure that invalid selectors throw exceptions at attach time
			// Evaluate against documentElement in case elem is a non-element node (e.g., document)
			if ( selector ) {
				jQuery.find.matchesSelector( documentElement, selector );
			}

			// Make sure that the handler has a unique ID, used to find/remove it later
			if ( !handler.guid ) {
				handler.guid = jQuery.guid++;
			}

			// Init the element's event structure and main handler, if this is the first
			if ( !( events = elemData.events ) ) {
				events = elemData.events = Object.create( null );
			}
			if ( !( eventHandle = elemData.handle ) ) {
				eventHandle = elemData.handle = function( e ) {

					// Discard the second event of a jQuery.event.trigger() and
					// when an event is called after a page has unloaded
					return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
						jQuery.event.dispatch.apply( elem, arguments ) : undefined;
				};
			}

			// Handle multiple events separated by a space
			types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
			t = types.length;
			while ( t-- ) {
				tmp = rtypenamespace.exec( types[ t ] ) || [];
				type = origType = tmp[ 1 ];
				namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

				// There *must* be a type, no attaching namespace-only handlers
				if ( !type ) {
					continue;
				}

				// If event changes its type, use the special event handlers for the changed type
				special = jQuery.event.special[ type ] || {};

				// If selector defined, determine special event api type, otherwise given type
				type = ( selector ? special.delegateType : special.bindType ) || type;

				// Update special based on newly reset type
				special = jQuery.event.special[ type ] || {};

				// handleObj is passed to all event handlers
				handleObj = jQuery.extend( {
					type: type,
					origType: origType,
					data: data,
					handler: handler,
					guid: handler.guid,
					selector: selector,
					needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
					namespace: namespaces.join( "." )
				}, handleObjIn );

				// Init the event handler queue if we're the first
				if ( !( handlers = events[ type ] ) ) {
					handlers = events[ type ] = [];
					handlers.delegateCount = 0;

					// Only use addEventListener if the special events handler returns false
					if ( !special.setup ||
						special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

						if ( elem.addEventListener ) {
							elem.addEventListener( type, eventHandle );
						}
					}
				}

				if ( special.add ) {
					special.add.call( elem, handleObj );

					if ( !handleObj.handler.guid ) {
						handleObj.handler.guid = handler.guid;
					}
				}

				// Add to the element's handler list, delegates in front
				if ( selector ) {
					handlers.splice( handlers.delegateCount++, 0, handleObj );
				} else {
					handlers.push( handleObj );
				}

				// Keep track of which events have ever been used, for event optimization
				jQuery.event.global[ type ] = true;
			}

		},

		// Detach an event or set of events from an element
		remove: function( elem, types, handler, selector, mappedTypes ) {

			var j, origCount, tmp,
				events, t, handleObj,
				special, handlers, type, namespaces, origType,
				elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

			if ( !elemData || !( events = elemData.events ) ) {
				return;
			}

			// Once for each type.namespace in types; type may be omitted
			types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
			t = types.length;
			while ( t-- ) {
				tmp = rtypenamespace.exec( types[ t ] ) || [];
				type = origType = tmp[ 1 ];
				namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

				// Unbind all events (on this namespace, if provided) for the element
				if ( !type ) {
					for ( type in events ) {
						jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
					}
					continue;
				}

				special = jQuery.event.special[ type ] || {};
				type = ( selector ? special.delegateType : special.bindType ) || type;
				handlers = events[ type ] || [];
				tmp = tmp[ 2 ] &&
					new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

				// Remove matching events
				origCount = j = handlers.length;
				while ( j-- ) {
					handleObj = handlers[ j ];

					if ( ( mappedTypes || origType === handleObj.origType ) &&
						( !handler || handler.guid === handleObj.guid ) &&
						( !tmp || tmp.test( handleObj.namespace ) ) &&
						( !selector || selector === handleObj.selector ||
							selector === "**" && handleObj.selector ) ) {
						handlers.splice( j, 1 );

						if ( handleObj.selector ) {
							handlers.delegateCount--;
						}
						if ( special.remove ) {
							special.remove.call( elem, handleObj );
						}
					}
				}

				// Remove generic event handler if we removed something and no more handlers exist
				// (avoids potential for endless recursion during removal of special event handlers)
				if ( origCount && !handlers.length ) {
					if ( !special.teardown ||
						special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

						jQuery.removeEvent( elem, type, elemData.handle );
					}

					delete events[ type ];
				}
			}

			// Remove data and the expando if it's no longer used
			if ( jQuery.isEmptyObject( events ) ) {
				dataPriv.remove( elem, "handle events" );
			}
		},

		dispatch: function( nativeEvent ) {

			var i, j, ret, matched, handleObj, handlerQueue,
				args = new Array( arguments.length ),

				// Make a writable jQuery.Event from the native event object
				event = jQuery.event.fix( nativeEvent ),

				handlers = (
					dataPriv.get( this, "events" ) || Object.create( null )
				)[ event.type ] || [],
				special = jQuery.event.special[ event.type ] || {};

			// Use the fix-ed jQuery.Event rather than the (read-only) native event
			args[ 0 ] = event;

			for ( i = 1; i < arguments.length; i++ ) {
				args[ i ] = arguments[ i ];
			}

			event.delegateTarget = this;

			// Call the preDispatch hook for the mapped type, and let it bail if desired
			if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
				return;
			}

			// Determine handlers
			handlerQueue = jQuery.event.handlers.call( this, event, handlers );

			// Run delegates first; they may want to stop propagation beneath us
			i = 0;
			while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
				event.currentTarget = matched.elem;

				j = 0;
				while ( ( handleObj = matched.handlers[ j++ ] ) &&
					!event.isImmediatePropagationStopped() ) {

					// If the event is namespaced, then each handler is only invoked if it is
					// specially universal or its namespaces are a superset of the event's.
					if ( !event.rnamespace || handleObj.namespace === false ||
						event.rnamespace.test( handleObj.namespace ) ) {

						event.handleObj = handleObj;
						event.data = handleObj.data;

						ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
							handleObj.handler ).apply( matched.elem, args );

						if ( ret !== undefined ) {
							if ( ( event.result = ret ) === false ) {
								event.preventDefault();
								event.stopPropagation();
							}
						}
					}
				}
			}

			// Call the postDispatch hook for the mapped type
			if ( special.postDispatch ) {
				special.postDispatch.call( this, event );
			}

			return event.result;
		},

		handlers: function( event, handlers ) {
			var i, handleObj, sel, matchedHandlers, matchedSelectors,
				handlerQueue = [],
				delegateCount = handlers.delegateCount,
				cur = event.target;

			// Find delegate handlers
			if ( delegateCount &&

				// Support: IE <=9
				// Black-hole SVG <use> instance trees (trac-13180)
				cur.nodeType &&

				// Support: Firefox <=42
				// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
				// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
				// Support: IE 11 only
				// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
				!( event.type === "click" && event.button >= 1 ) ) {

				for ( ; cur !== this; cur = cur.parentNode || this ) {

					// Don't check non-elements (trac-13208)
					// Don't process clicks on disabled elements (trac-6911, trac-8165, trac-11382, trac-11764)
					if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {
						matchedHandlers = [];
						matchedSelectors = {};
						for ( i = 0; i < delegateCount; i++ ) {
							handleObj = handlers[ i ];

							// Don't conflict with Object.prototype properties (trac-13203)
							sel = handleObj.selector + " ";

							if ( matchedSelectors[ sel ] === undefined ) {
								matchedSelectors[ sel ] = handleObj.needsContext ?
									jQuery( sel, this ).index( cur ) > -1 :
									jQuery.find( sel, this, null, [ cur ] ).length;
							}
							if ( matchedSelectors[ sel ] ) {
								matchedHandlers.push( handleObj );
							}
						}
						if ( matchedHandlers.length ) {
							handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
						}
					}
				}
			}

			// Add the remaining (directly-bound) handlers
			cur = this;
			if ( delegateCount < handlers.length ) {
				handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
			}

			return handlerQueue;
		},

		addProp: function( name, hook ) {
			Object.defineProperty( jQuery.Event.prototype, name, {
				enumerable: true,
				configurable: true,

				get: isFunction( hook ) ?
					function() {
						if ( this.originalEvent ) {
							return hook( this.originalEvent );
						}
					} :
					function() {
						if ( this.originalEvent ) {
							return this.originalEvent[ name ];
						}
					},

				set: function( value ) {
					Object.defineProperty( this, name, {
						enumerable: true,
						configurable: true,
						writable: true,
						value: value
					} );
				}
			} );
		},

		fix: function( originalEvent ) {
			return originalEvent[ jQuery.expando ] ?
				originalEvent :
				new jQuery.Event( originalEvent );
		},

		special: {
			load: {

				// Prevent triggered image.load events from bubbling to window.load
				noBubble: true
			},
			click: {

				// Utilize native event to ensure correct state for checkable inputs
				setup: function( data ) {

					// For mutual compressibility with _default, replace `this` access with a local var.
					// `|| data` is dead code meant only to preserve the variable through minification.
					var el = this || data;

					// Claim the first handler
					if ( rcheckableType.test( el.type ) &&
						el.click && nodeName( el, "input" ) ) {

						// dataPriv.set( el, "click", ... )
						leverageNative( el, "click", true );
					}

					// Return false to allow normal processing in the caller
					return false;
				},
				trigger: function( data ) {

					// For mutual compressibility with _default, replace `this` access with a local var.
					// `|| data` is dead code meant only to preserve the variable through minification.
					var el = this || data;

					// Force setup before triggering a click
					if ( rcheckableType.test( el.type ) &&
						el.click && nodeName( el, "input" ) ) {

						leverageNative( el, "click" );
					}

					// Return non-false to allow normal event-path propagation
					return true;
				},

				// For cross-browser consistency, suppress native .click() on links
				// Also prevent it if we're currently inside a leveraged native-event stack
				_default: function( event ) {
					var target = event.target;
					return rcheckableType.test( target.type ) &&
						target.click && nodeName( target, "input" ) &&
						dataPriv.get( target, "click" ) ||
						nodeName( target, "a" );
				}
			},

			beforeunload: {
				postDispatch: function( event ) {

					// Support: Firefox 20+
					// Firefox doesn't alert if the returnValue field is not set.
					if ( event.result !== undefined && event.originalEvent ) {
						event.originalEvent.returnValue = event.result;
					}
				}
			}
		}
	};

	// Ensure the presence of an event listener that handles manually-triggered
	// synthetic events by interrupting progress until reinvoked in response to
	// *native* events that it fires directly, ensuring that state changes have
	// already occurred before other listeners are invoked.
	function leverageNative( el, type, isSetup ) {

		// Missing `isSetup` indicates a trigger call, which must force setup through jQuery.event.add
		if ( !isSetup ) {
			if ( dataPriv.get( el, type ) === undefined ) {
				jQuery.event.add( el, type, returnTrue );
			}
			return;
		}

		// Register the controller as a special universal handler for all event namespaces
		dataPriv.set( el, type, false );
		jQuery.event.add( el, type, {
			namespace: false,
			handler: function( event ) {
				var result,
					saved = dataPriv.get( this, type );

				if ( ( event.isTrigger & 1 ) && this[ type ] ) {

					// Interrupt processing of the outer synthetic .trigger()ed event
					if ( !saved ) {

						// Store arguments for use when handling the inner native event
						// There will always be at least one argument (an event object), so this array
						// will not be confused with a leftover capture object.
						saved = slice.call( arguments );
						dataPriv.set( this, type, saved );

						// Trigger the native event and capture its result
						this[ type ]();
						result = dataPriv.get( this, type );
						dataPriv.set( this, type, false );

						if ( saved !== result ) {

							// Cancel the outer synthetic event
							event.stopImmediatePropagation();
							event.preventDefault();

							return result;
						}

					// If this is an inner synthetic event for an event with a bubbling surrogate
					// (focus or blur), assume that the surrogate already propagated from triggering
					// the native event and prevent that from happening again here.
					// This technically gets the ordering wrong w.r.t. to `.trigger()` (in which the
					// bubbling surrogate propagates *after* the non-bubbling base), but that seems
					// less bad than duplication.
					} else if ( ( jQuery.event.special[ type ] || {} ).delegateType ) {
						event.stopPropagation();
					}

				// If this is a native event triggered above, everything is now in order
				// Fire an inner synthetic event with the original arguments
				} else if ( saved ) {

					// ...and capture the result
					dataPriv.set( this, type, jQuery.event.trigger(
						saved[ 0 ],
						saved.slice( 1 ),
						this
					) );

					// Abort handling of the native event by all jQuery handlers while allowing
					// native handlers on the same element to run. On target, this is achieved
					// by stopping immediate propagation just on the jQuery event. However,
					// the native event is re-wrapped by a jQuery one on each level of the
					// propagation so the only way to stop it for jQuery is to stop it for
					// everyone via native `stopPropagation()`. This is not a problem for
					// focus/blur which don't bubble, but it does also stop click on checkboxes
					// and radios. We accept this limitation.
					event.stopPropagation();
					event.isImmediatePropagationStopped = returnTrue;
				}
			}
		} );
	}

	jQuery.removeEvent = function( elem, type, handle ) {

		// This "if" is needed for plain objects
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle );
		}
	};

	jQuery.Event = function( src, props ) {

		// Allow instantiation without the 'new' keyword
		if ( !( this instanceof jQuery.Event ) ) {
			return new jQuery.Event( src, props );
		}

		// Event object
		if ( src && src.type ) {
			this.originalEvent = src;
			this.type = src.type;

			// Events bubbling up the document may have been marked as prevented
			// by a handler lower down the tree; reflect the correct value.
			this.isDefaultPrevented = src.defaultPrevented ||
					src.defaultPrevented === undefined &&

					// Support: Android <=2.3 only
					src.returnValue === false ?
				returnTrue :
				returnFalse;

			// Create target properties
			// Support: Safari <=6 - 7 only
			// Target should not be a text node (trac-504, trac-13143)
			this.target = ( src.target && src.target.nodeType === 3 ) ?
				src.target.parentNode :
				src.target;

			this.currentTarget = src.currentTarget;
			this.relatedTarget = src.relatedTarget;

		// Event type
		} else {
			this.type = src;
		}

		// Put explicitly provided properties onto the event object
		if ( props ) {
			jQuery.extend( this, props );
		}

		// Create a timestamp if incoming event doesn't have one
		this.timeStamp = src && src.timeStamp || Date.now();

		// Mark it as fixed
		this[ jQuery.expando ] = true;
	};

	// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
	// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
	jQuery.Event.prototype = {
		constructor: jQuery.Event,
		isDefaultPrevented: returnFalse,
		isPropagationStopped: returnFalse,
		isImmediatePropagationStopped: returnFalse,
		isSimulated: false,

		preventDefault: function() {
			var e = this.originalEvent;

			this.isDefaultPrevented = returnTrue;

			if ( e && !this.isSimulated ) {
				e.preventDefault();
			}
		},
		stopPropagation: function() {
			var e = this.originalEvent;

			this.isPropagationStopped = returnTrue;

			if ( e && !this.isSimulated ) {
				e.stopPropagation();
			}
		},
		stopImmediatePropagation: function() {
			var e = this.originalEvent;

			this.isImmediatePropagationStopped = returnTrue;

			if ( e && !this.isSimulated ) {
				e.stopImmediatePropagation();
			}

			this.stopPropagation();
		}
	};

	// Includes all common event props including KeyEvent and MouseEvent specific props
	jQuery.each( {
		altKey: true,
		bubbles: true,
		cancelable: true,
		changedTouches: true,
		ctrlKey: true,
		detail: true,
		eventPhase: true,
		metaKey: true,
		pageX: true,
		pageY: true,
		shiftKey: true,
		view: true,
		"char": true,
		code: true,
		charCode: true,
		key: true,
		keyCode: true,
		button: true,
		buttons: true,
		clientX: true,
		clientY: true,
		offsetX: true,
		offsetY: true,
		pointerId: true,
		pointerType: true,
		screenX: true,
		screenY: true,
		targetTouches: true,
		toElement: true,
		touches: true,
		which: true
	}, jQuery.event.addProp );

	jQuery.each( { focus: "focusin", blur: "focusout" }, function( type, delegateType ) {

		function focusMappedHandler( nativeEvent ) {
			if ( document.documentMode ) {

				// Support: IE 11+
				// Attach a single focusin/focusout handler on the document while someone wants
				// focus/blur. This is because the former are synchronous in IE while the latter
				// are async. In other browsers, all those handlers are invoked synchronously.

				// `handle` from private data would already wrap the event, but we need
				// to change the `type` here.
				var handle = dataPriv.get( this, "handle" ),
					event = jQuery.event.fix( nativeEvent );
				event.type = nativeEvent.type === "focusin" ? "focus" : "blur";
				event.isSimulated = true;

				// First, handle focusin/focusout
				handle( nativeEvent );

				// ...then, handle focus/blur
				//
				// focus/blur don't bubble while focusin/focusout do; simulate the former by only
				// invoking the handler at the lower level.
				if ( event.target === event.currentTarget ) {

					// The setup part calls `leverageNative`, which, in turn, calls
					// `jQuery.event.add`, so event handle will already have been set
					// by this point.
					handle( event );
				}
			} else {

				// For non-IE browsers, attach a single capturing handler on the document
				// while someone wants focusin/focusout.
				jQuery.event.simulate( delegateType, nativeEvent.target,
					jQuery.event.fix( nativeEvent ) );
			}
		}

		jQuery.event.special[ type ] = {

			// Utilize native event if possible so blur/focus sequence is correct
			setup: function() {

				var attaches;

				// Claim the first handler
				// dataPriv.set( this, "focus", ... )
				// dataPriv.set( this, "blur", ... )
				leverageNative( this, type, true );

				if ( document.documentMode ) {

					// Support: IE 9 - 11+
					// We use the same native handler for focusin & focus (and focusout & blur)
					// so we need to coordinate setup & teardown parts between those events.
					// Use `delegateType` as the key as `type` is already used by `leverageNative`.
					attaches = dataPriv.get( this, delegateType );
					if ( !attaches ) {
						this.addEventListener( delegateType, focusMappedHandler );
					}
					dataPriv.set( this, delegateType, ( attaches || 0 ) + 1 );
				} else {

					// Return false to allow normal processing in the caller
					return false;
				}
			},
			trigger: function() {

				// Force setup before trigger
				leverageNative( this, type );

				// Return non-false to allow normal event-path propagation
				return true;
			},

			teardown: function() {
				var attaches;

				if ( document.documentMode ) {
					attaches = dataPriv.get( this, delegateType ) - 1;
					if ( !attaches ) {
						this.removeEventListener( delegateType, focusMappedHandler );
						dataPriv.remove( this, delegateType );
					} else {
						dataPriv.set( this, delegateType, attaches );
					}
				} else {

					// Return false to indicate standard teardown should be applied
					return false;
				}
			},

			// Suppress native focus or blur if we're currently inside
			// a leveraged native-event stack
			_default: function( event ) {
				return dataPriv.get( event.target, type );
			},

			delegateType: delegateType
		};

		// Support: Firefox <=44
		// Firefox doesn't have focus(in | out) events
		// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
		//
		// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
		// focus(in | out) events fire after focus & blur events,
		// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
		// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
		//
		// Support: IE 9 - 11+
		// To preserve relative focusin/focus & focusout/blur event order guaranteed on the 3.x branch,
		// attach a single handler for both events in IE.
		jQuery.event.special[ delegateType ] = {
			setup: function() {

				// Handle: regular nodes (via `this.ownerDocument`), window
				// (via `this.document`) & document (via `this`).
				var doc = this.ownerDocument || this.document || this,
					dataHolder = document.documentMode ? this : doc,
					attaches = dataPriv.get( dataHolder, delegateType );

				// Support: IE 9 - 11+
				// We use the same native handler for focusin & focus (and focusout & blur)
				// so we need to coordinate setup & teardown parts between those events.
				// Use `delegateType` as the key as `type` is already used by `leverageNative`.
				if ( !attaches ) {
					if ( document.documentMode ) {
						this.addEventListener( delegateType, focusMappedHandler );
					} else {
						doc.addEventListener( type, focusMappedHandler, true );
					}
				}
				dataPriv.set( dataHolder, delegateType, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this.document || this,
					dataHolder = document.documentMode ? this : doc,
					attaches = dataPriv.get( dataHolder, delegateType ) - 1;

				if ( !attaches ) {
					if ( document.documentMode ) {
						this.removeEventListener( delegateType, focusMappedHandler );
					} else {
						doc.removeEventListener( type, focusMappedHandler, true );
					}
					dataPriv.remove( dataHolder, delegateType );
				} else {
					dataPriv.set( dataHolder, delegateType, attaches );
				}
			}
		};
	} );

	// Create mouseenter/leave events using mouseover/out and event-time checks
	// so that event delegation works in jQuery.
	// Do the same for pointerenter/pointerleave and pointerover/pointerout
	//
	// Support: Safari 7 only
	// Safari sends mouseenter too often; see:
	// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
	// for the description of the bug (it existed in older Chrome versions as well).
	jQuery.each( {
		mouseenter: "mouseover",
		mouseleave: "mouseout",
		pointerenter: "pointerover",
		pointerleave: "pointerout"
	}, function( orig, fix ) {
		jQuery.event.special[ orig ] = {
			delegateType: fix,
			bindType: fix,

			handle: function( event ) {
				var ret,
					target = this,
					related = event.relatedTarget,
					handleObj = event.handleObj;

				// For mouseenter/leave call the handler if related is outside the target.
				// NB: No relatedTarget if the mouse left/entered the browser window
				if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
					event.type = handleObj.origType;
					ret = handleObj.handler.apply( this, arguments );
					event.type = fix;
				}
				return ret;
			}
		};
	} );

	jQuery.fn.extend( {

		on: function( types, selector, data, fn ) {
			return on( this, types, selector, data, fn );
		},
		one: function( types, selector, data, fn ) {
			return on( this, types, selector, data, fn, 1 );
		},
		off: function( types, selector, fn ) {
			var handleObj, type;
			if ( types && types.preventDefault && types.handleObj ) {

				// ( event )  dispatched jQuery.Event
				handleObj = types.handleObj;
				jQuery( types.delegateTarget ).off(
					handleObj.namespace ?
						handleObj.origType + "." + handleObj.namespace :
						handleObj.origType,
					handleObj.selector,
					handleObj.handler
				);
				return this;
			}
			if ( typeof types === "object" ) {

				// ( types-object [, selector] )
				for ( type in types ) {
					this.off( type, selector, types[ type ] );
				}
				return this;
			}
			if ( selector === false || typeof selector === "function" ) {

				// ( types [, fn] )
				fn = selector;
				selector = undefined;
			}
			if ( fn === false ) {
				fn = returnFalse;
			}
			return this.each( function() {
				jQuery.event.remove( this, types, fn, selector );
			} );
		}
	} );


	var

		// Support: IE <=10 - 11, Edge 12 - 13 only
		// In IE/Edge using regex groups here causes severe slowdowns.
		// See https://connect.microsoft.com/IE/feedback/details/1736512/
		rnoInnerhtml = /<script|<style|<link/i,

		// checked="checked" or checked
		rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,

		rcleanScript = /^\s*<!\[CDATA\[|\]\]>\s*$/g;

	// Prefer a tbody over its parent table for containing new rows
	function manipulationTarget( elem, content ) {
		if ( nodeName( elem, "table" ) &&
			nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {

			return jQuery( elem ).children( "tbody" )[ 0 ] || elem;
		}

		return elem;
	}

	// Replace/restore the type attribute of script elements for safe DOM manipulation
	function disableScript( elem ) {
		elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
		return elem;
	}
	function restoreScript( elem ) {
		if ( ( elem.type || "" ).slice( 0, 5 ) === "true/" ) {
			elem.type = elem.type.slice( 5 );
		} else {
			elem.removeAttribute( "type" );
		}

		return elem;
	}

	function cloneCopyEvent( src, dest ) {
		var i, l, type, pdataOld, udataOld, udataCur, events;

		if ( dest.nodeType !== 1 ) {
			return;
		}

		// 1. Copy private data: events, handlers, etc.
		if ( dataPriv.hasData( src ) ) {
			pdataOld = dataPriv.get( src );
			events = pdataOld.events;

			if ( events ) {
				dataPriv.remove( dest, "handle events" );

				for ( type in events ) {
					for ( i = 0, l = events[ type ].length; i < l; i++ ) {
						jQuery.event.add( dest, type, events[ type ][ i ] );
					}
				}
			}
		}

		// 2. Copy user data
		if ( dataUser.hasData( src ) ) {
			udataOld = dataUser.access( src );
			udataCur = jQuery.extend( {}, udataOld );

			dataUser.set( dest, udataCur );
		}
	}

	// Fix IE bugs, see support tests
	function fixInput( src, dest ) {
		var nodeName = dest.nodeName.toLowerCase();

		// Fails to persist the checked state of a cloned checkbox or radio button.
		if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
			dest.checked = src.checked;

		// Fails to return the selected option to the default selected state when cloning options
		} else if ( nodeName === "input" || nodeName === "textarea" ) {
			dest.defaultValue = src.defaultValue;
		}
	}

	function domManip( collection, args, callback, ignored ) {

		// Flatten any nested arrays
		args = flat( args );

		var fragment, first, scripts, hasScripts, node, doc,
			i = 0,
			l = collection.length,
			iNoClone = l - 1,
			value = args[ 0 ],
			valueIsFunction = isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( valueIsFunction ||
				( l > 1 && typeof value === "string" &&
					!support.checkClone && rchecked.test( value ) ) ) {
			return collection.each( function( index ) {
				var self = collection.eq( index );
				if ( valueIsFunction ) {
					args[ 0 ] = value.call( this, index, self.html() );
				}
				domManip( self, args, callback, ignored );
			} );
		}

		if ( l ) {
			fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			// Require either new content or an interest in ignored elements to invoke the callback
			if ( first || ignored ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item
				// instead of the first because it can end up
				// being emptied incorrectly in certain situations (trac-8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {

							// Support: Android <=4.0 only, PhantomJS 1 only
							// push.apply(_, arraylike) throws on ancient WebKit
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call( collection[ i ], node, i );
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Re-enable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!dataPriv.access( node, "globalEval" ) &&
							jQuery.contains( doc, node ) ) {

							if ( node.src && ( node.type || "" ).toLowerCase()  !== "module" ) {

								// Optional AJAX dependency, but won't run scripts if not present
								if ( jQuery._evalUrl && !node.noModule ) {
									jQuery._evalUrl( node.src, {
										nonce: node.nonce || node.getAttribute( "nonce" )
									}, doc );
								}
							} else {

								// Unwrap a CDATA section containing script contents. This shouldn't be
								// needed as in XML documents they're already not visible when
								// inspecting element contents and in HTML documents they have no
								// meaning but we're preserving that logic for backwards compatibility.
								// This will be removed completely in 4.0. See gh-4904.
								DOMEval( node.textContent.replace( rcleanScript, "" ), node, doc );
							}
						}
					}
				}
			}
		}

		return collection;
	}

	function remove( elem, selector, keepData ) {
		var node,
			nodes = selector ? jQuery.filter( selector, elem ) : elem,
			i = 0;

		for ( ; ( node = nodes[ i ] ) != null; i++ ) {
			if ( !keepData && node.nodeType === 1 ) {
				jQuery.cleanData( getAll( node ) );
			}

			if ( node.parentNode ) {
				if ( keepData && isAttached( node ) ) {
					setGlobalEval( getAll( node, "script" ) );
				}
				node.parentNode.removeChild( node );
			}
		}

		return elem;
	}

	jQuery.extend( {
		htmlPrefilter: function( html ) {
			return html;
		},

		clone: function( elem, dataAndEvents, deepDataAndEvents ) {
			var i, l, srcElements, destElements,
				clone = elem.cloneNode( true ),
				inPage = isAttached( elem );

			// Fix IE cloning issues
			if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
					!jQuery.isXMLDoc( elem ) ) {

				// We eschew jQuery#find here for performance reasons:
				// https://jsperf.com/getall-vs-sizzle/2
				destElements = getAll( clone );
				srcElements = getAll( elem );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					fixInput( srcElements[ i ], destElements[ i ] );
				}
			}

			// Copy the events from the original to the clone
			if ( dataAndEvents ) {
				if ( deepDataAndEvents ) {
					srcElements = srcElements || getAll( elem );
					destElements = destElements || getAll( clone );

					for ( i = 0, l = srcElements.length; i < l; i++ ) {
						cloneCopyEvent( srcElements[ i ], destElements[ i ] );
					}
				} else {
					cloneCopyEvent( elem, clone );
				}
			}

			// Preserve script evaluation history
			destElements = getAll( clone, "script" );
			if ( destElements.length > 0 ) {
				setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
			}

			// Return the cloned set
			return clone;
		},

		cleanData: function( elems ) {
			var data, elem, type,
				special = jQuery.event.special,
				i = 0;

			for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
				if ( acceptData( elem ) ) {
					if ( ( data = elem[ dataPriv.expando ] ) ) {
						if ( data.events ) {
							for ( type in data.events ) {
								if ( special[ type ] ) {
									jQuery.event.remove( elem, type );

								// This is a shortcut to avoid jQuery.event.remove's overhead
								} else {
									jQuery.removeEvent( elem, type, data.handle );
								}
							}
						}

						// Support: Chrome <=35 - 45+
						// Assign undefined instead of using delete, see Data#remove
						elem[ dataPriv.expando ] = undefined;
					}
					if ( elem[ dataUser.expando ] ) {

						// Support: Chrome <=35 - 45+
						// Assign undefined instead of using delete, see Data#remove
						elem[ dataUser.expando ] = undefined;
					}
				}
			}
		}
	} );

	jQuery.fn.extend( {
		detach: function( selector ) {
			return remove( this, selector, true );
		},

		remove: function( selector ) {
			return remove( this, selector );
		},

		text: function( value ) {
			return access( this, function( value ) {
				return value === undefined ?
					jQuery.text( this ) :
					this.empty().each( function() {
						if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
							this.textContent = value;
						}
					} );
			}, null, value, arguments.length );
		},

		append: function() {
			return domManip( this, arguments, function( elem ) {
				if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
					var target = manipulationTarget( this, elem );
					target.appendChild( elem );
				}
			} );
		},

		prepend: function() {
			return domManip( this, arguments, function( elem ) {
				if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
					var target = manipulationTarget( this, elem );
					target.insertBefore( elem, target.firstChild );
				}
			} );
		},

		before: function() {
			return domManip( this, arguments, function( elem ) {
				if ( this.parentNode ) {
					this.parentNode.insertBefore( elem, this );
				}
			} );
		},

		after: function() {
			return domManip( this, arguments, function( elem ) {
				if ( this.parentNode ) {
					this.parentNode.insertBefore( elem, this.nextSibling );
				}
			} );
		},

		empty: function() {
			var elem,
				i = 0;

			for ( ; ( elem = this[ i ] ) != null; i++ ) {
				if ( elem.nodeType === 1 ) {

					// Prevent memory leaks
					jQuery.cleanData( getAll( elem, false ) );

					// Remove any remaining nodes
					elem.textContent = "";
				}
			}

			return this;
		},

		clone: function( dataAndEvents, deepDataAndEvents ) {
			dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
			deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

			return this.map( function() {
				return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
			} );
		},

		html: function( value ) {
			return access( this, function( value ) {
				var elem = this[ 0 ] || {},
					i = 0,
					l = this.length;

				if ( value === undefined && elem.nodeType === 1 ) {
					return elem.innerHTML;
				}

				// See if we can take a shortcut and just use innerHTML
				if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
					!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

					value = jQuery.htmlPrefilter( value );

					try {
						for ( ; i < l; i++ ) {
							elem = this[ i ] || {};

							// Remove element nodes and prevent memory leaks
							if ( elem.nodeType === 1 ) {
								jQuery.cleanData( getAll( elem, false ) );
								elem.innerHTML = value;
							}
						}

						elem = 0;

					// If using innerHTML throws an exception, use the fallback method
					} catch ( e ) {}
				}

				if ( elem ) {
					this.empty().append( value );
				}
			}, null, value, arguments.length );
		},

		replaceWith: function() {
			var ignored = [];

			// Make the changes, replacing each non-ignored context element with the new content
			return domManip( this, arguments, function( elem ) {
				var parent = this.parentNode;

				if ( jQuery.inArray( this, ignored ) < 0 ) {
					jQuery.cleanData( getAll( this ) );
					if ( parent ) {
						parent.replaceChild( elem, this );
					}
				}

			// Force callback invocation
			}, ignored );
		}
	} );

	jQuery.each( {
		appendTo: "append",
		prependTo: "prepend",
		insertBefore: "before",
		insertAfter: "after",
		replaceAll: "replaceWith"
	}, function( name, original ) {
		jQuery.fn[ name ] = function( selector ) {
			var elems,
				ret = [],
				insert = jQuery( selector ),
				last = insert.length - 1,
				i = 0;

			for ( ; i <= last; i++ ) {
				elems = i === last ? this : this.clone( true );
				jQuery( insert[ i ] )[ original ]( elems );

				// Support: Android <=4.0 only, PhantomJS 1 only
				// .get() because push.apply(_, arraylike) throws on ancient WebKit
				push.apply( ret, elems.get() );
			}

			return this.pushStack( ret );
		};
	} );
	var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

	var rcustomProp = /^--/;


	var getStyles = function( elem ) {

			// Support: IE <=11 only, Firefox <=30 (trac-15098, trac-14150)
			// IE throws on elements created in popups
			// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
			var view = elem.ownerDocument.defaultView;

			if ( !view || !view.opener ) {
				view = window;
			}

			return view.getComputedStyle( elem );
		};

	var swap = function( elem, options, callback ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.call( elem );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	};


	var rboxStyle = new RegExp( cssExpand.join( "|" ), "i" );



	( function() {

		// Executing both pixelPosition & boxSizingReliable tests require only one layout
		// so they're executed at the same time to save the second computation.
		function computeStyleTests() {

			// This is a singleton, we need to execute it only once
			if ( !div ) {
				return;
			}

			container.style.cssText = "position:absolute;left:-11111px;width:60px;" +
				"margin-top:1px;padding:0;border:0";
			div.style.cssText =
				"position:relative;display:block;box-sizing:border-box;overflow:scroll;" +
				"margin:auto;border:1px;padding:1px;" +
				"width:60%;top:1%";
			documentElement.appendChild( container ).appendChild( div );

			var divStyle = window.getComputedStyle( div );
			pixelPositionVal = divStyle.top !== "1%";

			// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
			reliableMarginLeftVal = roundPixelMeasures( divStyle.marginLeft ) === 12;

			// Support: Android 4.0 - 4.3 only, Safari <=9.1 - 10.1, iOS <=7.0 - 9.3
			// Some styles come back with percentage values, even though they shouldn't
			div.style.right = "60%";
			pixelBoxStylesVal = roundPixelMeasures( divStyle.right ) === 36;

			// Support: IE 9 - 11 only
			// Detect misreporting of content dimensions for box-sizing:border-box elements
			boxSizingReliableVal = roundPixelMeasures( divStyle.width ) === 36;

			// Support: IE 9 only
			// Detect overflow:scroll screwiness (gh-3699)
			// Support: Chrome <=64
			// Don't get tricked when zoom affects offsetWidth (gh-4029)
			div.style.position = "absolute";
			scrollboxSizeVal = roundPixelMeasures( div.offsetWidth / 3 ) === 12;

			documentElement.removeChild( container );

			// Nullify the div so it wouldn't be stored in the memory and
			// it will also be a sign that checks already performed
			div = null;
		}

		function roundPixelMeasures( measure ) {
			return Math.round( parseFloat( measure ) );
		}

		var pixelPositionVal, boxSizingReliableVal, scrollboxSizeVal, pixelBoxStylesVal,
			reliableTrDimensionsVal, reliableMarginLeftVal,
			container = document.createElement( "div" ),
			div = document.createElement( "div" );

		// Finish early in limited (non-browser) environments
		if ( !div.style ) {
			return;
		}

		// Support: IE <=9 - 11 only
		// Style of cloned element affects source element cloned (trac-8908)
		div.style.backgroundClip = "content-box";
		div.cloneNode( true ).style.backgroundClip = "";
		support.clearCloneStyle = div.style.backgroundClip === "content-box";

		jQuery.extend( support, {
			boxSizingReliable: function() {
				computeStyleTests();
				return boxSizingReliableVal;
			},
			pixelBoxStyles: function() {
				computeStyleTests();
				return pixelBoxStylesVal;
			},
			pixelPosition: function() {
				computeStyleTests();
				return pixelPositionVal;
			},
			reliableMarginLeft: function() {
				computeStyleTests();
				return reliableMarginLeftVal;
			},
			scrollboxSize: function() {
				computeStyleTests();
				return scrollboxSizeVal;
			},

			// Support: IE 9 - 11+, Edge 15 - 18+
			// IE/Edge misreport `getComputedStyle` of table rows with width/height
			// set in CSS while `offset*` properties report correct values.
			// Behavior in IE 9 is more subtle than in newer versions & it passes
			// some versions of this test; make sure not to make it pass there!
			//
			// Support: Firefox 70+
			// Only Firefox includes border widths
			// in computed dimensions. (gh-4529)
			reliableTrDimensions: function() {
				var table, tr, trChild, trStyle;
				if ( reliableTrDimensionsVal == null ) {
					table = document.createElement( "table" );
					tr = document.createElement( "tr" );
					trChild = document.createElement( "div" );

					table.style.cssText = "position:absolute;left:-11111px;border-collapse:separate";
					tr.style.cssText = "box-sizing:content-box;border:1px solid";

					// Support: Chrome 86+
					// Height set through cssText does not get applied.
					// Computed height then comes back as 0.
					tr.style.height = "1px";
					trChild.style.height = "9px";

					// Support: Android 8 Chrome 86+
					// In our bodyBackground.html iframe,
					// display for all div elements is set to "inline",
					// which causes a problem only in Android 8 Chrome 86.
					// Ensuring the div is `display: block`
					// gets around this issue.
					trChild.style.display = "block";

					documentElement
						.appendChild( table )
						.appendChild( tr )
						.appendChild( trChild );

					trStyle = window.getComputedStyle( tr );
					reliableTrDimensionsVal = ( parseInt( trStyle.height, 10 ) +
						parseInt( trStyle.borderTopWidth, 10 ) +
						parseInt( trStyle.borderBottomWidth, 10 ) ) === tr.offsetHeight;

					documentElement.removeChild( table );
				}
				return reliableTrDimensionsVal;
			}
		} );
	} )();


	function curCSS( elem, name, computed ) {
		var width, minWidth, maxWidth, ret,
			isCustomProp = rcustomProp.test( name ),

			// Support: Firefox 51+
			// Retrieving style before computed somehow
			// fixes an issue with getting wrong values
			// on detached elements
			style = elem.style;

		computed = computed || getStyles( elem );

		// getPropertyValue is needed for:
		//   .css('filter') (IE 9 only, trac-12537)
		//   .css('--customProperty) (gh-3144)
		if ( computed ) {

			// Support: IE <=9 - 11+
			// IE only supports `"float"` in `getPropertyValue`; in computed styles
			// it's only available as `"cssFloat"`. We no longer modify properties
			// sent to `.css()` apart from camelCasing, so we need to check both.
			// Normally, this would create difference in behavior: if
			// `getPropertyValue` returns an empty string, the value returned
			// by `.css()` would be `undefined`. This is usually the case for
			// disconnected elements. However, in IE even disconnected elements
			// with no styles return `"none"` for `getPropertyValue( "float" )`
			ret = computed.getPropertyValue( name ) || computed[ name ];

			if ( isCustomProp && ret ) {

				// Support: Firefox 105+, Chrome <=105+
				// Spec requires trimming whitespace for custom properties (gh-4926).
				// Firefox only trims leading whitespace. Chrome just collapses
				// both leading & trailing whitespace to a single space.
				//
				// Fall back to `undefined` if empty string returned.
				// This collapses a missing definition with property defined
				// and set to an empty string but there's no standard API
				// allowing us to differentiate them without a performance penalty
				// and returning `undefined` aligns with older jQuery.
				//
				// rtrimCSS treats U+000D CARRIAGE RETURN and U+000C FORM FEED
				// as whitespace while CSS does not, but this is not a problem
				// because CSS preprocessing replaces them with U+000A LINE FEED
				// (which *is* CSS whitespace)
				// https://www.w3.org/TR/css-syntax-3/#input-preprocessing
				ret = ret.replace( rtrimCSS, "$1" ) || undefined;
			}

			if ( ret === "" && !isAttached( elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Android Browser returns percentage for some values,
			// but width seems to be reliably pixels.
			// This is against the CSSOM draft spec:
			// https://drafts.csswg.org/cssom/#resolved-values
			if ( !support.pixelBoxStyles() && rnumnonpx.test( ret ) && rboxStyle.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret !== undefined ?

			// Support: IE <=9 - 11 only
			// IE returns zIndex value as an integer.
			ret + "" :
			ret;
	}


	function addGetHookIf( conditionFn, hookFn ) {

		// Define the hook, we'll check on the first run if it's really needed.
		return {
			get: function() {
				if ( conditionFn() ) {

					// Hook not needed (or it's not possible to use it due
					// to missing dependency), remove it.
					delete this.get;
					return;
				}

				// Hook needed; redefine it so that the support test is not executed again.
				return ( this.get = hookFn ).apply( this, arguments );
			}
		};
	}


	var cssPrefixes = [ "Webkit", "Moz", "ms" ],
		emptyStyle = document.createElement( "div" ).style,
		vendorProps = {};

	// Return a vendor-prefixed property or undefined
	function vendorPropName( name ) {

		// Check for vendor prefixed names
		var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
			i = cssPrefixes.length;

		while ( i-- ) {
			name = cssPrefixes[ i ] + capName;
			if ( name in emptyStyle ) {
				return name;
			}
		}
	}

	// Return a potentially-mapped jQuery.cssProps or vendor prefixed property
	function finalPropName( name ) {
		var final = jQuery.cssProps[ name ] || vendorProps[ name ];

		if ( final ) {
			return final;
		}
		if ( name in emptyStyle ) {
			return name;
		}
		return vendorProps[ name ] = vendorPropName( name ) || name;
	}


	var

		// Swappable if display is none or starts with table
		// except "table", "table-cell", or "table-caption"
		// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
		rdisplayswap = /^(none|table(?!-c[ea]).+)/,
		cssShow = { position: "absolute", visibility: "hidden", display: "block" },
		cssNormalTransform = {
			letterSpacing: "0",
			fontWeight: "400"
		};

	function setPositiveNumber( _elem, value, subtract ) {

		// Any relative (+/-) values have already been
		// normalized at this point
		var matches = rcssNum.exec( value );
		return matches ?

			// Guard against undefined "subtract", e.g., when used as in cssHooks
			Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
			value;
	}

	function boxModelAdjustment( elem, dimension, box, isBorderBox, styles, computedVal ) {
		var i = dimension === "width" ? 1 : 0,
			extra = 0,
			delta = 0,
			marginDelta = 0;

		// Adjustment may not be necessary
		if ( box === ( isBorderBox ? "border" : "content" ) ) {
			return 0;
		}

		for ( ; i < 4; i += 2 ) {

			// Both box models exclude margin
			// Count margin delta separately to only add it after scroll gutter adjustment.
			// This is needed to make negative margins work with `outerHeight( true )` (gh-3982).
			if ( box === "margin" ) {
				marginDelta += jQuery.css( elem, box + cssExpand[ i ], true, styles );
			}

			// If we get here with a content-box, we're seeking "padding" or "border" or "margin"
			if ( !isBorderBox ) {

				// Add padding
				delta += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

				// For "border" or "margin", add border
				if ( box !== "padding" ) {
					delta += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );

				// But still keep track of it otherwise
				} else {
					extra += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
				}

			// If we get here with a border-box (content + padding + border), we're seeking "content" or
			// "padding" or "margin"
			} else {

				// For "content", subtract padding
				if ( box === "content" ) {
					delta -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
				}

				// For "content" or "padding", subtract border
				if ( box !== "margin" ) {
					delta -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
				}
			}
		}

		// Account for positive content-box scroll gutter when requested by providing computedVal
		if ( !isBorderBox && computedVal >= 0 ) {

			// offsetWidth/offsetHeight is a rounded sum of content, padding, scroll gutter, and border
			// Assuming integer scroll gutter, subtract the rest and round down
			delta += Math.max( 0, Math.ceil(
				elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
				computedVal -
				delta -
				extra -
				0.5

			// If offsetWidth/offsetHeight is unknown, then we can't determine content-box scroll gutter
			// Use an explicit zero to avoid NaN (gh-3964)
			) ) || 0;
		}

		return delta + marginDelta;
	}

	function getWidthOrHeight( elem, dimension, extra ) {

		// Start with computed style
		var styles = getStyles( elem ),

			// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-4322).
			// Fake content-box until we know it's needed to know the true value.
			boxSizingNeeded = !support.boxSizingReliable() || extra,
			isBorderBox = boxSizingNeeded &&
				jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
			valueIsBorderBox = isBorderBox,

			val = curCSS( elem, dimension, styles ),
			offsetProp = "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 );

		// Support: Firefox <=54
		// Return a confounding non-pixel value or feign ignorance, as appropriate.
		if ( rnumnonpx.test( val ) ) {
			if ( !extra ) {
				return val;
			}
			val = "auto";
		}


		// Support: IE 9 - 11 only
		// Use offsetWidth/offsetHeight for when box sizing is unreliable.
		// In those cases, the computed value can be trusted to be border-box.
		if ( ( !support.boxSizingReliable() && isBorderBox ||

			// Support: IE 10 - 11+, Edge 15 - 18+
			// IE/Edge misreport `getComputedStyle` of table rows with width/height
			// set in CSS while `offset*` properties report correct values.
			// Interestingly, in some cases IE 9 doesn't suffer from this issue.
			!support.reliableTrDimensions() && nodeName( elem, "tr" ) ||

			// Fall back to offsetWidth/offsetHeight when value is "auto"
			// This happens for inline elements with no explicit setting (gh-3571)
			val === "auto" ||

			// Support: Android <=4.1 - 4.3 only
			// Also use offsetWidth/offsetHeight for misreported inline dimensions (gh-3602)
			!parseFloat( val ) && jQuery.css( elem, "display", false, styles ) === "inline" ) &&

			// Make sure the element is visible & connected
			elem.getClientRects().length ) {

			isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

			// Where available, offsetWidth/offsetHeight approximate border box dimensions.
			// Where not available (e.g., SVG), assume unreliable box-sizing and interpret the
			// retrieved value as a content box dimension.
			valueIsBorderBox = offsetProp in elem;
			if ( valueIsBorderBox ) {
				val = elem[ offsetProp ];
			}
		}

		// Normalize "" and auto
		val = parseFloat( val ) || 0;

		// Adjust for the element's box model
		return ( val +
			boxModelAdjustment(
				elem,
				dimension,
				extra || ( isBorderBox ? "border" : "content" ),
				valueIsBorderBox,
				styles,

				// Provide the current computed size to request scroll gutter calculation (gh-3589)
				val
			)
		) + "px";
	}

	jQuery.extend( {

		// Add in style property hooks for overriding the default
		// behavior of getting and setting a style property
		cssHooks: {
			opacity: {
				get: function( elem, computed ) {
					if ( computed ) {

						// We should always get a number back from opacity
						var ret = curCSS( elem, "opacity" );
						return ret === "" ? "1" : ret;
					}
				}
			}
		},

		// Don't automatically add "px" to these possibly-unitless properties
		cssNumber: {
			animationIterationCount: true,
			aspectRatio: true,
			borderImageSlice: true,
			columnCount: true,
			flexGrow: true,
			flexShrink: true,
			fontWeight: true,
			gridArea: true,
			gridColumn: true,
			gridColumnEnd: true,
			gridColumnStart: true,
			gridRow: true,
			gridRowEnd: true,
			gridRowStart: true,
			lineHeight: true,
			opacity: true,
			order: true,
			orphans: true,
			scale: true,
			widows: true,
			zIndex: true,
			zoom: true,

			// SVG-related
			fillOpacity: true,
			floodOpacity: true,
			stopOpacity: true,
			strokeMiterlimit: true,
			strokeOpacity: true
		},

		// Add in properties whose names you wish to fix before
		// setting or getting the value
		cssProps: {},

		// Get and set the style property on a DOM Node
		style: function( elem, name, value, extra ) {

			// Don't set styles on text and comment nodes
			if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
				return;
			}

			// Make sure that we're working with the right name
			var ret, type, hooks,
				origName = camelCase( name ),
				isCustomProp = rcustomProp.test( name ),
				style = elem.style;

			// Make sure that we're working with the right name. We don't
			// want to query the value if it is a CSS custom property
			// since they are user-defined.
			if ( !isCustomProp ) {
				name = finalPropName( origName );
			}

			// Gets hook for the prefixed version, then unprefixed version
			hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

			// Check if we're setting a value
			if ( value !== undefined ) {
				type = typeof value;

				// Convert "+=" or "-=" to relative numbers (trac-7345)
				if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
					value = adjustCSS( elem, name, ret );

					// Fixes bug trac-9237
					type = "number";
				}

				// Make sure that null and NaN values aren't set (trac-7116)
				if ( value == null || value !== value ) {
					return;
				}

				// If a number was passed in, add the unit (except for certain CSS properties)
				// The isCustomProp check can be removed in jQuery 4.0 when we only auto-append
				// "px" to a few hardcoded values.
				if ( type === "number" && !isCustomProp ) {
					value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
				}

				// background-* props affect original clone's values
				if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
					style[ name ] = "inherit";
				}

				// If a hook was provided, use that value, otherwise just set the specified value
				if ( !hooks || !( "set" in hooks ) ||
					( value = hooks.set( elem, value, extra ) ) !== undefined ) {

					if ( isCustomProp ) {
						style.setProperty( name, value );
					} else {
						style[ name ] = value;
					}
				}

			} else {

				// If a hook was provided get the non-computed value from there
				if ( hooks && "get" in hooks &&
					( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

					return ret;
				}

				// Otherwise just get the value from the style object
				return style[ name ];
			}
		},

		css: function( elem, name, extra, styles ) {
			var val, num, hooks,
				origName = camelCase( name ),
				isCustomProp = rcustomProp.test( name );

			// Make sure that we're working with the right name. We don't
			// want to modify the value if it is a CSS custom property
			// since they are user-defined.
			if ( !isCustomProp ) {
				name = finalPropName( origName );
			}

			// Try prefixed name followed by the unprefixed name
			hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

			// If a hook was provided get the computed value from there
			if ( hooks && "get" in hooks ) {
				val = hooks.get( elem, true, extra );
			}

			// Otherwise, if a way to get the computed value exists, use that
			if ( val === undefined ) {
				val = curCSS( elem, name, styles );
			}

			// Convert "normal" to computed value
			if ( val === "normal" && name in cssNormalTransform ) {
				val = cssNormalTransform[ name ];
			}

			// Make numeric if forced or a qualifier was provided and val looks numeric
			if ( extra === "" || extra ) {
				num = parseFloat( val );
				return extra === true || isFinite( num ) ? num || 0 : val;
			}

			return val;
		}
	} );

	jQuery.each( [ "height", "width" ], function( _i, dimension ) {
		jQuery.cssHooks[ dimension ] = {
			get: function( elem, computed, extra ) {
				if ( computed ) {

					// Certain elements can have dimension info if we invisibly show them
					// but it must have a current display style that would benefit
					return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&

						// Support: Safari 8+
						// Table columns in Safari have non-zero offsetWidth & zero
						// getBoundingClientRect().width unless display is changed.
						// Support: IE <=11 only
						// Running getBoundingClientRect on a disconnected node
						// in IE throws an error.
						( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
						swap( elem, cssShow, function() {
							return getWidthOrHeight( elem, dimension, extra );
						} ) :
						getWidthOrHeight( elem, dimension, extra );
				}
			},

			set: function( elem, value, extra ) {
				var matches,
					styles = getStyles( elem ),

					// Only read styles.position if the test has a chance to fail
					// to avoid forcing a reflow.
					scrollboxSizeBuggy = !support.scrollboxSize() &&
						styles.position === "absolute",

					// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-3991)
					boxSizingNeeded = scrollboxSizeBuggy || extra,
					isBorderBox = boxSizingNeeded &&
						jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					subtract = extra ?
						boxModelAdjustment(
							elem,
							dimension,
							extra,
							isBorderBox,
							styles
						) :
						0;

				// Account for unreliable border-box dimensions by comparing offset* to computed and
				// faking a content-box to get border and padding (gh-3699)
				if ( isBorderBox && scrollboxSizeBuggy ) {
					subtract -= Math.ceil(
						elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
						parseFloat( styles[ dimension ] ) -
						boxModelAdjustment( elem, dimension, "border", false, styles ) -
						0.5
					);
				}

				// Convert to pixels if value adjustment is needed
				if ( subtract && ( matches = rcssNum.exec( value ) ) &&
					( matches[ 3 ] || "px" ) !== "px" ) {

					elem.style[ dimension ] = value;
					value = jQuery.css( elem, dimension );
				}

				return setPositiveNumber( elem, value, subtract );
			}
		};
	} );

	jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
		function( elem, computed ) {
			if ( computed ) {
				return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
					elem.getBoundingClientRect().left -
						swap( elem, { marginLeft: 0 }, function() {
							return elem.getBoundingClientRect().left;
						} )
				) + "px";
			}
		}
	);

	// These hooks are used by animate to expand properties
	jQuery.each( {
		margin: "",
		padding: "",
		border: "Width"
	}, function( prefix, suffix ) {
		jQuery.cssHooks[ prefix + suffix ] = {
			expand: function( value ) {
				var i = 0,
					expanded = {},

					// Assumes a single number if not a string
					parts = typeof value === "string" ? value.split( " " ) : [ value ];

				for ( ; i < 4; i++ ) {
					expanded[ prefix + cssExpand[ i ] + suffix ] =
						parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
				}

				return expanded;
			}
		};

		if ( prefix !== "margin" ) {
			jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
		}
	} );

	jQuery.fn.extend( {
		css: function( name, value ) {
			return access( this, function( elem, name, value ) {
				var styles, len,
					map = {},
					i = 0;

				if ( Array.isArray( name ) ) {
					styles = getStyles( elem );
					len = name.length;

					for ( ; i < len; i++ ) {
						map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
					}

					return map;
				}

				return value !== undefined ?
					jQuery.style( elem, name, value ) :
					jQuery.css( elem, name );
			}, name, value, arguments.length > 1 );
		}
	} );


	function Tween( elem, options, prop, end, easing ) {
		return new Tween.prototype.init( elem, options, prop, end, easing );
	}
	jQuery.Tween = Tween;

	Tween.prototype = {
		constructor: Tween,
		init: function( elem, options, prop, end, easing, unit ) {
			this.elem = elem;
			this.prop = prop;
			this.easing = easing || jQuery.easing._default;
			this.options = options;
			this.start = this.now = this.cur();
			this.end = end;
			this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
		},
		cur: function() {
			var hooks = Tween.propHooks[ this.prop ];

			return hooks && hooks.get ?
				hooks.get( this ) :
				Tween.propHooks._default.get( this );
		},
		run: function( percent ) {
			var eased,
				hooks = Tween.propHooks[ this.prop ];

			if ( this.options.duration ) {
				this.pos = eased = jQuery.easing[ this.easing ](
					percent, this.options.duration * percent, 0, 1, this.options.duration
				);
			} else {
				this.pos = eased = percent;
			}
			this.now = ( this.end - this.start ) * eased + this.start;

			if ( this.options.step ) {
				this.options.step.call( this.elem, this.now, this );
			}

			if ( hooks && hooks.set ) {
				hooks.set( this );
			} else {
				Tween.propHooks._default.set( this );
			}
			return this;
		}
	};

	Tween.prototype.init.prototype = Tween.prototype;

	Tween.propHooks = {
		_default: {
			get: function( tween ) {
				var result;

				// Use a property on the element directly when it is not a DOM element,
				// or when there is no matching style property that exists.
				if ( tween.elem.nodeType !== 1 ||
					tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
					return tween.elem[ tween.prop ];
				}

				// Passing an empty string as a 3rd parameter to .css will automatically
				// attempt a parseFloat and fallback to a string if the parse fails.
				// Simple values such as "10px" are parsed to Float;
				// complex values such as "rotate(1rad)" are returned as-is.
				result = jQuery.css( tween.elem, tween.prop, "" );

				// Empty strings, null, undefined and "auto" are converted to 0.
				return !result || result === "auto" ? 0 : result;
			},
			set: function( tween ) {

				// Use step hook for back compat.
				// Use cssHook if its there.
				// Use .style if available and use plain properties where available.
				if ( jQuery.fx.step[ tween.prop ] ) {
					jQuery.fx.step[ tween.prop ]( tween );
				} else if ( tween.elem.nodeType === 1 && (
					jQuery.cssHooks[ tween.prop ] ||
						tween.elem.style[ finalPropName( tween.prop ) ] != null ) ) {
					jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
				} else {
					tween.elem[ tween.prop ] = tween.now;
				}
			}
		}
	};

	// Support: IE <=9 only
	// Panic based approach to setting things on disconnected nodes
	Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
		set: function( tween ) {
			if ( tween.elem.nodeType && tween.elem.parentNode ) {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	};

	jQuery.easing = {
		linear: function( p ) {
			return p;
		},
		swing: function( p ) {
			return 0.5 - Math.cos( p * Math.PI ) / 2;
		},
		_default: "swing"
	};

	jQuery.fx = Tween.prototype.init;

	// Back compat <1.8 extension point
	jQuery.fx.step = {};




	var
		fxNow, inProgress,
		rfxtypes = /^(?:toggle|show|hide)$/,
		rrun = /queueHooks$/;

	function schedule() {
		if ( inProgress ) {
			if ( document.hidden === false && window.requestAnimationFrame ) {
				window.requestAnimationFrame( schedule );
			} else {
				window.setTimeout( schedule, jQuery.fx.interval );
			}

			jQuery.fx.tick();
		}
	}

	// Animations created synchronously will run synchronously
	function createFxNow() {
		window.setTimeout( function() {
			fxNow = undefined;
		} );
		return ( fxNow = Date.now() );
	}

	// Generate parameters to create a standard animation
	function genFx( type, includeWidth ) {
		var which,
			i = 0,
			attrs = { height: type };

		// If we include width, step value is 1 to do all cssExpand values,
		// otherwise step value is 2 to skip over Left and Right
		includeWidth = includeWidth ? 1 : 0;
		for ( ; i < 4; i += 2 - includeWidth ) {
			which = cssExpand[ i ];
			attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
		}

		if ( includeWidth ) {
			attrs.opacity = attrs.width = type;
		}

		return attrs;
	}

	function createTween( value, prop, animation ) {
		var tween,
			collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
			index = 0,
			length = collection.length;
		for ( ; index < length; index++ ) {
			if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

				// We're done with this property
				return tween;
			}
		}
	}

	function defaultPrefilter( elem, props, opts ) {
		var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,
			isBox = "width" in props || "height" in props,
			anim = this,
			orig = {},
			style = elem.style,
			hidden = elem.nodeType && isHiddenWithinTree( elem ),
			dataShow = dataPriv.get( elem, "fxshow" );

		// Queue-skipping animations hijack the fx hooks
		if ( !opts.queue ) {
			hooks = jQuery._queueHooks( elem, "fx" );
			if ( hooks.unqueued == null ) {
				hooks.unqueued = 0;
				oldfire = hooks.empty.fire;
				hooks.empty.fire = function() {
					if ( !hooks.unqueued ) {
						oldfire();
					}
				};
			}
			hooks.unqueued++;

			anim.always( function() {

				// Ensure the complete handler is called before this completes
				anim.always( function() {
					hooks.unqueued--;
					if ( !jQuery.queue( elem, "fx" ).length ) {
						hooks.empty.fire();
					}
				} );
			} );
		}

		// Detect show/hide animations
		for ( prop in props ) {
			value = props[ prop ];
			if ( rfxtypes.test( value ) ) {
				delete props[ prop ];
				toggle = toggle || value === "toggle";
				if ( value === ( hidden ? "hide" : "show" ) ) {

					// Pretend to be hidden if this is a "show" and
					// there is still data from a stopped show/hide
					if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
						hidden = true;

					// Ignore all other no-op show/hide data
					} else {
						continue;
					}
				}
				orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
			}
		}

		// Bail out if this is a no-op like .hide().hide()
		propTween = !jQuery.isEmptyObject( props );
		if ( !propTween && jQuery.isEmptyObject( orig ) ) {
			return;
		}

		// Restrict "overflow" and "display" styles during box animations
		if ( isBox && elem.nodeType === 1 ) {

			// Support: IE <=9 - 11, Edge 12 - 15
			// Record all 3 overflow attributes because IE does not infer the shorthand
			// from identically-valued overflowX and overflowY and Edge just mirrors
			// the overflowX value there.
			opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

			// Identify a display type, preferring old show/hide data over the CSS cascade
			restoreDisplay = dataShow && dataShow.display;
			if ( restoreDisplay == null ) {
				restoreDisplay = dataPriv.get( elem, "display" );
			}
			display = jQuery.css( elem, "display" );
			if ( display === "none" ) {
				if ( restoreDisplay ) {
					display = restoreDisplay;
				} else {

					// Get nonempty value(s) by temporarily forcing visibility
					showHide( [ elem ], true );
					restoreDisplay = elem.style.display || restoreDisplay;
					display = jQuery.css( elem, "display" );
					showHide( [ elem ] );
				}
			}

			// Animate inline elements as inline-block
			if ( display === "inline" || display === "inline-block" && restoreDisplay != null ) {
				if ( jQuery.css( elem, "float" ) === "none" ) {

					// Restore the original display value at the end of pure show/hide animations
					if ( !propTween ) {
						anim.done( function() {
							style.display = restoreDisplay;
						} );
						if ( restoreDisplay == null ) {
							display = style.display;
							restoreDisplay = display === "none" ? "" : display;
						}
					}
					style.display = "inline-block";
				}
			}
		}

		if ( opts.overflow ) {
			style.overflow = "hidden";
			anim.always( function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			} );
		}

		// Implement show/hide animations
		propTween = false;
		for ( prop in orig ) {

			// General show/hide setup for this element animation
			if ( !propTween ) {
				if ( dataShow ) {
					if ( "hidden" in dataShow ) {
						hidden = dataShow.hidden;
					}
				} else {
					dataShow = dataPriv.access( elem, "fxshow", { display: restoreDisplay } );
				}

				// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
				if ( toggle ) {
					dataShow.hidden = !hidden;
				}

				// Show elements before animating them
				if ( hidden ) {
					showHide( [ elem ], true );
				}

				/* eslint-disable no-loop-func */

				anim.done( function() {

					/* eslint-enable no-loop-func */

					// The final step of a "hide" animation is actually hiding the element
					if ( !hidden ) {
						showHide( [ elem ] );
					}
					dataPriv.remove( elem, "fxshow" );
					for ( prop in orig ) {
						jQuery.style( elem, prop, orig[ prop ] );
					}
				} );
			}

			// Per-property setup
			propTween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = propTween.start;
				if ( hidden ) {
					propTween.end = propTween.start;
					propTween.start = 0;
				}
			}
		}
	}

	function propFilter( props, specialEasing ) {
		var index, name, easing, value, hooks;

		// camelCase, specialEasing and expand cssHook pass
		for ( index in props ) {
			name = camelCase( index );
			easing = specialEasing[ name ];
			value = props[ index ];
			if ( Array.isArray( value ) ) {
				easing = value[ 1 ];
				value = props[ index ] = value[ 0 ];
			}

			if ( index !== name ) {
				props[ name ] = value;
				delete props[ index ];
			}

			hooks = jQuery.cssHooks[ name ];
			if ( hooks && "expand" in hooks ) {
				value = hooks.expand( value );
				delete props[ name ];

				// Not quite $.extend, this won't overwrite existing keys.
				// Reusing 'index' because we have the correct "name"
				for ( index in value ) {
					if ( !( index in props ) ) {
						props[ index ] = value[ index ];
						specialEasing[ index ] = easing;
					}
				}
			} else {
				specialEasing[ name ] = easing;
			}
		}
	}

	function Animation( elem, properties, options ) {
		var result,
			stopped,
			index = 0,
			length = Animation.prefilters.length,
			deferred = jQuery.Deferred().always( function() {

				// Don't match elem in the :animated selector
				delete tick.elem;
			} ),
			tick = function() {
				if ( stopped ) {
					return false;
				}
				var currentTime = fxNow || createFxNow(),
					remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

					// Support: Android 2.3 only
					// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (trac-12497)
					temp = remaining / animation.duration || 0,
					percent = 1 - temp,
					index = 0,
					length = animation.tweens.length;

				for ( ; index < length; index++ ) {
					animation.tweens[ index ].run( percent );
				}

				deferred.notifyWith( elem, [ animation, percent, remaining ] );

				// If there's more to do, yield
				if ( percent < 1 && length ) {
					return remaining;
				}

				// If this was an empty animation, synthesize a final progress notification
				if ( !length ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
				}

				// Resolve the animation and report its conclusion
				deferred.resolveWith( elem, [ animation ] );
				return false;
			},
			animation = deferred.promise( {
				elem: elem,
				props: jQuery.extend( {}, properties ),
				opts: jQuery.extend( true, {
					specialEasing: {},
					easing: jQuery.easing._default
				}, options ),
				originalProperties: properties,
				originalOptions: options,
				startTime: fxNow || createFxNow(),
				duration: options.duration,
				tweens: [],
				createTween: function( prop, end ) {
					var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
					animation.tweens.push( tween );
					return tween;
				},
				stop: function( gotoEnd ) {
					var index = 0,

						// If we are going to the end, we want to run all the tweens
						// otherwise we skip this part
						length = gotoEnd ? animation.tweens.length : 0;
					if ( stopped ) {
						return this;
					}
					stopped = true;
					for ( ; index < length; index++ ) {
						animation.tweens[ index ].run( 1 );
					}

					// Resolve when we played the last frame; otherwise, reject
					if ( gotoEnd ) {
						deferred.notifyWith( elem, [ animation, 1, 0 ] );
						deferred.resolveWith( elem, [ animation, gotoEnd ] );
					} else {
						deferred.rejectWith( elem, [ animation, gotoEnd ] );
					}
					return this;
				}
			} ),
			props = animation.props;

		propFilter( props, animation.opts.specialEasing );

		for ( ; index < length; index++ ) {
			result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
			if ( result ) {
				if ( isFunction( result.stop ) ) {
					jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
						result.stop.bind( result );
				}
				return result;
			}
		}

		jQuery.map( props, createTween, animation );

		if ( isFunction( animation.opts.start ) ) {
			animation.opts.start.call( elem, animation );
		}

		// Attach callbacks from options
		animation
			.progress( animation.opts.progress )
			.done( animation.opts.done, animation.opts.complete )
			.fail( animation.opts.fail )
			.always( animation.opts.always );

		jQuery.fx.timer(
			jQuery.extend( tick, {
				elem: elem,
				anim: animation,
				queue: animation.opts.queue
			} )
		);

		return animation;
	}

	jQuery.Animation = jQuery.extend( Animation, {

		tweeners: {
			"*": [ function( prop, value ) {
				var tween = this.createTween( prop, value );
				adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
				return tween;
			} ]
		},

		tweener: function( props, callback ) {
			if ( isFunction( props ) ) {
				callback = props;
				props = [ "*" ];
			} else {
				props = props.match( rnothtmlwhite );
			}

			var prop,
				index = 0,
				length = props.length;

			for ( ; index < length; index++ ) {
				prop = props[ index ];
				Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
				Animation.tweeners[ prop ].unshift( callback );
			}
		},

		prefilters: [ defaultPrefilter ],

		prefilter: function( callback, prepend ) {
			if ( prepend ) {
				Animation.prefilters.unshift( callback );
			} else {
				Animation.prefilters.push( callback );
			}
		}
	} );

	jQuery.speed = function( speed, easing, fn ) {
		var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
			complete: fn || !fn && easing ||
				isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && !isFunction( easing ) && easing
		};

		// Go to the end state if fx are off
		if ( jQuery.fx.off ) {
			opt.duration = 0;

		} else {
			if ( typeof opt.duration !== "number" ) {
				if ( opt.duration in jQuery.fx.speeds ) {
					opt.duration = jQuery.fx.speeds[ opt.duration ];

				} else {
					opt.duration = jQuery.fx.speeds._default;
				}
			}
		}

		// Normalize opt.queue - true/undefined/null -> "fx"
		if ( opt.queue == null || opt.queue === true ) {
			opt.queue = "fx";
		}

		// Queueing
		opt.old = opt.complete;

		opt.complete = function() {
			if ( isFunction( opt.old ) ) {
				opt.old.call( this );
			}

			if ( opt.queue ) {
				jQuery.dequeue( this, opt.queue );
			}
		};

		return opt;
	};

	jQuery.fn.extend( {
		fadeTo: function( speed, to, easing, callback ) {

			// Show any hidden elements after setting opacity to 0
			return this.filter( isHiddenWithinTree ).css( "opacity", 0 ).show()

				// Animate to the value specified
				.end().animate( { opacity: to }, speed, easing, callback );
		},
		animate: function( prop, speed, easing, callback ) {
			var empty = jQuery.isEmptyObject( prop ),
				optall = jQuery.speed( speed, easing, callback ),
				doAnimation = function() {

					// Operate on a copy of prop so per-property easing won't be lost
					var anim = Animation( this, jQuery.extend( {}, prop ), optall );

					// Empty animations, or finishing resolves immediately
					if ( empty || dataPriv.get( this, "finish" ) ) {
						anim.stop( true );
					}
				};

			doAnimation.finish = doAnimation;

			return empty || optall.queue === false ?
				this.each( doAnimation ) :
				this.queue( optall.queue, doAnimation );
		},
		stop: function( type, clearQueue, gotoEnd ) {
			var stopQueue = function( hooks ) {
				var stop = hooks.stop;
				delete hooks.stop;
				stop( gotoEnd );
			};

			if ( typeof type !== "string" ) {
				gotoEnd = clearQueue;
				clearQueue = type;
				type = undefined;
			}
			if ( clearQueue ) {
				this.queue( type || "fx", [] );
			}

			return this.each( function() {
				var dequeue = true,
					index = type != null && type + "queueHooks",
					timers = jQuery.timers,
					data = dataPriv.get( this );

				if ( index ) {
					if ( data[ index ] && data[ index ].stop ) {
						stopQueue( data[ index ] );
					}
				} else {
					for ( index in data ) {
						if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
							stopQueue( data[ index ] );
						}
					}
				}

				for ( index = timers.length; index--; ) {
					if ( timers[ index ].elem === this &&
						( type == null || timers[ index ].queue === type ) ) {

						timers[ index ].anim.stop( gotoEnd );
						dequeue = false;
						timers.splice( index, 1 );
					}
				}

				// Start the next in the queue if the last step wasn't forced.
				// Timers currently will call their complete callbacks, which
				// will dequeue but only if they were gotoEnd.
				if ( dequeue || !gotoEnd ) {
					jQuery.dequeue( this, type );
				}
			} );
		},
		finish: function( type ) {
			if ( type !== false ) {
				type = type || "fx";
			}
			return this.each( function() {
				var index,
					data = dataPriv.get( this ),
					queue = data[ type + "queue" ],
					hooks = data[ type + "queueHooks" ],
					timers = jQuery.timers,
					length = queue ? queue.length : 0;

				// Enable finishing flag on private data
				data.finish = true;

				// Empty the queue first
				jQuery.queue( this, type, [] );

				if ( hooks && hooks.stop ) {
					hooks.stop.call( this, true );
				}

				// Look for any active animations, and finish them
				for ( index = timers.length; index--; ) {
					if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
						timers[ index ].anim.stop( true );
						timers.splice( index, 1 );
					}
				}

				// Look for any animations in the old queue and finish them
				for ( index = 0; index < length; index++ ) {
					if ( queue[ index ] && queue[ index ].finish ) {
						queue[ index ].finish.call( this );
					}
				}

				// Turn off finishing flag
				delete data.finish;
			} );
		}
	} );

	jQuery.each( [ "toggle", "show", "hide" ], function( _i, name ) {
		var cssFn = jQuery.fn[ name ];
		jQuery.fn[ name ] = function( speed, easing, callback ) {
			return speed == null || typeof speed === "boolean" ?
				cssFn.apply( this, arguments ) :
				this.animate( genFx( name, true ), speed, easing, callback );
		};
	} );

	// Generate shortcuts for custom animations
	jQuery.each( {
		slideDown: genFx( "show" ),
		slideUp: genFx( "hide" ),
		slideToggle: genFx( "toggle" ),
		fadeIn: { opacity: "show" },
		fadeOut: { opacity: "hide" },
		fadeToggle: { opacity: "toggle" }
	}, function( name, props ) {
		jQuery.fn[ name ] = function( speed, easing, callback ) {
			return this.animate( props, speed, easing, callback );
		};
	} );

	jQuery.timers = [];
	jQuery.fx.tick = function() {
		var timer,
			i = 0,
			timers = jQuery.timers;

		fxNow = Date.now();

		for ( ; i < timers.length; i++ ) {
			timer = timers[ i ];

			// Run the timer and safely remove it when done (allowing for external removal)
			if ( !timer() && timers[ i ] === timer ) {
				timers.splice( i--, 1 );
			}
		}

		if ( !timers.length ) {
			jQuery.fx.stop();
		}
		fxNow = undefined;
	};

	jQuery.fx.timer = function( timer ) {
		jQuery.timers.push( timer );
		jQuery.fx.start();
	};

	jQuery.fx.interval = 13;
	jQuery.fx.start = function() {
		if ( inProgress ) {
			return;
		}

		inProgress = true;
		schedule();
	};

	jQuery.fx.stop = function() {
		inProgress = null;
	};

	jQuery.fx.speeds = {
		slow: 600,
		fast: 200,

		// Default speed
		_default: 400
	};


	// Based off of the plugin by Clint Helfers, with permission.
	jQuery.fn.delay = function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = window.setTimeout( next, time );
			hooks.stop = function() {
				window.clearTimeout( timeout );
			};
		} );
	};


	( function() {
		var input = document.createElement( "input" ),
			select = document.createElement( "select" ),
			opt = select.appendChild( document.createElement( "option" ) );

		input.type = "checkbox";

		// Support: Android <=4.3 only
		// Default value for a checkbox should be "on"
		support.checkOn = input.value !== "";

		// Support: IE <=11 only
		// Must access selectedIndex to make default options select
		support.optSelected = opt.selected;

		// Support: IE <=11 only
		// An input loses its value after becoming a radio
		input = document.createElement( "input" );
		input.value = "t";
		input.type = "radio";
		support.radioValue = input.value === "t";
	} )();


	var boolHook,
		attrHandle = jQuery.expr.attrHandle;

	jQuery.fn.extend( {
		attr: function( name, value ) {
			return access( this, jQuery.attr, name, value, arguments.length > 1 );
		},

		removeAttr: function( name ) {
			return this.each( function() {
				jQuery.removeAttr( this, name );
			} );
		}
	} );

	jQuery.extend( {
		attr: function( elem, name, value ) {
			var ret, hooks,
				nType = elem.nodeType;

			// Don't get/set attributes on text, comment and attribute nodes
			if ( nType === 3 || nType === 8 || nType === 2 ) {
				return;
			}

			// Fallback to prop when attributes are not supported
			if ( typeof elem.getAttribute === "undefined" ) {
				return jQuery.prop( elem, name, value );
			}

			// Attribute hooks are determined by the lowercase version
			// Grab necessary hook if one is defined
			if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
				hooks = jQuery.attrHooks[ name.toLowerCase() ] ||
					( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
			}

			if ( value !== undefined ) {
				if ( value === null ) {
					jQuery.removeAttr( elem, name );
					return;
				}

				if ( hooks && "set" in hooks &&
					( ret = hooks.set( elem, value, name ) ) !== undefined ) {
					return ret;
				}

				elem.setAttribute( name, value + "" );
				return value;
			}

			if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
				return ret;
			}

			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ? undefined : ret;
		},

		attrHooks: {
			type: {
				set: function( elem, value ) {
					if ( !support.radioValue && value === "radio" &&
						nodeName( elem, "input" ) ) {
						var val = elem.value;
						elem.setAttribute( "type", value );
						if ( val ) {
							elem.value = val;
						}
						return value;
					}
				}
			}
		},

		removeAttr: function( elem, value ) {
			var name,
				i = 0,

				// Attribute names can contain non-HTML whitespace characters
				// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
				attrNames = value && value.match( rnothtmlwhite );

			if ( attrNames && elem.nodeType === 1 ) {
				while ( ( name = attrNames[ i++ ] ) ) {
					elem.removeAttribute( name );
				}
			}
		}
	} );

	// Hooks for boolean attributes
	boolHook = {
		set: function( elem, value, name ) {
			if ( value === false ) {

				// Remove boolean attributes when set to false
				jQuery.removeAttr( elem, name );
			} else {
				elem.setAttribute( name, name );
			}
			return name;
		}
	};

	jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( _i, name ) {
		var getter = attrHandle[ name ] || jQuery.find.attr;

		attrHandle[ name ] = function( elem, name, isXML ) {
			var ret, handle,
				lowercaseName = name.toLowerCase();

			if ( !isXML ) {

				// Avoid an infinite loop by temporarily removing this function from the getter
				handle = attrHandle[ lowercaseName ];
				attrHandle[ lowercaseName ] = ret;
				ret = getter( elem, name, isXML ) != null ?
					lowercaseName :
					null;
				attrHandle[ lowercaseName ] = handle;
			}
			return ret;
		};
	} );




	var rfocusable = /^(?:input|select|textarea|button)$/i,
		rclickable = /^(?:a|area)$/i;

	jQuery.fn.extend( {
		prop: function( name, value ) {
			return access( this, jQuery.prop, name, value, arguments.length > 1 );
		},

		removeProp: function( name ) {
			return this.each( function() {
				delete this[ jQuery.propFix[ name ] || name ];
			} );
		}
	} );

	jQuery.extend( {
		prop: function( elem, name, value ) {
			var ret, hooks,
				nType = elem.nodeType;

			// Don't get/set properties on text, comment and attribute nodes
			if ( nType === 3 || nType === 8 || nType === 2 ) {
				return;
			}

			if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

				// Fix name and attach hooks
				name = jQuery.propFix[ name ] || name;
				hooks = jQuery.propHooks[ name ];
			}

			if ( value !== undefined ) {
				if ( hooks && "set" in hooks &&
					( ret = hooks.set( elem, value, name ) ) !== undefined ) {
					return ret;
				}

				return ( elem[ name ] = value );
			}

			if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
				return ret;
			}

			return elem[ name ];
		},

		propHooks: {
			tabIndex: {
				get: function( elem ) {

					// Support: IE <=9 - 11 only
					// elem.tabIndex doesn't always return the
					// correct value when it hasn't been explicitly set
					// Use proper attribute retrieval (trac-12072)
					var tabindex = jQuery.find.attr( elem, "tabindex" );

					if ( tabindex ) {
						return parseInt( tabindex, 10 );
					}

					if (
						rfocusable.test( elem.nodeName ) ||
						rclickable.test( elem.nodeName ) &&
						elem.href
					) {
						return 0;
					}

					return -1;
				}
			}
		},

		propFix: {
			"for": "htmlFor",
			"class": "className"
		}
	} );

	// Support: IE <=11 only
	// Accessing the selectedIndex property
	// forces the browser to respect setting selected
	// on the option
	// The getter ensures a default option is selected
	// when in an optgroup
	// eslint rule "no-unused-expressions" is disabled for this code
	// since it considers such accessions noop
	if ( !support.optSelected ) {
		jQuery.propHooks.selected = {
			get: function( elem ) {

				/* eslint no-unused-expressions: "off" */

				var parent = elem.parentNode;
				if ( parent && parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
				return null;
			},
			set: function( elem ) {

				/* eslint no-unused-expressions: "off" */

				var parent = elem.parentNode;
				if ( parent ) {
					parent.selectedIndex;

					if ( parent.parentNode ) {
						parent.parentNode.selectedIndex;
					}
				}
			}
		};
	}

	jQuery.each( [
		"tabIndex",
		"readOnly",
		"maxLength",
		"cellSpacing",
		"cellPadding",
		"rowSpan",
		"colSpan",
		"useMap",
		"frameBorder",
		"contentEditable"
	], function() {
		jQuery.propFix[ this.toLowerCase() ] = this;
	} );




		// Strip and collapse whitespace according to HTML spec
		// https://infra.spec.whatwg.org/#strip-and-collapse-ascii-whitespace
		function stripAndCollapse( value ) {
			var tokens = value.match( rnothtmlwhite ) || [];
			return tokens.join( " " );
		}


	function getClass( elem ) {
		return elem.getAttribute && elem.getAttribute( "class" ) || "";
	}

	function classesToArray( value ) {
		if ( Array.isArray( value ) ) {
			return value;
		}
		if ( typeof value === "string" ) {
			return value.match( rnothtmlwhite ) || [];
		}
		return [];
	}

	jQuery.fn.extend( {
		addClass: function( value ) {
			var classNames, cur, curValue, className, i, finalValue;

			if ( isFunction( value ) ) {
				return this.each( function( j ) {
					jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
				} );
			}

			classNames = classesToArray( value );

			if ( classNames.length ) {
				return this.each( function() {
					curValue = getClass( this );
					cur = this.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

					if ( cur ) {
						for ( i = 0; i < classNames.length; i++ ) {
							className = classNames[ i ];
							if ( cur.indexOf( " " + className + " " ) < 0 ) {
								cur += className + " ";
							}
						}

						// Only assign if different to avoid unneeded rendering.
						finalValue = stripAndCollapse( cur );
						if ( curValue !== finalValue ) {
							this.setAttribute( "class", finalValue );
						}
					}
				} );
			}

			return this;
		},

		removeClass: function( value ) {
			var classNames, cur, curValue, className, i, finalValue;

			if ( isFunction( value ) ) {
				return this.each( function( j ) {
					jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
				} );
			}

			if ( !arguments.length ) {
				return this.attr( "class", "" );
			}

			classNames = classesToArray( value );

			if ( classNames.length ) {
				return this.each( function() {
					curValue = getClass( this );

					// This expression is here for better compressibility (see addClass)
					cur = this.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

					if ( cur ) {
						for ( i = 0; i < classNames.length; i++ ) {
							className = classNames[ i ];

							// Remove *all* instances
							while ( cur.indexOf( " " + className + " " ) > -1 ) {
								cur = cur.replace( " " + className + " ", " " );
							}
						}

						// Only assign if different to avoid unneeded rendering.
						finalValue = stripAndCollapse( cur );
						if ( curValue !== finalValue ) {
							this.setAttribute( "class", finalValue );
						}
					}
				} );
			}

			return this;
		},

		toggleClass: function( value, stateVal ) {
			var classNames, className, i, self,
				type = typeof value,
				isValidValue = type === "string" || Array.isArray( value );

			if ( isFunction( value ) ) {
				return this.each( function( i ) {
					jQuery( this ).toggleClass(
						value.call( this, i, getClass( this ), stateVal ),
						stateVal
					);
				} );
			}

			if ( typeof stateVal === "boolean" && isValidValue ) {
				return stateVal ? this.addClass( value ) : this.removeClass( value );
			}

			classNames = classesToArray( value );

			return this.each( function() {
				if ( isValidValue ) {

					// Toggle individual class names
					self = jQuery( this );

					for ( i = 0; i < classNames.length; i++ ) {
						className = classNames[ i ];

						// Check each className given, space separated list
						if ( self.hasClass( className ) ) {
							self.removeClass( className );
						} else {
							self.addClass( className );
						}
					}

				// Toggle whole class name
				} else if ( value === undefined || type === "boolean" ) {
					className = getClass( this );
					if ( className ) {

						// Store className if set
						dataPriv.set( this, "__className__", className );
					}

					// If the element has a class name or if we're passed `false`,
					// then remove the whole classname (if there was one, the above saved it).
					// Otherwise bring back whatever was previously saved (if anything),
					// falling back to the empty string if nothing was stored.
					if ( this.setAttribute ) {
						this.setAttribute( "class",
							className || value === false ?
								"" :
								dataPriv.get( this, "__className__" ) || ""
						);
					}
				}
			} );
		},

		hasClass: function( selector ) {
			var className, elem,
				i = 0;

			className = " " + selector + " ";
			while ( ( elem = this[ i++ ] ) ) {
				if ( elem.nodeType === 1 &&
					( " " + stripAndCollapse( getClass( elem ) ) + " " ).indexOf( className ) > -1 ) {
					return true;
				}
			}

			return false;
		}
	} );




	var rreturn = /\r/g;

	jQuery.fn.extend( {
		val: function( value ) {
			var hooks, ret, valueIsFunction,
				elem = this[ 0 ];

			if ( !arguments.length ) {
				if ( elem ) {
					hooks = jQuery.valHooks[ elem.type ] ||
						jQuery.valHooks[ elem.nodeName.toLowerCase() ];

					if ( hooks &&
						"get" in hooks &&
						( ret = hooks.get( elem, "value" ) ) !== undefined
					) {
						return ret;
					}

					ret = elem.value;

					// Handle most common string cases
					if ( typeof ret === "string" ) {
						return ret.replace( rreturn, "" );
					}

					// Handle cases where value is null/undef or number
					return ret == null ? "" : ret;
				}

				return;
			}

			valueIsFunction = isFunction( value );

			return this.each( function( i ) {
				var val;

				if ( this.nodeType !== 1 ) {
					return;
				}

				if ( valueIsFunction ) {
					val = value.call( this, i, jQuery( this ).val() );
				} else {
					val = value;
				}

				// Treat null/undefined as ""; convert numbers to string
				if ( val == null ) {
					val = "";

				} else if ( typeof val === "number" ) {
					val += "";

				} else if ( Array.isArray( val ) ) {
					val = jQuery.map( val, function( value ) {
						return value == null ? "" : value + "";
					} );
				}

				hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

				// If set returns undefined, fall back to normal setting
				if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
					this.value = val;
				}
			} );
		}
	} );

	jQuery.extend( {
		valHooks: {
			option: {
				get: function( elem ) {

					var val = jQuery.find.attr( elem, "value" );
					return val != null ?
						val :

						// Support: IE <=10 - 11 only
						// option.text throws exceptions (trac-14686, trac-14858)
						// Strip and collapse whitespace
						// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
						stripAndCollapse( jQuery.text( elem ) );
				}
			},
			select: {
				get: function( elem ) {
					var value, option, i,
						options = elem.options,
						index = elem.selectedIndex,
						one = elem.type === "select-one",
						values = one ? null : [],
						max = one ? index + 1 : options.length;

					if ( index < 0 ) {
						i = max;

					} else {
						i = one ? index : 0;
					}

					// Loop through all the selected options
					for ( ; i < max; i++ ) {
						option = options[ i ];

						// Support: IE <=9 only
						// IE8-9 doesn't update selected after form reset (trac-2551)
						if ( ( option.selected || i === index ) &&

								// Don't return options that are disabled or in a disabled optgroup
								!option.disabled &&
								( !option.parentNode.disabled ||
									!nodeName( option.parentNode, "optgroup" ) ) ) {

							// Get the specific value for the option
							value = jQuery( option ).val();

							// We don't need an array for one selects
							if ( one ) {
								return value;
							}

							// Multi-Selects return an array
							values.push( value );
						}
					}

					return values;
				},

				set: function( elem, value ) {
					var optionSet, option,
						options = elem.options,
						values = jQuery.makeArray( value ),
						i = options.length;

					while ( i-- ) {
						option = options[ i ];

						/* eslint-disable no-cond-assign */

						if ( option.selected =
							jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
						) {
							optionSet = true;
						}

						/* eslint-enable no-cond-assign */
					}

					// Force browsers to behave consistently when non-matching value is set
					if ( !optionSet ) {
						elem.selectedIndex = -1;
					}
					return values;
				}
			}
		}
	} );

	// Radios and checkboxes getter/setter
	jQuery.each( [ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			set: function( elem, value ) {
				if ( Array.isArray( value ) ) {
					return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
				}
			}
		};
		if ( !support.checkOn ) {
			jQuery.valHooks[ this ].get = function( elem ) {
				return elem.getAttribute( "value" ) === null ? "on" : elem.value;
			};
		}
	} );




	// Return jQuery for attributes-only inclusion
	var location = window.location;

	var nonce = { guid: Date.now() };

	var rquery = ( /\?/ );



	// Cross-browser xml parsing
	jQuery.parseXML = function( data ) {
		var xml, parserErrorElem;
		if ( !data || typeof data !== "string" ) {
			return null;
		}

		// Support: IE 9 - 11 only
		// IE throws on parseFromString with invalid input.
		try {
			xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
		} catch ( e ) {}

		parserErrorElem = xml && xml.getElementsByTagName( "parsererror" )[ 0 ];
		if ( !xml || parserErrorElem ) {
			jQuery.error( "Invalid XML: " + (
				parserErrorElem ?
					jQuery.map( parserErrorElem.childNodes, function( el ) {
						return el.textContent;
					} ).join( "\n" ) :
					data
			) );
		}
		return xml;
	};


	var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
		stopPropagationCallback = function( e ) {
			e.stopPropagation();
		};

	jQuery.extend( jQuery.event, {

		trigger: function( event, data, elem, onlyHandlers ) {

			var i, cur, tmp, bubbleType, ontype, handle, special, lastElement,
				eventPath = [ elem || document ],
				type = hasOwn.call( event, "type" ) ? event.type : event,
				namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

			cur = lastElement = tmp = elem = elem || document;

			// Don't do events on text and comment nodes
			if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
				return;
			}

			// focus/blur morphs to focusin/out; ensure we're not firing them right now
			if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
				return;
			}

			if ( type.indexOf( "." ) > -1 ) {

				// Namespaced trigger; create a regexp to match event type in handle()
				namespaces = type.split( "." );
				type = namespaces.shift();
				namespaces.sort();
			}
			ontype = type.indexOf( ":" ) < 0 && "on" + type;

			// Caller can pass in a jQuery.Event object, Object, or just an event type string
			event = event[ jQuery.expando ] ?
				event :
				new jQuery.Event( type, typeof event === "object" && event );

			// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
			event.isTrigger = onlyHandlers ? 2 : 3;
			event.namespace = namespaces.join( "." );
			event.rnamespace = event.namespace ?
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
				null;

			// Clean up the event in case it is being reused
			event.result = undefined;
			if ( !event.target ) {
				event.target = elem;
			}

			// Clone any incoming data and prepend the event, creating the handler arg list
			data = data == null ?
				[ event ] :
				jQuery.makeArray( data, [ event ] );

			// Allow special events to draw outside the lines
			special = jQuery.event.special[ type ] || {};
			if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
				return;
			}

			// Determine event propagation path in advance, per W3C events spec (trac-9951)
			// Bubble up to document, then to window; watch for a global ownerDocument var (trac-9724)
			if ( !onlyHandlers && !special.noBubble && !isWindow( elem ) ) {

				bubbleType = special.delegateType || type;
				if ( !rfocusMorph.test( bubbleType + type ) ) {
					cur = cur.parentNode;
				}
				for ( ; cur; cur = cur.parentNode ) {
					eventPath.push( cur );
					tmp = cur;
				}

				// Only add window if we got to document (e.g., not plain obj or detached DOM)
				if ( tmp === ( elem.ownerDocument || document ) ) {
					eventPath.push( tmp.defaultView || tmp.parentWindow || window );
				}
			}

			// Fire handlers on the event path
			i = 0;
			while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {
				lastElement = cur;
				event.type = i > 1 ?
					bubbleType :
					special.bindType || type;

				// jQuery handler
				handle = ( dataPriv.get( cur, "events" ) || Object.create( null ) )[ event.type ] &&
					dataPriv.get( cur, "handle" );
				if ( handle ) {
					handle.apply( cur, data );
				}

				// Native handler
				handle = ontype && cur[ ontype ];
				if ( handle && handle.apply && acceptData( cur ) ) {
					event.result = handle.apply( cur, data );
					if ( event.result === false ) {
						event.preventDefault();
					}
				}
			}
			event.type = type;

			// If nobody prevented the default action, do it now
			if ( !onlyHandlers && !event.isDefaultPrevented() ) {

				if ( ( !special._default ||
					special._default.apply( eventPath.pop(), data ) === false ) &&
					acceptData( elem ) ) {

					// Call a native DOM method on the target with the same name as the event.
					// Don't do default actions on window, that's where global variables be (trac-6170)
					if ( ontype && isFunction( elem[ type ] ) && !isWindow( elem ) ) {

						// Don't re-trigger an onFOO event when we call its FOO() method
						tmp = elem[ ontype ];

						if ( tmp ) {
							elem[ ontype ] = null;
						}

						// Prevent re-triggering of the same event, since we already bubbled it above
						jQuery.event.triggered = type;

						if ( event.isPropagationStopped() ) {
							lastElement.addEventListener( type, stopPropagationCallback );
						}

						elem[ type ]();

						if ( event.isPropagationStopped() ) {
							lastElement.removeEventListener( type, stopPropagationCallback );
						}

						jQuery.event.triggered = undefined;

						if ( tmp ) {
							elem[ ontype ] = tmp;
						}
					}
				}
			}

			return event.result;
		},

		// Piggyback on a donor event to simulate a different one
		// Used only for `focus(in | out)` events
		simulate: function( type, elem, event ) {
			var e = jQuery.extend(
				new jQuery.Event(),
				event,
				{
					type: type,
					isSimulated: true
				}
			);

			jQuery.event.trigger( e, null, elem );
		}

	} );

	jQuery.fn.extend( {

		trigger: function( type, data ) {
			return this.each( function() {
				jQuery.event.trigger( type, data, this );
			} );
		},
		triggerHandler: function( type, data ) {
			var elem = this[ 0 ];
			if ( elem ) {
				return jQuery.event.trigger( type, data, elem, true );
			}
		}
	} );


	var
		rbracket = /\[\]$/,
		rCRLF = /\r?\n/g,
		rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
		rsubmittable = /^(?:input|select|textarea|keygen)/i;

	function buildParams( prefix, obj, traditional, add ) {
		var name;

		if ( Array.isArray( obj ) ) {

			// Serialize array item.
			jQuery.each( obj, function( i, v ) {
				if ( traditional || rbracket.test( prefix ) ) {

					// Treat each array item as a scalar.
					add( prefix, v );

				} else {

					// Item is non-scalar (array or object), encode its numeric index.
					buildParams(
						prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
						v,
						traditional,
						add
					);
				}
			} );

		} else if ( !traditional && toType( obj ) === "object" ) {

			// Serialize object item.
			for ( name in obj ) {
				buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
			}

		} else {

			// Serialize scalar item.
			add( prefix, obj );
		}
	}

	// Serialize an array of form elements or a set of
	// key/values into a query string
	jQuery.param = function( a, traditional ) {
		var prefix,
			s = [],
			add = function( key, valueOrFunction ) {

				// If value is a function, invoke it and use its return value
				var value = isFunction( valueOrFunction ) ?
					valueOrFunction() :
					valueOrFunction;

				s[ s.length ] = encodeURIComponent( key ) + "=" +
					encodeURIComponent( value == null ? "" : value );
			};

		if ( a == null ) {
			return "";
		}

		// If an array was passed in, assume that it is an array of form elements.
		if ( Array.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

			// Serialize the form elements
			jQuery.each( a, function() {
				add( this.name, this.value );
			} );

		} else {

			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for ( prefix in a ) {
				buildParams( prefix, a[ prefix ], traditional, add );
			}
		}

		// Return the resulting serialization
		return s.join( "&" );
	};

	jQuery.fn.extend( {
		serialize: function() {
			return jQuery.param( this.serializeArray() );
		},
		serializeArray: function() {
			return this.map( function() {

				// Can add propHook for "elements" to filter or add form elements
				var elements = jQuery.prop( this, "elements" );
				return elements ? jQuery.makeArray( elements ) : this;
			} ).filter( function() {
				var type = this.type;

				// Use .is( ":disabled" ) so that fieldset[disabled] works
				return this.name && !jQuery( this ).is( ":disabled" ) &&
					rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
					( this.checked || !rcheckableType.test( type ) );
			} ).map( function( _i, elem ) {
				var val = jQuery( this ).val();

				if ( val == null ) {
					return null;
				}

				if ( Array.isArray( val ) ) {
					return jQuery.map( val, function( val ) {
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					} );
				}

				return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
			} ).get();
		}
	} );


	var
		r20 = /%20/g,
		rhash = /#.*$/,
		rantiCache = /([?&])_=[^&]*/,
		rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

		// trac-7653, trac-8125, trac-8152: local protocol detection
		rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
		rnoContent = /^(?:GET|HEAD)$/,
		rprotocol = /^\/\//,

		/* Prefilters
		 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
		 * 2) These are called:
		 *    - BEFORE asking for a transport
		 *    - AFTER param serialization (s.data is a string if s.processData is true)
		 * 3) key is the dataType
		 * 4) the catchall symbol "*" can be used
		 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
		 */
		prefilters = {},

		/* Transports bindings
		 * 1) key is the dataType
		 * 2) the catchall symbol "*" can be used
		 * 3) selection will start with transport dataType and THEN go to "*" if needed
		 */
		transports = {},

		// Avoid comment-prolog char sequence (trac-10098); must appease lint and evade compression
		allTypes = "*/".concat( "*" ),

		// Anchor tag for parsing the document origin
		originAnchor = document.createElement( "a" );

	originAnchor.href = location.href;

	// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
	function addToPrefiltersOrTransports( structure ) {

		// dataTypeExpression is optional and defaults to "*"
		return function( dataTypeExpression, func ) {

			if ( typeof dataTypeExpression !== "string" ) {
				func = dataTypeExpression;
				dataTypeExpression = "*";
			}

			var dataType,
				i = 0,
				dataTypes = dataTypeExpression.toLowerCase().match( rnothtmlwhite ) || [];

			if ( isFunction( func ) ) {

				// For each dataType in the dataTypeExpression
				while ( ( dataType = dataTypes[ i++ ] ) ) {

					// Prepend if requested
					if ( dataType[ 0 ] === "+" ) {
						dataType = dataType.slice( 1 ) || "*";
						( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

					// Otherwise append
					} else {
						( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
					}
				}
			}
		};
	}

	// Base inspection function for prefilters and transports
	function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

		var inspected = {},
			seekingTransport = ( structure === transports );

		function inspect( dataType ) {
			var selected;
			inspected[ dataType ] = true;
			jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
				var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
				if ( typeof dataTypeOrTransport === "string" &&
					!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

					options.dataTypes.unshift( dataTypeOrTransport );
					inspect( dataTypeOrTransport );
					return false;
				} else if ( seekingTransport ) {
					return !( selected = dataTypeOrTransport );
				}
			} );
			return selected;
		}

		return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
	}

	// A special extend for ajax options
	// that takes "flat" options (not to be deep extended)
	// Fixes trac-9887
	function ajaxExtend( target, src ) {
		var key, deep,
			flatOptions = jQuery.ajaxSettings.flatOptions || {};

		for ( key in src ) {
			if ( src[ key ] !== undefined ) {
				( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
			}
		}
		if ( deep ) {
			jQuery.extend( true, target, deep );
		}

		return target;
	}

	/* Handles responses to an ajax request:
	 * - finds the right dataType (mediates between content-type and expected dataType)
	 * - returns the corresponding response
	 */
	function ajaxHandleResponses( s, jqXHR, responses ) {

		var ct, type, finalDataType, firstDataType,
			contents = s.contents,
			dataTypes = s.dataTypes;

		// Remove auto dataType and get content-type in the process
		while ( dataTypes[ 0 ] === "*" ) {
			dataTypes.shift();
			if ( ct === undefined ) {
				ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
			}
		}

		// Check if we're dealing with a known content-type
		if ( ct ) {
			for ( type in contents ) {
				if ( contents[ type ] && contents[ type ].test( ct ) ) {
					dataTypes.unshift( type );
					break;
				}
			}
		}

		// Check to see if we have a response for the expected dataType
		if ( dataTypes[ 0 ] in responses ) {
			finalDataType = dataTypes[ 0 ];
		} else {

			// Try convertible dataTypes
			for ( type in responses ) {
				if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
					finalDataType = type;
					break;
				}
				if ( !firstDataType ) {
					firstDataType = type;
				}
			}

			// Or just use first one
			finalDataType = finalDataType || firstDataType;
		}

		// If we found a dataType
		// We add the dataType to the list if needed
		// and return the corresponding response
		if ( finalDataType ) {
			if ( finalDataType !== dataTypes[ 0 ] ) {
				dataTypes.unshift( finalDataType );
			}
			return responses[ finalDataType ];
		}
	}

	/* Chain conversions given the request and the original response
	 * Also sets the responseXXX fields on the jqXHR instance
	 */
	function ajaxConvert( s, response, jqXHR, isSuccess ) {
		var conv2, current, conv, tmp, prev,
			converters = {},

			// Work with a copy of dataTypes in case we need to modify it for conversion
			dataTypes = s.dataTypes.slice();

		// Create converters map with lowercased keys
		if ( dataTypes[ 1 ] ) {
			for ( conv in s.converters ) {
				converters[ conv.toLowerCase() ] = s.converters[ conv ];
			}
		}

		current = dataTypes.shift();

		// Convert to each sequential dataType
		while ( current ) {

			if ( s.responseFields[ current ] ) {
				jqXHR[ s.responseFields[ current ] ] = response;
			}

			// Apply the dataFilter if provided
			if ( !prev && isSuccess && s.dataFilter ) {
				response = s.dataFilter( response, s.dataType );
			}

			prev = current;
			current = dataTypes.shift();

			if ( current ) {

				// There's only work to do if current dataType is non-auto
				if ( current === "*" ) {

					current = prev;

				// Convert response if prev dataType is non-auto and differs from current
				} else if ( prev !== "*" && prev !== current ) {

					// Seek a direct converter
					conv = converters[ prev + " " + current ] || converters[ "* " + current ];

					// If none found, seek a pair
					if ( !conv ) {
						for ( conv2 in converters ) {

							// If conv2 outputs current
							tmp = conv2.split( " " );
							if ( tmp[ 1 ] === current ) {

								// If prev can be converted to accepted input
								conv = converters[ prev + " " + tmp[ 0 ] ] ||
									converters[ "* " + tmp[ 0 ] ];
								if ( conv ) {

									// Condense equivalence converters
									if ( conv === true ) {
										conv = converters[ conv2 ];

									// Otherwise, insert the intermediate dataType
									} else if ( converters[ conv2 ] !== true ) {
										current = tmp[ 0 ];
										dataTypes.unshift( tmp[ 1 ] );
									}
									break;
								}
							}
						}
					}

					// Apply converter (if not an equivalence)
					if ( conv !== true ) {

						// Unless errors are allowed to bubble, catch and return them
						if ( conv && s.throws ) {
							response = conv( response );
						} else {
							try {
								response = conv( response );
							} catch ( e ) {
								return {
									state: "parsererror",
									error: conv ? e : "No conversion from " + prev + " to " + current
								};
							}
						}
					}
				}
			}
		}

		return { state: "success", data: response };
	}

	jQuery.extend( {

		// Counter for holding the number of active queries
		active: 0,

		// Last-Modified header cache for next request
		lastModified: {},
		etag: {},

		ajaxSettings: {
			url: location.href,
			type: "GET",
			isLocal: rlocalProtocol.test( location.protocol ),
			global: true,
			processData: true,
			async: true,
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",

			/*
			timeout: 0,
			data: null,
			dataType: null,
			username: null,
			password: null,
			cache: null,
			throws: false,
			traditional: false,
			headers: {},
			*/

			accepts: {
				"*": allTypes,
				text: "text/plain",
				html: "text/html",
				xml: "application/xml, text/xml",
				json: "application/json, text/javascript"
			},

			contents: {
				xml: /\bxml\b/,
				html: /\bhtml/,
				json: /\bjson\b/
			},

			responseFields: {
				xml: "responseXML",
				text: "responseText",
				json: "responseJSON"
			},

			// Data converters
			// Keys separate source (or catchall "*") and destination types with a single space
			converters: {

				// Convert anything to text
				"* text": String,

				// Text to html (true = no transformation)
				"text html": true,

				// Evaluate text as a json expression
				"text json": JSON.parse,

				// Parse text as xml
				"text xml": jQuery.parseXML
			},

			// For options that shouldn't be deep extended:
			// you can add your own custom options here if
			// and when you create one that shouldn't be
			// deep extended (see ajaxExtend)
			flatOptions: {
				url: true,
				context: true
			}
		},

		// Creates a full fledged settings object into target
		// with both ajaxSettings and settings fields.
		// If target is omitted, writes into ajaxSettings.
		ajaxSetup: function( target, settings ) {
			return settings ?

				// Building a settings object
				ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

				// Extending ajaxSettings
				ajaxExtend( jQuery.ajaxSettings, target );
		},

		ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
		ajaxTransport: addToPrefiltersOrTransports( transports ),

		// Main method
		ajax: function( url, options ) {

			// If url is an object, simulate pre-1.5 signature
			if ( typeof url === "object" ) {
				options = url;
				url = undefined;
			}

			// Force options to be an object
			options = options || {};

			var transport,

				// URL without anti-cache param
				cacheURL,

				// Response headers
				responseHeadersString,
				responseHeaders,

				// timeout handle
				timeoutTimer,

				// Url cleanup var
				urlAnchor,

				// Request state (becomes false upon send and true upon completion)
				completed,

				// To know if global events are to be dispatched
				fireGlobals,

				// Loop variable
				i,

				// uncached part of the url
				uncached,

				// Create the final options object
				s = jQuery.ajaxSetup( {}, options ),

				// Callbacks context
				callbackContext = s.context || s,

				// Context for global events is callbackContext if it is a DOM node or jQuery collection
				globalEventContext = s.context &&
					( callbackContext.nodeType || callbackContext.jquery ) ?
					jQuery( callbackContext ) :
					jQuery.event,

				// Deferreds
				deferred = jQuery.Deferred(),
				completeDeferred = jQuery.Callbacks( "once memory" ),

				// Status-dependent callbacks
				statusCode = s.statusCode || {},

				// Headers (they are sent all at once)
				requestHeaders = {},
				requestHeadersNames = {},

				// Default abort message
				strAbort = "canceled",

				// Fake xhr
				jqXHR = {
					readyState: 0,

					// Builds headers hashtable if needed
					getResponseHeader: function( key ) {
						var match;
						if ( completed ) {
							if ( !responseHeaders ) {
								responseHeaders = {};
								while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
									responseHeaders[ match[ 1 ].toLowerCase() + " " ] =
										( responseHeaders[ match[ 1 ].toLowerCase() + " " ] || [] )
											.concat( match[ 2 ] );
								}
							}
							match = responseHeaders[ key.toLowerCase() + " " ];
						}
						return match == null ? null : match.join( ", " );
					},

					// Raw string
					getAllResponseHeaders: function() {
						return completed ? responseHeadersString : null;
					},

					// Caches the header
					setRequestHeader: function( name, value ) {
						if ( completed == null ) {
							name = requestHeadersNames[ name.toLowerCase() ] =
								requestHeadersNames[ name.toLowerCase() ] || name;
							requestHeaders[ name ] = value;
						}
						return this;
					},

					// Overrides response content-type header
					overrideMimeType: function( type ) {
						if ( completed == null ) {
							s.mimeType = type;
						}
						return this;
					},

					// Status-dependent callbacks
					statusCode: function( map ) {
						var code;
						if ( map ) {
							if ( completed ) {

								// Execute the appropriate callbacks
								jqXHR.always( map[ jqXHR.status ] );
							} else {

								// Lazy-add the new callbacks in a way that preserves old ones
								for ( code in map ) {
									statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
								}
							}
						}
						return this;
					},

					// Cancel the request
					abort: function( statusText ) {
						var finalText = statusText || strAbort;
						if ( transport ) {
							transport.abort( finalText );
						}
						done( 0, finalText );
						return this;
					}
				};

			// Attach deferreds
			deferred.promise( jqXHR );

			// Add protocol if not provided (prefilters might expect it)
			// Handle falsy url in the settings object (trac-10093: consistency with old signature)
			// We also use the url parameter if available
			s.url = ( ( url || s.url || location.href ) + "" )
				.replace( rprotocol, location.protocol + "//" );

			// Alias method option to type as per ticket trac-12004
			s.type = options.method || options.type || s.method || s.type;

			// Extract dataTypes list
			s.dataTypes = ( s.dataType || "*" ).toLowerCase().match( rnothtmlwhite ) || [ "" ];

			// A cross-domain request is in order when the origin doesn't match the current origin.
			if ( s.crossDomain == null ) {
				urlAnchor = document.createElement( "a" );

				// Support: IE <=8 - 11, Edge 12 - 15
				// IE throws exception on accessing the href property if url is malformed,
				// e.g. http://example.com:80x/
				try {
					urlAnchor.href = s.url;

					// Support: IE <=8 - 11 only
					// Anchor's host property isn't correctly set when s.url is relative
					urlAnchor.href = urlAnchor.href;
					s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
						urlAnchor.protocol + "//" + urlAnchor.host;
				} catch ( e ) {

					// If there is an error parsing the URL, assume it is crossDomain,
					// it can be rejected by the transport if it is invalid
					s.crossDomain = true;
				}
			}

			// Convert data if not already a string
			if ( s.data && s.processData && typeof s.data !== "string" ) {
				s.data = jQuery.param( s.data, s.traditional );
			}

			// Apply prefilters
			inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

			// If request was aborted inside a prefilter, stop there
			if ( completed ) {
				return jqXHR;
			}

			// We can fire global events as of now if asked to
			// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (trac-15118)
			fireGlobals = jQuery.event && s.global;

			// Watch for a new set of requests
			if ( fireGlobals && jQuery.active++ === 0 ) {
				jQuery.event.trigger( "ajaxStart" );
			}

			// Uppercase the type
			s.type = s.type.toUpperCase();

			// Determine if request has content
			s.hasContent = !rnoContent.test( s.type );

			// Save the URL in case we're toying with the If-Modified-Since
			// and/or If-None-Match header later on
			// Remove hash to simplify url manipulation
			cacheURL = s.url.replace( rhash, "" );

			// More options handling for requests with no content
			if ( !s.hasContent ) {

				// Remember the hash so we can put it back
				uncached = s.url.slice( cacheURL.length );

				// If data is available and should be processed, append data to url
				if ( s.data && ( s.processData || typeof s.data === "string" ) ) {
					cacheURL += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data;

					// trac-9682: remove data so that it's not used in an eventual retry
					delete s.data;
				}

				// Add or update anti-cache param if needed
				if ( s.cache === false ) {
					cacheURL = cacheURL.replace( rantiCache, "$1" );
					uncached = ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce.guid++ ) +
						uncached;
				}

				// Put hash and anti-cache on the URL that will be requested (gh-1732)
				s.url = cacheURL + uncached;

			// Change '%20' to '+' if this is encoded form body content (gh-2658)
			} else if ( s.data && s.processData &&
				( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 ) {
				s.data = s.data.replace( r20, "+" );
			}

			// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
			if ( s.ifModified ) {
				if ( jQuery.lastModified[ cacheURL ] ) {
					jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
				}
				if ( jQuery.etag[ cacheURL ] ) {
					jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
				}
			}

			// Set the correct header, if data is being sent
			if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
				jqXHR.setRequestHeader( "Content-Type", s.contentType );
			}

			// Set the Accepts header for the server, depending on the dataType
			jqXHR.setRequestHeader(
				"Accept",
				s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
					s.accepts[ s.dataTypes[ 0 ] ] +
						( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
					s.accepts[ "*" ]
			);

			// Check for headers option
			for ( i in s.headers ) {
				jqXHR.setRequestHeader( i, s.headers[ i ] );
			}

			// Allow custom headers/mimetypes and early abort
			if ( s.beforeSend &&
				( s.beforeSend.call( callbackContext, jqXHR, s ) === false || completed ) ) {

				// Abort if not done already and return
				return jqXHR.abort();
			}

			// Aborting is no longer a cancellation
			strAbort = "abort";

			// Install callbacks on deferreds
			completeDeferred.add( s.complete );
			jqXHR.done( s.success );
			jqXHR.fail( s.error );

			// Get transport
			transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

			// If no transport, we auto-abort
			if ( !transport ) {
				done( -1, "No Transport" );
			} else {
				jqXHR.readyState = 1;

				// Send global event
				if ( fireGlobals ) {
					globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
				}

				// If request was aborted inside ajaxSend, stop there
				if ( completed ) {
					return jqXHR;
				}

				// Timeout
				if ( s.async && s.timeout > 0 ) {
					timeoutTimer = window.setTimeout( function() {
						jqXHR.abort( "timeout" );
					}, s.timeout );
				}

				try {
					completed = false;
					transport.send( requestHeaders, done );
				} catch ( e ) {

					// Rethrow post-completion exceptions
					if ( completed ) {
						throw e;
					}

					// Propagate others as results
					done( -1, e );
				}
			}

			// Callback for when everything is done
			function done( status, nativeStatusText, responses, headers ) {
				var isSuccess, success, error, response, modified,
					statusText = nativeStatusText;

				// Ignore repeat invocations
				if ( completed ) {
					return;
				}

				completed = true;

				// Clear timeout if it exists
				if ( timeoutTimer ) {
					window.clearTimeout( timeoutTimer );
				}

				// Dereference transport for early garbage collection
				// (no matter how long the jqXHR object will be used)
				transport = undefined;

				// Cache response headers
				responseHeadersString = headers || "";

				// Set readyState
				jqXHR.readyState = status > 0 ? 4 : 0;

				// Determine if successful
				isSuccess = status >= 200 && status < 300 || status === 304;

				// Get response data
				if ( responses ) {
					response = ajaxHandleResponses( s, jqXHR, responses );
				}

				// Use a noop converter for missing script but not if jsonp
				if ( !isSuccess &&
					jQuery.inArray( "script", s.dataTypes ) > -1 &&
					jQuery.inArray( "json", s.dataTypes ) < 0 ) {
					s.converters[ "text script" ] = function() {};
				}

				// Convert no matter what (that way responseXXX fields are always set)
				response = ajaxConvert( s, response, jqXHR, isSuccess );

				// If successful, handle type chaining
				if ( isSuccess ) {

					// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
					if ( s.ifModified ) {
						modified = jqXHR.getResponseHeader( "Last-Modified" );
						if ( modified ) {
							jQuery.lastModified[ cacheURL ] = modified;
						}
						modified = jqXHR.getResponseHeader( "etag" );
						if ( modified ) {
							jQuery.etag[ cacheURL ] = modified;
						}
					}

					// if no content
					if ( status === 204 || s.type === "HEAD" ) {
						statusText = "nocontent";

					// if not modified
					} else if ( status === 304 ) {
						statusText = "notmodified";

					// If we have data, let's convert it
					} else {
						statusText = response.state;
						success = response.data;
						error = response.error;
						isSuccess = !error;
					}
				} else {

					// Extract error from statusText and normalize for non-aborts
					error = statusText;
					if ( status || !statusText ) {
						statusText = "error";
						if ( status < 0 ) {
							status = 0;
						}
					}
				}

				// Set data for the fake xhr object
				jqXHR.status = status;
				jqXHR.statusText = ( nativeStatusText || statusText ) + "";

				// Success/Error
				if ( isSuccess ) {
					deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
				} else {
					deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
				}

				// Status-dependent callbacks
				jqXHR.statusCode( statusCode );
				statusCode = undefined;

				if ( fireGlobals ) {
					globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
						[ jqXHR, s, isSuccess ? success : error ] );
				}

				// Complete
				completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

				if ( fireGlobals ) {
					globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

					// Handle the global AJAX counter
					if ( !( --jQuery.active ) ) {
						jQuery.event.trigger( "ajaxStop" );
					}
				}
			}

			return jqXHR;
		},

		getJSON: function( url, data, callback ) {
			return jQuery.get( url, data, callback, "json" );
		},

		getScript: function( url, callback ) {
			return jQuery.get( url, undefined, callback, "script" );
		}
	} );

	jQuery.each( [ "get", "post" ], function( _i, method ) {
		jQuery[ method ] = function( url, data, callback, type ) {

			// Shift arguments if data argument was omitted
			if ( isFunction( data ) ) {
				type = type || callback;
				callback = data;
				data = undefined;
			}

			// The url can be an options object (which then must have .url)
			return jQuery.ajax( jQuery.extend( {
				url: url,
				type: method,
				dataType: type,
				data: data,
				success: callback
			}, jQuery.isPlainObject( url ) && url ) );
		};
	} );

	jQuery.ajaxPrefilter( function( s ) {
		var i;
		for ( i in s.headers ) {
			if ( i.toLowerCase() === "content-type" ) {
				s.contentType = s.headers[ i ] || "";
			}
		}
	} );


	jQuery._evalUrl = function( url, options, doc ) {
		return jQuery.ajax( {
			url: url,

			// Make this explicit, since user can override this through ajaxSetup (trac-11264)
			type: "GET",
			dataType: "script",
			cache: true,
			async: false,
			global: false,

			// Only evaluate the response if it is successful (gh-4126)
			// dataFilter is not invoked for failure responses, so using it instead
			// of the default converter is kludgy but it works.
			converters: {
				"text script": function() {}
			},
			dataFilter: function( response ) {
				jQuery.globalEval( response, options, doc );
			}
		} );
	};


	jQuery.fn.extend( {
		wrapAll: function( html ) {
			var wrap;

			if ( this[ 0 ] ) {
				if ( isFunction( html ) ) {
					html = html.call( this[ 0 ] );
				}

				// The elements to wrap the target around
				wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

				if ( this[ 0 ].parentNode ) {
					wrap.insertBefore( this[ 0 ] );
				}

				wrap.map( function() {
					var elem = this;

					while ( elem.firstElementChild ) {
						elem = elem.firstElementChild;
					}

					return elem;
				} ).append( this );
			}

			return this;
		},

		wrapInner: function( html ) {
			if ( isFunction( html ) ) {
				return this.each( function( i ) {
					jQuery( this ).wrapInner( html.call( this, i ) );
				} );
			}

			return this.each( function() {
				var self = jQuery( this ),
					contents = self.contents();

				if ( contents.length ) {
					contents.wrapAll( html );

				} else {
					self.append( html );
				}
			} );
		},

		wrap: function( html ) {
			var htmlIsFunction = isFunction( html );

			return this.each( function( i ) {
				jQuery( this ).wrapAll( htmlIsFunction ? html.call( this, i ) : html );
			} );
		},

		unwrap: function( selector ) {
			this.parent( selector ).not( "body" ).each( function() {
				jQuery( this ).replaceWith( this.childNodes );
			} );
			return this;
		}
	} );


	jQuery.expr.pseudos.hidden = function( elem ) {
		return !jQuery.expr.pseudos.visible( elem );
	};
	jQuery.expr.pseudos.visible = function( elem ) {
		return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
	};




	jQuery.ajaxSettings.xhr = function() {
		try {
			return new window.XMLHttpRequest();
		} catch ( e ) {}
	};

	var xhrSuccessStatus = {

			// File protocol always yields status code 0, assume 200
			0: 200,

			// Support: IE <=9 only
			// trac-1450: sometimes IE returns 1223 when it should be 204
			1223: 204
		},
		xhrSupported = jQuery.ajaxSettings.xhr();

	support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
	support.ajax = xhrSupported = !!xhrSupported;

	jQuery.ajaxTransport( function( options ) {
		var callback, errorCallback;

		// Cross domain only allowed if supported through XMLHttpRequest
		if ( support.cors || xhrSupported && !options.crossDomain ) {
			return {
				send: function( headers, complete ) {
					var i,
						xhr = options.xhr();

					xhr.open(
						options.type,
						options.url,
						options.async,
						options.username,
						options.password
					);

					// Apply custom fields if provided
					if ( options.xhrFields ) {
						for ( i in options.xhrFields ) {
							xhr[ i ] = options.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( options.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( options.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
						headers[ "X-Requested-With" ] = "XMLHttpRequest";
					}

					// Set headers
					for ( i in headers ) {
						xhr.setRequestHeader( i, headers[ i ] );
					}

					// Callback
					callback = function( type ) {
						return function() {
							if ( callback ) {
								callback = errorCallback = xhr.onload =
									xhr.onerror = xhr.onabort = xhr.ontimeout =
										xhr.onreadystatechange = null;

								if ( type === "abort" ) {
									xhr.abort();
								} else if ( type === "error" ) {

									// Support: IE <=9 only
									// On a manual native abort, IE9 throws
									// errors on any property access that is not readyState
									if ( typeof xhr.status !== "number" ) {
										complete( 0, "error" );
									} else {
										complete(

											// File: protocol always yields status 0; see trac-8605, trac-14207
											xhr.status,
											xhr.statusText
										);
									}
								} else {
									complete(
										xhrSuccessStatus[ xhr.status ] || xhr.status,
										xhr.statusText,

										// Support: IE <=9 only
										// IE9 has no XHR2 but throws on binary (trac-11426)
										// For XHR2 non-text, let the caller handle it (gh-2498)
										( xhr.responseType || "text" ) !== "text"  ||
										typeof xhr.responseText !== "string" ?
											{ binary: xhr.response } :
											{ text: xhr.responseText },
										xhr.getAllResponseHeaders()
									);
								}
							}
						};
					};

					// Listen to events
					xhr.onload = callback();
					errorCallback = xhr.onerror = xhr.ontimeout = callback( "error" );

					// Support: IE 9 only
					// Use onreadystatechange to replace onabort
					// to handle uncaught aborts
					if ( xhr.onabort !== undefined ) {
						xhr.onabort = errorCallback;
					} else {
						xhr.onreadystatechange = function() {

							// Check readyState before timeout as it changes
							if ( xhr.readyState === 4 ) {

								// Allow onerror to be called first,
								// but that will not handle a native abort
								// Also, save errorCallback to a variable
								// as xhr.onerror cannot be accessed
								window.setTimeout( function() {
									if ( callback ) {
										errorCallback();
									}
								} );
							}
						};
					}

					// Create the abort callback
					callback = callback( "abort" );

					try {

						// Do send the request (this may raise an exception)
						xhr.send( options.hasContent && options.data || null );
					} catch ( e ) {

						// trac-14683: Only rethrow if this hasn't been notified as an error yet
						if ( callback ) {
							throw e;
						}
					}
				},

				abort: function() {
					if ( callback ) {
						callback();
					}
				}
			};
		}
	} );




	// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
	jQuery.ajaxPrefilter( function( s ) {
		if ( s.crossDomain ) {
			s.contents.script = false;
		}
	} );

	// Install script dataType
	jQuery.ajaxSetup( {
		accepts: {
			script: "text/javascript, application/javascript, " +
				"application/ecmascript, application/x-ecmascript"
		},
		contents: {
			script: /\b(?:java|ecma)script\b/
		},
		converters: {
			"text script": function( text ) {
				jQuery.globalEval( text );
				return text;
			}
		}
	} );

	// Handle cache's special case and crossDomain
	jQuery.ajaxPrefilter( "script", function( s ) {
		if ( s.cache === undefined ) {
			s.cache = false;
		}
		if ( s.crossDomain ) {
			s.type = "GET";
		}
	} );

	// Bind script tag hack transport
	jQuery.ajaxTransport( "script", function( s ) {

		// This transport only deals with cross domain or forced-by-attrs requests
		if ( s.crossDomain || s.scriptAttrs ) {
			var script, callback;
			return {
				send: function( _, complete ) {
					script = jQuery( "<script>" )
						.attr( s.scriptAttrs || {} )
						.prop( { charset: s.scriptCharset, src: s.url } )
						.on( "load error", callback = function( evt ) {
							script.remove();
							callback = null;
							if ( evt ) {
								complete( evt.type === "error" ? 404 : 200, evt.type );
							}
						} );

					// Use native DOM manipulation to avoid our domManip AJAX trickery
					document.head.appendChild( script[ 0 ] );
				},
				abort: function() {
					if ( callback ) {
						callback();
					}
				}
			};
		}
	} );




	var oldCallbacks = [],
		rjsonp = /(=)\?(?=&|$)|\?\?/;

	// Default jsonp settings
	jQuery.ajaxSetup( {
		jsonp: "callback",
		jsonpCallback: function() {
			var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce.guid++ ) );
			this[ callback ] = true;
			return callback;
		}
	} );

	// Detect, normalize options and install callbacks for jsonp requests
	jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

		var callbackName, overwritten, responseContainer,
			jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
				"url" :
				typeof s.data === "string" &&
					( s.contentType || "" )
						.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
					rjsonp.test( s.data ) && "data"
			);

		// Handle iff the expected data type is "jsonp" or we have a parameter to set
		if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

			// Get callback name, remembering preexisting value associated with it
			callbackName = s.jsonpCallback = isFunction( s.jsonpCallback ) ?
				s.jsonpCallback() :
				s.jsonpCallback;

			// Insert callback into url or form data
			if ( jsonProp ) {
				s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
			} else if ( s.jsonp !== false ) {
				s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
			}

			// Use data converter to retrieve json after script execution
			s.converters[ "script json" ] = function() {
				if ( !responseContainer ) {
					jQuery.error( callbackName + " was not called" );
				}
				return responseContainer[ 0 ];
			};

			// Force json dataType
			s.dataTypes[ 0 ] = "json";

			// Install callback
			overwritten = window[ callbackName ];
			window[ callbackName ] = function() {
				responseContainer = arguments;
			};

			// Clean-up function (fires after converters)
			jqXHR.always( function() {

				// If previous value didn't exist - remove it
				if ( overwritten === undefined ) {
					jQuery( window ).removeProp( callbackName );

				// Otherwise restore preexisting value
				} else {
					window[ callbackName ] = overwritten;
				}

				// Save back as free
				if ( s[ callbackName ] ) {

					// Make sure that re-using the options doesn't screw things around
					s.jsonpCallback = originalSettings.jsonpCallback;

					// Save the callback name for future use
					oldCallbacks.push( callbackName );
				}

				// Call if it was a function and we have a response
				if ( responseContainer && isFunction( overwritten ) ) {
					overwritten( responseContainer[ 0 ] );
				}

				responseContainer = overwritten = undefined;
			} );

			// Delegate to script
			return "script";
		}
	} );




	// Support: Safari 8 only
	// In Safari 8 documents created via document.implementation.createHTMLDocument
	// collapse sibling forms: the second one becomes a child of the first one.
	// Because of that, this security measure has to be disabled in Safari 8.
	// https://bugs.webkit.org/show_bug.cgi?id=137337
	support.createHTMLDocument = ( function() {
		var body = document.implementation.createHTMLDocument( "" ).body;
		body.innerHTML = "<form></form><form></form>";
		return body.childNodes.length === 2;
	} )();


	// Argument "data" should be string of html
	// context (optional): If specified, the fragment will be created in this context,
	// defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	jQuery.parseHTML = function( data, context, keepScripts ) {
		if ( typeof data !== "string" ) {
			return [];
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}

		var base, parsed, scripts;

		if ( !context ) {

			// Stop scripts or inline event handlers from being executed immediately
			// by using document.implementation
			if ( support.createHTMLDocument ) {
				context = document.implementation.createHTMLDocument( "" );

				// Set the base href for the created document
				// so any parsed elements with URLs
				// are based on the document's URL (gh-2965)
				base = context.createElement( "base" );
				base.href = document.location.href;
				context.head.appendChild( base );
			} else {
				context = document;
			}
		}

		parsed = rsingleTag.exec( data );
		scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[ 1 ] ) ];
		}

		parsed = buildFragment( [ data ], context, scripts );

		if ( scripts && scripts.length ) {
			jQuery( scripts ).remove();
		}

		return jQuery.merge( [], parsed.childNodes );
	};


	/**
	 * Load a url into a page
	 */
	jQuery.fn.load = function( url, params, callback ) {
		var selector, type, response,
			self = this,
			off = url.indexOf( " " );

		if ( off > -1 ) {
			selector = stripAndCollapse( url.slice( off ) );
			url = url.slice( 0, off );
		}

		// If it's a function
		if ( isFunction( params ) ) {

			// We assume that it's the callback
			callback = params;
			params = undefined;

		// Otherwise, build a param string
		} else if ( params && typeof params === "object" ) {
			type = "POST";
		}

		// If we have elements to modify, make the request
		if ( self.length > 0 ) {
			jQuery.ajax( {
				url: url,

				// If "type" variable is undefined, then "GET" method will be used.
				// Make value of this field explicit since
				// user can override it through ajaxSetup method
				type: type || "GET",
				dataType: "html",
				data: params
			} ).done( function( responseText ) {

				// Save response for use in complete callback
				response = arguments;

				self.html( selector ?

					// If a selector was specified, locate the right elements in a dummy div
					// Exclude scripts to avoid IE 'Permission Denied' errors
					jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

					// Otherwise use the full result
					responseText );

			// If the request succeeds, this function gets "data", "status", "jqXHR"
			// but they are ignored because response was set above.
			// If it fails, this function gets "jqXHR", "status", "error"
			} ).always( callback && function( jqXHR, status ) {
				self.each( function() {
					callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
				} );
			} );
		}

		return this;
	};




	jQuery.expr.pseudos.animated = function( elem ) {
		return jQuery.grep( jQuery.timers, function( fn ) {
			return elem === fn.elem;
		} ).length;
	};




	jQuery.offset = {
		setOffset: function( elem, options, i ) {
			var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
				position = jQuery.css( elem, "position" ),
				curElem = jQuery( elem ),
				props = {};

			// Set position first, in-case top/left are set even on static elem
			if ( position === "static" ) {
				elem.style.position = "relative";
			}

			curOffset = curElem.offset();
			curCSSTop = jQuery.css( elem, "top" );
			curCSSLeft = jQuery.css( elem, "left" );
			calculatePosition = ( position === "absolute" || position === "fixed" ) &&
				( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

			// Need to be able to calculate position if either
			// top or left is auto and position is either absolute or fixed
			if ( calculatePosition ) {
				curPosition = curElem.position();
				curTop = curPosition.top;
				curLeft = curPosition.left;

			} else {
				curTop = parseFloat( curCSSTop ) || 0;
				curLeft = parseFloat( curCSSLeft ) || 0;
			}

			if ( isFunction( options ) ) {

				// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
				options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
			}

			if ( options.top != null ) {
				props.top = ( options.top - curOffset.top ) + curTop;
			}
			if ( options.left != null ) {
				props.left = ( options.left - curOffset.left ) + curLeft;
			}

			if ( "using" in options ) {
				options.using.call( elem, props );

			} else {
				curElem.css( props );
			}
		}
	};

	jQuery.fn.extend( {

		// offset() relates an element's border box to the document origin
		offset: function( options ) {

			// Preserve chaining for setter
			if ( arguments.length ) {
				return options === undefined ?
					this :
					this.each( function( i ) {
						jQuery.offset.setOffset( this, options, i );
					} );
			}

			var rect, win,
				elem = this[ 0 ];

			if ( !elem ) {
				return;
			}

			// Return zeros for disconnected and hidden (display: none) elements (gh-2310)
			// Support: IE <=11 only
			// Running getBoundingClientRect on a
			// disconnected node in IE throws an error
			if ( !elem.getClientRects().length ) {
				return { top: 0, left: 0 };
			}

			// Get document-relative position by adding viewport scroll to viewport-relative gBCR
			rect = elem.getBoundingClientRect();
			win = elem.ownerDocument.defaultView;
			return {
				top: rect.top + win.pageYOffset,
				left: rect.left + win.pageXOffset
			};
		},

		// position() relates an element's margin box to its offset parent's padding box
		// This corresponds to the behavior of CSS absolute positioning
		position: function() {
			if ( !this[ 0 ] ) {
				return;
			}

			var offsetParent, offset, doc,
				elem = this[ 0 ],
				parentOffset = { top: 0, left: 0 };

			// position:fixed elements are offset from the viewport, which itself always has zero offset
			if ( jQuery.css( elem, "position" ) === "fixed" ) {

				// Assume position:fixed implies availability of getBoundingClientRect
				offset = elem.getBoundingClientRect();

			} else {
				offset = this.offset();

				// Account for the *real* offset parent, which can be the document or its root element
				// when a statically positioned element is identified
				doc = elem.ownerDocument;
				offsetParent = elem.offsetParent || doc.documentElement;
				while ( offsetParent &&
					( offsetParent === doc.body || offsetParent === doc.documentElement ) &&
					jQuery.css( offsetParent, "position" ) === "static" ) {

					offsetParent = offsetParent.parentNode;
				}
				if ( offsetParent && offsetParent !== elem && offsetParent.nodeType === 1 ) {

					// Incorporate borders into its offset, since they are outside its content origin
					parentOffset = jQuery( offsetParent ).offset();
					parentOffset.top += jQuery.css( offsetParent, "borderTopWidth", true );
					parentOffset.left += jQuery.css( offsetParent, "borderLeftWidth", true );
				}
			}

			// Subtract parent offsets and element margins
			return {
				top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
				left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
			};
		},

		// This method will return documentElement in the following cases:
		// 1) For the element inside the iframe without offsetParent, this method will return
		//    documentElement of the parent window
		// 2) For the hidden or detached element
		// 3) For body or html element, i.e. in case of the html node - it will return itself
		//
		// but those exceptions were never presented as a real life use-cases
		// and might be considered as more preferable results.
		//
		// This logic, however, is not guaranteed and can change at any point in the future
		offsetParent: function() {
			return this.map( function() {
				var offsetParent = this.offsetParent;

				while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
					offsetParent = offsetParent.offsetParent;
				}

				return offsetParent || documentElement;
			} );
		}
	} );

	// Create scrollLeft and scrollTop methods
	jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
		var top = "pageYOffset" === prop;

		jQuery.fn[ method ] = function( val ) {
			return access( this, function( elem, method, val ) {

				// Coalesce documents and windows
				var win;
				if ( isWindow( elem ) ) {
					win = elem;
				} else if ( elem.nodeType === 9 ) {
					win = elem.defaultView;
				}

				if ( val === undefined ) {
					return win ? win[ prop ] : elem[ method ];
				}

				if ( win ) {
					win.scrollTo(
						!top ? val : win.pageXOffset,
						top ? val : win.pageYOffset
					);

				} else {
					elem[ method ] = val;
				}
			}, method, val, arguments.length );
		};
	} );

	// Support: Safari <=7 - 9.1, Chrome <=37 - 49
	// Add the top/left cssHooks using jQuery.fn.position
	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
	// getComputedStyle returns percent when specified for top/left/bottom/right;
	// rather than make the css module depend on the offset module, just check for it here
	jQuery.each( [ "top", "left" ], function( _i, prop ) {
		jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
			function( elem, computed ) {
				if ( computed ) {
					computed = curCSS( elem, prop );

					// If curCSS returns percentage, fallback to offset
					return rnumnonpx.test( computed ) ?
						jQuery( elem ).position()[ prop ] + "px" :
						computed;
				}
			}
		);
	} );


	// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
	jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
		jQuery.each( {
			padding: "inner" + name,
			content: type,
			"": "outer" + name
		}, function( defaultExtra, funcName ) {

			// Margin is only for outerHeight, outerWidth
			jQuery.fn[ funcName ] = function( margin, value ) {
				var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
					extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

				return access( this, function( elem, type, value ) {
					var doc;

					if ( isWindow( elem ) ) {

						// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
						return funcName.indexOf( "outer" ) === 0 ?
							elem[ "inner" + name ] :
							elem.document.documentElement[ "client" + name ];
					}

					// Get document width or height
					if ( elem.nodeType === 9 ) {
						doc = elem.documentElement;

						// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
						// whichever is greatest
						return Math.max(
							elem.body[ "scroll" + name ], doc[ "scroll" + name ],
							elem.body[ "offset" + name ], doc[ "offset" + name ],
							doc[ "client" + name ]
						);
					}

					return value === undefined ?

						// Get width or height on the element, requesting but not forcing parseFloat
						jQuery.css( elem, type, extra ) :

						// Set width or height on the element
						jQuery.style( elem, type, value, extra );
				}, type, chainable ? margin : undefined, chainable );
			};
		} );
	} );


	jQuery.each( [
		"ajaxStart",
		"ajaxStop",
		"ajaxComplete",
		"ajaxError",
		"ajaxSuccess",
		"ajaxSend"
	], function( _i, type ) {
		jQuery.fn[ type ] = function( fn ) {
			return this.on( type, fn );
		};
	} );




	jQuery.fn.extend( {

		bind: function( types, data, fn ) {
			return this.on( types, null, data, fn );
		},
		unbind: function( types, fn ) {
			return this.off( types, null, fn );
		},

		delegate: function( selector, types, data, fn ) {
			return this.on( types, selector, data, fn );
		},
		undelegate: function( selector, types, fn ) {

			// ( namespace ) or ( selector, types [, fn] )
			return arguments.length === 1 ?
				this.off( selector, "**" ) :
				this.off( types, selector || "**", fn );
		},

		hover: function( fnOver, fnOut ) {
			return this
				.on( "mouseenter", fnOver )
				.on( "mouseleave", fnOut || fnOver );
		}
	} );

	jQuery.each(
		( "blur focus focusin focusout resize scroll click dblclick " +
		"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
		"change select submit keydown keypress keyup contextmenu" ).split( " " ),
		function( _i, name ) {

			// Handle event binding
			jQuery.fn[ name ] = function( data, fn ) {
				return arguments.length > 0 ?
					this.on( name, null, data, fn ) :
					this.trigger( name );
			};
		}
	);




	// Support: Android <=4.0 only
	// Make sure we trim BOM and NBSP
	// Require that the "whitespace run" starts from a non-whitespace
	// to avoid O(N^2) behavior when the engine would try matching "\s+$" at each space position.
	var rtrim = /^[\s\uFEFF\xA0]+|([^\s\uFEFF\xA0])[\s\uFEFF\xA0]+$/g;

	// Bind a function to a context, optionally partially applying any
	// arguments.
	// jQuery.proxy is deprecated to promote standards (specifically Function#bind)
	// However, it is not slated for removal any time soon
	jQuery.proxy = function( fn, context ) {
		var tmp, args, proxy;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	};

	jQuery.holdReady = function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	};
	jQuery.isArray = Array.isArray;
	jQuery.parseJSON = JSON.parse;
	jQuery.nodeName = nodeName;
	jQuery.isFunction = isFunction;
	jQuery.isWindow = isWindow;
	jQuery.camelCase = camelCase;
	jQuery.type = toType;

	jQuery.now = Date.now;

	jQuery.isNumeric = function( obj ) {

		// As of jQuery 3.0, isNumeric is limited to
		// strings and numbers (primitives or objects)
		// that can be coerced to finite numbers (gh-2662)
		var type = jQuery.type( obj );
		return ( type === "number" || type === "string" ) &&

			// parseFloat NaNs numeric-cast false positives ("")
			// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
			// subtraction forces infinities to NaN
			!isNaN( obj - parseFloat( obj ) );
	};

	jQuery.trim = function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "$1" );
	};




	var

		// Map over jQuery in case of overwrite
		_jQuery = window.jQuery,

		// Map over the $ in case of overwrite
		_$ = window.$;

	jQuery.noConflict = function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	};

	// Expose jQuery and $ identifiers, even in AMD
	// (trac-7102#comment:10, https://github.com/jquery/jquery/pull/557)
	// and CommonJS for browser emulators (trac-13566)
	if ( typeof noGlobal === "undefined" ) {
		window.jQuery = window.$ = jQuery;
	}




	return jQuery;
	} ); 
} (jquery$1));

var jqueryExports = jquery$1.exports;
var jquery = /*@__PURE__*/getDefaultExportFromCjs(jqueryExports);

/**
 * layer
 * 通用 Web 弹出层组件
 */

var isLayui$1 = window.layui && layui.define;
var win;
var ready$1 = {
  getPath: function(){
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
    var GLOBAL = window.LAYUI_GLOBAL || {};
    return GLOBAL.layer_dir || jsPath.substring(0, jsPath.lastIndexOf('/') + 1);
  }(),
  config: {
    removeFocus: true
  },
  end: {},
  beforeEnd: {},
  events: {resize: {}},
  minStackIndex: 0,
  minStackArr: [],
  btn: ['确定', '取消'],

  // 五种原始层模式
  type: ['dialog', 'page', 'iframe', 'loading', 'tips'],

  // 获取节点的 style 属性值
  getStyle: function(node, name){
    var style = node.currentStyle ? node.currentStyle : window.getComputedStyle(node, null);
    return style[style.getPropertyValue ? 'getPropertyValue' : 'getAttribute'](name);
  },

  // 载入 CSS 依赖
  link: function(href, fn, cssname){
    // 未设置路径，则不主动加载 css
    if(!layer$1.path) return;

    var head = document.getElementsByTagName("head")[0];
    var link = document.createElement('link');

    if(typeof fn === 'string') cssname = fn;

    var app = (cssname || href).replace(/\.|\//g, '');
    var id = 'layuicss-'+ app;
    var STATUS_NAME = 'creating';
    var timeout = 0;

    link.rel = 'stylesheet';
    link.href = layer$1.path + href;
    link.id = id;

    if(!document.getElementById(id)){
      head.appendChild(link);
    }

    if(typeof fn !== 'function') return;

    // 轮询 css 是否加载完毕
    (function poll(status) {
      var delay = 100;
      var getLinkElem = document.getElementById(id); // 获取动态插入的 link 元素

      // 如果轮询超过指定秒数，则视为请求文件失败或 css 文件不符合规范
      if(++timeout > 10 * 1000 / delay){
        return window.console && console.error(app +'.css: Invalid');
      }

      // css 加载就绪
      if(parseInt(ready$1.getStyle(getLinkElem, 'width')) === 1989){
        // 如果参数来自于初始轮询（即未加载就绪时的），则移除 link 标签状态
        if(status === STATUS_NAME) getLinkElem.removeAttribute('lay-status');
        // 如果 link 标签的状态仍为「创建中」，则继续进入轮询，直到状态改变，则执行回调
        getLinkElem.getAttribute('lay-status') === STATUS_NAME ? setTimeout(poll, delay) : fn();
      } else {
        getLinkElem.setAttribute('lay-status', STATUS_NAME);
        setTimeout(function(){
          poll(STATUS_NAME);
        }, delay);
      }

      // parseInt(ready.getStyle(document.getElementById(id), 'width')) === 1989 ? fn() : setTimeout(poll, 1000);
    }());

  }
};

// 默认内置方法。
var layer$1 = {
  v: '3.7.0',
  ie: function(){ // ie 版本
    var agent = navigator.userAgent.toLowerCase();
    return (!!window.ActiveXObject || "ActiveXObject" in window) ? (
      (agent.match(/msie\s(\d+)/) || [])[1] || '11' // 由于 ie11 并没有 msie 的标识
    ) : false;
  }(),
  index: (window.layer && window.layer.v) ? 100000 : 0,
  path: ready$1.getPath,
  config: function(options, fn){
    options = options || {};
    layer$1.cache = ready$1.config = jquery.extend({}, ready$1.config, options);
    layer$1.path = ready$1.config.path || layer$1.path;
    typeof options.extend === 'string' && (options.extend = [options.extend]);

    // 如果设置了路径，则加载样式
    if(ready$1.config.path) layer$1.ready();

    if(!options.extend) return this;

    // 加载 css
    isLayui$1
      ? layui.addcss('modules/layer/' + options.extend)
    : ready$1.link('css/' + options.extend);

    return this;
  },

  // 主体 CSS 等待事件
  ready: function(callback){
    var cssname = 'layer';
    var ver = '';
    var path = (isLayui$1 ? 'modules/' : 'css/') + 'layer.css?v='+ layer$1.v + ver;

    isLayui$1 ? (
      layui['layui.all']
        ? (typeof callback === 'function' && callback())
      : layui.addcss(path, callback, cssname)
    ) : ready$1.link(path, callback, cssname);

    return this;
  },

  // 各种快捷引用
  alert: function(content, options, yes){
    var type = typeof options === 'function';
    if(type) yes = options;
    return layer$1.open(jquery.extend({
      content: content,
      yes: yes
    }, type ? {} : options));
  },

  confirm: function(content, options, yes, cancel){
    var type = typeof options === 'function';
    if(type){
      cancel = yes;
      yes = options;
    }
    return layer$1.open(jquery.extend({
      content: content,
      btn: ready$1.btn,
      yes: yes,
      btn2: cancel
    }, type ? {} : options));
  },

  msg: function(content, options, end){ // 最常用提示层
    var type = typeof options === 'function', rskin = ready$1.config.skin;
    var skin = (rskin ? rskin + ' ' + rskin + '-msg' : '')||'layui-layer-msg';
    var anim = doms.anim.length - 1;
    if(type) end = options;
    return layer$1.open(jquery.extend({
      content: content,
      time: 3000,
      shade: false,
      skin: skin,
      title: false,
      closeBtn: false,
      btn: false,
      resize: false,
      end: end,
      removeFocus: false
    }, (type && !ready$1.config.skin) ? {
      skin: skin + ' layui-layer-hui',
      anim: anim
    } : function(){
       options = options || {};
       if(options.icon === -1 || options.icon === undefined && !ready$1.config.skin){
         options.skin = skin + ' ' + (options.skin||'layui-layer-hui');
       }
       return options;
    }()));
  },

  load: function(icon, options){
    return layer$1.open(jquery.extend({
      type: 3,
      icon: icon || 0,
      resize: false,
      shade: 0.01,
      removeFocus: false
    }, options));
  },

  tips: function(content, follow, options){
    return layer$1.open(jquery.extend({
      type: 4,
      content: [content, follow],
      closeBtn: false,
      time: 3000,
      shade: false,
      resize: false,
      fixed: false,
      maxWidth: 260,
      removeFocus: false
    }, options));
  }
};

var Class$e = function(setings){
  var that = this, creat = function(){
    that.creat();
  };
  that.index = ++layer$1.index;
  that.config.maxWidth = jquery(win).width() - 15*2; // 初始最大宽度：当前屏幕宽，左右留 15px 边距
  that.config = jquery.extend({}, that.config, ready$1.config, setings);
  document.body ? creat() : setTimeout(function(){
    creat();
  }, 30);
};

Class$e.pt = Class$e.prototype;

// 缓存常用字符
var doms = ['layui-layer', '.layui-layer-title', '.layui-layer-main', '.layui-layer-dialog', 'layui-layer-iframe', 'layui-layer-content', 'layui-layer-btn', 'layui-layer-close'];

// 内置动画类
doms.anim = {
  // 旧版动画
  0: 'layer-anim-00',
  1: 'layer-anim-01',
  2: 'layer-anim-02',
  3: 'layer-anim-03',
  4: 'layer-anim-04',
  5: 'layer-anim-05',
  6: 'layer-anim-06',

  // 滑出方向
  slideDown: 'layer-anim-slide-down',
  slideLeft: 'layer-anim-slide-left',
  slideUp: 'layer-anim-slide-up',
  slideRight: 'layer-anim-slide-right'
};

doms.SHADE = 'layui-layer-shade';
doms.MOVE = 'layui-layer-move';

var SHADE_KEY = 'LAYUI-LAYER-SHADE-KEY';
var RECORD_HEIGHT_KEY = 'LAYUI_LAYER_CONTENT_RECORD_HEIGHT';

// 默认配置
Class$e.pt.config = {
  type: 0,
  shade: 0.3,
  fixed: true,
  move: doms[1],
  title: '信息',
  offset: 'auto',
  area: 'auto',
  closeBtn: 1,
  icon: -1,
  time: 0, // 0 表示不自动关闭
  zIndex: 19891014,
  maxWidth: 360,
  anim: 0,
  isOutAnim: true, // 退出动画
  minStack: true, // 最小化堆叠
  moveType: 1,
  resize: true,
  scrollbar: true, // 是否允许浏览器滚动条
  tips: 2
};

// 容器
Class$e.pt.vessel = function(conType, callback){
  var that = this, times = that.index, config = that.config;
  var zIndex = config.zIndex + times, titype = typeof config.title === 'object';
  var ismax = config.maxmin && (config.type === 1 || config.type === 2);
  var titleHTML = (config.title ? '<div class="layui-layer-title" style="'+ (titype ? config.title[1] : '') +'">'
    + (titype ? config.title[0] : config.title)
  + '</div>' : '');

  config.zIndex = zIndex;
  callback([
    // 遮罩
    config.shade ? ('<div class="'+ doms.SHADE +'" id="'+ doms.SHADE + times +'" times="'+ times +'" style="'+ ('z-index:'+ (zIndex-1) +'; ') +'"></div>') : '',

    // 主体
    '<div class="'+ doms[0] + (' layui-layer-'+ready$1.type[config.type]) + (((config.type == 0 || config.type == 2) && !config.shade) ? ' layui-layer-border' : '') + ' ' + (config.skin||'') +'" id="'+ doms[0] + times +'" type="'+ ready$1.type[config.type] +'" times="'+ times +'" showtime="'+ config.time +'" conType="'+ (conType ? 'object' : 'string') +'" style="z-index: '+ zIndex +'; width:'+ config.area[0] + ';height:' + config.area[1] + ';position:'+ (config.fixed ? 'fixed;' : 'absolute;') +'">'
      + (conType && config.type != 2 ? '' : titleHTML)

      // 内容区
      + '<div'+ (config.id ? ' id="'+ config.id +'"' : '') +' class="layui-layer-content'+ ((config.type == 0 && config.icon !== -1) ? ' layui-layer-padding' : '') + (config.type == 3 ? ' layui-layer-loading'+config.icon : '') +'">'
        // 表情或图标
        + function(){
          var face = [
            'layui-icon-tips',
            'layui-icon-success',
            'layui-icon-error',
            'layui-icon-question',
            'layui-icon-lock',
            'layui-icon-face-cry',
            'layui-icon-face-smile'
          ];

          var additFaceClass;

          // 动画类
          var animClass = 'layui-anim layui-anim-rotate layui-anim-loop';

          // 信息框表情
          if(config.type == 0 && config.icon !== -1){
            // 加载（加载图标）
            if(config.icon == 16){
              additFaceClass = 'layui-icon layui-icon-loading '+ animClass;
            }
            return '<i class="layui-layer-face layui-icon '+ (
              additFaceClass || face[config.icon] || face[0]
            ) +'"></i>';
          }

          // 加载层图标
          if(config.type == 3){
            var type = [
              'layui-icon-loading',
              'layui-icon-loading-1'
            ];
            // 风格 2
            if(config.icon == 2){
              return '<div class="layui-layer-loading-2 '+ animClass +'"></div>';
            }
            return '<i class="layui-layer-loading-icon layui-icon '+ (
              type[config.icon] || type[0]
            )+' '+ animClass +'"></i>'
          }

          return '';
        }()
        + (config.type == 1 && conType ? '' : (config.content||''))
      + '</div>'

      // 右上角按钮
      + '<div class="layui-layer-setwin">'+ function(){
        var arr = [];

        // 最小化、最大化
        if(ismax){
          arr.push('<span class="layui-layer-min"></span>');
          arr.push('<span class="layui-layer-max"></span>');
        }

        // 关闭按钮
        if(config.closeBtn){
          arr.push('<span class="layui-icon layui-icon-close '+ [
            doms[7],
            doms[7] + (config.title ? config.closeBtn : (config.type == 4 ? '1' : '2'))
          ].join(' ') +'"></span>');
        }

        return arr.join('');
      }() + '</div>'

      // 底部按钮
      + (config.btn ? function(){
        var button = '';
        typeof config.btn === 'string' && (config.btn = [config.btn]);
        for(var i = 0, len = config.btn.length; i < len; i++){
          button += '<a class="'+ doms[6] +''+ i +'">'+ config.btn[i] +'</a>';
        }
        return '<div class="'+ function(){
          var className = [doms[6]];
          if(config.btnAlign) className.push(doms[6] + '-' + config.btnAlign);
          return className.join(' ');
        }() +'">'+ button +'</div>'
      }() : '')
      + (config.resize ? '<span class="layui-layer-resize"></span>' : '')
    + '</div>'
  ], titleHTML, jquery('<div class="'+ doms.MOVE +'" id="'+ doms.MOVE +'"></div>'));
  return that;
};

// 创建骨架
Class$e.pt.creat = function(){
  var that = this;
  var config = that.config;
  var times = that.index;
  var content = config.content;
  var conType = typeof content === 'object';
  var body = jquery('body');

  var setAnim = function(layero){
    // anim 兼容旧版 shift
    if(config.shift){
      config.anim = config.shift;
    }

    // 为兼容 jQuery3.0 的 css 动画影响元素尺寸计算
    if(doms.anim[config.anim]){
      var animClass = 'layer-anim '+ doms.anim[config.anim];
      layero.addClass(animClass).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
        jquery(this).removeClass(animClass);
      });
    }
  };

  // 若 id 对应的弹层已经存在，则不重新创建
  if(config.id && jquery('.'+ doms[0]).find('#'+ config.id)[0]){
    return (function(){
      var layero = jquery('#'+ config.id).closest('.'+ doms[0]);
      var index = layero.attr('times');
      var options = layero.data('config');
      var elemShade = jquery('#'+ doms.SHADE + index);

      var maxminStatus = layero.data('maxminStatus') || {};
      // 若弹层为最小化状态，则点击目标元素时，自动还原
      if(maxminStatus === 'min'){
        layer$1.restore(index);
      } else if(options.hideOnClose){
        elemShade.show();
        layero.show();
        setAnim(layero);
        setTimeout(function(){
          elemShade.css({opacity: elemShade.data(SHADE_KEY)});
        }, 10);
      }
    })();
  }

  // 是否移除活动元素的焦点
  if(config.removeFocus && document.activeElement) {
    document.activeElement.blur(); // 将原始的聚焦节点失焦
  }

  // 初始化 area 属性
  if(typeof config.area === 'string'){
    config.area = config.area === 'auto' ? ['', ''] : [config.area, ''];
  }

  if(layer$1.ie == 6){
    config.fixed = false;
  }

  switch(config.type){
    case 0:
      config.btn = ('btn' in config) ? config.btn : ready$1.btn[0];
      layer$1.closeAll('dialog');
    break;
    case 2:
      var content = config.content = conType ? config.content : [config.content||'', 'auto'];
      config.content = '<iframe scrolling="'+ (config.content[1]||'auto') +'" allowtransparency="true" id="'+ doms[4] +''+ times +'" name="'+ doms[4] +''+ times +'" onload="this.className=\'\';" class="layui-layer-load" frameborder="0" src="' + config.content[0] + '"></iframe>';
    break;
    case 3:
      delete config.title;
      delete config.closeBtn;
      config.icon === -1 && (config.icon === 0);
      layer$1.closeAll('loading');
    break;
    case 4:
      conType || (config.content = [config.content, 'body']);
      config.follow = config.content[1];
      config.content = config.content[0] + '<i class="layui-layer-TipsG"></i>';
      delete config.title;
      config.tips = typeof config.tips === 'object' ? config.tips : [config.tips, true];
      config.tipsMore || layer$1.closeAll('tips');
    break;
  }

  // 建立容器
  that.vessel(conType, function(html, titleHTML, moveElem){
    body.append(html[0]);
    conType ? function(){
      (config.type == 2 || config.type == 4) ? function(){
        jquery('body').append(html[1]);
      }() : function(){
        if(!content.parents('.'+doms[0])[0]){
          content.data('display', content.css('display')).show().addClass('layui-layer-wrap').wrap(html[1]);
          jquery('#'+ doms[0] + times).find('.'+doms[5]).before(titleHTML);
        }
      }();
    }() : body.append(html[1]);
    jquery('#'+ doms.MOVE)[0] || body.append(ready$1.moveElem = moveElem);

    that.layero = jquery('#'+ doms[0] + times);
    that.shadeo = jquery('#'+ doms.SHADE + times);

    config.scrollbar || ready$1.setScrollbar(times);
  }).auto(times);

  // 遮罩
  that.shadeo.css({
    'background-color': config.shade[1] || '#000'
    ,'opacity': config.shade[0] || config.shade
    ,'transition': config.shade[2] || ''
  });
  that.shadeo.data(SHADE_KEY, config.shade[0] || config.shade);

  config.type == 2 && layer$1.ie == 6 && that.layero.find('iframe').attr('src', content[0]);

  // 坐标自适应浏览器窗口尺寸
  config.type == 4 ? that.tips() : function(){
    that.offset();
    // 首次弹出时，若 css 尚未加载，则等待 css 加载完毕后，重新设定尺寸
    parseInt(ready$1.getStyle(document.getElementById(doms.MOVE), 'z-index')) ||  function(){
      that.layero.css('visibility', 'hidden');
      layer$1.ready(function(){
        that.offset();
        that.layero.css('visibility', 'visible');
      });
    }();
  }();

  // 若是固定定位，则跟随 resize 事件来自适应坐标
  if(config.fixed){
    if(!ready$1.events.resize[that.index]){
      ready$1.events.resize[that.index] = function(){
        that.resize();
      };
      // 此处 resize 事件不会一直叠加，当关闭弹层时会移除该事件
      win.on('resize', ready$1.events.resize[that.index]);
    }
  }

  // 记录配置信息
  that.layero.data('config', config);

  // 自动关闭
  config.time <= 0 || setTimeout(function(){
    layer$1.close(that.index);
  }, config.time);


  that.move().callback();
  setAnim(that.layero);
};

// 当前实例的 resize 事件
Class$e.pt.resize = function(){
  var that = this;
  var config = that.config;

  that.offset();
  (/^\d+%$/.test(config.area[0]) || /^\d+%$/.test(config.area[1])) && that.auto(that.index);
  config.type == 4 && that.tips();
};

// 自适应
Class$e.pt.auto = function(index){
  var that = this, config = that.config, layero = jquery('#'+ doms[0] + index);

  if((config.area[0] === '' || config.area[0] === 'auto') && config.maxWidth > 0){
    // 适配 ie7
    if(layer$1.ie && layer$1.ie < 8 && config.btn){
      layero.width(layero.innerWidth());
    }
    layero.outerWidth() > config.maxWidth && layero.width(config.maxWidth);
  }

  var area = [layero.innerWidth(), layero.innerHeight()];
  var titHeight = layero.find(doms[1]).outerHeight() || 0;
  var btnHeight = layero.find('.'+doms[6]).outerHeight() || 0;
  var setHeight = function(elem){
    elem = layero.find(elem);
    elem.height(area[1] - titHeight - btnHeight - 2*(parseFloat(elem.css('padding-top'))|0));
  };

  switch(config.type){
    case 2:
      setHeight('iframe');
    break;
    default:
      if(config.area[1] === '' || config.area[1] === 'auto'){
        if(config.maxHeight > 0 && layero.outerHeight() > config.maxHeight){
          area[1] = config.maxHeight;
          setHeight('.'+doms[5]);
        } else if(config.fixed && area[1] >= win.height()){
          area[1] = win.height();
          setHeight('.'+doms[5]);
        }
      } else {
        setHeight('.'+doms[5]);
      }
    break;
  }

  return that;
};

// 计算坐标
Class$e.pt.offset = function(){
  var that = this, config = that.config, layero = that.layero;
  var area = [layero.outerWidth(), layero.outerHeight()];
  var type = typeof config.offset === 'object';
  that.offsetTop = (win.height() - area[1])/2;
  that.offsetLeft = (win.width() - area[0])/2;

  if(type){
    that.offsetTop = config.offset[0];
    that.offsetLeft = config.offset[1]||that.offsetLeft;
  } else if(config.offset !== 'auto'){

    if(config.offset === 't'){ // 上
      that.offsetTop = 0;
    } else if(config.offset === 'r'){ // 右
      that.offsetLeft = win.width() - area[0];
    } else if(config.offset === 'b'){ // 下
      that.offsetTop = win.height() - area[1];
    } else if(config.offset === 'l'){ // 左
      that.offsetLeft = 0;
    } else if(config.offset === 'lt'){ // 左上
      that.offsetTop = 0;
      that.offsetLeft = 0;
    } else if(config.offset === 'lb'){ // 左下
      that.offsetTop = win.height() - area[1];
      that.offsetLeft = 0;
    } else if(config.offset === 'rt'){ // 右上
      that.offsetTop = 0;
      that.offsetLeft = win.width() - area[0];
    } else if(config.offset === 'rb'){ // 右下
      that.offsetTop = win.height() - area[1];
      that.offsetLeft = win.width() - area[0];
    } else {
      that.offsetTop = config.offset;
    }

  }

  if(!config.fixed){
    that.offsetTop = /%$/.test(that.offsetTop) ?
      win.height()*parseFloat(that.offsetTop)/100
    : parseFloat(that.offsetTop);
    that.offsetLeft = /%$/.test(that.offsetLeft) ?
      win.width()*parseFloat(that.offsetLeft)/100
    : parseFloat(that.offsetLeft);
    that.offsetTop += win.scrollTop();
    that.offsetLeft += win.scrollLeft();
  }

  // 最小化窗口时的自适应
  if(layero.data('maxminStatus') === 'min'){
    that.offsetTop = win.height() - (layero.find(doms[1]).outerHeight() || 0);
    that.offsetLeft = layero.css('left');
  }

  // 设置坐标
  layero.css({
    top: that.offsetTop,
    left: that.offsetLeft
  });
};

// Tips
Class$e.pt.tips = function(){
  var that = this, config = that.config, layero = that.layero;
  var layArea = [layero.outerWidth(), layero.outerHeight()], follow = jquery(config.follow);
  if(!follow[0]) follow = jquery('body');
  var goal = {
    width: follow.outerWidth(),
    height: follow.outerHeight(),
    top: follow.offset().top,
    left: follow.offset().left
  }, tipsG = layero.find('.layui-layer-TipsG');

  var guide = config.tips[0];
  config.tips[1] || tipsG.remove();

  goal.autoLeft = function(){
    if(goal.left + layArea[0] - win.width() > 0){
      goal.tipLeft = goal.left + goal.width - layArea[0];
      tipsG.css({right: 12, left: 'auto'});
    } else {
      goal.tipLeft = goal.left;
    }
  };

  // 辨别 tips 的方位
  // 21 为箭头大小 8*2 + 箭头相对父元素的top偏移 5
  goal.where = [function(){ // 上
    goal.autoLeft();
    goal.tipTop = goal.top - layArea[1] - 10;
    tipsG.removeClass('layui-layer-TipsB').addClass('layui-layer-TipsT').css('border-right-color', config.tips[1]);
  }, function(){ // 右
    goal.tipLeft = goal.left + goal.width + 10;
    goal.tipTop = goal.top - (goal.height * 0.75 < 21 ? 21 - goal.height * 0.5 : 0);
    goal.tipTop = Math.max(goal.tipTop, 0);
    tipsG.removeClass('layui-layer-TipsL').addClass('layui-layer-TipsR').css('border-bottom-color', config.tips[1]);
  }, function(){ // 下
    goal.autoLeft();
    goal.tipTop = goal.top + goal.height + 10;
    tipsG.removeClass('layui-layer-TipsT').addClass('layui-layer-TipsB').css('border-right-color', config.tips[1]);
  }, function(){ // 左
    goal.tipLeft = goal.left - layArea[0] - 10;
    goal.tipTop = goal.top - (goal.height * 0.75 < 21 ? 21 - goal.height * 0.5 : 0);
    goal.tipTop = Math.max(goal.tipTop, 0);
    tipsG.removeClass('layui-layer-TipsR').addClass('layui-layer-TipsL').css('border-bottom-color', config.tips[1]);
  }];
  goal.where[guide-1]();

  /* 8*2为小三角形占据的空间 */
  if(guide === 1){
    goal.top - (win.scrollTop() + layArea[1] + 8*2) < 0 && goal.where[2]();
  } else if(guide === 2){
    win.width() - (goal.left + goal.width + layArea[0] + 8*2) > 0 || goal.where[3]();
  } else if(guide === 3){
    (goal.top - win.scrollTop() + goal.height + layArea[1] + 8*2) - win.height() > 0 && goal.where[0]();
  } else if(guide === 4){
     layArea[0] + 8*2 - goal.left > 0 && goal.where[1]();
  }

  layero.find('.'+doms[5]).css({
    'background-color': config.tips[1],
    'padding-right': (config.closeBtn ? '30px' : '')
  });
  layero.css({
    left: goal.tipLeft - (config.fixed ? win.scrollLeft() : 0),
    top: goal.tipTop  - (config.fixed ? win.scrollTop() : 0)
  });
};

// 拖拽层
Class$e.pt.move = function(){
  var that = this;
  var config = that.config;
  var _DOC = jquery(document);
  var layero = that.layero;
  var DATA_NAME = ['LAY_MOVE_DICT', 'LAY_RESIZE_DICT'];
  var moveElem = layero.find(config.move);
  var resizeElem = layero.find('.layui-layer-resize');

  // 给指定元素添加拖动光标
  if(config.move) moveElem.css('cursor', 'move');

  // 按下拖动元素
  moveElem.on('mousedown', function(e){
    if (e.button) {return;} // 不是左键不处理
    var othis = jquery(this);
    var dict = {};

    if(config.move){
      dict.layero = layero;
      dict.config = config;
      dict.offset = [
        e.clientX - parseFloat(layero.css('left')),
        e.clientY - parseFloat(layero.css('top'))
      ];

      othis.data(DATA_NAME[0], dict);
      ready$1.eventMoveElem = othis;
      ready$1.moveElem.css('cursor', 'move').show();
    }

    e.preventDefault();
  });

  // 按下右下角拉伸
  resizeElem.on('mousedown', function(e){
    var othis = jquery(this);
    var dict = {};

    if(config.resize){
      dict.layero = layero;
      dict.config = config;
      dict.offset = [e.clientX, e.clientY];
      dict.index = that.index;
      dict.area = [
        layero.outerWidth()
        ,layero.outerHeight()
      ];

      othis.data(DATA_NAME[1], dict);
      ready$1.eventResizeElem = othis;
      ready$1.moveElem.css('cursor', 'se-resize').show();
    }

    e.preventDefault();
  });

  // 拖动元素，避免多次调用实例造成事件叠加
  if(ready$1.docEvent) return that;
  _DOC.on('mousemove', function(e){
    // 拖拽移动
    if(ready$1.eventMoveElem){
      var dict = ready$1.eventMoveElem.data(DATA_NAME[0]) || {}
      ,layero = dict.layero
      ,config = dict.config;

      var X = e.clientX - dict.offset[0];
      var Y = e.clientY - dict.offset[1];
      var fixed = layero.css('position') === 'fixed';

      e.preventDefault();

      dict.stX = fixed ? 0 : win.scrollLeft();
      dict.stY = fixed ? 0 : win.scrollTop();

      // 控制元素不被拖出窗口外
      if(!config.moveOut){
        var setRig = win.width() - layero.outerWidth() + dict.stX;
        var setBot = win.height() - layero.outerHeight() + dict.stY;
        X < dict.stX && (X = dict.stX);
        X > setRig && (X = setRig);
        Y < dict.stY && (Y = dict.stY);
        Y > setBot && (Y = setBot);
      }

      // 拖动时跟随鼠标位置
      layero.css({
        left: X,
        top: Y
      });
    }

    // Resize
    if(ready$1.eventResizeElem){
      var dict = ready$1.eventResizeElem.data(DATA_NAME[1]) || {};
      var config = dict.config;

      var X = e.clientX - dict.offset[0];
      var Y = e.clientY - dict.offset[1];

      e.preventDefault();

      // 拉伸宽高
      layer$1.style(dict.index, {
        width: dict.area[0] + X
        ,height: dict.area[1] + Y
      });

      config.resizing && config.resizing(dict.layero);
    }
  }).on('mouseup', function(e){
    if(ready$1.eventMoveElem){
      var dict = ready$1.eventMoveElem.data(DATA_NAME[0]) || {};
      var config = dict.config;

      ready$1.eventMoveElem.removeData(DATA_NAME[0]);
      delete ready$1.eventMoveElem;
      ready$1.moveElem.hide();
      config.moveEnd && config.moveEnd(dict.layero);
    }
    if(ready$1.eventResizeElem){
      ready$1.eventResizeElem.removeData(DATA_NAME[1]);
      delete ready$1.eventResizeElem;
      ready$1.moveElem.hide();
    }
  });

  ready$1.docEvent = true; // 已给 document 执行全局事件
  return that;
};

Class$e.pt.btnLoading = function(btnElem, isLoading){
  if(isLoading){
    var loadingTpl = '<i class="layui-layer-btn-loading-icon layui-icon layui-icon-loading layui-anim layui-anim-rotate layui-anim-loop"></i>';
    if(btnElem.find('.layui-layer-btn-loading-icon')[0]) return;
    btnElem.addClass('layui-layer-btn-is-loading').attr({disabled: ''}).prepend(loadingTpl);
  }else {
    btnElem.removeClass('layui-layer-btn-is-loading').removeAttr('disabled').find('.layui-layer-btn-loading-icon').remove();
  }
};

Class$e.pt.callback = function(){
  var that = this, layero = that.layero, config = that.config;
  that.openLayer();
  if(config.success){
    if(config.type == 2){
      layero.find('iframe').on('load', function(){
        config.success(layero, that.index, that);
      });
    } else {
      config.success(layero, that.index, that);
    }
  }
  layer$1.ie == 6 && that.IE6(layero);

  // 按钮
  layero.find('.'+ doms[6]).children('a').on('click', function(){
    var btnElem = jquery(this);
    var index = btnElem.index();
    if(btnElem.attr('disabled')) return;

    // 若为异步按钮
    if(config.btnAsync){
      var btnCallback = index === 0 ? (config.yes || config['btn1']) : config['btn'+(index+1)];
      that.loading = function(isLoading){
        that.btnLoading(btnElem, isLoading);
      };

      if(btnCallback){
        ready$1.promiseLikeResolve(btnCallback.call(config, that.index, layero, that))
          .then(function(result){
            if(result !== false){
              layer$1.close(that.index);
            }
          }, function(reason){
             reason !== undefined && window.console && window.console.error('layer error hint: ' + reason);
          });
      }else {
        layer$1.close(that.index);
      }
    } else { // 普通按钮
      if(index === 0){
        if(config.yes){
          config.yes(that.index, layero, that);
        } else if(config['btn1']){
          config['btn1'](that.index, layero, that);
        } else {
          layer$1.close(that.index);
        }
      } else {
        var close = config['btn'+(index+1)] && config['btn'+(index+1)](that.index, layero, that);
        close === false || layer$1.close(that.index);
      }
    }
  });

  // 取消
  function cancel(){
    var close = config.cancel && config.cancel(that.index, layero, that);
    close === false || layer$1.close(that.index);
  }

  // 右上角关闭回调
  layero.find('.'+ doms[7]).on('click', cancel);

  // 点遮罩关闭
  if(config.shadeClose){
    that.shadeo.on('click', function(){
      layer$1.close(that.index);
    });
  }

  // 最小化
  layero.find('.layui-layer-min').on('click', function(){
    var min = config.min && config.min(layero, that.index, that);
    min === false || layer$1.min(that.index, config);
  });

  // 全屏/还原
  layero.find('.layui-layer-max').on('click', function(){
    if(jquery(this).hasClass('layui-layer-maxmin')){
      layer$1.restore(that.index);
      config.restore && config.restore(layero, that.index, that);
    } else {
      layer$1.full(that.index, config);
      setTimeout(function(){
        config.full && config.full(layero, that.index, that);
      }, 100);
    }
  });

  config.end && (ready$1.end[that.index] = config.end);
  config.beforeEnd && (ready$1.beforeEnd[that.index] = jquery.proxy(config.beforeEnd, config, layero, that.index, that));
};

// for ie6 恢复 select
ready$1.reselect = function(){
  jquery.each(jquery('select'), function(index , value){
    var sthis = jquery(this);
    if(!sthis.parents('.'+doms[0])[0]){
      (sthis.attr('layer') == 1 && jquery('.'+doms[0]).length < 1) && sthis.removeAttr('layer').show();
    }
    sthis = null;
  });
};

Class$e.pt.IE6 = function(layero){
  // 隐藏select
  jquery('select').each(function(index , value){
    var sthis = jquery(this);
    if(!sthis.parents('.'+doms[0])[0]){
      sthis.css('display') === 'none' || sthis.attr({'layer' : '1'}).hide();
    }
    sthis = null;
  });
};

// 需依赖原型的对外方法
Class$e.pt.openLayer = function(){
  var that = this;

  // 置顶当前窗口
  layer$1.zIndex = that.config.zIndex;
  layer$1.setTop = function(layero){
    var setZindex = function(){
      layer$1.zIndex++;
      layero.css('z-index', layer$1.zIndex + 1);
    };
    layer$1.zIndex = parseInt(layero[0].style.zIndex);
    layero.on('mousedown', setZindex);
    return layer$1.zIndex;
  };
};

// 记录宽高坐标，用于还原
ready$1.record = function(layero){
  if(!layero[0]) return window.console && console.error('index error');
  var type = layero.attr('type');
  var contentElem = layero.find('.layui-layer-content');
  var contentRecordHeightElem = type === ready$1.type[2] ? contentElem.children('iframe') : contentElem;
  var area = [
    layero[0].style.width || ready$1.getStyle(layero[0], 'width'),
    layero[0].style.height || ready$1.getStyle(layero[0], 'height'),
    layero.position().top,
    layero.position().left + parseFloat(layero.css('margin-left'))
  ];
  layero.find('.layui-layer-max').addClass('layui-layer-maxmin');
  layero.attr({area: area});
  contentElem.data(RECORD_HEIGHT_KEY, ready$1.getStyle(contentRecordHeightElem[0], 'height'));
};

// 设置页面滚动条
ready$1.setScrollbar = function(index){
  doms.html.css('overflow', 'hidden');
};

// 恢复页面滚动条
ready$1.restScrollbar = function(index) {
  if(!doms.html.css('overflow')) return;

  // 关闭和大小化, layer-full 处理
  var targetEl = jquery('.'+ doms[0]).filter(function(){
    var layero = jquery(this);
    var options = layero.data('config') || {};
    return options.scrollbar === false
      && layero.data('maxminStatus') !== 'min'
      && layero.attr('times') !== String(index);
  });
  if(targetEl.length === 0){
    doms.html.css('overflow', '');
  }
};

// 类似 Promise.resolve
ready$1.promiseLikeResolve = function(value){
  var deferred = jquery.Deferred();

  if(value && typeof value.then === 'function'){
    value.then(deferred.resolve, deferred.reject);
  }else {
    deferred.resolve(value);
  }
  return deferred.promise();
};

/** 内置成员 */

window.layer = layer$1;

// 获取子 iframe 的 DOM
layer$1.getChildFrame = function(selector, index){
  index = index || jquery('.'+doms[4]).attr('times');
  return jquery('#'+ doms[0] + index).find('iframe').contents().find(selector);
};

// 得到当前 iframe 层的索引，子 iframe 时使用
layer$1.getFrameIndex = function(name){
  if(!name) return;
  return jquery('#'+ name).parents('.'+doms[4]).attr('times');
};

// iframe 层自适应宽高
layer$1.iframeAuto = function(index){
  if(!index) return;
  var heg = layer$1.getChildFrame('html', index).outerHeight();
  var layero = jquery('#'+ doms[0] + index);
  var titHeight = layero.find(doms[1]).outerHeight() || 0;
  var btnHeight = layero.find('.'+doms[6]).outerHeight() || 0;
  layero.css({height: heg + titHeight + btnHeight});
  layero.find('iframe').css({height: heg});
};

// 重置 iframe url
layer$1.iframeSrc = function(index, url){
  jquery('#'+ doms[0] + index).find('iframe').attr('src', url);
};

// 设定层的样式
layer$1.style = function(index, options, limit){
  var layero = jquery('#'+ doms[0] + index);
  var contentElem = layero.find('.layui-layer-content');
  var type = layero.attr('type');
  var titHeight = layero.find(doms[1]).outerHeight() || 0;
  var btnHeight = layero.find('.'+doms[6]).outerHeight() || 0;
  layero.attr('minLeft');

  // loading 和 tips 层不允许更改
  if(type === ready$1.type[3] || type === ready$1.type[4]){
    return;
  }

  if(!limit){
    if(parseFloat(options.width) <= 260){
      options.width = 260;
    }

    if(parseFloat(options.height) - titHeight - btnHeight <= 64){
      options.height = 64 + titHeight + btnHeight;
    }
  }
  layero.css(options);
  btnHeight = layero.find('.'+doms[6]).outerHeight() || 0;

  if(type === ready$1.type[2]){
    layero.find('iframe').css({
      height: (typeof options.height === 'number' ? options.height : layero.height()) - titHeight - btnHeight
    });
  } else {
    contentElem.css({
      height: (typeof options.height === 'number' ? options.height : layero.height()) - titHeight - btnHeight
      - parseFloat(contentElem.css('padding-top'))
      - parseFloat(contentElem.css('padding-bottom'))
    });
  }
};

// 最小化
layer$1.min = function(index, options){
  var layero = jquery('#'+ doms[0] + index);
  var maxminStatus = layero.data('maxminStatus');

  if(maxminStatus === 'min') return; // 当前的状态是否已经是最小化
  if(maxminStatus === 'max') layer$1.restore(index); // 若当前为最大化，则先还原后再最小化

  layero.data('maxminStatus', 'min');
  options = options || layero.data('config') || {};

  var shadeo = jquery('#'+ doms.SHADE + index);
  var elemMin = layero.find('.layui-layer-min');
  var titHeight = layero.find(doms[1]).outerHeight() || 0;
  var minLeft = layero.attr('minLeft'); // 最小化时的横坐标
  var hasMinLeft = typeof minLeft === 'string'; // 是否已经赋值过最小化坐标
  var left = hasMinLeft ? minLeft : (181*ready$1.minStackIndex)+'px';
  var position = layero.css('position');
  var minWidth = 180; // 最小化时的宽度
  var settings = {
    width: minWidth
    ,height: titHeight
    ,position: 'fixed'
    ,overflow: 'hidden'
  };

  ready$1.record(layero);  // 记录当前尺寸、坐标，用于还原

  // 简易最小化补位
  if(ready$1.minStackArr.length > 0){
    left = ready$1.minStackArr[0];
    ready$1.minStackArr.shift();
  }

  // left 是否超出边界
  if(parseFloat(left) + minWidth  > win.width()){
    left = win.width() - minWidth - function(){
      ready$1.minStackArr.edgeIndex = ready$1.minStackArr.edgeIndex || 0;
      return ready$1.minStackArr.edgeIndex += 3;
    }();
    if(left < 0) left = 0;
  }

  // 是否堆叠在左下角
  if(options.minStack){
    settings.left = left;
    settings.top = win.height() - titHeight;
    hasMinLeft || ready$1.minStackIndex++; // 若未赋值过最小化坐标，则最小化操作索引自增
    layero.attr('minLeft', left);
  }

  layero.attr('position', position);
  layer$1.style(index, settings, true);

  elemMin.hide();
  layero.attr('type') === 'page' && layero.find(doms[4]).hide();
  ready$1.restScrollbar(index);

  // 隐藏遮罩
  shadeo.hide();
};

// 还原
layer$1.restore = function(index){
  var layero = jquery('#'+ doms[0] + index);
  var shadeo = jquery('#'+ doms.SHADE + index);
  var contentElem = layero.find('.layui-layer-content');
  var area = layero.attr('area').split(',');
  var type = layero.attr('type');
  var options = layero.data('config') || {};
  var contentRecordHeight = contentElem.data(RECORD_HEIGHT_KEY);

  layero.removeData('maxminStatus'); // 移除最大最小状态

  // 恢复原来尺寸
  layer$1.style(index, {
    width: area[0], // 数值或百分比
    height: area[1],
    top: parseFloat(area[2]),
    left: parseFloat(area[3]),
    position: layero.attr('position'),
    overflow: 'visible'
  }, true);

  layero.find('.layui-layer-max').removeClass('layui-layer-maxmin');
  layero.find('.layui-layer-min').show();
  type === 'page' && layero.find(doms[4]).show();

  // 恢复页面滚动条弹层打开时的状态
  options.scrollbar ? ready$1.restScrollbar(index) : ready$1.setScrollbar(index);

  // #1604
  if(contentRecordHeight !== undefined){
    contentElem.removeData(RECORD_HEIGHT_KEY);
    var contentRecordHeightElem = type === ready$1.type[2] ? contentElem.children('iframe') : contentElem;
    contentRecordHeightElem.css({height: contentRecordHeight});
  }

  // 恢复遮罩
  shadeo.show();
  // ready.events.resize[index](); // ?
};

// 全屏（最大化）
layer$1.full = function(index){
  var layero = jquery('#'+ doms[0] + index);
  var maxminStatus = layero.data('maxminStatus');

  if(maxminStatus === 'max') return // 检查当前的状态是否已经是最大化
  if(maxminStatus === 'min') layer$1.restore(index); // 若当前为最小化，则先还原后再最大化

  layero.data('maxminStatus', 'max');
  ready$1.record(layero); // 记录当前尺寸、坐标

  ready$1.setScrollbar(index);

  setTimeout(function(){
    var isfix = layero.css('position') === 'fixed';
    layer$1.style(index, {
      top: isfix ? 0 : win.scrollTop(),
      left: isfix ? 0 : win.scrollLeft(),
      width: '100%',
      height: '100%'
    }, true);
    layero.find('.layui-layer-min').hide();
  }, 100);
};

// 改变 title
layer$1.title = function(name, index){
  var title = jquery('#'+ doms[0] + (index || layer$1.index)).find(doms[1]);
  title.html(name);
};

// 关闭 layer 总方法
layer$1.close = function(index, callback){
  var layero = function(){
    var closest = jquery('.'+ doms[0]).children('#'+ index).closest('.'+ doms[0]);
    return closest[0] ? (
      index = closest.attr('times'),
      closest
    ) : jquery('#'+ doms[0] + index)
  }();
  var type = layero.attr('type');
  var options = layero.data('config') || {};
  var hideOnClose = options.id && options.hideOnClose; // 是否关闭时移除弹层容器

  if(!layero[0]) return;

  var executor = function(){
    // 关闭动画
    var closeAnim = ({
      slideDown: 'layer-anim-slide-down-out',
      slideLeft: 'layer-anim-slide-left-out',
      slideUp: 'layer-anim-slide-up-out',
      slideRight: 'layer-anim-slide-right-out'
    })[options.anim] || 'layer-anim-close';

    // 移除主容器
    var remove = function(){
      var WRAP = 'layui-layer-wrap';

      // 是否关闭时隐藏弹层容器
      if(hideOnClose){
        layero.removeClass('layer-anim '+ closeAnim);
        return layero.hide();
      }

      // 是否为页面捕获层
      if(type === ready$1.type[1] && layero.attr('conType') === 'object'){
        layero.children(':not(.'+ doms[5] +')').remove();
        var wrap = layero.find('.'+WRAP);
        for(var i = 0; i < 2; i++){
          wrap.unwrap();
        }
        wrap.css('display', wrap.data('display')).removeClass(WRAP);
      } else {
        // 低版本 IE 回收 iframe
        if(type === ready$1.type[2]){
          try {
            var iframe = jquery('#'+ doms[4] + index)[0];
            iframe.contentWindow.document.write('');
            iframe.contentWindow.close();
            layero.find('.'+doms[5])[0].removeChild(iframe);
          } catch(e){}
        }
        layero[0].innerHTML = '';
        layero.remove();
      }

      typeof ready$1.end[index] === 'function' && ready$1.end[index]();
      delete ready$1.end[index];
      typeof callback === 'function' && callback();

      // 移除 reisze 事件
      if(ready$1.events.resize[index]){
        win.off('resize', ready$1.events.resize[index]);
        delete ready$1.events.resize[index];
      }
    };
    // 移除遮罩
    var shadeo = jquery('#'+ doms.SHADE + index);
    if((layer$1.ie && layer$1.ie < 10) || !options.isOutAnim){
      shadeo[hideOnClose ? 'hide' : 'remove']();
    }else {
      shadeo.css({opacity: 0});
      setTimeout(function(){
        shadeo[hideOnClose ? 'hide' : 'remove']();
      }, 350);
    }

    // 是否允许关闭动画
    if(options.isOutAnim){
      layero.addClass('layer-anim '+ closeAnim);
    }

    layer$1.ie == 6 && ready$1.reselect();
    ready$1.restScrollbar(index);

    // 记住被关闭层的最小化堆叠坐标
    if(typeof layero.attr('minLeft') === 'string'){
      ready$1.minStackIndex--;
      ready$1.minStackArr.push(layero.attr('minLeft'));
    }

    if((layer$1.ie && layer$1.ie < 10) || !options.isOutAnim){
      remove();
    } else {
      setTimeout(function(){
        remove();
      }, 200);
    }
  };

  if(!hideOnClose && typeof ready$1.beforeEnd[index] === 'function'){
    ready$1.promiseLikeResolve(ready$1.beforeEnd[index]())
      .then(function(result){
        if(result !== false){
          delete ready$1.beforeEnd[index];
          executor();
        }
      }, function(reason){
        reason !== undefined && window.console && window.console.error('layer error hint: ' + reason);
      });
  }else {
    delete ready$1.beforeEnd[index];
    executor();
  }
};

// 关闭所有层
layer$1.closeAll = function(type, callback){
  if(typeof type === 'function'){
    callback = type;
    type = null;
  }
  var domsElem = jquery('.'+doms[0]);
  jquery.each(domsElem, function(_index){
    var othis = jquery(this);
    var is = type ? (othis.attr('type') === type) : 1;
    is && layer$1.close(othis.attr('times'), _index === domsElem.length - 1 ? callback : null);
    is = null;
  });
  if(domsElem.length === 0) typeof callback === 'function' && callback();
};

// 根据弹层类型关闭最近打开的层
layer$1.closeLast = function(type, callback){
  var layerIndexList = [];
  var isArrayType = jquery.isArray(type);
  jquery(typeof type === 'string' ? '.layui-layer-' + type : '.layui-layer').each(function(i, el){
    var layero = jquery(el);
    var shouldSkip = (isArrayType && type.indexOf(layero.attr('type')) === -1) || layero.css('display') === 'none';
    if(shouldSkip) return true;
    layerIndexList.push(Number(layero.attr('times')));
  });
  if(layerIndexList.length > 0){
    var layerIndexMax = Math.max.apply(null, layerIndexList);
    layer$1.close(layerIndexMax, callback);
  }
};


/*
 * 拓展模块，layui 开始合并在一起
 */


var cache = layer$1.cache || {};
var skin = function(type){
  return (cache.skin ? (' ' + cache.skin + ' ' + cache.skin + '-'+type) : '');
};

// 仿系统 prompt
layer$1.prompt = function(options, yes){
  var style = '', placeholder = '';
  options = options || {};

  if(typeof options === 'function') yes = options;

  if(options.area){
    var area = options.area;
    style = 'style="width: '+ area[0] +'; height: '+ area[1] + ';"';
    delete options.area;
  }
  if (options.placeholder) {
    placeholder = ' placeholder="' + options.placeholder + '"';
  }
  var prompt, content = options.formType == 2 ? '<textarea class="layui-layer-input"' + style + placeholder + '></textarea>' : function () {
    return '<input type="' + (options.formType == 1 ? 'password' : 'text') + '" class="layui-layer-input"' + placeholder + '>';
  }();

  var success = options.success;
  delete options.success;

  return layer$1.open(jquery.extend({
    type: 1,
    btn: ['确定','取消'],
    content: content,
    skin: 'layui-layer-prompt' + skin('prompt'),
    maxWidth: win.width(),
    success: function(layero){
      prompt = layero.find('.layui-layer-input');
      prompt.val(options.value || '').focus();
      typeof success === 'function' && success(layero);
    },
    resize: false,
    yes: function(index){
      var value = prompt.val();
      if(value.length > (options.maxlength||500)) {
        layer$1.tips('最多输入'+ (options.maxlength || 500) +'个字符', prompt, {tips: 1});
      } else {
        yes && yes(value, index, prompt);
      }
    }
  }, options));
};

// tab 层
layer$1.tab = function(options){
  options = options || {};

  var tab = options.tab || {};
  var THIS = 'layui-this';
  var success = options.success;

  delete options.success;

  return layer$1.open(jquery.extend({
    type: 1,
    skin: 'layui-layer-tab' + skin('tab'),
    resize: false,
    title: function(){
      var len = tab.length, ii = 1, str = '';
      if(len > 0){
        str = '<span class="'+ THIS +'">'+ tab[0].title +'</span>';
        for(; ii < len; ii++){
          str += '<span>'+ tab[ii].title +'</span>';
        }
      }
      return str;
    }(),
    content: '<ul class="layui-layer-tabmain">'+ function(){
      var len = tab.length, ii = 1, str = '';
      if(len > 0){
        str = '<li class="layui-layer-tabli '+ THIS +'">'+ (tab[0].content || 'no content') +'</li>';
        for(; ii < len; ii++){
          str += '<li class="layui-layer-tabli">'+ (tab[ii].content || 'no  content') +'</li>';
        }
      }
      return str;
    }() +'</ul>',
    success: function(layero){
      var btn = layero.find('.layui-layer-title').children();
      var main = layero.find('.layui-layer-tabmain').children();
      btn.on('mousedown', function(e){
        e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
        var othis = jquery(this), index = othis.index();
        othis.addClass(THIS).siblings().removeClass(THIS);
        main.eq(index).show().siblings().hide();
        typeof options.change === 'function' && options.change(index);
      });
      typeof success === 'function' && success(layero);
    }
  }, options));
};

// 图片层
layer$1.photos = function(options, loop, key){
  var dict = {};

  // 默认属性
  options = jquery.extend(true, {
    toolbar: true,
    footer: true
  }, options);

  if(!options.photos) return;

  // 若 photos 并非选择器或 jQuery 对象，则为普通 object
  var isObject = !(typeof options.photos === 'string' || options.photos instanceof jquery);
  var photos = isObject ? options.photos : {};
  var data = photos.data || [];
  var start = photos.start || 0;
  var success = options.success;

  dict.imgIndex = (start|0) + 1;
  options.img = options.img || 'img';
  delete options.success;

  // 若 options.photos 不是一个对象
  if(!isObject){ // 页面直接获取
    var parent = jquery(options.photos), pushData = function(){
      data = [];
      parent.find(options.img).each(function(index){
        var othis = jquery(this);
        othis.attr('layer-index', index);
        data.push({
          alt: othis.attr('alt'),
          pid: othis.attr('layer-pid'),
          src: othis.attr('lay-src') || othis.attr('layer-src') || othis.attr('src'),
          thumb: othis.attr('src')
        });
      });
    };

    pushData();

    loop || parent.on('click', options.img, function(){
      pushData();
      var othis = jquery(this), index = othis.attr('layer-index');
      layer$1.photos(jquery.extend(options, {
        photos: {
          start: index,
          data: data,
          tab: options.tab
        },
        full: options.full
      }), true);
    });

    // 不直接弹出
    if (!loop) return;
  } else if (data.length === 0){
    return layer$1.msg('没有图片');
  }

  // 上一张
  dict.imgprev = function(key){
    dict.imgIndex--;
    if(dict.imgIndex < 1){
      dict.imgIndex = data.length;
    }
    dict.tabimg(key);
  };

  // 下一张
  dict.imgnext = function(key,errorMsg){
    dict.imgIndex++;
    if(dict.imgIndex > data.length){
      dict.imgIndex = 1;
      if (errorMsg) {return}
    }
    dict.tabimg(key);
  };

  // 方向键
  dict.keyup = function(event){
    if(!dict.end){
      var code = event.keyCode;
      event.preventDefault();
      if(code === 37){
        dict.imgprev(true);
      } else if(code === 39) {
        dict.imgnext(true);
      } else if(code === 27) {
        layer$1.close(dict.index);
      }
    }
  };

  // 切换
  dict.tabimg = function(key){
    if(data.length <= 1) return;
    photos.start = dict.imgIndex - 1;
    layer$1.close(dict.index);
    return layer$1.photos(options, true, key);
  };

  dict.isNumber = function (n) {
    return typeof n === 'number' && !isNaN(n);
  };

  dict.image = {};

  dict.getTransform = function(opts){
    var transforms = [];
    var rotate = opts.rotate;
    var scaleX = opts.scaleX;
    var scale = opts.scale;

    if (dict.isNumber(rotate) && rotate !== 0) {
      transforms.push('rotate(' + rotate + 'deg)');
    }

    if (dict.isNumber(scaleX) && scaleX !== 1) {
      transforms.push('scaleX(' + scaleX + ')');
    }

    if (dict.isNumber(scale)) {
      transforms.push('scale(' + scale + ')');
    }

    return transforms.length ? transforms.join(' ') : 'none';
  };

  // 一些动作
  dict.event = function(layero, index, that){
    // 上一张
    dict.main.find('.layui-layer-photos-prev').on('click', function(event){
      event.preventDefault();
      dict.imgprev(true);
    });

    // 下一张
    dict.main.find('.layui-layer-photos-next').on('click', function(event){
      event.preventDefault();
      dict.imgnext(true);
    });

    jquery(document).on('keyup', dict.keyup);

    // 头部工具栏事件
    layero.off('click').on('click','*[toolbar-event]', function () {
      var othis = jquery(this);
      var event = othis.attr('toolbar-event');
      switch (event) {
        case 'rotate':
          dict.image.rotate = ((dict.image.rotate || 0) + Number(othis.attr('data-option'))) % 360;
          dict.imgElem.css({
            transform: dict.getTransform(dict.image)
          });
          break;
        case 'scalex':
          dict.image.scaleX = dict.image.scaleX === -1 ? 1 : -1;
          dict.imgElem.css({
            transform: dict.getTransform(dict.image)
          });
          break;
        case 'zoom':
          var ratio = Number(othis.attr('data-option'));
          dict.image.scale = (dict.image.scale || 1) + ratio;
          // 缩小状态最小值
          if (ratio < 0 && dict.image.scale < 0 - ratio) {
            dict.image.scale = 0 - ratio;
          }
          dict.imgElem.css({
            transform: dict.getTransform(dict.image)
          });
          break;
        case 'reset':
          dict.image.scaleX = 1;
          dict.image.scale = 1;
          dict.image.rotate = 0;
          dict.imgElem.css({
            transform: 'none'
          });
          break;
        case 'close':
          layer$1.close(index);
          break;
      }
      that.offset();
      that.auto(index);
    });

    // 鼠标滚轮缩放图片事件
    dict.main.on('mousewheel DOMMouseScroll', function(e) {
      var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail;
      var zoomElem = dict.main.find('[toolbar-event="zoom"]');
      if (delta > 0) {
        zoomElem.eq(0).trigger('click');
      } else {
        zoomElem.eq(1).trigger('click');
      }
      e.preventDefault();
    });

    // 滑动切换图片事件，仅限 layui 中
    if(window.layui || window.lay){
      var lay = window.layui.lay || window.lay;
      var touchEndCallback = function(e, state){
        var duration = Date.now() - state.timeStart;
        var speed = state.distanceX / duration;
        var threshold = win.width() / 3;
        var shouldSwipe = Math.abs(speed) > 0.25 || Math.abs(state.distanceX) > threshold;
        if(!shouldSwipe) return;
        if(state.direction === 'left'){
          dict.imgnext(true);
        }else if(state.direction === 'right'){
          dict.imgprev(true);
        }
      };

      jquery.each([that.shadeo, dict.main], function(i, elem){
        lay.touchSwipe(elem, {
          onTouchEnd: touchEndCallback
        });
      });
    }
  };

  // 图片预加载
  function loadImage(url, callback, error) {
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
  }

  dict.loadi = layer$1.load(1, {
    shade: 'shade' in options ? false : [0.9, undefined, 'unset'],
    scrollbar: false
  });

  loadImage(data[start].src, function(img){
    layer$1.close(dict.loadi);

    var alt = data[start].alt || '';

    // 切换图片时不出现动画
    if(key) options.anim = -1;

    // 弹出图片层
    dict.index = layer$1.open(jquery.extend({
      type: 1,
      id: 'layui-layer-photos',
      area: function(){
        var imgarea = [img.width, img.height];
        var winarea = [jquery(window).width() - 100, jquery(window).height() - 100];

        // 若实际图片的宽或者高比 屏幕大（那么进行缩放）
        if(!options.full && (imgarea[0]>winarea[0]||imgarea[1]>winarea[1])){
          var wh = [imgarea[0]/winarea[0],imgarea[1]/winarea[1]];// 取宽度缩放比例、高度缩放比例
          if(wh[0] > wh[1]){// 取缩放比例最大的进行缩放
            imgarea[0] = imgarea[0]/wh[0];
            imgarea[1] = imgarea[1]/wh[0];
          } else if(wh[0] < wh[1]){
            imgarea[0] = imgarea[0]/wh[1];
            imgarea[1] = imgarea[1]/wh[1];
          }
        }

        return [imgarea[0]+'px', imgarea[1]+'px'];
      }(),
      title: false,
      shade: [0.9, undefined, 'unset'],
      shadeClose: true,
      closeBtn: false,
      move: '.layer-layer-photos-main img',
      moveType: 1,
      scrollbar: false,
      moveOut: true,
      anim: 5,
      isOutAnim: false,
      skin: 'layui-layer-photos' + skin('photos'),
      content: '<div class="layer-layer-photos-main">'
        + '<img src="'+ data[start].src +'" alt="'+ alt +'" layer-pid="'+ (data[start].pid || '') +'">'
        + function(){
          var arr = ['<div class="layui-layer-photos-pointer">'];

          // 左右箭头翻页
          if (data.length > 1) {
            arr.push(['<div class="layer-layer-photos-page">',
              '<span class="layui-icon layui-icon-left layui-layer-photos-prev"></span>',
              '<span class="layui-icon layui-icon-right layui-layer-photos-next"></span>',
            '</div>'].join(''));
          }

          // 头部工具栏
          if (options.toolbar) {
            arr.push([
              '<div class="layui-layer-photos-toolbar layui-layer-photos-header">',
                '<span toolbar-event="rotate" data-option="90" title="旋转"><i class="layui-icon layui-icon-refresh"></i></span>',
                '<span toolbar-event="scalex" title="变换"><i class="layui-icon layui-icon-slider"></i></span>',
                '<span toolbar-event="zoom" data-option="0.1" title="放大"><i class="layui-icon layui-icon-add-circle"></i></span>',
                '<span toolbar-event="zoom" data-option="-0.1" title="缩小"><i class="layui-icon layui-icon-reduce-circle"></i></span>',
                '<span toolbar-event="reset" title="还原"><i class="layui-icon layui-icon-refresh-1"></i></span>',
                '<span toolbar-event="close" title="关闭"><i class="layui-icon layui-icon-close"></i></span>',
              '</div>'
            ].join(''));
          }

          // 底部栏
          if (options.footer) {
            arr.push(['<div class="layui-layer-photos-toolbar layui-layer-photos-footer">',
              '<h3>'+ alt +'</h3>',
              '<em>'+ dict.imgIndex +' / '+ data.length +'</em>',
              '<a href="'+ data[start].src +'" target="_blank">查看原图</a>',
            '</div>'].join(''));
          }

          arr.push('</div>');
          return arr.join('');
        }()
      +'</div>',
      success: function(layero, index, that){
        dict.main = layero.find('.layer-layer-photos-main');
        dict.footer = layero.find('.layui-layer-photos-footer');
        dict.imgElem = dict.main.children('img');
        dict.event(layero, index, that);
        options.tab && options.tab(data[start], layero);
        typeof success === 'function' && success(layero);
      }, end: function(){
        dict.end = true;
        jquery(document).off('keyup', dict.keyup);
      }
    }, options));
  }, function(){
    layer$1.close(dict.loadi);
    layer$1.msg('当前图片地址异常，<br>是否继续查看下一张？', {
      time: 30000,
      btn: ['下一张', '不看了'],
      yes: function(){
        data.length > 1 && dict.imgnext(true,true);
      }
    });
  });
};

// 主入口
ready$1.run = function(_$){
  var $ = _$;
  win = $(window);

  // 移动端兼容性处理
  // https://gitee.com/layui/layui/issues/I81WGC
  // https://github.com/jquery/jquery/issues/1729
  var agent = navigator.userAgent.toLowerCase();
  var isMobile = /android|iphone|ipod|ipad|ios/.test(agent);
  var _win = $(window);
  if(isMobile){
    $.each({Height: "height", Width: "width"}, function(propSuffix, funcName){
      var propName = 'inner' + propSuffix;
      win[funcName] = function(){
        return propName in window
          ? window[propName]
          : _win[funcName]()
      };
    });
  }
  doms.html = $('html');
  layer$1.open = function(deliver){
    var o = new Class$e(deliver);
    return o.index;
  };
};

    layer$1.ready();
    ready$1.run(jquery);

/** laydate 日期与时间控件 | MIT Licensed */


  var isLayui = window.layui && layui.define;
  var ready = {
    getPath: window.lay && lay.getPath ? lay.getPath : '',

    // 载入 CSS 依赖
    link: function (href, fn, cssname) {
      // 未设置路径，则不主动加载 css
      if (!laydate.path) return;

      // 加载 css
      if (window.lay && lay.layui) {
        lay.layui.link(laydate.path + href, fn, cssname);
      }
    }
  };

  // 识别预先可能定义的指定全局对象
  var GLOBAL = window.LAYUI_GLOBAL || {};

  // 模块名
  var MOD_NAME$a = 'laydate';
  var MOD_ID$3 = 'lay-' + MOD_NAME$a + '-id'; // 已渲染过的索引标记名

  // 外部调用
  var laydate = {
    v: '5.6.0', // layDate 版本号
    config: {
      weekStart: 0 // 默认周日一周的开始
    }, // 全局配置项
    index: window.laydate && window.laydate.v ? 100000 : 0,
    path: GLOBAL.laydate_dir || ready.getPath,

    // 设置全局项
    set: function (options) {
      var that = this;
      that.config = lay.extend({}, that.config, options);
      return that;
    },

    // 主体 CSS 等待事件
    ready: function (callback) {
      var cssname = 'laydate';
      var ver = '';
      var path = (isLayui ? 'modules/' : '') + 'laydate.css?v=' + laydate.v + ver;

      isLayui ? (
        layui['layui.all'] ?
          (typeof callback === 'function' && callback()) :
        layui.addcss(path, callback, cssname)
      ) : ready.link(path, callback, cssname);

      return this;
    }
  };

  // 操作当前实例
  var thisModule$6 = function(){
    var that = this;
    var options = that.config;
    var id = options.id;

    thisModule$6.that[id] = that; // 记录当前实例对象

    return that.inst = {
      // 提示框
      hint: function(content){
        that.hint.call(that, content);
      },
      // 重载实例
      reload: function(options){
        that.reload.call(that, options);
      },
      config: that.config
    };
  };

  // 字符常量
  var ELEM$3 = '.layui-laydate';
  var THIS$3 = 'layui-this';
  var DISABLED$5 = 'laydate-disabled';
  var LIMIT_YEAR = [100, 200000];

  var ELEM_STATIC = 'layui-laydate-static';
  var ELEM_LIST = 'layui-laydate-list';
  var ELEM_SELECTED = 'laydate-selected';
  var ELEM_HINT = 'layui-laydate-hint';
  var ELEM_DAY_NOW = 'laydate-day-now';
  var ELEM_PREV$1 = 'laydate-day-prev';
  var ELEM_NEXT$1 = 'laydate-day-next';
  var ELEM_FOOTER = 'layui-laydate-footer';
  var ELEM_SHORTCUT = 'layui-laydate-shortcut';
  var ELEM_NOW = '.laydate-btns-now';
  var ELEM_CONFIRM = '.laydate-btns-confirm';
  var ELEM_TIME_TEXT = 'laydate-time-text';
  var ELEM_TIME_BTN = 'laydate-btns-time';
  var ELEM_PREVIEW = 'layui-laydate-preview';
  var ELEM_MAIN$4 = 'layui-laydate-main';
  var ELEM_SHADE = 'layui-laydate-shade';

  // 组件构造器
  var Class$d = function(options){
    var that = this;
    that.index = ++laydate.index;
    that.config = lay.extend({}, that.config, laydate.config, options);

    // 若 elem 非唯一，则拆分为多个实例
    var elem = lay(options.elem || that.config.elem);
    if(elem.length > 1){
      lay.each(elem, function(){
        laydate.render(lay.extend({}, that.config, {
          elem: this
        }));
      });
      return that;
    }

    // 初始化属性
    options = lay.extend(that.config, lay.options(elem[0])); // 继承节点上的属性

    // 若重复执行 render，则视为 reload 处理
    if(elem[0] && elem.attr(MOD_ID$3)){
      var newThat = thisModule$6.getThis(elem.attr(MOD_ID$3));
      if(!newThat) return;
      return newThat.reload(options);
    }

    // 初始化 id 属性 - 优先取 options > 元素 id > 自增索引
    options.id = 'id' in options ? options.id : (
      elem.attr('id') || that.index
    );

    // 自增索引
    options.index = that.index;

    // 初始化
    laydate.ready(function(){
      that.init();
    });
  };

  // 日期格式字符
  var dateType = 'yyyy|y|MM|M|dd|d|HH|H|mm|m|ss|s';

  // 将日期格式字符转换为数组
  thisModule$6.formatArr = function(format){
    return (format || '').match(new RegExp(dateType + '|.', 'g')) || []
  };

  /*
    组件操作
  */

  // 是否闰年
  Class$d.isLeapYear = function(year){
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  };

  // 默认配置
  Class$d.prototype.config = {
    type: 'date' //控件类型，支持：year/month/date/time/datetime
    ,range: false //是否开启范围选择，即双控件
    ,format: 'yyyy-MM-dd' //默认日期格式
    ,value: null //默认日期，支持传入new Date()，或者符合format参数设定的日期格式字符
    ,isInitValue: true //用于控制是否自动向元素填充初始值（需配合 value 参数使用）
    ,min: '1900-1-1' //有效最小日期，年月日必须用“-”分割，时分秒必须用“:”分割。注意：它并不是遵循 format 设定的格式。
    ,max: '2099-12-31' //有效最大日期，同上
    ,trigger: 'click' //呼出控件的事件
    ,show: false //是否直接显示，如果设置 true，则默认直接显示控件
    ,showBottom: true //是否显示底部栏
    ,isPreview: true //是否显示值预览
    ,btns: ['clear', 'now', 'confirm'] //右下角显示的按钮，会按照数组顺序排列
    ,lang: 'cn' //语言，只支持cn/en，即中文和英文
    ,theme: 'default' //主题
    ,position: null //控件定位方式定位, 默认absolute，支持：fixed/absolute/static
    ,calendar: false //是否开启公历重要节日，仅支持中文版
    ,mark: {} //日期备注，如重要事件或活动标记
    ,holidays: null // 标注法定节假日或补假上班
    ,zIndex: null //控件层叠顺序
    ,done: null //控件选择完毕后的回调，点击清空/现在/确定也均会触发
    ,change: null //日期时间改变后的回调
    ,autoConfirm: true //是否自动确认（日期|年份|月份选择器非range下是否自动确认）
    ,shade: 0
  };

  //多语言
  Class$d.prototype.lang = function(){
    var that = this
    ,options = that.config
    ,text = {
      cn: {
        weeks: ['日', '一', '二', '三', '四', '五', '六']
        ,time: ['时', '分', '秒']
        ,timeTips: '选择时间'
        ,startTime: '开始时间'
        ,endTime: '结束时间'
        ,dateTips: '返回日期'
        ,month: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二']
        ,tools: {
          confirm: '确定'
          ,clear: '清空'
          ,now: '现在'
        }
        ,timeout: '结束时间不能早于开始时间<br>请重新选择'
        ,invalidDate: '不在有效日期或时间范围内'
        ,formatError: ['日期格式不合法<br>必须遵循下述格式：<br>', '<br>已为你重置']
        ,preview: '当前选中的结果'
      }
      ,en: {
        weeks: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
        ,time: ['Hours', 'Minutes', 'Seconds']
        ,timeTips: 'Select Time'
        ,startTime: 'Start Time'
        ,endTime: 'End Time'
        ,dateTips: 'Select Date'
        ,month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        ,tools: {
          confirm: 'Confirm'
          ,clear: 'Clear'
          ,now: 'Now'
        }
        ,timeout: 'End time cannot be less than start Time<br>Please re-select'
        ,invalidDate: 'Invalid date'
        ,formatError: ['The date format error<br>Must be followed：<br>', '<br>It has been reset']
        ,preview: 'The selected result'
      }
    };
    return text[options.lang] || text['cn'];
  };

  Class$d.prototype.markerOfChineseFestivals = {
    '0-1-1': '元旦',
    '0-2-14': '情人' ,
    '0-3-8': '妇女',
    '0-3-12': '植树',
    '0-4-1': '愚人',
    '0-5-1': '劳动',
    '0-5-4': '青年',
    '0-6-1': '儿童',
    '0-9-10': '教师',
    '0-10-1': '国庆',
    '0-12-25': '圣诞'
  };

  // 重载实例
  Class$d.prototype.reload = function(options){
    var that = this;
    that.config = lay.extend({}, that.config, options);
    that.init();
  };

  //初始准备
  Class$d.prototype.init = function(){
    var that = this
    ,options = that.config
    ,isStatic = options.position === 'static'
    ,format = {
      year: 'yyyy'
      ,month: 'yyyy-MM'
      ,date: 'yyyy-MM-dd'
      ,time: 'HH:mm:ss'
      ,datetime: 'yyyy-MM-dd HH:mm:ss'
    };

    options.elem = lay(options.elem);
    options.eventElem = lay(options.eventElem);

    if(!options.elem[0]) return;

    layui.type(options.theme) !== 'array' && (options.theme = [options.theme]);
    // 设置了全面版模式
    if (options.fullPanel) {
      if (options.type !== 'datetime' || options.range) {
        // 目前只支持datetime的全面版
        delete options.fullPanel;
      }
    }

    //日期范围分隔符
    that.rangeStr =  options.range ? (
      typeof options.range === 'string' ? options.range : '-'
    ) : '';

    //日期范围的日历面板是否联动
    that.rangeLinked = !!(options.range && options.rangeLinked && (options.type === 'date' || options.type === 'datetime'));

    //切换日历联动方式
    that.autoCalendarModel = function () {
      var state = that.rangeLinked;
      that.rangeLinked = (options.range && (options.type === 'date' || options.type === 'datetime'))
        && ((!that.startDate || !that.endDate) || (that.startDate && that.endDate && that.startDate.year === that.endDate.year && that.startDate.month === that.endDate.month));
      lay(that.elem)[that.rangeLinked ? 'addClass' : 'removeClass']('layui-laydate-linkage');
      return that.rangeLinked != state; // 返回发生了变化
    };

    //是否自动切换
    that.autoCalendarModel.auto = that.rangeLinked && options.rangeLinked === 'auto';

    //若 range 参数为数组，则表示为开始日期和结束日期的 input 对象
    if(layui.type(options.range) === 'array'){
      that.rangeElem = [
        lay(options.range[0]),
        lay(options.range[1])
      ];
    }

    //若 type 设置非法，则初始化为 date 类型
    if(!format[options.type]){
      window.console && console.error && console.error('laydate type error:\''+ options.type + '\' is not supported');
      options.type = 'date';
    }

    //根据不同 type，初始化默认 format
    if(options.format === format.date){
      options.format = format[options.type] || format.date;
    }

    //将日期格式转化成数组
    that.format = thisModule$6.formatArr(options.format);

    // 设置了一周的开始是周几，此处做一个控制
    if (options.weekStart) {
      if (!/^[0-6]$/.test(options.weekStart)) {
        var lang = that.lang();
        options.weekStart = lang.weeks.indexOf(options.weekStart);
        if (options.weekStart === -1) options.weekStart = 0;
      }
    }

    //生成正则表达式
    that.EXP_IF = '';
    that.EXP_SPLIT = '';
    lay.each(that.format, function(i, item){
      var EXP =  new RegExp(dateType).test(item)
        ? '\\d{'+ function(){
          if(new RegExp(dateType).test(that.format[i === 0 ? i + 1 : i - 1]||'')){
            if(/^yyyy|y$/.test(item)) return 4;
            return item.length;
          }
          if(/^yyyy$/.test(item)) return '1,4';
          if(/^y$/.test(item)) return '1,308';
          return '1,2';
        }() +'}'
      : '\\' + item;
      that.EXP_IF = that.EXP_IF + EXP;
      that.EXP_SPLIT = that.EXP_SPLIT + '(' + EXP + ')';
    });
    //验证日期格式正则
    that.EXP_IF_ONE = new RegExp('^'+ that.EXP_IF +'$'); //验证单个日期格式
    that.EXP_IF = new RegExp('^'+ (
      options.range ?
        that.EXP_IF + '\\s\\'+ that.rangeStr + '\\s' + that.EXP_IF
      : that.EXP_IF
    ) +'$');
    that.EXP_SPLIT = new RegExp('^'+ that.EXP_SPLIT +'$', '');

    //如果不是 input|textarea 元素，则默认采用 click 事件
    if(!that.isInput(options.elem[0])){
      if(options.trigger === 'focus'){
        options.trigger = 'click';
      }
    }

    // 设置唯一 KEY
    options.elem.attr('lay-key', that.index);
    options.eventElem.attr('lay-key', that.index);
    options.elem.attr(MOD_ID$3, options.id); // 渲染过的标记


    //获取限制内日期
    lay.each(['min', 'max'], function(i, item){
      var ymd = [];
      var hms = [];
      if(typeof options[item] === 'number'){ //如果为数字
        var day = options[item]
        ,tDate = new Date()
        ,time = that.newDate({ //今天的最大毫秒数
          year: tDate.getFullYear()
          ,month: tDate.getMonth()
          ,date: tDate.getDate()
          ,hours: i ? 23 : 0
          ,minutes: i ? 59 : 0
          ,seconds: i ? 59 : 0
        }).getTime()
        ,STAMP = 86400000 //代表一天的毫秒数
        ,thisDate = new Date(
          day ? (
            day < STAMP ? time + day*STAMP : day //如果数字小于一天的毫秒数，则数字为天数，否则为毫秒数
          ) : time
        );
        ymd = [thisDate.getFullYear(), thisDate.getMonth() + 1, thisDate.getDate()];
        hms = [thisDate.getHours(), thisDate.getMinutes(), thisDate.getSeconds()];
      } else if(typeof options[item] === 'string') {
        ymd = (options[item].match(/\d+-\d+-\d+/) || [''])[0].split('-');
        hms = (options[item].match(/\d+:\d+:\d+/) || [''])[0].split(':');
      } else if(typeof options[item] === 'object'){
        return options[item];
      }
      options[item] = {
        year: ymd[0] | 0 || new Date().getFullYear()
        ,month: ymd[1] ? (ymd[1] | 0) - 1 : new Date().getMonth()
        ,date: ymd[2] | 0 || new Date().getDate()
        ,hours: hms[0] | 0
        ,minutes: hms[1] | 0
        ,seconds: hms[2] | 0
      };
    });

    that.elemID = 'layui-laydate'+ options.elem.attr('lay-key');

    if(options.show || isStatic) that.render();
    isStatic || that.events();

    // 重定义 input 元素的 get set
    if(typeof options.formatToDisplay === 'function'){
      if(that.isInput(options.elem[0])){
        that.formatToDisplay(options.elem[0], options.formatToDisplay);
      } else {
        var rangeElem = that.rangeElem;
        if(rangeElem){
          that.formatToDisplay(rangeElem[0][0], options.formatToDisplay);
          that.formatToDisplay(rangeElem[1][0], options.formatToDisplay);
        }
      }
    }

    //默认赋值
    if(options.value && options.isInitValue){
      if(layui.type(options.value) === 'date'){
        that.setValue(that.parse(0, that.systemDate(options.value)));
      } else {
        that.setValue(options.value);
      }
    }
  };

  //控件主体渲染
  Class$d.prototype.render = function(){
    var that = this
    ,options = that.config
    ,lang = that.lang()
    ,isStatic = options.position === 'static'

    //主面板
    ,elem = that.elem = lay.elem('div', {
      id: that.elemID
      ,"class": [
        'layui-laydate'
        ,options.range ? ' layui-laydate-range' : ''
        ,that.rangeLinked ? ' layui-laydate-linkage' : ''
        ,isStatic ? (' '+ ELEM_STATIC) : ''
        ,options.fullPanel ? ' laydate-theme-fullpanel' : '' // 全面版
        // ,options.theme && options.theme !== 'default' && !/^#/.test(options.theme) ? (' laydate-theme-' + options.theme) : ''
        ,(function () {
          var themeStr = '';
          lay.each(options.theme, function (index, theme) {
            if (theme !== 'default' && !/^#/.test(theme)) {
              themeStr += ' laydate-theme-' + theme;
            }
          });
          return themeStr;
        })()
      ].join('')
    })

    //主区域
    ,elemMain = that.elemMain = []
    ,elemHeader = that.elemHeader = []
    ,elemCont = that.elemCont = []
    ,elemTable = that.table = []

    //底部区域
    ,divFooter = that.footer = lay.elem('div', {
      "class": ELEM_FOOTER
    })

    //快捷栏
    ,divShortcut = that.shortcut = lay.elem('ul', {
      "class": ELEM_SHORTCUT
    });

    if(options.zIndex) elem.style.zIndex = options.zIndex;

    //单双日历区域
    lay.each(new Array(2), function(i){
      if(!options.range && i > 0){
        return true;
      }

      //头部区域
      var divHeader = lay.elem('div', {
        "class": 'layui-laydate-header'
      })

      //左右切换
      ,headerChild = [function(){ //上一年
        var elem = lay.elem('i', {
          "class": 'layui-icon laydate-icon laydate-prev-y'
        });
        elem.innerHTML = '&#xe65a;';
        return elem;
      }(), function(){ //上一月
        var elem = lay.elem('i', {
          "class": 'layui-icon laydate-icon laydate-prev-m'
        });
        elem.innerHTML = '&#xe603;';
        return elem;
      }(), function(){ //年月选择
        var elem = lay.elem('div', {
          "class": 'laydate-set-ym'
        });
        elem.appendChild(lay.elem('span'));
        elem.appendChild(lay.elem('span'));
        return elem;
      }(), function(){ //下一月
        var elem = lay.elem('i', {
          "class": 'layui-icon laydate-icon laydate-next-m'
        });
        elem.innerHTML = '&#xe602;';
        return elem;
      }(), function(){ //下一年
        var elem = lay.elem('i', {
          "class": 'layui-icon laydate-icon laydate-next-y'
        });
        elem.innerHTML = '&#xe65b;';
        return elem;
      }()]

      //日历内容区域
      ,divContent = lay.elem('div', {
        "class": 'layui-laydate-content'
      })
      ,table = lay.elem('table')
      ,thead = lay.elem('thead'), theadTr = lay.elem('tr');

      //生成年月选择
      lay.each(headerChild, function(i, item){
        divHeader.appendChild(item);
      });

       //生成表格
      thead.appendChild(theadTr);
      lay.each(new Array(6), function(i){ //表体
        var tr = table.insertRow(0);
        lay.each(new Array(7), function(j){
          if(i === 0){
            var th = lay.elem('th');
            th.innerHTML = lang.weeks[(j + options.weekStart) % 7];
            theadTr.appendChild(th);
          }
          tr.insertCell(j);
        });
      });
      table.insertBefore(thead, table.children[0]); //表头
      divContent.appendChild(table);

      elemMain[i] = lay.elem('div', {
        "class": ELEM_MAIN$4 + ' laydate-main-list-'+ i
      });

      elemMain[i].appendChild(divHeader);
      elemMain[i].appendChild(divContent);

      elemHeader.push(headerChild);
      elemCont.push(divContent);
      elemTable.push(table);
    });

    //生成底部栏
    lay(divFooter).html(function(){
      var html = [], btns = [];
      if(options.type === 'datetime'){
        html.push('<span lay-type="datetime" class="'+ ELEM_TIME_BTN +'">'+ lang.timeTips +'</span>');
      }
      if(!(!options.range && options.type === 'datetime') || options.fullPanel){
        html.push('<span class="'+ ELEM_PREVIEW +'" title="'+ lang.preview +'"></span>');
      }

      lay.each(options.btns, function(i, item){
        var title = lang.tools[item] || 'btn';
        if(options.range && item === 'now') return;
        if(isStatic && item === 'clear') title = options.lang === 'cn' ? '重置' : 'Reset';
        btns.push('<span lay-type="'+ item +'" class="laydate-btns-'+ item +'">'+ title +'</span>');
      });
      html.push('<div class="laydate-footer-btns">'+ btns.join('') +'</div>');
      return html.join('');
    }());

    // 生成快捷键栏
    if (options.shortcuts) {
      elem.appendChild(divShortcut);
      lay(divShortcut).html(function () {
        var shortcutBtns = [];
        lay.each(options.shortcuts, function (i, item) {
          shortcutBtns.push('<li data-index="' + i + '">'+item.text+'</li>');
        });
        return shortcutBtns.join('');
      }()).find('li').on('click', function (event) {
        var btnSetting = options.shortcuts[this.dataset['index']] || {};
        var value = (typeof btnSetting.value === 'function'
          ? btnSetting.value()
          : btnSetting.value) || [];
        if (!layui.isArray(value)) {
          value = [value];
        }
        var type = options.type;
        lay.each(value, function (i, item) {
          var dateTime = [options.dateTime, that.endDate][i];
          if (type === 'time' && layui.type(item) !== 'date') {
            if (that.EXP_IF.test(item)) {
              item = (item.match(that.EXP_SPLIT) || []).slice(1);
              lay.extend(dateTime, {hours: item[0] | 0, minutes: item[2] | 0, seconds: item[4] | 0});
            }
          } else {
            lay.extend(dateTime, that.systemDate(layui.type(item) === 'date' ? item : new Date(item)));
          }

          if (type === 'time' || type === 'datetime') {
            that[['startTime', 'endTime'][i]] = {
              hours: dateTime.hours,
              minutes: dateTime.minutes,
              seconds: dateTime.seconds,
            };
          }
          if (i === 0) { // 第一个值作为startDate
            that.startDate = lay.extend({}, dateTime);
          } else {
            that.endState = true;
          }
          if (type === 'year' || type === 'month' || type === 'time') {
            that.listYM[i] = [dateTime.year, dateTime.month + 1];
          } else if (i) {
            that.autoCalendarModel.auto && that.autoCalendarModel();
          }
        });
        that.checkDate('limit').calendar(null, null, 'init');

        var timeBtn = lay(that.footer).find('.'+ ELEM_TIME_BTN).removeClass(DISABLED$5);
        timeBtn && timeBtn.attr('lay-type') === 'date' && timeBtn[0].click();
        that.done(null, 'change');

        lay(this).addClass(THIS$3);

        // 自动确认
        if(options.position !== 'static'){
          that.setValue(that.parse()).done().remove();
        }
        /*
        if (options.position !== 'static' && !options.range && options.autoConfirm) {
          if (type === 'date') {
            that.choose(lay(elem).find('td.layui-this'))
          } else if (type === 'year' || type === 'month') {
            if(lay(elemMain[0]).find('.' + ELEM_MAIN + ' li.' + THIS + ':not(.laydate-disabled)')[0]) {
              that.setValue(that.parse()).done().remove();
            }
          }
        }
        */
      });
    }

    //插入到主区域
    lay.each(elemMain, function(i, main){
      elem.appendChild(main);
    });
    options.showBottom && elem.appendChild(divFooter);

    // 生成自定义主题
    var style = lay.elem('style');
    var styleText = [];
    var colorTheme;
    var isPrimaryColor = true;
    lay.each(options.theme, function (index, theme) {
      // 主色
      if(isPrimaryColor && /^#/.test(theme)){
        colorTheme = true;
        isPrimaryColor = false;
        styleText.push([
          '#{{id}} .layui-laydate-header{background-color:{{theme}};}',
          '#{{id}} li.layui-this,#{{id}} td.layui-this>div{background-color:{{theme}} !important;}',
          options.theme.indexOf('circle') !== -1 ? '' : '#{{id}} .layui-this{background-color:{{theme}} !important;}',
          '#{{id}} .laydate-day-now{color:{{theme}} !important;}',
          '#{{id}} .laydate-day-now:after{border-color:{{theme}} !important;}'
        ].join('').replace(/{{id}}/g, that.elemID).replace(/{{theme}}/g, theme));
        return;
      }
      // 第二个自定义颜色作为辅色
      if(!isPrimaryColor && /^#/.test(theme)){
        styleText.push([
          '#{{id}} .laydate-selected>div{background-color:{{theme}} !important;}',
          '#{{id}} .laydate-selected:hover>div{background-color:{{theme}} !important;}'
        ].join('').replace(/{{id}}/g, that.elemID).replace(/{{theme}}/g, theme));
      }
    });
    //快捷栏样式
    if (options.shortcuts && options.range) {
      styleText.push('#{{id}}.layui-laydate-range{width: 628px;}'.replace(/{{id}}/g, that.elemID));
    }
    if (styleText.length) {
      styleText = styleText.join('');
      if('styleSheet' in style){
        style.setAttribute('type', 'text/css');
        style.styleSheet.cssText = styleText;
      } else {
        style.innerHTML = styleText;
      }

      colorTheme && lay(elem).addClass('laydate-theme-molv');
      elem.appendChild(style);
    }

    //移除上一个控件
    that.remove(Class$d.thisElemDate);

    //记录当前执行的实例索引
    laydate.thisId = options.id;

    //如果是静态定位，则插入到指定的容器中，否则，插入到body
    isStatic ? options.elem.append(elem) : (
      document.body.appendChild(elem)
      ,that.position() //定位
    );

    var shade = options.shade ? ('<div class="'+ ELEM_SHADE +'" style="'+ ('z-index:'+ (parseInt(layui.getStyle(elem, 'z-index'))-1) +'; background-color: ' + (options.shade[1] || '#000') + '; opacity: ' + (options.shade[0] || options.shade)) +'"></div>') : '';
    elem.insertAdjacentHTML('beforebegin', shade);

    that.checkDate().calendar(null, 0, 'init'); //初始校验
    that.changeEvent(); //日期切换

    Class$d.thisElemDate = that.elemID;

    that.renderAdditional();
    typeof options.ready === 'function' && options.ready(lay.extend({}, options.dateTime, {
      month: options.dateTime.month + 1
    }));

    that.preview();
  };

  //控件移除
  Class$d.prototype.remove = function(prev){
    var that = this
    ,options = that.config
    ,elem = lay('#'+ (prev || that.elemID));
    if(!elem[0]) return that;

    if(!elem.hasClass(ELEM_STATIC)){
      that.checkDate(function(){
        elem.remove();
        //delete options.dateTime;
        delete that.startDate;
        delete that.endDate;
        delete that.endState;
        delete that.startTime;
        delete that.endTime;
        delete laydate.thisId;
        typeof options.close === 'function' && options.close(that);
      });
    }
    lay('.' + ELEM_SHADE).remove();
    return that;
  };

  //定位算法
  Class$d.prototype.position = function(){
    var that = this
    ,options = that.config;
    lay.position(options.elem[0], that.elem, {
      position: options.position
    });
    return that;
  };

  // 提示
  Class$d.prototype.hint = function(opts){
    var that = this;
    that.config;
    var div = lay.elem('div', {
      "class": ELEM_HINT
    });

    if(!that.elem) return;

    // 兼容旧版参数
    if(typeof opts === 'object'){
      opts = opts || {};
    } else {
      opts = {
        content: opts
      };
    }

    div.innerHTML = opts.content || '';
    lay(that.elem).find('.'+ ELEM_HINT).remove();
    that.elem.appendChild(div);

    clearTimeout(that.hinTimer);
    that.hinTimer = setTimeout(function(){
      lay(that.elem).find('.'+ ELEM_HINT).remove();
    }, 'ms' in opts ? opts.ms : 3000);
  };

  //获取递增/减后的年月
  Class$d.prototype.getAsYM = function(Y, M, type){
    type ? M-- : M++;
    if(M < 0){
      M = 11;
      Y--;
    }
    if(M > 11){
      M = 0;
      Y++;
    }
    return [Y, M];
  };

  //系统日期
  Class$d.prototype.systemDate = function(newDate){
    var thisDate = newDate || new Date();
    return {
      year: thisDate.getFullYear() //年
      ,month: thisDate.getMonth() //月
      ,date: thisDate.getDate() //日
      ,hours: newDate ? newDate.getHours() : 0 //时
      ,minutes: newDate ? newDate.getMinutes() : 0 //分
      ,seconds: newDate ? newDate.getSeconds() : 0 //秒
    }
  };

  //日期校验
  Class$d.prototype.checkDate = function(fn){
    var that = this
    ,options = that.config
    ,lang = that.lang()
    ,dateTime = options.dateTime = options.dateTime || that.systemDate()
    ,thisMaxDate, error

    ,elem = options.elem[0]
    ;that.isInput(elem) ? 'val' : 'html'
    ;var value = function(){
      //如果传入了开始和结束日期的 input 对象，则将其拼接为日期范围字符
      if(that.rangeElem){
        var vals = [that.rangeElem[0].val(), that.rangeElem[1].val()];

        if(vals[0] && vals[1]){
          return vals.join(' ' + that.rangeStr + ' ');
        }
      }
      return that.isInput(elem)
        ? elem.value
      : (options.position === 'static' ? '' : lay(elem).attr('lay-date'));
    }()

    //校验日期有效数字
    ,checkValid = function(dateTime){
      if (!dateTime) {
        return;
      }
      if(dateTime.year > LIMIT_YEAR[1]) dateTime.year = LIMIT_YEAR[1], error = true; //不能超过20万年
      if(dateTime.month > 11) dateTime.month = 11, error = true;
      if(dateTime.seconds > 59) dateTime.seconds = 0, dateTime.minutes++, error = true;
      if(dateTime.minutes > 59) dateTime.minutes = 0, dateTime.hours++, error = true;
      if(dateTime.hours > 23) dateTime.hours = 0, error = true;

      //计算当前月的最后一天
      thisMaxDate = laydate.getEndDate(dateTime.month + 1, dateTime.year);
      if(dateTime.date > thisMaxDate) dateTime.date = thisMaxDate, error = true;
    }

    //获得初始化日期值
    ,initDate = function(dateTime, value, index){
      var startEnd = ['startTime', 'endTime'];
      value = (value.match(that.EXP_SPLIT) || []).slice(1);
      index = index || 0;

      if(options.range){
        that[startEnd[index]] = that[startEnd[index]] || {};
      }
      lay.each(that.format, function(i, item){
        var thisv = parseFloat(value[i]);
        if(value[i].length < item.length) error = true;
        if(/yyyy|y/.test(item)){ //年
          if(thisv < LIMIT_YEAR[0]) thisv = LIMIT_YEAR[0], error = true; //年不能低于100年
          dateTime.year = thisv;
        } else if(/MM|M/.test(item)){ //月
          if(thisv < 1) thisv = 1, error = true;
          dateTime.month = thisv - 1;
        } else if(/dd|d/.test(item)){ //日
          if(thisv < 1) thisv = 1, error = true;
          dateTime.date = thisv;
        } else if(/HH|H/.test(item)){ //时
          if (thisv < 0) thisv = 0, error = true;
          if (thisv > 23) thisv = 23, error = true;
          dateTime.hours = thisv;
          options.range && (that[startEnd[index]].hours = thisv);
        } else if(/mm|m/.test(item)){ //分
          if (thisv < 0) thisv = 0, error = true;
          if (thisv > 59) thisv = 59, error = true;
          dateTime.minutes = thisv;
          options.range && (that[startEnd[index]].minutes = thisv);
        } else if(/ss|s/.test(item)){ //秒
          if (thisv < 0) thisv = 0, error = true;
          if (thisv > 59) thisv = 59, error = true;
          dateTime.seconds = thisv;
          options.range && (that[startEnd[index]].seconds = thisv);
        }
      });
      checkValid(dateTime);
    };

    if(fn === 'limit') {
      if (options.range) {
        checkValid(that.rangeLinked ? that.startDate : dateTime); // 校验开始时间
        that.endDate && checkValid(that.endDate); // 校验结束时间
      } else {
        checkValid(dateTime);
      }
      return that;
    }

    value = value || options.value;
    if(typeof value === 'string'){
      value = value.replace(/\s+/g, ' ').replace(/^\s|\s$/g, '');
    }

    //如果开启范围，则计算结束日期
    var getEndDate = function(){
      if(options.range){
        that.endDate = that.endDate || lay.extend({}, options.dateTime, function(){
          var obj = {}
          ,dateTime = options.dateTime
          ,EYM = that.getAsYM(dateTime.year, dateTime.month);

          //初始右侧面板的年月
          if(options.type === 'year'){
            obj.year = dateTime.year + 1;
          } else if(options.type !== 'time'){
            obj.year = EYM[0];
            obj.month = EYM[1];
          }

          //初始右侧面板的时间
          if(options.type === 'datetime' || options.type === 'time'){
            obj.hours = 23;
            obj.minutes = obj.seconds = 59;
          }

          return obj;
        }());
      }
    };
    getEndDate();

    if(typeof value === 'string' && value){
      if(that.EXP_IF.test(value)){ //校验日期格式
        if(options.range){
          value = value.split(' '+ that.rangeStr +' ');
          lay.each([options.dateTime, that.endDate], function(i, item){
            initDate(item, value[i], i);
          });
        } else {
          initDate(dateTime, value);
        }
      } else {
        //格式不合法
        that.hint(lang.formatError[0] + (
          options.range ? (options.format + ' '+ that.rangeStr +' ' + options.format) : options.format
        ) + lang.formatError[1]);
        error = true;
      }
    } else if(value && layui.type(value) === 'date'){ //若值为日期对象
      options.dateTime = that.systemDate(value);
    } else {
      //重置开始日期
      options.dateTime = that.systemDate();
      delete that.startTime;

      //重置结束日期
      delete that.endDate; //删除原有的结束日期
      getEndDate(); //并重新获得新的结束日期
      delete that.endTime;
    }

    //从日期范围表单中获取初始值
    (function(){
      if(that.rangeElem){
        var vals = [that.rangeElem[0].val(), that.rangeElem[1].val()]
        ,arrDate = [options.dateTime, that.endDate];
        lay.each(vals, function(_i, _v){
          if(that.EXP_IF_ONE.test(_v)){ //校验日期格式
            initDate(arrDate[_i], _v, _i);
          }
        });
      }
    })();

    // 校验日期有效数字
    checkValid(dateTime);
    if(options.range) checkValid(that.endDate);

    // 如果初始值格式错误，则纠正初始值
    if(error && value){
      that.setValue(
        options.range ? (that.endDate ? that.parse() : '') : that.parse()
      );
    }

    //如果当前日期不在设定的最大小日期区间，则自动纠正在可选区域
    //校验主面板是否在可选日期区间
    var minMaxError;
    if(that.getDateTime(dateTime) > that.getDateTime(options.max)){ //若超出最大日期
      dateTime = options.dateTime = lay.extend({}, options.max);
      minMaxError = true;
    } else if(that.getDateTime(dateTime) < that.getDateTime(options.min)){ //若少于最小日期
      dateTime = options.dateTime = lay.extend({}, options.min);
      minMaxError = true;
    }

    //校验右侧面板是否在可选日期区间
    if(options.range){
      if(that.getDateTime(that.endDate) < that.getDateTime(options.min) || that.getDateTime(that.endDate) > that.getDateTime(options.max)){
        that.endDate = lay.extend({}, options.max);
        minMaxError = true;
      }
      // 有时间范围的情况下初始化startTime和endTime
      that.startTime = {
        hours: options.dateTime.hours,
        minutes: options.dateTime.minutes,
        seconds: options.dateTime.seconds,
      };
      that.endTime = {
        hours: that.endDate.hours,
        minutes: that.endDate.minutes,
        seconds: that.endDate.seconds,
      };
      // 如果是年月范围，将对应的日期统一成当月的1日进行比较，避免出现同一个月但是开始日期大于结束日期的情况
      if (options.type === 'month') {
        options.dateTime.date = 1;
        that.endDate.date = 1;
      }
    }

    // 初始值不在最大最小范围内
    if(minMaxError && value){
      that.setValue(that.parse());
      that.hint('value ' + lang.invalidDate + lang.formatError[1]);
    }

    // 初始赋值 startDate,endState
    that.startDate = that.startDate || value && lay.extend({}, options.dateTime); // 有默认值才初始化startDate
    that.autoCalendarModel.auto && that.autoCalendarModel();
    that.endState = !options.range || !that.rangeLinked || !!(that.startDate && that.endDate); // 初始化选中范围状态

    fn && fn();
    return that;
  };

  /**
   * 渲染备注
   * @param {JQuery} tdElem td 元素
   * @param {[number, number, number]} YMD 年月日
   * @param {object | string} markers 备注信息
   */
  Class$d.prototype.markRender = function(tdElem, YMD, markers){
    var markText;

    if(typeof markers === 'object'){
      lay.each(markers || {}, function(key, title){
        var keys = key.split('-');
        if((keys[0] == YMD[0] || keys[0] == 0) //每年的每月
        && (keys[1] == YMD[1] || keys[1] == 0) //每月的每日
        && keys[2] == YMD[2]){ //特定日
          markText = title || YMD[2];
        }
      });
    }else if(typeof markers === 'string'){
      markText = markers ||  YMD[2];
    }

    markText && tdElem.find('div').html('<span class="laydate-day-mark">'+ markText +'</span>');
  };

  /**
   * 公历重要日期与自定义备注
   * @param {JQuery} td
   * @param {[number, number, number]} YMD
   * @returns Class
   */
  Class$d.prototype.mark = function(td, YMD){
    var that = this;
    var options = that.config;

    var render = function(markers){
      that.markRender(td, YMD, markers);
    };

    if(options.calendar && options.lang === 'cn'){
      render(that.markerOfChineseFestivals);
    }

    if(typeof options.mark === 'function'){
      options.mark({year: YMD[0], month: YMD[1], date: YMD[2]}, render);
    }else if(typeof options.mark === 'object'){
      render(options.mark);
    }

    return that;
  };

  /**
   * 渲染法定节假日或补假上班标记
   * @param {JQuery} tdElem td 元素
   * @param {[number, number, number]} YMD 年月日
   * @param {[Array<string>, Array<string>] | string} markers 标记信息
   */
  Class$d.prototype.holidaysRender = function(tdElem, YMD, markers){
    var type = ['holidays', 'workdays'];

    var isEquals = function(ymdStr1, ymdStr2){
      var ymd1 = ymdStr1.split('-');
      var ymd2 = ymdStr2.split('-');

      lay.each(ymd1, function(i,v){
        ymd1[i] = parseInt(v, 10);
      });
      lay.each(ymd2, function(i,v){
        ymd2[i] = parseInt(v, 10);
      });

      return ymd1.join('-') === ymd2.join('-');
    };

    var insertHtml = function(el, type, text){
      el.find('div').html([
        '<span',
        ' class="laydate-day-holidays"',
        ' type="'+ type +'"',
        '>',
          text,
        '</span>'
      ].join(''));
    };

    if(layui.type(markers) === 'array'){
      lay.each(markers, function(idx, item) {
        lay.each(item, function(i, dayStr) {
          if(isEquals(dayStr, tdElem.attr('lay-ymd'))){
            insertHtml(tdElem, type[idx], YMD[2]);
          }
        });
      });
    }else if(typeof markers === 'string'){
      if(type.indexOf(markers) !== -1){
        insertHtml(tdElem, markers, YMD[2]);
      }
    }
  };

  /**
   * 标注法定节假日或补假上班
   * @param {JQuery} td
   * @param {[number, number, number]} YMD
   * @returns Class
   */
  Class$d.prototype.holidays = function(td, YMD) {
    var that = this;
    var options = that.config;

    var render = function(markers){
      that.holidaysRender(td, YMD, markers);
    };

    if(typeof options.holidays === 'function'){
      options.holidays({year: YMD[0], month: YMD[1], date: YMD[2]}, render);
    }else if(layui.type(options.holidays) === 'array'){
      render(options.holidays);
    }

    return that;
  };

  /**
   * 自定义单元格
   * @param {HTMLElement|Array<HTMLElement>} el - 单元格元素
   * @param {{year:number, month:number, date:number}} dateObj - 当前单元格对应的日期信息
   * @param {'year' | 'month' | 'date'} panelMode - 面板模式
   * @returns
   */
  Class$d.prototype.cellRender = function(el, dateObj, panelMode){
    var that = this;
    var options = that.config;

    if(typeof options.cellRender === 'function'){
      var render = function(content){
        if(typeof content === 'string'){
          lay(el).html(content);
        }else if(typeof content === 'object'){
          lay(el).html('').append(lay(content)[0]);
        }
      };
      options.cellRender(dateObj, render, {originElem: el, type: panelMode});
    }

    return that;
  };

  /**
   * 给定年份的开始日期
   * @param {Date} date
   */
  Class$d.prototype.startOfYear = function(date){
    var newDate = new Date(date);
    newDate.setFullYear(newDate.getFullYear(), 0, 1);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  };

  /**
   * 给定年份的结束日期
   * @param {Date} date
   */
  Class$d.prototype.endOfYear = function(date){
    var newDate = new Date(date);
    var year = newDate.getFullYear();
    newDate.setFullYear(year + 1, 0, 0);
    newDate.setHours(23, 59, 59, 999);
    return newDate;
  };

  /**
   * 给定月份的开始日期
   * @param {Date} date
   */
  Class$d.prototype.startOfMonth = function(date){
    var newDate =  new Date(date);
    newDate.setDate(1);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  };

  /**
   * 给定月份的结束日期
   * @param {Date} date
   */
  Class$d.prototype.endOfMonth = function(date){
    var newDate = new Date(date);
    var month = newDate.getMonth();
    newDate.setFullYear(newDate.getFullYear(), month + 1, 0);
    newDate.setHours(23, 59, 59, 999);
    return newDate;
  };

  /**
   * 将指定的天数添加到给定日期
   * @param {Date} date 要更改的日期
   * @param {number} amount 天数
   */
  Class$d.prototype.addDays = function(date, amount){
    var newDate = new Date(date);
    if(!amount) return newDate;
    newDate.setDate(newDate.getDate() + amount);
    return newDate;
  };

  /**
   * 不可选取的年或月。年或月中的所有日期都禁用时，才判定为不可选取。
   * @param {Date} date 要检测的年或月
   * @param {'year' | 'month'} type 面板类型
   * @param {'start' | 'end'} position 面板位置
   */
  Class$d.prototype.isDisabledYearOrMonth = function(date, type, position){
    var that = this;
    var options = that.config;
    var millisecondsInDay = 24 * 60 * 60 * 1000;

    var startDay = type === 'year' ? that.startOfYear(date) : that.startOfMonth(date);
    var endDay = type === 'year' ? that.endOfYear(date) : that.endOfMonth(date);
    var numOfDays = Math.floor((endDay.getTime() - startDay.getTime()) / millisecondsInDay) + 1;
    var disabledCount = 0;

    for(var i = 0; i < numOfDays; i++){
      var day = that.addDays(startDay, i);
      if(options.disabledDate.call(options, day, position)){
        disabledCount++;
      }
    }

    return disabledCount === numOfDays;
  };

  /**
   * @typedef limitOptions
   * @prop {JQuery} [elem] - 检测的元素, 例如面板中年月日时分秒元素，“现在”，“确认” 按钮等
   * @prop {number} [index] - 元素集合中，当前检测元素的索引，years:0,month:0,date:0-41,hms:0
   * @prop {['hours', 'minutes', 'seconds'] | ['hours', 'minutes'] | ['hours']} [time] - 是否比较时分秒
   * @prop {'year'|'month'|string} [type] - 面板类型?
   * @prop {0 | 1} [rangeType] - 面板索引, 0 表示 start, 1 表示 end
   * @prop {Partial<{year:number,month: number,date:number,hours:number,minutes:number,seconds:number}>} [date] - 检测的日期时间对象
   * @prop {'date' | 'time' | 'datetime'} disabledType - 禁用类型，按钮应使用 datetime
   */
  /**
   * 不可选取的日期
   * @param {number} date 当前检测的日期的时间戳
   * @param {limitOptions} opts
   * @returns {boolean}
   */
  Class$d.prototype.isDisabledDate = function(date, opts){
    opts = opts || {};

    var that = this;
    var options = that.config;
    var position = options.range ? (opts.rangeType === 0 ? 'start' : 'end') : 'start';

    if(!options.disabledDate) return false;
    if(options.type === 'time') return false;
    if(!(opts.disabledType === 'date' || opts.disabledType === 'datetime')) return false;

    // 不需要时分秒
    var normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    return opts.type === 'year' || opts.type === 'month'
      ? that.isDisabledYearOrMonth(normalizedDate, opts.type, position)
      : options.disabledDate.call(options, normalizedDate, position);
  };

  /**
   * 不可选取的时间
   * @param {number} date 当前检测的日期的时间戳
   * @param {limitOptions} opts
   * @returns {boolean}
   */
  Class$d.prototype.isDisabledTime = function(date, opts){
    opts = opts || {};

    var that = this;
    var options = that.config;
    var position = options.range ? (opts.rangeType === 0 ? 'start' : 'end') : 'start';

    if(!options.disabledTime) return false;
    if(!(options.type === "time" || options.type === "datetime")) return false;
    if(!(opts.disabledType === 'time' || opts.disabledType === 'datetime')) return false;

    var isDisabledItem = function(compareVal, rangeFn, rangeFnParam){
      return function(){
        return (typeof rangeFn === 'function' && rangeFn.apply(options, rangeFnParam) || []).indexOf(compareVal) !== -1;
      }
    };

    var dateObj = that.systemDate(new Date(date));
    var disabledTime = options.disabledTime.call(options, that.newDate(dateObj), position) || {};

    // 面板中的时分秒 HTML 元素需要分别检测是否禁用
    // 按钮检测任意一项是否禁用即可
    return opts.disabledType === 'datetime'
      ? isDisabledItem(dateObj.hours, disabledTime.hours)()
          || isDisabledItem(dateObj.minutes, disabledTime.minutes, [dateObj.hours])()
          || isDisabledItem(dateObj.seconds, disabledTime.seconds, [dateObj.hours, dateObj.minutes])()
      : [isDisabledItem(dateObj.hours, disabledTime.hours),
          isDisabledItem(dateObj.minutes, disabledTime.minutes, [dateObj.hours]),
          isDisabledItem(dateObj.seconds, disabledTime.seconds, [dateObj.hours, dateObj.minutes])][opts.time.length - 1]();
  };

  /**
   * 不可选取的日期时间
   * @param {number} timestamp 当前检测的日期的时间戳
   * @param {limitOptions} opts
   * @returns
   */
  Class$d.prototype.isDisabledDateTime = function(timestamp, opts){
    opts = opts || {};

    var that = this;
    that.config;

    return that.isDisabledDate(timestamp, opts) || that.isDisabledTime(timestamp, opts);
  };


  /**
   * 无效日期范围的标记
   * @param {limitOptions} opts
   *
   */
  Class$d.prototype.limit = function(opts){
    opts = opts || {};

    var that = this;
    var options = that.config;
    var timestamp = {};
    var dateTime = opts.index > (opts.time ? 0 : 41) ? that.endDate : options.dateTime;
    var isOut;

    lay.each({
      now: lay.extend({}, dateTime, opts.date || {})
      ,min: options.min
      ,max: options.max
    }, function(key, item){
      timestamp[key] = that.newDate(lay.extend({
        year: item.year
        ,month: opts.type === 'year' ? 0 : item.month // 年份的时候只比较年
        ,date: (opts.type === 'year' || opts.type === 'month') ? 1 : item.date // 年月只比较年月不与最大最小比日期
      }, function(){
        var hms = {};
        lay.each(opts.time, function(i, keys){
          hms[keys] = item[keys];
        });
        return hms;
      }())).getTime();  //time：是否比较时分秒
    });

    isOut = timestamp.now < timestamp.min || timestamp.now > timestamp.max || that.isDisabledDateTime(timestamp.now, opts);
    opts.elem && opts.elem[isOut ? 'addClass' : 'removeClass'](DISABLED$5);

    return isOut;
  };

  //当前日期对象
  Class$d.prototype.thisDateTime = function(index){
    var that = this
    ,options = that.config;
    return index ? that.endDate: options.dateTime;
  };

  //日历表
  Class$d.prototype.calendar = function(value, index, type){
    index = index ? 1 : 0;
    var that = this
    ,options = that.config
    ,dateTime = value || that.thisDateTime(index)
    ,thisDate = new Date(), startWeek, prevMaxDate, thisMaxDate
    ,lang = that.lang()

    ,isAlone = options.type !== 'date' && options.type !== 'datetime'
    ,tds = lay(that.table[index]).find('td')
    ,elemYM = lay(that.elemHeader[index][2]).find('span');

    if(dateTime.year < LIMIT_YEAR[0]) dateTime.year = LIMIT_YEAR[0], that.hint(lang.invalidDate);
    if(dateTime.year > LIMIT_YEAR[1]) dateTime.year = LIMIT_YEAR[1], that.hint(lang.invalidDate);

    //记录初始值
    if(!that.firstDate){
      that.firstDate = lay.extend({}, dateTime);
    }

    //计算当前月第一天的星期
    thisDate.setFullYear(dateTime.year, dateTime.month, 1);
    startWeek = (thisDate.getDay() + (7 - options.weekStart)) % 7;

    prevMaxDate = laydate.getEndDate(dateTime.month || 12, dateTime.year); //计算上个月的最后一天
    thisMaxDate = laydate.getEndDate(dateTime.month + 1, dateTime.year); //计算当前月的最后一天

    //赋值日
    lay.each(tds, function(index_, item){
      var YMD = [dateTime.year, dateTime.month], st;
      item = lay(item);
      item.removeAttr("class");
      if(index_ < startWeek){
        st = prevMaxDate - startWeek + index_;
        item.addClass('laydate-day-prev');
        YMD = that.getAsYM(dateTime.year, dateTime.month, 'sub');
      } else if(index_ >= startWeek && index_ < thisMaxDate + startWeek){
        st = index_ - startWeek;
        if (!that.rangeLinked) {
          st + 1 === dateTime.date && item.addClass(THIS$3);
        }
      } else {
        st = index_ - thisMaxDate - startWeek;
        item.addClass('laydate-day-next');
        YMD = that.getAsYM(dateTime.year, dateTime.month);
      }
      YMD[1]++;
      YMD[2] = st + 1;
      item.attr('lay-ymd', YMD.join('-')).html('<div>' + YMD[2] + '</div>');
      that.mark(item, YMD).holidays(item, YMD).limit({
        elem: item,
        date: {
          year: YMD[0],
          month: YMD[1] - 1,
          date: YMD[2]
        },
        index: index_,
        rangeType: index,
        disabledType: 'date' // 日面板，检测当前日期是否禁用
      });
      that.cellRender(item, {year: YMD[0], month: YMD[1], date: YMD[2]}, 'date');
    });

    //同步头部年月
    lay(elemYM[0]).attr('lay-ym', dateTime.year + '-' + (dateTime.month + 1));
    lay(elemYM[1]).attr('lay-ym', dateTime.year + '-' + (dateTime.month + 1));
    if(!that.panelYM) that.panelYM = {};
    that.panelYM[index] = {year: dateTime.year, month: dateTime.month};

    if(options.lang === 'cn'){
      lay(elemYM[0]).attr('lay-type', 'year').html(dateTime.year + ' 年');
      lay(elemYM[1]).attr('lay-type', 'month').html((dateTime.month + 1) + ' 月');
    } else {
      lay(elemYM[0]).attr('lay-type', 'month').html(lang.month[dateTime.month]);
      lay(elemYM[1]).attr('lay-type', 'year').html(dateTime.year);
    }

    //初始默认选择器
    if(isAlone){ //年、月等独立选择器
      if(options.range){
        if(value || type !== 'init'){ // 判断是否需要显示年月时间列表
          that.listYM = [
            [(that.startDate || options.dateTime).year, (that.startDate || options.dateTime).month + 1]
            ,[that.endDate.year, that.endDate.month + 1]
          ];
          that.list(options.type, 0).list(options.type, 1);

          //同步按钮可点状态
          options.type === 'time' ? that.setBtnStatus('时间'
            ,lay.extend({}, that.systemDate(), that.startTime)
            ,lay.extend({}, that.systemDate(), that.endTime)
          ) : that.setBtnStatus(true);
        }
      } else {
        that.listYM = [[dateTime.year, dateTime.month + 1]];
        that.list(options.type, 0);
      }
    }

    //初始赋值双日历
    if(options.range && type === 'init'){
      //执行渲染第二个日历
      if (that.rangeLinked) {
        var EYM = that.getAsYM(dateTime.year, dateTime.month, index ? 'sub' : null);
        that.calendar(lay.extend({}, dateTime, {
          year: EYM[0]
          ,month: EYM[1]
        }), 1 - index); // 渲染另外一个
      } else {
        that.calendar(null, 1 - index);
      }
    }

    // 通过检测当前有效日期，来设定底部按钮状态
    if(!options.range){
      var timeParams = ['hours', 'minutes', 'seconds'];

      // 现在按钮
      that.limit({
        elem: lay(that.footer).find(ELEM_NOW),
        date: that.systemDate(/^(datetime|time)$/.test(options.type) ? new Date() : null),
        index: 0,
        time: timeParams,
        disabledType: 'datetime' // 按钮，检测日期和时间
      });
      // 确认按钮
      that.limit({
        elem: lay(that.footer).find(ELEM_CONFIRM),
        index: 0,
        time: timeParams,
        disabledType: 'datetime' // 按钮，检测日期和时间
      });
    }

    //同步按钮可点状态
    that.setBtnStatus();

    // 重置快捷栏选中状态
    lay(that.shortcut).find('li.' + THIS$3).removeClass(THIS$3);

    //标记选择范围
    if(options.range && !isAlone && type !== 'init') that.stampRange();

    return that;
  };

  //生成年月时分秒列表
  Class$d.prototype.list = function(type, index){
    var that = this
    ,options = that.config
    ,dateTime = that.rangeLinked ? options.dateTime : [options.dateTime, that.endDate][index]
    ,lang = that.lang()
    ,isAlone = options.range && options.type !== 'date' && options.type !== 'datetime' //独立范围选择器

    ,ul = lay.elem('ul', {
      "class": ELEM_LIST + ' ' + ({
        year: 'laydate-year-list'
        ,month: 'laydate-month-list'
        ,time: 'laydate-time-list'
      })[type]
    })
    ,elemHeader = that.elemHeader[index]
    ,elemYM = lay(elemHeader[2]).find('span')
    ,elemCont = that.elemCont[index || 0]
    ,haveList = lay(elemCont).find('.'+ ELEM_LIST)[0]
    ,isCN = options.lang === 'cn'
    ,text = isCN ? '年' : ''

    ,listYM = that.listYM[index] || {}
    ,hms = ['hours', 'minutes', 'seconds']
    ,startEnd = ['startTime', 'endTime'][index];

    if(listYM[0] < 1) listYM[0] = 1;

    //生成年列表
    if(type === 'year'){
      var yearNum, startY = yearNum = listYM[0] - 7;
      if(startY < 1) startY = yearNum = 1;
      lay.each(new Array(15), function(i){
        var li = lay.elem('li', {
          'lay-ym': yearNum
        })
        ,ymd = {
          year: yearNum
          ,month: 0
          ,date: 1
        };

        yearNum == listYM[0] && lay(li).addClass(THIS$3);
        li.innerHTML = yearNum + text;
        ul.appendChild(li);

        /*
        if(yearNum < that.firstDate.year){
          ymd.month = options.min.month;
          ymd.date = options.min.date;
        } else if(yearNum >= that.firstDate.year){
          ymd.month = options.max.month;
          ymd.date = options.max.date;
        }
        */

        that.limit({
          elem: lay(li),
          date: ymd,
          index: index,
          type: type,
          rangeType: index,
          disabledType: 'date' // 年面板，检测当前年份中的所有日期是否禁用
        });
        that.cellRender(li, {year: yearNum, month: 1, date: 1}, 'year');
        yearNum++;
      });

      lay(elemYM[isCN ? 0 : 1]).attr('lay-ym', (yearNum - 8) + '-' + listYM[1])
      .html((startY + text) + ' - ' + (yearNum - 1 + text));
    }

    //生成月列表
    else if(type === 'month'){
      lay.each(new Array(12), function(i){
        var li = lay.elem('li', {
          'lay-ym': i
        })
        ,ymd = {
          year: listYM[0]
          ,month: i
          ,date: 1
        };

        i + 1 == listYM[1] && lay(li).addClass(THIS$3);
        li.innerHTML = lang.month[i] + (isCN ? '月' : '');
        ul.appendChild(li);

        /*
        if(listYM[0] < that.firstDate.year){
          ymd.date = options.min.date;
        } else if(listYM[0] >= that.firstDate.year){
          ymd.date = options.max.date;
        }
        */

        that.limit({
          elem: lay(li),
          date: ymd,
          index: index,
          type: type,
          rangeType: index,
          disabledType: 'date' // 月面板，检测当前月份中的所有日期是否禁用
        });
        that.cellRender(li, {year: listYM[0], month: i + 1, date: 1}, 'month');
      });

      lay(elemYM[isCN ? 0 : 1]).attr('lay-ym', listYM[0] + '-' + listYM[1])
      .html(listYM[0] + text);
    }

    //生成时间列表
    else if(type === 'time'){
      //检测时分秒状态是否在有效日期时间范围内
      var setTimeStatus = function(){
        lay(ul).find('ol').each(function(i, ol){
          lay(ol).find('li').each(function(ii, li){
            that.limit({
              elem: lay(li),
              date: [{
                hours: ii
              }, {
                hours: that[startEnd].hours
                ,minutes: ii
              }, {
                hours: that[startEnd].hours
                ,minutes: that[startEnd].minutes
                ,seconds: ii
              }][i],
              index: index,
              rangeType: index,
              disabledType: 'time', // 时间面板，分别检测时分秒列表是否禁用
              time: [
                ['hours'],
                ['hours', 'minutes'],
                ['hours', 'minutes', 'seconds']
              ][i]
            });
          });
        });
        if(!options.range){
          that.limit({
            elem: lay(that.footer).find(ELEM_CONFIRM),
            date: that[startEnd],
            index: 0,
            time: ['hours', 'minutes', 'seconds'],
            disabledType: 'datetime' // 确认按钮，检测时分秒列表任意一项是否禁用
          });
        }
      };

      var setTimeListVisibility = function(){
        var showHour = options.format.indexOf('H') !== -1;
        var showMinute = options.format.indexOf('m') !== -1;
        var showSecond = options.format.indexOf('s') !== -1;
        var liElem = ul.children;
        var hideCount = 0;

        lay.each([showHour, showMinute, showSecond], function(i, isShow){
          if(!isShow){
            liElem[i].className += ' layui-hide';
            hideCount++;
          }
        });
        ul.className += (' laydate-time-list-hide-' + hideCount);
      };

      //初始化时间对象
      if(options.range){
        if(!that[startEnd]){
          that[startEnd] = startEnd === 'startTime' ? dateTime : that.endDate;
        }
      } else {
        that[startEnd] = dateTime;
      }

      //生成时分秒
      lay.each([24, 60, 60], function(i, item){
        var li = lay.elem('li'), childUL = ['<p>'+ lang.time[i] +'</p><ol>'];
        lay.each(new Array(item), function(ii){
          childUL.push('<li'+ (that[startEnd][hms[i]] === ii ? ' class="'+ THIS$3 +'"' : '') +'>'+ lay.digit(ii, 2) +'</li>');
        });
        li.innerHTML = childUL.join('') + '</ol>';
        ul.appendChild(li);
      });
      setTimeStatus();
      setTimeListVisibility();
    }

    //插入容器
    if(haveList) elemCont.removeChild(haveList);
    elemCont.appendChild(ul);

    //年月面板 - 选择事件
    if(type === 'year' || type === 'month'){
      //显示切换箭头
      lay(that.elemMain[index]).addClass('laydate-ym-show');

      //选中
      lay(ul).find('li').on('click', function(){
        var ym = lay(this).attr('lay-ym') | 0;
        if(lay(this).hasClass(DISABLED$5)) return;
        if (that.rangeLinked) {
          lay.extend(dateTime, {
            year: type === 'year' ? ym : listYM[0]
            ,month: type === 'year' ? listYM[1] - 1 : ym
          });
        } else {
          dateTime[type] = ym;
        }

        //当为年选择器或者年月选择器
        var isYearOrMonth = ['year', 'month'].indexOf(options.type) !== -1;
        var isChangeMonth = type === 'year' && ['date', 'datetime'].indexOf(options.type) !== -1;
        if (isYearOrMonth || isChangeMonth) {
          lay(ul).find('.'+ THIS$3).removeClass(THIS$3);
          lay(this).addClass(THIS$3);

          //如果为年月选择器，点击了年列表，则切换到月选择器
          if ((options.type === 'month' && type === 'year') || isChangeMonth) {
            that.listYM[index][0] = ym;
            isAlone && ((index ? that.endDate : dateTime).year = ym);
            that.list('month', index);
          }
        } else {
          that.checkDate('limit').calendar(dateTime, index, 'init'); // 重新渲染一下两个面板
          that.closeList();
        }

        if(!options.range){
          that.limit({
            type: type,
            elem: lay(that.footer).find(ELEM_CONFIRM),
            date: dateTime,
            disabledType: 'datetime' // 按钮，检测日期和时间
          });
        }
        
        that.setBtnStatus(); //同步按钮可点状态

        //若为月选择器，只有当选择月份时才自动关闭；
        //若为年选择器，选择年份即自动关闭
        //且在范围未开启时
        if(!options.range && options.autoConfirm){
          if((options.type === 'month' && type === 'month') || (options.type === 'year' && type === 'year')){
            that.setValue(that.parse()).done().remove();
          }
        }

        (that.autoCalendarModel.auto && !that.rangeLinked) ? that.choose(lay(elemCont).find('td.layui-this'), index) : (that.endState && that.done(null, 'change'));
        lay(that.footer).find('.'+ ELEM_TIME_BTN).removeClass(DISABLED$5);
      });
    } else { //时间选择面板 - 选择事件
      var span = lay.elem('span', {
        "class": ELEM_TIME_TEXT
      })

      //滚动条定位
      ,scroll = function(){
        lay(ul).find('ol').each(function(i){
          var ol = this
          ,li = lay(ol).find('li');
          ol.scrollTop = 30*(that[startEnd][hms[i]] - 2);
          if(ol.scrollTop <= 0){
            li.each(function(ii, item){
              if(!lay(this).hasClass(DISABLED$5)){
                ol.scrollTop = 30*(ii - 2);
                return true;
              }
            });
          }
        });
      }
      ,haveSpan = lay(elemHeader[2]).find('.'+ ELEM_TIME_TEXT);

      scroll();
      span.innerHTML = options.range ? [lang.startTime,lang.endTime][index] : lang.timeTips;
      lay(that.elemMain[index]).addClass('laydate-time-show');

      if(haveSpan[0]) haveSpan.remove();
      elemHeader[2].appendChild(span);

      var olElem = lay(ul).find('ol');
      olElem.each(function(i){
        var ol = this;
        //选择时分秒
        lay(ol).find('li').on('click', function(){
          var value = this.innerHTML | 0;
          if(lay(this).hasClass(DISABLED$5)) return;

          if(options.range){
            that[startEnd][hms[i]]  = value;
          } else {
            dateTime[hms[i]] = value;
          }
          lay(ol).find('.'+ THIS$3).removeClass(THIS$3);
          lay(this).addClass(THIS$3);

          setTimeStatus();
          scroll();
          (that.endDate || options.type === 'time' || options.type === 'datetime') && that.done(null, 'change');

          //同步按钮可点状态
          that.setBtnStatus();
        });
      });

      if(layui.device().mobile){
        olElem.css({
          overflowY: 'auto',
          touchAction: 'pan-y'
        });
      }
    }

    return that;
  };

  //记录列表切换后的年月
  Class$d.prototype.listYM = [];

  //关闭列表
  Class$d.prototype.closeList = function(){
    var that = this
    ;that.config;

    lay.each(that.elemCont, function(index, item){
      lay(this).find('.'+ ELEM_LIST).remove();
      lay(that.elemMain[index]).removeClass('laydate-ym-show laydate-time-show');
    });
    lay(that.elem).find('.'+ ELEM_TIME_TEXT).remove();
  };

  //检测结束日期是否超出开始日期
  Class$d.prototype.setBtnStatus = function(tips, start, end){
    var that = this
    ,options = that.config
    ,lang = that.lang()
    ,isOut
    ,elemBtn = lay(that.footer).find(ELEM_CONFIRM)
    ,timeParams = options.type === 'datetime' || options.type === 'time' ? ['hours', 'minutes', 'seconds'] : undefined;
    if(options.range){
      start = start || (that.rangeLinked ? that.startDate : options.dateTime);
      end = end || that.endDate;
      isOut = !that.endState || that.newDate(start).getTime() > that.newDate(end).getTime();

      //如果不在有效日期内，直接禁用按钮，否则比较开始和结束日期
      (that.limit({
        date: start,
        disabledType: 'datetime', // 按钮，检测日期和时间
        time: timeParams,
        rangeType: 0
      }) || that.limit({
        date: end,
        disabledType: 'datetime', // 按钮，检测日期和时间
        time: timeParams,
        rangeType: 1
      }))
        ? elemBtn.addClass(DISABLED$5)
      : elemBtn[isOut ? 'addClass' : 'removeClass'](DISABLED$5);

      //是否异常提示
      if(tips && isOut) that.hint(
        typeof tips === 'string' ? lang.timeout.replace(/日期/g, tips) : lang.timeout
      );
    }
  };

  // 转义为规定格式的日期字符
  Class$d.prototype.parse = function(state, date) {
    var that = this;
    var options = that.config;
    var startDate = (that.rangeLinked ? that.startDate : options.dateTime);
    var dateTime = date || (
      state == 'end' ? lay.extend({}, that.endDate, that.endTime) : (
        options.range
          ? lay.extend({}, startDate || options.dateTime, that.startTime)
        : options.dateTime
      )
    );
    var format = laydate.parse(dateTime, that.format, 1);

    // 返回日期范围字符
    if (options.range && state === undefined) {
      return format + ' '+ that.rangeStr +' ' + that.parse('end');
    }

    return format;
  };

  //创建指定日期时间对象
  Class$d.prototype.newDate = function(dateTime){
    dateTime = dateTime || {};
    return new Date(
      dateTime.year || 1
      ,dateTime.month || 0
      ,dateTime.date || 1
      ,dateTime.hours || 0
      ,dateTime.minutes || 0
      ,dateTime.seconds || 0
    );
  };

  // 获得指定日期时间对象的毫秒数
  Class$d.prototype.getDateTime = function(obj){
    return this.newDate(obj).getTime();
  };

  /**
   * 格式化输入框显示值
   * @param {HTMLInputElement} elem HTML input 元素
   * @param {(value: string) => string} displayValueCallback
   */
  Class$d.prototype.formatToDisplay = function (elem, displayValueCallback) {
    var that = this;
    var props = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value');

    Object.defineProperty(
      elem,
      'value',
      lay.extend({}, props, {
        get: function () {
          return this.getAttribute('lay-date');
        },
        set: function (value) {
          props.set.call(this, displayValueCallback.call(that, value));
          this.setAttribute('lay-date', value);
        },
      })
    );
  };

  //赋值
  Class$d.prototype.setValue = function(value){
    var that = this
    ,options = that.config
    ,elem = options.elem[0];

    //静态展现则不作默认赋值
    if(options.position === 'static') return that;

    value = value || '';

    //绑定的元素是否为 input
    if(that.isInput(elem)){
      lay(elem).val(value);
    } else {
      //如果 range 传入了开始和结束的 input 对象，则分别对其赋值
      var rangeElem = that.rangeElem;
      if(rangeElem){
        if(layui.type(value) !== 'array'){
          value = value.split(' '+ that.rangeStr +' ');
        }
        rangeElem[0].val(value[0] || '');
        rangeElem[1].val(value[1] || '');
      } else {
        if(lay(elem).find('*').length === 0){
          var displayValue = typeof options.formatToDisplay === 'function' ? options.formatToDisplay(value) : value;
          lay(elem).html(displayValue);
        }
        lay(elem).attr('lay-date', value);
      }
    }

    return that;
  };

  //预览
  Class$d.prototype.preview = function(){
    var that = this
    ,options = that.config;

    if(!options.isPreview) return;

    var elemPreview =  lay(that.elem).find('.'+ ELEM_PREVIEW)
    ,value = options.range ? ((that.rangeLinked ? that.endState : that.endDate) ? that.parse() : '') : that.parse();

    // 显示预览
    elemPreview.html(value);

    // 预览颜色渐变
    var oldValue = elemPreview.html();
    oldValue && (elemPreview.css({
      'color': '#16b777'
    }),
    setTimeout(function(){
      elemPreview.css({
        'color': '#777'
      });
    }, 300));
  };

  // 附加的渲染处理，在 ready 和 change 的时候调用
  Class$d.prototype.renderAdditional = function(){
    var that = this;
    var options = that.config;

    // 处理全面板
    if (options.fullPanel) {
      that.list('time', 0);
    }
  };

  // 标记范围内的日期
  Class$d.prototype.stampRange = function(){
    var that = this
      ,options = that.config
      ,startTime = that.rangeLinked ? that.startDate : options.dateTime, endTime
      ,tds = lay(that.elem).find('td');

    if(options.range && !that.endState) lay(that.footer).find(ELEM_CONFIRM).addClass(DISABLED$5);
    // if(!that.endState) return;

    startTime = startTime && that.newDate({
      year: startTime.year
      ,month: startTime.month
      ,date: startTime.date
    }).getTime();

    endTime = that.endState && that.endDate && that.newDate({
      year: that.endDate.year
      ,month: that.endDate.month
      ,date: that.endDate.date
    }).getTime();

    // if(startTime > endTime) return that.hint(TIPS_OUT);

    lay.each(tds, function(i, item){
      var ymd = lay(item).attr('lay-ymd').split('-');
      var thisTime = that.newDate({
        year: ymd[0]
        ,month: ymd[1] - 1
        ,date: ymd[2]
      }).getTime();

      // 标记当天
      if(options.rangeLinked && !that.startDate){
        if(thisTime === that.newDate(that.systemDate()).getTime()){
          lay(item).addClass(
            lay(item).hasClass(ELEM_PREV$1) || lay(item).hasClass(ELEM_NEXT$1)
              ? ''
            : ELEM_DAY_NOW
          );
        }
      }

      /*
       * 标注区间
       */

      lay(item).removeClass(ELEM_SELECTED + ' ' + THIS$3);

      if(thisTime === startTime || thisTime === endTime){
        (that.rangeLinked || (!that.rangeLinked && (i < 42 ? thisTime === startTime : thisTime === endTime))) &&
        lay(item).addClass(
          lay(item).hasClass(ELEM_PREV$1) || lay(item).hasClass(ELEM_NEXT$1)
            ? ELEM_SELECTED
            : THIS$3
        );
      }
      if(thisTime > startTime && thisTime < endTime){
        lay(item).addClass(ELEM_SELECTED);
      }
    });
  };

  // 执行 done/change 回调
  Class$d.prototype.done = function(param, type){
    var that = this;
    var options = that.config;
    var start = lay.extend({},
      lay.extend(that.rangeLinked ? that.startDate : options.dateTime, that.startTime)
    );
    var end = lay.extend({}, lay.extend(that.endDate, that.endTime));

    lay.each([start, end], function(i, item){
      if(!('month' in item)) return;
      lay.extend(item, {
        month: item.month + 1
      });
    });

    that.preview();

    param = param || [that.parse(), start, end];
    type === 'change' && that.renderAdditional();
    typeof options[type || 'done'] === 'function' && options[type || 'done'].apply(options, param);

    return that;
  };

  /**
   * 判断日期是否存在面板，用于处理日期范围选择的一些边缘情况
   * @param {object} datetime 日期时间对象
   * @param {number} index - 面板索引
   * @returns
   */
  Class$d.prototype.checkPanelDate = function(datetime, index){
    var that = this;
    var options = that.config;
    // 年月范围选择不需要处理
    if(options.type !== 'date' && options.type !== 'datetime') return;

    var startPanel = index === 0;
    var month = datetime.month + 1; // 点击的日期所在月份
    var panelMonth = that.panelYM[index].month + 1; // 当前面板头部月份

    // 边缘日期的处理
    var firstRenderIndex = that.endState
      // 二次点击（一般为结束日期）任意一侧面板时：
      // 1. 左侧面板中，点击的月份属于下一个月时，应渲染右侧面板而不是左侧面板;
      // 2. 左侧面板中，点击的月份属于上一个月时，应将两个面板都重新渲染(等效点击 prevMonth);
      // 3. 右侧面板同理。
      ? function() {
        return (startPanel && month > panelMonth) || (!startPanel && month < panelMonth)
          ? 1 - index
          : index;
      }()
      // 初次点击（一般为开始日期）任意一侧面板时：
      // 1. 让该面板自行切换，以保持日期的「选中状态」在该侧；
      // 2. 另一侧面板则根据点击的面板进行响应式切换，以保持左右面板始终为连续月份。
      : index;

    // 为简化实现，只要点击的月份不等于当前面板顶部显示的月份时，就重新渲染两侧面板
    return {
      needFullRender: month !== panelMonth,
      index: firstRenderIndex
    }
  };

  //选择日期
  Class$d.prototype.choose = function(td, index){
    if(td.hasClass(DISABLED$5)) return;

    var that = this
    ,options = that.config
    ,panelIndex = index; // 记录点击的是哪一个面板的

    if (that.rangeLinked) {
      if (that.endState || !that.startDate) {
        // 重新选择或者第一次选择
        index = 0;
        that.endState = false;
      } else {
        index = 1;
        that.endState = true;
      }
    }

    var dateTime = that.thisDateTime(index)

    ;lay(that.elem).find('td')
    ;var YMD = td.attr('lay-ymd').split('-');

    YMD = {
      year: YMD[0] | 0
      ,month: (YMD[1] | 0) - 1
      ,date: YMD[2] | 0
    };

    lay.extend(dateTime, YMD); //同步 dateTime

    //范围选择
    if(options.range){
      //补充时分秒
      lay.each(['startTime', 'endTime'], function(i, item){
        that[item] = that[item] || {
          hours: i ? 23: 0
          ,minutes: i ? 59: 0
          ,seconds: i ? 59: 0
        };
        if (index === i) {
          // 判断选择之后的是否在范围内，超出则需要调整时分秒
          if (that.getDateTime(lay.extend({}, dateTime, that[item])) < that.getDateTime(options.min)) {
            that[item] = {
              hours: options.min.hours
              ,minutes: options.min.minutes
              ,seconds: options.min.seconds
            };
            lay.extend(dateTime, that[item]);
          } else if (that.getDateTime(lay.extend({}, dateTime, that[item])) > that.getDateTime(options.max)) {
            that[item] = {
              hours: options.max.hours
              ,minutes: options.max.minutes
              ,seconds: options.max.seconds
            };
            lay.extend(dateTime, that[item]);
          }
        }
      });
      if (!index) {
        that.startDate = lay.extend({}, dateTime); // 同步startDate
      }
      // 校验另外一个日期是否在有效的范围内
      // 此处为范围选择的日期面板点击选中处理，所以 disabledType 为 date
      if (that.endState && !that.limit({date: that.rangeLinked ? that.startDate : that.thisDateTime(1 - index), disabledType:'date'})) {
        // 根据选择之后判断是否需要切换模式
        var isChange;
        if (that.endState && that.autoCalendarModel.auto) {
          isChange = that.autoCalendarModel();
        }
        // 判断是否反选
        var needSwapDate = (isChange || that.rangeLinked && that.endState) && that.newDate(that.startDate) > that.newDate(that.endDate);
        if (needSwapDate){
          var isSameDate = that.startDate.year === that.endDate.year && that.startDate.month === that.endDate.month && that.startDate.date === that.endDate.date;
          var startDate;
          // 如果是同一天并且出现了反选证明是时分秒出现开始时间大于结束时间的现象
          if(isSameDate){
            startDate = that.startTime;
            that.startTime = that.endTime;
            that.endTime = startDate;
          }
          // 当出现反向选择时（即“后点击”的日期比“先点击”的日期小），重新提取区间
          startDate = that.startDate;
          that.startDate = lay.extend({}, that.endDate, that.startTime);
          options.dateTime = lay.extend({}, that.startDate);
          that.endDate = lay.extend({}, startDate, that.endTime);
        }
        isChange && (options.dateTime = lay.extend({}, that.startDate));
      }
      if (that.rangeLinked) {
        // 处理日期范围选择的一些边缘情况
        var checkState = that.checkPanelDate(dateTime, panelIndex);
        var dateTimeTemp = lay.extend({}, dateTime);
        var renderMode = (isChange || (checkState && checkState.needFullRender)) ? 'init' : null;
        var panelIdx =  checkState ? checkState.index : panelIndex;
        that.calendar(dateTimeTemp, panelIdx, renderMode);
      } else {
        that.calendar(null, index, isChange ? 'init' : null);
      }
      that.endState && that.done(null, 'change');
    } else if(options.position === 'static'){ //直接嵌套的选中
      that.calendar().done().done(null, 'change'); //同时执行 done 和 change 回调
    } else if(options.type === 'date'){
      options.autoConfirm ? that.setValue(that.parse()).done().remove() : that.calendar().done(null, 'change');
    } else if(options.type === 'datetime'){
      that.calendar().done(null, 'change');
    }
  };

  //底部按钮
  Class$d.prototype.tool = function(btn, type){
    var that = this
    ,options = that.config
    ,lang = that.lang()
    ,dateTime = options.dateTime
    ,isStatic = options.position === 'static'
    ,active = {
      //选择时间
      datetime: function(){
        if(lay(btn).hasClass(DISABLED$5)) return;
        that.list('time', 0);
        options.range && that.list('time', 1);
        lay(btn).attr('lay-type', 'date').html(that.lang().dateTips);
      }

      //选择日期
      ,date: function(){
        that.closeList();
        lay(btn).attr('lay-type', 'datetime').html(that.lang().timeTips);
      }

      //清空、重置
      ,clear: function(){
        isStatic && (
          lay.extend(dateTime, that.firstDate)
          ,that.calendar()
        );
        options.range && (
          delete options.dateTime
          ,delete that.endDate
          ,delete that.startTime
          ,delete that.endTime
        );
        that.setValue('');
        that.done(null, 'onClear').done(['', {}, {}]).remove();
      }

      // 现在
      ,now: function(){
        var thisDate = new Date();

        // 当前系统时间未在 min/max 范围内，则不可点击
        if(lay(btn).hasClass(DISABLED$5)){
          return that.hint(lang.tools.now +', '+ lang.invalidDate);
        }

        lay.extend(dateTime, that.systemDate(), {
          hours: thisDate.getHours()
          ,minutes: thisDate.getMinutes()
          ,seconds: thisDate.getSeconds()
        });

        that.setValue(that.parse());
        isStatic && that.calendar();
        that.done(null, 'onNow').done().remove();
      }

      //确定
      ,confirm: function(){
        if(options.range){
          if(lay(btn).hasClass(DISABLED$5)){
            var isTimeout = options.type === 'time'
              ? that.startTime && that.endTime && that.newDate(that.startTime) > that.newDate(that.endTime)
              : that.startDate && that.endDate && that.newDate(lay.extend({},that.startDate, that.startTime || {})) > that.newDate(lay.extend({},that.endDate, that.endTime || {}));

            return isTimeout
              ? that.hint(options.type === 'time' ? lang.timeout.replace(/日期/g, '时间') : lang.timeout)
              : that.hint(lang.invalidDate);
          }
        } else {
          if(lay(btn).hasClass(DISABLED$5)) return that.hint(lang.invalidDate);
        }

        that.setValue(that.parse());
        that.done(null, 'onConfirm').done().remove();
      }
    };
    active[type] && active[type]();
  };

  //统一切换处理
  Class$d.prototype.change = function(index){
    var that = this
    ,options = that.config
    ,dateTime = that.thisDateTime(index)
    ,isAlone = options.range && (options.type === 'year' || options.type === 'month')

    ,elemCont = that.elemCont[index || 0]
    ,listYM = that.listYM[index]
    ,addSubYear = function(type){
      var isYear = lay(elemCont).find('.laydate-year-list')[0]
      ,isMonth = lay(elemCont).find('.laydate-month-list')[0];

      //切换年列表
      if(isYear){
        listYM[0] = type ? listYM[0] - 15 : listYM[0] + 15;
        that.list('year', index);
      }

      if(isMonth){ //切换月面板中的年
        type ? listYM[0]-- : listYM[0]++;
        that.list('month', index);
      }

      if(isYear || isMonth){
        lay.extend(dateTime, {
          year: listYM[0]
        });
        if(isAlone) dateTime.year = listYM[0];
        options.range || that.done(null, 'change');
        options.range || that.limit({
          elem: lay(that.footer).find(ELEM_CONFIRM),
          date: {
            year: listYM[0],
            month: isYear ? 0 : listYM[1] - 1,
          },
          disabledType: 'datetime' // 按钮，检测日期和时间
        });
      }

      that.setBtnStatus();
      return isYear || isMonth;
    };

    return {
      prevYear: function(){
        if(addSubYear('sub')) return;
        if (that.rangeLinked) {
          options.dateTime.year--;
          that.checkDate('limit').calendar(null, null, 'init');
        } else {
          dateTime.year--;
          that.checkDate('limit').calendar(null, index);
          // 面板自动切换的模式下重新判定是否发生模式转换等细节处理
          that.autoCalendarModel.auto ? that.choose(lay(elemCont).find('td.layui-this'), index) : that.done(null, 'change');
        }
      }
      ,prevMonth: function(){
        // rangeLinked 模式非实时选择日期，不需要同步 options.dateTime，应根据面板显示日期切换
        if(that.rangeLinked){
          var panelYM = that.panelYM[0];
          var YM = that.getAsYM(panelYM.year, panelYM.month, 'sub');
          var dateTimeTemp = lay.extend({}, options.dateTime, that.panelYM[0], {year: YM[0], month: YM[1]});
          that.checkDate('limit').calendar(dateTimeTemp, null, 'init');
        }else {
          var YM = that.getAsYM(dateTime.year, dateTime.month, 'sub');
          lay.extend(dateTime, {
            year: YM[0]
            ,month: YM[1]
          });

          that.checkDate('limit').calendar(null, null, 'init');
          that.autoCalendarModel.auto ? that.choose(lay(elemCont).find('td.layui-this'), index) : that.done(null, 'change');
        }
      }
      ,nextMonth: function(){
        if(that.rangeLinked){
          var panelYM = that.panelYM[0];
          var YM = that.getAsYM(panelYM.year, panelYM.month);
          var dateTimeTemp = lay.extend({}, options.dateTime, that.panelYM[0], {year: YM[0],month: YM[1]});
          that.checkDate('limit').calendar(dateTimeTemp, null, 'init');
        }else {
          var YM = that.getAsYM(dateTime.year, dateTime.month);
          lay.extend(dateTime, {
            year: YM[0]
            ,month: YM[1]
          });

          that.checkDate('limit').calendar(null, null, 'init');
          that.autoCalendarModel.auto ? that.choose(lay(elemCont).find('td.layui-this'), index) : that.done(null, 'change');
        }
      }
      ,nextYear: function(){
        if(addSubYear()) return;
        if (that.rangeLinked) {
          options.dateTime.year++;
          that.checkDate('limit').calendar(null, 0, 'init');
        } else {
          dateTime.year++;
          that.checkDate('limit').calendar(null, index);
          that.autoCalendarModel.auto ? that.choose(lay(elemCont).find('td.layui-this'), index) : that.done(null, 'change');
        }
      }
    };
  };

  //日期切换事件
  Class$d.prototype.changeEvent = function(){
    var that = this
    ;that.config;

    //日期选择事件
    lay(that.elem).on('click', function(e){
      lay.stope(e);
    }).on('mousedown', function(e){
      lay.stope(e);
    });

    //年月切换
    lay.each(that.elemHeader, function(i, header){
      //上一年
      lay(header[0]).on('click', function(e){
        that.change(i).prevYear();
      });

      //上一月
      lay(header[1]).on('click', function(e){
        that.change(i).prevMonth();
      });

      //选择年月
      lay(header[2]).find('span').on('click', function(e){
        var othis = lay(this)
        ,layYM = othis.attr('lay-ym')
        ,layType = othis.attr('lay-type');

        if(!layYM) return;

        layYM = layYM.split('-');

        that.listYM[i] = [layYM[0] | 0, layYM[1] | 0];
        that.list(layType, i);
        lay(that.footer).find('.'+ ELEM_TIME_BTN).addClass(DISABLED$5);
      });

      //下一月
      lay(header[3]).on('click', function(e){
        that.change(i).nextMonth();
      });

      //下一年
      lay(header[4]).on('click', function(e){
        that.change(i).nextYear();
      });
    });

    //点击日期
    lay.each(that.table, function(i, table){
      var tds = lay(table).find('td');
      tds.on('click', function(){
        that.choose(lay(this), i);
      });
    });

    //点击底部按钮
    lay(that.footer).find('span').on('click', function(){
      var type = lay(this).attr('lay-type');
      that.tool(this, type);
    });
  };

  //是否输入框
  Class$d.prototype.isInput = function(elem){
    return /input|textarea/.test(elem.tagName.toLocaleLowerCase()) || /INPUT|TEXTAREA/.test(elem.tagName);
  };

  //绑定的元素事件处理
  Class$d.prototype.events = function(){
    var that = this;
    var options = that.config;

    if(!options.elem[0] || options.elem[0].eventHandler) return;

    var showEvent = function(){
      // 已经打开的面板避免重新渲染
      if(laydate.thisId === options.id) return;
      that.render();
    };

    //绑定呼出控件事件
    options.elem.on(options.trigger, showEvent);
    options.elem[0].eventHandler = true;
    options.eventElem.on(options.trigger, showEvent);

    // 元素解绑
    that.unbind = function () {
      that.remove();
      options.elem.off(options.trigger, showEvent);
      options.elem.removeAttr('lay-key');
      options.elem.removeAttr(MOD_ID$3);
      options.elem[0].eventHandler = false;
      options.eventElem.off(options.trigger, showEvent);
      options.eventElem.removeAttr('lay-key');
      delete thisModule$6.that[options.id];
    };
  };

  //记录所有实例
  thisModule$6.that = {}; //记录所有实例对象

  //获取当前实例对象
  thisModule$6.getThis = function(id){
    var that = thisModule$6.that[id];
    if(!that && isLayui) layui.hint().error(id ? (MOD_NAME$a +' instance with ID \''+ id +'\' not found') : 'ID argument required');
    return that;
  };

  // 初始执行
  ready.run = function(lay){
    // 绑定关闭控件事件
    lay(document).on('mousedown', function(e){
      if(!laydate.thisId) return;
      var that = thisModule$6.getThis(laydate.thisId);
      if(!that) return;

      var options = that.config;

      if(
        e.target === options.elem[0] ||
        e.target === options.eventElem[0] ||
        e.target === lay(options.closeStop)[0] ||
        (options.elem[0] && options.elem[0].contains(e.target))
      ) return;

      that.remove();

    }).on('keydown', function(e){
      if(!laydate.thisId) return;
      var that = thisModule$6.getThis(laydate.thisId);
      if(!that) return;

      // 回车触发确认
      if(that.config.position === 'static') return;
      if(e.keyCode === 13){
        if(lay('#'+ that.elemID)[0] && that.elemID === Class$d.thisElemDate){
          e.preventDefault();
          lay(that.footer).find(ELEM_CONFIRM)[0].click();
        }
      }
    });

    //自适应定位
    lay(window).on('resize', function(){
      if(!laydate.thisId) return;
      var that = thisModule$6.getThis(laydate.thisId);
      if(!that) return;

      if(!that.elem || !lay(ELEM$3)[0]){
        return false;
      }

      that.position();
    });
  };

  // 渲染 - 核心接口
  laydate.render = function(options){
    var inst = new Class$d(options);
    return thisModule$6.call(inst);
  };

  // 重载
  laydate.reload = function (id, options) {
    var that = thisModule$6.getThis(id);
    if(!that) return;
    return that.reload(options);
  };

  // 获取对应 ID 的实例
  laydate.getInst = function (id) {
    var that = thisModule$6.getThis(id);
    if(that){
      return that.inst;
    }
  };

  // 面板提示
  laydate.hint = function(id, opts){
    var that = thisModule$6.getThis(id);
    if(!that) return;
    return that.hint(opts);
  };

  // 解绑实例
  laydate.unbind = function(id){
    var that = thisModule$6.getThis(id);
    if(!that) return;
    return that.unbind();
  };

  // 关闭日期面板
  laydate.close = function(id){
    var that = thisModule$6.getThis(id || laydate.thisId);
    if(!that) return;
    return that.remove();
  };

  // 将指定对象转化为日期值
  laydate.parse = function(dateTime, format, one){
    dateTime = dateTime || {};

    //如果 format 是字符型，则转换为数组格式
    if(typeof format === 'string'){
      format = thisModule$6.formatArr(format);
    }

    format = (format || []).concat();

    //转义为规定格式
    lay.each(format, function(i, item){
      if(/yyyy|y/.test(item)){ //年
        format[i] = lay.digit(dateTime.year, item.length);
      } else if(/MM|M/.test(item)){ //月
        format[i] = lay.digit(dateTime.month + (one || 0), item.length);
      } else if(/dd|d/.test(item)){ //日
        format[i] = lay.digit(dateTime.date, item.length);
      } else if(/HH|H/.test(item)){ //时
        format[i] = lay.digit(dateTime.hours, item.length);
      } else if(/mm|m/.test(item)){ //分
        format[i] = lay.digit(dateTime.minutes, item.length);
      } else if(/ss|s/.test(item)){ //秒
        format[i] = lay.digit(dateTime.seconds, item.length);
      }
    });

    return format.join('');
  };

  // 得到某月的最后一天
  laydate.getEndDate = function(month, year){
    var thisDate = new Date();
    //设置日期为下个月的第一天
    thisDate.setFullYear(
      year || thisDate.getFullYear()
      ,month || (thisDate.getMonth() + 1)
    ,1);
    //减去一天，得到当前月最后一天
    return new Date(thisDate.getTime() - 1000*60*60*24).getDate();
  };

      laydate.ready();
      ready.run(lay);

/**
 * laypage 分页组件
 */


  var doc = document;
  var id = 'getElementById';
  var tag = 'getElementsByTagName';
  var DISABLED$4 = 'layui-disabled';

  // 构造器
  var Class$c = function(options){
    var that = this;
    that.config = options || {};
    that.config.index = ++laypage.index;
    that.render(true);
  };

  // 判断传入的容器类型
  Class$c.prototype.type = function(){
    var config = this.config;
    if(typeof config.elem === 'object'){
      return config.elem.length === undefined ? 2 : 3;
    }
  };

  // 分页视图
  Class$c.prototype.view = function(){
    var that = this;
    var config = that.config;

    // 连续页码个数
    var groups = config.groups = 'groups' in config
      ? (Number(config.groups) || 0)
    : 5;

    // 排版
    config.layout = typeof config.layout === 'object'
      ? config.layout
    : ['prev', 'page', 'next'];

    config.count = Number(config.count) || 0; // 数据总数
    config.curr = Number(config.curr) || 1; // 当前页

    // 每页条数的选择项
    config.limits = typeof config.limits === 'object'
      ? config.limits
    : [10, 20, 30, 40, 50];

     // 默认条数
    config.limit = Number(config.limit) || 10;

    // 总页数
    config.pages = Math.ceil(config.count/config.limit) || 1;

    // 当前页不能超过总页数
    if(config.curr > config.pages){
      config.curr = config.pages;
    } else if(config.curr < 1) { // 当前分页不能小于 1
      config.curr = 1;
    }

    // 连续分页个数不能低于 0 且不能大于总页数
    if(groups < 0){
      groups = 1;
    } else if (groups > config.pages){
      groups = config.pages;
    }

    config.prev = 'prev' in config ? config.prev : '上一页'; // 上一页文本
    config.next = 'next' in config ? config.next : '下一页'; // 下一页文本

    // 计算当前组
    var index = config.pages > groups
      ? Math.ceil( (config.curr + (groups > 1 ? 1 : 0)) / (groups > 0 ? groups : 1) )
    : 1;

    // 视图片段
    var views = {
      // 上一页
      prev: function(){
        return config.prev
          ? '<a class="layui-laypage-prev'+ (config.curr == 1 ? (' ' + DISABLED$4) : '') +'" data-page="'+ (config.curr - 1) +'">'+ config.prev +'</a>'
        : '';
      }(),

      // 页码
      page: function(){
        var pager = [];

        // 数据量为0时，不输出页码
        if(config.count < 1){
          return '';
        }

        // 首页
        if(index > 1 && config.first !== false && groups !== 0){
          pager.push('<a class="layui-laypage-first" data-page="1"  title="首页">'+ (config.first || 1) +'</a>');
        }

        // 计算当前页码组的起始页
        var halve = Math.floor((groups-1)/2); // 页码数等分
        var start = index > 1 ? config.curr - halve : 1;
        var end = index > 1 ? (function(){
          var max = config.curr + (groups - halve - 1);
          return max > config.pages ? config.pages : max;
        }()) : groups;

        // 防止最后一组出现“不规定”的连续页码数
        if(end - start < groups - 1){
          start = end - groups + 1;
        }

        // 输出左分割符
        if(config.first !== false && start > 2){
          pager.push('<span class="layui-laypage-spr">...</span>');
        }

        // 输出连续页码
        for(; start <= end; start++){
          if(start === config.curr){
            // 当前页
            pager.push('<span class="layui-laypage-curr"><em class="layui-laypage-em" '+ (/^#/.test(config.theme) ? 'style="background-color:'+ config.theme +';"' : '') +'></em><em>'+ start +'</em></span>');
          } else {
            pager.push('<a data-page="'+ start +'">'+ start +'</a>');
          }
        }

        // 输出输出右分隔符 & 末页
        if(config.pages > groups && config.pages > end && config.last !== false){
          if(end + 1 < config.pages){
            pager.push('<span class="layui-laypage-spr">...</span>');
          }
          if(groups !== 0){
            pager.push('<a class="layui-laypage-last" title="尾页"  data-page="'+ config.pages +'">'+ (config.last || config.pages) +'</a>');
          }
        }

        return pager.join('');
      }(),

      // 下一页
      next: function(){
        return config.next
          ? '<a class="layui-laypage-next'+ (config.curr == config.pages ? (' ' + DISABLED$4) : '') +'" data-page="'+ (config.curr + 1) +'">'+ config.next +'</a>'
        : '';
      }(),

      // 数据总数
      count: function(){
        var countText = typeof config.countText === 'object' ? config.countText : ['共 ', ' 条'];
        return '<span class="layui-laypage-count">'+ countText[0] + config.count + countText[1] +'</span>'
      }(),

      // 每页条数
      limit: function(){
        var elemArr = ['<span class="layui-laypage-limits"><select lay-ignore>'];
        var template = function(item) {
          var def = item +' 条/页';
          return typeof config.limitTemplet === 'function'
            ? (config.limitTemplet(item) || def)
          : def;
        };

        // 条目选项列表
        layui.each(config.limits, function(index, item){
          elemArr.push(
            '<option value="'+ item +'"'+ (item === config.limit ? ' selected' : '') +'>'
              + template(item)
            + '</option>'
          );
        });

        return elemArr.join('') +'</select></span>';
      }(),

      // 刷新当前页
      refresh: [
        '<a data-page="'+ config.curr +'" class="layui-laypage-refresh">',
          '<i class="layui-icon layui-icon-refresh"></i>',
        '</a>'
      ].join(''),

      // 跳页区域
      skip: function(){
        var skipText = typeof config.skipText === 'object' ? config.skipText : [
          '到第',
          '页',
          '确定'
        ];
        return [
          '<span class="layui-laypage-skip">'+ skipText[0],
            '<input type="text" min="1" value="'+ config.curr +'" class="layui-input">',
            skipText[1]+ '<button type="button" class="layui-laypage-btn">'+ skipText[2] +'</button>',
          '</span>'
        ].join('');
      }()
    };

    return ['<div class="layui-box layui-unselect layui-laypage layui-laypage-'+ (config.theme ? (
      /^#/.test(config.theme) ? 'molv' : config.theme
    ) : 'default') +'" id="layui-laypage-'+ config.index +'">',
      function(){
        var plate = [];
        layui.each(config.layout, function(index, item){
          if(views[item]){
            plate.push(views[item]);
          }
        });
        return plate.join('');
      }(),
    '</div>'].join('');
  };

  // 跳页的回调
  Class$c.prototype.jump = function(elem, isskip){
    if(!elem) return;

    var that = this;
    var config = that.config;
    var childs = elem.children;
    var btn = elem[tag]('button')[0];
    var input = elem[tag]('input')[0];
    var select = elem[tag]('select')[0];
    var skip = function(){
      var curr = Number(input.value.replace(/\s|\D/g, ''));
      if(curr){
        config.curr = curr;
        that.render();
      }
    };

    if(isskip) return skip();

    // 页码
    for(var i = 0, len = childs.length; i < len; i++){
      if(childs[i].nodeName.toLowerCase() === 'a'){
        laypage.on(childs[i], 'click', function(){
          var curr = Number(this.getAttribute('data-page'));
          if(curr < 1 || curr > config.pages) return;
          config.curr = curr;
          that.render();
        });
      }
    }

    // 条数
    if(select){
      laypage.on(select, 'change', function(){
        var value = this.value;
        if(config.curr*value > config.count){
          config.curr = Math.ceil(config.count/value);
        }
        config.limit = value;
        that.render();
      });
    }

    // 确定
    if(btn){
      laypage.on(btn, 'click', function(){
        skip();
      });
    }
  };

  // 输入页数字控制
  Class$c.prototype.skip = function(elem){
    if(!elem) return;

    var that = this;
    var input = elem[tag]('input')[0];

    if(!input) return;

    // 键盘事件
    laypage.on(input, 'keyup', function(e){
      var value = this.value;
      var keyCode = e.keyCode;

      if(/^(37|38|39|40)$/.test(keyCode)) return;

      if(/\D/.test(value)){
        this.value = value.replace(/\D/, '');
      }
      if(keyCode === 13){
        that.jump(elem, true);
      }
    });
  };

  // 渲染分页
  Class$c.prototype.render = function(load){
    var that = this;
    var config = that.config;
    var type = that.type();
    var view = that.view();

    if(type === 2){
      config.elem && (config.elem.innerHTML = view);
    } else if(type === 3){
      config.elem.html(view);
    } else {
      if(doc[id](config.elem)){
        doc[id](config.elem).innerHTML = view;
      }
    }

    config.jump && config.jump(config, load);

    var elem = doc[id]('layui-laypage-' + config.index);
    that.jump(elem);

    if(config.hash && !load){
      location.hash = '!'+ config.hash +'='+ config.curr;
    }

    that.skip(elem);
  };

  // 外部接口
  var laypage = {
    // 分页渲染
    render: function(options){
      var o = new Class$c(options);
      return o.index;
    },
    index: layui.laypage ? (layui.laypage.index + 10000) : 0,
    on: function(elem, even, fn){
      elem.attachEvent ? elem.attachEvent('on'+ even, function(e){ // for ie
        e.target = e.srcElement;
        fn.call(elem, e);
      }) : elem.addEventListener(even, fn, false);
      return this;
    }
  };

/**
 * laytpl
 * 轻量级通用模板引擎
 */


  // 实例接口
  var thisModule$5 = function() {
    var that = this;
    var options = that.config;

    return {
      config: options,

      /**
       * 渲染模板
       * @param {Object} data - 模板数据
       * @param {Function} callback - 回调函数
       * @returns {string} 渲染后的模板
       */
      render: function(data, callback) {
        options.data = data;
        var html = that.render();

        // 如果传入目标元素选择器，则直接将模板渲染到目标元素中
        if (options.target) {
          var elem = document.querySelector(options.target);
          if (elem) {
            elem.innerHTML = html;
          }
        }

        // 返回结果
        return typeof callback === 'function'
          ? (callback(html), this)
          : html;
      },

      /**
       * 编译新的模板
       * @param {string} template - 模板
       * @returns {this}
       */
      compile: function(template) {
        options.template = template;
        delete that.compilerCache; // 清除模板缓存
        // that.compile(template);
        return this;
      },

      /**
       * 模板编译错误事件
       * @param {Function} callback
       * @returns {this}
       */
      error: function(callback) {
        callback && (options.error = callback);
        return this;
      },

      /**
       * 以下为兼容旧版本相关方法
       */

      // 解析并渲染模板
      parse: function(template, data) {
        return this.compile(template).render(data);
      }
    };
  };

  // 模板内部变量
  var vars = {
    // 字符转义
    escape: function(html) {
      var exp = /[<"'>]|&(?=#?[a-zA-Z0-9]+)/g;
      if (html === undefined || html === null) return '';
      html += '';
      if (!exp.test(html)) return html;
      return html.replace(exp, function(str) {
        return '&#'+ str.charCodeAt(0) + ';';
      });
    }
  };

  // 组件工具类方法
  var tools = {
    /**
     * 创建动态正则表达式
     * @param {string} str - 表达式字符
     * @param {string} mod - 修饰符
     * @returns {RegExp} - 正则表达式
     */
    regex: function(str, mod) {
      return new RegExp(str, mod || 'g');
    },

    /**
     * 错误提示
     * @param {string} e - 原始错误信息
     * @param {Object} opts - 自定义选项
     * @param {Function} error - 错误回调
     * @returns {string} - 错误提示
     */
    error: function(e, opts, error) {
      opts = opts || {};
      opts = Object.assign({
        errorContext: ''
      }, opts);

      // 向控制台输出错误信息
      var message = 'Laytpl '+ (opts.type || '') +'Error: ' + e;
      var errorContext = opts.errorContext;

      delete opts.errorContext;
      typeof console === 'object' && console.error(message, '\n', errorContext, '\n', opts);
      typeof error === 'function' && error(opts); // 执行错误回调
      return message; // 向视图返回错误提示
    }
  };

  // 默认配置
  var config$1 = {
    open: '{{', // 起始界定符
    close: '}}', // 结束界定符
    cache: true, // 是否开启模板缓存，以便下次渲染时不重新编译模板
    condense: true, // 是否压缩模板空白符，如：将多个连续的空白符压缩为单个空格
    tagStyle: '' // 标签风格。默认采用 < 2.11 的风格，设置 modern 则采用 2.11+ 风格
  };

  // 构造器
  var Class$b = function(template, options) {
    var that = this;

    // 选项合并
    options = that.config = Object.assign({
      template: template
    }, config$1, options);

    // 当前实例的模板内工具
    that.vars = Object.assign({
      /**
       * 引用外部模板。若在 Node.js 环境，可通过重置该方法实现模板文件导入
       * @param {string} id - 模板 ID
       * @param {Object} data - 模板数据
       * @returns {string} 模板渲染后内容
       */
      include: function(id, data) {
        var elem = document.getElementById(id);
        var template = elem ? elem.innerHTML : '';
        return template ? that.render(template, data) : '';
      }
    }, vars);

    // 编译模板
    that.compile(options.template);
  };

  /**
   * 渲染
   * @param {Object} template - 模板
   * @param {Object} data - 数据
   * @returns {string} 渲染后的模板内容
   */
  Class$b.prototype.render = function(template, data) {
    var that = this;
    var options = that.config;

    // 获得模板渲染函数
    var compiler = template ? that.compile(template) : (
      that.compilerCache || that.compile(options.template)
    );

    // 获取渲染后的字符
    var html = function() {
      data = data || options.data || {};
      try {
        return compiler(data);
      } catch(e) {
        template = template || options.template;
        return tools.error(e, {
          errorContext: that.extractErrorContext(template, data),
          template: template,
          type: 'Render'
        }, options.error);
      }
    }();

    // 缓存编译器
    if (options.cache && !template) {
      that.compilerCache = compiler;
    }

    return html; // 返回渲染后的字符
  };

  /**
   * 编译模板
   * @param {string} template - 原始模板
   * @returns {Function} 模板编译器，用于后续数据渲染
   */
  Class$b.prototype.compile = function(template) {
    var that = this;
    var options = that.config;
    var openDelimiter = options.open;
    var closeDelimiter = options.close;
    var condense = options.condense;
    var regex = tools.regex;
    var placeholder = '\u2028'; // Unicode 行分隔符

    // console.log('compile');

    // 模板必须为 string 类型，且不能为空
    if (typeof template !== 'string' || !template) {
      return function() {
        return '';
      };
    }

    /**
     * 完整标签正则
     * @param {string[]} cores - 标签内部核心表达式，含：前置、主体、后置
     * @param {Object} sides - 标签两侧外部表达式
     * @returns {RegExp}
     */
    var tagRegex = function(cores, sides) {
      var arr = [
        '(?:'+ openDelimiter + (cores[0] || '') +'\\s*)', // 界定符前置
        '('+ (cores[1] || '[\\s\\S]') +'*?)', // 标签主体
        '(?:\\s*'+ (cores[2] || '') + closeDelimiter +')' // 界定符后置
      ];
      sides = sides || {};
      sides.before && arr.unshift(sides.before); // 标签前面的表达式
      sides.after && arr.push(sides.after); // 标签后面的表达式
      return regex(arr.join(''));
    };

    // 匹配非输出类型标签两侧的换行符和空白符，避免渲染后占用一行
    var sidesRegex = condense ? ['', ''] : ['(?:(?:\\n)*\\s*)', '(?:\\s*?)'];
    var delimSides = {
      before: sidesRegex[0],
      after: sidesRegex[1]
    };

    /**
     * 清理多余符号
     * @param {string} body - 标签主体字符
     * @param {boolean} nowrap - 是否强制不换行
     * @returns {string} 清理后的字符
     */
    var clear = function(body, nowrap) {
      if (!condense) {
        // 还原语句中的 Unicode 行分隔符
        body = body.replace(regex(placeholder), nowrap ? '' : '\n');
      }
      body = body.replace(/\\(\\|")/g, '$1'); // 去除多余反斜杠
      return body;
    };

    // 纠正标签结构
    var correct = function(tpl) {
      return tpl.replace(regex('([}\\]])'+ closeDelimiter), '$1 '+ closeDelimiter);
    };

    // 模板解析
    var parse = that.parse = function(tpl) {
      tpl = tpl || '';
      if (!tpl) return tpl;

      // 压缩连续空白符
      if (condense) {
        tpl = tpl.replace(/\t/g, ' ').replace(/\s+/g, ' ');
      }

      // 初始整理
      tpl = correct(tpl) // 纠正标签
      .replace(/(?=\\|")/g, '\\')  // 转义反斜杠和双引号
      .replace(/\r?\n/g, condense ? '' : placeholder); // 整理换行符

      // 忽略标签 - 即区域中的内容不进行标签解析
      tpl = tpl.replace(tagRegex(['!', '', '!'], delimSides), function(str, body) {
        body = body.replace(regex(openDelimiter + '|' + closeDelimiter), function(tag) {
          return tag.replace(/(?=.)/g, '\\');
        });
        return body;
      });

      // 模板字符拼接
      var strConcatenation = function(body) {
        // 通过对 20k+ 行的模板进行编译测试， 发现 Chrome `+=` 性能竟优于 `push`
        // 1k 次循环 + 1k 行数据量进行模板编译+渲染，发现 `+=` 性能仍然优于 `push`
        // 考虑可能是 V8 做了 Ropes 结构优化？ 或跟模板采用「静态拼接」的实现有关（可能性更大）
        return ['";', body, '__laytpl__+="'].join('\n');
        // return ['");', body, '__laytpl__.push("'].join('\n');
      };

      // 解析输出标签
      var output = function(str, delimiter, body) {
        var _escape;

        if (!body) return '';
        body = clear(body, true);

        // 输出方式
        if (delimiter === '-') {  // 原文输出，即不对 HTML 原文进行转义
          _escape = '';
        } else { // 转义输出
          _escape = '_escape';
        }

        return body ? strConcatenation(
          '__laytpl__+='+ _escape +'('+ body +');'
          // '__laytpl__.push('+ _escape +'('+ body +'));'
        ) : '';
      };

      // 解析 Scriptlet
      var statement = function(str, body) {
        if (!body) return '';
        body = clear(body);
        return strConcatenation(body);
      };

      // 标签风格
      if (options.tagStyle === 'modern') { // 2.11+ 版本风格
        // 注释标签 - 仅在模板中显示，不进行解析，也不在视图中输出
        tpl = tpl.replace(tagRegex(['#'], delimSides), '');
        // 输出标签
        tpl = tpl.replace(tagRegex(['(=|-)']), output);
        // Scriptlet 标签
        tpl = tpl.replace(tagRegex([], delimSides), statement);
      } else { // < 2.11 版本风格
        // Scriptlet 标签
        tpl = tpl.replace(tagRegex(['#'], delimSides), statement);
        // 输出标签
        tpl = tpl.replace(tagRegex(['(=|-)*']), output);
      }

      // 恢复换行符
      if (!condense) {
        tpl = tpl.replace(regex(placeholder), '\\n');
      }

      return tpl;
    };

    /**
     * 创建模板编译器
     * 请注意: 开发者在使用模板语法时，需确保模板中的 JS 语句不来自于页面用户输入。
     * 即模板中的 JS 语句必须在页面开发者自身的可控范围内，否则请避免使用该模板解析。
     */
    var createCompiler = that.createCompiler = function(template, builder) {
      builder = builder || createBuilder(template);
      return new Function('laytpl', 'return '+ builder)(that.vars);
    };
    var createBuilder = that.createBuilder = function(template, builder) {
       builder = builder || [
        'function(d){',
          '"use strict";',
          'var __laytpl__="",'+
          function() { // 内部变量
            // 内部方法
            var arr = [];
            for (var key in that.vars) {
              arr.push(((key === 'escape' ? '_' : '') + key) +'=laytpl.'+ key);
            }
            return arr.join(',');
          }() + ';',
          '__laytpl__="'+ parse(template) +'";',
          'return __laytpl__;',
          // '__laytpl__.push("'+ parse(template) +'");',
          // 'return __laytpl__.join("");',
        '};'
      ].join('\n');
      // console.log(builder);
      return builder;
    };

    try {
      return createCompiler(template); // 返回编译器
    } catch(e) {
      delete that.compilerCache;
      return function() {
        return tools.error(e, {
          errorContext: that.extractErrorContext(template),
          template: template,
          type: 'Compile'
        }, options.error);
      };
    }
  };

  /**
   * 获取模板出错行上下文
   * @param {string} template - 原始模板
   * @param {Object} data - 数据
   * @returns {string}
   */
  Class$b.prototype.extractErrorContext = function(template, data) {
    var that = this;

    // 给模板每行开头添加行号标记
    var lineNum = 1; // 行号
    var templateArr = template.split(/\r?\n/g);

    template = template.replace(/(?=^)/gm, function() {
      return '/*LINE:'+ (lineNum++) +'*/';
    });

    var builder = that.createBuilder(template);
    var builderArr = builder.split(/\r?\n/);
    var sourceURL = 'laytpl.builder.map';

    // 模板出错行上下文
    var errorContext = function(errLineNum) {
      errLineNum = parseInt(errLineNum) - 1;

      var arr = [''];
      var contextLines = 3; // 错误行上下延伸的行数
      var start = Math.max(0, errLineNum - contextLines);
      var end = Math.min(templateArr.length, errLineNum + contextLines);

      for (; start <= end; start++) {
        arr.push(
          (start == errLineNum ? '? ' : '  ') +
          ((start + 1) + '| ') +
          templateArr[start]
        );
      }

      return arr.join('\n') + '\n';
    };

    try {
      builder += ('\n//# sourceURL='+ sourceURL); // 添加映射
      var compiler = that.createCompiler(template, builder);
      if (data) compiler(data);
    } catch(e) {
      // 提取堆栈报错行号
      var stackLineNumRegxp = tools.regex(sourceURL.replace(/\./g, '\\.')+':(\\d+)', 'i');
      var stackLineNum = (e.stack.match(stackLineNumRegxp) || [])[1] || 0;

      // 提取模板实际行号
      var extractErrLineNum = function(stackLineNum, isRecursion) {
        var lineNumRegxp = isRecursion ? /\/\*LINE:(\d+)\*\/[^*]*$/ : /\/\*LINE:(\d+)\*\//;
        var errLineNum = String(builderArr[stackLineNum - 1]).match(lineNumRegxp) || [];
        errLineNum = errLineNum[1];

        // 若当前行未找到行号映射，则递归查找上一行
        if (!errLineNum && stackLineNum > 0) {
          return extractErrLineNum(stackLineNum - 1, true);
        }

        return errLineNum;
      };

      // 此处减去 anonymous 开头占用的 2 行
      var errLineNum = extractErrLineNum(stackLineNum - 2);

      // 若未找到映射行号，则直接返回 SyntaxError 对象（通过 DevTools 映射源查看模板行号标记）
      return errLineNum ? errorContext(errLineNum) : e;
    }
  };

  /**
   * 创建实例
   * @param {string} template - 模板
   * @param {Object} options - 选项
   * @returns {Object}
   */
  var laytpl = function(template, options) {
    var inst = new Class$b(template, options);
    return thisModule$5.call(inst);
  };

  /**
   * 扩展模板内部变量
   * @param {Object} variables - 扩展内部变量，变量值通常为函数
   */
  laytpl.extendVars = function(variables) {
    Object.assign(vars, variables);
  };

  /**
   * 设置默认配置
   * @param {Object} options - 选项
   */
  laytpl.config = laytpl.set = function(options) {
    Object.assign(config$1, options);
  };

/**
 * util 工具组件
 */


  var hint$5 = layui.hint();

  // 外部接口
  var util = {
    // 固定块
    fixbar: function(options){
      var ELEM = 'layui-fixbar';
      var $doc = jquery(document);

      // 默认可选项
      options = jquery.extend(true, {
        target: 'body', // fixbar 的插入目标选择器
        bars: [], //  bar 信息
        "default": true, // 是否显示默认 bar
        margin: 160, // 出现 top bar 的滚动条高度临界值
        duration: 320 // top bar 等动画时长（毫秒）
      }, options);

      // 目标元素对象
      var $target = jquery(options.target);

      // 滚动条所在元素对象
      var $scroll = options.scroll
        ? jquery(options.scroll)
      : jquery(options.target === 'body' ? $doc : $target);

      // 是否提供默认图标
      if(options['default']){
        // 兼容旧版本的一些属性
        if(options.bar1){
          options.bars.push({
            type: 'bar1',
            icon: 'layui-icon-chat'
          });
        }
        if(options.bar2){
          options.bars.push({
            type: 'bar2',
            icon: 'layui-icon-help'
          });
        }
        // 默认 top bar
        options.bars.push({
          type: 'top',
          icon: 'layui-icon-top'
        });
      }

      var elem = jquery('<ul>').addClass(ELEM);
      var elemTopBar;

      // 遍历生成 bars 节点
      layui.each(options.bars, function(i, item){
        var elemBar = jquery('<li class="layui-icon">');

        // 设置 bar 相关属性
        elemBar.addClass(item.icon).attr({
          'lay-type': item.type,
          'style': item.style || (options.bgcolor ? 'background-color: '+ options.bgcolor : '')
        }).html(item.content);

        // bar 点击事件
        elemBar.on('click', function(){
          var type = jquery(this).attr('lay-type');
          if(type === 'top'){
            (
              options.target === 'body'
                ? jquery('html,body')
              : $scroll
            ).animate({
              scrollTop : 0
            }, options.duration);
          }
          typeof options.click === 'function' && options.click.call(this, type);
        });

        // 自定义任意事件
        if(layui.type(options.on) === 'object'){
          layui.each(options.on, function(eventName, callback){
            elemBar.on(eventName, function(){
              var type = jquery(this).attr('lay-type');
              typeof callback === 'function' && callback.call(this, type);
            });
          });
        }

        // 获得 top bar 节点
        if(item.type === 'top'){
          elemBar.addClass('layui-fixbar-top');
          elemTopBar = elemBar;
        }

        elem.append(elemBar); // 插入 bar 节点
      });

      // 若目标元素已存在 fixbar，则移除旧的节点
      $target.find('.'+ ELEM).remove();

      // 向目标元素插入 fixbar 节点
      typeof options.css === 'object' && elem.css(options.css);
      $target.append(elem);

      // top bar 的显示隐藏
      if(elemTopBar){
        var lock;
        var setTopBar = (function setTopBar(){
          var top = $scroll.scrollTop();
          if(top >= options.margin){
            lock || (elemTopBar.show(), lock = 1);
          } else {
            lock && (elemTopBar.hide(), lock = 0);
          }
          return setTopBar;
        })();
      }

      // 根据 scrollbar 设置 fixbar 相关状态
      var timer;
      $scroll.on('scroll', function(){
        if(!setTopBar) return;
        clearTimeout(timer);
        timer = setTimeout(function(){
          setTopBar();
        }, 100);
      });
    },

    // 倒计时
    countdown: function(options){

      // 默认可选项
      options = jquery.extend(true, {
        date: new Date(),
        now: new Date()
      }, options);

      // 兼容旧版参数
      var args = arguments;
      if(args.length > 1){
        options.date = new Date(args[0]);
        options.now = new Date(args[1]);
        options.clock = args[2];
      }

      // 实例对象
      var inst = {
        options: options,
        clear: function(){ // 清除计时器
          clearTimeout(inst.timer);
        },
        reload: function(opts){ // 重置倒计时
          this.clear();
          jquery.extend(true, this.options, {
            now: new Date()
          }, opts);
          count();
        }
      };

      typeof options.ready === 'function' && options.ready();

      // 计算倒计时
      var count = (function fn(){
        var date = new Date(options.date);
        var now = new Date(options.now);
        var countTime = function(time){
          return time > 0 ? time : 0;
        }(date.getTime() - now.getTime());
        var result = {
          d: Math.floor(countTime/(1000*60*60*24)), // 天
          h: Math.floor(countTime/(1000*60*60)) % 24, // 时
          m: Math.floor(countTime/(1000*60)) % 60, // 分
          s: Math.floor(countTime/1000) % 60 // 秒
        };
        var next = function(){
          now.setTime(now.getTime() + 1000);
          options.now = now;
          count();
        };

        // 兼容旧版返回值
        if(args.length > 1) result = [result.d,result.h,result.m,result.s];

        // 计时 - 以秒间隔
        inst.timer = setTimeout(next, 1000);
        typeof options.clock === 'function' && options.clock(result, inst);

        // 计时完成
        if(countTime <= 0){
          clearTimeout(inst.timer);
          typeof options.done === 'function' && options.done(result, inst);
        }

        return fn;
      })();

      return inst;
    },

    // 某个时间在当前时间的多久前
    timeAgo: function(time, onlyDate){
      var that = this;
      var arr = [[], []];
      var stamp = new Date().getTime() - new Date(time).getTime();

      // 返回具体日期
      if(stamp > 1000*60*60*24*31){
        stamp =  new Date(time);
        arr[0][0] = that.digit(stamp.getFullYear(), 4);
        arr[0][1] = that.digit(stamp.getMonth() + 1);
        arr[0][2] = that.digit(stamp.getDate());

        // 是否输出时间
        if(!onlyDate){
          arr[1][0] = that.digit(stamp.getHours());
          arr[1][1] = that.digit(stamp.getMinutes());
          arr[1][2] = that.digit(stamp.getSeconds());
        }
        return arr[0].join('-') + ' ' + arr[1].join(':');
      }

      // 30 天以内，返回「多久前」
      if(stamp >= 1000*60*60*24){
        return ((stamp/1000/60/60/24)|0) + ' 天前';
      } else if(stamp >= 1000*60*60){
        return ((stamp/1000/60/60)|0) + ' 小时前';
      } else if(stamp >= 1000*60*3){ // 3 分钟以内为：刚刚
        return ((stamp/1000/60)|0) + ' 分钟前';
      } else if(stamp < 0){
        return '未来';
      } else {
        return '刚刚';
      }
    },

    // 数字前置补零
    digit: function(num, length){
      var str = '';
      num = String(num);
      length = length || 2;
      for(var i = num.length; i < length; i++){
        str += '0';
      }
      return num < Math.pow(10, length) ? str + (num|0) : num;
    },

    // 转化为日期格式字符
    toDateString: function(time, format, options){
      // 若 null 或空字符，则返回空字符
      if(time === null || time === '') return '';

      // 引用自 dayjs
      // https://github.com/iamkun/dayjs/blob/v1.11.9/src/constant.js#L30
      var REGEX_FORMAT = /\[([^\]]+)]|y{1,4}|M{1,2}|d{1,2}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|SSS/g;
      var REGEX_PARSE = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[T\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/i;
      var that = this;

      var normalizeDate = function(date) {
        if(typeof date === 'undefined'){
          return new Date();
        }
        if(!isNaN(date)){
          return new Date(typeof date === 'string' ? parseInt(date) : date);
        }
        if(typeof date === 'string' && !/Z$/i.test(date)){
          var d = date.match(REGEX_PARSE);
          if(d){
            var m = d[2] - 1 || 0;
            var ms = (d[7] || '0').substring(0, 3);
            return new Date(
              d[1],
              m,
              d[3] || 1,
              d[4] || 0,
              d[5] || 0,
              d[6] || 0,
              ms
            );
          }
        }

        return new Date(date)
      };
      var date = normalizeDate(time);

      if(!date.getDate()) return hint$5.error('Invalid millisecond for "util.toDateString(millisecond)"'), '';

      var years = date.getFullYear();
      var month = date.getMonth();
      var days = date.getDate();
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var seconds = date.getSeconds();
      var milliseconds = date.getMilliseconds();

      var defaultMeridiem = function(hours, minutes){
          var hm = hours * 100 + minutes;
          if (hm < 600) {
            return '凌晨';
          } else if (hm < 900) {
            return '早上';
          } else if (hm < 1100) {
            return '上午';
          } else if (hm < 1300) {
            return '中午';
          } else if (hm < 1800) {
            return '下午';
          }
          return '晚上';
      };

      var meridiem = (options && options.customMeridiem) || defaultMeridiem;

      var matches = {
        yy: function(){return String(years).slice(-2);},
        yyyy: function(){return that.digit(years, 4);},
        M: function(){return String(month + 1);},
        MM: function(){return that.digit(month + 1);},
        d: function(){return String(days);},
        dd: function(){return that.digit(days);},
        H: function(){return String(hours);},
        HH: function(){return that.digit(hours);},
        h: function(){return String(hours % 12 || 12);},
        hh: function(){return that.digit(hours % 12 || 12);},
        A: function(){return meridiem(hours, minutes);},
        m: function(){return String(minutes);},
        mm: function(){return that.digit(minutes);},
        s: function(){return String(seconds);},
        ss: function(){return that.digit(seconds);},
        SSS: function(){return that.digit(milliseconds, 3);}
      };

      format = format || 'yyyy-MM-dd HH:mm:ss';

      return format.replace(REGEX_FORMAT, function(match, $1) {
        return $1 || (matches[match] && matches[match]()) || match;
      });
    },

    // 转义 html
    escape: function(html){
      var exp = /[<"'>]|&(?=#?[a-zA-Z0-9]+)/g;
      if (html === undefined || html === null) return '';

      html += '';
      if (!exp.test(html)) return html;

      return html.replace(/&(?=#?[a-zA-Z0-9]+;?)/g, '&amp;')
      .replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/'/g, '&#39;').replace(/"/g, '&quot;');
    },

    // 还原转义的 html
    unescape: function(html){
      if (html === undefined || html === null) return '';

      return String(html).replace(/\&quot;/g, '"').replace(/\&#39;/g, '\'')
      .replace(/\&gt;/g, '>').replace(/\&lt;/g, '<')
      .replace(/\&amp;/g, '&');
    },

    // 打开新窗口
    openWin: function(options){
      var win;
      options = options || {};
      win = options.window || window.open((options.url || ''), options.target, options.specs);
      if(options.url) return;
      win.document.open('text/html', 'replace');
      win.document.write(options.content || '');
      win.document.close();
    },

    // 让指定的元素保持在可视区域
    toVisibleArea: function(options){
      options = jquery.extend({
        margin: 160, // 触发动作的边界值
        duration: 200, // 动画持续毫秒数
        type: 'y' // 触发方向，x 水平、y 垂直
      }, options);

      if(!options.scrollElem[0] || !options.thisElem[0]) return;

      var scrollElem = options.scrollElem; // 滚动元素
      var thisElem = options.thisElem; // 目标元素
      var vertical = options.type === 'y'; // 是否垂直方向
      var SCROLL_NAME = vertical ? 'scrollTop' : 'scrollLeft'; // 滚动方法
      var OFFSET_NAME = vertical ? 'top' : 'left'; // 坐标方式
      var scrollValue = scrollElem[SCROLL_NAME](); // 当前滚动距离
      var size = scrollElem[vertical ? 'height' : 'width'](); // 滚动元素的尺寸
      var scrollOffset = scrollElem.offset()[OFFSET_NAME]; // 滚动元素所处位置
      var thisOffset = thisElem.offset()[OFFSET_NAME] - scrollOffset; // 目标元素当前的所在位置
      var obj = {};

      // 边界满足条件
      if(thisOffset > size - options.margin || thisOffset < options.margin){
        obj[SCROLL_NAME] = thisOffset - size/2 + scrollValue;
        scrollElem.animate(obj, options.duration);
      }
    },

    /**
     * 批量事件
     * @param {string} [attr="lay-on"] - 触发事件的元素属性名
     * @param {Object.<string, Function>} events - 事件集合
     * @param {Object} [options] - 参数的更多选项
     * @param {(string|HTMLElement|JQuery)} [options.elem="body"] - 触发事件的委托元素
     * @param {string} [options.trigger="click"] - 事件触发的方式
     * @returns {Object} 返回当前 events 参数设置的事件集合
     */
    on: function(attr, events, options) {
      // 若参数一为 object 类型，则为事件集，且省略 attr
      if (typeof attr === 'object') {
        options = events || {};
        events = attr;
        attr = options.attr || 'lay-on'; // 默认属性名
      }

      // 更多选项
      options = jquery.extend({
        elem: 'body',
        trigger: 'click'
      }, typeof options === 'object' ? options : {
        trigger: options // 兼容旧版
      });

      var elem = options.elem = jquery(options.elem);
      var attrSelector = '['+ attr +']';
      var DATANAME = 'UTIL_ON_DATA'; // 缓存在委托元素上的 data-* 属性名

      if (!elem[0]) return; // 若委托元素不存在

      // 初始化 data 默认值，以委托元素为存储单元
      if (!elem.data(DATANAME)) {
        elem.data(DATANAME, {
          events: {}
        });
      }

      // 读取 data 缓存
      var dataCache = elem.data(DATANAME);

      // 根据 attr 和 trigger 的组合作为 key
      var key = attr + '_' + options.trigger;

      // 根据 key 记录事件集合
      events = dataCache.events[key] = jquery.extend(true, dataCache.events[key], events);


      // 清除事件委托，避免重复绑定
      var trigger = options.trigger + '.lay_util_on';
      elem.off(trigger, attrSelector);

      // 绑定事件委托
      elem.on(trigger, attrSelector, function(e) {
        var othis = jquery(this);
        var attrValue = othis.attr(attr);
        typeof events[attrValue] === 'function' && events[attrValue].call(this, othis, e);
      });

      return events;
    }
  };

  // 兼容旧版
  util.event = util.on;

/**
 * form 表单组件
 */


  var hint$4 = layui.hint();
  layui.device();

  var MOD_NAME$9 = 'form';
  var ELEM$2 = '.layui-form';
  var THIS$2 = 'layui-this';
  var HIDE$4 = 'layui-hide';
  var DISABLED$3 = 'layui-disabled';
  var OUT_OF_RANGE = 'layui-input-number-out-of-range';
  var BAD_INPUT = 'layui-input-number-invalid';

  // ie8 中可以获取到 input 元素的 'indeterminate' 属性描述符，但重新定义 getter/setter 无效，无报错
  // AppleWebKit/537.36 无法获取 input 元素任意属性的属性描述符(包括lookupGetter)，但可以重新定义 getter/setter
  var needCheckboxFallback = (lay.ie && parseFloat(lay.ie) === 8)
    || typeof Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'checked') === 'undefined';

  var Form = function(){
    this.config = {
      // 内置的验证规则
      verify: {
        required: function(value) {
          if (!/[\S]+/.test(value) || value === undefined || value === null) {
            return '必填项不能为空';
          }
        },
        phone: function(value) {
          var EXP = /^1\d{10}$/;
          if (value && !EXP.test(value)) {
            return '手机号格式不正确';
          }
        },
        email: function(value) {
          var EXP = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
          if (value && !EXP.test(value)) {
            return '邮箱格式不正确';
          }
        },
        url: function(value) {
          var EXP = /^(#|(http(s?)):\/\/|\/\/)[^\s]+\.[^\s]+$/;
          if (value && !EXP.test(value)) {
            return '链接格式不正确';
          }
        },
        number: function(value){
          if (value && isNaN(value)) {
            return '只能填写数字';
          }
        },
        date: function(value){
          var EXP = /^(\d{4})[-\/](\d{1}|0\d{1}|1[0-2])([-\/](\d{1}|0\d{1}|[1-2][0-9]|3[0-1]))*$/;
          if (value && !EXP.test(value)) {
            return '日期格式不正确';
          }
        },
        identity: function(value) {
          var EXP = /(^\d{15}$)|(^\d{17}(x|X|\d)$)/;
          if (value && !EXP.test(value)) {
            return '身份证号格式不正确';
          }
        }
      },
      autocomplete: null // 全局 autocomplete 状态。 null 表示不干预
    };
  };

  // 全局设置
  Form.prototype.set = function(options){
    var that = this;
    jquery.extend(true, that.config, options);
    return that;
  };

  // 验证规则设定
  Form.prototype.verify = function(settings){
    var that = this;
    jquery.extend(true, that.config.verify, settings);
    return that;
  };

  // 获取指定表单对象
  Form.prototype.getFormElem = function(filter){
    return jquery(ELEM$2 + function(){
      return filter ? ('[lay-filter="' + filter +'"]') : '';
    }());
  };

  // 表单事件
  Form.prototype.on = function(events, callback){
    return layui.onevent.call(this, MOD_NAME$9, events, callback);
  };

  // 赋值/取值
  Form.prototype.val = function(filter, object){
    var that = this
    ,formElem = that.getFormElem(filter);

    // 遍历
    formElem.each(function(index, item){
      var itemForm = jquery(this);

      // 赋值
      for(var key in object){
        if(!lay.hasOwn(object, key)) continue;

        var type;
        var value = object[key];
        var itemElem = itemForm.find('[name="'+ key +'"]');

        // 如果对应的表单不存在，则不执行
        if(!itemElem[0]) continue;
        type = itemElem[0].type;

        // 如果为复选框
        if(type === 'checkbox'){
          itemElem[0].checked = value;
        } else if(type === 'radio') { // 如果为单选框
          itemElem.each(function(){
            this.checked = this.value == value + '';
          });
        } else { // 其它类型的表单
          itemElem.val(value);
        }
      }    });

    form.render(null, filter);

    // 返回值
    return that.getValue(filter);
  };

  // 取值
  Form.prototype.getValue = function(filter, itemForm){
    itemForm = itemForm || this.getFormElem(filter);

    var nameIndex = {} // 数组 name 索引
    ,field = {}
    ,fieldElem = itemForm.find('input,select,textarea'); // 获取所有表单域

    layui.each(fieldElem, function(_, item){
      var othis = jquery(this)
      ,init_name; // 初始 name

      item.name = (item.name || '').replace(/^\s*|\s*&/, '');
      if(!item.name) return;

      // 用于支持数组 name
      if(/^.*\[\]$/.test(item.name)){
        var key = item.name.match(/^(.*)\[\]$/g)[0];
        nameIndex[key] = nameIndex[key] | 0;
        init_name = item.name.replace(/^(.*)\[\]$/, '$1['+ (nameIndex[key]++) +']');
      }

      if(/^(checkbox|radio)$/.test(item.type) && !item.checked) return;  // 复选框和单选框未选中，不记录字段
      // select 多选用 jQuery 方式取值，未选中 option 时，
      // jQuery v2.2.4 及以下版本返回 null，以上(3.x) 返回 []。
      // 统一规范化为 []，参考 https://github.com/jquery/jquery/issues/2562
      field[init_name || item.name] = (this.tagName === 'SELECT' && typeof this.getAttribute('multiple') === 'string')
        ? othis.val() || []
        : this.value;
    });

    return field;
  };

  // 表单控件渲染
  Form.prototype.render = function(type, filter){
    var that = this;
    var options = that.config;
    var elemForm = jquery(ELEM$2 + function(){
      return filter ? ('[lay-filter="' + filter +'"]') : '';
    }());
    var items = {
      // 输入框
      input: function(elem){
        var inputs = elem || elemForm.find('input,textarea');

        // 初始化全局的 autocomplete
        options.autocomplete && inputs.attr('autocomplete', options.autocomplete);

        var handleInputNumber = function(elem, eventType){
          var that = this;
          var rawValue = elem.val();
          var value = Number(rawValue);
          var step = Number(elem.attr('step')) || 1; // 加减的数字间隔
          var min = Number(elem.attr('min'));
          var max = Number(elem.attr('max'));
          var precision = Number(elem.attr('lay-precision'));
          var noAction = eventType !== 'click' && rawValue === ''; // 初始渲染和失焦时空值不作处理
          var isInit = eventType === 'init';
          var isBadInput = isNaN(value);
          var isStepStrictly = typeof elem.attr('lay-step-strictly') === 'string';

          elem.toggleClass(BAD_INPUT, isBadInput);
          if(isBadInput) return; // 若非数字，则不作处理

          if(eventType === 'click'){
            // 兼容旧版行为，2.10 以前 readonly 不禁用控制按钮
            if(elem[0].type === 'text' && typeof elem.attr('readonly') === 'string') return;
            var isDecrement = !!jquery(that).index(); // 0: icon-up, 1: icon-down
            value = isDecrement ? value - step : value + step;
          }

          // 获取小数点后位数
          var decimals = function(step){
            var decimals = (step.toString().match(/\.(\d+$)/) || [])[1] || '';
            return decimals.length;
          };

          precision = precision >= 0 ? precision : Math.max(decimals(step), decimals(rawValue));

          // 赋值
          if (!noAction) {
            // 初始渲染时只处理数字精度
            if (!isInit) {
              if(isStepStrictly){
                value = Math.round(value / step) * step;
              }
              if(value <= min) value = min;
              if(value >= max) value = max;
            }
            // 若 `lay-precision` 为 0, 则表示只保留整数
            if (precision === 0) {
              value = parseInt(value);
            } else if(precision > 0) { // 小数位精度
              value = value.toFixed(precision);
            }

            elem.val(value);
            elem.attr('lay-input-mirror', elem.val());
          }

          // 超出范围的样式
          var outOfRange = value < min || value > max;
          elem[outOfRange && !noAction ? 'addClass' : 'removeClass'](OUT_OF_RANGE);

          if(isInit) return;

          // 更新按钮状态
          var controlBtn = {
            increment: elem.next().find('.layui-icon-up'),
            decrement: elem.next().find('.layui-icon-down')
          };
          controlBtn.increment[(value >= max && !noAction) ? 'addClass' : 'removeClass'](DISABLED$3);
          controlBtn.decrement[(value <= min && !noAction) ? 'addClass' : 'removeClass'](DISABLED$3);
        };

        // 初始化输入框动态点缀
        elemForm.find('input[lay-affix],textarea[lay-affix]').each(function(){
          var othis = jquery(this);
          var affix = othis.attr('lay-affix');
          var CLASS_WRAP = 'layui-input-wrap';
          var CLASS_SUFFIX = 'layui-input-suffix';
          var CLASS_AFFIX = 'layui-input-affix';
          var disabled = othis.is('[disabled]') || othis.is('[readonly]');

          // 根据是否空值来显示或隐藏元素
          var showAffix = function(elem, value){
            elem = jquery(elem);
            if(!elem[0]) return;
            elem[jquery.trim(value) ? 'removeClass' : 'addClass'](HIDE$4);
          };

          // 渲染动态点缀内容
          var renderAffix = function(opts){
            opts = jquery.extend({}, (affixOptions[affix] || {
              value: affix
            }), opts, lay.options(othis[0]));
            var elemAffix = jquery('<div class="'+ CLASS_AFFIX +'">');
            var value = layui.isArray(opts.value) ? opts.value : [opts.value];
            var elemIcon = jquery(function(){
              var arr = [];
              layui.each(value, function(i, item){
                arr.push('<i class="layui-icon layui-icon-'+ item + (
                  opts.disabled ? (' '+ DISABLED$3) : ''
                ) +'"></i>');
              });
              return arr.join('');
            }());

            elemAffix.append(elemIcon); // 插入图标元素

            // 追加 className
            if(opts.split) elemAffix.addClass('layui-input-split');
            if(opts.className) elemAffix.addClass(opts.className);

            // 移除旧的元素
            var hasElemAffix = othis.next('.'+ CLASS_AFFIX);
            if(hasElemAffix[0]) hasElemAffix.remove();

            // 是否在规定的容器中
            if(!othis.parent().hasClass(CLASS_WRAP)){
              othis.wrap('<div class="'+ CLASS_WRAP +'"></div>');
            }

            // 是否已经存在后缀元素
            var hasElemSuffix = othis.next('.'+ CLASS_SUFFIX);
            if(hasElemSuffix[0]){
              hasElemAffix = hasElemSuffix.find('.'+ CLASS_AFFIX);
              if(hasElemAffix[0]) hasElemAffix.remove();

              hasElemSuffix.prepend(elemAffix);

              othis.css('padding-right', function(){
                var paddingRight = othis.closest('.layui-input-group')[0]
                  ? 0
                : hasElemSuffix.outerWidth();
                return paddingRight + elemAffix.outerWidth()
              });
            } else {
              elemAffix.addClass(CLASS_SUFFIX);
              othis.after(elemAffix);
            }

            opts.show === 'auto' && showAffix(elemAffix, othis.val());

            typeof opts.init === 'function' && opts.init.call(this, othis, opts);

            // 输入事件
            othis.on('input propertychange', function(){
              var value = this.value;
              opts.show === 'auto' && showAffix(elemAffix, value);
            });

            // 失去焦点事件
            othis.on('blur', function(){
              typeof opts.blur === 'function' && opts.blur.call(this, othis, opts);
            });

            // 点击动态后缀事件
            elemIcon.on('click', function(){
              var inputFilter = othis.attr('lay-filter');
              if(jquery(this).hasClass(DISABLED$3)) return;

              typeof opts.click === 'function' && opts.click.call(this, othis, opts);

              // 对外事件
              layui.event.call(this, MOD_NAME$9, 'input-affix('+ inputFilter +')', {
                elem: othis[0],
                affix: affix,
                options: opts
              });
            });
          };

          // 动态点缀配置项
          var affixOptions = {
            eye: { // 密码显隐
              value: 'eye-invisible',
              click: function(elem, opts){ // 事件
                var SHOW_NAME = 'LAY_FORM_INPUT_AFFIX_SHOW';
                var isShow = elem.data(SHOW_NAME);

                elem.attr('type', isShow ? 'password' : 'text').data(SHOW_NAME, !isShow);

                renderAffix({
                  value: isShow ? 'eye-invisible' : 'eye'
                });
              }
            },
            clear: { // 内容清除
              value: 'clear',
              click: function(elem){
                elem.val('').focus();
                showAffix(jquery(this).parent(), null);
              },
              show: 'auto', // 根据输入框值是否存在来显示或隐藏点缀图标
              disabled: disabled // 跟随输入框禁用状态
            },
            number: { // 数字输入框
              value: ['up', 'down'],
              split: true,
              className: 'layui-input-number',
              disabled: othis.is('[disabled]'), // 跟随输入框禁用状态
              init: function(elem){
                // 旧版浏览器不支持更改 input 元素的 type 属性，需要主动设置 text
                if(elem.attr('type') === 'text' || elem[0].type === 'text'){
                  var ns = '.lay_input_number';
                  var skipCheck = false;
                  var isComposition = false;
                  var isReadonly = typeof elem.attr('readonly') === 'string';
                  var isMouseWheel = typeof elem.attr('lay-wheel') === 'string';
                  var btnElem = elem.next('.layui-input-number').children('i');
                  // 旧版浏览器不支持 beforeInput 事件，需要设置一个 attr 存储输入前的值
                  elem.attr('lay-input-mirror', elem.val());
                  elem.off(ns);
                  // 旧版浏览器不支持 event.inputType 属性，需要用 keydown 事件来判断是否跳过输入检查
                  elem.on('keydown' + ns, function (e) {
                    skipCheck = false;
                    if (e.keyCode === 8 || e.keyCode === 46) { // Backspace || Delete
                      skipCheck = true;
                    }
                    // Up & Down 键盘事件处理
                    if(!isReadonly && btnElem.length === 2 && (e.keyCode === 38 || e.keyCode === 40)){
                      e.preventDefault();
                      btnElem.eq(e.keyCode === 38 ? 0 : 1).click();
                    }
                  });
                  elem.on('input' + ns + ' propertychange' + ns, function (e) {
                    if (isComposition || (e.type === 'propertychange' && e.originalEvent.propertyName !== 'value')) return;
                    if (skipCheck || canInputNumber(this.value)) {
                      elem.attr('lay-input-mirror', this.value);
                    } else {
                      // 恢复输入前的值
                      this.value = elem.attr('lay-input-mirror');
                    }
                    elem.toggleClass(BAD_INPUT, isNaN(Number(this.value)));
                  });
                  elem.on('compositionstart' + ns, function () {
                    isComposition = true;
                  });
                  elem.on('compositionend' + ns, function () {
                    isComposition = false;
                    elem.trigger('input');
                  });
                  // 响应鼠标滚轮或触摸板
                  if(isMouseWheel){
                    elem.on(['wheel','mousewheel','DOMMouseScroll'].join(ns + ' ') + ns, function (e) {
                      if(!btnElem.length) return;
                      if(!jquery(this).is(':focus')) return;
                      var direction = 0;
                      e.preventDefault();
                      // IE9+，chrome 和 firefox 同时添加 'wheel' 和 'mousewheel' 事件时，只执行 'wheel' 事件
                      if(e.type === 'wheel'){
                        e.deltaX = e.originalEvent.deltaX;
                        e.deltaY = e.originalEvent.deltaY;
                        direction = Math.abs(e.deltaX) >= Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
                      }else if(e.type === 'mousewheel' ){
                        direction = -e.originalEvent.wheelDelta;
                      }else if(e.type === 'DOMMouseScroll'){
                        direction = e.originalEvent.detail;
                      }
                      btnElem.eq(direction > 0 ? 1 : 0).click();
                    });
                  }

                  if(isReadonly){
                    btnElem.addClass(DISABLED$3);
                  }
                }
                handleInputNumber.call(this, elem, 'init');
              },
              click: function(elem){
                handleInputNumber.call(this, elem, 'click');
              },
              blur: function(elem){
                handleInputNumber.call(this, elem, 'blur');
              },
            }
          };

          renderAffix();
        });
      }

      // 下拉选择框
      ,select: function(elem){
        var TIPS = '请选择';
        var CLASS = 'layui-form-select';
        var TITLE = 'layui-select-title';
        var NONE = 'layui-select-none';
        var CREATE_OPTION = 'layui-select-create-option';
        var PANEL_WRAP = 'layui-select-panel-wrap';
        var PANEL_ELEM_DATA = 'layui-select-panel-elem-data';
        var selects = elem || elemForm.find('select');

        // 各种事件
        var events = function(reElem, titleElem, disabled, isSearch, isCreatable, isAppendTo){
          var select = jquery(this);
          var title = titleElem;
          var input = title.find('input');
          var dl = reElem.find('dl');
          dl.children('dd');
          var dts = dl.children('dt'); // select 分组dt元素
          var index =  this.selectedIndex; // 当前选中的索引
          var initValue = '';
          var removeClickOutsideEvent;

          if(disabled) return;

          /**
           * 搜索项
           * @typedef searchOption
           * @prop {boolean} [caseSensitive=false] 是否区分大小写
           * @prop {boolean} [fuzzy=false] 是否开启模糊匹配，开启后将会忽略模式出现在字符串中的位置。
           */
          /** @type {searchOption} */
          var laySearch = select.attr('lay-search') === 'cs' ? {caseSensitive:true} : lay.options(select, {attr:'lay-search'});
          // 目前只支持 body
          var appendTarget = select.attr('lay-append-to') || 'body';
          var appendPosition = select.attr('lay-append-position');

          // #1449
          // IE10 和 11 中，带有占位符的 input 元素获得/失去焦点时，会触发 input 事件
          // 当鼠标按下时，根据 input 元素上的 __ieph 标识忽略 input 事件
          var needPlaceholderPatch = !!(lay.ie && (lay.ie === '10' || lay.ie === '11') && input.attr('placeholder'));

          // 展开下拉
          var showDown = function(){
            if(isAppendTo){
              // 如果追加面板元素后出现滚动条，触发元素宽度可能会有变化，所以先追加面板元素
              reElem.appendTo(appendTarget).css({width: title.width() + 'px'});

              var updatePosition = function(){
                lay.position(title[0], reElem[0], {
                  position: appendPosition,
                  allowBottomOut: true,
                  offset: [0, 5]
                });
              };

              updatePosition();
              jquery(window).on('resize.lay_select_resize', updatePosition);
            }
            var top = reElem.offset().top + reElem.outerHeight() + 5 - $win$1.scrollTop();
            var dlHeight = dl.outerHeight();
            var dds = dl.children('dd');

            index = select[0].selectedIndex; // 获取最新的 selectedIndex
            title.parent().addClass(CLASS+'ed');
            dds.removeClass(HIDE$4);
            dts.removeClass(HIDE$4);

            // 初始选中样式
            dds.removeClass(THIS$2);
            index >= 0 && dds.eq(index).addClass(THIS$2);

            // 上下定位识别
            if(top + dlHeight > $win$1.height() && top >= dlHeight){
              reElem.addClass(CLASS + 'up');
            }

            followScroll();

            if(needPlaceholderPatch){
              dl.off('mousedown.lay_select_ieph').on('mousedown.lay_select_ieph', function(){
                input[0].__ieph = true;
                setTimeout(function(){
                  input[0].__ieph = false;
                }, 60);
              });
            }

            removeClickOutsideEvent = lay.onClickOutside(
              isAppendTo ? reElem[0] : dl[0],
              function(){
                hideDown();
                initValue && input.val(initValue);
              },
              {ignore: title, detectIframe: true, capture: false}
            );
          };

          // 隐藏下拉
          var hideDown = function(choose){
            title.parent().removeClass(CLASS+'ed ' + CLASS+'up');
            input.blur();
            isCreatable && dl.children('.' + CREATE_OPTION).remove();
            if(typeof removeClickOutsideEvent === 'function'){
              removeClickOutsideEvent();
              removeClickOutsideEvent = null;
            }
            if(isAppendTo){
              reElem.detach();
              jquery(window).off('resize.lay_select_resize');
            }

            if(choose) return;

            notOption(input.val(), function(none){
              var selectedIndex = select[0].selectedIndex;

              // 未查询到相关值
              if(none){
                initValue = jquery(select[0].options[selectedIndex]).prop('text'); // 重新获得初始选中值

                // 如果是第一项，且文本值等于 placeholder，则清空初始值
                if(selectedIndex === 0 && initValue === input.attr('placeholder')){
                  initValue = '';
                }

                // 如果有选中值，则将输入框纠正为该值。否则清空输入框
                input.val(initValue || '');
              }
            });
          };

          // 定位下拉滚动条
          var followScroll = function(){
            var thisDd = dl.children('dd.'+ THIS$2);

            if(!thisDd[0]) return;

            var posTop = thisDd.position().top;
            var dlHeight = dl.height();
            var ddHeight = thisDd.height();

            // 若选中元素在滚动条不可见底部
            if(posTop > dlHeight){
              dl.scrollTop(posTop + dl.scrollTop() - dlHeight + ddHeight - 5);
            }

            // 若选择元素在滚动条不可见顶部
            if(posTop < 0){
              dl.scrollTop(posTop + dl.scrollTop() - 5);
            }
          };

          // 点击标题区域
          title.on('click', function(e){
            title.parent().hasClass(CLASS+'ed') ? (
              hideDown()
            ) : (
              showDown()
            );
            dl.find('.'+NONE).remove();
          });

          // 点击箭头获取焦点
          title.find('.layui-edge').on('click', function(){
            input.focus();
          });

          // select 中 input 键盘事件
          input.on('keyup', function(e){ // 键盘松开
            var keyCode = e.keyCode;

            // Tab键展开
            if(keyCode === 9){
              showDown();
            }
          }).on('keydown', function(e){ // 键盘按下
            var keyCode = e.keyCode;

            // Tab键隐藏
            if(keyCode === 9){
              hideDown();
            }

            // 标注 dd 的选中状态
            var setThisDd = function(prevNext){
              e.preventDefault();
              var allDisplayedElem = dl.children('dd:not(.'+ HIDE$4 +',.'+ DISABLED$3 +')');
              if(!allDisplayedElem.length) return;
              var firstIndex = 0;
              var lastIndex = allDisplayedElem.length - 1;
              var selectedIndex = -1;

              layui.each(allDisplayedElem, function(index, el){
                if(jquery(el).hasClass(THIS$2)){
                  selectedIndex = index;
                  return true;
                }
              });

              var nextIndex = prevNext === 'prev'
                ? (selectedIndex - 1 < firstIndex ? lastIndex : selectedIndex - 1)
                : (selectedIndex + 1 > lastIndex ? firstIndex : selectedIndex + 1);

              var selectedElem = allDisplayedElem.eq(nextIndex);
              selectedElem.addClass(THIS$2).siblings().removeClass(THIS$2); // 标注样式
              followScroll(); // 定位滚动条
            };

            if(keyCode === 38) setThisDd('prev'); // Up 键
            if(keyCode === 40) setThisDd('next'); // Down 键

            // Enter 键
            if(keyCode === 13){
              e.preventDefault();
              dl.children('dd.'+THIS$2).trigger('click');
            }
          }).on('paste', function(){
            showDown();
          });

          // 检测值是否不属于 select 项
          var notOption = function(value, callback, origin){
            var num = 0;
            var dds = dl.children('dd');
            var hasEquals = false;
            var rawValue = value;
            var fuzzyMatchRE;
            if(!laySearch.caseSensitive){
              value = value.toLowerCase();
            }
            if(laySearch.fuzzy){
              fuzzyMatchRE = fuzzyMatchRegExp(value, laySearch.caseSensitive);
            }
            layui.each(dds, function(){
              var othis = jquery(this);
              var text = othis.text();
              var isCreateOption = isCreatable && othis.hasClass(CREATE_OPTION);

              // 需要区分大小写
              if(isCreatable && !isCreateOption && text === rawValue){
                hasEquals = true;
              }

              // 是否区分大小写
              if(!laySearch.caseSensitive){
                text = text.toLowerCase();
              }

              // 匹配
              var not = laySearch.fuzzy ? !fuzzyMatchRE.test(text) : text.indexOf(value) === -1;

              if(value === '' || (origin === 'blur') ? value !== text : not) num++;
              origin === 'keyup' && othis[(isCreatable ? (not && !isCreateOption) : not) ? 'addClass' : 'removeClass'](HIDE$4);
            });
            // 处理 select 分组元素
            origin === 'keyup' && layui.each(dts, function(){
              var othis = jquery(this);
              var thisDds = othis.nextUntil('dt').filter('dd'); // 当前分组下的dd元素
              if(isCreatable) thisDds = thisDds.not('.' + CREATE_OPTION);
              var allHide = thisDds.length == thisDds.filter('.' + HIDE$4).length; // 当前分组下所有dd元素都隐藏了
              othis[allHide ? 'addClass' : 'removeClass'](HIDE$4);
            });
            var none = num === dds.length;
            return callback(none, hasEquals), none;
          };

          // 搜索匹配
          var search = function(e){
            var value = this.value, keyCode = e.keyCode;

            if(keyCode === 9 || keyCode === 13
              || keyCode === 37 || keyCode === 38
              || keyCode === 39 || keyCode === 40
            ){
              return false;
            }

            if(needPlaceholderPatch && e.target.__ieph){
              e.target.__ieph = false;
              return false;
            }

            notOption(value, function(none, hasEquals){
              if(isCreatable){
                if(hasEquals){
                  dl.children('.' + CREATE_OPTION).remove();
                }else {
                  var createOptionElem = dl.children('.' + CREATE_OPTION);
                  if(createOptionElem[0]){
                    createOptionElem.attr('lay-value', value).text(value);
                  }else {
                    // 临时显示在顶部
                    var ddElem = jquery('<dd>').addClass(CREATE_OPTION).attr('lay-value', value).text(value);
                    var firstOptionELem = dl.children().eq(0);
                    var hasTips = firstOptionELem.hasClass('layui-select-tips');
                    firstOptionELem[hasTips ? 'after' : 'before'](ddElem);
                  }
                }
              }else {
                if(none){
                  dl.find('.'+NONE)[0] || dl.append('<p class="'+ NONE +'">无匹配项</p>');
                } else {
                  dl.find('.'+NONE).remove();
                }
              }
            }, 'keyup');

            // 当搜索值清空时
            if(value === ''){
              // 取消选中项
              select.val('');
              dl.find('.'+ THIS$2).removeClass(THIS$2);
              (select[0].options[0] || {}).value || dl.children('dd:eq(0)').addClass(THIS$2);
              dl.find('.'+ NONE).remove();
              isCreatable && dl.children('.' + CREATE_OPTION).remove();
            }

            followScroll(); // 定位滚动条
          };

          if(isSearch){
            input.on('input propertychange', layui.debounce(search, 50)).on('blur', function(e){
              var selectedIndex = select[0].selectedIndex;

              initValue = jquery(select[0].options[selectedIndex]).prop('text'); // 重新获得初始选中值

              // 如果是第一项，且文本值等于 placeholder，则清空初始值
              if(selectedIndex === 0 && initValue === input.attr('placeholder')){
                initValue = '';
              }

              setTimeout(function(){
                notOption(input.val(), function(none){
                  initValue || input.val(''); // none && !initValue
                }, 'blur');
              }, 200);
            });
          }

          // 选择
          dl.on('click', 'dd', function(){
            var othis = jquery(this), value = othis.attr('lay-value');
            var filter = select.attr('lay-filter'); // 获取过滤器

            if(othis.hasClass(DISABLED$3)) return false;

            // 将新增的 option 元素添加到末尾
            if(isCreatable && othis.hasClass(CREATE_OPTION)){
              var optionElem = jquery('<option>').text(othis.text());
              var displayValue = optionElem.prop('text');
              value = displayValue;
              optionElem.attr('value', displayValue);
              select.append(optionElem);
              othis.removeClass(CREATE_OPTION).attr('lay-value', displayValue).text(displayValue);
              dl.append(othis);
            }

            if(othis.hasClass('layui-select-tips')){
              input.val('');
            } else {
              input.val(othis.text());
              othis.addClass(THIS$2);
            }

            othis.siblings().removeClass(THIS$2);
            select.val(value).removeClass('layui-form-danger');

            layui.event.call(this, MOD_NAME$9, 'select('+ filter +')', {
              elem: select[0]
              ,value: value
              ,othis: reElem
            });

            hideDown(true);
            return false;
          });

          // 用于开启 lay-append-to 时兼容 dropdown
          dl.on('mousedown pointerdown touchstart', function(e){
            layui.stope(e);
          });

          reElem.find('dl>dt').on('click', function(e){
            return false;
          });

          if(isAppendTo){
            titleElem.on('_lay-select-destroy', function(){
              reElem.remove();
            });
          }
        };

        // 仅 appendTo 使用，移除触发元素时，自动移除面板元素
        jquery.event.special['_lay-select-destroy'] = {
          remove: function( handleObj ) {
            handleObj.handler();
          }
        };

        // 初始渲染 select 组件选项
        selects.each(function(index, select) {
          var othis = jquery(this);
          var hasRender = othis.next('.'+CLASS);
          var disabled = this.disabled;
          var value = select.value;
          var selected = jquery(select.options[select.selectedIndex]); // 获取当前选中项
          var optionsFirst = select.options[0];

          // 为忽略渲染的 select 元素保持原生显示状态
          if (othis.closest('[lay-ignore]').length) {
            return othis.show();
          }

          var isSearch = typeof othis.attr('lay-search') === 'string';
          var isCreatable = typeof othis.attr('lay-creatable') === 'string' && isSearch;
          var isAppendTo = typeof othis.attr('lay-append-to') === 'string';
          var placeholder = optionsFirst
            ? (optionsFirst.value ? TIPS : (optionsFirst.text || TIPS))
            : TIPS;

          // 用于替代 select 的外层容器
          var selectWrapper = (function() {
            var elem = jquery('<div class="'+ CLASS +'"></div>');
            if (!isSearch) {
              elem.addClass('layui-unselect');
            }
            if (disabled) {
              elem.addClass('layui-select-disabled');
            }
            return elem;
          })();

          var inputElem = (function() {
            var elem = jquery('<input type="text" class="layui-input">');

            // 设置占位符和默认值
            elem.prop('placeholder', placeholder);
            elem.val(value ? selected.prop('text') : '');

            // 设置未开启搜索或禁用时的输入框只读状态
            if (!isSearch || disabled) {
              elem.prop('readonly', true);
            }

            // 添加禁用状态时的 className
            if (disabled) {
              elem.addClass(DISABLED$3);
            }

            return elem;
          })();

          var titleElem = (function() {
            var elem = jquery('<div class="'+ TITLE +'"></div>');
            elem.append(inputElem);
            elem.append('<i class="layui-edge"></i>');
            return elem;
          })();

          var contentElem = (function() {
            var elem = jquery('<dl class="layui-anim layui-anim-upbit"></dl>');
            if (othis.find('optgroup')[0]) {
              elem.addClass('layui-select-group');
            }
            var content = function() {
              var arr = [];
              layui.each(othis.find('optgroup,option'), function(index, item) {
                var tagName = item.tagName.toLowerCase();
                var dd = jquery('<dd lay-value=""></dd>');
                if (index === 0 && !item.value && tagName !== 'optgroup') {
                  dd.addClass('layui-select-tips');
                  dd.text(item.text || TIPS);
                  arr.push(dd.prop('outerHTML'));
                } else if(tagName === 'optgroup') {
                  var dt = jquery('<dt></dt>');
                  dt.text(item.label);
                  arr.push(dt.prop('outerHTML'));
                } else {
                  dd.attr('lay-value', item.value);
                  if (value === item.value) {
                    dd.addClass(THIS$2);
                  }
                  if (item.disabled) {
                    dd.addClass(DISABLED$3);
                  }
                  dd.text(item.text);
                  arr.push(dd.prop('outerHTML'));
                }
              });
              if (arr.length === 0) {
                arr.push('<dd lay-value="" class="'+ DISABLED$3 +'">None</dd>');
              }
              return arr.join('');
            }();
            elem.html(content);
            return elem;
          })();

          // 如果已经渲染，则 Rerender
          if (hasRender[0]) {
            if (isAppendTo) {
              var panelWrapElem = hasRender.data(PANEL_ELEM_DATA);
              panelWrapElem && panelWrapElem.remove();
            }
            hasRender.remove();
          }
          if (isAppendTo) {
            selectWrapper.append(titleElem);
            othis.after(selectWrapper);
            var contentWrapElem = jquery('<div class="'+ CLASS + ' ' + PANEL_WRAP +'"></div>').append(contentElem);
            selectWrapper.data(PANEL_ELEM_DATA, contentWrapElem); // 将面板元素对象记录在触发元素 data 中，重新渲染时需要清理旧面板元素
            events.call(this, contentWrapElem, titleElem, disabled, isSearch, isCreatable, isAppendTo);
          } else {
            selectWrapper.append(titleElem).append(contentElem);
            othis.after(selectWrapper);
            events.call(this, selectWrapper, titleElem, disabled, isSearch, isCreatable, isAppendTo);
          }
        });
      }

      // 复选框/开关
      ,checkbox: function(elem){
        var CLASS = {
          "checkbox": ['layui-form-checkbox', 'layui-form-checked', 'checkbox'],
          "switch": ['layui-form-switch', 'layui-form-onswitch', 'switch'],
          SUBTRA: 'layui-icon-indeterminate'
        };
        var clickEventName = 'click.lay_checkbox_click';
        var checks = elem || elemForm.find('input[type=checkbox]');
        // 事件
        var events = function(reElem, RE_CLASS){
          var check = jquery(this);
          var skin = check.attr('lay-skin') || 'primary';
          var isSwitch = skin === 'switch';
          var isPrimary = skin === 'primary';

          // 勾选
          // 通过重新赋值触发美化元素样式更新
          check.off(clickEventName).on(clickEventName, function(e){
            var filter = check.attr('lay-filter'); // 获取过滤器

            // 禁用
            if(check[0].disabled) return;

            // 半选
            if (check[0].indeterminate) {
              check[0].indeterminate = false;
            }

            // 开关
            check[0].checked = check[0].checked;

            // 事件
            layui.event.call(check[0], MOD_NAME$9, RE_CLASS[2]+'('+ filter +')', {
              elem: check[0],
              value: check[0].value,
              othis: reElem
            });
          });

          reElem.on('click', function(){
             var hasLabel = check.closest('label').length;
             if(!hasLabel){
              check.trigger('click');
             }
          });

          that.syncAppearanceOnPropChanged(this, 'checked', function(){
            if(isSwitch){
              var title = (reElem.next('*[lay-checkbox]')[0]
                ? reElem.next().html()
                : check.attr('title') || ''
              ).split('|');
              reElem.children('div').html(this.checked ? title[0] : title[1] || title[0]);
            }
            reElem.toggleClass(RE_CLASS[1], this.checked);
          });

          if(isPrimary){
            that.syncAppearanceOnPropChanged(this, 'indeterminate', function(){
              if(this.indeterminate){
                reElem.children('.layui-icon-ok').removeClass('layui-icon-ok').addClass(CLASS.SUBTRA);
              }else {
                reElem.children('.'+ CLASS.SUBTRA).removeClass(CLASS.SUBTRA).addClass('layui-icon-ok');
              }
            });
          }
        };

        // 遍历复选框
        checks.each(function(index, check){
          var othis = jquery(this);
          var skin = othis.attr('lay-skin') || 'primary';
          var title = util.escape(jquery.trim(check.title || function(){ // 向下兼容 lay-text 属性
            return check.title = othis.attr('lay-text') || '';
          }()));
          var disabled = this.disabled;

          // if(!skins[skin]) skin = 'primary'; // 若非内置风格，则强制为默认风格
          var RE_CLASS = CLASS[skin] || CLASS.checkbox;

          // 替代元素
          var hasRender = othis.next('.' + RE_CLASS[0]);
          hasRender[0] && hasRender.remove(); // 若已经渲染，则 Rerender

          // 若存在标题模板，则优先读取标题模板
          var titleTplAttrs = [];
          if(othis.next('[lay-checkbox]')[0]){
            var titleTplElem = othis.next();
            title = titleTplElem.html() || '';
            if(titleTplElem[0].attributes.length > 1){
              layui.each(titleTplElem[0].attributes, function(i, attr){
                if(attr.name !== 'lay-checkbox'){
                  titleTplAttrs.push(attr.name + '="' + attr.value + '"');
                }
              });
            }
          }
          titleTplAttrs = titleTplAttrs.join(' ');

          // 若为开关，则对 title 进行分隔解析
          title = skin === 'switch' ? title.split('|') : [title];

          if (othis.closest('[lay-ignore]').length) return othis.show();

          // 处理 IE8 indeterminate 属性重新定义 get set 后无法设置值的问题
          if(needCheckboxFallback){
            toggleAttribute.call(check, 'lay-form-sync-checked', check.checked);
            !check.checked && toggleAttribute.call(check, 'lay-form-sync-indeterminate', check.indeterminate);
          }

          // 替代元素
          var reElem = jquery(['<div class="layui-unselect '+ RE_CLASS[0],
            (check.checked ? (' '+ RE_CLASS[1]) : ''), // 选中状态
            (disabled ? ' layui-checkbox-disabled '+ DISABLED$3 : ''), // 禁用状态
            '"',
            (' lay-skin="'+ skin +'"' ), // 风格
          '>',
          function(){ // 不同风格的内容
            var type = {
              // 复选框
              "checkbox": [
                (title[0] ? ('<div ' + titleTplAttrs +'>'+ title[0] +'</div>') : (skin === 'primary' ? '' : '<div></div>')),
                '<i class="layui-icon '+(skin === 'primary' && !check.checked && othis.get(0).indeterminate ? CLASS.SUBTRA : 'layui-icon-ok')+'"></i>'
              ].join(''),
              // 开关
              "switch": '<div>'+ ((check.checked ? title[0] : (title[1] || title[0])) || '') +'</div><i></i>'
            };
            return type[skin] || type['checkbox'];
          }(),
          '</div>'].join(''));

          othis.after(reElem);
          events.call(this, reElem, RE_CLASS);
        });
      }

      // 单选框
      ,radio: function(elem){
        var CLASS = 'layui-form-radio';
        var ICON = ['layui-icon-radio', 'layui-icon-circle'];
        var radios = elem || elemForm.find('input[type=radio]');
        var clickEventName = 'click.lay_radio_click';

        // 事件
        var events = function(reElem){
          var radio = jquery(this);
          var ANIM = 'layui-anim-scaleSpring';

          radio.off(clickEventName).on(clickEventName, function(){
            var filter = radio.attr('lay-filter'); // 获取过滤器

            if(radio[0].disabled) return;

            radio[0].checked = true;

            layui.event.call(radio[0], MOD_NAME$9, 'radio('+ filter +')', {
              elem: radio[0],
              value: radio[0].value,
              othis: reElem
            });
          });

          reElem.on('click', function(){
             var hasLabel = radio.closest('label').length;
             if(!hasLabel){
              radio.trigger('click');
             }
          });

          that.syncAppearanceOnPropChanged(this, 'checked', function(){
            var radioEl = this;
            if(radioEl.checked){
              reElem.addClass(CLASS + 'ed');
              reElem.children('.layui-icon').addClass(ANIM + ' ' + ICON[0]);
              var forms = radio.parents(ELEM$2);
              var sameRadios = forms.find('input[name='+ radioEl.name.replace(/(\.|#|\[|\])/g, '\\$1') +']'); // 找到相同name的兄弟
              layui.each(sameRadios, function(){
                if(radioEl === this)return;
                this.checked = false;
              });
            }else {
              reElem.removeClass(CLASS + 'ed');
              reElem.children('.layui-icon').removeClass(ANIM + ' ' + ICON[0]).addClass(ICON[1]);
            }
          });
        };

        // 初始渲染
        radios.each(function(index, radio){
          var othis = jquery(this), hasRender = othis.next('.' + CLASS);
          var disabled = this.disabled;
          var skin = othis.attr('lay-skin');

          if (othis.closest('[lay-ignore]').length) return othis.show();

          if(needCheckboxFallback){
            toggleAttribute.call(radio, 'lay-form-sync-checked', radio.checked);
          }

          hasRender[0] && hasRender.remove(); // 如果已经渲染，则Rerender

          var title = util.escape(radio.title || '');
          var titleTplAttrs = [];
          if(othis.next('[lay-radio]')[0]){
            var titleTplElem = othis.next();
            title = titleTplElem.html() || '';
            if(titleTplElem[0].attributes.length > 1){
              layui.each(titleTplElem[0].attributes, function(i, attr){
                if(attr.name !== 'lay-radio'){
                  titleTplAttrs.push(attr.name + '="' + attr.value + '"');
                }
              });
            }
          }
          titleTplAttrs = titleTplAttrs.join(' ');

          // 替代元素
          var reElem = jquery(['<div class="layui-unselect '+ CLASS,
            (radio.checked ? (' '+ CLASS +'ed') : ''), // 选中状态
          (disabled ? ' layui-radio-disabled '+DISABLED$3 : '') +'"', // 禁用状态
          (skin ? ' lay-skin="'+ skin +'"' : ''),
          '>',
          '<i class="layui-anim layui-icon '+ ICON[radio.checked ? 0 : 1] +'"></i>',
          '<div ' + titleTplAttrs +'>'+ title +'</div>',
          '</div>'].join(''));

          othis.after(reElem);
          events.call(this, reElem);
        });
      }
    };

    // 执行所有渲染项
    var renderItem = function(){
      layui.each(items, function(index, item){
        item();
      });
    };

    // jquery 对象
    if (layui.type(type) === 'object') {
      // 若对象为表单域容器
      if(jquery(type).is(ELEM$2)){
        elemForm = jquery(type);
        renderItem();
      } else { // 对象为表单项
        type.each(function (index, item) {
          var elem = jquery(item);
          if (!elem.closest(ELEM$2).length) {
            return; // 若不在 layui-form 容器中直接跳过
          }
          if (item.tagName === 'SELECT') {
            items['select'](elem);
          } else if (item.tagName === 'INPUT') {
            var itemType = item.type;
            if (itemType === 'checkbox' || itemType === 'radio') {
              items[itemType](elem);
            } else {
              items['input'](elem);
            }
          }
        });
      }
    } else {
      type ? (
        items[type] ? items[type]() : hint$4.error('不支持的 "'+ type + '" 表单渲染')
      ) : renderItem();
    }
    return that;
  };

  /**
   * checkbox 和 radio 指定属性变化时自动更新 UI
   * 只能用于 boolean 属性
   * @param {HTMLInputElement} elem - HTMLInput 元素
   * @param {'checked' | 'indeterminate'} propName - 属性名
   * @param {() => void} handler - 属性值改变时执行的回调
   * @see https://learn.microsoft.com/zh-cn/previous-versions//ff382725(v=vs.85)?redirectedfrom=MSDN
   */
  Form.prototype.syncAppearanceOnPropChanged = function(){
    // 处理 IE8 indeterminate 属性重新定义 get set 后无法设置值的问题
    // 此处性能敏感，不希望每次赋值取值时都判断是否需要 fallback
    if (needCheckboxFallback) {
      return function(elem, propName, handler) {
        var originProps = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, propName);

        Object.defineProperty(elem, propName,
          lay.extend({}, originProps, {
            // 此处的 get 是为了兼容 IE<9
            get: function(){
              return typeof this.getAttribute('lay-form-sync-' + propName) === 'string';
            },
            set: function (newValue) {
              toggleAttribute.call(this, 'lay-form-sync-' + propName, newValue);
              handler.call(this);
            }
          })
        );
      }
    }
    return function(elem, propName, handler){
      var originProps = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, propName);

      Object.defineProperty(elem, propName,
        lay.extend({}, originProps, {
          // 此处的 get 是为了兼容 IE<9
          get: function(){
            return originProps.get.call(this);
          },
          set: function (newValue) {
            originProps.set.call(this, newValue);
            handler.call(this);
          }
        })
      );
    }
  }();

  /**
   * 主动触发验证
   * @param  {(string|HTMLElement|JQuery)} elem - 要验证的区域表单元素
   * @return {boolean} 返回结果。若验证通过，返回 `true`, 否则返回 `false`
   */
  Form.prototype.validate = function(elem) {
    var that = this;
    var intercept; // 拦截标识
    var options = that.config; // 获取全局配置项
    var verify = options.verify; // 验证规则
    var DANGER = 'layui-form-danger'; // 警示样式

    elem = jquery(elem);

    // 节点不存在可视为 true
    if (!elem[0]) return true;

    // 若节点不存在特定属性，则查找容器内有待验证的子节点
    if (elem.attr('lay-verify') === undefined) {
      // 若校验的是一个不带验证规则的容器，校验内部的 lay-verify 节点
      if (that.validate(elem.find('*[lay-verify]')) === false) {
        return false;
      }
    }

    // 开始校验
    layui.each(elem, function(_, item) {
      var othis = jquery(this);
      var verifyStr = othis.attr('lay-verify') || '';
      var vers = verifyStr.split('|');
      var verType = othis.attr('lay-vertype'); // 提示方式
      var value = othis.val();
      value = typeof value === 'string' ? jquery.trim(value) : value;

      othis.removeClass(DANGER); // 移除警示样式

      // 遍历元素绑定的验证规则
      layui.each(vers, function(_, thisVer) {
        var verst; // 校验结果
        var errorText = ''; // 错误提示文本
        var rule = verify[thisVer]; // 获取校验规则

        // 匹配验证规则
        if (rule) {
          verst = typeof rule === 'function'
            ? errorText = rule(value, item)
          : !rule[0].test(value); // 兼容早期数组中的正则写法

          // 是否属于美化替换后的表单元素
          var isForm2Elem = item.tagName.toLowerCase() === 'select' || (
            /^(checkbox|radio)$/.test(item.type)
          );

          errorText = errorText || rule[1];

          // 获取自定义必填项提示文本
          if (thisVer === 'required') {
            errorText = othis.attr('lay-reqtext') || errorText;
          }

          // 若命中校验规则
          if (verst) {
            // 提示层风格
            if (verType === 'tips') {
              layer$1.tips(errorText, function() {
                if (!othis.closest('[lay-ignore]').length) {
                  if(isForm2Elem) {
                    return othis.next();
                  }
                }
                return othis;
              }(), {tips: 1});
            } else if(verType === 'alert') {
              layer$1.alert(errorText, {title: '提示', shadeClose: true});
            }
            // 若返回的为字符或数字，则自动弹出默认提示框；否则由 verify 方法中处理提示
            else if(/\b(string|number)\b/.test(typeof errorText)) {
              layer$1.msg(errorText, {icon: 5, shift: 6});
            }

            setTimeout(function() {
              (isForm2Elem ? othis.next().find('input') : item).focus();
            }, 7);

            othis.addClass(DANGER);
            return intercept = true;
          }
        }
      });

      if (intercept) return intercept;
    });

    return !intercept;
  };

  // 提交表单并校验
  var submit = Form.prototype.submit = function(filter, callback){
    var field = {};  // 字段集合
    var button = jquery(this); // 当前触发的按钮

    // 表单域 lay-filter 属性值
    var layFilter = typeof filter === 'string'
      ? filter
    : button.attr('lay-filter');

    // 当前所在表单域
    var elem = this.getFormElem
      ? this.getFormElem(layFilter)
    : button.parents(ELEM$2).eq(0);

    // 获取需要校验的元素
    var verifyElem = elem.find('*[lay-verify]');

    // 开始校验
    if(!form.validate(verifyElem)) return false;

    // 获取当前表单值
    field = form.getValue(null, elem);

    // 返回的参数
    var params = {
      elem: this.getFormElem ? (window.event && window.event.target) : this // 触发事件的对象
      ,form: this.getFormElem ? elem[0] : button.parents('form')[0] // 当前所在的 form 元素，如果存在的话
      ,field: field // 当前表单数据
    };

    // 回调
    typeof callback === 'function' && callback(params);

    // 事件
    return layui.event.call(this, MOD_NAME$9, 'submit('+ layFilter +')', params);
  };

  function fuzzyMatchRegExp(keyword, caseSensitive) {
    var wordMap = {};
    var regexPattern = ['^'];
    var escapeRegExp = function(str){
      return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };

    if(!caseSensitive)keyword = keyword.toLowerCase();

    // 统计关键字中各字符出现次数
    var wordArr = keyword.trim().split('');
    for (var i = 0; i < wordArr.length; i++) {
      var c = wordArr[i];
      wordMap[c] = (wordMap[c] || 0) + 1;
    }

    // 构建正则表达式模式
    for (c in wordMap) {
      regexPattern.push('(?=.*');
      for (var i = 0; i < wordMap[c]; i++) {
        regexPattern.push(escapeRegExp(c));
        if (i !== wordMap[c] - 1) {
          regexPattern.push('.*'); // 在字符之间添加任意字符匹配
        }
      }
      regexPattern.push(')');
    }
    regexPattern.push('.*');

    return new RegExp(regexPattern.join(''), !caseSensitive ? 'i' : undefined);
  }

  // 引用自 https://github.com/msn0/mdn-polyfills/blob/master/src/Element.prototype.toggleAttribute/toggleattribute.js
  function toggleAttribute(name, force) {
    var forcePassed = arguments.length === 2;
    var forceOn = !!force;
    var forceOff = forcePassed && !force;

    if (this.getAttribute(name) !== null) {
        if (forceOn) return true;

        this.removeAttribute(name);
        return false;
    } else {
        if (forceOff) return false;

        this.setAttribute(name, '');
        return true;
    }
  }

  // 修改自 https://github.com/Tencent/tdesign-common/blob/53786c58752401e648cc45918f2a4dbb9e8cecfa/js/input-number/number.ts#L209
  var specialCode = ['-', '.', 'e', 'E', '+'];
  function canInputNumber(number) {
    if (number === '') return true;
    // 数字最前方不允许出现连续的两个 0
    if (number.slice(0, 2) === '00') return false;
    // 不能出现空格
    if (number.match(/\s/g)) return false;
    // 只能出现一个点（.）
    var tempMatched = number.match(/\./g);
    if (tempMatched && tempMatched.length > 1) return false;
    // 只能出现一个e（e）
    tempMatched = number.match(/e/g);
    if (tempMatched && tempMatched.length > 1) return false;
    // 只能出现一个负号（-）或 一个正号（+），并且在第一个位置；但允许 3e+10 这种形式
    var tempNumber = number.slice(1);
    tempMatched = tempNumber.match(/(\+|-)/g);
    if (tempMatched && (!/e(\+|-)/i.test(tempNumber) || tempMatched.length > 1)) return false;
    // 允许输入数字字符
    var isNumber = !isNaN(Number(number));
    if (!isNumber && !(specialCode.indexOf(number.slice(-1)) !== -1)) return false;
    if (/e/i.test(number) && (!/\de/i.test(number) || /e\./.test(number))) return false;
    return true;
  }

  var form = new Form();
  var $dom = jquery(document);
  var $win$1 = jquery(window);

  // 初始自动完成渲染
  jquery(function(){
    form.render();
  });

  // 表单 reset 重置渲染
  $dom.on('reset', ELEM$2, function(){
    var filter = jquery(this).attr('lay-filter');
    setTimeout(function(){
      form.render(null, filter);
    }, 50);
  });

  // 表单提交事件
  $dom.on('submit', ELEM$2, submit)
  .on('click', '*[lay-submit]', submit);

/**
 * upload
 * 上传组件
 */


  var device$4 = layui.device();

  // 模块名
  var MOD_NAME$8 = 'upload';
  var MOD_INDEX$1 = 'layui_'+ MOD_NAME$8 +'_index'; // 模块索引名

  // 外部接口
  var upload = {
    config: {}, // 全局配置项
    index: layui[MOD_NAME$8] ? (layui[MOD_NAME$8].index + 10000) : 0, // 索引
    // 设置全局项
    set: function(options){
      var that = this;
      that.config = jquery.extend({}, that.config, options);
      return that;
    },
    // 事件
    on: function(events, callback){
      return layui.onevent.call(this, MOD_NAME$8, events, callback);
    }
  };

  // 操作当前实例
  var thisModule$4 = function(){
    var that = this;
    var options = that.config;
    var id = options.id;

    thisModule$4.that[id] = that; // 记录当前实例对象

    return {
      upload: function(files){
        that.upload.call(that, files);
      },
      reload: function(options){
        that.reload.call(that, options);
      },
      config: that.config
    }
  };

  var ELEM_FILE = 'layui-upload-file';
  var ELEM_FORM = 'layui-upload-form';
  var ELEM_IFRAME = 'layui-upload-iframe';
  var ELEM_CHOOSE = 'layui-upload-choose';
  var UPLOADING = 'UPLOADING';

  // 构造器
  var Class$a = function(options){
    var that = this;
    that.index = ++upload.index;
    that.config = jquery.extend({}, that.config, upload.config, options);
    that.render();
  };

  // 默认配置
  Class$a.prototype.config = {
    accept: 'images', // 允许上传的文件类型：images/file/video/audio
    exts: '', // 允许上传的文件后缀名
    auto: true, // 是否选完文件后自动上传
    bindAction: '', // 手动上传触发的元素
    url: '', // 上传地址
    force: '', // 强制规定返回的数据格式，目前只支持是否强制 json
    field: 'file', // 文件字段名
    acceptMime: '', // 筛选出的文件类型，默认为所有文件
    method: 'post', // 请求上传的 http 类型
    data: {}, // 请求上传的额外参数
    drag: true, // 是否允许拖拽上传
    size: 0, // 文件限制大小，默认不限制
    number: 0, // 允许同时上传的文件数，默认不限制
    multiple: false, // 是否允许多文件上传，不支持 ie8-9
    text: { // 自定义提示文本
      "cross-domain": "Cross-domain requests are not supported", // 跨域
      "data-format-error": "Please return JSON data format", // 数据格式错误
      "check-error": "", // 文件格式校验失败
      "error": "", // 上传失败
      "limit-number": null, // 限制 number 属性的提示 --- function
      "limit-size": null // 限制 size 属性的提示 --- function
    }
  };

  // 重载实例
  Class$a.prototype.reload = function(options){
    var that = this;
    that.config = jquery.extend({}, that.config, options);
    that.render(true);
  };

  // 初始渲染
  Class$a.prototype.render = function(rerender){
    var that = this;
    var options = that.config;

    // 若 elem 非唯一
    var elem = jquery(options.elem);
    if (elem.length > 1) {
      layui.each(elem, function() {
        upload.render(jquery.extend({}, options, {
          elem: this
        }));
      });
      return that;
    }

    // 合并 lay-options 属性上的配置信息
    jquery.extend(options, lay.options(elem[0], {
      attr: elem.attr('lay-data') ? 'lay-data' : null // 兼容旧版的 lay-data 属性
    }));

    // 若重复执行 render，则视为 reload 处理
    if (!rerender && elem[0] && elem.data(MOD_INDEX$1)) {
      var newThat = thisModule$4.getThis(elem.data(MOD_INDEX$1));
      if(!newThat) return;

      return newThat.reload(options);
    }

    options.elem = jquery(options.elem);
    options.bindAction = jquery(options.bindAction);

    // 初始化 id 属性 - 优先取 options > 元素 id > 自增索引
    options.id = 'id' in options ? options.id : (
      elem.attr('id') || that.index
    );

    that.file();
    that.events();
  };

  //追加文件域
  Class$a.prototype.file = function(){
    var that = this;
    var options = that.config;
    var elemFile = that.elemFile = jquery([
      '<input class="'+ ELEM_FILE +'" type="file" accept="'+ options.acceptMime +'" name="'+ options.field +'"'
      ,(options.multiple ? ' multiple' : '')
      ,'>'
    ].join(''));
    var next = options.elem.next();

    if(next.hasClass(ELEM_FILE) || next.hasClass(ELEM_FORM)){
      next.remove();
    }

    //包裹ie8/9容器
    if(device$4.ie && device$4.ie < 10){
      options.elem.wrap('<div class="layui-upload-wrap"></div>');
    }

    that.isFile() ? (
      that.elemFile = options.elem,
      options.field = options.elem[0].name
    ) : options.elem.after(elemFile);

    //初始化ie8/9的Form域
    if(device$4.ie && device$4.ie < 10){
      that.initIE();
    }
  };

  //ie8-9初始化
  Class$a.prototype.initIE = function(){
    var that = this;
    var options = that.config;
    var iframe = jquery('<iframe id="'+ ELEM_IFRAME +'" class="'+ ELEM_IFRAME +'" name="'+ ELEM_IFRAME +'" frameborder="0"></iframe>');
    var elemForm = jquery(['<form target="'+ ELEM_IFRAME +'" class="'+ ELEM_FORM +'" method="post" key="set-mine" enctype="multipart/form-data" action="'+ options.url +'">'
    ,'</form>'].join(''));

    //插入iframe
    jquery('#'+ ELEM_IFRAME)[0] || jquery('body').append(iframe);

    //包裹文件域
    if(!options.elem.next().hasClass(ELEM_FORM)){
      that.elemFile.wrap(elemForm);

      //追加额外的参数
      options.elem.next('.'+ ELEM_FORM).append(function(){
        var arr = [];
        layui.each(options.data, function(key, value){
          value = typeof value === 'function' ? value() : value;
          arr.push('<input type="hidden" name="'+ key +'" value="'+ value +'">');
        });
        return arr.join('');
      }());
    }
  };

  //异常提示
  Class$a.prototype.msg = function(content){
    return layer$1.msg(content, {
      icon: 2,
      shift: 6
    });
  };

  //判断绑定元素是否为文件域本身
  Class$a.prototype.isFile = function(){
    var elem = this.config.elem[0];
    if(!elem) return;
    return elem.tagName.toLocaleLowerCase() === 'input' && elem.type === 'file'
  };

  //预读图片信息
  Class$a.prototype.preview = function(callback){
    var that = this;
    if(window.FileReader){
      layui.each(that.chooseFiles, function(index, file){
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(){
          callback && callback(index, file, this.result);
        };
      });
    }
  };

  // 执行上传
  Class$a.prototype.upload = function(files, type){
    var that = this;
    var options = that.config;
    var text = options.text || {};
    var elemFile = that.elemFile[0];

    // 获取文件队列
    var getFiles = function(){
      return files || that.files || that.chooseFiles || elemFile.files;
    };

    // 高级浏览器处理方式，支持跨域
    var ajaxSend = function(){
      var successful = 0;
      var failed = 0;
      var items = getFiles();

      // 多文件全部上传完毕的回调
      var allDone = function(){
        if(options.multiple && successful + failed === that.fileLength){
          typeof options.allDone === 'function' && options.allDone({
            total: that.fileLength,
            successful: successful,
            failed: failed
          });
        }
      };

      // 发送请求
      var request = function(sets){
        var formData = new FormData();

        // 恢复文件状态
        var resetFileState = function(file) {
          if (sets.unified) {
            layui.each(items, function(index, file){
              delete file[UPLOADING];
            });
          } else {
            delete file[UPLOADING];
          }
        };

        // 追加额外的参数
        layui.each(options.data, function(key, value){
          value = typeof value === 'function'
            ? sets.unified ? value() : value(sets.index, sets.file)
            : value;
          formData.append(key, value);
        });

        /*
         * 添加 file 到表单域
         */

        // 是否统一上传
        if (sets.unified) {
          layui.each(items, function(index, file){
            if (file[UPLOADING]) return;
            file[UPLOADING] = true; // 上传中的标记
            formData.append(options.field, file);
          });
        } else { // 逐一上传
          if (sets.file[UPLOADING]) return;
          formData.append(options.field, sets.file);
          sets.file[UPLOADING] = true; // 上传中的标记
        }

        // ajax 参数
        var opts = {
          url: options.url,
          type: 'post', // 统一采用 post 上传
          data: formData,
          dataType: options.dataType || 'json',
          contentType: false,
          processData: false,
          headers: options.headers || {},
          success: function(res){ // 成功回调
            options.unified ? (successful += that.fileLength) : successful++;
            done(sets.index, res);
            allDone(sets.index);
            resetFileState(sets.file);
          },
          error: function(e){ // 异常回调
            options.unified ? (failed += that.fileLength) : failed++;
            that.msg(text['error'] || [
              'Upload failed, please try again.',
              'status: '+ (e.status || '') +' - '+ (e.statusText || 'error')
            ].join('<br>'));
            error(sets.index, e.responseText, e);
            allDone(sets.index);
            resetFileState(sets.file);
          }
        };

        // 进度条
        if(typeof options.progress === 'function'){
          opts.xhr = function(){
            var xhr = jquery.ajaxSettings.xhr();
            // 上传进度
            xhr.upload.addEventListener("progress", function (obj) {
              if(obj.lengthComputable){
                var percent = Math.floor((obj.loaded/obj.total)* 100); // 百分比
                options.progress(percent, (options.item ? options.item[0] : options.elem[0]) , obj, sets.index);
              }
            });
            return xhr;
          };
        }
        jquery.ajax(opts);
      };

      // 多文件是否一起上传
      if(options.unified){
        request({
          unified: true,
          index: 0
        });
      } else {
        layui.each(items, function(index, file){
          request({
            index: index,
            file: file
          });
        });
      }
    };

    // 低版本 IE 处理方式，不支持跨域
    var iframeSend = function(){
      var iframe = jquery('#'+ ELEM_IFRAME);

      that.elemFile.parent().submit();

      // 获取响应信息
      clearInterval(Class$a.timer);
      Class$a.timer = setInterval(function() {
        var res, iframeBody = iframe.contents().find('body');
        try {
          res = iframeBody.text();
        } catch(e) {
          that.msg(text['cross-domain']);
          clearInterval(Class$a.timer);
          error();
        }
        if(res){
          clearInterval(Class$a.timer);
          iframeBody.html('');
          done(0, res);
        }
      }, 30);
    };

    // 强制返回的数据格式
    var forceConvert = function(src) {
      if(options.force === 'json'){
        if(typeof src !== 'object'){
          try {
            return {
              status: "CONVERTED",
              data: JSON.parse(src)
            };
          } catch(e){
            that.msg(text['data-format-error']);
            return {
              status: "FORMAT_ERROR",
              data: {}
            };
          }
        }
      }
      return { status: "DO_NOTHING", data: {} }
    };

    // 统一回调
    var done = function(index, res){
      that.elemFile.next('.'+ ELEM_CHOOSE).remove();
      elemFile.value = '';

      var convert = forceConvert(res);

      switch(convert.status) {
        case "CONVERTED":
          res = convert.data;
          break;
        case "FORMAT_ERROR":
          return;
      }

      typeof options.done === 'function' && options.done(res, index || 0, function(files){
        that.upload(files);
      });
    };

    // 统一网络异常回调
    var error = function(index, res, xhr){
      if(options.auto){
        elemFile.value = '';
      }

      var convert = forceConvert(res);

      switch(convert.status) {
        case "CONVERTED":
          res = convert.data;
          break;
        case "FORMAT_ERROR":
          return;
      }

      typeof options.error === 'function' && options.error(index || 0, function(files){
        that.upload(files);
      }, res, xhr);
    };

    var check;
    var exts = options.exts;
    var value = function(){
      var arr = [];
      layui.each(files || that.chooseFiles, function(i, item){
        arr.push(item.name);
      });
      return arr;
    }();

    // 回调函数返回的参数
    var args = {
      // 预览
      preview: function(callback){
        that.preview(callback);
      },
      // 上传
      upload: function(index, file){
        var thisFile = {};
        thisFile[index] = file;
        that.upload(thisFile);
      },
      // 追加文件到队列
      pushFile: function(){
        that.files = that.files || {};
        layui.each(that.chooseFiles, function(index, item){
          that.files[index] = item;
        });
        return that.files;
      },
      // 重置文件
      resetFile: function(index, file, filename){
        var newFile = new File([file], filename);
        that.files = that.files || {};
        that.files[index] = newFile;
      },
      // 获取本次选取的文件
      getChooseFiles: function(){
        return that.chooseFiles;
      }
    };

    // 提交上传
    var send = function(){
      var ready = function(){
        // IE 兼容处理
        if(device$4.ie){
          return device$4.ie > 9 ? ajaxSend() : iframeSend();
        }
        ajaxSend();
      };
      // 上传前的回调 - 如果回调函数明确返回 false 或 Promise.reject，则停止上传
      if(typeof options.before === 'function'){
        upload.util.promiseLikeResolve(options.before(args))
          .then(function(result){
            if(result !== false){
              ready();
            } else {
              if(options.auto){
                elemFile.value = '';
              }
            }
          }, function(error){
            if(options.auto){
              elemFile.value = '';
            }
            error !== undefined && layui.hint().error(error);
          });
      }else {
        ready();
      }
    };

    // 文件类型名称
    var typeName = ({
      file: '文件',
      images: '图片',
      video: '视频',
      audio: '音频'
    })[options.accept] || '文件';

    // 校验文件格式
    value = value.length === 0
      ? ((elemFile.value.match(/[^\/\\]+\..+/g)||[]) || '')
    : value;

    // 若文件域值为空
    if (value.length === 0) return;

    // 根据文件类型校验
    switch(options.accept){
      case 'file': // 一般文件
        layui.each(value, function(i, item){
          if(exts && !RegExp('.\\.('+ exts +')$', 'i').test(escape(item))){
            return check = true;
          }
        });
      break;
      case 'video': // 视频文件
        layui.each(value, function(i, item){
          if(!RegExp('.\\.('+ (exts || 'avi|mp4|wma|rmvb|rm|flash|3gp|flv') +')$', 'i').test(escape(item))){
            return check = true;
          }
        });
      break;
      case 'audio': // 音频文件
        layui.each(value, function(i, item){
          if(!RegExp('.\\.('+ (exts || 'mp3|wav|mid') +')$', 'i').test(escape(item))){
            return check = true;
          }
        });
      break;
      default: // 图片文件
        layui.each(value, function(i, item){
          if(!RegExp('.\\.('+ (exts || 'jpg|png|gif|bmp|jpeg|svg|webp') +')$', 'i').test(escape(item))){
            return check = true;
          }
        });
      break;
    }

    // 校验失败提示
    if(check){
      that.msg(text['check-error'] || ('选择的'+ typeName +'中包含不支持的格式'));
      return elemFile.value = '';
    }

    // 选择文件的回调
    if(type === 'choose' || options.auto){
      options.choose && options.choose(args);
      if(type === 'choose'){
        return;
      }
    }

    // 检验文件数量
    that.fileLength = function(){
      var length = 0;
      var items = getFiles();
      layui.each(items, function(){
        length++;
      });
      return length;
    }();

    if(options.number && that.fileLength > options.number){
      return that.msg(typeof text['limit-number'] === 'function'
        ? text['limit-number'](options, that.fileLength)
      : (
        '同时最多只能上传: '+ options.number + ' 个文件'
        +'<br>您当前已经选择了: '+ that.fileLength +' 个文件'
      ));
    }

    // 检验文件大小
    if(options.size > 0 && !(device$4.ie && device$4.ie < 10)){
      var limitSize;

      layui.each(getFiles(), function(index, file){
        if(file.size > 1024*options.size){
          var size = options.size/1024;
          size = size >= 1 ? (size.toFixed(2) + 'MB') : options.size + 'KB';
          elemFile.value = '';
          limitSize = size;
        }
      });
      if(limitSize) return that.msg(typeof text['limit-size'] === 'function'
        ? text['limit-size'](options, limitSize)
      : '文件大小不能超过 '+ limitSize);
    }

    send();
  };

  //事件处理
  Class$a.prototype.events = function(){
    var that = this;
    var options = that.config;

    // 设置当前选择的文件队列
    var setChooseFile = function(files){
      that.chooseFiles = {};
      layui.each(files, function(i, item){
        var time = new Date().getTime();
        that.chooseFiles[time + '-' + i] = item;
      });
    };

    // 设置选择的文本
    var setChooseText = function(files, filename){
      var elemFile = that.elemFile;
      options.item ? options.item : options.elem;
      var value = files.length > 1
        ? files.length + '个文件'
      : ((files[0] || {}).name || (elemFile[0].value.match(/[^\/\\]+\..+/g)||[]) || '');

      if(elemFile.next().hasClass(ELEM_CHOOSE)){
        elemFile.next().remove();
      }
      that.upload(null, 'choose');
      if(that.isFile() || options.choose) return;
      elemFile.after('<span class="layui-inline '+ ELEM_CHOOSE +'">'+ value +'</span>');
    };

    /**
     * 判断文件是否加入排队
     * @param {File} file
     * @return {boolean}
     */
    var checkFile = function (file) {
      var result = true;
      layui.each(that.files, function (index, item) {
        result = !(item.name === file.name);
        if(!result) return true;
      });
      return result;
    };

    /**
     * 扩展文件信息
     * @template {File | FileList} T
     * @param {T} obj
     * @return {T}
     */
    var extendInfo = function (obj) {

      var extInfo = function (file) {
        //文件扩展名
        file.ext = file.name.substr(file.name.lastIndexOf('.') + 1).toLowerCase();
        // 文件大小
        file.sizes = upload.util.parseSize(file.size);
        // 可以继续扩展
      };

      //FileList对象
      if (obj instanceof FileList) {
        layui.each(obj, function (index, item) {
          extInfo(item);
        });
      } else {
        extInfo(obj);
      }

      return obj;
    };

    /**
     * 检查获取文件
     * @param {FileList} files
     * @return {Array<File>|FileList}
     */
    var getFiles = function (files) {
      files = files || [];
      if (!files.length) return [];
      if (!that.files) return extendInfo(files);
      var result = [];
      layui.each(files, function (index, item) {
        if (checkFile(item)) {
          result.push(extendInfo(item));
        }
      });
      return result;
    };

    // 点击上传容器
    options.elem.off('upload.start').on('upload.start', function(){
      var othis = jquery(this);

      that.config.item = othis;
      that.elemFile[0].click();
    });

    // 拖拽上传
    if(!(device$4.ie && device$4.ie < 10)){
      options.elem.off('upload.over').on('upload.over', function(){
        var othis = jquery(this);
        othis.attr('lay-over', '');
      })
      .off('upload.leave').on('upload.leave', function(){
        var othis = jquery(this);
        othis.removeAttr('lay-over');
      })
      .off('upload.drop').on('upload.drop', function(e, param){
        var othis = jquery(this);
        var files = getFiles(param.originalEvent.dataTransfer.files);

        othis.removeAttr('lay-over');
        setChooseFile(files);

        options.auto ? that.upload() : setChooseText(files); // 是否自动触发上传
      });
    }

    // 文件选择
    that.elemFile.on('change', function(){
      var files = getFiles(this.files);

      if(files.length === 0) return;

      setChooseFile(files);

      options.auto ? that.upload() : setChooseText(files); // 是否自动触发上传
    });

    // 手动触发上传
    options.bindAction.off('upload.action').on('upload.action', function(){
      that.upload();
    });


    // 防止事件重复绑定
    if(options.elem.data(MOD_INDEX$1)) return;


    // 目标元素 click 事件
    options.elem.on('click', function(){
      if(that.isFile()) return;
      jquery(this).trigger('upload.start');
    });

    // 目标元素 drop 事件
    if(options.drag){
      options.elem.on('dragover', function(e){
        e.preventDefault();
        jquery(this).trigger('upload.over');
      }).on('dragleave', function(e){
        jquery(this).trigger('upload.leave');
      }).on('drop', function(e){
        e.preventDefault();
        jquery(this).trigger('upload.drop', e);
      });
    }

    // 手动上传时触发上传的元素 click 事件
    options.bindAction.on('click', function(){
      jquery(this).trigger('upload.action');
    });

    // 绑定元素索引
    options.elem.data(MOD_INDEX$1, options.id);
  };

  /**
   * 上传组件辅助方法
   */
  upload.util = {
    /**
     * 文件大小处理
     * @param {number | string} size -文件大小
     * @param {number} [precision] - 数值精度
     * @return {string}
     */
    parseSize: function (size, precision) {
      precision = precision || 2;
      if (null == size || !size) {
        return '0';
      }
      var unitArr = ["Bytes", "Kb", "Mb", "Gb", "Tb", "Pb", "Eb", "Zb", "Yb"];
      var index;
      var formatSize = typeof size === 'string' ? parseFloat(size) : size;
      index = Math.floor(Math.log(formatSize) / Math.log(1024));
      size = formatSize / Math.pow(1024, index);
      size = size % 1 === 0 ? size : parseFloat(size.toFixed(precision));//保留的小数位数
      return size + unitArr[index];
    },
    /**
     * 将给定的值转换为一个 JQueryDeferred 对象
     */
    promiseLikeResolve:function(value){
      var deferred = jquery.Deferred();

      if(value && typeof value.then === 'function'){
        value.then(deferred.resolve, deferred.reject);
      }else {
        deferred.resolve(value);
      }
      return deferred.promise();
    }
  };

  // 记录所有实例
  thisModule$4.that = {}; // 记录所有实例对象

  // 获取当前实例对象
  thisModule$4.getThis = function(id){
    var that = thisModule$4.that[id];
    if(!that) hint.error(id ? (MOD_NAME$8 +' instance with ID \''+ id +'\' not found') : 'ID argument required');
    return that;
  };

  // 核心入口
  upload.render = function(options){
    var inst = new Class$a(options);
    return thisModule$4.call(inst);
  };

/**
 * dropdown
 * 下拉菜单组件
 */



  layui.hint();
  var device$3 = layui.device();
  var clickOrMousedown$1 = (device$3.mobile ? 'touchstart' : 'mousedown');

  // 模块名
  var MOD_NAME$7 = 'dropdown';
  var MOD_INDEX = 'layui_'+ MOD_NAME$7 +'_index'; // 模块索引名
  var MOD_INDEX_OPENED = MOD_INDEX + '_opened';
  var MOD_ID$2 = 'lay-' + MOD_NAME$7 + '-id';

  // 外部接口
  var dropdown = {
    config: {
      customName: { // 自定义 data 字段名
        id: 'id',
        title: 'title',
        children: 'child'
      }
    },
    index: layui[MOD_NAME$7] ? (layui[MOD_NAME$7].index + 10000) : 0,

    // 设置全局项
    set: function(options){
      var that = this;
      that.config = jquery.extend({}, that.config, options);
      return that;
    },

    // 事件
    on: function(events, callback){
      return layui.onevent.call(this, MOD_NAME$7, events, callback);
    }
  };

  // 操作当前实例
  var thisModule$3 = function(){
    var that = this;
    var options = that.config;
    var id = options.id;

    return {
      config: options,
      // 重置实例
      reload: function(options){
        that.reload.call(that, options);
      },
      reloadData: function(options){
        dropdown.reloadData(id, options);
      },
      close: function () {
        that.remove();
      },
      open: function () {
        that.render();
      }
    }
  };

  // 字符常量
  var STR_ELEM = 'layui-dropdown';
  var STR_DISABLED = 'layui-disabled';
  var STR_ITEM_UP = 'layui-menu-item-up';
  var STR_ITEM_DOWN = 'layui-menu-item-down';
  var STR_MENU_TITLE = 'layui-menu-body-title';
  var STR_ITEM_GROUP = 'layui-menu-item-group';
  var STR_ITEM_PARENT = 'layui-menu-item-parent';
  var STR_ITEM_DIV = 'layui-menu-item-divider';
  var STR_ITEM_CHECKED = 'layui-menu-item-checked';
  var STR_ITEM_CHECKED2 = 'layui-menu-item-checked2';
  var STR_MENU_PANEL = 'layui-menu-body-panel';
  var STR_MENU_PANEL_L = 'layui-menu-body-panel-left';
  var STR_ELEM_SHADE = 'layui-dropdown-shade';

  var STR_GROUP_TITLE = '.'+ STR_ITEM_GROUP + '>.'+ STR_MENU_TITLE;

  // 构造器
  var Class$9 = function(options){
    var that = this;
    that.index = ++dropdown.index;
    that.config = jquery.extend({}, that.config, dropdown.config, options);
    that.init();
  };

  // 默认配置
  Class$9.prototype.config = {
    trigger: 'click', // 事件类型
    content: '', // 自定义菜单内容
    className: '', // 自定义样式类名
    style: '', // 设置面板 style 属性
    show: false, // 是否初始即显示菜单面板
    isAllowSpread: true, // 是否允许菜单组展开收缩
    isSpreadItem: true, // 是否初始展开子菜单
    data: [], // 菜单数据结构
    delay: [200, 300], // 延时显示或隐藏的毫秒数，若为 number 类型，则表示显示和隐藏的延迟时间相同，trigger 为 hover 时才生效
    shade: 0, // 遮罩
    accordion: false, // 手风琴效果，仅菜单组生效。基础菜单需要在容器上追加 'lay-accordion' 属性。
    closeOnClick: true // 面板打开后，再次点击目标元素时是否关闭面板。行为取决于所使用的触发事件类型
  };

  // 重载实例
  Class$9.prototype.reload = function(options, type){
    var that = this;
    that.config = jquery.extend({}, that.config, options);
    that.init(true, type);
  };

  // 初始化准备
  Class$9.prototype.init = function(rerender, type){
    var that = this;
    var options = that.config;

    // 若 elem 非唯一
    var elem = jquery(options.elem);
    if(elem.length > 1){
      layui.each(elem, function(){
        dropdown.render(jquery.extend({}, options, {
          elem: this
        }));
      });
      return that;
    }

    // 合并 lay-options 属性上的配置信息
    jquery.extend(options, lay.options(elem[0]));

    // 若重复执行 render，则视为 reload 处理
    if(!rerender && elem.attr(MOD_ID$2)){
      var newThat = thisModule$3.getThis(elem.attr(MOD_ID$2));
      if(!newThat) return;
      return newThat.reload(options, type);
    }

    options.elem = jquery(options.elem);
    options.target = jquery('body'); // 后续考虑开放 target 元素

    // 初始化 id 属性 - 优先取 options > 元素 id > 自增索引
    options.id = 'id' in options ? options.id : (
      elem.attr('id') || that.index
    );

    thisModule$3.that[options.id] = that; // 记录当前实例对象
    elem.attr(MOD_ID$2, options.id); // 目标元素已渲染过的标记

    // 初始化自定义字段名
    options.customName = jquery.extend({}, dropdown.config.customName, options.customName);

    // 若传入 hover，则解析为 mouseenter
    if (options.trigger === 'hover') {
      options.trigger = 'mouseenter';
    }

    // 初始即显示或者面板弹出之后执行了刷新数据
    if(options.show || (type === 'reloadData' && that.mainElem && options.target.find(that.mainElem.get(0)).length)) that.render(type);

    // 事件
    that.events();
  };

  // 渲染
  Class$9.prototype.render = function(type) {
    var that = this;
    var options = that.config;
    var customName = options.customName;

    // 默认菜单内容
    var getDefaultView = function(){
      var elemUl = jquery('<ul class="layui-menu layui-dropdown-menu"></ul>');
      if(options.data.length > 0 ){
        eachItemView(elemUl, options.data);
      } else {
        elemUl.html('<li class="layui-menu-item-none">暂无数据</li>');
      }
      return elemUl;
    };

    // 遍历菜单项
    var eachItemView = function(views, data){
      // var views = [];

      layui.each(data, function(index, item){
        // 是否存在子级
        var isChild = item[customName.children] && item[customName.children].length > 0;
        var isSpreadItem = ('isSpreadItem' in item) ? item.isSpreadItem : options.isSpreadItem;
        var title = function(title){
          var templet = item.templet || options.templet;
          if(templet){
            title = typeof templet === 'function'
              ? templet(item)
            : laytpl(templet).render(item);
          }
          return title;
        }(util.escape(item[customName.title]));

        // 初始类型
        var type = function(){
          if(isChild){
            item.type = item.type || 'parent';
          }
          if(item.type){
            return ({
              group: 'group'
              ,parent: 'parent'
              ,'-': '-'
            })[item.type] || 'parent';
          }
          return '';
        }();

        if(type !== '-' && (!item[customName.title] && !item[customName.id] && !isChild)) return;

        //列表元素
        var viewLi = jquery(['<li'+ function(){
          var className = {
            group: 'layui-menu-item-group'+ (
              options.isAllowSpread ? (
                isSpreadItem ? ' layui-menu-item-down' : ' layui-menu-item-up'
              ) : ''
            )
            ,parent: STR_ITEM_PARENT
            ,'-': 'layui-menu-item-divider'
          };
          if(isChild || type){
            return ' class="'+ className[type] +'"';
          }
          return item.disabled ? ' class="'+ STR_DISABLED +'"' : '';
        }() +'>'

          //标题区
          ,function(){
            //是否超文本
            var viewText = ('href' in item) ? (
              '<a href="'+ item.href +'" target="'+ (item.target || '_self') +'">'+ title +'</a>'
            ) : title;

            //是否存在子级
            if(isChild){
              return '<div class="'+ STR_MENU_TITLE +'">'+ viewText + function(){
                if(type === 'parent'){
                  return '<i class="layui-icon layui-icon-right"></i>';
                } else if(type === 'group' && options.isAllowSpread){
                  return '<i class="layui-icon layui-icon-'+ (isSpreadItem ? 'up' : 'down') +'"></i>';
                } else {
                  return '';
                }
              }() +'</div>'

            }
            return '<div class="'+ STR_MENU_TITLE +'">'+ viewText +'</div>';
          }()
        ,'</li>'].join(''));

        viewLi.data('item', item);

        //子级区
        if(isChild){
          var elemPanel = jquery('<div class="layui-panel layui-menu-body-panel"></div>');
          var elemUl = jquery('<ul></ul>');

          if(type === 'parent'){
            elemPanel.append(eachItemView(elemUl, item[customName.children]));
            viewLi.append(elemPanel);
          } else {
            viewLi.append(eachItemView(elemUl, item[customName.children]));
          }
        }

        views.append(viewLi);
      });
      return views;
    };

    // 主模板
    var TPL_MAIN = [
      '<div class="layui-dropdown layui-border-box layui-panel layui-anim layui-anim-downbit" ' + MOD_ID$2 + '="' + options.id + '">',
      '</div>'
    ].join('');

    // 重载或插入面板内容
    var content = options.content || getDefaultView();
    var mainElemExisted = thisModule$3.findMainElem(options.id);
    if (type === 'reloadData' && mainElemExisted.length) { // 是否仅重载数据
      var mainElem = that.mainElem = mainElemExisted;
      mainElemExisted.html(content);
    } else { // 常规渲染
      var mainElem = that.mainElem = jquery(TPL_MAIN);
      mainElem.append(content);

      // 初始化某些属性
      mainElem.addClass(options.className);
      mainElem.attr('style', options.style);

      // 辞旧迎新
      that.remove(dropdown.thisId);
      options.target.append(mainElem);
      options.elem.data(MOD_INDEX_OPENED, true); // 面板已打开的标记

      // 遮罩
      var shade = options.shade ? ('<div class="'+ STR_ELEM_SHADE +'" style="'+ ('z-index:'+ (mainElem.css('z-index')-1) +'; background-color: ' + (options.shade[1] || '#000') + '; opacity: ' + (options.shade[0] || options.shade)) +'"></div>') : '';
      mainElem.before(shade);

      // 如果是鼠标移入事件，则鼠标移出时自动关闭
      if(options.trigger === 'mouseenter'){
        mainElem.on('mouseenter', function(){
          clearTimeout(thisModule$3.timer);
        }).on('mouseleave', function(){
          that.delayRemove();
        });
      }
    }

    that.position(); // 定位坐标
    dropdown.thisId = options.id; // 当前打开的面板 id

    // 阻止全局事件
    mainElem.find('.layui-menu').on(clickOrMousedown$1, function(e){
      layui.stope(e);
    });

    // 触发菜单列表事件
    mainElem.find('.layui-menu li').on('click', function(e){
      var othis = jquery(this);
      var data = othis.data('item') || {};
      var isChild = data[customName.children] && data[customName.children].length > 0;
      var isClickAllScope = options.clickScope === 'all'; // 是否所有父子菜单均触发点击事件

      if(data.disabled) return; // 菜单项禁用状态

      // 普通菜单项点击后的回调及关闭面板
      if((!isChild || isClickAllScope) && data.type !== '-'){
        var ret = typeof options.click === 'function'
          ? options.click(data, othis, e)
        : null;

        ret === false || (isChild || that.remove());
        layui.stope(e);
      }
    });

    // 触发菜单组展开收缩
    mainElem.find(STR_GROUP_TITLE).on('click', function(e){
      var othis = jquery(this);
      var elemGroup = othis.parent();
      var data = elemGroup.data('item') || {};

      if(data.type === 'group' && options.isAllowSpread){
        thisModule$3.spread(elemGroup, options.accordion);
      }
    });

    // 组件打开完毕的事件
    typeof options.ready === 'function' && options.ready(mainElem, options.elem);
  };

  // 位置定位
  Class$9.prototype.position = function(obj){
    var that = this;
    var options = that.config;

    lay.position(options.elem[0], that.mainElem[0], {
      position: options.position,
      e: that.e,
      clickType: options.trigger === 'contextmenu' ? 'right' : null,
      align: options.align || null
    });
  };

  // 移除面板
  Class$9.prototype.remove = function(id) {
    id = id || this.config.id;
    var that = thisModule$3.getThis(id); // 根据 id 查找对应的实例
    if (!that) return;

    var options = that.config;
    var mainElem = thisModule$3.findMainElem(id);

    // 若存在已打开的面板元素，则移除
    if (mainElem[0]) {
      mainElem.prev('.' + STR_ELEM_SHADE).remove(); // 先移除遮罩
      mainElem.remove();
      options.elem.removeData(MOD_INDEX_OPENED);
      delete dropdown.thisId;
      typeof options.close === 'function' && options.close(options.elem);
    }
  };

  Class$9.prototype.normalizedDelay = function(){
    var that = this;
    var options = that.config;
    var delay = [].concat(options.delay);

    return {
      show: delay[0],
      hide: delay[1] !== undefined ? delay[1] : delay[0]
    }
  };

  // 延迟移除面板
  Class$9.prototype.delayRemove = function(){
    var that = this;
    that.config;
    clearTimeout(thisModule$3.timer);

    thisModule$3.timer = setTimeout(function(){
      that.remove();
    }, that.normalizedDelay().hide);
  };

  // 事件
  Class$9.prototype.events = function(){
    var that = this;
    var options = that.config;

    // 是否鼠标移入时触发
    var isMouseEnter = options.trigger === 'mouseenter';
    var trigger = options.trigger + '.lay_dropdown_render';

    // 始终先解除上一个触发元素的事件（如重载时改变 elem 的情况）
    if (that.thisEventElem) that.thisEventElem.off(trigger);
    that.thisEventElem = options.elem;

    // 触发元素事件
    options.elem.off(trigger).on(trigger, function(e) {
      clearTimeout(thisModule$3.timer);
      that.e = e;

      // 主面板是否已打开
      var opened = options.elem.data(MOD_INDEX_OPENED);

      // 若为鼠标移入事件，则延迟触发
      if (isMouseEnter) {
        if (!opened) {
          thisModule$3.timer = setTimeout(function(){
            that.render();
          }, that.normalizedDelay().show);
        }
      } else {
        // 若为 click 事件，则根据主面板状态，自动切换打开与关闭
        if (options.closeOnClick && opened && options.trigger === 'click') {
          that.remove();
        } else {
          that.render();
        }
      }

      e.preventDefault();
    });

    // 如果是鼠标移入事件
    if (isMouseEnter) {
      // 执行鼠标移出事件
      options.elem.on('mouseleave', function(){
        that.delayRemove();
      });
    }
  };

  // 记录所有实例
  thisModule$3.that = {}; // 记录所有实例对象

  // 获取当前实例对象
  thisModule$3.getThis = function(id) {
    if (id === undefined) {
      throw new Error('ID argument required');
    }
    return thisModule$3.that[id];
  };

  // 根据 id 从页面查找组件主面板元素
  thisModule$3.findMainElem = function(id) {
    return jquery('.' + STR_ELEM + '[' + MOD_ID$2 + '="' + id + '"]');
  };

  // 设置菜单组展开和收缩状态
  thisModule$3.spread = function(othis, isAccordion){
    var contentElem = othis.children('ul');
    var needSpread = othis.hasClass(STR_ITEM_UP);
    var ANIM_MS = 200;

    // 动画执行完成后的操作
    var complete = function() {
      jquery(this).css({'display': ''}); // 剔除临时 style，以适配外部样式的状态重置;
    };

    // 动画是否正在执行
    if (contentElem.is(':animated')) return;

    // 展开
    if (needSpread) {
      othis.removeClass(STR_ITEM_UP).addClass(STR_ITEM_DOWN);
      contentElem.hide().stop().slideDown(ANIM_MS, complete);
    } else { // 收缩
      contentElem.stop().slideUp(ANIM_MS, complete);
      othis.removeClass(STR_ITEM_DOWN).addClass(STR_ITEM_UP);
    }

    // 手风琴
    if (needSpread && isAccordion) {
      var groupSibs = othis.siblings('.' + STR_ITEM_DOWN);
      groupSibs.children('ul').stop().slideUp(ANIM_MS, complete);
      groupSibs.removeClass(STR_ITEM_DOWN).addClass(STR_ITEM_UP);
    }
  };

  // 全局事件
  (function(){
    var _WIN = jquery(window);
    var _DOC = jquery(document);

    // 自适应定位
    _WIN.on('resize', function(){
      if(!dropdown.thisId) return;
      var that = thisModule$3.getThis(dropdown.thisId);
      if(!that) return;

      if((that.mainElem && !that.mainElem[0]) || !jquery('.'+ STR_ELEM)[0]){
        return false;
      }

      var options = that.config;

      if(options.trigger === 'contextmenu'){
        that.remove();
      } else {
        that.position();
      }
    });



    // 点击任意处关闭
    lay(_DOC).on(clickOrMousedown$1, function(e){
      if(!dropdown.thisId) return;
      var that = thisModule$3.getThis(dropdown.thisId);
      if(!that) return;

      var options = that.config;
      var isTopElem = lay.isTopElem(options.elem[0]);
      var isCtxMenu = options.trigger === 'contextmenu';

      // 若触发的是绑定的元素，或者属于绑定元素的子元素，则不关闭
      // 满足条件：当前绑定的元素是 body document，或者是鼠标右键事件时，忽略绑定元素
      var isTriggerTarget = !(isTopElem || isCtxMenu) && (options.elem[0] === e.target || options.elem.find(e.target)[0]);
      var isPanelTarget = that.mainElem && (e.target === that.mainElem[0] || that.mainElem.find(e.target)[0]);
      if(isTriggerTarget || isPanelTarget) return;
      // 处理移动端点击穿透问题
      if(e.type === 'touchstart' && options.elem.data(MOD_INDEX_OPENED)){
        jquery(e.target).hasClass(STR_ELEM_SHADE) && e.preventDefault();
      }

      // 点击 dropdown 外部时的回调
      if(typeof options.onClickOutside === 'function'){
        var shouldClose = options.onClickOutside(e);
        if(shouldClose === false) return;
      }

      that.remove();
    }, lay.passiveSupported ? { passive: false} : false);

    // onClickOutside 检测 iframe 
    _WIN.on('blur', function(e){
      if(!dropdown.thisId) return;
      var that = thisModule$3.getThis(dropdown.thisId);
      if(!that) return;
      if(!that.config.elem.data(MOD_INDEX_OPENED)) return;

      setTimeout(function(){
        if(document.activeElement && document.activeElement.tagName === 'IFRAME'
          && that.mainElem && that.mainElem[0]
          && that.mainElem[0].contains && !that.mainElem[0].contains(document.activeElement)
        ){
          // 点击 dropdown 外部时的回调
          if(typeof that.config.onClickOutside === 'function'){
            var shouldClose = that.config.onClickOutside(e.originalEvent);
            if(shouldClose === false) return;
          }
          that.remove();
        }
      }, 0);
    });

    // 基础菜单的静态元素事件
    var ELEM_LI = '.layui-menu:not(.layui-dropdown-menu) li';
    _DOC.on('click', ELEM_LI, function(e){
      var othis = jquery(this);
      var parent = othis.parents('.layui-menu').eq(0);
      var isChild = othis.hasClass(STR_ITEM_GROUP) || othis.hasClass(STR_ITEM_PARENT);
      var filter = parent.attr('lay-filter') || parent.attr('id');
      var options = lay.options(this);

      // 非触发元素
      if(othis.hasClass(STR_ITEM_DIV)) return;

      // 非菜单组
      if(!isChild){
        // 选中
        parent.find('.'+ STR_ITEM_CHECKED).removeClass(STR_ITEM_CHECKED); // 清除选中样式
        parent.find('.'+ STR_ITEM_CHECKED2).removeClass(STR_ITEM_CHECKED2); // 清除父级菜单选中样式
        othis.addClass(STR_ITEM_CHECKED); //添加选中样式
        othis.parents('.'+ STR_ITEM_PARENT).addClass(STR_ITEM_CHECKED2); // 添加父级菜单选中样式

        options.title = options.title || jquery.trim(othis.children('.'+ STR_MENU_TITLE).text());

        // 触发事件
        layui.event.call(this, MOD_NAME$7, 'click('+ filter +')', options);
      }
    });

    // 基础菜单的展开收缩事件
    _DOC.on('click', (ELEM_LI + STR_GROUP_TITLE), function(e){
      var othis = jquery(this);
      var elemGroup = othis.parents('.'+ STR_ITEM_GROUP +':eq(0)');
      var options = lay.options(elemGroup[0]);
      var isAccordion = typeof othis.parents('.layui-menu').eq(0).attr('lay-accordion') === 'string';

      if(('isAllowSpread' in options) ? options.isAllowSpread : true){
        thisModule$3.spread(elemGroup, isAccordion);
      }
    });

    // 判断子级菜单是否超出屏幕
    var ELEM_LI_PAR = '.layui-menu .'+ STR_ITEM_PARENT;
    _DOC.on('mouseenter', ELEM_LI_PAR, function(e){
      var othis = jquery(this);
      var elemPanel = othis.find('.'+ STR_MENU_PANEL);

      if(!elemPanel[0]) return;
      var rect = elemPanel[0].getBoundingClientRect();

      // 是否超出右侧屏幕
      if(rect.right > _WIN.width()){
        elemPanel.addClass(STR_MENU_PANEL_L);
        // 不允许超出左侧屏幕
        rect = elemPanel[0].getBoundingClientRect();
        if(rect.left < 0){
          elemPanel.removeClass(STR_MENU_PANEL_L);
        }
      }

      // 是否超出底部屏幕
      if(rect.bottom > _WIN.height()){
        elemPanel.eq(0).css('margin-top', -(rect.bottom - _WIN.height() + 5));
      }
    }).on('mouseleave', ELEM_LI_PAR, function(e){
      var othis = jquery(this);
      var elemPanel = othis.children('.'+ STR_MENU_PANEL);

      elemPanel.removeClass(STR_MENU_PANEL_L);
      elemPanel.css('margin-top', 0);
    });

  })();

  // 关闭面板
  dropdown.close = function(id){
    var that = thisModule$3.getThis(id);
    if(!that) return this;

    that.remove();
    return thisModule$3.call(that);
  };

  // 打开面板
  dropdown.open = function(id){
    var that = thisModule$3.getThis(id);
    if(!that) return this;

    that.render();
    return thisModule$3.call(that);
  };

  // 重载实例
  dropdown.reload = function(id, options, type){
    var that = thisModule$3.getThis(id);
    if(!that) return this;

    that.reload(options, type);
    return thisModule$3.call(that);
  };

  // 仅重载数据
  dropdown.reloadData = function(){
    var args = jquery.extend([], arguments);
    args[2] = 'reloadData';

    // 重载时，与数据相关的参数
    var dataParams = new RegExp('^('+ [
      'data', 'templet', 'content'
    ].join('|') + ')$');

    // 过滤与数据无关的参数
    layui.each(args[1], function (key, value) {
      if(!dataParams.test(key)){
        delete args[1][key];
      }
    });

    return dropdown.reload.apply(null, args);
  };

  // 核心入口
  dropdown.render = function(options){
    var inst = new Class$9(options);
    return thisModule$3.call(inst);
  };

/**
 * transfer 穿梭框组件
 */


  // 模块名
  var MOD_NAME$6 = 'transfer';

  // 外部接口
  var transfer = {
    config: {},
    index: layui[MOD_NAME$6] ? (layui[MOD_NAME$6].index + 10000) : 0,

    // 设置全局项
    set: function(options) {
      var that = this;
      that.config = jquery.extend({}, that.config, options);
      return that;
    },

    // 事件
    on: function(events, callback) {
      return layui.onevent.call(this, MOD_NAME$6, events, callback);
    }
  };

  // 操作当前实例
  var thisModule$2 = function(){
    var that = this;
    var options = that.config;
    var id = options.id || that.index;

    thisModule$2.that[id] = that; // 记录当前实例对象
    thisModule$2.config[id] = options; // 记录当前实例配置项

    return {
      config: options,
      // 重置实例
      reload: function(options){
        that.reload.call(that, options);
      },
      // 获取右侧数据
      getData: function(){
        return that.getData.call(that);
      }
    }
  };
  var HIDE$3 = 'layui-hide';
  var DISABLED$2 = 'layui-btn-disabled';
  var NONE$1 = 'layui-none';
  var ELEM_BOX$1 = 'layui-transfer-box';
  var ELEM_HEADER$1 = 'layui-transfer-header';
  var ELEM_SEARCH = 'layui-transfer-search';
  var ELEM_ACTIVE = 'layui-transfer-active';
  var ELEM_DATA = 'layui-transfer-data';

  // 穿梭框模板
  var TPL_BOX = function(obj){
    obj = obj || {};
    return ['<div class="layui-transfer-box" data-index="'+ obj.index +'">',
      '<div class="layui-transfer-header">',
        '<input type="checkbox" name="'+ obj.checkAllName +'" lay-filter="layTransferCheckbox" lay-type="all" lay-skin="primary" title="{{= d.data.title['+ obj.index +'] || \'list'+ (obj.index + 1) +'\' }}">',
      '</div>',
      '{{# if(d.data.showSearch){ }}',
      '<div class="layui-transfer-search">',
        '<i class="layui-icon layui-icon-search"></i>',
        '<input type="text" class="layui-input" placeholder="关键词搜索">',
      '</div>',
      '{{# } }}',
      '<ul class="layui-transfer-data"></ul>',
    '</div>'].join('');
  };

  // 主模板
  var TPL_MAIN$1 = ['<div class="layui-transfer layui-form layui-border-box" lay-filter="LAY-transfer-{{= d.index }}">',
    TPL_BOX({
      index: 0,
      checkAllName: 'layTransferLeftCheckAll'
    }),
    '<div class="layui-transfer-active">',
      '<button type="button" class="layui-btn layui-btn-sm layui-btn-primary layui-btn-disabled" data-index="0">',
        '<i class="layui-icon layui-icon-next"></i>',
      '</button>',
      '<button type="button" class="layui-btn layui-btn-sm layui-btn-primary layui-btn-disabled" data-index="1">',
        '<i class="layui-icon layui-icon-prev"></i>',
      '</button>',
    '</div>',
    TPL_BOX({
      index: 1,
      checkAllName: 'layTransferRightCheckAll'
    }),
  '</div>'].join('');

  // 构造器
  var Class$8 = function(options){
    var that = this;
    that.index = ++transfer.index;
    that.config = jquery.extend({}, that.config, transfer.config, options);
    that.render();
  };

  // 默认配置
  Class$8.prototype.config = {
    title: ['列表一', '列表二'],
    width: 200,
    height: 360,
    data: [], // 数据源
    value: [], // 选中的数据
    showSearch: false, // 是否开启搜索
    id: '', // 唯一索引，默认自增 index
    text: {
      none: '无数据',
      searchNone: '无匹配数据'
    }
  };

  // 重载实例
  Class$8.prototype.reload = function(options){
    var that = this;
    that.config = jquery.extend({}, that.config, options);
    that.render();
  };

  // 渲染
  Class$8.prototype.render = function(){
    var that = this;
    var options = that.config;

    // 解析模板
    var thisElem = that.elem = jquery(laytpl(TPL_MAIN$1, {
      open: '{{', // 标签符前缀
      close: '}}', // 标签符后缀
      tagStyle: 'legacy'
    }).render({
      data: options,
      index: that.index // 索引
    }));

    var othis = options.elem = jquery(options.elem);
    if(!othis[0]) return;

    // 初始化属性
    options.data = options.data || [];
    options.value = options.value || [];

    // 初始化 id 属性 - 优先取 options > 元素 id > 自增索引
    options.id = 'id' in options ? options.id : (
      elem.attr('id') || that.index
    );
    that.key = options.id;

    // 插入组件结构
    othis.html(that.elem);

    // 各级容器
    that.layBox = that.elem.find('.'+ ELEM_BOX$1);
    that.layHeader = that.elem.find('.'+ ELEM_HEADER$1);
    that.laySearch = that.elem.find('.'+ ELEM_SEARCH);
    that.layData = thisElem.find('.'+ ELEM_DATA);
    that.layBtn = thisElem.find('.'+ ELEM_ACTIVE + ' .layui-btn');

    // 初始化尺寸
    that.layBox.css({
      width: options.width,
      height: options.height
    });
    that.layData.css({
      height: function(){
        var height = options.height - that.layHeader.outerHeight();
        if(options.showSearch){
          height -= that.laySearch.outerHeight();
        }
        return height - 2;
      }()
    });

    that.renderData(); // 渲染数据
    that.events(); // 事件
  };

  // 渲染数据
  Class$8.prototype.renderData = function(){
    var that = this;
    var options = that.config;

    // 左右穿梭框差异数据
    var arr = [{
      checkName: 'layTransferLeftCheck',
      views: []
    }, {
      checkName: 'layTransferRightCheck',
      views: []
    }];

    // 解析格式
    that.parseData(function(item){
      // 标注为 selected 的为右边的数据
      var _index = item.selected ? 1 : 0;
      var listElem = ['<li>',
        '<input type="checkbox" name="'+ arr[_index].checkName +'" lay-skin="primary" lay-filter="layTransferCheckbox" title="'+ item.title +'"'+ (item.disabled ? ' disabled' : '') + (item.checked ? ' checked' : '') +' value="'+ item.value +'">',
      '</li>'].join('');
      // 按照 options.value 顺序排列右侧数据
      if(_index){
        layui.each(options.value, function(i, v){
          if(v == item.value && item.selected){
            arr[_index].views[i] = listElem;
          }
        });
      } else {
        arr[_index].views.push(listElem);
      }
      delete item.selected;
    });

    that.layData.eq(0).html(arr[0].views.join(''));
    that.layData.eq(1).html(arr[1].views.join(''));

    that.renderCheckBtn();
  };

  // 渲染表单
  Class$8.prototype.renderForm = function(type){
    form.render(type, 'LAY-transfer-'+ this.index);
  };

  // 同步复选框和按钮状态
  Class$8.prototype.renderCheckBtn = function(obj){
    var that = this;
    var options = that.config;

    obj = obj || {};

    that.layBox.each(function(_index){
      var othis = jquery(this);
      var thisDataElem = othis.find('.'+ ELEM_DATA);
      var allElemCheckbox = othis.find('.'+ ELEM_HEADER$1).find('input[type="checkbox"]');
      var listElemCheckbox =  thisDataElem.find('input[type="checkbox"]');

      // 同步复选框和按钮状态
      var nums = 0;
      var haveChecked = false;

      listElemCheckbox.each(function(){
        var isHide = jquery(this).data('hide');
        if(this.checked || this.disabled || isHide){
          nums++;
        }
        if(this.checked && !isHide){
          haveChecked = true;
        }
      });

      allElemCheckbox.prop('checked', haveChecked && nums === listElemCheckbox.length); // 全选复选框状态
      that.layBtn.eq(_index)[haveChecked ? 'removeClass' : 'addClass'](DISABLED$2); // 对应的按钮状态

      // 无数据视图
      if(!obj.stopNone){
        var isNone = thisDataElem.children('li:not(.'+ HIDE$3 +')').length;
        that.noneView(thisDataElem, isNone ? '' : options.text.none);
      }
    });

    that.renderForm('checkbox');
  };

  // 无数据视图
  Class$8.prototype.noneView = function(thisDataElem, text){
    var createNoneElem = jquery('<p class="layui-none">'+ (text || '') +'</p>');
    if(thisDataElem.find('.'+ NONE$1)[0]){
      thisDataElem.find('.'+ NONE$1).remove();
    }
    text.replace(/\s/g, '') && thisDataElem.append(createNoneElem);
  };

  // 同步 value 属性值
  Class$8.prototype.setValue = function(){
    var that = this;
    var options = that.config;
    var arr = [];

    that.layBox.eq(1).find('.'+ ELEM_DATA +' input[type="checkbox"]').each(function(){
      var isHide = jquery(this).data('hide');
      isHide || arr.push(this.value);
    });
    options.value = arr;

    return that;
  };

  // 解析数据
  Class$8.prototype.parseData = function(callback){
    var that = this;
    var options = that.config;
    var newData = [];

    layui.each(options.data, function(index, item){
      // 解析格式
      item = (typeof options.parseData === 'function'
        ? options.parseData(item)
      : item) || item;

      newData.push(item = jquery.extend({}, item));

      layui.each(options.value, function(index2, item2){
        if(item2 == item.value){
          item.selected = true;
        }
      });
      callback && callback(item);
    });

    options.data = newData;
    return that;
  };

  // 获得右侧面板数据
  Class$8.prototype.getData = function(value){
    var that = this;
    var options = that.config;
    var selectedData = [];

    that.setValue();

    layui.each(value || options.value, function(index, item){
      layui.each(options.data, function(index2, item2){
        delete item2.selected;
        if(item == item2.value){
          selectedData.push(item2);
        }      });
    });
    return selectedData;
  };

  // 执行穿梭
  Class$8.prototype.transfer = function (_index, elem) {
    var that = this;
    var options = that.config;
    var thisBoxElem = that.layBox.eq(_index);
    var arr = [];

    if (!elem) {
      // 通过按钮触发找到选中的进行移动
      thisBoxElem.each(function(_index){
        var othis = jquery(this);
        var thisDataElem = othis.find('.'+ ELEM_DATA);

        thisDataElem.children('li').each(function(){
          var thisList = jquery(this);
          var thisElemCheckbox = thisList.find('input[type="checkbox"]');
          var isHide = thisElemCheckbox.data('hide');

          if(thisElemCheckbox[0].checked && !isHide){
            thisElemCheckbox[0].checked = false;
            thisBoxElem.siblings('.'+ ELEM_BOX$1).find('.'+ ELEM_DATA).append(thisList.clone());
            thisList.remove();

            // 记录当前穿梭的数据
            arr.push(thisElemCheckbox[0].value);
          }

          that.setValue();
        });
      });
    } else {
      // 双击单条记录移动
      var thisList = elem;
      var thisElemCheckbox = thisList.find('input[type="checkbox"]');

      thisElemCheckbox[0].checked = false;
      thisBoxElem.siblings('.'+ ELEM_BOX$1).find('.'+ ELEM_DATA).append(thisList.clone());
      thisList.remove();

      // 记录当前穿梭的数据
      arr.push(thisElemCheckbox[0].value);

      that.setValue();
    }

    that.renderCheckBtn();

    // 穿梭时，如果另外一个框正在搜索，则触发匹配
    var siblingInput = thisBoxElem.siblings('.'+ ELEM_BOX$1).find('.'+ ELEM_SEARCH +' input');
    siblingInput.val() === '' ||  siblingInput.trigger('keyup');

    // 穿梭时的回调
    options.onchange && options.onchange(that.getData(arr), _index);
  };

  // 事件
  Class$8.prototype.events = function(){
    var that = this;
    var options = that.config;

    // 左右复选框
    that.elem.on('click', 'input[lay-filter="layTransferCheckbox"]+', function(){
      var thisElemCheckbox = jquery(this).prev();
      var checked = thisElemCheckbox[0].checked;
      var thisDataElem = thisElemCheckbox.parents('.'+ ELEM_BOX$1).eq(0).find('.'+ ELEM_DATA);

      if(thisElemCheckbox[0].disabled) return;

      // 判断是否全选
      if(thisElemCheckbox.attr('lay-type') === 'all'){
        thisDataElem.find('input[type="checkbox"]').each(function(){
          if(this.disabled) return;
          this.checked = checked;
        });
      }

      setTimeout(function () {
        that.renderCheckBtn({stopNone: true});
      }, 0);
    });

    // 双击穿梭
    that.elem.on('dblclick', '.' + ELEM_DATA + '>li', function(event){
      var elemThis = jquery(this);
      var thisElemCheckbox = elemThis.children('input[type="checkbox"]');
      var thisDataElem = elemThis.parent();
      var thisBoxElem = thisDataElem.parent();
      var index = thisBoxElem.data('index');

      if(thisElemCheckbox[0].disabled) return;

      // 根据 dblclick 回调函数返回值决定是否执行穿梭 --- 2.9.3+
      var ret = typeof options.dblclick === 'function' ? options.dblclick({
        elem: elemThis,
        data: that.getData([thisElemCheckbox[0].value])[0],
        index: index
      }) : null;

      if(ret === false) return;

      that.transfer(index, elemThis);
    });

    // 穿梭按钮事件
    that.layBtn.on('click', function(){
      var othis = jquery(this);
      var _index = othis.data('index');

      if(othis.hasClass(DISABLED$2)) return;
      that.transfer(_index);
    });

    // 搜索
    that.laySearch.find('input').on('keyup', function(){
      var value = this.value;
      var thisDataElem = jquery(this).parents('.'+ ELEM_SEARCH).eq(0).siblings('.'+ ELEM_DATA);
      var thisListElem = thisDataElem.children('li');

      thisListElem.each(function(){
        var thisList = jquery(this);
        var thisElemCheckbox = thisList.find('input[type="checkbox"]');
        var title = thisElemCheckbox[0].title;

        // 是否区分大小写
        if(options.showSearch !== 'cs'){
          title = title.toLowerCase();
          value = value.toLowerCase();
        }

        var isMatch = title.indexOf(value) !== -1;

        thisList[isMatch ? 'removeClass': 'addClass'](HIDE$3);
        thisElemCheckbox.data('hide', isMatch ? false : true);
      });

      that.renderCheckBtn();

      // 无匹配数据视图
      var isNone = thisListElem.length === thisDataElem.children('li.'+ HIDE$3).length;
      that.noneView(thisDataElem, isNone ? options.text.searchNone : '');
    });
  };

  // 记录所有实例
  thisModule$2.that = {}; // 记录所有实例对象
  thisModule$2.config = {}; // 记录所有实例配置项

  // 重载实例
  transfer.reload = function(id, options){
    var that = thisModule$2.that[id];
    that.reload(options);

    return thisModule$2.call(that);
  };

  // 获得选中的数据（右侧面板）
  transfer.getData = function(id){
    var that = thisModule$2.that[id];
    return that.getData();
  };

  // 核心入口
  transfer.render = function(options){
    var inst = new Class$8(options);
    return thisModule$2.call(inst);
  };

/**
 * tree 树组件
 */


  // 模块名
  var MOD_NAME$5 = 'tree';

  // 外部接口
  var tree = {
    config: {
      customName: { // 自定义 data 字段名
        id: 'id',
        title: 'title',
        children: 'children'
      }
    },
    index: layui[MOD_NAME$5] ? (layui[MOD_NAME$5].index + 10000) : 0,

    // 设置全局项
    set: function(options){
      var that = this;
      that.config = jquery.extend({}, that.config, options);
      return that;
    },

    // 事件
    on: function(events, callback){
      return layui.onevent.call(this, MOD_NAME$5, events, callback);
    }
  };

  // 操作当前实例
  var thisModule$1 = function(){
    var that = this;
    var options = that.config;
    var id = options.id || that.index;

    thisModule$1.that[id] = that; // 记录当前实例对象
    thisModule$1.config[id] = options; // 记录当前实例配置项

    return {
      config: options,
      // 重置实例
      reload: function(options){
        that.reload.call(that, options);
      },
      getChecked: function(){
        return that.getChecked.call(that);
      },
      setChecked: function(id){// 设置值
        return that.setChecked.call(that, id);
      }
    }
  };
  var HIDE$2 = 'layui-hide';
  var DISABLED$1 = 'layui-disabled';
  var ELEM_SET = 'layui-tree-set';
  var ICON_CLICK = 'layui-tree-iconClick';
  var ICON_ADD = 'layui-icon-addition';
  var ICON_SUB = 'layui-icon-subtraction';
  var ELEM_ENTRY = 'layui-tree-entry';
  var ELEM_MAIN$3 = 'layui-tree-main';
  var ELEM_TEXT = 'layui-tree-txt';
  var ELEM_PACK = 'layui-tree-pack';
  var ELEM_SPREAD = 'layui-tree-spread';
  var ELEM_LINE_SHORT = 'layui-tree-setLineShort';
  var ELEM_SHOW = 'layui-tree-showLine';
  var ELEM_EXTEND = 'layui-tree-lineExtend';

  // 构造器
  var Class$7 = function(options){
    var that = this;
    that.index = ++tree.index;
    that.config = jquery.extend({}, that.config, tree.config, options);
    that.render();
  };

  // 默认配置
  Class$7.prototype.config = {
    data: [],  // 数据

    showCheckbox: false,  // 是否显示复选框
    showLine: true,  // 是否开启连接线
    accordion: false,  // 是否开启手风琴模式
    onlyIconControl: false,  // 是否仅允许节点左侧图标控制展开收缩
    isJump: false,  // 是否允许点击节点时弹出新窗口跳转
    edit: false,  // 是否开启节点的操作图标

    text: {
      defaultNodeName: '未命名', // 节点默认名称
      none: '无数据'  // 数据为空时的文本提示
    }
  };

  // 重载实例
  Class$7.prototype.reload = function(options){
    var that = this;

    layui.each(options, function(key, item){
      if(layui.type(item) === 'array') delete that.config[key];
    });

    that.config = jquery.extend(true, {}, that.config, options);
    that.render();
  };

  // 主体渲染
  Class$7.prototype.render = function(){
    var that = this;
    var options = that.config;

    // 初始化自定义字段名
    options.customName = jquery.extend({}, tree.config.customName, options.customName);

    that.checkids = [];

    var temp = jquery('<div class="layui-tree layui-border-box'+ (options.showCheckbox ? " layui-form" : "") + (options.showLine ? " layui-tree-line" : "") +'" lay-filter="LAY-tree-'+ that.index +'"></div>');
    that.tree(temp);

    var othis = options.elem = jquery(options.elem);
    if(!othis[0]) return;

    // 索引
    that.key = options.id || that.index;

    // 插入组件结构
    that.elem = temp;
    that.elemNone = jquery('<div class="layui-tree-emptyText">'+ options.text.none +'</div>');
    othis.html(that.elem);

    if(that.elem.find('.layui-tree-set').length == 0){
      return that.elem.append(that.elemNone);
    }
    // 复选框渲染
    if(options.showCheckbox){
      that.renderForm('checkbox');
    }
    that.elem.find('.layui-tree-set').each(function(){
      var othis = jquery(this);
      // 最外层
      if(!othis.parent('.layui-tree-pack')[0]){
        othis.addClass('layui-tree-setHide');
      }
      // 没有下一个节点 上一层父级有延伸线
      if(!othis.next()[0] && othis.parents('.layui-tree-pack').eq(1).hasClass('layui-tree-lineExtend')){
        othis.addClass(ELEM_LINE_SHORT);
      }
      // 没有下一个节点 外层最后一个
      if(!othis.next()[0] && !othis.parents('.layui-tree-set').eq(0).next()[0]){
        othis.addClass(ELEM_LINE_SHORT);
      }    });

    that.events();
  };

  // 渲染表单
  Class$7.prototype.renderForm = function(type){
    form.render(type, 'LAY-tree-'+ this.index);
  };

  // 节点解析
  Class$7.prototype.tree = function(elem, children){
    var that = this;
    var options = that.config;
    var customName = options.customName;
    var data = children || options.data;

    // 遍历数据
    layui.each(data, function(index, item){
      var hasChild = item[customName.children] && item[customName.children].length > 0;
      var packDiv = jquery('<div class="layui-tree-pack" '+ (item.spread ? 'style="display: block;"' : '') +'></div>');
      var entryDiv = jquery(['<div data-id="'+ item[customName.id] +'" class="layui-tree-set'+ (item.spread ? " layui-tree-spread" : "") + (item.checked ? " layui-tree-checkedFirst" : "") +'">'
        ,'<div class="layui-tree-entry">'
          ,'<div class="layui-tree-main">'
            // 箭头
            ,function(){
              if(options.showLine){
                if(hasChild){
                  return '<span class="layui-tree-iconClick layui-tree-icon"><i class="layui-icon '+ (item.spread ? "layui-icon-subtraction" : "layui-icon-addition") +'"></i></span>';
                }else {
                  return '<span class="layui-tree-iconClick"><i class="layui-icon layui-icon-file"></i></span>';
                }              }else {
                return '<span class="layui-tree-iconClick"><i class="layui-tree-iconArrow '+ (hasChild ? "": HIDE$2) +'"></i></span>';
              }            }()

            // 复选框
            ,function(){
              return options.showCheckbox ? '<input type="checkbox" name="'+ (item.field || ('layuiTreeCheck_'+ item[customName.id])) +'" same="layuiTreeCheck" lay-skin="primary" '+ (item.disabled ? "disabled" : "") +' value="'+ item[customName.id] +'">' : '';
            }()

            // 节点
            ,function(){
              if(options.isJump && item.href){
                return '<a href="'+ item.href +'" target="_blank" class="'+ ELEM_TEXT +'">'+ (item[customName.title] || item.label || options.text.defaultNodeName) +'</a>';
              }else {
                return '<span class="'+ ELEM_TEXT + (item.disabled ? ' '+ DISABLED$1 : '') +'">'+ (item[customName.title] || item.label || options.text.defaultNodeName) +'</span>';
              }
            }()
      ,'</div>'

      // 节点操作图标
      ,function(){
        if(!options.edit) return '';

        var editIcon = {
          add: '<i class="layui-icon layui-icon-add-1"  data-type="add"></i>'
          ,update: '<i class="layui-icon layui-icon-edit" data-type="update"></i>'
          ,del: '<i class="layui-icon layui-icon-delete" data-type="del"></i>'
        }, arr = ['<div class="layui-btn-group layui-tree-btnGroup">'];

        if(options.edit === true){
          options.edit = ['update', 'del'];
        }

        if(typeof options.edit === 'object'){
          layui.each(options.edit, function(i, val){
            arr.push(editIcon[val] || '');
          });
          return arr.join('') + '</div>';
        }
      }()
      ,'</div></div>'].join(''));

      // 如果有子节点，则递归继续生成树
      if(hasChild){
        entryDiv.append(packDiv);
        that.tree(packDiv, item[customName.children]);
      }
      elem.append(entryDiv);

      // 若有前置节点，前置节点加连接线
      if(entryDiv.prev('.'+ELEM_SET)[0]){
        entryDiv.prev().children('.layui-tree-pack').addClass('layui-tree-showLine');
      }
      // 若无子节点，则父节点加延伸线
      if(!hasChild){
        entryDiv.parent('.layui-tree-pack').addClass('layui-tree-lineExtend');
      }
      // 展开节点操作
      that.spread(entryDiv, item);

      // 选择框
      if(options.showCheckbox){
        item.checked && that.checkids.push(item[customName.id]);
        that.checkClick(entryDiv, item);
      }

      // 操作节点
      options.edit && that.operate(entryDiv, item);

    });
  };

  // 展开节点
  Class$7.prototype.spread = function(elem, item){
    var that = this;
    var options = that.config;
    var entry = elem.children('.'+ELEM_ENTRY);
    var elemMain = entry.children('.'+ ELEM_MAIN$3);
    var elemCheckbox = elemMain.find('input[same="layuiTreeCheck"]');
    var elemIcon = entry.find('.'+ ICON_CLICK);
    var elemText = entry.find('.'+ ELEM_TEXT);
    var touchOpen = options.onlyIconControl ? elemIcon : elemMain; // 判断展开通过节点还是箭头图标
    var state = '';

    // 展开收缩
    touchOpen.on('click', function(e){
      var packCont = elem.children('.'+ELEM_PACK)
      ,iconClick = touchOpen.children('.layui-icon')[0] ? touchOpen.children('.layui-icon') : touchOpen.find('.layui-tree-icon').children('.layui-icon');

      // 若没有子节点
      if(!packCont[0]){
        state = 'normal';
      }else {
        if(elem.hasClass(ELEM_SPREAD)){
          elem.removeClass(ELEM_SPREAD);
          packCont.slideUp(200);
          iconClick.removeClass(ICON_SUB).addClass(ICON_ADD);
          that.updateFieldValue(item, 'spread', false);
        }else {
          elem.addClass(ELEM_SPREAD);
          packCont.slideDown(200);
          iconClick.addClass(ICON_SUB).removeClass(ICON_ADD);
          that.updateFieldValue(item, 'spread', true);

          // 是否手风琴
          if(options.accordion){
            var sibls = elem.siblings('.'+ELEM_SET);
            sibls.removeClass(ELEM_SPREAD);
            sibls.children('.'+ELEM_PACK).slideUp(200);
            sibls.find('.layui-tree-icon').children('.layui-icon').removeClass(ICON_SUB).addClass(ICON_ADD);
          }        }      }    });

    // 点击回调
    elemText.on('click', function(){
      var othis = jquery(this);

      // 判断是否禁用状态
      if(othis.hasClass(DISABLED$1)) return;

      // 判断展开收缩状态
      if(elem.hasClass(ELEM_SPREAD)){
        state = options.onlyIconControl ? 'open' : 'close';
      } else {
        state = options.onlyIconControl ? 'close' : 'open';
      }

      // 获取选中状态
      if(elemCheckbox[0]){
        that.updateFieldValue(item, 'checked', elemCheckbox.prop('checked'));
      }

      // 点击产生的回调
      options.click && options.click({
        elem: elem,
        state: state,
        data: item
      });
    });
  };

  // 更新数据源 checked,spread 字段值
  Class$7.prototype.updateFieldValue = function(obj, field, value){
    if(field in obj) obj[field] = value;
  };

  // 计算复选框选中状态
  Class$7.prototype.setCheckbox = function(elem, item, elemCheckbox){
    var that = this;
    var options = that.config;
    var customName = options.customName;
    var checked = elemCheckbox.prop('checked');

    if(elemCheckbox.prop('disabled')) return;

    // 同步子节点选中状态
    if(typeof item[customName.children] === 'object' || elem.find('.'+ELEM_PACK)[0]){
      var elemCheckboxs = elem.find('.'+ ELEM_PACK).find('input[same="layuiTreeCheck"]');
      elemCheckboxs.each(function(index){
        if(this.disabled) return; // 不可点击则跳过
        var children = item[customName.children][index];
        if(children) that.updateFieldValue(children, 'checked', checked);
        that.updateFieldValue(this, 'checked', checked);
      });
    }
    // 同步父节点选中状态
    var setParentsChecked = function(thisNodeElem){
      // 若无父节点，则终止递归
      if(!thisNodeElem.parents('.'+ ELEM_SET)[0]) return;

      var state;
      var parentPack = thisNodeElem.parent('.'+ ELEM_PACK);
      var parentNodeElem = parentPack.parent();
      var parentCheckbox =  parentPack.prev().find('input[same="layuiTreeCheck"]');

      // 如果子节点有任意一条选中，则父节点为选中状态
      if(checked){
        parentCheckbox.prop('checked', checked);
      } else { // 如果当前节点取消选中，则根据计算“兄弟和子孙”节点选中状态，来同步父节点选中状态
        parentPack.find('input[same="layuiTreeCheck"]').each(function(){
          if(this.checked){
            state = true;
          }
        });

        // 如果兄弟子孙节点全部未选中，则父节点也应为非选中状态
        state || parentCheckbox.prop('checked', false);
      }

      // 向父节点递归
      setParentsChecked(parentNodeElem);
    };

    setParentsChecked(elem);

    that.renderForm('checkbox');
  };

  // 复选框选择
  Class$7.prototype.checkClick = function(elem, item){
    var that = this;
    var options = that.config;
    var entry = elem.children('.'+ ELEM_ENTRY);
    var elemMain = entry.children('.'+ ELEM_MAIN$3);



    // 点击复选框
    elemMain.on('click', 'input[same="layuiTreeCheck"]+', function(e){
      layui.stope(e); // 阻止点击节点事件

      var elemCheckbox = jquery(this).prev();
      var checked = elemCheckbox.prop('checked');

      if(elemCheckbox.prop('disabled')) return;

      that.setCheckbox(elem, item, elemCheckbox);
      that.updateFieldValue(item, 'checked', checked);

      // 复选框点击产生的回调
      options.oncheck && options.oncheck({
        elem: elem,
        checked: checked,
        data: item
      });
    });
  };

  // 节点操作
  Class$7.prototype.operate = function(elem, item){
    var that = this;
    var options = that.config;
    var customName = options.customName;
    var entry = elem.children('.'+ ELEM_ENTRY);
    var elemMain = entry.children('.'+ ELEM_MAIN$3);

    entry.children('.layui-tree-btnGroup').on('click', '.layui-icon', function(e){
      layui.stope(e);  // 阻止节点操作

      var type = jquery(this).data("type");
      var packCont = elem.children('.'+ELEM_PACK);
      var returnObj = {
        data: item,
        type: type,
        elem:elem
      };
      // 增加
      if(type == 'add'){
        // 若节点本身无子节点
        if(!packCont[0]){
          // 若开启连接线，更改图标样式
          if(options.showLine){
            elemMain.find('.'+ICON_CLICK).addClass('layui-tree-icon');
            elemMain.find('.'+ICON_CLICK).children('.layui-icon').addClass(ICON_ADD).removeClass('layui-icon-file');
          // 若未开启连接线，显示箭头
          } else {
            elemMain.find('.layui-tree-iconArrow').removeClass(HIDE$2);
          }          // 节点添加子节点容器
          elem.append('<div class="layui-tree-pack"></div>');
        }
        // 新增节点
        var key = options.operate && options.operate(returnObj);
        var obj = {};

        obj[customName.title] = options.text.defaultNodeName;
        obj[customName.id] = key;
        that.tree(elem.children('.'+ELEM_PACK), [obj]);

        // 放在新增后面，因为要对元素进行操作
        if(options.showLine){
          // 节点本身无子节点
          if(!packCont[0]){
            // 遍历兄弟节点，判断兄弟节点是否有子节点
            var siblings = elem.siblings('.'+ELEM_SET);
            var num = 1;
            var parentPack = elem.parent('.'+ELEM_PACK);

            layui.each(siblings, function(index, i){
              if(!jquery(i).children('.'+ELEM_PACK)[0]){
                num = 0;
              }            });

            // 若兄弟节点都有子节点
            if(num == 1){
              // 兄弟节点添加连接线
              siblings.children('.'+ELEM_PACK).addClass(ELEM_SHOW);
              siblings.children('.'+ELEM_PACK).children('.'+ELEM_SET).removeClass(ELEM_LINE_SHORT);
              elem.children('.'+ELEM_PACK).addClass(ELEM_SHOW);
              // 父级移除延伸线
              parentPack.removeClass(ELEM_EXTEND);
              // 同层节点最后一个更改线的状态
              parentPack.children('.'+ELEM_SET).last().children('.'+ELEM_PACK).children('.'+ELEM_SET).last().addClass(ELEM_LINE_SHORT);
            } else {
              elem.children('.'+ELEM_PACK).children('.'+ELEM_SET).addClass(ELEM_LINE_SHORT);
            }          } else {
            // 添加延伸线
            if(!packCont.hasClass(ELEM_EXTEND)){
              packCont.addClass(ELEM_EXTEND);
            }            // 子节点添加延伸线
            elem.find('.'+ELEM_PACK).each(function(){
              jquery(this).children('.'+ELEM_SET).last().addClass(ELEM_LINE_SHORT);
            });
            // 如果前一个节点有延伸线
            if(packCont.children('.'+ELEM_SET).last().prev().hasClass(ELEM_LINE_SHORT)){
              packCont.children('.'+ELEM_SET).last().prev().removeClass(ELEM_LINE_SHORT);
            }else {
              // 若之前的没有，说明处于连接状态
              packCont.children('.'+ELEM_SET).last().removeClass(ELEM_LINE_SHORT);
            }            // 若是最外层，要始终保持相连的状态
            if(!elem.parent('.'+ELEM_PACK)[0] && elem.next()[0]){
              packCont.children('.'+ELEM_SET).last().removeClass(ELEM_LINE_SHORT);
            }          }        }        if(!options.showCheckbox) return;
        // 若开启复选框，同步新增节点状态
        if(elemMain.find('input[same="layuiTreeCheck"]')[0].checked){
          var packLast = elem.children('.'+ELEM_PACK).children('.'+ELEM_SET).last();
          packLast.find('input[same="layuiTreeCheck"]')[0].checked = true;
        }        that.renderForm('checkbox');

      // 修改
      } else if(type == 'update') {
        var text = elemMain.children('.'+ ELEM_TEXT).html();
        elemMain.children('.'+ ELEM_TEXT).html('');
        // 添加输入框，覆盖在文字上方
        elemMain.append('<input type="text" class="layui-tree-editInput">');
        // 获取焦点
        elemMain.children('.layui-tree-editInput').val(util.unescape(text)).focus();
        // 嵌入文字移除输入框
        var getVal = function(input){
          var textNew = util.escape(input.val().trim());
          textNew = textNew ? textNew : options.text.defaultNodeName;
          input.remove();
          elemMain.children('.'+ ELEM_TEXT).html(textNew);

          // 同步数据
          returnObj.data[customName.title] = textNew;

          // 节点修改的回调
          options.operate && options.operate(returnObj);
        };
        // 失去焦点
        elemMain.children('.layui-tree-editInput').blur(function(){
          getVal(jquery(this));
        });
        // 回车
        elemMain.children('.layui-tree-editInput').on('keydown', function(e){
          if(e.keyCode === 13){
            e.preventDefault();
            getVal(jquery(this));
          }        });

      // 删除
      } else {
        layer.confirm('确认删除该节点 "<span style="color: #999;">'+ (item[customName.title] || '') +'</span>" 吗？', function(index){
          options.operate && options.operate(returnObj); // 节点删除的回调
          returnObj.status = 'remove'; // 标注节点删除

          layer.close(index);

          // 若删除最后一个，显示空数据提示
          if(!elem.prev('.'+ELEM_SET)[0] && !elem.next('.'+ELEM_SET)[0] && !elem.parent('.'+ELEM_PACK)[0]){
            elem.remove();
            that.elem.append(that.elemNone);
            return;
          }          // 若有兄弟节点
          if(elem.siblings('.'+ELEM_SET).children('.'+ELEM_ENTRY)[0]){
            // 若开启复选框
            if(options.showCheckbox){
              // 若开启复选框，进行下步操作
              var elemDel = function(elem){
                // 若无父结点，则不执行
                if(!elem.parents('.'+ELEM_SET)[0]) return;
                var siblingTree = elem.siblings('.'+ELEM_SET).children('.'+ELEM_ENTRY);
                var parentTree = elem.parent('.'+ELEM_PACK).prev();
                var checkState = parentTree.find('input[same="layuiTreeCheck"]')[0];
                var state = 1;
                var num = 0;

                // 若父节点未勾选
                if(checkState.checked == false){
                  // 遍历兄弟节点
                  siblingTree.each(function(i, item1){
                    var input = jquery(item1).find('input[same="layuiTreeCheck"]')[0];
                    if(input.checked == false && !input.disabled){
                      state = 0;
                    }                    // 判断是否全为不可勾选框
                    if(!input.disabled){
                      num = 1;
                    }                  });
                  // 若有可勾选选择框并且已勾选
                  if(state == 1 && num == 1){
                    // 勾选父节点
                    checkState.checked = true;
                    that.renderForm('checkbox');
                    // 向上遍历祖先节点
                    elemDel(parentTree.parent('.'+ELEM_SET));
                  }                }              };
              elemDel(elem);
            }            // 若开启连接线
            if(options.showLine){
              // 遍历兄弟节点，判断兄弟节点是否有子节点
              var siblings = elem.siblings('.'+ELEM_SET);
              var num = 1;
              var parentPack = elem.parent('.'+ELEM_PACK);

              layui.each(siblings, function(index, i){
                if(!jquery(i).children('.'+ELEM_PACK)[0]){
                  num = 0;
                }              });
              // 若兄弟节点都有子节点
              if(num == 1){
                // 若节点本身无子节点
                if(!packCont[0]){
                  // 父级去除延伸线，因为此时子节点里没有空节点
                  parentPack.removeClass(ELEM_EXTEND);
                  siblings.children('.'+ELEM_PACK).addClass(ELEM_SHOW);
                  siblings.children('.'+ELEM_PACK).children('.'+ELEM_SET).removeClass(ELEM_LINE_SHORT);
                }                // 若为最后一个节点
                if(!elem.next()[0]){
                  elem.prev().children('.'+ELEM_PACK).children('.'+ELEM_SET).last().addClass(ELEM_LINE_SHORT);
                }else {
                  parentPack.children('.'+ELEM_SET).last().children('.'+ELEM_PACK).children('.'+ELEM_SET).last().addClass(ELEM_LINE_SHORT);
                }                // 若为最外层最后一个节点，去除前一个结点的连接线
                if(!elem.next()[0] && !elem.parents('.'+ELEM_SET)[1] && !elem.parents('.'+ELEM_SET).eq(0).next()[0]){
                  elem.prev('.'+ELEM_SET).addClass(ELEM_LINE_SHORT);
                }              }else {
                // 若为最后一个节点且有延伸线
                if(!elem.next()[0] && elem.hasClass(ELEM_LINE_SHORT)){
                  elem.prev().addClass(ELEM_LINE_SHORT);
                }              }            }
          } else {
            // 若无兄弟节点
            var prevDiv = elem.parent('.'+ELEM_PACK).prev();
            // 若开启了连接线
            if(options.showLine){
              prevDiv.find('.'+ICON_CLICK).removeClass('layui-tree-icon');
              prevDiv.find('.'+ICON_CLICK).children('.layui-icon').removeClass(ICON_SUB).addClass('layui-icon-file');
              // 父节点所在层添加延伸线
              var pare = prevDiv.parents('.'+ELEM_PACK).eq(0);
              pare.addClass(ELEM_EXTEND);

              // 兄弟节点最后子节点添加延伸线
              pare.children('.'+ELEM_SET).each(function(){
                jquery(this).children('.'+ELEM_PACK).children('.'+ELEM_SET).last().addClass(ELEM_LINE_SHORT);
              });
            }else {
            // 父节点隐藏箭头
              prevDiv.find('.layui-tree-iconArrow').addClass(HIDE$2);
            }            // 移除展开属性
            elem.parents('.'+ELEM_SET).eq(0).removeClass(ELEM_SPREAD);
            // 移除节点容器
            elem.parent('.'+ELEM_PACK).remove();
          }
          elem.remove();
        });

      }    });
  };

  // 部分事件
  Class$7.prototype.events = function(){
    var that = this;
    var options = that.config;
    that.elem.find('.layui-tree-checkedFirst');

    // 初始选中
    that.setChecked(that.checkids);

    // 搜索
    that.elem.find('.layui-tree-search').on('keyup', function(){
      var input = jquery(this);
      var val = input.val();
      var pack = input.nextAll();
      var arr = [];

      // 遍历所有的值
      pack.find('.'+ ELEM_TEXT).each(function(){
        var entry = jquery(this).parents('.'+ELEM_ENTRY);
        // 若值匹配，加一个类以作标识
        if(jquery(this).html().indexOf(val) != -1){
          arr.push(jquery(this).parent());

          var select = function(div){
            div.addClass('layui-tree-searchShow');
            // 向上父节点渲染
            if(div.parent('.'+ELEM_PACK)[0]){
              select(div.parent('.'+ELEM_PACK).parent('.'+ELEM_SET));
            }          };
          select(entry.parent('.'+ELEM_SET));
        }      });

      // 根据标志剔除
      pack.find('.'+ELEM_ENTRY).each(function(){
        var parent = jquery(this).parent('.'+ELEM_SET);
        if(!parent.hasClass('layui-tree-searchShow')){
          parent.addClass(HIDE$2);
        }      });
      if(pack.find('.layui-tree-searchShow').length == 0){
        that.elem.append(that.elemNone);
      }
      // 节点过滤的回调
      options.onsearch && options.onsearch({
        elem: arr
      });
    });

    // 还原搜索初始状态
    that.elem.find('.layui-tree-search').on('keydown', function(){
      jquery(this).nextAll().find('.'+ELEM_ENTRY).each(function(){
        var parent = jquery(this).parent('.'+ELEM_SET);
        parent.removeClass('layui-tree-searchShow '+ HIDE$2);
      });
      if(jquery('.layui-tree-emptyText')[0]) jquery('.layui-tree-emptyText').remove();
    });
  };

  // 得到选中节点
  Class$7.prototype.getChecked = function(){
    var that = this;
    var options = that.config;
    var customName = options.customName;
    var checkId = [];
    var checkData = [];

    // 遍历节点找到选中索引
    that.elem.find('.layui-form-checked').each(function(){
      checkId.push(jquery(this).prev()[0].value);
    });

    // 遍历节点
    var eachNodes = function(data, checkNode){
      layui.each(data, function(index, item){
        layui.each(checkId, function(index2, item2){
          if(item[customName.id] == item2){
            that.updateFieldValue(item, 'checked', true);

            var cloneItem = jquery.extend({}, item);
            delete cloneItem[customName.children];

            checkNode.push(cloneItem);

            if(item[customName.children]){
              cloneItem[customName.children] = [];
              eachNodes(item[customName.children], cloneItem[customName.children]);
            }
            return true
          }
        });
      });
    };

    eachNodes(jquery.extend({}, options.data), checkData);

    return checkData;
  };

  // 设置选中节点
  Class$7.prototype.setChecked = function(checkedId){
    var that = this;
    that.config;

    // 初始选中
    that.elem.find('.'+ELEM_SET).each(function(i, item){
      var thisId = jquery(this).data('id');
      var input = jquery(item).children('.'+ELEM_ENTRY).find('input[same="layuiTreeCheck"]');
      var reInput = input.next();

      // 若返回数字
      if(typeof checkedId === 'number'){
        if(thisId.toString() == checkedId.toString()){
          if(!input[0].checked){
            reInput.click();
          }          return false;
        }      }
      // 若返回数组
      else if(typeof checkedId === 'object'){
        layui.each(checkedId, function(index, value){
          if(value.toString() == thisId.toString() && !input[0].checked){
            reInput.click();
            return true;
          }
        });
      }    });
  };

  // 记录所有实例
  thisModule$1.that = {}; // 记录所有实例对象
  thisModule$1.config = {}; // 记录所有实例配置项

  // 重载实例
  tree.reload = function(id, options){
    var that = thisModule$1.that[id];
    that.reload(options);

    return thisModule$1.call(that);
  };

  // 获得选中的节点数据
  tree.getChecked = function(id){
    var that = thisModule$1.that[id];
    return that.getChecked();
  };

  // 设置选中节点
  tree.setChecked = function(id, checkedId){
    var that = thisModule$1.that[id];
    return that.setChecked(checkedId);
  };

  // 核心入口
  tree.render = function(options){
    var inst = new Class$7(options);
    return thisModule$1.call(inst);
  };

/**
 * layui.table
 * 表格组件
 */


  var hint$3 = layui.hint();
  var device$2 = layui.device();

  // api
  var table = {
    config: { // 全局配置项
      checkName: 'LAY_CHECKED', // 是否选中状态的特定字段名
      indexName: 'LAY_INDEX', // 下标索引
      initIndexName: 'LAY_INDEX_INIT', // 初始下标索引名，仅用于内部恢复当前页表格排序
      numbersName: 'LAY_NUM', // 序号
      disabledName: 'LAY_DISABLED' // 禁用状态的特定字段名
    },
    cache: {}, // 数据缓存
    index: layui.table ? (layui.table.index + 10000) : 0,

    // 设置全局项
    set: function(options){
      var that = this;
      that.config = jquery.extend({}, that.config, options);
      return that;
    },

    // 事件
    on: function(events, callback){
      return layui.onevent.call(this, MOD_NAME$4, events, callback);
    }
  };

  // 操作当前实例
  var thisTable = function(){
    var that = this;
    var options = that.config;
    var id = options.id || options.index;

    return {
      config: options,
      reload: function(options, deep){
        that.reload.call(that, options, deep);
      },
      reloadData: function(options, deep){
        table.reloadData(id, options, deep);
      },
      setColsWidth: function(){
        that.setColsWidth.call(that);
      },
      resize: function(){ // 重置表格尺寸/结构
        that.resize.call(that);
      }
    }
  };

  // 获取当前实例
  var getThisTable$1 = function(id){
    var that = thisTable.that[id];
    if(!that) hint$3.error(id ? ('The table instance with ID \''+ id +'\' not found') : 'ID argument required');
    return that || null;
  };

  // 获取当前实例配置项
  var getThisTableConfig = function(id){
    var config = thisTable.config[id];
    if(!config) hint$3.error(id ? ('The table instance with ID \''+ id +'\' not found') : 'ID argument required');
    return config || null;
  };

  // lay 函数可以处理 Selector，HTMLElement，JQuery 类型
  // 无效的 CSS 选择器字符串，会抛出 SyntaxError 异常，此时直接返回 laytpl 模板字符串
  var resolveTplStr = function(templet){
    try{
      return lay(templet).html();
    }catch(err){
      return templet;
    }
  };

  // 解析自定义模板数据
  var parseTempData = function(obj){
    obj = obj || {};

    var options = this.config || {};
    var item3 = obj.item3; // 表头数据
    var content = obj.content; // 原始内容
    if (item3.type === 'numbers') content = obj.tplData[table.config.numbersName];

    // 是否编码 HTML
    var escaped = 'escape' in item3 ? item3.escape : options.escape;
    if(escaped) content = util.escape(content);

    // 获取模板
    var templet = obj.text && item3.exportTemplet || (item3.templet || item3.toolbar);

    // 获取模板内容
    if(templet){
      content = typeof templet === 'function'
        ? templet.call(item3, obj.tplData, obj.obj)
        : laytpl(resolveTplStr(templet) || String(content)).render(jquery.extend({
            LAY_COL: item3
          }, obj.tplData));
    }

    // 是否只返回文本
    return obj.text ? jquery('<div>'+ content +'</div>').text() : content;
  };

  // 字符
  var MOD_NAME$4 = 'table';
  var MOD_ID$1 = 'lay-' + MOD_NAME$4 + '-id';
  var ELEM$1 = '.layui-table';
  var HIDE$1 = 'layui-hide';
  var HIDE_V = 'layui-hide-v';
  var NONE = 'layui-none';

  var ELEM_VIEW$2 = 'layui-table-view';
  var ELEM_TOOL = '.layui-table-tool';
  var ELEM_BOX = '.layui-table-box';
  var ELEM_INIT = '.layui-table-init';
  var ELEM_HEADER = '.layui-table-header';
  var ELEM_BODY$1 = '.layui-table-body';
  var ELEM_MAIN$2 = '.layui-table-main';
  var ELEM_FIXED = '.layui-table-fixed';
  var ELEM_FIXL$1 = '.layui-table-fixed-l';
  var ELEM_FIXR$1 = '.layui-table-fixed-r';
  var ELEM_TOTAL = '.layui-table-total';
  var ELEM_PAGE = '.layui-table-page';
  var ELEM_PAGE_VIEW = '.layui-table-pageview';
  var ELEM_SORT = '.layui-table-sort';
  var ELEM_CHECKED$1 = 'layui-table-checked';
  var ELEM_EDIT = 'layui-table-edit';
  var ELEM_HOVER$1 = 'layui-table-hover';
  var ELEM_GROUP = 'laytable-cell-group';
  var ELEM_COL_SPECIAL = 'layui-table-col-special';
  var ELEM_TOOL_PANEL = 'layui-table-tool-panel';
  var ELEM_EXPAND = 'layui-table-expanded';
  var DISABLED_TRANSITION = 'layui-table-disabled-transition';

  var DATA_MOVE_NAME = 'LAY_TABLE_MOVE_DICT';

  // thead 区域模板
  var TPL_HEADER = function(options){
    var rowCols = '{{#var colspan = layui.type(item2.colspan2) === \'number\' ? item2.colspan2 : item2.colspan; if(colspan){}} colspan="{{=colspan}}"{{#} if(item2.rowspan){}} rowspan="{{=item2.rowspan}}"{{#}}}';

    options = options || {};
    return ['<table cellspacing="0" cellpadding="0" border="0" class="layui-table" '
      ,'{{# if(d.data.skin){ }}lay-skin="{{=d.data.skin}}"{{# } }} {{# if(d.data.size){ }}lay-size="{{=d.data.size}}"{{# } }} {{# if(d.data.even){ }}lay-even{{# } }}>'
      ,'<thead>'
      ,'{{# layui.each(d.data.cols, function(i1, item1){ }}'
        ,'<tr>'
        ,'{{# layui.each(item1, function(i2, item2){ }}'
          ,'{{# if(item2.fixed && item2.fixed !== "right"){ left = true; } }}'
          ,'{{# if(item2.fixed === "right"){ right = true; } }}'
          ,function(){
            if(options.fixed && options.fixed !== 'right'){
              return '{{# if(item2.fixed && item2.fixed !== "right"){ }}';
            }
            if(options.fixed === 'right'){
              return '{{# if(item2.fixed === "right"){ }}';
            }
            return '';
          }()
          ,'{{# var isSort = !(item2.colGroup) && item2.sort; }}'
          ,'<th data-field="{{= item2.field||i2 }}" data-key="{{=d.index}}-{{=i1}}-{{=i2}}" {{# if( item2.parentKey){ }}data-parentkey="{{= item2.parentKey }}"{{# } }} {{# if(item2.minWidth){ }}data-minwidth="{{=item2.minWidth}}"{{# } }} {{# if(item2.maxWidth){ }}data-maxwidth="{{=item2.maxWidth}}"{{# } }} {{# if(item2.style){ }}style="{{=item2.style}}"{{# } }} '+ rowCols +' {{# if(item2.unresize || item2.colGroup){ }}data-unresize="true"{{# } }} class="{{# if(item2.hide){ }}layui-hide{{# } }}{{# if(isSort){ }} layui-unselect{{# } }}{{# if(!item2.field){ }} layui-table-col-special{{# } }}"{{# if(item2.title){ }} title="{{ layui.$(\'<div>\' + item2.title + \'</div>\').text() }}"{{# } }}>'
            ,'<div class="layui-table-cell laytable-cell-'
              ,'{{# if(item2.colGroup){ }}'
                ,'group'
              ,'{{# } else { }}'
                ,'{{=d.index}}-{{=i1}}-{{=i2}}'
                ,'{{# if(item2.type !== "normal"){ }}'
                  ,' laytable-cell-{{= item2.type }}'
                ,'{{# } }}'
              ,'{{# } }}'
            ,'" {{#if(item2.align){}}align="{{=item2.align}}"{{#}}}>'
              ,'{{# if(item2.type === "checkbox"){ }}' //复选框
                ,'<input type="checkbox" name="layTableCheckbox" lay-skin="primary" lay-filter="layTableAllChoose" {{# if(item2[d.data.checkName]){ }}checked{{# }; }}>'
              ,'{{# } else { }}'
                ,'<span>{{-item2.title||""}}</span>'
                ,'{{# if(isSort){ }}'
                  ,'<span class="layui-table-sort layui-inline"><i class="layui-edge layui-table-sort-asc" title="升序"></i><i class="layui-edge layui-table-sort-desc" title="降序"></i></span>'
                ,'{{# } }}'
              ,'{{# } }}'
            ,'</div>'
          ,'</th>'
          ,(options.fixed ? '{{# }; }}' : '')
        ,'{{# }); }}'
        ,'</tr>'
      ,'{{# }); }}'
      ,'</thead>'
    ,'</table>'].join('');
  };

  // tbody 区域模板
  var TPL_BODY = ['<table cellspacing="0" cellpadding="0" border="0" class="layui-table" '
    ,'{{# if(d.data.skin){ }}lay-skin="{{=d.data.skin}}"{{# } }} {{# if(d.data.size){ }}lay-size="{{=d.data.size}}"{{# } }} {{# if(d.data.even){ }}lay-even{{# } }}>'
    ,'<tbody></tbody>'
  ,'</table>'].join('');

  // 主模板
  var TPL_MAIN = [
    ,'{{# if(d.data.toolbar){ }}'
    ,'<div class="layui-table-tool">'
      ,'<div class="layui-table-tool-temp"></div>'
      ,'<div class="layui-table-tool-self"></div>'
    ,'</div>'
    ,'{{# } }}'

    ,'<div class="layui-table-box">'
      ,'{{# if(d.data.loading){ }}'
      ,'<div class="layui-table-init">'
        ,'<div class="layui-table-loading-icon">'
        ,'{{# if(typeof d.data.loading === "string"){ }}'
          ,'{{- d.data.loading}}'
        ,'{{# } else{ }}'
          ,'<i class="layui-icon layui-icon-loading layui-anim layui-anim-rotate layui-anim-loop"></i>'
        ,'{{# } }}'
        ,'</div>'
      ,'</div>'
      ,'{{# } }}'

      ,'{{# var left, right; }}'
      ,'<div class="layui-table-header">'
        ,TPL_HEADER()
      ,'</div>'
      ,'<div class="layui-table-body layui-table-main">'
        ,TPL_BODY
      ,'</div>'

      ,'{{# if(left){ }}'
      ,'<div class="layui-table-fixed layui-table-fixed-l">'
        ,'<div class="layui-table-header">'
          ,TPL_HEADER({fixed: true})
        ,'</div>'
        ,'<div class="layui-table-body">'
          ,TPL_BODY
        ,'</div>'
      ,'</div>'
      ,'{{# }; }}'

      ,'{{# if(right){ }}'
      ,'<div class="layui-table-fixed layui-table-fixed-r layui-hide">'
        ,'<div class="layui-table-header">'
          ,TPL_HEADER({fixed: 'right'})
          ,'<div class="layui-table-mend"></div>'
        ,'</div>'
        ,'<div class="layui-table-body">'
          ,TPL_BODY
        ,'</div>'
      ,'</div>'
      ,'{{# }; }}'
    ,'</div>'

    ,'{{# if(d.data.totalRow){ }}'
      ,'<div class="layui-table-total">'
        ,'<table cellspacing="0" cellpadding="0" border="0" class="layui-table" '
        ,'{{# if(d.data.skin){ }}lay-skin="{{=d.data.skin}}"{{# } }} {{# if(d.data.size){ }}lay-size="{{=d.data.size}}"{{# } }} {{# if(d.data.even){ }}lay-even{{# } }}>'
          ,'<tbody><tr><td><div class="layui-table-cell" style="visibility: hidden;">Total</div></td></tr></tbody>'
      , '</table>'
      ,'</div>'
    ,'{{# } }}'

    ,'<div class="layui-table-column layui-table-page layui-hide">'
      ,'<div class="layui-inline layui-table-pageview" id="layui-table-page{{=d.index}}"></div>'
    ,'</div>'
  ].join('');

  var _WIN = jquery(window);
  var _DOC = jquery(document);

  // constructor
  var Class$6 = function(options){
    var that = this;
    that.index = ++table.index;
    that.config = jquery.extend({}, that.config, table.config, options);
    that.render();
  };

  // 初始默认配置
  Class$6.prototype.config = {
    limit: 10, // 每页显示的数量
    loading: true, // 请求数据时，是否显示 loading
    escape: true, // 是否开启 HTML 编码功能，即转义 html 原文
    cellMinWidth: 60, // 所有单元格默认最小宽度
    cellMaxWidth: Number.MAX_VALUE, // 所有单元格默认最大宽度
    editTrigger: 'click', // 单元格编辑的事件触发方式
    defaultToolbar: ['filter', 'exports', 'print'], // 工具栏右侧图标
    defaultContextmenu: true, // 显示默认上下文菜单
    autoSort: true, // 是否前端自动排序。如果否，则需自主排序（通常为服务端处理好排序）
    text: {
      none: '无数据'
    },
    cols: []
  };

  // 表格渲染
  Class$6.prototype.render = function(type){
    var that = this;
    var options = that.config;

    options.elem = jquery(options.elem);
    options.where = options.where || {};

    // 初始化 id 属性 - 优先取 options > 元素 id > 自增索引
    var id = options.id = 'id' in options ? options.id : (
      options.elem.attr('id') || that.index
    );

    thisTable.that[id] = that; // 记录当前实例对象
    thisTable.config[id] = options; // 记录当前实例配置项

    //请求参数的自定义格式
    options.request = jquery.extend({
      pageName: 'page',
      limitName: 'limit'
    }, options.request);

    // 响应数据的自定义格式
    options.response = jquery.extend({
      statusName: 'code', //规定数据状态的字段名称
      statusCode: 0, //规定成功的状态码
      msgName: 'msg', //规定状态信息的字段名称
      dataName: 'data', //规定数据总数的字段名称
      totalRowName: 'totalRow', //规定数据统计的字段名称
      countName: 'count'
    }, options.response);

    //如果 page 传入 laypage 对象
    if(options.page !== null && typeof options.page === 'object'){
      options.limit = options.page.limit || options.limit;
      options.limits = options.page.limits || options.limits;
      that.page = options.page.curr = options.page.curr || 1;
      delete options.page.elem;
      delete options.page.jump;
    }

    if(!options.elem[0]) return that;

    // 若元素未设 lay-filter 属性，则取实例 id 值
    if(!options.elem.attr('lay-filter')){
      options.elem.attr('lay-filter', options.id);
    }

    // 仅重载数据
    if(type === 'reloadData'){
       // 请求数据
      return that.pullData(that.page, {
        type: 'reloadData'
      });
    }

    // 初始化索引
    options.index = that.index;
    that.key = options.id || options.index;

    // 初始化一些其他参数
    that.setInit();

    // 高度铺满：full-差距值
    if(options.height && /^full-.+$/.test(options.height)){
      that.fullHeightGap = options.height.split('-')[1];
      options.height = _WIN.height() - (parseFloat(that.fullHeightGap) || 0);
    } else if (options.height && /^#\w+\S*-.+$/.test(options.height)) {
      var parentDiv = options.height.split("-");
      that.parentHeightGap = parentDiv.pop();
      that.parentDiv = parentDiv.join("-");
      options.height = jquery(that.parentDiv).height() - (parseFloat(that.parentHeightGap) || 0);
    } else if (typeof options.height === "function"){
      that.customHeightFunc = options.height;
      options.height = that.customHeightFunc();
    }

    // 开始插入替代元素
    var othis = options.elem;
    var hasRender = othis.next('.' + ELEM_VIEW$2);

    // 主容器
    var reElem = that.elem = jquery('<div></div>');

    // 添加 className
    reElem.addClass(function(){
      var arr = [
        ELEM_VIEW$2,
        ELEM_VIEW$2 +'-'+ that.index,
        'layui-form',
        'layui-border-box'
      ];
      if(options.className) arr.push(options.className);
      return arr.join(' ');
    }()).attr(function(){
      var obj = {
        'lay-filter': 'LAY-TABLE-FORM-DF-'+ that.index,
        'style': function(){
          var arr = [];
          if(options.width) arr.push('width:'+ options.width + 'px;');
          // if(options.height) arr.push('height:'+ options.height + 'px;');
          return arr.join('')
        }()
      };
      obj[MOD_ID$1] = options.id;
      return obj;
    }()).html(laytpl(TPL_MAIN, {
      open: '{{', // 标签符前缀
      close: '}}', // 标签符后缀
      tagStyle: 'legacy'
    }).render({
      data: options,
      index: that.index //索引
    }));

    // 初始化样式
    that.renderStyle();

    // 生成替代元素
    hasRender[0] && hasRender.remove(); // 如果已经渲染，则 Rerender
    othis.after(reElem);

    // 各级容器
    that.layTool = reElem.find(ELEM_TOOL);
    that.layBox = reElem.find(ELEM_BOX);
    that.layHeader = reElem.find(ELEM_HEADER);
    that.layMain = reElem.find(ELEM_MAIN$2);
    that.layBody = reElem.find(ELEM_BODY$1);
    that.layFixed = reElem.find(ELEM_FIXED);
    that.layFixLeft = reElem.find(ELEM_FIXL$1);
    that.layFixRight = reElem.find(ELEM_FIXR$1);
    that.layTotal = reElem.find(ELEM_TOTAL);
    that.layPage = reElem.find(ELEM_PAGE);

    // 初始化头部工具栏
    that.renderToolbar();

    // 初始化底部分页栏
    that.renderPagebar();

    // 让表格平铺
    that.fullSize();
    that.setColsWidth({isInit: true});

    that.pullData(that.page); // 请求数据
    that.events(); // 事件
  };

  // 根据列类型，定制化参数
  Class$6.prototype.initOpts = function(item){
    var that = this;
    that.config;
    var initWidth = {
      checkbox: 50,
      radio: 50,
      space: 30,
      numbers: 60
    };

    // 让 type 参数兼容旧版本
    if(item.checkbox) item.type = "checkbox";
    if(item.space) item.type = "space";
    if(!item.type) item.type = "normal";

    if(item.type !== "normal"){
      item.unresize = true;
      item.width = item.width || initWidth[item.type];
    }
  };

  //初始化一些参数
  Class$6.prototype.setInit = function(type){
    var that = this;
    var options = that.config;

    options.clientWidth = options.width || function(){ //获取容器宽度
      //如果父元素宽度为0（一般为隐藏元素），则继续查找上层元素，直到找到真实宽度为止
      var getWidth = function(parent){
        var width;
        var isNone;
        parent = parent || options.elem.parent();

        width = that.getContentWidth(parent);

        try {
          isNone = parent.css('display') === 'none';
        } catch(e){}
        var parentElem = parent.parent();
        if(parent[0] && parentElem && parentElem[0] && (!width || isNone)) return getWidth(parentElem);
        return width;
      };
      return getWidth();
    }();

    if(type === 'width') return options.clientWidth;
    // 初始化高度配置，如果设置了最高高度，以最高高度形式为准
    options.height = options.maxHeight || options.height;

    // 初始化 css 参数
    if(options.css && options.css.indexOf(ELEM_VIEW$2) === -1){
      var css = options.css.split('}');
      layui.each(css, function(index, value){
        if(value){
          css[index] = '.'+ ELEM_VIEW$2 + '-'+ that.index + ' ' + value;
        }
      });
      options.css = css.join('}');
    }

    // 封装对 col 的配置处理
    var initChildCols = function (i1, item1, i2, item2) {
      //如果列参数为空，则移除
      if (!item2) {
        item1.splice(i2, 1);
        return;
      }

      item2.key = [options.index, i1, i2].join('-');
      item2.colspan = item2.colspan || 0;
      item2.rowspan = item2.rowspan || 0;

      //根据列类型，定制化参数
      that.initOpts(item2);

      //设置列的父列索引
      //如果是组合列，则捕获对应的子列
      var indexChild = i1 + (parseInt(item2.rowspan) || 1);
      if (indexChild < options.cols.length) { // 只要不是最后一层都会有子列
        item2.colGroup = true;
        var childIndex = 0;
        layui.each(options.cols[indexChild], function (i22, item22) {
          //如果子列已经被标注为{HAS_PARENT}，或者子列累计 colspan 数等于父列定义的 colspan，则跳出当前子列循环
          if (item22.HAS_PARENT || (childIndex >= 1 && childIndex == (item2.colspan || 1))) return;

          item22.HAS_PARENT = true;
          item22.parentKey = [options.index, i1, i2].join('-'); // i1 + '-' + i2;
          childIndex = childIndex + parseInt(item22.colspan > 1 ? item22.colspan : 1);
          initChildCols(indexChild, options.cols[indexChild], i22, item22);
        });
      } else {
        item2.colGroup = false;
      }
      item2.hide = item2.hide && !item2.colGroup || false; // 初始化中中间节点的hide信息不做处理，否则会出错，如果需要必须将其子节点也都同步成hide
    };

    // 初始化列参数
    layui.each(options.cols, function(i1, item1){
      layui.each(item1, function(i2, item2){
        if (i1) {
          delete item2.HAS_PARENT; // 去掉临时的计数排除标识，避免有新字段插入的时候重新计算被跳过导致下标出错的问题
        } else {
          initChildCols(i1, item1, i2, item2); // 只解析顶层节点由递归完成解析
        }
      });
    });

  };

  // 初始化样式
  Class$6.prototype.renderStyle = function() {
    var that = this;
    var options = that.config;
    var index = that.index;
    var text = [];

    // 单元格宽度
    layui.each(options.cols, function(i1, item1) {
      layui.each(item1, function(i2, item2) {
        var key = [index, i1, i2].join('-');
        var val = ['width: ', (item2.width || options.cellMinWidth), 'px'].join('');
        text.push('.laytable-cell-'+ key +'{'+ val +'}');
      });
    });

    // 自定义行样式
    (function (lineStyle) {
      if (!lineStyle) return;
      var trClassName = '.layui-table-view-'+ index +' .layui-table-body .layui-table tr';
      var rules = lineStyle.split(';');
      var cellMaxHeight = 'none';

      // 计算单元格最大高度
      layui.each(rules, function(i, rule) {
        rule = rule.split(':');
        if (rule[0] === 'height') {
          var val = parseFloat(rule[1]);
          if (!isNaN(val)) cellMaxHeight = (val - 1) + 'px';
          return true;
        }
      });

      // 多行相关样式
      layui.each([
        '{'+ lineStyle +'}',
        '.layui-table-cell{height: auto; max-height: '+ cellMaxHeight +'; white-space: normal; text-overflow: clip;}',
        '> td:hover > .layui-table-cell{overflow: auto;}'
      ].concat(
        device$2.ie ? [
          '.layui-table-edit{height: '+ cellMaxHeight +';}',
          'td[data-edit]:hover:after{height: '+ cellMaxHeight +';}'
        ] : []
      ), function(i, val) {
        val && text.push(trClassName + ' ' + val);
      });
    })(options.lineStyle);

    // 自定义 css 属性
    if (options.css) text.push(options.css);

    // 生成 style
    lay.style({
      target: that.elem[0],
      text: text.join(''),
      id: 'DF-table-'+ index
    });
  };

  // 初始头部工具栏
  Class$6.prototype.renderToolbar = function(){
    var that = this;
    var options = that.config;
    var filter = options.elem.attr('lay-filter');

    // 添加工具栏左侧模板
    var leftDefaultTemp = [
      '<div class="layui-inline" lay-event="add"><i class="layui-icon layui-icon-add-1"></i></div>',
      '<div class="layui-inline" lay-event="update"><i class="layui-icon layui-icon-edit"></i></div>',
      '<div class="layui-inline" lay-event="delete"><i class="layui-icon layui-icon-delete"></i></div>'
    ].join('');
    var elemToolTemp = that.layTool.find('.layui-table-tool-temp');

    if(options.toolbar === 'default'){
      elemToolTemp.html(leftDefaultTemp);
    } else if(typeof options.toolbar === 'string'){
      var toolbarHtml = jquery(options.toolbar).html() || '';
      toolbarHtml && elemToolTemp.html(
        laytpl(toolbarHtml).render(options)
      );
    }

    // 头部工具栏右上角默认工具
    var defaultConfig = {
      filter: {
        title: '筛选列',
        layEvent: 'LAYTABLE_COLS',
        icon: 'layui-icon-cols',
        onClick: function(obj) {
          var options = obj.config;
          var openPanel = obj.openPanel;

          openPanel({
            list: function(){
              var lis = [];
              that.eachCols(function(i, item){
                if(item.field && item.type == 'normal'){
                  lis.push('<li><input type="checkbox" name="'+ item.field +'" data-key="'+ item.key +'" data-parentkey="'+ (item.parentKey||'') +'" lay-skin="primary" '+ (item.hide ? '' : 'checked') +' title="'+ util.escape(jquery('<div>' + (item.fieldTitle || item.title || item.field) + '</div>').text()) +'" lay-filter="LAY_TABLE_TOOL_COLS"></li>');
                }
              });
              return lis.join('');
            }(),
            done: function() {
              form.on('checkbox(LAY_TABLE_TOOL_COLS)', function(obj){
                var othis = jquery(obj.elem);
                var checked = this.checked;
                var key = othis.data('key');
                var col = that.col(key);
                var hide = col.hide;
                var parentKey = othis.data('parentkey');

                if(!col.key) return;

                // 同步勾选列的 hide 值和隐藏样式
                col.hide = !checked;
                that.elem.find('*[data-key="'+ key +'"]')[
                  checked ? 'removeClass' : 'addClass'
                ](HIDE$1);

                // 根据列的显示隐藏，同步多级表头的父级相关属性值
                if(hide != col.hide){
                  that.setParentCol(!checked, parentKey);
                }

                // 重新适配尺寸
                that.resize();

                // 列筛选（显示或隐藏）后的事件
                layui.event.call(this, MOD_NAME$4, 'colToggled('+ filter +')', {
                  col: col,
                  config: options
                });
              });
            }
          });
        }
      },
      exports: {
        title: '导出',
        layEvent: 'LAYTABLE_EXPORT',
        icon: 'layui-icon-export',
        onClick: function(obj) { // 自带导出
          var data = obj.data;
          var options = obj.config;
          var openPanel = obj.openPanel;
          var elem = obj.elem;

          if (!data.length) return layer$1.tips('当前表格无数据', elem, {tips: 3});
          if(device$2.ie){
            layer$1.tips('导出功能不支持 IE，请用 Chrome 等高级浏览器导出', elem, {
              tips: 3
            });
          } else {
            openPanel({
              list: function(){
                return [
                  '<li data-type="csv">导出 CSV 文件</li>'
                ].join('')
              }(),
              done: function(panel, list){
                list.on('click', function(){
                  var type = jquery(this).data('type');
                  table.exportFile.call(that, options.id, null, type);
                });
              }
            });
          }
        }
      },
      print: {
        title: '打印',
        layEvent: 'LAYTABLE_PRINT',
        icon: 'layui-icon-print',
        onClick: function(obj) {
          var data = obj.data;
          obj.config;
          var elem = obj.elem;

          if (!data.length) return layer$1.tips('当前表格无数据', elem, {tips: 3});
          var printWin = window.open('about:blank', '_blank');
          var style = ['<style>',
            'body{font-size: 12px; color: #5F5F5F;}',
            'table{width: 100%; border-collapse: collapse; border-spacing: 0;}',
            'th,td{line-height: 20px; padding: 9px 15px; border: 1px solid #ccc; text-align: left; font-size: 12px; color: #5F5F5F;}',
            'a{color: #5F5F5F; text-decoration:none;}',
            'img{max-height: 100%;}',
            '*.layui-hide{display: none}',
          '</style>'].join('');
          var html = jquery(that.layHeader.html()); // 输出表头

          html.append(that.layMain.find('table').html()); // 输出表体
          html.append(that.layTotal.find('table').html()); // 输出合计行

          html.find('th.layui-table-patch').remove(); // 移除补丁
          // 移除表头特殊列
          html.find('thead>tr>th.'+ ELEM_COL_SPECIAL).filter(function(i, thElem){
            return !jquery(thElem).children('.'+ ELEM_GROUP).length; // 父级表头除外
          }).remove();
          html.find('tbody>tr>td.'+ ELEM_COL_SPECIAL).remove(); // 移除表体特殊列

          printWin.document.write(style + html.prop('outerHTML'));
          printWin.document.close();

          if(layui.device('edg').edg){
            printWin.onafterprint = printWin.close;
            printWin.print();
          }else {
            printWin.print();
            printWin.close();
          }
        }
      }
    };

    // 若开启 defaultToolbar
    if (typeof options.defaultToolbar === 'object') {
      var iconElem = [];
      options.defaultToolbar = jquery.map(options.defaultToolbar, function(item, i) {
        var itemIsName = typeof item === 'string';
        var thisItem = itemIsName ? defaultConfig[item] : item;
        if (thisItem) {
          // 根据 name 匹配默认工具并合并
          if (thisItem.name && defaultConfig[thisItem.name]) {
            thisItem = jquery.extend({}, defaultConfig[thisItem.name], thisItem);
          }
          // 初始化默认工具 name
          if (!thisItem.name && itemIsName) {
            thisItem.name = item;
          }
          // 图标列表
          iconElem.push(
            '<div class="layui-inline" title="'+ thisItem.title +'" lay-event="'+ thisItem.layEvent +'">'
            +'<i class="layui-icon '+ thisItem.icon +'"></i>'
            +'</div>'
          );
        }
        return thisItem;
      });
      that.layTool.find('.layui-table-tool-self').html(iconElem.join(''));
    }
  };

  // 分页栏
  Class$6.prototype.renderPagebar = function(){
    var that = this;
    var options = that.config;

    var layPagebar = that.layPagebar = jquery('<div class="layui-inline layui-table-pagebar"></div>');

    // 开启分页栏自定义模板
    if(options.pagebar){
      var pagebarHtml = jquery(options.pagebar).html() || '';
      pagebarHtml && layPagebar.append(laytpl(pagebarHtml).render(options));
      that.layPage.append(layPagebar);
    }
  };

  // 同步表头父列的相关值
  Class$6.prototype.setParentCol = function(hide, parentKey){
    var that = this;
    var options = that.config;

    var parentTh = that.layHeader.find('th[data-key="'+ parentKey +'"]'); // 获取父列元素
    var parentColspan = parseInt(parentTh.attr('colspan')) || 0;

    if(parentTh[0]){
      var arrParentKey = parentKey.split('-');
      var getThisCol = options.cols[arrParentKey[1]][arrParentKey[2]];

      hide ? parentColspan-- : parentColspan++;

      parentTh.attr('colspan', parentColspan);
      parentTh[parentColspan ? 'removeClass' : 'addClass'](HIDE$1); // 如果子列显示，父列必然需要显示

      getThisCol.colspan2 = parentColspan; // 更新实际的 colspan 数
      getThisCol.hide = parentColspan < 1; // 同步 hide 参数

      // 递归，继续往上查询是否有父列
      var nextParentKey = parentTh.data('parentkey');
      nextParentKey && that.setParentCol(hide, nextParentKey);
    }
  };

  // 多级表头补丁
  Class$6.prototype.setColsPatch = function(){
    var that = this;
    var options = that.config;

    // 同步表头父列的相关值
    layui.each(options.cols, function(i1, item1){
      layui.each(item1, function(i2, item2){
        if(item2.hide){
          that.setParentCol(item2.hide, item2.parentKey);
        }
      });
    });
  };

  // 设置组合表头的最大宽度
  Class$6.prototype.setGroupWidth = function(th){
    var that = this;
    var options = that.config;

    if(options.cols.length <= 1) return;

    // 获取表头组合
    var groups = that.layHeader.find((
      // 根据当前活动的表头 parentkey 属性查找其组合表头
      th ? ('th[data-key='+ th.data('parentkey') +']>') : ''
    ) + '.' + ELEM_GROUP); // 若无指向当前活动表头，则自下而上获取所有组合表头

    groups.css('width', 0);
    layui.each(groups.get().reverse(), function(){
      var othis = jquery(this);
      var key = othis.parent().data('key');
      var maxWidth = 0;

      that.layHeader.eq(0).find('th[data-parentkey='+ key +']').width(function(i, width){
        var oTh = jquery(this);
        if(oTh.hasClass(HIDE$1)) return;
        width > 0 && (maxWidth += width);
      });

      // 给组合表头赋值最大宽度
      if(maxWidth) othis.css('max-width', maxWidth - 1);

      // 若当前活动的组合表头仍存在上级，则继续向上设置
      if(th && othis.parent().data('parentkey')){
        that.setGroupWidth(othis.parent());
      }
    });
    groups.css('width', 'auto');
  };

  // 动态分配列宽
  Class$6.prototype.setColsWidth = function(opt){
    var that = this;
    var options = that.config;
    var colNums = 0; // 列个数
    var autoColNums = 0; // 自动列宽的列个数
    var autoWidth = 0; // 自动列分配的宽度
    var countWidth = 0; // 所有列总宽度和
    var cntrWidth = that.setInit('width');
    var borderWidth = parseFloat(layui.getStyle(that.elem[0], 'border-left-width'));
    var lastSpreadCol;
    var headerTableElem = that.layHeader.first().children('table');
    var mainTableElem = that.layMain.find('table');
    var isEmptyTable = that.layMain.find('tbody').is(":empty");
    var isInit = opt && opt.isInit;

    // 统计列个数和最后一个分配宽度的列
    that.eachCols(function(i, item){
      if(!item.hide){
        colNums++;
        if(!(item.width || item.type !== 'normal')){
          lastSpreadCol = item;
        }
      }
    });

    // 减去边框差和滚动条宽
    cntrWidth = cntrWidth - function(){
      return (options.skin === 'line' || options.skin === 'nob') ? 2 : colNums + 1;
    }() * borderWidth - that.getScrollWidth(that.layMain[0]);

    // 计算自动分配的宽度
    var getAutoWidth = function(back){
      // 遍历所有列
      layui.each(options.cols, function(i1, item1){
        layui.each(item1, function(i2, item2){
          var width = 0;
          var minWidth = item2.minWidth || options.cellMinWidth; // 最小宽度
          var maxWidth = item2.maxWidth || options.cellMaxWidth; // 最大宽度

          if(!item2){
            item1.splice(i2, 1);
            return;
          }

          if(item2.colGroup || item2.hide) return;

          if(!back){
            width = item2.width || 0;
            if(/\d+%$/.test(width)){ // 列宽为百分比
              width = (parseFloat(width) / 100) * cntrWidth;
              width < minWidth && (width = minWidth);
              width > maxWidth && (width = maxWidth);
            } else if(!width){ // 列宽未填写
              item2.width = width = 0;
              autoColNums++;
            } else if(item2.type === 'normal'){
              // 若 width 小于 minWidth， 则将 width 值自动设为 minWidth 的值
              width < minWidth && (item2.width = width = minWidth);
              // 若 width 大于 maxWidth， 则将 width 值自动设为 maxWidth 的值
              width > maxWidth && (item2.width = width = maxWidth);
            }
          } else if(autoWidth && autoWidth < minWidth){
            autoColNums--;
            width = minWidth;
          } else if(autoWidth && autoWidth > maxWidth){
            autoColNums--;
            width = maxWidth;
          }

          if(item2.hide) width = 0;
          countWidth = countWidth + width;
        });
      });

      // 如果未填充满，则将剩余宽度平分
      (cntrWidth > countWidth && autoColNums > 0) && (
        autoWidth = (cntrWidth - countWidth) / autoColNums
      );
    };

    getAutoWidth();
    getAutoWidth(true); // 重新检测分配的宽度是否低于最小列宽

    // 记录自动列数
    that.autoColNums = autoColNums = autoColNums > 0 ? autoColNums : 0;

    var pixelsForLastCol = cntrWidth;
    that.eachCols(function(i3, item3){
      var minWidth = item3.minWidth || options.cellMinWidth;
      var maxWidth = item3.maxWidth || options.cellMaxWidth;

      if(item3.colGroup || item3.hide || (lastSpreadCol && lastSpreadCol.key === item3.key)) return;

      // 给未分配宽的列平均分配宽
      if(item3.width === 0){
        that.cssRules(item3.key, function(item){
          var newWidth =  Math.round(function(){
            if(autoWidth < minWidth) return minWidth;
            if(autoWidth > maxWidth) return maxWidth;
            return autoWidth;
          }());
          item.style.width = newWidth + 'px';
          pixelsForLastCol = pixelsForLastCol - newWidth;
        });
      }

      // 给设定百分比的列分配列宽
      else if(/\d+%$/.test(item3.width)){
        that.cssRules(item3.key, function(item){
          var width = Math.round((parseFloat(item3.width) / 100) * cntrWidth);
          width < minWidth && (width = minWidth);
          width > maxWidth && (width = maxWidth);
          item.style.width = width + 'px';
          pixelsForLastCol = pixelsForLastCol - width;
        });
      }

      // 给拥有普通 width 值的列分配最新列宽
      else {
        that.cssRules(item3.key, function(item){
          item.style.width = item3.width + 'px';
          pixelsForLastCol = pixelsForLastCol - item3.width;
        });
      }
    });
    // 最后一列获取剩余的空间，避免舍入导致的布局问题
    if(lastSpreadCol){
      that.cssRules(lastSpreadCol.key, function(item){
        var minWidth = lastSpreadCol.minWidth || options.cellMinWidth;
        var maxWidth = lastSpreadCol.maxWidth || options.cellMaxWidth;
        var newWidth = Math.max(Math.min(pixelsForLastCol, maxWidth), minWidth);
        item.style.width = newWidth + 'px';

        if (!isInit && isEmptyTable){
          // 将表格宽度设置为跟表头一样的宽度，使之可以出现底部滚动条，以便滚动查看所有字段
          mainTableElem.width(that.getContentWidth(headerTableElem));
        }
        // 二次校验，如果仍然出现横向滚动条（通常是 1px 的误差导致）
        // 不同屏幕分辨率、缩放水平以及浏览器渲染差异，可能会触发这个问题
        if(that.layMain.prop('offsetHeight') > that.layMain.prop('clientHeight')){
          item.style.width = (parseFloat(item.style.width) - borderWidth) + 'px';
        }
      });
    }

    if (!isInit && isEmptyTable) {
      // 将表格宽度设置为跟表头一样的宽度，使之可以出现底部滚动条，以便滚动查看所有字段
      mainTableElem.width(that.getContentWidth(headerTableElem));
    } else {
      mainTableElem.width('auto');
    }

    that.setGroupWidth();

  };

  // 重置表格尺寸/结构
  Class$6.prototype.resize = function(){
    var that = this;

    var tableElemIsConnected = that.layMain && ('isConnected' in that.layMain[0]
      ? that.layMain[0].isConnected
      : jquery.contains(document.body, that.layMain[0]));

    if(!tableElemIsConnected) return;

    that.fullSize(); // 让表格铺满
    that.setColsWidth(); // 自适应列宽
    that.scrollPatch(); // 滚动条补丁
  };

  // 表格重载
  Class$6.prototype.reload = function(options, deep, type){
    var that = this;

    options = options || {};
    delete that.haveInit;

    // 防止数组深度合并
    layui.each(options, function(key, item){
      if(layui.type(item) === 'array') delete that.config[key];
    });

    // 对参数进行深度或浅扩展
    that.config = jquery.extend(deep, {}, that.config, options);
    if (type !== 'reloadData') {
      layui.each(that.config.cols, function (i1, item1) {
        layui.each(item1, function (i2, item2) {
          delete item2.colspan2;
        });
      });
      delete that.config.HAS_SET_COLS_PATCH;
    }
    // 执行渲染
    that.render(type);
  };

  // 异常提示
  Class$6.prototype.errorView = function(html){
    var that = this
    ,elemNone = that.layMain.find('.'+ NONE)
    ,layNone = jquery('<div class="'+ NONE +'">'+ (html || 'Error') +'</div>');

    if(elemNone[0]){
      that.layNone.remove();
      elemNone.remove();
    }

    that.layFixed.addClass(HIDE$1);
    that.layMain.find('tbody').html('');

    that.layMain.append(that.layNone = layNone);

    // 异常情况下对 page 和 total 的内容处理
    that.layTotal.addClass(HIDE_V);
    that.layPage.find(ELEM_PAGE_VIEW).addClass(HIDE_V);

    table.cache[that.key] = []; //格式化缓存数据

    that.syncCheckAll();
    that.renderForm();
    that.setColsWidth();
    that.loading(false);
  };

  // 初始页码
  Class$6.prototype.page = 1;

  // 获得数据
  Class$6.prototype.pullData = function(curr, opts){
    var that = this;
    var options = that.config;
    // 同步表头父列的相关值
    options.HAS_SET_COLS_PATCH || that.setColsPatch();
    options.HAS_SET_COLS_PATCH = true;
    var request = options.request;
    var response = options.response;
    var res;
    var sort = function(){
      if(typeof options.initSort === 'object'){
        that.sort({
          field: options.initSort.field,
          type: options.initSort.type,
          reloadType: opts.type
        });
      }
    };
    var done = function(res, origin){
      that.setColsWidth();
      that.loading(false);
      typeof options.done === 'function' && options.done(
        res, curr, res[response.countName], origin
      );
    };

    opts = opts || {};

    // 数据拉取前的回调
    typeof options.before === 'function' && options.before(
      options
    );
    that.startTime = new Date().getTime(); // 渲染开始时间

    if (opts.renderData) { // 将 cache 信息重新渲染
      res = {};
      res[response.dataName] = table.cache[that.key];
      res[response.countName] = options.url ? (layui.type(options.page) === 'object' ? options.page.count : res[response.dataName].length) : options.data.length;

      // 记录合计行数据
      if(typeof options.totalRow === 'object'){
        res[response.totalRowName] = jquery.extend({}, that.totalRow);
      }

      that.renderData({
        res: res,
        curr: curr,
        count: res[response.countName],
        type: opts.type,
        sort: true
      }), done(res, 'renderData');
    } else if(options.url){ // Ajax请求
      var params = {};
      // 当 page 开启，默认自动传递 page、limit 参数
      if(options.page){
        params[request.pageName] = curr;
        params[request.limitName] = options.limit;
      }

      // 参数
      var data = jquery.extend(params, options.where);
      if(options.contentType && options.contentType.indexOf("application/json") == 0){ // 提交 json 格式
        data = JSON.stringify(data);
      }

      that.loading(true);

      // 4：代表响应已完成
      if (that._xhr && that._xhr.readyState !== 4) {
        that._xhrAbort = true;
        that._xhr.abort();
      }
      that._xhr = jquery.ajax({
        type: options.method || 'get',
        url: options.url,
        contentType: options.contentType,
        data: data,
        dataType: options.dataType || 'json',
        jsonpCallback: options.jsonpCallback,
        headers: options.headers || {},
        complete: typeof options.complete === 'function' ? options.complete : undefined,
        success: function(res){
          // 若有数据解析的回调，则获得其返回的数据
          if(typeof options.parseData === 'function'){
            res = options.parseData(res) || res;
          }
          // 检查数据格式是否符合规范
          if(res[response.statusName] != response.statusCode){
            that.errorView(
              res[response.msgName] ||
              ('返回的数据不符合规范，正确的成功状态码应为："'+ response.statusName +'": '+ response.statusCode)
            );
          } else {
            // 当前页不能超过总页数
            var count = res[response.countName];
            var pages = Math.ceil(count / options.limit) || 1;
            if(curr > pages){
              curr = pages;
            }
            that.totalRow = res[response.totalRowName];
            that.renderData({
              res: res,
              curr: curr,
              count: count,
              type: opts.type
            }), sort();

            // 耗时（接口请求+视图渲染）
            options.time = (new Date().getTime() - that.startTime) + ' ms';
          }
          done(res, opts.type);
        },
        error: function(e, msg){
          if (e && e.status === 0 && that._xhrAbort){
            that._xhrAbort = false;
            return;
          }
          that.errorView('请求异常，错误提示：'+ msg);
          typeof options.error === 'function' && options.error(e, msg);
        }
      });
    } else if(layui.type(options.data) === 'array'){ //已知数据
      res = {};
      var startLimit = curr*options.limit - options.limit;
      var newData = options.data.concat();

      res[response.dataName] = options.page
        ? newData.splice(startLimit, options.limit)
      : newData;
      res[response.countName] = options.data.length;

      // 记录合计行数据
      if(typeof options.totalRow === 'object'){
        res[response.totalRowName] = jquery.extend({}, options.totalRow);
      }
      that.totalRow = res[response.totalRowName];

      that.renderData({
        res: res,
        curr: curr,
        count: res[response.countName],
        type: opts.type
      }), sort();

      done(res, opts.type);
    }
  };

  // 遍历表头
  Class$6.prototype.eachCols = function(callback){
    var that = this;
    table.eachCols(null, callback, that.config.cols);
    return that;
  };

  // 获取表头参数项
  Class$6.prototype.col = function(key){
    try {
      key = key.split('-');
      return this.config.cols[key[1]][key[2]] || {};
    } catch(e){
      hint$3.error(e);
      return {};
    }
  };

  Class$6.prototype.getTrHtml = function(data, sort, curr, trsObj) {
    var that = this;
    var options = that.config;
    var trs = trsObj && trsObj.trs || [];
    var trs_fixed = trsObj && trsObj.trs_fixed || [];
    var trs_fixed_r = trsObj && trsObj.trs_fixed_r || [];
    curr = curr || 1;

    layui.each(data, function(i1, item1){
      var tds = [];
      var tds_fixed = [];
      var tds_fixed_r = [];
      var numbers = i1 + options.limit*(curr - 1) + 1; // 序号

      // 数组值是否为 object，如果不是，则自动转为 object
      if(typeof item1 !== 'object'){
        data[i1] = item1 = {LAY_KEY: item1};
        try {
          table.cache[that.key][i1] = item1;
        } catch(e) {}
      }

      //若数据项为空数组，则不往下执行（因为删除数据时，会将原有数据设置为 []）
      if(layui.type(item1) === 'array' && item1.length === 0) return;

      // 加入序号保留字段
      item1[table.config.numbersName] = numbers;

      // 记录下标，
      item1[table.config.indexName] = i1;
      if(!sort) item1[table.config.initIndexName] = i1; // 记录初始状态下标，仅用于内部恢复当前页表格排序

      // 遍历表头
      that.eachCols(function(i3, item3){
        var field = item3.field || i3;
        var key = item3.key;
        var content = item1[field];

        if(content === undefined || content === null) content = '';
        if(item3.colGroup) return;

        // td 内容
        var td = ['<td data-field="'+ field +'" data-key="'+ key +'" '+ function(){
          // 追加各种属性
          var attr = [];
          // 是否开启编辑。若 edit 传入函数，则根据函数的返回结果判断是否开启编辑
          (function(edit){
            if(edit) attr.push('data-edit="'+ edit +'"'); // 添加单元格编辑属性标识
          })(typeof item3.edit === 'function' ? item3.edit(item1) : item3.edit);
          if(item3.templet) attr.push('data-content="'+ util.escape(content) +'"'); // 自定义模板
          if(item3.toolbar) attr.push('data-off="true"'); // 行工具列关闭单元格事件
          if(item3.event) attr.push('lay-event="'+ item3.event +'"'); //自定义事件
          if(item3.minWidth) attr.push('data-minwidth="'+ item3.minWidth +'"'); // 单元格最小宽度
          if(item3.maxWidth) attr.push('data-maxwidth="'+ item3.maxWidth +'"'); // 单元格最大宽度
          if(item3.style) attr.push('style="'+ item3.style +'"'); // 自定义单元格样式
          return attr.join(' ');
        }() +' class="'+ function(){ // 追加样式
          var classNames = [];
          if(item3.hide) classNames.push(HIDE$1); // 插入隐藏列样式
          if(!item3.field) classNames.push(ELEM_COL_SPECIAL); // 插入特殊列样式
          return classNames.join(' ');
        }() +'">'
          ,'<div class="layui-table-cell laytable-cell-'+ function(){ // 返回对应的CSS类标识
            return item3.type === 'normal' ? key
              : (key + ' laytable-cell-' + item3.type);
          }() +'"'
          + (item3.align ? ' align="'+ item3.align +'"' : '')
          +'>'
          + function(){
            var tplData = jquery.extend(true, {
              LAY_COL: item3
            }, item1);
            var checkName = table.config.checkName;
            var disabledName = table.config.disabledName;

            // 渲染不同风格的列
            switch(item3.type){
              case 'checkbox': // 复选
                return '<input type="checkbox" name="layTableCheckbox" lay-skin="primary" '+ function(){
                  // 其他属性
                  var arr = [];

                  //如果是全选
                  if(item3[checkName]){
                    item1[checkName] = item3[checkName];
                    if(item3[checkName]) arr[0] = 'checked';
                  }
                  if(tplData[checkName]) arr[0] = 'checked';

                  // 禁选
                  if(tplData[disabledName]) arr.push('disabled');

                  return arr.join(' ');
                }() +' lay-type="layTableCheckbox">';
                //break;
              case 'radio': // 单选
                return '<input type="radio" name="layTableRadio_'+ options.index +'" '
                  + function(){
                    var arr = [];
                    if(tplData[checkName]) arr[0] = 'checked';
                    if(tplData[disabledName]) arr.push('disabled');
                    return arr.join(' ');
                  }() +' lay-type="layTableRadio">';
                //break;
              case 'numbers':
                return numbers;
                //break;
            }

            //解析工具列模板
            if(item3.toolbar){
              return laytpl(jquery(item3.toolbar).html()||'').render(tplData);
            }
            return parseTempData.call(that, {
              item3: item3
              ,content: content
              ,tplData: tplData
            });
          }()
          ,'</div></td>'].join('');

        tds.push(td);
        if(item3.fixed && item3.fixed !== 'right') tds_fixed.push(td);
        if(item3.fixed === 'right') tds_fixed_r.push(td);
      });

      // 添加 tr 属性
      var trAttr = function(){
        var arr = ['data-index="'+ i1 +'"'];
        if(item1[table.config.checkName]) arr.push('class="'+ ELEM_CHECKED$1 +'"');
        return arr.join(' ');
      }();

      trs.push('<tr '+ trAttr +'>'+ tds.join('') + '</tr>');
      trs_fixed.push('<tr '+ trAttr +'>'+ tds_fixed.join('') + '</tr>');
      trs_fixed_r.push('<tr '+ trAttr +'>'+ tds_fixed_r.join('') + '</tr>');
    });

    return {
      trs: trs,
      trs_fixed: trs_fixed,
      trs_fixed_r: trs_fixed_r
    }
  };

  // 返回行节点代码
  table.getTrHtml = function (id, data) {
    var that = getThisTable$1(id);
    return that.getTrHtml(data, null, that.page);
  };

  // 数据渲染
  Class$6.prototype.renderData = function(opts){
    var that = this;
    var options = that.config;

    var res = opts.res;
    var curr = opts.curr;
    var count = that.count = opts.count;
    var sort = opts.sort;

    var data = res[options.response.dataName] || []; //列表数据
    var totalRowData = res[options.response.totalRowName]; //合计行数据
    var trs = [];
    var trs_fixed = [];
    var trs_fixed_r = [];

    // 渲染视图
    var render = function(){ // 后续性能提升的重点
      if(!sort && that.sortKey){
        return that.sort({
          field: that.sortKey.field,
          type: that.sortKey.sort,
          pull: true,
          reloadType: opts.type
        });
      }

      that.getTrHtml(data, sort, curr, {
        trs: trs,
        trs_fixed: trs_fixed,
        trs_fixed_r: trs_fixed_r
      });

      // 容器的滚动条位置
      if(!(options.scrollPos === 'fixed' && opts.type === 'reloadData')){
        that.layBody.scrollTop(0);
      }
      if(options.scrollPos === 'reset'){
        that.layBody.scrollLeft(0);
      }

      that.layMain.find('.'+ NONE).remove();
      that.layMain.find('tbody').html(trs.join(''));
      that.layFixLeft.find('tbody').html(trs_fixed.join(''));
      that.layFixRight.find('tbody').html(trs_fixed_r.join(''));

      // 渲染表单
      that.syncCheckAll();
      that.renderForm();

      // 因为 page 参数有可能发生变化 先重新铺满
      that.fullSize();

      // 滚动条补丁
      that.haveInit ? that.scrollPatch() : setTimeout(function(){
        that.scrollPatch();
      }, 50);
      that.haveInit = true;

      layer$1.close(that.tipsIndex);
    };

    table.cache[that.key] = data; //记录数据

    //显示隐藏合计栏
    that.layTotal[data.length == 0 ? 'addClass' : 'removeClass'](HIDE_V);

    //显示隐藏分页栏
    that.layPage[(options.page || options.pagebar) ? 'removeClass' : 'addClass'](HIDE$1);
    that.layPage.find(ELEM_PAGE_VIEW)[
      (!options.page || count == 0 || (data.length === 0 && curr == 1))
        ? 'addClass'
      : 'removeClass'
    ](HIDE_V);

    //如果无数据
    if(data.length === 0){
      return that.errorView(options.text.none);
    } else {
      that.layFixLeft.removeClass(HIDE$1);
    }

    //如果执行初始排序
    if(sort){
      return render();
    }

    //正常初始化数据渲染
    render(); //渲染数据
    that.renderTotal(data, totalRowData); //数据合计
    that.layTotal && that.layTotal.removeClass(HIDE$1);

    //同步分页状态
    if(options.page){
      options.page = jquery.extend({
        elem: 'layui-table-page' + options.index,
        count: count,
        limit: options.limit,
        limits: options.limits || [10,20,30,40,50,60,70,80,90],
        groups: 3,
        layout: ['prev', 'page', 'next', 'skip', 'count', 'limit'],
        prev: '<i class="layui-icon">&#xe603;</i>',
        next: '<i class="layui-icon">&#xe602;</i>',
        jump: function(obj, first){
          if(!first){
            //分页本身并非需要做以下更新，下面参数的同步，主要是因为其它处理统一用到了它们
            //而并非用的是 options.page 中的参数（以确保分页未开启的情况仍能正常使用）
            that.page = obj.curr; //更新页码
            options.limit = obj.limit; //更新每页条数

            that.pullData(obj.curr);
          }
        }
      }, options.page);
      options.page.count = count; //更新总条数
      laypage.render(options.page);
    }
  };

  // 重新渲染数据
  table.renderData = function (id) {
    var that = getThisTable$1(id);
    if (!that) {
      return;
    }

    that.pullData(that.page, {
      renderData: true,
      type: 'reloadData'
    });
  };

  // 数据合计行
  Class$6.prototype.renderTotal = function(data, totalRowData){
    var that = this;
    var options = that.config;
    var totalNums = {};

    if(!options.totalRow) return;

    layui.each(data, function(i1, item1){
      // 若数据项为空数组，则不往下执行（因为删除数据时，会将原有数据设置为 []）
      if(layui.type(item1) === 'array' && item1.length === 0) return;

      that.eachCols(function(i3, item3){
        var field = item3.field || i3
        ,content = item1[field];

        if(item3.totalRow){
          totalNums[field] = (totalNums[field] || 0) + (parseFloat(content) || 0);
        }
      });
    });

    that.dataTotal = []; // 记录合计行结果

    var tds = [];
    that.eachCols(function(i3, item3){
      var field = item3.field || i3;

      // 合计数据的特定字段
      var TOTAL_NUMS = totalRowData && totalRowData[item3.field];

      // 合计数据的小数点位数处理
      var decimals = 'totalRowDecimals' in item3 ? item3.totalRowDecimals : 2;
      var thisTotalNum = totalNums[field]
        ? parseFloat(totalNums[field] || 0).toFixed(decimals)
      : '';

      // 合计内容
      var content = function(){
        var text = item3.totalRowText || '';
        var tplData = {
          LAY_COL: item3
        };

        tplData[field] = thisTotalNum;

        // 获取自动计算的合并内容
        var getContent = item3.totalRow ? (parseTempData.call(that, {
          item3: item3,
          content: thisTotalNum,
          tplData: tplData
        }) || text) : text;

        // 如果直接传入了合计行数据，则不输出自动计算的结果
        return TOTAL_NUMS || getContent;
      }();

      // td 显示内容
      var tdContent = function(){
        var totalRow = item3.totalRow || options.totalRow;

        // 如果 totalRow 参数为字符类型，则解析为自定义模版
        if(typeof totalRow === 'string'){
          return laytpl(totalRow).render(jquery.extend({
            TOTAL_NUMS: TOTAL_NUMS || totalNums[field],
            TOTAL_ROW: totalRowData || {},
            LAY_COL: item3
          }, item3));
        }

        return content;
      }();

      // 合计原始结果
      item3.field && that.dataTotal.push({
        field: item3.field,
        total: jquery('<div>'+ tdContent +'</div>').text()
      });

      // td 容器
      var td = ['<td data-field="'+ field +'" data-key="'+ item3.key +'" '+ function(){
        var attr = [];
        if(item3.minWidth) attr.push('data-minwidth="'+ item3.minWidth +'"'); // 单元格最小宽度
        if(item3.maxWidth) attr.push('data-maxwidth="'+ item3.maxWidth +'"'); // 单元格最小宽度
        if(item3.style) attr.push('style="'+ item3.style +'"'); // 自定义单元格样式
        return attr.join(' ');
      }() +' class="'+ function(){ // 追加样式
        var classNames = [];
        if(item3.hide) classNames.push(HIDE$1); // 插入隐藏列样式
        if(!item3.field) classNames.push(ELEM_COL_SPECIAL); // 插入特殊列样式
        return classNames.join(' ');
      }() +'">',
        '<div class="layui-table-cell laytable-cell-'+ function(){ // 返回对应的CSS类标识
          var key = item3.key;
          return item3.type === 'normal' ? key
          : (key + ' laytable-cell-' + item3.type);
        }() +'"'+ function(){
        var attr = [];
        if(item3.align) attr.push('align="'+ item3.align +'"'); // 对齐方式
        return attr.join(' ');
      }() +'>' + tdContent,
      '</div></td>'].join('');

      tds.push(td);
    });

    var patchElem = that.layTotal.find('.layui-table-patch'); // 可能存在滚动条补丁
    that.layTotal.find('tbody').html('<tr>' + tds.join('') + (patchElem.length ? patchElem.get(0).outerHTML : '') + '</tr>');
  };

  //找到对应的列元素
  Class$6.prototype.getColElem = function(parent, key){
    //var options = that.config;
    return parent.eq(0).find('.laytable-cell-'+ key + ':eq(0)');
  };

  // 渲染表单
  Class$6.prototype.renderForm = function(type){
    var that = this;
    that.config;
    var filter = that.elem.attr('lay-filter');
    form.render(type, filter);
  };

  // 定向渲染表单
  Class$6.prototype.renderFormByElem = function(elem){
    layui.each(['input', 'select'], function(i, formType){
      form.render(elem.find(formType));
    });
  };

  // 同步全选按钮状态
  Class$6.prototype.syncCheckAll = function(){
    var that = this;
    var options = that.config;
    var checkAllElem = that.layHeader.find('input[name="layTableCheckbox"]');
    var syncColsCheck = function(checked){
      that.eachCols(function(i, item){
        if(item.type === 'checkbox'){
          item[options.checkName] = checked;
        }
      });
      return checked;
    };
    var checkStatus = table.checkStatus(that.key);

    if(!checkAllElem[0]) return;

    // 选中状态
    syncColsCheck(checkStatus.isAll);
    checkAllElem.prop({
      checked: checkStatus.isAll,
      indeterminate: !checkStatus.isAll && checkStatus.data.length // 半选
    });
  };

  // 标记当前活动行背景色
  Class$6.prototype.setRowActive = function(index, className, removeClass){
    var that = this;
    that.config;
    var tr = that.layBody.find('tr[data-index="'+ index +'"]');
    className = className || 'layui-table-click';

    if(removeClass) return tr.removeClass(className);

    tr.addClass(className);
    tr.siblings('tr').removeClass(className);
  };

  // 设置行选中状态
  Class$6.prototype.setRowChecked = function(opts){
    var that = this;
    var options = that.config;
    var isCheckAll = opts.index === 'all'; // 是否操作全部
    var isCheckMult = layui.type(opts.index) === 'array'; // 是否操作多个
    var isCheckAllOrMult = isCheckAll || isCheckMult; // 是否全选或多选

    // treeTable 内部已处理选中，此处不再处理
    if(options.tree && options.tree.view) return;

    // 全选或多选时
    if (isCheckAllOrMult) {
      that.layBox.addClass(DISABLED_TRANSITION); // 减少回流
      if (opts.type === 'radio') return; // radio 不允许全选或多选
    }

    if(isCheckMult){
      var makeMap = {};
      layui.each(opts.index, function(i,v){
        makeMap[v] = true;
      });
      opts.index = makeMap;
    }

    // 匹配行元素
    var tbody = that.layBody.children('.layui-table').children('tbody');
    var selector = isCheckAllOrMult ? 'tr' : 'tr[data-index="'+ opts.index +'"]';
    var tr = function(tr) {
      return isCheckAll ? tr : tr.filter(isCheckMult ? function() {
        var dataIndex = jquery(this).data('index');
        return opts.index[dataIndex];
      } : '[data-index="'+ opts.index +'"]');
    }(tbody.children(selector));

    // 默认属性
    opts = jquery.extend({
      type: 'checkbox' // 选中方式
    }, opts);

    // 同步数据选中属性值
    var thisData = table.cache[that.key];
    var existChecked = 'checked' in opts;

    // 若为单选框，则单向选中；若为复选框，则切换选中。
    var getChecked = function(value){
      return opts.type === 'radio' ? true : (existChecked ? opts.checked : !value)
    };

    var radioCheckedIndex;

    // 给匹配行设置选中状态
    tr.each(function() {
      var el = jquery(this);
      var i = el.attr('data-index');
      var item = thisData[i];

      if (!i) return; // 此时 el 通常为静态表格嵌套时的原始模板

      // 绕过空项和禁用项
      if (layui.type(item) === 'array' || item[options.disabledName]) {
        return;
      }

      // 标记数据选中状态
      var checked = item[options.checkName] = getChecked(el.hasClass(ELEM_CHECKED$1));

      // 标记当前行背景色
      el.toggleClass(ELEM_CHECKED$1, !!checked);

      // 若为 radio 类型，则取消其他行选中背景色
      if (opts.type === 'radio') {
        radioCheckedIndex = i;
        el.siblings().removeClass(ELEM_CHECKED$1);
      }
    });

    // 若为 radio 类型，移除其他行数据选中状态
    if (radioCheckedIndex) {
      layui.each(thisData, function(i, item) {
        if (Number(radioCheckedIndex) !== Number(i)) {
          delete item[options.checkName];
        }
      });
    }

    // 若存在复选框或单选框，则标注选中状态样式
    var td = tr.children('td').children('.layui-table-cell');
    var checkedElem = td.children('input[lay-type="'+ ({
      radio: 'layTableRadio',
      checkbox: 'layTableCheckbox'
    }[opts.type] || 'checkbox') +'"]:not(:disabled)');
    var checkedSameElem = checkedElem.last();
    var fixRElem = checkedSameElem.closest(ELEM_FIXR$1);

    ( opts.type === 'radio' && fixRElem.hasClass(HIDE$1)
      ?  checkedElem.first()
    : checkedElem ).prop('checked', getChecked(checkedSameElem.prop('checked')));

    that.syncCheckAll();

    if(isCheckAllOrMult){
      setTimeout(function(){
        that.layBox.removeClass(DISABLED_TRANSITION);
      }, 100);
    }
  };

  // 数据排序
  Class$6.prototype.sort = function(opts){ // field, type, pull, fromEvent
    var that = this;
    var field;
    var res = {};
    var options = that.config;
    var filter = options.elem.attr('lay-filter');
    var data = table.cache[that.key], thisData;

    opts = opts || {};

    // 字段匹配
    if(typeof opts.field === 'string'){
      field = opts.field;
      that.layHeader.find('th').each(function(i, item){
        var othis = jquery(this);
        var _field = othis.data('field');
        if(_field === opts.field){
          opts.field = othis;
          field = _field;
          return false;
        }
      });
    }

    try {
      field = field || opts.field.data('field');
      var key = opts.field.data('key');

      // 如果欲执行的排序已在状态中，则不执行渲染
      if(that.sortKey && !opts.pull){
        if(field === that.sortKey.field && opts.type === that.sortKey.sort){
          return;
        }
      }

      var elemSort = that.layHeader.find('th .laytable-cell-'+ key).find(ELEM_SORT);
      that.layHeader.find('th').find(ELEM_SORT).removeAttr('lay-sort'); // 清除其它标题排序状态
      elemSort.attr('lay-sort', opts.type || null);
      that.layFixed.find('th');
    } catch(e){
      hint$3.error('Table modules: sort field \''+ field +'\' not matched');
    }

    // 记录排序索引和类型
    that.sortKey = {
      field: field,
      sort: opts.type
    };

    // 默认为前端自动排序。如果否，则需自主排序（通常为服务端处理好排序）
    if(options.autoSort){
      if(opts.type === 'asc'){ //升序
        thisData = layui.sort(data, field, null, true);
      } else if(opts.type === 'desc'){ //降序
        thisData = layui.sort(data, field, true, true);
      } else { // 清除排序
        thisData = layui.sort(data, table.config.initIndexName, null, true);
        delete that.sortKey;
        delete options.initSort;
      }
    }

    res[options.response.dataName] = thisData || data;

    // 重载数据
    that.renderData({
      res: res,
      curr: that.page,
      count: that.count,
      sort: true,
      type: opts.reloadType
    });

    // 排序是否来自于点击表头事件触发
    if(opts.fromEvent){
      options.initSort = {
        field: field,
        type: opts.type
      };
      layui.event.call(opts.field, MOD_NAME$4, 'sort('+ filter +')', jquery.extend({
        config: options
      }, options.initSort));
    }
  };

  // 请求 loading
  Class$6.prototype.loading = function(show){
    var that = this;
    var options = that.config;

    if(options.loading){
      that.layBox.find(ELEM_INIT).toggleClass(HIDE$1, !show);
    }
  };

  // 获取对应单元格的 cssRules
  Class$6.prototype.cssRules = function(key, callback){
    var that = this;
    var style = that.elem.children('style')[0];

    lay.getStyleRules(style, function(item){
      if (item.selectorText === ('.laytable-cell-'+ key)) {
        callback(item);
        return true;
      }
    });
  };

  // 让表格铺满
  Class$6.prototype.fullSize = function(){
    var that = this;
    var options = that.config;
    var height = options.height;
    var bodyHeight;
    var MIN_HEIGHT = 135;

    if(that.fullHeightGap){
      height = _WIN.height() - that.fullHeightGap;
      if(height < MIN_HEIGHT) height = MIN_HEIGHT;
      // that.elem.css('height', height);
    } else if (that.parentDiv && that.parentHeightGap) {
      height = jquery(that.parentDiv).height() - that.parentHeightGap;
      if(height < MIN_HEIGHT) height = MIN_HEIGHT;
      // that.elem.css("height", height);
    } else if (that.customHeightFunc) {
      height = that.customHeightFunc();
      if(height < MIN_HEIGHT) height = MIN_HEIGHT;
    }

    // 如果多级表头，则填补表头高度
    if(options.cols.length > 1){
      // 补全高度
      var th = that.layFixed.find(ELEM_HEADER).find('th');
      // 固定列表头同步跟本体 th 一致高度
      var headerMain = that.layHeader.first();
      layui.each(th, function (thIndex, thElem) {
        thElem = jquery(thElem);
        thElem.height(headerMain.find('th[data-key="' + thElem.attr('data-key') + '"]').height() + 'px');
      });
    }

    if(!height) return;

    // 减去列头区域的高度 --- 此处的数字常量是为了防止容器处在隐藏区域无法获得高度的问题，只对默认尺寸表格做支持
    bodyHeight = parseFloat(height) - (that.layHeader.outerHeight() || 39);

    // 减去工具栏的高度
    if(options.toolbar){
      bodyHeight -= (that.layTool.outerHeight() || 51);
    }

    // 减去统计栏的高度
    if(options.totalRow){
      bodyHeight -= (that.layTotal.outerHeight() || 40);
    }

    // 减去分页栏的高度
    if(options.page || options.pagebar){
      bodyHeight -= (that.layPage.outerHeight() || 43);
    }

    if (options.maxHeight) {
      layui.each({elem: height, layMain: bodyHeight}, function (elemName, elemHeight) {
        that[elemName].css({
          height: 'auto',
          maxHeight: elemHeight + 'px'
        });
      });
    } else {
      that.layMain.outerHeight(bodyHeight);
    }
  };

  //获取滚动条宽度
  Class$6.prototype.getScrollWidth = function(elem){
    var width;
    if(elem){
      width = elem.offsetWidth - elem.clientWidth;
    } else {
      elem = document.createElement('div');
      elem.style.width = '100px';
      elem.style.height = '100px';
      elem.style.overflowY = 'scroll';

      document.body.appendChild(elem);
      width = elem.offsetWidth - elem.clientWidth;
      document.body.removeChild(elem);
    }
    return width;
  };

  // 滚动条补丁
  Class$6.prototype.scrollPatch = function(){
    var that = this;
    var layMainTable = that.layMain.children('table');
    var scrollWidth = that.layMain.width() - that.layMain.prop('clientWidth'); // 纵向滚动条宽度
    var scrollHeight = that.layMain.height() - that.layMain.prop('clientHeight'); // 横向滚动条高度
    that.getScrollWidth(that.layMain[0]); // 获取主容器滚动条宽度，如果有的话
    var outWidth = layMainTable.outerWidth() - that.layMain.width(); // 表格内容器的超出宽度

    // 添加补丁
    var addPatch = function(elem){
      if(scrollWidth && scrollHeight){
        elem = elem.eq(0);
        if(!elem.find('.layui-table-patch')[0]){
          var patchElem = jquery('<th class="layui-table-patch"><div class="layui-table-cell"></div></th>'); // 补丁元素
          patchElem.find('div').css({
            width: scrollWidth
          });
          elem.find('tr').append(patchElem);
        }
      } else {
        elem.find('.layui-table-patch').remove();
      }
    };

    addPatch(that.layHeader);
    addPatch(that.layTotal);

    // 固定列区域高度
    var mainHeight = that.layMain.height();
    var fixHeight = mainHeight - scrollHeight;

    that.layFixed.find(ELEM_BODY$1).css(
      'height',
      layMainTable.height() >= fixHeight ? fixHeight : 'auto'
    ).scrollTop(that.layMain.scrollTop()); // 固定列滚动条高度

    // 表格宽度小于容器宽度时，隐藏固定列
    that.layFixRight[
      (table.cache[that.key] && table.cache[that.key].length) && outWidth > 0
        ? 'removeClass'
      : 'addClass'
    ](HIDE$1);

    // 操作栏
    that.layFixRight.css('right', scrollWidth);
  };

  /**
   * @typedef updateRowOptions
   * @prop {number} index - 行索引
   * @prop {Object.<string, any>} data - 行数据
   * @prop {boolean | ((field, index) => boolean)} [related] - 更新其他包含自定义模板且可能有所关联的列视图
   */
  /**
   * 更新指定行
   * @param {updateRowOptions | updateRowOptions[]} opts
   * @param {(field: string, value: any) => void} [callback] - 更新每个字段时的回调函数
   */
  Class$6.prototype.updateRow = function(opts, callback){
    var that = this;
    var ELEM_CELL = '.layui-table-cell';
    var opts = layui.type(opts) === 'array' ? opts : [opts];
    var dataCache = table.cache[that.key] || [];

    var update = function(opt){
      var index = opt.index;
      var row = opt.data;
      var related = opt.related;

      var data = dataCache[index] || {};
      var tr = that.layBody.find('tr[data-index="' + index + '"]');

      // 更新缓存中的数据
      layui.each(row, function (key, value) {
        data[key] = value;
        callback && callback(key, value);
      });

      // 更新单元格
      that.eachCols(function (i, item3) {
        var field = String(item3.field || i);
        var shouldUpdate = field in row || ((typeof related === 'function' ? related(field, i) : related) && (item3.templet || item3.toolbar));
        if(shouldUpdate){
          var td = tr.children('td[data-field="' + field + '"]');
          var cell = td.children(ELEM_CELL);
          var content = data[item3.field];
          cell.html(parseTempData.call(that, {
            item3: item3,
            content: content,
            tplData: jquery.extend({
              LAY_COL: item3,
            }, data)
          }));
          td.data("content", content);
          that.renderFormByElem(cell);
        }
      });
    };

    layui.each(opts, function(i, opt){
      update(opt);
    });
  };

  /**
   * 更新指定行
   * @param {string} id - table ID
   * @param {updateRowOptions | updateRowOptions[]} options
   */
  table.updateRow = function (id, options){
    var that = getThisTable$1(id);
    return that.updateRow(options);
  };

  // 事件处理
  Class$6.prototype.events = function(){
    var that = this;
    var options = that.config;

    var filter = options.elem.attr('lay-filter');
    var th = that.layHeader.find('th');
    var ELEM_CELL = '.layui-table-cell';

    var _BODY = jquery('body');
    var dict = {};

    // 头部工具栏操作事件
    that.layTool.on('click', '*[lay-event]', function(e){
      var othis = jquery(this);
      var events = othis.attr('lay-event');
      var data = table.cache[options.id];

      // 弹出工具下拉面板
      var openPanel = function(sets) {
        var list = jquery(sets.list);
        var panel = jquery('<ul class="' + ELEM_TOOL_PANEL + '"></ul>');

        panel.html(list);

        // 限制最大高度
        if(options.height){
          panel.css('max-height', options.height - (that.layTool.outerHeight() || 50));
        }

        // 插入元素
        othis.find('.' + ELEM_TOOL_PANEL)[0] || othis.append(panel);
        that.renderForm();

        panel.on('click', function(e){
          layui.stope(e);
        });

        sets.done && sets.done(panel, list);
      };

      layui.stope(e);
      _DOC.trigger('table.tool.panel.remove');
      layer$1.close(that.tipsIndex);

      // 头部工具栏右侧图标
      layui.each(options.defaultToolbar, function(index, item) {
        if (item.layEvent === events) {
          typeof item.onClick === 'function' && item.onClick({
            data: data,
            config: options,
            openPanel: openPanel,
            elem: othis
          });
          return true;
        }
      });

      // table toolbar 事件
      layui.event.call(this, MOD_NAME$4, 'toolbar('+ filter +')', jquery.extend({
        event: events,
        config: options
      },{}));
    });

    // 表头自定义元素事件
    that.layHeader.on('click', '*[lay-event]', function(e){
      var othis = jquery(this);
      var events = othis.attr('lay-event');
      var th = othis.closest('th');
      var key = th.data('key');
      var col = that.col(key);

      layui.event.call(this, MOD_NAME$4, 'colTool('+ filter +')', jquery.extend({
        event: events,
        config: options,
        col: col
      },{}));
    });

    // 分页栏操作事件
    that.layPagebar.on('click', '*[lay-event]', function(e){
      var othis = jquery(this);
      var events = othis.attr('lay-event');

      layui.event.call(this, MOD_NAME$4, 'pagebar('+ filter +')', jquery.extend({
        event: events,
        config: options
      },{}));
    });

    // 拖拽调整宽度
    th.on('mousemove', function(e){
      var othis = jquery(this);
      var oLeft = othis.offset().left;
      var pLeft = e.clientX - oLeft;
      if(othis.data('unresize') || thisTable.eventMoveElem){
        return;
      }
      dict.allowResize = othis.width() - pLeft <= 10; //是否处于拖拽允许区域
      _BODY.css('cursor', (dict.allowResize ? 'col-resize' : ''));
    }).on('mouseleave', function(){
      jquery(this);
      if(thisTable.eventMoveElem) return;
      dict.allowResize = false;
      _BODY.css('cursor', '');
    }).on('mousedown', function(e){
      var othis = jquery(this);
      if(dict.allowResize){
        var key = othis.data('key');
        e.preventDefault();
        dict.offset = [e.clientX, e.clientY]; //记录初始坐标

        that.cssRules(key, function(item){
          var width = item.style.width || othis.outerWidth();
          dict.rule = item;
          dict.ruleWidth = parseFloat(width);
          dict.minWidth = othis.data('minwidth') || options.cellMinWidth;
          dict.maxWidth = othis.data('maxwidth') || options.cellMaxWidth;
        });

        // 临时记录当前拖拽信息
        othis.data(DATA_MOVE_NAME, dict);
        thisTable.eventMoveElem = othis;
      }
    });

    // 拖拽中
    if(!thisTable.docEvent){
      _DOC.on('mousemove', function(e){
        if(thisTable.eventMoveElem){
          var dict = thisTable.eventMoveElem.data(DATA_MOVE_NAME) || {};

          thisTable.eventMoveElem.data('resizing', 1);
          e.preventDefault();

          if(dict.rule){
            var setWidth = dict.ruleWidth + e.clientX - dict.offset[0];
            var id = thisTable.eventMoveElem.closest('.' + ELEM_VIEW$2).attr(MOD_ID$1);
            var thatTable = getThisTable$1(id);

            if(!thatTable) return;

            if(setWidth < dict.minWidth) setWidth = dict.minWidth;
            if(setWidth > dict.maxWidth) setWidth = dict.maxWidth;

            dict.rule.style.width = setWidth + 'px';
            thatTable.setGroupWidth(thisTable.eventMoveElem);
            layer$1.close(that.tipsIndex);
          }
        }
      }).on('mouseup', function(e){
        if(thisTable.eventMoveElem){
          var th = thisTable.eventMoveElem; // 当前触发拖拽的 th 元素
          var id = th.closest('.' + ELEM_VIEW$2).attr(MOD_ID$1);
          var thatTable = getThisTable$1(id);

          if(!thatTable) return;

          var key = th.data('key');
          var col = thatTable.col(key);
          var filter = thatTable.config.elem.attr('lay-filter');

          // 重置过度信息
          dict = {};
          _BODY.css('cursor', '');
          thatTable.scrollPatch();

          // 清除当前拖拽信息
          th.removeData(DATA_MOVE_NAME);
          delete thisTable.eventMoveElem;

          // 列拖拽宽度后的事件
          thatTable.cssRules(key, function(item){
            col.width = parseFloat(item.style.width);
            layui.event.call(th[0], MOD_NAME$4, 'colResized('+ filter +')', {
              col: col,
              config: thatTable.config
            });
          });
        }
      });
    }

    // 已给 document 执行全局事件，避免重复绑定
    thisTable.docEvent = true;


    // 排序
    th.on('click', function(e){
      var othis = jquery(this);
      var elemSort = othis.find(ELEM_SORT);
      var nowType = elemSort.attr('lay-sort');
      var type;

      // 排序不触发的条件
      if(!elemSort[0] || othis.data('resizing') === 1){
        return othis.removeData('resizing');
      }

      if(nowType === 'asc'){
        type = 'desc';
      } else if(nowType === 'desc'){
        type = null;
      } else {
        type = 'asc';
      }
      that.sort({
        field: othis,
        type: type,
        fromEvent: true
      });
    }).find(ELEM_SORT+' .layui-edge ').on('click', function(e){
      var othis = jquery(this);
      var index = othis.index();
      var field = othis.parents('th').eq(0).data('field');
      layui.stope(e);
      if(index === 0){
        that.sort({
          field: field,
          type: 'asc',
          fromEvent: true
        });
      } else {
        that.sort({
          field: field,
          type: 'desc',
          fromEvent: true
        });
      }
    });

    //数据行中的事件返回的公共对象成员
    var commonMember = that.commonMember = function(sets){
      var othis = jquery(this);
      var index = othis.parents('tr').eq(0).data('index');
      var tr = that.layBody.find('tr[data-index="'+ index +'"]');
      var data = table.cache[that.key] || [];

      data = data[index] || {};

      // 事件返回的公共成员
      var obj = {
        tr: tr, // 行元素
        config: options,
        data: table.clearCacheKey(data), // 当前行数据
        dataCache: data, // 当前行缓存中的数据
        index: index,
        del: function(){ // 删除行数据
          table.cache[that.key][index] = [];
          tr.remove();
          that.scrollPatch();
        },
        update: function(fields, related){ // 修改行数据
          fields = fields || {};
          that.updateRow({
            index: index,
            data: fields,
            related: related
          }, function(key, value){
            obj.data[key] = value;
          });
        },
        // 设置行选中状态
        setRowChecked: function(opts){
          that.setRowChecked(jquery.extend({
            index: index
          }, opts));
        }
        // 获取当前列
      };

      return jquery.extend(obj, sets);
    };

    // 复选框选择（替代元素的 click 事件）
    that.elem.on('click', 'input[name="layTableCheckbox"]+', function(e){
      var othis = jquery(this);
      var td = othis.closest('td');
      var checkbox = othis.prev();
      that.layBody.find('input[name="layTableCheckbox"]');
      var index = checkbox.parents('tr').eq(0).data('index');
      var checked = checkbox[0].checked;
      var isAll = checkbox.attr('lay-filter') === 'layTableAllChoose';

      if(checkbox[0].disabled) return;

      // 全选
      if(isAll){
        that.setRowChecked({
          index: 'all',
          checked: checked
        });
      } else {
        that.setRowChecked({
          index: index,
          checked: checked
        });
      }

      layui.stope(e);

      // 事件
      layui.event.call(
        checkbox[0],
        MOD_NAME$4, 'checkbox('+ filter +')',
        commonMember.call(checkbox[0], {
          checked: checked,
          type: isAll ? 'all' : 'one',
          getCol: function(){ // 获取当前列的表头配置信息
            return that.col(td.data('key'));
          }
        })
      );
    });

    // 单选框选择
    that.elem.on('click', 'input[lay-type="layTableRadio"]+', function(e){
      var othis = jquery(this);
      var td = othis.closest('td');
      var radio = othis.prev();
      var checked = radio[0].checked;
      var index = radio.parents('tr').eq(0).data('index');

      layui.stope(e);
      if(radio[0].disabled) return false;

      // 标注选中样式
      that.setRowChecked({
        type: 'radio',
        index: index
      });

      // 事件
      layui.event.call(
        radio[0],
        MOD_NAME$4, 'radio('+ filter +')',
        commonMember.call(radio[0], {
          checked: checked,
          getCol: function(){ // 获取当前列的表头配置信息
            return that.col(td.data('key'));
          }
        })
      );
    });

    // 行事件
    that.layBody.on('mouseenter', 'tr', function(){ // 鼠标移入行
      var othis = jquery(this);
      var index = othis.index();
      if(othis.data('off')) return; // 不触发事件
      that.layBody.find('tr:eq('+ index +')').addClass(ELEM_HOVER$1);
    }).on('mouseleave', 'tr', function(){ // 鼠标移出行
      var othis = jquery(this);
      var index = othis.index();
      if(othis.data('off')) return; // 不触发事件
      that.layBody.find('tr:eq('+ index +')').removeClass(ELEM_HOVER$1);
    }).on('click', 'tr', function(e){ // 单击行
      setRowEvent.call(this, 'row', e);
    }).on('dblclick', 'tr', function(e){ // 双击行
      setRowEvent.call(this, 'rowDouble', e);
    }).on('contextmenu', 'tr', function(e){ // 菜单
      if (!options.defaultContextmenu) e.preventDefault();
      setRowEvent.call(this, 'rowContextmenu', e);
    });

    // 创建行单击、双击、菜单事件
    var setRowEvent = function(eventType, e){
      var othis = jquery(this);
      if(othis.data('off')) return; // 不触发事件

      // 不触发「行单/双击事件」的子元素
      if (eventType !== 'rowContextmenu') {
        var UNROW = [
          '.layui-form-checkbox',
          '.layui-form-switch',
          '.layui-form-radio',
          '[lay-unrow]'
        ].join(',');

        if(jquery(e.target).is(UNROW) || jquery(e.target).closest(UNROW)[0]){
          return;
        }
      }

      layui.event.call(
        this,
        MOD_NAME$4, eventType + '('+ filter +')',
        commonMember.call(othis.children('td')[0], {
          e: e
        })
      );
    };

    // 渲染单元格编辑状态
    var renderGridEdit = function(othis, e){
      othis = jquery(othis);

      if(othis.data('off')) return; // 不触发事件

      var field = othis.data('field');
      var key = othis.data('key');
      var col = that.col(key);
      var index = othis.closest('tr').data('index');
      var data = table.cache[that.key][index];
      othis.children(ELEM_CELL);

      // 是否开启编辑
      // 若 edit 传入函数，则根据函数的返回结果判断是否开启编辑
      var editType = typeof col.edit === 'function'
        ? col.edit(data)
      : col.edit;

      // 显示编辑表单
      if(editType){
        var input = jquery(function(){
          var inputElem = '<input class="layui-input '+ ELEM_EDIT +'" lay-unrow>';
          if(editType === 'textarea') {
            inputElem = '<textarea class="layui-input ' + ELEM_EDIT + '" lay-unrow></textarea>';
          }
          return inputElem;
        }());
        input[0].value = function(val) {
          return (val === undefined || val === null) ? '' : val;
        }(othis.data('content') || data[field]);
        othis.find('.'+ELEM_EDIT)[0] || othis.append(input);
        input.focus();
        e && layui.stope(e);
      }
    };

    // 单元格编辑 - 输入框内容被改变的事件
    that.layBody.on('change', '.'+ ELEM_EDIT, function(){
      var othis = jquery(this);
      var td = othis.parent();
      var value = this.value;
      var field = othis.parent().data('field');
      var index = othis.closest('tr').data('index');
      var data = table.cache[that.key][index];

      //事件回调的参数对象
      var params = commonMember.call(td[0], {
        value: value,
        field: field,
        oldValue: data[field], // 编辑前的值
        td: td,
        reedit: function(){ // 重新编辑
          setTimeout(function(){
            // 重新渲染为编辑状态
            renderGridEdit(params.td);

            // 将字段缓存的值恢复到编辑之前的值
            var obj = {};
            obj[field] = params.oldValue;
            params.update(obj);
          });
        },
        getCol: function(){ // 获取当前列的表头配置信息
          return that.col(td.data('key'));
        }
      });

      // 更新缓存中的值
      var obj = {}; //变更的键值
      obj[field] = value;
      params.update(obj);

      // 执行 API 编辑事件
      layui.event.call(td[0], MOD_NAME$4, 'edit('+ filter +')', params);
    }).on('blur', '.'+ ELEM_EDIT, function(){ // 单元格编辑 - 恢复非编辑状态事件
      jquery(this).remove(); // 移除编辑状态
    });

    // 表格主体单元格触发编辑的事件
    that.layBody.on(options.editTrigger, 'td', function(e){
      renderGridEdit(this, e);
    }).on('mouseenter', 'td', function(){
      showGridExpandIcon.call(this);
    }).on('mouseleave', 'td', function(){
       showGridExpandIcon.call(this, 'hide');
    });

    // 表格合计栏单元格 hover 显示展开图标
    that.layTotal.on('mouseenter', 'td', function(){
      showGridExpandIcon.call(this);
    }).on('mouseleave', 'td', function(){
       showGridExpandIcon.call(this, 'hide');
    });
    var ELEM_GRID_DOWN = 'layui-table-grid-down';
    var showGridExpandIcon = function(hide){
      var othis = jquery(this);
      var elemCell = othis.children(ELEM_CELL);

      if(othis.data('off')) return; // 不触发事件
      if(othis.parent().hasClass(ELEM_EXPAND)) return; // 是否已为展开状态

      if(hide){
        othis.find('.layui-table-grid-down').remove();
      } else if((
        elemCell.prop('scrollWidth') > elemCell.prop('clientWidth') ||
        elemCell.find("br").length > 0
      ) && !options.lineStyle){
        if(elemCell.find('.'+ ELEM_GRID_DOWN)[0]) return;
        othis.append('<div class="'+ ELEM_GRID_DOWN +'"><i class="layui-icon layui-icon-down"></i></div>');
      }
    };
    // 展开单元格内容
    var gridExpand = function(e, expandedMode){
      var othis = jquery(this);
      var td = othis.parent();
      var key = td.data('key');
      var col = that.col(key);
      var index = td.parent().data('index');
      var elemCell = td.children(ELEM_CELL);
      var ELEM_CELL_C = 'layui-table-cell-c';
      var elemCellClose = jquery('<i class="layui-icon layui-icon-up '+ ELEM_CELL_C +'">');

      expandedMode = expandedMode || col.expandedMode || options.cellExpandedMode;

      // 展开风格
      if (expandedMode === 'tips') { // TIPS 展开风格
        that.tipsIndex = layer$1.tips([
          '<div class="layui-table-tips-main" style="margin-top: -'+ (elemCell.height() + 23) +'px;'+ function(){
            if(options.size === 'sm'){
              return 'padding: 4px 15px; font-size: 12px;';
            }
            if(options.size === 'lg'){
              return 'padding: 14px 15px;';
            }
            return '';
          }() +'">',
            elemCell.html(),
          '</div>',
          '<i class="layui-icon layui-table-tips-c layui-icon-close"></i>'
        ].join(''), elemCell[0], {
          tips: [3, ''],
          time: -1,
          anim: -1,
          maxWidth: (device$2.ios || device$2.android) ? 300 : that.elem.width()/2,
          isOutAnim: false,
          skin: 'layui-table-tips',
          success: function(layero, index){
            layero.find('.layui-table-tips-c').on('click', function(){
              layer$1.close(index);
            });
          }
        });
      } else { // 多行展开风格
        // 恢复其他已经展开的单元格
        that.elem.find('.'+ ELEM_CELL_C).trigger('click');

        // 设置当前单元格展开宽度
        that.cssRules(key, function(item){
          var width = item.style.width;
          var expandedWidth = col.expandedWidth || options.cellExpandedWidth;

          // 展开后的宽度不能小于当前宽度
          if(expandedWidth < parseFloat(width)) expandedWidth = parseFloat(width);

          elemCellClose.data('cell-width', width);
          item.style.width = expandedWidth + 'px';

          setTimeout(function(){
            that.scrollPatch(); // 滚动条补丁
          });
        });

        // 设置当前单元格展开样式
        that.setRowActive(index, ELEM_EXPAND);

        // 插入关闭按钮
        if(!elemCell.next('.'+ ELEM_CELL_C)[0]){
          elemCell.after(elemCellClose);
        }

        // 关闭展开状态
        elemCellClose.on('click', function(){
          var $this = jquery(this);
          that.setRowActive(index, [ELEM_EXPAND, ELEM_HOVER$1].join(' '), true); // 移除单元格展开样式
          that.cssRules(key, function(item){
            item.style.width =  $this.data('cell-width'); // 恢复单元格展开前的宽度
            setTimeout(function(){
              that.resize(); // 滚动条补丁
            });
          });
          $this.remove();
          // 重置单元格滚动条位置
          elemCell.scrollTop(0);
          elemCell.scrollLeft(0);
        });
      }

      othis.remove();
      layui.stope(e);
    };

    // 表格主体单元格展开事件
    that.layBody.on('click', '.'+ ELEM_GRID_DOWN, function(e){
      gridExpand.call(this, e);
    });
    // 表格合计栏单元格展开事件
    that.layTotal.on('click', '.'+ ELEM_GRID_DOWN, function(e){
      gridExpand.call(this, e, 'tips'); // 强制采用 tips 风格
    });

    // 行工具条操作事件
    var toolFn = function(type){
      var othis = jquery(this);
      var td = othis.closest('td');
      var index = othis.parents('tr').eq(0).data('index');
      // 标记当前活动行
      that.setRowActive(index);

      // 执行事件
      layui.event.call(
        this,
        MOD_NAME$4,
        (type || 'tool') + '('+ filter +')',
        commonMember.call(this, {
          event: othis.attr('lay-event'),
          getCol: function(){ // 获取当前列的表头配置信息
            return that.col(td.data('key'));
          }
        })
      );
    };

     // 行工具条单击事件
    that.layBody.on('click', '*[lay-event]', function(e){
      toolFn.call(this);
      layui.stope(e);
    }).on('dblclick', '*[lay-event]', function(e){ //行工具条双击事件
      toolFn.call(this, 'toolDouble');
      layui.stope(e);
    });

    // 同步滚动条
    that.layMain.on('scroll', function(){
      var othis = jquery(this);
      var scrollLeft = othis.scrollLeft();
      var scrollTop = othis.scrollTop();

      that.layHeader.scrollLeft(scrollLeft);
      that.layTotal.scrollLeft(scrollLeft);
      that.layFixed.find(ELEM_BODY$1).scrollTop(scrollTop);

      layer$1.close(that.tipsIndex);
    });

    var rAF = window.requestAnimationFrame || function(fn){return setTimeout(fn, 1000 / 60)};

    // 固定列滚轮事件 - 临时兼容方案
    that.layFixed.find(ELEM_BODY$1).on('mousewheel DOMMouseScroll', function(e) {
      var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail;
      var scrollTop = that.layMain.scrollTop();
      var step = 100;
      var rAFStep = 10;

      e.preventDefault();
      var cb = function(){
        if(step > 0){
          step -= rAFStep;
          scrollTop += (delta > 0 ? -rAFStep : rAFStep);
          that.layMain.scrollTop(scrollTop);
          rAF(cb);
        }
      };
      rAF(cb);
    });
  };

  /**
   * 获取元素的大小
   * @param {HTMLElement} elem - HTML 元素
   */
  Class$6.prototype.getElementSize = function(elem){
    if(!window.getComputedStyle) return;

    var style = window.getComputedStyle(elem, null);
    return {
      height: parseFloat(style.height || '0'),
      width: parseFloat(style.width || '0'),
      borderTopWidth: parseFloat(style.borderTopWidth || '0'),
      borderRightWidth: parseFloat(style.borderRightWidth || '0'),
      borderBottomWidth: parseFloat(style.borderBottomWidth || '0'),
      borderLeftWidth: parseFloat(style.borderLeftWidth || '0'),
      paddingTop: parseFloat(style.paddingTop || '0'),
      paddingRight: parseFloat(style.paddingRight || '0'),
      paddingBottom: parseFloat(style.paddingBottom || '0'),
      paddingLeft: parseFloat(style.paddingLeft || '0'),
      marginTop: parseFloat(style.marginTop || '0'),
      marginRight: parseFloat(style.marginRight || '0'),
      marginBottom: parseFloat(style.marginBottom || '0'),
      marginLeft: parseFloat(style.marginLeft || '0'),
      boxSizing: style.boxSizing
    }
  };

  /**
   * 获取元素 content 区域宽度值
   *
   * layui 内置 jQuery v1.12.4 中的 jQuery.fn.width 始终对值四舍五入(3.x 已修复),
   * 在支持 subpixel Rendering 的浏览器中渲染表格，由于列宽分配时计算值精度不足，
   * 可能会导致一些小问题(#1726)
   *
   * 这个方法使用 getComputedStyle 获取精确的宽度值进行计算，为了尽可能和以前的行为
   * 保持一致(主要是隐藏元素内渲染 table 递归获取父元素宽度 https://github.com/layui/layui/discussions/2398)，
   * 任何非预期的值，都回退到 jQuery.fn.width。未来的版本使用 ResizeObserver 时，可以直接获取表格视图元素的宽度，
   * 并移除兼容性代码
   *
   * @param {JQuery} elem - 元素的 jQuery 对象
   *
   * @see {@link https://learn.microsoft.com/zh-cn/archive/blogs/ie_cn/css-3}
   */
  Class$6.prototype.getContentWidth = function(elem){
    var that = this;

    if(
      // document
      elem[0].nodeType === 9 ||
      // IE 中 border-box 盒模型，getComputedStyle 得到的 width/height 是按照 content-box 计算出来的
      (lay.ie && elem.css('box-sizing') === 'border-box') ||
      elem.css('display') === 'none'
    ){
      return elem.width();
    }

    var size = that.getElementSize(elem[0]);

    // display: none|inline 元素，getComputedStyle 无法得到准确的 width/height
    if(typeof size === 'undefined' || !size.width){
      return elem.width();
    }else {
      return size.boxSizing === 'border-box'
        ? size.width - size.paddingLeft - size.paddingRight - size.borderLeftWidth - size.borderRightWidth
        : size.width
    }
  };

  // 全局事件
  (function(){
    // 自适应尺寸
    _WIN.on('resize', function(){
      layui.each(thisTable.that, function(){
        this.resize();
      });
    });

    // 全局点击
    _DOC.on('click', function(){
      _DOC.trigger('table.remove.tool.panel');
    });

    // 工具面板移除事件
    _DOC.on('table.remove.tool.panel', function(){
      jquery('.' + ELEM_TOOL_PANEL).remove();
    });
  })();

  // 初始化
  table.init = function(filter, settings){
    settings = settings || {};
    var that = this;
    var elemTable = typeof filter === 'object' ? filter : (
      typeof filter === 'string'
        ? jquery('table[lay-filter="'+ filter +'"]')
      : jquery(ELEM$1 + '[lay-data], '+ ELEM$1 + '[lay-options]')
    );
    var errorTips = 'Table element property lay-data configuration item has a syntax error: ';

    //遍历数据表格
    elemTable.each(function(){
      var othis = jquery(this);
      var attrData = othis.attr('lay-data');
      var tableData = lay.options(this, {
        attr: attrData ? 'lay-data' : null,
        errorText: errorTips + (attrData || othis.attr('lay-options'))
      });

      var options = jquery.extend({
        elem: this
        ,cols: []
        ,data: []
        ,skin: othis.attr('lay-skin') //风格
        ,size: othis.attr('lay-size') //尺寸
        ,even: typeof othis.attr('lay-even') === 'string' //偶数行背景
      }, table.config, settings, tableData);

      filter && othis.hide();

      //获取表头数据
      othis.find('thead>tr').each(function(i){
        options.cols[i] = [];
        jquery(this).children().each(function(ii){
          var th = jquery(this);
          var attrData = th.attr('lay-data');
          var itemData = lay.options(this, {
            attr: attrData ? 'lay-data' : null,
            errorText: errorTips + (attrData || th.attr('lay-options'))
          });

          var row = jquery.extend({
            title: th.text()
            ,colspan: parseInt(th.attr('colspan')) || 1 //列单元格
            ,rowspan: parseInt(th.attr('rowspan')) || 1 //行单元格
          }, itemData);

          options.cols[i].push(row);
        });
      });

      //缓存静态表体数据
      var trElem = othis.find('tbody>tr');

      //执行渲染
      var tableIns = table.render(options);

      //获取表体数据
      if (trElem.length && !settings.data && !tableIns.config.url) {
        var tdIndex = 0;
        table.eachCols(tableIns.config.id, function (i3, item3) {
          trElem.each(function(i1){
            options.data[i1] = options.data[i1] || {};
            var tr = jquery(this);
            var field = item3.field;
            options.data[i1][field] = tr.children('td').eq(tdIndex).html();
          });
          tdIndex++;
        });

        tableIns.reloadData({
          data: options.data
        });
      }
    });

    return that;
  };

  //记录所有实例
  thisTable.that = {}; //记录所有实例对象
  thisTable.config = {}; //记录所有实例配置项

  var eachChildCols = function (index, cols, i1, item2) {
    //如果是组合列，则捕获对应的子列
    if (item2.colGroup) {
      var childIndex = 0;
      index++;
      item2.CHILD_COLS = [];
      // 找到它的子列所在cols的下标
      var i2 = i1 + (parseInt(item2.rowspan) || 1);
      layui.each(cols[i2], function (i22, item22) {
        if (item22.parentKey) { // 如果字段信息中包含了parentKey和key信息
          if (item22.parentKey === item2.key) {
            item22.PARENT_COL_INDEX = index;
            item2.CHILD_COLS.push(item22);
            eachChildCols(index, cols, i2, item22);
          }
        } else {
          // 没有key信息以colspan数量所谓判断标准
          //如果子列已经被标注为{PARENT_COL_INDEX}，或者子列累计 colspan 数等于父列定义的 colspan，则跳出当前子列循环
          if (item22.PARENT_COL_INDEX || (childIndex >= 1 && childIndex == (item2.colspan || 1))) return;
          item22.PARENT_COL_INDEX = index;
          item2.CHILD_COLS.push(item22);
          childIndex = childIndex + (parseInt(item22.colspan > 1 ? item22.colspan : 1));
          eachChildCols(index, cols, i2, item22);
        }
      });
    }
  };

  // 遍历表头
  table.eachCols = function(id, callback, cols){
    var config = thisTable.config[id] || {};
    var arrs = [], index = 0;

    cols = jquery.extend(true, [], cols || config.cols);

    //重新整理表头结构
    layui.each(cols, function(i1, item1){
      if (i1) return true; // 只需遍历第一层
      layui.each(item1, function(i2, item2){
        eachChildCols(index, cols, i1, item2);
        if(item2.PARENT_COL_INDEX) return; //如果是子列，则不进行追加，因为已经存储在父列中
        arrs.push(item2);
      });
    });

    //重新遍历列，如果有子列，则进入递归
    var eachArrs = function(obj){
      layui.each(obj || arrs, function(i, item){
        if(item.CHILD_COLS) return eachArrs(item.CHILD_COLS);
        typeof callback === 'function' && callback(i, item);
      });
    };

    eachArrs();
  };

  // 获取表格选中状态
  table.checkStatus = function(id){
    var invalidNum = 0;
    var arr = [];
    var dataCache = [];
    var data = table.cache[id] || [];

    // 过滤禁用或已删除的数据
    layui.each(data, function(i, item){
      if(layui.type(item) === 'array' || item[table.config.disabledName]){
        invalidNum++; // 无效数据数量
        return;
      }
      if(item[table.config.checkName]){
        arr.push(table.clearCacheKey(item));
        dataCache.push(item);
      }
    });

    return {
      data: arr, // 选中的数据
      dataCache: dataCache, // 选中的原始缓存数据，包含内部特定字段
      isAll: (data.length && arr.length) ? (arr.length === (data.length - invalidNum)) : false // 是否全选
    };
  };

  // 设置行选中状态
  table.setRowChecked = function(id, opts){
    var that = getThisTable$1(id);
    if(!that) return;
    that.setRowChecked(opts);
  };

  // 获取表格当前页的所有行数据
  table.getData = function(id){
    var arr = [];
    var data = table.cache[id] || [];
    layui.each(data, function(i, item){
      if(layui.type(item) === 'array'){
        return;
      }
      arr.push(table.clearCacheKey(item));
    });
    return arr;
  };

  // 重置表格尺寸结构
  table.resize = function(id){
    // 若指定表格唯一 id，则只执行该 id 对应的表格实例
    if(id){
      var config = getThisTableConfig(id); // 获取当前实例配置项
      if(!config) return;

      getThisTable$1(id).resize();

    } else { // 否则重置所有表格实例尺寸
      layui.each(thisTable.that, function(){
        this.resize();
      });
    }
  };

  // 表格导出
  table.exportFile = function(id, data, opts){
    data = data || table.clearCacheKey(table.cache[id]);
    opts = typeof opts === 'object' ? opts : function(){
      var obj = {};
      opts && (obj.type = opts);
      return obj;
    }();

    var type = opts.type || 'csv';
    var thatTable = thisTable.that[id];
    var config = thisTable.config[id] || {};
    var textType = ({
      csv: 'text/csv',
      xls: 'application/vnd.ms-excel'
    })[type];
    var alink = document.createElement("a");

    if(device$2.ie) return hint$3.error('IE_NOT_SUPPORT_EXPORTS');

    // 处理 treeTable 数据
    var isTreeTable = config.tree && config.tree.view;
    if (isTreeTable) {
      try {
        data = jquery.extend(true, [], table.cache[id]);
        data = (function fn(data) {
          return data.reduce(function (acc, obj){
            var children = obj.children || [];
            delete obj.children;
            return acc.concat(obj, fn(children));
          }, []);
        })(Array.from(data));
      } catch (e) {}
    }

    alink.href = 'data:'+ textType +';charset=utf-8,\ufeff'+ encodeURIComponent(function(){
      var dataTitle = [];
      var dataMain = [];
      var dataTotal = [];
      var fieldsIsHide = {};

      // 表头和表体
      layui.each(data, function(i1, item1){
        var vals = [];
        if(typeof id === 'object'){ // 若 id 参数直接为表头数据
          layui.each(id, function(i, item){
            i1 == 0 && dataTitle.push(item || '');
          });
          layui.each(layui.isArray(item1) ? jquery.extend([], item1) : table.clearCacheKey(item1), function(i2, item2){
            vals.push('"'+ (item2 || '') +'"');
          });
        } else {
          table.eachCols(id, function(i3, item3){
            if(item3.ignoreExport === false || item3.field && item3.type == 'normal'){
              // 不导出隐藏列，除非设置 ignoreExport 强制导出
              if (
                (item3.hide && item3.ignoreExport !== false) ||
                item3.ignoreExport === true // 忽略导出
              ) {
                if(i1 == 0) fieldsIsHide[item3.field] = true; // 记录隐藏列
                return;
              }

              var content = item1[item3.field];
              if(content === undefined || content === null) content = '';

              i1 == 0 && dataTitle.push(item3.fieldTitle || item3.title || item3.field || '');

              // 解析内容
              content = parseTempData.call(thatTable, {
                item3: item3,
                content: content,
                tplData: item1,
                text: 'text',
                obj: {
                  td: function(field){
                    if (isTreeTable) i1 = item1['LAY_DATA_INDEX']; // 兼容 treeTable 索引
                    var td = thatTable.layBody.find('tr[data-index="'+ i1 +'"]>td');
                    return td.filter('[data-field="'+ field +'"]');
                  }
                }
              });

              // 异常处理
              content = content.replace(/"/g, '""'); // 避免内容存在「双引号」导致异常分隔
              // content += '\t'; // 加「水平制表符」 避免内容被转换格式
              content = '"'+ content +'"'; // 避免内容存在「逗号」导致异常分隔

              // 插入内容
              vals.push(content);
            }else if(item3.field && item3.type !== 'normal'){
              // https://gitee.com/layui/layui/issues/I8PHCR
              if(i1 == 0) fieldsIsHide[item3.field] = true;
            }
          });
        }
        dataMain.push(vals.join(','));
      });

      // 表合计
      thatTable && layui.each(thatTable.dataTotal, function(i, o){
        fieldsIsHide[o.field] || dataTotal.push('"' + (o.total || '') + '"');
      });

      return dataTitle.join(',') + '\r\n' + dataMain.join('\r\n') + '\r\n' + dataTotal.join(',');
    }());

    alink.download = (opts.title || config.title || 'table_'+ (config.index || '')) + '.' + type;
    document.body.appendChild(alink);
    alink.click();
    document.body.removeChild(alink);
  };

  // 获取表格配置信息
  table.getOptions = function (id) {
    return getThisTableConfig(id);
  };

  // 显示或隐藏列
  table.hideCol = function (id, cols) {
    var that = getThisTable$1(id);
    if (!that) {
      return;
    }

    if (layui.type(cols) === 'boolean') {
      // 显示全部或者隐藏全部
      that.eachCols(function (i2, item2) {
        var key = item2.key;
        var col = that.col(key);
        var parentKey = item2.parentKey;
        // 同步勾选列的 hide 值和隐藏样式
        if (col.hide != cols) {
          var hide = col.hide = cols;
          that.elem.find('*[data-key="'+ key +'"]')[
            hide ? 'addClass' : 'removeClass'
            ](HIDE$1);
          // 根据列的显示隐藏，同步多级表头的父级相关属性值
          that.setParentCol(hide, parentKey);
        }
      });
    } else {
      cols = layui.isArray(cols) ? cols : [cols];
      layui.each(cols, function (i1, item1) {
        that.eachCols(function (i2, item2) {
          if (item1.field === item2.field) {
            var key = item2.key;
            var col = that.col(key);
            var parentKey = item2.parentKey;
            // 同步勾选列的 hide 值和隐藏样式
            if ('hide' in item1 && col.hide != item1.hide) {
              var hide = col.hide = !!item1.hide;
              that.elem.find('*[data-key="'+ key +'"]')[
                hide ? 'addClass' : 'removeClass'
                ](HIDE$1);
              // 根据列的显示隐藏，同步多级表头的父级相关属性值
              that.setParentCol(hide, parentKey);
            }
          }
        });
      });
    }
    jquery('.' + ELEM_TOOL_PANEL).remove(); // 关闭字段筛选面板如果打开的话
    // 重新适配尺寸
    that.resize();
  };

  // 重载
  table.reload = function(id, options, deep, type){
    var config = getThisTableConfig(id); //获取当前实例配置项
    if(!config) return;

    var that = getThisTable$1(id);
    that.reload(options, deep, type);

    return thisTable.call(that);
  };

  // 仅重载数据
  table.reloadData = function(){
    var args = jquery.extend([], arguments);
    args[3] = 'reloadData';

    // 重载时，影响整个结构的参数，不适合更新的参数
    var dataParams = new RegExp('^('+ [
      'elem', 'id', 'cols', 'width', 'height', 'maxHeight',
      'toolbar', 'defaultToolbar',
      'className', 'css', 'pagebar'
    ].join('|') + ')$');

    // 过滤与数据无关的参数
    layui.each(args[1], function (key, value) {
      if(dataParams.test(key)){
        delete args[1][key];
      }
    });

    return table.reload.apply(null, args);
  };

  // 核心入口
  table.render = function(options){
    var inst = new Class$6(options);
    return thisTable.call(inst);
  };

  // 清除临时 Key
  table.clearCacheKey = function(data){
    data = jquery.extend({}, data);
    delete data[table.config.checkName];
    delete data[table.config.indexName];
    delete data[table.config.initIndexName];
    delete data[table.config.numbersName];
    delete data[table.config.disabledName];
    return data;
  };

  // 自动完成渲染
  jquery(function(){
    table.init();
  });

/**
 * layui.treeTable
 * 树表组件
 */


  var hint$2 = layui.hint();

  // api
  var treeTable = {
    config: {},
    // 事件
    on: table.on,
    // 遍历字段
    eachCols: table.eachCols,
    index: table.index,
    set: function (options) {
      var that = this;
      that.config = jquery.extend({}, that.config, options);
      return that;
    },
    resize: table.resize,
    getOptions: table.getOptions,
    hideCol: table.hideCol,
    renderData: table.renderData
  };

  // 操作当前实例
  var thisTreeTable = function () {
    var that = this;
    var options = that.config;
    var id = options.id || options.index;

    return {
      config: options,
      reload: function (options, deep) {
        that.reload.call(that, options, deep);
      },
      reloadData: function (options, deep) {
        treeTable.reloadData(id, options, deep);
      }
    }
  };

  /**
   * 获取当前实例
   * @param {string} id 表格id
   * @returns {Class}
   */
  var getThisTable = function (id) {
    var that = thisTreeTable.that[id];
    if (!that) hint$2.error(id ? ('The treeTable instance with ID \'' + id + '\' not found') : 'ID argument required');
    return that || null;
  };
  var MOD_ID = 'lay-table-id';
  var HIDE = 'layui-hide';

  var ELEM_VIEW$1 = '.layui-table-view';
  var ELEM_BODY = '.layui-table-body';
  var ELEM_MAIN$1 = '.layui-table-main';
  var ELEM_FIXL = '.layui-table-fixed-l';
  var ELEM_FIXR = '.layui-table-fixed-r';
  var ELEM_CHECKED = 'layui-table-checked';

  var TABLE_TREE = 'layui-table-tree';
  var LAY_DATA_INDEX = 'LAY_DATA_INDEX';
  var LAY_DATA_INDEX_HISTORY = 'LAY_DATA_INDEX_HISTORY';
  var LAY_PARENT_INDEX = 'LAY_PARENT_INDEX';
  var LAY_CHECKBOX_HALF = 'LAY_CHECKBOX_HALF';
  var LAY_EXPAND = 'LAY_EXPAND';
  var LAY_HAS_EXPANDED = 'LAY_HAS_EXPANDED';
  var LAY_ASYNC_STATUS = 'LAY_ASYNC_STATUS';
  var LAY_CASCADE = ['all', 'parent', 'children', 'none'];
  var HTML_TAG_RE = /<[^>]+?>/;
  var ICON_PROPS = ['flexIconClose', 'flexIconOpen', 'iconClose', 'iconOpen', 'iconLeaf', 'icon'];

  /**
   * 构造器
   * @class
   */
  var Class$5 = function (options) {
    var that = this;
    that.index = ++treeTable.index;
    that.config = jquery.extend(true, {}, that.config, treeTable.config, options);
    // 处理一些属性
    that.init();
    that.render();
  };

  var updateCache = function (id, childrenKey, data) {
    var tableCache = table.cache[id];
    layui.each(data || tableCache, function (index, item) {
      var itemDataIndex = item[LAY_DATA_INDEX] || '';
      if (itemDataIndex.indexOf('-') !== -1) {
        tableCache[itemDataIndex] = item;
      }
      item[childrenKey] && updateCache(id, childrenKey, item[childrenKey]);
    });
  };

  var updateOptions = function (id, options, reload) {
    var that = getThisTable(id);
    reload === 'reloadData' || (that.status = { // 用于记录一些状态信息
      expand: {} // 折叠状态
    });
    var thatOptionsTemp = jquery.extend(true, {}, that.getOptions(), options);
    var treeOptions = thatOptionsTemp.tree;
    var childrenKey = treeOptions.customName.children;
    var idKey = treeOptions.customName.id;
    // 处理属性
    delete options.hasNumberCol;
    delete options.hasChecboxCol;
    delete options.hasRadioCol;
    table.eachCols(null, function (i1, item1) {
      if (item1.type === 'numbers') {
        options.hasNumberCol = true;
      } else if (item1.type === 'checkbox') {
        options.hasChecboxCol = true;
      } else if (item1.type === 'radio') {
        options.hasRadioCol = true;
      }
    }, thatOptionsTemp.cols);

    var parseData = options.parseData;
    var done = options.done;

    // treeTable重载数据时，会先加载显示顶层节点，然后根据重载数据前的子节点展开状态，展开相应的子节点，
    // 那么如果重载数据前有滚动条滚动在某个位子，重新加载时顶层节点如果比较少，只显示顶层节点时没有滚动条的情况下，
    // 自动展开子节点后，滚动条就会显示在顶部，无法保持在重载数据之前的位置。
    // 处理保持滚动条的问题，重载数据前记录滚动条的位置
    if(reload === 'reloadData' && thatOptionsTemp.scrollPos === 'fixed'){
      that.scrollTopCache = that.config.elem.next().find(ELEM_BODY).scrollTop();
    }

    if (thatOptionsTemp.url) {
      // 异步加载的时候需要处理parseData进行转换
      if (!reload || (reload && parseData && !parseData.mod)) {
        options.parseData = function () {
          var parseDataThat = this;
          var args = arguments;
          var retData = args[0];
          if (layui.type(parseData) === 'function') {
            retData = parseData.apply(parseDataThat, args) || args[0];
          }
          var dataName = parseDataThat.response.dataName;
          // 处理 isSimpleData
          if (treeOptions.data.isSimpleData && !treeOptions.async.enable) { // 异步加载和 isSimpleData 不应该一起使用
            retData[dataName] = that.flatToTree(retData[dataName]);
          }
          // 处理节点状态
          updateStatus(retData[dataName], function (item) {
            item[LAY_EXPAND] = LAY_EXPAND in item ? item[LAY_EXPAND] : (item[idKey] !== undefined && that.status.expand[item[idKey]]);
          }, childrenKey);

          if (parseDataThat.autoSort && parseDataThat.initSort && parseDataThat.initSort.type) {
            layui.sort(retData[dataName], parseDataThat.initSort.field, parseDataThat.initSort.type === 'desc', true);
          }

          that.initData(retData[dataName]);

          return retData;
        };
        options.parseData.mod = true;
      }
    } else {
      if(options.data !== undefined){
        options.data = options.data || [];
        // 处理 isSimpleData
        if (treeOptions.data.isSimpleData) {
          options.data = that.flatToTree(options.data);
        }
        that.initData(options.data);
      }
    }

    if (!reload || (reload && done && !done.mod)) {
      options.done = function () {
        var args = arguments;
        var doneThat = this;
        // undefined: 初始 render 或 reload，两者本质没有区别可以不做区分
        // 'reloadData': 重载数据
        // 'renderData': 重新渲染数据
        var renderType = args[3];
        var isRenderData = renderType === 'renderData';
        if (!isRenderData) {
          delete that.isExpandAll;
        }

        var tableView = this.elem.next();
        that.updateStatus(null, {
          LAY_HAS_EXPANDED: false // 去除已经打开过的状态
        });
        // 更新cache中的内容 将子节点也存到cache中
        updateCache(id, childrenKey);
        // 更新全选框的状态
        var layTableAllChooseElem = tableView.find('[name="layTableCheckbox"][lay-filter="layTableAllChoose"]');
        if (layTableAllChooseElem.length) {
          var checkStatus = treeTable.checkStatus(id);
          layTableAllChooseElem.prop({
            checked: checkStatus.isAll && checkStatus.data.length,
            indeterminate: !checkStatus.isAll && checkStatus.data.length
          });
        }
        if (!isRenderData && thatOptionsTemp.autoSort && thatOptionsTemp.initSort && thatOptionsTemp.initSort.type) {
          treeTable.sort(id);
        }

        that.renderTreeTable(tableView);

        // 恢复滚动条位置
        if(renderType === 'reloadData' && doneThat.scrollPos === 'fixed'){
          tableView.find(ELEM_BODY).scrollTop(that.scrollTopCache);
        }

        if (layui.type(done) === 'function') {
          return done.apply(doneThat, args);
        }
      };
      options.done.mod = true;
    }

    // 处理图标
    if(options && options.tree && options.tree.view){
      layui.each(ICON_PROPS, function(i, iconProp){
        if(options.tree.view[iconProp] !== undefined){
          options.tree.view[iconProp] = that.normalizedIcon(options.tree.view[iconProp]);
        }
      });
    }
  };

  Class$5.prototype.init = function () {
    var that = this;
    var options = that.config;
    var cascade = options.tree.data.cascade;
    if (LAY_CASCADE.indexOf(cascade) === -1) {
      options.tree.data.cascade = 'all'; // 超出范围的都重置为全联动
    }

    // 先初始一个空的表格以便拿到对应的表格实例信息
    var tableIns = table.render(jquery.extend({}, options, {
      data: [],
      url: '',
      done: null
    }));
    var id = tableIns.config.id;
    thisTreeTable.that[id] = that; // 记录当前实例对象
    that.tableIns = tableIns;

    updateOptions(id, options);
  };

  // 初始默认配置
  Class$5.prototype.config = {
    tree: {
      customName: {
        children: "children", // 节点数据中保存子节点数据的属性名称
        isParent: "isParent", // 节点数据保存节点是否为父节点的属性名称
        name: "name", // 节点数据保存节点名称的属性名称
        id: "id", // 唯一标识的属性名称
        pid: "parentId", // 父节点唯一标识的属性名称
        icon: "icon" // 图标的属性名称
      },
      view: {
        indent: 14, // 层级缩进量
        flexIconClose: '<i class="layui-icon layui-icon-triangle-r"></i>', // 关闭时候的折叠图标
        flexIconOpen: '<i class="layui-icon layui-icon-triangle-d"></i>', // 打开时候的折叠图标
        showIcon: true, // 是否显示图标(节点类型图标)
        icon: '', // 节点图标，如果设置了这个属性或者数据中有这个字段信息，不管打开还是关闭都以这个图标的值为准
        iconClose: '<i class="layui-icon layui-icon-folder"></i>', // 关闭时候的图标
        iconOpen: '<i class="layui-icon layui-icon-folder-open"></i>', // 打开时候的图标
        iconLeaf: '<i class="layui-icon layui-icon-leaf"></i>', // 叶子节点的图标
        showFlexIconIfNotParent: false, // 当节点不是父节点的时候是否显示折叠图标
        dblClickExpand: true, // 双击节点时，是否自动展开父节点的标识
        expandAllDefault: false // 默认展开所有节点
      },
      data: {
        isSimpleData: false, // 是否简单数据模式
        rootPid: null, // 根节点的父 ID 值
        cascade: 'all' // 级联方式 默认全部级联：all 可选 级联父 parent 级联子 children
      },
      async: {
        enable: false, // 是否开启异步加载模式，只有开启的时候其他参数才起作用
        url: '', // 异步加载的接口，可以根据需要设置与顶层接口不同的接口，如果相同可以不设置该参数
        type: null, // 请求的接口类型，设置可缺省同上
        contentType: null, // 提交参数的数据类型，设置可缺省同上
        headers: null, // 设置可缺省同上
        where: null, // 设置可缺省同上
        autoParam: [] // 自动参数
      },
      callback: {
        beforeExpand: null, // 展开前的回调 return false 可以阻止展开的动作
        onExpand: null // 展开之后的回调
      }
    },
  };

  Class$5.prototype.normalizedIcon = function(iconStr){
    return iconStr
      ? HTML_TAG_RE.test(iconStr) ? iconStr : '<i class="' + iconStr +'"></i>'
      : ''
  };

  Class$5.prototype.getOptions = function () {
    var that = this;
    if (that.tableIns) {
      return table.getOptions(that.tableIns.config.id); // 获取表格的实时配置信息
    } else {
      return that.config;
    }
  };

  function flatToTree(flatArr, idKey, pIdKey, childrenKey, rootPid) {
    idKey = idKey || 'id';
    pIdKey = pIdKey || 'parentId';
    childrenKey = childrenKey || 'children';
    // 创建一个空的 map 对象，用于保存所有的节点
    var map = {};
    var rootNodes = [];

    var idTemp = '';
    var pidTemp = '';
    layui.each(flatArr, function(index, item){
      idTemp = idKey + item[idKey];
      pidTemp = idKey + item[pIdKey];

      // 将节点存入 map 对象
      if(!map[idTemp]){
        map[idTemp] = {};
        map[idTemp][childrenKey] = [];
      }

      // 合并节点
      var tempObj = {};
      tempObj[childrenKey] = map[idTemp][childrenKey];
      map[idTemp] = jquery.extend({}, item, tempObj);

      var isRootNode = (rootPid ? map[idTemp][pIdKey] === rootPid : !map[idTemp][pIdKey]);
      if(isRootNode){
        rootNodes.push(map[idTemp]);
      }else {
        if(!map[pidTemp]){
          map[pidTemp] = {};
          map[pidTemp][childrenKey] = [];
        }
        map[pidTemp][childrenKey].push(map[idTemp]);
      }
    });

    return rootNodes;
  }

  Class$5.prototype.flatToTree = function (tableData) {
    var that = this;
    var options = that.getOptions();
    var treeOptions = options.tree;
    var customName = treeOptions.customName;
    var tableId = options.id;

    tableData = tableData || table.cache[tableId];

    return flatToTree(tableData, customName.id, customName.pid, customName.children, treeOptions.data.rootPid)
  };

  Class$5.prototype.treeToFlat = function (tableData, parentId, parentIndex) {
    var that = this;
    var options = that.getOptions();
    var treeOptions = options.tree;
    var customName = treeOptions.customName;
    var childrenKey = customName.children;
    var pIdKey = customName.pid;

    var flat = [];
    layui.each(tableData, function (i1, item1) {
      var dataIndex = (parentIndex ? parentIndex + '-' : '') + i1;
      var dataNew = jquery.extend({}, item1);

      dataNew[pIdKey] = typeof item1[pIdKey] !== 'undefined' ? item1[pIdKey] : parentId;
      flat.push(dataNew);
      flat = flat.concat(that.treeToFlat(item1[childrenKey], item1[customName.id], dataIndex));
    });

    return flat;
  };

  // 通过当前行数据返回 treeNode 信息
  Class$5.prototype.getTreeNode = function (data) {
    var that = this;
    if (!data) {
      return hint$2.error('找不到节点数据');
    }
    var options = that.getOptions();
    var treeOptions = options.tree;
    options.id;
    treeOptions.customName;

    // 带上一些常用的方法
    return {
      data: data,
      dataIndex: data[LAY_DATA_INDEX],
      getParentNode: function () {
        return that.getNodeByIndex(data[LAY_PARENT_INDEX])
      },
    };
  };

  // 通过 index 返回节点信息
  Class$5.prototype.getNodeByIndex = function (index) {
    var that = this;
    var treeNodeData = that.getNodeDataByIndex(index);
    if (!treeNodeData) {
      return hint$2.error('找不到节点数据');
    }
    var options = that.getOptions();
    var treeOptions = options.tree;
    var customName = treeOptions.customName;
    customName.parent;
    var tableId = options.id;

    var treeNode = {
      data: treeNodeData,
      dataIndex: treeNodeData[LAY_DATA_INDEX],
      getParentNode: function () {
        return that.getNodeByIndex(treeNodeData[LAY_PARENT_INDEX])
      },
      update: function (data) {
        return treeTable.updateNode(tableId, index, data)
      },
      remove: function () {
        return treeTable.removeNode(tableId, index)
      },
      expand: function (opts) {
        return treeTable.expandNode(tableId, jquery.extend({}, opts, {
          index: index
        }))
      },
      setChecked: function (opts) {
        return treeTable.setRowChecked(tableId, jquery.extend({}, opts, {
          index: index
        }))
      }
    };

    treeNode.dataIndex = index;
    return treeNode;
  };

  // 通过 id 获取节点信息
  Class$5.prototype.getNodeById = function (id) {
    var that = this;
    var options = that.getOptions();
    var treeOptions = options.tree;
    var customName = treeOptions.customName;
    var idKey = customName.id;

    // 通过 id 拿到数据的 dataIndex
    var dataIndex = '';
    var tableDataFlat = treeTable.getData(options.id, true);
    layui.each(tableDataFlat, function (i1, item1) {
      if (item1[idKey] === id) {
        dataIndex = item1[LAY_DATA_INDEX];
        return true;
      }
    });
    if (!dataIndex) {
      return;
    }

    // 用 index
    return that.getNodeByIndex(dataIndex);
  };

  // 通过 index 获取节点数据
  Class$5.prototype.getNodeDataByIndex = function (index, clone, newValue) {
    var that = this;
    var options = that.getOptions();
    var treeOptions = options.tree;
    var tableId = options.id;
    var tableCache = table.cache[tableId];

    // 获取当前行中的数据
    var dataCache = tableCache[index];

    // 若非删除操作，则返回合并后的数据
    if (newValue !== 'delete' && dataCache) {
      jquery.extend(dataCache, newValue);
      return clone ? jquery.extend({}, dataCache) : dataCache;
    }

    // 删除操作
    var dataRet = tableCache;
    var indexArr = String(index).split('-');

    // if (options.url || indexArr.length > 1) tableCache = null // 只有在删除根节点的时候才需要处理

    // 根据 index 进行数据处理
    for (var i = 0, childrenKey = treeOptions.customName.children; i < indexArr.length; i++) {
      if (newValue && i === indexArr.length - 1) {
        if (newValue === 'delete') { // 删除并返回当前数据
          // 同步 cache --- 此段代码注释缘由：data 属性模式造成数据重复执行 splice (@Gitee: #I7Z0A/I82E2S)
          /*if (tableCache) {
            layui.each(tableCache, function (i1, item1) {
              if (item1[LAY_DATA_INDEX] === index) {
                tableCache.splice(i1, 1);
                return true;
              }
            })
          }*/
          return (i ? dataRet[childrenKey] : dataRet).splice(indexArr[i], 1)[0];
        } else { // 更新值
          jquery.extend((i ? dataRet[childrenKey] : dataRet)[indexArr[i]], newValue);
        }
      }
      dataRet = i ? dataRet[childrenKey][indexArr[i]] : dataRet[indexArr[i]];
    }
    return clone ? jquery.extend({}, dataRet) : dataRet;
  };

  treeTable.getNodeDataByIndex = function (id, index) {
    var that = getThisTable(id);
    if(!that) return;
    return that.getNodeDataByIndex(index, true);
  };

  Class$5.prototype.initData = function (data, parentIndex) {
    var that = this;
    var options = that.getOptions();
    var treeOptions = options.tree;
    var tableId = options.id;

    data = data || that.getTableData();

    var customName = treeOptions.customName;
    var isParentKey = customName.isParent;
    var childrenKey = customName.children;

    var update = function(data, parentIndex){
      layui.each(data, function (i1, item1) {
        if (!(isParentKey in item1)) {
          item1[isParentKey] = !!(item1[childrenKey] && item1[childrenKey].length);
        }
        item1[LAY_DATA_INDEX_HISTORY] = item1[LAY_DATA_INDEX];
        item1[LAY_PARENT_INDEX] = parentIndex = parentIndex || '';
        var dataIndex = item1[LAY_DATA_INDEX] = (parentIndex ? parentIndex + '-' : '') + i1;
        update(item1[childrenKey] || [], dataIndex);
      });
    };

    update(data, parentIndex);

    updateCache(tableId, childrenKey, data);

    return data;
  };

  // 与 tableId 有关带防抖的方法
  var debounceFn = (function () {
    var fn = {};
    return function (tableId, func, wait) {
      if (!fn[tableId]) {
        fn[tableId] = layui.debounce(func, wait);
      }
      return fn[tableId];
    }
  })();

  // 优化参数，添加一个 getNodeByIndex 方法 只传 表格id 和行 dataIndex 分几步优化 todo
  var expandNode = function (treeNode, expandFlag, sonSign, focus, callbackFlag, done) {
    // treeNode // 需要展开的节点
    var trElem = treeNode.trElem;
    var tableViewElem = treeNode.tableViewElem || trElem.closest(ELEM_VIEW$1);
    var tableId = treeNode.tableId || tableViewElem.attr(MOD_ID);
    var options = treeNode.options || table.getOptions(tableId);
    var dataIndex = treeNode.dataIndex || trElem.attr('lay-data-index'); // 可能出现多层
    var treeTableThat = getThisTable(tableId);

    var treeOptions = options.tree || {};
    var customName = treeOptions.customName || {};
    var isParentKey = customName.isParent;

    var trData = treeTableThat.getNodeDataByIndex(dataIndex);

    // 后续调优：对已经展开的节点进行展开和已经关闭的节点进行关闭应该做优化减少不必要的代码执行 todo
    var isToggle = layui.type(expandFlag) !== 'boolean';
    var trExpand = isToggle ? !trData[LAY_EXPAND] : expandFlag;
    var retValue = trData[isParentKey] ? trExpand : null;

    if (callbackFlag && trExpand != trData[LAY_EXPAND] && (!trData[LAY_ASYNC_STATUS] || trData[LAY_ASYNC_STATUS] === 'local')) {
      var beforeExpand = treeOptions.callback.beforeExpand;
      if (layui.type(beforeExpand) === 'function') {
        if (beforeExpand(tableId, trData, expandFlag) === false) {
          return retValue;
        }
      }
    }

    var trExpanded = trData[LAY_HAS_EXPANDED]; // 展开过，包括异步加载

    // 找到表格中的同类节点（需要找到lay-data-index一致的所有行）
    var trsElem = tableViewElem.find('tr[lay-data-index="' + dataIndex + '"]');
    var flexIconElem = trsElem.find('.layui-table-tree-flexIcon');
    treeTableThat.updateNodeIcon({
      scopeEl: trsElem,
      isExpand: trExpand,
      isParent: trData[isParentKey]
    });
    trData[LAY_EXPAND] = trExpand;
    var trDataId = trData[customName.id];
    trDataId !== undefined && (treeTableThat.status.expand[trDataId] = trExpand);
    if (retValue === null) {
      return retValue;
    }

    var childNodes = trData[customName.children] || [];
    // 处理子节点展示与否
    if (trExpand) {
      // 展开
      if (trExpanded) { // 已经展开过
        if (!childNodes.length) return ;//异步如果子节点没有数据情况下双点行展开所有已展开的节点问题解决
        trsElem.nextAll(childNodes.map(function (value, index, array) {
          return 'tr[lay-data-index="' + value[LAY_DATA_INDEX] + '"]'
        }).join(',')).removeClass(HIDE);
        layui.each(childNodes, function (i1, item1) {
          if (!item1[isParentKey]) {
            return;
          }

          if (sonSign && !isToggle && !item1[LAY_EXPAND]) { // 非状态切换的情况下
            // 级联展开子节点
            expandNode({
              dataIndex: item1[LAY_DATA_INDEX],
              trElem: tableViewElem.find('tr[lay-data-index="' + item1[LAY_DATA_INDEX] + '"]').first(),
              tableViewElem: tableViewElem,
              tableId: tableId,
              options: options,
            }, expandFlag, sonSign, focus, callbackFlag, done);
          } else if (item1[LAY_EXPAND]) { // 初始化级联展开
            expandNode({
              dataIndex: item1[LAY_DATA_INDEX],
              trElem: tableViewElem.find('tr[lay-data-index="' + item1[LAY_DATA_INDEX] + '"]').first(),
              tableViewElem: tableViewElem,
              tableId: tableId,
              options: options,
            }, true, undefined, undefined, undefined, done);
          }
        });
      } else {
        var asyncSetting = treeOptions.async || {};
        var asyncUrl = asyncSetting.url || options.url;
        if (asyncSetting.enable && trData[isParentKey] && (!trData[LAY_ASYNC_STATUS] || trData[LAY_ASYNC_STATUS] === 'error')) {
          trData[LAY_ASYNC_STATUS] = 'loading';
          flexIconElem.html('<i class="layui-icon layui-icon-loading layui-anim layui-anim-loop layui-anim-rotate"></i>');

          // 异步获取子节点数据成功之后处理方法
          var asyncSuccessFn = function (data) {
            trData[LAY_ASYNC_STATUS] = 'success';
            trData[customName.children] = data;
            treeTableThat.initData(trData[customName.children], trData[LAY_DATA_INDEX]);
            expandNode(treeNode, true, isToggle ? false : sonSign, focus, callbackFlag, done);
          };

          var format = asyncSetting.format; // 自定义数据返回方法
          if (layui.type(format) === 'function') {
            format(trData, options, asyncSuccessFn);
            return retValue;
          }

          var params = {};
          // 参数
          var data = jquery.extend(params, asyncSetting.where || options.where);
          var asyncAutoParam = asyncSetting.autoParam;
          layui.each(asyncAutoParam, function (index, item) {
            var itemArr = item.split('=');
            data[itemArr[0].trim()] = trData[(itemArr[1] || itemArr[0]).trim()];
          });

          var asyncContentType = asyncSetting.contentType || options.contentType;
          if (asyncContentType && asyncContentType.indexOf("application/json") == 0) { // 提交 json 格式
            data = JSON.stringify(data);
          }
          var asyncType = asyncSetting.method || options.method;
          var asyncDataType = asyncSetting.dataType || options.dataType;
          var asyncJsonpCallback = asyncSetting.jsonpCallback || options.jsonpCallback;
          var asyncHeaders = asyncSetting.headers || options.headers;
          var asyncParseData = asyncSetting.parseData || options.parseData;
          var asyncResponse = asyncSetting.response || options.response;

          jquery.ajax({
            type: asyncType || 'get',
            url: asyncUrl,
            contentType: asyncContentType,
            data: data,
            dataType: asyncDataType || 'json',
            jsonpCallback: asyncJsonpCallback,
            headers: asyncHeaders || {},
            success: function (res) {
              // 若有数据解析的回调，则获得其返回的数据
              if (typeof asyncParseData === 'function') {
                res = asyncParseData.call(options, res) || res;
              }
              // 检查数据格式是否符合规范
              if (res[asyncResponse.statusName] != asyncResponse.statusCode) {
                trData[LAY_ASYNC_STATUS] = 'error';
                trData[LAY_EXPAND] = false;
                // 异常处理 todo
                flexIconElem.html('<i class="layui-icon layui-icon-refresh"></i>');
                // 事件
              } else {
                // 正常返回
                asyncSuccessFn(res[asyncResponse.dataName]);
              }
            },
            error: function (e, msg) {
              trData[LAY_ASYNC_STATUS] = 'error';
              trData[LAY_EXPAND] = false;
              // 异常处理 todo
              typeof options.error === 'function' && options.error(e, msg);
            }
          });
          return retValue;
        }
        trExpanded = trData[LAY_HAS_EXPANDED] = true;
        if (childNodes.length) {
          // 判断是否需要排序
          if (options.initSort && (!options.url || options.autoSort)) {
            var initSort = options.initSort;
            if (initSort.type) {
              layui.sort(childNodes, initSort.field, initSort.type === 'desc', true);
            } else {
              // 恢复默认
              layui.sort(childNodes, table.config.indexName, null, true);
            }
          }
          treeTableThat.initData(trData[customName.children], trData[LAY_DATA_INDEX]);
          // 将数据通过模板得出节点的html代码
          var str2 = table.getTrHtml(tableId, childNodes, null, null, dataIndex);

          var str2Obj = {
            trs: jquery(str2.trs.join('')),
            trs_fixed: jquery(str2.trs_fixed.join('')),
            trs_fixed_r: jquery(str2.trs_fixed_r.join(''))
          };
          var dataLevel = dataIndex.split('-').length - 1;
          var dataLevelNew = (dataLevel || 0) + 1;
          layui.each(childNodes, function (childIndex, childItem) {
            str2Obj.trs.eq(childIndex).attr({
              'data-index': childItem[LAY_DATA_INDEX],
              'lay-data-index': childItem[LAY_DATA_INDEX],
              'data-level': dataLevelNew
            }).data('index', childItem[LAY_DATA_INDEX]);

            str2Obj.trs_fixed.eq(childIndex).attr({
              'data-index': childItem[LAY_DATA_INDEX],
              'lay-data-index': childItem[LAY_DATA_INDEX],
              'data-level': dataLevelNew
            }).data('index', childItem[LAY_DATA_INDEX]);

            str2Obj.trs_fixed_r.eq(childIndex).attr({
              'data-index': childItem[LAY_DATA_INDEX],
              'lay-data-index': childItem[LAY_DATA_INDEX],
              'data-level': dataLevelNew
            }).data('index', childItem[LAY_DATA_INDEX]);
          });

          tableViewElem.find(ELEM_MAIN$1).find('tbody tr[lay-data-index="' + dataIndex + '"]').after(str2Obj.trs);
          tableViewElem.find(ELEM_FIXL).find('tbody tr[lay-data-index="' + dataIndex + '"]').after(str2Obj.trs_fixed);
          tableViewElem.find(ELEM_FIXR).find('tbody tr[lay-data-index="' + dataIndex + '"]').after(str2Obj.trs_fixed_r);

          // 初始化新增的节点中的内容
          treeTableThat.renderTreeTable(str2Obj.trs, dataLevelNew);

          if (sonSign && !isToggle) { // 非状态切换的情况下
            // 级联展开/关闭子节点
            layui.each(childNodes, function (i1, item1) {
              expandNode({
                dataIndex: item1[LAY_DATA_INDEX],
                trElem: tableViewElem.find('tr[lay-data-index="' + item1[LAY_DATA_INDEX] + '"]').first(),
                tableViewElem: tableViewElem,
                tableId: tableId,
                options: options,
              }, expandFlag, sonSign, focus, callbackFlag, done);
            });
          }
        }
      }
    } else {
      treeTableThat.isExpandAll = false;
      // 关闭
      if (sonSign && !isToggle) { // 非状态切换的情况下
        layui.each(childNodes, function (i1, item1) {
          expandNode({
            dataIndex: item1[LAY_DATA_INDEX],
            trElem: tableViewElem.find('tr[lay-data-index="' + item1[LAY_DATA_INDEX] + '"]').first(),
            tableViewElem: tableViewElem,
            tableId: tableId,
            options: options,
          }, expandFlag, sonSign, focus, callbackFlag, done);
        });
        tableViewElem.find(childNodes.map(function (value, index, array) { // 只隐藏直接子节点，其他由递归的处理
          return 'tr[lay-data-index="' + value[LAY_DATA_INDEX] + '"]'
        }).join(',')).addClass(HIDE);
      } else {
        var childNodesFlat = treeTableThat.treeToFlat(childNodes, trData[customName.id], dataIndex);
        tableViewElem.find(childNodesFlat.map(function (value, index, array) {
          return 'tr[lay-data-index="' + value[LAY_DATA_INDEX] + '"]'
        }).join(',')).addClass(HIDE);
      }
    }


    debounceFn('resize-' + tableId, function () {
      treeTable.resize(tableId);
    }, 0)();

    if (callbackFlag && trData[LAY_ASYNC_STATUS] !== 'loading') {
      var onExpand = treeOptions.callback.onExpand;
      layui.type(onExpand) === 'function' && onExpand(tableId, trData, trExpand);
    }

    if(layui.type(done) === 'function' && trData[LAY_ASYNC_STATUS] !== 'loading'){
      done(tableId, trData, trExpand);
    }

    return retValue;
  };

  /**
   * 展开或关闭一个节点
   * @param {String} id 树表id
   * @param {Object} opts
   * @param {Number|String} opts.index 展开行的数据下标
   * @param {Boolean} [opts.expandFlag] 展开、关闭、切换
   * @param {Boolean} [opts.inherit] 是否级联子节点
   * @param {Boolean} [opts.callbackFlag] 是否触发 tree.callback 事件
   * @param {Boolean} [opts.done] 节点操作完成后的回调函数
   * @return [{Boolean}] 状态结果
   * */
  treeTable.expandNode = function (id, opts) {
    var that = getThisTable(id);
    if (!that) return;

    opts = opts || {};

    var index = opts.index;
    var expandFlag = opts.expandFlag;
    var sonSign = opts.inherit;
    var callbackFlag = opts.callbackFlag;

    var options = that.getOptions();
    var tableViewElem = options.elem.next();
    return expandNode({
      trElem: tableViewElem.find('tr[lay-data-index="' + index + '"]').first()
    }, expandFlag, sonSign, null, callbackFlag, opts.done)
  };

  /**
   * 展开或关闭全部节点
   * @param {String} id 树表id
   * @param {Boolean} expandFlag 展开或关闭
   * */
  treeTable.expandAll = function (id, expandFlag) {
    if (layui.type(expandFlag) !== 'boolean') {
      return hint$2.error('expandAll 的展开状态参数只接收true/false')
    }

    var that = getThisTable(id);
    if (!that) return;

    that.isExpandAll = expandFlag;
    var options = that.getOptions();
    var treeOptions = options.tree;
    var tableView = options.elem.next();
    var isParentKey = treeOptions.customName.isParent;
    var idKey = treeOptions.customName.id;
    var showFlexIconIfNotParent = treeOptions.view.showFlexIconIfNotParent;

    if (!expandFlag) {
      // 关闭所有
      // 将所有已经打开的节点的状态设置为关闭，
      that.updateStatus(null, function (d) {
        if (d[isParentKey] || showFlexIconIfNotParent) {
          d[LAY_EXPAND] = false;
          d[idKey] !== undefined && (that.status.expand[d[idKey]] = false);
        }
      }); // 只处理当前页，如果需要处理全部表格，需要用treeTable.updateStatus
      // 隐藏所有非顶层的节点
      tableView.find('.layui-table-box tbody tr[data-level!="0"]').addClass(HIDE);

      tableView.find('.layui-table-tree-flexIcon').html(treeOptions.view.flexIconClose);
      treeOptions.view.showIcon && tableView
        .find('.layui-table-tree-nodeIcon:not(.layui-table-tree-iconCustom,.layui-table-tree-iconLeaf)')
        .html(treeOptions.view.iconClose);
    } else {
      var tableDataFlat = treeTable.getData(id, true);
      // 展开所有
      // 存在异步加载
      if (treeOptions.async.enable) {
        // 判断是否有未加载过的节点
        var isAllAsyncDone = true;
        layui.each(tableDataFlat, function (i1, item1) {
          if (item1[isParentKey] && !item1[LAY_ASYNC_STATUS]) {
            isAllAsyncDone = false;
            return true;
          }
        });
        // 有未加载过的节点
        if (!isAllAsyncDone) {
          // 逐个展开
          layui.each(treeTable.getData(id), function (i1, item1) {
            treeTable.expandNode(id, {
              index: item1[LAY_DATA_INDEX],
              expandFlag: true,
              inherit: true
            });
          });
          return;
        }
      }

      // 先判断是否全部打开过了
      var isAllExpanded = true;
      layui.each(tableDataFlat, function (i1, item1) {
        if (item1[isParentKey] && !item1[LAY_HAS_EXPANDED]) {
            isAllExpanded = false;
            return true;
          }
      });
      // 如果全部节点已经都打开过，就可以简单处理跟隐藏所有节点反操作
      if (isAllExpanded) {
        that.updateStatus(null, function (d) {
          if (d[isParentKey] || showFlexIconIfNotParent) {
            d[LAY_EXPAND] = true;
            d[idKey] !== undefined && (that.status.expand[d[idKey]] = true);
          }
        });
        // 显示所有子节点
        tableView.find('tbody tr[data-level!="0"]').removeClass(HIDE);
        // 处理节点的图标
        tableView.find('.layui-table-tree-flexIcon').html(treeOptions.view.flexIconOpen);
        treeOptions.view.showIcon && tableView
          .find('.layui-table-tree-nodeIcon:not(.layui-table-tree-iconCustom,.layui-table-tree-iconLeaf)')
          .html(treeOptions.view.iconOpen);
      } else {
        // 如果有未打开过的父节点，将 tr 内容全部重新生成
        that.updateStatus(null, function (d) {
          if (d[isParentKey] || showFlexIconIfNotParent) {
            d[LAY_EXPAND] = true;
            d[LAY_HAS_EXPANDED] = true;
            d[idKey] !== undefined && (that.status.expand[d[idKey]] = true);
          }
        });
        if (options.initSort && options.initSort.type && options.autoSort) {
          return treeTable.sort(id);
        }
        var trAll = table.getTrHtml(id, tableDataFlat);

        var trAllObj = {
          trs: jquery(trAll.trs.join('')),
          trs_fixed: jquery(trAll.trs_fixed.join('')),
          trs_fixed_r: jquery(trAll.trs_fixed_r.join(''))
        };
        var props;
        layui.each(tableDataFlat, function (dataIndex, dataItem) {
          var dataLevel = dataItem[LAY_DATA_INDEX].split('-').length - 1;
          props = {
            'data-index': dataItem[LAY_DATA_INDEX],
            'lay-data-index': dataItem[LAY_DATA_INDEX],
            'data-level': dataLevel
          };
          trAllObj.trs.eq(dataIndex).attr(props).data('index', dataItem[LAY_DATA_INDEX]);
          trAllObj.trs_fixed.eq(dataIndex).attr(props).data('index', dataItem[LAY_DATA_INDEX]);
          trAllObj.trs_fixed_r.eq(dataIndex).attr(props).data('index', dataItem[LAY_DATA_INDEX]);
        });
        layui.each(['main', 'fixed-l', 'fixed-r'], function (i, item) {
          tableView.find('.layui-table-' + item + ' tbody').html(trAllObj[['trs', 'trs_fixed', 'trs_fixed_r'][i]]);
        });
        that.renderTreeTable(tableView, 0, false);
      }
    }
    treeTable.resize(id);
  };

  /**
   * @typedef updateNodeIconOptions
   * @prop {JQuery} scopeEl - tr 元素
   * @prop {boolean} isExpand - 是否是展开图标
   * @prop {boolean} isParent - 是否是父节点图标
   */
  /**
   * 更新节点图标
   * @param {updateNodeIconOptions} opts
   */
  Class$5.prototype.updateNodeIcon = function(opts){
    var that = this;
    var options = that.getOptions();
    var treeOptions = options.tree || {};
    var scopeEl = opts.scopeEl;
    var isExpand = opts.isExpand;
    var isParent = opts.isParent;

    // 处理折叠按钮图标
    var flexIconElem = scopeEl.find('.layui-table-tree-flexIcon');

    flexIconElem
      .css('visibility', isParent || treeOptions.view.showFlexIconIfNotParent ? 'visible' : 'hidden')
      .html(isExpand ? treeOptions.view.flexIconOpen : treeOptions.view.flexIconClose);
    // 处理节点图标
    if(treeOptions.view.showIcon){
      var nodeIconElem = scopeEl.find('.layui-table-tree-nodeIcon:not(.layui-table-tree-iconCustom)');
      var nodeIcon = isParent
        ? (isExpand ? treeOptions.view.iconOpen : treeOptions.view.iconClose)
        : treeOptions.view.iconLeaf;

      nodeIconElem
        .toggleClass('layui-table-tree-iconLeaf', !isParent)
        .html(nodeIcon);
    }
  };

  Class$5.prototype.renderTreeTable = function (tableView, level, sonSign) {
    var that = this;
    var options = that.getOptions();
    var tableViewElem = options.elem.next();
    !tableViewElem.hasClass(TABLE_TREE) && tableViewElem.addClass(TABLE_TREE);
    var tableId = options.id;
    var treeOptions = options.tree || {};
    treeOptions.data || {};
    var treeOptionsView = treeOptions.view || {};
    var customName = treeOptions.customName || {};
    var isParentKey = customName.isParent;
    tableViewElem.attr('lay-filter');
    var treeTableThat = that;
    var existsData = options.data.length; // 是否直接赋值 data
    // var tableData = treeTableThat.getTableData();

    level = level || 0;

    if (!level) {
      // 初始化的表格里面没有level信息，可以作为顶层节点的判断
      tableViewElem.find('.layui-table-body tr:not([data-level])').attr('data-level', level);
      layui.each(table.cache[tableId], function (dataIndex, dataItem) {
        // fix: 修正直接赋值 data 时顶层节点 LAY_DATA_INDEX 值的异常问题
        if (existsData) {
          dataItem[LAY_DATA_INDEX] = String(dataIndex);
        }
        var layDataIndex = dataItem[LAY_DATA_INDEX];
        tableViewElem.find('.layui-table-main tbody tr[data-level="0"]:eq(' + dataIndex + ')').attr('lay-data-index', layDataIndex);
        tableViewElem.find('.layui-table-fixed-l tbody tr[data-level="0"]:eq(' + dataIndex + ')').attr('lay-data-index', layDataIndex);
        tableViewElem.find('.layui-table-fixed-r tbody tr[data-level="0"]:eq(' + dataIndex + ')').attr('lay-data-index', layDataIndex);
      });
    }

    var dataExpand = null; // 记录需要展开的数据
    var nameKey = customName.name;
    var indent = treeOptionsView.indent || 14;
    layui.each(tableView.find('td[data-field="' + nameKey + '"]'), function (index, item) {
      item = jquery(item);
      var trElem = item.closest('tr');
      var itemCell = item.children('.layui-table-cell');
      if (itemCell.hasClass('layui-table-tree-item')) {
        return;
      }
      var trIndex = trElem.attr('lay-data-index');
      if (!trIndex) { // 排除在统计行中的节点
        return;
      }
      trElem = tableViewElem.find('tr[lay-data-index="' + trIndex + '"]');
      var trData = treeTableThat.getNodeDataByIndex(trIndex);

      if (trData[LAY_EXPAND] && trData[isParentKey]) {
        // 需要展开
        dataExpand = dataExpand || {};
        dataExpand[trIndex] = true;
      }
      if (trData[LAY_CHECKBOX_HALF]) {
        trElem.find('input[type="checkbox"][name="layTableCheckbox"]').prop('indeterminate', true);
      }

      var htmlTemp = itemCell.html();
      itemCell = trElem.find('td[data-field="' + nameKey + '"]>div.layui-table-cell');
      itemCell.addClass('layui-table-tree-item');
      var flexIconElem = itemCell
        .html(['<div class="layui-inline layui-table-tree-flexIcon" ',
          'style="',
          'margin-left: ' + (indent * trElem.attr('data-level')) + 'px;',
          (trData[isParentKey] || treeOptionsView.showFlexIconIfNotParent) ? '' : ' visibility: hidden;',
          '">',
          trData[LAY_EXPAND] ? treeOptionsView.flexIconOpen : treeOptionsView.flexIconClose, // 折叠图标
          '</div>',
          treeOptionsView.showIcon ? '<div class="layui-inline layui-table-tree-nodeIcon' +
            ((trData[customName.icon] || treeOptionsView.icon) ? ' layui-table-tree-iconCustom' : '') +
            (trData[isParentKey] ? '' : ' layui-table-tree-iconLeaf') +
            '">' +
            (that.normalizedIcon(trData[customName.icon]) || treeOptionsView.icon ||
              (trData[isParentKey] ?
                (trData[LAY_EXPAND] ? treeOptionsView.iconOpen : treeOptionsView.iconClose) :
                treeOptionsView.iconLeaf) ||
              '') + '</div>' : '', // 区分父子节点
          htmlTemp].join('')) // 图标要可定制
        .find('.layui-table-tree-flexIcon');

      // 添加展开按钮的事件
      flexIconElem.on('click', function (event) {
        layui.stope(event);
        // 处理数据
        // var trElem = item.closest('tr');
        expandNode({trElem: trElem}, null, null, null, true);
      });
    });

    if (!level && treeOptions.view.expandAllDefault && that.isExpandAll === undefined) {
      return treeTable.expandAll(tableId, true); // 默认展开全部
    }

    // 当前层的数据看看是否需要展开
    if (sonSign !== false && dataExpand) {
      layui.each(dataExpand, function (index, item) {
        var trDefaultExpand = tableViewElem.find('tr[lay-data-index="' + index + '"]');
        trDefaultExpand.find('.layui-table-tree-flexIcon').html(treeOptionsView.flexIconOpen);
        expandNode({trElem: trDefaultExpand.first()}, true);
      });
      // #1463 expandNode 中已经展开过的节点不会重新渲染
      debounceFn('renderTreeTable2-' + tableId, function () {
        form.render(jquery('.layui-table-tree[' + MOD_ID + '="' + tableId + '"]'));
      }, 0)();
    } else {
      debounceFn('renderTreeTable-' + tableId, function () {
        options.hasNumberCol && formatNumber(that);
        form.render(jquery('.layui-table-tree[' + MOD_ID + '="' + tableId + '"]'));
      }, 0)();
    }
  };

  var formatNumber = function (that) {
    var options = that.getOptions();
    var tableViewElem = options.elem.next();

    var num = 0;
    var trMain = tableViewElem.find('.layui-table-main tbody tr');
    var trFixedL = tableViewElem.find('.layui-table-fixed-l tbody tr');
    var trFixedR = tableViewElem.find('.layui-table-fixed-r tbody tr');
    layui.each(that.treeToFlat(table.cache[options.id]), function (i1, item1) {
      if (item1['LAY_HIDE']) return;
      var itemData = that.getNodeDataByIndex(item1[LAY_DATA_INDEX]);
      itemData['LAY_NUM'] = ++num;
      trMain.eq(i1).find('.laytable-cell-numbers').html(num);
      trFixedL.eq(i1).find('.laytable-cell-numbers').html(num);
      trFixedR.eq(i1).find('.laytable-cell-numbers').html(num);
    });
  };

  // 树表渲染
  Class$5.prototype.render = function (type) {
    var that = this;
    that.tableIns = table[type === 'reloadData' ? 'reloadData' : 'reload'](that.tableIns.config.id, jquery.extend(true, {}, that.config));
    that.config = that.tableIns.config;
  };

  // 表格重载
  Class$5.prototype.reload = function (options, deep, type) {
    var that = this;

    options = options || {};
    delete that.haveInit;

    // 防止数组深度合并
    layui.each(options, function (key, item) {
      if (layui.type(item) === 'array') delete that.config[key];
    });

    // 根据需要处理options中的一些参数
    updateOptions(that.getOptions().id, options, type || true);

    // 对参数进行深度或浅扩展
    that.config = jquery.extend(deep, {}, that.config, options);

    // 执行渲染
    that.render(type);
  };

  // 仅重载数据
  treeTable.reloadData = function () {
    var args = jquery.extend(true, [], arguments);
    args[3] = 'reloadData';

    return treeTable.reload.apply(null, args);
  };

  var updateStatus = function (data, statusObj, childrenKey, notCascade) {
    var dataUpdated = [];
    layui.each(data, function (i1, item1) {
      if (layui.type(statusObj) === 'function') {
        statusObj(item1);
      } else {
        jquery.extend(item1, statusObj);
      }
      dataUpdated.push(jquery.extend({}, item1));
      notCascade || (dataUpdated = dataUpdated.concat(updateStatus(item1[childrenKey], statusObj, childrenKey, notCascade)));
    });
    return dataUpdated;
  };

  Class$5.prototype.updateStatus = function (data, statusObj, notCascade) {
    var that = this;
    var options = that.getOptions();
    var treeOptions = options.tree;
    data = data || table.cache[options.id];

    return updateStatus(data, statusObj, treeOptions.customName.children, notCascade);
  };

  Class$5.prototype.getTableData = function () {
    var that = this;
    var options = that.getOptions();
    // return options.url ? table.cache[options.id] : options.data;
    return table.cache[options.id];
  };

  treeTable.updateStatus = function (id, statusObj, data) {
    var that = getThisTable(id);
    var options = that.getOptions();
    if (!data) {
      if (options.url) {
        data = table.cache[options.id];
      } else {
        data = options.data;
      }
    }
    return that.updateStatus(data, statusObj);
  };

  treeTable.sort = function (id) {
    var that = getThisTable(id);
    if(!that) return;

    var options = that.getOptions();
    var treeOptions = options.tree;

    var tableData =  treeTable.getData(id);
    var customName = treeOptions.customName;
    var childrenKey = customName.children;

    // 只和同级节点排序
    var sort = function(data, field, type){
      layui.sort(data, field, type, true);
      layui.each(data, function(rowIndex, trData){
        sort(trData[childrenKey] || [], field, type);
      });
    };

    if (options.autoSort) {
      var initSort = options.initSort;
      if (initSort.type) {
        sort(tableData, initSort.field, initSort.type === 'desc');
      } else {
        // 恢复默认
        sort(tableData, table.config.indexName, null);
      }
      // 更新缓存中数据的顺序
      table.cache[id] = tableData;
      // 重新初始化缓存数据
      that.initData(tableData);
      treeTable.renderData(id);
    }
  };

  // 处理事件
  var updateObjParams = function (obj) {
    var tableId = obj.config.id;
    var tableThat = getThisTable(tableId);
    var trData = obj.data = treeTable.getNodeDataByIndex(tableId, obj.index); // 克隆的
    var trIndex = trData[LAY_DATA_INDEX];
    obj.dataIndex = trIndex;

    // 处理update方法
    var updateFn = obj.update;
    obj.update = function () {
      var updateThat = this;
      var args = arguments;
      jquery.extend(tableThat.getNodeDataByIndex(trIndex), args[0]);
      var ret = updateFn.apply(updateThat, args); // 主要负责更新节点内容
      var nameKey = obj.config.tree.customName.name;
      nameKey in args[0] && obj.tr.find('td[data-field="' + nameKey + '"]').children('div.layui-table-cell').removeClass('layui-table-tree-item');
      tableThat.renderTreeTable(obj.tr, obj.tr.attr('data-level'), false);
      return ret;
    };

    // 处理del方法
    obj.del = function () {
      treeTable.removeNode(tableId, trData);
    };

    // 处理setRowChecked
    obj.setRowChecked = function (checked) {
      treeTable.setRowChecked(tableId, {
        index: trData,
        checked: checked
      });
    };
  };

  // 更新数据
  treeTable.updateNode = function (id, index, newNode) {
    var that = getThisTable(id);
    if(!that) return;

    var options = that.getOptions();
    options.tree;
    var tableView = options.elem.next();
    var trElem = tableView.find('tr[lay-data-index="' + index + '"]');
    var trIndex = trElem.attr('data-index');
    var trLevel = trElem.attr('data-level');

    if (!newNode) {
      return;
    }
    // 更新值
    var newNodeTemp = that.getNodeDataByIndex(index, false, newNode);
    // 获取新的tr替换
    var trNew = table.getTrHtml(id, [newNodeTemp]);
    // 重新渲染tr
    layui.each(['main', 'fixed-l', 'fixed-r'], function (i, item) {
      tableView.find('.layui-table-' + item + ' tbody tr[lay-data-index="' + index + '"]').replaceWith(jquery(trNew[['trs', 'trs_fixed', 'trs_fixed_r'][i]].join('')).attr({
        'data-index': trIndex,
        'lay-data-index': index,
        'data-level': trLevel
      }).data('index', trIndex));
    });
    that.renderTreeTable(tableView.find('tr[lay-data-index="' + index + '"]'), trLevel);
  };

  // 删除数据
  // _keepParent 暂时为私有参数，仅供内部使用
  treeTable.removeNode = function (id, node, _keepParent) {
    var that = getThisTable(id);
    if(!that) return;

    var options = that.getOptions();
    var treeOptions = options.tree;
    var isParentKey = treeOptions.customName.isParent;
    var childrenKey = treeOptions.customName.children;
    var tableView = options.elem.next();
    var delNode;
    var indexArr = [];
    var tableCache = table.cache[id];
    delNode = that.getNodeDataByIndex(layui.type(node) === 'string' ? node : node[LAY_DATA_INDEX], false, 'delete');
    var nodeP = that.getNodeDataByIndex(delNode[LAY_PARENT_INDEX]);
    that.updateCheckStatus(nodeP);
    var delNodesFlat = that.treeToFlat([delNode], delNode[treeOptions.customName.pid], delNode[LAY_PARENT_INDEX]);
    layui.each(delNodesFlat, function (i2, delNode) {
      var delNodeDataIndex = delNode[LAY_DATA_INDEX];
      indexArr.push('tr[lay-data-index="' + delNodeDataIndex + '"]');
      // 删除临时 key
      if(delNodeDataIndex.indexOf('-') !== -1){
        delete tableCache[delNodeDataIndex];
      }
    });

    tableView.find(indexArr.join(',')).remove(); // 删除行

    var deleteCacheKey = function(){
      for (var key in tableCache) {
        // 根节点 getNodeDataByIndex 内部已处理
        if(key.indexOf('-') !== -1){
          // L93 updateCache() 中，cacheKey 取自 rowData 中的 LAY_DATA_INDEX，
          // 两者不同说明当前 cacheKey 引用的 rowData 已被更新
          if(key !== tableCache[key][LAY_DATA_INDEX]){
            delete tableCache[key];
          }
        }
      }
    };

    // 重新整理数据
    var tableData = that.initData();
    deleteCacheKey();
    // index发生变化需要更新页面tr中对应的lay-data-index 新增和删除都要注意数据结构变动之后的index问题
    layui.each(that.treeToFlat(tableData), function (i3, item3) {
      if (item3[LAY_DATA_INDEX_HISTORY] && item3[LAY_DATA_INDEX_HISTORY] !== item3[LAY_DATA_INDEX]) {
        tableView.find('tr[lay-data-index="' + item3[LAY_DATA_INDEX_HISTORY] + '"]').attr({
          'data-index': item3[LAY_DATA_INDEX],
          'lay-data-index': item3[LAY_DATA_INDEX],
        }).data('index', item3[LAY_DATA_INDEX]);
        // item3[LAY_DATA_INDEX_HISTORY] = item3[LAY_DATA_INDEX]
      }
    });
    // 重新更新顶层节点的data-index;
    layui.each(tableCache, function (i4, item4) {
      tableView.find('tr[data-level="0"][lay-data-index="' + item4[LAY_DATA_INDEX] + '"]')
        .attr('data-index', i4)
        .data('index', i4);
    });
    options.hasNumberCol && formatNumber(that);
    // 更新父节点状态
    if(nodeP){
      var trEl =  tableView.find('tr[lay-data-index="' + nodeP[LAY_DATA_INDEX] + '"]');

      if(!_keepParent){
        nodeP[isParentKey] = !!(nodeP[childrenKey] && nodeP[childrenKey].length);
      }

      that.updateNodeIcon({
        scopeEl: trEl,
        isExpand: nodeP[LAY_EXPAND],
        isParent: nodeP[isParentKey],
      });
    }

    // 重新适配尺寸
    treeTable.resize(id);
  };

  /**
   * 新增数据节点
   * @param {String} id 树表id
   * @param {Object} opts
   * @param {String|Number} opts.parentIndex 指定的父节点，如果增加根节点，请设置 parentIndex 为 null 即可
   * @param {Number} opts.index 新节点插入的位置（从 0 开始）index = -1(默认) 时，插入到最后
   * @param {Object|Array} opts.data 新增的节点，单个或者多个
   * @param {Boolean} opts.focus 新增的节点，单个或者多个
   * @return {Array} 新增的节点
   * */
  treeTable.addNodes = function (id, opts) {
    var that = getThisTable(id);
    if(!that) return;

    var options = that.getOptions();
    var treeOptions = options.tree;
    var tableViewElem = options.elem.next();
    var checkName = table.config.checkName;

    opts = opts || {};

    var parentIndex = opts.parentIndex;
    var index = opts.index;
    var newNodes = opts.data;
    var focus = opts.focus;

    parentIndex = layui.type(parentIndex) === 'number' ? parentIndex.toString() : parentIndex;
    var parentNode = parentIndex ? that.getNodeDataByIndex(parentIndex) : null;
    index = layui.type(index) === 'number' ? index : -1;

    // 添加数据
    newNodes = jquery.extend(true, [], (layui.isArray(newNodes) ? newNodes : [newNodes]));

    // 若未传入 LAY_CHECKED 属性，则继承父节点的 checked 状态
    layui.each(newNodes, function(i, item){
      if(!(checkName in item) && parentNode){
        item[checkName] = parentNode[checkName];
      }
    });

    that.getTableData(); var dataAfter;
    if (!parentNode) {
      // 添加到根节点
      dataAfter = table.cache[id].splice(index === -1 ? table.cache[id].length : index);
      table.cache[id] = table.cache[id].concat(newNodes, dataAfter);
      if (!options.url) {
        // 静态data模式
        if (!options.page) {
          options.data = table.cache[id];
        } else {
          var pageOptions = options.page;
          options.data.splice.apply(options.data, [pageOptions.limit * (pageOptions.curr - 1), pageOptions.limit].concat(table.cache[id]));
        }
      }
      // 将新节点添加到页面
      that.initData();

      if (tableViewElem.find('.layui-none').length) {
        table.renderData(id);
        return newNodes;
      }

      var newNodesHtml = table.getTrHtml(id, newNodes);
      var newNodesHtmlObj = {
        trs: jquery(newNodesHtml.trs.join('')),
        trs_fixed: jquery(newNodesHtml.trs_fixed.join('')),
        trs_fixed_r: jquery(newNodesHtml.trs_fixed_r.join(''))
      };

      var attrs = {};
      layui.each(newNodes, function (newNodeIndex, newNodeItem) {
        attrs = {
          'data-index': newNodeItem[LAY_DATA_INDEX],
          'lay-data-index': newNodeItem[LAY_DATA_INDEX],
          'data-level': '0'
        };
        newNodesHtmlObj.trs.eq(newNodeIndex).attr(attrs).data('index', newNodeItem[LAY_DATA_INDEX]);
        newNodesHtmlObj.trs_fixed.eq(newNodeIndex).attr(attrs).data('index', newNodeItem[LAY_DATA_INDEX]);
        newNodesHtmlObj.trs_fixed_r.eq(newNodeIndex).attr(attrs).data('index', newNodeItem[LAY_DATA_INDEX]);
      });
      var trIndexPrev = parseInt(newNodes[0][LAY_DATA_INDEX]) - 1;
      var tableViewElemMAIN = tableViewElem.find(ELEM_MAIN$1);
      var tableViewElemFIXL = tableViewElem.find(ELEM_FIXL);
      var tableViewElemFIXR = tableViewElem.find(ELEM_FIXR);
      if (trIndexPrev === -1) {
        // 插入到开头
        var hasTr = tableViewElemMAIN.find('tr[data-level="0"][data-index="0"]')[0];
        if(hasTr){
          tableViewElemMAIN.find('tr[data-level="0"][data-index="0"]').before(newNodesHtmlObj.trs);
          tableViewElemFIXL.find('tr[data-level="0"][data-index="0"]').before(newNodesHtmlObj.trs_fixed);
          tableViewElemFIXR.find('tr[data-level="0"][data-index="0"]').before(newNodesHtmlObj.trs_fixed_r);
        }else {
          tableViewElemMAIN.find('tbody').prepend(newNodesHtmlObj.trs);
          tableViewElemFIXL.find('tbody').prepend(newNodesHtmlObj.trs_fixed);
          tableViewElemFIXR.find('tbody').prepend(newNodesHtmlObj.trs_fixed_r);
        }
      } else {
        if (index === -1) {
          // 追加到最后
          tableViewElemMAIN.find('tbody').append(newNodesHtmlObj.trs);
          tableViewElemFIXL.find('tbody').append(newNodesHtmlObj.trs_fixed);
          tableViewElemFIXR.find('tbody').append(newNodesHtmlObj.trs_fixed_r);
        } else {
          var trIndexNext = dataAfter[0][LAY_DATA_INDEX_HISTORY];
          tableViewElemMAIN.find('tr[data-level="0"][data-index="' + trIndexNext + '"]').before(newNodesHtmlObj.trs);
          tableViewElemFIXL.find('tr[data-level="0"][data-index="' + trIndexNext + '"]').before(newNodesHtmlObj.trs_fixed);
          tableViewElemFIXR.find('tr[data-level="0"][data-index="' + trIndexNext + '"]').before(newNodesHtmlObj.trs_fixed_r);
        }

      }

      // 重新更新顶层节点的data-index;
      layui.each(table.cache[id], function (i4, item4) {
        tableViewElem.find('tr[data-level="0"][lay-data-index="' + item4[LAY_DATA_INDEX] + '"]')
          .attr('data-index', i4)
          .data('index', i4);
      });

      that.renderTreeTable(tableViewElem.find(newNodes.map(function (value, index, array) {
        return 'tr[lay-data-index="' + value[LAY_DATA_INDEX] + '"]'
      }).join(',')));
    } else {
      var isParentKey = treeOptions.customName.isParent;
      var childKey = treeOptions.customName.children;

      parentNode[isParentKey] = true;
      var childrenNodes = parentNode[childKey];
      if (!childrenNodes) {
        childrenNodes = parentNode[childKey] = newNodes;
      } else {
        dataAfter = childrenNodes.splice(index === -1 ? childrenNodes.length : index);
        childrenNodes = parentNode[childKey] = childrenNodes.concat(newNodes, dataAfter);
      }
      // 删除已经存在的同级节点以及他们的子节点，并且把中间节点的已展开过的状态设置为false
      that.updateStatus(childrenNodes, function (d) {
        if (d[isParentKey] || treeOptions.view.showFlexIconIfNotParent) {
          d[LAY_HAS_EXPANDED] = false;
        }
      });
      var childrenNodesFlat = that.treeToFlat(childrenNodes);
      tableViewElem.find(childrenNodesFlat.map(function (value) {
        return 'tr[lay-data-index="' + value[LAY_DATA_INDEX] + '"]'
      }).join(',')).remove();

      that.initData();
      // 去掉父节点的已经展开过的状态，重新执行一次展开的方法
      parentNode[LAY_HAS_EXPANDED] = false;
      parentNode[LAY_ASYNC_STATUS] = 'local'; // 转为本地数据，应该规定异步加载子节点的时候addNodes的规则
      expandNode({trElem: tableViewElem.find('tr[lay-data-index="' + parentIndex + '"]')}, true);
    }
    that.updateCheckStatus(parentNode);
    // 更新父节点图标状态
    if(parentNode){
      var trEl = tableViewElem.find('tr[lay-data-index="' + parentNode[LAY_DATA_INDEX] + '"]');
      that.updateNodeIcon({
        scopeEl: trEl,
        isExpand: parentNode[LAY_EXPAND],
        isParent: parentNode[isParentKey],
      });
    }
    treeTable.resize(id);
    if (focus) {
      // 滚动到第一个新增的节点
      tableViewElem.find(ELEM_MAIN$1).find('tr[lay-data-index="' + newNodes[0][LAY_DATA_INDEX] + '"]').get(0).scrollIntoViewIfNeeded();
    }

    return newNodes;
  };

  // 获取表格选中状态
  treeTable.checkStatus = function (id, includeHalfCheck) {
    var that = getThisTable(id);
    if (!that) return;
    var options = that.getOptions();
    var treeOptions = options.tree;
    var checkName = table.config.checkName;

    // 需要区分单双选
    var tableData = treeTable.getData(id, true);
    var checkedData = tableData.filter(function (value, index, array) {
      return value[checkName] || (includeHalfCheck && value[LAY_CHECKBOX_HALF]);
    });

    var isAll = true;
    layui.each(treeOptions.data.cascade === 'all' ? table.cache[id] : treeTable.getData(id, true), function (i1, item1) {
      if (!item1[checkName]) {
        isAll = false;
        return true;
      }
    });

    return {
      data: checkedData,
      isAll: isAll
    }
  };

  // 排序之后重新渲染成树表
  treeTable.on('sort', function (obj) {
    var options = obj.config;
    var tableView = options.elem.next();
    var tableId = options.id;

    if (tableView.hasClass(TABLE_TREE)) {
      treeTable.sort(tableId);
    }
  });

  // 行点击
  treeTable.on('row', function (obj) {
    var options = obj.config;
    var tableView = options.elem.next();

    if (tableView.hasClass(TABLE_TREE)) {
      updateObjParams(obj);
    }
  });

  // 行双击
  treeTable.on('rowDouble', function (obj) {
    var options = obj.config;
    var tableView = options.elem.next();
    options.id;

    if (tableView.hasClass(TABLE_TREE)) {
      updateObjParams(obj);

      var treeOptions = options.tree || {};
      if (treeOptions.view.dblClickExpand) {
        expandNode({trElem: obj.tr.first()}, null, null, null, true);
      }
    }
  });

  // 菜单
  treeTable.on('rowContextmenu', function (obj) {
    var options = obj.config;
    var tableView = options.elem.next();
    options.id;

    if (tableView.hasClass(TABLE_TREE)) {
      updateObjParams(obj);
    }
  });

  // tr中带lay-event节点点击
  treeTable.on('tool', function (obj) {
    var options = obj.config;
    var tableView = options.elem.next();
    options.id;

    if (tableView.hasClass(TABLE_TREE)) {
      updateObjParams(obj);
    }
  });

  // 行内编辑
  treeTable.on('edit', function (obj) {
    // 如果编辑涉及到关键的name字段需要重新更新一下tr节点
    var options = obj.config;
    var tableView = options.elem.next();
    options.id;

    if (tableView.hasClass(TABLE_TREE)) {
      updateObjParams(obj);
      if (obj.field === options.tree.customName.name) {
        var updateData = {};
        updateData[obj.field] = obj.value;
        obj.update(updateData); // 通过update调用执行tr节点的更新
      }
    }
  });

  // 单选
  treeTable.on('radio', function (obj) {
    var options = obj.config;
    var tableView = options.elem.next();
    var tableId = options.id;

    if (tableView.hasClass(TABLE_TREE)) {
      var that = getThisTable(tableId);
      updateObjParams(obj);
      checkNode.call(that, obj.tr, obj.checked);
    }
  });

  // 设置或取消行选中样式
  Class$5.prototype.setRowCheckedClass = function(tr, checked){
    var that = this;
    var options = that.getOptions();

    tr.data('index');
    var tableViewElem = options.elem.next();

    tr[checked ? 'addClass' : 'removeClass'](ELEM_CHECKED); // 主体行

    // 右侧固定行
    tr.each(function(){
      var index = jquery(this).data('index');
      var trFixedR = tableViewElem.find('.layui-table-fixed-r tbody tr[data-index="'+ index +'"]');
      trFixedR[checked ? 'addClass' : 'removeClass'](ELEM_CHECKED);
    });
  };

  // 更新表格的复选框状态
  Class$5.prototype.updateCheckStatus = function (dataP, checked) {
    var that = this;
    var options = that.getOptions();
    if (!options.hasChecboxCol) {
      return false; // 如果没有复选列则不需要更新状态
    }
    var treeOptions = options.tree;
    var tableId = options.id;
    var tableView = options.elem.next();

    var checkName = table.config.checkName;

    var cascade = treeOptions.data.cascade;
    var isCascadeParent = cascade === 'all' || cascade === 'parent';

    // 如有必要更新父节点们的状态
    if (isCascadeParent && dataP) {
      var trsP = that.updateParentCheckStatus(dataP, layui.type(checked) === 'boolean' ? checked : null);
      layui.each(trsP, function (indexP, itemP) {
        var checkboxElem = tableView.find('tr[lay-data-index="' + itemP[LAY_DATA_INDEX] + '"]  input[name="layTableCheckbox"]:not(:disabled)');
        var checked = itemP[checkName];

        // 标记父节点行背景色
        that.setRowCheckedClass(checkboxElem.closest('tr'), checked);

        // 设置原始复选框 checked 属性值并渲染
        checkboxElem.prop({
          checked: checked,
          indeterminate: itemP[LAY_CHECKBOX_HALF]
        });
      });
    }

    // 更新全选的状态
    var isAll = true;
    var isIndeterminate = false;
    var data = treeOptions.data.cascade === 'all' ? table.cache[tableId] : treeTable.getData(tableId, true);
    data = data.filter(function (item) {
        return !item[options.disabledName];
    });

    if(data.length > 0){
      layui.each(data, function (i1, item1) {
        if (item1[checkName] || item1[LAY_CHECKBOX_HALF]) {
          isIndeterminate = true;
        }
        if (!item1[checkName]) {
          isAll = false;
        }
        if (isIndeterminate && !isAll) {
          return true;
        }
      });
    }else {
      isAll = false;
    }

    isIndeterminate = isIndeterminate && !isAll;
    tableView.find('input[name="layTableCheckbox"][lay-filter="layTableAllChoose"]').prop({
      'checked': isAll,
      indeterminate: isIndeterminate
    });

    return isAll
  };

  // 更新父节点的选中状态
  Class$5.prototype.updateParentCheckStatus = function (dataP, checked) {
    var that = this;
    var options = that.getOptions();
    var treeOptions = options.tree;
    var tableId = options.id;
    var checkName = table.config.checkName;
    var childrenKey = treeOptions.customName.children;

    var dataRet = [];
    dataP[LAY_CHECKBOX_HALF] = false; // 先设置为非半选，是否为半选又下面逻辑判断
    if (checked === true) {
      // 为真需要判断子节点的情况
      if (!dataP[childrenKey].length) {
        checked = false;
      } else {
        layui.each(dataP[childrenKey], function (index, item) {
          if (!item[checkName]) { // 只要有一个子节点为false
            checked = false;
            dataP[LAY_CHECKBOX_HALF] = true;
            return true; // 跳出循环
          }
        });
      }
    } else if (checked === false) {
      // 判断是否为半选
      layui.each(dataP[childrenKey], function (index, item) {
        if (item[checkName] || item[LAY_CHECKBOX_HALF]) { // 只要有一个子节点为选中或者半选状态
          dataP[LAY_CHECKBOX_HALF] = true;
          return true;
        }
      });
    } else {
      // 状态不确定的情况下根据子节点的信息
      checked = false;
      var checkedNum = 0;
      layui.each(dataP[childrenKey], function (index, item) {
        if (item[checkName]) {
          checkedNum++;
        }
      });
      checked = dataP[childrenKey].length ? dataP[childrenKey].length === checkedNum : dataP[checkName]; // 如果没有子节点保留原来的状态;
      dataP[LAY_CHECKBOX_HALF] = checked ? false : checkedNum > 0;
    }
    dataP[checkName] = checked;
    dataRet.push(jquery.extend({}, dataP));
    if (dataP[LAY_PARENT_INDEX]) {
      dataRet = dataRet.concat(that.updateParentCheckStatus(table.cache[tableId][dataP[LAY_PARENT_INDEX]], checked));
    }
    return dataRet
  };

  var checkNode = function (trElem, checked, callbackFlag) {
    var that = this;
    var options = that.getOptions();
    var treeOptions = options.tree;
    var tableId = options.id;
    var tableView = options.elem.next();
    var inputElem = (trElem.length ? trElem : tableView).find('.laytable-cell-radio, .laytable-cell-checkbox').children('input').last();
    // 判断是单选还是多选 不应该同时存在radio列和checkbox列
    var isRadio = inputElem.attr('type') === 'radio';

    if (callbackFlag) {
      var triggerEvent = function () {
        var fn = function (event) {
          layui.stope(event);
        };
        inputElem.parent().on('click', fn); // 添加临时的阻止冒泡事件
        inputElem.next().click();
        inputElem.parent().off('click', fn);
      };
      // 如果需要触发事件可以简单的触发对应节点的click事件
      if (isRadio) {
        // 单选只能选中或者切换其他的不能取消选中 后续看是否有支持的必要 todo
        if (checked && !inputElem.prop('checked')) {
          triggerEvent();
        }
      } else {
        if (layui.type(checked) === 'boolean') {
          if (inputElem.prop('checked') !== checked) {
            // 如果当前已经是想要修改的状态则不做处理
            triggerEvent();
          }
        } else {
          // 切换
          triggerEvent();
        }
      }
    } else {
      var trData = that.getNodeDataByIndex(trElem.attr('data-index'));
      var checkName = table.config.checkName;
      // 如果不触发事件应该有一个方法可以更新数据以及页面的节点
      if (isRadio) {
        if (!trData) {
          // 单选必须是一个存在的行
          return;
        }
        var statusChecked = {};
        statusChecked[checkName] = false;
        // that.updateStatus(null, statusChecked); // 取消其他的选中状态
        that.updateStatus(null, function (d) {
          if (d[checkName]) {
            var radioElem = tableView.find('tr[lay-data-index="' + d[LAY_DATA_INDEX] + '"] input[type="radio"][lay-type="layTableRadio"]');
            d[checkName] = false;

            // 取消当前选中行背景色
            that.setRowCheckedClass(radioElem.closest('tr'), false);
            radioElem.prop('checked', false);
          }
        }); // 取消其他的选中状态
        trData[checkName] = checked;

        that.setRowCheckedClass(trElem, checked);  // 标记当前选中行背景色
        that.setRowCheckedClass(trElem.siblings(), false); // 取消其他行背景色

        trElem.find('input[type="radio"][lay-type="layTableRadio"]').prop('checked', checked);
      } else {
        // 切换只能用到单条，全选到这一步的时候应该是一个确定的状态
        checked = layui.type(checked) === 'boolean' ? checked : !trData[checkName]; // 状态切换，如果遇到不可操作的节点待处理 todo
        // 全选或者是一个父节点，将子节点的状态同步为当前节点的状态
        // 处理不可操作的信息
        var checkedStatusFn = function (d) {
          if (!d[table.config.disabledName]) { // 节点不可操作的不处理
            d[checkName] = checked;
            d[LAY_CHECKBOX_HALF] = false;
          }
        };

        var trs = that.updateStatus(trData ? [trData] : table.cache[tableId], checkedStatusFn, trData && ['parent', 'none'].indexOf(treeOptions.data.cascade) !== -1);
        var checkboxElem = tableView.find(trs.map(function (value) {
          return 'tr[lay-data-index="' + value[LAY_DATA_INDEX] + '"] input[name="layTableCheckbox"]:not(:disabled)';
        }).join(','));

        that.setRowCheckedClass(checkboxElem.closest('tr'), checked);  // 标记当前选中行背景色
        checkboxElem.prop({checked: checked, indeterminate: false});

        var trDataP;

        // 更新父节点以及更上层节点的状态
        if (trData && trData[LAY_PARENT_INDEX]) {
          // 找到父节点，然后判断父节点的子节点是否全部选中
          trDataP = that.getNodeDataByIndex(trData[LAY_PARENT_INDEX]);
        }

        return that.updateCheckStatus(trDataP, checked);
      }
    }
  };

  // 多选
  treeTable.on('checkbox', function (obj) {
    var options = obj.config;
    var tableView = options.elem.next();
    var tableId = options.id;

    if (tableView.hasClass(TABLE_TREE)) {
      var that = getThisTable(tableId);
      var checked = obj.checked;
      updateObjParams(obj);
      obj.isAll = checkNode.call(that, obj.tr, checked);
    }
  });

  /**
   * 设置行选中状态
   * @param {String} id 树表id
   * @param {Object} opts
   * @param {Object|String} opts.index 节点下标
   * @param {Boolean} opts.checked 选中或取消
   * @param {Boolean} [opts.callbackFlag] 是否触发事件回调
   * */
  treeTable.setRowChecked = function (id, opts) {
    var that = getThisTable(id);
    if(!that) return;

    var options = that.getOptions();
    var tableView = options.elem.next();

    opts = opts || {};

    var node = opts.index;
    var checked = opts.checked;
    var callbackFlag = opts.callbackFlag;

    var dataIndex = layui.type(node) === 'string' ? node : node[LAY_DATA_INDEX];
    // 判断是否在当前页面中
    var nodeData = that.getNodeDataByIndex(dataIndex);
    if (!nodeData) {
      // 目前只能处理当前页的数据
      return;
    }

    var collectNeedExpandNodeIndex = function(index){
      needExpandIndex.push(index);
      var trElem = tableView.find('tr[lay-data-index="' + index + '"]');
      if (!trElem.length) {
        var nodeData = that.getNodeDataByIndex(index);
        var parentIndex = nodeData[LAY_PARENT_INDEX];
        parentIndex && collectNeedExpandNodeIndex(parentIndex);
      }
    };

    // 判断是否展开过
    var trElem = tableView.find('tr[lay-data-index="' + dataIndex + '"]');
    if (!trElem.length) {
      var parentIndex = nodeData[LAY_PARENT_INDEX];
      var needExpandIndex = [];
      collectNeedExpandNodeIndex(parentIndex);
      // 如果还没有展开没有渲染的要先渲染出来
      layui.each(needExpandIndex.reverse(),function(index, nodeIndex){
        treeTable.expandNode(id, {
          index: nodeIndex,
          expandFlag: true
        });
      });
      trElem = tableView.find('tr[lay-data-index="' + dataIndex + '"]');
    }
    checkNode.call(that, trElem, checked, callbackFlag);
  };

  treeTable.checkAllNodes = function (id, checked) {
    var that = getThisTable(id);
    if(!that) return;

    var options = that.getOptions();
    var tableView = options.elem.next();

    checkNode.call(that, tableView.find('tr[data-index="NONE"]'), !!checked);
  };

  /**
   * 获得数据
   * @param {String} id 表格id
   * @param {Boolean} [isSimpleData] 是否返回平铺结构的数据
   * @return {Array} 表格数据
   * */
  treeTable.getData = function (id, isSimpleData) {
    var that = getThisTable(id);
    if (!that) return;

    var tableData = [];
    layui.each(jquery.extend(true, [], table.cache[id] || []), function (index, item) {
      // 遍历排除掉临时的数据
      tableData.push(item);
    });
    return isSimpleData ? that.treeToFlat(tableData) : tableData;
  };

  /**
   * 重新加载子节点
   * @param {String} id 表格id
   * @param {String} dataIndex 父节点的dataIndex
   * */
  treeTable.reloadAsyncNode = function (id, dataIndex) {
    var that = getThisTable(id);
    if (!that) {
      return;
    }

    var options = that.getOptions();
    var treeOptions = options.tree;
    if (!treeOptions.async || !treeOptions.async.enable) {
      return;
    }
    var dataP = that.getNodeDataByIndex(dataIndex);
    if (!dataP) {
      return;
    }
    dataP[LAY_HAS_EXPANDED] = false;
    dataP[LAY_EXPAND] = false;
    dataP[LAY_ASYNC_STATUS] = false;
    layui.each(that.treeToFlat(dataP[treeOptions.customName.children]).reverse(), function (i1, item1) {
      treeTable.removeNode(id, item1[LAY_DATA_INDEX], true);
    });
    // 重新展开
    treeTable.expandNode(id, {
      index: dataIndex,
      expandFlag: true,
      callbackFlag: true,
    });
  };

  /**
   * 通过数据id获取节点对象
   * */
  treeTable.getNodeById = function (id, dataId) {
    var that = getThisTable(id);
    if (!that) return;

    return that.getNodeById(dataId);
  };

  /**
   * 根据自定义规则搜索节点数据
   * @param {String} id 树表id
   * @param {Function} filter 自定义过滤器函数
   * @param {Object} [opts]
   * @param {Boolean} [opts.isSingle] 是否只找到第一个
   * @param {Object} [opts.parentNode] 在指定在某个父节点下的子节点中搜索
   * @return {Object} 节点对象
   * */
  treeTable.getNodesByFilter = function (id, filter, opts) {
    var that = getThisTable(id);
    if (!that) return;
    var options = that.getOptions();

    opts = opts || {};
    var isSingle = opts.isSingle;
    var parentNode = opts.parentNode;
    var dataP = parentNode && parentNode.data;
    // dataP = dataP || table.cache[id];
    var nodes = that.treeToFlat(dataP ? (dataP[options.tree.customName.children] || []) : table.cache[id]).filter(filter);
    var nodesResult = [];
    layui.each(nodes, function (i1, item1) {
      nodesResult.push(that.getNodeByIndex(item1[LAY_DATA_INDEX]));
      if (isSingle) {
        return true;
      }
    });

    return nodesResult;
  };


  // 记录所有实例
  thisTreeTable.that = {}; // 记录所有实例对象
  // thisTreeTable.config = {}; // 记录所有实例配置项

  // 重载
  treeTable.reload = function (id, options, deep, type) {
    // deep = deep !== false; // 默认采用深拷贝
    var that = getThisTable(id);
    if (!that) return;
    that.reload(options, deep, type);
    return thisTreeTable.call(that);
  };

  // 核心入口
  treeTable.render = function (options) {
    var inst = new Class$5(options);
    return thisTreeTable.call(inst);
  };

/**
 * component
 * Layui 2 组件构建器
 */


  // export
  function component$2(settings) {
    // 默认设置
    settings = jquery.extend(true, {
      isDeepReload: false // 是否默认为深度重载
    }, settings);

    // 组件名
    var MOD_NAME = settings.name;
    var MOD_ID = 'lay-' + MOD_NAME + '-id'; // 用于记录组件实例 id 的属性名

    // 组件基础对外接口
    var component = {
      config: {}, // 全局配置项，一般通过 component.set() 设置
      index: layui[MOD_NAME] ? (layui[MOD_NAME].index + 10000) : 0, // 组件索引

      // 通用常量集，一般存放固定字符，如类名等
      CONST: jquery.extend(true, {
        MOD_NAME: MOD_NAME,
        MOD_ID: MOD_ID,

        CLASS_THIS: 'layui-this',
        CLASS_SHOW: 'layui-show',
        CLASS_HIDE: 'layui-hide',
        CLASS_HIDEV: 'layui-hide-v',
        CLASS_DISABLED: 'layui-disabled',
        CLASS_NONE: 'layui-none'
      }, settings.CONST),

      // 设置全局项
      set: function(options) {
        var that = this;
        jquery.extend(true, that.config, options);
        return that;
      },

      // 事件
      on: function(events, callback) {
        return layui.onevent.call(this, MOD_NAME, events, callback);
      }
    };

    // 操作当前实例
    var instance = function() {
      var that = this;
      var options = that.config;
      var id = options.id;

      // 实例对象
      var inst = {
        config: options,
        id: id,

        // 重置实例
        reload: function(options) {
          that.reload.call(that, options);
        }
      };

      // 扩展实例对象的回调
      if (typeof settings.extendsInstance === 'function') {
        jquery.extend(true, inst, settings.extendsInstance.call(that));
      }

      // 返回实例对象
      return inst;
    };

    // 构造器
    var Class = function(options) {
      var that = this;
      that.index = ++component.index; // 每创建一个实例，下标自增

      // 扩展配置项：传入选项 -> 全局选项 -> 默认选项 = 当前选项
      that.config = jquery.extend(true, {}, that.config, component.config, options);

      // 初始化之前的回调
      if (typeof settings.beforeInit === 'function') {
        settings.beforeInit.call(that, that.config);
      }

      // 初始化
      that.init();
    };

    // 默认配置
    Class.prototype.config = settings.config;

    // 重载实例
    Class.prototype.reload = function(options, type) {
      var that = this;
      that.config = jquery.extend(settings.isDeepReload, {}, that.config, options);
      that.init(true, type);
    };

    // 初始化准备（若由事件触发渲染，则必经此步）
    Class.prototype.init = function(rerender, type) {
      var that = this;
      var options = that.config;
      var elem = jquery(options.elem);

      // 若 elem 非唯一，则拆分为多个实例
      if (elem.length > 1) {
        layui.each(elem, function() {
          component.render(jquery.extend({}, options, {
            elem: this
          }));
        });
        return that;
      }

      // 合并 lay-options 属性上的配置信息
      var layOptions = lay.options(elem[0]);
      if (rerender) {
        // 若重载渲染，则重载传入的 options 配置优先
        options = that.config = jquery.extend(layOptions, options);
      } else {
        jquery.extend(options, layOptions); // 若首次渲染，则 lay-options 配置优先
      }

      // 若重复执行 render，则视为 reload 处理
      if (!rerender && elem.attr(MOD_ID)) {
        var newThat = component.getInst(elem.attr(MOD_ID));
        if (!newThat) return;
        return newThat.reload(options, type);
      }

      options.elem = jquery(options.elem);

      // 初始化 id 属性 - 优先取 options.id > 元素 id > 自增索引
      options.id = lay.hasOwn(options, 'id') ? options.id : (
        elem.attr('id') || that.index
      );

      // 记录当前实例对象
      instance.that[options.id] = that;

      // 渲染之前的回调
      if (typeof settings.beforeRender === 'function') {
        settings.beforeRender.call(that, options);
      }

      // 渲染
      if (typeof that.render === 'function') {
        component.cache.id[options.id] = null; // 记录所有实例 id，用于批量操作（如 resize）
        elem.attr(MOD_ID, options.id); // 目标元素已渲染过的标记
        that.render(rerender); // 渲染核心
      }

      // 事件
      typeof that.events === 'function' && that.events();
    };

    // 组件必传项
    Class.prototype.render = settings.render; // 渲染
    Class.prototype.events = settings.events; // 事件

    /**
     * 元素缓存操作
     * @param {string} key - 缓存键
     * @param {*} value - 缓存值
     * @param {boolean} remove - 是否删除缓存
     * @returns {*} - 若 value 未传，则返回缓存值
     */
    Class.prototype.cache = function(key, value, remove) {
      var that = this;
      var options = that.config;
      var elem = options.elem;
      var MOD_CACHE_NAME = MOD_ID + '-cache';
      if (!elem) return;

      var cache = elem.data(MOD_CACHE_NAME) || {};

      // value 未传则获取缓存值
      if (value === undefined) {
        return cache[key];
      }

      if (remove) {
        delete cache[key]; // 删除缓存
      } else {
        cache[key] = value; // 设置缓存
      }

      elem.data(MOD_CACHE_NAME, cache);
    };

    // 清除缓存
    Class.prototype.removeCache = function(key) {
      this.cache(key, null, true);
    };

    // 缓存所有实例对象
   instance.that = {};

    // 获取指定的实例对象
    component.getInst = component.getThis = function(id) {
      if (id === undefined) {
        throw new Error('ID argument required');
      }
      return instance.that[id];
    };

    // 获取所有实例
    component.getAllInst = function() {
      return instance.that;
    };

    // 移除指定的实例对象
    component.removeInst = function(id) {
      delete instance.that[id];
      delete component.cache.id[id];
    };

    // 组件缓存
    component.cache = {
      id: {}
    };

    // 用于扩展原型
    component.Class = Class;

    /**
     * 组件完整重载
     * @param {string} id - 实例 id
     * @param {Object} options - 配置项
     * @returns
     */
    component.reload = function(id, options) {
      var that = component.getInst(id);
      if (!that) return;

      that.reload(options);
      return instance.call(that);
    };

    /**
     * 组件渲染
     * @param {Object} options - 配置项
     * @returns
     */
    component.render = function(options) {
      var inst = new Class(options);
      return instance.call(inst);
    };

    return component;
  }

/**
 * tabs
 * 标签页组件
 */


  // 创建组件
  var component$1 = component$2({
    name: 'tabs', // 组件名

    // 默认配置
    config: {
      elem: '.layui-tabs',
      trigger: 'click', // 标签切换的触发事件
      headerMode: 'auto' // 标签头部的显示模式 auto | scroll | normal
    },

    CONST: {
      ELEM: 'layui-tabs',
      HEADER: 'layui-tabs-header',
      CLOSE: 'layui-tabs-close',
      BODY: 'layui-tabs-body',
      ITEM: 'layui-tabs-item',
      CARD: 'layui-tabs-card'
    },

    // 渲染
    render: function() {
      var that = this;
      var options = that.config;

      // 标签页元素项
      that.headerElem = ['.'+ component$1.CONST.HEADER + ':eq(0)', '>li'];
      that.bodyElem = ['.'+ component$1.CONST.BODY + ':eq(0)', '>.'+ component$1.CONST.ITEM];

      // 获取标签容器中的 header body 相关元素
      that.getContainer = function() {
        var elem = that.documentElem || options.elem;
        return {
          header: {
            elem: elem.find(that.headerElem[0]),
            items: elem.find(that.headerElem.join(''))
          },
          body: {
            elem: elem.find(that.bodyElem[0]),
            items: elem.find(that.bodyElem.join(''))
          }
        };
      };

      // 若 header 选项类型为数组
      if (layui.type(options.header) === 'array') {
        // if (options.header.length === 0) return;

        // 给任意元素绑定 tabs 切换功能
        if (typeof options.header[0] === 'string') {
          that.headerElem = options.header.concat();
          that.documentElem = jquery(document);
        } else { // 方法传值渲染
          that.elemView = jquery('<div class="layui-tabs"></div>');
          if (options.className) that.elemView.addClass(options.className);

          var headerElem = jquery('<ul class="layui-tabs-header"></ul>');
          var bodyElem = jquery('<div class="layui-tabs-body"></div>');

          // 生成标签项
          layui.each(options.header, function(i, item){
            var elemHeaderItem = that.renderHeaderItem(item);
            headerElem.append(elemHeaderItem);
          });
          layui.each(options.body, function(i, item){
            var elemBodyItem = that.renderBodyItem(item);
            bodyElem.append(elemBodyItem);
          });

          that.elemView.append(headerElem).append(bodyElem);
          options.elem.html(that.elemView);
        }
      } else {
        that.renderClose(); // 初始化标签关闭结构
      }

      // 若 body 选项类型为数组
      if (layui.type(options.body) === 'array') {
        if (typeof options.body[0] === 'string') {
          that.documentElem = jquery(document);
          that.bodyElem = options.body.concat();
        }
      }

      // 初始选中项
      var data = that.data();
      if ('index' in options && data.index != options.index) {
        that.change(that.findHeaderItem(options.index), true);
      } else if (data.index === -1) { // 初始选中项为空时，默认选中第一个
        that.change(that.findHeaderItem(0), true);
      }

      // 初始化滚动结构
      that.roll('auto');

      // 清除隐藏占位
      if (options.elem.hasClass(component$1.CONST.CLASS_HIDEV)) {
        options.elem.removeClass(component$1.CONST.CLASS_HIDEV);
      }

      // 回调
      typeof options.afterRender === 'function' && options.afterRender(data);

      // 渲染成功后的事件
      layui.event.call(
        options.elem[0],
        component$1.CONST.MOD_NAME,
        'afterRender('+ options.id +')',
        data
      );
    },

    // 事件
    events: function() {
      var that = this;
      var options = that.config;
      var container = that.getContainer();
      var MOD_NAME = component$1.CONST.MOD_NAME;
      var TRIGGER_NAMESPACE = '.lay_'+ MOD_NAME + '_trigger';
      var delegatedElement = that.documentElem ? container.header.elem : options.elem;

      // 标签头部事件
      var trigger = options.trigger + TRIGGER_NAMESPACE;
      var elemHeaderItem = that.documentElem ? that.headerElem[1] : that.headerElem.join('');
      delegatedElement.off(trigger).on(trigger, elemHeaderItem, function() {
        that.change(jquery(this));
      });

      // 窗口 resize 事件
      if (!inner.onresize) {
        var timer;
        jquery(window).on('resize', function() {
          clearTimeout(timer);
          timer = setTimeout(function(){
            layui.each(component$1.cache.id, function(key) {
              var that = component$1.getInst(key);
              if(!that) return;
              that.roll('init');
            });
          }, 50);
        });
        inner.onresize = true;
      }
    }
  });

  // 内部变量集
  var inner = {};

  /**
   * 扩展组件原型方法
   */

  var Class$4 = component$1.Class;

  /**
   * 增加标签
   * @param {Object} opts
   * @param {string} opts.title - 标签标题
   * @param {string} opts.content - 标签内容
   * @param {string} opts.id - 标签的 lay-id 属性值
   * @param {string} [opts.index] - 活动标签索引，默认取当前选中标签的索引
   * @param {('append'|'prepend'|'after'|'before')} [opts.mode='append'] - 标签插入方式
   * @param {boolean} [opts.active] - 是否将新增项设置为活动标签
   * @param {boolean} [opts.closable] - 标签是否可关闭。初始值取决于 options.closable
   * @param {string} [opts.headerItem] - 自定义标签头部元素
   * @param {string} [opts.bodyItem] - 自定义标签内容元素
   * @param {Function} [opts.done] - 标签添加成功后执行的回调函数
   */
  Class$4.prototype.add = function(opts) {
    var that = this;
    that.config;
    var container = that.getContainer();
    var newHeaderItem = that.renderHeaderItem(opts);
    var newBodyItem = that.renderBodyItem(opts);
    var data = that.data();

    // 选项默认值
    opts = jquery.extend({
      active: true
    }, opts);

    // 插入方式
    if (/(before|after)/.test(opts.mode)) { // 在活动标签前后插入
      var hasOwnIndex = opts.hasOwnProperty('index');
      var headerItem = hasOwnIndex ? that.findHeaderItem(opts.index) : data.thisHeaderItem;
      var bodyItem = hasOwnIndex ? that.findBodyItem(opts.index) : data.thisHeaderItem;
      headerItem[opts.mode](newHeaderItem);
      bodyItem[opts.mode](newBodyItem);
    } else { // 在标签最前后插入
      var mode = ({
        prepend: 'prepend', // 插入标签到最前
        append: 'append' // 插入标签到最后
      })[opts.mode || 'append'] || 'append';
      container.header.elem[mode](newHeaderItem);
      container.body.elem[mode](newBodyItem);
    }

    // 是否将新增项设置为活动标签
    if (opts.active) {
      that.change(newHeaderItem, true);
    } else {
      that.roll('auto');
    }

    // 回调
    typeof opts.done === 'function' && opts.done(
      jquery.extend(data, {
        headerItem: newHeaderItem,
        bodyItem: newBodyItem
      })
    );
  };

  /**
   * 关闭指定标签
   * @param {Object} thisHeaderItem - 当前标签头部项元素
   * @param {boolean} force - 是否强制删除
   */
  Class$4.prototype.close = function(thisHeaderItem, force) {
    if (!thisHeaderItem || !thisHeaderItem[0]) return;

    var that = this;
    var options = that.config;
    var layid = thisHeaderItem.attr('lay-id');
    var index = thisHeaderItem.index();

    // 标签是否不可关闭
    if (thisHeaderItem.attr('lay-closable') === 'false') {
      return;
    }

     // 当前标签相关数据
     var data = that.data();

    // 标签关闭前的事件。若非强制关闭，可则根据事件的返回结果决定是否关闭
    if (!force) {
      var closable = layui.event.call(
        thisHeaderItem[0],
        component$1.CONST.MOD_NAME,
        'beforeClose('+ options.id +')',
        jquery.extend(data, {
          index: index
        })
      );

      // 是否阻止关闭
      if (closable === false) {
        return;
      }
    }

    // 如果关闭的是当前标签，则更换当前标签索引
    if (thisHeaderItem.hasClass(component$1.CONST.CLASS_THIS)) {
      if (thisHeaderItem.next()[0]) {
        that.change(thisHeaderItem.next(), true);
      } else if(thisHeaderItem.prev()[0]) {
        that.change(thisHeaderItem.prev(), true);
      }
    }

    // 移除元素
    that.findBodyItem(layid || index).remove();
    thisHeaderItem.remove();

    that.roll('auto', index);

    // 获取当前标签相关数据
    var data = that.data();

    // 标签关闭后的事件
    layui.event.call(
      data.thisHeaderItem[0],
      component$1.CONST.MOD_NAME,
      'afterClose('+ options.id +')',
      data
    );
  };

  /**
   * 批量关闭标签
   * @see tabs.close
   */
  Class$4.prototype.closeMult = function(mode, index) {
    var that = this;
    var options = that.config;
    var container = that.getContainer();
    var data = that.data();
    var headers = container.header.items;
    container.body.items;
    var DISABLED_CLOSE_SELECTOR = '[lay-closable="false"]'; // 不可关闭标签选择器

    index = index === undefined ? data.index : index;

    var headerItem = that.findHeaderItem(index);
    that.findBodyItem(index);
    var itemIndex = headerItem.index();

    // 若当前选中标签也允许关闭，则尝试寻找不可关闭的标签并将其选中
    if (data.thisHeaderItem.attr('lay-closable') !== 'false') {
      if(mode === 'all' || !mode){
        var nextHeader = headers.filter(':gt('+ data.index +')'+ DISABLED_CLOSE_SELECTOR).eq(0);
        var prevHeader = jquery(headers.filter(':lt('+ data.index +')'+ DISABLED_CLOSE_SELECTOR).get().reverse()).eq(0);
        if (nextHeader[0]) {
          that.change(nextHeader, true);
        } else if(prevHeader[0]) {
          that.change(prevHeader, true);
        }
      } else if(index !== data.index) { // 自动切换到活动标签
        that.change(headerItem, true);
      }
    }

    // 执行批量关闭标签
    headers.each(function(i) {
      var $this = jquery(this);
      var layid = $this.attr('lay-id');
      var bodyItem = that.findBodyItem(layid || i);

      // 标签是否不可关闭
      if ($this.attr('lay-closable') === 'false') {
        return;
      }

      // 批量关闭方式
      var isCloseOther = mode === 'other' && i !== itemIndex; // 关闭其他标签
      var isCloseRight = mode === 'right' && i > itemIndex; // 关闭右侧标签
      var isCloseLeft = mode === 'left' && i < itemIndex; // 关闭左侧标签（不推荐）
      var isCloseAll = mode === 'all'; // 关闭所有标签

      if (isCloseOther || isCloseRight || isCloseLeft || isCloseAll) {
        $this.remove();
        bodyItem.remove();
      }
    });

    that.roll('auto');

    // 回调
    var data = that.data();

    // 标签关闭后的事件
    layui.event.call(
      data.thisHeaderItem[0],
      component$1.CONST.MOD_NAME,
      'afterClose('+ options.id +')',
      data
    );
  };

  /**
   * 切换标签
   * @param {Object} thisHeaderItem - 当前标签头部项元素
   * @param {boolean} [force=false] - 是否强制切换
   * @returns
   */
  Class$4.prototype.change = function(thisHeaderItem, force) {
    if (!thisHeaderItem || !thisHeaderItem[0]) return;

    var that = this;
    var options = that.config;
    var layid = thisHeaderItem.attr('lay-id');
    var index = thisHeaderItem.index();
    var thatA = thisHeaderItem.find('a');
    // 是否存在跳转链接
    var isLink = typeof thatA.attr('href') === 'string' && thatA.attr('target') === '_blank';
    // 是否不允许选中
    var unselect = typeof thisHeaderItem.attr('lay-unselect') === 'string';

    // 不满足切换的条件
    if (isLink || unselect) {
      return;
    }

    // 当前标签相关数据
    var data = that.data();

    // 标签关闭前的事件。若非强制关闭，可则根据事件的返回结果决定是否关闭
    if (!force) {
      var enable = layui.event.call(
        thisHeaderItem[0],
        component$1.CONST.MOD_NAME,
        'beforeChange('+ options.id +')',
        jquery.extend(data, {
          from: {
            index: data.index,
            headerItem: data.thisHeaderItem
          },
          to: {
            index: index,
            headerItem: thisHeaderItem
          }
        })
      );

      // 是否阻止切换
      if (enable === false) {
        return;
      }
    }

    // 执行标签头部切换
    thisHeaderItem.addClass(component$1.CONST.CLASS_THIS).siblings()
    .removeClass(component$1.CONST.CLASS_THIS);

    // 执行标签内容切换
    that.findBodyItem(layid || index).addClass(component$1.CONST.CLASS_SHOW)
    .siblings().removeClass(component$1.CONST.CLASS_SHOW);

    that.roll('auto', index);

    // 重新获取标签相关数据
    var data = that.data();

    // 标签切换后的事件
    layui.event.call(
      data.thisHeaderItem[0],
      component$1.CONST.MOD_NAME,
      'afterChange('+ options.id +')',
      data
    );
  };

  /**
   * 渲染标签头部项
   * @param {Object} opts - 标签项配置信息
   */
  Class$4.prototype.renderHeaderItem = function(opts) {
    var that = this;
    var options = that.config;
    var headerItem = jquery(opts.headerItem || options.headerItem || '<li></li>');

    headerItem.html(opts.title || 'New Tab').attr('lay-id', opts.id);
    that.appendClose(headerItem, opts); // 追加标签关闭元素
    return headerItem;
  };

  /**
   * 渲染标签内容项
   * @param {Object} opts - 标签项配置信息
   */
  Class$4.prototype.renderBodyItem = function(opts) {
    var that = this;
    var options = that.config;
    var bodyItem = jquery(opts.bodyItem || options.bodyItem || '<div class="'+ component$1.CONST.ITEM +'"></div>');

    bodyItem.html(opts.content || '').attr('lay-id', opts.id);
    return bodyItem;
  };

  /**
   * 给某一个标签项追加可关闭元素
   * @param {Object} headerItem - 标签项元素
   * @param {Object} opts - 标签项配置信息
   */
  Class$4.prototype.appendClose = function(headerItem, opts) {
    var that = this;
    var options = that.config;

    if (!options.closable) return;

    opts = opts || {};

    // 不可关闭项
    if (opts.closable == false) {
      headerItem.attr('lay-closable', 'false');
    }

    if (headerItem.attr('lay-closable') === 'false') {
      return;
    }

    // 可关闭项追加关闭按钮
    if (!headerItem.find('.'+ component$1.CONST.CLOSE)[0]) {
      var close = jquery('<i class="layui-icon layui-icon-close layui-unselect '+ component$1.CONST.CLOSE +'"></i>');
      close.on('click', function(){
        that.close(jquery(this).parent());
        return false;
      });
      headerItem.append(close);
    }
  };

  // 渲染标签可关闭元素
  Class$4.prototype.renderClose = function() {
    var that = this;
    var options = that.config;
    var container = that.getContainer();

    container.header.items.each(function() {
      var $this = jquery(this);
      // 是否开启关闭
      if (options.closable) {
        that.appendClose($this);
      } else {
        $this.find('.'+ component$1.CONST.CLOSE).remove();
      }
    });
  };

  /**
   * 标签头滚动
   * @param {('auto'|'prev'|'next'|'init')} [mode='next'] - 滚动方式
   * @param {number} index - 标签索引。默认取当前选中标签的索引值
   * @returns
   */
  Class$4.prototype.roll = function(mode, index) {
    var that = this;
    var options = that.config;
    var container = that.getContainer();
    var headerElem = container.header.elem;
    var headerItems = container.header.items;
    var scrollWidth = headerElem.prop('scrollWidth'); // 实际总长度
    var outerWidth = Math.ceil(headerElem.outerWidth()); // 可视区域的长度
    var tabsLeft = headerElem.data('left') || 0;
    var scrollMode = options.headerMode === 'scroll'; // 标签头部是否始终保持滚动模式

    // 让选中标签始终保持在可视区域
    var rollToVisibleArea = function() {
      index = isNaN(index) ? that.data().index : index;

      var thisItemElem = headerItems.eq(index);
      if (!thisItemElem[0]) return;

      // 当前标签的相对水平坐标值
      var thisLeft = Math.ceil(thisItemElem.position().left);
      var padding = 1; // 让边界额外保持一定间距

      // 当选中标签溢出在可视区域「左侧」时
      var countWidth = thisLeft - (thisItemElem.prev().outerWidth() || 0);  // 始终空出上一个标签
      if (countWidth > 0) countWidth = countWidth - padding;

      // 左侧临界值
      if (tabsLeft + countWidth < 0) {
        tabsLeft = countWidth >= 0 ? countWidth : 0; // 标签的复原位移不能超出 0
        return headerElem.css('left', -tabsLeft).data('left', -tabsLeft);
      }

      // 当选中标签溢出在可视区域「右侧」时，
      var countWidth = thisLeft + thisItemElem.outerWidth()
      + (thisItemElem.next().outerWidth() || 0) + padding; // 始终空出下一个标签

      // 右侧临界值
      if (tabsLeft + countWidth - outerWidth > 0) {
        tabsLeft = countWidth - outerWidth;
        headerElem.css('left', -tabsLeft).data('left', -tabsLeft);
      }
    };

    // css 类名
    var CLASS_SCROLL = 'layui-tabs-scroll';
    var CLASS_BAR = 'layui-tabs-bar';
    var CLASS_BAR_ICON = ['layui-icon-prev', 'layui-icon-next'];

    // 滚动结构
    var rollElem = {
      elem: jquery('<div class="'+ CLASS_SCROLL +' layui-border-box layui-unselect"></div>'),
      bar: jquery([
        '<div class="'+ CLASS_BAR +'">',
          '<i class="layui-icon '+ CLASS_BAR_ICON[0] +'" lay-mode="prev"></i>',
          '<i class="layui-icon '+ CLASS_BAR_ICON[1] +'" lay-mode="next"></i>',
        '</div>'
      ].join(''))
    };

    // 不渲染头部滚动结构
    if (options.headerMode === 'normal') return;

    // 是否渲染滚动结构
    var elemScroll = headerElem.parent('.'+ CLASS_SCROLL);
    if (scrollMode || (!scrollMode && scrollWidth > outerWidth)) {
      if (!elemScroll[0]) {
        if (options.elem.hasClass(component$1.CONST.CARD)) {
          rollElem.elem.addClass(component$1.CONST.CARD);
        }
        headerElem.wrap(rollElem.elem);
        headerElem.after(rollElem.bar);

        // 点击左右箭头
        rollElem.bar.children().on('click', function(){
          var othis = jquery(this);
          var mode = othis.attr('lay-mode');
          if (jquery(this).hasClass(component$1.CONST.CLASS_DISABLED)) return;
          mode && that.roll(mode);
        });
      }
    } else if(!scrollMode) {
      if (elemScroll[0]) {
        elemScroll.find('.'+ CLASS_BAR).remove();
        headerElem.unwrap().css('left', 0).data('left', 0);
      } else {
        return;
      }
    }

    // 初始化滚动模式
    if (mode === 'init') return;

    // 重新获取
    scrollWidth = headerElem.prop('scrollWidth'); // 实际总长度
    outerWidth = headerElem.outerWidth(); // 可视区域的长度
    elemScroll = headerElem.parent('.'+ CLASS_SCROLL);

    // 左箭头（往右滚动）
    if (mode === 'prev') {
      // 当前的 left 减去可视宽度，用于与上一轮的页签比较
      var  prevLeft = -tabsLeft - outerWidth;
      if(prevLeft < 0) prevLeft = 0;
      headerItems.each(function(i, item){
        var li = jquery(item);
        var left = Math.ceil(li.position().left);

        if (left >= prevLeft) {
          headerElem.css('left', -left).data('left', -left);
          return false;
        }
      });
    } else if(mode === 'auto') { // 自动识别滚动
      rollToVisibleArea();
    } else { // 右箭头（往左滚动） 默认 next
      headerItems.each(function(i, item){
        var li = jquery(item);
        var left = Math.ceil(li.position().left);

        if (left + li.outerWidth() >= outerWidth - tabsLeft) {
          headerElem.css('left', -left).data('left', -left);
          return false;
        }
      });
    }

    // 同步箭头状态
    tabsLeft = headerElem.data('left') || 0;

     // 左
    elemScroll.find('.'+ CLASS_BAR_ICON[0])[
      tabsLeft < 0 ? 'removeClass' : 'addClass'
    ](component$1.CONST.CLASS_DISABLED);
     // 右
    elemScroll.find('.'+ CLASS_BAR_ICON[1])[
      parseFloat(tabsLeft + scrollWidth) - outerWidth > 0
        ? 'removeClass'
      : 'addClass'
    ](component$1.CONST.CLASS_DISABLED);
  };

  /**
   * 获取标签头部项
   * @param {number|string} index - 标签索引或 lay-id
   */
  Class$4.prototype.findHeaderItem = function(index) {
    var container = this.getContainer();
    var headerItems = container.header.items;

    // 根据 lay-id 匹配
    if (typeof index === 'string') {
      return headerItems.filter('[lay-id="'+ index +'"]');
    }

    return headerItems.eq(index);
  };

  /**
   * 获取标签内容项
   * @param {number|string} index - 标签索引或 lay-id
   */
  Class$4.prototype.findBodyItem = function(index) {
    var container = this.getContainer();
    var bodyItems = container.body.items;

    // 根据 lay-id 匹配
    if (typeof index === 'string') {
      var bodyItem = bodyItems.filter('[lay-id="'+ index +'"]');
      return bodyItem[0] ? bodyItem : function() {
        // 若未匹配到 lay-id 对应内容项，则通过对应头部项的索引匹配内容项
        var headerItems = container.header.items;
        var headerItemIndex = headerItems.filter('[lay-id="'+ index +'"]').index();
        
        return headerItemIndex !== -1 ? bodyItems.eq(headerItemIndex) : bodyItem;
      }();
    }

    return bodyItems.eq(index);
  };

  /**
   * 返回给回调的公共信息
   * @returns
   */
  Class$4.prototype.data = function() {
    var that = this;
    var options = that.config;
    var container = that.getContainer();
    var thisHeaderItem = container.header.items.filter('.'+ component$1.CONST.CLASS_THIS);
    var index = thisHeaderItem.index();
    var layid = thisHeaderItem.attr('lay-id');

    return {
      options: options, // 标签配置信息
      container: container, // 标签容器的相关元素
      thisHeaderItem: thisHeaderItem, // 当前活动标签头部项
      thisBodyItem: that.findBodyItem(layid || index), // 当前活动标签内容项
      index: index, // 当前活动标签索引
      length: container.header.items.length // 标签数量
    };
  };

  // 扩展组件接口
  jquery.extend(component$1, {
    /**
     * 添加标签
     * @param {string} id - 渲染时的实例 ID
     * @param {Object} opts - 添加标签的配置项，详见 Class.prototype.add
     */
    add: function(id, opts) {
      var that = component$1.getInst(id);
      if(!that) return;
      that.add(opts);
    },

    /**
     * 关闭标签
     * @param {string} id - 渲染时的实例 ID
     * @param {number} index - 标签索引
     * @param {boolean} [force=false] - 是否强制关闭
     */
    close: function(id, index, force) {
      var that = component$1.getInst(id);
      if (!that) return;
      // index 若不传，则表示关闭当前标签
      if (index === undefined) {
        index = that.data().index;
      }
      that.close(that.findHeaderItem(index), force);
    },

    /**
     * 关闭多个标签
     * @param {string} id - 渲染时的实例 ID
     * @param {('other'|'right'|'all')} [mode="all"] - 关闭方式
     * @param {number} index - 活动标签的索引，默认取当前选中标签的索引。一般用于标签右键事件
     */
    closeMult: function(id, mode, index) {
      var that = component$1.getInst(id);
      if(!that) return;
      that.closeMult(mode, index);
    },

    /**
     * 切换标签
     * @param {string} id - 渲染时的实例 ID
     * @param {number} index - 标签索引
     */
    change: function(id, index, force) {
      var that = component$1.getInst(id);
      if(!that) return;
      that.change(that.findHeaderItem(index), force);
    },

    /**
     * 获取标签信息
     * @param {string} id - 渲染时的实例 ID
     */
    data: function(id) {
      var that = component$1.getInst(id);
      return that ? that.data() : {};
    },

    /**
     * 获取标签指定头部项
     * @param {string} id - 渲染时的实例 ID
     * @param {number} index - 标签索引或 lay-id 值
     * @returns
     */
    getHeaderItem: function(id, index) {
      var that = component$1.getInst(id);
      if(!that) return;
      return that.findHeaderItem(index);
    },

    /**
     * 获取标签指定内容项
     * @param {string} id - 渲染时的实例 ID
     * @param {number} index - 标签索引或 lay-id 值
     * @returns
     */
    getBodyItem: function(id, index) {
      var that = component$1.getInst(id);
      if(!that) return;
      return that.findBodyItem(index);
    },

    /**
     * 刷新标签视图结构
     * @param {string} id - 渲染时的实例 ID
     */
    refresh: function(id) {
      var that = component$1.getInst(id);
      if (!that) return;
      that.roll('auto');
    }
  });

  // 初始化渲染
  jquery(function() {
    component$1.render();
  });

/**
 * element
 * 常用元素操作组件
 */


  layui.hint();
  var device$1 = layui.device();

  var MOD_NAME$3 = 'element';
  var THIS$1 = 'layui-this';
  var SHOW$1 = 'layui-show';
  var TITLE = '.layui-tab-title';

  var Element = function(){
    this.config = {};
  };

  // 全局设置
  Element.prototype.set = function(options){
    var that = this;
    jquery.extend(true, that.config, options);
    return that;
  };

  // 表单事件
  Element.prototype.on = function(events, callback){
    return layui.onevent.call(this, MOD_NAME$3, events, callback);
  };

  // 外部 Tab 新增
  Element.prototype.tabAdd = function(filter, options){
    var tabElem = jquery('.layui-tab[lay-filter='+ filter +']');
    var titElem = tabElem.children(TITLE);
    var barElem = titElem.children('.layui-tab-bar');
    var contElem = tabElem.children('.layui-tab-content');
    var li = '<li'+ function(){
      var layAttr = [];
      layui.each(options, function(key, value){
        if(/^(title|content)$/.test(key)) return;
        layAttr.push('lay-'+ key +'="'+ value +'"');
      });
      if(layAttr.length > 0) layAttr.unshift(''); //向前插，预留空格
      return layAttr.join(' ');
    }() +'>'+ (options.title || 'unnaming') +'</li>';

    barElem[0] ? barElem.before(li) : titElem.append(li);
    contElem.append('<div class="layui-tab-item" ' + (options.id ? 'lay-id="' + options.id + '"' : '') + '>'+ (options.content || '') +'</div>');
    // call.hideTabMore(true);
    // 是否添加即切换
    options.change && this.tabChange(filter, options.id);
    titElem.data('LAY_TAB_CHANGE', options.change);
    call.tabAuto(options.change ? 'change' : null, tabElem);
    return this;
  };

  /**
   * 外部 Tab 删除
   * @param {string} filter - 标签主容器 lay-filter 值
   * @param {string} layid - 标签头 lay-id 值
   * @param {boolean} force - 是否强制删除
   * @returns {this}
   */
  Element.prototype.tabDelete = function(filter, layid, force){
    var tabElem = jquery('.layui-tab[lay-filter='+ filter +']');
    var titElem = tabElem.children(TITLE);
    var liElem = titElem.find('>li[lay-id="'+ layid +'"]');
    call.tabDelete.call(liElem[0], {
      liElem: liElem,
      force: force
    });
    return this;
  };

  /**
   * 外部 Tab 切换
   * @param {string} filter - 标签主容器 lay-filter 值
   * @param {string} layid - 标签头 lay-id 值
   * @param {boolean} force - 是否强制切换
   * @returns {this}
   */
  Element.prototype.tabChange = function(filter, layid, force){
    var tabElem = jquery('.layui-tab[lay-filter='+ filter +']');
    var titElem = tabElem.children(TITLE);
    var liElem = titElem.find('>li[lay-id="'+ layid +'"]');

    call.tabClick.call(liElem[0], {
      liElem: liElem,
      force: force
    });
    return this;
  };

  // 自定义 Tab 选项卡
  Element.prototype.tab = function(options){
    options = options || {};
    dom.on('click', options.headerElem, function(e){
      var index = jquery(options.headerElem).index(jquery(this));
      call.tabClick.call(this, {
        index: index,
        options: options
      });
    });
  };


  // 动态改变进度条
  Element.prototype.progress = function(filter, percent){
    var ELEM = 'layui-progress';
    var elem = jquery('.'+ ELEM +'[lay-filter='+ filter +']');
    var elemBar = elem.find('.'+ ELEM +'-bar');
    var text = elemBar.find('.'+ ELEM +'-text');

    elemBar.css('width', function(){
      return /^.+\/.+$/.test(percent)
        ? (new Function('return '+ percent)() * 100) + '%'
     : percent;
    }).attr('lay-percent', percent);
    text.text(percent);
    return this;
  };

  var NAV_ELEM = '.layui-nav';
  var NAV_ITEM = 'layui-nav-item';
  var NAV_BAR = 'layui-nav-bar';
  var NAV_TREE = 'layui-nav-tree';
  var NAV_CHILD = 'layui-nav-child';
  var NAV_CHILD_C = 'layui-nav-child-c';
  var NAV_MORE = 'layui-nav-more';
  var NAV_DOWN = 'layui-icon-down';
  var NAV_ANIM = 'layui-anim layui-anim-upbit';

  // 基础事件体
  var call = {
    // Tab 点击
    tabClick: function(obj){
      obj = obj || {};
      var options = obj.options || {};
      var othis = obj.liElem || jquery(this);
      var parents = options.headerElem
        ? othis.parent()
      : othis.parents('.layui-tab').eq(0);
      var item = options.bodyElem
        ? jquery(options.bodyElem)
      : parents.children('.layui-tab-content').children('.layui-tab-item');
      var elemA = othis.find('a');
      var isJump = elemA.attr('href') !== 'javascript:;' && elemA.attr('target') === '_blank'; // 是否存在跳转
      var unselect = typeof othis.attr('lay-unselect') === 'string'; // 是否禁用选中
      var filter = parents.attr('lay-filter');
      var hasId = othis.attr('lay-id');

      // 下标
      var index = 'index' in obj
        ? obj.index
      : othis.parent().children('li').index(othis);

      // 若非强制切换，则根据 tabBeforeChange 事件的返回结果决定是否切换
      if (!obj.force) {
        var liThis = othis.siblings('.' + THIS$1);
        var shouldChange = layui.event.call(this, MOD_NAME$3, 'tabBeforeChange('+ filter +')', {
          elem: parents,
          from: {
            index: othis.parent().children('li').index(liThis),
            id: liThis.attr('lay-id')
          },
          to: {
            index: index,
            id: hasId
          },
        });
        if(shouldChange === false) return;
      }

      // 执行切换
      if(!(isJump || unselect)){
        othis.addClass(THIS$1).siblings().removeClass(THIS$1);
        if(hasId){
          var contentElem = item.filter('[lay-id="' +  hasId + '"]');
          contentElem = contentElem.length ? contentElem : item.eq(index);
          contentElem.addClass(SHOW$1).siblings().removeClass(SHOW$1);
        }else {
          item.eq(index).addClass(SHOW$1).siblings().removeClass(SHOW$1);
        }
      }

      layui.event.call(this, MOD_NAME$3, 'tab('+ filter +')', {
        elem: parents,
        index: index,
        id: hasId
      });
    }

    // Tab 删除
    ,tabDelete: function(obj){
      obj = obj || {};

      var li = obj.liElem || jquery(this).parent();
      var index = li.parent().children('li').index(li);
      var tabElem = li.closest('.layui-tab');
      var item = tabElem.children('.layui-tab-content').children('.layui-tab-item');
      var filter = tabElem.attr('lay-filter');
      var hasId = li.attr('lay-id');

      // 若非强制删除，则根据 tabBeforeDelete 事件的返回结果决定是否删除
      if (!obj.force) {
        var shouldClose = layui.event.call(li[0], MOD_NAME$3, 'tabBeforeDelete('+ filter +')', {
          elem: tabElem,
          index: index,
          id: hasId
        });
        if(shouldClose === false) return;
      }

      if(li.hasClass(THIS$1)){
        if (li.next()[0] && li.next().is('li')){
          call.tabClick.call(li.next()[0], {
            index: index + 1
          });
        } else if (li.prev()[0] && li.prev().is('li')){
          call.tabClick.call(li.prev()[0], null, index - 1);
        }
      }

      li.remove();
      if(hasId){
        var contentElem = item.filter('[lay-id="' +  hasId + '"]');
        contentElem = contentElem.length ? contentElem : item.eq(index);
        contentElem.remove();
      }else {
        item.eq(index).remove();
      }
      setTimeout(function(){
        call.tabAuto(null, tabElem);
      }, 50);

      layui.event.call(this, MOD_NAME$3, 'tabDelete('+ filter +')', {
        elem: tabElem,
        index: index,
        id: hasId
      });
    }

    // Tab 自适应
    ,tabAuto: function(spread, elem){
      var MORE = 'layui-tab-more';
      var BAR = 'layui-tab-bar';
      var CLOSE = 'layui-tab-close';
      var that = this;
      var targetElem = elem || jquery('.layui-tab');

      targetElem.each(function(){
        var othis = jquery(this);
        var title = othis.children('.layui-tab-title');
        othis.children('.layui-tab-content').children('.layui-tab-item');
        var STOPE = 'lay-stope="tabmore"';
        var span = jquery('<span class="layui-unselect layui-tab-bar" '+ STOPE +'><i '+ STOPE +' class="layui-icon">&#xe61a;</i></span>');

        if(that === window && device$1.ie != 8);

        // 开启关闭图标
        var allowclose = othis.attr('lay-allowclose');
        if(allowclose && allowclose !== 'false'){
          title.find('li').each(function(){
            var li = jquery(this);
            if(!li.find('.'+CLOSE)[0] && li.attr('lay-allowclose') !== 'false'){
              var close = jquery('<i class="layui-icon layui-icon-close layui-unselect '+ CLOSE +'"></i>');
              close.on('click', function(e) {
                call.tabDelete.call(this, {
                  e: e
                });
              });
              li.append(close);
            }
          });
        }

        if(typeof othis.attr('lay-unauto') === 'string') return;

        // 响应式
        if(
          title.prop('scrollWidth') > title.outerWidth() + 1 || (
            title.find('li').length && title.height() > function(height){
              return height + height/2;
            }(title.find('li').eq(0).height())
          )
        ){
          // 若执行是来自于切换，则自动展开
          (
            spread === 'change' && title.data('LAY_TAB_CHANGE')
          ) && title.addClass(MORE);

          if(title.find('.'+BAR)[0]) return;
          title.append(span);
          othis.attr('overflow', '');

          // 展开图标事件
          span.on('click', function(e){
            var isSpread = title.hasClass(MORE);
            title[isSpread ? 'removeClass' : 'addClass'](MORE);
          });
        } else {
          title.find('.'+ BAR).remove();
          othis.removeAttr('overflow');
        }
      });
    }
    // 隐藏更多 Tab
    ,hideTabMore: function(e){
      var tsbTitle = jquery('.layui-tab-title');
      if(e === true || jquery(e.target).attr('lay-stope') !== 'tabmore'){
        tsbTitle.removeClass('layui-tab-more');
        tsbTitle.find('.layui-tab-bar').attr('title','');
      }
    }

    //点击一级菜单
    /*
    ,clickThis: function(){
      var othis = $(this), parents = othis.parents(NAV_ELEM)
      ,filter = parents.attr('lay-filter')
      ,elemA = othis.find('a')
      ,unselect = typeof othis.attr('lay-unselect') === 'string';

      if(othis.find('.'+NAV_CHILD)[0]) return;

      if(!(elemA.attr('href') !== 'javascript:;' && elemA.attr('target') === '_blank') && !unselect){
        parents.find('.'+THIS).removeClass(THIS);
        othis.addClass(THIS);
      }

      layui.event.call(this, MOD_NAME, 'nav('+ filter +')', othis);
    }
    )
    */

    // 点击菜单 - a 标签触发
    ,clickThis: function() {
      var othis = jquery(this);
      var parents = othis.closest(NAV_ELEM);
      var filter = parents.attr('lay-filter');
      var parent = othis.parent() ;
      var child = othis.siblings('.'+ NAV_CHILD);
      var unselect = typeof parent.attr('lay-unselect') === 'string'; // 是否禁用选中

      // 满足点击选中的条件
      if (!(othis.attr('href') !== 'javascript:;' && othis.attr('target') === '_blank') && !unselect) {
        if (!child[0]) {
          parents.find('.'+ THIS$1).removeClass(THIS$1);
          parent.addClass(THIS$1);
        }
      }

      // 若为垂直菜单
      if (parents.hasClass(NAV_TREE)) {
        var NAV_ITEMED = NAV_ITEM + 'ed'; // 用于标注展开状态
        var needExpand = !parent.hasClass(NAV_ITEMED); // 是否执行展开
        var ANIM_MS = 200; // 动画过渡毫秒数

        // 动画执行完成后的操作
        var complete = function() {
          jquery(this).css({
            "display": "" // 剔除动画生成的 style display，以适配外部样式的状态重置
          });
          // 避免导航滑块错位
          parents.children('.'+ NAV_BAR).css({
            opacity: 0
          });
        };

        // 是否正处于动画中的状态
        if (child.is(':animated')) return;

        // 剔除可能存在的 CSS3 动画类
        child.removeClass(NAV_ANIM);

        // 若有子菜单，则对其执行展开或收缩
        if (child[0]) {
          if (needExpand) {
            // 先执行 slideDown 动画，再标注展开状态样式，避免元素 `block` 状态导致动画无效
            child.slideDown(ANIM_MS, complete);
            parent.addClass(NAV_ITEMED);
          } else {
            // 先取消展开状态样式，再将元素临时显示，避免 `none` 状态导致 slideUp 动画无效
            parent.removeClass(NAV_ITEMED);
            child.show().slideUp(ANIM_MS, complete);
          }

          // 手风琴 --- 收缩兄弟展开项
          if (typeof parents.attr('lay-accordion') === 'string' || parents.attr('lay-shrink') === 'all') {
            var parentSibs = parent.siblings('.'+ NAV_ITEMED);
            parentSibs.removeClass(NAV_ITEMED);
            parentSibs.children('.'+ NAV_CHILD).show().stop().slideUp(ANIM_MS, complete);
          }
        }
      }

      layui.event.call(this, MOD_NAME$3, 'nav('+ filter +')', othis);
    }

    // 折叠面板
    ,collapse: function() {
      var othis = jquery(this);
      var wrapper = othis.closest('.layui-collapse');
      var filter = wrapper.attr('lay-filter');

      var ANIM_MS = 200; // 动画过渡毫秒数
      var CLASS_ITEM = '.layui-colla-item';
      var CLASS_CONTENT = '.layui-colla-content';

      var thisItemElem = othis.parent(CLASS_ITEM);
      var thisContentElem = othis.siblings(CLASS_CONTENT);
      var isNone = thisContentElem.css('display') === 'none';
      var isAccordion = typeof wrapper.attr('lay-accordion') === 'string';

      // 动画执行完成后的操作
      var complete = function() {
        jquery(this).css('display', ''); // 剔除动画生成的 style display，以适配外部样式的状态重置
      };

      // 是否正处于动画中的状态
      if (thisContentElem.is(':animated')) return;

      // 展开或收缩
      if (isNone) {
        // 先执行 slideDown 动画，再标注展开状态样式，避免元素 `block` 状态导致动画无效
        thisContentElem.slideDown(ANIM_MS, complete);
        thisItemElem.addClass(SHOW$1);
      } else {
        // 先取消展开状态样式，再将元素临时显示，避免 `none` 状态导致 slideUp 动画无效
        thisItemElem.removeClass(SHOW$1);
        thisContentElem.show().slideUp(ANIM_MS, complete);
      }

      // 是否开启手风琴
      if (isAccordion) {
        var itemSiblings = thisItemElem.siblings('.'+ SHOW$1);
        itemSiblings.removeClass(SHOW$1);
        itemSiblings.children(CLASS_CONTENT).show().slideUp(ANIM_MS, complete);
      }

      // 事件
      layui.event.call(this, MOD_NAME$3, 'collapse('+ filter +')', {
        title: othis,
        content: thisContentElem,
        show: isNone
      });
    }
  };

  // 初始化元素操作
  Element.prototype.init = function(type, filter){
    var elemFilter = function(){
      return (typeof filter === 'string' && filter) ? ('[lay-filter="' + filter +'"]') : '';
    }(), items = {

      // Tab 选项卡
      tab: function(elem){
        var TAB_ELEM = '.layui-tab';
        var targetElem = elem || jquery(TAB_ELEM + elemFilter);
        call.tabAuto.call({}, null, targetElem);
      }

      // 导航菜单
      ,nav: function(elem){
        var TIME = 200;
        var timer = {};
        var timerMore = {};
        var timeEnd = {};
        var NAV_TITLE = 'layui-nav-title';

        // 滑块跟随
        var follow = function(bar, nav, index) {
          var othis = jquery(this);
          var child = othis.find('.'+NAV_CHILD);

          // 是否垂直导航菜单
          if (nav.hasClass(NAV_TREE)) {
            // 无子菜单时跟随
            if (!child[0]) {
              var thisA = othis.children('.'+ NAV_TITLE);
              bar.css({
                top: othis.offset().top - nav.offset().top,
                height: (thisA[0] ? thisA : othis).outerHeight(),
                opacity: 1
              });
            }
          } else {
            child.addClass(NAV_ANIM);

            // 若居中对齐
            if (child.hasClass(NAV_CHILD_C)) {
              child.css({
                left: -(child.outerWidth() - othis.width()) / 2
              });
            }

            // 滑块定位
            if (child[0]) { // 若有子菜单，则滑块消失
              bar.css({
                left: bar.position().left + bar.width() / 2,
                width: 0,
                opacity: 0
              });
            } else { // bar 跟随
              bar.css({
                left: othis.position().left + parseFloat(othis.css('marginLeft')),
                top: othis.position().top + othis.height() - bar.height()
              });
            }

            // 渐显滑块并适配宽度
            timer[index] = setTimeout(function() {
              bar.css({
                width: child[0] ? 0 : othis.width(),
                opacity: child[0] ? 0 : 1
              });
            }, device$1.ie && device$1.ie < 10 ? 0 : TIME);

            // 显示子菜单
            clearTimeout(timeEnd[index]);
            if (child.css('display') === 'block') {
              clearTimeout(timerMore[index]);
            }
            timerMore[index] = setTimeout(function(){
              child.addClass(SHOW$1);
              othis.find('.'+NAV_MORE).addClass(NAV_MORE+'d');
            }, 300);
          }
        };

        // 遍历导航
        var targetElem = elem || jquery(NAV_ELEM + elemFilter);
        targetElem.each(function(index) {
          var othis = jquery(this);
          var bar = jquery('<span class="'+ NAV_BAR +'"></span>');
          var itemElem = othis.find('.'+NAV_ITEM);

          // hover 滑动效果
          var hasBarElem = othis.find('.'+NAV_BAR);
          if (hasBarElem[0]) hasBarElem.remove();
          othis.append(bar);
          ( othis.hasClass(NAV_TREE)
            ? itemElem.find('dd,>.'+ NAV_TITLE)
            : itemElem
          ).off('mouseenter.lay_nav').on('mouseenter.lay_nav', function() {
            follow.call(this, bar, othis, index);
          }).off('mouseleave.lay_nav').on('mouseleave.lay_nav', function() { // 鼠标移出
            // 是否为垂直导航
            if (othis.hasClass(NAV_TREE)) {
              bar.css({
                height: 0,
                opacity: 0
              });
            } else {
              // 隐藏子菜单
              clearTimeout(timerMore[index]);
              timerMore[index] = setTimeout(function(){
                othis.find('.'+ NAV_CHILD).removeClass(SHOW$1);
                othis.find('.'+ NAV_MORE).removeClass(NAV_MORE +'d');
              }, 300);
            }
          });

          // 鼠标离开当前菜单时
          othis.off('mouseleave.lay_nav').on('mouseleave.lay_nav', function() {
            clearTimeout(timer[index]);
            timeEnd[index] = setTimeout(function() {
              if (!othis.hasClass(NAV_TREE)) {
                bar.css({
                  width: 0,
                  left: bar.position().left + bar.width() / 2,
                  opacity: 0
                });
              }
            }, TIME);
          });

          // 展开子菜单
          itemElem.find('a').each(function() {
            var thisA = jquery(this);
            thisA.parent();
            var child = thisA.siblings('.'+ NAV_CHILD);

            // 输出小箭头
            if (child[0] && !thisA.children('.'+ NAV_MORE)[0]) {
              thisA.append('<i class="layui-icon '+ NAV_DOWN +' '+ NAV_MORE +'"></i>');
            }

            thisA.off('click', call.clickThis).on('click', call.clickThis); // 点击菜单
          });
        });
      }

      //面包屑
      ,breadcrumb: function(elem){
        var ELEM = '.layui-breadcrumb';
        var targetElem = elem || jquery(ELEM + elemFilter);

        targetElem.each(function(){
          var othis = jquery(this)
          ,ATTE_SPR = 'lay-separator'
          ,separator = othis.attr(ATTE_SPR) || '/'
          ,aNode = othis.find('a');
          if(aNode.next('span['+ ATTE_SPR +']')[0]) return;
          aNode.each(function(index){
            if(index === aNode.length - 1) return;
            jquery(this).after('<span '+ ATTE_SPR +'>'+ separator +'</span>');
          });
          othis.css('visibility', 'visible');
        });
      }

      //进度条
      ,progress: function(elem){
        var ELEM = 'layui-progress';
        var targetElem = elem || jquery('.' + ELEM + elemFilter);

        targetElem.each(function(){
          var othis = jquery(this)
          ,elemBar = othis.find('.layui-progress-bar')
          ,percent = elemBar.attr('lay-percent');

          elemBar.css('width', function(){
            return /^.+\/.+$/.test(percent)
              ? (new Function('return '+ percent)() * 100) + '%'
           : percent;
          });

          if(othis.attr('lay-showpercent')){
            setTimeout(function(){
              elemBar.html('<span class="'+ ELEM +'-text">'+ percent +'</span>');
            },350);
          }
        });
      }

      // 折叠面板
      ,collapse: function(elem) {
        var ELEM = 'layui-collapse';
        var targetElem = elem || jquery('.' + ELEM + elemFilter);

        targetElem.each(function() {
          var elemItem = jquery(this).find('.layui-colla-item');
          elemItem.each(function() {
            var othis = jquery(this);
            var elemTitle = othis.find('.layui-colla-title');
            var elemCont = othis.find('.layui-colla-content');
            var isNone = elemCont.css('display') === 'none';

            // 初始状态
            elemTitle.find('.layui-colla-icon').remove();
            elemTitle.append('<i class="layui-icon layui-icon-right layui-colla-icon"></i>');
            othis[isNone ? 'removeClass' : 'addClass'](SHOW$1);

            // 兼容旧版（ < 2.11.3）
            if (elemCont.hasClass(SHOW$1)) {
              elemCont.removeClass(SHOW$1);
            }

            // 点击标题
            elemTitle.off('click', call.collapse).on('click', call.collapse);
          });
        });
      }
    };

    if(type && typeof filter === 'object' && filter instanceof jquery){
      var targetElem = filter;
      return items[type](targetElem);
    }

    return items[type] ? items[type]() : layui.each(items, function(index, item){
      item();
    });
  };

  Element.prototype.render = Element.prototype.init;

  var element = new Element();
  var dom = jquery(document);

  jquery(function(){
    element.render();
  });

  dom.on('click', '.layui-tab-title li', call.tabClick); // Tab 切换
  // dom.on('click', call.hideTabMore); // 隐藏展开的 Tab
  jquery(window).on('resize', call.tabAuto); // 自适应

/**
 * rate
 * 评分组件
 */


  // 创建组件
  var component = component$2({
    name: 'rate',

    // 默认配置
    config: {
      length: 5,  // 评分的最大长度值
      value: 0, // 评分的初始值
      half: false,  // 是否可以选择半星
      text: false,  // 是否显示评分对应的文本
      readonly: false,  // 是否只读
      theme: '' // 主题颜色
    },

    CONST: {
      ELEM: 'layui-rate',
      ICON_RATE: 'layui-icon-rate',
      ICON_RATE_SOLID: 'layui-icon-rate-solid',
      ICON_RATE_HALF: 'layui-icon-rate-half',
      ICON_SOLID_HALF: 'layui-icon-rate-solid layui-icon-rate-half',
      ICON_SOLID_RATE: 'layui-icon-rate-solid layui-icon-rate',
      ICON_HALF_RATE: 'layui-icon-rate layui-icon-rate-half',
    },

    // 渲染
    render: function() {
      var that = this;
      var options = that.config;

      // 自定义主题
      var style = options.theme ? ('style="color: '+ options.theme + ';"') : '';

      // 最大值不能大于总长度
      if (options.value > options.length) {
        options.value = options.length;
      }

      // 如果没有选择半星的属性，却给了小数的数值，统一向上或向下取整
      if (parseInt(options.value) !== options.value) {
        if (!options.half) {
          options.value = (Math.ceil(options.value) - options.value) < 0.5
            ? Math.ceil(options.value)
            : Math.floor(options.value);
        }
      }

      // 组件模板
      var template = '<ul class="layui-rate" '+ (options.readonly ? 'readonly' : '') +'>';
      for (var i = 1; i <= options.length; i++) {
        var item = '<li class="layui-inline"><i class="layui-icon '
          + (i > Math.floor(options.value) ? CONST$1.ICON_RATE : CONST$1.ICON_RATE_SOLID)
        + '" '+ style +'></i></li>';
        if (options.half && parseInt(options.value) !== options.value && i == Math.ceil(options.value)) {
          template = template + '<li><i class="layui-icon layui-icon-rate-half" '+ style +'></i></li>';
        } else {
          template = template + item;
        }
      }
      template += '</ul>';

      if (options.text) {
        template += '<span class="layui-inline">'+ options.value + '</span>';
      }

      // 开始插入替代元素
      var othis = options.elem;
      var hasRender = othis.next('.' + CONST$1.ELEM);

      // 生成替代元素
      hasRender[0] && hasRender.remove(); // 如果已经渲染，则 Rerender
      that.elemTemplate = jquery(template);

      options.span = that.elemTemplate.next('span');
      options.setText && options.setText(options.value);

      othis.html(that.elemTemplate);
      othis.addClass("layui-inline");

      // 若非只读，则添加触控事件
      if (!options.readonly) {
        that.action();
      }
    },

    // 扩展实例方法
    extendsInstance: function() {
      var that = this;
      var options = that.config;
      return {
        setvalue: function (value) {
          options.value = value;
          that.render();
        }
      };
    }
  });

  var CONST$1 = component.CONST;

  /**
   * 扩展组件原型方法
   */

  var Class$3 = component.Class;

  // li 相关事件
  Class$3.prototype.action = function() {
    var that = this;
    var options = that.config;
    var _ul = that.elemTemplate;
    var wide = _ul.find("i").width();
    var liElems =  _ul.children("li");

    liElems.each(function(index) {
      var ind = index + 1;
      var othis = jquery(this);

      // 点击
      othis.on('click', function(e) {
        // 将当前点击li的索引值赋给 value
        options.value = ind;
        if (options.half) {
          // 获取鼠标在 li 上的位置
          var x = e.pageX - jquery(this).offset().left;
          if (x <= wide / 2) {
            options.value = options.value - 0.5;
          }
        }

        if (options.text) {
          _ul.next("span").text(options.value);
        }

        options.choose && options.choose(options.value);
        options.setText && options.setText(options.value);
      });

      // 移入
      othis.on('mousemove', function(e) {
        _ul.find("i").each(function() {
          jquery(this).addClass(CONST$1.ICON_RATE).removeClass(CONST$1.ICON_SOLID_HALF);
        });
        _ul.find("i:lt(" + ind + ")").each(function() {
          jquery(this).addClass(CONST$1.ICON_RATE_SOLID).removeClass(CONST$1.ICON_HALF_RATE);
        });
        // 如果设置可选半星，那么判断鼠标相对 li 的位置
        if (options.half) {
          var x = e.pageX - jquery(this).offset().left;
          if (x <= wide / 2) {
            othis.children("i").addClass(CONST$1.ICON_RATE_HALF).removeClass(CONST$1.ICON_RATE_SOLID);
          }
        }
      });

      // 移出
      othis.on('mouseleave', function() {
        _ul.find("i").each(function() {
          jquery(this).addClass(CONST$1.ICON_RATE).removeClass(CONST$1.ICON_SOLID_HALF);
        });
        _ul.find("i:lt(" + Math.floor(options.value) + ")").each(function() {
          jquery(this).addClass(CONST$1.ICON_RATE_SOLID).removeClass(CONST$1.ICON_HALF_RATE);
        });
        // 如果设置可选半星，根据分数判断是否有半星
        if (options.half) {
          if (parseInt(options.value) !== options.value) {
            _ul.children("li:eq(" + Math.floor(options.value) + ")").children("i").addClass(CONST$1.ICON_RATE_HALF).removeClass(CONST$1.ICON_SOLID_RATE);
          }
        }
      });

    });

    lay.touchSwipe(_ul, {
      onTouchMove: function(e, state) {
        if(Date.now() - state.timeStart <= 200) return;
        var pageX = e.touches[0].pageX;
        var rateElemWidth = _ul.width();
        var itemElemWidth = rateElemWidth / options.length; // 单颗星的宽度
        var offsetX = pageX - _ul.offset().left;
        var num = offsetX / itemElemWidth; // 原始值
        var remainder = num % 1;
        var integer = num - remainder;

        // 最终值
        var score = remainder <= 0.5 && options.half ? integer + 0.5 : Math.ceil(num);
        if(score > options.length) score = options.length;
        if(score < 0) score = 0;

        liElems.each(function(index) {
          var iconElem = jquery(this).children('i');
          var isActiveIcon = (Math.ceil(score) - index === 1);
          var needSelect = Math.ceil(score) > index;
          var shouldHalfIcon = (score - index === 0.5);

          if (needSelect) {
            // 设置选中样式
            iconElem.addClass(CONST$1.ICON_RATE_SOLID).removeClass(CONST$1.ICON_HALF_RATE);
            if(options.half && shouldHalfIcon){
              iconElem.addClass(CONST$1.ICON_RATE_HALF).removeClass(CONST$1.ICON_RATE_SOLID);
            }
          } else {
            // 恢复初始样式
            iconElem.addClass(CONST$1.ICON_RATE).removeClass(CONST$1.ICON_SOLID_HALF);
          }

          // 设置缩放样式
          iconElem.toggleClass('layui-rate-hover', isActiveIcon);
        });

        // 更新最终值
        options.value = score;
        if(options.text)  _ul.next("span").text(options.value);
        options.setText && options.setText(options.value);
      },
      onTouchEnd: function(e, state) {
        if(Date.now() - state.timeStart <= 200) return;
        _ul.find('i').removeClass('layui-rate-hover');
        options.choose && options.choose(options.value);
        options.setText && options.setText(options.value);
      }
    });
  };

/**
 * colorpicker
 * 颜色选择组件
 */


  var hint$1 = layui.hint();
  var device = layui.device();
  var clickOrMousedown = (device.mobile ? 'click' : 'mousedown');

  // 外部接口
  var colorpicker = {
    config: {},
    index: layui.colorpicker ? (layui.colorpicker.index + 10000) : 0,

    // 设置全局项
    set: function(options) {
      var that = this;
      that.config = jquery.extend({}, that.config, options);
      return that;
    },

    // 事件
    on: function(events, callback) {
      return layui.onevent.call(this, 'colorpicker', events, callback);
    }
  };

  // 操作当前实例
  var thisModule = function() {
    var that = this;
    var options = that.config;
    var id = options.id;

    thisModule.that[id] = that; // 记录当前实例对象

    return {
      config: options
    };
  }

  //字符常量
  ,MOD_NAME$2 = 'colorpicker', SHOW = 'layui-show', ELEM = 'layui-colorpicker'

  ,ELEM_MAIN = '.layui-colorpicker-main', ICON_PICKER_DOWN = 'layui-icon-down', ICON_PICKER_CLOSE = 'layui-icon-close'
  ,PICKER_TRIG_SPAN = 'layui-colorpicker-trigger-span', PICKER_TRIG_I = 'layui-colorpicker-trigger-i', PICKER_SIDE = 'layui-colorpicker-side', PICKER_SIDE_SLIDER = 'layui-colorpicker-side-slider'
  ,PICKER_BASIS = 'layui-colorpicker-basis', PICKER_ALPHA_BG = 'layui-colorpicker-alpha-bgcolor', PICKER_ALPHA_SLIDER = 'layui-colorpicker-alpha-slider', PICKER_BASIS_CUR = 'layui-colorpicker-basis-cursor', PICKER_INPUT = 'layui-colorpicker-main-input'

  //RGB转HSB
  ,RGBToHSB = function(rgb){
    var hsb = {h:0, s:0, b:0};
    var min = Math.min(rgb.r, rgb.g, rgb.b);
    var max = Math.max(rgb.r, rgb.g, rgb.b);
    var delta = max - min;
    hsb.b = max;
    hsb.s = max !== 0 ? 255*delta/max : 0;
    if(hsb.s !== 0){
      if(rgb.r == max){ // 因 rgb 中返回的数字为 string 类型
        hsb.h = (rgb.g - rgb.b) / delta;
      }else if(rgb.g == max){
        hsb.h = 2 + (rgb.b - rgb.r) / delta;
      }else {
        hsb.h = 4 + (rgb.r - rgb.g) / delta;
      }
    }else {
      hsb.h = -1;
    }
    if(max === min){
      hsb.h = 0;
    }
    hsb.h *= 60;
    if(hsb.h < 0) {
      hsb.h += 360;
    }
    hsb.s *= 100/255;
    hsb.b *= 100/255;
    return hsb;
  }

  //HEX转HSB
  ,HEXToHSB = function(hex){
    hex = hex.indexOf('#') > -1 ? hex.substring(1) : hex;
    if(hex.length === 3){
      var num = hex.split("");
      hex = num[0]+num[0]+num[1]+num[1]+num[2]+num[2];
    }
    hex = parseInt(hex, 16);
    var rgb = {r:hex >> 16, g:(hex & 0x00FF00) >> 8, b:(hex & 0x0000FF)};
    return RGBToHSB(rgb);
  }

  //HSB转RGB
  ,HSBToRGB = function(hsb){
    var rgb = {};
    var h = hsb.h;
    var s = hsb.s*255/100;
    var b = hsb.b*255/100;
    if(s === 0){
      rgb.r = rgb.g = rgb.b = b;
    }else {
      var t1 = b;
      var t2 = (255 - s) * b /255;
      var t3 = (t1 - t2) * (h % 60) /60;
      if(h === 360) h = 0;
      if(h < 60) {rgb.r=t1; rgb.b=t2; rgb.g=t2+t3;}
      else if(h < 120) {rgb.g=t1; rgb.b=t2; rgb.r=t1-t3;}
      else if(h < 180) {rgb.g=t1; rgb.r=t2; rgb.b=t2+t3;}
      else if(h < 240) {rgb.b=t1; rgb.r=t2; rgb.g=t1-t3;}
      else if(h < 300) {rgb.b=t1; rgb.g=t2; rgb.r=t2+t3;}
      else if(h < 360) {rgb.r=t1; rgb.g=t2; rgb.b=t1-t3;}
      else {rgb.r=0; rgb.g=0; rgb.b=0;}
    }
    return {r:Math.round(rgb.r), g:Math.round(rgb.g), b:Math.round(rgb.b)};
  }

  //HSB转HEX
  ,HSBToHEX = function(hsb){
    var rgb = HSBToRGB(hsb);
    var hex = [
      rgb.r.toString(16)
      ,rgb.g.toString(16)
      ,rgb.b.toString(16)
    ];
    jquery.each(hex, function(nr, val){
      if(val.length === 1){
        hex[nr] = '0' + val;
      }
    });
    return hex.join('');
  }

  //转化成所需rgb格式
  ,RGBSTo = function(rgbs){
    var regexp = /[0-9]{1,3}/g;
    var re = rgbs.match(regexp) || [];
    return {r:re[0], g:re[1], b:re[2]};
  }

  ,$win = jquery(window)
  ,$doc = jquery(document)

  //构造器
  ,Class$2 = function(options){
    var that = this;
    that.index = ++colorpicker.index;
    that.config = jquery.extend({}, that.config, colorpicker.config, options);
    that.render();
  };

  //默认配置
  Class$2.prototype.config = {
    color: ''  //默认颜色，默认没有
    ,size: null  //选择器大小
    ,alpha: false  //是否开启透明度
    ,format: 'hex'  //颜色显示/输入格式，可选 rgb,hex
    ,predefine: false //预定义颜色是否开启
    ,colors: [ //默认预定义颜色列表
      '#16baaa', '#16b777', '#1E9FFF', '#FF5722', '#FFB800', '#01AAED', '#999', '#c00', '#ff8c00','#ffd700'
      ,'#90ee90', '#00ced1', '#1e90ff', '#c71585', 'rgb(0, 186, 189)', 'rgb(255, 120, 0)', 'rgb(250, 212, 0)', '#393D49', 'rgba(0,0,0,.5)', 'rgba(255, 69, 0, 0.68)', 'rgba(144, 240, 144, 0.5)', 'rgba(31, 147, 255, 0.73)'
    ]
  };

  //初始颜色选择框
  Class$2.prototype.render = function(){
    var that = this;
    var options = that.config;

    // 若 elem 非唯一，则拆分为多个实例
    var elem = jquery(options.elem);
    if(elem.length > 1){
      layui.each(elem, function(){
        colorpicker.render(jquery.extend({}, options, {
          elem: this
        }));
      });
      return that;
    }

    // 合并 lay-options 属性上的配置信息
    jquery.extend(options, lay.options(elem[0]));

    //颜色选择框对象
    var elemColorBox = jquery(['<div class="layui-unselect layui-colorpicker">'
      ,'<span '+ (options.format == 'rgb' && options.alpha
          ? 'class="layui-colorpicker-trigger-bgcolor"'
        : '') +'>'
        ,'<span class="layui-colorpicker-trigger-span" '
          ,'lay-type="'+ (options.format == 'rgb' ? (options.alpha ? 'rgba' : 'torgb') : '') +'" '
          ,'style="'+ function(){
            var bgstr = '';
            if(options.color){
              bgstr = options.color;

              if((options.color.match(/[0-9]{1,3}/g) || []).length > 3){ //需要优化
                if(!(options.alpha && options.format == 'rgb')){
                  bgstr = '#' + HSBToHEX(RGBToHSB(RGBSTo(options.color)));
                }
              }

              return 'background: '+ bgstr;
            }

            return bgstr;
          }() +'">'
          ,'<i class="layui-icon layui-colorpicker-trigger-i '+ (options.color
            ? ICON_PICKER_DOWN
          : ICON_PICKER_CLOSE) +'"></i>'
        ,'</span>'
      ,'</span>'
    ,'</div>'].join(''));

    //初始化颜色选择框
    elem = options.elem = jquery(options.elem);
    options.size && elemColorBox.addClass('layui-colorpicker-'+ options.size); //初始化颜色选择框尺寸

    // 插入颜色选择框
    elem.addClass('layui-inline').html(
      that.elemColorBox = elemColorBox
    );

    // 初始化 id 属性 - 优先取 options > 元素 id > 自增索引
    options.id = 'id' in options ? options.id : (
      elem.attr('id') || that.index
    );

    // 获取背景色值
    that.color = that.elemColorBox.find('.'+ PICKER_TRIG_SPAN)[0].style.background;

    // 相关事件
    that.events();
  };

  //渲染颜色选择器
  Class$2.prototype.renderPicker = function(){
    var that = this
    ,options = that.config
    ,elemColorBox = that.elemColorBox[0]

    //颜色选择器对象
    ,elemPicker = that.elemPicker = jquery(['<div id="layui-colorpicker'+ that.index +'" data-index="'+ that.index +'" class="layui-anim layui-anim-downbit layui-colorpicker-main">'
      //颜色面板
      ,'<div class="layui-colorpicker-main-wrapper">'
        ,'<div class="layui-colorpicker-basis">'
          ,'<div class="layui-colorpicker-basis-white"></div>'
          ,'<div class="layui-colorpicker-basis-black"></div>'
          ,'<div class="layui-colorpicker-basis-cursor"></div>'
        ,'</div>'
        ,'<div class="layui-colorpicker-side">'
          ,'<div class="layui-colorpicker-side-slider"></div>'
        ,'</div>'
      ,'</div>'

      //透明度条块
      ,'<div class="layui-colorpicker-main-alpha '+ (options.alpha ? SHOW : '') +'">'
        ,'<div class="layui-colorpicker-alpha-bgcolor">'
          ,'<div class="layui-colorpicker-alpha-slider"></div>'
        ,'</div>'
      ,'</div>'

      //预设颜色列表
      ,function(){
        if(options.predefine){
          var list = ['<div class="layui-colorpicker-main-pre">'];
          layui.each(options.colors, function(i, v){
            list.push(['<div class="layui-colorpicker-pre'+ ((v.match(/[0-9]{1,3}/g) || []).length > 3
              ? ' layui-colorpicker-pre-isalpha'
            : '') +'">'
              ,'<div style="background:'+ v +'"></div>'
            ,'</div>'].join(''));
          });
          list.push('</div>');
          return list.join('');
        } else {
          return '';
        }
      }()

      //底部表单元素区域
      ,'<div class="layui-colorpicker-main-input">'
        ,'<div class="layui-inline">'
          ,'<input type="text" class="layui-input">'
        ,'</div>'
        ,'<div class="layui-btn-container">'
          ,'<button class="layui-btn layui-btn-primary layui-btn-sm" colorpicker-events="clear">清空</button>'
          ,'<button class="layui-btn layui-btn-sm" colorpicker-events="confirm">确定</button>'
        ,'</div'
      ,'</div>'
    ,'</div>'].join(''))

    ;that.elemColorBox.find('.' + PICKER_TRIG_SPAN)[0];

    //如果当前点击的颜色盒子已经存在选择器，则关闭
    if(jquery(ELEM_MAIN)[0] && jquery(ELEM_MAIN).data('index') == that.index){
      that.removePicker(Class$2.thisElemInd);
    } else { //插入颜色选择器
      that.removePicker(Class$2.thisElemInd);
      jquery('body').append(elemPicker);
    }

    // 记录当前执行的实例索引
    colorpicker.thisId = options.id;

    Class$2.thisElemInd = that.index; //记录最新打开的选择器索引
    Class$2.thisColor =  elemColorBox.style.background; //记录最新打开的选择器颜色选中值

    that.position();
    that.pickerEvents();
  };

  //颜色选择器移除
  Class$2.prototype.removePicker = function(index){
    var that = this;
    var options = that.config;
    var elem = jquery('#layui-colorpicker'+ (index || that.index));

    if(elem[0]){
      elem.remove();
      delete colorpicker.thisId;

      // 面板关闭后的回调
      typeof options.close === 'function' && options.close(that.color);
    }

    return that;
  };

  //定位算法
  Class$2.prototype.position = function(){
    var that = this
    ,options = that.config;
    lay.position(that.bindElem || that.elemColorBox[0], that.elemPicker[0], {
      position: options.position
      ,align: 'center'
    });
    return that;
  };

  //颜色选择器赋值
  Class$2.prototype.val = function(){
    var that = this
    ;that.config

    ;var elemColorBox = that.elemColorBox.find('.' + PICKER_TRIG_SPAN)
    ,elemPickerInput = that.elemPicker.find('.' + PICKER_INPUT)
    ,e = elemColorBox[0]
    ,bgcolor = e.style.backgroundColor;

    //判断是否有背景颜色
    if(bgcolor){

      //转化成hsb格式
      var hsb = RGBToHSB(RGBSTo(bgcolor))
      ,type = elemColorBox.attr('lay-type');

      //同步滑块的位置及颜色选择器的选择
      that.select(hsb.h, hsb.s, hsb.b);

      // 若格式要求为rgb
      if(type === 'torgb'){
        elemPickerInput.find('input').val(bgcolor);
      } else if(type === 'rgba'){ // 若格式要求为 rgba
        var rgb = RGBSTo(bgcolor);

        // 若开启透明度而没有设置，则给默认值
        if((bgcolor.match(/[0-9]{1,3}/g) || []).length === 3){
          elemPickerInput.find('input').val('rgba('+ rgb.r +', '+ rgb.g +', '+ rgb.b +', 1)');
          that.elemPicker.find('.'+ PICKER_ALPHA_SLIDER).css("left", 280);
        } else {
          elemPickerInput.find('input').val(bgcolor);
          var left = bgcolor.slice(bgcolor.lastIndexOf(",") + 1, bgcolor.length - 1) * 280;
          that.elemPicker.find('.'+ PICKER_ALPHA_SLIDER).css("left", left);
        }

        // 设置 span 背景色
        that.elemPicker.find('.'+ PICKER_ALPHA_BG)[0].style.background = 'linear-gradient(to right, rgba('+ rgb.r +', '+ rgb.g +', '+ rgb.b +', 0), rgb('+ rgb.r +', '+ rgb.g +', '+ rgb.b +'))';
      } else {
        elemPickerInput.find('input').val('#'+ HSBToHEX(hsb));
      }
    } else {
      // 若没有背景颜色则默认到最初始的状态
      that.select(0,100,100);
      elemPickerInput.find('input').val("");
      that.elemPicker.find('.'+ PICKER_ALPHA_BG)[0].style.background = '';
      that.elemPicker.find('.'+ PICKER_ALPHA_SLIDER).css("left", 280);
    }
  };

  //颜色选择器滑动 / 点击
  Class$2.prototype.side = function(){
    var that = this
    ,options = that.config

    ,span = that.elemColorBox.find('.' + PICKER_TRIG_SPAN)
    ,type = span.attr('lay-type')

    ,side = that.elemPicker.find('.' + PICKER_SIDE)
    ,slider = that.elemPicker.find('.' + PICKER_SIDE_SLIDER)
    ,basis = that.elemPicker.find('.' + PICKER_BASIS)
    ,choose = that.elemPicker.find('.' + PICKER_BASIS_CUR)
    ,alphacolor = that.elemPicker.find('.' + PICKER_ALPHA_BG)
    ,alphaslider = that.elemPicker.find('.' + PICKER_ALPHA_SLIDER)

    ,_h = slider[0].offsetTop/180*360
    ,_b = 100 - (choose[0].offsetTop)/180*100
    ,_s = (choose[0].offsetLeft)/260*100
    ,_a = Math.round(alphaslider[0].offsetLeft/280*100)/100

    ,i = that.elemColorBox.find('.' + PICKER_TRIG_I)
    ,pre = that.elemPicker.find('.layui-colorpicker-pre').children('div')

    ,change = function(x,y,z,a){
      that.select(x, y, z);
      var rgb = HSBToRGB({h:x, s:y, b:z});
      var color = HSBToHEX({h:x, s:y, b:z});
      var elemInput = that.elemPicker.find('.' + PICKER_INPUT).find('input');

      i.addClass(ICON_PICKER_DOWN).removeClass(ICON_PICKER_CLOSE);
      span[0].style.background = 'rgb('+ rgb.r +', '+ rgb.g +', '+ rgb.b +')';

      if(type === 'torgb'){
        elemInput.val('rgb('+ rgb.r +', '+ rgb.g +', '+ rgb.b +')');
      } else if(type  === 'rgba'){
        var left = a * 280;
        alphaslider.css("left", left);
        elemInput.val('rgba('+ rgb.r +', '+ rgb.g +', '+ rgb.b +', '+ a +')');
        span[0].style.background = 'rgba('+ rgb.r +', '+ rgb.g +', '+ rgb.b +', '+ a +')';
        alphacolor[0].style.background = 'linear-gradient(to right, rgba('+ rgb.r +', '+ rgb.g +', '+ rgb.b +', 0), rgb('+ rgb.r +', '+ rgb.g +', '+ rgb.b +'))';
      } else {
        elemInput.val('#'+ color);
      }

      //回调更改的颜色
      options.change && options.change(jquery.trim(that.elemPicker.find('.' + PICKER_INPUT).find('input').val()));
    }

    //拖拽元素
    ,elemMove = jquery(['<div class="layui-auxiliar-moving" id="LAY-colorpicker-moving"></div>'].join(''))
    ,createMoveElem = function(call){
      jquery('#LAY-colorpicker-moving')[0] || jquery('body').append(elemMove);
      elemMove.on('mousemove', call);
      elemMove.on('mouseup', function(){
        elemMove.remove();
      }).on('mouseleave', function(){
        elemMove.remove();
      });
    };
    // 移动端滑动模拟事件中
    // 1. 不触发游标上绑定的事件，以提高性能，使滑动更流畅
    // 2. 游标上的事件需要冒泡到颜色拾取区域，用来模拟拖动游标的效果
    var needTrigger = true;
    var needStopPropagation = true;

    //右侧主色选择
    slider.on('mousedown', function(e, triggerEvent){
      var oldtop = this.offsetTop;
      var oldy = e.clientY === undefined ? triggerEvent.clientY : e.clientY;
      var move = function(e){
        var top = oldtop + (e.clientY - oldy)
        ,maxh = side[0].offsetHeight;
        if(top < 0)top = 0;
        if(top > maxh)top = maxh;
        var h = top/180*360;
        _h = h;
        change(h, _s, _b, _a);
        e.preventDefault();
      };
      needStopPropagation && layui.stope(e);
      createMoveElem(move);
      e.preventDefault();
    });

    side.on('mousedown', function(e){
      var top = e.clientY - jquery(this).offset().top + $win.scrollTop();
      if(top < 0)top = 0;
      if(top > this.offsetHeight) top = this.offsetHeight;
      var h = top/180*360;
      _h = h;
      change(h, _s, _b, _a);
      e.preventDefault();
      needTrigger && slider.trigger('mousedown', e);
    });

    //中间小圆点颜色选择
    choose.on('mousedown', function(e, triggerEvent){
      var oldtop = this.offsetTop;
      var oldleft = this.offsetLeft;
      var oldy = e.clientY === undefined ? triggerEvent.clientY : e.clientY;
      var oldx = e.clientX === undefined ?  triggerEvent.clientX : e.clientX;
      var move = function(e){
        var top = oldtop + (e.clientY - oldy)
        ,left = oldleft + (e.clientX - oldx)
        ,maxh = basis[0].offsetHeight
        ,maxw = basis[0].offsetWidth;
        if(top < 0)top = 0;
        if(top > maxh)top = maxh;
        if(left < 0)left = 0;
        if(left > maxw)left = maxw;
        var s = left/260*100
        ,b = 100 - top/180*100;
        _b = b;
        _s = s;
        change(_h, s, b, _a);
        e.preventDefault();
      };
      needStopPropagation && layui.stope(e);
      createMoveElem(move);
      e.preventDefault();
    });

    basis.on('mousedown', function(e){
      var top = e.clientY - jquery(this).offset().top + $win.scrollTop()
      ,left = e.clientX - jquery(this).offset().left + $win.scrollLeft();
      if(top < 0)top = 0;
      if(top > this.offsetHeight)top = this.offsetHeight;
      if(left < 0)left = 0;
      if(left > this.offsetWidth)left = this.offsetWidth;
      var s = left/260*100
      ,b = 100 - top/180*100;
      _b = b;
      _s = s;
      change(_h, s, b, _a);
      layui.stope(e);
      e.preventDefault();
      needTrigger && choose.trigger('mousedown', e);
    });

    //底部透明度选择
    alphaslider.on('mousedown', function(e, triggerEvent){
      var oldleft = this.offsetLeft;
      var oldx = e.clientX === undefined ? triggerEvent.clientX : e.clientX;
      var move = function(e){
        var left = oldleft + (e.clientX - oldx)
        ,maxw = alphacolor[0].offsetWidth;
        if(left < 0)left = 0;
        if(left > maxw)left = maxw;
        var a = Math.round(left /280*100) /100;
        _a = a;
        change(_h, _s, _b, a);
        e.preventDefault();
      };

      needStopPropagation && layui.stope(e);
      createMoveElem(move);
      e.preventDefault();
    });
    alphacolor.on('mousedown', function(e){
      var left = e.clientX - jquery(this).offset().left;
      if(left < 0)left = 0;
      if(left > this.offsetWidth)left = this.offsetWidth;
      var a = Math.round(left /280*100) /100;
      _a = a;
      change(_h, _s, _b, a);
      e.preventDefault();
      needTrigger && alphaslider.trigger('mousedown', e);
    });

    //预定义颜色选择
    pre.each(function(){
      jquery(this).on('click', function(){
        jquery(this).parent('.layui-colorpicker-pre').addClass('selected').siblings().removeClass('selected');
        var color = this.style.backgroundColor
        ,hsb = RGBToHSB(RGBSTo(color))
        ,a = color.slice(color.lastIndexOf(",") + 1, color.length - 1);
        _h = hsb.h;
        _s = hsb.s;
        _b = hsb.b;
        if((color.match(/[0-9]{1,3}/g) || []).length === 3) a = 1;
        _a = a;
        change(hsb.h, hsb.s, hsb.b, a);
      });
    });

    if(!lay.touchEventsSupported()) return;
    // 触摸事件模拟
    layui.each([
      {elem: side, eventType: 'mousedown'},
      {elem: alphacolor, eventType: 'mousedown'},
      {elem: basis, eventType: 'mousedown'}
    ], function(i, obj){
      lay.touchSwipe(obj.elem, {
        onTouchStart: function(){
          needTrigger = false;
          needStopPropagation = false;
        },
        onTouchMove: function(e){
          touchHandler(e, obj.eventType);
        },
        onTouchEnd: function(){
          elemMove.remove();
          needTrigger = true;
          needStopPropagation = true;
        }
      });
    });

    function touchHandler(event, eventType) {
      var pointer = event.touches[0];
      var simulatedEvent = document.createEvent("MouseEvent");

      simulatedEvent.initMouseEvent(eventType,
        true, true, window, 1,
        pointer.screenX, pointer.screenY,pointer.clientX, pointer.clientY,
        false, false, false, false, 0, null
      );
      pointer.target.dispatchEvent(simulatedEvent);
    }
  };

  //颜色选择器hsb转换
  Class$2.prototype.select = function(h, s, b, type){
    var that = this;
    that.config;
    var hex = HSBToHEX({h:h, s:100, b:100});
    HSBToHEX({h:h, s:s, b:b});
    var sidetop = h/360*180;
    var top = 180 - b/100*180;
    var left = s/100*260;
    var basisElem = that.elemPicker.find('.' + PICKER_BASIS)[0];

    that.elemPicker.find('.' + PICKER_SIDE_SLIDER).css("top", sidetop); //滑块的top
    basisElem.style.background = '#' + hex; //颜色选择器的背景

    //选择器的top left
    that.elemPicker.find('.' + PICKER_BASIS_CUR).css({
      "top": top / basisElem.offsetHeight * 100 + '%',
      "left": left / basisElem.offsetWidth * 100 + '%'
    });

    // if(type === 'change') return;

    // 选中的颜色
    // that.elemPicker.find('.' + PICKER_INPUT).find('input').val('#'+ color);
  };

  Class$2.prototype.pickerEvents = function(){
    var that = this
    ,options = that.config

    ,elemColorBoxSpan = that.elemColorBox.find('.' + PICKER_TRIG_SPAN) //颜色盒子
    ,elemPickerInput = that.elemPicker.find('.' + PICKER_INPUT + ' input') //颜色选择器表单

    ,pickerEvents = {
      //清空
      clear: function(othis){
        elemColorBoxSpan[0].style.background ='';
        that.elemColorBox.find('.' + PICKER_TRIG_I).removeClass(ICON_PICKER_DOWN).addClass(ICON_PICKER_CLOSE);
        that.color = '';

        options.done && options.done('');
        that.removePicker();
      }

      //确认
      ,confirm: function(othis, change){
        var value =  jquery.trim(elemPickerInput.val())
        ,colorValue
        ,hsb;

        if(value.indexOf(',') > -1){
          hsb = RGBToHSB(RGBSTo(value));
          that.select(hsb.h, hsb.s, hsb.b);
          elemColorBoxSpan[0].style.background = (colorValue = '#' + HSBToHEX(hsb));

          if((value.match(/[0-9]{1,3}/g) || []).length > 3 && elemColorBoxSpan.attr('lay-type') === 'rgba'){
            var left = value.slice(value.lastIndexOf(",") + 1, value.length - 1) * 280;
            that.elemPicker.find('.' + PICKER_ALPHA_SLIDER).css("left", left);
            elemColorBoxSpan[0].style.background = value;
            colorValue = value;
          }
        } else {
          hsb = HEXToHSB(value);
          elemColorBoxSpan[0].style.background = (colorValue = '#' + HSBToHEX(hsb));
          that.elemColorBox.find('.' + PICKER_TRIG_I).removeClass(ICON_PICKER_CLOSE).addClass(ICON_PICKER_DOWN);
        }

        if(change === 'change'){
          that.select(hsb.h, hsb.s, hsb.b, change);
          options.change && options.change(colorValue);
          return;
        }
        that.color = value;

        options.done && options.done(value);
        that.removePicker();
      }
    };

    //选择器面板点击事件
    that.elemPicker.on('click', '*[colorpicker-events]', function(){
      var othis = jquery(this)
      ,attrEvent = othis.attr('colorpicker-events');
      pickerEvents[attrEvent] && pickerEvents[attrEvent].call(this, othis);
    });

    //输入框事件
    elemPickerInput.on('keyup', function(e){
      var othis = jquery(this);
      pickerEvents.confirm.call(this, othis, e.keyCode === 13 ?  null : 'change');
    });
  };

  // 颜色选择器输入
  Class$2.prototype.events = function(){
    var that = this;
    that.config;

    // 弹出颜色选择器
    that.elemColorBox.on('click' , function(){
      that.renderPicker();
      if(jquery(ELEM_MAIN)[0]){
        that.val();
        that.side();
      }
    });
  };

  //全局事件
  (function(){
    //绑定关闭控件事件
    $doc.on(clickOrMousedown, function(e){
      if(!colorpicker.thisId) return;
      var that = thisModule.getThis(colorpicker.thisId);
      if(!that) return;

      var options = that.config;
      var elemColorBoxSpan = that.elemColorBox.find('.' + PICKER_TRIG_SPAN);

      //如果点击的元素是颜色框
      if(jquery(e.target).hasClass(ELEM)
        || jquery(e.target).parents('.'+ELEM)[0]
      ) return;

      //如果点击的元素是选择器
      if(jquery(e.target).hasClass(ELEM_MAIN.replace(/\./g, ''))
        || jquery(e.target).parents(ELEM_MAIN)[0]
      ) return;

      if(!that.elemPicker) return;

      if(that.color){
        var hsb = RGBToHSB(RGBSTo(that.color));
        that.select(hsb.h, hsb.s, hsb.b);
      } else {
        that.elemColorBox.find('.' + PICKER_TRIG_I).removeClass(ICON_PICKER_DOWN).addClass(ICON_PICKER_CLOSE);
      }
      elemColorBoxSpan[0].style.background = that.color || '';

      // 取消选择的回调
      typeof options.cancel === 'function' && options.cancel(that.color);

      // 移除面板
      that.removePicker();
    });

    //自适应定位
    $win.on('resize', function(){
      if(!colorpicker.thisId) return;
      var that = thisModule.getThis(colorpicker.thisId);
      if(!that) return;

      if(!that.elemPicker ||  !jquery(ELEM_MAIN)[0]){
        return false;
      }
      that.position();
    });
  })();

  // 记录所有实例
  thisModule.that = {}; // 记录所有实例对象

  // 获取当前实例对象
  thisModule.getThis = function(id){
    var that = thisModule.that[id];
    if(!that) hint$1.error(id ? (MOD_NAME$2 +' instance with ID \''+ id +'\' not found') : 'ID argument required');
    return that;
  };

  //核心入口
  colorpicker.render = function(options){
    var inst = new Class$2(options);
    return thisModule.call(inst);
  };

/**
 * slider 滑块组件
 */


  // 外部接口
  var slider = {
    config: {},
    index: layui.slider ? (layui.slider.index + 10000) : 0,

    // 设置全局项
    set: function(options) {
      var that = this;
      that.config = jquery.extend({}, that.config, options);
      return that;
    },

    // 事件
    on: function(events, callback) {
      return layui.onevent.call(this, MOD_NAME$1, events, callback);
    }
  };

  // 操作当前实例
  var thisSlider = function(){
    var that = this;
    var options = that.config;

    return {
      setValue: function(value, index){ // 设置值
        value = value > options.max ? options.max : value;
        value = value < options.min ? options.min : value;
        options.value = value;
        return that.slide('set', value, index || 0);
      },
      config: options
    }
  };

  // 字符常量
  var MOD_NAME$1 = 'slider';
  var DISABLED = 'layui-disabled';
  var ELEM_VIEW = 'layui-slider';
  var SLIDER_BAR = 'layui-slider-bar';
  var SLIDER_WRAP = 'layui-slider-wrap';
  var SLIDER_WRAP_BTN = 'layui-slider-wrap-btn';
  var SLIDER_TIPS = 'layui-slider-tips';
  var SLIDER_INPUT = 'layui-slider-input';
  var SLIDER_INPUT_TXT = 'layui-slider-input-txt';
  var SLIDER_INPUT_BTN = 'layui-slider-input-btn';
  var ELEM_HOVER = 'layui-slider-hover';

  // 构造器
  var Class$1 = function(options){
    var that = this;
    that.index = ++slider.index;
    that.config = jquery.extend({}, that.config, slider.config, options);
    that.render();
  };

  // 默认配置
  Class$1.prototype.config = {
    type: 'default', //滑块类型，垂直：vertical
    min: 0, //最小值
    max: 100, //最大值，默认100
    value: 0, //初始值，默认为0
    step: 1, //间隔值
    showstep: false, //间隔点开启
    tips: true, //文字提示，开启
    tipsAlways: false, //文字提示，始终开启
    input: false, //输入框，关闭
    range: false, //范围选择，与输入框不能同时开启，默认关闭
    height: 200, //配合 type:"vertical" 使用，默认200px
    disabled: false, //滑块禁用，默认关闭
    theme: '#16baaa' //主题颜色
  };

  // 数值精度
  Class$1.prototype.precision = function(){
    var that = this;
    var options = that.config;
    var precisions = jquery.map([options.min, options.max, options.step], function(v, i){
      var decimalArr = String(v).split('.');
      return decimalArr[1] ? decimalArr[1].length : 0;
    });
    return Math.max.apply(null, precisions);
  };

  //滑块渲染
  Class$1.prototype.render = function(){
    var that = this;
    var options = that.config;

    // 若 elem 非唯一，则拆分为多个实例
    var elem = jquery(options.elem);
    if(elem.length > 1){
      layui.each(elem, function(){
        slider.render(jquery.extend({}, options, {
          elem: this
        }));
      });
      return that;
    }

    // 合并 lay-options 属性上的配置信息
    jquery.extend(options, lay.options(elem[0]));

    //间隔值不能小于等于 0
    if(options.step <= 0) options.step = 1;

    //最大值不能小于最小值
    if(options.max < options.min) options.max = options.min + options.step;



    //判断是否开启双滑块
    if(options.range){
      options.value = typeof(options.value) == 'object' ? options.value : [options.min, options.value];
      var minValue = Math.min(options.value[0], options.value[1])
      ,maxValue = Math.max(options.value[0], options.value[1]);
      options.value[0] = Math.max(minValue,options.min);
      options.value[1] = Math.max(maxValue,options.min);
      options.value[0] = Math.min(options.value[0],options.max);
      options.value[1] = Math.min(options.value[1],options.max);

      var scaleFir = (options.value[0] - options.min) / (options.max - options.min) * 100;
      var scaleSec = (options.value[1] - options.min) / (options.max - options.min) * 100;
      var scale = scaleSec - scaleFir + '%';
      scaleFir = scaleFir + '%';
      scaleSec = scaleSec + '%';
    } else {
      //如果初始值是一个数组，则获取数组的最小值
      if(typeof options.value == 'object'){
        options.value = Math.min.apply(null, options.value);
      }

      //初始值不能小于最小值且不能大于最大值
      if(options.value < options.min) options.value = options.min;
      if(options.value > options.max) options.value = options.max;

      var scale = (options.value - options.min) / (options.max - options.min) * 100 + '%';
    }


    //如果禁用，颜色为统一的灰色
    var theme = options.disabled ? '#c2c2c2' : options.theme;

    //滑块
    var temp = '<div class="layui-slider '+ (options.type === 'vertical' ? 'layui-slider-vertical' : '') +'">'+ (options.tips ? '<div class="'+ SLIDER_TIPS +'" '+ (options.tipsAlways ? '' : 'style="display:none;"') +'></div>' : '') +
    '<div class="layui-slider-bar" style="background:'+ theme +'; '+ (options.type === 'vertical' ? 'height' : 'width') +':'+ scale +';'+ (options.type === 'vertical' ? 'bottom' : 'left') +':'+ (scaleFir || 0) +';"></div><div class="layui-slider-wrap" style="'+ (options.type === 'vertical' ? 'bottom' : 'left') +':'+ (scaleFir || scale) +';">' +
    '<div class="layui-slider-wrap-btn" style="border: 2px solid '+ theme +';"></div></div>'+ (options.range ? '<div class="layui-slider-wrap" style="'+ (options.type === 'vertical' ? 'bottom' : 'left') +':'+ scaleSec +';"><div class="layui-slider-wrap-btn" style="border: 2px solid '+ theme +';"></div></div>' : '') +'</div>';

    var othis = jquery(options.elem);
    var hasRender = othis.next('.' + ELEM_VIEW);
    //生成替代元素
    hasRender[0] && hasRender.remove(); //如果已经渲染，则Rerender
    that.elemTemp = jquery(temp);

    //把数据缓存到滑块上
    if(options.range){
      that.elemTemp.find('.' + SLIDER_WRAP).eq(0).data('value', options.value[0]);
      that.elemTemp.find('.' + SLIDER_WRAP).eq(1).data('value', options.value[1]);
    }else {
      that.elemTemp.find('.' + SLIDER_WRAP).data('value', options.value);
    }

    //插入替代元素
    othis.html(that.elemTemp);

    //垂直滑块
    if(options.type === 'vertical'){
      that.elemTemp.height(options.height + 'px');
    }

    //显示间断点
    if(options.showstep){
      var number = (options.max - options.min) / options.step, item = '';
      for(var i = 1; i < number + 1; i++) {
        var step = i * 100 / number;
        if(step < 100){
          item += '<div class="layui-slider-step" style="'+ (options.type === 'vertical' ? 'bottom' : 'left') +':'+ step +'%"></div>';
        }
      }
      that.elemTemp.append(item);
    }

    //插入输入框
    if(options.input && !options.range){
      var elemInput = jquery('<div class="layui-slider-input"><div class="layui-slider-input-txt"><input type="text" class="layui-input"></div><div class="layui-slider-input-btn"><i class="layui-icon layui-icon-up"></i><i class="layui-icon layui-icon-down"></i></div></div>');
      othis.css("position","relative");
      othis.append(elemInput);
      othis.find('.' + SLIDER_INPUT_TXT).children('input').val(options.value);
      if(options.type === 'vertical'){
        elemInput.css({
          left: 0
          ,top: -48
        });
      } else {
        that.elemTemp.css("margin-right", elemInput.outerWidth() + 15);
      }
    }

    //给未禁止的滑块滑动事件
    if(!options.disabled){
      that.slide();
    }else {
      that.elemTemp.addClass(DISABLED);
      that.elemTemp.find('.' + SLIDER_WRAP_BTN).addClass(DISABLED);
    }

    /**
     * @description 设置提示文本内容
     * @param {Element} sliderWrapBtnElem 提示文本节点元素
     */
    function setSliderTipsTxt(sliderWrapBtnElem) {
      var value = sliderWrapBtnElem.parent().data('value');
      var tipsTxt = options.setTips ? options.setTips(value) : value;
      that.elemTemp.find('.' + SLIDER_TIPS).html(tipsTxt);
    }

    /**
     * @description 计算提示文本元素的 position left
     * @param {Element} sliderWrapBtnElem 提示文本节点元素
     */
    function calcSliderTipsLeft(sliderWrapBtnElem){
      var sliderWidth = options.type === 'vertical' ? options.height : that.elemTemp[0].offsetWidth;
      var sliderWrap = that.elemTemp.find('.' + SLIDER_WRAP);
      var tipsLeft = options.type === 'vertical' ? (sliderWidth - sliderWrapBtnElem.parent()[0].offsetTop - sliderWrap.height()) : sliderWrapBtnElem.parent()[0].offsetLeft;
      var left = tipsLeft / sliderWidth * 100;
      return left
    }

    /**
     * @description 设置提示文本元素的 position left
     * @param {number} left 要设置的 left 的大小
     */
    function setSliderTipsLeft(left) {
      if(options.type === 'vertical'){
        that.elemTemp.find('.' + SLIDER_TIPS).css({
          "bottom": left + '%',
          "margin-bottom": "20px",
          "display": "inline-block"
        });
      } else {
        that.elemTemp.find('.' + SLIDER_TIPS).css({
          "left": left + '%',
          "display": "inline-block"
        });
      }
    }

    //判断是否要始终显示提示文本
    if(options.tips){
      if(options.tipsAlways){
        var sliderWrapBtnElem = that.elemTemp.find('.' + SLIDER_WRAP_BTN);
        setSliderTipsTxt(sliderWrapBtnElem);
        var left = calcSliderTipsLeft(sliderWrapBtnElem);
        setSliderTipsLeft(left);
      }else {
        //划过滑块显示数值
        var timer;
        that.elemTemp.find('.' + SLIDER_WRAP_BTN).on('mouseover', function(){
          setSliderTipsTxt(jquery(this));
          var left = calcSliderTipsLeft(jquery(this));
          clearTimeout(timer);
          timer = setTimeout(function(){
            setSliderTipsLeft(left);
          }, 300);
        }).on('mouseout', function(){
          clearTimeout(timer);
          if(!options.tipsAlways){
            that.elemTemp.find('.' + SLIDER_TIPS).css("display", "none");
          }
        });
      }
    }
  };

  //滑块滑动
  Class$1.prototype.slide = function(setValue, value, i){
    var that = this;
    var options = that.config;
    var sliderAct = that.elemTemp;
    var sliderWidth = function(){
      return options.type === 'vertical' ? options.height : sliderAct[0].offsetWidth
    };
    var sliderWrap = sliderAct.find('.' + SLIDER_WRAP);
    var sliderTxt = sliderAct.next('.' + SLIDER_INPUT);
    var inputValue = sliderTxt.children('.' + SLIDER_INPUT_TXT).children('input').val();
    var step = 100 / ((options.max - options.min) / options.step);
    var precision = that.precision();
    var change = function(offsetValue, index, from){
      if(Math.ceil(offsetValue) * step > 100){
        offsetValue = Math.ceil(offsetValue) * step;
      }else {
        offsetValue = Math.round(offsetValue) * step;
      }
      offsetValue = offsetValue > 100 ? 100: offsetValue;
      offsetValue = offsetValue < 0 ? 0: offsetValue;
      sliderWrap.eq(index).css((options.type === 'vertical' ?'bottom':'left'), offsetValue + '%');
      var firLeft = valueTo(sliderWrap[0].offsetLeft);
      var secLeft = options.range ? valueTo(sliderWrap[1].offsetLeft) : 0;
      if(options.type === 'vertical'){
        sliderAct.find('.' + SLIDER_TIPS).css({"bottom":offsetValue + '%', "margin-bottom":"20px"});
        firLeft = valueTo(sliderWidth() - sliderWrap[0].offsetTop - sliderWrap.height());
        secLeft = options.range ? valueTo(sliderWidth() - sliderWrap[1].offsetTop - sliderWrap.height()) : 0;
      }else {
        sliderAct.find('.' + SLIDER_TIPS).css("left",offsetValue + '%');
      }
      firLeft = firLeft > 100 ? 100: firLeft;
      secLeft = secLeft > 100 ? 100: secLeft;
      var minLeft = Math.min(firLeft, secLeft)
      ,wrapWidth = Math.abs(firLeft - secLeft);
      if(options.type === 'vertical'){
        sliderAct.find('.' + SLIDER_BAR).css({"height":wrapWidth + '%', "bottom":minLeft + '%'});
      }else {
        sliderAct.find('.' + SLIDER_BAR).css({"width":wrapWidth + '%', "left":minLeft + '%'});
      }
      var selfValue = options.min + (options.max - options.min) * offsetValue / 100;
      selfValue = Number(parseFloat(selfValue).toFixed(precision));
      inputValue = selfValue;
      sliderTxt.children('.' + SLIDER_INPUT_TXT).children('input').val(inputValue);
      sliderWrap.eq(index).data('value', selfValue);
      sliderAct.find('.' + SLIDER_TIPS).html(options.setTips ? options.setTips(selfValue) : selfValue);

      //如果开启范围选择，则返回数组值
      if(options.range){
        var arrValue = [
          sliderWrap.eq(0).data('value'),
          sliderWrap.eq(1).data('value')
        ];
        if(arrValue[0] > arrValue[1]) arrValue.reverse(); //如果前面的圆点超过了后面的圆点值，则调换顺序
      }

      that.value = options.range ? arrValue : selfValue; // 最新值
      options.change && options.change(that.value); // change 回调

      // 值完成选中的事件
      if(from === 'done') options.done && options.done(that.value);
    };
    var valueTo = function(value){
      var oldLeft = value / sliderWidth() * 100 / step;
      var left =  Math.round(oldLeft) * step;
      if(value == sliderWidth()){
        left =  Math.ceil(oldLeft) * step;
      }
      return left;
    };

    //拖拽元素
    var elemMove = jquery(['<div class="layui-auxiliar-moving" id="LAY-slider-moving"></div'].join(''));
    var createMoveElem = function(sliderBtnElem, move, up){
      var upCall = function(){
        // 移动端延时一秒关闭
        up && up(lay.touchEventsSupported() ? 1000 : 0);
        elemMove.remove();
        options.done && options.done(that.value);
        // 移动端
        if (lay.touchEventsSupported()) {
          sliderBtnElem[0].removeEventListener('touchmove', move, lay.passiveSupported ? { passive: false } : false);
          sliderBtnElem[0].removeEventListener('touchend', upCall);
          sliderBtnElem[0].removeEventListener('touchcancel', upCall);
        }
      };
      jquery('#LAY-slider-moving')[0] || jquery('body').append(elemMove);
      elemMove.on('mousemove', move);
      elemMove.on('mouseup', upCall).on('mouseleave', upCall);
      // 移动端
      if (lay.touchEventsSupported()) {
        sliderBtnElem[0].addEventListener('touchmove', move, lay.passiveSupported ? { passive: false } : false);
        sliderBtnElem[0].addEventListener('touchend', upCall);
        sliderBtnElem[0].addEventListener('touchcancel', upCall);
      }
    };

    //动态赋值
    if(setValue === 'set'){
      return change((value - options.min) / (options.max - options.min) * 100 / step, i, 'done');
    }

    //滑块滑动
    sliderAct.find('.' + SLIDER_WRAP_BTN).each(function(index){
      var othis = jquery(this);
      othis.on('mousedown touchstart', function(e){
        e = e || window.event;
        if(e.type === 'touchstart'){
          e.clientX = e.originalEvent.touches[0].clientX;
          e.clientY = e.originalEvent.touches[0].clientY;
        }

        var oldleft = othis.parent()[0].offsetLeft;
        var oldx = e.clientX;
        if(options.type === 'vertical'){
          oldleft = sliderWidth() - othis.parent()[0].offsetTop - sliderWrap.height();
          oldx = e.clientY;
        }

        var move = function(e){
          e = e || window.event;
          if (e.type === 'touchmove') {
            e.clientX = e.touches[0].clientX;
            e.clientY = e.touches[0].clientY;
          }
          var left = oldleft + (options.type === 'vertical' ? (oldx - e.clientY) : (e.clientX - oldx));
          if(left < 0)left = 0;
          if(left > sliderWidth())left = sliderWidth();
          var reaLeft = left / sliderWidth() * 100 / step;
          change(reaLeft, index);
          othis.addClass(ELEM_HOVER);
          sliderAct.find('.' + SLIDER_TIPS).show();
          e.preventDefault();
        };

        var up = function(delay){
          othis.removeClass(ELEM_HOVER);
          if(!options.tipsAlways){
            setTimeout(function(){
              sliderAct.find('.' + SLIDER_TIPS).hide();
            }, delay);
          }
        };

        createMoveElem(othis, move, up);
      });
    });

    // 点击滑块
    sliderAct.on('click', function(e){
      var main = jquery('.' + SLIDER_WRAP_BTN);
      var othis = jquery(this);
      if(!main.is(event.target) && main.has(event.target).length === 0 && main.length){
        var index;
        var offset = options.type === 'vertical'
          ? (sliderWidth() - e.clientY + othis.offset().top - jquery(window).scrollTop())
        :(e.clientX - othis.offset().left - jquery(window).scrollLeft());

        if(offset < 0)offset = 0;
        if(offset > sliderWidth()) offset = sliderWidth();
        var reaLeft = offset / sliderWidth() * 100 / step;
        if(options.range){
          if(options.type === 'vertical'){
            index = Math.abs(offset - parseInt(jquery(sliderWrap[0]).css('bottom'))) > Math.abs(offset -  parseInt(jquery(sliderWrap[1]).css('bottom'))) ? 1 : 0;
          } else {
            index = Math.abs(offset - sliderWrap[0].offsetLeft) > Math.abs(offset - sliderWrap[1].offsetLeft) ? 1 : 0;
          }
        } else {
          index = 0;
        }
        change(reaLeft, index, 'done');
        e.preventDefault();
      }
    });

    //点击加减输入框
    sliderTxt.children('.' + SLIDER_INPUT_BTN).children('i').each(function(index){
      jquery(this).on('click', function(){
        inputValue = sliderTxt.children('.' + SLIDER_INPUT_TXT).children('input').val();
        if(index == 1){ //减
          inputValue = inputValue - options.step < options.min
            ? options.min
          : Number(inputValue) - options.step;
        }else {
          inputValue = Number(inputValue) + options.step > options.max
            ? options.max
          : Number(inputValue) + options.step;
        }
        var inputScale =  (inputValue - options.min) / (options.max - options.min) * 100 / step;
        change(inputScale, 0, 'done');
      });
    });

    //获取输入框值
    var getInputValue = function(){
      var realValue = this.value;
      realValue = isNaN(realValue) ? 0 : realValue;
      realValue = realValue < options.min ? options.min : realValue;
      realValue = realValue > options.max ? options.max : realValue;
      this.value = realValue;
      var inputScale =  (realValue - options.min) / (options.max - options.min) * 100 / step;
      change(inputScale, 0, 'done');
    };
    sliderTxt.children('.' + SLIDER_INPUT_TXT).children('input').on('keydown', function(e){
      if(e.keyCode === 13){
        e.preventDefault();
        getInputValue.call(this);
      }
    }).on('change', getInputValue);
  };

  //事件处理
  Class$1.prototype.events = function(){
     var that = this;
     that.config;
  };

  //核心入口
  slider.render = function(options){
    var inst = new Class$1(options);
    return thisSlider.call(inst);
  };

/**
 * carousel 轮播模块
 * MIT Licensed
 */


  layui.hint();
  layui.device();

  // 外部接口
  var carousel = {
    config: {}, // 全局配置项

    // 设置全局项
    set: function(options) {
      var that = this;
      that.config = jquery.extend({}, that.config, options);
      return that;
    },

    // 事件
    on: function(events, callback) {
      return layui.onevent.call(this, MOD_NAME, events, callback);
    }
  };

  // 字符常量
  var MOD_NAME = 'carousel';
  var THIS = 'layui-this';

  var ELEM_ITEM = '>*[carousel-item]>*';
  var ELEM_LEFT = 'layui-carousel-left';
  var ELEM_RIGHT = 'layui-carousel-right';
  var ELEM_PREV = 'layui-carousel-prev';
  var ELEM_NEXT = 'layui-carousel-next';
  var ELEM_ARROW = 'layui-carousel-arrow';
  var ELEM_IND = 'layui-carousel-ind';

  // 构造器
  var Class = function(options) {
    var that = this;
    that.config = jquery.extend({}, that.config, carousel.config, options);
    that.render();
  };

  // 默认配置
  Class.prototype.config = {
    width: '600px',
    height: '280px',
    full: false, // 是否全屏
    arrow: 'hover', // 切换箭头默认显示状态：hover/always/none
    indicator: 'inside', // 指示器位置：inside/outside/none
    autoplay: true, // 是否自动切换
    interval: 3000, // 自动切换的时间间隔，不能低于800ms
    anim: '', // 动画类型：default/updown/fade
    trigger: 'click', // 指示器的触发方式：click/hover
    index: 0 // 初始开始的索引
  };

  // 轮播渲染
  Class.prototype.render = function(){
    var that = this;
    var options = that.config;

    // 若 elem 非唯一，则拆分为多个实例
    var elem = jquery(options.elem);
    if(elem.length > 1){
      layui.each(elem, function(){
        carousel.render(jquery.extend({}, options, {
          elem: this
        }));
      });
      return that;
    }

    // 合并 lay-options 属性上的配置信息
    jquery.extend(options, lay.options(elem[0]));

    options.elem = jquery(options.elem);
    if(!options.elem[0]) return;
    that.elemItem = options.elem.find(ELEM_ITEM);

    if(options.index < 0) options.index = 0;
    if(options.index >= that.elemItem.length) options.index = that.elemItem.length - 1;
    if(options.interval < 800) options.interval = 800;

    // 是否全屏模式
    if(options.full){
      options.elem.css({
        position: 'fixed',
        width: '100%',
        height: '100%',
        zIndex: 9999
      });
    } else {
      options.elem.css({
        width: options.width,
        height: options.height
      });
    }

    options.elem.attr('lay-anim', options.anim);

    // 初始焦点状态
    that.elemItem.eq(options.index).addClass(THIS);

    // 指示器、箭头等动作
    that.indicator();
    that.arrow();
    that.autoplay();

    if (that.elemItem.length > 1) {
      that.events();
    }
  };

  // 重置轮播
  Class.prototype.reload = function(options){
    var that = this;
    clearInterval(that.timer);
    that.config = jquery.extend({}, that.config, options);
    that.render();
  };

  // 获取上一个等待条目的索引
  Class.prototype.prevIndex = function(){
    var that = this;
    var options = that.config;
    var prevIndex = options.index - 1;

    if(prevIndex < 0){
      prevIndex = that.elemItem.length - 1;
    }

    return prevIndex;
  };

  // 获取下一个等待条目的索引
  Class.prototype.nextIndex = function(){
    var that = this;
    var options = that.config;
    var nextIndex = options.index + 1;

    if(nextIndex >= that.elemItem.length){
      nextIndex = 0;
    }

    return nextIndex;
  };

  // 索引递增
  Class.prototype.addIndex = function(num){
    var that = this;
    var options = that.config;

    num = num || 1;
    options.index = options.index + num;

    // index 不能超过轮播总数量
    if(options.index >= that.elemItem.length){
      options.index = 0;
    }
  };

  // 索引递减
  Class.prototype.subIndex = function(num){
    var that = this;
    var options = that.config;

    num = num || 1;
    options.index = options.index - num;

    // index 不能超过轮播总数量
    if(options.index < 0){
      options.index = that.elemItem.length - 1;
    }
  };

  // 自动轮播
  Class.prototype.autoplay = function(){
    var that = this;
    var options = that.config;
    var itemsCount = that.elemItem.length;

    if(!options.autoplay) return;
    clearInterval(that.timer);

    if (itemsCount > 1) {
      that.timer = setInterval(function(){
        that.slide();
      }, options.interval);
    }
  };

  // 箭头
  Class.prototype.arrow = function(){
    var that = this;
    var options = that.config;
    var itemsCount = that.elemItem.length;

    // 模板
    var tplArrow = jquery([
      '<button type="button" class="layui-icon '+ (options.anim === 'updown' ? 'layui-icon-up' : 'layui-icon-left') + ' ' + ELEM_ARROW +'" lay-type="sub"></button>',
      '<button type="button" class="layui-icon '+ (options.anim === 'updown' ? 'layui-icon-down' : 'layui-icon-right') + ' ' + ELEM_ARROW +'" lay-type="add"></button>'
    ].join(''));

    // 预设基础属性
    options.elem.attr('lay-arrow', options.arrow);

    // 避免重复插入
    if(options.elem.find('.'+ELEM_ARROW)[0]){
      options.elem.find('.'+ELEM_ARROW).remove();
    }
    itemsCount > 1 ? options.elem.append(tplArrow) : tplArrow.remove();

    // 事件
    tplArrow.on('click', function(){
      var othis = jquery(this);
      var type = othis.attr('lay-type');
      that.slide(type);
    });
  };

  // 跳转到特定下标
  Class.prototype.goto = function(index){
    var that = this;
    var options = that.config;

    if(index > options.index){
      that.slide('add', index - options.index);
    } else if(index < options.index){
      that.slide('sub', options.index - index);
    }
  };

  // 指示器
  Class.prototype.indicator = function(){
    var that = this;
    var options = that.config;
    var itemsCount = that.elemItem.length;

    // 模板
    var tplInd = that.elemInd = jquery(['<div class="'+ ELEM_IND +'"><ul>',
      function(){
        var li = [];
        layui.each(that.elemItem, function(index){
          li.push('<li'+ (options.index === index ? ' class="layui-this"' : '') +'></li>');
        });
        return li.join('');
      }(),
    '</ul></div>'].join(''));

    // 预设基础属性
    options.elem.attr('lay-indicator', options.indicator);

    // 避免重复插入
    if(options.elem.find('.'+ELEM_IND)[0]){
      options.elem.find('.'+ELEM_IND).remove();
    }

    itemsCount > 1 ? options.elem.append(tplInd) : tplInd.remove();

    if(options.anim === 'updown'){
      tplInd.css('margin-top', -(tplInd.height()/2));
    }

    // 事件
    tplInd.find('li').on(options.trigger === 'hover' ? 'mouseover' : options.trigger, function(){
      that.goto(jquery(this).index());
    });
  };

  // 滑动切换
  Class.prototype.slide = function(type, num){
    var that = this;
    var elemItem = that.elemItem;
    var itemsCount = elemItem.length;
    var options = that.config;
    var thisIndex = options.index;
    var filter = options.elem.attr('lay-filter');

    if (that.haveSlide || itemsCount <= 1) return;

    // 滑动方向
    if(type === 'sub'){
      that.subIndex(num);
      elemItem.eq(options.index).addClass(ELEM_PREV);
      setTimeout(function(){
        elemItem.eq(thisIndex).addClass(ELEM_RIGHT);
        elemItem.eq(options.index).addClass(ELEM_RIGHT);
      }, 50);
    } else { // 默认递增滑
      that.addIndex(num);
      elemItem.eq(options.index).addClass(ELEM_NEXT);
      setTimeout(function(){
        elemItem.eq(thisIndex).addClass(ELEM_LEFT);
        elemItem.eq(options.index).addClass(ELEM_LEFT);
      }, 50);
    }

    // 移除过渡类
    setTimeout(function(){
      elemItem.removeClass(THIS + ' ' + ELEM_PREV + ' ' + ELEM_NEXT + ' ' + ELEM_LEFT + ' ' + ELEM_RIGHT);
      elemItem.eq(options.index).addClass(THIS);
      that.haveSlide = false; // 解锁
    }, 350);

    // 指示器焦点
    that.elemInd.find('li').eq(options.index).addClass(THIS)
    .siblings().removeClass(THIS);

    that.haveSlide = true;

    // 回调返回的参数
    var params = {
      index: options.index,
      prevIndex: thisIndex,
      item: elemItem.eq(options.index)
    };

    typeof options.change === 'function' && options.change(params);
    layui.event.call(this, MOD_NAME, 'change('+ filter +')', params);
  };

  // 事件处理
  Class.prototype.events = function(){
    var that = this;
    var options = that.config;

    if(options.elem.data('haveEvents')) return;


    // 移入移出容器
    options.elem.on('mouseenter touchstart', function(){
      if (that.config.autoplay === 'always') return;
      clearInterval(that.timer);
    }).on('mouseleave touchend', function(){
      if (that.config.autoplay === 'always') return;
      that.autoplay();
    });

    var touchEl = options.elem;
    var isVertical = options.anim === 'updown';
    lay.touchSwipe(touchEl, {
      onTouchEnd: function(e, state){
        var duration = Date.now() - state.timeStart;
        var distance = isVertical ? state.distanceY : state.distanceX;
        var speed = distance / duration;
        var shouldSwipe = Math.abs(speed) > 0.25 || Math.abs(distance) > touchEl[isVertical ? 'height' : 'width']() / 3;
        if(shouldSwipe){
          that.slide(distance > 0 ? '' : 'sub');
        }
      }
    });

    options.elem.data('haveEvents', true);
  };

  // 核心入口
  carousel.render = function(options){
    return new Class(options);
  };

/**
 * flow 流加载组件
 */


  var Flow = function(options) {};
  var ELEM_LOAD = '<i class="layui-anim layui-anim-rotate layui-anim-loop layui-icon ">&#xe63e;</i>';

  // 主方法
  Flow.prototype.load = function(options) {
    var that = this, page = 0, lock, isOver, lazyimg, timer;
    options = options || {};

    var elem = jquery(options.elem); if(!elem[0]) return;
    var scrollElem = jquery(options.scrollElem || document); // 滚动条所在元素
    var threshold = 'mb' in options ? options.mb : 50; // 临界距离
    var isAuto = 'isAuto' in options ? options.isAuto : true; // 否自动滚动加载
    var moreText = options.moreText || "加载更多"; // 手动加载时，加载更多按钮文案
    var end = options.end || '没有更多了'; // “末页”显示文案
    var direction = options.direction || 'bottom';
    var isTop = direction === 'top';

    // 重复执行时清理旧的事件绑定
    that._cleanup(elem, scrollElem);

    //滚动条所在元素是否为document
    var notDocument = options.scrollElem && options.scrollElem !== document;

    //加载更多
    var ELEM_TEXT = '<cite>' + moreText + '</cite>'
    ,more = jquery('<div class="layui-flow-more"><a href="javascript:;">'+ ELEM_TEXT +'</a></div>');

    if(!elem.find('.layui-flow-more')[0]){
      elem[isTop ? 'prepend' : 'append'](more);
    }

    //加载下一个元素
    var next = function(html, over){
      var scrollHeightStart = notDocument ? scrollElem.prop('scrollHeight') : document.documentElement.scrollHeight;
      var scrollTopStart = scrollElem.scrollTop();
      html = jquery(html);
      more[isTop ? 'after' : 'before'](html);
      over = over == 0 ? true : null;
      over ? more.html(end) : more.find('a').html(ELEM_TEXT);
      isOver = over;
      lock = null;
      lazyimg && lazyimg();
      if(isTop){
        var scrollHeightEnd = notDocument ? scrollElem.prop('scrollHeight') : document.documentElement.scrollHeight;
        if(page === 1){
          // 首次渲染后滑动到底部
          scrollElem.scrollTop(scrollHeightEnd);
        }else if(page > 1){
          var nextElementHeight = scrollHeightEnd - scrollHeightStart;
          scrollElem.scrollTop(scrollTopStart + nextElementHeight);
        }
      }
    };

    //触发请求
    var done = function(){
      lock = true;
      more.find('a').html(ELEM_LOAD);
      typeof options.done === 'function' && options.done(++page, next);
    };

    done();

    //不自动滚动加载
    more.find('a').on('click.flow', function(){
      jquery(this);
      if(isOver) return;
      lock || done();
    });

    //如果允许图片懒加载
    if(options.isLazyimg){
      lazyimg = that.lazyimg({
        elem: options.elem + ' img'
        ,scrollElem: options.scrollElem
        ,direction: options.direction
      });
    }

    if(!isAuto) return that;

    scrollElem.on('scroll.flow', function(){
      var othis = jquery(this), top = othis.scrollTop();

      if(timer) clearTimeout(timer);
      if(isOver || !elem.width()) return; //如果已经结束，或者元素处于隐藏状态，则不执行滚动加载

      timer = setTimeout(function(){
        //计算滚动所在容器的可视高度
        var height = notDocument ? othis.height() : jquery(window).height();

        //计算滚动所在容器的实际高度
        var scrollHeight = notDocument
          ? othis.prop('scrollHeight')
        : document.documentElement.scrollHeight;

        //临界点
        if(!isTop ? scrollHeight - top - height <= threshold : top <= threshold){
          lock || done();
        }
      }, 100);
    });

    return that;
  };

  //图片懒加载
  Flow.prototype.lazyimg = function(options){
    var that = this, index = 0, haveScroll;
    options = options || {};

    var scrollElem = jquery(options.scrollElem || document); //滚动条所在元素
    var elem = options.elem || 'img';
    var direction = options.direction || 'bottom';
    var isTop = direction === 'top';

    //滚动条所在元素是否为document
    var notDocument = options.scrollElem && options.scrollElem !== document;

    //显示图片
    var show = function(item, height){
      var start = scrollElem.scrollTop(), end = start + height;
      var elemTop = notDocument ? function(){
        return item.offset().top - scrollElem.offset().top + start;
      }() : item.offset().top;

      /* 始终只加载在当前屏范围内的图片 */
      if((isTop ? elemTop + item.height() : elemTop) >= start && elemTop <= end){
        if(item.attr('lay-src')){
          var src = item.attr('lay-src');
          layui.img(src, function(){
            var next = that.lazyimg.elem.eq(index);
            item.attr('src', src).removeAttr('lay-src');

            /* 当前图片加载就绪后，检测下一个图片是否在当前屏 */
            next[0] && render(next);
            index++;
          }, function(){
            that.lazyimg.elem.eq(index);
            item.removeAttr('lay-src');
          });
        }
      }
    }, render = function(othis, scroll){

      //计算滚动所在容器的可视高度
      var height = notDocument ? (scroll||scrollElem).height() : jquery(window).height();
      var start = scrollElem.scrollTop(), end = start + height;

      that.lazyimg.elem = jquery(elem);

      if(othis){
        show(othis, height);
      } else {
        //计算未加载过的图片
        for(var i = 0; i < that.lazyimg.elem.length; i++){
          var item = that.lazyimg.elem.eq(i), elemTop = notDocument ? function(){
            return item.offset().top - scrollElem.offset().top + start;
          }() : item.offset().top;

          show(item, height);
          index = i;

          //如果图片的top坐标，超出了当前屏，则终止后续图片的遍历
          if(elemTop > end) break;
        }
      }
    };

    render();

    if(!haveScroll){
      var timer;
      scrollElem.on('scroll.lazyimg' , function(){
        var othis = jquery(this);
        if(timer) clearTimeout(timer);
        timer = setTimeout(function(){
          render(null, othis);
        }, 50);
      });
      haveScroll = true;
    }
    return render;
  };

  // 重复执行时清理旧的事件绑定，私有方法
  Flow.prototype._cleanup = function(elem, scrollElem){
    scrollElem.off('scroll.flow').off('scroll.lazyimg');
    elem.find('.layui-flow-more').find('a').off('click.flow');
  };

  //暴露接口
  const flow = new Flow();

/**
 * code
 * Code 预览组件
 */


  layui.hint();

  // 常量
  var CONST = {
    ELEM_TAB: 'layui-tab',
    ELEM_HEADER: 'layui-code-header',
    ELEM_FULL: 'layui-code-full',
    ELEM_PREVIEW: 'layui-code-preview',
    ELEM_ITEM: 'layui-code-item',
    ELEM_SHOW: 'layui-show',
    ELEM_LINE: 'layui-code-line',
    ELEM_LINE_NUM: 'layui-code-line-number',
    ELEM_LN_MODE: 'layui-code-ln-mode',
    CDDE_DATA_CLASS: 'LayuiCodeDataClass',
    LINE_RAW_WIDTH: 45, // 行号初始宽度，需与 css 保持一致
  };

  // 默认参数项
  var config = {
    elem: '', // 元素选择器
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
    wordWrap: true, // 是否自动换行
    lang: 'text', // 指定语言类型
    highlighter: false, // 是否开启语法高亮，'hljs','prism','shiki'
    langMarker: false, // 代码区域是否显示语言类型标记
  };

  // 初始索引
  var codeIndex = layui.code ? (layui.code.index + 10000) : 0;

  // 去除尾部空格
  var trimEnd = function(str){
    return String(str).replace(/\s+$/, '');
  };
  // 保留首行缩进
  var trim = function(str){
    return trimEnd(str).replace(/^\n|\n$/, '');
  };

  // export api
  function code(options, mode){
    options = jquery.extend(true, {}, config, options);

    // 返回对象
    var ret = {
      config: options,
      reload: function(opts) { // 重载
        layui.code(this.updateOptions(opts));
      },
      updateOptions: function(opts) { // 更新属性（选项）
        opts = opts || {};
        delete opts.elem;
        return jquery.extend(true, options, opts);
      },
      reloadCode: function(opts) { // 仅重载 code
        layui.code(this.updateOptions(opts), 'reloadCode');
      }
    };

    // 若 elem 非唯一
    var elem = jquery(options.elem);
    if(elem.length > 1){
      // 是否正向渲染
      layui.each(options.obverse ? elem : elem.get().reverse(), function(){
        layui.code(jquery.extend({}, options, {
          elem: this
        }), mode);
      });
      return ret;
    }

    // 目标元素是否存在
    var othis = options.elem = jquery(options.elem);
    if(!othis[0]) return ret;

    // 合并属性上的参数，并兼容旧版本属性写法 lay-*
    jquery.extend(true, options, lay.options(othis[0]), function(obj){
      var attrs = ['title', 'height', 'encode', 'skin', 'about'];
      layui.each(attrs, function(i, attr){
        var value = othis.attr('lay-'+ attr);
        if(typeof value === 'string'){
          obj[attr] = value;
        }
      });
      return obj;
    }({}));

    // codeRender 需要关闭编码
    // 未使用 codeRender 时若开启了预览，则强制开启编码
    options.encode = (options.encode || options.preview) && !options.codeRender;

    // 获得初始 code
    options.code = options.code || function(){
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

      return arr.join('');
    }();

    // 创建 code 行结构
    var createCode = function(html) {
      // codeRender
      if(typeof options.codeRender === 'function') {
        html = options.codeRender(String(html), options);
      }

      // code 行
      var lines = String(html).split(/\r?\n/g);

      // 包裹 code 行结构
      html = jquery.map(lines, function(line, num) {
        return [
          '<div class="'+ CONST.ELEM_LINE +'">',
            (
              options.ln ? [
                '<div class="'+ CONST.ELEM_LINE_NUM +'">',
                  (util.digit(num + 1) + '.'),
                '</div>',
              ].join('') : ''
            ),
            '<div class="layui-code-line-content">',
              (line || ' '),
            '</div>',
          '</div>'
        ].join('');
      });

      return {
        lines: lines,
        html: html
      };
    };

    // 原始 code
    var rawCode = options.code;

    // 最终 code
    var finalCode = function(code) {
      return typeof options.codeParse === 'function' ?
        options.codeParse(code, options) :
      code;
    };

    // 仅重载 code
    if (mode === 'reloadCode') {
      return othis.children('.layui-code-wrap').html(
        createCode(finalCode(rawCode)).html
      ), ret;
    }

    // 自增索引
    var index = layui.code.index = ++codeIndex;
    othis.attr('lay-code-index', index);

    // 初始化 className
    var hasDataClass = CONST.CDDE_DATA_CLASS in othis.data();
    if (hasDataClass) {
      othis.attr('class', othis.data(CONST.CDDE_DATA_CLASS) || '');
    }

    // 记录初始 className
    if (!hasDataClass) {
      othis.data(CONST.CDDE_DATA_CLASS, othis.attr('class'));
    }

    // 工具栏
    var tools = {
      copy: {
        className: 'file-b',
        title: ['复制代码'],
        event: function(obj){
          var code = util.unescape(finalCode(options.code));
          var hasOnCopy = typeof options.onCopy === 'function';

          // 写入剪切板
          lay.clipboard.writeText({
            text: code,
            done: function() {
              if(hasOnCopy){
                var ret = options.onCopy(code, true);
                if(ret === false) return;
              }

              layer$1.msg('已复制', {icon: 1});
            },
            error: function() {
              if(hasOnCopy){
                var ret = options.onCopy(code, false);
                if(ret === false) return;
              }
              layer$1.msg('复制失败', {icon: 2});
            }
          });
        }
      }
    };

    // 移除包裹结构
    ((function fn() {
      var elemViewHas = othis.parent('.' + CONST.ELEM_PREVIEW);
      var elemTabHas = elemViewHas.children('.'+ CONST.ELEM_TAB);
      var elemPreviewViewHas = elemViewHas.children('.' + CONST.ELEM_ITEM +'-preview');

      // 移除旧结构
      elemTabHas.remove(); // 移除 tab
      elemPreviewViewHas.remove(); // 移除预览区域
      if (elemViewHas[0]) othis.unwrap(); // 移除外层容器

      return fn;
    }))();

    // 是否开启预览
    if(options.preview){
      var FILTER_VALUE = 'LAY-CODE-DF-'+ index;
      var layout = options.layout || ['code', 'preview'];
      var isIframePreview = options.preview === 'iframe';

      // 追加 Tab 组件
      var elemView = jquery('<div class="'+ CONST.ELEM_PREVIEW +'">');
      var elemTabView = jquery('<div class="layui-tab layui-tab-brief">');
      var elemHeaderView = jquery('<div class="layui-tab-title">');
      var elemPreviewView = jquery('<div class="'+ [
        CONST.ELEM_ITEM,
        CONST.ELEM_ITEM +'-preview',
        'layui-border'
      ].join(' ') +'">');
      var elemToolbar = jquery('<div class="layui-code-tools"></div>');


      if(options.id) elemView.attr('id', options.id);
      elemView.addClass(options.className);
      elemTabView.attr('lay-filter', FILTER_VALUE);

      // 标签头
      layui.each(layout, function(i, v){
        var li = jquery('<li lay-id="'+ v +'">');
        if(i === 0) li.addClass('layui-this');
        li.html(options.text[v]);
        elemHeaderView.append(li);
      });

      // 工具栏
      jquery.extend(tools, {
        'full': {
          className: 'screen-full',
          title: ['最大化显示', '还原显示'],
          event: function(obj){
            var el = obj.elem;
            var elemView = el.closest('.'+ CONST.ELEM_PREVIEW);
            var classNameFull = 'layui-icon-'+ this.className;
            var classNameRestore = 'layui-icon-screen-restore';
            var title = this.title;
            var htmlElem = jquery('html,body');
            var ELEM_SCROLLBAR_HIDE = 'layui-scrollbar-hide';

            if(el.hasClass(classNameFull)){
              elemView.addClass(CONST.ELEM_FULL);
              el.removeClass(classNameFull).addClass(classNameRestore);
              el.attr('title', title[1]);
              htmlElem.addClass(ELEM_SCROLLBAR_HIDE);
            } else {
              elemView.removeClass(CONST.ELEM_FULL);
              el.removeClass(classNameRestore).addClass(classNameFull);
              el.attr('title', title[0]);
              htmlElem.removeClass(ELEM_SCROLLBAR_HIDE);
            }
          }
        },
        'window': {
          className: 'release',
          title: ['在新窗口预览'],
          event: function(obj){
            util.openWin({
              content: finalCode(options.code)
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
        var oi = jquery(this);
        var type = oi.data('type');
        var parameters = {
          elem: oi,
          type: type,
          options: options, // 当前属性选项
          rawCode: options.code, // 原始 code
          finalCode: util.unescape(finalCode(options.code)) // 最终 code
        };

        // 内部 tools event
        tools[type] && typeof tools[type].event === 'function' && tools[type].event(parameters);

        // 外部 tools event
        typeof options.toolsEvent === 'function' && options.toolsEvent(parameters);
      });

      // 增加工具栏
      if (options.addTools && options.tools) {
        options.tools = [].concat(options.tools, options.addTools);
      }

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

        // 若非内置 tool，则合并到 tools 中
        if (!tools[type]) {
          var obj = {};
          obj[type] = tool;
          jquery.extend(tools, obj);
        }

        elemToolbar.append(
          '<i class="layui-icon layui-icon-'+ className +'" data-type="'+ type +'" title="'+ title[0] +'"></i>'
        );
      });

      othis.addClass(CONST.ELEM_ITEM).wrap(elemView); // 包裹外层容器
      elemTabView.append(elemHeaderView); // 追加标签头
      options.tools && elemTabView.append(elemToolbar); // 追加工具栏
      othis.before(elemTabView); // 追加标签结构

      // 追加预览
      if(isIframePreview){
        elemPreviewView.html('<iframe allowtransparency="true" frameborder="0"></iframe>');
      }

      // 执行预览
      var runPreview = function(thisItemBody){
        var iframe = thisItemBody.children('iframe')[0];

        // 是否 iframe 方式预览
        if(isIframePreview && iframe){
          iframe.srcdoc = finalCode(options.code);
        } else {
          thisItemBody.html(options.code);
        }

        // 当前实例预览完毕后的回调
        setTimeout(function(){
          typeof options.done === 'function' && options.done({
            container: thisItemBody,
            options: options,
            render: function(){
              form.render(thisItemBody.find('.layui-form'));
              element.render();
              component$1.render({
                elem: ['.'+ CONST.ELEM_PREVIEW, '.layui-tabs'].join(' ')
              });
            }
          });
        },3);
      };

      if(layout[0] === 'preview'){
        elemPreviewView.addClass(CONST.ELEM_SHOW);
        othis.before(elemPreviewView);
        runPreview(elemPreviewView);
      } else {
        othis.addClass(CONST.ELEM_SHOW).after(elemPreviewView);
      }

      // 内容项初始化样式
      options.previewStyle = [options.style, options.previewStyle].join('');
      elemPreviewView.attr('style', options.previewStyle);

      // tab change
      element.on('tab('+ FILTER_VALUE +')', function(data){
        var $this = jquery(this);
        var thisElem = jquery(data.elem).closest('.'+ CONST.ELEM_PREVIEW);
        var elemItemBody = thisElem.find('.'+ CONST.ELEM_ITEM);
        var thisItemBody = elemItemBody.eq(data.index);

        elemItemBody.removeClass(CONST.ELEM_SHOW);
        thisItemBody.addClass(CONST.ELEM_SHOW);

        if($this.attr('lay-id') === 'preview'){
          runPreview(thisItemBody);
        }

        setCodeLayout();
      });
    }

    // 创建 code 容器
    var codeElem = jquery('<code class="layui-code-wrap"></code>'); // 此处的闭合标签是为了兼容 IE8

    // 添加主容器 className
    othis.addClass(function(arr) {
      if (!options.wordWrap) arr.push('layui-code-nowrap');
      return arr.join(' ')
    }(['layui-code-view layui-border-box']));

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

    // 获取 code 行结构
    var createCodeRst = createCode(
      options.encode ? util.escape(finalCode(rawCode)) : rawCode // 是否编码
    );
    var lines = createCodeRst.lines;

    // 插入 code
    othis.html(codeElem.html(createCodeRst.html));

    // 插入行号边栏
    if (options.ln) {
      othis.append('<div class="layui-code-ln-side"></div>');
    }

    // 兼容旧版本 height 属性
    if (options.height) {
      codeElem.css('max-height', options.height);
    }

    // code 区域样式
    options.codeStyle = [options.style, options.codeStyle].join('');
    if (options.codeStyle) {
      codeElem.attr('style', function(i, val) {
        return (val || '') + options.codeStyle;
      });
    }

    // 动态设置样式
    var cssRules = [
      {
        selector: '>.layui-code-wrap>.layui-code-line{}',
        setValue: function(item, value) {
          item.style['padding-left'] = value + 'px';
        }
      },
      {
        selector: '>.layui-code-wrap>.layui-code-line>.layui-code-line-number{}',
        setValue: function(item, value) {
         item.style.width = value + 'px';
        }
      },
      {
        selector: '>.layui-code-ln-side{}',
        setValue: function(item, value) {
          item.style.width = value + 'px';
        }
      }
    ];

    // 生成初始 style 元素
    var styleElem = lay.style({
      target: othis[0],
      id: 'DF-code-'+ index,
      text: jquery.map(jquery.map(cssRules, function(val){
        return val.selector;
      }), function(val, i) {
        return ['.layui-code-view[lay-code-index="'+ index + '"]', val].join(' ');
      }).join('')
    });

    // 动态设置 code 布局
    var setCodeLayout = (function fn() {
      if (options.ln) {
        var multiLine = Math.floor(lines.length / 100);
        var lineElem = codeElem.children('.'+ CONST.ELEM_LINE);
        var width = lineElem.last().children('.'+ CONST.ELEM_LINE_NUM).outerWidth();

        othis.addClass(CONST.ELEM_LN_MODE);

        // 若超出 100 行
        if (multiLine && width > CONST.LINE_RAW_WIDTH) {
          lay.getStyleRules(styleElem, function(item, i) {
            try {
              cssRules[i].setValue(item, width);
            } catch(e) { }
          });
        }
      }

      return fn;
    })();

    // 创建 code header
    if (options.header) {
      var headerElem = jquery('<div class="'+ CONST.ELEM_HEADER +'"></div>');
      headerElem.html(options.title || options.text.code);
      othis.prepend(headerElem);
    }

    // 创建 code 区域固定条
    var elemFixbar = jquery('<div class="layui-code-fixbar"></div>');

    // 若开启复制，且未开启预览，则单独生成复制图标
    if(options.copy && !options.preview){
      var copyElem = jquery(['<span class="layui-code-copy">',
        '<i class="layui-icon layui-icon-file-b" title="复制"></i>',
      '</span>'].join(''));

      // 点击复制
      copyElem.on('click', function(){
        tools.copy.event();
      });

      elemFixbar.append(copyElem);
    }

    // 创建 language marker
    if (options.langMarker) {
      elemFixbar.append('<span class="layui-code-lang-marker">' + options.lang + '</span>');
    }

    // 创建 about 自定义内容
    if (options.about) {
      elemFixbar.append(options.about);
    }

    // 生成 code fixbar
    othis.append(elemFixbar);

    // code 渲染完毕后的回调
    if (!options.preview) {
      setTimeout(function(){
        typeof options.done === 'function' && options.done({});
      },3);
    }

    // 所有实例渲染完毕后的回调
    if(options.elem.length === index + 1){
      typeof options.allDone === 'function' && options.allDone();
    }

    return ret;
  }

/**  
 * Layui ES Module 统一入口  
 */  
  
  
// 集成所有模块到 layui 对象  
// layui.lay = lay;  
// layui.layer = layer;  
// layui.laydate = laydate;  
// layui.laypage = laypage;  
// layui.laytpl = laytpl;  
// layui.form = form;  
// layui.upload = upload;  
// layui.dropdown = dropdown;  
// layui.transfer = transfer;  
// layui.tree = tree;  
// layui.table = table;  
// layui.treeTable = treeTable;  
// layui.tabs = tabs;  
// layui.element = element;  
// layui.rate = rate;  
// layui.colorpicker = colorpicker;  
// layui.slider = slider;  
// layui.carousel = carousel;  
// layui.flow = flow;  
// layui.util = util;  
// layui.code = code;  
// layui.jquery = jquery;  
// layui.$ = jquery;  
// layui.component = component;  

const modules = {
  lay,  
  layer: layer$1,  
  laydate,  
  laypage,  
  laytpl,  
  form,  
  upload,  
  dropdown,  
  transfer,  
  tree,  
  table,  
  treeTable,
  tabs: component$1,
  element,
  rate: component,
  colorpicker,
  slider,
  carousel,
  flow,
  util,
  code,
  jquery,
  component: component$2,
};

// 注册内置模块
for (const key in modules) {
  layui.define(function(exports){
    exports(key, modules[key]);
  });
}
layui.$ = jquery; 
layui['layui.all'] = 'layui.all';

export { jquery as $, carousel, code, colorpicker, component$2 as component, layui as default, dropdown, element, flow, form, jquery, lay, laydate, layer$1 as layer, laypage, laytpl, layui, component as rate, slider, table, component$1 as tabs, transfer, tree, treeTable, upload, util };
