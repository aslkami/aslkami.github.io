import React, { useEffect, useState } from 'react';
import './debounce.scss';

export default function Demo() {
  const [count, setCount] = useState(0);

  const handleAdd = () => {
    setCount((count) => count + 1);
  };

  useEffect(() => {
    const container = document.getElementById('container');
    container.addEventListener('mousemove', handleAdd);

    return () => container.removeEventListener('mousemove', handleAdd);
  }, []);

  return <div id="container">{count}</div>;
}
