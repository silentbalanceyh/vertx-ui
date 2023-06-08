import React from 'react';
import BraftEditor from "./BraftEditor/UI";
import {_Ant} from 'zo';
// import RichEditor from './O.editor.rich';
const aiBraftEditor = (reference, jsx = {}, onChange) => {
    _Ant.onChange(jsx, onChange);
    return (<BraftEditor {...jsx} reference={reference}/>);
};
export default {
    aiBraftEditor
}