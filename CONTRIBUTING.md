# 🍀 Layui 贡献指南

为了提升沟通效率，请花几分钟时间仔细阅读本文档。遵循这些指南有助于表达您尊重管理和开发这个开源项目的贡献者。作为回报，他们也会以同样的尊重来处理或评估您的 Issue 和 Pull Request。

## Issue

### 创建 Issue 之前

Layui 的 issue 只受理 「Bug 报告」和「功能请求」。如果是关于如何使用、功能疑惑或其他业务相关的问题建议在 Discussions 寻找社区帮助。若 issue 不符合规定或违背社区行为准则，它将会被立即关闭。

**在正式创建 Issue 之前，您应当确保已完成以下前置工作**：

- 仔细查看 Layui 官方文档和每个版本的更新日志：https://layui.dev
- 在 Issues 中搜索相似问题，找到解决方案，但应避免在旧的 Issue 中留言。
- 通过其他技术社区搜索相关资料、或充分利用当前主流的人工智能大模型

**为什么要有严格的 issue 规定**：

维护开源项目是一项艰辛的工作，它崇高而又略显卑微。加上 Layui 的使用门槛相对较低，随着受众的广为推崇，我们每天疲于应对各种技术反馈，包括：bug 报告，功能需求和 Pull Requests。

作为一个免费使用的开源项目，Layui 的维护人手是有限的。这意味着想要让项目可持续发展，我们必须：

1. 给予更具体的工作、更高的优先级（如 bug 修复和新功能的开发）；
2. 提高 issue 处理的效率。

针对 (1)，我们决定将 GitHub issue 严格地限制在有具体目标和内容的工作。问题和讨论应当发送到更适合它们的场合。比如关于「如何使用」，建议发到 Layui 讨论区，或者把它细化成更具体的 Bug 和 Feature Request。这两者的区别是，「如何使用」是一个未经思考和调研的问句，而 Bug 和 Feature Request 需要提问者进一步明确这是一个缺陷或者未支持的特性。

针对 (2)，我们发现影响 issue 处理效率最大两点因素是：a) 用户开 issue 之前并没有做好前置工作，这导致大量重复且初级的 issue 不断出现；b) 用户开 issue 时没有提供足够有效的信息，这导致我们需要花费大量的时间去跟用户来回沟通，只为了获得一些基本信息好让我们对 issue 进行真正的分析。因此，为了减少不必要的资源消耗，严格要求 Issue 规定是迫切和必要的。尤其对于 Layui 核心维护者，应当让他们的主要精力投入到项目更重要的工作中去。

**最重要的是，请明白一件事：开源项目的用户和维护者之间并不是甲方和乙方的关系，issue 也不是客服。在开 issue 的时候，请抱着「一起合作来解决这个问题」的心态，避免期待社区单方面地为你服务。**

> 以上借鉴了 Ant Design 社区的成熟经验，并做了适用于 Layui 社区的相关修改。

### 正式创建 issue

当您已对上述事项充分阅读并理解，在正式创建过程中，您应当遵循 Issue 提供表单规范仔细填写，尽可能将您所遇到的 Bug 或 Feature Request 描述详细。

### 创建 issue 之后

- 在 issue 交流过程中，若议题已经得到解决，请主动关闭 issue。
- 大家本着相互尊重、理解和友善的态度，共同维护 Layui 来之不易的良好的社区氛围，谢谢 💖。


### 其他参考资料
1. [**贡献者行为准则**](CODE_OF_CONDUCT.md)
2. [**提问的智慧**](https://github.com/tvvocold/How-To-Ask-Questions-The-Smart-Way) @tvvocold
3. [**为什么需要最小重现**](https://antfu.me/posts/why-reproductions-are-required-zh) @antfu


## Pull Request

Layui 采用灵活的分支管理策略，我们鼓励您直接在对应的分支上提 Pull Request。为了使得 Reivew 和 Merge 的工作流程更加流畅，请仔细阅读以下说明：

### 分支说明

- `main` 作为主干分支，代表的是项目当前稳定的最新版本，接受 feature 和 hotfix 。
- `*.x` 作为历史稳定版本分支，如 `2.x` 即代表 2.x 系列稳定版本，只接受 hotfix，不接受 feature 。
- `*-dev` 作为未来大版本开发分支，如 `3.0-dev` 即代表 3.0 的开发版本，接受 feature 和 hotfix，但不保证稳定性。

### Commits 规范

Layui 遵循 [Conventional Commits 规范](https://www.conventionalcommits.org/zh-hans/v1.0.0/)，您的 `git commit` 和 PR title 都应遵循这一规范。

### 操作步骤

1. **创建 PR 前**，请按照上述分支规则说明，拉取项目最新代码后，基于对应的分支进行开发。
2. 在项目根目录下运行 `npm install` 安装依赖。
3. 完成开发后，运行 `npm run checks`，确保您的代码通过了 test, lint 等工具测试。（2.x 分支不支持）
4. **创建 PR 时**，请在 title 项按照 Commits 规范填写。并请在 description 项严格遵循给出的「内容模板」规范填写，以提供必要的信息，如本次 PR 的具体变更说明、可供预览的在线演示地址等。
5. **提交 PR 后**，确保已通过 Github CI 检查，若失败，可查看具体原因进行调整。
6. 确保以上所有步骤都符合要求后，即可等待项目成员对您的代码进行 Review 及合并评估。

### 其他参考资料

- [约定式提交](https://www.conventionalcommits.org/zh-hans/v1.0.0/)
