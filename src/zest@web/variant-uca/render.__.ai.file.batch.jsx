import {_Ant} from 'zo';
import __Yo from './field.__.fn.yo.configuration';
import React from 'react';
import FileBatch from "./FileBatch/UI";

const aiFileBatch = (reference, jsx = {}, onChange) => {

    _Ant.onChange(jsx, onChange);

    _Ant.onReadOnly(jsx, false, reference);
    // 只有多文件上传才会触发的函数
    _Ant.onReduce(jsx, reference);
    __Yo.yoCssAdjust(jsx, "file-upload")
    return (<FileBatch {...jsx} reference={reference}/>);
}
export default {
    aiFileBatch,
}