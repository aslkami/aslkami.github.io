---
title: Promise 代码输出题
---

## 题目 1

```js
let p = new Promise((resolve, reject) => {
  reject();
  resolve();
});
p.then(
  () => console.log('成功'),
  () => console.log('失败'),
);
```

- 打印失败， 因为 promise 一旦 改变状态 变不可逆

## 题目 2

```js
const promise = new Promise((resolve, reject) => {
  console.log(1);
  resolve();
  console.log(2);
});
promise.then(() => {
  console.log(3);
});
```

- 分别打印 123， 因为 resolve 只是改状态，顺序还是同步的

## 题目 3

```js
Promise.resolve(1)
  .then((res) => 2)
  .catch((err) => 3)
  .then((res) => console.log(res));
```

- 打印 2，`catch` 可以看作 `then(null, errorCallback)`, 而 `then` 的第一个参数是 `null`， 则会透传 上一个 `then` 的结果

## 题目 4

```js
Promise.resolve(1)
  .then((x) => x + 1)
  .then((x) => {
    throw new Error('My Error');
  })
  .catch(() => 1)
  .then((x) => x + 1)
  .then((x) => console.log(x))
  .catch(console.error);
```

打印 2

- resolve(1) 返回 1
- then(x => x + 1 ) => 返回 2
- then(x) => { throw new Error('My Error'); } => 走到 catch
- catch(() => 1), 没有报错 => 走到 then
- then(x => x + 1 ) => 返回 2
- then((x) => console.log(x)) => 打印 2

## 题目 5

```js
Promise.resolve()
  .then(() => {
    console.log(0);
    return new Promise((resolve) => {
      resolve('a');
    });
  })
  .then((res) => {
    console.log(res);
  });
Promise.resolve()
  .then(() => {
    console.log(1);
  })
  .then(() => {
    console.log(2);
  })
  .then(() => {
    console.log(3);
  })
  .then(() => {
    console.log(4);
  })
  .then(() => {
    console.log(5);
  });

// 0 1 2 3 a 4 5
```

可以理解为 `Promise.resolve().then()` 里面 返回 `Promise` 相当于 新增了 2 次 微任务

<code src="./demo.jsx" />

#### 讲解

- `第 1 个 Promise.resolve() 返回一个 promise1`
- 这个 promise1 会立刻调用它的 resolve 方法，把它的 value 值设置为 undefined,状态设置为完成态,执行成功回调是空数组
- 接着调用 promise1 的 then 方法，因为此时 promise1 已经是完成态了，入队

  ```js
  console.log('FULFILLED then: microtask', this.id);
  let x = onFulfilled(this.value); //x=k
  resolvePromise(p1, x, resolve, reject);
  ```

- 然后返回 promise2
- 然后继续调用 promise2 的 then 方法，发现 promise2 还处于等待态，不能直接添加微任务，只能添加

  ```js
  () => {
    queueMicrotask(() => {
      console.log('PENDING then: microtask', this.id);
      let x = onFulfilled(this.value);
      resolvePromise(p1, x, resolve);
    });
  };
  ```

  到 promise2 的 onResolvedCallbacks 的尾部，并返回 promise3，这个 promise3 后面没有再用到了，此时第一段代码结束

- `开始执行第二段代码`
- 第 1 个 Promise.resolve()返回一个 promise4
- promise4 会立刻调用它的 resolve 方法，把它的 value 值设置为 undefined,状态设置为完成态,执行成功回调是空数组
- 接着调用 promise4 的 then 方法，因为此时 promise4 已经是完成态了，入队

  ```js
  queueMicrotask(() => {
    console.log('FULFILLED then: microtask', 4);
    let x = onFulfilled(this.value); //x=k
    resolvePromise(newPromise, x, resolve);
  });
  ```

- `然后返回 promise5`
- 然后继续调用 promise5 的 then 方法，发现 promise5 还处于等待态，不能直接添加微任务，只能添加

  ```js
  this.onResolvedCallbacks.push(() => {
    queueMicrotask(() => {
      console.log('PENDING then: microtask', this.id);
      let x = onFulfilled(this.value); //  console.log(2);
      resolvePromise(newPromise, x, resolve);
    });
  });
  ```

- `然后返回 promise6`
- 然后继续调用 promise6 的 then 方法，发现 promise6 还处于等待态，不能直接添加微任务，只能添加

  ```js
  this.onResolvedCallbacks.push(() => {
    queueMicrotask(() => {
      console.log('PENDING then: microtask', this.id);
      let x = onFulfilled(this.value); //  console.log(3);
      resolvePromise(newPromise, x, resolve);
    });
  });
  ```

