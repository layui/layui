import { layui } from '../core/layui.js';
import { lay } from '../core/lay.js';
import { i18n } from '../core/i18n.js';
import $ from 'jquery';
import { component as component$1 } from '../core/component.js';

/**
 * colorpicker
 * 颜色选择组件
 */

var device = layui.device();
var clickOrMousedown = device.mobile ? 'click' : 'mousedown';

// 创建组件
var component = component$1({
  name: 'colorpicker',
  // 默认配置
  config: {
    color: '',
    // 默认颜色，默认没有
    size: null,
    // 选择器大小
    alpha: false,
    // 是否开启透明度
    format: 'hex',
    // 颜色显示/输入格式，可选 rgb,hex
    predefine: false,
    // 预定义颜色是否开启
    colors: [
    // 默认预定义颜色列表
    '#16baaa', '#16b777', '#1E9FFF', '#FF5722', '#FFB800', '#01AAED', '#999', '#c00', '#ff8c00', '#ffd700', '#90ee90', '#00ced1', '#1e90ff', '#c71585', '#393D49', 'rgb(0, 186, 189)', 'rgb(255, 120, 0)', 'rgb(250, 212, 0)', 'rgba(0,0,0,.5)', 'rgba(255, 69, 0, 0.68)', 'rgba(144, 240, 144, 0.5)', 'rgba(31, 147, 255, 0.73)']
  },
  CONST: {
    ELEM: 'layui-colorpicker',
    ELEM_MAIN: '.layui-colorpicker-main',
    ICON_PICKER_DOWN: 'layui-icon-down',
    ICON_PICKER_CLOSE: 'layui-icon-close',
    PICKER_TRIG_SPAN: 'layui-colorpicker-trigger-span',
    PICKER_TRIG_I: 'layui-colorpicker-trigger-i',
    PICKER_SIDE: 'layui-colorpicker-side',
    PICKER_SIDE_SLIDER: 'layui-colorpicker-side-slider',
    PICKER_BASIS: 'layui-colorpicker-basis',
    PICKER_ALPHA_BG: 'layui-colorpicker-alpha-bgcolor',
    PICKER_ALPHA_SLIDER: 'layui-colorpicker-alpha-slider',
    PICKER_BASIS_CUR: 'layui-colorpicker-basis-cursor',
    PICKER_INPUT: 'layui-colorpicker-main-input'
  },
  // 初始化之前
  beforeInit: function () {
    var that = this;
    that.stopClickOutsideEvent = $.noop;
    that.stopResizeEvent = $.noop;
    CONST.PICKER_OPENED = CONST.MOD_ID + '-opened';
  },
  // 渲染之前
  beforeRender: function () {
    var that = this;
    var options = that.config;
    options.target = $('body'); // 后续考虑开放 target 元素
  },
  // 渲染
  render: function () {
    var that = this;
    var options = that.config;

    // 颜色选择框对象
    var elemColorBox = $(['<div class="layui-unselect layui-colorpicker">', '<span ' + (options.format == 'rgb' && options.alpha ? 'class="layui-colorpicker-trigger-bgcolor"' : '') + '>', '<span class="layui-colorpicker-trigger-span" ', 'lay-type="' + (options.format == 'rgb' ? options.alpha ? 'rgba' : 'torgb' : '') + '" ', 'style="' + function () {
      var bgstr = '';
      if (options.color) {
        bgstr = options.color;
        if ((options.color.match(/[0-9]{1,3}/g) || []).length > 3) {
          //需要优化
          if (!(options.alpha && options.format == 'rgb')) {
            bgstr = '#' + HSBToHEX(RGBToHSB(RGBSTo(options.color)));
          }
        }
        return 'background: ' + bgstr;
      }
      return bgstr;
    }() + '">', '<i class="layui-icon layui-colorpicker-trigger-i ' + (options.color ? CONST.ICON_PICKER_DOWN : CONST.ICON_PICKER_CLOSE) + '"></i>', '</span>', '</span>', '</div>'].join(''));

    // 初始化颜色选择框尺寸
    var elem = options.elem;
    options.size && elemColorBox.addClass('layui-colorpicker-' + options.size);

    // 插入颜色选择框
    elem.addClass('layui-inline').html(that.elemColorBox = elemColorBox);

    // 获取背景色值
    that.color = that.elemColorBox.find('.' + CONST.PICKER_TRIG_SPAN)[0].style.background;
  }
});

