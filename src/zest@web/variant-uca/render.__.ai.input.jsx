import __Yo from './field.__.fn.yo.configuration';
import React from 'react';
import {Input} from "antd";

const aiInput = (reference, jsx = {}, onChange) => {
    jsx = __Yo.yoInput(reference, jsx, onChange);
    return (<Input {...jsx}/>);
};
export default {
    aiInput
}