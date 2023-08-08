---
title: 树表组件 treeTable
toc: true
---

# 树表组件 <sup title="指在该版本新增的组件">2.8+</sup>

> 树表组件 `treeTable` 是基于 `table` 组件延伸的树形表格组件，支持常见的树组件功能。
> 注意：*该组件不支持 IE8*

<h2 id="examples" lay-toc="{anchor: null}" style="margin-bottom: 0;">示例</h2>

以下所有示例中演示的数据均为「静态模拟数据」，实际使用时换成您的真实接口即可。

<div>
{{- d.include("/treeTable/detail/demo.md") }}
</div>

<p></p>

<h2 id="api" lay-toc="{hot: true, bold: true}">API</h2>

`table` 组件的所有 `API` 均适用于 `treeTable` 组件。在此基础上，`treeTable` 还专门提供了以下方法： 

| API | 描述 |
| --- | --- |
| var treeTable = layui.treeTable; | 获得 `treeTable` 模块。 |
| [treeTable.render(options)](#render) | treeTable 组件渲染，核心方法。 |
| [treeTable.reload(id, options)](#reload) | 树表完整重载。 |
| [treeTable.reloadData(id, options)](#reload) | 树表数据重载。 |
| [treeTable.reloadAsyncNode(id, index)](#reloadAsyncNode) | 重载异步子节点 |
| [treeTable.getData(id, isSimpleData)](#getData) | 获取树表数据。 |
| [treeTable.getNodeById(id, dataId)](#getNodeById) | 获取节点信息集 |
| [treeTable.getNodesByFilter(id, filter, opts)](#getNodesByFilter) | 获取符合过滤规则的节点信息集 |
| [treeTable.getNodeDataByIndex(id, index)](#getNodeDataByIndex)  | 通过行元素对应的 `data-index` 属性获取对应行数据。 |
| [treeTable.updateNode(id, index, data)](#updateNode) | 更新行数据。 |
| [treeTable.removeNode(id, index)](#removeNode)  | 删除行记录。 |
| [treeTable.addNodes(id, opts)](#addNodes) | 新增行记录。 |
| [treeTable.expandNode(id, opts)](#expandNode) | 展开或关闭节点。 |
| [treeTable.expandAll(id, expandFlag)](#expandAll)  | 展开或关闭全部节点。 |
| [treeTable.setRowChecked(id, opts)](#setRowChecked) | 设置行选中状态 |
| [treeTable.checkAllNodes(id, checked)](#checkAllNodes) | 全选或取消全选 |
| [treeTable.on(\'event(filter)\', callback)](#on) | treeTable 相关事件 |

<h3 id="render" lay-toc="{level: 2}">渲染</h3>

`treeTable.render(options);`

- 参数 `options` : 基础属性配置项。[#详见属性](#options)

该组件渲染的使用方式与 `table` 组件完全相同。

<h2 id="options" lay-toc="{level: 2, hot: true}">属性</h2>

`table` 组件的所有基础属性均适用于 `treeTable` 组件。在此基础上，`treeTable` 还专门提供了 `tree` 属性集： 

<div>
{{- d.include("/treeTable/detail/options.md") }}
</div>

<h3 id="reload" lay-toc="{level: 2}">重载</h3>

即对一段已经渲染好的表格重新设置属性并渲染，可分为以下几种重载方式：

| 重载方式 | API |
| --- | --- |
| 完整重载 | treeTable.reload(id, options) |
| 仅数据重载 | treeTable.reloadData(id, options) |

- 参数 `id` : treeTable 渲染时的 id 属性值
- 参数 `options` : 基础属性配置项。[#详见属性](#options)

使用方式与 `table` 组件完全相同，具体用法可参考：[table 重载](../table/#reload)


<h3 id="reloadAsyncNode" class="ws-anchor ws-bold">重载异步子节点</h3>

`treeTable.reloadAsyncNode(id, index)`

- 参数 `id` : treeTable 渲染时的 id 属性值
- 参数 `index` : 节点对应的行下标，一般可通过 `<tr>` 元素的 `data-index` 属性获得

该方法用于在异步模式下，对节点进行重载。

```js
// 渲染
treeTable.render({
  elem: '', // 绑定元素选择器
  id: 'test', // 自定义 id 索引
  async: {
    enable: true // 开启异步加载模式
  }
  // 其他属性 …
});
// 重载子节点
treeTable.reloadAsyncNode('test', 0); // 第一行
```


<h3 id="getData" lay-pid="api" class="ws-anchor ws-bold">获取树表数据</h3>

`treeTable.getData(id, isSimpleData);`

- 参数 `id` : treeTable 渲染时的 id 属性值
- 参数 `isSimpleData` : 是否为简单数据，为 `true` 时返回简单数据结构的数据，否则则为带层级的数据

该方法用于获取表格当前页的全部数据，它对应的是接口返回的原始数据，不包含 `treeTable` 组件内部的特定字段。

```js
// 渲染
treeTable.render({
  elem: '', // 绑定元素选择器
  id: 'test', // 自定义 id 索引
  // 其他属性 …
});
// 获取当前页接口的树表数据
var data = treeTable.getData('test'); // 获取第一行的数据
console.log(data);
```

<h3 id="getNodeById" lay-pid="api" class="ws-anchor ws-bold">获取节点信息集</h3>

`treeTable.getNodeById(id, dataId)`

- 参数 `id` : treeTable 渲染时的 `id` 属性值
- 参数 `dataId` : 数据项的 `id` 属性值

```js
// 渲染
treeTable.render({
  elem: '', // 绑定元素选择器
  id: 'test', // 自定义 id 索引
  // 其他属性 …
});
// 获取节点信息集
var obj = treeTable.getNodeById('test', 1);
console.log(obj);
```

<h3 id="getNodesByFilter" lay-pid="api" class="ws-anchor ws-bold">获取符合过滤规则的节点信息集</h3>

`treeTable.getNodesByFilter(id, filter, opts)`

- 参数 `id` : treeTable 渲染时的 `id` 属性值
- 参数 `filter` : 过滤函数
- 参数 `opts` : 该方法的属性可选项，详见下表：

| 属性名 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| isSingle | 是否只找到第一个 | boolean | `false` |
| parentNode | 在指定在某个父节点下的子节点中搜索 | object | - |

```js
// 渲染
treeTable.render({
  elem: '', // 绑定元素选择器
  id: 'test', // 自定义 id 索引
  // 其他属性 …
});
// 获取节点信息集
var obj = treeTable.getNodesByFilter('test', function(item){
  // 自定义过滤条件
  return item.id > 1000;
});
console.log(obj);
```


<h3 id="getNodeDataByIndex" lay-pid="api" class="ws-anchor ws-bold">获取树表对应下标的数据</h3>

`treeTable.getNodeDataByIndex(id, index);`

- 参数 `id` : treeTable 渲染时的 `id` 属性值
- 参数 `index` : 节点对应的行下标，一般可通过 `<tr>` 元素的 `data-index` 属性获得

该方法用于获取表格当前页对应下表的数据，返回的数据格式同 `treeTable.getData()` 方法。

```js
// 渲染
treeTable.render({
  elem: '', // 绑定元素选择器
  id: 'test', // 自定义 id 索引
  // 其他属性 …
});
// 获取树表对应下标的数据
var obj = treeTable.getNodeDataByIndex('test', 0); // 获取第一行的数据
console.log(obj);
```

<h3 id="updateNode" lay-pid="api" class="ws-anchor ws-bold">更新行数据</h3>

`treeTable.updateNode(id, index, data);`

- 参数 `id` : treeTable 渲染时的 id 属性值
- 参数 `index` : 节点对应的行下标，一般可通过 `<tr>` 元素的 `data-index` 属性获得
- 参数 `data` : 更新的数据项，可包含要更新的各种字段

```js
// 渲染
treeTable.render({
  elem: '', // 绑定元素选择器
  id: 'test', // 自定义 id 索引
  // 其他属性 …
});
// 更新行数据
var data = treeTable.updateNode('test', 0, {  // 更新第一行的数据
  title: '123'
});
```

<h3 id="removeNode" lay-pid="api" class="ws-anchor ws-bold">删除行记录</h3>

`treeTable.removeNode(id, index);`

- 参数 `id` : treeTable 渲染时的 `id` 属性值
- 参数 `index/node` : 要删除的节点数据，也可以是节点对应的行下标（ `data-index`）

```js
// 渲染
treeTable.render({
  elem: '', // 绑定元素选择器
  id: 'test', // 自定义 id 索引
  // 其他属性 …
});
// 删除行记录
treeTable.removeNode('test', 0); // 删除第一行
```


<h3 id="addNodes" lay-pid="api" class="ws-anchor ws-bold">新增行数据</h3>

`treeTable.addNodes(id, opts);`

- 参数 `id` : treeTable 渲染时的 `id` 属性值
- 参数 `opts` : 该方法可支持的可选属性项，详见下表：

| opts | 描述 | 类型 | 默认值 |
| --- | --- | -- | --- |
| parentIndex | 父节点数据下标 | number | - |
| index | 节点对应的行下标。若为 `-1` 表示插入到最后，否则则插入到对应下标。 | number | `-1`|
| data | 新增的节点数据项。若新增的是多个节点，则用数组的形式。若只有一个节点可以是普通对象形式 | object | - |
| focus | 是否聚焦到新增的节点。若存在多个，则聚焦到第一个新增的节点 | boolean | `false` |

该方法可返回新增后的数据项。详细用法可参考：[#示例](#examples)

```js
// 渲染
treeTable.render({
  elem: '', // 绑定元素选择器
  id: 'test', // 自定义 id 索引
  // 其他属性 …
});
// 新增行数据
treeTable.addNodes('test', {
  parentIndex: 0, // 一般在 tool 事件中，可通过对应数据项中的 `LAY_DATA_INDEX` 特定属性获得
  index: 1,
  data: {
    title: '新节点-1'
  }
});
```


<h3 id="expandNode" lay-pid="api" class="ws-anchor ws-bold">展开或关闭节点</h3>

`treeTable.expandNode(id, opts);`

- 参数 `id` : treeTable 渲染时的 `id` 属性值
- 参数 `opts` : 该方法可支持的可选属性项，详见下表：

| opts | 描述 | 类型 | 默认值 |
| --- | --- | -- | --- |
| index | 节点对应的行下标，一般可通过 `<tr>` 元素的 `data-index` 属性获得 | number | - |
| expandFlag | 设置展开或关闭状态，若为 `true` 则表示展开；`false` 则为关闭；`null` 则表示切换 | boolean/null | - |
| inherit | 子节点是否继承父节点的展开或关闭状态，`expandFlag` 属性必须为 `boolean` 型时才有效。 | boolean | `false` |
| callbackFlag | 是否触发事件（`beforeExpand,onExpand`） | boolean | `false` |

若操作的节点不是一个父节点，则返回 `null`，否则返回操作之后的折叠状态。

```js
// 渲染
treeTable.render({
  elem: '', // 绑定元素选择器
  id: 'test', // 自定义 id 索引
  // 其他属性 …
});
// 展开或关闭对应节点
treeTable.expandNode('test', {
  index: 0, // 第一行
  expandFlag: true // 展开
});
```

<h3 id="expandAll" lay-pid="api" class="ws-anchor ws-bold">展开或关闭全部节点</h3>

`treeTable.expandAll(id, expandFlag);`

- 参数 `id` : treeTable 渲染时的 `id` 属性值
- 参数 `expandFlag` : 折叠状态。 `true` 展开；`false` 关闭

```js
// 渲染
treeTable.render({
  elem: '', // 绑定元素选择器
  id: 'test', // 自定义 id 索引
  // 其他属性 …
});
// 展开或关闭全部节点
treeTable.expandAll('test', false); // 关闭全部节点
```

<h3 id="setRowChecked" lay-pid="api" class="ws-anchor ws-bold">设置行选中状态</h3>

`treeTable.setRowChecked(id, opts);`

- 参数 `id` : treeTable 渲染时的 `id` 属性值
- 参数 `opts` : 该方法可支持的可选属性项，详见下表：

| opts | 描述 | 类型 | 默认值 |
| --- | --- | -- | --- |
| index | 要设置选中状态的行下标或行数据 | number/object | - |
| checked | 选中状态。`true` 选中；`false` 取消选中；`null` 切换。 其中，所为 `radio` 框，则不支持 `null`(切换)。 | boolean | - |
| callbackFlag | 是否触发事件，若为 `true`，则 `checked: false` 无效。其对应的事件跟 `table` 的 `radio,checkbox` 事件用法一样 | boolean | `false` |

```js
// 渲染
treeTable.render({
  elem: '', // 绑定元素选择器
  id: 'test', // 自定义 id 索引
  // 其他属性 …
});
// 勾选或取消勾选单个节点
treeTable.setRowChecked('test', {
  index: 0,
  checked: true // 选中
}); 
```

<h3 id="checkAllNodes" lay-pid="api" class="ws-anchor ws-bold">设置全选或取消全选</h3>

`treeTable.checkAllNodes(id, checked);`

- 参数 `id` : treeTable 渲染时的 `id` 属性值
- 参数 `checked` : 选中状态。`true` 选中；`false` 取消选中；`null` 复选框模式时的切换。

```js
// 渲染
treeTable.render({
  elem: '', // 绑定元素选择器
  id: 'test', // 自定义 id 索引
  // 其他属性 …
});
// 勾选或取消勾选单个节点
treeTable.checkAllNodes('test', true);  // 全选 
```


<h3 id="on" lay-toc="{level: 2}">事件</h3>

`treeTable.on('event(filter)', callback);`

`treeTable` 事件继承于 `table` 事件，具体使用方法可参考：[#table 事件](../table/#table.on)


## 贴士

> `treeTable` 基于 `table` 组件扩展而来，因此，熟练运用 `treeTable` 的前提是熟悉 `table` 组件。 亦可通过 `table` 提供的基础 `API` 操作 `treeTable` 组件，但 `treeTable` 无法操作 `table`。