// RGB 转 HSB
var RGBToHSB = function (rgb) {
  var hsb = {
    h: 0,
    s: 0,
    b: 0
  };
  var min = Math.min(rgb.r, rgb.g, rgb.b);
  var max = Math.max(rgb.r, rgb.g, rgb.b);
  var delta = max - min;
  hsb.b = max;
  hsb.s = max !== 0 ? 255 * delta / max : 0;
  if (hsb.s !== 0) {
    if (rgb.r == max) {
      // 因 rgb 中返回的数字为 string 类型
      hsb.h = (rgb.g - rgb.b) / delta;
    } else if (rgb.g == max) {
      hsb.h = 2 + (rgb.b - rgb.r) / delta;
    } else {
      hsb.h = 4 + (rgb.r - rgb.g) / delta;
    }
  } else {
    hsb.h = -1;
  }
  if (max === min) {
    hsb.h = 0;
  }
  hsb.h *= 60;
  if (hsb.h < 0) {
    hsb.h += 360;
  }
  hsb.s *= 100 / 255;
  hsb.b *= 100 / 255;
  return hsb;
};

// HEX 转 HSB
var HEXToHSB = function (hex) {
  hex = hex.indexOf('#') > -1 ? hex.substring(1) : hex;
  if (hex.length === 3) {
    var num = hex.split('');
    hex = num[0] + num[0] + num[1] + num[1] + num[2] + num[2];
  }
  hex = parseInt(hex, 16);
  var rgb = {
    r: hex >> 16,
    g: (hex & 0x00ff00) >> 8,
    b: hex & 0x0000ff
  };
  return RGBToHSB(rgb);
};

// HSB 转 RGB
var HSBToRGB = function (hsb) {
  var rgb = {};
  var h = hsb.h;
  var s = hsb.s * 255 / 100;
  var b = hsb.b * 255 / 100;
  if (s === 0) {
    rgb.r = rgb.g = rgb.b = b;
  } else {
    var t1 = b;
    var t2 = (255 - s) * b / 255;
    var t3 = (t1 - t2) * (h % 60) / 60;
    if (h === 360) h = 0;
    if (h < 60) {
      rgb.r = t1;
      rgb.b = t2;
      rgb.g = t2 + t3;
    } else if (h < 120) {
      rgb.g = t1;
      rgb.b = t2;
      rgb.r = t1 - t3;
    } else if (h < 180) {
      rgb.g = t1;
      rgb.r = t2;
      rgb.b = t2 + t3;
    } else if (h < 240) {
      rgb.b = t1;
      rgb.r = t2;
      rgb.g = t1 - t3;
    } else if (h < 300) {
      rgb.b = t1;
      rgb.g = t2;
      rgb.r = t2 + t3;
    } else if (h < 360) {
      rgb.r = t1;
      rgb.g = t2;
      rgb.b = t1 - t3;
    } else {
      rgb.r = 0;
      rgb.g = 0;
      rgb.b = 0;
    }
  }
  return {
    r: Math.round(rgb.r),
    g: Math.round(rgb.g),
    b: Math.round(rgb.b)
  };
};

// HSB 转 HEX
var HSBToHEX = function (hsb) {
  var rgb = HSBToRGB(hsb);
  var hex = [rgb.r.toString(16), rgb.g.toString(16), rgb.b.toString(16)];
  $.each(hex, function (nr, val) {
    if (val.length === 1) {
      hex[nr] = '0' + val;
    }
  });
  return hex.join('');
};

// 转化成所需 rgb 格式
var RGBSTo = function (rgbs) {
  var regexp = /[0-9]{1,3}/g;
  var re = rgbs.match(regexp) || [];
  return {
    r: re[0],
    g: re[1],
    b: re[2]
  };
};
var $win = $(window);
// var $doc = $(document);

