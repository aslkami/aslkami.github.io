---
order: 9
---

1 持久化缓存缓存在 webpack5 中默认开启，缓存默认是在内存里,但可以对 cache 进行设置 cache: { type: 'filesystem', //'memory' | 'filesystem' cacheDirectory: path.resolve(\_\_dirname, 'node_modules/.cache/webpack'), },

2 资源模块资源模块是一种模块类型，它允许使用资源文件（字体，图标等）而无需配置额外 loader raw-loader => asset/source 导出资源的源代码 file-loader => asset/resource 发送一个单独的文件并导出 URL url-loader => asset/inline 导出一个资源的 data URI asset 在导出一个 data URI 和发送一个单独的文件之间自动选择。之前通过使用 url-loader，并且配置资源体积限制实现

3 URIs （会用的比较少） Webpack 5 支持在请求中处理协议支持 data 支持 Base64 或原始编码,MimeType 可以在 module.rule 中被映射到加载器和模块类型

4 moduleIds & chunkIds 的优化在 webpack5 之前，没有从 entry 打包的 chunk 文件，都会以 1、2、3...的文件命名方式输出,删除某些些文件可能会导致缓存失效在生产模式下，默认启用这些功能 chunkIds: "deterministic", moduleIds: "deterministic"，此算法采用确定性的方式将短数字 ID(3 或 4 个字符)短 hash 值分配给 modules 和 chunks chunkId 设置为 deterministic，则 output 中 chunkFilename 里的[name]会被替换成确定性短数字 ID 虽然 chunkId 不变(不管值是 deterministic | natural | named)，但更改 chunk 内容，chunkhash 还是会改变的可选值 含义 示例 natural: 按使用顺序的数字 ID 1 named: 方便调试的高可读性 id src_two_js.js deterministic: 根据模块名称生成简短的 hash 值 915 size: 根据模块大小生成的数字 id 0

5 移除 Node.js 的 polyfill webpack4 带了许多 Node.js 核心模块的 polyfill,一旦模块中使用了任何核心模块(如 crypto)，这些模块就会被自动启用 webpack5 不再自动引入这些 polyfill 如果要引入加上

6 更强大的 tree-shaking tree-shaking 就在打包的时候剔除没有用到的代码 webpack4 本身的 tree shaking 比较简单（直接 import 整个文件或者对象内部未使用的不能被剔除；commonJs 模式不支持）, 主要是找一个 import 进来的变量是否在这个模块内出现过 webpack5 可以进行根据作用域之间的关系来进行优化,开始支持会分析模块的引用关系 webpack.config.js:配置：optimization:true 会给没使用的文件进行标记: unused harmony export nums ,在 prodction 模式中会被删除 webpack4:在编写支持 tree-shaking 的代码时，导入方式非常重要。你应该避免将整个库导入到单个 JavaScript 对象中。当你这样做时，你是在告诉 Webpack 你需要整个库， Webpack 就不会摇它。 modudleId 开发环境下 模块 ID 是相对于根目录的相对路径，上线不行 sideEffects:false 函数副作用指当调用函数时，除了返回函数值之外，还产生了附加的影响,例如修改全局变量严格的函数式语言要求函数必须无副作用 sideEffects:false 值，就认为所有的 js 文件都没有副作用,就可以在内部 css 的 loader 中设置 sideEffects:true(表示有副作用)

[webpack5 用法示例](https://github.com/aslkami/webpack5)
