/**
 * rate
 * 评分组件
 */

import { lay } from '../core/lay.js';
import { $ } from 'jquery';
import { Component } from '../core/component.js';

export class Rate extends Component {
  static componentName = 'rate';

  // 默认配置
  static options = {
    length: 5, // 评分的最大长度值
    value: 0, // 评分的初始值
    half: false, // 是否可以选择半星
    text: false, // 是否显示评分对应的文本
    readonly: false, // 是否只读
    theme: '', // 主题颜色
  };

  static get CONST() {
    return {
      ...super.CONST,
      ELEM: 'lay-rate',
      ICON_RATE: 'lay-icon-rate',
      ICON_RATE_SOLID: 'lay-icon-rate-solid',
      ICON_RATE_HALF: 'lay-icon-rate-half',
      ICON_SOLID_HALF: 'lay-icon-rate-solid lay-icon-rate-half',
      ICON_SOLID_RATE: 'lay-icon-rate-solid lay-icon-rate',
      ICON_HALF_RATE: 'lay-icon-rate lay-icon-rate-half',
    };
  }

  // 渲染
  render() {
    const options = this.options;
    const style = options.theme ? `style="color: ${options.theme};"` : '';

    // 最大值不能大于总长度
    if (options.value > options.length) {
      options.value = options.length;
    }

    // 如果没有选择半星的属性，却给了小数的数值，统一向上或向下取整
    if (parseInt(options.value) !== options.value) {
      if (!options.half) {
        options.value =
          Math.ceil(options.value) - options.value < 0.5
            ? Math.ceil(options.value)
            : Math.floor(options.value);
      }
    }

    // 组件模板
    let template = `<ul class="lay-rate" ${options.readonly ? 'readonly' : ''}>`;
    for (let i = 1; i <= options.length; i++) {
      const item = `<li class="lay-inline"><i class="lay-icon ${
        i > Math.floor(options.value) ? CONST.ICON_RATE : CONST.ICON_RATE_SOLID
      }" ${style}></i></li>`;
      if (
        options.half &&
        parseInt(options.value) !== options.value &&
        i == Math.ceil(options.value)
      ) {
        template += `<li><i class="lay-icon lay-icon-rate-half" ${style}></i></li>`;
      } else {
        template += item;
      }
    }
    template += '</ul>';

    const $textElem = (this.$textElem = $(
      `<span class="lay-inline">${options.value}</span>`,
    ));

    // 开始插入替代元素
    const $elem = options.$elem;

    this.$rootElem = $(template);
    $elem.html(this.$rootElem);
    $elem.addClass('lay-inline');

    if (options.text) {
      $textElem.text(options.setText?.(options.value) || options.value);
      this.$rootElem.after($textElem);
    }

    // 若非只读，则添加触控事件
    if (!options.readonly) {
      this.#action();
    }
  }

  setValue(value) {
    this.options.value = value;
    this.render();
  }

  // li 相关事件
  #action() {
    const options = this.options;
    const $rootElem = this.$rootElem;
    const wide = $rootElem.find('i').width();
    const liElems = $rootElem.children('li');
    const $textElem = this.$textElem;

    liElems.each(function (index) {
      const ind = index + 1;
      const $this = $(this);

      // 点击
      $this.on('click', function (e) {
        // 将当前点击 li 的索引值赋给 value
        options.value = ind;
        if (options.half) {
          // 获取鼠标在 li 上的位置
          const x = e.pageX - $(this).offset().left;
          if (x <= wide / 2) {
            options.value -= 0.5;
          }
        }

        if (options.text) {
          $textElem.text(options.setText?.(options.value) || options.value);
        }

        options.choose?.(options.value);
      });

      // 移入
      $this.on('mousemove', function (e) {
        $rootElem.find('i').each(function () {
          $(this).addClass(CONST.ICON_RATE).removeClass(CONST.ICON_SOLID_HALF);
        });
        $rootElem.find(`i:lt(${ind})`).each(function () {
          $(this)
            .addClass(CONST.ICON_RATE_SOLID)
            .removeClass(CONST.ICON_HALF_RATE);
        });
        // 如果设置可选半星，那么判断鼠标相对 li 的位置
        if (options.half) {
          const x = e.pageX - $(this).offset().left;
          if (x <= wide / 2) {
            $this
              .children('i')
              .addClass(CONST.ICON_RATE_HALF)
              .removeClass(CONST.ICON_RATE_SOLID);
          }
        }
      });

      // 移出
      $this.on('mouseleave', function () {
        $rootElem.find('i').each(function () {
          $(this).addClass(CONST.ICON_RATE).removeClass(CONST.ICON_SOLID_HALF);
        });
        $rootElem.find(`i:lt(${Math.floor(options.value)})`).each(function () {
          $(this)
            .addClass(CONST.ICON_RATE_SOLID)
            .removeClass(CONST.ICON_HALF_RATE);
        });
        // 如果设置可选半星，根据分数判断是否有半星
        if (options.half) {
          if (parseInt(options.value) !== options.value) {
            $rootElem
              .children(`li:eq(${Math.floor(options.value)})`)
              .children('i')
              .addClass(CONST.ICON_RATE_HALF)
              .removeClass(CONST.ICON_SOLID_RATE);
          }
        }
      });
    });

    lay.touchSwipe($rootElem, {
      onTouchMove: function (e, state) {
        if (Date.now() - state.timeStart <= 200) return;
        const pageX = e.touches[0].pageX;
        const rateElemWidth = $rootElem.width();
        const itemElemWidth = rateElemWidth / options.length; // 单颗星的宽度
        const offsetX = pageX - $rootElem.offset().left;
        const num = offsetX / itemElemWidth; // 原始值
        const remainder = num % 1;
        const integer = num - remainder;

        // 最终值
        let score =
          remainder <= 0.5 && options.half ? integer + 0.5 : Math.ceil(num);
        if (score > options.length) score = options.length;
        if (score < 0) score = 0;

        liElems.each(function (index) {
          const iconElem = $(this).children('i');
          const isActiveIcon = Math.ceil(score) - index === 1;
          const needSelect = Math.ceil(score) > index;
          const shouldHalfIcon = score - index === 0.5;

          if (needSelect) {
            // 设置选中样式
            iconElem
              .addClass(CONST.ICON_RATE_SOLID)
              .removeClass(CONST.ICON_HALF_RATE);
            if (options.half && shouldHalfIcon) {
              iconElem
                .addClass(CONST.ICON_RATE_HALF)
                .removeClass(CONST.ICON_RATE_SOLID);
            }
          } else {
            // 恢复初始样式
            iconElem
              .addClass(CONST.ICON_RATE)
              .removeClass(CONST.ICON_SOLID_HALF);
          }

          // 设置缩放样式
          iconElem.toggleClass('lay-rate-hover', isActiveIcon);
        });

        // 更新最终值
        options.value = score;

        if (options.text) {
          $textElem.text(options.setText?.(options.value) || options.value);
        }
      },
      onTouchEnd: function (e, state) {
        if (Date.now() - state.timeStart <= 200) return;
        $rootElem.find('i').removeClass('lay-rate-hover');
        options.choose?.(options.value);
        $textElem.text(options.setText?.(options.value) || options.value);
      },
    });
  }
}

const CONST = Rate.CONST;

export { Rate as rate };
