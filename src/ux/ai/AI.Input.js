import React from 'react';
import {DatePicker, Icon, Input} from 'antd';
import {ListSelector} from "web";
import Ant from '../Ux.Ant'
import Prop from '../Ux.Prop'
import U from 'underscore'

const aiInput = (reference, jsx = {}) => {
    if ("object" === typeof jsx.prefix) {
        const {type, ...rest} = jsx.prefix;
        jsx.prefix = (
            <Icon type={type} {...rest}/>
        )
    }
    return (<Input {...jsx}/>)
};
const aiCheckbox = (reference, jsx = {}) => {
    const {$config = {}, ...rest} = jsx;
    // 优先使用items选项
    let options = [];
    if ($config.items) {
        options = $config.items;
    } else if ($config.datum) {
        const {source, key = "key", label = "label"} = $config.datum;
        if (source && "string" === typeof source) {
            const data = Prop.onDatum(reference, source);
            if (U.isArray(data)) {
                data.forEach(each => {
                    const option = {};
                    if (each[key]) {
                        option['value'] = each[key];
                        option['key'] = each[key];
                    }
                    if (each[label]) {
                        option['label'] = each[label];
                    }
                    options.push(option);
                })
            }
        }
    }
    return Ant.uiItemCheckbox(options, rest);
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
    aiCheckbox,
    aiTextArea,
    aiDatePicker,
    // 二阶函数
    ai2ListSelector
}