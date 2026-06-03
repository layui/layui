/**
 * upload
 * 上传组件
 */

import { i18n } from '../core/i18n.js';
import { log } from '../core/logger.js';
import { $ } from 'jquery';
import { Component } from '../core/component.js';
import { layer } from './layer.js';

export class Upload extends Component {
  // 默认配置
  static options = {
    url: '', // 上传地址
    data: {}, // 请求上传的额外参数
    fieldName: 'file', // 文件字段名
    // forceJsonResponse: false, // 是否强制接口返回 JSON 数据格式
    // mergeRequest: false, // 是否将多文件上传合并为一个请求
    // accept: '', // 筛选出的文件类型，如 `image/*`，默认为所有文件
    acceptType: 'image', // 允许上传的文件类型：image|file|video|audio
    // acceptExts: '', // 允许上传的文件后缀名
    autoUpload: true, // 是否选完文件后自动上传
    // submitElem: '', // 用于触发提交上传的元素。`autoUpload: false` 时可用
    // multiple: false, // 是否允许多文件上传
    enableDrag: true, // 是否开启拖拽上传
    maxSize: 0, // 允许上传的最大文件大小，单位 KB。0 表示不限制
    maxCount: 0, // 允许同时上传的文件数。0 表示不限制
  };

  static get CONST() {
    return {
      ...super.CONST,
      ELEM_FILE: 'lay-upload-file',
      ELEM_CHOOSE: 'lay-upload-choose',
      ELEM_DRAGOVER: 'lay-upload-dragover',
      UPLOADING: 'UPLOADING',
    };
  }

  // 渲染
  render() {
    const options = this.options;

    options.$submitElem = $(options.submitElem);

    this.#initFileInput();
    this.#events();
  }

