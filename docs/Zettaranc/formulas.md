---
title: 公式
order: 4
---

### 指标公式

- 知行中期多空短线

  ```shell
    M1:=3;
    M2:=6;
    M3:=12;
    M4:=24;
    知行中期多空短线:EMA(EMA(C,10),10),COLORGREEN,LINETHICK1;
    MA1:MA(CLOSE,60);
    MA2:=EMA(CLOSE,13);
    A1:=REF(O,1);
    A2:=ABS((REF(C,1)-A1)/A1);
    A3:=ABS((REF(H,1)-A1)/A1);
    A4:=ABS((REF(L,1)-A1)/A1);
    B1:=ABS((A2+A3+A4)/3);
    B2:=O*B1;
    预测低:=O-B2,LINETHICK0;
    最低价:=LOW,COLORYELLOW,LINETHICK0;
    BBI:(MA(CLOSE,M1)+MA(CLOSE,M2)+MA(CLOSE,M3)+MA(CLOSE,M4))/4,COLORWHITE;
  ```

- 单针 20

  ```shell
    N1:=3;
    N2:=21;
    短期:100*(C-LLV(L,N1))/(HHV(C,N1)-LLV(L,N1)),COLORWHITE;
    中期:=100*(C-LLV(L,10))/(HHV(C,10)-LLV(L,10)),COLORYELLOW;
    中长期:=100*(C-LLV(L,20))/(HHV(C,20)-LLV(L,20)),COLORMAGENTA;
    长期:100*(C-LLV(L,N2))/(HHV(C,N2)-LLV(L,N2)),COLORRED,LINETHICK2;
    四线归零买:=IF((短期<=6 AND 中期<=6 AND 中长期<=6 AND 长期<=6),-30,0),STICK,COLOR0000FF,LINETHICK3;
    白线下20买:=IF(短期<=20 AND 长期>=60,-30,0),STICK,COLOR00FFFF,LINETHICK3;
    白穿红线买:=IF(((CROSS(短期,长期)AND 长期<20)),-30,0),STICK,COLOR00FF00,LINETHICK3;
    白穿黄线买:=IF(((CROSS(短期,中期)AND 中期<30)),-30,0),STICK,COLORFF9150,LINETHICK3;
    80,COLORYELLOW;
    20,COLORYELLOW;
  ```

- 自定义 KDJ

  ```shell
    N:=9;
    M1:=3;
    M2:=3;
    VAR1:=HHV(HIGH,N);
    VAR2:=LLV(LOW,N);
    RSV:=(CLOSE-VAR2)/(VAR1-VAR2)*100;
    K:SMA(RSV,M1,1);
    D:SMA(K,M2,1);
    J:3*K-2*D;
    0,COLORCYAN;
    100,COLORRED;
  ```

- 自定义 EMA

  ```shell
    EMA_F:EMA(CLOSE,5),COLORCYAN;
    EMA_T:EMA(CLOSE,10),COLORYELLOW;
    MA60:MA(CLOSE,60),COLORLIRED;
  ```

- 自定义 RSI
  ```shell
    N1:=3;
    N2:=3;
    N3:=3;
    LC:=REF(CLOSE,1);
    RSI1:SMA(MAX(CLOSE-LC,0),N1,1)/SMA(ABS(CLOSE-LC),N1,1)*100;
    RSI2:SMA(MAX(CLOSE-LC,0),N2,1)/SMA(ABS(CLOSE-LC),N2,1)*100;
    RSI3:SMA(MAX(CLOSE-LC,0),N3,1)/SMA(ABS(CLOSE-LC),N3,1)*100;
    20,COLORCYAN;
    80,COLORRED;
  ```

### 选股公式

- 多空选股

  ```shell
    市值:=FINANCE(40);
    市值大于50:=市值>5000000000;
    EMA5:=EMA(C,5);
    EMA10:=EMA(C,10);
    EMA上穿:=CROSS(EMA5,EMA10);
    EMA上穿 AND 市值大于50;
  ```

