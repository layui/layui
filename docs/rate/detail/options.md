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
<td>length</td>
<td>
  
评分的最大长度值，即星星的数量。

</td>
<td>number</td>
<td>

`5`

</td>
    </tr>
    <tr>
<td>value</td>
<td>
  
评分的初始值

</td>
<td>number</td>
<td>

`0`

</td>
    </tr>
     <tr>
<td>half</td>
<td>
  
是否可以选择半星。若开启，则 `value` 支持小数点，如：

```
value: '3.5'
```

</td>
<td>boolean</td>
<td>

`false`

</td>
    </tr>
    <tr>
<td>theme</td>
<td>
  
主题色

</td>
<td>string</td>
<td>

`#FFB800`

</td>
    </tr>
    <tr>
<td>text</td>
<td>
  
是否显示评分对应的文本

</td>
<td>boolean</td>
<td>

`false`

</td>
    </tr>
    <tr>
<td>readonly</td>
<td>
  
是否只读，即只用于展示，而不可点击

</td>
<td>boolean</td>
<td>

`false`

</td>
    </tr>
    <tr>
<td>setText</td>
<td colspan="3">
  
初始设置自定义文本的回调函数。 并返回当前 `value` 参数。用法详见：[#自定义文本](#demo-setText)

</td>
    </tr>
    <tr>
<td>choose</td>
<td colspan="3">
  
选择评分后的回调函数。并返回当前 `value` 参数

```
rate.render({
  elem: '#id',
  choose: function(value){
    console.log(value); // 获得选中的评分值
  }
});
```

</td>
    </tr>
  </tbody>
</table>