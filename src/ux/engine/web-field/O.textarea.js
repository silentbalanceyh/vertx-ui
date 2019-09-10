import {Input} from "antd";
import React from "react";

const aiTextArea = (reference, jsx = {}) => {
    return (<Input.TextArea {...jsx}/>);
};
const ai2TextArea = (onChange) => (reference, jsx = {}) => {
    const fnChange = onChange.apply(null, [reference]);
    return aiTextArea(reference, jsx, fnChange);
};
export default {
    aiTextArea,
    ai2TextArea
}