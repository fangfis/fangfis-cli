/**
 * Created by tankunpeng on 2016/03/31.
 * @Last Modified by:   tankunpeng
 * @Last Modified time: 2016/03/31
 */
define('plugins/smsLogin/smsLogin', ['jquery'], function (require) {
    let $ = require('jquery');
    let vars = fang.data;
    vars.url = vars.url || {};
    'use strict';
    class SmsLogin {
        constructor() {
            this.options = {
                // 必填，且必须已注册的service
                service: 'soufun-passport-web',
                // 用户手机号码
                mobilephone: '',
                // 图文验证码值
                mathcode: '',
                // jsonp回调函数名称，jsonp方式，不能为空
                callback: 'callback',
                // 发送验证码的类型（0：动态登录或注册；1：动态登录；2：注册）
                operatetype: '0',
                // 发送验证码的方式（0：文字短信验证码；1：语音电话验证码）
                sendvoice: '0'
            };
            // 发送验证码接口
            this.sendUrl = 'https://passport.fang.com/loginsendmsm.api';
            // 验证验证码
            this.verifyUrl = 'https://passport.fang.com/loginverifysms.api';
            // this.init();
        }

        /**
         * 初始化操作
         */
        init() {
            let that = this;
            // 获取元素
            that.imgCodeBox = $('#imgCodeBox');
            that.imgCodeInput = $('#imgCodeInput');
            that.imgCodeText = $('#imgCodeText');
            that.imgCodeBtn = $('#imgCodeBtn');
            if (!that.imgCodeBox || !that.imgCodeBox.length) {
                console.error('缺少图文验证码dom');
                return;
            }
            that.setImgCodeSrc();
            // 点击更换验证码
            that.imgCodeText.add(that.imgCodeBtn).on('click', function () {
                that.setImgCodeSrc();
            });
            that.inited = true;
        }

        /**
         * 发送验证码
         * @param mobilephone 手机号
         * @param mathcode 图文验证码
         */
        send(mobilephone,mathcode = '') {
            let that = this;
            // 覆盖原数据
            that.options.mobilephone = mobilephone;
            that.options.mathcode = mathcode;
            return new Promise((resolve,reject) => {
                $.ajax({
                    type: 'GET',
                    async: false,
                    cache: false,
                    url: that.sendUrl,
                    data: that.options,
                    dataType: 'jsonp',
                    jsonp: that.options.callback,
                    success: function (json) {
                        if (json.Message === 'Success') {
                            resolve(json);
                            that.hideImgCode();
                        } else if (json.IsSent === 'true') {
                            let str  = '手机上已有两条未验证验证码，不再发送验证码！';
                            reject(str);
                        } else if (json.IsShowMathCode === 'true') {
                            reject('请填写图文验证码');
                            // 需要图文验证码
                            if (!that.inited) {
                                that.init();
                            }
                            that.showImgCode();
                        } else {
                            reject(json.Tip);
                        }
                    },
                    error: function () {
                        let str = '请求发送失败';
                        reject(str);
                    }
                });
            });
        }

        /**
         * 验证码校验
         * @param mobilephone 手机号
         * @param mobilecode 手机验证码
         */
        check(mobilephone, mobilecode) {
            return new Promise((resolve,reject) => {
                let that = this;
                // 覆盖原数据
                that.options.mobilephone = mobilephone;
                that.options.mobilecode = mobilecode;
                $.ajax({
                    type: 'get',
                    async: false,
                    url: that.verifyUrl,
                    data: that.options,
                    dataType: 'jsonp',
                    jsonp: that.options.callback,
                    success: function (json) {
                        if (json.Message === 'Success') {
                            resolve('验证码验证通过');
                        } else {
                            reject(json.Tip);
                        }
                    },
                    error: function () {
                        reject('请求发送失败');
                    }
                });
            });
        }

        /**
         * 隐藏图文验证码
         */
        hideImgCode() {
            let that = this;
            if (that.imgCodeBox && that.imgCodeBox.length) {
                that.imgCodeInput.val('');
                that.imgCodeBox.hide();
            }

        }

        /**
         * 显示图文验证码
         */
        showImgCode() {
            let that = this;
            if (that.imgCodeBox && that.imgCodeBox.length) {
                that.imgCodeBox.show();
            }

        }

        /**
         * 获取图文验证码图片地址
         * @returns {string}
         */
        getImgCodeSrc() {
            // 图文验证码图片
            return vars.url.imgyz + '&r=' + Date.now();
        }

        /**
         * 设置图文验证码图片地址
         * @returns {string}
         */
        setImgCodeSrc() {
            let that = this;
            if (that.imgCodeText && that.imgCodeText.length) {
                that.imgCodeText.attr('src', that.getImgCodeSrc());
            }
        }

    }
    return new SmsLogin();
});