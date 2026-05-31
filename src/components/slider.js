/**
 * slider 滑块组件
 */

import { lay } from '../core/lay.js';
import { $ } from 'jquery';
import { Component } from '../core/component.js';

export class Slider extends Component {
  static options = {
    type: 'default', // 滑块类型，垂直： vertical
    min: 0, // 最小值
    max: 100, // 最大值，默认 100
    value: 0, // 初始值，默认为 0
    step: 1, // 间隔值
    showstep: false, // 间隔点开启
    tips: true, // 文字提示，开启
    tipsAlways: false, // 文字提示，始终开启
    input: false, // 输入框，关闭
    range: false, // 范围选择，与输入框不能同时开启，默认关闭
    height: 200, // 配合 type: "vertical" 使用，默认 200px
    disabled: false, // 滑块禁用，默认关闭
    theme: '#16baaa', // 主题颜色
  };

  static get CONST() {
    return {
      ...super.CONST,
      ELEM_VIEW: 'lay-slider',
      SLIDER_BAR: 'lay-slider-bar',
      SLIDER_WRAP: 'lay-slider-wrap',
      SLIDER_WRAP_BTN: 'lay-slider-wrap-btn',
      SLIDER_TIPS: 'lay-slider-tips',
      SLIDER_INPUT: 'lay-slider-input',
      SLIDER_INPUT_TXT: 'lay-slider-input-txt',
      SLIDER_INPUT_BTN: 'lay-slider-input-btn',
      ELEM_HOVER: 'lay-slider-hover',
    };
  }

  static render(options) {
    const elem = $(options?.elem);
    const attrId = this.CONST.ATTR_ID;

    if (elem.length === 1 && elem.attr(attrId)) {
      const inst = this.getInst(elem.attr(attrId));
      if (inst) {
        return inst.reload(options);
      }
    }

    return super.render(options);
  }

