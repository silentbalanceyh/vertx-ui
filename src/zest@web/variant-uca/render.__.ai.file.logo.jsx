import {_Ant} from 'zo';
import __Yo from './field.__.fn.yo.configuration';
import React from 'react';
import FileLogo from "./FileLogo/UI";

const aiFileLogo = (reference, jsx = {}, onChange) => {
    _Ant.onChange(jsx, onChange);
    // ReadOnly 处理
    _Ant.onReadOnly(jsx, false, reference);
    __Yo.yoCssAdjust(jsx, "file-upload")
    return (<FileLogo {...jsx} reference={reference}/>)
}
export default {
    aiFileLogo,
}