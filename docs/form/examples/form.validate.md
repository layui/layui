<div class="layui-form">  
  <div class="layui-form-item">
    <label class="layui-form-label">手机</label>
    <div class="layui-input-block">
      <input type="tel" name="phone" lay-verify="required|phone" class="layui-input" id="validate-phone">
    </div>
  </div>
  <div class="layui-form-item">
    <label class="layui-form-label">验证码</label>
    <div class="layui-input-inline">
      <input type="text" name="vercode" lay-verify="required" class="layui-input">
    </div>
    <div class="layui-inline"> 
      <button type="button" class="layui-btn layui-btn-primary" id="validate-get-vercode">获取验证码</button>
    </div>
  </div>
  <div class="layui-form-item">
    <div class="layui-input-block">
      <button class="layui-btn" lay-submit lay-filter="demo-validate">提交</button>
    </div>
  </div>
</div>

<!-- import layui --> 
<script>
layui.use(function(){
  var $ = layui.$;
  var form = layui.form;
  var layer = layui.layer;
  
  // 点击获取验证码
  $('#validate-get-vercode').on('click', function(){
    var isValid = form.validate('#validate-phone');  // 主动触发验证，v2.7.0 新增 
    // 验证通过
    if(isValid){
      layer.msg('手机号规则验证通过');
      // 此处可继续书写「发送验证码」等后续逻辑
      // …
    }
  });

  // 提交事件
  form.on('submit(demo-validate)', function(data){
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