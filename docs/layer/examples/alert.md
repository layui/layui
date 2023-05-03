<div class="layui-btn-container">
  <button type="button" class="layui-btn layui-btn-primary" lay-on="test-alert">对话框带图标</button>
  <button type="button" class="layui-btn layui-btn-primary" lay-on="test-confirm">询问框</button>
  <button type="button" class="layui-btn layui-btn-primary" lay-on="test-msg-dark">深色提示框</button>
  <button type="button" class="layui-btn layui-btn-primary" lay-on="test-msg-light">浅色提示框</button>
  <button type="button" class="layui-btn layui-btn-primary" lay-on="test-alert-btn">自定义按钮</button>
  <button type="button" class="layui-btn layui-btn-primary" lay-on="test-count-down">关闭倒计时</button>
</div>

<!-- import layui --> 
<script>
layui.use(function(){
  var layer = layui.layer;
  var util = layui.util;

  // 事件
  util.on('lay-on', {
    "test-alert": function(){
      // 示范对话框所有内置图标
      var icon = 0;
      (function changeIcon(){
        layer.alert('点击确定，继续查看图标', {
          icon: icon,
          shadeClose: true,
          title: 'icon: '+ icon
        }, ++icon > 6 ? function(){
          layer.msg('内置图标演示完毕', {icon: 1});
        } : changeIcon);
      }());
    },
    "test-confirm": function(){
      layer.confirm('一个询问框的示例？', {icon: 3}, function(){
        layer.msg('点击确定的回调', {icon: 1});
      }, function(){
        layer.msg('点击取消的回调');
      });
    },
    "test-msg-dark": function(){
      layer.msg('深色提示框的示例');
    },
    "test-msg-light": function(){
      layer.msg('浅色提示框的示例', {icon: 0}, function(){
        // layer.msg('提示框关闭后的回调');
      });
    },
    "test-alert-btn": function(){
      layer.alert('自定义按钮', {
        btn: ['按钮一', '按钮二', '按钮三'],
        btnAlign: 'c', // 按钮居中显示
        btn1: function(){
          layer.msg('按钮一的回调');
        },
        btn2: function(){
          layer.msg('按钮二的回调');
        },
        btn3: function(){
          layer.msg('按钮三的回调');
        }
      });
    },
    "test-count-down": function(){
      layer.alert('在标题栏显示自动关闭倒计秒数', {
        time: 5*1000,
        success: function(layero, index){
          var timeNum = this.time/1000, setText = function(start){
            layer.title('<span class="layui-font-red">'+ (start ? timeNum : --timeNum) + '</span> 秒后自动关闭', index);
          };
          setText(!0);
          this.timer = setInterval(setText, 1000);
          if(timeNum <= 0) clearInterval(this.timer);
        },
        end: function(){
          clearInterval(this.timer);
        }
      });
    }
  })
});
</script>