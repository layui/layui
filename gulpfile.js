/**
 * Building Layui
 */

const pkg = require('./package.json');
const gulp = require('gulp');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const header = require('gulp-header');
const footer = require('gulp-footer');
const del = require('del');
const minimist = require('minimist');
const yargs = require('yargs');

// 基础配置
const config = {
  //注释
  comment: [
    '/** <%= pkg.version %> | <%= pkg.license %> Licensed */<%= js %>'
    ,{pkg: pkg, js: ';'}
  ]
  //模块
  ,modules: 'lay,laytpl,laypage,laydate,jquery,layer,util,dropdown,slider,colorpicker,element,upload,form,table,tree,transfer,carousel,rate,flow,layedit,code'
};

// 获取参数
const argv = require('minimist')(process.argv.slice(2), {
  default: {
    version: pkg.version 
  }
});

// 前置目录
const dir = {
  rls: './release/zip/layui-v' + pkg.version
};

// 输出目录
const dest = ({
  dist: './dist'
  ,rls: dir.rls + '/layui'
}[argv.dest || 'dist'] || argv.dest) + (argv.vs ? '/'+ pkg.version : '');

// js
const js = () => {
  let src = [
    './src/**/{layui,layui.all,'+ config.modules +'}.js'
  ];
  return gulp.src(src).pipe(uglify({
    output: {
      ascii_only: true //escape Unicode characters in strings and regexps
    }
  })).pipe(concat('layui.js', {newLine: ''}))
  .pipe(header.apply(null, config.comment))
  .pipe(gulp.dest(dest));
};
  
// css
const css = () => {
  let src = [
    './src/css/**/*.css'
    ,'!./src/css/**/font.css'
  ];
  return gulp.src(src).pipe(cleanCSS({
    compatibility: 'ie8'
  }))
  //.pipe(concat('layui.css', {newLine: ''}))
  .pipe(gulp.dest(dest +'/css'));
};
  
// files
const files = () => {
  let src = ['./src/**/*.{eot,svg,ttf,woff,woff2,html,json,png,jpg,gif}'];
  return gulp.src(src)
  .pipe(gulp.dest(dest));
};

// cp
const cp = () => {
  return gulp.src('./dist/**/*')
  .pipe(gulp.dest(dest));
};
  
// release
const rls = () => {
  return gulp.src('./release/doc/**/*')
  .pipe(replace(/[^'"]+(\/layui\.css)/, 'layui/css$1')) //替换 css 引入路径中的本地 path
  .pipe(replace(/[^'"]+(\/layui\.js)/, 'layui$1')) //替换 js 引入路径中的本地 path
  .pipe(gulp.dest(dir.rls));
};

// clean
const clean = cb => {
  return del([dest], {
    force: true
  });
};
const cleanRLS = cb => {
  return del([dir.rls]);
};

// Define all task
exports.js = js;
exports.css = css;
exports.files = files;
exports.default = gulp.series(clean, gulp.parallel(js, css, files)); //default task
exports.cp = gulp.series(clean, cp);
exports.rls = gulp.series(cleanRLS, rls); //release task

// layer task
exports.layer = () => { // gulp layer
  let dest = './release/layer';
  
  gulp.src('./src/css/modules/layer/default/*')
  .pipe(gulp.dest(dest + '/src/theme/default'));

  return gulp.src('./src/modules/layer.js')
  .pipe(gulp.dest(dest + '/src'));
};


// laydate task
exports.laydate = () => { // gulp laydate
  let dest = './release/laydate/'; // 发行目录
  let comment = [ //注释
    '\n/*! \n * <%= title %> \n * <%= license %> Licensed \n */ \n\n'
    ,{title: 'layDate 日期与时间组件（单独版）', license: 'MIT'}
  ];
  
  // css
  gulp.src('./src/css/modules/laydate.css')
  .pipe(gulp.dest(dest + 'src/'));
  
  // js
  return gulp.src(['./src/layui.js', './src/modules/{lay,laydate}.js'])
  .pipe(replace('win.layui =', 'var layui =')) // 将 layui 替换为局部变量
  .pipe(replace('})(window); //gulp build: layui-footer', '')) // 替换 layui.js 的落脚
  .pipe(replace('(function(window){ //gulp build: lay-header', '')) // 替换 lay.js 的头部
  .pipe(concat('laydate.js', {newLine: ''}))
  .pipe(header.apply(null, comment)) //追加头部
  .pipe(gulp.dest(dest + 'src'));
};

// helper
exports.help = () => {
  let usage = '\nUsage: gulp [options] tasks';
  let parser = yargs.usage(usage, {
    dest: {
      type: 'string'
      ,desc: '定义输出目录，可选项：dist（默认）、rls、任意路径'
    }
    ,vs: {
      type: 'boolean'
      ,desc: '生成一个带版本号的文件夹'
    }
  });
  
  parser.showHelp(console.log);
  console.log([
    'Tasks:'
    ,'  default  默认任务'
    ,'  rls  发行任务'
    ,'  cp  将 dist 目录复制一份到参数 --dest 指向的目录'
  ].join('\n'), '\n\nExamples:\n  gulp cp --dest ./v --vs', '\n');
  return gulp.src('./');
};


