/*!

 @Title: layui.upload 单文件上传 - 全浏览器兼容版
 @Author: 贤心
 @License：LGPL

 */
 
layui.define(['layer-mobile', 'zepto'] , function(exports){
  "use strict";
  
  var $ = layui.zepto;
  var layer = layui['layer-mobile'];
  var device = layui.device();
  
  var elemDragEnter = 'layui-upload-enter';
  var elemIframe = 'layui-upload-iframe';
 
  var msgConf = {
    icon: 2
    ,shift: 6
  }, fileType = {
    file: '文件'
    ,video: '视频'
    ,audio: '音频'
  };
  
  layer.msg = function(content){
    return layer.open({
      content: content || ''
      ,skin: 'msg'
      ,time: 0 //2秒后自动关闭
    });
  };
  
  var Upload = function(options){
    this.options = options;
  };
  
  //初始化渲染
  Upload.prototype.init = function(){
    var that = this, options = that.options;
    var body = $('body'), elem = $(options.elem || '.layui-upload-file');
    var iframe = $('<iframe id="'+ elemIframe +'" class="'+ elemIframe +'" name="'+ elemIframe +'"></iframe>');
    
    //插入iframe    
    $('#'+elemIframe)[0] || body.append(iframe);
    
    return elem.each(function(index, item){
      item = $(item);
      var form = '<form target="'+ elemIframe +'" method="'+ (options.method||'post') +'" key="set-mine" enctype="multipart/form-data" action="'+ (options.url||'') +'"></form>';
      
      var type = item.attr('lay-type') || options.type; //获取文件类型

      //包裹ui元素
      if(!options.unwrap){
        form = '<div class="layui-box layui-upload-button">' + form + '<span class="layui-upload-icon"><i class="layui-icon">&#xe608;</i>'+ (
          item.attr('lay-title') || options.title|| ('上传'+ (fileType[type]||'图片') )
        ) +'</span></div>';
      }
      
      form = $(form);
      
      //拖拽支持
      if(!options.unwrap){
        form.on('dragover', function(e){
          e.preventDefault();
          $(this).addClass(elemDragEnter);
        }).on('dragleave', function(){
          $(this).removeClass(elemDragEnter);
        }).on('drop', function(){
          $(this).removeClass(elemDragEnter);
        });
      }
      
      //如果已经实例化，则移除包裹元素
      if(item.parent('form').attr('target') === elemIframe){
        if(options.unwrap){
          item.unwrap();
        } else {
          item.parent().next().remove();
          item.unwrap().unwrap();
        }
      };
      
      //包裹元素
      item.wrap(form);
      
      //触发上传
      item.off('change').on('change', function(){
        that.action(this, type);
      });
    });
  };
  
  //提交上传
  Upload.prototype.action = function(input, type){
    var that = this, options = that.options, val = input.value;
    var item = $(input), ext = item.attr('lay-ext') || options.ext || ''; //获取支持上传的文件扩展名;

    if(!val){
      return;
    };
    
    //校验文件
    switch(type){
      case 'file': //一般文件
        if(ext && !RegExp('\\w\\.('+ ext +')$', 'i').test(escape(val))){
          layer.msg('不支持该文件格式', msgConf);
          return input.value = '';
        }
      break;
      case 'video': //视频文件
        if(!RegExp('\\w\\.('+ (ext||'avi|mp4|wma|rmvb|rm|flash|3gp|flv') +')$', 'i').test(escape(val))){
          layer.msg('不支持该视频格式', msgConf);
          return input.value = '';
        }
      break;
      case 'audio': //音频文件
        if(!RegExp('\\w\\.('+ (ext||'mp3|wav|mid') +')$', 'i').test(escape(val))){
          layer.msg('不支持该音频格式', msgConf);
          return input.value = '';
        }
      break;
      default: //图片文件
        if(!RegExp('\\w\\.('+ (ext||'jpg|png|gif|bmp|jpeg') +')$', 'i').test(escape(val))){
          layer.msg('不支持该图片格式', msgConf);
          return input.value = '';
        }
      break;
    }
    
    options.before && options.before(input);
    item.parent().submit();

    var iframe = $('#'+elemIframe), timer = setInterval(function() {
      var res;
      try {
        res = iframe.contents().find('body').text();
      } catch(e) {
        layer.msg('上传接口存在跨域', msgConf);
        clearInterval(timer);
      }
      if(res){
        clearInterval(timer);
        iframe.contents().find('body').html('');
        try {
          res = JSON.parse(res);
        } catch(e){
          res = {};
          return layer.msg('请对上传接口返回JSON字符', msgConf);
        }
        typeof options.success === 'function' && options.success(res, input);
      }
    }, 30); 
    
    input.value = '';
  };
  
  //暴露接口
  exports('upload-mobile', function(options){
    var upload = new Upload(options = options || {});
    upload.init();
  });
});

