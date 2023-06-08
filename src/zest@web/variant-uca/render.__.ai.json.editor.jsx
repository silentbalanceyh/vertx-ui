import {_Ant} from 'zo';
import React from 'react';
import JsonEditor from "./JsonEditor/UI";

// import JsonEditor from './O.editor.json';
const aiJsonEditor = (reference, jsx = {}, onChange) => {
    // onChange处理
    _Ant.onChange(jsx, onChange);
    return (<JsonEditor {...jsx} reference={reference}/>)
};
export default {
    aiJsonEditor,
}