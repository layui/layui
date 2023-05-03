<div class="layui-btn-container">
  <button type="button" class="layui-btn layui-btn-normal" id="ID-upload-demo-choose">选择文件</button>
  <button type="button" class="layui-btn" id="ID-upload-demo-action">开始上传</button>
</div>

<!-- import layui -->
<script>
layui.use(function(){
  var upload = layui.upload;

  // 渲染
  upload.render({
    elem: '#ID-upload-demo-choose',
    url: '', // 此处配置你自己的上传接口即可
    auto: false,
    // multiple: true,
    bindAction: '#ID-upload-demo-action',
    done: function(res){
      layer.msg('上传成功');
      console.log(res)
    }
  });
});
</script>