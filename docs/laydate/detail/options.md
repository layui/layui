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
  
[type](#options.type)

</td>
<td>
  
<div id="options.type" lay-pid="options" class="ws-anchor">
  组件面板选择类型。支持以下可选值：
</div>

- `year` 年选择器，只提供年列表选择
- `month` 年月选择器，只提供年、月选择
- `date` 日期选择器（默认），可选择：年、月、日选择
- `time` 时间选择器，只提供时、分、秒选择
- `datetime` 日期时间选择器，可选择：年月日、时分秒

效果详见： [#示例](#demo-type)

</td>
<td>string</td>
<td>

`date`

</td>
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
<td>

[range](#options.range)

</td>
<td>

<div id="options.range" lay-pid="options" class="ws-anchor">

开启左右面板的范围选择，将会根据 `type` 类型呈现对应的范围选择面板。该属性值支持以下类型：

</div>  

- 若为 `boolean` 类型，即表示是否开启范围选择，若设为 `true`，则开始日期与结束日期默认采用 `-` 连接符
- 若为 `string` 类型，则表示开启范围选择，且自定义开始日期与结束日期的连接符。如： `range: '~'`
- 若为 `array` 类型，即表示开启范围选，且开始日期和结束日期分别赋值在两个目标选择器中，如：

```
range: ['#start', '#end']
```

详细用法可参考： [#示例](#demo-range)


</td>
<td>boolean<br>string<br>array</td>
<td>

`false`

</td>
    </tr>
    <tr>
<td>rangeLinked <sup>2.8+</sup></td>
<td>

是否开启日期范围选择时的区间联动标注模式，该模式必须开启 `range` 属性才能生效。日期范围默认采用的是*左右面板独立选择模式*，设置该属性后，将采用*左右面板联动选择模式*。
<br>效果详见： [#示例](#demo-range)

</td>
<td>boolean</td>
<td>

`false`

</td>
    </tr>
    <tr>
<td>fullPanel <sup>2.8+</sup></td>
<td>
  
是否开启全面板，即日期和时间显示在同一面板。 当 `type: 'datetime'` 且未设置 `range` 属性时生效。
<br>效果详见： [#示例](#demo-type)

</td>
<td>boolean</td>
<td>

`false`

</td>
    </tr>
    <tr>
<td>
  
[format](#options.format)

</td>
<td colspan="3">
  
<div id="options.format" lay-pid="options" class="ws-anchor">

自定义日期和时间值的返回格式,默认值： `yyyy-MM-dd`。 其格式符规则如下：

</div> 


| 格式符 | 描述 |
| --- | --- |
| yyyy | 年份，输出四个字符。若不足四位，则前置补零 |
| y | 年份，允许一位 |
| MM | 月份，输出两个字符。若不足两位，则前置补零 |
| M | 月份，允许一位 |
| dd | 日期，输出两个字符。若不足两位，则前置补零 |
| d | 日期，允许一位 |
| HH | 小时，输出两个字符。若不足两位，则前面补零 |
| H | 小时，允许一位 |
| mm | 分钟，输出两个字符。若不足两位，则前面补零 |
| m | 分钟，允许一位 |
| ss | 秒数，输出两个字符。若不足两位，则前面补零 |
| s | 秒数，允许一位 |

通过上述格式符组成日期时间字符串，如下所示：

```
// 返回值示例： 2008-08-08 20:08:08
format: 'yyyy-MM-dd HH:mm:ss'
 
// 返回值示例： 北京时间 6 点 30 分
format: '北京时间 H 点 m 分'
```

相关用法可参考： [#示例](#demo-format)

</td>
    </tr>
    <tr>
<td>

[value](#options.value)

</td>
<td>
  
<div id="options.value" lay-pid="options" class="ws-anchor">
初始值。值支持以下类型：
</div> 

- 若为 `string` 类型，则必须和 `format` 属性格式对应

```
value: '2018-08-18'
```

- 若为 `date` 对象类型，则可直接赋值 `new Date()`

```
value: new Date(1534766888000) // 参数即为：2018-08-20 20:08:08 的毫秒数
```

- 当开启 `range` 时，初始设置日期范围值

```
 // 开始日期 - 结束日期
value: '1900-01-01 - 2100-01-01'
```

</td>
<td>string<br>date</td>
<td>

`new Date()`

</td>
    </tr>
    <tr>
<td>isInitValue</td>
<td>
  
是否将初始值填充在目标元素中，一般配合 `value` 属性使用

</td>
<td>boolean</td>
<td>

`false`

</td>
    </tr>
    <tr>
<td>

[shortcuts](#options.shortcuts) <sup>2.8+</sup>

</td>
<td>

<div id="options.shortcuts" lay-pid="options" class="ws-anchor">
用于开启面板左侧的快捷选择栏。其值配置规则如下：
</div> 

```
shortcuts: [
  {
    text: "快捷选项文本",
    value: '快捷选项值'
  },
  // 更多选项 …
]
```

其中 `value` 支持以下类型：

- 若为 `string` 类型，必须和 `format` 设置的格式对应；
- 若为 `date` 对象类型，则可通过操作 `new Date()` 来对选项值进行相应的返回计算；
- 若为 `array` 类型，则数组成员可填写开始日期和结束日期。
- 若为 `function` 类型，返回值同上。<sup>2.8.16+</sup>

详细用法可参考： [#示例](#demo-shortcut)

</td>
<td>string<br>date<br>array<br>function</td>
<td>-</td>
    </tr>
    <tr>
<td>weekStart <sup>2.7+</sup></td>
<td>
  
设置起始周。 支持 0-6 的数字，`0` 即代表从周日开始。

```
weekStart: 1 // 设置周一为起始周
```

</td>
<td>number</td>
<td>

`0`

</td>
    </tr>
    <tr>
<td>isPreview</td>
<td>
  
用于是否在面板左下角显示当前结果的预览。当 `type:datetime` 时强制为 `false`。

</td>
<td>boolean</td>
<td>

`true`

</td>
    </tr>
    <tr>
<td>

[min / max](#options.minmax)

</td>
<td colspan="3">

<div id="options.min" lay-pid="options" class="ws-anchor">

限制可供选择的最小或最大日期时间值。默认值： 

- `min: '1900-1-1'` 
- `max: '2099-12-31'`

</div>   

属性值支持以下可选类型：

- 若值为字符类型，则：年月日必须用 `-` 连接，且时分秒必须用 `:` 连接。 此处无需遵循 `format` 设定的格式；
- 若值为整数类型，且数字 ＜ 86400000，则数字代表天数，如： `min: -7` 即代表最小日期在 7 天前，正数代表若干天后；
- 若值为整数类型，且数字 ≥ 86400000，则数字代表毫秒数，如：`max: 4073558400000` 即代表最大日期在公元 3000年1月1日。

示例：

```
min: '2017-1-1 00:00:00' // 最小日期时间值
min: -7 // 最小日期为 7 天前
max: 7 // 最大日期为 7 天后
```

相关效果可参考： [#示例](#demo-limit)

</td>
    </tr>
    <tr>
<td>trigger</td>
<td>
  
自定义弹出组件面板的事件

</td>
<td>string</td>
<td>

`click`

</td>
    </tr>
    <tr>
<td>show</td>
<td>
  
是否在渲染时默认显示组件面板。组件在执行渲染时，默认需通过触发目标元素的事件，方可显示组件面板，而该属性可跳过目标元素的事件，直接显示组件面板。

</td>
<td>boolean</td>
<td>

`false`

</td>
    </tr>
    <tr>
<td>position</td>
<td>
  
设置组件面板的定位方式。支持以下可选值：

- `absolute`  绝对定位，始终吸附在绑定元素周围。
- `fixed` 固定定位，初始吸附在绑定元素周围，不随浏览器滚动条所左右。一般用于在固定定位的弹层中使用。
- `static` 静态定位，控件将直接嵌套显示在指定容器中。用法详见：[#示例](#demo-static)

</td>
<td>string</td>
<td>

`absolute`

</td>
    </tr>
    <tr>
<td>zIndex</td>
<td>
  
设置组件面板的层叠顺序。一般用于解决与其它元素的互相被遮掩的问题。若 `position: 'static'` 时，则该属性无效。

</td>
<td>number</td>
<td>

`99999999`

</td>
    </tr>
    <tr>
<td>

[shade](#options.shade) <sup>2.8+</sup></td>

<td>

<div id="options.shade" lay-pid="options" class="ws-anchor"> 
用于开启弹出日期面板时的遮罩。值支持以下可选类型：
</div>

- 若为 `number` 类型，则表示遮罩透明度。如：

```
shade: 0.5
```

- 若为 `array` 类型，则可设置遮罩颜色和透明度，如：

```
shade: [0.5, '#000'] // 遮罩的透明度和背景色
```

效果详见： [#示例](#demo-more)

</td>
<td>number<br>array</td>
<td>-</td>
    </tr>
    <tr>
<td>showBottom</td>
<td>
  
是否显示组件面板的底部栏

</td>
<td>boolean</td>
<td>

`true`

</td>
    </tr>
    <tr>
<td>btns</td>
<td>
  
自定义排版组件面板底部栏中的按钮，按钮将按照数组顺序排列。内置按钮名称：`clear,now,confirm` 。

```
 // 显示清空、确认按钮
btns: ['clear', 'confirm']
```

</td>
<td>array</td>
<td>-</td>
    </tr>
    <tr>
<td>autoConfirm <sup>2.8+</sup></td>
<td>
  
是否在选中目标值时即自动确认。
<br>当开启 `range` 属性时，该属性无效。

</td>
<td>boolean</td>
<td>

`true`

</td>
    </tr>
    <tr>
<td>lang</td>
<td>
  
设置组件的语言版本。可选值如下：

- `cn` 中文版
- `en` 英文版

</td>
<td>string</td>
<td>

`cn`

</td>
    </tr>
    <tr>
<td>

[theme](#options.theme)

</td>
<td>

<div id="options.theme" lay-pid="options" class="ws-anchor">

设置组件面板主题。除了默认主题，还内置主题： `molv` `grid` `circle`<sup>2.8+</sup> ，且支持直接传入自定义的主题色。

</div> 

```
theme: '#FF5722'
```

注 <sup>2.8+</sup> : 多个主题可用数组格式，如：

```
theme: ['grid', '#FF5722']
```

若第 1 个成员为 hex 格式的主色值，则第 2 个成员为辅色值

```
// 主色、辅色 --- 2.8.4 新增
theme: ['#16baaa', '#16b777']
```

效果及用法详见： [#示例](#demo-theme)

</td>
<td>string<br>array</td>
<td>-</td>
    </tr>
    <tr>
<td>calendar</td>
<td>
  
是否显示我国常见的公历节日。当 `lang: 'en'` 时无效。

</td>
<td>boolean</td>
<td>

`true`

</td>
    </tr>
    <tr>
<td>

[mark](#options.mark)

</td>
<td>
  
<div id="options.mark" lay-pid="options" class="ws-anchor">

自定义日期标记。该属性是对 `calendar` 属性的进一步延伸，灵活度更高。属性可批量设置多个日期标记，如：

</div>

```
mark: {
  '0-10-14': '生日', //每年每月的某一天
  '0-0-10': '工资', // 每月 10 号
  '2008-8-8': '开幕', // 指定的日期
}
```

前缀 `0-` 即代表每年，`0-0-` 即代表每年每月。

效果详见： [#示例](#demo-mark)


</td>
<td>object</td>
<td>-</td>
    </tr>
    <tr>
<td>

[holidays](#options.holidays) <sup>2.7+</sup>

</td>
<td>
  
<div id="options.holidays" class="ws-anchor">
用于标注节假日及补班日。值是一个二维数组，如：
</div>

```
holidays: [
  // 2023 年的节假日
  ['2023-1-1','2023-1-2','2023-1-3'],
  // 2023 年的补班日
  ['2023-1-28','2023-1-29']
]
```

相关日期值可详细参考国家每年公布的法定节假日安排

效果详见： [#示例](#demo-mark)

</td>
<td>array</td>
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
<td>

[ready](#options.ready)

</td>
<td colspan="3">
  
<div id="options.ready" lay-pid="options" class="ws-anchor">
组件面板初始打开的回调函数。返回的参数如下：
</div>

```
ready: function(date){
  /* 得到初始的日期时间对象，date 参数格式如下：
    {
      year: 2017, // 年
      month: 8, // 月
      date: 18, // 日 
      hours: 0, // 时 
      minutes: 0, // 分 
      seconds: 0 // 秒
    }
  */
  console.log(date);
}
```

</td>
    </tr>
    <tr>
<td>

[change](#options.change)

</td>
<td colspan="3">
  
<div id="options.change" lay-pid="options" class="ws-anchor">
日期时间被切换后的回调函数。返回的参数如下：
</div>

```
change: function(value, date, endDate){
  console.log(value); // 日期字符，如： 2017-08-18
  console.log(date); // 包含年月日时分秒各项值的对象
  console.log(endDate); // 结束日期时间对象，当设置 range 时才会返回。对象成员同上。
}
```

</td>
    </tr>
    <tr>
<td>
  
[done](#options.done)

</td>
<td colspan="3">
  
<div id="options.done" lay-pid="options" class="ws-anchor">
日期时间选择完毕的回调函数，点击清空、现在、确定也均会触发。返回的参数如下：
</div>

```
done: function(value, date, endDate){
  console.log(value); // 日期字符，如： 2017-08-18
  console.log(date); // 包含年月日时分秒各项值的对象
  console.log(endDate); // 结束日期时间对象，当设置 range 时才会返回。对象成员同上。
}
```

</td>
    </tr>
    <tr>
<td>onConfirm <sup>2.8+</sup></td>
<td colspan="3">
  
点击底部栏「确定」按钮时的回调函数。返回的参数同 `done`。

</td>
    </tr>
    <tr>
<td>onNow <sup>2.8+</sup></td>
<td colspan="3">
  
点击底部栏「现在」按钮时的回调函数。返回的参数同 `done`。

</td>
    </tr>
    <tr>
<td>onClear <sup>2.8+</sup></td>
<td colspan="3">
  
点击底部栏「清空」按钮时的回调函数。返回的参数同 `done`。

</td>
    </tr>
    <tr>
<td>close <sup>2.7+</sup></td>
<td colspan="3">
  
组件面板被关闭（移除）后的回调函数。无返回参数。

</td>
    </tr>
  </tbody>
</table>