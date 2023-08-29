<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>table 自定义样式 - Layui</title>
  <meta name="renderer" content="webkit">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="{{= d.layui.cdn.css }}" rel="stylesheet">
  <style>
    /* 自定义样式  */
    .layui-table-testcss .layui-table-header,
    .layui-table-testcss thead tr{background-color: #F8FCF9; color: #16BAAA}
    .layui-form-testcss > div{margin-bottom: 6px;}
  </style>
</head>
<body>
  <div style="padding: 16px;"> 
    <table class="layui-hide" id="ID-table-demo-css"></table>
  </div>
  <script type="text/html" id="ID-table-demo-css-user">{{!
    <ul>
      <li><strong>ID:</strong> {{= d.id }} </li>
      <li><strong>用户:</strong> {{= d.username }} </li>
      <li><strong>性别:</strong> {{= d.sex }} </li>
      <li><strong>城市:</strong> {{= d.city }} </li>
    </ul>
  !}}</script>
  <script type="text/html" id="ID-table-demo-css-tool">{{!
    <div class="layui-form layui-form-testcss">
      <div class="layui-input-wrap">
        <input name="AAA" value="{{= d.AAA || '' }}" lay-affix="clear" placeholder="表单 1" class="layui-input" >
      </div>
      <div class="layui-input-wrap">
        <input name="BBB" value="{{= d.BBB || '' }}" lay-affix="clear" placeholder="表单 2" class="layui-input" >
      </div>
      <div>
        <button class="layui-btn layui-btn-fluid" lay-submit lay-filter="demo-css-submit">确认</button>
      </div>
    </div>
  !}}</script>
    
  <script src="{{= d.layui.cdn.js }}"></script>
  <script>
  layui.use(['table'], function(){
    var table = layui.table;
    var form = layui.form;
    
    // 创建渲染实例
    table.render({
      elem: '#ID-table-demo-css',
      url:'/static/2.8/json/table/demo1.json', // 此处为静态模拟数据，实际使用时需换成真实接口
      page: true,
      height: 'full-35',
      lineStyle: 'height: 151px;', // 定义表格的多行样式
      css: [ // 直接给当前表格主容器重置 css 样式
        '.layui-table-page{text-align: center;}' // 让分页栏居中
      ].join(''),
      className: 'layui-table-testcss', // 用于给表格主容器追加 css 类名
      cols: [[
        {field:'username', width:160, title: '用户', templet: '#ID-table-demo-css-user'},
        // 设置单元格样式
        {field:'sign', minWidth:100, title: '签名', style:'color: #000;'},
        {width:160, title: '操作', templet: '#ID-table-demo-css-tool'}
      ]]
    });

    // 表单提交
    form.on('submit(demo-css-submit)', function(data){
      var field = data.field; // 获取表单字段值
      // 显示填写结果，仅作演示用
      layer.alert(JSON.stringify(field), {
        title: '当前填写的字段值'
      });
      // 此处可执行 Ajax 等操作
      // …
      return false; // 阻止默认 form 跳转
    });
    
  });
  </script>
</body>
</html>
