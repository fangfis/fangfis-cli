/**
 * util 工具类
 * 源于原util 改用ES6语法并适当优化
 * @author tankunpeng(tankunpeng@fang.com)
 * @update
 */

(function (w, f) {
    'use strict';
    if (typeof define === 'function') {
        define('plugins/util', ['jquery'], function (require) {
            let $ = require('jquery');
            return f($);
        });
    } else if (typeof exports === 'object') {
        module.exports = f(w);
    } else {
        if (!w.jQuery) {
            console.error('jQuery undefined');
            return;
        }
        w.util = f(w.jQuery);
    }
})(window, function ($) {
    // 引入依赖
    let vars = fang.data;
    class Util {
        constructor() {

        }

        /**
         * 获取地址栏参数
         * @param key 无参数返回json对象
         * @returns {*}
         */
        static getQuery(key) {
            let queryStr = location.search.replace('?', '');
            let value = undefined;
            let json = {};

            if (queryStr) {
                let arr = queryStr.split('&');
                for (let i = 0, len = arr.length; i < len; i++) {
                    let arr2 = arr[i].split('=');
                    json[arr2[0]] = arr2[1];
                    if (arr2[0] === key) {
                        value = arr2[1];
                    }
                }
            }
            return key && typeof key === 'string' ? decodeURIComponent(value) : json;
        }

        /**
         * 获取地址栏参数
         * @param json json对象
         * @returns {*}
         */
        static setQuery(json) {
            let arr = [];
            for (let name in json) {
                if (json.hasOwnProperty(name)) {
                    let value = json[name];
                    let str = '';
                    if (typeof value === 'object') {
                        str = `${name}=${JSON.stringify(value)}`;
                    } else {
                        str = `${name}=${value}`;
                    }
                    arr.push(str);
                }
            }
            return arr.join('&');
        }

        /**
         * 页面滚动函数
         * @param obj
         */
        static topPosition(obj) {
            let $obj = $(obj);
            let p = $('#replyPostPosition');
            if ($obj === p) {
                $('.comBoxMain').hide();
            }
            if ($('#nav').is(':visible')) $('#nav').hide();
            let length = $obj.offset().top - 51;
            if (length) {
                $('body').animate({ scrollTop: length });
            }
            $('header').css({ position: 'fixed', width: '100%', top: '0', display: 'block' });
        }


        /**
         * 获取cookie
         * @param key
         * @returns {*}
         */
        static getCookie(key) {
            let arr, reg = new RegExp('(^| )' + key + '=([^;]*)(;|$)');
            if (arr = document.cookie.match(reg)) {
                let str;
                try {
                    str = decodeURIComponent(arr[2]);
                } catch (e) {
                    str = unescape(arr[2]);
                }
                return str;
            }
            return '';
        }

        /**
         * 设置cookie
         * @param key
         * @param value
         * @param iDay
         * @param domain
         */
        static setCookie(key, value, iDay, domain) {
            let domainStr = '';
            if (domain) {
                domainStr = `domain=${domain};`
            }
            if (iDay) {
                let oDate = new Date();
                oDate.setDate(oDate.getDate() + Number(iDay));
                document.cookie = `${key}=${encodeURIComponent(value)};path=/;${domain ? domainStr : ''}expires=${oDate.toGMTString()}`;
            } else {
                document.cookie = `${key}=${encodeURIComponent(value)};${domain ? domainStr : ''}path=/`;
            }
        }

        /**
         * 删除cookie
         * @param key
         */
        static delCookie(key) {
            Util.setCookie(key, 1, -1);
        };

        /**
         * @param {int} numbers 数字
         * @param {int} places 小数位
         * @param {string} symbols 货币符号
         * @param {string} thousand 千分位符号
         * @param {string} decimal 小数位符号
         * @param {string} math Math 方法，round|ceill|floor
         */
        static formatMoney(numbers, places, symbols, thousand, decimal, math) {
            numbers = numbers || 0;
            places = !isNaN(places = Math.abs(places)) ? places : 2;
            symbols = symbols !== undefined ? symbols : '';
            thousand = thousand || ',';
            decimal = decimal || '.';
            math = /round|ceil|floor/.test(math) ? math : 'ceil';

            let negative = numbers < 0 ? '-' : '',
                i = parseInt(numbers = Math[math](Math.abs(+numbers || 0)).toFixed(places), 10) + '',
                k = i.length,
                j = k > 3 ? k % 3 : 0;
            return symbols + negative + (j ? i.substr(0, j) + thousand : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousand) + (places ? decimal + Math.abs(numbers - i).toFixed(places).slice(2) : '');
        }

        /**
         * [throttle 函数节流]
         * @param  {Function} fn      [要执行的函数]
         * @param  {[type]}   delay   [延迟多久执行]
         * @param  {[type]}   atleast [至少多久执行一次]
         */
        static throttle(fn, delay, atleast) {
            let timer = null;
            let previous = null;
            return function () {
                let now = +new Date();
                if (!previous) previous = now;
                if (atleast && now - previous > atleast) {
                    fn();
                    // 重置上一次开始时间为本次结束时间
                    previous = now;
                    clearTimeout(timer);
                } else {
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        fn();
                        previous = null;
                    }, delay);
                }
            };
        }
    }

    // 暴露对应接口
    return Util;
});
