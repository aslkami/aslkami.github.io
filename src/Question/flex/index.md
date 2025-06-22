## flex 入门

入门篇观看 [flex 阮一峰教程](https://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)

## flex-1-0-auto-none

[flex-1-0-auto-none](https://www.zhangxinxu.com/wordpress/2020/10/css-flex-0-1-none/)

## flex basis

[flex-basis](https://www.zhangxinxu.com/wordpress/2019/12/css-flex-basis/)

## flex 自适应屏幕

最后一行左对齐

[flex 左对齐](https://www.zhangxinxu.com/wordpress/2019/08/css-flex-last-align/)

- demo

<!-- <code src="./flex_antd_tabs.jsx" /> -->

- 需要注意的是 `.ant-tabs-tabpane` 布局 是 `flex: none`，意味着超出容器高度，将会超出容器展示，不会被包裹，所以需要指定 `container` 的高度

## flex 1 的问题

当高度不定的时候 使用 flex: 1, 放大缩小浏览器的时候，flex 1 的内容不会自适应

解决：指定容器高度

## flex auto 和 flex 1 的宽度计算

```js
Flex 项目的 flex-grow 总和 =  (0 + 1 + 2 + 3 + 4) = 10
Flex 项目的灵活性 = (Flex 容器的剩余空间  ÷ 所有 Flex 项目扩展因子 flex-grow 值总和 × 当前 Flex 项目自身的扩展因子 flex-grow

// 案例1
// Flex 项目的 flex-basis: auto;

Flex 项目 A 的弹性值 = (1000px - 237.52px - 70.26px - 243.30px - 100.69px - 100.11px) ÷ (0 + 1 + 2 + 3 + 4) × 0 = 0px
Flex 项目 A 计算后的 flex-basis 值 = 237.52px + 0 = 237.52px

Flex 项目 B 的弹性值 = (1000px - 237.52px - 70.26px - 243.30px - 100.69px - 100.11px) ÷ (1 + 2 + 3 + 4) × 1 = 24.81px
Flex 项目 B 计算后的 flex-basis 值 = 70.26px + 24.81px = 95.07px

Flex 项目 C 的弹性值 = (1000px - 237.52px - 95.07px - 243.30px - 100.69px - 100.11px) ÷ (2 + 3 + 4) × 2  = 49.62px
Flex 项目 C 计算后的 flex-basis 值 = 243.30px + 49.62px = 292.92px

Flex 项目 D 的弹性值 = (1000px - 237.52px - 95.07px - 292.92px - 100.69px - 100.11px) ÷ (3 + 4) × 3 = 74.44px
Flex 项目 D 计算后的 flex-basis 值 = 100.69px + 74.44px = 175.13px

Flex 项目 E 的弹性值 = (1000px - 237.52px - 95.07px - 292.92px - 175.13px - 100.11px) ÷ 4 × 4  = 99.25px
Flex 项目 E 计算后的 flex-basis 值 = 100.11px + 99.25px = 199.36px

// 案例2
// Flex 项目的 flex-basis: auto; width: 160px

Flex 项目 A 的弹性值 = (1000px - 160px × 5) ÷ (0 + 1 + 2 + 3 + 4) × 0 = 0px
Flex 项目 A 计算后的 flex-basis 值 = 160px + 0 = 160px

Flex 项目 B 的弹性值 = (1000px - 160px - 160px × 4) ÷ (1 + 2 + 3 + 4) × 1 = 20px
Flex 项目 B 计算后的 flex-basis 值 = 160px + 20px = 180px

Flex 项目 C 的弹性值 = (1000px - 160px - 180px - 160px × 3) ÷ (2 + 3 + 4) × 2 = 40px
Flex 项目 C 计算后的 flex-basis 值 = 160px + 40px = 200px

Flex 项目 D 的弹性值 = (1000px - 160px - 180px - 200px - 160px × 2) ÷ (3 + 4) × 3 = 60px
Flex 项目 D 计算后的 flex-basis 值 = 160px + 60px = 220px

Flex 项目 E 的弹性值 = (1000px - 160px - 180px - 200px - 220px - 160px) ÷ 4 × 4 = 80px
Flex 项目 E 计算后的 flex-basis 值 = 160px + 80px = 240px

// 案例1和2对应的 Demo 地址： https://codepen.io/airen/full/GRdmdbw


// 案例3
// Flex 项目的 flex-basis: 0;

Flex 项目 A 的弹性值 = 1000 ÷ (0 + 1 + 2 + 3 + 4) × 0 = 0px
Flex 项目 A 计算后的 flex-basis 值 = 237.5px + 0 = 237.5px (Flex 项目 A 的 min-content)

Flex 项目 B 的弹性值 = (1000px - 237.5px) ÷ (1 + 2 + 3 + 4) × 1  = 76.25px
Flex 项目 B 计算后的 flex-basis 值 = 76.25px + 0 = 76.25px

Flex 项目 C 的弹性值 = (1000px - 237.5px - 76.25px) ÷ (2 + 3 + 4) × 2  = 152.5px
Flex 项目 C 计算后的 flex-basis 值 = 152.5px + 0 = 152.5px

Flex 项目 D 的弹性值 = (1000px - 237.5px - 76.25px - 152.5px) ÷ (3 + 4) × 3 = 228.75px
Flex 项目 D 计算后的 flex-basis 值 = 228.75px + 0 = 228.75px

Flex 项目 E 的弹性值 = (1000px - 237.5px - 76.25px - 152.5px - 228.75px) ÷ 4 × 4  = 305px
Flex 项目 E 计算后的 flex-basis 值 =  305px + 0 = 305px

// 案例4
// Flex 项目的 flex-basis: 0; width: 160px

Flex 项目 A 的弹性值 = 1000px ÷ (0 + 1 + 2 + 3 + 4) × 0 =0px
Flex 项目 A 计算后的 flex-basis 值 = 160px + 0 = 160px (Flex项目 A 不扩展，取其 width 值)

Flex 项目 B 的弹性值 = (1000px - 160px) ÷ (1 + 2 + 3 + 4) × 1  = 84px
Flex 项目 B 计算后的 flex-basis 值 = 84px + 0 = 84px

Flex 项目 C 的弹性值 = (1000px - 160px - 84px) ÷ (2 + 3 + 4) × 2 = 168px
Flex 项目 C 计算后的 flex-basis 值 = 168px + 0 = 168px

Flex 项目 D 的弹性值 = (1000px - 160px - 84px - 168px) ÷ (3 + 4) × 3  = 252px
Flex 项目 D 计算后的 flex-basis 值 = 252px + 0 = 252px

Flex 项目 E 的弹性值 = (1000px - 160px - 84px - 168px - 252px) ÷ 4 × 4  = 336px
Flex 项目 E 计算后的 flex-basis 值 = 336px + 0 = 336px

// 案例3 和 4 对应的 Demo 地址：https://codepen.io/airen/full/bGMRpZp


// 案例5
// 所有 Flex 项目的 flex-basis: 160px

Flex 项目 A 的弹性值 = (1000px - 160px × 5) ÷ (0 + 1 + 2 + 3 + 4) × 0 = 0px
Flex 项目 A 计算后的 flex-basis = 237.5px + 0 = 237.5px （不扩展，取其内容最小尺寸 min-content）

Flex 项目 B 的弹性值 = (1000px - 237.5px - 160px × 4) ÷ (1 + 2 + 3 + 4) × 1 = 12.25px
Flex 项目 B 计算后的 flex-basis 值 = 160px + 12.25px = 172.25px

Flex 项目 C 的弹性值 = (1000px - 237.5px - 172.25px - 160px × 3) ÷ (2 + 3 + 4) × 2 = 24.5px
Flex 项目 C 计算后的 flex-basis 值 = 160px + 24.5px = 184.5px

Flex 项目 D 的弹性值 = (1000px - 237.5px - 172.25px - 184.5px - 160 × 2) ÷ (3 + 4) × 3 = 36.75px
Flex 项目 D 计算后的 flex-basis 值 = 160px + 36.75px = 196.75px

Flex 项目 E 的弹性值 = (1000px - 237.5px - 172.25px - 184.5px - 196.75px - 160px) ÷ 4 × 4 = 49px
Flex 项目 E 计算后的 flex-basis 值 = 160px + 49px = 209px

// 案例6
// 所有 Flex 项目的 flex-basis: 160px; width: 160px
Flex 项目 A 的弹性值 = (1000px - 160px × 5) ÷ (0 + 1 + 2 + 3 + 4) × 0 = 0px
Flex 项目 A 计算后的 flex-basis = 160px + 0 = 160px （不扩展，取其 width 属性值）

Flex 项目 B 的弹性值 = (1000px - 160px - 160px × 4) ÷ (1 + 2 + 3 + 4) × 1 = 20px
Flex 项目 B 计算后的 flex-basis 值 = 160px + 20px = 180px

Flex 项目 C 的弹性值 = (1000px - 160px - 180px - 160px × 3) ÷ (2 + 3 + 4) × 2 = 40px
Flex 项目 C 计算后的 flex-basis 值 = 160px + 40px = 200px

Flex 项目 D 的弹性值 = (1000px - 160px - 180px - 200px - 160px × 2) ÷ (3 + 4) × 3 = 60px
Flex 项目 D 计算后的 flex-basis 值 = 160px + 60px = 220px

Flex 项目 E 的弹性值 = (1000px - 160px - 180px - 200px - 220px - 160px) ÷ 4 × 4 = 80px
Flex 项目 E 计算后的 flex-basis 值 = 160px + 80px = 240px

// 案例 5 和 6 的 Demo 地址： https://codepen.io/airen/full/GRdEqqp
```

- flex grow 总和 小于等于 1 的计算

```js
Flex 项目的 flex-grow 总和 =  (0 + 0.2 + 0.2 + 0.3 + 0.3) = 1
Flex 项目的灵活性 = (Flex 容器的剩余空间  × 当前 Flex 项目自身的扩展因子 flex-grow
Flex 容器的剩余空间 = 1000px - 237.52px - 70.26px - 243.30px - 100.69px - 100.11px = 248.12px

Flex 项目 A 的弹性值 = 248.12px × 0 = 0px
Flex 项目 A 计算后的 flex-basis 值 = 237.52px + 0px = 237.52px

Flex 项目 B 的弹性值 = 248.12px × 0.2 = 49.62px
Flex 项目 B 计算后的 flex-basis 值 = 70.26px + 49.62px = 119.88px

Flex 项目 C 的弹性值 = 248.12px × 0.2 = 49.62px
Flex 项目 C 计算后的 flex-basis 值 = 243.30px + 49.62px = 292.92px

Flex 项目 D 的弹性值 = 248.12px × 0.3 = 74.44px
Flex 项目 D 计算后的 flex-basis 值 = 100.69px + 74.44px = 175.13px

Flex 项目 E 的弹性值 =  248.12px × 0.3 = 74.44px
Flex 项目 E 计算后的 flex-basis 值 = 100.11px + 74.44px = 174.55px

```

- flex grow 总和 大于 1 的计算

```js
Flex 项目的 flex-grow 总和 =  (0.1 + 0.2 + 0.3 + 0.4 + 0.5) = 1.5 > 1
Flex 项目的灵活性 = (Flex 容器的剩余空间  ÷ 所有 Flex 项目扩展因子 flex-grow 值总和 × 当前 Flex 项目自身的扩展因子 flex-grow

Flex 容器的剩余空间 = 1000px - 237.52px - 70.26px - 243.30px - 100.69px - 100.11px = 248.12px

Flex 项目 A 的弹性值 = (1000px - 237.52px - 70.26px - 243.30px - 100.69px - 100.11px) ÷ (0.1 + 0.2 + 0.3 + 0.4 + 0.5) × 0.1 = 16.54px
Flex 项目 A 计算后的 flex-basis 值 = 237.52px + 16.54px = 254.06px

Flex 项目 B 的弹性值 = (1000px - 254.06px - 70.26px - 243.30px - 100.69px - 100.11px) ÷ (0.2 + 0.3 + 0.4 + 0.5) × 0.2 = 33.08px
Flex 项目 B 计算后的 flex-basis 值 = 70.26px + 33.08px = 103.34px

Flex 项目 C 的弹性值 = (1000px - 254.06px - 103.34px - 243.30px - 100.69px - 100.11px) ÷ (0.3 + 0.4 + 0.5) × 0.3 = 49.63px
Flex 项目 C 计算后的 flex-basis 值 = 243.30px + 49.63px = 292.93px

Flex 项目 D 的弹性值 = (1000px - 254.06px - 103.34px - 292.93px - 100.69px - 100.11px) ÷ (0.4 + 0.5) × 0.4 = 66.16px
Flex 项目 D 计算后的 flex-basis 值 = 100.69px + 66.16px = 166.85px

Flex 项目 E 的弹性值 =  (1000px - 254.06px - 103.34px - 292.93px - 166.85px - 100.11px) ÷  0.5  × 0.5 = 82.71px
Flex 项目 E 计算后的 flex-basis 值 = 100.11px + 82.71px = 182.82px
```

## flex-shrink 的计算

```js
Flex 项目的弹性量 = Flex 容器不足空间 ÷ 所有Flex 项目的收缩值（flex-shrink总和） × 当前 Flex 项目的收缩因子（flex-shrink值）
Flex 项目计算后的 flex-basis 值 = Flex 项目的弹性量 + Flex 项目当前的 flex-basis 值

Flex 项目 A 的弹性量 = -500px ÷ (1 + 1 + 1 + 1 + 1) × 1 = -100px
Flex 项目 A 计算后的 flex-basis 值 = -100px + 300px = 200px

// 根据公式计算出来 Flex 项目 A 的 flex-basis 值（其宽度）是 200px ，
// 但这个示例中，因为其内容是一个长单词，它的最小内容长度（min-content）大约是 237.52px 。
// 计算出来的值小于该值（200px < 237.52px），这个时候会取该 Flex 项目内容的最小长度值。
// 因此，Flex 项目 A 计算之后的 flex-basis 值为 237.52px 。

// 计算 Flex 项目B
Flex 容器的不足空间 = 1000px - 237.52px - (300px × 4) = -437.52px

Flex 项目 B 的弹性量 = -437.52px ÷ (1 + 1 + 1 + 1) × 1 = -109.38px
Flex 项目 B 计算后的 flex-basis 值 = -109.38px + 300px = 190.62px

Flex 容器不足空间 = Flex 容器可用空间 - 所有Flex项目的尺寸总和（flex-basis 总和）
Flex 项目的弹性量 = Flex 容器不足空间 ÷ 所有Flex项目的收缩值（flex-shrink总和）× 当前flex项目的flex-shrink
Flex 项目计算后的flex-basis 值 = Flex项目弹性 + Flex项目初设的flex-basis值

// 计算 Flex 项目 C

Flex 项目 C 的弹性量 = (1000px - 237.52px - 190.62px - (300px + 300px + 300px)) ÷ (1 + 1 + 1) × 1  = -109.38px
Flex 项目 C 计算后的 flex-basis 值 = -109.38px + 300px = 190.62px

// 计算 Flex 项目 D
Flex 项目 D 的弹性量 = (1000px - 237.52px - 190.62px - 190.62px - (300px + 300px)) ÷ (1 + 1) × 1  = -109.38px
Flex 项目 D 计算后的 flex-basis 值 = -109.38px + 300px = 190.62px

// 计算 Flex 项目 E
Flex 项目 E 的弹性值 = (1000px - 237.52px - 190.62px - 190.62px - 190.62px - 300px) ÷ 1 × 1  = -109.38px
Flex 项目 E 计算后的 flex-basis 值 = -109.38px + 300px = 190.62px

// flex-basis 取值为 auto 时，且该 Flex 项目未显式设置 width 或 inline-size 属性值（非auto ），那么浏览器将会把 Flex 项目的内容长度作为 flex-basis 的值；
// 反之，有显式设置 width 或 inline-size 属性值（非auto），那么浏览器会把 width 或 inline-size 属性值作为 flex-basis 的值。
```

- 收缩量比 min-content 还小的时候，会一次循环计算

```js
Flex 容器不足空间 = Flex 容器可用空间 - 所有Flex项目的尺寸总和（flex-basis 总和）
Flex 项目的弹性量 = Flex 容器不足空间 ÷ 所有Flex项目的收缩值（flex-shrink总和）× 当前flex项目的flex-shrink
Flex 项目计算后的flex-basis 值 = Flex项目弹性 + Flex项目初设的flex-basis值


Flex 项目 A 的弹性量 = (1000px - 300px - 300px - 300px - 300px - 300px) ÷ (0 + 1 + 2 + 3 + 4) × 0  = 0px
Flex 项目 A 计算后的 flex-basis 值 = 0 + 300px = 300px // 不收缩

Flex 项目 B 的弹性量 = (1000px - 300px - 300px - 300px - 300px - 300px) ÷ (1 + 2 + 3 + 4) × 1  = -50px
Flex 项目 B 计算后的 flex-basis 值 = -50px + 300px = 250px

Flex 项目 C 的弹性量 = (1000px - 300px - 250px - 300px - 300px - 300px) ÷ (2 + 3 + 4) × 2 = -100px
Flex 项目 C 计算后的 flex-basis 值 = -100px + 300px = 200px

Flex 项目 D 的弹性量 = (1000px - 300px - 250px - 200px - 300px - 300px) ÷ (3 + 4) × 3 = -150px
Flex 项目 D 计算后的 flex-basis 值 = -150px + 300px = 150px

Flex 项目 E 的弹性量 = (1000px - 300px - 250px - 200px - 150px - 300px) ÷ 4 × 4 = -200px
Flex 项目 E 计算后的 flex-basis 值 = -200px + 300px = 100px


// 按照公式计算出来的 Flex 项目 E 的 flex-basis 尺寸是 100px ，它小于 Flex 项目 E 的内容最小尺寸（min-content），大约 233.38px。因为 Flex 项目收缩不会小于其最小内容尺寸（也就是不会小于 233.38px ）。这个时候 Flex 容器的不足空间也随之产生了变化：
// Flex 项目 A 的 flex-shrink 值等于 0 ，它不做任何收缩，因此它的宽度就是 flex-basis 初设的值，即 300px 。
// Flex 项目 E 计算之后的 flex-basis 值小于 min-content ，因此，它的 flex-basis 的值是 min-content ，在该例中大约是 233.38px。

// Flex 容器的不足空间 = 1000px - 300px - 233.38px - 300px - 300px - 300px = -433.38px

// 即，大约 433.38px 的不足空间再次按收缩因子的比例划分给 Flex 项目 B (flex-shrink: 1)、Flex 项目 C （flex-shrink: 2） 和 Flex 项目 D (flex-shrink: 3)。也就是说，Flex 项目 A 和 Flex 项目 E 不再参与第二次的计算了：

Flex 项目 B 的弹性量 = (1000px - 300px - 233.38px - 300px - 300px - 300px) ÷ (1 + 2 + 3) × 1 = -72.23px
Flex 项目 B 计算后的 flex-basis 值 = -72.23px + 300px = 227.77px

Flex 项目 C 的弹性量 = (1000px - 300px - 233.38px - 227.77px - 300px - 300px) ÷ (2 + 3) × 2 = -144.46px
Flex 项目 C 计算后的 flex-basis 值 = -144.46px + 300px = 155.54px

Flex 项目 D 的弹性量 = (1000px - 300px - 233.38px - 227.77px - 155.54px - 300px) ÷ 3 × 3 = -216.69px
Flex 项目 D 计算后的 flex-basis 值 = -216.69px + 300px = 83.31px

// 不幸的是，浏览器在进行第二轮计算的时候，又碰到了 Flex 项目 D 计算出来的 flex-basis 值 83.31px ，它也小于它内容的最小长度（min-content），大约 100.69px 。它也不能再做任何收缩。因此，浏览器需要再做第三轮计算，即 Flex 项目 B 和 Flex 项目 C 接着重新计算：

Flex 容器不足空间 = 1000px - 300px - 233.38px - 100.69px - 300px - 300px = -234.07px

Flex 项目 B 的弹性量 = (1000px - 300px - 233.38px - 100.69px - 300px - 300px) ÷ (1 + 2) × 1 = -78.02px
Flex 项目 B 计算后的 flex-basis 值 = -78.02px + 300px = 221.98px

Flex 项目 C 的弹性量 = (1000px - 300px - 233.38px - 100.69px - 221.98px - 300px) ÷ 2 × 2 = -156.05px
Flex 项目 C 计算后的 flex-basis 值 = -156.05px + 300px = 143.95px
```

- flex-shrink 小于 1 的 计算

```js
Flex 项目的 flex-shrink 总和 =  (0.1 + 0.1 + 0.1 + 0.1 + 0.1) = 0.5 < 1
Flex 项目的灵活性 = (Flex 容器的不足空间  × 当前 Flex 项目自身的扩展因子 flex-shrink
Flex 容器的不足空间 = 1000px - 300px - 300px - 300px - 300px - 300px = -500px

Flex 项目 A 的弹性值 = -500px × 0.1 = -50px
Flex 项目 A 计算后的 flex-basis 值 = -50px + 300px = 250px

Flex 项目 B 的弹性值 = -500px × 0.1 = -50px
Flex 项目 B 计算后的 flex-basis 值 = -50px + 300px = 250px

Flex 项目 C 的弹性值 = -500px × 0.1 = -50px
Flex 项目 C 计算后的 flex-basis 值 = -50px + 300px = 250px

Flex 项目 D 的弹性值 = -500px × 0.1 = -50px
Flex 项目 D 计算后的 flex-basis 值 = -50px + 300px = 250px

Flex 项目 E 的弹性值 =  -500px × 0.1 = -50px
Flex 项目 E 计算后的 flex-basis 值 = -50px + 300px = 250px
```
