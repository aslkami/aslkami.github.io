---
title: Promise 非规范 方法
---

## Promise.resolve (静态方法)

```js
constructor() {
  const resolve = (val) => {
    // 如果是 promise 则继续递归解析
    if (val instanceof Promise) {
      return val.then(resolve, reject);
    }

    this.status = STATUS.FULFILLED;
    this.value = val;
    this.onFulfilledCallbacks.forEach((fn) => fn());
  };
}

Promise.resolve = function (value) {
  return new Promise((resolve, reject) => {
    resolve(value);
  });
};

```

- `promise.resolve('ok').then()` 相当于 `new Promise((resolve, reject) => resolve('ok')).then()`
- 但是如果 内容 不是 ok 而是一个 promise 的话， 需要递归解析

## Promise.reject (静态方法)

```js
Promise.reject = function (reason) {
  return new Promise((resolve, reject) => {
    reject(reason);
  });
};
```

- `promise.reject('err').then()` 相当于 `new Promise((resolve, reject) => reject('err')).then()`
- 一旦 `reject` 就不继续解析了

## catch (原型方法)

```js
class Promise {
  catch(errCallback) {
    return this.then(null, errCallback);
  }
}
```

## Promise.all (静态方法)

```js
Promise.all = function (promiseArr = []) {
  return new Promise((resolve, reject) => {
    let result = [];
    let times = 0;
    function processResult(data, index) {
      result[index] = data;
      if (++times === promiseArr.length) {
        resolve(result);
      }
    }

    promiseArr.forEach((p, index) => {
      Promise.resolve(p).then((res) => {
        processResult(res, index);
      }, reject);
    });
  });
};
```

- `Promise.all` 是等参数数组里的所有 `promise` 完成后，再返回结果
- 既然 `Promise.all` 可以 `then`, 那肯定是 返回一个 `Promise`
- 参数有可能是 `非 promise `， 可以把它包装成 `Promise.resolve` ，等待执行完毕后的 结果 传入 `processResult 方法`
- 注意 不能是 `result.length === promiseArr.length` 的时候 `resolve`， 而是引入 计数器去 `resolve`， 因为 `arr[2] = 11, arr.length 为 3`

## Promise.race (静态方法)

```js
Promise.race = function (promiseArr = []) {
  return new Promise((resolve, reject) => {
    promiseArr.forEach((p) => {
      Promise.resolve(p).then(resolve, reject);
    });
  });
};
```

- 特点：谁先返回，采用谁的结果
- 适用于 超时 处理

```js
// 超时处理，谁快用谁的
function wrapPromise(userPromise) {
  let abort;
  const internalPromise = new Promise((resolve, reject) => {
    abort = reject;
  });

  let racePromise = Promise.race([internalPromise, userPromise]);
  racePromise.abort = abort;
  return racePromise;
}
```

## Promise.allSettled (静态方法)

该方法会保留 成功或者失败的 结果

```js
Promise.allSettled = function (promiseArr = []) {
  return new Promise((resolve, reject) => {
    let result = [];
    let times = 0;
    function processResult(data, index, status) {
      result[index] = {
        status,
        value: data,
      };
      if (++times === promiseArr.length) {
        resolve(result);
      }
    }

    promiseArr.forEach((p, index) => {
      Promise.resolve(p).then(
        (res) => {
          processResult(res, index, 'fulfilled');
        },
        (err) => {
          processResult(err, index, 'rejected');
        },
      );
    });
  });
};
```

## finally (原型方法)

```js
class Promise {
  finally(finalCallback) {
    return this.then(
      (data) => {
        return Promise.resolve(finalCallback()).then(() => data);
      },
      (err) => {
        return Promise.resolve(finalCallback()).then(() => {
          throw err;
        });
      },
    );
  }
}

// 例子
Promise.resolve('ok')
  .finally(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('finally~');
        resolve();
      }, 1000);
    });
  })
  .then(
    (res) => {
      console.log(res);
    },
    (err) => {
      console.log(err);
    },
  );
```

- `finally` 无论成功或者失败 都会将上一次的 结果 原封不动的返回给 下一个 `then`
- 如果 `finally` 返回 一个 `promise`， 则会等待 这个 `promise` 结束

## Promisify

如果想要给 node 方法包装成 promise，`fs.readFile().then()` 的形式， 有以下 2 种 方法

```js
const utils = require('util');
utils.promisify('fs'); // 只针对 node 方法

const fs = require('fs').promises; // 模块自带
```

自己实现：

```js
const fs = require('fs');

function promisify(fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      fn(...args, (err, data) => {
        if (err) reject(err);
        resolve(data);
      });
    });
  };
}

function promisifyAll(modules) {
  let result;
  for (let key in modules) {
    result[key] = typeof modules[key] === 'function' ? promisify(modules[key]) : modules[key];
  }
  return result;
}

promisifyAll(fs);
```
