/**
 * rate 评分评星组件
 */

layui.define(['jquery', 'lay'],function(exports){
  "use strict";

  var $ = layui.jquery;
  var lay = layui.lay;

  // 外部接口
  var rate = {
    config: {},
    index: layui.rate ? (layui.rate.index + 10000) : 0,

    //设置全局项
    set: function(options){
      var that = this;
      that.config = $.extend({}, that.config, options);
      return that;
    },

    //事件
    on: function(events, callback){
      return layui.onevent.call(this, MOD_NAME, events, callback);
    }
  }

  // 操作当前实例
  var thisRate = function () {
    var that = this;
    var options = that.config;

    return {
      setvalue: function (value) {
        that.setvalue.call(that, value);
      },
      config: options
    }
  };

  //字符常量
  var MOD_NAME = 'rate';
  var ELEM_VIEW = 'layui-rate';
  var ICON_RATE = 'layui-icon-rate';
  var ICON_RATE_SOLID = 'layui-icon-rate-solid';
  var ICON_RATE_HALF = 'layui-icon-rate-half';
  var ICON_SOLID_HALF = 'layui-icon-rate-solid layui-icon-rate-half';
  var ICON_SOLID_RATE = 'layui-icon-rate-solid layui-icon-rate';
  var ICON_HALF_RATE = 'layui-icon-rate layui-icon-rate-half';

  //构造器
  var Class = function (options) {
    var that = this;
    that.index = ++rate.index;
    that.config = $.extend({}, that.config, rate.config, options);
    that.render();
  };

  //默认配置
  Class.prototype.config = {
    length: 5,  //初始长度
    text: false,  //是否显示评分等级
    readonly: false,  //是否只读
    half: false,  //是否可以半星
    value: 0, //星星选中个数
    theme: '' //主题颜色
  };

  //评分渲染
  Class.prototype.render = function(){
    var that = this;
    var options = that.config;

    // 若 elem 非唯一，则拆分为多个实例
    var elem = $(options.elem);
    if(elem.length > 1){
      layui.each(elem, function(){
        rate.render($.extend({}, options, {
          elem: this
        }));
      });
      return that;
    }

    // 合并 lay-options 属性上的配置信息
    $.extend(options, lay.options(elem[0]));

    // 自定义主题
    var style = options.theme ? ('style="color: '+ options.theme + ';"') : '';

    options.elem = $(options.elem);

    //最大值不能大于总长度
    if(options.value > options.length){
      options.value = options.length;
    }

    //如果没有选择半星的属性，却给了小数的数值，统一向上或向下取整
    if(parseInt(options.value) !== options.value){
      if(!options.half){
        options.value = (Math.ceil(options.value) - options.value) < 0.5 ? Math.ceil(options.value): Math.floor(options.value)
      }
    }

    //组件模板
    var temp = '<ul class="layui-rate" '+ (options.readonly ? 'readonly' : '') +'>';
    for(var i = 1;i <= options.length;i++){
      var item = '<li class="layui-inline"><i class="layui-icon '
        + (i>Math.floor(options.value)?ICON_RATE:ICON_RATE_SOLID)
      + '" '+ style +'></i></li>';

      if(options.half&&parseInt(options.value) !== options.value&&i == Math.ceil(options.value)){
        temp = temp + '<li><i class="layui-icon layui-icon-rate-half" '+ style +'></i></li>';
      }else{
        temp = temp +item;
      }
    }
    temp += '</ul>' + (options.text ? ('<span class="layui-inline">'+ options.value + '星') : '') + '</span>';

    //开始插入替代元素
    var othis = options.elem;
    var hasRender = othis.next('.' + ELEM_VIEW);

    //生成替代元素
    hasRender[0] && hasRender.remove(); //如果已经渲染，则Rerender

    that.elemTemp = $(temp);

    options.span = that.elemTemp.next('span');

    options.setText && options.setText(options.value);

    othis.html(that.elemTemp);

    othis.addClass("layui-inline");

    //如果不是只读，那么进行触控事件
    if(!options.readonly) that.action();

  };

  //评分重置
  Class.prototype.setvalue = function(value){
    var that = this;
    var options = that.config;

    options.value = value ;
    that.render();
  };

  //li触控事件
  Class.prototype.action = function(){
    var that = this;
    var options = that.config;
    var _ul = that.elemTemp;
    var wide = _ul.find("i").width();
    var liElems =  _ul.children("li");

    liElems.each(function(index){
      var ind = index + 1;
      var othis = $(this);

      //点击
      othis.on('click', function(e){
        //将当前点击li的索引值赋给value
        options.value = ind;
        if(options.half){
          //获取鼠标在li上的位置
          var x = e.pageX - $(this).offset().left;
          if(x <= wide / 2){
            options.value = options.value - 0.5;
          }
        }

        if(options.text)  _ul.next("span").text(options.value + "星");

        options.choose && options.choose(options.value);
        options.setText && options.setText(options.value);
      });

      //移入
      othis.on('mousemove', function(e){
        _ul.find("i").each(function(){
          $(this).addClass(ICON_RATE).removeClass(ICON_SOLID_HALF)
        });
        _ul.find("i:lt(" + ind + ")").each(function(){
          $(this).addClass(ICON_RATE_SOLID).removeClass(ICON_HALF_RATE)
        });
        // 如果设置可选半星，那么判断鼠标相对li的位置
        if(options.half){
          var x = e.pageX - $(this).offset().left;
          if(x <= wide / 2){
            othis.children("i").addClass(ICON_RATE_HALF).removeClass(ICON_RATE_SOLID)
          }
        }
      })

      //移出
      othis.on('mouseleave', function(){
        _ul.find("i").each(function(){
          $(this).addClass(ICON_RATE).removeClass(ICON_SOLID_HALF)
        });
        _ul.find("i:lt(" + Math.floor(options.value) + ")").each(function(){
          $(this).addClass(ICON_RATE_SOLID).removeClass(ICON_HALF_RATE)
        });
        //如果设置可选半星，根据分数判断是否有半星
        if(options.half){
          if(parseInt(options.value) !== options.value){
            _ul.children("li:eq(" + Math.floor(options.value) + ")").children("i").addClass(ICON_RATE_HALF).removeClass(ICON_SOLID_RATE)
          }
        }
      })

    })

    lay.touchSwipe(_ul, {
      onTouchMove: function(e, state){
        if(Date.now() - state.timeStart <= 200) return;
        var pageX = e.touches[0].pageX;
        var rateElemWidth = _ul.width();
        var itemElemWidth = rateElemWidth / options.length; // 单颗星的宽度
        var offsetX = pageX - _ul.offset().left;
        var num = offsetX / itemElemWidth; // 原始值
        var remainder = num % 1;
        var integer = num - remainder;

        // 最终值
        var score = remainder <= 0.5 && options.half ? integer + 0.5 : Math.ceil(num);
        if(score > options.length) score = options.length;
        if(score < 0) score = 0;

        liElems.each(function(index){
          var iconElem = $(this).children('i');
          var isActiveIcon = (Math.ceil(score) - index === 1);
          var needSelect = Math.ceil(score) > index;
          var shouldHalfIcon = (score - index === 0.5);

          if(needSelect){
            // 设置选中样式
            iconElem.addClass(ICON_RATE_SOLID).removeClass(ICON_HALF_RATE);
            if(options.half && shouldHalfIcon){
              iconElem.addClass(ICON_RATE_HALF).removeClass(ICON_RATE_SOLID);
            }
          }else{
            // 恢复初始样式
            iconElem.addClass(ICON_RATE).removeClass(ICON_SOLID_HALF);
          }

          // 设置缩放样式
          iconElem.toggleClass('layui-rate-hover', isActiveIcon);
        });

        // 更新最终值
        options.value = score;
        if(options.text)  _ul.next("span").text(options.value + "星");
        options.setText && options.setText(options.value);
      },
      onTouchEnd: function(e, state){
        if(Date.now() - state.timeStart <= 200) return;
        _ul.find('i').removeClass('layui-rate-hover');
        options.choose && options.choose(options.value);
        options.setText && options.setText(options.value);
      }
    });
  };

  //事件处理
  Class.prototype.events = function () {
    var that = this;
    //var options = that.config;
  };

  //核心入口
  rate.render = function(options){
    var inst = new Class(options);
    return thisRate.call(inst);
  };

  exports(MOD_NAME, rate);
})
