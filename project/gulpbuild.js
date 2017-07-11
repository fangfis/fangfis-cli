/*
 创建Gulp配置文件
 */
const basePath = process.cwd() + '/node_modules/';
// 引入 gulp
const gulp = require(basePath + 'gulp');

// 引入功能组件
const uglify = require(basePath + 'gulp-uglify');
const babel = require(basePath + 'gulp-babel');
const sourcemaps = require(basePath + 'gulp-sourcemaps');
const replace = require(basePath + 'gulp-replace');

const changed = require(basePath + 'gulp-changed');
const through = require(basePath + 'through2');

const autoprefixer = require(basePath + 'gulp-autoprefixer');
const cleancss = require(basePath + 'gulp-clean-css');
const shell = require(basePath + 'gulp-shell');

// 错误处理
const plumber = require(basePath + 'gulp-plumber');

// 开发辅助
// 美化日志
const chalk = require(basePath + 'chalk');
// CSS规范排序
const csscomb = require(basePath + 'gulp-csscomb');

let paths = {
    static: './static',
    dev: './dev',
    css: './dev/css/**/*.css',
    js: './dev/js/**/*.js',
    nojs: '/dev/js/**/*',
    img: './dev/images/**/*'
};

let gulpBuild = {
    css: function () {
        console.log(chalk.yellow('[进行中] css'));
        return gulp.src(paths.css)
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
    },
    img: function () {
        console.log(chalk.yellow('[进行中] img'));
        return gulp.src(paths.img)
            .pipe(changed(`${paths.static}/images/`))
            .pipe(plumber())
            .pipe(gulp.dest(`${paths.static}/images/`))
            .on('end', function () {
                console.log(chalk.green('[已完成] img'));
            });
    },
    js: function () {
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
            .pipe(babel())
            .pipe(sourcemaps.init())
            .pipe(uglify({
                mangle: true,
                output: {
                    ascii_only: true
                }
            }))
            .pipe(sourcemaps.write('./maps'))
            .pipe(replace(/\.js\.map(\?_\w+)?/g, '.js.map?_' + Math.random().toString(32).substring(2)))
            .pipe(gulp.dest(`${paths.static}/js/`))
            .on('end', function () {
                console.log(chalk.green('[已完成] js(!entry_*.js ES6->ES5)'));
            });
    },
    jsNo: function () {
        console.log(chalk.yellow('[进行中] js(jsNo处理)'));
        return gulp.src([paths.nojs, `!${paths.js}`])
            .pipe(changed(`${paths.static}/js/`))
            .pipe(plumber())
            .pipe(gulp.dest(`${paths.static}/js/`))
            .on('end', function () {
                console.log(chalk.green('[已完成] js(jsNo处理)'));
            });
    },
    fjs: function () {
        console.log(chalk.yellow('[进行中] fjs(entry_*.js)'));
        let that = this;
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
                `node ${__dirname}/f.js -o name=<%= file.name %> out=${paths.static}/js/<%= file.name %>.js`
            ]))
            .on('end', function () {
                console.log(chalk.green('[已完成] fjs(entry_*.js combo)'));
                that.uglifyTask();
            });
    },
    uglifyTask: function () {
        return gulp.src(`${paths.static}/js/**/entry_*.js`)
            .pipe(babel())
            .pipe(sourcemaps.init())
            .pipe(uglify({
                mangle: true,
                output: {
                    ascii_only: true
                }
            }))
            .pipe(sourcemaps.write('./maps'))
            .pipe(replace(/\.js\.map(\?_\w+)?/g, '.js.map?_' + Math.random().toString(32).substring(2)))
            .pipe(gulp.dest(`${paths.static}/js/`))
            .on('end', function () {
                console.log(chalk.green('[已完成] fjs(entry_*.js combo and ES6->ES5)'));
            });
    },
    watch: function () {
        var that = this;
        gulp.watch(paths.css, function (event) {
            console.log(chalk.green('File ' + event.path + ' was ' + event.type + ', running tasks => css'));
            that.css();
        });
        gulp.watch(paths.img, function (event) {
            console.log(chalk.green('File ' + event.path + ' was ' + event.type + ', running tasks => img'));
            that.img();
        });
        gulp.watch(paths.js, function (event) {
            console.log(chalk.green('File ' + event.path + ' was ' + event.type + ', running tasks => js,jsNo,fjs'));
            that.js();
            that.jsNo();
            that.fjs();
        });
    },
    default: function () {
        let that = this;
        that.css();
        that.img();
        that.js();
        that.jsNo();
        that.fjs();
    }
};

module.exports = gulpBuild;