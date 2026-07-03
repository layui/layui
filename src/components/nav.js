/**
 * nav
 * 导航菜单组件
 */

import { lay } from '../core/lay.js';
import { $ } from 'jquery';
import { Component } from '../core/component.js';

export class Nav extends Component {
  static componentName = 'nav';

  // 默认配置
  static options = {
    elem: '.lay-nav',
  };

  static get CONST() {
    return {
      ...super.CONST,
      NAV_ELEM: '.lay-nav',
      NAV_ITEM: 'lay-nav-item',
      NAV_BAR: 'lay-nav-bar',
      NAV_TREE: 'lay-nav-tree',
      NAV_CHILD: 'lay-nav-child',
      NAV_CHILD_C: 'lay-nav-child-c',
      NAV_MORE: 'lay-nav-more',
      NAV_DOWN: 'lay-icon-down',
      NAV_ANIM: 'lay-anim lay-anim-upbit',
    };
  }

  // 渲染
  render() {
    const options = this.options;
    const TIME = 200;
    const timer = {};
    const timerMore = {};
    const timeEnd = {};
    const NAV_TITLE = 'lay-nav-title';
    const $elem = options.$elem;

    // 滑块跟随
    const follow = function (bar, nav, index) {
      const $this = $(this);
      const child = $this.find(`.${CONST.NAV_CHILD}`);

      // 是否垂直导航菜单
      if (nav.hasClass(CONST.NAV_TREE)) {
        // 无子菜单时跟随
        if (!child[0]) {
          const thisA = $this.children(`.${NAV_TITLE}`);
          bar.css({
            top: $this.offset().top - nav.offset().top + nav.scrollTop(),
            height: (thisA[0] ? thisA : $this).outerHeight(),
            opacity: 1,
          });
        }
      } else {
        child.addClass(CONST.NAV_ANIM);

        // 若居中对齐
        if (child.hasClass(CONST.NAV_CHILD_C)) {
          child.css({
            left: -(child.outerWidth() - $this.width()) / 2,
          });
        }

        // 滑块定位
        if (child[0]) {
          // 若有子菜单，则滑块消失
          bar.css({
            left: bar.position().left + bar.width() / 2,
            width: 0,
            opacity: 0,
          });
        } else {
          // bar 跟随
          bar.css({
            left: $this.position().left + parseFloat($this.css('marginLeft')),
            top: $this.position().top + $this.height() - bar.height(),
          });
        }

        // 渐显滑块并适配宽度
        timer[index] = setTimeout(function () {
          bar.css({
            width: child[0] ? 0 : $this.width(),
            opacity: child[0] ? 0 : 1,
          });
        }, TIME);

        // 显示子菜单
        clearTimeout(timeEnd[index]);
        if (child.css('display') === 'block') {
          clearTimeout(timerMore[index]);
        }
        timerMore[index] = setTimeout(function () {
          child.addClass(CONST.CLASS_SHOW);
          $this.find(`.${CONST.NAV_MORE}`).addClass(`${CONST.NAV_MORE}d`);
        }, 300);
      }
    };

    const isTree = $elem.hasClass(CONST.NAV_TREE);
    const itemElem = $elem.find(`.${CONST.NAV_ITEM}`);
    const itemSelector = isTree
      ? `.${CONST.NAV_ITEM} dd, .${CONST.NAV_ITEM} >.${NAV_TITLE}`
      : `.${CONST.NAV_ITEM}`;

    // 事件命名空间
    const eventNamespace = CONST.EVENT_NAMESPACE;

    // 解绑事件，避免重复绑定
    $elem.off(eventNamespace);

    // 生成滑动条
    const bar = $(`<span class="${CONST.NAV_BAR}"></span>`);
    const hasBarElem = $elem.find(`.${CONST.NAV_BAR}`);
    if (hasBarElem[0]) {
      hasBarElem.remove();
    }
    $elem.append(bar);

    // 鼠标移入移出滑动效果
    $elem
      .on(`mouseenter${eventNamespace}`, itemSelector, function () {
        follow.call(this, bar, $elem, 0);
      })
      .on(`mouseleave${eventNamespace}`, itemSelector, function () {
        if (isTree) {
          bar.css({
            height: 0,
            opacity: 0,
          });
        } else {
          // 隐藏子菜单
          clearTimeout(timerMore[0]);
          timerMore[0] = setTimeout(function () {
            $elem.find(`.${CONST.NAV_CHILD}`).removeClass(CONST.CLASS_SHOW);
            $elem.find(`.${CONST.NAV_MORE}`).removeClass(`${CONST.NAV_MORE}d`);
          }, 300);
        }
      });

    // 鼠标离开当前菜单时
    $elem.on(`mouseleave${eventNamespace}`, function () {
      clearTimeout(timer[0]);
      timeEnd[0] = setTimeout(function () {
        if (!isTree) {
          bar.css({
            width: 0,
            left: bar.position().left + bar.width() / 2,
            opacity: 0,
          });
        }
      }, TIME);
    });

    // 初始化父级菜单图标
    itemElem.find('a').each(function () {
      const $thisA = $(this);
      const child = $thisA.siblings(`.${CONST.NAV_CHILD}`);

      // 输出小箭头
      if (child[0] && !$thisA.children(`.${CONST.NAV_MORE}`)[0]) {
        $thisA.append(
          `<i class="lay-icon ${CONST.NAV_DOWN} ${CONST.NAV_MORE}"></i>`,
        );
      }
    });

    // 点击菜单
    $elem.on(
      `click${eventNamespace}`,
      `.${CONST.NAV_ITEM} a`,
      events.clickThis,
    );
  }
}

