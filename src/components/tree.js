/**
 * tree
 * 树组件
 */

import { lay } from '../core/lay.js';
import { i18n } from '../core/i18n.js';
import { $ } from 'jquery';
import { Component } from '../core/component.js';
import { layer } from './layer.js';
import { form } from './form.js';

export class Tree extends Component {
  static componentName = 'tree';

  // 默认配置
  static options = {
    data: [], // 数据
    showCheckbox: false, // 是否显示复选框
    showLine: true, // 是否开启连接线
    accordion: false, // 是否开启手风琴模式
    onlyIconControl: false, // 是否仅允许节点左侧图标控制展开收缩
    isJump: false, // 是否允许点击节点时弹出新窗口跳转
    edit: false, // 是否开启节点的操作图标
    customName: {
      // 自定义 data 字段名
      id: 'id',
      title: 'title',
      children: 'children',
    },
  };

  static get CONST() {
    return {
      ...super.CONST,
      ELEM: 'lay-tree',
      ELEM_SET: 'lay-tree-set',
      ICON_CLICK: 'lay-tree-iconClick',
      ICON_ADD: 'lay-icon-addition',
      ICON_SUB: 'lay-icon-subtraction',
      ELEM_ENTRY: 'lay-tree-entry',
      ELEM_MAIN: 'lay-tree-main',
      ELEM_TEXT: 'lay-tree-txt',
      ELEM_PACK: 'lay-tree-pack',
      ELEM_SPREAD: 'lay-tree-spread',
      ELEM_LINE_SHORT: 'lay-tree-setLineShort',
      ELEM_SHOW: 'lay-tree-showLine',
      ELEM_EXTEND: 'lay-tree-lineExtend',
    };
  }

  // 实例方法静态委托
  static {
    this.delegateInstanceMethods(['getChecked', 'setChecked']);
  }

  // 构造函数
  constructor(options) {
    super(options);

    this.options = $.extend(
      {
        text: {
          defaultNodeName: i18n.$t('tree.defaultNodeName'), // 节点默认名称
          none: i18n.$t('tree.noData'), // 数据为空时的文本提示
        },
      },
      this.options,
      options,
    );

    // 扁平化数据
    const customName = this.options.customName || {};
    this.options.flatData = lay.treeToFlat(this.options.data, {
      idKey: customName.id,
      childrenKey: customName.children,
      keepChildren: true,
    });
  }

  // 渲染
  render() {
    const options = this.options;

    this.checkids = [];

    const $rootElem = $(
      `<div class="lay-tree lay-border-box${options.showCheckbox ? ' lay-form' : ''}${options.showLine ? ' lay-tree-line' : ''}" lay-filter="LAY-tree-${this.index}"></div>`,
    );
    this.#tree($rootElem);

    const $elem = options.$elem;
    if (!$elem[0]) return;

    // 插入组件结构
    this.$rootElem = $rootElem;
    this.$emptyElem = $(
      `<div class="lay-tree-emptyText">${options.text.none}</div>`,
    );
    $elem.html(this.$rootElem);

    if (this.$rootElem.find(`.${CONST.ELEM_SET}`).length == 0) {
      return this.$rootElem.append(this.$emptyElem);
    }

    // 复选框渲染
    if (options.showCheckbox) {
      this.#renderForm('checkbox');
    }

    this.$rootElem.find(`.${CONST.ELEM_SET}`).each((_, item) => {
      const $this = $(item);

      // 最外层
      if (!$this.parent('.lay-tree-pack')[0]) {
        $this.addClass('lay-tree-setHide');
      }

      // 没有下一个节点 上一层父级有延伸线
      if (
        !$this.next()[0] &&
        $this.parents('.lay-tree-pack').eq(1).hasClass('lay-tree-lineExtend')
      ) {
        $this.addClass(CONST.ELEM_LINE_SHORT);
      }

      // 没有下一个节点 外层最后一个
      if (
        !$this.next()[0] &&
        !$this.parents(`.${CONST.ELEM_SET}`).eq(0).next()[0]
      ) {
        $this.addClass(CONST.ELEM_LINE_SHORT);
      }
    });

    this.#events();
  }

