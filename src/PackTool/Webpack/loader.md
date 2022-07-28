---
title: Loader
order: 2
---

## loader 是什么

loader 只是一个导出为函数的 JavaScript 模块。它接收上一个 loader 产生的结果或者资源文件(resource file)作为入参。也可以用多个 loader 函数组成 loader chain compiler 需要得到最后一个 loader 产生的处理结果。这个处理结果应该是 String 或者 Buffer（被转换为一个 string）

## loader 类型

一共以下四种类型

post(后置) + inline(内联) + normal(正常) + pre(前置)

## loader 模拟执行

```js
const { runLoaders } = require('loader-runner');
const path = require('path');
const fs = require('fs'); //webpack-dev-server启开发服务器的时候 memory-fs
const entryFile = path.resolve(__dirname, 'src/index.js');
//如何配置行内
let request = `inline-loader1!inline-loader2!${entryFile}`;
let rules = [
  {
    test: /\.js$/,
    use: ['normal-loader1', 'normal-loader2'],
  },
  {
    test: /\.js$/,
    enforce: 'post',
    use: ['post-loader1', 'post-loader2'],
  },
  {
    test: /\.js$/,
    enforce: 'pre',
    use: ['pre-loader1', 'pre-loader2'],
  },
];
let parts = request.replace(/^-?!+/, '').split('!');
let resource = parts.pop(); //弹出最后一个元素 entryFile=src/index.js
let inlineLoaders = parts; //[inline-loader1,inline-loader2]
let preLoaders = [],
  postLoaders = [],
  normalLoaders = [];
for (let i = 0; i < rules.length; i++) {
  let rule = rules[i];
  if (rule.test.test(resource)) {
    if (rule.enforce === 'pre') {
      preLoaders.push(...rule.use);
    } else if (rule.enforce === 'post') {
      postLoaders.push(...rule.use);
    } else {
      normalLoaders.push(...rule.use);
    }
  }
}
let loaders = [];
if (request.startsWith('!!')) {
  loaders = [...inlineLoaders];
  //noPreAutoLoaders
} else if (request.startsWith('-!')) {
  loaders = [...postLoaders, ...inlineLoaders];
} else if (request.startsWith('!')) {
  //noAutoLoaders
  loaders = [...postLoaders, ...inlineLoaders, ...preLoaders];
} else {
  loaders = [...postLoaders, ...inlineLoaders, ...normalLoaders, ...preLoaders];
}
let resolveLoader = (loader) => path.resolve(__dirname, 'loaders-chain', loader);
//把loader数组从名称变成绝对路径
loaders = loaders.map(resolveLoader);
runLoaders(
  {
    resource, //你要加载的资源
    loaders,
    context: { name: 'fate', age: 100 }, //保存一些状态和值
    readResource: fs.readFile.bind(this),
  },
  (err, result) => {
    console.log(err); //运行错误
    console.log(result); //运行的结果
    console.log(result.resourceBuffer ? result.resourceBuffer.toString('utf8') : null); //读到的原始的文件
  },
);
```

| 符号 | 变量                 | 含义                                    |
| :--- | :------------------- | :-------------------------------------- |
| -!   | noPreAutoLoaders     | 不要前置和普通                          |
| !    | noAutoLoaders        | 不要普通                                |
| !!   | noPrePostAutoLoaders | 不要前后置和普通 loader,只要内联 loader |

## pitch

- 比如 a!b!c!module, 正常调用顺序应该是 c、b、a，但是真正调用顺序是 a(pitch)、b(pitch)、c(pitch)、c、b、a,如果其中任何一个 pitching loader 返回了值就相当于在它以及它右边的 loader 已经执行完毕
- 比如如果 b 返回了字符串"result b", 接下来只有 a 会被系统执行，且 a 的 loader 收到的参数是 result b – loader 根据返回值可以分为两种，一种是返回 js 代码（一个 module 的代码，含有类似 module.export 语句）的 loader，还有不能作为最左边 loader 的其他 loader – 有时候我们想把两个第一种 loader chain 起来，比如 style-loader!css-loader! 问题是 css-loader 的返回值是一串 js 代码，如果按正常方式写 style-loader 的参数就是一串代码字符串
- 为了解决这种问题，我们需要在 style-loader 里执行 require(css-loader!resources)

pitch 与 loader 本身方法的执行顺序图

![pitch](/images/webpack/loader_pitch.jpeg)

## loader-runner 模拟实现

![pitch](/images/webpack/loader_runner.jpg)

