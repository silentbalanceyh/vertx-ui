import {CheckedInput} from "web";
import React from "react";
import R from '../expression';

const aiCheckedInput = (reference, jsx = {}) => {
    R.Ant.onMockData(jsx, reference);
    const attrs = R.Ant.toConfig(reference, jsx, R.Ant.toOptions);
    return (<CheckedInput {...attrs}/>);
};

export default {
    aiCheckedInput,
}