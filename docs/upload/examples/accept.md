<div class="layui-btn-container">
  <button type="button" class="layui-btn demo-class-accept" lay-options="{accept: 'file'}">
    <i class="layui-icon layui-icon-upload"></i> 
    上传文件
  </button>
  <button type="button" class="layui-btn demo-class-accept" lay-options="{
    accept: 'file',
    exts: 'zip|rar|7z'
  }">
    <i class="layui-icon layui-icon-upload"></i> 
    只允许压缩文件
  </button>
  <button type="button" class="layui-btn demo-class-accept" lay-options="{accept: 'video'}">
    <i class="layui-icon layui-icon-upload"></i> 
    上传视频
  </button>
  <button type="button" class="layui-btn demo-class-accept" lay-options="{accept: 'audio'}">
    <i class="layui-icon layui-icon-upload"></i>
    上传音频
  </button>
</div>

<!-- import layui -->
<script>
layui.use(function(){
  var upload = layui.upload;
  var layer = layui.layer;

  // 渲染
  upload.render({
    elem: '.demo-class-accept', // 绑定多个元素
    url: '', // 此处配置你自己的上传接口即可
    accept: 'file', // 普通文件
    done: function(res){
      layer.msg('上传成功');
      console.log(res);
    }
  });
});
</script>