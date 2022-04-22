---
toc: menu
---

#### 原型

`JavaScript` 是一种基于原型的语言 (prototype-based language), 每个对象拥有一个原型对象，对象以其原型为模板，从原型继承方法和属性，这些属性和方法定义在对象的构造器函数的 prototype 属性上，而非对象实例本身。

![原型链](/images/prototype.jpeg)

是否看起来有点绕？

#### 笔者是这么记的

1. 所有实例都有个 `__proto__` 属性，指向构造函数原型

```js
function Person() {}
const p = new Person();
p.__proto__ === Person.prototype; // true

// Peroson 可以看作是 Funtion.prototype 的实例
Person.__proto__ === Function.prototype; // true
// 图中 function Object(){}, function Function(){} 也可以看作 Funtion.prototype 的实例，故
Object.__proto__ === Function.prototype; // true
Function.__proto__ === Function.prototype; // true
```

2. 所有构造函数的原型都指向 `Object.prototype`

```js
// Funtion Number String Date Array...
// 上面这些列举的 可以 new 如 new String、new Number的， 都可以看作是 Object 衍生的
// 故他它的原型可以看作由 Object.prototype 创造的，所以 它们是其 子实例， 有 __proto__ 属性 指向 Object.prototype
Function.prototype.__proto__ === Object.prototype; // true
Number.prototype.__proto__ === Object.prototype; // true
String.prototype.__proto__ === Object.prototype; // true
Date.prototype.__proto__ === Object.prototype; // true
Array.prototype.__proto__ === Object.prototype; // true
```

3. `Object.prototype` 由 **null** 衍生出来，所以 `Object.prototype.__proto__` 指向 **null**

4. 整个链条衍生路径

```
null -> Object.prototype -> (Function|Number|String|Date|Array).prototype -> (对应可 new 子实例 | 其它构造函数) -> 孙子实例
```

#### 关于 `__proto__`

- 这是一个访问器属性（即 getter 函数和 setter 函数），通过它可以访问到对象的内部 [[Prototype]] (一个对象或 null )。
- `__proto__` 属性在 ES6 时才被标准化，以确保 Web 浏览器的兼容性，但是不推荐使用，除了标准化的原因之外还有性能问题。为了更好的支持，推荐使用 Object.getPrototypeOf()。
  > 通过改变一个对象的 [[Prototype]] 属性来改变和继承属性会对性能造成非常严重的影响，并且性能消耗的时间也不是简单的花费在 obj.**proto** = ... 语句上, 它还会影响到所有继承自该 [[Prototype]] 的对象，如果你关心性能，你就不应该修改一个对象的 [[Prototype]]。

#### 关于继承

#### 1. 原型继承

```js
function Parent() {
  this.names = ['kevin', 'daisy'];
}

function Child() {}

Child.prototype = new Parent();

var child1 = new Child();

child1.names.push('yayu');

console.log(child1.names); // ["kevin", "daisy", "yayu"]

var child2 = new Child();

console.log(child2.names); // ["kevin", "daisy", "yayu"]
```

- 优点：
  - 每个实例可以共享 原型方法
- 缺点：
  - 虽然可以共享，但引用类型的数据可以篡改
  - 创建 Child 的时候， 不能 向 Parent 传参

#### 2. 借用构造函数继承

```js
function Parent(name) {
  this.name = name;
}

function Child(name) {
  Parent.call(this, name);
}

var child1 = new Child('kevin');

console.log(child1.name); // kevin

var child2 = new Child('daisy');

console.log(child2.name); // daisy
```

- 优点：
  - 可以避免引用类型被篡改数据
  - 可以 向 Parent 传参
- 缺点：
  - 方法都在构造函数中定义，每次创建实例都会创建一遍方法。

#### 3. 组合继承

