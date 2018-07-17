/**

 @Title: layui.slider 滑块
 @Author: star1029
 @License：MIT

 */

layui.define(['jquery', 'form'], function(exports){
  "use strict";
  var $ = layui.jquery
  ,form = layui.form

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

  //字符常量
  ,MOD_NAME = 'slider', ELEM_VIEW = 'layui-slider', SLIDER_BAR = 'layui-slider-bar', SLIDER_WRAP = 'layui-slider-wrap', SLIDER_WRAP_BTN = 'layui-slider-wrap-btn'
  ,SLIDER_TIPS = 'layui-slider-tips', SLIDER_INPUT = 'layui-slider-input', SLIDER_INPUT_TXT = 'layui-slider-input-txt', SLIDER_INPUT_BTN = 'layui-slider-input-btn'

  //构造器
  ,Class = function(options){
    var that = this;
    that.index = ++slider.index;
    that.config = $.extend({}, that.config, slider.config, options);
    that.render();
  };

  //默认配置
  Class.prototype.config = {
    min: 0 //最小值
    ,max: 100 //最大值，默认100
    ,value: 0 //初始值，默认为0
    ,step: 1 //间隔值
    ,showstep: false //间隔点开启
    ,tips: true //文字提示，开启
    ,input: false //输入框，关闭
    ,range: false //范围选择，与输入框不能同时开启，默认关闭
    ,vertical: false //垂直滑块，默认横向
    ,height: 200 //配合 vertical 参数使用，默认200px
    ,disabled: false //滑块禁用，默认关闭
    ,color: '#009688' //主题颜色
  };

  //滑块渲染
  Class.prototype.render = function(){
    var that = this
    ,options = that.config;
    options.min = options.min < 0 ? 0 : options.min;
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
    }else{
      options.value = typeof(options.value) == 'object' ? Math.min(options.value[0], options.value[1]) : options.value;
      options.value = options.value > options.min ? options.value : options.min;
      var scale = Math.floor((options.value - options.min) / (options.max - options.min) * 100) + '%';
    };

    var color = options.disabled ? '#c2c2c2' : options.color;

    var temp = '<div class="layui-slider '+ (options.vertical ? 'layui-slider-vertical' : '') +'">'+ (options.tips ? '<div class="layui-slider-tips"></div><span></span>' : '') + 
    '<div class="layui-slider-bar" style="background:'+ color +'; '+ (options.vertical ? 'height' : 'width') +':'+ scale +';'+ (options.vertical ? 'bottom' : 'left') +':'+ (scaleFir || 0) +';"></div><div class="layui-slider-wrap" style="'+ (options.vertical ? 'bottom' : 'left') +':'+ (scaleFir || scale) +';">' +
    '<div class="layui-slider-wrap-btn" style="border: 2px solid '+ color +';"></div></div>'+ (options.range ? '<div class="layui-slider-wrap" style="'+ (options.vertical ? 'bottom' : 'left') +':'+ scaleSec +';"><div class="layui-slider-wrap-btn" style="border: 2px solid '+ color +';"></div></div>' : '') +'</div>';

    //开始插入替代元素
    var othis = $(options.elem)
    ,hasRender = othis.next('.' + ELEM_VIEW);
    
    //生成替代元素
    hasRender[0] && hasRender.remove(); //如果已经渲染，则Rerender
    
    that.elemTemp = $(temp);
    othis.html(that.elemTemp);

    //垂直滑块
    if(options.vertical){
      that.elemTemp.height(options.height + 'px');
    };

    //显示间断点
    if(options.showstep){
      var number = (options.max - options.min) / options.step, item = '';
      for(var i = 1; i < number + 1; i++) {
        var step = i * 100 / number;
        if(step < 100){
          item += '<div class="layui-slider-step" style="'+ (options.vertical ? 'bottom' : 'left') +':'+ step +'%"></div>'
        }
      };
      that.elemTemp.append(item);
    };
    
    //插入输入框
    if(options.input && !options.range){
      othis.css("position","relative");
      othis.append('<div class="layui-slider-input"><div class="layui-slider-input-txt"><input type="text" class="layui-input"></div><div class="layui-slider-input-btn"><i class="layui-icon layui-icon-up"></i><i class="layui-icon layui-icon-down"></i></div></div>');
      othis.find('.' + SLIDER_INPUT_TXT).children('input').val(options.value);
      if(!options.vertical) that.elemTemp.css("width", "80%");
    };

    //划过滑块
    that.elemTemp.find('.' + SLIDER_WRAP_BTN).on('mouseover', function(){
      var sliderWidth = options.vertical ? options.height : that.elemTemp[0].offsetWidth
      ,sliderWrap = that.elemTemp.find('.' + SLIDER_WRAP)
      ,tipsLeft = options.vertical ? (sliderWidth - $(this).parent()[0].offsetTop - sliderWrap.height()) : $(this).parent()[0].offsetLeft
      ,left = tipsLeft / sliderWidth * 100
      ,tipsTemp = options.min + Math.round((options.max - options.min) * left / 100) 
      ,tipsTxt = options.setTips ? options.setTips(tipsTemp) : tipsTemp;
      that.elemTemp.find('.' + SLIDER_TIPS).html(tipsTxt);
      if(options.vertical){
        that.elemTemp.find('.' + SLIDER_TIPS).css({"bottom":left + '%', "margin-bottom":"30px", "display":"inline-block"});
        that.elemTemp.children('span').css({"bottom":left + '%', "margin-bottom":"18px", "display":"inline-block"});
      }else{
        that.elemTemp.find('.' + SLIDER_TIPS).css({"left":left + '%', "display":"inline-block"});
        that.elemTemp.children('span').css({"left":left + '%', "display":"inline-block"});
      };
    }).on('mouseout', function(){
      that.elemTemp.find('.' + SLIDER_TIPS).css("display", "none");
      that.elemTemp.children('span').css("display", "none");
    }); 

    //给未禁止的滑块滑动事件
    if(!options.disabled) that.slide();
  };

  //滑块滑动
  Class.prototype.slide = function(){
    var that = this
    ,options = that.config
    ,sliderAct = that.elemTemp
    ,sliderWidth = options.vertical ? options.height : sliderAct[0].offsetWidth
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
      sliderWrap.eq(index).css((options.vertical ?'bottom':'left'), offsetValue + '%');
      var firLeft = valueTo(sliderWrap[0].offsetLeft)
      ,secLeft = options.range ? valueTo(sliderWrap[1].offsetLeft) : 0;
      if(options.vertical){
        sliderAct.find('.' + SLIDER_TIPS).css({"bottom":offsetValue + '%', "margin-bottom":"30px"});
        sliderAct.children('span').css({"bottom":offsetValue + '%', "margin-bottom":"18px"});
        firLeft = valueTo(sliderWidth - sliderWrap[0].offsetTop - sliderWrap.height());
        secLeft = options.range ? valueTo(sliderWidth - sliderWrap[1].offsetTop - sliderWrap.height()) : 0;
      }else{
        sliderAct.find('.' + SLIDER_TIPS).css("left",offsetValue + '%');
        sliderAct.children('span').css("left",offsetValue + '%');
      };
      firLeft = firLeft > 100 ? 100: firLeft;
      secLeft = secLeft > 100 ? 100: secLeft;
      var minLeft = Math.min(firLeft, secLeft)
      ,wrapWidth = Math.abs(firLeft - secLeft);
      if(options.vertical){
        sliderAct.find('.' + SLIDER_BAR).css({"height":wrapWidth + '%', "bottom":minLeft + '%'});
      }else{
        sliderAct.find('.' + SLIDER_BAR).css({"width":wrapWidth + '%', "left":minLeft + '%'});
      };
      var selfValue = options.min + Math.round((options.max - options.min) * offsetValue / 100);
      options.sliderValue && options.sliderValue(selfValue);
      inputValue = selfValue;
      sliderTxt.children('.' + SLIDER_INPUT_TXT).children('input').val(inputValue);
      selfValue = options.setTips ? options.setTips(selfValue) : selfValue;
      sliderAct.find('.' + SLIDER_TIPS).html(selfValue);
    }
    ,valueTo = function(value){
      var oldLeft = value / sliderWidth * 100 / step
      ,left =  Math.round(oldLeft) * step;
      if(value == sliderWidth){
        left =  Math.ceil(oldLeft) * step;
      };
      return left;
    };
    
    //滑块滑动
    sliderAct.find('.' + SLIDER_WRAP_BTN).each(function(index){
      $(this).on('mousedown', function(e){
        var oldleft = $(this).parent()[0].offsetLeft
        ,oldx = e.clientX;
        if(options.vertical){
          oldleft = sliderWidth - $(this).parent()[0].offsetTop - sliderWrap.height()
          oldx = e.clientY;
        };
        var move = function(e){
          var left = oldleft + (options.vertical ? (oldx - e.clientY) : (e.clientX - oldx));
          if(left < 0)left = 0;
          if(left > sliderWidth)left = sliderWidth;
          var reaLeft = left / sliderWidth * 100 / step;
          change(reaLeft, index);
          $(this).addClass('hover');
          sliderAct.find('.' + SLIDER_TIPS).css("display", "inline-block");
          sliderAct.children('span').css("display", "inline-block");
          e.preventDefault();
        }
        ,up = function(){
          document.onmousemove = null;
          document.onmouseup = null;
          $(this).removeClass('hover');
          sliderAct.find('.' + SLIDER_TIPS).css("display", "none");
          sliderAct.children('span').css("display", "none");
        };
        document.onmousemove = move;
        document.onmouseup = up;
        e.preventDefault();
      });
    });
    sliderAct.on('click', function(e){
      var left = options.vertical ? (sliderWidth - e.clientY + $(this).offset().top):(e.clientX - $(this).offset().left), index;
      if(left < 0)left = 0;
      if(left > sliderWidth)left = sliderWidth;
      var reaLeft = left / sliderWidth * 100 / step;
      if(options.range){
        if(options.vertical){
          index = Math.abs(left - parseInt($(sliderWrap[0]).css('bottom'))) > Math.abs(left -  parseInt($(sliderWrap[1]).css('bottom'))) ? 1 : 0;
        }else{
          index = Math.abs(left - sliderWrap[0].offsetLeft) > Math.abs(left - sliderWrap[1].offsetLeft) ? 1 : 0;
        }
      }else{
        index = 0;
      };
      change(reaLeft, index);
      e.preventDefault();
    });
    //输入框
    sliderTxt.hover(
      function(){
        $(this).addClass("hover");
        $(this).children('.' + SLIDER_INPUT_BTN).fadeIn('fast');
      },
      function(){
        $(this).removeClass("hover");
        $(this).children('.' + SLIDER_INPUT_BTN).fadeOut('fast');
      }
    );
    sliderTxt.children('.' + SLIDER_INPUT_BTN).children('i').each(function(index){
      $(this).on('click', function(){
        if(index == 1){
          inputValue = inputValue - step < options.min ? options.min : inputValue - step;
        }else{
          inputValue = Number(inputValue) + step > options.max ? options.max : Number(inputValue) + step;
        };
        var inputScale =  (inputValue - options.min) / (options.max - options.min) * 100 / step;
        change(inputScale, 0);
      });
    });
    sliderTxt.children('.' + SLIDER_INPUT_TXT).children('input').blur(function(){
      var realValue = this.value;
      realValue = realValue < options.min ? options.min : realValue;
      realValue = realValue > options.max ? options.max : realValue;
      this.value = realValue;
      var inputScale =  (realValue - options.min) / (options.max - options.min) * 100 / step
      change(inputScale, 0);
    })
  };

  //事件处理
  Class.prototype.events = function(){
     var that = this
    ,options = that.config;
  };

  //核心入口
  slider.render = function(options){
    var inst = new Class(options); 
  };
  
  exports(MOD_NAME, slider);
})