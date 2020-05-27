import R from '../../engine/expression';
import React from 'react';
import {InputMulti} from 'web';

const aiInputMulti = (reference, jsx = {}, onChange) => {
    // 处理 onChange 处理
    R.Ant.onChange(jsx, onChange);
    // ReadOnly 处理
    R.Ant.onReadOnly(jsx, false, reference);
    return (<InputMulti {...jsx}/>)
}
const ai2InputMulti = (onChange) => (reference, jsx = {}) => {
    const fnChange = onChange.apply(null, [reference]);
    return aiInputMulti(reference, jsx, fnChange);
}

export default {
    aiInputMulti,
    ai2InputMulti,
}