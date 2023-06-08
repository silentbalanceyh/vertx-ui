import __Yo from './field.__.fn.yo.configuration';
import {Input} from "antd";
import React from 'react';

const aiPassword = (reference, jsx = {}, onChange) => {
    jsx = __Yo.yoInput(reference, jsx, onChange);
    if (jsx.readOnly) {
        jsx.visibilityToggle = false;   // 关闭切换按钮
    }
    return (<Input.Password {...jsx} autoComplete={"new-password"}/>);
};
export default {
    aiPassword
}