/**
 layui构建
*/

var pkg = require('./package.json');

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify-css');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var header = require('gulp-header');
var del = require('del');
var gulpif = require('gulp-if');
var minimist = require('minimist');

var argv = require('minimist')(process.argv.slice(2), {
  default: {
    ver: 'all' 
  }
});

var task = {
  minjs: function() {
    //可指定模块压缩
    var mod = argv.mod ? function(){
      return '(' + argv.mod.replace(/,/g, '|') + ')';
    }() : '';
    
    return gulp.src([
      './src/**/*'+ mod +'.js'
      ,'!./src/lay/all.js'
    ]).pipe(uglify())
     .pipe(header('/** <%= pkg.name %>-v<%= pkg.version %> <%= pkg.description %> <%= pkg.license %> license By <%= pkg.homepage %> */\n ;', {pkg: pkg}))
    .pipe(gulp.dest('./build'))
    
  }
  ,alljs: function(){
    return gulp.src([
      ,'./src/lay/**/{all,laytpl,laypage,laydate,jquery,layer,element,upload,form,tree,util,flow,layedit,code}.js'
      ,'!./src/lay/**/layim.js' //LayIM需授权
      ,'!./src/lay/**/mobile/*.js'
    ]).pipe(uglify())
    .pipe(concat('layui.all.js', {newLine: ''}))
    .pipe(header('/** <%= pkg.name %>-v<%= pkg.version %>(All Modules) <%= pkg.license %> license By <%= pkg.homepage %> */\n ;', {pkg: pkg}))
    .pipe(gulp.dest('./build/lay/dest/'));
  }
  ,mincss: function() {
    return gulp.src('./src/css/**/*.css')
    .pipe(minify({
      compatibility: 'ie7'
    }))
    .pipe(header('/** <%= pkg.name %>-v<%= pkg.version %> <%= pkg.description %>@<%= pkg.license %> <%= pkg.homepage %> By <%= pkg.author %> */\n', {pkg : pkg} ))
    .pipe(gulp.dest('./build/css'));
  }
  ,font: function() {
    return gulp.src('./src/font/*')
    .pipe(rename({}))
    .pipe(gulp.dest('./build/font'));
  }
  ,images: function(){
    gulp.src([
      './src/css/**/*.png'
      ,'./src/css/**/*.jpg'
      ,'./src/css/**/*.gif'
    ]).pipe(rename({}))
    .pipe(gulp.dest('./build/css'));
    
    return gulp.src([
      './src/images/**/*.png'
      ,'./src/images/**/*.jpg'
      ,'./src/images/**/*.gif'
    ]).pipe(rename({}))
    .pipe(gulp.dest('./build/images'));
  }
};

//清理
gulp.task('clear', function(cb) {
  return del(['./build/*'], cb);
});
gulp.task('minjs', task.minjs); //压缩js模块
gulp.task('alljs', task.alljs); //打包模块完整版
gulp.task('mincss', task.mincss); //压缩css文件
gulp.task('font', task.font); //复制iconfont文件
gulp.task('images', task.images); //复制组件可能所需的图片

//完整任务
gulp.task('default', ['clear'], function(){
  for(var key in task){
    task[key]();
  }
});

//开源版
gulp.task('open', ['clear'], function(){
  
});






