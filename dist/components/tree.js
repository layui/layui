import { layui } from '../core/layui.js';
import { lay } from '../core/lay.js';
import { i18n } from '../core/i18n.js';
import $ from 'jquery';
import { component as component$1 } from '../core/component.js';
import { layer } from './layer.js';
import { form } from './form.js';

/**
 * tree 树组件
 */


// 创建组件
var component = component$1({
  name: 'tree',
  // 默认配置
  config: {
    data: [],
    // 数据
    showCheckbox: false,
    // 是否显示复选框
    showLine: true,
    // 是否开启连接线
    accordion: false,
    // 是否开启手风琴模式
    onlyIconControl: false,
    // 是否仅允许节点左侧图标控制展开收缩
    isJump: false,
    // 是否允许点击节点时弹出新窗口跳转
    edit: false,
    // 是否开启节点的操作图标
    customName: {
      // 自定义 data 字段名
      id: 'id',
      title: 'title',
      children: 'children'
    }
  },
  CONST: {
    ELEM: 'layui-tree',
    ELEM_SET: 'layui-tree-set',
    ICON_CLICK: 'layui-tree-iconClick',
    ICON_ADD: 'layui-icon-addition',
    ICON_SUB: 'layui-icon-subtraction',
    ELEM_ENTRY: 'layui-tree-entry',
    ELEM_MAIN: 'layui-tree-main',
    ELEM_TEXT: 'layui-tree-txt',
    ELEM_PACK: 'layui-tree-pack',
    ELEM_SPREAD: 'layui-tree-spread',
    ELEM_LINE_SHORT: 'layui-tree-setLineShort',
    ELEM_SHOW: 'layui-tree-showLine',
    ELEM_EXTEND: 'layui-tree-lineExtend'
  },
  // 渲染之前
  beforeRender: function (options) {
    var that = this;
    that.config = $.extend({
      text: {
        defaultNodeName: i18n.$t('tree.defaultNodeName'),
        // 节点默认名称
        none: i18n.$t('tree.noData') // 数据为空时的文本提示
      }
    }, that.config, options);

    // 扁平化数据
    var customName = options.customName || {};
    that.config.flatData = lay.treeToFlat(that.config.data, {
      idKey: customName.id,
      childrenKey: customName.children,
      keepChildren: true
    });
  },
  // 渲染
  render: function () {
    var that = this;
    var options = that.config;
    that.checkids = [];
    var wrapper = $('<div class="layui-tree layui-border-box' + (options.showCheckbox ? ' layui-form' : '') + (options.showLine ? ' layui-tree-line' : '') + '" lay-filter="LAY-tree-' + that.index + '"></div>');
    that.tree(wrapper);
    var othis = options.elem;
    if (!othis[0]) return;

    // 插入组件结构
    that.elem = wrapper;
    that.elemNone = $('<div class="layui-tree-emptyText">' + options.text.none + '</div>');
    othis.html(that.elem);
    if (that.elem.find('.' + CONST.ELEM_SET).length == 0) {
      return that.elem.append(that.elemNone);
    }

    // 复选框渲染
    if (options.showCheckbox) {
      that.renderForm('checkbox');
    }
    that.elem.find('.' + CONST.ELEM_SET).each(function () {
      var othis = $(this);

      // 最外层
      if (!othis.parent('.layui-tree-pack')[0]) {
        othis.addClass('layui-tree-setHide');
      }

      // 没有下一个节点 上一层父级有延伸线
      if (!othis.next()[0] && othis.parents('.layui-tree-pack').eq(1).hasClass('layui-tree-lineExtend')) {
        othis.addClass(CONST.ELEM_LINE_SHORT);
      }

      // 没有下一个节点 外层最后一个
      if (!othis.next()[0] && !othis.parents('.' + CONST.ELEM_SET).eq(0).next()[0]) {
        othis.addClass(CONST.ELEM_LINE_SHORT);
      }
    });
  },
  // 扩展实例方法
  extendsInstance: function () {
    var that = this;
    // var options = that.config;
    return {
      getChecked: function () {
        return that.getChecked.call(that);
      },
      setChecked: function (id) {
        // 设置值
        return that.setChecked.call(that, id);
      }
    };
  }
});
var CONST = component.CONST;

/**
 * 扩展组件原型方法
 */

var Class = component.Class;

