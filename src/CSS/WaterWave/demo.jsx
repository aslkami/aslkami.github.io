import React, { useRef } from 'react';
import './demo.less';

export default function Demo() {
  const rippleRef = useRef(null);

  const getClickPosition = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return { x, y };
  };

  const handleClick = (e) => {
    const { x, y } = getClickPosition(e);
    const ripple = document.createElement('div');
    ripple.classList.add('ripple-effect');
    ripple.style.top = `${y}px`;
    ripple.style.left = `${x}px`;
    rippleRef.current.append(ripple);
    setTimeout(() => {
      rippleRef.current.removeChild(ripple);
    }, 500);
  };

  return (
    <div className="water-wave-wrapper" onClick={handleClick}>
      <div ref={rippleRef} className="ripple-container">
        点我出现水波纹效果
      </div>
    </div>
  );
}
