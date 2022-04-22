setTimeout(function () {
  console.log('timeout');
}, 0);
setImmediate(function () {
  console.log('immediate');
});

// 顺序不一定， 可能是 setTimeout 先执行， 也可能是 setImmediate 先执行
