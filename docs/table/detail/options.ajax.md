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
<td>url</td>
<td>

发送异步请求的 URL。默认会自动传递两个参数：`?page=1&limit=30`（该参数可通过 `request` 属性自定义）
<br>`page` 代表当前页码、`limit` 代表每页数据条数。

</td>
    </tr>
    <tr>
<td>method</td>
<td>

请求的方式，默认：`get`

</td>
    </tr>
    <tr>
<td>where</td>
<td>

请求的其他参数。如：`where: {token: 'sasasas', id: 123}`

</td>
    </tr>
    <tr>
<td>headers</td>
<td>

请求的数据头参数。如：`headers: {token: 'sasasas'}`

</td>
    </tr>
    <tr>
<td>contentType</td>
<td>

请求的内容编码类型。若要发送 `json` 内容，可设置：<br>
`contentType: 'application/json'`

</td>
    </tr>
    <tr>
<td>dataType <sup>2.7+</sup></td>
<td>

请求的数据类型，默认 `json`。

</td>
    </tr>
    <tr>
<td>jsonpCallback <sup>2.7+</sup></td>
<td>

设置当 `dataType: 'jsonp'` 时的回调函数名。

</td>
    </tr>
    <tr>
<td>request</td>
<td>

用于对默认的分页相关的请求参数 `page,limit` 重新设定名称。如：

```
request: {
  pageName: 'curr', // 页码的参数名称，默认：page
  limitName: 'nums' // 每页数据条数的参数名，默认：limit
}
```

那么请求数据时的参数将会变为 `?curr=1&nums=30`

</td>
    </tr>
    <tr>
<td>

[**parseData**](#options.parseData)

</td>
<td>

<div class="ws-anchor" id="options.parseData">
  数据格式解析的回调函数，用于将返回的任意数据格式解析成 table 组件规定的数据格式：
</div>

```
{
  "code": 0,
  "msg": "",
  "count": 1000,
  "data": [{}, {}]
} 
```

很多时候，您接口返回的数据格式并不一定都符合 table 默认规定的格式，比如：

```
{
  "status": 0,
  "message": "", 
  "total": 180, 
  "data": {
    "item": [{}, {}]
  }
}
```

此时我们可以借助 `parseData` 回调函数将数据解析并转换为默认规定的格式：

```
table.render({
  elem: '',
  url: '',
  parseData: function(res){ // res 即为原始返回的数据
    return {
      "code": res.status, // 解析接口状态
      "msg": res.message, // 解析提示文本
      "count": res.total, // 解析数据长度
      "data": res.data.item // 解析数据列表
    };
  },
  // … //其他参数
}); 
```

该函数非常实用


</td>
    </tr>
  </tbody>
</table>

<h4 id="data.reserved" class="ws-anchor ws-bold">返回数据中的特定字段</h4>

在返回的数据中，允许规定某些特定字段，以便 table 组件进行相应的特定解析。

| 特定字段名 | 描述 | 读写状态 |
| --- | --- | --- |
| LAY_CHECKED | 当前行的选中状态 | 可读可写 |
| LAY_DISABLED | 当前行是否禁止选择 | 可读可写 |
| LAY_INDEX | 当前行下标。每页重新从零开始计算 | 只读 |
| LAY_NUM | 当前行序号 | 只读 |
| LAY_COL | 当前列的表头属性配置项 | 只读 |

示例一: 在返回的数据中设置特定字段：

```
{
  "code": 0,
  "count": 1000,
  "data": [{},{
    LAY_DISABLED: true
  }]
}
```

示例二: 在模板中读取特定字段示例：

{{!
```
<script type="text/html" id="TPL-demo-xxx">
  当前行下标: {{= d.LAY_INDEX }} 
  当前列的某个表头属性:  {{= d.LAY_COL.field }}
</script>
```
!}}
