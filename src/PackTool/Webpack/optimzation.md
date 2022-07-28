---
title: 优化
order: 5
---

## 优化的角度

- 缩小查找范围
- noParse 不去解析依赖
- IgnorePlugin，让 webpack 忽略对其打包
- 打包分析
- 打包的输出类型 library Target
- 提取抽离 css
- 压缩 js、css、html
- purgecss-webpack-plugin, css 版 tree-shaking
- CDN 文件缓存
- moduleIds & chunkIds 的优化
- 模块联邦
- split chunks 代码分割

## 缩小查找范围

```js
// webpack.config.plugin
const bootstrap = path.resolve(__dirname, 'node_modules/bootstrap/dist/css/bootstrap.css');
module.exports = {
  // 指定extension之后可以不用在require或是import的时候加文件扩展名,会依次尝试添加扩展名进行匹配
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.css'],
    // 指定别名
    alias: {
      bootstrap,
    },
    // 孩指定第三方模块的查找目录
    modules: ['node_modules'],
    // 配置 target === "web" 或者 target === "webworker" 时 mainFields 默认值是：
    mainFields: ['browser', 'module', 'main'],
    // target 的值为其他时，mainFields 默认值为：
    mainFields: ['module', 'main'],
    // 没有 package.json 的时候根据下面的规则查找入口文件
    mainFiles: ['index'], // 你可以添加其他默认使用的文件名
  },
  // 用于配置解析 loader 时的 resolve 配置,默认的配置：
  resolveLoader: {
    modules: ['node_modules'],
    extensions: ['.js', '.json'],
    mainFields: ['loader', 'main'],
  },
};
```

## noParse

指定某些模块不去 递归解析，节省打包时间，前提是没有其它依赖项的模块，例如 `jquery 和 lodash` 没有引入依赖

```js
module.exports = {
  module: {
    noParse: /jquery|lodash/, // 正则表达式
    // 或者使用函数
    noParse(content) {
      return /jquery|lodash/.test(content);
    },
  },
};
```

## IgnorePlugin

moment.js 其实本身不大，但是语言包却很大，我们不需要用到的让 webpack 不去打包，要用的话通过自己手动引入

```js
const webpack = require('webpack');
module.exports = {
  plugins: [
    new webpack.IgnorePlugin({
      //A RegExp to test the context (directory) against.
      contextRegExp: /moment$/, // 指定打包模块
      //A RegExp to test the request against.
      resourceRegExp: /^\.\/locale/, // 排除指定模块的文件不被打包
    }),
  ],
};

// usage index.js
import moment from 'moment';
import 'moment/locale/zh-cn';
console.log(moment().format('MMMM Do YYYY, h:mm:ss a'));
```

## 打包分析

- speed-measure-webpack-plugin, 可以查看各阶段打包时长

```js
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin');
const smw = new SpeedMeasureWebpackPlugin();
module.exports = smw.wrap({});
```

- webpack-bundle-analyzer, 生成代码分析报告，帮助提升代码质量和网站性能

```js
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
module.exports = {
  plugins: [new BundleAnalyzerPlugin()],
};
```

## libraryTarget 和 library

- 当用 Webpack 去构建一个可以被其他模块导入使用的库时需要用到它们
- `output.library` 配置导出库的名称
- `output.libraryExport` 配置要导出的模块中哪些子模块需要被导出。 它只有在 output.libraryTarget 被设置成 commonjs 或者 commonjs2 时使用才有意义
- `output.libraryTarget` 配置以何种方式导出库,是字符串的枚举类型，支持以下配置

