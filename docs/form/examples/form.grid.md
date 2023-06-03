<form class="layui-form layui-row layui-col-space16">
  <div class="layui-col-sm3">
    <input type="text" name="A" placeholder="Field A" class="layui-input">
  </div>
  <div class="layui-col-sm3">
    <div class="layui-input-wrap">
      <input type="text" name="B" placeholder="Field B" lay-affix="clear" class="layui-input">
    </div>
  </div>
  <div class="layui-col-sm3">
    <input type="text" name="C" placeholder="Field C" class="layui-input">
  </div>
  <div class="layui-col-sm3">
    <input type="text" name="D" placeholder="Field D" class="layui-input">
  </div>
  <div class="layui-col-md6">
    <div class="layui-form-item" style="margin-bottom: 0;">
      <label class="layui-form-label">Field E :</label>
      <div class="layui-input-block">
        <input type="text" name="E" placeholder="请输入" class="layui-input">
      </div>
    </div>
  </div>
  <div class="layui-col-md6">
    <div class="layui-form-item" style="margin-bottom: 0;">
      <label class="layui-form-label">Field F :</label>
      <div class="layui-input-block">
        <select name="quiz1">
          <option value="">省份</option>
          <option value="浙江">浙江省</option>
          <option value="江西">江西省</option>
          <option value="福建">福建省</option>
        </select>
      </div>
    </div>
  </div>
  <div class="layui-col-md4">
    <div class="layui-input-wrap">
      <div class="layui-input-prefix">
        <i class="layui-icon layui-icon-username"></i>
      </div>
      <input type="text" name="G" value="" required placeholder="Field G" class="layui-input" lay-affix="clear">
    </div>
  </div>
  <div class="layui-col-md4">
    <div class="layui-input-wrap">
      <input type="text" name="H" required placeholder="Field H" id="demo-search-more" class="layui-input">
      <div class="layui-input-suffix">
        <i class="layui-icon layui-icon-more-vertical"></i>
      </div>
    </div>
  </div>
  <div class="layui-col-md4">
    <div class="layui-input-wrap">
      <div class="layui-input-prefix">
        <i class="layui-icon layui-icon-date"></i>
      </div>
      <input type="text" name="I" required placeholder="Field I" class="layui-input demo-search-date">
      <div class="layui-input-suffix">
        <i class="layui-icon layui-icon-down"></i>
      </div>
    </div>
  </div>
  <div class="layui-btn-container layui-col-xs12">
    <button class="layui-btn" lay-submit lay-filter="demo-search">Search</button>
    <button type="reset" class="layui-btn layui-btn-primary">Reset</button>
  </div>
</form>

<!-- import layui -->  
<script>
layui.use(function(){
  var form = layui.form;
  var layer = layui.layer;
  var laydate = layui.laydate;
  var dropdown = layui.dropdown;

  // 提交
  form.on('submit(demo-search)', function(data){
    layer.alert(JSON.stringify(data.field), {
      title: '当前填写的字段值'
    });
    // 此处可执行 Ajax 等操作
    // …
    return false; // 阻止默认 form 跳转
  });

  // 下拉菜单
  dropdown.render({
    elem: '#demo-search-more',
    data: [{
      title: 'List A'
    },{
      title: 'List B'
    },{
      title: 'List C'
    }],
    click: function(obj, othis){
      this.elem.val(obj.title);
    },
    style: 'width: 245px;'
  })

  // 日期
  laydate.render({
    elem: '.demo-search-date'
  });
});
 </script>