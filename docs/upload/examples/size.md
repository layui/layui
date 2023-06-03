<button type="button" class="layui-btn layui-btn-danger" id="ID-upload-demo-size">
  <i class="layui-icon layui-icon-upload"></i> 上传图片
</button>
<div class="layui-inline layui-word-aux">
  这里以限制 60KB 为例
</div>

<!-- import layui -->
<script>
layui.use(function(){
  var upload = layui.upload;
  var layer = layui.layer;
  
  // 渲染
  upload.render({
    elem: '#ID-upload-demo-size',
    url: '', // 此处配置你自己的上传接口即可
    size: 60, // 限制文件大小，单位 KB
    done: function(res){
      layer.msg('上传成功');
      console.log(res);
    }
  });
});
</script>