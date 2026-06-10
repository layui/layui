const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const replace = require('gulp-replace');
const header = require('gulp-header');
const sourcemaps = require('gulp-sourcemaps');
const zip = require('gulp-zip');
const del = require('del');
const minimist = require('minimist');
const pkg = require('./package.json');
const laytpl = require('./src/modules/laytpl.js');

// 基础配置
const config = {
  // 头部注释
  comment: `/** v${pkg.version} | ${pkg.license} Licensed */;`,

  // 全部模块
  modules:
    'layui.all,lay,i18n,laytpl,laypage,laydate,jquery,component,layer,util,dropdown,slider,colorpicker,tab,nav,breadcrumb,progress,collapse,element,upload,form,table,treeTable,tabs,tree,transfer,carousel,rate,flow,code',
  // CSP 编译期特性标识
  cspFlagPattern: /__LAYUI_CSP__/g,
  // 源码 DEBUG 辅助变量，不会进入构建产物
  debugPattern: /\bvar\s+\b__LAYUI_CSP__\b\s*;/g,
  // JS 压缩参数
  uglifyOptions: {
    output: {
      ascii_only: true // escape Unicode characters in strings and regexps
    },
    ie: true
  }
};

config.jsEntry = [
  './src/layui.js',
  ...config.modules.split(',').map((mod) => `./src/modules/${mod}.js`)
];

// 获取参数
const argv = minimist(process.argv.slice(2), {
  default: {
    vs: pkg.version
  }
});

const rlsFileName = `${pkg.name}-v${argv.vs}`; // 发行文件名
const rlsDest = `./release/zip/${rlsFileName}/${pkg.name}`; // 发行目标路径
const rlsDirname = path.dirname(rlsDest); // 发行目录名

// 复制目标路径
const copyDest = argv.dest
  ? path.join(argv.dest, argv.vs ? '/' + argv.vs : '')
  : rlsDest;

// 打包目标路径
const dest = './dist';

// js
const js = () => {
  let src = config.jsEntry;
  return gulp
    .src(src)
    .pipe(sourcemaps.init())
    .pipe(replace(config.debugPattern, ''))
    .pipe(replace(config.cspFlagPattern, 'false'))
    .pipe(uglify(config.uglifyOptions))
    .pipe(concat('layui.js', { newLine: '' }))
    .pipe(header(config.comment))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dest));
};

// csp js
const csp = () => {
  let src = config.jsEntry;
  return gulp
    .src(src)
    .pipe(sourcemaps.init())
    .pipe(replace(config.debugPattern, ''))
    .pipe(replace(/^[\s\S]*$/g, precompileLaytplBlocks))
    .pipe(replace(config.cspFlagPattern, 'true'))
    .pipe(uglify(config.uglifyOptions))
    .pipe(concat('layui.csp.js', { newLine: '' }))
    .pipe(header(config.comment))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dest));
};

