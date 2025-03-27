---
title: 模块系统
toc: true
---

<h1 id="idea" lay-toc="{title: '概要'}">模块系统</h1>

> Layui 制定了一套适合自身应用场景的轻量级模块规范，以便在不同规模的项目中，也能对前端代码进行很好的管理或维护。 Layui 的轻量级模块系统，并非有意违背 CommonJS 和 ES Module ，而是试图以更简单的方式去诠释高效，这种对*返璞归真*的执念源于在主流标准尚未完全普及的前 ES5 时代，后来也成为 Layui 独特的表达方式，而沿用至今。

如下是一个关于模块的简单示例：

```
// 定义模块（通常单独作为一个 JS 文件）
layui.define([mods], function(exports){
  // …

  exports('mod1', api); // 输出模块
});

// 使用模块
layui.use(['mod1'], function(args){
  var mod1 = layui.mod1;

  // …
});
```

我们可以将其视为「像使用普通 API 一样来管理模块」，在此前提下，组件的承载也变得轻松自如，我们完全可以游刃在以浏览器为宿主的原生态的 HTML/CSS/JavaScript 的开发模式中，而不必卷入层出不穷的主流框架的浪潮之中，给心灵一个栖息之所。

当然，Layui 自然也不是一个模块加载器，而是一套相对完整的 UI 解决方案，但与 Bootstrap 又并不相同，除了 HTML+CSS 本身的静态化处理，Layui 的组件更倾向于 JavaScript 的动态化渲染，并为之提供了相对丰富和统一的 API，使用时，只需稍加熟悉，便可在各种交互中应付自如。


<h2 id="define" lay-toc="">定义模块</h2>

`layui.define([mods], callback);`

- 参数 `mods` 可选，用于声明该模块所依赖的模块；
- 参数 `callback` 即为模块加载完毕的回调函数，它返回一个 `exports` 参数，用于输出该模块的接口。

```
/** demo.js **/
layui.define(function(exports){
  // do something

  // 输出 demo 模块
  exports('demo', {
    msg: 'Hello Demo'
  });
});

// 若该模块需要依赖别的模块，则在 `mods` 参数中声明即可：
// layui.define(['layer', 'form'], callback);
```

如上所示，`callback` 返回的 `exports` 参数是一个函数，它接受两个参数：参数一为*模块名*，参数二为*模块接口*。

另外， `callback` 将会在初次加载该模块时被自动执行。而有时，在某些特殊场景中可能需要再次执行该 `callback`，那么可以通过 `layui.factory(mod)` 方法获得。如：

```
var demoCallback = layui.factory('demo'); // 得到定义 demo 模块时的 `callback`
```

- **模块命名空间**

Layui 定义的模块将会被绑定在 `layui` 对象下，如：`var demo = layui.demo;` 每个模块都有一个特定命名，且无法被占用，所以你无需担心模块的命名空间被污染，除非通过 `layui.disuse([mods])` 方法弃用已定义的模块。

以下是定义一个「依赖 Layui 内置模块」的模块示例：

```
layui.define(['layer', 'laydate'], function(exports){
  var layer = layui.layer // 获得 layer 模块
  var laydate = layui.laydate; // 获得 laydate 模块

  // 输出模块
  exports('demo', {}); // 模块名 demo 未被占用，此时模块定义成功
  // exports('layer', {}); // 模块名 layer 已经存在，此时模块定义失败
});
```

同样的，在「扩展模块」时，也同样不能命名已经存在的模块名。


<h2 id="use" lay-toc="">使用模块</h2>

`layui.use([mods], callback);`

- 参数 `mods` 若填写，必须是已被成功定义的模块名；
  <br>注<sup>2.6+</sup>：若 mods 不填，即只传一个 callback 参数时，则表示引用所有内置模块。
- 参数 `callback` 即为使用模块成功后回调函数。
  <br>注<sup>2.6+</sup>：该回调会在 html 文档加载完毕后再执行，确保你的代码在任何地方都能对元素进行操作。

```
// 使用指定模块
layui.use(['layer', 'table'], function(){
  var layer = layui.layer;
  var table = layui.table;

  // do something
});

// 使用所有内置模块（layui v2.6 开始支持）
layui.use(function(){
  var layer = layui.layer;
  var table = layui.table;
  var laydate = layui.laydate;
  // …

  // do something
});
```

你还可以通过 `callback` 返回的参数得到模块对象，如：

```
layui.use(['layer', 'table'], function(layer, table){
  // 使用 layer
  layer.msg('test');

  // 使用 table
  table.render({});
});
```

- **执行「定义模块」时的回调函数**

在上文的定义模块中，我们提到一个特殊场景，即重新获取定义模块时的 `callback` 函数, 譬如在*单页面应用*开发中，我们在视图碎片中使用某个模块，由于定义模块时的 `callback` 只会在模块初次加载中被调用，而当视图碎片在每次被渲染时，又往往需要该 `callback` 被再次执行，那么则可以通过以下方式实现：

```
// 在单页面视图碎片渲染时，再次调用「定义模块」时的 `callback`
layui.use('demo', layui.factory('demo'));
```

<h2 id="extend" lay-toc="{hot: true}">扩展模块</h2>

`layui.extend(settings);`

- 参数 `settings` : 扩展模块的相关配置，如模块名、模块路径等。