  render() {
    const options = this.options;
    let scale;
    let scaleFir;
    let scaleSec;

    // 间隔值不能小于等于 0
    if (options.step <= 0) options.step = 1;

    // 最大值不能小于最小值
    if (options.max < options.min) options.max = options.min + options.step;

    // 判断是否开启双滑块
    if (options.range) {
      options.value =
        typeof options.value == 'object'
          ? options.value
          : [options.min, options.value];
      const minValue = Math.min(options.value[0], options.value[1]);
      const maxValue = Math.max(options.value[0], options.value[1]);
      options.value[0] = Math.max(minValue, options.min);
      options.value[1] = Math.max(maxValue, options.min);
      options.value[0] = Math.min(options.value[0], options.max);
      options.value[1] = Math.min(options.value[1], options.max);

      scaleFir =
        ((options.value[0] - options.min) / (options.max - options.min)) * 100;
      scaleSec =
        ((options.value[1] - options.min) / (options.max - options.min)) * 100;
      scale = `${scaleSec - scaleFir}%`;
      scaleFir = `${scaleFir}%`;
      scaleSec = `${scaleSec}%`;
    } else {
      // 如果初始值是一个数组，则获取数组的最小值
      if (typeof options.value == 'object') {
        options.value = Math.min.apply(null, options.value);
      }

      // 初始值不能小于最小值且不能大于最大值
      if (options.value < options.min) options.value = options.min;
      if (options.value > options.max) options.value = options.max;

      scale = `${((options.value - options.min) / (options.max - options.min)) * 100}%`;
    }

    // 如果禁用，颜色为统一的灰色
    const theme = options.disabled ? '#c2c2c2' : options.theme;

    // 滑块
    const positionStyle = options.type === 'vertical' ? 'bottom' : 'left';
    const scaleStyle = options.type === 'vertical' ? 'height' : 'width';
    const template = `
<div class="lay-slider ${options.type === 'vertical' ? 'lay-slider-vertical' : ''}">
  ${
    options.tips
      ? `<div class="${CONST.SLIDER_TIPS}" ${options.tipsAlways ? '' : 'style="display:none;"'}></div>`
      : ''
  }
  <div class="lay-slider-bar" style="background:${theme}; ${scaleStyle}:${scale};${positionStyle}:${scaleFir || 0};"></div>
  <div class="lay-slider-wrap" style="${positionStyle}:${scaleFir || scale};">
    <div class="lay-slider-wrap-btn" style="border: 2px solid ${theme};"></div>
  </div>
  ${
    options.range
      ? `<div class="lay-slider-wrap" style="${positionStyle}:${scaleSec};"><div class="lay-slider-wrap-btn" style="border: 2px solid ${theme};"></div></div>`
      : ''
  }
</div>
    `;

    const $elem = options.$elem;

    // 生成组件元素
    this.$rootElem = $(template);

    // 把数据缓存到滑块上
    if (options.range) {
      this.$rootElem
        .find('.' + CONST.SLIDER_WRAP)
        .eq(0)
        .data('value', options.value[0]);
      this.$rootElem
        .find('.' + CONST.SLIDER_WRAP)
        .eq(1)
        .data('value', options.value[1]);
    } else {
      this.$rootElem.find('.' + CONST.SLIDER_WRAP).data('value', options.value);
    }

    // 插入组件元素
    $elem.html(this.$rootElem);

    // 垂直滑块
    if (options.type === 'vertical') {
      this.$rootElem.height(`${options.height}px`);
    }

    // 显示间断点
    if (options.showstep) {
      const number = (options.max - options.min) / options.step;
      let item = '';
      for (let i = 1; i < number + 1; i++) {
        const step = (i * 100) / number;
        if (step < 100) {
          item += `<div class="lay-slider-step" style="${positionStyle}:${step}%"></div>`;
        }
      }
      this.$rootElem.append(item);
    }

    // 插入输入框
    if (options.input && !options.range) {
      const elemInput = $(
        '<div class="lay-slider-input"><div class="lay-slider-input-txt"><input type="text" class="lay-input"></div><div class="lay-slider-input-btn"><i class="lay-icon lay-icon-up"></i><i class="lay-icon lay-icon-down"></i></div></div>',
      );
      $elem.css('position', 'relative');
      $elem.append(elemInput);
      $elem
        .find('.' + CONST.SLIDER_INPUT_TXT)
        .children('input')
        .val(options.value);
      if (options.type === 'vertical') {
        elemInput.css({
          left: 0,
          top: -48,
        });
      } else {
        this.$rootElem.css('margin-right', elemInput.outerWidth() + 15);
      }
    }

    // 给未禁止的滑块滑动事件
    if (!options.disabled) {
      this.#slide();
    } else {
      this.$rootElem.addClass(CONST.CLASS_DISABLED);
      this.$rootElem
        .find('.' + CONST.SLIDER_WRAP_BTN)
        .addClass(CONST.CLASS_DISABLED);
    }

    /**
     * @description 设置提示文本内容
     * @param {Element} sliderWrapBtnElem 提示文本节点元素
     */
    const setSliderTipsTxt = (sliderWrapBtnElem) => {
      const value = sliderWrapBtnElem.parent().data('value');
      const tipsTxt = options.setTips ? options.setTips(value) : value;
      this.$rootElem.find('.' + CONST.SLIDER_TIPS).html(tipsTxt);
    };

    /**
     * @description 计算提示文本元素的 position left
     * @param {Element} sliderWrapBtnElem 提示文本节点元素
     */
    const calcSliderTipsLeft = (sliderWrapBtnElem) => {
      const sliderWidth =
        options.type === 'vertical'
          ? options.height
          : this.$rootElem[0].offsetWidth;
      const sliderWrap = this.$rootElem.find('.' + CONST.SLIDER_WRAP);
      const tipsLeft =
        options.type === 'vertical'
          ? sliderWidth -
            sliderWrapBtnElem.parent()[0].offsetTop -
            sliderWrap.height()
          : sliderWrapBtnElem.parent()[0].offsetLeft;
      const left = (tipsLeft / sliderWidth) * 100;
      return left;
    };

    /**
     * @description 设置提示文本元素的 position left
     * @param {number} left 要设置的 left 的大小
     */
    const setSliderTipsLeft = (left) => {
      if (options.type === 'vertical') {
        this.$rootElem.find('.' + CONST.SLIDER_TIPS).css({
          bottom: left + '%',
          'margin-bottom': '20px',
          display: 'inline-block',
        });
      } else {
        this.$rootElem.find('.' + CONST.SLIDER_TIPS).css({
          left: left + '%',
          display: 'inline-block',
        });
      }
    };

    // 判断是否要始终显示提示文本
    if (options.tips) {
      if (options.tipsAlways) {
        const sliderWrapBtnElem = this.$rootElem.find(
          '.' + CONST.SLIDER_WRAP_BTN,
        );
        setSliderTipsTxt(sliderWrapBtnElem);
        const left = calcSliderTipsLeft(sliderWrapBtnElem);
        setSliderTipsLeft(left);
      } else {
        // 划过滑块显示数值
        let timer;
        this.$rootElem
          .find('.' + CONST.SLIDER_WRAP_BTN)
          .on('mouseover', function () {
            const sliderWrapBtnElem = $(this);
            setSliderTipsTxt(sliderWrapBtnElem);
            const left = calcSliderTipsLeft(sliderWrapBtnElem);
            clearTimeout(timer);
            timer = setTimeout(function () {
              setSliderTipsLeft(left);
            }, 300);
          })
          .on(
            'mouseout',
            function () {
              clearTimeout(timer);
              if (!options.tipsAlways) {
                this.$rootElem
                  .find('.' + CONST.SLIDER_TIPS)
                  .css('display', 'none');
              }
            }.bind(this),
          );
      }
    }
  }

