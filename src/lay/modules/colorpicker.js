/**

 @Title: layui.colorpicker 颜色选择器
 @Author: star1029
 @License：MIT

 */

layui.define('jquery',function(exports){
  "use strict";
  var $ = layui.jquery

  //外部接口
  ,colorpicker = {
    config: {}
    ,index: layui.colorpicker ? (layui.colorpicker.index + 10000) : 0

    //设置全局项
    ,set: function(options){
      var that = this;
      that.config = $.extend({}, that.config, options);
      return that;
    }
    
    //事件监听
    ,on: function(events, callback){
      return layui.onevent.call(this, 'colorpicker', events, callback);
    }
  }

  //字符常量
  ,MOD_NAME = 'colorpicker', ELEM_VIEW = 'layui-colorpicker', ELEM_MAIN = 'layui-colorpicker-main', ICON_PICKER_DOWN = 'layui-icon-down', ICON_PICKER_CLOSE = 'layui-icon-close'
  ,PICKER_TRIG_SPAN = 'layui-colorpicker-trigger-span', PICKER_TRIG_I = 'layui-colorpicker-trigger-i', PICKER_SIDE = 'colorpicker-side', PICKER_SIDE_SLIDER = 'colorpicker-side-slider'
  ,PICKER_BASIS = 'colorpicker-basis', PICKER_ALPHA_BG = 'colorpicker-alpha-bgcolor', PICKER_ALPHA_SLIDER = 'colorpicker-alpha-slider', PICKER_BASIS_CUR = 'colorpicker-basis-cursor', PICKER_INPUT = 'layui-colorpicker-main-input'
  
  //构造器
  ,Class = function(options){
    var that = this;
    that.index = ++colorpicker.index;
    that.config = $.extend({}, that.config, colorpicker.config, options);
    that.render();
  }

  //RGB转HSB
  ,RGBToHSB = function(rgb){
    var hsb = {h:0, s:0, b:0};
    var min = Math.min(rgb.r, rgb.g, rgb.b);
    var max = Math.max(rgb.r, rgb.g, rgb.b);
    var delta = max - min;
    hsb.b = max;
    hsb.s = max != 0 ? 255*delta/max : 0;
    if(hsb.s != 0){
      if(rgb.r == max){
        hsb.h = (rgb.g - rgb.b) / delta;
      }else if(rgb.g == max){
        hsb.h = 2 + (rgb.b - rgb.r) / delta;
      }else{
        hsb.h = 4 + (rgb.r - rgb.g) / delta;
      }
    }else{
      hsb.h = -1;
    };
    if(max == min){ 
      hsb.h = 0;
    };
    hsb.h *= 60;
    if(hsb.h < 0) {
      hsb.h += 360;
    };
    hsb.s *= 100/255;
    hsb.b *= 100/255;
    return hsb;  
  }

  //HEX转HSB
  ,HEXToHSB = function(hex){
    var hex = hex.indexOf('#') > -1 ? hex.substring(1) : hex;
    if(hex.length == 3){
      var num = hex.split("");
      hex = num[0]+num[0]+num[1]+num[1]+num[2]+num[2]
    };
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
    if(s == 0){
      rgb.r = rgb.g = rgb.b = b;
    }else{
      var t1 = b;
      var t2 = (255 - s) * b /255;
      var t3 = (t1 - t2) * (h % 60) /60;
      if(h == 360) h = 0;
      if(h < 60) {rgb.r=t1; rgb.b=t2; rgb.g=t2+t3}
      else if(h < 120) {rgb.g=t1; rgb.b=t2; rgb.r=t1-t3}
      else if(h < 180) {rgb.g=t1; rgb.r=t2; rgb.b=t2+t3}
      else if(h < 240) {rgb.b=t1; rgb.r=t2; rgb.g=t1-t3}
      else if(h < 300) {rgb.b=t1; rgb.g=t2; rgb.r=t2+t3}
      else if(h < 360) {rgb.r=t1; rgb.g=t2; rgb.b=t1-t3}
      else {rgb.r=0; rgb.g=0; rgb.b=0}
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
    $.each(hex, function(nr, val){
      if(val.length == 1){
        hex[nr] = '0' + val;
      }
    });
    return hex.join('');
  }

  //转化成所需rgb格式
  ,RGBSTo = function(rgbs){
    var regexp = /[0-9]{1,3}/g;
    var re = rgbs.match(regexp);
    return {r:re[0], g:re[1], b:re[2]};
  };

  //默认配置
  Class.prototype.config = {
    bgcolor: ''  //默认颜色，默认没有
    ,size: ''  //选择器大小
    ,alpha: false  //是否开启透明度
    ,format: 'hex'  //颜色显示/输入格式，可选 rgb,hex
    ,predefine: false //预定义颜色是否开启
    ,prededata: ['#ff4500','#ff8c00','#ffd700','#90ee90','#00ced1','#1e90ff','#c71585','rgba(255, 69, 0, 0.68)','rgb(255, 120, 0)','rgb(250, 212, 0)','rgba(144, 240, 144, 0.5)','rgb(0, 186, 189)','rgba(31, 147, 255, 0.73)']
  };

  //下拉框渲染
  Class.prototype.render = function(){
    var that = this
    ,options = that.config
    ,temp = '<div class="layui-colorpicker layui-colorpicker-'+ options.size +'">'
    ,span = '<span class="'+ ((options.format == 'rgb' && options.alpha) ? 'layui-colorpicker-trigger-bgcolor' : '') +'">' +
    '<span class="layui-colorpicker-trigger-span '+ (options.format == 'rgb' ? (options.alpha ? 'rgba' : 'torgb') : '') +'"' +
    'style="background:'+ (options.bgcolor ? (options.bgcolor.match(/[0-9]{1,3}/g).length > 3 ? 
      ( options.alpha && options.format == 'rgb' ? options.bgcolor : ('#' + HSBToHEX(RGBToHSB(RGBSTo(options.bgcolor)))) ) : options.bgcolor ) :'') +'">';
    span += '<i class="layui-icon layui-colorpicker-trigger-i '+ (options.bgcolor ? ICON_PICKER_DOWN : ICON_PICKER_CLOSE) +'"></i></span></span>';
    temp += span + '</div>';

    //开始插入替代元素
    var othis = $(options.elem)
    ,hasRender = othis.next('.' + ELEM_VIEW);  

    othis.css("display","inline-block");
    //生成替代元素
    hasRender[0] && hasRender.remove(); //如果已经渲染，则Rerender

    that.elemTemp = $(temp);
    othis.html(that.elemTemp);

    that.trigger();
  };

  //颜色选择器插入
  Class.prototype.show = function(){
    var that = this
    ,options = that.config
    ,span = $(options.elem)[0];
    var pre = '';
    $.each(options.prededata, function(index, value){
      pre += '<div class="colorpicker-pre '+ (value.match(/[0-9]{1,3}/g).length > 3 ? 'isalpha' : '') +'"><div style="background:'+ value +'"></div></div>'
    });
    var elem = that.elem = '<div id="layui-colorpicker'+ that.index +'" class="layui-colorpicker-main"><div class="layui-colorpicker-main-wrapper"><div class="colorpicker-basis"><div class="colorpicker-basis-white"></div><div class="colorpicker-basis-black"></div>' +
    '<div class="colorpicker-basis-cursor"></div></div><div class="colorpicker-side"><div class="colorpicker-side-slider"></div></div></div><div class="layui-colorpicker-main-alpha" style="display: '+ (options.alpha ? 'block' : 'none') +'"><div class="colorpicker-alpha-bgcolor">' +
    '<div class="colorpicker-alpha-slider"></div></div></div><div class="layui-colorpicker-main-pre">'+ (options.predefine ? pre :'') +'</div><div class="layui-colorpicker-main-input"><div class="layui-inline"><input type="text" class="layui-input">' +
    '</input></div><button class="empty layui-btn layui-btn-primary layui-btn-sm">清空</button><button class="confirm layui-btn layui-btn-sm">确定</button></div></div>';
    
    if($('.layui-colorpicker-main').length && Class.thisElemInd == that.index){
      that.remove(Class.thisElemInd);
    }else{
      if($('.layui-colorpicker-main').length && Class.thisElemInd != that.index && Class.thisElemInd){
        $('.' + ELEM_VIEW).eq(Class.thisElemInd - 1).find('.' + PICKER_TRIG_SPAN)[0].style.background = Class.bgcolor ;
        if(!Class.bgcolor){ $('.' + ELEM_VIEW).eq(Class.thisElemInd - 1).find('.' + PICKER_TRIG_I).removeClass(ICON_PICKER_DOWN).addClass(ICON_PICKER_CLOSE) }
      };
      that.remove(Class.thisElemInd); 
      //插入到body 
      $('body').append(elem);
    };
    Class.thisElemInd = that.index;
    Class.bgcolor = $('.' + ELEM_VIEW).eq(Class.thisElemInd - 1).find('.' + PICKER_TRIG_SPAN)[0].style.background;
    
    //根据下拉框的top来判断颜色选择框出现的位置
    var _top = span.getBoundingClientRect().top
    ,_left = span.getBoundingClientRect().left
    ,_height = span.offsetHeight
    ,_width = span.offsetWidth
    ,bodyheight = window.innerHeight
    ,bodywidth = window.innerWidth
    ,height = $('.layui-colorpicker-main').outerHeight()
    ,width = $('.layui-colorpicker-main').outerWidth()
    ,top,left;
    //得到选择器的left偏移量
    left = bodywidth - _left - _width;
    if(left < _left && left < (width - _width)/2){
      left = bodywidth - width;
    }else if(_left < left && _left < (width - _width)/2){
      left = 0;
    }else{
      left = _left - (width - _width)/2;
    };
    //得到选择器的top偏移量
    top = bodyheight - _top - _height;
    if(top - height < 20){
      top = _top - height - 2;
      $('.layui-colorpicker-main').css({"top":top - 11, "left":left});
      $('.layui-colorpicker-main').animate({top: top + 1});
    }else{
      top = _top + _height;
      $('.layui-colorpicker-main').css({"top":top + 16, "left":left});
      $('.layui-colorpicker-main').animate({top: top + 1});
    };
  };

  //颜色选择器移除
  Class.prototype.remove = function(index){
    var that = this
    ,options = that.config
    ,elem = $('#layui-colorpicker'+ (index || that.index));
    elem.remove();
    return that;
  };

  //颜色选择器显示隐藏
  Class.prototype.trigger = function(){
    var that = this
    ,options = that.config
    //绑定呼出控件事件
    ,showEvent = function(elem){
      elem.on('click' , function(){
        event.stopPropagation();
        that.show();
        if($('.layui-colorpicker-main').length){
          that.val($(this).find('.' + PICKER_TRIG_SPAN)[0]);
          that.side(that.index - 1);
          that.events(that.index - 1, $(this).find('.' + PICKER_TRIG_SPAN)[0].style.background);
        };   
      });
    }; 
    showEvent($(options.elem));
  };

  //颜色选择器赋值
  Class.prototype.val = function(e){
    var that = this
    ,options = that.config
    ,bgcolor = e.style.background;
    //判断是否有背景颜色
    if(bgcolor){
      //转化成hsb格式
      var hsb = RGBToHSB(RGBSTo(bgcolor));
      //同步滑块的位置及颜色选择器的选择
      that.select(hsb.h, hsb.s, hsb.b);
      //如果格式要求为rgb
      if($(e).hasClass('torgb')){
        $('.' + PICKER_INPUT).find('input').val(bgcolor);
      };
      //如果格式要求为rgba
      if($(e).hasClass('rgba')){
        var rgb = RGBSTo(bgcolor);
        //如果开启透明度而没有设置，则给默认值
        if(bgcolor.match(/[0-9]{1,3}/g).length == 3){
          $('.' + PICKER_INPUT).find('input').val('rgba('+ rgb.r +', '+ rgb.g +', '+ rgb.b +', 1)');
          $('.' + PICKER_ALPHA_SLIDER).css("left", 280);
        }else{
          $('.' + PICKER_INPUT).find('input').val(bgcolor);
          var left = bgcolor.slice(bgcolor.lastIndexOf(",") + 1, bgcolor.length - 1) * 280;
          $('.' + PICKER_ALPHA_SLIDER).css("left", left);
        };
        //设置span背景色
        $('.' + PICKER_ALPHA_BG)[0].style.background = 'linear-gradient(to right, rgba('+ rgb.r +', '+ rgb.g +', '+ rgb.b +', 0), rgb('+ rgb.r +', '+ rgb.g +', '+ rgb.b +'))';    
      };

    }else{
      //如果没有背景颜色则默认到最初始的状态
      that.select(0,100,100);
      $('.' + PICKER_INPUT).find('input').val("");
      $('.' + PICKER_ALPHA_BG)[0].style.background = '';
      $('.' + PICKER_ALPHA_SLIDER).css("left", 280);
    }
  };

  //颜色选择器滑动/点击
  Class.prototype.side = function(ind){
    var that = this
    ,options = that.config
    ,side = $('.' + PICKER_SIDE)
    ,slider = $('.' + PICKER_SIDE_SLIDER)
    ,basis = $('.' + PICKER_BASIS)
    ,choose = $('.' + PICKER_BASIS_CUR)
    ,alphacolor = $('.' + PICKER_ALPHA_BG)
    ,alphaslider = $('.' + PICKER_ALPHA_SLIDER)
    ,_h = slider[0].offsetTop/180*360
    ,_b = 100 - (choose[0].offsetTop + 3)/180*100
    ,_s = (choose[0].offsetLeft + 3)/260*100
    ,_a = Math.round(alphaslider[0].offsetLeft/280*100)/100
    ,span = $('.' + ELEM_VIEW).eq(ind).find('.' + PICKER_TRIG_SPAN)
    ,i = $('.' + ELEM_VIEW).eq(ind).find('.' + PICKER_TRIG_I)
    ,pre = $('.layui-colorpicker-main-pre').children('.colorpicker-pre').children('div')
    ,torgb,rgba
    ,change = function(x,y,z,a){
      that.select(x, y, z);
      var rgb = HSBToRGB({h:x, s:y, b:z});
      i.addClass(ICON_PICKER_DOWN).removeClass(ICON_PICKER_CLOSE);
      span[0].style.background = 'rgb('+ rgb.r +', '+ rgb.g +', '+ rgb.b +')';
      if(torgb){
        $('.' + PICKER_INPUT).find('input').val('rgb('+ rgb.r +', '+ rgb.g +', '+ rgb.b +')');
      };
      if(rgba){
        var left = 0;
        left = a * 280;
        alphaslider.css("left", left);
        $('.' + PICKER_INPUT).find('input').val('rgba('+ rgb.r +', '+ rgb.g +', '+ rgb.b +', '+ a +')');
        span[0].style.background = 'rgba('+ rgb.r +', '+ rgb.g +', '+ rgb.b +', '+ a +')';
        alphacolor[0].style.background = 'linear-gradient(to right, rgba('+ rgb.r +', '+ rgb.g +', '+ rgb.b +', 0), rgb('+ rgb.r +', '+ rgb.g +', '+ rgb.b +'))'
      };
      //回调更改的颜色
      options.change && options.change($('.' + PICKER_INPUT).find('input').val());
    }
    ,up = function(){
      document.onmousemove = null;
      document.onmouseup = null;
    };
    if(span.hasClass('torgb')) torgb = true;
    if(span.hasClass('rgba')) rgba = true;
    //右侧主色选择
    slider.on('mousedown', function(e){
      var oldtop = this.offsetTop
      ,oldy = e.clientY;
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
      document.onmousemove = move;
      document.onmouseup = up;
      e.preventDefault();
    });
    side.on('click', function(e){
      var top = e.clientY - $(this).offset().top;
      if(top < 0)top = 0;
      if(top > this.offsetHeight)top = this.offsetHeight;     
      var h = top/180*360;
      _h = h;
      change(h, _s, _b, _a); 
      e.preventDefault();
    })
    //中间颜色选择
    choose.on('mousedown', function(e){
      var oldtop = this.offsetTop
      ,oldleft = this.offsetLeft
      ,oldy = e.clientY
      ,oldx = e.clientX;
      var move = function(e){
        var top = oldtop + (e.clientY - oldy)
        ,left = oldleft + (e.clientX - oldx)
        ,maxh = basis[0].offsetHeight - 3
        ,maxw = basis[0].offsetWidth - 3;
        if(top < -3)top = -3;
        if(top > maxh)top = maxh;
        if(left < -3)left = -3;
        if(left > maxw)left = maxw;
        var s = (left + 3)/260*100
        ,b = 100 - (top + 3)/180*100;
        _b = b;
        _s = s;
        change(_h, s, b, _a); 
        e.preventDefault();
      };
      document.onmousemove = move;
      document.onmouseup = up;
      e.preventDefault();
    });
    basis.on('click', function(e){
      var top = e.clientY - $(this).offset().top - 3
      ,left = e.clientX - $(this).offset().left - 3
      if(top < -3)top = -3;
      if(top > this.offsetHeight - 3)top = this.offsetHeight - 3;
      if(left < -3)left = -3;
      if(left > this.offsetWidth - 3)left = this.offsetWidth - 3;
      var s = (left + 3)/260*100
      ,b = 100 - (top + 3)/180*100;
      _b = b;
      _s = s;
      change(_h, s, b, _a); 
      e.preventDefault();
    });
    //底部透明度选择
    alphaslider.on('mousedown', function(e){
      var oldleft = this.offsetLeft
      ,oldx = e.clientX;
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
      document.onmousemove = move;
      document.onmouseup = up;
      e.preventDefault();
    });
    alphacolor.on('click', function(e){
      var left = e.clientX - $(this).offset().left
      if(left < 0)left = 0;
      if(left > this.offsetWidth)left = this.offsetWidth;
      var a = Math.round(left /280*100) /100;
      _a = a;
      change(_h, _s, _b, a); 
      e.preventDefault();
    });
    //预定义颜色选择
    pre.each(function(){
      $(this).on('click', function(){
        $(this).parent('.colorpicker-pre').addClass('selected').siblings().removeClass('selected');
        var color = this.style.background
        ,hsb = RGBToHSB(RGBSTo(color))
        ,a = color.slice(color.lastIndexOf(",") + 1, color.length - 1),left;
        _h = hsb.h;
        _s = hsb.s;
        _b = hsb.b;
        if(color.match(/[0-9]{1,3}/g).length == 3) a = 1;
        _a = a;
        left = a * 280;
        change(hsb.h, hsb.s, hsb.b, a);
      })
    });
  };

  //颜色选择器hsb转换
  Class.prototype.select = function(h,s,b){
    var that = this
    ,options = that.config
    ,hex = HSBToHEX({h:h, s:100, b:100})
    ,color = HSBToHEX({h:h, s:s, b:b})
    ,sidetop = h/360*180
    ,top = 180 - b/100*180 - 3
    ,left = s/100*260 - 3;
    //滑块的top
    $('.' + PICKER_SIDE_SLIDER).css("top", sidetop);
    //颜色选择器的背景
    $('.' + PICKER_BASIS)[0].style.background = '#' + hex;
    //选择器的top left
    $('.' + PICKER_BASIS).find('.' + PICKER_BASIS_CUR).css({"top": top, "left": left});
    //选中的颜色
    $('.' + PICKER_INPUT).find('input').val('#' + color);
  };

  //颜色选择器输入
  Class.prototype.events = function(ind, color){
    var that = this
    ,options = that.config
    ,hide = function(){
      $('.' + PICKER_ALPHA_BG)[0].style.background = '';
      $('.' + ELEM_VIEW).eq(ind).find('.' + PICKER_TRIG_SPAN)[0].style.background = '';
      $('.' + ELEM_VIEW).eq(ind).find('.' + PICKER_TRIG_I).removeClass(ICON_PICKER_DOWN).addClass(ICON_PICKER_CLOSE);
    };
    //点击确认按钮
    $('.' + PICKER_INPUT).find('.confirm').on('click', function(){
      var value = $('.' + PICKER_INPUT).find('input').val()
      ,hsb = {};
      if(value.indexOf(',') > -1){
        hsb = RGBToHSB(RGBSTo(value));
        that.select(hsb.h, hsb.s, hsb.b);
        $('.' + PICKER_INPUT).find('input').val(value);
        $('.' + ELEM_VIEW).eq(ind).find('.' + PICKER_TRIG_SPAN)[0].style.background = '#' + HSBToHEX(hsb); 
        if(value.match(/[0-9]{1,3}/g).length > 3 && $('.' + ELEM_VIEW).eq(ind).find('.' + PICKER_TRIG_SPAN).hasClass('rgba')){
          var left = value.slice(value.lastIndexOf(",") + 1, value.length - 1) * 280;
          $('.' + PICKER_ALPHA_SLIDER).css("left", left);
          $('.' + ELEM_VIEW).eq(ind).find('.' + PICKER_TRIG_SPAN)[0].style.background = value;
        };
      }else{
        hsb = HEXToHSB(value);
        that.select(hsb.h, hsb.s, hsb.b);
        $('.' + ELEM_VIEW).eq(ind).find('.' + PICKER_TRIG_SPAN)[0].style.background = '#' + HSBToHEX(hsb); 
        $('.' + ELEM_VIEW).eq(ind).find('.' + PICKER_TRIG_I).removeClass(ICON_PICKER_CLOSE).addClass(ICON_PICKER_DOWN);
      };
      color = value;
      options.change && options.change($('.' + PICKER_INPUT).find('input').val());
      that.remove(ind + 1); 
    });
    //点击清空按钮
    $('.' + PICKER_INPUT).find('.empty').on('click', function(){
      hide();
      color = '';
      that.remove(ind + 1); 
    });
    //点击页面其他地方
    $(document).off().on('click', function(event){
      var main = $('.' + ELEM_MAIN)
      ,value = $('.' + PICKER_INPUT).find('input').val();
      if(!main.is(event.target) && main.has(event.target).length === 0 && main.length){
        if(!color){ hide(); }
        else{
          var hsb = RGBToHSB(RGBSTo(color));
          that.select(hsb.h, hsb.s, hsb.b); 
          $('.' + ELEM_VIEW).eq(ind).find('.' + PICKER_TRIG_SPAN)[0].style.background = color;
          if(value.indexOf(',') > -1){
            $('.' + PICKER_INPUT).find('input').val(color);
          };
        }; 
        that.remove(ind + 1);   
      }
    });
  };
  
  //核心入口
  colorpicker.render = function(options){
    var inst = new Class(options); 
  };
  
  exports(MOD_NAME, colorpicker);
})
