import {MatrixSelector} from "web";
import React from "react";

const ai2MatrixSelector = (mockData = {}) => (reference, jsx = {}) =>
    (<MatrixSelector reference={reference} mock={mockData} {...jsx}/>);

const aiMatrixSelector = (reference, jsx = {}) => {
    return (<MatrixSelector {...jsx} reference={reference}/>);
};
export default {
    ai2MatrixSelector,
    aiMatrixSelector
}