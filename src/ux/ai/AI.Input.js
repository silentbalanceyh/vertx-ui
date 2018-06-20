import React from 'react';
import {Checkbox, DatePicker, Input} from 'antd';
import {ListSelector} from "web";
import RxAnt from './AI.RxAnt'
import {Modal} from "antd/lib/index";

const aiInput = (reference, jsx = {}) => {
    // 处理prefix属性
    RxAnt.onPrefix(jsx);
    return (<Input {...jsx}/>)
};
const aiCheckbox = (reference, jsx = {}) => {
    const {$config = {}, ...rest} = jsx;
    // 构造Checkbox专用选项
    const options = RxAnt.toOptions(reference, $config);
    return <Checkbox.Group {...rest} options={options}/>
};
const aiTextArea = (reference, jsx = {}) => {
    return (<Input.TextArea {...jsx}/>)
};
const aiDatePicker = (reference, jsx = {}) => {
    return (<DatePicker {...jsx}/>);
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
    aiInput,
    aiCheckbox,
    aiTextArea,
    aiDatePicker,
    // 二阶函数
    ai2ListSelector
}