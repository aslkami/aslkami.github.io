---
title: Transform(转换流)
---

- usage.js

```js
const readableStream = require('./readableStream');
const transformStream = require('./transformStream');
const writableStream = require('./writableStream');
readableStream.pipe(transformStream).pipe(writableStream);
```

- transformStream.js

```js
const Transform = require('./Transform');
const transformStream = new Transform({
  transform(buffer, encoding, next) {
    let transformed = buffer.toString(encoding) + '$';
    next(null, transformed);
  },
});
module.exports = transformStream;
```

- Transform.js

```js
const Duplex = require('./Duplex');
var { inherits } = require('util');
inherits(Transform, Duplex);
function Transform(options) {
  Duplex.call(this, options);
  if (options.transform) this._transform = options.transform;
}
Transform.prototype._write = function (chunk, encoding, next) {
  this._transform(chunk, encoding, (err, data) => {
    if (data) {
      this.push(data);
    }
    next(err);
  });
};
Transform.prototype._read = function () {};
module.exports = Transform;
```
