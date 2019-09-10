import Aid from "./I.fix";
import {Checkbox} from "antd";
import React from "react";
import R from '../expression';

const aiCheckbox = (reference, jsx = {}, onChange) => {
    const {config} = jsx;
    // 处理onChange，解决rest为 {}时引起的参数Bug
    const rest = Aid.fixAttrs(jsx);
    // 构造Checkbox专用选项
    R.Ant.onChange(rest, onChange);
    // ReadOnly处理，第二参用于处理disabled的情况，非input使用
    R.Ant.onReadOnly(rest, true, reference);
    const options = R.Ant.toOptions(reference, config);
    return (config) ?
        <Checkbox.Group {...rest} options={options}/> :
        <Checkbox disabled={rest.disabled}/>;
};

const ai2Checkbox = (onChange) => (reference, jsx = {}) => {
    const fnChange = onChange.apply(null, [reference]);
    return aiCheckbox(reference, jsx, fnChange);
};
export default {
    aiCheckbox,
    ai2Checkbox,
}