#### bind 的特性

1. 返回一个新函数
2. this 值作为第一个参数 传递给 bind
3. 第二个以及以后的参数加上绑定函数运行时本身的参数按照顺序作为原函数的参数来调用原函数
4. bind 返回的绑定函数也能使用 new 操作符创建对象
5. `bind` 方法与 `call / apply` 最大的不同就是前者返回一个绑定上下文的函数，而后两者是直接执行了函数。
6. 柯里化

#### bind 模拟实现

```js
Function.prototype.myBind = function (context) {
  // 调用方 不是 函数 得报错
  if (typeof this !== 'function') {
    throw new Error('Function.prototype.bind - what is trying to be bound is not callable');
  }

  var bindFn = this; // 绑定的函数
  var args = Array.prototype.slice.call(arguments, 1); // bind 的 剩余参数

  var FNOP = function () {}; // 采用一个新的函数，这样改原型方法 不会影响 上层原型
  var FBound = function () {
    var bindArgs = Array.prototype.slice.call(arguments);
    return bindFn.apply(this instanceof FNOP ? this : context, args.concat(bindArgs));
  };

  FNOP.prototype = this.prototype; // 新函数 继承 绑定函数的原型
  FBound.prototype = new FNOP(); // 返回的函数 继承 空函数的 实例，这样可以顺着链，找到 绑定函数的原型方法

  return FBound;
};

var value = 2;
var foo = {
  value: 1,
};
function bar(name, age) {
  this.habit = 'shopping';
  console.log(this.value);
  console.log(name);
  console.log(age);
}
bar.prototype.friend = 'kevin';

var bindFoo = bar.myBind(foo, 'Jack'); // bind2
var obj = new bindFoo(20); // 返回正确
```
