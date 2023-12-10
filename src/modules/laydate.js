/** laydate 日期与时间控件 | MIT Licensed */

;!function(window, document){ // gulp build: laydate-header
  "use strict";

  var isLayui = window.layui && layui.define, ready = {
    getPath: (window.lay && lay.getPath) ? lay.getPath : ''

    // 载入 CSS 依赖
    ,link: function(href, fn, cssname){

      // 未设置路径，则不主动加载 css
      if(!laydate.path) return;

      // 加载 css
      if(window.lay && lay.layui){
        lay.layui.link(laydate.path + href, fn, cssname);
      }
    }
  };

  // 识别预先可能定义的指定全局对象
  var GLOBAL = window.LAYUI_GLOBAL || {};

  // 模块名
  var MOD_NAME = 'laydate';
  var MOD_ID = 'layui-'+ MOD_NAME +'-id' // 已渲染过的索引标记名

  // 外部调用
  var laydate = {
    v: '5.5.0' // layDate 版本号
    ,config: {
      weekStart: 0, // 默认周日一周的开始
    } // 全局配置项
    ,index: (window.laydate && window.laydate.v) ? 100000 : 0
    ,path: GLOBAL.laydate_dir || ready.getPath

    // 设置全局项
    ,set: function(options){
      var that = this;
      that.config = lay.extend({}, that.config, options);
      return that;
    }

    // 主体 CSS 等待事件
    ,ready: function(callback){
      var cssname = 'laydate';
      var ver = ''
      var path = (isLayui ? 'modules/' : '') + 'laydate.css?v='+ laydate.v + ver;

      isLayui ? (
        layui['layui.all']
          ? (typeof callback === 'function' && callback())
        : layui.addcss(path, callback, cssname)
      ) : ready.link(path, callback, cssname);

      return this;
    }
  };

  // 操作当前实例
  var thisModule = function(){
    var that = this;
    var options = that.config;
    var id = options.id;

    thisModule.that[id] = that; // 记录当前实例对象

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
  var ELEM = '.layui-laydate';
  var THIS = 'layui-this';
  var SHOW = 'layui-show';
  var HIDE = 'layui-hide';
  var DISABLED = 'laydate-disabled';
  var LIMIT_YEAR = [100, 200000];

  var ELEM_STATIC = 'layui-laydate-static';
  var ELEM_LIST = 'layui-laydate-list';
  var ELEM_SELECTED = 'laydate-selected';
  var ELEM_HINT = 'layui-laydate-hint';
  var ELEM_DAY_NOW = 'laydate-day-now';
  var ELEM_PREV = 'laydate-day-prev';
  var ELEM_NEXT = 'laydate-day-next';
  var ELEM_FOOTER = 'layui-laydate-footer';
  var ELEM_SHORTCUT = 'layui-laydate-shortcut';
  var ELEM_NOW = '.laydate-btns-now'
  var ELEM_CONFIRM = '.laydate-btns-confirm';
  var ELEM_TIME_TEXT = 'laydate-time-text';
  var ELEM_TIME_BTN = 'laydate-btns-time';
  var ELEM_PREVIEW = 'layui-laydate-preview';
  var ELEM_MAIN = 'layui-laydate-main';
  var ELEM_SHADE = 'layui-laydate-shade';

  // 组件构造器
  var Class = function(options){
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
    if(elem[0] && elem.attr(MOD_ID)){
      var newThat = thisModule.getThis(elem.attr(MOD_ID));
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
  thisModule.formatArr = function(format){
    return (format || '').match(new RegExp(dateType + '|.', 'g')) || []
  };

  /*
    组件操作
  */

  // 是否闰年
  Class.isLeapYear = function(year){
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  };

  // 默认配置
  Class.prototype.config = {
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
  Class.prototype.lang = function(){
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

  // 重载实例
  Class.prototype.reload = function(options){
    var that = this;
    that.config = lay.extend({}, that.config, options);
    that.init();
  };

  //初始准备
  Class.prototype.init = function(){
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
    that.rangeLinked = !!(options.range && options.rangeLinked && (options.type === 'date' || options.type === 'datetime'))

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
      window.console && console.error && console.error('laydate type error:\''+ options.type + '\' is not supported')
      options.type = 'date';
    }

    //根据不同 type，初始化默认 format
    if(options.format === format.date){
      options.format = format[options.type] || format.date;
    }

    //将日期格式转化成数组
    that.format = thisModule.formatArr(options.format);

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
    options.elem.attr(MOD_ID, options.id); // 渲染过的标记

    //记录重要日期
    options.mark = lay.extend({}, (options.calendar && options.lang === 'cn') ? {
      '0-1-1': '元旦'
      ,'0-2-14': '情人'
      ,'0-3-8': '妇女'
      ,'0-3-12': '植树'
      ,'0-4-1': '愚人'
      ,'0-5-1': '劳动'
      ,'0-5-4': '青年'
      ,'0-6-1': '儿童'
      ,'0-9-10': '教师'
      ,'0-10-1': '国庆'
      ,'0-12-25': '圣诞'
    } : {}, options.mark);

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
  Class.prototype.render = function(){
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
          })
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
        }), spanY = lay.elem('span'), spanM = lay.elem('span');
        elem.appendChild(spanY);
        elem.appendChild(spanM);
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
        "class": ELEM_MAIN + ' laydate-main-list-'+ i
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
        html.push('<span class="'+ ELEM_PREVIEW +'" title="'+ lang.preview +'"></span>')
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
          shortcutBtns.push('<li data-index="' + i + '">'+item.text+'</li>')
        })
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
              lay.extend(dateTime, {hours: item[0] | 0, minutes: item[2] | 0, seconds: item[4] | 0})
            }
          } else {
            lay.extend(dateTime, that.systemDate(layui.type(item) === 'date' ? item : new Date(item)))
          }

          if (type === 'time' || type === 'datetime') {
            that[['startTime', 'endTime'][i]] = {
              hours: dateTime.hours,
              minutes: dateTime.minutes,
              seconds: dateTime.seconds,
            }
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

        var timeBtn = lay(that.footer).find('.'+ ELEM_TIME_BTN).removeClass(DISABLED);
        timeBtn && timeBtn.attr('lay-type') === 'date' && timeBtn[0].click();
        that.done(null, 'change');

        lay(this).addClass(THIS);

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
      })
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
      styleText.push('#{{id}}.layui-laydate-range{width: 628px;}'.replace(/{{id}}/g, that.elemID))
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
    that.remove(Class.thisElemDate);

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

    Class.thisElemDate = that.elemID;

    that.renderAdditional()
    typeof options.ready === 'function' && options.ready(lay.extend({}, options.dateTime, {
      month: options.dateTime.month + 1
    }));

    that.preview();
  };

  //控件移除
  Class.prototype.remove = function(prev){
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
  Class.prototype.position = function(){
    var that = this
    ,options = that.config;
    lay.position(options.elem[0], that.elem, {
      position: options.position
    });
    return that;
  };

  // 提示
  Class.prototype.hint = function(opts){
    var that = this;
    var options = that.config;
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
      }
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
  Class.prototype.getAsYM = function(Y, M, type){
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
  Class.prototype.systemDate = function(newDate){
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
  Class.prototype.checkDate = function(fn){
    var that = this
    ,thisDate = new Date()
    ,options = that.config
    ,lang = that.lang()
    ,dateTime = options.dateTime = options.dateTime || that.systemDate()
    ,thisMaxDate, error

    ,elem = options.elem[0]
    ,valType = that.isInput(elem) ? 'val' : 'html'
    ,value = function(){
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
      }
      that.endTime = {
        hours: that.endDate.hours,
        minutes: that.endDate.minutes,
        seconds: that.endDate.seconds,
      }
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

  // 公历重要日期与自定义备注
  Class.prototype.mark = function(td, YMD){
    var that = this
    ,mark, options = that.config;
    lay.each(options.mark, function(key, title){
      var keys = key.split('-');
      if((keys[0] == YMD[0] || keys[0] == 0) //每年的每月
      && (keys[1] == YMD[1] || keys[1] == 0) //每月的每日
      && keys[2] == YMD[2]){ //特定日
        mark = title || YMD[2];
      }
    });
    mark && td.find('div').html('<span class="laydate-day-mark">'+ mark +'</span>');

    return that;
  };

  // 标注法定节假日或补假上班
  Class.prototype.holidays = function(td, YMD) {
    var that = this;
    var options = that.config;
    var type = ['', 'work'];

    if(layui.type(options.holidays) !== 'array') return that;

    lay.each(options.holidays, function(idx, item) {
      lay.each(item, function(i, dayStr) {
        if(dayStr === td.attr('lay-ymd')){
          td.find('div').html('<span class="laydate-day-holidays"' + (
            type[idx] ? ('type="'+ type[idx] +'"') : ''
          ) + '>' + YMD[2] + '</span>');
        }
      });
    });

    return that;
  };

  // 无效日期范围的标记
  Class.prototype.limit = function(opts){
    opts = opts || {};

    var that = this;
    var options = that.config;
    var timestamp = {}
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

    isOut = timestamp.now < timestamp.min || timestamp.now > timestamp.max;
    opts.elem && opts.elem[isOut ? 'addClass' : 'removeClass'](DISABLED);

    return isOut;
  };

  //当前日期对象
  Class.prototype.thisDateTime = function(index){
    var that = this
    ,options = that.config;
    return index ? that.endDate: options.dateTime;
  };

  //日历表
  Class.prototype.calendar = function(value, index, type){
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
          st + 1 === dateTime.date && item.addClass(THIS);
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
        index: index_
      });
    });

    //同步头部年月
    lay(elemYM[0]).attr('lay-ym', dateTime.year + '-' + (dateTime.month + 1));
    lay(elemYM[1]).attr('lay-ym', dateTime.year + '-' + (dateTime.month + 1));

    if(options.lang === 'cn'){
      lay(elemYM[0]).attr('lay-type', 'year').html(dateTime.year + ' 年')
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
        var EYM = that.getAsYM(dateTime.year, dateTime.month, index ? 'sub' : null)
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
        time: timeParams
      });
      // 确认按钮
      that.limit({
        elem: lay(that.footer).find(ELEM_CONFIRM),
        index: 0,
        time: timeParams
      });
    }

    //同步按钮可点状态
    that.setBtnStatus();

    // 重置快捷栏选中状态
    lay(that.shortcut).find('li.' + THIS).removeClass(THIS);

    //标记选择范围
    if(options.range && !isAlone && type !== 'init') that.stampRange();

    return that;
  };

  //生成年月时分秒列表
  Class.prototype.list = function(type, index){
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

        yearNum == listYM[0] && lay(li).addClass(THIS);
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
          type: type
        });
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

        i + 1 == listYM[1] && lay(li).addClass(THIS);
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
          type: type
        });
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
            time: ['hours', 'minutes', 'seconds']
          });
        }
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
          childUL.push('<li'+ (that[startEnd][hms[i]] === ii ? ' class="'+ THIS +'"' : '') +'>'+ lay.digit(ii, 2) +'</li>');
        });
        li.innerHTML = childUL.join('') + '</ol>';
        ul.appendChild(li);
      });
      setTimeStatus();
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
        if(lay(this).hasClass(DISABLED)) return;
        if (that.rangeLinked) {
          lay.extend(dateTime, {
            year: type === 'year' ? ym : listYM[0]
            ,month: type === 'year' ? listYM[1] - 1 : ym
          });
        } else {
          dateTime[type] = ym;
        }

        //当为年选择器或者年月选择器
        var isYearOrMonth = options.type === 'year' || options.type === 'month';
        if(isYearOrMonth){
          lay(ul).find('.'+ THIS).removeClass(THIS);
          lay(this).addClass(THIS);

          //如果为年月选择器，点击了年列表，则切换到月选择器
          if(options.type === 'month' && type === 'year'){
            that.listYM[index][0] = ym;
            isAlone && ((index ? that.endDate : dateTime).year = ym);
            that.list('month', index);
          }
        } else {
          that.checkDate('limit').calendar(dateTime, index, 'init'); // 重新渲染一下两个面板
          that.closeList();
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
        lay(that.footer).find('.'+ ELEM_TIME_BTN).removeClass(DISABLED);
      });
    } else { //时间选择面板 - 选择事件
      var span = lay.elem('span', {
        "class": ELEM_TIME_TEXT
      })

      //滚动条定位
      ,scroll = function(){
        lay(ul).find('ol').each(function(i){
          var ol = this
          ,li = lay(ol).find('li')
          ol.scrollTop = 30*(that[startEnd][hms[i]] - 2);
          if(ol.scrollTop <= 0){
            li.each(function(ii, item){
              if(!lay(this).hasClass(DISABLED)){
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

      lay(ul).find('ol').each(function(i){
        var ol = this;
        //选择时分秒
        lay(ol).find('li').on('click', function(){
          var value = this.innerHTML | 0;
          if(lay(this).hasClass(DISABLED)) return;

          if(options.range){
            that[startEnd][hms[i]]  = value;
          } else {
            dateTime[hms[i]] = value;
          }
          lay(ol).find('.'+ THIS).removeClass(THIS);
          lay(this).addClass(THIS);

          setTimeStatus();
          scroll();
          (that.endDate || options.type === 'time' || (options.type === 'datetime' && options.fullPanel)) && that.done(null, 'change');

          //同步按钮可点状态
          that.setBtnStatus();
        });
      });
    }

    return that;
  };

  //记录列表切换后的年月
  Class.prototype.listYM = [];

  //关闭列表
  Class.prototype.closeList = function(){
    var that = this
    ,options = that.config;

    lay.each(that.elemCont, function(index, item){
      lay(this).find('.'+ ELEM_LIST).remove();
      lay(that.elemMain[index]).removeClass('laydate-ym-show laydate-time-show');
    });
    lay(that.elem).find('.'+ ELEM_TIME_TEXT).remove();
  };

  //检测结束日期是否超出开始日期
  Class.prototype.setBtnStatus = function(tips, start, end){
    var that = this
    ,options = that.config
    ,lang = that.lang()
    ,isOut, elemBtn = lay(that.footer).find(ELEM_CONFIRM);
    if(options.range && options.type !== 'time'){
      start = start || (that.rangeLinked ? that.startDate : options.dateTime);
      end = end || that.endDate;
      isOut = !that.endState || that.newDate(start).getTime() > that.newDate(end).getTime();

      //如果不在有效日期内，直接禁用按钮，否则比较开始和结束日期
      (that.limit({
        date: start
      }) || that.limit({
        date: end
      }))
        ? elemBtn.addClass(DISABLED)
      : elemBtn[isOut ? 'addClass' : 'removeClass'](DISABLED);

      //是否异常提示
      if(tips && isOut) that.hint(
        typeof tips === 'string' ? lang.timeout.replace(/日期/g, tips) : lang.timeout
      );
    }
  };

  // 转义为规定格式的日期字符
  Class.prototype.parse = function(state, date) {
    var that = this;
    var options = that.config;
    var startDate = (that.rangeLinked ? that.startDate : options.dateTime)
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
  Class.prototype.newDate = function(dateTime){
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
  Class.prototype.getDateTime = function(obj){
    return this.newDate(obj).getTime();
  }

  //赋值
  Class.prototype.setValue = function(value){
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
          lay(elem).html(value);
        }
        lay(elem).attr('lay-date', value);
      }
    }

    return that;
  };

  //预览
  Class.prototype.preview = function(){
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
  Class.prototype.renderAdditional = function(){
    var that = this;
    var options = that.config;

    // 处理全面板
    if (options.fullPanel) {
      that.list('time', 0);
    }
  };

  // 标记范围内的日期
  Class.prototype.stampRange = function(){
    var that = this
      ,options = that.config
      ,startTime = that.rangeLinked ? that.startDate : options.dateTime, endTime
      ,tds = lay(that.elem).find('td');

    if(options.range && !that.endState) lay(that.footer).find(ELEM_CONFIRM).addClass(DISABLED);
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
            lay(item).hasClass(ELEM_PREV) || lay(item).hasClass(ELEM_NEXT)
              ? ''
            : ELEM_DAY_NOW
          );
        }
      }

      /*
       * 标注区间
       */

      lay(item).removeClass(ELEM_SELECTED + ' ' + THIS);

      if(thisTime === startTime || thisTime === endTime){
        (that.rangeLinked || (!that.rangeLinked && (i < 42 ? thisTime === startTime : thisTime === endTime))) &&
        lay(item).addClass(
          lay(item).hasClass(ELEM_PREV) || lay(item).hasClass(ELEM_NEXT)
            ? ELEM_SELECTED
            : THIS
        );
      }
      if(thisTime > startTime && thisTime < endTime){
        lay(item).addClass(ELEM_SELECTED);
      }
    });
  };

  // 执行 done/change 回调
  Class.prototype.done = function(param, type){
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

  //选择日期
  Class.prototype.choose = function(td, index){
    if(td.hasClass(DISABLED)) return;

    var that = this
    ,options = that.config
    ,panelIndex = index; // 记录点击的是哪一个面板的

    if (that.rangeLinked) {
      if (that.endState || !that.startDate) {
        // 重新选择或者第一次选择
        index = 0;
        that.endState = false;
        that.endDate = {};
      } else {
        index = 1;
        that.endState = true;
      }
    }

    var dateTime = that.thisDateTime(index)

    ,tds = lay(that.elem).find('td')
    ,YMD = td.attr('lay-ymd').split('-');

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
      if (that.endState && !that.limit({date: that.thisDateTime(1 - index)})) {
        // 根据选择之后判断是否需要切换模式
        var isChange;
        if (that.endState && that.autoCalendarModel.auto) {
          isChange = that.autoCalendarModel();
        }
        if ((isChange || that.rangeLinked && that.endState) && that.newDate(that.startDate) > that.newDate(that.endDate)) {
          var isSameDate = that.startDate.year === that.endDate.year && that.startDate.month === that.endDate.month && that.startDate.date === that.endDate.date;
          // 判断是否反选
          var startDate = that.startDate;
          that.startDate = lay.extend({}, that.endDate, isSameDate ? {} : that.startTime);
          options.dateTime = lay.extend({}, that.startDate);
          that.endDate = lay.extend({}, startDate, isSameDate ? {} : that.endTime);
          isSameDate && ( // 如果是同一天并且出现了反选证明是时分秒出现开始时间大于结束时间的现象
            startDate = that.startTime,
              that.startTime = that.endTime,
              that.endTime = startDate
          )
        }
        isChange && (options.dateTime = lay.extend({}, that.startDate));
      }
      if (that.rangeLinked) {
        var dateTimeTemp = lay.extend({}, dateTime);
        if (panelIndex && !index && !isChange) { // 处理可能出现的联动面板中点击右面板但是判定为开始日期这个时候点击头部的切换上下月第一次没有反应的问题
          // 选择了右面板但是判断之后作为开始时间
          var YM = that.getAsYM(dateTime.year, dateTime.month, 'sub');
          lay.extend(options.dateTime, {
            year: YM[0]
            ,month: YM[1]
          });
        }
        that.calendar(dateTimeTemp, panelIndex, isChange ? 'init' : null);
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
  Class.prototype.tool = function(btn, type){
    var that = this
    ,options = that.config
    ,lang = that.lang()
    ,dateTime = options.dateTime
    ,isStatic = options.position === 'static'
    ,active = {
      //选择时间
      datetime: function(){
        if(lay(btn).hasClass(DISABLED)) return;
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
        )
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
        if(lay(btn).hasClass(DISABLED)){
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
          if(lay(btn).hasClass(DISABLED)) return that.hint(
            options.type === 'time' ? lang.timeout.replace(/日期/g, '时间') : lang.timeout
          );
        } else {
          if(lay(btn).hasClass(DISABLED)) return that.hint(lang.invalidDate);
        }

        that.setValue(that.parse());
        that.done(null, 'onConfirm').done().remove();
      }
    };
    active[type] && active[type]();
  };

  //统一切换处理
  Class.prototype.change = function(index){
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
            year: listYM[0]
          }
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
        if (that.rangeLinked) {
          dateTime = options.dateTime;
        }
        var YM = that.getAsYM(dateTime.year, dateTime.month, 'sub');
        lay.extend(dateTime, {
          year: YM[0]
          ,month: YM[1]
        });

        that.checkDate('limit').calendar(null, null, 'init');
        if (!that.rangeLinked) {
          that.autoCalendarModel.auto ? that.choose(lay(elemCont).find('td.layui-this'), index) : that.done(null, 'change');
        }
      }
      ,nextMonth: function(){
        if (that.rangeLinked) {
          dateTime = options.dateTime;
        }
        var YM = that.getAsYM(dateTime.year, dateTime.month);
        lay.extend(dateTime, {
          year: YM[0]
          ,month: YM[1]
        });

        that.checkDate('limit').calendar(null, null, 'init');
        if (!that.rangeLinked) {
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
  Class.prototype.changeEvent = function(){
    var that = this
    ,options = that.config;

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
        lay(that.footer).find('.'+ ELEM_TIME_BTN).addClass(DISABLED);
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
  Class.prototype.isInput = function(elem){
    return /input|textarea/.test(elem.tagName.toLocaleLowerCase()) || /INPUT|TEXTAREA/.test(elem.tagName);
  };

  //绑定的元素事件处理
  Class.prototype.events = function(){
    var that = this
    var options = that.config

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
      options.elem.removeAttr(MOD_ID);
      options.elem[0].eventHandler = false;
      options.eventElem.off(options.trigger, showEvent);
      options.eventElem.removeAttr('lay-key');
      delete thisModule.that[options.id];
    };
  };

  //记录所有实例
  thisModule.that = {}; //记录所有实例对象

  //获取当前实例对象
  thisModule.getThis = function(id){
    var that = thisModule.that[id];
    if(!that && isLayui) layui.hint().error(id ? (MOD_NAME +' instance with ID \''+ id +'\' not found') : 'ID argument required');
    return that;
  };

  // 初始执行
  ready.run = function(lay){
    // 绑定关闭控件事件
    lay(document).on('mousedown', function(e){
      if(!laydate.thisId) return;
      var that = thisModule.getThis(laydate.thisId);
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
      var that = thisModule.getThis(laydate.thisId);
      if(!that) return;

      // 回车触发确认
      if(that.config.position === 'static') return;
      if(e.keyCode === 13){
        if(lay('#'+ that.elemID)[0] && that.elemID === Class.thisElemDate){
          e.preventDefault();
          lay(that.footer).find(ELEM_CONFIRM)[0].click();
        }
      }
    });

    //自适应定位
    lay(window).on('resize', function(){
      if(!laydate.thisId) return;
      var that = thisModule.getThis(laydate.thisId);
      if(!that) return;

      if(!that.elem || !lay(ELEM)[0]){
        return false;
      }

      that.position();
    });
  };

  // 渲染 - 核心接口
  laydate.render = function(options){
    var inst = new Class(options);
    return thisModule.call(inst);
  };

  // 重载
  laydate.reload = function (id, options) {
    var that = thisModule.getThis(id);
    if(!that) return;
    return that.reload(options);
  };

  // 获取对应 ID 的实例
  laydate.getInst = function (id) {
    var that = thisModule.getThis(id);
    if(that){
      return that.inst;
    }
  };

  // 面板提示
  laydate.hint = function(id, opts){
    var that = thisModule.getThis(id);
    if(!that) return;
    return that.hint(opts);
  };

  // 解绑实例
  laydate.unbind = function(id){
    var that = thisModule.getThis(id);
    if(!that) return;
    return that.unbind();
  };

  // 关闭日期面板
  laydate.close = function(id){
    var that = thisModule.getThis(id || laydate.thisId);
    if(!that) return;
    return that.remove();
  };

  // 将指定对象转化为日期值
  laydate.parse = function(dateTime, format, one){
    dateTime = dateTime || {};

    //如果 format 是字符型，则转换为数组格式
    if(typeof format === 'string'){
      format = thisModule.formatArr(format);
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

  //加载方式
  isLayui ? (
    laydate.ready()
    ,layui.define('lay', function(exports){ //layui 加载
      laydate.path = layui.cache.dir;
      ready.run(lay);
      exports(MOD_NAME, laydate);
    })
  ) : (
    (typeof define === 'function' && define.amd) ? define(function(){ //requirejs 加载
      ready.run(lay);
      return laydate;
    }) : function(){ //普通 script 标签加载
      laydate.ready();
      ready.run(window.lay);
      window.laydate = laydate;
    }()
  );

}(window, window.document);

