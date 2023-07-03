<form class="layui-form" action="">
  <div class="layui-form-item">
    <label class="layui-form-label">验证必填项</label>
    <div class="layui-input-block">
      <input type="text" name="username" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
    </div>
  </div>
  <div class="layui-form-item">
    <div class="layui-inline">
      <label class="layui-form-label">验证手机号</label>
      <div class="layui-input-inline layui-input-wrap">
        <input type="tel" name="phone" lay-verify="required|phone" autocomplete="off" lay-reqtext="请填写手机号" lay-affix="clear" class="layui-input demo-phone">
      </div>
      <div class="layui-form-mid" style="padding: 0!important;"> 
        <button type="button" class="layui-btn layui-btn-primary" lay-on="get-vercode">获取验证码</button>
      </div>
    </div>
  </div>
  <div class="layui-form-item">
    <label class="layui-form-label">验证码</label>
    <div class="layui-input-inline layui-input-wrap">
      <input type="text" name="vercode" lay-verify="required" autocomplete="off" lay-affix="clear" class="layui-input">
    </div>
  </div>
  <div class="layui-form-item">
    <div class="layui-inline">
      <label class="layui-form-label">验证邮箱</label>
      <div class="layui-input-inline">
        <input type="text" name="email" lay-verify="email" autocomplete="off" class="layui-input">
      </div>
    </div>
    <div class="layui-inline">
      <label class="layui-form-label">验证日期</label>
      <div class="layui-input-inline layui-input-wrap">
        <div class="layui-input-prefix">
          <i class="layui-icon layui-icon-date"></i>
        </div>
        <input type="text" name="date" id="date" lay-verify="date" placeholder="yyyy-MM-dd" autocomplete="off" class="layui-input">
      </div>
    </div>
  </div>
  <div class="layui-form-item">
    <label class="layui-form-label">自定义验证</label>
    <div class="layui-input-inline layui-input-wrap">
      <input type="password" name="password" lay-verify="required|pass" placeholder="请输入" autocomplete="off" lay-affix="eye" class="layui-input">
    </div>
    <div class="layui-form-mid layui-text-em">6 到 12 位字符</div>
  </div>
  <div class="layui-form-item">
    <div class="layui-inline">
      <label class="layui-form-label">数字输入框</label>
      <div class="layui-input-inline" style="width: 100px;">
        <input type="number" name="price_min" placeholder="" autocomplete="off" class="layui-input" min="0" step="1" lay-affix="number">
      </div>
      <div class="layui-form-mid">-</div>
      <div class="layui-input-inline" style="width: 100px;">
        <input type="number" name="price_max" placeholder="" autocomplete="off" class="layui-input" min="0" step="1" lay-affix="number">
      </div>
    </div>
  </div>
  <div class="layui-form-item">
    <label class="layui-form-label">单行选择框</label>
    <div class="layui-input-block">
      <select name="interest" lay-filter="aihao">
        <option value=""></option>
        <option value="0">写作</option>
        <option value="1" selected>阅读</option>
        <option value="2">游戏</option>
        <option value="3">音乐</option>
        <option value="4">旅行</option>
      </select>
    </div>
  </div>  
  <div class="layui-form-item">
    <div class="layui-inline">
      <label class="layui-form-label">分组选择框</label>
      <div class="layui-input-inline">
        <select name="quiz">
          <option value="">请选择问题</option>
          <optgroup label="城市记忆">
            <option value="你工作的第一个城市">你工作的第一个城市</option>
          </optgroup>
          <optgroup label="学生时代">
            <option value="你的工号">你的工号</option>
            <option value="你最喜欢的老师">你最喜欢的老师</option>
          </optgroup>
        </select>
      </div>
    </div>
    <div class="layui-inline">
      <label class="layui-form-label">搜索选择框</label>
      <div class="layui-input-inline">
        <select name="modules" lay-verify="required" lay-search>
          <option value="">直接选择或搜索选择</option>
          <option value="1">layer</option>
          <option value="2">form</option>
          <option value="3">layim</option>
          <option value="4">element</option>
          <option value="5">laytpl</option>
          <option value="6">upload</option>
          <option value="7">laydate</option>
          <option value="8">laypage</option>
          <option value="9">flow</option>
          <option value="10">util</option>
          <option value="11">code</option>
          <option value="12">tree</option>
          <option value="13">layedit</option>
          <option value="14">nav</option>
          <option value="15">tab</option>
          <option value="16">table</option>
          <option value="17">select</option>
          <option value="18">checkbox</option>
          <option value="19">switch</option>
          <option value="20">radio</option>
        </select>
      </div>
    </div>
  </div> 
  <div class="layui-form-item">
    <label class="layui-form-label">联动选择框</label>
    <div class="layui-input-inline">
      <select name="quiz1">
        <option value="">请选择省</option>
        <option value="浙江" selected>浙江省</option>
        <option value="你的工号">江西省</option>
        <option value="你最喜欢的老师">福建省</option>
      </select>
    </div>
    <div class="layui-input-inline">
      <select name="quiz2">
        <option value="">请选择市</option>
        <option value="杭州">杭州</option>
        <option value="宁波" disabled>宁波</option>
        <option value="温州">温州</option>
        <option value="温州">台州</option>
        <option value="温州">绍兴</option>
      </select>
    </div>
    <div class="layui-input-inline">
      <select name="quiz3">
        <option value="">请选择县/区</option>
        <option value="西湖区">西湖区</option>
        <option value="余杭区">余杭区</option>
        <option value="拱墅区">临安市</option>
      </select>
    </div>
    <div class="layui-form-mid layui-text-em">
      <i class="layui-icon layui-icon-tips" lay-tips="{
        content: '此处只是演示联动排版，并未做联动交互',
        margin: '0 0 0 -10px'
      }"></i>
    </div>
  </div>
  <div class="layui-form-item">
    <label class="layui-form-label">复选框</label>
    <div class="layui-input-block">
      <input type="checkbox" name="arr[0]" title="选项1">
      <input type="checkbox" name="arr[1]" title="选项2" checked>
      <input type="checkbox" name="arr[2]" title="选项3">
    </div>
  </div>
  <div class="layui-form-item">
    <label class="layui-form-label">标签框</label>
    <div class="layui-input-block">
      <input type="checkbox" name="arr1[0]" lay-skin="tag" title="选项1" checked>
      <input type="checkbox" name="arr1[1]" lay-skin="tag" title="选项2">
      <input type="checkbox" name="arr1[2]" lay-skin="tag" title="选项3">
    </div>
  </div>
  <div class="layui-form-item">
    <label class="layui-form-label">开关</label>
    <div class="layui-input-block">
      <input type="checkbox" name="open" lay-skin="switch" lay-filter="switchTest" title="ON|OFF">
    </div>
  </div>
  <div class="layui-form-item">
    <label class="layui-form-label">单选框</label>
    <div class="layui-input-block">
      <input type="radio" name="sex" value="男" title="男" checked>
      <input type="radio" name="sex" value="女" title="女">
      <input type="radio" name="sex" value="禁" title="禁用" disabled>
    </div>
  </div>
  <div class="layui-form-item layui-form-text">
    <label class="layui-form-label">普通文本域</label>
    <div class="layui-input-block">
      &lt;textarea placeholder="请输入内容" class="layui-textarea"&gt;&lt;/textarea&gt;
    </div>
  </div>
  <div class="layui-form-item">
    <div class="layui-input-block">
      <button type="submit" class="layui-btn" lay-submit lay-filter="demo1">立即提交</button>
      <button type="reset" class="layui-btn layui-btn-primary">重置</button>
    </div>
  </div>
