import {TableTransfer} from "web";
import React from "react";
import R from '../expression';

const aiTableTransfer = (reference, jsx = {}) => {
    R.Ant.onMockData(jsx, reference);
    const attrs = R.Ant.toConfig(reference, jsx, R.Ant.toDatum);
    return (<TableTransfer {...attrs} reference={reference}/>);
};

export default {
    aiTableTransfer,
}