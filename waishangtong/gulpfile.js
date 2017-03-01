//导入工具包 require('node_modules里对应模块')
var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');//html压缩
var cssmin = require('gulp-css');//css压缩
var jsmin = require('gulp-uglify');//js压缩
var imagemin = require('gulp-imagemin');//图片压缩
var pngcrush = require('imagemin-pngcrush');//图片压缩无损
var gulpif = require('gulp-if');//if判断
var rev = require('gulp-rev');//版本控制
var revCollector = require('gulp-rev-collector');//版本控制
var watch = require('gulp-watch');//监视更改过的文件
var rename = require("gulp-rename");
var del = require('del');
var changed = require('gulp-changed');//只传递被修改过的文件
var browserSync = require('browser-sync');
var reload = browserSync.reload;

gulp.task('serve', function() {//监视文件改动自动更新
    browserSync({
        port: 8000,
        server: {
            baseDir: 'dev'
        }
    });

    gulp.watch(['**/*'], {cwd: 'dev'}, reload);
});

gulp.task('del', function (cb) {
    del([
        'built/*'
    ], cb);
});

gulp.task('css-min',function(){//css加密
    return gulp.src('dev/css/*.css')
        .pipe(changed('built/css'))
        .pipe(cssmin())
        //.pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest('built/css'));
});

gulp.task('js-lib',function(){//重新更改lib中的js文件
    return gulp.src(['dev/js/lib/**/'])
        .pipe(changed('built/js/lib'))
        .pipe(gulp.dest('built/js/lib'));
});

gulp.task('js-min',function(){//加密js文件
    return gulp.src(['dev/js/**/','!dev/js/lib/**/'])
        .pipe(changed('built/js'))
        .pipe(jsmin())
        .pipe(gulp.dest('built/js'));
});

gulp.task('html-min',function () {
    return gulp.src(['rev/**/*.json','dev/**/','!dev/js/**/','!dev/css/**/','!dev/images/**/'])
        .pipe(changed('built'))
        .pipe(gulpif('*.html',htmlmin({
            empty:true,
            spare:true,
            collapseWhitespace: true
        })))
        .pipe( gulp.dest('built') );
});

gulp.task('images-min', function () {//图片压缩
    return gulp.src('dev/images/**/')
        .pipe(changed('built/images'))
        .pipe(gulpif('{*.png, *.gif, *.jpg, *.jpeg}',imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngcrush()]
        })))
        .pipe( gulp.dest( 'built/images' ) );
});

gulp.task('ymb', function(){
    return gulp.src(['rev/**/*.json','dev/html/approval/**/*'])
        /*.pipe(gulpif('*.html',
		    revCollector({
             replaceReved: true,
             dirReplacements: {
             'css': 'css',
             'js': 'js'
             }
             }),
            htmlmin({
            empty:true,
            spare:true,
            collapseWhitespace: true
        })))*/
        /*.pipe(revCollector({
            replaceReved: true,
            dirReplacements: {
                'css': 'css',
                'js': 'js'
            }
        }))*/
        .pipe( gulp.dest('built/html/approval') );
});

gulp.task('rev', ['css-min','js-lib','js-min','images-min'], function () {//html版本控制
    console.log('正在修改html路径...');
    return gulp.src(['rev/**/*.json','dev/**/*.html','!dev/js/**/','!dev/css/**/','!dev/images/**/'])
        //.pipe(changed('built/'))
        .pipe(revCollector({
            replaceReved: true,
            dirReplacements: {
                'css': 'css',
                'js': 'js'
            }
        }))
        .pipe(htmlmin({
            empty:true,
            spare:true,
            collapseWhitespace: true
        }))
        .pipe( gulp.dest('built/') );
});

gulp.task('default',['css-min','js-lib','js-min', 'images-min','html-min']); //定义默认任务
