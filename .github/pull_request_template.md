### 😃 本次 PR 的变化性质

> 请至少勾选一项（即 [ ] 内填写 x ）

- [ ] 功能新增
- [x] 问题修复
- [ ] 功能优化
- [ ] 分支合并
- [ ] 其他改动：请在此处填写

### 🌱 本次 PR 的变化内容

- 在树形组件中的**setChecked**方法中，当节点id为长数字字符串时，
设置已选择节点的复选框时，在判断节点id时添加字符串转换
````javascript
    //line 763
    thisId.toString() == checkedId.toString()
    //lin 773
    value.toString() == thisId.toString() && !input[0].checked
````
- 如果缺少类型转换的话，在使用长数字字符串作为节点id时，如果选择了某个节点，在第二次
渲染树时，会将一些未选择的节点的checkbox渲染为已选择;以下数据中，如果第一次选择了域名
节点但是没有选择概览节点，在不加类型转换时会将概览节点渲染为已选择状态。
````javascript
var data2 = [
          {
            title: '控制台'
            , id: '113715891127976666'
            , spread: true
            , checked: false
            , children: [
              {
                title: '概览'
                , id: '113715891127976000'
                , spread: true
                , checked: false,
              }, {
                title: '域名'
                , id: '113715891127976001'
                , spread: true
                , checked: false,
              }, {
                title: '域名1'
                , id: '113715891127976002'
                , spread: true
                , checked: true,
              },
            ],
          }];

        tree.render({
          elem: '#test1'
          , data: data2
          , id: 'demoId2'
          , showCheckbox: true  //是否显示复选框
          , accordion: 0  //是否开启手风琴模式
          , onlyIconControl: true //是否仅允许节点左侧图标控制展开收缩
          , isJump: 0  //点击文案跳转地址
          , edit: true,  //操作节点图标
        });
````


### ✅ 本次 PR 的满足条件

> 请在申请合并之前，将符合条件的每一项进行勾选（即 [ ] 内填写 x ）

- [ ] 已提供在线演示地址（如：[codepen](https://codepen.io/)）或无需演示
- [x] 已对每一项的改动均测试通过
- [x] 已提供具体的变化内容说明

