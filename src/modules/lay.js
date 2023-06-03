
/** lay 基础模块 | MIT Licensed */

;!function(window){ // gulp build: lay-header
  "use strict";
  
  var MOD_NAME = 'lay'; // 模块名
  var document = window.document;
  
  // 元素查找
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
    lay 对象操作
  */
  
  Class.fn = Class.prototype = [];
  Class.fn.constructor = Class;
  
  // 普通对象深度扩展
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
  
  // ie 版本
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

  
  // 数字前置补零
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
  
  // 创建元素
  lay.elem = function(elemName, attr){
    var elem = document.createElement(elemName);
    lay.each(attr || {}, function(key, value){
      elem.setAttribute(key, value);
    });
    return elem;
  };

  // 当前页面是否存在滚动条
  lay.hasScrollbar = function(){
    return document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight);
  };
  
  // 元素定位
  lay.position = function(elem, elemView, obj){
    if(!elemView) return;
    obj = obj || {};
    
    // 如果绑定的是 document 或 body 元素，则直接获取鼠标坐标
    if(elem === document || elem === lay('body')[0]){
      obj.clickType = 'right';
    }

    // 绑定绑定元素的坐标
    var rect = obj.clickType === 'right' ? function(){
      var e = obj.e || window.event || {};
      return {
        left: e.clientX
        ,top: e.clientY
        ,right: e.clientX
        ,bottom: e.clientY
      }
    }() : elem.getBoundingClientRect()
    ,elemWidth = elemView.offsetWidth // 控件的宽度
    ,elemHeight = elemView.offsetHeight // 控件的高度
    
    // 滚动条高度
    ,scrollArea = function(type){
      type = type ? 'scrollLeft' : 'scrollTop';
      return document.body[type] | document.documentElement[type];
    }
    
    // 窗口宽高
    ,winArea = function(type){
      return document.documentElement[type ? 'clientWidth' : 'clientHeight']
    }, margin = 5, left = rect.left, top = rect.bottom;
    
    // 相对元素居中
    if(obj.align === 'center'){
      left = left - (elemWidth - elem.offsetWidth)/2;
    } else if(obj.align === 'right'){
      left = left - elemWidth + elem.offsetWidth;
    }

    // 判断右侧是否超出边界
    if(left + elemWidth + margin > winArea('width')){
      left = winArea('width') - elemWidth - margin; // 如果超出右侧，则将面板向右靠齐
    }
    // 左侧是否超出边界
    if(left < margin) left = margin;
    
    // 判断底部和顶部是否超出边界
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
    
    // 定位类型
    var position = obj.position;
    if(position) elemView.style.position = position;
    
    // 设置坐标
    elemView.style.left = left + (position === 'fixed' ? 0 : scrollArea(1)) + 'px';
    elemView.style.top = top + (position === 'fixed' ? 0 : scrollArea()) + 'px';

    // 防止页面无滚动条时，又因为弹出面板而出现滚动条导致的坐标计算偏差
    if(!lay.hasScrollbar()){
      var rect1 = elemView.getBoundingClientRect();
      // 如果弹出面板的溢出窗口底部，则表示将出现滚动条，此时需要重新计算坐标
      if(!obj.SYSTEM_RELOAD && (rect1.bottom + margin) > winArea()){
        obj.SYSTEM_RELOAD = true;
        setTimeout(function(){
          lay.position(elem, elemView, obj);
        }, 50);
      }
    }
  };
  
  // 获取元素上的属性配置项
  lay.options = function(elem, opts){
    opts = typeof opts === 'object' ? opts : {attr: opts};

    if(elem === document) return {};

    var othis = lay(elem);
    var attrName = opts.attr || 'lay-options';
    var attrValue = othis.attr(attrName);

    try {
      return new Function('return '+ (attrValue || '{}'))();
    } catch(ev) {
      layui.hint().error(opts.errorText || [
        attrName + '="'+ attrValue + '"', 
        '\n parseerror: '+ ev
      ].join('\n'), 'error');
      return {};
    }
  };
  
  // 元素是否属于顶级元素（document 或 body）
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