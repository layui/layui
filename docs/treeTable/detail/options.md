<table class="layui-table">
  <colgroup>
    <col width="150">
    <col>
  </colgroup>
  <thead>
    <tr>
      <th>属性名</th>
      <th>描述</th>
    </tr> 
  </thead>
  <tbody>
    <tr>
<td>tree</td>
<td>
  
treeTable 组件的特定属性集，包含以下「子成员集」：

| 属性 | 描述 |
| --- | --- |
| [customName](#options.tree.customName) | 自定义属性名的集合 |
| [view](#options.tree.view) | 视图相关的属性集合 |
| [data](#options.tree.data) | 数据相关的属性集合 |
| [async](#options.tree.async) | 异步相关的属性集合 |
| [callback](#options.tree.callback) | 事件回调相关的属性集合 |

用法如下：

```js
treeTable.render({
  elem: '',
  tree: { // treeTable 特定属性集
    customName: {},
    data: {},
    view: {},
    async: {},
    callback: {}
  },
  // 其他 table 属性
});
````

</td>
    </tr>
    <tr>
<td>tree.customName</td>
<td>

<div id="options.tree.customName" lay-pid="options" class="ws-anchor">

自定义属性名的集合，包含以下成员：

</div>

| 属性 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| children | 自定义「子节点集合」的属性名 | string | `children` |
| isParent | 自定义「是否属于父节点」的属性名 | string | `isParent` |
| name | 自定义「节点」属性名 | string | `name` |
| id | 自定义「节点索引」属性名 | string | `id` |
| pid | 自定义「父节点索引」属性名 | string | `parentId` |
| icon | 自定义图标的属性名称 | string | `icon` |

</td>
    </tr>
    <tr>
<td>tree.view</td>
<td>

<div id="options.tree.view" lay-pid="options" class="ws-anchor">

视图相关的属性集合，包含以下成员：

</div>

| 属性 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| indent | 层级缩进量 | number | `14` |
| flexIconClose | 关闭时的折叠图标 | string | - |
| flexIconOpen | 打开时的折叠图标 | string | - |
| showIcon | 是否显示节点图标 | boolean | `true` |
| icon | 自定义节点图标。若设置了该属性或数据中有该字段信息，不管打开还是关闭都以这个图标的值为准 | string | - |
| iconClose | 自定义关闭时的节点图标 | string | - |
| iconOpen | 自定义打开时的节点图标 | string | - |
| iconLeaf | 叶子节点的图标 | string | - |
| showFlexIconIfNotParent | 若非父节点时，是否显示折叠图标 | boolean | `false` |
| dblClickExpand | 双击节点时，是否自动展开父节点 | boolean | `true` |
| expandAllDefault <sup>2.8.7+</sup> | 是否默认展开全部节点 | boolean | `false` |

</td>
    </tr>
    <tr>
<td>tree.data</td>
<td>

<div id="options.tree.data" lay-pid="options" class="ws-anchor">

数据相关的属性集合，包含以下成员：

</div>

| 属性 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| isSimpleData | 是否简单数据模式 | boolean | `false` |
| rootPid | 用于设置根节点的 `pid` 属性值 | string | `null` |
| cascade | 用于设置复选的级联方式。支持以下可选值：<ul><li><code>all</code> : 所有节点联动</li><li><code>parent</code> : 仅对父节点联动</li><li><code>children</code> : 仅对子节点联动</li><li><code>none</code> <sup>2.8.16+</sup> : 不做任何联动</li></ul> | string | `all` |

</td>
    </tr>
    <tr>
<td>tree.async</td>
<td>

<div id="options.tree.async" lay-pid="options" class="ws-anchor">

异步相关的属性集合，包含以下成员：

</div>

| 属性 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| enable | 是否开启异步加载模式。只有开启时 `async` 的其他属性配置才有效。 **注意：** 异步加载子节点不应跟 `simpleData` 同时开启，可以是 `url+simpleData` 的方式，获取完整的简单数据进行转换。若开启异步加载模式，即表示按需异步加载子节点。 | boolean | `false` |
| url | 异步加载的接口，可以根据需要设置与顶层接口不同的接口，若相同可不设置该属性 | string | - |
| [format](#options.tree.async.format) | 用于处理异步子节点数据的回调函数，该属性优先级高于 `async.url` 属性。用法详见下文。 | function | - |
| type | 请求的接口类型，设置可缺省同上 | string | - |
| contentType | 提交参数的数据类型，设置可缺省同上 | string | - |
| headers | 提交请求头，设置可缺省同上 | object | - |
| where | 提交参数的数据，设置可缺省同上 | object | - |
| autoParam | 自动参数，可以根据配置项以及当前节点的数据传参，如： `['type', 'age=age', 'parentId=id']` ，那么其请求参数将包含: `{type: '父节点 type', age: '父节点 age', parentId: '父节点 id'}` | array | - |

<div id="options.tree.async.format" class="ws-anchor">

**format 示例** ：

</div>

```
treeTable.render({
  elem: '',
  tree: {
    enable: true,
    async: {
      format: function(trData, options, callback){
        // trData 为行数据、options 为 treeTable 属性配置项
        // callbacck 为子节点的渲染函数
        // 可利用该函数对子节点数据进行异步请求或其他格式化处理
        var nodeList = [
          {id: 111, name: '子节点1'},
          {id: 333, name: '子节点3'}
        ];
        callback(nodeList);
      }
    }
  }
})
```

</td>
    </tr>
    <tr>
<td>tree.callback</td>
<td>

<div id="options.tree.callback" lay-pid="options" class="ws-anchor">

事件回调相关的属性集合，包含以下成员：

</div>

| 属性 | 描述 |
| --- | --- | 
| beforeExpand | 展开前回调函数。可以在展开或者关闭之前调用，传入当前表格 `id` ，当前操作的行数据以及要展开或关闭的状态，若回调返回 `false` 则取消该次操作。 返回的参数包含： `function(tableId, trData, expandFlag){ console.log(arguments); }` |
| onExpand | 展开或关闭后的回调函数，返回参数同 `beforeExpand` |

</td>
    </tr>
  </tbody>
</table>
