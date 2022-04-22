import React, { useEffect, useState } from 'react';
import './throttle.scss';

function throttle(func, wait) {
  let timer, context, args;

  return function () {
    context = this;
    args = arguments;

    if (!timer) {
      timer = setTimeout(() => {
        func.apply(context, [...args]);
        clearTimeout(timer);
        timer = null;
      }, wait);
    }
  };
}

export default function Timeout(props) {
  const [count, setCount] = useState(0);

  const handleAdd = throttle((e) => {
    console.log(e);
    console.log(this);
    setCount((count) => count + 1);
  }, 2000);

  useEffect(() => {
    const container = document.getElementById('container1');
    container.addEventListener('mousemove', handleAdd);

    return () => container.removeEventListener('mousemove', handleAdd);
  }, []);

  return <div id="container1">{count}</div>;
}
