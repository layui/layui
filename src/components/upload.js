/**
 * upload
 * 上传组件
 */

import { lay } from '../core/lay.js';
import { i18n } from '../core/i18n.js';
import { log } from '../core/logger.js';
import { $ } from 'jquery';
import { Component } from '../core/component.js';
import { layer } from './layer.js';
import { progress } from './progress.js';

export class Upload extends Component {
  // 默认配置
  static options = {
    url: '', // 上传地址
    data: {}, // 请求上传的额外参数
    fieldName: 'file', // 文件字段名
    // forceJsonResponse: false, // 是否强制接口返回 JSON 数据格式
    // mergeRequest: false, // 是否将多文件上传合并为一个请求
    // accept: '', // 筛选出的文件类型，如 `image/*`，默认为所有文件
    autoUpload: true, // 是否选完文件后自动上传
    // submitElem: '', // 用于触发提交上传的元素。`autoUpload: false` 时可用
    // multiple: false, // 是否支持多选文件上传
    showUploadList: true, // 是否显示上传文件列表
    enableDrag: true, // 是否开启拖拽上传
    maxSize: 0, // 允许上传的最大文件大小，单位 KB。0 表示不限制
    maxCount: 0, // 允许同时上传的文件数。0 表示不限制
  };

  static get CONST() {
    return {
      ...super.CONST,
      ELEM_FILE: 'lay-upload-file',
      ELEM_LIST: 'lay-upload-list',
      ELEM_DRAGOVER: 'lay-upload-dragover',
      UPLOADING: Symbol('uploading'), // 文件上传中的标记
    };
  }

  // 渲染
  render() {
    const options = this.options;
    const $elem = options.$elem;

    // 初始化 file 元素
    const $fileElem = (this.$fileElem = $(
      `<input class="${CONST.ELEM_FILE}" type="file">`,
    ));

    $fileElem.attr({
      name: options.fieldName,
      accept: options.accept,
      multiple: options.multiple,
    });

    if (this.#isElemFile()) {
      this.$fileElem = $elem;
      options.fieldName = $elem[0].name;
    }

    // 初始化「上传列表」容器
    if (options.showUploadList) {
      const $uploadListElem = $(`<div class="${CONST.ELEM_LIST}"></div>`);
      this.$uploadListElem?.remove();
      $elem.after($uploadListElem);
      this.$uploadListElem = $uploadListElem;
    }

    options.$submitElem = $(options.submitElem);

    this.files = [];
    this.#events();
  }

