let fs = require('fs');
setTimeout(() => {
  console.log('1');
  let rs1 = fs.createReadStream(__filename);
  rs1.on('data', () => {
    rs1.destroy();
    setImmediate(() => console.log('setImmediate_a'));
    setTimeout(() => {
      console.log('setTimeout_a');
    });
    console.log('a');
  });
  rs1.on('close', () => console.log('end_a'));
  console.log('2');
  setImmediate(function () {
    console.log('setImmediate1');
    process.nextTick(() => console.log('nextTick1'));
  });
  setImmediate(function () {
    console.log('setImmediate2');
    process.nextTick(() => console.log('nextTick2'));
  });
  console.log('3');
  setTimeout(() => {
    console.log('setTimeout1');
    process.nextTick(() => {
      console.log('nextTick3');
      process.nextTick(() => console.log('nextTick4'));
    });
  });
  setTimeout(() => {
    console.log('setTimeout2');
  });
  console.log('4');
}, 1000);

// 1 2 3 4
// setImmediate1 nextTick1 setImmediate2 nextTick2
// setTimeout1 nextTick3 nextTick4
// setTimeout2
// a setImmediate_a
// end_a
// setTimeout_a
