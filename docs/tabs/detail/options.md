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
<td>header</td>
<td>
  
选项卡的标题列表，可以是一个包含标题文本的数组，也可以是一个包含标题对象的数组。标题对象支持以下属性：
- `title` 标题文本
- `id` 标题唯一索引
- `disabled` 是否禁用

</td>
<td>array</td>
<td>-</td>
    </tr>
    <tr>
<td>body</td>
<td>
  
选项卡的内容列表，可以是一个包含内容文本的数组，也可以是一个包含内容对象的数组。内容对象支持以下属性：
- `content` 内容文本
- `id` 内容唯一索引

</td>
<td>array</td>
<td>-</td>
    </tr>
    <tr>
<td>index</td>
<td>
  
初始选中的选项卡索引

</td>
<td>number</td>
<td>

`0`

</td>
    </tr>
    <tr>
<td>closable</td>
<td>
  
是否允许选项卡被关闭

</td>
<td>boolean</td>
<td>

`false`

</td>
    </tr>
    <tr>
<td>headerMode</td>
<td>
  
选项卡标题栏的展现模式。可选值：
- `default` 默认模式
- `brief` 简约模式
- `card` 卡片模式

</td>
<td>string</td>
<td>

`default`

</td>
    </tr>
  </tbody>
</table>