```js
function Parent(name) {
  this.name = name;
  this.colors = ['red', 'blue', 'green'];
}

Parent.prototype.getName = function () {
  console.log(this.name);
};

function Child(name, age) {
  Parent.call(this, name);

  this.age = age;
}

Child.prototype = new Parent();
Child.prototype.constructor = Child;

var child1 = new Child('kevin', '18');

child1.colors.push('black');

console.log(child1.name); // kevin
console.log(child1.age); // 18
console.log(child1.colors); // ["red", "blue", "green", "black"]

var child2 = new Child('daisy', '20');

console.log(child2.name); // daisy
console.log(child2.age); // 20
console.log(child2.colors); // ["red", "blue", "green"]
```

- 原型 + 构造函数继承，数据独立，解决了每次执行都需要重新创建一份方法的痛点，属于经典的继承

#### 4. 原型式继承

```js
function createObj(o) {
  function F() {}
  F.prototype = o;
  return new F();
}
```

- 就是 ES5 Object.create 的模拟实现，将传入的对象作为创建的对象的原型。

- 缺点：
  - 包含引用类型的属性值始终都会共享相应的值，这点跟原型链继承一样。
  ```js
  var person = {
    name: 'kevin',
    friends: ['daisy', 'kelly'],
  };
  var person1 = createObj(person);
  var person2 = createObj(person);
  person1.name = 'person1';
  console.log(person2.name); // kevin
  person1.friends.push('taylor');
  console.log(person2.friends); // ["daisy", "kelly", "taylor"]
  ```
  - 注意：修改 `person1.name` 的值，`person2.name` 的值并未发生改变，并不是因为 `person1` 和 `person2` 有独立的 `name` 值，而是因为 `person1.name = 'person1'`，给 `person1` 添加了 `name` 值，并非修改了原型上的 `name` 值。

#### 5. 寄生式继承

创建一个仅用于封装继承过程的函数，该函数在内部以某种形式来做增强对象，最后返回对象。

```js
function createObj(o) {
  var clone = Object.create(o);
  clone.sayName = function () {
    console.log('hi');
  };
  return clone;
}
```

- 缺点：
  - 跟借用构造函数模式一样，每次创建对象都会创建一遍方法。

#### 6. 寄生组合式继承

```js
function Parent(name) {
  this.name = name;
  this.colors = ['red', 'blue', 'green'];
}

Parent.prototype.getName = function () {
  console.log(this.name);
};

function Child(name, age) {
  Parent.call(this, name);
  this.age = age;
}

Child.prototype = new Parent();

var child1 = new Child('kevin', '18');

console.log(child1);
```

- 回顾一下 上面组合式继承， 缺点是 调用了 2 次 parent
- 一次是 `Child.prototype = new Parent();` , 另一次是 `var child1 = new Child('kevin', '18');`
- 回想下 new 的模拟实现，其实在这句中，我们会执行： `Parent.call(this, name);`
- 所以，在这个例子中，如果我们打印 child1 对象，我们会发现 `Child.prototype` 和 `child1` 都有一个属性为 `colors`，属性值为 `['red', 'blue', 'green']`。

如果我们不使用 `Child.prototype = new Parent()` ，而是间接的让 `Child.prototype` 访问到 `Parent.prototype` 呢？

```js
function Parent(name) {
  this.name = name;
  this.colors = ['red', 'blue', 'green'];
}

Parent.prototype.getName = function () {
  console.log(this.name);
};

function Child(name, age) {
  Parent.call(this, name);
  this.age = age;
}

// 关键的三步, 借助个中间 函数， child1 -> new F() -> Parent, child1 顺着链找到 Parent 的方法
var F = function () {};

F.prototype = Parent.prototype;

Child.prototype = new F();

var child1 = new Child('kevin', '18');

console.log(child1);
```

封装一下

```js
function object(o) {
  function F() {}
  F.prototype = o;
  return new F();
}

function prototype(child, parent) {
  var prototype = object(parent.prototype);
  prototype.constructor = child;
  child.prototype = prototype;
}

// 当我们使用的时候：
prototype(Child, Parent);
```
