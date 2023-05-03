<input type="file" name="file" id="ID-upload-demo-form-files">

<!-- import layui -->
<script>
layui.use(function(){
  var upload = layui.upload;
  var layer = layui.layer

  // 渲染
  upload.render({
    elem: '#ID-upload-demo-form-files',
    url: '', // 此处配置你自己的上传接口即可
    done: function(res){
      layer.msg('上传成功');
      console.log(res)
    }
  });
});
</script>