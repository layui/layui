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
<td>type</td>
<td>
  
弹层类型。 可选值有：

- `0` dialog 信息框（默认），*同时只能存在一个层*
- `1` page 页面层，*可同时存在多个层*
- `2` iframe 内联框架层，*可同时存在多个层*
- `3` loading 加载层，*同时只能存在一个层*
- `4` tips 贴士层，*可配置同时存在多个层*

`layer` 弹层由以上 5 种类型构成。 不同的类型代表不同的弹出形态，`layer` 提供的所有的弹出方式均由此衍生。

</td>
<td>number</td>
<td>

`0`

</td>
    </tr>
    <tr>
<td>title</td>
<td>
  
弹层标题。其值支持以下可选类型：

- 若为 `string` 类型 : 则表示为弹层的标题文本，如：

```
title: '标题'
```

- 若为 `array` 类型 : 则可设置标题文本和标题栏 CSS 样式：

```
 title: ['标题', 'font-size: 18px;']
```

- 若为 `boolean` 类型 : 则可设为 `false` 不显示标题栏。

```
title: false // 不显示标题栏
```

</td>
<td>string<br>array<br>boolean</td>
<td>

`信息`

</td>
    </tr>
    <tr>
<td>
  
[content](#options.content)

</td>
<td colspan="3">
  
<div id="options.content" lay-pid="options" class="ws-anchor">

弹层内容。 可传入的值比较灵活，支持以下使用场景：

- 若 `type: 1`（页面层）: 则 `content` 可传入值如下：

```
// 普通字符
layer.open({
  type: 1, 
  content: '传入任意文本或 HTML'
});
// 捕获页面已存在的 DOM 元素或 jQuery 对象
layer.open({
  type: 1,
  content: $('#id') // 捕获层
});
```

注意： 若采用捕获层，则捕获的元素必须存放在 `<body>` 根节点下，否则可能被父级容器的相对定位所影响。

</div>

- 若 `type: 2`（iframe 层）: 则 `content` 可传入值如下：

```
// iframe URL
layer.open({
  type: 2, 
  content: 'http://cn.bing.com' // URL
}); 
// 是否屏蔽 iframe 滚动条
layer.open({
  type: 2, 
  // 数组第二个成员设为 no，即屏蔽 iframe 滚动条
  content: ['http://cn.bing.com', 'yes']
}); 
```

- 若为其他弹层类型，传入普通字符即可。

相关效果可参考：[#示例](#demo-page)

</td>
    </tr>
    <tr>
<td>

[area](#options.area)

</td>
<td>

<div id="options.area" lay-pid="options" class="ws-anchor">  
设置弹层的宽高，其值支持以下可选类型：
</div>

- 若为 `array` 类型，则可同时设置宽高
  - `area: ['520px', '320px']` 固定宽度和高度
  - `area: ['auto', '320px']` 宽度自动，高度固定
  - `area: ['520px', 'auto']` 宽度固定，高度自动
- 若为 `string` 类型，则可定义宽度和宽高均自适应：
  - `area: '520px'` 宽度固定，高度自适应
  - `area: 'auto'` 宽度和高度均自适应

</td>
<td>array<br>string</td>
<td>

`auto`

</td>
    </tr>
    <tr>
<td>maxWidth</td>
<td>
  
弹层的最大宽度。当 `area` 属性值为默认的 `auto'` 时有效。

</td>
<td>number</td>
<td>

`360`

</td>
    </tr>
    <tr>
<td>maxHeight</td>
<td>
  
弹层的最大高度。当 `area` 属设置高度自适应时有效。

</td>
<td>number</td>
<td>-</td>
    </tr>
    <tr>
<td>
  
[offset](#options.offset)

</td>
<td>
 
<div id="options.offset" lay-pid="options" class="ws-anchor">  
弹层的偏移坐标。 支持以下可选值：
</div>  

- `offset: 'auto'` 坐标始终垂直水平居中
- `offset: '16px'` 只设置垂直坐标，水平保持居中
- `offset: ['16px', '16px']` 设置垂直和水平坐标
- `offset: 't'` 上边缘
- `offset: 'r'` 右边缘
- `offset: 'b'` 下边缘
- `offset: 'l'` 左边缘
- `offset: 'rt'` 右上角
- `offset: 'rb'` 右下角
- `offset: 'lt'` 左上角
- `offset: 'lb'` 左下角

当设置边缘坐标时，可配合 `anim` 属性实现抽屉弹出效果。

</td>
<td>string<br>array</td>
<td>

`auto`

</td>
    </tr>
    <tr>
<td>

[anim](#options.anim)

</td>
<td>
  
<div id="options.anim" lay-pid="options" class="ws-anchor">
弹层的出场动画。支持以下可选值：
</div>

- `anim: 0` 平滑放大。默认
- `anim: 1` 从上掉落
- `anim: 2` 从最底部往上滑入
- `anim: 3` 从左滑入
- `anim: 4` 从左翻滚
- `anim: 5` 渐显
- `anim: 6` 抖动

边缘抽屉动画 <sup>2.8+</sup>：

- `anim: 'slideDown'` 从上边缘往下
- `anim: 'slideLeft'` 从右边缘往左
- `anim: 'slideUp'` 从下边缘往上
- `anim: 'slideRight'`  从左边缘往右

抽屉动画一般配合 `offset` 属性实现边缘弹出。[#详见示例](#demo-more)


</td>
<td>number<br>string</td>
<td>

`0`

</td>
    </tr>
    <tr>
<td>isOutAnim</td>
<td>
  
是否开启弹层关闭时的动画。

</td>
<td>boolean</td>
<td>

`true`

</td>
    </tr>
    <tr>
<td>maxmin</td>
<td>
  
是否开启标题栏的最大化和最小化图标。

</td>
<td>boolean</td>
<td>

`false`

</td>
    </tr>
    <tr>
<td>
  
[closeBtn](#options.closeBtn)

</td>
<td>

<div id="options.closeBtn" lay-pid="options" class="ws-anchor">   
是否开启标题栏的关闭图标，或设置关闭图标风格。
</div>

- `closeBtn: 0` 不显示关闭图标
- `closeBtn: 1` 关闭图标默认风格
- `closeBtn: 2` 关闭图标风格二

</td>
<td>number</td>
<td>

`1`

</td>
    </tr>
    <tr>
<td>
  
[icon](#options.icon)

</td>
<td>

<div id="options.icon" lay-pid="options" class="ws-anchor">
提示图标。 信息框和加载层的私有参数。
</div>

- 若为信息框，支持传入 `0-6` 的可选值。<br>默认为 `-1`，即不显示图标。
- 若为加载层，支持传入 `0-2` 的可选值

```
// eg1
layer.alert('成功提示', {icon: 1});

// eg2
layer.msg('开心表情', {icon: 6});

// eg3
layer.load(1); // 加载层风格一
```

</td>
<td>number</td>
<td>

`-1`

</td>
    </tr>
    <tr>
<td>
  
[btn](#options.btn)

</td>
<td>
  
<div id="options.btn" lay-pid="options" class="ws-anchor">
自定义按钮。 页面层默认不开启。 按钮可无限数量，每一个按钮均会按照数组顺序生成对应的回调函数，如：
</div>

```
// eg1       
layer.confirm('询问框？', {
  btn: ['按钮1', '按钮2', '按钮3']
});
// eg2
layer.open({
  content: 'test',
  btn: ['按钮1', '按钮2', '按钮3'],
  // 按钮1 的回调
  btn1: function(index, layero, that){},
  btn2: function(index, layero, that){
    // 按钮2 的回调
    // return false // 点击该按钮后不关闭弹层
  },
  btn3: function(index, layero, that){
    // 按钮3 的回调
    // return false // 点击该按钮后不关闭弹层
  }
});
```

</td>
<td>string</td>
<td>-</td>
    </tr>
    <tr>
<td>

[btnAlign](#options.btnAlign)

</td>
<td>
  
<div id="options.btnAlign" lay-pid="options" class="ws-anchor">
按钮水平对其方式。支持以下可选值：
</div>

- `btnAlign: 'l'` 按钮左对齐
- `btnAlign: 'c'` 按钮水平居中对齐
- `btnAlign: 'r'` 按钮右对齐。默认值，不用设置


</td>
<td>string</td>
<td>

`r`

</td>
    </tr>
    <tr>
<td>

[skin](#options.skin)

</td>
<td>
  
<div id="options.skin" lay-pid="options" class="ws-anchor">
弹层的主题风格。通过赋值对应的 className，实现对主题样式的定制。除了默认主题风格，还支持以下可选主题：
</div>

- `layui-layer-molv` 墨绿主题
- `layui-layer-lan` 深蓝主题
- `layui-layer-win10` Windows 10 主题 <sup>2.8+</sup>

还可传入其他任意 className 来自定义主题。 参考：[#示例](#demo-skin)


</td>
<td>string</td>
<td>-</td>
    </tr>
    <tr>
<td>

[shade](#options.shade)

</td>
<td>
  
<div id="options.shade" lay-pid="options" class="ws-anchor">
弹层的遮罩。 支持以下写法：
</div>

- `shade: 0.3` 设置遮罩深色背景的透明度
- `shade: [0.3, '#FFF']` 设置遮罩透明度和颜色值
- `shade: 0` 不显示遮罩

</td>
<td>number<br>array</td>
<td>

`0.3`

</td>
    </tr>
    <tr>
<td>shadeClose</td>
<td>
  
是否点击遮罩时关闭弹层。当遮罩存在时有效。

</td>
<td>boolean</td>
<td>

`false`

</td>
    </tr>
    <tr>
<td>id</td>
<td>
  
弹层的唯一索引值。 一般用于页面层或 iframe 层弹出时的状态识别，设置该属性可防止弹层的重复弹出。

</td>
<td>string</td>
<td>-</td>
    </tr>
    <tr>
<td>hideOnClose <sup>2.8.3+</sup></td>
<td>
  
关闭弹层时，是否将弹层设置为隐藏状态（而非移除），当再次打开，直接显示原来的弹层。 若设为 `true`，则必须同时设置 `id` 属性方可有效。

</td>
<td>boolean</td>
<td>

`false`

</td>
    </tr>
    <tr>
<td>time</td>
<td>
  
弹层自动关闭所需的毫秒数。 如 `time: 3000` ，即代表 3 秒后自动关闭。 提示框、加载层、Tips 层三种弹出模式默认开启。

</td>
<td>number</td>
<td>

`0`

</td>
    </tr>
    <tr>
<td>fixed</td>
<td>
  
弹层是否固定定位，即始终显示在页面可视区域。

</td>
<td>boolean</td>
<td>

`true`

</td>
    </tr>
    <tr>
<td>zIndex</td>
<td>
  
弹层的初始层叠顺序值。

</td>
<td>number</td>
<td>

`19891014`

</td>
    </tr>
    <tr>
<td>resize</td>
<td>
  
是否允许拖拽弹层右下角拉伸尺寸。 该属性对加载层和 tips 层无效。

</td>
<td>boolean</td>
<td>

`true`

</td>
    </tr>
    <tr>
<td>scrollbar</td>
<td>
  
打开弹层时，是否允许浏览器出现滚动条。

</td>
<td>boolean</td>
<td>

`true`

</td>
    </tr>
    <tr>
<td>minStack <sup>2.6+</sup></td>
<td>
  
点击标题栏的最小化时，是否从页面左下角堆叠排列。

</td>
<td>boolean</td>
<td>

`true`

</td>
    </tr>
    <tr>
<td>removeFocus <sup>2.8+</sup></td>
<td>
  
是否移除弹层触发元素的焦点，避免按回车键时重复弹出。

</td>
<td>boolean</td>
<td>

`true`

</td>
    </tr>
    <tr>
<td>move</td>
<td>
  
绑定弹层的拖拽元素。 默认为触发弹层的标题栏进行拖拽。也可以设置 `move: false` 禁止拖拽。
用法参考：[#示例](#demo-page)

</td>
<td>string<br>DOM<br>boolean</td>
<td>-</td>
    </tr>
    <tr>
<td>moveOut</td>
<td>
  
否允许拖拽到窗口外

</td>
<td>boolean</td>
<td>

`false`

</td>
    </tr>
    <tr>
<td>tips</td>
<td>
  
设置 tips 层的吸附位置和背景色，tips 层的私有属性。

- 若为 `number` 类型，则支持 `1-4` 的可选值，分别代表*上右下左*的吸附位置。如： `tips: 1`
- 若为 `array` 类型，则支持设置吸附位置和背景色，如：

```
tips: [1, '#000'] // 吸附在上的深色贴士层
```

</td>
<td>number<br>array</td>
<td>

`2`

</td>
    </tr>
    <tr>
<td>tipsMore</td>
<td>
  
是否允许同时存在多个 tips 层，即不销毁上一个 tips。

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
<td>

[success](#options.success)

</td>
<td colspan="3">
  
<div id="options.success" class="ws-anchor">
打开弹层成功后的回调函数。返回的参数如下：
</div>

```
layer.open({
  type: 1,
  content: '内容',
  success: function(layero, index, that){
    // 弹层的最外层元素的 jQuery 对象
    console.log(layero);
    // 弹层的索引值
    console.log(index);
    // 弹层内部原型链中的 this --- 2.8+
    console.log(that);
  }
});   
```

</td>
    </tr>
    <tr>
<td>

[yes](#options.yes)

</td>
<td colspan="3">
  
<div id="options.yes" lay-pid="options" class="ws-anchor">

点击「确定」按钮的回调函数。返回的参数同 `success`

</div>

```
layer.open({
  content: '内容',
  yes: function(index, layero, that){
    // do something
    layer.close(index); // 关闭弹层
  }
});  
```

</td>
    </tr>
    <tr>
<td>

[cancel](#options.cancel)

</td>
<td colspan="3">
  
<div id="options.cancel" lay-pid="options" class="ws-anchor">
点击标题栏关闭按钮的回调函数。返回的参数同 `success`
</div>

```
layer.open({
  content: '内容',
  cancel: function(index, layero, that){
    if(confirm('确定要关闭么')){
      layer.close(index);
    }
    return false; // 阻止默认关闭行为
  }
});  
```

</td>
    </tr>
    <tr>
<td>

[end](#options.end)

</td>
<td colspan="3">
  
<div id="options.end" lay-pid="options" class="ws-anchor">
弹层被关闭且销毁后的回调函数。
</div>

```
layer.open({
  content: '内容',
  end: function(){
    console.log('弹层已被移除');
  }
});  
```

</td>
    </tr>
    <tr>
<td>

[moveEnd](#options.moveEnd)

</td>
<td colspan="3">
  
<div id="options.moveEnd" lay-pid="options" class="ws-anchor">
弹层拖拽完毕后的回调函数。
</div>

```
layer.open({
  type: 1,
  content: '内容',
  moveEnd: function(layero){
    console.log('拖拽完毕');
  }
});  
```

</td>
    </tr>
    <tr>
<td>

[resizing](#options.resizing)

</td>
<td colspan="3">

<div id="options.resizing" lay-pid="options" class="ws-anchor">
弹层拉伸过程中的回调函数
</div>

```
layer.open({
  type: 1,
  content: '内容',
  resizing: function(layero){
    console.log('拉伸中');
  }
});  
```

</td>
    </tr>
    <tr>
<td>

[full](#options.full)

</td>
<td colspan="3">
  
<div id="options.full" lay-pid="options" class="ws-anchor">

弹层最大化后的回调函数。返回的参数同 `success`

</div>

```
layer.open({
  type: 1,
  content: '内容',
  full: function(layero, index, that){
    console.log('弹层已最大化');
  }
});  
```

</td>
    </tr>
    <tr>
<td>

[min](#options.min)

</td>
<td colspan="3">
  
<div id="options.min" lay-pid="options" class="ws-anchor">

弹层最小化后的回调函数。返回的参数同 `success`

</div>

```
layer.open({
  type: 1,
  content: '内容',
  min: function(layero, index, that){
    // do something
    // return false; // 阻止默认最小化
  }
});  
```

</td>
    </tr>
    <tr>
<td>

[restore](#options.restore)

</td>
<td colspan="3">
  
<div id="options.restore" lay-pid="options" class="ws-anchor">
弹层被还原后的回调函数。返回的参数同 `success`
</div>

```
layer.open({
  type: 1,
  content: '内容',
  restore: function(layero, index, that){
    console.log('弹层已还原');
  }
});  
```

</td>
    </tr>
  </tbody>
</table>