  // 得到选中节点
  getChecked() {
    const options = this.options;
    const customName = options.customName;
    const checkedId = [];
    const checkedData = [];

    // 遍历节点找到选中索引
    this.$rootElem.find('.lay-form-checked').each((_, item) => {
      checkedId.push($(item).prev()[0].value);
    });

    // 遍历节点
    const eachNodes = (data, checkNode) => {
      for (const item of data) {
        for (const item2 of checkedId) {
          if (item[customName.id] == item2) {
            this.#updateFieldValue(item, 'checked', true);
            const cloneItem = $.extend({}, item);
            delete cloneItem[customName.children];

            checkNode.push(cloneItem);

            if (item[customName.children]) {
              cloneItem[customName.children] = [];
              eachNodes(
                item[customName.children],
                cloneItem[customName.children],
              );
            }
            break;
          }
        }
      }
    };

    eachNodes($.extend(true, [], options.flatData), checkedData);
    return checkedData;
  }

  // 设置选中节点
  setChecked(checkedId) {
    const options = this.options;
    const flatData = options.flatData;

    if (typeof checkedId !== 'object') {
      checkedId = [checkedId];
    }

    // 初始选中状态
    this.$rootElem.find(`.${CONST.ELEM_SET}`).each((i, item) => {
      const thisId = $(item).data('id');
      const input = $(item)
        .children(`.${CONST.ELEM_ENTRY}`)
        .find('input[same="layuiTreeCheck"]');
      const checked = input.prop('checked');

      for (const id of checkedId) {
        if (thisId == id) {
          if (input.prop('disabled')) continue;
          if (!checked) {
            input.prop('checked', true);
            this.#syncCheckedState(input, flatData[i]);
            break;
          }
        }
      }
    });
  }

