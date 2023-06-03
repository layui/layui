<form class="layui-form">
  <input type="text" name="username" lay-verify="required|username" placeholder="用户名" class="layui-input">
  <hr>
  <input type="password" name="password" lay-verify="password" placeholder="密码" class="layui-input">
  <hr>
  <button class="layui-btn" lay-submit lay-filter="demo-verify">提交</button>
</form>

<!-- import layui --> 
<script>
layui.use(function(){
  var form = layui.form;

  // 自定义验证规则，如下以验证用户名和密码为例
  form.verify({
    // 函数写法
    // 参数 value 为表单的值；参数 item 为表单的 DOM 对象
    username: function(value, item){
      if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)){
        return '用户名不能有特殊字符';
      }
      if(/(^_)|(__)|(_+$)/.test(value)) return '用户名首尾不能出现 _ 下划线';
      if(/^\d+$/.test(value)) return '用户名不能全为数字';
      
      // 若不想自动弹出默认提示框，可返回 true，这时你可以通过其他提示方式替代（v2.5.7 新增）
      if(value === 'xxx'){
        alert('用户名不能为敏感词');
        return true;
      }
    },
    // 数组写法。
    // 数组中两个成员值分别代表：[正则表达式、正则匹配不符时的提示文字]
    password: [/^[\S]{6,12}$/, '密码必须为6到12位的非空字符'] 
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