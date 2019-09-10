import {MatrixEditor} from "web";
import React from "react";
import R from '../expression';

const aiMatrixEditor = (reference, jsx = {}) => {
    R.Ant.onMockData(jsx, reference);
    const attrs = R.Ant.toConfig(reference, jsx, R.Ant.toOptions);
    return (<MatrixEditor {...attrs}/>);
};

export default {
    aiMatrixEditor,
}