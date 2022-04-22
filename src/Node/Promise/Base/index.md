---
title: 基础版
---

## 前言

Promise 的出现 可以来解决 以下问题：

1. 异步并发问题（Promise.all）
2. 回调地狱（上一个的输出，是下一个的输入）-（通过链式调用解决）
3. 处理异常更加方便的捕获（catch 方法）

缺点依然是有的， 仍然是 基于回调函数的， 后面 可以 利用 async + await 写的像同步（原理是 generator + co）

下面就 基于 [Promise A+](https://promisesaplus.com) 规范 , 简单实现一下吧

## 同步 Promise

```js
let p = new Promise((resolve, reject) => {
  resovle('success');
});

p.then(
  (res) => {
    console.log('success', res);
  },
  (err) => {
    console.log('failed', err);
  },
);
```

根据上面用法，试着推断一下：

1. `promise` 是一个类，可以在构造函数里传入 `executer` 执行
2. `executer` 的参数 分别是 `resolve` 和 `reject`
3. `promise` 有三种状态， 默认是 `pending`, resolve 会变成 `fulfilled`, reject 会变成 `rejected`， 状态一旦发生改变就不能更改了
4. 产生的实例 可以调用 `then` 方法，成功就会走 then 的 第一个 回调函数，失败则走 第二个， 成功或者失败的值会分别传递给这 2 个回调函数
5. 如果有异常直接走失败 reject 的流程

实现如下：

<code src="./sync_promise_demo.jsx"  />

## 异步 Promise

可以利用发布订阅模式，实现 简单的异步

<code src="./async_promise_demo.jsx" />

分析一下：

- 在 `executer` 里，利用 `setTimeout` 模拟异步， 2s 后改变状态
- 当 `executer` 执行函数 执行完毕后， 产生实例， 此时 `setTimeout`还未执行，状态为 `pending`
- 然后调用 `then` 方法就会收集 `onFulfilled` 和 `onRejected` 回调方法 放进数组里
- 随后 定时器 开始执行， 调用 `resolve` 或者 `reject` 改变状态，并遍历执行 成功数组里 或 失败数组里 收集的方法，从而实现异步
