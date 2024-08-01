import React, { useState } from 'react';
import { Input, Form, Button, Space } from 'antd';

export default function calcHoldingCosts() {
  const [form] = Form.useForm();
  const [result, setResult] = useState('0.00');

  return (
    <>
      <h2>计算加仓后成本</h2>
      <Form form={form}>
        <Form.Item label="初始持仓" name="initPrice">
          <Input />
        </Form.Item>
        <Form.Item label="初始股数" name="initNum">
          <Input />
        </Form.Item>
        <Form.Item label="加仓金额" name="price">
          <Input />
        </Form.Item>
        <Form.Item label="加仓股数" name="num">
          <Input />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button
              type="primary"
              onClick={() => {
                const fields = form.getFieldsValue();
                try {
                  const { initPrice, initNum, price, num } = fields;
                  const total = initPrice * initNum + price * num;
                  const allNum = Number(initNum) + Number(num);
                  let value = (total / allNum).toFixed(3);
                  if (isNaN(value)) {
                    value = '0.00';
                  }
                  setResult(value);
                } catch (error) {
                  setResult('0.00');
                }
              }}
            >
              计算结果
            </Button>
            <Button
              onClick={() => {
                form.resetFields();
                setResult('0.00');
              }}
            >
              清空表单
            </Button>
          </Space>
        </Form.Item>
        <div>{result}</div>
      </Form>
    </>
  );
}
