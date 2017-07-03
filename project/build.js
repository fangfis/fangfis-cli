({
    baseUrl: './dev/js',
    paths: {
        jquery: 'empty:',
        util: 'plugins/util'
    },
    name: 'detail/entry_main',
    //dir:'build',
    out: 'static/js/detail/entry_main.js',
    excludeShallow:['jquery'],
    // generateSourceMaps:true,
    optimize: 'none'
})