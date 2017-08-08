/*
 创建Gulp配置文件
 */
const basePath = process.cwd() + '/node_modules/';
// 引入 gulp
const gulp = require(basePath + 'gulp');
const pipe = require(basePath + 'gulp-pipe');

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
 * @param {*} type 类型 js fjs alljs
 */
let filterFileName = (paths, type) => through.obj(function (file, encoding, callback) {
    let fileName = file.base && file.path ? file.relative : file.path;
    let nudeFile = fileName.split(/\/|\\/).reverse()[0];
    let isMeet;
    switch (type) {
        case 'alljs':
            isMeet = true;
            break;
        case 'js':
            isMeet = paths.main ? !paths.main.test(nudeFile || fileName) : !reg.test(nudeFile || fileName);
            break;
        case 'fjs':
            isMeet = paths.main ? paths.main.test(nudeFile || fileName) : reg.test(nudeFile || fileName);
            break;
        default:
            break;
    }
    if (isMeet) {
        fileName = fileName.split('.js')[0];
        file.name = fileName.replace(/\\/g,'/');
        callback(null, file);
    } else {
        callback();
    }
});
let gulpBuild = {
    css: function (paths) {
        console.log(chalk.yellow('[进行中] css'));
        let arr = [
            gulp.src(paths.css), changed(`${paths.static}/css/`),
            plumber(),
            autoprefixer({
                browsers: ['Chrome >= 40', 'Firefox >= 40', 'Explorer >= 8', 'iOS >= 8', 'Android >= 4']
            }),
            csscomb(),
            cleancss(),
            gulp.dest(`${paths.static}/css/`)
        ];
        return pipe(arr)
            .on('end', function () {
                console.log(chalk.green('[已完成] css'));
            });
    },
    img: function (paths) {
        console.log(chalk.yellow('[进行中] img'));
        let arr = [
            gulp.src(paths.img),
            changed(`${paths.static}/images/`),
            plumber(),
            gulp.dest(`${paths.static}/images/`)
        ];
        return pipe(arr)
            .on('end', function () {
                console.log(chalk.green('[已完成] img'));
            });
    },
    js: function (paths) {
        console.log(chalk.yellow('[进行中] js(Non-entrance files ES6->ES5)'));
        let that = this;
        let arr = [
            gulp.src(paths.js),
            changed(`${paths.static}/js/`),
            plumber(),
            filterFileName(paths, 'js'),
            shell([
                `node ${__dirname}/f.js -o name=<%= file.name %> noDeep=true skipModuleInsertion=true out=${paths.static}/js/<%= file.name %>.js`
            ])
        ];
        return pipe(arr)
            .on('end', function () {
                that.uglifyTask(paths, 'js', chalk.green('[已完成] js(Non-entrance files ES6->ES5)'));
            });
    },
    alljs: function (paths) {
        console.log(chalk.yellow('[进行中] alljs(all js files ES6->ES5)'));
        let that = this;
        let arr = [
            gulp.src(paths.js),
            changed(`${paths.static}/js/`),
            plumber(),
            filterFileName(paths, 'alljs'),
            shell([
                `node ${__dirname}/f.js -o name=<%= file.name %> noDeep=true skipModuleInsertion=true out=${paths.static}/js/<%= file.name %>.js`
            ])
        ];
        return pipe(arr)
            .on('end', function () {
                that.uglifyTask(paths, 'alljs', chalk.green('[已完成] alljs(all js files ES6->ES5)'));
            });
    },
    jsNo: function (paths) {
        console.log(chalk.yellow('[进行中] js(jsNo处理)'));
        let arr = [
            gulp.src([paths.nojs, `!${paths.js}`]),
            changed(`${paths.static}/js/`),
            plumber(),
            gulp.dest(`${paths.static}/js/`)
        ];
        return pipe(arr)
            .on('end', function () {
                console.log(chalk.green('[已完成] js(jsNo处理)'));
            });
    },
    fjs: function (paths) {
        console.log(chalk.yellow('[进行中] fjs(Entry js file)'));
        let that = this;
        let arr = [
            gulp.src(paths.js),
            plumber(),
            filterFileName(paths, 'fjs'),
            shell([
                `node ${__dirname}/f.js -o name=<%= file.name %> skipModuleInsertion=true out=${paths.static}/js/<%= file.name %>.js`
            ])
        ];
        return pipe(arr)
            .on('end', function () {
                console.log(chalk.green('[已完成] fjs(Entry js file combo)'));
                that.uglifyTask(paths, 'fjs', chalk.green('[已完成] fjs(Entry js file combo and ES6->ES5)'));
            });
    },

    /**
     * js二阶处理(babel,sourecemap,uglify等)
     * @param {object} paths 路径对象
     * @param {string} type js fjs alljs
     * @param {string} type console信息
     * @returns
     */
    uglifyTask: function (paths, type, log) {
        //# sourceMappingURL=../../maps/plugins/fangLazyLoader/fangLazyLoader.js.map?_ufaomt6ehl8
        let arr = [
            gulp.src(`${paths.static}/js/**/*.js`),
            filterFileName(paths, type),
            plumber(),
            babel(),
            replace(/\/\/#\s*sourceMappingURL=.+\.map\?\w+/g, ''),
            sourcemaps.init({
                loadMaps: true
            }),
            uglify({
                mangle: true,
                output: {
                    ascii_only: true
                }
            }),
            sourcemaps.write('./maps'),
            replace(/\.js\.map(\?_\w+)?/g, '.js.map?_' + Math.random().toString(32).substring(2)),
            gulp.dest(`${paths.static}/js/`)
        ];
        return pipe(arr)
            .on('end', function () {
                console.log(log);
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
                    if (name === 'js') {
                        that.fjs(paths);
                    }
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