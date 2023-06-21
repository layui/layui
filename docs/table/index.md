---
title: 表格组件 table
toc: true
---
 
# 表格组件 🔥

> 表格组件 `table` 是 Layui 中使用率极高的一个组件，它以表格的承载方式对数据进行渲染、重载、排序、统计、分页等等一系列交互操作，并提供了丰富的 API 用于扩展，基本涵盖了日常业务所涉及的大部分需求。 

<h2 id="examples" lay-toc="{anchor: null}" style="margin-bottom: 0;">示例</h2>

以下所有示例中演示的数据均为「静态模拟数据」，实际使用时换成您的真实接口即可。

<div>
{{- d.include("/table/detail/demo.md") }}
</div>

<h2 id="api" lay-toc="{bold: true, hot: true}">API</h2>

| API | 描述 |
| --- | --- |
| var table = layui.table | 获得 `table` 模块。 |
| [table.set(options)](#set) | 设定全局默认属性项。 |
| [table.render(options)](#render) | table 组件渲染，核心方法。 |
| [table.init(filter, options)](#table.init) | 初始化渲染静态表格。 |
| [table.reload(id, options, deep)](#table.reload) | 表格完整重载。  |
| [table.reloadData(id, options, deep)](#table.reloadData) <sup>2.7+</sup> | 表格数据重载。 |
| [table.renderData(id)](#table.renderData) <sup>2.8.5+</sup> | 重新渲染数据。 |
| [table.checkStatus(id)](#table.checkStatus) | 获取选中行相关数据。  |
| [table.setRowChecked(id, opts)](#table.setRowChecked) <sup>2.8+</sup> | 设置行选中状态。 |
| [table.getData(id)](#table.getData) | 获取当前页所有行表格数据。 |
| [table.cache](#table.cache) | 获取表格缓存数据集（包含特定字段）。 |
| [table.resize(id)](#table.resize) | 重置表格尺寸。 |
| [table.exportFile(id, data, opts)](#table.exportFile) | 导出表格数据到本地文件。 |
| [table.getOptions(id)](#table.getOptions) <sup>2.8+</sup> | 获取表格实例配置项。 |
| [table.hideCol(id, cols)](#table.hideCol) <sup>2.8+</sup> | 设置表格列的显示隐藏属性。 |
| [table.on(\'event(filter)\', callback)](#table.on) | table 相关事件。 |


<h3 id="set" class="ws-anchor ws-bold">全局设置</h3>

- 参数 `options` : 基础属性配置项。[#详见属性](#options)

该方法主要用于初始化设置属性默认值。实际应用时，必须先设置该方法，再执行渲染、重载等操作。

```js
layui.use(function(){
  var table = layui.table;
  // 全局设置
  table.set({
    headers: {token: '123'}
  });
  // 渲染
  table.render(options);
});
```


<h3 id="render" lay-toc="{level: 2}" class="ws-anchor ws-bold">渲染</h3>

table 提供了以下三种渲染模式，在实际使用时，一般按情况选择其中一种即可。

| 渲染方式 | 描述 |
| --- | --- |
| [方法配置渲染](#table.render) | 通过 table 组件提供的核心方法 `table.render(options)` 完成的渲染。<sup>推荐</sup> |
| [模板配置渲染](#view-render) | 通过 `<table>` 标签的 `lay-options="{}"` 属性定义模板，组件自动对其进行解析并完成渲染。 |
| [静态表格渲染](#table.init) | 对一段已经包含数据内容的静态表格进行动态化转换，使其具备 table 组件的相关功能。 |


<h4 id="table.render" lay-pid="render" class="ws-anchor ws-bold">方法配置渲染</h4>

`table.render(options);`

- 参数 `options` : 基础属性配置项。[#详见属性](#options)

该方法返回当前实例对象，包含可操作当前表格的一些成员方法。

```html
<table id="test"></table>
 
<!-- import layui -->
<script>
layui.use(function(){
  var table = layui.table;
  
  // 渲染，并获得实例对象
  var inst = table.render({
    elem: '#test', // 绑定元素选择器
    // 其他属性
    // …
  });
 
  // 实例对象成员
  inst.config; // 当前表格配置属性
  inst.reload(options, deep); // 对当前表格的完整重载。参数 deep 表示是否深度重载。
  inst.reloadData(options, deep); // 对当前表格的数据重载。参数 deep 同上。
  inst.resize(); // 对当前表格重新适配尺寸
  inst.setColsWidth() // 对当前表格重新分配列宽
})
</script>
```

<h4 id="view-render" lay-pid="render" class="ws-anchor ws-bold">模板配置渲染</h4>

在 `<table>` 元素中直接书写 `lay-options="{}"` 属性，组件将自动对其进行解析并完成渲染。

```
<!-- 此处 `lay-options` 定义基础属性 -->
<table class="layui-table" lay-options="{url: ''}" id="test">
  <thead>
    <tr>
      <!-- 此处 `lay-options` 定义表头属性 -->
      <th lay-options="{field: 'title'}">Title</th> 
    </tr>
  </thead>
</table>
```

> 2.8 之前版本通过 `lay-data="{}"` 定义属性配置项；<br>
> 2.8+ 版本推荐采用 `lay-options`，但同时兼容 `lay-data`。


<h4 id="table.init" lay-pid="render" class="ws-anchor ws-bold">静态表格渲染</h4>

`table.init(filter, options);`

- 参数 `filter` :  `<table>` 元素对应的 `lay-filter` 属性值
- 参数 `options` : 基础属性配置项。[#详见属性](#options)

该方法用于将已输出在页面中的静态表格内容转换为动态 table 组件。[#参考相关示例](#demo-init)

```html
<table lay-filter="test">
  表格内容
</table>
 
<!-- import layui -->
<script>
layui.use(function(){
  var table = layui.table;

  // 将静态表格进行动态化
  table.init('test', {
    height: 366,
    // 其他属性
    // …
  });
});
</script>
```

<h2 id="options-intro" lay-toc="{level: 2}">属性 🔥</h2>

属性是指 table *渲染、重载* 时的配置选项（`options`），它本身是一个 `object` 参数。如：

```
// 渲染
table.render({
  // options
  elem: '',
  cols: [[]],
  // …
}); 
// 重载
table.reload(id, {
  // options
});
       
若为模板配置渲染，则 lay-options 或 lay-data 的属性值即为属性的配置选项（：
<table lay-options="{url: ''}"> … </table> 
```

table 的属性众多，我们大致分为以下几种：

| 属性类别 | 描述 |
| --- | --- |
| [基础属性](#options) | - |
| [异步属性](#options.ajax) | 用于和异步数据请求相关的基础属性，由于相关属性成员较多，所以单独提取介绍。 |
| [表头属性](#options.cols) | 基础属性 `cols` 的子属性集。 |

<h3 id="options" lay-toc="{level: 3, hot: true}" class="ws-bold">基础属性</h3>

<div>
{{- d.include("/table/detail/options.md") }}
</div>

<h3 id="options.ajax" lay-toc="{level: 3, hot: true}" class="ws-bold">异步属性</h3>

异步属性本质也是基础属性，当开启 `url` 属性时才有效，由于相关属性成员较多，所以单独提取介绍。

<div>
{{- d.include("/table/detail/options.ajax.md") }}
</div>

<h3 id="options.cols" lay-toc="{level: 3, hot: true}" class="ws-bold">表头属性</h3>

表头属性是基础属性 `cols` 的子集，其使用频率甚至超过基础属性本身。

<div>
{{- d.include("/table/detail/options.cols.md") }}
</div>

<h3 id="reload" lay-toc="{level: 2}" class="ws-anchor ws-bold">重载</h3>

即对一段已经渲染好的表格重新设置属性并渲染，可分为以下几种重载方式：

| 重载方式 | API |
| --- | --- |
| [完整重载](#table.reload) | [table.reload(id, options, deep)](#table.reload) |
| [仅数据重载](#table.reloadData) | [table.reloadData(id, options, deep)](#table.reloadData) |

重载的使用方式完全相同，区别只是在于参与重载时的属性差异及其对应的效果差异。一般按照实际需求选择使用。


<h4 id="table.reload" lay-pid="reload" class="ws-anchor ws-bold">完整重载</h4>

`table.reload(id, options, deep);`

- 参数 `id` : table 渲染时的 `id` 属性值
- 参数 `options` : 为基础属性配置项
- 参数 `deep` <sup>2.6+</sup> : 是否采用深度重载（即重载时始终携带初始时及上一次重载时的参数），默认 false。<div style="margin-top:5px;"><button type="button" class="layui-btn layui-btn-sm layui-btn-primary" lay-layer="{content: '#DOCS-table-reload-comp'}">2.6 之前版本的 <code>table.reload()</code> 方法兼容性说明</button></div>

<div style="display: none;" id="DOCS-table-reload-comp">
  <div class="layui-text">
    <p>由于 2.6 之前的版本是采用深度重载，所以如果您之前利用了该机制，那么升级 Layui 时，需通过以下任一方式进行相应的兼容性适配：</p>
    <strong>方法一：</strong>
    <p>追加参数兼容：<pre><code>table.reload(id, options, true);</code></pre></p>
    <strong>方法二：</strong>
    <p>方法重写兼容。将以下代码放入您的公共 JS 代码中</p>
    <pre><code>// 对 2.6 之前版本的 table.reload() 方法兼容
var tableReload = table.reload;
table.reload = function(){
  var args = [];
  layui.each(arguments, function(index, item){
    args.push(item);
  });
  args[2] === undefined && (args[2] = true);
  return tableReload.apply(null, args);
}; </code></pre>
  </div>
</div>

该方法用于对表格的视图和数据在内的全部重载，所有属性均会参与到重载中，对应的表格会有一个直观的刷新效果。

```
// 渲染
table.render({
  elem: '', // 绑定元素选择器
  id: 'test', // 自定义 id 索引
  // 其他属性 …
});

// 完整重载 -  所有属性属性(options)均可参与到重载中
table.reload('test', {
  where: { // 传递数据异步请求时携带的字段
    aaa: '111',
    bbb: '222'
    //…
  },
  height: 1000 // 重设高度
});
```


<h4 id="table.reloadData" lay-pid="reload" class="ws-anchor ws-bold">仅数据重载 <sup>2.7+</sup></h4>

`table.reloadData(id, options, deep);`

- 参数同 `table.reload(id, options, deep)` 参数

该方法用于对表格的数据重载，与数据无关的属性不会参与到重载中。因此若只是更新数据，该方法可大幅提升体验。

```
// 渲染
table.render({
  elem: '', // 绑定元素选择器
  id: 'test', // 自定义 id 索引
  // 其他属性 …
});

// 数据重载 - 仅与数据相关的属性(options)能参与到重载中
table.reloadData('test', {
  where: {}, // 数据异步请求时携带的字段集 --- 属性设置有效，因属于数据相关属性
  scrollPos: true, // 设定重载数据或切换分页时的滚动条的位置状态 --- 属性设置有效
  // …
  height: 2000 // 高度  --- 属性设置无效，因不属于数据相关属性
});
```

<h3 id="table.renderData" lay-pid="api" class="ws-anchor ws-bold">重新渲染数据 <sup>2.8.5+</sup></h3>

`table.renderData(id);`
- 参数 `id` : table 渲染时的 `id` 属性值

该方法用于重新渲染数据，一般在修改 `table.cache` 后使用。

```js
// 渲染
table.render({
  elem: '', // 绑定元素选择器
  id: 'test', // 自定义 id 索引
  // 其他属性 …
});
// 获取当前实例的数据缓存
var data = table.cache['test'];
// 获取某行数据，并从 data 中移除该行
var item = data.splice(index, 1) // index 为当前行下标，一般可在事件中通过 obj.index 得到
// 将某行数据移动到另外某行
data.splice(newIndex, 0, item[0]);
// 根据 table.cache 重新渲染数据
table.renderData('test');
```


<h3 id="table.checkStatus" lay-pid="api" class="ws-anchor ws-bold">获取选中行</h3>

`table.checkStatus(id);`
- 参数 `id` : table 渲染时的 `id` 属性值

该方法用于获取表格当前选中行相关数据

```js
// 渲染
table.render({
  elem: '', // 绑定元素选择器
  id: 'test', // 自定义 id 索引
  // 其他属性 …
});

// 获取选中行相关数据
var tableStatus = table.checkStatus('test');
console.log(checkStatus.data) // 选中行的数据
console.log(checkStatus.data.length) // 选中行数量，可作为是否有选中行的条件
console.log(checkStatus.isAll ) // 表格是否全选
```

<h3 id="table.setRowChecked" lay-pid="api" class="ws-anchor ws-bold">设置行选中状态 <sup>2.8+</sup></h3>

`table.setRowChecked(id, opts);`
- 参数 `id` : table 渲染时的 `id` 属性值
- 参数 `opts` : 设置行选中时的可选属性，详见下表

| opts | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 选中方式。可选值: `checkbox,radio`  | string | `checkbox` |
| index | 选中行的下标。即数据的所在数组下标（`0` 开头）。<br>可设置 `all` 表示全选。 | number<br>string | - |
| checked | 选中状态值。 <ul><li>若传递该属性，则赋值固定值。</li><li>若不传递该属性（默认），则 `checkbox` 将在 `true\|false` 中自动切换值，而 `radio` 将赋值 `true` 固定值。<sup>2.8.4+</sup></li></ul> | boolean | - |

该方法用于设置行的选中样式及相关的特定属性值 `LAY_CHECKED`。

```js
// 渲染
table.render({
  elem: '', // 绑定元素选择器
  id: 'test', // 自定义 id 索引
  // 其他属性 …
});
 
// 设置某行选中
table.setRowChecked('test', {
  index: 0, // 选中行的下标。 0 表示第一行
});

// 取消选中行
table.setRowChecked('test', {
  index: 'all', // 所有行
  checked: false
});
```


<h3 id="table.getData" lay-pid="api" class="ws-anchor ws-bold">获取当前页接口数据</h3>

`table.getData(id);`
- 参数 `id` : table 渲染时的 `id` 属性值

该方法用于获取表格当前页的数据，它对应的是接口返回的原始数据，不包含 table 组件内部的特定字段。

```
// 渲染
table.render({
  elem: '', // 绑定元素选择器
  id: 'test', // 自定义 id 索引
  // 其他属性 …
});

// 获取当前页接口数据
var data = table.getData('test');
console.log(data);
```


<h3 id="table.cache" lay-pid="api" class="ws-anchor ws-bold">获取表格缓存数据集</h3>

`var tableCache = table.cache;`

`table.cache` 是一段存储当前页表格所有实例的当前页的临时数据，通过 id 作为索引，它包含接口返回的原始数据和组件内部的特定字段。 使用该静态属性可对表格数据进行*读写*操作。

```
// 渲染
table.render({
  elem: '', // 绑定元素选择器
  id: 'test', // 自定义 id 索引
  // 其他属性 …
});

// 获取对应 table 的临时数据
var thisCache = table.cache['test'] || {};
 
// 变更对应 table 的临时数据中的某个字段值
thisCache.fieldName = 123;
```


<h3 id="table.resize" lay-pid="api" class="ws-anchor ws-bold">重置尺寸</h3>

`table.resize(id);`
- 参数 `id` : table 渲染时的 `id` 属性值

该方法用于重置表格尺寸和结构，其内部完成了*固定列高度平铺、动态分配列宽、容器滚动条宽高补丁* 等适配。它一般用于修复特殊情况下导致的列宽适配异常（如浏览器窗口尺寸改变导致的表格父容器宽度变化），以保证表格尺寸依旧能友好展示。


```
// 渲染
table.render({
  elem: '', // 绑定元素选择器
  id: 'test', // 自定义 id 索引
  // 其他属性 …
});

// 重置对应 table 的尺寸，一般写在表格外部容器宽高发生变化后的段落
table.resize('test');
```


<h3 id="table.exportFile" lay-pid="api" class="ws-anchor ws-bold">导出数据</h3>

`table.exportFile(id, data, opts);`
- 参数 `id` : table 渲染时的 `id` **或** 要导出的数据表头（当 `id` 为 `array` 类型时）。
- 参数 `data` : 要导出的自定义数据，参数可选。
- 参数 `opts` <sup>2.7+</sup>: 导出数据时的属性可选项，支持： `type,title`。

该方法用于外部导出对应 table 的数据和任意自定义数据。

```
// 渲染
table.render({
  elem: '', // 绑定元素选择器
  id: 'test', // 自定义 id 索引
  // 其他属性 …
});

// 外部导出对应 table 的数据
table.exportFile('test');
 
// 导出自定义数据
table.exportFile(['名字','性别','年龄'], [
  ['张三','男','20'],
  ['李四','女','18'],
  ['王五','女','19']
], {
  type: 'csv', // 导出的文件格式，支持: csv,xls
  title: '导出的文件标题'
}); 
```

<h3 id="table.getOptions" lay-pid="api" class="ws-anchor ws-bold">获取配置项 <sup>2.8+</sup></h3>

`table.getOptions(id);`
- 参数 `id` : table 渲染时的 `id` 属性值

该方法用于外部获取对应 table 实例的属性配置项。

```
// 渲染
table.render({
  elem: '', // 绑定元素选择器
  id: 'test', // 自定义 id 索引
  // 其他属性 …
});

// 获取配置项
var thisOptions = table.getOptions('test');
console.log(thisOptions);
```

<h3 id="table.hideCol" lay-pid="api" class="ws-anchor ws-bold">设置列显示或隐藏 <sup>2.8+</sup></h3>

`table.hideCol(id, cols);`
- 参数 `id` : table 渲染时的 `id` 属性值
- 参数 `cols` : 设置列（表头）显示或隐藏状态

该方法用于外部设置对应 table 列的显示与隐藏状态。

```
// 渲染
table.render({
  elem: '', // 绑定元素选择器
  id: 'test', // 自定义 id 索引
  // 其他属性 …
});

// 设置对应列的显示或隐藏
table.hideCol('test', {
  field: 'title', // 对应表头的 field 属性值
  hide: true // `true` or `false`
});

// 同时设置多列的显示或隐藏
table.hideCol('test', [{
  field: 'title1',
  hide: true
}, {
  field: 'title2',
  hide: false
}, {
  field: 'title3',
  hide: false
}]);

// 显示或隐藏全部列
table.hideCol('test', false); // `true` or `false`
```

<h2 id="table.on" lay-toc="{hot: true}">事件</h2>

`table.on('event(filter)', callback);`

- 参数 `event(filter)` 是事件的特定结构。 `event` 为事件名，支持的事件见下表。`filter` 为元素属性 `lay-filter` 对应的值。
- 参数 `callback` 为事件执行时的回调函数，并返回一个包含各项成员的 `object` 类型的参数。

|  event | 描述 |
| --- | --- |
| [toolbar](#on-toolbar) | 头部工具栏事件 |
| [sort](#on-sort) | 表头排序切换事件 |
| [colTool](#on-colTool) <sup>2.8.8+</sup> | 表头自定义元素工具事件 |
| [colResized](#on-colResized) <sup>2.8+</sup> | 列拖拽宽度后的事件 |
| [colToggled](#on-colToggled) <sup>2.8+</sup> | 列筛选（显示或隐藏）后的事件 |
| [row / rowDouble](#on-row) | 行单击和双击事件 |
| [rowContextmenu](#on-rowContextmenu) <sup>2.8+</sup> | 行右键菜单事件 |
| [edit](#on-edit) | 单元格编辑事件 |
| [tool / toolDouble](#on-tool) 🔥 | 单元格工具事件。可在该事件中实现行的更新与删除操作。 |
| [checkbox](#on-checkbox) | 复选框事件 |
| [radio](#on-radio) | 单选框事件 |
| [pagebar](#on-pagebar) <sup>2.7+</sup> | 尾部分页栏事件 |


<h3 id="on-toolbar" lay-pid="table.on" class="ws-anchor ws-bold">头部工具栏事件</h3>

`table.on('toolbar(filter)', callback);`

点击头部工具栏区域设定了属性为 `lay-event=""` 的元素时触发。如：

```html
<!-- 原始容器 -->
<table id="test" lay-filter="test"></table>
 
<!-- 工具栏模板 -->
<script type="text/html" id="toolbarDemo">
  <div class="layui-btn-container">
    <button class="layui-btn layui-btn-sm" lay-event="add">添加</button>
    <button class="layui-btn layui-btn-sm" lay-event="delete">删除</button>
    <button class="layui-btn layui-btn-sm" lay-event="update">编辑</button>
  </div>
</script>
 
<!-- import layui -->
<script>
layui.use(function(){
  var table = layui.table;

  // 渲染
  table.render({
    elem: '#test',
    toolbar: '#toolbarDemo',
    // … // 其他属性
  });
   
  // 头部工具栏事件
  table.on('toolbar(test)', function(obj){
    var options = obj.config; // 获取当前表格属性配置项
    var checkStatus = table.checkStatus(options.id); // 获取选中行相关数据
    console.log(obj); // 查看对象所有成员
    
    // 根据不同的事件名进行相应的操作
    switch(obj.event){ // 对应模板元素中的 lay-event 属性值
      case 'add':
        layer.msg('添加');
      break;
      case 'delete':
        layer.msg('删除');
      break;
      case 'update':
        layer.msg('编辑');
      break;
    };
  });
});
</script>
```

<h3 id="on-sort" lay-pid="table.on" class="ws-anchor ws-bold">排序切换事件</h3>

`table.on('sort(filter)', callback);`

点击表头排序时触发，它通常在设置 `autoSort: false ` 基础属性时使用，以呈现后端的排序，而不是默认的前端排序。

```js
var table = layui.table;
 
// 禁用前端自动排序，以便由服务端直接返回排序好的数据
table.render({
  elem: '#test',
  autoSort: false, // 禁用前端自动排序。
  // … // 其他属性
});
 
// 触发排序事件 
table.on('sort(test)', function(obj){
  console.log(obj.field); // 当前排序的字段名
  console.log(obj.type); // 当前排序类型：desc（降序）、asc（升序）、null（空对象，默认排序）
  console.log(this); // 当前排序的 th 对象
 
  // 尽管我们的 table 自带排序功能，但并没有请求服务端。
  // 有些时候，你可能需要根据当前排序的字段，重新向后端发送请求，从而实现服务端排序，如：
  table.reload('test', {
    initSort: obj, // 记录初始排序，如果不设的话，将无法标记表头的排序状态。
    where: { // 请求参数（注意：这里面的参数可任意定义，并非下面固定的格式）
      field: obj.field, // 排序字段
      order: obj.type // 排序方式
    }
  });
});
```

<h3 id="on-colTool" lay-pid="table.on" class="ws-anchor ws-bold">表头自定义元素工具事件 <sup>2.8.8+</sup></h3>

`table.on('colTool(filter)', callback);`

点击表头单元格中带有 `lay-event` 属性的自定义元素触发，可充分借助该事件扩展 table 更多的操作空间。

```js
var table = layui.table;
 
// 渲染
table.render({
  elem: '#test',
  cols: [[
    {field:'username', title:'用户名 <i class="layui-icon layui-icon-username" lay-event="username"></i>'
  ]]
  // … // 其他属性
});
 
// 表头自定义元素工具事件
table.on('colTool(test)', function(obj){
  var col = obj.col; // 获取当前列属性配置项
  var options = obj.config; // 获取当前表格基础属性配置项
  var layEvent = obj.event; // 获得自定义元素对应的 lay-event 属性值
  console.log(obj); // 查看对象所有成员
});
```

<h3 id="on-colResized" lay-pid="table.on" class="ws-anchor ws-bold">列拖拽宽度后的事件 <sup>2.8+</sup></h3>

`table.on('colResized(filter)', callback);`

在表头列分割线拖拽宽度后触发。

```js
var table = layui.table;
 
// 渲染
table.render({
  elem: '#test',
  // … // 其他属性
});
 
// 列拖拽宽度后的事件
table.on('colResized(test)', function(obj){
  var col = obj.col; // 获取当前列属性配置项
  var options = obj.config; // 获取当前表格基础属性配置项
  console.log(obj); // 查看对象所有成员
});
```

<h3 id="on-colToggled" lay-pid="table.on" class="ws-anchor ws-bold">列筛选（显示或隐藏）后的事件 <sup>2.8+</sup></h3>

`table.on('colToggled(filter)', callback);`

点击头部工具栏右上角的字段筛选列表时触发。

```js
var table = layui.table;
 
// 渲染
table.render({
  elem: '#test',
  // … // 其他属性
});
 
// 列筛选（显示或隐藏）后的事件
table.on('colToggled(test)', function(obj){
  var col = obj.col; // 获取当前列属性配置项
  var options = obj.config; // 获取当前表格基础属性配置项
  console.log(obj); // 查看对象所有成员
});
```


<h3 id="on-row" lay-pid="table.on" class="ws-anchor ws-bold">行单击和双击事件</h3>

- 行单击事件：`table.on('row(filter)', callback);`
- 行双击事件：`table.on('rowDouble(filter)', callback);`

单击或双击 table 行任意区域触发，两者用法相同。<br>
注<sup>2.8.4+</sup>：在 table 模板中或任意内部元素中设置 `lay-unrow` 属性，可阻止该元素执行 `row` 事件

```js
var table = layui.table;
 
// 渲染
table.render({
  elem: '#test',
  // … // 其他属性
});
 
// 行单击事件
table.on('row(test)', function(obj){
  var data = obj.data; // 得到当前行数据
  var dataCache = obj.dataCache; // 得到当前行缓存数据，包含特定字段 --- 2.8.8+
  var index = obj.index; // 得到当前行索引
  var tr = obj.tr; // 得到当前行 <tr> 元素的 jQuery 对象
  var options = obj.config; // 获取当前表格基础属性配置项
  console.log(obj); // 查看对象所有成员
  
  // obj.del() // 删除当前行
  // obj.update(fields, related);  // 修改行数据
  // obj.setRowChecked(opts); // 设置行选中状态
});
```

<h3 id="on-rowContextmenu" lay-pid="table.on" class="ws-anchor ws-bold">行右键菜单事件  <sup>2.8+</sup></h3>

`table.on('rowContextmenu(filter)', callback);`

右键单击行时触发。

<pre class="layui-code" lay-options="{preview: true, codeStyle: 'height: 508px;', layout: ['code', 'preview'], tools: ['full'], toolsEvent: function(oi, type){
  if(type === 'full'){
    layui.table.resize('ID-table-onrowContextmenu');
  }
}}">
  <textarea>
{{- d.include("/table/examples/onrowContextmenu.md") }}
  </textarea>
</pre>

<h3 id="on-edit" lay-pid="table.on" class="ws-anchor ws-bold">单元格编辑事件</h3>

`table.on('edit(filter)', callback);`

单元格被编辑，且值发生改变时触发。

```js
var table = layui.table;
var layer = layui.layer;
 
// 单元格编辑事件
table.on('edit(test)', function(obj){
  var field = obj.field; // 得到修改的字段
  var value = obj.value // 得到修改后的值
  var oldValue = obj.oldValue // 得到修改前的值 -- v2.8.0 新增
  var data = obj.data // 得到所在行所有键值
  var col = obj.getCol(); // 得到当前列的表头配置属性 -- v2.8.0 新增
  console.log(obj); // 查看对象所有成员
  
  // 值的校验
  if(value.replace(/\s/g, '') === ''){
    layer.tips('值不能为空', this, {tips: 1});
    return obj.reedit(); // 重新编辑 -- v2.8.0 新增
  }

  // 编辑后续操作，如提交更新请求，以完成真实的数据更新
  // …
  
  // 更新当前缓存数据
  var update = {};
  update[field] = value;
  obj.update(update, true); // 参数 true 为 v2.7 新增功能，即同步更新其他包含自定义模板并可能存在关联的列视图
});

```


<h3 id="on-tool" lay-pid="table.on" class="ws-anchor ws-bold">单元格工具事件</h3>

- 单元格工具事件「单击触发」： `table.on('tool(filter)', callback);`
- 单元格工具事件「双击触发」： `table.on('toolDouble(filter)', callback);`

单击或双击单元格中带有 `lay-event=""` 属性的元素时触发。在表格主体的单元格中，经常需要进行很多的动态操作，比如编辑、删除等操作，这些均可以在单元格工具事件中完成。

{{!
```html
<!-- 表头某列 templet 属性指向的模板 -->
<script type="text/html" id="toolEventDemo">
  <a class="layui-btn layui-btn-xs" lay-event="detail">查看</a>
  <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>
  <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">删除</a>
  
  <!-- 支持任意的 laytpl 组件语法，如： -->
  {{# if(d.auth > 2){ }}
    <a class="layui-btn layui-btn-xs" lay-event="check">审核</a>
  {{# } }}
</script>
 
<table id="test" lay-filter="test"></table> 
 
<!-- import layui -->
<script>
layui.use(function(){
  var table = layui.table;

  // 渲染
  table.render({
    elem: '#test',
    cols: [[
      {title: '操作', width: 200, templet: '#toolEventDemo'}
    ]]
    // … // 其他属性
  });

  // 单元格工具事件
  table.on('tool(test)', function(obj){
    var data = obj.data; // 得到当前行数据
    var dataCache = obj.dataCache; // 得到当前行缓存数据，包含特定字段 --- 2.8.8+
    var index = obj.index; // 得到当前行索引
    var layEvent = obj.event; // 获得元素对应的 lay-event 属性值
    var tr = obj.tr; // 得到当前行 <tr> 元素的 jQuery 对象
    var options = obj.config; // 获取当前表格基础属性配置项
    var col = obj.getCol(); // 得到当前列的表头配置属性 -- v2.8.3 新增
    console.log(obj); // 查看对象所有成员
    
    // 根据 lay-event 的值执行不同操作
    if(layEvent === 'detail'){ //查看
      // do somehing
    } else if(layEvent === 'del'){ //删除
      layer.confirm('确定删除吗？', function(index){
        obj.del(); // 删除对应行（tr）的 DOM 结构，并更新缓存
        layer.close(index);
        
        // 向后端发送删除请求，执行完毕后，可通过 reloadData 方法完成数据重载
        /*
        table.reloadData(id, {
          scrollPos: 'fixed'  // 保持滚动条位置不变 - v2.7.3 新增
        });
        */
      });
    } else if(layEvent === 'edit'){ //编辑
      // do something
      
      // 同步更新缓存对应的值
      // 该方法仅为前端层面的临时更新，在实际业务中需提交后端请求完成真实的数据更新。
      obj.update({
        username: '123',
        title: 'abc'
      }); 
      // 若需更新其他包含自定义模板并可能存在关联的列视图，可在第二个参数传入 true
      obj.update({
        username: '123'
      }, true); // 注：参数二传入 true 功能为 v2.7.4 新增

   
      // 当发送后端请求成功后，可再通过 reloadData 方法完成数据重载
      /*
      table.reloadData(id, {
        scrollPos: 'fixed'  // 保持滚动条位置不变 - v2.7.3 新增
      });
      */
    }
  });

});
</script> 
```
!}}

<h3 id="on-checkbox" lay-pid="table.on" class="ws-anchor ws-bold">复选框事件</h3>

`table.on('checkbox(filter)', callback);`

当 table 开启复选框，且点击复选框时触发。

```js
var table = layui.table;
 
// 复选框事件
table.on('checkbox(test)', function(obj){
  console.log(obj); // 查看对象所有成员
  console.log(obj.checked); // 当前是否选中状态
  console.log(obj.data); // 选中行的相关数据
  console.log(obj.type); // 若触发的是全选，则为：all；若触发的是单选，则为：one
});
```


<h3 id="on-radio" lay-pid="table.on" class="ws-anchor ws-bold">单选框事件</h3>

`table.on('radio(filter)', callback);`

当 table 开启单选框，且点击单选框时触发。

```js
var table = layui.table;
 
// 单选框事件
table.on('radio(test)', function(obj){
  console.log(obj); // 当前行的一些常用操作集合
  console.log(obj.checked); // 当前是否选中状态
  console.log(obj.data); // 选中行的相关数据
});
```


<h3 id="on-pagebar" lay-pid="table.on" class="ws-anchor ws-bold">尾部分页栏事件 <sup>2.7+</sup></h3>

`table.on('pagebar(filter)', callback);`

点击尾部分页栏自定义模板中属性为 `lay-event=""` 的元素时触发。用法跟 toolbar 完全一致。

```js
var table = layui.table;
 
// 渲染
table.render({
  elem: '#demo',
  pagebar: '#pagebarDemo' // 分页栏模板所在的选择器
  // … // 其他参数
});
 
// 分页栏事件
table.on('pagebar(test)', function(obj){
  console.log(obj); // 查看对象所有成员
  console.log(obj.config); // 当前实例的配置信息
  console.log(obj.event); // 属性 lay-event 对应的值
});
```

## 小贴士

若表头数量太多及每页呈现的数据量太大，为了性能考虑，建议采用 [静态表格](#demo-static) 渲染，配合 [laypage](../laypage/#options) 组件实现分页。





