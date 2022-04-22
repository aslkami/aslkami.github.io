import Promise from './newPromise';

export default function Practice(logger) {
  let promise1 = Promise.resolve();
  let promise2 = promise1.then(() => {
    console.log(0);
    logger(0);
    let promise10 = Promise.resolve('a');
    return promise10;
  });
  let promise3 = promise2.then((res) => {
    console.log(res);
    logger(res);
  });
  let promise4 = Promise.resolve();
  let promise5 = promise4.then(() => {
    console.log(1);
    logger(1);
  });
  let promise6 = promise5.then(() => {
    console.log(2);
    logger(2);
  });
  let promise7 = promise6.then(() => {
    console.log(3);
    logger(3);
  });
  let promise8 = promise7.then(() => {
    console.log(4);
    logger(4);
  });
  let promise9 = promise8.then(() => {
    console.log(5);
    logger(5);
  });
}

// 0 1 2 3 a 4 5
