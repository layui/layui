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
<td>

[data](#options.data)

</td>
<td>
  
下拉菜单的数据源。格式详见：[#data 格式](#options.data)

</td>
<td>array</td>
<td>-</td>
    </tr>
    <tr>
      <td>id</td>
<td>
  
设定实例唯一索引，以便用于其他方法对例进行相关操作。若该属性未设置，则默认从 `elem` 属性绑定的元素中的 `id` 属性值中获取。

</td>
<td>string</td>
<td>-</td>
    </tr>
    <tr>
<td>trigger</td>
<td>
  
触发组件的事件类型。支持所有事件，如： `click,hover,mousedown,contextmenu` 等

</td>
<td>string</td>
<td>

`click`

</td>
    </tr>
    <tr>
<td>show</td>
<td>
  
是否渲染即显示组件面板。该属性一般在重载方法中传递。

</td>
<td>boolean</td>
<td>

`false`

</td>
    </tr>
    <tr>
<td>align</td>
<td>
  
下拉面板相对绑定元素的水平对齐方式。支持以下可选值：

- `left` 左对齐（默认）
- `center` 居中对齐
- `right` 右对齐

</td>
<td>string</td>
<td>

`left`

</td>
    </tr>
    <tr>
<td>isAllowSpread</td>
<td>
  
是否允许菜单组展开收缩

</td>
<td>boolean</td>
<td>

`true`

</td>
    </tr>
    <tr>
<td>isSpreadItem</td>
<td>
  
是否初始展开子菜单

</td>
<td>boolean</td>
<td>

`true`

</td>
    </tr>
    <tr>
<td>delay</td>
<td>
  
延迟关闭的毫秒数。当 `trigger: 'hover'` 时才生效

</td>
<td>number</td>
<td>

`300`

</td>
    </tr>
    <tr>
<td>className</td>
<td>
  
自定义组件主容器的样式类名，从而在外部重新定义样式。

</td>
<td>string</td>
<td>-</td>
    </tr>
    <tr>
<td>style</td>
<td>
  
设置组件主容器的 `CSS` 样式。

</td>
<td>string</td>
<td>-</td>
    </tr>
    <tr>
<td>shade <sup>2.8+</sup></td>
<td>
  
设置弹出时的遮罩。支持以下方式赋值：

- 若值为 `number` 类型，则表示为遮罩透明度，如:
  <br>`shade: 0.3`
- 若值为 `array` 类型，则可同时设置透明度和背景色，如:
  <br>`shade: [0.3, '#000']`

</td>
<td>number<br>array</td>
<td>

`0`

</td>
    </tr>
    <tr>
<td>templet</td>
<td>
  
全局定义菜单的列表模板，可添加任意 `html` 字符，且支持 [laytpl](../laytpl/) 模板语法。用法详见：[#示例](#demo-complex)

注 <sup>2.8+</sup> : 模板亦可采用函数写法：

```
templet: function(d){
  return '<i class="layui-icon layui-icon-tips"></> ' + d.title;
}
```

</td>
<td>string<br>function</td>
<td>-</td>
    </tr>
    <tr>
<td>content</td>
<td>
  
  自定义组件内容，从而替代默认的菜单结构。用法详见：[#示例](#demo-content)

</td>
<td>string</td>
<td>-</td>
    </tr>
    <tr>
<td>clickScope <sup>2.8+</sup></td>
<td>
  
设置触发点击事件的菜单范围。 支持以下可选值：

- `all` : 即代表父子菜单均可触发事件

默认无需设置，即父级菜单不触发事件

</td>
<td>string</td>
<td>-</td>
    </tr>
    <tr>
<td>

[customName](#options.customName) <sup>2.8.14+</sup>

</td>
<td>

自定义 `data` 数据源中常用的字段名称。

</td>
<td>object</td>
<td>-</td>
    </tr>
    <tr>
<td colspan="4" style="text-align: center"> 


<div id="options.callback" lay-pid="options" class="ws-anchor">

[回调函数](#options.callback)

</div>

</td>
    </tr>
    <tr>
<td>ready</td>
<td colspan="3">
  
组件成功弹出后的回调函数。返回的参数如下：

```
ready: function(elemPanel, elem){
  console.log(elemPanel); // 组件面板元素对象
  console.log(elem); // 当前组件绑定的目标元素对象
}   
```

</td>
    </tr>
    <tr>
<td>
  
[click](#options.click)

</td>
<td colspan="3">
  
<div id="options.click" lay-pid="options" class="ws-anchor">
菜单项被点击时的回调函数。返回的参数如下：
</div>

```
click: function(data, othis){
  console.log(data); // 当前所点击的菜单项对应的数据
  console.log(othis); // 当前所点击的菜单项元素对象
  console.log(this.elem); // 当前组件绑定的目标元素对象，批量绑定中常用
  
  // 若返回 false，则点击选项可不关闭面板 --- 2.8+
  /*
  return false;
  */
}
```

用法详见：[#示例](#examples)

</td>
    </tr>
  </tbody>
</table>
