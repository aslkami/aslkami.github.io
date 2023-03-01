---
title: 基本流程
order: 1
---

###### 1. 初始化参数

从配置文件 和 shell 语句中读取并合并参数，并得到最终的配置文件

例如 `webpack --mode=development`, 会把这个命令与 配置文件的 `mode` 合并，假如配置文件的 `mode: 'production'`，最终呈现的是 命令的 `--mode=development`

###### 2. 初始化 `Compiler` 对象

###### 3. 加载所有的插件

###### 4. 执行 `Compiler` 对象的 `run` 方法开始执行编译

###### 5. 根据配置文件的 `entry` 配置找到所有的入口

###### 6. 从入口文件出发，调用所有的配置规则

例如执行 `loader` 相关配置对模块进行编译

###### 7. 找出此模块所有的依赖项，递归解析所有依赖模块进行编译

###### 8. 等所有模块编译完成后，再根据模块之间的依赖关系，组装成一个个包含多个模块的 `chunk 代码块`

###### 9. 把各个代码块 `chunk` 转换成 一个一个的 文件 (asset) 加入到输出列表

###### 10. 在确定好输出内容之后，会根据配置的输出路径和文件名，把文件内容写到文件系统里

> 再此编译过程中，webpack 会在合适的时间点广播特定的事件，你可以自己写插件监听感兴趣的事件，执行特写的逻辑

- webpack 内部自己实现了个 require 方法， 将所有模块存储到 map 对象里缓存起来， 键名是 文件路径，键值是 函数，里面返回到是 模块的返回值， 赋值在 `module.exports` 上

- import 原理：就是 发送个 JSONP ，下载 script 执行脚本，执行脚本的时候会把内容 合并到 modules 模块，合并之后就会 require 该模块，返回对应的值 传递到 then 里拿到

```js
//定义一个模块定义的对象
var modules = {};
//存放已经加载的模块的缓存
var cache = {};
//在浏览器里实现require方法
function require(moduleId) {
  var cachedModule = cache[moduleId];
  if (cachedModule !== undefined) {
    return cachedModule.exports;
  }
  var module = (cache[moduleId] = {
    exports: {},
  });
  modules[moduleId](module, module.exports, require);
  return module.exports;
}
require.d = (exports, definition) => {
  for (var key in definition) {
    Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
  }
};
require.r = (exports) => {
  Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
  Object.defineProperty(exports, '__esModule', { value: true });
};
//存放加载的代码块的状态
//key是代码块的名字
//0表示已经加载完成了
var installedChunks = {
  main: 0,
  //'hello': [resolve, reject,promise]
};
/**
 *
 * @param {*} chunkIds 代码块ID数组
 * @param {*} moreModules 额外的模块定义
 */
function webpackJsonpCallback([chunkIds, moreModules]) {
  const resolves = [];
  for (let i = 0; i < chunkIds.length; i++) {
    const chunkId = chunkIds[i];
    resolves.push(installedChunks[chunkId][0]);
    installedChunks[chunkId] = 0; //表示此代码块已经下载完毕
  }
  //合并模块定义到modules去
  for (const moduleId in moreModules) {
    modules[moduleId] = moreModules[moduleId];
  }
  //依次取出resolve方法并执行
  while (resolves.length) {
    resolves.shift()();
  }
}
//给require方法定义一个m属性，指向模块定义对象
require.m = modules;
require.f = {};
//返回此文件对应的访问路径
require.p = '';
//返回此代码块对应的文件名
require.u = function (chunkId) {
  return chunkId + '.main.js';
};
require.l = function (url) {
  let script = document.createElement('script');
  script.src = url;
  document.head.appendChild(script);
};
/**
 * 通过JSONP异步加载一个chunkId对应的代码块文件，其实就是hello.main.js
 * 会返回一个Promise
 * @param {*} chunkId 代码块ID
 * @param {*} promises promise数组
 */
require.f.j = function (chunkId, promises) {
  //当前的代码块的数据
  let installedChunkData;
  //创建一个promise
  const promise = new Promise((resolve, reject) => {
    installedChunkData = installedChunks[chunkId] = [resolve, reject];
  });
  installedChunkData[2] = promise;
  promises.push(promise);
  //promises.push(installedChunkData[2] = promise);
  const url = require.p + require.u(chunkId);
  require.l(url);
};
require.e = function (chunkId) {
  let promises = [];
  require.f.j(chunkId, promises);
  return Promise.all(promises);
};
var chunkLoadingGlobal = (window['webpack5'] = []);
chunkLoadingGlobal.push = webpackJsonpCallback;
/**
 * require.e异步加载hello代码块文件 hello.main.js
 * promise成功后会把 hello.main.js里面的代码定义合并到require.m对象上，也就是modules上
 * 调用require方法加载./src/hello.js模块，获取 模块的导出对象，进行打印
 */
require
  .e('hello')
  .then(require.bind(require, './src/hello.js'))
  .then((result) => {
    console.log(result);
  });
```

```js
(window['webpack5'] = window['webpack5'] || []).push([
  ['hello'],
  {
    './src/hello.js': (module, exports, __webpack_require__) => {
      'use strict';
      __webpack_require__.renderEsModule(exports);
      __webpack_require__.defineProperties(exports, {
        default: () => DEFAULT_EXPORT,
      });
      const DEFAULT_EXPORT = 'hello';
    },
  },
]);
```
