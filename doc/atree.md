# atree2.0.0属性含义
* spreadAll 设置checkbox全部选中  
* check勾选风格，不写没有勾选框
* props 设置key属性别名  
 - addBtnLabel：新增按钮标题
 - deleteBtnLabel：删除按钮标题
 - name：树显示的标题
 - id：主键对应的字段名
 - children：子类对应的字段名
 - checkbox：选中对应的字段名
 - spread：是否展开对应的字段名  
* change选中回调函数
 - val：选中的对象数组
* click点击标题回调函数
 - item：当前点击的对象
* addClick：新增回调函数
 - item：当前父节点的对象
 - elem：当前节点的dom对象
 - done：添加到dom节点的方法
* deleteClick：删除回调函数
 - item：当前父节点的对象
 - elem：当前节点的dom对象
 - done：删除dom节点的方法
 