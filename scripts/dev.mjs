#!/usr/bin/env node

/**
 * Layui 开发模式启动脚本
 */

import { spawn } from 'cross-spawn';
import chalk from 'chalk';
import { rollup, postcss } from './dev-builder.mjs';

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

// 启动 postcss 和 rollup watcher
const child_postcss = postcss(['-w'], {
  stdio: 'pipe',
});
const child_rollup = rollup(['-w'], {
  stdio: 'pipe',
});

pipeOutput(child_postcss, 'postcss');
pipeOutput(child_rollup, 'rollup');
