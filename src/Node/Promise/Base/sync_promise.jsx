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

    const resolve = (val) => {
      // 只有 pending 的时候 才能改状态，保证不能 resolve 后再 reject
      if (this.status === STATUS.PENDING) {
        this.value = val;
        this.status = STATUS.FULFILLED;
      }
    };

    const reject = (reason) => {
      if (this.status === STATUS.PENDING) {
        this.reason = reason;
        this.status = STATUS.REJECTED;
      }
    };

    try {
      executer(resolve, reject);
    } catch (error) {
      reject(error); // 同步函数执行出错， 直接 走 reject
    }
  }

  then(onFulfilled, onRejected) {
    if (this.status === STATUS.FULFILLED) {
      onFulfilled(this.value);
    }

    if (this.status === STATUS.REJECTED) {
      onRejected(this.reason);
    }
  }
}

export default Promise;
