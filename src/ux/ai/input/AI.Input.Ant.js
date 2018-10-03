import RxAnt from "../ant/AI.RxAnt";
import {
    Checkbox,
    DatePicker,
    Input,
    InputNumber,
    Radio,
    Select,
    TimePicker,
    TreeSelect
} from "antd";
import React from "react";

const aiInput = (reference, jsx = {}, onChange) => {
    // 处理prefix属性
    RxAnt.onPrefix(jsx);
    // 处理PlaceHolder
    RxAnt.onPlaceHolder(jsx);
    // 处理addonAfter
    RxAnt.onAddonAfter(jsx);
    // onChange处理
    RxAnt.onChange(jsx, onChange);
    return (<Input {...jsx}/>);
};

const aiTreeSelect = (reference, jsx = {}, onChange) => {
    const {config = {}, ...rest} = jsx;
    // 处理TreeSelect
    const data = RxAnt.toTreeOptions(reference, config);
    // 处理onChange
    RxAnt.onChange(rest, onChange);
    return (<TreeSelect treeData={data} {...rest}/>);
};

const aiInputNumber = (reference, jsx = {}, onChange) => {
    // onChange处理
    RxAnt.onChange(jsx, onChange);
    return (<InputNumber {...jsx}/>);
};
const aiSelect = (reference, jsx = {}, onChange) => {
    const {config = {}, filter, ...rest} = jsx;
    // onChange处理
    RxAnt.onChange(rest, onChange);
    const options = RxAnt.toOptions(reference, config, filter);
    return (
        <Select {...rest}>
            {options.map(item => (
                <Select.Option key={item.key} value={item.value}>
                    {item.label}
                </Select.Option>
            ))}
        </Select>
    );
};

const aiRadio = (reference, jsx = {}, onChange) => {
    const {config = {}, ...rest} = jsx;
    // onChange处理
    RxAnt.onChange(rest, onChange);
    const options = RxAnt.toOptions(reference, config);
    return (
        <Radio.Group {...rest}>
            {options.map(item => (
                <Radio key={item.key} style={item.style ? item.style : {}}
                       value={item.hasOwnProperty('value') ? item.value : item.key}>
                    {item.label}
                </Radio>
            ))}
        </Radio.Group>
    );
};
const aiCheckbox = (reference, jsx = {}, onChange) => {
    const {config, ...rest} = jsx;
    // 构造Checkbox专用选项
    RxAnt.onChange(rest, onChange);
    const options = RxAnt.toOptions(reference, config);
    return (config) ?
        <Checkbox.Group {...rest} options={options}/> :
        <Checkbox {...rest}/>;
};
const aiTextArea = (reference, jsx = {}) => {
    return (<Input.TextArea {...jsx}/>);
};
const aiDatePicker = (reference, jsx = {}, onChange) => {
    // DisabledDate
    RxAnt.onDisabledDate(jsx);
    // onChange处理
    RxAnt.onChange(jsx, onChange);
    return (<DatePicker {...jsx} className={"rx-readonly"}/>);
};

const aiTimePicker = (reference, jsx = {}, onChange) => {
    RxAnt.onChange(jsx, onChange);
    return (<TimePicker {...jsx}/>);
};
export default {
    // Label专用组件
    // 直接组件
    aiSelect,
    aiInput,
    aiInputNumber,
    aiCheckbox,
    aiRadio,
    aiTextArea,
    aiTreeSelect,
    aiDatePicker,
    aiTimePicker,
};