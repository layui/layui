---
title: 工具模块 util
toc: true
---
 
# 工具模块

> 工具模块 `util` 是由工具类方法和小组件组成的集合。

<h2 id="examples" lay-toc="{hot: true}" style="margin-bottom: 0;">示例</h2>

<div>
{{- d.include("/util/detail/demo.md") }}
</div>

<p></p>

<h2 id="api" lay-toc="{hot: true}">API</h2>

| API | 描述 |
| --- | --- |
| var util = layui.util | 获得 `util` 模块。 |
| [util.fixbar(options)](../fixbar/) | 固定条组件 |
| [util.countdown(options)](#countdown) | 倒计时组件 |
| [util.timeAgo(time, onlyDate)](#timeAgo) | 某个时间在多久前 |
| [util.toDateString(time, format, options)](#toDateString) | 将毫秒数或日期对象转换成日期格式字符 |
| [util.digit(num, length)](#digit) | 数字前置补零 |
| [util.escape(str)](#escape) | 转义 HTML 字符 |
| [util.unescape(str)](#escape) | 还原 HTML 字符 |
| [util.openWin(options)](#openWin) <sup>2.8+</sup> | 打开浏览器新标签页 |
| [util.on(attr, obj, eventType)](#on) | 批量事件处理 |

<h3 id="countdown" class="ws-anchor ws-bold">倒计时</h3>

`util.countdown(options);`

- 参数 `options` <sup>2.8.9+</sup>: 属性配置项。可选项详见下表：

| 属性 | 描述 |
| --- | --- |
| date | 目标时间值。值可以为毫秒数或 `Date` 对象 |
| now | 当前时间值，一般为当前服务器时间。值可以为毫秒数或 `Date` 对象  |
| ready | 倒计时初始时的回调函数。 |
| clock | 倒计时计时中的回调函数，每秒触发一次，直到计时完成。 |
| done | 倒计时计时完成的回调函数，即到达目标时间值时触发 |

- 注： <sup>2.8.9</sup> 之前的版本写法为：`util.countdown(date, now, clock);`

该方法返回的实例对象成员如下 <sup>2.8.9+</sup>：

```js
var countdown = util.countdown(options);
countdown.clear(); // 清除当前倒计时
countdown.reload(options); // 重载当前倒计时。
countdown.timer; // 当前倒计时计时器 ID
```

相关用法可参考：[#示例](#examples)

```js
layui.use('util', function(){
  var util = layui.util;
  // 示例
  util.countdown({
    date: '2099-1-1', // 目标时间值
    now: new Date(), // 当前时间，一般为服务器时间，此处以本地时间为例
    clock: function(obj, countdown){ // 计时中
      console.log(obj); // 得到当前计时器的「天、时、分、秒」值
      console.log(countdown); // 得到当前实例对象
    },
    done: function(obj, countdown){ // 计时完成
      console.log('time is up');
    }
  });
});
```

<h3 id="timeAgo" class="ws-anchor ws-bold">某个时间在多久前</h3>

`var result = util.timeAgo(time, onlyDate);`

- 参数 `time` : 某个时间的毫秒数或日期对象
- 参数 `onlyDate` : 是否在超过 30 天后，只返回日期字符，而不返回时分秒

返回结果

- 若 `time` 在 3 分钟以内，返回： 刚刚
- 若 `time` 在 30 天以内，返回： 若干分钟前、若干小时前、若干天前，如：5 分钟前
- 若 `time` 在 30 天以上，返回： 日期字符，如： 2023-01-01

```
var result = util.timeAgo(1672531200000); // 2023-01-01 00:00:00
```

相关效果见：[#示例](#examples)


<h3 id="toDateString" class="ws-anchor ws-bold">转换日期格式字符</h3>

`var result = util.toDateString(time, format, options);`

- 参数 `time` : 毫秒数或日期对象
- 参数 `format` : 日期字符格式。默认格式：`yyyy-MM-dd HH:mm:ss` 。可自定义，如： `yyyy年MM月dd日`
- 参数 `options` <sup>2.8.13+</sup> : 该方法的属性可选项，详见下表：

| 属性名 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| customMeridiem | 自定义 meridiem 格式 | Function | - |

```
var result = util.toDateString(1672531200000, 'yyyy-MM-dd'); // 2023-01-01

// 中括号中的字符会原样保留 2.8.13+
var result2 = util.toDateString(new Date('2023-01-01 11:35:25'), 'ss[s]'); // 25s

// 自定义 meridiem
var result3 = util.toDateString(
  '2023-01-01 11:35:25', 
  'hh:mm:ss A',
  {
    customMeridiem: function(hours, minutes){
      return (hours < 12 ? 'AM' : 'PM')
        //.split('').join('.') // 有句点，A.M.
        //.toLowerCase() // 小写，a.m.
    }
  }
); // 11:35:25 AM
```

参数 `format` 所有可用的格式列表 : 

| 格式 | 示例 | 描述 |
| --- | --- | --- |
| yy <sup>2.8.13+</sup> | 23 | 年，两位数 |
| yyyy | 2023 | 年，四位数 |
| M <sup>2.8.13+</sup> | 1-12 | 月 |
| MM | 01-12 | 月，两位数 |
| d <sup>2.8.13+</sup> | 1-31 | 日 |
| dd | 01-31 | 日，两位数 |
| H <sup>2.8.13+</sup> | 0-23 | 小时 |
| HH | 00-23 | 小时，两位数 |
| h <sup>2.8.13+</sup> | 1-12 | 小时，12 小时制 |
| hh <sup>2.8.13+</sup> | 01-12 | 小时，12 小时制，两位数 |
| A <sup>2.8.13+</sup> | 凌晨/早上/上午/中午/下午/晚上 | meridiem |
| m <sup>2.8.13+</sup> | 0-59 | 分钟 |
| mm | 00-59 | 分钟，两位数 |
| s <sup>2.8.13+</sup> | 0-59 | 秒 |
| ss | 00-59 | 秒，两位数 |
| SSS <sup>2.8.13+</sup> | 000-999 | 毫秒，三位数 |

<h3 id="digit" class="ws-anchor ws-bold">数字前置补零</h3>

`util.digit(num, length);`

- 参数 `num` : 原始数字
- 参数 `length` : 数字长度，如果原始数字长度小于 length，则前面补零

该方法返回一个 `string` 类型的结果，如：

```
var rs1 = util.digit(6, 2); // "06"
var rs2 = util.digit(7, 3); // "007"
```


<h3 id="escape" class="ws-anchor ws-bold">转义和还原 HTML</h3>

- `util.escape(str);` 转义 HTML
- `util.unescape(str);` 还原被转义的 HTML

参数 `str` : 任意 HTML 字符

```
var str1 = util.escape('<div>123</div>'); // 返回： &lt;div&gt;123&lt;/div&gt;
var str2 = util.unescape('&lt;div&gt;123&lt;/div&gt;'); // 返回： <div>123</div>
```

<h3 id="openWin" class="ws-anchor ws-bold">打开浏览器新标签页 <sup>2.8+</sup></h3>

`util.openWin(options);` 

- 参数 `options` : 属性配置项。可选项详见下表

| 属性 | 描述 |
| --- | --- |
| url | 要打开页面 `URL` |
| target | 打开页面的方式或窗口 `name` |
| content | 打开的页面内容。若设置了 `url` 属性，则该属性无效 |
| specs | 窗口的相关配置，同 `window.open()` 的 `specs` |
| window | 当前所在的窗口对象，默认 `self` |

该方法基于原生 `window.open()` 的二次封装，以提升打开浏览器窗口的灵活性。

```
// 打开一个 url
util.openWin({
  url: 'https://cn.bing.com'
});
// 打开一个自定义内容窗口
util.openWin({
  content: 'Hello World.'
});
```

<h3 id="on" class="ws-anchor ws-bold">批量事件处理</h3>

`util.on(attr, obj, eventType);`

- 参数 `attr` : 触发事件的元素属性名
- 参数 `obj` : 事件回调函数集合
- 参数 `eventType` : 事件类型。默认 `click`

<pre class="layui-code" lay-options="{preview: true, codeStyle: 'height: 535px;', layout: ['code', 'preview'], tools: ['full']}">
  <textarea>
<div class="layui-btn-container">
  <button class="layui-btn" lay-on="e1">事件 1</button>
  <button class="layui-btn" lay-on="e2">事件 2</button>
  <button class="layui-btn" lay-on="e3">事件 3</button>
</div>

<!-- import layui -->
<script>
layui.use('util', function(){
  var util = layui.util;
  
  // 处理属性 为 lay-on 的所有元素事件
  util.on('lay-on', {
    e1: function(){
      console.log(this); // 当前触发事件的 DOM 对象
      layer.msg('触发了事件 1');
    },
    e2: function(){
      layer.msg('触发了事件 2');
    },
    e3: function(){
      layer.msg('触发了事件 3');
    }
  });
});
</script>
  </textarea>
</pre>
