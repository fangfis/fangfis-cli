'use strict';
/*
创建Gulp配置文件
*/
const co = require('co');
const gulpbuild = require('../project/gulpbuild');
module.exports = (ops) => {
    co(function* () {
        var eventStr = 'css js img';
        var hasOps = false;
        if (ops.watch) {
            hasOps = true;
            gulpbuild.watch();
            gulpbuild.default();
        }else {
            eventStr.replace(/\w+/g, function (key) {
                if (ops.hasOwnProperty(key)) {
                    hasOps = true;
                    gulpbuild[key]();
                }
            });
        }
        if (!hasOps) {
            gulpbuild.default();
        }
    });
};