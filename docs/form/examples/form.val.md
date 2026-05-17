<form class="lay-form" action="" lay-filter="demo-val-filter">
  <div class="lay-btn-container" style="margin-bottom: 6px; text-align: center;">
    <button type="button" class="lay-btn lay-btn-normal" id="LAY-component-form-setval">赋值</button>
    <button type="button" class="lay-btn lay-btn-normal" id="LAY-component-form-getval">取值</button>
  </div>
  
  <div class="lay-form-item">
    <label class="lay-form-label">输入框</label>
    <div class="lay-input-block">
      <input type="text" name="username" lay-verify="title" autocomplete="off" placeholder="请输入" class="lay-input">
    </div>
  </div>

  <div class="lay-form-item">
    <label class="lay-form-label">密码框</label>
    <div class="lay-input-block">
      <input type="password" name="password" placeholder="请输入" autocomplete="off" class="lay-input">
    </div>
  </div>
  
  <div class="lay-form-item">
    <label class="lay-form-label">选择框</label>
    <div class="lay-input-block">
      <select name="interest" lay-filter="aihao">
        <option value=""></option>
        <option value="0">写作</option>
        <option value="1">阅读</option>
        <option value="2">游戏</option>
        <option value="3">音乐</option>
        <option value="4">旅行</option>
      </select>
    </div>
  </div>
  
  <div class="lay-form-item">
    <label class="lay-form-label">复选框</label>
    <div class="lay-input-block">
      <input type="checkbox" name="like[write]" title="写作">
      <input type="checkbox" name="like[read]" title="阅读">
      <input type="checkbox" name="like[daze]" title="发呆">
    </div>
  </div>
  
  <div class="lay-form-item">
    <label class="lay-form-label">开关</label>
    <div class="lay-input-block">
      <input type="checkbox" name="close" lay-skin="switch" lay-text="ON|OFF">
    </div>
  </div>
  
  <div class="lay-form-item">
    <label class="lay-form-label">单选框</label>
    <div class="lay-input-block">
      <input type="radio" name="sex" value="男" title="男" checked>
      <input type="radio" name="sex" value="女" title="女">
    </div>
  </div>

  <div class="lay-form-item lay-form-text">
    <label class="lay-form-label">文本域</label>
    <div class="lay-input-block">
      &lt;textarea placeholder="请输入" class="lay-textarea" name="desc"&gt;&lt;/textarea&gt;
    </div>
  </div>
 
  <div class="lay-form-item">
    <div class="lay-input-block">
      <button type="submit" class="lay-btn" lay-submit lay-filter="demo-val">立即提交</button>
      <button type="reset" class="lay-btn lay-btn-primary">重置</button>
    </div>
  </div>
</form>

<!-- import layui --> 
<script>
layui.use(function(){
  var $ = layui.$;
  var form = layui.form;

  // 表单赋值
  $('#LAY-component-form-setval').on('click', function(){
    form.val('demo-val-filter', {
      "username": "贤心", // "name": "value"
      "password": "AAAAAA",
      "interest": 1,
      "like[write]": true, // 复选框选中状态
      "close": true, // 开关状态
      "sex": "女",
      "desc": "Layui 用于更简单快速地构建网页界面"
    });
  });
  // 表单取值
  layui.$('#LAY-component-form-getval').on('click', function(){
    var data = form.val('demo-val-filter');
    alert(JSON.stringify(data));
  });

  // 提交事件
  form.on('submit(demo-val)', function(data){
    var field = data.field; // 获取表单字段值

    // 显示填写结果，仅作演示用
    layer.alert(JSON.stringify(field), {
      title: '当前填写的字段值'
    });

    // 此处可执行 Ajax 等操作
    // …

    return false; // 阻止默认 form 跳转
  });
})
</script>
