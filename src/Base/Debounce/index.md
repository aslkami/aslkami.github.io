## 前言

在前端开发中会遇到一些频繁的事件触发，比如

1. window 的 resize、scroll
2. mousedown、mousemove
3. keyup、keydown
4. ...

<code src="./demo.jsx" />

这个例子很简单，所以浏览器完全反应的过来，可是如果是复杂的回调函数或是 ajax 请求呢？假设 1 秒触发了 60 次，每个回调就必须在 1000 / 60 = 16.67ms 内完成，否则就会有卡顿出现。

于是便出现了 防抖 和 节流

## 简单版 防抖

<code src="./debounce.jsx">

上面实现了基础版防抖，需要注意 2 点

- `this` 指向， 原本的 `this` 指向需要被正确的指定，上面 函数式 组件的 `this` 是 `undefined`, 在 `dom0` 事件里 `this` 指向 `dom` 元素，但是不将 `this` 改回来就会指向 `window`
- 参数透传，需要将参数原封不动的传过去

## 立即执行的 防抖

上面的是进入区域后 过 n 秒 才执行函数，现在想要进入区域 立即执行，那么要怎么做呢？实现如下：

<code src="./debounce_immediate.jsx" />

- `immediate` 设置为 true, 则只进入该判断里，没执行就会立即执行，并开启个定时
- 之后一直在区域内移动，不会重新触发执行
- 直到定时器结束后， `timer = null` ，再次在区域内移动才会触发函数执行

上面同时也实现了，取消事件的执行，实现很简单，就是重置 `timer`

值得一提的是 `dom0` 和 `dom2` 取消事件， `dom0` 打印的是 `undefined`，无法取消，只能通过 `dom2` 取消
