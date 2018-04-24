

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
  ,ICON_RATE = 'layui-icon-rate', ICON_RATA_SOLID = 'layui-icon-rate-solid'

	//构造器
  ,Class = function(options){
    var that = this;
    that.index = ++rate.index;
    that.config = $.extend({}, that.config, rate.config, options);
    that.render();
  };

  //默认配置
  Class.prototype.config = {
    limit: 10 //每页显示的数量
    ,loading: true //请求数据时，是否显示loading
    ,cellMinWidth: 60 //所有单元格默认最小宽度
    ,text: {
      none: '无数据'
    }
  };

  //评分渲染
  Class.prototype.render = function(){
    var that = this
    ,options = that.config;

    /*
    
      div class="layui-rate layui-col-xm4 layui-col-xm-offset4 ">
        <h3>只读</h3>
        <hr>
        <ul class="layui-rate-read">
          <li class="layui-inline"><i class="layui-icon layui-icon-rate-solid"></i></li>
          <li class="layui-inline"><i class="layui-icon layui-icon-rate-solid"></i></li>
          <li class="layui-inline"><i class="layui-icon layui-icon-rate"></i></li>
          <li class="layui-inline"><i class="layui-icon layui-icon-rate"></i></li>
          <li class="layui-inline"><i class="layui-icon layui-icon-rate"></i></li>
        </ul>
      </div>

     */

    var obj = {
      primary:function(e,x){
        $(e+' > '+x).each(function(index){
          var ind=index;
          $(this).mouseover(function(){
            
          }),
          $(this).mouseout(function(){
            
          }),
          $(this).click(function(){
            $(this).children("i").addClass(ICON_RATA_SOLID).removeClass(ICON_RATE)
            $(this).prevAll().each(function(){
              $(this).children("i").addClass(ICON_RATA_SOLID).removeClass(ICON_RATE)
            })
            $(this).nextAll().each(function(){
              $(this).children("i").addClass(ICON_RATE).removeClass(ICON_RATA_SOLID)
            })
          })
        })
      },
      half:function(e,x){

      },
      text:function(e,x){
        $(e+' > '+x).each(function(index){
          var ind=index;
          $(this).click(function(){
            $(this).children("i").addClass(ICON_RATA_SOLID).removeClass(ICON_RATE)
            $(this).prevAll().each(function(){
              $(this).children("i").addClass(ICON_RATA_SOLID).removeClass(ICON_RATE)
            })
            $(this).nextAll().each(function(){
              $(this).children("i").addClass(ICON_RATE).removeClass(ICON_RATA_SOLID)
            })
            $(e).next("span").text(ind+1);
          })
        })
      }
    };


  };


  //事件处理
  Class.prototype.events = function(){


  }


	//核心接口
	rate.render = function(options){
    var inst = new Class(options);
    return thisTable.call(inst);
	};

  //核心入口
  rate.render = function(options){
    var inst = new Class(options);
    return thisTable.call(inst);
  };
	
	exports('rate', rate);
})