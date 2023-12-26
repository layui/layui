module.exports = {
  env: {
    browser: true,
  },
  globals: {
    layui: "readonly",
    layer: "readonly",
    lay: "readonly",
  },
  parserOptions: {
    ecmaVersion: 5,
    sourceType: "script",
    allowReserved: false,
    ecmaFeatures: {
      impliedStrict: true,
    },
  },
  ignorePatterns: ["!src/**/*.js", "src/modules/jquery.js"],
  plugins: ["@stylistic"],
  rules: {
    "@stylistic/indent": ["error", 2], // 缩进
    "@stylistic/semi": ["error", "always"], // 分号
    "@stylistic/semi-style": ["error", "last"], // 分号在语句的末尾
    "@stylistic/quotes": ["error", "single"], // 单引号
    "@stylistic/comma-style": [ // 逗号风格
      "error",
      "last",
      { exceptions: { VariableDeclaration: false } },
    ], 
    "@stylistic/comma-dangle": ["error", "never"], // 不允许尾随逗号
    "@stylistic/spaced-comment": ["error", "always"], // 注释间距
    "@stylistic/no-trailing-spaces": ["error", {"ignoreComments": true}], // 禁止行尾尾随空格
    "@stylistic/eol-last": ["error", "always"], // 文件末尾换行
    "@stylistic/linebreak-style": ["error", "unix"], // 换行样式
    "no-console": ["error", { allow: ["warn", "error"] }],
    "one-var": ["error", "never"],
  },
};
