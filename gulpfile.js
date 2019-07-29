var gulp = require('gulp');
const $ = require('gulp-load-plugins')();
var autoprefixer = require('autoprefixer');
var browserSync = require('browser-sync').create();
var minimist = require('minimist');
var gulpSequence = require('gulp-sequence');

var envOptions = {
    string: 'env',
    default: { env: 'develop' }
}

var options = minimist(process.argv.slice(2), envOptions);


gulp.task('clean', function () {
    return gulp.src(['./.tmp', './public'], {read: false})
        .pipe($.clean());
});


gulp.task('copyHTML', function () {
    return gulp.src('./source/**/*.html')
        .pipe(gulp.dest('./public/'))
});


gulp.task('copyMusic', function () {
    return gulp.src('./source/music/**/*.mp3')
        .pipe(gulp.dest('./public/music'))
});


gulp.task('sass', function () {
    return gulp.src('./source/scss/**/*.scss')
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.sass().on('error', $.sass.logError))
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

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./public/"  // 指定資料夾 (釋出的檔案位置)
        },
        reloadDebounce: 3000
    });
});


gulp.task('watch', function () {
    gulp.watch('./source/scss/**/*.scss', ['sass']);
    gulp.watch('./source/js/**/*.js', ['babel']);
});


gulp.task('default', ['sass', 'babel', 'copyHTML', 'copyMusic', 'browser-sync','watch']);


gulp.task('build', gulpSequence('clean', 'babel', 'sass', 'copyHTML', 'copyMusic'));