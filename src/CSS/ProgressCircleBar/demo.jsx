import React from 'react';
import { useState } from 'react';
import ProgressCircleBar from './index';

export default function Demo() {
  const [percent1] = useState(70);
  const [percent2] = useState(40);
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
    </div>
  );
}
