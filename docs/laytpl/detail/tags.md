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

</td>
    </tr>
    <tr>
<td>{{- }}</td>
<td>

原文输出。即不对 HTML 字符进行转义，但需做好 XSS 防护。

</td>
    </tr>
    <tr>
<td>{{ }}</td>
<td>

Scriptlet 标签。一般用于流程控制，如：

 ```js
{{ if (d.title) { }}
  标题：{{= d.title }}
{{ } else { }}
  默认标题
{{ } }}
 ```

</td>
    </tr>
    <tr>
<td>{{# }}</td>
<td>

注释标签。即仅在模板中显示，不在视图中输出。

</td>
    </tr>!}}
    <tr>
<td>{{!{{! !}}!}}</td>
<td>

忽略标签。即该区域中的标签不会被解析，一般用于输出原始标签。如：

```js
{{! {{! 这里面的 {{= escape }} 等模板标签不会被解析 !}} !}}
```

</td>
    </tr>
  </tbody>
</table>
