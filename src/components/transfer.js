/**
 * transfer
 * 穿梭框组件
 */

import { i18n } from '../core/i18n.js';
import { $ } from 'jquery';
import { Component } from '../core/component.js';
import { laytpl } from '../core/laytpl.js';
import { form } from './form.js';

export class Transfer extends Component {
  // 默认配置
  static options = {
    width: 200,
    height: 360,
    data: [], // 数据源
    value: [], // 选中的数据
    showSearch: false, // 是否开启搜索
  };

  static get CONST() {
    return {
      ...super.CONST,
      ELEM: 'lay-transfer',
      ELEM_BOX: 'lay-transfer-box',
      ELEM_HEADER: 'lay-transfer-header',
      ELEM_SEARCH: 'lay-transfer-search',
      ELEM_ACTIVE: 'lay-transfer-active',
      ELEM_DATA: 'lay-transfer-data',
      BTN_DISABLED: 'lay-btn-disabled',
    };
  }

  // 获得选中的数据（右侧面板）
  static getData(id) {
    const inst = this.getInstance(id);
    if (!inst) return;
    return inst.getData();
  }

  constructor(options) {
    super(options);
    this.options = $.extend(
      {
        title: i18n.$t('transfer.title'),
        text: {
          none: i18n.$t('transfer.noData'),
          searchNone: i18n.$t('transfer.noMatch'),
        },
      },
      this.options,
      options,
    );
  }

  // 渲染
  render() {
    const options = this.options;

    // 穿梭框模板
    const TPL_BOX = function (obj) {
      obj = obj || {};
      return `
<div class="lay-transfer-box" data-index="${obj.index}">
  <div class="lay-transfer-header">
    <input
      type="checkbox"
      name="${obj.checkAllName}"
      lay-filter="layTransferCheckbox"
      lay-type="all"
      lay-skin="primary"
      title="{{= d.data.title[${obj.index}] || 'list${obj.index + 1}' }}">
  </div>
  {{ if(d.data.showSearch){ }}
    <div class="lay-transfer-search">
      <i class="lay-icon lay-icon-search"></i>
      <input type="text" class="lay-input" placeholder="${i18n.$t('transfer.searchPlaceholder')}">
    </div>
  {{ } }}
  <ul class="lay-transfer-data"></ul>
</div>
      `;
    };

    // 主模板
    const TPL_MAIN = `
<div class="lay-transfer lay-form lay-border-box" lay-filter="LAY-transfer-{{= d.index }}">
  ${TPL_BOX({
    index: 0,
    checkAllName: 'layTransferLeftCheckAll',
  })}
  <div class="lay-transfer-active">
    <button type="button" class="lay-btn lay-btn-sm lay-btn-primary lay-btn-disabled" data-index="0">
      <i class="lay-icon lay-icon-next"></i>
    </button>
    <button type="button" class="lay-btn lay-btn-sm lay-btn-primary lay-btn-disabled" data-index="1">
      <i class="lay-icon lay-icon-prev"></i>
    </button>
  </div>
  ${TPL_BOX({
    index: 1,
    checkAllName: 'layTransferRightCheckAll',
  })}
</div>
    `;

    // 解析模板
    const $rootElem = (this.$rootElem = $(
      laytpl(TPL_MAIN, {
        open: '{{', // 标签符前缀
        close: '}}', // 标签符后缀
      }).render({
        data: options,
        index: this.index, // 索引
      }),
    ));

    const $elem = options.$elem;
    if (!$elem[0]) return;

    // 初始化属性
    options.data = options.data || [];
    options.value = options.value || [];

    // 插入组件结构
    $elem.html($rootElem);

    // 各级容器
    this.$boxElem = $rootElem.find(`.${CONST.ELEM_BOX}`);
    this.$headerElem = $rootElem.find(`.${CONST.ELEM_HEADER}`);
    this.$searchElem = $rootElem.find(`.${CONST.ELEM_SEARCH}`);
    this.$dataElem = $rootElem.find(`.${CONST.ELEM_DATA}`);
    this.$btnElem = $rootElem.find(`.${CONST.ELEM_ACTIVE} .lay-btn`);

    // 初始化尺寸
    this.$boxElem.css({
      width: options.width,
      height: options.height,
    });
    this.$dataElem.css({
      height: function () {
        let height = options.height - this.$headerElem.outerHeight();
        if (options.showSearch) {
          height -= this.$searchElem.outerHeight();
        }
        return height - 2;
      }.bind(this)(),
    });

    this.#renderData(); // 渲染数据
    this.#events(); // 事件
  }

  // 获得右侧面板数据
  getData(value) {
    const options = this.options;
    const selectedData = [];

    this.#setValue();

    (value || options.value).forEach(function (item) {
      options.data.forEach(function (item2) {
        delete item2.selected;
        if (item == item2.value) {
          selectedData.push(item2);
        }
      });
    });

    return selectedData;
  }