var CONST = component.CONST;

/**
 * 扩展组件原型方法
 */

var Class = component.Class;

// 渲染颜色选择器
Class.prototype.renderPicker = function () {
  var that = this;
  var options = that.config;

  // 颜色选择器对象
  var elemPicker = that.elemPicker = $(['<div id="layui-colorpicker' + that.index + '" data-index="' + that.index + '" class="layui-anim layui-anim-downbit layui-colorpicker-main">',
  //颜色面板
  '<div class="layui-colorpicker-main-wrapper">', '<div class="layui-colorpicker-basis">', '<div class="layui-colorpicker-basis-white"></div>', '<div class="layui-colorpicker-basis-black"></div>', '<div class="layui-colorpicker-basis-cursor"></div>', '</div>', '<div class="layui-colorpicker-side">', '<div class="layui-colorpicker-side-slider"></div>', '</div>', '</div>',
  //透明度条块
  '<div class="layui-colorpicker-main-alpha ' + (options.alpha ? CONST.CLASS_SHOW : '') + '">', '<div class="layui-colorpicker-alpha-bgcolor">', '<div class="layui-colorpicker-alpha-slider"></div>', '</div>', '</div>',
  //预设颜色列表
  function () {
    if (options.predefine) {
      var list = ['<div class="layui-colorpicker-main-pre">'];
      layui.each(options.colors, function (i, v) {
        list.push(['<div class="layui-colorpicker-pre' + ((v.match(/[0-9]{1,3}/g) || []).length > 3 ? ' layui-colorpicker-pre-isalpha' : '') + '">', '<div style="background:' + v + '"></div>', '</div>'].join(''));
      });
      list.push('</div>');
      return list.join('');
    } else {
      return '';
    }
  }(),
  //底部表单元素区域
  '<div class="layui-colorpicker-main-input">', '<div class="layui-inline">', '<input type="text" class="layui-input">', '</div>', '<div class="layui-btn-group">', '<button style="border-radius: 0" class="layui-btn layui-btn-primary layui-btn-sm" colorpicker-events="clear">' + i18n.$t('colorpicker.clear') + '</button>', '<button style="border-radius: 0; border-left: 0" class="layui-btn layui-btn-primary layui-btn-sm" colorpicker-events="confirm">' + i18n.$t('colorpicker.confirm') + '</button>', '</div', '</div>', '</div>'].join(''));
  that.removePicker(options.id); // 若已存在则先移除
  options.target.append(elemPicker);
  options.elem.data(CONST.PICKER_OPENED, true); // 面板已打开的标记

  that.position();
  that.pickerEvents();
  that.onClickOutside();
  that.autoUpdatePosition();
};

// 颜色选择器移除
Class.prototype.removePicker = function (index) {
  var that = this;
  var options = that.config;
  var elem = $('#layui-colorpicker' + (index || that.index));
  that.stopClickOutsideEvent();
  that.stopResizeEvent();
  if (elem[0]) {
    elem.remove();
    options.elem.removeData(CONST.PICKER_OPENED);

    // 面板关闭后的回调
    typeof options.close === 'function' && options.close(that.color);
  }
  return that;
};

// 面板定位
Class.prototype.position = function () {
  var that = this;
  var options = that.config;
  lay.position(that.bindElem || that.elemColorBox[0], that.elemPicker[0], {
    position: options.position,
    align: 'center'
  });
  return that;
};

