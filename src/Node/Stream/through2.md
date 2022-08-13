---
title: through2
---

- through2 是一个简单的流处理模块，它提供了一个简单的接口，可以让我们更加方便地处理流

- usage.js

```js
const fs = require('fs');
const through2 = require('./through2');
const readableStream = require('./readableStream');
const writableStream = require('./writableStream');
const transformStream = through2(function (chunk, encoding, next) {
  let transformed = chunk.toString(encoding) + '$';
  next(null, transformed);
});
readableStream.pipe(transformStream).pipe(writableStream);

const fs = require('fs');
const through2 = require('through2');
const fileStream = fs.createReadStream('data.txt', { highWaterMark: 10 });
const all = [];
fileStream
  .pipe(
    through2.obj(function (chunk, encoding, next) {
      this.push(JSON.parse(chunk));
      next();
    }),
  )
  .on('data', (data) => {
    all.push(data);
  })
  .on('end', () => {
    console.log(all);
  });
```

- through2.js

```js
const Transform = require('./Transform');
const { Transform } = require('stream');
function through2(transform) {
  return new Transform({
    transform,
  });
}
through2.obj = function (transform) {
  return new Transform({
    objectMode: true,
    transform,
  });
};
module.exports = through2;
```

- data.txt

```txt
{"id":1}
{"id":2}
{"id":3}
```
