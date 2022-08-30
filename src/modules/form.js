/**
 * form 表单组件
 */
 
layui.define(['layer', 'util'], function(exports){
  "use strict";
  
  var $ = layui.$;
  var layer = layui.layer;
  var util = layui.util;
  var hint = layui.hint();
  var device = layui.device();
  
  var MOD_NAME = 'form', ELEM = '.layui-form', THIS = 'layui-this';
  var SHOW = 'layui-show', HIDE = 'layui-hide', DISABLED = 'layui-disabled';
  
  var Form = function(){
    this.config = {
      verify: {
        required: [
          /[\S]+/
          ,'必填项不能为空'
        ]
        ,phone: [
          /^1\d{10}$/
          ,'请输入正确的手机号'
        ]
        ,email: [
          /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
          ,'邮箱格式不正确'
        ]
        ,url: [
          /^(#|(http(s?)):\/\/|\/\/)[^\s]+\.[^\s]+$/
          ,'链接格式不正确'
        ]
        ,number: function(value){
          if(!value || isNaN(value)) return '只能填写数字'
        }
        ,date: [
          /^(\d{4})[-\/](\d{1}|0\d{1}|1[0-2])([-\/](\d{1}|0\d{1}|[1-2][0-9]|3[0-1]))*$/
          ,'日期格式不正确'
        ]
        ,identity: [
          /(^\d{15}$)|(^\d{17}(x|X|\d)$)/
          ,'请输入正确的身份证号'
        ]
      }
      ,autocomplete: null // 全局 autocomplete 状态。null 表示不干预
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
      layui.each(object, function(key, value){
        var itemElem = itemForm.find('[name="'+ key +'"]')
        ,type;
        
        // 如果对应的表单不存在，则不执行
        if(!itemElem[0]) return;
        type = itemElem[0].type;
        
        // 如果为复选框
        if(type === 'checkbox'){
          itemElem[0].checked = value;
        } else if(type === 'radio') { // 如果为单选框
          itemElem.each(function(){
            if(this.value == value ){
              this.checked = true
            }     
          });
        } else { // 其它类型的表单
          itemElem.val(value);
        }
      });
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
      
      if(/^checkbox|radio$/.test(item.type) && !item.checked) return;  // 复选框和单选框未选中，不记录字段     
      field[init_name || item.name] = item.value;
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

        // 初始化 input 套件
        elemForm.find('input[lay-affix],textarea[lay-affix]').each(function(){
          var othis = $(this);
          var affix = othis.attr('lay-affix');
          var CLASS_SUFFIX = 'layui-input-suffix';
          var elemNext = othis.next('.'+ CLASS_SUFFIX);
          var hideElem = function(elem, value){
            if(!elem) return;
            elem[$.trim(value) ? 'removeClass' : 'addClass'](HIDE);
          };
          var renderSuffix = function(type){
            elemNext.remove();
            elemNext = $(['<div class="layui-input-suffix layui-input-affix-event">'
              ,'<i class="layui-icon layui-icon-'+ type +'"></i>'
            ,'</div>'].join(''));
            
            othis.after(elemNext);
            hideElem(elemNext, othis.val());
            
            // 输入事件
            othis.on('input propertychange', function(){
              var value = this.value;
              hideElem(elemNext, value);
            });
            
            // 点击后缀套件事件
            elemNext.on('click', function(){
              var filter = othis.attr('lay-filter');
              obj[affix] && obj[affix][1].call(this);
              
              // 对外事件
              layui.event.call(this, MOD_NAME, 'input-affix('+ filter +')', {
                elem: othis[0]
                ,affix: affix
              });
            });
          };
          
          // 渲染内置套件
          var obj = {
            // 清空
            clear: [function(){ // 渲染
              renderSuffix('clear');
            }, function(){ // 事件
              othis.val('').focus();
              hideElem(elemNext, null);
            }]
            
            // 密码显隐
            ,eye: [function(){ // 渲染
              renderSuffix('eye');
            }, function(){ // 事件
              var SHOW_NAME = 'LAY_FORM_INPUT_AFFIX_SHOW';
              var isShow = othis.data(SHOW_NAME);
              
              othis.attr('type', isShow ? 'password' : 'text').data(SHOW_NAME, !isShow);
              renderSuffix(isShow ? 'eye' : 'eye-invisible');
            }]
          };
          
          obj[affix] && obj[affix][0]();
        });
      }
      
      // 下拉选择框
      ,select: function(elem){
        var TIPS = '请选择', CLASS = 'layui-form-select', TITLE = 'layui-select-title'
        ,NONE = 'layui-select-none', initValue = '', thatInput
        ,selects = elem || elemForm.find('select')

        // 隐藏 select
        ,hide = function(e, clear){
          if(!$(e.target).parent().hasClass(TITLE) || clear){
            $('.'+CLASS).removeClass(CLASS+'ed ' + CLASS+'up');
            thatInput && initValue && thatInput.val(initValue);
          }
          thatInput = null;
        }
        
        // 各种事件
        ,events = function(reElem, disabled, isSearch){
          var select = $(this)
          ,title = reElem.find('.' + TITLE)
          ,input = title.find('input')
          ,dl = reElem.find('dl')
          ,dds = dl.children('dd')
          ,dts = dl.children('dt') // select分组dt元素
          ,index =  this.selectedIndex // 当前选中的索引
          ,nearElem; // select 组件当前选中的附近元素，用于辅助快捷键功能
          
          if(disabled) return;

          // 搜索项
          var laySearch = select.attr('lay-search');
          
          // 展开下拉
          var showDown = function(){
            var top = reElem.offset().top + reElem.outerHeight() + 5 - $win.scrollTop()
            ,dlHeight = dl.outerHeight();
            
            index = select[0].selectedIndex; // 获取最新的 selectedIndex
            reElem.addClass(CLASS+'ed');
            dds.removeClass(HIDE);
            dts.removeClass(HIDE);
            nearElem = null;

            // 初始选中样式
            dds.eq(index).addClass(THIS).siblings().removeClass(THIS);

            // 上下定位识别
            if(top + dlHeight > $win.height() && top >= dlHeight){
              reElem.addClass(CLASS + 'up');
            }
            
            followScroll();
          }
          
          // 隐藏下拉
          ,hideDown = function(choose){
            reElem.removeClass(CLASS+'ed ' + CLASS+'up');
            input.blur();
            nearElem = null;
            
            if(choose) return;
            
            notOption(input.val(), function(none){
              var selectedIndex = select[0].selectedIndex;
              
              // 未查询到相关值
              if(none){
                initValue = $(select[0].options[selectedIndex]).html(); // 重新获得初始选中值
                
                // 如果是第一项，且文本值等于 placeholder，则清空初始值
                if(selectedIndex === 0 && initValue === input.attr('placeholder')){
                  initValue = '';
                };

                // 如果有选中值，则将输入框纠正为该值。否则清空输入框
                input.val(initValue || '');
              }
            });
          }
          
          // 定位下拉滚动条
          ,followScroll = function(){  
            var thisDd = dl.children('dd.'+ THIS);
            
            if(!thisDd[0]) return;
            
            var posTop = thisDd.position().top
            ,dlHeight = dl.height()
            ,ddHeight = thisDd.height();
            
            // 若选中元素在滚动条不可见底部
            if(posTop > dlHeight){
              dl.scrollTop(posTop + dl.scrollTop() - dlHeight + ddHeight - 5);
            }
            
            // 若选择玄素在滚动条不可见顶部
            if(posTop < 0){
              dl.scrollTop(posTop + dl.scrollTop() - 5);
            }
          };
          
          // 点击标题区域
          title.on('click', function(e){
            reElem.hasClass(CLASS+'ed') ? (
              hideDown()
            ) : (
              hide(e, true), 
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
            var setThisDd = function(prevNext, thisElem1){
              var nearDd, cacheNearElem
              e.preventDefault();

              // 得到当前队列元素  
              var thisElem = function(){
                var thisDd = dl.children('dd.'+ THIS);
                
                // 如果是搜索状态，且按 Down 键，且当前可视 dd 元素在选中元素之前，
                // 则将当前可视 dd 元素的上一个元素作为虚拟的当前选中元素，以保证递归不中断
                if(dl.children('dd.'+  HIDE)[0] && prevNext === 'next'){
                  var showDd = dl.children('dd:not(.'+ HIDE +',.'+ DISABLED +')')
                  ,firstIndex = showDd.eq(0).index();
                  if(firstIndex >=0 && firstIndex < thisDd.index() && !showDd.hasClass(THIS)){
                    return showDd.eq(0).prev()[0] ? showDd.eq(0).prev() : dl.children(':last');
                  }
                }

                if(thisElem1 && thisElem1[0]){
                  return thisElem1;
                }
                if(nearElem && nearElem[0]){
                  return nearElem;
                }
       
                return thisDd;
                // return dds.eq(index);
              }();
              
              cacheNearElem = thisElem[prevNext](); // 当前元素的附近元素
              nearDd =  thisElem[prevNext]('dd:not(.'+ HIDE +')'); // 当前可视元素的 dd 元素

              // 如果附近的元素不存在，则停止执行，并清空 nearElem
              if(!cacheNearElem[0]) return nearElem = null;
              
              // 记录附近的元素，让其成为下一个当前元素
              nearElem = thisElem[prevNext]();

              // 如果附近不是 dd ，或者附近的 dd 元素是禁用状态，则进入递归查找
              if((!nearDd[0] || nearDd.hasClass(DISABLED)) && nearElem[0]){
                return setThisDd(prevNext, nearElem);
              }
              
              nearDd.addClass(THIS).siblings().removeClass(THIS); // 标注样式
              followScroll(); // 定位滚动条
            };
            
            if(keyCode === 38) setThisDd('prev'); // Up 键
            if(keyCode === 40) setThisDd('next'); // Down 键
            
            // Enter 键
            if(keyCode === 13){ 
              e.preventDefault();
              dl.children('dd.'+THIS).trigger('click');
            }
          });
          
          // 检测值是否不属于 select 项
          var notOption = function(value, callback, origin){
            var num = 0;
            layui.each(dds, function(){
              var othis = $(this);
              var text = othis.text();

              // 是否区分大小写
              if(laySearch !== 'cs'){
                text = text.toLowerCase();
                value = value.toLowerCase();
              }
              
              // 匹配
              var not = text.indexOf(value) === -1;
              
              if(value === '' || (origin === 'blur') ? value !== text : not) num++;
              origin === 'keyup' && othis[not ? 'addClass' : 'removeClass'](HIDE);
            });
            // 处理select分组元素
            origin === 'keyup' && layui.each(dts, function(){
              var othis = $(this)
              ,thisDds = othis.nextUntil('dt').filter('dd') // 当前分组下的dd元素
              ,allHide = thisDds.length == thisDds.filter('.' + HIDE).length; // 当前分组下所有dd元素都隐藏了
              othis[allHide ? 'addClass' : 'removeClass'](HIDE);
            });
            var none = num === dds.length;
            return callback(none), none;
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
            
            notOption(value, function(none){
              if(none){
                dl.find('.'+NONE)[0] || dl.append('<p class="'+ NONE +'">无匹配项</p>');
              } else {
                dl.find('.'+NONE).remove();
              }
            }, 'keyup');
            
            if(value === ''){
              dl.find('.'+NONE).remove();
            }
            
            followScroll(); // 定位滚动条
          };
          
          if(isSearch){
            input.on('keyup', search).on('blur', function(e){
              var selectedIndex = select[0].selectedIndex;
              
              thatInput = input; // 当前的 select 中的 input 元素
              initValue = $(select[0].options[selectedIndex]).html(); // 重新获得初始选中值
              
              // 如果是第一项，且文本值等于 placeholder，则清空初始值
              if(selectedIndex === 0 && initValue === input.attr('placeholder')){
                initValue = '';
              };
              
              setTimeout(function(){
                notOption(input.val(), function(none){
                  initValue || input.val(''); // none && !initValue
                }, 'blur');
              }, 200);
            });
          }

          // 选择
          dds.on('click', function(){
            var othis = $(this), value = othis.attr('lay-value');
            var filter = select.attr('lay-filter'); // 获取过滤器
            
            if(othis.hasClass(DISABLED)) return false;
            
            if(othis.hasClass('layui-select-tips')){
              input.val('');
            } else {
              input.val(othis.text());
              othis.addClass(THIS);
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
          
          reElem.find('dl>dt').on('click', function(e){
            return false;
          });
          
          $(document).off('click', hide).on('click', hide); // 点击其它元素关闭 select
        }
        
        selects.each(function(index, select){
          var othis = $(this)
          ,hasRender = othis.next('.'+CLASS)
          ,disabled = this.disabled
          ,value = select.value
          ,selected = $(select.options[select.selectedIndex]) // 获取当前选中项
          ,optionsFirst = select.options[0];
          
          if(typeof othis.attr('lay-ignore') === 'string') return othis.show();
          
          var isSearch = typeof othis.attr('lay-search') === 'string'
          ,placeholder = optionsFirst ? (
            optionsFirst.value ? TIPS : (optionsFirst.innerHTML || TIPS)
          ) : TIPS;

          // 替代元素
          var reElem = $(['<div class="'+ (isSearch ? '' : 'layui-unselect ') + CLASS 
          ,(disabled ? ' layui-select-disabled' : '') +'">'
            ,'<div class="'+ TITLE +'">'
              ,('<input type="text" placeholder="'+ util.escape($.trim(placeholder)) +'" '
                +('value="'+ util.escape($.trim(value ? selected.html() : '')) +'"') // 默认值
                +((!disabled && isSearch) ? '' : ' readonly') // 是否开启搜索
                +' class="layui-input'
                +(isSearch ? '' : ' layui-unselect') 
              + (disabled ? (' ' + DISABLED) : '') +'">') // 禁用状态
            ,'<i class="layui-edge"></i></div>'
            ,'<dl class="layui-anim layui-anim-upbit'+ (othis.find('optgroup')[0] ? ' layui-select-group' : '') +'">'
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
          ,'</div>'].join(''));
          
          hasRender[0] && hasRender.remove(); // 如果已经渲染，则Rerender
          othis.after(reElem);          
          events.call(this, reElem, disabled, isSearch);
        });
      }
      
      // 复选框/开关
      ,checkbox: function(elem){
        var CLASS = {
          checkbox: ['layui-form-checkbox', 'layui-form-checked', 'checkbox']
          ,_switch: ['layui-form-switch', 'layui-form-onswitch', 'switch']
        }
        ,checks = elem || elemForm.find('input[type=checkbox]')

        ,events = function(reElem, RE_CLASS){
          var check = $(this);
          
          // 勾选
          reElem.on('click', function(){
            var filter = check.attr('lay-filter') // 获取过滤器
            ,text = (check.attr('lay-text')||'').split('|');

            if(check[0].disabled) return;
            
            check[0].checked ? (
              check[0].checked = false
              ,reElem.removeClass(RE_CLASS[1]).find('em').text(text[1])
            ) : (
              check[0].checked = true
              ,reElem.addClass(RE_CLASS[1]).find('em').text(text[0])
            );
            
            layui.event.call(check[0], MOD_NAME, RE_CLASS[2]+'('+ filter +')', {
              elem: check[0]
              ,value: check[0].value
              ,othis: reElem
            });
          });
        }
        
        checks.each(function(index, check){
          var othis = $(this), skin = othis.attr('lay-skin')
          ,text = (othis.attr('lay-text') || '').split('|'), disabled = this.disabled;
          if(skin === 'switch') skin = '_'+skin;
          var RE_CLASS = CLASS[skin] || CLASS.checkbox;
          
          if(typeof othis.attr('lay-ignore') === 'string') return othis.show();
          
          // 替代元素
          var hasRender = othis.next('.' + RE_CLASS[0])
          ,reElem = $(['<div class="layui-unselect '+ RE_CLASS[0]
            ,(check.checked ? (' '+ RE_CLASS[1]) : '') // 选中状态
            ,(disabled ? ' layui-checkbox-disabled '+ DISABLED : '') // 禁用状态
            ,'"'
            ,(skin ? ' lay-skin="'+ skin +'"' : '') // 风格
          ,'>'
          ,function(){ // 不同风格的内容
            var title = check.title.replace(/\s/g, '')
            ,type = {
              // 复选框
              checkbox: [
                (title ? ('<span>'+ util.escape(check.title) +'</span>') : '')
                ,'<i class="layui-icon layui-icon-ok"></i>'
              ].join('')
              
              // 开关
              ,_switch: '<em>'+ ((check.checked ? text[0] : text[1]) || '') +'</em><i></i>'
            };
            return type[skin] || type['checkbox'];
          }()
          ,'</div>'].join(''));

          hasRender[0] && hasRender.remove(); // 如果已经渲染，则Rerender
          othis.after(reElem);
          events.call(this, reElem, RE_CLASS);
        });
      }
      
      // 单选框
      ,radio: function(elem){
        var CLASS = 'layui-form-radio', ICON = ['&#xe643;', '&#xe63f;']
        ,radios = elem || elemForm.find('input[type=radio]')

        ,events = function(reElem){
          var radio = $(this), ANIM = 'layui-anim-scaleSpring';
          
          reElem.on('click', function(){
            var name = radio[0].name, forms = radio.parents(ELEM);
            var filter = radio.attr('lay-filter'); // 获取过滤器
            var sameRadio = forms.find('input[name='+ name.replace(/(\.|#|\[|\])/g, '\\$1') +']'); // 找到相同name的兄弟
            
            if(radio[0].disabled) return;
            
            layui.each(sameRadio, function(){
              var next = $(this).next('.'+CLASS);
              this.checked = false;
              next.removeClass(CLASS+'ed');
              next.find('.layui-icon').removeClass(ANIM).html(ICON[1]);
            });
            
            radio[0].checked = true;
            reElem.addClass(CLASS+'ed');
            reElem.find('.layui-icon').addClass(ANIM).html(ICON[0]);
            
            layui.event.call(radio[0], MOD_NAME, 'radio('+ filter +')', {
              elem: radio[0]
              ,value: radio[0].value
              ,othis: reElem
            });
          });
        };
        
        radios.each(function(index, radio){
          var othis = $(this), hasRender = othis.next('.' + CLASS), disabled = this.disabled;
          
          if(typeof othis.attr('lay-ignore') === 'string') return othis.show();
          hasRender[0] && hasRender.remove(); // 如果已经渲染，则Rerender
          
          // 替代元素
          var reElem = $(['<div class="layui-unselect '+ CLASS 
            ,(radio.checked ? (' '+CLASS+'ed') : '') // 选中状态
          ,(disabled ? ' layui-radio-disabled '+DISABLED : '') +'">' // 禁用状态
          ,'<i class="layui-anim layui-icon">'+ ICON[radio.checked ? 0 : 1] +'</i>'
          ,'<div>'+ function(){
            var title = util.escape(radio.title || '');
            if(typeof othis.next().attr('lay-radio') === 'string'){
              title = othis.next().html();
              // othis.next().remove();
            }
            return title
          }() +'</div>'
          ,'</div>'].join(''));

          othis.after(reElem);
          events.call(this, reElem);
        });
      }
    };
    if (layui.type(type) === 'object') {
      // jquery 对象
      type.each(function (index, item) {
        var elem = $(item);
        if (!elem.closest(ELEM).length) {
          // 如果不是存在layui-form中的直接跳过
          return;
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
    } else {
      type ? (
        items[type] ? items[type]() : hint.error('不支持的 "'+ type + '" 表单渲染')
      ) : layui.each(items, function(index, item){
        item();
      });
    }
    return that;
  };

  // 主动触发验证 -- elem 即要验证的区域表单选择器 / return true or false
  Form.prototype.validate = function(elem){
    var that = this;
    var stop = null; // 验证不通过状态
    var verify = form.config.verify; // 验证规则
    var DANGER = 'layui-form-danger'; // 警示样式

    elem = $(elem);

    // 节点不存在可视为 true
    if(!elem[0]) return !0;

    // 若节点不存在特定属性，则查找容器内有待验证的子节点
    if(elem.attr('lay-verify') === undefined){
      // 若校验的是一个不带验证规则的容器，校验内部的 lay-verify 节点
      if (that.validate(elem.find('*[lay-verify]')) === false) {
        return false;
      }
    }

    // 开始校验
    layui.each(elem, function(_, item){
      var othis = $(this);
      var verifyStr = othis.attr('lay-verify') || '';
      var vers = verifyStr.split('|');
      var verType = othis.attr('lay-verType'); // 提示方式
      var value = othis.val();

      othis.removeClass(DANGER); // 移除警示样式
      
      // 遍历元素绑定的验证规则
      layui.each(vers, function(_, thisVer){
        var isTrue; // 是否命中校验
        var errorText = ''; // 错误提示文本
        var rule = verify[thisVer]; // 获取校验规则
        
        // 匹配验证规则
        if(rule){
          var isTrue = typeof rule === 'function' 
            ? errorText = rule(value, item) 
          : !rule[0].test(value);
          
          // 是否属于美化替换后的表单元素
          var isForm2Elem = item.tagName.toLowerCase() === 'select' || (
            /^checkbox|radio$/.test(item.type)
          );
          
          errorText = errorText || rule[1];
          
          if(thisVer === 'required'){
            errorText = othis.attr('lay-reqText') || errorText;
          }
          
          // 若为必填项或者非空命中校验，则阻止提交，弹出提示
          if(isTrue){
            // 提示层风格
            if(verType === 'tips'){
              layer.tips(errorText, function(){
                if(typeof othis.attr('lay-ignore') !== 'string'){
                  if(isForm2Elem){
                    return othis.next();
                  }
                }
                return othis;
              }(), {tips: 1});
            } else if(verType === 'alert') {
              layer.alert(errorText, {title: '提示', shadeClose: true});
            } 
            // 若返回的为字符或数字，则自动弹出默认提示框；否则由 verify 方法中处理提示
            else if(/\bstring|number\b/.test(typeof errorText)){ 
              layer.msg(errorText, {icon: 5, shift: 6});
            }

            setTimeout(function(){
              (isForm2Elem ? othis.next().find('input') : item).focus();
            }, 7);
            
            othis.addClass(DANGER);
            return stop = true;
          }
        }
      });

      if(stop) return stop;
    });

    return !stop;
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

  // 自动完成渲染
  var form = new Form()
  ,$dom = $(document), $win = $(window);
  
  $(function(){
    form.render();
  });
  
  // 表单reset重置渲染
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

 
