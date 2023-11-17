
/** lay 基础模块 | MIT Licensed */

;!function(window){ // gulp build: lay-header
  "use strict";

  var MOD_NAME = 'lay'; // 模块名
  var document = window.document;

  /**
   * 元素查找
   * @param {string | HTMLElement | JQuery} selector
   */
  var lay = function(selector){
    return new Class(selector);
  };

  // 构造器
  var Class = function(selector){
    var that = this;
    var elem = typeof selector === 'object' ? function(){
      // 仅适配简单元素对象
      return layui.isArray(selector) ? selector : [selector];
    }() : (
      this.selector = selector,
      document.querySelectorAll(selector || null)
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
        return !0;
      }
    });
    return rst;
  };

  /*
    lay 对象操作
  */

  Class.fn = Class.prototype = [];
  Class.fn.constructor = Class;

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
    length = args.length

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
    var elem = document.createElement(elemName);
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
    return document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight);
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
    if(target === document || target === lay('body')[0]){
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
      return document.body[type] | document.documentElement[type];
    };

    // 窗口宽高
    var winArea = function(type){
      return document.documentElement[type ? 'clientWidth' : 'clientHeight']
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

    // 设置坐标
    elem.style.left = left + (position === 'fixed' ? 0 : scrollArea(1)) + 'px';
    elem.style.top = top + (position === 'fixed' ? 0 : scrollArea()) + 'px';

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

    if(elem === document) return {};

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
    var topElems = [document, lay('body')[0]]
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
      }else{
        legacyCopy();
      }

      function legacyCopy(){
        var elem = document.createElement('textarea');

        elem.value = text;
        elem.style.position = 'fixed';
        elem.style.opacity = '0';
        elem.style.top = '0px';
        elem.style.left = '0px';

        document.body.appendChild(elem);
        elem.select();

        try {
          document.execCommand('copy');
          typeof options.done === 'function' && options.done();
        } catch(err) {
          typeof options.error === 'function' && options.error(err);
        } finally {
          elem.remove ? elem.remove() : document.body.removeChild(elem);
        }
      }
    }
  };


  /*
   * lay 元素操作
   */


  // 追加字符
  Class.addStr = function(str, new_str){
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
  Class.removeStr = function(str, new_str){
    str = str.replace(/\s+/, ' ');
    new_str = new_str.replace(/\s+/, ' ').split(' ');
    lay.each(new_str, function(ii, item){
      var exp = new RegExp('\\b'+ item + '\\b')
      if(exp.test(str)){
        str = str.replace(exp, '');
      }
    });
    return str.replace(/\s+/, ' ').replace(/^\s|\s$/, '');
  };

  // 查找子元素
  Class.fn.find = function(selector){
    var that = this;
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
  Class.fn.each = function(fn){
    return lay.each.call(this, this, fn);
  };

  // 添加 className
  Class.fn.addClass = function(className, type){
    return this.each(function(index, item){
      item.className = Class[type ? 'removeStr' : 'addStr'](item.className, className)
    });
  };

  // 移除 className
  Class.fn.removeClass = function(className){
    return this.addClass(className, true);
  };

  // 是否包含 css 类
  Class.fn.hasClass = function(className){
    var has = false;
    this.each(function(index, item){
      if(new RegExp('\\b'+ className +'\\b').test(item.className)){
        has = true;
      }
    });
    return has;
  };

  // 添加或获取 css style
  Class.fn.css = function(key, value){
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
  Class.fn.width = function(value){
    var that = this;
    return value === undefined ? function(){
      if(that.length > 0) return that[0].offsetWidth; // 此处还需做兼容
    }() : that.each(function(index, item){
      that.css('width', value);
    });
  };

  // 添加或获取高度
  Class.fn.height = function(value){
    var that = this;
    return value === undefined ? function(){
      if(that.length > 0) return that[0].offsetHeight; // 此处还需做兼容
    }() : that.each(function(index, item){
      that.css('height', value);
    });
  };

  // 添加或获取属性
  Class.fn.attr = function(key, value){
    var that = this;
    return value === undefined ? function(){
      if(that.length > 0) return that[0].getAttribute(key);
    }() : that.each(function(index, item){
      item.setAttribute(key, value);
    });
  };

  // 移除属性
  Class.fn.removeAttr = function(key){
    return this.each(function(index, item){
      item.removeAttribute(key);
    });
  };

  // 设置或获取 HTML 内容
  Class.fn.html = function(html){
    var that = this;
    return html === undefined ? function(){
      if(that.length > 0) return that[0].innerHTML;
    }() : this.each(function(index, item){
      item.innerHTML = html;
    });
  };

  // 设置或获取值
  Class.fn.val = function(value){
    var that = this;
    return value === undefined ? function(){
      if(that.length > 0) return that[0].value;
    }() : this.each(function(index, item){
        item.value = value;
    });
  };

  // 追加内容
  Class.fn.append = function(elem){
    return this.each(function(index, item){
      typeof elem === 'object'
        ? item.appendChild(elem)
      :  item.innerHTML = item.innerHTML + elem;
    });
  };

  // 移除内容
  Class.fn.remove = function(elem){
    return this.each(function(index, item){
      elem ? item.removeChild(elem) : item.parentNode.removeChild(item);
    });
  };

  // 事件绑定
  Class.fn.on = function(eventName, fn){
    return this.each(function(index, item){
      item.attachEvent ? item.attachEvent('on' + eventName, function(e){
        e.target = e.srcElement;
        fn.call(item, e);
      }) : item.addEventListener(eventName, fn, false);
    });
  };

  // 解除事件
  Class.fn.off = function(eventName, fn){
    return this.each(function(index, item){
      item.detachEvent
        ? item.detachEvent('on'+ eventName, fn)
      : item.removeEventListener(eventName, fn, false);
    });
  };

  // export
  window.lay = lay;

  // 输出为 layui 模块
  if(window.layui && layui.define){
    layui.define(function(exports){
      exports(MOD_NAME, lay);
    });
  }

}(window, window.document); // gulp build: lay-footer
