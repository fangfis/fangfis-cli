# fangfis
fang.com PC project framework
> A simple CLI for fang.com PC project.

### Installation

Prerequisites: [Node.js](https://nodejs.org/en/) (>=4.x, 6.x preferred), npm version 3+ and [Git](https://git-scm.com/).


``` bash
$ npm install -g fangfis

```

### Usage

``` bash
$ fangfis init
```

### fangfis build

Use fangfis as a zero-configuration development tool for your fang.com component.

Example:

``` bash
    fangfis bulid          Deal with the current project under dev folder all the files (css, img, js)
    fangfis bulid [-w] -w: Monitor the current project file changes and build them automatically
    fangfis bulid [-j] -j: Compressed JavaScript file (don\'t begin with entery_ JavaScript files)
    fangfis bulid [-c] -c: Compressed css file
    fangfis bulid [-i] -i: To copy images to the static files (not compressed)
```

> The actual development of the html entry file must be configured with the following information, otherwise it will lead to errors

~~This is our frame file that needs to be introduced first~~

Example:

``` javascript
    <script>
        var pageConfig = pageConfig || {};
        pageConfig.mainSite = '';
        // 设置域名到当前项目目录 例如 路径中的/fang/, 前面为实际父级路径
        // http://js.npm.com 是我本地配置的域名 路径指向当前项目文件夹父级目录
        pageConfig.public = 'http://js.npm.com/fang/';
        // js版本号
        pageConfig.img_ver = '20170630';
    </script>
    <script type="text/javascript" src="http://static.test.soufunimg.com/common_m/pc_public/fangjs/build/fang2.3.1.js"></script>
```

> Js entry file can be called like this

Example:

``` javascript
    <script>
        fang(['demo/entry_main']);
    </script>
```



### License

[MIT](http://opensource.org/licenses/MIT)
