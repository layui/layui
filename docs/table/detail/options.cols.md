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
<td>field</td>
<td>

设置字段名。通常是表格数据列的唯一标识

</td>
<td>string</td>
<td>-</td>
    </tr>
    <tr>
<td>title</td>
<td>

设置列的标题。

</td>
<td>string</td>
<td>-</td>
    </tr>
    <tr>
<td>fieldTitle <sup>2.8+</sup></td>
<td>

设置列的字段标题。该属性在筛选列和导出场景中优先级高于 `title` 属性

</td>
<td>string</td>
<td>-</td>
    </tr>
    <tr>
<td>width</td>
<td>

设置列宽。若不填写，则自动分配；若填写，则支持值为：*数字、百分比*。如：
`width: 200` / `width: '30%'`

</td>
<td>number/string</td>
<td>-</td>
    </tr>
    <tr>
<td>minWidth</td>
<td>

设置当前列的最小宽度，一般用于列宽自动分配的情况。其优先级高于基础属性中的 `cellMinWidth`

</td>
<td>number</td>
<td>
  
`60`

</td>
    </tr>
    <tr>
<td>maxWidth <sup>2.8+</sup></td>
<td>

设置当前列的最大宽度。其优先级高于基础属性中的 `cellMaxWidth`

</td>
<td>number</td>
<td>-</td>
    </tr>
    <tr>
<td>expandedWidth <sup>2.8.14+</sup></td>
<td>

设置单元格被展开后的宽度，默认取表格容器的三分之一宽度。若设置的值的小于当前列宽，则展开后的列宽保持不变。

</td>
<td>number</td>
<td>-</td>
    </tr>
    <tr>
<td>type</td>
<td>

设置列类型。可选值有：
- `normal` 常规列，无需设定
- `checkbox` 复选框列
- `radio` 单选框列
- `numbers` 序号列
- `space` 空列

</td>
<td>string</td>
<td>
  
`normal`

</td>
    </tr>
    <tr>
<td>LAY_CHECKED</td>
<td>

设置全选状态，当列设置 `type: 'checkbox'` 时才有效。

</td>
<td>boolean</td>
<td>
  
`false`

</td>
    </tr>
    <tr>
<td>fixed</td>
<td>

设置固定列，即不跟随 table 横向滚动条而滚动。可选值有：
- `left` 固定在左 
- `right` 固定在右

</td>
<td>string</td>
<td>-</td>
    </tr>
    <tr>
<td>
  
