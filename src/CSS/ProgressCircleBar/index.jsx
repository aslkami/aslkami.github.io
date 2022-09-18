import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import './index.less';

export default function ProgressCircleBar({
  gap,
  width,
  percent,
  inactiveColor = '#e5e5e5',
  activeColor = '#81ce97',
  className,
  children,
}) {
  const [style, setStyle] = useState({});
  const [style2, setStyle2] = useState({});

  useEffect(() => {
    setTimeout(() => {
      const p = parseFloat(percent);
      if (p > 50) {
        const deg = (360 / 200) * p + 'deg';
        setStyle({
          transform: `rotate(${deg})`,
          transition: `all ease 1s`,
        });
        setStyle2({
          transform: `rotate(${deg})`,
          transition: `all ease 1s`,
        });
      } else {
        const deg = (360 / 100) * p + 'deg';
        setStyle({
          transform: `rotate(${deg})`,
          transition: `all ease 1s`,
        });
      }
    }, 0);
  }, [percent]);

  return (
    <div
      className={classNames('progress-circle-wrapper', className)}
      style={{
        '--width': `${parseFloat(width)}px`,
        backgroundColor: inactiveColor,
      }}
    >
      <div className="progress">
        <div
          className="progress-fill"
          style={{
            ...style,
            backgroundColor: activeColor,
          }}
        ></div>
      </div>
      {parseFloat(percent) > 50 && (
        <div className="progress outer" style={style2}>
          <div
            className="progress-fill"
            style={{
              ...style,
              backgroundColor: activeColor,
            }}
          ></div>
        </div>
      )}

      <div
        className="progress-content"
        style={{
          '--gap': `${parseFloat(gap)}px`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
