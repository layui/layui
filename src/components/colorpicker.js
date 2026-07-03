/**
 * colorpicker
 * 颜色选择组件
 */

import { lay } from '../core/lay.js';
import { i18n } from '../core/i18n.js';
import { $ } from 'jquery';
import { Component } from '../core/component.js';

const device = lay.device();
const clickOrMousedown = device.mobile ? 'click' : 'mousedown';

export class Colorpicker extends Component {
  static componentName = 'colorpicker';

  // 默认配置
  static options = {
    color: '', // 默认颜色，默认没有
    size: null, // 选择器大小
    alpha: false, // 是否开启透明度
    format: 'hex', // 颜色显示/输入格式，可选 rgb,hex
    predefine: false, // 预定义颜色是否开启
    colors: [
      // 默认预定义颜色列表
      '#16baaa',
      '#16b777',
      '#1E9FFF',
      '#FF5722',
      '#FFB800',
      '#01AAED',
      '#999',
      '#c00',
      '#ff8c00',
      '#ffd700',
      '#90ee90',
      '#00ced1',
      '#1e90ff',
      '#c71585',
      '#393D49',
      'rgb(0, 186, 189)',
      'rgb(255, 120, 0)',
      'rgb(250, 212, 0)',
      'rgba(0,0,0,.5)',
      'rgba(255, 69, 0, 0.68)',
      'rgba(144, 240, 144, 0.5)',
      'rgba(31, 147, 255, 0.73)',
    ],
  };

  static get CONST() {
    return {
      ...super.CONST,
      ELEM: 'lay-colorpicker',
      ELEM_MAIN: '.lay-colorpicker-main',
      ICON_PICKER_DOWN: 'lay-icon-down',
      ICON_PICKER_CLOSE: 'lay-icon-close',
      PICKER_TRIG_SPAN: 'lay-colorpicker-trigger-span',
      PICKER_TRIG_I: 'lay-colorpicker-trigger-i',
      PICKER_SIDE: 'lay-colorpicker-side',
      PICKER_SIDE_SLIDER: 'lay-colorpicker-side-slider',
      PICKER_BASIS: 'lay-colorpicker-basis',
      PICKER_ALPHA_BG: 'lay-colorpicker-alpha-bgcolor',
      PICKER_ALPHA_SLIDER: 'lay-colorpicker-alpha-slider',
      PICKER_BASIS_CUR: 'lay-colorpicker-basis-cursor',
      PICKER_INPUT: 'lay-colorpicker-main-input',
    };
  }

  constructor(options) {
    super({
      target: $('body'), // 目标对象。非文档化选项
      ...options,
    });

    this.stopClickOutsideEvent = $.noop;
    this.stopResizeEvent = $.noop;
    CONST.PICKER_OPENED = `${CONST.ATTR_ID}-opened`;
  }

  // 渲染
  render() {
    const options = this.options;

    // 颜色选择框对象
    const elemColorBox = $(`
<div class="lay-unselect lay-colorpicker">
  <span ${options.format == 'rgb' && options.alpha ? 'class="lay-colorpicker-trigger-bgcolor"' : ''}>
    <span
      class="lay-colorpicker-trigger-span"
      lay-type="${options.format == 'rgb' ? (options.alpha ? 'rgba' : 'torgb') : ''}"
      style="${(function () {
        let bgstr = '';
        if (options.color) {
          bgstr = options.color;

          if ((options.color.match(/[0-9]{1,3}/g) || []).length > 3) {
            //需要优化
            if (!(options.alpha && options.format == 'rgb')) {
              bgstr = `#${HSBToHEX(RGBToHSB(RGBSTo(options.color)))}`;
            }
          }

          return `background: ${bgstr}`;
        }
        return bgstr;
      })()}"
    >
      <i class="lay-icon lay-colorpicker-trigger-i ${options.color ? CONST.ICON_PICKER_DOWN : CONST.ICON_PICKER_CLOSE}"></i>
    </span>
  </span>