- `然后返回 promise7`
- 然后继续调用 promise7 的 then 方法，发现 promise7 还处于等待态，不能直接添加微任务，只能添加

  ```js
  this.onResolvedCallbacks.push(() => {
    queueMicrotask(() => {
      console.log('PENDING then: microtask', this.id);
      let x = onFulfilled(this.value); //  console.log(4);
      resolvePromise(newPromise, x, resolve);
    });
  });
  ```

- `然后返回 promise8`
- 然后继续调用 promise8 的 then 方法，发现 promise8 还处于等待态，不能直接添加微任务，只能添加

  ```js
  this.onResolvedCallbacks.push(() => {
    queueMicrotask(() => {
      console.log('PENDING then: microtask', this.id);
      let x = onFulfilled(this.value); //  console.log(5);
      resolvePromise(newPromise, x, resolve);
    });
  });
  ```

- `然后返回 promise9`
- 然后继续调用 promise9 的 then 方法，发现 promise9 还处于等待态，不能直接添加微任务，只能添加

  ```js
  this.onResolvedCallbacks.push(() => {
    queueMicrotask(() => {
      console.log('PENDING then: microtask', this.id);
      let x = onFulfilled(this.value); //  console.log(6);
      resolvePromise(newPromise, x, resolve);
    });
  });
  ```

- 此时，任务列队上有两个新任务 微任务队列 [FULFILLED then: microtask 1，FULFILLED then: microtask 4]
- 把第一个微任务出队 FULFILLED then: microtask 1 执行
- 输出 0
- 创建 promise10 并返回
- 在执行 resolvePromise(promise2, promise10, resolve)的时候，如果发现 promise10 是一个 promise,并且入队

  ```js
  console.log('resolvePromise: microtask 10');
  x.then((y) => resolvePromise(promise, y, resolve));
  ```

- `此时第一个微任务执行完毕`
- 此时任务队列有两个任务[FULFILLED then: microtask 4,resolvePromise: microtask 10]
- 然后执行 FULFILLED then: microtask 4,输出 1
- 然后会将 promise4 变成完成态，执行成功回调，成功回调会把 PENDING then: microtask 5 入队,此时本任务结束
- 此时任务队列 [resolvePromise: microtask 10,PENDING then: microtask 5]
- 然后再执行 resolvePromise: microtask 10,因为 promise10 是直接成功的，直接执行成功回调，入队

  ```js
  console.log('FULFILLED then: microtask 10');
  let x = onFulfilled(this.value);
  resolvePromise(newPromise, x, resolve);
  ```

- `此时队列 [PENDING then: microtask 5,FULFILLED then: microtask 10]`
- 执行 PENDING then: microtask 5,输出 2
- 此时 promise5 变成完成态，执行成功回调，成功回调会把 PENDING then: microtask 6 入队,此时本任务结束
- 此时队列 [FULFILLED then: microtask 10，PENDING then: microtask 6]
- 执行 FULFILLED then: microtask 10,它会让 promise2 变成成功态，并且把 promise2 的成功回调入队
- 此时队列 [PENDING then: microtask 6,FULFILLED then: microtask 2]
- 再执行 PENDING then: microtask 6,输出 3，
- 此时 promise6 变成完成态，执行成功回调，成功回调会把 PENDING then: microtask 7 入队,此时本任务结束
- 此时队列 [FULFILLED then: microtask 2,PENDING then: microtask 7]
- 执行 FULFILLED then: microtask 2，输出 a
- 再执行 PENDING then: microtask 7,输出 4
- 此时 promise7 变成完成态，执行成功回调，成功回调会把 PENDING then: microtask 8 入队,此时本任务结束
- 此时队列 [PENDING then: microtask 8]
- 再执行 PENDING then: microtask 8,输出 5

`打印`

```js
// FULFILLED then: microtask 1
// 0
// FULFILLED then: microtask 4
// 1
// resolvePromise: microtask 10
// PENDING then: microtask 5
// 2
// FULFILLED then: microtask 10
// PENDING then: microtask 6
// 3
// PENDING then: microtask 2
// a
// PENDING then: microtask 7
// 4
// PENDING then: microtask 8
// 5
```

## 题目 6

```js
const Promise = require('./Promise');
Promise.resolve()
  .then(() => {
    console.log(0);
    return new Promise((resolve) => {
      resolve(
        new Promise((resolve) => {
          resolve('a');
        }),
      );
    });
  })
  .then((res) => {
    console.log(res);
  });
Promise.resolve()
  .then(() => {
    console.log(1);
  })
  .then(() => {
    console.log(2);
  })
  .then(() => {
    console.log(3);
  })
  .then(() => {
    console.log(4);
  })
  .then(() => {
    console.log(5);
  });
// 0 1 2 3  4 a 5
```

根据题目 5 的思路 看看是否 能答出来～
