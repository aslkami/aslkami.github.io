---
title: Canvas
---

## `绘制图片模糊`

原因：移动端基本上 Retina 高清屏幕，如果只是 1px 在高清屏幕下展示，就会出现像素点不够，表现张力不够，从而出现模糊问题

解决：将画布放大对应的比例，根据 设备像素比 `dpr` 来

例如 iPhone 67，屏幕宽度 375, `dpr = window.devicePixelRatio`, 屏幕 宽度 `window.screen.width` 以及 高度 `window.screen.width`

```js
// 假设画布是铺满整个屏幕
let dpr = window.devicePixelRatio;
let canvas = document.getElementById('myCanvas');
let ctx = canvas.getContext('2d');
canvas.style.width = window.screen.width = 'px';
canvas.style.height = window.screen.height + 'px';
canvas.width = canvas.width * dpr;
canvas.height = canvas.height * dpr;
```

- `canvas.style.width` 和 `canvas.style.height` 只是肉眼所看的画布
- `canvas.width` 和 `canvas.height` 才是真正的画布大小
- 绘制的时候 也应该 相应比例的 计算来绘制， 例如 原本 大小是 `(50，50)`， 应该绘制成 `(50 * dpr， 50 * dpr)`
- 上面的计算比较麻烦，可以设置画布比例，`ctx.scale(dpr, dpr)`, 然后仍然写 `(50, 50)`

## `ctx.drawImage`

用法：drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)

[MDN 的例子](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Using_images)

MDN 上说的个人感觉有点晦涩，其实常用的基本 2 种，举个 🌰 子：

假设一张图片 是 `600 * 600` 大小

1. `ctx.drawImage(source, 0, 0, 200, 200)`, 表示在 画布 (0, 0) 的 位置，也就是左上角绘制出 一个 `200 * 200` 缩放的图片
2. `ctx.drawImage(source, 0, 0, 200, 200, 50, 50, 300, 300)`, 表示在原图，`(0, 0)` 位置，选取 `200 * 200` 的区域，在画布 `(50, 50)` 的位置, 绘制一个 `300 * 300` 的图片

第二种用法很多参数，刚上手确实有点难记，可以理解为，平时电脑截图， 在某个地方选取一定区域框住，完成截图，复制粘贴即可截屏， 在粘贴的时候相当于在画布绘制选取框住的图片，只不过这图片会进行缩放而已

## `textBaseLine`

```js
ctx.textBaseline = 'top' || 'hanging' || 'middle' || 'alphabetic' || 'ideographic' || 'bottom';
```

默认值: `alphabetic`

![textBaseLine](/images/textBaseLine.png)

绘制图片默认位置是左上角算起的， 文字的却不同， 所以在绘制文字的时候会和设计稿有偏差，通过设置 这个值 为 `top` 即可

## Taro 里创建 Canvas 实例

```js
Taro.createSelectorQuery()
  .select('#myCanvas')
  .node(function (res) {
    console.log(res.node); // 节点对应的 Canvas 实例。
  })
  .exec();
```
