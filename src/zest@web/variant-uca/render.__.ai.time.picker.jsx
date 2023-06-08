import React from 'react';
import {TimePicker} from "antd";
import {_Ant} from 'zo';

// import TimePicker from './O.picker.time';
const aiTimePicker = (reference, jsx = {}, onChange) => {
    const {config = {}, depend} = jsx;
    _Ant.onChange(jsx, onChange, {
        reference,
        depend,
        config,
    });
    return (<TimePicker {...jsx}/>);
}
export default {
    aiTimePicker,
}