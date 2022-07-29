/**
 * transfer 穿梭框组件
 */

layui.define(['laytpl', 'form'], function(exports){
  "use strict";
  
  var $ = layui.$
  ,laytpl = layui.laytpl
  ,form = layui.form
  
  //模块名
  ,MOD_NAME = 'transfer'

  //外部接口
  ,transfer = {
    config: {}
    ,index: layui[MOD_NAME] ? (layui[MOD_NAME].index + 10000) : 0

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
  ,thisModule = function(){
    var that = this
    ,options = that.config
    ,id = options.id || that.index;
    
    thisModule.that[id] = that; //记录当前实例对象
    thisModule.config[id] = options; //记录当前实例配置项
    
    return {
      config: options
      //重置实例
      ,reload: function(options){
        that.reload.call(that, options);
      }
      //获取右侧数据
      ,getData: function(){
        return that.getData.call(that);
      }
    }
  }
  
  //获取当前实例配置项
  ,getThisModuleConfig = function(id){
    var config = thisModule.config[id];
    if(!config) hint.error('The ID option was not found in the '+ MOD_NAME +' instance');
    return config || null;
  }

  //字符常量
  ,ELEM = 'layui-transfer', HIDE = 'layui-hide', DISABLED = 'layui-btn-disabled', NONE = 'layui-none'
  ,ELEM_BOX = 'layui-transfer-box', ELEM_HEADER = 'layui-transfer-header', ELEM_SEARCH = 'layui-transfer-search', ELEM_ACTIVE = 'layui-transfer-active', ELEM_DATA = 'layui-transfer-data'
  
  //穿梭框模板
  ,TPL_BOX = function(obj){
    obj = obj || {};
    return ['<div class="layui-transfer-box" data-index="'+ obj.index +'">'
      ,'<div class="layui-transfer-header">'
        ,'<input type="checkbox" name="'+ obj.checkAllName +'" lay-filter="layTransferCheckbox" lay-type="all" lay-skin="primary" title="{{ d.data.title['+ obj.index +'] || \'list'+ (obj.index + 1) +'\' }}">'
      ,'</div>'
      ,'{{# if(d.data.showSearch){ }}'
      ,'<div class="layui-transfer-search">'
        ,'<i class="layui-icon layui-icon-search"></i>'
        ,'<input type="input" class="layui-input" placeholder="关键词搜索">'
      ,'</div>'
      ,'{{# } }}'
      ,'<ul class="layui-transfer-data"></ul>'
    ,'</div>'].join('');
  }
  
  //主模板
  ,TPL_MAIN = ['<div class="layui-transfer layui-form layui-border-box" lay-filter="LAY-transfer-{{ d.index }}">'
    ,TPL_BOX({
      index: 0
      ,checkAllName: 'layTransferLeftCheckAll'
    })
    ,'<div class="layui-transfer-active">'
      ,'<button type="button" class="layui-btn layui-btn-sm layui-btn-primary layui-btn-disabled" data-index="0">'
        ,'<i class="layui-icon layui-icon-next"></i>'
      ,'</button>'
      ,'<button type="button" class="layui-btn layui-btn-sm layui-btn-primary layui-btn-disabled" data-index="1">'
        ,'<i class="layui-icon layui-icon-prev"></i>'
      ,'</button>'
    ,'</div>'
    ,TPL_BOX({
      index: 1
      ,checkAllName: 'layTransferRightCheckAll'
    })
  ,'</div>'].join('')

  //构造器
  ,Class = function(options){
    var that = this;
    that.index = ++transfer.index;
    that.config = $.extend({}, that.config, transfer.config, options);
    that.render();
  };

  //默认配置
  Class.prototype.config = {
    title: ['列表一', '列表二']
    ,width: 200
    ,height: 360
    ,data: [] //数据源
    ,value: [] //选中的数据
    ,showSearch: false //是否开启搜索
    ,id: '' //唯一索引，默认自增 index
    ,text: {
      none: '无数据'
      ,searchNone: '无匹配数据'
    }
  };
  
  //重载实例
  Class.prototype.reload = function(options){
    var that = this;
    that.config = $.extend({}, that.config, options);
    that.render();
  };

  //渲染
  Class.prototype.render = function(){
    var that = this
    ,options = that.config;
    
    //解析模板
    var thisElem = that.elem = $(laytpl(TPL_MAIN).render({
      data: options
      ,index: that.index //索引
    }));
    
    var othis = options.elem = $(options.elem);
    if(!othis[0]) return;
    
    //初始化属性
    options.data = options.data || [];
    options.value = options.value || [];
    
    //索引
    that.key = options.id || that.index;
    
    //插入组件结构
    othis.html(that.elem);
    
    //各级容器
    that.layBox = that.elem.find('.'+ ELEM_BOX)
    that.layHeader = that.elem.find('.'+ ELEM_HEADER)
    that.laySearch = that.elem.find('.'+ ELEM_SEARCH)
    that.layData = thisElem.find('.'+ ELEM_DATA);
    that.layBtn = thisElem.find('.'+ ELEM_ACTIVE + ' .layui-btn');
    
    //初始化尺寸
    that.layBox.css({
      width: options.width
      ,height: options.height
    });
    that.layData.css({
      height: function(){
        var height = options.height - that.layHeader.outerHeight();
        if(options.showSearch){
          height -= that.laySearch.outerHeight();
        }
        return height - 2;
      }()
    });
    
    that.renderData(); //渲染数据
    that.events(); //事件
  };
  
  //渲染数据
  Class.prototype.renderData = function(){
    var that = this
    ,options = that.config;
    
    //左右穿梭框差异数据
    var arr = [{
      checkName: 'layTransferLeftCheck'
      ,views: []
    }, {
      checkName: 'layTransferRightCheck'
      ,views: []
    }];
    
    //解析格式
    that.parseData(function(item){      
      //标注为 selected 的为右边的数据
      var _index = item.selected ? 1 : 0
      ,listElem = ['<li>'
        ,'<input type="checkbox" name="'+ arr[_index].checkName +'" lay-skin="primary" lay-filter="layTransferCheckbox" title="'+ item.title +'"'+ (item.disabled ? ' disabled' : '') + (item.checked ? ' checked' : '') +' value="'+ item.value +'">'
      ,'</li>'].join('');
      arr[_index].views.push(listElem);
      delete item.selected;
    });
    
    that.layData.eq(0).html(arr[0].views.join(''));
    that.layData.eq(1).html(arr[1].views.join(''));
    
    that.renderCheckBtn();
  }
  
  //渲染表单
  Class.prototype.renderForm = function(type){
    form.render(type, 'LAY-transfer-'+ this.index);
  };
  
  //同步复选框和按钮状态
  Class.prototype.renderCheckBtn = function(obj){
    var that = this
    ,options = that.config;
    
    obj = obj || {};
    
    that.layBox.each(function(_index){
      var othis = $(this)
      ,thisDataElem = othis.find('.'+ ELEM_DATA)
      ,allElemCheckbox = othis.find('.'+ ELEM_HEADER).find('input[type="checkbox"]')
      ,listElemCheckbox =  thisDataElem.find('input[type="checkbox"]');
      
      //同步复选框和按钮状态
      var nums = 0
      ,haveChecked = false;
      listElemCheckbox.each(function(){
        var isHide = $(this).data('hide');
        if(this.checked || this.disabled || isHide){
          nums++;
        }
        if(this.checked && !isHide){
          haveChecked = true;
        }
      });
      
      allElemCheckbox.prop('checked', haveChecked && nums === listElemCheckbox.length); //全选复选框状态
      that.layBtn.eq(_index)[haveChecked ? 'removeClass' : 'addClass'](DISABLED); //对应的按钮状态
      
      //无数据视图
      if(!obj.stopNone){
        var isNone = thisDataElem.children('li:not(.'+ HIDE +')').length
        that.noneView(thisDataElem, isNone ? '' : options.text.none);
      }
    });
    
    that.renderForm('checkbox');
  };
  
  //无数据视图
  Class.prototype.noneView = function(thisDataElem, text){
    var createNoneElem = $('<p class="layui-none">'+ (text || '') +'</p>');
    if(thisDataElem.find('.'+ NONE)[0]){
      thisDataElem.find('.'+ NONE).remove();
    }
    text.replace(/\s/g, '') && thisDataElem.append(createNoneElem);
  };
  
  //同步 value 属性值
  Class.prototype.setValue = function(){
    var that = this
    ,options = that.config
    ,arr = [];
    that.layBox.eq(1).find('.'+ ELEM_DATA +' input[type="checkbox"]').each(function(){
      var isHide = $(this).data('hide');
      isHide || arr.push(this.value);
    });
    options.value = arr;
    
    return that;
  };

  //解析数据
  Class.prototype.parseData = function(callback){
    var that = this
    ,options = that.config
    ,newData = [];
    
    layui.each(options.data, function(index, item){
      //解析格式
      item = (typeof options.parseData === 'function' 
        ? options.parseData(item) 
      : item) || item;
      
      newData.push(item = $.extend({}, item))
      
      layui.each(options.value, function(index2, item2){
        if(item2 == item.value){
          item.selected = true;
        }
      });
      callback && callback(item);
    });
   
    options.data = newData;
    return that;
  };
  
  //获得右侧面板数据
  Class.prototype.getData = function(value){
    var that = this
    ,options = that.config
    ,selectedData = [];
    
    that.setValue();
    
    layui.each(value || options.value, function(index, item){
      layui.each(options.data, function(index2, item2){
        delete item2.selected;
        if(item == item2.value){
          selectedData.push(item2);
        };
      });
    });
    return selectedData;
  };

  //执行穿梭
  Class.prototype.transfer = function (_index, elem) {
    var that = this
      ,options = that.config
      ,thisBoxElem = that.layBox.eq(_index)
      ,arr = []

    if (!elem) {
      //通过按钮触发找到选中的进行移动
      thisBoxElem.each(function(_index){
        var othis = $(this)
          ,thisDataElem = othis.find('.'+ ELEM_DATA);

        thisDataElem.children('li').each(function(){
          var thisList = $(this)
            ,thisElemCheckbox = thisList.find('input[type="checkbox"]')
            ,isHide = thisElemCheckbox.data('hide');

          if(thisElemCheckbox[0].checked && !isHide){
            thisElemCheckbox[0].checked = false;
            thisBoxElem.siblings('.'+ ELEM_BOX).find('.'+ ELEM_DATA).append(thisList.clone());
            thisList.remove();

            //记录当前穿梭的数据
            arr.push(thisElemCheckbox[0].value);
          }

          that.setValue();
        });
      });
    } else {
      //双击单条记录移动
      var thisList = elem
        ,thisElemCheckbox = thisList.find('input[type="checkbox"]')

      thisElemCheckbox[0].checked = false;
      thisBoxElem.siblings('.'+ ELEM_BOX).find('.'+ ELEM_DATA).append(thisList.clone());
      thisList.remove();

      //记录当前穿梭的数据
      arr.push(thisElemCheckbox[0].value);

      that.setValue();
    }

    that.renderCheckBtn();

    //穿梭时，如果另外一个框正在搜索，则触发匹配
    var siblingInput = thisBoxElem.siblings('.'+ ELEM_BOX).find('.'+ ELEM_SEARCH +' input')
    siblingInput.val() === '' ||  siblingInput.trigger('keyup');

    //穿梭时的回调
    options.onchange && options.onchange(that.getData(arr), _index);
  }

  //事件
  Class.prototype.events = function(){
    var that = this
    ,options = that.config;
    
    //左右复选框
    that.elem.on('click', 'input[lay-filter="layTransferCheckbox"]+', function(){ 
      var thisElemCheckbox = $(this).prev()
      ,checked = thisElemCheckbox[0].checked
      ,thisDataElem = thisElemCheckbox.parents('.'+ ELEM_BOX).eq(0).find('.'+ ELEM_DATA);
      
      if(thisElemCheckbox[0].disabled) return;
      
      //判断是否全选
      if(thisElemCheckbox.attr('lay-type') === 'all'){
        thisDataElem.find('input[type="checkbox"]').each(function(){
          if(this.disabled) return;
          this.checked = checked;
        });
      }

      setTimeout(function () {
        that.renderCheckBtn({stopNone: true});
      }, 0)
    });

    // 双击穿梭
    that.elem.on('dblclick', '.' + ELEM_DATA + '>li', function(event){
      var elemThis = $(this)
        ,thisElemCheckbox = elemThis.children('input[type="checkbox"]')
        ,thisDataElem = elemThis.parent()
        ,thisBoxElem = thisDataElem.parent()

      if(thisElemCheckbox[0].disabled) return;

      that.transfer(thisBoxElem.data('index'), elemThis);
    })

    // 穿梭按钮事件
    that.layBtn.on('click', function(){
      var othis = $(this)
      ,_index = othis.data('index')
      if(othis.hasClass(DISABLED)) return;

      that.transfer(_index);
    });
    
    //搜索
    that.laySearch.find('input').on('keyup', function(){
      var value = this.value;
      var thisDataElem = $(this).parents('.'+ ELEM_SEARCH).eq(0).siblings('.'+ ELEM_DATA);
      var thisListElem = thisDataElem.children('li');

      thisListElem.each(function(){
        var thisList = $(this);
        var thisElemCheckbox = thisList.find('input[type="checkbox"]');
        var title = thisElemCheckbox[0].title;

        // 是否区分大小写
        if(options.showSearch !== 'cs'){
          title = title.toLowerCase();
          value = value.toLowerCase();
        }

        var isMatch = title.indexOf(value) !== -1;

        thisList[isMatch ? 'removeClass': 'addClass'](HIDE);
        thisElemCheckbox.data('hide', isMatch ? false : true);
      });

      that.renderCheckBtn();
      
      //无匹配数据视图
      var isNone = thisListElem.length === thisDataElem.children('li.'+ HIDE).length;
      that.noneView(thisDataElem, isNone ? options.text.searchNone : '');
    });
  };
  
  //记录所有实例
  thisModule.that = {}; //记录所有实例对象
  thisModule.config = {}; //记录所有实例配置项
  
  //重载实例
  transfer.reload = function(id, options){
    var that = thisModule.that[id];
    that.reload(options);
    
    return thisModule.call(that);
  };
  
  //获得选中的数据（右侧面板）
  transfer.getData = function(id){
    var that = thisModule.that[id];
    return that.getData();
  };

  //核心入口
  transfer.render = function(options){
    var inst = new Class(options);
    return thisModule.call(inst);
  };

  exports(MOD_NAME, transfer);
});
