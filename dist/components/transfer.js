import { layui } from '../core/layui.js';
import { i18n } from '../core/i18n.js';
import $ from 'jquery';
import { component as component$1 } from '../core/component.js';
import { laytpl } from '../core/laytpl.js';
import { form } from './form.js';

/**
 * transfer
 * 穿梭框组件
 */

var component = component$1({
  name: 'transfer',
  // 默认配置
  config: {
    width: 200,
    height: 360,
    data: [],
    // 数据源
    value: [],
    // 选中的数据
    showSearch: false,
    // 是否开启搜索
    id: '' // 唯一索引，默认自增 index
  },
  CONST: {
    ELEM: 'layui-transfer',
    ELEM_BOX: 'layui-transfer-box',
    ELEM_HEADER: 'layui-transfer-header',
    ELEM_SEARCH: 'layui-transfer-search',
    ELEM_ACTIVE: 'layui-transfer-active',
    ELEM_DATA: 'layui-transfer-data',
    BTN_DISABLED: 'layui-btn-disabled'
  },
  beforeRender: function (options) {
    var that = this;
    that.config = $.extend({
      title: i18n.$t('transfer.title'),
      text: {
        none: i18n.$t('transfer.noData'),
        searchNone: i18n.$t('transfer.noMatch')
      }
    }, that.config, options);
  },
  // 渲染
  render: function () {
    var that = this;
    var options = that.config;

    // 穿梭框模板
    var TPL_BOX = function (obj) {
      obj = obj || {};
      return ['<div class="layui-transfer-box" data-index="' + obj.index + '">', '<div class="layui-transfer-header">', '<input type="checkbox" name="' + obj.checkAllName + '" lay-filter="layTransferCheckbox" lay-type="all" lay-skin="primary" title="{{= d.data.title[' + obj.index + "] || 'list" + (obj.index + 1) + '\' }}">', '</div>', '{{ if(d.data.showSearch){ }}', '<div class="layui-transfer-search">', '<i class="layui-icon layui-icon-search"></i>', '<input type="text" class="layui-input" placeholder="' + i18n.$t('transfer.searchPlaceholder') + '">', '</div>', '{{ } }}', '<ul class="layui-transfer-data"></ul>', '</div>'].join('');
    };

    // 主模板
    var TPL_MAIN = ['<div class="layui-transfer layui-form layui-border-box" lay-filter="LAY-transfer-{{= d.index }}">', TPL_BOX({
      index: 0,
      checkAllName: 'layTransferLeftCheckAll'
    }), '<div class="layui-transfer-active">', '<button type="button" class="layui-btn layui-btn-sm layui-btn-primary layui-btn-disabled" data-index="0">', '<i class="layui-icon layui-icon-next"></i>', '</button>', '<button type="button" class="layui-btn layui-btn-sm layui-btn-primary layui-btn-disabled" data-index="1">', '<i class="layui-icon layui-icon-prev"></i>', '</button>', '</div>', TPL_BOX({
      index: 1,
      checkAllName: 'layTransferRightCheckAll'
    }), '</div>'].join('');

    // 解析模板
    var thisElem = that.elem = $(laytpl(TPL_MAIN, {
      open: '{{',
      // 标签符前缀
      close: '}}',
      // 标签符后缀
      tagStyle: 'modern'
    }).render({
      data: options,
      index: that.index // 索引
    }));
    var othis = options.elem;
    if (!othis[0]) return;

    // 初始化属性
    options.data = options.data || [];
    options.value = options.value || [];

    // 插入组件结构
    othis.html(that.elem);

    // 各级容器
    that.layBox = that.elem.find('.' + CONST.ELEM_BOX);
    that.layHeader = that.elem.find('.' + CONST.ELEM_HEADER);
    that.laySearch = that.elem.find('.' + CONST.ELEM_SEARCH);
    that.layData = thisElem.find('.' + CONST.ELEM_DATA);
    that.layBtn = thisElem.find('.' + CONST.ELEM_ACTIVE + ' .layui-btn');

    // 初始化尺寸
    that.layBox.css({
      width: options.width,
      height: options.height
    });
    that.layData.css({
      height: function () {
        var height = options.height - that.layHeader.outerHeight();
        if (options.showSearch) {
          height -= that.laySearch.outerHeight();
        }
        return height - 2;
      }()
    });
    that.renderData(); // 渲染数据
    that.events(); // 事件
  },
  // 扩展实例方法
  extendsInstance: function () {
    var that = this;
    // var options = that.config;
    return {
      // 获取右侧数据
      getData: function () {
        return that.getData.call(that);
      }
    };
  }
});
var CONST = component.CONST;

/**
 * 扩展组件原型方法
 */

var Class = component.Class;

