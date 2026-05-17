<style>
  /*
   * 基于复选框和单选框的卡片风格多选组件
   * 需要具备一些基础的 CSS 技能，以下样式均为外部自主实现。
   */

  /* 主体 */
  .lay-form-checkbox>.lay-skin-checkcard,
  .lay-form-radio>.lay-skin-checkcard {
    display: table;
    display: flex;
    padding: 12px;
    white-space: normal;
    border-radius: 10px;
    border: 1px solid #e5e5e5;
    color: #000;
    background-color: #fff;
  }

  .lay-form-checkbox>.lay-skin-checkcard>*,
  .lay-form-radio>.lay-skin-checkcard>* {
    /* display: table-cell; */  /* IE */
    vertical-align: top;
  }

  /* 悬停 */
  .lay-form-checkbox:hover>.lay-skin-checkcard,
  .lay-form-radio:hover>.lay-skin-checkcard {
    border-color: #16b777;
  }

  /* 选中 */
  .lay-form-checked>.lay-skin-checkcard,
  .lay-form-radioed[lay-skin="none"]>.lay-skin-checkcard {
    color: #000;
    border-color: #16b777;
    background-color: rgb(22 183 119 / 10%) !important;
    /* box-shadow: 0 0 0 3px rgba(22, 183, 119, 0.08); */
  }


  /* 禁用 */
  .lay-checkbox-disabled>.lay-skin-checkcard,
  .lay-radio-disabled>.lay-skin-checkcard {
    box-shadow: none;
    border-color: #e5e5e5 !important;
    background-color: #eee !important;
  }

  /* card 布局 */
  .lay-skin-checkcard-avatar {
    padding-right: 8px;
  }

  .lay-skin-checkcard-detail {
    overflow: hidden;
    width: 100%;
  }

  .lay-skin-checkcard-header {
    font-weight: 500;
    font-size: 16px;
    white-space: nowrap;
    margin-bottom: 4px;
  }

  .lay-skin-checkcard-description {
    font-size: 13px;
    color: #5f5f5f;
  }
  .lay-disabled  .lay-skin-checkcard-description{
    color: #c2c2c2! important;
  }

  /* 选中 dot */
  .lay-form-checked>.lay-check-dot:after,
  .lay-form-radioed>.lay-check-dot:after {
    position: absolute;
    content: "";
    top: 2px;
    right: 2px;
    width: 0;
    height: 0;
    display: inline-block;
    vertical-align: middle;
    border-width: 10px;
    border-style: dashed;
    border-color: transparent;
    border-top-left-radius: 0px;
    border-top-right-radius: 6px;
    border-bottom-right-radius: 0px;
    border-bottom-left-radius: 6px;
    border-top-color: #16b777;
    border-top-style: solid;
    border-right-color: #16b777;
    border-right-style: solid;
    overflow: hidden;
  }

  .lay-checkbox-disabled>.lay-check-dot:after,
  .lay-radio-disabled>.lay-check-dot:after {
    border-top-color: #d2d2d2;
    border-right-color: #d2d2d2;
  }

  /* 选中 dot-2 */
  .lay-form-checked>.lay-check-dot-2:before,
  .lay-form-radioed>.lay-check-dot-2:before {
    position: absolute;
    font-family: "lay-icon";
    content: "\e605";
    color: #fff;
    bottom: 4px;
    right: 3px;
    font-size: 9px;
    z-index: 12;
  }

  .lay-form-checked>.lay-check-dot-2:after,
  .lay-form-radioed>.lay-check-dot-2:after {
    position: absolute;
    content: "";
    bottom: 2px;
    right: 2px;
    width: 0;
    height: 0;
    display: inline-block;
    vertical-align: middle;
    border-width: 10px;
    border-style: dashed;
    border-color: transparent;
    border-top-left-radius: 6px;
    border-top-right-radius: 0px;
    border-bottom-right-radius: 6px;
    border-bottom-left-radius: 0px;
    border-right-color: #16b777;
    border-right-style: solid;
    border-bottom-color: #16b777;
    border-bottom-style: solid;
    overflow: hidden;
  }

  .lay-checkbox-disabled>.lay-check-dot-2:before,
  .lay-radio-disabled>.lay-check-dot-2:before {
    color: #eee !important;
  }

  .lay-checkbox-disabled>.lay-check-dot-2:after,
  .lay-radio-disabled>.lay-check-dot-2:after {
    border-bottom-color: #d2d2d2;
    border-right-color: #d2d2d2;
  }

  .lay-ellipsis-multi-line {
    overflow: hidden;
    word-break: break-all;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
  }
</style>
<!-- 标签风格 -->
<style>
  .lay-form-radio>.lay-skin-tag,
  .lay-form-checkbox>.lay-skin-tag {
    font-size: 13px;
    border-radius: 100px;
  }

  .lay-form-checked>.lay-skin-tag,
  .lay-form-radioed>.lay-skin-tag {
    color: #fff !important;
    background-color: #16b777 !important;
  }
</style>
<!-- 单选框 Color Picker -->
<style>
  /* 主体 */
  .lay-form-radio>.lay-skin-color-picker {
    border-radius: 50%;
    border-width: 1px;
    border-style: solid;
    width: 20px;
    height: 20px;
  }

  /* 选中 */
  .lay-form-radioed>.lay-skin-color-picker {
    box-shadow: 0 0 0 1px #ffffff, 0 0 0 4px currentColor;
  }
</style>

