> FangFIS 基于 Node.js，因此在开始安装之前，确保你的系统安装了 Node.js 环境。（Nodejs >= 4.x, npm > 3.x）以下内容假设您的开发环境已经安装了 Node.js。[Nodejs官网](//nodejs.org)

## 安装FangFIS

在正式开始安装FangFIS之前，建议参考以下的小提示。

> 因为墙的原因，直接通过npm下载模块包的速度非常慢，因此`npm install`操作加上了`--registry`指向淘宝的镜像。我们强烈推荐安装使用cnpm，它是淘宝针对npm的镜像，可以用`cnpm install`来替代`npm install`操作。

```bash
npm install -g fangfis
// 由于墙的原因，我们建议走镜像进行安装
npm install -g fangfis --registry=https://registry.npm.taobao.org


// 当然如果你想使用 cnpm 的话
// 安装
npm install -g cnpm --registry=https://registry.npm.taobao.org
// 以后的大部分情况下就可以通过cnpm install 来取代 npm install 操作了
cnpm install -g fangfis
```

## 初始化项目

进入到想要创建项目的文件夹内，执行init操作
```bash
fangfis init
```

接着会让你输入项目名（文件夹名），如果不输入直接回车下一步，则项目文件夹为当前文件夹。

![](https://ws3.sinaimg.cn/large/006tNc79ly1fhv65yfla1j307f012dfm.jpg)

若文件夹下不为空则会弹出提示确认是否继续。（该操作不会影响已有文件）

![](https://ws1.sinaimg.cn/large/006tNc79ly1fhv6610msqj30p10b9t92.jpg)

初始化完成后默认会自动安装所需要的依赖模块，如果自动安装失败，请进入该目录手动安装。

```bash
npm install
// or
cnpm install
```

## 开始编码

此时项目文件夹下的项目结构大致如下：

```
├── dev
│   ├── css
│   ├── images
│   └── js
├── package.json
└── static
```

我们先创建一个`index.html`文件在项目根目录下

```
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
    <title>FangJS startup demo</title>
    <link rel="stylesheet" type="text/css" href="static/css/style.css">
</head>

<body>
    <div class="center">
        <button class="button" id="loadV">点我加载播放插件</button>
    </div>
    <div id="v" class="video"></div>
    <!-- 引入fangjs -->
    <script src="//static.soufunimg.com/common_m/pc_public/fangjs/build/??fang2.3.2.js,jquery/jquery-3.js"></script>
    <script>
    // 配置fang.js
    fang.config({
        base: '//doc.brofen.cn/fangjs/demo/static/js/',
        ver: '2017071501'
    });
    // 调用入口模块
    fang(['entry/entry_demo'], function () {
        console.log('entry_demo 执行完成');
    });
    </script>
</body>

</html>
```

然后在`dev/css`下创建一个`style.css`

```
.pageTitle {
    text-align: center;
}
.video {
    width: 500px;
    margin: 0 auto;
}
.center {
    text-align: center;
}
.button {
    border: 0;
    background-color: #08c;
    color: #fff;
    margin-bottom: 20px;
    outline: 0;
}
.copyright {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    margin: 0;
    text-align: right;
    color: #aaa;
}
```

继续在`dev/js/entry/`下创建一个`entry_demo.js`

```
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
            let videourl = http://106.38.250.142/xdispatch/7xp6cu.dl1.z0.glb.clouddn.com/360.mp4;
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
```

在`dev/js/modules/`下创建`addTitle.js`
```
// addTitle.js
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
```

## 构建编译

以上我们就完成了代码的编写，接下来在命令行运行如下命令，接着我们在浏览器打开`index.html`就能够看到一个如图所示的界面：

> 需要注意的是，之前我们编写设置`fang.config`时，`base`的值为`//doc.brofen.cn/fangjs/demo/static/js/`，因此，此时我们的js文件相对路径也为`//doc.brofen.cn/fangjs/demo/static/js/`。本demo的路径为`//doc.brofen.cn/fangjs/demo/`。[点此查看](http://doc.brofen.cn/fangjs/demo/)

> 当然，如果你打开本地的`index.html`也是正常的，因此静态资源文件的路径并没有错。具体可以查看浏览器开发者工具的`Network`一栏。

```
fangfis build -w
```

<img src="https://ws2.sinaimg.cn/large/006tNc79ly1fhv5n5wc9mj30m50ffq33.jpg" style="box-shadow: 0 2px 6px rgba(0,0,0,.2)">

## 项目结构

此时我们可以看见，项目目录下的文件夹变成了如下结构：
其中，我们之前编写的代码都在`dev`下，但是页面引用的文件都在`static`下，是因为前面我们执行的`fang build`操作将`dev`对应的代码都编译并压缩到了`static`下。

其中`static/js/maps`下的文件为`sourcemaps`生成的记录文件，因为原始代码进行了`ES6 => ES5`并进行了压缩，如果加入`maps`方便对压缩代码进行调试。生产环境可以不传`sourcemaps`文件。

```
├── dev
│   ├── css
│   │   └── style.css
│   ├── images
│   └── js
│       ├── entry
│       │   └── entry_demo.js
│       └── modules
│           └── addTitle.js
├── index.html
├── package.json
└── static
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

## 更多

以上便是一个简单的`Demo`例子。编写代码，编译，发布。此时线上的代码便是经过兼容编译和压缩过的`JS`和`CSS`。

相关FangFIS更多的使用方法，可以参考









