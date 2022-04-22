## Promise A+ 规范测试

- 安装 `promises-aplus-tests`
- `node promise.js`

```js
// promise.js
const STATUS = {
  PENDING: 'PENDING',
  FULFILLED: 'FULFILLED',
  REJECTED: 'REJECTED',
};

/**
 *
 * @param {*} p2 newP
 * @param {*} x then 的返回值
 * @param {*} resolve newP 的 resolve
 * @param {*} reject newP 的reject
 */
function resolvePromise(p2, x, resolve, reject) {
  // 如果是同一个对象则直接返回，因为 自己不能等待自己完成
  if (p2 === x) {
    return reject(new TypeError(`Chaining cycle detected for promise, 😳`));
  }

  // 假设是 x 是 一个对象， 并且有一个 then 方法，那么就把 x 当作是 promise
  if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
    let called = false; // 有些别人的 promise 可以 既可以成功 又可以失败， 兼容这种情况
    try {
      let then = x.then;
      if (typeof then === 'function') {
        // 这里进入 是 promise 的判断， 执行 promise，采用 它的 返回 结果
        then.call(
          x,
          (y) => {
            if (called) return;
            called = true;
            resolvePromise(p2, y, resolve, reject); // 递归执行，因为 promise 里面 还有可能返回 promise, 还要兼容别人的 promise
          },
          (e) => {
            if (called) return;
            called = true;
            reject(e); // 一旦 then里的 promise 调用 reject 了， 就不再解析 失败的结果了
          },
        );
      } else {
        resolve(x); // 不是函数，当成普通值 解析返回
      }
    } catch (error) {
      if (called) return; // 有可能失败了，仍然 改变状态成 成功，兼容一下
      called = true;
      reject(error); // 这里用 try catch 包裹是因为， x.then 有可能是 给 x 进行 definedProperty 加 then 属性， 然后里面 throw new Error
    }
  } else {
    resolve(x);
  }
}

class Promise {
  constructor(executer) {
    this.status = STATUS.PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = (val) => {
      this.status = STATUS.FULFILLED;
      this.value = val;
      this.onFulfilledCallbacks.forEach((fn) => fn());
    };

    const reject = (reason) => {
      this.status = STATUS.REJECTED;
      this.reason = reason;
      this.onRejectedCallbacks.forEach((fn) => fn());
    };

    try {
      executer(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (data) => data;
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : (e) => {
            throw e;
          };

    let newP = new Promise((resolve, reject) => {
      if (this.status === STATUS.FULFILLED) {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value);
            resolvePromise(newP, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }

      if (this.status === STATUS.REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(newP, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }

      if (this.status === STATUS.PENDING) {
        // 异步情况 会等待 异步完成 ，再决定 下一个 then 的走向
        this.onFulfilledCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value);
              resolvePromise(newP, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });

        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason);
              resolvePromise(newP, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
      }
    });

    return newP;
  }
}

Promise.defer = Promise.deferred = function () {
  let dfd = {};
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
};

module.exports = Promise;
```
