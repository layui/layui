<table class="layui-table">
  <colgroup>
    <col width="150">
    <col>
  </colgroup>
  <thead>
    <tr>
      <th>标签</th>
      <th>描述</th>
    </tr> 
  </thead>
  <tbody>{{!
    <tr>
<td>{{= }}</td>
<td>
  
转义输出。若字段存在 HTML，将进行转义。

```
<h2>{{= d.title }}</h2>
```

</td>
    </tr>
    <tr>
<td>{{- }} <sup>2.8+</sup></td>
<td>
  
原始输出。若字段存在 HTML，将正常渲染。

```
<div>{{- d.content }}</div>
```

该语句一般在需要正常渲染 HTML 时用到，但若字段存在 script 等标签，为防止 xss 问题，可采用 `{{= }}` 进行转义输出。

> ### 注意
> 由于 `2.6.11` 版本对 laytpl 语句进行了重要调整，原 `{{ }}` 语法即等同 `{{- }}`，升级版本时，请进行相应调整。可参考：https://gitee.com/layui/layui/issues/I5AXSP

</td>
    </tr>
    <tr>
<td>{{# }}</td>
<td>
  
 JavaScript 语句。一般用于逻辑处理。

 ```
<div>
{{# 
  var fn = function(){
    return '2017-08-18';
  }; 
}}
{{# if(true){ }}
  开始日期：{{= fn() }}
{{# } else { }}
  已截止
{{# } }}
</div>
 ```

</td>
    </tr>!}}
    <tr>
<td>{{!{{! !}}!}}</td>
<td>
  
对一段指定的模板区域进行过滤，即不解析该区域的模板。

```
{{! {{! 这里面的模板不会被解析 !}} !}}
```

</td>
    </tr>
  </tbody>
</table>
