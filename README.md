> fangfis-cli 是一套与 fang.js 完善结合的自动化代码构建工具。

fangfis-cli 是一个基于 Node 的前端构建工具，根据房天下前端开发需求进行了相应的定制，支持 CSS 的压缩、JS 的 ES6 转 ES5、合并、压缩、混淆等功能，通过 FangFIS 结合 fang.js，我们可以方便快速地处理前端静态资源文件，减少了多余的工作，提高开发效率和代码性能。

> 需要注意，本地开发的代码，必须先通过 fangfis-cli 进行构建才能发布到正式环境1。

## 安装

fangfis-cli 基于 Node.js，因此在开始安装之前，确保你的系统安装了 Node.js 环境。(Nodejs >= 4.x, npm > 3.x)

```bash
$ npm install -g fangfis-cli
```

## 使用

输入项目名称，默认为空即在当前文件夹下初始化。
```bash
$ fangfis init
```

![](https://ws3.sinaimg.cn/large/006tNc79ly1fhv65yfla1j307f012dfm.jpg)

该文件夹下不为空提示，可以选择继续，不会删除已有文件。

![](https://ws4.sinaimg.cn/large/006tKfTcly1fj9k1qnrm6j30o007gmxj.jpg)

构建完成后默认自动安装所需要的依赖模块，如果自动安装失败，请进入该目录，手动安装，推荐使用cnpm安装 参考地址: [cnpm](https://npm.taobao.org/)

```bash
$ npm install
or
$ cnpm install
```

初始化完成后的结构


```
.
├── dev
│   ├── css
│   ├── images
│   └── js
├── fangfis.config.json
├── package-lock.json
├── package.json
└── static
5 directories, 3 files
```
注:

dev文件夹目前版本为构建工具预留目录，所有开发项目必须在该目录下开发，下面的css、js和images文件夹的名字不能更改。

### 构建配置

init自动生成默认配置文件fangfis.config.json,用户可以自定义配置选项以控制构建,配置结构如下:

```
{
    // 构建配置项
    "build": {
        // 自定义输入目录,相对路径,默认为dev 注: 自定义路径下需要有js,images,css文件夹
        "input": "./dev",
        // 自定义输出目录,默认为static
        "output": "./static",
        // 模块基本路径,构建工具会自动根据该基本路径进行寻找模块
        "base": "./dev/js",
        // 入口文件支持多种格式
        /* *main
            main,main2
            main,main2,ery*
            module/js/main
            module/js/main,module/js/main2
            module/js/main,module/js/main2,module/js/ery*
            main*
            *main
            main_*tool
        */
        "main": "main",
        // 模块合并配置项
        "combo": {
            // 忽略模块,默认jquery
            "ignore": [
                "jquery"
            ],
            // 需要额外处理的模块,格式同main
            "addMod": ["main2"],
            // fangjs配置
            "config": {
                "alias": {
                    "jquery": "jquery",
                    "util": "plugins/util"
                },
                "paths": {
                    "webim": "//js.soufunimg.com/upload/webim"
                }
            }
        }
    },
    // 上传ftp配置
    "upload": {
        // 默认配置
        "default": {
            // host
            "host": "localhost",
            // 用户名
            "user": "anonymous",
            // 密码
            "pass": "anonymous@",
            // 本地待上传目录
            "input": "./static",
            // ftp路径 相对于ftp根路径
            "output": "./static",
            // 端口
            "port": 21,
            // 连接超时时间 单位:分钟
            "idleTimeout": 100,
            // 最大连接数
            "maxConnections": 5
        },
        // 同default
        "online": {
            "host": "localhost",
            "user": "anonymous",
            "pass": "anonymous@",
            "input": "./static",
            "output": "./static",
            "port": 21,
            "idleTimeout": 100,
            "maxConnections": 5
        }
    }
}
```

### fangfis build

使用fangfis进行构建。

构建选项如下：

```bash
    -w, --watch           监听文件变化并自动构建
    -j, --js              压缩js文件到目标文件夹,入口文件`自动合并`所有依赖到目标文件夹,默认: static/js
    -c, --css             压缩所有css文件到目标目录,输入目录为`dev/css`,不可自定义,输出目录可自定义,默认: static/css
    -i, --img             拷贝所有img文件到目标目录,输入目录为`dev/images`,不可自定义,输出目录可自定义,默认: static/imgages
    -o, --output [value]  自定义输入目录,可自定义到一级,默认: ./static
    -m, --main [value]    自定义入口文件,只能传入正则表达式,默认: /^entry_.*\.js$/i
    -h, --help            帮助信息
```

例子：

```bash
$ fangfis b -o ./test1 -cjiw
or
$ fangfis build -o ./test1 -c -j -i -w
```

**建议使用默认输出目录**

### fangfis upload

使用fangfis 上传ftp

```bash
    -H, --host [value] FTP host, 默认为localhost
    -u, --user [value] FTP user, 默认为anonymous
    -p, --pass [value] FTP password, 默认为anonymous@
    -o, --output [value] FTP 上传目标路径,相对FTP根路径, 默认为./static
    -i, --input [value] FTP 上传源路径路径,相对本地路径, 默认为./static
    -t, --type [value] FTP连接类型,一般分为测试和正式. 默认为default
    -P, --port [value] FTP 端口, 默认为21
    -T, --idleTimeout [value] FTP连接超时时间, 默认100
    -m, --maxConnections [value] FTP最大连接数. 默认为5
```
