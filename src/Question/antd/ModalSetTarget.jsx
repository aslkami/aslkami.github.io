import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Select, Row, Col, Input, Button } from 'antd';
import './ModalSetTarget.scss';
import ReadOnlyTarget from './ReadOnlyTarget';

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
    name: 'fate',
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
  {
    id: '1001',
    name: 'zero',
    value: {
      id: '',
      time: 2,
      target: '20',
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
  const [initialData, setInitialData] = useState({});
  const [isEdit, setIsEdit] = useState(false);

  const [optionsForm] = Form.useForm();
  const [form] = Form.useForm();

  const onSelectChange = (type, value, item) => {
    //
  };

  const fetchData = () => {
    let formData = {};
    data.forEach((item) => {
      formData[item.name] = {
        ...item.value,
      };
    });
    console.log(formData);
    setInitialData(initialData);
    form.setFieldsValue(formData);
  };

  useEffect(() => {
    if (visible) {
      fetchData();
    } else {
      setSeason(1);
      setCompany('');
      setInitialData({});
      setIsEdit(false);
    }
  }, [visible]);

  const handleOk = () => {
    console.log(data);
  };

  const onFinsh = (newData) => {
    console.log(newData);
  };

  const handleEdit = () => {
    setIsEdit(!isEdit);
  };

  return (
    <Modal
      className="workbench-season-target"
      title={
        <>
          <span className="header-title">目标设定</span>
          <span
            className="workbench-main-color workbench-cspt primary-text-color"
            onClick={handleEdit}
          >
            {isEdit ? '取消编辑' : '编辑'}
          </span>
        </>
      }
      width="52%"
      visible={visible}
      onCancel={onCancel}
      onOk={handleOk}
      maskClosable={false}
      footer={null}
      forceRender
      centered
    >
      {!isEdit ? (
        <ReadOnlyTarget />
      ) : (
        <>
          <div className="form-wrapper">
            <Form form={optionsForm}>
              <Row className="form-option" justify="space-between">
                <Col span={10}>
                  <Form.Item label="目标季度" name="season">
                    <Select placeholder="请选择季度" options={OptionSeason} />
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item label="目标对象" name="company">
                    <Select placeholder="请选择公司" options={OptionCompany} />
                  </Form.Item>
                </Col>
              </Row>
              <Row className="form-title">
                <Col span={8}>指标类型</Col>
                <Col span={8}>指标类型</Col>
                <Col span={8}>指标类型</Col>
              </Row>
            </Form>
            <Form form={form} onFinish={onFinsh}>
              {data.map((item, index) => {
                return (
                  <Form.List name={item.name} key={item.id}>
                    {(fields) => {
                      return (
                        <Row className="form-row">
                          <Col className="form-col-left" span={8}>
                            公募时点规模增量
                          </Col>
                          <Col className="form-col-middle" span={8}>
                            <Form.Item name={['time']}>
                              <Select
                                style={{
                                  width: '240px',
                                }}
                                options={item.options}
                                placeholder="请选择公司"
                                options={OptionSeason}
                              />
                            </Form.Item>
                          </Col>
                          <Col className="form-col-right" span={8}>
                            <Form.Item name={['target']}>
                              <Input
                                // style={{
                                //   width: '240px',
                                // }}
                                suffix="亿"
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      );
                    }}
                  </Form.List>
                );
              })}
              <Form.Item>
                <Row className="form-button" justify="end">
                  <Col>
                    <Button htmlType="submit">取消</Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{
                        marginLeft: '10px',
                      }}
                    >
                      保存
                    </Button>
                  </Col>
                </Row>
              </Form.Item>
            </Form>
          </div>
        </>
      )}
    </Modal>
  );
}

ModalSetTarget.propTypes = {};

export default ModalSetTarget;
