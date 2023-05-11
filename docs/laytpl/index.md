---
title: 模板引擎 laytpl
toc: true
---
 
# 模板引擎

> `laytpl` 是 Layui 的一款轻量 JavaScript 模板引擎，在字符解析上有着比较出色的表现。

<h2 id="test" lay-toc="{hot: true}" style="margin-bottom: 0;">在线测试</h2>

在以下*模板*或*数据*中进行编辑，下方*视图*将呈现对应结果。

<div>
{{- d.include("/laytpl/detail/demo.md") }}
</div>

<h2 id="api" lay-toc="{}">API</h2>

| API | 描述 |
| --- | --- |
| var laytpl = layui.laytpl | 获得 `laytpl` 模块。 |
| [laytpl(str, options).render(data, callback)](#render) | laytpl 组件渲染，核心方法。 |
| [laytpl.config(options)](#config) | 配置 laytpl 全局属性 |

<h2 id="render" lay-toc="{level: 2, hot: true, title: '解析和渲染'}">模板解析和渲染</h2>

`laytpl(str, options).render(data, callback);`

- 参数 `str` : 模板原始字符
- 参数 `options` <sup>2.8+</sup> : 当前模板实例的属性配置项。可选项详见：[#属性配置](#config)
- 参数 `data` : 模板数据
- 参数 `callback` : 模板渲染完毕的回调函数，并返回渲染后的字符

{{!

```
layui.use('laytpl', function(){
  var laytpl = layui.laytpl;
  
  // 直接解析字符
  laytpl('{{= d.name }}是一名前端工程师').render({
    name: '张三'
  }, function(str){
    console.log(str); // 张三是一名前端工程师
  });
  
  // 同步写法
  var str =  laytpl('{{= d.name }}是一名前端工程师').render({
    name: '张三'
  });
  console.log(str);  // 张三是一名前端工程师
});
```

若模板字符较大，可存放在页面某个标签中，如：

```
<script id="TPL" type="text/html">
  <h3>{{= d.name }}</h3>
  <p>性别：{{= d.sex ? '男' : '女' }}</p>
</script>
 
<div id="view"></div>
 
<!-- import layui -->
<script>
layui.use(function(){
  var laytpl = layui.laytpl;

  // 渲染
  var data = {
    name: '张三',
    sex: 1
  };
  var getTpl = document.getElementById('TPL').innerHTML; // 获取模板字符
  var elemView = document.getElementById('view'); // 视图对象
  // 渲染并输出结果
  laytpl(getTpl).render(data, function(str){
    elemView.innerHTML = str;
  });
});
</script>
```

!}}

在实际使用时，若模板通用，而数据不同，为减少模板解析的开销，可将语句分开书写，如。

```
var compile = laytpl(str); // 模板解析
compile.render(data, callback); // 模板渲染
```

<h2 id="grammar" lay-toc="{level: 2, hot: true}">标签语法</h2>

<div>
{{- d.include("/laytpl/detail/options.md") }}
</div>


<h2 id="config" lay-toc="{level: 2}">属性配置</h2>

`laytpl.config(options);`

- 参数 `options` : 属性配置项。可选项详见下表

| 属性 | 描述 |
| --- | --- |
| open | 标签符前缀 |
| close | 标签符后缀 |

### 全局配置

若模板默认的标签符与其他模板存在冲突，可通过该方法重新设置标签符，如：

```
laytpl.config({
  open: '<%',
  close: '%>'
});
 
// 模板语法将默认采用上述定义的标签符书写
laytpl(`
  <%# var job = ["前端工程师"]; %>
  <%= d.name %>是一名<%= job[d.type] %>。
`).render({
  name: '张三',
  type: 0
}, function(string){
  console.log(string); // 张三是一名前端工程师。
}); 
```

### 局部配置 <sup>2.8+</sup>

若不想受到上述全局配置的影响，可在 `laytpl(str, options)` 方法的第二个参数中设置当前模板的局部属性，如：

```
laytpl('<%= d.name %>是一名前端工程师', {
  open: '<%',
  close: '%>'
}).render({name: '张三'}, function(string){
  console.log(string); // 张三是一名前端工程师。
}); 
```


## 贴士

> Layui table 等组件的动态模板功能，均采用 laytpl 驱动。 laytpl 亦可承载单页面应用开发中的视图模板。