- 严格多空

  ```shell
    市值:=FINANCE(40);
    市值大于50:=市值>5000000000;
    成交量放大:=VOL>MA(VOL,10);
    RSV值:=(C-LLV(L,9))/(HHV(H,9)-LLV(L,9))*100;
    K值:=SMA(RSV值,3,1);
    D值:=SMA(K值,3,1);
    J值:=3*K值-2*D值;
    前10日J小于0:=COUNT(J值<=12,15) >=1;
    EMA5:=EMA(C,5);
    EMA10:=EMA(C,10);
    EMA上穿:=CROSS(EMA5,EMA10);
    EMA上穿 AND 市值大于50 AND 成交量放大 AND 前10日J小于0;
  ```

- J 大负值

  ```shell
    J:=12;
    R:=21;
    N1:=3;
    N2:=21;
    RSV值:=(C-LLV(L,9))/(HHV(H,9)-LLV(L,9))*100;
    K值:=SMA(RSV值,3,1);
    D值:=SMA(K值,3,1);
    J值:=3*K值-2*D值;
    短期:=100*(C-LLV(L,N1))/(HHV(C,N1)-LLV(L,N1)),COLORBLUE;
    长期:=100*(C-LLV(L,N2))/(HHV(C,N2)-LLV(L,N2)),COLORRED,LINETHICK2;
    LC:=REF(CLOSE,1);
    自定义RSI:=SMA(MAX(CLOSE-LC,0),N3,1)/SMA(ABS(CLOSE-LC),N3,1)*100;
    红白线接近零:=长期<10 AND 短期<10;
    红白线:=短期<=长期 OR 红白线接近零;
    J值<J AND 自定义RSI<R;
  ```

- RSI 选股

  ```shell
    N1:=3;
    N2:=21;
    N3:=3;
    R:=30;
    短期:=100*(C-LLV(L,N1))/(HHV(C,N1)-LLV(L,N1)),COLORBLUE;
    长期:=100*(C-LLV(L,N2))/(HHV(C,N2)-LLV(L,N2)),COLORRED,LINETHICK2;
    LC:=REF(CLOSE,1);
    RSI3:=SMA(MAX(CLOSE-LC,0),N3,1)/SMA(ABS(CLOSE-LC),N3,1)*100;
    长期>=45 AND 短期<=30 AND RSI3<=R;
  ```

- N 型回调

  ```shell
    N1:=3;
    N2:=21;
    J:=13;
    R:=25;
    RSV值:=(C-LLV(L,9))/(HHV(H,9)-LLV(L,9))*100;
    K值:=SMA(RSV值,3,1);
    D值:=SMA(K值,3,1);
    J值:=3*K值-2*D值;
    DIF值:=EMA(C,12)-EMA(C,26);
    DEA值:=EMA(DIF值,9);
    MACD值:=2*(DIF值-EMA(DIF值,9));
    双线为正:=DIF值>=0 AND DEA值>=0;
    长期:=100*(C-LLV(L,N2))/(HHV(C,N2)-LLV(L,N2)),COLORRED,LINETHICK2;
    LC:=REF(CLOSE,1);
    自定义RSI:=SMA(MAX(CLOSE-LC,0),N1,1)/SMA(ABS(CLOSE-LC),N1,1)*100;
    J值<J AND 自定义RSI<R AND 双线为正 AND 长期>=40;
  ```

