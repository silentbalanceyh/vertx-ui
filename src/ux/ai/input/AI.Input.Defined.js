import {
    DateVersion,
    FileUpload,
    ListSelector,
    MagicView,
    TableEditor,
    TimeRanger
} from "web";
import RxAnt from "../ant/AI.RxAnt";
import React from "react";

const aiMagic = (reference, jsx = {}) => {
    const {config = {}, ...rest} = jsx;
    config.items = RxAnt.toOptions(reference, config);
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
const aiListSelector = (reference, jsx = {}, onChange) => {
    RxAnt.onMockData(jsx, reference);
    return (<ListSelector {...jsx} reference={reference}
                          onChange={onChange}/>)
};
const aiTableEditor = (reference, jsx = {}, onChange) => {
    RxAnt.onMockData(jsx, reference);
    return (<TableEditor {...jsx} reference={reference}
                         onChange={onChange}/>)
};
export default {
    aiMagic,
    aiTimeRanger,
    aiFileUpload,
    aiDateVersion,
    aiListSelector,
    aiTableEditor,
}
