import {TableEditor} from "web";
import React from "react";
import R from '../expression';

const aiTableEditor = (reference, jsx = {}) => {
    R.Ant.onMockData(jsx, reference);
    return (<TableEditor {...jsx} reference={reference}/>);
};

export default {
    aiTableEditor,
}