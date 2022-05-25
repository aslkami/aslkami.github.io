import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'antd';

const data = [
  {
    type: '公募时点规模',
    time: '相比去年末',
    target: '1000亿',
  },
  {
    type: '公募月均规模',
    time: '相比去年末',
    target: '1000亿',
  },
];

function ReadOnlyTarget(props) {
  return (
    <div className="readonly-target">
      <Row className="readonly-target-header" align="middle">
        <i className="line" />
        <span>2022年二季度</span>
        <span>上海分公司</span>
      </Row>

      <Row className="readonly-target-body">
        <Col span={24}>
          <Row className="readonly-target-body-title" align="middle">
            <Col span={9}>指标类型</Col>
            <Col span={9}>对比时点</Col>
            <Col span={6}>目标值</Col>
          </Row>
        </Col>

        {data.map((item) => (
          <Col span={24} key={item.type}>
            <Row className="readonly-target-body-content" align="middle">
              <Col span={9}>{item.type}</Col>
              <Col span={9}>{item.time}</Col>
              <Col span={6}>{item.target}</Col>
            </Row>
          </Col>
        ))}
      </Row>

      <Row className="readonly-target-footer">
        <Col span={12}>
          <Row align="middle">
            <Col>填写人</Col>
            <Col className="username">周华健</Col>
            <Col>时间：2022-05-25 15:42:53</Col>
          </Row>
        </Col>
        <Col span={12}>
          <Row align="middle">
            <Col>修改人</Col>
            <Col className="username">周杰伦</Col>
            <Col>时间：2022-05-25 15:42:53</Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

ReadOnlyTarget.propTypes = {};

export default ReadOnlyTarget;
