<div class="layui-btn-container">
  <button class="layui-btn" lay-on="parseTable">转换为数据表格</button>
</div>

<table lay-filter="parse-table-demo">
  <thead>
    <tr>
      <th lay-data="{field:'name', width:150}">人物</th>
      <th lay-data="{field:'nation', width:150}">民族</th>
      <th lay-data="{field:'maxim', minWidth: 180}">格言</th>
    </tr> 
  </thead>
  <tbody>
    <tr>
      <td>孔子</td>
      <td>华夏</td>
      <td>有朋至远方来，不亦乐乎</td>
    </tr>
    <tr>
      <td>孟子</td>
      <td>华夏</td>
      <td>穷则独善其身，达则兼济天下</td>
    </tr>
    <tr>
      <td>庄子</td>
      <td>华夏</td>
      <td>朴素而天下莫能与之争美</td>
    </tr>
  </tbody>
</table>

<!-- import layui -->
<script>
layui.use(function(){
  var table = layui.table;
  var util = layui.util;

  // 事件
  util.on('lay-on', {
    parseTable: function(){
      // 转化静态表格
      table.init('parse-table-demo', {
        // height: ''
      });
    }
  });
});
</script>