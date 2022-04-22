import React, { useState } from 'react';
import { Button, Divider } from 'antd';
import 'antd/dist/antd.css';
import MyPromise from './promise_chain';

export default function Demo() {
  const [data, setData] = useState([]);

  const print = (msg) => {
    data.push(msg);
    setData([...data]);
  };

  const reset = () => {
    data.length = 0;
    setData([...data]);
  };

  const returnSelf = () => {
    const p = new MyPromise((resolve, reject) => {
      resolve('ok');
    }).then(() => {
      return p;
    });

    p.then(null, (err) => {
      console.error(err);
    });
  };

  const complexPromiseSuccess = () => {
    const p = new MyPromise((resolve, reject) => {
      resolve('ok');
    }).then(() => {
      return new Promise((res, rej) => {
        setTimeout(() => {
          let msg = `第 1s 打印`;
          print(msg);
          res(
            new Promise((r, j) => {
              setTimeout(() => {
                let msg = `第 2s 打印`;
                print(msg);
                r('ok');
              }, 1000);
            }),
          );
        }, 1000);
      });
    });

    p.then(
      (res) => {
        let msg = `经过 2s 后打印： ${res}`;
        print(msg);
      },
      (err) => {
        console.error(err);
      },
    );
  };

  const complexPromiseFail = () => {
    const p = new MyPromise((resolve, reject) => {
      resolve('ok');
    }).then(() => {
      return new Promise((res, rej) => {
        setTimeout(() => {
          let msg = `第 1s 打印`;
          print(msg);
          rej(
            new Promise((r, j) => {
              setTimeout(() => {
                let msg = `第 2s 打印`;
                print(msg);
                r('ok');
              }, 1000);
            }),
          );
        }, 1000);
      });
    });

    p.then(
      (res) => {
        let msg = `经过 2s 后打印： ${res}`;
        print(msg);
      },
      (err) => {
        let msg = `直接reject了： ${err}`;
        print(msg);
      },
    );
  };

  const testPassThrough = (type) => {
    let p = new MyPromise((resolve, reject) => {
      if (type === 'success') {
        resolve('透传 ok');
      } else {
        reject('透传 fail');
      }
    })
      .then()
      .then()
      .then();

    p.then(
      (res) => {
        print(res);
      },
      (e) => {
        print(e);
      },
    );
  };

  return (
    <div id="wrapper">
      <Button type="primary" onClick={() => returnSelf()}>
        返回自己
      </Button>
      <Divider type="vertical" />
      <Button type="primary" onClick={() => complexPromiseSuccess()}>
        复杂 promise 成功
      </Button>
      <Divider type="vertical" />
      <Button type="primary" onClick={() => complexPromiseFail()}>
        复杂 promise 失败
      </Button>
      <Divider type="vertical" />

      <Button type="primary" onClick={() => testPassThrough('success')}>
        透传成功
      </Button>
      <Divider type="vertical" />
      <Button type="primary" onClick={() => testPassThrough('failed')}>
        透传失败
      </Button>
      <Divider type="vertical" />

      <Button onClick={reset}>重置</Button>
      <div style={{ marginTop: '30px' }}>
        {data.map((list, index) => (
          <p key={list + index}>{list}</p>
        ))}
      </div>
    </div>
  );
}
