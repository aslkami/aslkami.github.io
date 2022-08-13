---
title: Duplex(双工流)
---

- usage.js

```js
const duplexStream = require('./duplexStream');
duplexStream.pipe(duplexStream);
```

- duplexStream.js

```js
const Duplex = require('./Duplex');
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
const duplexStream = new Duplex({
  read() {
    let { done, value } = readableIterator.next();
    if (done) {
      this.push(null);
    } else {
      this.push(value);
    }
  },
  write(data, encoding, next) {
    console.log(data.toString(encoding));
    setTimeout(next, 1000);
  },
});
module.exports = duplexStream;
```

- Duplex.js

```js
const Readable = require('./Readable');
const Writable = require('./Writable');
var { inherits } = require('util');
inherits(Duplex, Readable);
const keys = Object.keys(Writable.prototype);
for (let v = 0; v < keys.length; v++) {
  const method = keys[v];
  if (!Duplex.prototype[method]) {
    Duplex.prototype[method] = Writable.prototype[method];
  }
}
function Duplex(options) {
  Readable.call(this, options);
  Writable.call(this, options);
}

module.exports = Duplex;
```