// 颜色选择器赋值
Class.prototype.val = function () {
  var that = this,
    // options = that.config,
    elemColorBox = that.elemColorBox.find('.' + CONST.PICKER_TRIG_SPAN),
    elemPickerInput = that.elemPicker.find('.' + CONST.PICKER_INPUT),
    e = elemColorBox[0],
    bgcolor = e.style.backgroundColor;

  // 判断是否有背景颜色
  if (bgcolor) {
    // 转化成 hsb 格式
    var hsb = RGBToHSB(RGBSTo(bgcolor));
    var type = elemColorBox.attr('lay-type');

    // 同步滑块的位置及颜色选择器的选择
    that.select(hsb.h, hsb.s, hsb.b);

    // 若格式要求为rgb
    if (type === 'torgb') {
      elemPickerInput.find('input').val(bgcolor);
    } else if (type === 'rgba') {
      // 若格式要求为 rgba
      var rgb = RGBSTo(bgcolor);

      // 若开启透明度而没有设置，则给默认值
      if ((bgcolor.match(/[0-9]{1,3}/g) || []).length === 3) {
        elemPickerInput.find('input').val('rgba(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ', 1)');
        that.elemPicker.find('.' + CONST.PICKER_ALPHA_SLIDER).css('left', 280);
      } else {
        elemPickerInput.find('input').val(bgcolor);
        var left = bgcolor.slice(bgcolor.lastIndexOf(',') + 1, bgcolor.length - 1) * 280;
        that.elemPicker.find('.' + CONST.PICKER_ALPHA_SLIDER).css('left', left);
      }

      // 设置 span 背景色
      that.elemPicker.find('.' + CONST.PICKER_ALPHA_BG)[0].style.background = 'linear-gradient(to right, rgba(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ', 0), rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + '))';
    } else {
      elemPickerInput.find('input').val('#' + HSBToHEX(hsb));
    }
  } else {
    // 若没有背景颜色则默认到最初始的状态
    that.select(0, 100, 100);
    elemPickerInput.find('input').val('');
    that.elemPicker.find('.' + CONST.PICKER_ALPHA_BG)[0].style.background = '';
    that.elemPicker.find('.' + CONST.PICKER_ALPHA_SLIDER).css('left', 280);
  }
};

