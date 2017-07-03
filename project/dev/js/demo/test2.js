define('demo/test2',[], function () {
    'use strict';
    var p = document.createElement('p');
    p.innerHTML = '我是test2模块';
    document.body.appendChild(p);
});