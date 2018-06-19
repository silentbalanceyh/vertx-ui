import React from 'react';
import {DatePicker, Icon, Input} from 'antd';
import {ListSelector} from "web";

const aiInput = (reference, jsx = {}) => {
    if ("object" === typeof jsx.prefix) {
        const {type, ...rest} = jsx.prefix;
        jsx.prefix = (
            <Icon type={type} {...rest}/>
        )
    }
    return (<Input {...jsx}/>)
};
const aiTextArea = (reference, jsx = {}) => {
    return (<Input.TextArea {...jsx}/>)
};
const aiDatePicker = (reference, jsx = {}) => {
    return (<DatePicker {...jsx}/>);
};
const ai2ListSelector = (mockData = {}) => (reference, jsx = {}) => {
    return (<ListSelector reference={reference} mock={mockData} {...jsx}/>)
};
export default {
    aiInput,
    aiTextArea,
    aiDatePicker,
    // 二阶函数
    ai2ListSelector
}