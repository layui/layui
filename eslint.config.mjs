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
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
    },
    rules: {
      'no-console': ['error', { allow: ['warn', 'error'] }], // 仅允许 warn 和 error
      'no-unused-vars': 'warn', // 因 v2 这类代码较多，此处只做提醒
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
