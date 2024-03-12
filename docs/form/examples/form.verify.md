<form class="layui-form">
  <input type="text" name="username" lay-verify="required|username" placeholder="用户名" class="layui-input">
  <hr>
  <input type="password" name="password" lay-verify="password" placeholder="密码" class="layui-input">
  <hr>
  <input type="text" name="motto" lay-verify="motto" placeholder="座右铭" class="layui-input">
  <hr>
  <button class="layui-btn" lay-submit lay-filter="demo-verify">提交</button>
</form>

<!-- import layui --> 
<script>
layui.use(function(){
  var form = layui.form;

  // 自定义验证规则
  form.verify({
    // 验证用户名，且为必填项
    username: function(value, elem){
      if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
        return '用户名不能有特殊字符';
      }
      if (/(^_)|(__)|(_+$)/.test(value)) {
        return '用户名首尾不能出现下划线';
      }
      if (/^\d+$/.test(value)) {
        return '用户名不能全为数字';
      }
    },
    // 验证密码，且为必填项
    password: function(value, elem) {
      if (!/^[\S]{6,16}$/.test(value)) {
        return '密码必须为 6 到 16 位的非空字符';
      }
    },
    // 验证座右铭，且为非必填项
    motto: function(value, elem) {
      if (!value) return; // 非必填

      // 自定义规则
      if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
        return '座右铭不能有特殊字符';
      }
    }
  });

  // 提交事件
  form.on('submit(demo-verify)', function(data){
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
