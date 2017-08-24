/**

 @Name：layui.table 表格操作
 @Author：贤心
 @License：MIT
    
 */
 
layui.define(['laytpl', 'laypage', 'layer', 'form'], function(exports){
  "use strict";
  
  var $ = layui.$
  ,laytpl = layui.laytpl
  ,laypage = layui.laypage
  ,layer = layui.layer
  ,form = layui.form
  ,hint = layui.hint()
  ,device = layui.device()

  //外部接口
  ,table = {
    config: {
      checkName: 'LAY_CHECKED' //是否选中状态的字段名
    } //全局配置项
    ,cache: {} //数据缓存
    ,index: layui.table ? (layui.table.index + 10000) : 0
    
    //设置全局项
    ,set: function(options){
      var that = this;
      that.config = $.extend({}, that.config, options);
      return that;
    }
    
    //事件监听
    ,on: function(events, callback){
      return layui.onevent.call(this, MOD_NAME, events, callback);
    }
  }
  
  //操作当前实例
  ,thisTable = function(){
    var that = this;
    return {
      reload: function(options){
        that.reload.call(that, options);
      }
      ,config: that.config
    }
  }
  
  //字符常量
  ,MOD_NAME = 'table', ELEM = '.layui-table', THIS = 'layui-this', SHOW = 'layui-show', HIDE = 'layui-hide', DISABLED = 'layui-disabled'
  
  ,ELEM_VIEW = 'layui-table-view', ELEM_HEADER = '.layui-table-header', ELEM_BODY = '.layui-table-body', ELEM_MAIN = '.layui-table-main', ELEM_FIXED = '.layui-table-fixed', ELEM_FIXL = '.layui-table-fixed-l', ELEM_FIXR = '.layui-table-fixed-r', ELEM_TOOL = '.layui-table-tool', ELEM_SORT = '.layui-table-sort', ELEM_EDIT = 'layui-table-edit', ELEM_HOVER = 'layui-table-hover'
  
  //thead区域模板
  ,TPL_HEADER = function(options){
    options = options || {};
    return ['<table cellspacing="0" cellpadding="0" border="0" class="layui-table" '
      ,'{{# if(d.data.skin){ }}lay-skin="{{d.data.skin}}"{{# } }} {{# if(d.data.size){ }}lay-size="{{d.data.size}}"{{# } }} {{# if(d.data.even){ }}lay-even{{# } }}>'
      ,'<thead>'
      ,'{{# layui.each(d.data.cols, function(i1, item1){ }}'
        ,'<tr>'
        ,'{{# layui.each(item1, function(i2, item2){ }}'
          ,'{{# if(item2.fixed && item2.fixed !== "right"){ fixed = true; } }}'
          ,'{{# if(item2.fixed){ right = true; } }}'
          ,function(){
            if(options.fixed && options.fixed !== 'right'){
              return '{{# if(item2.fixed && item2.fixed !== "right"){ }}';
            }
            if(options.fixed === 'right'){
              return '{{# if(item2.fixed === "right"){ }}';
            }
            return '';
          }()
          ,'{{# if(item2.checkbox){ }}'
            ,'<th data-field="{{ item2.field||i2 }}" data-type="checkbox" unresize="true"><div class="layui-table-cell laytable-cell-checkbox"><input type="checkbox" name="layTableCheckbox" lay-skin="primary" lay-filter="layTableAllChoose" {{# if(item2[d.data.checkName]){ }}checked{{# }; }}></div></th>'
          ,'{{# } else if(item2.space){ }}'
            ,'<th data-field="{{ item2.field||i2 }}" unresize="true"><div class="layui-table-cell laytable-cell-space"></div></th>'
          ,'{{# } else { }}'
            ,'<th data-field="{{ item2.field||i2 }}" {{#if(item2.colspan){}} colspan="{{item2.colspan}}"{{#} if(item2.rowspan){}} rowspan="{{item2.rowspan}}"{{#}}} {{# if(item2.unresize){ }}unresize="true"{{# } }}>'
              ,'{{# if(item2.colspan > 1){ }}'
                ,'<div class="layui-table-cell laytable-cell-group" {{#if(item2.align){}}align="{{item2.align}}"{{#}}}>'
                  ,'<span>{{item2.title||""}}</span>'
                ,'</div>'
              ,'{{# } else { }}'
                ,'<div class="layui-table-cell laytable-cell-{{d.index}}-{{item2.field||i2}}" {{#if(item2.align){}}align="{{item2.align}}"{{#}}}>'
                  ,'<span>{{item2.title||""}}</span>'
                  ,'{{# if(item2.sort){ }}'
                    ,'<span class="layui-table-sort layui-inline"><i class="layui-edge layui-table-sort-asc"></i><i class="layui-edge layui-table-sort-desc"></i></span>'
                  ,'{{# } }}'
                ,'</div>'
              ,'{{# } }}'
            ,'</th>'
          ,'{{# }; }}'
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
  ,TPL_MAIN = ['<div class="layui-form layui-border-box {{d.VIEW_CLASS}}" lay-filter="LAY-table-{{d.index}}" style="{{# if(d.data.width){ }}width:{{d.data.width}}px;{{# } }} {{# if(d.data.height){ }}height:{{d.data.height}}px;{{# } }}">'
    ,'{{# var fixed, right; }}'
    ,'<div class="layui-table-header">'
      ,TPL_HEADER()
    ,'</div>'
    ,'<div class="layui-table-body layui-table-main">'
      ,TPL_BODY
    ,'</div>'
    
    ,'{{# if(fixed && fixed !== "right"){ }}'
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
    
    ,'{{# if(d.data.page){ }}'
    ,'<div class="layui-table-tool">'
      ,'<div class="layui-inline layui-table-page" id="layui-table-page{{d.index}}"></div>'
    ,'</div>'
    ,'{{# } }}'
    
    ,'<style>'
    ,'{{# layui.each(d.data.cols, function(i1, item1){'
      ,'layui.each(item1, function(i2, item2){ }}'
        ,'.laytable-cell-{{d.index}}-{{item2.field||i2}}{ width:{{item2.width||50}}px }'
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
  
  //默认配置
  Class.prototype.config = {
    limit: 30 //每页显示的数量
    ,loading: true //请求数据时，是否显示loading
  };

  //表格渲染
  Class.prototype.render = function(){
    var that = this, options = that.config;

    options.elem = $(options.elem);
    options.where = options.where || {};
    
    if(!options.elem[0]) return that;

    var othis = options.elem
    ,hasRender = othis.next('.' + ELEM_VIEW)

    //替代元素
    ,reElem = that.elem = $(laytpl(TPL_MAIN).render({
      VIEW_CLASS: ELEM_VIEW
      ,data: options
      ,index: that.index //索引
    }));
    
    options.index = that.index;
    
    //生成替代元素
    hasRender[0] && hasRender.remove(); //如果已经渲染，则Rerender
    othis.after(reElem);
    
    //各级容器
    that.layHeader = reElem.find(ELEM_HEADER);
    that.layMain = reElem.find(ELEM_MAIN);
    that.layBody = reElem.find(ELEM_BODY);
    that.layFixed = reElem.find(ELEM_FIXED);
    that.layFixLeft = reElem.find(ELEM_FIXL);
    that.layFixRight = reElem.find(ELEM_FIXR);
    that.layTool = reElem.find(ELEM_TOOL);
    
    //设置body区域高度
    if(options.height){
      var bodyHeight = parseFloat(options.height) - parseFloat(that.layHeader.height()) - 1;
      if(options.page){
        bodyHeight = bodyHeight - parseFloat(that.layTool.outerHeight() + 1);
      }
      that.layBody.css('height', bodyHeight);
    }
    
    that.pullData(1);
    that.events();
  };
  
  //表格重载
  Class.prototype.reload = function(options){
    var that = this;
    that.config = $.extend({}, that.config, options);
    that.render();
  };
  
  //获得数据
  Class.prototype.pullData = function(curr, loadIndex){
    var that = this
    ,options = that.config;
    
    if(options.url){ //Ajax请求
      $.ajax({
        type: options.method || 'get'
        ,url: options.url
        ,data: $.extend({
          page: curr
          ,limit: options.limit
        }, options.where)
        ,dataType: 'json'
        ,success: function(res){
          if(res.code != 0){
            return layer.msg(res.msg);
          }
          that.renderData(res, curr, res.count);
          loadIndex && layer.close(loadIndex);
          typeof options.done === 'function' && options.done(res, curr, res.count);
        }
        ,error: function(e, m){
          layer.msg('数据请求异常');
          hint.error('初始table时的接口'+ options.url + '异常：'+ m);
          loadIndex && layer.close(loadIndex);
        }
      });
    } else if(options.data && options.data.constructor === Array){ //已知数据
      var startLimit = curr*options.limit - options.limit
      ,res = {
        data: options.data.concat().splice(startLimit, options.limit)
        ,count: options.data.length
      };
      that.renderData(res, curr, options.data.length);
      typeof options.done === 'function' && options.done(res, curr, res.count);
    }
  };
  
  //页码
  Class.prototype.page = 1;
  
  //遍历表头
  Class.prototype.eachCols = function(callback){
    layui.each(this.config.cols, function(i1, item1){
      layui.each(item1, function(i2, item3){
        callback(i2, item3, [i1, item1]);
      });
    });
  };
  
  //数据渲染
  Class.prototype.renderData = function(res, curr, count, sort){
    var that = this
    ,data = res.data
    ,options = that.config
    ,trs = []
    ,trs_fixed = []
    ,trs_fixed_r = []
    
    //渲染视图
    ,render = function(){
      if(!sort && that.sortKey){
        return that.sort(that.sortKey.field, that.sortKey.sort, true);
      }
      layui.each(data, function(i1, item1){
        var tds = [], tds_fixed = [], tds_fixed_r = [];
        that.eachCols(function(i3, item3){
          var content = item1[item3.field||i3];
          if(content === undefined || content === null) content = '';
          
          if(item3.colspan > 1) return;
          
          var td = ['<td data-field="'+ (item3.field||i3) +'"'+ function(){
            var attr = [];
            if(item3.edit) attr.push(' data-edit="true"'); //是否允许单元格编辑
            if(item3.align) attr.push(' align="'+ item3.align +'"'); //对齐方式
            if(item3.templet) attr.push(' data-content="'+ content +'"'); //自定义模板
            if(item3.toolbar) attr.push(' data-off="true"'); //自定义模板
            if(item3.event) attr.push(' lay-event="'+ item3.event +'"'); //自定义事件
            if(item3.style) attr.push(' style="'+ item3.style +'"'); //自定义样式
            return attr.join('');
          }() +'>'
            ,'<div class="layui-table-cell laytable-cell-'+ function(){
              if(item3.checkbox) return 'checkbox';
              if(item3.space) return 'space'; //间距
              return options.index + '-' + (item3.field||i3);
            }() +'">' + function(){
              if(item3.checkbox){
                return '<input type="checkbox" name="layTableCheckbox" lay-skin="primary" '+ function(){
                  var checkName = table.config.checkName;
                  if(item3[checkName]){
                    item1[checkName] = item3[checkName];
                    return item3[checkName] ? 'checked' : ''; 
                  }
                  return item1[checkName] ? 'checked' : '';                   
                }() +'>';
              }
              if(item3.toolbar){
                return laytpl($(item3.toolbar).html()||'').render(item1);
              }
              return item3.templet ? laytpl($(item3.templet).html() || String(content)).render(item1) : content;
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
      that.layMain.find('tbody').html(trs.join(''));
      that.layFixLeft.find('tbody').html(trs_fixed.join(''));
      that.layFixRight.find('tbody').html(trs_fixed_r.join(''));
      
      form.render('checkbox', 'LAY-table-'+that.index);
      that.syncCheckAll();
      that.haveInit ? that.scrollPatch() : setTimeout(function(){
        that.scrollPatch();
      }, 50);
      that.haveInit = true;
    };
    
    that.key = options.id || options.index;
    table.cache[that.key] = data; //记录数据
    
    //排序
    if(sort){
      return render();
    } else {
      that.cacheData = data;
    }
    
    if(data.length === 0){
      return that.layMain.html('<div class="layui-none">无数据</div>');
    }

    render();
    
    //分页
    if(options.page){
      that.page = curr;
      that.count = count;
      laypage.render({
        elem: 'layui-table-page' + options.index
        ,count: count
        ,groups: 3
        ,limits: options.limits || [10,20,30,40,50,60,70,80,90]
        ,limit: options.limit
        ,curr: curr
        ,layout: ['prev', 'page', 'next', 'skip', 'count', 'limit']
        ,prev: '<i class="layui-icon">&#xe603;</i>'
        ,next: '<i class="layui-icon">&#xe602;</i>'
        ,jump: function(obj, first){
          if(!first){
            that.page = obj.curr;
            options.limit = obj.limit;
            that.pullData(obj.curr, that.loading());
          }
        }
      });
      that.layTool.find('.layui-table-count span').html(count)
    }
  };
  
  //数据排序
  Class.prototype.sort = function(th, type, pull){
    var that = this
    ,field
    ,config = that.config
    ,thisData = table.cache[that.key];
    
    //字段匹配
    if(typeof th === 'string'){
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
      var field = field || th.data('field');
      
      //如果欲执行的排序已在状态中，则不执行渲染
      if(that.sortKey && !pull){
        if(field === that.sortKey.field && type === that.sortKey.sort){
          return;
        }
      }
      
      var elemSort = that.layHeader.find('th .laytable-cell-'+ config.index +'-'+ field).find(ELEM_SORT);
      that.layHeader.find('th').find(ELEM_SORT).removeAttr('lay-sort'); //清除其它标题排序状态
      elemSort.attr('lay-sort', type || null);
      that.layFixed.find('th')
    } catch(e){
      return hint.error('未到匹配field');
    }
    
    that.sortKey = {
      field: field
      ,sort: type
    };

    if(type === 'asc'){ //升序
      thisData = layui.sort(thisData, field);
    } else if(type === 'desc'){ //降序
      thisData = layui.sort(thisData, field, true);
    } else { //清除排序
      thisData = that.cacheData;
      delete that.sortKey;
    }

    that.renderData({
      data: thisData
    }, that.page, that.count, true);
    layer.close(that.tipsIndex);
  };
  
  //请求loading
  Class.prototype.loading = function(){
    var that = this
    ,config = that.config;
    if(config.loading && config.url){
      return layer.msg('数据请求中', {
        icon: 16
        ,offset: [
          that.layTool.offset().top - 100 - _WIN.scrollTop() + 'px'
          ,that.layTool.offset().left + that.layTool.width()/2 - 90 - _WIN.scrollLeft() + 'px'
        ]
        ,anim: -1
        ,fixed: false
      });
    }
  };
  
  //同步选中值状态
  Class.prototype.setCheckData = function(index, checked){
    var that = this
    ,config = that.config
    ,thisData = table.cache[that.key];
    if(!thisData[index]) return;
    thisData[index][config.checkName] = checked;
    that.cacheData[index][config.checkName] = checked;
  };
  
  //同步全选按钮状态
  Class.prototype.syncCheckAll = function(){
    var that = this
    ,config = that.config
    ,checkAllElem = that.layHeader.find('input[name="layTableCheckbox"]')
    ,syncColsCheck = function(checked){
      that.eachCols(function(i, item){
        if(item.checkbox){
          item[config.checkName] = checked;
        }
      });
      return checked;
    };
    
    if(!checkAllElem[0]) return

    if(table.checkStatus(that.key).isAll){
      if(!checkAllElem[0].checked){
        checkAllElem.prop('checked', true);
        form.render('checkbox', 'LAY-table-'+that.index);
      }
      syncColsCheck(true);
    } else {
      if(checkAllElem[0].checked){
        checkAllElem.prop('checked', false);
        form.render('checkbox', 'LAY-table-'+that.index);
      }
      syncColsCheck(false);
    }
  };
  
  //获取cssRule
  Class.prototype.getCssRule = function(field, callback){
    var that = this
    ,style = that.elem.find('style')[0]
    ,sheet = style.sheet || style.styleSheet
    ,rules = sheet.cssRules || sheet.rules;
    layui.each(rules, function(i, item){
      if(item.selectorText === ('.laytable-cell-'+ that.index +'-'+ field)){
        return callback(item), true;
      }
    });
  };
  
  //滚动条补丁
  Class.prototype.scrollPatch = function(){
    var that = this
    ,scollWidth = that.layMain.width() - that.layMain.prop('clientWidth') //纵向滚动条宽度
    ,scollHeight = that.layMain.height() - that.layMain.prop('clientHeight'); //横向滚动条高度
    if(scollWidth && scollHeight){
      if(!that.elem.find('.layui-table-patch')[0]){
        var patchElem = $('<th class="layui-table-patch"><div class="layui-table-cell"></div></th>'); //补丁元素
        patchElem.find('div').css({
          width: scollWidth
        });
        that.layHeader.eq(0).find('thead tr').append(patchElem)
      }
    } else {
      that.layHeader.eq(0).find('.layui-table-patch').remove();
    }
    that.layFixed.find(ELEM_BODY).css('height', that.layMain.height() - scollHeight); //固定列区域高度
    that.layFixRight[scollHeight ? 'removeClass' : 'addClass'](HIDE);
    that.layFixRight.css('right', scollWidth - 1); //操作栏
  };

  //事件处理
  Class.prototype.events = function(){
    var that = this
    ,config = that.config
    ,_BODY = $('body')
    ,dict = {}
    ,th = that.layHeader.find('th')
    ,resizing
    ,ELEM_CELL = '.layui-table-cell'
    ,filter = config.elem.attr('lay-filter');

    //拖拽调整宽度    
    th.on('mousemove', function(e){
      var othis = $(this)
      ,oLeft = othis.offset().left
      ,pLeft = e.clientX - oLeft;
      if(othis.attr('colspan') > 1 || othis.attr('unresize') || dict.resizeStart){
        return;
      }
      dict.allowResize = othis.width() - pLeft <= 10; //是否处于拖拽允许区域
      _BODY.css('cursor', (dict.allowResize ? 'col-resize' : ''));
    }).on('mouseleave', function(){
      var othis = $(this);
      if(dict.resizeStart) return;
      _BODY.css('cursor', '');
    }).on('mousedown', function(e){
      if(dict.allowResize){
        var field = $(this).data('field');
        e.preventDefault();
        dict.resizeStart = true; //开始拖拽
        dict.offset = [e.clientX, e.clientY]; //记录初始坐标
        
        that.getCssRule(field, function(item){
          dict.rule = item;
          dict.ruleWidth = parseFloat(item.style.width);
        });
      }
    });
    //拖拽中
    _DOC.on('mousemove', function(e){
      if(dict.resizeStart){
        e.preventDefault();
        if(dict.rule){
          var setWidth = dict.ruleWidth + e.clientX - dict.offset[0];
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
    th.on('click', function(){
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
      that.sort(othis, type);
    }).find(ELEM_SORT+' .layui-edge ').on('click', function(e){
      var othis = $(this)
      ,index = othis.index()
      ,field = othis.parents('th').eq(0).data('field')
      layui.stope(e);
      if(index === 0){
        that.sort(field, 'asc');
      } else {
        that.sort(field, 'desc');
      }
    });
    
    //复选框选择
    that.elem.on('click', 'input[name="layTableCheckbox"]+', function(){
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
        form.render('checkbox', 'LAY-table-'+that.index);
      } else {
        that.setCheckData(index, checked);
        that.syncCheckAll();
      }
      layui.event.call(this, MOD_NAME, 'checkbox('+ filter +')', {
        checked: checked
        ,data: table.cache[that.key][index]
        ,type: isAll ? 'all' : 'one'
      });
    });
    
    //行事件
    that.layBody.on('mouseenter', 'tr', function(){
      var othis = $(this)
      ,index = othis.index();
      that.layBody.find('tr:eq('+ index +')').addClass(ELEM_HOVER)
    }).on('mouseleave', 'tr', function(){
      var othis = $(this)
      ,index = othis.index();
      that.layBody.find('tr:eq('+ index +')').removeClass(ELEM_HOVER)
    });
    
    //单元格编辑
    that.layBody.on('change', '.'+ELEM_EDIT, function(){
      var othis = $(this)
      ,value = this.value
      ,field = othis.parent().data('field')
      ,index = othis.parents('tr').eq(0).data('index')
      layui.event.call(this, MOD_NAME, 'edit('+ filter +')', {
        value: value
        ,data: table.cache[that.key][index]
        ,field: field
      });
    }).on('blur', '.'+ELEM_EDIT, function(){
      var templet
      ,othis = $(this)
      ,field = othis.parent().data('field')
      ,index = othis.parents('tr').eq(0).data('index')
      ,data = table.cache[that.key][index];
      that.eachCols(function(i, item){
        if(item.field == field && item.templet){
          templet = item.templet;
        }
      });
      othis.siblings(ELEM_CELL).html(
        templet ? laytpl($(templet).html() || this.value).render(data) : this.value
      );
      othis.parent().data('content', this.value);
      othis.remove();
    });
    
    //单元格事件
    that.layBody.on('click', 'td', function(){
      var othis = $(this)
      ,field = othis.data('field')
      ,elemCell = othis.children(ELEM_CELL);
      
      if(othis.data('off')) return;
      
      //显示编辑框
      if(othis.data('edit')){
        var input = $('<input class="'+ ELEM_EDIT +'">');
        input[0].value = othis.data('content') || elemCell.text();
        othis.find('.'+ELEM_EDIT)[0] || othis.append(input);
        return input.focus();
      }
      
      //如果出现省略，则可查看更多
      if(elemCell.prop('scrollWidth') > elemCell.outerWidth()){
        that.tipsIndex = layer.tips([
          '<div class="layui-table-tips-main" style="margin-top: -'+ (elemCell.height() + 16) +'px;'+ function(){
            if(config.size === 'sm'){
              return 'padding: 4px 15px; font-size: 12px;';
            }
            if(config.size === 'lg'){
              return 'padding: 14px 15px;';
            }
            return '';
          }() +'">'
            ,elemCell.html()
          ,'</div>'
          ,'<i class="layui-icon layui-table-tips-c">&#x1006;</i>'
        ].join(''), elemCell[0], {
          tips: [3, '']
          ,time: -1
          ,anim: -1
          ,maxWidth: (device.ios || device.android) ? 300 : 600
          ,isOutAnim: false
          ,skin: 'layui-table-tips'
          ,success: function(layero, index){
            layero.find('.layui-table-tips-c').on('click', function(){
              layer.close(index);
            });
          }
        });
      }
    });
    
    //工具条操作事件
    that.layBody.on('click', '*[lay-event]', function(){
      var othis = $(this)
      ,index = othis.parents('tr').eq(0).data('index')
      ,tr = that.layBody.find('tr[data-index="'+ index +'"]')
      ,ELEM_CLICK = 'layui-table-click';
      
      layui.event.call(this, MOD_NAME, 'tool('+ filter +')', {
        data: table.cache[that.key][index]
        ,event: othis.attr('lay-event')
        ,tr: tr
        ,del: function(){
          var data = this.data;
          delete data[table.config.checkName];
          tr.remove();
          that.scrollPatch();
        }
        ,update: function(fields){
          var data = this.data;
          fields = fields || {};
          layui.each(fields, function(key, value){
            if(key in data){
              var templet;
              data[key] = value;
              that.eachCols(function(i, item2){
                if(item2.field == key && item2.templet){
                  templet = item2.templet;
                }
              });
              tr.children('td[data-field="'+ key +'"]').children(ELEM_CELL).html(
                templet ? laytpl($(templet).html() || value).render(data) : value
              );
            }
          });
        }
      });
      tr.addClass(ELEM_CLICK).siblings('tr').removeClass(ELEM_CLICK);
    });
    
    //同步滚动条
    that.layMain.on('scroll', function(){
      var othis = $(this)
      ,scrollLeft = othis.scrollLeft()
      ,scrollTop = othis.scrollTop();
      
      that.layHeader.scrollLeft(scrollLeft);
      that.layFixed.find(ELEM_BODY).scrollTop(scrollTop);
      
      layer.close(that.tipsIndex);
    });
    
    _WIN.on('resize', function(){ //自适应
       that.scrollPatch();
    });
  };
  
  //初始化
  table.init = function(filter, settings){
    settings = settings || {};
    var that = this
    ,elemTable = filter ? $('table[lay-filter="'+ filter +'"]') : $(ELEM + '[lay-data]');

    //遍历数据表格
    elemTable.each(function(){
      var othis = $(this), tableData = othis.attr('lay-data');
      
      try{
        tableData = new Function('return '+ tableData)();
      } catch(e){
        hint.error('table元素属性lay-data配置项存在语法错误：'+ tableData)
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
            return hint.error('table元素属性lay-data配置项存在语法错误：'+ itemData)
          }
          
          var row = $.extend({
            title: th.text()
            ,colspan: th.attr('colspan') //列单元格
            ,rowspan: th.attr('rowspan') //行单元格
          }, itemData);
          
          cols.push(row)
          options.cols[i].push(row);
        });
      });
      
      //获取表体数据
      othis.find('tbody>tr').each(function(i1){
        var tr = $(this), row = {};
        tr.children('td').each(function(i2, item2){
          var td = $(this)
          ,field = td.data('field');
          if(field){
             return row[field] = td.html();
          }
        });
        layui.each(cols, function(i3, item3){
          var td = tr.children('td').eq(i3);
          row[item3.field] = td.html();
        });
        options.data[i1] = row;
      });
      
      table.render(options);
    });

    return that;
  };
  
  //表格选中状态
  table.checkStatus = function(id){
    var nums = 0
    ,arr = []
    ,data = table.cache[id];
    if(!data) return {};
    //计算全选个数
    layui.each(data, function(i, item){
      if(item[table.config.checkName]){
        nums++;
        arr.push(item);
      }
    });
    return {
      data: arr //选中的数据
      ,isAll: nums === data.length //是否全选
    };
  };
 
  //核心入口
  table.render = function(options){
    var inst = new Class(options);
    return thisTable.call(inst);
  };
  
  //自动完成渲染
  table.init();
  
  exports(MOD_NAME, table);
});

 
