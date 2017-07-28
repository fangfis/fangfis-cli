> 我们假设以下内容已经参考<a href="https://doc.brofen.cn/fangjs/#/configuration">配置</a>进行了相关配置。

## fang()

* **参数：** 

    * `{String | Array} 入口模块ID`
    * `{Function} 回调 [可选]`

* **功能：**

    `fang()` 接受的第一个参数为模块的 ID， 可以为一个字符串，或者是一个字符串组成的数组。Fang.js 会根据 `pageConfig.public` 取对应路径下的 JS 文件。该 API 可置于页面作为单入口 JS 的实现(推荐)，也可以当做一个引入其它 JS 文件的方法。

* **用法：**

    当参数为字符串时，取单个文件并执行。

    ```javascript
    fang('entry/entry_demo', function () {
        console.log('entry_demo 执行完毕');
    });
    ```

    当参数为数组时，取多个文件并执行。
    ```javascript
    fang(['entry/entry_demo1','entry/entry_demo2'], function () {
        console.log('多个入口 执行完毕');
    });
    ```

## fang.config()

* **参数：** 

    * `{Object} 配置项`

* **功能：** `fang.config()` 接收的参数为对象，是对 `Fang.js` 进行配置的方法。

> 需要注意 2.3.1 版本推荐通过 pageConfig 传入配置，而 2.3.2 版本只能通过 `fang.config()` 进行配置。除了 `img_ver` 变成 `ver` 以及 `public` 变成 `base` 以外，其它配置项的键名不变。参考[配置项](/configuration)

* **用法：**

```javascript
fangjs.config({
    // Fang.js 模块的基础路径，如果没设置，则取 pageConfig.public 的值
    base: '//doc.brofen.cn/fangjs/demo/',
    
    // 2.3.2时
    ver: '2017071501'

    // 别名配置
    // 给模块设置别名以后，再次引入依赖时就可以通过别名来代替路径
    alias: {
        jquery: 'jquery',
        util: 'plugins/util'
    },

    // 路径配置
    // 和别名类似，只是一般用来存放通过第三方链接调用的模块
    paths: {
        webim: 'http://js.soufunimg.com/upload/webim/im2'
    },

    // 变量配置
    // 一个 Fang.js 模块内随时可以取到的全局变量
    vars: pageConfig,

    // 文件编码。获取模块文件时，<script> 或 <link> 标签的 charset 属性。 默认是 utf-8
    charset: 'utf-8',

    // 调试模式。默认为 false 。值为 true 时，加载器不会删除动态插入的 script 标签。
    debug: false,
});
```

## define()

* **参数：**

    * `{String} 模块ID [可选]`
    * `{Array} 依赖项 [可选]`
    * `{Function} 回调`

* **功能：** `define`用来定义模块，可接收3个参数，其中前2个为可选参数，第三个为模块的执行代码。

* **用法：**

我们可以直接定义一个模块，例如`define-demo-01.js`：
```javascript
// define-demo-01.js
define(function (require, exports, module) {
    console.log('define-demo-01');
})
```

如果模块有依赖，例如`define-demo-02.js`，代码执行后会在 network 里看到浏览器在加载完`define-demo-02.js`以后还发出了`a.js`和`b.js`的请求：
```javascript
// define-demo-02.js
define(['a','b'], function (require, exports, module) {
    console.log('define-demo-02');
})
```

而一个完整定义的模块，也是我们所推荐的写法，如下所示：

**首先定义依赖模块dep_a.js和dep_b.js**
```javascript
// dep_a.js
define('dep_a', [], function (require, exports, module) {
    console.log('dep_a');
})
```

```javascript
// dep_b.js
define('dep_b', [], function (require, exports, module) {
    console.log('dep_b');
})
```

**接着定义入口文件entry_01.js**
```javascript
// entry_01.js
define('entry_01', ['dep_a.js', 'dep_b.js'], function (require, exports, module) {
    console.log('entry_01');
    require('dep_b');
    require('dep_a');
})
```
以上我们定义了一个入口模块 entry_01 和两个依赖模块 dep_a 和 dep_b ，他们彼此都是一个完整定义的模块，只是 entry_01 依赖了 dep_a 和 dep_b 。此时我们在HTML里去执行`fang('entry_01')`时会发现network里加载了 entry_01 以后，又先后加载了 dep_a 和 dep_b ，但是console里先输出了 dep_b 再输出 dep_a ，这是由 `require()` 的执行顺序决定的。

