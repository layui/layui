/**
 * floatbar
 * 悬浮条组件
 */

import { lay } from '../core/lay.js';
import { $ } from 'jquery';
import { componentBuilder } from '../core/component.js';

// 创建组件
const component = componentBuilder({
  name: 'floatbar', // 组件名

  // 默认配置
  config: {
    target: 'body', // floatbar 的插入目标选择器
    bars: [], // bar 配置项
    showDefaultBar: true, // 是否显示默认 bar
    scrollThreshold: 160, // 出现 top bar 的滚动条位置临界值
  },

  CONST: {
    ELEM: 'layui-floatbar',
  },

  render() {
    const options = this.config;

    // 目标元素对象
    const $target = $(options.target);

    // 滚动条所在元素对象
    const $scroll = options.scroll
      ? $(options.scroll)
      : $(options.target === 'body' ? window : $target);

    // 是否提供默认图标
    if (options.showDefaultBar) {
      // 是否已存在 top bar
      const hasTopBar = options.bars.some((item) => item.type === 'top');

      // 追加默认 top bar
      if (!hasTopBar) {
        options.bars.push({
          type: 'top',
          icon: 'layui-icon-top',
        });
      }
    }

    const elem = $('<div>').attr(CONST.MOD_ID, options.id).addClass(CONST.ELEM);
    let topBarElem;

    // 自定义样式
    if (options.css) {
      lay.style({
        target: elem[0],
        id: `DF-${CONST.MOD_NAME}-${this.index}`,
        text: `.${CONST.ELEM}[${CONST.MOD_ID}="${options.id}"] { ${options.css} }`,
      });
    }

    // 生成 bars 节点
    options.bars.forEach(function (item) {
      const barElem = $('<div class="layui-floatbar-item">');

      // 设置 bar 相关属性
      barElem
        .attr({
          'data-type': item.type,
          style: item.style,
        })
        .html(item.content);

      // bar 内置点击事件
      barElem.on('click', function () {
        const type = $(this).data('type');
        // 回到顶部
        if (type === 'top') {
          $scroll[0]?.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
        }
      });

      // 自定义任意事件
      if (lay.type(options.on) === 'object') {
        Object.entries(options.on).forEach(([eventName, callback]) => {
          barElem.on(eventName, function () {
            const type = $(this).data('type');
            typeof callback === 'function' && callback.call(this, type);
          });
        });
      }

      // 获得 top bar 节点
      if (item.type === 'top') {
        barElem.addClass('layui-floatbar-top');
        topBarElem = barElem;
      }

      // 插入 bar 图标节点
      if (item.icon) {
        const iconElem = $('<i class="layui-icon">').addClass(item.icon);
        barElem.append(iconElem);
      }

      elem.append(barElem); // 插入 bar 图标节点
    });

    // 若目标元素已存在 floatbar, 则移除旧的节点
    $target.find('.' + CONST.ELEM).remove();

    // 向目标元素插入 floatbar 节点
    $target.append(elem);

    // top bar 的显示隐藏
    let setTopBar;
    if (topBarElem) {
      let locked;
      setTopBar = (function fn() {
        const top = $scroll.scrollTop();
        if (top >= options.scrollThreshold) {
          locked || (topBarElem.show(), (locked = 1));
        } else {
          locked && (topBarElem.hide(), (locked = 0));
        }
        return fn;
      })();
    }

    // 根据 scrollbar 设置 floatbar 相关状态
    let timer;
    const scrollEventName = 'scroll.lay_floatbar_scroll';
    $scroll.off(scrollEventName).on(scrollEventName, function () {
      if (!setTopBar) return;
      clearTimeout(timer);
      timer = setTimeout(() => {
        setTopBar();
      }, 100);
    });
  },
});

const CONST = component.CONST;

export { component as floatbar };