  // 文件预览
  preview(callback) {
    this.files.forEach((file, id) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        callback?.({ id, file, result: reader.result });
      };
    });
  }

  // 执行上传
  async upload() {
    const options = this.options;
    const fileElem = this.$fileElem[0];
    const files = this.files;

    // 提交上传请求
    const submitUpload = () => {
      const successful = [];
      const failed = [];

      // 发送请求
      const request = (file) => {
        const formData = new FormData();
        // 上传接口提交成功的回调
        const onSuccess = (res) => {
          fileElem.value = '';

          const parsedResult = parseResponseJson(res);

          switch (parsedResult.status) {
            case 'format-success':
              res = parsedResult.data;
              break;
            case 'format-error':
              return;
          }

          setUploadingStatus('success');
          options.onSuccess?.(res, files, file);
        };

        // 上传接口提交失败的回调
        const onError = (res, e) => {
          if (options.autoUpload) {
            fileElem.value = '';
          }

          const parsedResult = parseResponseJson(res);

          switch (parsedResult.status) {
            case 'format-success':
              res = parsedResult.data;
              break;
            case 'format-error':
              return;
          }

          setUploadingStatus('error');
          options.onError?.(res, files, file, e);
        };

        // 接口请求完毕的处理
        const onComplete = (...args) => {
          if (successful.length + failed.length === this.fileLength) {
            options.onComplete?.({
              ...args,
              files,
              successful: successful,
              failed: failed,
            });
          }
        };

        // 设置上传状态
        const setUploadingStatus = (value) => {
          if (options.mergeRequest) {
            files.forEach((file) => {
              file.uploadStatus = value;
            });
          } else {
            file.uploadStatus = value;
          }
        };

        // 追加额外的参数
        Object.entries(options.data || {}).forEach(([key, value]) => {
          value =
            typeof value === 'function'
              ? options.mergeRequest
                ? value(files)
                : value(file)
              : value;
          formData.append(key, value);
        });

        /*
         * 添加 file 到表单域
         */

        // 是否合并为一个请求进行上传
        if (options.mergeRequest) {
          files.forEach((file) => {
            if (file.uploadStatus === CONST.UPLOADING) return;
            file.uploadStatus = CONST.UPLOADING; // 上传中的标记
            formData.append(options.fieldName, file);
          });
        } else {
          // 逐一上传
          if (file.uploadStatus === CONST.UPLOADING) return;
          formData.append(options.fieldName, file);
          file.uploadStatus = CONST.UPLOADING; // 上传中的标记
        }

        // ajax 参数
        const opts = {
          url: options.url,
          type: 'post', // 统一采用 post 上传
          data: formData,
          dataType: options.dataType || 'json',
          contentType: false,
          processData: false,
          headers: options.headers || {},
          success: (res) => {
            if (options.mergeRequest) {
              successful.push(...files);
            } else {
              successful.push(file);
            }
            onSuccess(res);
          },
          error: (e) => {
            if (options.mergeRequest) {
              failed.push(...files);
            } else {
              failed.push(file);
            }
            showError(
              `Upload failed, please try again.<br>${e.status ? `status: ${e.status} - ${e.statusText}` : 'error'}`,
            );
            onError(e.responseText, e);
          },
          complete: onComplete,
          xhr: () => {
            const xhr = $.ajaxSettings.xhr();
            // 上传进度
            xhr.upload.addEventListener('progress', (event) => {
              if (event.lengthComputable) {
                const percent = Math.floor((event.loaded / event.total) * 100); // 百分比
                const params = { percent, event, file };

                this.#setProgressValue(params);
                options.onProgress?.(params);
              }
            });
            return xhr;
          },
        };

        $.ajax(opts);
      };

      // 多文件是否合并上传
      if (options.mergeRequest) {
        request();
      } else {
        files.forEach((file) => {
          request(file);
        });
      }
    };

    // 转换响应的数据格式
    const parseResponseJson = (src) => {
      if (options.forceJsonResponse) {
        if (typeof src !== 'object') {
          try {
            return {
              status: 'format-success',
              data: JSON.parse(src),
            };
          } catch {
            showError(i18n.$t('upload.dataFormatError'));
            return {
              status: 'format-error',
              data: {},
            };
          }
        }
      }
      return { status: '', data: {} };
    };

    const validationResult = this.#validate();
    if (validationResult) return;

    // 上传前的钩子
    // 若回调函数明确返回 false 或 Promise.reject，则阻止上传
    if (typeof options.beforeUpload === 'function') {
      Promise.resolve(options.beforeUpload())
        .then((result) => {
          if (result === false) {
            throw undefined;
          }
          submitUpload();
        })
        .catch((error) => {
          if (options.autoUpload) {
            fileElem.value = '';
          }
          error !== undefined && log(error);
        });
    } else {
      submitUpload();
    }
  }

  // 校验
  #validate() {
    const options = this.options;
    const fileElem = this.$fileElem[0];
    const files = this.files;

    // 检验文件数量
    this.fileLength = files.length;

    if (options.maxCount && this.fileLength > options.maxCount) {
      return showError(
        `${i18n.$t('upload.validateMessages.filesOverLengthLimit', {
          length: options.maxCount,
        })}<br/>${i18n.$t('upload.validateMessages.currentFilesLength', {
          length: this.fileLength,
        })}`,
      );
    }

    // 检验文件大小
    if (options.maxSize > 0) {
      let limitSizeText;

      for (const file of Object.values(files || {})) {
        if (file.size > 1024 * options.maxSize) {
          let sizeMb = options.maxSize / 1024;
          limitSizeText =
            sizeMb >= 1 ? `${sizeMb.toFixed(2)}MB` : `${options.maxSize}KB`;
          fileElem.value = '';
          break;
        }
      }

      if (limitSizeText)
        return showError(
          i18n.$t('upload.validateMessages.fileOverSizeLimit', {
            size: limitSizeText,
          }),
        );
    }
  }

  // 目标元素是否为 file 元素
  #isElemFile() {
    const elem = this.options.$elem[0];
    if (!elem) return;
    return elem.tagName.toLocaleLowerCase() === 'input' && elem.type === 'file';
  }

  // 设置上传进度值
  #setProgressValue({ percent, file }) {
    const options = this.options;
    const $uploadListElem = this.$uploadListElem;

    if (!$uploadListElem) return;

    $uploadListElem.find(`.${CONST.ELEM_LIST}-item`).each((_, item) => {
      const $item = $(item);
      const $progress = $item.find('.lay-progress');
      const progressId = $progress.attr('lay-progress-id');

      if (options.mergeRequest) {
        progress.setValue(progressId, percent);
      } else {
        if ($item.data('id') === file.id) {
          progress.setValue(progressId, percent);
        }
      }
    });
  }

  // 事件处理
  #events() {
    const options = this.options;
    const $elem = options.$elem;
    const Constructor = this.constructor;

    // 设置当前选择的文件队列
    const setChooseFile = (files) => {
      const $uploadListElem = this.$uploadListElem;
      // 插入上传列表项元素
      const appendUploadListItem = (file) => {
        const $uploadListItem = $(`
<div class="${CONST.ELEM_LIST}-item">
  <span class="${CONST.ELEM_LIST}-item-name lay-ellipsis">${file.name}</span>
  <div class="lay-progress lay-size-lg" lay-show-percent="true"></div>
</div>
        `);
        const $actions = $(
          `<div class="${CONST.ELEM_LIST}-item-actions"> </div>`,
        );
        const $deleteBtn = $('<i class="lay-icon lay-icon-clear"></i>');

        // 删除按钮事件
        $deleteBtn.on('click', () => {
          // 从文件队列中移除
          this.files.splice(
            this.files.findIndex((item) => item.id === file.id),
            1,
          );
          // 从上传列表中移除
          $uploadListItem.remove();
          // 中断上传请求
          if (file.uploadStatus === CONST.UPLOADING) {
            // 待实现
          }
        });

        $actions.append($deleteBtn);
        $uploadListItem.append($actions);
        $uploadListItem.data({ id: file.id });
        $uploadListElem.append($uploadListItem);

        progress.render({
          elem: $uploadListItem.find('.lay-progress'),
        });
      };

      this.files = [];
      $uploadListElem.empty();

      files.forEach((item) => {
        this.files.push(item);
      });

      // 插入上传列表项元素
      if (options.showUploadList) {
        for (const file of files) {
          appendUploadListItem(file);
        }
      }

      options.onChoose?.();
    };

    // 事件命名空间
    const eventNamespace = `.lay_${Constructor.componentName}_events`;

    // 避免重复绑定事件
    $elem.off(eventNamespace);

    // 文件选择
    this.$fileElem.on(`change${eventNamespace}`, (event) => {
      const files = enhanceFiles(event.currentTarget.files);

      if (files.length === 0) return;

      setChooseFile(files);
      options.autoUpload && this.upload();
    });

    // 目标元素 click 事件
    $elem.on(`click${eventNamespace}`, () => {
      if (this.#isElemFile()) return;
      this.$fileElem[0]?.click();
    });

    // 拖拽上传
    if (options.enableDrag) {
      $elem
        .on(`dragover${eventNamespace}`, (e) => {
          const $this = $(e.currentTarget);
          e.preventDefault();
          $this.addClass(CONST.ELEM_DRAGOVER);
        })
        .on(`dragleave${eventNamespace}`, (e) => {
          const $this = $(e.currentTarget);
          $this.removeClass(CONST.ELEM_DRAGOVER);
        })
        .on(`drop${eventNamespace}`, (e) => {
          e.preventDefault();
          const $this = $(e.currentTarget);
          const files = enhanceFiles(e.originalEvent.dataTransfer.files);

          $this.removeClass(CONST.ELEM_DRAGOVER);

          setChooseFile(files);
          options.autoUpload && this.upload();
        });
    }

    // 手动上传时，用于触发提交上传的元素 click 事件
    options.$submitElem.on(`click${eventNamespace}`, () => {
      this.upload();
    });
  }
}

