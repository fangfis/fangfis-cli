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
const reg = /^entry_.*\.js$/i;

/**
 * 过滤文件名
 * @param {*} paths 路径
 * @param {*} negate 是否取反
 */
let filterFileName = (paths, negate) => through.obj(function (file, encoding, callback) {
    let fileName = file.base && file.path ? file.relative : file.path;
    let nudeFile = fileName.split(/\/|\\/).reverse()[0];
    let isMeet;
    if (negate) {
        isMeet = paths.main ? !paths.main.test(nudeFile || fileName) : !reg.test(nudeFile || fileName);
    }else {
        isMeet = paths.main ? paths.main.test(nudeFile || fileName) : reg.test(nudeFile || fileName);
    }
    if (isMeet) {
        fileName = fileName.split('.')[0];
        file.name = fileName;
        callback(null, file);
    } else {
        callback();
    }
});
let gulpBuild = {
    css: function (paths) {
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
    img: function (paths) {
        console.log(chalk.yellow('[进行中] img'));
        return gulp.src(paths.img)
            .pipe(changed(`${paths.static}/images/`))
            .pipe(plumber())
            .pipe(gulp.dest(`${paths.static}/images/`))
            .on('end', function () {
                console.log(chalk.green('[已完成] img'));
            });
    },
    js: function (paths) {
        console.log(chalk.yellow('[进行中] js(Non-entrance files ES6->ES5)'));
        return gulp.src(paths.js)
            .pipe(filterFileName(paths, true))
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
                console.log(chalk.green('[已完成] js(Non-entrance files ES6->ES5)'));
            });
    },
    alljs: function (paths) {
        console.log(chalk.yellow('[进行中] alljs(all js files ES6->ES5)'));
        return gulp.src(paths.js)
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
                console.log(chalk.green('[已完成] alljs(all js files ES6->ES5)'));
            });
    },
    jsNo: function (paths) {
        console.log(chalk.yellow('[进行中] js(jsNo处理)'));
        return gulp.src([paths.nojs, `!${paths.js}`])
            .pipe(changed(`${paths.static}/js/`))
            .pipe(plumber())
            .pipe(gulp.dest(`${paths.static}/js/`))
            .on('end', function () {
                console.log(chalk.green('[已完成] js(jsNo处理)'));
            });
    },
    fjs: function (paths) {
        console.log(chalk.yellow('[进行中] fjs(Entry js file)'));
        let that = this;
        return gulp.src(paths.js)
            .pipe(filterFileName(paths))
            // node r.js -o baseUrl=. paths.jquery=some/other/jquery name=main out=main-built.js
            .pipe(shell([
                `node ${__dirname}/f.js -o name=<%= file.name %> out=${paths.static}/js/<%= file.name %>.js`
            ]))
            .on('end', function () {
                console.log(chalk.green('[已完成] fjs(Entry js file combo)'));
                that.uglifyTask(paths);
            });
    },
    uglifyTask: function (paths) {
        return gulp.src(`${paths.static}/js/**/*.js`)
            .pipe(filterFileName(paths))
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
                console.log(chalk.green('[已完成] fjs(Entry js file combo and ES6->ES5)'));
            });
    },
    watch: function (paths, key) {
        var that = this;
        if (key) {
            gulp.watch(paths[key], function (event) {
                console.log(chalk.green('File ' + event.path + ' was ' + event.type + ', running tasks => ' + key));
                that[key](paths);
            });
        } else {
            'css js img'.replace(/\w+/g, function (name) {
                gulp.watch(paths[name], function (event) {
                    console.log(chalk.green('File ' + event.path + ' was ' + event.type + ', running tasks => ' + name));
                    that[name](paths);
                });
            });
        }
    },
    default: function (paths) {
        let that = this;
        that.css(paths);
        that.img(paths);
        that.js(paths);
        that.jsNo(paths);
        that.fjs(paths);
    }
};

module.exports = gulpBuild;