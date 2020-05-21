import {TableEditor} from "web";
import React from "react";
import R from "../expression";

const aiTableEditor = (reference, jsx = {}, onChange) => {
    // onChange处理
    R.Ant.onChange(jsx, onChange);
    return (<TableEditor {...jsx} reference={reference}/>);
};

export default {
    aiTableEditor,
}