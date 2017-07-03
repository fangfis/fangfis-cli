/**
 * @Author: fenglinzeng@fang.com
 * @description: modal弹框 js 插件
 * @usage:
 * 1.let modal = require('plugins/modal/modal');
 * 2.modal.alert('标题','内容',function () {})
 * 或者
 * modal.alert('内容',function () {})
 *
 * tips:
 * modal.alert = $.alert()
 */

define('plugins/modal/modal', ['jquery'], function (require) {
    let $ = require ? require('jquery') : window.jQuery || {};

    class Modal {
        constructor() {
            this.defaults = {
                // 显示标题
                title: '提示',
                // 显示内容
                text: '',
                // toast时间
                duration: 2000
            };
            this.init();
        }

        /**
         * 初始化操作
         */
        init() {
            $.alert = this.alert.bind(this);
            $.closeAlert = this.closeAlert.bind(this);
            $.toast = this.toast.bind(this);
        }

        alert(title, text, onOk) {
            let that = this;
            let defaults = that.defaults;
            if (typeof text === 'undefined' || typeof text === 'function') {
                defaults.text = title;
                onOk = text;
            }
            if (that.alertBox && that.alertBox.length) {
                that.alertTitle.html(defaults.title);
                that.alertText.html(defaults.text);
                that.alertBox.show().find('.alert').hide().fadeIn();
            } else {
                let tpl = `
                    <div class="alert-box modal-alert" style="display:none;">
                        <div class="alert dpts_wrap">
                            <h3 class="h">${defaults.title}</h3>
                            <div  class="dp_ts">${defaults.text}</div>
                            <div class="bottom">
                                <div class="btn2 downBtn okBtn">确定</div>
                            </div>
                        </div>
                    </div>
                `;
                that.alertBox = $(tpl);
                that.alertTitle = that.alertBox.find('h3');
                that.alertText = that.alertBox.find('.dp_ts');

                that.alertBox.appendTo('body').show().find('.alert').hide().fadeIn();
                that.alertBox.find('.okBtn').on('click', function () {
                    that.closeAlert();
                    onOk && onOk();
                });
            }
        }

        /**
         * 关闭弹层
         */
        closeAlert() {
            let that = this;
            that.alertBox.fadeOut();
        }

        /**
         * 模拟show
         * @param html
         */
        showToast(html) {
            let tpl = '<div class="fang-toast">' + html + '</div>';
            let dialog = $(tpl).appendTo(document.body);
            dialog.fadeIn();
        }

        hideToast(callback) {
            let toast = $('.fang-toast');
            toast.remove();
            callback && callback(toast);
        }

        /**
         * 模拟show
         * @param text
         * @param css
         * @param callback
         */
        toast(text, css, callback) {
            let that = this;
            let pHtml = '<p class="fang-toast-content">' + (text || '已经完成') + '</p>';
            if (typeof css === 'function') {
                callback = css;
            } else if (css) {
                pHtml = '<p class="fang-toast-content" style="' + css + '">' + (text || '已经完成') + '</p>';
            }
            that.showToast(pHtml);
            setTimeout(function () {
                that.hideToast(callback);
            }, that.defaults.duration);
        }
    }

    return new Modal();
});