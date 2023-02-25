## 前置知识

#### `进程`

- CPU 承担了所有的计算任务
- 进程是 CPU 资源分配的最小单位
- 在同一个时间内，单个 CPU 只能执行一个任务，只能运行一个进程
- 如果有一个进程正在执行，其它进程就得暂停
- CPU 使用了时间片轮转的算法实现多进程的调度

#### `线程`

- 线程是 CPU 调度的最小单位
- 一个进程可以包括多个线程，这些线程共享这个进程的资源

#### `chrome 浏览器进程`

- 浏览器是多进程的
- 每一个 TAB 页就是一个进程
- `浏览器主进程`

  - 控制其它子进程的创建和销毁
  - 浏览器界面显示，比如用户交互、前进、后退等操作
  - 将渲染的内容绘制到用户界面上

- `渲染进程` 就是我们说的浏览器内核

  - 负责页面的渲染、脚本执行、事件处理
  - 每个 TAB 页都有一个渲染进程
  - 每个渲染进程中有主线程和合成线程等

- `网络进程` 处理网络请求、文件访问等操作
  - GPU 进程 用于 3D 绘制
  - 第三方插件进程

#### `渲染进程`

- `GUI渲染线程`
  - 渲染、布局和绘制页面
  - 当页面需要重绘和回流时，此线程就会执行
  - 与 JS 引擎互斥
- `JS引擎线程`
  - 负责解析执行 JS 脚本
  - 只有一个 JS 引擎线程(单线程)
  - 与 GUI 渲染线程互斥
- `事件触发线程`
  - 用来控制事件循环(鼠标点击、setTimeout、Ajax 等)
  - 当事件满足触发条件时，把事件放入到 JS 引擎所有的执行队列中
- `定时器触发线程`
  - setInterval 和 setTimeout 所在线程
  - 定时任务并不是由 JS 引擎计时，而是由定时触发线程来计时的
  - 计时完毕后会通知事件触发线程
- `异步HTTP请求线程`
  - 浏览器有一个单独的线程处理 AJAX 请求
  - 当请求完毕后，如果有回调函数，会通知事件触发线程
- `IO线程`
  - 接收其它进程发过来的消息

## 任务分类

#### `宏任务`

1. 页面的大部分任务是在主任务上执行的，比如下面这些都是宏任务
   - 渲染事件(DOM 解析、布局、绘制)
   - 用户交互(鼠标点击、页面缩放)
   - JavaScript 脚本执行
   - 网络请求
   - 文件读写
2. 宏任务会添加到消息到消息队列的尾部，当主线程执行到该消息的时候就会执行
3. 每次从事件队列中获取一个事件回调并且放到执行栈中的就是一个宏任务，宏任务执行过程中不会执行其它内容
4. 每次宏任务执行完毕后会进行 GUI 渲染线程的渲染，然后再执行下一个宏任务
5. 宏任务: script（整体代码）, setTimeout, setInterval, setImmediate, I/O, UI rendering
6. 宏任务颗粒度较大，不适合需要精确控制的任务
7. 宏任务是由宿主方控制的

#### `微任务`

1. 宏任务结束后会进行渲染然后执行下一个宏任务
2. 微任务是当前宏任务执行后立即执行的
3. 当宏任务执行完，就到达了检查点,会先将执行期间所产生的所有微任务都执行完再去进行渲染
4. 微任务是由 V8 引擎控制的，在创建全局执行上下文的时候，也会在 V8 引擎内部创建一个微任务队列
5. 微任务: process.nextTick（Nodejs）, Promises, Object.observe, MutationObserver

#### `MutationObserver`

1. MutationObserver 创建并返回一个新的 MutationObserver 它会在指定的 DOM 发生变化时被调用
2. MutationObserver 采用了异步 + 微任务的方案
3. 异步是为了提升同步操作带来的性能问题
4. 微任务是为了解决实时响应的问题

## 事件环

#### `浏览器事件环`

每循环一次会执行一个宏任务，并清空对应的微任务队列，每次事件循环完毕后会判断页面是否需要重新渲染 （大约 16.6ms 会渲染一次）

