const STATUS = {
  PENDING: 'PENDING',
  FULFILLED: 'FULFILLED',
  REJECTED: 'REJECTED',
};

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
    let newP = new Promise((resolve, reject) => {
      if (this.status === STATUS.FULFILLED) {
        try {
          let x = onFulfilled(this.value);
          resolve(x); // 满足 特征 1， 返回的是一个普通值， 会传递给下一次 then 的成功函数
        } catch (error) {
          reject(error); // 满足 特征 2， 出错会走 下一个 then 的失败函数
        }
      }

      if (this.status === STATUS.REJECTED) {
        try {
          let x = onRejected(this.reason);
          resolve(x);
        } catch (error) {
          reject(error);
        }
      }

      if (this.status === STATUS.PENDING) {
        // 异步情况 会等待 异步完成 ，再决定 下一个 then 的走向
        this.onFulfilledCallbacks.push(() => {
          try {
            let x = onFulfilled(this.value);
            resolve(x);
          } catch (error) {
            reject(error);
          }
        });

        this.onRejectedCallbacks.push(() => {
          try {
            let x = onRejected(this.reason);
            resolve(x);
          } catch (error) {
            reject(error);
          }
        });
      }
    });

    return newP;
  }
}

export default Promise;
