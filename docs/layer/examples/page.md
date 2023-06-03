<div class="layui-btn-container">
  <button type="button" class="layui-btn layui-btn-primary" lay-on="test-page">普通页面层</button>
  <button type="button" class="layui-btn layui-btn-primary" lay-on="test-page-wrap">捕获层</button>
  <button type="button" class="layui-btn layui-btn-primary" lay-on="test-page-title">剔除默认标题栏</button>
  <button type="button" class="layui-btn layui-btn-primary" lay-on="test-page-move">绑定弹层的拖拽元素</button>
  <button type="button" class="layui-btn layui-btn-primary" lay-on="test-page-custom">
    <span class="layui-badge-dot"></span> 弹出任意自定义内容
  </button>
</div>

<div id="ID-test-layer-wrapper" style="display: none;">
  <div style="padding:16px;">
    弹出已经存在于页面中的一段元素<br>
    通常是放置在 &amp;lt;body&amp;gt; 根节点下
  </div>
</div>

<!-- import layui --> 
<script>
layui.use(function(){
  var $ = layui.$;
  var layer = layui.layer;
  var util = layui.util;
  var form = layui.form;

  // 事件
  util.on('lay-on', {
    'test-page': function(){
      layer.open({
        type: 1,
        // area: ['420px', '240px'], // 宽高
        content: '<div style="padding: 16px;">任意 HTML 内容</div>'
      });
    },
    'test-page-wrap': function(){
      layer.open({
        type: 1,
        shade: false, // 不显示遮罩
        content: $('#ID-test-layer-wrapper'), // 捕获的元素
        end: function(){
          // layer.msg('关闭后的回调', {icon:6});
        }
      });
    },
    'test-page-title': function(){
      layer.open({
        type: 1,
        area: ['420px', '240px'], // 宽高
        title: false, // 不显示标题栏
        closeBtn: 0,
        shadeClose: true, // 点击遮罩关闭层
        content: '<div style="padding: 16px;">任意 HTML 内容。可点击遮罩区域关闭。</div>'
      });
    },
    'test-page-move': function(){
      layer.open({
        type: 1,
        area: ['420px', '240px'], // 宽高
        title: false,
        content: ['<div style="padding: 11px;">',
          '任意 HTML 内容',
          '<div style="padding: 16px 0;">',
            '<button class="layui-btn" id="ID-test-layer-move">拖拽此处移动弹层</button>',
          '</div>',
        '</div>'].join(''),
        move: '#ID-test-layer-move'
      });
    },
    'test-page-custom': function(){
      layer.open({
        type: 1,
        area: '350px',
        resize: false,
        shadeClose: true,
        title: 'demo : layer + form',
        content: `
          <div class="layui-form" lay-filter="filter-test-layer" style="margin: 16px;">
            <div class="demo-login-container">
              <div class="layui-form-item">
                <div class="layui-input-wrap">
                  <div class="layui-input-prefix">
                    <i class="layui-icon layui-icon-username"></i>
                  </div>
                  <input type="text" name="username" value="" lay-verify="required" placeholder="用户名" lay-reqtext="请填写用户名" autocomplete="off" class="layui-input" lay-affix="clear">
                </div>
              </div>
              <div class="layui-form-item">
                <div class="layui-input-wrap">
                  <div class="layui-input-prefix">
                    <i class="layui-icon layui-icon-password"></i>
                  </div>
                  <input type="password" name="password" value="" lay-verify="required" placeholder="密   码" lay-reqtext="请填写密码" autocomplete="off" class="layui-input" lay-affix="eye">
                </div>
              </div>
              <div class="layui-form-item">
                <div class="layui-row">
                  <div class="layui-col-xs7">
                    <div class="layui-input-wrap">
                      <div class="layui-input-prefix">
                        <i class="layui-icon layui-icon-vercode"></i>
                      </div>
                      <input type="text" name="captcha" value="" lay-verify="required" placeholder="验证码" lay-reqtext="请填写验证码" autocomplete="off" class="layui-input" lay-affix="clear">
                    </div>
                  </div>
                  <div class="layui-col-xs5">
                    <div style="margin-left: 10px;">
                      <img src="https://www.oschina.net/action/user/captcha" onclick="this.src='https://www.oschina.net/action/user/captcha?t='+ new Date().getTime();">
                    </div>
                  </div>
                </div>
              </div>
              <div class="layui-form-item">
                <input type="checkbox" name="remember" lay-skin="primary" title="记住密码">
                <a href="#forget" style="float: right; margin-top: 7px;">忘记密码？</a>
              </div>
              <div class="layui-form-item">
                <button class="layui-btn layui-btn-fluid" lay-submit lay-filter="demo-login">登录</button>
              </div>
              <div class="layui-form-item demo-login-other">
                <label>社交账号登录</label>
                <span style="padding: 0 21px 0 6px;">
                  <a href="javascript:;"><i class="layui-icon layui-icon-login-qq" style="color: #3492ed;"></i></a>
                  <a href="javascript:;"><i class="layui-icon layui-icon-login-wechat" style="color: #4daf29;"></i></a>
                  <a href="javascript:;"><i class="layui-icon layui-icon-login-weibo" style="color: #cf1900;"></i></a>
                </span>
                或 <a href="#reg">注册帐号</a></span>
              </div>
            </div>
          </div>
        `,
        success: function(){
          // 对弹层中的表单进行初始化渲染
          form.render();

          // 表单提交事件
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
        }
      });
    }
  })
});
</script>