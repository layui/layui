/**
 * form 表单组件
 */

layui.define(['lay', 'layer', 'util'], function(exports){
  "use strict";

  var $ = layui.$;
  var layer = layui.layer;
  var util = layui.util;
  var hint = layui.hint();
  var device = layui.device();
  var needCheckboxFallback = lay.ie && parseFloat(lay.ie) === 8;

  var MOD_NAME = 'form';
  var ELEM = '.layui-form';
  var THIS = 'layui-this';
  var SHOW = 'layui-show';
  var HIDE = 'layui-hide';
  var DISABLED = 'layui-disabled';
  var OUT_OF_RANGE = 'layui-input-number-out-of-range';
  var BAD_INPUT = 'layui-input-number-invalid';

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
    $.extend(true, that.config, options);
    return that;
  };

  // 验证规则设定
  Form.prototype.verify = function(settings){
    var that = this;
    $.extend(true, that.config.verify, settings);
    return that;
  };

  // 获取指定表单对象
  Form.prototype.getFormElem = function(filter){
    return $(ELEM + function(){
      return filter ? ('[lay-filter="' + filter +'"]') : '';
    }());
  };

  // 表单事件
  Form.prototype.on = function(events, callback){
    return layui.onevent.call(this, MOD_NAME, events, callback);
  };

  // 赋值/取值
  Form.prototype.val = function(filter, object){
    var that = this
    ,formElem = that.getFormElem(filter);

    // 遍历
    formElem.each(function(index, item){
      var itemForm = $(this);

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
      };
    });

    form.render(null, filter);

    // 返回值
    return that.getValue(filter);
  };

  // 取值
  Form.prototype.getValue = function(filter, itemForm){
    itemForm = itemForm || this.getFormElem(filter);

    var nameIndex = {} // 数组 name 索引
    ,field = {}
    ,fieldElem = itemForm.find('input,select,textarea') // 获取所有表单域

    layui.each(fieldElem, function(_, item){
      var othis = $(this)
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
    var elemForm = $(ELEM + function(){
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
            var isDecrement = !!$(that).index() // 0: icon-up, 1: icon-down
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
            elem.attr('lay-input-mirror', elem.val())
          }

          // 超出范围的样式
          var outOfRange = value < min || value > max;
          elem[outOfRange && !noAction ? 'addClass' : 'removeClass'](OUT_OF_RANGE);

          if(isInit) return;

          // 更新按钮状态
          var controlBtn = {
            increment: elem.next().find('.layui-icon-up'),
            decrement: elem.next().find('.layui-icon-down')
          }
          controlBtn.increment[(value >= max && !noAction) ? 'addClass' : 'removeClass'](DISABLED)
          controlBtn.decrement[(value <= min && !noAction) ? 'addClass' : 'removeClass'](DISABLED)
        }

        // 初始化输入框动态点缀
        elemForm.find('input[lay-affix],textarea[lay-affix]').each(function(){
          var othis = $(this);
          var affix = othis.attr('lay-affix');
          var CLASS_WRAP = 'layui-input-wrap';
          var CLASS_SUFFIX = 'layui-input-suffix';
          var CLASS_AFFIX = 'layui-input-affix';
          var disabled = othis.is('[disabled]') || othis.is('[readonly]');

          // 根据是否空值来显示或隐藏元素
          var showAffix = function(elem, value){
            elem = $(elem);
            if(!elem[0]) return;
            elem[$.trim(value) ? 'removeClass' : 'addClass'](HIDE);
          };

          // 渲染动态点缀内容
          var renderAffix = function(opts){
            opts = $.extend({}, (affixOptions[affix] || {
              value: affix
            }), opts, lay.options(othis[0]));
            var elemAffix = $('<div class="'+ CLASS_AFFIX +'">');
            var value = layui.isArray(opts.value) ? opts.value : [opts.value];
            var elemIcon = $(function(){
              var arr = [];
              layui.each(value, function(i, item){
                arr.push('<i class="layui-icon layui-icon-'+ item + (
                  opts.disabled ? (' '+ DISABLED) : ''
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
              if($(this).hasClass(DISABLED)) return;

              typeof opts.click === 'function' && opts.click.call(this, othis, opts);

              // 对外事件
              layui.event.call(this, MOD_NAME, 'input-affix('+ inputFilter +')', {
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
                showAffix($(this).parent(), null);
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
                  })
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
                  })
                  // 响应鼠标滚轮或触摸板
                  if(isMouseWheel){
                    elem.on(['wheel','mousewheel','DOMMouseScroll'].join(ns + ' ') + ns, function (e) {
                      if(!btnElem.length) return;
                      if(!$(this).is(':focus')) return;
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
                    })
                  }

                  if(isReadonly){
                    btnElem.addClass(DISABLED);
                  }
                }
                handleInputNumber.call(this, elem, 'init')
              },
              click: function(elem){
                handleInputNumber.call(this, elem, 'click')
              },
              blur: function(elem){
                handleInputNumber.call(this, elem, 'blur')
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
        var PANEL_WRAP = 'layui-select-panel-wrap'
        var PANEL_ELEM_DATA = 'layui-select-panel-elem-data';
        var selects = elem || elemForm.find('select');

        // 各种事件
        var events = function(reElem, titleElem, disabled, isSearch, isCreatable, isAppendTo){
          var select = $(this);
          var title = titleElem;
          var input = title.find('input');
          var dl = reElem.find('dl');
          var dds = dl.children('dd');
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
              }

              updatePosition();
              $(window).on('resize.lay_select_resize', updatePosition);
            }
            var top = reElem.offset().top + reElem.outerHeight() + 5 - $win.scrollTop();
            var dlHeight = dl.outerHeight();
            var dds = dl.children('dd');

            index = select[0].selectedIndex; // 获取最新的 selectedIndex
            title.parent().addClass(CLASS+'ed');
            dds.removeClass(HIDE);
            dts.removeClass(HIDE);

            // 初始选中样式
            dds.removeClass(THIS);
            index >= 0 && dds.eq(index).addClass(THIS);

            // 上下定位识别
            if(top + dlHeight > $win.height() && top >= dlHeight){
              reElem.addClass(CLASS + 'up');
            }

            followScroll();

            if(needPlaceholderPatch){
              dl.off('mousedown.lay_select_ieph').on('mousedown.lay_select_ieph', function(){
                input[0].__ieph = true;
                setTimeout(function(){
                  input[0].__ieph = false;
                }, 60)
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
              $(window).off('resize.lay_select_resize');
            }

            if(choose) return;

            notOption(input.val(), function(none){
              var selectedIndex = select[0].selectedIndex;

              // 未查询到相关值
              if(none){
                initValue = $(select[0].options[selectedIndex]).html(); // 重新获得初始选中值

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
            var thisDd = dl.children('dd.'+ THIS);

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
              var allDisplayedElem = dl.children('dd:not(.'+ HIDE +',.'+ DISABLED +')');
              if(!allDisplayedElem.length) return;
              var firstIndex = 0;
              var lastIndex = allDisplayedElem.length - 1;
              var selectedIndex = -1;

              layui.each(allDisplayedElem, function(index, el){
                if($(el).hasClass(THIS)){
                  selectedIndex = index;
                  return true;
                }
              })

              var nextIndex = prevNext === 'prev'
                ? (selectedIndex - 1 < firstIndex ? lastIndex : selectedIndex - 1)
                : (selectedIndex + 1 > lastIndex ? firstIndex : selectedIndex + 1)

              var selectedElem = allDisplayedElem.eq(nextIndex);
              selectedElem.addClass(THIS).siblings().removeClass(THIS); // 标注样式
              followScroll(); // 定位滚动条
            };

            if(keyCode === 38) setThisDd('prev'); // Up 键
            if(keyCode === 40) setThisDd('next'); // Down 键

            // Enter 键
            if(keyCode === 13){
              e.preventDefault();
              dl.children('dd.'+THIS).trigger('click');
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
              var othis = $(this);
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
              origin === 'keyup' && othis[(isCreatable ? (not && !isCreateOption) : not) ? 'addClass' : 'removeClass'](HIDE);
            });
            // 处理 select 分组元素
            origin === 'keyup' && layui.each(dts, function(){
              var othis = $(this);
              var thisDds = othis.nextUntil('dt').filter('dd'); // 当前分组下的dd元素
              if(isCreatable) thisDds = thisDds.not('.' + CREATE_OPTION);
              var allHide = thisDds.length == thisDds.filter('.' + HIDE).length; // 当前分组下所有dd元素都隐藏了
              othis[allHide ? 'addClass' : 'removeClass'](HIDE);
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
                }else{
                  var createOptionElem = dl.children('.' + CREATE_OPTION);
                  if(createOptionElem[0]){
                    createOptionElem.attr('lay-value', value).html(util.escape(value));
                  }else{
                    // 临时显示在顶部
                    var ddElem = $('<dd>').addClass(CREATE_OPTION).attr('lay-value', value).html(util.escape(value));
                    var firstOptionELem = dl.children().eq(0);
                    var hasTips = firstOptionELem.hasClass('layui-select-tips');
                    firstOptionELem[hasTips ? 'after' : 'before'](ddElem);
                  }
                }
              }else{
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
              dl.find('.'+ THIS).removeClass(THIS);
              (select[0].options[0] || {}).value || dl.children('dd:eq(0)').addClass(THIS);
              dl.find('.'+ NONE).remove();
              isCreatable && dl.children('.' + CREATE_OPTION).remove();
            }

            followScroll(); // 定位滚动条
          };

          if(isSearch){
            input.on('input propertychange', layui.debounce(search, 50)).on('blur', function(e){
              var selectedIndex = select[0].selectedIndex;

              initValue = $(select[0].options[selectedIndex]).text(); // 重新获得初始选中值

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
            var othis = $(this), value = othis.attr('lay-value');
            var filter = select.attr('lay-filter'); // 获取过滤器

            if(othis.hasClass(DISABLED)) return false;

            if(othis.hasClass('layui-select-tips')){
              input.val('');
            } else {
              input.val(othis.text());
              othis.addClass(THIS);
            }

            // 将新增的 option 元素添加到末尾
            if(isCreatable && othis.hasClass(CREATE_OPTION)){
              dl.append(othis.removeClass(CREATE_OPTION));
              var optionElem = $('<option>').attr('value', value).text(othis.text());
              select.append(optionElem);
            }

            othis.siblings().removeClass(THIS);
            select.val(value).removeClass('layui-form-danger');

            layui.event.call(this, MOD_NAME, 'select('+ filter +')', {
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
          })

          reElem.find('dl>dt').on('click', function(e){
            return false;
          });

          if(isAppendTo){
            titleElem.on('_lay-select-destroy', function(){
              reElem.remove();
            })
          }
        }

        // 仅 appendTo 使用，移除触发元素时，自动移除面板元素
        $.event.special['_lay-select-destroy'] = {
          remove: function( handleObj ) {
            handleObj.handler();
          }
        };

        // 初始渲染 select 组件选项
        selects.each(function(index, select){
          var othis = $(this);
          var hasRender = othis.next('.'+CLASS);
          var disabled = this.disabled;
          var value = select.value;
          var selected = $(select.options[select.selectedIndex]); // 获取当前选中项
          var optionsFirst = select.options[0];

          if (othis.closest('[lay-ignore]').length) return othis.show();

          var isSearch = typeof othis.attr('lay-search') === 'string'
          var isCreatable = typeof othis.attr('lay-creatable') === 'string' && isSearch
          var isAppendTo = typeof othis.attr('lay-append-to') === 'string'
          var placeholder = optionsFirst
            ? (optionsFirst.value ? TIPS : (optionsFirst.innerHTML || TIPS))
            : TIPS;

          // 替代元素
          var reElem = $(['<div class="'+ (isSearch ? '' : 'layui-unselect ') + CLASS
          ,(disabled ? ' layui-select-disabled' : '') + '"></div>'].join(''));

          var triggerElem = $([
            '<div class="'+ TITLE +'">'
              ,('<input type="text" placeholder="'+ util.escape($.trim(placeholder)) +'" '
                +('value="'+ util.escape($.trim(value ? selected.html() : '')) +'"') // 默认值
                +((!disabled && isSearch) ? '' : ' readonly') // 是否开启搜索
                +' class="layui-input'
                +(isSearch ? '' : ' layui-unselect')
              + (disabled ? (' ' + DISABLED) : '') +'">') // 禁用状态
              ,'<i class="layui-edge"></i>'
            ,'</div>'].join(''));

          var contentElem = $(['<dl class="layui-anim layui-anim-upbit'+ (othis.find('optgroup')[0] ? ' layui-select-group' : '') +'">'
            ,function(options){
              var arr = [];
              layui.each(options, function(index, item){
                var tagName = item.tagName.toLowerCase();

                if(index === 0 && !item.value && tagName !== 'optgroup'){
                  arr.push('<dd lay-value="" class="layui-select-tips">'+ $.trim(item.innerHTML || TIPS) +'</dd>');
                } else if(tagName === 'optgroup'){
                  arr.push('<dt>'+ item.label +'</dt>');
                } else {
                  arr.push('<dd lay-value="'+ util.escape(item.value) +'" class="'+ (value === item.value ?  THIS : '') + (item.disabled ? (' '+DISABLED) : '') +'">'+ $.trim(item.innerHTML) +'</dd>');
                }
              });
              arr.length === 0 && arr.push('<dd lay-value="" class="'+ DISABLED +'">没有选项</dd>');
              return arr.join('');
            }(othis.find('*')) +'</dl>'
          ].join(''));

          // 如果已经渲染，则Rerender
          if(hasRender[0]){
            if(isAppendTo){
              var panelWrapElem = hasRender.data(PANEL_ELEM_DATA);
              panelWrapElem && panelWrapElem.remove();
            }
            hasRender.remove();
          }
          if(isAppendTo){
            reElem.append(triggerElem);
            othis.after(reElem);
            var contentWrapElem = $('<div class="'+ CLASS + ' ' + PANEL_WRAP +'"></div>').append(contentElem);
            reElem.data(PANEL_ELEM_DATA, contentWrapElem); // 将面板元素对象记录在触发元素 data 中，重新渲染时需要清理旧面板元素
            events.call(this, contentWrapElem, triggerElem, disabled, isSearch, isCreatable, isAppendTo);
          }else{
            reElem.append(triggerElem).append(contentElem);
            othis.after(reElem);
            events.call(this, reElem, triggerElem, disabled, isSearch, isCreatable, isAppendTo);
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
        var checks = elem || elemForm.find('input[type=checkbox]');
        // 风格
        var skins = {
          "primary": true, // 默认风格
          "tag": true, // 标签风格
          "switch": true // 开关风格
        };
        // 事件
        var events = function(reElem, RE_CLASS){
          var check = $(this);
          var skin = check.attr('lay-skin') || 'primary';
          var isSwitch = skin === 'switch';
          var isPrimary = skin === 'primary';

          // 勾选
          reElem.on('click', function(){
            var filter = check.attr('lay-filter') // 获取过滤器

            // 禁用
            if(check[0].disabled) return;

            // 半选
            if (check[0].indeterminate) {
              check[0].indeterminate = false;
            }

            // 开关
            check[0].checked = !check[0].checked

            // 事件
            layui.event.call(check[0], MOD_NAME, RE_CLASS[2]+'('+ filter +')', {
              elem: check[0],
              value: check[0].value,
              othis: reElem
            });
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
              }else{
                reElem.children('.'+ CLASS.SUBTRA).removeClass(CLASS.SUBTRA).addClass('layui-icon-ok');
              }
            })
          }
        };

        // 遍历复选框
        checks.each(function(index, check){
          var othis = $(this);
          var skin = othis.attr('lay-skin') || 'primary';
          var title = util.escape($.trim(check.title || function(){ // 向下兼容 lay-text 属性
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
                  titleTplAttrs.push(attr.name + '="' + attr.value + '"')
                }
              })
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
          var reElem = $(['<div class="layui-unselect '+ RE_CLASS[0],
            (check.checked ? (' '+ RE_CLASS[1]) : ''), // 选中状态
            (disabled ? ' layui-checkbox-disabled '+ DISABLED : ''), // 禁用状态
            '"',
            (skin ? ' lay-skin="'+ skin +'"' : ''), // 风格
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

        // 事件
        var events = function(reElem){
          var radio = $(this);
          var ANIM = 'layui-anim-scaleSpring';

          reElem.on('click', function(){
            var filter = radio.attr('lay-filter'); // 获取过滤器

            if(radio[0].disabled) return;

            radio[0].checked = true;

            layui.event.call(radio[0], MOD_NAME, 'radio('+ filter +')', {
              elem: radio[0],
              value: radio[0].value,
              othis: reElem
            });
          });

          that.syncAppearanceOnPropChanged(this, 'checked', function(){
            var radioEl = this;
            if(radioEl.checked){
              reElem.addClass(CLASS + 'ed');
              reElem.children('.layui-icon').addClass(ANIM + ' ' + ICON[0]);
              var forms = radio.parents(ELEM);
              var sameRadios = forms.find('input[name='+ radioEl.name.replace(/(\.|#|\[|\])/g, '\\$1') +']'); // 找到相同name的兄弟
              layui.each(sameRadios, function(){
                if(radioEl === this)return;
                this.checked = false;
              });
            }else{
              reElem.removeClass(CLASS + 'ed');
              reElem.children('.layui-icon').removeClass(ANIM + ' ' + ICON[0]).addClass(ICON[1]);
            }
          })
        };

        // 初始渲染
        radios.each(function(index, radio){
          var othis = $(this), hasRender = othis.next('.' + CLASS);
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
                  titleTplAttrs.push(attr.name + '="' + attr.value + '"')
                }
              })
            }
          }
          titleTplAttrs = titleTplAttrs.join(' ');

          // 替代元素
          var reElem = $(['<div class="layui-unselect '+ CLASS,
            (radio.checked ? (' '+ CLASS +'ed') : ''), // 选中状态
          (disabled ? ' layui-radio-disabled '+DISABLED : '') +'"', // 禁用状态
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
      if($(type).is(ELEM)){
        elemForm = $(type);
        renderItem();
      } else { // 对象为表单项
        type.each(function (index, item) {
          var elem = $(item);
          if (!elem.closest(ELEM).length) {
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
        items[type] ? items[type]() : hint.error('不支持的 "'+ type + '" 表单渲染')
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
  }()

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

    elem = $(elem);

    // 节点不存在可视为 true
    if (!elem[0]) return !0;

    // 若节点不存在特定属性，则查找容器内有待验证的子节点
    if (elem.attr('lay-verify') === undefined) {
      // 若校验的是一个不带验证规则的容器，校验内部的 lay-verify 节点
      if (that.validate(elem.find('*[lay-verify]')) === false) {
        return false;
      }
    }

    // 开始校验
    layui.each(elem, function(_, item) {
      var othis = $(this);
      var verifyStr = othis.attr('lay-verify') || '';
      var vers = verifyStr.split('|');
      var verType = othis.attr('lay-vertype'); // 提示方式
      var value = othis.val();
      value = typeof value === 'string' ? $.trim(value) : value;

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
              layer.tips(errorText, function() {
                if (!othis.closest('[lay-ignore]').length) {
                  if(isForm2Elem) {
                    return othis.next();
                  }
                }
                return othis;
              }(), {tips: 1});
            } else if(verType === 'alert') {
              layer.alert(errorText, {title: '提示', shadeClose: true});
            }
            // 若返回的为字符或数字，则自动弹出默认提示框；否则由 verify 方法中处理提示
            else if(/\b(string|number)\b/.test(typeof errorText)) {
              layer.msg(errorText, {icon: 5, shift: 6});
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
    var button = $(this); // 当前触发的按钮

    // 表单域 lay-filter 属性值
    var layFilter = typeof filter === 'string'
      ? filter
    : button.attr('lay-filter');

    // 当前所在表单域
    var elem = this.getFormElem
      ? this.getFormElem(layFilter)
    : button.parents(ELEM).eq(0);

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
    return layui.event.call(this, MOD_NAME, 'submit('+ layFilter +')', params);
  };

  function fuzzyMatchRegExp(keyword, caseSensitive) {
    var wordMap = {};
    var regexPattern = ['^'];
    var escapeRegExp = function(str){
      return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

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
  var $dom = $(document);
  var $win = $(window);

  // 初始自动完成渲染
  $(function(){
    form.render();
  });

  // 表单 reset 重置渲染
  $dom.on('reset', ELEM, function(){
    var filter = $(this).attr('lay-filter');
    setTimeout(function(){
      form.render(null, filter);
    }, 50);
  });

  // 表单提交事件
  $dom.on('submit', ELEM, submit)
  .on('click', '*[lay-submit]', submit);

  exports(MOD_NAME, form);
});


