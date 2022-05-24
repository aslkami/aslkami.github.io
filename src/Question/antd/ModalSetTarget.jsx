import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Select, Row, Col, Input } from 'antd';
import './ModalSetTarget.scss';

const OptionSeason = [
  {
    label: '第一季度',
    value: 1,
  },
  {
    label: '第二季度',
    value: 2,
  },
  {
    label: '第三季度',
    value: 3,
  },
  {
    label: '第四季度',
    value: 4,
  },
];

const OptionCompany = [];

const data = [
  {
    id: '100',
    name: '',
    value: {
      id: '',
      time: 1,
      target: '10',
    },
    options: [
      {
        label: '比上年末',
        value: 1,
      },
    ],
  },
];

function ModalSetTarget(props) {
  const { visible = false, onCancel, onOk } = props;
  const [season, setSeason] = useState(1);
  const [company, setCompany] = useState('');
  const [mapCompareOption, setCompareOption] = useState({});

  const [form] = Form.useForm();

  const onSelectChange = (type, value, item) => {
    //
  };

  const fetchData = () => {
    let mapCompareOption = {};
    data.forEach((item) => {
      mapCompareOption[item.id] = item.options;
    });
  };

  useEffect(() => {
    if (visible) {
      fetchData();
    } else {
      setSeason(1);
      useState('');
      setCompareOption({});
    }
  }, [visible]);

  const handleOk = () => {
    console.log(data);
  };

  return (
    <Modal
      className="workbench-season-target"
      title="设定目标"
      width="60%"
      visible={visible}
      onCancel={onCancel}
      onOk={handleOk}
      maskClosable={false}
      forceRender
      centered
    >
      <div className="form-title">
        <i className="line"></i>
        <Select
          style={{
            width: '200px',
          }}
          placeholder="请选择季度"
          options={OptionSeason}
          onChange={(...args) => onSelectChange('', ...args)}
        />
        <Select
          style={{
            width: '200px',
          }}
          placeholder="请选择公司"
          options={OptionCompany}
          onChange={(...args) => onSelectChange('', ...args)}
        />
      </div>
      <div className="form-wrapper">
        {/* <Form> */}
        {data.map((item) => {
          return (
            <Row className="form-row">
              <Col className="form-col-left" span={8}>
                公募时点规模增量
              </Col>
              <Col className="form-col-middle" span={8}>
                {/* <Form.Item name="time"> */}
                <Select
                  style={{
                    width: '240px',
                  }}
                  defaultValue={item.value.time}
                  placeholder="请选择公司"
                  options={OptionSeason}
                  // onChange={(...args) => onSelectChange('', ...args)}
                />
                {/* </Form.Item> */}
              </Col>
              <Col className="form-col-right" span={8}>
                {/* <Form.Item label="目标值" name="target"> */}
                <Input
                  style={{
                    width: '240px',
                  }}
                  defaultValue={item.value.target}
                  suffix="亿"
                />
                {/* </Form.Item> */}
              </Col>
            </Row>
          );
        })}
        {/* </Form> */}
      </div>
    </Modal>
  );
}

ModalSetTarget.propTypes = {};

export default ModalSetTarget;
