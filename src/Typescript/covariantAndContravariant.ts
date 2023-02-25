class Parent {
  house() {}
}

class Child extends Parent {
  car() {}
}

class Grandson extends Child {
  sleep() {}
}

type Shape = (args: Child) => Child;

function fn(callback: Shape) {
  callback(new Child());
}

fn((instance: Child) => {
  return new Parent();
});

type unkowntype = unknown | string | number;

type x = any extends string ? 1 : 2;

// 學習 體系
// 推演 別人怎麼做的
// 吹牛 吹自己厲害
// 實戰 即使不勝任被炒了，可以繼續幹
// 閉環

// 創業
//   - 積累時間
//   - 兄弟資源
//   - 盤本實權
