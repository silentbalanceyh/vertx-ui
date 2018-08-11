import React from 'react';
import {Modal} from 'antd';
import {ListSelector} from "web";
import RxAnt from './AI.RxAnt'
import RxInput from './AI.Input.Ant';
import RxDatum from './AI.Input.Datum';

const ai2Radio = (onChange) => (reference, jsx = {}) => {
    const fnChange = onChange.apply(null, [reference]);
    return RxInput.aiRadio(reference, jsx, fnChange);
};

const ai2Select = (onChange) => (reference, jsx = {}) => {
    const fnChange = onChange.apply(null, [reference]);
    return RxInput.aiSelect(reference, jsx, fnChange);
};

const ai2TreeSelect = (onChange) => (reference, jsx = {}) => {
    const fnChange = onChange.apply(null, [reference]);
    return RxInput.aiTreeSelect(reference, jsx, fnChange);
};

const ai2DatePicker = (onChange) => (reference, jsx = {}) => {
    const fnChange = onChange.apply(null, [reference]);
    return RxInput.aiDatePicker(reference, jsx, fnChange);
};

const ai2Checkbox = (onChange) => (reference, jsx = {}) => {
    const fnChange = onChange.apply(null, [reference]);
    return RxInput.aiCheckbox(reference, jsx, fnChange);
};

const ai2InputNumber = (onChange) => (reference, jsx = {}) => {
    const fnChange = onChange.apply(null, [reference]);
    return RxInput.aiInputNumber(reference, jsx, fnChange);
};
const ai2DatumCascade = (onChange) => (reference, jsx = {}) => {
    const fnChange = onChange.apply(null, [reference]);
    return RxDatum.aiDatumCascade(reference, jsx, fnChange)
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
    ...RxInput,
    // 绑定组件专用
    ...RxDatum,
    // 二阶组件，带onChange事件的组件
    ai2Checkbox,
    ai2DatePicker,
    ai2InputNumber,
    ai2TreeSelect,
    ai2Select,
    ai2Radio,
    ai2ListSelector,
    // 绑定组件二阶
    ai2DatumCascade
}