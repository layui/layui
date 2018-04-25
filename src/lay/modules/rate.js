

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

  //字符常量
  ,MOD_NAME= 'rate', ICON_RATE = 'layui-icon layui-icon-rate', ICON_RATE_SOLID = 'layui-icon layui-icon-rate-solid', ICON_RATE_HALF = 'layui-icon layui-icon-rate-half'


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
    value: 5, //星星选中个数
  };

  //评分渲染
  Class.prototype.render = function(){
    var that = this
    ,options = that.config;

    var temp='<ul class="layui-rate">';
    for(var i=1;i<=options.length;i++){
      temp+='<li class="layui-inline"><i class="layui-icon '+(i>options.value?'layui-icon-rate':'layui-icon-rate-solid')+'"></i></li>';   
    }
    temp+='</ul><span></span>';

    $(options.elem).after(temp);

    if(!options.reader) that.draw();    

  };

  //li点击事件
  Class.prototype.draw=function(){
    var that = this
    ,options = that.config
    ,_ul=$(options.elem).next("ul");
    _ul.children("li").each(function(index){
      var ind=index+1;

      //点击
      $(this).click(function(){
        options.value=ind;
        
        if(options.text)  _ul.next("span").text(options.value+"分");
      })

      //移入
      $(this).mouseover(function(){
        _ul.find("i").each(function(){
            $(this)[0].className=ICON_RATE;
          })
        if(options.half){
          $(this).prevAll("li").children("i").each(function(){
            $(this)[0].className=ICON_RATE_SOLID;
          })
          if(){
            
          }
        }else{
          _ul.find("i:lt("+ind+")").each(function(){
            $(this)[0].className=ICON_RATE_SOLID;
          })
        }
         
      })

      //移出
      $(this).mouseout(function(){
        _ul.find("i").each(function(){
          $(this)[0].className=ICON_RATE;
        })
        _ul.find("i:lt("+options.value+")").each(function(){
          $(this)[0].className=ICON_RATE_SOLID;
        })
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
    return inst;
  };
	
	exports(MOD_NAME, rate);
})