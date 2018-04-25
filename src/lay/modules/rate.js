

layui.define('jquery',function(exports){
	"use strict";
	var $ = layui.jquery

	//外部接口
	,rate = {
		config: {}
		,index: layui.rate ? (layui.rate.index + 10000) : 0

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
  ,thisRate = function(){
    var that = this
    ,options = that.config;
    
    return {
      setvalue: function(value){
        that.setvalue.call(that, value);
      }
      ,config: options
    }
  }

  //字符常量
  ,MOD_NAME = 'rate', ICON_RATE = 'layui-icon layui-icon-rate', ICON_RATE_SOLID = 'layui-icon layui-icon-rate-solid', ICON_RATE_HALF = 'layui-icon layui-icon-rate-half'


	//构造器
  ,Class = function(options){
    var that = this;
    that.index = ++rate.index;
    that.config = $.extend({}, that.config, rate.config, options);
    that.render();
  };

  //默认配置
  Class.prototype.config = {
    length: 5, //初始长度
    text: false, //是否显示评分等级
    reader: false, //是否只读
    half: false, //是否可以半星
    value: 3 //星星选中个数
  };

  //评分渲染
  Class.prototype.render = function(){
    var that = this
    ,options = that.config;
    
    //如果没有选择半星的属性，却给了小数的数值，同意向上或向下取整
    if(parseInt(options.value) !== options.value){
      if(!options.half){
        options.value = (Math.ceil(options.value) - options.value) < 0.5 ? Math.ceil(options.value): Math.floor(options.value)
      }
    }

    //模板
    var temp = '<ul class="layui-rate">';
    for(var i = 1;i <= options.length;i++){
      var item = '<li class="layui-inline"><i class="layui-icon '+(i>Math.floor(options.value)?'layui-icon-rate':'layui-icon-rate-solid')+'"></i></li>';
      if(options.half){
        if(parseInt(options.value) !== options.value){
          if(i == Math.ceil(options.value)){
            temp = temp + '<li class="layui-inline"><i class="layui-icon layui-icon-rate-half"></i></li>';
          }else{
            temp = temp + item 
          } 
        }else{
          temp = temp + item
        }
      }else{
        temp = temp + '<li class="layui-inline"><i class="layui-icon '+(i>options.value?'layui-icon-rate':'layui-icon-rate-solid')+'"></i></li>';
      }
    }
    temp += '</ul><span>' + (options.text ? options.value + "分" : "") + '</span>';

    $(options.elem).after(temp);

    //如果不是只读，那么进行触控事件
    if(!options.reader) that.action(); 

  };


  //重置value
  Class.prototype.setvalue = function(value){
    var that = this
    ,options = that.config ;

    options.value = value

  }


  //li触控事件
  Class.prototype.action = function(){
    var that = this
    ,options = that.config
    ,_ul = $(options.elem).next("ul");

    _ul.children("li").each(function(index){
      var ind = index + 1
      ,othis = $(this);

      //点击
      othis.on('click', function(e){
        //将当前点击li的索引值赋给value
        options.value = ind;

        if(options.half){
          //获取鼠标在li上的位置
          var x = e.pageX - $(this).offset().left;
          if(x <= 13){
            options.value = options.value - 0.5;
          }
        }
        if(options.text)  _ul.next("span").text(options.value + "分")
      })

      //移入
      othis.on('mousemove', function(e){
        _ul.find("i").each(function(){
          this.className = ICON_RATE;
        });
        _ul.find("i:lt(" + ind + ")").each(function(){
          this.className = ICON_RATE_SOLID ;
        });

        // 如果设置可选半星，那么判断鼠标相对li的位置
        if(options.half){
          var x = e.pageX - $(this).offset().left;
          if(x <= 13){
            $(this).children("i")[0].className = ICON_RATE_HALF ;
          }
        }         
      })

      //移出
      othis.on('mouseout', function(){
        _ul.find("i").each(function(){
          this.className = ICON_RATE;
        });
        _ul.find("i:lt(" + Math.floor(options.value) + ")").each(function(){
          this.className = ICON_RATE_SOLID;
        });

        if(options.half){
          if(parseInt(options.value) !== options.value){
            _ul.children("li:eq(" + Math.floor(options.value) + ")").children("i")[0].className = ICON_RATE_HALF ;             
          }
        } 
      })

    })
  };
  

  //事件处理
  Class.prototype.events = function(){
     var that = this
    ,options = that.config;

  };

  //核心入口
  rate.render = function(options){
    var inst = new Class(options);
    return thisRate.call(inst);
  };
	
	exports(MOD_NAME, rate);
})