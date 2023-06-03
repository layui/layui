<button type="button" class="layui-btn" id="ID-upload-demo-btn">
  <i class="layui-icon layui-icon-upload"></i> 单图片上传
</button>
<div style="width: 132px;">
  <div class="layui-upload-list">
    <img class="layui-upload-img" id="ID-upload-demo-img" style="width: 100%; height: 92px;">
    <div id="ID-upload-demo-text"></div>
  </div>
  <div class="layui-progress layui-progress-big" lay-showPercent="yes" lay-filter="filter-demo">
    <div class="layui-progress-bar" lay-percent=""></div>
  </div>
</div>
<hr style="margin: 21px 0;">
<div class="layui-upload">
  <button type="button" class="layui-btn" id="ID-upload-demo-btn-2">
    <i class="layui-icon layui-icon-upload"></i> 多图片上传
  </button> 
  <blockquote class="layui-elem-quote layui-quote-nm" style="margin-top: 11px;">
    预览图：
    <div class="layui-upload-list" id="upload-demo-preview"></div>
 </blockquote>
</div>

<!-- import layui -->
<script>
layui.use(function(){
  var upload = layui.upload;
  var layer = layui.layer;
  var element = layui.element;
  var $ = layui.$;

  // 单图片上传
  var uploadInst = upload.render({
    elem: '#ID-upload-demo-btn',
    url: 'https://httpbin.org/post', // 此处用的是第三方的 http 请求演示，实际使用时改成您自己的上传接口即可。
    before: function(obj){
      // 预读本地文件示例，不支持ie8
      obj.preview(function(index, file, result){
        $('#ID-upload-demo-img').attr('src', result); // 图片链接（base64）
      });
      
      element.progress('filter-demo', '0%'); // 进度条复位
      layer.msg('上传中', {icon: 16, time: 0});
    },
    done: function(res){
      // 若上传失败
      if(res.code > 0){
        return layer.msg('上传失败');
      }
      // 上传成功的一些操作
      // …
      $('#ID-upload-demo-text').html(''); // 置空上传失败的状态
    },
    error: function(){
      // 演示失败状态，并实现重传
      var demoText = $('#ID-upload-demo-text');
      demoText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-xs demo-reload">重试</a>');
      demoText.find('.demo-reload').on('click', function(){
        uploadInst.upload();
      });
    },
    // 进度条
    progress: function(n, elem, e){
      element.progress('filter-demo', n + '%'); // 可配合 layui 进度条元素使用
      if(n == 100){
        layer.msg('上传完毕', {icon: 1});
      }
    }
  });

  // 多图片上传
  upload.render({
    elem: '#ID-upload-demo-btn-2',
    url: 'https://httpbin.org/post', // 此处用的是第三方的 http 请求演示，实际使用时改成您自己的上传接口即可。
    multiple: true,
    before: function(obj){
      // 预读本地文件示例，不支持ie8
      obj.preview(function(index, file, result){
        $('#upload-demo-preview').append('<img src="'+ result +'" alt="'+ file.name +'" style="width: 90px; height: 90px;">')
      });
    },
    done: function(res){
      // 上传完毕
      // …
    }
  });
});