#### call apply 的特性

1. 可以改变 this 指向
2. 函数可以执行，并且有返回值

#### call 模拟实现

```js
Function.prototype.myCall = function (context) {
  const ctx = context === null ? window : Object(context); // 如果是 null 则指向 window
  ctx.fn = this;

  const args = [...arguments].slice(1);
  const result = ctx.fn(...args);

  delete ctx.fn;
  return result;
};

var value = 2;

var obj = {
  value: 1,
};

function bar(name, age) {
  console.log(this.value);
  return {
    value: this.value,
    name: name,
    age: age,
  };
}

function foo() {
  console.log(this);
}

bar.myCall(null); // 2
foo.myCall(123); // Number {123, fn: ƒ}

bar.myCall(obj, 'kevin', 18);
// 1
// {
//    value: 1,
//    name: 'kevin',
//    age: 18
// }
```

#### apply 模拟实现

```js
Function.prototype.myApply = function (context, ...args) {
  const ctx = context === null ? window : Object(context); // 如果是 null 则指向 window
  ctx.fn = this;

  let result;
  if (!args.length) {
    result = ctx.fn();
  } else {
    result = ctx.fn(...args);
  }

  delete ctx.fn;
  return result;
};

var value = 2;

var obj = {
  value: 1,
};

function bar(name, age) {
  console.log(this.value);
  return {
    value: this.value,
    name: name,
    age: age,
  };
}

function foo() {
  console.log(this);
}

bar.myApply(null); // 2
foo.myApply(123); // Number {123, fn: ƒ}

bar.myApply(obj, 'kevin', 18);
// 1
// {
//    value: 1,
//    name: 'kevin',
//    age: 18
// }
```
