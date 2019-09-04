import {TimePicker} from "antd";
import React from "react";
import R from '../expression';

const aiTimePicker = (reference, jsx = {}, onChange) => {
    R.Ant.onChange(jsx, onChange);
    return (<TimePicker {...jsx}/>);
};

export default {
    aiTimePicker,
}