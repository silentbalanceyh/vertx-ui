import {_Ant} from 'zo';
import __Yo from './field.__.fn.yo.configuration';
import React from 'react';
import FileUpload from "./FileUpload/UI";
// import FileUpload from './O.file.upload';
const aiFileUpload = (reference, jsx = {}, onChange) => {
    _Ant.onChange(jsx, onChange);
    // 是否支持多文件
    _Ant.onMultiple(jsx);
    // ReadOnly 处理
    _Ant.onReadOnly(jsx, false, reference);
    __Yo.yoCssAdjust(jsx, "file-upload")
    return (<FileUpload {...jsx} reference={reference}/>);
};
export default {
    aiFileUpload,
}