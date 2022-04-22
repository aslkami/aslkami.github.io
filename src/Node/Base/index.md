## Node 是什么

Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境(runtime),Node 不是一门语言是让 js 运行在后端的运行时,并且不包括 javascript 全集,因为在服务端中不包含 DOM 和 BOM,Node 也提供了一些新的模块例如 http,fs 模块等。Node.js 使用了事件驱动、非阻塞式 I/O 的模型，使其轻量又高效并且 Node.js 的包管理器 npm，是全球最大的开源库生态系统。

## Node 解决了哪些问题?

Node 在处理高并发,I/O 密集场景有明显的性能优势

- Node 在处理高并发,I/O 密集场景有明显的性能优势
- I/O 密集指的是文件操作、网络操作、数据库,相对的有 CPU 密集,CPU 密集指的是逻辑处理运算、压缩、解压、加密、解密

> Web 主要场景就是接收客户端的请求读取静态资源和渲染界面,所以 Node 非常适合 Web 应用的开发。

## JS 单线程

javascript 在最初设计时设计成了单线程,为什么不是多线程呢？如果多个线程同时操作 DOM 那岂不会很混乱？这里所谓的单线程指的是主线程是单线程的,所以在 Node 中主线程依旧是单线程的。

- 单线程特点是节约了内存,并且不需要在切换执行上下文
- 而且单线程不需要管锁的问题.

## 同步异步和阻塞非阻塞

- 同步就是在执行某段代码时，代码没有得到返回之前，其他代码无法执行，当得到了返回值后可以继续执行其他代码。
- 异步就是在执行某段代码时，代码不会立即得到返回结果，可以继续执行其他代码，返回值通过回调来获取

![同步阻塞和异步阻塞](/images/node/sync_async.png)

## Node 中全局对象

- Buffer
- process
- setInterval,setTimeout,setImmediate
- console
- queueMicrotask

## node 中的模块

- \_\_dirname
- \_\_filename
- exports
- module
- require

- 核心模块/内置模块 fs http path 不需要安装 引入的时候不需要增加相对路径、绝对路径
- 第三方模块需要安装
- 自定义模块需要通过绝对路径或者相对路径进行引入

## commonjs 规范

1. 每个 js 文件都是一个模块
2. 模块的导出 module.exports
3. 模块的导入 require

## NPM

#### 全局安装

- `npm install http-server`
- 在 `**/user/local/bin` 目录下作了个链接连接到 `/usr/local/lib/node_modules/http-server/bin/http-server` 这个文件
- 当我们执行 `http-server**` 这个命令时，会调用链接的这个文件。

```js
// .bin/www
#! /usr/bin/env node
console.log('aslkami'); // #! 这句表示采用node来执行此文件，同理 shell可以表示 sh

// package.json
"bin": {
	"my-pack":"./bin/www" // 这里要注意名字和你建立的文件夹相同
},

终端执行 npm link

执行 my-pack， 打印 aslkami
```

#### 依赖方式

1. dependencies 项目依赖

- 可以使用 `npm install -S` 或 `npm install --save` 保存到依赖中，当发布到 npm 上时 dependencies 下的模块会作为依赖，一起被下载!

2. devDependencies 开发依赖

- 可以使用 `npm install -D` 或 `npm install --save-dev` 保存到依赖中。 当发布到 npm 上时 `devDependencies` 下面的模块就不会自动下载了,如果只是单纯的开发项目 `dependencies`, `devDependencies` 只有提示的作用!

3. peerDependencies 同版本依赖

- 同等依赖,如果你安装我，那么你最好也安装我对应的依赖，如果未安装会报出警告 `bash "peerDependencies": { "jquery": "2.2.0" }`

4. bundledDependencies 捆绑依赖

```json
"bundleDependencies": [
    "jquery"
 ],
```

- 使用 `npm pack` 打包 tgz 时会将捆绑依赖一同打包

5. optionalDependencies 可选依赖

- 如果发现无法安装或无法找到，不会影响 npm 的安装

## 内置模块 Path

- path.join 路径拼接
- path.resolve 从根路径，解析绝对路径

区别：`path.resolve` 遇到 / 会被重新解析到 /
