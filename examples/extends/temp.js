/**
 
 @Name：layui.modDemo XX组件
 @Author：贤心
 @License：MIT

 */

layui.define(['laytpl'], function(exports){
  "use strict";
  
  var $ = layui.$
  ,laytpl = layui.laytpl
  
  //模块名
  ,MOD_NAME = 'modDemo'

  //外部接口
  ,modeDemo = {
    config: {}
    ,index: layui[MOD_NAME] ? (layui[MOD_NAME].index + 10000) : 0

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
    }
  }
  
  //获取当前实例配置项
  ,getThisModuleConfig = function(id){
    var config = thisModule.config[id];
    if(!config) hint.error('The ID option was not found in the '+ MOD_NAME +' instance');
    return config || null;
  }

  //字符常量  
  ,ELEM = 'layui-modeDemo'
  
  
  //主模板
  ,TPL_MAIN = ['<div class="ayui-border-box">'

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
    
  };
  
  //重载实例
  Class.prototype.reload = function(options){
    var that = this;
    
    layui.each(options, function(key, item){
      if(item.constructor === Array) delete that.config[key];
    });
    
    that.config = $.extend(true, {}, that.config, options);
    that.render();
  };

  //渲染
  Class.prototype.render = function(){
    var that = this
    ,options = that.config;
    
    //解析模板
    that.elem = $(TPL_MAIN);
    
    var othis = options.elem = $(options.elem);
    if(!othis[0]) return;
    
    //索引
    that.key = options.id || that.index;
    
    //插入组件结构
    othis.html(that.elem);
    
    that.events(); //事件
  };
  
   //事件
  Class.prototype.events = function(){
    var that = this;
    
    
  };
  
  
  
  //记录所有实例
  thisModule.that = {}; //记录所有实例对象
  thisModule.config = {}; //记录所有实例配置项
  
  //重载实例
  modeDemo.reload = function(id, options){
    var that = thisModule.that[id];
    that.reload(options);
    
    return thisModule.call(that);
  };

  //核心入口
  modeDemo.render = function(options){
    var inst = new Class(options);
    return thisTransfer.call(inst);
  };

  exports(MOD_NAME, modeDemo);
});
