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
  
菜单标题

</td>
<td>string</td>
<td>-</td>
    </tr>
    <tr>
<td>id</td>
<td>
 
菜单 ID。用户菜单项唯一索引  


</td>
<td>number/string</td>
<td>-</td>
    </tr>
    <tr>
<td>type</td>
<td>
  
菜单项的类型，支持的可选值如下：

- `normal` 普通菜单项（默认）
- `group` 纵向组合收缩菜单
- `parent` 横向父级菜单
- `-` 分割线

</td>
<td>string</td>
<td>

`normal`

</td>
    </tr>
    <tr>
<td>href</td>
<td>
  
菜单项的 url 地址。若填写，点击菜单将直接发生跳转。

</td>
<td>string</td>
<td>-</td>
    </tr>
    <tr>
<td>target</td>
<td>
  
菜单 url 打开方式，需设置 `href` 属性后才生效。 一般可设为 `_blank` 或 `_self` 等

</td>
<td>string</td>
<td>

`_self`

</td>
    </tr>
    <tr>
<td>disabled <sup>2.8+</sup></td>
<td>
  
菜单项是否禁用状态

</td>
<td>boolean</td>
<td>
  
`false`

</td>
    </tr>
    <tr>
<td>templet</td>
<td>
  
自定义当前菜单项模板，优先级高于基础属性 `templet`

</td>
<td>string/function</td>
<td>-</td>
    </tr>
    <tr>
<td>child</td>
<td>
  
子级菜单数据集合。参数同父级，可无限嵌套。

</td>
<td>array</td>
<td>-</td>
    </tr>
  </tbody>
</table>