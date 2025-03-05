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

组件渲染指定的目标元素选择器或 DOM 对象

</td>
<td>string/DOM</td>
<td>-</td>
    </tr>
    <tr>
    <tr>
<td>id</td>
<td>

组件渲染的唯一实例 ID

</td>
<td>string</td>
<td>-</td>
    </tr>
    <tr>
<td>className</td>
<td>

给主容器追加 CSS 类名，以便自定义样式

</td>
<td>string</td>
<td>-</td>
    </tr>
    <tr>
<td>trigger</td>
<td>

标签切换的触发事件

</td>
<td>boolean</td>
<td>

`click`

</td>
    </tr>
    <tr>
<td>headerMode</td>
<td>

标签头部的显示模式。可选值有：

- `auto` 自动模式，根据标签头部是否溢出自动显示不同模式
- `scroll` 始终滚动模式
- `normal` 始终常规模式，不渲染头部滚动结构

</td>
<td>string</td>
<td>

`auto`

</td>
    </tr>
    <tr>
<td>index</td>
<td>

初始选中的标签索引或标签 `lay-id` 属性值

</td>
<td>number</td>
<td>-</td>
    </tr>
    <tr>
<td>closable</td>
<td>

是否开启标签项关闭功能

</td>
<td>boolean</td>
<td>

`false`

</td>
    </tr>
    <tr>
<td>header</td>
<td colspan="3">

设置标签头部列表，通常在「非自动渲染」的场景下使用：

**1. 方法渲染**

若 `header` 传入一个数组，且成员值为对象，即为方法渲染时传入的头部列表数据。如：

```js
header: [
  { title: 'Tab1' }, // 除 `title` 为必传项外，也可传入其他任意字段。
  { title: 'Tab2' }
]
```

**2. 任意元素渲染**

若 `header` 传入一个数组，则成员值为元素选择器，即为绑定标签头部列表元素。如：

```js
header: ['#tabsHeader', '>li'],
```

</td>
    </tr>
    <tr>
<td>body</td>
<td colspan="3">

设置标签内容列表，通常在「非自动渲染」的场景下使用：

**1. 方法渲染**

若 `body` 传入一个数组，且成员值为对象，即为方法渲染时传入的标签内容列表数据。如：

```js
body: [
  { content: 'Tab1' }, // `content` 为必传项
  { content: 'Tab2' }
]
```

**2. 任意元素渲染**

若 `body` 传入一个数组，则成员值为元素选择器，即为绑定标签内容列表元素。如：

```js
body: ['#tabsBody', '>div'],
```

</td>
    </tr>
  </tbody>
</table>
