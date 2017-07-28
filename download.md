
> * 我们推荐以[相对协议](https://en.wikipedia.org/wiki/Wikipedia:Protocol-relative_URL)的方式调用 JS，这样浏览器会根据当前页面的协议获取对应协议的 静态资源文件。

> * 如果是公司项目，我们推荐你直接使用下面提供的地址，因为该域名为 CDN 域名，能为不同地域的用户提供较为理想的连接速度。

## 2.3.2

```
不集成 jQuery
//static.soufunimg.com/common_m/pc_public/fangjs/build/fang2.3.2.js

集成 jQuery 大版本为 1 的最新版（1.12.4）
//static.soufunimg.com/common_m/pc_public/fangjs/build/??fang2.3.2.js,jquery/jquery-1.js

集成 jQuery 大版本为 2 的最新版（2.2.4）
//static.soufunimg.com/common_m/pc_public/fangjs/build/??fang2.3.2.js,jquery/jquery-2.js

集成 jQuery 大版本为 3 的最新版（3.2.1）
//static.soufunimg.com/common_m/pc_public/fangjs/build/??fang2.3.2.js,jquery/jquery-3.js
```

> 以上集成的 jQuery 版本截至2017年7月，若未来 jQuery 官方有更新，会及时跟进。

> 小提示：前端大部分框架与类库的版本号都有3位，可以理解为大、中、小三个等级。最右侧小版本号升级时一般是修复BUG，中间版本一般指加入新功能，而左侧的版本号一般是在大版本升级时变动，比如移除了一些旧的API，有时候会破坏向后兼容性。