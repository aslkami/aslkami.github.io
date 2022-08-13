---
title: 可读流
---

模拟实现

- usage.js

```js
const readableStream = require('./readableStream');
readableStream.on('data', (data) => {
  console.log(data);
  readableStream.pause();
});
```

- readableStream.js

```js
const Readable = require('./Readable');
const readableIterator = (function (count) {
  return {
    next() {
      count++;
      if (count <= 5) {
        return { done: false, value: count + '' };
      } else {
        return { done: true, value: null };
      }
    },
  };
})(0);

const readableStream = new Readable({
  read() {
    let { done, value } = readableIterator.next();
    if (done) {
      this.push(null);
    } else {
      this.push(value);
    }
  },
});
module.exports = readableStream;
```

- Readable.js

```js
const Stream = require('./Stream');
var { inherits } = require('util');
function Readable(options) {
  Stream.call(this, options);
  this._readableState = { ended: false, buffer: [], flowing: false };
  if (options.read) this._read = options.read;
}
inherits(Readable, Stream);
Readable.prototype.on = function (event, fn) {
  Stream.prototype.on.call(this, event, fn);
  if (event === 'data') {
    this.resume();
  }
};
Readable.prototype.resume = function () {
  this._readableState.flowing = true;
  while (this.read());
};
Readable.prototype.pause = function () {
  this._readableState.flowing = false;
};
Readable.prototype.read = function () {
  if (!this._readableState.ended && this._readableState.flowing) {
    this._read();
  }
  let data = this._readableState.buffer.shift();
  if (data) {
    this.emit('data', data);
  }
  return data;
};
Readable.prototype.push = function (chunk) {
  if (chunk === null) {
    this._readableState.ended = true;
  } else {
    this._readableState.buffer.push(chunk);
  }
};
module.exports = Readable;
```

- Stream.js

```js
const EventEmitter = require('events');
var { inherits } = require('util');
function Stream(options) {
  this.options = options;
  EventEmitter.call(this);
}
inherits(Stream, EventEmitter);
module.exports = Stream;
```

可读流是 创建一个 可读流 继承自 `Readable` ， 用户自己实现 `_read` 方法，`Readable` 会 调用 `内部 read 方法`，然后调用用户 的 `_read 方法`, 用户的 `_read` 调用 父级的 `push` 存放数据， 父级来通知数据的读取存储状况
