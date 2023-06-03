<!-- 给容器追加 class="layui-form-pane"，即可显示为方框风格 -->
<form class="layui-form layui-form-pane" action="">
  <div class="layui-form-item">
    <label class="layui-form-label">长输入框</label>
    <div class="layui-input-block">
      <input type="text" name="title" autocomplete="off" placeholder="请输入" lay-verify="required" class="layui-input">
    </div>
  </div>
  <div class="layui-form-item">
    <div class="layui-inline">
      <label class="layui-form-label">日期选择</label>
      <div class="layui-input-block">
        <input type="text" name="date" id="date1" autocomplete="off" class="layui-input">
      </div>
    </div>
    <div class="layui-inline">
      <label class="layui-form-label">行内表单</label>
      <div class="layui-input-inline">
        <input type="text" name="number" autocomplete="off" class="layui-input">
      </div>
    </div>
  </div>
  <div class="layui-form-item">
    <label class="layui-form-label">密码框</label>
    <div class="layui-input-inline">
      <input type="password" name="password" placeholder="请输入" lay-verify="required" autocomplete="off" class="layui-input">
    </div>
    <div class="layui-form-mid layui-text-em">请务必填写用户名</div>
  </div>
  <div class="layui-form-item">
    <div class="layui-inline">
      <label class="layui-form-label">范围</label>
      <div class="layui-input-inline" style="width: 100px;">
        <input type="text" name="price_min" placeholder="￥" autocomplete="off" class="layui-input">
      </div>
      <div class="layui-form-mid">-</div>
      <div class="layui-input-inline" style="width: 100px;">
        <input type="text" name="price_max" placeholder="￥" autocomplete="off" class="layui-input">
      </div>
    </div>
  </div>
  <div class="layui-form-item">
    <label class="layui-form-label">选择框</label>
    <div class="layui-input-inline">
      <select name="interest" lay-filter="aihao">
        <option value=""></option>
        <option value="0">写作</option>
        <option value="1" selected>阅读</option>
        <option value="2">游戏</option>
        <option value="3">音乐</option>
        <option value="4">旅行</option>
      </select>
    </div>
  </div>
  <div class="layui-form-item" pane>
    <label class="layui-form-label">开关-默认开</label>
    <div class="layui-input-block">
      <input type="checkbox" checked name="open" lay-skin="switch" lay-filter="switchTest" title="开关">
    </div>
  </div>
  <div class="layui-form-item" pane>
    <label class="layui-form-label">单选框</label>
    <div class="layui-input-block">
      <input type="radio" name="sex" value="男" title="男" checked>
      <input type="radio" name="sex" value="女" title="女">
      <input type="radio" name="sex" value="禁" title="禁用" disabled>
    </div>
  </div>
  <div class="layui-form-item layui-form-text">
    <label class="layui-form-label">文本域</label>
    <div class="layui-input-block">
      &lt;textarea placeholder="请输入内容" class="layui-textarea"&gt;&lt;/textarea&gt;
    </div>
  </div>
  <div class="layui-form-item">
    <button class="layui-btn" lay-submit lay-filter="demo2">确认</button>
    <button type="reset" class="layui-btn layui-btn-primary">重置</button>
  </div>
</form>

<!-- import layui --> 
<script>
layui.use(['form'], function(){
  var form = layui.form;
  var layer = layui.layer;

  // 提交事件
  form.on('submit(demo2)', function(data){
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