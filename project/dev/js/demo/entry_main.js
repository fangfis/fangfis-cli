/**
 * @file demo入口
 * @author tankunpeng(tankunpeng@fang.com)
 * @update
 * Date: 2017/6/30
 * Time: 上午9:54
 */
define('demo/entry_main', ['jquery', 'util', 'demo/test'],function (require) {
    'use strict';
    var p = document.createElement('p');
    p.innerHTML = '我是入口文件';
    document.body.appendChild(p);
    /**
     * 同步加载 gulp操作时会自动合并到入口
     * jquery 已合并到入口 不需要 单独加载
     */
    let [$, util] = require([
        'jquery',
        'util',
        'demo/test'
    ]);

    /**
     * 异步加载支持数组加载 服务器支持 同样会合并加载
     */
    require.async([
        'plugins/fangLazyLoader/fangLazyLoader' // 懒加载
    ]);

    /**
     * 异步加载同样支持单个文件加载 但是会单独加载
     */
    require.async(['demo/test3']);

    // 其他代码执行
    $(document.body).on('copy', function () {
        console.log('受保护的内容，暂不可复制');
        return false;
    });
});
