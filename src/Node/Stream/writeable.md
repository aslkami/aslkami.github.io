---
title: 可写流
---

模拟实现

- usage.js

```js
let writableStream = require('./writableStream');
writableStream.write('1');
writableStream.write('2');
writableStream.write('3');
writableStream.write('4');
writableStream.write('5');
writableStream.end();
```

- writableStream.js

```js
const Writable = require('./Writable');
const writableStream = new Writable({
  write(data, encoding, next) {
    console.log(data.toString(encoding));
    setTimeout(next, 1000);
  },
});
module.exports = writableStream;
```

- Writable.js

```js
const Stream = require('./Stream');
var { inherits } = require('util');
function Writable(options) {
  Stream.call(this, options);
  this._writableState = {
    ended: false,
    writing: false,
    buffer: [],
  };
  if (options.write) this._write = options.write;
}
inherits(Writable, Stream);
Writable.prototype.write = function (chunk) {
  if (this._writableState.ended) {
    return;
  }
  if (this._writableState.writing) {
    this._writableState.buffer.push(chunk);
  } else {
    this._writableState.writing = true;
    this._write(chunk, 'utf8', () => this.next());
  }
};
Writable.prototype.next = function () {
  this._writableState.writing = false;
  if (this._writableState.buffer.length > 0) {
    this._write(this._writableState.buffer.shift(), 'utf8', () => this.next());
  }
};
Writable.prototype.end = function () {
  this._writableState.ended = true;
};
module.exports = Writable;
```

- highWaterMark.js

```js
//const { Writable } = require('stream');
const Writable = require('./Writable');
class WritableStream extends Writable {
  _write = (data, encoding, next) => {
    console.log(data.toString());
    setTimeout(next, 1000);
  };
}
const writableStream = new WritableStream({
  highWaterMark: 1,
});
writableStream.on('finish', () => {
  console.log('finish');
});
let canWrite = writableStream.write('1');
console.log('canWrite:1', canWrite);
canWrite = writableStream.write('2');
console.log('canWrite:2', canWrite);
canWrite = writableStream.write('3');
console.log('canWrite:3', canWrite);
writableStream.once('drain', () => {
  console.log('drain');
  let canWrite = writableStream.write('4');
  console.log('canWrite:4', canWrite);
  canWrite = writableStream.write('5');
  console.log('canWrite:5', canWrite);
  canWrite = writableStream.write('6');
  console.log('canWrite:6', canWrite);
});

/**
  1
  canWrite:1 false
  canWrite:2 false
  canWrite:3 false
  2
  3
  drain
  4
  canWrite:4 false
  canWrite:5 false
  canWrite:6 false
  5
  6
 */

// Writable.js

const Stream = require('./Stream');
var { inherits } = require('util');
function Writable(options) {
  Stream.call(this, options);
  this._writableState = {
    ended: false,
    writing: false,
    buffer: [],
    bufferSize: 0,
  };
  if (options.write) this._write = options.write;
}
inherits(Writable, Stream);
Writable.prototype.write = function (chunk) {
  if (this._writableState.ended) {
    return;
  }
  chunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, 'utf8');
  this._writableState.bufferSize = chunk.length;
  let canWrite = this.options.highWaterMark > this._writableState.bufferSize;
  if (this._writableState.writing) {
    this._writableState.buffer.push(chunk);
  } else {
    this._writableState.writing = true;
    this._write(chunk, 'utf8', () => this.next());
  }
  return canWrite;
};
Writable.prototype.next = function () {
  this._writableState.writing = false;
  if (this._writableState.buffer.length > 0) {
    let chunk = this._writableState.buffer.shift();
    this._write(chunk, 'utf8', () => {
      this._writableState.bufferSize -= chunk.length;
      this.next();
    });
  } else {
    this.emit('drain');
  }
};
Writable.prototype.end = function () {
  this._writableState.ended = true;
};
module.exports = Writable;
```
