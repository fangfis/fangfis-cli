define('modules/addTitle', [
    'jquery'
], function (require) {
    'use strict';
    console.log('modules/addTitle');

    let util = {
        title: function (cls, txt) {
            $('body').prepend(`<h2 class="${cls}">${txt}</h2>`);
        },
        copyRight: function (txt) {
            $('body').append(`<p class="copyright">${txt}</p>`);
        },
        append: function (txt) {
            $('body').append(`<span>${txt}</span>`);
        }
    };
    return util;
});