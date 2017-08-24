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

/**
 * Graceful exit for async STDIO
 */
function exit(code) {
    let draining = 0;
    let streams = [process.stdout, process.stderr];
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

/**
 * 格式化入口文件
 * @param {any} main 入口文件
 *  main
    main,main2
    main,main2,ery*
    module/js/main
    module/js/main,module/js/main2
    module/js/main,module/js/main2,module/js/ery*
    main*
    *main
    main_*tool
 * @param {any} input 输入路径
 * @param {any} base 模块基本路径
 * @returns
 */
function formatMain(config) {
    let main = config.main,
        input = config.input,
        base = config.base;
    let mainArr;
    let noMainArr = [];
    let outputMainArr = [];
    let tryReg;
    try {
        tryReg = eval(main);
    } catch (e) {}
    if (typeof tryReg === 'object') {
        console.log(chalk.red('The input parameters(-m|--main) do not meet the requirements'));
        exit();
        return {};
    }
    let format = function(pathstr) {
        let result;
        if (!pathstr || typeof pathstr !== 'string') {
            result = '';
        } else {
            if (pathstr.indexOf('/') > -1) {
                pathstr = path.join(base, pathstr);
            } else {
                pathstr = `${input}/js/**/${pathstr}`;
            }
            result = pathstr.substr(pathstr.length - 3) === '.js' ? pathstr : `${pathstr}.js`;
        }
        return result;
    };
    if (main && typeof main === 'string') {
        mainArr = main.split(',');
        let i = 0,
            len = mainArr.length;
        for (; i < len; i++) {
            mainArr[i] = format(mainArr[i]);
            // 非入口文件
            noMainArr.push(`!${mainArr[i]}`);
            // 输出入口文件
            let inp = config.input.replace('./','');
            let outp = config.output.replace('./','');
            outputMainArr.push(mainArr[i].replace(inp,outp));
        }
    }
    return {
        main: mainArr,
        nomain: noMainArr,
        outputMain: outputMainArr
    };
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
    let valueParams = ops.valueParams,
        booleanParams = ops.booleanParams;
    let buildConfig = fangfisConfig.build;
    if (!buildConfig) {
        console.log('Failed to get the correct configuration(fangfis.config.json),Please check the configuration file fangfis.config.json  ');
        exit();
        return;
    }
    valueParams.forEach((item) => {
        if (hasValue(ops[item])) {
            buildConfig[item] = ops[item];
        }
    });
    booleanParams.forEach((item) => {
        if (ops[item]) {
            buildConfig[item] = ops[item];
        }
    });
    // 格式化入口
    let mainJson = formatMain(buildConfig);
    buildConfig.main = mainJson.main;
    buildConfig.nomain = mainJson.nomain;
    buildConfig.outputMain = mainJson.outputMain;
    // 自定义输出目录兼容
    buildConfig.output = buildConfig.output.split('/').reverse()[0];
    co(function*() {
        let eventStr = 'css js img';
        // 参数判断
        let hasOps = false;
        // 判断是否监控
        let watch = buildConfig.watch;
        let isWatched = false;

        if (!buildConfig.main) return;
        eventStr.replace(/\w+/g, function(key) {
            if (buildConfig.hasOwnProperty(key)) {
                hasOps = true;
                watch && (isWatched = true) && gulpbuild.watch(buildConfig, key);
                // if (key === 'js') gulpbuild.fjs(buildConfig);
                gulpbuild[key](buildConfig);
            }
        });
        // 监控
        watch && !isWatched && gulpbuild.watch(buildConfig);
        if (!hasOps) {
            gulpbuild.default(buildConfig);
        }
    });
};