---
title: objectMode(对象模式)
---

- 默认情况下，流处理的数据是 Buffer/String 类型的值
- 有一个 objectMode 标志，我们可以设置它让流可以接受任何 JavaScript 对象

- objectMode.js

```js
const { Readable, Writable } = require('stream');
const readableIterator = (function (count) {
  return {
    next() {
      count++;
      if (count <= 5) {
        return { done: false, value: { id: count + '' } };
      } else {
        return { done: true, value: null };
      }
    },
  };
})(0);
const readableStream = new Readable({
  objectMode: true,
  read() {
    let { done, value } = readableIterator.next();
    if (done) {
      this.push(null);
    } else {
      this.push(value);
    }
  },
});
const writableStream = new Writable({
  objectMode: true,
  write(data, encoding, next) {
    console.log(data);
    setTimeout(next, 1000);
  },
});
readableStream.pipe(writableStream);
```
