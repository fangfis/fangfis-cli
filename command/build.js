'use strict';
/*
创建Gulp配置文件
*/
const co = require('co');
const gulpbuild = require('../project/gulpbuild');
module.exports = (ops) => {
    co(function* () {
        var eventStr = 'css js img';
        if (!ops || typeof ops !== 'object') {
            gulpbuild.default();
        } else if (ops.watch) {
            gulpbuild.watch();
            gulpbuild.default();
        } else {
            eventStr.replace(/\w+/g, function (key) {
                if (ops.hasOwnProperty(key)) {
                    gulpbuild[key]();
                }
            });
        }

    });
};