// css
const css = () => {
  let src = ['./src/css/**/{layui,*}.css'];
  return gulp
    .src(src)
    .pipe(sourcemaps.init())
    .pipe(
      cleanCSS({
        compatibility: 'ie8'
      })
    )
    .pipe(concat('layui.css', { newLine: '' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dest + '/css'));
};

// files
const files = () => {
  let src = ['./src/**/*.{eot,svg,ttf,woff,woff2,html,json,png,jpg,gif}'];
  return gulp.src(src).pipe(gulp.dest(dest));
};

// clean
const clean = () => {
  return del([dest]);
};

// 默认任务
exports.default = gulp.series(
  clean,
  gulp.parallel(js, csp, css, files),
  generateModuleFacade
);
exports.csp = csp;

// 复制 dist 目录到指定路径
exports.cp = gulp.series(
  () => del(copyDest),
  () => {
    const src = `${dest}/**/*`;

    // 复制 css js
    gulp
      .src(`${src}.{css,js}`)
      .pipe(replace(/\n\/(\*|\/)#[\s\S]+$/, '')) // 过滤 css,js 的 map 特定注释
      .pipe(gulp.dest(copyDest));

    // 复制其他文件
    return gulp
      .src([
        src,
        `!${src}.{css,js,map}` // 过滤 map 文件
      ])
      .pipe(replace(/\n\/(\*|\/)#[\s\S]+$/, '')) // 过滤 css,js 的 map 特定注释
      .pipe(gulp.dest(copyDest));
  }
);

// 发行
exports.release = gulp.series(
  () => del([rlsDirname]), // 清理发行目录
  () => {
    // 生成说明
    return gulp.src('./examples/introduce/**/*').pipe(gulp.dest(rlsDirname)); // 用于本地
  },
  exports.cp, // 复制 dist 目录文件
  () => {
    // 生成 ZIP 压缩包
    const base = path.dirname(rlsDirname);
    return gulp
      .src(rlsDirname + '/**/*', {
        base: base
      })
      .pipe(zip(`${rlsFileName}.zip`))
      .pipe(gulp.dest(base));
  }
);

/**
 * 显示 gulp tasks 命令行帮助
 * 由于 gulp-cli 依赖了 yargs，此处直接使用
 * @returns
 */
exports.helper = () => {
  let usage = '\nUsage: gulp [options] tasks\n';
  let parser = require('yargs').options({
    dest: {
      type: 'string',
      desc: '自定义输出路径'
    },
    vs: {
      type: 'boolean',
      desc: '生成一个带版本号的文件夹'
    }
  });
  console.log(usage);
  parser.showHelp(console.log);
  console.log(
    [
      '\nTasks:',
      '  default  默认任务',
      '  release  发行任务',
      '  cp       将 dist 目录复制一份到参数 --dest 指向的目录'
    ].join('\n'),
    '\n\nExamples:\n  gulp cp --dest ./v',
    '\n'
  );
  return gulp.src('./');
};

// 预编译 laytpl 模板
// 将标记块内的 laytpl 静态模板预编译为渲染函数，仅用于 CSP 构建。
// 标记 ID 必须与块内被赋值的模板变量同名，例如：
//   // laytpl-precompile:start TPL_MAIN modern
//   var TPL_MAIN = [...].join('\n');
//   // laytpl-precompile:end TPL_MAIN
function precompileLaytplBlock(match, indent, name, tagStyle, block) {
  tagStyle = tagStyle || 'legacy';
  if (!/^[A-Za-z_$][\w$]*$/.test(name)) {
    throw new Error(`invalid laytpl precompile name: ${name}`);
  }
  if (!/^(legacy|modern)$/.test(tagStyle)) {
    throw new Error(`invalid laytpl precompile tagStyle: ${tagStyle}`);
  }

  // 构建期执行标记块，取得同名模板变量的字符串值；不会进入构建产物。
  const template = new Function(`${block}\nreturn ${name};`)();

  // 复用 laytpl 内部 builder 生成函数源码
  const renderer = laytpl
    .build(template, {
      open: '{{',
      close: '}}',
      tagStyle: tagStyle
    })
    .replace(/;\s*$/, '');

  // 预编译函数需要闭包绑定运行时 laytpl，供函数体内的 laytpl.escape 等内部变量使用。
  return [
    `${indent}// laytpl-precompile:start ${name}${tagStyle === 'legacy' ? '' : ' ' + tagStyle}`,
    `${indent}var ${name} = (function (laytpl) {`,
    `${indent}  return ${renderer};`,
    `${indent}})(laytpl);`,
    `${indent}// laytpl-precompile:end ${name}`
  ].join('\n');
}

function precompileLaytplBlocks(source) {
  // 正则分组说明：
  // 1. `(^[ \t]*)` 捕获起始标记缩进，确保结束标记位于同一缩进层级。
  // 2. `([A-Za-z_$][\w$]*)` 捕获模板变量名，并要求是合法 JS 标识符。
  // 3. `(legacy|modern)?` 捕获可选标签风格，未写时默认 legacy。
  // 4. `([\s\S]*?)` 非贪婪捕获标记块内容，支持跨行模板定义。
  // 5. `\1` / `\2` 要求结束标记缩进和变量名与起始标记一致，避免误配嵌套块。
  return source.replace(
    /(^[ \t]*)\/\/ laytpl-precompile:start ([A-Za-z_$][\w$]*)(?: (legacy|modern))?\n([\s\S]*?)\n\1\/\/ laytpl-precompile:end \2/gm,
    precompileLaytplBlock
  );
}

// 生成 module facade
function generateModuleFacade(done) {
  const esm = `${config.comment}
import './layui.js';
var layui = window.layui;
export { layui };
export default layui;
`;

  fs.writeFileSync(path.join(dest, 'layui.mjs'), esm);
  done();
}
