# 用户贡献指南

非常感谢您关注 layui 项目，在提交您的贡献之前，请务必认真阅读以下准则。

1. [问题反馈](#issue)
1. [开发指南](#develop)
    1. [常用脚本命令（ npm scripts ）](#npm-scripts)
    1. [代码风格](#code-spec)
    1. [提交信息规范](#commit-message-spec)
    1. [项目结构](#dir-spec)
    1. [提交请求（pull request）](#pull-request)
1. [后记](#open-source)

<a id="issue"></a>
## 问题反馈

请使用 [Fly 社区](http://fly.layui.com/) 提交您的问题，否则可能将直接被关闭。

<a id="develop"></a>
## 开发设置

需要安装 [nodejs](https://nodejs.org) ，下载项目到本地后安装依赖 `npm install` ，安装完成后将自动添加 Git Commit 提交信息格式检查和代码格式验证。

<a id="npm-scripts"></a>
### 常用脚本命令（ npm scripts ）

``` bash
# 基于 http-server 启动本地预览服务
$ npm run start

# 基于 Karma + PhantomJS 运行单元测试
$ npm run test

# watch 代码并招待单元测试
$ npm run test:watch

# 使用 eslint 验证代码风格
$ npm run lint

# 使用 eslint 尝试修复代码风格问题，但可能会导致代码语法错误
$ npm run lint:fix
```

<a id="code-spec"></a>
### 代码风格

基于 [Airbnb/ES5](https://github.com/airbnb/javascript/tree/es5-deprecated/es5) 编写代码，基于 [ESLint](https://eslint.org/) 验证代码格式。

<a id="commit-message-spec"></a>
### 提交信息规范

项目的 Git commit message 和 pull request 标题格式进行统一格式约定，这将提升项目日志的可读性，对于不符合规范的 pull request 将**不予合入**。

#### 信息格式

```
<type>: <subject>
```

##### type

必须是以下之一：

- feat: 新功能
- fix: 修复bug
- docs: 文档
- style: 格式（不影响代码运行的变动）
- refactor: 重构
- perf: 性能优化
- test: 增加测试
- chore: 构建过程或辅助工具的变动
- revert: 回滚代码
- release: 发布版本

#### subject

不为空的修改描述，使用中文，可以直接突出修改变更的内容。如：

```
test: 优化 src/layui.js 测试用例，覆盖到100%
docs: 更新 README.md 中代码高亮
fix: 修复在 IE10 中代码报错
style: 优化代码风格，添加 ;
chore: 更新 npm scripts 脚本名称
fix: #3, #4
```

#### 注意：

1. `<type>:` 中的 `:` 是英文半角，并且 `:` 之后必须包含一个空格。

<a id="dir-spec"></a>
### 项目结构

```
.
├── CHANGELOG.md                        - 变更记录
├── dist/                               - 打包产出文件
├── examples/                           - 示例目录
├── gulpfile.js                         - 打包文件入口
├── karma.conf.base.js                  - 测试配置
├── karma.conf.sauce.js
├── karma.conf.unit.js
├── package.json                        - 项目配置
├── src/                                - 源文件
│   ├── css/                            - 样式
│   │   ├── layui.css                   - PC 端样式
│   │   ├── layui.mobile.css            - 移动端样式
│   │   └── modules/                    - 子模块样式
│   ├── font/                           - 字体目录
│   ├── images/                         - 静态图片目录
│   ├── lay/
│   │   ├── all-mobile.js               - 移动端入口
│   │   ├── all.js                      - PC 端入口
│   │   └── modules/                    - 子模块代码
│   └── layui.js
└── test/                               - 测试用例
```

<a id="pull-request"></a>
### 提交请求（pull request）

1. fork [@sentsin/layui](https://github.com/sentsin/layui) 。
1. 把个人仓库（repository）克隆到电脑上，并安装所依赖的插件。
1. 开发功能，开发完成后请确保运行 `npm run test` 和 `npm run lint` 校验通过。
1. 推送（push）分支。
1. 建立一个新的合并申请（pull request）并描述变动。

请注意，提交 pull request 请保证是基于最新的主干代码，否则将产生多余无用 commit 提交。

<a id="open-source"></a>
## 后记

感谢您的贡献，layui 因您而更完善，任何建议和意见您都可以在 [Fly 社区](http://fly.layui.com/) 提交。