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
  
绑定分页容器。值可以是容器 `id` 或 DOM 对象。如：

- `elem: 'id'` 注意：这里不能加 `#` 号
- `elem: document.getElementById('id')`

</td>
<td>string<br>DOM</td>
<td>-</td>
    </tr>
    <tr>
<td>count</td>
<td>
  
数据总数。一般通过后端得到

</td>
<td>number</td>
<td>-</td>
    </tr>
    <tr>
<td>limit</td>
<td>
  
每页显示的条数。

</td>
<td>number</td>
<td>

`10`

</td>
    </tr>
    <tr>
<td>limits</td>
<td>
  
每页条数的选择项。 若 `layout` 参数开启了 `limit` ，则会出现每页条数的 select 选择框

</td>
<td>array</td>
<td>

`[10,…,50]`

</td>
    </tr>
    <tr>
<td>curr</td>
<td>
  
初始化当前页码。

</td>
<td>number</td>
<td>

`1`

</td>
    </tr>
    <tr>
<td>groups</td>
<td>
  
连续出现的页码数量

</td>
<td>number</td>
<td>

`5`

</td>
    </tr>
    <tr>
<td>prev</td>
<td>
  
自定义“上一页”的内容，支持传入普通文本和 HTML

</td>
<td>string</td>
<td>

`上一页`

</td>
    </tr>
    <tr>
<td>next</td>
<td>
  
自定义“下一页”的内容，用法同上。

</td>
<td>string</td>
<td>

`下一页`

</td>
    </tr>
    <tr>
<td>first</td>
<td>
  
自定义“首页”的内容，用法同上。

</td>
<td>string</td>
<td>

`1`

</td>
    </tr>
    <tr>
<td>last</td>
<td>
  
自定义“尾页”的内容，用法同上。

</td>
<td>string</td>
<td>

*自动获得*

</td>
    </tr>
    <tr>
<td>layout</td>
<td>
  
自定义分页功能区域排版。可自由排列，可选值有：

- `count` 数据总数区域
- `prev` 上一页区域
- `page` 分页区域
- `next` 下一页区
- `limit` 条目选项区域
- `refresh` 页面刷新区
- `skip` 快捷跳页区

</td>
<td>array</td>
<td>

<button class="layui-btn layui-btn-sm layui-btn-primary" lay-layer="{
  title: 'layout 属性默认值',
  content: '<div>layout: [\'prev\',\'page\',\'next\']</div>'
}">查看默认值</button>

</td>
    </tr>
    <tr>
<td>theme</td>
<td>
  
自定义主题。支持传入：颜色值或任意普通字符。如：

- `theme: '#c00'` 直接设置当前页按钮背景色
- `theme: 'xxx'` 会生成 `class="layui-laypage-xxx"` 的 CSS 类，以便自定义主题

</td>
<td>string</td>
<td>-</td>
    </tr>
    <tr>
<td>hash</td>
<td>
  
设置 `hash` 名称。设置该属性后，点击分页将会自动对当前 `url` 追加：`#{hash}={curr}`，从而在页面刷新时初始化当前页码。[#详细用法参考示例](#demo-hash)

</td>
<td>string</td>
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
  
[jump](#options.jump)

</td>
<td colspan="3">
  
<div id="options.jump" lay-pid="options" class="ws-anchor">分页跳转后的回调函数。函数返回两个参数：</div>

- 参数 `obj` : 当前分页相关的所有选项值
- 参数 `first` : 是否首次渲染，一般用于初始加载的判断

```
laypage.render({
  elem: 'id',
  count: 70, // 数据总数，从后端得到
  jump: function(obj, first){
    console.log(obj.curr); // 得到当前页，以便向服务端请求对应页的数据。
    console.log(obj.limit); // 得到每页显示的条数
    
    // 首次不执行
    if(!first){
      // do something
    }
  }
});
```

</td>
    </tr>
  </tbody>
</table>

