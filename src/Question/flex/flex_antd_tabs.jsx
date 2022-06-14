import React, { Fragment, useEffect, useState } from 'react';
import { Tabs } from 'antd';
import './flex_antd_tabs.scss';

function Content() {
  const [data, setData] = useState([]);
  const [marginRight, setMarginRight] = useState(0);
  const [itemNum, setItemNum] = useState(0);

  const calc = () => {
    // const itemWidth = 156;
    const [contentEle] = document.querySelectorAll('.content');
    const [contentItemElement] = document.querySelectorAll('.content-item');
    if (contentItemElement) {
      const itemWidth = contentItemElement.clientWidth;
      const containerClientWidth = contentEle.clientWidth;
      const num = (containerClientWidth / itemWidth) | 0;

      const restSpace = containerClientWidth - itemWidth * num;
      console.log(itemWidth, containerClientWidth, num, restSpace, restSpace / (num - 1));
      setItemNum(num);
      setMarginRight(restSpace / (num - 1));
    }
  };

  useEffect(() => {
    setTimeout(() => {
      const data = new Array(10).fill(0);
      setData(data);
    }, 2000);
  }, []);

  useEffect(() => {
    calc();
    window.addEventListener('resize', calc);
    return () => {
      window.removeEventListener('resize', calc);
    };
  }, [data.length !== 0]);

  const calcItemStyle = (idx) => {
    return {
      marginTop: idx < itemNum ? '0px' : '12px',
    };
  };

  const calcPlaceholderStyle = (idx) => {
    return {
      marginRight: (idx + 1) % itemNum === 0 ? '0px' : marginRight + 'px',
      // width: (idx + 1) % itemNum === 0 ? '0px' : marginRight + 'px',
    };
  };

  return (
    <div className="content-wrapper">
      <div className="content">
        {data.map((item, index) => {
          return (
            // <Fragment key={index}>
            //   <div className="content-item" style={calcItemStyle(index)}>
            //     {item + index + 1}
            //   </div>
            //   <div className="placeholder" style={calcPlaceholderStyle(index)}></div>
            // </Fragment>
            <Fragment key={index}>
              <div className="content-item" style={calcPlaceholderStyle(index)}>
                {item + index + 1}
              </div>
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
