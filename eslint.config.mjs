import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    // ========================================
    // 源代码文件配置 - 兼容 IE9+
    // ========================================
    files: ['src/**/*.js'],
    languageOptions: {
      ecmaVersion: 5, // IE9+ 支持 ES5 语法，确保代码兼容性
      sourceType: 'script', // 使用传统脚本模式，非模块模式
      globals: {
        // === 浏览器环境全局变量 ===
        window: 'readonly',      // 浏览器窗口对象
        document: 'readonly',    // DOM 文档对象
        console: 'readonly',     // 控制台对象，用于调试输出
        navigator: 'readonly',   // 浏览器信息对象
        location: 'readonly',    // 当前页面位置对象
        history: 'readonly',     // 浏览器历史记录对象

        // === 基础浏览器 API ===
        XMLHttpRequest: 'readonly',  // AJAX 请求对象
        setInterval: 'readonly',     // 定时器：重复执行
        clearInterval: 'readonly',   // 清除重复定时器
        setTimeout: 'readonly',      // 定时器：延迟执行
        clearTimeout: 'readonly',    // 清除延迟定时器

        // === Web Storage API ===
        sessionStorage: 'readonly',  // 会话存储对象
        localStorage: 'readonly',    // 本地存储对象

        // === 文件和表单 API ===
        File: 'readonly',        // 文件对象
        FileList: 'readonly',    // 文件列表对象
        FileReader: 'readonly',  // 文件读取器对象
        FormData: 'readonly',    // 表单数据对象
        Blob: 'readonly',        // 二进制大对象
        Image: 'readonly',       // 图片对象

        // === DOM 相关 ===
        HTMLInputElement: 'readonly',  // HTML 输入元素
        Element: 'readonly',           // DOM 元素基类
        ResizeObserver: 'readonly',    // 尺寸变化观察器

        // === 国际化 API ===
        Intl: 'readonly',        // 国际化对象

        // === layui 框架全局变量 ===
        layui: 'readonly',       // layui 主对象
        lay: 'readonly',         // layui 简写对象

        // === jQuery 支持 ===
        $: 'readonly',           // jQuery 主对象
        jQuery: 'readonly',      // jQuery 完整名称

        // === 模块系统支持 ===
        exports: 'writable',     // CommonJS 导出对象（可写）
        module: 'readonly',      // CommonJS 模块对象
        require: 'readonly',     // CommonJS 导入函数
        define: 'readonly'       // AMD/RequireJS 模块定义函数
      }
    },
    rules: {
      // ========================================
      // 代码风格和格式化规则
      // ========================================

      // 缩进规则：使用 2 个空格缩进，switch-case 语句额外缩进 1 级
      'indent': ['error', 2, { 'SwitchCase': 1 }],

      // 引号规则：优先使用单引号，允许模板字符串使用反引号
      'quotes': ['warn', 'single', { 'allowTemplateLiterals': true }],

      // 分号规则：强制在语句末尾使用分号，避免 ASI（自动分号插入）问题
      'semi': ['error', 'always'],

      // 尾随逗号规则：在多行对象和数组中自动添加尾随逗号，提高代码可维护性
      'comma-dangle': ['error', 'always-multiline'],

      // 行尾空格规则：禁止行尾有多余的空格，保持代码整洁
      'no-trailing-spaces': 'error',

      // 文件末尾换行规则：强制文件末尾有且仅有一个换行符
      'eol-last': ['error', 'always'],

      // ========================================
      // 空格和布局规则
      // ========================================

      // 函数名与括号间空格：禁止函数名和参数列表括号之间有空格
      // 例如：function test() 而不是 function test ()
      'space-before-function-paren': ['error', 'never'],

      // 关键字空格：关键字前后必须有空格
      // 例如：if (condition) 而不是 if(condition)
      'keyword-spacing': ['error', { 'before': true, 'after': true }],

      // 操作符空格：二元操作符前后必须有空格
      // 例如：a + b 而不是 a+b
      'space-infix-ops': 'error',

      // 逗号空格：逗号前不能有空格，逗号后必须有空格
      // 例如：a, b 而不是 a ,b 或 a,b
      'comma-spacing': ['error', { 'before': false, 'after': true }],

      // 对象大括号空格：对象大括号内侧不允许有空格
      // 例如：{a: 1} 而不是 { a: 1 }
      'object-curly-spacing': ['error', 'never'],

      // 数组方括号空格：数组方括号内侧不允许有空格
      // 例如：[1, 2] 而不是 [ 1, 2 ]
      'array-bracket-spacing': ['error', 'never'],

      // 代码块前空格：代码块的左大括号前必须有空格
      // 例如：if (condition) { 而不是 if (condition){
      'space-before-blocks': 'error',

      // 多行空行限制：最多连续 2 个空行，文件末尾最多 1 个空行
      'no-multiple-empty-lines': ['error', { 'max': 2, 'maxEOF': 1 }],

      // ========================================
      // 大括号和代码块风格
      // ========================================

      // 大括号风格：使用 "1tbs" 风格（One True Brace Style）
      // 左大括号与控制语句在同一行，允许单行代码块
      'brace-style': ['error', '1tbs', { 'allowSingleLine': true }],

      // ========================================
      // 变量和作用域规则
      // ========================================

      // 未使用变量：警告未使用的变量，但忽略函数参数和局部变量
      // 在 UI 库中，某些变量可能用于向后兼容或特定场景
      'no-unused-vars': ['warn', { 'args': 'none', 'vars': 'local' }],

      // 未定义变量：禁止使用未定义的变量，防止运行时错误
      'no-undef': 'error',

      // 重复声明：警告重复声明的变量，但不强制报错（兼容旧代码）
      'no-redeclare': 'warn',

      // ========================================
      // 调试和开发规则
      // ========================================

      // console 使用：在 UI 库中允许使用 console，用于调试和错误提示
      'no-console': 'off',

      // debugger 语句：禁止在生产代码中使用 debugger 语句
      'no-debugger': 'error',

      // alert 使用：警告使用 alert，建议使用更好的用户提示方式
      'no-alert': 'warn',

      // ========================================
      // 代码质量规则
      // ========================================

      // 无用转义：警告不必要的转义字符，但不强制报错（避免误报）
      'no-useless-escape': 'warn',

      // 空代码块：警告空的代码块，可能是未完成的代码
      'no-empty': 'warn',

      // 不可达代码：禁止在 return、throw 等语句后有不可达的代码
      'no-unreachable': 'error',

      // 重复对象键：禁止对象中有重复的键名
      'no-dupe-keys': 'error',

      // NaN 比较：强制使用 isNaN() 而不是直接与 NaN 比较
      'use-isnan': 'error',

      // ========================================
      // ES6+ 特性规则 - IE9+ 兼容性考虑
      // ========================================

      // 以下规则全部关闭，确保代码兼容 IE9+

      'prefer-const': 'off',        // 不强制使用 const（IE9 不支持）
      'no-var': 'off',              // 允许使用 var（IE9 主要变量声明方式）
      'prefer-arrow-callback': 'off', // 不强制使用箭头函数（IE9 不支持）
      'prefer-template': 'off',     // 不强制使用模板字符串（IE9 不支持）
      'object-shorthand': 'off',    // 不强制使用对象简写（IE9 不支持）
      'prefer-destructuring': 'off', // 不强制使用解构赋值（IE9 不支持）
      'prefer-rest-params': 'off',  // 不强制使用剩余参数（IE9 不支持）
      'prefer-spread': 'off',       // 不强制使用扩展运算符（IE9 不支持）

      // ========================================
      // 函数相关规则
      // ========================================

      // 函数风格：不限制函数声明风格，允许函数声明和函数表达式混用
      'func-style': 'off',

      // 内部声明：允许在代码块内部声明函数（兼容旧代码模式）
      'no-inner-declarations': 'off'
    }
  },
  {
    // ========================================
    // 构建脚本配置 - Node.js 环境
    // ========================================
    files: ['gulpfile.js'],
    languageOptions: {
      ecmaVersion: 2018, // 现代 Node.js 语法支持（async/await 等）
      sourceType: 'script', // 使用 CommonJS 模块系统
      globals: {
        // === Node.js 环境全局变量 ===
        require: 'readonly',     // CommonJS 模块导入函数
        module: 'readonly',      // CommonJS 模块对象
        exports: 'writable',     // CommonJS 导出对象（可写）
        process: 'readonly',     // Node.js 进程对象
        console: 'readonly',     // Node.js 控制台对象
        __dirname: 'readonly',   // 当前模块目录路径
        __filename: 'readonly',  // 当前模块文件路径
        Buffer: 'readonly',      // Node.js 缓冲区对象
        global: 'readonly',      // Node.js 全局对象

        // === Node.js 定时器 ===
        setTimeout: 'readonly',      // Node.js 延迟定时器
        clearTimeout: 'readonly',    // 清除延迟定时器
        setInterval: 'readonly',     // Node.js 重复定时器
        clearInterval: 'readonly'    // 清除重复定时器
      }
    },
    rules: {
      // ========================================
      // 构建脚本专用规则
      // ========================================

      // console 使用：构建脚本中允许 console 输出，用于构建日志和调试
      'no-console': 'off',

      // 未使用变量：警告未使用的变量，但允许构建脚本中的临时变量
      'no-unused-vars': ['warn', { 'args': 'none', 'vars': 'local' }],

      // 无用转义：警告不必要的转义字符
      'no-useless-escape': 'warn',

      // ========================================
      // 代码风格规则（与源代码保持一致）
      // ========================================

      // 分号规则：强制使用分号，保持代码风格一致性
      'semi': ['error', 'always'],

      // 引号规则：优先使用单引号，允许模板字符串
      'quotes': ['warn', 'single', { 'allowTemplateLiterals': true }],

      // 缩进规则：使用 2 个空格缩进，与源代码保持一致
      'indent': ['error', 2, { 'SwitchCase': 1 }],

      // 尾随逗号：禁止尾随逗号，保持风格一致
      'comma-dangle': ['error', 'never'],

      // 函数空格：函数名与括号间不允许空格
      'space-before-function-paren': ['error', 'never'],

      // 关键字空格：关键字前后必须有空格
      'keyword-spacing': ['error', { 'before': true, 'after': true }],

      // 操作符空格：二元操作符前后必须有空格
      'space-infix-ops': 'error',

      // 逗号空格：逗号前无空格，逗号后有空格
      'comma-spacing': ['error', { 'before': false, 'after': true }]
    }
  },
  {
    // ========================================
    // 忽略文件配置
    // ========================================
    ignores: [
      'dist/**',              // 构建输出目录 - 包含编译后的文件，无需检查
      'node_modules/**',      // 依赖包目录 - 第三方代码，无需检查
      '.temp/**',             // 临时文件目录 - 临时生成的文件
      'examples/**',          // 示例文件目录 - 演示代码，可能不遵循严格规范
      'docs/**',              // 文档目录 - 文档相关文件，无需代码检查
      'src/modules/jquery.js' // 第三方库文件 - jQuery 源码，无需检查
    ]
  }
];