| libraryTarget | 使用者的引入方式                      | 使用者提供给被使用者的模块的方式         |
| :------------ | :------------------------------------ | :--------------------------------------- |
| var           | 只能以 script 标签的形式引入我们的库  | 只能以全局变量的形式提供这些被依赖的模块 |
| commonjs      | 只能按照 commonjs 的规范引入我们的库  | 被依赖模块需要按照 commonjs 规范引入     |
| commonjs2     | 只能按照 commonjs2 的规范引入我们的库 | 被依赖模块需要按照 commonjs2 规范引入    |
| amd           | 只能按 amd 规范引入                   | 被依赖的模块需要按照 amd 规范引入        |
| this          |                                       |                                          |
| window        |                                       |                                          |
| global        |                                       |                                          |
| umd           | 可以用 script、commonjs、amd 引入     | 按对应的方式引入                         |

```js
// webpack.config.js
module.exports = {
  output: {
        path: path.resolve("build"),
        filename: "[name].js",
       library:'calculator',
       libraryTarget:'var'
  }
}

// commonjs
exports["calculator"] = (function (modules) {}({})

// commonjs2
module.exports = (function (modules) {}({})

// this
this["calculator"]= (function (modules) {}({})

// window
window["calculator"]= (function (modules) {}({})

// global
global["calculator"]= (function (modules) {}({})

// umd
(function webpackUniversalModuleDefinition(root, factory) {
  if(typeof exports === 'object' && typeof module === 'object')
    module.exports = factory();
  else if(typeof define === 'function' && define.amd)
    define([], factory);
  else if(typeof exports === 'object')
    exports['MyLibrary'] = factory();
  else
    root['MyLibrary'] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
  return _entry_return_;
});
```

## 提取 css

因为 CSS 的 下载和 JS 可以并行,当一个 HTML 文件很大的时候，我们可以把 CSS 单独提取出来加载

```js
// webpack.config.js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
  mode: 'development',
  devtool: false,
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/',
  },
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' },
      { test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader'] },
      { test: /\.less$/, use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'] },
      { test: /\.scss$/, use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'] },
      {
        test: /\.(jpg|png|gif|bmp|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'images/[hash][ext]',
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      // 指定提取文件夹
      // filename: 'css/[name].css'
    }),
  ],
};
```

## 压缩 js、css、html

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
module.exports = {
  mode: 'development',
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      minify: {
        collapseWhitespace: true,
        removeComments: true,
      },
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
    new OptimizeCssAssetsWebpackPlugin(),
  ],
};
```

## purgecss-webpack-plugin

[purgecss-webpack-plugin](https://www.npmjs.com/package/purgecss-webpack-plugin)

## CDN 文件缓存

- 使用缓存

  - HTML 文件不缓存，放在自己的服务器上，关闭自己服务器的缓存，静态资源的 URL 变成指向 CDN 服务器的地址
  - 静态的 JavaScript、CSS、图片等文件开启 CDN 和缓存，并且文件名带上 HASH 值
  - 为了并行加载不阻塞，把不同的静态资源分配到不同的 CDN 服务器上

- 域名限制

  - 同一时刻针对同一个域名的资源并行请求是有限制
  - 可以把这些静态资源分散到不同的 CDN 服务上去
  - 多个域名后会增加域名解析时间
  - 可以通过在 HTML HEAD 标签中 加入 `<link rel="dns-prefetch" href="http://img.xxx.com">` 去预解析域名，以降低域名解析带来的延迟

- 文件指纹

  - 打包后输出的文件名和后缀
  - hash 一般是结合 CDN 缓存来使用，通过 webpack 构建之后，生成对应文件名自动带上对应的 MD5 值。如果文件内容改变的话，那么对应文件哈希值也会改变，对应的 HTML 引用的 URL 地址也会改变，触发 CDN 服务器从源服务器上拉取对应数据，进而更新本地缓存。

    指纹占位符

  | 占位符名称  | 含义                                                          |
  | :---------- | :------------------------------------------------------------ |
  | ext         | 资源后缀名                                                    |
  | name        | 文件名称                                                      |
  | path        | 文件的相对路径                                                |
  | folder      | 文件所在的文件夹                                              |
  | hash        | 每次 webpack 构建时生成一个唯一的 hash 值                     |
  | chunkhash   | 根据 chunk 生成 hash 值，来源于同一个 chunk，则 hash 值就一样 |
  | contenthash | 根据内容生成 hash 值，文件内容相同 hash 值就相同              |

  - hash: 所有文件共用一个 hash 值，任意模块改动打包后，hash 值都会变动
  - chunkhash：同一个 chunk 里面的内容，打包出来的文件都一样，例如 打包 main.js 和 vendor.js，改动 main 后打包，不会影响 vendor
  - contenthash：文件内容相同 hash 值就相同
  - 有一种场景 js 变了，但是 css 没改变，生成的 css 文件也随着 js 的改变而改变，所以最佳实践是 `js => chunkhash, css => contenthash`

- HashPlugin

可以自己修改各种 hash 值

```js
class HashPlugin {
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {
    compiler.hooks.compilation.tap('HashPlugin', (compilation, params) => {
      //如果你想改变hash值，可以在hash生成这后修改
      compilation.hooks.afterHash.tap('HashPlugin', () => {
        let fullhash = 'fullhash'; //时间戳
        console.log('本次编译的compilation.hash', compilation.hash);
        compilation.hash = fullhash; //output.filename [fullhash]
        for (let chunk of compilation.chunks) {
          console.log('chunk.hash', chunk.hash);
          chunk.renderedHash = 'chunkHash'; //可以改变chunkhash
          console.log('chunk.contentHash', chunk.contentHash);
          chunk.contentHash = {
            javascript: 'javascriptContentHash',
            'css/mini-extract': 'cssContentHash',
          };
        }
      });
    });
  }
}
module.exports = HashPlugin;
/**
 * 三种hash
 * 1. hash compilation.hash
 * 2. chunkHash 每个chunk都会有一个hash
 * 3. contentHash 内容hash 每个文件会可能有一个hash值
 */
