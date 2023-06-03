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
<td>-</tr>
    <tr>
<td>type</td>
<td>
  
滑块类型，可选值有：

- `default` 水平滑块（默认）
- `vertical`垂直滑块

</td>
<td>string</td>
<td>

`default`

</td>
    </tr>
    <tr>
<td>value</td>
<td>
  
滑块初始值。

- 默认可直接设置数值，如： `value: 50`
- 若滑块开启 `range: true` 区间选择，则值为数组，异表示开始和结尾的区间，如： `value: [30, 60]`

</td>
<td>number<br>array</td>
<td>-</td>
    </tr>
    <tr>
<td>range</td>
<td>
  
是否开启滑块的区间选择。若开启，则滑块将出现两个可拖拽的点。

</td>
<td>boolean</td>
<td>

`false`

</td>
    </tr>
    <tr>
<td>min</td>
<td>
  
滑块的最小值

</td>
<td>number</td>
<td>

`0`

</td>
    </tr>
    <tr>
<td>max</td>
<td>
  
滑块的最大值

</td>
<td>number</td>
<td>

`100`

</td>
    </tr>
    <tr>
<td>step</td>
<td>
  
滑块单次拖动的步长

</td>
<td>number</td>
<td>

`1`

</td>
    </tr>
    <tr>
<td>showstep</td>
<td>
  
是否显示间断点

</td>
<td>boolean</td>
<td>

`false`

</td>
    </tr>
    <tr>
<td>tips</td>
<td>
  
鼠标移入当前圆点，是否显示当前值

</td>
<td>boolean</td>
<td>

`true`

</td>
    </tr>
    <tr>
<td>input</td>
<td>
  
是否显示滑块的数字输入框。 注：若设置 `range: true` 则该属性强制无效。

</td>
<td>boolean</td>
<td>

`false`

</td>
    </tr>
    <tr>
<td>height</td>
<td>
  
滑动条高度。 必须设置 `type: 'vertical'` 属性，即垂直滑块时有效。

</td>
<td>number</td>
<td>

`200`

</td>
    </tr>
    <tr>
<td>theme</td>
<td>
  
滑块的主题色。

</td>
<td>string</td>
<td>-</td>
    </tr>
    <tr>
<td>disabled</td>
<td>
  
是否禁用滑块

</td>
<td>boolean</td>
<td>

`false`

</td>
    </tr>
    <tr>
<td>setTips</td>
<td colspan="3">
  
滑块拖拽时设置提示文本的回调函数。并返回当前的 `value` 参数。用法详见：[#设置提示文本](#demo-setTips)

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
  
滑块数值发生改变的回调函数。并返回当前的 `value` 参数。

```
slider.render({
  elem: '#id',
  change: function(value){
    console.log(value) // 滑块当前值
    // do something
  }
});
```

一般可在该回调中将 `value` 同步给表单隐藏域，或者进行一些其它操作。

</td>
    </tr>
    <tr>
<td>done <sup>2.8+</sup></td>
<td colspan="3">
  
滑块拖拽完毕的回调函数。并返回当前的 `value` 参数。滑块拖动过程中不会触发。

```
slider.render({
  elem: '#id',
  done: function(value){
    console.log(value) // 滑块当前值
    // do something
  }
});
```

若需将 `value` 异步发送给后端，一般采用 `done` 回调，而非 `change` 回调。

</td>
    </tr>
  </tbody>
</table>