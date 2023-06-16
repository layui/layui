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
<td>绑定原始 table 元素，方法渲染方式必填。</td>
<td>string/DOM</td>
<td>-</td>
    </tr>
    <tr>
<td>

[url](#options.ajax)

</td>
<td>

发送异步请求的 URL。更多异步相关属性见 : [#异步属性](#options.ajax)

</td>
<td>-</td>
<td>-</td>
    </tr>
    <tr>
<td>
  
[cols](#options.cols)

</td>
<td>
  
表头属性集，通过二维数组定义多级表头。方法渲染时必填。 更多表头属性见 : [#表头属性](#options.cols)

</td>
<td>array</td>
<td>-</td>
    </tr>
    <tr>
      <td>data</td>
<td>

直接赋值数据。既适用于只展示一页数据，也能对一段已知数据进行多页展示。该属性与 `url` 属性只能二选一。

<hr>

**注**：当设置 `data` 模式时，`count` 的值取 `data.length`，即对一段已知数据进行分页展示。 此时在 `page` 属性中设置 `count` 无效。 若要在同一页显示所有数据，可将 `limit` 设置成 `data.length`，即与 `count` 等同即可，那么默认的分页栏只会显示 1 页，若要自定义分页结构，可通过 `pagebar` 属性结合 `laypage` 组件来重新自定义分页排版。

</td>
      <td>array</td>
      <td>-</td>
    </tr>
    <tr>
      <td>id</td>
<td>
  
设定实例唯一索引，以便用于其他方法对 table 实例进行相关操作。若该属性未设置，则默认从 `elem` 属性绑定的原始 table 元素中的 `id` 属性值中获取。

</td>
<td>string</td>
<td>-</td>
    </tr>
    <tr>
<td>toolbar</td>
<td>

开启表格头部工具栏。支持以下几种值写法：

- `toolbar: '#template-id'`  自定义工具栏模板选择器
- `toolbar: '<div>xxx</div>` 直接传入模板字符
- `toolbar: true` 仅开启工具栏右侧，不显示左侧模板
- `toolbar: 'default'` 开启工具栏并显示默认模板

</td>
<td>string<br>boolean</td>
<td>

`false`

</td>
    </tr>
    <tr>
<td>defaultToolbar</td>
<td>

设置头部工具栏右侧图标。值是一个数组，可选成员有: `filter,exports,print` （分别代表：筛选图标、导出图标、打印图标）。图标可根据数组值的顺序排列，如：`defaultToolbar: ['filter','print','exports']` <br>支持自定义图标及事件，用法详见示例: [#综合演示](#examples)

</td>
<td>array</td>
<td>-</td>
    </tr>
    <tr>
<td>width</td>
<td>设置容器宽度，默认自适应。</td>
<td>number</td>
<td>-</td>
    </tr>
    <tr>
<td>
  
[height](#options.height)

</td>
<td>

<div class="ws-anchor" id="options.height">
  设置表格容器高度，默认自适应。其他可选值的规则如下：
</div>

- `height: 315` 设置固定高度
- `height: 'full-30'` 设置自适应高度。这是一个特定的语法格式：`full` 表示铺满；后面的数字表示当前 table 之外的元素占用的高度，如：表格头部到页面最顶部*加*表格底部距离页面最底部的“距离和”
- `height: '#id-30'` 设置相对父元素的高度自适应，其中 `#id` 即父元素的 ID 选择器，其计算原理和上述 `full` 相同。

</td>
<td>number<br>string</td>
<td>-</td>
    </tr>
    <tr>
<td>maxHeight <sup>2.8+</sup></td>
<td>

设置表格容器的最大高度，设置该属性后，`height` 属性将被认定为默认的自适应值。

</td>
<td>number</td>
<td>-</td>
    </tr>
    <tr>
<td>cellMinWidth</td>
<td>

设置所有普通单元格的最小宽度，一般用于列宽自动分配的情况。其优先级低于表头属性中的 `minWidth`

</td>
<td>number</td>
<td>

`60`

</td>
    </tr>
    <tr>
<td>cellMaxWidth <sup>2.8+</sup></td>
<td>

设置所有普通单元格的最大宽度。其优先级低于表头属性中的 `maxWidth`

</td>
<td>number</td>
<td>-</td>
    </tr>
    <tr>
<td>lineStyle <sup>2.7+</sup></td>
<td>

用于定义表格的多行样式，如每行的高度等。该参数一旦设置，单元格将会开启多行模式，且鼠标 hover 时会通过显示滚动条的方式查看到更多内容。 请按实际场景使用。<br>示例：`lineStyle: 'height: 95px;'`

</td>
<td>string</td>
<td>-</td>
    </tr>
    <tr>
<td>className <sup>2.7+</sup></td>
<td>用于给表格主容器追加 css 类名，以便更好地扩展表格样式</td>
<td>string</td>
<td>-</td>
    </tr>
    <tr>
<td>css <sup>2.7+</sup></td>
<td>

用于给当前表格主容器直接设定 css 样式，样式值只会对所在容器有效，不会影响其他表格实例。如：`css: '.layui-table-page{text-align: right;}'`

</td>
<td>string</td>
<td>-</td>
    </tr>
    <tr>
<td>escape <sup>2.6+</sup></td>
<td>是否开启对内容的编码（转义 html）</td>
<td>boolean</td>
<td>

`true`

</td>
    </tr>
    <tr>
<td>totalRow</td>
<td>是否开启合计行区域</td>
<td>string</td>
<td>

`false`

</td>
    </tr>
    <tr>
<td>page</td>
<td>

用于开启分页。<br>
支持传入 [laypage](../laypage/#options) 组件的基础属性（jump,elem 除外）

</td>
<td>boolean<br>object</td>
<td>

`false`

</td>
    </tr>
    <tr>
<td>pagebar <sup>2.7+</sup></td>
<td>

用于开启分页区域的自定义模板，用法同 `toolbar` 属性。

</td>
<td>string</td>
<td>-</td>
    </tr>
    <tr>
<td>limit</td>
<td>

每页显示的条数。值需对应 limits 参数的选项。优先级低于 `page` 属性中的 `limit` 属性。

</td>
<td>number</td>
<td>

`10`

</td>
    </tr>
    <tr>
<td>limits</td>
<td>每页条数的选择项。</td>
<td>array</td>
<td>

`[10,…,90]`

</td>
    </tr>
    <tr>
<td>loading</td>
<td>

是否显示加载条。若为 `false`，则在切换分页时，不会出现加载条。必须设置了 `url` 属性才生效。

</td>
<td>boolean</td>
<td>

`true`

</td>
    </tr>
    <tr>
<td>scrollPos <sup>2.7+</sup></td>
<td>

用于设置重载数据或切换分页时的滚动条位置状态。可选值：
- `fixed` 重载数据时，保持滚动条位置不变
- `reset` 重载数据时，滚动条位置恢复置顶
- `default` 默认方式，无需设置。即重载数据或切换分页时，纵向滚动条置顶，横向滚动条位置不变。

</td>
<td>string</td>
<td>-</td>
    </tr>
    <tr>
<td>editTrigger <sup>2.7+</sup></td>
<td>

是用于设定单元格编辑的事件触发方式。如双击: `dblclick`

</td>
<td>string</td>
<td>

`click`

</td>
    </tr>
    <tr>
<td>title</td>
<td>定义 table 的大标题（在文件导出等地方会用到）</td>
<td>string</td>
<td>-</td>
    </tr>
    <tr>
<td>text</td>
<td>自定义文本，如空数据时的异常提示等。</td>
<td>object</td>
<td>
  <button class="layui-btn layui-btn-sm layui-btn-primary" lay-layer="{title: 'text 属性默认值'}">
    查看默认值
  </button>
  <div style="display: none;">`text: {none: '无数据'}`</div>
</td>
    </tr>
    <tr>
<td>autoSort</td>
<td>

是否由组件自动进行前端排序。若为 `false`，则需自主排序，即由后端直接返回排序好的数据。[#详细用法](#on-sort)

</td>
<td>boolean</td>
<td>

`true`

</td>
    </tr>
    <tr>
<td>initSort</td>
<td>

初始排序状态。用于在数据表格渲染完毕时，按某个字段排序显示。它接受一个 `object` 类型的值，包含属性有： 
- `field` 排序字段。对应 `cols` 设定的各字段名
- `type` 排序方式。可选值 : `'asc','desc',null`，即：`升序、降序、默认`

```
initSort: {
  field: 'id', // 按 id 字段排序
  type: 'desc' // 降序排序
}
```

</td>
<td>object</td>
<td>-</td>
    </tr>
    <tr>
<td>skin</td>
<td>

设置表格边框风格。可选值：`grid`\|`line`\|`row`\|`nob`

</td>
<td>string</td>
<td>
  
`grid`

</td>
    </tr>
    <tr>
<td>size</td>
<td>

设置表格其他尺寸。可选值：`sm`\|`md`|`lg`

</td>
<td>string</td>
<td>

`md`

</td>
    </tr>
    <tr>
<td>even</td>
<td>

是否开启隔行背景。

</td>
<td>string</td>
<td>
  
`false`

</td>
    </tr>
    <tr>
<td>before <sup>2.7+</sup></td>
<td>数据渲染之前的回调函数。</td>
<td>function</td>
<td>-</td>
    </tr>
    <tr>
<td>

[done](#options.done)

</td>
<td>

<div class="ws-anchor" id="options.done">
  数据渲染完毕的回调函数。返回的参数如下：
</div>

```
table.render({
  done: function(res, curr, count, origin){
    console.log(res); // 得到当前渲染的数据
    console.log(curr);  // 得到当前页码
    console.log(count); // 得到数据总量
    console.log(origin); // 回调函数所执行的来源 --- 2.8.7+
  }
  // …  // 其它属性
});
```

</td>
<td>function</td>
<td>-</td>
    </tr>
    <tr>
<td>error <sup>2.6+</sup></td>
<td> 数据请求失败的回调函数。返回两个参数：错误对象、内容。</td>
<td>function</td>
<td>-</td>
    </tr>
  </tbody>
</table>