  // 渲染表单
  #renderForm(type) {
    form.render(type, `LAY-tree-${this.index}`);
  }

  // 节点解析
  #tree(elem, children) {
    const options = this.options;
    const customName = options.customName;
    const data = children || options.data;

    // 遍历数据
    data.forEach((item) => {
      const hasChild =
        item[customName.children] && item[customName.children].length > 0;
      const packDiv = $(
        `<div class="lay-tree-pack" ${item.spread ? 'style="display: block;"' : ''}></div>`,
      );
      const iconHtml = options.showLine
        ? hasChild
          ? `<span class="lay-tree-iconClick lay-tree-icon"><i class="lay-icon ${item.spread ? 'lay-icon-subtraction' : 'lay-icon-addition'}"></i></span>`
          : '<span class="lay-tree-iconClick"><i class="lay-icon lay-icon-leaf"></i></span>'
        : `<span class="lay-tree-iconClick"><i class="lay-tree-iconArrow ${hasChild ? '' : CONST.CLASS_HIDE}"></i></span>`;
      const checkboxHtml = options.showCheckbox
        ? `<input type="checkbox" name="${item.field || `layuiTreeCheck_${item[customName.id]}`}" same="layuiTreeCheck" lay-skin="primary" ${item.disabled ? 'disabled' : ''} value="${item[customName.id]}">`
        : '';
      const nodeTitle =
        item[customName.title] || item.label || options.text.defaultNodeName;
      const nodeHtml =
        options.isJump && item.href
          ? `<a href="${item.href}" target="_blank" class="${CONST.ELEM_TEXT}">${nodeTitle}</a>`
          : `<span class="${CONST.ELEM_TEXT}${item.disabled ? ` ${CONST.CLASS_DISABLED}` : ''}">${nodeTitle}</span>`;
      let editHtml = '';
      if (options.edit) {
        const editIcon = {
          add: '<i class="lay-icon lay-icon-add-1"  data-type="add"></i>',
          update: '<i class="lay-icon lay-icon-edit" data-type="update"></i>',
          del: '<i class="lay-icon lay-icon-delete" data-type="del"></i>',
        };
        const arr = ['<div class="lay-btn-group lay-tree-btnGroup">'];

        if (options.edit === true) {
          options.edit = ['update', 'del'];
        }

        if (typeof options.edit === 'object') {
          options.edit.forEach((val) => {
            arr.push(editIcon[val] || '');
          });
          editHtml = `${arr.join('')}</div>`;
        }
      }
      const entryDiv = $(
        [
          `<div data-id="${item[customName.id]}" class="${[CONST.ELEM_SET, item.spread ? 'lay-tree-spread' : ''].join(' ')}">`,
          '<div class="lay-tree-entry">',
          '<div class="lay-tree-main">',
          iconHtml,
          checkboxHtml,
          nodeHtml,
          '</div>',
          editHtml,
          '</div>',
          '</div>',
        ].join(''),
      );

      // 如果有子节点，则递归继续生成树
      if (hasChild) {
        entryDiv.append(packDiv);
        this.#tree(packDiv, item[customName.children]);
      }

      elem.append(entryDiv);

      // 若有前置节点，前置节点加连接线
      if (entryDiv.prev(`.${CONST.ELEM_SET}`)[0]) {
        entryDiv
          .prev()
          .children('.lay-tree-pack')
          .addClass('lay-tree-showLine');
      }

      // 若无子节点，则父节点加延伸线
      if (!hasChild) {
        entryDiv.parent('.lay-tree-pack').addClass('lay-tree-lineExtend');
      }

      // 展开节点操作
      this.#spread(entryDiv, item);

      // 选择框
      if (options.showCheckbox) {
        item.checked && this.checkids.push(item[customName.id]);
        this.#checkClick(entryDiv, item);
      }

      // 操作节点
      options.edit && this.#operate(entryDiv, item);
    });
  }

  // 展开节点
  #spread(elem, item) {
    const options = this.options;
    const entry = elem.children(`.${CONST.ELEM_ENTRY}`);
    const elemMain = entry.children(`.${CONST.ELEM_MAIN}`);
    const elemCheckbox = elemMain.find('input[same="layuiTreeCheck"]');
    const elemIcon = entry.find(`.${CONST.ICON_CLICK}`);
    const elemText = entry.find(`.${CONST.ELEM_TEXT}`);
    const touchOpen = options.onlyIconControl ? elemIcon : elemMain; // 判断展开通过节点还是箭头图标
    let state = '';

    // 展开收缩
    touchOpen.on('click', () => {
      const packCont = elem.children(`.${CONST.ELEM_PACK}`);
      const iconClick = touchOpen.children('.lay-icon')[0]
        ? touchOpen.children('.lay-icon')
        : touchOpen.find('.lay-tree-icon').children('.lay-icon');

      // 若没有子节点
      if (!packCont[0]) {
        state = 'normal';
      } else {
        if (elem.hasClass(CONST.ELEM_SPREAD)) {
          elem.removeClass(CONST.ELEM_SPREAD);
          packCont.slideUp(200);
          iconClick.removeClass(CONST.ICON_SUB).addClass(CONST.ICON_ADD);
          this.#updateFieldValue(item, 'spread', false);
        } else {
          elem.addClass(CONST.ELEM_SPREAD);
          packCont.slideDown(200);
          iconClick.addClass(CONST.ICON_SUB).removeClass(CONST.ICON_ADD);
          this.#updateFieldValue(item, 'spread', true);

          // 是否手风琴
          if (options.accordion) {
            const siblings = elem.siblings(`.${CONST.ELEM_SET}`);
            siblings.removeClass(CONST.ELEM_SPREAD);
            siblings.children(`.${CONST.ELEM_PACK}`).slideUp(200);
            siblings
              .find('.lay-tree-icon')
              .children('.lay-icon')
              .removeClass(CONST.ICON_SUB)
              .addClass(CONST.ICON_ADD);
          }
        }
      }
    });

    // 点击回调
    elemText.on('click', (event) => {
      const $this = $(event.currentTarget);

      // 判断是否禁用状态
      if ($this.hasClass(CONST.CLASS_DISABLED)) return;

      // 判断展开收缩状态
      if (elem.hasClass(CONST.ELEM_SPREAD)) {
        state = options.onlyIconControl ? 'open' : 'close';
      } else {
        state = options.onlyIconControl ? 'close' : 'open';
      }

      // 获取选中状态
      if (elemCheckbox[0]) {
        this.#updateFieldValue(item, 'checked', elemCheckbox.prop('checked'));
      }

      // 点击产生的回调
      options.click &&
        options.click({
          elem: elem,
          state: state,
          data: item,
        });
    });
  }

  // 更新数据源 checked,spread 字段值
  #updateFieldValue(obj, field, value) {
    if (field in obj) {
      obj[field] = value;
    }
  }

  /**
   * 同步节点选中状态
   * @param {JQuery} elemCheckbox - 复选框元素的 jQuery 对象
   * @param {Object} item - 当前节点数据
   * @param {boolean} isManual - 是否手动触发
   * @returns
   */
  #syncCheckedState(elemCheckbox, item, isManual) {
    const options = this.options;
    const customName = options.customName;
    const checked = elemCheckbox.prop('checked');
    const nodeWrapper = elemCheckbox.closest(`.${CONST.ELEM_SET}`);

    if (elemCheckbox.prop('disabled')) return;

    // 同步子节点选中状态
    const setChildrenChecked = (thisNodeElem, itemData) => {
      const children = itemData[customName.children];
      if (!children || children.length === 0) return;

      const childrenPack = thisNodeElem.children(`.${CONST.ELEM_PACK}`);
      const childrenWrapper = childrenPack.children(`.${CONST.ELEM_SET}`);
      const elemCheckboxs = childrenWrapper
        .children(`.${CONST.ELEM_ENTRY}`)
        .find('input[same="layuiTreeCheck"]');

      elemCheckboxs.each((i, checkbox) => {
        if (checkbox.disabled) return; // 不可点击则跳过
        const child = children[i];
        // 手动触发时，子节点跟随父节点选中状态；自动渲染时，子节点优先跟随 checked 字段值
        const childChecked = isManual
          ? checked
          : 'checked' in child
            ? child.checked
            : checked;

        checkbox.checked = childChecked;
        this.#updateFieldValue(child, 'checked', childChecked);

        if (child[customName.children]) {
          setChildrenChecked(childrenWrapper.eq(i), child);
        }
      });
    };

    // 同步父节点选中状态
    const setParentsChecked = (thisNodeElem) => {
      // 若无父节点，则终止递归
      if (!thisNodeElem.parents(`.${CONST.ELEM_SET}`)[0]) return;

      let descendantsChecked; // 后代节点选中状态
      const parentPack = thisNodeElem.parent(`.${CONST.ELEM_PACK}`);
      const parentNodeElem = parentPack.parent();
      const parentCheckbox = parentPack
        .prev()
        .find('input[same="layuiTreeCheck"]');

      if (parentCheckbox.prop('disabled')) return;

      // 如果后代节点有任意一条选中，则父节点为选中状态（考虑到兼容性，暂时不支持半选状态）
      if (checked) {
        parentCheckbox.prop('checked', checked);
      } else {
        // 如果当前节点取消选中，则根据计算后代节点选中状态，来同步父节点选中状态
        parentPack.find('input[same="layuiTreeCheck"]').each((_, checkbox) => {
          if (checkbox.checked) {
            descendantsChecked = true;
          }
        });

        // 如果后代节点全部未选中，则父节点也应为非选中状态
        descendantsChecked || parentCheckbox.prop('checked', false);
      }

      // 向父节点递归
      setParentsChecked(parentNodeElem);
    };

    setChildrenChecked(nodeWrapper, item);
    setParentsChecked(nodeWrapper);

    this.#renderForm('checkbox');
  }

  // 复选框选择
  #checkClick(elem, item) {
    const options = this.options;
    const entry = elem.children(`.${CONST.ELEM_ENTRY}`);
    const elemMain = entry.children(`.${CONST.ELEM_MAIN}`);

    // 点击复选框
    elemMain.on('click', 'input[same="layuiTreeCheck"]', (e) => {
      e.stopPropagation();
    });
    elemMain.on('click', 'input[same="layuiTreeCheck"]+', (e) => {
      e.stopPropagation(); // 阻止点击节点事件

      const elemCheckbox = $(e.currentTarget).prev();
      const checked = elemCheckbox.prop('checked');

      if (elemCheckbox.prop('disabled')) return;

      this.#syncCheckedState(elemCheckbox, item, 'manual');
      this.#updateFieldValue(item, 'checked', checked);

      // 复选框点击产生的回调
      options.oncheck &&
        options.oncheck({
          elem: elem,
          checked: checked,
          data: item,
        });
    });
  }

  // 节点操作
  #operate(elem, item) {
    const options = this.options;
    const customName = options.customName;
    const entry = elem.children(`.${CONST.ELEM_ENTRY}`);
    const elemMain = entry.children(`.${CONST.ELEM_MAIN}`);

    entry.children('.lay-tree-btnGroup').on('click', '.lay-icon', (e) => {
      e.stopPropagation(); // 阻止节点操作

      const type = $(e.currentTarget).data('type');
      const packCont = elem.children(`.${CONST.ELEM_PACK}`);
      const returnObj = {
        data: item,
        type: type,
        elem: elem,
      };
      // 增加
      if (type == 'add') {
        // 若节点本身无子节点
        if (!packCont[0]) {
          // 若开启连接线，更改图标样式
          if (options.showLine) {
            elemMain.find(`.${CONST.ICON_CLICK}`).addClass('lay-tree-icon');
            elemMain
              .find(`.${CONST.ICON_CLICK}`)
              .children('.lay-icon')
              .addClass(CONST.ICON_ADD)
              .removeClass('lay-icon-leaf');
            // 若未开启连接线，显示箭头
          } else {
            elemMain.find('.lay-tree-iconArrow').removeClass(CONST.CLASS_HIDE);
          }
          // 节点添加子节点容器
          elem.append('<div class="lay-tree-pack"></div>');
        }

        // 新增节点
        const key = options.operate && options.operate(returnObj);
        const obj = {};

        obj[customName.title] = options.text.defaultNodeName;
        obj[customName.id] = key;
        this.#tree(elem.children(`.${CONST.ELEM_PACK}`), [obj]);

        // 放在新增后面，因为要对元素进行操作
        if (options.showLine) {
          // 节点本身无子节点
          if (!packCont[0]) {
            // 遍历兄弟节点，判断兄弟节点是否有子节点
            const siblings = elem.siblings(`.${CONST.ELEM_SET}`);
            let num = 1;
            const parentPack = elem.parent(`.${CONST.ELEM_PACK}`);

            siblings.each((_index, sibling) => {
              if (!$(sibling).children(`.${CONST.ELEM_PACK}`)[0]) {
                num = 0;
              }
            });

            // 若兄弟节点都有子节点
            if (num == 1) {
              // 兄弟节点添加连接线
              siblings
                .children(`.${CONST.ELEM_PACK}`)
                .addClass(CONST.ELEM_SHOW);
              siblings
                .children(`.${CONST.ELEM_PACK}`)
                .children(`.${CONST.ELEM_SET}`)
                .removeClass(CONST.ELEM_LINE_SHORT);
              elem.children(`.${CONST.ELEM_PACK}`).addClass(CONST.ELEM_SHOW);
              // 父级移除延伸线
              parentPack.removeClass(CONST.ELEM_EXTEND);
              // 同层节点最后一个更改线的状态
              parentPack
                .children(`.${CONST.ELEM_SET}`)
                .last()
                .children(`.${CONST.ELEM_PACK}`)
                .children(`.${CONST.ELEM_SET}`)
                .last()
                .addClass(CONST.ELEM_LINE_SHORT);
            } else {
              elem
                .children(`.${CONST.ELEM_PACK}`)
                .children(`.${CONST.ELEM_SET}`)
                .addClass(CONST.ELEM_LINE_SHORT);
            }
          } else {
            // 添加延伸线
            if (!packCont.hasClass(CONST.ELEM_EXTEND)) {
              packCont.addClass(CONST.ELEM_EXTEND);
            }
            // 子节点添加延伸线
            elem.find(`.${CONST.ELEM_PACK}`).each((_, pack) => {
              $(pack)
                .children(`.${CONST.ELEM_SET}`)
                .last()
                .addClass(CONST.ELEM_LINE_SHORT);
            });
            // 如果前一个节点有延伸线
            if (
              packCont
                .children(`.${CONST.ELEM_SET}`)
                .last()
                .prev()
                .hasClass(CONST.ELEM_LINE_SHORT)
            ) {
              packCont
                .children(`.${CONST.ELEM_SET}`)
                .last()
                .prev()
                .removeClass(CONST.ELEM_LINE_SHORT);
            } else {
              // 若之前的没有，说明处于连接状态
              packCont
                .children(`.${CONST.ELEM_SET}`)
                .last()
                .removeClass(CONST.ELEM_LINE_SHORT);
            }
            // 若是最外层，要始终保持相连的状态
            if (!elem.parent(`.${CONST.ELEM_PACK}`)[0] && elem.next()[0]) {
              packCont
                .children(`.${CONST.ELEM_SET}`)
                .last()
                .removeClass(CONST.ELEM_LINE_SHORT);
            }
          }
        }
        if (!options.showCheckbox) return;
        // 若开启复选框，同步新增节点状态
        if (elemMain.find('input[same="layuiTreeCheck"]')[0].checked) {
          const packLast = elem
            .children(`.${CONST.ELEM_PACK}`)
            .children(`.${CONST.ELEM_SET}`)
            .last();
          packLast.find('input[same="layuiTreeCheck"]')[0].checked = true;
        }
        this.#renderForm('checkbox');

        // 修改
      } else if (type == 'update') {
        const text = elemMain.children(`.${CONST.ELEM_TEXT}`).html();
        elemMain.children(`.${CONST.ELEM_TEXT}`).html('');
        // 添加输入框，覆盖在文字上方
        elemMain.append('<input type="text" class="lay-tree-editInput">');
        // 获取焦点
        elemMain
          .children('.lay-tree-editInput')
          .val(lay.unescape(text))
          .focus();
        // 嵌入文字移除输入框
        const getVal = (input) => {
          let textNew = lay.escape(input.val().trim());
          textNew = textNew ? textNew : options.text.defaultNodeName;
          input.remove();
          elemMain.children(`.${CONST.ELEM_TEXT}`).html(textNew);

          // 同步数据
          returnObj.data[customName.title] = textNew;

          // 节点修改的回调
          options.operate && options.operate(returnObj);
        };
        // 失去焦点
        elemMain.children('.lay-tree-editInput').blur((event) => {
          getVal($(event.currentTarget));
        });
        // 回车
        elemMain.children('.lay-tree-editInput').on('keydown', (event) => {
          if (event.keyCode === 13) {
            event.preventDefault();
            getVal($(event.currentTarget));
          }
        });

        // 删除
      } else {
        const i18nText = i18n.$t('tree.deleteNodePrompt', {
          name: item[customName.title] || '',
        });
        layer.confirm(i18nText, (index) => {
          options.operate && options.operate(returnObj); // 节点删除的回调
          returnObj.status = 'remove'; // 标注节点删除

          layer.close(index);

          // 若删除最后一个，显示空数据提示
          if (
            !elem.prev(`.${CONST.ELEM_SET}`)[0] &&
            !elem.next(`.${CONST.ELEM_SET}`)[0] &&
            !elem.parent(`.${CONST.ELEM_PACK}`)[0]
          ) {
            elem.remove();
            this.$rootElem.append(this.$emptyElem);
            return;
          }
          // 若有兄弟节点
          if (
            elem
              .siblings(`.${CONST.ELEM_SET}`)
              .children(`.${CONST.ELEM_ENTRY}`)[0]
          ) {
            // 若开启复选框
            if (options.showCheckbox) {
              // 若开启复选框，进行下步操作
              const elemDel = (currentElem) => {
                // 若无父结点，则不执行
                if (!currentElem.parents(`.${CONST.ELEM_SET}`)[0]) return;
                const siblingTree = currentElem
                  .siblings(`.${CONST.ELEM_SET}`)
                  .children(`.${CONST.ELEM_ENTRY}`);
                const parentTree = currentElem
                  .parent(`.${CONST.ELEM_PACK}`)
                  .prev();
                const checkState = parentTree.find(
                  'input[same="layuiTreeCheck"]',
                )[0];
                let state = 1;
                let num = 0;

                // 若父节点未勾选
                if (checkState.checked == false) {
                  // 遍历兄弟节点
                  siblingTree.each((i, item1) => {
                    const input = $(item1).find(
                      'input[same="layuiTreeCheck"]',
                    )[0];
                    if (input.checked == false && !input.disabled) {
                      state = 0;
                    }
                    // 判断是否全为不可勾选框
                    if (!input.disabled) {
                      num = 1;
                    }
                  });
                  // 若有可勾选选择框并且已勾选
                  if (state == 1 && num == 1) {
                    // 勾选父节点
                    checkState.checked = true;
                    this.#renderForm('checkbox');
                    // 向上遍历祖先节点
                    elemDel(parentTree.parent(`.${CONST.ELEM_SET}`));
                  }
                }
              };
              elemDel(elem);
            }
            // 若开启连接线
            if (options.showLine) {
              // 遍历兄弟节点，判断兄弟节点是否有子节点
              const siblings = elem.siblings(`.${CONST.ELEM_SET}`);
              let num = 1;
              const parentPack = elem.parent(`.${CONST.ELEM_PACK}`);

              siblings.each((_index, sibling) => {
                if (!$(sibling).children(`.${CONST.ELEM_PACK}`)[0]) {
                  num = 0;
                }
              });
              // 若兄弟节点都有子节点
              if (num == 1) {
                // 若节点本身无子节点
                if (!packCont[0]) {
                  // 父级去除延伸线，因为此时子节点里没有空节点
                  parentPack.removeClass(CONST.ELEM_EXTEND);
                  siblings
                    .children(`.${CONST.ELEM_PACK}`)
                    .addClass(CONST.ELEM_SHOW);
                  siblings
                    .children(`.${CONST.ELEM_PACK}`)
                    .children(`.${CONST.ELEM_SET}`)
                    .removeClass(CONST.ELEM_LINE_SHORT);
                }
                // 若为最后一个节点
                if (!elem.next()[0]) {
                  elem
                    .prev()
                    .children(`.${CONST.ELEM_PACK}`)
                    .children(`.${CONST.ELEM_SET}`)
                    .last()
                    .addClass(CONST.ELEM_LINE_SHORT);
                } else {
                  parentPack
                    .children(`.${CONST.ELEM_SET}`)
                    .last()
                    .children(`.${CONST.ELEM_PACK}`)
                    .children(`.${CONST.ELEM_SET}`)
                    .last()
                    .addClass(CONST.ELEM_LINE_SHORT);
                }
                // 若为最外层最后一个节点，去除前一个结点的连接线
                if (
                  !elem.next()[0] &&
                  !elem.parents(`.${CONST.ELEM_SET}`)[1] &&
                  !elem.parents(`.${CONST.ELEM_SET}`).eq(0).next()[0]
                ) {
                  elem
                    .prev(`.${CONST.ELEM_SET}`)
                    .addClass(CONST.ELEM_LINE_SHORT);
                }
              } else {
                // 若为最后一个节点且有延伸线
                if (!elem.next()[0] && elem.hasClass(CONST.ELEM_LINE_SHORT)) {
                  elem.prev().addClass(CONST.ELEM_LINE_SHORT);
                }
              }
            }
          } else {
            // 若无兄弟节点
            const prevDiv = elem.parent(`.${CONST.ELEM_PACK}`).prev();
            // 若开启了连接线
            if (options.showLine) {
              prevDiv.find(`.${CONST.ICON_CLICK}`).removeClass('lay-tree-icon');
              prevDiv
                .find(`.${CONST.ICON_CLICK}`)
                .children('.lay-icon')
                .removeClass(CONST.ICON_SUB)
                .addClass('lay-icon-leaf');
              // 父节点所在层添加延伸线
              const pare = prevDiv.parents(`.${CONST.ELEM_PACK}`).eq(0);
              pare.addClass(CONST.ELEM_EXTEND);

              // 兄弟节点最后子节点添加延伸线
              pare.children(`.${CONST.ELEM_SET}`).each((_, itemElem) => {
                $(itemElem)
                  .children(`.${CONST.ELEM_PACK}`)
                  .children(`.${CONST.ELEM_SET}`)
                  .last()
                  .addClass(CONST.ELEM_LINE_SHORT);
              });
            } else {
              // 父节点隐藏箭头
              prevDiv.find('.lay-tree-iconArrow').addClass(CONST.CLASS_HIDE);
            }
            // 移除展开属性
            elem
              .parents(`.${CONST.ELEM_SET}`)
              .eq(0)
              .removeClass(CONST.ELEM_SPREAD);
            // 移除节点容器
            elem.parent(`.${CONST.ELEM_PACK}`).remove();
          }

          elem.remove();
        });
      }
    });
  }

  // 事件
  #events() {
    const options = this.options;

    // 初始选中
    this.setChecked(this.checkids);

    // 搜索
    this.$rootElem.find('.lay-tree-search').on('keyup', (event) => {
      const input = $(event.currentTarget);
      const val = input.val();
      const pack = input.nextAll();
      const arr = [];

      // 遍历所有的值
      pack.find(`.${CONST.ELEM_TEXT}`).each((_, item) => {
        const $item = $(item);
        const entry = $item.parents(`.${CONST.ELEM_ENTRY}`);
        // 若值匹配，加一个类以作标识
        if ($item.html().indexOf(val) != -1) {
          arr.push($item.parent());

          const select = (div) => {
            div.addClass('lay-tree-searchShow');
            // 向上父节点渲染
            if (div.parent(`.${CONST.ELEM_PACK}`)[0]) {
              select(
                div.parent(`.${CONST.ELEM_PACK}`).parent(`.${CONST.ELEM_SET}`),
              );
            }
          };
          select(entry.parent(`.${CONST.ELEM_SET}`));
        }
      });

      // 根据标志剔除
      pack.find(`.${CONST.ELEM_ENTRY}`).each((_, item) => {
        const parent = $(item).parent(`.${CONST.ELEM_SET}`);
        if (!parent.hasClass('lay-tree-searchShow')) {
          parent.addClass(CONST.CLASS_HIDE);
        }
      });
      if (pack.find('.lay-tree-searchShow').length == 0) {
        this.$rootElem.append(this.$emptyElem);
      }

      // 节点过滤的回调
      options.onsearch &&
        options.onsearch({
          elem: arr,
        });
    });

    // 还原搜索初始状态
    this.$rootElem.find('.lay-tree-search').on('keydown', (event) => {
      $(event.currentTarget)
        .nextAll()
        .find(`.${CONST.ELEM_ENTRY}`)
        .each((_, item) => {
          const parent = $(item).parent(`.${CONST.ELEM_SET}`);
          parent.removeClass(`lay-tree-searchShow ${CONST.CLASS_HIDE}`);
        });
      this.$emptyElem.remove();
    });
  }
}

const CONST = Tree.CONST;

export { Tree as tree };
