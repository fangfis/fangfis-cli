**在上一节中我们已经尝试着开发了一个[Demo](http://doc.brofen.cn/fangjs/demo/)，[源代码](http://git.brofen.cn/fenglinzeng/FangJS/)**

## 预览

<img src="https://ws2.sinaimg.cn/large/006tNc79ly1fhv5n5wc9mj30m50ffq33.jpg" style="box-shadow: 0 2px 6px rgba(0,0,0,.2)">

## 文件结构

```
├── dev                              // 开发目录
│   ├── css
│   │   └── style.css               // 样式
│   ├── images
│   └── js
│       ├── entry
│       │   └── entry_demo.js       // 入口文件
│       └── modules
│           └── addTitle.js         // 一些功能模块
└── index.html                      // 页面文件
├── package.json
└── static                          // 生产目录
    ├── css
    │   └── style.css
    └── js
        ├── entry
        │   └── entry_demo.js
        ├── maps
        │   ├── entry
        │   │   └── entry_demo.js.map
        │   └── modules
        │       └── addTitle.js.map
        └── modules
            └── addTitle.js
```

## 功能点

**这个 Demo 主要有如下几个功能点：**

1.页面加载完成后插入标题`房天下 HTML5 视频播放器`和版权页脚`房天下前端 @ 2017`。[entry_demo.js#L13](http://git.brofen.cn/fenglinzeng/FangJS/src/master/demo/dev/js/entry/entry_demo.js#L13)

2.点击按钮时异步载入视频播放器并执行播放器的初始化。[entry_demo.js#L22](http://git.brofen.cn/fenglinzeng/FangJS/src/master/demo/dev/js/entry/entry_demo.js#L22)

3.播放器的播放、暂停和播放时，都会输出对应的状态插入到页面里。[entry_demo.js#L57](http://git.brofen.cn/fenglinzeng/FangJS/src/master/demo/dev/js/entry/entry_demo.js#L57)

## 关键实现
**下面来介绍关键代码实现**

1.引入fang.js。[index.html#L52](http://git.brofen.cn/fenglinzeng/FangJS/src/master/demo/index.html#L52)

2.声明 `puclic` 资源文件路径与 `img_ver` 版本号。[index.html#L47](http://git.brofen.cn/fenglinzeng/FangJS/src/master/demo/index.html#L47)

3.通过`fang()`调用页面入口文件。[index.html#L55](http://git.brofen.cn/fenglinzeng/FangJS/src/master/demo/index.html#L55)

4.入口文件中声明的模块名必须与调用时一致，否则不会执行。例如`Demo`中的`entry/entry_demo`。[index.html#L55](http://git.brofen.cn/fenglinzeng/FangJS/src/master/demo/index.html#L55)应该与[entry_demo.js#L6](http://git.brofen.cn/fenglinzeng/FangJS/src/master/demo/dev/js/entry/entry_demo.js#L6)一致。

5.根据需要引入相对应的模块并执行。[entry_demo.js#L13](http://git.brofen.cn/fenglinzeng/FangJS/src/master/demo/dev/js/entry/entry_demo.js#L13)。

6.需要注意的是，正常通过require引入的依赖，需要在头部依赖列表里进行声明，否则无法正确获取到依赖。[entry_demo.js#L8](http://git.brofen.cn/fenglinzeng/FangJS/src/master/demo/dev/js/entry/entry_demo.js#L8)
