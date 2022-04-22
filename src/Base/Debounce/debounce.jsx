import React, { useEffect, useState } from 'react';
import './debounce.scss';

function debounce(func, wait) {
  let timer;

  return function () {
    let ctx = this;
    if (timer) clearTimeout(timer);

    timer = setTimeout(() => {
      func.apply(ctx, [...arguments]);
      clearTimeout(timer);
      timer = null;
    }, wait);
  };
}

export default function Index() {
  const [count, setCount] = useState(0);

  const handleAdd = debounce((e) => {
    console.log(e);
    console.log(this);
    setCount((count) => count + 1);
  }, 3000);

  useEffect(() => {
    const container = document.getElementById('container1');
    container.addEventListener('mousemove', handleAdd);

    return () => container.removeEventListener('mousemove', handleAdd);
  }, []);

  return <div id="container1">{count}</div>;
}