// 重载实例
Class.prototype.reload = function (options, type) {
  var that = this;

  // 数组直接覆盖
  layui.each(options, function (key, item) {
    if (layui.type(item) === 'array') {
      delete that.config[key];
    }
  });
  that.config = $.extend(true, {}, that.config, options);
  that.init(true, type);
};

// 渲染表单
Class.prototype.renderForm = function (type) {
  form.render(type, 'LAY-tree-' + this.index);
};

// 节点解析
Class.prototype.tree = function (elem, children) {
  var that = this;
  var options = that.config;
  var customName = options.customName;
  var data = children || options.data;

  // 遍历数据
  layui.each(data, function (index, item) {
    var hasChild = item[customName.children] && item[customName.children].length > 0;
    var packDiv = $('<div class="layui-tree-pack" ' + (item.spread ? 'style="display: block;"' : '') + '></div>');
    var entryDiv = $(['<div data-id="' + item[customName.id] + '" class="' + [CONST.ELEM_SET, item.spread ? 'layui-tree-spread' : ''].join(' ') + '">', '<div class="layui-tree-entry">', '<div class="layui-tree-main">',
    // 箭头
    function () {
      if (options.showLine) {
        if (hasChild) {
          return '<span class="layui-tree-iconClick layui-tree-icon"><i class="layui-icon ' + (item.spread ? 'layui-icon-subtraction' : 'layui-icon-addition') + '"></i></span>';
        } else {
          return '<span class="layui-tree-iconClick"><i class="layui-icon layui-icon-leaf"></i></span>';
        }
      } else {
        return '<span class="layui-tree-iconClick"><i class="layui-tree-iconArrow ' + (hasChild ? '' : CONST.CLASS_HIDE) + '"></i></span>';
      }
    }(),
    // 复选框
    function () {
      return options.showCheckbox ? '<input type="checkbox" name="' + (item.field || 'layuiTreeCheck_' + item[customName.id]) + '" same="layuiTreeCheck" lay-skin="primary" ' + (item.disabled ? 'disabled' : '') + ' value="' + item[customName.id] + '">' : '';
    }(),
    // 节点
    function () {
      if (options.isJump && item.href) {
        return '<a href="' + item.href + '" target="_blank" class="' + CONST.ELEM_TEXT + '">' + (item[customName.title] || item.label || options.text.defaultNodeName) + '</a>';
      } else {
        return '<span class="' + CONST.ELEM_TEXT + (item.disabled ? ' ' + CONST.CLASS_DISABLED : '') + '">' + (item[customName.title] || item.label || options.text.defaultNodeName) + '</span>';
      }
    }(), '</div>',
    // 节点操作图标
    function () {
      if (!options.edit) {
        return '';
      }
      var editIcon = {
        add: '<i class="layui-icon layui-icon-add-1"  data-type="add"></i>',
        update: '<i class="layui-icon layui-icon-edit" data-type="update"></i>',
        del: '<i class="layui-icon layui-icon-delete" data-type="del"></i>'
      };
      var arr = ['<div class="layui-btn-group layui-tree-btnGroup">'];
      if (options.edit === true) {
        options.edit = ['update', 'del'];
      }
      if (typeof options.edit === 'object') {
        layui.each(options.edit, function (i, val) {
          arr.push(editIcon[val] || '');
        });
        return arr.join('') + '</div>';
      }
    }(), '</div>', '</div>'].join(''));

    // 如果有子节点，则递归继续生成树
    if (hasChild) {
      entryDiv.append(packDiv);
      that.tree(packDiv, item[customName.children]);
    }
    elem.append(entryDiv);

    // 若有前置节点，前置节点加连接线
    if (entryDiv.prev('.' + CONST.ELEM_SET)[0]) {
      entryDiv.prev().children('.layui-tree-pack').addClass('layui-tree-showLine');
    }

    // 若无子节点，则父节点加延伸线
    if (!hasChild) {
      entryDiv.parent('.layui-tree-pack').addClass('layui-tree-lineExtend');
    }

    // 展开节点操作
    that.spread(entryDiv, item);

    // 选择框
    if (options.showCheckbox) {
      item.checked && that.checkids.push(item[customName.id]);
      that.checkClick(entryDiv, item);
    }

    // 操作节点
    options.edit && that.operate(entryDiv, item);
  });
};

