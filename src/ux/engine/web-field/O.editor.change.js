import {ChangeEditor} from "web";
import React from "react";
import R from '../expression';

const aiChangeEditor = (reference, jsx = {}) => {
    R.Ant.onMockData(jsx, reference);
    R.Ant.onFromTo(reference, jsx);
    const attrs = R.Ant.toConfig(reference, jsx, R.Ant.toOptions);
    return (<ChangeEditor {...attrs} reference={reference}/>);
};

export default {
    aiChangeEditor,
}