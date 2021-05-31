
/*!
 * layui.table 
 * 数据表格组件
 */

layui.define(['laytpl', 'laypage', 'layer', 'form', 'util'], function(exports){
  "use strict";
  
  var $ = layui.$
  ,laytpl = layui.laytpl
  ,laypage = layui.laypage
  ,layer = layui.layer
  ,form = layui.form
  ,util = layui.util
  ,hint = layui.hint()
  ,device = layui.device()

  //外部接口
  ,table = {
    config: {
      checkName: 'LAY_CHECKED' //是否选中状态的字段名
      ,indexName: 'LAY_TABLE_INDEX' //初始下标索引名，用于恢复排序
    } //全局配置项
    ,cache: {} //数据缓存
    ,index: layui.table ? (layui.table.index + 10000) : 0
    
    //设置全局项
    ,set: function(options){
      var that = this;
      that.config = $.extend({}, that.config, options);
      return that;
    }
    
    //事件
    ,on: function(events, callback){
      return layui.onevent.call(this, MOD_NAME, events, callback);
    }
  }
  
  //操作当前实例
  ,thisTable = function(){
    var that = this
    ,options = that.config
    ,id = options.id || options.index;
    
    if(id){
      thisTable.that[id] = that; //记录当前实例对象
      thisTable.config[id] = options; //记录当前实例配置项
    }
    
    return {
      config: options
      ,reload: function(options, deep){
        that.reload.call(that, options, deep);
      }
      ,setColsWidth: function(){
        that.setColsWidth.call(that);
      }
      ,resize: function(){ //重置表格尺寸/结构
        that.resize.call(that);
      }
    }
  }
  
  //获取当前实例配置项
  ,getThisTableConfig = function(id){
    var config = thisTable.config[id];
    if(!config) hint.error(id ? ('The table instance with ID \''+ id +'\' not found') : 'ID argument required');
    return config || null;
  }
  
  //解析自定义模板数据
  ,parseTempData = function(item3, content, tplData, text){ //表头数据、原始内容、表体数据、是否只返回文本
    var options = this.config || {};
    
    //是否防 xss
    if(options.escape) content = util.escape(content);
    
    //获取内容
    var str = item3.templet ? function(){
      return typeof item3.templet === 'function' 
        ? item3.templet(tplData)
      : laytpl($(item3.templet).html() || String(content)).render(tplData) 
    }() : content;
    return text ? $('<div>'+ str +'</div>').text() : str;
  }
  
  //字符常量
  ,MOD_NAME = 'table', ELEM = '.layui-table', THIS = 'layui-this', SHOW = 'layui-show', HIDE = 'layui-hide', DISABLED = 'layui-disabled', NONE = 'layui-none'
  
  ,ELEM_VIEW = 'layui-table-view', ELEM_TOOL = '.layui-table-tool', ELEM_BOX = '.layui-table-box', ELEM_INIT = '.layui-table-init', ELEM_HEADER = '.layui-table-header', ELEM_BODY = '.layui-table-body', ELEM_MAIN = '.layui-table-main', ELEM_FIXED = '.layui-table-fixed', ELEM_FIXL = '.layui-table-fixed-l', ELEM_FIXR = '.layui-table-fixed-r', ELEM_TOTAL = '.layui-table-total', ELEM_PAGE = '.layui-table-page', ELEM_SORT = '.layui-table-sort', ELEM_EDIT = 'layui-table-edit', ELEM_HOVER = 'layui-table-hover'
  
  //thead区域模板
  ,TPL_HEADER = function(options){
    var rowCols = '{{#if(item2.colspan){}} colspan="{{item2.colspan}}"{{#} if(item2.rowspan){}} rowspan="{{item2.rowspan}}"{{#}}}';
    
    options = options || {};
    return ['<table cellspacing="0" cellpadding="0" border="0" class="layui-table" '
      ,'{{# if(d.data.skin){ }}lay-skin="{{d.data.skin}}"{{# } }} {{# if(d.data.size){ }}lay-size="{{d.data.size}}"{{# } }} {{# if(d.data.even){ }}lay-even{{# } }}>'
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
          ,'<th data-field="{{ item2.field||i2 }}" data-key="{{d.index}}-{{i1}}-{{i2}}" {{# if( item2.parentKey){ }}data-parentkey="{{ item2.parentKey }}"{{# } }} {{# if(item2.minWidth){ }}data-minwidth="{{item2.minWidth}}"{{# } }} '+ rowCols +' {{# if(item2.unresize || item2.colGroup){ }}data-unresize="true"{{# } }} class="{{# if(item2.hide){ }}layui-hide{{# } }}{{# if(isSort){ }} layui-unselect{{# } }}{{# if(!item2.field){ }} layui-table-col-special{{# } }}">'
            ,'<div class="layui-table-cell laytable-cell-'
              ,'{{# if(item2.colGroup){ }}'
                ,'group'
              ,'{{# } else { }}'
                ,'{{d.index}}-{{i1}}-{{i2}}'
                ,'{{# if(item2.type !== "normal"){ }}'
                  ,' laytable-cell-{{ item2.type }}'
                ,'{{# } }}'
              ,'{{# } }}'
            ,'" {{#if(item2.align){}}align="{{item2.align}}"{{#}}}>'
              ,'{{# if(item2.type === "checkbox"){ }}' //复选框
                ,'<input type="checkbox" name="layTableCheckbox" lay-skin="primary" lay-filter="layTableAllChoose" {{# if(item2[d.data.checkName]){ }}checked{{# }; }}>'
              ,'{{# } else { }}'
                ,'<span>{{item2.title||""}}</span>'
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
  }
  
  //tbody区域模板
  ,TPL_BODY = ['<table cellspacing="0" cellpadding="0" border="0" class="layui-table" '
    ,'{{# if(d.data.skin){ }}lay-skin="{{d.data.skin}}"{{# } }} {{# if(d.data.size){ }}lay-size="{{d.data.size}}"{{# } }} {{# if(d.data.even){ }}lay-even{{# } }}>'
    ,'<tbody></tbody>'
  ,'</table>'].join('')
  
  //主模板
  ,TPL_MAIN = ['<div class="layui-form layui-border-box {{d.VIEW_CLASS}}{{# if(d.data.className){ }} {{ d.data.className }}{{# } }}" lay-filter="LAY-table-{{d.index}}" lay-id="{{ d.data.id }}" style="{{# if(d.data.width){ }}width:{{d.data.width}}px;{{# } }} {{# if(d.data.height){ }}height:{{d.data.height}}px;{{# } }}">'

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
      ,'<div class="layui-table-fixed layui-table-fixed-r">'
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
        ,'{{# if(d.data.skin){ }}lay-skin="{{d.data.skin}}"{{# } }} {{# if(d.data.size){ }}lay-size="{{d.data.size}}"{{# } }} {{# if(d.data.even){ }}lay-even{{# } }}>'
          ,'<tbody><tr><td><div class="layui-table-cell" style="visibility: hidden;">Total</div></td></tr></tbody>'
      , '</table>'
      ,'</div>'
    ,'{{# } }}'
    
    ,'{{# if(d.data.page){ }}'
    ,'<div class="layui-table-page">'
      ,'<div id="layui-table-page{{d.index}}"></div>'
    ,'</div>'
    ,'{{# } }}'
    
    ,'<style>'
    ,'{{# layui.each(d.data.cols, function(i1, item1){'
      ,'layui.each(item1, function(i2, item2){ }}'
        ,'.laytable-cell-{{d.index}}-{{i1}}-{{i2}}{ '
        ,'{{# if(item2.width){ }}'
          ,'width: {{item2.width}}px;'
        ,'{{# } }}'
        ,' }'
      ,'{{# });'
    ,'}); }}'
    ,'</style>'
  ,'</div>'].join('')
  
  ,_WIN = $(window)
  ,_DOC = $(document)
  
  //构造器
  ,Class = function(options){
    var that = this;
    that.index = ++table.index;
    that.config = $.extend({}, that.config, table.config, options);
    that.render();
  };
  
  //初始默认配置
  Class.prototype.config = {
    limit: 10 //每页显示的数量
    ,loading: true //请求数据时，是否显示 loading
    ,cellMinWidth: 60 //所有单元格默认最小宽度
    ,defaultToolbar: ['filter', 'exports', 'print'] //工具栏右侧图标
    ,autoSort: true //是否前端自动排序。如果否，则需自主排序（通常为服务端处理好排序）
    ,text: {
      none: '无数据'
    }
  };

  //表格渲染
  Class.prototype.render = function(){
    var that = this
    ,options = that.config;

    options.elem = $(options.elem);
    options.where = options.where || {};
    options.id = options.id || options.elem.attr('id') || that.index;

    //请求参数的自定义格式
    options.request = $.extend({
      pageName: 'page'
      ,limitName: 'limit'
    }, options.request)
    
    //响应数据的自定义格式
    options.response = $.extend({
      statusName: 'code' //规定数据状态的字段名称
      ,statusCode: 0 //规定成功的状态码
      ,msgName: 'msg' //规定状态信息的字段名称
      ,dataName: 'data' //规定数据总数的字段名称
      ,totalRowName: 'totalRow' //规定数据统计的字段名称
      ,countName: 'count'
    }, options.response);
    
    //如果 page 传入 laypage 对象
    if(typeof options.page === 'object'){
      options.limit = options.page.limit || options.limit;
      options.limits = options.page.limits || options.limits;
      that.page = options.page.curr = options.page.curr || 1;
      delete options.page.elem;
      delete options.page.jump;
    }
    
    if(!options.elem[0]) return that;
    
    //高度铺满：full-差距值
    if(options.height && /^full-\d+$/.test(options.height)){
      that.fullHeightGap = options.height.split('-')[1];
      options.height = _WIN.height() - that.fullHeightGap;
    }
    
    //初始化一些参数
    that.setInit();
    
    //开始插入替代元素
    var othis = options.elem
    ,hasRender = othis.next('.' + ELEM_VIEW)
    
    //主容器
    ,reElem = that.elem = $(laytpl(TPL_MAIN).render({
      VIEW_CLASS: ELEM_VIEW
      ,data: options
      ,index: that.index //索引
    }));
    
    options.index = that.index;
    that.key = options.id || options.index;
    
    //生成替代元素
    hasRender[0] && hasRender.remove(); //如果已经渲染，则Rerender
    othis.after(reElem);
    
    //各级容器
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
    
    //初始化工具栏
    that.renderToolbar();
    
    //让表格平铺
    that.fullSize();
    
    //如果多级表头，则填补表头高度
    if(options.cols.length > 1){
      //补全高度
      var th = that.layFixed.find(ELEM_HEADER).find('th');
      th.height(that.layHeader.height() - 1 - parseFloat(th.css('padding-top')) - parseFloat(th.css('padding-bottom')));
    }
    
    that.pullData(that.page); //请求数据
    that.events(); //事件
  };
  
  //根据列类型，定制化参数
  Class.prototype.initOpts = function(item){
    var that = this
    ,options = that.config
    ,initWidth = {
      checkbox: 48
      ,radio: 48
      ,space: 15
      ,numbers: 40
    };
    
    //让 type 参数兼容旧版本
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
    var that = this
    ,options = that.config;
    
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

    //初始化列参数
    layui.each(options.cols, function(i1, item1){
      layui.each(item1, function(i2, item2){
        
        //如果列参数为空，则移除
        if(!item2){
          item1.splice(i2, 1);
          return;
        }
        
        item2.key = i1 + '-' + i2;
        item2.hide = item2.hide || false;

        //设置列的父列索引
        //如果是组合列，则捕获对应的子列
        if(item2.colGroup || item2.colspan > 1){
          var childIndex = 0;
          layui.each(options.cols[i1 + 1], function(i22, item22){
            //如果子列已经被标注为{HAS_PARENT}，或者子列累计 colspan 数等于父列定义的 colspan，则跳出当前子列循环
            if(item22.HAS_PARENT || (childIndex > 1 && childIndex == item2.colspan)) return;
            
            item22.HAS_PARENT = true;
            item22.parentKey = i1 + '-' + i2;

            childIndex = childIndex + parseInt(item22.colspan > 1 ? item22.colspan : 1);
          });
          item2.colGroup = true; //标注是组合列
        }

        //根据列类型，定制化参数
        that.initOpts(item2);
      });
    });
    
  };
  
  //初始工具栏
  Class.prototype.renderToolbar = function(){
    var that = this
    ,options = that.config
    
    //添加工具栏左侧模板
    var leftDefaultTemp = [
      '<div class="layui-inline" lay-event="add"><i class="layui-icon layui-icon-add-1"></i></div>'
      ,'<div class="layui-inline" lay-event="update"><i class="layui-icon layui-icon-edit"></i></div>'
      ,'<div class="layui-inline" lay-event="delete"><i class="layui-icon layui-icon-delete"></i></div>'
    ].join('')
    ,elemToolTemp = that.layTool.find('.layui-table-tool-temp');
    
    if(options.toolbar === 'default'){
      elemToolTemp.html(leftDefaultTemp);
    } else if(typeof options.toolbar === 'string'){
      var toolbarHtml = $(options.toolbar).html() || '';
      toolbarHtml && elemToolTemp.html(
        laytpl(toolbarHtml).render(options)
      );
    }
    
    //添加工具栏右侧面板
    var layout = {
      filter: {
        title: '筛选列'
        ,layEvent: 'LAYTABLE_COLS'
        ,icon: 'layui-icon-cols'
      }
      ,exports: {
        title: '导出'
        ,layEvent: 'LAYTABLE_EXPORT'
        ,icon: 'layui-icon-export'
      }
      ,print: {
        title: '打印'
        ,layEvent: 'LAYTABLE_PRINT'
        ,icon: 'layui-icon-print'
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
  }
  
  //同步表头父列的相关值
  Class.prototype.setParentCol = function(hide, parentKey){
    var that = this
    ,options = that.config
    
    ,parentTh = that.layHeader.find('th[data-key="'+ options.index +'-'+ parentKey +'"]') //获取父列元素
    ,parentColspan = parseInt(parentTh.attr('colspan')) || 0;
    
    if(parentTh[0]){
      var arrParentKey = parentKey.split('-')
      ,getThisCol = options.cols[arrParentKey[0]][arrParentKey[1]];

      hide ? parentColspan-- : parentColspan++;

      parentTh.attr('colspan', parentColspan);
      parentTh[parentColspan < 1 ? 'addClass' : 'removeClass'](HIDE);
      
      getThisCol.colspan = parentColspan; //同步 colspan 参数
      getThisCol.hide = parentColspan < 1; //同步 hide 参数
      
      //递归，继续往上查询是否有父列
      var nextParentKey = parentTh.data('parentkey');
      nextParentKey && that.setParentCol(hide, nextParentKey);
    }
  };
  
  //多级表头补丁
  Class.prototype.setColsPatch = function(){
    var that = this
    ,options = that.config

    //同步表头父列的相关值
    layui.each(options.cols, function(i1, item1){
      layui.each(item1, function(i2, item2){
        if(item2.hide){
          that.setParentCol(item2.hide, item2.parentKey);
        }
      });
    });
  };
  
  //动态分配列宽
  Class.prototype.setColsWidth = function(){
    var that = this
    ,options = that.config
    ,colNums = 0 //列个数
    ,autoColNums = 0 //自动列宽的列个数
    ,autoWidth = 0 //自动列分配的宽度
    ,countWidth = 0 //所有列总宽度和
    ,cntrWidth = that.setInit('width');
    
    //统计列个数
    that.eachCols(function(i, item){
      item.hide || colNums++;
    });

    //减去边框差和滚动条宽
    cntrWidth = cntrWidth - function(){
      return (options.skin === 'line' || options.skin === 'nob') ? 2 : colNums + 1;
    }() - that.getScrollWidth(that.layMain[0]) - 1;

    //计算自动分配的宽度
    var getAutoWidth = function(back){
      //遍历所有列
      layui.each(options.cols, function(i1, item1){
        layui.each(item1, function(i2, item2){
          var width = 0
          ,minWidth = item2.minWidth || options.cellMinWidth; //最小宽度

          if(!item2){
            item1.splice(i2, 1);
            return;
          }

          if(item2.colGroup || item2.hide) return;

          if(!back){
            width = item2.width || 0;
            if(/\d+%$/.test(width)){ //列宽为百分比
              width = Math.floor((parseFloat(width) / 100) * cntrWidth);
              width < minWidth && (width = minWidth);
            } else if(!width){ //列宽未填写
              item2.width = width = 0;
              autoColNums++;
            }
          } else if(autoWidth && autoWidth < minWidth){
            autoColNums--;
            width = minWidth;
          }
          
          if(item2.hide) width = 0;
          countWidth = countWidth + width;
        });
      });

      //如果未填充满，则将剩余宽度平分
      (cntrWidth > countWidth && autoColNums) && (
        autoWidth = (cntrWidth - countWidth) / autoColNums
      );
    }
    
    getAutoWidth();
    getAutoWidth(true); //重新检测分配的宽度是否低于最小列宽
    
    //记录自动列数
    that.autoColNums = autoColNums;
    
    //设置列宽
    that.eachCols(function(i3, item3){
      var minWidth = item3.minWidth || options.cellMinWidth;
      if(item3.colGroup || item3.hide) return;
      
      //给位分配宽的列平均分配宽
      if(item3.width === 0){
        that.getCssRule(options.index +'-'+ item3.key, function(item){
          item.style.width = Math.floor(autoWidth >= minWidth ? autoWidth : minWidth) + 'px';
        });
      }
      
      //给设定百分比的列分配列宽
      else if(/\d+%$/.test(item3.width)){
        that.getCssRule(options.index +'-'+ item3.key, function(item){
          item.style.width = Math.floor((parseFloat(item3.width) / 100) * cntrWidth) + 'px';
        });
      }
    });
    
    //填补 Math.floor 造成的数差
    var patchNums = that.layMain.width() - that.getScrollWidth(that.layMain[0])
    - that.layMain.children('table').outerWidth();

    if(that.autoColNums && patchNums >= -colNums && patchNums <= colNums){
      var getEndTh = function(th){
        var field;
        th = th || that.layHeader.eq(0).find('thead th:last-child')
        field = th.data('field');
        if(!field && th.prev()[0]){
          return getEndTh(th.prev())
        }
        return th
      }
      ,th = getEndTh()
      ,key = th.data('key');

      that.getCssRule(key, function(item){
        var width = item.style.width || th.outerWidth();
        item.style.width = (parseFloat(width) + patchNums) + 'px';
        
        //二次校验，如果仍然出现横向滚动条（通常是 1px 的误差导致）
        if(that.layMain.height() - that.layMain.prop('clientHeight') > 0){
          item.style.width = (parseFloat(item.style.width) - 1) + 'px';
        }
      });
    }
    
    that.loading(!0);
  };
  
  //重置表格尺寸/结构
  Class.prototype.resize = function(){
    var that = this;
    that.fullSize(); //让表格铺满
    that.setColsWidth(); //自适应列宽
    that.scrollPatch(); //滚动条补丁
  };
  
  //表格重载
  Class.prototype.reload = function(options, deep){
    var that = this;
    
    options = options || {};
    delete that.haveInit;
    
    //防止数组深度合并
    layui.each(options, function(key, item){
      if(layui._typeof(item) === 'array') delete that.config[key];
    });
    
    //对参数进行深度或浅扩展
    that.config = $.extend(deep, {}, that.config, options);

    //执行渲染
    that.render();
  };
  
  //异常提示
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
    
    table.cache[that.key] = []; //格式化缓存数据
  };
  
  //页码
  Class.prototype.page = 1;
  
  //获得数据
  Class.prototype.pullData = function(curr){
    var that = this
    ,options = that.config
    ,request = options.request
    ,response = options.response
    ,sort = function(){
      if(typeof options.initSort === 'object'){
        that.sort(options.initSort.field, options.initSort.type);
      }
    };
    
    that.startTime = new Date().getTime(); //渲染开始时间
        
    if(options.url){ //Ajax请求
      var params = {};
      params[request.pageName] = curr;
      params[request.limitName] = options.limit;
      
      //参数
      var data = $.extend(params, options.where);
      if(options.contentType && options.contentType.indexOf("application/json") == 0){ //提交 json 格式
        data = JSON.stringify(data);
      }
      
      that.loading();

      $.ajax({
        type: options.method || 'get'
        ,url: options.url
        ,contentType: options.contentType
        ,data: data
        ,dataType: 'json'
        ,headers: options.headers || {}
        ,success: function(res){
          //如果有数据解析的回调，则获得其返回的数据
          if(typeof options.parseData === 'function'){
            res = options.parseData(res) || res;
          }
          //检查数据格式是否符合规范
          if(res[response.statusName] != response.statusCode){
            that.renderForm();
            that.errorView(
              res[response.msgName] ||
              ('返回的数据不符合规范，正确的成功状态码应为："'+ response.statusName +'": '+ response.statusCode)
            );
          } else {
            that.renderData(res, curr, res[response.countName]), sort();
            options.time = (new Date().getTime() - that.startTime) + ' ms'; //耗时（接口请求+视图渲染）
          }
          that.setColsWidth();
          typeof options.done === 'function' && options.done(res, curr, res[response.countName]);
        }
        ,error: function(e, msg){
          that.errorView('请求异常，错误提示：'+ msg);

          that.renderForm();
          that.setColsWidth();
          
          typeof options.error === 'function' && options.error(e, msg);
        }
      });
    } else if(layui._typeof(options.data) === 'array'){ //已知数据
      var res = {}
      ,startLimit = curr*options.limit - options.limit
      
      res[response.dataName] = options.data.concat().splice(startLimit, options.limit);
      res[response.countName] = options.data.length;
      
      //记录合计行数据
      if(typeof options.totalRow === 'object'){
        res[response.totalRowName] = $.extend({}, options.totalRow);
      }

      that.renderData(res, curr, res[response.countName]), sort();
      that.setColsWidth();
      typeof options.done === 'function' && options.done(res, curr, res[response.countName]);
    }
  };
  
  //遍历表头
  Class.prototype.eachCols = function(callback){
    var that = this;
    table.eachCols(null, callback, that.config.cols);
    return that;
  };

  //数据渲染
  Class.prototype.renderData = function(res, curr, count, sort){
    var that = this
    ,options = that.config
    ,data = res[options.response.dataName] || [] //列表数据
    ,totalRowData = res[options.response.totalRowName] //合计行数据
    ,trs = []
    ,trs_fixed = []
    ,trs_fixed_r = []
    
    //渲染视图
    ,render = function(){ //后续性能提升的重点
      var thisCheckedRowIndex;
      if(!sort && that.sortKey){
        return that.sort(that.sortKey.field, that.sortKey.sort, true);
      }
      layui.each(data, function(i1, item1){
        var tds = [], tds_fixed = [], tds_fixed_r = []
        ,numbers = i1 + options.limit*(curr - 1) + 1; //序号
        
        //若数据项为空数组，则不往下执行（因为删除数据时，会将原有数据设置为 []）
        if(layui._typeof(item1) === 'array' && item1.length === 0) return;
        
        //记录下标索引，用于恢复排序
        if(!sort){
          item1[table.config.indexName] = i1;
        }
        
        //遍历表头
        that.eachCols(function(i3, item3){
          var field = item3.field || i3
          ,key = options.index + '-' + item3.key
          ,content = item1[field];
          
          if(content === undefined || content === null) content = '';
          if(item3.colGroup) return;

          //td内容
          var td = ['<td data-field="'+ field +'" data-key="'+ key +'" '+ function(){ //追加各种属性
            var attr = [];
            if(item3.edit) attr.push('data-edit="'+ item3.edit +'"'); //是否允许单元格编辑
            if(item3.align) attr.push('align="'+ item3.align +'"'); //对齐方式
            if(item3.templet) attr.push('data-content="'+ content +'"'); //自定义模板
            if(item3.toolbar) attr.push('data-off="true"'); //行工具列关闭单元格事件
            if(item3.event) attr.push('lay-event="'+ item3.event +'"'); //自定义事件
            if(item3.style) attr.push('style="'+ item3.style +'"'); //自定义样式
            if(item3.minWidth) attr.push('data-minwidth="'+ item3.minWidth +'"'); //单元格最小宽度
            return attr.join(' ');
          }() +' class="'+ function(){ //追加样式
            var classNames = [];
            if(item3.hide) classNames.push(HIDE); //插入隐藏列样式
            if(!item3.field) classNames.push('layui-table-col-special'); //插入特殊列样式
            return classNames.join(' ');
          }() +'">'
            ,'<div class="layui-table-cell laytable-cell-'+ function(){ //返回对应的CSS类标识
              return item3.type === 'normal' ? key 
              : (key + ' laytable-cell-' + item3.type);
            }() +'">' + function(){
              var tplData = $.extend(true, {
                LAY_INDEX: numbers
                ,LAY_COL: item3
              }, item1)
              ,checkName = table.config.checkName;
              
              //渲染不同风格的列
              switch(item3.type){
                case 'checkbox':
                  return '<input type="checkbox" name="layTableCheckbox" lay-skin="primary" '+ function(){
                    //如果是全选
                    if(item3[checkName]){
                      item1[checkName] = item3[checkName];
                      return item3[checkName] ? 'checked' : '';
                    }
                    return tplData[checkName] ? 'checked' : '';
                  }() +'>';
                break;
                case 'radio':
                  if(tplData[checkName]){
                    thisCheckedRowIndex = i1;
                  }
                  return '<input type="radio" name="layTableRadio_'+ options.index +'" '
                  + (tplData[checkName] ? 'checked' : '') +' lay-type="layTableRadio">';
                break;
                case 'numbers':
                  return numbers;
                break;
              };
              
              //解析工具列模板
              if(item3.toolbar){
                return laytpl($(item3.toolbar).html()||'').render(tplData);
              }
              return parseTempData.call(that, item3, content, tplData);
            }()
          ,'</div></td>'].join('');
          
          tds.push(td);
          if(item3.fixed && item3.fixed !== 'right') tds_fixed.push(td);
          if(item3.fixed === 'right') tds_fixed_r.push(td);
        });
        
        trs.push('<tr data-index="'+ i1 +'">'+ tds.join('') + '</tr>');
        trs_fixed.push('<tr data-index="'+ i1 +'">'+ tds_fixed.join('') + '</tr>');
        trs_fixed_r.push('<tr data-index="'+ i1 +'">'+ tds_fixed_r.join('') + '</tr>');
      });

      that.layBody.scrollTop(0);
      that.layMain.find('.'+ NONE).remove();
      that.layMain.find('tbody').html(trs.join(''));
      that.layFixLeft.find('tbody').html(trs_fixed.join(''));
      that.layFixRight.find('tbody').html(trs_fixed_r.join(''));

      that.renderForm();
      typeof thisCheckedRowIndex === 'number' && that.setThisRowChecked(thisCheckedRowIndex);
      that.syncCheckAll();
      
      //滚动条补丁
      that.haveInit ? that.scrollPatch() : setTimeout(function(){
        that.scrollPatch();
      }, 50);
      that.haveInit = true;
      
      layer.close(that.tipsIndex);
      
      //同步表头父列的相关值
      options.HAS_SET_COLS_PATCH || that.setColsPatch();
      options.HAS_SET_COLS_PATCH = true;
    };
    
    table.cache[that.key] = data; //记录数据
    
    //显示隐藏分页栏
    that.layPage[(count == 0 || (data.length === 0 && curr == 1)) ? 'addClass' : 'removeClass'](HIDE);
    
    //如果无数据
    if(data.length === 0){
      that.renderForm();
      return that.errorView(options.text.none);
    } else {
      that.layFixed.removeClass(HIDE);
    }
    
    //如果执行初始排序
    if(sort){
      return render();
    }
    
    //正常初始化数据渲染
    render(); //渲染数据
    that.renderTotal(data, totalRowData); //数据合计

    //同步分页状态
    if(options.page){
      options.page = $.extend({
        elem: 'layui-table-page' + options.index
        ,count: count
        ,limit: options.limit
        ,limits: options.limits || [10,20,30,40,50,60,70,80,90]
        ,groups: 3
        ,layout: ['prev', 'page', 'next', 'skip', 'count', 'limit']
        ,prev: '<i class="layui-icon">&#xe603;</i>'
        ,next: '<i class="layui-icon">&#xe602;</i>'
        ,jump: function(obj, first){
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
  
  //数据合计行
  Class.prototype.renderTotal = function(data, totalRowData){
    var that = this
    ,options = that.config
    ,totalNums = {};
    
    if(!options.totalRow) return;
    
    layui.each(data, function(i1, item1){
      //若数据项为空数组，则不往下执行（因为删除数据时，会将原有数据设置为 []）
      if(layui._typeof(item1) === 'array' && item1.length === 0) return;
      
      that.eachCols(function(i3, item3){
        var field = item3.field || i3
        ,content = item1[field];

        if(item3.totalRow){ 
          totalNums[field] = (totalNums[field] || 0) + (parseFloat(content) || 0);
        }
      });
    });
    
    that.dataTotal = {};

    var tds = [];
    that.eachCols(function(i3, item3){
      var field = item3.field || i3;
      
      //td 内容
      var content = function(){
        var text = item3.totalRowText || ''
        ,thisTotalNum = parseFloat(totalNums[field]).toFixed(2)
        ,tplData = {}
        ,getContent;
        
        tplData[field] = thisTotalNum;
        
        //获取自动计算的合并内容
        getContent = item3.totalRow ? (parseTempData.call(that, item3, thisTotalNum, tplData) || text) : text;
        
        //如果直接传入了合计行数据，则不输出自动计算的结果
        return totalRowData ? (totalRowData[item3.field] || getContent) : getContent;
      }()
      ,td = ['<td data-field="'+ field +'" data-key="'+ options.index + '-'+ item3.key +'" '+ function(){
        var attr = [];
        if(item3.align) attr.push('align="'+ item3.align +'"'); //对齐方式
        if(item3.style) attr.push('style="'+ item3.style +'"'); //自定义样式
        if(item3.minWidth) attr.push('data-minwidth="'+ item3.minWidth +'"'); //单元格最小宽度
        return attr.join(' ');
      }() +' class="'+ function(){ //追加样式
        var classNames = [];
        if(item3.hide) classNames.push(HIDE); //插入隐藏列样式
        if(!item3.field) classNames.push('layui-table-col-special'); //插入特殊列样式
        return classNames.join(' ');
      }() +'">'
        ,'<div class="layui-table-cell laytable-cell-'+ function(){ //返回对应的CSS类标识
          var str = (options.index + '-' + item3.key);
          return item3.type === 'normal' ? str 
          : (str + ' laytable-cell-' + item3.type);
        }() +'">' + function(){
          var totalRow = item3.totalRow || options.totalRow;
          //如果 totalRow 参数为字符类型，则解析为自定义模版
          if(typeof totalRow === 'string'){
            return laytpl(totalRow).render($.extend({
              TOTAL_NUMS: content
            }, item3))
          }
          return content;
        }()
      ,'</div></td>'].join('');
      
      item3.field && (that.dataTotal[field] = content);
      tds.push(td);
    });

    that.layTotal.find('tbody').html('<tr>' + tds.join('') + '</tr>');
  };
  
  //找到对应的列元素
  Class.prototype.getColElem = function(parent, key){
    var that = this
    ,options = that.config;
    return parent.eq(0).find('.laytable-cell-'+ (options.index + '-' + key) + ':eq(0)');
  };
  
  //渲染表单
  Class.prototype.renderForm = function(type){
    form.render(type, 'LAY-table-'+ this.index);
  };
  
  //标记当前行选中状态
  Class.prototype.setThisRowChecked = function(index){
    var that = this
    ,options = that.config
    ,ELEM_CLICK = 'layui-table-click'
    ,tr = that.layBody.find('tr[data-index="'+ index +'"]');
    
    tr.addClass(ELEM_CLICK).siblings('tr').removeClass(ELEM_CLICK);
  };
  
  //数据排序
  Class.prototype.sort = function(th, type, pull, formEvent){
    var that = this
    ,field
    ,res = {}
    ,options = that.config
    ,filter = options.elem.attr('lay-filter')
    ,data = table.cache[that.key], thisData;
    
    //字段匹配
    if(typeof th === 'string'){
      field = th;
      that.layHeader.find('th').each(function(i, item){
        var othis = $(this)
        ,_field = othis.data('field');
        if(_field === th){
          th = othis;
          field = _field;
          return false;
        }
      });
    }

    try {
      var field = field || th.data('field')
      ,key = th.data('key');
      
      //如果欲执行的排序已在状态中，则不执行渲染
      if(that.sortKey && !pull){
        if(field === that.sortKey.field && type === that.sortKey.sort){
          return;
        }
      }

      var elemSort = that.layHeader.find('th .laytable-cell-'+ key).find(ELEM_SORT);
      that.layHeader.find('th').find(ELEM_SORT).removeAttr('lay-sort'); //清除其它标题排序状态
      elemSort.attr('lay-sort', type || null);
      that.layFixed.find('th')
    } catch(e){
      hint.error('Table modules: sort field \''+ field +'\' not matched');
    }
    
    //记录排序索引和类型
    that.sortKey = {
      field: field
      ,sort: type
    };
    
    //默认为前端自动排序。如果否，则需自主排序（通常为服务端处理好排序）
    if(options.autoSort){
      if(type === 'asc'){ //升序
        thisData = layui.sort(data, field);
      } else if(type === 'desc'){ //降序
        thisData = layui.sort(data, field, true);
      } else { //清除排序
        thisData = layui.sort(data, table.config.indexName);
        delete that.sortKey;
      }
    }
    
    res[options.response.dataName] = thisData || data;
    that.renderData(res, that.page, that.count, true);
    
    if(formEvent){
      layui.event.call(th, MOD_NAME, 'sort('+ filter +')', {
        field: field
        ,type: type
      });
    }
  };
  
  //请求loading
  Class.prototype.loading = function(hide){
    var that = this
    ,options = that.config;
    if(options.loading){
      if(hide){
        that.layInit && that.layInit.remove();
        delete that.layInit;
        that.layBox.find(ELEM_INIT).remove();
      } else {
        that.layInit = $(['<div class="layui-table-init">'
          ,'<i class="layui-icon layui-icon-loading layui-anim layui-anim-rotate layui-anim-loop"></i>'
        ,'</div>'].join(''));
        that.layBox.append(that.layInit);
      }
    }
  };
  
  //同步选中值状态
  Class.prototype.setCheckData = function(index, checked){
    var that = this
    ,options = that.config
    ,thisData = table.cache[that.key];
    if(!thisData[index]) return;
    if(layui._typeof(thisData[index]) === 'array') return;
    thisData[index][options.checkName] = checked;
  };
  
  //同步全选按钮状态
  Class.prototype.syncCheckAll = function(){
    var that = this
    ,options = that.config
    ,checkAllElem = that.layHeader.find('input[name="layTableCheckbox"]')
    ,syncColsCheck = function(checked){
      that.eachCols(function(i, item){
        if(item.type === 'checkbox'){
          item[options.checkName] = checked;
        }
      });
      return checked;
    };
    
    if(!checkAllElem[0]) return;

    if(table.checkStatus(that.key).isAll){
      if(!checkAllElem[0].checked){
        checkAllElem.prop('checked', true);
        that.renderForm('checkbox');
      }
      syncColsCheck(true);
    } else {
      if(checkAllElem[0].checked){
        checkAllElem.prop('checked', false);
        that.renderForm('checkbox');
      }
      syncColsCheck(false);
    }
  };
  
  //获取cssRule
  Class.prototype.getCssRule = function(key, callback){
    var that = this
    ,style = that.elem.find('style')[0]
    ,sheet = style.sheet || style.styleSheet || {}
    ,rules = sheet.cssRules || sheet.rules;
    layui.each(rules, function(i, item){
      if(item.selectorText === ('.laytable-cell-'+ key)){
        return callback(item), true;
      }
    });
  };
  
  //让表格铺满
  Class.prototype.fullSize = function(){
    var that = this
    ,options = that.config
    ,height = options.height, bodyHeight;

    if(that.fullHeightGap){
      height = _WIN.height() - that.fullHeightGap;
      if(height < 135) height = 135;
      that.elem.css('height', height);
    }
    
    if(!height) return;

    //减去列头区域的高度
    bodyHeight = parseFloat(height) - (that.layHeader.outerHeight() || 38); //此处的数字常量是为了防止容器处在隐藏区域无法获得高度的问题，暂时只对默认尺寸的表格做支持。
    
    //减去工具栏的高度
    if(options.toolbar){
      bodyHeight = bodyHeight - (that.layTool.outerHeight() || 50);
    }
    
    //减去统计朗的高度
    if(options.totalRow){
      bodyHeight = bodyHeight - (that.layTotal.outerHeight() || 40);
    }
    
    //减去分页栏的高度
    if(options.page){
      bodyHeight = bodyHeight - (that.layPage.outerHeight() || 41);
    }
    
    that.layMain.css('height', bodyHeight - 2);
  };
  
  //获取滚动条宽度
  Class.prototype.getScrollWidth = function(elem){
    var width = 0;
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
  
  //滚动条补丁
  Class.prototype.scrollPatch = function(){
    var that = this
    ,layMainTable = that.layMain.children('table')
    ,scollWidth = that.layMain.width() - that.layMain.prop('clientWidth') //纵向滚动条宽度
    ,scollHeight = that.layMain.height() - that.layMain.prop('clientHeight') //横向滚动条高度
    ,getScrollWidth = that.getScrollWidth(that.layMain[0]) //获取主容器滚动条宽度，如果有的话
    ,outWidth = layMainTable.outerWidth() - that.layMain.width() //表格内容器的超出宽度
    
    //添加补丁
    ,addPatch = function(elem){
      if(scollWidth && scollHeight){
        elem = elem.eq(0);
        if(!elem.find('.layui-table-patch')[0]){
          var patchElem = $('<th class="layui-table-patch"><div class="layui-table-cell"></div></th>'); //补丁元素
          patchElem.find('div').css({
            width: scollWidth
          });
          elem.find('tr').append(patchElem);
        }
      } else {
        elem.find('.layui-table-patch').remove();
      }
    }
    
    addPatch(that.layHeader);
    addPatch(that.layTotal);
    
    //固定列区域高度
    var mainHeight = that.layMain.height()
    ,fixHeight = mainHeight - scollHeight;
    that.layFixed.find(ELEM_BODY).css('height', layMainTable.height() >= fixHeight ? fixHeight : 'auto');

    //表格宽度小于容器宽度时，隐藏固定列
    that.layFixRight[outWidth > 0 ? 'removeClass' : 'addClass'](HIDE); 
    
    //操作栏
    that.layFixRight.css('right', scollWidth - 1); 
  };

  //事件处理
  Class.prototype.events = function(){
    var that = this
    ,options = that.config
    ,_BODY = $('body')
    ,dict = {}
    ,th = that.layHeader.find('th')
    ,resizing
    ,ELEM_CELL = '.layui-table-cell'
    ,filter = options.elem.attr('lay-filter');
    
    //工具栏操作事件
    that.layTool.on('click', '*[lay-event]', function(e){
      var othis = $(this)
      ,events = othis.attr('lay-event')
      ,openPanel = function(sets){
        var list = $(sets.list)
        ,panel = $('<ul class="layui-table-tool-panel"></ul>');
        
        panel.html(list);
        
        //限制最大高度
        if(options.height){
          panel.css('max-height', options.height - (that.layTool.outerHeight() || 50));
        }
        
        //插入元素
        othis.find('.layui-table-tool-panel')[0] || othis.append(panel);
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
        case 'LAYTABLE_COLS': //筛选列
          openPanel({
            list: function(){
              var lis = [];
              that.eachCols(function(i, item){ 
                if(item.field && item.type == 'normal'){
                  lis.push('<li><input type="checkbox" name="'+ item.field +'" data-key="'+ item.key +'" data-parentkey="'+ (item.parentKey||'') +'" lay-skin="primary" '+ (item.hide ? '' : 'checked') +' title="'+ (item.title || item.field) +'" lay-filter="LAY_TABLE_TOOL_COLS"></li>');
                }
              });
              return lis.join('');
            }()
            ,done: function(){
              form.on('checkbox(LAY_TABLE_TOOL_COLS)', function(obj){
                var othis = $(obj.elem)
                ,checked = this.checked
                ,key = othis.data('key')
                ,parentKey = othis.data('parentkey');
                
                layui.each(options.cols, function(i1, item1){
                  layui.each(item1, function(i2, item2){ 
                    if(i1+ '-'+ i2 === key){
                      var hide = item2.hide;

                      //同步勾选列的 hide 值和隐藏样式
                      item2.hide = !checked;
                      that.elem.find('*[data-key="'+ options.index +'-'+ key +'"]')
                      [checked ? 'removeClass' : 'addClass'](HIDE);
                      
                      //根据列的显示隐藏，同步多级表头的父级相关属性值
                      if(hide != item2.hide){
                        that.setParentCol(!checked, parentKey);
                      }
                      
                      //重新适配尺寸
                      that.resize();
                    }
                  });
                });
              });
            }
          });
        break;
        case 'LAYTABLE_EXPORT': //导出
          if(device.ie){
            layer.tips('导出功能不支持 IE，请用 Chrome 等高级浏览器导出', this, {
              tips: 3
            })
          } else {
            openPanel({
              list: function(){
                return [
                  '<li data-type="csv">导出到 Csv 文件</li>'
                  ,'<li data-type="xls">导出到 Excel 文件</li>'
                ].join('')
              }()
              ,done: function(panel, list){
                list.on('click', function(){
                  var type = $(this).data('type')
                  table.exportFile.call(that, options.id, null, type);
                });
              }
            });
          }
        break;
        case 'LAYTABLE_PRINT': //打印
          var printWin = window.open('打印窗口', '_blank')
          ,style = ['<style>'
            ,'body{font-size: 12px; color: #666;}'
            ,'table{width: 100%; border-collapse: collapse; border-spacing: 0;}'
            ,'th,td{line-height: 20px; padding: 9px 15px; border: 1px solid #ccc; text-align: left; font-size: 12px; color: #666;}'
            ,'a{color: #666; text-decoration:none;}'
            ,'*.layui-hide{display: none}'
          ,'</style>'].join('')
          ,html = $(that.layHeader.html()); //输出表头
          
          html.append(that.layMain.find('table').html()); //输出表体
          html.append(that.layTotal.find('table').html()) //输出合计行
          
          html.find('th.layui-table-patch').remove(); //移除补丁
          html.find('.layui-table-col-special').remove(); //移除特殊列
          
          printWin.document.write(style + html.prop('outerHTML'));
          printWin.document.close();
          printWin.print();
          printWin.close();
        break;
      }
      
      layui.event.call(this, MOD_NAME, 'toolbar('+ filter +')', $.extend({
        event: events
        ,config: options
      },{}));
    });
    
    //拖拽调整宽度    
    th.on('mousemove', function(e){
      var othis = $(this)
      ,oLeft = othis.offset().left
      ,pLeft = e.clientX - oLeft;
      if(othis.data('unresize') || dict.resizeStart){
        return;
      }
      dict.allowResize = othis.width() - pLeft <= 10; //是否处于拖拽允许区域
      _BODY.css('cursor', (dict.allowResize ? 'col-resize' : ''));
    }).on('mouseleave', function(){
      var othis = $(this);
      if(dict.resizeStart) return;
      _BODY.css('cursor', '');
    }).on('mousedown', function(e){
      var othis = $(this);
      if(dict.allowResize){
        var key = othis.data('key');
        e.preventDefault();
        dict.resizeStart = true; //开始拖拽
        dict.offset = [e.clientX, e.clientY]; //记录初始坐标
        
        that.getCssRule(key, function(item){
          var width = item.style.width || othis.outerWidth();
          dict.rule = item;
          dict.ruleWidth = parseFloat(width);
          dict.minWidth = othis.data('minwidth') || options.cellMinWidth;
        });
      }
    });
    
    //拖拽中
    _DOC.on('mousemove', function(e){
      if(dict.resizeStart){
        e.preventDefault();
        if(dict.rule){
          var setWidth = dict.ruleWidth + e.clientX - dict.offset[0];
          if(setWidth < dict.minWidth) setWidth = dict.minWidth;
          dict.rule.style.width = setWidth + 'px';
          layer.close(that.tipsIndex);
        }
        resizing = 1
      }
    }).on('mouseup', function(e){
      if(dict.resizeStart){
        dict = {};
        _BODY.css('cursor', '');
        that.scrollPatch();
      }
      if(resizing === 2){
        resizing = null;
      }
    });
    
    //排序
    th.on('click', function(e){
      var othis = $(this)
      ,elemSort = othis.find(ELEM_SORT)
      ,nowType = elemSort.attr('lay-sort')
      ,type;

      if(!elemSort[0] || resizing === 1) return resizing = 2;      
      
      if(nowType === 'asc'){
        type = 'desc';
      } else if(nowType === 'desc'){
        type = null;
      } else {
        type = 'asc';
      }
      that.sort(othis, type, null, true);
    }).find(ELEM_SORT+' .layui-edge ').on('click', function(e){
      var othis = $(this)
      ,index = othis.index()
      ,field = othis.parents('th').eq(0).data('field')
      layui.stope(e);
      if(index === 0){
        that.sort(field, 'asc', null, true);
      } else {
        that.sort(field, 'desc', null, true);
      }
    });
    
    //数据行中的事件返回的公共对象成员
    var commonMember = function(sets){
      var othis = $(this)
      ,index = othis.parents('tr').eq(0).data('index')
      ,tr = that.layBody.find('tr[data-index="'+ index +'"]')
      ,data = table.cache[that.key] || [];
      

      data = data[index] || {};
      
      return $.extend({
        tr: tr //行元素
        ,data: table.clearCacheKey(data) //当前行数据
        ,del: function(){ //删除行数据
          table.cache[that.key][index] = []; 
          tr.remove();
          that.scrollPatch();
        }
        ,update: function(fields){ //修改行数据
          fields = fields || {};
          layui.each(fields, function(key, value){
            if(key in data){
              var templet, td = tr.children('td[data-field="'+ key +'"]');
              data[key] = value;
              that.eachCols(function(i, item2){
                if(item2.field == key && item2.templet){
                  templet = item2.templet;
                }
              });
              td.children(ELEM_CELL).html(parseTempData.call(that, {
                templet: templet
              }, value, data));
              td.data('content', value);
            }
          });
        }
      }, sets);
    };
    
    //复选框选择
    that.elem.on('click', 'input[name="layTableCheckbox"]+', function(){ //替代元素的 click 事件
      var checkbox = $(this).prev()
      ,childs = that.layBody.find('input[name="layTableCheckbox"]')
      ,index = checkbox.parents('tr').eq(0).data('index')
      ,checked = checkbox[0].checked
      ,isAll = checkbox.attr('lay-filter') === 'layTableAllChoose';

      //全选
      if(isAll){
        childs.each(function(i, item){
          item.checked = checked;
          that.setCheckData(i, checked);
        });
        that.syncCheckAll();
        that.renderForm('checkbox');
      } else {
        that.setCheckData(index, checked);
        that.syncCheckAll();
      }
      
      layui.event.call(checkbox[0], MOD_NAME, 'checkbox('+ filter +')', commonMember.call(checkbox[0], {
        checked: checked
        ,type: isAll ? 'all' : 'one'
      }));
    });
    
    //单选框选择
    that.elem.on('click', 'input[lay-type="layTableRadio"]+', function(){
      var radio = $(this).prev()
      ,checked = radio[0].checked
      ,thisData = table.cache[that.key]
      ,index = radio.parents('tr').eq(0).data('index');
      
      //重置数据单选属性
      layui.each(thisData, function(i, item){
        if(index === i){
          item[options.checkName] = true;
        } else {
          delete item[options.checkName];
        }
      });
      that.setThisRowChecked(index);
      
      layui.event.call(this, MOD_NAME, 'radio('+ filter +')', commonMember.call(this, {
        checked: checked
      }));
    });
    
    //行事件
    that.layBody.on('mouseenter', 'tr', function(){ //鼠标移入行
      var othis = $(this)
      ,index = othis.index();
      if(othis.data('off')) return; //不触发事件
      that.layBody.find('tr:eq('+ index +')').addClass(ELEM_HOVER)
    }).on('mouseleave', 'tr', function(){ //鼠标移出行
      var othis = $(this)
      ,index = othis.index();
      if(othis.data('off')) return; //不触发事件
      that.layBody.find('tr:eq('+ index +')').removeClass(ELEM_HOVER)
    }).on('click', 'tr', function(){ //单击行
      setRowEvent.call(this, 'row');
    }).on('dblclick', 'tr', function(){ //双击行
      setRowEvent.call(this, 'rowDouble');
    });
    
    //创建行单击、双击事件
    var setRowEvent = function(eventType){
      var othis = $(this);
      if(othis.data('off')) return; //不触发事件
      layui.event.call(this,
        MOD_NAME, eventType + '('+ filter +')'
        ,commonMember.call(othis.children('td')[0])
      );
    };
    
    //单元格编辑
    that.layBody.on('change', '.'+ELEM_EDIT, function(){
      var othis = $(this)
      ,value = this.value
      ,field = othis.parent().data('field')
      ,index = othis.parents('tr').eq(0).data('index')
      ,data = table.cache[that.key][index];
      
      data[field] = value; //更新缓存中的值
      
      layui.event.call(this, MOD_NAME, 'edit('+ filter +')', commonMember.call(this, {
        value: value
        ,field: field
      }));
    }).on('blur', '.'+ELEM_EDIT, function(){
      var templet
      ,othis = $(this)
      ,thisElem = this
      ,field = othis.parent().data('field')
      ,index = othis.parents('tr').eq(0).data('index')
      ,data = table.cache[that.key][index];
      that.eachCols(function(i, item){
        if(item.field == field && item.templet){
          templet = item.templet;
        }
      });
      othis.siblings(ELEM_CELL).html(function(value){
        return parseTempData.call(that, {
          templet: templet
        }, value, data);
      }(thisElem.value));
      othis.parent().data('content', thisElem.value);
      othis.remove();
    });
    
    //单元格单击事件
    that.layBody.on('click', 'td', function(e){
      var othis = $(this)
      ,field = othis.data('field')
      ,editType = othis.data('edit')
      ,elemCell = othis.children(ELEM_CELL);
      
      if(othis.data('off')) return; //不触发事件
      
      //显示编辑表单
      if(editType){
        var input = $('<input class="layui-input '+ ELEM_EDIT +'">');
        input[0].value = othis.data('content') || elemCell.text();
        othis.find('.'+ELEM_EDIT)[0] || othis.append(input);
        input.focus();
        layui.stope(e);
        return;
      }
    }).on('mouseenter', 'td', function(){
      gridExpand.call(this)
    }).on('mouseleave', 'td', function(){
       gridExpand.call(this, 'hide');
    });
    
    //单元格展开图标
    var ELEM_GRID = 'layui-table-grid', ELEM_GRID_DOWN = 'layui-table-grid-down', ELEM_GRID_PANEL = 'layui-table-grid-panel'
    ,gridExpand = function(hide){
      var othis = $(this)
      ,elemCell = othis.children(ELEM_CELL);
      
      if(othis.data('off')) return; //不触发事件
      
      if(hide){
        othis.find('.layui-table-grid-down').remove();
      } else if(elemCell.prop('scrollWidth') > elemCell.outerWidth()){
        if(elemCell.find('.'+ ELEM_GRID_DOWN)[0]) return;
        othis.append('<div class="'+ ELEM_GRID_DOWN +'"><i class="layui-icon layui-icon-down"></i></div>');
      }
    };
    
    //单元格展开事件
    that.layBody.on('click', '.'+ ELEM_GRID_DOWN, function(e){
      var othis = $(this)
      ,td = othis.parent()
      ,elemCell = td.children(ELEM_CELL);

      that.tipsIndex = layer.tips([
        '<div class="layui-table-tips-main" style="margin-top: -'+ (elemCell.height() + 16) +'px;'+ function(){
          if(options.size === 'sm'){
            return 'padding: 4px 15px; font-size: 12px;';
          }
          if(options.size === 'lg'){
            return 'padding: 14px 15px;';
          }
          return '';
        }() +'">'
          ,elemCell.html()
        ,'</div>'
        ,'<i class="layui-icon layui-table-tips-c layui-icon-close"></i>'
      ].join(''), elemCell[0], {
        tips: [3, '']
        ,time: -1
        ,anim: -1
        ,maxWidth: (device.ios || device.android) ? 300 : that.elem.width()/2
        ,isOutAnim: false
        ,skin: 'layui-table-tips'
        ,success: function(layero, index){
          layero.find('.layui-table-tips-c').on('click', function(){
            layer.close(index);
          });
        }
      });
      
      layui.stope(e);
    });
    
    //行工具条操作事件
    that.layBody.on('click', '*[lay-event]', function(){
      var othis = $(this)
      ,index = othis.parents('tr').eq(0).data('index');
      layui.event.call(this, MOD_NAME, 'tool('+ filter +')', commonMember.call(this, {
        event: othis.attr('lay-event')
      }));
      that.setThisRowChecked(index);
    });
    
    //同步滚动条
    that.layMain.on('scroll', function(){
      var othis = $(this)
      ,scrollLeft = othis.scrollLeft()
      ,scrollTop = othis.scrollTop();
      
      that.layHeader.scrollLeft(scrollLeft);
      that.layTotal.scrollLeft(scrollLeft);
      that.layFixed.find(ELEM_BODY).scrollTop(scrollTop);
      
      layer.close(that.tipsIndex);
    });

    //自适应
    _WIN.on('resize', function(){
      that.resize();
    });
  };
  
  //一次性事件
  ;(function(){
    //全局点击
    _DOC.on('click', function(){
      _DOC.trigger('table.remove.tool.panel');
    });
    
    //工具面板移除事件
    _DOC.on('table.remove.tool.panel', function(){
      $('.layui-table-tool-panel').remove();
    });
  })();
  
  //初始化
  table.init = function(filter, settings){
    settings = settings || {};
    var that = this
    ,inst = null
    ,elemTable = filter ? $('table[lay-filter="'+ filter +'"]') : $(ELEM + '[lay-data]')
    ,errorTips = 'Table element property lay-data configuration item has a syntax error: ';

    //遍历数据表格
    elemTable.each(function(){
      var othis = $(this), tableData = othis.attr('lay-data');
      
      try {
        tableData = new Function('return '+ tableData)();
      } catch(e) {
        hint.error(errorTips + tableData, 'error')
      }
      
      var cols = [], options = $.extend({
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
          var th = $(this), itemData = th.attr('lay-data');
          
          try{
            itemData = new Function('return '+ itemData)();
          } catch(e){
            return hint.error(errorTips + itemData)
          }
          
          var row = $.extend({
            title: th.text()
            ,colspan: th.attr('colspan') || 0 //列单元格
            ,rowspan: th.attr('rowspan') || 0 //行单元格
          }, itemData);

          if(row.colspan < 2) cols.push(row);
          options.cols[i].push(row);
        });
      });

      //获取表体数据
      othis.find('tbody>tr').each(function(i1){
        var tr = $(this), row = {};
        //如果定义了字段名
        tr.children('td').each(function(i2, item2){
          var td = $(this)
          ,field = td.data('field');
          if(field){
            return row[field] = td.html();
          }
        });
        //如果未定义字段名
        layui.each(cols, function(i3, item3){
          var td = tr.children('td').eq(i3);
          row[item3.field] = td.html();
        });
        options.data[i1] = row;
      });
      
      //执行渲染
      table.render(options);
    });

    return that;
  };
  
  //记录所有实例
  thisTable.that = {}; //记录所有实例对象
  thisTable.config = {}; //记录所有实例配置项
  
  //遍历表头
  table.eachCols = function(id, callback, cols){
    var config = thisTable.config[id] || {}
    ,arrs = [], index = 0;
    
    cols = $.extend(true, [], cols || config.cols);

    //重新整理表头结构
    layui.each(cols, function(i1, item1){
      layui.each(item1, function(i2, item2){
        
        //如果是组合列，则捕获对应的子列
        if(item2.colGroup){
          var childIndex = 0;
          index++
          item2.CHILD_COLS = [];
          
          layui.each(cols[i1 + 1], function(i22, item22){
            //如果子列已经被标注为{PARENT_COL_INDEX}，或者子列累计 colspan 数等于父列定义的 colspan，则跳出当前子列循环
            if(item22.PARENT_COL_INDEX || (childIndex > 1 && childIndex == item2.colspan)) return;
            
            item22.PARENT_COL_INDEX = index;
            
            item2.CHILD_COLS.push(item22);
            childIndex = childIndex + parseInt(item22.colspan > 1 ? item22.colspan : 1);
          });
        }
        
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
  
  //表格选中状态
  table.checkStatus = function(id){
    var nums = 0
    ,invalidNum = 0
    ,arr = []
    ,data = table.cache[id] || [];
    //计算全选个数
    layui.each(data, function(i, item){
      if(layui._typeof(item) === 'array'){
        invalidNum++; //无效数据，或已删除的
        return;
      }
      if(item[table.config.checkName]){
        nums++;
        arr.push(table.clearCacheKey(item));
      }
    });
    return {
      data: arr //选中的数据
      ,isAll: data.length ? (nums === (data.length - invalidNum)) : false //是否全选
    };
  };
  
  //获取表格当前页的所有行数据
  table.getData = function(id){
    var arr = []
    ,data = table.cache[id] || [];
    layui.each(data, function(i, item){
      if(layui._typeof(item) === 'array'){
        return;
      };
      arr.push(table.clearCacheKey(item));
    });
    return arr;
  };
  
  //表格导出
  table.exportFile = function(id, data, type){
    var that = this;
    
    data = data || table.clearCacheKey(table.cache[id]);
    type = type || 'csv';
    
    var thatTable = thisTable.that[id]
    ,config = thisTable.config[id] || {}
    ,textType = ({
      csv: 'text/csv'
      ,xls: 'application/vnd.ms-excel'
    })[type]
    ,alink = document.createElement("a");
    
    if(device.ie) return hint.error('IE_NOT_SUPPORT_EXPORTS');
    
    alink.href = 'data:'+ textType +';charset=utf-8,\ufeff'+ encodeURIComponent(function(){
      var dataTitle = [], dataMain = [], dataTotal = [];
      
      //表头和表体
      layui.each(data, function(i1, item1){
        var vals = [];
        if(typeof id === 'object'){ //如果 id 参数直接为表头数据
          layui.each(id, function(i, item){
            i1 == 0 && dataTitle.push(item || '');
          });
          layui.each(table.clearCacheKey(item1), function(i2, item2){
            vals.push('"'+ (item2 || '') +'"');
          });
        } else {
          table.eachCols(id, function(i3, item3){
            if(item3.field && item3.type == 'normal' && !item3.hide){
              var content = item1[item3.field];
              if(content === undefined || content === null) content = '';
              
              i1 == 0 && dataTitle.push(item3.title || '');
              vals.push('"'+ parseTempData.call(thatTable, item3, content, item1, 'text') + '"');
            }
          });
        }
        dataMain.push(vals.join(','));
      });
      
      //表合计
      layui.each(that.dataTotal, function(key, value){
        dataTotal.push(value);
      });
      
      return dataTitle.join(',') + '\r\n' + dataMain.join('\r\n') + '\r\n' + dataTotal.join(',');
    }());
    
    alink.download = (config.title || 'table_'+ (config.index || '')) + '.' + type; 
    document.body.appendChild(alink);
    alink.click();
    document.body.removeChild(alink); 
  };
  
  //重置表格尺寸结构
  table.resize = function(id){
    //如果指定表格唯一 id，则只执行该 id 对应的表格实例
    if(id){
      var config = getThisTableConfig(id); //获取当前实例配置项
      if(!config) return;
      
      thisTable.that[id].resize();
      
    } else { //否则重置所有表格实例尺寸
      layui.each(thisTable.that, function(){
        this.resize();
      });
    }
  };
  
  //表格重载
  table.reload = function(id, options, deep){
    var config = getThisTableConfig(id); //获取当前实例配置项
    if(!config) return;
    
    var that = thisTable.that[id];
    that.reload(options, deep);
    
    return thisTable.call(that);
  };
 
  //核心入口
  table.render = function(options){
    var inst = new Class(options);
    return thisTable.call(inst);
  };
  
  //清除临时Key
  table.clearCacheKey = function(data){
    data = $.extend({}, data);
    delete data[table.config.checkName];
    delete data[table.config.indexName];
    return data;
  };
  
  //自动完成渲染
  $(function(){
    table.init();
  });
  
  exports(MOD_NAME, table);
});

 
