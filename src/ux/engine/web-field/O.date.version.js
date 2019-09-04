import {DateVersion} from "web";
import React from "react";

const aiDateVersion = (reference, jsx = {}) => {
    // RxAnt.onChange(jsx, onChange);
    return (<DateVersion {...jsx}/>);
};

export default {
    aiDateVersion
}