/**

 @Name：layui.form 表单组件
 @Author：贤心
 @License：MIT
    
 */
 
layui.define('layer', function(exports){
  "use strict";
  
  var $ = layui.$
  ,layer = layui.layer
  ,hint = layui.hint()
  ,device = layui.device()
  
  ,MOD_NAME = 'form', ELEM = '.layui-form', THIS = 'layui-this', SHOW = 'layui-show', HIDE = 'layui-hide', DISABLED = 'layui-disabled'
  
  ,Form = function(){
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
          /(^#)|(^http(s*):\/\/[^\s]+\.[^\s]+)/
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
      },
      asyncVerify: { }
    };
  };
  
  //全局设置
  Form.prototype.set = function(options){
    var that = this;
    $.extend(true, that.config, options);
    return that;
  };
  
  //验证规则设定
  Form.prototype.verify = function(settings){
    var that = this;
    $.extend(true, that.config.verify, settings);
    return that;
  };

  //异步验证规则设定
  Form.prototype.asyncVerify = function(settings) {
    var that = this;
    $.extend(true, that.config.asyncVerify, settings);
    return that;
  };

  //表单事件监听
  Form.prototype.on = function(events, callback){
    return layui.onevent.call(this, MOD_NAME, events, callback);
  };
  
  //表单控件渲染
  Form.prototype.render = function(type, filter){
    var that = this
    ,elemForm = $(ELEM + function(){
      return filter ? ('[lay-filter="' + filter +'"]') : '';
    }())
    ,items = {
      
      //下拉选择框
      select: function(){
        var TIPS = '请选择', CLASS = 'layui-form-select', TITLE = 'layui-select-title'
        ,NONE = 'layui-select-none', initValue = '', thatInput
        
        ,selects = elemForm.find('select'), hide = function(e, clear){
          if(!$(e.target).parent().hasClass(TITLE) || clear){
            $('.'+CLASS).removeClass(CLASS+'ed ' + CLASS+'up');
            thatInput && initValue && thatInput.val(initValue);
          }
          thatInput = null;
        }
        
        ,events = function(reElem, disabled, isSearch){
          var select = $(this)
          ,title = reElem.find('.' + TITLE)
          ,input = title.find('input')
          ,dl = reElem.find('dl')
          ,dds = dl.children('dd')
          
          
          if(disabled) return;
          
          //展开下拉
          var showDown = function(){
            var top = reElem.offset().top + reElem.outerHeight() + 5 - win.scrollTop()
            ,dlHeight = dl.outerHeight();
            reElem.addClass(CLASS+'ed');
            dds.removeClass(HIDE);
            
            //上下定位识别
            if(top + dlHeight > win.height() && top >= dlHeight){
              reElem.addClass(CLASS + 'up');
            }
          }, hideDown = function(choose){
            reElem.removeClass(CLASS+'ed ' + CLASS+'up');
            input.blur();
            
            if(choose) return;
            
            notOption(input.val(), function(none){
              if(none){
                initValue = dl.find('.'+THIS).html();
                input && input.val(initValue);
              }
            });
          };
          
          //点击标题区域
          title.on('click', function(e){
            reElem.hasClass(CLASS+'ed') ? (
              hideDown()
            ) : (
              hide(e, true), 
              showDown()
            );
            dl.find('.'+NONE).remove();
          }); 
          
          //点击箭头获取焦点
          title.find('.layui-edge').on('click', function(){
            input.focus();
          });
          
          //键盘事件
          input.on('keyup', function(e){
            var keyCode = e.keyCode;
            //Tab键
            if(keyCode === 9){
              showDown();
            }
          }).on('keydown', function(e){
            var keyCode = e.keyCode;
            //Tab键
            if(keyCode === 9){
              hideDown();
            } else if(keyCode === 13){ //回车键
              e.preventDefault();
            }
          });
          
          //检测值是否不属于select项
          var notOption = function(value, callback, origin){
            var num = 0;
            layui.each(dds, function(){
              var othis = $(this)
              ,text = othis.text()
              ,not = text.indexOf(value) === -1;
              if(value === '' || (origin === 'blur') ? value !== text : not) num++;
              origin === 'keyup' && othis[not ? 'addClass' : 'removeClass'](HIDE);
            });
            var none = num === dds.length;
            return callback(none), none;
          };
          
          //搜索匹配
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
          };
          
          if(isSearch){
            input.on('keyup', search).on('blur', function(e){
              thatInput = input;
              initValue = dl.find('.' + THIS).html();
              setTimeout(function(){
                notOption(input.val(), function(none){
                  initValue || input.val(''); //none && !initValue
                }, 'blur');
              }, 200);
            });
          }

          //选择
          dds.on('click', function(){
            var othis = $(this), value = othis.attr('lay-value');
            var filter = select.attr('lay-filter'); //获取过滤器

            if(othis.hasClass(DISABLED)) return false;
            
            if(othis.hasClass('layui-select-tips')){
              input.val('');
            } else {
              input.val(othis.text());
              othis.addClass(THIS);
            }
            
            othis.siblings().removeClass(THIS);
            select.val(value).removeClass('layui-form-danger')
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
          
          //关闭下拉
          $(document).off('click', hide).on('click', hide);
        }
        
        selects.each(function(index, select){
          var othis = $(this)
          ,hasRender = othis.next('.'+CLASS)
          ,disabled = this.disabled
          ,value = select.value
          ,selected = $(select.options[select.selectedIndex]) //获取当前选中项
          ,optionsFirst = select.options[0];
          
          if(typeof othis.attr('lay-ignore') === 'string') return othis.show();
          
          var isSearch = typeof othis.attr('lay-search') === 'string'
          ,placeholder = optionsFirst ? (
            optionsFirst.value ? TIPS : (optionsFirst.innerHTML || TIPS)
          ) : TIPS;

          //替代元素
          var reElem = $(['<div class="'+ (isSearch ? '' : 'layui-unselect ') + CLASS + (disabled ? ' layui-select-disabled' : '') +'">'
            ,'<div class="'+ TITLE +'"><input type="text" placeholder="'+ placeholder +'" value="'+ (value ? selected.html() : '') +'" '+ (isSearch ? '' : 'readonly') +' class="layui-input'+ (isSearch ? '' : ' layui-unselect') + (disabled ? (' ' + DISABLED) : '') +'">'
            ,'<i class="layui-edge"></i></div>'
            ,'<dl class="layui-anim layui-anim-upbit'+ (othis.find('optgroup')[0] ? ' layui-select-group' : '') +'">'+ function(options){
              var arr = [];
              layui.each(options, function(index, item){
                if(index === 0 && !item.value){
                  arr.push('<dd lay-value="" class="layui-select-tips">'+ (item.innerHTML || TIPS) +'</dd>');
                } else if(item.tagName.toLowerCase() === 'optgroup'){
                  arr.push('<dt>'+ item.label +'</dt>'); 
                } else {
                  arr.push('<dd lay-value="'+ item.value +'" class="'+ (value === item.value ?  THIS : '') + (item.disabled ? (' '+DISABLED) : '') +'">'+ item.innerHTML +'</dd>');
                }
              });
              arr.length === 0 && arr.push('<dd lay-value="" class="'+ DISABLED +'">没有选项</dd>');
              return arr.join('');
            }(othis.find('*')) +'</dl>'
          ,'</div>'].join(''));
          
          hasRender[0] && hasRender.remove(); //如果已经渲染，则Rerender
          othis.after(reElem);          
          events.call(this, reElem, disabled, isSearch);
        });
      }
      //复选框/开关
      ,checkbox: function(){
        var CLASS = {
          checkbox: ['layui-form-checkbox', 'layui-form-checked', 'checkbox']
          ,_switch: ['layui-form-switch', 'layui-form-onswitch', 'switch']
        }
        ,checks = elemForm.find('input[type=checkbox]')
        
        ,events = function(reElem, RE_CLASS){
          var check = $(this);
          
          //勾选
          reElem.on('click', function(){
            var filter = check.attr('lay-filter') //获取过滤器
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
          ,text = (othis.attr('lay-text')||'').split('|'), disabled = this.disabled;
          if(skin === 'switch') skin = '_'+skin;
          var RE_CLASS = CLASS[skin] || CLASS.checkbox;
          
          if(typeof othis.attr('lay-ignore') === 'string') return othis.show();
          
          //替代元素
          var hasRender = othis.next('.' + RE_CLASS[0]);
          var reElem = $(['<div class="layui-unselect '+ RE_CLASS[0] + (
            check.checked ? (' '+RE_CLASS[1]) : '') + (disabled ? ' layui-checkbox-disbaled '+DISABLED : '') +'" lay-skin="'+ (skin||'') +'">'
          ,{
            _switch: '<em>'+ ((check.checked ? text[0] : text[1])||'') +'</em><i></i>'
          }[skin] || ((check.title.replace(/\s/g, '') ? ('<span>'+ check.title +'</span>') : '') +'<i class="layui-icon">'+ (skin ? '&#xe605;' : '&#xe618;') +'</i>')
          ,'</div>'].join(''));

          hasRender[0] && hasRender.remove(); //如果已经渲染，则Rerender
          othis.after(reElem);
          events.call(this, reElem, RE_CLASS);
        });
      }
      //单选框
      ,radio: function(){
        var CLASS = 'layui-form-radio', ICON = ['&#xe643;', '&#xe63f;']
        ,radios = elemForm.find('input[type=radio]')
        
        ,events = function(reElem){
          var radio = $(this), ANIM = 'layui-anim-scaleSpring';
          
          reElem.on('click', function(){
            var name = radio[0].name, forms = radio.parents(ELEM);
            var filter = radio.attr('lay-filter'); //获取过滤器
            var sameRadio = forms.find('input[name='+ name.replace(/(\.|#|\[|\])/g, '\\$1') +']'); //找到相同name的兄弟
            
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
          hasRender[0] && hasRender.remove(); //如果已经渲染，则Rerender
          
          //替代元素
          var reElem = $(['<div class="layui-unselect '+ CLASS + (radio.checked ? (' '+CLASS+'ed') : '') + (disabled ? ' layui-radio-disbaled '+DISABLED : '') +'">'
          ,'<i class="layui-anim layui-icon">'+ ICON[radio.checked ? 0 : 1] +'</i>'
          ,'<div>'+ function(){
            var title = radio.title || '';
            if(typeof othis.next().attr('lay-radio') === 'string'){
              title = othis.next().html();
              othis.next().remove();
            }
            return title
          }() +'</div>'
          ,'</div>'].join(''));

          othis.after(reElem);
          events.call(this, reElem);
        });
      }
    };
    type ? (
      items[type] ? items[type]() : hint.error('不支持的'+ type + '表单渲染')
    ) : layui.each(items, function(index, item){
      item();
    });
    return that;
  };

  //表单提交校验
  var submit = function() {

    var that = this;

    //提交按钮

    var button = $(this),

        //同步校验规则

        verify = form.config.verify,

        //异步校验规则

        asyncVerify = form.config.asyncVerify,

        DANGER = 'layui-form-danger',

        elem = button.parents(ELEM);

    //是否需要进行异步校验

    var needAsyncVerify = !$.isEmptyObject(asyncVerify);

    //获取需要校验的元素

    var verifyElem = elem.find('*[lay-verify]');

    //获取需要异步校验的元素

    var asyncVerifyElem = elem.find('*[lay-async-verify]');

    //获取当前所在的form元素，如果存在的话

    var formElem = button.parents('form')[0];

    //获取所有表单域

    var fieldElem = elem.find('input,select,textarea');

    //获取过滤器

    var filter = button.attr('lay-filter');

    //校验成功

    var onVerifyEnd = function() {

      // 收集数据 提供给回调函数

      var field = {};

      for(var i = 0; i < fieldElem.length; ++i) {

        var item = fieldElem[i];

        if(!item.name) continue;

        if(/^checkbox|radio$/.test(item.type) && !item.checked) continue;

        field[item.name] = item.value;
      }

      //获取字段

      return layui.event.call(that, MOD_NAME, 'submit(' + filter + ')', { elem: that, form: formElem, field: field });
    };

    //校验失败

    var onVerifyFailed = function(context) {

      //移除校验失败前的全部元素的标记样式

      var $obj = context.$obj, tip = context.tip;

      for(var i = 0; i < verifyElem.length; ++i) {

        var e = verifyElem[i], $e = $(e);

        if($e === $obj) break;

        $e.removeClass(DANGER);
      }

      //弹窗提示错误内容

      layer.msg(tip, { icon: 5, shift: 6 });

      //非移动设备自动定位焦点

      if(!device.android && !device.ios) $obj.focus();

      //校验失败元素添加标记样式

      $obj.addClass(DANGER);
    };

    var mapFn = function(elements, fn) {

      var ret = [];

      for(var i = 0; i < elements.length; ++i) ret.push(fn(elements[i]));

      return ret;
    };

    //同步校验

    var applySyncVerify = function() {

      var verifyContextLazyList = mapFn(verifyElem, function(ele) {

        var e = $(ele), value = e.val();

        var verifyFnArray = mapFn(e.attr('lay-verify').split('|'), function(verifyKey) {

            return function() {

                var verifyRef = verify[verifyKey];

                if(!verifyRef) return;

                var isFn = typeof verifyRef === 'function';

                // 校验规则是一个函数

                if(isFn) return verifyRef(value, ele);

                // 校验规则是一个正则表达式

                else if(!verifyRef[0].test(value)) return verifyRef[1];
            };
        });

        var applyVerifyFnArray = function(i) {

            if(i === undefined) i = 0;

            if(i >= verifyFnArray.length) return null;

            var tip = verifyFnArray[i]();

            return tip ? tip : applyVerifyFnArray(i + 1);
        };

        return { $obj: e, itemVerifyFn: applyVerifyFnArray };
      });

      var findFirstIllegalContext = function(i) {

        if(i === undefined) i = 0;

        if(i >= verifyContextLazyList.length) return null;

        var verifyContextRef = verifyContextLazyList[i];

        var verifyTip = verifyContextRef.itemVerifyFn();

        return verifyTip ? { $obj: verifyContextRef.$obj, tip: verifyTip } : findFirstIllegalContext(i + 1);
      };

      var illegalContext = findFirstIllegalContext();

      //同步校验完毕 校验成功

      if(!illegalContext) return true;

      //同步校验完毕 校验失败

      onVerifyFailed(illegalContext);

      return false;
    };

    // 异步校验

    var applyAsyncVerify = function() {

      var asyncVerifyLazyList = mapFn(asyncVerifyElem, function(ele) {

        var e = $(ele), value = e.val();

        var verifyFnArray = mapFn(e.attr('lay-async-verify').split('|'), function(verifyKey) {

          var verifyRef = asyncVerify[verifyKey];

          if(!verifyRef) return function() { return $.Deferred().resolve(null).promise(); };

          //设置异步校验过程

          //处理异步校验发送的数据

          var data = {};

          //data属性是一个函数

          if(typeof verifyRef.data === 'function') data = verifyRef.data($, value, ele);

          //不存在data属性

          else if (!verifyRef.data) data = { value: value };

          //处理发送方式

          var send = function() { return $.Deferred().resolve(data).promise(); };

          if(typeof verifyRef.send === 'string') {

            //send属性是一个字符串 那么send属性等价于url

            send = function() { return $.post(verifyRef.send, data); };

          } else if(typeof verifyRef.send === 'function') {

            //send属性是一个函数 那么期望send方法返回一个promise

            send = function() { return verifyRef.send($, data, ele); };
          }

          //处理接收方式

          var receive = function($, data, ele) { return data; };

          //存在自定义的接收方式

          if(typeof verifyRef.receive === 'function') receive = verifyRef.receive;

          //处理浏览器端校验方法

          var accept = function($, data, ele) { return data.succ ? null : '该字段未通过校验'; };

          //存在自定义的校验方式

          if(typeof verifyRef.accept === 'function') accept = verifyRef.accept;

          //整合形成返回promise的校验过程

          return function() {

            return send().then(function(ajaxData) { return accept($, receive($, ajaxData, ele), ele); });
          };
        });

        return function(callback) {

          var activatedVerifyFnArray = mapFn(verifyFnArray, function(fn) { return fn(); });

          return $.when.apply(null, activatedVerifyFnArray).then(function() {

            var tip = null;

            for(var i = 0; i < arguments.length; ++i) {

              if(!arguments[i]) continue;

              tip = arguments[i];

              break;
            }

            //异步校验失败

            if(tip) {

              onVerifyFailed({ $obj: e, tip: tip });

              return;
            }

            //异步校验成功 对下一个元素进行校验

            if(callback) {

              callback();

              return;
            }

            //完成全部异步校验 提交表单

            onVerifyEnd();

          }, function() {

            layer.msg('网络连接异常，请稍后重试', { icon: 5, shift: 6 });
          });
        };
      });

      var composeAsyncVerify = function(i) {

        if(i === undefined) i = 0;

        if(i >= asyncVerifyLazyList.length - 1) return function() { asyncVerifyLazyList[i](null); };

        return function() { asyncVerifyLazyList[i](composeAsyncVerify(i + 1)); };
      };

      var asyncVerifyChain = composeAsyncVerify();

      asyncVerifyChain();
    };

    //执行同步校验结果

    var syncVerifyResult = applySyncVerify();

    //同步校验失败 阻止提交操作

    if(!syncVerifyResult) return false;

    //同步校验成功 且不需要进行异步校验 执行表单提交操作

    if(syncVerifyResult && !needAsyncVerify) return onVerifyEnd();

    //执行异步校验

    applyAsyncVerify();

    //阻止表单提交 提交表单的操作由回调函数触发

    return false;
  };

  //自动完成渲染
  var form = new Form()
  ,dom = $(document), win = $(window);
  
  form.render();
  
  //表单reset重置渲染
  dom.on('reset', ELEM, function(){
    var filter = $(this).attr('lay-filter');
    setTimeout(function(){
      form.render(null, filter);
    }, 50);
  });
  
  //表单提交事件
  dom.on('submit', ELEM, submit)
  .on('click', '*[lay-submit]', submit);
  
  exports(MOD_NAME, form);
});

 
