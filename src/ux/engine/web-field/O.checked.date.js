import {CheckedDate} from "web";
import React from "react";
import R from '../expression';

const aiCheckedDate = (reference, jsx = {}) => {
    R.Ant.onMockData(jsx, reference);
    const attrs = R.Ant.toConfig(reference, jsx, R.Ant.toOptions);
    return (<CheckedDate {...attrs}/>);
};

export default {
    aiCheckedDate
}