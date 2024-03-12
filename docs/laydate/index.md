---
title: 日期与时间选择器 laydate
toc: true
---
 
# 日期与时间选择器

> 日期与时间选择器 `laydate` 提供了年、月、日、时、分、秒的多类型选择面板，也是 Layui 的常用组件之一。

<h2 id="examples" lay-toc="{hot: true, anchor: null}" style="margin-bottom: 0;">示例</h2>

<style>
.ws-demo-laydate .layui-form-label{width: 100px;}
.ws-demo-laydate .layui-form-item{margin-bottom: 0;}
.ws-demo-laydate .layui-form-item .layui-inline{margin-bottom: 11px;}
.ws-demo-laydate .layui-input-block{margin-left: 130px;}
.ws-demo-static .layui-inline{margin: 0 16px 16px 0;}
@media screen and (max-width: 450px){
  .layui-form-item .layui-input-inline{margin-left: 130px;}
}
</style>

<div class="ws-demo-laydate">
{{- d.include("/laydate/detail/demo.md") }}
</div>

<p></p>

<h2 id="api" lay-toc="{hot: true, bold: true}">API</h2>

| API | 描述 |
| --- | --- |
| var laydate = layui.laydate | 获得 `laydate` 模块。 |
| [laydate.render(options)](#render) | laydate 组件渲染，核心方法。 |
| [laydate.hint(id, opts)](#hint) <sup>2.8+</sup> | 在对应的 laydate 组件面板上弹出提示层。 |
| [laydate.getInst(id)](#getInst) <sup>2.8+</sup> | 获取组件对应的渲染实例。 |
| [laydate.unbind(id)](#unbind) <sup>2.8+</sup> | 对目标元素解除当前实例的绑定。 |
| [laydate.close(id)](#close) <sup>2.7+</sup> | 关闭日期面板。 |
| [laydate.getEndDate(month, year)](#getEndDate) | 获取某月的最后一天。 |

<h3 id="render" lay-toc="{level: 2}">渲染</h3>

`laydate.render(options);`

- 参数 `options` : 基础属性配置项。[#详见属性](#options)
  <br>注 <sup>2.8+</sup> : 除 `elem` 属性外，其他基础属性也可以直接写在元素的 `lay-options="{}"` 属性中。

```
<input type="text" id="ID-test-laydate">
<input type="text" class="class-test-laydate" lay-options="{value: '2016-10-14'}">
<input type="text" class="class-test-laydate" lay-options="{value: '2017-08-21'}">
 
<!-- import layui --> 
<script>
layui.use(function(){
  var laydate = layui.laydate;
  // 单个渲染
  laydate.render({
    elem: '#ID-test-laydate'
  });
  // 批量渲染
  laydate.render({
    elem: '.class-test-laydate'
  });
});
</script>
```

<h3 id="options" lay-toc="{level: 2, hot: true}">属性</h3>

<div>
{{- d.include("/laydate/detail/options.md") }}
</div>

<h3 id="hint" lay-pid="api" class="ws-anchor ws-bold">弹出提示 <sup>2.8+</sup></h3>

`laydate.hint(id, opts);`

- 参数 `id` : 组件渲染时定义的 `id` 属性值
- 参数 `opts` : 该方法支持的属性可选项，详见下表

| opts | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| content | 提示内容 | string | - |
| ms | 提示层自动消失所需的毫秒数 | number | 3000 |

该方法用于在指定的日期面板弹出一个提示层。

```
var laydate = layui.laydate;
// 渲染
laydate.render({
  elem: '', // 绑定元素选择器
  id: 'test', // 自定义 id 
  // 其他属性 …
});
// 弹出提示
laydate.hint('test', {
  content: '提示内容'
});
```

<h3 id="getInst" lay-pid="api" class="ws-anchor ws-bold">获取实例  <sup>2.8+</sup></h3>

`laydate.getInst(id);`

- 参数 `id` : 组件渲染时定义的 `id` 属性值

该方法用于获取 laydate 对应 id 的渲染实例，以获得该实例对应的成员属性。

```
var laydate = layui.laydate;
// 渲染
laydate.render({
  elem: '', // 绑定元素选择器
  id: 'test', // 自定义 id 
  // 其他属性 …
});
// 获取对应的实例
var inst = laydate.getInst('test');
console.log(inst); // 实例对象
```


<h3 id="unbind" lay-pid="api" class="ws-anchor ws-bold">解除实例绑定 <sup>2.8+</sup></h3>

`laydate.unbind(id);`

- 参数 `id` : 组件渲染时定义的 `id` 属性值

该方法用于对目标元素对应的实例的绑定完全解除，即触发元素事件时，不再执行组件渲染。

```
var laydate = layui.laydate;
// 渲染
laydate.render({
  elem: '', // 绑定元素选择器
  id: 'test', // 自定义 id 
  // 其他属性 …
});
// 解除对应的实例绑定
laydate.unbind('test');
```


<h3 id="close" lay-pid="api" class="ws-anchor ws-bold">关闭日期面板 <sup>2.7+</sup></h3>

`laydate.close(id);`

- 参数 `id` : 组件渲染时定义的 `id` 属性值。 若 `id` 参数不填，则关闭当前打开的日期面板

该方法用于关闭对应的日期面板

```
var laydate = layui.laydate;
// 渲染
laydate.render({
  elem: '', // 绑定元素选择器
  id: 'test', // 自定义 id 
  // 其他属性 …
});
// 关闭对应的日期面板
laydate.close('test');
```

<h3 id="getEndDate" lay-pid="api" class="ws-anchor ws-bold">获取某月的最后一天</h3>

`laydate.getEndDate(month, year);`

- 参数 `month` : 月份，默认为当前月。
- 参数 `year` : 年份，默认为今年。

该方法用于获取某个月份的最后一天

```
var days1 = laydate.getEndDate(10); // 获得 10 月的最后一天为 31 号
var days2 = laydate.getEndDate(2, 2080); // 获得 2080 年 2 月的最后一天为 29 号
```

## 贴士

> laydate 曾经可作为单独组件使用，鉴于维护成本的考量，目前 laydate 组件已完全集成到 Layui 中，而单独版本已不做同步维护。
因此，建议直接使用 layui 中 laydate 即可。


