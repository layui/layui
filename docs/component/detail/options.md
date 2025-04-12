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
<td>name</td>
<td>

组件名称。如 `name:'tabs'`，在使用组件时，即可通过 `layui.tabs` 获得该组件。注：*组件名必须唯一*。

</td>
<td>string</td>
<td>-</td>
    </tr>
    <tr>
<td>config</td>
<td>

定义组件渲染时的默认配置项。

</td>
<td>object</td>
<td>-</td>
    </tr>
    <tr>
<td>CONST</td>
<td>

通用常量集，一般存放固定字符，如类名等。如：

```
CONST: {
  ELEM: 'layui-tabs',
}
```

上述常量可通过 `component.CONST.ELEM` 获得。

</td>
<td>object</td>
<td>-</td>
    </tr>
    <tr>
<td>isDeepReload <br><sup>实验性</sup></td>
<td>

组件重载时是否允许深度重载，即对重载时选项进行深度合并。

</td>
<td>boolean</td>
<td>

`false`

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
<td>render</td>
<td colspan="3">

组件渲染的逻辑。

```js
render: function() {
  // 组件的容器构建、插入等
  // …
}
```

也可以通过原型 `component.Class.prototype.render` 进行定义。

</td>
    </tr>
    <tr>
<td>beforeInit</td>
<td colspan="3">

组件初始化之前的回调函数。

```js
beforeInit: function(options) {
  console.log(options); // 获得组件初始化前的配置项
}
```

</td>
    </tr>
    <tr>
<td>beforeRender</td>
<td colspan="3">

渲染之前的回调函数。

```js
beforeRender: function(options) {
  console.log(options); // 获得组件渲染前的配置项
}
```

</td>
    </tr>
    <tr>
<td>extendsInstance</td>
<td colspan="3">

扩展组件渲染的实例对象的回调函数。如：

```js
extendsInstance: function(that) {
  return {
    // 关闭组件
    close: function() {
      that.remove(); // 调用组件原型中的 remove 方法
    }
  }
}
```

当组件渲染时，即可通过它返回的对象调用实例方法：

```js
var inst = xxx.render(); // 某组件渲染
inst.close(); // 关闭某组件
```

</td>
    </tr>
    <tr>
<td>events</td>
<td colspan="3">

定义组件各内部事件。

```js
events: function() {
  // 亦可包含针对组件的 window, document 等全局事件
  // …
}
```

也可以通过原型 `component.Class.prototype.events` 进行定义。

</td>
    </tr>
  </tbody>
</table>
