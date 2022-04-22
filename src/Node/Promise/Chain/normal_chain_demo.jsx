import React, { useState } from 'react';
import { Button, Divider } from 'antd';
import 'antd/dist/antd.css';
import Promise from './normal_chain';

export default function Demo() {
  const [data, setData] = useState([]);
  const second = 2000;

  const test = (type) => {
    new Promise((resolve, reject) => {
      setTimeout(() => {
        if (type === 'success') {
          resolve('成功');
        } else {
          reject('失败');
        }
      }, second);
    })
      .then(
        (res) => {
          let msg = `success ${res}`;
          data.push(msg);
          setData([...data]);
          return msg;
        },
        (err) => {
          let msg = `fail ${err}`;
          data.push(msg);
          setData([...data]);
          return msg;
        },
      )
      .then((r) => {
        console.log(r);
        let msg = `最后一个 then 打印：${r}`;
        data.push(msg);
        setData([...data]);
      });
  };

  const reset = () => {
    data.length = 0;
    setData([...data]);
  };

  return (
    <div id="wrapper">
      <p>等待 {second}ms 执行</p>
      <Button type="primary" onClick={() => test('success')}>
        测试成功
      </Button>
      <Divider type="vertical" />
      <Button type="primary" onClick={() => test('fail')}>
        测试失败
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
