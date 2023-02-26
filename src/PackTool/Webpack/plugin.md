---
title: Plugin
order: 3
---

## `插件原理`

```js
class Test {
  apply(compiler) {
    complier.hook.done.tap('test', () => {
      console.log('test');
    });
  }
}
module.export = Test;
```

每个插件都是一个类，并且要提供 `apply` 方法, 在 `webpack 流程` 的第二步，创建 `compiler` 实例后，遍历插件执行 `apply` 方法，获取 `compile` 实例的钩子，并进行注册事件, 在 webpack 构建流程中 会在对应的时机 调用对应的 注册事件

## `Tapable`

插件用到了 `tapable`， 用于注册和调用事件，下面是所涉及功能，并用非源码的方式实现(源码是动态编译的)

### SyncHook

```js
const { SyncHook } = require('tapable');
class Lesson {
  constructor() {
    this.hooks = {
      arch: new SyncHook(['name']),
    };
  }
  tap() {
    this.hooks.arch.tap('node', (name) => {
      console.log('node', name);
    });
    this.hooks.arch.tap('react', (name) => {
      console.log('react', name);
    });
  }
  start() {
    this.hooks.arch.call('saber');
  }
}

let l = new Lesson();
l.tap();
l.start();
```

就是一个发布订阅模式

简易实现：

```js
/**
 * SyncHook 的实现
 */
class SyncHook {
  constructor(args) {
    // args => [name]
    this.tasks = [];
  }
  tap(name, fn) {
    this.tasks.push(fn);
  }
  call(...args) {
    this.tasks.forEach((task) => task(args));
  }
}

let Sync_Hook = new SyncHook(['name']);
Sync_Hook.tap('node', (name) => {
  console.log('node', name); // node [ 'saber', 'berserker' ]
});
Sync_Hook.tap('react', (name) => {
  console.log('react', name); // react [ 'saber', 'berserker' ]
});
Sync_Hook.call('saber', 'berserker');
```

### SyncBailHook

```js
/**
 * 除非返回 undefined，不然执行过程中遇到 返回值为非 undefined 的时候会停止
 */
const { SyncBailHook } = require('tapable');
class Lesson {
  constructor() {
    this.hooks = {
      arch: new SyncBailHook(['name']),
    };
  }
  tap() {
    this.hooks.arch.tap('node', (name) => {
      console.log('node', name);
      return 'stop to learn';
    });
    this.hooks.arch.tap('react', (name) => {
      console.log('react', name);
    });
  }
  start() {
    this.hooks.arch.call('saber');
  }
}

let l = new Lesson();
l.tap();
l.start();
```

简易实现：

```js
/**
 * SyncBailHook 的实现
 */
class SyncBailHook {
  constructor(args) {
    // args => [name]
    this.tasks = [];
  }
  tap(name, fn) {
    this.tasks.push(fn);
  }
  call(...args) {
    let ret;
    let index = 0;
    do {
      ret = this.tasks[index++](args);
    } while (ret === undefined && index < this.tasks.length);
  }
}

let Sync_Bail_Hook = new SyncBailHook(['name']);
Sync_Bail_Hook.tap('node', (name) => {
  console.log('node', name); // node [ 'saber', 'berserker' ]
  return 'stop to learn';
});
Sync_Bail_Hook.tap('react', (name) => {
  console.log('react', name); // 不执行
});
Sync_Bail_Hook.call('saber', 'berserker');
```

### SyncLoopHook

```js
/**
 * 不返回 undefined 的时候 一直执行该函数，直到返回值为 undefined 为止
 */
const { SyncLoopHook } = require('tapable');
class Lesson {
  constructor() {
    this.index = 0;
    this.hooks = {
      arch: new SyncLoopHook(['name']),
    };
  }
  tap() {
    this.hooks.arch.tap('node', (name) => {
      console.log('node', name);
      return ++this.index === 3 ? undefined : '继续学习node';
    });
    this.hooks.arch.tap('react', (name) => {
      console.log('react', name);
    });
    this.hooks.arch.tap('vue', (name) => {
      console.log('vue', name);
    });
  }
  start() {
    this.hooks.arch.call('saber');
  }
}

let l = new Lesson();
l.tap();
l.start();
```

简易实现：

