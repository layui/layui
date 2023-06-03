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
<td>bars <sup>2.8+</sup></td>
<td>
  
设置固定工具条列表。可支持定义以下子属性：

```
bars: [
  {
    type: '', // bar 类型名，用于事件区分
    icon: '', // bar 图标的 className
    content: '', // bar 任意内容
    style: '' // bar 任意样式
  },
  // …
]
```

该属性比较灵活，具体用法可参考：[#示例](#examples)

</td>
<td>array</td>
<td>

<button class="layui-btn layui-btn-sm layui-btn-primary" lay-layer="{
  title: 'bars 属性默认值',
  content: '<div>bars: {type: \'top\', icon: \'layui-icon-top\'}</div>'
}">查看默认值</button>

</td>
    </tr>
    <tr>
<td>default <sup>2.8+</sup></td>
<td>
  
是否显示默认的固定条 ，如 `top` （点击可让滚动条置顶）等

</td>
<td>boolean</td>
<td>

`true`

</td>
    </tr>
    <tr>
<td>bgcolor</td>
<td>
  
固定条的默认背景色

</td>
<td>string</td>
<td>-</td>
    </tr>
    <tr>
<td>css</td>
<td>
  
工具条外层容器的任意 css 属性。如设置工具条的坐标：

```
css: {right: 32, bottom: 32}
```

</td>
<td>object</td>
<td>-</td>
    </tr>
    <tr>
<td>target <sup>2.8+</sup></td>
<td>
  
插入固定条的目标元素选择器

</td>
<td>object</td>
<td>

`body`

</td>
    </tr>
    <tr>
<td>scroll <sup>2.8+</sup></td>
<td>
  
固定条最外层容器滚动条所在的元素，若不设置则默认取 `target` 属性值

</td>
<td>object</td>
<td>

`body`

</td>
    </tr>
    <tr>
<td>margin <sup>2.8+</sup></td>
<td>
  
用于设置默认 `TOP` 条出现滚动条的高度临界值

</td>
<td>number</td>
<td>

`200`

</td>
    </tr>
    <tr>
<td>duration <sup>2.8+</sup></td>
<td>
  
用于默认 `TOP` 条等动画时长

</td>
<td>number</td>
<td>

`200`

</td>
    </tr>
    <tr>
<td>on <sup>2.8+</sup></td>
<td>
  
用于定义固定条列表的任意事件，触发事件时的回调将返回 `bars` 属性的 `type` 值。

```
on: {
  // 点击事件
  click: function(type){
    // bars 对属性应的 type 值
    console.log(type);
  },
  // …
}
```

该属性一般与 `bars` 属性搭配使用，具体用法可参考：[#示例](#examples)

</td>
<td>object</td>
<td>-</td>
    </tr>
  </tbody>
</table>


### 贴士

> 灵活运用 `bars` 属性的 `content,style` 子属性，可实现更多丰富多样的固定条。