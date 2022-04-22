import React, { useState } from 'react';
import { Button, Divider } from 'antd';
import 'antd/dist/antd.css';
import Promise from './sync_promise';

export default function Demo() {
  const [data, setData] = useState([]);

  const test = () => {
    new Promise((resolve, reject) => {
      resolve(1111);
    }).then(
      (res) => {
        console.log(res);
        data.push(res);
        setData([...data]);
      },
      (err) => {
        console.log(err);
      },
    );
  };

  const reset = () => {
    data.length = 0;
    setData([...data]);
  };

  return (
    <div id="wrapper">
      <Button type="primary" onClick={test}>
        点我测试
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
