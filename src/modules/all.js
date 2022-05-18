/*!
 * 用于加载所有内置模块
 * MIT Licensed  
 */
 
layui.define(function(){
  var mods = [] 
  ,builtin = layui.cache.builtin;
  layui.each(builtin, function(modName){
    (modName === 'all' || modName === 'layui.all') || mods.push(modName);
  });
  layui.cache.startTime = new Date().getTime();

  return mods;
}(), function(exports){
  "use strict";
  
  var MOD_NAME = 'all'
  
  //外部接口
  ,all = {
    config: {}
    ,time: function(){
      var time = new Date().getTime() - layui.cache.startTime;
      delete layui.cache.startTime;
      return time;
    }()
  };

  exports(MOD_NAME, all);
});
