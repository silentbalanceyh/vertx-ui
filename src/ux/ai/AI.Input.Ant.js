import RxAnt from "./AI.RxAnt";
import {Checkbox, DatePicker, Input, InputNumber, Radio, Select, TimePicker, TreeSelect} from "antd";
import JsxOp from "../_internal/Ux.Jsx.Op";
import React from "react";
import {FileUpload, MagicView, TimeRanger} from "web";

const aiInput = (reference, jsx = {}, onChange) => {
    // 处理prefix属性
    RxAnt.onPrefix(jsx);
    // 处理PlaceHolder
    RxAnt.onPlaceHolder(jsx);
    // 处理addonAfter
    RxAnt.onAddonAfter(jsx);
    // onChange处理
    RxAnt.onChange(jsx, onChange);
    return (<Input {...jsx}/>)
};

const aiTreeSelect = (reference, jsx = {}, onChange) => {
    const {config = {}, ...rest} = jsx;
    // 处理TreeSelect
    const data = RxAnt.toTreeOptions(reference, config);
    // 处理onChange
    RxAnt.onChange(rest, onChange);
    return (<TreeSelect treeData={data} {...rest}/>)
};

const aiInputNumber = (reference, jsx = {}, onChange) => {
    // onChange处理
    RxAnt.onChange(jsx, onChange);
    return (<InputNumber {...jsx}/>)
};
const aiSelect = (reference, jsx = {}, onChange) => {
    const {config = {}, filter, ...rest} = jsx;
    // onChange处理
    RxAnt.onChange(rest, onChange);
    const options = RxAnt.toOptions(reference, config, filter);
    return (
        <Select {...rest}>
            {options.map(item => (
                <Select.Option key={item.key} value={item.value}>
                    {item.label}
                </Select.Option>
            ))}
        </Select>
    )
};
const aiFileUpload = (reference, jsx = {}, onChange) => {
    RxAnt.onChange(jsx, onChange);
    return (<FileUpload {...jsx}/>)
};
const aiTimeRanger = (reference, jsx = {}, onChange) => {
    RxAnt.onChange(jsx, onChange);
    return (<TimeRanger {...jsx}/>)
};
const aiRadio = (reference, jsx = {}, onChange) => {
    const {config = {}, ...rest} = jsx;
    // onChange处理
    RxAnt.onChange(rest, onChange);
    const options = RxAnt.toOptions(reference, config);
    return (
        <Radio.Group {...rest}>
            {options.map(item => (
                <Radio key={item.key} style={item.style ? item.style : {}}
                       value={item.hasOwnProperty('value') ? item.value : item.key}>
                    {item.label}
                </Radio>
            ))}
        </Radio.Group>
    )
};
const aiCheckbox = (reference, jsx = {}, onChange) => {
    const {config, ...rest} = jsx;
    // 构造Checkbox专用选项
    RxAnt.onChange(rest, onChange);
    const options = RxAnt.toOptions(reference, config);
    return (config) ?
        <Checkbox.Group {...rest} options={options}/> :
        <Checkbox {...rest}/>
};
const aiTextArea = (reference, jsx = {}) => {
    return (<Input.TextArea {...jsx}/>)
};
const aiDatePicker = (reference, jsx = {}, onChange) => {
    // DisabledDate
    RxAnt.onDisabledDate(jsx);
    // onChange处理
    RxAnt.onChange(jsx, onChange);
    return (<DatePicker {...jsx} className={"rx-readonly"}/>);
};

const aiAction = (reference, jsx = {}) => {
    if (jsx.buttons) {
        // submit + reset双按钮专用生成
        // E.fxInfo(true, 10076, "optionJsx.buttons");
        return JsxOp.rtNorm(reference, jsx);
    } else if (jsx.hasOwnProperty("bind")) {
        // 多个按钮
        // E.fxInfo(true, 10076, "optionJsx.bind");
        return JsxOp.rtDialog(reference, jsx);
    } else {
        // 专用Bind按钮处理
        // E.fxInfo(true, 10076, "DEFAULT");
        return JsxOp.rtBind(reference, !jsx.hidden)
    }
};

const aiTimePicker = (reference, jsx = {}, onChange) => {
    RxAnt.onChange(jsx, onChange);
    return (<TimePicker {...jsx}/>)
};
const aiMagic = (reference, jsx = {}) => {
    const {config = {}, ...rest} = jsx;
    if (config.items) {
        config.items = RxAnt.toOptions(reference, config);
    }
    return (<MagicView {...rest} config={config}/>)
};
export default {
    // Label专用组件
    aiMagic,
    // 直接组件
    aiSelect,
    aiInput,
    aiInputNumber,
    aiFileUpload,
    aiCheckbox,
    aiRadio,
    aiTextArea,
    aiTreeSelect,
    aiDatePicker,
    aiTimePicker,
    aiTimeRanger,
    aiAction,
}