const events = {
  // 点击当前菜单 - a 标签触发
  clickThis() {
    const $this = $(this);
    const $parents = $this.closest(CONST.NAV_ELEM);
    const filter = $parents.attr('lay-filter');
    const $parent = $this.parent();
    const $child = $this.siblings(`.${CONST.NAV_CHILD}`);
    const unselect = typeof $parent.attr('lay-unselect') === 'string'; // 是否禁用选中

    // 满足点击选中的条件
    if (
      !(
        $this.attr('href') !== 'javascript:;' &&
        $this.attr('target') === '_blank'
      ) &&
      !unselect
    ) {
      if (!$child[0]) {
        $parents.find('.' + CONST.CLASS_THIS).removeClass(CONST.CLASS_THIS);
        $parent.addClass(CONST.CLASS_THIS);
      }
    }

    // 若为垂直菜单
    if ($parents.hasClass(CONST.NAV_TREE)) {
      const NAV_ITEMED = `${CONST.NAV_ITEM}ed`; // 用于标注展开状态
      const needExpand = !$parent.hasClass(NAV_ITEMED); // 是否执行展开
      const ANIM_MS = 200; // 动画过渡毫秒数

      // 动画执行完成后的操作
      const complete = function () {
        $(this).css({
          display: '', // 剔除动画生成的 style display，以适配外部样式的状态重置
        });
        // 避免导航滑块错位
        $parents.children('.' + CONST.NAV_BAR).css({
          opacity: 0,
        });
      };

      // 是否正处于动画中的状态
      if ($child.is(':animated')) return;

      // 剔除可能存在的 CSS3 动画类
      $child.removeClass(CONST.NAV_ANIM);

      // 若有子菜单，则对其执行展开或收缩
      if ($child[0]) {
        if (needExpand) {
          // 先执行 slideDown 动画，再标注展开状态样式，避免元素 `block` 状态导致动画无效
          $child.slideDown(ANIM_MS, complete);
          $parent.addClass(NAV_ITEMED);
        } else {
          // 先取消展开状态样式，再将元素临时显示，避免 `none` 状态导致 slideUp 动画无效
          $parent.removeClass(NAV_ITEMED);
          $child.show().slideUp(ANIM_MS, complete);
        }

        // 手风琴 --- 收缩兄弟展开项
        if (
          typeof $parents.attr('lay-accordion') === 'string' ||
          $parents.attr('lay-shrink') === 'all'
        ) {
          const $parentSibs = $parent.siblings(`.${NAV_ITEMED}`);
          $parentSibs.removeClass(NAV_ITEMED);
          $parentSibs
            .children(`.${CONST.NAV_CHILD}`)
            .show()
            .stop()
            .slideUp(ANIM_MS, complete);
        }
      }
    }

    lay.event.call(this, Nav.componentName, `click(${filter})`, $this);
  },
};

const CONST = Nav.CONST;

// export
export { Nav as nav };
