/**

 @Title: layui.slider 滑块
 @Author: star1029
 @License：MIT

 */

layui.define('jquery', function(exports){
  "use strict";
  var $ = layui.jquery

  //外部接口
  ,slider = {
    config: {}
    ,index: layui.slider ? (layui.slider.index + 10000) : 0

    //设置全局项
    ,set: function(options){
      var that = this;
      that.config = $.extend({}, that.config, options);
      return that;
    }
    
    //事件监听
    ,on: function(events, callback){
      return layui.onevent.call(this, MOD_NAME, events, callback);
    }
  }
  
  //操作当前实例
  ,thisSlider = function(){
    var that = this
    ,options = that.config;

    return {
      setValue: function(value, index){ //设置值
        return that.slide('set', value, index || 0);
      }
      ,config: options
    }
  }

  //字符常量
  ,MOD_NAME = 'slider', DISABLED = 'layui-disabled', ELEM_VIEW = 'layui-slider', SLIDER_BAR = 'layui-slider-bar', SLIDER_WRAP = 'layui-slider-wrap', SLIDER_WRAP_BTN = 'layui-slider-wrap-btn', SLIDER_TIPS = 'layui-slider-tips', SLIDER_INPUT = 'layui-slider-input', SLIDER_INPUT_TXT = 'layui-slider-input-txt', SLIDER_INPUT_BTN = 'layui-slider-input-btn', ELEM_HOVER = 'layui-slider-hover'

  //构造器
  ,Class = function(options){
    var that = this;
    that.index = ++slider.index;
    that.config = $.extend({}, that.config, slider.config, options);
    that.render();
  };

  //默认配置
  Class.prototype.config = {
    type: 'default' //滑块类型，垂直：vertical
    ,min: 0 //最小值
    ,max: 100 //最大值，默认100
    ,value: 0 //初始值，默认为0
    ,step: 1 //间隔值
    ,showstep: false //间隔点开启
    ,tips: true //文字提示，开启
    ,input: false //输入框，关闭
    ,range: false //范围选择，与输入框不能同时开启，默认关闭
    ,height: 200 //配合 type:"vertical" 使用，默认200px
    ,disabled: false //滑块禁用，默认关闭
    ,theme: '#009688' //主题颜色
  };

  //滑块渲染
  Class.prototype.render = function(){
    var that = this
    ,options = that.config;
    
    //间隔值不能小于 1
    if(options.step < 1) options.step = 1;
    
    //最大值不能小于最小值
    if(options.max < options.min) options.max = options.min + options.step;
    
    

    //判断是否开启双滑块
    if(options.range){
      options.value = typeof(options.value) == 'object' ? options.value : [options.min, options.value];
      var minValue = Math.min(options.value[0], options.value[1])
      ,maxValue = Math.max(options.value[0], options.value[1]);
      options.value[0] = minValue > options.min ? minValue : options.min;
      options.value[1] = maxValue > options.min ? maxValue : options.min;
      options.value[0] = options.value[0] > options.max ? options.max : options.value[0];
      options.value[1] = options.value[1] > options.max ? options.max : options.value[1];
      
      var scaleFir = Math.floor((options.value[0] - options.min) / (options.max - options.min) * 100)
      ,scaleSec = Math.floor((options.value[1] - options.min) / (options.max - options.min) * 100)
      ,scale = scaleSec - scaleFir + '%';
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

      var scale = Math.floor((options.value - options.min) / (options.max - options.min) * 100) + '%';
    };
    

    //如果禁用，颜色为统一的灰色
    var theme = options.disabled ? '#c2c2c2' : options.theme;

    //滑块
    var temp = '<div class="layui-slider '+ (options.type === 'vertical' ? 'layui-slider-vertical' : '') +'">'+ (options.tips ? '<div class="layui-slider-tips"></div>' : '') + 
    '<div class="layui-slider-bar" style="background:'+ theme +'; '+ (options.type === 'vertical' ? 'height' : 'width') +':'+ scale +';'+ (options.type === 'vertical' ? 'bottom' : 'left') +':'+ (scaleFir || 0) +';"></div><div class="layui-slider-wrap" style="'+ (options.type === 'vertical' ? 'bottom' : 'left') +':'+ (scaleFir || scale) +';">' +
    '<div class="layui-slider-wrap-btn" style="border: 2px solid '+ theme +';"></div></div>'+ (options.range ? '<div class="layui-slider-wrap" style="'+ (options.type === 'vertical' ? 'bottom' : 'left') +':'+ scaleSec +';"><div class="layui-slider-wrap-btn" style="border: 2px solid '+ theme +';"></div></div>' : '') +'</div>';

    var othis = $(options.elem)
    ,hasRender = othis.next('.' + ELEM_VIEW);
    //生成替代元素
    hasRender[0] && hasRender.remove(); //如果已经渲染，则Rerender  
    that.elemTemp = $(temp);

    //把数据缓存到滑块上
    if(options.range){
      that.elemTemp.find('.' + SLIDER_WRAP).eq(0).data('value', options.value[0]);
      that.elemTemp.find('.' + SLIDER_WRAP).eq(1).data('value', options.value[1]); 
    }else{
      that.elemTemp.find('.' + SLIDER_WRAP).data('value', options.value);
    };
    
    //插入替代元素
    othis.html(that.elemTemp); 

    //垂直滑块
    if(options.type === 'vertical'){
      that.elemTemp.height(options.height + 'px');
    };

    //显示间断点
    if(options.showstep){
      var number = (options.max - options.min) / options.step, item = '';
      for(var i = 1; i < number + 1; i++) {
        var step = i * 100 / number;
        if(step < 100){
          item += '<div class="layui-slider-step" style="'+ (options.type === 'vertical' ? 'bottom' : 'left') +':'+ step +'%"></div>'
        }
      };
      that.elemTemp.append(item);
    };

    //插入输入框
    if(options.input && !options.range){
      var elemInput = $('<div class="layui-slider-input layui-input"><div class="layui-slider-input-txt"><input type="text" class="layui-input"></div><div class="layui-slider-input-btn"><i class="layui-icon layui-icon-up"></i><i class="layui-icon layui-icon-down"></i></div></div>');
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
    };  

    //给未禁止的滑块滑动事件
    if(!options.disabled){
      that.slide();
    }else{
      that.elemTemp.addClass(DISABLED);
      that.elemTemp.find('.' + SLIDER_WRAP_BTN).addClass(DISABLED);
    };

    //划过滑块显示数值
    that.elemTemp.find('.' + SLIDER_WRAP_BTN).on('mouseover', function(){
      var sliderWidth = options.type === 'vertical' ? options.height : that.elemTemp[0].offsetWidth
      ,sliderWrap = that.elemTemp.find('.' + SLIDER_WRAP)
      ,tipsLeft = options.type === 'vertical' ? (sliderWidth - $(this).parent()[0].offsetTop - sliderWrap.height()) : $(this).parent()[0].offsetLeft
      ,left = tipsLeft / sliderWidth * 100
      ,value = $(this).parent().data('value')
      ,tipsTxt = options.setTips ? options.setTips(value) : value;
      that.elemTemp.find('.' + SLIDER_TIPS).html(tipsTxt);
      if(options.type === 'vertical'){
        that.elemTemp.find('.' + SLIDER_TIPS).css({"bottom":left + '%', "margin-bottom":"20px", "display":"inline-block"});
      }else{
        that.elemTemp.find('.' + SLIDER_TIPS).css({"left":left + '%', "display":"inline-block"});
      };
    }).on('mouseout', function(){
      that.elemTemp.find('.' + SLIDER_TIPS).css("display", "none");
    }); 
  };

  //滑块滑动
  Class.prototype.slide = function(setValue, value, i){
    var that = this
    ,options = that.config
    ,sliderAct = that.elemTemp
    ,sliderWidth = function(){
      return options.type === 'vertical' ? options.height : sliderAct[0].offsetWidth
    }
    ,sliderWrap = sliderAct.find('.' + SLIDER_WRAP)
    ,sliderTxt = sliderAct.next('.' + SLIDER_INPUT)
    ,inputValue = sliderTxt.children('.' + SLIDER_INPUT_TXT).children('input').val()
    ,step = 100 / ((options.max - options.min) / Math.ceil(options.step))
    ,change = function(offsetValue, index){
      if(Math.ceil(offsetValue) * step > 100){
        offsetValue = Math.ceil(offsetValue) * step
      }else{
        offsetValue = Math.round(offsetValue) * step
      };
      offsetValue = offsetValue > 100 ? 100: offsetValue;
      sliderWrap.eq(index).css((options.type === 'vertical' ?'bottom':'left'), offsetValue + '%');
      var firLeft = valueTo(sliderWrap[0].offsetLeft)
      ,secLeft = options.range ? valueTo(sliderWrap[1].offsetLeft) : 0;
      if(options.type === 'vertical'){
        sliderAct.find('.' + SLIDER_TIPS).css({"bottom":offsetValue + '%', "margin-bottom":"20px"});
        firLeft = valueTo(sliderWidth() - sliderWrap[0].offsetTop - sliderWrap.height());
        secLeft = options.range ? valueTo(sliderWidth() - sliderWrap[1].offsetTop - sliderWrap.height()) : 0;
      }else{
        sliderAct.find('.' + SLIDER_TIPS).css("left",offsetValue + '%');
      };
      firLeft = firLeft > 100 ? 100: firLeft;
      secLeft = secLeft > 100 ? 100: secLeft;
      var minLeft = Math.min(firLeft, secLeft)
      ,wrapWidth = Math.abs(firLeft - secLeft);
      if(options.type === 'vertical'){
        sliderAct.find('.' + SLIDER_BAR).css({"height":wrapWidth + '%', "bottom":minLeft + '%'});
      }else{
        sliderAct.find('.' + SLIDER_BAR).css({"width":wrapWidth + '%', "left":minLeft + '%'});
      };
      var selfValue = options.min + Math.round((options.max - options.min) * offsetValue / 100);
      
      inputValue = selfValue;
      sliderTxt.children('.' + SLIDER_INPUT_TXT).children('input').val(inputValue);
      sliderWrap.eq(index).data('value', selfValue);
      selfValue = options.setTips ? options.setTips(selfValue) : selfValue;
      sliderAct.find('.' + SLIDER_TIPS).html(selfValue);
      
      //如果开启范围选择，则返回数组值
      if(options.range){
        var arrValue = [
          sliderWrap.eq(0).data('value')
          ,sliderWrap.eq(1).data('value')
        ];
        if(arrValue[0] > arrValue[1]) arrValue.reverse(); //如果前面的圆点超过了后面的圆点值，则调换顺序
      }
      
       //回调
      options.change && options.change(options.range ? arrValue : selfValue);
    }
    ,valueTo = function(value){
      var oldLeft = value / sliderWidth() * 100 / step
      ,left =  Math.round(oldLeft) * step;
      if(value == sliderWidth()){
        left =  Math.ceil(oldLeft) * step;
      };
      return left;
    }
    
    //拖拽元素
    ,elemMove = $(['<div class="layui-auxiliar-moving" id="LAY-slider-moving"></div'].join(''))
    ,createMoveElem = function(move, up){
      var upCall = function(){
        up && up();
        elemMove.remove();
      };
      $('#LAY-slider-moving')[0] || $('body').append(elemMove);
      elemMove.on('mousemove', move);
      elemMove.on('mouseup', upCall).on('mouseleave', upCall);
    };
    
    //动态赋值
    if(setValue === 'set') return change(value, i);

    //滑块滑动
    sliderAct.find('.' + SLIDER_WRAP_BTN).each(function(index){
      var othis = $(this);
      othis.on('mousedown', function(e){
        e = e || window.event;
        
        var oldleft = othis.parent()[0].offsetLeft
        ,oldx = e.clientX;
        if(options.type === 'vertical'){
          oldleft = sliderWidth() - othis.parent()[0].offsetTop - sliderWrap.height()
          oldx = e.clientY;
        };
        
        var move = function(e){
          e = e || window.event;
          var left = oldleft + (options.type === 'vertical' ? (oldx - e.clientY) : (e.clientX - oldx));
          if(left < 0)left = 0;
          if(left > sliderWidth())left = sliderWidth();
          var reaLeft = left / sliderWidth() * 100 / step;
          change(reaLeft, index);
          othis.addClass(ELEM_HOVER);
          sliderAct.find('.' + SLIDER_TIPS).show();
          e.preventDefault();
        };
        
        var up = function(){
          othis.removeClass(ELEM_HOVER);
          sliderAct.find('.' + SLIDER_TIPS).hide();
        };
        
        createMoveElem(move, up)
      });
    });
    
    //点击滑块
    sliderAct.on('click', function(e){
      var main = $('.' + SLIDER_WRAP_BTN);
      if(!main.is(event.target) && main.has(event.target).length === 0 && main.length){
        var left = options.type === 'vertical' ? (sliderWidth() - e.clientY + $(this).offset().top):(e.clientX - $(this).offset().left), index;
        if(left < 0)left = 0;
        if(left > sliderWidth())left = sliderWidth();
        var reaLeft = left / sliderWidth() * 100 / step;
        if(options.range){
          if(options.type === 'vertical'){
            index = Math.abs(left - parseInt($(sliderWrap[0]).css('bottom'))) > Math.abs(left -  parseInt($(sliderWrap[1]).css('bottom'))) ? 1 : 0;
          }else{
            index = Math.abs(left - sliderWrap[0].offsetLeft) > Math.abs(left - sliderWrap[1].offsetLeft) ? 1 : 0;
          }
        }else{
          index = 0;
        };
        change(reaLeft, index);
        e.preventDefault();
      }
    });

    //输入框移入事件
    sliderTxt.hover(function(){
      var othis = $(this);
      othis.children('.' + SLIDER_INPUT_BTN).fadeIn('fast');
    }, function(){
      var othis = $(this);
      othis.children('.' + SLIDER_INPUT_BTN).fadeOut('fast');
    });
    
    //点击加减输入框
    sliderTxt.children('.' + SLIDER_INPUT_BTN).children('i').each(function(index){
      $(this).on('click', function(){
        if(index == 1){
          inputValue = inputValue - options.step < options.min 
            ? options.min 
          : Number(inputValue) - options.step;
        }else{
          inputValue = Number(inputValue) + options.step > options.max 
            ? options.max 
          : Number(inputValue) + options.step;
        };
        var inputScale =  (inputValue - options.min) / (options.max - options.min) * 100 / step;
        change(inputScale, 0);
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
      change(inputScale, 0);
    };
    sliderTxt.children('.' + SLIDER_INPUT_TXT).children('input').on('keydown', function(e){
      if(e.keyCode === 13){
        e.preventDefault();
        getInputValue.call(this);
      }
    }).on('change', getInputValue);     
  };

  //事件处理
  Class.prototype.events = function(){
     var that = this
    ,options = that.config;
  };

  //核心入口
  slider.render = function(options){
    var inst = new Class(options); 
    return thisSlider.call(inst);
  };
  
  exports(MOD_NAME, slider);
})