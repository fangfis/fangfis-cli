/**
 * @Author: yangfan
 * @description: 动态加载 js 插件
 */
define('plugins/fangLazyLoader/fangLazyLoader', ['jquery'], function (require) {
    // 'use strict';

    let fang = window.fang;
    // jquery库
    let $ = require ? require('jquery') : window.jQuery;

    if (!fang) {
        fang = (src, callback) => {
            let script = document.createElement('script');
            script.charset = 'utf-8';
            script.src = src[0];
            let head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
            head.appendChild(script);
            callback && callback(script);
        };
    }

    let jqDoc = $(document),
        jqWin = $(window);

    class FangLazyLoader {
        constructor(options) {
            let settings = {
                selector: '.fang-lazy',
                // 阈值
                threshold: 0,
                // 找到 failure_limit 个不在可见区域的图片是才停止搜索
                failure_limit: 0,
                // 事件名
                event: 'scroll',
                // 默认绑定 evnet 的对象容器
                container: window,
                // 获取 src 的 data 属性，默认 data-attrbute
                data_attribute: 'fangJS',
                // 是否跳过不可见元素
                skip_invisible: false,
                // 回调事件，元素出现在视口中
                appear: null,
                // 触发 load 事件时执行的回调
                load: null,
                // 设置懒加载类型 默认为img  选项: 图片:img 入口文件:js iframe:iframe
                loadtype: 'img',
                placeholder: '//static.soufunimg.com/common_m/m_public/images/fang_placeholder.jpg',
                loading: '//static.soufunimg.com/common_m/m_public/images/fang_loading.gif'
            };

            if (typeof options === 'string') {
                settings.selector = options;
            } else {
                if (options.failurelimit) {
                    options.failure_limit = options.failurelimit;
                    delete options.failurelimit;
                }

                $.extend(settings, options);
            }

            this.container = settings.container === window ? jqWin : $(settings.container);
            this.elements = $(settings.selector);
            this.settings = settings;
            this.init();
        }

        /**
         * 初始化操作
         */
        init() {
            let that = this,
                settings = this.settings,
                container = this.container,
                elements = this.elements;
            // 如果事件名为 scroll 事件，为 container 绑定 scroll 事件
            if (0 === settings.event.indexOf('scroll')) {
                container.on(settings.event + '.fangLazyLoad', () => {
                    that.update();
                });
            }

            elements.each(function () {
                let self = this;
                let jqSelf = $(self);

                self.loaded = false;

                let fangsrc = jqSelf.attr('data-' + settings.data_attribute);

                /* Remove image from array so it is not looped next time. */
                let grepElements = (elements) => {
                    return $.grep(elements, (element) => {
                        return !element.loaded;
                    });
                };

                let loadSrc;
                if (/iframe|img/.test(settings.loadtype)) {
                    if (!jqSelf.attr('src')) {
                        // img类型预加载为默认图片
                        if (jqSelf.is('img')) {
                            jqSelf.attr('src', settings.placeholder);
                        } else if (jqSelf.is('iframe')) {
                            self.loadingEle = $('<div class="iframeloading"></div>');
                            self.loadingImg = $('<img class="iframeloadingimg">');
                            self.loadingEle.append(self.loadingImg);
                            let width = jqSelf.width(),
                                height = jqSelf.height();
                            jqSelf.parent().css('position', 'relative');
                            self.loadingEle.css({
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                width: width,
                                height: height
                            });
                            self.loadingImg.attr('src',settings.loading).css({
                                position: 'absolute',
                                left: parseInt(width / 2) - 92,
                                top: parseInt(height / 2) - 44,
                                width: 184,
                                height: 87
                            });
                            jqSelf.after(self.loadingEle);
                        }
                    }

                    loadSrc = () => {
                        jqSelf.attr('src', fangsrc);
                        jqSelf.on('load', function () {
                            self.loaded = true;
                            elements = $(grepElements(elements));
                            if (self.loadingEle) {
                                self.loadingEle.remove();
                            }
                            if (settings.load) {
                                let elements_left = elements.length;
                                settings.load.call(self, elements_left, settings);
                            }
                        });
                    };
                } else if (/js/.test(settings.loadtype)) {
                    loadSrc = () => {
                        fang([fangsrc], (m) => {
                            m && m.init && m.init();
                            self.loaded = true;
                            elements = $(grepElements(elements));
                            if (settings.load) {
                                let elements_left = elements.length;
                                settings.load.call(self, elements_left, settings);
                            }
                        });
                    };
                } else {
                    loadSrc = () => {
                    };
                }

                jqSelf.one('appear.fangLazyLoad', () => {
                    if (!self.loaded) {
                        if (settings.appear) {
                            let elements_left = elements.length;
                            settings.appear.call(self, elements_left, settings);
                        }
                        loadSrc();
                    }
                });

                // 如果不是默认的 scroll 事件时, 为每个元素绑定事件
                if (0 !== settings.event.indexOf('scroll')) {
                    jqSelf.on(settings.event + '.fangLazyLoad', () => {
                        if (!self.loaded) {
                            jqSelf.trigger('appear.fangLazyLoad');
                        }
                    });
                }
            });

            jqWin.on('resize.fangLazyLoad', function () {
                that.update();
            });

            jqDoc.ready(function () {
                that.update();
            });
        }

        update() {
            let counter = 0,
                settings = this.settings;

            this.elements.each(function () {
                let jqThis = $(this);
                // 如果隐藏，且忽略隐藏，则中断循环
                if (settings.skip_invisible && !jqThis.is(':visible')) {
                    return;
                }
                // 不满足在上方，左方；也不满足在下方，右方； 则触发 appear 事件
                if ($.abovethetop(this, settings) || $.leftofbegin(this, settings)) {
                    // console.log('Nothing');
                } else if (!$.belowthefold(this, settings) && !$.rightoffold(this, settings)) {
                    jqThis.trigger('appear');
                    counter = 0;
                } else {
                    // 如果找到的是第（failure_limit + 1）个元素，且不在container视口上方，左方及视口内（可以允许在视口下方，右方），则中断循环
                    if (++counter > settings.failure_limit) {
                        return false;
                    }
                }
            });
        }
    }

    /* Convenience methods in jQuery namespace.           */
    /* Use as  $.belowthefold(element, {threshold : 100, container : window}) */
    // 在视口下方
    $.belowthefold = function (element, settings) {
        let fold;

        if (settings.container === undefined || settings.container === window) {
            fold = (window.innerHeight ? window.innerHeight : jqWin.height()) + jqWin.scrollTop();
        } else {
            fold = $(settings.container).offset().top + $(settings.container).height();
        }

        return fold <= $(element).offset().top - settings.threshold;
    };
    // 在视口右方
    $.rightoffold = function (element, settings) {
        let fold;

        if (settings.container === undefined || settings.container === window) {
            fold = jqWin.width() + jqWin.scrollLeft();
        } else {
            fold = $(settings.container).offset().left + $(settings.container).width();
        }

        return fold <= $(element).offset().left - settings.threshold;
    };
    // 在视口上方
    $.abovethetop = function (element, settings) {
        let fold;

        if (settings.container === undefined || settings.container === window) {
            fold = jqWin.scrollTop();
        } else {
            fold = $(settings.container).offset().top;
        }

        return fold >= $(element).offset().top + settings.threshold + $(element).height();
    };
    // 在视口左方
    $.leftofbegin = function (element, settings) {
        let fold;

        if (settings.container === undefined || settings.container === window) {
            fold = jqWin.scrollLeft();
        } else {
            fold = $(settings.container).offset().left;
        }

        return fold >= $(element).offset().left + settings.threshold + $(element).width();
    };

    $.inviewport = function (element, settings) {
        return !$.rightoffold(element, settings)
            && !$.leftofbegin(element, settings)
            && !$.belowthefold(element, settings)
            && !$.abovethetop(element, settings);
    };

    /* Custom selectors for your convenience.   */
    /* Use as $('img:below-the-fold').something() or */
    /* $('img').filter(':below-the-fold').something() which is faster */
    $.extend($.expr[':'], {
        'below-the-fold': function (el) {
            return $.belowthefold(el, {
                threshold: 0
            });
        },
        'above-the-top': function (el) {
            return !$.belowthefold(el, {
                threshold: 0
            });
        },
        'right-of-screen': function (el) {
            return $.rightoffold(el, {
                threshold: 0
            });
        },
        'left-of-screen': function (el) {
            return !$.rightoffold(el, {
                threshold: 0
            });
        },
        'in-viewport': function (el) {
            return $.inviewport(el, {
                threshold: 0
            });
        },
        /* Maintain BC for couple of versions. */
        'above-the-fold': function (el) {
            return !$.belowthefold(el, {
                threshold: 0
            });
        },
        'right-of-fold': function (el) {
            return $.rightoffold(el, {
                threshold: 0
            });
        },
        'left-of-fold': function (el) {
            return !$.rightoffold(el, {
                threshold: 0
            });
        }
    });

    return FangLazyLoader;
});

