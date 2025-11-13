/**
 * 生成开发包
 */

import { spawn } from 'cross-spawn';

const DEST = 'tests/visual/assets/dist'; // 输出目录
const env = { ...process.env, DEST, MODE: 'dev' };

// 执行 postcss 子进程
export const postcss = (args = [], options = {}) => {
  args = [
    'src/css/index.css',
    '-o',
    `${DEST}/css/layui.css`,
    '--verbose',
  ].concat(args);
  options = {
    env,
    stdio: 'inherit',
    ...options,
  };

  return spawn('postcss', args, options);
};

// 执行 rollup 子进程
export const rollup = (args = [], options = {}) => {
  args = ['-c'].concat(args);
  options = {
    env,
    stdio: 'inherit',
    ...options,
  };

  return spawn('rollup', args, options);
};

// 是否执行子进程
if (env.RUN) {
  postcss();
  rollup();
}
