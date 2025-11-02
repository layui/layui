import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    files: ['src/**/*.js'],
    languageOptions: {
      ecmaVersion: 5, // IE9+ 支持 ES5
      sourceType: 'script',
      globals: {
        // 浏览器环境 - IE9+ 兼容
        window: 'readonly',
        document: 'readonly',
        console: 'readonly', // IE9+ 中 console 更稳定
        navigator: 'readonly',
        location: 'readonly',
        history: 'readonly',
        
        // 基础浏览器 API - IE9+ 支持
        XMLHttpRequest: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        
        // Web Storage API - IE8+ 支持
        sessionStorage: 'readonly',
        localStorage: 'readonly',
        
        // 现代浏览器 API - 在 IE9+ 中可用，有条件使用
        File: 'readonly',
        FileList: 'readonly', 
        FileReader: 'readonly',
        FormData: 'readonly',
        Blob: 'readonly',
        Image: 'readonly',
        
        // DOM 元素构造函数
        HTMLInputElement: 'readonly',
        Element: 'readonly',
        
        // 现代浏览器 API
        ResizeObserver: 'readonly',
        
        // 国际化 API
        Intl: 'readonly',
        
        // layui 全局变量
        layui: 'readonly',
        lay: 'readonly',
        
        // jQuery (项目中使用)
        $: 'readonly',
        jQuery: 'readonly',
        
        // 其他可能的全局变量
        exports: 'writable',
        module: 'readonly',
        require: 'readonly',
        
        // AMD/RequireJS 全局变量
        define: 'readonly'
      }
    },
    rules: {
      // 代码风格规则 - 放宽以适应现有代码
      'indent': 'off', // 暂时关闭，项目中缩进不统一
      'quotes': 'off', // 暂时关闭，项目中混用单双引号
      'semi': 'warn', // 改为警告
      'comma-dangle': ['error', 'always-multiline'],
      'no-trailing-spaces': 'warn',
      'eol-last': 'off',
      
      // 最佳实践
      'no-unused-vars': ['warn', { 'args': 'none', 'vars': 'local' }], // 改为警告，只检查局部变量
      'no-console': 'off', // 允许 console，因为这是 UI 库
      'no-debugger': 'error',
      'no-alert': 'warn',
      'no-undef': 'error', // 保持未定义变量检查
      'no-useless-escape': 'warn', // 不必要的转义改为警告
      'no-empty': 'warn', // 空块语句改为警告
      
      // ES6+ 特性规则 - IE9+ 不支持，全部关闭
      'prefer-const': 'off', // 项目使用 var，IE9+ 不支持 const
      'no-var': 'off', // 项目中使用 var，IE9+ 不支持 let/const
      'prefer-arrow-callback': 'off', // IE9+ 不支持箭头函数
      'prefer-template': 'off', // IE9+ 不支持模板字符串
      'object-shorthand': 'off', // IE9+ 不支持对象简写
      'prefer-destructuring': 'off', // IE9+ 不支持解构赋值
      'prefer-rest-params': 'off', // IE9+ 不支持剩余参数
      'prefer-spread': 'off', // IE9+ 不支持扩展运算符
      
      // 函数相关
      'func-style': 'off',
      'no-inner-declarations': 'off',
      
      // 对象和数组
      'object-curly-spacing': 'off',
      'array-bracket-spacing': 'off',
      
      // 其他 - 放宽格式要求
      'no-multiple-empty-lines': 'off',
      'space-before-function-paren': 'off',
      'keyword-spacing': 'off',
      'space-infix-ops': 'off',
      'comma-spacing': 'off',
      
      // 重要的错误检查保留
      'no-unreachable': 'error',
      'no-dupe-keys': 'error',
      'no-redeclare': 'warn',
      'use-isnan': 'error'
    }
  },
  {
    // gulpfile.js Node.js 环境配置
    files: ['gulpfile.js'],
    languageOptions: {
      ecmaVersion: 2018, // 支持现代 Node.js 语法
      sourceType: 'script',
      globals: {
        // Node.js 环境全局变量
        require: 'readonly',
        module: 'readonly',
        exports: 'writable',
        process: 'readonly',
        console: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        Buffer: 'readonly',
        global: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly'
      }
    },
    rules: {
      // 适用于构建脚本的规则
      'no-console': 'off', // 构建脚本中允许使用 console
      'no-unused-vars': ['warn', { 'args': 'none', 'vars': 'local' }],
      'no-useless-escape': 'warn', // 不必要的转义改为警告
      'semi': 'warn',
      'quotes': 'off', // 允许混用单双引号
      'indent': 'off', // 暂时关闭缩进检查
      'comma-dangle': ['error', 'always-multiline']
    }
  },
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '.temp/**',
      'examples/**',
      'docs/**',
      'src/modules/jquery.js'
    ]
  }
];