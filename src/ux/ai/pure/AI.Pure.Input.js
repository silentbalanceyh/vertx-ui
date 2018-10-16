import {Checkbox, Radio, Select} from "antd";
import React from "react";

const aiInputRadio = (items = [], rest = {}) => (
    <Radio.Group {...rest}>
        {items.map(item => (
            <Radio key={item.key} style={item.style ? item.style : {}}
                   value={item.hasOwnProperty('value') ? item.value : item.key}>
                {item.name || item.label}
            </Radio>
        ))}
    </Radio.Group>
);
const aiInputSelect = (items = [], rest = {}) => (
    <Select {...rest}>
        {items.map(item => (
            <Select.Option key={item.key} style={item.style ? item.style : {}}
                           value={item.hasOwnProperty('value') ? item.value : item.key}>
                {item.name || item.label}
            </Select.Option>
        ))}
    </Select>
);
const aiInputCheckBox = (items = [], rest = {}) => (
    <Checkbox.Group {...rest}>
        {items.map(item => (
            <Checkbox key={item.key} style={item.style ? item.style : {}}
                      value={item.hasOwnProperty('value') ? item.value : item.key}
                      disabled={!!item.disabled}>
                {item.name || item.label}
            </Checkbox>
        ))}
    </Checkbox.Group>
);

export default {
    aiInputCheckBox,
    aiInputRadio,
    aiInputSelect
}