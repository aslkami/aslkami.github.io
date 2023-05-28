import React, { useState, useRef } from 'react';
import { Form, Cascader, Select } from 'antd';

function flatten(source = []) {
  let arr = [];
  const fn = (options) => {
    options.forEach((opt) => {
      arr.push(opt);
      if (opt.children && opt.children.length > 0) {
        fn(opt.children);
      }
    });
  };
  fn(source);
  console.log(arr);
  return arr;
}

export default function InputCallbackSeletor({ mountNode }) {
  const [options, setOption] = useState([
    {
      value: 'beijing',
      label: '北京',
      children: [
        {
          value: 'chaoyang',
          label: '朝阳区',
        },
        {
          value: 'dongcheng',
          label: '东城区',
        },
      ],
    },
    {
      value: 'shanghai',
      label: '上海',
      children: [
        {
          value: 'pudong',
          label: '浦东新区',
        },
        {
          value: 'minhang',
          label: '闵行区',
        },
      ],
    },
  ]);

  const [selectNode, setSelectNode] = useState(mountNode);

  const flattenOptions = useRef(flatten(options));

  const [form] = Form.useForm();
  const searchVal = useRef('');

  const handleSearch = (value) => {
    searchVal.current = value;
  };

  const addItem = (mountNode, child) => {
    const opt = flattenOptions.current.find((item) => item.label === mountNode);
    if (opt) {
      if (opt.children) {
        const isExist = opt.children.some((item) => item.value === child.value);
        if (isExist) {
          console.error('存在相同的选项');
          return;
        }
        opt.children.push(child);
      } else {
        opt.children = [child];
      }
    } else {
      options.push(child);
    }
    setOption([...options]);
  };

  React.useEffect(() => {
    const ele = document.querySelector('.my-cascader .ant-select-selection-search-input');

    const onKeyDown = (e) => {
      console.log(e);
      if (searchVal.current === '') return;
      if (e.code === 'Enter' || e.keyCode === 13) {
        const child = {
          label: searchVal.current,
          value: searchVal.current,
          children: [],
        };
        addItem(selectNode, child);
        console.log(options);
        searchVal.current = '';
      }
    };

    ele.addEventListener('keydown', onKeyDown);

    return () => ele.removeEventListener('keydown', onKeyDown);
  }, [selectNode]);

  return (
    <Form form={form}>
      <Form.Item label="选择挂载的节点" name="selectNode">
        <Select
          value={selectNode}
          options={flattenOptions.current}
          onChange={(node, opt) => {
            setSelectNode(opt.label);
          }}
        />
      </Form.Item>
      <Form.Item label="输入回填" name="callback">
        <Cascader
          className="my-cascader"
          options={options}
          allowClear
          multiple
          // showSearch={{ matchInputWidth: true }}
          showSearch
          onSearch={handleSearch}
        />
      </Form.Item>
    </Form>
  );
}
