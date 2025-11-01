# ESLint 配置说明

本项目已经配置了 ESLint 来帮助维护代码质量和一致性。

## 安装的依赖

- `eslint`: ESLint 核心包
- `@eslint/js`: ESLint 推荐的 JavaScript 规则

## 配置文件

- `eslint.config.js`: ESLint 9.x 的新配置格式
- 配置已针对项目的现有代码风格进行了调整

## 可用的脚本命令

```bash
# 检查代码质量问题
pnpm run lint

# 自动修复可修复的问题
pnpm run lint:fix

# 检查代码并确保没有警告（用于 CI/CD）
pnpm run lint:check
```

## 配置特点

### 已启用的重要规则
- `no-undef`: 检查未定义的变量
- `no-unreachable`: 检查不可达代码
- `no-dupe-keys`: 检查重复的对象键
- `no-redeclare`: 检查重复声明
- `use-isnan`: 强制使用 isNaN() 检查 NaN

### 已放宽的规则
- 缩进和引号规则已关闭，以适应现有代码风格
- 未使用变量改为警告而非错误
- 分号缺失改为警告

### 全局变量
配置已包含以下全局变量：
- 浏览器 API: `window`, `document`, `File`, `FileReader` 等
- layui 框架: `layui`, `$`, `jQuery`
- Node.js: `exports`, `module`, `require`

## 忽略的文件
- `dist/`: 构建输出目录
- `examples/`: 示例文件
- `docs/`: 文档文件
- `node_modules/`: 依赖包

## 使用建议

1. 在开发过程中定期运行 `pnpm run lint` 检查代码质量
2. 使用 `pnpm run lint:fix` 自动修复简单的格式问题
3. 对于无法自动修复的问题，请手动修复
4. 在提交代码前运行 `pnpm run lint:check` 确保没有严重问题

## 自定义配置

如需调整 ESLint 规则，请编辑 `eslint.config.js` 文件。