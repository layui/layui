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
<td>preview <sup>2.8+</sup></td>
<td>
  
是否开启 Code 预览功能，可选值有：

- `true` 开启 Code 的普通预览
- `false` 关闭 Code 预览（默认） 
- `"iframe"` 开启 Code 在 iframe 模式中预览

当开启该属性时，`elem` 指定的元素需要设置成以下结构：

```
<pre class="layui-code" lay-options="{}">
  <textarea>
code content
  </textarea>
</pre>
```

</td>
<td>boolean<br>string</td>
<td>

`false`

</td>
    </tr>
    <tr>
<td>layout <sup>2.8+</sup></td>
<td>
  
开启预览后的面板布局方式，值为一个数组，数组的可选成员有：

- `code` 代码区域
- `preview` 预览区域

面板将根据数组的排列顺序来显示，如： 

```
layout: ['code', 'preview']
```

</td>
<td>array</td>
<td>-</td>
    </tr>
    <tr>
<td>style <sup>2.8+</sup></td>
<td>
  
设置 Code 和预览区域的公共样式

</td>
<td>string</td>
<td>-</td>
    </tr>
    <tr>
<td>codeStyle <sup>2.8+</sup></td>
<td>
  
设置 Code 区域的局部样式，优先级高于 `style` 属性

</td>
<td>string</td>
<td>-</td>
    </tr>
    <tr>
<td>previewStyle <sup>2.8+</sup></td>
<td>
  
设置预览区域的局部样式，优先级高于 `style` 属性

</td>
<td>string</td>
<td>-</td>
    </tr>
    <tr>
<td>id <sup>2.8+</sup></td>
<td>
  
设置实例的唯一索引，以便用于其他操作

</td>
<td>string</td>
<td>-</td>
    </tr>
    <tr>
<td>className <sup>2.8+</sup></td>
<td>
  
追加实例面板的 `className`，以便对其自定义样式

</td>
<td>string</td>
<td>-</td>
    </tr>
    <tr>
<td>tools <sup>2.8+</sup></td>
<td>
  
用于开启 `preview` 属性后的面板头部右侧区域工具栏图标，值为一个数组，内置成员：

- `copy` <sup>2.8.2+</sup> : 代码复制
- `full` : 最大化显示
- `window` : 在新窗口预览。一般当 `layout: 'iframe'` 时开启，且 code 中须包含完整的 HTML 方可在新窗口正常预览。

工具图标将根据数组的排列顺序来显示，如：

```
tools: ['full', 'window']
```

亦可自定义值，值对应[图标](../icon/) `className` 的 `layui-icon-` 后的名称，并通过 `toolsEvent` 回调函数中处理事件。

</td>
<td>array</td>
<td>-</td>
    </tr>
    <tr>
<td>toolsEvent <sup>2.8+</sup></td>
<td>
  
点击工具栏的回调函数，函数返回 `tools` 设置的名称，如：

```
toolsEvent: function(othis, type){
  console.log(othis); // 当前图标元素对象
  console.log(type); // tools 中设置的对应值
}
```

通过该函数与 `tools` 属性的搭配，可实现对工具栏的扩展。

</td>
<td>function</td>
<td>-</td>
    </tr>
    <tr>
<td>copy <sup>2.8.2+</sup></td>
<td>
  
用于开启代码复制功能图标。若开启 `priview`，则自动放置在 `tools` 属性中，复制图标将显示在容器右上角工具栏；若未开启 `priview`，则显示在 code 区域右上角。

</td>
<td>boolean</td>
<td>

`true`

</td>
    </tr>
    <tr>
<td>text <sup>2.8+</sup></td>
<td>
  
自定义默认文本，值为一个对象，可选成员有:

```
text: {
  code: '代码栏标题', // 默认:  </>
  preview: '预览栏标题' // 默认: Preview
}
```

</td>
<td>object</td>
<td>-</td>
    </tr>
    <tr>
<td>header <sup>2.8+</sup></td>
<td>
  
是否开启 Code 栏头部区域

</td>
<td>boolean</td>
<td>

`false`

</td>
    </tr>
    <tr>
<td>about</td>
<td>
  
设置 Code 栏头部右上角信息。必须开启 `header` 属性后有效。

</td>
<td>string</td>
<td>-</td>
    </tr>
    <tr>
<td>ln</td>
<td>
  
是否显示 Code 区域的行号

</td>
<td>boolean</td>
<td>

`true`

</td>
    </tr>
    <tr>
<td>skin</td>
<td>
  
Code 容器的风格，可选值有：

- `light` 浅色模式（默认）
- `dark` 深色模式

</td>
<td>string</td>
<td>-</td>
    </tr>
    <tr>
<td>encode</td>
<td>
  
是否对 code 中的 html 进行编码（转义）。

</td>
<td>boolean</td>
<td>

`true`

</td>
    </tr>
    <tr>
<td>

[done](#options.done) <sup>2.8+</sup>

</td>
<td colspan="3">

<div id="options.done" lay-pid="options" class="ws-anchor">  
组件渲染完毕的回调函数，函数返回一个 object 类型参数
</div>

```
done: function(obj){
  var container = obj.container; // 当前面板的容器对象
  obj.render(); // 对预览中的 `element,form` 等组件进行渲染
}
```

</td>
    </tr>
    <tr>
<td>

[onCopy](#options.onCopy) <sup>2.8.2+</sup>

</td>
<td colspan="3">

<div id="options.onCopy" lay-pid="options" class="ws-anchor">  
点击复制图标时的回调函数。 该回调一旦设定，则不再执行内置的复制操作。
</div>

```
onCopy: function(code){
  console.log(code); // 得到当前 code 内容
}
```

</td>
    </tr>
  </tbody>
</table>