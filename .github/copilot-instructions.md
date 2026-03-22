# Layui 协作者指南

欢迎加入 Layui 的协作。Layui 是一个采用原生态开发模式的开源 Web UI 组件库，它为更便捷地构建通用级业务界面而生。在您开始 Coding 之前，请先仔细阅读并熟悉这个项目的既有代码、文件和该协作者指南。

## 开发规范

> **核心理念**：让 Layui 严格遵循基准规范，保证项目的可读性、可扩展性。

### 技术栈

- **开发语言**: JavaScript（ES6+）、CSS3 、HTML5
- **构建工具**: Rollup + Babel + PostCSS
- **其他工具**: Prettier + ESLint + Jest 等
- **模块规范**：ES Modules

### 核心模块

- 通过 `src/core/lay.js` 为组件提供通用的基础支撑。
- 通过 `src/core/component.js` 创建组件。
- 通过 `src/core/i18n.js` 为组件提供多语言的国际化支持。

### 目录结构

```text
layui/
├── dist/                  # 构建产物
├── docs/                  # 文档目录
├── src/                   # 源代码开发目录
│   ├── components/        # 组件模块
│   │   ├── button/
│   │   └── ...
│   ├── core/              # 核心模块
│   ├── index.js           # ESM 打包入口
│   └── index.umd.js       # UMD 打包入口
├── scripts/               # 构建脚本
├── tests/                 # 测试目录
│   ├── unit/              # 单元测试
│   ├── visual/            # 可视化测试示例
└── package.json
```

### 代码规范

#### Code formatting

采用 Prettier 作为代码格式化工具，使用单引号 `{ "singleQuote": true }` 规则，其余采用默认配置。

#### Code linting

采用 ESLint 作为代码静态分析工具，禁止随意使用 `console.log`，仅允许：`console.warn` 和 `console.error`。

#### 命名空间

凡是涉及到命名空间的，均以 `lay` 为前缀，如：

CSS 类名

```css
.lay-table {
}
```

#### 命名规则

| 类型            | 命名规则                                   | 示例                        |
| --------------- | ------------------------------------------ | --------------------------- |
| CSS 类名        | `lay-` + `kebab-case` （小写字母加连字符） | `.lay-tabs-header`          |
| JavaScript 类名 | PascalCase （大驼峰）                      | `Button, TreeTable`         |
| 组件名、文件名  | camelCase （小驼峰）或全小写               | `button, treeTable`         |
| 回调函数        | camelCase + 生命周期                       | `beforeRender, afterRender` |
| 事件处理器属性  | `on` + 事件名                              | `onClick`                   |

#### 样式主题

Layui 3 内置蓝绿双主题（可切换）， 使用 CSS 自定义属性管理颜色。

```css
:root {
  /* 蓝绿双主题色 */
  --lay-color-primary-green: #16b777;
  --lay-color-primary-blue: #1e9fff;
  /* 默认主题色 */
  --lay-color-primary: var(--lay-color-primary-green);
}
```

---

## 代码注释与可维护性规范

> **核心理念**：你不是一个人在开发。注释服务于团队协作，帮助新成员快速理解代码意图与边界。

### 适用范围

- `src/` 下所有源代码
- `tests/` 下所有测试用例

### 配置项注释（强制）

每个 `config` 选项必须在定义处写**行尾注释**，包含：

- 用途
- 可选值范围或默认行为
- 若存在优先级关系，须注明优先级
- 若涉及兼容行为，须注明兼容语义

示例：

```js
config: {
  trigger: 'click',     // 标签切换的触发事件（click | hover）
  headerMode: 'auto'    // 标签头部显示模式：auto | scroll | normal
}
```

### 方法注释（强制）

- **所有公开方法**必须写完整 JSDoc。
- **复杂私有方法**必须写 JSDoc，解释职责与关键流程。

JSDoc 必须包含：

- 方法职责（做什么）
- 参数含义（含默认行为）
- 返回值类型与含义
- 关键副作用（如事件触发、缓存写入、DOM 变更）

示例：

```js
/**
 * 设置分隔条位置并触发对应事件。
 * @param {string|number} id - 实例 ID
 * @param {number|string} value - 目标位置（像素或百分比）
 * @returns {number|false|undefined}
 */
```