// 颜色选择器滑动 / 点击
Class.prototype.side = function () {
  var that = this,
    options = that.config,
    span = that.elemColorBox.find('.' + CONST.PICKER_TRIG_SPAN),
    type = span.attr('lay-type'),
    side = that.elemPicker.find('.' + CONST.PICKER_SIDE),
    slider = that.elemPicker.find('.' + CONST.PICKER_SIDE_SLIDER),
    basis = that.elemPicker.find('.' + CONST.PICKER_BASIS),
    choose = that.elemPicker.find('.' + CONST.PICKER_BASIS_CUR),
    alphacolor = that.elemPicker.find('.' + CONST.PICKER_ALPHA_BG),
    alphaslider = that.elemPicker.find('.' + CONST.PICKER_ALPHA_SLIDER),
    _h = slider[0].offsetTop / 180 * 360,
    _b = 100 - choose[0].offsetTop / 180 * 100,
    _s = choose[0].offsetLeft / 260 * 100,
    _a = Math.round(alphaslider[0].offsetLeft / 280 * 100) / 100,
    i = that.elemColorBox.find('.' + CONST.PICKER_TRIG_I),
    pre = that.elemPicker.find('.layui-colorpicker-pre').children('div'),
    change = function (x, y, z, a) {
      that.select(x, y, z);
      var rgb = HSBToRGB({
        h: x,
        s: y,
        b: z
      });
      var color = HSBToHEX({
        h: x,
        s: y,
        b: z
      });
      var elemInput = that.elemPicker.find('.' + CONST.PICKER_INPUT).find('input');
      i.addClass(CONST.ICON_PICKER_DOWN).removeClass(CONST.ICON_PICKER_CLOSE);
      span[0].style.background = 'rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')';
      if (type === 'torgb') {
        elemInput.val('rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')');
      } else if (type === 'rgba') {
        var left = a * 280;
        alphaslider.css('left', left);
        elemInput.val('rgba(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ', ' + a + ')');
        span[0].style.background = 'rgba(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ', ' + a + ')';
        alphacolor[0].style.background = 'linear-gradient(to right, rgba(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ', 0), rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + '))';
      } else {
        elemInput.val('#' + color);
      }

      //回调更改的颜色
      options.change && options.change($.trim(that.elemPicker.find('.' + CONST.PICKER_INPUT).find('input').val()));
    },
    //拖拽元素
    elemMove = $(['<div class="layui-auxiliar-moving" id="LAY-colorpicker-moving"></div>'].join('')),
    createMoveElem = function (call) {
      $('#LAY-colorpicker-moving')[0] || $('body').append(elemMove);
      elemMove.on('mousemove', call);
      elemMove.on('mouseup', function () {
        elemMove.remove();
      }).on('mouseleave', function () {
        elemMove.remove();
      });
    };
  // 移动端滑动模拟事件中
  // 1. 不触发游标上绑定的事件，以提高性能，使滑动更流畅
  // 2. 游标上的事件需要冒泡到颜色拾取区域，用来模拟拖动游标的效果
  var needTrigger = true;
  var needStopPropagation = true;

  //右侧主色选择
  slider.on('mousedown', function (e, triggerEvent) {
    var oldtop = this.offsetTop;
    var oldy = e.clientY === undefined ? triggerEvent.clientY : e.clientY;
    var move = function (e) {
      var top = oldtop + (e.clientY - oldy),
        maxh = side[0].offsetHeight;
      if (top < 0) top = 0;
      if (top > maxh) top = maxh;
      var h = top / 180 * 360;
      _h = h;
      change(h, _s, _b, _a);
      e.preventDefault();
    };
    needStopPropagation && layui.stope(e);
    createMoveElem(move);
    e.preventDefault();
  });
  side.on('mousedown', function (e) {
    var top = e.clientY - $(this).offset().top + $win.scrollTop();
    if (top < 0) top = 0;
    if (top > this.offsetHeight) top = this.offsetHeight;
    var h = top / 180 * 360;
    _h = h;
    change(h, _s, _b, _a);
    e.preventDefault();
    needTrigger && slider.trigger('mousedown', e);
  });

  //中间小圆点颜色选择
  choose.on('mousedown', function (e, triggerEvent) {
    var oldtop = this.offsetTop;
    var oldleft = this.offsetLeft;
    var oldy = e.clientY === undefined ? triggerEvent.clientY : e.clientY;
    var oldx = e.clientX === undefined ? triggerEvent.clientX : e.clientX;
    var move = function (e) {
      var top = oldtop + (e.clientY - oldy),
        left = oldleft + (e.clientX - oldx),
        maxh = basis[0].offsetHeight,
        maxw = basis[0].offsetWidth;
      if (top < 0) top = 0;
      if (top > maxh) top = maxh;
      if (left < 0) left = 0;
      if (left > maxw) left = maxw;
      var s = left / 260 * 100,
        b = 100 - top / 180 * 100;
      _b = b;
      _s = s;
      change(_h, s, b, _a);
      e.preventDefault();
    };
    needStopPropagation && layui.stope(e);
    createMoveElem(move);
    e.preventDefault();
  });
  basis.on('mousedown', function (e) {
    var top = e.clientY - $(this).offset().top + $win.scrollTop(),
      left = e.clientX - $(this).offset().left + $win.scrollLeft();
    if (top < 0) top = 0;
    if (top > this.offsetHeight) top = this.offsetHeight;
    if (left < 0) left = 0;
    if (left > this.offsetWidth) left = this.offsetWidth;
    var s = left / 260 * 100,
      b = 100 - top / 180 * 100;
    _b = b;
    _s = s;
    change(_h, s, b, _a);
    layui.stope(e);
    e.preventDefault();
    needTrigger && choose.trigger('mousedown', e);
  });

  //底部透明度选择
  alphaslider.on('mousedown', function (e, triggerEvent) {
    var oldleft = this.offsetLeft;
    var oldx = e.clientX === undefined ? triggerEvent.clientX : e.clientX;
    var move = function (e) {
      var left = oldleft + (e.clientX - oldx),
        maxw = alphacolor[0].offsetWidth;
      if (left < 0) left = 0;
      if (left > maxw) left = maxw;
      var a = Math.round(left / 280 * 100) / 100;
      _a = a;
      change(_h, _s, _b, a);
      e.preventDefault();
    };
    needStopPropagation && layui.stope(e);
    createMoveElem(move);
    e.preventDefault();
  });
  alphacolor.on('mousedown', function (e) {
    var left = e.clientX - $(this).offset().left;
    if (left < 0) left = 0;
    if (left > this.offsetWidth) left = this.offsetWidth;
    var a = Math.round(left / 280 * 100) / 100;
    _a = a;
    change(_h, _s, _b, a);
    e.preventDefault();
    needTrigger && alphaslider.trigger('mousedown', e);
  });

  // 预定义颜色选择
  pre.each(function () {
    $(this).on('click', function () {
      $(this).parent('.layui-colorpicker-pre').addClass('selected').siblings().removeClass('selected');
      var color = this.style.backgroundColor,
        hsb = RGBToHSB(RGBSTo(color)),
        a = color.slice(color.lastIndexOf(',') + 1, color.length - 1);
      // var left;
      _h = hsb.h;
      _s = hsb.s;
      _b = hsb.b;
      if ((color.match(/[0-9]{1,3}/g) || []).length === 3) a = 1;
      _a = a;
      // left = a * 280;
      change(hsb.h, hsb.s, hsb.b, a);
    });
  });
  if (!lay.touchEventsSupported()) return;
  // 触摸事件模拟
  layui.each([{
    elem: side,
    eventType: 'mousedown'
  }, {
    elem: alphacolor,
    eventType: 'mousedown'
  }, {
    elem: basis,
    eventType: 'mousedown'
  }], function (i, obj) {
    lay.touchSwipe(obj.elem, {
      onTouchStart: function () {
        needTrigger = false;
        needStopPropagation = false;
      },
      onTouchMove: function (e) {
        touchHandler(e, obj.eventType);
      },
      onTouchEnd: function () {
        elemMove.remove();
        needTrigger = true;
        needStopPropagation = true;
      }
    });
  });
  function touchHandler(event, eventType) {
    var pointer = event.touches[0];
    var simulatedEvent = document.createEvent('MouseEvent');
    simulatedEvent.initMouseEvent(eventType, true, true, window, 1, pointer.screenX, pointer.screenY, pointer.clientX, pointer.clientY, false, false, false, false, 0, null);
    pointer.target.dispatchEvent(simulatedEvent);
  }
};