[templet](#cols.templet)

</td>
<td colspan="3">

<div class="ws-anchor" id="cols.templet">
  设置列的自定义模板，核心属性。模板遵循 <a href="../laytpl/" target="_blank">laytpl</a> 组件语法。
</div>

 `templet` 提供了三种使用方式，选择任一用法即可：

- **设置模版选择器**

{{!
```
<script type="text/html" id="TPL-demo-title">
  <a href="/detail/{{= d.id }}" class="layui-table-link">
    {{= d.title }} 
  </a>
</script>
 
<!-- 
模板中的 `d` 不仅包含当前行数据，还包含特定字段，如：
{{= d.LAY_INDEX }} {{= d.LAY_COL }} 等 
-->
```

```
table.render({
  cols: [[
    {field: 'title', templet: '#TPL-demo-title'}
    // …
  ]],
  // …
});
```
!}}

- **设置模板内容**

该方式必须在内容中包裹一层 `<div></div>`，否则无法读取模板。

{{!
```
table.render({
  cols: [[
    {field: 'title', templet: '<div><a href="/detail/{{= d.id }}" class="layui-table-link">{{= d.title }}</a></div>'}
    // …
  ]],
  // …
});
```
!}}

- **设置模板函数**

函数将返回一个 `d` 参数，包含当前行数据及特定的额外字段。
```
table.render({
  cols: [[
    {field: 'title', templet: function(d){
      console.log(d); // 得到当前行数据
      console.log(this); // 得到表头当前列配置项
      console.log(d.LAY_NUM); // 得到序号。或其他特定字段
      
      // 返回模板内容
      return '<a href="/detail/'+ d.id +'" class="layui-table-link">'+ d.title +'</a>'
    }}
    // …
  ]],
  // …
});
```

</td>
    </tr>
    <tr>
<td>exportTemplet <sup>2.6.9+</sup></td>
<td colspan="3">

<div class="ws-anchor" id="cols.exportTemplet">

设置表格导出时的模板，用法同 `templet` 属性。当 `templet` 指向的模板内容较复杂时建议使用，如下以模板存在 `select` 元素为例：

</div>

```
exportTemplet: function(d, obj){
  // 当前 td
  var td = obj.td(this.field);
  // 返回 select 选中值
  return td.find('select').val();
}
```

</td>
    </tr>
    <tr>
<td>
  
  [totalRow](#cols.totalRow)

</td>
<td colspan="3">

<div class="ws-anchor" id="cols.totalRow">
  是否开启该列的自动合计功能，默认不开启。
</div>

- **采用前端合计**

{{!
```
// 开启并输出合计行前端合计结果
totalRow: true

// 开启并输出合计行自定义模板。此处 TOTAL_NUMS 即为合计结果的固定特定字段
totalRow: '{{= d.TOTAL_NUMS }} 单位' 
// 取整或其他运算
totalRow: '{{= parseInt(d.TOTAL_NUMS) }}'
```
!}}

注意：*合计行模板仅支持字符写法，不支持函数写法，请勿与 `templet` 用法混淆。*

- **采用后端合计**

前端合计的数据有限，因此常需要后端直接返回合计结果，组件将优先读取。数据格式如下：

```
{
  "code": 0,
  "totalRow": {
    "score": "777",
    "experience": "999"
  },
  "data": [{}, {}],
  "msg": "",
  "count": 1000
}
```

在合计行自定义模板中输出后端返回的合计数据

{{!
```
// 获取后端接口返回数据中的统计字段。此处 TOTAL_ROW 即对应返回据中的 totalRow
totalRow: '分数：{{= d.TOTAL_ROW.score }}'
```
!}}

如上，在 `totalRow` 中返回所需统计的列字段名和值即可。
`totalRow` 字段同样可以通过 `parseData` 回调来解析成为 table 组件所规定的数据格式。


</td>
    </tr>
    <tr>
<td>
  
[edit](#cols.edit)

</td>
<td>

<div class="ws-anchor" id="cols.edit">
  用于对列所在的单元格开启编辑功能。可选值有：
</div>

- `edit: 'text'` 单行输入模式
- `edit: 'textarea'` 多行输入模式 <sup>2.7+</sup>

**函数写法** <sup>2.7+</sup>

```
edit: function(d){
  // d 即为当前行数据，此时可根据行相关字段来开启该行是否编辑的权限
  if(d.editable){ // editable 为任意字段名
    return 'text'; // 编辑模式
  }
}
```


</td>
<td>string<br>function</td>
<td>
  
`false`

</td>
    </tr>
    <tr>
<td>hide</td>
<td>

是否初始隐藏列

</td>
<td>boolean</td>
<td>
  
`false`

</td>
    </tr>
    <tr>
<td>ignoreExport <sup>2.8.3+</sup></td>
<td>

是否导出时忽略该列。支持以下可选值：

- `true` : 忽略导出
- `false` : 强制导出，对所有列适用
- `null` : 只对常规列导出（默认）

</td>
<td>boolean</td>
<td>
  
-

</td>
    </tr>
    <tr>
<td>escape</td>
<td>

是否对当前列进行内容编码（转义 html），优先级大于基础属性中的 `escape`。

</td>
<td>boolean</td>
<td>
  
`true`

</td>
    </tr>
    <tr>
<td>sort</td>
<td>

是否开启列的排序功能。<br>
注意：<em>不推荐对值同时存在“数字和普通字符”的列开启排序，因为会进入字典序排序计算中</em>，如：`'张三' > '2' > '100'`，这可能并不是你想要的结果，但字典序排列采用的是 `ASCII` 码比对。

</td>
<td>boolean</td>
<td>
  
`false`

</td>
    </tr>
    <tr>
<td>unresize</td>
<td>

是否禁用拖拽列宽。默认情况下会根据列类型 `type` 属性来决定是否禁用，如复选框列，会自动禁用。而其它普通列，默认允许拖拽列宽，当然你也可以设置 true 来禁用该功能。

</td>
<td>boolean</td>
<td>
  
`false`

</td>
    </tr>
    <tr>
<td>event</td>
<td>

自定义单元格点击事件名，以便在 [单元格工具事件](#on-tool) 中完成对该单元格的事件处理。

</td>
<td>string</td>
<td>-</td>
    </tr>
    <tr>
<td>style</td>
<td>

自定义单元格样式。可传入任意的 CSS 内容，如：`style: 'font-size: 13px; color: red;'`

</td>
<td>string</td>
<td>-</td>
    </tr>
    <tr>
<td>align</td>
<td>

单元格排列方式。可选值有：`left` | `center` | `right`

</td>
<td>string</td>
<td>
  
`left`

</td>
    </tr>
    <tr>
<td>colspan</td>
<td>

单元格所占列数。一般用于多级表头

</td>
<td>number</td>
<td>
  
`1`

</td>
    </tr>
    <tr>
<td>rowspan</td>
<td>

单元格所占行数。一般用于多级表头

</td>
<td>number</td>
<td>
  
`1`

</td>
    </tr>
  </tbody>
</table>