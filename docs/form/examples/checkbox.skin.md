<!-- 卡片风格 -->
<style>
  /* 主体 */
  .layui-form-checkbox>.lay-skin-checkcard,
  .layui-form-radio>.lay-skin-checkcard {
    display: flex;
    padding: 12px;
    white-space: normal;
    border-radius: 10px;
    border: 1px solid #e5e5e5;
    color: #000;
    background-color: #fff;
  }

  .layui-form-checkbox>.lay-skin-checkcard>*,
  .layui-form-radio>.lay-skin-checkcard>* {
    vertical-align: top;
  }

  /* 悬停 */
  .layui-form-checkbox:hover>.lay-skin-checkcard,
  .layui-form-radio:hover>.lay-skin-checkcard {
    border-color: #16b777;
  }

  /* 选中 */
  .layui-form-checked>.lay-skin-checkcard,
  .layui-form-radioed[lay-skin="none"]>.lay-skin-checkcard {
    color: #000;
    border-color: #16b777;
    /* background-color: rgb(22 183 119 / 10%) !important; */
    /* box-shadow: 0 0 0 3px rgba(22, 183, 119, 0.08); */
  }

  /* 禁用 */
  .layui-checkbox-disabled>.lay-skin-checkcard,
  .layui-radio-disabled>.lay-skin-checkcard {
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

  /* 选中dot */
  .layui-form-checked>.lay-check-dot:after,
  .layui-form-radioed>.lay-check-dot:after {
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

  .layui-checkbox-disabled>.lay-check-dot:after,
  .layui-radio-disabled>.lay-check-dot:after {
    border-top-color: #d2d2d2;
    border-right-color: #d2d2d2;
  }

  /* 选中dot-2 */
  .layui-form-checked>.lay-check-dot-2:before,
  .layui-form-radioed>.lay-check-dot-2:before {
    position: absolute;
    font-family: "layui-icon";
    content: "\e605";
    color: #fff;
    bottom: 4px;
    right: 3px;
    font-size: 9px;
    z-index: 12;
  }

  .layui-form-checked>.lay-check-dot-2:after,
  .layui-form-radioed>.lay-check-dot-2:after {
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

  .layui-checkbox-disabled>.lay-check-dot-2:before,
  .layui-radio-disabled>.lay-check-dot-2:before {
    color: #eee !important;
  }

  .layui-checkbox-disabled>.lay-check-dot-2:after,
  .layui-radio-disabled>.lay-check-dot-2:after {
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
  .layui-form-radio>.lay-skin-tag,
  .layui-form-checkbox>.lay-skin-tag {
    font-size: 13px;
    border-radius: 100px;
  }

  .layui-form-checked>.lay-skin-tag,
  .layui-form-radioed>.lay-skin-tag {
    color: #fff !important;
    background-color: #16b777 !important;
  }
</style>

<div class="layui-form layui-padding-3" lay-filter="form-demo-skin">
  <!-- 多选卡片 -->
  <fieldset class="layui-elem-field">
    <legend>卡片风格-多选</legend>
    <div class="layui-field-box">
      <div class="layui-row layui-col-space8">
        <div class="layui-col-xs12 layui-col-sm6 layui-col-md3">
          <input type="checkbox" name="browser[0]" value="chrome" lay-skin="none" />
          <div lay-checkbox class="lay-skin-checkcard lay-check-dot" style="height: 100px">
            <div class="lay-skin-checkcard-avatar">
              <i class="layui-icon layui-icon-chrome" style="font-size: 30px"></i>
            </div>
            <div class="lay-skin-checkcard-detail">
              <div class="lay-skin-checkcard-header">Google Chrome</div>
              <div class="lay-skin-checkcard-description lay-ellipsis-multi-line">
                Google Chrome，又称谷歌浏览器，是一个由 Google（谷歌）公司开发的网页浏览器。
              </div>
            </div>
          </div>
        </div>
        <div class="layui-col-xs12 layui-col-sm6 layui-col-md3">
          <input type="checkbox" name="browser[1]" value="edge" lay-skin="none" checked />
          <div lay-checkbox class="lay-skin-checkcard lay-check-dot" style="height: 100px">
            <div class="lay-skin-checkcard-avatar">
              <i class="layui-icon layui-icon-edge" style="font-size: 30px"></i>
            </div>
            <div class="lay-skin-checkcard-detail">
              <div class="lay-skin-checkcard-header">Microsoft Edge</div>
              <div class="lay-skin-checkcard-description lay-ellipsis-multi-line">
                Microsoft Edge 是微软基于 Chromium 开源项目及其他开源软件开发的网页浏览器。
              </div>
            </div>
          </div>
        </div>
        <div class="layui-col-xs12 layui-col-sm6 layui-col-md3">
          <input type="checkbox" name="browser[2]" value="firefox" lay-skin="none" disabled />
          <div lay-checkbox class="lay-skin-checkcard lay-check-dot" style="height: 100px">
            <div class="lay-skin-checkcard-avatar">
              <i class="layui-icon layui-icon-firefox" style="font-size: 30px"></i>
            </div>
            <div class="lay-skin-checkcard-detail">
              <div class="lay-skin-checkcard-header">Mozilla Firefox</div>
              <div class="lay-skin-checkcard-description lay-ellipsis-multi-line">
                Mozilla Firefox，中文俗称“火狐”，是一个由 Mozilla 开发的自由及开放源代码的网页浏览器。
              </div>
            </div>
          </div>
        </div>
        <div class="layui-col-xs12 layui-col-sm6 layui-col-md3">
          <input type="checkbox" name="browser[3]" value="ie" lay-skin="none" disabled checked />
          <div lay-checkbox class="lay-skin-checkcard lay-check-dot" style="height: 100px">
            <div class="lay-skin-checkcard-avatar">
              <i class="layui-icon layui-icon-ie" style="font-size: 30px"></i>
            </div>
            <div class="lay-skin-checkcard-detail">
              <div class="lay-skin-checkcard-header">Internet Explorer</div>
              <div class="lay-skin-checkcard-description lay-ellipsis-multi-line">
                Internet Explorer（简称：IE）是微软公司推出的一款网页浏览器。原称 Microsoft Internet Explorer（6版本以前）和 Windows Internet
                Explorer（7、8、9、10、11版本）。在 IE7 以前，中文直译为“网络探路者”，但在 IE7 以后官方便直接俗称"IE 浏览器"。
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </fieldset>
  <!-- 标签风格 -->
  <fieldset class="layui-elem-field">
    <legend>标签风格</legend>
    <div class="layui-field-box">
      <input type="checkbox" name="hobby[0]" value="唱" lay-skin="none" checked />
      <div lay-checkbox class="lay-skin-tag layui-badge">唱</div>
      <input type="checkbox" name="hobby[1]" value="跳" lay-skin="none" checked />
      <div lay-checkbox class="lay-skin-tag layui-badge">跳</div>
      <input type="checkbox" name="hobby[2]" value="rap" lay-skin="none" />
      <div lay-checkbox class="lay-skin-tag layui-badge">rap</div>
      <input type="checkbox" name="hobby[3]" value="篮球" lay-skin="none" />
      <div lay-checkbox class="lay-skin-tag layui-badge">篮球</div>
    </div>
  </fieldset>
</div>

<!-- import layui -->
<script>
  layui.use(function () {
    var form = layui.form;
    var $ = layui.$;

    $(document).on('mouseenter', '.lay-ellipsis-multi-line', function () {
      var el = $(this);
      if (!el.attr('title')) {
        el.attr('title', el.text().replace(/\s{2,}/g, ''));
      }
    });
  });
</script>