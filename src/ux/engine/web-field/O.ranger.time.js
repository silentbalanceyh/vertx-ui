import {TimeRanger} from "web";
import React from "react";
import R from '../expression';

const aiTimeRanger = (reference, jsx = {}, onChange) => {
    R.Ant.onChange(jsx, onChange);
    return (<TimeRanger {...jsx}/>);
};
export default {
    aiTimeRanger
}