/**

 @Name：layui 移动模块入口 | 构建后则为移动模块集合
 @Author：贤心
 @License：MIT
    
 */

 
if(!layui['layui.mobile']){
  layui.config({
    base: layui.cache.dir + 'lay/modules/mobile/'
  }).extend({
    'layer-mobile': 'layer-mobile'
    ,'zepto': 'zepto'
    ,'upload-mobile': 'upload-mobile'
    ,'layim-mobile': 'layim-mobile'
  });
}  

layui.define([
  'layer-mobile'
  ,'zepto'
  ,'layim-mobile'
], function(exports){
  exports('mobile', {
    layer: layui['layer-mobile'] //弹层
    ,layim: layui['layim-mobile'] //WebIM
  });
});