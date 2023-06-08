import {_Ant} from 'zo';
import React from 'react';
import InputArray from "./InputArray/UI";
//import InputArray from './O.input.array';
const aiInputMulti = (reference, jsx = {}, onChange) => {
    // 处理 onChange 处理
    _Ant.onChange(jsx, onChange);
    // ReadOnly 处理
    _Ant.onReadOnly(jsx, false, reference);
    return (<InputArray {...jsx} reference={reference}/>)
}
export default {
    aiInputMulti,
    aiInputArray: aiInputMulti,
}