import {DatePicker} from "antd";
import React from "react";
import R from '../expression';

const aiDatePicker = (reference, jsx = {}, onChange) => {
    // DisabledDate
    R.Ant.onDisabledDate(jsx);
    // onChange处理
    R.Ant.onChange(jsx, onChange);
    // 处理readOnly
    R.Ant.onReadOnly(jsx, true, reference);
    return (<DatePicker {...jsx} className={"ux-readonly ux-date-picker"}/>);
};

const ai2DatePicker = (onChange) => (reference, jsx = {}) => {
    const fnChange = onChange.apply(null, [reference]);
    return aiDatePicker(reference, jsx, fnChange);
};
export default {
    aiDatePicker,
    ai2DatePicker,
}