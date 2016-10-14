<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
<title>树模块 - layui</title>

<link rel="stylesheet" href="../src/css/layui.css">

<style>
body{padding: 50px 100px;}
</style>
</head>
<body>

<ul id="demo"></ul>

<ul id="demo1" style="margin-top: 50px;"></ul>

<script src="../src/layui.js"></script>
<script>

layui.use('tree', function(){
  var tree = layui.tree({
    elem: '#demo' //指定元素
    //,check: 'checkbox' //勾选风格
    ,skin: 'as' //设定皮肤
    //,target: '_blank' //是否新选项卡打开（比如节点返回href才有效）
    ,drag: true
    ,click: function(item){ //点击节点回调
      console.log(item)
    }
    ,nodes: [ //节点
      {
        name: '常用文件夹'
        ,id: 1
        ,alias: 'changyong'
        ,children: [
          {
            name: '所有未读'
            ,id: 11
            //,href: 'http://www.layui.com/'
            ,alias: 'weidu'
          }, {
            name: '置顶邮件'
            ,id: 12
          }, {
            name: '标签邮件'
            ,id: 13
          }
        ]
      }, {
        name: '我的邮箱'
        ,id: 2
        ,spread: true
        ,children: [
          {
            name: 'QQ邮箱'
            ,id: 21
            ,spread: true
            ,children: [
              {
                name: '收件箱'
                ,id: 211
                ,children: [
                  {
                    name: '所有未读'
                    ,id: 2111
                  }, {
                    name: '置顶邮件'
                    ,id: 2112
                  }, {
                    name: '标签邮件'
                    ,id: 2113
                  }
                ]
              }, {
                name: '已发出的邮件'
                ,id: 212
              }, {
                name: '垃圾邮件'
                ,id: 213
              }
            ]
          }, {
            name: '阿里云邮'
            ,id: 22
            ,children: [
              {
                name: '收件箱'
                ,id: 221
              }, {
                name: '已发出的邮件'
                ,id: 222
              }, {
                name: '垃圾邮件'
                ,id: 223
              }
            ]
          }
        ]
      }
    ]
  });
  
  //生成一个模拟树
  var createTree = function(node, start){
    node = node || function(){
      var arr = [];
      for(var i = 1; i < 10; i++){
        arr.push({
          name: i.toString().replace(/(\d)/, '$1$1$1$1$1$1$1$1$1')
        });
      }
      return arr;
    }();
    start = start || 1;  
    layui.each(node, function(index, item){  
      if(start < 10 && index < 9){
        var child = [
          {
            name: (1 + index + start).toString().replace(/(\d)/, '$1$1$1$1$1$1$1$1$1')
          }
        ];
        node[index].children = child;
        createTree(child, index + start + 1);
      }
    });
    return node;
  };

  layui.tree({
    elem: '#demo1' //指定元素
    ,nodes: createTree()
  });
  
});
</script>

<pre class="layui-code">
# layui.tree-v2 备忘
* check参数 - checkbox、radio的支持
* 拖拽的支持
</pre>

</body>
</html>
