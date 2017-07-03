/**
 * 通过邮箱.手机.用户名登录
 * Created by tankunpeng on 2017/05/05.
 * @Last Modified by:   tankunpeng
 * @Last Modified time:
 */
(function (w, f) {
    'use strict';
    if (typeof define === 'function') {
        define('plugins/passportLogin/passportLogin', ['jquery'], function (require) {
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
        w.passportLogin = f(w.jQuery);
    }
})(window, function ($) {
    'use strict';
    class PassportLogin {
        constructor() {
            this.options = {
                // 必填，且必须已注册的service
                service: 'soufun-passport-web',
                // 必填，用户名，可以传用户名、邮箱、手机；中文进行utf-8编码
                uid: '',
                // 必填，用户密码，必须是进行非对称加密后的密码
                pwd: '',
                // 用户输入的图文验证码，当用户错误次数大于等于5次的时候，可判断验证码。 （支持目前搜房帮登陆错误次数超过5次，即需要图文验证码验证的需求）
                vcode: '',
                // jsonp回调函数名称，jsonp方式，不能为空
                callback: 'callback',
                // 用户是否选择自动登录（传1：表示用户选择自动登录，sfut成功登录的cookie值保存1个月；如果传非1，则不长时间保存用户的登录状态，进程内cookie）
                autologin: '1'
            };
            // 登录接口
            this.loginUrl = 'https://passport.fang.com/login.api';
            this.init();
        }

        /**
         * 初始化操作
         */
        init() {

        }


        /**
         * 改变自动提交的值
         * @param type
         */
        setAutoLogin(type = true) {
            if (typeof type !== 'boolean') {
                alert('请传入boolean');
                return;
            }
            this.options.autologin = type ? '1' : '0';
        }

        /**
         * 登录校验
         * @param uid 用户名
         * @param pwd 密码
         * @param vcode 图文验证码
         * @param res 成功回调
         * @param rej 失败回调
         * @returns {Promise}
         */
        login(uid, pwd, vcode = '', res, rej) {
            return new Promise((resolve, reject) => {
                let that = this;
                // 覆盖原数据
                Object.assign(that.options, {
                    uid: uid,
                    pwd: pwd,
                    vcode: vcode
                });
                $.ajax({
                    type: 'post',
                    async: false,
                    url: that.loginUrl,
                    data: that.options,
                    dataType: 'jsonp',
                    jsonp: that.options.callback,
                    success: function (json) {
                        console.log(json);
                        let n = json.LoginErrorCount,
                            msg = json.Message,
                            tip = json.Tip;
                        if (msg === 'Success') {
                            res ? res(json) : resolve(json);
                        } else if (rej) {
                            rej(tip);
                        }else if (n > 4 && /验证码/.test(tip)){
                            that.showImgCode(uid, pwd, resolve, reject);
                        }else {
                            reject(tip);
                        }

                    },
                    error: function () {
                        reject('请求发送失败');
                    }
                });
            });
        }

        /**
         * 显示图文验证码
         * @param uid 用户名
         * @param pwd 密码
         * @param resolve 成功回调
         * @param reject 失败回调
         */
        showImgCode(uid, pwd, resolve, reject) {
            let that = this;
            let imgCodeBox = $('#imgCodeBox');
            that.imgCodeBox = imgCodeBox;
            if (imgCodeBox.length < 1) {
                let elelmentFlog = $('<div id="imgCodeBox"></div>'),
                    elementOut = $('<div></div>'),
                    elementTitle = $('<h3>请输入验证码</h3>'),
                    elementCon = $('<div></div>'),
                    elementImg = $('<img>'),
                    elementInputText = $('<input type="text">'),
                    elementSubmit = $('<div></div>'),
                    elementA = $('<a>确定</a>');
                that.imgCodeBox = elelmentFlog;
                that.img = elementImg;
                that.input = elementInputText;
                elelmentFlog.css({
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0,0,0,.8)',
                    position: 'fixed',
                    left: '0',
                    top: '0',
                    'z-index': '11000'
                });
                elementOut.css({
                    position: 'fixed',
                    zIndex: '11000',
                    width: '300px',
                    height: '200px',
                    left: '50%',
                    top: '50%',
                    marginLeft: '-150px',
                    marginTop: '-100px',
                    background: '#fff',
                    overflow: 'hidden'
                });
                elementTitle.css({
                    height: '36px',
                    'text-align': 'center',
                    'font-weight': 'bold',
                    'font-size': '18px',
                    'border-bottom': '3px double #B4B6BD',
                    background: '#E83B3C',
                    'line-height': '36px',
                    color: '#fff'
                });
                elementCon.css({
                    width: '100%',
                    height: '80px',
                    'margin-top': '10px'
                });
                elementImg.css({
                    width: '50%',
                    'max-height': '100%',
                    'margin-left': '2%',
                    float: 'left'
                });
                elementInputText.css({
                    border: '1px solid #ccc',
                    width: '40%',
                    height: '50px',
                    'margin-left': '5%',
                    outline: 'none',
                    'font-size': '16px',
                    'line-height': '50px',
                    float: 'left'
                });
                elementSubmit.css({
                    width: '60%',
                    margin: '10px auto',
                    height: '40px'
                });
                elementA.css({
                    display: 'block',
                    margin: '0 8px',
                    'font-size': '16px',
                    'line-height': '34px',
                    'text-align': 'center',
                    color: '#fff',
                    'border-radius': '4px',
                    '-webkit-border-radius': '4px',
                    height: '34px',
                    'background-color': '#e83b3c'
                });

                let src = that.getImgCodeSrc();
                elementImg.attr('src', src);
                // 确认发送验证码
                elementSubmit.on('click', function () {
                    // 图文验证码逻辑处理
                    that.imgCodeBox.hide();
                    that.login(uid, pwd, elementInputText.val().trim(), resolve, reject);

                });
                // 点击更换验证码
                elementImg.on('click', function () {
                    src = that.getImgCodeSrc();
                    $(this).attr('src', src);
                });

                elementCon.append(elementImg);
                elementCon.append(elementInputText);
                elementSubmit.append(elementA);
                elementOut.append(elementTitle);
                elementOut.append(elementCon);
                elementOut.append(elementSubmit);
                elelmentFlog.append(elementOut);
                $(document.body).append(elelmentFlog);
            } else {
                that.imgcodeRefresh();
                that.imgCodeBox.show();
            }
        }


        /**
         * 获取图文验证码图片地址
         * @returns {string}
         */
        getImgCodeSrc() {
            // 图文验证码图片
            let time = Date.now(),
                imgSrc = '';
            if (time % 2) {
                imgSrc = '//captcha.fang.com/Display?type=soufangbang&width=100&height=32&r=' + time;
            } else {
                imgSrc = '//captcha.fang.com/Display?r=' + time;
            }
            return imgSrc;
        }


        /**
         * 刷新图文验证码
         */
        imgcodeRefresh() {
            let that = this;
            if (that.img && that.input) {
                that.img.attr('src', that.getImgCodeSrc());
                that.input.val('');
            }
        }
    }
    return new PassportLogin();
});