```js
/**
 * SyncLoopHook 的实现
 */
class SyncLoopHook {
  constructor(args) {
    // args => [name]
    this.tasks = [];
  }
  tap(name, fn) {
    this.tasks.push(fn);
  }
  call(...args) {
    let ret;
    this.tasks.forEach((task) => {
      do {
        ret = task(args);
      } while (ret !== undefined);
    });
  }
}

let Sync_Loop_Hook = new SyncLoopHook(['name']);
let total = 0;
Sync_Loop_Hook.tap('node', (name) => {
  console.log('node', name);
  return ++total === 3 ? undefined : '继续学node';
});
Sync_Loop_Hook.tap('react', (name) => {
  console.log('react', name);
});
Sync_Loop_Hook.tap('vue', (name) => {
  console.log('vue', name);
});
Sync_Loop_Hook.call('saber', 'berserker');
```

### SyncWaterfallHook

```js
/**
 * 上一个执行结果的返回值，作为下一个函数的参数
 */
const { SyncWaterfallHook } = require('tapable');
class Lesson {
  constructor() {
    this.hooks = {
      arch: new SyncWaterfallHook(['name']),
    };
  }
  tap() {
    this.hooks.arch.tap('node', (name) => {
      console.log('node', name);
      return '学习完node，学react';
    });
    this.hooks.arch.tap('react', (name) => {
      console.log('react', name);
      return '学习完react，学vue';
    });
    this.hooks.arch.tap('vue', (name) => {
      console.log('vue', name);
    });
  }
  start() {
    this.hooks.arch.call('saber');
  }
}

let l = new Lesson();
l.tap();
l.start();
```

简易实现：

```js
/**
 * SyncWaterfallHook 的实现
 */
class SyncWaterfallHook {
  constructor(args) {
    // args => [name]
    this.tasks = [];
  }
  tap(name, fn) {
    this.tasks.push(fn);
  }
  call(...args) {
    let [first, ...others] = this.tasks;
    let ret = first(args);
    others.reduce((prev, next) => {
      return next(prev);
    }, ret);
  }
}

let Sync_Waterfall_Hook = new SyncWaterfallHook(['name']);
Sync_Waterfall_Hook.tap('node', (name) => {
  console.log('node', name);
  return '学习完node，学react';
});
Sync_Waterfall_Hook.tap('react', (data) => {
  console.log('react', data);
  return '学习完react，学vue';
});
Sync_Waterfall_Hook.tap('vue', (data) => {
  console.log('vue', data);
});
Sync_Waterfall_Hook.call('saber', 'berserker');
```

### AsyncParallelHook

- 异步并行回调函数版本

```js
/**
 * 异步并行
 */
const { AsyncParallelHook } = require('tapable');
class Lesson {
  constructor() {
    this.hooks = {
      arch: new AsyncParallelHook(['name']),
    };
  }
  tap() {
    this.hooks.arch.tapAsync('node', (name, callback) => {
      setTimeout(() => {
        console.log('node', name);
        callback();
      }, 1000);
    });
    this.hooks.arch.tapAsync('react', (name, callback) => {
      setTimeout(() => {
        console.log('react', name);
        callback();
      }, 1000);
    });
  }
  start() {
    this.hooks.arch.callAsync('saber', () => {
      console.log('执行完毕');
    });
  }
}

let l = new Lesson();
l.tap();
l.start();
```

简易实现：

```js
/**
 * 异步并行的循环实现
 */
class AsyncParallelHook {
  constructor(args) {
    // args => [name]
    this.index = 0;
    this.tasks = [];
  }
  tapAsync(name, fn) {
    this.tasks.push(fn);
  }
  callAsync(...args) {
    let finalCallbcak = args.pop();
    let done = () => {
      this.index++;
      if (this.index === this.tasks.length) {
        finalCallbcak();
      }
    };
    this.tasks.forEach((task) => {
      task(args, done);
    });
  }
}

let Async_Parallel_Hook = new AsyncParallelHook(['name']);
Async_Parallel_Hook.tapAsync('node', (name, callback) => {
  setTimeout(() => {
    console.log('node', name);
    callback();
  }, 4000);
});
Async_Parallel_Hook.tapAsync('react', (name, callback) => {
  setTimeout(() => {
    console.log('react', name);
    callback();
  }, 10000);
});
Async_Parallel_Hook.callAsync('saber', 'berserker', () => {
  console.log('执行完毕');
});
```

- 异步并行 promise 版本

```js
/**
 * 异步并行 Promise 版本
 */
const { AsyncParallelHook } = require('tapable');
class Lesson {
  constructor() {
    this.hooks = {
      arch: new AsyncParallelHook(['name']),
    };
  }
  tap() {
    this.hooks.arch.tapPromise('node', (name) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('node', name);
          resolve();
        }, 1000);
      });
    });
    this.hooks.arch.tapPromise('react', (name) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('react', name);
          resolve();
        }, 1000);
      });
    });
  }
  start() {
    this.hooks.arch.promise('saber').then(() => {
      console.log('执行完毕');
    });
  }
}

let l = new Lesson();
l.tap();
l.start();
```

