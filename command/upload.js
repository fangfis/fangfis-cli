'use strict';
/*
创建Gulp配置文件
*/
const co = require('co');
const gulpbuild = require('../project/gulpbuild');
const path = require('path');
const _exit = process.exit;
// 美化日志
const chalk = require('chalk');

let hasValue = (dir) => typeof dir !== 'boolean' && dir !== undefined;
function exit(code) {
    var draining = 0;
    var streams = [process.stdout, process.stderr];
    // flush output for Node.js Windows pipe bug
    function done() {
        if (!(draining--)) _exit(code);
    }
    exit.exited = true;

    streams.forEach(function(stream) {
        // submit empty write request and wait for completion
        draining += 1;
        stream.write('', done);
    });

    done();
}
module.exports = (ops) => {
    let fangfisConfig;
    let fangfisConfigPath = path.resolve(process.cwd(), './fangfis.config.json');
    try {
        fangfisConfig = require(fangfisConfigPath);
    } catch (e) {
        console.log(`${chalk.yellow(fangfisConfigPath)} does not exist `);
        return;
    }
    co(function*() {
        let params = ops.params,
            mustParams = ops.mustParams;
        let upload = fangfisConfig.upload;
        if (!upload || !upload.default) {
            console.log('Failed to get the correct configuration(fangfis.config.json),Please check the configuration file fangfis.config.json  ');
            exit();
            return;
        }
        let ftpConfig = upload.default;
        if (ops.type) {
            if (typeof ops.type === 'boolean' && upload.online) {
                ftpConfig = upload.online;
            }else {
                ftpConfig = ops.type;
            }
            if (!ftpConfig || typeof ftpConfig !== 'object') {
                console.log(`Failed to get the configuration:${chalk.yellow(ops.type)},Please check the configuration file fangfis.config.json  `);
                exit();
                return;
            }
        }
        let lackConf = false;
        params.forEach((item) => {
            if (hasValue(ops[item])) {
                ftpConfig[item] = ops[item];
            }
        });
        mustParams.forEach((item) => {
            if (!hasValue(ftpConfig[item])) {
                console.log(`The conifg:'${chalk.yellow(item)}' does not exist `);
                lackConf = true;
            }
        });
        console.log(chalk.cyan('Use the following configuration:'));
        console.log(ftpConfig);
        // 判断是否缺少配置项
        if (lackConf) {
            exit();
        } else {
            gulpbuild.ftp(ftpConfig);
        }
    });
};