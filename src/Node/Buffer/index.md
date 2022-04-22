## 编码的发展

一个字节由 8 个位组成，gbk 中一个汉字 2 个字节，utf8 中一个汉字 3 个字节

- ASCII 编码
- GB2312
- GBK
- GB18030
- Unicode
- UTF-8

Node 中不支持 GBK 编码，我们需要将 GBK 转为 UTF8 编码

```js
var iconv = require('iconv-lite');
function readGBKText(pathname) {
  var bin = fs.readFileSync(pathname);
  return iconv.decode(bin, 'gbk');
}
```

## 进制转化

```js
//把任意进制转成十进制
console.log(parseInt('20', 10)); //20
console.log(parseInt('11', 2)); //3
console.log(parseInt('20', 16)); //32
//把十进制转成任意进制
console.log((3).toString(2)); //11
console.log((3).toString(2)); //11
console.log((77).toString(8)); //115
console.log((77).toString(16)); //4d
console.log((17).toString(8)); //21
```

## Buffer 的应用

1. 定义 buffer 的三种方式

```js
let buf1 = Buffer.alloc(6);
let buf2 = Buffer.from('名侦探柯南');
let buf3 = Buffer.from([34, 35, 36]);
```

2. buffer 中常用的方法

- buff.toString()
- buff.fill()
- buff.slice()
- buff.copy
- Buffer.concat()
- Buffer.isBuffer()
- indexOf

3. copy 模拟实现

```js
Buffer.prototype.copy = function (targetBuffer, targetStart, sourceStart, sourceEnd) {
  for (let i = sourceStart; i < sourceEnd; i++) {
    targetBuffer[targetStart++] = this[i];
  }
};
```

4. concat 模拟实现

```js
Buffer.concat = function (bufferList, len = bufferList.reduce((a, b) => a + b.length, 0)) {
  let buffer = Buffer.alloc(len);
  let offset = 0;
  bufferList.forEach((buf) => {
    buf.copy(buffer, offset);
    offset += buf.length;
  });
  return buffer;
};
```

5. 封装 buffer.split 方法

```js
Buffer.prototype.split = function (sep) {
  // slice + indexOf = split
  let arr = [];
  let len = Buffer.from(sep).length; //  分割符号的长度
  let offset = 0;
  let current;
  while (-1 != (current = this.indexOf(sep, offset))) {
    // 找到的位置 加上偏移量
    arr.push(this.slice(offset, current));
    offset = current + len;
  }
  arr.push(this.slice(offset));
  return arr;
};
```

6. base64 转化

```js
const CHARTS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
function transfer(str) {
  let buf = Buffer.from(str); // a 的 16进制 61
  let result = '';
  for (let b of buf) {
    result += b.toString(2); // 61 的 10进制 是 97， 转 二进制 1100001
  }
  console.log(result);
  return result
    .match(/(\d{6})/g)
    .map((val) => parseInt(val, 2)) // "110000" -> 转 10进制 -> 32 + 16 = 48
    .map((val) => CHARTS[val]) // 下标 48 第 对应的是 w
    .join('');
}
let r = transfer('a');
console.log(r); // w
```

## 前端二进制

前端最常用的 Blob 对象 binary large object (是不可变的) 代表的是文件类型

1. 前端下载 html 功能

```js
let str = `<h1>hello world</h1>`;
const blob = new Blob([str], {
  type: 'text/html',
});
let a = document.createElement('a');
a.setAttribute('download', 'a.html');
a.href = URL.createObjectURL(blob);
document.body.appendChild(a);
```

2. 前端文件预览

- 使用 fileReader 来实现

```js
file.addEventListener('change', (e) => {
let file = e.target.files[0];
let fileReader = new FileReader();
fileReader.onload = function () {
  let img = document.createElement('img');
  img.src = fileReader.result;
  document.body.appendChild(img)
}
fileReader.readAsDataURL(file);
```

- createObjectURL 来实现

```js
let r = URL.createObjectURL(file);
let img = document.createElement('img');
img.src = r;
document.body.appendChild(img);
URL.revokeObjectURL(r);
```

3. arrayBuffer(浏览器中的二进制)

```js
let buffer = new ArrayBuffer(4); // 创造4个字节
let x1 = new Uint8Array(buffer);
x1[0] = 1; // 00000000 00000000 11111111 00000001
x1[1] = 255;
console.log(x1); // [1,255,0,0]

let x2 = new Uint16Array(buffer);
console.log(x2); // [65281,0]

let x3 = new Uint32Array(buffer);
console.log(x3); // [65281]
```

> arraybuffer 不能被直接修改

4. 字符串和 arrayBuffer 转化

- 字符串转化成 arrayBuffer

```js
function stringToArrayBuffer(str) {
  // utf16 不管是字符还是汉字
  let buffer = new ArrayBuffer(str.length * 2);
  let view = new Uint16Array(buffer);
  for (let i = 0; i < str.length; i++) {
    view[i] = str.charCodeAt(i);
  }
  return buffer;
}
```

- arrayBuffer 转化成字符串

```js
function ArrayBufferToString(buf) {
  return String.fromCharCode(...new Uint16Array(buf));
}
```

5. responseType: 'arrayBuffer'

```js
function request(url, method = 'get') {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.send();
  });
}
request('/download').then((arraybuffer) => {
  let b = new Blob([arraybuffer]);
  let blobUrl = URL.createObjectURL(b);
  let a = document.createElement('a');
  a.href = blobUrl;
  a.download = 'a.pdf';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(blobUrl);
});
```

服务端代码

```js
const express = require('express');
const app = express();
app.listen(4444);
app.use(express.static(__dirname));
app.get('/download', (req, res) => {
  res.download('a.pdf');
});
```
