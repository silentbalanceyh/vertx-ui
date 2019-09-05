import {ListSelector} from "web";
import React from "react";

const ai2ListSelector = (mockData = {}) => (reference, jsx = {}) =>
    (<ListSelector reference={reference} mock={mockData} {...jsx}/>);

const aiListSelector = (reference, jsx = {}) => {
    return (<ListSelector {...jsx} reference={reference}/>);
};
export default {
    ai2ListSelector,
    aiListSelector
}