</div>
    `);

    // 初始化颜色选择框尺寸
    const $elem = options.$elem;
    options.size && elemColorBox.addClass(`lay-colorpicker-${options.size}`);

    // 插入颜色选择框
    $elem.addClass('lay-inline').html((this.$colorBoxElem = elemColorBox));

    // 获取背景色值
    this.color = this.$colorBoxElem.find(
      `.${CONST.PICKER_TRIG_SPAN}`,
    )[0].style.background;
    this.#events();
  }

  // 渲染颜色选择器
  #renderPicker() {
    const options = this.options;

    // 颜色选择器对象
    const $rootElem = (this.$rootElem = $(`
<div class="lay-anim lay-anim-downbit lay-colorpicker-main">
  <div class="lay-colorpicker-main-wrapper">
    <div class="lay-colorpicker-basis">
      <div class="lay-colorpicker-basis-white"></div>
      <div class="lay-colorpicker-basis-black"></div>
      <div class="lay-colorpicker-basis-cursor"></div>
    </div>
    <div class="lay-colorpicker-side">
      <div class="lay-colorpicker-side-slider"></div>
    </div>
  </div>
  <div class="lay-colorpicker-main-alpha ${options.alpha ? CONST.CLASS_SHOW : ''}">
    <div class="lay-colorpicker-alpha-bgcolor">
      <div class="lay-colorpicker-alpha-slider"></div>
    </div>
  </div>
  ${(function () {
    // 预设颜色列表
    if (options.predefine) {
      const list = ['<div class="lay-colorpicker-main-pre">'];
      options.colors.forEach(function (v) {
        list.push(
          [
            '<div class="lay-colorpicker-pre' +
              ((v.match(/[0-9]{1,3}/g) || []).length > 3
                ? ' lay-colorpicker-pre-isalpha'
                : '') +
              '">',
            `<div style="background:${v}"></div>`,
            '</div>',
          ].join(''),
        );
      });
      list.push('</div>');
      return list.join('');
    } else {
      return '';
    }
  })()}
  <div class="lay-colorpicker-main-input">
    <div class="lay-inline">
      <input type="text" class="lay-input">
    </div>
    <div class="lay-btn-group">
      <button style="border-radius: 0" class="lay-btn lay-btn-primary lay-btn-sm" colorpicker-events="clear">${i18n.$t('colorpicker.clear')}</button>
      <button style="border-radius: 0; border-left: 0" class="lay-btn lay-btn-primary lay-btn-sm" colorpicker-events="confirm">${i18n.$t('colorpicker.confirm')}</button>
    </div>
  </div>
