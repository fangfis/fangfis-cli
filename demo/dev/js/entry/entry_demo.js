define('entry/entry_demo', [
    'jquery',
    'modules/addTitle'
], function(require) {
    'use strict';
    console.log('demo_entry');
    let addTitle = require('modules/addTitle');
    addTitle.title('pageTitle', '房天下 HTML5 视频播放器');
    addTitle.copyRight('房天下前端 @ 2017');

    // 视频播放插件的异步调用
    $('#loadV').on('click', function () {
        // 加载播放器
        require.async('//static.test.soufunimg.com/common_m/pc_public/fangplayer/build/fangPlayer.js', function (fangPlayer) {
            // 视频地址
            let videourl = 'http://106.38.250.142/xdispatch/7xp6cu.dl1.z0.glb.clouddn.com/360.mp4';
            // 封面图
            let urlphoto = 'http://7xih9g.com1.z0.glb.clouddn.com/countdown-clock.png';
            // 视频id ，电商详情为空
            let playertype = 'html5';

            window.fangPlayer = new fangPlayer({
                // debug 模式，可选
                debug: true,
                // 插入播放器的DOM，必填
                holder: '#v',
                // html5视频封面图，可选
                poster: urlphoto,
                // html5视频播放地址，必填
                src: videourl,
                // 播放器类型
                type: playertype
            });
        })
    });
});