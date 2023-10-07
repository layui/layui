/**
 * upload
 * 上传组件
 */
 
layui.define(['lay', 'layer'], function(exports){
  "use strict";
  
  var $ = layui.$;
  var lay = layui.lay;
  var layer = layui.layer;
  var device = layui.device();

  // 模块名
  var MOD_NAME = 'upload';
  var MOD_INDEX = 'layui_'+ MOD_NAME +'_index'; // 模块索引名

  // 外部接口
  var upload = {
    config: {}, // 全局配置项
    index: layui[MOD_NAME] ? (layui[MOD_NAME].index + 10000) : 0, // 索引
    // 设置全局项
    set: function(options){
      var that = this;
      that.config = $.extend({}, that.config, options);
      return that;
    },
    // 事件
    on: function(events, callback){
      return layui.onevent.call(this, MOD_NAME, events, callback);
    }
  };
  
  // 操作当前实例
  var thisModule = function(){
    var that = this;
    var options = that.config;
    var id = options.id;

    thisModule.that[id] = that; // 记录当前实例对象

    return {
      upload: function(files){
        that.upload.call(that, files);
      },
      reload: function(options){
        that.reload.call(that, options);
      },
      config: that.config
    }
  };
  
  // 字符常量
  var ELEM = 'layui-upload';
  var THIS = 'layui-this';
  var SHOW = 'layui-show';
  var HIDE = 'layui-hide';
  var DISABLED = 'layui-disabled';
  
  var ELEM_FILE = 'layui-upload-file';
  var ELEM_FORM = 'layui-upload-form';
  var ELEM_IFRAME = 'layui-upload-iframe';
  var ELEM_CHOOSE = 'layui-upload-choose';
  var ELEM_DRAG = 'layui-upload-drag';
  var UPLOADING = 'UPLOADING';
  
  // 构造器
  var Class = function(options){
    var that = this;
    that.index = ++upload.index;
    that.config = $.extend({}, that.config, upload.config, options);
    that.render();
  };
  
  // 默认配置
  Class.prototype.config = {
    accept: 'images', // 允许上传的文件类型：images/file/video/audio
    exts: '', // 允许上传的文件后缀名
    auto: true, // 是否选完文件后自动上传
    bindAction: '', // 手动上传触发的元素
    url: '', // 上传地址
    force: '', // 强制规定返回的数据格式，目前只支持是否强制 json
    field: 'file', // 文件字段名
    acceptMime: '', // 筛选出的文件类型，默认为所有文件
    method: 'post', // 请求上传的 http 类型
    data: {}, // 请求上传的额外参数
    drag: true, // 是否允许拖拽上传
    size: 0, // 文件限制大小，默认不限制
    number: 0, // 允许同时上传的文件数，默认不限制
    multiple: false, // 是否允许多文件上传，不支持 ie8-9
    text: { // 自定义提示文本
      "cross-domain": "Cross-domain requests are not supported", // 跨域
      "data-format-error": "Please return JSON data format", // 数据格式错误
      "check-error": "", // 文件格式校验失败
      "error": "", // 上传失败
      "limit-number": null, // 限制 number 属性的提示 --- function
      "limit-size": null // 限制 size 属性的提示 --- function
    }
  };

  // 重载实例
  Class.prototype.reload = function(options){
    var that = this;
    that.config = $.extend({}, that.config, options);
    that.render(true);
  };
  
  // 初始渲染
  Class.prototype.render = function(rerender){
    var that = this;
    var options = that.config;

    // 若 elem 非唯一
    var elem = $(options.elem);
    if (elem.length > 1) {
      layui.each(elem, function() {
        upload.render($.extend({}, options, {
          elem: this
        }));
      });
      return that;
    }

    // 合并 lay-options 属性上的配置信息
    $.extend(options, lay.options(elem[0], {
      attr: elem.attr('lay-data') ? 'lay-data' : null // 兼容旧版的 lay-data 属性
    }));

    // 若重复执行 render，则视为 reload 处理
    if (!rerender && elem[0] && elem.data(MOD_INDEX)) {
      var newThat = thisModule.getThis(elem.data(MOD_INDEX));
      if(!newThat) return;

      return newThat.reload(options);
    }

    options.elem = $(options.elem);
    options.bindAction = $(options.bindAction);

    // 初始化 id 属性 - 优先取 options > 元素 id > 自增索引
    options.id = 'id' in options ? options.id : (
      elem.attr('id') || that.index
    );

    that.file();
    that.events();
  };
  
  //追加文件域
  Class.prototype.file = function(){
    var that = this;
    var options = that.config;
    var elemFile = that.elemFile = $([
      '<input class="'+ ELEM_FILE +'" type="file" accept="'+ options.acceptMime +'" name="'+ options.field +'"'
      ,(options.multiple ? ' multiple' : '') 
      ,'>'
    ].join(''));
    var next = options.elem.next();
    
    if(next.hasClass(ELEM_FILE) || next.hasClass(ELEM_FORM)){
      next.remove();
    }
    
    //包裹ie8/9容器
    if(device.ie && device.ie < 10){
      options.elem.wrap('<div class="layui-upload-wrap"></div>');
    }
    
    that.isFile() ? (
      that.elemFile = options.elem,
      options.field = options.elem[0].name
    ) : options.elem.after(elemFile);
    
    //初始化ie8/9的Form域
    if(device.ie && device.ie < 10){
      that.initIE();
    }
  };
  
  //ie8-9初始化
  Class.prototype.initIE = function(){
    var that = this;
    var options = that.config;
    var iframe = $('<iframe id="'+ ELEM_IFRAME +'" class="'+ ELEM_IFRAME +'" name="'+ ELEM_IFRAME +'" frameborder="0"></iframe>');
    var elemForm = $(['<form target="'+ ELEM_IFRAME +'" class="'+ ELEM_FORM +'" method="post" key="set-mine" enctype="multipart/form-data" action="'+ options.url +'">'
    ,'</form>'].join(''));
    
    //插入iframe    
    $('#'+ ELEM_IFRAME)[0] || $('body').append(iframe);

    //包裹文件域
    if(!options.elem.next().hasClass(ELEM_FORM)){
      that.elemFile.wrap(elemForm);      
      
      //追加额外的参数
      options.elem.next('.'+ ELEM_FORM).append(function(){
        var arr = [];
        layui.each(options.data, function(key, value){
          value = typeof value === 'function' ? value() : value;
          arr.push('<input type="hidden" name="'+ key +'" value="'+ value +'">')
        });
        return arr.join('');
      }());
    }
  };
  
  //异常提示
  Class.prototype.msg = function(content){
    return layer.msg(content, {
      icon: 2,
      shift: 6
    });
  };
  
  //判断绑定元素是否为文件域本身
  Class.prototype.isFile = function(){
    var elem = this.config.elem[0];
    if(!elem) return;
    return elem.tagName.toLocaleLowerCase() === 'input' && elem.type === 'file'
  }
  
  //预读图片信息
  Class.prototype.preview = function(callback){
    var that = this;
    if(window.FileReader){
      layui.each(that.chooseFiles, function(index, file){
        var reader = new FileReader();
        reader.readAsDataURL(file);  
        reader.onload = function(){
          callback && callback(index, file, this.result);
        }
      });
    }
  };
  
  // 执行上传
  Class.prototype.upload = function(files, type){
    var that = this;
    var options = that.config;
    var text = options.text || {};
    var elemFile = that.elemFile[0];

    // 获取文件队列
    var getFiles = function(){
      return files || that.files || that.chooseFiles || elemFile.files;
    };
    
    // 高级浏览器处理方式，支持跨域
    var ajaxSend = function(){
      var successful = 0;
      var failed = 0;
      var items = getFiles();

      // 多文件全部上传完毕的回调
      var allDone = function(){
        if(options.multiple && successful + failed === that.fileLength){
          typeof options.allDone === 'function' && options.allDone({
            total: that.fileLength,
            successful: successful,
            failed: failed
          });
        }
      };

      // 发送请求
      var request = function(sets){
        var formData = new FormData();

        // 恢复文件状态
        var resetFileState = function(file) {
          if (sets.unified) {
            layui.each(items, function(index, file){
              delete file[UPLOADING];
            });
          } else {
            delete file[UPLOADING];
          }
        };

        // 追加额外的参数
        layui.each(options.data, function(key, value){
          value = typeof value === 'function' ? value() : value;
          formData.append(key, value);
        });

        /*
         * 添加 file 到表单域
         */

        // 是否统一上传
        if (sets.unified) {
          layui.each(items, function(index, file){
            if (file[UPLOADING]) return;
            file[UPLOADING] = true; // 上传中的标记
            formData.append(options.field, file);
          });
        } else { // 逐一上传
          if (sets.file[UPLOADING]) return;
          formData.append(options.field, sets.file);
          sets.file[UPLOADING] = true; // 上传中的标记
        }

        // ajax 参数
        var opts = {
          url: options.url,
          type: 'post', // 统一采用 post 上传
          data: formData,
          dataType: options.dataType || 'json',
          contentType: false,
          processData: false,
          headers: options.headers || {},
          success: function(res){ // 成功回调
            options.unified ? (successful += that.fileLength) : successful++;
            done(sets.index, res);
            allDone(sets.index);
            resetFileState(sets.file);
          },
          error: function(e){ // 异常回调
            options.unified ? (failed += that.fileLength) : failed++;
            that.msg(text['error'] || [
              'Upload failed, please try again.',
              'status: '+ (e.status || '') +' - '+ (e.statusText || 'error')
            ].join('<br>'));
            error(sets.index);
            allDone(sets.index);
            resetFileState(sets.file);
          }
        };

        // 进度条
        if(typeof options.progress === 'function'){
          opts.xhr = function(){
            var xhr = $.ajaxSettings.xhr();
            // 上传进度
            xhr.upload.addEventListener("progress", function (obj) {
              if(obj.lengthComputable){
                var percent = Math.floor((obj.loaded/obj.total)* 100); // 百分比
                options.progress(percent, (options.item ? options.item[0] : options.elem[0]) , obj, sets.index);
              }
            });
            return xhr;
          }
        }
        $.ajax(opts);
      };

      // 多文件是否一起上传
      if(options.unified){
        request({
          unified: true,
          index: 0
        });
      } else {
        layui.each(items, function(index, file){
          request({
            index: index,
            file: file
          });
        });
      }
    };
    
    // 低版本 IE 处理方式，不支持跨域
    var iframeSend = function(){
      var iframe = $('#'+ ELEM_IFRAME);
    
      that.elemFile.parent().submit();

      // 获取响应信息
      clearInterval(Class.timer);
      Class.timer = setInterval(function() {
        var res, iframeBody = iframe.contents().find('body');
        try {
          res = iframeBody.text();
        } catch(e) {
          that.msg(text['cross-domain']); 
          clearInterval(Class.timer);
          error();
        }
        if(res){
          clearInterval(Class.timer);
          iframeBody.html('');
          done(0, res);
        }
      }, 30); 
    };
    
    // 统一回调
    var done = function(index, res){
      that.elemFile.next('.'+ ELEM_CHOOSE).remove();
      elemFile.value = '';
      
      if(options.force === 'json'){
        if(typeof res !== 'object'){
          try {
            res = JSON.parse(res);
          } catch(e){
            res = {};
            return that.msg(text['data-format-error']);
          }
        }
      }
      
      typeof options.done === 'function' && options.done(res, index || 0, function(files){
        that.upload(files);
      });
    };
    
    // 统一网络异常回调
    var error = function(index){
      if(options.auto){
        elemFile.value = '';
      }
      typeof options.error === 'function' && options.error(index || 0, function(files){
        that.upload(files);
      });
    };
    
    var check;
    var exts = options.exts;
    var value = function(){
      var arr = [];
      layui.each(files || that.chooseFiles, function(i, item){
        arr.push(item.name);
      });
      return arr;
    }();
    
    // 回调函数返回的参数
    var args = {
      // 预览
      preview: function(callback){
        that.preview(callback);
      },
      // 上传
      upload: function(index, file){
        var thisFile = {};
        thisFile[index] = file;
        that.upload(thisFile);
      },
      // 追加文件到队列
      pushFile: function(){
        that.files = that.files || {};
        layui.each(that.chooseFiles, function(index, item){
          that.files[index] = item;
        });
        return that.files;
      },
      // 重置文件
      resetFile: function(index, file, filename){
        var newFile = new File([file], filename);
        that.files = that.files || {};
        that.files[index] = newFile;
      }
    };
    
    // 提交上传
    var send = function(){
      // 上传前的回调 - 如果回调函数明确返回 false，则停止上传
      if(options.before && (options.before(args) === false)) return;

      // IE 兼容处理
      if(device.ie){
        return device.ie > 9 ? ajaxSend() : iframeSend();
      }
      
      ajaxSend();
    };
    
    // 文件类型名称
    var typeName = ({
      file: '文件',
      images: '图片',
      video: '视频',
      audio: '音频'
    })[options.accept] || '文件';

    // 校验文件格式
    value = value.length === 0 
      ? ((elemFile.value.match(/[^\/\\]+\..+/g)||[]) || '')
    : value;
    
    // 若文件域值为空
    if (value.length === 0) return;
    
    // 根据文件类型校验
    switch(options.accept){
      case 'file': // 一般文件
        layui.each(value, function(i, item){
          if(exts && !RegExp('.\\.('+ exts +')$', 'i').test(escape(item))){
            return check = true;
          }
        });
      break;
      case 'video': // 视频文件
        layui.each(value, function(i, item){
          if(!RegExp('.\\.('+ (exts || 'avi|mp4|wma|rmvb|rm|flash|3gp|flv') +')$', 'i').test(escape(item))){
            return check = true;
          }
        });
      break;
      case 'audio': // 音频文件
        layui.each(value, function(i, item){
          if(!RegExp('.\\.('+ (exts || 'mp3|wav|mid') +')$', 'i').test(escape(item))){
            return check = true;
          }
        });
      break;
      default: // 图片文件
        layui.each(value, function(i, item){
          if(!RegExp('.\\.('+ (exts || 'jpg|png|gif|bmp|jpeg|svg') +')$', 'i').test(escape(item))){
            return check = true;
          }
        });
      break;
    }
    
    // 校验失败提示
    if(check){
      that.msg(text['check-error'] || ('选择的'+ typeName +'中包含不支持的格式'));
      return elemFile.value = '';
    }

    // 选择文件的回调      
    if(type === 'choose' || options.auto){
      options.choose && options.choose(args);
      if(type === 'choose'){
        return;
      }
    }
    
    // 检验文件数量
    that.fileLength = function(){
      var length = 0;
      var items = getFiles();
      layui.each(items, function(){
        length++;
      });
      return length;
    }();
    
    if(options.number && that.fileLength > options.number){
      return that.msg(typeof text['limit-number'] === 'function' 
        ? text['limit-number'](options, that.fileLength) 
      : (
        '同时最多只能上传: '+ options.number + ' 个文件'
        +'<br>您当前已经选择了: '+ that.fileLength +' 个文件'
      ));
    }
    
    // 检验文件大小
    if(options.size > 0 && !(device.ie && device.ie < 10)){
      var limitSize;
      
      layui.each(getFiles(), function(index, file){
        if(file.size > 1024*options.size){
          var size = options.size/1024;
          size = size >= 1 ? (size.toFixed(2) + 'MB') : options.size + 'KB'
          elemFile.value = '';
          limitSize = size;
        }
      });
      if(limitSize) return that.msg(typeof text['limit-size'] === 'function' 
        ? text['limit-size'](options, limitSize) 
      : '文件大小不能超过 '+ limitSize);
    }

    send();
  };
  
  //事件处理
  Class.prototype.events = function(){
    var that = this;
    var options = that.config;
    
    // 设置当前选择的文件队列
    var setChooseFile = function(files){
      that.chooseFiles = {};
      layui.each(files, function(i, item){
        var time = new Date().getTime();
        that.chooseFiles[time + '-' + i] = item;
      });
    };
    
    // 设置选择的文本
    var setChooseText = function(files, filename){
      var elemFile = that.elemFile;
      var item = options.item ? options.item : options.elem;
      var value = files.length > 1 
        ? files.length + '个文件' 
      : ((files[0] || {}).name || (elemFile[0].value.match(/[^\/\\]+\..+/g)||[]) || '');
      
      if(elemFile.next().hasClass(ELEM_CHOOSE)){
        elemFile.next().remove();
      }
      that.upload(null, 'choose');
      if(that.isFile() || options.choose) return;
      elemFile.after('<span class="layui-inline '+ ELEM_CHOOSE +'">'+ value +'</span>');
    };

    // 点击上传容器
    options.elem.off('upload.start').on('upload.start', function(){
      var othis = $(this);

      that.config.item = othis;
      that.elemFile[0].click();
    });
    
    // 拖拽上传
    if(!(device.ie && device.ie < 10)){
      options.elem.off('upload.over').on('upload.over', function(){
        var othis = $(this)
        othis.attr('lay-over', '');
      })
      .off('upload.leave').on('upload.leave', function(){
        var othis = $(this)
        othis.removeAttr('lay-over');
      })
      .off('upload.drop').on('upload.drop', function(e, param){
        var othis = $(this);
        var files = param.originalEvent.dataTransfer.files || [];
        
        othis.removeAttr('lay-over');
        setChooseFile(files);

        options.auto ? that.upload() : setChooseText(files); // 是否自动触发上传
      });
    }
    
    // 文件选择
    that.elemFile.on('change', function(){
      var files = this.files || [];

      if(files.length === 0) return;

      setChooseFile(files);

      options.auto ? that.upload() : setChooseText(files); // 是否自动触发上传
    });
    
    // 手动触发上传
    options.bindAction.off('upload.action').on('upload.action', function(){
      that.upload();
    });


    // 防止事件重复绑定
    if(options.elem.data(MOD_INDEX)) return;


    // 目标元素 click 事件
    options.elem.on('click', function(){
      if(that.isFile()) return;
      $(this).trigger('upload.start');
    });
    
    // 目标元素 drop 事件
    if(options.drag){
      options.elem.on('dragover', function(e){
        e.preventDefault();
        $(this).trigger('upload.over');
      }).on('dragleave', function(e){
        $(this).trigger('upload.leave');
      }).on('drop', function(e){
        e.preventDefault();
        $(this).trigger('upload.drop', e);
      });
    }
    
    // 手动上传时触发上传的元素 click 事件
    options.bindAction.on('click', function(){
      $(this).trigger('upload.action');
    });
    
    // 绑定元素索引
    options.elem.data(MOD_INDEX, options.id);
  };

  // 记录所有实例
  thisModule.that = {}; // 记录所有实例对象

  // 获取当前实例对象
  thisModule.getThis = function(id){
    var that = thisModule.that[id];
    if(!that) hint.error(id ? (MOD_NAME +' instance with ID \''+ id +'\' not found') : 'ID argument required');
    return that;
  };
  
  // 核心入口  
  upload.render = function(options){
    var inst = new Class(options);
    return thisModule.call(inst);
  };
  
  exports(MOD_NAME, upload);
});

