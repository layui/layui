---
title: 通用弹出层组件 layer
toc: true
---
 
# 弹出层组件 🔥

> 弹出层组件 `layer` 是 `Layui` 最古老的组件，也是使用覆盖面最广泛的代表性组件。 `layer` 集众多弹层功能为一体，灵活而多样，是许多开发者的网页弹出层的首选交互方案，在各类业务场景都能发挥重要作用。


<h2 id="examples" lay-toc="{anchor: null}">示例</h2>

点击下述按钮，查看每个示例对应的弹层效果。

<div>
{{- d.include("/layer/detail/demo.md") }}
</div>

<h2 id="api" lay-toc="{hot: true, bold: true}">API</h2>

| API | 描述 |
| --- | --- |
| var layer = layui.layer | 获得 `layer` 模块。 |
| 弹出 : | - |
| [layer.open(options)](#open) | 打开弹层，核心方法。下述所有弹出方式均为该方法的二次封装 |
| [layer.alert(content, options, yes)](#alert) | 弹出 `dialog` 类型信息框。 |
| [layer.confirm(content, options, yes, cancel)](#confirm) | 弹出 `dialog` 类型询问框。 |
| [layer.msg(content, options, end)](#msg) | 弹出 `dialog` 类型提示框。 |
| [layer.load(icon, options)](#load) | 弹出 `loading` 类型加载层。 |
| [layer.tips(content, elem, options)](#tips) | 弹出 `tips` 类型贴士层。 |
| [layer.prompt(options, yes)](#prompt) | 弹出 `page` 类型输入框层。 |
| [layer.photos(options)](#photos) | 弹出 `page` 类型图片层。 |
| [layer.tab(options)](#tab) | 弹出 `page` 类型标签页层。 |
| 关闭 : | - |
| [layer.close(index)](#close) | 关闭对应的层，核心方法。 |
| [layer.closeAll(type)](#closeAll) | 关闭所有对应类型的层。 |
| [layer.closeLast(type)](#closeLast) <sup>2.8+</sup> | 关闭最近打开的对应类型的层。 |
| 其他 : | - |
| [layer.config(options)](#config) | 全局配置默认属性。 |
| [layer.ready(callback)](#ready) | 样式初始化就绪。 |
| [layer.style(index, css)](#set-style) | 重新设置弹层样式。 |
| [layer.title(title, index)](#set-title) | 设置弹层的标题。 |
| [layer.getChildFrame(selector, index)](#getChildFrame) | 获取 iframe 页中的元素。 |
| [layer.getFrameIndex(window.name)](#getFrameIndex) | 在 iframe 页中获取弹层索引。 |
| [layer.iframeAuto(index)](#iframeAuto) | 设置 iframe 层高度自适应。 |
| [layer.iframeSrc(index, url)](#iframeSrc) | 重新设置 iframe 层 URL。 |
| layer.index | 获取最新弹出层的索引 |
| layer.zIndex | 获取最新弹出层的层叠顺序 |
| [layer.setTop(layero)](#setTop) | 将对应弹层的层叠顺序为置顶。 |
| [layer.full(index)](#full) | 设置弹层最大化尺寸。 |
| [layer.min(index)](#min) | 设置弹层最小化尺寸。 |
| [layer.restore(index)](#restore) | 还原弹层尺寸。 |


<h2 id="open" lay-toc="{level: 2}">打开弹层</h2>

`layer.open(options);`

- 参数 `options` : 基础属性配置项。[#详见属性](#options)

打开弹层的核心方法，其他不同类型的弹出方法均为该方法的二次封装。

```
// 该方法返回当前层的唯一索引，以便其他方法对该弹层进行相关操作
var index = layer.open({
  type: 1, // page 层类型，其他类型详见「基础属性」
  content: '<div style="padding: 16px;">test</div>'
});
```

<h2 id="options" lay-toc="{level: 2, hot: true}">基础属性</h2>

<div>
{{- d.include("/layer/detail/options.md") }}
</div>

<h2 id="alert" lay-pid="api" class="ws-anchor ws-bold">弹出信息框</h2>

`layer.alert(content, options, yes);`

- 参数 `content` : 弹出内容
- 参数 `options` : 基础属性配置项。[#详见属性](#options)
- 参数 `yes` : 点击确定后的回调函数

该方法用于弹出 `dialog` 类型信息框（`type: 0`），参数自动向左补位。

```
// eg1
layer.alert('一个简单的信息框');
// eg2
layer.alert('开启图标', {icon: 1}, function(index){
  // do something
  // …
  layer.close(index);
});
// eg3
layer.alert('不开启图标', function(index){
  // do something
  // …
  layer.close(index);
});  
```

<h2 id="confirm" lay-pid="api" class="ws-anchor ws-bold">弹出询问框</h2>

`layer.confirm(content, options, yes, cancel);`

- 参数 `content` : 弹出内容
- 参数 `options` : 基础属性配置项。[#详见属性](#options)
- 参数 `yes` : 点击确定后的回调函数
- 参数 `cancel` : 点击第二个按钮（默认「取消」）后的回调函数

该方法用于弹出 `dialog` 类型询问框（`type: 0`），参数自动向左补位。

```
// eg1
layer.confirm('确定吗?', {icon: 3, title:'提示'}, function(index){
  // do something
  // …
  layer.close(index);
});
// eg2
layer.confirm('确定吗?', function(index){
  // do something
  // …
  layer.close(index);
});  
```


<h2 id="msg" lay-pid="api" class="ws-anchor ws-bold">弹出提示框</h2>

`layer.msg(content, options, end);`

- 参数 `content` : 弹出内容
- 参数 `options` : 基础属性配置项。[#详见属性](#options)
- 参数 `end` : 提示框关闭后的回调函数

该方法用于弹出 `dialog` 类型提示框（`type: 0`），默认 `3` 秒后自动关闭。参数自动向左补位。

```
// eg1
layer.msg('普通提示');
// eg2
layer.msg('带 icon 的提示', {icon: 6}); 
// eg3
layer.msg('关闭后想做些什么', function(){
  // do something
}); 
// eg
layer.msg('提示框', {
  icon: 1,
  time: 2000 // 设置 2 秒后自动关闭
}, function(){
  // do something
});   
```


<h2 id="load" lay-pid="api" class="ws-anchor ws-bold">弹出加载层</h2>

`layer.load(icon, options);`

- 参数 `icon` : 加载图标风格，支持 `0-2` 可选值
- 参数 `options` : 基础属性配置项。[#详见属性](#options)

该方法用于弹出 `load` 类型加载层（`type: 3`）。

```
// eg1
var index = layer.load(); // 默认加载图标风格
// eg2
var index = layer.load(1); // 加载图标风格 1
// eg3
var index = layer.load(2, {time: 10*1000}); // 加载图标风格，并设置最长等待 10 秒

// 关闭加载层
layer.close(index);     
```

<h2 id="tips" lay-pid="api" class="ws-anchor ws-bold">弹出贴士层</h2>

`layer.tips(content, elem, options);`

- 参数 `content` : 弹出内容
- 参数 `elem` : 吸附的目标元素选择器或对象
- 参数 `options` : 基础属性配置项。[#详见属性](#options)

该方法用于弹出 `tips` 类型贴士层（`type: 4`），默认 `3` 秒后自动关闭。

```
// eg1
layer.tips('小贴士', '#id');
// eg2
$('#id').on('click', function(){
  var elem = this;
  layer.tips('小贴士', elem); //在元素的事件回调体中，follow直接赋予this即可
});
// eg3
layer.tips('显示在目标元素上方', '#id', {
  tips: 1 // 支持 1-4 可选值，更多详见基础属性中的 tips 介绍
});
```

<h2 id="prompt" lay-pid="api" class="ws-anchor ws-bold">弹出输入框</h2>

`layer.prompt(options, yes);`

- 参数 `options` : 基础属性配置项。除了支持 [基础属性](#options) 之外，还支持下表私有属性：

| 私有属性 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| formType | 输入框类型。支持以下可选值：<ul><li> `0` 文本输入框 </li><li> `1` 密令输入框 </li><li> `2` 多行文本输入框 </li></ul> | number | `0` |
| value | 输入框初始值 | string | - |
| maxlength | 可输入的最大字符长度 | number | `500` |
| placeholder | 输入框内容为空时的占位符 | string | - |


- 参数 `yes` : 点击确定后的回调函数

该方法用于弹出输入框层，基于 `type: 1`（即 `page` 层）的自定义内容。 效果参考： [#示例](#demo-other)

```
// eg1
layer.prompt(function(value, index, elem){
  alert(value); // 得到 value
  layer.close(index); // 关闭层
});
 
// eg2
layer.prompt({
  formType: 2,
  value: '初始值',
  title: '请输入值',
  area: ['800px', '350px'] // 自定义文本域宽高
}, function(value, index, elem){
  alert(value); // 得到 value
  layer.close(index); // 关闭层
});
```

<h2 id="photos" lay-pid="api" class="ws-anchor ws-bold">弹出图片层</h2>

`layer.photos(options);`

- 参数 `options` : 基础属性配置项。除了支持 [基础属性](#options) 之外，还支持下表私有属性：

| 私有属性 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| photos | 图片层的数据源，格式详见下述示例。 | object | - |
| toolbar <sup>2.8.16+</sup> | 是否显示顶部工具栏 | boolean | `true` |
| footer <sup>2.8.16+</sup> | 是否隐藏底部栏 | boolean | `true` |
| tab | 图片层切换后的回调函数，返回的参数见下述示例 | function | - |

该方法用于弹出图片层，基于 `type: 1`（即 `page` 层）的自定义内容。 

**用法一：直接赋值图片数据**。 效果参考： [#示例](#demo-other)

```
layer.photos({
  photos: { // 图片层的数据源
    "title": "", // 相册标题
    "id": 123, // 相册 id
    "start": 0, // 初始显示的图片序号，默认 0
    "data": [   // 相册包含的图片，数组格式
      {
        "alt": "图片名",
        "pid": 666, // 图片id
        "src": "", // 原图地址
        "thumb": "" // 缩略图地址
      },
      // …
    ]
  },
  tab: function(data, layero){ // 图片层切换后的回调
    console.log(data); // 当前图片数据信息
    console.log(layero); // 图片层的容器对象
  }
});
```

**用法二：绑定页面图片元素**。点击图片时，弹出对应的图片层。

<pre class="layui-code" lay-options="{preview: true, layout: ['code', 'preview'], tools: ['full']}">
  <textarea>
<style>
.class-photos-demo img{width: 160px; height: 100px; cursor: pointer;}
</style>

<div id="ID-photos-demo" class="class-photos-demo">
  <!-- <img src="缩略图" layer-src="大图地址" layer-pid="图片id，可不写" alt="图片名"> -->
  <img src="https://unpkg.com/outeres/demo/layer.png" layer-src="https://unpkg.com/outeres/demo/layer.png" layer-pid="" alt="layer">
  <img src="https://unpkg.com/outeres/demo/000.jpg" layer-src="https://unpkg.com/outeres/demo/000.jpg" layer-pid="" alt="壁纸">
  <img src="https://unpkg.com/outeres/demo/outer-space.jpg" layer-src="https://unpkg.com/outeres/demo/outer-space.jpg" layer-pid="" alt="星空如此深邃">  
</div>

<!-- import layui --> 
<script>
layui.use(function(){
  var layer = layui.layer;
  // 图片层
  layer.photos({
    photos: '#ID-photos-demo'
  }); 
});
</script>
  </textarea>
</pre>


<h2 id="tab" lay-pid="api" class="ws-anchor ws-bold">弹出标签层</h2>

`layer.tab(options);`

- 参数 `options` : 基础属性配置项。除了支持 [基础属性](#options) 之外，还支持下表私有属性：

| 私有属性 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| tab | 标签层的数据源，格式详见下述示例。 | array | - |

该方法用于弹出标签层，基于 `type: 1`（即 `page` 层）的自定义内容。 效果参考： [#示例](#demo-other)

```
layer.tab({
  area: ['600px', '300px'],
  tab: [{ // 标签层的数据源
    title: '标题 1', 
    content: '内容 1'
  }, {
    title: '标题 2', 
    content: '内容 2'
  }, {
    title: '标题 3', 
    content: '内容 3'
  }]
});
```


<h2 id="close" lay-toc="{level: 2}">关闭弹层</h2>

`layer.close(index);`

- 参数 `index` : 打开弹层时返回的唯一索引

该方法用于关闭对应的弹层。

```
// 每一种弹层调用方式，都会返回一个 index
var index1 = layer.open();
var index2 = layer.alert();
var index3 = layer.load();
var index4 = layer.tips();

// 关闭对应的弹层
layer.close(index1);
```

在 iframe 弹层页面中关闭自身

```
var index = parent.layer.getFrameIndex(window.name); // 先得到当前 iframe 层的索引
parent.layer.close(index); // 再执行关闭 
```


<h2 id="closeAll" lay-pid="api" class="ws-anchor ws-bold">关闭所有层</h2>

`layer.closeAll(type);`

- 参数 `type` : 弹层的类型。可选值：`dialog,page,iframe,loading,tips`

该方法用于关闭所有同类型的弹层。

```
layer.closeAll(); // 关闭所有类型的层
layer.closeAll('dialog'); // 关闭所有的信息框
layer.closeAll('page'); // 关闭所有的页面层
layer.closeAll('iframe'); // 关闭所有的 iframe 层
layer.closeAll('loading'); // 关闭所有的加载层
layer.closeAll('tips'); // 关闭所有的 tips 层
```

<h2 id="closeLast" lay-pid="api" class="ws-anchor ws-bold">关闭最近一次打开的层 <sup>2.8+</sup></h2>

`layer.closeLast(type);`

- 参数 `type` : 弹层的类型。可选值：`dialog,page,iframe,loading,tips`

该方法用于关闭最近一次打开的对应类型的层。

```
layer.closeLast('dialog'); // 关闭最近一次打开的信息框
layer.closeLast('page'); // 关闭最近一次打开的页面层
layer.closeLast('iframe'); // 关闭最近一次打开的 iframe 层
layer.closeLast('loading'); // 关闭最近一次打开的加载层
layer.closeLast('tips'); // 关闭最近一次打开的 tips 层
```

<h2 id="config" lay-pid="api" class="ws-anchor ws-bold">全局配置默认属性</h2>

`layer.config(options);`

- 参数 `options` : 基础属性配置项。[#详见属性](#options)

该方法用于全局设置弹层的默认基础属性。

```
layer.config({
  title: '默认标题',
  skin: '', // 设置默认主题
  // … 其他任意基础属性
})
```

<h2 id="ready" lay-pid="api" class="ws-anchor ws-bold">样式初始化就绪</h2>

`layer.ready(callback);`

- 参数 `callback` : 初始化完毕后的回调函数

该方法一般是在源码方式引入 `layui.js`，且要在页面初始即弹出层时使用，以确保弹层所依赖的样式文件先行加载。 而引入 release 版的 `layui.js` 则无需使用该方法，因为弹层样式已经统一合并到 `layui.css` 中。

```
// 页面初始弹出层
layer.ready(function(){
  layer.alert('对话框内容');
});
```

<h2 id="set-style" lay-pid="api" class="ws-anchor ws-bold">重新设置弹层样式</h2>

`layer.style(index, css);`

- 参数 `index` : 打开弹层时返回的唯一索引
- 参数 `css` : 要设置的 `css` 属性

该方法对 `loading` 层和 `tips` 层无效。

```
// 打开弹层
var index = layer.open({
  type: 1,
  content: '内容'
});

// 重新给对应层设定 width、top 等
layer.style(index, {
  width: '1000px',
  top: '10px'
});  
```

<h2 id="set-title" lay-pid="api" class="ws-anchor ws-bold">设置弹层的标题</h2>

`layer.title(title, index);`

- 参数 `title` : 标题
- 参数 `index` : 打开弹层时返回的唯一索引

```
// 打开弹层
var index = layer.open({
  type: 1,
  content: '内容'
});

// 重新设置标题
layer.title('新标题', index)
```

<h2 id="getChildFrame" lay-pid="api" class="ws-anchor ws-bold">获取 iframe 页中的元素</h2>

`layer.getChildFrame(selector, index);`

- 参数 `selector` : iframe 子页面的选择器或元素对象
- 参数 `index` : 打开弹层时返回的唯一索引

该方法用于在父页面获取 iframe 子页面中的元素

```
layer.open({
  type: 2, // iframe 层
  content: '/layer/test/iframe.html',
  success: function(layero, index){
    // 获取 iframe 中 body 元素的 jQuery 对象
    var body = layer.getChildFrame('body', index);
    // 给 iframe 页中的某个输入框赋值
    body.find('input').val('Hello layer.');
  }
});  
```

<h2 id="getFrameIndex" lay-pid="api" class="ws-anchor ws-bold">在 iframe 页中获取弹层索引</h2>

`layer.getFrameIndex(window.name);`

- 参数 `window.name` : 当前 iframe 窗口的 `name` 属性值

该方法用于在 iframe 页面内部获取当前 iframe 弹层的索引，以便关闭自身。

```
var index = parent.layer.getFrameIndex(window.name); // 获取当前 iframe 层的索引
parent.layer.close(index); // 关闭当前 iframe 弹层
```

<h2 id="iframeAuto" lay-pid="api" class="ws-anchor ws-bold">设置 iframe 层高度自适应</h2>

`layer.iframeAuto(index);`

- 参数 `index` : 打开弹层时返回的唯一索引

该方法可让 iframe 高度跟随内容自适应

```
layer.open({
  type: 2, // iframe 层
  content: '/layer/test/iframe.html',
  area: '600px', // 弹层初始宽度
  success: function(layero, index, that){
    layer.iframeAuto(index); // 让 iframe 高度自适应
    that.offset(); // 重新自适应弹层坐标
  }
}); 
```

<h2 id="iframeSrc" lay-pid="api" class="ws-anchor ws-bold">重新设置 iframe 层 URL</h2>

`layer.iframeSrc(index, url);`

- 参数 `index` : 打开弹层时返回的唯一索引
- 参数 `url` : URL 地址

```
// 打开弹层
var index = layer.open({
  type: 2, // iframe 层
  content: '/layer/test/iframe.html'
}); 
// 重置 iframe 页面 URL
layer.iframeSrc(index, 'https://cn.bing.com/');
```

<h2 id="setTop" lay-pid="api" class="ws-anchor ws-bold">置顶弹层</h2>

`layer.setTop(layero);`

- 参数 `layero` : layer 最外层容器的元素对象，一般可通过各个回调函数返回的参数获取。

该方法一般用于多弹层模式时，实现点击某个弹层让其层叠顺序置顶。效果参考：[#示例](#demo-more)

```
// 多弹层模式的层叠顺序置顶
layer.open({
  type: 1, // 页面层
  shade: false,
  area: ['520px', '320px'],
  maxmin: true,
  content: '<div style="padding: 16px;">多弹层模式的层叠顺序置顶</div>',
  zIndex: layer.zIndex, // 重点 1 --- 初始设置当前最高层叠顺序，
  success: function(layero){
    layer.setTop(layero); // 重点 2 --- 保持选中窗口置顶
  }
}); 
```

<h2 id="full" lay-pid="api" class="ws-anchor ws-bold">设置弹层最大化</h2>

`layer.full(index);`

- 参数 `index` : 打开弹层时返回的唯一索引

```
// 打开弹窗
var index = layer.open({
  type: 1, // 页面层
  content: '弹层内容'
});
// 设置弹层最大化
layer.full(index);
```

<h2 id="min" lay-pid="api" class="ws-anchor ws-bold">设置弹层最小化</h2>

`layer.min(index);`

- 参数 `index` : 打开弹层时返回的唯一索引

```
// 打开弹窗
var index = layer.open({
  type: 1, // 页面层
  content: '弹层内容'
});
// 设置弹层最大化
layer.min(index);
```

<h2 id="restore" lay-pid="api" class="ws-anchor ws-bold">还原弹层</h2>

`layer.restore(index);`

- 参数 `index` : 打开弹层时返回的唯一索引

当弹层最大化或最小化状态时，执行该方法可还原弹层。


## 贴士

> layer 曾经可作为单独组件使用，鉴于维护成本的考量，目前 layer 组件已完全集成到 Layui 中，而单独版本已不做同步维护。 因此，建议直接使用 layui 中 layer 即可。