  setValue(value, index) {
    const options = this.options;
    value = value > options.max ? options.max : value;
    value = value < options.min ? options.min : value;
    options.value = value;
    return this.#slide('set', value, index || 0);
  }

  // 数值精度
  #precision() {
    const options = this.options;
    const precisions = $.map(
      [options.min, options.max, options.step],
      function (v) {
        const decimalArr = String(v).split('.');
        return decimalArr[1] ? decimalArr[1].length : 0;
      },
    );
    return Math.max.apply(null, precisions);
  }

  // 滑块滑动
  #slide(setValue, value, i) {
    const options = this.options;
    const sliderAct = this.$rootElem;
    const sliderWidth = function () {
      return options.type === 'vertical'
        ? options.height
        : sliderAct[0].offsetWidth;
    };
    const sliderWrap = sliderAct.find('.' + CONST.SLIDER_WRAP);
    const sliderTxt = sliderAct.next('.' + CONST.SLIDER_INPUT);
    let inputValue = sliderTxt
      .children('.' + CONST.SLIDER_INPUT_TXT)
      .children('input')
      .val();
    const step = 100 / ((options.max - options.min) / options.step);
    const precision = this.#precision();
    const change = function (offsetValue, index, from) {
      if (Math.ceil(offsetValue) * step > 100) {
        offsetValue = Math.ceil(offsetValue) * step;
      } else {
        offsetValue = Math.round(offsetValue) * step;
      }
      offsetValue = offsetValue > 100 ? 100 : offsetValue;
      offsetValue = offsetValue < 0 ? 0 : offsetValue;
      sliderWrap
        .eq(index)
        .css(
          options.type === 'vertical' ? 'bottom' : 'left',
          `${offsetValue}%`,
        );
      let firLeft = valueTo(sliderWrap[0].offsetLeft);
      let secLeft = options.range ? valueTo(sliderWrap[1].offsetLeft) : 0;
      if (options.type === 'vertical') {
        sliderAct
          .find('.' + CONST.SLIDER_TIPS)
          .css({ bottom: `${offsetValue}%`, 'margin-bottom': '20px' });
        firLeft = valueTo(
          sliderWidth() - sliderWrap[0].offsetTop - sliderWrap.height(),
        );
        secLeft = options.range
          ? valueTo(
              sliderWidth() - sliderWrap[1].offsetTop - sliderWrap.height(),
            )
          : 0;
      } else {
        sliderAct.find('.' + CONST.SLIDER_TIPS).css('left', `${offsetValue}%`);
      }
      firLeft = firLeft > 100 ? 100 : firLeft;
      secLeft = secLeft > 100 ? 100 : secLeft;
      const minLeft = Math.min(firLeft, secLeft);
      const wrapWidth = Math.abs(firLeft - secLeft);
      if (options.type === 'vertical') {
        sliderAct
          .find('.' + CONST.SLIDER_BAR)
          .css({ height: `${wrapWidth}%`, bottom: `${minLeft}%` });
      } else {
        sliderAct
          .find('.' + CONST.SLIDER_BAR)
          .css({ width: `${wrapWidth}%`, left: `${minLeft}%` });
      }
      let selfValue =
        options.min + ((options.max - options.min) * offsetValue) / 100;
      selfValue = Number(parseFloat(selfValue).toFixed(precision));
      inputValue = selfValue;
      sliderTxt
        .children('.' + CONST.SLIDER_INPUT_TXT)
        .children('input')
        .val(inputValue);
      sliderWrap.eq(index).data('value', selfValue);
      sliderAct
        .find('.' + CONST.SLIDER_TIPS)
        .html(options.setTips ? options.setTips(selfValue) : selfValue);

      // 如果开启范围选择，则返回数组值
      let arrValue;
      if (options.range) {
        arrValue = [
          sliderWrap.eq(0).data('value'),
          sliderWrap.eq(1).data('value'),
        ];
        if (arrValue[0] > arrValue[1]) arrValue.reverse(); // 如果前面的圆点超过了后面的圆点值，则调换顺序
      }

      this.value = options.range ? arrValue : selfValue; // 最新值
      options.change && options.change(this.value); // change 回调

      // 值完成选中的事件
      if (from === 'done') options.done && options.done(this.value);
    }.bind(this);
    const valueTo = function (value) {
      const oldLeft = ((value / sliderWidth()) * 100) / step;
      let left = Math.round(oldLeft) * step;
      if (value == sliderWidth()) {
        left = Math.ceil(oldLeft) * step;
      }
      return left;
    };

    // 拖拽元素
    const elemMove = $(
      ['<div class="lay-auxiliar-moving" id="LAY-slider-moving"></div'].join(
        '',
      ),
    );
    const createMoveElem = function (sliderBtnElem, move, up) {
      const upCall = function () {
        // 移动端延时一秒关闭
        up && up(lay.touchEventsSupported() ? 1000 : 0);
        elemMove.remove();
        options.done && options.done(this.value);
        // 移动端
        if (lay.touchEventsSupported()) {
          sliderBtnElem[0].removeEventListener(
            'touchmove',
            move,
            lay.passiveSupported ? { passive: false } : false,
          );
          sliderBtnElem[0].removeEventListener('touchend', upCall);
          sliderBtnElem[0].removeEventListener('touchcancel', upCall);
        }
      };
      $('#LAY-slider-moving')[0] || $('body').append(elemMove);
      elemMove.on('mousemove', move);
      elemMove.on('mouseup', upCall).on('mouseleave', upCall);
      // 移动端
      if (lay.touchEventsSupported()) {
        sliderBtnElem[0].addEventListener(
          'touchmove',
          move,
          lay.passiveSupported ? { passive: false } : false,
        );
        sliderBtnElem[0].addEventListener('touchend', upCall);
        sliderBtnElem[0].addEventListener('touchcancel', upCall);
      }
    }.bind(this);

    // 动态赋值
    if (setValue === 'set') {
      return change(
        (((value - options.min) / (options.max - options.min)) * 100) / step,
        i,
        'done',
      );
    }

    // 滑块滑动
    sliderAct.find('.' + CONST.SLIDER_WRAP_BTN).each(function (index) {
      const $this = $(this);
      $this.on('mousedown touchstart', function (e) {
        if (e.type === 'touchstart') {
          e.clientX = e.originalEvent.touches[0].clientX;
          e.clientY = e.originalEvent.touches[0].clientY;
        }

        let oldleft = $this.parent()[0].offsetLeft;
        let oldx = e.clientX;
        if (options.type === 'vertical') {
          oldleft =
            sliderWidth() - $this.parent()[0].offsetTop - sliderWrap.height();
          oldx = e.clientY;
        }

        const move = function (e) {
          if (e.type === 'touchmove') {
            e.clientX = e.touches[0].clientX;
            e.clientY = e.touches[0].clientY;
          }
          let left =
            oldleft +
            (options.type === 'vertical' ? oldx - e.clientY : e.clientX - oldx);
          if (left < 0) left = 0;
          if (left > sliderWidth()) left = sliderWidth();
          const reaLeft = ((left / sliderWidth()) * 100) / step;
          change(reaLeft, index);
          $this.addClass(CONST.ELEM_HOVER);
          sliderAct.find('.' + CONST.SLIDER_TIPS).show();
          e.preventDefault();
        };

        const up = function (delay) {
          $this.removeClass(CONST.ELEM_HOVER);
          if (!options.tipsAlways) {
            setTimeout(function () {
              sliderAct.find('.' + CONST.SLIDER_TIPS).hide();
            }, delay);
          }
        };

        createMoveElem($this, move, up);
      });
    });

    // 点击滑块
    sliderAct.on('click', function (e) {
      const main = $('.' + CONST.SLIDER_WRAP_BTN);
      const $this = $(this);

      if (
        !main.is(e.target) &&
        main.has(e.target).length === 0 &&
        main.length
      ) {
        let index;
        let offset =
          options.type === 'vertical'
            ? sliderWidth() -
              e.clientY +
              $this.offset().top -
              $(window).scrollTop()
            : e.clientX - $this.offset().left - $(window).scrollLeft();

        if (offset < 0) offset = 0;
        if (offset > sliderWidth()) offset = sliderWidth();
        const reaLeft = ((offset / sliderWidth()) * 100) / step;
        if (options.range) {
          if (options.type === 'vertical') {
            index =
              Math.abs(offset - parseInt($(sliderWrap[0]).css('bottom'))) >
              Math.abs(offset - parseInt($(sliderWrap[1]).css('bottom')))
                ? 1
                : 0;
          } else {
            index =
              Math.abs(offset - sliderWrap[0].offsetLeft) >
              Math.abs(offset - sliderWrap[1].offsetLeft)
                ? 1
                : 0;
          }
        } else {
          index = 0;
        }
        change(reaLeft, index, 'done');
        e.preventDefault();
      }
    });

    // 点击加减输入框
    sliderTxt
      .children('.' + CONST.SLIDER_INPUT_BTN)
      .children('i')
      .each(function (index) {
        $(this).on('click', function () {
          inputValue = sliderTxt
            .children('.' + CONST.SLIDER_INPUT_TXT)
            .children('input')
            .val();
          if (index == 1) {
            // 减
            inputValue =
              inputValue - options.step < options.min
                ? options.min
                : Number(inputValue) - options.step;
          } else {
            inputValue =
              Number(inputValue) + options.step > options.max
                ? options.max
                : Number(inputValue) + options.step;
          }
          const inputScale =
            (((inputValue - options.min) / (options.max - options.min)) * 100) /
            step;
          change(inputScale, 0, 'done');
        });
      });

    // 获取输入框值
    const getInputValue = function () {
      let realValue = this.value;
      realValue = isNaN(realValue) ? 0 : realValue;
      realValue = realValue < options.min ? options.min : realValue;
      realValue = realValue > options.max ? options.max : realValue;
      this.value = realValue;
      const inputScale =
        (((realValue - options.min) / (options.max - options.min)) * 100) /
        step;
      change(inputScale, 0, 'done');
    };
    sliderTxt
      .children('.' + CONST.SLIDER_INPUT_TXT)
      .children('input')
      .on('keydown', function (e) {
        if (e.keyCode === 13) {
          e.preventDefault();
          getInputValue.call(this);
        }
      })
      .on('change', getInputValue);
  }
}

const CONST = Slider.CONST;

export { Slider as slider };