- 板块选股

  ```shell
    N1:=3;
    LC:=REF(CLOSE,1);
    RSI1:=SMA(MAX(CLOSE-LC,0),N1,1)/SMA(ABS(CLOSE-LC),N1,1)*100;
    RSV值:=(C-LLV(L,9))/(HHV(H,9)-LLV(L,9))*100;
    K值:=SMA(RSV值,3,1);
    D值:=SMA(K值,3,1);
    J值:=3*K值-2*D值;
    可控核聚变:=INBLOCK('可控核聚变') OR INBLOCK('磁约束') OR INBLOCK('人造太阳') OR INBLOCK('核能核电') OR INBLOCK('虚拟电厂');
    创新药:=INBLOCK('创新药') OR INBLOCK('创新药概念') OR INBLOCK('生物制药') OR INBLOCK('化学制药') OR INBLOCK('CXO') OR INBLOCK('CRO');
    固态电池:=INBLOCK('固态电池') OR INBLOCK('锂电') OR INBLOCK('储能') OR INBLOCK('动力电池回收') OR INBLOCK('燃烧电池') OR INBLOCK('氢能源') OR INBLOCK('硫化物');
    稳定币:=INBLOCK('数字货币') OR INBLOCK('跨境支付') OR INBLOCK('区块链');
    科技:=INBLOCK('数据要素') OR INBLOCK('云服务') OR INBLOCK('液冷服务器') OR INBLOCK('东数西算') OR INBLOCK('算力租赁') OR INBLOCK('云存储') OR INBLOCK('AIGC') OR INBLOCK('AIDC') OR INBLOCK('AI') OR INBLOCK('CPO') OR INBLOCK('数据中心') OR INBLOCK('智能体') OR INBLOCK('机器视觉') OR INBLOCK('减速器') OR INBLOCK('人工智能') OR INBLOCK('具身智能') OR INBLOCK('人形机器人') OR INBLOCK('机器人') OR INBLOCK('工业母机') OR INBLOCK('传感器') OR INBLOCK('电机') OR INBLOCK('半导体') OR INBLOCK('先进封装') OR INBLOCK('存储芯片') OR INBLOCK('集成电路') OR INBLOCK('PCB') OR INBLOCK('毫米波雷达') OR INBLOCK('芯片');
    军工:=INBLOCK('国防军工') OR INBLOCK('商业航天') OR INBLOCK('中兵系') OR INBLOCK('中航工业系') OR INBLOCK('航空发动机') OR INBLOCK('军贸概念') OR INBLOCK('军工信息化') OR INBLOCK('地面兵装')  OR INBLOCK('军民融合');
    新质生产力:=INBLOCK('量子科技') OR INBLOCK('超导') OR INBLOCK('可控核聚变') OR INBLOCK('新材料') OR INBLOCK('基因测序与编辑') OR INBLOCK('细胞治疗') OR INBLOCK('新型储能') OR INBLOCK('新兴装备') OR INBLOCK('未来显示') OR INBLOCK('具身智能') OR INBLOCK('脑机接口') OR INBLOCK('合成生物') OR INBLOCK('数字医疗') OR INBLOCK('海洋经济') OR INBLOCK('无人驾驶') OR INBLOCK('智能驾驶');
    板块:=可控核聚变 OR 创新药 OR 稳定币 OR 科技 OR 军工 OR 新质生产力;
    J值<J AND RSI1<R AND 板块;
  ```

- 完美图形

  ```shell
  {通达信选股公式 - 振幅筛选（修正版）}
  沪市主板 := CODELIKE('6');  {判断股票代码是否以6开头，即沪市主板}
  当日振幅 := (HIGH - LOW) / LOW * 100;  {计算振幅：(最高价-最低价)/最低价×100%}

  {条件：沪市主板振幅<4%，其他市场<7%}
  振幅 := IF(沪市主板, 当日振幅 < 4, 当日振幅 < 7);

  知行短期趋势线:=EMA(EMA(C,10),10);

  RSV值:=(C-LLV(L,9))/(HHV(H,9)-LLV(L,9))*100;
  K值:=SMA(RSV值,3,1);
  D值:=SMA(K值,3,1);
  J值:=3*K值-2*D值;

  N3:=3;
  LC:=REF(CLOSE,1);
  RSI3:=SMA(MAX(CLOSE-LC,0),N3,1)/SMA(ABS(CLOSE-LC),N3,1)*100;

  成交量:=VOL<REF(VOL,1);


  M1:=14;
  M2:=28;
  M3:=57;
  M4:=114;

  知行多空线:=(MA(CLOSE,M1)+MA(CLOSE,M2)+MA(CLOSE,M3)+MA(CLOSE,M4))/4,COLORLIMAGENTA;

  当日涨跌幅:= (CLOSE - REF(CLOSE,1)) / REF(CLOSE,1) * 100;
  涨跌幅:=当日涨跌幅>-2 AND 当日涨跌幅<3;

  J值<16 AND 成交量 AND RSI3<30 AND 振幅  AND C>知行多空线 AND 涨跌幅;
  ```
