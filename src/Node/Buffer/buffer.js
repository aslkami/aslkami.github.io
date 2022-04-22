const CHARTS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
function transfer(str) {
  let buf = Buffer.from(str); // a 的 16进制 61
  let result = '';
  for (let b of buf) {
    result += b.toString(2); // 61 的 10进制 是 97， 转 二进制 1100001
  }
  console.log(result);
  return result
    .match(/(\d{6})/g)
    .map((val) => parseInt(val, 2)) // "110000" -> 转 10进制 -> 32 + 16 = 48
    .map((val) => CHARTS[val]) // 下标 48 第 对应的是 w
    .join('');
}
let r = transfer('a');
console.log(r); // w
