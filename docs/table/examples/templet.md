<table class="layui-hide" id="ID-table-demo-templet"></table>

<script type="text/html" id="ID-table-demo-templet-user">{{!
  <a href="" target="_blank">{{= d.username }}</a>
!}}</script>
 
<script type="text/html" id="ID-table-demo-templet-switch">{{!
  <!-- 这里的 checked 的状态值判断仅作为演示 -->
  <input type="checkbox" name="status" value="{{= d.id }}" title="热|" lay-skin="switch" lay-filter="demo-templet-status" {{= d.id == 10001 ? "checked" : "" }}>
!}}</script>
 
<script type="text/html" id="ID-table-demo-templet-other">{{!
  <span class="layui-badge-rim" style="margin-right: 10px;">评分：{{= d.score }}</span>
  <span class="layui-badge-rim">职业：{{= d.classify }}</span>
  <!--
  <span class="layui-badge-rim">下标：{{= d.LAY_INDEX }}</span>
  <span class="layui-badge-rim">序号：{{= d.LAY_NUM }}</span>
  -->
!}}</script>

<!-- import layui -->
<script>
layui.use(['table'], function(){
  var table = layui.table;
  var form = layui.form;
  
  // 创建渲染实例
  table.render({
    elem: '#ID-table-demo-templet',
    url:'/static/2.8/json/table/user.json', // 此处为静态模拟数据，实际使用时需换成真实接口
    page: true,
    height: '315px',
    cols: [[
      {type: 'checkbox', fixed: 'left'},
      // 未自定义模板的普通列
      {field:'id', fixed: 'left', width:80, title: 'ID', sort: true},
      // 模板 - 选择器写法
      {field:'username', width:80, title: '用户', templet: '#ID-table-demo-templet-user'},
      // 模板 - 函数写法
      {field:'sex', width:60, title: '性别', templet: function(d){
        if(d.sex === '男'){
          return '<span style="color: blue">♂</span>';
        } else {
          return '<span style="color: pink">♀</span>';
        }
      }},
      // 模板 - 普通字符写法
      {field:'city', width:115, title: '城市', templet: '<div><i class="layui-icon layui-icon-location"></i> {{!{{= d.city }}!}}</div>'},
      // 模板中可包含任意字段、任意内容（如表单等）
      {title: '状态', width:85, templet: '#ID-table-demo-templet-switch'},
      {title: '其他', minWidth:200, templet: '#ID-table-demo-templet-other'}
    ]]
  });
  
  // 状态 - 开关操作
  form.on('switch(demo-templet-status)', function(obj){
    var id = this.value;
    var name = this.name;
    layer.tips(id + ' ' + name + ': '+ obj.elem.checked, obj.othis);
  });

});
</script>