# 配置项

目前 Fang.js 提供 2.3.2 版本，提供了集成 jQuery 和未集成 jQuery 两个版本，引入方式非常简单。可以通过以下介绍进行了解：

## 2.3.2

该版本需要先引入fangjs以后再进行配置，开发者可根据页面的情况进行配置。

如下配置并引入 Fang.js 以后执行 `fang('入口文件')` ， Fang.js 会根据 `base` 的值到对应路径下加载代码。

例如以下代码就会加载入口文件 `http://doc.brofen.cn/fangjs/demo/static/js/entry/entry_demo.js?_2017071501` 。

* **未集成jQuery：**

```
http://static.soufunimg.com/common_m/pc_public/fangjs/build/fang2.3.2.js
```

* **集成jQuery：**

```
http://static.test.soufunimg.com/common_m/pc_public/fangjs/build/??fang2.3.2.js,jquery/jquery-3.js
```

参考以下代码：

```html
    <!-- 引入未集成jQuery的fangjs -->
    <script src="http://static.test.soufunimg.com/common_m/pc_public/fangjs/build/??fang2.3.2.js,jquery/jquery-3.js"></script>
    <script>
    fang.config({
        base: 'http://doc.brofen.cn/fangjs/demo/static/js/',
        ver: '2017071501'
    });
    fang('entry/entry_demo', function (a) {
        console.log(a);
    });
    </script>
```

## 更多

更多配置项请参考：[fang.config()](https://doc.brofen.cn/fangjs/#/api?id=fangconfig)