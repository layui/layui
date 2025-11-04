/**
 * 生成发行版
 */

import { createRequire } from 'node:module';
import shell from 'shelljs';
import fs from 'node:fs';
import path from 'node:path';
import archiver from 'archiver';

const require = createRequire(import.meta.url);
const pkg = require('../package.json');

let folder = `release/assets/${pkg.name}-v${pkg.version}`;
let DEST = `${folder}/dist`;

// 若传入 -V=../path/，则输出到该路径下一个带版本号的目录中
const env = process.env;
if (env.V) {
  folder = env.V;
  DEST = `${folder}/${pkg.version}`;
}

shell.mkdir('-p', folder);
shell.mkdir('-p', DEST);

// 复制发行版文件
shell.cp('-R', ['dist/css', 'dist/*.js'], DEST);
shell.rm('-f', `${DEST}/css/*.map`);
shell.rm('-f', `${DEST}/index.js`);

// 剔除 sourceMappingURL
shell.sed('-i', /^[ \t]*\/\/# sourceMappingURL=.*$/gm, '', `${DEST}/*.js`);
shell.sed(
  '-i',
  /^[ \t]*\/\*# sourceMappingURL=.*\*\/$/gm,
  '',
  `${DEST}/css/*.css`,
);

if (!env.V) {
  // 复制可视化示例模板
  shell.cp('-R', ['tests/visual/template/release/*'], folder);

  // 创建压缩包
  const output = fs.createWriteStream(`${folder}.zip`);
  const archive = archiver('zip', {
    zlib: { level: 9 }, // 压缩级别
  });

  output.on('close', () => {
    console.log(`已生成 ${folder}.zip`);
  });
  archive.on('error', (err) => {
    console.error('压缩失败：', err);
    process.exit(1);
  });

  archive.pipe(output);
  archive.directory(folder, path.basename(folder)); // 将整个文件夹压入 zip
  await archive.finalize();
}
