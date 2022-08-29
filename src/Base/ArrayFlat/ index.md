## 数组扁平化的 5 种 方法

### ES6 flat

```js
let array = [1, 2, [3, 4], [[5, 6, 7]], [[8, [9, 10, [11]]]]];
array.flat(Infinity);
```

### toString

```js
let array = [1, 2, [3, 4], [[5, 6, 7]], [[8, [9, 10, [11]]]]];
array.toString().split(',').map(Number);
```

### JSON.stringify

```js
let array = [1, 2, [3, 4], [[5, 6, 7]], [[8, [9, 10, [11]]]]];
let str = JSON.stringify(array).replace(/[\[\]]/g, '');
str.split(',').map(Number);
```

### Array.some 配合 concat

```js
let array = [1, 2, [3, 4], [[5, 6, 7]], [[8, [9, 10, [11]]]]];
while (array.some((item) => Array.isArray(item))) {
  array = [].concat(...array);
}
console.log(array);
```

### 递归

```js
let array = [1, 2, [3, 4], [[5, 6, 7]], [[8, [9, 10, [11]]]]];
let temp = [];
function getFlatArray(data = []) {
  data.forEach((d) => {
    if (Array.isArray(d)) {
      getFlatArray(d);
    } else {
      temp.push(d);
    }
  });
}
getFlatArray(array);
console.log(temp);
```
