import React from 'react';
import {Checkbox, DatePicker, Input, InputNumber, Select, TreeSelect} from 'antd';
import {ListSelector} from "web";
import RxAnt from './AI.RxAnt'
import {Modal} from "antd/lib/index";

const aiInput = (reference, jsx = {}, onChange) => {
    // 处理prefix属性
    RxAnt.onPrefix(jsx);
    // 处理addonAfter
    RxAnt.onAddonAfter(jsx);
    // onChange处理
    RxAnt.onChange(jsx, onChange);
    return (<Input {...jsx}/>)
};

const aiTreeSelect = (reference, jsx = {}, onChange) => {
    const {config = {}, ...rest} = jsx;
    // 处理TreeSelect
    const data = RxAnt.toTreeOptions(reference, config);
    // 处理onChange
    RxAnt.onChange(rest, onChange);
    return (<TreeSelect treeData={data} {...rest}/>)
};

const aiInputNumber = (reference, jsx = {}, onChange) => {
    // onChange处理
    RxAnt.onChange(jsx, onChange);
    return (<InputNumber {...jsx}/>)
};
const aiSelect = (reference, jsx = {}, onChange) => {
    const {config = {}, ...rest} = jsx;
    // onChange处理
    RxAnt.onChange(jsx, onChange);
    const options = RxAnt.toOptions(reference, config);
    return (
        <Select {...rest}>
            {options.map(item => (
                <Select.Option key={item.key} value={item.value}>
                    {item.label}
                </Select.Option>
            ))}
        </Select>
    )
};
const aiCheckbox = (reference, jsx = {}, onChange) => {
    const {config, ...rest} = jsx;
    // 构造Checkbox专用选项
    RxAnt.onChange(rest, onChange);
    const options = RxAnt.toOptions(reference, config);
    return (config) ?
        <Checkbox.Group {...rest} options={options}/> :
        <Checkbox {...jsx}/>
};
const aiTextArea = (reference, jsx = {}) => {
    return (<Input.TextArea {...jsx}/>)
};
const aiDatePicker = (reference, jsx = {}, onChange) => {
    // DisabledDate
    RxAnt.onDisabledDate(jsx);
    // onChange处理
    RxAnt.onChange(jsx, onChange);
    return (<DatePicker {...jsx}/>);
};

const ai2Select = (onChange) => (reference, jsx = {}) => {
    const fnChange = onChange.apply(null, [reference]);
    return aiSelect(reference, jsx, fnChange);
};

const ai2TreeSelect = (onChange) => (reference, jsx = {}) => {
    const fnChange = onChange.apply(null, [reference]);
    return aiTreeSelect(reference, jsx, fnChange);
};

const ai2DatePicker = (onChange) => (reference, jsx = {}) => {
    const fnChange = onChange.apply(null, [reference]);
    return aiDatePicker(reference, jsx, fnChange);
};

const ai2Checkbox = (onChange) => (reference, jsx = {}) => {
    const fnChange = onChange.apply(null, [reference]);
    return aiCheckbox(reference, jsx, fnChange);
};

const ai2InputNumber = (onChange) => (reference, jsx = {}) => {
    const fnChange = onChange.apply(null, [reference]);
    return aiInputNumber(reference, jsx, fnChange);
};

const ai2ListSelector = (mockData = {}) => (reference, jsx = {}) => {
    return (<ListSelector reference={reference} mock={mockData} {...jsx}/>)
};

const aiConfirm = (reference, onOk, ...path) => {
    // 构造窗口配置
    const config = RxAnt.toDialogConfig.apply(null,
        [reference].concat(path));
    Modal.confirm({...config, onOk});
};
export default {
    // 对话框专用
    aiConfirm,
    // 直接组件
    aiSelect,
    aiInput,
    aiInputNumber,
    aiCheckbox,
    aiTextArea,
    aiTreeSelect,
    aiDatePicker,
    // 二阶函数
    ai2Checkbox,
    ai2DatePicker,
    ai2InputNumber,
    ai2TreeSelect,
    ai2Select,
    ai2ListSelector
}