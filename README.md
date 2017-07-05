# fangfis
fang.com PC project framework
> A simple CLI for fang.com PC project.

### Installation

Prerequisites: [Node.js](https://nodejs.org/en/) (>=4.x, 6.x preferred), npm version 3+ and [Git](https://git-scm.com/).

``` bash
$ npm install -g fangfis-cli
```

### Usage

``` bash
$ fangfis init [-n]
```

Example:

``` bash
$ fangfis init
```

> pay attention: If you need to view the demo locally, please follow the steps below

1. Configure the local domain name `js.npm.com`;
2. Point the local domain name to the parent directory of the project;
3. Go to the project root and execute `npm install`;
4. In the project root directory execute `gulp`;
5. It is recommended to configure the local domain name to access the index.html file under the demo


If you do not need to generate the demo template `fangfis init`, you can append the `-n` parameter,The default build demo;

Example:

``` bash
$ fangfis init -n
```



### fangfis build

Use fangfis-cli as a zero-configuration development tool for your fang.com component.


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