</form>

<!-- import layui -->
<script>
layui.use(['form', 'laydate', 'util'], function(){
  var form = layui.form;
  var layer = layui.layer;
  var laydate = layui.laydate;
  var util = layui.util;
  
  // 自定义验证规则
  form.verify({
    pass: [
      /^[\S]{6,12}$/,
      '密码必须6到12位，且不能出现空格'
    ]
  });
  
  // 指定开关事件
  form.on('switch(switchTest)', function(data){
    layer.msg('开关 checked：'+ (this.checked ? 'true' : 'false'), {
      offset: '6px'
    });
    layer.tips('温馨提示：请注意开关状态的文字可以随意定义，而不仅仅是 ON|OFF', data.othis)
  });
  
  // 提交事件
  form.on('submit(demo1)', function(data){
    var field = data.field; // 获取表单字段值

    // 显示填写结果，仅作演示用
    layer.alert(JSON.stringify(field), {
      title: '当前填写的字段值'
    });

    // 此处可执行 Ajax 等操作
    // …

    return false; // 阻止默认 form 跳转
  });
  
  // 日期
  laydate.render({
    elem: '#date'
  });
  
  // 普通事件
  util.on('lay-on', {
    // 获取验证码
    "get-vercode": function(othis){
      var isvalid = form.validate('.demo-phone'); // 主动触发验证，v2.7.0 新增 
      // 验证通过
      if(isvalid){
        layer.msg('手机号规则验证通过');

        // 此处可继续书写「发送验证码」等后续逻辑
        // …
      }
    }
  });
});
</script>