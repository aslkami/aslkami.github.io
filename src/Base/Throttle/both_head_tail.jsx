import React, { useEffect, useState } from 'react';
import './throttle.scss';

// 我的
function throttle(func, wait) {
  let context, args, timer;
  let prev = 0;

  return function () {
    context = this;
    args = arguments;
    let now = +new Date();

    // 当前时间 - 之前记录的时间，超过阈值就执行，并记录本次执行的时间
    if (now - prev >= wait) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      func.apply(context, [...args]);
      prev = now;
    } else if (!timer) {
      timer = setTimeout(() => {
        func.apply(context, [...args]);
        clearTimeout(timer);
        timer = null;
      }, wait);
    }
  };
}

// 别人的
function throttle1(func, wait) {
  var timeout, context, args, result;
  var previous = 0;

  var later = function () {
    previous = +new Date();
    timeout = null;
    func.apply(context, args);
  };

  var throttled = function () {
    var now = +new Date();
    //下次触发 func 剩余的时间
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    // 如果没有剩余的时间了或者你改了系统时间
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(context, args);
    } else if (!timeout) {
      timeout = setTimeout(later, remaining);
    }
  };
  return throttled;
}

export default function Both(props) {
  const [count, setCount] = useState(0);

  const handleAdd = throttle1((e) => {
    console.log(e);
    console.log(this);
    setCount((count) => count + 1);
  }, 2000);

  useEffect(() => {
    const container = document.getElementById('container2');
    container.addEventListener('mousemove', handleAdd);

    return () => container.removeEventListener('mousemove', handleAdd);
  }, []);

  return <div id="container2">{count}</div>;
}