```js
let fs = require('fs');
/**
 * 可以把一个loader从一个绝对路径变成一个loader对象
 */
function createLoaderObject(loader) {
  let normal = require(loader);
  let pitch = normal.pitch;
  let raw = normal.raw; //决定loader的参数是字符串还是Buffer
  return {
    path: loader, //存放着此loader的绝对路径
    normal,
    pitch,
    raw,
    data: {}, //每个loader都可以携带一个自定义data对象
    pitchExecuted: false, //此loader的pitch函数是否已经 执行过
    normalExecuted: false, //此loader的normal函数是否已经执行过
  };
}
function convertArgs(args, raw) {
  if (raw && !Buffer.isBuffer(args[0])) {
    args[0] = Buffer.from(args[0]);
  } else if (!raw && Buffer.isBuffer(args[0])) {
    args[0] = args[0].toString('utf8');
  }
}
function iterateNormalLoaders(processOptions, loaderContext, args, pitchingCallback) {
  if (loaderContext.loaderIndex < 0) {
    return pitchingCallback(null, args);
  }
  let currentLoader = loaderContext.loaders[loaderContext.loaderIndex];
  if (currentLoader.normalExecuted) {
    loaderContext.loaderIndex--;
    return iterateNormalLoaders(processOptions, loaderContext, args, pitchingCallback);
  }
  let fn = currentLoader.normal;
  currentLoader.normalExecuted = true;
  convertArgs(args, currentLoader.raw);
  runSyncOrAsync(fn, loaderContext, args, (err, ...returnArgs) => {
    if (err) return pitchingCallback(err);
    return iterateNormalLoaders(processOptions, loaderContext, returnArgs, pitchingCallback);
  });
}
function processResource(processOptions, loaderContext, pitchingCallback) {
  processOptions.readResource(loaderContext.resource, (err, resourceBuffer) => {
    processOptions.resourceBuffer = resourceBuffer;
    loaderContext.loaderIndex--; //定位到最后一个loader
    iterateNormalLoaders(processOptions, loaderContext, [resourceBuffer], pitchingCallback);
  });
}
function iteratePitchingLoaders(processOptions, loaderContext, pitchingCallback) {
  //说所有的loader的pitch都已经执行完成
  if (loaderContext.loaderIndex >= loaderContext.loaders.length) {
    return processResource(processOptions, loaderContext, pitchingCallback);
  }
  let currentLoader = loaderContext.loaders[loaderContext.loaderIndex];
  if (currentLoader.pitchExecuted) {
    loaderContext.loaderIndex++; //如果当前的pitch已经执行过了，就可以让当前的索引加1
    return iteratePitchingLoaders(processOptions, loaderContext, pitchingCallback);
  }
  let fn = currentLoader.pitch;
  currentLoader.pitchExecuted = true; //表示当前的loader的pitch已经处理过
  if (!fn) {
    return iteratePitchingLoaders(processOptions, loaderContext, pitchingCallback);
  }
  //以同步或者异步的方式执行fn
  runSyncOrAsync(
    fn,
    loaderContext,
    [loaderContext.remainingRequest, loaderContext.previousRequest, loaderContext.data],
    (err, ...args) => {
      //如果有返回值，索引减少1，并执行前一个loader的normal
      if (args.length > 0 && args.some((item) => item)) {
        loaderContext.loaderIndex--; //索引减少1
        iterateNormalLoaders(processOptions, loaderContext, args, pitchingCallback);
      } else {
        return iteratePitchingLoaders(processOptions, loaderContext, pitchingCallback);
      }
    },
  );
}
function runSyncOrAsync(fn, loaderContext, args, runCallback) {
  let isSync = true; //这个是个标志 符，用来标志fn的执行是同步还是异步，默认是同步
  loaderContext.callback = (...args) => {
    runCallback(null, ...args);
  };
  loaderContext.async = () => {
    isSync = false; //从同步改为异步
    return loaderContext.callback;
  };
  //在执行pitch方法的时候 ，this指向loaderContext
  let result = fn.apply(loaderContext, args);
  if (isSync) {
    //如果是同步的执行的话，会立刻向下执行下一个loader
    runCallback(null, result);
  } //如果是异步的话，那就什么都不要做
}
function runLoaders(options, finalCallback) {
  let { resource, loaders = [], context = {}, readResource = fs.readFile } = options; //src\index.js
  let loaderObjects = loaders.map(createLoaderObject);
  let loaderContext = context;
  loaderContext.resource = resource; //要加载的资源
  loaderContext.readResource = readResource; //读取资源的方法
  loaderContext.loaders = loaderObjects; //所有的loader对象
  loaderContext.loaderIndex = 0; //当前正在执行的loader索引
  loaderContext.callback = null; //回调
  loaderContext.async = null; //把loader的执行从同步变成异步
  //所有的loader加上resouce
  Object.defineProperty(loaderContext, 'request', {
    get() {
      //loader1!loader2!loader3!index.js
      return loaderContext.loaders
        .map((loader) => loader.path)
        .concat(loaderContext.resource)
        .join('!');
    },
  });
  //从当前的loader下一个开始一直到结束 ，加上要加载的资源
  Object.defineProperty(loaderContext, 'remainingRequest', {
    get() {
      //loader1!loader2!loader3!index.js
      return loaderContext.loaders
        .slice(loaderContext.loaderIndex + 1)
        .map((loader) => loader.path)
        .concat(loaderContext.resource)
        .join('!');
    },
  });
  //从当前的loader开始一直到结束 ，加上要加载的资源
  Object.defineProperty(loaderContext, 'currentRequest', {
    get() {
      //loader1!loader2!loader3!index.js
      return loaderContext.loaders
        .slice(loaderContext.loaderIndex)
        .map((loader) => loader.path)
        .concat(loaderContext.resource)
        .join('!');
    },
  });
  //从第一个到当前的loader的前一个
  Object.defineProperty(loaderContext, 'previousRequest', {
    get() {
      //loader1!loader2!loader3!index.js
      return loaderContext.loaders
        .slice(0, loaderContext.loaderIndex)
        .map((loader) => loader.path)
        .join('!');
    },
  });
  Object.defineProperty(loaderContext, 'data', {
    get() {
      //loader1!loader2!loader3!index.js
      return loaderContext.loaders[loaderContext.loaderIndex].data;
    },
  });
  let processOptions = {
    resourceBuffer: null, //将要存放读到的原始文件的原始文件 index.js的内容 Buffer
    readResource,
  };
  iteratePitchingLoaders(processOptions, loaderContext, (err, result) => {
    finalCallback(err, {
      result,
      resourceBuffer: processOptions.resourceBuffer,
    });
  });
}
exports.runLoaders = runLoaders;
```
