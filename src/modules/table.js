/**
 * layui.table
 * 表格组件
 */

layui.define(['lay', 'laytpl', 'laypage', 'form', 'util'], function(exports){
  "use strict";

  var $ = layui.$;
  var lay = layui.lay;
  var laytpl = layui.laytpl;
  var laypage = layui.laypage;
  var layer = layui.layer;
  var form = layui.form;
  var util = layui.util;
  var hint = layui.hint();
  var device = layui.device();

  // api
  var table = {
    config: { // 全局配置项
      checkName: 'LAY_CHECKED', // 是否选中状态的特定字段名
      indexName: 'LAY_INDEX', // 初始下标索引名，用于恢复当前页表格排序
      numbersName: 'LAY_NUM', // 序号
      disabledName: 'LAY_DISABLED' // 禁用状态的特定字段名
    },
    cache: {}, // 数据缓存
    index: layui.table ? (layui.table.index + 10000) : 0,

    // 设置全局项
    set: function(options){
      var that = this;
      that.config = $.extend({}, that.config, options);
      return that;
    },

    // 事件
    on: function(events, callback){
      return layui.onevent.call(this, MOD_NAME, events, callback);
    }
  };

  // 操作当前实例
  var thisTable = function(){
    var that = this;
    var options = that.config;
    var id = options.id || options.index;

    return {
      config: options,
      reload: function(options, deep){
        that.reload.call(that, options, deep);
      },
      reloadData: function(options, deep){
        table.reloadData(id, options, deep);
      },
      setColsWidth: function(){
        that.setColsWidth.call(that);
      },
      resize: function(){ // 重置表格尺寸/结构
        that.resize.call(that);
      }
    }
  };

  // 获取当前实例
  var getThisTable = function(id){
    var that = thisTable.that[id];
    if(!that) hint.error(id ? ('The table instance with ID \''+ id +'\' not found') : 'ID argument required');
    return that || null;
  };

  // 获取当前实例配置项
  var getThisTableConfig = function(id){
    var config = thisTable.config[id];
    if(!config) hint.error(id ? ('The table instance with ID \''+ id +'\' not found') : 'ID argument required');
    return config || null;
  };

  // 解析自定义模板数据
  var parseTempData = function(obj){
    obj = obj || {};

    var options = this.config || {};
    var item3 = obj.item3; // 表头数据
    var content = obj.content; // 原始内容
    if (item3.type === 'numbers') content = obj.tplData[table.config.numbersName];

    // 是否编码 HTML
    var escaped = 'escape' in item3 ? item3.escape : options.escape;
    if(escaped) content = util.escape(content);

    // 获取模板
    var templet = obj.text && item3.exportTemplet || (item3.templet || item3.toolbar);

    // 获取模板内容
    if(templet){
      content = typeof templet === 'function'
        ? templet.call(item3, obj.tplData, obj.obj)
      : laytpl($(templet).html() || String(content)).render($.extend({
        LAY_COL: item3
      }, obj.tplData));
    }

    // 是否只返回文本
    return obj.text ? $('<div>'+ content +'</div>').text() : content;
  };

  // 字符
  var MOD_NAME = 'table';
  var ELEM = '.layui-table';
  var THIS = 'layui-this';
  var SHOW = 'layui-show';
  var HIDE = 'layui-hide';
  var HIDE_V = 'layui-hide-v';
  var DISABLED = 'layui-disabled';
  var NONE = 'layui-none';

  var ELEM_VIEW = 'layui-table-view';
  var ELEM_TOOL = '.layui-table-tool';
  var ELEM_BOX = '.layui-table-box';
  var ELEM_INIT = '.layui-table-init';
  var ELEM_HEADER = '.layui-table-header';
  var ELEM_BODY = '.layui-table-body';
  var ELEM_MAIN = '.layui-table-main';
  var ELEM_FIXED = '.layui-table-fixed';
  var ELEM_FIXL = '.layui-table-fixed-l';
  var ELEM_FIXR = '.layui-table-fixed-r';
  var ELEM_TOTAL = '.layui-table-total';
  var ELEM_PAGE = '.layui-table-page';
  var ELEM_PAGE_VIEW = '.layui-table-pageview';
  var ELEM_SORT = '.layui-table-sort';
  var ELEM_CHECKED = 'layui-table-checked';
  var ELEM_EDIT = 'layui-table-edit';
  var ELEM_HOVER = 'layui-table-hover';
  var ELEM_GROUP = 'laytable-cell-group';
  var ELEM_COL_SPECIAL = 'layui-table-col-special';
  var ELEM_TOOL_PANEL = 'layui-table-tool-panel';
  var ELEM_EXPAND = 'layui-table-expanded'

  var DATA_MOVE_NAME = 'LAY_TABLE_MOVE_DICT';

  // thead 区域模板
  var TPL_HEADER = function(options){
    var rowCols = '{{#var colspan = layui.type(item2.colspan2) === \'number\' ? item2.colspan2 : item2.colspan; if(colspan){}} colspan="{{=colspan}}"{{#} if(item2.rowspan){}} rowspan="{{=item2.rowspan}}"{{#}}}';

    options = options || {};
    return ['<table cellspacing="0" cellpadding="0" border="0" class="layui-table" '
      ,'{{# if(d.data.skin){ }}lay-skin="{{=d.data.skin}}"{{# } }} {{# if(d.data.size){ }}lay-size="{{=d.data.size}}"{{# } }} {{# if(d.data.even){ }}lay-even{{# } }}>'
      ,'<thead>'
      ,'{{# layui.each(d.data.cols, function(i1, item1){ }}'
        ,'<tr>'
        ,'{{# layui.each(item1, function(i2, item2){ }}'
          ,'{{# if(item2.fixed && item2.fixed !== "right"){ left = true; } }}'
          ,'{{# if(item2.fixed === "right"){ right = true; } }}'
          ,function(){
            if(options.fixed && options.fixed !== 'right'){
              return '{{# if(item2.fixed && item2.fixed !== "right"){ }}';
            }
            if(options.fixed === 'right'){
              return '{{# if(item2.fixed === "right"){ }}';
            }
            return '';
          }()
          ,'{{# var isSort = !(item2.colGroup) && item2.sort; }}'
          ,'<th data-field="{{= item2.field||i2 }}" data-key="{{=d.index}}-{{=i1}}-{{=i2}}" {{# if( item2.parentKey){ }}data-parentkey="{{= item2.parentKey }}"{{# } }} {{# if(item2.minWidth){ }}data-minwidth="{{=item2.minWidth}}"{{# } }} {{# if(item2.maxWidth){ }}data-maxwidth="{{=item2.maxWidth}}"{{# } }} {{# if(item2.style){ }}style="{{=item2.style}}"{{# } }} '+ rowCols +' {{# if(item2.unresize || item2.colGroup){ }}data-unresize="true"{{# } }} class="{{# if(item2.hide){ }}layui-hide{{# } }}{{# if(isSort){ }} layui-unselect{{# } }}{{# if(!item2.field){ }} layui-table-col-special{{# } }}"{{# if(item2.title){ }} title="{{ layui.$(\'<div>\' + item2.title + \'</div>\').text() }}"{{# } }}>'
            ,'<div class="layui-table-cell laytable-cell-'
              ,'{{# if(item2.colGroup){ }}'
                ,'group'
              ,'{{# } else { }}'
                ,'{{=d.index}}-{{=i1}}-{{=i2}}'
                ,'{{# if(item2.type !== "normal"){ }}'
                  ,' laytable-cell-{{= item2.type }}'
                ,'{{# } }}'
              ,'{{# } }}'
            ,'" {{#if(item2.align){}}align="{{=item2.align}}"{{#}}}>'
              ,'{{# if(item2.type === "checkbox"){ }}' //复选框
                ,'<input type="checkbox" name="layTableCheckbox" lay-skin="primary" lay-filter="layTableAllChoose" {{# if(item2[d.data.checkName]){ }}checked{{# }; }}>'
              ,'{{# } else { }}'
                ,'<span>{{-item2.title||""}}</span>'
                ,'{{# if(isSort){ }}'
                  ,'<span class="layui-table-sort layui-inline"><i class="layui-edge layui-table-sort-asc" title="升序"></i><i class="layui-edge layui-table-sort-desc" title="降序"></i></span>'
                ,'{{# } }}'
              ,'{{# } }}'
            ,'</div>'
          ,'</th>'
          ,(options.fixed ? '{{# }; }}' : '')
        ,'{{# }); }}'
        ,'</tr>'
      ,'{{# }); }}'
      ,'</thead>'
    ,'</table>'].join('');
  };

  // tbody 区域模板
  var TPL_BODY = ['<table cellspacing="0" cellpadding="0" border="0" class="layui-table" '
    ,'{{# if(d.data.skin){ }}lay-skin="{{=d.data.skin}}"{{# } }} {{# if(d.data.size){ }}lay-size="{{=d.data.size}}"{{# } }} {{# if(d.data.even){ }}lay-even{{# } }}>'
    ,'<tbody></tbody>'
  ,'</table>'].join('');

  // 主模板
  var TPL_MAIN = [
    ,'{{# if(d.data.toolbar){ }}'
    ,'<div class="layui-table-tool">'
      ,'<div class="layui-table-tool-temp"></div>'
      ,'<div class="layui-table-tool-self"></div>'
    ,'</div>'
    ,'{{# } }}'

    ,'<div class="layui-table-box">'
      ,'{{# if(d.data.loading){ }}'
      ,'<div class="layui-table-init" style="background-color: #fff;">'
        ,'<i class="layui-icon layui-icon-loading layui-anim layui-anim-rotate layui-anim-loop"></i>'
      ,'</div>'
      ,'{{# } }}'

      ,'{{# var left, right; }}'
      ,'<div class="layui-table-header">'
        ,TPL_HEADER()
      ,'</div>'
      ,'<div class="layui-table-body layui-table-main">'
        ,TPL_BODY
      ,'</div>'

      ,'{{# if(left){ }}'
      ,'<div class="layui-table-fixed layui-table-fixed-l">'
        ,'<div class="layui-table-header">'
          ,TPL_HEADER({fixed: true})
        ,'</div>'
        ,'<div class="layui-table-body">'
          ,TPL_BODY
        ,'</div>'
      ,'</div>'
      ,'{{# }; }}'

      ,'{{# if(right){ }}'
      ,'<div class="layui-table-fixed layui-table-fixed-r layui-hide">'
        ,'<div class="layui-table-header">'
          ,TPL_HEADER({fixed: 'right'})
          ,'<div class="layui-table-mend"></div>'
        ,'</div>'
        ,'<div class="layui-table-body">'
          ,TPL_BODY
        ,'</div>'
      ,'</div>'
      ,'{{# }; }}'
    ,'</div>'

    ,'{{# if(d.data.totalRow){ }}'
      ,'<div class="layui-table-total">'
        ,'<table cellspacing="0" cellpadding="0" border="0" class="layui-table" '
        ,'{{# if(d.data.skin){ }}lay-skin="{{=d.data.skin}}"{{# } }} {{# if(d.data.size){ }}lay-size="{{=d.data.size}}"{{# } }} {{# if(d.data.even){ }}lay-even{{# } }}>'
          ,'<tbody><tr><td><div class="layui-table-cell" style="visibility: hidden;">Total</div></td></tr></tbody>'
      , '</table>'
      ,'</div>'
    ,'{{# } }}'

    ,'<div class="layui-table-column layui-table-page layui-hide">'
      ,'<div class="layui-inline layui-table-pageview" id="layui-table-page{{=d.index}}"></div>'
    ,'</div>'
  ].join('');

  var _WIN = $(window);
  var _DOC = $(document);

  // constructor
  var Class = function(options){
    var that = this;
    that.index = ++table.index;
    that.config = $.extend({}, that.config, table.config, options);
    that.render();
  };

  // 初始默认配置
  Class.prototype.config = {
    limit: 10, // 每页显示的数量
    loading: true, // 请求数据时，是否显示 loading
    escape: true, // 是否开启 HTML 编码功能，即转义 html 原文
    cellMinWidth: 60, // 所有单元格默认最小宽度
    cellMaxWidth: Number.MAX_VALUE, // 所有单元格默认最大宽度
    editTrigger: 'click', // 单元格编辑的事件触发方式
    defaultToolbar: ['filter', 'exports', 'print'], // 工具栏右侧图标
    defaultContextmenu: true, // 显示默认上下文菜单
    autoSort: true, // 是否前端自动排序。如果否，则需自主排序（通常为服务端处理好排序）
    text: {
      none: '无数据'
    },
    cols: []
  };

  // 表格渲染
  Class.prototype.render = function(type){
    var that = this;
    var options = that.config;

    options.elem = $(options.elem);
    options.where = options.where || {};

    // 初始化 id 属性 - 优先取 options > 元素 id > 自增索引
    var id = options.id = 'id' in options ? options.id : (
      options.elem.attr('id') || that.index
    );

    thisTable.that[id] = that; // 记录当前实例对象
    thisTable.config[id] = options; // 记录当前实例配置项

    //请求参数的自定义格式
    options.request = $.extend({
      pageName: 'page',
      limitName: 'limit'
    }, options.request)

    // 响应数据的自定义格式
    options.response = $.extend({
      statusName: 'code', //规定数据状态的字段名称
      statusCode: 0, //规定成功的状态码
      msgName: 'msg', //规定状态信息的字段名称
      dataName: 'data', //规定数据总数的字段名称
      totalRowName: 'totalRow', //规定数据统计的字段名称
      countName: 'count'
    }, options.response);

    //如果 page 传入 laypage 对象
    if(options.page !== null && typeof options.page === 'object'){
      options.limit = options.page.limit || options.limit;
      options.limits = options.page.limits || options.limits;
      that.page = options.page.curr = options.page.curr || 1;
      delete options.page.elem;
      delete options.page.jump;
    }

    if(!options.elem[0]) return that;

    // 若元素未设 lay-filter 属性，则取实例 id 值
    if(!options.elem.attr('lay-filter')){
      options.elem.attr('lay-filter', options.id);
    }

    // 仅重载数据
    if(type === 'reloadData'){
       // 请求数据
      return that.pullData(that.page, {
        type: 'reloadData'
      });
    }

    // 初始化索引
    options.index = that.index;
    that.key = options.id || options.index;

    //初始化一些其他参数
    that.setInit();

    //高度铺满：full-差距值
    if(options.height && /^full-\d+$/.test(options.height)){
      that.fullHeightGap = options.height.split('-')[1];
      options.height = _WIN.height() - that.fullHeightGap;
    } else if (options.height && /^#\w+\S*-\d+$/.test(options.height)) {
      var parentDiv = options.height.split("-");
      that.parentHeightGap = parentDiv.pop();
      that.parentDiv = parentDiv.join("-");
      options.height = $(that.parentDiv).height() - that.parentHeightGap;
    }

    // 开始插入替代元素
    var othis = options.elem;
    var hasRender = othis.next('.' + ELEM_VIEW);

    // 主容器
    var reElem = that.elem = $('<div></div>');

    // 添加 className
    reElem.addClass(function(){
      var arr = [
        ELEM_VIEW,
        ELEM_VIEW +'-'+ that.index,
        'layui-form',
        'layui-border-box'
      ];
      if(options.className) arr.push(options.className);
      return arr.join(' ');
    }()).attr({
      'lay-filter': 'LAY-TABLE-FORM-DF-'+ that.index,
      'lay-id': options.id,
      'style': function(){
        var arr = [];
        if(options.width) arr.push('width:'+ options.width + 'px;');
        // if(options.height) arr.push('height:'+ options.height + 'px;');
        return arr.join('')
      }()
    }).html(laytpl(TPL_MAIN, {
      open: '{{', // 标签符前缀
      close: '}}' // 标签符后缀
    }).render({
      data: options,
      index: that.index //索引
    }));

    // 初始化样式
    that.renderStyle();

    // 生成替代元素
    hasRender[0] && hasRender.remove(); // 如果已经渲染，则 Rerender
    othis.after(reElem);

    // 各级容器
    that.layTool = reElem.find(ELEM_TOOL);
    that.layBox = reElem.find(ELEM_BOX);
    that.layHeader = reElem.find(ELEM_HEADER);
    that.layMain = reElem.find(ELEM_MAIN);
    that.layBody = reElem.find(ELEM_BODY);
    that.layFixed = reElem.find(ELEM_FIXED);
    that.layFixLeft = reElem.find(ELEM_FIXL);
    that.layFixRight = reElem.find(ELEM_FIXR);
    that.layTotal = reElem.find(ELEM_TOTAL);
    that.layPage = reElem.find(ELEM_PAGE);

    // 初始化头部工具栏
    that.renderToolbar();

    // 初始化底部分页栏
    that.renderPagebar();

    // 让表格平铺
    that.fullSize();

    that.pullData(that.page); // 请求数据
    that.events(); // 事件
  };

  // 根据列类型，定制化参数
  Class.prototype.initOpts = function(item){
    var that = this
    var options = that.config;
    var initWidth = {
      checkbox: 50,
      radio: 50,
      space: 30,
      numbers: 60
    };

    // 让 type 参数兼容旧版本
    if(item.checkbox) item.type = "checkbox";
    if(item.space) item.type = "space";
    if(!item.type) item.type = "normal";

    if(item.type !== "normal"){
      item.unresize = true;
      item.width = item.width || initWidth[item.type];
    }
  };

  //初始化一些参数
  Class.prototype.setInit = function(type){
    var that = this;
    var options = that.config;

    options.clientWidth = options.width || function(){ //获取容器宽度
      //如果父元素宽度为0（一般为隐藏元素），则继续查找上层元素，直到找到真实宽度为止
      var getWidth = function(parent){
        var width, isNone;
        parent = parent || options.elem.parent()
        width = parent.width();
        try {
          isNone = parent.css('display') === 'none';
        } catch(e){}
        if(parent[0] && (!width || isNone)) return getWidth(parent.parent());
        return width;
      };
      return getWidth();
    }();

    if(type === 'width') return options.clientWidth;
    // 初始化高度配置，如果设置了最高高度，以最高高度形式为准
    options.height = options.maxHeight || options.height;

    // 初始化 css 参数
    if(options.css && options.css.indexOf(ELEM_VIEW) === -1){
      var css = options.css.split('}');
      layui.each(css, function(index, value){
        if(value){
          css[index] = '.'+ ELEM_VIEW + '-'+ that.index + ' ' + value;
        }
      });
      options.css = css.join('}');
    }

    // 封装对 col 的配置处理
    var initChildCols = function (i1, item1, i2, item2) {
      //如果列参数为空，则移除
      if (!item2) {
        item1.splice(i2, 1);
        return;
      }

      item2.key = [options.index, i1, i2].join('-');
      item2.colspan = item2.colspan || 0;
      item2.rowspan = item2.rowspan || 0;

      //根据列类型，定制化参数
      that.initOpts(item2);

      //设置列的父列索引
      //如果是组合列，则捕获对应的子列
      var indexChild = i1 + (parseInt(item2.rowspan) || 1);
      if (indexChild < options.cols.length) { // 只要不是最后一层都会有子列
        item2.colGroup = true;
        var childIndex = 0;
        layui.each(options.cols[indexChild], function (i22, item22) {
          //如果子列已经被标注为{HAS_PARENT}，或者子列累计 colspan 数等于父列定义的 colspan，则跳出当前子列循环
          if (item22.HAS_PARENT || (childIndex >= 1 && childIndex == (item2.colspan || 1))) return;

          item22.HAS_PARENT = true;
          item22.parentKey = [options.index, i1, i2].join('-') // i1 + '-' + i2;
          childIndex = childIndex + parseInt(item22.colspan > 1 ? item22.colspan : 1);
          initChildCols(indexChild, options.cols[indexChild], i22, item22);
        });
      } else {
        item2.colGroup = false;
      }
      item2.hide = item2.hide && !item2.colGroup || false; // 初始化中中间节点的hide信息不做处理，否则会出错，如果需要必须将其子节点也都同步成hide
    };

    // 初始化列参数
    layui.each(options.cols, function(i1, item1){
      layui.each(item1, function(i2, item2){
        if (i1) {
          delete item2.HAS_PARENT; // 去掉临时的计数排除标识，避免有新字段插入的时候重新计算被跳过导致下标出错的问题
        } else {
          initChildCols(i1, item1, i2, item2); // 只解析顶层节点由递归完成解析
        }
      });
    });

  };

  // 初始化样式
  Class.prototype.renderStyle = function() {
    var that = this;
    var options = that.config;
    var index = that.index;
    var text = [];

    // 单元格宽度
    layui.each(options.cols, function(i1, item1) {
      layui.each(item1, function(i2, item2) {
        var key = [index, i1, i2].join('-');
        var val = item2.width ? ['width: ', item2.width, 'px'].join('') : '';
        text.push('.laytable-cell-'+ key +'{'+ val +'}');
      });
    });

    // 自定义行样式
    (function (lineStyle) {
      if (!lineStyle) return;
      var trClassName = '.layui-table-view-'+ index +' .layui-table-body .layui-table tr';
      var rules = lineStyle.split(';');
      var cellMaxHeight = 'none';

      // 计算单元格最大高度
      layui.each(rules, function(i, rule) {
        rule = rule.split(':');
        if (rule[0] === 'height') {
          var val = parseFloat(rule[1]);
          if (!isNaN(val)) cellMaxHeight = (val - 1) + 'px';
          return true;
        }
      });

      // 多行相关样式
      layui.each([
        '{'+ lineStyle +'}',
        '.layui-table-cell{height: auto; max-height: '+ cellMaxHeight +'; white-space: normal; text-overflow: clip;}',
        '> td:hover > .layui-table-cell{overflow: auto;}'
      ].concat(
        device.ie ? [
          '.layui-table-edit{height: '+ cellMaxHeight +';}',
          'td[data-edit]:hover:after{height: '+ cellMaxHeight +';}'
        ] : []
      ), function(i, val) {
        val && text.push(trClassName + ' ' + val);
      });
    })(options.lineStyle);

    // 自定义 css 属性
    if (options.css) text.push(options.css);

    // 生成 style
    lay.style({
      target: that.elem[0],
      text: text.join(''),
      id: 'DF-table-'+ index
    });
  };

  // 初始工具栏
  Class.prototype.renderToolbar = function(){
    var that = this
    var options = that.config

    // 添加工具栏左侧模板
    var leftDefaultTemp = [
      '<div class="layui-inline" lay-event="add"><i class="layui-icon layui-icon-add-1"></i></div>',
      '<div class="layui-inline" lay-event="update"><i class="layui-icon layui-icon-edit"></i></div>',
      '<div class="layui-inline" lay-event="delete"><i class="layui-icon layui-icon-delete"></i></div>'
    ].join('');
    var elemToolTemp = that.layTool.find('.layui-table-tool-temp');

    if(options.toolbar === 'default'){
      elemToolTemp.html(leftDefaultTemp);
    } else if(typeof options.toolbar === 'string'){
      var toolbarHtml = $(options.toolbar).html() || '';
      toolbarHtml && elemToolTemp.html(
        laytpl(toolbarHtml).render(options)
      );
    }

    // 添加工具栏右侧面板
    var layout = {
      filter: {
        title: '筛选列',
        layEvent: 'LAYTABLE_COLS',
        icon: 'layui-icon-cols'
      },
      exports: {
        title: '导出',
        layEvent: 'LAYTABLE_EXPORT',
        icon: 'layui-icon-export'
      },
      print: {
        title: '打印',
        layEvent: 'LAYTABLE_PRINT',
        icon: 'layui-icon-print'
      }
    }, iconElem = [];

    if(typeof options.defaultToolbar === 'object'){
      layui.each(options.defaultToolbar, function(i, item){
        var thisItem = typeof item === 'string' ? layout[item] : item;
        if(thisItem){
          iconElem.push('<div class="layui-inline" title="'+ thisItem.title +'" lay-event="'+ thisItem.layEvent +'">'
            +'<i class="layui-icon '+ thisItem.icon +'"></i>'
          +'</div>');
        }
      });
    }
    that.layTool.find('.layui-table-tool-self').html(iconElem.join(''));
  };

  // 分页栏
  Class.prototype.renderPagebar = function(){
    var that = this;
    var options = that.config;

    var layPagebar = that.layPagebar = $('<div class="layui-inline layui-table-pagebar"></div>');

    // 开启分页栏自定义模板
    if(options.pagebar){
      var pagebarHtml = $(options.pagebar).html() || '';
      pagebarHtml && layPagebar.append(laytpl(pagebarHtml).render(options));
      that.layPage.append(layPagebar);
    }
  };

  // 同步表头父列的相关值
  Class.prototype.setParentCol = function(hide, parentKey){
    var that = this;
    var options = that.config;

    var parentTh = that.layHeader.find('th[data-key="'+ parentKey +'"]'); // 获取父列元素
    var parentColspan = parseInt(parentTh.attr('colspan')) || 0;

    if(parentTh[0]){
      var arrParentKey = parentKey.split('-');
      var getThisCol = options.cols[arrParentKey[1]][arrParentKey[2]];

      hide ? parentColspan-- : parentColspan++;

      parentTh.attr('colspan', parentColspan);
      parentTh[parentColspan ? 'removeClass' : 'addClass'](HIDE); // 如果子列显示，父列必然需要显示

      getThisCol.colspan2 = parentColspan; // 更新实际的 colspan 数
      getThisCol.hide = parentColspan < 1; // 同步 hide 参数

      // 递归，继续往上查询是否有父列
      var nextParentKey = parentTh.data('parentkey');
      nextParentKey && that.setParentCol(hide, nextParentKey);
    }
  };

  // 多级表头补丁
  Class.prototype.setColsPatch = function(){
    var that = this;
    var options = that.config;

    // 同步表头父列的相关值
    layui.each(options.cols, function(i1, item1){
      layui.each(item1, function(i2, item2){
        if(item2.hide){
          that.setParentCol(item2.hide, item2.parentKey);
        }
      });
    });
  };

  // 设置组合表头的最大宽度
  Class.prototype.setGroupWidth = function(th){
    var that = this;
    var options = that.config;

    if(options.cols.length <= 1) return;

    // 获取表头组合
    var groups = that.layHeader.find((
      // 根据当前活动的表头 parentkey 属性查找其组合表头
      th ? ('th[data-key='+ th.data('parentkey') +']>') : ''
    ) + '.' + ELEM_GROUP); // 若无指向当前活动表头，则自下而上获取所有组合表头

    groups.css('width', 0);
    layui.each(groups.get().reverse(), function(){
      var othis = $(this);
      var key = othis.parent().data('key');
      var maxWidth = 0;

      that.layHeader.eq(0).find('th[data-parentkey='+ key +']').width(function(i, width){
        var oTh = $(this);
        if(oTh.hasClass(HIDE)) return;
        width > 0 && (maxWidth += width);
      });

      // 给组合表头赋值最大宽度
      if(maxWidth) othis.css('max-width', maxWidth - 1);

      // 若当前活动的组合表头仍存在上级，则继续向上设置
      if(th && othis.parent().data('parentkey')){
        that.setGroupWidth(othis.parent());
      }
    });
    groups.css('width', 'auto');
  };

  // 动态分配列宽
  Class.prototype.setColsWidth = function(){
    var that = this;
    var options = that.config;
    var colNums = 0; // 列个数
    var autoColNums = 0; // 自动列宽的列个数
    var autoWidth = 0; // 自动列分配的宽度
    var countWidth = 0; // 所有列总宽度和
    var cntrWidth = that.setInit('width');

    // 统计列个数
    that.eachCols(function(i, item){
      item.hide || colNums++;
    });

    // 减去边框差和滚动条宽
    cntrWidth = cntrWidth - function(){
      return (options.skin === 'line' || options.skin === 'nob') ? 2 : colNums + 1;
    }() - that.getScrollWidth(that.layMain[0]) - 1;

    // 计算自动分配的宽度
    var getAutoWidth = function(back){
      // 遍历所有列
      layui.each(options.cols, function(i1, item1){
        layui.each(item1, function(i2, item2){
          var width = 0;
          var minWidth = item2.minWidth || options.cellMinWidth; // 最小宽度
          var maxWidth = item2.maxWidth || options.cellMaxWidth; // 最大宽度

          if(!item2){
            item1.splice(i2, 1);
            return;
          }

          if(item2.colGroup || item2.hide) return;

          if(!back){
            width = item2.width || 0;
            if(/\d+%$/.test(width)){ // 列宽为百分比
              width = Math.floor((parseFloat(width) / 100) * cntrWidth);
              width < minWidth && (width = minWidth);
              width > maxWidth && (width = maxWidth);
            } else if(!width){ // 列宽未填写
              item2.width = width = 0;
              autoColNums++;
            } else if(item2.type === 'normal'){
              // 若 width 小于 minWidth， 则将 width 值自动设为 minWidth 的值
              width < minWidth && (item2.width = width = minWidth);
              // 若 width 大于 maxWidth， 则将 width 值自动设为 maxWidth 的值
              width > maxWidth && (item2.width = width = maxWidth);
            }
          } else if(autoWidth && autoWidth < minWidth){
            autoColNums--;
            width = minWidth;
          } else if(autoWidth && autoWidth > maxWidth){
            autoColNums--;
            width = maxWidth;
          }

          if(item2.hide) width = 0;
          countWidth = countWidth + width;
        });
      });

      // 如果未填充满，则将剩余宽度平分
      (cntrWidth > countWidth && autoColNums > 0) && (
        autoWidth = (cntrWidth - countWidth) / autoColNums
      );
    }

    getAutoWidth();
    getAutoWidth(true); // 重新检测分配的宽度是否低于最小列宽

    // 记录自动列数
    that.autoColNums = autoColNums = autoColNums > 0 ? autoColNums : 0;

    // 设置列宽
    that.eachCols(function(i3, item3){
      var minWidth = item3.minWidth || options.cellMinWidth;
      var maxWidth = item3.maxWidth || options.cellMaxWidth;

      if(item3.colGroup || item3.hide) return;

      // 给未分配宽的列平均分配宽
      if(item3.width === 0){
        that.cssRules(item3.key, function(item){
          item.style.width = Math.floor(function(){
            if(autoWidth < minWidth) return minWidth;
            if(autoWidth > maxWidth) return maxWidth;
            return autoWidth;
          }()) + 'px';
        });
      }

      // 给设定百分比的列分配列宽
      else if(/\d+%$/.test(item3.width)){
        that.cssRules(item3.key, function(item){
          var width = Math.floor((parseFloat(item3.width) / 100) * cntrWidth);
          width < minWidth && (width = minWidth);
          width > maxWidth && (width = maxWidth);
          item.style.width = width + 'px';
        });
      }

      // 给拥有普通 width 值的列分配最新列宽
      else {
        that.cssRules(item3.key, function(item){
          item.style.width = item3.width + 'px';
        });
      }
    });

    // 填补 Math.floor 造成的数差
    var patchNums = that.layMain.width() - that.getScrollWidth(that.layMain[0])
    - that.layMain.children('table').outerWidth();

    if(that.autoColNums > 0 && patchNums >= -colNums && patchNums <= colNums){
      var getEndTh = function(th){
        var field;
        th = th || that.layHeader.eq(0).find('thead > tr:first-child > th:last-child')
        field = th.data('field');
        if(!field && th.prev()[0]){
          return getEndTh(th.prev())
        }
        return th;
      };
      var th = getEndTh();
      var key = th.data('key');

      that.cssRules(key, function(item){
        var width = item.style.width || th.outerWidth();
        item.style.width = (parseFloat(width) + patchNums) + 'px';

        // 二次校验，如果仍然出现横向滚动条（通常是 1px 的误差导致）
        if(that.layMain.height() - that.layMain.prop('clientHeight') > 0){
          item.style.width = (parseFloat(item.style.width) - 1) + 'px';
        }
      });
    }

    that.setGroupWidth();

    // 如果表格内容为空（无数据 或 请求异常）
    if (that.layMain.find('tbody').is(":empty")) {
      // 将表格宽度设置为跟表头一样的宽度，使之可以出现底部滚动条，以便滚动查看所有字段
      var headerWidth = that.layHeader.first().children('table').width()
      that.layMain.find('table').width(headerWidth);
    } else {
      that.layMain.find('table').width('auto');
    }

    that.loading(!0);
  };

  // 重置表格尺寸/结构
  Class.prototype.resize = function(){
    var that = this;

    if (!that.layMain) return;

    that.fullSize(); // 让表格铺满
    that.setColsWidth(); // 自适应列宽
    that.scrollPatch(); // 滚动条补丁
  };

  // 表格重载
  Class.prototype.reload = function(options, deep, type){
    var that = this;

    options = options || {};
    delete that.haveInit;

    // 防止数组深度合并
    layui.each(options, function(key, item){
      if(layui.type(item) === 'array') delete that.config[key];
    });

    // 对参数进行深度或浅扩展
    that.config = $.extend(deep, {}, that.config, options);
    if (type !== 'reloadData') {
      layui.each(that.config.cols, function (i1, item1) {
        layui.each(item1, function (i2, item2) {
          delete item2.colspan2;
        })
      })
      delete that.config.HAS_SET_COLS_PATCH;
    }
    // 执行渲染
    that.render(type);
  };

  // 异常提示
  Class.prototype.errorView = function(html){
    var that = this
    ,elemNone = that.layMain.find('.'+ NONE)
    ,layNone = $('<div class="'+ NONE +'">'+ (html || 'Error') +'</div>');

    if(elemNone[0]){
      that.layNone.remove();
      elemNone.remove();
    }

    that.layFixed.addClass(HIDE);
    that.layMain.find('tbody').html('');

    that.layMain.append(that.layNone = layNone);

    // 异常情况下对 page 和 total 的内容处理
    that.layTotal.addClass(HIDE_V);
    that.layPage.find(ELEM_PAGE_VIEW).addClass(HIDE_V);

    table.cache[that.key] = []; //格式化缓存数据

    that.syncCheckAll();
    that.renderForm();
    that.setColsWidth();
  };

  // 初始页码
  Class.prototype.page = 1;

  // 获得数据
  Class.prototype.pullData = function(curr, opts){
    var that = this;
    var options = that.config;
    // 同步表头父列的相关值
    options.HAS_SET_COLS_PATCH || that.setColsPatch();
    options.HAS_SET_COLS_PATCH = true;
    var request = options.request;
    var response = options.response;
    var res;
    var sort = function(){
      if(typeof options.initSort === 'object'){
        that.sort({
          field: options.initSort.field,
          type: options.initSort.type,
          reloadType: opts.type
        });
      }
    };
    var done = function(res, origin){
      that.setColsWidth();
      typeof options.done === 'function' && options.done(
        res, curr, res[response.countName], origin
      );
    };

    opts = opts || {};

    // 数据拉取前的回调
    typeof options.before === 'function' && options.before(
      options
    );
    that.startTime = new Date().getTime(); // 渲染开始时间

    if (opts.renderData) { // 将 cache 信息重新渲染
      res = {};
      res[response.dataName] = table.cache[that.key];
      res[response.countName] = options.url ? (layui.type(options.page) === 'object' ? options.page.count : res[response.dataName].length) : options.data.length;

      // 记录合计行数据
      if(typeof options.totalRow === 'object'){
        res[response.totalRowName] = $.extend({}, that.totalRow);
      }

      that.renderData({
        res: res,
        curr: curr,
        count: res[response.countName],
        type: opts.type,
        sort: true
      }), done(res, 'renderData');
    } else if(options.url){ // Ajax请求
      var params = {};
      // 当 page 开启，默认自动传递 page、limit 参数
      if(options.page){
        params[request.pageName] = curr;
        params[request.limitName] = options.limit;
      }

      // 参数
      var data = $.extend(params, options.where);
      if(options.contentType && options.contentType.indexOf("application/json") == 0){ // 提交 json 格式
        data = JSON.stringify(data);
      }

      that.loading();

      $.ajax({
        type: options.method || 'get',
        url: options.url,
        contentType: options.contentType,
        data: data,
        dataType: options.dataType || 'json',
        jsonpCallback: options.jsonpCallback,
        headers: options.headers || {},
        complete: function(xhr,ts){
          typeof options.complete === 'function' && options.complete(xhr, ts);
        },
        success: function(res){
          // 若有数据解析的回调，则获得其返回的数据
          if(typeof options.parseData === 'function'){
            res = options.parseData(res) || res;
          }
          // 检查数据格式是否符合规范
          if(res[response.statusName] != response.statusCode){
            that.errorView(
              res[response.msgName] ||
              ('返回的数据不符合规范，正确的成功状态码应为："'+ response.statusName +'": '+ response.statusCode)
            );
          } else {
            that.totalRow = res[response.totalRowName];
            that.renderData({
              res: res,
              curr: curr,
              count: res[response.countName],
              type: opts.type
            }), sort();

            // 耗时（接口请求+视图渲染）
            options.time = (new Date().getTime() - that.startTime) + ' ms';
          }
          done(res);
        },
        error: function(e, msg){
          that.errorView('请求异常，错误提示：'+ msg);
          typeof options.error === 'function' && options.error(e, msg);
        }
      });
    } else if(layui.type(options.data) === 'array'){ //已知数据
      res = {};
      var startLimit = curr*options.limit - options.limit;
      var newData = options.data.concat();

      res[response.dataName] = options.page
        ? newData.splice(startLimit, options.limit)
      : newData;
      res[response.countName] = options.data.length;

      // 记录合计行数据
      if(typeof options.totalRow === 'object'){
        res[response.totalRowName] = $.extend({}, options.totalRow);
      }
      that.totalRow = res[response.totalRowName];

      that.renderData({
        res: res,
        curr: curr,
        count: res[response.countName],
        type: opts.type
      }), sort();

      done(res);
    }
  };

  // 遍历表头
  Class.prototype.eachCols = function(callback){
    var that = this;
    table.eachCols(null, callback, that.config.cols);
    return that;
  };

  // 获取表头参数项
  Class.prototype.col = function(key){
    try {
      key = key.split('-');
      return this.config.cols[key[1]][key[2]] || {};
    } catch(e){
      hint.error(e);
      return {};
    }
  };

  Class.prototype.getTrHtml = function(data, sort, curr, trsObj) {
    var that = this;
    var options = that.config;
    var trs = trsObj && trsObj.trs || [];
    var trs_fixed = trsObj && trsObj.trs_fixed || [];
    var trs_fixed_r = trsObj && trsObj.trs_fixed_r || [];
    curr = curr || 1

    layui.each(data, function(i1, item1){
      var tds = [];
      var tds_fixed = [];
      var tds_fixed_r = [];
      var numbers = i1 + options.limit*(curr - 1) + 1; // 序号

      // 数组值是否为 object，如果不是，则自动转为 object
      if(typeof item1 !== 'object'){
        data[i1] = item1 = {LAY_KEY: item1};
        try {
          table.cache[that.key][i1] = item1;
        } catch(e) {}
      }

      //若数据项为空数组，则不往下执行（因为删除数据时，会将原有数据设置为 []）
      if(layui.type(item1) === 'array' && item1.length === 0) return;

      // 加入序号保留字段
      item1[table.config.numbersName] = numbers;

      // 记录下标索引，用于恢复排序
      if(!sort) item1[table.config.indexName] = i1;

      // 遍历表头
      that.eachCols(function(i3, item3){
        var field = item3.field || i3;
        var key = item3.key;
        var content = item1[field];

        if(content === undefined || content === null) content = '';
        if(item3.colGroup) return;

        // td 内容
        var td = ['<td data-field="'+ field +'" data-key="'+ key +'" '+ function(){
          // 追加各种属性
          var attr = [];
          // 是否开启编辑。若 edit 传入函数，则根据函数的返回结果判断是否开启编辑
          (function(edit){
            if(edit) attr.push('data-edit="'+ edit +'"'); // 添加单元格编辑属性标识
          })(typeof item3.edit === 'function' ? item3.edit(item1) : item3.edit);
          if(item3.templet) attr.push('data-content="'+ util.escape(content) +'"'); // 自定义模板
          if(item3.toolbar) attr.push('data-off="true"'); // 行工具列关闭单元格事件
          if(item3.event) attr.push('lay-event="'+ item3.event +'"'); //自定义事件
          if(item3.minWidth) attr.push('data-minwidth="'+ item3.minWidth +'"'); // 单元格最小宽度
          if(item3.maxWidth) attr.push('data-maxwidth="'+ item3.maxWidth +'"'); // 单元格最大宽度
          if(item3.style) attr.push('style="'+ item3.style +'"'); // 自定义单元格样式
          return attr.join(' ');
        }() +' class="'+ function(){ // 追加样式
          var classNames = [];
          if(item3.hide) classNames.push(HIDE); // 插入隐藏列样式
          if(!item3.field) classNames.push(ELEM_COL_SPECIAL); // 插入特殊列样式
          return classNames.join(' ');
        }() +'">'
          ,'<div class="layui-table-cell laytable-cell-'+ function(){ // 返回对应的CSS类标识
            return item3.type === 'normal' ? key
              : (key + ' laytable-cell-' + item3.type);
          }() +'"'
          + (item3.align ? ' align="'+ item3.align +'"' : '')
          +'>'
          + function(){
            var tplData = $.extend(true, {
              LAY_COL: item3
            }, item1);
            var checkName = table.config.checkName;
            var disabledName = table.config.disabledName;

            // 渲染不同风格的列
            switch(item3.type){
              case 'checkbox': // 复选
                return '<input type="checkbox" name="layTableCheckbox" lay-skin="primary" '+ function(){
                  // 其他属性
                  var arr = [];

                  //如果是全选
                  if(item3[checkName]){
                    item1[checkName] = item3[checkName];
                    if(item3[checkName]) arr[0] = 'checked';
                  }
                  if(tplData[checkName]) arr[0] = 'checked';

                  // 禁选
                  if(tplData[disabledName]) arr.push('disabled');

                  return arr.join(' ');
                }() +' lay-type="layTableCheckbox">';
                //break;
              case 'radio': // 单选
                return '<input type="radio" name="layTableRadio_'+ options.index +'" '
                  + function(){
                    var arr = [];
                    if(tplData[checkName]) arr[0] = 'checked';
                    if(tplData[disabledName]) arr.push('disabled');
                    return arr.join(' ');
                  }() +' lay-type="layTableRadio">';
                //break;
              case 'numbers':
                return numbers;
                //break;
            }

            //解析工具列模板
            if(item3.toolbar){
              return laytpl($(item3.toolbar).html()||'').render(tplData);
            }
            return parseTempData.call(that, {
              item3: item3
              ,content: content
              ,tplData: tplData
            });
          }()
          ,'</div></td>'].join('');

        tds.push(td);
        if(item3.fixed && item3.fixed !== 'right') tds_fixed.push(td);
        if(item3.fixed === 'right') tds_fixed_r.push(td);
      });

      // 添加 tr 属性
      var trAttr = function(){
        var arr = ['data-index="'+ i1 +'"'];
        if(item1[table.config.checkName]) arr.push('class="'+ ELEM_CHECKED +'"');
        return arr.join(' ');
      }();

      trs.push('<tr '+ trAttr +'>'+ tds.join('') + '</tr>');
      trs_fixed.push('<tr '+ trAttr +'>'+ tds_fixed.join('') + '</tr>');
      trs_fixed_r.push('<tr '+ trAttr +'>'+ tds_fixed_r.join('') + '</tr>');
    });

    return {
      trs: trs,
      trs_fixed: trs_fixed,
      trs_fixed_r: trs_fixed_r
    }
  }

  // 返回行节点代码
  table.getTrHtml = function (id, data) {
    var that = getThisTable(id);
    return that.getTrHtml(data, null, that.page);
  }

  // 数据渲染
  Class.prototype.renderData = function(opts){
    var that = this;
    var options = that.config;

    var res = opts.res;
    var curr = opts.curr;
    var count = that.count = opts.count;
    var sort = opts.sort;

    var data = res[options.response.dataName] || []; //列表数据
    var totalRowData = res[options.response.totalRowName]; //合计行数据
    var trs = [];
    var trs_fixed = [];
    var trs_fixed_r = [];

    // 渲染视图
    var render = function(){ // 后续性能提升的重点
      if(!sort && that.sortKey){
        return that.sort({
          field: that.sortKey.field,
          type: that.sortKey.sort,
          pull: true,
          reloadType: opts.type
        });
      }
      that.getTrHtml(data, sort, curr, {
        trs: trs,
        trs_fixed: trs_fixed,
        trs_fixed_r: trs_fixed_r
      });

      // 容器的滚动条位置
      if(!(options.scrollPos === 'fixed' && opts.type === 'reloadData')){
        that.layBody.scrollTop(0);
      }
      if(options.scrollPos === 'reset'){
        that.layBody.scrollLeft(0);
      }

      that.layMain.find('.'+ NONE).remove();
      that.layMain.find('tbody').html(trs.join(''));
      that.layFixLeft.find('tbody').html(trs_fixed.join(''));
      that.layFixRight.find('tbody').html(trs_fixed_r.join(''));

      // 渲染表单
      that.syncCheckAll();
      that.renderForm();

      // 因为 page 参数有可能发生变化 先重新铺满
      that.fullSize();

      // 滚动条补丁
      that.haveInit ? that.scrollPatch() : setTimeout(function(){
        that.scrollPatch();
      }, 50);
      that.haveInit = true;

      layer.close(that.tipsIndex);
    };

    table.cache[that.key] = data; //记录数据

    //显示隐藏合计栏
    that.layTotal[data.length == 0 ? 'addClass' : 'removeClass'](HIDE_V);

    //显示隐藏分页栏
    that.layPage[(options.page || options.pagebar) ? 'removeClass' : 'addClass'](HIDE);
    that.layPage.find(ELEM_PAGE_VIEW)[
      (!options.page || count == 0 || (data.length === 0 && curr == 1))
        ? 'addClass'
      : 'removeClass'
    ](HIDE_V);

    //如果无数据
    if(data.length === 0){
      return that.errorView(options.text.none);
    } else {
      that.layFixLeft.removeClass(HIDE);
    }

    //如果执行初始排序
    if(sort){
      return render();
    }

    //正常初始化数据渲染
    render(); //渲染数据
    that.renderTotal(data, totalRowData); //数据合计
    that.layTotal && that.layTotal.removeClass(HIDE);

    //同步分页状态
    if(options.page){
      options.page = $.extend({
        elem: 'layui-table-page' + options.index,
        count: count,
        limit: options.limit,
        limits: options.limits || [10,20,30,40,50,60,70,80,90],
        groups: 3,
        layout: ['prev', 'page', 'next', 'skip', 'count', 'limit'],
        prev: '<i class="layui-icon">&#xe603;</i>',
        next: '<i class="layui-icon">&#xe602;</i>',
        jump: function(obj, first){
          if(!first){
            //分页本身并非需要做以下更新，下面参数的同步，主要是因为其它处理统一用到了它们
            //而并非用的是 options.page 中的参数（以确保分页未开启的情况仍能正常使用）
            that.page = obj.curr; //更新页码
            options.limit = obj.limit; //更新每页条数

            that.pullData(obj.curr);
          }
        }
      }, options.page);
      options.page.count = count; //更新总条数
      laypage.render(options.page);
    }
  };

  // 重新渲染数据
  table.renderData = function (id) {
    var that = getThisTable(id);
    if (!that) {
      return;
    }

    that.pullData(that.page, {
      renderData: true,
      type: 'reloadData'
    });
  }

  // 数据合计行
  Class.prototype.renderTotal = function(data, totalRowData){
    var that = this;
    var options = that.config;
    var totalNums = {};

    if(!options.totalRow) return;

    layui.each(data, function(i1, item1){
      // 若数据项为空数组，则不往下执行（因为删除数据时，会将原有数据设置为 []）
      if(layui.type(item1) === 'array' && item1.length === 0) return;

      that.eachCols(function(i3, item3){
        var field = item3.field || i3
        ,content = item1[field];

        if(item3.totalRow){
          totalNums[field] = (totalNums[field] || 0) + (parseFloat(content) || 0);
        }
      });
    });

    that.dataTotal = []; // 记录合计行结果

    var tds = [];
    that.eachCols(function(i3, item3){
      var field = item3.field || i3;

      // 合计数据的特定字段
      var TOTAL_NUMS = totalRowData && totalRowData[item3.field];

      // 合计数据的小数点位数处理
      var decimals = 'totalRowDecimals' in item3 ? item3.totalRowDecimals : 2;
      var thisTotalNum = totalNums[field]
        ? parseFloat(totalNums[field] || 0).toFixed(decimals)
      : '';

      // td 显示内容
      var content = function(){
        var text = item3.totalRowText || '';
        var tplData = {
          LAY_COL: item3
        };

        tplData[field] = thisTotalNum;

        // 获取自动计算的合并内容
        var getContent = item3.totalRow ? (parseTempData.call(that, {
          item3: item3,
          content: thisTotalNum,
          tplData: tplData
        }) || text) : text;

        // 如果直接传入了合计行数据，则不输出自动计算的结果
        return TOTAL_NUMS || getContent;
      }();

      // 合计原始结果
      var total = TOTAL_NUMS || thisTotalNum || '';
      item3.field && that.dataTotal.push({
        field: item3.field,
        total: $('<div>'+ content +'</div>').text()
      });

      // td 容器
      var td = ['<td data-field="'+ field +'" data-key="'+ item3.key +'" '+ function(){
        var attr = [];
        if(item3.minWidth) attr.push('data-minwidth="'+ item3.minWidth +'"'); // 单元格最小宽度
        if(item3.maxWidth) attr.push('data-maxwidth="'+ item3.maxWidth +'"'); // 单元格最小宽度
        if(item3.style) attr.push('style="'+ item3.style +'"'); // 自定义单元格样式
        return attr.join(' ');
      }() +' class="'+ function(){ // 追加样式
        var classNames = [];
        if(item3.hide) classNames.push(HIDE); // 插入隐藏列样式
        if(!item3.field) classNames.push(ELEM_COL_SPECIAL); // 插入特殊列样式
        return classNames.join(' ');
      }() +'">',
        '<div class="layui-table-cell laytable-cell-'+ function(){ // 返回对应的CSS类标识
          var key = item3.key;
          return item3.type === 'normal' ? key
          : (key + ' laytable-cell-' + item3.type);
        }() +'"'+ function(){
        var attr = [];
        if(item3.align) attr.push('align="'+ item3.align +'"'); // 对齐方式
        return attr.join(' ');
      }() +'>' + function(){
          var totalRow = item3.totalRow || options.totalRow;

          // 如果 totalRow 参数为字符类型，则解析为自定义模版
          if(typeof totalRow === 'string'){
            return laytpl(totalRow).render($.extend({
              TOTAL_NUMS: TOTAL_NUMS || totalNums[field],
              TOTAL_ROW: totalRowData || {},
              LAY_COL: item3
            }, item3));
          }
          return content;
        }(),
      '</div></td>'].join('');

      tds.push(td);
    });

    var patchElem = that.layTotal.find('.layui-table-patch'); // 可能存在滚动条补丁
    that.layTotal.find('tbody').html('<tr>' + tds.join('') + (patchElem.length ? patchElem.get(0).outerHTML : '') + '</tr>');
  };

  //找到对应的列元素
  Class.prototype.getColElem = function(parent, key){
    var that = this;
    //var options = that.config;
    return parent.eq(0).find('.laytable-cell-'+ key + ':eq(0)');
  };

  // 渲染表单
  Class.prototype.renderForm = function(type){
    var that = this;
    var options = that.config;
    var filter = that.elem.attr('lay-filter');
    form.render(type, filter);
  };

  // 同步全选按钮状态
  Class.prototype.syncCheckAll = function(){
    var that = this;
    var options = that.config;
    var checkAllElem = that.layHeader.find('input[name="layTableCheckbox"]');
    var syncColsCheck = function(checked){
      that.eachCols(function(i, item){
        if(item.type === 'checkbox'){
          item[options.checkName] = checked;
        }
      });
      return checked;
    };
    var checkStatus = table.checkStatus(that.key);

    if(!checkAllElem[0]) return;

    // 选中状态
    syncColsCheck(checkStatus.isAll);
    checkAllElem.prop({
      checked: checkStatus.isAll,
      indeterminate: !checkStatus.isAll && checkStatus.data.length // 半选
    });
    form.render(checkAllElem);
  };

  // 标记当前活动行背景色
  Class.prototype.setRowActive = function(index, className, removeClass){
    var that = this;
    var options = that.config;
    var tr = that.layBody.find('tr[data-index="'+ index +'"]');
    className = className || 'layui-table-click';

    if(removeClass) return tr.removeClass(className);

    tr.addClass(className);
    tr.siblings('tr').removeClass(className);
  };

  // 设置行选中状态
  Class.prototype.setRowChecked = function(opts){
    var that = this;
    var options = that.config;
    var tr = that.layBody.find('tr'+ (
      opts.index === 'all' ? '' : '[data-index="'+ opts.index +'"]'
    ));

    // 默认属性
    opts = $.extend({
      type: 'checkbox' // 选中方式
    }, opts);

    // 同步数据选中属性值
    var thisData = table.cache[that.key];
    var existChecked = 'checked' in opts;
    var getChecked = function(value){
      // 若为单选框，则单向选中；若为复选框，则切换选中。
      return opts.type === 'radio' ? true : (existChecked ? opts.checked : !value)
    };

    // 设置数据选中属性
    layui.each(thisData, function(i, item){
      if(layui.type(item) === 'array' || item[options.disabledName]) return; // 空项
      if(Number(opts.index) === i || opts.index === 'all'){
        var checked = item[options.checkName] = getChecked(item[options.checkName]);
        tr[checked ? 'addClass' : 'removeClass'](ELEM_CHECKED); // 标记当前选中行背景色
        // 若为 radio 类型，则取消其他行选中背景色
        if(opts.type === 'radio'){
          tr.siblings().removeClass(ELEM_CHECKED);
        }
      } else if(opts.type === 'radio') {
        delete item[options.checkName];
      }
    });

    // 若存在复选框或单选框，则标注选中状态样式
    var checkedElem = tr.find('input[lay-type="'+ ({
      radio: 'layTableRadio',
      checkbox: 'layTableCheckbox'
    }[opts.type] || 'checkbox') +'"]:not(:disabled)');
    var checkedSameElem = checkedElem.last();
    var fixRElem = checkedSameElem.closest(ELEM_FIXR);

    ( opts.type === 'radio' && fixRElem.hasClass(HIDE)
      ?  checkedElem.first()
    : checkedElem ).prop('checked', getChecked(checkedSameElem.prop('checked')));

    that.syncCheckAll();
    that.renderForm(opts.type);
  };

  // 数据排序
  Class.prototype.sort = function(opts){ // field, type, pull, fromEvent
    var that = this;
    var field;
    var res = {};
    var options = that.config;
    var filter = options.elem.attr('lay-filter');
    var data = table.cache[that.key], thisData;

    opts = opts || {};

    // 字段匹配
    if(typeof opts.field === 'string'){
      field = opts.field;
      that.layHeader.find('th').each(function(i, item){
        var othis = $(this);
        var _field = othis.data('field');
        if(_field === opts.field){
          opts.field = othis;
          field = _field;
          return false;
        }
      });
    }

    try {
      field = field || opts.field.data('field');
      var key = opts.field.data('key');

      // 如果欲执行的排序已在状态中，则不执行渲染
      if(that.sortKey && !opts.pull){
        if(field === that.sortKey.field && opts.type === that.sortKey.sort){
          return;
        }
      }

      var elemSort = that.layHeader.find('th .laytable-cell-'+ key).find(ELEM_SORT);
      that.layHeader.find('th').find(ELEM_SORT).removeAttr('lay-sort'); // 清除其它标题排序状态
      elemSort.attr('lay-sort', opts.type || null);
      that.layFixed.find('th')
    } catch(e){
      hint.error('Table modules: sort field \''+ field +'\' not matched');
    }

    // 记录排序索引和类型
    that.sortKey = {
      field: field,
      sort: opts.type
    };

    // 默认为前端自动排序。如果否，则需自主排序（通常为服务端处理好排序）
    if(options.autoSort){
      if(opts.type === 'asc'){ //升序
        thisData = layui.sort(data, field, null, true);
      } else if(opts.type === 'desc'){ //降序
        thisData = layui.sort(data, field, true, true);
      } else { // 清除排序
        thisData = layui.sort(data, table.config.indexName, null, true);
        delete that.sortKey;
        delete options.initSort;
      }
    }

    res[options.response.dataName] = thisData || data;

    // 重载数据
    that.renderData({
      res: res,
      curr: that.page,
      count: that.count,
      sort: true,
      type: opts.reloadType
    });

    // 排序是否来自于点击表头事件触发
    if(opts.fromEvent){
      options.initSort = {
        field: field,
        type: opts.type
      };
      layui.event.call(opts.field, MOD_NAME, 'sort('+ filter +')', $.extend({
        config: options
      }, options.initSort));
    }
  };

  // 请求 loading
  Class.prototype.loading = function(hide){
    var that = this;
    var options = that.config;
    if(options.loading){
      if(hide){
        that.layInit && that.layInit.remove();
        delete that.layInit;
        that.layBox.find(ELEM_INIT).remove();
      } else {
        that.layInit = $(['<div class="layui-table-init">',
          '<i class="layui-icon layui-icon-loading layui-anim layui-anim-rotate layui-anim-loop"></i>',
          '</div>'].join(''));
        that.layBox.append(that.layInit);
      }
    }
  };

  // 获取对应单元格的 cssRules
  Class.prototype.cssRules = function(key, callback){
    var that = this;
    var style = that.elem.children('style')[0];

    lay.getStyleRules(style, function(item){
      if (item.selectorText === ('.laytable-cell-'+ key)) {
        return callback(item), true;
      }
    });
  };

  // 让表格铺满
  Class.prototype.fullSize = function(){
    var that = this;
    var options = that.config;
    var height = options.height;
    var bodyHeight;

    if(that.fullHeightGap){
      height = _WIN.height() - that.fullHeightGap;
      if(height < 135) height = 135;
      // that.elem.css('height', height);
    } else if (that.parentDiv && that.parentHeightGap) {
      height = $(that.parentDiv).height() - that.parentHeightGap;
      if (height < 135) height = 135;
      // that.elem.css("height", height);
    }

    // 如果多级表头，则填补表头高度
    if(options.cols.length > 1){
      // 补全高度
      var th = that.layFixed.find(ELEM_HEADER).find('th');
      // 固定列表头同步跟本体 th 一致高度
      var headerMain = that.layHeader.first();
      layui.each(th, function (thIndex, thElem) {
        thElem = $(thElem);
        thElem.height(headerMain.find('th[data-key="' + thElem.attr('data-key') + '"]').height() + 'px');
      })
    }

    if(!height) return;

    // 减去列头区域的高度 --- 此处的数字常量是为了防止容器处在隐藏区域无法获得高度的问题，只对默认尺寸表格做支持
    bodyHeight = parseFloat(height) - (that.layHeader.outerHeight() || 39)

    // 减去工具栏的高度
    if(options.toolbar){
      bodyHeight -= (that.layTool.outerHeight() || 51);
    }

    // 减去统计栏的高度
    if(options.totalRow){
      bodyHeight -= (that.layTotal.outerHeight() || 40);
    }

    // 减去分页栏的高度
    if(options.page || options.pagebar){
      bodyHeight -= (that.layPage.outerHeight() || 43);
    }

    if (options.maxHeight) {
      layui.each({elem: height, layMain: bodyHeight}, function (elemName, elemHeight) {
        that[elemName].css({
          height: 'auto',
          maxHeight: elemHeight + 'px'
        });
      });
    } else {
      that.layMain.outerHeight(bodyHeight);
    }
  };

  //获取滚动条宽度
  Class.prototype.getScrollWidth = function(elem){
    var width;
    if(elem){
      width = elem.offsetWidth - elem.clientWidth;
    } else {
      elem = document.createElement('div');
      elem.style.width = '100px';
      elem.style.height = '100px';
      elem.style.overflowY = 'scroll';

      document.body.appendChild(elem);
      width = elem.offsetWidth - elem.clientWidth;
      document.body.removeChild(elem);
    }
    return width;
  };

  // 滚动条补丁
  Class.prototype.scrollPatch = function(){
    var that = this;
    var layMainTable = that.layMain.children('table');
    var scrollWidth = that.layMain.width() - that.layMain.prop('clientWidth'); // 纵向滚动条宽度
    var scrollHeight = that.layMain.height() - that.layMain.prop('clientHeight'); // 横向滚动条高度
    var getScrollWidth = that.getScrollWidth(that.layMain[0]); // 获取主容器滚动条宽度，如果有的话
    var outWidth = layMainTable.outerWidth() - that.layMain.width(); // 表格内容器的超出宽度

    // 添加补丁
    var addPatch = function(elem){
      if(scrollWidth && scrollHeight){
        elem = elem.eq(0);
        if(!elem.find('.layui-table-patch')[0]){
          var patchElem = $('<th class="layui-table-patch"><div class="layui-table-cell"></div></th>'); // 补丁元素
          patchElem.find('div').css({
            width: scrollWidth
          });
          elem.find('tr').append(patchElem);
        }
      } else {
        elem.find('.layui-table-patch').remove();
      }
    };

    addPatch(that.layHeader);
    addPatch(that.layTotal);

    // 固定列区域高度
    var mainHeight = that.layMain.height();
    var fixHeight = mainHeight - scrollHeight;

    that.layFixed.find(ELEM_BODY).css(
      'height',
      layMainTable.height() >= fixHeight ? fixHeight : 'auto'
    ).scrollTop(that.layMain.scrollTop()); // 固定列滚动条高度

    // 表格宽度小于容器宽度时，隐藏固定列
    that.layFixRight[
      (table.cache[that.key] && table.cache[that.key].length) && outWidth > 0
        ? 'removeClass'
      : 'addClass'
    ](HIDE);

    // 操作栏
    that.layFixRight.css('right', scrollWidth - 1);
  };

  // 事件处理
  Class.prototype.events = function(){
    var that = this;
    var options = that.config;

    var filter = options.elem.attr('lay-filter');
    var th = that.layHeader.find('th');
    var ELEM_CELL = '.layui-table-cell';

    var _BODY = $('body');
    var dict = {};

    // 头部工具栏操作事件
    that.layTool.on('click', '*[lay-event]', function(e){
      var othis = $(this);
      var events = othis.attr('lay-event');
      var data = table.cache[options.id];
      var openPanel = function(sets){
        var list = $(sets.list);
        var panel = $('<ul class="' + ELEM_TOOL_PANEL + '"></ul>');

        panel.html(list);

        // 限制最大高度
        if(options.height){
          panel.css('max-height', options.height - (that.layTool.outerHeight() || 50));
        }

        // 插入元素
        othis.find('.' + ELEM_TOOL_PANEL)[0] || othis.append(panel);
        that.renderForm();

        panel.on('click', function(e){
          layui.stope(e);
        });

        sets.done && sets.done(panel, list)
      };

      layui.stope(e);
      _DOC.trigger('table.tool.panel.remove');
      layer.close(that.tipsIndex);

      switch(events){
        case 'LAYTABLE_COLS': // 筛选列
          openPanel({
            list: function(){
              var lis = [];
              that.eachCols(function(i, item){
                if(item.field && item.type == 'normal'){
                  lis.push('<li><input type="checkbox" name="'+ item.field +'" data-key="'+ item.key +'" data-parentkey="'+ (item.parentKey||'') +'" lay-skin="primary" '+ (item.hide ? '' : 'checked') +' title="'+ util.escape($('<div>' + (item.fieldTitle || item.title || item.field) + '</div>').text()) +'" lay-filter="LAY_TABLE_TOOL_COLS"></li>');
                }
              });
              return lis.join('');
            }()
            ,done: function(){
              form.on('checkbox(LAY_TABLE_TOOL_COLS)', function(obj){
                var othis = $(obj.elem);
                var checked = this.checked;
                var key = othis.data('key');
                var col = that.col(key);
                var hide = col.hide;
                var parentKey = othis.data('parentkey');

                if(!col.key) return;

                // 同步勾选列的 hide 值和隐藏样式
                col.hide = !checked;
                that.elem.find('*[data-key="'+ key +'"]')[
                  checked ? 'removeClass' : 'addClass'
                ](HIDE);

                // 根据列的显示隐藏，同步多级表头的父级相关属性值
                if(hide != col.hide){
                  that.setParentCol(!checked, parentKey);
                }

                // 重新适配尺寸
                that.resize();

                // 列筛选（显示或隐藏）后的事件
                layui.event.call(this, MOD_NAME, 'colToggled('+ filter +')', {
                  col: col,
                  config: options
                });
              });
            }
          });
        break;
        case 'LAYTABLE_EXPORT': // 导出
          if (!data.length) return layer.tips('当前表格无数据', this, {tips: 3});
          if(device.ie){
            layer.tips('导出功能不支持 IE，请用 Chrome 等高级浏览器导出', this, {
              tips: 3
            });
          } else {
            openPanel({
              list: function(){
                return [
                  '<li data-type="csv">导出 csv 格式文件</li>',
                  '<li data-type="xls">导出 xls 格式文件</li>'
                ].join('')
              }(),
              done: function(panel, list){
                list.on('click', function(){
                  var type = $(this).data('type')
                  table.exportFile.call(that, options.id, null, type);
                });
              }
            });
          }
        break;
        case 'LAYTABLE_PRINT': // 打印
          if (!data.length) return layer.tips('当前表格无数据', this, {tips: 3});
          var printWin = window.open('about:blank', '_blank');
          var style = ['<style>',
            'body{font-size: 12px; color: #5F5F5F;}',
            'table{width: 100%; border-collapse: collapse; border-spacing: 0;}',
            'th,td{line-height: 20px; padding: 9px 15px; border: 1px solid #ccc; text-align: left; font-size: 12px; color: #5F5F5F;}',
            'a{color: #5F5F5F; text-decoration:none;}',
            'img{max-height: 100%;}',
            '*.layui-hide{display: none}',
          '</style>'].join('')
          var html = $(that.layHeader.html()); // 输出表头

          html.append(that.layMain.find('table').html()); // 输出表体
          html.append(that.layTotal.find('table').html()) // 输出合计行

          html.find('th.layui-table-patch').remove(); // 移除补丁
          // 移除表头特殊列
          html.find('thead>tr>th.'+ ELEM_COL_SPECIAL).filter(function(i, thElem){
            return !$(thElem).children('.'+ ELEM_GROUP).length; // 父级表头除外
          }).remove();
          html.find('tbody>tr>td.'+ ELEM_COL_SPECIAL).remove(); // 移除表体特殊列

          printWin.document.write(style + html.prop('outerHTML'));
          printWin.document.close();

          if(layui.device('edg').edg){
            printWin.onafterprint = printWin.close;
            printWin.print();
          }else{
            printWin.print();
            printWin.close();
          }
        break;
      }

      layui.event.call(this, MOD_NAME, 'toolbar('+ filter +')', $.extend({
        event: events,
        config: options
      },{}));
    });

    // 表头自定义元素事件
    that.layHeader.on('click', '*[lay-event]', function(e){
      var othis = $(this);
      var events = othis.attr('lay-event');
      var th = othis.closest('th');
      var key = th.data('key');
      var col = that.col(key);

      layui.event.call(this, MOD_NAME, 'colTool('+ filter +')', $.extend({
        event: events,
        config: options,
        col: col
      },{}));
    });

    // 分页栏操作事件
    that.layPagebar.on('click', '*[lay-event]', function(e){
      var othis = $(this);
      var events = othis.attr('lay-event');

      layui.event.call(this, MOD_NAME, 'pagebar('+ filter +')', $.extend({
        event: events,
        config: options
      },{}));
    });

    // 拖拽调整宽度
    th.on('mousemove', function(e){
      var othis = $(this);
      var oLeft = othis.offset().left;
      var pLeft = e.clientX - oLeft;
      if(othis.data('unresize') || thisTable.eventMoveElem){
        return;
      }
      dict.allowResize = othis.width() - pLeft <= 10; //是否处于拖拽允许区域
      _BODY.css('cursor', (dict.allowResize ? 'col-resize' : ''));
    }).on('mouseleave', function(){
      var othis = $(this);
      if(thisTable.eventMoveElem) return;
      _BODY.css('cursor', '');
    }).on('mousedown', function(e){
      var othis = $(this);
      if(dict.allowResize){
        var key = othis.data('key');
        e.preventDefault();
        dict.offset = [e.clientX, e.clientY]; //记录初始坐标

        that.cssRules(key, function(item){
          var width = item.style.width || othis.outerWidth();
          dict.rule = item;
          dict.ruleWidth = parseFloat(width);
          dict.minWidth = othis.data('minwidth') || options.cellMinWidth;
          dict.maxWidth = othis.data('maxwidth') || options.cellMaxWidth;
        });

        // 临时记录当前拖拽信息
        othis.data(DATA_MOVE_NAME, dict);
        thisTable.eventMoveElem = othis;
      }
    });

    // 拖拽中
    if(!thisTable.docEvent){
      _DOC.on('mousemove', function(e){
        if(thisTable.eventMoveElem){
          var dict = thisTable.eventMoveElem.data(DATA_MOVE_NAME) || {};

          thisTable.eventMoveElem.data('resizing', 1);
          e.preventDefault();

          if(dict.rule){
            var setWidth = dict.ruleWidth + e.clientX - dict.offset[0];
            var id = thisTable.eventMoveElem.closest('.' + ELEM_VIEW).attr('lay-id');
            var thatTable = getThisTable(id);

            if(!thatTable) return;

            if(setWidth < dict.minWidth) setWidth = dict.minWidth;
            if(setWidth > dict.maxWidth) setWidth = dict.maxWidth;

            dict.rule.style.width = setWidth + 'px';
            thatTable.setGroupWidth(thisTable.eventMoveElem);
            layer.close(that.tipsIndex);
          }
        }
      }).on('mouseup', function(e){
        if(thisTable.eventMoveElem){
          var th = thisTable.eventMoveElem; // 当前触发拖拽的 th 元素
          var id = th.closest('.' + ELEM_VIEW).attr('lay-id');
          var thatTable = getThisTable(id);

          if(!thatTable) return;

          var key = th.data('key');
          var col = thatTable.col(key);
          var filter = thatTable.config.elem.attr('lay-filter');

          // 重置过度信息
          dict = {};
          _BODY.css('cursor', '');
          thatTable.scrollPatch();

          // 清除当前拖拽信息
          th.removeData(DATA_MOVE_NAME);
          delete thisTable.eventMoveElem;

          // 列拖拽宽度后的事件
          thatTable.cssRules(key, function(item){
            col.width = parseFloat(item.style.width);
            layui.event.call(th[0], MOD_NAME, 'colResized('+ filter +')', {
              col: col,
              config: thatTable.config
            });
          });
        }
      });
    }

    // 已给 document 执行全局事件，避免重复绑定
    thisTable.docEvent = true;


    // 排序
    th.on('click', function(e){
      var othis = $(this);
      var elemSort = othis.find(ELEM_SORT);
      var nowType = elemSort.attr('lay-sort');
      var type;

      // 排序不触发的条件
      if(!elemSort[0] || othis.data('resizing') === 1){
        return othis.removeData('resizing');
      }

      if(nowType === 'asc'){
        type = 'desc';
      } else if(nowType === 'desc'){
        type = null;
      } else {
        type = 'asc';
      }
      that.sort({
        field: othis,
        type: type,
        fromEvent: true
      });
    }).find(ELEM_SORT+' .layui-edge ').on('click', function(e){
      var othis = $(this);
      var index = othis.index();
      var field = othis.parents('th').eq(0).data('field');
      layui.stope(e);
      if(index === 0){
        that.sort({
          field: field,
          type: 'asc',
          fromEvent: true
        });
      } else {
        that.sort({
          field: field,
          type: 'desc',
          fromEvent: true
        });
      }
    });

    //数据行中的事件返回的公共对象成员
    var commonMember = that.commonMember = function(sets){
      var othis = $(this);
      var index = othis.parents('tr').eq(0).data('index');
      var tr = that.layBody.find('tr[data-index="'+ index +'"]');
      var data = table.cache[that.key] || [];

      data = data[index] || {};

      // 事件返回的公共成员
      var obj = {
        tr: tr, // 行元素
        config: options,
        data: table.clearCacheKey(data), // 当前行数据
        dataCache: data, // 当前行缓存中的数据
        index: index,
        del: function(){ // 删除行数据
          table.cache[that.key][index] = [];
          tr.remove();
          that.scrollPatch();
        },
        update: function(fields, related){ // 修改行数据
          fields = fields || {};
          layui.each(fields, function(key, value){
            var td = tr.children('td[data-field="'+ key +'"]');
            var cell = td.children(ELEM_CELL); // 获取当前修改的列

            // 更新缓存中的数据
            data[key] = obj.data[key] = value;

            // 更新相应列视图
            that.eachCols(function(i, item3){
              if(item3.field == key){
                cell.html(parseTempData.call(that, {
                  item3: item3
                  ,content: value
                  ,tplData: $.extend({
                    LAY_COL: item3
                  }, data)
                }));
                td.data('content', value);
              }
              // 更新其他包含自定义模板且可能有所关联的列视图
              else if(related && (item3.templet || item3.toolbar)){
                var thisTd = tr.children('td[data-field="'+ (item3.field || i) +'"]');
                var content = data[item3.field];

                thisTd.children(ELEM_CELL).html(parseTempData.call(that, {
                  item3: item3
                  ,content: content
                  ,tplData: $.extend({
                    LAY_COL: item3
                  }, data)
                }));
                thisTd.data('content', content);
              }
            });
          });

          that.renderForm();
        },
        // 设置行选中状态
        setRowChecked: function(opts){
          that.setRowChecked($.extend({
            index: index
          }, opts));
        }
        // 获取当前列
      };

      return $.extend(obj, sets);
    };

    // 复选框选择（替代元素的 click 事件）
    that.elem.on('click', 'input[name="layTableCheckbox"]+', function(e){
      var othis = $(this);
      var td = othis.closest('td');
      var checkbox = othis.prev();
      var children = that.layBody.find('input[name="layTableCheckbox"]');
      var index = checkbox.parents('tr').eq(0).data('index');
      var checked = checkbox[0].checked;
      var isAll = checkbox.attr('lay-filter') === 'layTableAllChoose';

      if(checkbox[0].disabled) return;

      // 全选
      if(isAll){
        that.setRowChecked({
          index: 'all',
          checked: checked
        });
      } else {
        that.setRowChecked({
          index: index,
          checked: checked
        });
        layui.stope(e);
      }

      // 事件
      layui.event.call(
        checkbox[0],
        MOD_NAME, 'checkbox('+ filter +')',
        commonMember.call(checkbox[0], {
          checked: checked,
          type: isAll ? 'all' : 'one',
          getCol: function(){ // 获取当前列的表头配置信息
            return that.col(td.data('key'));
          }
        })
      );
    });

    // 单选框选择
    that.elem.on('click', 'input[lay-type="layTableRadio"]+', function(e){
      var othis = $(this);
      var td = othis.closest('td');
      var radio = othis.prev();
      var checked = radio[0].checked;
      var index = radio.parents('tr').eq(0).data('index');

      layui.stope(e);
      if(radio[0].disabled) return false;

      // 标注选中样式
      that.setRowChecked({
        type: 'radio',
        index: index
      });

      // 事件
      layui.event.call(
        radio[0],
        MOD_NAME, 'radio('+ filter +')',
        commonMember.call(radio[0], {
          checked: checked,
          getCol: function(){ // 获取当前列的表头配置信息
            return that.col(td.data('key'));
          }
        })
      );
    });

    // 行事件
    that.layBody.on('mouseenter', 'tr', function(){ // 鼠标移入行
      var othis = $(this);
      var index = othis.index();
      if(othis.data('off')) return; // 不触发事件
      that.layBody.find('tr:eq('+ index +')').addClass(ELEM_HOVER)
    }).on('mouseleave', 'tr', function(){ // 鼠标移出行
      var othis = $(this);
      var index = othis.index();
      if(othis.data('off')) return; // 不触发事件
      that.layBody.find('tr:eq('+ index +')').removeClass(ELEM_HOVER)
    }).on('click', 'tr', function(e){ // 单击行
      // 不支持行单击事件的元素
      var UNROW = [
        '.layui-form-checkbox',
        '.layui-form-switch',
        '.layui-form-radio',
        '[lay-unrow]'
      ].join(',');
      if( $(e.target).is(UNROW) || $(e.target).closest(UNROW)[0]){
        return;
      }
      setRowEvent.call(this, 'row');
    }).on('dblclick', 'tr', function(){ // 双击行
      setRowEvent.call(this, 'rowDouble');
    }).on('contextmenu', 'tr', function(e){ // 菜单
      if (!options.defaultContextmenu) e.preventDefault();
      setRowEvent.call(this, 'rowContextmenu');
    });

    // 创建行单击、双击、菜单事件
    var setRowEvent = function(eventType){
      var othis = $(this);
      if(othis.data('off')) return; //不触发事件
      layui.event.call(this,
        MOD_NAME, eventType + '('+ filter +')',
        commonMember.call(othis.children('td')[0])
      );
    };

    // 渲染单元格编辑状态
    var renderGridEdit = function(othis, e){
      othis = $(othis);

      if(othis.data('off')) return; // 不触发事件

      var field = othis.data('field');
      var key = othis.data('key');
      var col = that.col(key);
      var index = othis.closest('tr').data('index');
      var data = table.cache[that.key][index];
      var elemCell = othis.children(ELEM_CELL);

      // 是否开启编辑
      // 若 edit 传入函数，则根据函数的返回结果判断是否开启编辑
      var editType = typeof col.edit === 'function'
        ? col.edit(data)
      : col.edit;

      // 显示编辑表单
      if(editType){
        var input = $(function(){
          var inputElem = '<input class="layui-input '+ ELEM_EDIT +'" lay-unrow>';
          if(editType === 'textarea') {
            inputElem = '<textarea class="layui-input ' + ELEM_EDIT + '" lay-unrow></textarea>';
          }
          return inputElem;
        }());

        input[0].value = othis.data('content') || data[field] || elemCell.text();
        othis.find('.'+ELEM_EDIT)[0] || othis.append(input);
        input.focus();
        e && layui.stope(e);
      }
    };

    // 单元格编辑 - 输入框内容被改变的事件
    that.layBody.on('change', '.'+ ELEM_EDIT, function(){
      var othis = $(this);
      var td = othis.parent();
      var value = this.value;
      var field = othis.parent().data('field');
      var index = othis.closest('tr').data('index');
      var data = table.cache[that.key][index];

      //事件回调的参数对象
      var params = commonMember.call(td[0], {
        value: value,
        field: field,
        oldValue: data[field], // 编辑前的值
        td: td,
        reedit: function(){ // 重新编辑
          setTimeout(function(){
            // 重新渲染为编辑状态
            renderGridEdit(params.td);

            // 将字段缓存的值恢复到编辑之前的值
            var obj = {};
            obj[field] = params.oldValue;
            params.update(obj);
          });
        },
        getCol: function(){ // 获取当前列的表头配置信息
          return that.col(td.data('key'));
        }
      });

      // 更新缓存中的值
      var obj = {}; //变更的键值
      obj[field] = value;
      params.update(obj);

      // 执行 API 编辑事件
      layui.event.call(td[0], MOD_NAME, 'edit('+ filter +')', params);
    }).on('blur', '.'+ ELEM_EDIT, function(){ // 单元格编辑 - 恢复非编辑状态事件
      $(this).remove(); // 移除编辑状态
    });

    // 表格主体单元格触发编辑的事件
    that.layBody.on(options.editTrigger, 'td', function(e){
      renderGridEdit(this, e)
    }).on('mouseenter', 'td', function(){
      showGridExpandIcon.call(this)
    }).on('mouseleave', 'td', function(){
       showGridExpandIcon.call(this, 'hide');
    });

    // 表格合计栏单元格 hover 显示展开图标
    that.layTotal.on('mouseenter', 'td', function(){
      showGridExpandIcon.call(this)
    }).on('mouseleave', 'td', function(){
       showGridExpandIcon.call(this, 'hide');
    });

    // 显示单元格展开图标
    var ELEM_GRID = 'layui-table-grid';
    var ELEM_GRID_DOWN = 'layui-table-grid-down';
    var ELEM_GRID_PANEL = 'layui-table-grid-panel';
    var showGridExpandIcon = function(hide){
      var othis = $(this);
      var elemCell = othis.children(ELEM_CELL);

      if(othis.data('off')) return; // 不触发事件
      if(othis.parent().hasClass(ELEM_EXPAND)) return; // 是否已为展开状态

      if(hide){
        othis.find('.layui-table-grid-down').remove();
      } else if((
        elemCell.prop('scrollWidth') > elemCell.outerWidth() ||
        elemCell.find("br").length > 0
      ) && !options.lineStyle){
        if(elemCell.find('.'+ ELEM_GRID_DOWN)[0]) return;
        othis.append('<div class="'+ ELEM_GRID_DOWN +'"><i class="layui-icon layui-icon-down"></i></div>');
      }
    };
    // 展开单元格内容
    var gridExpand = function(e){
      var othis = $(this);
      var td = othis.parent();
      var key = td.data('key');
      var col = that.col(key);
      var index = td.parent().data('index');
      var elemCell = td.children(ELEM_CELL);
      var ELEM_CELL_C = 'layui-table-cell-c';
      var elemCellClose = $('<i class="layui-icon layui-icon-up '+ ELEM_CELL_C +'">');
      var expandedMode = col.expandedMode || options.cellExpandedMode;

      // 展开风格
      if (expandedMode === 'tips') { // TIPS 展开风格
        that.tipsIndex = layer.tips([
          '<div class="layui-table-tips-main" style="margin-top: -'+ (elemCell.height() + 23) +'px;'+ function(){
            if(options.size === 'sm'){
              return 'padding: 4px 15px; font-size: 12px;';
            }
            if(options.size === 'lg'){
              return 'padding: 14px 15px;';
            }
            return '';
          }() +'">',
            elemCell.html(),
          '</div>',
          '<i class="layui-icon layui-table-tips-c layui-icon-close"></i>'
        ].join(''), elemCell[0], {
          tips: [3, ''],
          time: -1,
          anim: -1,
          maxWidth: (device.ios || device.android) ? 300 : that.elem.width()/2,
          isOutAnim: false,
          skin: 'layui-table-tips',
          success: function(layero, index){
            layero.find('.layui-table-tips-c').on('click', function(){
              layer.close(index);
            });
          }
        });
      } else { // 多行展开风格
        // 恢复其他已经展开的单元格
        that.elem.find('.'+ ELEM_CELL_C).trigger('click');

        // 设置当前单元格展开宽度
        that.cssRules(key, function(item){
          var width = item.style.width;
          var expandedWidth = col.expandedWidth || options.cellExpandedWidth;

          // 展开后的宽度不能小于当前宽度
          if(expandedWidth < parseFloat(width)) expandedWidth = parseFloat(width);

          elemCellClose.data('cell-width', width);
          item.style.width = expandedWidth + 'px';

          setTimeout(function(){
            that.scrollPatch(); // 滚动条补丁
          });
        });

        // 设置当前单元格展开样式
        that.setRowActive(index, ELEM_EXPAND);

        // 插入关闭按钮
        if(!elemCell.next('.'+ ELEM_CELL_C)[0]){
          elemCell.after(elemCellClose);
        }

        // 关闭展开状态
        elemCellClose.on('click', function(){
          var $this = $(this);
          that.setRowActive(index, ELEM_EXPAND, true); // 移除单元格展开样式
          that.cssRules(key, function(item){
            item.style.width =  $this.data('cell-width'); // 恢复单元格展开前的宽度
            that.resize(); // 滚动条补丁
          });
          $this.remove();
        });
      }

      othis.remove();
      layui.stope(e);
    };

    // 表格主体单元格展开事件
    that.layBody.on('click', '.'+ ELEM_GRID_DOWN, function(e){
      gridExpand.call(this, e);
    });
    // 表格合计栏单元格展开事件
    that.layTotal.on('click', '.'+ ELEM_GRID_DOWN, function(e){
      gridExpand.call(this, e);
    });

    // 行工具条操作事件
    var toolFn = function(type){
      var othis = $(this);
      var td = othis.closest('td');
      var index = othis.parents('tr').eq(0).data('index');
      // 标记当前活动行
      that.setRowActive(index);

      // 执行事件
      layui.event.call(
        this,
        MOD_NAME,
        (type || 'tool') + '('+ filter +')',
        commonMember.call(this, {
          event: othis.attr('lay-event'),
          getCol: function(){ // 获取当前列的表头配置信息
            return that.col(td.data('key'));
          }
        })
      );
    };

     // 行工具条单击事件
    that.layBody.on('click', '*[lay-event]', function(e){
      toolFn.call(this);
      layui.stope(e);
    }).on('dblclick', '*[lay-event]', function(e){ //行工具条双击事件
      toolFn.call(this, 'toolDouble');
      layui.stope(e);
    });

    // 同步滚动条
    that.layMain.on('scroll', function(){
      var othis = $(this);
      var scrollLeft = othis.scrollLeft();
      var scrollTop = othis.scrollTop();

      that.layHeader.scrollLeft(scrollLeft);
      that.layTotal.scrollLeft(scrollLeft);
      that.layFixed.find(ELEM_BODY).scrollTop(scrollTop);

      layer.close(that.tipsIndex);
    });
  };

  // 全局事件
  (function(){
    // 自适应尺寸
    _WIN.on('resize', function(){
      layui.each(thisTable.that, function(){
        this.resize();
      });
    });

    // 全局点击
    _DOC.on('click', function(){
      _DOC.trigger('table.remove.tool.panel');
    });

    // 工具面板移除事件
    _DOC.on('table.remove.tool.panel', function(){
      $('.' + ELEM_TOOL_PANEL).remove();
    });
  })();

  // 初始化
  table.init = function(filter, settings){
    settings = settings || {};
    var that = this;
    var inst = null;
    var elemTable = typeof filter === 'object' ? filter : (
      typeof filter === 'string'
        ? $('table[lay-filter="'+ filter +'"]')
      : $(ELEM + '[lay-data], '+ ELEM + '[lay-options]')
    );
    var errorTips = 'Table element property lay-data configuration item has a syntax error: ';

    //遍历数据表格
    elemTable.each(function(){
      var othis = $(this);
      var attrData = othis.attr('lay-data');
      var tableData = lay.options(this, {
        attr: attrData ? 'lay-data' : null,
        errorText: errorTips + (attrData || othis.attr('lay-options'))
      });

      var options = $.extend({
        elem: this
        ,cols: []
        ,data: []
        ,skin: othis.attr('lay-skin') //风格
        ,size: othis.attr('lay-size') //尺寸
        ,even: typeof othis.attr('lay-even') === 'string' //偶数行背景
      }, table.config, settings, tableData);

      filter && othis.hide();

      //获取表头数据
      othis.find('thead>tr').each(function(i){
        options.cols[i] = [];
        $(this).children().each(function(ii){
          var th = $(this);
          var attrData = th.attr('lay-data');
          var itemData = lay.options(this, {
            attr: attrData ? 'lay-data' : null,
            errorText: errorTips + (attrData || th.attr('lay-options'))
          });

          var row = $.extend({
            title: th.text()
            ,colspan: parseInt(th.attr('colspan')) || 1 //列单元格
            ,rowspan: parseInt(th.attr('rowspan')) || 1 //行单元格
          }, itemData);

          options.cols[i].push(row);
        });
      });

      //缓存静态表体数据
      var trElem = othis.find('tbody>tr');

      //执行渲染
      var tableIns = table.render(options);

      //获取表体数据
      if (trElem.length && !settings.data && !tableIns.config.url) {
        var tdIndex = 0;
        table.eachCols(tableIns.config.id, function (i3, item3) {
          trElem.each(function(i1){
            options.data[i1] = options.data[i1] || {};
            var tr = $(this);
            var field = item3.field;
            options.data[i1][field] = tr.children('td').eq(tdIndex).html();
          });
          tdIndex++;
        })

        tableIns.reloadData({
          data: options.data
        });
      }
    });

    return that;
  };

  //记录所有实例
  thisTable.that = {}; //记录所有实例对象
  thisTable.config = {}; //记录所有实例配置项

  var eachChildCols = function (index, cols, i1, item2) {
    //如果是组合列，则捕获对应的子列
    if (item2.colGroup) {
      var childIndex = 0;
      index++;
      item2.CHILD_COLS = [];
      // 找到它的子列所在cols的下标
      var i2 = i1 + (parseInt(item2.rowspan) || 1);
      layui.each(cols[i2], function (i22, item22) {
        if (item22.parentKey) { // 如果字段信息中包含了parentKey和key信息
          if (item22.parentKey === item2.key) {
            item22.PARENT_COL_INDEX = index;
            item2.CHILD_COLS.push(item22);
            eachChildCols(index, cols, i2, item22);
          }
        } else {
          // 没有key信息以colspan数量所谓判断标准
          //如果子列已经被标注为{PARENT_COL_INDEX}，或者子列累计 colspan 数等于父列定义的 colspan，则跳出当前子列循环
          if (item22.PARENT_COL_INDEX || (childIndex >= 1 && childIndex == (item2.colspan || 1))) return;
          item22.PARENT_COL_INDEX = index;
          item2.CHILD_COLS.push(item22);
          childIndex = childIndex + (parseInt(item22.colspan > 1 ? item22.colspan : 1));
          eachChildCols(index, cols, i2, item22);
        }
      });
    }
  };

  // 遍历表头
  table.eachCols = function(id, callback, cols){
    var config = thisTable.config[id] || {};
    var arrs = [], index = 0;

    cols = $.extend(true, [], cols || config.cols);

    //重新整理表头结构
    layui.each(cols, function(i1, item1){
      if (i1) return true; // 只需遍历第一层
      layui.each(item1, function(i2, item2){
        eachChildCols(index, cols, i1, item2);
        if(item2.PARENT_COL_INDEX) return; //如果是子列，则不进行追加，因为已经存储在父列中
        arrs.push(item2)
      });
    });

    //重新遍历列，如果有子列，则进入递归
    var eachArrs = function(obj){
      layui.each(obj || arrs, function(i, item){
        if(item.CHILD_COLS) return eachArrs(item.CHILD_COLS);
        typeof callback === 'function' && callback(i, item);
      });
    };

    eachArrs();
  };

  // 获取表格选中状态
  table.checkStatus = function(id){
    var nums = 0;
    var invalidNum = 0;
    var arr = [];
    var data = table.cache[id] || [];

    //计算全选个数
    layui.each(data, function(i, item){
      if(layui.type(item) === 'array' || item[table.config.disabledName]){
        invalidNum++; // 无效数据，或已删除的
        return;
      }
      if(item[table.config.checkName]){
        nums++;
        if(!item[table.config.disabledName]){
          arr.push(table.clearCacheKey(item));
        }
      }
    });
    return {
      data: arr, // 选中的数据
      isAll: data.length ? (nums === (data.length - invalidNum)) : false // 是否全选
    };
  };

  // 设置行选中状态
  table.setRowChecked = function(id, opts){
    var that = getThisTable(id);
    if(!that) return;
    that.setRowChecked(opts);
  };

  // 获取表格当前页的所有行数据
  table.getData = function(id){
    var arr = [];
    var data = table.cache[id] || [];
    layui.each(data, function(i, item){
      if(layui.type(item) === 'array'){
        return;
      }
      arr.push(table.clearCacheKey(item));
    });
    return arr;
  };

  // 重置表格尺寸结构
  table.resize = function(id){
    // 若指定表格唯一 id，则只执行该 id 对应的表格实例
    if(id){
      var config = getThisTableConfig(id); // 获取当前实例配置项
      if(!config) return;

      getThisTable(id).resize();

    } else { // 否则重置所有表格实例尺寸
      layui.each(thisTable.that, function(){
        this.resize();
      });
    }
  };

  // 表格导出
  table.exportFile = function(id, data, opts){
    data = data || table.clearCacheKey(table.cache[id]);
    opts = typeof opts === 'object' ? opts : function(){
      var obj = {};
      opts && (obj.type = opts);
      return obj;
    }();

    var type = opts.type || 'csv';
    var thatTable = thisTable.that[id];
    var config = thisTable.config[id] || {};
    var textType = ({
      csv: 'text/csv',
      xls: 'application/vnd.ms-excel'
    })[type];
    var alink = document.createElement("a");

    if(device.ie) return hint.error('IE_NOT_SUPPORT_EXPORTS');

    // 处理 treeTable 数据
    if (config.tree && config.tree.view) {
      try {
        data = $.extend(true, [], table.cache[id]);
        data = (function fn(data) {
          return data.reduce(function (acc, obj){
            var children = obj.children || [];
            delete obj.children;
            return acc.concat(obj, fn(children));
          }, []);
        })(Array.from(data));
      } catch (e) {}
    }

    alink.href = 'data:'+ textType +';charset=utf-8,\ufeff'+ encodeURIComponent(function(){
      var dataTitle = [];
      var dataMain = [];
      var dataTotal = [];
      var fieldsIsHide = {};

      // 表头和表体
      layui.each(data, function(i1, item1){
        var vals = [];
        if(typeof id === 'object'){ // 若 id 参数直接为表头数据
          layui.each(id, function(i, item){
            i1 == 0 && dataTitle.push(item || '');
          });
          layui.each(layui.isArray(item1) ? $.extend([], item1) : table.clearCacheKey(item1), function(i2, item2){
            vals.push('"'+ (item2 || '') +'"');
          });
        } else {
          table.eachCols(id, function(i3, item3){
            if(item3.ignoreExport === false || item3.field && item3.type == 'normal'){
              // 不导出隐藏列，除非设置 ignoreExport 强制导出
              if (
                (item3.hide && item3.ignoreExport !== false) ||
                item3.ignoreExport === true // 忽略导出
              ) {
                if(i1 == 0) fieldsIsHide[item3.field] = true; // 记录隐藏列
                return;
              }

              var content = item1[item3.field];
              if(content === undefined || content === null) content = '';

              i1 == 0 && dataTitle.push(item3.fieldTitle || item3.title || item3.field || '');

              // 解析内容
              content = parseTempData.call(thatTable, {
                item3: item3,
                content: content,
                tplData: item1,
                text: 'text',
                obj: {
                  td: function(field){
                    var td = thatTable.layBody.find('tr[data-index="'+ i1 +'"]>td');
                    return td.filter('[data-field="'+ field +'"]');
                  }
                }
              });

              // 异常处理
              content = content.replace(/"/g, '""'); // 避免内容存在「双引号」导致异常分隔
              // content += '\t'; // 加「水平制表符」 避免内容被转换格式
              content = '"'+ content +'"'; // 避免内容存在「逗号」导致异常分隔

              // 插入内容
              vals.push(content);
            }
          });
        }
        dataMain.push(vals.join(','));
      });

      // 表合计
      thatTable && layui.each(thatTable.dataTotal, function(i, o){
        fieldsIsHide[o.field] || dataTotal.push('"' + (o.total || '') + '"');
      });

      return dataTitle.join(',') + '\r\n' + dataMain.join('\r\n') + '\r\n' + dataTotal.join(',');
    }());

    alink.download = (opts.title || config.title || 'table_'+ (config.index || '')) + '.' + type;
    document.body.appendChild(alink);
    alink.click();
    document.body.removeChild(alink);
  };

  // 获取表格配置信息
  table.getOptions = function (id) {
    return getThisTableConfig(id);
  }

  // 显示或隐藏列
  table.hideCol = function (id, cols) {
    var that = getThisTable(id);
    if (!that) {
      return;
    }

    if (layui.type(cols) === 'boolean') {
      // 显示全部或者隐藏全部
      that.eachCols(function (i2, item2) {
        var key = item2.key;
        var col = that.col(key);
        var parentKey = item2.parentKey;
        // 同步勾选列的 hide 值和隐藏样式
        if (col.hide != cols) {
          var hide = col.hide = cols;
          that.elem.find('*[data-key="'+ key +'"]')[
            hide ? 'addClass' : 'removeClass'
            ](HIDE);
          // 根据列的显示隐藏，同步多级表头的父级相关属性值
          that.setParentCol(hide, parentKey);
        }
      })
    } else {
      cols = layui.isArray(cols) ? cols : [cols];
      layui.each(cols, function (i1, item1) {
        that.eachCols(function (i2, item2) {
          if (item1.field === item2.field) {
            var key = item2.key;
            var col = that.col(key);
            var parentKey = item2.parentKey;
            // 同步勾选列的 hide 值和隐藏样式
            if ('hide' in item1 && col.hide != item1.hide) {
              var hide = col.hide = !!item1.hide;
              that.elem.find('*[data-key="'+ key +'"]')[
                hide ? 'addClass' : 'removeClass'
                ](HIDE);
              // 根据列的显示隐藏，同步多级表头的父级相关属性值
              that.setParentCol(hide, parentKey);
            }
          }
        })
      });
    }
    $('.' + ELEM_TOOL_PANEL).remove(); // 关闭字段筛选面板如果打开的话
    // 重新适配尺寸
    that.resize();
  }

  // 重载
  table.reload = function(id, options, deep, type){
    var config = getThisTableConfig(id); //获取当前实例配置项
    if(!config) return;

    var that = getThisTable(id);
    that.reload(options, deep, type);

    return thisTable.call(that);
  };

  // 仅重载数据
  table.reloadData = function(){
    var args = $.extend([], arguments);
    args[3] = 'reloadData';

    // 重载时，影响整个结构的参数，不适合更新的参数
    var dataParams = new RegExp('^('+ [
      'elem', 'id', 'cols', 'width', 'height', 'maxHeight',
      'toolbar', 'defaultToolbar',
      'className', 'css', 'pagebar'
    ].join('|') + ')$');

    // 过滤与数据无关的参数
    layui.each(args[1], function (key, value) {
      if(dataParams.test(key)){
        delete args[1][key];
      }
    });

    return table.reload.apply(null, args);
  };

  // 核心入口
  table.render = function(options){
    var inst = new Class(options);
    return thisTable.call(inst);
  };

  // 清除临时 Key
  table.clearCacheKey = function(data){
    data = $.extend({}, data);
    delete data[table.config.checkName];
    delete data[table.config.indexName];
    delete data[table.config.numbersName];
    delete data[table.config.disabledName];
    return data;
  };

  // 自动完成渲染
  $(function(){
    table.init();
  });

  exports(MOD_NAME, table);
});
