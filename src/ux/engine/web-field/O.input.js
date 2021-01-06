import R from '../../engine/expression';
import Abs from '../../abyss';
import React from 'react';
import {Input} from 'antd';

const aiInput = (reference, jsx = {}, onChange) => {
    jsx = Abs.clone(jsx);
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
    return (<Input {...jsx}/>);
};

const ai2Input = (onChange) => (reference, jsx = {}) => {
    const fnChange = onChange.apply(null, [reference]);
    return aiInput(reference, jsx, fnChange);
};

export default {
    aiInput,
    ai2Input,
}