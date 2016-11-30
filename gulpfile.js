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

//获取参数
var argv = require('minimist')(process.argv.slice(2), {
  default: {
    ver: 'all' 
  }
})

//注释
,note = [
  '/** <%= pkg.name %>-v<%= pkg.version %> LGPL License By <%= pkg.homepage %> */\n <%= js %>'
  ,{pkg: pkg, js: ';'}
]

//模块
,mods = 'laytpl,laypage,laydate,jquery,layer,element,upload,form,tree,util,flow,layedit,code'

//任务
,task = {
  minjs: function(ver) {
    //可指定模块压缩，eg：gulp minjs --mod layer,laytpl
    var mod = argv.mod ? function(){
      return '(' + argv.mod.replace(/,/g, '|') + ')';
    }() : ''
    ,src = [
      './src/**/*'+ mod +'.js'
      ,'!./src/lay/all.js'
      ,'!./src/lay/mod.js'
    ]
    ,dir = ver === 'open' ? 'release' : 'build';
    
    //过滤 layim
    if(ver === 'open' || argv.open){
      src.push('!./src/lay/**/layim.js');
    }

    return gulp.src(src).pipe(uglify())
     .pipe(header.apply(null, note))
    .pipe(gulp.dest('./'+ dir));
    
  }

  ,alljs: function(ver){
    var src = ['./src/**/{layui,all,'+ mods +'}.js']
    ,dir = ver === 'open' ? 'release' : 'build';
    
    return gulp.src(src).pipe(uglify())
      .pipe(concat('layui.all.js', {newLine: ''}))
      .pipe(header.apply(null, note))
    .pipe(gulp.dest('./'+ dir +'/lay/dest/'));
  }
  
  ,mincss: function(ver){
    var src = ['./src/css/**/*.css']
    ,dir = ver === 'open' ? 'release' : 'build'
    ,noteNew = JSON.parse(JSON.stringify(note));
    
    if(ver === 'open' || argv.open){
      src.push('!./src/css/**/layim.css');
    }
    
    noteNew[1].js = '';
    
    return gulp.src(src).pipe(minify({
      compatibility: 'ie7'
    })).pipe(header.apply(null, noteNew))
    .pipe(gulp.dest('./'+ dir +'/css'));
  }
  
  ,font: function(ver){
    var dir = ver === 'open' ? 'release' : 'build';
    
    return gulp.src('./src/font/*')
    .pipe(rename({}))
    .pipe(gulp.dest('./'+ dir +'/font'));
  }
  
  ,images: function(ver){
    var src = [
      './src/**/*.png'
      ,'./src/**/*.jpg'
      ,'./src/**/*.gif'
    ]
    ,dir = ver === 'open' ? 'release' : 'build';
    
    if(ver === 'open' || argv.open){
      src.push('!./src/**/layim/**/*.*');
    }
    
    gulp.src(src).pipe(rename({}))
    .pipe(gulp.dest('./'+ dir));
  }
};

//清理
gulp.task('clear', function(cb) {
  return del(['./build/*'], cb);
});
gulp.task('clearRelease', function(cb) {
  return del(['./release/*'], cb);
});

gulp.task('minjs', task.minjs); //压缩js模块
gulp.task('modjs', task.modjs); //打包PC完整模块，即各模块的合并
gulp.task('alljs', task.alljs); //打包PC合并版，即包含layui.js和所有模块的合并

gulp.task('mincss', task.mincss); //压缩css文件
gulp.task('font', task.font); //复制iconfont文件
gulp.task('images', task.images); //复制组件可能所需的图片

//开源版
gulp.task('default', ['clearRelease'], function(){
  for(var key in task){
    task[key]('open');
  }
});

//完整任务
gulp.task('all', ['clear'], function(){
  for(var key in task){
    task[key]();
  }
});