> 注意：如果引入的依赖是一个定义的模块，则需要 require 以后才会执行。而如果引入的依赖是一个正常书写的 JS ，则会直接执行。

## require()

* **参数：**

    * `String | Array`

* **功能：** `require()`接受的参数可以为一个字符串，或者是一个字符串组成的数组。

* **用法：**

```javascript
define('entry_01', ['dep_a.js', 'dep_b.js'], function (require, exports, module) {
    console.log('entry_01');
    // 以下require
    require('dep_b');
    require('dep_a');
    // 等同于
    require(['dep_a', 'dep_b']);

    // 需要注意的是，当我们使用 require([]) 去引用多个数组时，无法接受依赖里的返回值。
})
```

## require.async()

* **参数：**

    * `{String} id`
    * `{Function} 回调 [可选]`

* **功能：** `require.async()`用来异步引入模块，接收2个参数，第一个为模块的 id 或者 url ，第2个为模块引入后的回调。

* **用法：**

```javascript
define('entry_02', [], function (require, exports, module) {
    console.log('entry_02');
    require.async('dep_b', function () {
        console.log('dep_b load done');
    });
    require.async('//dev.brofen.cn/XPlayer/dist/XPlayer.js', function () {
        var XPlayer = require('XPlayer');
        console.log('XPlayer load done');
        var player = new XPlayer({
            element: document.querySelector('#v'),
            video: {
                url: 'http://106.38.250.142/xdispatch/7xp6cu.dl1.z0.glb.clouddn.com/360.mp4',
                pic: 'http://7xih9g.com1.z0.glb.clouddn.com/countdown-clock.png'
            }
        });
    });
})
```

> 注意：require.async只是发起对模块的请求，请求完成后执行callback。而如果出现模块不存在的情况（如url错误请求返回404），callback依旧会执行，因此callback的逻辑需要自行保证。

## exports

* **功能：** `exports`用来在模块内部对外提供接口。

* **用法：** 

```javascript
define('component/loadingToast', function(require, exports) {

    // 对外提供 name 属性
    exports.name = 'loadingToast';

    // 对外提供 showLoading 方法
    exports.showLoading = function() {};

    // 对外提供 showLoading 方法
    exports.hideLoading = function() {};

});
```

## module.exports

* **参数：**

    * `{Object} 对外提供的方法`

* **功能：** `exports`用来在模块内部对外提供接口。

* **用法：** 

```javascript
define('component/loadingToast', function(require, exports, module) {

    // 对外提供接口
    module.exports = {
        name: 'loadingToast',
        showLoading: function() {},
        hideLoading: function() {}
    };

});
```

> 提示：在组件内使用`return`和`module.exports`效果一样，只是需要注意`return`会终止代码的执行。

## fang.on()

* **参数：**

    * `{String} 事件名称`

    * `{Function} 回调函数`

* **功能：** 和 jQuery 的 on 方法类似，用来全局监听某个事件，触发以后执行对应的回调函数。

* **用法**

```javascript
fang.on('newMsg', function () {
    console.log('newMsg event emitted');
});
fang.emit('newMsg');
```

## fang.off()

* **参数：**

    * `{String} 事件名称`

    * `{Function} 回调函数`

* **功能：** 和 jQuery 的 off 方法类似，用来取消监听某个事件或者它的回调。

* **用法**

```javascript
// 取消所有 newMsg 事件的监听
fang.off('newMsg');

// 取消某个事件的监听
function a() {
    console.log('a');
}

function b() {
    console.log('b');
}

fang.on('newMsg', a);
fang.on('newMsg', b);

fang.off('newMsg', b);

fang.emit('newMsg');
```

## fang.emit()

* **参数：**

    * `{String} 要触发的事件名`

    * `传递给事件的参数，可以为任何有效的数据类型`

* **功能：** 手动触发全局事件

* **用法：**

```
function testEv(param) {
    console.log(param);
}

fang.on('newMsg', testEv)

fang.emit('newMsg', {text1: 'hello', text2: 'fang'});
```





























