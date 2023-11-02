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
<td>title</td>
<td>
  
节点标题

</td>
<td>string</td>
<td>-</td>
    </tr>
    <tr>
<td>id</td>
<td>
  
节点唯一索引值，用于对指定节点进行各类操作

</td>
<td>string</td>
<td>-</td>
    </tr>
    <tr>
<td>field</td>
<td>
  
节点字段名

</td>
<td>string</td>
<td>-</td>
    </tr>
    <tr>
<td>children</td>
<td>
  
子节点。支持设定属性选项同父节点

</td>
<td>array</td>
<td>-</td>
    </tr>
    <tr>
<td>href</td>
<td>
  
点击节点弹出新窗口对应的 url。需开启 isJump 基础属性才有效。

</td>
<td>string</td>
<td>-</td>
    </tr>
    <tr>
<td>spread</td>
<td>
  
节点是否初始展开

</td>
<td>boolean</td>
<td>

`false`

</td>
    </tr>
    <tr>
<td>checked</td>
<td>
  
节点是否初始为选中状态。需开启 `showCheckbox` 基础属性时有效。

</td>
<td>boolean</td>
<td>

`false`

</td>
    </tr>
    <tr>
<td>disabled</td>
<td>
  
节点是否为禁用状态

</td>
<td>boolean</td>
<td>

`false`

</td>
    </tr>
    <tr>
      <td>parentid<br/><sup>2.8.18+</sup></td>
      <td>
        (数组型数据源特有属性,可以通过customName.parentid自定义名称)这个节点父节点的id(顶层节点为0),会根据这个信息组装带有children的json数组
      </td>
      <td>string</td>
      <td>-</td>
    </tr>
  </tbody>
</table>