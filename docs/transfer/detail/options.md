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
  
绑定元素选择器或 DOM 对象

</td>
<td>string/DOM</td>
<td>-</td>
    </tr>
    <tr>
<td>title</td>
<td>
  
穿梭框左右面板头部标题

</td>
<td>array</td>
<td>

<button class="layui-btn layui-btn-sm layui-btn-primary" lay-layer="{
  title: 'title 属性默认值',
  content: '<div>title: [\'列表一\',\'列表二\']</div>'
}">查看默认值</button>

</td>
    </tr>
    <tr>
<td>data</td>
<td>
  
穿梭框的数据源。格式详见：[#data 格式](#options.data)

</td>
<td>array</td>
<td>-</td>
    </tr>
    <tr>
<td>value</td>
<td>
  
初始选中的数据（右侧列表）

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
<td>showSearch</td>
<td>
  
是否开启搜索。支持以下可选值：

- `false` 不开启搜索（默认）
- `true` 开启搜索，且匹配时不区分大小写
- `cs` 开启搜索，且匹配时区分大小写 <sup>2.7+</sup>

</td>
<td>boolean<br>string</td>
<td>

`false`

</td>
    </tr>
    <tr>
<td>width</td>
<td>
  
定义左右穿梭框宽度

</td>
<td>number</td>
<td>

`200`

</td>
    </tr>
    <tr>
<td>height</td>
<td>
  
定义左右穿梭框高度

</td>
<td>number</td>
<td>

`360`

</td>
    </tr>
    <tr>
<td>text</td>
<td colspan="3">
  
自定义默认文本， `object` 类型。支持以下属性：

```
text: {
  none: '无数据', // 没有数据时的文案
  searchNone: '无匹配数据' // 搜索无匹配数据时的文案
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
<td>onchange</td>
<td>
  
左右穿梭时的回调函数。返回的参数如下：

```
onchange: function(data, index){
  console.log(data); // 得到当前被穿梭的数据
  console.log(index); // 如果数据来自左边，index 为 0，否则为 1
}
```

</td>
<td>boolean</td>
<td>

`false`

</td>
    </tr>
    <tr>
<td>
  
[parseData](#options.parseData)

</td>
<td colspan="3">
  
<div id="options.parseData" lay-pid="options" class="ws-anchor">
数据格式解析的回调函数，用于将返回的任意数据格式解析成 transfer 组件规定的 <a href="#options.data">data 格式</a>
</div>

```
transfer.render({
  elem: '',
  data: [ // 任意数据
    {"id": "1", "name": "李白"},
    {"id": "2", "name": "杜甫"},
    {"id": "3", "name": "贤心"}
  ],
  parseData: function(res){ // 解析成规定的 data 格式
    return {
      "value": res.id, // 数据值
      "title": res.name, // 数据标题
      "disabled": res.disabled,  // 是否禁用
      "checked": res.checked // 是否选中
    };
  }
});
```

</td>
    </tr>
  </tbody>
</table>