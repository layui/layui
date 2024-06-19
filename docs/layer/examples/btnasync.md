<button type="button" class="layui-btn layui-btn-primary" lay-on="bs_alert">alert</button>
<button type="button" class="layui-btn layui-btn-primary" lay-on="bs_confirm">confirm</button>
<button type="button" class="layui-btn layui-btn-primary" lay-on="bs_msg">msg</button>
<button type="button" class="layui-btn layui-btn-primary" lay-on="bs_open">open</button>
<button type="button" class="layui-btn layui-btn-primary" lay-on="bs_prompt">prompt(不支持)</button>

<!-- import layui -->
<script>
layui.use(function () {
  var $ = layui.$
  var util = layui.util;
  var sleep = function (time) {
    return $.Deferred(function (defer) {
      setTimeout(function () {
        defer.resolve();
      }, time)
    })
  }
  var enableBtnAsync = true;

  util.on({
    bs_alert: function () {
      layer.alert('对话框内容', {
        btnAsync: enableBtnAsync,
      }, function (index, layero, that) {
        var defer = $.Deferred();
        that.loading(true);
        sleep(1000).then(defer.resolve);
        return defer.promise();
      });
    },
    bs_confirm: function () {
      layer.confirm('一个询问框的示例？', {
        btnAsync: enableBtnAsync,
        btn: ['确定', '关闭'] //按钮
      }, function (index, layero, that) {
        var defer = $.Deferred();
        that.loading(true);
        sleep(1000).then(defer.resolve);
        return defer.promise();
      });
    },
    bs_msg: function () {
      layer.msg('第二个回调', {
        btnAsync: enableBtnAsync,
        time: 20000, // 20s 后自动关闭
        btn: ['明白了', '知道了'],
        btn1: function (index, layero, that) {
          var defer = $.Deferred();
          that.loading(true);
          sleep(1000).then(defer.resolve);
          return defer.promise();
        }
      });
    },
    bs_open: function () {
      layer.open({
        btnAsync: enableBtnAsync,
        type: 1,
        area: ['500px', '300px'],
        btn: ['确定', '关闭'],
        btn1: function (index, layero, that) {
          var defer = $.Deferred();
          that.loading(true);
          sleep(1000).then(defer.resolve);
          return defer.promise();
        },
        btn2: function (index, layero, that) {
          var defer = $.Deferred();
          that.loading(true);
          sleep(1000).then(defer.resolve);
          return defer.promise();
        }
      })
    },
    // 不支持 btnAsync
    bs_prompt: function () {
      layer.prompt({
        formType: 2,
        value: '初始值',
        title: '请输入值',
        area: ['500px', '300px'] // 自定义文本域宽高
      }, function (value, index, elem) {
        alert(value);
        layer.close(index);
      });
    }
  })
}); 
</script>