import React from 'react';
import MatrixSelector from './MatrixSelector/UI';

const aiMatrixSelector = (reference, jsx = {}) => {
    return (<MatrixSelector {...jsx} reference={reference}/>);
};
export default {
    aiMatrixSelector,
}