  // 渲染数据
  #renderData() {
    const options = this.options;

    // 左右穿梭框差异数据
    const arr = [
      {
        checkName: 'layTransferLeftCheck',
        views: [],
      },
      {
        checkName: 'layTransferRightCheck',
        views: [],
      },
    ];

    // 解析格式
    this.#parseData((item) => {
      // 标注为 selected 的为右边的数据
      const _index = item.selected ? 1 : 0;
      const listElem = `
<li>
  <input type="checkbox" name="${arr[_index].checkName}" lay-skin="primary" lay-filter="layTransferCheckbox" title="${item.title}"${item.disabled ? ' disabled' : ''}${item.checked ? ' checked' : ''} value="${item.value}">
</li>
    `;
      // 按照 options.value 顺序排列右侧数据
      if (_index) {
        options.value.forEach(function (v, i) {
          if (v == item.value && item.selected) {
            arr[_index].views[i] = listElem;
          }
        });
      } else {
        arr[_index].views.push(listElem);
      }
      delete item.selected;
    });

    this.$dataElem.eq(0).html(arr[0].views.join(''));
    this.$dataElem.eq(1).html(arr[1].views.join(''));

    this.#renderCheckBtn();
  }

  // 渲染表单
  #renderForm(type) {
    form.render(type, `LAY-transfer-${this.index}`);
  }

  // 同步复选框和按钮状态
  #renderCheckBtn(obj) {
    const options = this.options;

    obj = obj || {};

    this.$boxElem.each((_index, item) => {
      const $this = $(item);
      const thisDataElem = $this.find(`.${CONST.ELEM_DATA}`);
      const allElemCheckbox = $this
        .find(`.${CONST.ELEM_HEADER}`)
        .find('input[type="checkbox"]');
      const listElemCheckbox = thisDataElem.find('input[type="checkbox"]');

      // 同步复选框和按钮状态
      let nums = 0;
      let haveChecked = false;

      listElemCheckbox.each(function () {
        const isHide = $(this).data('hide');
        if (this.checked || this.disabled || isHide) {
          nums++;
        }
        if (this.checked && !isHide) {
          haveChecked = true;
        }
      });

      allElemCheckbox.prop(
        'checked',
        haveChecked && nums === listElemCheckbox.length,
      ); // 全选复选框状态
      this.$btnElem
        .eq(_index)
        [haveChecked ? 'removeClass' : 'addClass'](CONST.BTN_DISABLED); // 对应的按钮状态

      // 无数据视图
      if (!obj.stopNone) {
        const isNone = thisDataElem.children(
          `li:not(.${CONST.CLASS_HIDE})`,
        ).length;
        this.#noneView(thisDataElem, isNone ? '' : options.text.none);
      }
    });

    this.#renderForm('checkbox');
  }

  // 无数据视图
  #noneView(thisDataElem, text) {
    const createNoneElem = $(`<p class="lay-none">${text || ''}</p>`);
    if (thisDataElem.find(`.${CONST.CLASS_NONE}`)[0]) {
      thisDataElem.find(`.${CONST.CLASS_NONE}`).remove();
    }
    text.replace(/\s/g, '') && thisDataElem.append(createNoneElem);
  }

  // 同步 value 属性值
  #setValue() {
    const options = this.options;
    const arr = [];

    this.$boxElem
      .eq(1)
      .find(`.${CONST.ELEM_DATA} input[type="checkbox"]`)
      .each(function () {
        const isHide = $(this).data('hide');
        isHide || arr.push(this.value);
      });
    options.value = arr;

    return this;
  }

  // 解析数据
  #parseData(callback) {
    const options = this.options;
    const newData = [];

    options.data.forEach(function (item) {
      // 解析格式
      item =
        (typeof options.parseData === 'function'
          ? options.parseData(item)
          : item) || item;

      newData.push((item = $.extend({}, item)));

      options.value.forEach(function (item2) {
        if (item2 == item.value) {
          item.selected = true;
        }
      });
      callback && callback(item);
    });

    options.data = newData;
    return this;
  }

  // 执行穿梭
  #transfer(_index, elem) {
    const options = this.options;
    const thisBoxElem = this.$boxElem.eq(_index);
    const arr = [];

    if (!elem) {
      // 通过按钮触发找到选中的进行移动
      thisBoxElem.each((_, item) => {
        const $this = $(item);
        const thisDataElem = $this.find(`.${CONST.ELEM_DATA}`);

        thisDataElem.children('li').each((__, listItem) => {
          const thisList = $(listItem);
          const thisElemCheckbox = thisList.find('input[type="checkbox"]');
          const isHide = thisElemCheckbox.data('hide');

          if (thisElemCheckbox[0].checked && !isHide) {
            thisElemCheckbox[0].checked = false;
            thisBoxElem
              .siblings(`.${CONST.ELEM_BOX}`)
              .find(`.${CONST.ELEM_DATA}`)
              .append(thisList.clone());
            thisList.remove();

            // 记录当前穿梭的数据
            arr.push(thisElemCheckbox[0].value);
          }

          this.#setValue();
        });
      });
    } else {
      // 双击单条记录移动
      const thisList = elem;
      const thisElemCheckbox = thisList.find('input[type="checkbox"]');

      thisElemCheckbox[0].checked = false;
      thisBoxElem
        .siblings(`.${CONST.ELEM_BOX}`)
        .find(`.${CONST.ELEM_DATA}`)
        .append(thisList.clone());
      thisList.remove();

      // 记录当前穿梭的数据
      arr.push(thisElemCheckbox[0].value);

      this.#setValue();
    }

    this.#renderCheckBtn();

    // 穿梭时，如果另外一个框正在搜索，则触发匹配
    const siblingInput = thisBoxElem
      .siblings(`.${CONST.ELEM_BOX}`)
      .find(`.${CONST.ELEM_SEARCH} input`);
    siblingInput.val() === '' || siblingInput.trigger('keyup');

    // 穿梭时的回调
    options.onchange && options.onchange(this.getData(arr), _index);
  }

  // 事件
  #events() {
    const options = this.options;

    // 左右复选框
    this.$rootElem.on(
      'click',
      'input[lay-filter="layTransferCheckbox"]+',
      (event) => {
        const thisElemCheckbox = $(event.currentTarget).prev();
        const checked = thisElemCheckbox[0].checked;
        const thisDataElem = thisElemCheckbox
          .parents(`.${CONST.ELEM_BOX}`)
          .eq(0)
          .find(`.${CONST.ELEM_DATA}`);

        if (thisElemCheckbox[0].disabled) return;

        // 判断是否全选
        if (thisElemCheckbox.attr('lay-type') === 'all') {
          thisDataElem.find('input[type="checkbox"]').each(function () {
            if (this.disabled) return;
            this.checked = checked;
          });
        }

        setTimeout(() => {
          this.#renderCheckBtn({ stopNone: true });
        }, 0);
      },
    );

    // 双击穿梭
    this.$rootElem.on('dblclick', `.${CONST.ELEM_DATA}>li`, (event) => {
      const elemThis = $(event.currentTarget);
      const thisElemCheckbox = elemThis.children('input[type="checkbox"]');
      const thisDataElem = elemThis.parent();
      const thisBoxElem = thisDataElem.parent();
      const index = thisBoxElem.data('index');

      if (thisElemCheckbox[0].disabled) return;

      // 根据 dblclick 回调函数返回值决定是否执行穿梭 --- 2.9.3+
      const ret =
        typeof options.dblclick === 'function'
          ? options.dblclick({
              elem: elemThis,
              data: this.getData([thisElemCheckbox[0].value])[0],
              index: index,
            })
          : null;

      if (ret === false) return;

      this.#transfer(index, elemThis);
    });

    // 穿梭按钮事件
    this.$btnElem.on('click', (event) => {
      const $this = $(event.currentTarget);
      const _index = $this.data('index');

      if ($this.hasClass(CONST.BTN_DISABLED)) return;
      this.#transfer(_index);
    });

    // 搜索
    this.$searchElem.find('input').on(
      'keyup',
      function () {
        let value = this.value;
        const thisDataElem = $(this)
          .parents(`.${CONST.ELEM_SEARCH}`)
          .eq(0)
          .siblings(`.${CONST.ELEM_DATA}`);
        const thisListElem = thisDataElem.children('li');

        thisListElem.each(function () {
          const thisList = $(this);
          const thisElemCheckbox = thisList.find('input[type="checkbox"]');
          let title = thisElemCheckbox[0].title;

          // 是否区分大小写
          if (options.showSearch !== 'cs') {
            title = title.toLowerCase();
            value = value.toLowerCase();
          }

          const isMatch = title.indexOf(value) !== -1;

          thisList[isMatch ? 'removeClass' : 'addClass'](CONST.CLASS_HIDE);
          thisElemCheckbox.data('hide', isMatch ? false : true);
        });

        this.#renderCheckBtn();

        // 无匹配数据视图
        const isNone =
          thisListElem.length ===
          thisDataElem.children(`li.${CONST.CLASS_HIDE}`).length;
        this.#noneView(thisDataElem, isNone ? options.text.searchNone : '');
      }.bind(this),
    );
  }
}

const CONST = Transfer.CONST;

export { Transfer as transfer };
