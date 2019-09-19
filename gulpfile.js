/**
 layui构建
*/

var pkg = require('./package.json');
var inds = pkg.independents;

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify-css');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var header = require('gulp-header');
var del = require('del');
var gulpif = require('gulp-if');
var minimist = require('minimist');
var zip = require('gulp-zip');

//获取参数
var argv = require('minimist')(process.argv.slice(2), {
  default: {
    ver: 'all' 
  }
})

//注释
,note = [
  '/** <%= pkg.realname %>-v<%= pkg.version %> <%= pkg.license %> License By <%= pkg.homepage %> */\n <%= js %>'
  ,{pkg: pkg, js: ';'}
]

//模块
,mods = 'laytpl,laypage,laydate,jquery,layer,element,upload,slider,colorpicker,form,tree,transfer,table,carousel,rate,util,flow,layedit,code'

//发行版本目录
,releaseDir = './release/zip/layui-v' + pkg.version
,release = releaseDir + '/layui'

//目标木
,destDir = function(ver){
  return ver ? release : function(){
    return argv.rc ? 'rc' : 'dist'
  }();
}

//任务
,task = {
  //压缩js模块
  minjs: function(ver) {
    ver = ver === 'open';
     
    //可指定模块压缩，eg：gulp minjs --mod layer,laytpl
    var mod = argv.mod ? function(){
      return '(' + argv.mod.replace(/,/g, '|') + ')';
    }() : ''
    ,src = [
      './src/**/*'+ mod +'.js'
      ,'!./src/**/mobile/*.js'
      ,'!./src/lay/**/mobile.js'
      ,'!./src/lay/all.js'
      ,'!./src/lay/all-mobile.js'
    ]
    ,dir = destDir(ver);
    
    //过滤 layim
    if(ver || argv.open){
      src.push('!./src/lay/**/layim.js');
    }

    return gulp.src(src).pipe(uglify())
     .pipe(header.apply(null, note))
    .pipe(gulp.dest('./'+ dir));
  }
  
  //打包PC合并版JS，即包含layui.js和所有模块的合并
  ,alljs: function(ver){
    ver = ver === 'open';
    
    var src = [
      './src/**/{layui,all,'+ mods +'}.js'
      ,'!./src/**/mobile/*.js'
    ]
    ,dir = destDir(ver);
    
    return gulp.src(src).pipe(uglify())
      .pipe(concat('layui.all.js', {newLine: ''}))
      .pipe(header.apply(null, note))
    .pipe(gulp.dest('./'+ dir));
  }
  
  //打包mobile模块集合
  ,mobile: function(ver){
    ver = ver === 'open';

    var mods = 'layer-mobile,zepto', src = [
      './src/lay/all-mobile.js'
      ,'./src/lay/modules/laytpl.js'
      ,'./src/**/mobile/{'+ mods +'}.js'
    ]
    ,dir = destDir(ver);
    
    if(ver || argv.open){
      src.push('./src/**/mobile/layim-mobile-open.js'); 
    }
    
    src.push((ver ? '!' : '') + './src/**/mobile/layim-mobile.js');
    src.push('./src/lay/modules/mobile.js');
    
    return gulp.src(src).pipe(uglify())
      .pipe(concat('mobile.js', {newLine: ''}))
      .pipe(header.apply(null, note))
    .pipe(gulp.dest('./'+ dir + '/lay/modules/'));
  }
  
  //压缩css文件
  ,mincss: function(ver){
    ver = ver === 'open';
    
    var src = [
      './src/css/**/*.css'
      ,'!./src/css/**/font.css'
    ]
    ,dir = destDir(ver)
    ,noteNew = JSON.parse(JSON.stringify(note));
    
    if(ver || argv.open){
      src.push('!./src/css/**/layim.css');
    }
    
    noteNew[1].js = '';
    
    return gulp.src(src).pipe(minify({
      compatibility: 'ie7'
    })).pipe(header.apply(null, noteNew))
    .pipe(gulp.dest('./'+ dir +'/css'));
  }
  
  //复制iconfont文件
  ,font: function(ver){
    ver = ver === 'open';
    
    var dir = destDir(ver);
    
    return gulp.src('./src/font/*')
    .pipe(rename({}))
    .pipe(gulp.dest('./'+ dir +'/font'));
  }
  
  //复制组件可能所需的非css和js资源
  ,mv: function(ver){
    ver = ver === 'open';
    
    var src = ['./src/**/*.{png,jpg,gif,html,mp3,json}']
    ,dir = destDir(ver);
    
    if(ver || argv.open){
      src.push('!./src/**/layim/**/*.*');
    }
    
    gulp.src(src).pipe(rename({}))
    .pipe(gulp.dest('./'+ dir));
  }
  
  //复制发行的引导文件
  ,release: function(){
    gulp.src('./release/doc/**/*')
    .pipe(gulp.dest(releaseDir));
  }
};

//清理
gulp.task('clear', function(cb) {
  return del(['./'+ (argv.rc ? 'rc' : 'dist') +'/*'], cb);
});
gulp.task('clearRelease', function(cb) {
  return del([releaseDir], cb);
});

gulp.task('minjs', task.minjs);
gulp.task('alljs', task.alljs);
gulp.task('mobile', task.mobile);
gulp.task('mincss', task.mincss);
gulp.task('font', task.font);
gulp.task('mv', task.mv);
gulp.task('release', task.release);

//发行版 gulp
gulp.task('default', ['clearRelease'], function(){
  for(var key in task){
    task[key]('open');
  }
});

//完整任务 gulp all
gulp.task('all', ['clear'], function(){ //过滤 layim：gulp all --open、rc 版：gulp all --rc
  for(var key in task){
    task[key]();
  }
});

//打包 layer 独立版
gulp.task('layer', function(){
  var dir = './release/layer';
  
  gulp.src('./src/css/modules/layer/default/*')
  .pipe(gulp.dest(dir + '/src/theme/default'));

  return gulp.src('./src/lay/modules/layer.js')
  .pipe(gulp.dest(dir + '/src'));
});

//打包 layDate 独立版
gulp.task('laydate', function(){
  var dir = './release/laydate';
  
  gulp.src('./src/css/modules/laydate/default/{font,laydate}.css')
    .pipe(concat('laydate.css', {newLine: '\n\n'}))
  .pipe(gulp.dest(dir + '/src/theme/default'));

  return gulp.src('./src/lay/modules/laydate.js')
  .pipe(gulp.dest(dir + '/src'));
});

//打包 LayIM 版本
gulp.task('layim', function(){
  var dir = './release/zip/layim-v'+ inds.layim;
  gulp.src('./release/doc-layim/**/*')
  .pipe(gulp.dest(dir))
  
  gulp.src('./src/**/*')
  .pipe(gulp.dest(dir + '/src'))
  
  return gulp.src('./dist/**/*')
  .pipe(gulp.dest(dir + '/dist'));
});










