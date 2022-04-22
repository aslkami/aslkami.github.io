#### New 的特性

1. 可以访问自身属性
2. 可以访问原型属性
3. 默认返回 undefined， 可返回其它内容

#### 模拟实现

```js
function create() {
  // 1. 获得构造函数，并删除 arguments 第一个，其它为构造函数的 入参
  const Ctor = [].shift.call(arguments);
  // 2. 创建个对象，继承 构造函数 原型上的 属性
  const obj = Object.create(Ctor.prototype);
  // 3. 执行 实例化 构造函数，绑定 this 实现继承，obj 可以访问到构造函数中的属性
  const result = Ctor.apply(obj, arguments);
  // 4. 优先返回构造函数的返回值
  return result instanceof Object ? result : obj;
}

function Car(color, name) {
  this.color = color;
  return {
    name,
  };
}

var car = create(Car, 'black', 'BMW');

car.color;
car.name;
```
