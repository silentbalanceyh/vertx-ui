import __Yo from './field.__.fn.yo.configuration';
import React from 'react';
import ListSelector from "./ListSelector/UI";

const aiListSelector = (reference, jsx = {}) => {
    __Yo.yoCssAdjust(jsx, "selector-list");
    return (<ListSelector {...jsx} reference={reference}/>);
};
export default {
    aiListSelector,
}