### 事件与回调注释（强制）

- 必须说明事件的触发时机。
- 若事件支持阻断机制（`return false`），必须在注释中明确说明。

### 示例代码注释（强制）

适用于 `docs/` 与 `tests/visual/` 中的示例：

- **实例创建代码块**必须添加**实例级注释**，并与页面中的 `h2` 标题一一对应。
- 对关键行为（如限制条件、事件监听、API 触发）补充简短说明。
- 注释应简洁明确，避免冗余，且与页面文案保持一致。

示例：

```js
// 动态操作
tabs.render({ ... });

// 方法渲染
tabs.render({ ... });
```

### 维护要求

- 新增配置项 → 必须同步新增配置注释。
- 新增/修改公开方法 → 必须同步更新 JSDoc。
- 新增/修改示例 → 必须检查实例级注释是否与标题对应。

---

## 测试用例编写规范

任何功能新增、破坏性变更，都必须在 `tests/` 中同步更新相关用例。

---

## 文档编写规范

Layui 文档采用 `Markdown + HTML + laytpl` 混合编写，其中 laytpl 为视图引擎（后面考虑更换为 ejs），支持导入文档子模板，格式示例：`{{- d.include("/{组件名}/detail/demo.md") }}`

### 创建文档

当新增组件时，必须在 `docs/` 中根据 `docs/.template/` 给定的模板为组件新增对应的完整文档，保存在 `docs/{组件名}/` 目录。文档模板介绍：

- `index.md`: 组件文档主文件，包含示例、API、属性等完整内容。当整体内容过大时，可将内容篇幅较大的碎片作为子模板放置在 `detail/` 目录，并导入对应的子模板即可。
- `detail/`: 该目录用于存放文档子模板。
  - `detail/demo.md`: 组件示例主模板。当整体内容过大时，可将示例内容拆分成多个子模板，保存在 `examples/` 目录，并导入对应的示例子模板即可。
  - `detail/options.md`: 组件 `render()` 方法接受的配置选项。采用表格的方式展示。
- `examples/`: 该目录用于存放组件示例子模板。

### 更新文档

- 任何功能新增、破坏性变更，都必须更新文档说明及相关示例。
- 新增功能必须添加 `<sup>` 标签标注，如 `<sup>3.2.0+</sup>` 即代表该功能从 `3.2.0` 版本开始新增。

---

## 构建产物策略（强制）

- 日常开发与任务交付阶段，**禁止执行生成 `dist/` 的构建命令**。
- 验证优先使用：静态检查、单元测试、局部验证、可视化页面验证。
- `dist/` 仅在 **版本发布（release）阶段**统一生成。
- 若确需本地构建产物，必须由用户**明确提出后再执行**。

---

## PR 提交规范

### 触发条件

当用户表达「准备提交 PR / 打算提 PR / 帮我写 PR 内容 / 帮我写提交信息」等意图时，必须启用本规范。

### 输出格式（强制）

#### PR 标题

标题必须符合 [语义化提交规范（Conventional Commits）](https://www.conventionalcommits.org/zh-hans/v1.0.0/)，简洁准确反映变更本质，例如：

- `feat(table): 新增 Virtualized List 支持`
- `fix(table): 修复 Virtualized List 边缘问题`

#### PR 描述

- 基于 `.github/pull_request_template.md` 的结构输出完整 PR 文本：
  - **变化性质**：至少勾选一项，按实际改动选择；不确定时优先选择最贴近的一项。
  - **变化内容**：使用清晰条目描述关键改动，优先覆盖：
    - 解决了什么问题、变更了哪些功能或行为、对用户或维护者的直接收益
    - 若存在关联 issue，请使用 `closes` / `fixes` / `resolves` 等关键词（如 `closes #123`）。
  - **满足条件**：根据当前上下文如实勾选；无法确认时保守不勾选，并注明「待补充项」。

### 质量要求

- 禁止输出与模板结构不一致的 PR 文本。
- 禁止生成与实际改动无关的标题或提交说明。

---

> **协作者承诺**：请将本指南作为日常开发的「检查清单」，共同守护项目质量与协作效率。
