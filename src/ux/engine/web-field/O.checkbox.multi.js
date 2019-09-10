import {MultiCheckBox} from "web";
import React from "react";
import R from '../expression';

const aiMultiCheckBox = (reference, jsx = {}, onChange) => {
    R.Ant.onMockData(jsx, reference);
    R.Ant.onChange(jsx, onChange);
    const attrs = R.Ant.toConfig(reference, jsx, R.Ant.toOptions);
    return (<MultiCheckBox {...attrs}/>);
};
const ai2MultiCheckBox = (onChange) => (reference, jsx = {}) => {
    const fnChange = onChange.apply(null, [reference]);
    return aiMultiCheckBox(reference, jsx, fnChange);
};
export default {
    aiMultiCheckBox,
    ai2MultiCheckBox
}