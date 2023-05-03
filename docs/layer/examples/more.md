<div class="layui-btn-container">
  <button type="button" class="layui-btn layui-btn-primary" lay-on="test-more-max">
    最大化弹出
  </button>
  <button type="button" class="layui-btn layui-btn-primary" lay-on="test-more-scrollbar">
    弹出时屏蔽浏览器滚动条
  </button>
  <button type="button" class="layui-btn layui-btn-primary" lay-on="test-more-lockscreen">
    页面锁屏 <span class="layui-badge-dot"></span>
  </button>
  <button type="button" class="layui-btn layui-btn-primary" lay-on="test-more-shade">
    自定义遮罩颜色和透明度
  </button>
  <button type="button" class="layui-btn layui-btn-primary" lay-on="test-more-stack">
    <span class="layui-badge-dot"></span> 多窗口模式 + 层叠置顶 + Esc 关闭
  </button>
</div>

<style>
.class-demo-layer-lockscreen{background: url(https://unpkg.com/outeres@0.0.12/img/wallpaper/001.jpg) #16b777; background-size: cover; color: rgba(255,255,255,1);}
.class-demo-layer-lockscreen .layui-form{position: absolute; top: 50%; left: 50%; width: 300px; transform: translate(-50%, -50%);}
.class-demo-layer-lockscreen .layui-form > div{margin-bottom: 8px;}
.class-demo-layer-pin{width: 100%; height: 38px; padding: 0 8px; background-color: rgba(255,255,255,.8); border: none; border-radius: 3px; box-sizing: border-box;}
.class-demo-layer-lockscreen .layui-input-suffix{pointer-events: auto; background-color: rgba(0,0,0,.5); border-radius: 0 3px 3px 0;}
.class-demo-layer-lockscreen .layui-input-suffix .layui-icon-right{cursor: pointer; color: #fff;}
</style>

<!-- import layui --> 
<script>
layui.use(function(){
  var layer = layui.layer;
  var util = layui.util;
  var form = layui.form;
  var $ = layui.$;

  // 事件
  util.on('lay-on', {
    'test-more-max': function(){
      layer.open({
        type: 1,
        content: '<div style="padding: 16px;">任意 HTML 内容</div>',
        area: ['320px', '195px'], // 初始宽高
        maxmin: true,
        success: function(layero, index){
          layer.full(index); // 最大化
        }
      });
    },
    'test-more-scrollbar': function(){
      layer.open({
        content: '浏览器滚动条已暂时屏蔽，关闭弹层后自动恢复',
        scrollbar: false
      });
    },
    'test-more-lockscreen': function(){
      layer.open({
        type: 1,
        title: false, // 禁用标题栏
        closeBtn: false, // 禁用默认关闭按钮
        area: ['100%', '100%'],
        scrollbar: false, // 暂时屏蔽浏览器滚动条
        anim: -1, // 禁用弹出动画
        isOutAnim: false, // 禁用关闭动画
        id: 'ID-layer-demo-inst',
        skin: 'class-demo-layer-lockscreen', // className
        content: ['<div class="layui-form">',
          '<div class="layui-input-wrap">',
            '<input type="password" class="class-demo-layer-pin" lay-affix="eye">',
            '<div class="layui-input-suffix">',
              '<i class="layui-icon layui-icon-right" id="ID-layer-demo-unlock"></i>',
            '</div>',
          '</div>',
          '<div>输入 111111 后回车，即可退出锁屏示例</div>',
        '</div>'].join(''),
        success: function(layero, index){
          var input = layero.find('input');
          var PASS = '111111';
          
          form.render(); // 表单组件渲染
          input.focus();

          // 点击解锁按钮
          var elemUnlock = layero.find('#ID-layer-demo-unlock');
          elemUnlock.on('click', function(){
            if($.trim(input[0].value) === PASS){
              layer.close(index);
              layer.closeLast('dialog'); // 关闭最新打开的信息框
            } else {
              layer.msg('锁屏密码输入有误', {offset: '16px', anim: 'slideDown'})
              input.focus();
            }
          });

          // 回车
          input.on('keyup', function(e){
            var elem = this;
            var keyCode = e.keyCode;
            if(keyCode === 13){
              elemUnlock.trigger('click');
            }
          });
        }
      })
    },
    'test-more-shade': function(){
      layer.open({
        type: 1,
        content: '<div style="padding: 16px;">任意 HTML 内容</div>',
        area: ['320px', '195px'], // 初始宽高
        shade: [0.9, '#000'],
        shadeClose: true // 点击遮罩区域，关闭弹层
      });
    },
    'test-more-stack': function(){
      var that = this;

      // 多窗口模式 + 层叠置顶 + Esc 关闭
      layer.open({
        type: 1,
        title: '当你选择该窗体时，即会在最顶端',
        area: ['390px', '260px'],
        shade: 0,
        maxmin: true,
        offset: [ // 为了便于演示，此处采用随机坐标
          Math.random()*($(window).height()-300),
          Math.random()*($(window).width()-390)
        ],
        content: '<div style="padding: 16px;">内容标记：'+ new Date().getTime() + '，按 ESC 键可关闭。<br><br>当你的页面有很多很多 layer 窗口，你需要像 Window 窗体那样，点击某个窗口，该窗体就置顶在上面，那么 layer.setTop() 可以来轻松实现。它采用巧妙的逻辑，以使这种置顶的性能达到最优。</div>',   
        btn: ['继续弹出', '全部关闭'], //只是为了演示
        yes: function(){
          $(that).click(); 
        },
        btn2: function(){
          layer.closeAll();
        },
        zIndex: layer.zIndex, // 重点 1 --- 初始设置当前最高层叠顺序，
        success: function(layero, index){
          layer.setTop(layero); // 重点 2 --- 保持选中窗口置顶
          
          // 记录索引，以便按 esc 键关闭。事件见代码最末尾处。
          layer.escIndex = layer.escIndex || [];
          layer.escIndex.unshift(index);
          // 选中当前层时，将当前层索引放置在首位
          layero.on('mousedown', function(){
            var _index = layer.escIndex.indexOf(index);
            if(_index !== -1){
              layer.escIndex.splice(_index, 1); //删除原有索引
            }
            layer.escIndex.unshift(index); //将索引插入到数组首位
          });
        },
        end: function(){
          //更新索引
          if(typeof layer.escIndex === 'object'){
            layer.escIndex.splice(0, 1);
          }
        }
      });
    }
  });

  // 多窗口模式 - esc 键
  $(document).on('keyup', function(e){
    if(e.keyCode === 27){
      layer.close(layer.escIndex ? layer.escIndex[0] : 0);
    }
  });

});
</script>