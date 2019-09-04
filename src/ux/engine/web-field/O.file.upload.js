import {FileUpload} from "web";
import React from "react";
import R from '../expression';

const aiFileUpload = (reference, jsx = {}, onChange) => {
    R.Ant.onChange(jsx, onChange);
    // 是否支持多文件
    R.Ant.onMultiple(jsx);
    return (<FileUpload {...jsx} reference={reference}/>);
};
export default {
    aiFileUpload,
}