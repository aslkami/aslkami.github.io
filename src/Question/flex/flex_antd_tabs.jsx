import React, { Fragment, useEffect, useState } from 'react';
import { Tabs } from 'antd';
import './flex_antd_tabs.scss';

function Content() {
  const [marginRight, setMarginRight] = useState(0);
  const [itemNum, setItemNum] = useState(0);

  const calc = () => {
    const itemWidth = 156;
    const [contentEle] = document.querySelectorAll('.content');
    const containerClientWidth = contentEle.clientWidth;
    const num = (containerClientWidth / itemWidth) | 0;

    const restSpace = containerClientWidth - itemWidth * num;
    setItemNum(num);
    setMarginRight(restSpace / num);
  };

  useEffect(() => {
    calc();
    window.addEventListener('resize', calc);
    return () => {
      window.removeEventListener('resize', calc);
    };
  }, []);

  const calcItemStyle = (idx) => {
    return {
      marginTop: idx < itemNum ? '0px' : '12px',
    };
  };

  const calcPlaceholderStyle = (idx) => {
    return {
      marginRight: (idx + 1) % itemNum === 0 ? '0px' : marginRight + 'px',
    };
  };

  return (
    <div className="content-wrapper">
      <div className="content">
        {new Array(35).fill(0).map((item, index) => {
          return (
            <Fragment key={index}>
              <div className="content-item" style={calcItemStyle(index)}>
                {item + index + 1}
              </div>
              <div className="placeholder" style={calcPlaceholderStyle(index)}></div>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default function Index() {
  return (
    <div className="container">
      <Tabs>
        <Tabs.TabPane tab={'我的列表'} key="list">
          <Content />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}