// 渲染数据
Class.prototype.renderData = function () {
  var that = this;
  var options = that.config;

  // 左右穿梭框差异数据
  var arr = [{
    checkName: 'layTransferLeftCheck',
    views: []
  }, {
    checkName: 'layTransferRightCheck',
    views: []
  }];

  // 解析格式
  that.parseData(function (item) {
    // 标注为 selected 的为右边的数据
    var _index = item.selected ? 1 : 0;
    var listElem = ['<li>', '<input type="checkbox" name="' + arr[_index].checkName + '" lay-skin="primary" lay-filter="layTransferCheckbox" title="' + item.title + '"' + (item.disabled ? ' disabled' : '') + (item.checked ? ' checked' : '') + ' value="' + item.value + '">', '</li>'].join('');
    // 按照 options.value 顺序排列右侧数据
    if (_index) {
      layui.each(options.value, function (i, v) {
        if (v == item.value && item.selected) {
          arr[_index].views[i] = listElem;
        }
      });
    } else {
      arr[_index].views.push(listElem);
    }
    delete item.selected;
  });
  that.layData.eq(0).html(arr[0].views.join(''));
  that.layData.eq(1).html(arr[1].views.join(''));
  that.renderCheckBtn();
};

// 渲染表单
Class.prototype.renderForm = function (type) {
  form.render(type, 'LAY-transfer-' + this.index);
};

// 同步复选框和按钮状态
Class.prototype.renderCheckBtn = function (obj) {
  var that = this;
  var options = that.config;
  obj = obj || {};
  that.layBox.each(function (_index) {
    var othis = $(this);
    var thisDataElem = othis.find('.' + CONST.ELEM_DATA);
    var allElemCheckbox = othis.find('.' + CONST.ELEM_HEADER).find('input[type="checkbox"]');
    var listElemCheckbox = thisDataElem.find('input[type="checkbox"]');

    // 同步复选框和按钮状态
    var nums = 0;
    var haveChecked = false;
    listElemCheckbox.each(function () {
      var isHide = $(this).data('hide');
      if (this.checked || this.disabled || isHide) {
        nums++;
      }
      if (this.checked && !isHide) {
        haveChecked = true;
      }
    });
    allElemCheckbox.prop('checked', haveChecked && nums === listElemCheckbox.length); // 全选复选框状态
    that.layBtn.eq(_index)[haveChecked ? 'removeClass' : 'addClass'](CONST.BTN_DISABLED); // 对应的按钮状态

    // 无数据视图
    if (!obj.stopNone) {
      var isNone = thisDataElem.children('li:not(.' + CONST.CLASS_HIDE + ')').length;
      that.noneView(thisDataElem, isNone ? '' : options.text.none);
    }
  });
  that.renderForm('checkbox');
};

// 无数据视图
Class.prototype.noneView = function (thisDataElem, text) {
  var createNoneElem = $('<p class="layui-none">' + (text || '') + '</p>');
  if (thisDataElem.find('.' + CONST.CLASS_NONE)[0]) {
    thisDataElem.find('.' + CONST.CLASS_NONE).remove();
  }
  text.replace(/\s/g, '') && thisDataElem.append(createNoneElem);
};

// 同步 value 属性值
Class.prototype.setValue = function () {
  var that = this;
  var options = that.config;
  var arr = [];
  that.layBox.eq(1).find('.' + CONST.ELEM_DATA + ' input[type="checkbox"]').each(function () {
    var isHide = $(this).data('hide');
    isHide || arr.push(this.value);
  });
  options.value = arr;
  return that;
};

// 解析数据
Class.prototype.parseData = function (callback) {
  var that = this;
  var options = that.config;
  var newData = [];
  layui.each(options.data, function (index, item) {
    // 解析格式
    item = (typeof options.parseData === 'function' ? options.parseData(item) : item) || item;
    newData.push(item = $.extend({}, item));
    layui.each(options.value, function (index2, item2) {
      if (item2 == item.value) {
        item.selected = true;
      }
    });
    callback && callback(item);
  });
  options.data = newData;
  return that;
};

// 获得右侧面板数据
Class.prototype.getData = function (value) {
  var that = this;
  var options = that.config;
  var selectedData = [];
  that.setValue();
  layui.each(value || options.value, function (index, item) {
    layui.each(options.data, function (index2, item2) {
      delete item2.selected;
      if (item == item2.value) {
        selectedData.push(item2);
      }
    });
  });
  return selectedData;
};

