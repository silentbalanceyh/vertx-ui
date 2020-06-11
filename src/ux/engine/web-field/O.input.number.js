import {InputNumber} from "antd";
import React from "react";
import R from '../expression';

const aiInputNumber = (reference, jsx = {}, onChange) => {
    // onChange处理
    R.Ant.onChange(jsx, onChange);
    // ReadOnly处理
    R.Ant.onReadOnly(jsx, false, reference);
    // numeric 配置
    const {numeric = {}, ...rest} = jsx;
    if (numeric.percent) {
        rest.formatter = value => `${value}%`;
        rest.parser = value => value.replace(`%`, '');
    } else {
        // 输入单位
        if (numeric.unit) {
            if (numeric.unitPosition) {
                // 右侧
                rest.formatter = value => `${value} ${numeric.unit}`;
            } else {
                // 左侧
                rest.formatter = value => `${numeric.unit} ${value}`;
            }
            rest.parser = value => value.replace(numeric.unit, "");
        }
    }
    return (<InputNumber {...rest}/>);
};

const ai2InputNumber = (onChange) => (reference, jsx = {}) => {
    const fnChange = onChange.apply(null, [reference]);
    return aiInputNumber(reference, jsx, fnChange);
};
export default {
    aiInputNumber,
    ai2InputNumber,
}