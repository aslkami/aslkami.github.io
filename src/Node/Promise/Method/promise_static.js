// import Promise from './promise';

Promise.resolve = function (value) {
  return new Promise((resolve, reject) => {
    resolve(value);
  });
};

Promise.reject = function (reason) {
  return new Promise((resolve, reject) => {
    reject(reason);
  });
};

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

Promise.race = function (promiseArr = []) {
  return new Promise((resolve, reject) => {
    promiseArr.forEach((p) => {
      Promise.resolve(p).then(resolve, reject);
    });
  });
};

function wrapPromise(userPromise) {
  let abort;
  const internalPromise = new Promise((resolve, reject) => {
    abort = reject;
  });

  let racePromise = Promise.race([internalPromise, userPromise]);
  racePromise.abort = abort;
  return racePromise;
}

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
