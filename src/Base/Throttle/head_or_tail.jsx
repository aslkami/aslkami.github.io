import React, { useEffect, useState } from 'react';
import './throttle.scss';

// 别人的
function throttle(func, wait, options) {
  var timeout, context, args, result;
  var previous = 0;
  if (!options) options = {};

  var later = function () {
    previous = options.leading === false ? 0 : new Date().getTime();
    timeout = null;
    func.apply(context, args);
    if (!timeout) context = args = null;
  };

  var throttled = function () {
    var now = new Date().getTime();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
  };
  return throttled;
}

export default function Or(props) {
  const [count, setCount] = useState(0);

  const handleAdd = throttle(
    (e) => {
      console.log(e);
      console.log(this);
      setCount((count) => count + 1);
    },
    2000,
    {
      leading: false,
    },
  );

  useEffect(() => {
    const container = document.getElementById('container3');
    container.addEventListener('mousemove', handleAdd);

    return () => container.removeEventListener('mousemove', handleAdd);
  }, []);

  return <div id="container3">{count}</div>;
}
