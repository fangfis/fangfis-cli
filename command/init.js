'use strict';
const gulp = require('gulp');
const co = require('co');
const prompt = require('co-prompt');
const chalk = require('chalk');
const path = require('path');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
module.exports = (ops) => {
    co(function* () {
        // 处理用户输入
        let projectName = yield prompt('Project name(default:project): ');
        projectName = projectName || 'project';
        // 执行命令
        let dirPath = path.join(__dirname, '../project/**/*');
        let babelPath = path.join(__dirname, '../project/babelrc');
        let htmlPath = path.join(__dirname, '../project/demo/index.html');

        let lastPath = [dirPath, `!${babelPath}`, `!${htmlPath}`];
        if (ops.notemplate) {
            lastPath.concat([`!${path.join(__dirname, '../project/demo')}`, `!${path.join(__dirname, '../project/dev/js/demo')}`]);
        }
        console.log(chalk.white('\n Start generating...'));

        /**
         * 处理其他文件文件
         */
        let glupFiles = () => {
            gulp.src(lastPath)
                .pipe(gulp.dest(`${projectName}/`))
                .on('end', function () {
                    console.log(chalk.green('\n √ 恭喜您,项目已经创建!'));
                    console.log(chalk.yellow('\n重要提醒:'));
                    console.log(chalk.yellow('  请先做如下配置'));
                    if (ops.notemplate) {
                        console.log(chalk.yellow(`  1.cd 进入${projectName}目录并执行 npm install`));
                        console.log(chalk.yellow(`  2.在${projectName}目录下执行 gulp`));
                    } else {
                        console.log(chalk.yellow('  1.配置本地域名js.npm.com;'));
                        console.log(chalk.yellow(`  2.将本地域名路径指向${process.cwd()}`));
                        console.log(chalk.yellow(`  3.cd 进入${projectName}目录并执行 npm install`));
                        console.log(chalk.yellow(`  4.在${projectName}目录下执行 gulp`));
                    }
                    process.exit();
                });
        };

        /**
         * 处理babel文件
         */
        let gulpBabel = () => {
            gulp.src(babelPath)
                .pipe(rename('.babelrc'))
                .pipe(gulp.dest(`${projectName}/`))
                .on('end', function () {
                    glupFiles();
                });
        };

        /**
         * 处理html文件
         */
        let gulpHtml = () => {
            gulp.src(htmlPath)
                .pipe(replace('/fang/', `/${projectName}`))
                .pipe(gulp.dest(`${projectName}/demo`))
                .on('end', function () {
                    gulpBabel();
                });
        };
        if (ops.notemplate) {
            gulpBabel();
        } else {
            gulpHtml();
        }
    });
};