const CONST = Upload.CONST;

// 弹出异常提示
const showError = (content) => {
  return layer.msg(content, {
    icon: 2,
    anim: 6,
  });
};

/**
 * 增强文件列表信息
 * @param {FileList} files
 * @return {Array<File>|FileList}
 */
const enhanceFiles = (files = []) => {
  const result = [];
  // 扩展文件信息
  const extendFileInfo = (obj) => {
    // 生成文件 id
    const generateId = (file) => {
      return lay.btoa(`${file.name}-${file.size}-${file.lastModified}`, 'url');
    };
    /**
     * 文件大小处理
     * @param {number | string} size - 文件大小
     * @param {number} [precision] - 数值精度
     * @return {string}
     */
    const parseSize = (size, precision) => {
      precision = precision || 2;
      if (null == size || !size) {
        return '0';
      }
      const unitArr = ['Bytes', 'Kb', 'Mb', 'Gb', 'Tb', 'Pb', 'Eb', 'Zb', 'Yb'];
      let index;
      const formatSize = typeof size === 'string' ? parseFloat(size) : size;
      index = Math.floor(Math.log(formatSize) / Math.log(1024));
      size = formatSize / Math.pow(1024, index);
      size = size % 1 === 0 ? size : parseFloat(size.toFixed(precision)); // 保留的小数位数
      return `${size}${unitArr[index]}`;
    };
    const extInfo = (file) => {
      Object.assign(file, {
        id: generateId(file), // 文件 id
        sizeText: parseSize(file.size), // 文件大小
        // 文件扩展名
        extname: file.name.substr(file.name.lastIndexOf('.') + 1).toLowerCase(),
      });
    };

    // FileList 对象
    if (obj instanceof FileList) {
      Array.from(obj).forEach((item) => {
        extInfo(item);
      });
    } else {
      extInfo(obj);
    }

    return obj;
  };

  Array.from(files).forEach((item) => {
    result.push(extendFileInfo(item));
  });

  return result;
};

export { Upload as upload };
