/**
 * Layui Build
 */

var pkg = require('./package.json');
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var header = require('gulp-header');
var footer = require('gulp-footer');
var del = require('del');
var minimist = require('minimist');
var yargs = require('yargs');

//基础配置
var config = {
  //注释
  comment: [
    '/** <%= pkg.version %> | <%= pkg.license %> Licensed */<%= js %>'
    ,{pkg: pkg, js: ';'}
  ]
  //模块
  ,modules: 'lay,laytpl,laypage,laydate,jquery,layer,util,dropdown,slider,colorpicker,element,upload,form,table,tree,transfer,carousel,rate,flow,layedit,code'
};

//获取参数
var argv = require('minimist')(process.argv.slice(2), {
  default: {
    version: pkg.version 
  }
});

//前置目录
var dir = {
  rls: './release/zip/layui-v' + pkg.version
};

//输出目录
var dest = ({
  dist: './dist'
  ,rls: dir.rls + '/layui'
}[argv.dest || 'dist'] || argv.dest) + (argv.vs ? '/'+ pkg.version : '');

//js
var js = function(){
  var src = [
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
  
//css
var css = function(){
  var src = [
    './src/css/**/*.css'
    ,'!./src/css/**/font.css'
  ]
  return gulp.src(src).pipe(cleanCSS({
    compatibility: 'ie8'
  }))
  //.pipe(concat('layui.css', {newLine: ''}))
  .pipe(gulp.dest(dest +'/css'));
};
  
//files
var files = function(){
  var src = ['./src/**/*.{eot,svg,ttf,woff,woff2,html,json,png,jpg,gif}'];
  return gulp.src(src)
  .pipe(gulp.dest(dest));
};

//mv
var mv = function(){
  return gulp.src('./dist/**/*')
  .pipe(gulp.dest(dest));
};
  
//release
var rls = function(){
  return gulp.src('./release/doc/**/*')
  .pipe(replace(/[^'"]+(\/layui\.css)/, 'layui/css$1')) //替换 css 引入路径中的本地 path
  .pipe(replace(/[^'"]+(\/layui\.js)/, 'layui$1')) //替换 js 引入路径中的本地 path
  .pipe(gulp.dest(dir.rls));
};

//clean
var clean =  function(cb) {
  return del([dest], {
    force: true
  });
};
var cleanRLS = function(cb) {
  return del([dir.rls]);
};

//Define all task
exports.js = js;
exports.css = css;
exports.files = files;
exports.default = gulp.series(clean, gulp.parallel(js, css, files)); //default task
exports.mv = gulp.series(clean, mv);
exports.rls = gulp.series(cleanRLS, rls); //release task

//layer task
exports.layer = function(){ // gulp layer
  var dest = './release/layer';
  
  gulp.src('./src/css/modules/layer/default/*')
  .pipe(gulp.dest(dest + '/src/theme/default'));

  return gulp.src('./src/modules/layer.js')
  .pipe(gulp.dest(dest + '/src'));
};


//laydate task
exports.laydate = function(){ // gulp laydate
  var dest = './release/laydate/' //发行目录
  ,comment = [ //注释
    '\n/*! \n * <%= title %> \n * <%= license %> Licensed \n */ \n\n'
    ,{title: 'layDate 日期与时间组件（单独版）', license: 'MIT'}
  ];
  
  //css
  gulp.src('./src/css/modules/laydate.css')
  .pipe(gulp.dest(dest + 'src/'));
  
  //js
  return gulp.src(['./src/layui.js', './src/modules/{lay,laydate}.js'])
  .pipe(replace('win.layui =', 'var layui =')) //将 layui 替换为局部变量
  .pipe(replace('})(window); //gulp build: layui-footer', '')) //替换 layui.js 的落脚
  .pipe(replace('(function(window){ //gulp build: lay-header', '')) //替换 lay.js 的头部
  .pipe(concat('laydate.js', {newLine: ''}))
  .pipe(header.apply(null, comment)) //追加头部
  .pipe(gulp.dest(dest + 'src'));
};

//help
exports.help = function(){
  var usage = '\nUsage: gulp [options] tasks'
  ,parser = yargs.usage(usage, {
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
    ,'  mv  将 dist 目录复制并拷贝一份到参数 --dest 指向的目录'
  ].join('\n'), '\n\nExamples:\n  gulp mv --dest ./v --vs', '\n');
  return gulp.src('./');
};


