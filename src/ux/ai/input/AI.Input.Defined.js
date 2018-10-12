import {
    ChangeEditor,
    CheckedDate,
    CheckedInput,
    DateVersion,
    FileUpload,
    ListSelector,
    MagicView,
    MultiCheckBox,
    TableEditor,
    TableTransfer,
    TimeRanger,
} from "web";
import RxAnt from "../ant/AI.RxAnt";
import React from "react";

const aiMagic = (reference, jsx = {}) => {
    const {config = {}, ...rest} = jsx;
    config.items = RxAnt.toOptions(reference, config);
    return (<MagicView {...rest} config={config} reference={reference}/>);
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
    const attrs = RxAnt.toConfig(reference, jsx, RxAnt.toOptions);
    return (<ChangeEditor {...attrs} reference={reference}/>);
};
const aiMultiCheckBox = (reference, jsx = {}) => {
    RxAnt.onMockData(jsx, reference);
    const attrs = RxAnt.toConfig(reference, jsx, RxAnt.toOptions);
    return (<MultiCheckBox {...attrs}/>);
};
const aiTableTransfer = (reference, jsx = {}) => {
    RxAnt.onMockData(jsx, reference);
    const attrs = RxAnt.toConfig(reference, jsx, RxAnt.toDatum);
    return (<TableTransfer {...attrs} reference={reference}/>);
};
const aiTimeRanger = (reference, jsx = {}, onChange) => {
    RxAnt.onChange(jsx, onChange);
    return (<TimeRanger {...jsx}/>);
};
const aiCheckedDate = (reference, jsx = {}) => {
    RxAnt.onMockData(jsx, reference);
    const attrs = RxAnt.toConfig(reference, jsx, RxAnt.toOptions);
    return (<CheckedDate {...attrs}/>);
};
const aiCheckedInput = (reference, jsx = {}) => {
    RxAnt.onMockData(jsx, reference);
    const attrs = RxAnt.toConfig(reference, jsx, RxAnt.toOptions);
    return (<CheckedInput {...attrs}/>);
};
/**
 * Uncaught TypeError:
 * ( intermediate value )(intermediate value)[action].apply is not a function
 * 自定义组件中不能传入onChange函数，这些函数会导致Form.create的内置封装出错，上边的异常
 * 会直接产生错误终端，所以这里不可调用：
 * RxAnt.onChange(jsx, onChange);
 */
export default {
    aiMagic,    // 魔法视图
    aiTimeRanger, // 00:00 ~ 00:00
    aiFileUpload, // 上传
    aiDateVersion, // 年、月、日、版本输入框
    aiListSelector, // 列表选择框
    aiChangeEditor, // 变更输入框
    aiMultiCheckBox, // 子母多选框
    aiTableTransfer, // 表格穿梭框
    aiTableEditor, // 表格编辑器,
    aiCheckedDate, // 选择框 + 时间
    aiCheckedInput, // 选择框 + 输入框
};
