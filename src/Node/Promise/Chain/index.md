---
title: 链式调用
---

## 前言

回想一下， `jQuery` 里面实现链式调用时返回 `this`，那么 `Promise` 呢？ 其实 在 `then` 方法里 返回 新的 `Promise` 就可以一直 `then` 下去了

## Promise 链式调用特征

1. 如果 `then` 方法中（成功或失败）返回的不是一个 `Promise`，会将这个值传递给外层下一次 `then` 的成功结果
2. 如果执行 `then` 方法中出错了，则会 抛出异常，走到下一个 `then` 的失败回调
3. 如果返回的是一个 `Promise` ，等待这个 `Promise的结果`，而决定 下一个 `then` 的走向

## 处理普通值

<code src="./normal_chain_demo.jsx" />

分析一下：

- 在 `then` 里面返回 一个 `promise`，在 `promise` 的 `executer` 执行函数里面， `this` 相关的变量指的都是 上一次 `promise` 类的变量
- 同步：当把 外面的逻辑 放在 `promise` 的 `executer` 执行函数里面，效果是一样的，同时可以将 `then` 函数的返回值 通过 新的 `promise 的 resolve 或者 rejcet` 传递 到下一个 `then` 的成功或者失败函数里，这样一来，下一个 `then` 便可以获取到上一个 `then` 的结果
- 异步：和之前一样，`pending` 状态 把函数存起来，等 定时器执行完毕后，再执行订阅函数，同时把 值传递给 `then` 的 成功或者失败函数里

## 处理 promise

<code src="./promise_chain_demo.jsx" />

由于 要处理 promise 和 普通值的情况， 把 代码封装 在 `resolvePromise` 方法里

1. 第一步，得判断 返回的实例 是否 和 内部 `then` 返回的 内容 一致，一致则返回类型错误
2. 第二步，假设 这个返回值 `x` 是 对象并且有 `then` 属性 或者是个 函数，则认为 它是一个 `promise`，如果不是，则将其看错是 普通值
3. 第三部，如果是 `promise` 就调用它，递归解析 知道它 不是 `promise`， 最终返回到下一个 `then` 的成功或失败里
