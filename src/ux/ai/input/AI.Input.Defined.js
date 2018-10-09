import {
    ChangeEditor,
    DateVersion,
    FileUpload,
    ListSelector,
    MagicView,
    MultiCheckBox,
    TableEditor,
    TimeRanger,
} from "web";
import RxAnt from "../ant/AI.RxAnt";
import React from "react";

const aiMagic = (reference, jsx = {}) => {
    const {config = {}, ...rest} = jsx;
    config.items = RxAnt.toOptions(reference, config);
    return (<MagicView {...rest} config={config} reference={reference}/>);
};
const aiTimeRanger = (reference, jsx = {}, onChange) => {
    RxAnt.onChange(jsx, onChange);
    return (<TimeRanger {...jsx}/>);
};
const aiFileUpload = (reference, jsx = {}, onChange) => {
    RxAnt.onChange(jsx, onChange);
    return (<FileUpload {...jsx}/>);
};
const aiDateVersion = (reference, jsx = {}) => {
    // RxAnt.onChange(jsx, onChange);
    return (<DateVersion {...jsx}/>);
};
const aiListSelector = (reference, jsx = {}) => {
    RxAnt.onMockData(jsx, reference);
    return (<ListSelector {...jsx} reference={reference}/>);
};
const aiTableEditor = (reference, jsx = {}) => {
    RxAnt.onMockData(jsx, reference);
    return (<TableEditor {...jsx} reference={reference}/>);
};
const aiChangeEditor = (reference, jsx = {}) => {
    RxAnt.onMockData(jsx, reference);
    RxAnt.onFromTo(reference, jsx);
    const {config = {}, ...rest} = jsx;
    config.source = RxAnt.toOptions(reference, config);
    const {source = [], ...extractd} = config;
    return (<ChangeEditor {...rest}
                          config={extractd}
                          source={source}
                          reference={reference}/>);
};
const aiMultiCheckBox = (reference, jsx = {}) => {
    RxAnt.onMockData(jsx, reference);
    const {config = {}} = jsx;
    const {datum, ...rest} = config;
    rest.source = RxAnt.toOptions(reference, {datum});
    const {source = [], ...left} = rest;
    return (<MultiCheckBox source={source} config={left}/>);
};
/**
 * Uncaught TypeError:
 * ( intermediate value )(intermediate value)[action].apply is not a function
 * 自定义组件中不能传入onChange函数，这些函数会导致Form.create的内置封装出错，上边的异常
 * 会直接产生错误终端，所以这里不可调用：
 * RxAnt.onChange(jsx, onChange);
 */
export default {
    aiMagic,
    aiTimeRanger,
    aiFileUpload,
    aiDateVersion,
    aiListSelector,
    aiTableEditor,
    aiChangeEditor,
    aiMultiCheckBox
};
