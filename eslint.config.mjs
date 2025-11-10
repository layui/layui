import js from '@eslint/js';
import globals from 'globals';
import { defineConfig, globalIgnores } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier/flat';

// Layui 全局变量定义
globals.layui = {
  layui: false,
  lay: false,
  // jQuery
  $: false,
  jQuery: false,
  // 国际化 API
  Intl: false,
  // 模块系统支持
  exports: false, // CommonJS 导出对象
  module: false, // CommonJS 模块对象
  require: false, // CommonJS 导入函数
  define: false // AMD/RequireJS 模块定义函数
};

export default defineConfig([
  // 全局忽略规则
  globalIgnores([
    '**/dist/',
    '.temp/**', // 临时文件目录 - 临时生成的文件
    'docs/**', // 文档目录 - 文档相关文件，无需代码检查
    'src/modules/jquery.js' // 第三方库文件 - jQuery 源码，无需检查
  ]),

  // Browser 环境 - 兼容 IE9+
  {
    files: ['src/**/*.js'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: {
      ecmaVersion: 5, // IE9+ 支持 ES5 语法，确保代码兼容性
      sourceType: 'script', // 非模块类型，即使用 <script> 标签直接引入
      globals: { ...globals.browser, ...globals.layui }
    },
    rules: {
      // 仅允许 console.warn 和 console.error
      'no-console': ['error', { allow: ['warn', 'error'] }],

      // 未使用变量：警告未使用的变量，但忽略函数参数和局部变量
      // 某些变量可能用于向后兼容或特定场景
      'no-unused-vars': [
        'warn',
        {
          args: 'none',
          caughtErrors: 'none', // 忽略以 catch 捕获的错误变量
          vars: 'local'
        }
      ],

      // 重复声明：警告重复声明的变量，但不强制报错（兼容旧代码）
      'no-redeclare': 'warn',

      // 无用转义：警告不必要的转义字符，但不强制报错（避免误报）
      'no-useless-escape': 'warn',

      // 空代码块：警告空的代码块，可能是未完成的代码
      'no-empty': 'warn',

      /**
       * ES6+ 特性规则 - IE9+ 兼容性考虑
       * 下规则全部关闭
       */

      'prefer-const': 'off', // 不强制使用 const（IE9 不支持）
      'no-var': 'off', // 允许使用 var（IE9 主要变量声明方式）
      'prefer-arrow-callback': 'off', // 不强制使用箭头函数（IE9 不支持）
      'prefer-template': 'off', // 不强制使用模板字符串（IE9 不支持）
      'object-shorthand': 'off', // 不强制使用对象简写（IE9 不支持）
      'prefer-destructuring': 'off', // 不强制使用解构赋值（IE9 不支持）
      'prefer-rest-params': 'off', // 不强制使用剩余参数（IE9 不支持）
      'prefer-spread': 'off', // 不强制使用扩展运算符（IE9 不支持）

      /**
       * 函数相关规则
       */

      // 函数风格：不限制函数声明风格，允许函数声明和函数表达式混用
      'func-style': 'off',

      // 内部声明：允许在代码块内部声明函数（兼容旧代码模式）
      'no-inner-declarations': 'off'
    }
  },

  // Node.js 环境 - 构建脚本
  {
    files: ['*.{js,cjs}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs', // 使用 CommonJS 模块系统
      globals: { ...globals.node }
    },
    rules: {}
  },

  eslintConfigPrettier // 避免 Prettier 和 ESLint 规则冲突
]);
