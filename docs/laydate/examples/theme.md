<div class="lay-form">
  <div class="lay-form-item">
    <div class="lay-inline">
      <label class="lay-form-label">墨绿主题</label>
      <div class="lay-input-inline">
        <input type="text" class="lay-input" id="ID-laydate-theme-molv" placeholder="yyyy-MM-dd">
      </div>
    </div>
    <div class="lay-inline">
      <label class="lay-form-label">自定义颜色主题</label>
      <div class="lay-input-inline">
        <input type="text" class="lay-input" id="ID-laydate-theme-color" placeholder="yyyy-MM-dd">
      </div>
    </div>
    <div class="lay-inline">
      <label class="lay-form-label">格子主题</label>
      <div class="lay-input-inline">
        <input type="text" class="lay-input" id="ID-laydate-theme-grid" placeholder="yyyy-MM-dd">
      </div>
    </div>
    <!--<div class="lay-inline">
      <label class="lay-form-label">圆圈高亮主题</label>
      <div class="lay-input-inline">
        <input type="text" class="lay-input" id="ID-laydate-theme-circle" placeholder="yyyy-MM-dd">
      </div>
    </div>-->
    <div class="lay-inline">
      <label class="lay-form-label">混合主题</label>
      <div class="lay-input-inline">
        <input type="text" class="lay-input" id="ID-laydate-theme-multi" placeholder="yyyy-MM-dd">
      </div>
    </div>
  </div>
</div>

<!-- import layui --> 
<script>
layui.use(function(){
  var laydate = layui.laydate;

  // 墨绿主题
  laydate.render({
    elem: '#ID-laydate-theme-molv',
    theme: 'molv'
  });
  
  // 自定义颜色
  laydate.render({
    elem: '#ID-laydate-theme-color',
    theme: '#FF5722'
  });
  
  // 格子主题
  laydate.render({
    elem: '#ID-laydate-theme-grid',
    theme: 'grid'
  });

  // 圆圈高亮主题
  /*
  laydate.render({
    elem: '#ID-laydate-theme-circle',
    theme: 'circle' // 2.8+新增主题
  });
  */

  // 混合主题
  laydate.render({
    elem: '#ID-laydate-theme-multi',
    theme: ['molv', 'grid'] // 2.8+ 新增功能
  });
});
</script>
