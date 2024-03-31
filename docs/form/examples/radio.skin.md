<!--
 以下示例仅用于演示 lay-skin="none" 用法，仅支持 webkit 系浏览器，任何样式或兼容性问题请自行解决
-->

<div class="layui-form" lay-filter="form-demo-skin">
  {{- d.include("/form/examples/checkboxAndRadio.style.md") }}
  <h3 class="ws-bold">自定义“卡片风格”的单选组件</h3>
  <div class="layui-row layui-col-space8">
    <div class="layui-col-xs12 layui-col-sm6 layui-col-md3">
      <input type="radio" name="radio1" value="chrome" lay-skin="none">
      <div lay-radio class="lay-skin-checkcard lay-check-dot-2" style="height: 100px">
        <div class="lay-skin-checkcard-avatar">
          <span class="layui-icon layui-icon-chrome" style="font-size: 30px"></span>
        </div>
        <div class="lay-skin-checkcard-detail">
          <div class="lay-skin-checkcard-header">Chrome</div>
          <div class="lay-skin-checkcard-description lay-ellipsis-multi-line">
            由 Google 公司开发的网页浏览器，被大多数人所使用。
          </div>
        </div>
      </div>
    </div>
    <div class="layui-col-xs12 layui-col-sm6 layui-col-md3">
      <input type="radio" name="radio1" value="edge" lay-skin="none" checked>
      <div lay-radio class="lay-skin-checkcard lay-check-dot-2" style="height: 100px">
        <div class="lay-skin-checkcard-avatar">
          <i class="layui-icon layui-icon-edge" style="font-size: 30px"></i>
        </div>
        <div class="lay-skin-checkcard-detail">
          <div class="lay-skin-checkcard-header">Edge</div>
          <div class="lay-skin-checkcard-description lay-ellipsis-multi-line">
            由 Microsoft 开发的网页浏览器，基于 Chromeium 内核。
          </div>
        </div>
      </div>
    </div>
    <div class="layui-col-xs12 layui-col-sm6 layui-col-md3">
      <input type="radio" name="radio11" value="firefox" lay-skin="none" disabled>
      <div lay-radio class="lay-skin-checkcard lay-check-dot-2" style="height: 100px">
        <div class="lay-skin-checkcard-avatar">
          <i class="layui-icon layui-icon-firefox" style="font-size: 30px"></i>
        </div>
        <div class="lay-skin-checkcard-detail">
          <div class="lay-skin-checkcard-header">Firefox</div>
          <div class="lay-skin-checkcard-description lay-ellipsis-multi-line">
            由 Mozilla 开发的开放源代码的网页浏览器。
          </div>
        </div>
      </div>
    </div>
    <div class="layui-col-xs12 layui-col-sm6 layui-col-md3">
      <input type="radio" name="radio11" value="ie" lay-skin="none" disabled checked>
      <div lay-radio class="lay-skin-checkcard lay-check-dot-2" style="height: 100px">
        <div class="lay-skin-checkcard-avatar">
          <i class="layui-icon layui-icon-ie" style="font-size: 30px"></i>
        </div>
        <div class="lay-skin-checkcard-detail">
          <div class="lay-skin-checkcard-header">Internet Explorer</div>
          <div class="lay-skin-checkcard-description lay-ellipsis-multi-line">
            由 Microsoft 出品的网页浏览器，俗称 IE，已被微软放弃。
          </div>
        </div>
      </div>
    </div>
  </div>

  <h3 class="ws-bold">自定义“标签风格”的单选组件</h3>
  <div>
    <input type="radio" name="hobby" value="唱" lay-skin="none" checked>
    <div lay-radio class="lay-skin-tag layui-badge">唱</div>
    <input type="radio" name="hobby" value="跳" lay-skin="none">
    <div lay-radio class="lay-skin-tag layui-badge">跳</div>
    <input type="radio" name="hobby" value="rap" lay-skin="none">
    <div lay-radio class="lay-skin-tag layui-badge">rap</div>
    <input type="radio" name="hobby" value="篮球" lay-skin="none">
    <div lay-radio class="lay-skin-tag layui-badge">篮球</div>
  </div>

  <h3 class="ws-bold">自定义“颜色选择”的单选组件</h3>
  <div>
    <input type="radio" name="color" value="red" lay-skin="none">
    <div lay-radio class="lay-skin-color-picker" style="color: red; background-color: red"></div>
    <input type="radio" name="color" value="#16b777" lay-skin="none">
    <div lay-radio class="lay-skin-color-picker" style="color: #16b777; background-color: #16b777"></div>
    <input type="radio" name="color" value="blueviolet" lay-skin="none">
    <div lay-radio class="lay-skin-color-picker" style="color: blueviolet; background-color: blueviolet"></div>
    <input type="radio" name="color" value="#16baaa" lay-skin="none">
    <div lay-radio class="lay-skin-color-picker" style="color: #16baaa; background-color: #16baaa"></div>
  </div>

  <hr>
  <p>更多风格可自主实现，为避免影响文档其他重要版面的阅读，此处不做过多演示。</p>

</div>

<!-- import layui -->
<script>
  layui.use(function () {
    var form = layui.form;
    var $ = layui.$;
    // …
  });
</script>
