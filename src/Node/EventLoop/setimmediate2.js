const fs = require('fs');
fs.readFile(__filename, () => {
  setTimeout(() => {
    console.log('timeout');
  }, 0);
  // readFile 属于 io 事件，执行完会 check 是否有 immediate，所以先执行 immediate
  setImmediate(() => {
    console.log('immediate');
  });
});

// immediate
// timeout
