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
<td>url</td>
<td>
  
上传接口

</td>
<td>string</td>
<td>-</td>
    </tr>
    <tr>
<td>field</td>
<td>
  
文件域的字段名

</td>
<td>string</td>
<td>

`file`

</td>
    </tr>
    <tr>
<td>
  
[data](#options.data)

</td>
<td>

<div id="options.data" lay-pid="options" class="ws-anchor">  
传递给上传接口的额外参数，支持静态赋值和动态赋值两种写法。
</div>

- 静态赋值 : 

```
data: {
  id: '123'
}
```

- 动态赋值 : 

```
data: {
  id: function(){
    return $('#id').val();
  }
}
```

</td>
<td>object</td>
<td>-</td>
    </tr>
    <tr>
<td>headers</td>
<td>
  
上传接口的请求头。如 `headers: {token: 'abc123'}`

</td>
<td>object</td>
<td>-</td>
    </tr>
    <tr>
<td>
  
[accept](#options.accept)

</td>
<td>

<div id="options.accept" lay-pid="options" class="ws-anchor">
指定允许上传时校验的文件类型。可选值有：
</div>  

- `images` 图片类型
- `file` 所有文件类型
- `video` 视频类型
- `audio` 音频类型

</td>
<td>string</td>
<td>

`images`

</td>
    </tr>
    <tr>
<td>acceptMime</td>
<td>
  
规定打开系统的文件选择框时，筛选出的文件类型，多个 `MIME` 类型可用逗号隔开。示例：

```
acceptMime: 'image/*'` // 筛选所有图片类型
acceptMime: 'image/jpeg, image/png` // 只筛选 jpg,png 格式图片
```

更多可选值参考: <a href="https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/MIME_types" target="_blank">MIME 类型</a>

</td>
<td>string</td>
<td>-</td>
    </tr>
    <tr>
<td>
  
[exts](#options.exts)

</td>
<td>

<div id="options.exts" lay-pid="options" class="ws-anchor">

允许上传的文件后缀。一般结合 `accept` 属性来设定。

</div>  

- 假设 `accept: 'file'` 类型时，那么设置 `exts: 'zip|rar|7z'` 即代表只允许上传压缩格式的文件。
- 默认为常见图片后缀，即 `jpg|png|gif|bmp|jpeg|svg`

</td>
<td>string</td>
<td>

见左

</td>
    </tr>
    <tr>
<td>auto</td>
<td>
  
是否选完文件后自动上传。若为 `false`，则需设置 `bindAction` 属性来指向其它按钮提交上传。参考：[#示例](#demo-auto)

</td>
<td>boolean</td>
<td>

`true`

</td>
    </tr>
    <tr>
<td>bindAction</td>
<td>
  
设置触发上传的元素选择器或 DOM 对象。
<br>一般配合 `auto: false` 来使用。详细用法参考：[#示例](#demo-auto)

</td>
<td>string/DOM</td>
<td>-</td>
    </tr>
    <tr>
<td>force <sup>2.6.9+</sup></td>
<td>
  
规定强制返回的数据格式。

- 若值为 `'json'`，则强制校验 JSON 数据格式

</td>
<td>string</td>
<td>

`null`

</td>
    </tr>
    <tr>
<td>size</td>
<td>
  
设置文件最大可允许上传的大小，单位 `KB` 。默认不限制。
<br>不支持 `ie8/9`

</td>
<td>number</td>
<td>

`0`

</td>
    </tr>
    <tr>
<td>multiple</td>
<td>
  
是否允许多文件上传。不支持 `ie8/9`

</td>
<td>boolean</td>
<td>

`false`

</td>
    </tr>
    <tr>
<td>unified <sup>2.8.8+</sup></td>
<td>
  
选择多文件时，是否统一上传，即只发送一次请求。

</td>
<td>boolean</td>
<td>

`false`

</td>
    </tr>
    <tr>
<td>number</td>
<td>
  
同时可上传的文件数量，一般当 `multiple: true` 时使用。

</td>
<td>number</td>
<td>-</td>
    </tr>
    <tr>
<td>drag</td>
<td>
  
是否接受拖拽的文件上传。

</td>
<td>boolean</td>
<td>

`true`

</td>
    </tr>
    <tr>
<td>
  
[text](#options.text) <sup>2.8.9+</sup>

</td>
<td colspan="4">

<div id="options.text" lay-pid="options" class="ws-anchor">  

自定义内部各类场景下的提示文本

</div>

```
text: { // 自定义提示文本
  "data-format-error": "", // 数据格式错误的提示
  "check-error": "", // 文件格式校验失败的提示
  "error": "", // 上传失败的提示
  "limit-number": null, // 限制 number 属性的提示。若设置，需为函数写法
  "limit-size": null, // 限制 size 属性的提示。若设置，需为函数写法
  "cross-domain": "", // IE 下跨域的提示
}
```

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
  
[choose](#options.choose)

</td>
<td colspan="3">
  
<div id="options.choose" lay-pid="options" class="ws-anchor">
选择文件后的回调函数。返回的参数如下
</div>

```
choose: function(obj){
  // 将每次选择的文件追加到文件队列
  var files = obj.pushFile();
  
  // 预读本地文件，如果是多文件，则会遍历。(不支持ie8/9)
  obj.preview(function(index, file, result){
    console.log(index); // 得到文件索引
    console.log(file); // 得到文件对象
    console.log(result); // 得到文件base64编码，比如图片
    
    // obj.resetFile(index, file, '123.jpg'); // 重命名文件名
    
    // 这里还可以做一些 append 文件列表 DOM 的操作
    
    // obj.upload(index, file); // 对上传失败的单个文件重新上传，一般在某个事件中使用
    // delete files[index]; //删除列表中对应的文件，一般在某个事件中使用
  });
}
```

详细用法参考：[#示例](#demo-files-table)

</td>
    </tr>
    <tr>
<td>
  
[before](#options.before)

</td>
<td colspan="3">
  
<div id="options.before" lay-pid="options" class="ws-anchor">
文件提交上传前的回调函数。返回的参数同 choose
</div>

```
before: function(obj){ // obj 参数同 choose
  layer.load(); // 上传 loading
  
  // 若返回 false，则表明阻止上传
  /*
  if(true){
    return false;
  }
  */
}
```

</td>
    </tr>
    <tr>
<td>
  
[progress](#options.progress)

</td>
<td colspan="3">
  
<div id="options.progress" lay-pid="options" class="ws-anchor">
执行上传请求后的回调函数。返回的参数如下：
</div>

```
progress: function(n, elem, res, index){
  var percent = n + '%' // 获取进度百分比
  element.progress('demo', percent); // 可配合 layui 进度条元素使用
  
  // 得到当前触发的元素 DOM 对象
  console.log(elem); // 可通过该元素定义的属性值匹配到对应的进度条。
  console.log(res); // 得到 progress 响应信息
  
  console.log(index); // 得到当前上传文件的索引，多文件上传时的进度条控制
  element.progress('demo-'+ index, n + '%'); // 进度条
}
```

详细用法参考：[#示例](#examples)
</td>
    </tr>
    <tr>
<td>
  
[done](#options.done)

</td>
<td colspan="3">
  
<div id="options.done" lay-pid="options" class="ws-anchor">
执行单次文件上传请求后的回调函数。返回的参数如下：
</div>

```
done: function(res, index, upload){
  // 假设 `code: 0` 代表上传成功
  if(res.code == 0){
    // do something // 比如将 res 返回的图片链接保存到隐藏域
  }
  
  // 获取当前触发上传的元素，一般用于 elem 绑定 class 的情况
  var item = this.item;
  
  // …
}
```

详细用法参考：[#示例](#examples)

</td>
    </tr>
    <tr>
    <tr>
<td>
  
[allDone](#options.allDone)

</td>
<td colspan="3">
  
<div id="options.allDone" lay-pid="options" class="ws-anchor">

当开启多文件 (`multiple: true` ) 且所有文件均上传完毕后的状态回调函数。

</div>

```
allDone: function(obj){
  console.log(obj.total); // 上传的文件总数
  console.log(obj.successful); // 上传成功的文件数
  console.log(obj.failed); // 上传失败的文件数
}
```

</td>
    </tr>
    <tr>
<td>error</td>
<td colspan="3">
  
执行上传请求出现异常的回调（一般为网络异常、URL 404等）。返回两个参数如下：

```
error: function(index, upload){
  console.log(index); // 当前文件的索引
  // upload(); 重新上传的方法
}
```

</td>
    </tr>
  </tbody>
</table>