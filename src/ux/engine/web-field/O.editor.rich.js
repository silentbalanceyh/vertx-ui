import {BraftEditor} from "web";
import React from "react";
import R from '../expression';

/*const aiRichEditor = (reference, jsx = {}, onChange) => {
    R.Ant.onChange(jsx, onChange);
    return (<RichEditor {...jsx} reference={reference}/>);
};*/

const aiBraftEditor = (reference, jsx = {}, onChange) => {
    R.Ant.onChange(jsx, onChange);
    return (<BraftEditor {...jsx} reference={reference}/>);
};
export default {
    // aiRichEditor,
    aiBraftEditor,
}