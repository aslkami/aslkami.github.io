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
  const p = Math.min(parseFloat(percent), 100);

  useEffect(() => {
    Promise.resolve().then(() => {
      setTimeout(() => {
        if (p > 50) {
          const deg = (360 / 100) * p;
          const perDegTime = 1 / deg;
          setStyle({
            transform: `rotate(${180}deg)`,
            transition: `all linear ${180 * perDegTime}s`,
            // transition: `all ease 1s`,
          });
          setStyle2({
            transform: `rotate(${deg - 180}deg)`,
            transition: `all linear ${(deg - 180) * perDegTime}s`,
            transitionDelay: `${180 * perDegTime}s`,
            // transitionDelay: `1s`,
          });
        } else {
          const deg = (360 / 100) * p + 'deg';
          setStyle({
            transform: `rotate(${deg})`,
            transition: `all ease 1s`,
          });
        }
      }, 50);
    });

    return () => {
      setStyle({});
      setStyle2({});
    };
  }, [percent]);

  return (
    <div
      className={classNames('progress-circle-wrapper', className, {
        'gt-50': p > 50,
      })}
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
        <div
          className="progress outer"
          style={{
            left: (width / 2) % 2 === 0 ? '1px' : '0.5px', // 解决中间虚线剪裁问题
          }}
        >
          <div
            className="progress-fill"
            style={{
              ...style2,
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
