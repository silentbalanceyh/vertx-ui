import {InputNumber} from "antd";
import React from "react";
import R from '../expression';

const aiInputNumber = (reference, jsx = {}, onChange) => {
    // onChange处理
    R.Ant.onChange(jsx, onChange);
    return (<InputNumber {...jsx}/>);
};

const ai2InputNumber = (onChange) => (reference, jsx = {}) => {
    const fnChange = onChange.apply(null, [reference]);
    return aiInputNumber(reference, jsx, fnChange);
};
export default {
    aiInputNumber,
    ai2InputNumber,
}