---
title: Source Map
order: 4
---

## `source map 类型`

| 类型 | 含义 |
| :-- | :-- |
| source-map | 原始代码 最好的 sourcemap 质量有完整的结果，但是会很慢 |
| eval-source-map | 原始代码 同样道理，但是最高的质量和最低的性能 |
| cheap-module-eval-source-map | 原始代码（只有行内） 同样道理，但是更高的质量和更低的性能 |
| cheap-eval-source-map | 转换代码（行内） 每个模块被 eval 执行，并且 sourcemap 作为 eval 的一个 dataurl |
| eval | 生成代码 每个模块都被 eval 执行，并且存在@sourceURL,带 eval 的构建模式能 cache SourceMap |
| cheap-source-map | 转换代码（行内） 生成的 sourcemap 没有列映射，从 loaders 生成的 sourcemap 没有被使用 |
| cheap-module-source-map | 原始代码（只有行内） 与上面一样除了每行特点的从 loader 中进行映射 |
| inline-source-map | 以 base64 格式内联在打包后的文件中，内联构建速度更快,也能提示错误代码的准确原始位置 |
| hidden-source-map | 会在外部生成 sourcemap 文件,但是在目标文件里没有建立关联,不能提示错误代码的准确原始位置 |

看似配置项很多， 其实只是五个关键字 eval、source-map、cheap、module 和 inline 的任意组合

| 关键字     | 含义                                                                               |
| :--------- | :--------------------------------------------------------------------------------- |
| eval       | 使用 eval 包裹模块代码                                                             |
| source-map | 产生.map 文件                                                                      |
| cheap      | 不包含列信息（关于列信息的解释下面会有详细介绍)也不包含 loader 的 sourcemap        |
| module     | 包含 loader 的 sourcemap（比如 jsx to js ，babel 的 sourcemap）,否则无法定义源文件 |
| inline     | 将.map 作为 DataURI 嵌入，不单独生成.map 文件                                      |

- eval eval 执行
- eval-source-map 生成 sourcemap
- cheap-module-eval-source-map 不包含列
- cheap-eval-source-map 无法看到真正的源码

顺序：`[inline-|hidden-|eval-][nosources-][cheap-[module-]]source-map`

## `最佳实践`

<!-- 我们在开发环境对 sourceMap 的要求是：速度快，调试更友好

- 测试环境

  - 要想速度快 推荐 `eval-cheap-source-map`
  - 如果想调试更友好 `cheap-module-source-map`
  - 折中的选择就是 `eval-source-map`

- 正式环境

  - 首先排除内联，因为一方面我们需要隐藏源代码，另一方面要减少文件体积
  - 要想调试友好 sourcemap > cheap-source-map/cheap-module-source-map > hidden-source-map/nosources-sourcemap
  - 要想速度快 优先选择 cheap
  - 折中的选择就是 hidden-source-map -->

- 首先在源代码的列信息是没有意义的，只要有行信息就能完整的建立打包前后代码之间的依赖关系。因此，不管是开发还是生产环境都会增加 cheap 属性来忽略模块打包后的列信息关联
- 不管是生产环境还是开发环境，我们都需要定位 debug 到最原始的资源，比如定位错误到 jsx，ts 的原始代码，而不是经编译后的 js 代码。所以不可以忽略掉 module 属性
- 需要生成.map 文件，所以得有 source-map 属性
- 总结
  - 开发环境使用：cheap-module-eval-source-map
  - 生产环境使用：cheap-module-source-map

## source map 调试

- 测试环境

```js
// webpack.config.js
module.exports = {
  devtool: false,
  plugins: {
    new webpack.SourceMapDevToolPlugin({
      append: '\n//# sourceMappingURL=http://127.0.0.1:8081/[url]',
      filename: '[file].map',
    }),
    new FileManagerPlugin({
      onEnd: {
        copy: [{
          source: './dist/*.map',
          destination: './maps',
        }],
        delete: ['./dist/*.map'],
        archive: [{
          source: './dist',
          destination: './dist/dist.zip',
        }]
      }
    })
  }
}
```

- 生产环境

```js
// webpack.config.js
module.exports = {
  devtool: 'hidden-source-map',
  plugins: {
    new FileManagerPlugin({
      onEnd: {
        copy: [{
          source: './dist/*.map',
          destination: './maps',
        }],
        delete: ['./dist/*.map'],
        archive: [{
          source: './dist',
          destination: './dist/dist.zip',
        }]
      }
    })
  }
}
```

打包启用了 静态服务访问 source map 文件后，在浏览器 append source map
