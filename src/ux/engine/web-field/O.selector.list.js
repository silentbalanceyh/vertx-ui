import {ListSelector} from "web";
import React from "react";

const ai2ListSelector = (mockData = {}) => (reference, jsx = {}) =>
    (<ListSelector reference={reference} mock={mockData} {...jsx}/>);

export default {
    ai2ListSelector,
}