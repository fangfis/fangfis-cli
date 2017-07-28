## Fang.js

> 一切皆模块，代码更清晰。

## 简介
Fang.js 是一个基于CMD模块化思想、致力于提供简单、极致的模块化开发体验、适用于 Web 浏览器端的模块加载器。使用 Fang.js，可以更好地组织 JavaScript 代码。它集成了最新版本的 jQuery（可选），在使用过程中，无需再额外加载。Fang.js 支持JS资源文件的动态合并加载、异步加载、按需加载和依赖管理。使用 Fang.js，可以更好地组织 JavaScript 代码。

查看[示例](quickstart.md)了解详情。

## 特性

Fang.js 追求简单、自然的代码书写和组织方式，无论是中小型站点，还是大型复杂应用，使用 Fang.js，都可以让我们的工作变得更轻松愉悦。Fang.js 具有以下核心特性：
- **简单友好的模块定义规范：**Fang.js 遵循 CMD 规范，可以像 Node.js 一般书写模块代码。
- **自然直观的代码组织方式：**简洁清晰的配置，依赖的自动加载、可以让我们更多地享受编码的乐趣。
- **依赖的自动管理：**只要按照指定的方式声明并引入模块，Fang.js 就会自动按照 JS 代码的执行顺序引入并加载对应的模块代码。
- **脚本的异步并行加载：**考虑到代码加载量和运行性能，Fang.js 还支持模块的异步并行加载。
- **友好的调试：**Fang.js 支持开发者根据开发需求自定义自动加载开发环境或者生产环境的代码，方便调试。

Fang.js 带来的最大好处是：提升代码的可维护性。上面的每一项特性，在使用文档中都会有详细阐述。如果一个站点的 JS 文件超过 3 个，就适合用 Fang.js 来组织和维护代码。涉及的 JS 文件越多，Fang.js 就越适合。

## 兼容性
集成 jQuery 1 的 2.3.2
```
Chrome 3+         ✔
Firefox 2+        ✔
Safari 3.2+       ✔
Opera 10+         ✔
IE 6+             ✔
```

2.3.1 和集成 jQuery 2 或 jQuery 3 的 2.3.2 
```
Desktop

- Chrome: (Current - 1) and Current   ✔
- Edge: (Current - 1) and Current     ✔
- Firefox: (Current - 1) and Current  ✔
- Internet Explorer: 9+               ✔
- Safari: (Current - 1) and Current   ✔
- Opera: Current                      ✔


Mobile

- Stock browser on Android 4.0+       ✔
- Safari on iOS 7+                    ✔
```

换句话说，Fang.js 的兼容性取决于集成的 jQuery 的兼容性。

Fang.js 可运行在 Mobile 端，包括 Hybrid 模式的 App 上。理论上，Fang.js 可以运行在任何浏览器引擎上。

## 例子

可以查看 [示例](quickstart.md) 来了解。