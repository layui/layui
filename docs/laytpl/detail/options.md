<table class="layui-table">
  <colgroup>
    <col width="150">
    <col>
  </colgroup>
  <thead>
    <tr>
      <th>标签</th>
      <th>描述</th>
      <th>类型</th>
      <th>默认值</th>
    </tr>
  </thead>
  <tbody>{{!
    <tr>
<td>open</td>
<td>

用于设置起始界定符

</td>
<td>string</td>
<td>

`{{`

</td>
    </tr>
    <tr>
<td>close</td>
<td>

用于设置结束界定符

</td>
<td>string</td>
<td>

`}}`

</td>
    </tr>
    <tr>
<td>cache <sup>2.11+</sup></td>
<td>

是否开启模板缓存，以便下次渲染时不重新编译模板

</td>
<td>boolean</td>
<td>

`true`

</td>
    </tr>
    <tr>
<td>condense <sup>2.11+</sup></td>
<td>

是否压缩模板空白符，如：将多个连续的空白符压缩为单个空格

</td>
<td>boolean</td>
<td>

`true`

</td>
    </tr>
    <tr>
<td>tagStyle<br><sup>2.11+</sup></td>
<td>

设置标签风格。可选值：

- `legacy`: 采用 `< 2.11` 旧版本的标签风格
- `modern`: 采用 `2.11+` 新版本的标签风格

为了保持向下兼容，默认仍然采用旧版本的标签风格，但在后续版本可能会将默认值设置为 `modern`，因此，**实际使用时，建议显式设置该选项值，以免升级时产生不兼容的问题**。

</td>
<td>string</td>
<td>

`legacy`

</td>
    </tr>
  </tbody>!}}
</table>
