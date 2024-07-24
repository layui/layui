---
title: 锚点导航 sidebar
toc: true
---
 
# 锚点导航

> 锚点导航 `sidebar` 

<h2 id="examples" lay-toc="{hot: true}" style="margin-bottom: 0;">示例</h2>

<div class="layui-sidebar " id="sidebar-2">
  <div sidebar-item>
    <div class="layui-active">锚点2-导航1</div>
    <div>锚点2-导航2</div>
    <div>锚点2-导航3</div>
    <div>锚点2-导航4</div>
  </div>
  <div sidebar-content>
    <div>内容2-1</div>
    <div>内容2-2</div>
    <div>内容2-3</div>
    <div>内容2-4</div>
  </div>
</div>

```
<div class="layui-sidebar " id="sidebar-2">
  <div sidebar-item>
    <div class="layui-active">锚点2-导航1</div>
    <div>锚点2-导航2</div>
    <div>锚点2-导航3</div>
    <div>锚点2-导航4</div>
  </div>
  <div sidebar-content>
    <div>内容2-1</div>
    <div>内容2-2</div>
    <div>内容2-3</div>
    <div>内容2-4</div>
  </div>
</div>
  
<!-- import layui -->  
<script>
  layui.use('sidebar', function(){
    var sidebar = layui.sidebar;
    sidebar.render({
      elem: '#sidebar-2', // 你的侧边导航容器
      scrollDuration: 300
      // offset: 100
    });
  });
</script>
```

| 属性 | 描述 | 类型 |
| --- | --- | --- |
| `options.scrollDuration` | 滚动动画的持续时间，单位为毫秒，默认为 `500`。 | Number |
| `options.offset` | 滚动位置偏移量，默认为 `0`。 | Number |
| `options.active` | 高亮样式 `layui-sidebar-active`。 | String  |

