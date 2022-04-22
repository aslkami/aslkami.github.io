import React, { useEffect, useState } from 'react';
import { Button, Divider } from 'antd';
import 'antd/dist/antd.css';
import './debounce.scss';

function debounce(func, wait, immediate = false) {
  let timer;

  function fn() {
    let ctx = this;
    let args = arguments;

    if (timer) clearTimeout(timer);
    if (immediate) {
      // 未执行
      if (!timer) {
        func.apply(ctx, [...args]);
      }
      timer = setTimeout(() => {
        clearTimeout(timer);
        timer = null;
      }, wait);
    } else {
      timer = setTimeout(() => {
        func.apply(ctx, [...args]);
        clearTimeout(timer);
        timer = null;
      }, wait);
    }
  }

  fn.cancel = function () {
    console.log(timer);
    clearTimeout(timer);
    timer = null;
  };

  return fn;
}

export default function Index() {
  const [count, setCount] = useState(0);

  const handleAdd = debounce(
    (e) => {
      console.log(e);
      console.log(this);
      setCount((count) => count + 1);
    },
    3000,
    true,
  );

  useEffect(() => {
    const container = document.getElementById('container2');
    container.addEventListener('mousemove', handleAdd);

    return () => container.removeEventListener('mousemove', handleAdd);
  }, []);

  const handleStop = () => {
    handleAdd.cancel();
  };

  useEffect(() => {
    const btn = document.getElementById('btn');
    btn.addEventListener('click', handleStop);

    return () => btn.removeEventListener('click', handleStop);
  }, []);

  return (
    <>
      <div id="container2">{count}</div>
      <Button type="primary" id="btn">
        dom2 停止
      </Button>
      <Divider type="vertical" />
      <Button type="primary" onClick={handleStop}>
        dom0 停止
      </Button>
    </>
  );
}
