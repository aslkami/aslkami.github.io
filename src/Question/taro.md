---
title: Taro
---

## `1. Taro.createSelectorQuery().select('#myCanvas')` 问题

```js
Taro.createSelectorQuery()
  .select('#myCanvas')
  .node(function (res) {
    console.log(res.node); // 节点对应的 Canvas 实例。
  })
  .exec();
```

描述：点击事件 多次调用时， node 获取的 回调 有可能会打印多次

解决： 放在 exec 里执行， 如下

```js
Taro.createSelectorQuery()
  .select('#myCanvas')
  .node()
  .exec((res) => {
    const [queryNode] = res;
    const node = queryNode;
  });
```

## `2. scroll-view`

描述：scroll-view 在有 fixed 定位的时候 样式错误

解决：一开始隐藏节点，或者 fixed 定位的元素 放在最外层

## `3. 原生组件`

描述：有些原生组件如 input，即使放在弹窗里，它也会渲染

解决：通过条件控制渲染
