<form class="lay-form lay-row lay-col-space16">
  <div class="lay-col-sm3">
    <input type="text" name="A" placeholder="Field A" class="lay-input">
  </div>
  <div class="lay-col-sm3">
    <div class="lay-input-wrap">
      <input type="text" name="B" placeholder="Field B" lay-affix="clear" class="lay-input">
    </div>
  </div>
  <div class="lay-col-sm3">
    <input type="text" name="C" placeholder="Field C" class="lay-input">
  </div>
  <div class="lay-col-sm3">
    <input type="text" name="D" placeholder="Field D" class="lay-input">
  </div>
  <div class="lay-col-md6">
    <div class="lay-form-item" style="margin-bottom: 0;">
      <label class="lay-form-label">Field E :</label>
      <div class="lay-input-block">
        <input type="text" name="E" placeholder="请输入" class="lay-input">
      </div>
    </div>
  </div>
  <div class="lay-col-md6">
    <div class="lay-form-item" style="margin-bottom: 0;">
      <label class="lay-form-label">Field F :</label>
      <div class="lay-input-block">
        <select name="quiz1">
          <option value="">省份</option>
          <option value="浙江">浙江省</option>
          <option value="江西">江西省</option>
          <option value="福建">福建省</option>
        </select>
      </div>
    </div>
  </div>
  <div class="lay-col-md4">
    <div class="lay-input-wrap">
      <div class="lay-input-prefix">
        <i class="lay-icon lay-icon-username"></i>
      </div>
      <input type="text" name="G" value="" required placeholder="Field G" class="lay-input" lay-affix="clear">
    </div>
  </div>
  <div class="lay-col-md4">
    <div class="lay-input-wrap">
      <input type="text" name="H" required placeholder="Field H" id="demo-search-more" class="lay-input">
      <div class="lay-input-suffix">
        <i class="lay-icon lay-icon-more-vertical"></i>
      </div>
    </div>
  </div>
  <div class="lay-col-md4">
    <div class="lay-input-wrap">
      <div class="lay-input-prefix">
        <i class="lay-icon lay-icon-date"></i>
      </div>
      <input type="text" name="I" required placeholder="Field I" class="lay-input demo-search-date">
      <div class="lay-input-suffix">
        <i class="lay-icon lay-icon-down"></i>
      </div>
    </div>
  </div>
  <div class="lay-btn-container lay-col-xs12">
    <button class="lay-btn" lay-submit lay-filter="demo-search">Search</button>
    <button type="reset" class="lay-btn lay-btn-primary">Reset</button>
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
