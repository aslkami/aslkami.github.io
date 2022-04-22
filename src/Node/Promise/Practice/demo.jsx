import React, { useState } from 'react';
import { Button, Divider } from 'antd';
import 'antd/dist/antd.css';
import Practice from './practice1';

export default function Demo() {
  const [data, setData] = useState([]);

  const log = (val) => {
    data.push(val);
    setData([...data]);
  };

  const test = () => {
    Practice(log);
  };

  const reset = () => {
    data.length = 0;
    setData([...data]);
  };

  return (
    <div id="wrapper">
      <Button type="primary" onClick={() => test()}>
        执行
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