// 展开节点
Class.prototype.spread = function (elem, item) {
  var that = this;
  var options = that.config;
  var entry = elem.children('.' + CONST.ELEM_ENTRY);
  var elemMain = entry.children('.' + CONST.ELEM_MAIN);
  var elemCheckbox = elemMain.find('input[same="layuiTreeCheck"]');
  var elemIcon = entry.find('.' + CONST.ICON_CLICK);
  var elemText = entry.find('.' + CONST.ELEM_TEXT);
  var touchOpen = options.onlyIconControl ? elemIcon : elemMain; // 判断展开通过节点还是箭头图标
  var state = '';

  // 展开收缩
  touchOpen.on('click', function () {
    var packCont = elem.children('.' + CONST.ELEM_PACK);
    var iconClick = touchOpen.children('.layui-icon')[0] ? touchOpen.children('.layui-icon') : touchOpen.find('.layui-tree-icon').children('.layui-icon');

    // 若没有子节点
    if (!packCont[0]) {
      state = 'normal';
    } else {
      if (elem.hasClass(CONST.ELEM_SPREAD)) {
        elem.removeClass(CONST.ELEM_SPREAD);
        packCont.slideUp(200);
        iconClick.removeClass(CONST.ICON_SUB).addClass(CONST.ICON_ADD);
        that.updateFieldValue(item, 'spread', false);
      } else {
        elem.addClass(CONST.ELEM_SPREAD);
        packCont.slideDown(200);
        iconClick.addClass(CONST.ICON_SUB).removeClass(CONST.ICON_ADD);
        that.updateFieldValue(item, 'spread', true);

        // 是否手风琴
        if (options.accordion) {
          var sibls = elem.siblings('.' + CONST.ELEM_SET);
          sibls.removeClass(CONST.ELEM_SPREAD);
          sibls.children('.' + CONST.ELEM_PACK).slideUp(200);
          sibls.find('.layui-tree-icon').children('.layui-icon').removeClass(CONST.ICON_SUB).addClass(CONST.ICON_ADD);
        }
      }
    }
  });

  // 点击回调
  elemText.on('click', function () {
    var othis = $(this);

    // 判断是否禁用状态
    if (othis.hasClass(CONST.CLASS_DISABLED)) return;

    // 判断展开收缩状态
    if (elem.hasClass(CONST.ELEM_SPREAD)) {
      state = options.onlyIconControl ? 'open' : 'close';
    } else {
      state = options.onlyIconControl ? 'close' : 'open';
    }

    // 获取选中状态
    if (elemCheckbox[0]) {
      that.updateFieldValue(item, 'checked', elemCheckbox.prop('checked'));
    }

    // 点击产生的回调
    options.click && options.click({
      elem: elem,
      state: state,
      data: item
    });
  });
};

// 更新数据源 checked,spread 字段值
Class.prototype.updateFieldValue = function (obj, field, value) {
  if (field in obj) {
    obj[field] = value;
  }
};

/**
 * 同步节点选中状态
 * @param {JQuery} elemCheckbox - 复选框元素的 jQuery 对象
 * @param {Object} item - 当前节点数据
 * @param {boolean} isManual - 是否手动触发
 * @returns
 */
