---
title: 基金定投基础
order: 18
---

### 基金定投的原理

通过定期定额投资，不停的分批次小额买入基金，使基金的收益曲线更接近宏观经济的走势，变得更加平滑

### 股市是宏观经济的晴雨表

- 人比喻成宏观经济
- 狗比喻成股市
- 遛狗的时候，狗狗都是围绕着主人蹦跶，上串下跳

通过定投可以使得走势更加平缓

|      | 净值 | 投入金 | 份额 |
| :--- | :--- | :----- | :--- |
| 一投 | 1    | 100    | 100  |
| 二投 | 0.5  | 100    | 200  |
| 三投 | 0.2  | 100    | 500  |

花了 300，买了 800 份额， 300/800 = 0.375， 只要净值 回归 0.375 元，就解套了

变额定投：

|      | 净值 | 投入金 | 份额 |
| :--- | :--- | :----- | :--- |
| 一投 | 1    | 100    | 100  |
| 二投 | 0.5  | 200    | 400  |
| 三投 | 0.2  | 400    | 2000 |

花了 700，买了 2500 份额， 700/2500 = 0.28

### 持续定投的问题

- 下跌时坚持定投，亏损比例越来越小
- 上涨时坚持定投，盈利比例越来越小
- 然而从长期看，坚持定投可以获得 不低于 GDP 增速的回报

> 波动剧烈的适合定投，例如指数基金

> 买指数就是买国运

**基金定投不是万能 💊**

只有在合适的时机进场定投，才能发挥最大的效益，保持耐心恒心定投

### 智能定投(2017)

就是通过算法帮用户，变额定投

运用的策略

- 均线策略

  - 运用移动平均线 MA 作为参考指标来指导投资的策略
  - 利用均线估摸着现阶段处于什么阶段，是处于高位还是地位
  - 蚂蚁基金的慧定投就是用的这套策略，假设基础定投金额 500 元， 实际定投将会在 600 - 1050 元定投，大概是 60% - 210%
  - 可以设定比例，参考的均线，参考的指数， 估值高，少买，估值低多买

  | 收盘价大于 180 均线 | 实际扣款率 |
  | :------------------ | :--------- |
  | 0% - 15%            | 90%        |
  | 15% - 50%           | 80%        |
  | 50% -100%           | 70%        |
  | > 100%              | 60%        |

  - 当指数近 10 日振幅超过 5%，即使 低于 180 日均线，估值偏低，定投金额也会减少，振幅少于 5%， 才会多定投
  - 缺点
    - 未充分考虑定投时多估值因素，最长才 500 日均线，才 2 年，至少是 2000 日均线（8 年）
    - 未解决止盈问题

- 风险偏好策略

  - 根据投资者的风险承受能力以及投资时长，智能匹配基金类别和配置比例进行定投
  - 缺点
    - 定投的是一篮子基金组合，但是门槛高，至少 2w 起步
    - 定投成本高，定投的都是主动型基金，申购赎回费、管理费高，而且靠基金经理打理，每段时间都会跟踪不同的基金

- 动态再平衡策略

  - 静态平衡，按照 1:1 配比

    - 假设你有 1w 元，5000 买股票， 5000 买 债券，这是一种静态平衡
    - 过段时间，股票涨到 8000， 债券 跌倒 4000，此时为了平衡，（8+4）/2 = 6， 卖了 2000 股票，买入 2000 债券，达到了静态再平衡

  - 动态再平衡就是不按照 1:1 配置，其中组合定投是，选择关联度不大或负相关的基金品种构建基金定投组合

    - 以蛋卷基金为例
    - 例如斗牛动态平衡，采用 `景顺长城沪深 300 增强型基金`，以及`景顺长城景兴用纯债 A`，每天收盘收根据当日的涨跌幅计算最新的 250 日涨跌幅标准差，然后将计算出的日标准差转化为年标准差，再用 0.1 除以年标准差，获得当日股票基金的比例，剩下的部分投资债券
    - 斗牛 500 动态平衡，采用 `泰达宏利量化股票` 和 `泰达宏利养老混合A`，采用固定收益再加上打新策略的绝对收益型的基金，2017 年的收益 近一年 20%多
    - 严格意义上说，蛋卷基金这种基于特定策略的基金组合产品并不是力哥之前介绍过的 FOF 基金，不会收取额外的管理费，对这种基金组合进行定投，叫做蛋定投

- 二八轮动策略

  - 用量化模型去追涨杀跌，如果发现追踪错了毫无犹豫马上掉头，通过多次轮换来不断积累收益
  - 二，指的是 A 股中只占 20% 数量多大盘股， 八，指的是 占 80% 数量多中小盘股
  - 蛋卷斗牛二八轮动，采用 `天弘沪深300指数基金`， `中证500指数基金`， `天宏永利债券E`，会去对比近 20 个交易日的收盘价格，哪个好买哪个， 都很弱，就买债券基金
  - 遇到震荡股市，二八轮动策略不灵了，频繁换仓会增加哦成本
  - 于是推出了 plus 版本 二八轮动， 计算当天收盘后的沪深 300，中证 500 指数的涨跌幅阈值，与 19 日、20 日、21 个交易日钱的收盘价均值去做对比，换仓指标的敏感性降低了，换仓成本下降了，然而在震荡市里表现依旧不够理想
  - 八仙过海策略，在上面的基础上，再加入行业指数的轮动再平衡
    - 中证大宗商品指数分级
    - 沪深 300 高贝塔指数分级
    - 招商中证全指证券公司指数分级
    - 招商沪深 300 地产等权指数分级
    - 招商中证银行指数分级
    - 招商中证煤炭等权指数分级
    - 招商中证白酒指数分级
    - 招商国证生物医疗药指数分级
    - 招商信用添利债券
  - 2017 年能选的基金代表就只有为数不多的分级母基金（2021 年分级基金不再发行）八仙过海买入和卖出的信号依据上证 50 指数日 k 线与修正后的 40 日均线，日 K 线上穿 修正后 40 日均线，则买入近 10 个交易日涨幅最大的 3 个主题指数
  - 然而，不怕牛市和熊市， 还是怕震荡市
