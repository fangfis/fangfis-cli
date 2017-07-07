'use strict';
/*
创建Gulp配置文件
*/
const co = require('co');
const gulpbuild = require('../project/gulpbuild');
module.exports = () => {
    co(function* () {
        console.log(gulpbuild.default);
        gulpbuild.default();
    });
};