// 颜色选择器hsb转换
Class.prototype.select = function (h, s, b) {
  var that = this;
  // var options = that.config;
  var hex = HSBToHEX({
    h: h,
    s: 100,
    b: 100
  });
  // var color = HSBToHEX({ h: h, s: s, b: b });
  var sidetop = h / 360 * 180;
  var top = 180 - b / 100 * 180;
  var left = s / 100 * 260;
  var basisElem = that.elemPicker.find('.' + CONST.PICKER_BASIS)[0];
  that.elemPicker.find('.' + CONST.PICKER_SIDE_SLIDER).css('top', sidetop); //滑块的top
  basisElem.style.background = '#' + hex; //颜色选择器的背景

  //选择器的top left
  that.elemPicker.find('.' + CONST.PICKER_BASIS_CUR).css({
    top: top / basisElem.offsetHeight * 100 + '%',
    left: left / basisElem.offsetWidth * 100 + '%'
  });

  // if(type === 'change') return;

  // 选中的颜色
  // that.elemPicker.find('.' + CONST.PICKER_INPUT).find('input').val('#'+ color);
};
Class.prototype.pickerEvents = function () {
  var that = this;
  var options = that.config;
  var elemColorBoxSpan = that.elemColorBox.find('.' + CONST.PICKER_TRIG_SPAN); //颜色盒子
  var elemPickerInput = that.elemPicker.find('.' + CONST.PICKER_INPUT + ' input'); //颜色选择器表单

  var pickerEvents = {
    // 清空
    clear: function () {
      elemColorBoxSpan[0].style.background = '';
      that.elemColorBox.find('.' + CONST.PICKER_TRIG_I).removeClass(CONST.ICON_PICKER_DOWN).addClass(CONST.ICON_PICKER_CLOSE);
      that.color = '';
      options.done && options.done('');
      that.removePicker();
    },
    //确认
    confirm: function (othis, change) {
      var value = $.trim(elemPickerInput.val()),
        colorValue,
        hsb;
      if (value.indexOf(',') > -1) {
        hsb = RGBToHSB(RGBSTo(value));
        that.select(hsb.h, hsb.s, hsb.b);
        elemColorBoxSpan[0].style.background = colorValue = '#' + HSBToHEX(hsb);
        if ((value.match(/[0-9]{1,3}/g) || []).length > 3 && elemColorBoxSpan.attr('lay-type') === 'rgba') {
          var left = value.slice(value.lastIndexOf(',') + 1, value.length - 1) * 280;
          that.elemPicker.find('.' + CONST.PICKER_ALPHA_SLIDER).css('left', left);
          elemColorBoxSpan[0].style.background = value;
          colorValue = value;
        }
      } else {
        hsb = HEXToHSB(value);
        elemColorBoxSpan[0].style.background = colorValue = '#' + HSBToHEX(hsb);
        that.elemColorBox.find('.' + CONST.PICKER_TRIG_I).removeClass(CONST.ICON_PICKER_CLOSE).addClass(CONST.ICON_PICKER_DOWN);
      }
      if (change === 'change') {
        that.select(hsb.h, hsb.s, hsb.b, change);
        options.change && options.change(colorValue);
        return;
      }
      that.color = value;
      options.done && options.done(value);
      that.removePicker();
    }
  };

  // 选择器面板点击事件
  that.elemPicker.on('click', '*[colorpicker-events]', function () {
    var othis = $(this),
      attrEvent = othis.attr('colorpicker-events');
    pickerEvents[attrEvent] && pickerEvents[attrEvent].call(this, othis);
  });

  // 输入框事件
  elemPickerInput.on('keyup', function (e) {
    var othis = $(this);
    pickerEvents.confirm.call(this, othis, e.keyCode === 13 ? null : 'change');
  });
};