</div>
    `));

    this.#removePicker(); // 若已存在则先移除
    $rootElem.attr(CONST.ATTR_ID, options.id);
    options.target.append($rootElem);
    options.$elem.data(CONST.PICKER_OPENED, true); // 面板已打开的标记

    this.#position();
    this.#pickerEvents();
    this.#onClickOutside();
    this.#autoUpdatePosition();
  }

  // 颜色选择器移除
  #removePicker() {
    const options = this.options;
    const $rootElem = this.$rootElem;

    this.stopClickOutsideEvent();
    this.stopResizeEvent();

    if ($rootElem[0]) {
      $rootElem.remove();
      options.$elem.removeData(CONST.PICKER_OPENED);

      // 面板关闭后的回调
      options.close?.(this.color);
    }

    return this;
  }

  // 面板定位
  #position() {
    const options = this.options;
    lay.position(this.bindElem || this.$colorBoxElem[0], this.$rootElem[0], {
      position: options.position,
      align: 'center',
    });
    return this;
  }

  // 颜色选择器赋值
  #val() {
    const elemColorBox = this.$colorBoxElem.find(`.${CONST.PICKER_TRIG_SPAN}`);
    const elemPickerInput = this.$rootElem.find(`.${CONST.PICKER_INPUT}`);
    const e = elemColorBox[0];
    const bgcolor = e.style.backgroundColor;

    // 判断是否有背景颜色
    if (bgcolor) {
      // 转化成 hsb 格式
      const hsb = RGBToHSB(RGBSTo(bgcolor));
      const type = elemColorBox.attr('lay-type');

      // 同步滑块的位置及颜色选择器的选择
      this.#select(hsb.h, hsb.s, hsb.b);

      // 若格式要求为rgb
      if (type === 'torgb') {
        elemPickerInput.find('input').val(bgcolor);
      } else if (type === 'rgba') {
        // 若格式要求为 rgba
        const rgb = RGBSTo(bgcolor);

        // 若开启透明度而没有设置，则给默认值
        if ((bgcolor.match(/[0-9]{1,3}/g) || []).length === 3) {
          elemPickerInput
            .find('input')
            .val(`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`);
          this.$rootElem.find(`.${CONST.PICKER_ALPHA_SLIDER}`).css('left', 280);
        } else {
          elemPickerInput.find('input').val(bgcolor);
          const left =
            bgcolor.slice(bgcolor.lastIndexOf(',') + 1, bgcolor.length - 1) *
            280;
          this.$rootElem
            .find(`.${CONST.PICKER_ALPHA_SLIDER}`)
            .css('left', left);
        }

        // 设置 span 背景色
        this.$rootElem.find(`.${CONST.PICKER_ALPHA_BG}`)[0].style.background =
          `linear-gradient(to right, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0), rgb(${rgb.r}, ${rgb.g}, ${rgb.b}))`;
      } else {
        elemPickerInput.find('input').val(`#${HSBToHEX(hsb)}`);
      }
    } else {
      // 若没有背景颜色则默认到最初始的状态
      this.#select(0, 100, 100);
      elemPickerInput.find('input').val('');
      this.$rootElem.find(`.${CONST.PICKER_ALPHA_BG}`)[0].style.background = '';
      this.$rootElem.find(`.${CONST.PICKER_ALPHA_SLIDER}`).css('left', 280);
    }
  }

  // 颜色选择器滑动 / 点击
  #side() {
    const options = this.options;
    const span = this.$colorBoxElem.find(`.${CONST.PICKER_TRIG_SPAN}`);
    const type = span.attr('lay-type');
    const side = this.$rootElem.find(`.${CONST.PICKER_SIDE}`);
    const slider = this.$rootElem.find(`.${CONST.PICKER_SIDE_SLIDER}`);
    const basis = this.$rootElem.find(`.${CONST.PICKER_BASIS}`);
    const choose = this.$rootElem.find(`.${CONST.PICKER_BASIS_CUR}`);
    const alphacolor = this.$rootElem.find(`.${CONST.PICKER_ALPHA_BG}`);
    const alphaslider = this.$rootElem.find(`.${CONST.PICKER_ALPHA_SLIDER}`);
    let _h = (slider[0].offsetTop / 180) * 360;
    let _b = 100 - (choose[0].offsetTop / 180) * 100;
    let _s = (choose[0].offsetLeft / 260) * 100;
    let _a = Math.round((alphaslider[0].offsetLeft / 280) * 100) / 100;
    const i = this.$colorBoxElem.find(`.${CONST.PICKER_TRIG_I}`);
    const pre = this.$rootElem.find('.lay-colorpicker-pre').children('div');
    const change = (x, y, z, a) => {
        this.#select(x, y, z);
        const rgb = HSBToRGB({ h: x, s: y, b: z });
        const color = HSBToHEX({ h: x, s: y, b: z });
        const elemInput = this.$rootElem
          .find(`.${CONST.PICKER_INPUT}`)
          .find('input');

        i.addClass(CONST.ICON_PICKER_DOWN).removeClass(CONST.ICON_PICKER_CLOSE);
        span[0].style.background = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

        if (type === 'torgb') {
          elemInput.val(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);
        } else if (type === 'rgba') {
          const left = a * 280;
          alphaslider.css('left', left);
          elemInput.val(`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${a})`);
          span[0].style.background = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${a})`;
          alphacolor[0].style.background = `linear-gradient(to right, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0), rgb(${rgb.r}, ${rgb.g}, ${rgb.b}))`;
        } else {
          elemInput.val(`#${color}`);
        }

        //回调更改的颜色
        options.change &&
          options.change(
            this.$rootElem
              .find(`.${CONST.PICKER_INPUT}`)
              .find('input')
              .val()
              .trim(),
          );
      },
      //拖拽元素
      elemMove = $(
        [
          '<div class="lay-auxiliar-moving" id="LAY-colorpicker-moving"></div>',
        ].join(''),
      ),
      createMoveElem = function (call) {
        $('#LAY-colorpicker-moving')[0] || $('body').append(elemMove);
        elemMove.on('mousemove', call);
        elemMove
          .on('mouseup', function () {
            elemMove.remove();
          })
          .on('mouseleave', function () {
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
        var h = (top / 180) * 360;
        _h = h;
        change(h, _s, _b, _a);
        e.preventDefault();
      };
      needStopPropagation && e.stopPropagation();
      createMoveElem(move);
      e.preventDefault();
    });

    side.on('mousedown', function (e) {
      var top = e.clientY - $(this).offset().top + $win.scrollTop();
      if (top < 0) top = 0;
      if (top > this.offsetHeight) top = this.offsetHeight;
      var h = (top / 180) * 360;
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
        var s = (left / 260) * 100,
          b = 100 - (top / 180) * 100;
        _b = b;
        _s = s;
        change(_h, s, b, _a);
        e.preventDefault();
      };
      needStopPropagation && e.stopPropagation();
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
      var s = (left / 260) * 100,
        b = 100 - (top / 180) * 100;
      _b = b;
      _s = s;
      change(_h, s, b, _a);
      e.stopPropagation();
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
        var a = Math.round((left / 280) * 100) / 100;
        _a = a;
        change(_h, _s, _b, a);
        e.preventDefault();
      };

      needStopPropagation && e.stopPropagation();
      createMoveElem(move);
      e.preventDefault();
    });
    alphacolor.on('mousedown', function (e) {
      var left = e.clientX - $(this).offset().left;
      if (left < 0) left = 0;
      if (left > this.offsetWidth) left = this.offsetWidth;
      var a = Math.round((left / 280) * 100) / 100;
      _a = a;
      change(_h, _s, _b, a);
      e.preventDefault();
      needTrigger && alphaslider.trigger('mousedown', e);
    });

    // 预定义颜色选择
    pre.each(function () {
      $(this).on('click', function () {
        $(this)
          .parent('.lay-colorpicker-pre')
          .addClass('selected')
          .siblings()
          .removeClass('selected');
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
    [
      { elem: side, eventType: 'mousedown' },
      { elem: alphacolor, eventType: 'mousedown' },
      { elem: basis, eventType: 'mousedown' },
    ].forEach(function (obj) {
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
        },
      });
    });
    function touchHandler(event, eventType) {
      var pointer = event.touches[0];
      var simulatedEvent = document.createEvent('MouseEvent');

      simulatedEvent.initMouseEvent(
        eventType,
        true,
        true,
        window,
        1,
        pointer.screenX,
        pointer.screenY,
        pointer.clientX,
        pointer.clientY,
        false,
        false,
        false,
        false,
        0,
        null,
      );
      pointer.target.dispatchEvent(simulatedEvent);
    }
  }

  // 颜色选择器 hsb 转换
  #select(h, s, b) {
    const hex = HSBToHEX({ h: h, s: 100, b: 100 });
    // var options = that.config;
    // var color = HSBToHEX({ h: h, s: s, b: b });
    const sidetop = (h / 360) * 180;
    const top = 180 - (b / 100) * 180;
    const left = (s / 100) * 260;
    const basisElem = this.$rootElem.find(`.${CONST.PICKER_BASIS}`)[0];

    this.$rootElem.find(`.${CONST.PICKER_SIDE_SLIDER}`).css('top', sidetop); //滑块的top
    basisElem.style.background = `#${hex}`; //颜色选择器的背景

    // 选择器的 top left
    this.$rootElem.find(`.${CONST.PICKER_BASIS_CUR}`).css({
      top: `${(top / basisElem.offsetHeight) * 100}%`,
      left: `${(left / basisElem.offsetWidth) * 100}%`,
    });

    // if(type === 'change') return;

    // 选中的颜色
    // that.$rootElem.find('.' + CONST.PICKER_INPUT).find('input').val('#'+ color);
  }

  #pickerEvents() {
    const options = this.options;

    const elemColorBoxSpan = this.$colorBoxElem.find(
      `.${CONST.PICKER_TRIG_SPAN}`,
    ); // 颜色盒子
    const elemPickerInput = this.$rootElem.find(`.${CONST.PICKER_INPUT} input`); // 颜色选择器表单

    const pickerEvents = {
      // 清空
      clear: () => {
        elemColorBoxSpan[0].style.background = '';
        this.$colorBoxElem
          .find(`.${CONST.PICKER_TRIG_I}`)
          .removeClass(CONST.ICON_PICKER_DOWN)
          .addClass(CONST.ICON_PICKER_CLOSE);
        this.color = '';

        options.done && options.done('');
        this.#removePicker();
      },

      // 确认
      confirm: (othis, change) => {
        let value = elemPickerInput.val().trim(),
          colorValue,
          hsb;

        if (value.indexOf(',') > -1) {
          hsb = RGBToHSB(RGBSTo(value));
          this.#select(hsb.h, hsb.s, hsb.b);
          elemColorBoxSpan[0].style.background =
            colorValue = `#${HSBToHEX(hsb)}`;

          if (
            (value.match(/[0-9]{1,3}/g) || []).length > 3 &&
            elemColorBoxSpan.attr('lay-type') === 'rgba'
          ) {
            const left =
              value.slice(value.lastIndexOf(',') + 1, value.length - 1) * 280;
            this.$rootElem
              .find(`.${CONST.PICKER_ALPHA_SLIDER}`)
              .css('left', left);
            elemColorBoxSpan[0].style.background = value;
            colorValue = value;
          }
        } else {
          hsb = HEXToHSB(value);
          elemColorBoxSpan[0].style.background =
            colorValue = `#${HSBToHEX(hsb)}`;
          this.$colorBoxElem
            .find(`.${CONST.PICKER_TRIG_I}`)
            .removeClass(CONST.ICON_PICKER_CLOSE)
            .addClass(CONST.ICON_PICKER_DOWN);
        }

        if (change === 'change') {
          this.#select(hsb.h, hsb.s, hsb.b, change);
          options.change && options.change(colorValue);
          return;
        }
        this.color = value;

        options.done && options.done(value);
        this.#removePicker();
      },
    };

    // 选择器面板点击事件
    this.$rootElem.on('click', '*[colorpicker-events]', function () {
      const othis = $(this);
      const attrEvent = othis.attr('colorpicker-events');
      pickerEvents[attrEvent] && pickerEvents[attrEvent].call(this, othis);
    });

    // 输入框事件
    elemPickerInput.on('keyup', function (e) {
      const othis = $(this);
      pickerEvents.confirm.call(
        this,
        othis,
        e.keyCode === 13 ? null : 'change',
      );
    });
  }

  // 事件
  #events() {
    const options = this.options;

    // 弹出颜色选择器
    this.$colorBoxElem.on('click', () => {
      // 主面板是否已打开
      const opened = options.$elem.data(CONST.PICKER_OPENED);

      // 根据主面板状态，自动切换打开与关闭
      if (opened) {
        this.#removePicker();
      } else {
        this.#renderPicker();
        this.#val();
        this.#side();
      }
    });
  }

  /**
   * 点击面板外部时的事件
   */
  #onClickOutside() {
    const options = this.options;

    this.stopClickOutsideEvent();

    const stop = lay.onClickOutside(
      this.$rootElem[0],
      () => {
        const elemColorBoxSpan = this.$colorBoxElem.find(
          `.${CONST.PICKER_TRIG_SPAN}`,
        );

        if (this.color) {
          const hsb = RGBToHSB(RGBSTo(this.color));
          this.#select(hsb.h, hsb.s, hsb.b);
        } else {
          this.$colorBoxElem
            .find(`.${CONST.PICKER_TRIG_I}`)
            .removeClass(CONST.ICON_PICKER_DOWN)
            .addClass(CONST.ICON_PICKER_CLOSE);
        }

        elemColorBoxSpan[0].style.background = this.color || '';

        // 取消选择的回调
        typeof options.cancel === 'function' && options.cancel(this.color);

        // 移除面板
        this.#removePicker();
      },
      {
        ignore: [options.$elem[0]],
        event: clickOrMousedown,
        capture: false,
      },
    );

    this.stopClickOutsideEvent = () => {
      stop();
      this.stopClickOutsideEvent = $.noop;
    };
  }

  /**
   * 窗口大小变化时自动更新位置
   */
  #autoUpdatePosition() {
    const eventNamespace = CONST.EVENT_NAMESPACE;

    this.stopResizeEvent();

    const windowResizeHandler = () => {
      this.#position();
    };

    $win.on(`resize${eventNamespace}`, windowResizeHandler);

    this.stopResizeEvent = () => {
      $win.off(`resize${eventNamespace}`, windowResizeHandler);
      this.stopResizeEvent = $.noop;
    };
  }
}

