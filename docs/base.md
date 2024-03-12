---
title: 底层方法
toc: true
---
 
# 底层方法

> Layui 提供了一系列基础 API，以更好地辅助组件的使用。

<h2 id="config" lay-toc="">全局配置</h2>

`layui.config(options);`

您可以在 Layui 模块使用之前，采用该方法进行一些全局化的基础配置，其支持的属性如下：

```
layui.config({
  base: '', // 设定 Layui 扩展模块的所在目录，一般与 extend 方法搭配使用
  version: false, // 用于更新模块缓存，默认 false。若设为 true，即让浏览器不缓存。也可设为一个任意数值
  dir: 'layui/', // layui 基础目录，用于动态导入 src/layui.js 时的内置模块的加载。一般无需设置
  debug: false // 用于开启调试模式，默认 false。若设为 true，则模块的引入节点会保留在页面
});
```

<!--

### 🌕 预设全局对象 <sup>2.6+</sup>

特别地，若你对 `layui.js` 本身进行了动态加载或是其他特殊场景中使用，那么上述 `layui.config()` 所设定的 `dir` 属性会因此失效，此时你可以在动态加载 <code>layui.js</code> 之前预先定义一个我们约定好的全局对象，如：

```
<script>  
var LAYUI_GLOBAL = {
  dir: '/res/layui/' // layui.js 所在目录
};
</script>
```

> 提示：以上 `dir` 属性的目录设定仅针对特殊场景，如是采用 `<script>` 标签正常引入 layui 的，可以无视该操作。

-->


<h2 id="url" lay-toc="">链接解析</h2>

`var url = layui.url(href);`

参数 `href` 可选，默认自动读取当前页面 URL（`location.href`）。该方法用于将一段 URL 链接中的 `pathname、search、hash` 等属性进行对象化处理， 以下是对一个 URL 解析后的返回结果：

```
// 假设当前页面 url 为： https://domain.com/docs/base.html?a=1&c=3#/user/set/id=123/
var url = layui.url();
 
// url 返回结果为：
{
  "pathname": ["docs","base.html"], // 路径
  "search": {"a":"1","c":"3"}, // 参数
  "hash": { // hash 解析
    "path": ["user","set",""], // hash 中的路径
    "search": {"id":"123"}, // hash 中的参数
    "hash": "",  // hash 中的 hash
    "href": "/user/set/id=123/"  // hash 中的完整链接
  }
}
```

该方法通常可搭配 `location.hash` 和 `hashchange ` 事件，或 `history.pushState()` 和 `popstate` 事件使用，从而实现*单页面应用开发*。 Layui 的 AdminUI 主题模板则正是基于该方法完成的路由系统。


<h2 id="data" lay-toc="">本地存储</h2>

本地存储是对 localStorage 和 sessionStorage 的友好封装，可更方便地管理本地数据。方法如下：

- `layui.data(table, settings);` 即 localStorage，数据在浏览器中的持久化存储，除非物理删除。
- `layui.sessionData(table, settings);` 即 sessionStorage ，数据在浏览器中的会话性存储，页面关闭后即失效。

两者使用方式完全一致。其中参数 `table` 为表名，`settings` 是一个对象，用于设置 `key/value`。下面以 `layui.data()` 方法为例：

```
// 【增】：向 test 表插入一个 nickname 字段，如果该表不存在，则自动建立。
layui.data('test', {
  key: 'nickname',
  value: '张三'
});
 
// 【删】：删除 test 表的 nickname 字段
layui.data('test', {
  key: 'nickname',
  remove: true
});
layui.data('test', null); // 删除 test 表
  
// 【改】：同【增】，会覆盖已经存储的数据
  
// 【查】：向 test 表读取全部的数据
var localTest = layui.data('test');
console.log(localTest.nickname); // 获得“张三”
```

<h2 id="device" lay-toc="">浏览器信息</h2>

`var device = layui.device(key);`

参数 `key` 可选。可利用该方法对不同的设备进行差异化处理，`device` 即为不同设备下返回的不同信息，如下：

```
{
  os: "windows", // 当前浏览器所在的底层操作系统，如：Windows、Linux、Mac 等
  ie: false, // 当前浏览器是否为 ie6-11 的版本，如果不是 ie 浏览器，则为 false
  weixin: false, // 当前浏览器是否为微信 App 环境
  android: false, // 当前浏览器是否为安卓系统环境
  ios: false, // 当前浏览器是否为 IOS 系统环境
  mobile: false // 当前浏览器是否为移动设备环境（v2.5.7 新增）
}
```