除了 Layui 的内置模块，在实际项目开发时，必不可少也需要扩展模块。我们在前文的「模块命名空间」提到，模块名具有唯一性，即不可被占用，因此我们扩展的模块必须是一个未被定义过的模块名。

现在，让我们尝试扩展一个 Layui 第三方模块。

### 扩展遵循 Layui 规范的模块

1. **创建模块和定义模块**

假设创建一个模块名为 `testModule` 的模块，新建 `testModule.js` 文件并放入项目的任意目录中（但应避免放入到 Layui 原始目录）。接着我们开始定义 `testModule` 模块，并编写该模块主体代码。

```js
/**
 * 定义 testModule 模块
 **/
layui.define(function(exports){ // 也可以依赖其他模块
  var obj = {
    hello: function(str){
      alert('Hello '+ (str || 'TestModule'));
    }
  };

  // 输出 testModule 接口
  exports('testModule', obj);
});
```

2. **声明模块和使用模块**

现在，我们只需声明模块名及模块文件路径，即完成模块扩展。

```js
// 假设 testModule 模块文件所在路径在：/js/layui_exts/testModule.js
layui.config({
  base: '/js/layui_exts/' // 设置用于扩展模块的基础路径
}).extend({
  testModule: 'testModule', // 定义模块名和模块路径，会前置追加 base 基础路径
  // test1: 'test1' // 还可同时声明其他更多模块
});

// 也可以不前置追加 base 基础路径，即设置单独路径
layui.extend({
  testModule: '{/}/js/layui_exts/testModule' // 开头特定符 {/} 即代表采用单独路径
});

// 然后我们就可以像使用内置模块一样使用扩展模块
layui.use(['testModule', 'test1'], function(){
  var testModule = layui.testModule;
  // var test1 = layui.test1;

  testModule.hello('World');
});
```

<h3 id="extend-external-modules" class="ws-anchor">扩展任意外部模块 <sup>2.11+</sup></h3>

我们在 `2.11.0` 版本新增了无缝扩展任意外部模块的支持，即无需遵循 Layui 模块规范的第三方库也能通过 Layui 去加载，并且无需对外部模块做任何的代码改动，只需在 `layui.extend()` 方法中声明模块名、路径和接口即可。

当声明的模块接受的是一个 `object` 类型时，即意味着声明任意外部模块。声明外部模块的对象由以下选项组成：

- `src` : 模块路径，可以是项目的相对路径，也可以是任意外部模块的公共 CDN 地址；
- `api` : 接口名称，通常是模块提供的全局对象

下面是一个扩展任意外部模块的示例：

```js
// 扩展任意外部模块
layui.extend({
  marked: {
    src: 'https://cdnjs.cloudflare.com/ajax/libs/marked/15.0.7/marked.min.js', // 模块路径
    api: 'marked' // 接口名称
  },
  Prism: {
    src: 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js',
    api: 'Prism'
  }
});

// 加载扩展模块
layui.use(['marked', 'Prism'], function() {
  console.log('任意外部模块 loaded: ')
  console.log('  > marked: ', layui.marked);
  console.log('  > Prism: ', layui.Prism);
});
```

> 扩展模块是项目开发的重要环节，它既可以是工具性组件，也可以是纯业务组件，是 Layui 的延伸，也是项目的支撑。


<h2 id="index" lay-toc="">建立模块入口</h2>

在不同的页面中，可能需要用到不同的业务模块。以首页为例：

```
<script src="/js/layui/layui.js"></script>
<script>
layui.config({
  base: '/js/modules/' // 业务模块所在目录
}).use('index'); // 加载当前页面需要的业务模块
</script>
```

上述的 `index` 模块即对应的模块文件 `/js/modules/index.js`，它同样也必须符合 Layui 模块规范。如：

```
/**
 * index.js 首页业务模块
 */
layui.define(['layer', 'form'], function(exports){
  var layer = layui.layer;
  var form = layui.form;

  layer.msg('Hello Index');

  exports('index', {}); // 输出模块名需和 use 和 extend 时的模块名一致
});
```

**合并模块入口**

当项目存在许多不同的业务模块（且存在一定的依赖关系），我们又希望在页面中建立统一的入口模块。如：

```
// mod1.js
layui.define('layer', function(exports){
  // …
  exports('mod1', {});
});

// mod2.js，假设依赖 mod1 和 form
layui.define(['mod1', 'form'], function(exports){
  // …
  exports('mod2', {});
});

// mod3.js
// …

// index.js 主入口模块
layui.define('mod2', function(exports){
  // …
  exports('main', {});
});
```

我们可以将上述模块合并为一个文件来加载，即借助构建工具（如 Gulp）将上述的 <code>mod1、mod2、mod3、index</code> 等业务模块合并到一个模块文件：`index.js`，此时只需在页面统一加载该模块即可。这样我们最多只需要加载两个 JS 文件：`layui.js、index.js`，这将大幅度减少静态资源的请求。



<br>

## 小贴士

> 综上： Layui 轻量级模块系统，无非就是：定义模块、使用模块、弃用模块、扩展模块的相互呼应，翻译成 API 即：
> - `layui.define();`
> - `layui.use();`
> - `layui.disuse();`
> - `layui.extend();`
> ---
> 熟练运用，可让您的项目更利于维护。
