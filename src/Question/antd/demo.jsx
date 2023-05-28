import React, { useState, useRef } from 'react';
import { Form, Cascader } from 'antd';

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

  const flattenOptions = useRef(flatten(options));

  const [form] = Form.useForm();
  const searchVal = useRef('');

  const handleSearch = (value) => {
    console.log(value);
    searchVal.current = value;
  };

  const addItem = (mountNode, child) => {
    const opt = flattenOptions.current.find((item) => item.label === mountNode);
    if (opt) {
      if (opt.children) {
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
        addItem(mountNode, child);
        console.log(options);
        searchVal.current = '';
      }
    };

    ele.addEventListener('keydown', onKeyDown);

    return () => ele.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <Form form={form}>
      <Form.Item label="输入回填" name="callback">
        {/* <Select mode="tags" options={options} /> */}
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
