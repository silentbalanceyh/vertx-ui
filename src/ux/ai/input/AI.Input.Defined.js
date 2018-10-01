import {DateVersion, FileUpload, MagicView, TimeRanger} from "web";
import RxAnt from "../ant/AI.RxAnt";
import React from "react";

const aiMagic = (reference, jsx = {}) => {
    const {config = {}, ...rest} = jsx;
    if (config.items) {
        config.items = RxAnt.toOptions(reference, config);
    }
    return (<MagicView {...rest} config={config} reference={reference}/>)
};
const aiTimeRanger = (reference, jsx = {}, onChange) => {
    RxAnt.onChange(jsx, onChange);
    return (<TimeRanger {...jsx}/>)
};
const aiFileUpload = (reference, jsx = {}, onChange) => {
    RxAnt.onChange(jsx, onChange);
    return (<FileUpload {...jsx}/>)
};
const aiDateVersion = (reference, jsx = {}, onChange) => {
    RxAnt.onChange(jsx, onChange);
    return (<DateVersion {...jsx}/>)
};
export default {
    aiMagic,
    aiTimeRanger,
    aiFileUpload,
    aiDateVersion
}
