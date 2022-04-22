import React, { useEffect, useState } from 'react';
import './throttle.scss';

function throttle(func, wait) {
  let context, args;
  let prev = 0;

  return function () {
    context = this;
    args = arguments;
    let now = +new Date();

    // 当前时间 - 之前记录的时间，超过阈值就执行，并记录本次执行的时间
    if (now - prev >= wait) {
      let res = func.apply(context, [...args]);
      prev = now;
      return res;
    }
  };
}

export default function Timestamp(props) {
  const [count, setCount] = useState(0);

  const handleAdd = throttle((e) => {
    console.log(e);
    console.log(this);
    setCount((count) => count + 1);
  }, 2000);

  useEffect(() => {
    const container = document.getElementById('container');
    container.addEventListener('mousemove', handleAdd);

    return () => container.removeEventListener('mousemove', handleAdd);
  }, []);

  return <div id="container">{count}</div>;
}
