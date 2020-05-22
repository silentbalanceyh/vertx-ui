import R from '../../engine/expression';
import React from 'react';
import {Input} from 'antd';

const aiPassword = (reference, jsx = {}, onChange) => {
    // 处理prefix属性
    R.Ant.onPrefix(jsx);
    // 处理addonAfter
    R.Ant.onAddonAfter(jsx);
    // onChange处理
    R.Ant.onChange(jsx, onChange);
    // ReadOnly处理
    R.Ant.onReadOnly(jsx, false, reference);
    // 处理PlaceHolder，先处理readOnly
    R.Ant.onPlaceHolder(jsx);
    return (<Input.Password {...jsx} autoComplete={"new-password"}/>);
};

const ai2Password = (onChange) => (reference, jsx = {}) => {
    const fnChange = onChange.apply(null, [reference]);
    return aiPassword(reference, jsx, fnChange);
};

export default {
    aiPassword,
    ai2Password,
}