简易实现：

```js
/**
 * 异步串行的 Promise 实现
 */
class AsyncParallelHook {
  constructor(args) {
    // args => [name]
    this.index = 0;
    this.tasks = [];
  }
  tapPromise(name, fn) {
    this.tasks.push(fn);
  }
  promise(...args) {
    let map = this.tasks.map((task) => task(args));
    return Promise.all(map);
  }
}

let Async_Parallel_Hook = new AsyncParallelHook(['name']);
Async_Parallel_Hook.tapPromise('node', (name) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('node', name);
      resolve();
    }, 3000);
  });
});
Async_Parallel_Hook.tapPromise('react', (name) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('react', name);
      resolve();
    }, 1000);
  });
});
Async_Parallel_Hook.promise('saber', 'berserker').then(() => {
  console.log('执行完毕');
});
```

### AsyncSeriesHook

- 异步窜行 回调函数版本

```js
/**
 * 异步串行
 */
const { AsyncSeriesHook } = require('tapable');
class Lesson {
  constructor() {
    this.hooks = {
      arch: new AsyncSeriesHook(['name']),
    };
  }
  tap() {
    this.hooks.arch.tapAsync('node', (name, callback) => {
      setTimeout(() => {
        console.log('node', name);
        callback();
      }, 1000);
    });
    this.hooks.arch.tapAsync('react', (name, callback) => {
      setTimeout(() => {
        console.log('react', name);
        callback();
      }, 1000);
    });
  }
  start() {
    this.hooks.arch.callAsync('saber', () => {
      console.log('执行完毕');
    });
  }
}

let l = new Lesson();
l.tap();
l.start();
```

简易实现：

```js
/**
 * 异步串行的计数器思想实现
 */
class AsyncSeriesHook {
  constructor(args) {
    // args => [name]
    this.index = 0;
    this.tasks = [];
  }
  tapAsync(name, fn) {
    this.tasks.push(fn);
  }
  callAsync(...args) {
    let finalCallbcak = args.pop();
    let next = () => {
      if (this.index === this.tasks.length) {
        return finalCallbcak();
      }
      this.tasks[this.index++](args, next);
    };
    next();
  }
}

let Async_Series_Hook = new AsyncSeriesHook(['name']);
Async_Series_Hook.tapAsync('node', (name, callback) => {
  setTimeout(() => {
    console.log('node', name);
    callback();
  }, 3000);
});
Async_Series_Hook.tapAsync('react', (name, callback) => {
  setTimeout(() => {
    console.log('react', name);
    callback();
  }, 1000);
});
Async_Series_Hook.callAsync('saber', 'berserker', () => {
  console.log('执行完毕');
});
```

- 异步窜行 promise 版本

```js
/**
 * 异步串行 Promise 版本
 */
const { AsyncSeriesHook } = require('tapable');
class Lesson {
  constructor() {
    this.hooks = {
      arch: new AsyncSeriesHook(['name']),
    };
  }
  tap() {
    this.hooks.arch.tapPromise('node', (name) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('node', name);
          resolve();
        }, 4000);
      });
    });
    this.hooks.arch.tapPromise('react', (name) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('react', name);
          resolve();
        }, 1000);
      });
    });
  }
  start() {
    this.hooks.arch.promise('saber').then(() => {
      console.log('执行完毕');
    });
  }
}

let l = new Lesson();
l.tap();
l.start();
```

简易实现：

```js
/**
 * 异步串行的 Promise 实现
 */
class AsyncSeriesHook {
  constructor(args) {
    // args => [name]
    this.index = 0;
    this.tasks = [];
  }
  tapPromise(name, fn) {
    this.tasks.push(fn);
  }
  promise(...args) {
    let [first, ...others] = this.tasks;
    return others.reduce((prev_promise, next_promise) => {
      return prev_promise.then(() => next_promise(args));
    }, first(args));
  }
}

let Async_Parallel_Hook = new AsyncSeriesHook(['name']);
Async_Parallel_Hook.tapPromise('node', (name) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('node', name);
      resolve();
    }, 4000);
  });
});
Async_Parallel_Hook.tapPromise('react', (name) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('react', name);
      resolve();
    }, 2000);
  });
});
Async_Parallel_Hook.promise('saber', 'berserker').then(() => {
  console.log('执行完毕');
});
```
