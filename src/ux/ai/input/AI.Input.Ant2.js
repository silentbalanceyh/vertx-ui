import RxInput from "./AI.Input.Ant";
import RxDatum from "./AI.Input.Datum";
import RxDefine from './AI.Input.Defined';
import {AddressSelector, ListSelector} from "web";
import React from "react";

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
    return RxDatum.aiDatumCascade(reference, jsx, fnChange);
};

const ai2ListSelector = (mockData = {}) => (reference, jsx = {}) =>
    (<ListSelector reference={reference} mock={mockData} {...jsx}/>);
const ai2AddressSelector = (mockData = {}, onSelect) => (reference, jsx = {}) => {
    const fnChange = onSelect.apply(null, [reference]);
    return (<AddressSelector {...jsx} reference={reference} mock={mockData}
                             rxSelect={fnChange}/>);
};
const ai2MultiCheckBox = (onChange) => (reference, jsx = {}) => {
    const fnChange = onChange.apply(null, [reference]);
    return RxDefine.aiMultiCheckBox(reference, jsx, fnChange);
};
export default {
    // 二阶组件，带onChange事件的组件
    ai2Checkbox,
    ai2DatePicker,
    ai2InputNumber,
    ai2TreeSelect,
    ai2Select,
    ai2Radio,
    ai2ListSelector,
    ai2MultiCheckBox,
    // 地址选择器
    ai2AddressSelector,
    // 绑定组件二阶
    ai2DatumCascade
};