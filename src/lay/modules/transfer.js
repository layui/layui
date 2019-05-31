/**
 
 @Name：layui.transfer 穿梭框
 @Author：star1029
 @License：MIT

 */

layui.define('form', function(exports){
  "use strict";
  var form = layui.form
  ,$ = layui.$

  //外部接口
  ,transfer = {
    config: {}
    ,index: layui.transfer ? (layui.transfer.index + 10000) : 0

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
  ,thisTran = function(){
    var that = this
    ,options = that.config;
    
    return {
      getValue: function(){
        return that.getValue();
      }
      ,config: options
    }
  }

  //字符常量
  ,MOD_NAME = 'transfer', ELEM_VIEW = 'layui-transfer', TRAN_LEFT = 'layui-transfer-left', TRAN_RIGHT = 'layui-transfer-right', TRAN_LEFT_LIST = 'layui-transfer-dataLeft'
  ,TRAN_RIGHT_LIST = 'layui-transfer-dataRight' ,TRAN_BTN_LEFT = 'layui-transfer-btnLeft', TRAN_BTN_RIGHT = 'layui-transfer-btnRight', TRAN_BTN_DIS = 'layui-btn-disabled'

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
    ,data: [] //数据源
    ,value: [] //选中的数据
    ,showSearch: false //是否开启搜索
    ,id: '' //唯一 ID 标识
  };

  //穿梭框渲染
  Class.prototype.render = function(){
    var that = this
    ,options = that.config
    ,listLeft = '' ,listRight = '' , arr = [];

    //格式转化
    if(typeof options.parseData == 'function'){
      layui.each(options.data, function(index, item){
        options.data[index] = options.parseData(item) || item;
      });
    };   

    //循环列表
    var num = 0 ,li = '',total1 = 0, total2 = 0;
    layui.each(options.data, function(index1, item1){
      num = 0;
      layui.each(options.value, function(index2, item2){
        if(item1.value == item2){
          num = 1;
          return true;
        };
      });
      li = '<li data-title="'+ item1.title +'"><input lay-skin="primary" type="checkbox" data-index="'+ index1 +'" name="'+ (num == 0 ? 'layTranLeftCheck' : 'layTranRightCheck') +'" title="'+ item1.title +'" value="'+ item1.value +'" class="layui-input" '+ (item1.disabled ? 'disabled' : '') +'></li>';
      if(num == 0){
        listLeft += li;
        total1 += item1.disabled ? 0 : 1;
      }else{
        listRight += li;
        total2 += item1.disabled ? 0 : 1;
        arr.push(index1);
      }
    });

    var temp = ['<div class="layui-transfer layui-form" id="transfer-'+ options.id +'" lay-filter="LAY-Transfer-'+ that.index +'">'
      ,'<div class="layui-transfer-left" data-total="'+ total1 +'">'
        ,'<div class="layui-transfer-topTitle"><input lay-skin="primary" name="layTranLeftCheck" lay-filter="layTranLeftCheckAll" type="checkbox" class="layui-input" title="'+ options.title[0] +'"></div>'
        ,function(){
          if(options.showSearch){
            return '<div class="layui-transfer-search"><input class="layui-input" placeholder="关键字搜索"><i class="layui-icon layui-icon-search layui-transfer-searchI"></i></div><ul class="layui-transfer-data layui-transfer-dataLeft short">';
          }else{
            return '<ul class="layui-transfer-data layui-transfer-dataLeft">';
          };
          return '';
        }()
        ,listLeft + '</ul>'
      ,'</div>'
      ,'<div class="layui-transfer-btn">'
        ,'<button class="layui-btn layui-btn-primary layui-transfer-btnRight layui-btn-disabled"><i class="layui-icon layui-icon-next"></i></button>'
        ,'<button class="layui-btn layui-btn-primary layui-transfer-btnLeft layui-btn-disabled"><i class="layui-icon layui-icon-prev"></i></button></div>'
      ,'<div class="layui-transfer-right" data-arr="'+ arr +'" data-total="'+ total2 +'">'
        ,'<div class="layui-transfer-topTitle"><input lay-skin="primary" name="layTranRightCheck" lay-filter="layTranRightCheckAll" type="checkbox" class="layui-input" title="'+ options.title[1] +'"></div>'
        ,function(){
          if(options.showSearch){
            return '<div class="layui-transfer-search"><input class="layui-input" placeholder="关键字搜索"><i class="layui-icon layui-icon-search layui-transfer-searchI"></i></div><ul class="layui-transfer-data layui-transfer-dataRight short">';
          }else{
            return '<ul class="layui-transfer-data layui-transfer-dataRight">';
          };
          return '';
        }()
        ,listRight + '</ul>'
      ,'</div>'
    ,'</div>'].join('');

    //开始插入替代元素
    var othis = $(options.elem)
    ,hasRender = othis.next('.' + ELEM_VIEW);
    
    //生成替代元素
    hasRender[0] && hasRender.remove(); //如果已经渲染，则Rerender

    that.elemTemp = $(temp);
     
    othis.html(that.elemTemp);
    that.event();
    form.render('checkbox', 'LAY-Transfer-' + that.index);
  };

  Class.prototype.event = function(){
    var that = this
    ,options = that.config
    ,elem = that.elemTemp
    ,listLeft = '', listRight = ''
    ,checkTopLeft = elem.find('.'+ TRAN_LEFT).find('.layui-transfer-topTitle').find('input[name="layTranLeftCheck"]')
    ,checkTopRight = elem.find('.'+ TRAN_RIGHT).find('.layui-transfer-topTitle').find('input[name="layTranRightCheck"]')
    ,totalLeft = elem.find('.' + TRAN_LEFT).data('total')
    ,totalRight = elem.find('.' + TRAN_RIGHT).data('total');

    //左选项
    elem.on('click', 'input[name="layTranLeftCheck"]+', function(){ 
      var checkbox = $(this).prev()
      ,checked = checkbox[0].checked
      ,childs = elem.find('.'+ TRAN_LEFT_LIST).find('input[name="layTranLeftCheck"]')
      ,isAll = checkbox.attr('lay-filter') == 'layTranLeftCheckAll';

      if(checkbox[0].disabled) return;
      //如果是全选/全不选
      if(isAll){
        listLeft = '';
        //如果数据为零，不进行其他操作
        if(totalLeft == 0){
          checkbox[0].checked = false;
        }else{
          //同步子选项
          childs.each(function(i, item){
            if(!item.disabled){
              item.checked = checked;
              if(checked){
                listLeft += ($(childs[i]).data("index")) + ',';
                $(childs[i]).parent("li").addClass("selected");
              }else{
                $(childs[i]).parent("li").removeClass("selected");
              }
            };
          });
          //同步按钮状态
          if(checked){
            elem.find('.' + TRAN_BTN_RIGHT).removeClass(TRAN_BTN_DIS);
          }else{
            elem.find('.' + TRAN_BTN_RIGHT).addClass(TRAN_BTN_DIS);
          };
        }
      }else{
        var num = 1;
        //单个勾选
        if(checked){
          //判断是否全选
          childs.each(function(i, item){
            if(!item.disabled && !item.checked){
              num = 0;
            }
          });
          //如果全选，勾选全选按钮
          if(num == 1){
            checkTopLeft[0].checked = checked;
          };
          //加入列表
          listLeft += checkbox.data("index") + ',';
          checkbox.parent("li").addClass("selected");
          elem.find('.' + TRAN_BTN_RIGHT).removeClass(TRAN_BTN_DIS);
        }else{
          //如果全选状态，更改全选按钮
          if(checkTopLeft[0].checked){
            checkTopLeft[0].checked = false;
          };
          //移除
          checkbox.parent("li").removeClass("selected");
          listLeft = listLeft.replace(checkbox.data('index'),'');
          childs.each(function(i, item){
            if(item.checked){
              num = 0;
            }
          });
          //如果勾选项，更改按钮状态
          if(num == 1){
            elem.find('.' + TRAN_BTN_RIGHT).addClass(TRAN_BTN_DIS);
          };
        }
      };
      form.render('checkbox', 'LAY-Transfer-' + that.index);
    }); 

    //右选项
    elem.on('click', 'input[name="layTranRightCheck"]+', function(){ 
      var checkbox = $(this).prev()
      ,checked = checkbox[0].checked
      ,childs = elem.find('.'+ TRAN_RIGHT_LIST).find('input[name="layTranRightCheck"]')
      ,isAll = checkbox.attr('lay-filter') === 'layTranRightCheckAll';

      if(checkbox[0].disabled) return;
      //如果是全选/全不选
      if(isAll){
        listRight = '';
        //如果数据为零，不进行其他操作
        if(totalRight == 0){
          checkbox[0].checked = false;
        }else{
          childs.each(function(i, item){
            if(!item.disabled){
              item.checked = checked;
              if(checked){
                listRight += ($(childs[i]).data("index")) + ',';
                $(childs[i]).parent("li").addClass("selected");
              }else{
                $(childs[i]).parent("li").removeClass("selected");
              }
            }
          });
          if(checked){
            elem.find('.' + TRAN_BTN_LEFT).removeClass(TRAN_BTN_DIS);
          }else{
            elem.find('.' + TRAN_BTN_LEFT).addClass(TRAN_BTN_DIS);
          }
        };
        form.render('checkbox', 'LAY-Transfer-' + that.index);
      }else{
        var num = 1;
        //单个勾选
        if(checked){
          //判断是否全选
          childs.each(function(i, item){
            if(!item.disabled && !item.checked){
              num = 0;
            }
          });
          //如果全选，勾选全选按钮
          if(num == 1){
            checkTopRight[0].checked = checked;
          };
          //加入列表
          listRight += checkbox.data("index") + ',';
          checkbox.parent("li").addClass("selected");
          elem.find('.' + TRAN_BTN_LEFT).removeClass(TRAN_BTN_DIS);
        }else{
          //如果全选状态，更改全选按钮
          if(checkTopRight[0].checked){
            checkTopRight[0].checked = false;
          };
          //移除
          checkbox.parent("li").removeClass("selected");
          listRight = listRight.replace(checkbox.data('index'),'');
          childs.each(function(i, item){
            if(item.checked){
              num = 0;
            }
          });
          //如果勾选项，更改按钮状态
          if(num == 1){
            elem.find('.' + TRAN_BTN_LEFT).addClass(TRAN_BTN_DIS);
          };
        }
      };
      form.render('checkbox', 'LAY-Transfer-' + that.index);
    });

    //查找
    function searchVal(tran){
      var input = elem.find(tran).find('.layui-transfer-search')
      ,val = input.children('input').val()
      ,warp = input.next();

      warp.children("li").each(function(){
        if($(this).data("title").indexOf(val) == -1){
          $(this).hide();
        }else{
          $(this).show();
        }
      });
    };

    //添加到右边
    elem.on('click', '.'+TRAN_BTN_RIGHT, function(){
      var preList = '';
      //未选中则不操作
      if($(this).hasClass(TRAN_BTN_DIS)){
        return ;
      };
      //选项移除
      elem.find("."+ TRAN_LEFT_LIST).find("li").each(function(){
        if($(this).hasClass("selected")){
          $(this).remove();
        }
      });
      //选项插入
      var arr = elem.find('.' + TRAN_RIGHT).data('arr')
      ,add = 0;
      layui.each(listLeft.split(','), function(index, num){
        if(!num) return;
        var data = options.data[num];
        preList += '<li data-title="'+ data.title +'"><input lay-skin="primary" type="checkbox" data-index="'+ num +'" name="layTranRightCheck" title="'+ data.title +'" value="'+ data.value +'" class="layui-input" '+ (data.disabled ? 'disabled' : '') +'></li>'
        arr += ',' + num;
        add++;
      });
      elem.find("."+ TRAN_RIGHT_LIST).append(preList);
      searchVal('.'+TRAN_RIGHT);
      //更新状态
      checkTopLeft[0].checked = false;
      checkTopRight[0].checked = false;
      $(this).addClass(TRAN_BTN_DIS);
      listLeft = '';
      //更改缓存数据
      totalRight = totalRight + add;
      totalLeft = totalLeft - add;
      elem.find('.' + TRAN_RIGHT).data('total', totalRight);
      elem.find('.' + TRAN_RIGHT).data('total', totalLeft);
      elem.find('.' + TRAN_RIGHT).data('arr', arr);
      form.render('checkbox', 'LAY-Transfer-' + that.index);
      options.onchange && options.onchange(that.getValue());
    });

    //添加到左边
    elem.on('click', '.'+TRAN_BTN_LEFT, function(){
      var preList = '';
      if($(this).hasClass(TRAN_BTN_DIS)){
        return ;
      };
      //选项移除
      elem.find("."+ TRAN_RIGHT_LIST).find("li").each(function(){
        if($(this).hasClass("selected")){
          $(this).remove();
        }
      });
      //选项插入
      var arr = elem.find('.' + TRAN_RIGHT).data('arr')
      ,add = 0;
      layui.each(listRight.split(','), function(index, num){
        if(!num) return;
        var data = options.data[num];
        preList += '<li data-title="'+ data.title +'"><input lay-skin="primary" type="checkbox" data-index="'+ num +'" name="layTranLeftCheck" title="'+ data.title +'" value="'+ data.value +'" class="layui-input" '+ (data.disabled ? 'disabled' : '') +'></li>'
        arr = arr.replace(num, '').replace(/(,)+/g,',');
        add++;
      });
      elem.find("."+ TRAN_LEFT_LIST).append(preList);
      searchVal('.'+TRAN_LEFT);
      //更新状态
      checkTopLeft[0].checked = false;
      checkTopRight[0].checked = false;
      $(this).addClass(TRAN_BTN_DIS);
      listRight = '';
      //更改缓存数据
      totalRight = totalRight - add;
      totalLeft = totalLeft + add;
      elem.find('.' + TRAN_RIGHT).data('total', totalRight);
      elem.find('.' + TRAN_RIGHT).data('total', totalLeft);
      elem.find('.' + TRAN_RIGHT).data('arr', arr);
      form.render('checkbox', 'LAY-Transfer-' + that.index);
      options.onchange && options.onchange(that.getValue());
    });

    //搜索
    elem.find('.layui-transfer-search').on('keyup', 'input', function(){
      var outer = $(this).parent("div").parent("div");
      searchVal(outer);
    });   
  };

  //得到选中值
  Class.prototype.getValue = function(){
    var that = this
    ,options = that.config
    ,arr = that.elemTemp.find('.' + TRAN_RIGHT).data('arr')
    ,data = [];

    function sortNum(a,b){ return a - b };
    layui.each(arr.split(',').sort(sortNum), function(index, num){
      if(!num) return;
      data.push(options.data[num]);
    });
    return data;
  };

  //核心入口
  transfer.render = function(options){
    var inst = new Class(options);
    return thisTran.call(inst);
  };

  exports(MOD_NAME, transfer);
})
