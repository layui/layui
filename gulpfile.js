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

// 基础配置
const config = {
  // 头部注释
  comment: `/** v${pkg.version} | ${pkg.license} Licensed */;`,

  // 全部模块
  modules:
    'layui.all,lay,i18n,laytpl,laypage,laydate,jquery,component,layer,util,dropdown,slider,colorpicker,tab,nav,breadcrumb,progress,collapse,element,upload,form,table,treeTable,tabs,tree,transfer,carousel,rate,flow,code'
};

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
  let src = [
    './src/layui.js',
    ...config.modules.split(',').map((mod) => `./src/modules/${mod}.js`)
  ];
  return gulp
    .src(src)
    .pipe(sourcemaps.init())
    .pipe(
      uglify({
        output: {
          ascii_only: true // escape Unicode characters in strings and regexps
        },
        ie: true
      })
    )
    .pipe(concat('layui.js', { newLine: '' }))
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
exports.default = gulp.series(clean, gulp.parallel(js, css, files));

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
