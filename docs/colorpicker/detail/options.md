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
<td>color</td>
<td>
  
默认颜色值，值的格式跟随 `format` 属性的设定。

</td>
<td>string</td>
<td>-</td>
    </tr>
    <tr>
<td>format</td>
<td>
  
颜色显示/输入格式，支持 `hex` `rgb` 。 若同时开启 `alpha` 属性，则颜色值自动变为 `rgba`。

</td>
<td>string</td>
<td>

`hex`

</td>
    </tr>
    <tr>
<td>alpha</td>
<td>
  
是否开启透明度。当同时开启 `format: 'rgb'` 时，`color` 值将采用 `rgba` 格式。

</td>
<td>boolean</td>
<td>

`false`

</td>
    </tr>
    <tr>
<td>predefine</td>
<td>
  
是否开启预定义颜色栏

</td>
<td>boolean</td>
<td>

`false`

</td>
    </tr>
    <tr>
<td>colors</td>
<td>
  
设置可选的颜色列表，需开启 `predefine: true` 有效。
<br>用法详见：[#预定义颜色项](#demo-predefine)

</td>
<td>array</td>
<td>-</td>
    </tr>
    <tr>
<td>size</td>
<td>
  
颜色框的尺寸，可选值： `lg` `sm` `xs`

</td>
<td>string</td>
<td>

`sm`

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
<td>change</td>
<td colspan="3">
  
颜色被改变的回调函数。用法详见：[#示例](#demo-all)

```
change: function(value){
  console.log(value); // 当前颜色值
}
```

</td>
    </tr>
    <tr>
<td>done</td>
<td colspan="3">
  
颜色选择完毕的回调函数。点击“确认”和“清除”按钮均会触发

```
done: function(value){
  console.log(value); // 当前选中的颜色值
}
```

用法详见：[#示例](#demo-all)

</td>
    </tr>
    <tr>
<td>cancel <sup>2.8+</sup></td>
<td colspan="3">
  
取消颜色选择的回调函数，一般点击非颜色选择面板区域触发。

```
cancel: function(value){
  console.log(value); // 当前颜色值
}
```

用法详见：[#示例](#demo-all)

</td>
    </tr>
    <tr>
<td>close <sup>2.8+</sup></td>
<td colspan="3">
  
颜色选择面板被关闭后即触发。

```
close: function(value){
  console.log(value); // 当前颜色值
}
```

</td>
    </tr>
  </tbody>
</table>
