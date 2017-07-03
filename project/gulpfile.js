/*
 创建Gulp配置文件
 */
// 引入 gulp
const gulp = require('gulp');

// 引入功能组件
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');

const changed = require('gulp-changed');
const through = require('through2');

const autoprefixer = require('gulp-autoprefixer');
const cleancss = require('gulp-clean-css');
const shell = require('gulp-shell');

// 错误处理
const plumber = require('gulp-plumber');

// 开发辅助
// 美化日志
const chalk = require('chalk');
// CSS规范排序
const csscomb = require('gulp-csscomb');

// 参数
const yargs = require('yargs').argv;

const replace = require('gulp-replace');

// 是否上正式
let isProd = false;
// 判断传入的参数
if (yargs.p) {
    isProd = true;
}

let isWatch = false;
if (yargs.w) {
    isWatch = true;
}

// 设置相关路径
const paths = {
    static: 'static',
    dev: 'dev',
    css: 'dev/css/**/*',
    js: 'dev/js/**/*.js',
    img: 'dev/images/**/*'
};

gulp.task('img', function () {
    console.log(chalk.yellow('[进行中] img'));
    gulp.src(paths.img)
        .pipe(changed(`${paths.static}/images/`))
        .pipe(plumber())
        .pipe(gulp.dest(`${paths.static}/images/`))
        .on('end', function () {
            console.log(chalk.green('[已完成] img'));
        });
});

// Sass 处理
gulp.task('css', function () {
    console.log(chalk.yellow('[进行中] css'));
    gulp.src(paths.css)
        .pipe(changed(`${paths.static}/css/`))
        .pipe(plumber())
        .pipe(autoprefixer({
            browsers: [
                'Chrome >= 40',
                'Firefox >= 40',
                'Explorer >= 8',
                'iOS >= 8',
                'Android >= 4'
            ]
        }))
        .pipe(csscomb())
        .pipe(cleancss())
        .pipe(gulp.dest(`${paths.static}/css/`))
        .on('end', function () {
            console.log(chalk.green('[已完成] css'));
        });
});

// js处理转成ES5
gulp.task('js', function () {
    console.log(chalk.yellow('[进行中] js(!entry_*.js ES6->ES5)'));
    return gulp.src(paths.js)
        .pipe(through.obj(function (file, encoding, callback) {
            let fileName = file.base && file.path ? file.relative : file.path;
            if (!/entry_/i.test(fileName)) {
                callback(null, file);
            } else {
                callback();
            }
        }))
        .pipe(changed(`${paths.static}/js/`))
        .pipe(plumber())
        // .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(uglify({
            mangle: true,
            output: {ascii_only: true}
        }))
        // .pipe(sourcemaps.write('./maps'))
        // .pipe(replace(/\.js\.map(\?_\w+)?/g, '.js.map?_' + Math.random().toString(32).substring(2)))
        .pipe(gulp.dest(`./static/js/`))
        .on('end', function () {
            console.log(chalk.green('[已完成] js(!entry_*.js ES6->ES5)'));
        });
});

gulp.task('jsNo', function () {
    console.log(chalk.yellow('[进行中] js(jsNo处理)'));
    return gulp.src(['dev/js/**/*','!dev/js/**/*.js'])
        .pipe(changed(`${paths.static}/js/`))
        .pipe(plumber())
        .pipe(gulp.dest(`./static/js/`))
        .on('end', function () {
            console.log(chalk.green('[已完成] js(jsNo处理)'));
        });
});

gulp.task('fjs', function () {
    console.log(chalk.yellow('[进行中] fjs(entry_*.js)'));
    return gulp.src(paths.js)
        .pipe(through.obj(function (file, encoding, callback) {
            let fileName = file.base && file.path ? file.relative : file.path;
            if (/entry_/i.test(fileName)) {
                fileName = fileName.split('.')[0];
                file.name = fileName;
                callback(null, file);
            } else {
                callback();
            }
        }))
        // node r.js -o baseUrl=. paths.jquery=some/other/jquery name=main out=main-built.js
        .pipe(shell([
            'node f.js -o build.js name=<%= file.name %> out=static/js/<%= file.name %>.js'
        ]))
        .on('end', function () {
            console.log(chalk.green('[已完成] fjs(entry_*.js combo)'));
            uglifyTask();
        });
});

function uglifyTask() {
    gulp.src('./static/js/**/entry_*.js')
        // .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(uglify({
            mangle: true,
            output: {ascii_only: true}
        }))
        // .pipe(sourcemaps.write('./maps'))
        // .pipe(replace(/\.js\.map(\?_\w+)?/g, '.js.map?_' + Math.random().toString(32).substring(2)))
        .pipe(gulp.dest(`./static/js/`))
        .on('end', function () {
            console.log(chalk.green('[已完成] fjs(entry_*.js combo and ES6->ES5)'));
        });
}

/**
 * 文件变更监听
 * $ gulp watch
 */

gulp.task('watch', function () {
    if (!isWatch) {
        return;
    }
    console.log(chalk.green('[监听] 启动gulp watch自动编译'));
    gulp.watch(paths.js, ['js']);
    gulp.watch(paths.js, ['jsNo']);
    gulp.watch(paths.js, ['fjs']);
    gulp.watch(paths.css, ['css']);
    gulp.watch(paths.img, ['img']);
});


gulp.task('default', ['watch', 'js','jsNo', 'fjs','css', 'img']);
