'use strict';
/*
创建Gulp配置文件
*/
const co = require('co');
const gulpbuild = require('../project/gulpbuild');
let hasValue = (dir) => typeof dir !== 'boolean' && dir !== undefined;
const _exit = process.exit;
function exit(code) {
    var draining = 0;
    var streams = [process.stdout, process.stderr];
    // flush output for Node.js Windows pipe bug
    // https://github.com/joyent/node/issues/6247 is just one bug example
    // https://github.com/visionmedia/mocha/issues/333 has a good discussion
    function done() {
        if (!(draining--)) _exit(code);
    }
    exit.exited = true;

    streams.forEach(function (stream) {
        // submit empty write request and wait for completion
        draining += 1;
        stream.write('', done);
    });

    done();
}
let paths = {
    static: './static',
    dev: './dev',
    css: './dev/css/**/*.css',
    js: './dev/js/**/*.js',
    nojs: '/dev/js/**/*',
    img: './dev/images/**/*'
};
module.exports = (ops) => {
    co(function* () {
        let eventStr = 'css js img';
        // 参数判断
        let hasOps = false;
        // 判断是否监控
        let watch = ops.watch;
        let isWatched = false;
        if (hasValue(ops.output)) {
            paths.static = ops.output.split('/').reverse()[0];
        }

        // 判断入口
        if (hasValue(ops.main)) {
            if (/^\/.+\/[img]*$/.test(ops.main)) {
                paths.main = eval(ops.main);
            }else {
                console.log('The input parameters(-m|--main) do not meet the requirements, eg: /^entry_*/img');
                exit();
            }
        }

        eventStr.replace(/\w+/g, function (key) {
            if (ops.hasOwnProperty(key)) {
                hasOps = true;
                watch && (isWatched = true) && gulpbuild.watch(paths, key);
                gulpbuild[key](paths);
            }
        });
        // 监控
        watch && !isWatched && gulpbuild.watch(paths);
        if (!hasOps) {
            gulpbuild.default(paths);
        }
    });
};