// 事件
Class.prototype.events = function () {
  var that = this;
  var options = that.config;

  // 弹出颜色选择器
  that.elemColorBox.on('click', function () {
    // 主面板是否已打开
    var opened = options.elem.data(CONST.PICKER_OPENED);

    // 根据主面板状态，自动切换打开与关闭
    if (opened) {
      that.removePicker();
    } else {
      that.renderPicker();
      that.val();
      that.side();
    }
  });
};

/**
 * 点击面板外部时的事件
 */
Class.prototype.onClickOutside = function () {
  var that = this;
  var options = that.config;
  that.stopClickOutsideEvent();
  var stop = lay.onClickOutside(that.elemPicker[0], function () {
    var elemColorBoxSpan = that.elemColorBox.find('.' + CONST.PICKER_TRIG_SPAN);
    if (that.color) {
      var hsb = RGBToHSB(RGBSTo(that.color));
      that.select(hsb.h, hsb.s, hsb.b);
    } else {
      that.elemColorBox.find('.' + CONST.PICKER_TRIG_I).removeClass(CONST.ICON_PICKER_DOWN).addClass(CONST.ICON_PICKER_CLOSE);
    }
    elemColorBoxSpan[0].style.background = that.color || '';

    // 取消选择的回调
    typeof options.cancel === 'function' && options.cancel(that.color);

    // 移除面板
    that.removePicker();
  }, {
    ignore: [options.elem[0]],
    event: clickOrMousedown,
    capture: false
  });
  that.stopClickOutsideEvent = function () {
    stop();
    that.stopClickOutsideEvent = $.noop;
  };
};

/**
 * 窗口大小变化时自动更新位置
 */
Class.prototype.autoUpdatePosition = function () {
  var that = this;
  // var options = that.config;
  var RESIZE_EVENT_NAME = 'resize.lay_colorpicker_resize';
  that.stopResizeEvent();
  var windowResizeHandler = function () {
    that.position();
  };
  $win.on(RESIZE_EVENT_NAME, windowResizeHandler);
  that.stopResizeEvent = function () {
    $win.off(RESIZE_EVENT_NAME, windowResizeHandler);
    that.stopResizeEvent = $.noop;
  };
};

export { component as colorpicker };
