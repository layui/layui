/**
 * util 工具组件
 */

layui.define('jquery', function(exports){
  "use strict";

  var $ = layui.$;
  var hint = layui.hint();

  // 外部接口
  var util = {
    // 固定块
    fixbar: function(options){
      var ELEM = 'layui-fixbar';
      var $doc = $(document);

      // 默认可选项
      options = $.extend(true, {
        target: 'body', // fixbar 的插入目标选择器
        bars: [], //  bar 信息
        "default": true, // 是否显示默认 bar
        margin: 160, // 出现 top bar 的滚动条高度临界值
        duration: 320 // top bar 等动画时长（毫秒）
      }, options);

      // 目标元素对象
      var $target = $(options.target);

      // 滚动条所在元素对象
      var $scroll = options.scroll
        ? $(options.scroll)
      : $(options.target === 'body' ? $doc : $target)

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

      var elem = $('<ul>').addClass(ELEM);
      var elemTopBar;

      // 遍历生成 bars 节点
      layui.each(options.bars, function(i, item){
        var elemBar = $('<li class="layui-icon">');

        // 设置 bar 相关属性
        elemBar.addClass(item.icon).attr({
          'lay-type': item.type,
          'style': item.style || (options.bgcolor ? 'background-color: '+ options.bgcolor : '')
        }).html(item.content);

        // bar 点击事件
        elemBar.on('click', function(){
          var type = $(this).attr('lay-type');
          if(type === 'top'){
            (
              options.target === 'body'
                ? $('html,body')
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
              var type = $(this).attr('lay-type');
              typeof callback === 'function' && callback.call(this, type);
            });
          })
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
      var that = this;

      // 默认可选项
      options = $.extend(true, {
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
          $.extend(true, this.options, {
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
        if(args.length > 1) result = [result.d,result.h,result.m,result.s]

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
      var that = this;
      var date = new Date(function(){
        if(!time) return;
        return isNaN(time) ? time : (typeof time === 'string' ? parseInt(time) : time)
      }() || new Date())

      if(!date.getDate()) return hint.error('Invalid millisecond for "util.toDateString(millisecond)"'), '';

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
      }

      format = format || 'yyyy-MM-dd HH:mm:ss';

      return format.replace(REGEX_FORMAT, function(match, $1) {
        return $1 || (matches[match] && matches[match]()) || match;
      });
    },

    // 转义 html
    escape: function(html){
      var exp = /[<"'>]|&(?=#[a-zA-Z0-9]+)/g;
      if(html === undefined || html === null) return '';

      html += '';
      if(!exp.test(html)) return html;

      return html.replace(/&(?!#?[a-zA-Z0-9]+;)/g, '&amp;')
      .replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/'/g, '&#39;').replace(/"/g, '&quot;');
    },

    // 还原转义的 html
    unescape: function(html){
      if(html === undefined || html === null) html = '';
      html += '';

      return html.replace(/\&amp;/g, '&')
      .replace(/\&lt;/g, '<').replace(/\&gt;/g, '>')
      .replace(/\&#39;/g, '\'').replace(/\&quot;/g, '"');
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
      options = $.extend({
        margin: 160, // 触发动作的边界值
        duration: 200, // 动画持续毫秒数
        type: 'y' // 触发方向，x 水平、y 垂直
      }, options);

      if(!options.scrollElem[0] || !options.thisElem[0]) return;

      var scrollElem = options.scrollElem // 滚动元素
      var thisElem = options.thisElem // 目标元素
      var vertical = options.type === 'y' // 是否垂直方向
      var SCROLL_NAME = vertical ? 'scrollTop' : 'scrollLeft' // 滚动方法
      var OFFSET_NAME = vertical ? 'top' : 'left' // 坐标方式
      var scrollValue = scrollElem[SCROLL_NAME]() // 当前滚动距离
      var size = scrollElem[vertical ? 'height' : 'width']() // 滚动元素的尺寸
      var scrollOffset = scrollElem.offset()[OFFSET_NAME] // 滚动元素所处位置
      var thisOffset = thisElem.offset()[OFFSET_NAME] - scrollOffset // 目标元素当前的所在位置
      var obj = {};

      // 边界满足条件
      if(thisOffset > size - options.margin || thisOffset < options.margin){
        obj[SCROLL_NAME] = thisOffset - size/2 + scrollValue
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
      options = $.extend({
        elem: 'body',
        trigger: 'click'
      }, typeof options === 'object' ? options : {
        trigger: options // 兼容旧版
      });

      var elem = options.elem = $(options.elem);
      var attrSelector = '['+ attr +']';
      var DATANAME = 'UTIL_ON_DATA'; // 缓存在委托元素上的 data-* 属性名

      if (!elem[0]) return; // 若委托元素不存在

      // 初始化 data 默认值，以委托元素为存储单元
      if (!elem.data(DATANAME)) {
        elem.data(DATANAME, {
          events: {},
          callbacks: {}
        });
      }

      // 读取 data 缓存
      var dataCache = elem.data(DATANAME);
      var callbacks = dataCache.callbacks;

      // 根据 attr 记录事件集合
      events = dataCache.events[attr] = $.extend(true, dataCache.events[attr], events);

      // 清除事件委托，避免重复绑定
      elem.off(options.trigger, attrSelector, callbacks[attr]);

      // 绑定事件委托
      elem.on(
        options.trigger,
        attrSelector,
        callbacks[attr] = function(e) {
          var othis = $(this);
          var key = othis.attr(attr);
          typeof events[key] === 'function' && events[key].call(this, othis, e);
        }
      );

      return events;
    }
  };

  // 兼容旧版
  util.event = util.on;

  // 输出接口
  exports('util', util);
});
