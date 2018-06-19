import React from 'react';
import {Icon, Input} from 'antd';

const aiInput = (reference, jsx = {}) => {
    if ("object" === typeof jsx.prefix) {
        const {type, ...rest} = jsx.prefix;
        jsx.prefix = (
            <Icon type={type} {...rest}/>
        )
    }
    return (<Input {...jsx}/>)
};
export default {
    aiInput
}