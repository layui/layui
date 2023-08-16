<table class="layui-table">
  <colgroup>
    <col width="150">
    <col>
    <col width="100">
    <col width="100">
  </colgroup>
  <thead>
    <tr>
      <th>属性名</th>
      <th>描述</th>
      <th>类型</th>
      <th>默认值</th>
    </tr> 
  </thead>
  <tbody>
    <tr>
<td>elem</td>
<td>
  
绑定元素选择器

</td>
<td>string/DOM</td>
<td>-</td>
    </tr>
    <tr>
<td>data</td>
<td>
  
`tree` 的数据源。其格式详见：[#data 格式](#options.data)

</td>
<td>array</td>
<td>-</td>
    </tr>
    <tr>
<td>id</td>
<td>
  
设置实例唯一索引，用于其他方法传参使用。

</td>
<td>string</td>
<td>-</td>
    </tr>
    <tr>
<td>showCheckbox</td>
<td>
  
是否显示复选框

</td>
<td>boolean</td>
<td>

`false`

</td>
    </tr>
    <tr>
<td>edit</td>
<td>
  
是否开启节点的右侧操作图标。支持以下可选值：

- 若为 `true`，则默认显示「改删」图标
- 若为 数组，则可自由配置操作图标，如：`edit:['add', 'update', 'del']` ，且图标将按照数组的顺序显示。

</td>
<td>boolean<br>array</td>
<td>

`false`

</td>
    </tr>
    <tr>
<td>accordion</td>
<td>
  
是否开启手风琴模式

</td>
<td>boolean</td>
<td>

`false`

</td>
    </tr>
    <tr>
<td>onlyIconControl</td>
<td>
  
是否仅允许节点左侧图标控制展开伸缩。 

- 默认为 `false`，即点击节点本身也可控制伸缩
- 若值为 `true`，则只能通过节点左侧图标来展开收缩

</td>
<td>boolean</td>
<td>

`false`

</td>
    </tr>
    <tr>
<td>isJump</td>
<td>
  
是否允许点击节点时弹出新窗口跳转。若为 `true`，则需在对应的 data 中设定 href 属性（url 格式）

</td>
<td>boolean</td>
<td>

`false`

</td>
    </tr>
    <tr>
<td>showLine</td>
<td>
  
是否开启节点连接线。若设为 `false`，则节点左侧出现三角图标。

</td>
<td>boolean</td>
<td>

`true`

</td>
    </tr>
    <tr>
<td>

[customName](#options.customName) <sup>2.8.14+</sup>

</td>
<td>

自定义 `data` 数据源中常用的字段名称。

</td>
<td>object</td>
<td>-</td>
    </tr>
    <tr>
<td>text</td>
<td colspan="3">
  
自定义默认文本，`object` 类型。支持以下属性：

```
text: {
  defaultNodeName: '未命名', // 节点默认名称
  none: '无数据' // 数据为空时的提示文本
}  
```

</td>
    </tr>
    <tr>
<td colspan="4" style="text-align: center"> 


<div id="options.callback" lay-pid="options" class="ws-anchor">

[回调函数](#options.callback)

</div>

</td>
    </tr>
    <tr>
<td>click</td>
<td colspan="3">
  
<div id="options.click" lay-pid="options" class="ws-anchor">
  节点被点击的回调函数。返回的参数如下：
</div>

```
click: function(obj){
  console.log(obj.data); // 得到当前点击的节点数据
  console.log(obj.state); // 得到当前节点的展开状态：open、close、normal
  console.log(obj.elem); // 得到当前节点元素
  
  console.log(obj.data.children); // 当前节点下是否有子节点
}
```

</td>
    </tr>
    <tr>
<td>oncheck</td>
<td colspan="3">

<div id="options.oncheck" lay-pid="options" class="ws-anchor">  
  点击复选框时的回调函数，返回的参数如下：
</div>

```
oncheck: function(obj){
  console.log(obj.data); // 得到当前点击的节点数据
  console.log(obj.checked); // 节点是否被选中
  console.log(obj.elem); // 得到当前节点元素
}
```

</td>
    </tr>
    <tr>
<td>operate</td>
<td colspan="3">

<div id="options.operate" lay-pid="options" class="ws-anchor">  
  点击节点的右侧操作图标的回调函数，返回的参数如下：
</div>

```  
operate: function(obj){
  var type = obj.type; // 得到操作类型：add、edit、del
  var data = obj.data; // 得到当前节点的数据
  var elem = obj.elem; // 得到当前节点元素
  
  // Ajax 操作
  var id = data.id; // 得到节点索引
  if(type === 'add'){ // 增加节点
    //返回 key 值
    return 123;
  } else if(type === 'update'){ // 修改节点
    console.log(elem.find('.layui-tree-txt').html()); // 得到修改后的内容
  } else if(type === 'del'){ // 删除节点
    // …
  };
}
```

</td>
    </tr>
  </tbody>
</table>