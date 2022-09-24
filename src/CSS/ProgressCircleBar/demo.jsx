import React from 'react';
import { useState, useEffect } from 'react';
import ProgressCircleBar from './index';

export default function Demo() {
  const [percent1] = useState(70);
  const [percent2] = useState(40);
  const [percent3, setPercent3] = useState(100);

  useEffect(() => {
    setTimeout(() => {
      setPercent3(30);

      setTimeout(() => {
        setPercent3(80);
      }, 3000);
    }, 3000);
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
      }}
    >
      <ProgressCircleBar gap={20} percent={percent1} width={200}>
        <span>{percent1}%</span>
      </ProgressCircleBar>
      <ProgressCircleBar gap={20} percent={percent2} width={200}>
        <span>{percent2}%</span>
      </ProgressCircleBar>
      <ProgressCircleBar gap={20} percent={percent3} width={200}>
        <span>{percent3}%</span>
      </ProgressCircleBar>
      <ProgressCircleBar gap={20} percent={90} width={200}>
        <span>{90}%</span>
      </ProgressCircleBar>
    </div>
  );
}
