import __Yo from './field.__.fn.yo.configuration';
import React from 'react';
import {Input} from "antd";
import {_Ant} from 'zo';

// import TextArea from './O.textarea';
const aiTextArea = (reference, jsx = {}) => {
    // ReadOnly处理
    _Ant.onReadOnly(jsx, false, reference);
    // Class
    __Yo.yoCssAdjust(jsx, 'textarea');
    return (<Input.TextArea {...jsx}/>);
}
export default {
    aiTextArea,
}