// RGB 转 HSB
const RGBToHSB = function (rgb) {
  const hsb = { h: 0, s: 0, b: 0 };
  const min = Math.min(rgb.r, rgb.g, rgb.b);
  const max = Math.max(rgb.r, rgb.g, rgb.b);
  const delta = max - min;
  hsb.b = max;
  hsb.s = max !== 0 ? (255 * delta) / max : 0;
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
const HEXToHSB = function (hex) {
  hex = hex.indexOf('#') > -1 ? hex.substring(1) : hex;
  if (hex.length === 3) {
    const num = hex.split('');
    hex = num[0] + num[0] + num[1] + num[1] + num[2] + num[2];
  }
  hex = parseInt(hex, 16);
  const rgb = { r: hex >> 16, g: (hex & 0x00ff00) >> 8, b: hex & 0x0000ff };
  return RGBToHSB(rgb);
};

// HSB 转 RGB
const HSBToRGB = function (hsb) {
  const rgb = {};
  let h = hsb.h;
  const s = (hsb.s * 255) / 100;
  const b = (hsb.b * 255) / 100;

  if (s === 0) {
    rgb.r = rgb.g = rgb.b = b;
  } else {
    const t1 = b;
    const t2 = ((255 - s) * b) / 255;
    const t3 = ((t1 - t2) * (h % 60)) / 60;
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
  return { r: Math.round(rgb.r), g: Math.round(rgb.g), b: Math.round(rgb.b) };
};

// HSB 转 HEX
const HSBToHEX = function (hsb) {
  const rgb = HSBToRGB(hsb);
  const hex = [rgb.r.toString(16), rgb.g.toString(16), rgb.b.toString(16)];
  $.each(hex, function (nr, val) {
    if (val.length === 1) {
      hex[nr] = `0${val}`;
    }
  });
  return hex.join('');
};

// 转化成所需 rgb 格式
const RGBSTo = function (rgbs) {
  const regexp = /[0-9]{1,3}/g;
  const re = rgbs.match(regexp) || [];
  return { r: re[0], g: re[1], b: re[2] };
};

const $win = $(window);
const CONST = Colorpicker.CONST;

export { Colorpicker as colorpicker };
