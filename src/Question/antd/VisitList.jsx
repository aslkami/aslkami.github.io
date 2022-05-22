import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { List } from 'antd';
import './VisitList.scss';

function VisitList(props) {
  const { type, pageSize } = props;
  const [listData, setListData] = useState([]);
  const [pageNo, setPageNo] = useState(1);

  const fetchData = () => {
    //
    setListData([{}]);
  };

  useEffect(() => {
    fetchData();
  }, [pageNo]);

  return (
    <div className="VisitList">
      <List
        itemLayout="vertical"
        size="large"
        pagination={{
          onChange: (page) => {
            setPageNo(page);
          },
          pageSize,
        }}
        dataSource={listData}
        renderItem={(item) => (
          <List.Item key={item.title}>
            <div className="list-wrapper">
              <div className="list-item">
                <div className="list-content">
                  <div className="tag">[会议]</div>
                  <div className="title">
                    《如果能重来，我要选李白！～,
                    如果能重来，我要选李白！～如果能重来，我要选李白！～如果能重来，我要选李白！～如果能重来，我要选李白！～如果能重来，我要选李白！～如果能重来，我要选李白！～》
                  </div>
                </div>
                <div className="time">2022-05-18</div>
              </div>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
}

VisitList.defaultProps = {
  pageSize: 20,
};

VisitList.propTypes = {
  type: PropTypes.string,
  pageSize: PropTypes.number,
};

export default VisitList;

// .VisitList {
//   .list-wrapper {
//   }
//   .list-item {
//   }
//   .list-content {
//     display: flex;
//     .tag {
//       flex: none;
//     }
//     .title {
//       flex: 1;
//     }
//   }
//   .time {
//     text-align: right;
//   }
// }
