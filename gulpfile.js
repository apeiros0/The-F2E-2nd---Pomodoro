var gulp = require('gulp');
const $ = require('gulp-load-plugins')();
var autoprefixer = require('autoprefixer');
var browserSync = require('browser-sync').create();
var minimist = require('minimist');
var gulpSequence = require('gulp-sequence');

// production || develop
var envOptions = {
    string: 'env',
    default: { env: 'develop' }
}

var options = minimist(process.argv.slice(2), envOptions);


gulp.task('clean', function () {
    return gulp.src(['./.tmp', './public'], { read: false }) // false阻止gulp讀取文件的內容，使此任務更快
        .pipe($.clean());
});


// 複製檔案
// 加 ! 不會取得該路徑
gulp.task('copy', function () {
    gulp.src(['./source/**/**', '!source/scss/**/**', '!source/js/**/**'])
        .pipe(gulp.dest('./public/'))
        .pipe(browserSync.stream())
});


gulp.task('sass', function () {
    return gulp.src('./source/scss/**/*.scss')
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.sass().on('error', $.sass.logError))
        // .pipe($.sass({ 
        //     outputStyle: 'nested', // 輸出方式
        //     includePaths: ['./node_modules/bootstrap/scss']
        //   }) // 取得 node_modules 的 bootstrap.scss
        .pipe($.postcss([autoprefixer()]))
        .pipe($.if(options.env === 'production', $.cleanCss()))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('./public/scss'))
        .pipe(browserSync.stream())
});


gulp.task('babel', () =>
    gulp.src('./source/js/**/*.js')
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.babel({
            presets: ['@babel/env']
        }))
        .pipe($.concat('all.js')) // 合併檔案 $.concat('合併的檔案名稱')
        .pipe($.if(options.env === 'production', $.uglify({
            compress: {
                drop_console: true, // 清除 console.log
            }
        })))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('./public/js/'))
        .pipe(browserSync.stream())
);


// gulp.task('vendorJs', function () {
//     return gulp.src([ // 從 node_modules 取得 jquery bootstrap 的 js 檔
//       './node_modules/jquery/dist/jquery.slim.min.js',
//       './node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'
//     ])
//     .pipe($.concat('vendor.js')) // 合併成 vendor.js
//     .pipe(gulp.dest('./public/javascripts'))
//   })


gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: "./public/"  // 指定資料夾 (釋出的檔案位置)
        },
        reloadDebounce: 3000
    });
});


gulp.task('watch', function () {
    $.watch(['./source/scss/**/*.scss', './source/js/**/*.js'], function () {
        // start 直接呼叫 task
        gulp.start('sass');
        gulp.start('babel');
    });
});

gulp.task('deploy', function () {
    return gulp.src('./public/**/*') // 發布路徑
        .pipe($.ghPages());
});


gulp.task('default', ['copy', 'sass', 'babel', 'browser-sync', 'watch']);


gulp.task('build', gulpSequence('clean', 'copy', 'sass', 'babel'));