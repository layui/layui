
/*!
 * MODULE_DEMO_NAME 模块组件通用结构
 * MIT Licensed
 */

layui.define([''], function(exports){
  "use strict";
  
  var $ = layui.$
  
  //模块名
  ,MOD_NAME = 'MODULE_DEMO_NAME'
  ,MOD_INDEX = 'layui_'+ MOD_NAME +'_index' //模块索引名

  //外部接口
  ,MODULE_DEMO_NAME = {
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
    
    return {
      config: options
      //重置实例
      ,reload: function(options){
        that.reload.call(that, options);
      }
    }
  }

  //字符常量
  ,STR_ELEM = 'layui-MODULE_DEMO_NAME', STR_HIDE = 'layui-hide', STR_DISABLED = 'layui-disabled', STR_NONE = 'layui-none'
  
  //主模板
  ,TPL_MAIN = [''].join('')

  //构造器
  ,Class = function(options){
    var that = this;
    that.index = ++MODULE_DEMO_NAME.index;
    that.config = $.extend({}, that.config, MODULE_DEMO_NAME.config, options);
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
    var thisElem = that.elem = $(laytpl(TPL_MAIN).render({
      data: options
      ,index: that.index //索引
    }));
    
    var othis = options.elem = $(options.elem);
    if(!othis[0]) return;
    
    
    
    that.events(); //事件
  };
  
  //事件
  Class.prototype.events = function(){
    var that = this
    ,options = that.config;
    
    
  };
  
  //记录所有实例
  thisModule.that = {}; //记录所有实例对象
  
  //获取当前实例对象
  thisModule.getThis = function(id){
    var that = thisModule.that[id];
    if(!that) hint.error(id ? (MOD_NAME +' instance with ID \''+ id +'\' not found') : 'ID argument required');
    return that
  };
  
  //重载实例
  MODULE_DEMO_NAME.reload = function(id, options){
    var that = thisModule.that[id];
    that.reload(options);
    
    return thisModule.call(that);
  };

  //核心入口
  MODULE_DEMO_NAME.render = function(options){
    var inst = new Class(options);
    return thisModule.call(inst);
  };

  exports(MOD_NAME, MODULE_DEMO_NAME);
});