有时，你的 App 可能会对 userAgent 插入一段特定标识，如：

```
Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 MYAPP/1.8.6 Safari/537.36
```

要验证当前页面是否在你的 App 环境中，即可通过上述 `MYAPP`（即 Native 给 Webview 插入的标识，可自由定义）来判断。

```
var device = layui.device('MYAPP');
if(device.MYAPP){
  alert('在 MYAPP 环境中');
}
```

<h2 id="api" lay-toc="{hot: true}">API 列表</span></h2>

前面我们特别介绍了几个相对特殊的基础方法，而以下是 Layui 提供的全部基础 API：

| API | 描述 |
| --- | --- |
| layui.cache | 获得 UI 的一些配置及临时缓存信息 |
| layui.config(options) | 基础配置。[#用法](#config) |
| layui.define([modules], callback) | 定义模块。[#用法](modules.html#define) |
| layui.use([modules], callback) | 加载模块。[#用法](modules.html#use) |
| layui.extend(obj) | 扩展模块。[#用法](modules.html#extend) |
| layui.disuse([modules]) <sup>2.7+</sup> | 弃用模块，以便重新扩展新的同名模块。参数支持数组，即可同时弃用多个模块。 如：`layui.disuse(['table'])` |
| layui.link(href) | 加载 CSS，`href` 即为 css 路径。一般用于动态加载你的外部 CSS 文件 |
| layui.getStyle(node, name) | 获得一个原始 DOM 节点的 style 属性值，如： <br>`layui.getStyle(document.body, 'font-size')` |
| layui.img(src, callback, error) | 图片预加载 |
| layui.each(obj, callback) | 对象（Array、Object、DOM 对象等）遍历，可用于取代 for 语句 |
| layui.type(operand) <sup>2.6.7+</sup> | 获取基本数据类型和各类常见引用类型，如： <br> `layui.type([]); // array` <br> `layui.type({}); //object` <br> `layui.type(new Date()); // date` |
| layui.isArray(obj) <sup>2.7+</sup> | 对象是否为泛数组结构。如 Array、NodeList、jQuery 对象等<br> `layui.isArray([1,6]); // true` <br> `layui.isArray($('div')); // true` |
| layui.sort(obj, key, desc) | 将数组中的对象按某个成员重新对该数组排序，如：`layui.sort([{a: 3},{a: 1},{a: 5}], 'a');  // 返回：[{"a":1},{"a":3},{"a":5}]` |
| layui.url(href) | 链接解析。[#用法](#url) |
| layui.data(table, settings) | 持久化存储。[#用法](#data) |
| layui.sessionData(table, settings) | 会话性存储。[#用法](#data) |
| layui.device(key) | 获取浏览器信息。[#用法](#device) |
| layui.hint() | 向控制台打印一些异常信息，目前只返回了 error 方法，如： <br>`var hint = layui.hint();` <br> `hint.error('出错啦');` |
| layui.stope(e) | 阻止事件冒泡 |
| layui.onevent(modName, events, callback) | 增加自定义模块事件，一般在内置组件中使用。 |
| layui.event(modName, events, params) | 执行自定义模块事件，搭配 onevent 使用。注<sup>2.8+</sup>：当 events 参数中未设定 filter 时则可重复执行该事件，否则只会执行一次最新添加的事件。 |
| layui.off(events, modName) <sup>2.5.7+</sup> | 用于移除模块相关事件，如：`layui.off('select(filter)', 'form')`，那么`form.on('select(filter)', callback)`事件将会被移除 |
| layui.debounce(fn, wait) <sup>2.8.3+</sup> | 防抖，函数按指定毫秒延时执行 |
| layui.throttle(fn, wait) <sup>2.8.3+</sup> | 节流，限制函数在指定毫秒内不重复执行 |
| layui.factory(modName) | 用于获取模块对应的 `layui.define()` 的回调函数 |
| var lay = layui.lay | 基础模块，提供了更多基础 API，一般供 Layui 内置组件中使用 |

> 基础 API 是整个 UI 的有力支撑，我们在组件的使用过程中也经常会用到。


