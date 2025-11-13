/**
 * Rollup Config
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import replace from '@rollup/plugin-replace';
import { banner } from './scripts/rollup-plugins.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const pkg = require('./package.json');
const version = pkg.version;

const name = 'layui';
const input = path.resolve(__dirname, './src/index.js');
const DEST = process.env.DEST || 'dist';
const outputDir = path.resolve(__dirname, `./${DEST}`);
const isDevMode = process.env.MODE === 'dev';

// 插件配置
const pluginsConfig = {
  terser: {
    compress: {
      passes: 2, // 提高压缩率，默认 1
    },
    format: {
      ascii_only: true, // 转义 unicode 字符
      comments: false,
    },
  },
  babel: {
    exclude: 'node_modules/**', // 只编译项目源码
    babelHelpers: 'bundled',
  },
};

const rollupConfig = [];
const pushRollupConfig = (opts, callback) => {
  opts = {
    minify: true,
    ...opts,
  };

  const esm = opts.format === 'es' ? '.esm' : '';
  const config = {
    input,
    output: {
      file: `${outputDir}/${name}${esm}.js`,
      format: opts.format || 'iife',
      sourcemap: true,
      plugins: [],
    },
    plugins: [
      replace({
        preventAssignment: true,
        values: {
          __VERSION__: version,
        },
      }),
      resolve(),
      commonjs(),
      babel(pluginsConfig.babel),
    ],
  };

  // 开发模式不压缩
  if (opts.minify && !isDevMode) {
    config.output.plugins.push(
      terser(pluginsConfig.terser),
      banner({
        comment: `/** ${version} | ${pkg.license} Licensed */`,
      }),
    );
  }

  // iife 模式的全局变量名
  if (opts.format === 'iife') {
    config.input = input.replace(/index\.js$/, 'index.iife.js');
    config.output.name = name;
  }

  callback?.(config);
  rollupConfig.push(config);
};

pushRollupConfig({ format: 'iife' }); // 浏览器 iife 版本
pushRollupConfig({ format: 'es' }); // 浏览器 esm 版本

// Node 构建环境 esm 版本
if (!isDevMode) {
  pushRollupConfig({ format: 'es', minify: false }, (config) => {
    config.external = ['jquery']; // v2 外部依赖（v3 正式版将考虑移除 jQuery 依赖）
    config.output = {
      ...config.output,
      sourcemap: false,
      dir: outputDir,
      preserveModules: true, // 保留独立模块，以支持 tree-shaking
      preserveModulesRoot: path.resolve(__dirname, '../src'),
    };
    delete config.output.file;
    delete config.output.banner;
    return config;
  });
}

export default rollupConfig;
