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
<td>string</td>
<td>-</td>
    </tr>
    <tr>
<td>scrollElem</td>
<td>
  
指定触发流加载的滚动条所在元素选择器。

</td>
<td>string</td>
<td>

`document`

</td>
    </tr>
    <tr>
<td>isAuto</td>
<td>
  
是否自动加载。 若设为 `false`，则会在列表底部生成一个「加载更多」的按钮，那么可点击该按钮加载下一页数据。

</td>
<td>boolean</td>
<td>

`true`

</td>
    </tr>
    <tr>
<td>end</td>
<td>
  
设置加载完毕后的最尾部的内容，可传入任意 HTML 字符。

</td>
<td>string</td>
<td>

<code style="font-size: 13px;">没有更多了</code>

</td>
    </tr>
    <tr>
<td>isLazyimg</td>
<td>
  
是否开启信息流中的图片懒加载。若设为 `true` ，则只会对在可视区域的图片进行按需加载。但同时，在拼接列表字符的时候，您不能给列表中的 `<img>` 标签赋值 `src`，必须要用 `lay-src` 属性取代，如：

```    
layui.each(data, function(index, item){
  lis.push('<li><img lay-src="'+ item.src +'"></li>');
});  
``` 

</td>
<td>boolean</td>
<td>

`false`

</td>
    </tr>
    <tr>
<td>mb</td>
<td>
  
与底部的临界距离。 即当滚动条与底部产生该距离时，触发加载。 必须 `isAuto:true` 时有效。

*小贴士*： 此处 `mb` 属性名是 css 中 `margin-bottom` 的简写，可并非国粹之语 😅

</td>
<td>number</td>
<td>

`50`

</td>
    </tr>
    <tr>
<td>done</td>
<td colspan="3">

<div id="options.done" lay-pid="options" class="ws-anchor">  
滚动条到达临界点触发加载的回调函数。函数返回的参数如下：
</div>

```
done: function(page, next){
  console.log(page) // 获得当前页
  
  // 执行下一页渲染，第二参数为：满足“加载更多”的条件，即后面仍有分页
  // 只有当前页小于总页数的情况下，才会继续出现加载更多
  next('列表 HTML 片段', page < res.pages); 
}
```

详细用法可参考：[#示例](#examples)

</td>
    </tr>
  </tbody>
</table>