  // 初始化 file 元素
  #initFileInput() {
    const options = this.options;
    const $elem = options.$elem;
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
  }

  // 目标元素是否为 file 元素
  #isElemFile() {
    const elem = this.options.$elem[0];
    if (!elem) return;
    return elem.tagName.toLocaleLowerCase() === 'input' && elem.type === 'file';
  }

  // 文件预览
  preview(callback) {
    Object.entries(this.chooseFiles || {}).forEach(([index, file]) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        callback?.(index, file, reader.result);
      };
    });
  }

  // 执行上传
  async upload(files, type) {
    const options = this.options;
    const fileElem = this.$fileElem[0];

    // 获取文件队列
    const getFiles = () =>
      files || this.files || this.chooseFiles || fileElem.files;

    // 提交上传请求
    const submitUpload = () => {
      const items = getFiles();
      const successful = [];
      const failed = [];

      // 发送请求
      const request = (sets) => {
        const formData = new FormData();
        // 上传接口提交成功的回调
        const onSuccess = (res, index) => {
          this.$fileElem.next(`.${CONST.ELEM_CHOOSE}`).remove();
          fileElem.value = '';

          const parsedResult = parseResponseJson(res);

          switch (parsedResult.status) {
            case 'format-success':
              res = parsedResult.data;
              break;
            case 'format-error':
              return;
          }

          options.onSuccess?.(res, index || 0);
        };

        // 上传接口提交失败的回调
        const onError = (res, index, e) => {
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

          options.onError?.(res, index || 0, e);
        };

        // 接口请求完毕的处理
        const onComplete = (...args) => {
          if (successful.length + failed.length === this.fileLength) {
            options.onComplete?.({
              ...args,
              files: items,
              successful: successful,
              failed: failed,
            });
          }

          // 恢复文件状态
          if (options.mergeRequest) {
            Object.values(items || {}).forEach((fileItem) => {
              delete fileItem[CONST.UPLOADING];
            });
          } else {
            delete sets.file[CONST.UPLOADING];
          }
        };

        // 追加额外的参数
        Object.entries(options.data || {}).forEach(([key, value]) => {
          value =
            typeof value === 'function'
              ? options.mergeRequest
                ? value()
                : value(sets.index, sets.file)
              : value;
          formData.append(key, value);
        });

        /*
         * 添加 file 到表单域
         */

        // 是否合并为一个请求进行上传
        if (options.mergeRequest) {
          Object.values(items || {}).forEach((file) => {
            if (file[CONST.UPLOADING]) return;
            file[CONST.UPLOADING] = true; // 上传中的标记
            formData.append(options.fieldName, file);
          });
        } else {
          // 逐一上传
          if (sets.file[CONST.UPLOADING]) return;
          formData.append(options.fieldName, sets.file);
          sets.file[CONST.UPLOADING] = true; // 上传中的标记
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
              successful.push(...Object.values(items || {}));
            } else {
              successful.push(sets.file);
            }
            onSuccess(res, sets.index);
          },
          error: (e) => {
            if (options.mergeRequest) {
              failed.push(...Object.values(items || {}));
            } else {
              failed.push(sets.file);
            }
            showError(
              `Upload failed, please try again.<br>${e.status ? `status: ${e.status} - ${e.statusText}` : 'error'}`,
            );
            onError(e.responseText, sets.index, e);
          },
          complete: onComplete,
        };

        // 进度条
        if (typeof options.onProgress === 'function') {
          opts.xhr = () => {
            const xhr = $.ajaxSettings.xhr();
            // 上传进度
            xhr.upload.addEventListener('progress', (event) => {
              if (event.lengthComputable) {
                const percent = Math.floor((event.loaded / event.total) * 100); // 百分比
                options.onProgress({
                  percent,
                  event,
                  index: sets.index,
                });
              }
            });
            return xhr;
          };
        }
        $.ajax(opts);
      };

      // 多文件是否合并上传
      if (options.mergeRequest) {
        request({
          index: 0,
        });
      } else {
        Object.entries(items || {}).forEach(function ([index, file]) {
          request({
            index: index,
            file: file,
          });
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

    let check;
    const acceptExts = options.acceptExts;
    let value = (() => {
      const arr = [];
      Object.values(files || this.chooseFiles || {}).forEach((item) => {
        arr.push(item.name);
      });
      return arr;
    })();

    // 回调函数返回的参数
    const args = {
      // 预览
      preview: (previewCallback) => {
        this.preview(previewCallback);
      },
      // 上传
      upload: (index, file) => {
        const thisFile = {};
        thisFile[index] = file;
        this.upload(thisFile);
      },
      // 追加文件到队列
      pushFile: () => {
        this.files = this.files || {};
        Object.entries(this.chooseFiles || {}).forEach(([index, item]) => {
          this.files[index] = item;
        });
        return this.files;
      },
      // 重置文件
      resetFile: (index, file, filename) => {
        const newFile = new File([file], filename);
        this.files = this.files || {};
        this.files[index] = newFile;
      },
      // 获取本次选取的文件
      getChooseFiles: () => {
        return this.chooseFiles;
      },
    };

    // 文件类型名称
    const typeName =
      {
        file: i18n.$t('upload.fileType.file'),
        image: i18n.$t('upload.fileType.image'),
        video: i18n.$t('upload.fileType.video'),
        audio: i18n.$t('upload.fileType.audio'),
      }[options.acceptType] || i18n.$t('upload.fileType.file');

    // 校验文件格式
    value =
      value.length === 0
        ? fileElem.value.match(/[^/\\]+\..+/g) || [] || ''
        : value;

    // 若文件域值为空
    if (value.length === 0) return;

    // 根据文件类型校验
    switch (options.acceptType) {
      case 'file': // 一般文件
        for (const item of value) {
          if (
            acceptExts &&
            !RegExp(`.\\.(${acceptExts})$`, 'i').test(escape(item))
          ) {
            check = true;
            break;
          }
        }
        break;
      case 'video': // 视频文件
        for (const item of value) {
          if (
            !RegExp(
              `.\\.(${acceptExts || 'avi|mp4|wma|rmvb|rm|flash|3gp|flv'})$`,
              'i',
            ).test(escape(item))
          ) {
            check = true;
            break;
          }
        }
        break;
      case 'audio': // 音频文件
        for (const item of value) {
          if (
            !RegExp(`.\\.(${acceptExts || 'mp3|wav|mid'})$`, 'i').test(
              escape(item),
            )
          ) {
            check = true;
            break;
          }
        }
        break;
      default: // 图片文件
        for (const item of value) {
          if (
            !RegExp(
              `.\\.(${acceptExts || 'jpg|png|gif|bmp|jpeg|svg|webp'})$`,
              'i',
            ).test(escape(item))
          ) {
            check = true;
            break;
          }
        }
        break;
    }

    // 校验失败提示
    if (check) {
      showError(
        i18n.$t('upload.validateMessages.fileExtensionError', {
          fileType: typeName,
        }),
      );
      return (fileElem.value = '');
    }

    // 选择文件的钩子
    if (type === 'choose' || options.autoUpload) {
      options.onChoose?.(args);
      if (type === 'choose') return;
    }

    // 检验文件数量
    this.fileLength = Object.keys(getFiles() || {}).length;

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

      for (const file of Object.values(getFiles() || {})) {
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

    // 上传前的钩子
    // 若回调函数明确返回 false 或 Promise.reject，则阻止上传
    if (typeof options.beforeUpload === 'function') {
      Promise.resolve(options.beforeUpload(args))
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

  // 事件处理
  #events() {
    const options = this.options;
    const $elem = options.$elem;
    const Constructor = this.constructor;

    // 设置当前选择的文件队列
    const setChooseFile = (files) => {
      this.chooseFiles = {};
      Array.from(files || []).forEach((item, i) => {
        const time = new Date().getTime();
        this.chooseFiles[`${time}-${i}`] = item;
      });
    };

    // 设置选择的文本
    const setChooseText = (files) => {
      const $fileElem = this.$fileElem;
      const value =
        files.length > 1
          ? i18n.$t('upload.chooseText', { length: files.length })
          : (files[0] || {}).name ||
            $fileElem[0].value.match(/[^/\\]+\..+/g) ||
            [] ||
            '';

      if ($fileElem.next().hasClass(CONST.ELEM_CHOOSE)) {
        $fileElem.next().remove();
      }
      this.upload(null, 'choose');
      if (this.#isElemFile() || options.onChoose) return;
      $fileElem.after(
        `<span class="lay-inline ${CONST.ELEM_CHOOSE}">${value}</span>`,
      );
    };

    /**
     * 判断文件是否加入排队
     * @param {File} file
     * @return {boolean}
     */
    const checkFile = (file) => {
      return !Object.values(this.files || {}).some((item) => {
        return item.name === file.name;
      });
    };

    /**
     * 扩展文件信息
     * @template {File | FileList} T
     * @param {T} obj
     * @return {T}
     */
    const extendInfo = (obj) => {
      const extInfo = (file) => {
        //文件扩展名
        file.ext = file.name
          .substr(file.name.lastIndexOf('.') + 1)
          .toLowerCase();
        // 文件大小
        file.sizes = parseSize(file.size);
        // 可以继续扩展
      };

      //FileList对象
      if (obj instanceof FileList) {
        Array.from(obj).forEach((item) => {
          extInfo(item);
        });
      } else {
        extInfo(obj);
      }

      return obj;
    };

    /**
     * 检查获取文件
     * @param {FileList} files
     * @return {Array<File>|FileList}
     */
    const getFiles = (files) => {
      files = files || [];
      if (!files.length) return [];
      if (!this.files) return extendInfo(files);
      const result = [];
      Array.from(files).forEach((item) => {
        if (checkFile(item)) {
          result.push(extendInfo(item));
        }
      });
      return result;
    };

    const eventNamespace = `.lay_${Constructor.componentName}_events`;

    $elem.off(eventNamespace); // 避免重复绑定事件

    // 文件选择
    this.$fileElem.on(`change${eventNamespace}`, (event) => {
      const files = getFiles(event.currentTarget.files);

      if (files.length === 0) return;

      setChooseFile(files);

      options.autoUpload ? this.upload() : setChooseText(files);
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
          const files = getFiles(e.originalEvent.dataTransfer.files);

          $this.removeClass(CONST.ELEM_DRAGOVER);
          setChooseFile(files);

          // 是否自动触发上传
          options.autoUpload ? this.upload() : setChooseText(files);
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
 * 文件大小处理
 * @param {number | string} size -文件大小
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

export { Upload as upload };
