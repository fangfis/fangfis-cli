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

// 错误处理
const plumber = require(basePath + 'gulp-plumber');

// 开发辅助
// 美化日志
const chalk = require(basePath + 'chalk');
// CSS规范排序
const csscomb = require(basePath + 'gulp-csscomb');
// gulp的ftp插件
const ftp = require(basePath + 'vinyl-ftp');
const fs = require('fs');
const path = require('path');

// gulp combo插件
const fangfisCombo = require('/Users/tankunpeng/WebSite/gulp-fangfis-combo');

// 生成文件流
const Vinyl = require('vinyl');
const stream = require('stream');
let writeAsyncFile = function (fileData, base, dest) {
    // 接受回传异步模块数组
    fileData.forEach(function (item) {
        var readable = stream.Readable({
            objectMode: true
        });
        readable._read = function () {
            this.push(new Vinyl({
                path: item.path,
                base: base,
                contents: new Buffer(item.contents)
            }));
            this.push(null);
        };
        var arr = [
            readable,
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
            gulp.dest(dest)
        ];
        return pipe(arr)
        .on('end', function () {
            console.log(chalk.green('[已完成] ' + item.origId));
        });
        // readable.pipe(gulp.dest(dest));
    });
};

/**
 * 过滤文件名
 * @param {*} config config
 */
let filterFileName = (config) => through.obj(function (file, encoding, callback) {
    let fileName = path.relative(path.resolve(config.base), file.path).replace('.js', '');
    file.name = fileName.replace(/\\/g, '/');
    console.log(chalk.cyan(`${file.name}:`));
    callback(null, file);
});

/**
 * 读取进度
 */
let filterFtpFileName = () => through.obj(function (file, encoding, callback) {
    let fileName = file.base && file.path ? file.relative : file.path;
    if (/.*\.\w+$/.test(fileName)) {
        console.log(chalk.cyan(`      ${fileName}`));
        callback(null, file);
    } else {
        callback();
    }
});

let gulpBuild = {
    css: function (config) {
        console.log(chalk.yellow('[进行中] css'));
        let arr = [
            gulp.src(`${config.input}/css/**/*.css`, {
                base: `${config.input}/css`
            }),
            changed(`${config.output}/css/`),
            plumber(),
            autoprefixer({
                browsers: ['Chrome >= 40', 'Firefox >= 40', 'Explorer >= 8', 'iOS >= 8', 'Android >= 4']
            }),
            csscomb(),
            cleancss(),
            gulp.dest(`${config.output}/css/`)
        ];
        return pipe(arr)
            .on('end', function () {
                console.log(chalk.green('[已完成] css'));
            });
    },
    img: function (config) {
        console.log(chalk.yellow('[进行中] img'));
        let arr = [
            gulp.src(`${config.input}/images/**/*`, {
                base: `${config.input}/images`
            }),
            changed(`${config.output}/images/`),
            plumber(),
            gulp.dest(`${config.output}/images/`)
        ];
        return pipe(arr)
            .on('end', function () {
                console.log(chalk.green('[已完成] img'));
            });
    },
    js: function (config) {
        console.log(chalk.yellow('[进行中] js(Entry js file)'));
        let arr = [
            gulp.src(config.main, { base: `${config.input}/js` }),
            changed(`${config.output}/js`),
            plumber(),
            filterFileName(config),
            fangfisCombo(Object.assign({
                base: `${config.input}/js`
            }, config.combo), function (cons) {
                // cons Array 数组类型 回传异步模块合并后的异步模块数组
                writeAsyncFile(cons, `${config.input}/js`, `${config.output}/js`);
            }),
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
            gulp.dest(`${config.output}/js`)
        ];
        return pipe(arr)
            .on('end', function () {
                console.log(chalk.green('[已完成] js(Entry js file)'));
            });
    },
    watch: function (config, key) {
        let that = this;
        if (key) {
            gulp.watch(config[key], function (event) {
                console.log(chalk.green('File ' + event.path + ' was ' + event.type + ', running tasks => ' + key));
                that[key](config);
            });
        } else {
            'css js img'.replace(/\w+/g, function (name) {
                gulp.watch(`${config.input}/${name}/**/*`, function (event) {
                    console.log(chalk.green('File ' + event.path + ' was ' + event.type + ', running tasks => ' + name));
                    that[name](config);
                });
            });
        }
    },
    ftp: function (ftpConfig) {
        console.log(chalk.yellow('[进行中] ftp uploading'));
        let conn = ftp.create(ftpConfig);

        let ftpFn = (pt) => {
            let arr = [
                gulp.src(pt),
                plumber(),
                filterFtpFileName(),
                conn.newer(ftpConfig.output),
                conn.dest(ftpConfig.output)
            ];
            return pipe(arr)
                .on('end', function () {
                    console.log(chalk.green('[已完成] ftp uploading'));
                });
        };
        console.log(chalk.cyan('uploading files:'));
        fs.readdir(ftpConfig.input, function (err) {
            if (err) {
                if (err.code === 'ENOENT') {
                    console.log(chalk.green('[已取消] ftp err message:no such file or directory'));
                } else {
                    ftpFn(ftpConfig.input);
                }
            } else {
                ftpFn(`${ftpConfig.input}/**/*`);
            }
        });
    },
    default: function (config) {
        let that = this;
        that.css(config);
        that.img(config);
        that.js(config);
    }
};

module.exports = gulpBuild;