import React from 'react';
import {_Ant} from 'zo';
import {InputNumber} from "antd";

const aiInputNumber = (reference, jsx = {}, onChange) => {
    // onChange处理
    const {config = {}, depend} = jsx;
    _Ant.onChange(jsx, onChange, {
        reference,
        depend,
        config,
    });
    // ReadOnly处理
    _Ant.onReadOnly(jsx, false, reference);
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
export default {
    aiInputNumber,
}