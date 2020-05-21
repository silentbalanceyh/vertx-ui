import {JsonEditor} from 'web';
import React from 'react';
import R from "../expression";

const aiJsonEditor = (reference, jsx = {}, onChange) => {
    // onChange处理
    R.Ant.onChange(jsx, onChange);
    return (<JsonEditor {...jsx} reference={reference}/>)
};

export default {
    aiJsonEditor
}