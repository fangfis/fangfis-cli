> FangFIS-CLI 是一套与 Fang.js 完善结合的自动化代码构建工具。

FangFIS-CLI 是一个基于 Gulp 的前端构建工具，根据房天下前端开发需求进行了相应的定制，支持 CSS 的压缩、JS 的 ES6 转 ES5、合并、压缩、混淆等功能，通过 FangFIS 结合 Fang.js，我们可以方便快速地处理前端静态资源文件，减少了多余的工作，提高开发效率和代码性能。

> 需要注意，本地开发的代码，必须先通过 FangFIS-CLI 进行构建才能发布到正式环境。

## 安装

FangFIS 基于 Node.js 和 Git，因此在开始安装之前，确保你的系统安装了 Node.js 和 Git 环境。(Nodejs >= 4.x, npm > 3.x, and Git)

```bash
$ npm install -g fangfis
```

## 使用

输入项目名称，默认为空即在当前文件夹下初始化.
```bash
$ fangfis init
```

![](https://ws3.sinaimg.cn/large/006tNc79ly1fhv65yfla1j307f012dfm.jpg)

该文件夹下不为空提示,可以选择继续,不会删除已有文件

![](https://ws1.sinaimg.cn/large/006tNc79ly1fhv6610msqj30p10b9t92.jpg)

构建完成后默认自动安装所需要的依赖模块,如果自动安装失败,请进入该目录,手动安装,推荐使用cnpm安装 参考地址: [cnpm](https://npm.taobao.org/)

```bash
$ npm install
or
$ cnpm install
```

初始化完成后的结构

![](https://ws2.sinaimg.cn/large/006tNc79ly1fhv663wedfj308q05cmx1.jpg)

注:

dev文件夹目前版本为构建工具预留目录,所有开发项目请在该目录下开发

### fangfis build

使用fangfis进行构建。

构建选项如下：

```bash
    -w, --watch           监听文件变化并自动构建
    -j, --js              压缩js文件到目标文件夹,入口文件`自动合并`所有依赖到目标文件夹,默认: static/js
    -a, --alljs           压缩所有js文件到目标目录,输入目录为`dev/js`,不可自定义,入口文件作为单文件压缩,`不合并`所有依赖, 输出目录可自定义,默认: static/js
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