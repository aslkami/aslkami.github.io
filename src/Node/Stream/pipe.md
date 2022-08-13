---
title: Pipe 管道
---

- usage.js

```js
const readableStream = require('./readableStream');
const writableStream = require('./writableStream');
readableStream.pipe(writableStream);
```

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
Readable.prototype.pipe = function (dest) {
  this.on('data', (chunk) => {
    dest.write(chunk);
  });
  this.on('end', () => {
    dest.end();
  });
};
module.exports = Readable;
```
