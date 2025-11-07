/**
 * ESLint Config
 */

import js from '@eslint/js';
import globals from 'globals';
import { defineConfig, globalIgnores } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier/flat';

export default defineConfig([
  globalIgnores(['**/dist/']), // 全局忽略规则

  // Browser
  {
    files: ['src/**/*.js'],
    plugins: {
      js,
    },
    extends: ['js/recommended'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
    },
    rules: {
      'no-console': ['error', { allow: ['warn', 'error'] }], // 仅允许 warn 和 error
      // 有时未完成代码，只做提醒
      'no-unused-vars': 'warn', // 未使用变量/函数/参数
      'no-empty': 'warn', // 空代码块
    },
  },

  // Node
  {
    files: [
      '*.{js,mjs,cjs}',
      'scripts/**/*.{js,mjs,cjs}',
      'tests/unit/**/*.{js,mjs,cjs}',
    ],
    plugins: {
      js,
    },
    extends: ['js/recommended'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.node, ...globals.jest },
    },
    rules: {},
  },

  eslintConfigPrettier, // 避免 Prettier 和 ESLint 规则冲突
]);