// 执行穿梭
Class.prototype.transfer = function (_index, elem) {
  var that = this;
  var options = that.config;
  var thisBoxElem = that.layBox.eq(_index);
  var arr = [];
  if (!elem) {
    // 通过按钮触发找到选中的进行移动
    thisBoxElem.each(function () {
      var othis = $(this);
      var thisDataElem = othis.find('.' + CONST.ELEM_DATA);
      thisDataElem.children('li').each(function () {
        var thisList = $(this);
        var thisElemCheckbox = thisList.find('input[type="checkbox"]');
        var isHide = thisElemCheckbox.data('hide');
        if (thisElemCheckbox[0].checked && !isHide) {
          thisElemCheckbox[0].checked = false;
          thisBoxElem.siblings('.' + CONST.ELEM_BOX).find('.' + CONST.ELEM_DATA).append(thisList.clone());
          thisList.remove();

          // 记录当前穿梭的数据
          arr.push(thisElemCheckbox[0].value);
        }
        that.setValue();
      });
    });
  } else {
    // 双击单条记录移动
    var thisList = elem;
    var thisElemCheckbox = thisList.find('input[type="checkbox"]');
    thisElemCheckbox[0].checked = false;
    thisBoxElem.siblings('.' + CONST.ELEM_BOX).find('.' + CONST.ELEM_DATA).append(thisList.clone());
    thisList.remove();

    // 记录当前穿梭的数据
    arr.push(thisElemCheckbox[0].value);
    that.setValue();
  }
  that.renderCheckBtn();

  // 穿梭时，如果另外一个框正在搜索，则触发匹配
  var siblingInput = thisBoxElem.siblings('.' + CONST.ELEM_BOX).find('.' + CONST.ELEM_SEARCH + ' input');
  siblingInput.val() === '' || siblingInput.trigger('keyup');

  // 穿梭时的回调
  options.onchange && options.onchange(that.getData(arr), _index);
};

// 事件
Class.prototype.events = function () {
  var that = this;
  var options = that.config;

  // 左右复选框
  that.elem.on('click', 'input[lay-filter="layTransferCheckbox"]+', function () {
    var thisElemCheckbox = $(this).prev();
    var checked = thisElemCheckbox[0].checked;
    var thisDataElem = thisElemCheckbox.parents('.' + CONST.ELEM_BOX).eq(0).find('.' + CONST.ELEM_DATA);
    if (thisElemCheckbox[0].disabled) return;

    // 判断是否全选
    if (thisElemCheckbox.attr('lay-type') === 'all') {
      thisDataElem.find('input[type="checkbox"]').each(function () {
        if (this.disabled) return;
        this.checked = checked;
      });
    }
    setTimeout(function () {
      that.renderCheckBtn({
        stopNone: true
      });
    }, 0);
  });

  // 双击穿梭
  that.elem.on('dblclick', '.' + CONST.ELEM_DATA + '>li', function () {
    var elemThis = $(this);
    var thisElemCheckbox = elemThis.children('input[type="checkbox"]');
    var thisDataElem = elemThis.parent();
    var thisBoxElem = thisDataElem.parent();
    var index = thisBoxElem.data('index');
    if (thisElemCheckbox[0].disabled) return;

    // 根据 dblclick 回调函数返回值决定是否执行穿梭 --- 2.9.3+
    var ret = typeof options.dblclick === 'function' ? options.dblclick({
      elem: elemThis,
      data: that.getData([thisElemCheckbox[0].value])[0],
      index: index
    }) : null;
    if (ret === false) return;
    that.transfer(index, elemThis);
  });

  // 穿梭按钮事件
  that.layBtn.on('click', function () {
    var othis = $(this);
    var _index = othis.data('index');
    if (othis.hasClass(CONST.BTN_DISABLED)) return;
    that.transfer(_index);
  });

  // 搜索
  that.laySearch.find('input').on('keyup', function () {
    var value = this.value;
    var thisDataElem = $(this).parents('.' + CONST.ELEM_SEARCH).eq(0).siblings('.' + CONST.ELEM_DATA);
    var thisListElem = thisDataElem.children('li');
    thisListElem.each(function () {
      var thisList = $(this);
      var thisElemCheckbox = thisList.find('input[type="checkbox"]');
      var title = thisElemCheckbox[0].title;

      // 是否区分大小写
      if (options.showSearch !== 'cs') {
        title = title.toLowerCase();
        value = value.toLowerCase();
      }
      var isMatch = title.indexOf(value) !== -1;
      thisList[isMatch ? 'removeClass' : 'addClass'](CONST.CLASS_HIDE);
      thisElemCheckbox.data('hide', isMatch ? false : true);
    });
    that.renderCheckBtn();

    // 无匹配数据视图
    var isNone = thisListElem.length === thisDataElem.children('li.' + CONST.CLASS_HIDE).length;
    that.noneView(thisDataElem, isNone ? options.text.searchNone : '');
  });
};

// 扩展组件接口
$.extend(component, {
  // 获得选中的数据（右侧面板）
  getData: function (id) {
    var that = component.getInst(id);
    if (!that) return;
    return that.getData();
  }
});

export { component as transfer };
