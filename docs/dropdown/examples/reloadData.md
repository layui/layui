<div class="layui-form">
  <div class="layui-form-item">
    <label class="layui-form-label">输入时重载</label>
    <div class="layui-input-inline">
      <input type="text" autocomplete="off" placeholder="输入关键字" class="layui-input" id="ID-dropdown-demo-reloadData">
    </div>
  </div>
</div>

<!-- import layui --> 
<script>
layui.use(function(){
  var dropdown = layui.dropdown;
  var $ = layui.$;

  // 渲染
  var inst = dropdown.render({
    elem: '#ID-dropdown-demo-reloadData',
    data: [
      { id: 1, title: "Python" },
      { id: 2, title: "JavaScript" },
      { id: 3, title: "Java" },
      { id: 4, title: "C++" },
      { id: 5, title: "PHP" },
      { id: 6, title: "Ruby" },
      { id: 7, title: "Swift" },
      { id: 8, title: "TypeScript" },
      { id: 9, title: "Kotlin" },
      { id: 10, title: "Go" }
    ],
    style: 'min-width: 190px; box-shadow: 1px 1px 11px rgb(0 0 0 / 11%);',
    click: function(data){
      this.elem.val(data.title);
    }
  });

  // 输入框输入事件
  $(inst.config.elem).on('input propertychange', function(){
    var elem = $(this);
    var value = elem.val().trim();

    // 匹配到对应内容时，重载数据
    var dataNew = inst.config.data.filter(function(item){
      var exp = new RegExp(value.split('').join('|'), 'i');
      return exp.test(item.title);
    });
    dropdown.reloadData(inst.config.id, {
      data: dataNew, // 匹配到的新数据
      templet: function(d){
        var exp = new RegExp(value.split('').join('|'), 'gi');
        return d.title.replace(exp, function (str) {
          return '<span style="color: red;">' + str + '</span>'
        });
      }
    });
  });
});
</script>