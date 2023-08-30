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
<td>width</td>
<td>
  
设定轮播容器宽度，值支持：*像素*、*auto*、*百分比*。

</td>
<td>string</td>
<td>

`600px`

</td>
    </tr>
    <tr>
<td>height</td>
<td>
  
设定轮播容器高度，值支持的类型同 `width` 属性

</td>
<td>string</td>
<td>

`280px`

</td>
    </tr>
    <tr>
<td>full</td>
<td>
  
是否全屏轮播

</td>
<td>boolean</td>
<td>

`false`

</td>
    </tr>
    <tr>
<td>anim</td>
<td>
  
轮播切换动画方式。可选值有：

- `default` 左右切换
- `updown` 上下切换
- `fade` 渐隐渐显切换

</td>
<td>boolean</td>
<td>

`default`

</td>
    </tr>
    <tr>
<td>autoplay</td>
<td>
  
是否自动切换，可选值有：

- `true` 自动滚动，鼠标移入会暂停、移出重新恢复
- `false` 不自动滚动
- `always` 始终自动滚动，不受鼠标移入移出影响 <sup>2.7+</sup>


</td>
<td>boolean<br>string</td>
<td>

`true`

</td>
    </tr>
    <tr>
<td>interval</td>
<td>
  
自动切换的时间间隔，单位： ms （毫秒），不能低于 800

</td>
<td>number</td>
<td>

`3000`

</td>
    </tr>
    <tr>
<td>index</td>
<td>
  
初始开始的条目下标

</td>
<td>number</td>
<td>

`0`

</td>
    </tr>
    <tr>
<td>arrow</td>
<td>
  
切换箭头默认显示状态，可选值有：

- `hover` 鼠标悬停显示
- `always` 始终显示
- `none` 始终不显示

</td>
<td>string</td>
<td>

`hover`

</td>
    </tr>
    <tr>
<td>indicator</td>
<td>
  
指示器位置，可选值有：

- `inside` 显示在容器内部
- `outside` 显示在容器外部
- `none` 不显示

注 : 若设定了 `anim: 'updown'` ，则 `outside` 值无效

</td>
<td>string</td>
<td>

`inside`

</td>
    </tr>
    <tr>
<td>trigger</td>
<td>
  
指示器的触发事件

</td>
<td>string</td>
<td>

`click`

</td>
    </tr>
    <tr>
<td colspan="4" style="text-align: center"> 


<div id="options.callback" class="ws-anchor">

[回调函数](#options.callback)

</div>

</td>
    </tr>
    <tr>
<td>change <sup>2.7+</sup></td>
<td colspan="3">

<div id="options.change" lay-pid="options" class="ws-anchor">  
轮播切换后的回调函数，返回一个对象参数。
</div>

```
carousel.render({
  elem: '#id',
  change: function(obj){
    console.log(obj.index); // 当前条目的索引
    console.log(obj.prevIndex); // 上一个条目的索引
    console.log(obj.item); // 当前条目的元素对象
  }
});
```

注：在 `2.7` 之前的版本，需通过 carousel 的 `change` 事件来实现，如：

```
var carousel = layui.carousel;

// 轮播渲染
carousel.render(options); 

// 触发轮播切换事件
carousel.on('change(filter)', function(obj){ // filter 对应轮播容器的 lay-filter 属性值
  console.log(obj);
});  
```

</td>
    </tr>
  </tbody>
</table>

### 贴士

> 若轮播的填充内容为图片，且 `width` 或 `height` 为自适应，那么需动态获取父容器宽高，从而适配父容器。 当浏览器窗口尺寸发生变化时，可在窗口 `resize` 事件中通过轮播重载来重设宽高值。