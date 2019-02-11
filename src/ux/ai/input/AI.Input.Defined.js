import {
    AddressSelector,
    BraftEditor,
    ChangeEditor,
    CheckedDate,
    CheckedInput,
    DateVersion,
    FileUpload,
    ListSelector,
    MagicView,
    MatrixEditor,
    MultiCheckBox,
    RichEditor,
    TableEditor,
    TableTransfer,
    TeamSelector,
    TimeRanger
} from "web";
import RxAnt from "../ant/AI.RxAnt";
import React from "react";

const aiMagic = (reference, jsx = {}) => {
    const {config = {}, ...rest} = jsx;
    const items = RxAnt.toOptions(reference, config);
    if (items && items.length > 0)
        config.items = items;
    return (<MagicView {...rest} config={config} reference={reference}/>);
};
const aiFileUpload = (reference, jsx = {}, onChange) => {
    RxAnt.onChange(jsx, onChange);
    // 是否支持多文件
    RxAnt.onMultiple(jsx);
    return (<FileUpload {...jsx} reference={reference}/>);
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
const aiMultiCheckBox = (reference, jsx = {}, onChange) => {
    RxAnt.onMockData(jsx, reference);
    RxAnt.onChange(jsx, onChange);
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
const aiMatrixEditor = (reference, jsx = {}) => {
    RxAnt.onMockData(jsx, reference);
    const attrs = RxAnt.toConfig(reference, jsx, RxAnt.toOptions);
    return (<MatrixEditor {...attrs}/>);
};
const aiRichEditor = (reference, jsx = {}, onChange) => {
    RxAnt.onChange(jsx, onChange);
    return (<RichEditor {...jsx} reference={reference}/>);
};
const aiTeamSelector = (reference, jsx = {}) => {
    RxAnt.onMockData(jsx, reference);
    return (<TeamSelector {...jsx} reference={reference}/>);
};

const aiBraftEditor = (reference, jsx = {}, onChange) => {
    RxAnt.onChange(jsx, onChange);
    return (<BraftEditor {...jsx} reference={reference}/>);
};
const aiAddressSelector = (reference, jsx = {}) => {
    return (<AddressSelector {...jsx} reference={reference}/>);
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
    aiTableEditor, // 表格编辑器「固定行不固定列」,
    aiMatrixEditor, // 矩阵编辑器「固定行并且固定列」
    aiCheckedDate, // 选择框 + 时间
    aiCheckedInput, // 选择框 + 输入框
    aiTeamSelector, // 团队选择框，1 Leader, N Member表格选择
    aiRichEditor, // 富客户端录入框
    aiBraftEditor, // 付客户端录入框
    aiAddressSelector, // 地址选择器
};
