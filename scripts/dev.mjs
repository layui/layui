#!/usr/bin/env node

/**
 * Layui 开发模式启动脚本
 */

import { spawn } from 'cross-spawn';
import chalk from 'chalk';

const DEST = 'tests/visual/assets/dist'; // 输出目录
const env = { ...process.env, DEST, MODE: 'dev' };

// 初始提示信息
console.log(chalk.hex('#16b777').bold('🚀 Starting Layui development mode...'));

// 启动 server
spawn('npm', ['run', 'serve'], {
  stdio: 'inherit',
});

function pipeOutput(child, prefix) {
  // 子进程标准输出
  child.stdout?.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach((line) => {
      if (line.trim()) {
        console.log(`[${prefix}] ${line}`);
      }
    });
  });

  // 子进程调试类输出
  child.stderr?.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach((line) => {
      if (line.trim()) {
        console.error(`[${prefix}] ${line}`);
      }
    });
  });

  // 子进程异常事件
  child.on('error', (err) => {
    console.error(`[${prefix}] 启动失败：`, err.message);
  });

  // 子进程关闭事件
  child.on('close', (code) => {
    if (code !== 0 && code !== null) {
      console.error(`[${prefix}] 异常退出：`, code);
    }
  });
}

// 启动 rollup 和 postcss watcher
const rollup = spawn('rollup', ['-c', '-w'], {
  stdio: 'pipe',
  env,
});

const postcss = spawn(
  'postcss',
  ['src/css/index.css', '-o', `${DEST}/css/layui.css`, '-w', '--verbose'],
  {
    stdio: 'pipe',
    env,
  },
);

pipeOutput(rollup, 'rollup');
pipeOutput(postcss, 'postcss');
