<p align=center>
  <a href="http://www.layui.com">
    <img src="https://sentsin.gitee.io/res/images/layui/layui.png" alt="layui" width="360">
  </a>
</p>
<p align=center>
  Classic modular front-end UI framework
</p>

<p align="center">
  <a href="https://travis-ci.org/sentsin/layui"><img alt="Build Status" src="https://img.shields.io/travis/sentsin/layui/master.svg"></a>
  <a href="https://saucelabs.com/beta/builds/7e6196205e4f492496203388fc003b65"><img src="https://saucelabs.com/buildstatus/layui" alt="Build Status"></a>
  <a href="https://coveralls.io/r/sentsin/layui?branch=master"><img alt="Test Coverage" src="https://img.shields.io/coveralls/sentsin/layui/master.svg"></a>
</p>
<p align="center">
  <a href="https://saucelabs.com/beta/builds/7e6196205e4f492496203388fc003b65"><img src="https://saucelabs.com/browser-matrix/layui.svg" alt="Browser Matrix"></a>
</p>

---

Layui is a front-end UI framework written in its own module specification, following the writing and organization of native HTML/CSS/JS, with a very low threshold and ready to use. It's minimalist, yet full of inner strength, light weight, and abundance of components. Every detail from the core code to the API has been carefully crafted, making it ideal for rapid interface development. The first version of layui was released in 2016. It is different from the UI framework based on the underlying MVVM, but it is not the opposite, but the way to return to the truth. To be precise, she is more tailor-made for server programmers. You don't need to get involved in the complicated configuration of various front-end tools. Just face the browser itself and let everything you need and interact with it.

## Back to Basics

Defined as “classic modularity”, layui is not a self-promotion of her own excellence, but is intended to avoid the mainstream solution of the current JS community, trying to explain the efficiency in the simplest way! <em> Her so-called classic is based on the obedience to returning to the original</em>, she organizes the module in the way that the current browser is generally recognized! We believe that this is in line with the best guidelines for the vast majority of domestic programmers to transition from the old era to the new standards of the future. So layui itself is not completely in the AMD era. To be precise, she tries to build her own model, so you will see:

```js
//Definition of layui module
layui.define([mods], function(exports){
  
  //……
  
  exports('mod', api);
});  
 
//Use of layui module

layui.use(['mod1', 'mod2'], function(args){
  var mod = layui.mod1;
  
  //……
  
});    
```
That's right, she has the shadow of AMD, and is not limited by the common frame of commonjs. Laui believes that this lightweight organization is more suitable for most scenarios than WebPack. Therefore, she insists on adopting the classic modularity, which is to enable people to avoid the complicated configuration of the tools, return to the simple, quiet and efficient way to get the original HTML, CSS, JavaScript.

But layui is not a module loader like Requirejs, but a UI solution. The biggest difference between her and Bootstrap is that she fits her understanding of classic modularity.


## Quick start

Once you've got layui and deployed it completely to your project directory (or static resource server), you only need to import the following two files:
```
./layui/css/layui.css
./layui/layui.js //Tip: If you are using a non-modular approach (the bottom is explained), you can change it here: ./layui/layui.all.js```

You don't have to worry about any other files. Because they (such as modules) are automatically loaded when they are finally used. This is a basic getting started page:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
  <title>Start using layui</title>
  <link rel="stylesheet" href="../layui/css/layui.css">
</head>
<body>
 
<!-- Your HTML code -->
 
<script src="../layui/layui.js"></script>
<script>
/ / Generally written directly in a js file
layui.use(['layer', 'form'], function(){
  var layer = layui.layer
  ,form = layui.form;
  
  layer.msg('Hello World');
});
</script> 
</body>
</html>
```

If you want to use a non-modular approach (that is, all modules are loaded at once, although we don't recommend it), you can use them as follows:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
  <title>Use in a non-modular way layui</title>
  <link rel="stylesheet" href="../layui/css/layui.css">
</head>
<body>
 
<!--- Your HTML code -->
 
<script src="../layui/layui.all.js"></script>
<script>
//Since the modules are loaded at one time, you don't need to execute layui.use() to load the corresponding module, you can use it directly:
;!function(){
  var layer = layui.layer
  ,form = layui.form;
  
  layer.msg('Hello World');
}();
</script> 
</body>
</html>  
```
## [Reading the Document] (http://www.layui.com/)
From now on, embrace layui! I hope she can become your long-term development partner, turning into hundreds of millions of bytes in front of your screen!

## Related
[Official website] (http://www.layui.com/), [update log] (http://www.layui.com/doc/base/changelog.html), [community exchange] (http://fly .layui.com)
