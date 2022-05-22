import React from 'react';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';
import VisitList from './VisitList';

function VisitLog(props) {
  const { typeList, typeProps } = props;
  return (
    <div className="VisitLog">
      <Tabs>
        {typeList.map((list) => (
          <Tabs.TabPane tab={list[typeProps.label]} key={list[typeProps.value]}>
            <VisitList type={list[typeProps.value]} />
          </Tabs.TabPane>
        ))}
      </Tabs>
    </div>
  );
}

VisitLog.defaultProps = {
  typeProps: {
    label: 'label',
    value: 'value',
  },
  typeList: [
    {
      label: '全部',
      value: '',
    },
  ],
};

VisitLog.propTypes = {
  typeList: PropTypes.array,
  typeProps: PropTypes.object,
};

export default VisitLog;
