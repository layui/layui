<style>
.demo-login-container{width: 320px; margin: 21px auto 0;}
.demo-login-other .lay-icon{position: relative; display: inline-block; margin: 0 2px; top: 2px; font-size: 26px;}
</style>
<form class="lay-form">
  <div class="demo-login-container">
    <div class="lay-form-item">
      <div class="lay-input-wrap">
        <div class="lay-input-prefix">
          <i class="lay-icon lay-icon-username"></i>
        </div>
        <input type="text" name="username" value="" lay-verify="required" placeholder="用户名" lay-reqtext="请填写用户名" autocomplete="off" class="lay-input" lay-affix="clear">
      </div>
    </div>
    <div class="lay-form-item">
      <div class="lay-input-wrap">
        <div class="lay-input-prefix">
          <i class="lay-icon lay-icon-password"></i>
        </div>
        <input type="password" name="password" value="" lay-verify="required" placeholder="密   码" lay-reqtext="请填写密码" autocomplete="off" class="lay-input" lay-affix="eye">
      </div>
    </div>
    <div class="lay-form-item">
      <div class="lay-row">
        <div class="lay-col-xs7">
          <div class="lay-input-wrap">
            <div class="lay-input-prefix">
              <i class="lay-icon lay-icon-vercode"></i>
            </div>
            <input type="text" name="captcha" value="" lay-verify="required" placeholder="验证码" lay-reqtext="请填写验证码" autocomplete="off" class="lay-input" lay-affix="clear">
          </div>
        </div>
        <div class="lay-col-xs5">
          <div style="margin-left: 10px;">
            <img src="https://www.oschina.net/action/user/captcha" onclick="this.src='https://www.oschina.net/action/user/captcha?t='+ new Date().getTime();">
          </div>
        </div>
      </div>
    </div>
    <div class="lay-form-item">
      <input type="checkbox" name="remember" lay-skin="primary" title="记住密码">
      <a href="#forget" style="float: right; margin-top: 7px;">忘记密码？</a>
    </div>
    <div class="lay-form-item">
      <button class="lay-btn lay-btn-fluid" lay-submit lay-filter="demo-login">登录</button>
    </div>
    <div class="lay-form-item demo-login-other">
      <label>社交账号登录</label>
      <span style="padding: 0 21px 0 6px;">
        <a href="javascript:;"><i class="lay-icon lay-icon-login-qq" style="color: #3492ed;"></i></a>
        <a href="javascript:;"><i class="lay-icon lay-icon-login-wechat" style="color: #4daf29;"></i></a>
        <a href="javascript:;"><i class="lay-icon lay-icon-login-weibo" style="color: #cf1900;"></i></a>
      </span>
      或 <a href="#reg">注册帐号</a>
    </div>
  </div>
</form>

<!-- import layui --> 
<script>
layui.use(function(){
  var form = layui.form;
  var layer = layui.layer;

  // 提交事件
  form.on('submit(demo-login)', function(data){
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
