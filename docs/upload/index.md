---
title: 上传组件 upload
toc: true
---
 
# 上传组件

> 上传组件 `upload` 是用于处理文件上传的前端交互逻辑，可以更好地协助后端实现文件从本地到服务端上传的对接。

<h2 id="examples" lay-toc="{hot: true, anchor: null}" style="margin-bottom: 0;">示例</h2>

以下示例的部分上传接口由第三方网站 `https://httpbin.org` 提供，它可以模拟各类 HTTP 请求。若未配置上传接口的，每次上传都会报「请求上传接口出现异常」的提示，这属于正常现象。

<div>
{{- d.include("/upload/detail/demo.md") }}
</div>

<p></p>

<h2 id="api" lay-toc="{hot: true}">API</h2>

| API | 描述 |
| --- | --- |
| var upload = layui.upload | 获得 `upload` 模块。 |
| [var inst = upload.render(options)](#render) | upload 组件渲染，核心方法。 |
| [inst.upload()](#upload) | 对当前实例提交上传 |
| [inst.reload(options)](#reload) | 对当前实例进行重载 |
| inst.config | 获得当前实例的属性配置项 |

<h3 id="render" lay-toc="{level: 2, hot: true}">渲染</h3>

`upload.render(options);`

- 参数 `options` : 基础属性配置项。[#详见属性](#options)
  <br>注 : 除 `elem` 属性外，其他基础属性也可以直接写在元素的 `lay-options="{}"` 属性中。

```
<button type="button" class="layui-btn" id="ID-test-uoload">上传</button>
<button type="button" class="layui-btn test-class-upload" lay-options="{}">上传</button>
<button type="button" class="layui-btn test-class-upload" lay-options="{}">上传</button>
  
<!-- import layui -->
<script>
layui.use(function(){
  var upload = layui.upload;
  // 单个渲染
  upload.render({
    elem: '#ID-test-uoload',
    // …
  });
  // 批量渲染
  upload.render({
    elem: '.test-class-upload',
    // …
  });
});
</script>
```

该方法返回一个实例对象，包含操作当前实例的相关方法成员。

```
var inst = upload.render(options);
console.log(inst); // 得到当前实例对象
```

<h3 id="upload" lay-toc="{level: 2}">提交上传</h3>

`inst.upload();`

- 无需传递参数

文件在进行选择后，会自动提交上传。而若文件*上传失败*，则可以使用该方法来重新上传，

```
// 渲染
var inst = upload.render({
  elem: '#id',
  error: function(){ // 上传失败的回调
    // 当上传失败时，可在此处生成「重新上传」按钮，并执行该方法重新触发上传提交
    /*
    $('#btn').on('click', function(){
      inst.upload();
    })
    */
  }
  // …
}); 
```

<h3 id="reload" lay-toc="{level: 2}">重载</h3>

`inst.reload(options);`

- 参数 `options` : 基础属性配置项。[#详见属性](#options)

该方法用于对当前的上传实例进行完整重载，所有属性均可参与到重载中。

```
// 渲染
var inst = upload.render({
  elem: '#id',
  // …
});
 
// 重载
inst.reload({
  field: 'AAA',
  // …
})
```

<h3 id="options" lay-toc="{level: 2, hot: true}">属性</h3>

<div>
{{- d.include("/upload/detail/options.md") }}
</div>

<h2 id="cors-upload" lay-toc="{}">跨域方案</h2>

`upload` 组件支持跨域上传，一般有以下两种场景

- 自建上传服务。在服务端配置 `CORS` 开启跨资源共享。 即对接口所在的服务器设置 `Access-Control-Allow-Origin ` 相关 `header` 信息。

- 第三方上传服务。如：阿里云、腾讯云等，只需按照不同平台对应的上传 SDK 进行操作即可。