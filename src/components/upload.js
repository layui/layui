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
  static componentName = 'upload';

  // 默认配置
  static options = {
    url: '', // 上传地址
    data: {}, // 请求上传的额外参数
    dataType: 'json', // 预期服务端返回的数据类型
    fieldName: 'file', // 文件字段名
    // mergeRequest: false, // 是否将多文件上传合并为一个请求
    // accept: '', // 筛选出的文件类型，如 `image/*`，默认为所有文件
    // submitElem: '', // 用于触发提交上传的元素。`autoUpload: false` 时可用
    // multiple: false, // 是否支持多选文件上传
    autoUpload: true, // 是否选完文件后自动上传
    showUploadList: true, // 是否显示上传文件列表
    enableDrag: true, // 是否开启拖拽上传
    maxSize: 0, // 限制上传的文件大小，单位 KB。0 表示不限制
    maxCount: 0, // 限制上传的文件数量。0 表示不限制
  };

  static get CONST() {
    return {
      ...super.CONST,
      ELEM_FILE: 'lay-upload-file',
      ELEM_LIST: 'lay-upload-list',
      ELEM_DRAGOVER: 'lay-upload-dragover',
    };
  }

  // 文件上传状态
  static uploadStatus = {
    IDLE: 'idle', // 空闲
    SELECTED: 'selected', // 已选择
    UPLOADING: 'uploading', // 上传中
    SUCCESS: 'success', // 上传成功
    ERROR: 'error', // 上传失败
    ABORTED: 'aborted', // 已中断
  };

  /**
   * 执行上传；一般当 `autoUpload: false` 时使用
   * @param {string} id - 组件实例 id
   */
  static upload(id) {
    const inst = this.getInstance(id);
    if (!inst) return;
    inst.upload();
  }

  /**
   * 中止上传
   * @param {string} id - 组件实例 id
   */
  static abort(id) {
    const inst = this.getInstance(id);
    if (!inst) return;
    inst.abort();
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
  preview(files = this.files, callback) {
    files.forEach((file, index) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        callback?.({ file, index, result: reader.result });
      };
    });
  }

  // 执行上传
  async upload() {
    const options = this.options;
    const selectedFiles = this.getSelectedFiles();

    const successful = [];
    const failed = [];

    // 发送请求
    const request = ({ file, formData }) => {
      const files = file ? [file] : [...selectedFiles];

      // 上传接口提交成功的回调
      const onSuccess = (res) => {
        this.updateUploadItem({
          files,
          status: uploadStatus.SUCCESS,
        });
        successful.push(...files);
        options.onSuccess?.(res, { files });
      };

      // 上传接口提交失败的回调
      const onError = (e, textStatus) => {
        if (textStatus === 'abort') {
          this.updateUploadItem({
            files,
            status: uploadStatus.ABORTED,
          });
          return;
        }

        showError(
          `Upload ${uploadStatus.ERROR}, please try again.${e.status ? `<br>status: ${e.status} - ${e.statusText}` : ''}`,
        );
        this.updateUploadItem({
          files,
          status: uploadStatus.ERROR,
        });

        failed.push(...files);
        options.onError?.(e, { files });
      };

      // 接口请求完毕的处理
      const onComplete = (...args) => {
        this.#removeProgress({ files }); // 移除进度条

        if (successful.length + failed.length === selectedFiles.length) {
          options.onComplete?.({
            ...args,
            files: selectedFiles,
            successful: successful,
            failed: failed,
          });
        }
      };

      // 追加额外的参数
      Object.entries(options.data || {}).forEach(([key, value]) => {
        value = typeof value === 'function' ? value({ files }) : value;
        formData.append(key, value);
      });

      // console.log(options.fieldName, formData.getAll(options.fieldName));

      // ajax 参数
      const opts = {
        url: options.url,
        type: 'post',
        data: formData,
        dataType: options.dataType,
        contentType: false,
        processData: false,
        headers: options.headers,
        success: onSuccess,
        error: onError,
        complete: onComplete,
        xhr: () => {
          const xhr = $.ajaxSettings.xhr();
          // 上传进度
          xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
              const percent = Math.floor((event.loaded / event.total) * 100);
              const params = { percent, event, files };

              this.#updateProgress(params);
              options.onProgress?.(params);
            }
          });
          return xhr;
        },
      };

      return $.ajax(opts);
    };

    // 提交上传请求
    const submitUpload = () => {
      // 添加 file 到表单域
      const appendFileToFormData = ({ formData, file }) => {
        if (file.uploadStatus === uploadStatus.UPLOADING) return;
        formData.append(options.fieldName, file);
        file.uploadStatus = uploadStatus.UPLOADING;
      };

      // 多文件是否合并上传
      if (options.mergeRequest) {
        const formData = new FormData();

        // 将所有文件添加到一个 FormData 中
        selectedFiles.forEach((file) =>
          appendFileToFormData({ formData, file }),
        );

        const jqXHR = request({ formData });

        // 将 jqXHR 对象关联到当前文件队列
        selectedFiles.forEach((file) => {
          file.jqXHR = jqXHR;
        });
      } else {
        // 逐个上传
        selectedFiles.forEach((file) => {
          const formData = new FormData();
          appendFileToFormData({ formData, file });
          file.jqXHR = request({ file, formData });
        });
      }
    };

    // 未选择文件
    if (!selectedFiles.length) return;

    // 文件校验
    const validationResult = this.#validate();
    if (validationResult) return;

    // 上传前的钩子
    // 若回调函数明确返回 false 或 Promise.reject，则阻止上传
    try {
      const result = await options.beforeUpload?.({ selectedFiles });
      if (result === false) return;
    } catch (error) {
      log(`beforeUpload error: ${error}`);
      return;
    }

    submitUpload();
  }

  /**
   * 中止上传
   * @returns
   */
  abort() {
    const files = this.files;

    // 中止「UPLOADING 状态」的文件上传
    files.forEach((file) => {
      if (file.uploadStatus === uploadStatus.UPLOADING) {
        file.jqXHR?.abort(); // 中止上传请求
        this.updateUploadItem({
          files: [file],
          status: uploadStatus.ABORTED,
        });
      }
    });
  }

  /**
   * 获取 SELECTED 状态的文件列表
   * @returns {Array<File>}
   */
  getSelectedFiles() {
    return this.files.filter(
      (file) => file.uploadStatus === uploadStatus.SELECTED,
    );
  }

  /**
   * 添加上传列表项
   * @param {File} file - 文件对象
   */
  appendUploadItem(file) {
    const $uploadListElem = this.$uploadListElem;
    const $uploadListItem = $(`
<div class="${CONST.ELEM_LIST}-item">
  <div class="${CONST.ELEM_LIST}-item-status"><i class="lay-icon lay-icon-loading lay-anim lay-anim-rotate lay-anim-loop"></i></div>
  <div class="${CONST.ELEM_LIST}-item-name lay-ellipsis">${file.name}</div>
  <div class="lay-progress" lay-show-percent="true"></div>
</div>
        `);
    const $actions = $(`<div class="${CONST.ELEM_LIST}-item-actions"> </div>`);
    const $deleteBtn = $('<i class="lay-icon lay-icon-clear"></i>');

    // 删除按钮事件
    $deleteBtn.on('click', () => this.deleteUploadItem(file));

    $actions.append($deleteBtn);
    $uploadListItem.attr({ id: file.id }).append($actions);
    $uploadListElem.append($uploadListItem);

    progress.render({
      elem: $uploadListItem.find('.lay-progress'),
    });
  }

  /**
   * 更新上传列表项的状态
   * @param {Object} param0
   * @param {Array<File>} param0.files - 文件对象数组
   * @param {string} param0.status - 上传状态
   */
  updateUploadItem({ files, status }) {
    const $uploadListElem = this.$uploadListElem;

    files.forEach((file) => {
      file.uploadStatus = status; // 更新文件上传状态

      // 更新上传列表元素的状态
      if (!$uploadListElem) return;
      const $uploadListItem = $uploadListElem.find(`#${file.id}`);
      const $uploadListItemStatus = $uploadListItem.find(
        `.${CONST.ELEM_LIST}-item-status`,
      );

      // 设置对应的状态样式
      $uploadListItem.toggleClass(
        `${CONST.ELEM_LIST}-success`,
        status === uploadStatus.SUCCESS,
      );
      $uploadListItem.toggleClass(
        `${CONST.ELEM_LIST}-error`,
        status === uploadStatus.ERROR,
      );
      $uploadListItem.toggleClass(
        `${CONST.ELEM_LIST}-aborted`,
        status === uploadStatus.ABORTED,
      );

      // 更新状态图标
      const $icons = {
        [uploadStatus.SUCCESS]:
          '<i class="lay-icon lay-icon-success" title="upload success"></i>',
        [uploadStatus.ERROR]:
          '<i class="lay-icon lay-icon-error" title="upload error"></i>',
        [uploadStatus.ABORTED]:
          '<i class="lay-icon lay-icon-disabled" title="upload aborted"></i>',
      };
      $uploadListItemStatus.html($icons[status] || '');
    });
  }

  /**
   * 删除上传列表项
   * @param {File} file - 文件对象
   */
  deleteUploadItem(file) {
    // 从文件队列中移除
    this.files.splice(
      this.files.findIndex((item) => item.id === file.id),
      1,
    );
    // 中断上传请求
    if (file.uploadStatus === uploadStatus.UPLOADING) {
      file.jqXHR?.abort();
    }

    // 从上传列表元素中移除
    const $uploadListElem = this.$uploadListElem;
    if (!$uploadListElem) return;

    const $uploadListItem = $uploadListElem.find(`#${file.id}`);
    const $progress = $uploadListItem.find('.lay-progress');
    const progressId = $progress.attr('lay-progress-id');

    $uploadListItem.remove(); // 移除元素
    progress.removeInstance(progressId); // 删除进度条实例
  }

  /**
   * 清空上传列表
   */
  clearUploadList() {
    [...this.files].forEach(this.deleteUploadItem.bind(this));
  }

  // 校验
  #validate() {
    const options = this.options;
    const fileElem = this.$fileElem[0];
    const files = this.files;
    const selectedFiles = this.getSelectedFiles();

    // 检验文件数量
    if (options.maxCount && files.length > options.maxCount) {
      return showError(
        `${i18n.$t('upload.validateMessages.filesOverLengthLimit', {
          length: options.maxCount,
        })}<br/>${i18n.$t('upload.validateMessages.currentFilesLength', {
          length: files.length,
        })}`,
      );
    }

    // 检验文件大小
    if (options.maxSize > 0) {
      let limitSizeText;

      for (const file of Object.values(selectedFiles || {})) {
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

  // 更新进度条
  #updateProgress({ percent, files }) {
    const $uploadListElem = this.$uploadListElem;
    if (!$uploadListElem) return;

    files.forEach((file) => {
      const $uploadListItem = $uploadListElem.find(`#${file.id}`);
      const $progress = $uploadListItem.find('.lay-progress');
      const progressId = $progress.attr('lay-progress-id');
      progress.setValue(progressId, percent);
    });
  }

  // 删除进度条
  #removeProgress({ files }) {
    const $uploadListElem = this.$uploadListElem;
    if (!$uploadListElem) return;

    // 删除指定的进度条
    const removeProgressById = (id) => {
      const $uploadListItem = $uploadListElem.find(`#${id}`);
      const $progress = $uploadListItem.find('.lay-progress');
      const progressId = $progress.attr('lay-progress-id');

      $progress.remove(); // 移除元素
      progress.removeInstance(progressId); // 移除实例
    };

    // 删除「非 UPLOADING 状态」的进度条
    files.forEach((item) => {
      if (item.uploadStatus !== uploadStatus.UPLOADING) {
        removeProgressById(item.id);
      }
    });
  }

  // 处理文件选择
  #handleFileSelection(files) {
    const options = this.options;

    if (!files.length) return;

    // 文件选择时的回调
    options.onSelect?.({ files });

    // 选择后清空 file 元素的值
    this.$fileElem[0].value = '';

    // 限制文件数量
    if (options.maxCount) {
      // 若限制文件数为 1，则用当前选择的文件替换队列中的文件
      if (options.maxCount == 1) {
        this.clearUploadList();
      }
      // 若超出文件数量限制
      if (files.length + this.files.length > options.maxCount) {
        return;
      }
    }

    // 添加文件到队列
    files.forEach((file) => {
      // 后续此处要增加文件校验，通过校验的文件才设置为 SELECTED 状态
      file.uploadStatus = uploadStatus.SELECTED;
      this.files.push(file);
    });

    // 插入上传列表项元素
    if (options.showUploadList) {
      for (const file of files) {
        this.appendUploadItem(file);
      }
    }

    // 是否自动上传
    options.autoUpload && this.upload();
  }

  // 事件处理
  #events() {
    const options = this.options;
    const $elem = options.$elem;
    const Constructor = this.constructor;

    // 事件命名空间
    const eventNamespace = `.lay_${Constructor.componentName}_events`;

    // 避免重复绑定事件
    $elem.off(eventNamespace);

    // 文件选择
    this.$fileElem.on(`change${eventNamespace}`, (event) => {
      const files = enhanceFiles(event.currentTarget.files);
      this.#handleFileSelection(files);
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
          this.#handleFileSelection(files);
        });
    }

    // 手动上传时，用于触发提交上传的元素 click 事件
    options.$submitElem.on(`click${eventNamespace}`, () => {
      this.upload();
    });
  }
}

const { CONST, uploadStatus } = Upload;

// 弹出异常提示
const showError = (content) => {
  return layer.msg(content, {
    icon: 2,
    anim: 6,
    offset: '16px',
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
      return lay.btoa([file.name, Date.now(), Math.random()].join('-'), 'url');
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
        // 上传状态
        uploadStatus: uploadStatus.IDLE,
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
