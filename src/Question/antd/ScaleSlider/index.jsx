import { Slider, Popover, Input, Radio } from 'antd';
import { useDebounceFn } from 'ahooks';
import { MinusOutlined, PlusOutlined, DownOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import './index.less';

function ScaleSlider({
  min = 0,
  max = 200,
  defaultValue = 100,
  defaultStep = 1,
  defaultUnit = '%',
  defaultOption = [
    { label: '200%', value: 200 },
    { label: '150%', value: 150 },
    { label: '100%', value: 100 },
    { label: '50%', value: 50 },
  ],
}) {
  const [value, setValue] = useState(defaultValue);

  const handlePlus = () => setValue((prev) => prev + defaultStep);
  const handleMinus = () => setValue((prev) => prev - defaultStep);

  const onRadioChange = (e) => {
    console.log(e);
  };

  const { run: onInputChange } = useDebounceFn(
    (e) => {
      let inputValue = Number(e.target.value);
      if (isNaN(inputValue)) return;
      if (inputValue < min || inputValue > max) {
        return;
      }
      setValue(inputValue);
    },
    { wait: 300 },
  );

  return (
    <div className="slider-wrapper">
      <MinusOutlined onClick={handleMinus} />
      <Slider className="base-slider" min={min} max={max} value={value} onChange={setValue} />
      <PlusOutlined onClick={handlePlus} />

      <Popover
        trigger="click"
        placement="bottomRight"
        content={
          <div className="popover-content-wrapper">
            <div className="title">显示比例</div>
            <div className="option">
              <Radio.Group onChange={onRadioChange}>
                {defaultOption.map((r) => {
                  return (
                    <div key={r.value}>
                      <Radio value={r.value}>{r.label}</Radio>
                    </div>
                  );
                })}
              </Radio.Group>
            </div>
            <div className="title">百分比(E)</div>
            <div>
              <Input
                style={{ width: '100px' }}
                type="number"
                size="small"
                onChange={onInputChange}
              />
            </div>
          </div>
        }
      >
        <div className="label">
          <span>{value + defaultUnit}</span>
          <DownOutlined />
        </div>
      </Popover>
    </div>
  );
}

export default React.memo(ScaleSlider);
