<div class="layui-upload">
  <button type="button" class="layui-btn layui-btn-normal" id="ID-upload-demo-files">选择多文件</button> 
  <div class="layui-upload-list">
    <table class="layui-table">
      <colgroup>
        <col style="min-width: 100px;">
        <col width="150">
        <col width="260">
        <col width="150">
      </colgroup>
      <thead>
        <th>文件名</th>
        <th>大小</th>
        <th>上传进度</th>
        <th>操作</th>
      </thead>
      <tbody id="ID-upload-demo-files-list"></tbody>
    </table>
  </div>
  <button type="button" class="layui-btn" id="ID-upload-demo-files-action">开始上传</button>
</div>

<!-- import layui -->
<script>
layui.use(function(){
  var upload = layui.upload;
  var element = layui.element;
  var $ = layui.$;

  // 制作多文件上传表格
  var uploadListIns = upload.render({
    elem: '#ID-upload-demo-files',
    elemList: $('#ID-upload-demo-files-list'), // 列表元素对象
    url: 'https://httpbin.org/post', // 此处用的是第三方的 http 请求演示，实际使用时改成您自己的上传接口即可。
    accept: 'file',
    multiple: true,
    number: 3,
    auto: false,
    bindAction: '#ID-upload-demo-files-action',
    choose: function(obj){   
      var that = this;
      var files = this.files = obj.pushFile(); // 将每次选择的文件追加到文件队列

      // 读取本地文件
      obj.preview(function(index, file, result){
        var tr = $(['<tr id="upload-'+ index +'">',
          '<td>'+ file.name +'</td>',
          '<td>'+ (file.size/1024).toFixed(1) +'kb</td>',
          '<td><div class="layui-progress" lay-filter="progress-demo-'+ index +'"><div class="layui-progress-bar" lay-percent=""></div></div></td>',
          '<td>',
            '<button class="layui-btn layui-btn-xs demo-reload layui-hide">重传</button>',
            '<button class="layui-btn layui-btn-xs layui-btn-danger demo-delete">删除</button>',
          '</td>',
        '</tr>'].join(''));
        
        // 单个重传
        tr.find('.demo-reload').on('click', function(){
          obj.upload(index, file);
        });
        
        // 删除
        tr.find('.demo-delete').on('click', function(){
          delete files[index]; // 删除对应的文件
          tr.remove(); // 删除表格行
          // 清空 input file 值，以免删除后出现同名文件不可选
          uploadListIns.config.elem.next()[0].value = ''; 
        });
        
        that.elemList.append(tr);
        element.render('progress'); // 渲染新加的进度条组件
      });
    },
    done: function(res, index, upload){ // 成功的回调
      var that = this;
      // if(res.code == 0){ // 上传成功
        var tr = that.elemList.find('tr#upload-'+ index)
        var tds = tr.children();
        tds.eq(3).html(''); // 清空操作
        delete this.files[index]; // 删除文件队列已经上传成功的文件
        return;
      //}
      this.error(index, upload);
    },
    allDone: function(obj){ // 多文件上传完毕后的状态回调
      console.log(obj)
    },
    error: function(index, upload){ // 错误回调
      var that = this;
      var tr = that.elemList.find('tr#upload-'+ index);
      var tds = tr.children();
       // 显示重传
      tds.eq(3).find('.demo-reload').removeClass('layui-hide');
    },
    progress: function(n, elem, e, index){ // 注意：index 参数为 layui 2.6.6 新增
      element.progress('progress-demo-'+ index, n + '%'); // 执行进度条。n 即为返回的进度百分比
    }
  });
});
</script>