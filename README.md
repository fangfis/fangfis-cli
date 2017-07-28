# fangfis-cli
fang.com 前端构建工具

> 前端构建工具使用pc+wap.

前提条件: [Node.js](https://nodejs.org/en/) (>=4.x, 6.x), npm 版本 3+ .

### Installation

``` bash
$ npm install -g fangfis-cli

```

### Usage

``` bash
$ fangfis init
```

> 输入项目名称,默认为空即在当前文件夹下初始化.

![](https://ws4.sinaimg.cn/large/006tKfTcly1fhrmfcug6mj307f012mwy.jpg)


> 该文件夹下不为空提示,可以选择继续,不会删除已有文件

![](https://ws1.sinaimg.cn/large/006tKfTcly1fhrmjshtbqj30p10b90t5.jpg)


> 构建完成后默认自动安装所需要的依赖模块,如果自动安装失败,请进入该目录,手动安装,推荐使用`cnpm`安装 参考地址: [cnpm](https://npm.taobao.org/)

``` bash
$ npm install
or
$ cnpm install
```
> 初始化完成后的结构

![](https://ws2.sinaimg.cn/large/006tKfTcly1fhrmsh929ij308q05c0sm.jpg)

注:

*dev文件夹目前版本为构建工具预留目录,所有开发项目请在该目录下开发*

### fangfis build

使用fangfis进行构建.

构建选项如下:

``` bash
    -w, --watch           监听文件变化并自动构建
    -j, --js              压缩js文件到目标文件夹,入口文件`自动合并`所有依赖到目标文件夹,默认: static/js
    -a, --alljs           压缩所有js文件到目标目录,输入目录为`dev/js`,不可自定义,入口文件作为单文件压缩,`不合并`所有依赖, 输出目录可自定义,默认: static/js
    -c, --css             压缩所有css文件到目标目录,输入目录为`dev/css`,不可自定义,输出目录可自定义,默认: static/css
    -i, --img             拷贝所有img文件到目标目录,输入目录为`dev/images`,不可自定义,输出目录可自定义,默认: static/imgages
    -o, --output [value]  自定义输入目录,可自定义到一级,默认: ./static
    -m, --main [value]    自定义入口文件,只能传入正则表达式,默认: /^entry_.*\.js$/i
    -h, --help            帮助信息
```

例子:

``` bash
$ fangfis b -o ./test1 -cjiw
or
$ fangfis build -o ./test1 -c -j -i -w
```
**建议使用默认输出目录**


### License

[MIT](http://opensource.org/licenses/MIT)


