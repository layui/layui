<div class="layui-upload-drag" style="display: block;" id="ID-upload-demo-drag">
  <i class="layui-icon layui-icon-upload"></i> 
  <div>点击上传，或将文件拖拽到此处</div>
  <div class="layui-hide" id="ID-upload-demo-preview">
    <hr> <img src="" alt="上传成功后渲染" style="max-width: 100%">
  </div>
</div>

<!-- import layui -->
<script>
layui.use(function(){
  var upload = layui.upload;
  var $ = layui.$;

  // 渲染
  upload.render({
    elem: '#ID-upload-demo-drag',
    url: 'https://httpbin.org/post', // 此处用的是第三方的 http 请求演示，实际使用时改成您自己的上传接口即可。
    done: function(res){
      layer.msg('上传成功');
      $('#ID-upload-demo-preview').removeClass('layui-hide')
      .find('img').attr('src', res.files.file);
      console.log(res)
    }
  });
});
</script>