/**
  扩展模块，只依赖内置模块
**/

layui.define(function(exports){
  console.log('mod2.js')

  exports('mod2', {
    name: 'mod2'
  })
});