import React, { useState } from 'react';
import { Input, Form, Button, Space, Select, Table, Card } from 'antd';
import { MinusCircleOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';

const sharedOnCell = (_, index) => {
  if (_.day) {
    return {
      colSpan: 0,
    };
  }
  return {};
};

export default function calcHoldingCostsRecovery() {
  const [form] = Form.useForm();
  const [result, setResult] = useState([]);

  const columns = [
    {
      title: '初始持仓金额',
      dataIndex: 'beforePrice',
      onCell: (row) => {
        if (row.day) {
          return {
            colSpan: 11,
          };
        }
        return {};
      },
      render(text, row) {
        if (row.day) return <span style={{ color: 'mediumvioletred' }}>{row.day}</span>;
        return (+text).toFixed(3);
      },
    },
    {
      title: '初始持仓份额',
      dataIndex: 'beforeAmount',
      onCell: sharedOnCell,
    },
    {
      title: '初始持仓总价',
      dataIndex: 'beforeTotal',
      onCell: sharedOnCell,
      render(t, record) {
        return (+record.beforePrice * +record.beforeAmount).toFixed(0);
      },
    },
    {
      title: '方式',
      dataIndex: 'method',
      onCell: sharedOnCell,
      render(text) {
        return text === 1 ? '买入' : '卖出';
      },
    },
    {
      title: '金额',
      dataIndex: 'price',
      onCell: sharedOnCell,
      render(text) {
        return (+text).toFixed(3);
      },
    },
    {
      title: '份额',
      dataIndex: 'amount',
    },
    {
      title: '总价',
      dataIndex: 'total',
      onCell: sharedOnCell,
      render(t, record) {
        return (+record.price * +record.amount).toFixed(0);
      },
    },
    {
      title: '当前持仓金额',
      dataIndex: 'afterPrice',
      onCell: sharedOnCell,
      render(text) {
        if (text === 0) return '∞';
        return (+text).toFixed(3);
      },
    },
    {
      title: '当前持仓份额',
      dataIndex: 'afterAmount',
      onCell: sharedOnCell,
      render(t) {
        if (t === 0) return '∞';
        return t;
      },
    },
    {
      title: '当前持仓总价',
      dataIndex: 'afterTotal',
      onCell: sharedOnCell,
      render(t, record) {
        if (record.afterPrice === 0) return '∞';
        return (+record.afterPrice * +record.afterAmount).toFixed(0);
      },
    },
    {
      title: '获利',
      dataIndex: 'profit',
      onCell: sharedOnCell,
      render(t, record) {
        if (record.method === 1) {
          return null;
        }

        const sellTotal = (+record.price * +record.amount).toFixed(0);
        const holdTotal = (+record.beforePrice * +record.amount).toFixed(0);
        const result = sellTotal - holdTotal;
        if (result === 0) return result;
        return <div style={{ color: result > 0 ? 'red' : 'green' }}>{result}</div>;
      },
    },
  ];

  const getPrice = (m, b, ba, a, aa) => {
    b = +b;
    ba = +ba;
    a = +a;
    aa = +aa;
    if (m === 1) {
      const bt = b * ba + a * aa;
      return (bt / getAmount(m, ba, aa)).toFixed(3);
    } else {
      const bt = b * ba - a * aa;
      const amount = getAmount(m, ba, aa);
      if (amount === 0) return 0;
      return (bt / amount).toFixed(3);
    }
  };

  const getAmount = (m, b, a) => {
    if (m === 1) {
      return +b + +a;
    } else {
      return +b - +a;
    }
  };

  const calc = () => {
    let { initPrice, initAmount, info } = form.getFieldsValue();
    if (!initPrice || !initAmount) return;

    let lastRecord = {
      lastPrice: initPrice,
      lastAmount: initAmount,
    };

    const allRecord = [];
    let id = 1;
    const getRecord = (eachCondition, index) => {
      eachCondition.sort((a, b) => a.method - b.method);
      const eachRecord = [{ day: `第${index + 1}天`, id: `第${index + 1}天` }];
      for (let item of eachCondition) {
        if (!item.price || !item.amount) continue;
        let afterPrice = getPrice(
          item.method,
          lastRecord.lastPrice,
          lastRecord.lastAmount,
          item.price,
          item.amount,
        );

        const afterAmount = getAmount(item.method, lastRecord.lastAmount, item.amount);

        if (item.method === -1) {
          afterPrice = initPrice;
          lastRecord.lastPrice = initPrice;
          if (afterAmount === 0) {
            afterPrice = 0;
            lastRecord.lastPrice = 0;
          }
        }
        const current = {
          beforePrice: item.method === -1 ? initPrice : lastRecord.lastPrice,
          beforeAmount: lastRecord.lastAmount,
          method: item.method,
          price: item.price,
          amount: item.amount,
          afterPrice: item.method === -1 ? lastRecord.lastPrice : afterPrice,
          afterAmount: afterAmount,
          id: id++,
        };
        lastRecord.lastPrice = afterPrice;
        lastRecord.lastAmount = afterAmount;
        initPrice = afterPrice;
        eachRecord.push(current);
      }
      return eachRecord;
    };

    for (let [index, infoItem] of info.entries()) {
      const eachRecord = getRecord(infoItem.condition, index);
      allRecord.push(...eachRecord);
    }

    setResult(allRecord);
  };

  return (
    <>
      <h2>计算当天买卖持仓成本</h2>
      <Form form={form} style={{ width: '50vw' }}>
        <Form.Item label="初始持仓" name="initPrice">
          <Input />
        </Form.Item>
        <Form.Item label="初始股数" name="initAmount">
          <Input />
        </Form.Item>

        <Form.List name="info">
          {(fields, { add, remove }) => {
            return (
              <>
                {fields.map(({ key, name }) => (
                  <Card
                    size="small"
                    title={`第${name + 1}天`}
                    key={key}
                    style={{
                      marginBottom: '12px',
                    }}
                    extra={
                      <CloseOutlined
                        onClick={() => {
                          remove(name);
                        }}
                      />
                    }
                  >
                    <Form.Item label="">
                      <Form.List name={[name, 'condition']}>
                        {(subFields, { add: subAdd, remove: subRemove }) => {
                          return (
                            <>
                              {subFields.map(({ key: subkey, name: subname, ...restField }) => {
                                return (
                                  <Space
                                    key={`${key}-${subkey}`}
                                    style={{ display: 'flex', marginBottom: 8 }}
                                    align="baseline"
                                  >
                                    <Form.Item
                                      {...restField}
                                      name={[subname, 'method']}
                                      initialValue={1}
                                    >
                                      <Select
                                        style={{ width: '7.5vw' }}
                                        options={[
                                          { label: '买入', value: 1 },
                                          { label: '卖出', value: -1 },
                                        ]}
                                      />
                                    </Form.Item>
                                    <Form.Item {...restField} name={[subname, 'price']}>
                                      <Input
                                        style={{ width: '19vw' }}
                                        placeholder="买入或卖出的金额"
                                      />
                                    </Form.Item>
                                    <Form.Item {...restField} name={[subname, 'amount']}>
                                      <Input
                                        style={{ width: '20vw' }}
                                        placeholder="买入或卖出的数量"
                                      />
                                    </Form.Item>
                                    <MinusCircleOutlined onClick={() => subRemove(subname)} />
                                  </Space>
                                );
                              })}

                              <Form.Item style={{ marginTop: '8px' }}>
                                <Button
                                  type="dashed"
                                  onClick={() => subAdd()}
                                  block
                                  icon={<PlusOutlined />}
                                >
                                  添加子条件
                                </Button>
                              </Form.Item>
                            </>
                          );
                        }}
                      </Form.List>
                    </Form.Item>
                  </Card>
                ))}

                <Form.Item style={{ marginTop: '12px' }}>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    添加买卖条件
                  </Button>
                </Form.Item>
              </>
            );
          }}
        </Form.List>

        <Form.Item>
          <Space>
            <Button type="primary" onClick={calc}>
              计算结果
            </Button>
            <Button
              onClick={() => {
                form.resetFields();
                setResult([]);
              }}
            >
              清空表单
            </Button>
          </Space>
        </Form.Item>
      </Form>

      {result.length > 0 && (
        <Table
          dataSource={result}
          rowKey="id"
          columns={columns}
          pagination={false}
          summary={(pageData) => {
            let total = 0;
            pageData.forEach((record) => {
              if (record.method === 1 || record.day) return;
              const sellTotal = (+record.price * +record.amount).toFixed(0);
              const holdTotal = (+record.beforePrice * +record.amount).toFixed(0);
              const result = sellTotal - holdTotal;
              total += result;
            });
            return (
              <>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0}>合计获利</Table.Summary.Cell>
                  <Table.Summary.Cell index={1} />
                  <Table.Summary.Cell index={2} />
                  <Table.Summary.Cell index={3} />
                  <Table.Summary.Cell index={4} />
                  <Table.Summary.Cell index={5} />
                  <Table.Summary.Cell index={6} />
                  <Table.Summary.Cell index={7} />
                  <Table.Summary.Cell index={8} />
                  <Table.Summary.Cell index={9} />
                  <Table.Summary.Cell index={10}>
                    {total === 0 ? (
                      0
                    ) : (
                      <div style={{ color: total > 0 ? 'red' : 'green' }}>{total}</div>
                    )}
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </>
            );
          }}
        />
      )}
    </>
  );
}