1. 全局执行上下文 和 函数执行上下文，将 宏任务 和 微任务， 分别放进各自的队列里
2. 代码执行时，将会从 宏任务队列 取出 一个 宏任务 放进 主执行栈 中执行
3. 执行完 一个 宏任务后， 在渲染 ui 前，会清空微任务队列
4. 紧接着， 进行 RAF 回调处理 dom 操作，布局绘制等
5. 绘制完渲染页面，会重新取出 一个宏任务， 如此反复形成一个闭环

![eventloop](/images/node/eventloop.png)

#### `node 事件环`

- Node.js 采用 V8 作为 js 的解析引擎，而 I/O 处理方面使用了自己设计的 libuv
- libuv 是一个基于事件驱动的跨平台抽象层，封装了不同操作系统一些底层特性，对外提供统一的 API
- 事件循环机制也是它里面的实现
  - V8 引擎解析 JavaScript 脚本并调用 Node API
  - libuv 库负责 Node API 的执行。它将不同的任务分配给不同的线程,形成一个 Event Loop（事件循环），以异步的方式将任务的执行结果返回给 V8 引擎
  - V8 引擎再将结果返回给用户

![libuv](/images/node/nodelibuv.jpeg)

- `libuv`
- 同步执行全局的脚本
- 执行所有的微任务，先执行 nextTick 中的所有的任务，再执行其它微任务
- 开始执行宏任务，共有 6 个阶段，从第 1 个阶段开始，会执行每一个阶段所有的宏任务

![libuv2](/images/node/nodelibuv2.jpeg)

<!-- ![nodEeventloop](/images/node/nodEeventloop.jpeg) -->

- poll 阶段
  - 检测 Poll 队列中是否为空，如果不为空则执行队列中的任务，直到超时或者全部执行完毕。
  - 执行完毕后检测 setImmediate 队列是否为空，如果不为空则执行 check 阶段，如果为空则等待时间到达。时间到达后回到 timer 阶段
  - 等待时间到达是可能会出现新的 callback，此时也在当前阶段被清空

#### `process.nextTick`

- nextTick 独立于 Event Loop,有自己的队列，每个阶段完成后如果存在 nextTick 队列会全部清空，优先级高于微任务
- 从技术上讲不是事件循环的一部分。优先级高于微任务

```js
setTimeout(() => {
  console.log('setTimeout1');
  Promise.resolve().then(function () {
    console.log('promise1');
  });
}, 0);
setTimeout(() => {
  console.log('setTimeout2');
  Promise.resolve().then(function () {
    console.log('promise2');
  });
}, 0);
setImmediate(() => {
  console.log('setImmediate1');
  Promise.resolve().then(function () {
    console.log('promise3');
  });
}, 0);

process.nextTick(() => {
  console.log('nextTick1');
  Promise.resolve().then(() => console.log('promise4'));
  process.nextTick(() => {
    console.log('nextTick2');
    Promise.resolve().then(() => console.log('promise5'));
    process.nextTick(() => {
      console.log('nextTick3');
      process.nextTick(() => {
        console.log('nextTick4');
      });
    });
  });
});
// nextTick1 nextTick2 nextTick3 nextTick4
// promise4 promise5
// setTimeout1 promise1
// setTimeout2 promise2
// setImmediate1 promise3
```

## 易错题

1.

```js
<div id="btn"></div>;

window.btn.addEventlistener('click', () => {
  Promise.resolve('M1').then((res) => console.log(res));
  console.log('L1');
});

window.btn.addEventlistener('click', () => {
  Promise.resolve('M2').then((res) => console.log(res));
  console.log('L2');
});

// btn.click() // 求加上这行和去掉这行之后的 打印结果
```

2.

```js
<a id="link" href="//www.baidu.com">
  是否跳转
</a>;

let nextTick = new Promise(function (resolve) {
  window.link.addEventlistener('click', resvole, { once: true });
});
nextTick.then((event) => {
  event.preventDefault();
  console.log('preventDefault');
});

// 求上面是否会阻止跳转？
```
