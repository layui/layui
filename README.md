<p align="center">
  <a href="http://www.layui.com">
    <img src="http://cdn.layui.com/upload/2016_10/168_1476644144774_50450.png" alt="layui" width="520">
  </a>
</p>
<p align="center">
  经典模块化前端UI框架
</p>

---

Layui 是一款带着浓烈情怀的前端UI框架，她追求极简，又不失丰盈的内在，说她是史上最轻量的结晶，似乎并不为过。一切都源自于她对原生态的执着，对前端社区的那些噪杂声音的过滤，以及她本身的精心雕琢。

## 经典，因返璞归真

近几年，尤其是今年，常常会听到猿们吐槽“现在想简简单单的写个前端怎么就变得这么难呢？”。的确，前端目前正处于一个超出常理，且疯狂造轮子的黄金时代，标准化的逐步设想与浏览器本身的现状所形成的滞后感，让一些尚未得到官方推广的方案开始引领着前端社区，那仿佛是一场“五代十国”般的颠覆，这期间，你看不到一个所谓的新鲜轮子可以维持超过三年的光环，因为它很快就会被另一个新轮子所替代。你必须保持对技术的高度狂热，透过未来的枷锁去追逐那些层出不穷的，工具！是的，他们只是工具，准确地说是一种标准化最终形成的过度！

透过那些高逼格工具的本质，最终仍然是 HTML、CSS、JavaScript 三驾马车的真实面貌。与工具不同的是，它们是最终标准的归属者。所以工具在发展，三驾马车本身同样也在高速发展，那既然如此，我们为何不能跟随原生态的稳健脚步，安安静静地撸会码呢？

Layui 定义为“经典模块化”，并非是自吹她自身有多优秀，而是绕开JS社区的喧嚣，以最简单的方式去诠释高效！她的所谓经典，是在于对返璞归真的执念，她以当前浏览器普通认可的方式去组织模块！我们认为，这恰是符合当下国内绝大多数程序员从旧时代过度到未来新标准的最佳指引。

所以 Layui 本身也并不是完全遵循于AMD时代，准确地说，她试图建立自己的模式，所以你会看到：

```
  //layui模块的定义
  layui.define([mods], function(exports){
    
    //……
    
    exports('mod', api);
  });  
   
  //layui模块的使用
  layui.use(['mod1', 'mod2'], function(args){
    var mod = layui.mod1;
    
    //……
    
  });    

```
没错，她具备AMD的影子，又并非受限于commonjs的那些条条框框，Layui认为这种轻量的组织方式，比WebPack更符合绝大多数场景。所以她坚持采用经典模块化，也正是能让人避开工具的复杂配置，回归简单，安静高效地撸一会原生态的HTML、CSS、JavaScript。

但是 Layui 又并非是Requirejs那样的模块加载器，而是一款UI解决方案，她与Bootstrap最大的不同恰恰在于她糅合了自身对经典模块化的理解。


## 快速上手

获得layui后，将其完整地部署到你的项目目录（或静态资源服务器），你只需要引入下述两个文件：

```
./layui/css/layui.css
./layui/layui.js
```

不用去管其它任何文件。因为他们（比如各模块）都是在最终使用的时候才会自动加载。这是一个基本的入门页面：

```
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
  <title>开始使用Layui</title>
  <link rel="stylesheet" href="../layui/css/layui.css">
</head>
<body>
 
<!-- 你的HTML代码 -->
 
<script src="../layui/layui.js"></script>
<script>
 
//一般直接写在一个js文件中
layui.use(['layer', 'form'], function(){
  var layer = layui.layer
  ,form = layui.form();
  
  layer.msg('Hello World');
});
</script> 
  
</body>
</html>
```

如果你想快速使用Layui的组件，你还是跟平时一样script标签引入你的js文件，然后在你的js文件中使用layui的组件。但我们更推荐你遵循Layui的模块规范，建立一个自己的模块作为入口：

```
<script>
layui.config({
  base: '/res/js/modules/' //你的模块目录
}).use('index'); //加载入口
</script>    
```

上述的 index 即为你 /res/js/modules/ 目录下的 index.js，它的内容应该如下：

```
/**
  项目JS主入口
  以依赖Layui的layer和form模块为例
**/    
layui.define(['layer', 'form'], function(exports){
  var layer = layui.layer
  ,form = layui.form();
  
  layer.msg('Hello World');
  
  exports('index', {});
});  
```

好了，不管你采用什么样的方式，从现在开始，尽情地使用Layui吧！但愿这是你的一段美妙的旅程。


## 相关
[官网](http://www.layui.com/)、[更新日志](https://github.com/sentsin/layui/blob/master/CHANGELOG.md)、[社区交流](http://fly.layui.com)