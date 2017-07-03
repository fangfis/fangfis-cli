define('demo/test', ['demo/test2'], function (require) {
    'use strict';
    var p = document.createElement('p');
    p.innerHTML = '我是test模块';
    document.body.appendChild(p);
    require('demo/test2');
});