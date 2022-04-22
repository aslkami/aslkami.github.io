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