Class.prototype.syncCheckedState = function (elemCheckbox, item, isManual) {
  var that = this;
  var options = that.config;
  var customName = options.customName;
  var checked = elemCheckbox.prop('checked');
  var nodeWrapper = elemCheckbox.closest('.' + CONST.ELEM_SET);
  if (elemCheckbox.prop('disabled')) return;

  // 同步子节点选中状态
  var setChildrenChecked = function (thisNodeElem, item) {
    var children = item[customName.children];
    if (!children || children.length === 0) return;
    var childrenPack = thisNodeElem.children('.' + CONST.ELEM_PACK);
    var childrenWrapper = childrenPack.children('.' + CONST.ELEM_SET);
    var elemCheckboxs = childrenWrapper.children('.' + CONST.ELEM_ENTRY).find('input[same="layuiTreeCheck"]');
    elemCheckboxs.each(function (i) {
      if (this.disabled) return; // 不可点击则跳过
      var child = children[i];
      // 手动触发时，子节点跟随父节点选中状态；自动渲染时，子节点优先跟随 checked 字段值
      var childChecked = isManual ? checked : 'checked' in child ? child.checked : checked;
      this.checked = childChecked;
      that.updateFieldValue(child, 'checked', childChecked);
      if (child[customName.children]) {
        setChildrenChecked(childrenWrapper.eq(i), child);
      }
    });
  };

  // 同步父节点选中状态
  var setParentsChecked = function (thisNodeElem) {
    // 若无父节点，则终止递归
    if (!thisNodeElem.parents('.' + CONST.ELEM_SET)[0]) return;
    var descendantsChecked; // 后代节点选中状态
    var parentPack = thisNodeElem.parent('.' + CONST.ELEM_PACK);
    var parentNodeElem = parentPack.parent();
    var parentCheckbox = parentPack.prev().find('input[same="layuiTreeCheck"]');
    if (parentCheckbox.prop('disabled')) return;

    // 如果后代节点有任意一条选中，则父节点为选中状态（考虑到兼容性，暂时不支持半选状态）
    if (checked) {
      parentCheckbox.prop('checked', checked);
    } else {
      // 如果当前节点取消选中，则根据计算后代节点选中状态，来同步父节点选中状态
      parentPack.find('input[same="layuiTreeCheck"]').each(function () {
        if (this.checked) {
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
  that.renderForm('checkbox');
};

// 复选框选择
Class.prototype.checkClick = function (elem, item) {
  var that = this;
  var options = that.config;
  var entry = elem.children('.' + CONST.ELEM_ENTRY);
  var elemMain = entry.children('.' + CONST.ELEM_MAIN);

  // 点击复选框
  elemMain.on('click', 'input[same="layuiTreeCheck"]', layui.stope);
  elemMain.on('click', 'input[same="layuiTreeCheck"]+', function (e) {
    layui.stope(e); // 阻止点击节点事件

    var elemCheckbox = $(this).prev();
    var checked = elemCheckbox.prop('checked');
    if (elemCheckbox.prop('disabled')) return;
    that.syncCheckedState(elemCheckbox, item, 'manual');
    that.updateFieldValue(item, 'checked', checked);

    // 复选框点击产生的回调
    options.oncheck && options.oncheck({
      elem: elem,
      checked: checked,
      data: item
    });
  });
};

// 节点操作
Class.prototype.operate = function (elem, item) {
  var that = this;
  var options = that.config;
  var customName = options.customName;
  var entry = elem.children('.' + CONST.ELEM_ENTRY);
  var elemMain = entry.children('.' + CONST.ELEM_MAIN);
  entry.children('.layui-tree-btnGroup').on('click', '.layui-icon', function (e) {
    layui.stope(e); // 阻止节点操作

    var type = $(this).data('type');
    var packCont = elem.children('.' + CONST.ELEM_PACK);
    var returnObj = {
      data: item,
      type: type,
      elem: elem
    };
    // 增加
    if (type == 'add') {
      // 若节点本身无子节点
      if (!packCont[0]) {
        // 若开启连接线，更改图标样式
        if (options.showLine) {
          elemMain.find('.' + CONST.ICON_CLICK).addClass('layui-tree-icon');
          elemMain.find('.' + CONST.ICON_CLICK).children('.layui-icon').addClass(CONST.ICON_ADD).removeClass('layui-icon-leaf');
          // 若未开启连接线，显示箭头
        } else {
          elemMain.find('.layui-tree-iconArrow').removeClass(CONST.CLASS_HIDE);
        }
        // 节点添加子节点容器
        elem.append('<div class="layui-tree-pack"></div>');
      }

      // 新增节点
      var key = options.operate && options.operate(returnObj);
      var obj = {};
      obj[customName.title] = options.text.defaultNodeName;
      obj[customName.id] = key;
      that.tree(elem.children('.' + CONST.ELEM_PACK), [obj]);

      // 放在新增后面，因为要对元素进行操作
      if (options.showLine) {
        // 节点本身无子节点
        if (!packCont[0]) {
          // 遍历兄弟节点，判断兄弟节点是否有子节点
          var siblings = elem.siblings('.' + CONST.ELEM_SET);
          var num = 1;
          var parentPack = elem.parent('.' + CONST.ELEM_PACK);
          layui.each(siblings, function (index, i) {
            if (!$(i).children('.' + CONST.ELEM_PACK)[0]) {
              num = 0;
            }
          });

          // 若兄弟节点都有子节点
          if (num == 1) {
            // 兄弟节点添加连接线
            siblings.children('.' + CONST.ELEM_PACK).addClass(CONST.ELEM_SHOW);
            siblings.children('.' + CONST.ELEM_PACK).children('.' + CONST.ELEM_SET).removeClass(CONST.ELEM_LINE_SHORT);
            elem.children('.' + CONST.ELEM_PACK).addClass(CONST.ELEM_SHOW);
            // 父级移除延伸线
            parentPack.removeClass(CONST.ELEM_EXTEND);
            // 同层节点最后一个更改线的状态
            parentPack.children('.' + CONST.ELEM_SET).last().children('.' + CONST.ELEM_PACK).children('.' + CONST.ELEM_SET).last().addClass(CONST.ELEM_LINE_SHORT);
          } else {
            elem.children('.' + CONST.ELEM_PACK).children('.' + CONST.ELEM_SET).addClass(CONST.ELEM_LINE_SHORT);
          }
        } else {
          // 添加延伸线
          if (!packCont.hasClass(CONST.ELEM_EXTEND)) {
            packCont.addClass(CONST.ELEM_EXTEND);
          }
          // 子节点添加延伸线
          elem.find('.' + CONST.ELEM_PACK).each(function () {
            $(this).children('.' + CONST.ELEM_SET).last().addClass(CONST.ELEM_LINE_SHORT);
          });
          // 如果前一个节点有延伸线
          if (packCont.children('.' + CONST.ELEM_SET).last().prev().hasClass(CONST.ELEM_LINE_SHORT)) {
            packCont.children('.' + CONST.ELEM_SET).last().prev().removeClass(CONST.ELEM_LINE_SHORT);
          } else {
            // 若之前的没有，说明处于连接状态
            packCont.children('.' + CONST.ELEM_SET).last().removeClass(CONST.ELEM_LINE_SHORT);
          }
          // 若是最外层，要始终保持相连的状态
          if (!elem.parent('.' + CONST.ELEM_PACK)[0] && elem.next()[0]) {
            packCont.children('.' + CONST.ELEM_SET).last().removeClass(CONST.ELEM_LINE_SHORT);
          }
        }
      }
      if (!options.showCheckbox) return;
      // 若开启复选框，同步新增节点状态
      if (elemMain.find('input[same="layuiTreeCheck"]')[0].checked) {
        var packLast = elem.children('.' + CONST.ELEM_PACK).children('.' + CONST.ELEM_SET).last();
        packLast.find('input[same="layuiTreeCheck"]')[0].checked = true;
      }
      that.renderForm('checkbox');

      // 修改
    } else if (type == 'update') {
      var text = elemMain.children('.' + CONST.ELEM_TEXT).html();
      elemMain.children('.' + CONST.ELEM_TEXT).html('');
      // 添加输入框，覆盖在文字上方
      elemMain.append('<input type="text" class="layui-tree-editInput">');
      // 获取焦点
      elemMain.children('.layui-tree-editInput').val(lay.unescape(text)).focus();
      // 嵌入文字移除输入框
      var getVal = function (input) {
        var textNew = lay.escape(input.val().trim());
        textNew = textNew ? textNew : options.text.defaultNodeName;
        input.remove();
        elemMain.children('.' + CONST.ELEM_TEXT).html(textNew);

        // 同步数据
        returnObj.data[customName.title] = textNew;

        // 节点修改的回调
        options.operate && options.operate(returnObj);
      };
      // 失去焦点
      elemMain.children('.layui-tree-editInput').blur(function () {
        getVal($(this));
      });
      // 回车
      elemMain.children('.layui-tree-editInput').on('keydown', function (e) {
        if (e.keyCode === 13) {
          e.preventDefault();
          getVal($(this));
        }
      });

      // 删除
    } else {
      var i18nText = i18n.$t('tree.deleteNodePrompt', {
        name: item[customName.title] || ''
      });
      layer.confirm(i18nText, function (index) {
        options.operate && options.operate(returnObj); // 节点删除的回调
        returnObj.status = 'remove'; // 标注节点删除

        layer.close(index);

        // 若删除最后一个，显示空数据提示
        if (!elem.prev('.' + CONST.ELEM_SET)[0] && !elem.next('.' + CONST.ELEM_SET)[0] && !elem.parent('.' + CONST.ELEM_PACK)[0]) {
          elem.remove();
          that.elem.append(that.elemNone);
          return;
        }
        // 若有兄弟节点
        if (elem.siblings('.' + CONST.ELEM_SET).children('.' + CONST.ELEM_ENTRY)[0]) {
          // 若开启复选框
          if (options.showCheckbox) {
            // 若开启复选框，进行下步操作
            var elemDel = function (elem) {
              // 若无父结点，则不执行
              if (!elem.parents('.' + CONST.ELEM_SET)[0]) return;
              var siblingTree = elem.siblings('.' + CONST.ELEM_SET).children('.' + CONST.ELEM_ENTRY);
              var parentTree = elem.parent('.' + CONST.ELEM_PACK).prev();
              var checkState = parentTree.find('input[same="layuiTreeCheck"]')[0];
              var state = 1;
              var num = 0;

              // 若父节点未勾选
              if (checkState.checked == false) {
                // 遍历兄弟节点
                siblingTree.each(function (i, item1) {
                  var input = $(item1).find('input[same="layuiTreeCheck"]')[0];
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
                  that.renderForm('checkbox');
                  // 向上遍历祖先节点
                  elemDel(parentTree.parent('.' + CONST.ELEM_SET));
                }
              }
            };
            elemDel(elem);
          }
          // 若开启连接线
          if (options.showLine) {
            // 遍历兄弟节点，判断兄弟节点是否有子节点
            var siblings = elem.siblings('.' + CONST.ELEM_SET);
            var num = 1;
            var parentPack = elem.parent('.' + CONST.ELEM_PACK);
            layui.each(siblings, function (index, i) {
              if (!$(i).children('.' + CONST.ELEM_PACK)[0]) {
                num = 0;
              }
            });
            // 若兄弟节点都有子节点
            if (num == 1) {
              // 若节点本身无子节点
              if (!packCont[0]) {
                // 父级去除延伸线，因为此时子节点里没有空节点
                parentPack.removeClass(CONST.ELEM_EXTEND);
                siblings.children('.' + CONST.ELEM_PACK).addClass(CONST.ELEM_SHOW);
                siblings.children('.' + CONST.ELEM_PACK).children('.' + CONST.ELEM_SET).removeClass(CONST.ELEM_LINE_SHORT);
              }
              // 若为最后一个节点
              if (!elem.next()[0]) {
                elem.prev().children('.' + CONST.ELEM_PACK).children('.' + CONST.ELEM_SET).last().addClass(CONST.ELEM_LINE_SHORT);
              } else {
                parentPack.children('.' + CONST.ELEM_SET).last().children('.' + CONST.ELEM_PACK).children('.' + CONST.ELEM_SET).last().addClass(CONST.ELEM_LINE_SHORT);
              }
              // 若为最外层最后一个节点，去除前一个结点的连接线
              if (!elem.next()[0] && !elem.parents('.' + CONST.ELEM_SET)[1] && !elem.parents('.' + CONST.ELEM_SET).eq(0).next()[0]) {
                elem.prev('.' + CONST.ELEM_SET).addClass(CONST.ELEM_LINE_SHORT);
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
          var prevDiv = elem.parent('.' + CONST.ELEM_PACK).prev();
          // 若开启了连接线
          if (options.showLine) {
            prevDiv.find('.' + CONST.ICON_CLICK).removeClass('layui-tree-icon');
            prevDiv.find('.' + CONST.ICON_CLICK).children('.layui-icon').removeClass(CONST.ICON_SUB).addClass('layui-icon-leaf');
            // 父节点所在层添加延伸线
            var pare = prevDiv.parents('.' + CONST.ELEM_PACK).eq(0);
            pare.addClass(CONST.ELEM_EXTEND);

            // 兄弟节点最后子节点添加延伸线
            pare.children('.' + CONST.ELEM_SET).each(function () {
              $(this).children('.' + CONST.ELEM_PACK).children('.' + CONST.ELEM_SET).last().addClass(CONST.ELEM_LINE_SHORT);
            });
          } else {
            // 父节点隐藏箭头
            prevDiv.find('.layui-tree-iconArrow').addClass(CONST.CLASS_HIDE);
          }
          // 移除展开属性
          elem.parents('.' + CONST.ELEM_SET).eq(0).removeClass(CONST.ELEM_SPREAD);
          // 移除节点容器
          elem.parent('.' + CONST.ELEM_PACK).remove();
        }
        elem.remove();
      });
    }
  });
};

// 部分事件
Class.prototype.events = function () {
  var that = this;
  var options = that.config;

  // 初始选中
  that.setChecked(that.checkids);

  // 搜索
  that.elem.find('.layui-tree-search').on('keyup', function () {
    var input = $(this);
    var val = input.val();
    var pack = input.nextAll();
    var arr = [];

    // 遍历所有的值
    pack.find('.' + CONST.ELEM_TEXT).each(function () {
      var entry = $(this).parents('.' + CONST.ELEM_ENTRY);
      // 若值匹配，加一个类以作标识
      if ($(this).html().indexOf(val) != -1) {
        arr.push($(this).parent());
        var select = function (div) {
          div.addClass('layui-tree-searchShow');
          // 向上父节点渲染
          if (div.parent('.' + CONST.ELEM_PACK)[0]) {
            select(div.parent('.' + CONST.ELEM_PACK).parent('.' + CONST.ELEM_SET));
          }
        };
        select(entry.parent('.' + CONST.ELEM_SET));
      }
    });

    // 根据标志剔除
    pack.find('.' + CONST.ELEM_ENTRY).each(function () {
      var parent = $(this).parent('.' + CONST.ELEM_SET);
      if (!parent.hasClass('layui-tree-searchShow')) {
        parent.addClass(CONST.CLASS_HIDE);
      }
    });
    if (pack.find('.layui-tree-searchShow').length == 0) {
      that.elem.append(that.elemNone);
    }

    // 节点过滤的回调
    options.onsearch && options.onsearch({
      elem: arr
    });
  });

  // 还原搜索初始状态
  that.elem.find('.layui-tree-search').on('keydown', function () {
    $(this).nextAll().find('.' + CONST.ELEM_ENTRY).each(function () {
      var parent = $(this).parent('.' + CONST.ELEM_SET);
      parent.removeClass('layui-tree-searchShow ' + CONST.CLASS_HIDE);
    });
    if ($('.layui-tree-emptyText')[0]) $('.layui-tree-emptyText').remove();
  });
};

// 得到选中节点
Class.prototype.getChecked = function () {
  var that = this;
  var options = that.config;
  var customName = options.customName;
  var checkedId = [];
  var checkedData = [];

  // 遍历节点找到选中索引
  that.elem.find('.layui-form-checked').each(function () {
    checkedId.push($(this).prev()[0].value);
  });

  // 遍历节点
  var eachNodes = function (data, checkNode) {
    layui.each(data, function (index, item) {
      layui.each(checkedId, function (index2, item2) {
        if (item[customName.id] == item2) {
          that.updateFieldValue(item, 'checked', true);
          var cloneItem = $.extend({}, item);
          delete cloneItem[customName.children];
          checkNode.push(cloneItem);
          if (item[customName.children]) {
            cloneItem[customName.children] = [];
            eachNodes(item[customName.children], cloneItem[customName.children]);
          }
          return true;
        }
      });
    });
  };
  eachNodes($.extend({}, options.data), checkedData);
  return checkedData;
};

// 设置选中节点
Class.prototype.setChecked = function (checkedId) {
  var that = this;
  var options = that.config;
  var flatData = options.flatData;
  if (typeof checkedId !== 'object') {
    checkedId = [checkedId];
  }

  // 初始选中状态
  that.elem.find('.' + CONST.ELEM_SET).each(function (i) {
    var thisId = $(this).data('id');
    var input = $(this).children('.' + CONST.ELEM_ENTRY).find('input[same="layuiTreeCheck"]');
    var checked = input.prop('checked');
    layui.each(checkedId, function (_i, id) {
      if (thisId == id) {
        if (input.prop('disabled')) return;
        if (!checked) {
          input.prop('checked', true);
          that.syncCheckedState(input, flatData[i]);
          return true;
        }
      }
    });
  });
};

// 扩展组件接口
$.extend(component, {
  // 获得选中的节点数据
  getChecked: function (id) {
    var that = component.getInst(id);
    if (!that) return;
    return that.getChecked();
  },
  // 设置选中节点
  setChecked: function (id, checkedId) {
    var that = component.getInst(id);
    if (!that) return;
    return that.setChecked(checkedId);
  }
});

export { component as tree };