```

## moduleIds & chunkIds 的优化

- module: 每一个文件其实都可以看成一个 module
- chunk: webpack 打包最终生成的代码块，代码块会生成文件，一个文件对应一个 chunk
- 在 webpack5 之前，没有从 entry 打包的 chunk 文件，都会以 1、2、3...的文件命名方式输出,删除某些些文件可能会导致缓存失效
- 在生产模式下，默认启用这些功能 chunkIds: "deterministic", moduleIds: "deterministic"，此算法采用确定性的方式将短数字 ID(3 或 4 个字符)短 hash 值分配给 modules 和 chunks
- chunkId 设置为 deterministic，则 output 中 chunkFilename 里的 [name] 会被替换成确定性短数字 ID
- 虽然 chunkId 不变(不管值是 deterministic | natural | named)，但更改 chunk 内容，chunkhash 还是会改变的

| 可选值        | 含义                           | 示例          |
| :------------ | :----------------------------- | :------------ |
| natural       | 按使用顺序的数字 ID            | 1             |
| named         | 方便调试的高可读性 id          | src_two_js.js |
| deterministic | 根据模块名称生成简短的 hash 值 | 915           |
| size          | 根据模块大小生成的数字 id      | 0             |

```js
const path = require('path');
module.exports = {
  mode: 'development',
  devtool: false,
  optimization: {
    moduleIds: 'deterministic',
    chunkIds: 'deterministic',
  },
};
```

## 模块联邦

- Module Federation 的动机是为了不同开发小组间共同开发一个或者多个应用
- 应用将被划分为更小的应用块，一个应用块，可以是比如头部导航或者侧边栏的前端组件，也可以是数据获取逻辑的逻辑组件
- 每个应用块由不同的组开发
- 应用或应用块共享其他其他应用块或者库

- 使用 Module Federation 时，每个应用块都是一个独立的构建，这些构建都将编译为容器
- 容器可以被其他应用或者其他容器应用
- 一个被引用的容器被称为 remote, 引用者被称为 host，remote 暴露模块给 host, host 则可以使用这些暴露的模块，这些模块被成为 remote 模块

| 字段     | 类型   | 含义                                                                   |
| :------- | :----- | :--------------------------------------------------------------------- |
| name     | string | 必传值，即输出的模块名，被远程引用时路径为${name}/${expose}            |
| library  | object | 声明全局变量的方式，name 为 umd 的 name                                |
| filename | string | 构建输出的文件名                                                       |
| remotes  | object | 远程引用的应用名及其别名的映射，使用时以 key 值作为 name               |
| exposes  | object | 被远程引用时可暴露的资源路径及其别名                                   |
| shared   | object | 与其他应用之间可以共享的第三方依赖，使你的代码中不用重复加载同一份依赖 |

- remote

```js
let path = require('path');
let webpack = require('webpack');
let HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    publicPath: 'http://localhost:3000/',
  },
  devServer: {
    port: 3000,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react'],
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new ModuleFederationPlugin({
      filename: 'remoteEntry.js',
      name: 'remote',
      exposes: {
        './NewsList': './src/NewsList',
      },
    }),
  ],
};
```

- host

```js
let path = require('path');
let webpack = require('webpack');
let HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    publicPath: 'http://localhost:8000/',
  },
  devServer: {
    port: 8000,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react'],
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new ModuleFederationPlugin({
      filename: 'remoteEntry.js',
      name: 'host',
      remotes: {
        remote: 'remote@http://localhost:3000/remoteEntry.js',
      },
    }),
  ],
};
```

- shared

```js
module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new ModuleFederationPlugin({
      filename: 'remoteEntry.js',
      name: 'host',
      remotes: {
        remote: 'remote@http://localhost:3000/remoteEntry.js',
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
      },
    }),
  ],
};
```

简单总结一下， remote 会暴露一些组件 供给 host 使用，类似于引入组件库，而 shared 的话，例如 一个采用了 react 17 版本。 一个使用 react 18 的版本，项目只能用 react 17， 则会引用 react 17 的服务版本

## split chunks 代码分割

- 对于大的 Web 应用来讲，将所有的代码都放在一个文件中显然是不够有效的，特别是当你的某些代码块是在某些特殊的时候才会被用到。
- webpack 有一个功能就是将你的代码库分割成 chunks 语块，当代码运行到需要它们的时候再进行加载

- 代码分割类型
  - 入口点分割, 如 打包入口 index.js main.js
  - 动态导入、懒加载分割, 如 `import('./lazyImport')`
  - 提取公共代码, 如 每个页面都用到 moment.js

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  mode: 'development',
  devtool: false,
  entry: {
    page1: './src/page1.js',
    page2: './src/page2.js',
    page3: './src/page3.js',
  },
  optimization: {
    splitChunks: {
      // 表示选择哪些 chunks 进行分割，可选值有：async，initial和all
      chunks: 'all',
      // 表示新分离出的chunk必须大于等于minSize，默认为30000，约30kb。
      minSize: 0, //默认值是20000,生成的代码块的最小尺寸
      // 表示一个模块至少应被minChunks个chunk所包含才能分割。默认为1。
      minChunks: 1,
      // 表示按需加载文件时，并行请求的最大数目。默认为5。
      maxAsyncRequests: 3,
      // 表示加载入口文件时，并行请求的最大数目。默认为3
      maxInitialRequests: 5,
      // 表示拆分出的chunk的名称连接符。默认为~。如chunk~vendors.js
      automaticNameDelimiter: '~',
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/, //条件
          priority: -10, ///优先级，一个chunk很可能满足多个缓存组，会被抽取到优先级高的缓存组中,为了能够让自定义缓存组有更高的优先级(默认0),默认缓存组的priority属性为负值.
        },
        default: {
          minChunks: 2, ////被多少模块共享,在分割之前模块的被引用次数
          priority: -20,
        },
      },
    },
    runtimeChunk: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      chunks: ['page1'],
      filename: 'page1.html',
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      chunks: ['page2'],
      filename: 'page2.html',
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      chunks: ['page3'],
      filename: 'page3.html',
    }),
  ],
};
```
